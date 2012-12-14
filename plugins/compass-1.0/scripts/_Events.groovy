includeTargets << new File("${compassPluginDir}/scripts/CompassCompile.groovy")

eventCreateWarStart = { name, stagingDir ->
	// someday, figure a way to just call compassPluginCompile() from CompassCompile.groovy
	ant.path(id: 'jruby.classpath') { 
		pathelement(location: "${compassPluginDir}/lib/jruby-complete-1.7.0.jar") 
	}
	new File("web-app/themes").eachFile { file ->
		if(file.isDirectory() && file.name.endsWith(".theme")) {
			println "Building ${file}"
			ant.java(classname:"org.jruby.Main", 
					fork:true, 
					failonerror:true, 
					classpathref: 'jruby.classpath',
					dir: file
			) {
					env(key: "GEM_HOME", value: "${compassPluginDir}/lib/gems")
					arg(value: "--1.8")
					arg(value:"${compassPluginDir}/lib/gems/bin/compass")
					arg(value:"compile")
					arg(value: "-c")
					arg(value: "sass/config.rb")
			}
		}
	}
}