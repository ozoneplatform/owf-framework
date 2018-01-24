package ozone.owf.grails.domain

import grails.gorm.validation.ConstrainedProperty
import grails.testing.gorm.DomainUnitTest

import org.grails.datastore.gorm.GormValidateable


trait DomainConstraintsUnitTest<T extends GroovyObject & GormValidateable>
        extends DomainUnitTest<T> {

    static final List<String> VALID_NAME_STRINGS = [
            '"',
            '\\',
            """/""",
            '#',
            '=',
            """{""",
            """}""",
            ':',
            ';',
            """,""",
            """[""",
            """]""",
            "Hello World 1234567890!@\$%^&*()_+-|?><`~.",
            '\u5317\u7F8E\u4E2D\u6587\u5831\u7D19'
    ]

    void propertyIsValid(String propertyName) {
        assert domain.validate([propertyName])
        assert domain.errors.getFieldError(propertyName) == null
    }

    void propertyIsInvalid(String propertyName, String constraintCode) {
        assert !domain.validate([propertyName])
        assert domain.errors.getFieldError(propertyName).code == constraintCode
    }

    void propertyValueIsValid(String propertyName, Object propertyValue) {
        domain.setProperty(propertyName, propertyValue)
        propertyIsValid(propertyName)
    }

    void propertyValueIsInvalid(String propertyName, value, String constraintCode) {
        domain.setProperty(propertyName, value)
        propertyIsInvalid(propertyName, constraintCode)
    }

    void propertyIsRequired(String propertyName) {
        propertyIsInvalid(propertyName, ConstrainedProperty.NULLABLE_CONSTRAINT)
    }

    void initializedPropertyIsRequired(String propertyName, initialValue) {
        assert domain.getProperty(propertyName) != null
        assert domain.getProperty(propertyName) == initialValue

        domain.setProperty(propertyName, null)
        propertyIsRequired(propertyName)
    }

    void propertyMatchesGuid(String propertyName) {
        guidIsInvalid(propertyName, "3G2504E0-4F89-11D3-9A0C-0305E82C3301")
        guidIsInvalid(propertyName, "3F2504E0-4F89-11D3-9A0C-0305E82C330")
        guidIsInvalid(propertyName, "3F2504E0-4F89-11D3-9A0C0305E-82C3301")

        propertyValueIsValid(propertyName, "3F2504E0-4F89-11D3-9A0C-0305E82C3301")
    }

    void guidIsInvalid(String propertyName, String guidValue) {
        propertyValueIsInvalid(propertyName, guidValue, ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX)
    }

    void propertyHasMinSize(String propertyName, int minSize) {
        propertyValueIsTooSmall(propertyName, getStringOfLength(minSize - 1))
        propertyValueIsValid(propertyName, getStringOfLength(minSize))
        propertyValueIsValid(propertyName, getStringOfLength(minSize + 1))
    }

    void propertyHasMaxSize(String propertyName, int maxSize) {
        propertyValueIsValid(propertyName, getStringOfLength(maxSize - 1))
        propertyValueIsValid(propertyName, getStringOfLength(maxSize))
        propertyValueIsTooLarge(propertyName, getStringOfLength(maxSize + 1))
    }

    void propertyHasMinMaxSize(String propertyName, int minSize, int maxSize) {
        propertyValueIsTooSmall(propertyName, getStringOfLength(minSize - 1))
        propertyValueIsValid(propertyName, getStringOfLength(minSize))
        propertyValueIsValid(propertyName, getStringOfLength(maxSize))
        propertyValueIsTooLarge(propertyName, getStringOfLength(maxSize + 1))
    }

    void numberPropertyHasMinValue(String propertyName, int minValue) {
        numberPropertyIsTooSmall(propertyName, minValue - 1)
        propertyValueIsValid(propertyName, minValue)
        propertyValueIsValid(propertyName, minValue + 1)
    }

    void numberPropertyHasMaxValue(String propertyName, int maxValue) {
        propertyValueIsValid(propertyName, maxValue - 1)
        propertyValueIsValid(propertyName, maxValue)
        numberPropertyIsTooLarge(propertyName, maxValue + 1)
    }

    void numberPropertyHasMinMaxValue(String propertyName, int minValue, int maxValue) {
        numberPropertyIsTooSmall(propertyName, minValue - 1)
        propertyValueIsValid(propertyName, minValue)
        propertyValueIsValid(propertyName, maxValue)
        numberPropertyIsTooLarge(propertyName, maxValue + 1)
    }

    private static String getStringOfLength(int number) {
        'A' * number
    }

    void numberPropertyIsTooSmall(String propertyName, number) {
        propertyValueIsInvalid(propertyName, number, ConstrainedProperty.MIN_CONSTRAINT + ConstrainedProperty.NOTMET_SUFFIX)
    }

    void numberPropertyIsTooLarge(String propertyName, number) {
        propertyValueIsInvalid(propertyName, number, ConstrainedProperty.MAX_CONSTRAINT + ConstrainedProperty.EXCEEDED_SUFFIX)
    }

    void propertyValueIsTooSmall(String propertyName, value) {
        propertyValueIsInvalid(propertyName, value, ConstrainedProperty.MIN_SIZE_CONSTRAINT + ConstrainedProperty.EXCEEDED_SUFFIX)
    }

    void propertyValueIsTooLarge(String propertyName, value) {
        propertyValueIsInvalid(propertyName, value, ConstrainedProperty.MAX_SIZE_CONSTRAINT + ConstrainedProperty.EXCEEDED_SUFFIX)
    }

}
