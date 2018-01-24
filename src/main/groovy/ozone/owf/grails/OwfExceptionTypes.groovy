package ozone.owf.grails

import groovy.transform.CompileStatic


@CompileStatic
enum OwfExceptionTypes {

    Authorization(401, 'You are not authorized to access this entity.'),

    Database(500, 'An unexpected database error occurred.'),

    NotFound(404, 'The requested entity was not found.'),

    Validation(400, 'The requested entity failed to pass validation.'),

    Validation_UniqueConstraint(400, 'The requested entity failed to pass unique constraint validation.'),

    JsonToDomainColumnMapping(500, 'The json property has not been mapped to a domain column.'),

    GeneralServerError(500, '')


    final int normalReturnCode
    final String generalMessage

    OwfExceptionTypes(int normalReturnCode, String generalMessage) {
        this.normalReturnCode = normalReturnCode
        this.generalMessage = generalMessage
    }

}
