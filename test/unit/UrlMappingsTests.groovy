//must be in the default package since UrlMappings is in the default package

import grails.test.mixin.TestFor
import grails.test.mixin.Mock

import org.codehaus.groovy.grails.web.servlet.mvc.GrailsWebRequest
import org.springframework.web.context.request.RequestContextHolder

import ozone.owf.grails.controllers.*

@TestFor(UrlMappings)
@Mock([DashboardController,PersonWidgetDefinitionController,
    AdministrationController,WidgetDefinitionController,
    PreferenceController,TestErrorController,
    PersonController])
public class UrlMappingsTests {
	/**
	 *
	 * Integration Tests For Url Mappings To Preferences
	 *
	 */
	void testAdminPreferenceShowActionWithNamespaceAndPathParams() {
		sendHttpRequestMethod("get")
		assertForwardUrlMapping('/prefs/preference/namespace1/path1', controller:'preference', action:'show')
		{
			prefNamespace = 'namespace1'
			path = 'path1'
		}
	}

	void testAdminPreferenceShowActionWithPathParams() {
		sendHttpRequestMethod("get")
		assertForwardUrlMapping('/prefs/preference/namespace1', controller:'preference', action:'list')
		{
			prefNamespace = 'namespace1'
		}
	}

	void testAdminPreferenceShowAction() {
		sendHttpRequestMethod("get")
		assertForwardUrlMapping('/prefs/preference', controller:'preference', action:'list')
	}

	void testAdminPreferenceCreateActionWithNamespaceAndPathParams() {
		sendHttpRequestMethod("post")
		assertForwardUrlMapping('/prefs/preference/namespace1/path1', controller:'preference', action:'create')
		{
			prefNamespace = 'namespace1'
			path = 'path1'
		}
	}

	void testAdminPreferenceCreateActionWithNamespaceParams() {
		sendHttpRequestMethod("post")
		assertForwardUrlMapping('/prefs/preference/namespace1', controller:'preference', action:'create')
		{
			prefNamespace = 'namespace1'
		}
	}

	void testAdminPreferenceCreateAction() {
		sendHttpRequestMethod("post")
		assertForwardUrlMapping('/prefs/preference', controller:'preference', action:'list')
	}

	void testAdminPreferenceUpdateActionWithNamespaceAndPathParams() {
		sendHttpRequestMethod("put")
		assertForwardUrlMapping('/prefs/preference/namespace1/path1', controller:'preference', action:'update')
		{
			prefNamespace = 'namespace1'
			path = 'path1'
		}
	}

	void testAdminPreferenceUpdateActionWithNamespaceParams() {
		sendHttpRequestMethod("put")
		assertForwardUrlMapping('/prefs/preference/namespace1', controller:'preference', action:'update')
		{
			prefNamespace = 'namespace1'
		}
	}

	void testAdminPreferenceUpdateAction() {
		sendHttpRequestMethod("put")
		assertForwardUrlMapping('/prefs/preference', controller:'preference', action:'list')
	}

	void testAdminPreferenceDeleteActionWithNamespaceAndPathParams() {
		sendHttpRequestMethod("delete")
		assertForwardUrlMapping('/prefs/preference/namespace1/path1', controller:'preference', action:'delete')
		{
			prefNamespace = 'namespace1'
			path = 'path1'
		}
	}

	void testAdminPreferenceDeleteActionWithNamespaceParams() {
		sendHttpRequestMethod("delete")
		assertForwardUrlMapping('/prefs/preference/namespace1', controller:'preference', action:'delete')
		{
			prefNamespace = 'namespace1'
		}
	}

	void testAdminPreferenceDeleteAction() {
		sendHttpRequestMethod("delete")
		assertForwardUrlMapping('/prefs/preference', controller:'preference', action:'list')
	}

//	void testAdminPreferenceBulkDeleteActionWithNamespaceAndPathParams() {
//		sendHttpRequestMethod("delete", "preferencesToDelete")
//		assertForwardUrlMapping('/prefs/preference/namespace1/path1', controller:'preference', action:'bulkDelete')
//		{
//			prefNamespace = 'namespace1'
//			path = 'path1'
//		}
//	}

//	void testAdminPreferenceBulkDeleteActionWithNamespaceParams() {
//		sendHttpRequestMethod("delete", "preferencesToDelete")
//		assertForwardUrlMapping('/prefs/preference/namespace1', controller:'preference', action:'bulkDelete')
//		{
//			prefNamespace = 'namespace1'
//		}
//	}

//	void testAdminPreferencBulkDeleteAction() {
//		sendHttpRequestMethod("delete", "preferencesToDelete")
//		assertForwardUrlMapping('/prefs/preference', controller:'preference', action:'bulkDelete')
//	}

	void testHasPreferenceUrl() {
		assertForwardUrlMapping('/prefs/hasPreference/namespace1/path1', controller:'preference', action:'doesPreferenceExist')
	}

