databaseChangeLog = {
	
	changeSet(author: "owf", id: "5.0.0-1", context: "create, upgrade, 5.0.0") {
		comment("Add display name to group")
		addColumn(tableName: "owf_group") {
			column(name: "display_name", type: "varchar(200)")
		}
	}
  
	changeSet(author: "owf", id: "5.0.0-2", context: "create, upgrade, 5.0.0", dbms:"mssql") {
		comment(text="allow identity inserts")
	  sql ( text = """
		SET IDENTITY_INSERT [dbo].[widget_type] ON
	  """)
	}
  
	changeSet(author: "owf", id: "5.0.0-3", context: "create, upgrade, 5.0.0") {
	  comment(text="Add metric widget types to table")
	  insert(tableName: "widget_type") {
		column(name: "id", valueNumeric:"4")
		column(name: "name", value: "metric")
		column(name: "version", valueNumeric: "0")
	  }
	}
	changeSet(author: "owf", id: "5.0.0-4", dbms:"mssql", context: "create, upgrade, 5.0.0") {
		comment(text="allow identity inserts")
	  sql ( text = """
		SET IDENTITY_INSERT [dbo].[widget_type] OFF
	  """)
	}

	changeSet(author: "owf", id: "5.0.0-5", dbms: "mysql,mssql,oracle", context: "upgrade, 5.0.0, sampleData, 5.0.0-sampleData") {

		comment("Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.")

		update(tableName: "owf_group") {
			column(name: "name", value: "OWF Users")
			column(name: "automatic", valueBoolean: true)
			where("name='All Users' AND automatic=0")
		}

		update(tableName: "owf_group") {
			column(name: "name", value: "OWF Administrators")
			column(name: "automatic", valueBoolean: true)
			where("name='OWF Admins' AND automatic=0")
		}
	}

	changeSet(author: "owf", id: "5.0.0-5", dbms: "postgresql,hsqldb", context: "upgrade, 5.0.0, sampleData, 5.0.0-sampleData") {

		comment("Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.")

		update(tableName: "owf_group") {
			column(name: "name", value: "OWF Users")
			column(name: "automatic", valueBoolean: true)
			where("name='All Users' AND automatic=false")
		}

		update(tableName: "owf_group") {
			column(name: "name", value: "OWF Administrators")
			column(name: "automatic", valueBoolean: true)
			where("name='OWF Admins' AND automatic=false")
		}
	}
	
	changeSet(author: "owf", id: "5.0.0-6", context: "upgrade, 5.0.0, sampleData, 5.0.0-sampleData") {
		comment(text = "Set default value for display_name")
		sql(text = """
			UPDATE owf_group
			SET display_name = name
			WHERE display_name IS NULL
		""")
	}

	changeSet(author: "owf", id: "5.0.0-7", context: "sampleData, 5.0.0-sampleData") {
		comment(text="Updating Sample Widget URLs")

		update(tableName:"widget_definition") {
			column(name:"widget_url", value:"examples/walkthrough/widgets/ChannelShouter.gsp")
			where(text="widget_url='examples/walkthrough/widgets/ChannelShouter.html'")
		}

		update(tableName:"widget_definition") {
			column(name:"widget_url", value:"examples/walkthrough/widgets/Preferences.gsp")
			where(text="widget_url='examples/walkthrough/widgets/Preferences.html'")
		}

		update(tableName:"widget_definition") {
			column(name:"widget_url", value:"examples/walkthrough/widgets/WidgetChrome.gsp")
			where(text="widget_url='examples/walkthrough/widgets/WidgetChrome.html'")
		}

		update(tableName:"widget_definition") {
			column(name:"widget_url", value:"examples/walkthrough/widgets/WidgetLog.gsp")
			where(text="widget_url='examples/walkthrough/widgets/WidgetLog.html'")
		}
	}

    changeSet(author: "owf", id: "5.0.0-8", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[owf_group] ON
      """)
    }
    changeSet(author: "owf", id: "5.0.0-9", context: "sampleData, 5.0.0-sampleData") {
        comment(text="Add admin group")

        //insert admin group
        insert(tableName: "owf_group") {
            column(name: "id", valueNumeric: "191")

            column(name: "version", valueNumeric: "0")

            column(name: "status", value: "active")

            column(name: "description", value: "OWF Administrators")

            column(name: "name", value: "OWF Administrators")

            column(name: "display_name", value: "OWF Administrators")

            column(name: "automatic", valueBoolean: "true")
        }
    }
    changeSet(author: "owf", id: "5.0.0-10", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[owf_group] OFF
      """)
    }

    changeSet(author: "owf", id: "5.0.0-11", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[domain_mapping] ON
      """)
    }
// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
//    changeSet(author: "owf", id: "5.0.0-12", context: "sampleData, 5.0.0-sampleData") {
//        comment(text="Updating Sample Admin Dashboard to be in the admin group")
//
//        //make the admin dashboard a group dashboard
//        update(tableName:"dashboard") {
//            column(name:"user_id", value:"null")
//            where(text="id=150")
//        }
//
//        //update dashboard widget state
//        update(tableName:"dashboard_widget_state") {
//            column(name:"person_widget_definition_id", value:"null")
//            where(text="dashboard_id=150")
//        }
//
//        //assign to the admin group
//        insert(tableName: "domain_mapping") {
//            column(name: "id", valueNumeric: "192")
//
//            column(name: "version", valueNumeric: "0")
//
//            column(name: "src_id", valueNumeric: "191")
//
//            column(name: "src_type", value: "group")
//
//            column(name: "relationship_type", value: "owns")
//
//            column(name: "dest_id", valueNumeric: "150")
//
//            column(name: "dest_type", value: "dashboard")
//        }
//
//    }
    changeSet(author: "owf", id: "5.0.0-13", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
      """)
    }
    
    changeSet(author: "owf", id: "5.0.0-14", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[widget_definition] ON
        """)
    }
    
    changeSet(author: "owf", id: "5.0.0-15", context: "sampleData, 5.0.0-sampleData") {
        comment(text="insert new sample data")
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "172")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/channelShouter.gif")
            column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/channelShoutersm.gif")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "300")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "300")
            column(name: "widget_url", value: "examples/walkthrough/widgets/ColorServer.gsp")
            column(name: "widget_guid", value: "2410a41d-0bc9-cee6-2645-a89087da374f")
            column(name: "display_name", value: "Color Server")
            column(name: "background", valueBoolean: "false")
        }
        insert(tableName: "widget_definition") {
            column(name: "id", valueNumeric: "173")
            column(name: "version", valueNumeric: "0")
            column(name: "visible", valueBoolean: "true")
            column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/channelListener.gif")
            column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/channelListenersm.gif")
            column(name: "singleton", valueBoolean: "false")
            column(name: "width", valueNumeric: "300")
            column(name: "widget_version", value: "1.0")
            column(name: "height", valueNumeric: "300")
            column(name: "widget_url", value: "examples/walkthrough/widgets/ColorClient.gsp")
            column(name: "widget_guid", value: "4bc8e886-b576-3dac-015d-589b4813ceda")
            column(name: "display_name", value: "Color Client")
            column(name: "background", valueBoolean: "false")
        }
    }
    
    changeSet(author: "owf", id: "5.0.0-16", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[widget_definition] OFF
        """)
    }
    
    changeSet(author: "owf", id: "5.0.0-17", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[person_widget_definition] ON
        """)
    }
    
    changeSet(author: "owf", id: "5.0.0-18", context: "sampleData, 5.0.0-sampleData") {
        comment(text="insert new sample data")
        insert(tableName: "person_widget_definition") {
            column(name: "id", valueNumeric: "190")
            column(name: "version", valueNumeric: "0")
            column(name: "person_id", valueNumeric: "28")
            column(name: "visible", valueBoolean: "true")
            column(name: "pwd_position", valueNumeric: "16")
            column(name: "widget_definition_id", valueNumeric: "173")
        }
        insert(tableName: "person_widget_definition") {
            column(name: "id", valueNumeric: "191")
            column(name: "version", valueNumeric: "0")
            column(name: "person_id", valueNumeric: "1")
            column(name: "visible", valueBoolean: "true")
            column(name: "pwd_position", valueNumeric: "16")
            column(name: "widget_definition_id", valueNumeric: "173")
        }
        insert(tableName: "person_widget_definition") {
            column(name: "id", valueNumeric: "192")
            column(name: "version", valueNumeric: "0")
            column(name: "person_id", valueNumeric: "2")
            column(name: "visible", valueBoolean: "true")
            column(name: "pwd_position", valueNumeric: "16")
            column(name: "widget_definition_id", valueNumeric: "173")
        }
        insert(tableName: "person_widget_definition") {
            column(name: "id", valueNumeric: "193")
            column(name: "version", valueNumeric: "0")
            column(name: "person_id", valueNumeric: "3")
            column(name: "visible", valueBoolean: "true")
            column(name: "pwd_position", valueNumeric: "16")
            column(name: "widget_definition_id", valueNumeric: "173")
        }
        insert(tableName: "person_widget_definition") {
            column(name: "id", valueNumeric: "194")
            column(name: "version", valueNumeric: "0")
            column(name: "person_id", valueNumeric: "28")
            column(name: "visible", valueBoolean: "true")
            column(name: "pwd_position", valueNumeric: "17")
            column(name: "widget_definition_id", valueNumeric: "172")
        }
        insert(tableName: "person_widget_definition") {
            column(name: "id", valueNumeric: "195")
            column(name: "version", valueNumeric: "0")
            column(name: "person_id", valueNumeric: "1")
            column(name: "visible", valueBoolean: "true")
            column(name: "pwd_position", valueNumeric: "17")
            column(name: "widget_definition_id", valueNumeric: "172")
        }
        insert(tableName: "person_widget_definition") {
            column(name: "id", valueNumeric: "196")
            column(name: "version", valueNumeric: "0")
            column(name: "person_id", valueNumeric: "2")
            column(name: "visible", valueBoolean: "true")
            column(name: "pwd_position", valueNumeric: "17")
            column(name: "widget_definition_id", valueNumeric: "172")
        }
        insert(tableName: "person_widget_definition") {
            column(name: "id", valueNumeric: "197")
            column(name: "version", valueNumeric: "0")
            column(name: "person_id", valueNumeric: "3")
            column(name: "visible", valueBoolean: "true")
            column(name: "pwd_position", valueNumeric: "17")
            column(name: "widget_definition_id", valueNumeric: "172")
        }
    }
    
    changeSet(author: "owf", id: "5.0.0-19", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[person_widget_definition] OFF
        """)
    }
    
    changeSet(author: "owf", id: "5.0.0-20", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] ON
        """)
    }
    
    changeSet(author: "owf", id: "5.0.0-21", context: "sampleData, 5.0.0-sampleData") {
        comment(text="insert new sample data")
        insert(tableName: "domain_mapping") {
            column(name: "id", valueNumeric: "200")
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueNumeric: "191")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueNumeric: "170")
            column(name: "dest_type", value: "widget_definition")
        }
        insert(tableName: "domain_mapping") {
            column(name: "id", valueNumeric: "201")
            column(name: "version", valueNumeric: "0")
            column(name: "src_id", valueNumeric: "191")
            column(name: "src_type", value: "group")
            column(name: "relationship_type", value: "owns")
            column(name: "dest_id", valueNumeric: "171")
            column(name: "dest_type", value: "widget_definition")
        }
    }
    
    changeSet(author: "owf", id: "5.0.0-22", dbms:"mssql", context: "sampleData, 5.0.0-sampleData") {
        comment(text="allow identity inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
        """)
    }
        
    changeSet(author: "owf", id: "5.0.0-23", context: "sampleData, 5.0.0-sampleData") {
        comment(text="insert new sample data")
        insert(tableName: "widget_definition_widget_types") {
            column(name: "widget_definition_id", valueNumeric: "172")
            column(name: "widget_type_id", valueNumeric: "1")
        }
         insert(tableName: "widget_definition_widget_types") {
            column(name: "widget_definition_id", valueNumeric: "173")
            column(name: "widget_type_id", valueNumeric: "1")
        }
    }
    
}
