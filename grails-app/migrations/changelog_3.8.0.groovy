databaseChangeLog = {

  //use 'upgrade' context for new change sets which change the schema or manipulating data related to a schema change
  //use 'sampleData' context to add new sample data
  //favor making database agnostic changeSets - however if needed the dbms attribute can be set to make a db specific changeset

  changeSet(author: "owf", id: "3.8.0-1", dbms: "hsqldb,oracle,postgresql", context: "create, upgrade, 3.8.0") {
    dropNotNullConstraint(columnName: "user_id", tableName: "dashboard")
  }

  //mysql needs the columnDataType specified
  changeSet(author: "owf", id: "3.8.0-1", dbms: "mysql", context: "create, upgrade, 3.8.0") {
    dropNotNullConstraint(columnName: "user_id", columnDataType:"bigint", tableName: "dashboard")
  }

  //sqlserver needs the columnDataType specified
  changeSet(author: "owf", id: "3.8.0-1", dbms: "mssql", context: "create, upgrade, 3.8.0") {
    dropNotNullConstraint(columnName: "user_id", columnDataType:"numeric(19,0)", tableName: "dashboard")
  }
  
  //Added description column into Dashboard Table
  changeSet(author: "owf", id: "3.8.0-2", context: "create, upgrade, 3.8.0") {
      comment(text="Added description column into Dashboard Table")
	  addColumn(tableName: "dashboard"){
		  column(name: "description", type: "varchar(255)")
	  }
  }
  
  changeSet(author: "owf", id: "3.8.0-3", dbms:"hsqldb,mysql,oracle,postgresql", context: "create, upgrade, 3.8.0") {
	  addColumn(tableName: "dashboard"){
		  column(name: "created_by_id", type: "bigint")
		  column(name: "created_date", type: "datetime")
		  column(name: "edited_by_id", type: "bigint")
		  column(name: "edited_date", type: "datetime")
	  }
  }

  //sqlserver defaulted all id columns to numeric(19,0) todo someday make all databases id column datatypes the same
  changeSet(author: "owf", id: "3.8.0-3", dbms:"mssql", context: "create, upgrade, 3.8.0") {
	  addColumn(tableName: "dashboard"){
		  column(name: "created_by_id", type: "numeric(19,0)")
		  column(name: "created_date", type: "datetime")
		  column(name: "edited_by_id", type: "numeric(19,0)")
		  column(name: "edited_date", type: "datetime")
	  }
  }

  changeSet(author: "owf", id: "3.8.0-4", context: "create, upgrade, 3.8.0") {
      addForeignKeyConstraint(baseColumnNames: "created_by_id", baseTableName: "dashboard", constraintName: "FKC18AEA94372CC5A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
  }

  changeSet(author: "owf", id: "3.8.0-5", context: "create, upgrade, 3.8.0") {
      addForeignKeyConstraint(baseColumnNames: "edited_by_id", baseTableName: "dashboard", constraintName: "FKC18AEA947028B8DB", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
  }

// DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
//  changeSet(author: "owf", id: "3.8.0-6", context: "create, upgrade, 3.8.0") {
//      createTable(tableName: "metric") {
//          column(autoIncrement: "true", name: "id", type: "bigint") {
//              constraints(nullable: "false", primaryKey: "true", primaryKeyName: "metricPK")
//          }
//
//          column(name: "version", type: "bigint") {
//              constraints(nullable: "false")
//          }
//
//          column(name: "component", type: "varchar(200)") {
//              constraints(nullable: "false")
//          }
//
//          column(name: "component_id", type: "varchar(255)") {
//              constraints(nullable: "false")
//          }
//
//          column(name: "instance_id", type: "varchar(255)") {
//              constraints(nullable: "false")
//          }
//
//          column(name: "metric_time", type: "varchar(255)") {
//              constraints(nullable: "false")
//          }
//
//          column(name: "metric_type_id", type: "varchar(255)") {
//              constraints(nullable: "false")
//          }
//
//          column(name: "site", type: "varchar(255)") {
//              constraints(nullable: "false")
//          }
//
//          column(name: "user_agent", type: "varchar(255)") {
//              constraints(nullable: "false")
//          }
//
//          column(name: "user_name", type: "varchar(255)") {
//              constraints(nullable: "false")
//          }
//
//          column(name: "widget_data", type: "varchar(255)") {
//              constraints(nullable: "true")
//          }
//      }
//  }

  changeSet(author: "owf", id: "3.8.0-7", context: "upgrade, 3.8.0,  sampleData, 3.8.0-sampleData") {
    comment(text="Updating Admin Widget Icons and Names")

    update(tableName:"widget_definition") {
      column(name:"display_name", value:"User Manager")
      column(name:"image_url_large", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png")
      column(name:"image_url_small", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png")
      where(text="widget_url='admin/UserManagement.gsp'")
    }

    update(tableName:"widget_definition") {
      column(name:"display_name", value:"User Editor")
      column(name:"image_url_large", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png")
      column(name:"image_url_small", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png")
      column(name:"visible", valueBoolean:"false")
      where(text="widget_url='admin/UserEdit.gsp'")
    }

    update(tableName:"widget_definition") {
      column(name:"display_name", value:"Widget Manager")
      column(name:"image_url_large", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png")
      column(name:"image_url_small", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png")
      where(text="widget_url='admin/WidgetManagement.gsp'")
    }

    update(tableName:"widget_definition") {
      column(name:"display_name", value:"Widget Editor")
      column(name:"image_url_large", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png")
      column(name:"image_url_small", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png")
      column(name:"visible", valueBoolean:"false")
      where(text="widget_url='admin/WidgetEdit.gsp'")
    }

    update(tableName:"widget_definition") {
      column(name:"display_name", value:"Group Manager")
      column(name:"image_url_large", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png")
      column(name:"image_url_small", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png")
      where(text="widget_url='admin/GroupManagement.gsp'")
    }

    update(tableName:"widget_definition") {
      column(name:"display_name", value:"Group Editor")
      column(name:"image_url_large", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png")
      column(name:"image_url_small", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png")
      column(name:"visible", valueBoolean:"false")
      where(text="widget_url='admin/GroupEdit.gsp'")
    }

    update(tableName:"widget_definition") {
      column(name:"display_name", value:"Group Dashboard Manager")
      column(name:"image_url_large", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png")
      column(name:"image_url_small", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png")
      where(text="widget_url='admin/GroupDashboardManagement.gsp'")
    }

    update(tableName:"widget_definition") {
      column(name:"display_name", value:"Dashboard Editor")
      column(name:"image_url_large", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png")
      column(name:"image_url_small", value:"themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png")
      column(name:"visible", valueBoolean:"false")
      where(text="widget_url='admin/DashboardEdit.gsp'")
    }
  }
  // DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
  // changeSet(author: "owf", id: "3.8.0-8", context: "sampleData, 3.8.0-sampleData") {
  //   comment(text="Renaming sample dashboard names")

  //   update(tableName:"dashboard") {
  //     column(name:"name", value:"Tabbed Window Manager")
  //     where(text="name like 'Tabbed Window Manager (%)'")
  //   }

  //   update(tableName:"dashboard") {
  //     column(name:"name", value:"Accordion Window Manager")
  //     where(text="name like 'Accordion Window Manager (%)'")
  //   }

  //   update(tableName:"dashboard") {
  //     column(name:"name", value:"Desktop Window Manager")
  //     where(text="name like 'Desktop Window Manager (%)'")
  //   }

  //   update(tableName:"dashboard") {
  //     column(name:"name", value:"Portal Window Manager")
  //     where(text="name like 'Portal Window Manager (%)'")
  //   }
  // }

  changeSet(author: "owf", id: "3.8.0-9", dbms: "hsqldb,oracle,postgresql", context: "create, upgrade, 3.8.0") {
    dropNotNullConstraint(columnName: "widget_version", tableName: "widget_definition")
  }

  //mysql needs the columnDataType specified
  changeSet(author: "owf", id: "3.8.0-9", dbms: "mysql", context: "create, upgrade, 3.8.0") {
    dropNotNullConstraint(columnName: "widget_version", columnDataType:"varchar(2083)", tableName: "widget_definition")
  }

  //sqlserver needs the columnDataType specified
  changeSet(author: "owf", id: "3.8.0-9", dbms: "mssql", context: "create, upgrade, 3.8.0") {
    dropNotNullConstraint(columnName: "widget_version", columnDataType:"nvarchar(2083)", tableName: "widget_definition")
  }

  //mysql - data - DEPRECATED changeset don't use reuse this exact id,context,dbms combo again
// changeSet(author: "owf", id: "3.8.0-10", dbms: "mysql", context: "sampleData, 3.8.0-sampleData") {
// }
}
