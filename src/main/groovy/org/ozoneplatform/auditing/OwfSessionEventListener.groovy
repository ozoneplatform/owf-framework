package org.ozoneplatform.auditing

import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpSession
import javax.servlet.http.HttpSessionEvent

import grails.core.GrailsApplication

import org.springframework.beans.BeansException
import org.springframework.web.context.WebApplicationContext
import org.springframework.web.context.request.RequestContextHolder
import org.springframework.web.context.support.WebApplicationContextUtils

import ozone.owf.grails.services.AccountService
import org.ozoneplatform.auditing.format.cef.Extension
import org.ozoneplatform.auditing.http.AbstractSessionEventListener


class OwfSessionEventListener extends AbstractSessionEventListener {

    AccountService accountService

    GrailsApplication grailsApplication

    def jbFilter

    @Override
    String getHostClassification() {
        jbFilter?.configMessage ?: Extension.UNKOWN_VALUE
    }

    @Override
    String getApplicationVersion() {
        grailsApplication.metadata.getProperty('app.version', String)
    }

    @Override
    HttpServletRequest getRequest() {
        RequestContextHolder?.getRequestAttributes()?.getRequest()
    }

    @Override
    String getUserName() {
        accountService.getLoggedInUsername()
    }

    @Override
    void setBeans(HttpSessionEvent event) {
        if (!accountService) {
            this.accountService = (AccountService) getBean(event.getSession(), 'accountService')
        }

        if (!grailsApplication) {
            this.grailsApplication = (GrailsApplication) getBean(event.getSession(), 'grailsApplication')
        }

        try {
            if (!jbFilter) {
                this.jbFilter = getBean(event.getSession(), 'JBlocksFilter')
            }
        } catch (BeansException ignored) {
            this.jbFilter = null
        }
    }

    private def getBean(HttpSession session, String bean) {
        WebApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(session.getServletContext())
        return ctx.getBean(bean)
    }

}
