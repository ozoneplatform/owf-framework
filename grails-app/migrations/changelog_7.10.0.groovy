databaseChangeLog = {

    changeSet(author: "owf", id: "7.10.0-1", dbms: "mysql,postgresql,oracle,mssql", context: "create, upgrade, 7.10.0") {
        addColumn(tableName: "person") {
            column(name: "last_notification", type: "java.sql.Types.TIMESTAMP"){
                constraints(nullable: "true")
            }
        }
    }

    changeSet(author: 'owf', id: '7.10.0-2', dbms: 'oracle', context: 'create, upgrade, 7.10.0') {
        sql(endDelimiter: "", splitStatements: false, sql:"""
            create or replace trigger app_config_insert before insert on application_configuration
            for each row
            when (new.id is null)
            begin
            select hibernate_sequence.nextval into :new.id from dual;
            end;
            /
        """
        )

        [[code: 'notifications.enabled', type: 'Boolean', mutable: true, value: 'false'],
                [code: 'notifications.query.interval', type: 'Integer', mutable: true, value: '30'],
                [code: 'url.public', type: 'String', mutable: true]
        ].eachWithIndex{ appConfig, index ->
            insert(tableName: 'application_configuration') {
                column(name: 'code', value: appConfig.code)
                column(name: 'type', value: appConfig.type)
                column(name: 'group_name', value: 'NOTIFICATIONS')
                column(name: 'mutable', valueBoolean: appConfig.mutable)
                column(name: 'sub_group_order', valueNumeric: index+1)
                column(name: 'version', valueNumeric: 0)
                column(name: 'title', value: ' ')
                column(name: '${appconfig.valColumn}', value: appConfig.value)
            }
        }

        [[code: 'notifications.xmpp.server.hostname', type: 'String', mutable: true],
                [code: 'notifications.xmpp.server.port', type: 'Integer', mutable: true, value: '5222'],
                [code: 'notifications.xmpp.room', type: 'String', mutable: true],
                [code: 'notifications.xmpp.username', type: 'String', mutable: true],
                [code: 'notifications.xmpp.password', type: 'String', mutable: true]
        ].eachWithIndex{ appConfig, index ->
            insert(tableName: 'application_configuration') {
                column(name: 'code', value: appConfig.code)
                column(name: 'type', value: appConfig.type)
                column(name: 'group_name', value: 'NOTIFICATIONS')
                column(name: 'mutable', valueBoolean: appConfig.mutable)
                column(name: 'sub_group_order', valueNumeric: index+1)
                column(name: 'version', valueNumeric: 0)
                column(name: 'title', value: ' ')
                column(name: 'sub_group_name', value: 'XMPP Settings')
                column(name: '${appconfig.valColumn}', value: appConfig.value)
            }
        }

        sql(endDelimiter: "", splitStatements: false, sql: """
            drop trigger app_config_insert;
            /
        """)
    }

    changeSet(author: 'owf', id: '7.10.0-2', dbms: 'h2, hsqldb, mssql, mysql, postgresql', context: 'create, upgrade, 7.10.0') {
        [[code: 'notifications.enabled', type: 'Boolean', mutable: true, value: 'false'],
                [code: 'notifications.query.interval', type: 'Integer', mutable: true, value: '30'],
                [code: 'url.public', type: 'String', mutable: true]
        ].eachWithIndex{ appConfig, index ->
            insert(tableName: 'application_configuration') {
                column(name: 'code', value: appConfig.code)
                column(name: 'type', value: appConfig.type)
                column(name: 'group_name', value: 'NOTIFICATIONS')
                column(name: 'mutable', valueBoolean: appConfig.mutable)
                column(name: 'sub_group_order', valueNumeric: index+1)
                column(name: 'version', valueNumeric: 0)
                column(name: 'title', value: ' ')
                column(name: '${appconfig.valColumn}', value: appConfig.value)
            }
        }

        [[code: 'notifications.xmpp.server.hostname', type: 'String', mutable: true],
                [code: 'notifications.xmpp.server.port', type: 'Integer', mutable: true, value: '5222'],
                [code: 'notifications.xmpp.room', type: 'String', mutable: true],
                [code: 'notifications.xmpp.username', type: 'String', mutable: true],
                [code: 'notifications.xmpp.password', type: 'String', mutable: true]
        ].eachWithIndex{ appConfig, index ->
            insert(tableName: 'application_configuration') {
                column(name: 'code', value: appConfig.code)
                column(name: 'type', value: appConfig.type)
                column(name: 'group_name', value: 'NOTIFICATIONS')
                column(name: 'mutable', valueBoolean: appConfig.mutable)
                column(name: 'sub_group_order', valueNumeric: index+1)
                column(name: 'version', valueNumeric: 0)
                column(name: 'title', value: ' ')
                column(name: 'sub_group_name', value: 'XMPP Settings')
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

}
