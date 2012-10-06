package ozone.owf.grails.web.converters.marshaller.json

import grails.converters.JSON
import org.codehaus.groovy.grails.web.converters.marshaller.json.MapMarshaller
import ozone.owf.grails.services.model.ServiceModel

/**
 *
 */
class ServiceModelObjectMarshaller extends MapMarshaller {

  boolean supports(Object object) {
    return object instanceof ServiceModel
  }

  void marshalObject(Object object, JSON converter) {
    ServiceModel model = (ServiceModel)object
    super.marshalObject(model.toDataMap(),converter)
  }

}
