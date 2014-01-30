databaseChangeLog = {
    
    changeSet(author: "owf", id: "7.10.0-1", dbms: "mysql,postgresql,oracle", context: "create, upgrade, 7.10.0") {
        addColumn(tableName: "person") {
            column(name: "last_notification", type: "java.sql.Types.TIMESTAMP"){
                constraints(nullable: "true")
            }
        }
    }

    changeSet(author: 'owf', id: '7.10.0-2', dbms: 'hsqldb, mssql, mysql, oracle, postgresql', context: 'create, upgrade, 7.10.0') {
        [[code: 'notifications.enabled', type: 'Boolean', mutable: true, value: 'false'],
                [code: 'notifications.xmpp.server.hostname', type: 'String', mutable: true],
                [code: 'notifications.xmpp.server.port', type: 'String', mutable: true, value: '5222'],
                [code: 'notifications.xmpp.room', type: 'String', mutable: true],
                [code: 'notifications.xmpp.username', type: 'String', mutable: true],
                [code: 'notifications.xmpp.password', type: 'String', mutable: true]
        ].eachWithIndex{ appConfig, index ->
            insert(tableName: 'application_configuration') {
                column(name: 'code', value: appConfig.code)
                column(name: 'type', value: appConfig.type)
                column(name: 'group_name', value: 'BRANDING')
                column(name: 'mutable', valueBoolean: appConfig.mutable)
                column(name: 'sub_group_order', valueNumeric: index+1)
                column(name: 'version', valueNumeric: 0)
                column(name: 'title', value: ' ')
                column(name: 'sub_group_name', value: 'Notifications')
                column(name: '${appconfig.valColumn}', value: appConfig.value)
            }
        }
    }

    changeSet(author: "owf", id: "7.10.0-3", dbms: "hsqldb", context: "create, upgrade, 7.10.0") {
        addColumn(tableName: "person") {
            column(name: "last_notification", type: "timestamp"){
                constraints(nullable: "true")
            }
        }
    }
    /*
    changeSet(author: 'marketplace', dbms: 'hsqldb, mssql, mysql, oracle, postgresql', id: '7.10.0-3', context: 'create, 7.10.0') {
        insert(tableName: 'application_configuration') {
            column(name: 'code', value: 'url.public')
            column(name: 'type', value: 'String')
            column(name: 'title', value: ' ')
            column(name: 'group_name', value: 'BRANDING')
            column(name: 'mutable', valueBoolean: true)
            column(name: 'version', valueNumeric: 0)
        }
    } */
}
