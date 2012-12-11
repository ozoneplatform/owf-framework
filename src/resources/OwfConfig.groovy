environments {
    production {
        dataSource {
            dbCreate = "none"
            username = "sa"
            password = ""
            driverClassName = "org.hsqldb.jdbcDriver"
            url = "jdbc:hsqldb:file:prodDb;shutdown=true"
            pooled = true
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
        //enable uiperformance plugin which bundles and compresses javascript
        uiperformance.enabled = true

    }
}

//this section may modify any existing spring beans
beans {

}

//main owf config object
owf {

    // log4j file watch interval in milliseconds
    log4jWatchTime = 180000; // 3 minutes

    enablePendingApprovalWidgetTagGroup = false

    sendWidgetLoadTimesToServer = true
    publishWidgetLoadTimes = true

    //showLastLogin = false
    lastLoginDateFormat = 'n/j/Y G:i'

    defaultTheme = "a_default"

    showAccessAlert = "true"
    accessAlertMsg = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla interdum eleifend sapien dignissim malesuada. Sed imperdiet augue vitae justo feugiat eget porta est blandit. Proin ipsum ipsum, rutrum ac gravida in, ullamcorper a augue. Sed at scelerisque augue. Morbi scelerisque gravida sapien ut feugiat. Donec dictum, nisl commodo dapibus pellentesque, enim quam consectetur quam, at dictum dui augue at risus. Ut id nunc in justo molestie semper. Curabitur magna velit, varius eu porttitor et, tempor pulvinar nulla. Nam at tellus nec felis tincidunt fringilla. Nunc nisi sem, egestas ut consequat eget, luctus et nisi. Nulla et lorem odio, vitae pretium ipsum. Integer tellus libero, molestie a feugiat a, imperdiet sit amet metus. Aenean auctor fringilla eros, sit amet suscipit felis eleifend a."

    // Specifies a freeTextEntryMessage to appear on all dialogs which allow text entry
    // To turn off the warning message, use the following:
    //     freeTextEntryWarningMessage=''
    freeTextEntryWarningMessage=''

    //use to specify a logout url
    logoutURL = "/logout"

    //sets the autoSave interval for saving dashboards in milliseconds 900000 is 15 minutes
    autoSaveInterval = 900000

    helpFileRegex = '^.*\\.(htm|html|gsp|jsp|pdf|doc|docx|mov|mp4|wmv)$'

    //this value controls whether the OWF UI uses shims on floating elements, setting this to true will make
    //Applet/Flex have less zindex issues, but browser performance may suffer due to the additional shim frames being created
    useShims = false

  //Locations for the optional external themes and help directories.
  //Default: 'themes', 'help', and 'js-plugins' directories on the classpath.
  //Can be configured to an arbitrary file path.  The following
  //path styles are supported:
  //  'file:/some/absolute/path' ('file:C:/some/absolute/path' on Windows)
  //  'classpath:location/under/classpath'
  //  'location/within/OWF/war/file'
    external{
        themePath = 'classpath:themes'
        helpPath = 'classpath:help'
        jsPluginPath = 'classpath:js-plugins'
    }

	// Optional Configuration elements for custom headers/footers.
	// Example values are shown.  File locations are relative or absolute paths to
	// resources hosted on the owf web server.  Heights are in pixel amounts.
	//customHeaderFooter {
	//	header = 'location/within/web/context/example.html'
	//	headerHeight = 0
	//	footer = 'location/within/web/context/example.html'
	//	footerHeight = 0
	//	jsImports = ['location/for/exampleImport1.js', 'location/for/exampleImport2.js']
	//	cssImports = ['location/for/exampleImport1.css', 'location/for/exampleImport2.css']
	//}

  metric {
    enabled = false
    url = 'https://localhost:8443/metric/metric'

    //Optional additional properties with default values shown
    //keystorePath = System.properties['javax.net.ssl.keyStore']
    //keystorePass = System.properties['javax.net.ssl.keyStorePassword']
    //truststorePath = System.properties['javax.net.ssl.trustStore']
    //timeout = 1800000
  }
}


println('OwfConfig.groovy completed successfully.')
