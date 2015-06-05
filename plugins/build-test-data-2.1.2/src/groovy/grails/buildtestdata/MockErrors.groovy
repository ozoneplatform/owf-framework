package grails.buildtestdata

import org.springframework.validation.BeanPropertyBindingResult

/**
 * Modified version of the GrailsMockErrors class that we can't use
 * directly in build-test-data as GrailsMockErrors is part of a set of test
 * classes that aren't available in a war file in grails 2.0
 */
class MockErrors extends BeanPropertyBindingResult {

    static final ERROR_CODE_TABLE = Collections.unmodifiableMap([
        "blank":               "blank",
        "creditCard.invalid":  "creditCard",
        "email.invalid":       "email",
        "matches.invalid":     "matches",
        "max.exceeded":        "max",
        "maxSize.exceeded":    "maxSize",
        "min.notmet":          "min",
        "minSize.notmet":      "minSize",
        "not.inList":          "inList",
        "notEqual":            "notEqual",
        "nullable":            "nullable",
        "range.toobig":        "range",
        "range.toosmall":      "range",
        "size.toobig":         "size",
        "size.toosmall":       "size",
        "url.invalid":         "url",
        "validator.invalid":   "validator" ])

    MockErrors(instance) {
        super(instance, instance.getClass().name)
    }

    def propertyMissing(String name) {
        def code = getFieldError(name)?.code
        return ERROR_CODE_TABLE[code] ?: code
    }

    def isEmpty() {
        !hasErrors()
    }
}

