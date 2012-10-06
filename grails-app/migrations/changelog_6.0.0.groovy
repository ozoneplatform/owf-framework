databaseChangeLog = {

    changeSet(author: "owf", id: "6.0.0-1", context: "create, upgrade, 6.0.0") {
        comment("Add universal_name to widgetdefinition")
        addColumn(tableName: "widget_definition") {
            column(name: "universal_name", type: "varchar(255)")
        }
    }

    changeSet(author: "owf", id: "6.0.0-2", context: "create, upgrade, 6.0.0") {
        comment("Add layoutConfig to dashboard")
        addColumn(tableName: "dashboard") {
            column(name: "layout_config", type: "clob")
        }
    }

    changeSet(author: "owf", id: "6.0.0-3", context: "create, upgrade, 6.0.0") {
        comment("Add descriptor_url to widgetdefinition")
        addColumn(tableName: "widget_definition") {
            column(name: "descriptor_url", type: "varchar(2083)")
        }
    }
  
    changeSet(author: "owf", id: "6.0.0-4", context: "create, upgrade, 6.0.0") {
        comment("Remove EventingConnections table and association with DashboardWidgetState")
        dropTable(tableName: "eventing_connections")
    }
  
    changeSet(author: "owf", id: "6.0.0-5", context: "create, upgrade, 6.0.0") {
        comment("Create intent table")

        createTable(tableName: "intent") {
            column(autoIncrement: "true", name: "id", type: "bigint") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "intentPK")
            }
            column(name: "version", type: "bigint") {
                constraints(nullable: "false")
            }
            column(name: "action", type:"varchar(255)") {
                constraints(nullable: "false", unique: "true")
            }
        }
    }
  
    changeSet(author: "owf", id: "6.0.0-6", context: "create, upgrade, 6.0.0") {
        comment("Create intent_data_type table")

        createTable(tableName: "intent_data_type") {
            column(autoIncrement: "true", name: "id", type: "bigint") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "intent_data_typePK")
            }
            column(name: "version", type: "bigint") {
                constraints(nullable: "false")
            }
            column(name: "data_type", type:"varchar(255)") {
                constraints(nullable: "false")
            }
        }
    }
  
    changeSet(author: "owf", id: "6.0.0-7", context: "create, upgrade, 6.0.0") {
        comment("Create intent_data_types table")

        createTable(tableName: "intent_data_types") {
            column(name: "intent_data_type_id", type: "bigint") {
                constraints(nullable: "false")
            }
            column(name: "intent_id", type: "bigint") {
                constraints(nullable: "false")
            }
        }
    }
  
    changeSet(author: "owf", id: "6.0.0-8", context: "create, upgrade, 6.0.0") {
        comment("Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table")

        addForeignKeyConstraint(constraintName: "FK8A59132FD46C6FAA", baseTableName: "intent_data_types", 
            baseColumnNames: "intent_data_type_id", referencedTableName: "intent_data_type", referencedColumnNames: "id")

        addForeignKeyConstraint(constraintName: "FK8A59D92FD46C6FAA", baseTableName: "intent_data_types", 
            baseColumnNames: "intent_id", referencedTableName: "intent", referencedColumnNames: "id")
    }
  
    changeSet(author: "owf", id: "6.0.0-9", context: "create, upgrade, 6.0.0", dbms: "mysql,oracle,postgresql,hsqldb") {
        comment("Create widget_def_intent table")

        createTable(tableName: "widget_def_intent") {
            column(autoIncrement: "true", name: "id", type: "bigint") {
                constraints(nullable: "false", primaryKey: "true", primaryKeyName: "widget_def_intentPK")
            }
            column(name: "version", type: "bigint") {
                constraints(nullable: "false")
            }
            column(name: "receive", type:"boolean") {
                constraints(nullable: false)
            }
            column(name: "send", type:"boolean") {
                constraints(nullable: false)
            }
            column(name: "intent_id", type:"bigint") {
                constraints(nullable: false)
            }
            column(name: "widget_definition_id", type:"bigint") {
                constraints(nullable: false)
            }
        }
    }

    changeSet(author: "owf", id: "6.0.0-9", context: "create, upgrade, 6.0.0", dbms: "mssql") {
        comment("Create widget_def_intent table")

        //Must be sql because widget_definition_id foreign key is required to be numeric(19,0) exactly in mssql
        sql (text = """
            create table widget_def_intent (id bigint identity not null, version bigint not null, receive bit not null, 
                send bit not null, intent_id bigint not null, widget_definition_id numeric(19,0) not null, primary key (id));
        """)
    }
  
    changeSet(author: "owf", id: "6.0.0-10", context: "create, upgrade, 6.0.0") {
        comment("Add foreign constraint for widget_definition_id in widget_def_intent table")

        addForeignKeyConstraint(constraintName: "FK8A59D92FD46C6FAB", baseTableName: "widget_def_intent", 
            baseColumnNames: "widget_definition_id", referencedTableName: "widget_definition", referencedColumnNames: "id")
    }
  
    changeSet(author: "owf", id: "6.0.0-11", context: "create, upgrade, 6.0.0") {
        comment("Add foreign constraint for intent_id in widget_definition_intent table")

        addForeignKeyConstraint(constraintName: "FK8A59D92FD46C6FAC", baseTableName: "widget_def_intent",
            baseColumnNames: "intent_id", referencedTableName: "intent", referencedColumnNames: "id")
    }
  
    changeSet(author: "owf", id: "6.0.0-12", context: "create, upgrade, 6.0.0") {
        comment("Create widget_def_intent_data_types table")

        createTable(tableName: "widget_def_intent_data_types") {
            column(name: "intent_data_type_id", type: "bigint") {
                constraints(nullable: "false")
            }
            column(name: "widget_definition_intent_id", type: "bigint") {
                constraints(nullable: "false")
            }
        }
    }
  
    changeSet(author: "owf", id: "6.0.0-13", context: "create, upgrade, 6.0.0") {
        comment("Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table")

        addForeignKeyConstraint(constraintName: "FK8A59D92FD41A6FAD", 
            baseTableName: "widget_def_intent_data_types", baseColumnNames: "intent_data_type_id", 
            referencedTableName: "intent_data_type", referencedColumnNames: "id")

        addForeignKeyConstraint(constraintName: "FK8A59D92FD46C6FAD", 
            baseTableName: "widget_def_intent_data_types", baseColumnNames: "widget_definition_intent_id", 
            referencedTableName: "widget_def_intent", referencedColumnNames: "id")
    }

    changeSet(author: "owf", id: "6.0.0-14", context: "create, upgrade, 6.0.0") {
        comment("Add intentConfig column to dashboard table")

        addColumn(tableName: "dashboard") {
            column(name: "intent_config", type: "clob")
        }
    }

	changeSet(author: "owf", id: "6.0.0-15", context: "create, upgrade, 6.0.0") {
		comment(text="Added description column into Widget Definition table")

    	addColumn(tableName: "widget_definition") {
    		column(name: "description", type: "varchar(255)", defaultValue: "")
    	}
	}
  changeSet(author: "owf", id: "6.0.0-16", context: "create, upgrade, 6.0.0") {
    comment("Add groupWidget property to personwidgetdefinition")
    addColumn(tableName: "person_widget_definition") {
      column(name: "group_widget", type: "boolean", defaultValueBoolean: "false")
    }
  }

  changeSet(author: "owf", id: "6.0.0-17", context: "create, upgrade, 6.0.0") {
    comment("Add favorite property to personwidgetdefinition")
    addColumn(tableName: "person_widget_definition") {
      column(name: "favorite", type: "boolean", defaultValueBoolean: "false")
    }
  }
  
    changeSet(author: "owf", id: "6.0.0-18", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_definition] ON
      """)
    }
    changeSet(author: "owf", id: "6.0.0-19", context: "sampleData, 6.0.0-sampleData") {
        comment(text="insert new sample data")
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "178")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widgetC.gif")
            column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widgetCsm.gif")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "825")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "437")
            column(name: "widget_url", value: "examples/walkthrough/widgets/NYSE.gsp")
            column(name: "widget_guid", value: "fe137961-039d-e7a5-7050-d6eed7ac4782")
            column(name: "display_name", value: "NYSE Widget")
            column(name: "background", valueBoolean: "false")
            column(name: "universal_name", value: "org.owfgoss.owf.examples.NYSE")
            column(name: "description", value: "This widget displays the end of day report for the New York Stock Exchange.")
			column(name: "descriptor_url", value: "../examples/walkthrough/descriptors/NYSE_descriptor.html")
        }
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "179")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widgetC.gif")
            column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widgetCsm.gif")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "400")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "600")
            column(name: "widget_url", value: "examples/walkthrough/widgets/HTMLViewer.gsp")
            column(name: "widget_guid", value: "cd5e77f8-cb28-8574-0a8a-a535bd2c7de4")
            column(name: "display_name", value: "HTML Viewer")
            column(name: "background", valueBoolean: "false")
            column(name: "universal_name", value: "org.owfgoss.owf.examples.HTMLViewer")
            column(name: "description", value: "This widget displays HTML.")
			column(name: "descriptor_url", value: "../examples/walkthrough/descriptors/HTMLViewer_descriptor.html")
        }
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "180")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widgetC.gif")
            column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widgetCsm.gif")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "800")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "600")
            column(name: "widget_url", value: "examples/walkthrough/widgets/StockChart.gsp")
            column(name: "widget_guid", value: "92078ac9-6f21-2f5f-6afc-bdc8c915c66d")
            column(name: "display_name", value: "Stock Chart")
            column(name: "background", valueBoolean: "false")
            column(name: "universal_name", value: "org.owfgoss.owf.examples.StockChart")
            column(name: "description", value: "This widget charts stock prices.")
			column(name: "descriptor_url", value: "../examples/walkthrough/descriptors/StockChart_descriptor.html")
        }
    }
    changeSet(author: "owf", id: "6.0.0-20", context: "sampleData, 6.0.0-sampleData") {
        comment(text="insert new sample data")
        insert(tableName: "widget_definition_widget_types") {
            column(name: "widget_definition_id", valueNumeric: "178")
            column(name: "widget_type_id", valueNumeric: "1")
        }
        insert(tableName: "widget_definition_widget_types") {
            column(name: "widget_definition_id", valueNumeric: "179")
            column(name: "widget_type_id", valueNumeric: "1")
        }
        insert(tableName: "widget_definition_widget_types") {
            column(name: "widget_definition_id", valueNumeric: "180")
            column(name: "widget_type_id", valueNumeric: "1")
        }
    }
    changeSet(author: "owf", id: "6.0.0-21", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_definition] OFF
      """)
    }
    changeSet(author: "owf", id: "6.0.0-22", dbms:"mssql", context: "sampleData, 6.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[owf_group] ON
      """)
    }
    changeSet(author: "owf", id: "6.0.0-23", context: "sampleData, 6.0.0-sampleData") {
        comment(text="Add OWF Users group")

        //insert OWF Users group
        insert(tableName: "owf_group") {
            column(name: "id", valueNumeric: "192")

            column(name: "version", valueNumeric: "0")

            column(name: "status", value: "active")

            column(name: "description", value: "OWF Users")

            column(name: "name", value: "OWF Users")

            column(name: "display_name", value: "OWF Users")

            column(name: "automatic", valueBoolean: "true")
        }
    }
    changeSet(author: "owf", id: "6.0.0-24", dbms:"mssql", context: "sampleData, 6.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[owf_group] OFF
      """)
    }
	changeSet(author: "owf", id: "6.0.0-25", dbms:"oracle,postgresql", context: "sampleData, 6.0.0-sampleData") {
	    comment(text="set sequence to higher number that is not used")
	
	  dropSequence(sequenceName: "hibernate_sequence")
	  createSequence(sequenceName: "hibernate_sequence", startValue:"300")
	}

    changeSet(author: "owf", id: "6.0.0-26", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent] ON
      """)
    }
	changeSet(author: "owf", id: "6.0.0-27", context: "sampleData, 6.0.0-sampleData") {
		comment(text="insert new sample data")
		// Create Intents
        insert(tableName: "intent") {
			column(name: "id", valueNumeric: "301")
			column(name: "version", valueNumeric: "0")
			column(name: "action", value: "Graph")
        }
        insert(tableName: "intent") {
			column(name: "id", valueNumeric: "302")
			column(name: "version", valueNumeric: "0")
			column(name: "action", value: "View")
        }
	}
    changeSet(author: "owf", id: "6.0.0-28", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent] OFF
      """)
    }
    changeSet(author: "owf", id: "6.0.0-29", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent_data_type] ON
      """)
    }
	changeSet(author: "owf", id: "6.0.0-30", context: "sampleData, 6.0.0-sampleData") {
		comment(text="insert new sample data")
		// Map intents to data types
        insert(tableName: "intent_data_type") {
			column(name: "id", valueNumeric: "303")
			column(name: "version", valueNumeric: "0")
			column(name: "data_type", value: "Prices")
        }
		insert(tableName: "intent_data_type") {
			column(name: "id", valueNumeric: "304")
			column(name: "version", valueNumeric: "0")
			column(name: "data_type", value: "HTML")
		}
		insert(tableName: "intent_data_types") {
			column(name: "intent_data_type_id", valueNumeric: "303")
			column(name: "intent_id", valueNumeric: "301")
		}
		insert(tableName: "intent_data_types") {
			column(name: "intent_data_type_id", valueNumeric: "304")
			column(name: "intent_id", valueNumeric: "302")
		}
	}
    changeSet(author: "owf", id: "6.0.0-31", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[intent_data_type] OFF
      """)
    }
    changeSet(author: "owf", id: "6.0.0-32", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_def_intent] ON
      """)
    }
	changeSet(author: "owf", id: "6.0.0-33", context: "sampleData, 6.0.0-sampleData") {
		comment(text="insert new sample data")
		// Assign Intents to Intents Widgets
        insert(tableName: "widget_def_intent") {
			column(name: "id", valueNumeric: "305")
			column(name: "version", valueNumeric: "0")
			column(name: "receive", valueBoolean: "false")
			column(name: "send", valueBoolean: "true")
			column(name: "intent_id", valueNumeric: "301")
			column(name: "widget_definition_id", valueNumeric: "178")
        }
        insert(tableName: "widget_def_intent") {
			column(name: "id", valueNumeric: "306")
			column(name: "version", valueNumeric: "0")
			column(name: "receive", valueBoolean: "false")
			column(name: "send", valueBoolean: "true")
			column(name: "intent_id", valueNumeric: "302")
			column(name: "widget_definition_id", valueNumeric: "178")
        }
        insert(tableName: "widget_def_intent") {
			column(name: "id", valueNumeric: "307")
			column(name: "version", valueNumeric: "0")
			column(name: "receive", valueBoolean: "true")
			column(name: "send", valueBoolean: "false")
			column(name: "intent_id", valueNumeric: "302")
			column(name: "widget_definition_id", valueNumeric: "179")
        }
        insert(tableName: "widget_def_intent") {
			column(name: "id", valueNumeric: "308")
			column(name: "version", valueNumeric: "0")
			column(name: "receive", valueBoolean: "true")
			column(name: "send", valueBoolean: "false")
			column(name: "intent_id", valueNumeric: "301")
			column(name: "widget_definition_id", valueNumeric: "180")
        }
        insert(tableName: "widget_def_intent_data_types") {
			column(name: "intent_data_type_id", valueNumeric: "303")
			column(name: "widget_definition_intent_id", valueNumeric: "305")
        }
        insert(tableName: "widget_def_intent_data_types") {
			column(name: "intent_data_type_id", valueNumeric: "304")
			column(name: "widget_definition_intent_id", valueNumeric: "306")
        }
        insert(tableName: "widget_def_intent_data_types") {
			column(name: "intent_data_type_id", valueNumeric: "304")
			column(name: "widget_definition_intent_id", valueNumeric: "307")
        }
        insert(tableName: "widget_def_intent_data_types") {
			column(name: "intent_data_type_id", valueNumeric: "303")
			column(name: "widget_definition_intent_id", valueNumeric: "308")
        }
	}
    changeSet(author: "owf", id: "6.0.0-34", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[widget_def_intent] OFF
      """)
    }
	changeSet(author: "owf", id: "6.0.0-35", dbms:"mssql", context: "sampleData, 6.0.0-sampleData") {
		comment(text="allow identity inserts")
	  sql ( text = """
		SET IDENTITY_INSERT [dbo].[tags] ON
	  """)
	}
	changeSet(author: "owf", id: "6.0.0-36", context: "sampleData, 6.0.0-sampleData") {
		comment(text="insert new sample data")
	  insert(tableName: "tags") {
		  column(name: "id", valueNumeric: "309") 
		  column(name: "version", valueNumeric: "0")
		  column(name: "name", value: "grid")
	  }
	  insert(tableName: "tags") {
		  column(name: "id", valueNumeric: "310")
		  column(name: "version", valueNumeric: "0")
		  column(name: "name", value: "html")
	  }
	  insert(tableName: "tags") {
		  column(name: "id", valueNumeric: "311")
		  column(name: "version", valueNumeric: "0")
		  column(name: "name", value: "document_viewer")
	  }
	  insert(tableName: "tags") {
		  column(name: "id", valueNumeric: "312")
		  column(name: "version", valueNumeric: "0")
		  column(name: "name", value: "stock_chart")
	  }
	}
	changeSet(author: "owf", id: "6.0.0-37", dbms:"mssql", context: "sampleData, 6.0.0-sampleData") {
		comment(text="allow identity inserts")
	  sql ( text = """
		SET IDENTITY_INSERT [dbo].[tags] OFF
	  """)
	}
  
	changeSet(author: "owf", id: "6.0.0-38", dbms:"mssql", context: "sampleData, 6.0.0-sampleData") {
		comment(text="allow identity inserts")
	  sql ( text = """
		SET IDENTITY_INSERT [dbo].[tag_links] ON
	  """)
	}
	changeSet(author: "owf", id: "6.0.0-39", context: "sampleData, 6.0.0-sampleData") {
		comment(text="insert new sample data")
	  insert(tableName: "tag_links") {
		  column(name: "id", valueNumeric: "313")
		  column(name: "version", valueNumeric: "0")
		  column(name: "pos", valueNumeric: "-1")
		  column(name: "visible", valueBoolean: "true")
		  column(name: "tag_ref", valueNumeric: "178")
		  column(name: "tag_id", valueNumeric: "309")
		  column(name: "type", value: "widgetDefinition")
		  column(name: "editable", valueBoolean: "true")
	  }
  
	  insert(tableName: "tag_links") {
		  column(name: "id", valueNumeric: "314")
		  column(name: "version", valueNumeric: "0")
		  column(name: "pos", valueNumeric: "-1")
		  column(name: "visible", valueBoolean: "true")
		  column(name: "tag_ref", valueNumeric: "179")
		  column(name: "tag_id", valueNumeric: "310")
		  column(name: "type", value: "widgetDefinition")
		  column(name: "editable", valueBoolean: "true")
	  }
  
	  insert(tableName: "tag_links") {
		  column(name: "id", valueNumeric: "315")
		  column(name: "version", valueNumeric: "0")
		  column(name: "pos", valueNumeric: "-1")
		  column(name: "visible", valueBoolean: "true")
		  column(name: "tag_ref", valueNumeric: "179")
		  column(name: "tag_id", valueNumeric: "311")
		  column(name: "type", value: "widgetDefinition")
		  column(name: "editable", valueBoolean: "true")
	  }
  
	  insert(tableName: "tag_links") {
		  column(name: "id", valueNumeric: "316")
		  column(name: "version", valueNumeric: "0")
		  column(name: "pos", valueNumeric: "-1")
		  column(name: "visible", valueBoolean: "true")
		  column(name: "tag_ref", valueNumeric: "180")
		  column(name: "tag_id", valueNumeric: "312")
		  column(name: "type", value: "widgetDefinition")
		  column(name: "editable", valueBoolean: "true")
	  }
	}
	changeSet(author: "owf", id: "6.0.0-40", dbms:"mssql", context: "sampleData, 6.0.0-sampleData") {
		comment(text="allow identity inserts")
	  sql ( text = """
		SET IDENTITY_INSERT [dbo].[tag_links] OFF
	  """)
	}
  
  
    changeSet(author: "owf", id: "6.0.0-41", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[domain_mapping] ON
      """)
    }
	changeSet(author: "owf", id: "6.0.0-42", context: "sampleData, 6.0.0-sampleData") {
		comment(text="insert new sample data")

		// Assign Intents Widgets to OWF Users group
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "317")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "192")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "178")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "318")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "192")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "179")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "319")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "192")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "180")
			column(name: "dest_type", value: "widget_definition")
		}

		// Assign widgets for Sample dashboard to OWF Users group
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "320")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "192")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "16")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "321")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "192")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "17")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "322")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "192")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "20")
			column(name: "dest_type", value: "widget_definition")
		}

		// Assign widgets for Administration dashboard to OWF Administrators group
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "323")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "191")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "151")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "324")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "191")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "154")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "325")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "191")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "156")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "326")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "191")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "158")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "327")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "191")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "160")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "328")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "191")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "163")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "329")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "191")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "166")
			column(name: "dest_type", value: "widget_definition")
		}
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "330")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "191")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "170")
			column(name: "dest_type", value: "widget_definition")
		}
	}
    changeSet(author: "owf", id: "6.0.0-43", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
      """)
    }

    //fix for oracle's issue with empty strings being counted as null inserts, so we'll just remove the notnull for all dbs
    //todo remove this once dashboard designer changes have removed obsolete tables from the backend
    changeSet(author: "owf", id: "6.0.0-44", context: "create, upgrade, 6.0.0") {
      dropNotNullConstraint(tableName: "dashboard", columnName: "layout", columnDataType: "varchar(9)")
    }
    
    changeSet(author: "owf", id: "6.0.0-45", context: "sampleData, 6.0.0-sampleData") {
        comment(text="Removing Fake Widgets")
        
// DEPRECATED statement.  As of 7.0.0 dashboard_widget_state table is removed.  Operations on that table
// have been deprecated.  Removed references to that table in from the following SQL.
//        sql(text = """
//            DELETE FROM dashboard_widget_state WHERE person_widget_definition_id IN (SELECT id FROM person_widget_definition WHERE widget_definition_id IN (SELECT id FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551')));
//            DELETE FROM person_widget_definition WHERE widget_definition_id IN (SELECT id FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551'));
//            DELETE FROM widget_definition_widget_types WHERE widget_definition_id IN (SELECT id FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551'));
//            DELETE FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551');
//        """)
        sql(text = """
            DELETE FROM person_widget_definition WHERE widget_definition_id IN (SELECT id FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551'));
            DELETE FROM widget_definition_widget_types WHERE widget_definition_id IN (SELECT id FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551'));
            DELETE FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551');
        """)
        
    }
	
	changeSet(author: "owf", id: "6.0.0-47", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
		comment(text="allow identity inserts")
		sql ( text = """
			SET IDENTITY_INSERT [dbo].[dashboard] ON
		""")
	}

    // NOTE: As of 7.0.0, column_count and default_settings are DEPRECATED.  They have been
    // commented out of the change below.	
	changeSet(author: "owf", id: "6.0.0-48", context: "sampleData, 6.0.0-sampleData") {
		comment(text="Add Intents, Sample, and Administration Dashboards")
		
	    insert(tableName: "dashboard") {
	        column(name: "id", valueNumeric: "320")
	        column(name: "version", valueNumeric: "0")
	        column(name: "isdefault", valueBoolean: "true")
	        column(name: "dashboard_position", valueNumeric: "0")
	        column(name: "altered_by_admin", valueBoolean: "false")
	        column(name: "guid", value: "3f59855b-d93e-dc03-c6ba-f4c33ea0177f")
//	        column(name: "column_count", valueNumeric: "0")
	        column(name: "name", value: "Widget Intents")
	        column(name: "description", value: "This dashboard uses the sample Intents Widgets to demonstrate the widget intents workflow.")
//	        column(name: "default_settings", value: "{}")
	        column(name: "layout_config", value: """{"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"container","cls":"hbox top","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"fe137961-039d-e7a5-7050-d6eed7ac4782","uniqueId":"ecbe0bd5-7781-d859-2dbc-13f86be406a7","dashboardGuid":"3f59855b-d93e-dc03-c6ba-f4c33ea0177f","paneGuid":"16ec8b84-a631-4e7c-d9cc-883635abd6ef","intentConfig":null,"launchData":null,"name":"NYSE Widget","active":true,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798,"background":false,"columnOrder":""}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"cd5e77f8-cb28-8574-0a8a-a535bd2c7de4","uniqueId":"66e7148e-3cd3-72ff-6a24-6143ac618b80","dashboardGuid":"3f59855b-d93e-dc03-c6ba-f4c33ea0177f","paneGuid":"443dfdc0-7165-cb7d-dd9c-f08fbe36bdb1","intentConfig":null,"launchData":null,"name":"HTML Viewer","active":false,"x":802,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798,"background":false,"columnOrder":""}],"defaultSettings":{}}],"flex":1},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"92078ac9-6f21-2f5f-6afc-bdc8c915c66d","uniqueId":"b17f186c-0d31-2077-1c3b-2a43dbf83738","dashboardGuid":"3f59855b-d93e-dc03-c6ba-f4c33ea0177f","paneGuid":"410cd0ee-cbdd-f225-582e-6aaa92e058f2","intentConfig":null,"launchData":null,"name":"Stock Chart","active":false,"x":0,"y":576,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":539,"width":1600,"background":false,"columnOrder":""}],"defaultSettings":{}}],"height":"100%"}""")
		}
  
	    insert(tableName: "dashboard") {
	        column(name: "id", valueNumeric: "321")
	        column(name: "version", valueNumeric: "0")
	        column(name: "isdefault", valueBoolean: "false")
	        column(name: "dashboard_position", valueNumeric: "0")
	        column(name: "altered_by_admin", valueBoolean: "false")
	        column(name: "guid", value: "c62ce95c-d16d-4ffe-afae-c46fa64a689b")
//	        column(name: "column_count", valueNumeric: "0")
	        column(name: "name", value: "Sample")
	        column(name: "description", value: "")
//	        column(name: "default_settings", value: "{}")
	        column(name: "layout_config", value: """{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":[{"widgetGuid":"eb5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"17580ea1-02fc-8ca7-e794-b5644f7dc21d","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Shouter","active":false,"x":549,"y":7,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19120,"height":250,"width":295},{"widgetGuid":"ec5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"9bdc8e96-f311-4a0b-c5b9-23ae5d768297","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Listener","active":true,"x":4,"y":5,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19130,"height":383,"width":540}],"defaultSettings":{"widgetStates":{"ec5435cf-4021-4f2a-ba69-dde451d12551":{"x":4,"y":5,"height":383,"width":540,"timestamp":1348064185725},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"x":549,"y":7,"height":250,"width":295,"timestamp":1348064183912}}}}""")
		}
		
		insert(tableName: "dashboard") {
			column(name: "id", valueNumeric: "322")
			column(name: "version", valueNumeric: "0")
			column(name: "isdefault", valueBoolean: "false")
			column(name: "dashboard_position", valueNumeric: "0")
			column(name: "altered_by_admin", valueBoolean: "false")
			column(name: "guid", value: "54949b5d-f0ee-4347-811e-2522a1bf96fe")
//			column(name: "column_count", valueNumeric: "0")
			column(name: "name", value: "Administration")
			column(name: "description", value: "This dashboard provides the widgets needed to administer dashboards, widgets, groups, and users in OWF.")
//			column(name: "default_settings", value: "{}")
	        column(name: "layout_config", value: """{"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"container","cls":"hbox top","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"b3b1d04f-97c2-4726-9575-82bb1cf1af6a","uniqueId":"9251add0-28f1-ea2e-4bee-92f0d21d940d","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"994cc403-2baa-dc68-d172-e8e59b937ed1","intentConfig":null,"launchData":null,"name":"Users","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"b87c4a3e-aa1e-499e-ba10-510f35388bb6","uniqueId":"713c90d5-a51f-ae72-d67c-672d477b6ec7","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"2b47e10c-0f7d-aa9b-3e12-11ca57f229fc","intentConfig":null,"launchData":null,"name":"Groups","active":false,"x":802,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798}],"defaultSettings":{}}],"flex":1},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox bottom","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"412ec70d-a178-41ae-a8d9-6713a430c87c","uniqueId":"4ece13a7-b58f-e7d2-2df9-3e138fa43314","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"af782c7d-4c38-35a1-7f81-68eb9c11c440","intentConfig":null,"launchData":null,"name":"Widgets","active":false,"x":0,"y":576,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":539,"width":798}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"9d804b74-b2a6-448a-bd04-fe286905ab8f","uniqueId":"7eaea99c-8ad5-ce3f-5325-a003b4174a54","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"2e8ae979-52d5-a0ab-d30b-299672fe9a50","intentConfig":null,"launchData":null,"name":"Group Dashboards","active":false,"x":802,"y":576,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":539,"width":798}],"defaultSettings":{}}],"flex":1}],"flex":3}""")
		}
	}
	
	changeSet(author: "owf", id: "6.0.0-49", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
		comment(text="allow identity inserts")
		sql ( text = """
			SET IDENTITY_INSERT [dbo].[dashboard] OFF
		""")
	}

	changeSet(author: "owf", id: "6.0.0-50", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
		comment(text="allow identity inserts")
		sql ( text = """
			SET IDENTITY_INSERT [dbo].[domain_mapping] ON
		""")
	}
	
	changeSet(author: "owf", id: "6.0.0-51", context: "sampleData, 6.0.0-sampleData") {
		comment(text="Assign Intents and Sample Dashboards to OWF Users group")

		// Assign Intents Dashboard to OWF Users group
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "331")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "192")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "320")
			column(name: "dest_type", value: "dashboard")
		}

		// Assign Sample Dashboard to OWF Users group
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "332")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "192")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "321")
			column(name: "dest_type", value: "dashboard")
		}

		// Assign Administration Dashboard to OWF Administrators group
		insert(tableName: "domain_mapping") {
			column(name: "id", valueNumeric: "333")
			column(name: "version", valueNumeric: "0")
			column(name: "src_id", valueNumeric: "191")
			column(name: "src_type", value: "group")
			column(name: "relationship_type", value: "owns")
			column(name: "dest_id", valueNumeric: "322")
			column(name: "dest_type", value: "dashboard")
		}
	}
	
	changeSet(author: "owf", id: "6.0.0-52", context: "sampleData, 6.0.0-sampleData", dbms:"mssql") {
		comment(text="allow identity inserts")
		sql ( text = """
			SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
		""")
	}
	
	changeSet(author: "owf", id: "6.0.0-53", context: "create, upgrade, 6.0.0") {
		comment("Add locked property to dashboard")
		addColumn(tableName: "dashboard") {
			column(name: "locked", type: "boolean", defaultValueBoolean: "false", valueBoolean: "false")
		}
	} 
	
	changeSet(author: "owf", id: "6.0.0-54", context: "sampleData, 6.0.0-sampleData") {

		comment("Rename HTML intents data type to text/html.")

		update(tableName: "intent_data_type") {
			column(name: "data_type", value: "text/html")
			where("data_type='HTML'")
		}

		update(tableName: "intent_data_type") {
			column(name: "data_type", value: "application/vnd.owf.sample.price")
			where("data_type='Prices'")
		}
	}
    
    changeSet(author: "owf", id: "6.0.0-55", context: "create, upgrade, 6.0.0") {
        comment("Add display name field to pwd")
        addColumn(tableName: "person_widget_definition") {
            column(name: "display_name", type: "varchar(256)")
        }
    }
    
    changeSet(author: "owf", id: "6.0.0-56", context: "create, upgrade, 6.0.0") {
        comment("Add disabled field to pwd")
        addColumn(tableName: "person_widget_definition") {
          column(name: "disabled", type: "boolean", defaultValueBoolean: "false", valueBoolean: "false")
        }
    }

    changeSet(author: "owf", id: "6.0.0-57", context: "upgradeScriptGenOnly", dbms: "mssql") {
        comment("Convert OWF 5 style dashboards to OWF 6 style dashboards")
        sqlFile(path: "dbscripts/SQLServerConvertDashboards_v5.0.0_v6.0.0.sql",
                splitStatements: false)
    }
    
    changeSet(author: "owf", id: "6.0.0-58", context: "upgradeScriptGenOnly", dbms: "mysql") {
        comment("Convert OWF 5 style dashboards to OWF 6 style dashboards")
        sqlFile(path: "dbscripts/MySqlConvertDashboards_v5.0.0_v6.0.0.sql",
                splitStatements: false)
    }
    
    changeSet(author: "owf", id: "6.0.0-59", context: "upgradeScriptGenOnly", dbms: "oracle") {
        comment("Convert OWF 5 style dashboards to OWF 6 style dashboards")
        sqlFile(path: "dbscripts/OracleConvertDashboards_v5.0.0_v6.0.0.sql",
                splitStatements: false)
    }
    
    changeSet(author: "owf", id: "6.0.0-60", context: "upgradeScriptGenOnly", dbms: "postgresql") {
        comment("Convert OWF 5 style dashboards to OWF 6 style dashboards")
        sqlFile(path: "dbscripts/PostgreSQLConvertDashboards_v5.0.0_v6.0.0.sql",
                splitStatements: false)
    } 

