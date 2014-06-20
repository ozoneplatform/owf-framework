databaseChangeLog = {
    fixCefSweepConfigs = {
        update(tableName: "application_configuration") {
            column(name: "type", value: "String")
            column(name: '${appconfig.valColumn}', value: "/var/log/cef")
            column(name: "sub_group_order", value: "5")
            where(text="code='owf.cef.sweep.log.location' AND type <> 'String'")
        }

        update(tableName: "application_configuration") {
            column(name: "type", value: "Boolean")
            column(name: '${appconfig.valColumn}', value: "true")
            column(name: "sub_group_order", value: "3")
            where(text="code='owf.enable.cef.log.sweep' AND type <> 'Boolean'")
        }
    }

    changeSet(author: 'owf', dbms: 'mssql, mysql, postgresql, oracle, hsqldb', id: '7.16.0-1', context: 'create, upgrade, 7.16.0') {
        fixCefSweepConfigs()
    }
}
