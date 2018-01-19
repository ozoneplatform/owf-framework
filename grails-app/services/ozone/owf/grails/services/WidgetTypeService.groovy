package ozone.owf.grails.services

import grails.compiler.GrailsCompileStatic

import ozone.owf.grails.OwfAuthorizationException
import ozone.owf.grails.domain.WidgetType
import ozone.owf.grails.services.model.WidgetTypeServiceModel


@GrailsCompileStatic
class WidgetTypeService {

    AccountService accountService

    ServiceModelService serviceModelService

    Map list(Map params = [:]) {
        String sortOrder = valueAs(params, 'order', String, 'asc').toLowerCase()

        ensureAdmin()

        List<WidgetType> widgetTypes = WidgetType.listOrderByDisplayName([order: sortOrder])

        List<WidgetTypeServiceModel> processedWidgetTypes =
                widgetTypes.collect { serviceModelService.createWidgetTypeServiceModel(it) }

        return [success: true, results: widgetTypes.size(), data: processedWidgetTypes]
    }

    private void ensureAdmin() {
        if (!accountService.getLoggedInUserIsAdmin()) {
            throw new OwfAuthorizationException("You must be an admin")
        }
    }

    private static <T> T valueAs(Map params, String key, Class<T> clazz, T defaultValue = null) {
        Object value = params.get(key)

        if (value != null && clazz.isInstance(value)) {
            return (T) value
        }

        return defaultValue
    }

}
