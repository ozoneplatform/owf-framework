package ozone.owf.grails.services

import grails.converters.JSON

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional

import org.hibernate.CacheMode

import ozone.owf.grails.AuditOWFWebRequestsLogger
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.*
import ozone.owf.security.UserSessionProvider
import ozone.security.authentication.OWFUserDetails
import ozone.security.authentication.OWFUserDetailsImpl
import ozone.security.authorization.target.OwfGroup

/**
 * Service for account-related operations.*/

@Transactional(readOnly = true)
class AccountService {

    def loggingService = new AuditOWFWebRequestsLogger()

    ServiceModelService serviceModelService

    StackService stackService

    DashboardService dashboardService

    GroupService groupService

    PersonWidgetDefinitionService personWidgetDefinitionService

    UserSessionProvider userSessionProvider

    static final ThreadLocal<Boolean> hasTemporaryAdminPrivileges = new ThreadLocal<Boolean>()

    private static def addFilter(name, value, c) {
        c.with {
            switch (name) {
                case 'lastLogin':
                    break;
                default:
                    ilike(name, '%' + value + '%')
            }
        }
    }

    @Transactional(readOnly = true, propagation = Propagation.REQUIRES_NEW)
    Person getLoggedInUserReadOnly() {
        Person.findByUsername(getLoggedInUsername(), [cache: true])
    }

    Person getLoggedInUser() {
        Person.findByUsername(getLoggedInUsername(), [cache: true])
    }

    /**
     * Grab the display name from spring security user detail object if the custom security module implemented it.
     * If not just use user name.
     **/
    String getLoggedInUserDisplayName() {
        def p = userSessionProvider.principal
        def displayName = p?.username ?: "unknown"
        if (p?.metaClass?.hasProperty(p, "displayName")) {
            displayName = p?.displayName ?: displayName
        }
        return displayName
    }

    String getLoggedInUsername() {
        userSessionProvider.principal?.username
    }

    def <T> T runAsAdmin(Closure<T> closure) {
        hasTemporaryAdminPrivileges.set(true)
        try {
            return closure.call()
        } finally {
            hasTemporaryAdminPrivileges.set(false)
        }
    }

    boolean isTemporaryAdmin() {
        hasTemporaryAdminPrivileges.get()
    }

    boolean isUserAdmin(Person user) {
        user.authorities.find { it.authority == ERoleAuthority.ROLE_ADMIN.strVal } as boolean
    }

    boolean getLoggedInUserIsAdmin() {
        isTemporaryAdmin() || userHasAuthority(ERoleAuthority.ROLE_ADMIN)
    }

    boolean getLoggedInUserIsUser() {
        userHasAuthority(ERoleAuthority.ROLE_USER)
    }

    private boolean userHasAuthority(ERoleAuthority authority) {
        userSessionProvider.getAuthorityNames().contains(authority.strVal)
    }

    Collection<? extends GrantedAuthority> getLoggedInUserRoles() {
        userSessionProvider.getAuthorities()
    }

    /**
     * Return a list of owf user groups of which the user is a member
     * The class returned is list of ozone.security.authorization.target.OwfGroup objects.
     *
     * The list may be empty.
     **/
    Collection<OwfGroup> getLoggedInAutomaticUserGroups() {
        def user = userSessionProvider.principal

        (user != null && user instanceof OWFUserDetails) ? user.getOwfGroups() : []
    }

    /**
     * Grab the email from spring security user detail object if the custom security module implemented it.
     * If not, return an empty string.
     **/
    String getLoggedInUserEmail() {
        def p = userSessionProvider.principal
        def email = ""
        if (p?.metaClass?.hasProperty(p, "email")) {
            email = p?.email ?: email
        }
        return email
    }

    /**
     * There are times that OWF might pick up a request when a user is not logged in, for example during sync.
     *
     * This will create a security context with the incoming userName.  The user name could be SYSTEM or it could be a
     * user name from an audit field (editedBy)
     **/
    void createSecurityContext(String userName = "SYSTEM") {
        // If there is no security context then a user is not logged in so, this is a system process or we can use the
        // passed in userName to create the details
        if (userSessionProvider.authentication != null) return

        log.debug "Creating a PreAuthenticatedAuthenticationToken for ${userName}"

        def auths = [new SimpleGrantedAuthority(ERoleAuthority.ROLE_USER.strVal)]

        def userDetails = new OWFUserDetailsImpl(userName, null, auths, [])

        def token = new PreAuthenticatedAuthenticationToken(userDetails, null, auths)

        userSessionProvider.authentication = token
    }