// DEPRECATED change as of 7.0.0 dashboard_widget_state table was removed.
//    changeSet(author: "owf", id: "6.0.0-61", context: "sampleData, 6.0.0-sampleData") {
//        comment("Remove old Sample and Administration Dashboards")
//
//
//		delete(tableName: "dashboard_widget_state") {
//			where("dashboard_id in (101, 117, 133, 150)")
//        }
//        delete(tableName: "domain_mapping") {
//			where("dest_id=150 AND dest_type='dashboard'")
//        }
//		delete(tableName: "dashboard") {
//			where("id in (101, 117, 133, 150)")
//		}
//    } 

    changeSet(author: "owf", id: "6.0.0-62", dbms:"oracle,postgresql", context: "sampleData, 6.0.0-sampleData") {
        comment(text="set sequence to higher number that is not used")

      dropSequence(sequenceName: "hibernate_sequence")
      createSequence(sequenceName: "hibernate_sequence", startValue:"334")
    }

    changeSet(author: "owf", id: "6.0.0-63", dbms: "oracle", context: "upgrade, 6.0.0, sampleData, 6.0.0-sampleData") {
      comment(text = "upgrade any pwds that were pending approval to use the disabled column")
      sql(text = """
            update person_widget_definition pwd
            set pwd.disabled = 1
            where pwd.id in (
                      select pwd.id
                      from person_widget_definition pwd, tag_links taglinks
                      where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = 0
            )
          """)
    }

    changeSet(author: "owf", id: "6.0.0-63", dbms: "postgresql", context: "upgrade, 6.0.0, sampleData, 6.0.0-sampleData") {
      comment(text = "upgrade any pwds that were pending approval to use the disabled column")
      sql(text = """
            update person_widget_definition pwd
            set disabled = true
            from tag_links taglinks
            where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = false
          """)
    }

    changeSet(author: "owf", id: "6.0.0-63", dbms: "mssql", context: "upgrade, 6.0.0, sampleData, 6.0.0-sampleData") {
      comment(text = "upgrade any pwds that were pending approval to use the disabled column")
      sql(text = """
            update person_widget_definition
            set disabled = 1
            from person_widget_definition as pwd, tag_links as taglinks
            where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = 0
        """)
    }

    changeSet(author: "owf", id: "6.0.0-63", dbms: "mysql", context: "upgrade, 6.0.0, sampleData, 6.0.0-sampleData") {
      comment(text = "upgrade any pwds that were pending approval to use the disabled column")
      sql(text = """
            update person_widget_definition pwd, tag_links taglinks
            set pwd.disabled = true
            where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = false
          """)
    }

    changeSet(author: "owf", id: "6.0.0-63", dbms: "hsqldb", context: "upgrade, 6.0.0, sampleData, 6.0.0-sampleData") {
      comment(text = "upgrade any pwds that were pending approval to use the disabled column")
      sql(text = """
            update person_widget_definition pwd
            set pwd.disabled = false
            where pwd.id in (
                      select pwd.id
                      from person_widget_definition pwd, tag_links taglinks
                      where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = true
            )
          """)
    }

    changeSet(author: "owf", id: "6.0.0-64", dbms: "oracle, mssql", context: "upgrade, sampleData, 6.0.0-sampleData") {
        comment("delete any taglinks which were pending approval (have editable false)")

        delete(tableName: "tag_links") {
            where("editable = 0")
        }
    }

    changeSet(author: "owf", id: "6.0.0-64", dbms: "hsqldb, postgresql, mysql", context: "upgrade, sampleData, 6.0.0-sampleData") {
        comment("delete any taglinks which were 'pending approval' (have editable false)")

        delete(tableName: "tag_links") {
            where("editable = false")
        }
    }

    changeSet(author: "owf", id: "6.0.0-65", context: "sampleData, 5.0.0-sampleData") {
        comment(text="Updating Sample Widget images")

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/ChannelListener.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/ChannelListener.png")
            where(text="widget_url='examples/walkthrough/widgets/ChannelListener.gsp'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/ChannelShouter.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/ChannelShouter.png")
            where(text="widget_url='examples/walkthrough/widgets/ChannelShouter.gsp'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/ColorClient.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/ColorClient.png")
            where(text="widget_url='examples/walkthrough/widgets/ColorClient.gsp'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/ColorServer.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/ColorServer.png")
            where(text="widget_url='examples/walkthrough/widgets/ColorServer.gsp'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/EventMonitor.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/EventMonitor.png")
            where(text="widget_url='examples/walkthrough/widgets/EventMonitor.html'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/HTMLViewer.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/HTMLViewer.png")
            where(text="widget_url='examples/walkthrough/widgets/HTMLViewer.gsp'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/NearlyEmpty.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/NearlyEmpty.png")
            where(text="widget_url='examples/walkthrough/widgets/NearlyEmptyWidget.html'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/NYSEStock.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/NYSEStock.png")
            where(text="widget_url='examples/walkthrough/widgets/NYSE.gsp'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/Preferences.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/Preferences.png")
            where(text="widget_url='examples/walkthrough/widgets/Preferences.gsp'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/PriceChart.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/PriceChart.png")
            where(text="widget_url='examples/walkthrough/widgets/StockChart.gsp'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/WidgetChrome.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/WidgetChrome.png")
            where(text="widget_url='examples/walkthrough/widgets/WidgetChrome.gsp'")
        }

        update(tableName:"widget_definition") {
            column(name:"image_url_large", value:"themes/common/images/widget-icons/WidgetLog.png")
            column(name:"image_url_small", value:"themes/common/images/widget-icons/WidgetLog.png")
            where(text="widget_url='examples/walkthrough/widgets/WidgetLog.gsp'")
        }
    }
}
