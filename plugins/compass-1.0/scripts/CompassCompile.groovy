
target(default:"Compile the theme") {
    depends(clean, compile)
}
target(clean:"Clean out things") {
    ant.delete(dir:"output")
}

target(compile:"Compile the directory") {
	compassPluginCompile()
}

public void compassPluginCompile() {
	ant.path(id: 'jruby.classpath') { 
		pathelement(location: "${compassPluginDir}/libs/jruby-complete-1.7.0.jar") 
	}
	new File("web-app/themes").eachFile { file ->
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