    List<Person> getAllUsers() {
        if (!getLoggedInUserIsAdmin()) {
            throw new OwfException(message: 'You are not authorized to see a list of users in the system.', exceptionType: OwfExceptionTypes.Authorization)
        }
        return Person.listOrderByUsername()
    }

    def getAllUsersByParams(params) {
        if (!getLoggedInUserIsAdmin()) {
            throw new OwfException(message: 'You are not authorized to see a list of users in the system.', exceptionType: OwfExceptionTypes.Authorization)
        }
        def criteria = Person.createCriteria()
        def opts = [:]

        if (params?.offset) opts.offset = (params.offset instanceof String ? Integer.parseInt(params.offset) : params.offset)
        if (params?.max) opts.max = (params.max instanceof String ? Integer.parseInt(params.max) : params.max)
        def personList = criteria.list(opts) {
            if (params.id) eq("id", Long.parseLong(params.id))
            if (params.group_id)

                groups {
                    eq("id", Long.parseLong(params.group_id))
                }
            if (params.stack_id) {
                groups {
                    idEq(Stack.findById(Long.parseLong(params.stack_id)).defaultGroup.id)
                }
            }
            if (params.widget_id) personWidgetDefinitions {
                widgetDefinition {
                    eq("widgetGuid", params.widget_id)

                }

                //only list widgets that are explicitly assigned
                //to this user
                eq("userWidget", true)
            }
            if (params.filters) {
                if (params.filterOperator?.toUpperCase() == 'OR') {
                    or {
                        JSON.parse(params.filters).each {
                            switch (it.filterField) {
                                case 'lastLogin':
                                    if (it.filterValue instanceof List) {
                                        between("lastLogin", new Date(it.filterValue[0]), new Date(it.filterValue[1] + 86400000))
                                    }
                                    else {
                                        def from = it.filterValue - (it.filterValue % 86400000)
                                        between("lastLogin", new Date(from), new Date(from + 86400000))
                                    }
                                    break;
                                default:
                                    ilike(it.filterField, '%' + it.filterValue + '%')
                            }
                        }
                    }
                }
                else {
                    JSON.parse(params.filters).each {
                        switch (it.filterField) {
                            case 'lastLogin':
                                if (it.filterValue instanceof List) {
                                    between("lastLogin", new Date(it.filterValue[0]), new Date(it.filterValue[1] + 86400000))
                                }
                                else {
                                    def from = it.filterValue - (it.filterValue % 86400000)
                                    between("lastLogin", new Date(from), new Date(from + 86400000))
                                }
                                break;
                            default:
                                ilike(it.filterField, '%' + it.filterValue + '%')
                        }
                    }
                }
            }

            if (params?.sort) order(params.sort, params?.order?.toLowerCase() ?: 'asc')
            cacheMode(CacheMode.GET)
        }

        def processedList = personList.collect { p ->

            def groupCount = Group.withCriteria {
                cacheMode(CacheMode.GET)
                people {
                    eq('id', p.id)
                }
                and {
                    eq('stackDefault', false)
                }

                projections { rowCount() }
            }
            def widgetCount = PersonWidgetDefinition.withCriteria {
                cacheMode(CacheMode.GET)
                person {
                    eq('id', p.id)
                }
                eq('userWidget', true)
                projections { rowCount() }
            }
            def dashboardCount = Dashboard.withCriteria {
                cacheMode(CacheMode.GET)
                user {
                    eq('id', p.id)
                }
                projections { rowCount() }
            }
            def totalStacks = 0
            p.groups?.each { group ->
                if (group?.stackDefault) {
                    totalStacks++
                }
            }

            serviceModelService.createServiceModel(p, [totalGroups    : groupCount[0],
                                                       totalWidgets   : widgetCount[0],
                                                       totalDashboards: dashboardCount[0],
                                                       totalStacks    : totalStacks])
        }

        return [success: true, data: processedList, results: personList.totalCount]
    }

