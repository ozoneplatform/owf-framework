package ozone.owf.grails.util

import java.text.SimpleDateFormat

import org.apache.commons.lang.time.FastDateFormat;

public class OWFDate {
	
	static FastDateFormat shortDateFormat = FastDateFormat.getInstance("MM/dd/yyyy hh:mm aa zzz");
	
	static String standardShortDateDisplay(def dateIn) {
		if(dateIn == null) {
			return ''
		}
		return shortDateFormat.format(dateIn)
	}

	/**
	 * Format the date using the universal time zone.
	 */
    static def format(date) {
    	if (date != null) {
    		def sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss 'Z'")
        	sdf.setTimeZone(TimeZone.getTimeZone("UTC"))
        	return sdf.format(date)
    	} else {
    		return "";
    	}
    }	
	
}
