package org.apache.log4j;

/*
 * Copyright (C) The Apache Software Foundation. All rights reserved.
 *
 * This software is published under the terms of the Apache Software
 * License version 1.1, a copy of which has been included with this
 * distribution in the LICENSE.APL file.
 */

import java.io.File;
import java.io.IOException;
import java.io.Writer;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.helpers.CountingQuietWriter;
import org.apache.log4j.helpers.LogLog;
import org.apache.log4j.helpers.OptionConverter;
import org.apache.log4j.spi.LoggingEvent;

/**
 *  <p>CompositeRollingAppender combines RollingFileAppender and DailyRollingFileAppender<br>
 *  It can function as either or do both at the same time (making size
 *  based rolling files like RollingFileAppender until a data/time boundary
 *  is crossed at which time it rolls all of those files as per the DailyRollingFileAppender)
 *  based on the setting for <code>rollingStyle</code>.<br>
 *  <br>
 *  To use CompositeRollingAppender to roll log files as they reach a certain
 *  size (like RollingFileAppender), set rollingStyle=1 (@see config.size)<br>
 *  To use CompositeRollingAppender to roll log files at certain time intervals
 *  (daily for example), set rollingStyle=2 and a datePattern (@see config.time)<br>
 *  To have CompositeRollingAppender roll log files at a certain size AND rename those
 *  according to time intervals, set rollingStyle=3 (@see config.composite)<br>
 *
 *  <p>A of few additional optional features have been added:<br>
 *  -- Attach date pattern for current log file (@see staticLogFileName)<br>
 *  -- Backup number increments for newer files (@see countDirection)<br>
 *  -- Infinite number of backups by file size (@see maxSizeRollBackups)<br>
 *  <br>
 *  <p>A few notes and warnings:  For large or infinite number of backups
 *  countDirection > 0 is highly recommended, with staticLogFileName = false if
 *  time based rolling is also used -- this will reduce the number of file renamings
 *  to few or none.  Changing staticLogFileName or countDirection without clearing
 *  the directory could have nasty side effects.  If Date/Time based rolling
 *  is enabled, CompositeRollingAppender will attempt to roll existing files
 *  in the directory without a date/time tag based on the last modified date
 *  of the base log files last modification.<br>
 *  <br>
 *  <p>A maximum number of backups based on date/time boundries would be nice
 *  but is not yet implemented.<br>
 *
 *  @author Kuki Szabolcs - implemented daily rollover and delete after one week
 *  @author Kevin Steppe
 *  @author Heinz Richter
 *  @author Eirik Lygre
 *  @author Ceki G&uuml;lc&uuml;
 */
public class CompositeRollingAppender extends FileAppender
{
    // The code assumes that the following 'time' constants are in a increasing
    // sequence.
    static final int TOP_OF_TROUBLE = -1;
    static final int TOP_OF_MINUTE = 0;
    static final int TOP_OF_HOUR = 1;
    static final int HALF_DAY = 2;
    static final int TOP_OF_DAY = 3;
    static final int TOP_OF_WEEK = 4;
    static final int TOP_OF_MONTH = 5;

    /** Style of rolling to use */
    static final int BY_SIZE = 1;
    static final int BY_DATE = 2;
    static final int BY_COMPOSITE = 3;

    //Not currently used
    static final String S_BY_SIZE = "Size";
    static final String S_BY_DATE = "Date";
    static final String S_BY_COMPOSITE = "Composite";

    /**
     The date pattern. By default, the pattern is set to
     "'.'yyyy-MM-dd" meaning daily rollover.
    */
    private String datePattern = "'.'yyyy-MM-dd";

    /**
     * after how many milliseconds should be the logs deleted on cleanup <br>
     * -1 means that the logs will not be deleted on clean-up (this is default)
     */
    private long dateExpireInterval = -1;

    /**	 The actual formatted filename that is currently being written to
         or will be the file transferred to on roll over
    	 (based on staticLogFileName). */
    private String scheduledFilename = null;

