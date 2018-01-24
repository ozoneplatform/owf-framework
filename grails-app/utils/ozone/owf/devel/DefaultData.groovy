package ozone.owf.devel

import grails.converters.JSON

import ozone.owf.grails.domain.ERoleAuthority


class DefaultData {

    public static final List<Map> APPLICATION_CONFIGURATION =
            [[code         : 'owf.enable.cef.logging',
              value        : 'false',
              title        : 'Enable CEF Logging',
              type         : 'Boolean',
              groupName    : 'AUDITING',
              subGroupOrder: 1],

             [code         : 'owf.enable.cef.object.access.logging',
              value        : 'false',
              title        : 'Enable CEF Object Access Logging',
              type         : 'Boolean',
              groupName    : 'AUDITING',
              subGroupOrder: 2],

             [code         : 'owf.enable.cef.log.sweep',
              value        : 'false',
              title        : 'Enable CEF Sweep Log',
              type         : 'Boolean',
              groupName    : 'AUDITING',
              subGroupOrder: 3],

             [code         : 'owf.cef.log.location',
              value        : '/usr/share/tomcat6',
              title        : 'CEF Log Location',
              type         : 'String',
              groupName    : 'AUDITING',
              subGroupOrder: 4],

             [code         : 'owf.cef.sweep.log.location',
              value        : '/var/log/cef',
              title        : 'CEF Sweep Log Location',
              type         : 'String',
              groupName    : 'AUDITING',
              subGroupOrder: 5],

             [code         : 'owf.security.level',
              value        : null,
              title        : 'Security Level',
              type         : 'String',
              groupName    : 'AUDITING',
              subGroupOrder: 6],

             [code         : 'owf.session.control.enabled',
              value        : 'false',
              title        : 'Enable Session Control',
              type         : 'Boolean',
              groupName    : 'USER_ACCOUNT_SETTINGS',
              subGroupName : 'Session Control',
              subGroupOrder: 1],

             [code         : 'owf.session.control.max.concurrent',
              value        : '1',
              title        : 'Max Concurrent Sessions',
              type         : 'Integer',
              groupName    : 'USER_ACCOUNT_SETTINGS',
              subGroupName : 'Session Control',
              subGroupOrder: 2],

             [code         : 'owf.disable.inactive.accounts',
              value        : 'true',
              title        : 'Disable Inactive Accounts',
              type         : 'Boolean',
              groupName    : 'USER_ACCOUNT_SETTINGS',
              subGroupName : 'Inactive Accounts',
              subGroupOrder: 1],

             [code         : 'owf.inactivity.threshold',
              value        : '90',
              title        : 'Account Inactivity Threshold',
              type         : 'Integer',
              groupName    : 'USER_ACCOUNT_SETTINGS',
              subGroupName : 'Inactive Accounts',
              subGroupOrder: 2],

             [code         : 'owf.job.disable.accounts.start.time',
              value        : '23:59:59',
              title        : 'Disable Accounts Job Start Time',
              type         : 'String',
              groupName    : 'HIDDEN',
              subGroupOrder: 1],

             [code         : 'owf.job.disable.accounts.interval',
              value        : '1440',
              title        : 'Disable Accounts Job Interval',
              type         : 'Integer',
              groupName    : 'HIDDEN',
              subGroupOrder: 2],

             [code         : 'free.warning.content',
              value        : null,
              title        : 'Warning Banner Content',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupOrder: 1],

             [code         : 'owf.custom.background.url',
              value        : '',
              title        : 'Custom Background URL',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Background',
              subGroupOrder: 1],

             [code         : 'owf.custom.header.url',
              value        : null,
              title        : 'Custom Header URL',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 1],

             [code         : 'owf.custom.header.height',
              value        : '0',
              title        : 'Custom Header Height',
              type         : 'Integer',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 2],

             [code         : 'owf.custom.footer.url',
              value        : null,
              title        : 'Custom Footer URL',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 3],

             [code         : 'owf.custom.footer.height',
              value        : '0',
              title        : 'Custom Footer Height',
              type         : 'Integer',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 4],

             [code         : 'owf.custom.css',
              value        : null,
              title        : 'Custom CSS',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 5],

             [code         : 'owf.custom.jss',
              value        : null,
              title        : 'Custom Javascript',
              type         : 'String',
              groupName    : 'BRANDING',
              subGroupName : 'Custom Header and Footer',
              subGroupOrder: 6]]


