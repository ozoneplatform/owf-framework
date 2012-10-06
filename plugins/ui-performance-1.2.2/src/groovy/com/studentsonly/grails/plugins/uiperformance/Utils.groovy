package com.studentsonly.grails.plugins.uiperformance

import java.awt.Dimension
import javax.imageio.ImageIO
import javax.imageio.ImageReader
import javax.imageio.stream.ImageInputStream

import grails.util.GrailsUtil

import org.codehaus.groovy.grails.commons.ApplicationHolder as AH
import org.codehaus.groovy.grails.commons.ConfigurationHolder as CH
import org.codehaus.groovy.grails.commons.GrailsApplication

import org.springframework.util.AntPathMatcher

/**
 * Utility methods.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class Utils {

	private static final _exclusionMatcher = new AntPathMatcher()

	private static String _applicationVersion
	private static List _exclusions

	static final List<String> DEFAULT_IMAGE_EXTENSIONS = ['gif', 'jpg', 'png', 'ico']

	static Properties properties

	static {
		def stream = Thread.currentThread().contextClassLoader.getResourceAsStream(
				'uiperformance.properties')
		if (stream) {
			properties = new Properties()
			properties.load(stream)
			_applicationVersion = properties.getProperty('version')
		}

		def exclusions = CH.config?.uiperformance?.exclusions
		if (exclusions instanceof List) {
			_exclusions = exclusions
		}
		if (!_exclusions) {
			_exclusions = []
		}
		_exclusions << '**/CVS'
		_exclusions << '**/.svn'
	}

	private Utils() {
		// static only
	}

	/**
	 * Add in '__vXXX' where XXX is the current application version, unless the url is excluded
	 * by a configuration rule.
	 * @param url  the url
	 * @return  the url with version embedded
	 */
 	static String addVersion(String url) {

 		if (!isEnabled() || isExcluded(url)) {
 			return url
 		}

 		int index = url.lastIndexOf('.')
		return url.substring(0, index) + '__v' + _applicationVersion + url.substring(index)
 	}

	/**
	 * Get the current application version.
	 */
 	static String getApplicationVersion() {
 		return isEnabled() ? _applicationVersion : '' 
 	}

 	/**
 	 * Check if the path is excluded by a configuration rule.
 	 * @param relativePath  the path
 	 * @return <code>true</code> if the path matches one of the rules
 	 */
	static boolean isExcluded(String relativePath) {
		relativePath = fixRelativePath(relativePath)

		for (pattern in _exclusions) {
			if (_exclusionMatcher.match(pattern, relativePath)) {
				return true
			}
		}

		return false
	}

	private static String fixRelativePath(String relativePath) {
		int index = relativePath.indexOf('staging/')
		if (index == -1) {
			index = relativePath.indexOf('stage/')
		}

		if (index > -1) {
			index = relativePath.indexOf('/', index)
			relativePath = relativePath.substring(index + 1)
		}

		return relativePath.startsWith('/') ? relativePath.substring(1) : relativePath
	}

	/**
	 * Check if a given file src is included in a sprite bundle.
	 * @param src  the image src
	 * @return true if it's in a bundle
	 */
	static boolean isIncludedInSprite(String src) {
		for (entry in properties?.entrySet()) {
			if (entry.key.startsWith('sprite-')) {
				for (path in entry.value.split(',')) {
					if (src.endsWith(path) || path.endsWith(src)) {
						return true
					}
				}
			}
		}
		return false
	}

	/**
	 * Calculate an image's width and height.
	 * @param file  the image file
	 * @return  the dimensions
	 */
	static Dimension calculateImageDimension(File file) {

		String extension = file.name.substring(file.name.lastIndexOf('.') + 1)

		def readers = ImageIO.getImageReadersBySuffix(extension)
		ImageReader reader = null
		if (readers.hasNext()) {
			reader = readers.next()
		}

		if (!reader) {
			return null
		}

		try {
			byte[] bytes = file.readBytes()
			reader.setInput ImageIO.createImageInputStream(new ByteArrayInputStream(bytes)), true
			return new Dimension(reader.getWidth(0), reader.getHeight(0))
		}
		catch (IOException e) {
			e.printStackTrace()
			return null
		}
	}

	static boolean getConfigBoolean(String name, boolean defaultIfMissing = true) {
		def value = CH.config.uiperformance[name]
		return value instanceof Boolean ? value : defaultIfMissing
	}

	static def getConfigValue(String name, defaultIfMissing = null) {
		def value = CH.config.uiperformance[name]
		return value ?: defaultIfMissing
	}

	static boolean isEnabled() {
		return getConfigBoolean('enabled')
	}
}
