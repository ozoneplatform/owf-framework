package ozone.owf.grails.web.converters.marshaller.xml

import org.codehaus.groovy.grails.web.converters.marshaller.xml.MapMarshaller
import grails.converters.XML
import ozone.owf.grails.services.model.ServiceModel

/**
 *
 */
class ServiceModelObjectMarshaller extends MapMarshaller {

  boolean supports(Object object) {
    return object instanceof ServiceModel
  }

  void marshalObject(Object object, XML converter) {
    ServiceModel model = (ServiceModel)object
    super.marshalObject(model.toDataMap(),converter)
  }

}
