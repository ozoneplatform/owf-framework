databaseChangeLog = {
    changeSet(author: "owf", id: "7.2.0-1", context: "create, upgrade, 7.2.0") {
        comment(text="Add fullscreen widget types to table")
        insert(tableName: "widget_type") {
            column(name: "id", valueNumeric:"5")
            column(name: "name", value: "fullscreen")
            column(name: "version", valueNumeric: "0")
        }
    }

    changeSet(author: "owf", id: "7.2.0-2", context: "create, upgrade, 7.2.0") {
        comment("Add type to dashboard")
        addColumn(tableName: "dashboard") {
            column(name: "type", type: "varchar(255)")
        }
    }

    changeSet(author: "owf", id: "7.2.0-3", context: "upgrade, 7.2.0, sampleData, 7.2.0-sampleData") {
        comment("Update existing dashboards to set type to marketplace if name is Apps Mall")
        update(tableName: "dashboard") {
            column(name: "type", value: 'marketplace')
            where("name='Apps Mall'")
        }
    }
}