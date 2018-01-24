package ozone.owf.grails.domain

import spock.lang.Specification


class WidgetDefinitionSpec extends Specification
        implements DomainConstraintsUnitTest<WidgetDefinition> {

    void testWidgetGuidRequired() {
        expect:
        propertyIsRequired('widgetGuid')
    }

    void testWidgetGuidNotHex() {
        expect:
        propertyMatchesGuid('widgetGuid')
    }

    void testDisplayNameRequired() {
        expect:
        propertyIsRequired('displayName')
    }

    void testDisplayNameIsValid(String displayName) {
        expect:
        propertyValueIsValid('displayName', displayName)

        where:
        displayName << VALID_NAME_STRINGS
	}

    void testWidgetUrlRequired() {
        expect:
        propertyIsRequired('widgetUrl')
    }

    void testWidgetUrlSizeConstraints() {
        expect:
        propertyHasMaxSize('widgetUrl', 2083)
    }

    void testimageUrlMediumRequired() {
        expect:
        propertyIsRequired('imageUrlMedium')
    }

    void testimageUrlMediumSizeConstraints() {
        expect:
        propertyHasMaxSize('imageUrlMedium', 2083)
    }

    void testImageUrlSmallRequired() {
        expect:
        propertyIsRequired('imageUrlSmall')
    }

    void testImageUrlSmallSizeConstraints() {
        expect:
        propertyHasMaxSize('imageUrlSmall', 2083)
    }

    void testHeightRequired() {
        expect:
        propertyIsRequired('height')
    }

	void testHeightSizeConstraints() {
        expect:
        numberPropertyHasMinValue('height', 200)
	}

    void testWidthRequired() {
        expect:
        propertyIsRequired('width')
    }

	void testWidthSizeConstraints() {
        expect:
        numberPropertyHasMinValue('width', 200)
	}

}