    /** The timestamp when we shall next recompute the filename. */
    private long nextCheck = System.currentTimeMillis() - 1;

    /** Holds date of last roll over */
    Date now = new Date();

    SimpleDateFormat sdf;

    /** Helper class to determine next rollover time */
    RollingCalendar rc = new RollingCalendar();

    /** Current period for roll overs */
    int checkPeriod = TOP_OF_TROUBLE;

    /**	 The default maximum file size is 10MB. */
    protected long maxFileSize = 10 * 1024 * 1024;

    /**	 There is zero backup files by default. */
    protected int maxSizeRollBackups = 0;
    /** How many sized based backups have been made so far */
    protected int curSizeRollBackups = 0;

    /** not yet implemented */
    protected int maxTimeRollBackups = -1;
    protected int curTimeRollBackups = 0;

    /** By default newer files have lower numbers. (countDirection < 0)
     *  ie. log.1 is most recent, log.5 is the 5th backup, etc...
     *  countDirection > 0 does the opposite ie.
     *  log.1 is the first backup made, log.5 is the 5th backup made, etc.
     *  For infinite backups use countDirection > 0 to reduce rollOver costs.
     */
    protected int countDirection = -1;

    /** Style of rolling to Use.  BY_SIZE (1), BY_DATE(2), BY COMPOSITE(3) */
    protected int rollingStyle = BY_COMPOSITE;
    protected boolean rollDate = true;
    protected boolean rollSize = true;

    /** By default file.log is always the current file.  Optionally
     *  file.log.yyyy-mm-dd for current formated datePattern can by the currently
     *  logging file (or file.log.curSizeRollBackup or even
     *  file.log.yyyy-mm-dd.curSizeRollBackup) This will make time based roll
     *  overs with a large number of backups much faster -- it won't have to
     *  rename all the backups!
     * 
     * true = file.log
     * false = file.log.curent formatig
     */
    protected boolean staticLogFileName = true;

    /** FileName provided in configuration.  Used for rolling properly */
    protected String baseFileName;

    /** The default constructor does nothing. */
    public CompositeRollingAppender()
    {
    }

    /**
     Instantiate a <code>CompositeRollingAppender</code> and open the
     file designated by <code>filename</code>. The opened filename will
     become the ouput destination for this appender.
    */
    public CompositeRollingAppender(
        Layout layout,
        String filename,
        String datePattern)
        throws IOException
    {
        this(layout, filename, datePattern, true);
    }

    /**
     Instantiate a CompositeRollingAppender and open the file designated by
     <code>filename</code>. The opened filename will become the ouput
     destination for this appender.
    
     <p>If the <code>append</code> parameter is true, the file will be
     appended to. Otherwise, the file desginated by
     <code>filename</code> will be truncated before being opened.
    */
    public CompositeRollingAppender(
        Layout layout,
        String filename,
        boolean append)
        throws IOException
    {
        super(layout, filename, append);
    }

    /**
     Instantiate a CompositeRollingAppender and open the file designated by
     <code>filename</code>. The opened filename will become the ouput
     destination for this appender.
    */
    public CompositeRollingAppender(
        Layout layout,
        String filename,
        String datePattern,
        boolean append)
        throws IOException
    {
        super(layout, filename, append);
        this.datePattern = datePattern;
        activateOptions();
    }
    /**
     Instantiate a CompositeRollingAppender and open the file designated by
     <code>filename</code>. The opened filename will become the output
     destination for this appender.
    
     <p>The file will be appended to.  DatePattern is default.
    */
    public CompositeRollingAppender(Layout layout, String filename)
        throws IOException
    {
        super(layout, filename);
    }

    /**
     The <b>DatePattern</b> takes a string in the same format as
     expected by {@link SimpleDateFormat}. This options determines the
     rollover schedule.
    */
    public void setDatePattern(String pattern)
    {
        datePattern = pattern;
    }

    /** Returns the value of the <b>DatePattern</b> option. */
    public String getDatePattern()
    {
        return datePattern;
    }

