package ozone.owf.grails

import groovy.transform.CompileStatic


@CompileStatic
class OwfException extends RuntimeException {


    OwfExceptionTypes exceptionType

    String logLevel

    OwfException(String message, OwfExceptionTypes exceptionType, String logLevel = 'ERROR') {
        super(message)
        this.exceptionType = exceptionType
        this.logLevel = logLevel
    }

    OwfException(Map map) {
        this(map.message as String, map.exceptionType as OwfExceptionTypes, map.logLevel as String)
    }

}


@CompileStatic
class OwfAuthorizationException extends OwfException {

    OwfAuthorizationException(String message) {
        super(message, OwfExceptionTypes.Authorization)
    }

}

@CompileStatic
class OwfValidationException extends OwfException {

    OwfValidationException(String message) {
        super(message, OwfExceptionTypes.Validation)
    }

}
