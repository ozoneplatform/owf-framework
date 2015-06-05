package org.ozoneplatform.auditing.quartz.jobs;

import java.text.DateFormat;
import java.text.SimpleDateFormat
import java.util.Formatter.DateTime
import java.util.regex.Matcher
import java.util.regex.Pattern

import org.apache.log4j.Logger;
import org.quartz.Job
import org.quartz.JobExecutionContext
import org.quartz.JobExecutionException


public abstract class AbstractFileMovementJob implements Job{

	private static final Logger log = Logger.getLogger(AbstractFileMovementJob)
	
	public static DateFormat logDateFormatter = new SimpleDateFormat("yyyy-MM-dd")
	
	protected static Pattern pattern =  Pattern.compile("(?i)(owf-cef|marketplace-cef)(.+).log.(\\d{4}-\\d{2}-\\d{2})(.(\\d+))?")
	
	@Override
	public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {		
		if(isJobEnabled()){
			if(!isValidLocations()){
				log.error "Source '${this.getFromLocation()}' or destination '${this.getToLocation()}' are invalid directories."
				return
			}

			File[] files = new File(this.getFromLocation()).listFiles()
			int maxFileNbr = getMaxFileFromToday(files.collect{it.name})
			files.each{ file ->
				if(file.length() > 0 && isSweepableFile(file.getName(), maxFileNbr)){
					String newFileName = file.getName() + "." + new Date().time
					file.renameTo(new File(this.getToLocation(), newFileName));
					file.setReadable(true, false)
				}
			}
		}				
	}

	//This validates that the configuration directories exist and are valid
	protected boolean isValidLocations(){
		if(!this.getToLocation() || !this.getFromLocation())
			return false
		File source 	 = new File(this.getFromLocation())
		File destination = new File(this.getToLocation())
		
		if(!source.exists() || !destination.exists())
			return false
			
		return source.isDirectory() && destination.isDirectory()
	}
	
	//A sweepable file is one that either has a date of less than today or if its today has a .# of less than the max
	protected static boolean isSweepableFile(String fileName, int maxFileNbr){
		
		Matcher matcher = pattern.matcher(fileName)
		
		//If there is no match, then return false
		if(!matcher.matches())
			return false
		
		//There was a match so get the groups
		def groups      = matcher[0]
		def fileDate = logDateFormatter.parse(groups[3])
		def now 	 = logDateFormatter.parse(logDateFormatter.format(new Date()))
		
		//If the file date is before now we can sweep it
		if(fileDate.before(now)){
			return true
		}
		
		//If its after now for some reason leave it as it was intentionally put there
		if(fileDate.after(now)){
			return false
		}		
		
		//At this point we will have something like ".1" or ".8" so get the nbr part
		matcher = groups[4] =~ /(.)(\d+)/
		groups = matcher[0]
		
		//If its a match then it must be today so inspect the number part of the suffix
		def numberPart   	= groups[2] as int
		
		if(maxFileNbr == numberPart)
			return false
			
		numberPart < maxFileNbr
	}


	//This loops through file names and parses the number extention from the name
	//and returns the max in the list
	protected static int getMaxFileFromToday(def fileNames){
		def now = logDateFormatter.format(new Date())
		Pattern todaysPattern =  Pattern.compile("(?i)(owf-cef|marketplace-cef)(.+).log." + now + ".(\\d+)")
		int highestNumber = 1
		fileNames.each{ 
			def matcher = todaysPattern.matcher(it)
			if(matcher.matches()){
				def groups     = matcher[0]
				def numberPart = groups[3] as int
				if(numberPart > highestNumber){
					highestNumber = numberPart
				}
			}			
		}
		highestNumber
	}
	
	
	
	abstract String getFromLocation()
		
	
	abstract String getToLocation()
	
	
	abstract boolean isJobEnabled()
}
