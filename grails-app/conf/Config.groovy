import org.apache.log4j.RollingFileAppender
import org.apache.log4j.net.SyslogAppender
import grails.util.BuildSettingsHolder

// locations to search for config files that get merged into the main config
// config files can either be Java properties files or ConfigSlurper scripts

grails.config.locations = [
        "classpath:OzoneConfig.properties",
        "classpath:OwfConfig.groovy"
]
println "grails.config.locations = ${grails.config.locations}"

// if(System.properties["${appName}.config.location"]) {
//    grails.config.locations << "file:" + System.properties["${appName}.config.location"]
// }
grails.mime.file.extensions = false // enables the parsing of file extensions from URLs into the request format
grails.mime.types = [ html: ['text/html','application/xhtml+xml'],
    xml: ['text/xml', 'application/xml'],
    text: 'text-plain',
    js: 'text/javascript',
    rss: 'application/rss+xml',
    atom: 'application/atom+xml',
    css: 'text/css',
    csv: 'text/csv',
    all: '*/*',
    json: ['application/json','text/json'],
    form: 'application/x-www-form-urlencoded',
    multipartForm: 'multipart/form-data'
]
// The default codec used to encode data with ${}
grails.views.default.codec="none" // none, html, base64
grails.views.gsp.encoding="UTF-8"
grails.converters.encoding="UTF-8"

// enabled native2ascii conversion of i18n properties files
grails.enable.native2ascii = true

server.version = appVersion
server.baseVersion = appVersion?.toString()?.split("-")[0]
//println "server.baseVersion = ${server.baseVersion}"

//databasemigration settings
grails.plugin.databasemigration.updateOnStart = false

//context to use when upgrading automatically - 'upgrade' assumes there is a database
grails.plugin.databasemigration.updateOnStartContexts = "create,upgrade"

//list changelog's to run automatically
grails.plugin.databasemigration.updateOnStartFileNames  = [
        'changelog.groovy'
]

stamp{
    audit{
        //the created and edited fields should be present or they won't get added during AST
        createdBy="createdBy" //id who created
        createdDate="createdDate" // if you want a date stamp that is not the grails default dateCreated
        editedBy="editedBy" //id who updated/edited
        editedDate="editedDate"//use this field instead of the grails default lastUpdated
    }
}


//
//PROPERTY  DEFAULT VALUE   MEANING
//uiperformance.enabled true    set to false to disable processing
//uiperformance.processImages   true    set to false to disable processing for all images
//uiperformance.processCSS  true    set to false to disable processing for all .css files
//uiperformance.processJS   true    set to false to disable processing for all .js
//uiperformance.imageExtensions 'gif', 'png', 'jpg', 'ico' (+)  specify different values to change image types that are processed
//uiperformance.minifyJs    true    set to false to disable minification for all .js
//uiperformance.minifyJsAsErrorCheck    false   set to true to minify .js files in-memory for error checking but discard
//uiperformance.continueAfterMinifyJsError  false   set to true to only warn about .js minification problems rather than failing the build
//uiperformance.minifyCss   true    set to false to disable minification for all .css
//uiperformance.minifyCssAsErrorCheck   false   set to true to minify .css files in-memory for error checking but discard
//uiperformance.continueAfterMinifyCssError false   set to true to only warn about .css minification problems rather than failing the build
//uiperformance.keepOriginals   false   set to true to keep the original uncompressed and unversioned files in the war along with the compressed/versioned files
//uiperformance.html.compress   false   set to true to enable gzip for dynamic text content
//uiperformance.html.urlPatterns    none    set to restrict dynamic text url patterns that should be processed
//uiperformance.html.debug  false   set to true to enable PJL filter debug logging
//uiperformance.html.statsEnabled   false   set to true to enable PJL filter stats tracking
//uiperformance.html.compressionThreshold   1024    sets the minimum content length for compression
//uiperformance.html.jakartaCommonsLogger   none    set the category of the commons/log4j logger to debug to

uiperformance.enabled = true
uiperformance.processImages = false
uiperformance.inclusionsForCaching = [
    //        "**/examples/*.html",
        "**/*.ico",
        "**/*.jpg",
        "**/*.png",
        "**/*.gif"
]
uiperformance.exclusions = [
        "**/help/**",
        "**/sampleWidgets/**",
        "**/jsunit/**",
        "**/js-test/**",
        "**/js-doh/**",
        "**/js-lib/**",
        "**/js-min/**"

]

//baseDir exists then use svn version num as part of the version number
def basedir = BuildSettingsHolder.settings?.baseDir
if (basedir != null) {
    uiperformance.determineVersion = {->
        def version = System.getenv('SVN_REVISION')

        if (!version)
        //if SVN_REVISION is not defined (it is typically only defined by jenkins),
        //pick a random number instead
        version = new Random().nextInt()

        if (version.toString().charAt(0) != '-' ) version = '-' + version
        uiperformance.exclusions << "**/*${server.version + version}*"
        server.version + version
    }
}

