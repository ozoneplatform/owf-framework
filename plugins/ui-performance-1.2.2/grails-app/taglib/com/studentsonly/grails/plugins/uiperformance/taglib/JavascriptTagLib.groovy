package com.studentsonly.grails.plugins.uiperformance.taglib

/**
 * Generates a &lt;script type='text/javascript' src='...'&gt;&lt;/script&gt; tag.
 * <p/>
 * The only required attribute is 'src', which is the relative path of the js
 * file without the .js extension ('/js/foo.js' would specify src='foo', '/js/foo/bar/z.js'
 * would specify src='foo/bar/z').
 * <p/>
 * 'plugin' is an optional attribute used if the source is in a plugin. 
 * <p/>
 * &lt;p:javascript src='foo' /&gt;
 * would generate this output:
 * &lt;script type='text/javascript' src='/js/foo.js'&gt;&lt;/script&gt;
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class JavascriptTagLib extends AbstractTaglib {

	static namespace = 'p'

	// dependency injection
	def jsTagPostProcessor

	/**
	 * Generates the tag.
	 */
	def javascript = { attrs ->

		if (!attrs.src) {
			throwTagError("Tag [javascript] is missing required attribute [src]")
		}

		String link = generateRelativePath('js', attrs.remove('src'), '.js',
				attrs.remove('plugin'), attrs.remove('absolute'))
		String html = "<script type='text/javascript' src='$link'${generateExtraAttributes(attrs)}></script>"

		if (jsTagPostProcessor) {
			html = jsTagPostProcessor.process(html, request)
		}

		out << html
	}
}
