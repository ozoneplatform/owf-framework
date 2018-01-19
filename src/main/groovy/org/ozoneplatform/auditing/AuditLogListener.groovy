package org.ozoneplatform.auditing

import javax.servlet.http.HttpServletRequest

import grails.core.GrailsApplication

import org.springframework.web.context.request.RequestContextHolder

import org.hibernate.persister.entity.EntityPersister

import ozone.owf.grails.services.AccountService
import ozone.owf.grails.services.OwfApplicationConfigurationService
import org.ozoneplatform.auditing.hibernate.AbstractAuditLogListener

import static ozone.owf.enums.OwfApplicationSetting.*


class AuditLogListener extends AbstractAuditLogListener {

    GrailsApplication grailsApplication

    AccountService accountService

    OwfApplicationConfigurationService owfApplicationConfigurationService

    @Override
    protected boolean doCefLogging() {
        owfApplicationConfigurationService.is(CEF_LOGGING_ENABLED)
    }

    protected boolean doCefObjectAccessLogging() {
        owfApplicationConfigurationService.is(CEF_OBJECT_ACCESS_LOGGING_ENABLED)
    }

    @Override
    protected String getApplicationVersion() {
        grailsApplication.metadata.getProperty('app.version', String)
    }

    @Override
    protected String getUserName() {
        accountService.getLoggedInUsername()
    }

    @Override
    protected String getHostClassification() {
        owfApplicationConfigurationService.valueOf(SECURITY_LEVEL)
    }

    @Override
    protected String getDeviceVendor() {
        grailsApplication.config.getProperty('cef.device.vendor', String)
    }

    @Override
    protected String getDeviceProduct() {
        grailsApplication.config.getProperty('cef.device.product', String)
    }

    @Override
    protected String getDeviceVersion() {
        grailsApplication.config.getProperty('cef.device.version', String)
    }

    @Override
    protected int getCEFVersion() {
        grailsApplication.config.getProperty('cef.version', Integer, 0);
    }

    @Override
    protected HttpServletRequest getRequest() {
        RequestContextHolder?.getRequestAttributes()?.getRequest()
    }

    @Override
    protected boolean isAccessAuditable(String arg0) {
        true
    }

    @Override
    boolean requiresPostCommitHanding(EntityPersister persister) {
        // TODO: What should we return here?
        false
    }

}