    @Transactional(readOnly = false)
    def createOrUpdate(params) {
        if (!getLoggedInUserIsAdmin()) {
            throw new OwfException(message: 'You are not authorized to see a list of users in the system.',
                    exceptionType: OwfExceptionTypes.Authorization)
        }

        def returnValue = null
        def isNewUser = false

        log.debug("AccountService.createOrUpdate with params:: " + params)

        if (params.data && !params.tab) {
            def users = [];
            def json = JSON.parse(params.data)
            json.each { data ->
                data.each {
                    if (!data.isNull(it.key)) params[it.key] = it.value
                }
                def user = Person.findByUsername(params.username)
                if (user && !params.id) {
                    throw new OwfException(message: 'A user with this name already exists.', exceptionType: OwfExceptionTypes.GeneralServerError)
                }
                if (!user) {
                    //Create
                    user = new Person()
                    user.enabled = true
                    user.emailShow = true
                    loggingService.log("Added new User [username:" + user.username + ",userRealName:" + user.userRealName + "]")
                    isNewUser = true
                }
                params.lastLogin = params.lastLogin ? new Date(params.lastLogin) : null
                params.prevLogin = params.prevLogin ? new Date(params.prevLogin) : null
                params.entrySet().grep {
                    it.key in ['username', 'userRealName', 'enabled', 'email', 'emailShow',
                               'description', 'lastLogin', 'prevLogin']
                }.each { entry -> user[entry.key] = entry.value
                }

                // Add to OWF Users group
                if (isNewUser) {
                    def grp = groupService.getAllUsersGroup()
                    if (grp) {
                        user.addToGroups(grp)
                    }
                }

                user.save(failOnError: true)
                users << user
            }
            returnValue = users.collect { serviceModelService.createServiceModel(it) }
        }
        else if (params.update_action && (params.id || params.user_id)) {
            def id = params.id ?: params.user_id
            Person user = Person.findById(id, [cache: true])
            if (user) {
                def updatedWidgets = []
                if ('widgets' == params.tab) {

                    def widgets = JSON.parse(params.data)

                    widgets.each {
                        def widget = WidgetDefinition.findByWidgetGuid(it.id, [cache: true])
                        if (widget) {
                            def results = PersonWidgetDefinition.createCriteria().list() {
                                eq("person", user)
                                eq("widgetDefinition", widget)
                            }


                            if (params.update_action == 'add') {
                                if (!results) {
                                    def queryReturn = PersonWidgetDefinition.executeQuery("SELECT MAX(pwd.pwdPosition) AS retVal FROM PersonWidgetDefinition pwd WHERE pwd.person = ?", [user])

                                    def maxPosition = queryReturn[0] ?: -1
                                    maxPosition++
                                    def personWidgetDefinition = new PersonWidgetDefinition(person: user,
                                            widgetDefinition: widget,
                                            userWidget: true,
                                            visible: true,
                                            pwdPosition: maxPosition)

                                    user.addToPersonWidgetDefinitions(personWidgetDefinition)
                                    widget.addToPersonWidgetDefinitions(personWidgetDefinition)
                                }
                                // If the user already had this PWD, then set the direct user
                                // assocation flag.
                                else if (results[0] != null) {
                                    results[0].userWidget = true
                                    results[0].save(flush: true);
                                }
                            }
                            else if (params.update_action == 'remove') {
                                results?.each { result ->
                                    // If the user was assigned the widget through a group,
                                    // keep the PWD but un-flag it's direct user association.
                                    if (result.groupWidget) {
                                        result.userWidget = false
                                        result.save(flush: true)
                                    }
                                    else {
                                        // The user no longer has any association to the widget;
                                        // remove the PWD.
                                        user.removeFromPersonWidgetDefinitions(result)
                                        widget.removeFromPersonWidgetDefinitions(result)
                                    }
                                }
                            }

                            updatedWidgets << widget
                        }
                    }
                    if (updatedWidgets) returnValue = updatedWidgets.collect {
                        serviceModelService.createServiceModel(it)
                    }
                }

                if ('groups' == params.tab) {
                    def updatedGroups = []
                    //def group_ids = [params.group_ids].flatten()
                    //group_ids?.each{
                    def groups = JSON.parse(params.data)
                    groups.each {
                        Group group = Group.findById(it.id.toLong(), [cache: true])
                        if (group) {
                            if (params.update_action == 'add') group.addToPeople(user) else if (params.update_action == 'remove') {
                                group.removeFromPeople(user)
                                dashboardService.purgePersonalDashboards(user, group)
                            }
                            group.save(flush: true, failOnError: true)

                            updatedGroups << group
                        }
                    }
                    user.sync()
                    if (!updatedGroups.isEmpty()) {
                        returnValue = updatedGroups.collect { serviceModelService.createServiceModel(it) }
                    }
                }

                if ('stacks' == params.tab) {
                    def updatedStacks = []

                    def stacks = JSON.parse(params.data)
                    stacks?.each {
                        def stack = Stack.findById(it.id.toLong(), [cache: true])
                        if (stack) {
                            if (params.update_action == 'add') stack.defaultGroup.addToPeople(user) else if (params.update_action == 'remove') {
                                stackService.deleteUserFromStack(stack, user)
                            }

                            stack.save(flush: true, failOnError: true)

                            updatedStacks << stack
                        }
                    }
                    user.sync()
                    if (!updatedStacks.isEmpty()) {
                        returnValue = updatedStacks.collect { serviceModelService.createServiceModel(it) }
                    }
                }
            }
        }

        return [success: true, data: returnValue]
    }

