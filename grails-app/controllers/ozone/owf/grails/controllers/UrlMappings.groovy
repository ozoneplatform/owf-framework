package ozone.owf.grails.controllers

import org.springframework.web.context.request.RequestContextHolder

import org.grails.web.servlet.mvc.GrailsWebRequest


class UrlMappings {
    static def getAction = {
        GrailsWebRequest webRequest = (GrailsWebRequest) RequestContextHolder.getRequestAttributes();
        String method = webRequest.getCurrentRequest().getMethod().toUpperCase()
        Map params = webRequest.getParameterMap()

        // parse _method to map to RESTful controller action
        String methodParam = params?."_method"?.toUpperCase()
        if (methodParam) method = methodParam
        switch (method) {
            case 'GET':
                return "list"

            case 'POST':
                return "createOrUpdate"

            case 'PUT':
                return "createOrUpdate"

            case 'DELETE':
                return "delete"

            default:
                return "list"
        }
    }

    static def handleDashboardAction = {
        GrailsWebRequest webRequest = (GrailsWebRequest) RequestContextHolder.getRequestAttributes();
        String method = webRequest.getCurrentRequest().getMethod().toUpperCase()
        Map params = webRequest.getParameterMap()

        if (params?."testCreate" == 'true') {
            return "create"
        }

        // parse _method to map to RESTful controller action
        String methodParam = params?."_method"?.toUpperCase()
        if (methodParam == 'PUT' || methodParam == 'DELETE' || methodParam == 'GET' || methodParam == 'POST') {
            method = methodParam
        }

        //Perform both Bulk delete and Bulk update...
        //Bulk update...
        if ((params?."viewGuidsToDelete" != null) && (params?."viewsToUpdate" != null) && (method == 'PUT')) {

            return "bulkDeleteAndUpdate"
        }

        //Bulk delete...
        if ((params?."viewGuidsToDelete" != null) && (method == 'DELETE')) {
            return "bulkDelete"

        }

        //Bulk update...
        if ((params?."viewsToUpdate" != null) && (method == 'PUT')) {

            return "bulkUpdate"
        }

        if (params.isdefault && method == 'GET') {
            return "getdefault"
        }

        if (params.guid) {
            // scan through methods to assign action
            if (method == 'GET') {
                return "show"
            }
            else if (method == 'POST') {
                return "create"
            }
            else if (method == 'PUT') {
                return "update"
            }
            else if (method == 'DELETE') {
                return "delete"
            }
            else {
                return "show"
            }
        }

        return "list"
    }

