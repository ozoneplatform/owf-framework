package ozone.owf.grails.services

import java.util.regex.Matcher

import grails.core.GrailsApplication
import grails.util.Environment


class DescriptorService {

    private static final String TEST_DESCRIPTOR_PATH = './src/main/resources/empty_descriptor.html'

    GrailsApplication grailsApplication

    String generateDescriptor(String data) {
        readEmptyDescriptor().replaceFirst("var data;", Matcher.quoteReplacement("var data = ${data};"))
    }

    private String readEmptyDescriptor() {
        if (Environment.current != Environment.PRODUCTION) {
            return new File(TEST_DESCRIPTOR_PATH).text
        }

        // Search classpath, since different servlet containers can store files in any number of places
        def resource = grailsApplication.mainContext.getResource('classpath:empty_descriptor.html')
        resource.getFile().text
    }

}
