package org.ozoneplatform.auditing.format.cef


import java.util.HashMap
import java.util.Map
import java.util.Map.Entry

import org.ozoneplatform.auditing.format.cef.util.EscapedStringUtil

class Extension {

	//Event type
	public static final String EVENT_TYPE =  'cat'
	 
	//PKI DN....very important
	public static final String USER_ID = 'suid'
	
	//Source host (ie the users computer ip)
	public static final String SOURCE = 'shost'
	
	//How this event was triggered (ie user initiated, system generated)
	public static final String TRIGGER = 'requestMethod'
	
	//Status of the activity (Success/Fail)
    public static final String STATUS = 'outcome'
	
	
	//system id of the event		
	public static final String SYSTEM_EVENT_ID = 'deviceFacility'
	
	//Terse desc of event
	public static final String REASON = 'reason'
	
	//Semi colon delimited list of infomative messages (maybe params?)
	public static final String SYSTEM_NOTIFICATIONS = 'cs5'
	
	//Version of the system emitting the event
	public static final String SYSTEM_VERSION = 'act'

	
	//Full domain of the destination system machine the user accessed (ie the server)
	public static final String TRANSACTION_ID = 'deviceExternalId'
		
	//Full domain of the destination system machine the user accessed (ie the server)
	public static final String DESTINATION = 'dhost'
		
	//Destination host classification
	public static final String DESTINATION_CLS = 'cs4'
	
	
	//The time of the event in UTC format
	public static final String EVENT_DATE_TIME = 'start'
		
	//Overall Event Classification
	public static final String EVENT_CLS = 'cs3'
	

	/*
	 * "File" is just an object or resource per the 500-27 document
	 */
	//Name of the thing being accessed (file, URL, etc)
	public static final String PAYLOAD		 		= 'fname'
	public static final String PAYLOAD_CLS 			= 'filePermission'
	public static final String PAYLOAD_ID 			= 'fileId'
	public static final String PAYLOAD_SIZE 		= 'fsize'
	public static final String PAYLOAD_TYPE     	= 'fileType'
	public static final String OLD_PAYLOAD		 	= 'oldFileName'
	public static final String OLD_PAYLOAD_CLS 		= 'oldFilePermission'
	public static final String OLD_PAYLOAD_ID 		= 'oldFileId'
	public static final String OLD_PAYLOAD_SIZE 	= 'oldFileSize'
	public static final String OLD_PAYLOAD_TYPE     = 'oldFileType'
	
	
	/*
	 * Search fields
	 */
	public static final String SEARCH_MATCHES 		= 'msg'
	public static final String NUMBER_OF_MATCHES 	= 'cn1'
	public static final String SEARCH_TEXT 			= 'request'
	public static final String SEARCH_STYLE 		= 'requestClientApplication'
	public static final String IS_SPANNING 			= 'app'
	
	public static final String MEDIA_TYPE			= 'proto'
	
	public static final String UNKOWN_VALUE 		=  "UNKNOWN"
	
	public static final String UNKOWN_NUMBER_VALUE 	=  "-1"
	
	public static final int MAX_VALUE_LENGTH		= 	1023
	
	/** Holds the computed string output of the CEF Extension object */
	private final String asString

	/** Holds the field mapping */
	private final Map<String, String> fields

	private static String FIELD_DELIMITER = "="

	/**
	 * Create a new extension object using the provided map. All of the key/value pairs are checked
	 * to ensure they are valid.
	 */
	public Extension( final Map<String, String> extensionFields )  {

		// Use the # of pairs * 20 as an initial best-guess for the builder size
		final StringBuilder sb    = new StringBuilder( extensionFields.size() * 20 )
		Boolean             first = true

		fields = [:]
			
		 //Loop over all of the element pairs and add them to the string builder.
		for (Entry<String, String> entry : extensionFields.entrySet()) {
			if (first) {
				first = false
			} else {
				sb.append(" ")
			}
			sb.append( EscapedStringUtil.escapeExtensionKey(entry.getKey()))
			sb.append(FIELD_DELIMITER)
			
			def value 	= getDefaultValue(entry.getKey(), entry.getValue())
			value 		= trimFieldToMaxLength(value)
			sb.append(EscapedStringUtil.escapeExtensionValue(value))		
			
			fields[entry.getKey()] == value
		}



		asString = sb.toString()

	}

	private static String getDefaultValue(def key, def value){
		
		//If the key is a number field and the value is null return -1
		if(key == NUMBER_OF_MATCHES || key == PAYLOAD_SIZE || key == OLD_PAYLOAD_SIZE){
			if(value == null || value.toString().trim() == "")
				return UNKOWN_NUMBER_VALUE
		}
		//If we are here then thekey is not a number field so return Unknown if the value is null
		if(value == null)
			return UNKOWN_VALUE

		//If this is an empty map return unknown	
		if(value instanceof Map){
			def valueAsCollection = value as Map
			if(valueAsCollection.size() == 0){
				return UNKOWN_VALUE
			}
		}	

		//If this is an empty list return unknown
		if(value instanceof List){
			def valueAsCollection = value as List
			if(valueAsCollection.size() == 0){
				return UNKOWN_VALUE
			}
		}
			
		//If this is not a String return the toString value (for integers, dates, etc)				
		if(!(value instanceof String)){
			return value.toString()
		}
		
		//If this is a string but an empty string return unknown
		if(value.trim() == "")
			return UNKOWN_VALUE
			
		value								
	}
	
	protected static def trimFieldToMaxLength(def value){
		if(value == UNKOWN_NUMBER_VALUE || value == UNKOWN_VALUE)
			return value			
		if(!(value instanceof String)){
			return value
		}
		if(value && value.size() > MAX_VALUE_LENGTH){
			value = value[0..MAX_VALUE_LENGTH - 1]
		}
		value
	}
	
	public static String listToString(def collection){
		if(!collection)
			return ""
		StringBuffer b = new StringBuffer()
		def newList = collection.each {
			b.append(it).append(";")
		}
		try{
			return b.toString()[0..b.size()-2]
		}catch(ArrayIndexOutOfBoundsException aex){
			return ""	
		}	
	}
	

	@Override
	public String toString() {
		return asString
	}
	
}
