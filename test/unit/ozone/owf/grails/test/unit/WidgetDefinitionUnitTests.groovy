package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase
import org.codehaus.groovy.grails.validation.ConstrainedProperty
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.DomainMapping
import ozone.owf.grails.services.DomainMappingService


class WidgetDefinitionUnitTests extends GrailsUnitTestCase {

    def widgetDefinition

    protected void setUp() {
        super.setUp()
        mockDomain(WidgetDefinition)
        mockForConstraintsTests(WidgetDefinition)
		//mockDomain(DomainMapping)
		//mockForConstraintsTests(DomainMapping)
        widgetDefinition = new WidgetDefinition()
//		widgetDefinition.domainMappingService = new DomainMappingService()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void assertGuidInvalid() {
        TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX,
                     'widgetGuid',
                     widgetDefinition)
    }

    void testWidgetGuidRequired() {
        TestUtil.assertPropertyRequired('widgetGuid',widgetDefinition)
    }

    void testWidgetGuidNotHex() {
        widgetDefinition.widgetGuid = "3G2504E0-4F89-11D3-9A0C-0305E82C3301" //there is a G in there

        assertGuidInvalid()
    }

    void testWidgetGuidInvalidLength() {
        widgetDefinition.widgetGuid = "3F2504E0-4F89-11D3-9A0C-0305E82C330" //missing a digit on the end

        assertGuidInvalid()
    }

    void testWidgetGuidDashMisplaced() {
        widgetDefinition.widgetGuid = "3F2504E0-4F89-11D3-9A0C0305E-82C3301" //last hypen misplaced

        assertGuidInvalid()
    }

    void testWidgetGuidValid() {
        widgetDefinition.widgetGuid = "3F2504E0-4F89-11D3-9A0C-0305E82C3301"

        TestUtil.assertNoErrorOnProperty('widgetGuid',widgetDefinition, "WidgetGuid should be valid")
    }

    void testDisplayNameRequired() {
        TestUtil.assertPropertyRequired('displayName',widgetDefinition)
    }
/*
	void testDisplayNameCharactersWrong()
	{
		widgetDefinition.displayName = "\""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = "\\"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = """/"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = "#"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = "="
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = """{"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = """}"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = ":"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = ";"
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = ""","""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = """["""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
		widgetDefinition.displayName = """]"""
		TestUtil.assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, 'displayName', widgetDefinition)
	}
*/
    void testDisplayNameIsValid()
	{
		widgetDefinition.displayName = "\""
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = "\\"
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = """/"""
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = "#"
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = "="
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = """{"""
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = """}"""
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = ":"
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = ";"
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = ""","""
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = """["""
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = """]"""
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
		widgetDefinition.displayName = "Hello World 1234567890!@\$%^&*()_+-|?><`~."
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
	}

	void testDisplayNameEscapedIsValid()
	{
		widgetDefinition.displayName = "\\u5317\\u7F8E\\u4E2D\\u6587\\u5831\\u7D19"
		TestUtil.assertNoErrorOnProperty('displayName', widgetDefinition)
	}

    void testWidgetUrlRequired() {
        TestUtil.assertPropertyRequired('widgetUrl',widgetDefinition)
    }

    void testWidgetUrlSizeConstraints() {
        TestUtil.checkSizeConstraintProperty('widgetUrl',widgetDefinition, 2083)
    }

    void testimageUrlMediumRequired() {
        TestUtil.assertPropertyRequired('imageUrlMedium',widgetDefinition)
    }

    void testimageUrlMediumSizeConstraints() {
        TestUtil.checkSizeConstraintProperty('imageUrlMedium',widgetDefinition, 2083)
    }

    void testImageUrlSmallRequired() {
        TestUtil.assertPropertyRequired('imageUrlSmall',widgetDefinition)
    }

    void testImageUrlSmallSizeConstraints() {
        TestUtil.checkSizeConstraintProperty('imageUrlSmall',widgetDefinition, 2083)
    }

    void testHeightRequired() {
        TestUtil.assertPropertyRequired('height',widgetDefinition)
    }

	void testHeightSizeConstraints() {
		TestUtil.checkNumberSizeConstraintProperty('height', widgetDefinition, null, 0)
	}

    void testWidthRequired() {
    	TestUtil.assertPropertyRequired('width',widgetDefinition)
    }

	void testWidthSizeConstraints() {
		TestUtil.checkNumberSizeConstraintProperty('width', widgetDefinition, null, 0)
	}

}
