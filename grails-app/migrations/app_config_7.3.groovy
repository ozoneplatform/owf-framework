import static ozone.owf.enums.OwfApplicationSetting.*
import static ozone.owf.enums.OwfApplicationSettingType.*

databaseChangeLog = {

    property([name:"appconfig.valColumn", value:"VALUE", dbms:"hsqldb"])
    property([name:"appconfig.valColumn", value:"value", dbms:"mysql, oracle, postgresql, mssql"])

    def doConfigInsert = { appConfig, groupName, subGroupName, order ->
        insert(tableName: "application_configuration") {
            column(name: "code", value: appConfig.code)
            column(name: "type", value: appConfig.type)
            column(name: "group_name", value: groupName)
            column(name: "mutable", valueBoolean: appConfig.mutable)
            column(name: "sub_group_order", valueNumeric: order)
            column(name: "version", valueNumeric: 0)
            column(name: "title", value: "")
            column(name: "sub_group_name", value: subGroupName)
            column(name: '${appconfig.valColumn}', value: appConfig.value)
        }
    }

    changeSet(author: "owf", id: "app_config-7.3-1", context: "create, upgrade, 7.3") {

        [
            [code: CEF_LOGGING_ENABLED.code, type: "Boolean", mutable: true, value: "true"],
            [code: CEF_OBJECT_ACCESS_LOGGING_ENABLED.code, type: "Boolean", mutable: true, value: "false"],
            [code: CEF_LOG_SWEEP_ENABLED.code, type: "Boolean", mutable: true, value: "true"],
            [code: CEF_LOG_LOCATION.code, type: "String", mutable: true, value: "/usr/share/tomcat6"],
            [code: CEF_LOG_SWEEP_LOCATION.code, type: "String", mutable: true, value: "/var/log/cef"],
            [code: SECURITY_LEVEL.code, type: "String", mutable: true]
        ].eachWithIndex{ appConfig, index -> doConfigInsert(appConfig, AUDITING.description, null, index+1) }

        [
            [items: [[code: SESSION_CONTROL_ENABLED.code, type: "Boolean", mutable: true, value: "false"],
                     [code: SESSION_CONTROL_MAX_CONCURRENT.code, type: "Integer", mutable: true, value: "1"]],
             subGroupName: "Session Control"
            ],

            [items: [[code: DISABLE_INACTIVE_ACCOUNTS.code, type: "Boolean", mutable: true, value: "true"],
                     [code: INACTIVITY_THRESHOLD.code, type: "Integer", mutable: true, value: "90"]],
             subGroupName: "Inactive Accounts"
            ]
        ].each { subGroup ->
            subGroup.items.eachWithIndex{ appConfig, index -> doConfigInsert(appConfig, USER_ACCOUNT_SETTINGS.description, subGroup.subGroupName, index+1) }
        }

        [[code: JOB_DISABLE_ACCOUNTS_START.code, type: "String", mutable: true, value: "23:59:59"],
         [code: JOB_DISABLE_ACCOUNTS_INTERVAL.code, type: "Integer", mutable: true, value: "1440"]].eachWithIndex { appConfig, index ->
            doConfigInsert(appConfig, HIDDEN.description, null, index+1)
        }

        [
            [items: [[code: CUSTOM_BACKGROUND_URL.code, type: "String", mutable: true, value: ""]],
             subGroupName: "Custom Background"
            ],

            [items: [[code: CUSTOM_HEADER_URL.code, type: "String", mutable: true],
                     [code: CUSTOM_HEADER_HEIGHT.code, type: "Integer", mutable: true, value: "0"],
                     [code: CUSTOM_FOOTER_URL.code, type: "String", mutable: true],
                     [code: CUSTOM_FOOTER_HEIGHT.code, type: "Integer", mutable: true, value: "0"],
                     [code: CUSTOM_CSS_IMPORTS.code, type: "String", mutable: true],
                     [code: CUSTOM_JS_IMPORTS.code, type: "String", mutable: true]],
             subGroupName: "Custom Header and Footer"
            ]
        ].each { subGroup ->
            subGroup.items.eachWithIndex { appConfig, index -> doConfigInsert(appConfig, BRANDING.description, subGroup.subGroupName, index+1) }
        }
    }
}
