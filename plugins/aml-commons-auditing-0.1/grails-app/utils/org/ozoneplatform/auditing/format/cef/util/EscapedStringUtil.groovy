package org.ozoneplatform.auditing.format.cef.util
import java.util.regex.Matcher
import java.util.regex.Pattern

class EscapedStringUtil {

	//Pattern to detect white space
	static def WHITE_SPACE = '\\s'
	
	//Pattern to detect line returns
	static def LINE_RETURN = '[\r\n]'
	
	//Escape pattern for pipe
	static def ESCAPE_FIELD_PIPE_PATTERN = '([|\\\\])'

	//Escape pattern for =
	static def ESCAPE_EXTENSION_KEY_PATTERN = '=' 
	
	//Escape Pattern to detect returns, line spaces, or the equals sign in the extention string
	static def ESCAPE_EXTENSION_VALUE_PATTERN = '[=\r\n]'

	/**
	 * Every value in a CEF extension map must escape the = character and all newline characters (\r and \n) should be turned into their string equivalent.
	 */
	public static String escapeExtensionValue( def value ) {
		
		if (value == null) {
			return null
		}
		
		String valueStr = value.toString()
		
		Matcher matcher  =  (valueStr =~ '[=\r\n]')
		StringBuffer escapedStrBuf = new StringBuffer( valueStr.length() )

		while (matcher.find()) {
			char letter = matcher.group(0).charAt(0)
			String replacement
			switch (letter) {
				case '\r' :
					replacement = "\\\\r"
					break
	
				case '\n' :
					replacement = "\\\\n"
					break
	
				case '\\' :
					replacement = "\\\\\\\\"
					break
	
				default :
					replacement = "\\\\" + letter
			}

			matcher.appendReplacement( escapedStrBuf, replacement )
		}

		matcher.appendTail( escapedStrBuf )

		escapedStrBuf.toString()
	}


	/**
	 * Every key in a CEF extension map must escape the = character
	 */
	public static String escapeExtensionKey( String keyStr ){
		if (keyStr == null) {
			return null
		}

		if (keyStr =~ WHITE_SPACE) {
			keyStr = keyStr.replaceAll(WHITE_SPACE, "")
		}

		(keyStr =~ ESCAPE_EXTENSION_KEY_PATTERN).replaceAll( '\\\\=' )
	}
	

	/**
	 * Every field in a CEF string (minus the extension) must escape the pipe <code>("|")</code>
	 * character as well as the backslash <code>("\")</code>.
	 * <p>
	*/
	public static String escapeField( String fieldStr ) {
		if (fieldStr == null) {
			return null
		}
		if (!isValidField(fieldStr)) {
			return ""
		}
		(fieldStr =~ ESCAPE_FIELD_PIPE_PATTERN).replaceAll('\\\\|')
	}



	/**
	 * Tests if the provided string is a valid extension key string.
	 * <p>
	 * A field is not valid if it contains a whitespace character or is null
	 */
	public static boolean isValidExtensionKey(String extensionKeyStr ) {
		boolean isValid = true
		if (extensionKeyStr == null || extensionKeyStr =~ WHITE_SPACE) {
			isValid = false
		}		
		isValid
	}


	/**
	 * Tests if the provided string is a valid extension value string
	 * <p>
	 * Essentially everything is valid except for nulls
	 */
	public static boolean isValidExtensionValue(String extensionValueStr ) {
		extensionValueStr != null
	}


	/**
	 * Tests if the provided string is a valid field string.
	 * <p>
	 * A field is not valid if it contains a vertical newline character
	 */
	public static boolean isValidField( final String fieldStr ) {
		boolean isValid = true

		if (fieldStr == null || fieldStr =~ LINE_RETURN) {
			isValid = false
		}

		isValid
	}
	
}
