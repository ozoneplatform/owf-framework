package com.studentsonly.grails.plugins.uiperformance.taglib

/**
 * Allows deferred declaration of JavaScript files and rendering of the tags at the end of the body
 * for faster page loads.
 *
 * Borrowed from <a href='http://www.nabble.com/Javascript-at-the-end-of-a-page-to18948092.html#a18962552'>here</a>
 * and modified a bit.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class DependantJavascriptTagLib {

	static namespace = 'p'

	def dependantJavascript = { attrs, body ->
		String js = attrs.javascript ?: body()
		def jsBlocks = request.jsBlocks
		if (!jsBlocks) {
			jsBlocks = []
			request.jsBlocks = jsBlocks
		}
		jsBlocks << js
	}

	def renderDependantJavascript = {
		for (js in request.jsBlocks) {
			out << js
			out << '\n'
		}
	}

	/**
	 * Adds to the dependant javascript queue.  If there is a src
	 * attribute, it will be identical to the <p:javascript> tag. 
	 * Otherwise, it will treat it as raw javascript and surround with
	 * <script> tags.
	 */
	def addJavascript = { attrs, body ->
		String javascript
		if (attrs.src) {
			javascript = p.javascript(attrs)
		}
		else {
			javascript = "<script type='text/javascript'>${body()}</script>"
		}
		p.dependantJavascript([javascript: javascript])
	}
}
