package ozone.owf.grails.controllers

import grails.converters.JSON
import ozone.owf.grails.OwfException

class MetricController extends BaseOwfRestController{
	def metricService
	def modelName = 'metric'

	def create = {
		def statusCode
		def jsonResult

		try{
			def result = metricService.create(params)
			statusCode = 200
			jsonResult = result as JSON
		}
		catch (OwfException owe){
			handleError(owe)
			statusCode = owe.exceptionType.normalReturnCode
			jsonResult = "Error during create: " + owe.exceptionType.generalMessage + " " + owe.message
		}

		renderResult(jsonResult, statusCode)
	}
}