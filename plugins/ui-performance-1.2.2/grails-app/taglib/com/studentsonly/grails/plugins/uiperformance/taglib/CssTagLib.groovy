package com.studentsonly.grails.plugins.uiperformance.taglib

/**
 * Generates a &lt;link&gt; tag for a css file.
 * <p/>
 * The only required attribute is 'name', which is the relative path of the css
 * file ('/css/foo.css' would specify name='foo', '/css/foo/bar/z.css'
 * would specify name='foo/bar/z').
 * <p/>
 * &lt;p:css name='main'/&gt;
 * would generate this output:
 * &lt;link rel='stylesheet' type='text/css' href='/yourapp/css/main.css' /&gt;
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class CssTagLib extends AbstractTaglib {

	static namespace = 'p'

	// dependency injection
	def cssTagPostProcessor

	/**
	 * Generates the css tag.
	 */
	def css = { attrs, body ->

		String name = attrs.remove('name')
		if (!name) {
			throwTagError("Tag [css] is missing required attribute [name]")
		}

		String rel = attrs.remove('rel') ?: 'stylesheet'
		String link = generateRelativePath('css', name, '.css',
				attrs.remove('plugin'), attrs.remove('absolute'))
		String html = "<link rel='$rel' type='text/css' href='$link'${generateExtraAttributes(attrs)} />"

		if (cssTagPostProcessor) {
 			html = cssTagPostProcessor.process(html, request)
 		}

 		out << html
	}
}