    /**
     * The default expire date is never.
     * 
     * Examples how to set:<br>
     * - by minutes (case insensitive)
     * <code>
     * log4j.appender.R.dateExpireInterval=2 m
     * log4j.appender.R.dateExpireInterval=2 min
     * log4j.appender.R.dateExpireInterval=2 minutes
     * </code>
     * 
     * - by hours (case insensitive)
     * <code>
     * log4j.appender.R.dateExpireInterval=2 h
     * log4j.appender.R.dateExpireInterval=2 hour
     * log4j.appender.R.dateExpireInterval=2 hours
     * </code>
     * 
     * - by days (case insensitive)
     * <code>
     * log4j.appender.R.dateExpireInterval=2 d
     * log4j.appender.R.dateExpireInterval=2 day
     * log4j.appender.R.dateExpireInterval=2 days
     * </code>
     * 
     * - by weeks (case insensitive)
     * <code>
     * log4j.appender.R.dateExpireInterval=2 w
     * log4j.appender.R.dateExpireInterval=2 week
     * log4j.appender.R.dateExpireInterval=2 weeks
     * </code>
     */
    public void setDateExpireInterval(String sInterval)
    {
        this.dateExpireInterval =
            toDateInterval(sInterval, this.dateExpireInterval);
    }

    public static long toDateInterval(String value, long lDefault)
    {
        if (value == null)
            return lDefault;
        final long F_lMinute = 60 * 1000;
        final long F_lHour = 60 * F_lMinute;
        final long F_lDay = 24 * F_lHour;
        final long F_lWeek = 7 * F_lDay;

        value = value.trim().toLowerCase();
        long multiplier = 60 * 1000; // minute        
        int index = value.length();

        /* 
         * this type of comparation is possbile because m, d, h, w 
         * (can not be found in the other time words)
         * what a luck!
         */
        if (value.endsWith("minutes")
            || value.endsWith("min")
            || value.endsWith("m"))
        {
            multiplier = F_lMinute;
            index = value.indexOf("m");
        }
        else if (
            value.endsWith("hours")
                || value.endsWith("hour")
                || value.endsWith("h"))
        {
            multiplier = F_lHour;
            index = value.indexOf("h");
        }
        else if (
            value.endsWith("days")
                || value.endsWith("day")
                || value.endsWith("d"))
        {
            multiplier = F_lDay;
            index = value.indexOf("d");
        }
        else if (
            value.endsWith("weeks")
                || value.endsWith("week")
                || value.endsWith("w"))
        {
            multiplier = F_lWeek;
            index = value.indexOf("w");
        }

        if (value != null)
        {
            String s = "";
            try
            {
                s = value.substring(0, index);
                return Long.valueOf(s.trim()).longValue() * multiplier;
            }
            catch (NumberFormatException e)
            {
                LogLog.error("[" + s + "] is not in proper int form.");
                LogLog.error("[" + value + "] not in expected format.", e);
            }
        }

        return lDefault;
    }

    /**
     * returns milliseconds (the interval in which the log should be kept)
     * <br>
     * -1 means that it will not expire.
     * 
     * @return milliseconds 
     */
    public long getDateExpireInterval_inMilliseconds()
    {
        return dateExpireInterval;
    }

    /**
     Returns the value of the <b>maxSizeRollBackups</b> option.
    */
    public int getMaxSizeRollBackups()
    {
        return maxSizeRollBackups;
    }

    /**
     Get the maximum size that the output file is allowed to reach
     before being rolled over to backup files.
    
     @since 1.1
    */
    public long getMaximumFileSize()
    {
        return maxFileSize;
    }

    /**
     <p>Set the maximum number of backup files to keep around based on file size.
    
     <p>The <b>MaxSizeRollBackups</b> option determines how many backup
     files are kept before the oldest is erased. This option takes
     an integer value. If set to zero, then there will be no
     backup files and the log file will be truncated when it reaches
     <code>MaxFileSize</code>.  If a negative number is supplied then
     no deletions will be made.  Note that this could result in
     very slow performance as a large number of files are rolled over unless
     {@link #setCountDirection} up is used.
    
     <p>The maximum applys to -each- time based group of files and -not- the total.
     Using a daily roll the maximum total files would be (#days run) * (maxSizeRollBackups)
    
    */
    public void setMaxSizeRollBackups(int maxBackups)
    {
        maxSizeRollBackups = maxBackups;        
    }

