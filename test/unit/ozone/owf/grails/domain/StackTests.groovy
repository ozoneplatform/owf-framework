package ozone.owf.grails.domain

import grails.test.*

class StackTests extends GrailsUnitTestCase {
    protected void setUp() {
        super.setUp()
    }

    protected void tearDown() {
        super.tearDown()
    }

    void testConstraints() {
        mockForConstraintsTests(Stack)
        
        def s201 = "", s2084 = ""
        
        for (int i = 0; i <= 201; ++i) {
            s201 += "a";
        }
        
        for (int i = 0; i <= 2084; ++i) {
            s2084 += "a";
        }
        
        // Test nullable
        def stack = new Stack()
        assertFalse stack.validate()
        assertEquals "nullable", stack.errors["name"]
        assertEquals "nullable", stack.errors["stackPosition"]
        assertEquals "nullable", stack.errors["stackContext"]
        
        // Test maxSize
        stack = new Stack(name: s201, stackPosition: 1, description: s2084, stackContext: s201, imageUrl: s2084, descriptorUrl: s2084)
        assertFalse stack.validate()
        assertEquals "maxSize", stack.errors["name"]
        assertEquals "maxSize", stack.errors["stackContext"]
        assertEquals "maxSize", stack.errors["imageUrl"]
        assertEquals "maxSize", stack.errors["descriptorUrl"]
        
        // Test min
        stack = new Stack(name: "the name", stackPosition: 0, description: "the description", stackContext: "the context", imageUrl: "the url", descriptorUrl: "the url")
        assertFalse stack.validate()
        assertEquals "min", stack.errors["stackPosition"]
        
        // Success
        stack = new Stack(name: "the name", stackPosition: 1, description: "the description", stackContext: "the context", imageUrl: "the url", descriptorUrl: "the url")
        assertTrue stack.validate()

    }
}
