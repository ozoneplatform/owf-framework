databaseChangeLog = {

    changeSet(author: 'owf', id: '7.16.1-1', dbms: 'mysql, hsqldb, oracle, mssql, postgresql', context: 'create, upgrade, 7.16.1') {
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

}