    /**
     Set the maximum size that the output file is allowed to reach
     before being rolled over to backup files.
    
     <p>In configuration files, the <b>MaxFileSize</b> option takes an
     long integer in the range 0 - 2^63. You can specify the value
     with the suffixes "KB", "MB" or "GB" so that the integer is
     interpreted being expressed respectively in kilobytes, megabytes
     or gigabytes. For example, the value "10KB" will be interpreted
     as 10240.
    */
    public void setMaxFileSize(String maxFileSize)
    {
        this.maxFileSize =
            OptionConverter.toFileSize(maxFileSize, this.maxFileSize + 1);
    }

    //    /**
    //     Set the maximum size that the output file is allowed to reach
    //     before being rolled over to backup files.
    //    
    //     <p>This method is equivalent to {@link #setMaxFileSize} except
    //     that it is required for differentiating the setter taking a
    //     <code>long</code> argument from the setter taking a
    //     <code>String</code> argument by the JavaBeans {@link
    //     java.beans.Introspector Introspector}.
    //    
    //     @see #setMaxFileSize(String)
    //    */
    //    public void setMaxFileSize(long maxFileSize)
    //    {
    //        this.maxFileSize = maxFileSize;
    //    }

    /**
     Set the maximum size that the output file is allowed to reach
     before being rolled over to backup files.
    
     <p>This method is equivalent to {@link #setMaxFileSize} except
     that it is required for differentiating the setter taking a
     <code>long</code> argument from the setter taking a
     <code>String</code> argument by the JavaBeans {@link
     java.beans.Introspector Introspector}.
    
     @see #setMaxFileSize(String)
    */
    public void setMaximumFileSize(long maxFileSize)
    {
        this.maxFileSize = maxFileSize;
    }

    protected void setQWForFiles(Writer writer)
    {
        qw = new CountingQuietWriter(writer, errorHandler);
    }

    //Taken verbatum from DailyRollingFileAppender
    int computeCheckPeriod()
    {
        RollingCalendar c = new RollingCalendar();
        // set sate to 1970-01-01 00:00:00 GMT
        Date epoch = new Date(0);
        if (datePattern != null)
        {
            for (int i = TOP_OF_MINUTE; i <= TOP_OF_MONTH; i++)
            {
                String r0 = sdf.format(epoch);
                c.setType(i);
                Date next = new Date(c.getNextCheckMillis(epoch));
                String r1 = sdf.format(next);
                //LogLog.debug("Type = "+i+", r0 = "+r0+", r1 = "+r1);
                if (r0 != null && r1 != null && !r0.equals(r1))
                {
                    return i;
                }
            }
        }
        return TOP_OF_TROUBLE; // Deliberately head for trouble...
    }

    //Now for the new stuff
    /**
     * Handles append time behavior for CompositeRollingAppender.  This checks
     * if a roll over either by date (checked first) or time (checked second)
     * is need and then appends to the file last.
    */
    protected void subAppend(LoggingEvent event)
    {
        if (rollDate)
        {
            long n = System.currentTimeMillis();
            if (n >= nextCheck)
            {
                now.setTime(n);
                nextCheck = rc.getNextCheckMillis(now);

                rollOverTime();
            }
        }

        if (rollSize)
        {
            if ((fileName != null)
                && ((CountingQuietWriter)qw).getCount() >= maxFileSize)
            {
                rollOverSize();
            }
        }

        super.subAppend(event);
    }

    public void setFile(String file)
    {
        baseFileName = file.trim();
        fileName = file.trim();
    }

