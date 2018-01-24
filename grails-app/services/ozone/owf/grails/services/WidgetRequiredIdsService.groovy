package ozone.owf.grails.services

import ozone.owf.grails.domain.WidgetDefinition


class WidgetRequiredIdsService {

    DomainMappingService domainMappingService

    List<String> getDirectRequiredIds(widgetDef) {
        getRequiredWidgetIds(widgetDef.widgetGuid, true)
    }

    List<String> getAllRequiredIds(widgetDef) {
        getRequiredWidgetIds(widgetDef.widgetGuid, false)
    }

    List<String> getRequiredWidgetIds(srcGuids, boolean noRecurse) {
        List<WidgetDefinition> widgetDefs = WidgetDefinition.withCriteria {
            inList('widgetGuid', srcGuids);
        } as List<WidgetDefinition>

        def srcIds = widgetDefs.collect { it.id }
        def accRecIds = []

        def recs = domainMappingService.getRequiredWidgets(srcIds)

        if (noRecurse) {
            accRecIds = recs.collect { it.destId }
        }
        else while (recs) {
            def reqIds = recs.collect { it.destId }
            reqIds = reqIds.minus(accRecIds)
            if (reqIds && reqIds.size() > 0) {
                accRecIds.addAll(reqIds)
                recs = domainMappingService.getRequiredWidgets(reqIds)
            }
            else {
                recs = null
            }
        }

        def processedWidgetsIds = [];

        if (accRecIds && accRecIds.size() > 0) {
            List<WidgetDefinition> widgetDefs2 = WidgetDefinition.withCriteria {
                inList('id', accRecIds)
            } as List<WidgetDefinition>

            processedWidgetsIds = widgetDefs2.collect {
                it.widgetGuid
            }
        }

        processedWidgetsIds
    }

}

