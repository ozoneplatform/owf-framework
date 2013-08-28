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
            [code: "owf.enable.cef.logging", type: "Boolean", mutable: true, value: "true"],
            [code: "owf.enable.cef.object.access.logging", type: "Boolean", mutable: true, value: "false"],
            [code: "owf.cef.sweep.log.location", type: "Boolean", mutable: true, value: "true"],
            [code: "owf.cef.log.location", type: "String", mutable: true, value: "/usr/share/tomcat6"],
            [code: "owf.enable.cef.log.sweep", type: "String", mutable: true, value: "/var/log/cef"],
            [code: "owf.security.level", type: "String", mutable: true]
        ].eachWithIndex{ appConfig, index -> doConfigInsert(appConfig, "AUDITING", null, index+1) }

        [
            [items: [[code: "owf.session.control.enabled", type: "Boolean", mutable: true, value: "false"],
                     [code: "owf.session.control.max.concurrent", type: "Integer", mutable: true, value: "1"]],
             subGroupName: "Session Control"
            ],

            [items: [[code: "owf.disable.inactive.accounts", type: "Boolean", mutable: true, value: "true"],
                     [code: "owf.inactivity.threshold", type: "Integer", mutable: true, value: "90"]],
             subGroupName: "Inactive Accounts"
            ]
        ].each { subGroup ->
            subGroup.items.eachWithIndex{ appConfig, index -> doConfigInsert(appConfig, "USER_ACCOUNT_SETTINGS", subGroup.subGroupName, index+1) }
        }

        [[code: "owf.job.disable.accounts.start.time", type: "String", mutable: true, value: "23:59:59"],
         [code: "owf.job.disable.accounts.interval", type: "Integer", mutable: true, value: "1440"]].eachWithIndex { appConfig, index ->
            doConfigInsert(appConfig, "HIDDEN", null, index+1)
        }

        [
            [items: [[code: "owf.custom.background.url", type: "String", mutable: true, value: ""]],
             subGroupName: "Custom Background"
            ],

            [items: [[code: "owf.custom.header.url", type: "String", mutable: true],
                     [code: "owf.custom.header.height", type: "Integer", mutable: true, value: "0"],
                     [code: "owf.custom.footer.url", type: "String", mutable: true],
                     [code: "owf.custom.footer.height", type: "Integer", mutable: true, value: "0"],
                     [code: "owf.custom.css", type: "String", mutable: true],
                     [code: "owf.custom.jss", type: "String", mutable: true]],
             subGroupName: "Custom Header and Footer"
            ]
        ].each { subGroup ->
            subGroup.items.eachWithIndex { appConfig, index -> doConfigInsert(appConfig, "BRANDING", subGroup.subGroupName, index+1) }
        }
    }
}
