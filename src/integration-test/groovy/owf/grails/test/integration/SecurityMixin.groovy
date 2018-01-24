package owf.grails.test.integration

import org.junit.Before

import org.springframework.beans.factory.annotation.Autowired

import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.AccountService
import ozone.owf.security.AutoUserSessionProvider


trait SecurityMixin {

    @Autowired
    AutoUserSessionProvider userSessionProvider

    @Autowired
    AccountService accountService

    @Before
    void cleanupSecurity() {
        userSessionProvider.logOut()
    }

    void loggedInAs(Person user) {
        assert user != null

        userSessionProvider.logInAs(user)
    }

    void logOut() {
        userSessionProvider.logOut()
    }

    def <T> T runAsAdmin(Closure<T> closure) {
        accountService.runAsAdmin(closure)
    }

}