uiperformance.continueAfterMinifyJsError = true
uiperformance.keepOriginals = true
uiperformance.deleteMinified = false
uiperformance.bundles = [
    [
        type: 'js',
        name: 'owf-widget',

        //custom fields for createBundles grails script
        minifiedName: 'owf-widget-min',
        debugName: 'owf-widget-debug',
        alternateDestDir: 'js-min',
        //custom fields for createBundles grails script

        files: [
            '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
            'util/pageload',
            'util/version',
            'util/util',
            'util/guid',
            'components/keys/HotKeys',
            'components/keys/KeyEventSender',
            'lang/ozone-lang',
            'lang/DateJs/globalization/en-US',
            'util/transport',
            'util/widget_utils',
            '../js-lib/shindig/util',
            '../js-lib/shindig/json',
            '../js-lib/shindig/rpc',
            '../js-lib/shindig/pubsub',
            '../js-lib/log4javascript/log4javascript',
            'util/log',
            'pref/preference',
            'eventing/Widget',
            'intents/WidgetIntents',
            'chrome/WidgetChrome',
            'dd/WidgetDragAndDrop',
            'launcher/WidgetLauncher',
            'state/WidgetStateHandler',
            'state/WidgetState',
            'eventing/WidgetProxy',
            'kernel/kernel-client',
            'metrics/BaseMetrics',
            'widget/Widget',
            'widget/widgetInit'
        ]
    ],
    [
        type: 'js',
        name: 'owf-marketplace-approval-widget',
                
        files: [

                '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
                'util/pageload',
                '../js-lib/ext-4.0.7/ext-all-debug',
                '../js-lib/patches/BorderLayoutAnimation',
                '../js-lib/patches/menuAlign',
                '../js-lib/patches/menuBlankImage',
                '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
                '../js-lib/patches/CreateInterceptor',
                '../js-lib/patches/PluginMerge',
                '../js-lib/patches/GridScroller',
                'util/version',
                'util/util',
                'components/util/InstanceVariablizer',
                'components/keys/HotKeys',
                'components/keys/KeyEventSender',
                'components/focusable/Focusable',
                'components/focusable/FocusableGridPanel',
                'components/layout/SearchBoxLayout',
                'components/form/field/SearchBox',
                'components/window/MessageBoxPlus',
                'lang/ozone-lang',
                'lang/DateJs/globalization/en-US',
                'util/transport',
                'util/widget_utils',
                '../js-lib/shindig/util',
                '../js-lib/shindig/json',
                '../js-lib/shindig/rpc',
                '../js-lib/shindig/pubsub',
                'eventing/Widget',
                '../js-lib/log4javascript/log4javascript',
                'util/log',
                'pref/preference',
                'launcher/WidgetLauncher',
                'state/WidgetStateHandler',
                'state/WidgetState',
                'chrome/WidgetChrome',
                'dd/WidgetDragAndDrop',
                'widget/Widget',
                '../js/data/ModelIdGenerator',
                '../js/data/OWFTransportProxy',
                '../js/data/OWFStore',
                '../js/data/models/WidgetDefinition',
                '../js/data/stores/AdminWidgetStore',
                '../js/data/stores/WidgetApprovalStore',
                '../js/components/admin/grid/WidgetApprovalsGrid',
                '../js/components/admin/widget/WidgetDetailPanel',
                '../js/components/admin/widget/ApprovePanel',
                '../js/components/admin/ManagementPanel',
                '../js/components/admin/widget/WidgetApprovalPanel',
                'widget/widgetInit'
        ]
    ],
    [
        type: 'js',
        name: 'owf-dashboard-edit-widget',

        files: [
                        '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
                        'util/pageload',
                        '../js-lib/ext-4.0.7/ext-all-debug',
                        '../js-lib/patches/BorderLayoutAnimation',
                        '../js-lib/patches/menuAlign',
                        '../js-lib/patches/menuBlankImage',
                        '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
                        '../js-lib/patches/CreateInterceptor',
                        '../js-lib/patches/PluginMerge',
                        '../js-lib/patches/GridScroller',
            //'../js-lib/patches/fieldWithToolTipIcon',
                        'util/version',
                        'util/util',
                        'util/guid',
                        'components/util/InstanceVariablizer',
                        'components/keys/HotKeys',
                        'components/keys/KeyEventSender',
                        'components/focusable/FocusableGridPanel',
                        'lang/ozone-lang',
                        'lang/DateJs/globalization/en-US',
                        'util/transport',
                        'util/widget_utils',
                        '../js-lib/shindig/util',
                        '../js-lib/shindig/json',
                        '../js-lib/shindig/rpc',
                        '../js-lib/shindig/pubsub',
                        'eventing/Widget',
                        '../js-lib/log4javascript/log4javascript',
                        'util/log',
                        'pref/preference',
                        'launcher/WidgetLauncher',
                        'state/WidgetStateHandler',
                        'state/WidgetState',
                        'chrome/WidgetChrome',
                        'dd/WidgetDragAndDrop',
                        '../js/data/OWFTransportProxy',
                        '../js/data/OWFStore',
                        '../js/data/models/Dashboard',
                        '../js/data/stores/AdminDashboardStore',
                        '../js/components/container/CachedComponentSelector',
                        '../js/components/admin/PropertiesPanel',
                        '../js/components/admin/dashboard/DashboardEditPropertiesTab',
                        '../js/data/models/Group',
                        '../js/data/stores/GroupStore',
                        'components/focusable/Focusable',
                        'components/layout/SearchBoxLayout',
                        'components/form/field/SearchBox',
                        '../js/components/admin/grid/GroupsGrid',
                        '../js/components/admin/GroupsTabPanel',
                        '../js/components/admin/dashboard/DashboardEditGroupsTab',
                        '../js/components/admin/EditWidgetPanel',
                        '../js/components/admin/dashboard/DashboardEditPanel',
                        'widget/Widget',
                        'widget/widgetInit'
        ]
    ],
    [
        type: 'js',
        name: 'owf-group-dashboard-management-widget',

        files: [
            '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
            'util/pageload',
            '../js-lib/ext-4.0.7/ext-all-debug',
            '../js-lib/patches/BorderLayoutAnimation',
            '../js-lib/patches/menuAlign',
            '../js-lib/patches/menuBlankImage',
            '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
            '../js-lib/patches/CreateInterceptor',
            '../js-lib/patches/PluginMerge',
            '../js-lib/patches/GridScroller',
            'util/version',
            'util/util',
            'lang/ozone-lang',
            'lang/DateJs/globalization/en-US',
            'util/transport',
            'util/widget_utils',
            'components/util/InstanceVariablizer',
            'components/keys/HotKeys',
            'components/keys/KeyEventSender',
            'components/focusable/Focusable',
            'components/focusable/FocusableGridPanel',
            'components/layout/SearchBoxLayout',
            'components/form/field/SearchBox',
            'components/window/MessageBoxPlus',
            '../js-lib/shindig/util',
            '../js-lib/shindig/json',
            '../js-lib/shindig/rpc',
            '../js-lib/shindig/pubsub',
            'eventing/Widget',
            '../js-lib/log4javascript/log4javascript',
            'util/log',
            'pref/preference',
            'launcher/WidgetLauncher',
            'state/WidgetStateHandler',
            'chrome/WidgetChrome',
            'dd/WidgetDragAndDrop',
            'data/OWFTransportProxy',
			'data/models/Dashboard',
			'data/OWFStore',
			'data/stores/AdminDashboardStore',
			'components/admin/grid/DashboardGroupsGrid',
            'components/admin/dashboard/DashboardDetailPanel',
            'components/admin/ManagementPanel',
            'components/admin/dashboard/GroupDashboardManagementPanel',
            'widget/Widget',
            'widget/widgetInit'
        ]
    ],
    [
        type: 'js',
        name: 'owf-group-management-widget',

        files: [
            '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
            'util/pageload',
            '../js-lib/ext-4.0.7/ext-all-debug',
            '../js-lib/patches/BorderLayoutAnimation',
            '../js-lib/patches/menuAlign',
            '../js-lib/patches/menuBlankImage',
            '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
            '../js-lib/patches/CreateInterceptor',
            '../js-lib/patches/PluginMerge',
            '../js-lib/patches/GridScroller',
            'ux/menu/Item',
            'util/version',
            'util/util',
            'lang/ozone-lang',
            'lang/DateJs/globalization/en-US',
            'util/transport',
            'util/widget_utils',
            'components/util/InstanceVariablizer',
            'components/keys/HotKeys',
            'components/keys/KeyEventSender',
            'components/focusable/Focusable',
            'components/focusable/FocusableGridPanel',
            'components/layout/SearchBoxLayout',
            'components/form/field/SearchBox',
            'components/window/MessageBoxPlus',
            '../js-lib/shindig/util',
            '../js-lib/shindig/json',
            '../js-lib/shindig/rpc',
            '../js-lib/shindig/pubsub',
            'eventing/Widget',
            '../js-lib/log4javascript/log4javascript',
            'util/log',
            'pref/preference',
            'launcher/WidgetLauncher',
            'state/WidgetStateHandler',
            'chrome/WidgetChrome',
            'dd/WidgetDragAndDrop',
            'data/OWFTransportProxy',
            'data/models/Group',
            'data/models/User',
            'data/OWFStore',
            'data/stores/GroupStore',
            'data/stores/UserStore',
            'components/admin/grid/GroupsGrid',
            'components/admin/group/GroupDetailPanel',
            'components/admin/ManagementPanel',
            'components/admin/group/GroupManagementPanel',
            'widget/Widget',
            'widget/widgetInit'
        ]
    ],
    [
        type: 'js',
        name: 'owf-group-edit-widget',
	
        files: [
						'../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
						'util/pageload',
						'../js-lib/ext-4.0.7/ext-all-debug',
                        '../js-lib/patches/BorderLayoutAnimation',
                        '../js-lib/patches/menuAlign',
                        '../js-lib/patches/menuBlankImage',
                        '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
                        '../js-lib/patches/CreateInterceptor',
                        '../js-lib/patches/PluginMerge',
            '../js-lib/patches/GridScroller',
            //'../js-lib/patches/fieldWithToolTipIcon',
						'util/version',
						'util/util',
						'lang/ozone-lang',
                        'lang/DateJs/globalization/en-US',
						'util/transport',
						'util/widget_utils',
                        'components/util/InstanceVariablizer',
                        'components/keys/HotKeys',
                        'components/keys/KeyEventSender',
                        'components/focusable/FocusableGridPanel',
						'../js-lib/shindig/util',
						'../js-lib/shindig/json',
						'../js-lib/shindig/rpc',
						'../js-lib/shindig/pubsub',
						'eventing/Widget',
						'../js-lib/log4javascript/log4javascript',
						'util/log',
						'pref/preference',
						'launcher/WidgetLauncher',
						'state/WidgetStateHandler',
                        'state/WidgetState',
                        'chrome/WidgetChrome',
						'dd/WidgetDragAndDrop',
                        '../js/data/ModelIdGenerator',
						'../js/data/OWFTransportProxy',
						'../js/data/OWFStore',
						'../js/data/models/Group',
						'../js/data/stores/GroupStore',
						'../js/data/models/User',
						'../js/data/stores/UserStore',
                        '../js/data/models/WidgetDefinition',
                        '../js/data/models/Dashboard',
						'../js/data/stores/AdminWidgetStore',
						'../js/data/stores/AdminDashboardStore',
                        'components/focusable/Focusable',
                        'components/layout/SearchBoxLayout',
                        'components/form/field/SearchBox',
						'../js/components/admin/grid/UsersGrid',
                        '../js/components/admin/grid/WidgetsGrid',
						'../js/components/admin/grid/DashboardsGrid',
						'../js/components/admin/UsersAddWindow',
						'../js/components/admin/UsersTabPanel',
						'../js/components/admin/PropertiesPanel',
                        '../js/components/admin/WidgetsTabPanel',
                        '../js/components/admin/DashboardsTabPanel',
                        '../js/components/admin/EditWidgetPanel',
						'../js/components/admin/group/GroupEditPropertiesTab',
						'../js/components/admin/group/GroupEditUsersTab',
						'../js/components/admin/group/GroupEditWidgetsTab',
						'../js/components/admin/group/GroupEditDashboardsTab',
						'../js/components/admin/group/GroupEditPanel',
                        'widget/Widget',
                        'widget/widgetInit'
        ]
    ],
    [
        type: 'js',
        name: 'owf-user-management-widget',
    
        files: [
						'../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
						'util/pageload',
						'../js-lib/ext-4.0.7/ext-all-debug',
                        '../js-lib/patches/BorderLayoutAnimation',
                        '../js-lib/patches/menuAlign',
                        '../js-lib/patches/menuBlankImage',
                        '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
                        '../js-lib/patches/CreateInterceptor',
                        '../js-lib/patches/PluginMerge',
            '../js-lib/patches/GridScroller',
						'util/version',
						'util/util',
						'lang/ozone-lang',
						'lang/DateJs/globalization/en-US',
						'util/transport',
						'util/widget_utils',
                        'components/util/InstanceVariablizer',
                        'components/keys/HotKeys',
                        'components/keys/KeyEventSender',
                        'components/focusable/Focusable',
                        'components/focusable/FocusableGridPanel',
                        'components/layout/SearchBoxLayout',
                        'components/form/field/SearchBox',
                        'components/window/MessageBoxPlus',
						'../js-lib/shindig/util',
						'../js-lib/shindig/json',
						'../js-lib/shindig/rpc',
						'../js-lib/shindig/pubsub',
						'eventing/Widget',
						'../js-lib/log4javascript/log4javascript',
						'util/log',
						'pref/preference',
						'launcher/WidgetLauncher',
						'state/WidgetStateHandler',
                        'chrome/WidgetChrome',
						'dd/WidgetDragAndDrop',
						'data/OWFTransportProxy',
						'data/OWFStore',
						'data/models/User',
						'data/stores/UserStore',
						'components/admin/grid/UsersGrid',
						'components/admin/user/UserDetailPanel',
						'components/admin/ManagementPanel',
						'components/admin/user/UserManagementPanel',
                        'widget/Widget',
                        'widget/widgetInit'
						
        ]
    ],
    [
        type: 'js',
        name: 'owf-user-edit-widget',
	
        files: [
						'../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
						'util/pageload',
						'../js-lib/ext-4.0.7/ext-all-debug',
                        '../js-lib/patches/BorderLayoutAnimation',
                        '../js-lib/patches/menuAlign',
                        '../js-lib/patches/menuBlankImage',
                        '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
                        '../js-lib/patches/CreateInterceptor',
                        '../js-lib/patches/PluginMerge',
            '../js-lib/patches/GridScroller',
            //'../js-lib/patches/fieldWithToolTipIcon',
                                                'ux/menu/Item',
						'util/version',
            'util/guid',
						'util/util',
						'lang/ozone-lang',
						'lang/DateJs/globalization/en-US',
						'util/transport',
						'util/widget_utils',
                        'components/util/InstanceVariablizer',
                        'components/keys/HotKeys',
                        'components/keys/KeyEventSender',
                        'components/focusable/FocusableGridPanel',
						'../js-lib/shindig/util',
						'../js-lib/shindig/json',
						'../js-lib/shindig/rpc',
						'../js-lib/shindig/pubsub',
						'eventing/Widget',
						'../js-lib/log4javascript/log4javascript',
						'util/log',
						'pref/preference',
						'launcher/WidgetLauncher',
						'state/WidgetStateHandler',
						'state/WidgetState',
                        'chrome/WidgetChrome',
						'dd/WidgetDragAndDrop',
                        '../js/data/ModelIdGenerator',
						'../js/data/OWFTransportProxy',
						'../js/data/OWFStore',
						'../js/data/models/User',
						'../js/data/stores/UserStore',
                        '../js/data/models/WidgetDefinition',
                        '../js/data/models/Dashboard',
						'../js/data/stores/AdminWidgetStore',
                        '../js/data/stores/AdminDashboardStore',
						'../js/data/models/Preference',
						'../js/data/stores/PreferenceStore',
						'../js/data/models/Group',
						'../js/data/stores/GroupStore',
                        'components/focusable/Focusable',
                        'components/layout/SearchBoxLayout',
                        'components/form/field/SearchBox',
						'../js/components/admin/EditPreferenceWindow',
                                                '../js/components/admin/EditDashboardWindow',
                        '../js/components/admin/grid/DashboardsGrid',
                        '../js/components/admin/grid/WidgetsGrid',
						'../js/components/admin/grid/GroupsGrid',
						'../js/components/admin/grid/PreferencesGrid',
                        '../js/components/admin/DashboardsTabPanel',
                        '../js/components/admin/WidgetsTabPanel',
						'../js/components/admin/GroupsTabPanel',
						'../js/components/admin/PreferencesTabPanel',
						'../js/components/admin/PropertiesPanel',
						'../js/components/admin/EditWidgetPanel',
						'../js/components/admin/user/UserEditPropertiesTab',
						'../js/components/admin/user/UserEditGroupsTab',
						'../js/components/admin/user/UserEditWidgetsTab',
                        '../js/components/admin/user/UserEditDashboardsTab',
						'../js/components/admin/user/UserEditPreferencesTab',
						'../js/components/admin/user/UserEditPanel',
                        'widget/Widget',
                        'widget/widgetInit'
            //'../js/components/admin/UserEditWidget'
        ]
    ],
    [
        type: 'js',
        name: 'owf-widget-management-widget',

        files: [
                        '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
                        'util/pageload',
                        '../js-lib/ext-4.0.7/ext-all-debug',
                        '../js-lib/patches/BorderLayoutAnimation',
                        '../js-lib/patches/menuAlign',
                        '../js-lib/patches/menuBlankImage',
                        '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
                        '../js-lib/patches/CreateInterceptor',
                        '../js-lib/patches/PluginMerge',
            '../js-lib/patches/GridScroller',
                        'util/version',
                        'util/util',
						'ux/menu/Item',
                        'components/util/InstanceVariablizer',
                        'components/keys/HotKeys',
                        'components/keys/KeyEventSender',
                        'components/focusable/Focusable',
                        'components/focusable/FocusableGridPanel',
                        'components/layout/SearchBoxLayout',
                        'components/form/field/SearchBox',
                        'components/window/MessageBoxPlus',
                        'lang/ozone-lang',
                        'lang/DateJs/globalization/en-US',
                        'util/transport',
                        'util/widget_utils',
                        '../js-lib/shindig/util',
                        '../js-lib/shindig/json',
                        '../js-lib/shindig/rpc',
                        '../js-lib/shindig/pubsub',
                        'eventing/Widget',
                        '../js-lib/log4javascript/log4javascript',
                        'util/log',
                        'pref/preference',
                        'launcher/WidgetLauncher',
                        'state/WidgetStateHandler',
                        'chrome/WidgetChrome',
                        'dd/WidgetDragAndDrop',
                        '../js/data/ModelIdGenerator',
                        '../js/data/OWFTransportProxy',
                        '../js/data/OWFStore',
                        '../js/data/models/WidgetDefinition',
                        '../js/data/stores/AdminWidgetStore',
                        '../js/components/admin/grid/WidgetsGrid',
                        '../js/components/admin/widget/WidgetDetailPanel',
                        '../js/components/admin/widget/DeleteWidgetsPanel',
                        '../js/components/admin/ManagementPanel',
                        '../js/components/admin/widget/WidgetManagementPanel',
                        'widget/Widget',
                        'widget/widgetInit'
        ]
    ],
    [
        type: 'js',
        name: 'owf-widget-edit-widget',
	
        files: [
						'../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
						'util/pageload',
						'../js-lib/ext-4.0.7/ext-all-debug',
                        '../js-lib/patches/BorderLayoutAnimation',
                        '../js-lib/patches/menuAlign',
                        '../js-lib/patches/menuBlankImage',
                        '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
                        '../js-lib/patches/CreateInterceptor',
                        '../js-lib/patches/PluginMerge',
						'../js-lib/patches/TextFieldOverrides',
            '../js-lib/patches/GridScroller',
						//'../js-lib/patches/fieldWithToolTipIcon',
						'util/version',
						'util/util',
                        'util/guid',
                        'components/util/InstanceVariablizer',
                        'components/keys/HotKeys',
                        'components/keys/KeyEventSender',
                        'components/focusable/FocusableGridPanel',
						'lang/ozone-lang',
                        'lang/DateJs/globalization/en-US',
						'util/transport',
						'util/widget_utils',
						'../js-lib/shindig/util',
						'../js-lib/shindig/json',
						'../js-lib/shindig/rpc',
						'../js-lib/shindig/pubsub',
						'eventing/Widget',
						'../js-lib/log4javascript/log4javascript',
						'util/log',
						'pref/preference',
						'launcher/WidgetLauncher',
						'state/WidgetStateHandler',
                        'state/WidgetState',
                        'chrome/WidgetChrome',
						'dd/WidgetDragAndDrop',
                        '../js/data/ModelIdGenerator',
						'../js/data/OWFTransportProxy',
						'../js/data/OWFStore',
						'../js/components/admin/UrlField',
						'../js/data/models/WidgetDefinition',
						'../js/data/stores/AdminWidgetStore',
					 	'../js/data/models/User',
						'../js/data/stores/UserStore',
						'../js/data/models/Group',
						'../js/data/stores/GroupStore',
                        '../js/data/models/WidgetType',
                        '../js/data/stores/WidgetTypeStore',
					 	'../js/data/models/Intent',
						'../js/data/stores/IntentStore',
                        'components/focusable/Focusable',
                        'components/layout/SearchBoxLayout',
                        'components/form/field/SearchBox',
						'components/window/MessageBoxPlus',
						'../js/components/admin/UsersAddWindow',
						'../js/components/admin/grid/UsersGrid',
						'../js/components/admin/grid/GroupsGrid',
						'../js/components/admin/grid/IntentsGrid',
						'../js/components/admin/UsersTabPanel',
						'../js/components/admin/GroupsTabPanel',
						'../js/components/admin/IntentsTabPanel',
						'../js/components/admin/widget/WidgetEditUsersTab',
						'../js/components/admin/widget/WidgetEditGroupsTab',
						'../js/components/admin/PropertiesPanel',
						'../js/components/admin/widget/WidgetEditPropertiesTab',
						'../js/components/admin/EditWidgetPanel',
						'../js/components/admin/widget/WidgetEditPanel',
                        'widget/Widget',
                        'widget/widgetInit'
        ]
    ],
    [
        type: 'js',
        name: 'owf-server',
        //custom fields for createBundles grails script
        minifiedName: 'owf-server-min',
        debugName: 'owf-server-debug',
        //custom fields for createBundles grails script
        files: [
                        '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
                        '../js-lib/ext-4.0.7/ext-all-debug',
                        '../js-lib/jquery/jquery-1.8.0',
                        '../js-lib/stubconsole',
                        '../js-plugins/Banner',
                        '../js-plugins/Dashboard',
                        '../js-plugins/DashboardContainer',
                        '../js-plugins/WidgetBase',
                        '../js-plugins/WidgetPanel',
                        '../js-plugins/WidgetWindow',
                        '../js-plugins/pane/Pane',
                        '../js-plugins/pane/AccordionPane',
                        '../js-plugins/pane/DesktopPane',
                        '../js-plugins/pane/FitPane',
                        '../js-plugins/pane/PortalPane',
                        '../js-plugins/pane/TabbedPane',
                        '../js-lib/patches/DragDropManagerOverrides',
                        '../js-lib/patches/EventObjectImplOverrides',
                        '../js-lib/patches/DragZoneOverrides',
                        '../js-lib/patches/DragTrackerOverrides',
                        '../js-lib/patches/ElementOverrides',
                        '../js-lib/patches/ZIndexManagerOverrides',
                        '../js-lib/patches/GridOverrides',
                        '../js-lib/patches/ButtonOverrides',
                        '../js-lib/patches/ComboBoxOverrides',
						'../js-lib/patches/BorderLayoutAnimation',
                        '../js-lib/patches/menuAlign',
                        '../js-lib/patches/CreateInterceptor',
                        '../js-lib/patches/PluginMerge',
                        '../js-lib/patches/TextFieldOverrides',
                        '../js-lib/patches/TreeViewOverrides',
                        '../js-lib/patches/LoadMaskOverrides',
                        '../js-lib/patches/LegendItemOverrides',
                        '../js-lib/patches/GridScroller',
                        'events/Events',
                        'components/util/History',
                        'components/util/InstanceVariablizer',
                        'components/keys/HotKeys',
                        'components/keys/KeyMap',
                        'components/keys/MoveKeyMap',
                        'components/keys/HotKeyComponent',
                        'components/keys/KeyMoveable',
                        'components/focusable/Focusable',
                        'components/focusable/CircularFocus',
                        'components/focusable/FocusableGridPanel',
                        'components/focusable/EscCloseHelper',
                        'components/draggable/DraggableWidgetView',
                        'components/tree/SimpleTreeColumn',
                        'components/resizer/NoCollapseSplitter',
                        'ux/layout/component/form/MultiSelect',
                        'ux/layout/component/form/ItemSelector',
                        'ux/form/MultiSelect',
                        'ux/form/ItemSelector',
                        'ux/MessageBoxPlus',
                        'ux/OWFVtypes',
                        '../js-lib/log4javascript/log4javascript',
                        'util/version',
                        'util/util',
                        'util/widget_utils',
                        'util/log',
                        'lang/ozone-lang',
                        'lang/DateJs/globalization/en-US',
                        'util/error',
                        'layout/manage_widgets_container',
                        'data/models/LayoutType',
                        'ux/tab_panel',
                        'ux/RadioColumn',
                        'ux/CheckColumn',
                        'ux/App',
                        'ux/Module',
                        'ux/Portal',
                        'ux/ComboBox',
                        'ux/DashboardSplitter',
                        'ux/AutoHideLoadMask',
                        'ux/menu/Item',
                        'util/transport',
						'ux/layout/container/boxOverflow/Menu',
                        'pref/preference',
                        '../js-lib/shindig/util',
                        '../js-lib/shindig/json',
                        '../js-lib/shindig/rpc',
                        '../js-lib/shindig/pubsub_router',

                         //for kernel widget compatibility
                        'kernel/kernel-rpc-base',

                        'eventing/Container',
                        'intents/WidgetIntentsContainer',
                        'launcher/WidgetLauncherContainer',
                        'marketplace/AddWidgetContainer',
                        'dd/WidgetDragAndDropContainer',
                        'util/output',
                        'util/guid',
                        'data/JsonProxy',
                        'data/OWFTransportProxy',
                        'data/OWFStore',
                        'components/keys/KeyEventing',
                        'components/tip/QuickTip',
                        'components/tip/ToolTip',
                        'components/widget/WidgetIframeComponent',
                        'components/focusable/FocusCatch',
                        'components/widget/WidgetBase',
                        'components/widget/WidgetPanel',
                        'data/models/WidgetGroup',
                        'data/stores/WidgetGroupStore',
                        'data/models/State',
                        'data/stores/StateStore',
                        'data/models/Dashboard',
                        'data/stores/DashboardStore',
                        'data/ModelIdGenerator',
                        'data/models/WidgetDefinition',
                        'data/stores/WidgetStore',
                        'data/models/Group',
                        'data/stores/GroupStore',
                        'layout/create_view_container',
                        'components/button/UserMenuButton',
                        'components/focusable/Focusable',
                        'components/layout/SearchBoxLayout',
                        'components/form/field/SearchBox',
                        'components/grid/DashboardsGrid',
                        'components/grid/column/TextColumn',
                        'components/layout/container/boxOverflow/Menu',
                        'components/layout/container/HBox',
                        'components/layout/BufferedCardLayout',
                        'components/layout/PinnableAccordion',
                        'components/panel/WidgetHeader',
                        'components/panel/WidgetTool',
                        'components/panel/DashboardDetailPanel',
                        'components/tab/WidgetTabPanel',
                        'components/tab/WidgetTabBar',
                        'components/tab/WidgetTab',
                        'components/toolbar/WidgetToolbar',
                        'components/marketplace/SortablePagingToolbar',
                        'components/focusable/FocusableView',
                        'components/view/TemplateEventDataView',
                        'components/window/ModalWindow',
                        'components/window/WidgetSwitcher',
                        'components/window/ManagerWindow',
                        'components/window/AdminToolsWindow',
                        'components/window/MarketplaceWindow',
                        'components/window/MetricWindow',
                        'components/window/AlertWindow',
                        'components/window/CreateDashboardWindow',
                        'components/window/ProfileWindow',
                        'components/dashboarddesigner/DraggableView',
                        'components/dashboarddesigner/BaseLayout',
                        'components/dashboarddesigner/LayoutType',
                        'components/dashboarddesigner/Pane',
                        'components/dashboarddesigner/SidePanel',
                        'components/dashboarddesigner/WorkingArea',
                        'components/dashboarddesigner/DashboardDesigner',
                        'components/theming/ThemeBrowser',
                        'components/theming/ThemeInfoPanel',
                        'components/theming/ThemeSwitcherWindow',
                        'components/dashboard/DashboardContainer',
                        'components/dashboard/Dashboard',
                        'components/window/DashboardSwitcher',
                        'components/window/HelpWindow',
                        'components/window/DashboardsManager',
                        'components/launchMenu/DDView',
                        'components/launchMenu/Carousel',
                        'components/launchMenu/AdvancedSearchPanel',
                        'components/launchMenu/WidgetView',
                        'components/launchMenu/WidgetViewContainer',
                        'components/launchMenu/LaunchMenu',
                        'components/pane/Pane',
                        'components/pane/DesktopPane',
                        'components/pane/AccordionPane',
                        'components/pane/PortalPane',
                        'components/pane/TabbedPane',
                        'components/pane/FitPane',
                        'components/window/SettingsWindow',
                        'components/view/ToolDataView',
                        'components/view/TagCloud',
                        'components/button/ShareButton',
                        'components/banner/Banner',
                        'components/widget/WidgetPortlet',
                        'components/widget/WidgetWindow',
                        'state/WidgetStateStoreProvider',
                        'state/WidgetStateContainer',
                        'marketplace/MPListingsRetriever',
                        'marketplace/MPCategoryRetriever',
                        'marketplace/MPListingsAPI',
                        'marketplace/MPCategoryAPI',
                        'components/marketplace/MarketplaceWindow',
                        'components/marketplace/MPWidgetDetailsPanel',
						'chrome/WidgetChromeContainer',
                        'components/widget/DeleteWidgetsPanel',
                        'metrics/BaseMetrics',
            //this patch file should be at the end
                        '../js-lib/patches/RemoveListenerCaptureBugOverrides'

        ]
    ],
    [
        type: 'js',
        name: 'owf-lite-client',
        minifiedName: 'owf-lite-client-min',
        debugName: 'owf-lite-client-debug',
        alternateDestDir: 'js-min',
        excludeFromWar: true,
        files: [
                '../js-lib/shindig/util',
                '../js-lib/shindig/json',
                '../js-lib/shindig/rpc',
                '../js-lib/shindig/pubsub',
                'eventing/WidgetProxy',
                'kernel/kernel-client'
        ]
    ],
    [
        type: 'js',
        name: 'owf-lite-client-with-dojo',
        minifiedName: 'owf-lite-client-with-dojo-min',
        debugName: 'owf-lite-client-with-dojo-debug',
        alternateDestDir: 'js-min',
        excludeFromWar: true,
        files: [
                '../js-lib/shindig/util',
                '../js-lib/shindig/json',
                '../js-lib/shindig/rpc',
                '../js-lib/shindig/pubsub',
                'eventing/WidgetProxy',
                'kernel/kernel-client',
                '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed'
        ]
    ],
    [
        type: 'js',
        name: 'owf-lite-container',
        minifiedName: 'owf-lite-container-min',
        debugName: 'owf-lite-container-debug',
        alternateDestDir: 'js-min',
        excludeFromWar: true,
        files: [
                '../js-lib/shindig/util',
                '../js-lib/shindig/json',
                '../js-lib/shindig/rpc',
                '../js-lib/shindig/pubsub',
                'kernel/kernel-rpc-base',
                'kernel/kernel-container'
        ]
    ],
    [
        type: 'js',
        name: 'owf-lite-container-with-dojo',
        minifiedName: 'owf-lite-container-with-dojo-min',
        debugName: 'owf-lite-container-with-dojo-debug',
        alternateDestDir: 'js-min',
        excludeFromWar: true,
        files: [
                '../js-lib/shindig/util',
                '../js-lib/shindig/json',
                '../js-lib/shindig/rpc',
                '../js-lib/shindig/pubsub',
                'kernel/kernel-rpc-base',
                'kernel/kernel-container',
                '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed'
        ]
    ],
    [
        type: 'js',
        name: 'owf-lite-container-compat',
        minifiedName: 'owf-lite-container-compat-min',
        debugName: 'owf-lite-container-compat-debug',
        alternateDestDir: 'js-min',
        excludeFromWar: true,
        files: [
                '../js-lib/shindig/util',
                '../js-lib/shindig/json',
                '../js-lib/shindig/rpc',
                '../js-lib/shindig/pubsub_router',
                'kernel/kernel-rpc-base',
                'kernel/kernel-container',
                '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
                'util/version',
//                'util/util',
//                'util/guid',
                'dd/WidgetDragAndDropContainer'
        ]
    ]

]

