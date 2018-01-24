import org.apache.log4j.RollingFileAppender
import org.apache.log4j.net.SyslogAppender
import grails.util.BuildSettingsHolder

// locations to search for config files that get merged into the main config
// config files can either be Java properties files or ConfigSlurper scripts
def userConfig = System.properties.userConfig ?: "${userHome}/.ozone/DevFlagConfig.groovy"
grails.config.locations = [
        "classpath:OzoneConfig.properties",
        "classpath:OwfConfig.groovy",
        "file:${userConfig}"
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

grails.gsp.tldScanPattern='classpath*:/META-INF/*.tld,/WEB-INF/tld/*.tld'


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
        "**/js-min/**",
        "**/rest/**"

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
            'audit/Audit',
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
        name: 'owf-admin-widget',

        files: [
            '../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed',
            '../js-lib/ext-4.0.7/ext-all-debug',
            '../js-lib/log4javascript/log4javascript',
            '../js-lib/patches/BorderLayoutAnimation',
            '../js-lib/patches/menuAlign',
            '../js-lib/patches/menuBlankImage',
            '../js-lib/patches/firefox_computed_style_on_hidden_elements_patch',
            '../js-lib/patches/CreateInterceptor',
            '../js-lib/patches/PluginMerge',
            '../js-lib/patches/TextFieldOverrides',
            '../js-lib/patches/GridScroller',
            '../js-lib/patches/IEDetection',
            '../js-lib/patches/IE11DragAndDrop',
            '../js-lib/shindig/util',
            '../js-lib/shindig/json',
            '../js-lib/shindig/rpc',
            '../js-lib/shindig/pubsub',
            'ux/menu/Item',
            'audit/Audit',
            'util/version',
            'util/log',
            'util/pageload',
            'util/transport',
            'util/util',
            'util/widget_utils',
            'lang/ozone-lang',
            'eventing/Widget',
            'pref/preference',
            'components/focusable/FocusableGridPanel',
            'components/keys/HotKeys',
            'components/keys/KeyEventSender',
            'components/util/InstanceVariablizer',
            'launcher/WidgetLauncher',
            'state/WidgetStateHandler',
            'state/WidgetState',
            'chrome/WidgetChrome',
            'dd/WidgetDragAndDrop',
            'data/OWFTransportProxy',
            'data/OWFStore',
            'components/focusable/CircularFocus',
            'components/focusable/Focusable',
            'components/layout/SearchBoxLayout',
            'components/form/field/SearchBox',
            'components/admin/AdminEditorAddWindow',
            'components/admin/WidgetAlerts',
            'components/admin/ManagementPanel',
            'widget/Widget',
            'widget/widgetInit'
        ]
    ],
    [
        type: 'js',
        name: 'owf-marketplace-approval-widget',

        files: [
            '../js/data/models/WidgetDefinition',
            '../js/data/stores/AdminWidgetStore',
            '../js/data/stores/WidgetApprovalStore',
            '../js/components/admin/grid/FilterMixin',
            '../js/components/admin/grid/WidgetApprovalsGrid',
            '../js/components/admin/widget/WidgetDetailPanel',
            '../js/components/admin/widget/ApprovePanel',
            '../js/components/admin/widget/WidgetApprovalPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-dashboard-edit-widget',

        files: [
            'util/guid',
            '../js/data/models/Dashboard',
            '../js/data/stores/AdminDashboardStore',
            '../js/data/models/Group',
            '../js/data/stores/GroupStore',
            '../js/components/admin/grid/FilterMixin',
            '../js/components/admin/grid/GroupsGrid',
            '../js/components/admin/EditWidgetPanel',
            '../js/components/admin/GroupsTabPanel',
            '../js/components/admin/PropertiesPanel',
            '../js/components/admin/dashboard/DashboardEditPropertiesTab',
            '../js/components/admin/dashboard/DashboardEditGroupsTab',
            '../js/components/admin/dashboard/DashboardEditPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-group-dashboard-management-widget',

        files: [
            'data/models/Dashboard',
            'data/stores/AdminDashboardStore',
            'components/admin/grid/FilterMixin',
            'components/admin/grid/DashboardGroupsGrid',
            'components/admin/dashboard/DashboardDetailPanel',
            'components/admin/dashboard/GroupDashboardManagementPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-group-management-widget',

        files: [
            'data/models/Group',
            'data/stores/GroupStore',
            'components/admin/grid/FilterMixin',
            'components/admin/grid/GroupsGrid',
            'components/admin/group/GroupDetailPanel',
            'components/admin/group/GroupManagementPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-group-edit-widget',

        files: [
            '../js/data/models/Dashboard',
            '../js/data/stores/AdminDashboardStore',
            '../js/data/models/Group',
            '../js/data/stores/GroupStore',
            '../js/data/models/User',
            '../js/data/stores/UserStore',
            '../js/data/models/Stack',
            '../js/data/stores/StackStore',
            '../js/data/models/WidgetDefinition',
            '../js/data/stores/AdminWidgetStore',
            '../js/components/admin/grid/FilterMixin',
            '../js/components/admin/grid/DashboardsGrid',
            '../js/components/admin/grid/StacksGrid',
            '../js/components/admin/grid/UsersGrid',
            '../js/components/admin/grid/WidgetsGrid',
            '../js/components/admin/DashboardsTabPanel',
            '../js/components/admin/EditWidgetPanel',
            '../js/components/admin/PropertiesPanel',
            '../js/components/admin/StacksTabPanel',
            '../js/components/admin/UsersTabPanel',
            '../js/components/admin/WidgetsTabPanel',
            '../js/components/admin/dashboard/DashboardDetailPanel',
            '../js/components/admin/group/GroupEditDashboardsTab',
            '../js/components/admin/group/GroupEditPropertiesTab',
            '../js/components/admin/group/GroupEditStacksTab',
            '../js/components/admin/group/GroupEditUsersTab',
            '../js/components/admin/group/GroupEditWidgetPanel',
            '../js/components/admin/group/GroupEditWidgetsTab',
            '../js/components/admin/group/GroupEditPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-stack-management-widget',

        files: [
            'data/models/Stack',
            'data/stores/StackStore',
            'components/admin/ExportWindow',
            'components/admin/grid/FilterMixin',
            'components/admin/grid/StacksGrid',
            'components/admin/stack/StackDetailPanel',
            'components/admin/stack/StackManagementPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-stack-edit-widget',

        files: [
            '../js/data/models/User',
            '../js/data/stores/UserStore',
            '../js/data/models/Dashboard',
            '../js/data/stores/AdminDashboardStore',
            '../js/data/models/Group',
            '../js/data/stores/GroupStore',
            '../js/data/models/Stack',
            '../js/data/stores/StackStore',
            '../js/data/models/WidgetDefinition',
            '../js/data/stores/AdminWidgetStore',
            '../js/components/admin/UrlField',
            '../js/components/admin/EditDashboardWindow',
            '../js/components/admin/grid/FilterMixin',
            '../js/components/admin/grid/DashboardsGrid',
            '../js/components/admin/grid/GroupsGrid',
            '../js/components/admin/grid/UsersGrid',
            '../js/components/admin/grid/WidgetsGrid',
            '../js/components/admin/DashboardsTabPanel',
            '../js/components/admin/EditWidgetPanel',
            '../js/components/admin/GroupsTabPanel',
            '../js/components/admin/PropertiesPanel',
            '../js/components/admin/UsersTabPanel',
            '../js/components/admin/WidgetsTabPanel',
            '../js/components/admin/dashboard/DashboardDetailPanel',
            '../js/components/admin/stack/StackEditPanel',
            '../js/components/admin/stack/StackEditPropertiesTab',
            '../js/components/admin/stack/StackEditUsersTab',
            '../js/components/admin/stack/StackEditDashboardsTab',
            '../js/components/admin/stack/StackEditGroupsTab',
            '../js/components/admin/stack/StackEditUsersTab',
            '../js/components/admin/stack/StackEditWidgetsTab',
            '../js/util/error'
        ]
    ],
    [
        type: 'js',
        name: 'owf-user-management-widget',

        files: [
            'data/models/User',
            'data/stores/UserStore',
            'components/admin/grid/FilterMixin',
            'components/admin/grid/UsersGrid',
            'components/admin/user/UserDetailPanel',
            'components/admin/user/UserManagementPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-user-edit-widget',

        files: [
            'util/guid',
            '../js/data/models/Dashboard',
            '../js/data/stores/AdminDashboardStore',
            '../js/data/models/Group',
            '../js/data/stores/GroupStore',
            '../js/data/models/Preference',
            '../js/data/stores/PreferenceStore',
            '../js/data/models/Stack',
            '../js/data/stores/StackStore',
            '../js/data/models/User',
            '../js/data/stores/UserStore',
            '../js/data/models/WidgetDefinition',
            '../js/data/stores/AdminWidgetStore',
            '../js/components/admin/EditPreferenceWindow',
            '../js/components/admin/EditDashboardWindow',
            '../js/components/admin/grid/FilterMixin',
            '../js/components/admin/grid/DashboardsGrid',
            '../js/components/admin/grid/GroupsGrid',
            '../js/components/admin/grid/PreferencesGrid',
            '../js/components/admin/grid/StacksGrid',
            '../js/components/admin/grid/WidgetsGrid',
            '../js/components/admin/DashboardsTabPanel',
            '../js/components/admin/EditWidgetPanel',
            '../js/components/admin/GroupsTabPanel',
            '../js/components/admin/PreferencesTabPanel',
            '../js/components/admin/PropertiesPanel',
            '../js/components/admin/StacksTabPanel',
            '../js/components/admin/WidgetsTabPanel',
            '../js/components/admin/user/UserEditDashboardsTab',
            '../js/components/admin/user/UserEditPreferencesTab',
            '../js/components/admin/user/UserEditPropertiesTab',
            '../js/components/admin/user/UserEditGroupsTab',
            '../js/components/admin/user/UserEditStacksTab',
            '../js/components/admin/user/UserEditWidgetsTab',
            '../js/components/admin/user/UserEditPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-widget-management-widget',

        files: [
            '../js/data/models/WidgetDefinition',
            '../js/data/stores/AdminWidgetStore',
            '../js/components/admin/ExportWindow',
            '../js/components/admin/grid/FilterMixin',
            '../js/components/admin/grid/WidgetsGrid',
            '../js/components/admin/widget/DeleteWidgetsPanel',
            '../js/components/admin/widget/WidgetDetailPanel',
            '../js/components/admin/widget/WidgetManagementPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-widget-edit-widget',

        files: [
            'util/guid',
            '../js/data/ModelIdGenerator',
            '../js/components/admin/UrlField',
            '../js/data/models/Group',
            '../js/data/stores/GroupStore',
            '../js/data/models/Intent',
            '../js/data/stores/IntentStore',
            '../js/data/models/User',
            '../js/data/stores/UserStore',
            '../js/data/models/WidgetDefinition',
            '../js/data/stores/AdminWidgetStore',
            '../js/data/models/WidgetType',
            '../js/data/stores/WidgetTypeStore',
            '../js/components/admin/EditIntentWindow',
            '../js/components/admin/grid/FilterMixin',
            '../js/components/admin/grid/IntentsGrid',
            '../js/components/admin/grid/GroupsGrid',
            '../js/components/admin/grid/UsersGrid',
            '../js/components/admin/EditWidgetPanel',
            '../js/components/admin/GroupsTabPanel',
            '../js/components/admin/IntentsTabPanel',
            '../js/components/admin/PropertiesPanel',
            '../js/components/admin/UsersTabPanel',
            '../js/components/admin/widget/WidgetEditGroupsTab',
            '../js/components/admin/widget/WidgetEditUsersTab',
            '../js/components/admin/widget/WidgetEditPropertiesTab',
            '../js/components/admin/widget/WidgetEditPanel'
        ]
    ],
    [
        type: 'js',
        name: 'owf-widget-configuration-widget',

        files: [
            "../js-lib/dojo-1.5.0-windowname-only/dojo/owfdojo.js.uncompressed",
            "../js/util/util",
            "../js/util/guid",
            "../js/util/version",
            "../js/util/transport",
            "../js-lib/ext-4.0.7/ext-all-debug",
            "../js/data/models/WidgetDefinition",
            "../js/data/models/WidgetType",
            "../js/components/mask/LoadMask",
            "../js/components/focusable/CircularFocus",
            "../js/components/window/ModalWindow",
            "../js/data/OWFTransportProxy",
            "../js/data/OWFStore",
            "../js/data/stores/AdminWidgetStore",
            "../js/data/stores/WidgetTypeStore",
            "../js/components/window/StoreWizard",
            '../js/data/models/Group',
            '../js/data/stores/GroupStore'
        ]
    ],
    [
        type: "js",
        name: "require-js",
        files: [
            "../js-lib/requirejs/require-2.1.6"
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
                        '../js-lib/lodash/lodash-1.3.1',
                        '../js-lib/ext-4.0.7/ext-all-debug',
                        '../js-lib/jquery/jquery-1.10.2',
                        //'../js-lib/jquery/jquery-migrate-1.2.1',
                        '../js-lib/jquery/jquery.dotdotdot',
                        '../js-lib/jquery-ui-1.10.3/ui/jquery.ui.core',
                        '../js-lib/jquery-ui-1.10.3/ui/jquery.ui.widget',
                        '../js-lib/jquery-ui-1.10.3/ui/jquery.ui.mouse',
                        '../js-lib/jquery-ui-1.10.3/ui/jquery.ui.position',
                        '../js-lib/jquery-ui-1.10.3/ui/jquery.ui.sortable',
                        '../js-lib/jquery-ui-1.10.3/ui/jquery.ui.resizable',
                        '../js-lib/backbone/backbone-1.0.0',
                        '../js-lib/bootstrap/bootstrap-2.3.2',
                        '../js-lib/jquery.bxslider/jquery.bxslider',
                        '../js-lib/pnotify-1.2.0/jquery.pnotify',
                        '../js-lib/stubconsole',
                        '../js-lib/moment',
                        '../js-lib/handlebars/handlebars-1.0.0',
                        '../js/util/css_events',
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
                        '../js-lib/patches/QuickTipOverrides',
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
                        '../js-lib/patches/IEDetection',
                        '../js-lib/patches/IE11DragAndDrop',
                        'events/Events',
                        'components/util/History',
                        'components/util/InstanceVariablizer',
                        'components/mask/LoadMask',
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
                        'audit/Audit',
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
                        'components/widget/BackgroundWidget',
                        'components/focusable/FocusCatch',
                        'components/widget/WidgetBase',
                        'components/widget/WidgetPanel',
                        'components/widget/WidgetToolbarItem',
                        'data/models/State',
                        'data/stores/StateStore',
                        'data/models/Dashboard',
                        'data/stores/DashboardStore',
                        'data/models/Stack',
                        'data/stores/StackStore',
                        'data/ModelIdGenerator',
                        'data/models/WidgetDefinition',
                        'data/stores/WidgetStore',
                        'data/collections/Collection',
                        'data/collections/Widgets',
                        'data/models/Group',
                        'data/stores/GroupStore',
                        'layout/create_view_container',
                        'components/button/UserMenuButton',
                        'components/focusable/Focusable',
                        'components/layout/SearchBoxLayout',
                        'components/form/field/SearchBox',
                        'components/grid/column/TextColumn',
                        'components/layout/container/boxOverflow/Menu',
                        'components/layout/container/HBox',
                        'components/layout/DashboardBufferedCardLayout',
                        'components/layout/PinnableAccordion',
                        'components/panel/WidgetHeader',
                        'components/panel/WidgetTool',
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
                        'components/window/MyAppsWindow',
                        'components/window/MyAppTip',
                        'components/window/StoreWizard',
                        'components/window/TipWarning',
                        'components/window/MyPageTip',
                        'components/window/HelpWindow',
                        'views/BaseView',
                        'views/CollectionView',
                        'views/PopoverViewMixin',
                        'notifications/NotificationModel',
                        'notifications/XMPPNotificationsCollection',
                        'views/notifications/NotificationsBadge',
                        'views/notifications/NotificationView',
                        'views/notifications/NotificationDetailsView',
                        'views/notifications/NotificationsGrowl',
                        'views/notifications/NotificationsButton',
                        'views/notifications/NotificationsGroupView',
                        'views/notifications/NotificationsGroupedListView',
                        'views/notifications/NotificationsHeader',
                        'views/notifications/NotificationsSectionHeader',
                        'views/usermenu/UserMenuGroup',
                        'views/usermenu/UserMenu',
                        'views/usermenu/UserMenuButton',
                        'components/ExtBackboneViewWrapper',
                        'components/appcomponents/AppComponent',
                        'components/appcomponents/DetailsTip',
                        'components/appcomponents/AppComponentsList',
                        'components/appcomponents/AppComponentsCarousel',
                        'components/appcomponents/AppComponentsView',
                        'components/appcomponents/IntentsWindow',
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
                        'components/view/ToolDataView',
                        'components/view/TagCloud',
                        'components/button/ShareButton',
                        'components/button/NotificationsButtonWrapper',
                        'components/button/UserMenuButtonWrapper',
                        'components/banner/Banner',
                        'components/widget/WidgetPortlet',
                        'components/widget/WidgetWindow',
                        'state/WidgetStateStoreProvider',
                        'state/WidgetStateContainer',
                        'marketplace/MPListingsRetriever',
                        'marketplace/MPCategoryRetriever',
                        'marketplace/MPListingsAPI',
                        'marketplace/MPCategoryAPI',
                        'marketplace/MarketplaceUserMenuContainer',
                        'components/marketplace/MPWidgetDetailsPanel',
                        'components/marketplace/MarketplaceLauncher',
                        'chrome/WidgetChromeContainer',
                        'components/widget/DeleteWidgetsPanel',
                        'metrics/BaseMetrics',
                        '../js/data/stores/AdminWidgetStore',
                        '../js/data/models/WidgetType',
                        '../js/data/stores/WidgetTypeStore',
                        '../js/data/models/Group',
                        '../js/data/stores/GroupStore',
                        '../js-lib/patches/RemoveListenerCaptureBugOverrides',
                        'app'

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

        perfTest.enabled = false                // Determines whether or not bootstrap is run
        perfTest.assignToOWFUsersGroup = true   // Assign widgets, dashboards and stacks to OWF Users group only
        perfTest.clearCacheEvery = 1000
        perfTest.numDashboardsWidgets = 3       // The number of widgets on each dashboard
        perfTest.numAdmins = 5                  // The number of administrators
        perfTest.numUsers = 99995                   // The number of non-admin users
        perfTest.numGroups = 50                 // The number of groups
        perfTest.numGroupsPerUser = 2           // The number of groups each user is assigned to
        perfTest.numWidgetsInGroups = 5         // The number of widgets assigned to each group
        perfTest.numWidgetsPerUser = 5          // The number of widgets assigned to each user
        perfTest.numPreferences = 2             // The number of preferences per user
        perfTest.numWidgets = 20               // The number of unique widget definitions
        perfTest.numStacks = 10                 // The number of stacks
        perfTest.numStacksPerUser = 3           // The number of stacks per user
        perfTest.numStackDashboards = 2         // The number of dashboards each stack will get assigned to them
        // TODO: perfTest.numPersonalStacks variable to assign stacks that haven't been published to each user only

        perfTest.createSampleWidgets = false
        perfTest.sampleWidgetBaseUrl = 'https://127.0.0.1:8443/owf/sampleWidgets/'

        owf.alternateHostName = System.properties.alternateHostName ?: '127.0.0.1'

        log4j = {
            error   'org.codehaus.groovy.grails.web.servlet',  //  controllers
                    'org.codehaus.groovy.grails.web.pages' //  GSP

            warn    'org.mortbay.log'
            debug   'grails.app'

            info    'grails.plugin.databasemigration'

            trace   'org.hibernate.type.descriptor.sql.BasicBinder'
            debug   'org.hibernate.SQL'

            trace  'org.jivesoftware'

            appenders {
                appender new RollingFileAppender(name:"owfStackTraceLog", maxFileSize:8192,
                    file:"logs/owf-stacktrace.log",
                    layout: pattern(conversionPattern: '%d [%t] %-5p %c %x - %m%n'))
                appender new SyslogAppender( name:"syslogTraceLog",
                    syslogHost:'localhost:8014',
                    facility: 'USER',
                    layout: pattern(conversionPattern: '%d [%t] %-5p %c %x - %m%n'))
                appender new RollingFileAppender (name:"owfCefAudit", maxFileSize:"10000KB", maxBackupIndex: 10,
                        file:"logs/owf-cef-audit.log",
                        layout: pattern(conversionPattern: '%d{yyyy-MM-dd HH:mm:ss,SSS z} [%t] %-5p[%c]: %m%n'))
            }

            info owfCefAudit: 'org.ozoneplatform'

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

      // log4j file watch interval in milliseconds
      log4jWatchTime = 180000; // 3 minutes

      marketplaceLocation = ""
      mpInitialPollingInterval = 5000
      mpPollingInterval = 300000
      mpVersion = "2.5"

      pendingApprovalTagGroupName='pending approval'
      approvedTagGroupName='approved'

      adminBannerIcon = "images/adminLogo52.png"
      adminBannerIconHeight = 52
      adminBannerIconWidth = 346
      adminBannerPageTitle = "Admininistration"

      sendWidgetLoadTimesToServer = true
      publishWidgetLoadTimes = true

      defaultTheme = "a_default"

      showAccessAlert = "false"
      // accessAlertMsg = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla interdum eleifend sapien dignissim malesuada. Sed imperdiet augue vitae justo feugiat eget porta est blandit. Proin ipsum ipsum, rutrum ac gravida in, ullamcorper a augue. Sed at scelerisque augue. Morbi scelerisque gravida sapien ut feugiat. Donec dictum, nisl commodo dapibus pellentesque, enim quam consectetur quam, at dictum dui augue at risus. Ut id nunc in justo molestie semper. Curabitur magna velit, varius eu porttitor et, tempor pulvinar nulla. Nam at tellus nec felis tincidunt fringilla. Nunc nisi sem, egestas ut consequat eget, luctus et nisi. Nulla et lorem odio, vitae pretium ipsum. Integer tellus libero, molestie a feugiat a, imperdiet sit amet metus. Aenean auctor fringilla eros, sit amet suscipit felis eleifend a."

      // Specifies a freeTextEntryMessage to appear on all dialogs which allow text entry
      // To turn off the warning message, use the following:
      //     freeTextEntryWarningMessage=''
      freeTextEntryWarningMessage=''

      //use to specify a logout url
      logoutURL = "/logout"

      //sets the autoSave interval for saving dashboards in milliseconds 900000 is 15 minutes
      autoSaveInterval = 900000

      helpFileRegex = '^.*\\.(htm|html|gsp|jsp|pdf|doc|docx|mov|mp4|wmv)$'

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
        //jsPluginPath = "file:${System.properties['base.dir']}/js-plugins"
    }

    metric {
      enabled = false
      url = 'https://localhost:5443/metric/metric'
      keystorePath = System.properties['javax.net.ssl.keyStore']
      keystorePass = System.properties['javax.net.ssl.keyStorePassword']
      truststorePath = System.properties['javax.net.ssl.trustStore']
      //timeout = 1800000
    }

    dataguard {
        // Option to restrict messages between widgets based on access levels.
        // If this option is set to false, all other dataguard options are ignored.
        restrictMessages = false

        // Option to audit all messages between widgets, not just failed messages.
        // restrictMessages must be set to true
        auditAllMessages = true

        // Option to allow widgets to send messages without specifying their access level.
        // restrictMessages must be set to true
        allowMessagesWithoutAccessLevel = true

        // The amount of time (in milliseconds) to cache a widget's access level.
        // restrictMessages must be set to true
        accessLevelCacheTimeout = 3600000
    }

    // OZP-476: Marketplace (MP) Synchronization
    mpSync {
        // Process listing change notifications from Marketplace(s)
        enabled = false

        // Change notification from MP will cause a new widget to be created
        // in OWF if it does not already exist
        autoCreateWidget = false

        // Added to support server-server communication. Suggest setting
        // this true in development environment where the target MP server
        // has a self-signed cert or similar.
        trustAllCerts = false

        // Added to allow or disallow the trusting of a supplied MP URL.
        // Enable this only when you know that the MP which serves listing
        // information is trustworthy or you could open Ozone to a
        // deliberate "poisoning" of the widget definitions.
        trustProvidedUrl = false
    }

    //this section stores the defaults for the various settings that are available through
    //the Application Configuration Service
    dynamic {
        enable.cef.logging = true
        enable.cef.object.access.logging = true

        disable.inactive.accounts = true
        inactivity.threshold = 90

        session {
            control {
                enabled = false
                max.concurrent = 1
            }
        }

        job {
            disable {
                accounts {
                    interval = 1440
                    start.time = "23:59:59"
                }
            }
        }
    }
}

//Custom quartz configuration goes here.
quartz {
    props {
        scheduler.skipUpdateCheck = true
    }
}

cef {
    device {
        vendor = "OZONE"
        product = "OWF"
        version = "500-27_L2::1.3"
    }

    version = 0
}

// log4j configuration : see log4j.xml

//ssl stuff
keystore = 'certs/keystore.jks'

casSettings.useCas=true
casSettings.FullServiceURL='https://localhost:8443/cas'

notifications {
    enabled = false
    query.interval = 30

    xmpp {
        username = ''
        password = ''
        host = ''
        room = ''
        port = 5222
    }
}

metrics.servletEnabled = true
