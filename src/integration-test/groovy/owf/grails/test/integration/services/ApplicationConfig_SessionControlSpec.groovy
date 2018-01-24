package owf.grails.test.integration.services

import spock.lang.Specification

import grails.gorm.transactions.Rollback
import grails.testing.mixin.integration.Integration

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.security.core.session.SessionRegistryImpl
import org.springframework.security.web.authentication.session.ConcurrentSessionControlAuthenticationStrategy

import owf.grails.test.integration.OwfSpecMixin

import ozone.owf.grails.services.OwfApplicationConfigurationService
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration

import static ozone.owf.enums.OwfApplicationSetting.SESSION_CONTROL_ENABLED
import static ozone.owf.enums.OwfApplicationSetting.SESSION_CONTROL_MAX_CONCURRENT
import static ozone.owf.enums.OwfApplicationSettingType.USER_ACCOUNT_SETTINGS


@Integration
@Rollback
class ApplicationConfig_SessionControlSpec extends Specification implements OwfSpecMixin {

    @Autowired
    OwfApplicationConfigurationService service

    SessionControlStrategyStub sessionStrategy = new SessionControlStrategyStub()

    private void setupData() {
        service.concurrentSessionControlStrategy = sessionStrategy

        save new ApplicationConfiguration(
                code: SESSION_CONTROL_ENABLED.code,
                value: 'true',
                title: 'SESSION_CONTROL_ENABLED',
                type: 'Boolean',
                groupName: USER_ACCOUNT_SETTINGS.description)

        save new ApplicationConfiguration(
                code: SESSION_CONTROL_MAX_CONCURRENT.code,
                value: '1',
                title: 'SESSION_CONTROL_MAX_CONCURRENT',
                type: 'Integer',
                groupName: USER_ACCOUNT_SETTINGS.description)
    }

    void testDefaultValues() {
        given:
        setupData()

        expect:
        sessionControlEnabled
        sessionControlMaxConcurrent == 1
    }

    void testEnableSessionControl() {
        given:
        setupData()

        when:
        updateSessionControlEnabled 'true'

        then:
        sessionControlEnabled
        sessionControlMaxConcurrent == 1
        sessionStrategy.maximumSessions == 1
    }

    void testDisableSessionControl() {
        given:
        setupData()

        when:
        updateSessionControlEnabled 'false'

        then:
        !sessionControlEnabled
        sessionControlMaxConcurrent == 1

        sessionStrategy.maximumSessions == -1
    }

    void testUpdateMaxConcurrentSessions() {
        given:
        setupData()

        when:
        updateSessionControlMaxConcurrent '2'

        then:
        sessionControlEnabled
        sessionControlMaxConcurrent == 2
        sessionStrategy.maximumSessions == 2
    }

    void testUpdateMaxConcurrentSessions_WhileDisabled() {
        given:
        setupData()

        updateSessionControlEnabled 'false'

        when:
        updateSessionControlMaxConcurrent '3'

        then:
        !sessionControlEnabled
        sessionControlMaxConcurrent == 3
        sessionStrategy.maximumSessions == -1
    }

    void testEnableSessions_AfterUpdate_WhileDisabled() {
        given:
        setupData()

        updateSessionControlEnabled 'false'
        updateSessionControlMaxConcurrent '3'

        when:
        updateSessionControlEnabled 'true'

        then:
        sessionControlEnabled
        sessionControlMaxConcurrent == 3
        sessionStrategy.maximumSessions == 3
    }

    private boolean isSessionControlEnabled() {
        service.getApplicationConfiguration(SESSION_CONTROL_ENABLED).value.toBoolean()
    }

    private void updateSessionControlEnabled(String value) {
        def enabledConf = service.getApplicationConfiguration(SESSION_CONTROL_ENABLED)
        enabledConf.value = value
        service.saveApplicationConfiguration(enabledConf)
    }

    private int getSessionControlMaxConcurrent() {
        service.getApplicationConfiguration(SESSION_CONTROL_MAX_CONCURRENT).value.toInteger()
    }

    private void updateSessionControlMaxConcurrent(String value) {
        def maxConf = service.getApplicationConfiguration(SESSION_CONTROL_MAX_CONCURRENT)
        maxConf.value = value
        service.saveApplicationConfiguration(maxConf)
    }

    static class SessionControlStrategyStub extends ConcurrentSessionControlAuthenticationStrategy {

        SessionControlStrategyStub() {
            super(new SessionRegistryImpl())
        }

        int getMaximumSessions() {
            super.getMaximumSessionsForThisUser(null)
        }

    }

}