// set per-environment serverURL stem for creating absolute links
// and turn on gsp reloading for the 2 auto login environments
environments {
    production {

        //grails.serverURL = "https://localhost:8443/admin"
        log4j = {rootLogger ->
            //get rid of stdout logging
            rootLogger.removeAllAppenders()

            //disable the creation of stacktrace.log since we 
            //don't log anything to it
            appenders {
                'null' name: 'stacktrace'
            }

            appenders {
                rollingFile name: 'owfStackTraceLog',
                layout:pattern(conversionPattern: '%d [%t] %-5p %c %x - %m%n'),
                maxFileSize: '1MB',
                file: 'logs/owf-stacktrace.log'
            }

            //this configuration is only active
            //until the bootstrap phase when 
            //our log4j.xml gets loaded and overrides
            //these settings
            appenders {
                rollingFile name: 'initialLog',
                layout: pattern(conversionPattern: '%d [%t] %-5p %c %x - %m%n'),
                maxFileSize: '1MB',
                file: 'logs/owf-initial.log'
            }

            error additivity: false, owfStackTraceLog: 'StackTrace'
            root {
                error 'initialLog'
                additivity = false
            }
        }
    }

    development {
        uiperformance.enabled = false

        perfTest.enabled = false			// Determines whether or not bootstrap is run
        perfTest.clearCacheEvery = 10
		perfTest.numDashboards = 5			// The number of dashboards each user will get assigned to them
		perfTest.numGroupDashboards = 1 	// The number of dashboards each group will get assigned to them
		perfTest.numDashboardsWidgets = 5	// The number of widgets on each dashboard
		perfTest.numAdmins = 5				// The number of administrators
		perfTest.numUsers = 995				// The number of non-admin users
		perfTest.numGroups = 50				// The number of groups
		perfTest.numGroupsPerUser = 5		// The number of groups each user is assigned to
		perfTest.numWidgetsInGroups = 5		// The number of widgets assigned to each group
		perfTest.numWidgetsPerUser = 10		// The number of widgets assigned to each user
		perfTest.numPreferences = 50		// The number of preferences per user
		perfTest.numWidgets = 500			// The number of unique widget definitions

        perfTest.createRequiredWidgets = false
        perfTest.createSampleWidgets = false
        perfTest.sampleWidgetBaseUrl = 'https://127.0.0.1:8443/owf/sampleWidgets/'

        owf.alternateHostName = System.properties.alternateHostName ?: '127.0.0.1'

        log4j = {
            error  'org.codehaus.groovy.grails.web.servlet',  //  controllers
             'org.codehaus.groovy.grails.web.pages' //  GSP
            warn 'org.mortbay.log'
            debug 'grails.app'
            info 'grails.plugin.databasemigration'
            //trace 'org.hibernate'
            //debug 'org.hibernate.SQL'
            //trace 'org.hibernate.type'
            //trace 'org.hibernate.cache'
            appenders {
                appender new RollingFileAppender(name:"owfStackTraceLog", maxFileSize:8192,
                    file:"logs/owf-stacktrace.log",
                    layout: pattern(conversionPattern: '%d [%t] %-5p %c %x - %m%n'))
                appender new SyslogAppender( name:"syslogTraceLog",
                    syslogHost:'localhost:8014',
                    facility: 'USER',
                    layout: pattern(conversionPattern: '%d [%t] %-5p %c %x - %m%n'))
            }
            root {
                debug 'stdout', 'owfStackTraceLog', 'syslogTraceLog'
                error()
                additivity = true
            }

        }
    }

    test {
        log4j =
        {
            appenders {
                appender new RollingFileAppender(name:"owfTestStackTraceLog", maxFileSize:8192,
                    file:"logs/owftest-stacktrace.log",
                    layout: pattern(conversionPattern: '%d [%t] %-5p %c %x - %m%n'))
            }
            root {
                info 'owfTestStackTraceLog'
                info()
                additivity = true
            }
        }
    }
}

