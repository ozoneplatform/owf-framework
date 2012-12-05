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
    
    changeSet(author: "owf", id: "7.0.0-15", context: "create, upgrade, 7.0.0", dbms: "hsqldb, mysql, mssql") {
        comment(text="Insert OWF stack")
        insert(tableName: "stack") {
            column(name: "version", valueNumeric: "0")
            column(name: "name", value: "OWF")
            column(name: "description", value: "OWF Stack")
            column(name: "stack_context", value: "owf")
            column(name: "image_url", value: "themes/common/images/owf.png")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-16", context: "create, upgrade, 7.0.0", dbms: "oracle") {
        comment(text="Insert OWF stack")
        sql (text = """
            insert into stack (id, version, name, description, stack_context, image_url) values (hibernate_sequence.nextval, 0, 'OWF', 'OWF Stack', 'owf', 'themes/common/images/owf.png');
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-17", context: "create, upgrade, 7.0.0", dbms: "postgresql") {
        comment(text="Insert OWF stack")
        sql (text = """
            insert into stack (id, version, name, description, stack_context, image_url) values (nextval('hibernate_sequence'), 0, 'OWF', 'OWF Stack', 'owf', 'themes/common/images/owf.png');
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-18", context: "create, upgrade, 7.0.0", dbms: "hsqldb, mysql, mssql") {
        comment(text="Insert OWF stack default group")
        insert(tableName: "owf_group") {
            column(name: "version", valueNumeric: "0")
            column(name: "automatic", valueBoolean: "false")
            column(name: "name", value: "ce86a612-c355-486e-9c9e-5252553cc58e")
            column(name: "status", value: "active")
            column(name: "stack_default", valueBoolean: "true")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-19", context: "create, upgrade, 7.0.0", dbms: "oracle") {
        comment(text="Insert OWF stack default group")
        sql (text = """
            insert into owf_group (id, version, automatic, name, status, stack_default) values (hibernate_sequence.nextval, 0, 0, 'ce86a612-c355-486e-9c9e-5252553cc58e', 'active', 1);
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-20", context: "create, upgrade, 7.0.0", dbms: "postgresql") {
        comment(text="Insert OWF stack default group")
        sql (text = """
            insert into owf_group (id, version, automatic, name, status, stack_default) values (nextval('hibernate_sequence'), 0, false, 'ce86a612-c355-486e-9c9e-5252553cc58e', 'active', true);
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-21", context: "create, upgrade, 7.0.0") {
        sql (text = """
            insert into stack_groups (stack_id, group_id) values ((select id from stack where name = 'OWF'), (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58e'));
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-22", context: "create, upgrade, 7.0.0") {
        comment("Add a reference to a host stack to dashboard records to track where user instances should appear")
        addColumn(tableName: "dashboard") {
            column(name: "stack_id", type: "bigint")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-23", context: "create, upgrade, 7.0.0") {
        comment("Add foreign key constraint for stack_id in the dashboard table")
        addForeignKeyConstraint(constraintName: "FKC18AEA946B3A1281",
            baseColumnNames: "stack_id", baseTableName: "dashboard", 
            referencedColumnNames: "id", referencedTableName: "stack")
    }
    
    changeSet(author: "owf", id: "7.0.0-24", context: "create, upgrade, 7.0.0") {
        comment("Add a property to track the count of unique widgets present on the dashboards of a stack")
        addColumn(tableName: "stack") {
            column(name: "unique_widget_count", type: "bigint", defaultValue: 0)
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-25", context: "create, upgrade, 7.0.0") {
        sql (text = """
            delete from stack_groups where stack_id = (select id from stack where name = 'OWF') and group_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58e');
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-26", context: "create, upgrade, 7.0.0") {
        comment("Delete OWF Stack Group")

        delete(tableName: "owf_group") {
            where(text="name like 'ce86a612-c355-486e-9c9e-5252553cc58e'")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-27", context: "create, upgrade, 7.0.0") {
        comment("Delete OWF Stack")

        delete(tableName: "stack") {
            where(text="name like 'OWF'")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-28", context: "create, upgrade, 7.0.0") {
        comment("Add user_widget field to person_widget_definition table")
        addColumn(tableName: "person_widget_definition") {
            column(name: "user_widget", type: "boolean", defaultValueBoolean: "false", valueBoolean: "false")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-29", dbms: "mysql,mssql,oracle", context: "upgrade, 7.0.0, sampleData, 7.0.0-sampleData") {
        comment("Update existing PWD records to set whether they were added to a user directly or just via a group")
        update(tableName: "person_widget_definition") {
            column(name: "user_widget", valueBoolean: true)
            where("group_widget=0")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-29", dbms: "postgresql,hsqldb", context: "upgrade, 7.0.0, sampleData, 7.0.0-sampleData") {
        comment("Update existing PWD records to set whether they were added to a user directly or just via a group")
        update(tableName: "person_widget_definition") {
            column(name: "user_widget", valueBoolean: true)
            where("group_widget=false")
        }
    }

    changeSet(author: "owf", id: "7.0.0-30", context: "upgrade, 7.0.0, sampleData, 7.0.0-sampleData") {
        comment("Remove the Widget Approvals widget definition and all of its user, group, intent, and widget type references")

        delete(tableName: "domain_mapping") {
            where(text="dest_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp') and  dest_type = 'widget_definition'")
        }

        delete(tableName: "person_widget_definition") {
            where(text="widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp')")
        }

        delete(tableName: "widget_definition_widget_types") {
            where(text="widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp')")
        }
        
        delete(tableName: "widget_def_intent_data_types") {
            where(text="widget_definition_intent_id in (select id from widget_def_intent where widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp'))")
        }

        delete(tableName: "widget_def_intent") {
            where(text="widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp')")
        }

        delete(tableName: "widget_definition") {
            where(text="widget_url='admin/MarketplaceApprovals.gsp'")
        }
    }

    changeSet(author: "owf", id: "7.0.0-31", context: "sampleData, 7.0.0-sampleData") {
        comment(text="insert new sample data")
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "181")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "examples/walkthrough/widgets/directions/img/logo.png")
            column(name: "image_url_small", value: "examples/walkthrough/widgets/directions/img/logo.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "400")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "400")
            column(name: "widget_url", value: "examples/walkthrough/widgets/directions")
            column(name: "widget_guid", value: "302c35c9-9ed8-d0b6-251c-ea1ed4d0c86b")
            column(name: "display_name", value: "Directions")
            column(name: "background", valueBoolean: "false")
            column(name: "universal_name", value: "org.owfgoss.owf.examples.GetDirections")
            column(name: "description", value: "This widget allows user to get directions fron one place to another.")
            column(name: "descriptor_url", value: "../examples/walkthrough/widgets/directions/descriptor/descriptor.html")
        }
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "182")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "examples/walkthrough/widgets/googlemaps/img/logo.png")
            column(name: "image_url_small", value: "examples/walkthrough/widgets/googlemaps/img/logo.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "800")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "600")
            column(name: "widget_url", value: "examples/walkthrough/widgets/googlemaps")
            column(name: "widget_guid", value: "d182002b-3de2-eb24-77be-95a7d08aa85b")
            column(name: "display_name", value: "Google Maps")
            column(name: "background", valueBoolean: "false")
            column(name: "universal_name", value: "org.owfgoss.owf.examples.GoogleMaps")
            column(name: "description", value: "This widget displays markers or directions.")
            column(name: "descriptor_url", value: "../examples/walkthrough/widgets/googlemaps/descriptor/descriptor.html")
        }
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "183")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "examples/walkthrough/widgets/contacts/img/logo.png")
            column(name: "image_url_small", value: "examples/walkthrough/widgets/contacts/img/logo.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "400")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "400")
            column(name: "widget_url", value: "examples/walkthrough/widgets/contacts")
            column(name: "widget_guid", value: "92448ba5-7f2b-982a-629e-9d621268b5e9")
            column(name: "display_name", value: "Contacts Manager")
            column(name: "background", valueBoolean: "false")
            column(name: "universal_name", value: "org.owfgoss.owf.examples.ContactsManager")
            column(name: "description", value: "This widget allows users to manage their contacts.")
            column(name: "descriptor_url", value: "../examples/walkthrough/widgets/contacts/descriptor/descriptor.html")
        }
    }
    changeSet(author: "owf", id: "7.0.0-32", context: "sampleData, 7.0.0-sampleData") {
        comment(text="insert new sample data")
        insert(tableName: "widget_definition_widget_types") {
            column(name: "widget_definition_id", valueNumeric: "181")
            column(name: "widget_type_id", valueNumeric: "1")
        }
        insert(tableName: "widget_definition_widget_types") {
            column(name: "widget_definition_id", valueNumeric: "182")
            column(name: "widget_type_id", valueNumeric: "1")
        }
        insert(tableName: "widget_definition_widget_types") {
            column(name: "widget_definition_id", valueNumeric: "183")
            column(name: "widget_type_id", valueNumeric: "1")
        }
    }
    changeSet(author: "owf", id: "7.0.0-33", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent] ON
      """)
    }
    changeSet(author: "owf", id: "7.0.0-34", context: "sampleData, 7.0.0-sampleData") {
        comment(text="insert new sample data")
        // Create Intents
        insert(tableName: "intent") {
            column(name: "id", valueNumeric: "303")
            column(name: "version", valueNumeric: "0")
            column(name: "action", value: "plot")
        }
        insert(tableName: "intent") {
            column(name: "id", valueNumeric: "304")
            column(name: "version", valueNumeric: "0")
            column(name: "action", value: "navigate")
        }
    }
    changeSet(author: "owf", id: "7.0.0-35", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent] OFF
      """)
    }

    changeSet(author: "owf", id: "7.0.0-36", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent_data_type] ON
      """)
    }
    changeSet(author: "owf", id: "7.0.0-37", context: "sampleData, 7.0.0-sampleData") {
        comment(text="insert new sample data")
        // Map intents to data types
        insert(tableName: "intent_data_type") {
            column(name: "id", valueNumeric: "305")
            column(name: "version", valueNumeric: "0")
            column(name: "data_type", value: "application/vnd.owf.sample.addresses")
        }
        insert(tableName: "intent_data_type") {
            column(name: "id", valueNumeric: "306")
            column(name: "version", valueNumeric: "0")
            column(name: "data_type", value: "application/vnd.owf.sample.address")
        }
        insert(tableName: "intent_data_types") {
            column(name: "intent_data_type_id", valueNumeric: "306")
            column(name: "intent_id", valueNumeric: "303")
        }
        insert(tableName: "intent_data_types") {
            column(name: "intent_data_type_id", valueNumeric: "305")
            column(name: "intent_id", valueNumeric: "304")
        }
        insert(tableName: "intent_data_types") {
            column(name: "intent_data_type_id", valueNumeric: "306")
            column(name: "intent_id", valueNumeric: "304")
        }
    }
    changeSet(author: "owf", id: "7.0.0-38", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent_data_type] OFF
      """)
    }
    changeSet(author: "owf", id: "7.0.0-39", context: "sampleData, 7.0.0-sampleData") {
        comment(text="insert new sample data")
        // Assign Intents to Intents Widgets
        insert(tableName: "widget_def_intent") {
            column(name: "id", valueNumeric: "309")
            column(name: "version", valueNumeric: "0")
            column(name: "receive", valueBoolean: "true")
            column(name: "send", valueBoolean: "false")
            column(name: "intent_id", valueNumeric: "303")
            column(name: "widget_definition_id", valueNumeric: "182")
        }
        insert(tableName: "widget_def_intent") {
            column(name: "id", valueNumeric: "310")
            column(name: "version", valueNumeric: "0")
            column(name: "receive", valueBoolean: "true")
            column(name: "send", valueBoolean: "false")
            column(name: "intent_id", valueNumeric: "304")
            column(name: "widget_definition_id", valueNumeric: "182")
        }
        insert(tableName: "widget_def_intent") {
            column(name: "id", valueNumeric: "311")
            column(name: "version", valueNumeric: "0")
            column(name: "receive", valueBoolean: "false")
            column(name: "send", valueBoolean: "true")
            column(name: "intent_id", valueNumeric: "304")
            column(name: "widget_definition_id", valueNumeric: "181")
        }
        insert(tableName: "widget_def_intent_data_types") {
            column(name: "intent_data_type_id", valueNumeric: "306")
            column(name: "widget_definition_intent_id", valueNumeric: "309")
        }
        insert(tableName: "widget_def_intent_data_types") {
            column(name: "intent_data_type_id", valueNumeric: "305")
            column(name: "widget_definition_intent_id", valueNumeric: "310")
        }
        insert(tableName: "widget_def_intent_data_types") {
            column(name: "intent_data_type_id", valueNumeric: "305")
            column(name: "widget_definition_intent_id", valueNumeric: "311")
        }
    }

    changeSet(author: "owf", id: "7.0.0.40", context: "sampleData, 7.0.0-sampleData") {
        comment(text="insert new sample data")

        // Assign Contacts Dashboard widgets to OWF Users group
        insert(tableName: "domain_mapping") {
            column(name: "id", valueNumeric: "339")
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueNumeric: "192")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueNumeric: "181")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "id", valueNumeric: "340")
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueNumeric: "192")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueNumeric: "182")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "id", valueNumeric: "341")
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueNumeric: "192")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueNumeric: "183")
            column(name: "dest_type", value: "widget_definition")
        }
    }
}