    public static final Map ADMIN_GROUP =
            [automatic  : true,
             name       : 'OWF Administrators',
             displayName: 'OWF Administrators',
             description: 'OWF Administrators']

    public static final Map USER_GROUP =
            [automatic  : true,
             name       : 'OWF Users',
             displayName: 'OWF Users',
             description: 'OWF Users']


    public static final Map ADMIN_ROLE =
            [authority  : ERoleAuthority.ROLE_ADMIN.strVal,
             description: "Admin Role"]

    public static final Map USER_ROLE =
            [authority  : ERoleAuthority.ROLE_USER.strVal,
             description: "User Role"]


    public static final Map ADMIN1 =
            [username    : 'testAdmin1',
             userRealName: 'Test Administrator 1',
             description : 'Test Administrator 1',
             email       : 'testAdmin1@ozone.test']

    public static final Map USER1 =
            [username    : 'testUser1',
             userRealName: 'Test User 1',
             description : 'Test User 1',
             email       : 'testUser1@ozone.test']


    public static final List<Map> ADMIN1_PREFERENCES =
            [[namespace: 'owf.admin.UserEditCopy',
              path     : 'guid_to_launch',
              value    : 'a9bf8e71-692d-44e3-a465-5337ce5e725e'],
             [namespace: 'owf.admin.WidgetEditCopy',
              path     : 'guid_to_launch',
              value    : '679294b3-ccc3-4ace-a061-e3f27ed86451'],
             [namespace: 'owf.admin.GroupEditCopy',
              path     : 'guid_to_launch',
              value    : 'dc5c2062-aaa8-452b-897f-60b4b55ab564'],
             [namespace: 'owf.admin.DashboardEditCopy',
              path     : 'guid_to_launch',
              value    : '2445afb9-eb3f-4b79-acf8-6b12180921c3'],
             [namespace: 'owf.admin.StackEditCopy',
              path     : 'guid_to_launch',
              value    : '72c382a3-89e7-4abf-94db-18db7779e1df']]


    public static final Map<String, String> ADMIN_WIDGET_TYPE =
            [name: 'administration', displayName: 'administration']

    public static final Map<String, String> STANDARD_WIDGET_TYPE =
            [name: 'standard', displayName: 'standard']

    public static final List<Map> WIDGET_TYPES =
            [STANDARD_WIDGET_TYPE,
             ADMIN_WIDGET_TYPE,
             [name: 'marketplace', displayName: 'store'],
             [name: 'metric', displayName: 'metric'],
             [name: 'fullscreen', displayName: 'fullscreen']]


    public static final List<Map> ADMIN_WIDGET_DEFINITIONS =
            [[displayName   : 'App Component Editor',
              widgetGuid    : '679294b3-ccc3-4ace-a061-e3f27ed86451',
              universalName : 'org.ozoneplatform.owf.admin.appcomponentedit',
              widgetUrl     : 'admin/WidgetEdit',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Widgets24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Widgets64.png',
              width         : 581,
              height        : 440,
              visible       : false],

             [displayName   : 'App Components',
              widgetGuid    : '48edfe94-4291-4991-a648-c19a903a663b',
              universalName : 'org.ozoneplatform.owf.admin.appcomponentmanagement',
              widgetUrl     : 'admin/WidgetManagement',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Widgets24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Widgets64.png',
              width         : 818,
              height        : 440],

             [displayName   : 'Group Editor',
              widgetGuid    : 'dc5c2062-aaa8-452b-897f-60b4b55ab564',
              universalName : 'org.ozoneplatform.owf.admin.groupedit',
              widgetUrl     : 'admin/GroupEdit',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Groups24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Groups64.png',
              width         : 581,
              height        : 440,
              visible       : false],

             [displayName   : 'Groups',
              widgetGuid    : '53a2a879-442c-4012-9215-a17604dedff7',
              universalName : 'org.ozoneplatform.owf.admin.groupmanagement',
              widgetUrl     : 'admin/GroupManagement',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Groups24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Groups64.png',
              width         : 818,
              height        : 440],

             [displayName   : 'User Editor',
              widgetGuid    : 'a9bf8e71-692d-44e3-a465-5337ce5e725e',
              universalName : 'org.ozoneplatform.owf.admin.useredit',
              widgetUrl     : 'admin/UserEdit',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Users24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Users64.png',
              width         : 581,
              height        : 440,
              visible       : false],

             [displayName   : 'Users',
              widgetGuid    : '38070c45-5f6a-4460-810c-6e3496495ec4',
              universalName : 'org.ozoneplatform.owf.admin.usermanagement',
              widgetUrl     : 'admin/UserManagement',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Users24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Users64.png',
              width         : 818,
              height        : 440],

             [displayName   : 'Configuration',
              widgetGuid    : 'af180bfc-3924-4111-93de-ad6e9bfc060e',
              universalName : 'org.ozoneplatform.owf.admin.configuration',
              widgetUrl     : 'admin/Configuration',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Configuration24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Configuration64.png',
              width         : 900,
              height        : 440],

             [displayName   : 'App Editor',
              widgetGuid    : '72c382a3-89e7-4abf-94db-18db7779e1df',
              universalName : 'org.ozoneplatform.owf.admin.appedit',
              widgetUrl     : 'admin/StackEdit',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Stacks24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Stacks64.png',
              width         : 581,
              height        : 440,
              visible       : false],

             [displayName   : 'Apps',
              widgetGuid    : '391dd2af-a207-41a3-8e51-2b20ec3e7241',
              universalName : 'org.ozoneplatform.owf.admin.appmanagement',
              widgetUrl     : 'admin/StackManagement',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Stacks24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Stacks64.png',
              width         : 818,
              height        : 440],

             [displayName   : 'Page Editor',
              widgetGuid    : '2445afb9-eb3f-4b79-acf8-6b12180921c3',
              universalName : 'org.ozoneplatform.owf.admin.pageedit',
              widgetUrl     : 'admin/DashboardEdit',
              widgetVersion : '1.0',
              imageUrlSmall : 'themes/common/images/adm-tools/Dashboards24.png',
              imageUrlMedium: 'themes/common/images/adm-tools/Dashboards64.png',
              width         : 581,
              height        : 440,
              visible       : false]]