    /**
     * Creates and opens the file for logging.  If <code>staticLogFileName</code>
     * is false then the fully qualified name is determined and used.
     */
    public synchronized void setFile(String fileName, boolean append)
        throws IOException
    {
        fileName = initFileName();

        super.setFile(
            fileName,
            super.fileAppend,
            super.bufferedIO,
            super.bufferSize);

        initCountingQuietWriter(fileName, append);
    }

    private void initCountingQuietWriter(String fileName, boolean append)
    {
        if (append)
        {
            File f = new File(fileName);
            ((CountingQuietWriter)qw).setCount(f.length());
        }
    }

    private String initFileName()
    {
        String fileName = baseFileName;
        this.scheduledFilename = baseFileName.trim() + sdf.format(now);
        if (!staticLogFileName)
        {
            fileName = this.scheduledFilename;
            if (countDirection > 0)
            {
                scheduledFilename =
                    fileName = fileName + '.' + (++curSizeRollBackups);
            }
        }
        return fileName;
    }

    public int getCountDirection()
    {
        return countDirection;
    }

    public void setCountDirection(int direction)
    {
        countDirection = direction;
    }

    public int getRollingStyle()
    {
        return rollingStyle;
    }

    public void setRollingStyle(int style)
    {
        rollingStyle = style;
        switch (rollingStyle)
        {
            case BY_SIZE :
                rollDate = false;
                rollSize = true;
                break;
            case BY_DATE :
                rollDate = true;
                rollSize = false;
                break;
            case BY_COMPOSITE :
                rollDate = true;
                rollSize = true;
                break;
            default :
                errorHandler.error(
                    "Invalid rolling Style, use 1 (by size only), 2 (by date only) or 3 (both)");
        }
    }

    /*
    	public void setRollingStyle(String style) {
    		if (style == S_BY_SIZE) {
    		    rollingStyle = BY_SIZE;
    		}
    		else if (style == S_BY_DATE) {
    		    rollingStyle = BY_DATE;
    		}
    		else if (style == S_BY_COMPOSITE) {
    			rollingStyle = BY_COMPOSITE;
    		}
    	}
    */

    public boolean getStaticLogFileName()
    {
        return staticLogFileName;
    }

    public void setStaticLogFileName(boolean s)
    {
        staticLogFileName = s;
    }

    public void setStaticLogFileName(String value)
    {
        setStaticLogFileName(OptionConverter.toBoolean(value, true));
    }

