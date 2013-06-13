databaseChangeLog = {
    changeSet(author: "owf", id: "7.2.0-1", context: "create, upgrade, 7.2.0") {
        comment(text="Add fullscreen widget types to table")
        insert(tableName: "widget_type") {
            column(name: "id", valueNumeric:"5")
            column(name: "name", value: "fullscreen")
            column(name: "version", valueNumeric: "0")
        }
    }
}