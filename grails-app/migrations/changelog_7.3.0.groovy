databaseChangeLog = {
    changeSet(author: "owf", id: "7.3.0-1", context: "create, upgrade, 7.3.0") {
        comment("Add type to dashboard")
        addColumn(tableName: "dashboard") {
            column(name: "type", type: "varchar(255)")
        }
    }

    changeSet(author: "owf", id: "7.3.0-2", context: "upgrade, 7.3.0, sampleData, 7.3.0-sampleData") {
        comment("Update existing dashboards to set type to marketplace if name is Apps Mall")
        update(tableName: "dashboard") {
            column(name: "type", value: 'marketplace')
            where("name='Apps Mall'")
        }
    }
}