    public static final Map ADMIN_STACK =
            [name             : 'Administration',
             description      : 'This application collects the administrative components into a common set of application pages for managing system resources.  These pages can be used to create, modify, update, and delete Apps, App Components, Users and Groups, and system configuration settings.',
             stackContext     : 'ef8b5d6f-4b16-4743-9a57-31683c94b616',
             imageUrl         : 'themes/common/images/admin/64x64_admin_app.png',
             uniqueWidgetCount: 5,
             approved         : true]

    public static final Map INVESTMENT_STACK =
            [name             : 'Investments',
             description      : 'Sample app containing example investment pages.',
             stackContext     : 'investments',
             uniqueWidgetCount: 6,
             approved         : true]

    public static final Map SAMPLE_STACK =
            [name             : 'Sample',
             stackContext     : '908d934d-9d53-406c-8143-90b406fb508f',
             uniqueWidgetCount: 2,
             approved         : true]

    public static final String APPS_DASHBOARD_GUID = "cbb92835-7d13-41dc-8f28-3eba59a6a6d5"

    public static final Map APPS_DASHBOARD_LAYOUT =
            [widgets        : [universalName : "org.ozoneplatform.owf.admin.appmanagement",
                               widgetGuid    : "391dd2af-a207-41a3-8e51-2b20ec3e7241",
                               uniqueId      : "bf05736e-a52e-d4ee-7da5-4e39c6df53c8",
                               dashboardGuid : APPS_DASHBOARD_GUID,
                               paneGuid      : "6ff1c292-9689-4240-7cd8-e4a251978395",
                               intentConfig  : null,
                               launchData    : null,
                               name          : "Apps",
                               active        : true,
                               x             : 0,
                               y             : 33,
                               zIndex        : 0,
                               minimized     : false,
                               maximized     : false,
                               pinned        : false,
                               collapsed     : false,
                               columnPos     : 0,
                               buttonId      : null,
                               buttonOpened  : false,
                               region        : "none",
                               statePosition : 1,
                               singleton     : false,
                               floatingWidget: false,
                               height        : 973,
                               width         : 1554],
             height         : "100%",
             items          : [],
             xtype          : "fitpane",
             flex           : 1,
             paneType       : "fitpane",
             defaultSettings: {}]

    public static final Map APPS_DASHBOARD =
            [dashboardPosition: 1,
             guid             : APPS_DASHBOARD_GUID,
             name             : 'Apps',
             description      : 'Administer the Apps in the system.',
             layoutConfig     : json(APPS_DASHBOARD_LAYOUT),
             iconImageUrl     : 'themes/common/images/adm-tools/Stacks64.png',
             publishedToStore : true]

    private static String json(Object value) {
        (value as JSON).toString()
    }

}
