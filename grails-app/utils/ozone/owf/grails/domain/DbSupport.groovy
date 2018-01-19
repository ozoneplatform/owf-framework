package ozone.owf.grails.domain

import groovy.transform.CompileStatic

import grails.util.Holders


@CompileStatic
class DbSupport {

    private static String _dialect

    static String getBigStringType() {
        // examine which hibernate dialect is selected, and pick
        // an appropriate type mapping for that database type:
        switch (dialect) {
            case "org.hibernate.dialect.SQLServerDialect":
                return "nvarchar"

            case "org.hibernate.dialect.Oracle10gDialect":
            case "org.hibernate.dialect.Oracle12cDialect":
            case "org.hibernate.dialect.OracleDialect":
                return "clob"

            default:
                return ""
        }
    }

    private static String getDialect() {
        if (!_dialect) {
            _dialect = Holders.config.getProperty('dataSource.dialect', String)
        }
        _dialect
    }

}
