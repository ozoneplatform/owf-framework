package ozone.owf.grails.controllers

class TestErrorController {
	
	def index =
	{
		println 'INDEX'
	}
	def throwError = {		
		throw new Exception("This is a test exception!")
	}
	
}
