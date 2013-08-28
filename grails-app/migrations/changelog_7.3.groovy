databaseChangeLog = {
    changeSet(author: "owf", id: "7.3-1", context: "create, upgrade, 7.3") {
        comment("Add type to dashboard")
        addColumn(tableName: "dashboard") {
            column(name: "type", type: "varchar(255)")
        }
    }

    changeSet(author: "owf", id: "7.3-2", context: "upgrade, 7.3, sampleData, 7.3-sampleData") {
        comment("Update existing dashboards to set type to marketplace if name is Apps Mall")
        update(tableName: "dashboard") {
            column(name: "type", value: 'marketplace')
            where("name='Apps Mall'")
        }
    }
	
		
	changeSet(author: "owf", id: "7.3-3", context: "create, upgrade, 7.3") {
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

	changeSet(author: "owf", id: "7.3-4", context: "create, upgrade, 7.3") {
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

    changeSet(author: "owf", id: "7.3-5", context: "create, upgrade, 7.3") {
        comment("Add icon image url to dashboard")
        addColumn(tableName: "dashboard") {
            column(name: "icon_image_url", type: "varchar(2083)")
        }
    }

    changeSet(author: "owf", id: "7.3-6", context: "create, upgrade, 7.3") {
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

    changeSet(author: "owf", id: "7.3-7", context: "create, upgrade, 7.3") {
		addColumn(tableName: "stack") {
			column(name: "owner_id", type: "bigint")
		}
	
		createIndex(indexName: "FK68AC2888656347D", tableName: "stack") {
			column(name: "owner_id")
		}
	
		addForeignKeyConstraint(baseColumnNames: "owner_id", baseTableName: "stack", constraintName: "FK68AC2888656347D", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}

    changeSet(author: "owf", id: "7.3-8", context: "upgrade, 7.3, sampleData, 7.3-sampleData") {

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

    changeSet(author: "owf", id: "7.3-9", context: "upgrade, 7.3, sampleData, 7.3-sampleData") {

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

    changeSet(author: "owf", id: "7.3-10", context: "sampleData, 7.3-sampleData") {

        comment("Updating the existing widgets on the admin dash to use the new terms for stacks and widgets")

        update(tableName: "dashboard") {
            column(name: "layout_config", value: "{\"xtype\":\"container\",\"cls\":\"hbox \",\"layout\":{\"type\":\"hbox\",\"align\":\"stretch\"},\"items\":[{\"xtype\":\"accordionpane\",\"cls\":\"left\",\"flex\":1,\"htmlText\":\"50%\",\"items\":[],\"widgets\":[{\"universalName\":null,\"widgetGuid\":\"412ec70d-a178-41ae-a8d9-6713a430c87c\",\"uniqueId\":\"ca5b5bb3-14de-3a77-e689-1a752adca824\",\"dashboardGuid\":\"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f\",\"paneGuid\":\"73cf2212-9c0a-5d75-987c-4820faf3cf30\",\"intentConfig\":null,\"name\":\"App Components\",\"active\":false,\"x\":0,\"y\":363,\"zIndex\":0,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":5,\"singleton\":false,\"floatingWidget\":false,\"height\":328,\"width\":675,\"background\":false,\"columnOrder\":\"\"},{\"universalName\":null,\"widgetGuid\":\"fe97f656-862e-4c54-928d-3cdd776daf5b\",\"uniqueId\":\"58f2f00b-a785-c61c-497f-7a99a59e350d\",\"dashboardGuid\":\"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f\",\"paneGuid\":\"73cf2212-9c0a-5d75-987c-4820faf3cf30\",\"intentConfig\":null,\"name\":\"Apps\",\"active\":true,\"x\":0,\"y\":691,\"zIndex\":0,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":3,\"singleton\":false,\"floatingWidget\":false,\"height\":328,\"width\":675,\"background\":false,\"columnOrder\":\"\"}],\"paneType\":\"accordionpane\",\"defaultSettings\":{\"widgetStates\":{\"9d804b74-b2a6-448a-bd04-fe286905ab8f\":{\"timestamp\":1354917003344},\"412ec70d-a178-41ae-a8d9-6713a430c87c\":{\"timestamp\":1354917003349},\"fe97f656-862e-4c54-928d-3cdd776daf5b\":{\"timestamp\":1354917003354},\"9b5ebb40-8540-466c-8ccd-66092ec55636\":{\"timestamp\":1354916964296},\"6cf4f84a-cc89-45ba-9577-15c34f66ee9c\":{\"timestamp\":1354916988848},\"a540f672-a34c-4989-962c-dcbd559c3792\":{\"timestamp\":1354916998451}}}},{\"xtype\":\"dashboardsplitter\"},{\"xtype\":\"container\",\"cls\":\"vbox right\",\"layout\":{\"type\":\"vbox\",\"align\":\"stretch\"},\"items\":[{\"xtype\":\"tabbedpane\",\"cls\":\"top\",\"flex\":1,\"htmlText\":\"50%\",\"items\":[],\"widgets\":[{\"universalName\":null,\"widgetGuid\":\"b87c4a3e-aa1e-499e-ba10-510f35388bb6\",\"uniqueId\":\"49404ec0-c77c-f6b8-b3f9-d5c77fe465a1\",\"dashboardGuid\":\"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f\",\"paneGuid\":\"da405d45-8f04-c2d6-f45c-5ba780aa97fc\",\"intentConfig\":null,\"name\":\"Groups\",\"active\":false,\"x\":679,\"y\":62,\"zIndex\":0,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":3,\"singleton\":false,\"floatingWidget\":false,\"height\":462,\"width\":676,\"background\":false,\"columnOrder\":\"\"},{\"universalName\":null,\"widgetGuid\":\"b3b1d04f-97c2-4726-9575-82bb1cf1af6a\",\"uniqueId\":\"7437065e-fb6c-3253-866c-d05bf45d180a\",\"dashboardGuid\":\"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f\",\"paneGuid\":\"da405d45-8f04-c2d6-f45c-5ba780aa97fc\",\"intentConfig\":null,\"name\":\"Users\",\"active\":false,\"x\":679,\"y\":62,\"zIndex\":0,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":2,\"singleton\":false,\"floatingWidget\":false,\"height\":462,\"width\":676,\"background\":false,\"columnOrder\":\"\"}],\"paneType\":\"tabbedpane\",\"defaultSettings\":{\"widgetStates\":{\"b87c4a3e-aa1e-499e-ba10-510f35388bb6\":{\"timestamp\":1354916950506},\"b3b1d04f-97c2-4726-9575-82bb1cf1af6a\":{\"timestamp\":1354916950489}}}},{\"xtype\":\"dashboardsplitter\"},{\"xtype\":\"tabbedpane\",\"cls\":\"bottom\",\"flex\":1,\"htmlText\":\"50%\",\"items\":[],\"paneType\":\"tabbedpane\",\"widgets\":[{\"universalName\":null,\"widgetGuid\":\"9b5ebb40-8540-466c-8ccd-66092ec55636\",\"uniqueId\":\"de8e1489-1cfc-7a26-e807-6167d91f1539\",\"dashboardGuid\":\"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f\",\"paneGuid\":\"1e5dc42c-89c2-6fd4-b887-efaafdceb260\",\"intentConfig\":null,\"name\":\"App Editor\",\"active\":true,\"x\":679,\"y\":556,\"zIndex\":0,\"minimized\":false,\"maximized\":false,\"pinned\":false,\"collapsed\":false,\"columnPos\":0,\"buttonId\":null,\"buttonOpened\":false,\"region\":\"none\",\"statePosition\":1,\"singleton\":false,\"floatingWidget\":false,\"height\":463,\"width\":676,\"background\":false,\"columnOrder\":\"\"}],\"defaultSettings\":{\"widgetStates\":{\"9b5ebb40-8540-466c-8ccd-66092ec55636\":{\"timestamp\":1354917012829},\"6cf4f84a-cc89-45ba-9577-15c34f66ee9c\":{\"timestamp\":1354917003399},\"a540f672-a34c-4989-962c-dcbd559c3792\":{\"timestamp\":1354917012827}}}}],\"flex\":1}],\"flex\":3}")
            where("guid='54949b5d-f0ee-4347-811e-2522a1bf96fe' AND user_id IS NULL AND name='Administration'")
        }

    }

    changeSet(author: "owf", id: "7.3-11", context: "sampleData, 7.3-sampleData") {

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

    changeSet(author: "owf", id: "7.3-12", context: "sampleData, 7.3-sampleData") {

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
    changeSet(author: "owf", id: "7.3-13", context: "sampleData, 7.3-sampleData") {

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

    changeSet(author: "owf", id: "7.3-14", context: "sampleData, 7.3-sampleData") {

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

    changeSet(author: "owf", id: "7.3-15", context: "sampleData, 7.3-sampleData") {

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
    changeSet(author: "owf", id: "7.3-16", context: "create, upgrade, 7.3") {

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
}