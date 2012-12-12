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

    changeSet(author: "owf", id: "7.0.0-31", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_definition] ON
      """)
    }

    changeSet(author: "owf", id: "7.0.0-32", context: "sampleData, 7.0.0-sampleData") {
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
    changeSet(author: "owf", id: "7.0.0-33", context: "sampleData, 7.0.0-sampleData") {
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

    changeSet(author: "owf", id: "7.0.0-34", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_definition] OFF
      """)
    }

    changeSet(author: "owf", id: "7.0.0-35", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent] ON
      """)
    }
    changeSet(author: "owf", id: "7.0.0-36", context: "sampleData, 7.0.0-sampleData") {
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
    changeSet(author: "owf", id: "7.0.0-37", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent] OFF
      """)
    }

    changeSet(author: "owf", id: "7.0.0-38", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent_data_type] ON
      """)
    }
    changeSet(author: "owf", id: "7.0.0-39", context: "sampleData, 7.0.0-sampleData") {
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
    changeSet(author: "owf", id: "7.0.0-40", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent_data_type] OFF
      """)
    }

    changeSet(author: "owf", id: "7.0.0-41", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_def_intent] ON
      """)
    }
    changeSet(author: "owf", id: "7.0.0-42", context: "sampleData, 7.0.0-sampleData") {
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
    changeSet(author: "owf", id: "7.0.0-43", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_def_intent] OFF
      """)
    }

    changeSet(author: "owf", id: "7.0.0-44", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[domain_mapping] ON
      """)
    }
    changeSet(author: "owf", id: "7.0.0-45", context: "sampleData, 7.0.0-sampleData") {
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
    changeSet(author: "owf", id: "7.0.0-46", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
      """)
    }

    changeSet(author: "owf", id: "7.0.0-47", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[dashboard] ON
        """)
    }

    changeSet(author: "owf", id: "7.0.0-48", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Add Contacts Dashboards")
        
        insert(tableName: "dashboard") {
            column(name: "id", valueNumeric: "323")
            column(name: "version", valueNumeric: "0")
            column(name: "isdefault", valueBoolean: "false")
            column(name: "dashboard_position", valueNumeric: "0")
            column(name: "altered_by_admin", valueBoolean: "false")
            column(name: "guid", value: "7f2f6d45-263a-7aeb-d841-3637678ce559")
//          column(name: "column_count", valueNumeric: "0")
            column(name: "name", value: "Contacts")
            column(name: "description", value: "This dashboard uses the Contacts Manager, Direction and Google Maps widgets.")
//          column(name: "default_settings", value: "{}")
            column(name: "layout_config", value: """{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"25%","items":[],"widgets":[{"universalName":"org.owfgoss.owf.examples.ContactsManager","widgetGuid":"92448ba5-7f2b-982a-629e-9d621268b5e9","uniqueId":"208c64f4-14ed-b31b-98b1-15408cc1620e","dashboardGuid":"f935e19e-09a1-451e-8b3d-0fb77537da7d","paneGuid":"5c478b1d-ba1f-ef67-087c-c03b8dbc7bff","intentConfig":null,"launchData":null,"name":"Contacts Manager","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":448,"width":419},{"universalName":"org.owfgoss.owf.examples.GetDirections","widgetGuid":"302c35c9-9ed8-d0b6-251c-ea1ed4d0c86b","uniqueId":"1929bfaf-ed08-47f3-c231-cd2e9d59e341","dashboardGuid":"f935e19e-09a1-451e-8b3d-0fb77537da7d","paneGuid":"5c478b1d-ba1f-ef67-087c-c03b8dbc7bff","intentConfig":{},"launchData":null,"name":"Directions","active":false,"x":0,"y":482,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"singleton":false,"floatingWidget":false,"height":447,"width":419}],"paneType":"accordionpane","defaultSettings":{"widgetStates":{"302c35c9-9ed8-d0b6-251c-ea1ed4d0c86b":{"timestamp":1354747263559},"d182002b-3de2-eb24-77be-95a7d08aa85b":{"timestamp":1354745224627},"92448ba5-7f2b-982a-629e-9d621268b5e9":{"timestamp":1354747263555}}},"flex":0.25},{"xtype":"dashboardsplitter"},{"xtype":"tabbedpane","cls":"right","htmlText":"75%","items":[],"paneType":"tabbedpane","widgets":[{"universalName":"org.owfgoss.owf.examples.GoogleMaps","widgetGuid":"d182002b-3de2-eb24-77be-95a7d08aa85b","uniqueId":"570f3364-e21a-8f96-d8e5-f61d81196ebc","dashboardGuid":"f935e19e-09a1-451e-8b3d-0fb77537da7d","paneGuid":"a25052e4-cd5d-51c0-a440-81327fc1d955","intentConfig":null,"launchData":null,"name":"Google Maps","active":true,"x":423,"y":62,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":867,"width":1257}],"defaultSettings":{"widgetStates":{"d182002b-3de2-eb24-77be-95a7d08aa85b":{"timestamp":1354747263599},"b87c4a3e-aa1e-499e-ba10-510f35388bb6":{"timestamp":1354746772856},"ec5435cf-4021-4f2a-ba69-dde451d12551":{"timestamp":1354746684155},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"timestamp":1354746684154},"d6ce3375-6e89-45ab-a7be-b6cf3abb0e8c":{"timestamp":1354747222261},"eb81c029-a5b6-4107-885c-5e04b4770767":{"timestamp":1354747222264},"c3f3c8e0-e7aa-41c3-a655-aca3c940f828":{"timestamp":1354746826290}}},"flex":0.75}],"flex":1}""")
        }
    }
    changeSet(author: "owf", id: "7.0.0-49", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[dashboard] OFF
        """)
    }

    changeSet(author: "owf", id: "7.0.0-50", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] ON
        """)
    }

    changeSet(author: "owf", id: "7.0.0-51", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Assign Intents and Sample Dashboards to OWF Users group")

        // Assign Intents Dashboard to OWF Users group
        insert(tableName: "domain_mapping") {
            column(name: "id", valueNumeric: "342")
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueNumeric: "192")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueNumeric: "323")
            column(name: "dest_type", value: "dashboard")
        }
    }

    changeSet(author: "owf", id: "7.0.0-52", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
        """)
    }

    changeSet(author: "owf", id: "7.0.0-53", context: "create, upgrade, 7.0.0") {
        comment("Expand a dashboard's description field to 4000 to match Marketplace")

        modifyDataType(tableName: "dashboard", columnName: "description", newDataType: "varchar(4000)")
    }

    changeSet(author: "owf", id: "7.0.0-54", context: "sampleData, 7.0.0-sampleData", dbms:"hsqldb, mysql, mssql") {
        comment(text="Create Investments stack and its default group.")

        insert(tableName: "stack") {
            column(name: "version", valueNumeric: "0")
            column(name: "name", value: "Investments")
            column(name: "description", value: "Sample stack containing dashboards with example investment widgets.")
            column(name: "stack_context", value: "investments")
        }

        insert(tableName: "owf_group") {
            column(name: "version", valueNumeric: "0")
            column(name: "automatic", valueBoolean: "false")
            column(name: "name", value: "ce86a612-c355-486e-9c9e-5252553cc58f")
            column(name: "status", value: "active")
            column(name: "stack_default", valueBoolean: "true")
        }

        sql (text = """
            insert into stack_groups (stack_id, group_id) values ((select id from stack where stack_context = 'investments'), (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'));
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-54", context: "sampleData, 7.0.0-sampleData", dbms: "oracle") {
        comment(text="Create Investments stack and its default group.")
        sql (text = """
            insert into stack (id, version, name, description, stack_context) values (hibernate_sequence.nextval, 0, 'Investments', 'Sample stack containing dashboards with example investment widgets.', 'investments');
        """)

        sql (text = """
            insert into owf_group (id, version, automatic, name, status, stack_default) values (hibernate_sequence.nextval, 0, 0, 'ce86a612-c355-486e-9c9e-5252553cc58f', 'active', 1);
        """)

        sql (text = """
            insert into stack_groups (stack_id, group_id) values ((select id from stack where stack_context = 'investments'), (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'));
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-54", context: "sampleData, 7.0.0-sampleData", dbms: "postgresql") {
        comment(text="Create Investments stack and its default group.")
        sql (text = """
            insert into stack (id, version, name, description, stack_context) values (nextval('hibernate_sequence'), 0, 'Investments', 'Sample stack containing dashboards with example investment widgets.', 'investments');
        """)

        sql (text = """
            insert into owf_group (id, version, automatic, name, status, stack_default) values (nextval('hibernate_sequence'), 0, false, 'ce86a612-c355-486e-9c9e-5252553cc58f', 'active', true);
        """)

        sql (text = """
            insert into stack_groups (stack_id, group_id) values ((select id from stack where stack_context = 'investments'), (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'));
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-55", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Add Investments stack to the OWF Users group.")
        sql (text = """
            insert into stack_groups (stack_id, group_id) values ((select id from stack where stack_context = 'investments'), (select id from owf_group where name = 'OWF Users'));
        """)
    }

    changeSet(author: "owf", id: "7.0.0-56", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] ON
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-57", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Rename the Widget Intents dashboard to Watch List and add it to the Investments stack.")

        // Remove Widget Intents Dashboard from OWF Users group and add it to the default stack
        sql (text = """
            update domain_mapping set src_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f') where dest_id = 320;
        """)

        // Rename to Watch List
        update(tableName: "dashboard") {
            column(name: "name", value: "Watch List")
            where("guid = '3f59855b-d93e-dc03-c6ba-f4c33ea0177f'")
        }

        // Update stack_id on the Watch List dashboard
        sql (text = """
            update dashboard set stack_id = (select id from stack where stack_context = 'investments') where guid='3f59855b-d93e-dc03-c6ba-f4c33ea0177f';
        """)
    }

    changeSet(author: "owf", id: "7.0.0-58", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-59", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Add the Contacts dashboard to the Investments stack.")

        // Update stack_id on the Contacts dashboard
        sql (text = """
            update dashboard set stack_id = (select id from stack where stack_context = 'investments') where id = 323;
        """)

        // Update stack's unique widget count
        update(tableName: "stack") {
            column(name: "unique_widget_count", valueNumeric: "6")
            where("stack_context = 'investments'")
        }
    }

    changeSet(author: "owf", id: "7.0.0-60", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] ON
        """)
    }

    changeSet(author: "owf", id: "7.0.0-61", context: "sampleData, 7.0.0-sampleData", dbms:"hsqldb, mysql, mssql") {
        comment(text="Add Widget Intents and Contacts dashboards' widgets to Investments stack.")

        // Add the widgets in Watch List dashboard to the Investments stack
        sql (text = """
            insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (343, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 178, 'widget_definition');
            insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (344, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 179, 'widget_definition');
            insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (345, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 180, 'widget_definition');
        """)

        // Add the widgets in Contacts dashboard to the Investments stack
        sql (text = """
            insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (346, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 181, 'widget_definition');
            insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (347, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 182, 'widget_definition');
            insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (348, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 183, 'widget_definition');
        """)

        // Update stack's unique widget count
        update(tableName: "stack") {
            column(name: "unique_widget_count", valueNumeric: "6")
            where("stack_context = 'investments'")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-61", context: "sampleData, 7.0.0-sampleData", dbms: "oracle") {
        comment(text="Add Widget Intents and Contacts dashboards' widgets to Investments stack.")

        // Set sequence to a higher number that's not used
        dropSequence(sequenceName: "hibernate_sequence")
        createSequence(sequenceName: "hibernate_sequence", startValue:"700")

        // Add the widgets in Watch List dashboard to the Investments stack
        sql (text = """
            insert into domain_mapping VALUES (hibernate_sequence.nextval, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 178, 'widget_definition');
            insert into domain_mapping VALUES (hibernate_sequence.nextval, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 179, 'widget_definition');
            insert into domain_mapping VALUES (hibernate_sequence.nextval, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 180, 'widget_definition');
        """)

        // Add the widgets in Contacts dashboard to the Investments stack
        sql (text = """
            insert into domain_mapping VALUES (hibernate_sequence.nextval, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 181, 'widget_definition');
            insert into domain_mapping VALUES (hibernate_sequence.nextval, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 182, 'widget_definition');
            insert into domain_mapping VALUES (hibernate_sequence.nextval, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 183, 'widget_definition');
        """)

        // Update stack's unique widget count
        update(tableName: "stack") {
            column(name: "unique_widget_count", valueNumeric: "6")
            where("stack_context = 'investments'")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-61", context: "sampleData, 7.0.0-sampleData", dbms: "postgresql") {
        comment(text="Add Widget Intents and Contacts dashboards' widgets to Investments stack.")

        // Set sequence to a higher number that's not used
        dropSequence(sequenceName: "hibernate_sequence")
        createSequence(sequenceName: "hibernate_sequence", startValue:"700")

        // Add the widgets in Watch List dashboard to the Investments stack
        sql (text = """
            insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 178, 'widget_definition');
            insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 179, 'widget_definition');
            insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 180, 'widget_definition');
        """)

        // Add the widgets in Contacts dashboard to the Investments stack
        sql (text = """
            insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 181, 'widget_definition');
            insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 182, 'widget_definition');
            insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 183, 'widget_definition');
        """)

        // Update stack's unique widget count
        update(tableName: "stack") {
            column(name: "unique_widget_count", valueNumeric: "6")
            where("stack_context = 'investments'")
        }
    }

    changeSet(author: "owf", id: "7.0.0-62", context: "sampleData, 7.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
        """)
    }

    changeSet(author: "owf", id: "7.0.0-63", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Reorder the dashboards so they appear Sample dashboard, Investments stack, and then Administration dashboard.")

        // Set Watch List dashboard to not be the default so Sample dashboard can be first
        update(tableName: "dashboard") {
            column(name: "isdefault", valueBoolean: false)
            where("guid = '3f59855b-d93e-dc03-c6ba-f4c33ea0177f'")
        }

        update(tableName: "dashboard") {
            column(name: "dashboard_position", valueNumeric: "1")
            where("guid = '3f59855b-d93e-dc03-c6ba-f4c33ea0177f'")
        }
        update(tableName: "dashboard") {
            column(name: "dashboard_position", valueNumeric: "2")
            where("guid = '7f2f6d45-263a-7aeb-d841-3637678ce559'")
        }
        update(tableName: "dashboard") {
            column(name: "dashboard_position", valueNumeric: "3")
            where("guid = '54949b5d-f0ee-4347-811e-2522a1bf96fe'")
        }
    }

    changeSet(author: "owf", id: "7.0.0-64", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Remove Preferences, Color Client, Color Server, Widget Chrome, Event Monitor, and Nearly Empty widgets.")

        delete(tableName: "person_widget_definition") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/Preferences.gsp')")
        }
        delete(tableName: "person_widget_definition") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorClient.gsp')")
        }
        delete(tableName: "person_widget_definition") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorServer.gsp')")
        }
        delete(tableName: "person_widget_definition") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp')")
        }
        delete(tableName: "person_widget_definition") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/EventMonitor.html')")
        }
        delete(tableName: "person_widget_definition") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/NearlyEmptyWidget.html')")
        }


        delete(tableName: "widget_definition_widget_types") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/Preferences.gsp')")
        }
        delete(tableName: "widget_definition_widget_types") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorClient.gsp')")
        }
        delete(tableName: "widget_definition_widget_types") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorServer.gsp')")
        }
        delete(tableName: "widget_definition_widget_types") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp')")
        }
        delete(tableName: "widget_definition_widget_types") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/EventMonitor.html')")
        }
        delete(tableName: "widget_definition_widget_types") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/NearlyEmptyWidget.html')")
        }


        delete(tableName: "widget_definition") {
            where("widget_url = 'examples/walkthrough/widgets/Preferences.gsp'")
        }
        delete(tableName: "widget_definition") {
            where("widget_url = 'examples/walkthrough/widgets/ColorClient.gsp'")
        }
        delete(tableName: "widget_definition") {
            where("widget_url = 'examples/walkthrough/widgets/ColorServer.gsp'")
        }
        delete(tableName: "widget_definition") {
            where("widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp'")
        }
        delete(tableName: "widget_definition") {
            where("widget_url = 'examples/walkthrough/widgets/EventMonitor.html'")
        }
        delete(tableName: "widget_definition") {
            where("widget_url = 'examples/walkthrough/widgets/NearlyEmptyWidget.html'")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-65", dbms:"mssql", context: "sampleData, 7.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
          SET IDENTITY_INSERT [dbo].[widget_definition] ON
      """)
    }
    
    changeSet(author: "owf", id: "7.0.0-66", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Add Stacks Admin widgets to sample data.")
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "184")
    
            column(name: "version", valueNumeric: "0")
    
            column(name: "visible", valueBoolean: "false")
    
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Stacks64.png")
    
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Stacks24.png")
    
            column(name: "singleton", valueBoolean: "false")
    
            column(name: "width", valueNumeric: "581")
    
            column(name: "widget_version", value: "1.0")
    
            column(name: "height", valueNumeric: "440")
    
            column(name: "widget_url", value: "admin/StackEdit.gsp")
    
            column(name: "widget_guid", value: "9b5ebb40-8540-466c-8ccd-66092ec55636")
    
            column(name: "display_name", value: "Stack Editor")
    
            column(name: "background", valueBoolean: "false")
        }
    
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "185")
    
            column(name: "version", valueNumeric: "0")
    
            column(name: "visible", valueBoolean: "true")
    
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Stacks64.png")
    
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Stacks24.png")
    
            column(name: "singleton", valueBoolean: "false")
    
            column(name: "width", valueNumeric: "818")
    
            column(name: "widget_version", value: "1.0")
    
            column(name: "height", valueNumeric: "440")
    
            column(name: "widget_url", value: "admin/StackManagement.gsp")
    
            column(name: "widget_guid", value: "fe97f656-862e-4c54-928d-3cdd776daf5b")
    
            column(name: "display_name", value: "Stacks")
    
            column(name: "background", valueBoolean: "false")
        }
        
    }
    
    changeSet(author: "owf", id: "7.0.0-67", dbms:"mssql", context: "sampleData, 7.0.0-sampleData") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[widget_definition] OFF
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-68", dbms:"mssql", context: "sampleData, 7.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
          SET IDENTITY_INSERT [dbo].[domain_mapping] ON
      """)
    }
    
    changeSet(author: "owf", id: "7.0.0-69", context: "7.0.0-sampleData", dbms: "oracle") {
        comment(text="Add Widget Intents and Contacts dashboards' widgets to Investments stack.")

        // Set sequence to a higher number that's not used
        //dropSequence(sequenceName: "hibernate_sequence")
        //createSequence(sequenceName: "hibernate_sequence", startValue:"700")

        // Add the widgets in Watch List dashboard to the Investments stack
        sql (text = """
            insert into domain_mapping VALUES (hibernate_sequence.nextval, 0, (select id from owf_group where id = 191), 'group', 'owns', 184, 'widget_definition');
            insert into domain_mapping VALUES (hibernate_sequence.nextval, 0, (select id from owf_group where id = 191), 'group', 'owns', 185, 'widget_definition');
        """)
    }
       
    changeSet(author: "owf", id: "7.0.0-69", context: "7.0.0-sampleData", dbms: "postgresql") {
        comment(text="Add Widget Intents and Contacts dashboards' widgets to Investments stack.")

        // Set sequence to a higher number that's not used
        //dropSequence(sequenceName: "hibernate_sequence")
        //createSequence(sequenceName: "hibernate_sequence", startValue:"700")

        // Add the widgets in Watch List dashboard to the Investments stack
        sql (text = """
            insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where id = 191), 'group', 'owns', 184, 'widget_definition');
            insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where id = 191), 'group', 'owns', 185, 'widget_definition');
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-69", context: "sampleData, 7.0.0-sampleData", dbms:"hsqldb, mysql, mssql") {
        comment(text="Add the group ownership mappings for the stacks admin widgets.")
        insert(tableName: "domain_mapping") {
            column(name: "id", valueNumeric: "349")
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueNumeric: "191")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueNumeric: "184")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "id", valueNumeric: "350")
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueNumeric: "191")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueNumeric: "185")
            column(name: "dest_type", value: "widget_definition")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-70", dbms:"mssql", context: "sampleData, 7.0.0-sampleData") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-71", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Insert widget type mapping links for stack admin widgets")
        sql ( text = """
          insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
          select id, 2 from widget_definition
          where widget_url in (
            'admin/StackManagement.gsp',
            'admin/StackEdit.gsp'
            )
        """ )
    }
    
    changeSet(author: "owf", id: "7.0.0-72", dbms: "mysql,mssql,postgresql,hsqldb", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Update Administration Dashboards")
        
        update(tableName: "dashboard") {
            column(name: "layout_config", value: """{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"universalName":null,"widgetGuid":"9d804b74-b2a6-448a-bd04-fe286905ab8f","uniqueId":"327a1df4-a879-f361-db47-03635a0f5730","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"73cf2212-9c0a-5d75-987c-4820faf3cf30","intentConfig":null,"name":"Group Dashboards","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":4,"singleton":false,"floatingWidget":false,"height":329,"width":675,"background":false,"columnOrder":""},{"universalName":null,"widgetGuid":"412ec70d-a178-41ae-a8d9-6713a430c87c","uniqueId":"ca5b5bb3-14de-3a77-e689-1a752adca824","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"73cf2212-9c0a-5d75-987c-4820faf3cf30","intentConfig":null,"name":"Widgets","active":false,"x":0,"y":363,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":5,"singleton":false,"floatingWidget":false,"height":328,"width":675,"background":false,"columnOrder":""},{"universalName":null,"widgetGuid":"fe97f656-862e-4c54-928d-3cdd776daf5b","uniqueId":"58f2f00b-a785-c61c-497f-7a99a59e350d","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"73cf2212-9c0a-5d75-987c-4820faf3cf30","intentConfig":null,"name":"Stacks","active":true,"x":0,"y":691,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":3,"singleton":false,"floatingWidget":false,"height":328,"width":675,"background":false,"columnOrder":""}],"paneType":"accordionpane","defaultSettings":{"widgetStates":{"9d804b74-b2a6-448a-bd04-fe286905ab8f":{"timestamp":1354917003344},"412ec70d-a178-41ae-a8d9-6713a430c87c":{"timestamp":1354917003349},"fe97f656-862e-4c54-928d-3cdd776daf5b":{"timestamp":1354917003354},"9b5ebb40-8540-466c-8ccd-66092ec55636":{"timestamp":1354916964296},"6cf4f84a-cc89-45ba-9577-15c34f66ee9c":{"timestamp":1354916988848},"a540f672-a34c-4989-962c-dcbd559c3792":{"timestamp":1354916998451}}}},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"vbox right","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"tabbedpane","cls":"top","flex":1,"htmlText":"50%","items":[],"widgets":[{"universalName":null,"widgetGuid":"b87c4a3e-aa1e-499e-ba10-510f35388bb6","uniqueId":"49404ec0-c77c-f6b8-b3f9-d5c77fe465a1","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"da405d45-8f04-c2d6-f45c-5ba780aa97fc","intentConfig":null,"name":"Groups","active":false,"x":679,"y":62,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":3,"singleton":false,"floatingWidget":false,"height":462,"width":676,"background":false,"columnOrder":""},{"universalName":null,"widgetGuid":"b3b1d04f-97c2-4726-9575-82bb1cf1af6a","uniqueId":"7437065e-fb6c-3253-866c-d05bf45d180a","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"da405d45-8f04-c2d6-f45c-5ba780aa97fc","intentConfig":null,"name":"Users","active":false,"x":679,"y":62,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"singleton":false,"floatingWidget":false,"height":462,"width":676,"background":false,"columnOrder":""}],"paneType":"tabbedpane","defaultSettings":{"widgetStates":{"b87c4a3e-aa1e-499e-ba10-510f35388bb6":{"timestamp":1354916950506},"b3b1d04f-97c2-4726-9575-82bb1cf1af6a":{"timestamp":1354916950489}}}},{"xtype":"dashboardsplitter"},{"xtype":"tabbedpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"tabbedpane","widgets":[{"universalName":null,"widgetGuid":"9b5ebb40-8540-466c-8ccd-66092ec55636","uniqueId":"de8e1489-1cfc-7a26-e807-6167d91f1539","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"1e5dc42c-89c2-6fd4-b887-efaafdceb260","intentConfig":null,"name":"Stack Editor","active":true,"x":679,"y":556,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":463,"width":676,"background":false,"columnOrder":""}],"defaultSettings":{"widgetStates":{"9b5ebb40-8540-466c-8ccd-66092ec55636":{"timestamp":1354917012829},"6cf4f84a-cc89-45ba-9577-15c34f66ee9c":{"timestamp":1354917003399},"a540f672-a34c-4989-962c-dcbd559c3792":{"timestamp":1354917012827}}}}],"flex":1}],"flex":3}""")
            where("id=322")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-72", dbms: "oracle", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Update Administration Dashboards")
        sql( text = """
            UPDATE dashboard SET layout_config = to_clob('{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"universalName":null,"widgetGuid":"9d804b74-b2a6-448a-bd04-fe286905ab8f","uniqueId":"327a1df4-a879-f361-db47-03635a0f5730","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"73cf2212-9c0a-5d75-987c-4820faf3cf30","intentConfig":null,"name":"Group Dashboards","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":4,"singleton":false,"floatingWidget":false,"height":329,"width":675,"background":false,"columnOrder":""},{"universalName":null,"widgetGuid":"412ec70d-a178-41ae-a8d9-6713a430c87c","uniqueId":"ca5b5bb3-14de-3a77-e689-1a752adca824","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"73cf2212-9c0a-5d75-987c-4820faf3cf30","intentConfig":null,"name":"Widgets","active":false,"x":0,"y":363,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":5,"singleton":false,"floatingWidget":false,"height":328,"width":675,"background":false,"columnOrder":""},{"universalName":null,"widgetGuid":"fe97f656-862e-4c54-928d-3cdd776daf5b","uniqueId":"58f2f00b-a785-c61c-497f-7a99a59e350d","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"73cf2212-9c0a-5d75-987c-4820faf3cf30","intentConfig":null,"name":"Stacks","active":true,"x":0,"y":691,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":3,"singleton":false,"floatingWidget":false,"height":328,"width":675,"background":false,"columnOrder":""}],"paneType":"accordionpane","defaultSettings":{"widgetStates":{"9d804b74-b2a6-448a-bd04-fe286905ab8f":{"timestamp":1354917003344},"412ec70d-a178-41ae-a8d9-6713a430c87c":{"timestamp":1354917003349},"fe97f656-862e-4c54-928d-3cdd776daf5b":{"timestamp":1354917003354},"9b5ebb40-8540-466c-8ccd-66092ec55636":{"timestamp":1354916964296},"6cf4f84a-cc89-45ba-9577-15c34f66ee9c":{"timestamp":1354916988848},"a540f672-a34c-4989-962c-dcbd559c3792":{"timestamp":1354916998451}}}},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"vbox right","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"tabbedpane","cls":"top","flex":1,"htmlText":"50%","items":[],"widgets":[{"universalName":null,"widgetGuid":"b87c4a3e-aa1e-499e-ba10-510f35388bb6","uniqueId":"49404ec0-c77c-f6b8-b3f9-d5c77fe465a1","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"da405d45-8f04-c2d6-f45c-5ba780aa97fc","intentConfig":null,"name":"Groups","active":false,"x":679,"y":62,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":3,') || to_clob('"singleton":false,"floatingWidget":false,"height":462,"width":676,"background":false,"columnOrder":""},{"universalName":null,"widgetGuid":"b3b1d04f-97c2-4726-9575-82bb1cf1af6a","uniqueId":"7437065e-fb6c-3253-866c-d05bf45d180a","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"da405d45-8f04-c2d6-f45c-5ba780aa97fc","intentConfig":null,"name":"Users","active":false,"x":679,"y":62,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"singleton":false,"floatingWidget":false,"height":462,"width":676,"background":false,"columnOrder":""}],"paneType":"tabbedpane","defaultSettings":{"widgetStates":{"b87c4a3e-aa1e-499e-ba10-510f35388bb6":{"timestamp":1354916950506},"b3b1d04f-97c2-4726-9575-82bb1cf1af6a":{"timestamp":1354916950489}}}},{"xtype":"dashboardsplitter"},{"xtype":"tabbedpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"tabbedpane","widgets":[{"universalName":null,"widgetGuid":"9b5ebb40-8540-466c-8ccd-66092ec55636","uniqueId":"de8e1489-1cfc-7a26-e807-6167d91f1539","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"1e5dc42c-89c2-6fd4-b887-efaafdceb260","intentConfig":null,"name":"Stack Editor","active":true,"x":679,"y":556,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":463,"width":676,"background":false,"columnOrder":""}],"defaultSettings":{"widgetStates":{"9b5ebb40-8540-466c-8ccd-66092ec55636":{"timestamp":1354917012829},"6cf4f84a-cc89-45ba-9577-15c34f66ee9c":{"timestamp":1354917003399},"a540f672-a34c-4989-962c-dcbd559c3792":{"timestamp":1354917012827}}}}],"flex":1}],"flex":3}') WHERE id=322;
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-73", context: "sampleData, 7.0.0-sampleData") {
        comment(text="Clean out some old domain mapping entries for widgets that have been removed from our sample database.")

        delete(tableName: "domain_mapping") {
            where("dest_id = 6 AND dest_type = 'widget_definition'")
        }
        delete(tableName: "domain_mapping") {
            where("dest_id = 7 AND dest_type = 'widget_definition'")
        }
        delete(tableName: "domain_mapping") {
            where("dest_id = 171 AND dest_type = 'widget_definition'")
        }
    }
    
    changeSet(author: "owf", id: "7.0.0-74", context: "sampleData, 7.0.0-sampleData", dbms: "mysql, postgresql, oracle, hsqldb") {
        comment(text="Remove Contacts dashboard from OWF Users group and add it to the default stack.")

        sql (text = """
            update domain_mapping set src_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f') where dest_id = 323;
        """)
    }
    
    changeSet(author: "owf", id: "7.0.0-74", context: "sampleData, 7.0.0-sampleData", dbms: "mssql") {
        comment(text="Remove Contacts dashboard from OWF Users group and add it to the default stack.")

        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] ON
        """)

        sql (text = """
            update domain_mapping set src_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f') where dest_id = 323;
        """)

        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
        """)
    }
}
