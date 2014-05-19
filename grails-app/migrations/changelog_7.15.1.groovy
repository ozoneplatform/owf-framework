databaseChangeLog = {
    changeSet(author: 'owf', id: '7.15.1-1', dbms: 'mysql, hsqldb, oracle, mssql, postgresql', context: 'create, upgrade, 7.15.1') {
        ['notifications.xmpp.server.hostname',
         'notifications.xmpp.server.port',
         'notifications.xmpp.room',
         'notifications.xmpp.username',
         'notifications.xmpp.password',
         'notifications.enabled',
         'notifications.query.interval',
         'url.public'
        ].each { code ->
            delete(tableName: 'application_configuration') {
                where("code = '$code'")
            }
        }
    }

    changeSet(author: 'owf', dbms: 'mssql, mysql, postgresql, hsqldb, oracle', id: '7.15.1-2', context: 'create, upgrade, 7.15.1') {
        renameColumn(tableName: 'widget_definition', oldColumnName: 'image_url_large', newColumnName: 'image_url_medium')
        //addColumn(tableName: "widget_definition") {
        //    column(name: "image_url_medium", type: "VARCHAR(2083)")
        //}
    }

    /*changeSet(author: "owf", dbms: "mssql, mysql, postgresql, oracle, hsqldb", id: "7.15.1-3", context: "upgrade, sampleData, 7.15.1") {
        update(tableName: "widget_definition") {
            column(name: "image_url_medium", valueComputed: "image_url_large")
        }
    }*/


}
