
class CodeCoverageGrailsPlugin {
    def version = '1.2'
	
	def dependsOn = [core:'1.2 > *'] 
	def author = "Mike Hugo"
	def authorEmail = "mike@piragua.com"
	def title = "Generates Code Coverage reports"
	def description = """
		Creates Code Coverage reports for your code.
        Special thanks to Peter Ledbrook and Jeff Kunkle for contributions to this plugin.
	"""
	def documentation = "http://grails.org/Test+Code+Coverage+Plugin"
}
