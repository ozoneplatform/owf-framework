databaseChangeLog = {
    changeSet(author: "owf", id: "7.18.0-1", context: "sampleData, 7.17.0-sampleData") {
        insert(tableName: "application_configuration") {
            column(name: "code", value: "owf.widgetcomm.cross.dashboard")
            column(name: "type", value: "Boolean")
            column(name: "group_name", value: "ADDITIONAL_CONFIGURATION")
            column(name: "mutable", valueBoolean: true)
            column(name: "sub_group_order", valueNumeric: 1)
            column(name: "version", valueNumeric: 0)
            column(name: "title", value: " ")
            column(name: "sub_group_name", value: null)
            column(name: '${appconfig.valColumn}', value: "false")
        }
    }
}
