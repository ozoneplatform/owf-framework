databaseChangeLog = {
    def setupPgIdGenerators = {
        comment('Fixing Postgres id columns to have id generators')

        sql("""
            -- ensure that the sequence has been used, otherwise the currval calls
            -- below will fail
            select nextval('hibernate_sequence');
        """)

        ['dashboard', 'domain_mapping', 'owf_group',
        'person', 'person_widget_definition', 'preference', 'requestmap', 'role',
        'tag_links', 'tags', 'widget_definition'].each { table ->
            sql("""
                -- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM ${table}),
                    false);

                ALTER TABLE ${table} ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');
            """)
        }
    }

    changeSet(author: 'owf', id: "7.3.0-0-pg", context: "create, 7.3.0", dbms: 'postgresql') {
        setupPgIdGenerators()
    }

    changeSet(author: 'owf', id: "7.3.0-0-pg-sampleData", context: "sampleData, 7.3.0-sampleData", dbms: 'postgresql') {
        // We must reinitialize the ID generators during the sample data
        // script since the hibernate sequence is dropped by some older
        // sample data change sets. Also must have different change set ID
        // from the identical code used in create since the sample data
        // script is run as separate script after create. (Such a conflict
        // does not occur with the upgrade script as either create or
        // upgrade is run; never both.)
        setupPgIdGenerators()
    }

    changeSet(author: "owf", id: "7.3.0-1", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
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


    changeSet(author: "owf", id: "7.3.0-3", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
        createTable(tableName: "application_configuration") {

            column(autoIncrement: "true", name: "id", type: "java.sql.Types.BIGINT") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "application_configurationPK")
            }

            column(name: "version", type: "java.sql.Types.BIGINT") {
                constraints(nullable: "false")
            }

            column(name: "created_by_id", type: '${owf.personIdType}')

            column(name: "created_date", type: "java.sql.Types.DATE")

            column(name: "edited_by_id", type: '${owf.personIdType}')

            column(name: "edited_date", type: "java.sql.Types.DATE")

            column(name: "code", type: "java.sql.Types.VARCHAR(250)") {
                constraints(nullable: "false", unique: "true")
            }

            column(name: "VALUE", type: "java.sql.Types.VARCHAR(2000)") {
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

            column(name: "help", type: "java.sql.Types.VARCHAR(2000)")

        }
    }

    changeSet(author: "owf", id: "7.3.0-4", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
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

    changeSet(author: "owf", id: "7.3.0-5", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
        comment("Add icon image url to dashboard")
        addColumn(tableName: "dashboard") {
            column(name: "icon_image_url", type: "varchar(2083)")
        }
    }

    changeSet(author: "owf", id: "7.3.0-6", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
        comment("Add published_to_store and marked_for_deletion columns to dashboard table")
        addColumn(tableName: "dashboard") {
            column(name: "published_to_store", type: "java.sql.Types.BOOLEAN") {
                constraints(nullable: "true")
            }
            column(name: "marked_for_deletion", type: "java.sql.Types.BOOLEAN") {
                constraints(nullable: "true")
            }
        }
    }

    changeSet(author: "owf", id: "7.3.0-7", context: "create, upgrade, 7.3.0", dbms: "mssql") {
        comment("Create widget_def_intent table")

        addColumn(tableName: "stack") {
          column(name: "owner_id", type: "numeric(19,0)")
        }

        createIndex(indexName: "FK68AC2888656347D", tableName: "stack") {
            column(name: "owner_id")
        }

        addForeignKeyConstraint(baseColumnNames: "owner_id", baseTableName: "stack", constraintName: "FK68AC2888656347D", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
    }

    changeSet(author: "owf", id: "7.3.0-7", context: "create, upgrade, 7.3.0", dbms: "mysql,oracle,postgresql,hsqldb") {
        addColumn(tableName: "stack") {
            column(name: "owner_id", type: "bigint")
        }

        createIndex(indexName: "FK68AC2888656347D", tableName: "stack") {
            column(name: "owner_id")
        }

        addForeignKeyConstraint(baseColumnNames: "owner_id", baseTableName: "stack", constraintName: "FK68AC2888656347D", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
    }

    changeSet(author: "owf", id: "7.3.0-8", context: "upgrade, 7.3.0, sampleData, 7.3.0-sampleData") {

        comment("Change the name of Stack and Widget admin widgets to be Apps and App Component")

        update(tableName: "widget_definition") {
            column(name: "display_name", value: "App Components")
            where("display_name='Widgets'")
        }

        update(tableName: "widget_definition") {
            column(name: "display_name", value: "App Component Editor")
            where("display_name='Widget Editor'")
        }

        update(tableName: "widget_definition") {
            column(name: "display_name", value: "Apps")
            where("display_name='Stacks'")
        }

        update(tableName: "widget_definition") {
            column(name: "display_name", value: "App Editor")
            where("display_name='Stack Editor'")
        }
    }

    changeSet(author: "owf", id: "7.3.0-9", context: "upgrade, 7.3.0, sampleData, 7.3.0-sampleData") {

        comment("Removing all references to Group Dashboards and renaming the Stack and Stack Editor widgets in the Admin dashboard")

        delete(tableName: "widget_definition_widget_types") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp')")
        }

        delete(tableName: "domain_mapping") {
            where("dest_id = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp')")
        }

        delete(tableName: "person_widget_definition") {
            where("widget_definition_id = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp')")
        }

        delete(tableName: "tag_links") {
            where("tag_ref = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp')")
        }

        delete(tableName: "widget_definition") {
            where("widget_url = 'admin/GroupDashboardManagement.gsp'")
        }

    }

    String commonTriggerClause = """
            for each row
            when (new.id is null)
            begin
            select hibernate_sequence.nextval into :new.id from dual;
            end;
            /
    """

    List<String> triggerTables = ["dashboard", "domain_mapping", "stack", "owf_group", "widget_definition"]

    String triggerSQL = triggerTables.collect{table ->
        "create or replace trigger ${table}_insert before insert on ${table} ${commonTriggerClause}"
    }.join('\n')

    changeSet(author: "owf", id: "app_config-7.3.0-10", dbms: "oracle", context: "create, upgrade, 7.3.0") {
        comment("Trigger for Oracle database to handle primary key generation based on a sequence during insert statements")
        sql(endDelimiter: "", splitStatements: false, sql: triggerSQL)
    }

    changeSet(author: "owf", id: "app_config-7.3.0-10.1", dbms: "oracle", context: "sampleData, 7.3.0-sampleData") {
        comment("Trigger for Oracle database to handle primary key generation based on a sequence during sample data inserts")
        sql(endDelimiter: "", splitStatements: false, sql: triggerSQL)
    }

    changeSet(author: "owf", id: "app_config-7.3.0-10.2", dbms: "oracle", context: "create, upgrate, 7.3.0") {
        comment("Trigger for Oracle database to handle primary key generation based on a sequence during sample data inserts")
        sql(endDelimiter: "", splitStatements: false, sql:"""
            create or replace trigger stack_groups_insert before insert on stack_groups
            for each row
            when (new.group_id is null)
            begin
            select hibernate_sequence.nextval into :new.group_id from dual;
            end;
            /
        """
        )
    }

    changeSet(author: "owf", id: "7.3.0-11", context: "sampleData, 7.3.0-sampleData") {

        comment("Migrating the legacy sample dashboards to the new format")

        insert(tableName: "owf_group") {
            column(name: "version", valueNumeric: "0")
            column(name: "automatic", valueBoolean: "false")
            column(name: "description", value: "")
            column(name: "email", value: null)
            column(name: "name", value: "df51cb9b-f3d8-412e-af33-d064f81fb6c0")
            column(name: "status", value: "active")
            column(name: "display_name", value: null)
            column(name: "stack_default", valueBoolean: true)
        }

        // As of 7.4 this is done in creation scripts.
        // insert(tableName: "owf_group") {
        //     column(name: "version", valueNumeric: "0")
        //     column(name: "automatic", valueBoolean: "false")
        //     column(name: "description", value: "")
        //     column(name: "email", value: null)
        //     column(name: "name", value: "3b870e3b-247f-47db-bcd8-8fab6877bbc8")
        //     column(name: "status", value: "active")
        //     column(name: "display_name", value: null)
        //     column(name: "stack_default", valueBoolean: true)
        // }

        insert(tableName: "stack") {
            column(name: "version", valueNumeric: "0")
            column(name: "name", value: "Sample")
            column(name: "description", value: null)
            column(name: "stack_context", value: "908d934d-9d53-406c-8143-90b406fb508f")
            column(name: "image_url", value: null)
            column(name: "descriptor_url", value: null)
            column(name: "unique_widget_count", value: 0)
            column(name: "owner_id", value: null)
        }

        // As of 7.4 this is done in creation scripts.
        // insert(tableName: "stack") {
        //     column(name: "version", valueNumeric: "0")
        //     column(name: "name", value: "Administration")
        //     column(name: "description", value: "This dashboard provides the widgets needed to administer dashboards, widgets, groups, and users in OWF.")
        //     column(name: "stack_context", value: "0092af0b-57ae-4fd9-bd8a-ec0937ac5399")
        //     column(name: "image_url", value: null)
        //     column(name: "descriptor_url", value: null)
        //     column(name: "unique_widget_count", value: 0)
        //     column(name: "owner_id", value: null)
        // }

        insert(tableName: "stack_groups") {
            column(name: "group_id", valueComputed: "(SELECT id FROM owf_group WHERE name='df51cb9b-f3d8-412e-af33-d064f81fb6c0')")
            column(name: "stack_id", valueComputed: "(SELECT id FROM stack WHERE stack_context='908d934d-9d53-406c-8143-90b406fb508f')")
        }

        // As of 7.4 this is done in creation scripts.
        // insert(tableName: "stack_groups") {
        //     column(name: "group_id", valueComputed: "(SELECT id FROM owf_group WHERE name='3b870e3b-247f-47db-bcd8-8fab6877bbc8')")
        //     column(name: "stack_id", valueComputed: "(SELECT id FROM stack WHERE stack_context='0092af0b-57ae-4fd9-bd8a-ec0937ac5399')")
        // }

        update(tableName: "dashboard") {
            column(name: "version", valueNumeric: "1")
            column(name: "published_to_store", valueBoolean: "true")
            where("guid='3f59855b-d93e-dc03-c6ba-f4c33ea0177f' AND user_id IS NULL AND name='Watch List'")
        }

        update(tableName: "dashboard") {
            column(name: "version", valueNumeric: "1")
            column(name: "stack_id", valueComputed: "(SELECT id FROM stack WHERE stack_context='908d934d-9d53-406c-8143-90b406fb508f')")
            column(name: "published_to_store", valueBoolean: "true")
            where("guid='c62ce95c-d16d-4ffe-afae-c46fa64a689b' AND user_id IS NULL AND name='Sample'")
        }

        update(tableName: "dashboard") {
            column(name: "version", valueNumeric: "1")
            column(name: "stack_id", valueComputed: "(SELECT id FROM stack WHERE stack_context='0092af0b-57ae-4fd9-bd8a-ec0937ac5399')")
            column(name: "published_to_store", valueBoolean: "true")
            where("guid='54949b5d-f0ee-4347-811e-2522a1bf96fe' AND user_id IS NULL AND name='Administration'")
        }

        update(tableName: "dashboard") {
            column(name: "version", valueNumeric: "1")
            column(name: "published_to_store", valueBoolean: "true")
            where("guid='7f2f6d45-263a-7aeb-d841-3637678ce559' AND user_id IS NULL AND name='Contacts'")
        }
    }

    changeSet(author: "owf", id: "7.3.0-12", context: "sampleData, 7.3.0-sampleData") {

        comment("Adding in the domain mapping changes that need to be made for the group dashboards in the sample data")

        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "dest_id", valueComputed: "(SELECT id FROM dashboard WHERE guid='c62ce95c-d16d-4ffe-afae-c46fa64a689b' AND user_id IS NULL AND name='Sample')")
            column(name: "dest_type", value: "dashboard")
            column(name: "relationship_type", value: "owns")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='df51cb9b-f3d8-412e-af33-d064f81fb6c0')")
            column(name: "src_type", value: "group")
        }

        // As of 7.4 this is done in creation scripts.
        // insert(tableName: "domain_mapping") {
        //     column(name: "version", valueNumeric: "0")
        //     column(name: "dest_id", valueComputed: "(SELECT id FROM dashboard WHERE guid='54949b5d-f0ee-4347-811e-2522a1bf96fe' AND user_id IS NULL AND name='Administration')")
        //     column(name: "dest_type", value: "dashboard")
        //     column(name: "relationship_type", value: "owns")
        //     column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='3b870e3b-247f-47db-bcd8-8fab6877bbc8')")
        //     column(name: "src_type", value: "group")
        // }
    }

    // OP-2157: Sample data still references "dashboards" and "stacks"
    changeSet(author: "owf", id: "7.3.0-13", context: "sampleData, 7.3.0-sampleData") {

        comment("Updating verbiage in the sample data; changing the word widget to app component; changing the word stack to app; changing the word dashboard to page")

        //------------------------------
        // Update sample app components
        //------------------------------

        // Change "Widget Log" to "Load Time Log"
        update(tableName: "widget_definition") {
            column(name: "display_name", value: "Load Time Log")
            where("display_name = 'Widget Log'")
        }

        // Change "NYSE Widget" to "NYSE App Component"
        // Change "This widget displays the end of day report for the New York Stock Exchange."
        //     to "This app component displays the end of day report for the New York Stock Exchange."
        update(tableName: "widget_definition") {
            column(name: "display_name", value: "NYSE App Component")
            column(name: "description", value: "This app component displays the end of day report for the New York Stock Exchange.")
            where("universal_name = 'org.owfgoss.owf.examples.NYSE'")
        }

        // In "HTML Viewer", change "This widget displays HTML."
        //                       to "This app component displays HTML."
        update(tableName: "widget_definition") {
            column(name: "description", value: "This app component displays HTML.")
            where("universal_name = 'org.owfgoss.owf.examples.HTMLViewer'")
        }

        // In "Stock Chart", change "This widget charts stock prices."
        //                       to "This app component charts stock prices."
        update(tableName: "widget_definition") {
            column(name: "description", value: "This app component charts stock prices.")
            where("universal_name = 'org.owfgoss.owf.examples.StockChart'")
        }

        // In "Directions", change "This widget allows user to get directions fron one place to another."
        //                      to "This app component maps directions."
        update(tableName: "widget_definition") {
            column(name: "description", value: "This app component maps directions.")
            where("universal_name = 'org.owfgoss.owf.examples.GetDirections'")
        }

        // In "Google Maps", change "This widget displays markers or directions."
        //                       to "This app component displays markers or directions."
        update(tableName: "widget_definition") {
            column(name: "description", value: "This app component displays markers or directions.")
            where("universal_name = 'org.owfgoss.owf.examples.GoogleMaps'")
        }

        // In "Contacts Manager", change "This widget allows users to manage their contacts."
        //                            to "This app component allows users to manage their contacts."
        update(tableName: "widget_definition") {
            column(name: "description", value: "This app component allows users to manage their contacts.")
            where("universal_name = 'org.owfgoss.owf.examples.ContactsManager'")
        }

        //--------------------
        // Update sample apps
        //--------------------

        // In "Investments", change "Sample stack containing dashboards with example investment widgets."
        //                       to "Sample app containing example investment pages."
        update(tableName: "stack") {
            column(name: "description", value: "Sample app containing example investment pages.")
            where("name = 'Investments'")
        }

        // As of 7.4 this is done in creation scripts.
        // In "Administration", change "This dashboard provides the widgets needed to administer dashboards, widgets, groups, and users in OWF."
        //                          to "This app lists administrative pages."
        // update(tableName: "stack") {
        //     column(name: "description", value: "This app lists administrative pages.")
        //     where("name = 'Administration'")
        // }

        //---------------------
        // Update sample pages
        //---------------------

        // In "Watch List", change "This dashboard uses the sample Intents Widgets to demonstrate the widget intents workflow."
        //                      to "This page demonstrates how intents work using company stock information."
        update(tableName: "dashboard") {
            column(name: "description", value: "This page demonstrates how intents work using company stock information.")
            where("name = 'Watch List'")
        }

        // In "Contacts", change "This dashboard uses the Contacts Manager, Direction and Google Maps widgets."
        //                    to "This page demonstrates how intents work by sending addresses to a map."
        update(tableName: "dashboard") {
            column(name: "description", value: "This page demonstrates how intents work by sending addresses to a map.")
            where("name = 'Contacts'")
        }

        // In "Administration", change "This dashboard provides the widgets needed to administer dashboards, widgets, groups, and users in OWF."
        //                          to "This page provides the tools needed to administer apps, app component, groups and users."
        update(tableName: "dashboard") {
            column(name: "description", value: "This page provides the tools needed to administer apps, app component, groups and users.")
            where("name = 'Administration'")
        }

    }

    changeSet(author: "owf", id: "7.3.0-14", context: "sampleData, 7.3.0-sampleData") {

        comment("Updating the unique widget count for sample and admin apps that we ship with.")

        // Sample app
        update(tableName: "stack") {
            column(name: "unique_widget_count", value: 2)
            where("stack_context='908d934d-9d53-406c-8143-90b406fb508f'")
        }

        // As of 7.4 this is done in creation scripts.
        // Administration app
        // update(tableName: "stack") {
        //     column(name: "unique_widget_count", value: 5)
        //     where("stack_context='0092af0b-57ae-4fd9-bd8a-ec0937ac5399'")
        // }
    }

    changeSet(author: "owf", id: "7.3.0-15", context: "sampleData, 7.3.0-sampleData") {

        comment("Associate sample app with owf users group and administration app with owf admin group. Disassociate the corresponding group dashboards from their groups.")

        // sample
        insert(tableName: "stack_groups") {
            column(name: "group_id", valueComputed: "(SELECT id FROM owf_group WHERE name='OWF Users')")
            column(name: "stack_id", valueComputed: "(SELECT id FROM stack WHERE stack_context='908d934d-9d53-406c-8143-90b406fb508f')")
        }

        // As of 7.4 this is done in creation scripts.
        // admin
        // insert(tableName: "stack_groups") {
        //     column(name: "group_id", valueComputed: "(SELECT id FROM owf_group WHERE name='OWF Administrators')")
        //     column(name: "stack_id", valueComputed: "(SELECT id FROM stack WHERE stack_context='0092af0b-57ae-4fd9-bd8a-ec0937ac5399')")
        // }

        delete(tableName: "domain_mapping") {
            where("src_type = 'group' AND relationship_type = 'owns' AND dest_type = 'dashboard' AND src_id = (select id from owf_group where name  = 'OWF Users') AND dest_id = (select id from dashboard where name = 'Sample')")
        }

        // As of 7.4 this is done in creation scripts.
        // delete(tableName: "domain_mapping") {
        //     where("src_type = 'group' AND relationship_type = 'owns' AND dest_type = 'dashboard' AND src_id = (select id from owf_group where name  = 'OWF Administrators') AND dest_id = (select id from dashboard where name = 'Administration')")
        // }
    }

    //OP-2330: Type of App Component still listed as Marketplace
    changeSet(author: "owf", id: "7.3.0-16", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {

        comment("Adding a column named display_name to the table widget_type so that the UI name is decoupled from the actual back-end name; The display_name will be the same as the name, except for marketplace, which will be displayed as store")

        // Add a column named display_name to the table widget_type
        // TYPE: VARCHAR(256)
        addColumn(tableName: "widget_type") {
            column(name: "display_name", type: "VARCHAR(256)")
        }

        // Fill the display_name column with the data from the name column, expect for "marketplace"
        update(tableName: "widget_type") {
            column(name: "display_name", valueComputed: "name")
            where("name != 'marketplace'")
        }

        // Display "marketplace" as "store"
        update(tableName: "widget_type") {
            column(name: "display_name", value: "store")
            where("name = 'marketplace'")
        }

        // Make sure the display_name column is never NULL
        // TYPE: VARCHAR(256)
        addNotNullConstraint(tableName: "widget_type", columnName: "display_name", columnDataType: "VARCHAR(256)")

    }

    changeSet(author: "owf", id: "7.3.0-17", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, 7.3.0, upgrade") {
        addDefaultValue(tableName: "application_configuration", columnName: "version", defaultValueNumeric: 0)
    }

    include file: "app_config_7.3.0.groovy"

    changeSet(author: "owf", id: "7.3.0-18", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
        comment("Add isApproved to stack")
        addColumn(tableName: "stack") {
            column(name: "approved", type: "java.sql.Types.BOOLEAN") {
                constraints(nullable: "true")
            }
        }
    }

    changeSet(author: "owf", id: "7.3.0-19", context: "sampleData, 7.3.0-sampleData") {
        comment("Add isApproved to stack")
        update(tableName: "stack") {
            column(name: "approved", valueBoolean: true)
            where("name = 'Investments' OR name = 'Administration' OR name = 'Sample'")
        }
    }

    // Create an admin group at creation time.  Upgrades are expected to have this group already.
    changeSet(author: "owf", id: "7.3.0-20", dbms:"hsqldb,mysql,oracle,postgresql", context: "create") {
        comment(text="Create an OWF Admin group.")
        //insert admin group
        insert(tableName: "owf_group") {
            column(name: "version", valueNumeric: "0")
            column(name: "status", value: "active")
            column(name: "description", value: "OWF Administrators")
            column(name: "name", value: "OWF Administrators")
            column(name: "status", value: "active")
            column(name: "display_name", value: "OWF Administrators")
            column(name: "automatic", valueBoolean: "true")
            column(name: "stack_default", valueBoolean: false)
        }
    }

    changeSet(author: "owf", id: "7.3.0-21", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
        comment(text="Create Administrator's App and its default group.")

        insert(tableName: "stack") {
            column(name: "version", valueNumeric: "1")
            column(name: "name", value: "Administration")
            column(name: "description", value: "This application collects the administrative components into a common set of application pages for managing system resources.  These pages can be used to create, modify, update, and delete Apps, App Components, Users and Groups, and system configuration settings.")
            column(name: "stack_context", value: "ef8b5d6f-4b16-4743-9a57-31683c94b616")
            column(name: "image_url", value: "themes/common/images/admin/64x64_admin_app.png")
            column(name: "approved", valueBoolean: "true")
            column(name: "unique_widget_count", valueNumeric: "5")
        }

        insert(tableName: "owf_group") {
            column(name: "version", valueNumeric: "0")
            column(name: "automatic", valueBoolean: "false")
            column(name: "description", value: "")
            column(name: "email", value: null)
            column(name: "name", value: "9e05a814-c1a4-4db1-a672-bccae0f0b311")
            column(name: "status", value: "active")
            column(name: "display_name", value: null)
            column(name: "stack_default", valueBoolean: true)
        }

        insert(tableName: "stack_groups") {
            column(name: "group_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "stack_id", valueComputed: "(SELECT id FROM stack WHERE stack_context='ef8b5d6f-4b16-4743-9a57-31683c94b616')")
        }
    }

    changeSet(author: "owf", id: "7.3.0-22", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
        comment(text="Add Administration App to the OWF Administrators group.")

        insert(tableName: "stack_groups") {
            column(name: "group_id", valueComputed: "(SELECT id FROM owf_group WHERE name='OWF Administrators')")
            column(name: "stack_id", valueComputed: "(SELECT id FROM stack WHERE stack_context='ef8b5d6f-4b16-4743-9a57-31683c94b616')")
        }

    }

    changeSet(author: "owf", id: "7.3.0-23", context: "create", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_definition] ON
      """)
    }

    changeSet(author: "owf", id: "7.3.0-24", dbms:"hsqldb,mysql,oracle,postgresql", context: "create") {
        comment(text="Add new admin components that include universal names.  These will be the primary admin components moving forward.")

        // Insert the app component admin components.
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "186")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.appcomponentedit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Widgets64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Widgets24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/WidgetEdit.gsp")
            column(name: "widget_guid", value: "679294b3-ccc3-4ace-a061-e3f27ed86451")
            column(name: "display_name", value: "App Component Editor")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "187")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.appcomponentmanagement")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Widgets64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Widgets24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "818")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/WidgetManagement.gsp")
            column(name: "widget_guid", value: "48edfe94-4291-4991-a648-c19a903a663b")
            column(name: "display_name", value: "App Components")
            column(name: "background", valueBoolean: "false")
        }

        // Insert the group components.
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "188")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.groupedit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Groups64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Groups24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/GroupEdit.gsp")
            column(name: "widget_guid", value: "dc5c2062-aaa8-452b-897f-60b4b55ab564")
            column(name: "display_name", value: "Group Editor")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "189")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.groupmanagement")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Groups64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Groups24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "818")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/GroupManagement.gsp")
            column(name: "widget_guid", value: "53a2a879-442c-4012-9215-a17604dedff7")
            column(name: "display_name", value: "Groups")
            column(name: "background", valueBoolean: "false")
        }

        // Insert the users components.
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "190")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.useredit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Users64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Users24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/UserEdit.gsp")
            column(name: "widget_guid", value: "a9bf8e71-692d-44e3-a465-5337ce5e725e")
            column(name: "display_name", value: "User Editor")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "191")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.usermanagement")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Users64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Users24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "818")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/UserManagement.gsp")
            column(name: "widget_guid", value: "38070c45-5f6a-4460-810c-6e3496495ec4")
            column(name: "display_name", value: "Users")
            column(name: "background", valueBoolean: "false")
        }

        // Insert the configuation components.
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "192")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.configuration")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Configuration64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Configuration24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "900")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/Configuration.gsp")
            column(name: "widget_guid", value: "af180bfc-3924-4111-93de-ad6e9bfc060e")
            column(name: "display_name", value: "Configuration")
            column(name: "background", valueBoolean: "false")
        }

        // Insert the apps components.
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "193")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.appedit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Stacks64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Stacks24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/StackEdit.gsp")
            column(name: "widget_guid", value: "72c382a3-89e7-4abf-94db-18db7779e1df")
            column(name: "display_name", value: "App Editor")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "194")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.appmanagement")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Stacks64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Stacks24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "818")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/StackManagement.gsp")
            column(name: "widget_guid", value: "391dd2af-a207-41a3-8e51-2b20ec3e7241")
            column(name: "display_name", value: "Apps")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "195")
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.pageedit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Dashboards64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Dashboards24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/DashboardEdit.gsp")
            column(name: "widget_guid", value: "2445afb9-eb3f-4b79-acf8-6b12180921c3")
            column(name: "display_name", value: "Page Editor")
            column(name: "background", valueBoolean: "false")
        }

        // Map these to admin component types.
        sql ( text = """
            insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
            select id, 2 from widget_definition
            where widget_guid in (
                '72c382a3-89e7-4abf-94db-18db7779e1df',
                '391dd2af-a207-41a3-8e51-2b20ec3e7241',
                '679294b3-ccc3-4ace-a061-e3f27ed86451',
                '48edfe94-4291-4991-a648-c19a903a663b',
                'af180bfc-3924-4111-93de-ad6e9bfc060e',
                'dc5c2062-aaa8-452b-897f-60b4b55ab564',
                '53a2a879-442c-4012-9215-a17604dedff7',
                'a9bf8e71-692d-44e3-a465-5337ce5e725e',
                '38070c45-5f6a-4460-810c-6e3496495ec4',
                '2445afb9-eb3f-4b79-acf8-6b12180921c3'
            )
            """ )
    }

    changeSet(author: "owf", id: "7.3.0-25", context: "create", dbms:"mssql") {
        comment(text="allow identity inserts")
        sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_definition] OFF
        """)
    }

    // On upgrades, allow the
    changeSet(author: "owf", id: "7.3.0-26", dbms:"hsqldb,mysql,oracle,postgresql", context: "upgrade, 7.3.0") {
        comment(text="Add new admin components that include universal names.  These will be the primary admin components moving forward.")

        // Insert the app component admin components.
        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.appcomponentedit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Widgets64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Widgets24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/WidgetEdit.gsp")
            column(name: "widget_guid", value: "679294b3-ccc3-4ace-a061-e3f27ed86451")
            column(name: "display_name", value: "App Component Editor")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.appcomponentmanagement")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Widgets64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Widgets24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "818")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/WidgetManagement.gsp")
            column(name: "widget_guid", value: "48edfe94-4291-4991-a648-c19a903a663b")
            column(name: "display_name", value: "App Components")
            column(name: "background", valueBoolean: "false")
        }

        // Insert the group components.
        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.groupedit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Groups64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Groups24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/GroupEdit.gsp")
            column(name: "widget_guid", value: "dc5c2062-aaa8-452b-897f-60b4b55ab564")
            column(name: "display_name", value: "Group Editor")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.groupmanagement")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Groups64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Groups24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "818")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/GroupManagement.gsp")
            column(name: "widget_guid", value: "53a2a879-442c-4012-9215-a17604dedff7")
            column(name: "display_name", value: "Groups")
            column(name: "background", valueBoolean: "false")
        }

        // Insert the users components.
        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.useredit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Users64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Users24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/UserEdit.gsp")
            column(name: "widget_guid", value: "a9bf8e71-692d-44e3-a465-5337ce5e725e")
            column(name: "display_name", value: "User Editor")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.usermanagement")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Users64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Users24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "818")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/UserManagement.gsp")
            column(name: "widget_guid", value: "38070c45-5f6a-4460-810c-6e3496495ec4")
            column(name: "display_name", value: "Users")
            column(name: "background", valueBoolean: "false")
        }

        // Insert the configuation components.
        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.configuration")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Configuration64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Configuration24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "900")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/Configuration.gsp")
            column(name: "widget_guid", value: "af180bfc-3924-4111-93de-ad6e9bfc060e")
            column(name: "display_name", value: "Configuration")
            column(name: "background", valueBoolean: "false")
        }

        // Insert the apps components.
        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.appedit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Stacks64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Stacks24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/StackEdit.gsp")
            column(name: "widget_guid", value: "72c382a3-89e7-4abf-94db-18db7779e1df")
            column(name: "display_name", value: "App Editor")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.appmanagement")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Stacks64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Stacks24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "818")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/StackManagement.gsp")
            column(name: "widget_guid", value: "391dd2af-a207-41a3-8e51-2b20ec3e7241")
            column(name: "display_name", value: "Apps")
            column(name: "background", valueBoolean: "false")
        }

        insert(tableName: "widget_definition") {
            column(name: "universal_name", value: "org.ozoneplatform.owf.admin.pageedit")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "false")
            column(name: "image_url_large", value: "themes/common/images/adm-tools/Dashboards64.png")
            column(name: "image_url_small", value: "themes/common/images/adm-tools/Dashboards24.png")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "581")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "440")
            column(name: "widget_url", value: "admin/DashboardEdit.gsp")
            column(name: "widget_guid", value: "2445afb9-eb3f-4b79-acf8-6b12180921c3")
            column(name: "display_name", value: "Page Editor")
            column(name: "background", valueBoolean: "false")
        }

        // Map these to admin component types.
        sql ( text = """
            insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
            select id, 2 from widget_definition
            where widget_guid in (
                '72c382a3-89e7-4abf-94db-18db7779e1df',
                '391dd2af-a207-41a3-8e51-2b20ec3e7241',
                '679294b3-ccc3-4ace-a061-e3f27ed86451',
                '48edfe94-4291-4991-a648-c19a903a663b',
                'af180bfc-3924-4111-93de-ad6e9bfc060e',
                'dc5c2062-aaa8-452b-897f-60b4b55ab564',
                '53a2a879-442c-4012-9215-a17604dedff7',
                'a9bf8e71-692d-44e3-a465-5337ce5e725e',
                '38070c45-5f6a-4460-810c-6e3496495ec4',
                '2445afb9-eb3f-4b79-acf8-6b12180921c3'
            )
            """ )
    }

    changeSet(author: "owf", id: "7.3.0-27", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
        comment(text="Add the pages for the administrator's app.")
        insert(tableName: "dashboard") {
            // column(name: "id", valueNumeric: "322")
            column(name: "version", valueNumeric: "0")
            column(name: "isdefault", valueBoolean: "false")
            column(name: "dashboard_position", valueNumeric: "1")
            column(name: "altered_by_admin", valueBoolean: "false")
            column(name: "published_to_store", valueBoolean: "true")
            column(name: "locked", valueBoolean: "false")
            column(name: "type", value: "")
            column(name: "marked_for_deletion", valueBoolean: "false")
            column(name: "guid", value: "cbb92835-7d13-41dc-8f28-3eba59a6a6d5")
            column(name: "name", value: "Apps")
            column(name: "icon_image_url", value: "themes/common/images/adm-tools/Stacks64.png")
            column(name: "description", value: "Administer the Apps in the system.")
            column(name: "layout_config", value: """{"widgets":[{"universalName":"org.ozoneplatform.owf.admin.appmanagement","widgetGuid":"391dd2af-a207-41a3-8e51-2b20ec3e7241","uniqueId":"bf05736e-a52e-d4ee-7da5-4e39c6df53c8","dashboardGuid":"cbb92835-7d13-41dc-8f28-3eba59a6a6d5","paneGuid":"6ff1c292-9689-4240-7cd8-e4a251978395","intentConfig":null,"launchData":null,"name":"Apps","active":true,"x":0,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":1554}],"height":"100%","items":[],"xtype":"fitpane","flex":1,"paneType":"fitpane","defaultSettings":{}}""")
        }
        // Associate this with the app.
        sql( text = """
            update dashboard set stack_id = (select id from stack where stack_context = 'ef8b5d6f-4b16-4743-9a57-31683c94b616') where guid = 'cbb92835-7d13-41dc-8f28-3eba59a6a6d5';
        """)

        insert(tableName: "dashboard") {
            // column(name: "id", valueNumeric: "322")
            column(name: "version", valueNumeric: "0")
            column(name: "isdefault", valueBoolean: "false")
            column(name: "dashboard_position", valueNumeric: "2")
            column(name: "altered_by_admin", valueBoolean: "false")
            column(name: "published_to_store", valueBoolean: "true")
            column(name: "locked", valueBoolean: "false")
            column(name: "type", value: "")
            column(name: "marked_for_deletion", valueBoolean: "false")
            column(name: "guid", value: "2fc20999-01a6-4275-83f4-f7c68d03d938")
            column(name: "name", value: "App Components")
            column(name: "icon_image_url", value: "themes/common/images/adm-tools/Widgets64.png")
            column(name: "description", value: "Administer the App Components in the system.")
            column(name: "layout_config", value: """{"widgets":[{"universalName":"org.ozoneplatform.owf.admin.appcomponentmanagement","widgetGuid":"48edfe94-4291-4991-a648-c19a903a663b","uniqueId":"fa442c1d-d23e-51a9-3be8-39b203c7d95d","dashboardGuid":"2fc20999-01a6-4275-83f4-f7c68d03d938","paneGuid":"49762ea2-42cc-9e76-b6be-c60bd7ae9c03","intentConfig":null,"launchData":null,"name":"App Components","active":false,"x":0,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":1554}],"height":"100%","items":[],"xtype":"fitpane","flex":1,"paneType":"fitpane","defaultSettings":{}}""")
        }
        // Associate this with the app.
        sql( text = """
            update dashboard set stack_id = (select id from stack where stack_context = 'ef8b5d6f-4b16-4743-9a57-31683c94b616') where guid = '2fc20999-01a6-4275-83f4-f7c68d03d938';
        """)

        insert(tableName: "dashboard") {
            // column(name: "id", valueNumeric: "322")
            column(name: "version", valueNumeric: "0")
            column(name: "isdefault", valueBoolean: "false")
            column(name: "dashboard_position", valueNumeric: "3")
            column(name: "altered_by_admin", valueBoolean: "false")
            column(name: "published_to_store", valueBoolean: "true")
            column(name: "locked", valueBoolean: "false")
            column(name: "type", value: "")
            column(name: "marked_for_deletion", valueBoolean: "false")
            column(name: "guid", value: "94bf7ed8-bed9-45ad-933b-4d85584cb483")
            column(name: "name", value: "Users and Groups")
            column(name: "icon_image_url", value: "themes/common/images/adm-tools/Groups64.png")
            column(name: "description", value: "Administer the Users and Groups in the system.")
            column(name: "layout_config", value: """{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"universalName":"org.ozoneplatform.owf.admin.usermanagement","widgetGuid":"38070c45-5f6a-4460-810c-6e3496495ec4","uniqueId":"53783596-8233-9e34-4f91-72e92328785d","dashboardGuid":"94bf7ed8-bed9-45ad-933b-4d85584cb483","paneGuid":"7f3657f1-b391-4ab5-f6be-e4393ea5d72d","intentConfig":null,"launchData":null,"name":"Users","active":true,"x":0,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":775}],"paneType":"fitpane","defaultSettings":{"widgetStates":{"101f119e-b56a-4e16-8219-11048c020038":{"x":94,"y":199,"height":440,"width":581,"timestamp":1377274970150}}}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"universalName":"org.ozoneplatform.owf.admin.groupmanagement","widgetGuid":"53a2a879-442c-4012-9215-a17604dedff7","uniqueId":"3e0647e3-62b4-cd08-6d6b-9ece1670b10e","dashboardGuid":"94bf7ed8-bed9-45ad-933b-4d85584cb483","paneGuid":"e9746a83-a610-6b01-43c4-d543278729b4","intentConfig":null,"launchData":null,"name":"Groups","active":true,"x":779,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":775}],"defaultSettings":{"widgetStates":{"d6ce3375-6e89-45ab-a7be-b6cf3abb0e8c":{"x":0,"y":0,"height":440,"width":581,"timestamp":1377274968504}}}}],"flex":1}""")
        }
        // Associate this with the app.
        sql( text = """
            update dashboard set stack_id = (select id from stack where stack_context = 'ef8b5d6f-4b16-4743-9a57-31683c94b616') where guid = '94bf7ed8-bed9-45ad-933b-4d85584cb483';
        """)

        insert(tableName: "dashboard") {
            // column(name: "id", valueNumeric: "322")
            column(name: "version", valueNumeric: "0")
            column(name: "isdefault", valueBoolean: "false")
            column(name: "dashboard_position", valueNumeric: "4")
            column(name: "altered_by_admin", valueBoolean: "false")
            column(name: "published_to_store", valueBoolean: "true")
            column(name: "locked", valueBoolean: "false")
            column(name: "type", value: "")
            column(name: "marked_for_deletion", valueBoolean: "false")
            column(name: "guid", value: "976cbf75-5537-410f-88a3-375c5cf970bc")
            column(name: "name", value: "Configuration")
            column(name: "icon_image_url", value: "themes/common/images/adm-tools/Configuration64.png")
            column(name: "description", value: "Administer the system configuration.")
            column(name: "layout_config", value: """{"widgets":[{"universalName":"org.ozoneplatform.owf.admin.configuration","widgetGuid":"af180bfc-3924-4111-93de-ad6e9bfc060e","uniqueId":"8e7d717c-cece-3d18-c060-c3946d5e7f55","dashboardGuid":"976cbf75-5537-410f-88a3-375c5cf970bc","paneGuid":"7cd8017a-f948-7728-0e20-5b5c2182a432","intentConfig":null,"launchData":null,"name":"Configuration","active":false,"x":0,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":1554}],"height":"100%","items":[],"xtype":"fitpane","flex":1,"paneType":"fitpane","defaultSettings":{}}""")
        }
        // Associate this with the app.
        sql( text = """
            update dashboard set stack_id = (select id from stack where stack_context = 'ef8b5d6f-4b16-4743-9a57-31683c94b616') where guid = '976cbf75-5537-410f-88a3-375c5cf970bc';
        """)

    }

    changeSet(author: "owf", id: "7.3.0-28", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
        comment(text="Add the associations for the stack's default group to the app pages..")

        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM dashboard WHERE guid='cbb92835-7d13-41dc-8f28-3eba59a6a6d5')")
            column(name: "dest_type", value: "dashboard")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM dashboard WHERE guid='2fc20999-01a6-4275-83f4-f7c68d03d938')")
            column(name: "dest_type", value: "dashboard")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM dashboard WHERE guid='94bf7ed8-bed9-45ad-933b-4d85584cb483')")
            column(name: "dest_type", value: "dashboard")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM dashboard WHERE guid='976cbf75-5537-410f-88a3-375c5cf970bc')")
            column(name: "dest_type", value: "dashboard")
        }
    }

    changeSet(author: "owf", id: "7.3.0-29", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 7.3.0") {
        comment(text="Add the associations for the stack's default group to the admin components.")
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM widget_definition WHERE widget_guid='72c382a3-89e7-4abf-94db-18db7779e1df')")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM widget_definition WHERE widget_guid='391dd2af-a207-41a3-8e51-2b20ec3e7241')")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM widget_definition WHERE widget_guid='679294b3-ccc3-4ace-a061-e3f27ed86451')")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM widget_definition WHERE widget_guid='48edfe94-4291-4991-a648-c19a903a663b')")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM widget_definition WHERE widget_guid='af180bfc-3924-4111-93de-ad6e9bfc060e')")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM widget_definition WHERE widget_guid='dc5c2062-aaa8-452b-897f-60b4b55ab564')")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM widget_definition WHERE widget_guid='53a2a879-442c-4012-9215-a17604dedff7')")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM widget_definition WHERE widget_guid='a9bf8e71-692d-44e3-a465-5337ce5e725e')")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueComputed: "(SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311')")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueComputed: "(SELECT id FROM widget_definition WHERE widget_guid='38070c45-5f6a-4460-810c-6e3496495ec4')")
            column(name: "dest_type", value: "widget_definition")
        }
    }

    changeSet(author: "owf", id: "7.3.0-30", context: "sampleData, 7.3.0-sampleData") {

        comment("Remove the old admin dashboard.")

        delete(tableName: "dashboard") {
            where("guid='54949b5d-f0ee-4347-811e-2522a1bf96fe' AND user_id IS NULL AND name='Administration'")
        }

    }

    String adminWidgetUrlList = "'admin/UserManagement.gsp', 'admin/UserEdit.gsp', 'admin/WidgetManagement.gsp', 'admin/WidgetEdit.gsp', 'admin/GroupManagement.gsp', 'admin/GroupEdit.gsp', 'admin/DashboardEdit.gsp', 'admin/StackManagement.gsp', 'admin/StackEdit.gsp', 'admin/Configuration.gsp'"

    changeSet(author: "owf", id: "7.3.0-31", dbms:"hsqldb,mysql,oracle,postgresql", context: "upgrade, 7.3.0") {

        comment("Remove the old admin widgets.")

        delete(tableName: "widget_definition_widget_types") {
            where("widget_definition_id in (select id from widget_definition where widget_url in (${adminWidgetUrlList}) and universal_name is null)")
        }

        delete(tableName: "domain_mapping") {
            where("dest_type='widget_definition' and dest_id in (select id from widget_definition where widget_url in (${adminWidgetUrlList}) and universal_name is null)")
        }

        delete(tableName: "person_widget_definition") {
            where("widget_definition_id in (select id from widget_definition where widget_url in (${adminWidgetUrlList}) and universal_name is null)")
        }

        delete(tableName: "widget_definition") {
            where("widget_url in (${adminWidgetUrlList}) and universal_name is null")
        }
    }

    String deleteTriggerSQL = triggerTables.collect{table ->
        "drop trigger ${table}_insert;\n/"
    }.join('\n')

    changeSet(author: "owf", id: "app_config-7.3.0-32", dbms: "oracle", context: "create, upgrade, 7.3.0") {
        comment("Drop the insert triggers")
        sql(endDelimiter: "", splitStatements: false, sql: deleteTriggerSQL)
    }

    changeSet(author: "owf", id: "app_config-7.3.0-34", dbms: "oracle", context: "create, upgrade, 7.3.0") {
        comment("Drop the trigger")
        sql(endDelimiter: "", splitStatements: false, sql: """
            drop trigger stack_groups_insert;
            /
    """)
    }

    changeSet(author: "owf", id: "app_config-7.3.0-33", dbms: "oracle", context: "sampleData, 7.3.0-sampleData") {
        comment("Drop the sample data insert triggers")
        sql(endDelimiter: "", splitStatements: false, sql: deleteTriggerSQL)
    }
}