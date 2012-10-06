package ozone.owf.grails.services

import ozone.owf.grails.services.model.ServiceModel
import ozone.owf.grails.services.model.DashboardServiceModel
import ozone.owf.grails.services.model.DashboardWidgetStateServiceModel
import ozone.owf.grails.services.model.PersonServiceModel

import ozone.owf.grails.services.model.PreferenceServiceModel
import ozone.owf.grails.services.model.WidgetDefinitionServiceModel
import org.grails.taggable.TagLink
import ozone.owf.grails.util.OWFDate
import ozone.owf.grails.services.model.TagLinkServiceModel
import ozone.owf.grails.services.model.PersonWidgetDefinitionServiceModel
import ozone.owf.grails.services.model.GroupServiceModel
import ozone.owf.grails.services.model.WidgetTypeServiceModel

import ozone.owf.grails.domain.Dashboard
import ozone.owf.grails.domain.DashboardWidgetState
import ozone.owf.grails.domain.Intent
import ozone.owf.grails.domain.Person
import ozone.owf.grails.domain.PersonWidgetDefinition
import ozone.owf.grails.domain.Group
import ozone.owf.grails.domain.Preference
import ozone.owf.grails.domain.WidgetDefinition
import ozone.owf.grails.domain.WidgetDefinitionIntent
import ozone.owf.grails.domain.WidgetType

/**
 *
 * @author ntabernero
 * @version $Id: $
 * @since May 27, 2010 3:55:50 PM
 */
class ServiceModelService {

  def grailsApplication

  public ServiceModel createServiceModel(obj, params = [:]) {
    ServiceModel model
    Class clazz = obj?.class

    switch (clazz) {

      case Dashboard:
        Dashboard domain = (Dashboard) obj
        
        model = new DashboardServiceModel(
                name: domain.name,
                guid: domain.guid,
                layout: domain.layout,
                isdefault: domain.isdefault,
                locked: domain.locked,
                columnCount: domain.columnCount ?: 0,
                user: createServiceModel(domain.user),
                alteredByAdmin: domain.alteredByAdmin ?: false,
                state: domain.state.collect{ createServiceModel(it) },
                isGroupDashboard: params.isGroupDashboard ?: false,
                groups: params.groups != null ? params.groups.collect{ createServiceModel(it) } : [],
				description: domain.description,
				defaultSettings: domain.defaultSettings,
				showLaunchMenu: domain.showLaunchMenu,
				createdDate: OWFDate.standardShortDateDisplay(domain.createdDate),
				editedDate: OWFDate.standardShortDateDisplay(domain.editedDate),
				createdBy: createServiceModel(domain.createdBy),
                layoutConfig: domain.layoutConfig,
                intentConfig: domain.intentConfig
        )
        break

      case DashboardWidgetState:
        DashboardWidgetState domain = (DashboardWidgetState) obj
        model = new DashboardWidgetStateServiceModel(
                uniqueId: domain.uniqueId,
                widgetGuid: domain.personWidgetDefinition ? domain.personWidgetDefinition.widgetDefinition?.widgetGuid : domain.widgetGuid,
                name: domain.name,
                active: domain.active ?: false,
                width: domain.width ?: 0,
                height: domain.height ?: 0,
                x: domain.x ?: 0,
                y: domain.y ?: 0,
                zIndex: domain.zIndex ?: 0,
                minimized: domain.minimized ?: false,
                maximized: domain.maximized ?: false,
                pinned: domain.pinned ?: false,
                collapsed: domain.collapsed ?: false,
                columnPos: domain.columnPos ?: 0,
                buttonId: domain.buttonId,
                buttonOpened: domain.buttonOpened ?: false,
                region: domain.region ?: "none",
                statePosition: domain.statePosition ?: 0,
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
				totalGroups: params.totalGroups ? params.totalGroups: 0,
				totalDashboards: params.totalDashboards ? params.totalDashboards: 0
        )
        break

      case PersonWidgetDefinition:
        PersonWidgetDefinition domain = (PersonWidgetDefinition) obj
        model = new PersonWidgetDefinitionServiceModel(
                id: domain.id,
                person: createServiceModel(domain.person),
                widgetDefinition: createServiceModel(domain.widgetDefinition),
                pwdPosition: domain.pwdPosition,
                groupWidget: domain.groupWidget,
                favorite: domain.favorite,
                visible: domain.visible,
                displayName: domain.displayName,
                disabled: domain.disabled,
                groups: params.groups != null ? params.groups.collect{ createServiceModel(it) } : [],
                editable: params.editable != null ? params.editable : true,
                tagLinks: params.tagLinks ? params.tagLinks.collect {
                  createServiceModel(it)
                } : domain.getTags().collect {
                  createServiceModel(it)
                }
        );
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
                totalUsers: params.totalUsers ? params.totalUsers : 0,
                totalWidgets: params.totalWidgets ? params.totalWidgets : 0,
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
                user: createServiceModel(domain.user)
        )
        break

      case WidgetDefinition:
        WidgetDefinition domain = (WidgetDefinition) obj

        //lazy initializtion of reference to WidgetDefinitionService.
        //We can't use injection because of the circular dependency between
        //the two services
        def widgetDefinitionServiceBean = 
            grailsApplication.mainContext.getBean('widgetDefinitionService')

        model = new WidgetDefinitionServiceModel(
            id: domain.widgetGuid,
            widgetGuid: domain.widgetGuid,
            universalName: domain.universalName,
            displayName: domain.displayName,
            description: domain.description,
            widgetUrl: domain.widgetUrl,
            imageUrlSmall: domain.imageUrlSmall,
            imageUrlLarge: domain.imageUrlLarge,
            width: domain.width,
            height: domain.height,
            totalUsers: params.totalUsers ? params.totalUsers : 0,
            totalGroups: params.totalGroups ? params.totalGroups : 0,
            widgetVersion: domain.widgetVersion,
            singleton: domain.singleton?true:false,
            visible: domain.visible,
            background: domain.background,
            descriptorUrl: domain.descriptorUrl,
			directRequired: params.directRequired ? params.directRequired : widgetDefinitionServiceBean.getDirectRequiredIds(domain),
			allRequired:  params.allRequired ? params.allRequired : widgetDefinitionServiceBean.getAllRequiredIds(domain),
            tagLinks: params.tagLinks ? params.tagLinks.collect {
                createServiceModel(it)
            } : domain.getTags().collect {
                createServiceModel(it)
            },
            intents: domain.widgetDefinitionIntents ?: [],
            widgetTypes: domain.widgetTypes.collect{ createServiceModel(it) }
        );
        break

      case TagLink:
        TagLink tagLink = (TagLink) obj
        model = new TagLinkServiceModel(
                name: tagLink.tag.name,
                visible: tagLink.visible,
                position: tagLink.position,
                editable: tagLink.editable
        );
        break
      case WidgetType:
        WidgetType widgetType = (WidgetType) obj
        model = new WidgetTypeServiceModel(
                id: widgetType.id,
                name: widgetType.name
        )
        break
      default:
        model = null
        break
    }


    return model
  }
}
