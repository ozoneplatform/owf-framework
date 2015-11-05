databaseChangeLog = {
    changeSet(author: "owf", id: "7.16.1-0", dbms:"mssql", context: "create, upgrade, 7.16.1") {
        comment(text="allow role inserts")
        sql ( text = """
            SET IDENTITY_INSERT [dbo].[role] ON
        """)
    }

    changeSet(author: 'owf', id: '7.16.1-1', dbms: 'mysql, oracle, mssql, postgresql', context: 'create, upgrade, 7.16.1') {
        insert(tableName: "role") {
            column(name: "authority", value: "ROLE_USER")
            column(name: "description", value: "User Role")
            column(name: "id", value: "26")
            column(name: "version", value: "2")
        }

        insert(tableName: "role") {
            column(name: "authority", value: "ROLE_ADMIN")
            column(name: "description", value: "Admin Role")
            column(name: "id", value: "27")
            column(name: "version", value: "1")
        }
    }

    changeSet(author: 'owf', id: '7.16.1-1', dbms: 'hsqldb', context: 'create, upgrade, 7.16.1') {
        insert(tableName: "ROLE") {
            column(name: "authority", value: "ROLE_USER")
            column(name: "description", value: "User Role")
            column(name: "id", value: "26")
            column(name: "version", value: "2")
        }

        insert(tableName: "ROLE") {
            column(name: "authority", value: "ROLE_ADMIN")
            column(name: "description", value: "Admin Role")
            column(name: "id", value: "27")
            column(name: "version", value: "1")
        }
    }

    changeSet(author: 'owf', id: "7.16.1-2", context: "create, 7.16.1", dbms: 'postgresql') {
        comment("Updating the hibernate_sequence to account for hard coded ids")
        sql("""
            SELECT setval('hibernate_sequence', 200);
        """)
    }

    changeSet(author: 'owf', id: "7.16.1-2", context: "create, 7.16.1", dbms: 'oracle') {
        comment("Updating the hibernate_sequence to account for hard coded ids")
        sql("""
            ALTER SEQUENCE hibernate_sequence INCREMENT BY 186;
            SELECT hibernate_sequence.nextval FROM DUAL;
            ALTER SEQUENCE hibernate_sequence INCREMENT BY 1;
        """)
    }

    changeSet(author: "owf", id: "7.16.1-3", context: "create, upgrade, 7.16.1", dbms: 'mysql, hsqldb, oracle, mssql, postgresql') {
        createTable(tableName: "person_role") {
            column(name: "person_authorities_id", type: "bigint")

            column(name: "role_id", type: "bigint")
        }
    }

    changeSet(author: "owf", id: "7.16.1-4", context: "create, upgrade, 7.16.1", dbms: 'mysql, hsqldb, oracle, mssql, postgresql') {
        dropTable(tableName: "role_people")
    }

}

