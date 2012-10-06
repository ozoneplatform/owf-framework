package ozone.owf.grails.test.unit

import grails.test.GrailsUnitTestCase
import org.codehaus.groovy.grails.validation.ConstrainedProperty

class TestUtil extends GrailsUnitTestCase{

	protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    static void assertNoErrorOnProperty(property, domainEntity, message=null) {
        domainEntity.validate()
        assertNull message, domainEntity.errors?.getFieldError(property)
    }

    static void assertInitializedPropertyRequired(property, domainEntity, initalValue, message=null) {
        assertNotNull domainEntity.getProperty(property)
        assertEquals initalValue, domainEntity.getProperty(property)
        domainEntity.setProperty(property, null)
        assertPropertyRequired(property, domainEntity, message)
    }
    
    static void assertPropertyRequired(property, domainEntity, message=null) {
        assertNull domainEntity.getProperty(property)
        assertEqualsConstraintCode(ConstrainedProperty.NULLABLE_CONSTRAINT,
                     property,
                     domainEntity,
                     message)
    }

	static void assertPropertyMatchesGuidConstraints(property,domainEntity, message = null)
	{
		[
		"3G2504E0-4F89-11D3-9A0C-0305E82C3301", //there is a G in there
		"3F2504E0-4F89-11D3-9A0C-0305E82C330", //missing a digit on the end
		"3F2504E0-4F89-11D3-9A0C0305E-82C3301" //last hypen misplaced
		].each{assertGuidInvalid(property,domainEntity,it)}
		
		domainEntity.setProperty(property,"3F2504E0-4F89-11D3-9A0C-0305E82C3301")
		TestUtil.assertNoErrorOnProperty(property,domainEntity, message)
	}
	
	static void assertGuidInvalid(property, domainEntity, guidValue) {
        domainEntity.setProperty(property,guidValue)
		assertEqualsConstraintCode(ConstrainedProperty.MATCHES_CONSTRAINT + ConstrainedProperty.INVALID_SUFFIX, property,domainEntity)
    }

    static void assertEqualsConstraintCode(constraintCode, property, domainEntity, message=null) {
        domainEntity.validate()
        assertEquals message, constraintCode, domainEntity?.errors?.getFieldError(property)?.code
    }

	static void checkNumberSizeConstraintProperty(property, domainEntity, maxSize = null, minSize = null) {
        if (maxSize && minSize > maxSize)
            throw new RuntimeException("Minimum size must be below max size")

        if (minSize && maxSize) {
             //Test below minimum size
             domainEntity.setProperty(property,minSize-1)
             assertNumberTooSmall(property, domainEntity, "${property} should have failed with a size of ${minSize}, but did not.")

             //Test exactly minimum size
             domainEntity.setProperty(property, minSize)
             assertNoErrorOnProperty(property, domainEntity)

             //Test exactly max size
             domainEntity.setProperty(property, maxSize)
             assertNoErrorOnProperty(property, domainEntity)

             //Test above max size
             domainEntity.setProperty(property, (maxSize + 1))
             assertNumberTooLarge(property, domainEntity, "${property} should have failed with a size of ${maxSize}, but did not.")
        } else if (minSize) {
            //Test below minimum size
             domainEntity.setProperty(property, (minSize-1))
             assertNumberTooSmall(property, domainEntity, "${property} should have failed with a size of ${minSize}, but did not.")

             //Test exactly minimum size
             domainEntity.setProperty(property, (minSize))
             assertNoErrorOnProperty(property, domainEntity)
             
             //Test above min size
             domainEntity.setProperty(property, (minSize + 1))
             assertNoErrorOnProperty(property, domainEntity)
        } else if (maxSize) {
            //Test below max size
            domainEntity.setProperty(property, (maxSize-1))
            assertNoErrorOnProperty(property, domainEntity)
            
            //Test exactly max size
            domainEntity.setProperty(property, (maxSize))
            assertNoErrorOnProperty(property, domainEntity)

            //Test above max size
            domainEntity.setProperty(property, (maxSize + 1))
            assertNumberTooLarge(property, domainEntity, "${property} should have failed with a size of ${maxSize}, but did not.")
        }
	}

