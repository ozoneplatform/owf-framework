package com.studentsonly.grails.plugins.uiperformance.postprocess

import com.studentsonly.grails.plugins.uiperformance.Utils

/**
 * CSS tag post-processor.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class CssTagPostProcessor extends AbstractTagPostProcessor {

	List extensions = ['css']
	boolean gzip = true

	@Override
	String process(String html, request) {

		if (!Utils.getConfigBoolean('processCSS') || !Utils.isEnabled() || request.getParameter('debug')?.toBoolean()) {
			return expandBundle(html)
		}

		return super.process(html, request)
	}
}
