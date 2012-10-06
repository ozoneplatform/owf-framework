package ozone.owf.grails.test.integration

import org.springframework.security.core.context.SecurityContextHolder as SCH

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.GrantedAuthorityImpl
import org.springframework.security.core.userdetails.User
import ozone.owf.grails.services.AccountService
import ozone.owf.grails.OwfException
import ozone.owf.grails.domain.Person

class AccountServiceTests extends GroovyTestCase {

    def accountService
    def serviceModelService

    protected void setUp() {
        super.setUp()
        // login as a regular user.  Call loginAsAdmin if your test needs 
        loginAsUsernameAndRole("testUser1","ROLE_USER")
        
        accountService = new AccountService()
    }
    
    protected void tearDown() {
        SCH.clearContext();
        super.tearDown();
    }

    void testGetAllUsersMustBeAdmin() {
        shouldFail(OwfException, {
            accountService.getAllUsers()
        })
    }
    void testGetAllUsers() {
        loginAsAdmin()
        def person = new Person(username: 'username', userRealName: 'Real Name', enabled: true)
        person.save()
        assertEquals 1, accountService.getAllUsers().size
    }
    
    void testGetAllUsersWithApos() {
        // this is used in the administrative service.  TODO:  Move this test there or refactor
        loginAsAdmin()
        def username = "Mike O'Reilly"
        def person = new Person(username: username, userRealName: 'Real Name', enabled: true)
        person.save()
        def json = accountService.getAllUsers().collect { serviceModelService.createServiceModel(it) }
        assertNotNull json
        assertEquals username, json[0].username
    }
    
    private void loginAsAdmin() {
        loginAsUsernameAndRole("testAdmin1","ROLE_ADMIN")
    }
    
    private void loginAsUsernameAndRole(def username, def role_string) {
        SCH.clearContext()
        
        GrantedAuthority[] authorities = [new GrantedAuthorityImpl(role_string)]
        SCH.context.authentication = new UsernamePasswordAuthenticationToken(
            new User(username, "password1", true, true, true, true, authorities),
            "password1"
        )
    }
    
}
