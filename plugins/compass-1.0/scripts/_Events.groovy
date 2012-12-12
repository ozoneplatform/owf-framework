includeTargets << new File("${compassPluginDir}/scripts/CompassCompile.groovy")

private compileThemes = { dir ->
	dir.eachFile { file ->
		if(file.isDirectory() && file.name.endsWith(".theme")) {
			println "Building ${file}"
			ant.java(classname:"org.jruby.Main", 
					fork:true, 
					failonerror:true, 
					classpathref: 'jruby.classpath',
					dir: new File(file.getPath() + '/sass')
			) {
					env(key: "GEM_HOME", value: "${compassPluginDir}/libs/gems")
					arg(value: "--1.8")
					arg(value:"${compassPluginDir}/libs/gems/bin/compass")
					arg(value:"compile")
			}
		}
	}
}

eventCreateWarStart = { name, stagingDir ->
	// someday, figure a way to just call compassPluginCompile() from CompassCompile.groovy
	ant.path(id: 'jruby.classpath') { 
		pathelement(location: "${compassPluginDir}/libs/jruby-complete-1.7.0.jar") 
	}
	
	compileThemes(new File("web-app/themes"))
	println "compiling stylesheets in external themes dir"
	compileThemes(new File("themes"))
}