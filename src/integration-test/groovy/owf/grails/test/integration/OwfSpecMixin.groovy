package owf.grails.test.integration

import org.springframework.beans.factory.annotation.Autowired

import org.hibernate.SessionFactory

import org.grails.datastore.gorm.GormEntity

import ozone.owf.grails.domain.ERoleAuthority
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.Role


trait OwfSpecMixin {

    @Autowired
    SessionFactory sessionFactory

    void flushSession() {
        sessionFactory.currentSession.flush()
    }

    static <T extends GormEntity<T>> T save(T object) {
        GormUtil.save(object)
    }

    static <T> T verifyNotNull(Closure<T> closure) {
        T value = closure.call()

        assert value != null

        value
    }

    private Role cachedAdminRole
    private Role cachedUserRole

    Role requestUserRole() {
        if (cachedUserRole == null) {
            cachedUserRole = requestRole(ERoleAuthority.ROLE_USER, "User Role")
        }
        cachedUserRole
    }

    Role requestAdminRole() {
        if (cachedAdminRole == null) {
            cachedAdminRole = requestRole(ERoleAuthority.ROLE_ADMIN, "Admin Role")
        }
        cachedAdminRole
    }

    Role requestRole(ERoleAuthority authority, String description) {
        Role.findByAuthority(authority.strVal) ?: save(new Role(authority: authority.strVal, description: description))
    }

    Person createUser(String name) {
        save new Person(
                username: name,
                userRealName: "${name} the User",
                email: "${name}@example.com",
                enabled: true,
                authorities: [requestUserRole()],
                prevLogin: new Date())
    }

    Person createAdmin(String name) {
        save new Person(
                username: name,
                userRealName: "${name} the Admin",
                email: "${name}@example.com",
                enabled: true,
                authorities: [requestAdminRole()],
                prevLogin: new Date())
    }

    /**
     * Required only if we defy probability and generate a collision (1 in 2^122 chance)
     **/
    static String randomUUID(List<String> excluded = []) {
        while (true) {
            String uuid = UUID.randomUUID().toString()
            if (!excluded.contains(uuid)) return uuid
        }
    }

}
