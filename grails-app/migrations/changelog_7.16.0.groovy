databaseChangeLog = {
    def fixCefSweepConfigs = {
        update(tableName: "application_configuration") {
            column(name: "type", value: "String")
            column(name: '${appconfig.valColumn}', value: "/var/log/cef")
            column(name: "sub_group_order", value: "5")
            where(text="code='owf.cef.sweep.log.location' AND type <> 'String'")
        }

        update(tableName: "application_configuration") {
            column(name: "type", value: "Boolean")
            column(name: '${appconfig.valColumn}', value: "true")
            column(name: "sub_group_order", value: "3")
            where(text="code='owf.enable.cef.log.sweep' AND type <> 'Boolean'")
        }
    }

    changeSet(author: 'owf', dbms: 'mssql, mysql, postgresql, oracle, hsqldb', id: '7.16.0-1', context: 'create, upgrade, 7.16.0') {
        fixCefSweepConfigs()
    }

    changeSet(author: 'owf', dbms: 'mssql, mysql, postgresql, hsqldb, oracle, h2', id: '7.16.0-2', context: 'create, upgrade, 7.16.0') {
        addColumn(tableName: "person") {
            column(name: "requires_sync", type: "boolean", valueBoolean: "false", defaultValueBoolean: "false")
        }
    }

    changeSet(author: "owf", dbms: 'mssql, mysql, postgresql, hsqldb, oracle, h2', id: "7.16.0-3", context: 'create, upgrade, 7.16.0') {
        addColumn(tableName: "stack") {
            column(name: "default_group_id", type: "bigint")
        }
        addForeignKeyConstraint(baseColumnNames: "default_group_id", baseTableName: "stack", constraintName: "FK68AC28835014F5F", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "owf_group", referencesUniqueColumn: "false")
    }

    changeSet(author: "owf", dbms: 'mssql, mysql, postgresql, hsqldb, oracle, h2', id: "7.16.0-4", context: 'sampleData, 7.16.0-sampleData') {
        update(tableName:"person") {
            column(name:"requires_sync", valueBoolean:"true")
            where(text="id in (1,2,3)")
        }
    }

    changeSet(author: "owf", dbms: 'mssql, mysql, postgresql, hsqldb, oracle, h2', id: "7.16.0-5", context: 'create, upgrade, 7.16.0') {
        createIndex(indexName: "domain_mapping_all", tableName: "domain_mapping") {
            column(name: "src_id")
            column(name: "src_type")
            column(name: "relationship_type")
            column(name: "dest_id")
            column(name: "dest_type")
        }
    }

    changeSet(author: "owf", dbms: 'mssql, mysql, postgresql, hsqldb, oracle, h2', id: "7.16.0-6", context: 'create, upgrade, 7.16.0') {
        addColumn(tableName: "widget_definition") {
            column(name: "mobile_ready", type: "boolean", defaultValueBoolean: "false") {
                constraints(nullable: "false")
            }
        }
    }
}
