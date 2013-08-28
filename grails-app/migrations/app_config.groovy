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

    changeSet(author: "owf", id: "app_config-7.4-1", dbms:"hsqldb, oracle, postgresql, mssql", context: "create, upgrade, 7.4") {

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
    
    changeSet(author: "owf", id: "app_config-7.4-1", dbms:"mysql", context: "create, upgrade, 7.4") {
        sql("""
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.enable.cef.logging', 'AUDITING', 1, NULL, 1, '', 'Boolean', 'true', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.enable.cef.object.access.logging', 'AUDITING', 1, NULL, 2, '', 'Boolean', 'false', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.cef.sweep.log.location', 'AUDITING', 1, NULL, 3, '', 'Boolean', 'true', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.cef.log.location', 'AUDITING', 1, NULL, 4, '', 'String', '/usr/share/tomcat6', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.enable.cef.log.sweep', 'AUDITING', 1, NULL, 5, '', 'String', '/var/log/cef', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.security.level', 'AUDITING', 1, NULL, 6, '', 'String', NULL, 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.session.control.enabled', 'USER_ACCOUNT_SETTINGS', 1, 'Session Control', 1, '', 'Boolean', 'false', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.session.control.max.concurrent', 'USER_ACCOUNT_SETTINGS', 1, 'Session Control', 2, '', 'Integer', '1', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.disable.inactive.accounts', 'USER_ACCOUNT_SETTINGS', 1, 'Inactive Accounts', 1, '', 'Boolean', 'true', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.inactivity.threshold', 'USER_ACCOUNT_SETTINGS', 1, 'Inactive Accounts', 2, '', 'Integer', '90', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.job.disable.accounts.start.time', 'HIDDEN', 1, NULL, 1, '', 'String', '23:59:59', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.job.disable.accounts.interval', 'HIDDEN', 1, NULL, 2, '', 'Integer', '1440', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.background.url', 'BRANDING', 1, 'Custom Background', 1, '', 'String', '', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.header.url', 'BRANDING', 1, 'Custom Header and Footer', 1, '', 'String', NULL, 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.header.height', 'BRANDING', 1, 'Custom Header and Footer', 2, '', 'Integer', '0', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.footer.url', 'BRANDING', 1, 'Custom Header and Footer', 3, '', 'String', NULL, 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.footer.height', 'BRANDING', 1, 'Custom Header and Footer', 4, '', 'Integer', '0', 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.css', 'BRANDING', 1, 'Custom Header and Footer', 5, '', 'String', NULL, 0);
            INSERT IGNORE INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.jss', 'BRANDING', 1, 'Custom Header and Footer', 6, '', 'String', NULL, 0);
        """)
    }
}
