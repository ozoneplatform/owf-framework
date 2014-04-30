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
            println code
            delete(tableName: 'application_configuration') {
                where("code = '$code'")
            }
        }
    }
}