	void testServerVersionUrl() {
		assertForwardUrlMapping('/prefs/server/resources', controller:'preference', action:'serverResources')
	}
	/**
	 *
	 * Integration Tests For Url Mappings To Widget Definitions
	 *
	 */
	void testAdminWidgetDefinitionsShowActionWithWidgetGuidParams() {
		sendHttpRequestMethod("get")
		assertForwardUrlMapping('/prefs/widgetDefinition/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'widgetDefinition', action:'show')
		{
			widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminWidgetDefinitionsListAction() {
		sendHttpRequestMethod("get")
		assertForwardUrlMapping('/prefs/widgetDefinition', controller:'widgetDefinition', action:'list')
	}

	void testAdminWidgetDefinitionsCreateActionWithWidgetGuidParams() {
		sendHttpRequestMethod("post")
		assertForwardUrlMapping('/prefs/widgetDefinition/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'widgetDefinition', action:'create')
		{
			widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminWidgetDefinitionsCreateAction() {
		sendHttpRequestMethod("post")
		assertForwardUrlMapping('/prefs/widgetDefinition', controller:'widgetDefinition', action:'create')
	}

	void testAdminWidgetDefinitionsUpdateActionWithWidgetGuidParams() {
		sendHttpRequestMethod("put")
		assertForwardUrlMapping('/prefs/widgetDefinition/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'widgetDefinition', action:'update')
		{
			widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminWidgetDefinitionsDeleteActionWithWidgetGuidParams() {
		sendHttpRequestMethod("delete")
		assertForwardUrlMapping('/prefs/widgetDefinition/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'widgetDefinition', action:'delete')
		{
			widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminWidgetDefinitionsBulkDeleteActionWithWidgetGuidParams() {
		sendHttpRequestMethod("delete", "widgetGuidsToDelete")
		assertForwardUrlMapping('/prefs/widgetDefinition/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'widgetDefinition', action:'bulkDelete')
		{
			widgetGuid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminWidgetDefinitionsBulkDeleteAction() {
		sendHttpRequestMethod("delete", "widgetGuidsToDelete")
		assertForwardUrlMapping('/prefs/widgetDefinition', controller:'widgetDefinition', action:'bulkDelete')
	}

	/**
	 *
	 * Integration Tests For Url Mappings To Person Widget Definitions
	 *
	 */
	void testAdminPersonWidgetDefinitionsShowActionForGuidParams() {
		sendHttpRequestMethod("get")
		assertForwardUrlMapping('/prefs/widget/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'personWidgetDefinition', action:'show')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminPersonWidgetDefinitionsListAction() {
		sendHttpRequestMethod("get")
		assertForwardUrlMapping('/prefs/widget', controller:'personWidgetDefinition', action:'list')
	}

	void testAdminPersonWidgetDefinitionsCreateActionForGuidParams() {
		sendHttpRequestMethod("post")
		assertForwardUrlMapping('/prefs/widget/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'personWidgetDefinition', action:'create')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminPersonWidgetDefinitionsUpdateActionForGuidParams() {
		sendHttpRequestMethod("put")
		assertForwardUrlMapping('/prefs/widget/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'personWidgetDefinition', action:'update')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminPersonWidgetDefinitionsDeleteActionForGuidParams() {
		sendHttpRequestMethod("delete")
		assertForwardUrlMapping('/prefs/widget/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'personWidgetDefinition', action:'delete')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminPersonWidgetDefinitionsBulkDeleteActionForGuidParams() {
		sendHttpRequestMethod("delete", "widgetGuidsToDelete")
		assertForwardUrlMapping('/prefs/widget/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'personWidgetDefinition', action:'bulkDelete')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminPersonWidgetDefinitionsBulkUpdateActionForGuidParams() {
		sendHttpRequestMethod("put", "widgetsToUpdate")
		assertForwardUrlMapping('/prefs/widget/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'personWidgetDefinition', action:'bulkUpdate')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminPersonWidgetDefinitionBulkDeleteAndUpdateActionForGuidParams() {
		sendHttpRequestMethod("put", "widgetGuidsToDelete", "widgetsToUpdate")
		assertForwardUrlMapping('/prefs/widget/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'personWidgetDefinition', action:'bulkDeleteAndUpdate')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testWidgetListMapping()  {
		assertForwardUrlMapping('/prefs/widgetList', controller:'personWidgetDefinition', action:'widgetList')
	}

	/**
	 *
	 * Integration Tests For Url Mappings To Dashboard
	 *
	 */
	void testAdminDashboardShowActionForGuidParams() {
		sendHttpRequestMethod("get")
		assertForwardUrlMapping('/prefs/dashboard/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'dashboard', action:'show')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminDashboardListAction() {
		assertForwardUrlMapping('/prefs/dashboard', controller:'dashboard', action:'list')
	}

	void testAdminDashboardCreateActionForGuidParams() {
		sendHttpRequestMethod("post")
		assertForwardUrlMapping('/prefs/dashboard/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'dashboard', action:'create')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminDashboardUpdateActionForGuidParams() {
		sendHttpRequestMethod("put")
		assertForwardUrlMapping('/prefs/dashboard/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'dashboard', action:'update')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminDashboardDeleteActionForGuidParams() {
		sendHttpRequestMethod("delete")
		assertForwardUrlMapping('/prefs/dashboard/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'dashboard', action:'delete')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminDashboardBulkDeleteActionForNamespaceAndPathParams() {
		sendHttpRequestMethod("delete", "viewGuidsToDelete")
		assertForwardUrlMapping('/prefs/dashboard/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'dashboard', action:'bulkDelete')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminDashboardBulkDeleteActionForNamespaceParams() {
		sendHttpRequestMethod("put", "viewsToUpdate")
		assertForwardUrlMapping('/prefs/dashboard/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'dashboard', action:'bulkUpdate')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	void testAdminDashboardBulkDeleteActionPathParams() {
		sendHttpRequestMethod("put", "viewGuidsToDelete", "viewsToUpdate")
		assertForwardUrlMapping('/prefs/dashboard/0c5435cf-4021-4f2a-ba69-dde451d12551', controller:'dashboard', action:'bulkDeleteAndUpdate')
		{
			guid = '0c5435cf-4021-4f2a-ba69-dde451d12551'
		}
	}

	/**
	 *
	 * Integration Tests For Url Mappings To Dashboard
	 *
	 */
	void testAdministrationControllerWithAddCopyDashboardAction() {
		assertForwardUrlMapping('/prefs/administration/addCopyDashboard/id', controller:'administration', action:'addCopyDashboard')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithEditDashboardAction() {
		assertForwardUrlMapping('/prefs/administration/editDashboard/id', controller:'administration', action:'editDashboard')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithListDashboardsAction() {
		assertForwardUrlMapping('/prefs/administration/listDashboards/id', controller:'administration', action:'listDashboards')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithDeleteDashboardsAction() {
		assertForwardUrlMapping('/prefs/administration/deleteDashboards/id', controller:'administration', action:'deleteDashboards')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithUpdateDashboardAction() {
		assertForwardUrlMapping('/prefs/administration/updateDashboard/id', controller:'administration', action:'updateDashboard')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithAddCopyDashboardSubmitAction() {
		assertForwardUrlMapping('/prefs/administration/addCopyDashboardSubmit/id', controller:'administration', action:'addCopyDashboardSubmit')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithEditPreferenceAction() {
		assertForwardUrlMapping('/prefs/administration/editPreference/id', controller:'administration', action:'editPreference')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithUpdatePreferenceAction() {
		assertForwardUrlMapping('/prefs/administration/updatePreference/id', controller:'administration', action:'updatePreference')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithAddCopyPreferenceAction() {
		assertForwardUrlMapping('/prefs/administration/addCopyPreference/id', controller:'administration', action:'addCopyPreference')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithAddCopyPreferenceSubmitActionAction() {
		assertForwardUrlMapping('/prefs/administration/addCopyPreferenceSubmit/id', controller:'administration', action:'addCopyPreferenceSubmit')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithListPreferencesAction() {
		assertForwardUrlMapping('/prefs/administration/listPreferences/id', controller:'administration', action:'listPreferences')
		{
			id = 'id'
		}
	}

	void testAdministrationControllerWithDeletePreferencesAction() {
		assertForwardUrlMapping('/prefs/administration/deletePreferences/id', controller:'administration', action:'deletePreferences')
		{
			id = 'id'
		}
	}

	/**
	 * Test Admin url mapping for person controller
	 */
	void testAdminUrlMappingForPersonController() {
		assertForwardUrlMapping('/prefs/person/whoami', controller:'person', action:'whoami')
	}

	/**
	 * Test testerror url mapping for index action
	 */
	void testTestErrorUrlMapping() {
		assertForwardUrlMapping('/testerror', controller:'testError', action:'index')
	}

	/**
	 * Test testerror url mapping for throwError action
	 */
	void testTestErrorUrlMappingWithThrowErrorAction() {
		assertForwardUrlMapping('/testerror/throwerror', controller:'testError', action:'throwError')
	}

	/**
	 * Url Mapping Integration Tests Helper Methods
	 */
	private void sendHttpRequestMethod(httpMethod) {
		GrailsWebRequest webRequest = (GrailsWebRequest) RequestContextHolder.getRequestAttributes();
		String method = webRequest.getCurrentRequest().getMethod().toUpperCase()
		Map params = webRequest.getParameterMap()
		params["_method"] = httpMethod
	}

	private void sendHttpRequestMethod(httpMethod, bulkAction) {
		GrailsWebRequest webRequest = (GrailsWebRequest) RequestContextHolder.getRequestAttributes();
		String method = webRequest.getCurrentRequest().getMethod().toUpperCase()
		Map params = webRequest.getParameterMap()
		params["_method"] = httpMethod
		params[bulkAction] = bulkAction
	}

	private void sendHttpRequestMethod(httpMethod, params1, params2) {
		GrailsWebRequest webRequest = (GrailsWebRequest) RequestContextHolder.getRequestAttributes();
		String method = webRequest.getCurrentRequest().getMethod().toUpperCase()
		Map params = webRequest.getParameterMap()
		params["_method"] = httpMethod
		params[params1] = params1
		params[params2] = params2
	}

}