    /**
     *  Initializes based on exisiting conditions at time of <code>
     *  activateOptions</code>.  The following is done:<br>
     *  <br>
     *	A) determine curSizeRollBackups<br>
     *	B) determine curTimeRollBackups (not implemented)<br>
     *	C) initiates a roll over if needed for crossing a date boundary since
     *  the last run.
     */
    protected void existingInit()
    {
        curSizeRollBackups = 0;
        curTimeRollBackups = 0;

        //part A starts here
        //        String filter;
        //        if (staticLogFileName || !rollDate)
        //        {
        //            filter = baseFileName + ".*";
        //        }
        //        else
        //        {
        //            filter = scheduledFilename + ".*";
        //        }

        File fBaseFile = new File(baseFileName);
        String sBaseFileAbsolutePath = fBaseFile.getAbsolutePath();
        File fBaseParentFile = fBaseFile.getParentFile();

        if (fBaseParentFile == null)
            fBaseParentFile = new File(".");

        LogLog.debug(
            "existingInit: Searching for existing files in: "
                + fBaseParentFile);
        File[] files = fBaseParentFile.listFiles();

        if (files != null)
        {
            LogLog.debug(
                "existingInit: Found "
                    + files.length
                    + " file in directory: "
                    + fBaseParentFile.getAbsolutePath());

            for (int i = 0; i < files.length; i++)
            {
                File fCurrentFile = files[i];
                String sCurrentFileAbsolutePath =
                    fCurrentFile.getAbsolutePath();
                LogLog.debug(
                    "existingInit: files["
                        + i
                        + "] = "
                        + sCurrentFileAbsolutePath
                        + " baseFileName = "
                        + sBaseFileAbsolutePath);
                if (!sCurrentFileAbsolutePath
                    .startsWith(sBaseFileAbsolutePath))
                    continue;

                int index = sCurrentFileAbsolutePath.lastIndexOf(".");

                if (staticLogFileName)
                {
                    if (index != sBaseFileAbsolutePath.length())
                    {
                        //file is probably scheduledFilename + .x so I don't care
                        LogLog.debug(
                            "existingInit: Skiping from backup count: "
                                + fCurrentFile);
                        continue;
                    }
                    else
                    {
                        LogLog.debug(
                            "existingInit: Found in backup count: "
                                + fCurrentFile);
                    }
                }

                try
                {
                    int backup =
                        Integer.parseInt(
                            sCurrentFileAbsolutePath.substring(
                                index + 1,
                                sCurrentFileAbsolutePath.length()));

                    if (backup > curSizeRollBackups)
                    {
                        LogLog.debug(
                            "From file: "
                                + fCurrentFile
                                + " -> curSizeRollBackups set to: "
                                + backup);
                        curSizeRollBackups = backup;
                    }

                }
                catch (Exception e)
                {
                    //this happens when file.log -> file.log.yyyy-mm-dd which is normal
                    //when staticLogFileName == false
                    LogLog.debug(
                        "Encountered a backup file not ending in .x "
                            + fCurrentFile);
                }
            }
        }
        LogLog.debug("curSizeRollBackups starts at: " + curSizeRollBackups);
        //part A ends here

        //part B not yet implemented

        //part C
        if (staticLogFileName && rollDate)
        {
            File old = new File(baseFileName);
            if (old.exists())
            {
                Date last = new Date(old.lastModified());
                if (!(sdf.format(last).equals(sdf.format(now))))
                {
                    scheduledFilename = baseFileName + sdf.format(last);
                    LogLog.debug("Initial roll over to: " + scheduledFilename);
                    rollOverTime();
                }
            }
        }
        LogLog.debug(
            "curSizeRollBackups after rollOver at: " + curSizeRollBackups);
        //part C ends here

    }

    /**
     * Sets initial conditions including date/time roll over information, first check,
     * scheduledFilename, and calls <code>existingInit</code> to initialize
     * the current # of backups.
     */
    public void activateOptions()
    {
        LogLog.debug("version: 2003-09-10_19-37");
        //REMOVE removed rollDate from boolean to enable Alex's change
        if (datePattern != null)
        {
            now.setTime(System.currentTimeMillis());
            sdf = new SimpleDateFormat(datePattern);
            int type = computeCheckPeriod();
            //printPeriodicity(type);
            rc.setType(type);
            //next line added as this removes the name check in rollOver
            nextCheck = rc.getNextCheckMillis(now);
        }
        else
        {
            if (rollDate)
                LogLog.error(
                    "Either DatePattern or rollingStyle options are not set for ["
                        + name
                        + "].");
        }

        super.fileName = initFileName();
        LogLog.debug("super.fileName (1) = " + super.fileName);
        existingInit();
		LogLog.debug("super.fileName (2) = " + super.fileName);

        super.activateOptions();

        initCountingQuietWriter(fileName, super.fileAppend);
        LogLog.debug("options are activated");
        //        if (rollDate && fileName != null && scheduledFilename == null)
        //            scheduledFilename = fileName + sdf.format(now);
    }

