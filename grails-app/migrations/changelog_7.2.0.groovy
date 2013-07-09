databaseChangeLog = {
    changeSet(author: "owf", id: "7.2.0-1", dbms: "mysql,postgresql,oracle,hsqldb", context: "create, upgrade, 7.2.0") {
        comment(text="Add fullscreen widget types to table")
        insert(tableName: "widget_type") {
            column(name: "id", valueNumeric:"5")
            column(name: "name", value: "fullscreen")
            column(name: "version", valueNumeric: "0")
        }
    }

    changeSet(author: "owf", id: "7.2.0-1", dbms:"mssql", context: "create, upgrade, 7.2.0") {
        comment(text="Add fullscreen widget types to table. For SQL server we need to explicitly allow inserting into an auto increment field")

        sql(text = "SET IDENTITY_INSERT [dbo].[widget_type] ON")

        insert(tableName: "widget_type") {
            column(name: "id", valueNumeric:"5")
            column(name: "name", value: "fullscreen")
            column(name: "version", valueNumeric: "0")
        }

        sql(text = "SET IDENTITY_INSERT [dbo].[widget_type] OFF")
    }
}