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
        renameColumn(tableName: 'widget_definition', oldColumnName: 'image_url_large', newColumnName: 'image_url_medium', columnDataType: 'VARCHAR(2083)')
    }

}
