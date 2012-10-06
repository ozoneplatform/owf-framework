package com.studentsonly.grails.plugins.uiperformance.postprocess

import com.studentsonly.grails.plugins.uiperformance.Utils

/**
 * JavaScript tag post-processor.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class JsTagPostProcessor extends AbstractTagPostProcessor {

	List extensions = ['js']
	boolean gzip = true

	@Override
	String process(String html, request) {

		if (!Utils.getConfigBoolean('processJS') || !Utils.isEnabled() || request.getParameter('debug')?.toBoolean()) {
			return expandBundle(html)
		}

		return super.process(html, request)
	}
}
