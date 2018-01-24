package ozone.owf.grails.services

import javax.annotation.Nonnull

import grails.gorm.transactions.Transactional

import org.hibernate.FetchMode

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.*

import static java.util.Collections.emptySet


@Transactional
class SyncService {

    AccountService accountService

    DashboardService dashboardService

    PersonWidgetDefinitionService personWidgetDefinitionService

    DomainMappingService domainMappingService

    @Transactional(readOnly = true)
    Set<Group> findGroupsToSyncForPerson(Person person) {
        Set<Group> groups = person.groups ?: new HashSet<>()
        groups.addAll(findStackDefaultGroupsFor(person))
        groups.addAll(findSystemGroups())
        groups.addAll(findSystemStackDefaultGroups())

        return groups - null
    }

    @Nonnull
    private static Set<Group> findStackDefaultGroupsFor(Person person) {
        (person.groups*.stacks*.defaultGroup?.flatten() as Set<Group>) ?: emptySet()
    }

    @Transactional(readOnly = false)
    void syncPerson(Person person, Boolean forceSync = false) {
        if (person.requiresSync || forceSync) {
            Set<Group> groupsToSync = findGroupsToSyncForPerson(person)
            syncDashboardFor(person, groupsToSync)
            syncWidgetDefinitionsFor(person, groupsToSync)

            if (person.requiresSync) {
                person.sync(false)
            }
        }
    }

    @Transactional(readOnly = false)
    void syncDashboardFor(Person person, Set<Group> groupsToSync = null) {
        Set<Group> groups = groupsToSync ?: findGroupsToSyncForPerson(person)

        // find max dashboard position
        def maxPosition = 0
        if (person != null) {
            maxPosition = dashboardService.getMaxDashboardPosition(person)
        }
        if (maxPosition < 0) maxPosition = 0;

        // get all group dashboard mappings
        List groupDashboardMappings = domainMappingService.getGroupDashboardMappings(groups)

        // get all group dashboards
        List groupDashboards = groupDashboardMappings.collect { it[1] }

        // get all dashboards for user that are clones
        List clonedDashboardMappings = domainMappingService.getClonedDashboardMappings(person)

        // create a map, group dashboard id => user's clone dashboard
        Map cloneDashboards = [:]
        clonedDashboardMappings.each {
            DomainMapping dm = it[0]
            Dashboard d = it[1]
            cloneDashboards[dm.destId] = d
        }

        groupDashboards.each { Dashboard groupDash ->
            //check if this group dashboard already has a private copy for this person
            def cloneDashboard = cloneDashboards[groupDash.id]

            //create private copy of the group dashboard for the person if they don't have one
            if (!cloneDashboard && dashboardService.shouldCloneGroupDashboard(groupDash, person)) {
                dashboardService.cloneGroupDashboardAndCreateMapping(groupDash, person.id, maxPosition)
            }
        }
    }