    /**
     Rollover the file(s) to date/time tagged file(s).
     Opens the new file (through setFile) and resets curSizeRollBackups.
    */
    public void rollOverTime()
    {

        curTimeRollBackups++;

        // delete the old stuff here
        if (-1 < this.dateExpireInterval)
            deleteOldStuff();

        if (staticLogFileName)
        {
            /* Compute filename, but only if datePattern is specified */
            if (datePattern == null)
            {
                errorHandler.error("Missing DatePattern option in rollOver().");
                return;
            }

            //is the new file name equivalent to the 'current' one
            //something has gone wrong if we hit this -- we should only
            //roll over if the new file will be different from the old
            String dateFormat = sdf.format(now);
            if (scheduledFilename.equals(fileName + dateFormat))
            {
                errorHandler.error(
                    "Compare "
                        + scheduledFilename
                        + " : "
                        + fileName
                        + dateFormat);
                return;
            }

            // close current file, and rename it to datedFilename
            this.closeFile();

            //we may have to roll over a large number of backups here
            String from, to;
            for (int i = 1; i <= curSizeRollBackups; i++)
            {
                from = fileName + '.' + i;
                to = scheduledFilename + '.' + i;
                rollFile(from, to);
            }

            rollFile(fileName, scheduledFilename);
        }

        try
        {
            // This will also close the file. This is OK since multiple
            // close operations are safe.
            curSizeRollBackups = 0;
            //We're cleared out the old date and are ready for the new

            //new scheduled name
            scheduledFilename = fileName + sdf.format(now);
            this.setFile(baseFileName, false);
        }
        catch (IOException e)
        {
            errorHandler.error("setFile(" + fileName + ", false) call failed.");
        }

    }

    /**
     * 1. parse all files in the log directory.<br>
     * 2. for those that start with baseLogFileName try to parse the date
     * 	acording to date patern (sdf is allready set with it)<br>
     * 3. calculate a reference delete date acording to now and dateExpireInterval)
     * 4. delete all files which are dated older than this reference date
     */
    private void deleteOldStuff()
    {
        File fBaseFile = new File(baseFileName);
        File fBaseParentDirectory = fBaseFile.getParentFile();
        if (fBaseParentDirectory == null)
            fBaseParentDirectory = new File(".");
        Date dReferenceDate = new Date(now.getTime() - dateExpireInterval);

        LogLog.debug(
            "Searching for existing files in: " + fBaseParentDirectory);

        File[] files = fBaseParentDirectory.listFiles();

        if (files != null)
        {
            for (int i = 0; i < files.length; i++)
            {
                if (!files[i]
                    .getAbsolutePath()
                    .startsWith(fBaseFile.getAbsolutePath()))
                    continue;

                // until now iterated thorugh files just as before			
                detectOldFileAndDelete(fBaseFile, files[i], dReferenceDate);
            }
        }
    }

    private void detectOldFileAndDelete(
        File fBaseFile,
        File fCurrentFile,
        Date dReferenceDate)
    {
        String sNoBase =
            fCurrentFile.getAbsolutePath().substring(
                fBaseFile.getAbsolutePath().length());
        //                LogLog.debug("sNoBase = " + sNoBase);
        //				sNoBase = sNoBase.replaceAll("\\.", " ").trim();
        Date dFound = null;
        boolean bFound = true;
        try
        {
            dFound = sdf.parse(sNoBase);
            LogLog.debug(
                "detectOldFileAndDelete: date parsed from file: "
                    + fCurrentFile.getName());
        }
        catch (ParseException e)
        {
            LogLog.debug(
                "detectOldFileAndDelete: could not parse for date file: "
                    + fCurrentFile.getName());
            bFound = false;
        }

        if (bFound)
        {
            // "now" is set by rollOverTime before this point
            String sReferenceDate = sdf.format(dReferenceDate);
            String sFoundDate = sdf.format(dFound);

            if ((dReferenceDate.compareTo(dFound) > 0)
                && (false == sReferenceDate.equalsIgnoreCase(sFoundDate)))
            {
                // found time is old
                if (fCurrentFile.delete())
                    LogLog.debug(
                        "detectOldFileAndDelete: File was found too old and deleted: "
                            + fCurrentFile.getAbsolutePath());
                else
                    LogLog.debug(
                        "detectOldFileAndDelete: File was found too old but could not be deleted: "
                            + fCurrentFile.getAbsolutePath());
                LogLog.debug(
                    "detectOldFileAndDelete:     sFoundDate: " + sFoundDate);
                LogLog.debug(
                    "detectOldFileAndDelete: sReferenceDate: "
                        + sReferenceDate);
            }

        }

    }

