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
	
		
	changeSet(author: "owf", dbms: "mysql, oracle, postgresql", id: "7.3.0-2", context: "create, upgrade, 7.3.0") {
		createTable(tableName: "application_configuration") {

			column(autoIncrement: "true", name: "id", type: "java.sql.Types.BIGINT") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "application_configurationPK")
			}

			column(name: "version", type: "java.sql.Types.BIGINT") {
				constraints(nullable: "false")
			}

			column(name: "created_by_id", type: "java.sql.Types.BIGINT")

			column(name: "created_date", type: "java.sql.Types.DATE")

			column(name: "edited_by_id", type: "java.sql.Types.BIGINT")

			column(name: "edited_date", type: "java.sql.Types.DATE")

			column(name: "code", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "false", unique: "true")
			}

			column(name: "value", type: "java.sql.Types.VARCHAR(2000)") {
				constraints(nullable: "true")
			}

			column(name: "title", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "java.sql.Types.VARCHAR(2000)") {
				constraints(nullable: "true")
			}
						
			column(name: "type", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "false")
			}
			
			column(name: "group_name", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "false")
			}

			column(name: "sub_group_name", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "true")
			}
			
			column(name: "mutable", type: "java.sql.Types.BOOLEAN") {
				constraints(nullable: "false")
			}
			
			column(name: "sub_group_order", type: "java.sql.Types.BIGINT")
						
		}

	}

	changeSet(author: "owf", dbms: "mssql", id: "7.3.0-2", context: "create, upgrade, 7.3.0") {
		createTable(tableName: "application_configuration") {

			column(autoIncrement: "true", name: "id", type: "java.sql.Types.BIGINT") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "application_configurationPK")
			}

			column(name: "version", type: "java.sql.Types.BIGINT") {
				constraints(nullable: "false")
			}

			column(name: "created_by_id", type: "numeric(19, 0)")

			column(name: "created_date", type: "java.sql.Types.DATE")

			column(name: "edited_by_id", type: "numeric(19, 0)")

			column(name: "edited_date", type: "java.sql.Types.DATE")

			column(name: "code", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "false", unique: "true")
			}

			column(name: "value", type: "java.sql.Types.VARCHAR(2000)") {
				constraints(nullable: "true")
			}

			column(name: "title", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "java.sql.Types.VARCHAR(2000)") {
				constraints(nullable: "true")
			}

			column(name: "type", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "false")
			}

			column(name: "group_name", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "false")
			}

			column(name: "sub_group_name", type: "java.sql.Types.VARCHAR(250)") {
				constraints(nullable: "true")
			}

			column(name: "mutable", type: "java.sql.Types.BOOLEAN") {
				constraints(nullable: "false")
			}
			
			column(name: "sub_group_order", type: "java.sql.Types.BIGINT")
		}
	}

	changeSet(author: "owf", id: "7.3.0-2", context: "create, upgrade, 7.3.0") {
		createIndex(indexName: "FKFC9C0477666C6D2", tableName: "application_configuration") {
			column(name: "created_by_id")
		}

		createIndex(indexName: "FKFC9C047E31CB353", tableName: "application_configuration") {
			column(name: "edited_by_id")
		}

		createIndex(tableName: "application_configuration", indexName: "app_config_group_name_idx") {
			comment("Create index for application_configuration.group_name")
			column(name: "group_name")
		}

		addForeignKeyConstraint(baseColumnNames: "created_by_id", baseTableName: "application_configuration", constraintName: "FKFC9C0477666C6D2", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
		addForeignKeyConstraint(baseColumnNames: "edited_by_id", baseTableName: "application_configuration", constraintName: "FKFC9C047E31CB353", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}
	
}