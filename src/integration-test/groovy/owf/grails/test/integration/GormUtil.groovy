package owf.grails.test.integration

import org.springframework.validation.FieldError

import org.grails.datastore.gorm.GormEntity
import org.grails.datastore.gorm.GormValidateable


abstract class GormUtil {

    static <T extends GormEntity<T>> T save(T object) {
        assert object != null

        assert validateAndPrintErrors(object)

        T result = object.save(flush: true)
        assert result != null

        result
    }

    static boolean validateAndPrintErrors(GormValidateable object) {
        def isValid = object.validate()
        if (!isValid) {
            println "Validation Error: ${object.class.canonicalName}"
            object.errors.fieldErrors.each { FieldError error ->
                println "\tfield: ${error.field}, code: ${error.code}, value: '${error.rejectedValue}'"
            }
        }
        isValid
    }

}
