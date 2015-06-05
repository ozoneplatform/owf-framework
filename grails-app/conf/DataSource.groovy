//Be aware that this file gets merged with information from the inserted PrefsConfig.groovys

dataSource {
	pooled = true
	driverClassName = "org.hsqldb.jdbcDriver"
	username = "sa"
	password = ""
}

hibernate {
    cache.use_second_level_cache=true
    cache.use_query_cache=true
    cache.provider_class='net.sf.ehcache.hibernate.EhCacheProvider'
    // format_sql = true
}

// environment specific settings
environments {
	development {
		dataSource {
            pooled = false
            url = "jdbc:hsqldb:file:prodDb;shutdown=true"
            dbCreate = "none" // one of 'create', 'create-drop','update
        }

        hibernate {
            cache.use_second_level_cache = false
            cache.use_query_cache = false
        }
    }
	test {
		dataSource {
			dbCreate = "create-drop"
			url = "jdbc:hsqldb:mem:testDb"
		}
	}
	production {
		dataSource {
            pooled = true
			url = "jdbc:hsqldb:file:prodDb;shutdown=true"
            dbCreate = "none"
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS"
		}
	}
    }
    with_hsql {
        dataSource {
            pooled = true
            dbCreate="none"
            url = "jdbc:hsqldb:file:prodDb;shutdown=true"
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS"
            }
        }
    }
    with_hsql_empty {
        dataSource {
            pooled = true
            dbCreate="none"
            url = "jdbc:hsqldb:mem:emptyDb"
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1 FROM INFORMATION_SCHEMA.SYSTEM_USERS"
            }
        }
    }
    with_mysql  {
        dataSource {
            pooled = true
            dbCreate = "none"
            driverClassName = "com.mysql.jdbc.Driver"
            url="jdbc:mysql://owfdb01:3306/owf_build"
            username = "owfbuild"
            password = "0wf-bu1!d"
            dialect = "org.hibernate.dialect.MySQL5InnoDBDialect"
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1"
            }
        }
    }
    with_mysql_empty  {
        dataSource {
            pooled = true
            dbCreate = "none"
            driverClassName = "com.mysql.jdbc.Driver"
            url="jdbc:mysql://owfdb01:3306/owf_empty"
            username = "owfbuild"
            password = "0wf-bu1!d"
            dialect = "org.hibernate.dialect.MySQL5InnoDBDialect"
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1"
            }
        }
    }
    with_oracle {
        dataSource {
            pooled = true
            dbCreate="none"
            driverClassName="oracle.jdbc.OracleDriver"
            url="jdbc:oracle:thin:@owfdb03.goss.owfgoss.org:1521:XE"
            username="OWF_BLD"
            password = "OWF_BLD"
            dialect="org.hibernate.dialect.Oracle10gDialect"
            // dialect='org.hibernate.dialect.Oracle9Dialect'
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1 FROM DUAL"
            }
        }
    }
    with_oracle {
        dataSource {
            pooled = true
            dbCreate="none"
            driverClassName="oracle.jdbc.OracleDriver"
            url="jdbc:oracle:thin:@owfdb03.goss.owfgoss.org:1521:XE"
            username="OWF_BLD"
            password = "OWF_BLD"
            dialect="org.hibernate.dialect.Oracle10gDialect"
            // dialect='org.hibernate.dialect.Oracle9Dialect'
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1 FROM DUAL"
            }
        }
    }
    with_oracle_empty {
        dataSource {
            pooled = true
            dbCreate="none"
            driverClassName="oracle.jdbc.OracleDriver"
            url="jdbc:oracle:thin:@owfdb03.goss.owfgoss.org:1521:XE"
            username="OWF_EMPTY"
            password = "OWF_EMPTY"
            dialect="org.hibernate.dialect.Oracle10gDialect"
            // dialect='org.hibernate.dialect.Oracle9Dialect'
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1 FROM DUAL"
            }
        }
    }
    with_postgres {
        dataSource {
            pooled = true
            dbCreate = "none"
            username="owfbuild"
            password = "0wf-bu1!d"
            driverClassName = "org.postgresql.Driver"
            url = "jdbc:postgresql://owfdb02:5432/owf_build"
            dialect="org.hibernate.dialect.PostgreSQLDialect"
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1"
            }

        }
    }
    with_postgres_empty {
        dataSource {
            pooled = true
            dbCreate = "none"
            username="owfbuild"
            password = "0wf-bu1!d"
            driverClassName = "org.postgresql.Driver"
            url = "jdbc:postgresql://owfdb02:5432/owf_empty"
            dialect="org.hibernate.dialect.PostgreSQLDialect"
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1"
            }

        }
    }
    with_sql_server {
        dataSource {
            pooled = true
            dbCreate = "none"
            driverClassName = "net.sourceforge.jtds.jdbc.Driver"
            url = "jdbc:jtds:sqlserver://owfdb02:1443/owf_build"
            username="owfbuild"
            password = "0wf-bu1!d"
            dialect="ozone.owf.hibernate.OWFSQLServerDialect"
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1"
            }
        }
    }
    with_sql_server_empty {
        dataSource {
            pooled = true
            dbCreate = "none"
            driverClassName = "net.sourceforge.jtds.jdbc.Driver"
            url = "jdbc:jtds:sqlserver://owfdb02:1443/owf_empty"
            username="owfbuild"
            password = "0wf-bu1!d"
            dialect="ozone.owf.hibernate.OWFSQLServerDialect"
            properties {
                minEvictableIdleTimeMillis = 180000
                timeBetweenEvictionRunsMillis = 180000
                numTestsPerEvictionRun = 3
                testOnBorrow = true
                testWhileIdle = true
                testOnReturn = true
                validationQuery = "SELECT 1"
            }
        }
    }
}
