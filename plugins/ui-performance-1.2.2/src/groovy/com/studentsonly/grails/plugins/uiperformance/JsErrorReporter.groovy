package com.studentsonly.grails.plugins.uiperformance

import org.mozilla.javascript.ErrorReporter
import org.mozilla.javascript.EvaluatorException

/**
 * Error reported for Javascript problems during minification.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class JsErrorReporter implements ErrorReporter {

	void warning(String message, String sourceName, int line, String lineSource, int lineOffset) {
		if (line < 0) {
			System.err.println "\n[WARNING] $message"
		}
		else {
			System.err.println "\n[WARNING] ${line}:${lineOffset}:$message"
		}
	}

	void error(String message, String sourceName, int line, String lineSource, int lineOffset) {
		if (line < 0) {
			System.err.println "\n[ERROR] $message"
		}
		else {
			System.err.println "\n[ERROR] ${line}:${lineOffset}:$message in lineSource: $lineSource sourceName: $sourceName"
		}
	}

	EvaluatorException runtimeError(
			String message, String sourceName, int line, String lineSource, int lineOffset) {

		error(message, sourceName, line, lineSource, lineOffset)
		return new EvaluatorException(message)
	}
}
