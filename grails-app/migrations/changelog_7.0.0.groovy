databaseChangeLog = {

    changeSet(author: "owf", id: "7.0.0-1", context: "create, upgrade, 7.0.0") {
        comment("Expand a widget definition's description field to 4000 to match Marketplace")

        modifyDataType(tableName: "widget_definition", columnName: "description", newDataType: "varchar(4000)")
    }
 
    changeSet(author: "owf", id: "7.0.0-2", context: "create, upgrade, 7.0.0") {
        comment("Remove DashboardWidgetState since it is no longer used.")
        dropTable(tableName: "dashboard_widget_state")
    }
  
    // NOTE: In SQL Server, the dropColumn command will fail if that column had a default
    // value set for it.  In this case, the default value must be dropped first.
    // Normally, this would be done using a liquibase dropDefaultValue statement.  However,
    // there is a bug in liquibase (https://liquibase.jira.com/browse/CORE-1141) 
    // that generates invalid SQL in certain versions of
    // SQL Server.  Here, we're using an explicit alter table command.
    changeSet(author: "owf", id: "7.0.0-3", dbms: "mssql", context: "create, upgrade, 7.0.0") {
        comment("Remove show_launch_menu since it is no longer used.")
        sql("ALTER TABLE [dbo].[dashboard] DROP CONSTRAINT DF_dashboard_show_launch_menu")
    }
    
    changeSet(author: "owf", id: "7.0.0-4", context: "create, upgrade, 7.0.0") {
        comment("Remove show_launch_menu since it is no longer used.")
        dropColumn(tableName: "dashboard", columnName: "show_launch_menu")
    }
    
    changeSet(author: "owf", id: "7.0.0-5", context: "create, upgrade, 7.0.0") {
        comment("Remove layout since it is no longer used.")
        dropColumn(tableName: "dashboard", columnName: "layout")
    }
    
    changeSet(author: "owf", id: "7.0.0-6", context: "create, upgrade, 7.0.0") {
        comment("Remove intent_config since it is no longer used.")
        dropColumn(tableName: "dashboard", columnName: "intent_config")
    }
    
    changeSet(author: "owf", id: "7.0.0-7", context: "create, upgrade, 7.0.0") {
        comment("Remove default_settings since it is no longer used.")
        dropColumn(tableName: "dashboard", columnName: "default_settings")
    }
    
    changeSet(author: "owf", id: "7.0.0-8", context: "create, upgrade, 7.0.0") {
        comment("Remove column_count since it is no longer used.")
        dropColumn(tableName: "dashboard", columnName: "column_count")
    }
    
    changeSet(author: "owf", id: "7.0.0-9", context: "create, upgrade, 7.0.0") {
        comment("Create stack table")

        createTable(tableName: "stack") {
            column(autoIncrement: "true", name: "id", type: "bigint") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "stackPK")
            }
            column(name: "version", type: "bigint") {
                constraints(nullable: "false")
            }
            column(name: "name", type:"varchar(256)") {
                constraints(nullable: "false")
            }
            column(name: "stack_position", type: "bigint") {
                constraints(nullable: "false", unique: "true")
            }
            column(name: "description", type:"varchar(4000)") {
                constraints(nullable: "true")
            }
            column(name: "stack_context", type:"varchar(200)") {
                constraints(nullable: "false", unique: "true")
            }
            column(name: "image_url", type:"varchar(2083)") {
                constraints(nullable: "true")
            }
            column(name: "descriptor_url", type:"varchar(2083)") {
                constraints(nullable: "true")
            }
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-10", context: "create, upgrade, 7.0.0", dbms: "hsqldb, mysql, postgresql, oracle") {
        comment("Create stack_groups table")

        createTable(tableName: "stack_groups") {
            column(name: "group_id", type: "bigint") {
                constraints(nullable: "false")
            }
            column(name: "stack_id", type: "bigint") {
                constraints(nullable: "false")
            }
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-11", context: "create, upgrade, 7.0.0", dbms: "mssql") {
      sql ( text = """
        create table stack_groups (group_id numeric(19,0) not null, stack_id bigint not null);
      """)
  }
    
    changeSet(author: "owf", id: "7.0.0-12", context: "create, upgrade, 7.0.0") {
        comment("Add primary key constraint for group_id and stack_id in stack_groups table")
        addPrimaryKey(constraintName: "pk_stack_groups", tableName: "stack_groups", columnNames: "group_id,stack_id")
    }
    
    changeSet(author: "owf", id: "7.0.0-13", context: "create, upgrade, 7.0.0") {
        comment("Add foreign key constraints for group_id and stack_id in stack_groups table")
        
        addForeignKeyConstraint(constraintName: "FK9584AB6B6B3A1281", 
            baseTableName: "stack_groups", baseColumnNames: "stack_id", 
            referencedTableName: "stack", referencedColumnNames: "id")
        
        addForeignKeyConstraint(constraintName: "FK9584AB6B3B197B21", 
            baseTableName: "stack_groups", baseColumnNames: "group_id", 
            referencedTableName: "owf_group", referencedColumnNames: "id")
    }
    
    changeSet(author: "owf", id: "7.0.0-14", context: "create, upgrade, 7.0.0") {
        comment("Add stack_default field to group")
        addColumn(tableName: "owf_group") {
            column(name: "stack_default", type: "boolean", defaultValueBoolean: "false", valueBoolean: "false")
        }
    }
}
