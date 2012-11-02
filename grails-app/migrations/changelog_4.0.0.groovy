databaseChangeLog = {

  //use 'upgrade' context for new change sets which change the schema or manipulating data related to a schema change
  //use 'sampleData' context to add new sample data
  //favor making database agnostic changeSets - however if needed the dbms attribute can be set to make a db specific changeset

// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
//  changeSet(author: "owf", id: "4.0.0-1", context: "upgrade, 4.0.0") {
//    comment(text="Updating Admin Widget Icons")
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"User Manager")
//      column(name:"image_url_large", value:"themes/common/images/admin/64x64_blue_user.png")
//      column(name:"image_url_small", value:"themes/common/images/admin/64x64_blue_user.png")
//      where(text="widget_url='admin/UserManagement.gsp'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"User Editor")
//      column(name:"image_url_large", value:"themes/common/images/admin/64x64_blue_user.png")
//      column(name:"image_url_small", value:"themes/common/images/admin/64x64_blue_user.png")
//      where(text="widget_url='admin/UserEdit.gsp'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget Manager")
//      column(name:"image_url_large", value:"themes/common/images/admin/64x64_blue_widget.png")
//      column(name:"image_url_small", value:"themes/common/images/admin/64x64_blue_widget.png")
//      where(text="widget_url='admin/WidgetManagement.gsp'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget Editor")
//      column(name:"image_url_large", value:"themes/common/images/admin/64x64_blue_widget.png")
//      column(name:"image_url_small", value:"themes/common/images/admin/64x64_blue_widget.png")
//      where(text="widget_url='admin/WidgetEdit.gsp'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Group Manager")
//      column(name:"image_url_large", value:"themes/common/images/admin/64x64_blue_group.png")
//      column(name:"image_url_small", value:"themes/common/images/admin/64x64_blue_group.png")
//      where(text="widget_url='admin/GroupManagement.gsp'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Group Editor")
//      column(name:"image_url_large", value:"themes/common/images/admin/64x64_blue_group.png")
//      column(name:"image_url_small", value:"themes/common/images/admin/64x64_blue_group.png")
//      where(text="widget_url='admin/GroupEdit.gsp'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Group Dashboard Manager")
//      column(name:"image_url_large", value:"themes/common/images/admin/64x64_blue_dashboard.png")
//      column(name:"image_url_small", value:"themes/common/images/admin/64x64_blue_dashboard.png")
//      where(text="widget_url='admin/GroupDashboardManagement.gsp'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Dashboard Editor")
//      column(name:"image_url_large", value:"themes/common/images/admin/64x64_blue_dashboard.png")
//      column(name:"image_url_small", value:"themes/common/images/admin/64x64_blue_dashboard.png")
//      where(text="widget_url='admin/DashboardEdit.gsp'")
//    }
//
//  }

// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
//  changeSet(author: "owf", id: "4.0.0-2", context: "sampleData, 4.0.0-sampleData") {
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget A")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/widgetA.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/widgetAsm.gif")
//      where(text="widget_url='examples/fake-widgets/widget-a.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget B")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/widgetB.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/widgetBsm.gif")
//      where(text="widget_url='examples/fake-widgets/widget-b.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget C")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/widgetC.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/widgetCsm.gif")
//      where(text="widget_url='examples/fake-widgets/widget-c.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget D")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/widgetD.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/widgetDsm.gif")
//      where(text="widget_url='examples/fake-widgets/widget-d.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget One")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/widget1.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/widget1sm.gif")
//      where(text="widget_url='examples/fake-widgets/widget-one.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget Two")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/widget2.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/widget2sm.gif")
//      where(text="widget_url='examples/fake-widgets/widget-two.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget Three")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/widget3.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/widget3sm.gif")
//      where(text="widget_url='examples/fake-widgets/widget-three.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget Four")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/widget4.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/widget4sm.gif")
//      where(text="widget_url='examples/fake-widgets/widget-four.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget Five")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/widget5.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/widget5sm.gif")
//      where(text="widget_url='examples/fake-widgets/widget-five.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Nearly Empty")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/nearlyEmpty.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/nearlyEmptysm.gif")
//      where(text="widget_url='examples/walkthrough/widgets/NearlyEmptyWidget.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Channel Shouter")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/channelShouter.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/channelShoutersm.gif")
//      where(text="widget_url='examples/walkthrough/widgets/ChannelShouter.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Channel Listener")
//      column(name:"image_url_large", value:"themes/common/images/blue/icons/widgetIcons/channelListener.gif")
//      column(name:"image_url_small", value:"themes/common/images/blue/icons/widgetContainer/channelListenersm.gif")
//      where(text="widget_url='examples/walkthrough/widgets/ChannelListener.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget Chrome")
//      column(name:"image_url_large", value:"examples/walkthrough/images/chromeWiget_black_icon.png")
//      column(name:"image_url_small", value:"examples/walkthrough/images/chromeWiget_blue_icon.png")
//      where(text="widget_url='examples/walkthrough/widgets/WidgetChrome.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Event Monitor Widget")
//      column(name:"image_url_large", value:"examples/walkthrough/images/event_monitor_black_icon.png")
//      column(name:"image_url_small", value:"examples/walkthrough/images/event_monitor_blue_icon.png")
//      where(text="widget_url='examples/walkthrough/widgets/EventMonitor.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Widget Log")
//      column(name:"image_url_large", value:"examples/walkthrough/images/log_icon.png")
//      column(name:"image_url_small", value:"examples/walkthrough/images/log_icon_blue.png")
//      where(text="widget_url='examples/walkthrough/widgets/WidgetLog.html'")
//    }
//
//    update(tableName:"widget_definition") {
//      column(name:"display_name", value:"Preferences Widget")
//      column(name:"image_url_large", value:"examples/walkthrough/images/testpref_black_icon.png")
//      column(name:"image_url_small", value:"examples/walkthrough/images/testpref_blue_icon.png")
//      where(text="widget_url='examples/walkthrough/widgets/Preferences.html'")
//    }
//  }
  
  //Added defaultSettings column into Dashboard Table
  changeSet(author: "owf", id: "4.0.0-3", context: "create, upgrade, 4.0.0") {
      comment(text="Added defaultSettings column into Dashboard Table")
	  addColumn(tableName: "dashboard"){
		  column(name: "default_settings", type: "clob")
	  }
  }

  changeSet(author: "owf", id: "4.0.0-4", context: "create, upgrade, 4.0.0") {
      comment(text="Added background column for WidgetDefinition")
	  addColumn(tableName: "widget_definition"){
		  column(name: "background", type: "boolean", valueBoolean: "false")
	  }
  }

  changeSet(author: "owf", id: "4.0.0-5", dbms: "postgresql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="deleting old sample data")

      delete(tableName: "role_people")
      delete(tableName: "role")
      delete(tableName: "requestmap")
      delete(tableName: "preference")
      delete(tableName: "owf_group_people")
	  // DEPRECATED delete as of 7.0.0 where dashboard_widget_state table is removed.
      // delete(tableName: "dashboard_widget_state")
      delete(tableName: "person_widget_definition")
      delete(tableName: "domain_mapping")
      delete(tableName: "dashboard")
      delete(tableName: "owf_group") {
          where(text="not stack_default")
      }
      delete(tableName: "widget_definition")
      delete(tableName: "person")
  }
  
    changeSet(author: "owf", id: "4.0.0-5", dbms: "mysql,mssql,oracle", context: "sampleData, 4.0.0-sampleData") {
      comment(text="deleting old sample data")

      delete(tableName: "role_people")
      delete(tableName: "role")
      delete(tableName: "requestmap")
      delete(tableName: "preference")
      delete(tableName: "owf_group_people")
	  // DEPRECATED delete as of 7.0.0 where dashboard_widget_state table is removed.
      // delete(tableName: "dashboard_widget_state")
      delete(tableName: "person_widget_definition")
      delete(tableName: "domain_mapping")
      delete(tableName: "dashboard")
      delete(tableName: "owf_group") {
          where(text="stack_default=0")
      }
      delete(tableName: "widget_definition")
      delete(tableName: "person")
  }

  changeSet(author: "owf", id: "4.0.0-5", dbms: "hsqldb", context: "sampleData, 4.0.0-sampleData") {
      comment(text="deleting old sample data")

      delete(tableName: "role_people")
      //for some reason hsqldb will fail if the role table is not all caps
      delete(tableName: "ROLE")
      delete(tableName: "requestmap")
      delete(tableName: "preference")
      delete(tableName: "owf_group_people")
      // DEPRECATED delete as of 7.0.0 where dashboard_widget_state table is removed.
      // delete(tableName: "dashboard_widget_state")
      delete(tableName: "person_widget_definition")
      delete(tableName: "domain_mapping")
      delete(tableName: "dashboard")
      delete(tableName: "owf_group") {
          where(text="stack_default=0")
      }
      delete(tableName: "widget_definition")
      delete(tableName: "person")
  }

  changeSet(author: "owf", id: "4.0.0-6", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[person] ON
    """)
  }
  changeSet(author: "owf", id: "4.0.0-7", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
      insert(tableName:"person") {
        column(name:"id", valueNumeric:"1")
        column(name:"version", valueNumeric:"0")
        column(name:"enabled", valueBoolean:"true")
        column(name:"user_real_name", value:"Test Admin 1")
        column(name:"username", value:"testAdmin1")
        column(name:"email_show", valueBoolean:"false")
        column(name:"email", value:"testAdmin1@ozone3.test")
        column(name:"description", value:"Test Administrator 1")
      }
      insert(tableName:"person") {
        column(name:"id", valueNumeric:"2")
        column(name:"version", valueNumeric:"0")
        column(name:"enabled", valueBoolean:"true")
        column(name:"user_real_name", value:"Test User 1")
        column(name:"username", value:"testUser1")
        column(name:"email_show", valueBoolean:"false")
        column(name:"email", value:"testUser1@ozone3.test")
        column(name:"description", value:"Test User 1")
      }
      insert(tableName:"person") {
        column(name:"id", valueNumeric:"3")
        column(name:"version", valueNumeric:"0")
        column(name:"enabled", valueBoolean:"true")
        column(name:"user_real_name", value:"Test User 2")
        column(name:"username", value:"testUser2")
        column(name:"email_show", valueBoolean:"false")
        column(name:"email", value:"testUser1@ozone3.test")
        column(name:"description", value:"Test User 2")
      }
      insert(tableName:"person") {
        column(name:"id", valueNumeric:"28")
        column(name:"version", valueNumeric:"0")
        column(name:"enabled", valueBoolean:"true")
        column(name:"user_real_name", value:"DEFAULT_USER")
        column(name:"username", value:"DEFAULT_USER")
        column(name:"email_show", valueBoolean:"false")
      }
  }
  changeSet(author: "owf", id: "4.0.0-8", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[person] OFF
    """)
  }

  changeSet(author: "owf", id: "4.0.0-9", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[widget_definition] ON
    """)
  }

  changeSet(author: "owf", id: "4.0.0-10", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "6")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widgetA.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widgetAsm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "615")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "565")

			column(name: "widget_url", value: "examples/fake-widgets/widget-a.html")

			column(name: "widget_guid", value: "ea5435cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Widget A")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "7")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widgetB.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widgetBsm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "565")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "635")

			column(name: "widget_url", value: "examples/fake-widgets/widget-b.html")

			column(name: "widget_guid", value: "fb5435cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Widget B")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "8")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widgetC.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widgetCsm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "980")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "740")

			column(name: "widget_url", value: "examples/fake-widgets/widget-c.html")

			column(name: "widget_guid", value: "0c5435cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Widget C")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "9")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widgetD.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widgetDsm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "630")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "525")

			column(name: "widget_url", value: "examples/fake-widgets/widget-d.html")

			column(name: "widget_guid", value: "1d5435cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Widget D")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "10")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widget1.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widget1sm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "625")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "405")

			column(name: "widget_url", value: "examples/fake-widgets/widget-one.html")

			column(name: "widget_guid", value: "d6543ccf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Widget One")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "11")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widget2.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widget2sm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "610")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "635")

			column(name: "widget_url", value: "examples/fake-widgets/widget-two.html")

			column(name: "widget_guid", value: "e65431cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Widget Two")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "12")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widget3.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widget3sm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "630")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "540")

			column(name: "widget_url", value: "examples/fake-widgets/widget-three.html")

			column(name: "widget_guid", value: "a65432cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Widget Three")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "13")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widget4.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widget4sm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "675")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "350")

			column(name: "widget_url", value: "examples/fake-widgets/widget-four.html")

			column(name: "widget_guid", value: "b65434cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Widget Four")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "14")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/widget5.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/widget5sm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "615")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "630")

			column(name: "widget_url", value: "examples/fake-widgets/widget-five.html")

			column(name: "widget_guid", value: "c65435cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Widget Five")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "15")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/nearlyEmpty.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/nearlyEmptysm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "540")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "440")

			column(name: "widget_url", value: "examples/walkthrough/widgets/NearlyEmptyWidget.html")

			column(name: "widget_guid", value: "bc5435cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Nearly Empty")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "16")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/channelShouter.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/channelShoutersm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "295")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "250")

			column(name: "widget_url", value: "examples/walkthrough/widgets/ChannelShouter.html")

			column(name: "widget_guid", value: "eb5435cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Channel Shouter")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "17")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "themes/common/images/blue/icons/widgetIcons/channelListener.gif")

			column(name: "image_url_small", value: "themes/common/images/blue/icons/widgetContainer/channelListenersm.gif")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "540")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "440")

			column(name: "widget_url", value: "examples/walkthrough/widgets/ChannelListener.html")

			column(name: "widget_guid", value: "ec5435cf-4021-4f2a-ba69-dde451d12551")

			column(name: "display_name", value: "Channel Listener")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "18")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "examples/walkthrough/images/chromeWiget_black_icon.png")

			column(name: "image_url_small", value: "examples/walkthrough/images/chromeWiget_blue_icon.png")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "540")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "440")

			column(name: "widget_url", value: "examples/walkthrough/widgets/WidgetChrome.html")

			column(name: "widget_guid", value: "e8687289-f595-4b6d-9911-c714b483509d")

			column(name: "display_name", value: "Widget Chrome")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "19")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "examples/walkthrough/images/event_monitor_black_icon.png")

			column(name: "image_url_small", value: "examples/walkthrough/images/event_monitor_blue_icon.png")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "500")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "600")

			column(name: "widget_url", value: "examples/walkthrough/widgets/EventMonitor.html")

			column(name: "widget_guid", value: "9d2e5f85-e199-4c6a-be31-4c6954206687")

			column(name: "display_name", value: "Event Monitor Widget")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "20")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "examples/walkthrough/images/log_icon.png")

			column(name: "image_url_small", value: "examples/walkthrough/images/log_icon_blue.png")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "540")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "440")

			column(name: "widget_url", value: "examples/walkthrough/widgets/WidgetLog.html")

			column(name: "widget_guid", value: "4854fbd4-395c-442b-95c6-8b60702fd2b4")

			column(name: "display_name", value: "Widget Log")

			column(name: "background", valueBoolean: "false")
		}

		insert(tableName: "widget_definition") {
			column(name: "id", valueNumeric: "21")

			column(name: "version", valueNumeric: "0")

			column(name: "visible", valueBoolean: "true")

			column(name: "image_url_large", value: "examples/walkthrough/images/testpref_black_icon.png")

			column(name: "image_url_small", value: "examples/walkthrough/images/testpref_blue_icon.png")

			column(name: "singleton", valueBoolean: "false")

			column(name: "width", valueNumeric: "450")

			column(name: "widget_version", value: "1.0")

			column(name: "height", valueNumeric: "300")

			column(name: "widget_url", value: "examples/walkthrough/widgets/Preferences.html")

			column(name: "widget_guid", value: "920b7cc1-dd37-46ac-8457-afda62613e56")

			column(name: "display_name", value: "Preferences Widget")

			column(name: "background", valueBoolean: "false")
		}

    //admin widgets
    insert(tableName: "widget_definition") {
        column(name: "id", valueNumeric: "151")

        column(name: "version", valueNumeric: "0")

        column(name: "visible", valueBoolean: "true")

        column(name: "image_url_large", value: "themes/common/images/admin/64x64_blue_user.png")

        column(name: "image_url_small", value: "themes/common/images/admin/64x64_blue_user.png")

        column(name: "singleton", valueBoolean: "false")

        column(name: "width", valueNumeric: "818")

        column(name: "widget_version", value: "1.0")

        column(name: "height", valueNumeric: "440")

        column(name: "widget_url", value: "admin/UserManagement.gsp")

        column(name: "widget_guid", value: "b3b1d04f-97c2-4726-9575-82bb1cf1af6a")

        column(name: "display_name", value: "Users")

        column(name: "background", valueBoolean: "false")
    }

    insert(tableName: "widget_definition") {
        column(name: "id", valueNumeric: "154")

        column(name: "version", valueNumeric: "0")

        column(name: "visible", valueBoolean: "false")

        column(name: "image_url_large", value: "themes/common/images/admin/64x64_blue_user.png")

        column(name: "image_url_small", value: "themes/common/images/admin/64x64_blue_user.png")

        column(name: "singleton", valueBoolean: "false")

        column(name: "width", valueNumeric: "581")

        column(name: "widget_version", value: "1.0")

        column(name: "height", valueNumeric: "440")

        column(name: "widget_url", value: "admin/UserEdit.gsp")

        column(name: "widget_guid", value: "101f119e-b56a-4e16-8219-11048c020038")

        column(name: "display_name", value: "User Editor")

        column(name: "background", valueBoolean: "false")
    }

    insert(tableName: "widget_definition") {
        column(name: "id", valueNumeric: "156")

        column(name: "version", valueNumeric: "0")

        column(name: "visible", valueBoolean: "true")

        column(name: "image_url_large", value: "themes/common/images/admin/64x64_blue_widget.png")

        column(name: "image_url_small", value: "themes/common/images/admin/64x64_blue_widget.png")

        column(name: "singleton", valueBoolean: "false")

        column(name: "width", valueNumeric: "818")

        column(name: "widget_version", value: "1.0")

        column(name: "height", valueNumeric: "440")

        column(name: "widget_url", value: "admin/WidgetManagement.gsp")

        column(name: "widget_guid", value: "412ec70d-a178-41ae-a8d9-6713a430c87c")

        column(name: "display_name", value: "Widgets")

        column(name: "background", valueBoolean: "false")
    }

    insert(tableName: "widget_definition") {
        column(name: "id", valueNumeric: "158")

        column(name: "version", valueNumeric: "0")

        column(name: "visible", valueBoolean: "false")

        column(name: "image_url_large", value: "themes/common/images/admin/64x64_blue_widget.png")

        column(name: "image_url_small", value: "themes/common/images/admin/64x64_blue_widget.png")

        column(name: "singleton", valueBoolean: "false")

        column(name: "width", valueNumeric: "581")

        column(name: "widget_version", value: "1.0")

        column(name: "height", valueNumeric: "493")

        column(name: "widget_url", value: "admin/WidgetEdit.gsp")

        column(name: "widget_guid", value: "6cf4f84a-cc89-45ba-9577-15c34f66ee9c")

        column(name: "display_name", value: "Widget Editor")

        column(name: "background", valueBoolean: "false")
    }

    insert(tableName: "widget_definition") {
        column(name: "id", valueNumeric: "160")

        column(name: "version", valueNumeric: "0")

        column(name: "visible", valueBoolean: "true")

        column(name: "image_url_large", value: "themes/common/images/admin/64x64_blue_group.png")

        column(name: "image_url_small", value: "themes/common/images/admin/64x64_blue_group.png")

        column(name: "singleton", valueBoolean: "false")

        column(name: "width", valueNumeric: "818")

        column(name: "widget_version", value: "1.0")

        column(name: "height", valueNumeric: "440")

        column(name: "widget_url", value: "admin/GroupManagement.gsp")

        column(name: "widget_guid", value: "b87c4a3e-aa1e-499e-ba10-510f35388bb6")

        column(name: "display_name", value: "Groups")

        column(name: "background", valueBoolean: "false")
    }

    insert(tableName: "widget_definition") {
        column(name: "id", valueNumeric: "163")

        column(name: "version", valueNumeric: "0")

        column(name: "visible", valueBoolean: "false")

        column(name: "image_url_large", value: "themes/common/images/admin/64x64_blue_group.png")

        column(name: "image_url_small", value: "themes/common/images/admin/64x64_blue_group.png")

        column(name: "singleton", valueBoolean: "false")

        column(name: "width", valueNumeric: "581")

        column(name: "widget_version", value: "1.0")

        column(name: "height", valueNumeric: "440")

        column(name: "widget_url", value: "admin/GroupEdit.gsp")

        column(name: "widget_guid", value: "d6ce3375-6e89-45ab-a7be-b6cf3abb0e8c")

        column(name: "display_name", value: "Group Editor")

        column(name: "background", valueBoolean: "false")
    }

    insert(tableName: "widget_definition") {
        column(name: "id", valueNumeric: "166")

        column(name: "version", valueNumeric: "0")

        column(name: "visible", valueBoolean: "true")

        column(name: "image_url_large", value: "themes/common/images/admin/64x64_blue_dashboard.png")

        column(name: "image_url_small", value: "themes/common/images/admin/64x64_blue_dashboard.png")

        column(name: "singleton", valueBoolean: "false")

        column(name: "width", valueNumeric: "818")

        column(name: "widget_version", value: "1.0")

        column(name: "height", valueNumeric: "440")

        column(name: "widget_url", value: "admin/GroupDashboardManagement.gsp")

        column(name: "widget_guid", value: "9d804b74-b2a6-448a-bd04-fe286905ab8f")

        column(name: "display_name", value: "Group Dashboards")

        column(name: "background", valueBoolean: "false")
    }

    insert(tableName: "widget_definition") {
        column(name: "id", valueNumeric: "170")

        column(name: "version", valueNumeric: "0")

        column(name: "visible", valueBoolean: "false")

        column(name: "image_url_large", value: "themes/common/images/admin/64x64_blue_dashboard.png")

        column(name: "image_url_small", value: "themes/common/images/admin/64x64_blue_dashboard.png")

        column(name: "singleton", valueBoolean: "false")

        column(name: "width", valueNumeric: "581")

        column(name: "widget_version", value: "1.0")

        column(name: "height", valueNumeric: "440")

        column(name: "widget_url", value: "admin/DashboardEdit.gsp")

        column(name: "widget_guid", value: "a540f672-a34c-4989-962c-dcbd559c3792")

        column(name: "display_name", value: "Dashboard Editor")

        column(name: "background", valueBoolean: "false")
    }

  }
  changeSet(author: "owf", id: "4.0.0-11", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[widget_definition] OFF
    """)
  }

  changeSet(author: "owf", id: "4.0.0-12", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[person_widget_definition] ON
    """)
  }
  changeSet(author: "owf", id: "4.0.0-13", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "29")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "0")

        column(name: "widget_definition_id", valueNumeric: "6")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "30")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "7")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "31")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "2")

        column(name: "widget_definition_id", valueNumeric: "8")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "32")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "3")

        column(name: "widget_definition_id", valueNumeric: "9")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "33")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "4")

        column(name: "widget_definition_id", valueNumeric: "10")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "34")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "5")

        column(name: "widget_definition_id", valueNumeric: "11")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "35")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "6")

        column(name: "widget_definition_id", valueNumeric: "12")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "36")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "7")

        column(name: "widget_definition_id", valueNumeric: "13")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "37")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "8")

        column(name: "widget_definition_id", valueNumeric: "14")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "38")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "9")

        column(name: "widget_definition_id", valueNumeric: "15")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "39")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "10")

        column(name: "widget_definition_id", valueNumeric: "16")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "40")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "11")

        column(name: "widget_definition_id", valueNumeric: "17")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "41")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "12")

        column(name: "widget_definition_id", valueNumeric: "18")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "42")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "13")

        column(name: "widget_definition_id", valueNumeric: "19")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "43")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "14")

        column(name: "widget_definition_id", valueNumeric: "20")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "44")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "15")

        column(name: "widget_definition_id", valueNumeric: "21")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "45")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "0")

        column(name: "widget_definition_id", valueNumeric: "6")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "46")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "7")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "47")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "2")

        column(name: "widget_definition_id", valueNumeric: "8")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "48")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "3")

        column(name: "widget_definition_id", valueNumeric: "9")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "49")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "4")

        column(name: "widget_definition_id", valueNumeric: "10")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "50")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "5")

        column(name: "widget_definition_id", valueNumeric: "11")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "51")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "6")

        column(name: "widget_definition_id", valueNumeric: "12")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "52")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "7")

        column(name: "widget_definition_id", valueNumeric: "13")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "53")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "8")

        column(name: "widget_definition_id", valueNumeric: "14")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "54")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "9")

        column(name: "widget_definition_id", valueNumeric: "15")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "55")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "10")

        column(name: "widget_definition_id", valueNumeric: "16")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "56")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "11")

        column(name: "widget_definition_id", valueNumeric: "17")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "57")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "12")

        column(name: "widget_definition_id", valueNumeric: "18")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "58")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "13")

        column(name: "widget_definition_id", valueNumeric: "19")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "59")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "14")

        column(name: "widget_definition_id", valueNumeric: "20")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "60")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "2")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "15")

        column(name: "widget_definition_id", valueNumeric: "21")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "61")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "0")

        column(name: "widget_definition_id", valueNumeric: "6")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "62")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "7")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "63")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "2")

        column(name: "widget_definition_id", valueNumeric: "8")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "64")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "3")

        column(name: "widget_definition_id", valueNumeric: "9")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "65")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "4")

        column(name: "widget_definition_id", valueNumeric: "10")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "66")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "5")

        column(name: "widget_definition_id", valueNumeric: "11")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "67")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "6")

        column(name: "widget_definition_id", valueNumeric: "12")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "68")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "7")

        column(name: "widget_definition_id", valueNumeric: "13")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "69")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "8")

        column(name: "widget_definition_id", valueNumeric: "14")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "70")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "9")

        column(name: "widget_definition_id", valueNumeric: "15")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "71")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "10")

        column(name: "widget_definition_id", valueNumeric: "16")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "72")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "11")

        column(name: "widget_definition_id", valueNumeric: "17")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "73")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "12")

        column(name: "widget_definition_id", valueNumeric: "18")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "74")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "13")

        column(name: "widget_definition_id", valueNumeric: "19")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "75")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "14")

        column(name: "widget_definition_id", valueNumeric: "20")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "76")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "3")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "15")

        column(name: "widget_definition_id", valueNumeric: "21")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "77")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "0")

        column(name: "widget_definition_id", valueNumeric: "6")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "78")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "7")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "79")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "2")

        column(name: "widget_definition_id", valueNumeric: "8")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "80")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "3")

        column(name: "widget_definition_id", valueNumeric: "9")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "81")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "4")

        column(name: "widget_definition_id", valueNumeric: "10")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "82")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "5")

        column(name: "widget_definition_id", valueNumeric: "11")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "83")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "6")

        column(name: "widget_definition_id", valueNumeric: "12")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "84")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "7")

        column(name: "widget_definition_id", valueNumeric: "13")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "85")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "8")

        column(name: "widget_definition_id", valueNumeric: "14")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "86")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "9")

        column(name: "widget_definition_id", valueNumeric: "15")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "87")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "10")

        column(name: "widget_definition_id", valueNumeric: "16")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "88")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "11")

        column(name: "widget_definition_id", valueNumeric: "17")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "89")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "12")

        column(name: "widget_definition_id", valueNumeric: "18")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "90")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "13")

        column(name: "widget_definition_id", valueNumeric: "19")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "91")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "14")

        column(name: "widget_definition_id", valueNumeric: "20")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "92")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "28")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "15")

        column(name: "widget_definition_id", valueNumeric: "21")
    }

    //admin widget mappings
    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "174")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "151")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "177")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "154")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "179")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "156")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "181")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "158")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "183")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "160")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "185")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "163")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "187")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "166")
    }

    insert(tableName: "person_widget_definition") {
        column(name: "id", valueNumeric: "189")

        column(name: "version", valueNumeric: "0")

        column(name: "person_id", valueNumeric: "1")

        column(name: "visible", valueBoolean: "true")

        column(name: "pwd_position", valueNumeric: "1")

        column(name: "widget_definition_id", valueNumeric: "170")
    }

  }
  changeSet(author: "owf", id: "4.0.0-14", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[person_widget_definition] OFF
    """)
  }

  changeSet(author: "owf", id: "4.0.0-15", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[dashboard] ON
    """)
  }
  
// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
//  changeSet(author: "owf", id: "4.0.0-16", context: "sampleData, 4.0.0-sampleData") {
//      comment(text="insert new sample data")
//
//    //sample dashboard for
//    insert(tableName: "dashboard") {
//        column(name: "id", valueNumeric: "101")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "isdefault", valueBoolean: "true")
//
//        column(name: "dashboard_position", valueNumeric: "1")
//
//        column(name: "altered_by_admin", valueBoolean: "false")
//
//        column(name: "guid", value: "917b4cd0-ecbd-410b-afd9-42d150c26426")
//
//        column(name: "column_count", valueNumeric: "0")
//
//        column(name: "layout", value: "desktop")
//
//        column(name: "name", value: "Sample")
//
//        column(name: "user_id", valueNumeric: "1")
//
//        column(name: "description")
//
//        column(name: "created_by_id")
//
//        column(name: "created_date")
//
//        column(name: "edited_by_id")
//
//        column(name: "edited_date")
//
//        column(name: "default_settings")
//    }
//
//    insert(tableName: "dashboard") {
//        column(name: "id", valueNumeric: "117")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "isdefault", valueBoolean: "true")
//
//        column(name: "dashboard_position", valueNumeric: "1")
//
//        column(name: "altered_by_admin", valueBoolean: "true")
//
//        column(name: "guid", value: "6f1d0c3e-821a-41ca-ac1b-ed72186bbb53")
//
//        column(name: "column_count", valueNumeric: "0")
//
//        column(name: "layout", value: "desktop")
//
//        column(name: "name", value: "Sample")
//
//        column(name: "user_id", valueNumeric: "2")
//
//        column(name: "description")
//
//        column(name: "created_by_id")
//
//        column(name: "created_date")
//
//        column(name: "edited_by_id")
//
//        column(name: "edited_date")
//
//        column(name: "default_settings")
//    }
//
//    insert(tableName: "dashboard") {
//        column(name: "id", valueNumeric: "133")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "isdefault", valueBoolean: "true")
//
//        column(name: "dashboard_position", valueNumeric: "1")
//
//        column(name: "altered_by_admin", valueBoolean: "false")
//
//        column(name: "guid", value: "985dee86-acf5-4f35-abc1-362ca60b39b8")
//
//        column(name: "column_count", valueNumeric: "0")
//
//        column(name: "layout", value: "desktop")
//
//        column(name: "name", value: "Sample")
//
//        column(name: "user_id", valueNumeric: "3")
//
//        column(name: "description")
//
//        column(name: "created_by_id")
//
//        column(name: "created_date")
//
//        column(name: "edited_by_id")
//
//        column(name: "edited_date")
//
//        column(name: "default_settings")
//    }
//
//    //sample admin dashboard
//    insert(tableName: "dashboard") {
//        column(name: "id", valueNumeric: "150")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "isdefault", valueBoolean: "false")
//
//        column(name: "dashboard_position", valueNumeric: "2")
//
//        column(name: "altered_by_admin", valueBoolean: "false")
//
//        column(name: "guid", value: "05202a4a-ced5-b014-ec8c-5f942b0e8030")
//
//        column(name: "column_count", valueNumeric: "0")
//
//        column(name: "layout", value: "desktop")
//
//        column(name: "name", value: "Administration")
//
//        column(name: "user_id", valueNumeric: "1")
//
//        column(name: "description")
//
//        column(name: "created_by_id")
//
//        column(name: "created_date")
//
//        column(name: "edited_by_id")
//
//        column(name: "edited_date")
//
//      column(name: "default_settings", value: """
//        {
//           "widgetStates" :
//              {
//                 "b3b1d04f-97c2-4726-9575-82bb1cf1af6a" :
//                    {
//                       "x" : 20,
//                       "y" : 20,
//                       "height" : 382,
//                       "width" : 559,
//                       "columnPos" : 0
//                    },
//                 "412ec70d-a178-41ae-a8d9-6713a430c87c" :
//                    {
//                       "x" : 619,
//                       "y" : 20,
//                       "height" : 382,
//                       "width" : 559,
//                       "columnPos" : 0
//                    },
//                 "b87c4a3e-aa1e-499e-ba10-510f35388bb6" :
//                    {
//                       "x" : 20,
//                       "y" : 442,
//                       "height" : 382,
//                       "width" : 559,
//                       "columnPos" : 0
//                    },
//                 "9d804b74-b2a6-448a-bd04-fe286905ab8f" :
//                    {
//                       "x" : 619,
//                       "y" : 442,
//                       "height" : 382,
//                       "width" : 559,
//                       "columnPos" : 0
//                    },
//                 "101f119e-b56a-4e16-8219-11048c020038" :
//                    {
//                       "x" : 40,
//                       "y" : 40,
//                       "height" : 382,
//                       "width" : 559,
//                       "columnPos" : 0
//                    },
//                 "6cf4f84a-cc89-45ba-9577-15c34f66ee9c" :
//                    {
//                       "x" : 639,
//                       "y" : 40,
//                       "height" : 382,
//                       "width" : 559,
//                       "columnPos" : 0
//                    },
//                 "d6ce3375-6e89-45ab-a7be-b6cf3abb0e8c" :
//                    {
//                       "x" : 40,
//                       "y" : 462,
//                       "height" : 382,
//                       "width" : 559,
//                       "columnPos" : 0
//                    },
//                 "a540f672-a34c-4989-962c-dcbd559c3792" :
//                    {
//                       "x" : 639,
//                       "y" : 462,
//                       "height" : 382,
//                       "width" : 559,
//                       "columnPos" : 0
//                    }
//              }
//        }
//      """)
//    }
//
//  }
  
  changeSet(author: "owf", id: "4.0.0-17", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[dashboard] OFF
    """)
  }

  // DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
  // changeSet(author: "owf", id: "4.0.0-18", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
  //     comment(text="allow identity inserts")
  //   sql ( text = """
  //     SET IDENTITY_INSERT [dbo].[dashboard_widget_state] ON
  //   """)
  // }

// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
//  changeSet(author: "owf", id: "4.0.0-19", context: "sampleData, 4.0.0-sampleData") {
//      comment(text="insert new sample data")
//    insert(tableName: "dashboard_widget_state") {
//        column(name: "id", valueNumeric: "102")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "region", value: "none")
//
//        column(name: "button_opened", valueBoolean: "false")
//
//        column(name: "z_index", valueNumeric: "100")
//
//        column(name: "person_widget_definition_id", valueNumeric: "33")
//
//        column(name: "minimized", valueBoolean: "false")
//
//        column(name: "unique_id", value: "83958046-e409-4d56-a03b-09b5a3ec8399")
//
//        column(name: "height", valueNumeric: "405")
//
//        column(name: "pinned", valueBoolean: "false")
//
//        column(name: "name", value: "Widget One")
//
//        column(name: "widget_guid")
//
//        column(name: "column_pos", valueNumeric: "0")
//
//        column(name: "width", valueNumeric: "625")
//
//        column(name: "button_id")
//
//        column(name: "collapsed", valueBoolean: "false")
//
//        column(name: "maximized", valueBoolean: "false")
//
//        column(name: "state_position", valueNumeric: "0")
//
//        column(name: "active", valueBoolean: "false")
//
//        column(name: "dashboard_id", valueNumeric: "101")
//
//        column(name: "y", valueNumeric: "200")
//
//        column(name: "x", valueNumeric: "200")
//    }
//    insert(tableName: "dashboard_widget_state") {
//        column(name: "id", valueNumeric: "103")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "region", value: "none")
//
//        column(name: "button_opened", valueBoolean: "false")
//
//        column(name: "z_index", valueNumeric: "200")
//
//        column(name: "person_widget_definition_id", valueNumeric: "34")
//
//        column(name: "minimized", valueBoolean: "false")
//
//        column(name: "unique_id", value: "7ea1fdd4-8b0d-47c6-a62a-326a6df9cc0c")
//
//        column(name: "height", valueNumeric: "635")
//
//        column(name: "pinned", valueBoolean: "false")
//
//        column(name: "name", value: "Widget Two")
//
//        column(name: "widget_guid")
//
//        column(name: "column_pos", valueNumeric: "0")
//
//        column(name: "width", valueNumeric: "610")
//
//        column(name: "button_id")
//
//        column(name: "collapsed", valueBoolean: "false")
//
//        column(name: "maximized", valueBoolean: "false")
//
//        column(name: "state_position", valueNumeric: "1")
//
//        column(name: "active", valueBoolean: "true")
//
//        column(name: "dashboard_id", valueNumeric: "101")
//
//        column(name: "y", valueNumeric: "250")
//
//        column(name: "x", valueNumeric: "250")
//    }
//    insert(tableName: "dashboard_widget_state") {
//        column(name: "id", valueNumeric: "104")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "region", value: "none")
//
//        column(name: "button_opened", valueBoolean: "false")
//
//        column(name: "z_index", valueNumeric: "222")
//
//        column(name: "person_widget_definition_id", valueNumeric: "35")
//
//        column(name: "minimized", valueBoolean: "false")
//
//        column(name: "unique_id", value: "ce8ee71f-ce79-4845-afbf-18a0a875a56e")
//
//        column(name: "height", valueNumeric: "540")
//
//        column(name: "pinned", valueBoolean: "false")
//
//        column(name: "name", value: "Widget Three")
//
//        column(name: "widget_guid")
//
//        column(name: "column_pos", valueNumeric: "0")
//
//        column(name: "width", valueNumeric: "630")
//
//        column(name: "button_id")
//
//        column(name: "collapsed", valueBoolean: "false")
//
//        column(name: "maximized", valueBoolean: "false")
//
//        column(name: "state_position", valueNumeric: "2")
//
//        column(name: "active", valueBoolean: "false")
//
//        column(name: "dashboard_id", valueNumeric: "101")
//
//        column(name: "y", valueNumeric: "300")
//
//        column(name: "x", valueNumeric: "300")
//    }
//
//    insert(tableName: "dashboard_widget_state") {
//        column(name: "id", valueNumeric: "118")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "region", value: "none")
//
//        column(name: "button_opened", valueBoolean: "false")
//
//        column(name: "z_index", valueNumeric: "100")
//
//        column(name: "person_widget_definition_id", valueNumeric: "49")
//
//        column(name: "minimized", valueBoolean: "false")
//
//        column(name: "unique_id", value: "5ea660a2-936b-4210-83db-f9d6381dc818")
//
//        column(name: "height", valueNumeric: "405")
//
//        column(name: "pinned", valueBoolean: "false")
//
//        column(name: "name", value: "Widget One")
//
//        column(name: "widget_guid")
//
//        column(name: "column_pos", valueNumeric: "0")
//
//        column(name: "width", valueNumeric: "625")
//
//        column(name: "button_id")
//
//        column(name: "collapsed", valueBoolean: "false")
//
//        column(name: "maximized", valueBoolean: "false")
//
//        column(name: "state_position", valueNumeric: "0")
//
//        column(name: "active", valueBoolean: "false")
//
//        column(name: "dashboard_id", valueNumeric: "117")
//
//        column(name: "y", valueNumeric: "200")
//
//        column(name: "x", valueNumeric: "200")
//    }
//
//    insert(tableName: "dashboard_widget_state") {
//        column(name: "id", valueNumeric: "119")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "region", value: "none")
//
//        column(name: "button_opened", valueBoolean: "false")
//
//        column(name: "z_index", valueNumeric: "200")
//
//        column(name: "person_widget_definition_id", valueNumeric: "50")
//
//        column(name: "minimized", valueBoolean: "false")
//
//        column(name: "unique_id", value: "20b21563-e731-4688-8146-758852361d00")
//
//        column(name: "height", valueNumeric: "635")
//
//        column(name: "pinned", valueBoolean: "false")
//
//        column(name: "name", value: "Widget Two")
//
//        column(name: "widget_guid")
//
//        column(name: "column_pos", valueNumeric: "0")
//
//        column(name: "width", valueNumeric: "610")
//
//        column(name: "button_id")
//
//        column(name: "collapsed", valueBoolean: "false")
//
//        column(name: "maximized", valueBoolean: "false")
//
//        column(name: "state_position", valueNumeric: "1")
//
//        column(name: "active", valueBoolean: "true")
//
//        column(name: "dashboard_id", valueNumeric: "117")
//
//        column(name: "y", valueNumeric: "250")
//
//        column(name: "x", valueNumeric: "250")
//    }
//
//    insert(tableName: "dashboard_widget_state") {
//        column(name: "id", valueNumeric: "120")
//
//        column(name: "version", valueNumeric: "0")
//
//        column(name: "region", value: "none")
//
//        column(name: "button_opened", valueBoolean: "false")
//
//        column(name: "z_index", valueNumeric: "222")
//
//        column(name: "person_widget_definition_id", valueNumeric: "51")
//
//        column(name: "minimized", valueBoolean: "false")
//
//        column(name: "unique_id", value: "919d671a-33e1-4a34-830b-ee3f1c8cc4fb")
//
//        column(name: "height", valueNumeric: "540")
//
//        column(name: "pinned", valueBoolean: "false")
//
//        column(name: "name", value: "Widget Three")
//
//        column(name: "widget_guid")
//
//        column(name: "column_pos", valueNumeric: "0")
//
//        column(name: "width", valueNumeric: "630")
//
//        column(name: "button_id")
//
//        column(name: "collapsed", valueBoolean: "false")
//
//        column(name: "maximized", valueBoolean: "false")
//
//        column(name: "state_position", valueNumeric: "2")
//
//        column(name: "active", valueBoolean: "false")
//
//        column(name: "dashboard_id", valueNumeric: "117")
//
//        column(name: "y", valueNumeric: "300")
//
//        column(name: "x", valueNumeric: "300")
//    }
//
//		insert(tableName: "dashboard_widget_state") {
//			column(name: "id", valueNumeric: "134")
//
//			column(name: "version", valueNumeric: "0")
//
//			column(name: "region", value: "none")
//
//			column(name: "button_opened", valueBoolean: "false")
//
//			column(name: "z_index", valueNumeric: "100")
//
//			column(name: "person_widget_definition_id", valueNumeric: "65")
//
//			column(name: "minimized", valueBoolean: "false")
//
//			column(name: "unique_id", value: "23643536-c7db-4560-ad76-fff7b9f3c48c")
//
//			column(name: "height", valueNumeric: "405")
//
//			column(name: "pinned", valueBoolean: "false")
//
//			column(name: "name", value: "Widget One")
//
//			column(name: "widget_guid")
//
//			column(name: "column_pos", valueNumeric: "0")
//
//			column(name: "width", valueNumeric: "625")
//
//			column(name: "button_id")
//
//			column(name: "collapsed", valueBoolean: "false")
//
//			column(name: "maximized", valueBoolean: "false")
//
//			column(name: "state_position", valueNumeric: "0")
//
//			column(name: "active", valueBoolean: "false")
//
//			column(name: "dashboard_id", valueNumeric: "133")
//
//			column(name: "y", valueNumeric: "200")
//
//			column(name: "x", valueNumeric: "200")
//		}
//
//		insert(tableName: "dashboard_widget_state") {
//			column(name: "id", valueNumeric: "135")
//
//			column(name: "version", valueNumeric: "0")
//
//			column(name: "region", value: "none")
//
//			column(name: "button_opened", valueBoolean: "false")
//
//			column(name: "z_index", valueNumeric: "200")
//
//			column(name: "person_widget_definition_id", valueNumeric: "66")
//
//			column(name: "minimized", valueBoolean: "false")
//
//			column(name: "unique_id", value: "249beede-47b1-4c95-bf6c-97de96efab7b")
//
//			column(name: "height", valueNumeric: "635")
//
//			column(name: "pinned", valueBoolean: "false")
//
//			column(name: "name", value: "Widget Two")
//
//			column(name: "widget_guid")
//
//			column(name: "column_pos", valueNumeric: "0")
//
//			column(name: "width", valueNumeric: "610")
//
//			column(name: "button_id")
//
//			column(name: "collapsed", valueBoolean: "false")
//
//			column(name: "maximized", valueBoolean: "false")
//
//			column(name: "state_position", valueNumeric: "1")
//
//			column(name: "active", valueBoolean: "true")
//
//			column(name: "dashboard_id", valueNumeric: "133")
//
//			column(name: "y", valueNumeric: "250")
//
//			column(name: "x", valueNumeric: "250")
//		}
//
//		insert(tableName: "dashboard_widget_state") {
//			column(name: "id", valueNumeric: "136")
//
//			column(name: "version", valueNumeric: "0")
//
//			column(name: "region", value: "none")
//
//			column(name: "button_opened", valueBoolean: "false")
//
//			column(name: "z_index", valueNumeric: "222")
//
//			column(name: "person_widget_definition_id", valueNumeric: "67")
//
//			column(name: "minimized", valueBoolean: "false")
//
//			column(name: "unique_id", value: "ba3e8b1e-684d-4044-acdc-2c4d5e649e5c")
//
//			column(name: "height", valueNumeric: "540")
//
//			column(name: "pinned", valueBoolean: "false")
//
//			column(name: "name", value: "Widget Three")
//
//			column(name: "widget_guid")
//
//			column(name: "column_pos", valueNumeric: "0")
//
//			column(name: "width", valueNumeric: "630")
//
//			column(name: "button_id")
//
//			column(name: "collapsed", valueBoolean: "false")
//
//			column(name: "maximized", valueBoolean: "false")
//
//			column(name: "state_position", valueNumeric: "2")
//
//			column(name: "active", valueBoolean: "false")
//
//			column(name: "dashboard_id", valueNumeric: "133")
//
//			column(name: "y", valueNumeric: "300")
//
//			column(name: "x", valueNumeric: "300")
//		}
//
//
//    //admin widgets
//		insert(tableName: "dashboard_widget_state") {
//			column(name: "id", valueNumeric: "221")
//
//			column(name: "version", valueNumeric: "0")
//
//			column(name: "region", value: "none")
//
//			column(name: "button_opened", valueBoolean: "false")
//
//			column(name: "z_index", valueNumeric: "19000")
//
//			column(name: "person_widget_definition_id", valueNumeric: "174")
//
//			column(name: "minimized", valueBoolean: "false")
//
//			column(name: "unique_id", value: "f9c72845-447b-06d1-6b80-59dbd7918adc")
//
//			column(name: "height", valueNumeric: "382")
//
//			column(name: "pinned", valueBoolean: "false")
//
//			column(name: "name", value: "Users")
//
//			column(name: "widget_guid", value: "b3b1d04f-97c2-4726-9575-82bb1cf1af6a")
//
//			column(name: "column_pos", valueNumeric: "0")
//
//			column(name: "width", valueNumeric: "559")
//
//			column(name: "button_id")
//
//			column(name: "collapsed", valueBoolean: "false")
//
//			column(name: "maximized", valueBoolean: "false")
//
//			column(name: "state_position", valueNumeric: "0")
//
//			column(name: "active", valueBoolean: "false")
//
//			column(name: "dashboard_id", valueNumeric: "150")
//
//			column(name: "y", valueNumeric: "20")
//
//			column(name: "x", valueNumeric: "20")
//		}
//
//		insert(tableName: "dashboard_widget_state") {
//			column(name: "id", valueNumeric: "222")
//
//			column(name: "version", valueNumeric: "0")
//
//			column(name: "region", value: "none")
//
//			column(name: "button_opened", valueBoolean: "false")
//
//			column(name: "z_index", valueNumeric: "19010")
//
//			column(name: "person_widget_definition_id", valueNumeric: "183")
//
//			column(name: "minimized", valueBoolean: "false")
//
//			column(name: "unique_id", value: "cd2e8e03-fae1-839f-e85e-8e3a8aa8cc70")
//
//			column(name: "height", valueNumeric: "382")
//
//			column(name: "pinned", valueBoolean: "false")
//
//			column(name: "name", value: "Groups")
//
//			column(name: "widget_guid", value: "b87c4a3e-aa1e-499e-ba10-510f35388bb6")
//
//			column(name: "column_pos", valueNumeric: "0")
//
//			column(name: "width", valueNumeric: "559")
//
//			column(name: "button_id")
//
//			column(name: "collapsed", valueBoolean: "false")
//
//			column(name: "maximized", valueBoolean: "false")
//
//			column(name: "state_position", valueNumeric: "1")
//
//			column(name: "active", valueBoolean: "false")
//
//			column(name: "dashboard_id", valueNumeric: "150")
//
//			column(name: "y", valueNumeric: "442")
//
//			column(name: "x", valueNumeric: "20")
//		}
//
//		insert(tableName: "dashboard_widget_state") {
//			column(name: "id", valueNumeric: "223")
//
//			column(name: "version", valueNumeric: "0")
//
//			column(name: "region", value: "none")
//
//			column(name: "button_opened", valueBoolean: "false")
//
//			column(name: "z_index", valueNumeric: "19020")
//
//			column(name: "person_widget_definition_id", valueNumeric: "187")
//
//			column(name: "minimized", valueBoolean: "false")
//
//			column(name: "unique_id", value: "8956159f-d450-c315-cbaa-09d12307dc4a")
//
//			column(name: "height", valueNumeric: "382")
//
//			column(name: "pinned", valueBoolean: "false")
//
//			column(name: "name", value: "Group Dashboards")
//
//			column(name: "widget_guid", value: "9d804b74-b2a6-448a-bd04-fe286905ab8f")
//
//			column(name: "column_pos", valueNumeric: "0")
//
//			column(name: "width", valueNumeric: "559")
//
//			column(name: "button_id")
//
//			column(name: "collapsed", valueBoolean: "false")
//
//			column(name: "maximized", valueBoolean: "false")
//
//			column(name: "state_position", valueNumeric: "2")
//
//			column(name: "active", valueBoolean: "false")
//
//			column(name: "dashboard_id", valueNumeric: "150")
//
//			column(name: "y", valueNumeric: "442")
//
//			column(name: "x", valueNumeric: "619")
//		}
//
//		insert(tableName: "dashboard_widget_state") {
//			column(name: "id", valueNumeric: "224")
//
//			column(name: "version", valueNumeric: "0")
//
//			column(name: "region", value: "none")
//
//			column(name: "button_opened", valueBoolean: "false")
//
//			column(name: "z_index", valueNumeric: "19030")
//
//			column(name: "person_widget_definition_id", valueNumeric: "179")
//
//			column(name: "minimized", valueBoolean: "false")
//
//			column(name: "unique_id", value: "c35df5a7-978f-210e-7dab-6df28f09469f")
//
//			column(name: "height", valueNumeric: "382")
//
//			column(name: "pinned", valueBoolean: "false")
//
//			column(name: "name", value: "Widgets")
//
//			column(name: "widget_guid", value: "412ec70d-a178-41ae-a8d9-6713a430c87c")
//
//			column(name: "column_pos", valueNumeric: "0")
//
//			column(name: "width", valueNumeric: "559")
//
//			column(name: "button_id")
//
//			column(name: "collapsed", valueBoolean: "false")
//
//			column(name: "maximized", valueBoolean: "false")
//
//			column(name: "state_position", valueNumeric: "3")
//
//			column(name: "active", valueBoolean: "true")
//
//			column(name: "dashboard_id", valueNumeric: "150")
//
//			column(name: "y", valueNumeric: "20")
//
//			column(name: "x", valueNumeric: "619")
//		}
//  }

// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
//  changeSet(author: "owf", id: "4.0.0-20", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
//      comment(text="allow identity inserts")
//    sql ( text = """
//      SET IDENTITY_INSERT [dbo].[dashboard_widget_state] OFF
//    """)
//  }

  changeSet(author: "owf", id: "4.0.0-21", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[owf_group] ON
    """)
  }
  changeSet(author: "owf", id: "4.0.0-22", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "owf_group") {
        column(name: "id", valueNumeric: "4")

        column(name: "version", valueNumeric: "0")

        column(name: "status", value: "active")

        column(name: "email", value: "testgroup1@group1.com")

        column(name: "description", value: "TestGroup1")

        column(name: "name", value: "TestGroup1")

        column(name: "automatic", valueBoolean: "false")
    }

    insert(tableName: "owf_group") {
        column(name: "id", valueNumeric: "5")

        column(name: "version", valueNumeric: "0")

        column(name: "status", value: "active")

        column(name: "email", value: "testgroup2@group2.com")

        column(name: "description", value: "TestGroup2")

        column(name: "name", value: "TestGroup2")

        column(name: "automatic", valueBoolean: "false")
    }
  }
  changeSet(author: "owf", id: "4.0.0-23", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[owf_group] OFF
    """)
  }

// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
// changeSet(author: "owf", id: "4.0.0-24", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
//      comment(text="allow identity inserts")
//    sql ( text = """
//      SET IDENTITY_INSERT [dbo].[owf_group_people] ON
//    """)
//  }
  changeSet(author: "owf", id: "4.0.0-25", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "owf_group_people") {
        column(name: "group_id", valueNumeric: "4")

        column(name: "person_id", valueNumeric: "2")
    }

    insert(tableName: "owf_group_people") {
        column(name: "group_id", valueNumeric: "4")

        column(name: "person_id", valueNumeric: "1")
    }

    insert(tableName: "owf_group_people") {
        column(name: "group_id", valueNumeric: "5")

        column(name: "person_id", valueNumeric: "2")
    }

    insert(tableName: "owf_group_people") {
        column(name: "group_id", valueNumeric: "5")

        column(name: "person_id", valueNumeric: "1")
    }
  }
// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
// changeSet(author: "owf", id: "4.0.0-26", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
//      comment(text="allow identity inserts")
//    sql ( text = """
//      SET IDENTITY_INSERT [dbo].[owf_group_people] OFF
//    """)
//  }

  changeSet(author: "owf", id: "4.0.0-27", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[role] ON
    """)
  }
  changeSet(author: "owf", id: "4.0.0-28", dbms: "mysql,mssql,oracle,postgresql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "role") {
        column(name: "id", valueNumeric: "26")

        column(name: "version", valueNumeric: "2")

        column(name: "authority", value: "ROLE_USER")

        column(name: "description", value: "User Role")
    }

    insert(tableName: "role") {
        column(name: "id", valueNumeric: "27")

        column(name: "version", valueNumeric: "1")

        column(name: "authority", value: "ROLE_ADMIN")

        column(name: "description", value: "Admin Role")
    }
  }
  changeSet(author: "owf", id: "4.0.0-28", dbms: "hsqldb", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "ROLE") {
        column(name: "id", valueNumeric: "26")

        column(name: "version", valueNumeric: "2")

        column(name: "authority", value: "ROLE_USER")

        column(name: "description", value: "User Role")
    }

    insert(tableName: "ROLE") {
        column(name: "id", valueNumeric: "27")

        column(name: "version", valueNumeric: "1")

        column(name: "authority", value: "ROLE_ADMIN")

        column(name: "description", value: "Admin Role")
    }
  }
  changeSet(author: "owf", id: "4.0.0-29", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[role] OFF
    """)
  }

// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
// changeSet(author: "owf", id: "4.0.0-30", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
//      comment(text="allow identity inserts")
//    sql ( text = """
//      SET IDENTITY_INSERT [dbo].[role_people] ON
//    """)
//  }
  changeSet(author: "owf", id: "4.0.0-31", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "role_people") {
        column(name: "role_id", valueNumeric: "26")

        column(name: "person_id", valueNumeric: "2")
    }

    insert(tableName: "role_people") {
        column(name: "role_id", valueNumeric: "26")

        column(name: "person_id", valueNumeric: "3")
    }

    insert(tableName: "role_people") {
        column(name: "role_id", valueNumeric: "26")

        column(name: "person_id", valueNumeric: "28")
    }

    insert(tableName: "role_people") {
        column(name: "role_id", valueNumeric: "27")

        column(name: "person_id", valueNumeric: "1")
    }
  }
// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
// changeSet(author: "owf", id: "4.0.0-32", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
//      comment(text="allow identity inserts")
//    sql ( text = """
//      SET IDENTITY_INSERT [dbo].[role_people] OFF
//    """)
//  }

  changeSet(author: "owf", id: "4.0.0-33", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[preference] ON
      """)
    }
  changeSet(author: "owf", id: "4.0.0-34", dbms: "mysql,mssql,oracle,postgresql", context: "sampleData, 4.0.0-sampleData") {
        comment(text="insert new sample data")
      insert(tableName: "preference") {
          column(name: "id", valueNumeric: "144")

          column(name: "version", valueNumeric: "0")

          column(name: "value", value: "foovalue")

          column(name: "path", value: "test path entry 0")

          column(name: "user_id", valueNumeric: "2")

          column(name: "namespace", value: "foo.bar.0")
      }

      insert(tableName: "preference") {
          column(name: "id", valueNumeric: "145")

          column(name: "version", valueNumeric: "0")

          column(name: "value", value: "foovalue")

          column(name: "path", value: "test path entry 1")

          column(name: "user_id", valueNumeric: "2")

          column(name: "namespace", value: "foo.bar.1")
      }

      insert(tableName: "preference") {
          column(name: "id", valueNumeric: "146")

          column(name: "version", valueNumeric: "0")

          column(name: "value", value: "foovalue")

          column(name: "path", value: "test path entry 0")

          column(name: "user_id", valueNumeric: "3")

          column(name: "namespace", value: "foo.bar.0")
      }

      insert(tableName: "preference") {
          column(name: "id", valueNumeric: "147")

          column(name: "version", valueNumeric: "0")

          column(name: "value", value: "foovalue")

          column(name: "path", value: "test path entry 1")

          column(name: "user_id", valueNumeric: "3")

          column(name: "namespace", value: "foo.bar.1")
      }

      insert(tableName: "preference") {
          column(name: "id", valueNumeric: "148")

          column(name: "version", valueNumeric: "0")

          column(name: "value", value: "foovalue")

          column(name: "path", value: "test path entry 0")

          column(name: "user_id", valueNumeric: "1")

          column(name: "namespace", value: "foo.bar.0")
      }

      insert(tableName: "preference") {
          column(name: "id", valueNumeric: "149")

          column(name: "version", valueNumeric: "0")

          column(name: "value", value: "foovalue")

          column(name: "path", value: "test path entry 1")

          column(name: "user_id", valueNumeric: "1")

          column(name: "namespace", value: "foo.bar.1")
      }
    }
  changeSet(author: "owf", id: "4.0.0-34", dbms: "hsqldb", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "preference") {
        column(name: "id", valueNumeric: "144")

        column(name: "version", valueNumeric: "0")

        column(name: "VALUE", value: "foovalue")

        column(name: "path", value: "test path entry 0")

        column(name: "user_id", valueNumeric: "2")

        column(name: "namespace", value: "foo.bar.0")
    }

    insert(tableName: "preference") {
        column(name: "id", valueNumeric: "145")

        column(name: "version", valueNumeric: "0")

        column(name: "VALUE", value: "foovalue")

        column(name: "path", value: "test path entry 1")

        column(name: "user_id", valueNumeric: "2")

        column(name: "namespace", value: "foo.bar.1")
    }

    insert(tableName: "preference") {
        column(name: "id", valueNumeric: "146")

        column(name: "version", valueNumeric: "0")

        column(name: "VALUE", value: "foovalue")

        column(name: "path", value: "test path entry 0")

        column(name: "user_id", valueNumeric: "3")

        column(name: "namespace", value: "foo.bar.0")
    }

    insert(tableName: "preference") {
        column(name: "id", valueNumeric: "147")

        column(name: "version", valueNumeric: "0")

        column(name: "VALUE", value: "foovalue")

        column(name: "path", value: "test path entry 1")

        column(name: "user_id", valueNumeric: "3")

        column(name: "namespace", value: "foo.bar.1")
    }

    insert(tableName: "preference") {
        column(name: "id", valueNumeric: "148")

        column(name: "version", valueNumeric: "0")

        column(name: "VALUE", value: "foovalue")

        column(name: "path", value: "test path entry 0")

        column(name: "user_id", valueNumeric: "1")

        column(name: "namespace", value: "foo.bar.0")
    }

    insert(tableName: "preference") {
        column(name: "id", valueNumeric: "149")

        column(name: "version", valueNumeric: "0")

        column(name: "VALUE", value: "foovalue")

        column(name: "path", value: "test path entry 1")

        column(name: "user_id", valueNumeric: "1")

        column(name: "namespace", value: "foo.bar.1")
    }
  }
  changeSet(author: "owf", id: "4.0.0-35", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
        comment(text="allow identity inserts")
      sql ( text = """
        SET IDENTITY_INSERT [dbo].[preference] OFF
      """)
    }

  changeSet(author: "owf", id: "4.0.0-36", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[domain_mapping] ON
    """)
  }
  changeSet(author: "owf", id: "4.0.0-37", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "domain_mapping") {
        column(name: "id", valueNumeric: "22")

        column(name: "version", valueNumeric: "0")

        column(name: "src_id", valueNumeric: "4")

        column(name: "src_type", value: "group")

        column(name: "relationship_type", value: "owns")

        column(name: "dest_id", valueNumeric: "6")

        column(name: "dest_type", value: "widget_definition")
    }

    insert(tableName: "domain_mapping") {
        column(name: "id", valueNumeric: "23")

        column(name: "version", valueNumeric: "0")

        column(name: "src_id", valueNumeric: "4")

        column(name: "src_type", value: "group")

        column(name: "relationship_type", value: "owns")

        column(name: "dest_id", valueNumeric: "7")

        column(name: "dest_type", value: "widget_definition")
    }

    insert(tableName: "domain_mapping") {
        column(name: "id", valueNumeric: "24")

        column(name: "version", valueNumeric: "0")

        column(name: "src_id", valueNumeric: "5")

        column(name: "src_type", value: "group")

        column(name: "relationship_type", value: "owns")

        column(name: "dest_id", valueNumeric: "6")

        column(name: "dest_type", value: "widget_definition")
    }

    insert(tableName: "domain_mapping") {
        column(name: "id", valueNumeric: "25")

        column(name: "version", valueNumeric: "0")

        column(name: "src_id", valueNumeric: "5")

        column(name: "src_type", value: "group")

        column(name: "relationship_type", value: "owns")

        column(name: "dest_id", valueNumeric: "7")

        column(name: "dest_type", value: "widget_definition")
    }
  }
  changeSet(author: "owf", id: "4.0.0-38", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[domain_mapping] OFF
    """)
  }

  changeSet(author: "owf", id: "4.0.0-39", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[tags] ON
    """)
  }
  changeSet(author: "owf", id: "4.0.0-40", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "tags") {
        column(name: "id", valueNumeric: "152")

        column(name: "version", valueNumeric: "0")

        column(name: "name", value: "admin")
    }
  }
  changeSet(author: "owf", id: "4.0.0-41", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[tags] OFF
    """)
  }

  changeSet(author: "owf", id: "4.0.0-42", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[tag_links] ON
    """)
  }
  changeSet(author: "owf", id: "4.0.0-43", context: "sampleData, 4.0.0-sampleData") {
      comment(text="insert new sample data")
    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "153")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "151")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "155")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "154")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "157")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "156")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "159")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "158")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "162")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "160")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "164")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "163")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "165")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "161")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "169")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "166")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "168")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "167")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "172")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "170")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "173")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "171")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "widgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "176")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "174")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "personWidgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "178")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "177")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "personWidgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "180")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "179")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "personWidgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "182")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "181")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "personWidgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "184")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "183")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "personWidgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "186")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "185")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "personWidgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "188")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "187")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "personWidgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

    insert(tableName: "tag_links") {
        column(name: "id", valueNumeric: "190")

        column(name: "version", valueNumeric: "0")

        column(name: "pos", valueNumeric: "-1")

        column(name: "visible", valueBoolean: "true")

        column(name: "tag_ref", valueNumeric: "189")

        column(name: "tag_id", valueNumeric: "152")

        column(name: "type", value: "personWidgetDefinition")

        column(name: "editable", valueBoolean: "true")
    }

  }
  changeSet(author: "owf", id: "4.0.0-44", dbms:"mssql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[tag_links] OFF
    """)
  }

  changeSet(author: "owf", id: "4.0.0-45", dbms:"oracle,postgresql", context: "sampleData, 4.0.0-sampleData") {
      comment(text="set sequence to higher number that is not used")

    dropSequence(sequenceName: "hibernate_sequence")
    createSequence(sequenceName: "hibernate_sequence", startValue:"300")
  }

  changeSet(author: "owf", id: "4.0.0-46",context: "sampleData, 4.0.0-sampleData") {
    update(tableName:"widget_definition") {
      column(name:"widget_url", value:"examples/walkthrough/widgets/ChannelListener.gsp")
      where(text="widget_url='examples/walkthrough/widgets/ChannelListener.html'")
    }

  }
  
  changeSet(author: "owf", id: "4.0.0-47", context: "create, upgrade, 4.0.0") {
      comment(text="Added showLaunchMenu column into Dashboard Table")
	  addColumn(tableName: "dashboard"){
		  column(name: "show_launch_menu", type: "boolean", valueBoolean: "false", defaultValueBoolean: "false")
	  }
  }

  changeSet(author: "owf", id: "4.0.0-48", context: "create, upgrade, 4.0.0", dbms:"oracle, mysql, hsqldb, postgresql") {
    comment(text="Create widget type table and linking table")
    createTable(tableName: "widget_type") {
      column(autoIncrement: "true", name: "id", type: "bigint") {
        constraints(nullable: "false", primaryKey: "true", primaryKeyName: "widget_typePK")
      }

      column(name: "version", type: "bigint") {
        constraints(nullable: "false")
      }

      column(name: "name", type: "varchar(255)") {
        constraints(nullable: "false")
      }
    }
    createTable(tableName: "widget_definition_widget_types") {
      column(name: "widget_definition_id", type: "bigint") {
        constraints(nullable: "false")
      }

      column(name: "widget_type_id", type: "bigint") {
        constraints(nullable: "false")
      }
    }
    addPrimaryKey(columnNames: "widget_definition_id, widget_type_id", tableName: "widget_definition_widget_types")
    addForeignKeyConstraint(baseColumnNames: "widget_definition_id", baseTableName: "widget_definition_widget_types", constraintName: "FK8A59D92F293A835C", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "widget_definition", referencesUniqueColumn: "false")
    addForeignKeyConstraint(baseColumnNames: "widget_type_id", baseTableName: "widget_definition_widget_types", constraintName: "FK8A59D92FD46C6F7C", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "widget_type", referencesUniqueColumn: "false")
  }
  changeSet(author: "owf", id: "4.0.0-49", context: "create, upgrade, 4.0.0", dbms: "mssql") {
    comment(text="Create widget type table and linking table for sql server")
    createTable(tableName: "widget_type") {
      column(autoIncrement: "true", name: "id", type: "numeric(19,0)") {
        constraints(nullable: "false", primaryKey: "true", primaryKeyName: "widget_typePK")
      }

      column(name: "version", type: "numeric(19,0)") {
        constraints(nullable: "false")
      }

      column(name: "name", type: "varchar(255)") {
        constraints(nullable: "false")
      }
    }
    createTable(tableName: "widget_definition_widget_types") {
      column(name: "widget_definition_id", type: "numeric(19,0)") {
        constraints(nullable: "false")
      }

      column(name: "widget_type_id", type: "numeric(19,0)") {
        constraints(nullable: "false")
      }
    }
    addPrimaryKey(columnNames: "widget_definition_id, widget_type_id", tableName: "widget_definition_widget_types")
    addForeignKeyConstraint(baseColumnNames: "widget_definition_id", baseTableName: "widget_definition_widget_types", constraintName: "FK8A59D92F293A835C", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "widget_definition", referencesUniqueColumn: "false")
    addForeignKeyConstraint(baseColumnNames: "widget_type_id", baseTableName: "widget_definition_widget_types", constraintName: "FK8A59D92FD46C6F7C", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "widget_type", referencesUniqueColumn: "false")
  }

  changeSet(author: "owf", id: "4.0.0-50", context: "create, upgrade, 4.0.0", dbms:"mssql") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[widget_type] ON
    """)
  }

  changeSet(author: "owf", id: "4.0.0-51", context: "create, upgrade, 4.0.0") {
    comment(text="Add widget types to table")
    insert(tableName: "widget_type") {
      column(name: "id", valueNumeric:"1")
      column(name: "name", value: "standard")
      column(name: "version", valueNumeric: "0")
    }
    insert(tableName: "widget_type") {
      column(name: "id", valueNumeric:"2")
      column(name: "name", value: "administration")
      column(name: "version", valueNumeric: "0")
    }
    insert(tableName: "widget_type") {
      column(name: "id", valueNumeric:"3")
      column(name: "name", value: "marketplace")
      column(name: "version", valueNumeric: "0")
    }
  }
  changeSet(author: "owf", id: "4.0.0-52", dbms:"mssql", context: "create, upgrade, 4.0.0") {
      comment(text="allow identity inserts")
    sql ( text = """
      SET IDENTITY_INSERT [dbo].[widget_type] OFF
    """)
  }
  changeSet(author: "owf", id: "4.0.0-53", context: "upgrade, 4.0.0, sampleData, 4.0.0-sampleData") {
    comment(text="Insert widget type mapping links")
    sql ( text = """
      insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
      select id, 1 from widget_definition
      where widget_url not in (
        'admin/DashboardEdit.gsp',
        'admin/GroupDashboardManagement.gsp',
        'admin/GroupEdit.gsp',
        'admin/GroupManagement.gsp',
        'admin/MarketplaceApprovals.gsp',
        'admin/UserManagement.gsp',
        'admin/UserEdit.gsp',
        'admin/WidgetEdit.gsp',
        'admin/WidgetManagement.gsp'
        )
    """ )
    sql ( text = """
      insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
      select id, 2 from widget_definition
      where widget_url in (
        'admin/DashboardEdit.gsp',
        'admin/GroupDashboardManagement.gsp',
        'admin/GroupEdit.gsp',
        'admin/GroupManagement.gsp',
        'admin/MarketplaceApprovals.gsp',
        'admin/UserManagement.gsp',
        'admin/UserEdit.gsp',
        'admin/WidgetEdit.gsp',
        'admin/WidgetManagement.gsp'
        )
    """ )
  }

// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
//  changeSet(author: "owf", id: "4.0.0-54", context: "upgrade, sampleData, 4.0.0-sampleData") {
//    comment(text="Add change admin widget icons")
//    update(tableName:"widget_definition") {
//      column(name:"image_url_large", value:"themes/common/images/adm-tools/DashboardAdmin.png")
//      column(name:"image_url_small", value:"themes/common/images/adm-tools/DashboardAdmin.png")
//      where(text="widget_url='admin/GroupDashboardManagement.gsp'")
//    }
//    update(tableName:"widget_definition") {
//      column(name:"image_url_large", value:"themes/common/images/adm-tools/GroupsAdmin.png")
//      column(name:"image_url_small", value:"themes/common/images/adm-tools/GroupsAdmin.png")
//      where(text="widget_url='admin/GroupManagement.gsp'")
//    }
//    update(tableName:"widget_definition") {
//      column(name:"image_url_large", value:"themes/common/images/adm-tools/UsersAdmin.png")
//      column(name:"image_url_small", value:"themes/common/images/adm-tools/UsersAdmin.png")
//      where(text="widget_url='admin/UserManagement.gsp'")
//    }
//    update(tableName:"widget_definition") {
//      column(name:"image_url_large", value:"themes/common/images/adm-tools/WidgetsAdmin.png")
//      column(name:"image_url_small", value:"themes/common/images/adm-tools/WidgetsAdmin.png")
//      where(text="widget_url='admin/WidgetManagement.gsp'")
//    }
//  }

  changeSet(author: "owf", id: "4.0.0-55", context: "upgrade, 4.0.0, sampleData, 4.0.0-sampleData") {
    comment(text="Updating Admin Widget Icons and Names")

    update(tableName:"widget_definition") {
      column(name:"image_url_large", value:"themes/common/images/adm-tools/Users64.png")
      column(name:"image_url_small", value:"themes/common/images/adm-tools/Users24.png")
      column(name: "display_name", value: "Users")
      where(text="widget_url='admin/UserManagement.gsp'")
    }
    update(tableName:"widget_definition") {
      column(name:"image_url_large", value:"themes/common/images/adm-tools/Users64.png")
      column(name:"image_url_small", value:"themes/common/images/adm-tools/Users24.png")
      where(text="widget_url='admin/UserEdit.gsp'")
    }
    update(tableName:"widget_definition") {
      column(name:"image_url_large", value:"themes/common/images/adm-tools/Widgets64.png")
      column(name:"image_url_small", value:"themes/common/images/adm-tools/Widgets24.png")
      column(name: "display_name", value: "Widgets")
      where(text="widget_url='admin/WidgetManagement.gsp'")
    }
    update(tableName:"widget_definition") {
      column(name:"image_url_large", value:"themes/common/images/adm-tools/Widgets64.png")
      column(name:"image_url_small", value:"themes/common/images/adm-tools/Widgets24.png")
      where(text="widget_url='admin/WidgetEdit.gsp'")
    }
    update(tableName:"widget_definition") {
      column(name:"image_url_large", value:"themes/common/images/adm-tools/Groups64.png")
      column(name:"image_url_small", value:"themes/common/images/adm-tools/Groups24.png")
      column(name: "display_name", value: "Groups")
      where(text="widget_url='admin/GroupManagement.gsp'")
    }
    update(tableName:"widget_definition") {
      column(name:"image_url_large", value:"themes/common/images/adm-tools/Groups64.png")
      column(name:"image_url_small", value:"themes/common/images/adm-tools/Groups24.png")
      where(text="widget_url='admin/GroupEdit.gsp'")
    }
    update(tableName:"widget_definition") {
      column(name:"image_url_large", value:"themes/common/images/adm-tools/Dashboards64.png")
      column(name:"image_url_small", value:"themes/common/images/adm-tools/Dashboards24.png")
      column(name: "display_name", value: "Group Dashboards")
      where(text="widget_url='admin/GroupDashboardManagement.gsp'")
    }
    update(tableName:"widget_definition") {
      column(name:"image_url_large", value:"themes/common/images/adm-tools/Dashboards64.png")
      column(name:"image_url_small", value:"themes/common/images/adm-tools/Dashboards24.png")
      where(text="widget_url='admin/DashboardEdit.gsp'")
    }
    update(tableName:"widget_definition") {
      column(name:"image_url_large", value:"themes/common/images/adm-tools/Approvals64.png")
      column(name:"image_url_small", value:"themes/common/images/adm-tools/Approvals24.png")
      column(name:"visible", valueBoolean: "true")
      column(name: "display_name", value: "Approvals")
      where(text="widget_url='admin/MarketplaceApprovals.gsp'")
    }
  }

  changeSet(author: "owf", id: "4.0.0-56", context: "create, upgrade, 4.0.0") {
    comment(text="Updating display_name column to 256 chars")

    modifyDataType(tableName:"widget_definition", columnName:"display_name", newDataType:"varchar(256)")
  }
}

