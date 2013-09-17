databaseChangeLog = {
    include file: "app_config.groovy"

    changeSet(author: "owf", id: "7.4-1", context: "create, 7.4, upgrade") {
        addDefaultValue(tableName: "application_configuration", columnName: "version", defaultValueNumeric: 0)
    }

    changeSet(author: "owf", id: "7.4-2", context: "create, upgrade, 7.4") {
        comment("Add isApproved to stack")
        addColumn(tableName: "stack") {
            column(name: "approved", type: "java.sql.Types.BOOLEAN") {
                constraints(nullable: "true")
            }
        }
    }

    changeSet(author: "owf", id: "7.4-3", context: "sampleData, 7.4-sampleData") {
        comment("Add isApproved to stack")
        update(tableName: "stack") {
            column(name: "approved", valueBoolean: true)
            where("name = 'Investments' OR name = 'Administration' OR name = 'Sample'")
        }
    }

    // Create an admin group at creation time.  Upgrades are expected to have this group already.
    changeSet(author: "owf", id: "7.4-4", context: "create") {
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

    changeSet(author: "owf", id: "7.4-5", context: "create, upgrade, 7.4") {
        comment(text="Create Administrator's App and its default group.")

        insert(tableName: "stack") {
            column(name: "version", valueNumeric: "1")
            column(name: "name", value: "Administration")
            column(name: "description", value: "This application collects the administrative components into a common set of application pages for managing system resources.  These pages can be used to create, modify, update, and delete Apps, App Components, Users & Groups, and system configuration settings.")
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

    changeSet(author: "owf", id: "7.4-6", context: "create, upgrade, 7.4") {
        comment(text="Add Administration App to the OWF Administrators group.")

        insert(tableName: "stack_groups") {
            column(name: "group_id", valueComputed: "(SELECT id FROM owf_group WHERE name='OWF Administrators')")
            column(name: "stack_id", valueComputed: "(SELECT id FROM stack WHERE stack_context='ef8b5d6f-4b16-4743-9a57-31683c94b616')")
        }

    }

    changeSet(author: "owf", id: "7.4-7", context: "create") {
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

    // On upgrades, allow the
    changeSet(author: "owf", id: "7.4-8", context: "upgrade, 7.4") {
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

    changeSet(author: "owf", id: "7.4-9", context: "create, upgrade, 7.4") {
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
            column(name: "name", value: "Users & Groups")
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

    changeSet(author: "owf", id: "7.4-10", context: "create, upgrade, 7.4") {
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

    changeSet(author: "owf", id: "7.4-11", context: "create, upgrade, 7.4") {
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

    changeSet(author: "owf", id: "7.4-12", context: "sampleData, 7.4-sampleData") {

        comment("Remove the old admin dashboard.")

        delete(tableName: "dashboard") {
            where("guid='54949b5d-f0ee-4347-811e-2522a1bf96fe' AND user_id IS NULL AND name='Administration'")
        }

    }

    String adminWidgetUrlList = "'admin/UserManagement.gsp', 'admin/UserEdit.gsp', 'admin/WidgetManagement.gsp', 'admin/WidgetEdit.gsp', 'admin/GroupManagement.gsp', 'admin/GroupEdit.gsp', 'admin/DashboardEdit.gsp', 'admin/StackManagement.gsp', 'admin/StackEdit.gsp', 'admin/Configuration.gsp'"

    changeSet(author: "owf", id: "7.4-13", context: "upgrade, 7.4") {

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
}