package ozone.owf.grails.services

import grails.converters.JSON
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import org.hibernate.CacheMode

class MetricService {

  def grailsApplication
  def httpService

  def create(params) {
    def httpConfig = grailsApplication.config.owf.metric
    def httpParams = [:]

    if (httpConfig.enabled == true) {
      if (params.data != null && params.data != '') {
        httpParams.data = params.data
      }
      else {
        httpParams = [
                metricTime: params.metricTime,
                userName: params.userName,
				userId: params.userId,
                site: params.site,
                userAgent: params.userAgent,
                component: params.component,
                componentId: params.componentId,
                instanceId: params.instanceId,
                metricTypeId: params.metricTypeId,
                widgetData: params.widgetData
        ]
      }

      return httpService.post(httpConfig, httpParams)
    }
    else {
      log.info('Metric.create was called - not sending metric data because metric.enabled is false')
      return [success: false, data: []]
    }
  }
}
