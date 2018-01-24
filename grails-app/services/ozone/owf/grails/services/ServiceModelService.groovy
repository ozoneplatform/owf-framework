package ozone.owf.grails.services

import org.ocpsoft.prettytime.PrettyTime

import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.domain.Stack
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetType
import ozone.owf.grails.services.model.DashboardServiceModel
import ozone.owf.grails.services.model.GroupServiceModel
import ozone.owf.grails.services.model.PersonServiceModel
import ozone.owf.grails.services.model.PersonWidgetDefinitionServiceModel
import ozone.owf.grails.services.model.PreferenceServiceModel
import ozone.owf.grails.services.model.ServiceModel
import ozone.owf.grails.services.model.StackServiceModel
import ozone.owf.grails.services.model.WidgetDefinitionServiceModel
import ozone.owf.grails.services.model.WidgetTypeServiceModel
import ozone.owf.grails.util.OWFDate

/**
 * A service to map domain models to JSON
 *
 * TODO: Does Grails 3.3 offer anything to simplify this, such as JSON Views?
 */
class ServiceModelService {

    WidgetRequiredIdsService widgetRequiredIdsService

    ServiceModel createServiceModel(Object obj, Map params = [:]) {
        ServiceModel model
        Class clazz = obj?.class

        switch (clazz) {

            case Dashboard:
                Dashboard domain = (Dashboard) obj
                def prettytime = new PrettyTime()
                model = new DashboardServiceModel(
                        name: domain.name,
                        guid: domain.guid,
                        isdefault: domain.isdefault,
                        dashboardPosition: domain.dashboardPosition,
                        locked: domain.locked,
                        user: createServiceModel(domain.user) as PersonServiceModel,
                        alteredByAdmin: domain.alteredByAdmin ?: false,
                        isGroupDashboard: params.isGroupDashboard ?: false,
                        groups: params.groups != null ? params.groups.collect { createServiceModel(it) } : [],
                        description: domain.description,
                        iconImageUrl: domain.iconImageUrl,
                        type: domain.type,
                        createdDate: OWFDate.standardShortDateDisplay(domain.createdDate),
                        prettyCreatedDate: domain.createdDate != null ? prettytime.format(domain.createdDate) : '',
                        editedDate: OWFDate.standardShortDateDisplay(domain.editedDate),
                        prettyEditedDate: domain.editedDate != null ? prettytime.format(domain.editedDate) : '',
                        createdBy: createServiceModel(domain.createdBy) as PersonServiceModel,
                        layoutConfig: domain.layoutConfig,
                        stack: createServiceModel(domain.stack) as StackServiceModel,
                        markedForDeletion: domain.markedForDeletion,
                        publishedToStore: domain.publishedToStore
                )
                break

            case Person:
                Person domain = (Person) obj
                model = new PersonServiceModel(
                        id: domain.id,
                        username: domain.username,
                        userRealName: domain.userRealName,
                        email: domain.email ?: '',
                        lastLogin: domain.lastLogin ? domain.lastLogin.getTime() : null,
                        totalWidgets: params.totalWidgets ? params.totalWidgets : 0,
                        totalGroups: params.totalGroups ? params.totalGroups : 0,
                        totalDashboards: params.totalDashboards ? params.totalDashboards : 0,
                        totalStacks: params.totalStacks ?: 0
                )
                break

            case PersonWidgetDefinition:
                PersonWidgetDefinition domain = (PersonWidgetDefinition) obj
                model = new PersonWidgetDefinitionServiceModel(
                        id: domain.id,
                        person: createServiceModel(domain.person) as PersonServiceModel,
                        widgetDefinition: createServiceModel(domain.widgetDefinition) as WidgetDefinitionServiceModel,
                        pwdPosition: domain.pwdPosition,
                        groupWidget: domain.groupWidget,
                        favorite: domain.favorite,
                        visible: domain.visible,
                        displayName: domain.displayName,
                        disabled: domain.disabled,
                        groups: params.groups != null ? params.groups.collect { createServiceModel(it) } : [],
                        editable: params.editable != null ? params.editable : true
                )
                break

            case Group:
                Group domain = (Group) obj
                model = new GroupServiceModel(
                        id: domain.id,
                        name: domain.name,
                        displayName: domain.displayName,
                        description: domain.description,
                        email: domain.email,
                        automatic: domain.automatic,
                        stackDefault: domain.stackDefault,
                        totalUsers: params.totalUsers ? params.totalUsers : 0,
                        totalWidgets: params.totalWidgets ? params.totalWidgets : 0,
                        totalStacks: params.totalStacks ? params.totalStacks : 0,
                        status: domain.status
                )
                break

            case Preference:
                Preference domain = (Preference) obj
                model = new PreferenceServiceModel(
                        id: domain.id,
                        namespace: domain.namespace,
                        path: domain.path,
                        value: domain.value,
                        user: createServiceModel(domain.user) as PersonServiceModel
                )
                break

            case WidgetDefinition:
                WidgetDefinition domain = (WidgetDefinition) obj

                model = new WidgetDefinitionServiceModel(
                        id: domain.widgetGuid,
                        widgetGuid: domain.widgetGuid,
                        universalName: domain.universalName,
                        displayName: domain.displayName,
                        description: domain.description,
                        widgetUrl: domain.widgetUrl,
                        imageUrlSmall: domain.imageUrlSmall,
                        imageUrlMedium: domain.imageUrlMedium,
                        width: domain.width,
                        height: domain.height,
                        totalUsers: params.totalUsers ? params.totalUsers : 0,
                        totalGroups: params.totalGroups ? params.totalGroups : 0,
                        widgetVersion: domain.widgetVersion,
                        singleton: domain.singleton,
                        visible: domain.visible,
                        background: domain.background,
                        mobileReady: domain.mobileReady,
                        descriptorUrl: domain.descriptorUrl,
                        directRequired: params.directRequired ? params.directRequired : widgetRequiredIdsService.getDirectRequiredIds(domain),
                        allRequired: params.allRequired ? params.allRequired : widgetRequiredIdsService.getAllRequiredIds(domain),
                        intents: domain.widgetDefinitionIntents ?: [],
                        widgetTypes: domain.widgetTypes.collect { createServiceModel(it) }
                )
                break

            case WidgetType:
                WidgetType widgetType = (WidgetType) obj
                model = new WidgetTypeServiceModel(
                        id: widgetType.id,
                        name: widgetType.name,
                        displayName: widgetType.displayName
                )
                break
            case Stack:
                model = createStackServiceModel((Stack) obj, params)
                break

            default:
                model = null
                break
        }


        return model
    }

    StackServiceModel createStackServiceModel(Stack stack, Map params) {
        new StackServiceModel(
                id: stack.id,
                name: stack.name,
                description: stack.description,
                stackContext: stack.stackContext,
                imageUrl: stack.imageUrl,
                descriptorUrl: stack.descriptorUrl,
                groups: stack.groups?.findResults { createServiceModel(it) } ?: [],
                totalDashboards: params.totalDashboards ?: 0,
                totalUsers: params.totalUsers ?: 0,
                totalGroups: params.totalGroups ?: 0,
                totalWidgets: params.totalWidgets ?: 0,
                owner: createServiceModel(stack.owner) as PersonServiceModel,
                defaultGroup: createServiceModel(stack.defaultGroup) as GroupServiceModel,
                approved: stack.approved)
    }

    WidgetTypeServiceModel createWidgetTypeServiceModel(WidgetType widgetType) {
        new WidgetTypeServiceModel(
                id: widgetType.id,
                name: widgetType.name,
                displayName: widgetType.displayName)
    }

}
