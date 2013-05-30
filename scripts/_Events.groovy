//import grails.util.Metadata
//import org.mortbay.jetty.webapp.*
//import org.mortbay.jetty.handler.*

private compileStyleSheets = { dir ->
  def ant = new AntBuilder()   // create an antbuilder
  if (System.properties['os.name'].toLowerCase().contains('windows')) {
    ant.exec(
            failonerror: "true",
            dir: "${dir}/themes",
            executable: 'cmd') {

      arg(value: "/c")
      arg(value: "compile_all_themes.bat")
    }
  }
  else {
    ant.exec(
            failonerror: "true",
            dir: "${dir}/themes",
            executable: 'bash') {

      arg(value: "-l")
      arg(value: "compile_all_themes.sh")
    }
  }

  //delete cache files
  ant.delete(includeemptydirs:true) {
    fileset(dir:"${dir}") {
      include(name:"**/.sass-cache/**")
    }
  }

  println "finished compiling sass stylesheets"
}

eventRunAppHttpsStart = {
  def baseWebDir = "${basedir}/web-app"

  if (!System.properties.skipSassCompile) {
    println "compiling sass stylesheets - ruby, compass, and sass must be installed"
    println "compiling stylesheets in web-app"
    compileStyleSheets(baseWebDir)

    println "compiling stylesheets in external themes dir"
    compileStyleSheets(basedir)
  }
}

eventRunAppStart = {
  def baseWebDir = "${basedir}/web-app"

  if (!System.properties.skipSassCompile) {
    println "compiling sass stylesheets - ruby, compass, and sass must be installed"
    println "compiling stylesheets in web-app"
    compileStyleSheets(baseWebDir)

    println "compiling stylesheets in external themes dir"
    compileStyleSheets(basedir)
  }
}

eventCreateWarStart = { name, stagingDir ->
//  compileStyleSheets(stagingDir)

  println "copying help for help into war"

    def baseWebDir = "${basedir}/web-app"
    ant.copy(todir: "${baseWebDir}/help") {
      fileset(dir: "${basedir}/docs-internal") {
        include(name: "Instructions_for_configuring_Help_content.pdf")
        include(name: "Keyboard Navigation.pdf")
      }
    }
    ant.copy(todir: "${stagingDir}/help") {
      fileset(dir: "${basedir}/docs-internal") {
        include(name: "Instructions_for_configuring_Help_content.pdf")
        include(name: "Keyboard Navigation.pdf")
      }
    }

  println "finished help for help into war"

  println "making owf-all.jar"

      //jar up all files in WEB-INF/classes and put into WEB-INF/lib/owf-all.jar
      ant.jar(destfile:"${stagingDir}/WEB-INF/lib/owf-all.jar", update:false) {
        fileset(dir:"${stagingDir}/WEB-INF/classes") {
          exclude(name:"**/gsp_*.*")
          exclude(name:"**/*.properties")
          exclude(name:"**/*.xml")
          exclude(name:"**/.gitignore")
        }
      }

      ant.delete(includeemptydirs:true) {
        fileset(dir:"${stagingDir}/WEB-INF/classes") {
          exclude(name:"**/gsp_*.*")
          exclude(name:"**/*.properties")
          exclude(name:"**/*.xml")
        }
      }

  println "finished making owf-all.jar"

  // Copy descriptor template into war stage in such a way that it will
  // always be in the CLASSPATH when deployed
  ant.copy(file: "${basedir}/src/resources/empty_descriptor.html",
           todir: "${stagingDir}/WEB-INF/classes")
}

//eventConfigureJetty = { server ->
//    if(argsMap.https) {
//        println("Using https")
//        def connectors = server.getConnectors().toList()
//            if (connectors.size() > 1) {
//                def secureListener = connectors[1]
//
//
//                if (fakeUser()) {
//                    println "Not flipping the bit, no certs required"
//                    secureListener.setWantClientAuth(false)
//                } else {
//                    println "Flipping the bit on our secure connector to request client auth..."
//                    secureListener.setWantClientAuth(true)
//                }
//                secureListener.setNeedClientAuth(false)
//
//                println "Swapping in our own key/trust stores.."
//                secureListener.setKeystore("${basedir}/certs/keystore.jks")
//                secureListener.setPassword("changeit")
//                secureListener.setKeyPassword("changeit")
//                secureListener.setKeystoreType("JKS")
//                secureListener.setTruststore("${basedir}/certs/keystore.jks")
//                secureListener.setTrustPassword("changeit")
//                secureListener.setMaxIdleTime(50000)
//
//        }
//
//        //TODO: make the development environments configurable
//        if (fakeUser()) {
//            println ("CAS is not being loaded")
//        } else {
//              loadCasWar(server)
//        }
//
//    }
//    else {
//        println("Not using https")
//    }
//
//}
//
//private Boolean fakeUser() {
//    if (grailsSettings.grailsEnv == "development" && (['testUser1','testAdmin1'].contains(System.properties.user))) {
//        return true
//    } else {
//        return false
//    }
//}
//
//private void loadCasWar(server) {
//    // parse the version from application.properties.  Assumes cas-server-owf has same version
//    // may be a better way to get the app.version, but I couldn't find it.  This will at least throw
//    // an exception if the file doesn't exist
//    def version = Metadata.getInstance(new File("${basedir}/application.properties")).getApplicationVersion()
//    def casWarLocation = "${basedir}/../cas-server-owf/target/cas-server-owf-${version}.war"
//    println "Loading CAS application..."
//    if (!(new File(casWarLocation).exists())) {
//        throw new RuntimeException("CAS war does not exist in ${casWarLocation}.  You can not run ${grailsSettings.grailsEnv} environment over https without CAS.  Please go to cas-server-owf and run mvn package")
//    }
//
//
//    // check to see if Marketplace is being loaded also
//    // Currently, marketplace can not be loaded if using testUser1 or testAdmin1
//    // TODO: fix this
//    def marketplaceWarLocation = null
//    if (System.properties.marketplace.toString() == "true") {
//        // TODO: currently no message is given if you just run -Dmarketplace without -https.  Probably should be more friendly
//        println "Loading Marketplace application..."
//        def mp_version = Metadata.getInstance(new File("${basedir}/application.properties")).getProperty("marketplace.version")
//        marketplaceWarLocation = "${basedir}/../marketplace/target/marketplace-${mp_version}.war"
//        if (!(new File(marketplaceWarLocation).exists())) {
//            throw new RuntimeException("Marketplace war does not exist in ${marketplaceWarLocation}.  Please go to marketplace directory and run mvn package")
//        }
//    } else {
//        println "Not loading Marketplace"
//    }
//
//
//    // Goofy rewiring of Jetty context handlers.  Since the default context is
//    // just "/", it stops looking for any other contexts.  These hoops are
//    // jumped through to reorder the contexts, putting CAS first so that it
//    // gets found.  See http://stateyourbizness.blogspot.com/2008/08/deploying-additional-wars-with-your.html
//    def grailsApp = server.handler
//    server.removeHandler(grailsApp)
//
//    def handlers = []
//    handlers << grailsApp
//    ContextHandlerCollection contextHandlerCollection = new ContextHandlerCollection()
//
//    WebAppContext casContext = new WebAppContext(casWarLocation, "/cas")
//    handlers << casContext
//
//    if (marketplaceWarLocation) {
//        WebAppContext marketplaceContext = new WebAppContext(marketplaceWarLocation, "/markeplace")
//        handlers << marketplaceContext
//    }
//
//    handlers.each {
//        contextHandlerCollection.addHandler(it)
//    }
//
//    server.setHandlers(contextHandlerCollection)
//}