grails.app.context = "/owf"
owf {
      version = server.version
      serverVersion = server.version

//      def server = System.properties['server.host'] ?: 'localhost'
//      def port = System.properties['server.port'] ?: '8443'
//      def protocol = port.endsWith('443') ? 'https' : 'http'
//      def context = grails.app.context
//
////        println "server = ${server}"
////        println "port = ${port}"
////        println "context = ${context}"
//
//      prefsLocation =  "${protocol}://${server}:${port}${context}/prefs"

//        println "prefsLocation = ${prefsLocation}"

      // log4j file watch interval in milliseconds
      log4jWatchTime = 180000; // 3 minutes

      marketplaceLocation = ""
      mpInitialPollingInterval = 5000
      mpPollingInterval = 300000
      mpVersion = "2.5"

      enablePendingApprovalWidgetTagGroup = true
      pendingApprovalTagGroupName='pending approval'
      approvedTagGroupName='approved'

      /*
          Leave blank for development, unless working on code with officeName
      */
//      officeName = "Sample Office"
//
//      bannerIcon = "images/blue/header/wfLogo48.gif"
//      bannerIconHeight = 48		/* DO NOT CHANGE until entire banner is componentized */
//      bannerIconWidth = 250		/* DO NOT CHANGE until entire banner is componentized */

      adminBannerIcon = "images/adminLogo52.png"
      adminBannerIconHeight = 52
      adminBannerIconWidth = 346
      adminBannerPageTitle = "Admininistration"

      sendWidgetLoadTimesToServer = true
      publishWidgetLoadTimes = true

      showLastLogin = false
      lastLoginDateFormat = 'n/j/Y G:i'

      defaultTheme = "a_default"

      // showAccessAlert = "true"
      // accessAlertMsg = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla interdum eleifend sapien dignissim malesuada. Sed imperdiet augue vitae justo feugiat eget porta est blandit. Proin ipsum ipsum, rutrum ac gravida in, ullamcorper a augue. Sed at scelerisque augue. Morbi scelerisque gravida sapien ut feugiat. Donec dictum, nisl commodo dapibus pellentesque, enim quam consectetur quam, at dictum dui augue at risus. Ut id nunc in justo molestie semper. Curabitur magna velit, varius eu porttitor et, tempor pulvinar nulla. Nam at tellus nec felis tincidunt fringilla. Nunc nisi sem, egestas ut consequat eget, luctus et nisi. Nulla et lorem odio, vitae pretium ipsum. Integer tellus libero, molestie a feugiat a, imperdiet sit amet metus. Aenean auctor fringilla eros, sit amet suscipit felis eleifend a."

      // Specifies a freeTextEntryMessage to appear on all dialogs which allow text entry
      // To turn off the warning message, use the following:
      //     freeTextEntryWarningMessage=''
      freeTextEntryWarningMessage=''

      //use to specify a logout url
      logoutURL = "/logout"

      //sets the autoSave interval for saving dashboards in milliseconds 900000 is 15 minutes
      autoSaveInterval = 900000

      helpFileRegex = '^.*\\.(html|gsp|jsp|pdf|doc|docx|mov|mp4|swf|wmv)$'

      useShims = false

      //use to specify whether or not to show test features
      // isTestMode = "true"
      // dynamicLaunchOnlyIfClosed = "true"
      // dynamicLaunchData = "some data"
//      if (GrailsUtil.environment == "development") {
//       alternateHostName = ConfigurationHolder.config.alternateHostName
//      }

    external {
        themePath = "file:${System.properties['base.dir']}/themes"
        helpPath = "file:${System.properties['base.dir']}/help"
        jsPluginPath = "file:${System.properties['base.dir']}/js-plugins"
    }

    metric {
      enabled = false
      url = 'https://localhost:5443/metric/metric'
      keystorePath = System.properties['javax.net.ssl.keyStore']
      keystorePass = System.properties['javax.net.ssl.keyStorePassword']
      truststorePath = System.properties['javax.net.ssl.trustStore']
      //timeout = 1800000
    }

	// Configuration elements for custom headers/footers.
	customHeaderFooter {
		header = ''
		headerHeight = 0
		footer = ''
		footerHeight = 0
		jsImports = []
		cssImports = []
	}

}

// log4j configuration : see log4j.xml

//ssl stuff
keystore = 'certs/keystore.jks'

casSettings.useCas=true
casSettings.FullServiceURL='https://localhost:8443/cas'