    /** 
     *  Renames file <code>from</code> to file <code>to</code>.  It
     *  also checks for existence of target file and deletes if it does.
     */
    public static void rollFile(String from, String to)
    {
        File target = new File(to);
        if (target.exists())
        {
            LogLog.debug("deleting existing target file: " + target);
            target.delete();
        }

        File file = new File(from);
        if (file.renameTo(target))
            LogLog.debug(from + " -> " + to);
        else
            LogLog.debug("rename failed: " + from + " -> " + to);
    }

    /** Delete's the specified file if it exists */
    protected static void deleteFile(String fileName)
    {
        File file = new File(fileName);
        if (file.exists())
        {
            file.delete();
        }
    }

    /**
     Implements roll overs base on file size.
    
     <p>If the maximum number of size based backups is reached
     (<code>curSizeRollBackups == maxSizeRollBackups</code) then the oldest
     file is deleted -- it's index determined by the sign of countDirection.<br>
     If <code>countDirection</code> < 0, then files
     {<code>File.1</code>, ..., <code>File.curSizeRollBackups -1</code>}
     are renamed to {<code>File.2</code>, ...,
     <code>File.curSizeRollBackups</code>}.	 Moreover, <code>File</code> is
     renamed <code>File.1</code> and closed.<br>
    
     A new file is created to receive further log output.
    
     <p>If <code>maxSizeRollBackups</code> is equal to zero, then the
     <code>File</code> is truncated with no backup files created.
    
     <p>If <code>maxSizeRollBackups</code> < 0, then <code>File</code> is
     renamed if needed and no files are deleted.
    */

    // synchronization not necessary since doAppend is alreasy synched
    public void rollOverSize()
    {
        //        File file;
        LogLog.debug("rollOverSize called");
        this.closeFile(); // keep windows happy.

        LogLog.debug(
            "rolling over count=" + ((CountingQuietWriter)qw).getCount());
        LogLog.debug("maxSizeRollBackups = " + maxSizeRollBackups);
        LogLog.debug("curSizeRollBackups = " + curSizeRollBackups);
        LogLog.debug("countDirection = " + countDirection);

        // If maxBackups <= 0, then there is no file renaming to be done.
        if (maxSizeRollBackups != 0)
        {

            if (countDirection < 0)
            {
                // Delete the oldest file, to keep Windows happy.
                if (curSizeRollBackups == maxSizeRollBackups)
                {
                    deleteFile(fileName + '.' + maxSizeRollBackups);
                    curSizeRollBackups--;
                }

                // Map {(maxBackupIndex - 1), ..., 2, 1} to {maxBackupIndex, ..., 3, 2}
                for (int i = curSizeRollBackups; i >= 1; i--)
                {
                    rollFile((fileName + "." + i), (fileName + '.' + (i + 1)));
                }

                curSizeRollBackups++;
                // Rename fileName to fileName.1
                rollFile(fileName, fileName + ".1");

            } //REMOVE This code branching for Alexander Cerna's request
            else if (countDirection == 0)
            {
                //rollFile based on date pattern
                curSizeRollBackups++;
                now.setTime(System.currentTimeMillis());
                scheduledFilename = fileName + sdf.format(now);
                rollFile(fileName, scheduledFilename);
            }
            else
            { //countDirection > 0
                if (curSizeRollBackups >= maxSizeRollBackups
                    && maxSizeRollBackups > 0)
                {
                    //delete the first and keep counting up.
                    int oldestFileIndex =
                        curSizeRollBackups - maxSizeRollBackups + 1;
                    deleteFile(fileName + '.' + oldestFileIndex);
                }

                if (staticLogFileName)
                {
                    curSizeRollBackups++;
                    rollFile(fileName, fileName + '.' + curSizeRollBackups);
                }
            }
        }

        try
        {
            // This will also close the file. This is OK since multiple
            // close operations are safe.
            this.setFile(baseFileName, false);
        }
        catch (IOException e)
        {
            LogLog.error("setFile(" + fileName + ", false) call failed.", e);
        }
    }

}