    @Transactional(readOnly = false)
    def bulkDeleteUsersForAdmin(params) {
        if (!getLoggedInUserIsAdmin()) {
            throw new OwfException(message: 'You are not authorized to bulkDelete Admin users.', exceptionType: OwfExceptionTypes.Authorization)
        }
        if (params.personUserIDsToDelete == null) {
            throw new OwfException(message: 'A fatal validation error occurred. personUserIDsToDelete param required. Params: ' + params.toString(),
                    exceptionType: OwfExceptionTypes.Validation)
        }

        def persons = []
        params.personUserIDsToDelete.each {
            def person = Person.get(it.id)
            if (person == null) {
                throw new OwfException(message: 'User ' + it + ' not found during bulk delete.', exceptionType: OwfExceptionTypes.NotFound)
            }
            else if (person.username.equals(Person.NEW_USER)) {
                throw new OwfException(message: 'The default template user may not be deleted', exceptionType: OwfExceptionTypes.Authorization)
            }

            Map newParams = new HashMap()
            newParams.person = person
            newParams.adminEnabled = true
            persons.add(person);

            //unAssignUserFromAllGroups(newParams)
            def result = deleteUser(newParams)
        }
        return [success: true, data: params.personUserIDsToDelete]
    }

    private def deleteUserLoggedInCheck(person) {

        def loggedInUser = getLoggedInUser()

        if (loggedInUser && loggedInUser.username.equalsIgnoreCase(person.username)) {

            throw new OwfException(message: 'Your are not permitted to delete yourself.', exceptionType: OwfExceptionTypes.GeneralServerError)
        }
    }

    @Transactional(readOnly = false)
    def deleteUser(params) {
        def person
        if (params.person) {
            person = params.person
        }
        else {
            if (getLoggedInUserIsAdmin()) {

                //check if the default user is being deleted
                if (!params.username.equalsIgnoreCase(Person.NEW_USER)) {
                    person = Person.findByUsername(params.username)
                }
                else {
                    throw new OwfException(message: 'The default template user may not be deleted',
                            exceptionType: OwfExceptionTypes.Authorization)
                }
            }
            else {
                throw new OwfException(message: 'User ' + params.username + ' is not permitted to delete a user ', exceptionType: OwfExceptionTypes.NotFound)
            }
        }
        if (person == null) {
            throw new OwfException(message: 'User ' + params.username + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
        }

        deleteUserLoggedInCheck(person)

        try {
            //we need to make a copy of the list of groups because hibernate will update the same list when a the user is
            //removed from the group
            def groups = person.groups.collect { it }
            groups.each { it.removeFromPeople(person) }

            //we need to unset audit log fields which will
            //cause a constraint violation if we let grails simply cascade delete the user

            //search through all dashboards for dashboards which have reference to the user being deleted
            def dashboards = Dashboard.withCriteria { eq('createdBy', person) }

            //if there are any dashboards unassign this user from the fields
            dashboards.each {
                //explicitly clear those audit log fields
                it.createdBy = null
            }

            //search through all dashboards for dashboards which have reference to the user being deleted
            dashboards = Dashboard.withCriteria { eq('editedBy', person) }

            //if there are any dashboards unassign this user from the fields
            dashboards.each {
                //explicitly clear those audit log fields
                it.editedBy = null
            }

            //Set stack owner to null
            def stacks = Stack.withCriteria { eq('owner', person) }
            stacks.each {
                it.owner = null
            }

            //delete person
            person.delete(flush: true)
            return [success: true, person: person]
        } catch (e) {
            log.error(e)
            throw new OwfException(message: 'A fatal error occurred while trying to delete a user. Params: ' + params.toString(), exceptionType: OwfExceptionTypes.Database)
        }
    }

}
