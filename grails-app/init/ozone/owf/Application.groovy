package ozone.owf

import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.boot.autoconfigure.security.SecurityAutoConfiguration
import org.springframework.boot.web.servlet.ServletRegistrationBean
import org.springframework.context.annotation.Bean

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import ozone.owf.filter.servlet.ExportServlet
import ozone.owf.filter.servlet.FileServlet
import ozone.owf.filter.servlet.SessionServlet


@EnableAutoConfiguration(exclude = {
    SecurityAutoConfiguration.class
})
class Application extends GrailsAutoConfiguration {

    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }

	@Bean
	public ServletRegistrationBean sessionServlet() {
		ServletRegistrationBean reg = new ServletRegistrationBean(new SessionServlet())
		reg.setLoadOnStartup(1)
		reg.addUrlMappings("/servlet/SessionServlet")
		return reg
	}

	@Bean
	public ServletRegistrationBean fileServlet() {
		ServletRegistrationBean reg = new ServletRegistrationBean(new FileServlet())
		reg.setLoadOnStartup(1)
		reg.addUrlMappings("/servlet/FileServlet")
		return reg
	}

	@Bean
	public ServletRegistrationBean exportServlet() {
		ServletRegistrationBean reg = new ServletRegistrationBean(new ExportServlet())
		reg.setLoadOnStartup(1)
		reg.addUrlMappings("/servlet/ExportServlet")
		return reg
	}

}