    @Transactional(readOnly = false)
    void syncWidgetDefinitionsFor(Person person, Set<Group> groupsToSync = null) {
        Set<Group> groups = groupsToSync ?: findGroupsToSyncForPerson(person)

        List<WidgetDefinition> groupWidgets = domainMappingService.getBulkMappedObjects(groups, RelationshipType.owns, WidgetDefinition.TYPE)

        List<PersonWidgetDefinition> personWidgetDefinitions = personWidgetDefinitionService.myWidgets(person)

        List<PersonWidgetDefinition> groupPersonWidgetDefinitions = personWidgetDefinitions.findAll { PersonWidgetDefinition pw ->
            pw.groupWidget == true
        }

        List<PersonWidgetDefinition> directAssignedPersonWidgetDefinitions = personWidgetDefinitions.findAll { PersonWidgetDefinition pw ->
            pw.groupWidget == false
        }

        // diff group widgets and group person widgets
        groupPersonWidgetDefinitions.each { PersonWidgetDefinition pwd ->
            // copy is already created, remove so it isn't processed later.
            if (groupWidgets.indexOf(pwd.widgetDefinition) > -1) {
                groupWidgets.remove(pwd.widgetDefinition)
            }
            // user has a copy of a group widget but it is not in that group any more.
            else {
                // delete pwd if a group widget is no longer in a group and user is not directly associated to it.
                if (!pwd.userWidget) {
                    personWidgetDefinitionService.delete([
                            personWidgetDefinition: pwd,
                            guid                  : pwd.widgetDefinition.widgetGuid
                    ])
                    personWidgetDefinitions.remove(pwd)
                }
                else {
                    // Just remove the group association from the pwd
                    pwd.groupWidget = false
                    pwd.save(flush: true)
                }
            }
        }

        // create person widget definitions for new group widgets that person doesn't have access to
        if(groupWidgets.size() > 0) {
            Integer maxPosition

            //loop through the group widgets that are to be processed, new group widgets
            groupWidgets.each { WidgetDefinition widgetDefinition ->

                //lookup pwd this may have been previously created
                boolean copyNotFound = directAssignedPersonWidgetDefinitions.findAll { it.widgetDefinition == widgetDefinition }.isEmpty()
                PersonWidgetDefinition personWidgetDefinition

                //if the pwd does not exist create it
                if (copyNotFound) {
                    if (maxPosition == null) {
                        maxPosition = personWidgetDefinitionService.getMaxPosition(person)
                    }
                    personWidgetDefinition = new PersonWidgetDefinition(
                            person: person,
                            widgetDefinition: widgetDefinition,
                            pwdPosition: maxPosition++,
                            visible: true,
                            favorite: false,
                            userWidget: false,
                            //only this method will ever set this groupWidget flag to true
                            groupWidget: true
                    )

                    personWidgetDefinition.validate()

                    if (personWidgetDefinition.hasErrors()) {
                        throw new OwfException(
                                message: 'A fatal validation error occurred during the creation of a widget.' + personWidgetDefinition.errors.toString(),
                                exceptionType: OwfExceptionTypes.Validation)
                    }
                    else if (!personWidgetDefinition.save()) {
                        throw new OwfException(
                                message: 'A fatal error occurred while trying to save a widget. Params: ' + params.toString(),
                                exceptionType: OwfExceptionTypes.Database)
                    }

                    // add to our internal list so we don't have to fetch all person widget definitions again
                    personWidgetDefinitions.add(personWidgetDefinition)
                }
            }
        }
    }

    /**
     *
     * Update people that belong to the group for requiring sync when they login next time.
     *
     */
    @Transactional(readOnly = false)
    void syncPeopleInGroup(Group group) {
        if (group.name == Group.USERS) {
            Person.executeUpdate('update Person p set p.requiresSync=:value', [value: true])
        }
        else if (group.name == Group.ADMINS) {
            Person.withCriteria {
                authorities {
                    'eq'('authority', ERoleAuthority.ROLE_ADMIN.strVal)
                }
            }.each { Person p ->
                p.requiresSync = true
                p.save()
            }
        }
        else {
            group.people.each { Person p ->
                p.requiresSync = true
                p.save()
            }
        }
    }

    @Nonnull
    private List<String> systemGroups() {
        accountService.getLoggedInUserIsAdmin() ? [Group.USERS, Group.ADMINS] : [Group.USERS]
    }

    @Nonnull
    @Transactional(readOnly = true)
    private Set<Group> findSystemGroups() {
        Set<Group> groups = Group.withCriteria {
            and {
                'in'('name', systemGroups())
                'eq'('automatic', true)
            }
            cache(true)
        } as Set

        groups ?: emptySet()
    }

    @Nonnull
    @Transactional(readOnly = true)
    private Set<Group> findSystemStackDefaultGroups() {
        Set<Group> groups = Stack.withCriteria {
            groups {
                'in'('name', systemGroups())
                'eq'('automatic', true)
            }

            fetchMode('defaultGroup', FetchMode.JOIN)
        }*.defaultGroup as Set

        groups ?: emptySet()
    }

}
