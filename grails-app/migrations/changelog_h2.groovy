databaseChangeLog = {

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-1") {
		createTable(tableName: "application_configuration") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "application_cPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "code", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "varchar(255)")

			column(name: "group_name", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "help", type: "varchar(255)")

			column(name: "mutable", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "sub_group_name", type: "varchar(255)")

			column(name: "sub_group_order", type: "integer")

			column(name: "title", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "type", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "value", type: "varchar(255)")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-2") {
		createTable(tableName: "dashboard") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "dashboardPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "altered_by_admin", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "created_by_id", type: "bigint")

			column(name: "created_date", type: "timestamp")

			column(name: "dashboard_position", type: "integer") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "varchar(255)")

			column(name: "edited_by_id", type: "bigint")

			column(name: "edited_date", type: "timestamp")

			column(name: "guid", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "icon_image_url", type: "varchar(2083)")

			column(name: "isdefault", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "layout_config", type: "clob")

			column(name: "locked", type: "boolean", defaultValueBoolean: "false") {
				constraints(nullable: "false")
			}

			column(name: "marked_for_deletion", type: "boolean")

			column(name: "name", type: "varchar(200)") {
				constraints(nullable: "false")
			}

			column(name: "published_to_store", type: "boolean")

			column(name: "stack_id", type: "bigint")

			column(name: "type", type: "varchar(255)")

			column(name: "user_id", type: "bigint")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-3") {
		createTable(tableName: "domain_mapping") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "domain_mappinPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "dest_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "dest_type", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "relationship_type", type: "varchar(10)")

			column(name: "src_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "src_type", type: "varchar(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-4") {
		createTable(tableName: "intent") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "intentPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "action", type: "varchar(256)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-5") {
		createTable(tableName: "intent_data_type") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "intent_data_tPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "data_type", type: "varchar(256)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-6") {
		createTable(tableName: "intent_data_types") {
			column(name: "intent_data_type_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "intent_id", type: "bigint") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-7") {
		createTable(tableName: "owf_group") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "owf_groupPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "automatic", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "varchar(255)")

			column(name: "display_name", type: "varchar(200)")

			column(name: "email", type: "varchar(255)")

			column(name: "name", type: "varchar(200)") {
				constraints(nullable: "false")
			}

			column(name: "stack_default", type: "boolean", defaultValueBoolean: "false") {
				constraints(nullable: "false")
			}

			column(name: "status", type: "varchar(8)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-8") {
		createTable(tableName: "owf_group_people") {
			column(name: "person_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "group_id", type: "bigint") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-9") {
		createTable(tableName: "person") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "personPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "varchar(255)")

			column(name: "email", type: "varchar(255)")

			column(name: "email_show", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "enabled", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "last_login", type: "timestamp")

			column(name: "last_notification", type: "timestamp")

			column(name: "prev_login", type: "timestamp")

			column(name: "user_real_name", type: "varchar(200)") {
				constraints(nullable: "false")
			}

			column(name: "username", type: "varchar(200)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-10") {
		createTable(tableName: "person_widget_definition") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "person_widgetPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "disabled", type: "boolean")

			column(name: "display_name", type: "varchar(256)")

			column(name: "favorite", type: "boolean")

			column(name: "group_widget", type: "boolean")

			column(name: "person_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "pwd_position", type: "integer") {
				constraints(nullable: "false")
			}

			column(name: "user_widget", type: "boolean")

			column(name: "visible", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "widget_definition_id", type: "bigint") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-11") {
		createTable(tableName: "preference") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "preferencePK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "namespace", type: "varchar(200)") {
				constraints(nullable: "false")
			}

			column(name: "path", type: "varchar(200)") {
				constraints(nullable: "false")
			}

			column(name: "user_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "value", type: "longvarchar") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-12") {
		createTable(tableName: "requestmap") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "requestmapPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "config_attribute", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "url", type: "varchar(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-13") {
		createTable(tableName: "role") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "rolePK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "authority", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "varchar(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-14") {
		createTable(tableName: "role_people") {
			column(name: "person_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "role_id", type: "bigint") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-15") {
		createTable(tableName: "stack") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "stackPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "approved", type: "boolean")

			column(name: "description", type: "varchar(255)")

			column(name: "descriptor_url", type: "varchar(2083)")

			column(name: "image_url", type: "varchar(2083)")

			column(name: "name", type: "varchar(256)") {
				constraints(nullable: "false")
			}

			column(name: "owner_id", type: "bigint")

			column(name: "stack_context", type: "varchar(200)") {
				constraints(nullable: "false")
			}

			column(name: "unique_widget_count", type: "bigint", defaultValue: 0) {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-16") {
		createTable(tableName: "stack_groups") {
			column(name: "stack_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "group_id", type: "bigint") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-17") {
		createTable(tableName: "tag_links") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "tag_linksPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "editable", type: "boolean")

			column(name: "pos", type: "bigint")

			column(name: "tag_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "tag_ref", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "type", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "visible", type: "boolean")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-18") {
		createTable(tableName: "tags") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "tagsPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "name", type: "varchar(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-19") {
		createTable(tableName: "widget_def_intent") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "widget_def_inPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "intent_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "receive", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "send", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "widget_definition_id", type: "bigint") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-20") {
		createTable(tableName: "widget_def_intent_data_types") {
			column(name: "widget_definition_intent_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "intent_data_type_id", type: "bigint") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-21") {
		createTable(tableName: "widget_definition") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "widget_definiPK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "background", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "description", type: "varchar(255)")

			column(name: "descriptor_url", type: "varchar(2083)")

			column(name: "display_name", type: "varchar(256)") {
				constraints(nullable: "false")
			}

			column(name: "height", type: "integer") {
				constraints(nullable: "false")
			}

			column(name: "image_url_large", type: "varchar(2083)") {
				constraints(nullable: "false")
			}

			column(name: "image_url_small", type: "varchar(2083)") {
				constraints(nullable: "false")
			}

			column(name: "singleton", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "universal_name", type: "varchar(255)")

			column(name: "visible", type: "boolean") {
				constraints(nullable: "false")
			}

			column(name: "widget_guid", type: "varchar(255)") {
				constraints(nullable: "false")
			}

			column(name: "widget_url", type: "varchar(2083)") {
				constraints(nullable: "false")
			}

			column(name: "widget_version", type: "varchar(2083)")

			column(name: "width", type: "integer") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-22") {
		createTable(tableName: "widget_definition_widget_types") {
			column(name: "widget_definition_id", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "widget_type_id", type: "bigint") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-23") {
		createTable(tableName: "widget_type") {
			column(autoIncrement: "true", name: "id", type: "bigint") {
				constraints(nullable: "false", primaryKey: "true", primaryKeyName: "widget_typePK")
			}

			column(name: "version", type: "bigint") {
				constraints(nullable: "false")
			}

			column(name: "display_name", type: "varchar(255)")

			column(name: "name", type: "varchar(255)") {
				constraints(nullable: "false")
			}
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-24") {
		addPrimaryKey(columnNames: "intent_id, intent_data_type_id", tableName: "intent_data_types")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-25") {
		addPrimaryKey(columnNames: "group_id, person_id", tableName: "owf_group_people")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-26") {
		addPrimaryKey(columnNames: "role_id, person_id", tableName: "role_people")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-27") {
		addPrimaryKey(columnNames: "stack_id, group_id", tableName: "stack_groups")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-28") {
		addPrimaryKey(columnNames: "widget_definition_intent_id, intent_data_type_id", tableName: "widget_def_intent_data_types")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-29") {
		addPrimaryKey(columnNames: "widget_definition_id, widget_type_id", tableName: "widget_definition_widget_types")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-53") {
		createIndex(indexName: "app_config_group_name_idx", tableName: "application_configuration") {
			column(name: "group_name")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-54") {
		createIndex(indexName: "guid_uniq_1397859791019", tableName: "dashboard", unique: "true") {
			column(name: "guid")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-55") {
		createIndex(indexName: "action_uniq_1397859791023", tableName: "intent", unique: "true") {
			column(name: "action")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-56") {
		createIndex(indexName: "data_type_uniq_1397859791023", tableName: "intent_data_type", unique: "true") {
			column(name: "data_type")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-57") {
		createIndex(indexName: "username_uniq_1397859791030", tableName: "person", unique: "true") {
			column(name: "username")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "h2") {
		createIndex(indexName: "unique_widget_definition_id", tableName: "person_widget_definition", unique: "true") {
			column(name: "person_id")

			column(name: "widget_definition_id")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-59") {
		createIndex(indexName: "unique_user_id", tableName: "preference", unique: "true") {
			column(name: "path")

			column(name: "namespace")

			column(name: "user_id")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-60") {
		createIndex(indexName: "url_uniq_1397859791036", tableName: "requestmap", unique: "true") {
			column(name: "url")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-61") {
		createIndex(indexName: "authority_uniq_1397859791036", tableName: "role", unique: "true") {
			column(name: "authority")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-62") {
		createIndex(indexName: "stack_context_uniq_1397859791038", tableName: "stack", unique: "true") {
			column(name: "stack_context")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-63") {
		createIndex(indexName: "name_uniq_1397859791043", tableName: "tags", unique: "true") {
			column(name: "name")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-64") {
		createIndex(indexName: "widget_guid_uniq_1397859791046", tableName: "widget_definition", unique: "true") {
			column(name: "widget_guid")
		}
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-30") {
		addForeignKeyConstraint(baseColumnNames: "created_by_id", baseTableName: "dashboard", constraintName: "FKC18AEA94372CC5A", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-31") {
		addForeignKeyConstraint(baseColumnNames: "edited_by_id", baseTableName: "dashboard", constraintName: "FKC18AEA947028B8DB", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-32") {
		addForeignKeyConstraint(baseColumnNames: "stack_id", baseTableName: "dashboard", constraintName: "FKC18AEA946B3A1281", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "stack", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-33") {
		addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "dashboard", constraintName: "FKC18AEA948656347D", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-34") {
		addForeignKeyConstraint(baseColumnNames: "intent_data_type_id", baseTableName: "intent_data_types", constraintName: "FK708AE9273D8CCC47", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "intent_data_type", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-35") {
		addForeignKeyConstraint(baseColumnNames: "intent_id", baseTableName: "intent_data_types", constraintName: "FK708AE927A16C4753", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "intent", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-36") {
		addForeignKeyConstraint(baseColumnNames: "group_id", baseTableName: "owf_group_people", constraintName: "FK28113703B197B21", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "owf_group", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-37") {
		addForeignKeyConstraint(baseColumnNames: "person_id", baseTableName: "owf_group_people", constraintName: "FK2811370C1F5E0B3", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-38") {
		addForeignKeyConstraint(baseColumnNames: "person_id", baseTableName: "person_widget_definition", constraintName: "FK6F5C17C4C1F5E0B3", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-39") {
		addForeignKeyConstraint(baseColumnNames: "widget_definition_id", baseTableName: "person_widget_definition", constraintName: "FK6F5C17C4293A835C", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "widget_definition", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-40") {
		addForeignKeyConstraint(baseColumnNames: "user_id", baseTableName: "preference", constraintName: "FKA8FCBCDB8656347D", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-41") {
		addForeignKeyConstraint(baseColumnNames: "person_id", baseTableName: "role_people", constraintName: "FK28B75E78C1F5E0B3", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-42") {
		addForeignKeyConstraint(baseColumnNames: "role_id", baseTableName: "role_people", constraintName: "FK28B75E7870B353", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "role", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-43") {
		addForeignKeyConstraint(baseColumnNames: "owner_id", baseTableName: "stack", constraintName: "FK68AC288F23CE495", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "person", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-44") {
		addForeignKeyConstraint(baseColumnNames: "group_id", baseTableName: "stack_groups", constraintName: "FK9584AB6B3B197B21", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "owf_group", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-45") {
		addForeignKeyConstraint(baseColumnNames: "stack_id", baseTableName: "stack_groups", constraintName: "FK9584AB6B6B3A1281", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "stack", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-46") {
		addForeignKeyConstraint(baseColumnNames: "tag_id", baseTableName: "tag_links", constraintName: "FK7C35D6D45A3B441D", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "tags", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-47") {
		addForeignKeyConstraint(baseColumnNames: "intent_id", baseTableName: "widget_def_intent", constraintName: "FK7F13B8F1A16C4753", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "intent", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-48") {
		addForeignKeyConstraint(baseColumnNames: "widget_definition_id", baseTableName: "widget_def_intent", constraintName: "FK7F13B8F1293A835C", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "widget_definition", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-49") {
		addForeignKeyConstraint(baseColumnNames: "intent_data_type_id", baseTableName: "widget_def_intent_data_types", constraintName: "FKF59F0FB23D8CCC47", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "intent_data_type", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-50") {
		addForeignKeyConstraint(baseColumnNames: "widget_definition_intent_id", baseTableName: "widget_def_intent_data_types", constraintName: "FKF59F0FB29C4A9A19", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "widget_def_intent", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-51") {
		addForeignKeyConstraint(baseColumnNames: "widget_definition_id", baseTableName: "widget_definition_widget_types", constraintName: "FK8A59D92F293A835C", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "widget_definition", referencesUniqueColumn: "false")
	}

	changeSet(author: "owf", dbms: "h2", id: "7.10.0-h2-52") {
		addForeignKeyConstraint(baseColumnNames: "widget_type_id", baseTableName: "widget_definition_widget_types", constraintName: "FK8A59D92FD46C6F7C", deferrable: "false", initiallyDeferred: "false", referencedColumnNames: "id", referencedTableName: "widget_type", referencesUniqueColumn: "false")
	}
}
