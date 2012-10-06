package com.studentsonly.grails.plugins.uiperformance.postprocess

import com.studentsonly.grails.plugins.uiperformance.Utils

/**
 * Image tag post-processor.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class ImageTagPostProcessor extends AbstractTagPostProcessor {

	boolean gzip = false

	@Override
	String process(String html, request) {

		if (!Utils.getConfigBoolean('processImages') || !Utils.isEnabled() || request.getParameter('debug')?.toBoolean()) {
			return html
		}

		return super.process(html, request)
	}

	protected List getExtensions() {
		return Utils.getConfigValue('imageExtensions', Utils.DEFAULT_IMAGE_EXTENSIONS)
	}
}