    static mappings = {

        '500' controller: 'error'

        '/' view: '/index'

        '/login' view: '/login'

        // Legacy link mappings
        '/admin/Configuration' view: '/admin/Configuration'
        '/admin/DashboardEdit' view: '/admin/DashboardEdit'
        '/admin/GroupDashboardManagement' view: '/admin/GroupDashboardManagement'
        '/admin/GroupEdit' view: '/admin/GroupEdit'
        '/admin/GroupManagement' view: '/admin/GroupManagement'
        '/admin/MarketplaceApprovals' view: '/admin/MarketplaceApprovals'
        '/admin/StackEdit' view: '/admin/StackEdit'
        '/admin/StackManagement' view: '/admin/StackManagement'
        '/admin/UserEdit' view: '/admin/UserEdit'
        '/admin/UserManagement' view: '/admin/UserManagement'
        '/admin/WidgetEdit' view: '/admin/WidgetEdit'
        '/admin/WidgetManagement' view: '/admin/WidgetManagement'

        "/js/$path**" controller: 'redirect', action: 'redirectToScriptAssets'
        '/js/config/config.js' controller: 'config', action: 'config'
        "/js-lib/$path**" controller: 'redirect', action: 'redirectToVendorAssets'
        "/js-plugins/$subPath**" controller: 'mergedDirectoryResource', action: 'findJavascriptPluginResource'

        "/help/$subPath**" controller: 'mergedDirectoryResource', action: 'findHelpResource'

        "/themes/$subPath**" controller: 'mergedDirectoryResource', action: 'findThemeResource'

        "/themes" controller: 'theme', action: 'getAvailableThemes'

        "/images/$img_name**" controller: 'theme', action: 'getImageURL'

        "/admin/images/$img_name**"(controller: 'theme', action: 'getImageURL') {
            isImageReqAdmin = true
        }

        "/context/root" controller: 'context', action: 'index'

        // Mapping for generic preference objects
        //NOTE: 'namespace' has special meaning as a url parameter in grails 2.  Therefore we
        //changed it to prefsNamespace
        "/prefs/preference/$prefNamespace?/$path?" {
            controller = "preference"
            action = {
                GrailsWebRequest webRequest = (GrailsWebRequest) RequestContextHolder.getRequestAttributes();
                String method = webRequest.getCurrentRequest().getMethod().toUpperCase()
                Map params = webRequest.getParameterMap()

                // parse _method to map to RESTful controller action
                String methodParam = params?."_method"?.toUpperCase()
                if (methodParam == 'PUT' || methodParam == 'DELETE' || methodParam == 'GET' || methodParam == 'POST') {
                    method = methodParam
                }
                //Bulk delete...
                if ((params?."preferencesToDelete" != null) && (method == 'DELETE')) {
                    return "bulkDelete"

                }

                if (params.prefNamespace || params.path) {
                    // scan through methods to assign action
                    if (method == 'GET') {
                        return (params.path ? "show" : "list")
                    }
                    else if (method == 'POST') {
                        return "create"
                    }
                    else if (method == 'PUT') {
                        return "update"
                    }
                    else if (method == 'DELETE') {
                        return "delete"
                    }
                    else {
                        return (params.path ? "show" : "list")
                    }
                }
                return "list"
            }
        }

        "/prefs/hasPreference/$prefNamespace/$path" controller: "preference", action: "doesPreferenceExist"

        "/prefs/server/resources" controller: "preference", action: "serverResources"

        //Mapping for widget definitions
        "/prefs/widgetDefinition/$widgetGuid?" {
            controller = "widgetDefinition"
            action = {
                GrailsWebRequest webRequest = (GrailsWebRequest) RequestContextHolder.getRequestAttributes();
                String method = webRequest.getCurrentRequest().getMethod().toUpperCase()
                Map params = webRequest.getParameterMap()

                // parse _method to map to RESTful controller action
                String methodParam = params?."_method"?.toUpperCase()
                if (methodParam == 'PUT' || methodParam == 'DELETE' || methodParam == 'GET' || methodParam == 'POST') {
                    method = methodParam
                }

                //Bulk delete...
                if ((params?."widgetGuidsToDelete" != null) && (method == 'DELETE')) {
                    return "bulkDelete"

                }

                // scan through methods to assign action
                if (method == 'GET') {
                    return (params.widgetGuid) ? "show" : "list"
                }
                else if (method == 'POST') {
                    if (params.limit != null && params.start != null) {
                        return "list"
                    }
                    return "create"
                }
                else if (method == 'PUT') {
                    return "update"
                }
                else if (method == 'DELETE') {
                    return "delete"
                }
                else {
                    return "show"
                }
            }
        }
        // Mapping for person-widget definitions
        "/prefs/widget/$guid?" {
            controller = "personWidgetDefinition"
            action = {
                GrailsWebRequest webRequest = (GrailsWebRequest) RequestContextHolder.getRequestAttributes();
                String method = webRequest.getCurrentRequest().getMethod().toUpperCase()
                Map params = webRequest.getParameterMap()

                // parse _method to map to RESTful controller action
                String methodParam = params?."_method"?.toUpperCase()
                if (methodParam == 'PUT' || methodParam == 'DELETE' || methodParam == 'GET' || methodParam == 'POST') {
                    method = methodParam
                }

                //Perform both Bulk delete and Bulk update...
                //Bulk update...
                if ((params?."widgetGuidsToDelete" != null) && (params?."widgetsToUpdate" != null) && (method == 'PUT')) {

                    return "bulkDeleteAndUpdate"
                }

                //Bulk delete...
                if ((params?."widgetGuidsToDelete" != null) && (method == 'DELETE')) {
                    return "bulkDelete"

                }

                //Bulk update...
                if ((params?."widgetsToUpdate" != null) && (method == 'PUT')) {

                    return "bulkUpdate"
                }

                // scan through methods to assign action
                if (method == 'GET') {
                    return (params.guid) ? "show" : "list"
                }
                else if (method == 'POST') {
                    return "create"
                }
                else if (method == 'PUT') {
                    return "update"
                }
                else if (method == 'DELETE') {
                    return "delete"
                }
                else {
                    return "show"
                }
            }
        }

        "/prefs/widget/listUserAndGroupWidgets"(controller: 'personWidgetDefinition', action: 'listUserAndGroupWidgets')

        "/widget/hasMarketplace"(controller: 'widgetDefinition', action: 'hasMarketplace')

        // Mapping for dashboard objects
        "/dashboard/$guid?" {
            controller = "dashboard"
            action = UrlMappings.getAction
        }

        "/prefs/dashboard/$guid?" {
            controller = "dashboard"
            action = UrlMappings.handleDashboardAction
        }

        "/prefs/widgetDefinition/dependents" {
            controller = "widgetDefinition"
            action = "dependents"
        }

        "/prefs/personWidgetDefinition/dependents" {
            controller = "personWidgetDefinition"
            action = "dependents"
        }

        //old admin urls
        "/prefs/administration/$action?/$id?" {
            controller = "administration"
        }

        //old admin urls
        "/administration/$action?/$id?" {
            controller = "administration"
        }

        // new admin urls
        "/user/$id?" {
            controller = "person"
            action = UrlMappings.getAction
        }
        "/dashboard/restore/$guid?" {
            controller = "dashboard"
            action = 'restore'
        }

        "/group/copyDashboard" controller: 'group', action: 'copyDashboard'

        "/group/$id?" {
            controller = "group"
            action = UrlMappings.getAction
        }

        "/stack/export" controller: 'stack', action: 'export'

        "/stack/share" controller: 'stack', action: 'share'

        "/stack/addPage" controller: 'stack', action: 'addPage'

        "/stack/import" controller: 'stack', action: 'importStack'

        "/stack/restore/$id?" controller: 'stack', action: 'restore'

        "/stack/listGroups/$id?" controller: 'stack', action: 'listGroups'

        "/stack/$id?" {
            controller = "stack"
            action = UrlMappings.getAction
        }

        "/widget/$guid/descriptor" {
            constraints {
                guid(matches: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/)
            }

            method = "GET"
            controller = "widget"
            action = "descriptor"
        }

        //Mapping for widget definitions
        "/widget/$widgetGuid?" {
            controller = "widget"
            action = UrlMappings.getAction
        }
        "/widget/export" {
            controller = "widget"
            action = "export"
        }
        "/widgetLoadTime" {
            controller = "widget"
            action = "saveWidgetLoadTime"
        }
        "/widget/listUserWidgets" {
            controller = "personWidgetDefinition"
            action = "listPersonWidgetDefinitions"
        }
        "/widgettype/list" {
            controller = "widgetType"
            action = "list"
        }

        "/prefs/person/whoami" {
            controller = "person"
            action = "whoami"
        }

        "/testerror" {
            controller = 'testError'
            action = 'index'
        }
        "/testerror/throwerror" {
            controller = 'testError'
            action = 'throwError'
        }
        "/testerror/throwerror2" {
            controller = 'testError'
            action = 'throwError2'
        }

        "/helpFiles" {
            controller = 'help'
            action = 'getFiles'
        }

        "/metric" {
            controller = 'metric'
            action = {
                GrailsWebRequest webRequest = (GrailsWebRequest) RequestContextHolder.getRequestAttributes();
                String method = webRequest.getCurrentRequest().getMethod().toUpperCase()
                Map params = webRequest.getParameterMap()

                // parse _method to map to RESTful controller action
                String methodParam = params?."_method"?.toUpperCase()
                if (methodParam == 'PUT' || methodParam == 'DELETE' || methodParam == 'GET' || methodParam == 'POST') {
                    method = methodParam
                }
                // scan through methods to assign action
                if (method == 'GET') {
                    return "list"
                }
                else if (method == 'POST') {
                    return "create"
                }
                //else if (method == 'PUT') {
                //    return "update"
                //}
                //    else if (method == 'DELETE') {
                //        return "bulkDelete"
                //}
                else {
                    return "list"
                }
            }
        }
        "/marketplace/sync/$guid" {
            controller = 'marketplace'
            action = 'retrieveFromMarketplace'
        }
        "/audit" {
            controller = 'audit'
            action = 'logMessage'
        }
        "/access/getConfig" {
            controller = 'access'
            action = 'getConfiguration'
        }
        "/access" {
            controller = 'access'
            action = 'checkAccess'
        }

        "/applicationConfiguration/configs/$id?" {
            controller = "applicationConfiguration"
            action = [GET: "list", PUT: "update"]
        }

        "/widgetDefinition/groupOwnedWidget" {
            controller = "widgetDefinition"
            action = "groupOwnedWidget"
        }


        "/messages" {
            controller = "messages"
            action = [GET: "list"]
        }

        '/person/me' {
            controller = 'person'
            action = [GET: 'myData']
        }

        '/person/me/widget' {
            controller = 'personWidgetDefinition'
            action = [GET: 'myWidgets']
        }

        '/person/me/dashboard' {
            controller = 'dashboard'
            action = [GET: 'myDashboards']
        }

    }
}