    static void checkSizeConstraintProperty(property, domainEntity, maxSize = null, minSize = null) {
        if (minSize && minSize < 0)
            throw new RuntimeException("Minimum size cannot be below zero")
            
        if (maxSize && minSize > maxSize)
            throw new RuntimeException("Minimum size must be below max size")

        if (minSize && maxSize) {
             //Test below minimum size
             domainEntity.setProperty(property, getStringOfLength(minSize-1))
             assertPropertyTooSmall(property, domainEntity, "${property} should have failed with a length of ${minSize}, but did not.")

             //Test exactly minimum size
             domainEntity.setProperty(property, getStringOfLength(minSize))
             assertNoErrorOnProperty(property, domainEntity)

             //Test exactly max size
             domainEntity.setProperty(property, getStringOfLength(maxSize))
             assertNoErrorOnProperty(property, domainEntity)

             //Test above max size
             domainEntity.setProperty(property, getStringOfLength(maxSize + 1))
             assertPropertyTooLarge(property, domainEntity, "${property} should have failed with a length of ${maxSize}, but did not.")
        } else if (minSize) {
            //Test below minimum size
             domainEntity.setProperty(property, getStringOfLength(minSize-1))
             assertPropertyTooSmall(property, domainEntity, "${property} should have failed with a length of ${minSize}, but did not.")

             //Test exactly minimum size
             domainEntity.setProperty(property, getStringOfLength(minSize))
             assertNoErrorOnProperty(property, domainEntity)
             
             //Test above min size
             domainEntity.setProperty(property, getStringOfLength(minSize + 1))
             assertNoErrorOnProperty(property, domainEntity)
        } else if (maxSize) {
            //Test below max size
            domainEntity.setProperty(property, getStringOfLength(maxSize-1))
            assertNoErrorOnProperty(property, domainEntity)
            
            //Test exactly max size
            domainEntity.setProperty(property, getStringOfLength(maxSize))
            assertNoErrorOnProperty(property, domainEntity)

            //Test above max size
            domainEntity.setProperty(property, getStringOfLength(maxSize + 1))
            assertPropertyTooLarge(property, domainEntity, "${property} should have failed with a length of ${maxSize}, but did not.")
        }
    }

	static void assertNumberTooLarge(property, domainEntity, message=null)
	{
		assertEqualsConstraintCode(ConstrainedProperty.MAX_CONSTRAINT + ConstrainedProperty.EXCEEDED_SUFFIX, 
                     property,
                     domainEntity,
                     message)
	}
	
	static void assertNumberTooSmall(property, domainEntity, message=null)
	{
			assertEqualsConstraintCode(ConstrainedProperty.MIN_CONSTRAINT + ConstrainedProperty.NOTMET_SUFFIX, 
	                     property,
	                     domainEntity,
	                     message)
	}
    

    static void assertPropertyTooLarge(property, domainEntity, message=null) {
        assertEqualsConstraintCode(ConstrainedProperty.MAX_SIZE_CONSTRAINT + ConstrainedProperty.EXCEEDED_SUFFIX, 
                     property,
                     domainEntity,
                     message)
    }

    static void assertPropertyTooSmall(property, domainEntity, message=null) {
      assertEqualsConstraintCode(ConstrainedProperty.MIN_SIZE_CONSTRAINT + ConstrainedProperty.EXCEEDED_SUFFIX, 
                     property,
                     domainEntity,
                     message)
    }

	//Changed to speed up method (previous was based on linear iterative time)
    static def getStringOfLength(number) {
    	char[] retValList = new char[number];
        StringBuffer retValBuff = new StringBuffer()
        retValBuff.append(retValList)
        def retVal = retValBuff.toString();
        retVal
    }
}
