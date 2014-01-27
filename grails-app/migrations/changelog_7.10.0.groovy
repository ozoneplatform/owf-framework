databaseChangeLog = {
    
    changeSet(author: "owf", id: "7.10.0-1", dbms: "mysql,postgresql,oracle,hsqldb", context: "create, upgrade, 7.10.0") {
        addColumn(tableName: "person") {
            column(name: "last_notification", type: "java.sql.Types.DATE")
        }
    }
}
