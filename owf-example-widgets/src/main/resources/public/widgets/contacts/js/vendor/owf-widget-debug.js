/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

;(function(){

	/*
	dojo, dijit, and dojox must always be the first three, and in that order.
	djConfig.scopeMap = [
		["dojo", "fojo"],
		["dijit", "fijit"],
		["dojox", "fojox"]
	
	]
	*/

	eval("var djConfig = {scopeMap:[[\"dojo\",\"owfdojo\"],[\"dijit\",\"owfdijit\"],[\"dojox\",\"owfdojox\"]]};");

	//The null below can be relaced by a build-time value used instead of djConfig.scopeMap.
	var sMap = null;

	//See if new scopes need to be defined.
	if((sMap || (typeof djConfig != "undefined" && djConfig.scopeMap)) && (typeof window != "undefined")){
		var scopeDef = "", scopePrefix = "", scopeSuffix = "", scopeMap = {}, scopeMapRev = {};
		sMap = sMap || djConfig.scopeMap;
		for(var i = 0; i < sMap.length; i++){
			//Make local variables, then global variables that use the locals.
			var newScope = sMap[i];
			scopeDef += "var " + newScope[0] + " = {}; " + newScope[1] + " = " + newScope[0] + ";" + newScope[1] + "._scopeName = '" + newScope[1] + "';";
			scopePrefix += (i == 0 ? "" : ",") + newScope[0];
			scopeSuffix += (i == 0 ? "" : ",") + newScope[1];
			scopeMap[newScope[0]] = newScope[1];
			scopeMapRev[newScope[1]] = newScope[0];
		}

		eval(scopeDef + "dojo._scopeArgs = [" + scopeSuffix + "];");

		dojo._scopePrefixArgs = scopePrefix;
		dojo._scopePrefix = "(function(" + scopePrefix + "){";
		dojo._scopeSuffix = "})(" + scopeSuffix + ")";
		dojo._scopeMap = scopeMap;
		dojo._scopeMapRev = scopeMapRev;
	}

/*=====
// note:
//		'djConfig' does not exist under 'dojo.*' so that it can be set before the
//		'dojo' variable exists.
// note:
//		Setting any of these variables *after* the library has loaded does
//		nothing at all.

djConfig = {
	// summary:
	//		Application code can set the global 'djConfig' prior to loading
	//		the library to override certain global settings for how dojo works.
	//
	// isDebug: Boolean
	//		Defaults to `false`. If set to `true`, ensures that Dojo provides
	//		extended debugging feedback via Firebug. If Firebug is not available
	//		on your platform, setting `isDebug` to `true` will force Dojo to
	//		pull in (and display) the version of Firebug Lite which is
	//		integrated into the Dojo distribution, thereby always providing a
	//		debugging/logging console when `isDebug` is enabled. Note that
	//		Firebug's `console.*` methods are ALWAYS defined by Dojo. If
	//		`isDebug` is false and you are on a platform without Firebug, these
	//		methods will be defined as no-ops.
	isDebug: false,
	// debugAtAllCosts: Boolean
	//		Defaults to `false`. If set to `true`, this triggers an alternate
	//		mode of the package system in which dependencies are detected and
	//		only then are resources evaluated in dependency order via
	//		`<script>` tag inclusion. This may double-request resources and
	//		cause problems with scripts which expect `dojo.require()` to
	//		preform synchronously. `debugAtAllCosts` can be an invaluable
	//		debugging aid, but when using it, ensure that all code which
	//		depends on Dojo modules is wrapped in `dojo.addOnLoad()` handlers.
	//		Due to the somewhat unpredictable side-effects of using
	//		`debugAtAllCosts`, it is strongly recommended that you enable this
	//		flag as a last resort. `debugAtAllCosts` has no effect when loading
	//		resources across domains. For usage information, see the
	//		[Dojo Book](http://dojotoolkit.org/book/book-dojo/part-4-meta-dojo-making-your-dojo-code-run-faster-and-better/debugging-facilities/deb)
	debugAtAllCosts: false,
	// locale: String
	//		The locale to assume for loading localized resources in this page,
	//		specified according to [RFC 3066](http://www.ietf.org/rfc/rfc3066.txt).
	//		Must be specified entirely in lowercase, e.g. `en-us` and `zh-cn`.
	//		See the documentation for `dojo.i18n` and `dojo.requireLocalization`
	//		for details on loading localized resources. If no locale is specified,
	//		Dojo assumes the locale of the user agent, according to `navigator.userLanguage`
	//		or `navigator.language` properties.
	locale: undefined,
	// extraLocale: Array
	//		No default value. Specifies additional locales whose
	//		resources should also be loaded alongside the default locale when
	//		calls to `dojo.requireLocalization()` are processed.
	extraLocale: undefined,
	// baseUrl: String
	//		The directory in which `dojo.js` is located. Under normal
	//		conditions, Dojo auto-detects the correct location from which it
	//		was loaded. You may need to manually configure `baseUrl` in cases
	//		where you have renamed `dojo.js` or in which `<base>` tags confuse
	//		some browsers (e.g. IE 6). The variable `dojo.baseUrl` is assigned
	//		either the value of `djConfig.baseUrl` if one is provided or the
	//		auto-detected root if not. Other modules are located relative to
	//		this path. The path should end in a slash.
	baseUrl: undefined,
	// modulePaths: Object
	//		A map of module names to paths relative to `dojo.baseUrl`. The
	//		key/value pairs correspond directly to the arguments which
	//		`dojo.registerModulePath` accepts. Specifiying
	//		`djConfig.modulePaths = { "foo": "../../bar" }` is the equivalent
	//		of calling `dojo.registerModulePath("foo", "../../bar");`. Multiple
	//		modules may be configured via `djConfig.modulePaths`.
	modulePaths: {},
	// afterOnLoad: Boolean 
	//		Indicates Dojo was added to the page after the page load. In this case
	//		Dojo will not wait for the page DOMContentLoad/load events and fire
	//		its dojo.addOnLoad callbacks after making sure all outstanding
	//		dojo.required modules have loaded. Only works with a built dojo.js,
	//		it does not work the dojo.js directly from source control.
	afterOnLoad: false,
	// addOnLoad: Function or Array
	//		Adds a callback via dojo.addOnLoad. Useful when Dojo is added after
	//		the page loads and djConfig.afterOnLoad is true. Supports the same
	//		arguments as dojo.addOnLoad. When using a function reference, use
	//		`djConfig.addOnLoad = function(){};`. For object with function name use
	//		`djConfig.addOnLoad = [myObject, "functionName"];` and for object with
	//		function reference use
	//		`djConfig.addOnLoad = [myObject, function(){}];`
	addOnLoad: null,
	// require: Array
	//		An array of module names to be loaded immediately after dojo.js has been included
	//		in a page.
	require: [],
	// defaultDuration: Array
	//		Default duration, in milliseconds, for wipe and fade animations within dijits.
	//		Assigned to dijit.defaultDuration.
	defaultDuration: 200,
	// dojoBlankHtmlUrl: String
	//		Used by some modules to configure an empty iframe. Used by dojo.io.iframe and
	//		dojo.back, and dijit popup support in IE where an iframe is needed to make sure native
	//		controls do not bleed through the popups. Normally this configuration variable 
	//		does not need to be set, except when using cross-domain/CDN Dojo builds.
	//		Save dojo/resources/blank.html to your domain and set `djConfig.dojoBlankHtmlUrl`
	//		to the path on your domain your copy of blank.html.
	dojoBlankHtmlUrl: undefined,
	//	ioPublish: Boolean?
	//		Set this to true to enable publishing of topics for the different phases of
	// 		IO operations. Publishing is done via dojo.publish. See dojo.__IoPublish for a list
	// 		of topics that are published.
	ioPublish: false,
	//  useCustomLogger: Anything?
	//		If set to a value that evaluates to true such as a string or array and
	//		isDebug is true and Firebug is not available or running, then it bypasses
	//		the creation of Firebug Lite allowing you to define your own console object.
	useCustomLogger: undefined,
	// transparentColor: Array
	//		Array containing the r, g, b components used as transparent color in dojo.Color;
	//		if undefined, [255,255,255] (white) will be used.
	transparentColor: undefined,
	// skipIeDomLoaded: Boolean
	//		For IE only, skip the DOMContentLoaded hack used. Sometimes it can cause an Operation
	//		Aborted error if the rest of the page triggers script defers before the DOM is ready.
	//		If this is config value is set to true, then dojo.addOnLoad callbacks will not be
	//		triggered until the page load event, which is after images and iframes load. If you
	//		want to trigger the callbacks sooner, you can put a script block in the bottom of
	//		your HTML that calls dojo._loadInit();. If you are using multiversion support, change
	//		"dojo." to the appropriate scope name for dojo.
	skipIeDomLoaded: false
}
=====*/

(function(){
	// firebug stubs

	if(typeof this["loadFirebugConsole"] == "function"){
		// for Firebug 1.2
		this["loadFirebugConsole"]();
	}else{
		this.console = this.console || {};

		//	Be careful to leave 'log' always at the end
		var cn = [
			"assert", "count", "debug", "dir", "dirxml", "error", "group",
			"groupEnd", "info", "profile", "profileEnd", "time", "timeEnd",
			"trace", "warn", "log"
		];
		var i=0, tn;
		while((tn=cn[i++])){
			if(!console[tn]){
				(function(){
					var tcn = tn+"";
					console[tcn] = ('log' in console) ? function(){
						var a = Array.apply({}, arguments);
						a.unshift(tcn+":");
						console["log"](a.join(" "));
					} : function(){}
					console[tcn]._fake = true;
				})();
			}
		}
	}

	//TODOC:  HOW TO DOC THIS?
	// dojo is the root variable of (almost all) our public symbols -- make sure it is defined.
	if(typeof dojo == "undefined"){
		dojo = {
			_scopeName: "dojo",
			_scopePrefix: "",
			_scopePrefixArgs: "",
			_scopeSuffix: "",
			_scopeMap: {},
			_scopeMapRev: {}
		};
	}

	var d = dojo;

	//Need placeholders for dijit and dojox for scoping code.
	if(typeof dijit == "undefined"){
		dijit = {_scopeName: "dijit"};
	}
	if(typeof dojox == "undefined"){
		dojox = {_scopeName: "dojox"};
	}

	if(!d._scopeArgs){
		d._scopeArgs = [dojo, dijit, dojox];
	}

/*=====
dojo.global = {
	//	summary:
	//		Alias for the global scope
	//		(e.g. the window object in a browser).
	//	description:
	//		Refer to 'dojo.global' rather than referring to window to ensure your
	//		code runs correctly in contexts other than web browsers (e.g. Rhino on a server).
}
=====*/
	d.global = this;

	d.config =/*===== djConfig = =====*/{
		isDebug: false,
		debugAtAllCosts: false
	};

	if(typeof djConfig != "undefined"){
		for(var opt in djConfig){
			d.config[opt] = djConfig[opt];
		}
	}

/*=====
	// Override locale setting, if specified
	dojo.locale = {
		// summary: the locale as defined by Dojo (read-only)
	};
=====*/
	dojo.locale = d.config.locale;

	var rev = "$Rev: 22487 $".match(/\d+/);

/*=====
	dojo.version = function(){
		// summary:
		//		Version number of the Dojo Toolkit
		// major: Integer
		//		Major version. If total version is "1.2.0beta1", will be 1
		// minor: Integer
		//		Minor version. If total version is "1.2.0beta1", will be 2
		// patch: Integer
		//		Patch version. If total version is "1.2.0beta1", will be 0
		// flag: String
		//		Descriptor flag. If total version is "1.2.0beta1", will be "beta1"
		// revision: Number
		//		The SVN rev from which dojo was pulled
		this.major = 0;
		this.minor = 0;
		this.patch = 0;
		this.flag = "";
		this.revision = 0;
	}
=====*/
	dojo.version = {
		major: 1, minor: 0, patch: 0, flag: "",
		revision: rev ? +rev[0] : NaN,
		toString: function(){
			with(d.version){
				return major + "." + minor + "." + patch + flag + " (" + revision + ")";	// String
			}
		}
	}

		// Register with the OpenAjax hub
	if(typeof OpenAjax != "undefined"){
		OpenAjax.hub.registerLibrary(dojo._scopeName, "http://dojotoolkit.org", d.version.toString());
	}
	
	var extraNames, extraLen, empty = {};
	for(var i in {toString: 1}){ extraNames = []; break; }
	dojo._extraNames = extraNames = extraNames || ["hasOwnProperty", "valueOf", "isPrototypeOf",
		"propertyIsEnumerable", "toLocaleString", "toString", "constructor"];
	extraLen = extraNames.length;

	dojo._mixin = function(/*Object*/ target, /*Object*/ source){
		// summary:
		//		Adds all properties and methods of source to target. This addition
		//		is "prototype extension safe", so that instances of objects
		//		will not pass along prototype defaults.
		var name, s, i;
		for(name in source){
			// the "tobj" condition avoid copying properties in "source"
			// inherited from Object.prototype.  For example, if target has a custom
			// toString() method, don't overwrite it with the toString() method
			// that source inherited from Object.prototype
			s = source[name];
			if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
				target[name] = s;
			}
		}
				// IE doesn't recognize some custom functions in for..in
		if(extraLen && source){
			for(i = 0; i < extraLen; ++i){
				name = extraNames[i];
				s = source[name];
				if(!(name in target) || (target[name] !== s && (!(name in empty) || empty[name] !== s))){
					target[name] = s;
				}
			}
		}
				return target; // Object
	}

	dojo.mixin = function(/*Object*/obj, /*Object...*/props){
		// summary:
		//		Adds all properties and methods of props to obj and returns the
		//		(now modified) obj.
		//	description:
		//		`dojo.mixin` can mix multiple source objects into a
		//		destination object which is then returned. Unlike regular
		//		`for...in` iteration, `dojo.mixin` is also smart about avoiding
		//		extensions which other toolkits may unwisely add to the root
		//		object prototype
		//	obj:
		//		The object to mix properties into. Also the return value.
		//	props:
		//		One or more objects whose values are successively copied into
		//		obj. If more than one of these objects contain the same value,
		//		the one specified last in the function call will "win".
		//	example:
		//		make a shallow copy of an object
		//	|	var copy = dojo.mixin({}, source);
		//	example:
		//		many class constructors often take an object which specifies
		//		values to be configured on the object. In this case, it is
		//		often simplest to call `dojo.mixin` on the `this` object:
		//	|	dojo.declare("acme.Base", null, {
		//	|		constructor: function(properties){
		//	|			// property configuration:
		//	|			dojo.mixin(this, properties);
		//	|	
		//	|			console.log(this.quip);
		//	|			//  ...
		//	|		},
		//	|		quip: "I wasn't born yesterday, you know - I've seen movies.",
		//	|		// ...
		//	|	});
		//	|
		//	|	// create an instance of the class and configure it
		//	|	var b = new acme.Base({quip: "That's what it does!" });
		//	example:
		//		copy in properties from multiple objects
		//	|	var flattened = dojo.mixin(
		//	|		{
		//	|			name: "Frylock",
		//	|			braces: true
		//	|		},
		//	|		{
		//	|			name: "Carl Brutanananadilewski"
		//	|		}
		//	|	);
		//	|	
		//	|	// will print "Carl Brutanananadilewski"
		//	|	console.log(flattened.name);
		//	|	// will print "true"
		//	|	console.log(flattened.braces);
		if(!obj){ obj = {}; }
		for(var i=1, l=arguments.length; i<l; i++){
			d._mixin(obj, arguments[i]);
		}
		return obj; // Object
	}

	dojo._getProp = function(/*Array*/parts, /*Boolean*/create, /*Object*/context){
		var obj=context || d.global;
		for(var i=0, p; obj && (p=parts[i]); i++){
			if(i == 0 && d._scopeMap[p]){
				p = d._scopeMap[p];
			}
			obj = (p in obj ? obj[p] : (create ? obj[p]={} : undefined));
		}
		return obj; // mixed
	}

	dojo.setObject = function(/*String*/name, /*Object*/value, /*Object?*/context){
		// summary:
		//		Set a property from a dot-separated string, such as "A.B.C"
		//	description:
		//		Useful for longer api chains where you have to test each object in
		//		the chain, or when you have an object reference in string format.
		//		Objects are created as needed along `path`. Returns the passed
		//		value if setting is successful or `undefined` if not.
		//	name:
		//		Path to a property, in the form "A.B.C".
		//	context:
		//		Optional. Object to use as root of path. Defaults to
		//		`dojo.global`.
		//	example:
		//		set the value of `foo.bar.baz`, regardless of whether
		//		intermediate objects already exist:
		//	|	dojo.setObject("foo.bar.baz", value);
		//	example:
		//		without `dojo.setObject`, we often see code like this:
		//	|	// ensure that intermediate objects are available
		//	|	if(!obj["parent"]){ obj.parent = {}; }
		//	|	if(!obj.parent["child"]){ obj.parent.child= {}; }
		//	|	// now we can safely set the property
		//	|	obj.parent.child.prop = "some value";
		//		wheras with `dojo.setObject`, we can shorten that to:
		//	|	dojo.setObject("parent.child.prop", "some value", obj);
		var parts=name.split("."), p=parts.pop(), obj=d._getProp(parts, true, context);
		return obj && p ? (obj[p]=value) : undefined; // Object
	}

	dojo.getObject = function(/*String*/name, /*Boolean?*/create, /*Object?*/context){
		// summary:
		//		Get a property from a dot-separated string, such as "A.B.C"
		//	description:
		//		Useful for longer api chains where you have to test each object in
		//		the chain, or when you have an object reference in string format.
		//	name:
		//		Path to an property, in the form "A.B.C".
		//	create:
		//		Optional. Defaults to `false`. If `true`, Objects will be
		//		created at any point along the 'path' that is undefined.
		//	context:
		//		Optional. Object to use as root of path. Defaults to
		//		'dojo.global'. Null may be passed.
		return d._getProp(name.split("."), create, context); // Object
	}

	dojo.exists = function(/*String*/name, /*Object?*/obj){
		//	summary:
		//		determine if an object supports a given method
		//	description:
		//		useful for longer api chains where you have to test each object in
		//		the chain. Useful only for object and method detection.
		//		Not useful for testing generic properties on an object.
		//		In particular, dojo.exists("foo.bar") when foo.bar = ""
		//		will return false. Use ("bar" in foo) to test for those cases.
		//	name:
		//		Path to an object, in the form "A.B.C".
		//	obj:
		//		Object to use as root of path. Defaults to
		//		'dojo.global'. Null may be passed.
		//	example:
		//	|	// define an object
		//	|	var foo = {
		//	|		bar: { }
		//	|	};
		//	|
		//	|	// search the global scope
		//	|	dojo.exists("foo.bar"); // true
		//	|	dojo.exists("foo.bar.baz"); // false
		//	|
		//	|	// search from a particular scope
		//	|	dojo.exists("bar", foo); // true
		//	|	dojo.exists("bar.baz", foo); // false
		return !!d.getObject(name, false, obj); // Boolean
	}

	dojo["eval"] = function(/*String*/ scriptFragment){
		//	summary:
		//		A legacy method created for use exclusively by internal Dojo methods. Do not use
		//		this method directly, the behavior of this eval will differ from the normal
		//		browser eval.
		//	description:
		//		Placed in a separate function to minimize size of trapped
		//		exceptions. Calling eval() directly from some other scope may
		//		complicate tracebacks on some platforms.
		//	returns:
		//		The result of the evaluation. Often `undefined`
		return d.global.eval ? d.global.eval(scriptFragment) : eval(scriptFragment); 	// Object
	}

	/*=====
		dojo.deprecated = function(behaviour, extra, removal){
			//	summary:
			//		Log a debug message to indicate that a behavior has been
			//		deprecated.
			//	behaviour: String
			//		The API or behavior being deprecated. Usually in the form
			//		of "myApp.someFunction()".
			//	extra: String?
			//		Text to append to the message. Often provides advice on a
			//		new function or facility to achieve the same goal during
			//		the deprecation period.
			//	removal: String?
			//		Text to indicate when in the future the behavior will be
			//		removed. Usually a version number.
			//	example:
			//	|	dojo.deprecated("myApp.getTemp()", "use myApp.getLocaleTemp() instead", "1.0");
		}

		dojo.experimental = function(moduleName, extra){
			//	summary: Marks code as experimental.
			//	description:
			//	 	This can be used to mark a function, file, or module as
			//	 	experimental.  Experimental code is not ready to be used, and the
			//	 	APIs are subject to change without notice.  Experimental code may be
			//	 	completed deleted without going through the normal deprecation
			//	 	process.
			//	moduleName: String
			//	 	The name of a module, or the name of a module file or a specific
			//	 	function
			//	extra: String?
			//	 	some additional message for the user
			//	example:
			//	|	dojo.experimental("dojo.data.Result");
			//	example:
			//	|	dojo.experimental("dojo.weather.toKelvin()", "PENDING approval from NOAA");
		}
	=====*/

	//Real functions declared in dojo._firebug.firebug.
	d.deprecated = d.experimental = function(){};

})();
// vim:ai:ts=4:noet

/*
 * loader.js - A bootstrap module.  Runs before the hostenv_*.js file. Contains
 * all of the package loading methods.
 */

(function(){
	var d = dojo;

	d.mixin(d, {
		_loadedModules: {},
		_inFlightCount: 0,
		_hasResource: {},

		_modulePrefixes: {
			dojo: 	{	name: "dojo", value: "." },
			// dojox: 	{	name: "dojox", value: "../dojox" },
			// dijit: 	{	name: "dijit", value: "../dijit" },
			doh: 	{	name: "doh", value: "../util/doh" },
			tests: 	{	name: "tests", value: "tests" }
		},

		_moduleHasPrefix: function(/*String*/module){
			// summary: checks to see if module has been established
			var mp = d._modulePrefixes;
			return !!(mp[module] && mp[module].value); // Boolean
		},

		_getModulePrefix: function(/*String*/module){
			// summary: gets the prefix associated with module
			var mp = d._modulePrefixes;
			if(d._moduleHasPrefix(module)){
				return mp[module].value; // String
			}
			return module; // String
		},

		_loadedUrls: [],

		//WARNING: 
		//		This variable is referenced by packages outside of bootstrap:
		//		FloatingPane.js and undo/browser.js
		_postLoad: false,
		
		//Egad! Lots of test files push on this directly instead of using dojo.addOnLoad.
		_loaders: [],
		_unloaders: [],
		_loadNotifying: false
	});


		dojo._loadPath = function(/*String*/relpath, /*String?*/module, /*Function?*/cb){
		// 	summary:
		//		Load a Javascript module given a relative path
		//
		//	description:
		//		Loads and interprets the script located at relpath, which is
		//		relative to the script root directory.  If the script is found but
		//		its interpretation causes a runtime exception, that exception is
		//		not caught by us, so the caller will see it.  We return a true
		//		value if and only if the script is found.
		//
		// relpath: 
		//		A relative path to a script (no leading '/', and typically ending
		//		in '.js').
		// module: 
		//		A module whose existance to check for after loading a path.  Can be
		//		used to determine success or failure of the load.
		// cb: 
		//		a callback function to pass the result of evaluating the script

		var uri = ((relpath.charAt(0) == '/' || relpath.match(/^\w+:/)) ? "" : d.baseUrl) + relpath;
		try{
			return !module ? d._loadUri(uri, cb) : d._loadUriAndCheck(uri, module, cb); // Boolean
		}catch(e){
			console.error(e);
			return false; // Boolean
		}
	}

	dojo._loadUri = function(/*String*/uri, /*Function?*/cb){
		//	summary:
		//		Loads JavaScript from a URI
		//	description:
		//		Reads the contents of the URI, and evaluates the contents.  This is
		//		used to load modules as well as resource bundles. Returns true if
		//		it succeeded. Returns false if the URI reading failed.  Throws if
		//		the evaluation throws.
		//	uri: a uri which points at the script to be loaded
		//	cb: 
		//		a callback function to process the result of evaluating the script
		//		as an expression, typically used by the resource bundle loader to
		//		load JSON-style resources

		if(d._loadedUrls[uri]){
			return true; // Boolean
		}
		d._inFlightCount++; // block addOnLoad calls that arrive while we're busy downloading
		var contents = d._getText(uri, true);
		if(contents){ // not 404, et al
			d._loadedUrls[uri] = true;
			d._loadedUrls.push(uri);
			if(cb){
				contents = '('+contents+')';
			}else{
				//Only do the scoping if no callback. If a callback is specified,
				//it is most likely the i18n bundle stuff.
				contents = d._scopePrefix + contents + d._scopeSuffix;
			}
			if(!d.isIE){ contents += "\r\n//@ sourceURL=" + uri; } // debugging assist for Firebug
			var value = d["eval"](contents);
			if(cb){ cb(value); }
		}
		// Check to see if we need to call _callLoaded() due to an addOnLoad() that arrived while we were busy downloading
		if(--d._inFlightCount == 0 && d._postLoad && d._loaders.length){
			// We shouldn't be allowed to get here but Firefox allows an event 
			// (mouse, keybd, async xhrGet) to interrupt a synchronous xhrGet. 
			// If the current script block contains multiple require() statements, then after each
			// require() returns, inFlightCount == 0, but we want to hold the _callLoaded() until
			// all require()s are done since the out-of-sequence addOnLoad() presumably needs them all.
			// setTimeout allows the next require() to start (if needed), and then we check this again.
			setTimeout(function(){ 
				// If inFlightCount > 0, then multiple require()s are running sequentially and 
				// the next require() started after setTimeout() was executed but before we got here.
				if(d._inFlightCount == 0){ 
					d._callLoaded();
				}
			}, 0);
		}
		return !!contents; // Boolean: contents? true : false
	}
	
	// FIXME: probably need to add logging to this method
	dojo._loadUriAndCheck = function(/*String*/uri, /*String*/moduleName, /*Function?*/cb){
		// summary: calls loadUri then findModule and returns true if both succeed
		var ok = false;
		try{
			ok = d._loadUri(uri, cb);
		}catch(e){
			console.error("failed loading " + uri + " with error: " + e);
		}
		return !!(ok && d._loadedModules[moduleName]); // Boolean
	}

	dojo.loaded = function(){
		// summary:
		//		signal fired when initial environment and package loading is
		//		complete. You should use dojo.addOnLoad() instead of doing a 
		//		direct dojo.connect() to this method in order to handle
		//		initialization tasks that require the environment to be
		//		initialized. In a browser host,	declarative widgets will 
		//		be constructed when this function finishes runing.
		d._loadNotifying = true;
		d._postLoad = true;
		var mll = d._loaders;

		//Clear listeners so new ones can be added
		//For other xdomain package loads after the initial load.
		d._loaders = [];

		for(var x = 0; x < mll.length; x++){
			mll[x]();
		}

		d._loadNotifying = false;
		
		//Make sure nothing else got added to the onload queue
		//after this first run. If something did, and we are not waiting for any
		//more inflight resources, run again.
		if(d._postLoad && d._inFlightCount == 0 && mll.length){
			d._callLoaded();
		}
	}

	dojo.unloaded = function(){
		// summary:
		//		signal fired by impending environment destruction. You should use
		//		dojo.addOnUnload() instead of doing a direct dojo.connect() to this 
		//		method to perform page/application cleanup methods. See 
		//		dojo.addOnUnload for more info.
		var mll = d._unloaders;
		while(mll.length){
			(mll.pop())();
		}
	}

	d._onto = function(arr, obj, fn){
		if(!fn){
			arr.push(obj);
		}else if(fn){
			var func = (typeof fn == "string") ? obj[fn] : fn;
			arr.push(function(){ func.call(obj); });
		}
	}

	dojo.ready = dojo.addOnLoad = function(/*Object*/obj, /*String|Function?*/functionName){
		// summary:
		//		Registers a function to be triggered after the DOM and dojo.require() calls 
		//		have finished loading.
		//
		// description:
		//		Registers a function to be triggered after the DOM has finished
		//		loading and `dojo.require` modules have loaded. Widgets declared in markup 
		//		have been instantiated if `djConfig.parseOnLoad` is true when this fires. 
		//
		//		Images and CSS files may or may not have finished downloading when
		//		the specified function is called.  (Note that widgets' CSS and HTML
		//		code is guaranteed to be downloaded before said widgets are
		//		instantiated, though including css resouces BEFORE any script elements
		//		is highly recommended).
		//
		// example:
		//	Register an anonymous function to run when everything is ready
		//	|	dojo.addOnLoad(function(){ doStuff(); });
		//
		// example:
		//	Register a function to run when everything is ready by pointer:
		//	|	var init = function(){ doStuff(); }
		//	|	dojo.addOnLoad(init);
		//
		// example:
		//	Register a function to run scoped to `object`, either by name or anonymously:
		//	|	dojo.addOnLoad(object, "functionName");
		//	|	dojo.addOnLoad(object, function(){ doStuff(); });

		d._onto(d._loaders, obj, functionName);

		//Added for xdomain loading. dojo.addOnLoad is used to
		//indicate callbacks after doing some dojo.require() statements.
		//In the xdomain case, if all the requires are loaded (after initial
		//page load), then immediately call any listeners.
		if(d._postLoad && d._inFlightCount == 0 && !d._loadNotifying){
			d._callLoaded();
		}
	}

	//Support calling dojo.addOnLoad via djConfig.addOnLoad. Support all the
	//call permutations of dojo.addOnLoad. Mainly useful when dojo is added
	//to the page after the page has loaded.
	var dca = d.config.addOnLoad;
	if(dca){
		d.addOnLoad[(dca instanceof Array ? "apply" : "call")](d, dca);
	}

	dojo._modulesLoaded = function(){
		if(d._postLoad){ return; }
		if(d._inFlightCount > 0){ 
			console.warn("files still in flight!");
			return;
		}
		d._callLoaded();
	}

	dojo._callLoaded = function(){

		// The "object" check is for IE, and the other opera check fixes an
		// issue in Opera where it could not find the body element in some
		// widget test cases.  For 0.9, maybe route all browsers through the
		// setTimeout (need protection still for non-browser environments
		// though). This might also help the issue with FF 2.0 and freezing
		// issues where we try to do sync xhr while background css images are
		// being loaded (trac #2572)? Consider for 0.9.
		if(typeof setTimeout == "object" || (d.config.useXDomain && d.isOpera)){
			setTimeout(
				d.isAIR ? function(){ d.loaded(); } : d._scopeName + ".loaded();",
				0);
		}else{
			d.loaded();
		}
	}

	dojo._getModuleSymbols = function(/*String*/modulename){
		// summary:
		//		Converts a module name in dotted JS notation to an array
		//		representing the path in the source tree
		var syms = modulename.split(".");
		for(var i = syms.length; i>0; i--){
			var parentModule = syms.slice(0, i).join(".");
			if(i == 1 && !d._moduleHasPrefix(parentModule)){		
				// Support default module directory (sibling of dojo) for top-level modules 
				syms[0] = "../" + syms[0];
			}else{
				var parentModulePath = d._getModulePrefix(parentModule);
				if(parentModulePath != parentModule){
					syms.splice(0, i, parentModulePath);
					break;
				}
			}
		}
		return syms; // Array
	}

	dojo._global_omit_module_check = false;

	dojo.loadInit = function(/*Function*/init){
		//	summary:
		//		Executes a function that needs to be executed for the loader's dojo.requireIf
		//		resolutions to work. This is needed mostly for the xdomain loader case where
		//		a function needs to be executed to set up the possible values for a dojo.requireIf
		//		call.
		//	init:
		//		a function reference. Executed immediately.
		//	description: This function is mainly a marker for the xdomain loader to know parts of
		//		code that needs be executed outside the function wrappper that is placed around modules.
		//		The init function could be executed more than once, and it should make no assumptions
		//		on what is loaded, or what modules are available. Only the functionality in Dojo Base
		//		is allowed to be used. Avoid using this method. For a valid use case,
		//		see the source for dojox.gfx.
		init();
	}

	dojo._loadModule = dojo.require = function(/*String*/moduleName, /*Boolean?*/omitModuleCheck){
		//	summary:
		//		loads a Javascript module from the appropriate URI
		//	moduleName:
		//		module name to load, using periods for separators,
		//		 e.g. "dojo.date.locale".  Module paths are de-referenced by dojo's
		//		internal mapping of locations to names and are disambiguated by
		//		longest prefix. See `dojo.registerModulePath()` for details on
		//		registering new modules.
		//	omitModuleCheck:
		//		if `true`, omitModuleCheck skips the step of ensuring that the
		//		loaded file actually defines the symbol it is referenced by.
		//		For example if it called as `dojo.require("a.b.c")` and the
		//		file located at `a/b/c.js` does not define an object `a.b.c`,
		//		and exception will be throws whereas no exception is raised
		//		when called as `dojo.require("a.b.c", true)`
		//	description:
		// 		Modules are loaded via dojo.require by using one of two loaders: the normal loader
		// 		and the xdomain loader. The xdomain loader is used when dojo was built with a
		// 		custom build that specified loader=xdomain and the module lives on a modulePath
		// 		that is a whole URL, with protocol and a domain. The versions of Dojo that are on
		// 		the Google and AOL CDNs use the xdomain loader.
		// 
		// 		If the module is loaded via the xdomain loader, it is an asynchronous load, since
		// 		the module is added via a dynamically created script tag. This
		// 		means that dojo.require() can return before the module has loaded. However, this 
		// 		should only happen in the case where you do dojo.require calls in the top-level
		// 		HTML page, or if you purposely avoid the loader checking for dojo.require
		// 		dependencies in your module by using a syntax like dojo["require"] to load the module.
		// 
		// 		Sometimes it is useful to not have the loader detect the dojo.require calls in the
		// 		module so that you can dynamically load the modules as a result of an action on the
		// 		page, instead of right at module load time.
		// 
		// 		Also, for script blocks in an HTML page, the loader does not pre-process them, so
		// 		it does not know to download the modules before the dojo.require calls occur.
		// 
		// 		So, in those two cases, when you want on-the-fly module loading or for script blocks
		// 		in the HTML page, special care must be taken if the dojo.required code is loaded
		// 		asynchronously. To make sure you can execute code that depends on the dojo.required
		// 		modules, be sure to add the code that depends on the modules in a dojo.addOnLoad()
		// 		callback. dojo.addOnLoad waits for all outstanding modules to finish loading before
		// 		executing. Example:
		// 
		//	   	|	<script type="text/javascript">
		//		|	dojo.require("foo");
		//		|	dojo.require("bar");
		//	   	|	dojo.addOnLoad(function(){
		//	   	|		//you can now safely do something with foo and bar
		//	   	|	});
		//	   	|	</script>
		// 
		// 		This type of syntax works with both xdomain and normal loaders, so it is good
		// 		practice to always use this idiom for on-the-fly code loading and in HTML script
		// 		blocks. If at some point you change loaders and where the code is loaded from,
		// 		it will all still work.
		// 
		// 		More on how dojo.require
		//		`dojo.require("A.B")` first checks to see if symbol A.B is
		//		defined. If it is, it is simply returned (nothing to do).
		//	
		//		If it is not defined, it will look for `A/B.js` in the script root
		//		directory.
		//	
		//		`dojo.require` throws an excpetion if it cannot find a file
		//		to load, or if the symbol `A.B` is not defined after loading.
		//	
		//		It returns the object `A.B`, but note the caveats above about on-the-fly loading and
		// 		HTML script blocks when the xdomain loader is loading a module.
		//	
		//		`dojo.require()` does nothing about importing symbols into
		//		the current namespace.  It is presumed that the caller will
		//		take care of that. For example, to import all symbols into a
		//		local block, you might write:
		//	
		//		|	with (dojo.require("A.B")) {
		//		|		...
		//		|	}
		//	
		//		And to import just the leaf symbol to a local variable:
		//	
		//		|	var B = dojo.require("A.B");
		//	   	|	...
		//	returns: the required namespace object
		omitModuleCheck = d._global_omit_module_check || omitModuleCheck;

		//Check if it is already loaded.
		var module = d._loadedModules[moduleName];
		if(module){
			return module;
		}

		// convert periods to slashes
		var relpath = d._getModuleSymbols(moduleName).join("/") + '.js';

		var modArg = !omitModuleCheck ? moduleName : null;
		var ok = d._loadPath(relpath, modArg);

		if(!ok && !omitModuleCheck){
			throw new Error("Could not load '" + moduleName + "'; last tried '" + relpath + "'");
		}

		// check that the symbol was defined
		// Don't bother if we're doing xdomain (asynchronous) loading.
		if(!omitModuleCheck && !d._isXDomain){
			// pass in false so we can give better error
			module = d._loadedModules[moduleName];
			if(!module){
				throw new Error("symbol '" + moduleName + "' is not defined after loading '" + relpath + "'"); 
			}
		}

		return module;
	}

	dojo.provide = function(/*String*/ resourceName){
		//	summary:
		//		Register a resource with the package system. Works in conjunction with `dojo.require`
		//
		//	description:
		//		Each javascript source file is called a resource.  When a
		//		resource is loaded by the browser, `dojo.provide()` registers
		//		that it has been loaded.
		//
		//		Each javascript source file must have at least one
		//		`dojo.provide()` call at the top of the file, corresponding to
		//		the file name.  For example, `js/dojo/foo.js` must have
		//		`dojo.provide("dojo.foo");` before any calls to
		//		`dojo.require()` are made.
		//	
		//		For backwards compatibility reasons, in addition to registering
		//		the resource, `dojo.provide()` also ensures that the javascript
		//		object for the module exists.  For example,
		//		`dojo.provide("dojox.data.FlickrStore")`, in addition to
		//		registering that `FlickrStore.js` is a resource for the
		//		`dojox.data` module, will ensure that the `dojox.data`
		//		javascript object exists, so that calls like 
		//		`dojo.data.foo = function(){ ... }` don't fail.
		//
		//		In the case of a build where multiple javascript source files
		//		are combined into one bigger file (similar to a .lib or .jar
		//		file), that file may contain multiple dojo.provide() calls, to
		//		note that it includes multiple resources.
		//
		// resourceName: String
		//		A dot-sperated string identifying a resource. 
		//
		// example:
		//	Safely create a `my` object, and make dojo.require("my.CustomModule") work
		//	|	dojo.provide("my.CustomModule"); 

		//Make sure we have a string.
		resourceName = resourceName + "";
		return (d._loadedModules[resourceName] = d.getObject(resourceName, true)); // Object
	}

	//Start of old bootstrap2:

	dojo.platformRequire = function(/*Object*/modMap){
		//	summary:
		//		require one or more modules based on which host environment
		//		Dojo is currently operating in
		//	description:
		//		This method takes a "map" of arrays which one can use to
		//		optionally load dojo modules. The map is indexed by the
		//		possible dojo.name_ values, with two additional values:
		//		"default" and "common". The items in the "default" array will
		//		be loaded if none of the other items have been choosen based on
		//		dojo.name_, set by your host environment. The items in the
		//		"common" array will *always* be loaded, regardless of which
		//		list is chosen.
		//	example:
		//		|	dojo.platformRequire({
		//		|		browser: [
		//		|			"foo.sample", // simple module
		//		|			"foo.test",
		//		|			["foo.bar.baz", true] // skip object check in _loadModule (dojo.require)
		//		|		],
		//		|		default: [ "foo.sample._base" ],
		//		|		common: [ "important.module.common" ]
		//		|	});

		var common = modMap.common || [];
		var result = common.concat(modMap[d._name] || modMap["default"] || []);

		for(var x=0; x<result.length; x++){
			var curr = result[x];
			if(curr.constructor == Array){
				d._loadModule.apply(d, curr);
			}else{
				d._loadModule(curr);
			}
		}
	}

	dojo.requireIf = function(/*Boolean*/ condition, /*String*/ resourceName){
		// summary:
		//		If the condition is true then call `dojo.require()` for the specified
		//		resource
		//
		// example:
		//	|	dojo.requireIf(dojo.isBrowser, "my.special.Module");
		
		if(condition === true){
			// FIXME: why do we support chained require()'s here? does the build system?
			var args = [];
			for(var i = 1; i < arguments.length; i++){ 
				args.push(arguments[i]);
			}
			d.require.apply(d, args);
		}
	}

	dojo.requireAfterIf = d.requireIf;

	dojo.registerModulePath = function(/*String*/module, /*String*/prefix){
		//	summary: 
		//		Maps a module name to a path
		//	description: 
		//		An unregistered module is given the default path of ../[module],
		//		relative to Dojo root. For example, module acme is mapped to
		//		../acme.  If you want to use a different module name, use
		//		dojo.registerModulePath. 
		//	example:
		//		If your dojo.js is located at this location in the web root:
		//	|	/myapp/js/dojo/dojo/dojo.js
		//		and your modules are located at:
		//	|	/myapp/js/foo/bar.js
		//	|	/myapp/js/foo/baz.js
		//	|	/myapp/js/foo/thud/xyzzy.js
		//		Your application can tell Dojo to locate the "foo" namespace by calling:
		//	|	dojo.registerModulePath("foo", "../../foo");
		//		At which point you can then use dojo.require() to load the
		//		modules (assuming they provide() the same things which are
		//		required). The full code might be:
		//	|	<script type="text/javascript" 
		//	|		src="/myapp/js/dojo/dojo/dojo.js"></script>
		//	|	<script type="text/javascript">
		//	|		dojo.registerModulePath("foo", "../../foo");
		//	|		dojo.require("foo.bar");
		//	|		dojo.require("foo.baz");
		//	|		dojo.require("foo.thud.xyzzy");
		//	|	</script>
		d._modulePrefixes[module] = { name: module, value: prefix };
	}

	dojo.requireLocalization = function(/*String*/moduleName, /*String*/bundleName, /*String?*/locale, /*String?*/availableFlatLocales){
		// summary:
		//		Declares translated resources and loads them if necessary, in the
		//		same style as dojo.require.  Contents of the resource bundle are
		//		typically strings, but may be any name/value pair, represented in
		//		JSON format.  See also `dojo.i18n.getLocalization`.
		//
		// description:
		//		Load translated resource bundles provided underneath the "nls"
		//		directory within a package.  Translated resources may be located in
		//		different packages throughout the source tree.  
		//
		//		Each directory is named for a locale as specified by RFC 3066,
		//		(http://www.ietf.org/rfc/rfc3066.txt), normalized in lowercase.
		//		Note that the two bundles in the example do not define all the
		//		same variants.  For a given locale, bundles will be loaded for
		//		that locale and all more general locales above it, including a
		//		fallback at the root directory.  For example, a declaration for
		//		the "de-at" locale will first load `nls/de-at/bundleone.js`,
		//		then `nls/de/bundleone.js` and finally `nls/bundleone.js`.  The
		//		data will be flattened into a single Object so that lookups
		//		will follow this cascading pattern.  An optional build step can
		//		preload the bundles to avoid data redundancy and the multiple
		//		network hits normally required to load these resources.
		//
		// moduleName: 
		//		name of the package containing the "nls" directory in which the
		//		bundle is found
		//
		// bundleName: 
		//		bundle name, i.e. the filename without the '.js' suffix. Using "nls" as a
		//		a bundle name is not supported, since "nls" is the name of the folder
		//		that holds bundles. Using "nls" as the bundle name will cause problems
		//		with the custom build.
		//
		// locale: 
		//		the locale to load (optional)  By default, the browser's user
		//		locale as defined by dojo.locale
		//
		// availableFlatLocales: 
		//		A comma-separated list of the available, flattened locales for this
		//		bundle. This argument should only be set by the build process.
		//
		//	example:
		//		A particular widget may define one or more resource bundles,
		//		structured in a program as follows, where moduleName is
		//		mycode.mywidget and bundleNames available include bundleone and
		//		bundletwo:
		//	|		...
		//	|	mycode/
		//	|		mywidget/
		//	|			nls/
		//	|				bundleone.js (the fallback translation, English in this example)
		//	|				bundletwo.js (also a fallback translation)
		//	|				de/
		//	|					bundleone.js
		//	|					bundletwo.js
		//	|				de-at/
		//	|					bundleone.js
		//	|				en/
		//	|					(empty; use the fallback translation)
		//	|				en-us/
		//	|					bundleone.js
		//	|				en-gb/
		//	|					bundleone.js
		//	|				es/
		//	|					bundleone.js
		//	|					bundletwo.js
		//	|				  ...etc
		//	|				...
		//

		d.require("dojo.i18n");
		d.i18n._requireLocalization.apply(d.hostenv, arguments);
	};


	var ore = new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"),
		ire = new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$");

	dojo._Url = function(/*dojo._Url|String...*/){
		// summary: 
		//		Constructor to create an object representing a URL.
		//		It is marked as private, since we might consider removing
		//		or simplifying it.
		// description: 
		//		Each argument is evaluated in order relative to the next until
		//		a canonical uri is produced. To get an absolute Uri relative to
		//		the current document use:
		//      	new dojo._Url(document.baseURI, url)

		var n = null,
			_a = arguments,
			uri = [_a[0]];
		// resolve uri components relative to each other
		for(var i = 1; i<_a.length; i++){
			if(!_a[i]){ continue; }

			// Safari doesn't support this.constructor so we have to be explicit
			// FIXME: Tracked (and fixed) in Webkit bug 3537.
			//		http://bugs.webkit.org/show_bug.cgi?id=3537
			var relobj = new d._Url(_a[i]+""),
				uriobj = new d._Url(uri[0]+"");

			if(
				relobj.path == "" &&
				!relobj.scheme &&
				!relobj.authority &&
				!relobj.query
			){
				if(relobj.fragment != n){
					uriobj.fragment = relobj.fragment;
				}
				relobj = uriobj;
			}else if(!relobj.scheme){
				relobj.scheme = uriobj.scheme;

				if(!relobj.authority){
					relobj.authority = uriobj.authority;

					if(relobj.path.charAt(0) != "/"){
						var path = uriobj.path.substring(0,
							uriobj.path.lastIndexOf("/") + 1) + relobj.path;

						var segs = path.split("/");
						for(var j = 0; j < segs.length; j++){
							if(segs[j] == "."){
								// flatten "./" references
								if(j == segs.length - 1){
									segs[j] = "";
								}else{
									segs.splice(j, 1);
									j--;
								}
							}else if(j > 0 && !(j == 1 && segs[0] == "") &&
								segs[j] == ".." && segs[j-1] != ".."){
								// flatten "../" references
								if(j == (segs.length - 1)){
									segs.splice(j, 1);
									segs[j - 1] = "";
								}else{
									segs.splice(j - 1, 2);
									j -= 2;
								}
							}
						}
						relobj.path = segs.join("/");
					}
				}
			}

			uri = [];
			if(relobj.scheme){ 
				uri.push(relobj.scheme, ":");
			}
			if(relobj.authority){
				uri.push("//", relobj.authority);
			}
			uri.push(relobj.path);
			if(relobj.query){
				uri.push("?", relobj.query);
			}
			if(relobj.fragment){
				uri.push("#", relobj.fragment);
			}
		}

		this.uri = uri.join("");

		// break the uri into its main components
		var r = this.uri.match(ore);

		this.scheme = r[2] || (r[1] ? "" : n);
		this.authority = r[4] || (r[3] ? "" : n);
		this.path = r[5]; // can never be undefined
		this.query = r[7] || (r[6] ? "" : n);
		this.fragment  = r[9] || (r[8] ? "" : n);

		if(this.authority != n){
			// server based naming authority
			r = this.authority.match(ire);

			this.user = r[3] || n;
			this.password = r[4] || n;
			this.host = r[6] || r[7]; // ipv6 || ipv4
			this.port = r[9] || n;
		}
	}

	dojo._Url.prototype.toString = function(){ return this.uri; };

	dojo.moduleUrl = function(/*String*/module, /*dojo._Url||String*/url){
		//	summary: 
		//		Returns a `dojo._Url` object relative to a module.
		//	example:
		//	|	var pngPath = dojo.moduleUrl("acme","images/small.png");
		//	|	console.dir(pngPath); // list the object properties
		//	|	// create an image and set it's source to pngPath's value:
		//	|	var img = document.createElement("img");
		// 	|	// NOTE: we assign the string representation of the url object
		//	|	img.src = pngPath.toString(); 
		//	|	// add our image to the document
		//	|	dojo.body().appendChild(img);
		//	example: 
		//		you may de-reference as far as you like down the package
		//		hierarchy.  This is sometimes handy to avoid lenghty relative
		//		urls or for building portable sub-packages. In this example,
		//		the `acme.widget` and `acme.util` directories may be located
		//		under different roots (see `dojo.registerModulePath`) but the
		//		the modules which reference them can be unaware of their
		//		relative locations on the filesystem:
		//	|	// somewhere in a configuration block
		//	|	dojo.registerModulePath("acme.widget", "../../acme/widget");
		//	|	dojo.registerModulePath("acme.util", "../../util");
		//	|	
		//	|	// ...
		//	|	
		//	|	// code in a module using acme resources
		//	|	var tmpltPath = dojo.moduleUrl("acme.widget","templates/template.html");
		//	|	var dataPath = dojo.moduleUrl("acme.util","resources/data.json");

		var loc = d._getModuleSymbols(module).join('/');
		if(!loc){ return null; }
		if(loc.lastIndexOf("/") != loc.length-1){
			loc += "/";
		}
		
		//If the path is an absolute path (starts with a / or is on another
		//domain/xdomain) then don't add the baseUrl.
		var colonIndex = loc.indexOf(":");
		if(loc.charAt(0) != "/" && (colonIndex == -1 || colonIndex > loc.indexOf("/"))){
			loc = d.baseUrl + loc;
		}

		return new d._Url(loc, url); // dojo._Url
	}
})();

/*=====
dojo.isBrowser = {
	//	example:
	//	|	if(dojo.isBrowser){ ... }
};

dojo.isFF = {
	//	example:
	//	|	if(dojo.isFF > 1){ ... }
};

dojo.isIE = {
	// example:
	//	|	if(dojo.isIE > 6){
	//	|		// we are IE7
	// 	|	}
};

dojo.isSafari = {
	//	example:
	//	|	if(dojo.isSafari){ ... }
	//	example: 
	//		Detect iPhone:
	//	|	if(dojo.isSafari && navigator.userAgent.indexOf("iPhone") != -1){ 
	//	|		// we are iPhone. Note, iPod touch reports "iPod" above and fails this test.
	//	|	}
};

dojo = {
	// isBrowser: Boolean
	//		True if the client is a web-browser
	isBrowser: true,
	//	isFF: Number | undefined
	//		Version as a Number if client is FireFox. undefined otherwise. Corresponds to
	//		major detected FireFox version (1.5, 2, 3, etc.)
	isFF: 2,
	//	isIE: Number | undefined
	//		Version as a Number if client is MSIE(PC). undefined otherwise. Corresponds to
	//		major detected IE version (6, 7, 8, etc.)
	isIE: 6,
	//	isKhtml: Number | undefined
	//		Version as a Number if client is a KHTML browser. undefined otherwise. Corresponds to major
	//		detected version.
	isKhtml: 0,
	//	isWebKit: Number | undefined
	//		Version as a Number if client is a WebKit-derived browser (Konqueror,
	//		Safari, Chrome, etc.). undefined otherwise.
	isWebKit: 0,
	//	isMozilla: Number | undefined
	//		Version as a Number if client is a Mozilla-based browser (Firefox,
	//		SeaMonkey). undefined otherwise. Corresponds to major detected version.
	isMozilla: 0,
	//	isOpera: Number | undefined
	//		Version as a Number if client is Opera. undefined otherwise. Corresponds to
	//		major detected version.
	isOpera: 0,
	//	isSafari: Number | undefined
	//		Version as a Number if client is Safari or iPhone. undefined otherwise.
	isSafari: 0,
	//	isChrome: Number | undefined
	//		Version as a Number if client is Chrome browser. undefined otherwise.
	isChrome: 0
	//	isMac: Boolean
	//		True if the client runs on Mac
}
=====*/

if(typeof window != 'undefined'){
	dojo.isBrowser = true;
	dojo._name = "browser";


	// attempt to figure out the path to dojo if it isn't set in the config
	(function(){
		var d = dojo;

		// this is a scope protection closure. We set browser versions and grab
		// the URL we were loaded from here.

		// grab the node we were loaded from
		if(document && document.getElementsByTagName){
			var scripts = document.getElementsByTagName("script");
			var rePkg = /dojo(\.xd)?\.js(\W|$)/i;
			for(var i = 0; i < scripts.length; i++){
				var src = scripts[i].getAttribute("src");
				if(!src){ continue; }
				var m = src.match(rePkg);
				if(m){
					// find out where we came from
					if(!d.config.baseUrl){
						d.config.baseUrl = src.substring(0, m.index);
					}
					// and find out if we need to modify our behavior
					var cfg = scripts[i].getAttribute("djConfig");
					if(cfg){
						var cfgo = eval("({ "+cfg+" })");
						for(var x in cfgo){
							dojo.config[x] = cfgo[x];
						}
					}
					break; // "first Dojo wins"
				}
			}
		}
		d.baseUrl = d.config.baseUrl;

		// fill in the rendering support information in dojo.render.*
		var n = navigator;
		var dua = n.userAgent,
			dav = n.appVersion,
			tv = parseFloat(dav);

		if(dua.indexOf("Opera") >= 0){ d.isOpera = tv; }
		if(dua.indexOf("AdobeAIR") >= 0){ d.isAIR = 1; }
		d.isKhtml = (dav.indexOf("Konqueror") >= 0) ? tv : 0;
		d.isWebKit = parseFloat(dua.split("WebKit/")[1]) || undefined;
		d.isChrome = parseFloat(dua.split("Chrome/")[1]) || undefined;
		d.isMac = dav.indexOf("Macintosh") >= 0;

		// safari detection derived from:
		//		http://developer.apple.com/internet/safari/faq.html#anchor2
		//		http://developer.apple.com/internet/safari/uamatrix.html
		var index = Math.max(dav.indexOf("WebKit"), dav.indexOf("Safari"), 0);
		if(index && !dojo.isChrome){
			// try to grab the explicit Safari version first. If we don't get
			// one, look for less than 419.3 as the indication that we're on something
			// "Safari 2-ish".
			d.isSafari = parseFloat(dav.split("Version/")[1]);
			if(!d.isSafari || parseFloat(dav.substr(index + 7)) <= 419.3){
				d.isSafari = 2;
			}
		}

				if(dua.indexOf("Gecko") >= 0 && !d.isKhtml && !d.isWebKit){ d.isMozilla = d.isMoz = tv; }
		if(d.isMoz){
			//We really need to get away from this. Consider a sane isGecko approach for the future.
			d.isFF = parseFloat(dua.split("Firefox/")[1] || dua.split("Minefield/")[1]) || undefined;
		}
		if(document.all && !d.isOpera){
			d.isIE = parseFloat(dav.split("MSIE ")[1]) || undefined;
			//In cases where the page has an HTTP header or META tag with
			//X-UA-Compatible, then it is in emulation mode.
			//Make sure isIE reflects the desired version.
			//document.documentMode of 5 means quirks mode.
			//Only switch the value if documentMode's major version
			//is different from isIE's major version.
			var mode = document.documentMode;
			if(mode && mode != 5 && Math.floor(d.isIE) != mode){
				d.isIE = mode;
			}
		}

		//Workaround to get local file loads of dojo to work on IE 7
		//by forcing to not use native xhr.
		if(dojo.isIE && window.location.protocol === "file:"){
			dojo.config.ieForceActiveXXhr=true;
		}
		
		d.isQuirks = document.compatMode == "BackCompat";

		// TODO: is the HTML LANG attribute relevant?
		d.locale = dojo.config.locale || (d.isIE ? n.userLanguage : n.language).toLowerCase();

		// These are in order of decreasing likelihood; this will change in time.
				d._XMLHTTP_PROGIDS = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
		
		d._xhrObj = function(){
			// summary: 
			//		does the work of portably generating a new XMLHTTPRequest object.
			var http, last_e;
						if(!dojo.isIE || !dojo.config.ieForceActiveXXhr){
							try{ http = new XMLHttpRequest(); }catch(e){}
						}
			if(!http){
				for(var i=0; i<3; ++i){
					var progid = d._XMLHTTP_PROGIDS[i];
					try{
						http = new ActiveXObject(progid);
					}catch(e){
						last_e = e;
					}

					if(http){
						d._XMLHTTP_PROGIDS = [progid];  // so faster next time
						break;
					}
				}
			}
			
			if(!http){
				throw new Error("XMLHTTP not available: "+last_e);
			}

			return http; // XMLHTTPRequest instance
		}

		d._isDocumentOk = function(http){
			var stat = http.status || 0,
				lp = location.protocol;
			return (stat >= 200 && stat < 300) || 	// Boolean
				stat == 304 || 						// allow any 2XX response code
				stat == 1223 || 						// get it out of the cache
				// Internet Explorer mangled the status code OR we're Titanium/browser chrome/chrome extension requesting a local file
				(!stat && (lp == "file:" || lp == "chrome:" || lp == "chrome-extension:" || lp == "app:") );
		}

		//See if base tag is in use.
		//This is to fix http://trac.dojotoolkit.org/ticket/3973,
		//but really, we need to find out how to get rid of the dojo._Url reference
		//below and still have DOH work with the dojo.i18n test following some other
		//test that uses the test frame to load a document (trac #2757).
		//Opera still has problems, but perhaps a larger issue of base tag support
		//with XHR requests (hasBase is true, but the request is still made to document
		//path, not base path).
		var owloc = window.location+"";
		var base = document.getElementsByTagName("base");
		var hasBase = (base && base.length > 0);

		d._getText = function(/*URI*/ uri, /*Boolean*/ fail_ok){
			// summary: Read the contents of the specified uri and return those contents.
			// uri:
			//		A relative or absolute uri. If absolute, it still must be in
			//		the same "domain" as we are.
			// fail_ok:
			//		Default false. If fail_ok and loading fails, return null
			//		instead of throwing.
			// returns: The response text. null is returned when there is a
			//		failure and failure is okay (an exception otherwise)

			// NOTE: must be declared before scope switches ie. this._xhrObj()
			var http = d._xhrObj();

			if(!hasBase && dojo._Url){
				uri = (new dojo._Url(owloc, uri)).toString();
			}

			if(d.config.cacheBust){
				//Make sure we have a string before string methods are used on uri
				uri += "";
				uri += (uri.indexOf("?") == -1 ? "?" : "&") + String(d.config.cacheBust).replace(/\W+/g,"");
			}

			http.open('GET', uri, false);
			try{
				http.send(null);
				if(!d._isDocumentOk(http)){
					var err = Error("Unable to load "+uri+" status:"+ http.status);
					err.status = http.status;
					err.responseText = http.responseText;
					throw err;
				}
			}catch(e){
				if(fail_ok){ return null; } // null
				// rethrow the exception
				throw e;
			}
			return http.responseText; // String
		}
		

		var _w = window;
		var _handleNodeEvent = function(/*String*/evtName, /*Function*/fp){
			// summary:
			//		non-destructively adds the specified function to the node's
			//		evtName handler.
			// evtName: should be in the form "onclick" for "onclick" handlers.
			// Make sure you pass in the "on" part.
			var _a = _w.attachEvent || _w.addEventListener;
			evtName = _w.attachEvent ? evtName : evtName.substring(2);
			_a(evtName, function(){
				fp.apply(_w, arguments);
			}, false);
		};


		d._windowUnloaders = [];
		
		d.windowUnloaded = function(){
			// summary:
			//		signal fired by impending window destruction. You may use
			//		dojo.addOnWindowUnload() to register a listener for this
			//		event. NOTE: if you wish to dojo.connect() to this method
			//		to perform page/application cleanup, be aware that this
			//		event WILL NOT fire if no handler has been registered with
			//		dojo.addOnWindowUnload. This behavior started in Dojo 1.3.
			//		Previous versions always triggered dojo.windowUnloaded. See
			//		dojo.addOnWindowUnload for more info.
			var mll = d._windowUnloaders;
			while(mll.length){
				(mll.pop())();
			}
			d = null;
		};

		var _onWindowUnloadAttached = 0;
		d.addOnWindowUnload = function(/*Object?|Function?*/obj, /*String|Function?*/functionName){
			// summary:
			//		registers a function to be triggered when window.onunload
			//		fires. 
			//	description:
			//		The first time that addOnWindowUnload is called Dojo
			//		will register a page listener to trigger your unload
			//		handler with. Note that registering these handlers may
			//		destory "fastback" page caching in browsers that support
			//		it. Be careful trying to modify the DOM or access
			//		JavaScript properties during this phase of page unloading:
			//		they may not always be available. Consider
			//		dojo.addOnUnload() if you need to modify the DOM or do
			//		heavy JavaScript work since it fires at the eqivalent of
			//		the page's "onbeforeunload" event.
			// example:
			//	|	dojo.addOnWindowUnload(functionPointer)
			//	|	dojo.addOnWindowUnload(object, "functionName");
			//	|	dojo.addOnWindowUnload(object, function(){ /* ... */});

			d._onto(d._windowUnloaders, obj, functionName);
			if(!_onWindowUnloadAttached){
				_onWindowUnloadAttached = 1;
				_handleNodeEvent("onunload", d.windowUnloaded);
			}
		};

		var _onUnloadAttached = 0;
		d.addOnUnload = function(/*Object?|Function?*/obj, /*String|Function?*/functionName){
			// summary:
			//		registers a function to be triggered when the page unloads.
			//	description:
			//		The first time that addOnUnload is called Dojo will
			//		register a page listener to trigger your unload handler
			//		with. 
			//
			//		In a browser enviroment, the functions will be triggered
			//		during the window.onbeforeunload event. Be careful of doing
			//		too much work in an unload handler. onbeforeunload can be
			//		triggered if a link to download a file is clicked, or if
			//		the link is a javascript: link. In these cases, the
			//		onbeforeunload event fires, but the document is not
			//		actually destroyed. So be careful about doing destructive
			//		operations in a dojo.addOnUnload callback.
			//
			//		Further note that calling dojo.addOnUnload will prevent
			//		browsers from using a "fast back" cache to make page
			//		loading via back button instantaneous. 
			// example:
			//	|	dojo.addOnUnload(functionPointer)
			//	|	dojo.addOnUnload(object, "functionName")
			//	|	dojo.addOnUnload(object, function(){ /* ... */});

			d._onto(d._unloaders, obj, functionName);
			if(!_onUnloadAttached){
				_onUnloadAttached = 1;
				_handleNodeEvent("onbeforeunload", dojo.unloaded);
			}
		};

	})();

	//START DOMContentLoaded
	dojo._initFired = false;
	dojo._loadInit = function(e){
		if(dojo._scrollIntervalId){
			clearInterval(dojo._scrollIntervalId);
			dojo._scrollIntervalId = 0;
		}

		if(!dojo._initFired){
			dojo._initFired = true;

			//Help out IE to avoid memory leak.
			if(!dojo.config.afterOnLoad && window.detachEvent){
				window.detachEvent("onload", dojo._loadInit);
			}

			if(dojo._inFlightCount == 0){
				dojo._modulesLoaded();
			}
		}
	}

	if(!dojo.config.afterOnLoad){		
		if(document.addEventListener){
			//Standards. Hooray! Assumption here that if standards based,
			//it knows about DOMContentLoaded. It is OK if it does not, the fall through
			//to window onload should be good enough.
			document.addEventListener("DOMContentLoaded", dojo._loadInit, false);
			window.addEventListener("load", dojo._loadInit, false);
		}else if(window.attachEvent){
			window.attachEvent("onload", dojo._loadInit);

			//DOMContentLoaded approximation. Diego Perini found this MSDN article
			//that indicates doScroll is available after DOM ready, so do a setTimeout
			//to check when it is available.
			//http://msdn.microsoft.com/en-us/library/ms531426.aspx
			if(!dojo.config.skipIeDomLoaded && self === self.top){
				dojo._scrollIntervalId = setInterval(function (){
					try{
						//When dojo is loaded into an iframe in an IE HTML Application 
						//(HTA), such as in a selenium test, javascript in the iframe
						//can't see anything outside of it, so self===self.top is true,
						//but the iframe is not the top window and doScroll will be 
						//available before document.body is set. Test document.body
						//before trying the doScroll trick
						if(document.body){
							document.documentElement.doScroll("left");
							dojo._loadInit();
						}
					}catch (e){}
				}, 30);
			}
		}
	}

		if(dojo.isIE){
		try{
			(function(){
				document.namespaces.add("v", "urn:schemas-microsoft-com:vml");
				var vmlElems = ["*", "group", "roundrect", "oval", "shape", "rect", "imagedata", "path", "textpath", "text"],
					i = 0, l = 1, s = document.createStyleSheet();
				if(dojo.isIE >= 8){
					i = 1;
					l = vmlElems.length;
				}
				for(; i < l; ++i){
					s.addRule("v\\:" + vmlElems[i], "behavior:url(#default#VML); display:inline-block");
				}
			})();
		}catch(e){}
	}
		//END DOMContentLoaded


	/*
	OpenAjax.subscribe("OpenAjax", "onload", function(){
		if(dojo._inFlightCount == 0){
			dojo._modulesLoaded();
		}
	});

	OpenAjax.subscribe("OpenAjax", "onunload", function(){
		dojo.unloaded();
	});
	*/
} //if (typeof window != 'undefined')

//Register any module paths set up in djConfig. Need to do this
//in the hostenvs since hostenv_browser can read djConfig from a
//script tag's attribute.
(function(){
	var mp = dojo.config["modulePaths"];
	if(mp){
		for(var param in mp){
			dojo.registerModulePath(param, mp[param]);
		}
	}
})();

//Load debug code if necessary.
if(dojo.config.isDebug){
	dojo.require("dojo._firebug.firebug");
}

if(dojo.config.debugAtAllCosts){
	dojo.config.useXDomain = true;
	dojo.require("dojo._base._loader.loader_xd");
	dojo.require("dojo._base._loader.loader_debug");
	dojo.require("dojo.i18n");
}

if(!dojo._hasResource["dojo._base.lang"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.lang"] = true;
dojo.provide("dojo._base.lang");

(function(){
	var d = dojo, opts = Object.prototype.toString;

	// Crockford (ish) functions

	dojo.isString = function(/*anything*/ it){
		//	summary:
		//		Return true if it is a String
		return (typeof it == "string" || it instanceof String); // Boolean
	}

	dojo.isArray = function(/*anything*/ it){
		//	summary:
		//		Return true if it is an Array.
		//		Does not work on Arrays created in other windows.
		return it && (it instanceof Array || typeof it == "array"); // Boolean
	}

	dojo.isFunction = function(/*anything*/ it){
		// summary:
		//		Return true if it is a Function
		return opts.call(it) === "[object Function]";
	};

	dojo.isObject = function(/*anything*/ it){
		// summary:
		//		Returns true if it is a JavaScript object (or an Array, a Function
		//		or null)
		return it !== undefined &&
			(it === null || typeof it == "object" || d.isArray(it) || d.isFunction(it)); // Boolean
	}

	dojo.isArrayLike = function(/*anything*/ it){
		//	summary:
		//		similar to dojo.isArray() but more permissive
		//	description:
		//		Doesn't strongly test for "arrayness".  Instead, settles for "isn't
		//		a string or number and has a length property". Arguments objects
		//		and DOM collections will return true when passed to
		//		dojo.isArrayLike(), but will return false when passed to
		//		dojo.isArray().
		//	returns:
		//		If it walks like a duck and quacks like a duck, return `true`
		return it && it !== undefined && // Boolean
			// keep out built-in constructors (Number, String, ...) which have length
			// properties
			!d.isString(it) && !d.isFunction(it) &&
			!(it.tagName && it.tagName.toLowerCase() == 'form') &&
			(d.isArray(it) || isFinite(it.length));
	}

	dojo.isAlien = function(/*anything*/ it){
		// summary:
		//		Returns true if it is a built-in function or some other kind of
		//		oddball that *should* report as a function but doesn't
		return it && !d.isFunction(it) && /\{\s*\[native code\]\s*\}/.test(String(it)); // Boolean
	}

	dojo.extend = function(/*Object*/ constructor, /*Object...*/ props){
		// summary:
		//		Adds all properties and methods of props to constructor's
		//		prototype, making them available to all instances created with
		//		constructor.
		for(var i=1, l=arguments.length; i<l; i++){
			d._mixin(constructor.prototype, arguments[i]);
		}
		return constructor; // Object
	}

	dojo._hitchArgs = function(scope, method /*,...*/){
		var pre = d._toArray(arguments, 2);
		var named = d.isString(method);
		return function(){
			// arrayify arguments
			var args = d._toArray(arguments);
			// locate our method
			var f = named ? (scope||d.global)[method] : method;
			// invoke with collected args
			return f && f.apply(scope || this, pre.concat(args)); // mixed
		} // Function
	}

	dojo.hitch = function(/*Object*/scope, /*Function|String*/method /*,...*/){
		//	summary:
		//		Returns a function that will only ever execute in the a given scope.
		//		This allows for easy use of object member functions
		//		in callbacks and other places in which the "this" keyword may
		//		otherwise not reference the expected scope.
		//		Any number of default positional arguments may be passed as parameters 
		//		beyond "method".
		//		Each of these values will be used to "placehold" (similar to curry)
		//		for the hitched function.
		//	scope:
		//		The scope to use when method executes. If method is a string,
		//		scope is also the object containing method.
		//	method:
		//		A function to be hitched to scope, or the name of the method in
		//		scope to be hitched.
		//	example:
		//	|	dojo.hitch(foo, "bar")();
		//		runs foo.bar() in the scope of foo
		//	example:
		//	|	dojo.hitch(foo, myFunction);
		//		returns a function that runs myFunction in the scope of foo
		//	example:
		//		Expansion on the default positional arguments passed along from
		//		hitch. Passed args are mixed first, additional args after.
		//	|	var foo = { bar: function(a, b, c){ console.log(a, b, c); } };
		//	|	var fn = dojo.hitch(foo, "bar", 1, 2);
		//	|	fn(3); // logs "1, 2, 3"
		//	example:
		//	|	var foo = { bar: 2 };
		//	|	dojo.hitch(foo, function(){ this.bar = 10; })();
		//		execute an anonymous function in scope of foo
		
		if(arguments.length > 2){
			return d._hitchArgs.apply(d, arguments); // Function
		}
		if(!method){
			method = scope;
			scope = null;
		}
		if(d.isString(method)){
			scope = scope || d.global;
			if(!scope[method]){ throw(['dojo.hitch: scope["', method, '"] is null (scope="', scope, '")'].join('')); }
			return function(){ return scope[method].apply(scope, arguments || []); }; // Function
		}
		return !scope ? method : function(){ return method.apply(scope, arguments || []); }; // Function
	}

	/*=====
	dojo.delegate = function(obj, props){
		//	summary:
		//		Returns a new object which "looks" to obj for properties which it
		//		does not have a value for. Optionally takes a bag of properties to
		//		seed the returned object with initially.
		//	description:
		//		This is a small implementaton of the Boodman/Crockford delegation
		//		pattern in JavaScript. An intermediate object constructor mediates
		//		the prototype chain for the returned object, using it to delegate
		//		down to obj for property lookup when object-local lookup fails.
		//		This can be thought of similarly to ES4's "wrap", save that it does
		//		not act on types but rather on pure objects.
		//	obj:
		//		The object to delegate to for properties not found directly on the
		//		return object or in props.
		//	props:
		//		an object containing properties to assign to the returned object
		//	returns:
		//		an Object of anonymous type
		//	example:
		//	|	var foo = { bar: "baz" };
		//	|	var thinger = dojo.delegate(foo, { thud: "xyzzy"});
		//	|	thinger.bar == "baz"; // delegated to foo
		//	|	foo.thud == undefined; // by definition
		//	|	thinger.thud == "xyzzy"; // mixed in from props
		//	|	foo.bar = "thonk";
		//	|	thinger.bar == "thonk"; // still delegated to foo's bar
	}
	=====*/

	dojo.delegate = dojo._delegate = (function(){
		// boodman/crockford delegation w/ cornford optimization
		function TMP(){}
		return function(obj, props){
			TMP.prototype = obj;
			var tmp = new TMP();
			TMP.prototype = null;
			if(props){
				d._mixin(tmp, props);
			}
			return tmp; // Object
		}
	})();

	/*=====
	dojo._toArray = function(obj, offset, startWith){
		//	summary:
		//		Converts an array-like object (i.e. arguments, DOMCollection) to an
		//		array. Returns a new Array with the elements of obj.
		//	obj: Object
		//		the object to "arrayify". We expect the object to have, at a
		//		minimum, a length property which corresponds to integer-indexed
		//		properties.
		//	offset: Number?
		//		the location in obj to start iterating from. Defaults to 0.
		//		Optional.
		//	startWith: Array?
		//		An array to pack with the properties of obj. If provided,
		//		properties in obj are appended at the end of startWith and
		//		startWith is the returned array.
	}
	=====*/

	var efficient = function(obj, offset, startWith){
		return (startWith||[]).concat(Array.prototype.slice.call(obj, offset||0));
	};

		var slow = function(obj, offset, startWith){
		var arr = startWith||[];
		for(var x = offset || 0; x < obj.length; x++){
			arr.push(obj[x]);
		}
		return arr;
	};
	
	dojo._toArray =
				d.isIE ?  function(obj){
			return ((obj.item) ? slow : efficient).apply(this, arguments);
		} :
				efficient;

	dojo.partial = function(/*Function|String*/method /*, ...*/){
		//	summary:
		//		similar to hitch() except that the scope object is left to be
		//		whatever the execution context eventually becomes.
		//	description:
		//		Calling dojo.partial is the functional equivalent of calling:
		//		|	dojo.hitch(null, funcName, ...);
		var arr = [ null ];
		return d.hitch.apply(d, arr.concat(d._toArray(arguments))); // Function
	}

	var extraNames = d._extraNames, extraLen = extraNames.length, empty = {};

	dojo.clone = function(/*anything*/ o){
		// summary:
		//		Clones objects (including DOM nodes) and all children.
		//		Warning: do not clone cyclic structures.
		if(!o || typeof o != "object" || d.isFunction(o)){
			// null, undefined, any non-object, or function
			return o;	// anything
		}
		if(o.nodeType && "cloneNode" in o){
			// DOM Node
			return o.cloneNode(true); // Node
		}
		if(o instanceof Date){
			// Date
			return new Date(o.getTime());	// Date
		}
		var r, i, l, s, name;
		if(d.isArray(o)){
			// array
			r = [];
			for(i = 0, l = o.length; i < l; ++i){
				if(i in o){
					r.push(d.clone(o[i]));
				}
			}
// we don't clone functions for performance reasons
//		}else if(d.isFunction(o)){
//			// function
//			r = function(){ return o.apply(this, arguments); };
		}else{
			// generic objects
			r = o.constructor ? new o.constructor() : {};
		}
		for(name in o){
			// the "tobj" condition avoid copying properties in "source"
			// inherited from Object.prototype.  For example, if target has a custom
			// toString() method, don't overwrite it with the toString() method
			// that source inherited from Object.prototype
			s = o[name];
			if(!(name in r) || (r[name] !== s && (!(name in empty) || empty[name] !== s))){
				r[name] = d.clone(s);
			}
		}
				// IE doesn't recognize some custom functions in for..in
		if(extraLen){
			for(i = 0; i < extraLen; ++i){
				name = extraNames[i];
				s = o[name];
				if(!(name in r) || (r[name] !== s && (!(name in empty) || empty[name] !== s))){
					r[name] = s; // functions only, we don't clone them
				}
			}
		}
				return r; // Object
	}

	/*=====
	dojo.trim = function(str){
		//	summary:
		//		Trims whitespace from both sides of the string
		//	str: String
		//		String to be trimmed
		//	returns: String
		//		Returns the trimmed string
		//	description:
		//		This version of trim() was selected for inclusion into the base due
		//		to its compact size and relatively good performance
		//		(see [Steven Levithan's blog](http://blog.stevenlevithan.com/archives/faster-trim-javascript)
		//		Uses String.prototype.trim instead, if available.
		//		The fastest but longest version of this function is located at
		//		dojo.string.trim()
		return "";	// String
	}
	=====*/

	dojo.trim = String.prototype.trim ?
		function(str){ return str.trim(); } :
		function(str){ return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };

	/*=====
	dojo.replace = function(tmpl, map, pattern){
		//	summary:
		//		Performs parameterized substitutions on a string. Throws an
		//		exception if any parameter is unmatched. 
		//	tmpl: String
		//		String to be used as a template.
		//	map: Object|Function
		//		If an object, it is used as a dictionary to look up substitutions.
		//		If a function, it is called for every substitution with following
		//		parameters: a whole match, a name, an offset, and the whole template
		//		string (see https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/String/replace
		//		for more details).
		//	pattern: RegEx?
		//		Optional regular expression objects that overrides the default pattern.
		//		Must be global and match one item. The default is: /\{([^\}]+)\}/g,
		//		which matches patterns like that: "{xxx}", where "xxx" is any sequence
		//		of characters, which doesn't include "}".
		//	returns: String
		//		Returns the substituted string.
		//	example:
		//	|	// uses a dictionary for substitutions:
		//	|	dojo.replace("Hello, {name.first} {name.last} AKA {nick}!",
		//	|	  {
		//	|	    nick: "Bob",
		//	|	    name: {
		//	|	      first:  "Robert",
		//	|	      middle: "X",
		//	|	      last:   "Cringely"
		//	|	    }
		//	|	  });
		//	|	// returns: Hello, Robert Cringely AKA Bob!
		//	example:
		//	|	// uses an array for substitutions:
		//	|	dojo.replace("Hello, {0} {2}!",
		//	|	  ["Robert", "X", "Cringely"]);
		//	|	// returns: Hello, Robert Cringely!
		//	example:
		//	|	// uses a function for substitutions:
		//	|	function sum(a){
		//	|	  var t = 0;
		//	|	  dojo.forEach(a, function(x){ t += x; });
		//	|	  return t;
		//	|	}
		//	|	dojo.replace(
		//	|	  "{count} payments averaging {avg} USD per payment.",
		//	|	  dojo.hitch(
		//	|	    { payments: [11, 16, 12] },
		//	|	    function(_, key){
		//	|	      switch(key){
		//	|	        case "count": return this.payments.length;
		//	|	        case "min":   return Math.min.apply(Math, this.payments);
		//	|	        case "max":   return Math.max.apply(Math, this.payments);
		//	|	        case "sum":   return sum(this.payments);
		//	|	        case "avg":   return sum(this.payments) / this.payments.length;
		//	|	      }
		//	|	    }
		//	|	  )
		//	|	);
		//	|	// prints: 3 payments averaging 13 USD per payment.
		//	example:
		//	|	// uses an alternative PHP-like pattern for substitutions:
		//	|	dojo.replace("Hello, ${0} ${2}!",
		//	|	  ["Robert", "X", "Cringely"], /\$\{([^\}]+)\}/g);
		//	|	// returns: Hello, Robert Cringely!
		return "";	// String
	}
	=====*/

	var _pattern = /\{([^\}]+)\}/g;
	dojo.replace = function(tmpl, map, pattern){
		return tmpl.replace(pattern || _pattern, d.isFunction(map) ?
			map : function(_, k){ return d.getObject(k, false, map); });
	};
})();

}

if(!dojo._hasResource["dojo._base.array"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.array"] = true;

dojo.provide("dojo._base.array");

(function(){
	var _getParts = function(arr, obj, cb){
		return [ 
			(typeof arr == "string") ? arr.split("") : arr, 
			obj || dojo.global,
			// FIXME: cache the anonymous functions we create here?
			(typeof cb == "string") ? new Function("item", "index", "array", cb) : cb
		];
	};

	var everyOrSome = function(/*Boolean*/every, /*Array|String*/arr, /*Function|String*/callback, /*Object?*/thisObject){
		var _p = _getParts(arr, thisObject, callback); arr = _p[0];
		for(var i=0,l=arr.length; i<l; ++i){
			var result = !!_p[2].call(_p[1], arr[i], i, arr);
			if(every ^ result){
				return result; // Boolean
			}
		}
		return every; // Boolean
	};

	dojo.mixin(dojo, {
		indexOf: function(	/*Array*/		array, 
							/*Object*/		value,
							/*Integer?*/	fromIndex,
							/*Boolean?*/	findLast){
			// summary:
			//		locates the first index of the provided value in the
			//		passed array. If the value is not found, -1 is returned.
			// description:
			//		This method corresponds to the JavaScript 1.6 Array.indexOf method, with one difference: when
			//		run over sparse arrays, the Dojo function invokes the callback for every index whereas JavaScript 
			//		1.6's indexOf skips the holes in the sparse array.
			//		For details on this method, see:
			//			https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/indexOf

			var step = 1, end = array.length || 0, i = 0;
			if(findLast){
				i = end - 1;
				step = end = -1;
			}
			if(fromIndex != undefined){ i = fromIndex; }
			if((findLast && i > end) || i < end){
				for(; i != end; i += step){
					if(array[i] == value){ return i; }
				}
			}
			return -1;	// Number
		},

		lastIndexOf: function(/*Array*/array, /*Object*/value, /*Integer?*/fromIndex){
			// summary:
			//		locates the last index of the provided value in the passed
			//		array. If the value is not found, -1 is returned.
			// description:
			//		This method corresponds to the JavaScript 1.6 Array.lastIndexOf method, with one difference: when
			//		run over sparse arrays, the Dojo function invokes the callback for every index whereas JavaScript 
			//		1.6's lastIndexOf skips the holes in the sparse array.
			//		For details on this method, see:
			// 			https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/lastIndexOf
			return dojo.indexOf(array, value, fromIndex, true); // Number
		},

		forEach: function(/*Array|String*/arr, /*Function|String*/callback, /*Object?*/thisObject){
			//	summary:
			//		for every item in arr, callback is invoked. Return values are ignored.
			//		If you want to break out of the loop, consider using dojo.every() or dojo.some().
			//		forEach does not allow breaking out of the loop over the items in arr.
			//	arr:
			//		the array to iterate over. If a string, operates on individual characters.
			//	callback:
			//		a function is invoked with three arguments: item, index, and array
			//	thisObject:
			//		may be used to scope the call to callback
			//	description:
			//		This function corresponds to the JavaScript 1.6 Array.forEach() method, with one difference: when 
			//		run over sparse arrays, this implemenation passes the "holes" in the sparse array to
			//		the callback function with a value of undefined. JavaScript 1.6's forEach skips the holes in the sparse array.
			//		For more details, see:
			//			https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/forEach
			//	example:
			//	|	// log out all members of the array:
			//	|	dojo.forEach(
			//	|		[ "thinger", "blah", "howdy", 10 ],
			//	|		function(item){
			//	|			console.log(item);
			//	|		}
			//	|	);
			//	example:
			//	|	// log out the members and their indexes
			//	|	dojo.forEach(
			//	|		[ "thinger", "blah", "howdy", 10 ],
			//	|		function(item, idx, arr){
			//	|			console.log(item, "at index:", idx);
			//	|		}
			//	|	);
			//	example:
			//	|	// use a scoped object member as the callback
			//	|	
			//	|	var obj = {
			//	|		prefix: "logged via obj.callback:", 
			//	|		callback: function(item){
			//	|			console.log(this.prefix, item);
			//	|		}
			//	|	};
			//	|	
			//	|	// specifying the scope function executes the callback in that scope
			//	|	dojo.forEach(
			//	|		[ "thinger", "blah", "howdy", 10 ],
			//	|		obj.callback,
			//	|		obj
			//	|	);
			//	|	
			//	|	// alternately, we can accomplish the same thing with dojo.hitch()
			//	|	dojo.forEach(
			//	|		[ "thinger", "blah", "howdy", 10 ],
			//	|		dojo.hitch(obj, "callback")
			//	|	);

			// match the behavior of the built-in forEach WRT empty arrs
			if(!arr || !arr.length){ return; }

			// FIXME: there are several ways of handilng thisObject. Is
			// dojo.global always the default context?
			var _p = _getParts(arr, thisObject, callback); arr = _p[0];
			for(var i=0,l=arr.length; i<l; ++i){ 
				_p[2].call(_p[1], arr[i], i, arr);
			}
		},

		every: function(/*Array|String*/arr, /*Function|String*/callback, /*Object?*/thisObject){
			// summary:
			//		Determines whether or not every item in arr satisfies the
			//		condition implemented by callback.
			// arr:
			//		the array to iterate on. If a string, operates on individual characters.
			// callback:
			//		a function is invoked with three arguments: item, index,
			//		and array and returns true if the condition is met.
			// thisObject:
			//		may be used to scope the call to callback
			// description:
			//		This function corresponds to the JavaScript 1.6 Array.every() method, with one difference: when 
			//		run over sparse arrays, this implemenation passes the "holes" in the sparse array to
			//		the callback function with a value of undefined. JavaScript 1.6's every skips the holes in the sparse array.
			//		For more details, see:
			//			https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/every
			// example:
			//	|	// returns false
			//	|	dojo.every([1, 2, 3, 4], function(item){ return item>1; });
			// example:
			//	|	// returns true 
			//	|	dojo.every([1, 2, 3, 4], function(item){ return item>0; });
			return everyOrSome(true, arr, callback, thisObject); // Boolean
		},

		some: function(/*Array|String*/arr, /*Function|String*/callback, /*Object?*/thisObject){
			// summary:
			//		Determines whether or not any item in arr satisfies the
			//		condition implemented by callback.
			// arr:
			//		the array to iterate over. If a string, operates on individual characters.
			// callback:
			//		a function is invoked with three arguments: item, index,
			//		and array and returns true if the condition is met.
			// thisObject:
			//		may be used to scope the call to callback
			// description:
			//		This function corresponds to the JavaScript 1.6 Array.some() method, with one difference: when 
			//		run over sparse arrays, this implemenation passes the "holes" in the sparse array to
			//		the callback function with a value of undefined. JavaScript 1.6's some skips the holes in the sparse array.
			//		For more details, see:
			//			https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/some
			// example:
			//	|	// is true
			//	|	dojo.some([1, 2, 3, 4], function(item){ return item>1; });
			// example:
			//	|	// is false
			//	|	dojo.some([1, 2, 3, 4], function(item){ return item<1; });
			return everyOrSome(false, arr, callback, thisObject); // Boolean
		},

		map: function(/*Array|String*/arr, /*Function|String*/callback, /*Function?*/thisObject){
			// summary:
			//		applies callback to each element of arr and returns
			//		an Array with the results
			// arr:
			//		the array to iterate on. If a string, operates on
			//		individual characters.
			// callback:
			//		a function is invoked with three arguments, (item, index,
			//		array),  and returns a value
			// thisObject:
			//		may be used to scope the call to callback
			// description:
			//		This function corresponds to the JavaScript 1.6 Array.map() method, with one difference: when 
			//		run over sparse arrays, this implemenation passes the "holes" in the sparse array to
			//		the callback function with a value of undefined. JavaScript 1.6's map skips the holes in the sparse array.
			//		For more details, see:
			//			https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
			// example:
			//	|	// returns [2, 3, 4, 5]
			//	|	dojo.map([1, 2, 3, 4], function(item){ return item+1 });

			var _p = _getParts(arr, thisObject, callback); arr = _p[0];
			var outArr = (arguments[3] ? (new arguments[3]()) : []);
			for(var i=0,l=arr.length; i<l; ++i){
				outArr.push(_p[2].call(_p[1], arr[i], i, arr));
			}
			return outArr; // Array
		},

		filter: function(/*Array*/arr, /*Function|String*/callback, /*Object?*/thisObject){
			// summary:
			//		Returns a new Array with those items from arr that match the
			//		condition implemented by callback.
			// arr:
			//		the array to iterate over.
			// callback:
			//		a function that is invoked with three arguments (item,
			//		index, array). The return of this function is expected to
			//		be a boolean which determines whether the passed-in item
			//		will be included in the returned array.
			// thisObject:
			//		may be used to scope the call to callback
			// description:
			//		This function corresponds to the JavaScript 1.6 Array.filter() method, with one difference: when 
			//		run over sparse arrays, this implemenation passes the "holes" in the sparse array to
			//		the callback function with a value of undefined. JavaScript 1.6's filter skips the holes in the sparse array. 
			//		For more details, see:
			//			https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
			// example:
			//	|	// returns [2, 3, 4]
			//	|	dojo.filter([1, 2, 3, 4], function(item){ return item>1; });

			var _p = _getParts(arr, thisObject, callback); arr = _p[0];
			var outArr = [];
			for(var i=0,l=arr.length; i<l; ++i){
				if(_p[2].call(_p[1], arr[i], i, arr)){
					outArr.push(arr[i]);
				}
			}
			return outArr; // Array
		}
	});
})();
/*
*/

}

if(!dojo._hasResource["dojo._base.declare"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.declare"] = true;
dojo.provide("dojo._base.declare");




(function(){
	var d = dojo, mix = d._mixin, op = Object.prototype, opts = op.toString,
		xtor = new Function, counter = 0, cname = "constructor";

	function err(msg){ throw new Error("declare: " + msg); }

	// C3 Method Resolution Order (see http://www.python.org/download/releases/2.3/mro/)
	function c3mro(bases){
		var result = [], roots = [{cls: 0, refs: []}], nameMap = {}, clsCount = 1,
			l = bases.length, i = 0, j, lin, base, top, proto, rec, name, refs;

		// build a list of bases naming them if needed
		for(; i < l; ++i){
			base = bases[i];
			if(!base){
				err("mixin #" + i + " is unknown. Did you use dojo.require to pull it in?");
			}else if(opts.call(base) != "[object Function]"){
				err("mixin #" + i + " is not a callable constructor.");
			}
			lin = base._meta ? base._meta.bases : [base];
			top = 0;
			// add bases to the name map
			for(j = lin.length - 1; j >= 0; --j){
				proto = lin[j].prototype;
				if(!proto.hasOwnProperty("declaredClass")){
					proto.declaredClass = "uniqName_" + (counter++);
				}
				name = proto.declaredClass;
				if(!nameMap.hasOwnProperty(name)){
					nameMap[name] = {count: 0, refs: [], cls: lin[j]};
					++clsCount;
				}
				rec = nameMap[name];
				if(top && top !== rec){
					rec.refs.push(top);
					++top.count;
				}
				top = rec;
			}
			++top.count;
			roots[0].refs.push(top);
		}

		// remove classes without external references recursively
		while(roots.length){
			top = roots.pop();
			result.push(top.cls);
			--clsCount;
			// optimization: follow a single-linked chain
			while(refs = top.refs, refs.length == 1){
				top = refs[0];
				if(!top || --top.count){
					// branch or end of chain => do not end to roots
					top = 0;
					break;
				}
				result.push(top.cls);
				--clsCount;
			}
			if(top){
				// branch
				for(i = 0, l = refs.length; i < l; ++i){
					top = refs[i];
					if(!--top.count){
						roots.push(top);
					}
				}
			}
		}
		if(clsCount){
			err("can't build consistent linearization");
		}

		// calculate the superclass offset
		base = bases[0];
		result[0] = base ?
			base._meta && base === result[result.length - base._meta.bases.length] ?
				base._meta.bases.length : 1 : 0;

		return result;
	}

	function inherited(args, a, f){
		var name, chains, bases, caller, meta, base, proto, opf, pos,
			cache = this._inherited = this._inherited || {};

		// crack arguments
		if(typeof args == "string"){
			name = args;
			args = a;
			a = f;
		}
		f = 0;

		caller = args.callee;
		name = name || caller.nom;
		if(!name){
			err("can't deduce a name to call inherited()");
		}

		meta = this.constructor._meta;
		bases = meta.bases;

		pos = cache.p;
		if(name != cname){
			// method
			if(cache.c !== caller){
				// cache bust
				pos = 0;
				base = bases[0];
				meta = base._meta;
				if(meta.hidden[name] !== caller){
					// error detection
					chains = meta.chains;
					if(chains && typeof chains[name] == "string"){
						err("calling chained method with inherited: " + name);
					}
					// find caller
					do{
						meta = base._meta;
						proto = base.prototype;
						if(meta && (proto[name] === caller && proto.hasOwnProperty(name) || meta.hidden[name] === caller)){
							break;
						}
					}while(base = bases[++pos]); // intentional assignment
					pos = base ? pos : -1;
				}
			}
			// find next
			base = bases[++pos];
			if(base){
				proto = base.prototype;
				if(base._meta && proto.hasOwnProperty(name)){
					f = proto[name];
				}else{
					opf = op[name];
					do{
						proto = base.prototype;
						f = proto[name];
						if(f && (base._meta ? proto.hasOwnProperty(name) : f !== opf)){
							break;
						}
					}while(base = bases[++pos]); // intentional assignment
				}
			}
			f = base && f || op[name];
		}else{
			// constructor
			if(cache.c !== caller){
				// cache bust
				pos = 0;
				meta = bases[0]._meta;
				if(meta && meta.ctor !== caller){
					// error detection
					chains = meta.chains;
					if(!chains || chains.constructor !== "manual"){
						err("calling chained constructor with inherited");
					}
					// find caller
					while(base = bases[++pos]){ // intentional assignment
						meta = base._meta;
						if(meta && meta.ctor === caller){
							break;
						}
					}
					pos = base ? pos : -1;
				}
			}
			// find next
			while(base = bases[++pos]){	// intentional assignment
				meta = base._meta;
				f = meta ? meta.ctor : base;
				if(f){
					break;
				}
			}
			f = base && f;
		}

		// cache the found super method
		cache.c = f;
		cache.p = pos;

		// now we have the result
		if(f){
			return a === true ? f : f.apply(this, a || args);
		}
		// intentionally if a super method was not found
	}

	function getInherited(name, args){
		if(typeof name == "string"){
			return this.inherited(name, args, true);
		}
		return this.inherited(name, true);
	}

	// emulation of "instanceof"
	function isInstanceOf(cls){
		var bases = this.constructor._meta.bases;
		for(var i = 0, l = bases.length; i < l; ++i){
			if(bases[i] === cls){
				return true;
			}
		}
		return this instanceof cls;
	}

	function mixOwn(target, source){
		var name, i = 0, l = d._extraNames.length;
		// add props adding metadata for incoming functions skipping a constructor
		for(name in source){
			if(name != cname && source.hasOwnProperty(name)){
				target[name] = source[name];
			}
		}
		// process unenumerable methods on IE
		for(; i < l; ++i){
			name = d._extraNames[i];
			if(name != cname && source.hasOwnProperty(name)){
				target[name] = source[name];
			}
		}
	}

	// implementation of safe mixin function
	function safeMixin(target, source){
		var name, t, i = 0, l = d._extraNames.length;
		// add props adding metadata for incoming functions skipping a constructor
		for(name in source){
			t = source[name];
			if((t !== op[name] || !(name in op)) && name != cname){
				if(opts.call(t) == "[object Function]"){
					// non-trivial function method => attach its name
					t.nom = name;
				}
				target[name] = t;
			}
		}
		// process unenumerable methods on IE
		for(; i < l; ++i){
			name = d._extraNames[i];
			t = source[name];
			if((t !== op[name] || !(name in op)) && name != cname){
				if(opts.call(t) == "[object Function]"){
					// non-trivial function method => attach its name
					t.nom = name;
				}
				target[name] = t;
			}
		}
		return target;
	}

	function extend(source){
		safeMixin(this.prototype, source);
		return this;
	}

	// chained constructor compatible with the legacy dojo.declare()
	function chainedConstructor(bases, ctorSpecial){
		return function(){
			var a = arguments, args = a, a0 = a[0], f, i, m,
				l = bases.length, preArgs;

			if(!(this instanceof a.callee)){
				// not called via new, so force it
				return applyNew(a);
			}

			//this._inherited = {};
			// perform the shaman's rituals of the original dojo.declare()
			// 1) call two types of the preamble
			if(ctorSpecial && (a0 && a0.preamble || this.preamble)){
				// full blown ritual
				preArgs = new Array(bases.length);
				// prepare parameters
				preArgs[0] = a;
				for(i = 0;;){
					// process the preamble of the 1st argument
					a0 = a[0];
					if(a0){
						f = a0.preamble;
						if(f){
							a = f.apply(this, a) || a;
						}
					}
					// process the preamble of this class
					f = bases[i].prototype;
					f = f.hasOwnProperty("preamble") && f.preamble;
					if(f){
						a = f.apply(this, a) || a;
					}
					// one peculiarity of the preamble:
					// it is called if it is not needed,
					// e.g., there is no constructor to call
					// let's watch for the last constructor
					// (see ticket #9795)
					if(++i == l){
						break;
					}
					preArgs[i] = a;
				}
			}
			// 2) call all non-trivial constructors using prepared arguments
			for(i = l - 1; i >= 0; --i){
				f = bases[i];
				m = f._meta;
				f = m ? m.ctor : f;
				if(f){
					f.apply(this, preArgs ? preArgs[i] : a);
				}
			}
			// 3) continue the original ritual: call the postscript
			f = this.postscript;
			if(f){
				f.apply(this, args);
			}
		};
	}


	// chained constructor compatible with the legacy dojo.declare()
	function singleConstructor(ctor, ctorSpecial){
		return function(){
			var a = arguments, t = a, a0 = a[0], f;

			if(!(this instanceof a.callee)){
				// not called via new, so force it
				return applyNew(a);
			}

			//this._inherited = {};
			// perform the shaman's rituals of the original dojo.declare()
			// 1) call two types of the preamble
			if(ctorSpecial){
				// full blown ritual
				if(a0){
					// process the preamble of the 1st argument
					f = a0.preamble;
					if(f){
						t = f.apply(this, t) || t;
					}
				}
				f = this.preamble;
				if(f){
					// process the preamble of this class
					f.apply(this, t);
					// one peculiarity of the preamble:
					// it is called even if it is not needed,
					// e.g., there is no constructor to call
					// let's watch for the last constructor
					// (see ticket #9795)
				}
			}
			// 2) call a constructor
			if(ctor){
				ctor.apply(this, a);
			}
			// 3) continue the original ritual: call the postscript
			f = this.postscript;
			if(f){
				f.apply(this, a);
			}
		};
	}

	// plain vanilla constructor (can use inherited() to call its base constructor)
	function simpleConstructor(bases){
		return function(){
			var a = arguments, i = 0, f, m;

			if(!(this instanceof a.callee)){
				// not called via new, so force it
				return applyNew(a);
			}

			//this._inherited = {};
			// perform the shaman's rituals of the original dojo.declare()
			// 1) do not call the preamble
			// 2) call the top constructor (it can use this.inherited())
			for(; f = bases[i]; ++i){ // intentional assignment
				m = f._meta;
				f = m ? m.ctor : f;
				if(f){
					f.apply(this, a);
					break;
				}
			}
			// 3) call the postscript
			f = this.postscript;
			if(f){
				f.apply(this, a);
			}
		};
	}

	function chain(name, bases, reversed){
		return function(){
			var b, m, f, i = 0, step = 1;
			if(reversed){
				i = bases.length - 1;
				step = -1;
			}
			for(; b = bases[i]; i += step){ // intentional assignment
				m = b._meta;
				f = (m ? m.hidden : b.prototype)[name];
				if(f){
					f.apply(this, arguments);
				}
			}
		};
	}

	// forceNew(ctor)
	// return a new object that inherits from ctor.prototype but
	// without actually running ctor on the object.
	function forceNew(ctor){
		// create object with correct prototype using a do-nothing
		// constructor
		xtor.prototype = ctor.prototype;
		var t = new xtor;
		xtor.prototype = null;	// clean up
		return t;
	}

	// applyNew(args)
	// just like 'new ctor()' except that the constructor and its arguments come
	// from args, which must be an array or an arguments object
	function applyNew(args){
		// create an object with ctor's prototype but without
		// calling ctor on it.
		var ctor = args.callee, t = forceNew(ctor);
		// execute the real constructor on the new object
		ctor.apply(t, args);
		return t;
	}

	d.declare = function(className, superclass, props){
		// crack parameters
		if(typeof className != "string"){
			props = superclass;
			superclass = className;
			className = "";
		}
		props = props || {};

		var proto, i, t, ctor, name, bases, chains, mixins = 1, parents = superclass;

		// build a prototype
		if(opts.call(superclass) == "[object Array]"){
			// C3 MRO
			bases = c3mro(superclass);
			t = bases[0];
			mixins = bases.length - t;
			superclass = bases[mixins];
		}else{
			bases = [0];
			if(superclass){
				if(opts.call(superclass) == "[object Function]"){
					t = superclass._meta;
					bases = bases.concat(t ? t.bases : superclass);
				}else{
					err("base class is not a callable constructor.");
				}
			}else if(superclass !== null){
				err("unknown base class. Did you use dojo.require to pull it in?")
			}
		}
		if(superclass){
			for(i = mixins - 1;; --i){
				proto = forceNew(superclass);
				if(!i){
					// stop if nothing to add (the last base)
					break;
				}
				// mix in properties
				t = bases[i];
				(t._meta ? mixOwn : mix)(proto, t.prototype);
				// chain in new constructor
				ctor = new Function;
				ctor.superclass = superclass;
				ctor.prototype = proto;
				superclass = proto.constructor = ctor;
			}
		}else{
			proto = {};
		}
		// add all properties
		safeMixin(proto, props);
		// add constructor
		t = props.constructor;
		if(t !== op.constructor){
			t.nom = cname;
			proto.constructor = t;
		}

		// collect chains and flags
		for(i = mixins - 1; i; --i){ // intentional assignment
			t = bases[i]._meta;
			if(t && t.chains){
				chains = mix(chains || {}, t.chains);
			}
		}
		if(proto["-chains-"]){
			chains = mix(chains || {}, proto["-chains-"]);
		}

		// build ctor
		t = !chains || !chains.hasOwnProperty(cname);
		bases[0] = ctor = (chains && chains.constructor === "manual") ? simpleConstructor(bases) :
			(bases.length == 1 ? singleConstructor(props.constructor, t) : chainedConstructor(bases, t));

		// add meta information to the constructor
		ctor._meta  = {bases: bases, hidden: props, chains: chains,
			parents: parents, ctor: props.constructor};
		ctor.superclass = superclass && superclass.prototype;
		ctor.extend = extend;
		ctor.prototype = proto;
		proto.constructor = ctor;

		// add "standard" methods to the prototype
		proto.getInherited = getInherited;
		proto.inherited = inherited;
		proto.isInstanceOf = isInstanceOf;

		// add name if specified
		if(className){
			proto.declaredClass = className;
			d.setObject(className, ctor);
		}

		// build chains and add them to the prototype
		if(chains){
			for(name in chains){
				if(proto[name] && typeof chains[name] == "string" && name != cname){
					t = proto[name] = chain(name, bases, chains[name] === "after");
					t.nom = name;
				}
			}
		}
		// chained methods do not return values
		// no need to chain "invisible" functions

		return ctor;	// Function
	};

	d.safeMixin = safeMixin;

	/*=====
	dojo.declare = function(className, superclass, props){
		//	summary:
		//		Create a feature-rich constructor from compact notation.
		//	className: String?:
		//		The optional name of the constructor (loosely, a "class")
		//		stored in the "declaredClass" property in the created prototype.
		//		It will be used as a global name for a created constructor.
		//	superclass: Function|Function[]:
		//		May be null, a Function, or an Array of Functions. This argument
		//		specifies a list of bases (the left-most one is the most deepest
		//		base).
		//	props: Object:
		//		An object whose properties are copied to the created prototype.
		//		Add an instance-initialization function by making it a property
		//		named "constructor".
		//	returns:
		//		New constructor function.
		//	description:
		//		Create a constructor using a compact notation for inheritance and
		//		prototype extension.
		//
		//		Mixin ancestors provide a type of multiple inheritance.
		//		Prototypes of mixin ancestors are copied to the new class:
		//		changes to mixin prototypes will not affect classes to which
		//		they have been mixed in.
		//
		//		Ancestors can be compound classes created by this version of
		//		dojo.declare. In complex cases all base classes are going to be
		//		linearized according to C3 MRO algorithm
		//		(see http://www.python.org/download/releases/2.3/mro/ for more
		//		details).
		//
		//		"className" is cached in "declaredClass" property of the new class,
		//		if it was supplied. The immediate super class will be cached in
		//		"superclass" property of the new class.
		//
		//		Methods in "props" will be copied and modified: "nom" property
		//		(the declared name of the method) will be added to all copied
		//		functions to help identify them for the internal machinery. Be
		//		very careful, while reusing methods: if you use the same
		//		function under different names, it can produce errors in some
		//		cases.
		//
		//		It is possible to use constructors created "manually" (without
		//		dojo.declare) as bases. They will be called as usual during the
		//		creation of an instance, their methods will be chained, and even
		//		called by "this.inherited()".
		//
		//		Special property "-chains-" governs how to chain methods. It is
		//		a dictionary, which uses method names as keys, and hint strings
		//		as values. If a hint string is "after", this method will be
		//		called after methods of its base classes. If a hint string is
		//		"before", this method will be called before methods of its base
		//		classes.
		//
		//		If "constructor" is not mentioned in "-chains-" property, it will
		//		be chained using the legacy mode: using "after" chaining,
		//		calling preamble() method before each constructor, if available,
		//		and calling postscript() after all constructors were executed.
		//		If the hint is "after", it is chained as a regular method, but
		//		postscript() will be called after the chain of constructors.
		//		"constructor" cannot be chained "before", but it allows
		//		a special hint string: "manual", which means that constructors
		//		are not going to be chained in any way, and programmer will call
		//		them manually using this.inherited(). In the latter case
		//		postscript() will be called after the construction.
		//
		//		All chaining hints are "inherited" from base classes and
		//		potentially can be overridden. Be very careful when overriding
		//		hints! Make sure that all chained methods can work in a proposed
		//		manner of chaining.
		//
		//		Once a method was chained, it is impossible to unchain it. The
		//		only exception is "constructor". You don't need to define a
		//		method in order to supply a chaining hint.
		//
		//		If a method is chained, it cannot use this.inherited() because
		//		all other methods in the hierarchy will be called automatically.
		//
		//		Usually constructors and initializers of any kind are chained
		//		using "after" and destructors of any kind are chained as
		//		"before". Note that chaining assumes that chained methods do not
		//		return any value: any returned value will be discarded.
		//
		//	example:
		//	|	dojo.declare("my.classes.bar", my.classes.foo, {
		//	|		// properties to be added to the class prototype
		//	|		someValue: 2,
		//	|		// initialization function
		//	|		constructor: function(){
		//	|			this.myComplicatedObject = new ReallyComplicatedObject();
		//	|		},
		//	|		// other functions
		//	|		someMethod: function(){
		//	|			doStuff();
		//	|		}
		//	|	});
		//
		//	example:
		//	|	var MyBase = dojo.declare(null, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var MyClass1 = dojo.declare(MyBase, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var MyClass2 = dojo.declare(MyBase, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var MyDiamond = dojo.declare([MyClass1, MyClass2], {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//
		//	example:
		//	|	var F = function(){ console.log("raw constructor"); };
		//	|	F.prototype.method = function(){
		//	|		console.log("raw method");
		//	|	};
		//	|	var A = dojo.declare(F, {
		//	|		constructor: function(){
		//	|			console.log("A.constructor");
		//	|		},
		//	|		method: function(){
		//	|			console.log("before calling F.method...");
		//	|			this.inherited(arguments);
		//	|			console.log("...back in A");
		//	|		}
		//	|	});
		//	|	new A().method();
		//	|	// will print:
		//	|	// raw constructor
		//	|	// A.constructor
		//	|	// before calling F.method...
		//	|	// raw method
		//	|	// ...back in A
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		"-chains-": {
		//	|			destroy: "before"
		//	|		}
		//	|	});
		//	|	var B = dojo.declare(A, {
		//	|		constructor: function(){
		//	|			console.log("B.constructor");
		//	|		},
		//	|		destroy: function(){
		//	|			console.log("B.destroy");
		//	|		}
		//	|	});
		//	|	var C = dojo.declare(B, {
		//	|		constructor: function(){
		//	|			console.log("C.constructor");
		//	|		},
		//	|		destroy: function(){
		//	|			console.log("C.destroy");
		//	|		}
		//	|	});
		//	|	new C().destroy();
		//	|	// prints:
		//	|	// B.constructor
		//	|	// C.constructor
		//	|	// C.destroy
		//	|	// B.destroy
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		"-chains-": {
		//	|			constructor: "manual"
		//	|		}
		//	|	});
		//	|	var B = dojo.declare(A, {
		//	|		constructor: function(){
		//	|			// ...
		//	|			// call the base constructor with new parameters
		//	|			this.inherited(arguments, [1, 2, 3]);
		//	|			// ...
		//	|		}
		//	|	});
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		"-chains-": {
		//	|			m1: "before"
		//	|		},
		//	|		m1: function(){
		//	|			console.log("A.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("A.m2");
		//	|		}
		//	|	});
		//	|	var B = dojo.declare(A, {
		//	|		"-chains-": {
		//	|			m2: "after"
		//	|		},
		//	|		m1: function(){
		//	|			console.log("B.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("B.m2");
		//	|		}
		//	|	});
		//	|	var x = new B();
		//	|	x.m1();
		//	|	// prints:
		//	|	// B.m1
		//	|	// A.m1
		//	|	x.m2();
		//	|	// prints:
		//	|	// A.m2
		//	|	// B.m2
		return new Function(); // Function
	};
	=====*/

	/*=====
	dojo.safeMixin = function(target, source){
		//	summary:
		//		Mix in properties skipping a constructor and decorating functions
		//		like it is done by dojo.declare.
		//	target: Object
		//		Target object to accept new properties.
		//	source: Object
		//		Source object for new properties.
		//	description:
		//		This function is used to mix in properties like dojo._mixin does,
		//		but it skips a constructor property and decorates functions like
		//		dojo.declare does.
		//
		//		It is meant to be used with classes and objects produced with
		//		dojo.declare. Functions mixed in with dojo.safeMixin can use
		//		this.inherited() like normal methods.
		//
		//		This function is used to implement extend() method of a constructor
		//		produced with dojo.declare().
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		m1: function(){
		//	|			console.log("A.m1");
		//	|		},
		//	|		m2: function(){
		//	|			console.log("A.m2");
		//	|		}
		//	|	});
		//	|	var B = dojo.declare(A, {
		//	|		m1: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("B.m1");
		//	|		}
		//	|	});
		//	|	B.extend({
		//	|		m2: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("B.m2");
		//	|		}
		//	|	});
		//	|	var x = new B();
		//	|	dojo.safeMixin(x, {
		//	|		m1: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("X.m1");
		//	|		},
		//	|		m2: function(){
		//	|			this.inherited(arguments);
		//	|			console.log("X.m2");
		//	|		}
		//	|	});
		//	|	x.m2();
		//	|	// prints:
		//	|	// A.m1
		//	|	// B.m1
		//	|	// X.m1
	};
	=====*/

	/*=====
	Object.inherited = function(name, args, newArgs){
		//	summary:
		//		Calls a super method.
		//	name: String?
		//		The optional method name. Should be the same as the caller's
		//		name. Usually "name" is specified in complex dynamic cases, when
		//		the calling method was dynamically added, undecorated by
		//		dojo.declare, and it cannot be determined.
		//	args: Arguments
		//		The caller supply this argument, which should be the original
		//		"arguments".
		//	newArgs: Object?
		//		If "true", the found function will be returned without
		//		executing it.
		//		If Array, it will be used to call a super method. Otherwise
		//		"args" will be used.
		//	returns:
		//		Whatever is returned by a super method, or a super method itself,
		//		if "true" was specified as newArgs.
		//	description:
		//		This method is used inside method of classes produced with
		//		dojo.declare to call a super method (next in the chain). It is
		//		used for manually controlled chaining. Consider using the regular
		//		chaining, because it is faster. Use "this.inherited()" only in
		//		complex cases.
		//
		//		This method cannot me called from automatically chained
		//		constructors including the case of a special (legacy)
		//		constructor chaining. It cannot be called from chained methods.
		//
		//		If "this.inherited()" cannot find the next-in-chain method, it
		//		does nothing and returns "undefined". The last method in chain
		//		can be a default method implemented in Object, which will be
		//		called last.
		//
		//		If "name" is specified, it is assumed that the method that
		//		received "args" is the parent method for this call. It is looked
		//		up in the chain list and if it is found the next-in-chain method
		//		is called. If it is not found, the first-in-chain method is
		//		called.
		//
		//		If "name" is not specified, it will be derived from the calling
		//		method (using a methoid property "nom").
		//
		//	example:
		//	|	var B = dojo.declare(A, {
		//	|		method1: function(a, b, c){
		//	|			this.inherited(arguments);
		//	|		},
		//	|		method2: function(a, b){
		//	|			return this.inherited(arguments, [a + b]);
		//	|		}
		//	|	});
		//	|	// next method is not in the chain list because it is added
		//	|	// manually after the class was created.
		//	|	B.prototype.method3 = function(){
		//	|		console.log("This is a dynamically-added method.");
		//	|		this.inherited("method3", arguments);
		//	|	};
		//	example:
		//	|	var B = dojo.declare(A, {
		//	|		method: function(a, b){
		//	|			var super = this.inherited(arguments, true);
		//	|			// ...
		//	|			if(!super){
		//	|				console.log("there is no super method");
		//	|				return 0;
		//	|			}
		//	|			return super.apply(this, arguments);
		//	|		}
		//	|	});
		return	{};	// Object
	}
	=====*/

	/*=====
	Object.getInherited = function(name, args){
		//	summary:
		//		Returns a super method.
		//	name: String?
		//		The optional method name. Should be the same as the caller's
		//		name. Usually "name" is specified in complex dynamic cases, when
		//		the calling method was dynamically added, undecorated by
		//		dojo.declare, and it cannot be determined.
		//	args: Arguments
		//		The caller supply this argument, which should be the original
		//		"arguments".
		//	returns:
		//		Returns a super method (Function) or "undefined".
		//	description:
		//		This method is a convenience method for "this.inherited()".
		//		It uses the same algorithm but instead of executing a super
		//		method, it returns it, or "undefined" if not found.
		//
		//	example:
		//	|	var B = dojo.declare(A, {
		//	|		method: function(a, b){
		//	|			var super = this.getInherited(arguments);
		//	|			// ...
		//	|			if(!super){
		//	|				console.log("there is no super method");
		//	|				return 0;
		//	|			}
		//	|			return super.apply(this, arguments);
		//	|		}
		//	|	});
		return	{};	// Object
	}
	=====*/

	/*=====
	Object.isInstanceOf = function(cls){
		//	summary:
		//		Checks the inheritance chain to see if it is inherited from this
		//		class.
		//	cls: Function
		//		Class constructor.
		//	returns:
		//		"true", if this object is inherited from this class, "false"
		//		otherwise.
		//	description:
		//		This method is used with instances of classes produced with
		//		dojo.declare to determine of they support a certain interface or
		//		not. It models "instanceof" operator.
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var B = dojo.declare(null, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var C = dojo.declare([A, B], {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|	var D = dojo.declare(A, {
		//	|		// constructor, properties, and methods go here
		//	|		// ...
		//	|	});
		//	|
		//	|	var a = new A(), b = new B(), c = new C(), d = new D();
		//	|
		//	|	console.log(a.isInstanceOf(A)); // true
		//	|	console.log(b.isInstanceOf(A)); // false
		//	|	console.log(c.isInstanceOf(A)); // true
		//	|	console.log(d.isInstanceOf(A)); // true
		//	|
		//	|	console.log(a.isInstanceOf(B)); // false
		//	|	console.log(b.isInstanceOf(B)); // true
		//	|	console.log(c.isInstanceOf(B)); // true
		//	|	console.log(d.isInstanceOf(B)); // false
		//	|
		//	|	console.log(a.isInstanceOf(C)); // false
		//	|	console.log(b.isInstanceOf(C)); // false
		//	|	console.log(c.isInstanceOf(C)); // true
		//	|	console.log(d.isInstanceOf(C)); // false
		//	|
		//	|	console.log(a.isInstanceOf(D)); // false
		//	|	console.log(b.isInstanceOf(D)); // false
		//	|	console.log(c.isInstanceOf(D)); // false
		//	|	console.log(d.isInstanceOf(D)); // true
		return	{};	// Object
	}
	=====*/

	/*=====
	Object.extend = function(source){
		//	summary:
		//		Adds all properties and methods of source to constructor's
		//		prototype, making them available to all instances created with
		//		constructor. This method is specific to constructors created with
		//		dojo.declare.
		//	source: Object
		//		Source object which properties are going to be copied to the
		//		constructor's prototype.
		//	description:
		//		Adds source properties to the constructor's prototype. It can
		//		override existing properties.
		//
		//		This method is similar to dojo.extend function, but it is specific
		//		to constructors produced by dojo.declare. It is implemented
		//		using dojo.safeMixin, and it skips a constructor property,
		//		and properly decorates copied functions.
		//
		//	example:
		//	|	var A = dojo.declare(null, {
		//	|		m1: function(){},
		//	|		s1: "Popokatepetl"
		//	|	});
		//	|	A.extend({
		//	|		m1: function(){},
		//	|		m2: function(){},
		//	|		f1: true,
		//	|		d1: 42
		//	|	});
	};
	=====*/
})();

}

if(!dojo._hasResource["dojo._base.connect"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.connect"] = true;
dojo.provide("dojo._base.connect");


// this file courtesy of the TurboAjax Group, licensed under a Dojo CLA

// low-level delegation machinery
dojo._listener = {
	// create a dispatcher function
	getDispatcher: function(){
		// following comments pulled out-of-line to prevent cloning them 
		// in the returned function.
		// - indices (i) that are really in the array of listeners (ls) will 
		//   not be in Array.prototype. This is the 'sparse array' trick
		//   that keeps us safe from libs that take liberties with built-in 
		//   objects
		// - listener is invoked with current scope (this)
		return function(){
			var ap=Array.prototype, c=arguments.callee, ls=c._listeners, t=c.target;
			// return value comes from original target function
			var r = t && t.apply(this, arguments);
			// make local copy of listener array so it is immutable during processing
			var i, lls;
											lls = [].concat(ls);
							
			// invoke listeners after target function
			for(i in lls){
				if(!(i in ap)){
					lls[i].apply(this, arguments);
				}
			}
			// return value comes from original target function
			return r;
		};
	},
	// add a listener to an object
	add: function(/*Object*/ source, /*String*/ method, /*Function*/ listener){
		// Whenever 'method' is invoked, 'listener' will have the same scope.
		// Trying to supporting a context object for the listener led to 
		// complexity. 
		// Non trivial to provide 'once' functionality here
		// because listener could be the result of a dojo.hitch call,
		// in which case two references to the same hitch target would not
		// be equivalent. 
		source = source || dojo.global;
		// The source method is either null, a dispatcher, or some other function
		var f = source[method];
		// Ensure a dispatcher
		if(!f || !f._listeners){
			var d = dojo._listener.getDispatcher();
			// original target function is special
			d.target = f;
			// dispatcher holds a list of listeners
			d._listeners = []; 
			// redirect source to dispatcher
			f = source[method] = d;
		}
		// The contract is that a handle is returned that can 
		// identify this listener for disconnect. 
		//
		// The type of the handle is private. Here is it implemented as Integer. 
		// DOM event code has this same contract but handle is Function 
		// in non-IE browsers.
		//
		// We could have separate lists of before and after listeners.
		return f._listeners.push(listener); /*Handle*/
	},
	// remove a listener from an object
	remove: function(/*Object*/ source, /*String*/ method, /*Handle*/ handle){
		var f = (source || dojo.global)[method];
		// remember that handle is the index+1 (0 is not a valid handle)
		if(f && f._listeners && handle--){
			delete f._listeners[handle];
		}
	}
};

// Multiple delegation for arbitrary methods.

// This unit knows nothing about DOM, but we include DOM aware documentation
// and dontFix argument here to help the autodocs. Actual DOM aware code is in
// event.js.

dojo.connect = function(/*Object|null*/ obj, 
						/*String*/ event, 
						/*Object|null*/ context, 
						/*String|Function*/ method,
						/*Boolean?*/ dontFix){
	// summary:
	//		`dojo.connect` is the core event handling and delegation method in
	//		Dojo. It allows one function to "listen in" on the execution of
	//		any other, triggering the second whenever the first is called. Many
	//		listeners may be attached to a function, and source functions may
	//		be either regular function calls or DOM events.
	//
	// description:
	//		Connects listeners to actions, so that after event fires, a
	//		listener is called with the same arguments passed to the original
	//		function.
	//
	//		Since `dojo.connect` allows the source of events to be either a
	//		"regular" JavaScript function or a DOM event, it provides a uniform
	//		interface for listening to all the types of events that an
	//		application is likely to deal with though a single, unified
	//		interface. DOM programmers may want to think of it as
	//		"addEventListener for everything and anything".
	//
	//		When setting up a connection, the `event` parameter must be a
	//		string that is the name of the method/event to be listened for. If
	//		`obj` is null, `dojo.global` is assumed, meaning that connections
	//		to global methods are supported but also that you may inadvertently
	//		connect to a global by passing an incorrect object name or invalid
	//		reference.
	//
	//		`dojo.connect` generally is forgiving. If you pass the name of a
	//		function or method that does not yet exist on `obj`, connect will
	//		not fail, but will instead set up a stub method. Similarly, null
	//		arguments may simply be omitted such that fewer than 4 arguments
	//		may be required to set up a connection See the examples for details.
	//
	//		The return value is a handle that is needed to 
	//		remove this connection with `dojo.disconnect`.
	//
	// obj: 
	//		The source object for the event function. 
	//		Defaults to `dojo.global` if null.
	//		If obj is a DOM node, the connection is delegated 
	//		to the DOM event manager (unless dontFix is true).
	//
	// event:
	//		String name of the event function in obj. 
	//		I.e. identifies a property `obj[event]`.
	//
	// context: 
	//		The object that method will receive as "this".
	//
	//		If context is null and method is a function, then method
	//		inherits the context of event.
	//	
	//		If method is a string then context must be the source 
	//		object object for method (context[method]). If context is null,
	//		dojo.global is used.
	//
	// method:
	//		A function reference, or name of a function in context. 
	//		The function identified by method fires after event does. 
	//		method receives the same arguments as the event.
	//		See context argument comments for information on method's scope.
	//
	// dontFix:
	//		If obj is a DOM node, set dontFix to true to prevent delegation 
	//		of this connection to the DOM event manager.
	//
	// example:
	//		When obj.onchange(), do ui.update():
	//	|	dojo.connect(obj, "onchange", ui, "update");
	//	|	dojo.connect(obj, "onchange", ui, ui.update); // same
	//
	// example:
	//		Using return value for disconnect:
	//	|	var link = dojo.connect(obj, "onchange", ui, "update");
	//	|	...
	//	|	dojo.disconnect(link);
	//
	// example:
	//		When onglobalevent executes, watcher.handler is invoked:
	//	|	dojo.connect(null, "onglobalevent", watcher, "handler");
	//
	// example:
	//		When ob.onCustomEvent executes, customEventHandler is invoked:
	//	|	dojo.connect(ob, "onCustomEvent", null, "customEventHandler");
	//	|	dojo.connect(ob, "onCustomEvent", "customEventHandler"); // same
	//
	// example:
	//		When ob.onCustomEvent executes, customEventHandler is invoked
	//		with the same scope (this):
	//	|	dojo.connect(ob, "onCustomEvent", null, customEventHandler);
	//	|	dojo.connect(ob, "onCustomEvent", customEventHandler); // same
	//
	// example:
	//		When globalEvent executes, globalHandler is invoked
	//		with the same scope (this):
	//	|	dojo.connect(null, "globalEvent", null, globalHandler);
	//	|	dojo.connect("globalEvent", globalHandler); // same

	// normalize arguments
	var a=arguments, args=[], i=0;
	// if a[0] is a String, obj was omitted
	args.push(dojo.isString(a[0]) ? null : a[i++], a[i++]);
	// if the arg-after-next is a String or Function, context was NOT omitted
	var a1 = a[i+1];
	args.push(dojo.isString(a1)||dojo.isFunction(a1) ? a[i++] : null, a[i++]);
	// absorb any additional arguments
	for(var l=a.length; i<l; i++){	args.push(a[i]); }
	// do the actual work
	return dojo._connect.apply(this, args); /*Handle*/
}

// used by non-browser hostenvs. always overriden by event.js
dojo._connect = function(obj, event, context, method){
	var l=dojo._listener, h=l.add(obj, event, dojo.hitch(context, method)); 
	return [obj, event, h, l]; // Handle
}

dojo.disconnect = function(/*Handle*/ handle){
	// summary:
	//		Remove a link created by dojo.connect.
	// description:
	//		Removes the connection between event and the method referenced by handle.
	// handle:
	//		the return value of the dojo.connect call that created the connection.
	if(handle && handle[0] !== undefined){
		dojo._disconnect.apply(this, handle);
		// let's not keep this reference
		delete handle[0];
	}
}

dojo._disconnect = function(obj, event, handle, listener){
	listener.remove(obj, event, handle);
}

// topic publish/subscribe

dojo._topics = {};

dojo.subscribe = function(/*String*/ topic, /*Object|null*/ context, /*String|Function*/ method){
	//	summary:
	//		Attach a listener to a named topic. The listener function is invoked whenever the
	//		named topic is published (see: dojo.publish).
	//		Returns a handle which is needed to unsubscribe this listener.
	//	context:
	//		Scope in which method will be invoked, or null for default scope.
	//	method:
	//		The name of a function in context, or a function reference. This is the function that
	//		is invoked when topic is published.
	//	example:
	//	|	dojo.subscribe("alerts", null, function(caption, message){ alert(caption + "\n" + message); });
	//	|	dojo.publish("alerts", [ "read this", "hello world" ]);																	

	// support for 2 argument invocation (omitting context) depends on hitch
	return [topic, dojo._listener.add(dojo._topics, topic, dojo.hitch(context, method))]; /*Handle*/
}

dojo.unsubscribe = function(/*Handle*/ handle){
	//	summary:
	//	 	Remove a topic listener. 
	//	handle:
	//	 	The handle returned from a call to subscribe.
	//	example:
	//	|	var alerter = dojo.subscribe("alerts", null, function(caption, message){ alert(caption + "\n" + message); };
	//	|	...
	//	|	dojo.unsubscribe(alerter);
	if(handle){
		dojo._listener.remove(dojo._topics, handle[0], handle[1]);
	}
}

dojo.publish = function(/*String*/ topic, /*Array*/ args){
	//	summary:
	//	 	Invoke all listener method subscribed to topic.
	//	topic:
	//	 	The name of the topic to publish.
	//	args:
	//	 	An array of arguments. The arguments will be applied 
	//	 	to each topic subscriber (as first class parameters, via apply).
	//	example:
	//	|	dojo.subscribe("alerts", null, function(caption, message){ alert(caption + "\n" + message); };
	//	|	dojo.publish("alerts", [ "read this", "hello world" ]);	

	// Note that args is an array, which is more efficient vs variable length
	// argument list.  Ideally, var args would be implemented via Array
	// throughout the APIs.
	var f = dojo._topics[topic];
	if(f){
		f.apply(this, args||[]);
	}
}

dojo.connectPublisher = function(	/*String*/ topic, 
									/*Object|null*/ obj, 
									/*String*/ event){
	//	summary:
	//	 	Ensure that every time obj.event() is called, a message is published
	//	 	on the topic. Returns a handle which can be passed to
	//	 	dojo.disconnect() to disable subsequent automatic publication on
	//	 	the topic.
	//	topic:
	//	 	The name of the topic to publish.
	//	obj: 
	//	 	The source object for the event function. Defaults to dojo.global
	//	 	if null.
	//	event:
	//	 	The name of the event function in obj. 
	//	 	I.e. identifies a property obj[event].
	//	example:
	//	|	dojo.connectPublisher("/ajax/start", dojo, "xhrGet");
	var pf = function(){ dojo.publish(topic, arguments); }
	return event ? dojo.connect(obj, event, pf) : dojo.connect(obj, pf); //Handle
};

}

if(!dojo._hasResource["dojo._base.Deferred"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.Deferred"] = true;
dojo.provide("dojo._base.Deferred");


(function(){
	var mutator = function(){};		
	var freeze = Object.freeze || function(){};
	// A deferred provides an API for creating and resolving a promise.
	dojo.Deferred = function(/*Function?*/canceller){
	// summary:
	//		Deferreds provide a generic means for encapsulating an asynchronous
	// 		operation and notifying users of the completion and result of the operation. 
	// description:
	//		The dojo.Deferred API is based on the concept of promises that provide a
	//		generic interface into the eventual completion of an asynchronous action.
	//		The motivation for promises fundamentally is about creating a 
	//		separation of concerns that allows one to achieve the same type of 
	//		call patterns and logical data flow in asynchronous code as can be 
	//		achieved in synchronous code. Promises allows one 
	//		to be able to call a function purely with arguments needed for 
	//		execution, without conflating the call with concerns of whether it is 
	//		sync or async. One shouldn't need to alter a call's arguments if the 
	//		implementation switches from sync to async (or vice versa). By having 
	//		async functions return promises, the concerns of making the call are 
	//		separated from the concerns of asynchronous interaction (which are 
	//		handled by the promise).
	// 
	//  	The dojo.Deferred is a type of promise that provides methods for fulfilling the 
	// 		promise with a successful result or an error. The most important method for 
	// 		working with Dojo's promises is the then() method, which follows the 
	// 		CommonJS proposed promise API. An example of using a Dojo promise:
	//		
	//		| 	var resultingPromise = someAsyncOperation.then(function(result){
	//		|		... handle result ...
	//		|	},
	//		|	function(error){
	//		|		... handle error ...
	//		|	});
	//	
	//		The .then() call returns a new promise that represents the result of the 
	// 		execution of the callback. The callbacks will never affect the original promises value.
	//
	//		The dojo.Deferred instances also provide the following functions for backwards compatibility:
	//
	//			* addCallback(handler)
	//			* addErrback(handler)
	//			* callback(result)
	//			* errback(result)
	//
	//		Callbacks are allowed to return promisesthemselves, so
	//		you can build complicated sequences of events with ease.
	//
	//		The creator of the Deferred may specify a canceller.  The canceller
	//		is a function that will be called if Deferred.cancel is called
	//		before the Deferred fires. You can use this to implement clean
	//		aborting of an XMLHttpRequest, etc. Note that cancel will fire the
	//		deferred with a CancelledError (unless your canceller returns
	//		another kind of error), so the errbacks should be prepared to
	//		handle that error for cancellable Deferreds.
	// example:
	//	|	var deferred = new dojo.Deferred();
	//	|	setTimeout(function(){ deferred.callback({success: true}); }, 1000);
	//	|	return deferred;
	// example:
	//		Deferred objects are often used when making code asynchronous. It
	//		may be easiest to write functions in a synchronous manner and then
	//		split code using a deferred to trigger a response to a long-lived
	//		operation. For example, instead of register a callback function to
	//		denote when a rendering operation completes, the function can
	//		simply return a deferred:
	//
	//		|	// callback style:
	//		|	function renderLotsOfData(data, callback){
	//		|		var success = false
	//		|		try{
	//		|			for(var x in data){
	//		|				renderDataitem(data[x]);
	//		|			}
	//		|			success = true;
	//		|		}catch(e){ }
	//		|		if(callback){
	//		|			callback(success);
	//		|		}
	//		|	}
	//
	//		|	// using callback style
	//		|	renderLotsOfData(someDataObj, function(success){
	//		|		// handles success or failure
	//		|		if(!success){
	//		|			promptUserToRecover();
	//		|		}
	//		|	});
	//		|	// NOTE: no way to add another callback here!!
	// example:
	//		Using a Deferred doesn't simplify the sending code any, but it
	//		provides a standard interface for callers and senders alike,
	//		providing both with a simple way to service multiple callbacks for
	//		an operation and freeing both sides from worrying about details
	//		such as "did this get called already?". With Deferreds, new
	//		callbacks can be added at any time.
	//
	//		|	// Deferred style:
	//		|	function renderLotsOfData(data){
	//		|		var d = new dojo.Deferred();
	//		|		try{
	//		|			for(var x in data){
	//		|				renderDataitem(data[x]);
	//		|			}
	//		|			d.callback(true);
	//		|		}catch(e){ 
	//		|			d.errback(new Error("rendering failed"));
	//		|		}
	//		|		return d;
	//		|	}
	//
	//		|	// using Deferred style
	//		|	renderLotsOfData(someDataObj).then(null, function(){
	//		|		promptUserToRecover();
	//		|	});
	//		|	// NOTE: addErrback and addCallback both return the Deferred
	//		|	// again, so we could chain adding callbacks or save the
	//		|	// deferred for later should we need to be notified again.
	// example:
	//		In this example, renderLotsOfData is syncrhonous and so both
	//		versions are pretty artificial. Putting the data display on a
	//		timeout helps show why Deferreds rock:
	//
	//		|	// Deferred style and async func
	//		|	function renderLotsOfData(data){
	//		|		var d = new dojo.Deferred();
	//		|		setTimeout(function(){
	//		|			try{
	//		|				for(var x in data){
	//		|					renderDataitem(data[x]);
	//		|				}
	//		|				d.callback(true);
	//		|			}catch(e){ 
	//		|				d.errback(new Error("rendering failed"));
	//		|			}
	//		|		}, 100);
	//		|		return d;
	//		|	}
	//
	//		|	// using Deferred style
	//		|	renderLotsOfData(someDataObj).then(null, function(){
	//		|		promptUserToRecover();
	//		|	});
	//
	//		Note that the caller doesn't have to change his code at all to
	//		handle the asynchronous case.
		var result, finished, isError, head, nextListener;
		var promise = this.promise = {};
		
		function complete(value){
			if(finished){
				throw new Error("This deferred has already been resolved");				
			}
			result = value;
			finished = true;
			notify();
		}
		function notify(){
			var mutated;
			while(!mutated && nextListener){
				var listener = nextListener;
				nextListener = nextListener.next;
				if(mutated = (listener.progress == mutator)){ // assignment and check
					finished = false;
				}
				var func = (isError ? listener.error : listener.resolved);
				if (func) {
					try {
						var newResult = func(result);
						if (newResult && typeof newResult.then === "function") {
							newResult.then(dojo.hitch(listener.deferred, "resolve"), dojo.hitch(listener.deferred, "reject"));
							continue;
						}
						var unchanged = mutated && newResult === undefined;
						listener.deferred[unchanged && isError ? "reject" : "resolve"](unchanged ? result : newResult);
					}
					catch (e) {
						listener.deferred.reject(e);
					}
				}else {
					if(isError){
						listener.deferred.reject(result);
					}else{
						listener.deferred.resolve(result);
					}
				}
			}	
		}
		// calling resolve will resolve the promise
		this.resolve = this.callback = function(value){
			// summary:
			//		Fulfills the Deferred instance successfully with the provide value
			this.fired = 0;
			this.results = [value, null];
			complete(value);
		};
		
		
		// calling error will indicate that the promise failed
		this.reject = this.errback = function(error){
			// summary:
			//		Fulfills the Deferred instance as an error with the provided error 
			isError = true;
			this.fired = 1;
			complete(error);
			this.results = [null, error];
			if(!error || error.log !== false){
				(dojo.config.deferredOnError || function(x){ console.error(x); })(error);
			}
		};
		// call progress to provide updates on the progress on the completion of the promise
		this.progress = function(update){
			// summary
			//		Send progress events to all listeners
			var listener = nextListener;
			while(listener){
				var progress = listener.progress;
				progress && progress(update);
				listener = listener.next;	
			}
		};
		this.addCallbacks = function(/*Function?*/callback, /*Function?*/errback){
			this.then(callback, errback, mutator);
			return this;
		};
		// provide the implementation of the promise
		this.then = promise.then = function(/*Function?*/resolvedCallback, /*Function?*/errorCallback, /*Function?*/progressCallback){
			// summary
			// 		Adds a fulfilledHandler, errorHandler, and progressHandler to be called for 
			// 		completion of a promise. The fulfilledHandler is called when the promise 
			// 		is fulfilled. The errorHandler is called when a promise fails. The 
			// 		progressHandler is called for progress events. All arguments are optional 
			// 		and non-function values are ignored. The progressHandler is not only an 
			// 		optional argument, but progress events are purely optional. Promise 
			// 		providers are not required to ever create progress events.
			// 
			// 		This function will return a new promise that is fulfilled when the given 
			// 		fulfilledHandler or errorHandler callback is finished. This allows promise 
			// 		operations to be chained together. The value returned from the callback 
			// 		handler is the fulfillment value for the returned promise. If the callback 
			// 		throws an error, the returned promise will be moved to failed state.
			//	
			// example:
			// 		An example of using a CommonJS compliant promise:
  			//		|	asyncComputeTheAnswerToEverything().
			//		|		then(addTwo).
			//		|		then(printResult, onError);
  			//		|	>44 
			// 		
			var returnDeferred = progressCallback == mutator ? this : new dojo.Deferred(promise.cancel);
			var listener = {
				resolved: resolvedCallback, 
				error: errorCallback, 
				progress: progressCallback, 
				deferred: returnDeferred
			}; 
			if(nextListener){
				head = head.next = listener;
			}
			else{
				nextListener = head = listener;
			}
			if(finished){
				notify();
			}
			return returnDeferred.promise;
		};
		var deferred = this;
		this.cancel = promise.cancel = function () {
			// summary:
			//		Cancels the asynchronous operation
			if(!finished){
				var error = canceller && canceller(deferred);
				if(!finished){
					if (!(error instanceof Error)) {
						error = new Error(error);
					}
					error.log = false;
					deferred.reject(error);
				}
			}
		}
		freeze(promise);
	};
	dojo.extend(dojo.Deferred, {
		addCallback: function (/*Function*/callback) {
			return this.addCallbacks(dojo.hitch.apply(dojo, arguments));
		},
	
		addErrback: function (/*Function*/errback) {
			return this.addCallbacks(null, dojo.hitch.apply(dojo, arguments));
		},
	
		addBoth: function (/*Function*/callback) {
			var enclosed = dojo.hitch.apply(dojo, arguments);
			return this.addCallbacks(enclosed, enclosed);
		},
		fired: -1
	});
})();
dojo.when = function(promiseOrValue, /*Function?*/callback, /*Function?*/errback, /*Function?*/progressHandler){
	// summary:
	//		This provides normalization between normal synchronous values and 
	//		asynchronous promises, so you can interact with them in a common way
	//	example:
	//		|	function printFirstAndList(items){
	//		|		dojo.when(findFirst(items), console.log);
	//		|		dojo.when(findLast(items), console.log);
	//		|	}
	//		|	function findFirst(items){
	//		|		return dojo.when(items, function(items){
	//		|			return items[0];
	//		|		});
	//		|	}
	//		|	function findLast(items){
	//		|		return dojo.when(items, function(items){
	//		|			return items[items.length];
	//		|		});
	//		|	}
	//		And now all three of his functions can be used sync or async.
	//		|	printFirstAndLast([1,2,3,4]) will work just as well as
	//		|	printFirstAndLast(dojo.xhrGet(...));
	
	if(promiseOrValue && typeof promiseOrValue.then === "function"){
		return promiseOrValue.then(callback, errback, progressHandler);
	}
	return callback(promiseOrValue);
};

}

if(!dojo._hasResource["dojo._base.json"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.json"] = true;
dojo.provide("dojo._base.json");

dojo.fromJson = function(/*String*/ json){
	// summary:
	// 		Parses a [JSON](http://json.org) string to return a JavaScript object.
	// description:
	// 		Throws for invalid JSON strings, but it does not use a strict JSON parser. It
	// 		delegates to eval().  The content passed to this method must therefore come
	//		from a trusted source.
	// json: 
	//		a string literal of a JSON item, for instance:
	//			`'{ "foo": [ "bar", 1, { "baz": "thud" } ] }'`

	return eval("(" + json + ")"); // Object
}

dojo._escapeString = function(/*String*/str){
	//summary:
	//		Adds escape sequences for non-visual characters, double quote and
	//		backslash and surrounds with double quotes to form a valid string
	//		literal.
	return ('"' + str.replace(/(["\\])/g, '\\$1') + '"').
		replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").
		replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r"); // string
}

dojo.toJsonIndentStr = "\t";
dojo.toJson = function(/*Object*/ it, /*Boolean?*/ prettyPrint, /*String?*/ _indentStr){
	//	summary:
	//		Returns a [JSON](http://json.org) serialization of an object.
	//	description:
	//		Returns a [JSON](http://json.org) serialization of an object.
	//		Note that this doesn't check for infinite recursion, so don't do that!
	//	it:
	//		an object to be serialized. Objects may define their own
	//		serialization via a special "__json__" or "json" function
	//		property. If a specialized serializer has been defined, it will
	//		be used as a fallback.
	//	prettyPrint:
	//		if true, we indent objects and arrays to make the output prettier.
	//		The variable `dojo.toJsonIndentStr` is used as the indent string --
	//		to use something other than the default (tab), change that variable
	//		before calling dojo.toJson().
	//	_indentStr:
	//		private variable for recursive calls when pretty printing, do not use.
	//	example:
	//		simple serialization of a trivial object
	//		|	var jsonStr = dojo.toJson({ howdy: "stranger!", isStrange: true });
	//		|	doh.is('{"howdy":"stranger!","isStrange":true}', jsonStr);
	//	example:
	//		a custom serializer for an objects of a particular class:
	//		|	dojo.declare("Furby", null, {
	//		|		furbies: "are strange",
	//		|		furbyCount: 10,
	//		|		__json__: function(){
	//		|		},
	//		|	});

	if(it === undefined){
		return "undefined";
	}
	var objtype = typeof it;
	if(objtype == "number" || objtype == "boolean"){
		return it + "";
	}
	if(it === null){
		return "null";
	}
	if(dojo.isString(it)){ 
		return dojo._escapeString(it); 
	}
	// recurse
	var recurse = arguments.callee;
	// short-circuit for objects that support "json" serialization
	// if they return "self" then just pass-through...
	var newObj;
	_indentStr = _indentStr || "";
	var nextIndent = prettyPrint ? _indentStr + dojo.toJsonIndentStr : "";
	var tf = it.__json__||it.json;
	if(dojo.isFunction(tf)){
		newObj = tf.call(it);
		if(it !== newObj){
			return recurse(newObj, prettyPrint, nextIndent);
		}
	}
	if(it.nodeType && it.cloneNode){ // isNode
		// we can't seriailize DOM nodes as regular objects because they have cycles
		// DOM nodes could be serialized with something like outerHTML, but
		// that can be provided by users in the form of .json or .__json__ function.
		throw new Error("Can't serialize DOM nodes");
	}

	var sep = prettyPrint ? " " : "";
	var newLine = prettyPrint ? "\n" : "";

	// array
	if(dojo.isArray(it)){
		var res = dojo.map(it, function(obj){
			var val = recurse(obj, prettyPrint, nextIndent);
			if(typeof val != "string"){
				val = "undefined";
			}
			return newLine + nextIndent + val;
		});
		return "[" + res.join("," + sep) + newLine + _indentStr + "]";
	}
	/*
	// look in the registry
	try {
		window.o = it;
		newObj = dojo.json.jsonRegistry.match(it);
		return recurse(newObj, prettyPrint, nextIndent);
	}catch(e){
		// console.log(e);
	}
	// it's a function with no adapter, skip it
	*/
	if(objtype == "function"){
		return null; // null
	}
	// generic object code path
	var output = [], key;
	for(key in it){
		var keyStr, val;
		if(typeof key == "number"){
			keyStr = '"' + key + '"';
		}else if(typeof key == "string"){
			keyStr = dojo._escapeString(key);
		}else{
			// skip non-string or number keys
			continue;
		}
		val = recurse(it[key], prettyPrint, nextIndent);
		if(typeof val != "string"){
			// skip non-serializable values
			continue;
		}
		// FIXME: use += on Moz!!
		//	 MOW NOTE: using += is a pain because you have to account for the dangling comma...
		output.push(newLine + nextIndent + keyStr + ":" + sep + val);
	}
	return "{" + output.join("," + sep) + newLine + _indentStr + "}"; // String
}

}

if(!dojo._hasResource["dojo._base.Color"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.Color"] = true;
dojo.provide("dojo._base.Color");



(function(){

	var d = dojo;

	dojo.Color = function(/*Array|String|Object*/ color){
		// summary:
		//	 	Takes a named string, hex string, array of rgb or rgba values,
		//	 	an object with r, g, b, and a properties, or another `dojo.Color` object
		//	 	and creates a new Color instance to work from.
		//
		// example:
		//		Work with a Color instance:
		//	 | var c = new dojo.Color();
		//	 | c.setColor([0,0,0]); // black
		//	 | var hex = c.toHex(); // #000000
		//
		// example:
		//		Work with a node's color:
		//	 | var color = dojo.style("someNode", "backgroundColor");
		//	 | var n = new dojo.Color(color);
		//	 | // adjust the color some
		//	 | n.r *= .5;
		//	 | console.log(n.toString()); // rgb(128, 255, 255);
		if(color){ this.setColor(color); }
	};

	// FIXME:
	// 	there's got to be a more space-efficient way to encode or discover
	// 	these!!  Use hex?
	dojo.Color.named = {
		black:      [0,0,0],
		silver:     [192,192,192],
		gray:       [128,128,128],
		white:      [255,255,255],
		maroon:		[128,0,0],
		red:        [255,0,0],
		purple:		[128,0,128],
		fuchsia:	[255,0,255],
		green:	    [0,128,0],
		lime:	    [0,255,0],
		olive:		[128,128,0],
		yellow:		[255,255,0],
		navy:       [0,0,128],
		blue:       [0,0,255],
		teal:		[0,128,128],
		aqua:		[0,255,255],
		transparent: d.config.transparentColor || [255,255,255]
	};

	dojo.extend(dojo.Color, {
		r: 255, g: 255, b: 255, a: 1,
		_set: function(r, g, b, a){
			var t = this; t.r = r; t.g = g; t.b = b; t.a = a;
		},
		setColor: function(/*Array|String|Object*/ color){
			// summary:
			//		Takes a named string, hex string, array of rgb or rgba values,
			//		an object with r, g, b, and a properties, or another `dojo.Color` object
			//		and sets this color instance to that value.
			//
			// example:
			//	|	var c = new dojo.Color(); // no color
			//	|	c.setColor("#ededed"); // greyish
			if(d.isString(color)){
				d.colorFromString(color, this);
			}else if(d.isArray(color)){
				d.colorFromArray(color, this);
			}else{
				this._set(color.r, color.g, color.b, color.a);
				if(!(color instanceof d.Color)){ this.sanitize(); }
			}
			return this;	// dojo.Color
		},
		sanitize: function(){
			// summary:
			//		Ensures the object has correct attributes
			// description:
			//		the default implementation does nothing, include dojo.colors to
			//		augment it with real checks
			return this;	// dojo.Color
		},
		toRgb: function(){
			// summary:
			//		Returns 3 component array of rgb values
			// example:
			//	|	var c = new dojo.Color("#000000");
			//	| 	console.log(c.toRgb()); // [0,0,0]
			var t = this;
			return [t.r, t.g, t.b];	// Array
		},
		toRgba: function(){
			// summary:
			//		Returns a 4 component array of rgba values from the color
			//		represented by this object.
			var t = this;
			return [t.r, t.g, t.b, t.a];	// Array
		},
		toHex: function(){
			// summary:
			//		Returns a CSS color string in hexadecimal representation
			// example:
			//	| 	console.log(new dojo.Color([0,0,0]).toHex()); // #000000
			var arr = d.map(["r", "g", "b"], function(x){
				var s = this[x].toString(16);
				return s.length < 2 ? "0" + s : s;
			}, this);
			return "#" + arr.join("");	// String
		},
		toCss: function(/*Boolean?*/ includeAlpha){
			// summary:
			//		Returns a css color string in rgb(a) representation
			// example:
			//	|	var c = new dojo.Color("#FFF").toCss();
			//	|	console.log(c); // rgb('255','255','255')
			var t = this, rgb = t.r + ", " + t.g + ", " + t.b;
			return (includeAlpha ? "rgba(" + rgb + ", " + t.a : "rgb(" + rgb) + ")";	// String
		},
		toString: function(){
			// summary:
			//		Returns a visual representation of the color
			return this.toCss(true); // String
		}
	});

	dojo.blendColors = function(
		/*dojo.Color*/ start,
		/*dojo.Color*/ end,
		/*Number*/ weight,
		/*dojo.Color?*/ obj
	){
		// summary:
		//		Blend colors end and start with weight from 0 to 1, 0.5 being a 50/50 blend,
		//		can reuse a previously allocated dojo.Color object for the result
		var t = obj || new d.Color();
		d.forEach(["r", "g", "b", "a"], function(x){
			t[x] = start[x] + (end[x] - start[x]) * weight;
			if(x != "a"){ t[x] = Math.round(t[x]); }
		});
		return t.sanitize();	// dojo.Color
	};

	dojo.colorFromRgb = function(/*String*/ color, /*dojo.Color?*/ obj){
		// summary:
		//		Returns a `dojo.Color` instance from a string of the form
		//		"rgb(...)" or "rgba(...)". Optionally accepts a `dojo.Color`
		//		object to update with the parsed value and return instead of
		//		creating a new object.
		// returns:
		//		A dojo.Color object. If obj is passed, it will be the return value.
		var m = color.toLowerCase().match(/^rgba?\(([\s\.,0-9]+)\)/);
		return m && dojo.colorFromArray(m[1].split(/\s*,\s*/), obj);	// dojo.Color
	};

	dojo.colorFromHex = function(/*String*/ color, /*dojo.Color?*/ obj){
		// summary:
		//		Converts a hex string with a '#' prefix to a color object.
		//		Supports 12-bit #rgb shorthand. Optionally accepts a
		//		`dojo.Color` object to update with the parsed value.
		//
		// returns:
		//		A dojo.Color object. If obj is passed, it will be the return value.
		//
		// example:
		//	 | var thing = dojo.colorFromHex("#ededed"); // grey, longhand
		//
		// example:
		//	| var thing = dojo.colorFromHex("#000"); // black, shorthand
		var t = obj || new d.Color(),
			bits = (color.length == 4) ? 4 : 8,
			mask = (1 << bits) - 1;
		color = Number("0x" + color.substr(1));
		if(isNaN(color)){
			return null; // dojo.Color
		}
		d.forEach(["b", "g", "r"], function(x){
			var c = color & mask;
			color >>= bits;
			t[x] = bits == 4 ? 17 * c : c;
		});
		t.a = 1;
		return t;	// dojo.Color
	};

	dojo.colorFromArray = function(/*Array*/ a, /*dojo.Color?*/ obj){
		// summary:
		//		Builds a `dojo.Color` from a 3 or 4 element array, mapping each
		//		element in sequence to the rgb(a) values of the color.
		// example:
		//		| var myColor = dojo.colorFromArray([237,237,237,0.5]); // grey, 50% alpha 
		// returns:
		//		A dojo.Color object. If obj is passed, it will be the return value.
		var t = obj || new d.Color();
		t._set(Number(a[0]), Number(a[1]), Number(a[2]), Number(a[3]));
		if(isNaN(t.a)){ t.a = 1; }
		return t.sanitize();	// dojo.Color
	};

	dojo.colorFromString = function(/*String*/ str, /*dojo.Color?*/ obj){
		// summary:
		//		Parses `str` for a color value. Accepts hex, rgb, and rgba
		//		style color values.
		// description:
		//		Acceptable input values for str may include arrays of any form
		//		accepted by dojo.colorFromArray, hex strings such as "#aaaaaa", or
		//		rgb or rgba strings such as "rgb(133, 200, 16)" or "rgba(10, 10,
		//		10, 50)"
		// returns:
		//		A dojo.Color object. If obj is passed, it will be the return value.
		var a = d.Color.named[str];
		return a && d.colorFromArray(a, obj) || d.colorFromRgb(str, obj) || d.colorFromHex(str, obj);
	};
})();

}

if(!dojo._hasResource["dojo._base"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base"] = true;
dojo.provide("dojo._base");









}

if(!dojo._hasResource["dojo._base.window"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.window"] = true;
dojo.provide("dojo._base.window");

/*=====
dojo.doc = {
	// summary:
	//		Alias for the current document. 'dojo.doc' can be modified
	//		for temporary context shifting. Also see dojo.withDoc().
	// description:
	//    Refer to dojo.doc rather
	//    than referring to 'window.document' to ensure your code runs
	//    correctly in managed contexts.
	// example:
	// 	|	n.appendChild(dojo.doc.createElement('div'));
}
=====*/
dojo.doc = window["document"] || null;

dojo.body = function(){
	// summary:
	//		Return the body element of the document
	//		return the body object associated with dojo.doc
	// example:
	// 	|	dojo.body().appendChild(dojo.doc.createElement('div'));

	// Note: document.body is not defined for a strict xhtml document
	// Would like to memoize this, but dojo.doc can change vi dojo.withDoc().
	return dojo.doc.body || dojo.doc.getElementsByTagName("body")[0]; // Node
}

dojo.setContext = function(/*Object*/globalObject, /*DocumentElement*/globalDocument){
	// summary:
	//		changes the behavior of many core Dojo functions that deal with
	//		namespace and DOM lookup, changing them to work in a new global
	//		context (e.g., an iframe). The varibles dojo.global and dojo.doc
	//		are modified as a result of calling this function and the result of
	//		`dojo.body()` likewise differs.
	dojo.global = globalObject;
	dojo.doc = globalDocument;
};

dojo.withGlobal = function(	/*Object*/globalObject, 
							/*Function*/callback, 
							/*Object?*/thisObject, 
							/*Array?*/cbArguments){
	// summary:
	//		Invoke callback with globalObject as dojo.global and
	//		globalObject.document as dojo.doc.
	// description:
	//		Invoke callback with globalObject as dojo.global and
	//		globalObject.document as dojo.doc. If provided, globalObject
	//		will be executed in the context of object thisObject
	//		When callback() returns or throws an error, the dojo.global
	//		and dojo.doc will be restored to its previous state.

	var oldGlob = dojo.global;
	try{
		dojo.global = globalObject;
		return dojo.withDoc.call(null, globalObject.document, callback, thisObject, cbArguments);
	}finally{
		dojo.global = oldGlob;
	}
}

dojo.withDoc = function(	/*DocumentElement*/documentObject, 
							/*Function*/callback, 
							/*Object?*/thisObject, 
							/*Array?*/cbArguments){
	// summary:
	//		Invoke callback with documentObject as dojo.doc.
	// description:
	//		Invoke callback with documentObject as dojo.doc. If provided,
	//		callback will be executed in the context of object thisObject
	//		When callback() returns or throws an error, the dojo.doc will
	//		be restored to its previous state.

	var oldDoc = dojo.doc,
		oldLtr = dojo._bodyLtr,
		oldQ = dojo.isQuirks;

	try{
		dojo.doc = documentObject;
		delete dojo._bodyLtr; // uncache
		dojo.isQuirks = dojo.doc.compatMode == "BackCompat"; // no need to check for QuirksMode which was Opera 7 only

		if(thisObject && typeof callback == "string"){
			callback = thisObject[callback];
		}

		return callback.apply(thisObject, cbArguments || []);
	}finally{
		dojo.doc = oldDoc;
		delete dojo._bodyLtr; // in case it was undefined originally, and set to true/false by the alternate document
		if(oldLtr !== undefined){ dojo._bodyLtr = oldLtr; }
		dojo.isQuirks = oldQ;
	}
};
	

}

if(!dojo._hasResource["dojo._base.event"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.event"] = true;
dojo.provide("dojo._base.event");


// this file courtesy of the TurboAjax Group, licensed under a Dojo CLA

(function(){
	// DOM event listener machinery
	var del = (dojo._event_listener = {
		add: function(/*DOMNode*/ node, /*String*/ name, /*Function*/ fp){
			if(!node){return;} 
			name = del._normalizeEventName(name);
			fp = del._fixCallback(name, fp);
			var oname = name;
			if(
								!dojo.isIE && 
								(name == "mouseenter" || name == "mouseleave")
			){
				var ofp = fp;
				//oname = name;
				name = (name == "mouseenter") ? "mouseover" : "mouseout";
				fp = function(e){
					if(!dojo.isDescendant(e.relatedTarget, node)){
						// e.type = oname; // FIXME: doesn't take? SJM: event.type is generally immutable.
						return ofp.call(this, e); 
					}
				}
			}
			node.addEventListener(name, fp, false);
			return fp; /*Handle*/
		},
		remove: function(/*DOMNode*/ node, /*String*/ event, /*Handle*/ handle){
			// summary:
			//		clobbers the listener from the node
			// node:
			//		DOM node to attach the event to
			// event:
			//		the name of the handler to remove the function from
			// handle:
			//		the handle returned from add
			if(node){
				event = del._normalizeEventName(event);
				if(!dojo.isIE && (event == "mouseenter" || event == "mouseleave")){
					event = (event == "mouseenter") ? "mouseover" : "mouseout";
				}

				node.removeEventListener(event, handle, false);
			}
		},
		_normalizeEventName: function(/*String*/ name){
			// Generally, name should be lower case, unless it is special
			// somehow (e.g. a Mozilla DOM event).
			// Remove 'on'.
			return name.slice(0,2) =="on" ? name.slice(2) : name;
		},
		_fixCallback: function(/*String*/ name, fp){
			// By default, we only invoke _fixEvent for 'keypress'
			// If code is added to _fixEvent for other events, we have
			// to revisit this optimization.
			// This also applies to _fixEvent overrides for Safari and Opera
			// below.
			return name != "keypress" ? fp : function(e){ return fp.call(this, del._fixEvent(e, this)); };
		},
		_fixEvent: function(evt, sender){
			// _fixCallback only attaches us to keypress.
			// Switch on evt.type anyway because we might 
			// be called directly from dojo.fixEvent.
			switch(evt.type){
				case "keypress":
					del._setKeyChar(evt);
					break;
			}
			return evt;
		},
		_setKeyChar: function(evt){
			evt.keyChar = evt.charCode ? String.fromCharCode(evt.charCode) : '';
			evt.charOrCode = evt.keyChar || evt.keyCode;
		},
		// For IE and Safari: some ctrl-key combinations (mostly w/punctuation) do not emit a char code in IE
		// we map those virtual key codes to ascii here
		// not valid for all (non-US) keyboards, so maybe we shouldn't bother
		_punctMap: { 
			106:42, 
			111:47, 
			186:59, 
			187:43, 
			188:44, 
			189:45, 
			190:46, 
			191:47, 
			192:96, 
			219:91, 
			220:92, 
			221:93, 
			222:39 
		}
	});

	// DOM events
	
	dojo.fixEvent = function(/*Event*/ evt, /*DOMNode*/ sender){
		// summary:
		//		normalizes properties on the event object including event
		//		bubbling methods, keystroke normalization, and x/y positions
		// evt: Event
		//		native event object
		// sender: DOMNode
		//		node to treat as "currentTarget"
		return del._fixEvent(evt, sender);
	}

	dojo.stopEvent = function(/*Event*/ evt){
		// summary:
		//		prevents propagation and clobbers the default action of the
		//		passed event
		// evt: Event
		//		The event object. If omitted, window.event is used on IE.
		evt.preventDefault();
		evt.stopPropagation();
		// NOTE: below, this method is overridden for IE
	}

	// the default listener to use on dontFix nodes, overriden for IE
	var node_listener = dojo._listener;
	
	// Unify connect and event listeners
	dojo._connect = function(obj, event, context, method, dontFix){
		// FIXME: need a more strict test
		var isNode = obj && (obj.nodeType||obj.attachEvent||obj.addEventListener);
		// choose one of three listener options: raw (connect.js), DOM event on a Node, custom event on a Node
		// we need the third option to provide leak prevention on broken browsers (IE)
		var lid = isNode ? (dontFix ? 2 : 1) : 0, l = [dojo._listener, del, node_listener][lid];
		// create a listener
		var h = l.add(obj, event, dojo.hitch(context, method));
		// formerly, the disconnect package contained "l" directly, but if client code
		// leaks the disconnect package (by connecting it to a node), referencing "l" 
		// compounds the problem.
		// instead we return a listener id, which requires custom _disconnect below.
		// return disconnect package
		return [ obj, event, h, lid ];
	}

	dojo._disconnect = function(obj, event, handle, listener){
		([dojo._listener, del, node_listener][listener]).remove(obj, event, handle);
	}

	// Constants

	// Public: client code should test
	// keyCode against these named constants, as the
	// actual codes can vary by browser.
	dojo.keys = {
		// summary:
		//		Definitions for common key values
		BACKSPACE: 8,
		TAB: 9,
		CLEAR: 12,
		ENTER: 13,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		META: dojo.isSafari ? 91 : 224,		// the apple key on macs
		PAUSE: 19,
		CAPS_LOCK: 20,
		ESCAPE: 27,
		SPACE: 32,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		LEFT_ARROW: 37,
		UP_ARROW: 38,
		RIGHT_ARROW: 39,
		DOWN_ARROW: 40,
		INSERT: 45,
		DELETE: 46,
		HELP: 47,
		LEFT_WINDOW: 91,
		RIGHT_WINDOW: 92,
		SELECT: 93,
		NUMPAD_0: 96,
		NUMPAD_1: 97,
		NUMPAD_2: 98,
		NUMPAD_3: 99,
		NUMPAD_4: 100,
		NUMPAD_5: 101,
		NUMPAD_6: 102,
		NUMPAD_7: 103,
		NUMPAD_8: 104,
		NUMPAD_9: 105,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_PLUS: 107,
		NUMPAD_ENTER: 108,
		NUMPAD_MINUS: 109,
		NUMPAD_PERIOD: 110,
		NUMPAD_DIVIDE: 111,
		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,
		F13: 124,
		F14: 125,
		F15: 126,
		NUM_LOCK: 144,
		SCROLL_LOCK: 145,
		// virtual key mapping
		copyKey: dojo.isMac && !dojo.isAIR ? (dojo.isSafari ? 91 : 224 ) : 17
	};
	
	var evtCopyKey = dojo.isMac ? "metaKey" : "ctrlKey";
	
	dojo.isCopyKey = function(e){
		// summary:
		//		Checks an event for the copy key (meta on Mac, and ctrl anywhere else)
		// e: Event
		//		Event object to examine
		return e[evtCopyKey];	// Boolean
	};

	// Public: decoding mouse buttons from events

/*=====
	dojo.mouseButtons = {
		// LEFT: Number
		//		Numeric value of the left mouse button for the platform.
		LEFT:   0,
		// MIDDLE: Number
		//		Numeric value of the middle mouse button for the platform.
		MIDDLE: 1,
		// RIGHT: Number
		//		Numeric value of the right mouse button for the platform.
		RIGHT:  2,
	
		isButton: function(e, button){
			// summary:
			//		Checks an event object for a pressed button
			// e: Event
			//		Event object to examine
			// button: Number
			//		The button value (example: dojo.mouseButton.LEFT)
			return e.button == button; // Boolean
		},
		isLeft: function(e){
			// summary:
			//		Checks an event object for the pressed left button
			// e: Event
			//		Event object to examine
			return e.button == 0; // Boolean
		},
		isMiddle: function(e){
			// summary:
			//		Checks an event object for the pressed middle button
			// e: Event
			//		Event object to examine
			return e.button == 1; // Boolean
		},
		isRight: function(e){
			// summary:
			//		Checks an event object for the pressed right button
			// e: Event
			//		Event object to examine
			return e.button == 2; // Boolean
		}
	};
=====*/

		if(dojo.isIE){
		dojo.mouseButtons = {
			LEFT:   1,
			MIDDLE: 4,
			RIGHT:  2,
			// helper functions
			isButton: function(e, button){ return e.button & button; },
			isLeft:   function(e){ return e.button & 1; },
			isMiddle: function(e){ return e.button & 4; },
			isRight:  function(e){ return e.button & 2; }
		};
	}else{
			dojo.mouseButtons = {
			LEFT:   0,
			MIDDLE: 1,
			RIGHT:  2,
			// helper functions
			isButton: function(e, button){ return e.button == button; },
			isLeft:   function(e){ return e.button == 0; },
			isMiddle: function(e){ return e.button == 1; },
			isRight:  function(e){ return e.button == 2; }
		};
		}
	
		// IE event normalization
	if(dojo.isIE){ 
		var _trySetKeyCode = function(e, code){
			try{
				// squelch errors when keyCode is read-only
				// (e.g. if keyCode is ctrl or shift)
				return (e.keyCode = code);
			}catch(e){
				return 0;
			}
		}

		// by default, use the standard listener
		var iel = dojo._listener;
		var listenersName = (dojo._ieListenersName = "_" + dojo._scopeName + "_listeners");
		// dispatcher tracking property
		if(!dojo.config._allow_leaks){
			// custom listener that handles leak protection for DOM events
			node_listener = iel = dojo._ie_listener = {
				// support handler indirection: event handler functions are 
				// referenced here. Event dispatchers hold only indices.
				handlers: [],
				// add a listener to an object
				add: function(/*Object*/ source, /*String*/ method, /*Function*/ listener){
					source = source || dojo.global;
					var f = source[method];
					if(!f||!f[listenersName]){
						var d = dojo._getIeDispatcher();
						// original target function is special
						d.target = f && (ieh.push(f) - 1);
						// dispatcher holds a list of indices into handlers table
						d[listenersName] = [];
						// redirect source to dispatcher
						f = source[method] = d;
					}
					return f[listenersName].push(ieh.push(listener) - 1) ; /*Handle*/
				},
				// remove a listener from an object
				remove: function(/*Object*/ source, /*String*/ method, /*Handle*/ handle){
					var f = (source||dojo.global)[method], l = f && f[listenersName];
					if(f && l && handle--){
						delete ieh[l[handle]];
						delete l[handle];
					}
				}
			};
			// alias used above
			var ieh = iel.handlers;
		}

		dojo.mixin(del, {
			add: function(/*DOMNode*/ node, /*String*/ event, /*Function*/ fp){
				if(!node){return;} // undefined
				event = del._normalizeEventName(event);
				if(event=="onkeypress"){
					// we need to listen to onkeydown to synthesize
					// keypress events that otherwise won't fire
					// on IE
					var kd = node.onkeydown;
					if(!kd || !kd[listenersName] || !kd._stealthKeydownHandle){
						var h = del.add(node, "onkeydown", del._stealthKeyDown);
						kd = node.onkeydown;
						kd._stealthKeydownHandle = h;
						kd._stealthKeydownRefs = 1;
					}else{
						kd._stealthKeydownRefs++;
					}
				}
				return iel.add(node, event, del._fixCallback(fp));
			},
			remove: function(/*DOMNode*/ node, /*String*/ event, /*Handle*/ handle){
				event = del._normalizeEventName(event);
				iel.remove(node, event, handle); 
				if(event=="onkeypress"){
					var kd = node.onkeydown;
					if(--kd._stealthKeydownRefs <= 0){
						iel.remove(node, "onkeydown", kd._stealthKeydownHandle);
						delete kd._stealthKeydownHandle;
					}
				}
			},
			_normalizeEventName: function(/*String*/ eventName){
				// Generally, eventName should be lower case, unless it is
				// special somehow (e.g. a Mozilla event)
				// ensure 'on'
				return eventName.slice(0,2) != "on" ? "on" + eventName : eventName;
			},
			_nop: function(){},
			_fixEvent: function(/*Event*/ evt, /*DOMNode*/ sender){
				// summary:
				//		normalizes properties on the event object including event
				//		bubbling methods, keystroke normalization, and x/y positions
				// evt:
				//		native event object
				// sender:
				//		node to treat as "currentTarget"
				if(!evt){
					var w = sender && (sender.ownerDocument || sender.document || sender).parentWindow || window;
					evt = w.event; 
				}
				if(!evt){return(evt);}
				evt.target = evt.srcElement; 
				evt.currentTarget = (sender || evt.srcElement); 
				evt.layerX = evt.offsetX;
				evt.layerY = evt.offsetY;
				// FIXME: scroll position query is duped from dojo.html to
				// avoid dependency on that entire module. Now that HTML is in
				// Base, we should convert back to something similar there.
				var se = evt.srcElement, doc = (se && se.ownerDocument) || document;
				// DO NOT replace the following to use dojo.body(), in IE, document.documentElement should be used
				// here rather than document.body
				var docBody = ((dojo.isIE < 6) || (doc["compatMode"] == "BackCompat")) ? doc.body : doc.documentElement;
				var offset = dojo._getIeDocumentElementOffset();
				evt.pageX = evt.clientX + dojo._fixIeBiDiScrollLeft(docBody.scrollLeft || 0) - offset.x;
				evt.pageY = evt.clientY + (docBody.scrollTop || 0) - offset.y;
				if(evt.type == "mouseover"){ 
					evt.relatedTarget = evt.fromElement;
				}
				if(evt.type == "mouseout"){ 
					evt.relatedTarget = evt.toElement;
				}
				evt.stopPropagation = del._stopPropagation;
				evt.preventDefault = del._preventDefault;
				return del._fixKeys(evt);
			},
			_fixKeys: function(evt){
				switch(evt.type){
					case "keypress":
						var c = ("charCode" in evt ? evt.charCode : evt.keyCode);
						if (c==10){
							// CTRL-ENTER is CTRL-ASCII(10) on IE, but CTRL-ENTER on Mozilla
							c=0;
							evt.keyCode = 13;
						}else if(c==13||c==27){
							c=0; // Mozilla considers ENTER and ESC non-printable
						}else if(c==3){
							c=99; // Mozilla maps CTRL-BREAK to CTRL-c
						}
						// Mozilla sets keyCode to 0 when there is a charCode
						// but that stops the event on IE.
						evt.charCode = c;
						del._setKeyChar(evt);
						break;
				}
				return evt;
			},
			_stealthKeyDown: function(evt){
				// IE doesn't fire keypress for most non-printable characters.
				// other browsers do, we simulate it here.
				var kp = evt.currentTarget.onkeypress;
				// only works if kp exists and is a dispatcher
				if(!kp || !kp[listenersName]){ return; }
				// munge key/charCode
				var k=evt.keyCode;
				// These are Windows Virtual Key Codes
				// http://msdn.microsoft.com/library/default.asp?url=/library/en-us/winui/WinUI/WindowsUserInterface/UserInput/VirtualKeyCodes.asp
				var unprintable = k!=13 && k!=32 && k!=27 && (k<48||k>90) && (k<96||k>111) && (k<186||k>192) && (k<219||k>222);
				// synthesize keypress for most unprintables and CTRL-keys
				if(unprintable||evt.ctrlKey){
					var c = unprintable ? 0 : k;
					if(evt.ctrlKey){
						if(k==3 || k==13){
							return; // IE will post CTRL-BREAK, CTRL-ENTER as keypress natively 
						}else if(c>95 && c<106){ 
							c -= 48; // map CTRL-[numpad 0-9] to ASCII
						}else if((!evt.shiftKey)&&(c>=65&&c<=90)){ 
							c += 32; // map CTRL-[A-Z] to lowercase
						}else{ 
							c = del._punctMap[c] || c; // map other problematic CTRL combinations to ASCII
						}
					}
					// simulate a keypress event
					var faux = del._synthesizeEvent(evt, {type: 'keypress', faux: true, charCode: c});
					kp.call(evt.currentTarget, faux);
					evt.cancelBubble = faux.cancelBubble;
					evt.returnValue = faux.returnValue;
					_trySetKeyCode(evt, faux.keyCode);
				}
			},
			// Called in Event scope
			_stopPropagation: function(){
				this.cancelBubble = true; 
			},
			_preventDefault: function(){
				// Setting keyCode to 0 is the only way to prevent certain keypresses (namely
				// ctrl-combinations that correspond to menu accelerator keys).
				// Otoh, it prevents upstream listeners from getting this information
				// Try to split the difference here by clobbering keyCode only for ctrl 
				// combinations. If you still need to access the key upstream, bubbledKeyCode is
				// provided as a workaround.
				this.bubbledKeyCode = this.keyCode;
				if(this.ctrlKey){_trySetKeyCode(this, 0);}
				this.returnValue = false;
			}
		});
				
		// override stopEvent for IE
		dojo.stopEvent = function(evt){
			evt = evt || window.event;
			del._stopPropagation.call(evt);
			del._preventDefault.call(evt);
		}
	}
	
	del._synthesizeEvent = function(evt, props){
			var faux = dojo.mixin({}, evt, props);
			del._setKeyChar(faux);
			// FIXME: would prefer to use dojo.hitch: dojo.hitch(evt, evt.preventDefault); 
			// but it throws an error when preventDefault is invoked on Safari
			// does Event.preventDefault not support "apply" on Safari?
			faux.preventDefault = function(){ evt.preventDefault(); }; 
			faux.stopPropagation = function(){ evt.stopPropagation(); }; 
			return faux;
	}
	
		// Opera event normalization
	if(dojo.isOpera){
		dojo.mixin(del, {
			_fixEvent: function(evt, sender){
				switch(evt.type){
					case "keypress":
						var c = evt.which;
						if(c==3){
							c=99; // Mozilla maps CTRL-BREAK to CTRL-c
						}
						// can't trap some keys at all, like INSERT and DELETE
						// there is no differentiating info between DELETE and ".", or INSERT and "-"
						c = c<41 && !evt.shiftKey ? 0 : c;
						if(evt.ctrlKey && !evt.shiftKey && c>=65 && c<=90){
							// lowercase CTRL-[A-Z] keys
							c += 32;
						}
						return del._synthesizeEvent(evt, { charCode: c });
				}
				return evt;
			}
		});
	}
	
		// Webkit event normalization
	if(dojo.isWebKit){
				del._add = del.add;
		del._remove = del.remove;

		dojo.mixin(del, {
			add: function(/*DOMNode*/ node, /*String*/ event, /*Function*/ fp){
				if(!node){return;} // undefined
				var handle = del._add(node, event, fp);
				if(del._normalizeEventName(event) == "keypress"){
					// we need to listen to onkeydown to synthesize
					// keypress events that otherwise won't fire
					// in Safari 3.1+: https://lists.webkit.org/pipermail/webkit-dev/2007-December/002992.html
					handle._stealthKeyDownHandle = del._add(node, "keydown", function(evt){
						//A variation on the IE _stealthKeydown function
						//Synthesize an onkeypress event, but only for unprintable characters.
						var k=evt.keyCode;
						// These are Windows Virtual Key Codes
						// http://msdn.microsoft.com/library/default.asp?url=/library/en-us/winui/WinUI/WindowsUserInterface/UserInput/VirtualKeyCodes.asp
						var unprintable = k!=13 && k!=32 && (k<48 || k>90) && (k<96 || k>111) && (k<186 || k>192) && (k<219 || k>222);
						// synthesize keypress for most unprintables and CTRL-keys
						if(unprintable || evt.ctrlKey){
							var c = unprintable ? 0 : k;
							if(evt.ctrlKey){
								if(k==3 || k==13){
									return; // IE will post CTRL-BREAK, CTRL-ENTER as keypress natively 
								}else if(c>95 && c<106){ 
									c -= 48; // map CTRL-[numpad 0-9] to ASCII
								}else if(!evt.shiftKey && c>=65 && c<=90){ 
									c += 32; // map CTRL-[A-Z] to lowercase
								}else{ 
									c = del._punctMap[c] || c; // map other problematic CTRL combinations to ASCII
								}
							}
							// simulate a keypress event
							var faux = del._synthesizeEvent(evt, {type: 'keypress', faux: true, charCode: c});
							fp.call(evt.currentTarget, faux);
						}
					});
				}
				return handle; /*Handle*/
			},

			remove: function(/*DOMNode*/ node, /*String*/ event, /*Handle*/ handle){
				if(node){
					if(handle._stealthKeyDownHandle){
						del._remove(node, "keydown", handle._stealthKeyDownHandle);
					}
					del._remove(node, event, handle);
				}
			},
			_fixEvent: function(evt, sender){
				switch(evt.type){
					case "keypress":
						if(evt.faux){ return evt; }
						var c = evt.charCode;
						c = c>=32 ? c : 0;
						return del._synthesizeEvent(evt, {charCode: c, faux: true});
				}
				return evt;
			}
		});
		}
	})();

if(dojo.isIE){
	// keep this out of the closure
	// closing over 'iel' or 'ieh' b0rks leak prevention
	// ls[i] is an index into the master handler array
	dojo._ieDispatcher = function(args, sender){
		var ap = Array.prototype,
			h = dojo._ie_listener.handlers,
			c = args.callee,
			ls = c[dojo._ieListenersName],
			t = h[c.target];
		// return value comes from original target function
		var r = t && t.apply(sender, args);
		// make local copy of listener array so it's immutable during processing
		var lls = [].concat(ls);
		// invoke listeners after target function
		for(var i in lls){
			var f = h[lls[i]];
			if(!(i in ap) && f){
				f.apply(sender, args);
			}
		}
		return r;
	}
	dojo._getIeDispatcher = function(){
		// ensure the returned function closes over nothing ("new Function" apparently doesn't close)
		return new Function(dojo._scopeName + "._ieDispatcher(arguments, this)"); // function
	}
	// keep this out of the closure to reduce RAM allocation
	dojo._event_listener._fixCallback = function(fp){
		var f = dojo._event_listener._fixEvent;
		return function(e){ return fp.call(this, f(e, this)); };
	}
}

}

if(!dojo._hasResource["dojo._base.html"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.html"] = true;

dojo.provide("dojo._base.html");

// FIXME: need to add unit tests for all the semi-public methods

try{
	document.execCommand("BackgroundImageCache", false, true);
}catch(e){
	// sane browsers don't have cache "issues"
}

// =============================
// DOM Functions
// =============================

/*=====
dojo.byId = function(id, doc){
	//	summary:
	//		Returns DOM node with matching `id` attribute or `null`
	//		if not found. If `id` is a DomNode, this function is a no-op.
	//
	//	id: String|DOMNode
	//	 	A string to match an HTML id attribute or a reference to a DOM Node
	//
	//	doc: Document?
	//		Document to work in. Defaults to the current value of
	//		dojo.doc.  Can be used to retrieve
	//		node references from other documents.
	//
	//	example:
	//	Look up a node by ID:
	//	|	var n = dojo.byId("foo");
	//
	//	example:
	//	Check if a node exists, and use it.
	//	|	var n = dojo.byId("bar");
	//	|	if(n){ doStuff() ... }
	//
	//	example:
	//	Allow string or DomNode references to be passed to a custom function:
	//	|	var foo = function(nodeOrId){
	//	|		nodeOrId = dojo.byId(nodeOrId);
	//	|		// ... more stuff
	//	|	}
=====*/

if(dojo.isIE || dojo.isOpera){
	dojo.byId = function(id, doc){
		if(typeof id != "string"){
			return id;
		}
		var _d = doc || dojo.doc, te = _d.getElementById(id);
		// attributes.id.value is better than just id in case the 
		// user has a name=id inside a form
		if(te && (te.attributes.id.value == id || te.id == id)){
			return te;
		}else{
			var eles = _d.all[id];
			if(!eles || eles.nodeName){
				eles = [eles];
			}
			// if more than 1, choose first with the correct id
			var i=0;
			while((te=eles[i++])){
				if((te.attributes && te.attributes.id && te.attributes.id.value == id)
					|| te.id == id){
					return te;
				}
			}
		}
	};
}else{
	dojo.byId = function(id, doc){
		// inline'd type check
		return (typeof id == "string") ? (doc || dojo.doc).getElementById(id) : id; // DomNode
	};
}
/*=====
};
=====*/

(function(){
	var d = dojo;
	var byId = d.byId;

	var _destroyContainer = null,
		_destroyDoc;
		d.addOnWindowUnload(function(){
		_destroyContainer = null; //prevent IE leak
	});
	
/*=====
	dojo._destroyElement = function(node){
		// summary:
		// 		Existing alias for `dojo.destroy`. Deprecated, will be removed
		// 		in 2.0
	}
=====*/
	dojo._destroyElement = dojo.destroy = function(/*String|DomNode*/node){
		//	summary:
		//		Removes a node from its parent, clobbering it and all of its
		//		children.
		//
		//	description:
		//		Removes a node from its parent, clobbering it and all of its
		//		children. Function only works with DomNodes, and returns nothing.
		//
		//	node:
		//		A String ID or DomNode reference of the element to be destroyed
		//
		//	example:
		//	Destroy a node byId:
		//	|	dojo.destroy("someId");
		//
		//	example:
		//	Destroy all nodes in a list by reference:
		//	|	dojo.query(".someNode").forEach(dojo.destroy);

		node = byId(node);
		try{
			var doc = node.ownerDocument;
			// cannot use _destroyContainer.ownerDocument since this can throw an exception on IE
			if(!_destroyContainer || _destroyDoc != doc){
				_destroyContainer = doc.createElement("div");
				_destroyDoc = doc;
			}
			_destroyContainer.appendChild(node.parentNode ? node.parentNode.removeChild(node) : node);
			// NOTE: see http://trac.dojotoolkit.org/ticket/2931. This may be a bug and not a feature
			_destroyContainer.innerHTML = "";
		}catch(e){
			/* squelch */
		}
	};

	dojo.isDescendant = function(/*DomNode|String*/node, /*DomNode|String*/ancestor){
		//	summary:
		//		Returns true if node is a descendant of ancestor
		//	node: string id or node reference to test
		//	ancestor: string id or node reference of potential parent to test against
		//
		// example:
		//	Test is node id="bar" is a descendant of node id="foo"
		//	|	if(dojo.isDescendant("bar", "foo")){ ... }
		try{
			node = byId(node);
			ancestor = byId(ancestor);
			while(node){
				if(node == ancestor){
					return true; // Boolean
				}
				node = node.parentNode;
			}
		}catch(e){ /* squelch, return false */ }
		return false; // Boolean
	};

	dojo.setSelectable = function(/*DomNode|String*/node, /*Boolean*/selectable){
		//	summary: 
		//		Enable or disable selection on a node
		//	node:
		//		id or reference to node
		//	selectable:
		//		state to put the node in. false indicates unselectable, true 
		//		allows selection.
		//	example:
		//	Make the node id="bar" unselectable
		//	|	dojo.setSelectable("bar"); 
		//	example:
		//	Make the node id="bar" selectable
		//	|	dojo.setSelectable("bar", true);
		node = byId(node);
				if(d.isMozilla){
			node.style.MozUserSelect = selectable ? "" : "none";
		}else if(d.isKhtml || d.isWebKit){
					node.style.KhtmlUserSelect = selectable ? "auto" : "none";
				}else if(d.isIE){
			var v = (node.unselectable = selectable ? "" : "on");
			d.query("*", node).forEach("item.unselectable = '"+v+"'");
		}
				//FIXME: else?  Opera?
	};

	var _insertBefore = function(/*DomNode*/node, /*DomNode*/ref){
		var parent = ref.parentNode;
		if(parent){
			parent.insertBefore(node, ref);
		}
	};

	var _insertAfter = function(/*DomNode*/node, /*DomNode*/ref){
		//	summary:
		//		Try to insert node after ref
		var parent = ref.parentNode;
		if(parent){
			if(parent.lastChild == ref){
				parent.appendChild(node);
			}else{
				parent.insertBefore(node, ref.nextSibling);
			}
		}
	};

	dojo.place = function(node, refNode, position){
		//	summary:
		//		Attempt to insert node into the DOM, choosing from various positioning options.
		//		Returns the first argument resolved to a DOM node.
		//
		//	node: String|DomNode
		//		id or node reference, or HTML fragment starting with "<" to place relative to refNode
		//
		//	refNode: String|DomNode
		//		id or node reference to use as basis for placement
		//
		//	position: String|Number?
		//		string noting the position of node relative to refNode or a
		//		number indicating the location in the childNodes collection of refNode.
		//		Accepted string values are:
		//	|	* before
		//	|	* after
		//	|	* replace
		//	|	* only
		//	|	* first
		//	|	* last
		//		"first" and "last" indicate positions as children of refNode, "replace" replaces refNode,
		//		"only" replaces all children.  position defaults to "last" if not specified
		//
		//	returns: DomNode
		//		Returned values is the first argument resolved to a DOM node.
		//
		//		.place() is also a method of `dojo.NodeList`, allowing `dojo.query` node lookups.
		//
		// example:
		//		Place a node by string id as the last child of another node by string id:
		//	|	dojo.place("someNode", "anotherNode");
		//
		// example:
		//		Place a node by string id before another node by string id
		//	|	dojo.place("someNode", "anotherNode", "before");
		//
		// example:
		//		Create a Node, and place it in the body element (last child):
		//	|	dojo.place("<div></div>", dojo.body());
		//
		// example:
		//		Put a new LI as the first child of a list by id:
		//	|	dojo.place("<li></li>", "someUl", "first");

		refNode = byId(refNode);
		if(typeof node == "string"){ // inline'd type check
			node = node.charAt(0) == "<" ? d._toDom(node, refNode.ownerDocument) : byId(node);
		}
		if(typeof position == "number"){ // inline'd type check
			var cn = refNode.childNodes;
			if(!cn.length || cn.length <= position){
				refNode.appendChild(node);
			}else{
				_insertBefore(node, cn[position < 0 ? 0 : position]);
			}
		}else{
			switch(position){
				case "before":
					_insertBefore(node, refNode);
					break;
				case "after":
					_insertAfter(node, refNode);
					break;
				case "replace":
					refNode.parentNode.replaceChild(node, refNode);
					break;
				case "only":
					d.empty(refNode);
					refNode.appendChild(node);
					break;
				case "first":
					if(refNode.firstChild){
						_insertBefore(node, refNode.firstChild);
						break;
					}
					// else fallthrough...
				default: // aka: last
					refNode.appendChild(node);
			}
		}
		return node; // DomNode
	}

	// Box functions will assume this model.
	// On IE/Opera, BORDER_BOX will be set if the primary document is in quirks mode.
	// Can be set to change behavior of box setters.

	// can be either:
	//	"border-box"
	//	"content-box" (default)
	dojo.boxModel = "content-box";

	// We punt per-node box mode testing completely.
	// If anybody cares, we can provide an additional (optional) unit 
	// that overrides existing code to include per-node box sensitivity.

	// Opera documentation claims that Opera 9 uses border-box in BackCompat mode.
	// but experiments (Opera 9.10.8679 on Windows Vista) indicate that it actually continues to use content-box.
	// IIRC, earlier versions of Opera did in fact use border-box.
	// Opera guys, this is really confusing. Opera being broken in quirks mode is not our fault.

		if(d.isIE /*|| dojo.isOpera*/){
		// client code may have to adjust if compatMode varies across iframes
		d.boxModel = document.compatMode == "BackCompat" ? "border-box" : "content-box";
	}
	
	// =============================
	// Style Functions
	// =============================

	// getComputedStyle drives most of the style code.
	// Wherever possible, reuse the returned object.
	//
	// API functions below that need to access computed styles accept an 
	// optional computedStyle parameter.
	// If this parameter is omitted, the functions will call getComputedStyle themselves.
	// This way, calling code can access computedStyle once, and then pass the reference to 
	// multiple API functions.

/*=====
	dojo.getComputedStyle = function(node){
		//	summary:
		//		Returns a "computed style" object.
		//
		//	description:
		//		Gets a "computed style" object which can be used to gather
		//		information about the current state of the rendered node.
		//
		//		Note that this may behave differently on different browsers.
		//		Values may have different formats and value encodings across
		//		browsers.
		//
		//		Note also that this method is expensive.  Wherever possible,
		//		reuse the returned object.
		//
		//		Use the dojo.style() method for more consistent (pixelized)
		//		return values.
		//
		//	node: DOMNode
		//		A reference to a DOM node. Does NOT support taking an
		//		ID string for speed reasons.
		//	example:
		//	|	dojo.getComputedStyle(dojo.byId('foo')).borderWidth;
		//
		//	example:
		//	Reusing the returned object, avoiding multiple lookups:
		//	|	var cs = dojo.getComputedStyle(dojo.byId("someNode"));
		//	|	var w = cs.width, h = cs.height;
		return; // CSS2Properties
	}
=====*/

	// Although we normally eschew argument validation at this
	// level, here we test argument 'node' for (duck)type,
	// by testing nodeType, ecause 'document' is the 'parentNode' of 'body'
	// it is frequently sent to this function even 
	// though it is not Element.
	var gcs;
		if(d.isWebKit){
			gcs = function(/*DomNode*/node){
			var s;
			if(node.nodeType == 1){
				var dv = node.ownerDocument.defaultView;
				s = dv.getComputedStyle(node, null);
				if(!s && node.style){
					node.style.display = "";
					s = dv.getComputedStyle(node, null);
				}
			}
			return s || {};
		};
		}else if(d.isIE){
		gcs = function(node){
			// IE (as of 7) doesn't expose Element like sane browsers
			return node.nodeType == 1 /* ELEMENT_NODE*/ ? node.currentStyle : {};
		};
	}else{
		gcs = function(node){
			return node.nodeType == 1 ?
				node.ownerDocument.defaultView.getComputedStyle(node, null) : {};
		};
	}
		dojo.getComputedStyle = gcs;

		if(!d.isIE){
			d._toPixelValue = function(element, value){
			// style values can be floats, client code may want
			// to round for integer pixels.
			return parseFloat(value) || 0;
		};
		}else{
		d._toPixelValue = function(element, avalue){
			if(!avalue){ return 0; }
			// on IE7, medium is usually 4 pixels
			if(avalue == "medium"){ return 4; }
			// style values can be floats, client code may
			// want to round this value for integer pixels.
			if(avalue.slice && avalue.slice(-2) == 'px'){ return parseFloat(avalue); }
			with(element){
				var sLeft = style.left;
				var rsLeft = runtimeStyle.left;
				runtimeStyle.left = currentStyle.left;
				try{
					// 'avalue' may be incompatible with style.left, which can cause IE to throw
					// this has been observed for border widths using "thin", "medium", "thick" constants
					// those particular constants could be trapped by a lookup
					// but perhaps there are more
					style.left = avalue;
					avalue = style.pixelLeft;
				}catch(e){
					avalue = 0;
				}
				style.left = sLeft;
				runtimeStyle.left = rsLeft;
			}
			return avalue;
		}
	}
		var px = d._toPixelValue;

	// FIXME: there opacity quirks on FF that we haven't ported over. Hrm.
	/*=====
	dojo._getOpacity = function(node){
			//	summary:
			//		Returns the current opacity of the passed node as a
			//		floating-point value between 0 and 1.
			//	node: DomNode
			//		a reference to a DOM node. Does NOT support taking an
			//		ID string for speed reasons.
			//	returns: Number between 0 and 1
			return; // Number
	}
	=====*/

		var astr = "DXImageTransform.Microsoft.Alpha";
	var af = function(n, f){
		try{
			return n.filters.item(astr);
		}catch(e){
			return f ? {} : null;
		}
	};

		dojo._getOpacity =
			d.isIE ? function(node){
			try{
				return af(node).Opacity / 100; // Number
			}catch(e){
				return 1; // Number
			}
		} :
			function(node){
			return gcs(node).opacity;
		};

	/*=====
	dojo._setOpacity = function(node, opacity){
			//	summary:
			//		set the opacity of the passed node portably. Returns the
			//		new opacity of the node.
			//	node: DOMNode
			//		a reference to a DOM node. Does NOT support taking an
			//		ID string for performance reasons.
			//	opacity: Number
			//		A Number between 0 and 1. 0 specifies transparent.
			//	returns: Number between 0 and 1
			return; // Number
	}
	=====*/

	dojo._setOpacity =
				d.isIE ? function(/*DomNode*/node, /*Number*/opacity){
			var ov = opacity * 100, opaque = opacity == 1;
			node.style.zoom = opaque ? "" : 1;

			if(!af(node)){
				if(opaque){
					return opacity;
				}
				node.style.filter += " progid:" + astr + "(Opacity=" + ov + ")";
			}else{
				af(node, 1).Opacity = ov;
			}

			// on IE7 Alpha(Filter opacity=100) makes text look fuzzy so disable it altogether (bug #2661),
			//but still update the opacity value so we can get a correct reading if it is read later.
			af(node, 1).Enabled = !opaque;

			if(node.nodeName.toLowerCase() == "tr"){
				d.query("> td", node).forEach(function(i){
					d._setOpacity(i, opacity);
				});
			}
			return opacity;
		} :
				function(node, opacity){
			return node.style.opacity = opacity;
		};

	var _pixelNamesCache = {
		left: true, top: true
	};
	var _pixelRegExp = /margin|padding|width|height|max|min|offset/;  // |border
	var _toStyleValue = function(node, type, value){
		type = type.toLowerCase(); // FIXME: should we really be doing string case conversion here? Should we cache it? Need to profile!
				if(d.isIE){
			if(value == "auto"){
				if(type == "height"){ return node.offsetHeight; }
				if(type == "width"){ return node.offsetWidth; }
			}
			if(type == "fontweight"){
				switch(value){
					case 700: return "bold";
					case 400:
					default: return "normal";
				}
			}
		}
				if(!(type in _pixelNamesCache)){
			_pixelNamesCache[type] = _pixelRegExp.test(type);
		}
		return _pixelNamesCache[type] ? px(node, value) : value;
	};

	var _floatStyle = d.isIE ? "styleFloat" : "cssFloat",
		_floatAliases = { "cssFloat": _floatStyle, "styleFloat": _floatStyle, "float": _floatStyle }
	;

	// public API

	dojo.style = function(	/*DomNode|String*/ node,
							/*String?|Object?*/ style,
							/*String?*/ value){
		//	summary:
		//		Accesses styles on a node. If 2 arguments are
		//		passed, acts as a getter. If 3 arguments are passed, acts
		//		as a setter.
		//	description:
		//		Getting the style value uses the computed style for the node, so the value
		//		will be a calculated value, not just the immediate node.style value.
		//		Also when getting values, use specific style names,
		//		like "borderBottomWidth" instead of "border" since compound values like
		//		"border" are not necessarily reflected as expected.
		//		If you want to get node dimensions, use `dojo.marginBox()`, 
		//		`dojo.contentBox()` or `dojo.position()`.
		//	node:
		//		id or reference to node to get/set style for
		//	style:
		//		the style property to set in DOM-accessor format
		//		("borderWidth", not "border-width") or an object with key/value
		//		pairs suitable for setting each property.
		//	value:
		//		If passed, sets value on the node for style, handling
		//		cross-browser concerns.  When setting a pixel value,
		//		be sure to include "px" in the value. For instance, top: "200px".
		//		Otherwise, in some cases, some browsers will not apply the style.
		//	example:
		//		Passing only an ID or node returns the computed style object of
		//		the node:
		//	|	dojo.style("thinger");
		//	example:
		//		Passing a node and a style property returns the current
		//		normalized, computed value for that property:
		//	|	dojo.style("thinger", "opacity"); // 1 by default
		//
		//	example:
		//		Passing a node, a style property, and a value changes the
		//		current display of the node and returns the new computed value
		//	|	dojo.style("thinger", "opacity", 0.5); // == 0.5
		//
		//	example:
		//		Passing a node, an object-style style property sets each of the values in turn and returns the computed style object of the node:
		//	|	dojo.style("thinger", {
		//	|		"opacity": 0.5,
		//	|		"border": "3px solid black",
		//	|		"height": "300px"
		//	|	});
		//
		// 	example:
		//		When the CSS style property is hyphenated, the JavaScript property is camelCased.
		//		font-size becomes fontSize, and so on.
		//	|	dojo.style("thinger",{
		//	|		fontSize:"14pt",
		//	|		letterSpacing:"1.2em"
		//	|	});
		//
		//	example:
		//		dojo.NodeList implements .style() using the same syntax, omitting the "node" parameter, calling
		//		dojo.style() on every element of the list. See: `dojo.query()` and `dojo.NodeList()`
		//	|	dojo.query(".someClassName").style("visibility","hidden");
		//	|	// or
		//	|	dojo.query("#baz > div").style({
		//	|		opacity:0.75,
		//	|		fontSize:"13pt"
		//	|	});

		var n = byId(node), args = arguments.length, op = (style == "opacity");
		style = _floatAliases[style] || style;
		if(args == 3){
			return op ? d._setOpacity(n, value) : n.style[style] = value; /*Number*/
		}
		if(args == 2 && op){
			return d._getOpacity(n);
		}
		var s = gcs(n);
		if(args == 2 && typeof style != "string"){ // inline'd type check
			for(var x in style){
				d.style(node, x, style[x]);
			}
			return s;
		}
		return (args == 1) ? s : _toStyleValue(n, style, s[style] || n.style[style]); /* CSS2Properties||String||Number */
	}

	// =============================
	// Box Functions
	// =============================

	dojo._getPadExtents = function(/*DomNode*/n, /*Object*/computedStyle){
		//	summary:
		// 		Returns object with special values specifically useful for node
		// 		fitting.
		//	description:
		//		Returns an object with `w`, `h`, `l`, `t` properties:
		//	|		l/t = left/top padding (respectively)
		//	|		w = the total of the left and right padding 
		//	|		h = the total of the top and bottom padding
		//		If 'node' has position, l/t forms the origin for child nodes.
		//		The w/h are used for calculating boxes.
		//		Normally application code will not need to invoke this
		//		directly, and will use the ...box... functions instead.
		var 
			s = computedStyle||gcs(n),
			l = px(n, s.paddingLeft),
			t = px(n, s.paddingTop);
		return {
			l: l,
			t: t,
			w: l+px(n, s.paddingRight),
			h: t+px(n, s.paddingBottom)
		};
	}

	dojo._getBorderExtents = function(/*DomNode*/n, /*Object*/computedStyle){
		//	summary:
		//		returns an object with properties useful for noting the border
		//		dimensions.
		//	description:
		// 		* l/t = the sum of left/top border (respectively)
		//		* w = the sum of the left and right border
		//		* h = the sum of the top and bottom border
		//
		//		The w/h are used for calculating boxes.
		//		Normally application code will not need to invoke this
		//		directly, and will use the ...box... functions instead.
		var 
			ne = "none",
			s = computedStyle||gcs(n),
			bl = (s.borderLeftStyle != ne ? px(n, s.borderLeftWidth) : 0),
			bt = (s.borderTopStyle != ne ? px(n, s.borderTopWidth) : 0);
		return {
			l: bl,
			t: bt,
			w: bl + (s.borderRightStyle!=ne ? px(n, s.borderRightWidth) : 0),
			h: bt + (s.borderBottomStyle!=ne ? px(n, s.borderBottomWidth) : 0)
		};
	}

	dojo._getPadBorderExtents = function(/*DomNode*/n, /*Object*/computedStyle){
		//	summary:
		//		Returns object with properties useful for box fitting with
		//		regards to padding.
		// description:
		//		* l/t = the sum of left/top padding and left/top border (respectively)
		//		* w = the sum of the left and right padding and border
		//		* h = the sum of the top and bottom padding and border
		//
		//		The w/h are used for calculating boxes.
		//		Normally application code will not need to invoke this
		//		directly, and will use the ...box... functions instead.
		var 
			s = computedStyle||gcs(n),
			p = d._getPadExtents(n, s),
			b = d._getBorderExtents(n, s);
		return {
			l: p.l + b.l,
			t: p.t + b.t,
			w: p.w + b.w,
			h: p.h + b.h
		};
	}

	dojo._getMarginExtents = function(n, computedStyle){
		//	summary:
		//		returns object with properties useful for box fitting with
		//		regards to box margins (i.e., the outer-box).
		//
		//		* l/t = marginLeft, marginTop, respectively
		//		* w = total width, margin inclusive
		//		* h = total height, margin inclusive
		//
		//		The w/h are used for calculating boxes.
		//		Normally application code will not need to invoke this
		//		directly, and will use the ...box... functions instead.
		var 
			s = computedStyle||gcs(n),
			l = px(n, s.marginLeft),
			t = px(n, s.marginTop),
			r = px(n, s.marginRight),
			b = px(n, s.marginBottom);
		if(d.isWebKit && (s.position != "absolute")){
			// FIXME: Safari's version of the computed right margin
			// is the space between our right edge and the right edge 
			// of our offsetParent.
			// What we are looking for is the actual margin value as 
			// determined by CSS.
			// Hack solution is to assume left/right margins are the same.
			r = l;
		}
		return {
			l: l,
			t: t,
			w: l+r,
			h: t+b
		};
	}

	// Box getters work in any box context because offsetWidth/clientWidth
	// are invariant wrt box context
	//
	// They do *not* work for display: inline objects that have padding styles
	// because the user agent ignores padding (it's bogus styling in any case)
	//
	// Be careful with IMGs because they are inline or block depending on 
	// browser and browser mode.

	// Although it would be easier to read, there are not separate versions of 
	// _getMarginBox for each browser because:
	// 1. the branching is not expensive
	// 2. factoring the shared code wastes cycles (function call overhead)
	// 3. duplicating the shared code wastes bytes

	dojo._getMarginBox = function(/*DomNode*/node, /*Object*/computedStyle){
		// summary:
		//		returns an object that encodes the width, height, left and top
		//		positions of the node's margin box.
		var s = computedStyle || gcs(node), me = d._getMarginExtents(node, s);
		var l = node.offsetLeft - me.l, t = node.offsetTop - me.t, p = node.parentNode;
				if(d.isMoz){
			// Mozilla:
			// If offsetParent has a computed overflow != visible, the offsetLeft is decreased
			// by the parent's border.
			// We don't want to compute the parent's style, so instead we examine node's
			// computed left/top which is more stable.
			var sl = parseFloat(s.left), st = parseFloat(s.top);
			if(!isNaN(sl) && !isNaN(st)){
				l = sl, t = st;
			}else{
				// If child's computed left/top are not parseable as a number (e.g. "auto"), we
				// have no choice but to examine the parent's computed style.
				if(p && p.style){
					var pcs = gcs(p);
					if(pcs.overflow != "visible"){
						var be = d._getBorderExtents(p, pcs);
						l += be.l, t += be.t;
					}
				}
			}
		}else if(d.isOpera || (d.isIE > 7 && !d.isQuirks)){
			// On Opera and IE 8, offsetLeft/Top includes the parent's border
			if(p){
				be = d._getBorderExtents(p);
				l -= be.l;
				t -= be.t;
			}
		}
				return {
			l: l,
			t: t,
			w: node.offsetWidth + me.w,
			h: node.offsetHeight + me.h 
		};
	}

	dojo._getContentBox = function(node, computedStyle){
		// summary:
		//		Returns an object that encodes the width, height, left and top
		//		positions of the node's content box, irrespective of the
		//		current box model.

		// clientWidth/Height are important since the automatically account for scrollbars
		// fallback to offsetWidth/Height for special cases (see #3378)
		var s = computedStyle || gcs(node),
			pe = d._getPadExtents(node, s),
			be = d._getBorderExtents(node, s),
			w = node.clientWidth,
			h
		;
		if(!w){
			w = node.offsetWidth, h = node.offsetHeight;
		}else{
			h = node.clientHeight, be.w = be.h = 0;
		}
		// On Opera, offsetLeft includes the parent's border
				if(d.isOpera){ pe.l += be.l; pe.t += be.t; };
				return {
			l: pe.l,
			t: pe.t,
			w: w - pe.w - be.w,
			h: h - pe.h - be.h
		};
	}

	dojo._getBorderBox = function(node, computedStyle){
		var s = computedStyle || gcs(node),
			pe = d._getPadExtents(node, s),
			cb = d._getContentBox(node, s)
		;
		return {
			l: cb.l - pe.l,
			t: cb.t - pe.t,
			w: cb.w + pe.w,
			h: cb.h + pe.h
		};
	}

	// Box setters depend on box context because interpretation of width/height styles
	// vary wrt box context.
	//
	// The value of dojo.boxModel is used to determine box context.
	// dojo.boxModel can be set directly to change behavior.
	//
	// Beware of display: inline objects that have padding styles
	// because the user agent ignores padding (it's a bogus setup anyway)
	//
	// Be careful with IMGs because they are inline or block depending on 
	// browser and browser mode.
	//
	// Elements other than DIV may have special quirks, like built-in
	// margins or padding, or values not detectable via computedStyle.
	// In particular, margins on TABLE do not seems to appear 
	// at all in computedStyle on Mozilla.

	dojo._setBox = function(/*DomNode*/node, /*Number?*/l, /*Number?*/t, /*Number?*/w, /*Number?*/h, /*String?*/u){
		//	summary:
		//		sets width/height/left/top in the current (native) box-model
		//		dimentions. Uses the unit passed in u.
		//	node:
		//		DOM Node reference. Id string not supported for performance
		//		reasons.
		//	l:
		//		left offset from parent.
		//	t:
		//		top offset from parent.
		//	w:
		//		width in current box model.
		//	h:
		//		width in current box model.
		//	u:
		//		unit measure to use for other measures. Defaults to "px".
		u = u || "px";
		var s = node.style;
		if(!isNaN(l)){ s.left = l + u; }
		if(!isNaN(t)){ s.top = t + u; }
		if(w >= 0){ s.width = w + u; }
		if(h >= 0){ s.height = h + u; }
	}

	dojo._isButtonTag = function(/*DomNode*/node) {
		// summary:
		//		True if the node is BUTTON or INPUT.type="button".
		return node.tagName == "BUTTON"
			|| node.tagName=="INPUT" && (node.getAttribute("type")||'').toUpperCase() == "BUTTON"; // boolean
	}

	dojo._usesBorderBox = function(/*DomNode*/node){
		//	summary:
		//		True if the node uses border-box layout.

		// We could test the computed style of node to see if a particular box
		// has been specified, but there are details and we choose not to bother.

		// TABLE and BUTTON (and INPUT type=button) are always border-box by default.
		// If you have assigned a different box to either one via CSS then
		// box functions will break.

		var n = node.tagName;
		return d.boxModel=="border-box" || n=="TABLE" || d._isButtonTag(node); // boolean
	}

	dojo._setContentSize = function(/*DomNode*/node, /*Number*/widthPx, /*Number*/heightPx, /*Object*/computedStyle){
		//	summary:
		//		Sets the size of the node's contents, irrespective of margins,
		//		padding, or borders.
		if(d._usesBorderBox(node)){
			var pb = d._getPadBorderExtents(node, computedStyle);
			if(widthPx >= 0){ widthPx += pb.w; }
			if(heightPx >= 0){ heightPx += pb.h; }
		}
		d._setBox(node, NaN, NaN, widthPx, heightPx);
	}

	dojo._setMarginBox = function(/*DomNode*/node, 	/*Number?*/leftPx, /*Number?*/topPx,
													/*Number?*/widthPx, /*Number?*/heightPx,
													/*Object*/computedStyle){
		//	summary:
		//		sets the size of the node's margin box and placement
		//		(left/top), irrespective of box model. Think of it as a
		//		passthrough to dojo._setBox that handles box-model vagaries for
		//		you.

		var s = computedStyle || gcs(node),
		// Some elements have special padding, margin, and box-model settings.
		// To use box functions you may need to set padding, margin explicitly.
		// Controlling box-model is harder, in a pinch you might set dojo.boxModel.
			bb = d._usesBorderBox(node),
			pb = bb ? _nilExtents : d._getPadBorderExtents(node, s)
		;
		if(d.isWebKit){
			// on Safari (3.1.2), button nodes with no explicit size have a default margin
			// setting an explicit size eliminates the margin.
			// We have to swizzle the width to get correct margin reading.
			if(d._isButtonTag(node)){
				var ns = node.style;
				if(widthPx >= 0 && !ns.width) { ns.width = "4px"; }
				if(heightPx >= 0 && !ns.height) { ns.height = "4px"; }
			}
		}
		var mb = d._getMarginExtents(node, s);
		if(widthPx >= 0){ widthPx = Math.max(widthPx - pb.w - mb.w, 0); }
		if(heightPx >= 0){ heightPx = Math.max(heightPx - pb.h - mb.h, 0); }
		d._setBox(node, leftPx, topPx, widthPx, heightPx);
	}

	var _nilExtents = { l:0, t:0, w:0, h:0 };

	// public API

	dojo.marginBox = function(/*DomNode|String*/node, /*Object?*/box){
		//	summary:
		//		Getter/setter for the margin-box of node.
		//	description:
		//		Getter/setter for the margin-box of node.
		//		Returns an object in the expected format of box (regardless
		//		if box is passed). The object might look like:
		//			`{ l: 50, t: 200, w: 300: h: 150 }`
		//		for a node offset from its parent 50px to the left, 200px from
		//		the top with a margin width of 300px and a margin-height of
		//		150px.
		//	node:
		//		id or reference to DOM Node to get/set box for
		//	box:
		//		If passed, denotes that dojo.marginBox() should
		//		update/set the margin box for node. Box is an object in the
		//		above format. All properties are optional if passed.
		//	example:
		//	Retrieve the marginbox of a passed node
		//	|	var box = dojo.marginBox("someNodeId");
		//	|	console.dir(box);
		//
		//	example:
		//	Set a node's marginbox to the size of another node
		//	|	var box = dojo.marginBox("someNodeId");
		//	|	dojo.marginBox("someOtherNode", box);
		
		var n = byId(node), s = gcs(n), b = box;
		return !b ? d._getMarginBox(n, s) : d._setMarginBox(n, b.l, b.t, b.w, b.h, s); // Object
	}

	dojo.contentBox = function(/*DomNode|String*/node, /*Object?*/box){
		//	summary:
		//		Getter/setter for the content-box of node.
		//	description:
		//		Returns an object in the expected format of box (regardless if box is passed).
		//		The object might look like:
		//			`{ l: 50, t: 200, w: 300: h: 150 }`
		//		for a node offset from its parent 50px to the left, 200px from
		//		the top with a content width of 300px and a content-height of
		//		150px. Note that the content box may have a much larger border
		//		or margin box, depending on the box model currently in use and
		//		CSS values set/inherited for node.
		//		While the getter will return top and left values, the
		//		setter only accepts setting the width and height.
		//	node:
		//		id or reference to DOM Node to get/set box for
		//	box:
		//		If passed, denotes that dojo.contentBox() should
		//		update/set the content box for node. Box is an object in the
		//		above format, but only w (width) and h (height) are supported.
		//		All properties are optional if passed.
		var n = byId(node), s = gcs(n), b = box;
		return !b ? d._getContentBox(n, s) : d._setContentSize(n, b.w, b.h, s); // Object
	}

	// =============================
	// Positioning 
	// =============================

	var _sumAncestorProperties = function(node, prop){
		if(!(node = (node||0).parentNode)){return 0}
		var val, retVal = 0, _b = d.body();
		while(node && node.style){
			if(gcs(node).position == "fixed"){
				return 0;
			}
			val = node[prop];
			if(val){
				retVal += val - 0;
				// opera and khtml #body & #html has the same values, we only
				// need one value
				if(node == _b){ break; }
			}
			node = node.parentNode;
		}
		return retVal;	//	integer
	}

	dojo._docScroll = function(){
		var n = d.global;
		return "pageXOffset" in n? { x:n.pageXOffset, y:n.pageYOffset } :
			(n=d.doc.documentElement, n.clientHeight? { x:d._fixIeBiDiScrollLeft(n.scrollLeft), y:n.scrollTop } :
			(n=d.body(), { x:n.scrollLeft||0, y:n.scrollTop||0 }));
	};

	dojo._isBodyLtr = function(){
		return "_bodyLtr" in d? d._bodyLtr :
			d._bodyLtr = (d.body().dir || d.doc.documentElement.dir || "ltr").toLowerCase() == "ltr"; // Boolean 
	}

		dojo._getIeDocumentElementOffset = function(){
		//	summary:
		//		returns the offset in x and y from the document body to the
		//		visual edge of the page
		//	description:
		// The following values in IE contain an offset:
		//	|		event.clientX
		//	|		event.clientY
		//	|		node.getBoundingClientRect().left
		//	|		node.getBoundingClientRect().top
		//	 	But other position related values do not contain this offset,
		//	 	such as node.offsetLeft, node.offsetTop, node.style.left and
		//	 	node.style.top. The offset is always (2, 2) in LTR direction.
		//	 	When the body is in RTL direction, the offset counts the width
		//	 	of left scroll bar's width.  This function computes the actual
		//	 	offset.

		//NOTE: assumes we're being called in an IE browser

		var de = d.doc.documentElement; // only deal with HTML element here, _abs handles body/quirks 

		if(d.isIE < 8){
			var r = de.getBoundingClientRect(); // works well for IE6+
			//console.debug('rect left,top = ' + r.left+','+r.top + ', html client left/top = ' + de.clientLeft+','+de.clientTop + ', rtl = ' + (!d._isBodyLtr()) + ', quirks = ' + d.isQuirks);
			var l = r.left,
			    t = r.top;
			if(d.isIE < 7){
				l += de.clientLeft;	// scrollbar size in strict/RTL, or,
				t += de.clientTop;	// HTML border size in strict
			}
			return {
				x: l < 0? 0 : l, // FRAME element border size can lead to inaccurate negative values
				y: t < 0? 0 : t
			};
		}else{
			return {
				x: 0,
				y: 0
			};
		}

	};
	
	dojo._fixIeBiDiScrollLeft = function(/*Integer*/ scrollLeft){
		// In RTL direction, scrollLeft should be a negative value, but IE < 8
		// returns a positive one. All codes using documentElement.scrollLeft
		// must call this function to fix this error, otherwise the position
		// will offset to right when there is a horizontal scrollbar.

				var dd = d.doc;
		if(d.isIE < 8 && !d._isBodyLtr()){
			var de = d.isQuirks ? dd.body : dd.documentElement;
			return scrollLeft + de.clientWidth - de.scrollWidth; // Integer
		}
				return scrollLeft; // Integer
	}

	// FIXME: need a setter for coords or a moveTo!!
	dojo._abs = dojo.position = function(/*DomNode*/node, /*Boolean?*/includeScroll){
		//	summary:
		//		Gets the position and size of the passed element relative to
		//		the viewport (if includeScroll==false), or relative to the
		//		document root (if includeScroll==true).
		//
		//	description:
		//		Returns an object of the form:
		//			{ x: 100, y: 300, w: 20, h: 15 }
		//		If includeScroll==true, the x and y values will include any
		//		document offsets that may affect the position relative to the
		//		viewport.
		//		Uses the border-box model (inclusive of border and padding but
		//		not margin).  Does not act as a setter.

		var db = d.body(), dh = db.parentNode, ret;
		node = byId(node);
		if(node["getBoundingClientRect"]){
			// IE6+, FF3+, super-modern WebKit, and Opera 9.6+ all take this branch
			ret = node.getBoundingClientRect();
			ret = { x: ret.left, y: ret.top, w: ret.right - ret.left, h: ret.bottom - ret.top };
					if(d.isIE){
				// On IE there's a 2px offset that we need to adjust for, see _getIeDocumentElementOffset()
				var offset = d._getIeDocumentElementOffset();

				// fixes the position in IE, quirks mode
				ret.x -= offset.x + (d.isQuirks ? db.clientLeft+db.offsetLeft : 0);
				ret.y -= offset.y + (d.isQuirks ? db.clientTop+db.offsetTop : 0);
			}else if(d.isFF == 3){
				// In FF3 you have to subtract the document element margins.
				// Fixed in FF3.5 though.
				var cs = gcs(dh);
				ret.x -= px(dh, cs.marginLeft) + px(dh, cs.borderLeftWidth);
				ret.y -= px(dh, cs.marginTop) + px(dh, cs.borderTopWidth);
			}
				}else{
			// FF2 and older WebKit
			ret = {
				x: 0,
				y: 0,
				w: node.offsetWidth,
				h: node.offsetHeight
			};
			if(node["offsetParent"]){
				ret.x -= _sumAncestorProperties(node, "scrollLeft");
				ret.y -= _sumAncestorProperties(node, "scrollTop");

				var curnode = node;
				do{
					var n = curnode.offsetLeft,
						t = curnode.offsetTop;
					ret.x += isNaN(n) ? 0 : n;
					ret.y += isNaN(t) ? 0 : t;

					cs = gcs(curnode);
					if(curnode != node){
								if(d.isMoz){
							// tried left+right with differently sized left/right borders
							// it really is 2xleft border in FF, not left+right, even in RTL!
							ret.x += 2 * px(curnode,cs.borderLeftWidth);
							ret.y += 2 * px(curnode,cs.borderTopWidth);
						}else{
									ret.x += px(curnode, cs.borderLeftWidth);
							ret.y += px(curnode, cs.borderTopWidth);
								}
							}
					// static children in a static div in FF2 are affected by the div's border as well
					// but offsetParent will skip this div!
							if(d.isMoz && cs.position=="static"){
						var parent=curnode.parentNode;
						while(parent!=curnode.offsetParent){
							var pcs=gcs(parent);
							if(pcs.position=="static"){
								ret.x += px(curnode,pcs.borderLeftWidth);
								ret.y += px(curnode,pcs.borderTopWidth);
							}
							parent=parent.parentNode;
						}
					}
							curnode = curnode.offsetParent;
				}while((curnode != dh) && curnode);
			}else if(node.x && node.y){
				ret.x += isNaN(node.x) ? 0 : node.x;
				ret.y += isNaN(node.y) ? 0 : node.y;
			}
		}
		// account for document scrolling
		// if offsetParent is used, ret value already includes scroll position
		// so we may have to actually remove that value if !includeScroll
		if(includeScroll){
			var scroll = d._docScroll();
			ret.x += scroll.x;
			ret.y += scroll.y;
		}

		return ret; // Object
	}

	dojo.coords = function(/*DomNode|String*/node, /*Boolean?*/includeScroll){
		//	summary:
		//		Deprecated: Use position() for border-box x/y/w/h
		//		or marginBox() for margin-box w/h/l/t.
		//		Returns an object representing a node's size and position.
		//
		//	description:
		//		Returns an object that measures margin-box (w)idth/(h)eight
		//		and absolute position x/y of the border-box. Also returned
		//		is computed (l)eft and (t)op values in pixels from the
		//		node's offsetParent as returned from marginBox().
		//		Return value will be in the form:
		//|			{ l: 50, t: 200, w: 300: h: 150, x: 100, y: 300 }
		//		Does not act as a setter. If includeScroll is passed, the x and
		//		y params are affected as one would expect in dojo.position().
		var n = byId(node), s = gcs(n), mb = d._getMarginBox(n, s);
		var abs = d.position(n, includeScroll);
		mb.x = abs.x;
		mb.y = abs.y;
		return mb;
	}

	// =============================
	// Element attribute Functions
	// =============================

	// dojo.attr() should conform to http://www.w3.org/TR/DOM-Level-2-Core/

	var _propNames = {
			// properties renamed to avoid clashes with reserved words
			"class":   "className",
			"for":     "htmlFor",
			// properties written as camelCase
			tabindex:  "tabIndex",
			readonly:  "readOnly",
			colspan:   "colSpan",
			frameborder: "frameBorder",
			rowspan:   "rowSpan",
			valuetype: "valueType"
		},
		_attrNames = {
			// original attribute names
			classname: "class",
			htmlfor:   "for",
			// for IE
			tabindex:  "tabIndex",
			readonly:  "readOnly"
		},
		_forcePropNames = {
			innerHTML: 1,
			className: 1,
			htmlFor:   d.isIE,
			value:     1
		};

	var _fixAttrName = function(/*String*/ name){
		return _attrNames[name.toLowerCase()] || name;
	};

	var _hasAttr = function(node, name){
		var attr = node.getAttributeNode && node.getAttributeNode(name);
		return attr && attr.specified; // Boolean
	};

	// There is a difference in the presence of certain properties and their default values
	// between browsers. For example, on IE "disabled" is present on all elements,
	// but it is value is "false"; "tabIndex" of <div> returns 0 by default on IE, yet other browsers
	// can return -1.

	dojo.hasAttr = function(/*DomNode|String*/node, /*String*/name){
		//	summary:
		//		Returns true if the requested attribute is specified on the
		//		given element, and false otherwise.
		//	node:
		//		id or reference to the element to check
		//	name:
		//		the name of the attribute
		//	returns:
		//		true if the requested attribute is specified on the
		//		given element, and false otherwise
		var lc = name.toLowerCase();
		return _forcePropNames[_propNames[lc] || name] || _hasAttr(byId(node), _attrNames[lc] || name);	// Boolean
	}

	var _evtHdlrMap = {}, _ctr = 0,
		_attrId = dojo._scopeName + "attrid",
		// the next dictionary lists elements with read-only innerHTML on IE
		_roInnerHtml = {col: 1, colgroup: 1,
			// frameset: 1, head: 1, html: 1, style: 1,
			table: 1, tbody: 1, tfoot: 1, thead: 1, tr: 1, title: 1};

	dojo.attr = function(/*DomNode|String*/node, /*String|Object*/name, /*String?*/value){
		//	summary:
		//		Gets or sets an attribute on an HTML element.
		//	description:
		//		Handles normalized getting and setting of attributes on DOM
		//		Nodes. If 2 arguments are passed, and a the second argumnt is a
		//		string, acts as a getter.
		//
		//		If a third argument is passed, or if the second argument is a
		//		map of attributes, acts as a setter.
		//
		//		When passing functions as values, note that they will not be
		//		directly assigned to slots on the node, but rather the default
		//		behavior will be removed and the new behavior will be added
		//		using `dojo.connect()`, meaning that event handler properties
		//		will be normalized and that some caveats with regards to
		//		non-standard behaviors for onsubmit apply. Namely that you
		//		should cancel form submission using `dojo.stopEvent()` on the
		//		passed event object instead of returning a boolean value from
		//		the handler itself.
		//	node:
		//		id or reference to the element to get or set the attribute on
		//	name:
		//		the name of the attribute to get or set.
		//	value:
		//		The value to set for the attribute
		//	returns:
		//		when used as a getter, the value of the requested attribute
		//		or null if that attribute does not have a specified or
		//		default value;
		//
		//		when used as a setter, the DOM node
		//
		//	example:
		//	|	// get the current value of the "foo" attribute on a node
		//	|	dojo.attr(dojo.byId("nodeId"), "foo");
		//	|	// or we can just pass the id:
		//	|	dojo.attr("nodeId", "foo");
		//
		//	example:
		//	|	// use attr() to set the tab index
		//	|	dojo.attr("nodeId", "tabIndex", 3);
		//	|
		//
		//	example:
		//	Set multiple values at once, including event handlers:
		//	|	dojo.attr("formId", {
		//	|		"foo": "bar",
		//	|		"tabIndex": -1,
		//	|		"method": "POST",
		//	|		"onsubmit": function(e){
		//	|			// stop submitting the form. Note that the IE behavior
		//	|			// of returning true or false will have no effect here
		//	|			// since our handler is connect()ed to the built-in
		//	|			// onsubmit behavior and so we need to use
		//	|			// dojo.stopEvent() to ensure that the submission
		//	|			// doesn't proceed.
		//	|			dojo.stopEvent(e);
		//	|
		//	|			// submit the form with Ajax
		//	|			dojo.xhrPost({ form: "formId" });
		//	|		}
		//	|	});
		//
		//	example:
		//	Style is s special case: Only set with an object hash of styles
		//	|	dojo.attr("someNode",{
		//	|		id:"bar",
		//	|		style:{
		//	|			width:"200px", height:"100px", color:"#000"
		//	|		}
		//	|	});
		//
		//	example:
		//	Again, only set style as an object hash of styles:
		//	|	var obj = { color:"#fff", backgroundColor:"#000" };
		//	|	dojo.attr("someNode", "style", obj);
		//	|
		//	|	// though shorter to use `dojo.style()` in this case:
		//	|	dojo.style("someNode", obj);

		node = byId(node);
		var args = arguments.length, prop;
		if(args == 2 && typeof name != "string"){ // inline'd type check
			// the object form of setter: the 2nd argument is a dictionary
			for(var x in name){
				d.attr(node, x, name[x]);
			}
			return node; // DomNode
		}
		var lc = name.toLowerCase(),
			propName = _propNames[lc] || name,
			forceProp = _forcePropNames[propName],
			attrName = _attrNames[lc] || name;
		if(args == 3){
			// setter
			do{
				if(propName == "style" && typeof value != "string"){ // inline'd type check
					// special case: setting a style
					d.style(node, value);
					break;
				}
				if(propName == "innerHTML"){
					// special case: assigning HTML
										if(d.isIE && node.tagName.toLowerCase() in _roInnerHtml){
						d.empty(node);
						node.appendChild(d._toDom(value, node.ownerDocument));
					}else{
											node[propName] = value;
										}
										break;
				}
				if(d.isFunction(value)){
					// special case: assigning an event handler
					// clobber if we can
					var attrId = d.attr(node, _attrId);
					if(!attrId){
						attrId = _ctr++;
						d.attr(node, _attrId, attrId);
					}
					if(!_evtHdlrMap[attrId]){
						_evtHdlrMap[attrId] = {};
					}
					var h = _evtHdlrMap[attrId][propName];
					if(h){
						d.disconnect(h);
					}else{
						try{
							delete node[propName];
						}catch(e){}
					}
					// ensure that event objects are normalized, etc.
					_evtHdlrMap[attrId][propName] = d.connect(node, propName, value);
					break;
				}
				if(forceProp || typeof value == "boolean"){
					// special case: forcing assignment to the property
					// special case: setting boolean to a property instead of attribute
					node[propName] = value;
					break;
				}
				// node's attribute
				node.setAttribute(attrName, value);
			}while(false);
			return node; // DomNode
		}
		// getter
		// should we access this attribute via a property or
		// via getAttribute()?
		value = node[propName];
		if(forceProp && typeof value != "undefined"){
			// node's property
			return value;	// Anything
		}
		if(propName != "href" && (typeof value == "boolean" || d.isFunction(value))){
			// node's property
			return value;	// Anything
		}
		// node's attribute
		// we need _hasAttr() here to guard against IE returning a default value
		return _hasAttr(node, attrName) ? node.getAttribute(attrName) : null; // Anything
	}

	dojo.removeAttr = function(/*DomNode|String*/ node, /*String*/ name){
		//	summary:
		//		Removes an attribute from an HTML element.
		//	node:
		//		id or reference to the element to remove the attribute from
		//	name:
		//		the name of the attribute to remove
		byId(node).removeAttribute(_fixAttrName(name));
	}

	dojo.getNodeProp = function(/*DomNode|String*/ node, /*String*/ name){
		//	summary:
		//		Returns an effective value of a property or an attribute.
		//	node:
		//		id or reference to the element to remove the attribute from
		//	name:
		//		the name of the attribute
		node = byId(node);
		var lc = name.toLowerCase(),
			propName = _propNames[lc] || name;
		if((propName in node) && propName != "href"){
			// node's property
			return node[propName];	// Anything
		}
		// node's attribute
		var attrName = _attrNames[lc] || name;
		return _hasAttr(node, attrName) ? node.getAttribute(attrName) : null; // Anything
	}

	dojo.create = function(tag, attrs, refNode, pos){
		//	summary:
		//		Create an element, allowing for optional attribute decoration
		//		and placement.
		//
		// description:
		//		A DOM Element creation function. A shorthand method for creating a node or
		//		a fragment, and allowing for a convenient optional attribute setting step,
		//		as well as an optional DOM placement reference.
		//|
		//		Attributes are set by passing the optional object through `dojo.attr`.
		//		See `dojo.attr` for noted caveats and nuances, and API if applicable.
		//|
		//		Placement is done via `dojo.place`, assuming the new node to be the action 
		//		node, passing along the optional reference node and position.
		//
		// tag: String|DomNode
		//		A string of the element to create (eg: "div", "a", "p", "li", "script", "br"),
		//		or an existing DOM node to process.
		//
		// attrs: Object
		//		An object-hash of attributes to set on the newly created node.
		//		Can be null, if you don't want to set any attributes/styles.
		//		See: `dojo.attr` for a description of available attributes.
		//
		// refNode: String?|DomNode?
		//		Optional reference node. Used by `dojo.place` to place the newly created
		//		node somewhere in the dom relative to refNode. Can be a DomNode reference
		//		or String ID of a node.
		//
		// pos: String?
		//		Optional positional reference. Defaults to "last" by way of `dojo.place`,
		//		though can be set to "first","after","before","last", "replace" or "only"
		//		to further control the placement of the new node relative to the refNode.
		//		'refNode' is required if a 'pos' is specified.
		//
		// returns: DomNode
		//
		// example:
		//	Create a DIV:
		//	|	var n = dojo.create("div");
		//
		// example:
		//	Create a DIV with content:
		//	|	var n = dojo.create("div", { innerHTML:"<p>hi</p>" });
		//
		// example:
		//	Place a new DIV in the BODY, with no attributes set
		//	|	var n = dojo.create("div", null, dojo.body());
		//
		// example:
		//	Create an UL, and populate it with LI's. Place the list as the first-child of a 
		//	node with id="someId":
		//	|	var ul = dojo.create("ul", null, "someId", "first");
		//	|	var items = ["one", "two", "three", "four"];
		//	|	dojo.forEach(items, function(data){
		//	|		dojo.create("li", { innerHTML: data }, ul);
		//	|	});
		//
		// example:
		//	Create an anchor, with an href. Place in BODY:
		//	|	dojo.create("a", { href:"foo.html", title:"Goto FOO!" }, dojo.body());
		//
		// example:
		//	Create a `dojo.NodeList()` from a new element (for syntatic sugar):
		//	|	dojo.query(dojo.create('div'))
		//	|		.addClass("newDiv")
		//	|		.onclick(function(e){ console.log('clicked', e.target) })
		//	|		.place("#someNode"); // redundant, but cleaner.

		var doc = d.doc;
		if(refNode){
			refNode = byId(refNode);
			doc = refNode.ownerDocument;
		}
		if(typeof tag == "string"){ // inline'd type check
			tag = doc.createElement(tag);
		}
		if(attrs){ d.attr(tag, attrs); }
		if(refNode){ d.place(tag, refNode, pos); }
		return tag; // DomNode
	}

	/*=====
	dojo.empty = function(node){
			//	summary:
			//		safely removes all children of the node.
			//	node: DOMNode|String
			//		a reference to a DOM node or an id.
			//	example:
			//	Destroy node's children byId:
			//	|	dojo.empty("someId");
			//
			//	example:
			//	Destroy all nodes' children in a list by reference:
			//	|	dojo.query(".someNode").forEach(dojo.empty);
	}
	=====*/

	d.empty =
				d.isIE ?  function(node){
			node = byId(node);
			for(var c; c = node.lastChild;){ // intentional assignment
				d.destroy(c);
			}
		} :
				function(node){
			byId(node).innerHTML = "";
		};

	/*=====
	dojo._toDom = function(frag, doc){
			//	summary:
			//		instantiates an HTML fragment returning the corresponding DOM.
			//	frag: String
			//		the HTML fragment
			//	doc: DocumentNode?
			//		optional document to use when creating DOM nodes, defaults to
			//		dojo.doc if not specified.
			//	returns: DocumentFragment
			//
			//	example:
			//	Create a table row:
			//	|	var tr = dojo._toDom("<tr><td>First!</td></tr>");
	}
	=====*/

	// support stuff for dojo._toDom
	var tagWrap = {
			option: ["select"],
			tbody: ["table"],
			thead: ["table"],
			tfoot: ["table"],
			tr: ["table", "tbody"],
			td: ["table", "tbody", "tr"],
			th: ["table", "thead", "tr"],
			legend: ["fieldset"],
			caption: ["table"],
			colgroup: ["table"],
			col: ["table", "colgroup"],
			li: ["ul"]
		},
		reTag = /<\s*([\w\:]+)/,
		masterNode = {}, masterNum = 0,
		masterName = "__" + d._scopeName + "ToDomId";

	// generate start/end tag strings to use
	// for the injection for each special tag wrap case.
	for(var param in tagWrap){
		var tw = tagWrap[param];
		tw.pre  = param == "option" ? '<select multiple="multiple">' : "<" + tw.join("><") + ">";
		tw.post = "</" + tw.reverse().join("></") + ">";
		// the last line is destructive: it reverses the array,
		// but we don't care at this point
	}

	d._toDom = function(frag, doc){
		//	summary:
		// 		converts HTML string into DOM nodes.

		doc = doc || d.doc;
		var masterId = doc[masterName];
		if(!masterId){
			doc[masterName] = masterId = ++masterNum + "";
			masterNode[masterId] = doc.createElement("div");
		}

		// make sure the frag is a string.
		frag += "";

		// find the starting tag, and get node wrapper
		var match = frag.match(reTag),
			tag = match ? match[1].toLowerCase() : "",
			master = masterNode[masterId],
			wrap, i, fc, df;
		if(match && tagWrap[tag]){
			wrap = tagWrap[tag];
			master.innerHTML = wrap.pre + frag + wrap.post;
			for(i = wrap.length; i; --i){
				master = master.firstChild;
			}
		}else{
			master.innerHTML = frag;
		}

		// one node shortcut => return the node itself
		if(master.childNodes.length == 1){
			return master.removeChild(master.firstChild); // DOMNode
		}

		// return multiple nodes as a document fragment
		df = doc.createDocumentFragment();
		while(fc = master.firstChild){ // intentional assignment
			df.appendChild(fc);
		}
		return df; // DOMNode
	}

	// =============================
	// (CSS) Class Functions
	// =============================
	var _className = "className";

	dojo.hasClass = function(/*DomNode|String*/node, /*String*/classStr){
		//	summary:
		//		Returns whether or not the specified classes are a portion of the
		//		class list currently applied to the node.
		//
		//	node:
		//		String ID or DomNode reference to check the class for.
		//
		//	classStr:
		//		A string class name to look for.
		//
		//	example:
		//	Do something if a node with id="someNode" has class="aSillyClassName" present
		//	|	if(dojo.hasClass("someNode","aSillyClassName")){ ... }

		return ((" "+ byId(node)[_className] +" ").indexOf(" " + classStr + " ") >= 0);  // Boolean
	};

	var spaces = /\s+/, a1 = [""],
		str2array = function(s){
			if(typeof s == "string" || s instanceof String){
				if(s.indexOf(" ") < 0){
					a1[0] = s;
					return a1;
				}else{
					return s.split(spaces);
				}
			}
			// assumed to be an array
			return s || "";
		};

	dojo.addClass = function(/*DomNode|String*/node, /*String|Array*/classStr){
		//	summary:
		//		Adds the specified classes to the end of the class list on the
		//		passed node. Will not re-apply duplicate classes.
		//
		//	node:
		//		String ID or DomNode reference to add a class string too
		//
		//	classStr:
		//		A String class name to add, or several space-separated class names,
		//		or an array of class names.
		//
		// example:
		//	Add a class to some node:
		//	|	dojo.addClass("someNode", "anewClass");
		//
		// example:
		//	Add two classes at once:
		//	|	dojo.addClass("someNode", "firstClass secondClass");
		//
		// example:
		//	Add two classes at once (using array):
		//	|	dojo.addClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//	Available in `dojo.NodeList` for multiple additions
		//	|	dojo.query("ul > li").addClass("firstLevel");

		node = byId(node);
		classStr = str2array(classStr);
		var cls = node[_className], oldLen;
		cls = cls ? " " + cls + " " : " ";
		oldLen = cls.length;
		for(var i = 0, len = classStr.length, c; i < len; ++i){
			c = classStr[i];
			if(c && cls.indexOf(" " + c + " ") < 0){
				cls += c + " ";
			}
		}
		if(oldLen < cls.length){
			node[_className] = cls.substr(1, cls.length - 2);
		}
	};

	dojo.removeClass = function(/*DomNode|String*/node, /*String|Array?*/classStr){
		// summary:
		//		Removes the specified classes from node. No `dojo.hasClass`
		//		check is required.
		//
		// node:
		// 		String ID or DomNode reference to remove the class from.
		//
		// classStr:
		//		An optional String class name to remove, or several space-separated
		//		class names, or an array of class names. If omitted, all class names
		//		will be deleted.
		//
		// example:
		//	Remove a class from some node:
		//	|	dojo.removeClass("someNode", "firstClass");
		//
		// example:
		//	Remove two classes from some node:
		//	|	dojo.removeClass("someNode", "firstClass secondClass");
		//
		// example:
		//	Remove two classes from some node (using array):
		//	|	dojo.removeClass("someNode", ["firstClass", "secondClass"]);
		//
		// example:
		//	Remove all classes from some node:
		//	|	dojo.removeClass("someNode");
		//
		// example:
		//	Available in `dojo.NodeList()` for multiple removal
		//	|	dojo.query(".foo").removeClass("foo");

		node = byId(node);
		var cls;
		if(classStr !== undefined){
			classStr = str2array(classStr);
			cls = " " + node[_className] + " ";
			for(var i = 0, len = classStr.length; i < len; ++i){
				cls = cls.replace(" " + classStr[i] + " ", " ");
			}
			cls = d.trim(cls);
		}else{
			cls = "";
		}
		if(node[_className] != cls){ node[_className] = cls; }
	};

	dojo.toggleClass = function(/*DomNode|String*/node, /*String|Array*/classStr, /*Boolean?*/condition){
		//	summary:
		//		Adds a class to node if not present, or removes if present.
		//		Pass a boolean condition if you want to explicitly add or remove.
		//	condition:
		//		If passed, true means to add the class, false means to remove.
		//
		// example:
		//	|	dojo.toggleClass("someNode", "hovered");
		//
		// example:
		//	Forcefully add a class
		//	|	dojo.toggleClass("someNode", "hovered", true);
		//
		// example:
		//	Available in `dojo.NodeList()` for multiple toggles
		//	|	dojo.query(".toggleMe").toggleClass("toggleMe");

		if(condition === undefined){
			condition = !d.hasClass(node, classStr);
		}
		d[condition ? "addClass" : "removeClass"](node, classStr);
	};

})();

}

if(!dojo._hasResource["dojo._base.NodeList"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.NodeList"] = true;
dojo.provide("dojo._base.NodeList");



(function(){

	var d = dojo;

	var ap = Array.prototype, aps = ap.slice, apc = ap.concat;

	var tnl = function(/*Array*/ a, /*dojo.NodeList?*/ parent, /*Function?*/ NodeListCtor){
		// summary:
		// 		decorate an array to make it look like a `dojo.NodeList`.
		// a:
		// 		Array of nodes to decorate.
		// parent:
		// 		An optional parent NodeList that generated the current
		// 		list of nodes. Used to call _stash() so the parent NodeList
		// 		can be accessed via end() later.
		// NodeListCtor:
		// 		An optional constructor function to use for any
		// 		new NodeList calls. This allows a certain chain of
		// 		NodeList calls to use a different object than dojo.NodeList.
		if(!a.sort){
			// make sure it's a real array before we pass it on to be wrapped
			a = aps.call(a, 0);
		}
		var ctor = NodeListCtor || this._NodeListCtor || d._NodeListCtor;
		a.constructor = ctor;
		dojo._mixin(a, ctor.prototype);
		a._NodeListCtor = ctor;
		return parent ? a._stash(parent) : a;
	};

	var loopBody = function(f, a, o){
		a = [0].concat(aps.call(a, 0));
		o = o || d.global;
		return function(node){
			a[0] = node;
			return f.apply(o, a);
		};
	};

	// adapters

	var adaptAsForEach = function(f, o){
		//	summary:
		//		adapts a single node function to be used in the forEach-type
		//		actions. The initial object is returned from the specialized
		//		function.
		//	f: Function
		//		a function to adapt
		//	o: Object?
		//		an optional context for f
		return function(){
			this.forEach(loopBody(f, arguments, o));
			return this;	// Object
		};
	};

	var adaptAsMap = function(f, o){
		//	summary:
		//		adapts a single node function to be used in the map-type
		//		actions. The return is a new array of values, as via `dojo.map`
		//	f: Function
		//		a function to adapt
		//	o: Object?
		//		an optional context for f
		return function(){
			return this.map(loopBody(f, arguments, o));
		};
	};

	var adaptAsFilter = function(f, o){
		//	summary:
		//		adapts a single node function to be used in the filter-type actions
		//	f: Function
		//		a function to adapt
		//	o: Object?
		//		an optional context for f
		return function(){
			return this.filter(loopBody(f, arguments, o));
		};
	};

	var adaptWithCondition = function(f, g, o){
		//	summary:
		//		adapts a single node function to be used in the map-type
		//		actions, behaves like forEach() or map() depending on arguments
		//	f: Function
		//		a function to adapt
		//	g: Function
		//		a condition function, if true runs as map(), otherwise runs as forEach()
		//	o: Object?
		//		an optional context for f and g
		return function(){
			var a = arguments, body = loopBody(f, a, o);
			if(g.call(o || d.global, a)){
				return this.map(body);	// self
			}
			this.forEach(body);
			return this;	// self
		};
	};

	var magicGuard = function(a){
		//	summary:
		//		the guard function for dojo.attr() and dojo.style()
		return a.length == 1 && (typeof a[0] == "string"); // inline'd type check
	};

	var orphan = function(node){
		//	summary:
		//		function to orphan nodes
		var p = node.parentNode;
		if(p){
			p.removeChild(node);
		}
	};
	// FIXME: should we move orphan() to dojo.html?

	dojo.NodeList = function(){
		//	summary:
		//		dojo.NodeList is an of Array subclass which adds syntactic
		//		sugar for chaining, common iteration operations, animation, and
		//		node manipulation. NodeLists are most often returned as the
		//		result of dojo.query() calls.
		//	description:
		//		dojo.NodeList instances provide many utilities that reflect
		//		core Dojo APIs for Array iteration and manipulation, DOM
		//		manipulation, and event handling. Instead of needing to dig up
		//		functions in the dojo.* namespace, NodeLists generally make the
		//		full power of Dojo available for DOM manipulation tasks in a
		//		simple, chainable way.
		//	example:
		//		create a node list from a node
		//		|	new dojo.NodeList(dojo.byId("foo"));
		//	example:
		//		get a NodeList from a CSS query and iterate on it
		//		|	var l = dojo.query(".thinger");
		//		|	l.forEach(function(node, index, nodeList){
		//		|		console.log(index, node.innerHTML);
		//		|	});
		//	example:
		//		use native and Dojo-provided array methods to manipulate a
		//		NodeList without needing to use dojo.* functions explicitly:
		//		|	var l = dojo.query(".thinger");
		//		|	// since NodeLists are real arrays, they have a length
		//		|	// property that is both readable and writable and
		//		|	// push/pop/shift/unshift methods
		//		|	console.log(l.length);
		//		|	l.push(dojo.create("span"));
		//		|
		//		|	// dojo's normalized array methods work too:
		//		|	console.log( l.indexOf(dojo.byId("foo")) );
		//		|	// ...including the special "function as string" shorthand
		//		|	console.log( l.every("item.nodeType == 1") );
		//		|
		//		|	// NodeLists can be [..] indexed, or you can use the at()
		//		|	// function to get specific items wrapped in a new NodeList:
		//		|	var node = l[3]; // the 4th element
		//		|	var newList = l.at(1, 3); // the 2nd and 4th elements
		//	example:
		//		the style functions you expect are all there too:
		//		|	// style() as a getter...
		//		|	var borders = dojo.query(".thinger").style("border");
		//		|	// ...and as a setter:
		//		|	dojo.query(".thinger").style("border", "1px solid black");
		//		|	// class manipulation
		//		|	dojo.query("li:nth-child(even)").addClass("even");
		//		|	// even getting the coordinates of all the items
		//		|	var coords = dojo.query(".thinger").coords();
		//	example:
		//		DOM manipulation functions from the dojo.* namespace area also
		//		available:
		//		|	// remove all of the elements in the list from their
		//		|	// parents (akin to "deleting" them from the document)
		//		|	dojo.query(".thinger").orphan();
		//		|	// place all elements in the list at the front of #foo
		//		|	dojo.query(".thinger").place("foo", "first");
		//	example:
		//		Event handling couldn't be easier. `dojo.connect` is mapped in,
		//		and shortcut handlers are provided for most DOM events:
		//		|	// like dojo.connect(), but with implicit scope
		//		|	dojo.query("li").connect("onclick", console, "log");
		//		|
		//		|	// many common event handlers are already available directly:
		//		|	dojo.query("li").onclick(console, "log");
		//		|	var toggleHovered = dojo.hitch(dojo, "toggleClass", "hovered");
		//		|	dojo.query("p")
		//		|		.onmouseenter(toggleHovered)
		//		|		.onmouseleave(toggleHovered);
		//	example:
		//		chainability is a key advantage of NodeLists:
		//		|	dojo.query(".thinger")
		//		|		.onclick(function(e){ /* ... */ })
		//		|		.at(1, 3, 8) // get a subset
		//		|			.style("padding", "5px")
		//		|			.forEach(console.log);

		return tnl(Array.apply(null, arguments));
	};

	//Allow things that new up a NodeList to use a delegated or alternate NodeList implementation.
	d._NodeListCtor = d.NodeList;

	var nl = d.NodeList, nlp = nl.prototype;

	// expose adapters and the wrapper as private functions

	nl._wrap = nlp._wrap = tnl;
	nl._adaptAsMap = adaptAsMap;
	nl._adaptAsForEach = adaptAsForEach;
	nl._adaptAsFilter  = adaptAsFilter;
	nl._adaptWithCondition = adaptWithCondition;

	// mass assignment

	// add array redirectors
	d.forEach(["slice", "splice"], function(name){
		var f = ap[name];
		//Use a copy of the this array via this.slice() to allow .end() to work right in the splice case.
		// CANNOT apply ._stash()/end() to splice since it currently modifies
		// the existing this array -- it would break backward compatibility if we copy the array before
		// the splice so that we can use .end(). So only doing the stash option to this._wrap for slice.
		nlp[name] = function(){ return this._wrap(f.apply(this, arguments), name == "slice" ? this : null); };
	});
	// concat should be here but some browsers with native NodeList have problems with it

	// add array.js redirectors
	d.forEach(["indexOf", "lastIndexOf", "every", "some"], function(name){
		var f = d[name];
		nlp[name] = function(){ return f.apply(d, [this].concat(aps.call(arguments, 0))); };
	});

	// add conditional methods
	d.forEach(["attr", "style"], function(name){
		nlp[name] = adaptWithCondition(d[name], magicGuard);
	});

	// add forEach actions
	d.forEach(["connect", "addClass", "removeClass", "toggleClass", "empty", "removeAttr"], function(name){
		nlp[name] = adaptAsForEach(d[name]);
	});

	dojo.extend(dojo.NodeList, {
		_normalize: function(/*String||Element||Object||NodeList*/content, /*DOMNode?*/refNode){
			// summary:
			// 		normalizes data to an array of items to insert.
			// description:
			// 		If content is an object, it can have special properties "template" and
			// 		"parse". If "template" is defined, then the template value is run through
			// 		dojo.string.substitute (if dojo.string.substitute has been dojo.required elsewhere),
			// 		or if templateFunc is a function on the content, that function will be used to
			// 		transform the template into a final string to be used for for passing to dojo._toDom.
			// 		If content.parse is true, then it is remembered for later, for when the content
			// 		nodes are inserted into the DOM. At that point, the nodes will be parsed for widgets
			// 		(if dojo.parser has been dojo.required elsewhere).

			//Wanted to just use a DocumentFragment, but for the array/NodeList
			//case that meant  using cloneNode, but we may not want that.
			//Cloning should only happen if the node operations span
			//multiple refNodes. Also, need a real array, not a NodeList from the
			//DOM since the node movements could change those NodeLists.

			var parse = content.parse === true ? true : false;

			//Do we have an object that needs to be run through a template?
			if(typeof content.template == "string"){
				var templateFunc = content.templateFunc || (dojo.string && dojo.string.substitute);
				content = templateFunc ? templateFunc(content.template, content) : content;
			}

			var type = (typeof content);
			if(type == "string" || type == "number"){
				content = dojo._toDom(content, (refNode && refNode.ownerDocument));
				if(content.nodeType == 11){
					//DocumentFragment. It cannot handle cloneNode calls, so pull out the children.
					content = dojo._toArray(content.childNodes);
				}else{
					content = [content];
				}
			}else if(!dojo.isArrayLike(content)){
				content = [content];
			}else if(!dojo.isArray(content)){
				//To get to this point, content is array-like, but
				//not an array, which likely means a DOM NodeList. Convert it now.
				content = dojo._toArray(content);
			}

			//Pass around the parse info
			if(parse){
				content._runParse = true;
			}
			return content; //Array
		},

		_cloneNode: function(/*DOMNode*/ node){
			// summary:
			// 		private utiltity to clone a node. Not very interesting in the vanilla
			// 		dojo.NodeList case, but delegates could do interesting things like
			// 		clone event handlers if that is derivable from the node.
			return node.cloneNode(true);
		},

		_place: function(/*Array*/ary, /*DOMNode*/refNode, /*String*/position, /*Boolean*/useClone){
			// summary:
			// 		private utility to handle placing an array of nodes relative to another node.
			// description:
			// 		Allows for cloning the nodes in the array, and for
			// 		optionally parsing widgets, if ary._runParse is true.

			//Avoid a disallowed operation if trying to do an innerHTML on a non-element node.
			if(refNode.nodeType != 1 && position == "only"){
				return;
			}
			var rNode = refNode, tempNode;

			//Always cycle backwards in case the array is really a
			//DOM NodeList and the DOM operations take it out of the live collection.
			var length = ary.length;
			for(var i = length - 1; i >= 0; i--){
				var node = (useClone ? this._cloneNode(ary[i]) : ary[i]);

				//If need widget parsing, use a temp node, instead of waiting after inserting into
				//real DOM because we need to start widget parsing at one node up from current node,
				//which could cause some already parsed widgets to be parsed again.
				if(ary._runParse && dojo.parser && dojo.parser.parse){
					if(!tempNode){
						tempNode = rNode.ownerDocument.createElement("div");
					}
					tempNode.appendChild(node);
					dojo.parser.parse(tempNode);
					node = tempNode.firstChild;
					while(tempNode.firstChild){
						tempNode.removeChild(tempNode.firstChild);
					}
				}

				if(i == length - 1){
					dojo.place(node, rNode, position);
				}else{
					rNode.parentNode.insertBefore(node, rNode);
				}
				rNode = node;
			}
		},

		_stash: function(parent){
			// summary:
			// 		private function to hold to a parent NodeList. end() to return the parent NodeList.
			//
			// example:
			// How to make a `dojo.NodeList` method that only returns the third node in
			// the dojo.NodeList but allows access to the original NodeList by using this._stash:
			//	|	dojo.extend(dojo.NodeList, {
			//	|		third: function(){
			//  |			var newNodeList = dojo.NodeList(this[2]);
			//	|			return newNodeList._stash(this);
			//	|		}
			//	|	});
			//	|	// then see how _stash applies a sub-list, to be .end()'ed out of
			//	|	dojo.query(".foo")
			//	|		.third()
			//	|			.addClass("thirdFoo")
			//	|		.end()
			//	|		// access to the orig .foo list
			//	|		.removeClass("foo")
			//	|
			//
			this._parent = parent;
			return this; //dojo.NodeList
		},

		end: function(){
			// summary:
			// 		Ends use of the current `dojo.NodeList` by returning the previous dojo.NodeList
			// 		that generated the current dojo.NodeList.
			// description:
			// 		Returns the `dojo.NodeList` that generated the current `dojo.NodeList`. If there
			// 		is no parent dojo.NodeList, an empty dojo.NodeList is returned.
			// example:
			//	|	dojo.query("a")
			//	|		.filter(".disabled")
			//	|			// operate on the anchors that only have a disabled class
			//	|			.style("color", "grey")
			//	|		.end()
			//	|		// jump back to the list of anchors
			//	|		.style(...)
			//
			if(this._parent){
				return this._parent;
			}else{
				//Just return empy list.
				return new this._NodeListCtor();
			}
		},

		// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array#Methods

		// FIXME: handle return values for #3244
		//		http://trac.dojotoolkit.org/ticket/3244

		// FIXME:
		//		need to wrap or implement:
		//			join (perhaps w/ innerHTML/outerHTML overload for toString() of items?)
		//			reduce
		//			reduceRight

		/*=====
		slice: function(begin, end){
			// summary:
			//		Returns a new NodeList, maintaining this one in place
			// description:
			//		This method behaves exactly like the Array.slice method
			//		with the caveat that it returns a dojo.NodeList and not a
			//		raw Array. For more details, see Mozilla's (slice
			//		documentation)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:slice]
			// begin: Integer
			//		Can be a positive or negative integer, with positive
			//		integers noting the offset to begin at, and negative
			//		integers denoting an offset from the end (i.e., to the left
			//		of the end)
			// end: Integer?
			//		Optional parameter to describe what position relative to
			//		the NodeList's zero index to end the slice at. Like begin,
			//		can be positive or negative.
			return this._wrap(a.slice.apply(this, arguments));
		},

		splice: function(index, howmany, item){
			// summary:
			//		Returns a new NodeList, manipulating this NodeList based on
			//		the arguments passed, potentially splicing in new elements
			//		at an offset, optionally deleting elements
			// description:
			//		This method behaves exactly like the Array.splice method
			//		with the caveat that it returns a dojo.NodeList and not a
			//		raw Array. For more details, see Mozilla's (splice
			//		documentation)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:splice]
			// 		For backwards compatibility, calling .end() on the spliced NodeList
			// 		does not return the original NodeList -- splice alters the NodeList in place.
			// index: Integer
			//		begin can be a positive or negative integer, with positive
			//		integers noting the offset to begin at, and negative
			//		integers denoting an offset from the end (i.e., to the left
			//		of the end)
			// howmany: Integer?
			//		Optional parameter to describe what position relative to
			//		the NodeList's zero index to end the slice at. Like begin,
			//		can be positive or negative.
			// item: Object...?
			//		Any number of optional parameters may be passed in to be
			//		spliced into the NodeList
			// returns:
			//		dojo.NodeList
			return this._wrap(a.splice.apply(this, arguments));
		},

		indexOf: function(value, fromIndex){
			//	summary:
			//		see dojo.indexOf(). The primary difference is that the acted-on 
			//		array is implicitly this NodeList
			// value: Object:
			//		The value to search for.
			// fromIndex: Integer?:
			//		The loction to start searching from. Optional. Defaults to 0.
			//	description:
			//		For more details on the behavior of indexOf, see Mozilla's
			//		(indexOf
			//		docs)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:indexOf]
			//	returns:
			//		Positive Integer or 0 for a match, -1 of not found.
			return d.indexOf(this, value, fromIndex); // Integer
		},

		lastIndexOf: function(value, fromIndex){
			// summary:
			//		see dojo.lastIndexOf(). The primary difference is that the
			//		acted-on array is implicitly this NodeList
			//	description:
			//		For more details on the behavior of lastIndexOf, see
			//		Mozilla's (lastIndexOf
			//		docs)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:lastIndexOf]
			// value: Object
			//		The value to search for.
			// fromIndex: Integer?
			//		The loction to start searching from. Optional. Defaults to 0.
			// returns:
			//		Positive Integer or 0 for a match, -1 of not found.
			return d.lastIndexOf(this, value, fromIndex); // Integer
		},

		every: function(callback, thisObject){
			//	summary:
			//		see `dojo.every()` and the (Array.every
			//		docs)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:every].
			//		Takes the same structure of arguments and returns as
			//		dojo.every() with the caveat that the passed array is
			//		implicitly this NodeList
			// callback: Function: the callback
			// thisObject: Object?: the context
			return d.every(this, callback, thisObject); // Boolean
		},

		some: function(callback, thisObject){
			//	summary:
			//		Takes the same structure of arguments and returns as
			//		`dojo.some()` with the caveat that the passed array is
			//		implicitly this NodeList.  See `dojo.some()` and Mozilla's
			//		(Array.some
			//		documentation)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:some].
			// callback: Function: the callback
			// thisObject: Object?: the context
			return d.some(this, callback, thisObject); // Boolean
		},
		=====*/

		concat: function(item){
			// summary:
			//		Returns a new NodeList comprised of items in this NodeList
			//		as well as items passed in as parameters
			// description:
			//		This method behaves exactly like the Array.concat method
			//		with the caveat that it returns a `dojo.NodeList` and not a
			//		raw Array. For more details, see the (Array.concat
			//		docs)[http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Global_Objects:Array:concat]
			// item: Object?
			//		Any number of optional parameters may be passed in to be
			//		spliced into the NodeList
			// returns:
			//		dojo.NodeList

			//return this._wrap(apc.apply(this, arguments));
			// the line above won't work for the native NodeList :-(

			// implementation notes:
			// 1) Native NodeList is not an array, and cannot be used directly
			// in concat() --- the latter doesn't recognize it as an array, and
			// does not inline it, but append as a single entity.
			// 2) On some browsers (e.g., Safari) the "constructor" property is
			// read-only and cannot be changed. So we have to test for both
			// native NodeList and dojo.NodeList in this property to recognize
			// the node list.

			var t = d.isArray(this) ? this : aps.call(this, 0),
				m = d.map(arguments, function(a){
					return a && !d.isArray(a) &&
						(typeof NodeList != "undefined" && a.constructor === NodeList || a.constructor === this._NodeListCtor) ?
							aps.call(a, 0) : a;
				});
			return this._wrap(apc.apply(t, m), this);	// dojo.NodeList
		},

		map: function(/*Function*/ func, /*Function?*/ obj){
			//	summary:
			//		see dojo.map(). The primary difference is that the acted-on
			//		array is implicitly this NodeList and the return is a
			//		dojo.NodeList (a subclass of Array)
			///return d.map(this, func, obj, d.NodeList); // dojo.NodeList
			return this._wrap(d.map(this, func, obj), this); // dojo.NodeList
		},

		forEach: function(callback, thisObj){
			//	summary:
			//		see `dojo.forEach()`. The primary difference is that the acted-on 
			//		array is implicitly this NodeList. If you want the option to break out
			//		of the forEach loop, use every() or some() instead.
			d.forEach(this, callback, thisObj);
			// non-standard return to allow easier chaining
			return this; // dojo.NodeList 
		},

		/*=====
		coords: function(){
			//	summary:
			//		Returns the box objects of all elements in a node list as
			//		an Array (*not* a NodeList). Acts like `dojo.coords`, though assumes
			//		the node passed is each node in this list.

			return d.map(this, d.coords); // Array
		},

		position: function(){
			//	summary:
			//		Returns border-box objects (x/y/w/h) of all elements in a node list
			//		as an Array (*not* a NodeList). Acts like `dojo.position`, though
			//		assumes the node passed is each node in this list. 

			return d.map(this, d.position); // Array
		},

		attr: function(property, value){
			//	summary:
			//		gets or sets the DOM attribute for every element in the
			//		NodeList. See also `dojo.attr`
			//	property: String
			//		the attribute to get/set
			//	value: String?
			//		optional. The value to set the property to
			//	returns:
			//		if no value is passed, the result is an array of attribute values
			//		If a value is passed, the return is this NodeList
			//	example:
			//		Make all nodes with a particular class focusable:
			//	|	dojo.query(".focusable").attr("tabIndex", -1);
			//	example:
			//		Disable a group of buttons:
			//	|	dojo.query("button.group").attr("disabled", true);
			//	example:
			//		innerHTML can be assigned or retreived as well:
			//	|	// get the innerHTML (as an array) for each list item
			//	|	var ih = dojo.query("li.replaceable").attr("innerHTML");
			return; // dojo.NodeList
			return; // Array
		},

		style: function(property, value){
			//	summary:
			//		gets or sets the CSS property for every element in the NodeList
			//	property: String
			//		the CSS property to get/set, in JavaScript notation
			//		("lineHieght" instead of "line-height")
			//	value: String?
			//		optional. The value to set the property to
			//	returns:
			//		if no value is passed, the result is an array of strings.
			//		If a value is passed, the return is this NodeList
			return; // dojo.NodeList
			return; // Array
		},

		addClass: function(className){
			//	summary:
			//		adds the specified class to every node in the list
			//	className: String|Array
			//		A String class name to add, or several space-separated class names,
			//		or an array of class names.
			return; // dojo.NodeList
		},

		removeClass: function(className){
			//	summary:
			//		removes the specified class from every node in the list
			//	className: String|Array?
			//		An optional String class name to remove, or several space-separated
			//		class names, or an array of class names. If omitted, all class names
			//		will be deleted.
			//	returns:
			//		dojo.NodeList, this list
			return; // dojo.NodeList
		},

		toggleClass: function(className, condition){
			//	summary:
			//		Adds a class to node if not present, or removes if present.
			//		Pass a boolean condition if you want to explicitly add or remove.
			//	condition: Boolean?
			//		If passed, true means to add the class, false means to remove.
			//	className: String
			//		the CSS class to add
			return; // dojo.NodeList
		},

		connect: function(methodName, objOrFunc, funcName){
			//	summary:
			//		attach event handlers to every item of the NodeList. Uses dojo.connect()
			//		so event properties are normalized
			//	methodName: String
			//		the name of the method to attach to. For DOM events, this should be
			//		the lower-case name of the event
			//	objOrFunc: Object|Function|String
			//		if 2 arguments are passed (methodName, objOrFunc), objOrFunc should
			//		reference a function or be the name of the function in the global
			//		namespace to attach. If 3 arguments are provided
			//		(methodName, objOrFunc, funcName), objOrFunc must be the scope to 
			//		locate the bound function in
			//	funcName: String?
			//		optional. A string naming the function in objOrFunc to bind to the
			//		event. May also be a function reference.
			//	example:
			//		add an onclick handler to every button on the page
			//		|	dojo.query("div:nth-child(odd)").connect("onclick", function(e){
			//		|		console.log("clicked!");
			//		|	});
			// example:
			//		attach foo.bar() to every odd div's onmouseover
			//		|	dojo.query("div:nth-child(odd)").connect("onmouseover", foo, "bar");
		},

		empty: function(){
			//	summary:
			//		clears all content from each node in the list. Effectively
			//		equivalent to removing all child nodes from every item in
			//		the list.
			return this.forEach("item.innerHTML='';"); // dojo.NodeList
			// FIXME: should we be checking for and/or disposing of widgets below these nodes?
		},
		=====*/

		// useful html methods
		coords:	adaptAsMap(d.coords),
		position: adaptAsMap(d.position),

		// FIXME: connectPublisher()? connectRunOnce()?

		/*
		destroy: function(){
			//	summary:
			//		destroys every item in 	the list.
			this.forEach(d.destroy);
			// FIXME: should we be checking for and/or disposing of widgets below these nodes?
		},
		*/

		place: function(/*String||Node*/ queryOrNode, /*String*/ position){
			//	summary:
			//		places elements of this node list relative to the first element matched
			//		by queryOrNode. Returns the original NodeList. See: `dojo.place`
			//	queryOrNode:
			//		may be a string representing any valid CSS3 selector or a DOM node.
			//		In the selector case, only the first matching element will be used 
			//		for relative positioning.
			//	position:
			//		can be one of:
			//		|	"last" (default)
			//		|	"first"
			//		|	"before"
			//		|	"after"
			//		|	"only"
			//		|	"replace"
			// 		or an offset in the childNodes property
			var item = d.query(queryOrNode)[0];
			return this.forEach(function(node){ d.place(node, item, position); }); // dojo.NodeList
		},

		orphan: function(/*String?*/ simpleFilter){
			//	summary:
			//		removes elements in this list that match the simple filter
			//		from their parents and returns them as a new NodeList.
			//	simpleFilter:
			//		single-expression CSS rule. For example, ".thinger" or
			//		"#someId[attrName='value']" but not "div > span". In short,
			//		anything which does not invoke a descent to evaluate but
			//		can instead be used to test a single node is acceptable.
			//	returns:
			//		`dojo.NodeList` containing the orpahned elements 
			return (simpleFilter ? d._filterQueryResult(this, simpleFilter) : this).forEach(orphan); // dojo.NodeList
		},

		adopt: function(/*String||Array||DomNode*/ queryOrListOrNode, /*String?*/ position){
			//	summary:
			//		places any/all elements in queryOrListOrNode at a
			//		position relative to the first element in this list.
			//		Returns a dojo.NodeList of the adopted elements.
			//	queryOrListOrNode:
			//		a DOM node or a query string or a query result.
			//		Represents the nodes to be adopted relative to the
			//		first element of this NodeList.
			//	position:
			//		can be one of:
			//		|	"last" (default)
			//		|	"first"
			//		|	"before"
			//		|	"after"
			//		|	"only"
			//		|	"replace"
			// 		or an offset in the childNodes property
			return d.query(queryOrListOrNode).place(this[0], position)._stash(this);	// dojo.NodeList
		},

		// FIXME: do we need this?
		query: function(/*String*/ queryStr){
			//	summary:
			//		Returns a new list whose memebers match the passed query,
			//		assuming elements of the current NodeList as the root for
			//		each search.
			//	example:
			//		assume a DOM created by this markup:
			//	|	<div id="foo">
			//	|		<p>
			//	|			bacon is tasty, <span>dontcha think?</span>
			//	|		</p>
			//	|	</div>
			//	|	<div id="bar">
			//	|		<p>great commedians may not be funny <span>in person</span></p>
			//	|	</div>
			//		If we are presented with the following defintion for a NodeList:
			//	|	var l = new dojo.NodeList(dojo.byId("foo"), dojo.byId("bar"));
			//		it's possible to find all span elements under paragraphs
			//		contained by these elements with this sub-query:
			//	| 	var spans = l.query("p span");

			// FIXME: probably slow
			if(!queryStr){ return this; }
			var ret = this.map(function(node){
				// FIXME: why would we ever get undefined here?
				return d.query(queryStr, node).filter(function(subNode){ return subNode !== undefined; });
			});
			return this._wrap(apc.apply([], ret), this);	// dojo.NodeList
		},

		filter: function(/*String|Function*/ simpleFilter){
			//	summary:
			// 		"masks" the built-in javascript filter() method (supported
			// 		in Dojo via `dojo.filter`) to support passing a simple
			// 		string filter in addition to supporting filtering function
			// 		objects.
			//	simpleFilter:
			//		If a string, a single-expression CSS rule. For example,
			//		".thinger" or "#someId[attrName='value']" but not "div >
			//		span". In short, anything which does not invoke a descent
			//		to evaluate but can instead be used to test a single node
			//		is acceptable.
			//	example:
			//		"regular" JS filter syntax as exposed in dojo.filter:
			//		|	dojo.query("*").filter(function(item){
			//		|		// highlight every paragraph
			//		|		return (item.nodeName == "p");
			//		|	}).style("backgroundColor", "yellow");
			// example:
			//		the same filtering using a CSS selector
			//		|	dojo.query("*").filter("p").styles("backgroundColor", "yellow");

			var a = arguments, items = this, start = 0;
			if(typeof simpleFilter == "string"){ // inline'd type check
				items = d._filterQueryResult(this, a[0]);
				if(a.length == 1){
					// if we only got a string query, pass back the filtered results
					return items._stash(this); // dojo.NodeList
				}
				// if we got a callback, run it over the filtered items
				start = 1;
			}
			return this._wrap(d.filter(items, a[start], a[start + 1]), this);	// dojo.NodeList
		},

		/*
		// FIXME: should this be "copyTo" and include parenting info?
		clone: function(){
			// summary:
			//		creates node clones of each element of this list
			//		and returns a new list containing the clones
		},
		*/

		addContent: function(/*String||DomNode||Object||dojo.NodeList*/ content, /*String||Integer?*/ position){
			//	summary:
			//		add a node, NodeList or some HTML as a string to every item in the
			//		list.  Returns the original list.
			//	description:
			//		a copy of the HTML content is added to each item in the
			//		list, with an optional position argument. If no position
			//		argument is provided, the content is appended to the end of
			//		each item.
			//	content:
			//		DOM node, HTML in string format, a NodeList or an Object. If a DOM node or
			// 		NodeList, the content will be cloned if the current NodeList has more than one
			// 		element. Only the DOM nodes are cloned, no event handlers. If it is an Object,
			// 		it should be an object with at "template" String property that has the HTML string
			// 		to insert. If dojo.string has already been dojo.required, then dojo.string.substitute
			// 		will be used on the "template" to generate the final HTML string. Other allowed
			// 		properties on the object are: "parse" if the HTML
			// 		string should be parsed for widgets (dojo.require("dojo.parser") to get that
			// 		option to work), and "templateFunc" if a template function besides dojo.string.substitute
			// 		should be used to transform the "template".
			//	position:
			//		can be one of:
			//		|	"last"||"end" (default)
			//		|	"first||"start"
			//		|	"before"
			//		|	"after"
			//		|	"replace" (replaces nodes in this NodeList with new content)
			//		|	"only" (removes other children of the nodes so new content is hte only child)
			// 		or an offset in the childNodes property
			//	example:
			//		appends content to the end if the position is ommitted
			//	|	dojo.query("h3 > p").addContent("hey there!");
			//	example:
			//		add something to the front of each element that has a
			//		"thinger" property:
			//	|	dojo.query("[thinger]").addContent("...", "first");
			//	example:
			//		adds a header before each element of the list
			//	|	dojo.query(".note").addContent("<h4>NOTE:</h4>", "before");
			//	example:
			//		add a clone of a DOM node to the end of every element in
			//		the list, removing it from its existing parent.
			//	|	dojo.query(".note").addContent(dojo.byId("foo"));
			//  example:
			//  	Append nodes from a templatized string.
			// 		dojo.require("dojo.string");
			// 		dojo.query(".note").addContent({
			//  		template: '<b>${id}: </b><span>${name}</span>',
			// 			id: "user332",
			//  		name: "Mr. Anderson"
			//  	});
			//  example:
			//  	Append nodes from a templatized string that also has widgets parsed.
			//  	dojo.require("dojo.string");
			//  	dojo.require("dojo.parser");
			//  	var notes = dojo.query(".note").addContent({
			//  		template: '<button dojoType="dijit.form.Button">${text}</button>',
			//  		parse: true,
			//  		text: "Send"
			//  	});
			content = this._normalize(content, this[0]);
			for(var i = 0, node; node = this[i]; i++){
				this._place(content, node, position, i > 0);
			}
			return this; //dojo.NodeList
		},

		instantiate: function(/*String|Object*/ declaredClass, /*Object?*/ properties){
			//	summary:
			//		Create a new instance of a specified class, using the
			//		specified properties and each node in the nodeList as a
			//		srcNodeRef.
			//	example:
			//		Grabs all buttons in the page and converts them to diji.form.Buttons.
			//	|	var buttons = dojo.query("button").instantiate("dijit.form.Button", {showLabel: true});
			var c = d.isFunction(declaredClass) ? declaredClass : d.getObject(declaredClass);
			properties = properties || {};
			return this.forEach(function(node){
				new c(properties, node);
			});	// dojo.NodeList
		},

		at: function(/*===== index =====*/){
			//	summary:
			//		Returns a new NodeList comprised of items in this NodeList
			//		at the given index or indices.
			//
			//	index: Integer...
			//		One or more 0-based indices of items in the current
			//		NodeList. A negative index will start at the end of the
			//		list and go backwards. 
			//
			//	example:
			//	Shorten the list to the first, second, and third elements
			//	|	dojo.query("a").at(0, 1, 2).forEach(fn); 
			//
			//	example:
			//	Retrieve the first and last elements of a unordered list:
			//	|	dojo.query("ul > li").at(0, -1).forEach(cb);
			//
			//	example:
			//	Do something for the first element only, but end() out back to
			//	the original list and continue chaining:
			//	|	dojo.query("a").at(0).onclick(fn).end().forEach(function(n){
			//	|		console.log(n); // all anchors on the page. 
			//	|	})	
			//
			//	returns:
			//		dojo.NodeList
			var t = new this._NodeListCtor();
			d.forEach(arguments, function(i){ 
				if(i < 0){ i = this.length + i }
				if(this[i]){ t.push(this[i]); }
			}, this);
			return t._stash(this); // dojo.NodeList
		}

	});

	nl.events = [
		// summary: list of all DOM events used in NodeList
		"blur", "focus", "change", "click", "error", "keydown", "keypress",
		"keyup", "load", "mousedown", "mouseenter", "mouseleave", "mousemove",
		"mouseout", "mouseover", "mouseup", "submit"
	];
	
	// FIXME: pseudo-doc the above automatically generated on-event functions

	// syntactic sugar for DOM events
	d.forEach(nl.events, function(evt){
			var _oe = "on" + evt;
			nlp[_oe] = function(a, b){
				return this.connect(_oe, a, b);
			}
				// FIXME: should these events trigger publishes?
				/*
				return (a ? this.connect(_oe, a, b) :
							this.forEach(function(n){
								// FIXME:
								//		listeners get buried by
								//		addEventListener and can't be dug back
								//		out to be triggered externally.
								// see:
								//		http://developer.mozilla.org/en/docs/DOM:element

								console.log(n, evt, _oe);

								// FIXME: need synthetic event support!
								var _e = { target: n, faux: true, type: evt };
								// dojo._event_listener._synthesizeEvent({}, { target: n, faux: true, type: evt });
								try{ n[evt](_e); }catch(e){ console.log(e); }
								try{ n[_oe](_e); }catch(e){ console.log(e); }
							})
				);
				*/
		}
	);

})();

}

if(!dojo._hasResource["dojo._base.query"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.query"] = true;
if(typeof dojo != "undefined"){
	dojo.provide("dojo._base.query");
	
	

}

/*
	dojo.query() architectural overview:

		dojo.query is a relatively full-featured CSS3 query library. It is
		designed to take any valid CSS3 selector and return the nodes matching
		the selector. To do this quickly, it processes queries in several
		steps, applying caching where profitable.
		
		The steps (roughly in reverse order of the way they appear in the code):
			1.) check to see if we already have a "query dispatcher"
				- if so, use that with the given parameterization. Skip to step 4.
			2.) attempt to determine which branch to dispatch the query to:
				- JS (optimized DOM iteration)
				- native (FF3.1+, Safari 3.1+, IE 8+)
			3.) tokenize and convert to executable "query dispatcher"
				- this is where the lion's share of the complexity in the
				  system lies. In the DOM version, the query dispatcher is
				  assembled as a chain of "yes/no" test functions pertaining to
				  a section of a simple query statement (".blah:nth-child(odd)"
				  but not "div div", which is 2 simple statements). Individual
				  statement dispatchers are cached (to prevent re-definition)
				  as are entire dispatch chains (to make re-execution of the
				  same query fast)
			4.) the resulting query dispatcher is called in the passed scope
			    (by default the top-level document)
				- for DOM queries, this results in a recursive, top-down
				  evaluation of nodes based on each simple query section
				- for native implementations, this may mean working around spec
				  bugs. So be it.
			5.) matched nodes are pruned to ensure they are unique (if necessary)
*/

;(function(d){
	// define everything in a closure for compressability reasons. "d" is an
	// alias to "dojo" (or the toolkit alias object, e.g., "acme").

	////////////////////////////////////////////////////////////////////////
	// Toolkit aliases
	////////////////////////////////////////////////////////////////////////

	// if you are extracing dojo.query for use in your own system, you will
	// need to provide these methods and properties. No other porting should be
	// necessary, save for configuring the system to use a class other than
	// dojo.NodeList as the return instance instantiator
	var trim = 			d.trim;
	var each = 			d.forEach;
	// 					d.isIE; // float
	// 					d.isSafari; // float
	// 					d.isOpera; // float
	// 					d.isWebKit; // float
	// 					d.doc ; // document element
	var qlc = d._NodeListCtor = 		d.NodeList;

	var getDoc = function(){ return d.doc; };
	// NOTE(alex): the spec is idiotic. CSS queries should ALWAYS be case-sensitive, but nooooooo
	var cssCaseBug = ((d.isWebKit||d.isMozilla) && ((getDoc().compatMode) == "BackCompat"));

	////////////////////////////////////////////////////////////////////////
	// Global utilities
	////////////////////////////////////////////////////////////////////////


	// on browsers that support the "children" collection we can avoid a lot of
	// iteration on chaff (non-element) nodes.
	// why.
	var childNodesName = !!getDoc().firstChild["children"] ? "children" : "childNodes";

	var specials = ">~+";

	// global thunk to determine whether we should treat the current query as
	// case sensitive or not. This switch is flipped by the query evaluator
	// based on the document passed as the context to search.
	var caseSensitive = false;

	// how high?
	var yesman = function(){ return true; };

	////////////////////////////////////////////////////////////////////////
	// Tokenizer
	////////////////////////////////////////////////////////////////////////

	var getQueryParts = function(query){
		//	summary: 
		//		state machine for query tokenization
		//	description:
		//		instead of using a brittle and slow regex-based CSS parser,
		//		dojo.query implements an AST-style query representation. This
		//		representation is only generated once per query. For example,
		//		the same query run multiple times or under different root nodes
		//		does not re-parse the selector expression but instead uses the
		//		cached data structure. The state machine implemented here
		//		terminates on the last " " (space) charachter and returns an
		//		ordered array of query component structures (or "parts"). Each
		//		part represents an operator or a simple CSS filtering
		//		expression. The structure for parts is documented in the code
		//		below.


		// NOTE: 
		//		this code is designed to run fast and compress well. Sacrifices
		//		to readibility and maintainability have been made.  Your best
		//		bet when hacking the tokenizer is to put The Donnas on *really*
		//		loud (may we recommend their "Spend The Night" release?) and
		//		just assume you're gonna make mistakes. Keep the unit tests
		//		open and run them frequently. Knowing is half the battle ;-)
		if(specials.indexOf(query.slice(-1)) >= 0){
			// if we end with a ">", "+", or "~", that means we're implicitly
			// searching all children, so make it explicit
			query += " * "
		}else{
			// if you have not provided a terminator, one will be provided for
			// you...
			query += " ";
		}

		var ts = function(/*Integer*/ s, /*Integer*/ e){
			// trim and slice. 

			// take an index to start a string slice from and an end position
			// and return a trimmed copy of that sub-string
			return trim(query.slice(s, e));
		}

		// the overall data graph of the full query, as represented by queryPart objects
		var queryParts = []; 


		// state keeping vars
		var inBrackets = -1, inParens = -1, inMatchFor = -1, 
			inPseudo = -1, inClass = -1, inId = -1, inTag = -1, 
			lc = "", cc = "", pStart;

		// iteration vars
		var x = 0, // index in the query
			ql = query.length,
			currentPart = null, // data structure representing the entire clause
			_cp = null; // the current pseudo or attr matcher

		// several temporary variables are assigned to this structure durring a
		// potential sub-expression match:
		//		attr:
		//			a string representing the current full attribute match in a
		//			bracket expression
		//		type:
		//			if there's an operator in a bracket expression, this is
		//			used to keep track of it
		//		value:
		//			the internals of parenthetical expression for a pseudo. for
		//			:nth-child(2n+1), value might be "2n+1"

		var endTag = function(){
			// called when the tokenizer hits the end of a particular tag name.
			// Re-sets state variables for tag matching and sets up the matcher
			// to handle the next type of token (tag or operator).
			if(inTag >= 0){
				var tv = (inTag == x) ? null : ts(inTag, x); // .toLowerCase();
				currentPart[ (specials.indexOf(tv) < 0) ? "tag" : "oper" ] = tv;
				inTag = -1;
			}
		}

		var endId = function(){
			// called when the tokenizer might be at the end of an ID portion of a match
			if(inId >= 0){
				currentPart.id = ts(inId, x).replace(/\\/g, "");
				inId = -1;
			}
		}

		var endClass = function(){
			// called when the tokenizer might be at the end of a class name
			// match. CSS allows for multiple classes, so we augment the
			// current item with another class in its list
			if(inClass >= 0){
				currentPart.classes.push(ts(inClass+1, x).replace(/\\/g, ""));
				inClass = -1;
			}
		}

		var endAll = function(){
			// at the end of a simple fragment, so wall off the matches
			endId(); endTag(); endClass();
		}

		var endPart = function(){
			endAll();
			if(inPseudo >= 0){
				currentPart.pseudos.push({ name: ts(inPseudo+1, x) });
			}
			// hint to the selector engine to tell it whether or not it
			// needs to do any iteration. Many simple selectors don't, and
			// we can avoid significant construction-time work by advising
			// the system to skip them
			currentPart.loops = (	
					currentPart.pseudos.length || 
					currentPart.attrs.length || 
					currentPart.classes.length	);

			currentPart.oquery = currentPart.query = ts(pStart, x); // save the full expression as a string


			// otag/tag are hints to suggest to the system whether or not
			// it's an operator or a tag. We save a copy of otag since the
			// tag name is cast to upper-case in regular HTML matches. The
			// system has a global switch to figure out if the current
			// expression needs to be case sensitive or not and it will use
			// otag or tag accordingly
			currentPart.otag = currentPart.tag = (currentPart["oper"]) ? null : (currentPart.tag || "*");

			if(currentPart.tag){
				// if we're in a case-insensitive HTML doc, we likely want
				// the toUpperCase when matching on element.tagName. If we
				// do it here, we can skip the string op per node
				// comparison
				currentPart.tag = currentPart.tag.toUpperCase();
			}

			// add the part to the list
			if(queryParts.length && (queryParts[queryParts.length-1].oper)){
				// operators are always infix, so we remove them from the
				// list and attach them to the next match. The evaluator is
				// responsible for sorting out how to handle them.
				currentPart.infixOper = queryParts.pop();
				currentPart.query = currentPart.infixOper.query + " " + currentPart.query;
				/*
				console.debug(	"swapping out the infix", 
								currentPart.infixOper, 
								"and attaching it to", 
								currentPart);
				*/
			}
			queryParts.push(currentPart);

			currentPart = null;
		}

		// iterate over the query, charachter by charachter, building up a 
		// list of query part objects
		for(; lc=cc, cc=query.charAt(x), x < ql; x++){
			//		cc: the current character in the match
			//		lc: the last charachter (if any)

			// someone is trying to escape something, so don't try to match any
			// fragments. We assume we're inside a literal.
			if(lc == "\\"){ continue; } 
			if(!currentPart){ // a part was just ended or none has yet been created
				// NOTE: I hate all this alloc, but it's shorter than writing tons of if's
				pStart = x;
				//	rules describe full CSS sub-expressions, like:
				//		#someId
				//		.className:first-child
				//	but not:
				//		thinger > div.howdy[type=thinger]
				//	the indidual components of the previous query would be
				//	split into 3 parts that would be represented a structure
				//	like:
				//		[
				//			{
				//				query: "thinger",
				//				tag: "thinger",
				//			},
				//			{
				//				query: "div.howdy[type=thinger]",
				//				classes: ["howdy"],
				//				infixOper: {
				//					query: ">",
				//					oper: ">",
				//				}
				//			},
				//		]
				currentPart = {
					query: null, // the full text of the part's rule
					pseudos: [], // CSS supports multiple pseud-class matches in a single rule
					attrs: [], 	// CSS supports multi-attribute match, so we need an array
					classes: [], // class matches may be additive, e.g.: .thinger.blah.howdy
					tag: null, 	// only one tag...
					oper: null, // ...or operator per component. Note that these wind up being exclusive.
					id: null, 	// the id component of a rule
					getTag: function(){
						return (caseSensitive) ? this.otag : this.tag;
					}
				};

				// if we don't have a part, we assume we're going to start at
				// the beginning of a match, which should be a tag name. This
				// might fault a little later on, but we detect that and this
				// iteration will still be fine.
				inTag = x; 
			}

			if(inBrackets >= 0){
				// look for a the close first
				if(cc == "]"){ // if we're in a [...] clause and we end, do assignment
					if(!_cp.attr){
						// no attribute match was previously begun, so we
						// assume this is an attribute existance match in the
						// form of [someAttributeName]
						_cp.attr = ts(inBrackets+1, x);
					}else{
						// we had an attribute already, so we know that we're
						// matching some sort of value, as in [attrName=howdy]
						_cp.matchFor = ts((inMatchFor||inBrackets+1), x);
					}
					var cmf = _cp.matchFor;
					if(cmf){
						// try to strip quotes from the matchFor value. We want
						// [attrName=howdy] to match the same 
						//	as [attrName = 'howdy' ]
						if(	(cmf.charAt(0) == '"') || (cmf.charAt(0)  == "'") ){
							_cp.matchFor = cmf.slice(1, -1);
						}
					}
					// end the attribute by adding it to the list of attributes. 
					currentPart.attrs.push(_cp);
					_cp = null; // necessary?
					inBrackets = inMatchFor = -1;
				}else if(cc == "="){
					// if the last char was an operator prefix, make sure we
					// record it along with the "=" operator. 
					var addToCc = ("|~^$*".indexOf(lc) >=0 ) ? lc : "";
					_cp.type = addToCc+cc;
					_cp.attr = ts(inBrackets+1, x-addToCc.length);
					inMatchFor = x+1;
				}
				// now look for other clause parts
			}else if(inParens >= 0){
				// if we're in a parenthetical expression, we need to figure
				// out if it's attached to a pseduo-selector rule like
				// :nth-child(1)
				if(cc == ")"){
					if(inPseudo >= 0){
						_cp.value = ts(inParens+1, x);
					}
					inPseudo = inParens = -1;
				}
			}else if(cc == "#"){
				// start of an ID match
				endAll();
				inId = x+1;
			}else if(cc == "."){
				// start of a class match
				endAll();
				inClass = x;
			}else if(cc == ":"){
				// start of a pseudo-selector match
				endAll();
				inPseudo = x;
			}else if(cc == "["){
				// start of an attribute match. 
				endAll();
				inBrackets = x;
				// provide a new structure for the attribute match to fill-in
				_cp = {
					/*=====
					attr: null, type: null, matchFor: null
					=====*/
				};
			}else if(cc == "("){
				// we really only care if we've entered a parenthetical
				// expression if we're already inside a pseudo-selector match
				if(inPseudo >= 0){
					// provide a new structure for the pseudo match to fill-in
					_cp = { 
						name: ts(inPseudo+1, x), 
						value: null
					}
					currentPart.pseudos.push(_cp);
				}
				inParens = x;
			}else if(
				(cc == " ") && 
				// if it's a space char and the last char is too, consume the
				// current one without doing more work
				(lc != cc)
			){
				endPart();
			}
		}
		return queryParts;
	};
	

	////////////////////////////////////////////////////////////////////////
	// DOM query infrastructure
	////////////////////////////////////////////////////////////////////////

	var agree = function(first, second){
		// the basic building block of the yes/no chaining system. agree(f1,
		// f2) generates a new function which returns the boolean results of
		// both of the passed functions to a single logical-anded result. If
		// either are not possed, the other is used exclusively.
		if(!first){ return second; }
		if(!second){ return first; }

		return function(){
			return first.apply(window, arguments) && second.apply(window, arguments);
		}
	};

	var getArr = function(i, arr){
		// helps us avoid array alloc when we don't need it
		var r = arr||[]; // FIXME: should this be 'new d._NodeListCtor()' ?
		if(i){ r.push(i); }
		return r;
	};

	var _isElement = function(n){ return (1 == n.nodeType); };

	// FIXME: need to coalesce _getAttr with defaultGetter
	var blank = "";
	var _getAttr = function(elem, attr){
		if(!elem){ return blank; }
		if(attr == "class"){
			return elem.className || blank;
		}
		if(attr == "for"){
			return elem.htmlFor || blank;
		}
		if(attr == "style"){
			return elem.style.cssText || blank;
		}
		return (caseSensitive ? elem.getAttribute(attr) : elem.getAttribute(attr, 2)) || blank;
	};

	var attrs = {
		"*=": function(attr, value){
			return function(elem){
				// E[foo*="bar"]
				//		an E element whose "foo" attribute value contains
				//		the substring "bar"
				return (_getAttr(elem, attr).indexOf(value)>=0);
			}
		},
		"^=": function(attr, value){
			// E[foo^="bar"]
			//		an E element whose "foo" attribute value begins exactly
			//		with the string "bar"
			return function(elem){
				return (_getAttr(elem, attr).indexOf(value)==0);
			}
		},
		"$=": function(attr, value){
			// E[foo$="bar"]	
			//		an E element whose "foo" attribute value ends exactly
			//		with the string "bar"
			var tval = " "+value;
			return function(elem){
				var ea = " "+_getAttr(elem, attr);
				return (ea.lastIndexOf(value)==(ea.length-value.length));
			}
		},
		"~=": function(attr, value){
			// E[foo~="bar"]	
			//		an E element whose "foo" attribute value is a list of
			//		space-separated values, one of which is exactly equal
			//		to "bar"

			// return "[contains(concat(' ',@"+attr+",' '), ' "+ value +" ')]";
			var tval = " "+value+" ";
			return function(elem){
				var ea = " "+_getAttr(elem, attr)+" ";
				return (ea.indexOf(tval)>=0);
			}
		},
		"|=": function(attr, value){
			// E[hreflang|="en"]
			//		an E element whose "hreflang" attribute has a
			//		hyphen-separated list of values beginning (from the
			//		left) with "en"
			var valueDash = " "+value+"-";
			return function(elem){
				var ea = " "+_getAttr(elem, attr);
				return (
					(ea == value) ||
					(ea.indexOf(valueDash)==0)
				);
			}
		},
		"=": function(attr, value){
			return function(elem){
				return (_getAttr(elem, attr) == value);
			}
		}
	};

	// avoid testing for node type if we can. Defining this in the negative
	// here to avoid negation in the fast path.
	var _noNES = (typeof getDoc().firstChild.nextElementSibling == "undefined");
	var _ns = !_noNES ? "nextElementSibling" : "nextSibling";
	var _ps = !_noNES ? "previousElementSibling" : "previousSibling";
	var _simpleNodeTest = (_noNES ? _isElement : yesman);

	var _lookLeft = function(node){
		// look left
		while(node = node[_ps]){
			if(_simpleNodeTest(node)){ return false; }
		}
		return true;
	};

	var _lookRight = function(node){
		// look right
		while(node = node[_ns]){
			if(_simpleNodeTest(node)){ return false; }
		}
		return true;
	};

	var getNodeIndex = function(node){
		var root = node.parentNode;
		var i = 0,
			tret = root[childNodesName],
			ci = (node["_i"]||-1),
			cl = (root["_l"]||-1);

		if(!tret){ return -1; }
		var l = tret.length;

		// we calcuate the parent length as a cheap way to invalidate the
		// cache. It's not 100% accurate, but it's much more honest than what
		// other libraries do
		if( cl == l && ci >= 0 && cl >= 0 ){
			// if it's legit, tag and release
			return ci;
		}

		// else re-key things
		root["_l"] = l;
		ci = -1;
		for(var te = root["firstElementChild"]||root["firstChild"]; te; te = te[_ns]){
			if(_simpleNodeTest(te)){ 
				te["_i"] = ++i;
				if(node === te){ 
					// NOTE:
					// 	shortcuting the return at this step in indexing works
					// 	very well for benchmarking but we avoid it here since
					// 	it leads to potential O(n^2) behavior in sequential
					// 	getNodexIndex operations on a previously un-indexed
					// 	parent. We may revisit this at a later time, but for
					// 	now we just want to get the right answer more often
					// 	than not.
					ci = i;
				}
			}
		}
		return ci;
	};

	var isEven = function(elem){
		return !((getNodeIndex(elem)) % 2);
	};

	var isOdd = function(elem){
		return ((getNodeIndex(elem)) % 2);
	};

	var pseudos = {
		"checked": function(name, condition){
			return function(elem){
				return !!("checked" in elem ? elem.checked : elem.selected);
			}
		},
		"first-child": function(){ return _lookLeft; },
		"last-child": function(){ return _lookRight; },
		"only-child": function(name, condition){
			return function(node){ 
				if(!_lookLeft(node)){ return false; }
				if(!_lookRight(node)){ return false; }
				return true;
			};
		},
		"empty": function(name, condition){
			return function(elem){
				// DomQuery and jQuery get this wrong, oddly enough.
				// The CSS 3 selectors spec is pretty explicit about it, too.
				var cn = elem.childNodes;
				var cnl = elem.childNodes.length;
				// if(!cnl){ return true; }
				for(var x=cnl-1; x >= 0; x--){
					var nt = cn[x].nodeType;
					if((nt === 1)||(nt == 3)){ return false; }
				}
				return true;
			}
		},
		"contains": function(name, condition){
			var cz = condition.charAt(0);
			if( cz == '"' || cz == "'" ){ //remove quote
				condition = condition.slice(1, -1);
			}
			return function(elem){
				return (elem.innerHTML.indexOf(condition) >= 0);
			}
		},
		"not": function(name, condition){
			var p = getQueryParts(condition)[0];
			var ignores = { el: 1 }; 
			if(p.tag != "*"){
				ignores.tag = 1;
			}
			if(!p.classes.length){
				ignores.classes = 1;
			}
			var ntf = getSimpleFilterFunc(p, ignores);
			return function(elem){
				return (!ntf(elem));
			}
		},
		"nth-child": function(name, condition){
			var pi = parseInt;
			// avoid re-defining function objects if we can
			if(condition == "odd"){
				return isOdd;
			}else if(condition == "even"){
				return isEven;
			}
			// FIXME: can we shorten this?
			if(condition.indexOf("n") != -1){
				var tparts = condition.split("n", 2);
				var pred = tparts[0] ? ((tparts[0] == '-') ? -1 : pi(tparts[0])) : 1;
				var idx = tparts[1] ? pi(tparts[1]) : 0;
				var lb = 0, ub = -1;
				if(pred > 0){
					if(idx < 0){
						idx = (idx % pred) && (pred + (idx % pred));
					}else if(idx>0){
						if(idx >= pred){
							lb = idx - idx % pred;
						}
						idx = idx % pred;
					}
				}else if(pred<0){
					pred *= -1;
					// idx has to be greater than 0 when pred is negative;
					// shall we throw an error here?
					if(idx > 0){
						ub = idx;
						idx = idx % pred;
					}
				}
				if(pred > 0){
					return function(elem){
						var i = getNodeIndex(elem);
						return (i>=lb) && (ub<0 || i<=ub) && ((i % pred) == idx);
					}
				}else{
					condition = idx;
				}
			}
			var ncount = pi(condition);
			return function(elem){
				return (getNodeIndex(elem) == ncount);
			}
		}
	};

	var defaultGetter = (d.isIE) ? function(cond){
		var clc = cond.toLowerCase();
		if(clc == "class"){ cond = "className"; }
		return function(elem){
			return (caseSensitive ? elem.getAttribute(cond) : elem[cond]||elem[clc]);
		}
	} : function(cond){
		return function(elem){
			return (elem && elem.getAttribute && elem.hasAttribute(cond));
		}
	};

	var getSimpleFilterFunc = function(query, ignores){
		// generates a node tester function based on the passed query part. The
		// query part is one of the structures generatd by the query parser
		// when it creates the query AST. The "ignores" object specifies which
		// (if any) tests to skip, allowing the system to avoid duplicating
		// work where it may have already been taken into account by other
		// factors such as how the nodes to test were fetched in the first
		// place
		if(!query){ return yesman; }
		ignores = ignores||{};

		var ff = null;

		if(!("el" in ignores)){
			ff = agree(ff, _isElement);
		}

		if(!("tag" in ignores)){
			if(query.tag != "*"){
				ff = agree(ff, function(elem){
					return (elem && (elem.tagName == query.getTag()));
				});
			}
		}

		if(!("classes" in ignores)){
			each(query.classes, function(cname, idx, arr){
				// get the class name
				/*
				var isWildcard = cname.charAt(cname.length-1) == "*";
				if(isWildcard){
					cname = cname.substr(0, cname.length-1);
				}
				// I dislike the regex thing, even if memozied in a cache, but it's VERY short
				var re = new RegExp("(?:^|\\s)" + cname + (isWildcard ? ".*" : "") + "(?:\\s|$)");
				*/
				var re = new RegExp("(?:^|\\s)" + cname + "(?:\\s|$)");
				ff = agree(ff, function(elem){
					return re.test(elem.className);
				});
				ff.count = idx;
			});
		}

		if(!("pseudos" in ignores)){
			each(query.pseudos, function(pseudo){
				var pn = pseudo.name;
				if(pseudos[pn]){
					ff = agree(ff, pseudos[pn](pn, pseudo.value));
				}
			});
		}

		if(!("attrs" in ignores)){
			each(query.attrs, function(attr){
				var matcher;
				var a = attr.attr;
				// type, attr, matchFor
				if(attr.type && attrs[attr.type]){
					matcher = attrs[attr.type](a, attr.matchFor);
				}else if(a.length){
					matcher = defaultGetter(a);
				}
				if(matcher){
					ff = agree(ff, matcher);
				}
			});
		}

		if(!("id" in ignores)){
			if(query.id){
				ff = agree(ff, function(elem){ 
					return (!!elem && (elem.id == query.id));
				});
			}
		}

		if(!ff){
			if(!("default" in ignores)){
				ff = yesman; 
			}
		}
		return ff;
	};

	var _nextSibling = function(filterFunc){
		return function(node, ret, bag){
			while(node = node[_ns]){
				if(_noNES && (!_isElement(node))){ continue; }
				if(
					(!bag || _isUnique(node, bag)) &&
					filterFunc(node)
				){
					ret.push(node);
				}
				break;
			}
			return ret;
		}
	};

	var _nextSiblings = function(filterFunc){
		return function(root, ret, bag){
			var te = root[_ns];
			while(te){
				if(_simpleNodeTest(te)){
					if(bag && !_isUnique(te, bag)){
						break;
					}
					if(filterFunc(te)){
						ret.push(te);
					}
				}
				te = te[_ns];
			}
			return ret;
		}
	};

	// get an array of child *elements*, skipping text and comment nodes
	var _childElements = function(filterFunc){
		filterFunc = filterFunc||yesman;
		return function(root, ret, bag){
			// get an array of child elements, skipping text and comment nodes
			var te, x = 0, tret = root[childNodesName];
			while(te = tret[x++]){
				if(
					_simpleNodeTest(te) &&
					(!bag || _isUnique(te, bag)) &&
					(filterFunc(te, x))
				){ 
					ret.push(te);
				}
			}
			return ret;
		};
	};
	
	/*
	// thanks, Dean!
	var itemIsAfterRoot = d.isIE ? function(item, root){
		return (item.sourceIndex > root.sourceIndex);
	} : function(item, root){
		return (item.compareDocumentPosition(root) == 2);
	};
	*/

	// test to see if node is below root
	var _isDescendant = function(node, root){
		var pn = node.parentNode;
		while(pn){
			if(pn == root){
				break;
			}
			pn = pn.parentNode;
		}
		return !!pn;
	};

	var _getElementsFuncCache = {};

	var getElementsFunc = function(query){
		var retFunc = _getElementsFuncCache[query.query];
		// if we've got a cached dispatcher, just use that
		if(retFunc){ return retFunc; }
		// else, generate a new on

		// NOTE:
		//		this function returns a function that searches for nodes and
		//		filters them.  The search may be specialized by infix operators
		//		(">", "~", or "+") else it will default to searching all
		//		descendants (the " " selector). Once a group of children is
		//		founde, a test function is applied to weed out the ones we
		//		don't want. Many common cases can be fast-pathed. We spend a
		//		lot of cycles to create a dispatcher that doesn't do more work
		//		than necessary at any point since, unlike this function, the
		//		dispatchers will be called every time. The logic of generating
		//		efficient dispatchers looks like this in pseudo code:
		//
		//		# if it's a purely descendant query (no ">", "+", or "~" modifiers)
		//		if infixOperator == " ":
		//			if only(id):
		//				return def(root):
		//					return d.byId(id, root);
		//
		//			elif id:
		//				return def(root):
		//					return filter(d.byId(id, root));
		//
		//			elif cssClass && getElementsByClassName:
		//				return def(root):
		//					return filter(root.getElementsByClassName(cssClass));
		//
		//			elif only(tag):
		//				return def(root):
		//					return root.getElementsByTagName(tagName);
		//
		//			else:
		//				# search by tag name, then filter
		//				return def(root):
		//					return filter(root.getElementsByTagName(tagName||"*"));
		//
		//		elif infixOperator == ">":
		//			# search direct children
		//			return def(root):
		//				return filter(root.children);
		//
		//		elif infixOperator == "+":
		//			# search next sibling
		//			return def(root):
		//				return filter(root.nextElementSibling);
		//
		//		elif infixOperator == "~":
		//			# search rightward siblings
		//			return def(root):
		//				return filter(nextSiblings(root));

		var io = query.infixOper;
		var oper = (io ? io.oper : "");
		// the default filter func which tests for all conditions in the query
		// part. This is potentially inefficient, so some optimized paths may
		// re-define it to test fewer things.
		var filterFunc = getSimpleFilterFunc(query, { el: 1 });
		var qt = query.tag;
		var wildcardTag = ("*" == qt);
		var ecs = getDoc()["getElementsByClassName"]; 

		if(!oper){
			// if there's no infix operator, then it's a descendant query. ID
			// and "elements by class name" variants can be accelerated so we
			// call them out explicitly:
			if(query.id){
				// testing shows that the overhead of yesman() is acceptable
				// and can save us some bytes vs. re-defining the function
				// everywhere.
				filterFunc = (!query.loops && wildcardTag) ? 
					yesman : 
					getSimpleFilterFunc(query, { el: 1, id: 1 });

				retFunc = function(root, arr){
					var te = d.byId(query.id, (root.ownerDocument||root));
					if(!te || !filterFunc(te)){ return; }
					if(9 == root.nodeType){ // if root's a doc, we just return directly
						return getArr(te, arr);
					}else{ // otherwise check ancestry
						if(_isDescendant(te, root)){
							return getArr(te, arr);
						}
					}
				}
			}else if(
				ecs && 
				// isAlien check. Workaround for Prototype.js being totally evil/dumb.
				/\{\s*\[native code\]\s*\}/.test(String(ecs)) && 
				query.classes.length &&
				!cssCaseBug
			){
				// it's a class-based query and we've got a fast way to run it.

				// ignore class and ID filters since we will have handled both
				filterFunc = getSimpleFilterFunc(query, { el: 1, classes: 1, id: 1 });
				var classesString = query.classes.join(" ");
				retFunc = function(root, arr, bag){
					var ret = getArr(0, arr), te, x=0;
					var tret = root.getElementsByClassName(classesString);
					while((te = tret[x++])){
						if(filterFunc(te, root) && _isUnique(te, bag)){
							ret.push(te);
						}
					}
					return ret;
				};

			}else if(!wildcardTag && !query.loops){
				// it's tag only. Fast-path it.
				retFunc = function(root, arr, bag){
					var ret = getArr(0, arr), te, x=0;
					var tret = root.getElementsByTagName(query.getTag());
					while((te = tret[x++])){
						if(_isUnique(te, bag)){
							ret.push(te);
						}
					}
					return ret;
				};
			}else{
				// the common case:
				//		a descendant selector without a fast path. By now it's got
				//		to have a tag selector, even if it's just "*" so we query
				//		by that and filter
				filterFunc = getSimpleFilterFunc(query, { el: 1, tag: 1, id: 1 });
				retFunc = function(root, arr, bag){
					var ret = getArr(0, arr), te, x=0;
					// we use getTag() to avoid case sensitivity issues
					var tret = root.getElementsByTagName(query.getTag());
					while((te = tret[x++])){
						if(filterFunc(te, root) && _isUnique(te, bag)){
							ret.push(te);
						}
					}
					return ret;
				};
			}
		}else{
			// the query is scoped in some way. Instead of querying by tag we
			// use some other collection to find candidate nodes
			var skipFilters = { el: 1 };
			if(wildcardTag){
				skipFilters.tag = 1;
			}
			filterFunc = getSimpleFilterFunc(query, skipFilters);
			if("+" == oper){
				retFunc = _nextSibling(filterFunc);
			}else if("~" == oper){
				retFunc = _nextSiblings(filterFunc);
			}else if(">" == oper){
				retFunc = _childElements(filterFunc);
			}
		}
		// cache it and return
		return _getElementsFuncCache[query.query] = retFunc;
	};

	var filterDown = function(root, queryParts){
		// NOTE:
		//		this is the guts of the DOM query system. It takes a list of
		//		parsed query parts and a root and finds children which match
		//		the selector represented by the parts
		var candidates = getArr(root), qp, x, te, qpl = queryParts.length, bag, ret;

		for(var i = 0; i < qpl; i++){
			ret = [];
			qp = queryParts[i];
			x = candidates.length - 1;
			if(x > 0){
				// if we have more than one root at this level, provide a new
				// hash to use for checking group membership but tell the
				// system not to post-filter us since we will already have been
				// gauranteed to be unique
				bag = {};
				ret.nozip = true;
			}
			var gef = getElementsFunc(qp);
			for(var j = 0; (te = candidates[j]); j++){
				// for every root, get the elements that match the descendant
				// selector, adding them to the "ret" array and filtering them
				// via membership in this level's bag. If there are more query
				// parts, then this level's return will be used as the next
				// level's candidates
				gef(te, ret, bag);
			}
			if(!ret.length){ break; }
			candidates = ret;
		}
		return ret;
	};

	////////////////////////////////////////////////////////////////////////
	// the query runner
	////////////////////////////////////////////////////////////////////////

	// these are the primary caches for full-query results. The query
	// dispatcher functions are generated then stored here for hash lookup in
	// the future
	var _queryFuncCacheDOM = {},
		_queryFuncCacheQSA = {};

	// this is the second level of spliting, from full-length queries (e.g.,
	// "div.foo .bar") into simple query expressions (e.g., ["div.foo",
	// ".bar"])
	var getStepQueryFunc = function(query){
		var qparts = getQueryParts(trim(query));

		// if it's trivial, avoid iteration and zipping costs
		if(qparts.length == 1){
			// we optimize this case here to prevent dispatch further down the
			// chain, potentially slowing things down. We could more elegantly
			// handle this in filterDown(), but it's slower for simple things
			// that need to be fast (e.g., "#someId").
			var tef = getElementsFunc(qparts[0]);
			return function(root){
				var r = tef(root, new qlc());
				if(r){ r.nozip = true; }
				return r;
			}
		}

		// otherwise, break it up and return a runner that iterates over the parts recursively
		return function(root){
			return filterDown(root, qparts);
		}
	};

	// NOTES:
	//	* we can't trust QSA for anything but document-rooted queries, so
	//	  caching is split into DOM query evaluators and QSA query evaluators
	//	* caching query results is dirty and leak-prone (or, at a minimum,
	//	  prone to unbounded growth). Other toolkits may go this route, but
	//	  they totally destroy their own ability to manage their memory
	//	  footprint. If we implement it, it should only ever be with a fixed
	//	  total element reference # limit and an LRU-style algorithm since JS
	//	  has no weakref support. Caching compiled query evaluators is also
	//	  potentially problematic, but even on large documents the size of the
	//	  query evaluators is often < 100 function objects per evaluator (and
	//	  LRU can be applied if it's ever shown to be an issue).
	//	* since IE's QSA support is currently only for HTML documents and even
	//	  then only in IE 8's "standards mode", we have to detect our dispatch
	//	  route at query time and keep 2 separate caches. Ugg.

	// we need to determine if we think we can run a given query via
	// querySelectorAll or if we'll need to fall back on DOM queries to get
	// there. We need a lot of information about the environment and the query
	// to make the determiniation (e.g. does it support QSA, does the query in
	// question work in the native QSA impl, etc.).
	var nua = navigator.userAgent;
	// some versions of Safari provided QSA, but it was buggy and crash-prone.
	// We need te detect the right "internal" webkit version to make this work.
	var wk = "WebKit/";
	var is525 = (
		d.isWebKit && 
		(nua.indexOf(wk) > 0) && 
		(parseFloat(nua.split(wk)[1]) > 528)
	);

	// IE QSA queries may incorrectly include comment nodes, so we throw the
	// zipping function into "remove" comments mode instead of the normal "skip
	// it" which every other QSA-clued browser enjoys
	var noZip = d.isIE ? "commentStrip" : "nozip";

	var qsa = "querySelectorAll";
	var qsaAvail = (
		!!getDoc()[qsa] && 
		// see #5832
		(!d.isSafari || (d.isSafari > 3.1) || is525 )
	);

	//Don't bother with n+3 type of matches, IE complains if we modify those.
	var infixSpaceRe = /n\+\d|([^ ])?([>~+])([^ =])?/g;
	var infixSpaceFunc = function(match, pre, ch, post) {
		return ch ? (pre ? pre + " " : "") + ch + (post ? " " + post : "") : /*n+3*/ match;
	};

	var getQueryFunc = function(query, forceDOM){
		//Normalize query. The CSS3 selectors spec allows for omitting spaces around
		//infix operators, >, ~ and +
		//Do the work here since detection for spaces is used as a simple "not use QSA"
		//test below.
		query = query.replace(infixSpaceRe, infixSpaceFunc);

		if(qsaAvail){
			// if we've got a cached variant and we think we can do it, run it!
			var qsaCached = _queryFuncCacheQSA[query];
			if(qsaCached && !forceDOM){ return qsaCached; }
		}

		// else if we've got a DOM cached variant, assume that we already know
		// all we need to and use it
		var domCached = _queryFuncCacheDOM[query];
		if(domCached){ return domCached; }

		// TODO: 
		//		today we're caching DOM and QSA branches separately so we
		//		recalc useQSA every time. If we had a way to tag root+query
		//		efficiently, we'd be in good shape to do a global cache.

		var qcz = query.charAt(0);
		var nospace = (-1 == query.indexOf(" "));

		// byId searches are wicked fast compared to QSA, even when filtering
		// is required
		if( (query.indexOf("#") >= 0) && (nospace) ){
			forceDOM = true;
		}

		var useQSA = ( 
			qsaAvail && (!forceDOM) &&
			// as per CSS 3, we can't currently start w/ combinator:
			//		http://www.w3.org/TR/css3-selectors/#w3cselgrammar
			(specials.indexOf(qcz) == -1) && 
			// IE's QSA impl sucks on pseudos
			(!d.isIE || (query.indexOf(":") == -1)) &&

			(!(cssCaseBug && (query.indexOf(".") >= 0))) &&

			// FIXME:
			//		need to tighten up browser rules on ":contains" and "|=" to
			//		figure out which aren't good
			//		Latest webkit (around 531.21.8) does not seem to do well with :checked on option
			//		elements, even though according to spec, selected options should
			//		match :checked. So go nonQSA for it:
			//		http://bugs.dojotoolkit.org/ticket/5179
			(query.indexOf(":contains") == -1) && (query.indexOf(":checked") == -1) && 
			(query.indexOf("|=") == -1) // some browsers don't grok it
		);

		// TODO: 
		//		if we've got a descendant query (e.g., "> .thinger" instead of
		//		just ".thinger") in a QSA-able doc, but are passed a child as a
		//		root, it should be possible to give the item a synthetic ID and
		//		trivially rewrite the query to the form "#synid > .thinger" to
		//		use the QSA branch


		if(useQSA){
			var tq = (specials.indexOf(query.charAt(query.length-1)) >= 0) ? 
						(query + " *") : query;
			return _queryFuncCacheQSA[query] = function(root){
				try{
					// the QSA system contains an egregious spec bug which
					// limits us, effectively, to only running QSA queries over
					// entire documents.  See:
					//		http://ejohn.org/blog/thoughts-on-queryselectorall/
					//	despite this, we can also handle QSA runs on simple
					//	selectors, but we don't want detection to be expensive
					//	so we're just checking for the presence of a space char
					//	right now. Not elegant, but it's cheaper than running
					//	the query parser when we might not need to
					if(!((9 == root.nodeType) || nospace)){ throw ""; }
					var r = root[qsa](tq);
					// skip expensive duplication checks and just wrap in a NodeList
					r[noZip] = true;
					return r;
				}catch(e){
					// else run the DOM branch on this query, ensuring that we
					// default that way in the future
					return getQueryFunc(query, true)(root);
				}
			}
		}else{
			// DOM branch
			var parts = query.split(/\s*,\s*/);
			return _queryFuncCacheDOM[query] = ((parts.length < 2) ? 
				// if not a compound query (e.g., ".foo, .bar"), cache and return a dispatcher
				getStepQueryFunc(query) : 
				// if it *is* a complex query, break it up into its
				// constituent parts and return a dispatcher that will
				// merge the parts when run
				function(root){
					var pindex = 0, // avoid array alloc for every invocation
						ret = [],
						tp;
					while((tp = parts[pindex++])){
						ret = ret.concat(getStepQueryFunc(tp)(root));
					}
					return ret;
				}
			);
		}
	};

	var _zipIdx = 0;

	// NOTE:
	//		this function is Moo inspired, but our own impl to deal correctly
	//		with XML in IE
	var _nodeUID = d.isIE ? function(node){
		if(caseSensitive){
			// XML docs don't have uniqueID on their nodes
			return (node.getAttribute("_uid") || node.setAttribute("_uid", ++_zipIdx) || _zipIdx);

		}else{
			return node.uniqueID;
		}
	} : 
	function(node){
		return (node._uid || (node._uid = ++_zipIdx));
	};

	// determine if a node in is unique in a "bag". In this case we don't want
	// to flatten a list of unique items, but rather just tell if the item in
	// question is already in the bag. Normally we'd just use hash lookup to do
	// this for us but IE's DOM is busted so we can't really count on that. On
	// the upside, it gives us a built in unique ID function. 
	var _isUnique = function(node, bag){
		if(!bag){ return 1; }
		var id = _nodeUID(node);
		if(!bag[id]){ return bag[id] = 1; }
		return 0;
	};

	// attempt to efficiently determine if an item in a list is a dupe,
	// returning a list of "uniques", hopefully in doucment order
	var _zipIdxName = "_zipIdx";
	var _zip = function(arr){
		if(arr && arr.nozip){ 
			return (qlc._wrap) ? qlc._wrap(arr) : arr;
		}
		// var ret = new d._NodeListCtor();
		var ret = new qlc();
		if(!arr || !arr.length){ return ret; }
		if(arr[0]){
			ret.push(arr[0]);
		}
		if(arr.length < 2){ return ret; }

		_zipIdx++;
		
		// we have to fork here for IE and XML docs because we can't set
		// expandos on their nodes (apparently). *sigh*
		if(d.isIE && caseSensitive){
			var szidx = _zipIdx+"";
			arr[0].setAttribute(_zipIdxName, szidx);
			for(var x = 1, te; te = arr[x]; x++){
				if(arr[x].getAttribute(_zipIdxName) != szidx){ 
					ret.push(te);
				}
				te.setAttribute(_zipIdxName, szidx);
			}
		}else if(d.isIE && arr.commentStrip){
			try{
				for(var x = 1, te; te = arr[x]; x++){
					if(_isElement(te)){ 
						ret.push(te);
					}
				}
			}catch(e){ /* squelch */ }
		}else{
			if(arr[0]){ arr[0][_zipIdxName] = _zipIdx; }
			for(var x = 1, te; te = arr[x]; x++){
				if(arr[x][_zipIdxName] != _zipIdx){ 
					ret.push(te);
				}
				te[_zipIdxName] = _zipIdx;
			}
		}
		return ret;
	};

	// the main executor
	d.query = function(/*String*/ query, /*String|DOMNode?*/ root){
		//	summary:
		//		Returns nodes which match the given CSS3 selector, searching the
		//		entire document by default but optionally taking a node to scope
		//		the search by. Returns an instance of dojo.NodeList.
		//	description:
		//		dojo.query() is the swiss army knife of DOM node manipulation in
		//		Dojo. Much like Prototype's "$$" (bling-bling) function or JQuery's
		//		"$" function, dojo.query provides robust, high-performance
		//		CSS-based node selector support with the option of scoping searches
		//		to a particular sub-tree of a document.
		//
		//		Supported Selectors:
		//		--------------------
		//
		//		dojo.query() supports a rich set of CSS3 selectors, including:
		//
		//			* class selectors (e.g., `.foo`)
		//			* node type selectors like `span`
		//			* ` ` descendant selectors
		//			* `>` child element selectors 
		//			* `#foo` style ID selectors
		//			* `*` universal selector
		//			* `~`, the immediately preceeded-by sibling selector
		//			* `+`, the preceeded-by sibling selector
		//			* attribute queries:
		//			|	* `[foo]` attribute presence selector
		//			|	* `[foo='bar']` attribute value exact match
		//			|	* `[foo~='bar']` attribute value list item match
		//			|	* `[foo^='bar']` attribute start match
		//			|	* `[foo$='bar']` attribute end match
		//			|	* `[foo*='bar']` attribute substring match
		//			* `:first-child`, `:last-child`, and `:only-child` positional selectors
		//			* `:empty` content emtpy selector
		//			* `:checked` pseudo selector
		//			* `:nth-child(n)`, `:nth-child(2n+1)` style positional calculations
		//			* `:nth-child(even)`, `:nth-child(odd)` positional selectors
		//			* `:not(...)` negation pseudo selectors
		//
		//		Any legal combination of these selectors will work with
		//		`dojo.query()`, including compound selectors ("," delimited).
		//		Very complex and useful searches can be constructed with this
		//		palette of selectors and when combined with functions for
		//		manipulation presented by dojo.NodeList, many types of DOM
		//		manipulation operations become very straightforward.
		//		
		//		Unsupported Selectors:
		//		----------------------
		//
		//		While dojo.query handles many CSS3 selectors, some fall outside of
		//		what's resaonable for a programmatic node querying engine to
		//		handle. Currently unsupported selectors include:
		//		
		//			* namespace-differentiated selectors of any form
		//			* all `::` pseduo-element selectors
		//			* certain pseduo-selectors which don't get a lot of day-to-day use:
		//			|	* `:root`, `:lang()`, `:target`, `:focus`
		//			* all visual and state selectors:
		//			|	* `:root`, `:active`, `:hover`, `:visisted`, `:link`,
		//				  `:enabled`, `:disabled`
		//			* `:*-of-type` pseudo selectors
		//		
		//		dojo.query and XML Documents:
		//		-----------------------------
		//		
		//		`dojo.query` (as of dojo 1.2) supports searching XML documents
		//		in a case-sensitive manner. If an HTML document is served with
		//		a doctype that forces case-sensitivity (e.g., XHTML 1.1
		//		Strict), dojo.query() will detect this and "do the right
		//		thing". Case sensitivity is dependent upon the document being
		//		searched and not the query used. It is therefore possible to
		//		use case-sensitive queries on strict sub-documents (iframes,
		//		etc.) or XML documents while still assuming case-insensitivity
		//		for a host/root document.
		//
		//		Non-selector Queries:
		//		---------------------
		//
		//		If something other than a String is passed for the query,
		//		`dojo.query` will return a new `dojo.NodeList` instance
		//		constructed from that parameter alone and all further
		//		processing will stop. This means that if you have a reference
		//		to a node or NodeList, you can quickly construct a new NodeList
		//		from the original by calling `dojo.query(node)` or
		//		`dojo.query(list)`.
		//
		//	query:
		//		The CSS3 expression to match against. For details on the syntax of
		//		CSS3 selectors, see <http://www.w3.org/TR/css3-selectors/#selectors>
		//	root:
		//		A DOMNode (or node id) to scope the search from. Optional.
		//	returns: dojo.NodeList
		//		An instance of `dojo.NodeList`. Many methods are available on
		//		NodeLists for searching, iterating, manipulating, and handling
		//		events on the matched nodes in the returned list.
		//	example:
		//		search the entire document for elements with the class "foo":
		//	|	dojo.query(".foo");
		//		these elements will match:
		//	|	<span class="foo"></span>
		//	|	<span class="foo bar"></span>
		//	|	<p class="thud foo"></p>
		//	example:
		//		search the entire document for elements with the classes "foo" *and* "bar":
		//	|	dojo.query(".foo.bar");
		//		these elements will match:
		//	|	<span class="foo bar"></span>
		//		while these will not:
		//	|	<span class="foo"></span>
		//	|	<p class="thud foo"></p>
		//	example:
		//		find `<span>` elements which are descendants of paragraphs and
		//		which have a "highlighted" class:
		//	|	dojo.query("p span.highlighted");
		//		the innermost span in this fragment matches:
		//	|	<p class="foo">
		//	|		<span>...
		//	|			<span class="highlighted foo bar">...</span>
		//	|		</span>
		//	|	</p>
		//	example:
		//		set an "odd" class on all odd table rows inside of the table
		//		`#tabular_data`, using the `>` (direct child) selector to avoid
		//		affecting any nested tables:
		//	|	dojo.query("#tabular_data > tbody > tr:nth-child(odd)").addClass("odd");
		//	example:
		//		remove all elements with the class "error" from the document
		//		and store them in a list:
		//	|	var errors = dojo.query(".error").orphan();
		//	example:
		//		add an onclick handler to every submit button in the document
		//		which causes the form to be sent via Ajax instead:
		//	|	dojo.query("input[type='submit']").onclick(function(e){
		//	|		dojo.stopEvent(e); // prevent sending the form
		//	|		var btn = e.target;
		//	|		dojo.xhrPost({
		//	|			form: btn.form,
		//	|			load: function(data){
		//	|				// replace the form with the response
		//	|				var div = dojo.doc.createElement("div");
		//	|				dojo.place(div, btn.form, "after");
		//	|				div.innerHTML = data;
		//	|				dojo.style(btn.form, "display", "none");
		//	|			}
		//	|		});
		//	|	});

		//Set list constructor to desired value. This can change
		//between calls, so always re-assign here.
		qlc = d._NodeListCtor;

		if(!query){
			return new qlc();
		}

		if(query.constructor == qlc){
			return query;
		}
		if(typeof query != "string"){ // inline'd type check
			return new qlc(query); // dojo.NodeList
		}
		if(typeof root == "string"){ // inline'd type check
			root = d.byId(root);
			if(!root){ return new qlc(); }
		}

		root = root||getDoc();
		var od = root.ownerDocument||root.documentElement;

		// throw the big case sensitivity switch

		// NOTE:
		// 		Opera in XHTML mode doesn't detect case-sensitivity correctly
		// 		and it's not clear that there's any way to test for it
		caseSensitive = (root.contentType && root.contentType=="application/xml") || 
						(d.isOpera && (root.doctype || od.toString() == "[object XMLDocument]")) ||
						(!!od) && 
						(d.isIE ? od.xml : (root.xmlVersion||od.xmlVersion));

		// NOTE: 
		//		adding "true" as the 2nd argument to getQueryFunc is useful for
		//		testing the DOM branch without worrying about the
		//		behavior/performance of the QSA branch.
		var r = getQueryFunc(query)(root);

		// FIXME:
		//		need to investigate this branch WRT #8074 and #8075
		if(r && r.nozip && !qlc._wrap){
			return r;
		}
		return _zip(r); // dojo.NodeList
	}

	// FIXME: need to add infrastructure for post-filtering pseudos, ala :last
	d.query.pseudos = pseudos;

	// one-off function for filtering a NodeList based on a simple selector
	d._filterQueryResult = function(nodeList, simpleFilter){
		var tmpNodeList = new d._NodeListCtor();
		var filterFunc = getSimpleFilterFunc(getQueryParts(simpleFilter)[0]);
		for(var x = 0, te; te = nodeList[x]; x++){
			if(filterFunc(te)){ tmpNodeList.push(te); }
		}
		return tmpNodeList;
	}
})(this["queryPortability"]||this["acme"]||dojo);

/*
*/

}

if(!dojo._hasResource["dojo._base.xhr"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.xhr"] = true;
dojo.provide("dojo._base.xhr");





(function(){
	var _d = dojo, cfg = _d.config;

	function setValue(/*Object*/obj, /*String*/name, /*String*/value){
		//summary:
		//		For the named property in object, set the value. If a value
		//		already exists and it is a string, convert the value to be an
		//		array of values.

		//Skip it if there is no value
		if(value === null){
			return;
		}

		var val = obj[name];
		if(typeof val == "string"){ // inline'd type check
			obj[name] = [val, value];
		}else if(_d.isArray(val)){
			val.push(value);
		}else{
			obj[name] = value;
		}
	}
	
	dojo.fieldToObject = function(/*DOMNode||String*/ inputNode){
		// summary:
		//		Serialize a form field to a JavaScript object.
		//
		// description:
		//		Returns the value encoded in a form field as
		//		as a string or an array of strings. Disabled form elements
		//		and unchecked radio and checkboxes are skipped.	Multi-select
		//		elements are returned as an array of string values.
		var ret = null;
		var item = _d.byId(inputNode);
		if(item){
			var _in = item.name;
			var type = (item.type||"").toLowerCase();
			if(_in && type && !item.disabled){
				if(type == "radio" || type == "checkbox"){
					if(item.checked){ ret = item.value }
				}else if(item.multiple){
					ret = [];
					_d.query("option", item).forEach(function(opt){
						if(opt.selected){
							ret.push(opt.value);
						}
					});
				}else{
					ret = item.value;
				}
			}
		}
		return ret; // Object
	}

	dojo.formToObject = function(/*DOMNode||String*/ formNode){
		// summary:
		//		Serialize a form node to a JavaScript object.
		// description:
		//		Returns the values encoded in an HTML form as
		//		string properties in an object which it then returns. Disabled form
		//		elements, buttons, and other non-value form elements are skipped.
		//		Multi-select elements are returned as an array of string values.
		//
		// example:
		//		This form:
		//		|	<form id="test_form">
		//		|		<input type="text" name="blah" value="blah">
		//		|		<input type="text" name="no_value" value="blah" disabled>
		//		|		<input type="button" name="no_value2" value="blah">
		//		|		<select type="select" multiple name="multi" size="5">
		//		|			<option value="blah">blah</option>
		//		|			<option value="thud" selected>thud</option>
		//		|			<option value="thonk" selected>thonk</option>
		//		|		</select>
		//		|	</form>
		//
		//		yields this object structure as the result of a call to
		//		formToObject():
		//
		//		|	{ 
		//		|		blah: "blah",
		//		|		multi: [
		//		|			"thud",
		//		|			"thonk"
		//		|		]
		//		|	};

		var ret = {};
		var exclude = "file|submit|image|reset|button|";
		_d.forEach(dojo.byId(formNode).elements, function(item){
			var _in = item.name;
			var type = (item.type||"").toLowerCase();
			if(_in && type && exclude.indexOf(type) == -1 && !item.disabled){
				setValue(ret, _in, _d.fieldToObject(item));
				if(type == "image"){
					ret[_in+".x"] = ret[_in+".y"] = ret[_in].x = ret[_in].y = 0;
				}
			}
		});
		return ret; // Object
	}

	dojo.objectToQuery = function(/*Object*/ map){
		//	summary:
		//		takes a name/value mapping object and returns a string representing
		//		a URL-encoded version of that object.
		//	example:
		//		this object:
		//
		//		|	{ 
		//		|		blah: "blah",
		//		|		multi: [
		//		|			"thud",
		//		|			"thonk"
		//		|		]
		//		|	};
		//
		//	yields the following query string:
		//	
		//	|	"blah=blah&multi=thud&multi=thonk"

		// FIXME: need to implement encodeAscii!!
		var enc = encodeURIComponent;
		var pairs = [];
		var backstop = {};
		for(var name in map){
			var value = map[name];
			if(value != backstop[name]){
				var assign = enc(name) + "=";
				if(_d.isArray(value)){
					for(var i=0; i < value.length; i++){
						pairs.push(assign + enc(value[i]));
					}
				}else{
					pairs.push(assign + enc(value));
				}
			}
		}
		return pairs.join("&"); // String
	}

	dojo.formToQuery = function(/*DOMNode||String*/ formNode){
		// summary:
		//		Returns a URL-encoded string representing the form passed as either a
		//		node or string ID identifying the form to serialize
		return _d.objectToQuery(_d.formToObject(formNode)); // String
	}

	dojo.formToJson = function(/*DOMNode||String*/ formNode, /*Boolean?*/prettyPrint){
		// summary:
		//		Create a serialized JSON string from a form node or string
		//		ID identifying the form to serialize
		return _d.toJson(_d.formToObject(formNode), prettyPrint); // String
	}

	dojo.queryToObject = function(/*String*/ str){
		// summary:
		//		Create an object representing a de-serialized query section of a
		//		URL. Query keys with multiple values are returned in an array.
		//
		// example:
		//		This string:
		//
		//	|		"foo=bar&foo=baz&thinger=%20spaces%20=blah&zonk=blarg&"
		//		
		//		results in this object structure:
		//
		//	|		{
		//	|			foo: [ "bar", "baz" ],
		//	|			thinger: " spaces =blah",
		//	|			zonk: "blarg"
		//	|		}
		//	
		//		Note that spaces and other urlencoded entities are correctly
		//		handled.

		// FIXME: should we grab the URL string if we're not passed one?
		var ret = {};
		var qp = str.split("&");
		var dec = decodeURIComponent;
		_d.forEach(qp, function(item){
			if(item.length){
				var parts = item.split("=");
				var name = dec(parts.shift());
				var val = dec(parts.join("="));
				if(typeof ret[name] == "string"){ // inline'd type check
					ret[name] = [ret[name]];
				}

				if(_d.isArray(ret[name])){
					ret[name].push(val);
				}else{
					ret[name] = val;
				}
			}
		});
		return ret; // Object
	}

	// need to block async callbacks from snatching this thread as the result
	// of an async callback might call another sync XHR, this hangs khtml forever
	// must checked by watchInFlight()

	dojo._blockAsync = false;

	// MOW: remove dojo._contentHandlers alias in 2.0
	var handlers = _d._contentHandlers = dojo.contentHandlers = {
		// summary: 
		//		A map of availble XHR transport handle types. Name matches the
		//		`handleAs` attribute passed to XHR calls.
		//
		// description:
		//		A map of availble XHR transport handle types. Name matches the
		//		`handleAs` attribute passed to XHR calls. Each contentHandler is
		//		called, passing the xhr object for manipulation. The return value
		//		from the contentHandler will be passed to the `load` or `handle` 
		//		functions defined in the original xhr call. 
		//		
		// example:
		//		Creating a custom content-handler:
		//	|	dojo.contentHandlers.makeCaps = function(xhr){
		//	|		return xhr.responseText.toUpperCase();
		//	|	}
		//	|	// and later:
		//	|	dojo.xhrGet({ 
		//	|		url:"foo.txt",
		//	|		handleAs:"makeCaps",
		//	|		load: function(data){ /* data is a toUpper version of foo.txt */ }
		//	|	});

		text: function(xhr){ 
			// summary: A contentHandler which simply returns the plaintext response data
			return xhr.responseText; 
		},
		json: function(xhr){
			// summary: A contentHandler which returns a JavaScript object created from the response data
			return _d.fromJson(xhr.responseText || null);
		},
		"json-comment-filtered": function(xhr){ 
			// summary: A contentHandler which expects comment-filtered JSON. 
			// description: 
			//		A contentHandler which expects comment-filtered JSON. 
			//		the json-comment-filtered option was implemented to prevent
			//		"JavaScript Hijacking", but it is less secure than standard JSON. Use
			//		standard JSON instead. JSON prefixing can be used to subvert hijacking.
			//		
			//		Will throw a notice suggesting to use application/json mimetype, as
			//		json-commenting can introduce security issues. To decrease the chances of hijacking,
			//		use the standard `json` contentHandler, and prefix your "JSON" with: {}&& 
			//		
			//		use djConfig.useCommentedJson = true to turn off the notice
			if(!dojo.config.useCommentedJson){
				console.warn("Consider using the standard mimetype:application/json."
					+ " json-commenting can introduce security issues. To"
					+ " decrease the chances of hijacking, use the standard the 'json' handler and"
					+ " prefix your json with: {}&&\n"
					+ "Use djConfig.useCommentedJson=true to turn off this message.");
			}

			var value = xhr.responseText;
			var cStartIdx = value.indexOf("\/*");
			var cEndIdx = value.lastIndexOf("*\/");
			if(cStartIdx == -1 || cEndIdx == -1){
				throw new Error("JSON was not comment filtered");
			}
			return _d.fromJson(value.substring(cStartIdx+2, cEndIdx));
		},
		javascript: function(xhr){ 
			// summary: A contentHandler which evaluates the response data, expecting it to be valid JavaScript

			// FIXME: try Moz and IE specific eval variants?
			return _d.eval(xhr.responseText);
		},
		xml: function(xhr){
			// summary: A contentHandler returning an XML Document parsed from the response data
			var result = xhr.responseXML;
						if(_d.isIE && (!result || !result.documentElement)){
				//WARNING: this branch used by the xml handling in dojo.io.iframe,
				//so be sure to test dojo.io.iframe if making changes below.
				var ms = function(n){ return "MSXML" + n + ".DOMDocument"; }
				var dp = ["Microsoft.XMLDOM", ms(6), ms(4), ms(3), ms(2)];
				_d.some(dp, function(p){
					try{
						var dom = new ActiveXObject(p);
						dom.async = false;
						dom.loadXML(xhr.responseText);
						result = dom;
					}catch(e){ return false; }
					return true;
				});
			}
						return result; // DOMDocument
		},
		"json-comment-optional": function(xhr){
			// summary: A contentHandler which checks the presence of comment-filtered JSON and 
			//		alternates between the `json` and `json-comment-filtered` contentHandlers.
			if(xhr.responseText && /^[^{\[]*\/\*/.test(xhr.responseText)){
				return handlers["json-comment-filtered"](xhr);
			}else{
				return handlers["json"](xhr);
			}
		}
	};

	/*=====
	dojo.__IoArgs = function(){
		//	url: String
		//		URL to server endpoint.
		//	content: Object?
		//		Contains properties with string values. These
		//		properties will be serialized as name1=value2 and
		//		passed in the request.
		//	timeout: Integer?
		//		Milliseconds to wait for the response. If this time
		//		passes, the then error callbacks are called.
		//	form: DOMNode?
		//		DOM node for a form. Used to extract the form values
		//		and send to the server.
		//	preventCache: Boolean?
		//		Default is false. If true, then a
		//		"dojo.preventCache" parameter is sent in the request
		//		with a value that changes with each request
		//		(timestamp). Useful only with GET-type requests.
		//	handleAs: String?
		//		Acceptable values depend on the type of IO
		//		transport (see specific IO calls for more information).
		// 	rawBody: String?
		// 		Sets the raw body for an HTTP request. If this is used, then the content
		// 		property is ignored. This is mostly useful for HTTP methods that have
		// 		a body to their requests, like PUT or POST. This property can be used instead
		// 		of postData and putData for dojo.rawXhrPost and dojo.rawXhrPut respectively.
		//	ioPublish: Boolean?
		//		Set this explicitly to false to prevent publishing of topics related to
		// 		IO operations. Otherwise, if djConfig.ioPublish is set to true, topics
		// 		will be published via dojo.publish for different phases of an IO operation.
		// 		See dojo.__IoPublish for a list of topics that are published.
		//	load: Function?
		//		This function will be
		//		called on a successful HTTP response code.
		//	error: Function?
		//		This function will
		//		be called when the request fails due to a network or server error, the url
		//		is invalid, etc. It will also be called if the load or handle callback throws an
		//		exception, unless djConfig.debugAtAllCosts is true.  This allows deployed applications
		//		to continue to run even when a logic error happens in the callback, while making
		//		it easier to troubleshoot while in debug mode.
		//	handle: Function?
		//		This function will
		//		be called at the end of every request, whether or not an error occurs.
		this.url = url;
		this.content = content;
		this.timeout = timeout;
		this.form = form;
		this.preventCache = preventCache;
		this.handleAs = handleAs;
		this.ioPublish = ioPublish;
		this.load = function(response, ioArgs){
			// ioArgs: dojo.__IoCallbackArgs
			//		Provides additional information about the request.
			// response: Object
			//		The response in the format as defined with handleAs.
		}
		this.error = function(response, ioArgs){
			// ioArgs: dojo.__IoCallbackArgs
			//		Provides additional information about the request.
			// response: Object
			//		The response in the format as defined with handleAs.
		}
		this.handle = function(loadOrError, response, ioArgs){
			// loadOrError: String
			//		Provides a string that tells you whether this function
			//		was called because of success (load) or failure (error).
			// response: Object
			//		The response in the format as defined with handleAs.
			// ioArgs: dojo.__IoCallbackArgs
			//		Provides additional information about the request.
		}
	}
	=====*/

	/*=====
	dojo.__IoCallbackArgs = function(args, xhr, url, query, handleAs, id, canDelete, json){
		//	args: Object
		//		the original object argument to the IO call.
		//	xhr: XMLHttpRequest
		//		For XMLHttpRequest calls only, the
		//		XMLHttpRequest object that was used for the
		//		request.
		//	url: String
		//		The final URL used for the call. Many times it
		//		will be different than the original args.url
		//		value.
		//	query: String
		//		For non-GET requests, the
		//		name1=value1&name2=value2 parameters sent up in
		//		the request.
		//	handleAs: String
		//		The final indicator on how the response will be
		//		handled.
		//	id: String
		//		For dojo.io.script calls only, the internal
		//		script ID used for the request.
		//	canDelete: Boolean
		//		For dojo.io.script calls only, indicates
		//		whether the script tag that represents the
		//		request can be deleted after callbacks have
		//		been called. Used internally to know when
		//		cleanup can happen on JSONP-type requests.
		//	json: Object
		//		For dojo.io.script calls only: holds the JSON
		//		response for JSONP-type requests. Used
		//		internally to hold on to the JSON responses.
		//		You should not need to access it directly --
		//		the same object should be passed to the success
		//		callbacks directly.
		this.args = args;
		this.xhr = xhr;
		this.url = url;
		this.query = query;
		this.handleAs = handleAs;
		this.id = id;
		this.canDelete = canDelete;
		this.json = json;
	}
	=====*/


	/*=====
	dojo.__IoPublish = function(){
		// 	summary:
		// 		This is a list of IO topics that can be published
		// 		if djConfig.ioPublish is set to true. IO topics can be
		// 		published for any Input/Output, network operation. So,
		// 		dojo.xhr, dojo.io.script and dojo.io.iframe can all
		// 		trigger these topics to be published.
		//	start: String
		//		"/dojo/io/start" is sent when there are no outstanding IO
		// 		requests, and a new IO request is started. No arguments
		// 		are passed with this topic.
		//	send: String
		//		"/dojo/io/send" is sent whenever a new IO request is started.
		// 		It passes the dojo.Deferred for the request with the topic.
		//	load: String
		//		"/dojo/io/load" is sent whenever an IO request has loaded
		// 		successfully. It passes the response and the dojo.Deferred
		// 		for the request with the topic.
		//	error: String
		//		"/dojo/io/error" is sent whenever an IO request has errored.
		// 		It passes the error and the dojo.Deferred
		// 		for the request with the topic.
		//	done: String
		//		"/dojo/io/done" is sent whenever an IO request has completed,
		// 		either by loading or by erroring. It passes the error and
		// 		the dojo.Deferred for the request with the topic.
		//	stop: String
		//		"/dojo/io/stop" is sent when all outstanding IO requests have
		// 		finished. No arguments are passed with this topic.
		this.start = "/dojo/io/start";
		this.send = "/dojo/io/send";
		this.load = "/dojo/io/load";
		this.error = "/dojo/io/error";
		this.done = "/dojo/io/done";
		this.stop = "/dojo/io/stop";
	}
	=====*/


	dojo._ioSetArgs = function(/*dojo.__IoArgs*/args,
			/*Function*/canceller,
			/*Function*/okHandler,
			/*Function*/errHandler){
		//	summary: 
		//		sets up the Deferred and ioArgs property on the Deferred so it
		//		can be used in an io call.
		//	args:
		//		The args object passed into the public io call. Recognized properties on
		//		the args object are:
		//	canceller:
		//		The canceller function used for the Deferred object. The function
		//		will receive one argument, the Deferred object that is related to the
		//		canceller.
		//	okHandler:
		//		The first OK callback to be registered with Deferred. It has the opportunity
		//		to transform the OK response. It will receive one argument -- the Deferred
		//		object returned from this function.
		//	errHandler:
		//		The first error callback to be registered with Deferred. It has the opportunity
		//		to do cleanup on an error. It will receive two arguments: error (the 
		//		Error object) and dfd, the Deferred object returned from this function.

		var ioArgs = {args: args, url: args.url};

		//Get values from form if requestd.
		var formObject = null;
		if(args.form){ 
			var form = _d.byId(args.form);
			//IE requires going through getAttributeNode instead of just getAttribute in some form cases, 
			//so use it for all.  See #2844
			var actnNode = form.getAttributeNode("action");
			ioArgs.url = ioArgs.url || (actnNode ? actnNode.value : null); 
			formObject = _d.formToObject(form);
		}

		// set up the query params
		var miArgs = [{}];
	
		if(formObject){
			// potentially over-ride url-provided params w/ form values
			miArgs.push(formObject);
		}
		if(args.content){
			// stuff in content over-rides what's set by form
			miArgs.push(args.content);
		}
		if(args.preventCache){
			miArgs.push({"dojo.preventCache": new Date().valueOf()});
		}
		ioArgs.query = _d.objectToQuery(_d.mixin.apply(null, miArgs));
	
		// .. and the real work of getting the deferred in order, etc.
		ioArgs.handleAs = args.handleAs || "text";
		var d = new _d.Deferred(canceller);
		d.addCallbacks(okHandler, function(error){
			return errHandler(error, d);
		});

		//Support specifying load, error and handle callback functions from the args.
		//For those callbacks, the "this" object will be the args object.
		//The callbacks will get the deferred result value as the
		//first argument and the ioArgs object as the second argument.
		var ld = args.load;
		if(ld && _d.isFunction(ld)){
			d.addCallback(function(value){
				return ld.call(args, value, ioArgs);
			});
		}
		var err = args.error;
		if(err && _d.isFunction(err)){
			d.addErrback(function(value){
				return err.call(args, value, ioArgs);
			});
		}
		var handle = args.handle;
		if(handle && _d.isFunction(handle)){
			d.addBoth(function(value){
				return handle.call(args, value, ioArgs);
			});
		}

		//Plug in topic publishing, if dojo.publish is loaded.
		if(cfg.ioPublish && _d.publish && ioArgs.args.ioPublish !== false){
			d.addCallbacks(
				function(res){
					_d.publish("/dojo/io/load", [d, res]);
					return res;
				},
				function(res){
					_d.publish("/dojo/io/error", [d, res]);
					return res;
				}
			);
			d.addBoth(function(res){
				_d.publish("/dojo/io/done", [d, res]);
				return res;
			});
		}

		d.ioArgs = ioArgs;
	
		// FIXME: need to wire up the xhr object's abort method to something
		// analagous in the Deferred
		return d;
	}

	var _deferredCancel = function(/*Deferred*/dfd){
		// summary: canceller function for dojo._ioSetArgs call.
		
		dfd.canceled = true;
		var xhr = dfd.ioArgs.xhr;
		var _at = typeof xhr.abort;
		if(_at == "function" || _at == "object" || _at == "unknown"){
			xhr.abort();
		}
		var err = dfd.ioArgs.error;
		if(!err){
			err = new Error("xhr cancelled");
			err.dojoType="cancel";
		}
		return err;
	}
	var _deferredOk = function(/*Deferred*/dfd){
		// summary: okHandler function for dojo._ioSetArgs call.

		var ret = handlers[dfd.ioArgs.handleAs](dfd.ioArgs.xhr);
		return ret === undefined ? null : ret;
	}
	var _deferError = function(/*Error*/error, /*Deferred*/dfd){
		// summary: errHandler function for dojo._ioSetArgs call.

		if(!dfd.ioArgs.args.failOk){
			console.error(error);
		}
		return error;
	}

	// avoid setting a timer per request. It degrades performance on IE
	// something fierece if we don't use unified loops.
	var _inFlightIntvl = null;
	var _inFlight = [];
	
	
	//Use a separate count for knowing if we are starting/stopping io calls.
	//Cannot use _inFlight.length since it can change at a different time than
	//when we want to do this kind of test. We only want to decrement the count
	//after a callback/errback has finished, since the callback/errback should be
	//considered as part of finishing a request.
	var _pubCount = 0;
	var _checkPubCount = function(dfd){
		if(_pubCount <= 0){
			_pubCount = 0;
			if(cfg.ioPublish && _d.publish && (!dfd || dfd && dfd.ioArgs.args.ioPublish !== false)){
				_d.publish("/dojo/io/stop");
			}
		}
	};

	var _watchInFlight = function(){
		//summary: 
		//		internal method that checks each inflight XMLHttpRequest to see
		//		if it has completed or if the timeout situation applies.
		
		var now = (new Date()).getTime();
		// make sure sync calls stay thread safe, if this callback is called
		// during a sync call and this results in another sync call before the
		// first sync call ends the browser hangs
		if(!_d._blockAsync){
			// we need manual loop because we often modify _inFlight (and therefore 'i') while iterating
			// note: the second clause is an assigment on purpose, lint may complain
			for(var i = 0, tif; i < _inFlight.length && (tif = _inFlight[i]); i++){
				var dfd = tif.dfd;
				var func = function(){
					if(!dfd || dfd.canceled || !tif.validCheck(dfd)){
						_inFlight.splice(i--, 1); 
						_pubCount -= 1;
					}else if(tif.ioCheck(dfd)){
						_inFlight.splice(i--, 1);
						tif.resHandle(dfd);
						_pubCount -= 1;
					}else if(dfd.startTime){
						//did we timeout?
						if(dfd.startTime + (dfd.ioArgs.args.timeout || 0) < now){
							_inFlight.splice(i--, 1);
							var err = new Error("timeout exceeded");
							err.dojoType = "timeout";
							dfd.errback(err);
							//Cancel the request so the io module can do appropriate cleanup.
							dfd.cancel();
							_pubCount -= 1;
						}
					}
				};
				if(dojo.config.debugAtAllCosts){
					func.call(this);
				}else{
					try{
						func.call(this);
					}catch(e){
						dfd.errback(e);
					}
				}
			}
		}

		_checkPubCount(dfd);

		if(!_inFlight.length){
			clearInterval(_inFlightIntvl);
			_inFlightIntvl = null;
			return;
		}
	}

	dojo._ioCancelAll = function(){
		//summary: Cancels all pending IO requests, regardless of IO type
		//(xhr, script, iframe).
		try{
			_d.forEach(_inFlight, function(i){
				try{
					i.dfd.cancel();
				}catch(e){/*squelch*/}
			});
		}catch(e){/*squelch*/}
	}

	//Automatically call cancel all io calls on unload
	//in IE for trac issue #2357.
		if(_d.isIE){
		_d.addOnWindowUnload(_d._ioCancelAll);
	}
	
	_d._ioNotifyStart = function(/*Deferred*/dfd){
		// summary:
		// 		If dojo.publish is available, publish topics
		// 		about the start of a request queue and/or the
		// 		the beginning of request.
		// description:
		// 		Used by IO transports. An IO transport should
		// 		call this method before making the network connection.
		if(cfg.ioPublish && _d.publish && dfd.ioArgs.args.ioPublish !== false){
			if(!_pubCount){
				_d.publish("/dojo/io/start");
			}
			_pubCount += 1;
			_d.publish("/dojo/io/send", [dfd]);
		}
	}

	_d._ioWatch = function(dfd, validCheck, ioCheck, resHandle){
		// summary: 
		//		Watches the io request represented by dfd to see if it completes.
		// dfd: Deferred
		//		The Deferred object to watch.
		// validCheck: Function
		//		Function used to check if the IO request is still valid. Gets the dfd
		//		object as its only argument.
		// ioCheck: Function
		//		Function used to check if basic IO call worked. Gets the dfd
		//		object as its only argument.
		// resHandle: Function
		//		Function used to process response. Gets the dfd
		//		object as its only argument.
		var args = dfd.ioArgs.args;
		if(args.timeout){
			dfd.startTime = (new Date()).getTime();
		}
		
		_inFlight.push({dfd: dfd, validCheck: validCheck, ioCheck: ioCheck, resHandle: resHandle});
		if(!_inFlightIntvl){
			_inFlightIntvl = setInterval(_watchInFlight, 50);
		}
		// handle sync requests
		//A weakness: async calls in flight
		//could have their handlers called as part of the
		//_watchInFlight call, before the sync's callbacks
		// are called.
		if(args.sync){
			_watchInFlight();
		}
	}

	var _defaultContentType = "application/x-www-form-urlencoded";

	var _validCheck = function(/*Deferred*/dfd){
		return dfd.ioArgs.xhr.readyState; //boolean
	}
	var _ioCheck = function(/*Deferred*/dfd){
		return 4 == dfd.ioArgs.xhr.readyState; //boolean
	}
	var _resHandle = function(/*Deferred*/dfd){
		var xhr = dfd.ioArgs.xhr;
		if(_d._isDocumentOk(xhr)){
			dfd.callback(dfd);
		}else{
			var err = new Error("Unable to load " + dfd.ioArgs.url + " status:" + xhr.status);
			err.status = xhr.status;
			err.responseText = xhr.responseText;
			dfd.errback(err);
		}
	}

	dojo._ioAddQueryToUrl = function(/*dojo.__IoCallbackArgs*/ioArgs){
		//summary: Adds query params discovered by the io deferred construction to the URL.
		//Only use this for operations which are fundamentally GET-type operations.
		if(ioArgs.query.length){
			ioArgs.url += (ioArgs.url.indexOf("?") == -1 ? "?" : "&") + ioArgs.query;
			ioArgs.query = null;
		}		
	}

	/*=====
	dojo.declare("dojo.__XhrArgs", dojo.__IoArgs, {
		constructor: function(){
			//	summary:
			//		In addition to the properties listed for the dojo._IoArgs type,
			//		the following properties are allowed for dojo.xhr* methods.
			//	handleAs: String?
			//		Acceptable values are: text (default), json, json-comment-optional,
			//		json-comment-filtered, javascript, xml. See `dojo.contentHandlers`
			//	sync: Boolean?
			//		false is default. Indicates whether the request should
			//		be a synchronous (blocking) request.
			//	headers: Object?
			//		Additional HTTP headers to send in the request.
			//	failOk: Boolean?
			//		false is default. Indicates whether a request should be
			//		allowed to fail (and therefore no console error message in
			//		the event of a failure)
			this.handleAs = handleAs;
			this.sync = sync;
			this.headers = headers;
			this.failOk = failOk;
		}
	});
	=====*/

	dojo.xhr = function(/*String*/ method, /*dojo.__XhrArgs*/ args, /*Boolean?*/ hasBody){
		//	summary:
		//		Sends an HTTP request with the given method.
		//	description:
		//		Sends an HTTP request with the given method.
		//		See also dojo.xhrGet(), xhrPost(), xhrPut() and dojo.xhrDelete() for shortcuts
		//		for those HTTP methods. There are also methods for "raw" PUT and POST methods
		//		via dojo.rawXhrPut() and dojo.rawXhrPost() respectively.
		//	method:
		//		HTTP method to be used, such as GET, POST, PUT, DELETE.  Should be uppercase.
		//	hasBody:
		//		If the request has an HTTP body, then pass true for hasBody.

		//Make the Deferred object for this xhr request.
		var dfd = _d._ioSetArgs(args, _deferredCancel, _deferredOk, _deferError);
		var ioArgs = dfd.ioArgs;

		//Pass the args to _xhrObj, to allow alternate XHR calls based specific calls, like
		//the one used for iframe proxies.
		var xhr = ioArgs.xhr = _d._xhrObj(ioArgs.args);
		//If XHR factory fails, cancel the deferred.
		if(!xhr){
			dfd.cancel();
			return dfd;
		}

		//Allow for specifying the HTTP body completely.
		if("postData" in args){
			ioArgs.query = args.postData;
		}else if("putData" in args){
			ioArgs.query = args.putData;
		}else if("rawBody" in args){
			ioArgs.query = args.rawBody;
		}else if((arguments.length > 2 && !hasBody) || "POST|PUT".indexOf(method.toUpperCase()) == -1){
			//Check for hasBody being passed. If no hasBody,
			//then only append query string if not a POST or PUT request.
			_d._ioAddQueryToUrl(ioArgs);
		}

		// IE 6 is a steaming pile. It won't let you call apply() on the native function (xhr.open).
		// workaround for IE6's apply() "issues"
		xhr.open(method, ioArgs.url, args.sync !== true, args.user || undefined, args.password || undefined);
		if(args.headers){
			for(var hdr in args.headers){
				if(hdr.toLowerCase() === "content-type" && !args.contentType){
					args.contentType = args.headers[hdr];
				}else if(args.headers[hdr]){
					//Only add header if it has a value. This allows for instnace, skipping
					//insertion of X-Requested-With by specifying empty value.
					xhr.setRequestHeader(hdr, args.headers[hdr]);
				}
			}
		}
		// FIXME: is this appropriate for all content types?
		xhr.setRequestHeader("Content-Type", args.contentType || _defaultContentType);
		if(!args.headers || !("X-Requested-With" in args.headers)){
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		}
		// FIXME: set other headers here!
		_d._ioNotifyStart(dfd);
		if(dojo.config.debugAtAllCosts){
			xhr.send(ioArgs.query);
		}else{
			try{
				xhr.send(ioArgs.query);
			}catch(e){
				ioArgs.error = e;
				dfd.cancel();
			}
		}
		_d._ioWatch(dfd, _validCheck, _ioCheck, _resHandle);
		xhr = null;
		return dfd; // dojo.Deferred
	}

	dojo.xhrGet = function(/*dojo.__XhrArgs*/ args){
		//	summary: 
		//		Sends an HTTP GET request to the server.
		return _d.xhr("GET", args); // dojo.Deferred
	}

	dojo.rawXhrPost = dojo.xhrPost = function(/*dojo.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP POST request to the server. In addtion to the properties
		//		listed for the dojo.__XhrArgs type, the following property is allowed:
		//	postData:
		//		String. Send raw data in the body of the POST request.
		return _d.xhr("POST", args, true); // dojo.Deferred
	}

	dojo.rawXhrPut = dojo.xhrPut = function(/*dojo.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP PUT request to the server. In addtion to the properties
		//		listed for the dojo.__XhrArgs type, the following property is allowed:
		//	putData:
		//		String. Send raw data in the body of the PUT request.
		return _d.xhr("PUT", args, true); // dojo.Deferred
	}

	dojo.xhrDelete = function(/*dojo.__XhrArgs*/ args){
		//	summary:
		//		Sends an HTTP DELETE request to the server.
		return _d.xhr("DELETE", args); //dojo.Deferred
	}

	/*
	dojo.wrapForm = function(formNode){
		//summary:
		//		A replacement for FormBind, but not implemented yet.

		// FIXME: need to think harder about what extensions to this we might
		// want. What should we allow folks to do w/ this? What events to
		// set/send?
		throw new Error("dojo.wrapForm not yet implemented");
	}
	*/
})();

}

if(!dojo._hasResource["dojo._base.fx"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.fx"] = true;
dojo.provide("dojo._base.fx");





/*
	Animation loosely package based on Dan Pupius' work, contributed under CLA:
		http://pupius.co.uk/js/Toolkit.Drawing.js
*/
(function(){
	var d = dojo;
	var _mixin = d._mixin;

	dojo._Line = function(/*int*/ start, /*int*/ end){
		//	summary:
		//		dojo._Line is the object used to generate values from a start value
		//		to an end value
		//	start: int
		//		Beginning value for range
		//	end: int
		//		Ending value for range
		this.start = start;
		this.end = end;
	};

	dojo._Line.prototype.getValue = function(/*float*/ n){
		//	summary: Returns the point on the line
		//	n: a floating point number greater than 0 and less than 1
		return ((this.end - this.start) * n) + this.start; // Decimal
	};

	dojo.Animation = function(args){
		//	summary:
		//		A generic animation class that fires callbacks into its handlers
		//		object at various states.
		//	description:
		//		A generic animation class that fires callbacks into its handlers
		//		object at various states. Nearly all dojo animation functions
		//		return an instance of this method, usually without calling the
		//		.play() method beforehand. Therefore, you will likely need to
		//		call .play() on instances of `dojo.Animation` when one is
		//		returned.
		// args: Object
		//		The 'magic argument', mixing all the properties into this
		//		animation instance.

		_mixin(this, args);
		if(d.isArray(this.curve)){
			this.curve = new d._Line(this.curve[0], this.curve[1]);
		}

	};

	// Alias to drop come 2.0:
	d._Animation = d.Animation;

	d.extend(dojo.Animation, {
		// duration: Integer
		//		The time in milliseonds the animation will take to run
		duration: 350,

	/*=====
		// curve: dojo._Line|Array
		//		A two element array of start and end values, or a `dojo._Line` instance to be
		//		used in the Animation.
		curve: null,

		// easing: Function?
		//		A Function to adjust the acceleration (or deceleration) of the progress
		//		across a dojo._Line
		easing: null,
	=====*/

		// repeat: Integer?
		//		The number of times to loop the animation
		repeat: 0,

		// rate: Integer?
		//		the time in milliseconds to wait before advancing to next frame
		//		(used as a fps timer: 1000/rate = fps)
		rate: 20 /* 50 fps */,

	/*=====
		// delay: Integer?
		//		The time in milliseconds to wait before starting animation after it
		//		has been .play()'ed
		delay: null,

		// beforeBegin: Event?
		//		Synthetic event fired before a dojo.Animation begins playing (synchronous)
		beforeBegin: null,

		// onBegin: Event?
		//		Synthetic event fired as a dojo.Animation begins playing (useful?)
		onBegin: null,

		// onAnimate: Event?
		//		Synthetic event fired at each interval of a `dojo.Animation`
		onAnimate: null,

		// onEnd: Event?
		//		Synthetic event fired after the final frame of a `dojo.Animation`
		onEnd: null,

		// onPlay: Event?
		//		Synthetic event fired any time a `dojo.Animation` is play()'ed
		onPlay: null,

		// onPause: Event?
		//		Synthetic event fired when a `dojo.Animation` is paused
		onPause: null,

		// onStop: Event
		//		Synthetic event fires when a `dojo.Animation` is stopped
		onStop: null,

	=====*/

		_percent: 0,
		_startRepeatCount: 0,

		_getStep: function(){
			var _p = this._percent,
				_e = this.easing
			;
			return _e ? _e(_p) : _p;
		},
		_fire: function(/*Event*/ evt, /*Array?*/ args){
			//	summary:
			//		Convenience function.  Fire event "evt" and pass it the
			//		arguments specified in "args".
			//	description:
			//		Convenience function.  Fire event "evt" and pass it the
			//		arguments specified in "args".
			//		Fires the callback in the scope of the `dojo.Animation`
			//		instance.
			//	evt:
			//		The event to fire.
			//	args:
			//		The arguments to pass to the event.
			var a = args||[];
			if(this[evt]){
				if(d.config.debugAtAllCosts){
					this[evt].apply(this, a);
				}else{
					try{
						this[evt].apply(this, a);
					}catch(e){
						// squelch and log because we shouldn't allow exceptions in
						// synthetic event handlers to cause the internal timer to run
						// amuck, potentially pegging the CPU. I'm not a fan of this
						// squelch, but hopefully logging will make it clear what's
						// going on
						console.error("exception in animation handler for:", evt);
						console.error(e);
					}
				}
			}
			return this; // dojo.Animation
		},

		play: function(/*int?*/ delay, /*Boolean?*/ gotoStart){
			// summary:
			//		Start the animation.
			// delay:
			//		How many milliseconds to delay before starting.
			// gotoStart:
			//		If true, starts the animation from the beginning; otherwise,
			//		starts it from its current position.
			// returns: dojo.Animation
			//		The instance to allow chaining.

			var _t = this;
			if(_t._delayTimer){ _t._clearTimer(); }
			if(gotoStart){
				_t._stopTimer();
				_t._active = _t._paused = false;
				_t._percent = 0;
			}else if(_t._active && !_t._paused){
				return _t;
			}

			_t._fire("beforeBegin", [_t.node]);

			var de = delay || _t.delay,
				_p = dojo.hitch(_t, "_play", gotoStart);

			if(de > 0){
				_t._delayTimer = setTimeout(_p, de);
				return _t;
			}
			_p();
			return _t;
		},

		_play: function(gotoStart){
			var _t = this;
			if(_t._delayTimer){ _t._clearTimer(); }
			_t._startTime = new Date().valueOf();
			if(_t._paused){
				_t._startTime -= _t.duration * _t._percent;
			}

			_t._active = true;
			_t._paused = false;
			var value = _t.curve.getValue(_t._getStep());
			if(!_t._percent){
				if(!_t._startRepeatCount){
					_t._startRepeatCount = _t.repeat;
				}
				_t._fire("onBegin", [value]);
			}

			_t._fire("onPlay", [value]);

			_t._cycle();
			return _t; // dojo.Animation
		},

		pause: function(){
			// summary: Pauses a running animation.
			var _t = this;
			if(_t._delayTimer){ _t._clearTimer(); }
			_t._stopTimer();
			if(!_t._active){ return _t; /*dojo.Animation*/ }
			_t._paused = true;
			_t._fire("onPause", [_t.curve.getValue(_t._getStep())]);
			return _t; // dojo.Animation
		},

		gotoPercent: function(/*Decimal*/ percent, /*Boolean?*/ andPlay){
			//	summary:
			//		Sets the progress of the animation.
			//	percent:
			//		A percentage in decimal notation (between and including 0.0 and 1.0).
			//	andPlay:
			//		If true, play the animation after setting the progress.
			var _t = this;
			_t._stopTimer();
			_t._active = _t._paused = true;
			_t._percent = percent;
			if(andPlay){ _t.play(); }
			return _t; // dojo.Animation
		},

		stop: function(/*boolean?*/ gotoEnd){
			// summary: Stops a running animation.
			// gotoEnd: If true, the animation will end.
			var _t = this;
			if(_t._delayTimer){ _t._clearTimer(); }
			if(!_t._timer){ return _t; /* dojo.Animation */ }
			_t._stopTimer();
			if(gotoEnd){
				_t._percent = 1;
			}
			_t._fire("onStop", [_t.curve.getValue(_t._getStep())]);
			_t._active = _t._paused = false;
			return _t; // dojo.Animation
		},

		status: function(){
			// summary:
			//		Returns a string token representation of the status of
			//		the animation, one of: "paused", "playing", "stopped"
			if(this._active){
				return this._paused ? "paused" : "playing"; // String
			}
			return "stopped"; // String
		},

		_cycle: function(){
			var _t = this;
			if(_t._active){
				var curr = new Date().valueOf();
				var step = (curr - _t._startTime) / (_t.duration);

				if(step >= 1){
					step = 1;
				}
				_t._percent = step;

				// Perform easing
				if(_t.easing){
					step = _t.easing(step);
				}

				_t._fire("onAnimate", [_t.curve.getValue(step)]);

				if(_t._percent < 1){
					_t._startTimer();
				}else{
					_t._active = false;

					if(_t.repeat > 0){
						_t.repeat--;
						_t.play(null, true);
					}else if(_t.repeat == -1){
						_t.play(null, true);
					}else{
						if(_t._startRepeatCount){
							_t.repeat = _t._startRepeatCount;
							_t._startRepeatCount = 0;
						}
					}
					_t._percent = 0;
					_t._fire("onEnd", [_t.node]);
					!_t.repeat && _t._stopTimer();
				}
			}
			return _t; // dojo.Animation
		},

		_clearTimer: function(){
			// summary: Clear the play delay timer
			clearTimeout(this._delayTimer);
			delete this._delayTimer;
		}

	});

	// the local timer, stubbed into all Animation instances
	var ctr = 0,
		timer = null,
		runner = {
			run: function(){}
		};

	d.extend(d.Animation, {

		_startTimer: function(){
			if(!this._timer){
				this._timer = d.connect(runner, "run", this, "_cycle");
				ctr++;
			}
			if(!timer){
				timer = setInterval(d.hitch(runner, "run"), this.rate);
			}
		},

		_stopTimer: function(){
			if(this._timer){
				d.disconnect(this._timer);
				this._timer = null;
				ctr--;
			}
			if(ctr <= 0){
				clearInterval(timer);
				timer = null;
				ctr = 0;
			}
		}

	});

	var _makeFadeable =
				d.isIE ? function(node){
			// only set the zoom if the "tickle" value would be the same as the
			// default
			var ns = node.style;
			// don't set the width to auto if it didn't already cascade that way.
			// We don't want to f anyones designs
			if(!ns.width.length && d.style(node, "width") == "auto"){
				ns.width = "auto";
			}
		} :
				function(){};

	dojo._fade = function(/*Object*/ args){
		//	summary:
		//		Returns an animation that will fade the node defined by
		//		args.node from the start to end values passed (args.start
		//		args.end) (end is mandatory, start is optional)

		args.node = d.byId(args.node);
		var fArgs = _mixin({ properties: {} }, args),
			props = (fArgs.properties.opacity = {});

		props.start = !("start" in fArgs) ?
			function(){
				return +d.style(fArgs.node, "opacity")||0;
			} : fArgs.start;
		props.end = fArgs.end;

		var anim = d.animateProperty(fArgs);
		d.connect(anim, "beforeBegin", d.partial(_makeFadeable, fArgs.node));

		return anim; // dojo.Animation
	};

	/*=====
	dojo.__FadeArgs = function(node, duration, easing){
		//	node: DOMNode|String
		//		The node referenced in the animation
		//	duration: Integer?
		//		Duration of the animation in milliseconds.
		//	easing: Function?
		//		An easing function.
		this.node = node;
		this.duration = duration;
		this.easing = easing;
	}
	=====*/

	dojo.fadeIn = function(/*dojo.__FadeArgs*/ args){
		// summary:
		//		Returns an animation that will fade node defined in 'args' from
		//		its current opacity to fully opaque.
		return d._fade(_mixin({ end: 1 }, args)); // dojo.Animation
	};

	dojo.fadeOut = function(/*dojo.__FadeArgs*/  args){
		// summary:
		//		Returns an animation that will fade node defined in 'args'
		//		from its current opacity to fully transparent.
		return d._fade(_mixin({ end: 0 }, args)); // dojo.Animation
	};

	dojo._defaultEasing = function(/*Decimal?*/ n){
		// summary: The default easing function for dojo.Animation(s)
		return 0.5 + ((Math.sin((n + 1.5) * Math.PI)) / 2);
	};

	var PropLine = function(properties){
		// PropLine is an internal class which is used to model the values of
		// an a group of CSS properties across an animation lifecycle. In
		// particular, the "getValue" function handles getting interpolated
		// values between start and end for a particular CSS value.
		this._properties = properties;
		for(var p in properties){
			var prop = properties[p];
			if(prop.start instanceof d.Color){
				// create a reusable temp color object to keep intermediate results
				prop.tempColor = new d.Color();
			}
		}
	};

	PropLine.prototype.getValue = function(r){
		var ret = {};
		for(var p in this._properties){
			var prop = this._properties[p],
				start = prop.start;
			if(start instanceof d.Color){
				ret[p] = d.blendColors(start, prop.end, r, prop.tempColor).toCss();
			}else if(!d.isArray(start)){
				ret[p] = ((prop.end - start) * r) + start + (p != "opacity" ? prop.units || "px" : 0);
			}
		}
		return ret;
	};

	/*=====
	dojo.declare("dojo.__AnimArgs", [dojo.__FadeArgs], {
		// Properties: Object?
		//	A hash map of style properties to Objects describing the transition,
		//	such as the properties of dojo._Line with an additional 'units' property
		properties: {}

		//TODOC: add event callbacks
	});
	=====*/

	dojo.animateProperty = function(/*dojo.__AnimArgs*/ args){
		// summary:
		//		Returns an animation that will transition the properties of
		//		node defined in `args` depending how they are defined in
		//		`args.properties`
		//
		// description:
		//		`dojo.animateProperty` is the foundation of most `dojo.fx`
		//		animations. It takes an object of "properties" corresponding to
		//		style properties, and animates them in parallel over a set
		//		duration.
		//
		// example:
		//		A simple animation that changes the width of the specified node.
		//	|	dojo.animateProperty({
		//	|		node: "nodeId",
		//	|		properties: { width: 400 },
		//	|	}).play();
		//		Dojo figures out the start value for the width and converts the
		//		integer specified for the width to the more expressive but
		//		verbose form `{ width: { end: '400', units: 'px' } }` which you
		//		can also specify directly. Defaults to 'px' if ommitted.
		//
		// example:
		//		Animate width, height, and padding over 2 seconds... the
		//		pedantic way:
		//	|	dojo.animateProperty({ node: node, duration:2000,
		//	|		properties: {
		//	|			width: { start: '200', end: '400', units:"px" },
		//	|			height: { start:'200', end: '400', units:"px" },
		//	|			paddingTop: { start:'5', end:'50', units:"px" }
		//	|		}
		//	|	}).play();
		//		Note 'paddingTop' is used over 'padding-top'. Multi-name CSS properties
		//		are written using "mixed case", as the hyphen is illegal as an object key.
		//
		// example:
		//		Plug in a different easing function and register a callback for
		//		when the animation ends. Easing functions accept values between
		//		zero and one and return a value on that basis. In this case, an
		//		exponential-in curve.
		//	|	dojo.animateProperty({
		//	|		node: "nodeId",
		//	|		// dojo figures out the start value
		//	|		properties: { width: { end: 400 } },
		//	|		easing: function(n){
		//	|			return (n==0) ? 0 : Math.pow(2, 10 * (n - 1));
		//	|		},
		//	|		onEnd: function(node){
		//	|			// called when the animation finishes. The animation
		//	|			// target is passed to this function
		//	|		}
		//	|	}).play(500); // delay playing half a second
		//
		// example:
		//		Like all `dojo.Animation`s, animateProperty returns a handle to the
		//		Animation instance, which fires the events common to Dojo FX. Use `dojo.connect`
		//		to access these events outside of the Animation definiton:
		//	|	var anim = dojo.animateProperty({
		//	|		node:"someId",
		//	|		properties:{
		//	|			width:400, height:500
		//	|		}
		//	|	});
		//	|	dojo.connect(anim,"onEnd", function(){
		//	|		console.log("animation ended");
		//	|	});
		//	|	// play the animation now:
		//	|	anim.play();
		//
		// example:
		//		Each property can be a function whose return value is substituted along.
		//		Additionally, each measurement (eg: start, end) can be a function. The node
		//		reference is passed direcly to callbacks.
		//	|	dojo.animateProperty({
		//	|		node:"mine",
		//	|		properties:{
		//	|			height:function(node){
		//	|				// shrink this node by 50%
		//	|				return dojo.position(node).h / 2
		//	|			},
		//	|			width:{
		//	|				start:function(node){ return 100; },
		//	|				end:function(node){ return 200; }
		//	|			}
		//	|		}
		//	|	}).play();
		//

		var n = args.node = d.byId(args.node);
		if(!args.easing){ args.easing = d._defaultEasing; }

		var anim = new d.Animation(args);
		d.connect(anim, "beforeBegin", anim, function(){
			var pm = {};
			for(var p in this.properties){
				// Make shallow copy of properties into pm because we overwrite
				// some values below. In particular if start/end are functions
				// we don't want to overwrite them or the functions won't be
				// called if the animation is reused.
				if(p == "width" || p == "height"){
					this.node.display = "block";
				}
				var prop = this.properties[p];
				if(d.isFunction(prop)){
					prop = prop(n);
				}
				prop = pm[p] = _mixin({}, (d.isObject(prop) ? prop: { end: prop }));

				if(d.isFunction(prop.start)){
					prop.start = prop.start(n);
				}
				if(d.isFunction(prop.end)){
					prop.end = prop.end(n);
				}
				var isColor = (p.toLowerCase().indexOf("color") >= 0);
				function getStyle(node, p){
					// dojo.style(node, "height") can return "auto" or "" on IE; this is more reliable:
					var v = { height: node.offsetHeight, width: node.offsetWidth }[p];
					if(v !== undefined){ return v; }
					v = d.style(node, p);
					return (p == "opacity") ? +v : (isColor ? v : parseFloat(v));
				}
				if(!("end" in prop)){
					prop.end = getStyle(n, p);
				}else if(!("start" in prop)){
					prop.start = getStyle(n, p);
				}

				if(isColor){
					prop.start = new d.Color(prop.start);
					prop.end = new d.Color(prop.end);
				}else{
					prop.start = (p == "opacity") ? +prop.start : parseFloat(prop.start);
				}
			}
			this.curve = new PropLine(pm);
		});
		d.connect(anim, "onAnimate", d.hitch(d, "style", anim.node));
		return anim; // dojo.Animation
	};

	dojo.anim = function(	/*DOMNode|String*/	node,
							/*Object*/			properties,
							/*Integer?*/		duration,
							/*Function?*/		easing,
							/*Function?*/		onEnd,
							/*Integer?*/		delay){
		//	summary:
		//		A simpler interface to `dojo.animateProperty()`, also returns
		//		an instance of `dojo.Animation` but begins the animation
		//		immediately, unlike nearly every other Dojo animation API.
		//	description:
		//		`dojo.anim` is a simpler (but somewhat less powerful) version
		//		of `dojo.animateProperty`.  It uses defaults for many basic properties
		//		and allows for positional parameters to be used in place of the
		//		packed "property bag" which is used for other Dojo animation
		//		methods.
		//
		//		The `dojo.Animation` object returned from `dojo.anim` will be
		//		already playing when it is returned from this function, so
		//		calling play() on it again is (usually) a no-op.
		//	node:
		//		a DOM node or the id of a node to animate CSS properties on
		//	duration:
		//		The number of milliseconds over which the animation
		//		should run. Defaults to the global animation default duration
		//		(350ms).
		//	easing:
		//		An easing function over which to calculate acceleration
		//		and deceleration of the animation through its duration.
		//		A default easing algorithm is provided, but you may
		//		plug in any you wish. A large selection of easing algorithms
		//		are available in `dojo.fx.easing`.
		//	onEnd:
		//		A function to be called when the animation finishes
		//		running.
		//	delay:
		//		The number of milliseconds to delay beginning the
		//		animation by. The default is 0.
		//	example:
		//		Fade out a node
		//	|	dojo.anim("id", { opacity: 0 });
		//	example:
		//		Fade out a node over a full second
		//	|	dojo.anim("id", { opacity: 0 }, 1000);
		return d.animateProperty({ // dojo.Animation
			node: node,
			duration: duration || d.Animation.prototype.duration,
			properties: properties,
			easing: easing,
			onEnd: onEnd
		}).play(delay || 0);
	};
})();

}

if(!dojo._hasResource["dojo._base.browser"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojo._base.browser"] = true;
dojo.provide("dojo._base.browser");










//Need this to be the last code segment in base, so do not place any
//dojo.requireIf calls in this file. Otherwise, due to how the build system
//puts all requireIf dependencies after the current file, the require calls
//could be called before all of base is defined.
dojo.forEach(dojo.config.require, function(i){
	dojo["require"](i);
});

}

/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.io.windowName"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.io.windowName"] = true;
dojo.provide("dojox.io.windowName");
// Implements the window.name transport  

dojox.io.windowName = {
	send: function(/*String*/ method, /*dojo.__IoArgs*/ args){
		// summary:
		//		Provides secure cross-domain request capability.
		// 		Sends a request using an iframe (POST or GET) and reads the response through the 
		// 		frame's window.name.
		//
		//	method:
		//		The method to use to send the request, GET or POST
		//
		//	args:
		//		See dojo.xhr
		//
		//	args.authElement: DOMNode?
		//		By providing an authElement, this indicates that windowName should use the 
		// 		authorized window.name protocol, relying on
		//		the loaded XD resource to return to the provided return URL on completion
		//		of authorization/authentication. The provided authElement will be used to place
		//		the iframe in, so the user can interact with the server resource for authentication
		//		and/or authorization to access the resource.
		//
		//	args.onAuthLoad: Function?
		//		When using authorized access to resources, this function will be called when the
		// 		authorization page has been loaded. (When authorization is actually completed,
		// 		the deferred callback function is called with the result). The primary use for this
		// 		is to make the authElement visible to the user once the resource has loaded
		// 		(this can be preferable to showing the iframe while the resource is loading
		// 		since it may not require authorization, it may simply return the resource). 
		//  
		//	description:
		//		In order to provide a windowname transport accessible resources/web services, a server
		// 		should check for the presence of a parameter window.name=true and if a request includes
		// 		such a parameter, it should respond to the request with an HTML 
		// 		document that sets it's window.name to the string that is to be 
		// 		delivered to the client. For example, if a client makes a window.name request like:
		// 	|	http://othersite.com/greeting?windowname=true
		// 		And server wants to respond to the client with "Hello", it should return an html page:
		// |	<html><script type="text/javascript">
		// |	window.name="Hello";
		// |	</script></html>
		// 		One can provide XML or JSON data by simply quoting the data as a string, and parsing the data
		// 		on the client.
		//		If you use the authorization window.name protocol, the requester should include an
		// 		authElement element in the args, and a request will be created like:
		// 	|	http://othersite.com/greeting?windowname=auth
		// 		And the server can respond like this:
		// |	<html><script type="text/javascript">
		// |	var loc = window.name;
		// |	authorizationButton.onclick = function(){	
		// |		window.name="Hello";
		// |		location = loc;
		// |	};
		// |	</script></html>
		//		When using windowName from a XD Dojo build, make sure to set the 
		// 		dojo.dojoBlankHtmlUrl property to a local URL.
		args.url += (args.url.match(/\?/) ? '&' : '?') + "windowname=" + (args.authElement ? "auth" : true); // indicate our desire for window.name communication
		var authElement = args.authElement;
		var cleanup = function(result){
			try{
				// we have to do this to stop the wait cursor in FF 
				var innerDoc = dfd.ioArgs.frame.contentWindow.document;
				innerDoc.write(" ");
				innerDoc.close();
			}catch(e){}
			(authElement || dojo.body()).removeChild(dfd.ioArgs.outerFrame); // clean up
			return result;
		}
		var dfd = dojo._ioSetArgs(args,cleanup,cleanup,cleanup);
		if(args.timeout){
			setTimeout(function(){
					if(dfd.fired == -1){
						dfd.callback(new Error("Timeout"));
					}
				},
				args.timeout
			);
		}
		var self = dojox.io.windowName;
		if(dojo.body()){
			// the DOM is ready
			self._send(dfd, method, authElement, args.onAuthLoad);
		}else{
			// we will wait for the DOM to be ready to proceed
			dojo.addOnLoad(function(){
				self._send(dfd, method, authElement, args.onAuthLoad);
			});
		}
		return dfd;
	},
	_send: function(dfd, method, authTarget, onAuthLoad){

		var ioArgs = dfd.ioArgs;
		var frameNum = dojox.io.windowName._frameNum++;
		var sameDomainUrl = (dojo.config.dojoBlankHtmlUrl||dojo.config.dojoCallbackUrl||dojo.moduleUrl("dojo", "resources/blank.html")) + "#" + frameNum;
		var frameName = new dojo._Url(window.location, sameDomainUrl);
		var doc = dojo.doc;
		var frameContainer = authTarget || dojo.body();
		function styleFrame(frame){
			frame.style.width="100%";
			frame.style.height="100%";
			frame.style.border="0px";
		}
		if(dojo.isMoz && ![].reduce){
			// FF2 allows unsafe sibling frame modification,
			// the fix for this is to create nested frames with getters and setters to protect access
			var outerFrame = doc.createElement("iframe");
			styleFrame(outerFrame);
			if(!authTarget){
				outerFrame.style.display='none';
			}
			frameContainer.appendChild(outerFrame);
			
			var firstWindow = outerFrame.contentWindow;
			doc = firstWindow.document;
			doc.write("<html><body margin='0px'><iframe style='width:100%;height:100%;border:0px' name='protectedFrame'></iframe></body></html>");
			doc.close();
			var secondWindow = firstWindow[0]; 
			firstWindow.__defineGetter__(0,function(){});
			firstWindow.__defineGetter__("protectedFrame",function(){});
			doc = secondWindow.document;
			doc.write("<html><body margin='0px'></body></html>");
			doc.close();
			frameContainer = doc.body;
		}

        /** OWF PATCH to fix createElement usage for IE9 standards mode **/
		//var frame = ioArgs.frame = frame = doc.createElement(dojo.isIE ? '<iframe src="init_src.html" name="' + frameName + '" onload="'+dojox._scopeName+'.io.windowName['+frameNum+']()">' : 'iframe');
		var frame = ioArgs.frame = frame = doc.createElement(dojo.isIE < 9 ? '<iframe src="init_src.html" name="' + frameName + '" onload="'+dojox._scopeName+'.io.windowName['+frameNum+']()">' : 'iframe');
		styleFrame(frame);
		ioArgs.outerFrame = outerFrame = outerFrame || frame;
		if(!authTarget){
			outerFrame.style.display='none';
		}
		var state = 0;
		function getData(){
			var data = frame.contentWindow.name;
			if(typeof data == 'string'){
				if(data != frameName){
					state = 2; // we are done now
					dfd.ioArgs.hash = frame.contentWindow.location.hash;
					dfd.callback(data);
				}
			}
		}
		dojox.io.windowName[frameNum] = frame.onload = function(){
			try{
				if(frame.contentWindow.location =='about:blank'){
					// opera and safari will do an onload for about:blank first, we can ignore this first onload
					return;
				}
			}catch(e){
				// if we are in the target domain, frame.contentWindow.location will throw an ignorable error 
			}
			if(!state){
				// we have loaded the target resource, now time to navigate back to our domain so we can read the frame name
				state=1;
				if(authTarget){
					// call the callback so it can make it visible
					if(onAuthLoad){
						onAuthLoad();
					}
				}else{
					// we are doing a synchronous capture, go directly to our same domain URL and retrieve the resource
					frame.contentWindow.location = sameDomainUrl;
				}
			}
			// back to our domain, we should be able to access the frame name now
			try{
				if(state<2){
					getData();
				}
			}
			catch(e){
			}
			
		};
		frame.name = frameName;
		if(method.match(/GET/i)){
			// if it is a GET we can just the iframe our src url
			dojo._ioAddQueryToUrl(ioArgs);
			frame.src = ioArgs.url;
			frameContainer.appendChild(frame);
			// Commented these lines out for OWF-3131: REST calls get aborted when Marketplace widget is used in OWF.
//			if(frame.contentWindow){
//				frame.contentWindow.location.replace(ioArgs.url);
//			}
		}else if(method.match(/POST/i)){
			// if it is a POST we will build a form to post it
			frameContainer.appendChild(frame);
			var form = dojo.doc.createElement("form");
			dojo.body().appendChild(form);
			var query = dojo.queryToObject(ioArgs.query);
			for(var i in query){
				var values = query[i];
				values = values instanceof Array ? values : [values];
				for(var j = 0; j < values.length; j++){
					// create hidden inputs for all the parameters
					var input = doc.createElement("input");
					input.type = 'hidden';
					input.name = i;
					input.value = values[j];
					form.appendChild(input);
				}
			}
			form.method = 'POST';
			form.action = ioArgs.url;
			form.target = frameName;// connect the form to the iframe
			
			form.submit();
			form.parentNode.removeChild(form);
		}else{
			throw new Error("Method " + method + " not supported with the windowName transport");
		}
		if(frame.contentWindow){
			frame.contentWindow.name = frameName; // IE likes it afterwards
		}
	},
	_frameNum: 0 
	
}

}

if(!dojo._hasResource["dojox.secure.capability"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.secure.capability"] = true;
dojo.provide("dojox.secure.capability");

dojox.secure.badProps = /^__|^(apply|call|callee|caller|constructor|eval|prototype|this|unwatch|valueOf|watch)$|__$/;
dojox.secure.capability = {
	keywords: ["break", "case", "catch", "const", "continue","debugger", "default", "delete", "do",
		 "else", "enum","false", "finally", "for", "function","if", "in", "instanceof", "new", 
		 "null","yield","return", "switch",  
		 "throw", "true", "try", "typeof", "var", "void", "while"],
	validate : function(/*string*/script,/*Array*/safeLibraries,/*Object*/safeGlobals) {
		// summary:
		// 		pass in the text of a script. If it passes and it can be eval'ed, it should be safe. 
		// 		Note that this does not do full syntax checking, it relies on eval to reject invalid scripts.
		// 		There are also known false rejections:
		// 			Nesting vars inside blocks will not declare the variable for the outer block
		// 	 		Named functions are not treated as declaration so they are generally not allowed unless the name is declared with a var.	
		//			Var declaration that involve multiple comma delimited variable assignments are not accepted
		//
		// script:
		// 		 the script to execute
		//
		// safeLibraries:
		// 		The safe libraries that can be called (the functions can not be access/modified by the untrusted code, only called) 
		//
		// safeGlobals:
		// 		These globals can be freely interacted with by the untrusted code
		
	
		var keywords = this.keywords;
		for (var i = 0; i < keywords.length; i++) {
			safeGlobals[keywords[i]]=true;
		}
		var badThis = "|this| keyword in object literal without a Class call";
		var blocks = []; // keeps track of the outer references from each inner block
		if(script.match(/[\u200c-\u200f\u202a-\u202e\u206a-\u206f\uff00-\uffff]/)){
			throw new Error("Illegal unicode characters detected");
		}
		if(script.match(/\/\*@cc_on/)){
			throw new Error("Conditional compilation token is not allowed");
		}
		script = script.replace(/\\["'\\\/bfnrtu]/g, '@'). // borrows some tricks from json.js
			// now clear line comments, block comments, regular expressions, and strings.
			// By doing it all at once, the regular expression uses left to right parsing, and the most
			// left token is read first. It is also more compact.
			replace(/\/\/.*|\/\*[\w\W]*?\*\/|\/(\\[\/\\]|[^*\/])(\\.|[^\/\n\\])*\/[gim]*|("[^"]*")|('[^']*')/g,function(t) {
				return t.match(/^\/\/|^\/\*/) ? ' ' : '0'; // comments are replaced with a space, strings and regex are replaced with a single safe token (0)
			}).
			replace(/\.\s*([a-z\$_A-Z][\w\$_]*)|([;,{])\s*([a-z\$_A-Z][\w\$_]*\s*):/g,function(t,prop,prefix,key) { 
				// find all the dot property references, all the object literal keys, and labels
				prop = prop || key; 
				if(/^__|^(apply|call|callee|caller|constructor|eval|prototype|this|unwatch|valueOf|watch)$|__$/.test(prop)){
					throw new Error("Illegal property name " + prop);
				}
				return (prefix && (prefix + "0:")) || '~'; // replace literal keys with 0: and replace properties with the innocuous ~
			});
		script.replace(/([^\[][\]\}]\s*=)|((\Wreturn|\S)\s*\[\s*\+?)|([^=!][=!]=[^=])/g,function(oper) {// check for illegal operator usages
			if(!oper.match(/((\Wreturn|[=\&\|\:\?\,])\s*\[)|\[\s*\+$/)){ // the whitelist for [ operator for array initializer context or [+num] syntax
				throw new Error("Illegal operator " + oper.substring(1));
			}
		});
		script = script.replace(new RegExp("(" + safeLibraries.join("|") + ")[\\s~]*\\(","g"),function(call) { // find library calls and make them look safe
			return "new("; // turn into a known safe call 
		});
		function findOuterRefs(block,func) {
			var outerRefs = {};
			block.replace(/#\d+/g,function(b) { // graft in the outer references from the inner scopes
				var refs = blocks[b.substring(1)];
				for (var i in refs) {
					if(i == badThis) {
						throw i;
					}
					if(i == 'this' && refs[':method'] && refs['this'] == 1) {
						// if we are in an object literal the function may be a bindable method, this must only be in the local scope
						i = badThis;
					}
					if(i != ':method'){
						outerRefs[i] = 2; // the reference is more than just local
					}
				}
			});
			block.replace(/(\W|^)([a-z_\$A-Z][\w_\$]*)/g,function(t,a,identifier) { // find all the identifiers
				if(identifier.charAt(0)=='_'){
					throw new Error("Names may not start with _");
				}
				outerRefs[identifier] = 1;
			});
			return outerRefs;
		}	
		var newScript,outerRefs;
		function parseBlock(t,func,a,b,params,block) {
			block.replace(/(^|,)0:\s*function#(\d+)/g,function(t,a,b) { // find functions in object literals
			// note that if named functions are allowed, it could be possible to have label: function name() {} which is a security breach
					var refs = blocks[b]; 
					refs[':method'] = 1;//mark it as a method
			});
			block = block.replace(/(^|[^_\w\$])Class\s*\(\s*([_\w\$]+\s*,\s*)*#(\d+)/g,function(t,p,a,b) { // find Class calls
					var refs = blocks[b];
					delete refs[badThis];
					return (p||'') + (a||'') + "#" + b;
			});
			outerRefs = findOuterRefs(block,func); // find the variables in this block
			function parseVars(t,a,b,decl) { // find var decls
				decl.replace(/,?([a-z\$A-Z][_\w\$]*)/g,function(t,identifier) {
					if(identifier == 'Class'){
						throw new Error("Class is reserved");
					}
					delete outerRefs[identifier]; // outer reference is safely referenced here
				});
			}
			
			if(func) {
				parseVars(t,a,a,params); // the parameters are declare variables
			}
			block.replace(/(\W|^)(var) ([ \t,_\w\$]+)/g,parseVars); // and vars declare variables
			// FIXME: Give named functions #name syntax so they can be detected as vars in outer scopes (but be careful of nesting)
			return (a || '') + (b || '') + "#" + (blocks.push(outerRefs)-1); // return a block reference so the outer block can fetch it 
		}	
		do {
			// get all the blocks, starting with inside and moving out, capturing the parameters of functions and catchs as variables along the way
			newScript = script.replace(/((function|catch)(\s+[_\w\$]+)?\s*\(([^\)]*)\)\s*)?{([^{}]*)}/g, parseBlock); 
		}
		while(newScript != script && (script = newScript)); // keep going until we can't find anymore blocks
		parseBlock(0,0,0,0,0,script); //findOuterRefs(script); // find the references in the outside scope
		for (i in outerRefs) {
			if(!(i in safeGlobals)) {
				throw new Error("Illegal reference to " + i);
			}
		}
		
	}
};

}

	//INSERT dojo.i18n._preloadLocalizations HERE

	//Check if document already complete, and if so, just trigger page load
	//listeners. NOTE: does not work with Firefox before 3.6. To support
	//those browsers, set djConfig.afterOnLoad = true when you know Dojo is added
	//after page load. Using a timeout so the rest of this
	//script gets evaluated properly. This work needs to happen after the
	//dojo.config.require work done in dojo._base.
	if(dojo.isBrowser && (document.readyState === "complete" || dojo.config.afterOnLoad)){
		window.setTimeout(dojo._loadInit, 100);
	}
})();


/**
 * @ignore
 */
var Ozone = Ozone || {};
/**
 * @ignore
 */
Ozone.util = Ozone.util || {};
/**
 * @namespace
 */
Ozone.util.pageLoad = Ozone.util.pageLoad || {};

/**
 * @field
 * @description enable or disable the automatic sending of loadtime
 */
Ozone.util.pageLoad.autoSend = true;

/**
 * @field
 * @description holds the current date time, before the onload of the widget
 */
Ozone.util.pageLoad.beforeLoad = (new Date()).getTime();

/**
 * @field
 * @description holds current date time after the onload of the widget.  this value will be set after onload
 */
Ozone.util.pageLoad.afterLoad = null;


Ozone.util.pageLoad.calcLoadTime = function(time) {
  /**
   * @field
   * @description Holds the load time of the widget.  This may be altered to allow the widget to determine it's load time.
   *   loadTime is sent via the Eventing API, if altering this value do so before Eventing is initialized
   */
  Ozone.util.pageLoad.loadTime = (time != null ? time : Ozone.util.pageLoad.afterLoad) - Ozone.util.pageLoad.beforeLoad;
  return Ozone.util.pageLoad.loadTime;
};

var Ozone = Ozone || {};
Ozone.version = Ozone.version || {};

Ozone.version = {
		
		owfversion : '6.0.0-GA',

        mpversion : '2.3',

		preference : '-v1',
		
		eventing : '-v1',
		
		widgetLauncher : '-v1',
		
		state : '-v1',
		
        dragAndDrop : '-v1',

        widgetChrome : '-v1',

		logging : '-v1',
		
		language : '-v1'
		
};

/**
 * @ignore
 */
var Ozone = Ozone || {};
Ozone.util = Ozone.util || {};
Ozone.util.formField = Ozone.util.formField || {};
Ozone.config = Ozone.config || {};

/**
 * @private
 * 
 * @description This method is useful if you want to see if a specfic url is the same
 * as the local url.  Can be used to test if AJAX can be used.  If url
 * is not a URL, it's assumed to be a relative filename, so this function
 * returns true.
 *
 * @param {String} url String that you want to check to see if its local.
 *
 * @returns Boolean
 *
 * @throws "Not a valid URL" if the parameter is not a valid url
 */
Ozone.util.isUrlLocal = function(url) {

    var webContextPath = Ozone.util.contextPath();

    //append last '/' this value should never be null
    if (webContextPath != '' && webContextPath != null) {
        webContextPath += '/';
    }

    //this regex matches urls against the configured webcontext path https://<contextPath>/.....
    //only one match is possible since this regex matches from the start of the string
    var regex = new RegExp("^(https?:)//([^/:]+):?(.*)" + webContextPath);
    var server = url.match(regex);

    //check if this might be a relative url 
    if (!server) {
        if (url.match(new RegExp('^https?:\/\/'))) {
            return false;
        }
        else {
            return true;
        }
    }

    var port = window.location.port || ( window.location.protocol === "https:" ? "443" : "80" )

    return window.location.protocol === server[1] && window.location.hostname === server[2] && port === server[3]
};

/**
 * @private
 *
 * @description This method will convert a string into a json object.  There is a check
 * done to ensure no unsafe json is included.
 *
 * @param {String} str String that represents a json object
 *
 * @returns {Object} json object
 *
 * @throws Error if parameter is not a string
 * @throws Error if secure check finds unsafe JSON
 * @throws Error if there is an issue converting to JSON
 *
 * @requires dojox.secure.capability
 * @requires dojo base
 */
Ozone.util.parseJson = function(str) {
    if (typeof(str) === 'string') {
        owfdojox.secure.capability.validate(str,[],{}); // will error if there is unsafe JSON
        var x = owfdojo.fromJson(str);
        return x;
    } else {
        throw "Ozone.util.parseJson expected a string, but didn't get one";
    }
};

/**
 * @private
 */
Ozone.util.HTMLEncodeReservedJS = function(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, "&#39;");
};

/**
 * @private
 * 
 * @description Similar to Ext.util.Format.htmlEncode except this method also handles the single quote
 */
Ozone.util.HTMLEncode = function(str){
    return !str ? str : String(str).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};

/**
 * @private
 *
 * @description This method returns the current context path by
 * calling a controller at the server (will not
 * make the call if it has already been done).
 * 
 * @param {Object} o unused
 *
 * @returns context path with leading slash
 *          (ex. "/owf")
 *
 * @requires Ext base, dojo
 */
Ozone.util.contextPath = function(o) {

    if (Ozone.config.webContextPath == null) {
        //check window name for the property
        var configParams = Ozone.util.parseWindowNameData();
        if (configParams != null) {
            // launchConfig
            if (configParams.webContextPath != null) {
                Ozone.config.webContextPath = configParams.webContextPath;
            }
        }
    }

    // return empty string if a valid context path wasn't found on window.name
    return Ozone.config.webContextPath || '';
};

/**
 * @private
 * 
 * @description Checks whether the url context is local or not,
 * then returns the valid url w/ context.
 * 
 * @param {String} value the url
 * @param {String} validContext valid context
 *
 * @returns valid url w/context if necessary, if not local then the url
 */
Ozone.util.validUrlContext = function(value, validContext){
    var containsRelDotPath = (value.indexOf("../") == 0)?true:false;
    var containsRelPath = (value.indexOf("/") == 0)?true:false;
    var isLocalUrl = (containsRelPath || containsRelDotPath || (value.indexOf("localhost") == 7) || (value.indexOf("localhost") == 11) || (value.indexOf("127.0.0.1") == 7)) ? true : false;
    var urlValidContext = value;
    validContext = ((validContext == undefined) ? Ozone.util.contextPath() : validContext);
    if((isLocalUrl == true) && (validContext != null)){
        if(containsRelPath){
            urlValidContext = String.format("{0}{1}", validContext, value);
        }else if(containsRelDotPath){
            var valuePathNoRel = value.substring(3);
            urlValidContext = String.format("{0}/{1}", validContext, valuePathNoRel);
        }
    }
    return urlValidContext;
};

/**
 * @private
 *
 * @description This method centralizes the container relay file for
 * RPC calls.
 *
 * @returns relay file path with context
 */
Ozone.util.getContainerRelay = function() {
    return Ozone.util.contextPath() + 
    '/js/eventing/rpc_relay.uncompressed.html';
};

/**
 * @private
 *
 * Constructively clears the entire array
 */
Ozone.util.parseWindowNameData = function() {
  var configParams = null;
  return function() {

    //if already parsed just return the value
    if (configParams) return configParams;

    //parse out the config
    try {
      configParams = Ozone.util.parseJson(
              window.name
      );
      return configParams;
    }
    catch (e) {
      return null;
    }
  }
}();

/**
 * @private
 * 
 * @description This method will convert anything to a string.
 * There is no check for recursion, so don't do that
 *
 * @param {Object} obj object to convert
 *
 * @returns string
 *
 * @requires dojo base
 */
Ozone.util.toString = function(obj) {
    if (typeof(obj) === 'object') {
        return owfdojo.toJson(obj);
    } else {
        return obj+'';
    }
};

/**
 * @private
 */
Ozone.util.formatWindowNameData = function(data) {
    // this value needs to be not uri encoded
    // return decodeURIComponent(owfdojo.objectToQuery(data));
    return Ozone.util.toString(data);
};

/**
 * @private
 *  
 * Removes the Leading and Trailing Spaces in any ExtJs Form Field
 */
Ozone.util.formField.removeLeadingTrailingSpaces = function(thisField){
    var thisField_noLeadingTrailingSpacesValue = thisField.getValue().replace(new RegExp(Ozone.lang.regexLeadingTailingSpaceChars), '');
    thisField.setValue(thisField_noLeadingTrailingSpacesValue);
    return thisField_noLeadingTrailingSpacesValue;
};

if (!Ozone.util.ModalBox) {
    Ozone.util.ModalBox = function() {
        var ab = 'absolute';
        var n = 'none';
        var obody = document.getElementsByTagName('body')[0];
        var frag = document.createDocumentFragment();
        var obol = document.createElement('div');
        obol.setAttribute('id', 'ol');
        obol.style.display = n;
        obol.style.position = ab;
        obol.style.top = 0;
        obol.style.left = 0;
        obol.style.zIndex = 10000;
        obol.style.width = '100%';
        obol.style.backgroundColor = "#555";
        obol.style.filter = 'alpha(opacity=50)';
        obol.style.MozOpacity = 0.5;
        obol.style.opacity = 0.5;

        
        frag.appendChild(obol);
        this.obol = obol;
        var obbx = document.createElement('div');
        obbx.setAttribute('id', 'mbox');
        obbx.style.display = n;
        obbx.style.position = ab;
        obbx.style.backgroundColor = '#eee';
        obbx.style.padding = '8px';
        obbx.style.border = '2px outset #666';
        obbx.style.zIndex = 10001;
        this.obbx = obbx;
        var obl = document.createElement('span');
        obbx.appendChild(obl);
        var obbxd = document.createElement('div');
        obbxd.setAttribute('id', 'mbd');
        var d = document.createElement('div');
        var txt = document.createElement('span');
        txt.innerHTML = 'Press OK to continue.';
        this.txt = txt;
        var d2 = document.createElement('div');
        d2.style.textAlign = 'center';
        d2.style.fontSize = '14px';
        d2.appendChild(txt);
        d2.appendChild(document.createElement('br'));       
        var but = document.createElement('button');
        
        but.innerHTML = 'OK';
        var self = this;
        but.onclick= function()
        {
            self.hide();
        }
        d2.appendChild(but);
        d.appendChild(d2);
        obbxd.appendChild(d);
        this.obbxd = obbxd;
        obl.appendChild(obbxd);
        frag.insertBefore(obbx, obol.nextSibling);
        obody.insertBefore(frag, obody.firstChild);
        window.onscroll = function(){
            self.scrollFix();
        }
        window.onresize = function(){
            self.sizeFix();
        }
    }
    
    Ozone.util.ModalBox.prototype.pageWidth = function () {
        return window.innerWidth != null ? window.innerWidth
        : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth
        : document.body != null ? document.body.clientWidth : null;
    }
    Ozone.util.ModalBox.prototype.pageHeight = function () {
        return window.innerHeight != null ? window.innerHeight
        : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight
        : document.body != null ? document.body.clientHeight : null;
    }
    Ozone.util.ModalBox.prototype.posLeft = function() {
        return typeof window.pageXOffset != 'undefined' ? window.pageXOffset
        : document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft
        : document.body.scrollLeft ? document.body.scrollLeft : 0;
    }
    Ozone.util.ModalBox.prototype.posTop = function () {
        return typeof window.pageYOffset != 'undefined' ? window.pageYOffset
        : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop
        : document.body.scrollTop ? document.body.scrollTop : 0;
    }

    Ozone.util.ModalBox.prototype.scrollFix = function() 
    {
        //var obol = $('ol');
        this.obol.style.top = this.posTop() + 'px';
        this.obol.style.left = this.posLeft() + 'px'
    }
    Ozone.util.ModalBox.prototype.sizeFix = function () {
        //var obol = $('ol');
        this.obol.style.height = this.pageHeight() + 'px';
        this.obol.style.width = this.pageWidth() + 'px';
        var tp = this.posTop() + ((this.pageHeight() - this.height) / 2) - 12;
        var lt = this.posLeft() + ((this.pageWidth() - this.width) / 2) - 12;
        this.obbx.style.top = (tp < 0 ? 0 : tp) + 'px';
        this.obbx.style.left = (lt < 0 ? 0 : lt) + 'px';

    }
    Ozone.util.ModalBox.prototype.kp = function (e) {
        ky = e ? e.which : event.keyCode;
        if (ky == 88 || ky == 120)
            this.hide();
        return false
    }
    Ozone.util.ModalBox.prototype.inf = function (h) {
        tag = document.getElementsByTagName('select');
        for (i = tag.length - 1; i >= 0; i--)
            tag[i].style.visibility = h;
        tag = document.getElementsByTagName('iframe');
        for (i = tag.length - 1; i >= 0; i--)
            tag[i].style.visibility = h;
        tag = document.getElementsByTagName('object');
        for (i = tag.length - 1; i >= 0; i--)
            tag[i].style.visibility = h;
    }
    Ozone.util.ModalBox.prototype.hide = function () {
        var v = 'visible';
        var n = 'none';
        this.obol.style.display = n;
        this.obbx.style.display = n;
        this.inf(v);
        document.onkeypress = ''
    }
    Ozone.util.ModalBox.prototype.show = function (msg,wd, ht) {
        var h = 'hidden';
        var b = 'block';
        var p = 'px';
        wd = wd | 200;
        ht = ht | 100;
        var obol = this.obol
        var obbxd = this.obbxd;
        this.txt.innerHTML = msg;
        obol.style.height = this.pageHeight() + p;
        obol.style.width = this.pageWidth() + p;
        obol.style.top = this.posTop() + p;
        obol.style.left = this.posLeft() + p;
        obol.style.display = b;
        var tp = this.posTop() + ((this.pageHeight() - ht) / 2) - 12;
        var lt = this.posLeft() + ((this.pageWidth() - wd) / 2) - 12;
        var obbx = this.obbx
        obbx.style.top = (tp < 0 ? 0 : tp) + p;
        obbx.style.left = (lt < 0 ? 0 : lt) + p;
        obbx.style.width = wd + p;
        obbx.style.height = ht + p;
        this.inf(h);
        obbx.style.display = b;
        this.width = wd;
        this.height = ht;
        return false;
    }
}
if (!Ozone.util.ErrorDlg) 
{
    Ozone.util.ErrorDlg = {};
    Ozone.util.ErrorDlg.show=function(msg,width,height)
    {
        if (!this.dlgBox)
            this.dlgBox = new Ozone.util.ModalBox();
        this.dlgBox.show(msg,width,height);
    };
}


/**
 * @private
 */
Ozone.util.fireBrowserEvent = function(dom, type, bubble, cancelable) {
    if (document.createEvent) {
        var event = document.createEvent('Events');
        event.initEvent(type, bubble || true, cancelable || true);
        dom.dispatchEvent(event);
    }
    else if (document.createEventObject) {
        dom.fireEvent('on' + type);
    }
};

/**
    Clones dashboard and returns a dashboard cfg object that can be used to create new dashboards.
    @name cloneDashboard
    @methodOf OWF.Util

    @returns Object dashboard cfg object that can be used to create new dashboards.
 */
Ozone.util.cloneDashboard = function(dashboardCfg, regenerateIds, removeLaunchData) {
    
    var dashboardStr = Ozone.util.toString(dashboardCfg);

    if(regenerateIds === true) {
        var newDashboardGuid = guid.util.guid(),
            dashboardGuid = dashboardCfg.guid;

        // update dashboard guid
        dashboardStr = dashboardStr.replace(new RegExp(dashboardGuid, 'g'), newDashboardGuid);
        dashboardStrCopy = dashboardStr;

        // update widget instance ids
        var widgetInstanceIdRegex = /\"uniqueId\"\:\"([A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12})\"/g;
        var result;
        while ((result = widgetInstanceIdRegex.exec(dashboardStrCopy)) != null) {
            // var msg = "Found " + result[1];
            // console.log(msg);
            dashboardStr = dashboardStr.replace(new RegExp(result[1], 'g'), guid.util.guid());
        }
    }

    var dashboard = Ozone.util.parseJson(dashboardStr);
    
    if(removeLaunchData === true) {
        var cleanData = function(cfg) {
            if(!cfg || !cfg.items)
                return;

            if(cfg.items.length === 0 && cfg.widgets) {
                for(var i = 0, len = cfg.widgets.length; i < len; i++) {
                    console.log('deleteing launchData', cfg.widgets[i].launchData);
                    delete cfg.widgets[i].launchData;
                }
            }
            else {
                for(var i = 0, len = cfg.items.length; i < len; i++) {
                    cleanData(cfg.items[i]);
                }

            }
        };

        cleanData(dashboard.layoutConfig);
    }

    return dashboard;
};

Ozone.util.createRequiredLabel= function(label) {
    return "<span class='required-label'>" + label + " <span class='required-indicator'>*</span></span>";
}
var guid = guid || {};
var Ozone = Ozone || {};
Ozone.util = Ozone.util || {};

guid.util = function() {
	function S4() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
	return {
		guid : function () {
		  	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		}
	};
}();

/**
 * @description Returns a globally unique identifier (guid)
 * 
 * @returns {String} guid
 */
Ozone.util.guid = function() {
    return guid.util.guid();
}
/*
 * This file contains constant definitions that define global OWF hotkeys
 */

Ozone = Ozone || {};
Ozone.components = Ozone.components || {};
Ozone.components.keys = Ozone.components.keys || {};
Ozone.components.keys.EVENT_NAME = 'keyup'; //keyup only fires once, which is what we want. keydown may fire repeatedly
Ozone.components.keys.HotKeys = Ozone.components.keys.HotKeys || {};
Ozone.components.keys.MoveHotKeys = Ozone.components.keys.MoveHotKeys || {};

(function() {
    var k = Ozone.components.keys.HotKeys;
    
    /*
    * keys are defined here.  Each key is defined
    * as the Ext.EventObject constant representing
    * that key. Unfortunately, since this file is
    * included both container side and widget side, 
    * it cannot actually use the Ext.EventObject constants
    * since Ext is not defined widget side. Therefore
    * we use the owfdojo constants and ascii codes, which happen
    * to all be the same as the Ext constants.  
    */
    k.SETTINGS = {
        key: 'S'.charCodeAt(0),
        exclusive: true
    }; 
    
    k.ADMINISTRATION= {
        key: 'A'.charCodeAt(0),
        exclusive: true
    };

    k.MARKETPLACE= {
        key: 'M'.charCodeAt(0),
        exclusive: true
    };

    k.METRIC= {
        key: 'R'.charCodeAt(0),
        exclusive: true
    };

    k.LAUNCH_MENU = { key: 'L'.charCodeAt(0) };

    k.HELP = {
        key: 'H'.charCodeAt(0),
        exclusive: true
    };

    k.LOGOUT = { key: 'O'.charCodeAt(0) }; //O for 'out'

    k.PREVIOUS_DASHBOARD = { key: owfdojo.keys.PAGE_UP }; 
    
    k.NEXT_DASHBOARD = { key: owfdojo.keys.PAGE_DOWN };

    k.DASHBOARD_SWITCHER = {
        key: 'C'.charCodeAt(0),
        exclusive: true
    };
    
    k.WIDGET_SWITCHER = {
        key: 'Q'.charCodeAt(0),
        exclusive: true
    }; 
    
    k.DEFAULT_DASHBOARD = { key: owfdojo.keys.HOME };
    
    k.CLOSE_WIDGET = { key: 'W'.charCodeAt(0) }; 
    
    k.MAXIMIZE_COLLAPSE_WIDGET = { 
        key: owfdojo.keys.UP_ARROW,
        focusParent: false
    };
    
    k.MINIMIZE_EXPAND_WIDGET = { 
        key: owfdojo.keys.DOWN_ARROW,
        focusParent: false
    };
    
    k.ESCAPE_FOCUS = { 
        key: owfdojo.keys.ESCAPE,
        //the escape key should not use alt+shift
        alt: false,
        shift: false
    };

    // hash map of key codes
    var keyCodes = {};

    //Add shift and alt modifiers to 
    //all keys that don't already have
    //them. Default to requiring both
    //shift and alt
    for (var key_i in k) {
        var hotKey = k[key_i];

        if (hotKey.alt === undefined) {
            hotKey.alt = true;
        }
        if (hotKey.shift === undefined) {
            hotKey.shift = true;
        }
        if (hotKey.focusParent === undefined) {
            hotKey.focusParent = true;
        }
        keyCodes[hotKey.key] = hotKey;
    }

    // for owf specific hotkeys, prevent default on keydown
    // this is necessary for IE
    owfdojo.connect(document, 'onkeydown', function(event) {
        var hotKey = keyCodes[event.keyCode];

        if(hotKey && event.altKey === hotKey.alt 
            && event.shiftKey === hotKey.shift) {
            event.preventDefault();
        }
    });

    var moveKeys = Ozone.components.keys.MoveHotKeys;
    moveKeys.MOVE_UP = {
        key: owfdojo.keys.UP_ARROW
    };
    moveKeys.MOVE_RIGHT = {
        key: owfdojo.keys.RIGHT_ARROW
    };
    moveKeys.MOVE_DOWN = {
        key: owfdojo.keys.DOWN_ARROW
    };
    moveKeys.MOVE_LEFT = {
        key: owfdojo.keys.LEFT_ARROW
    };

    for (key_i in moveKeys) {
        var hotKey = moveKeys[key_i];

        if (hotKey.ctrl === undefined) {
            hotKey.ctrl = true;
        }
        if (hotKey.alt === undefined) {
            hotKey.alt = false;
        }
        if (hotKey.shift === undefined) {
            hotKey.shift = false;
        }
        if (hotKey.focusParent === undefined) {
            hotKey.focusParent = false;
        }
    }
})();


Ozone = Ozone || {};
Ozone.components = Ozone.components || {};
Ozone.components.keys = Ozone.components.keys || {};

Ozone.components.keys.createKeyEventSender = function(widgetEventingController) {
    var keyChannelName = '_keyEvent',
        rpc = gadgets.rpc,
        callrpc = rpc.call;

    
    rpc.register('_focus_widget_window', function() {
        try {
            window.focus();
        }
        catch(e) {}
    });

    callrpc('..', '_widget_iframe_ready', null, widgetEventingController.getWidgetId());

    owfdojo.connect(document, 'on' + Ozone.components.keys.EVENT_NAME, this, function(keyevent) {
        var keys = Ozone.components.keys.HotKeys,
            key, found = false;

        for (var key_i in keys) {
            key = keys[key_i];

            if (key.key === keyevent.keyCode 
                && key.alt === keyevent.altKey
                && key.shift === keyevent.shiftKey) {

                if(key.focusParent === true) {
                    parent.focus();
                    //window.blur();
                }

                callrpc('..', '_key_eventing', null, widgetEventingController.getWidgetId(), {
                    keyCode: keyevent.keyCode,
                    altKey: keyevent.altKey,
                    shiftKey: keyevent.shiftKey,
                    focusParent: key.focusParent
                });

                found = true;
                break;  //in case the same key is in keys twice, we still only want
                        //to send one event
            }
        }

        if(found === true) {
            return;
        }

        keys = Ozone.components.keys.MoveHotKeys;

        for (var key_i in keys) {
            key = keys[key_i];

            if (key.key === keyevent.keyCode 
                && key.ctrl === keyevent.ctrlKey
                && key.alt === keyevent.altKey
                && key.shift === keyevent.shiftKey) {
                
                callrpc('..', '_key_eventing', null, widgetEventingController.getWidgetId(), {
                    keyCode: keyevent.keyCode,
                    ctrlKey: keyevent.ctrlKey,
                    altKey: keyevent.altKey,
                    shiftKey: keyevent.shiftKey,
                    focusParent: key.focusParent
                });

                break;
            }
        }
    });

    owfdojo.connect(document, 'onkeydown', this, function(keyevent) {
        var keys = Ozone.components.keys.MoveHotKeys,
            key;

        for (var key_i in keys) {
            key = keys[key_i];

            if (key.key === keyevent.keyCode 
                && key.ctrl === keyevent.ctrlKey
                && key.alt === keyevent.altKey
                && key.shift === keyevent.shiftKey) {

                callrpc('..', '_key_eventing', null, widgetEventingController.getWidgetId(), {
                    keyCode: keyevent.keyCode,
                    ctrlKey: keyevent.ctrlKey,
                    altKey: keyevent.altKey,
                    shiftKey: keyevent.shiftKey,
                    keydown: true,
                    focusParent: key.focusParent
                });

                break;
            }
        }
    });
};

var Ozone = Ozone || {};
Ozone.layout = Ozone.layout || {};
Ozone.ux = Ozone.ux || {};
Ozone.util = Ozone.util || {};

/*
 * General Algorithm 
 * 
 * if queryString contains lang parameter swith to that locale
 * else check browser language setting
 * 
 * Language switching is accomplished by incliuding a locale
 * specific javascript file
 */
/**
 * @class
 * @description Provides utility methods for localization
 */
Ozone.lang = {
	languageSetting : 'en-US', 
	
	regexLeadingTailingSpaceChars: /^\s+|\s+$/g,
	
	regexTrailingSpaceChars: /\s+$/,
	
	regexLeadingSpaceChars: /^\s+/,
	
	version : Ozone.version.owfversion + Ozone.version.language,
	
	urlDecode: function(string, overwrite){
        if (!string || !string.length) {
            return {};
        }
        var obj = {};
        var pairs = string.split('&');
        var pair, name, value;
        for (var i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].split('=');
            name = decodeURIComponent(pair[0]);
            value = decodeURIComponent(pair[1]);
            if (overwrite !== true) {
                if (typeof obj[name] == "undefined") {
                    obj[name] = value;
                }
                else 
                    if (typeof obj[name] == "string") {
                        obj[name] = [obj[name]];
                        obj[name].push(value);
                    }
                    else {
                        obj[name].push(value);
                    }
            }
            else {
                obj[name] = value;
            }
        }
        return obj;
    },
	
    /**
     * @description Gets the language that is currently being used by OWF
     * @return Returns the ISO 639-1 language code for the language that is currently being used by OWF
     * @example
     * if (Ozone.lang.getLanguage() == 'es') {
     *   AnnouncingClockStrings.timeLabel = 'El tiempo es';
     * } 
     * 
     */
	getLanguage : function() {
	    var params = Ozone.lang.urlDecode(window.location.search.substring(1));
        if (params.lang) {
			return params.lang;
		}
        else {

          //try to find it in the window.name
          if (Ozone.util.parseWindowNameData) {

            var data = Ozone.util.parseWindowNameData();
            if (data != null && data.lang) {
              return data.lang;
            }
          }
        }

        //just use default
        return Ozone.lang.languageSetting;  
    } 
};

Ozone.layout.Menu = {
	overflowMenuButtonTooltip : "Click to show more buttons"
};

Ozone.layout.ConfigurationWindowString = {
	setAsNew : "Save as new", 
    setAsDefault : "Set as default",
    showCarousel : "Show Launch Menu",
    showShortcuts : "Show Shortcuts",
    showToolbar : "Show toolbar options",
    documentTitle : "Document Title",
	
	topSelector : 'Top', 
    centerSelector : 'Center',
    accordionSelector : 'Accordion', 
    toolbarButtons : 'Toolbar Buttons', 
    clear : 'Clear',
    save : 'OK',
    cancel : 'Cancel',
    clearAll: 'Clear All',
	
    column : 'Column', 
    columns : 'Columns',
	
    tab : 'Tab', 
    tabs : 'Tabs'
};

Ozone.layout.CreateViewWindowString = {
    createNew: 'Create new',
    createFromExisiting: 'Create from existing',
    importView: 'Import'
};

Ozone.layout.ManageViewsWindowString = {
    languages: 'Language'
};

Ozone.layout.ToolbarString = {
   configurationManager : 'Configuration Manager'
};

Ozone.layout.DesktopWindowManagerString = {
    configureDashboard : 'Configure Dashboard', 
    toggleCarousel : 'Toggle Launch Menu',
    welcomeMessage : 'Welcome'
};

Ozone.layout.tooltipString = {
	widgetLaunchMenuTitle: 			'Launch Menu',
	manageDashboardsTitle: 			'Dashboard Settings',
	manageDashboardsContent: 		'This screen allows users to rearrange, edit, and delete dashboards. It also allows users to set their language preference.',
	createDashboardTitle: 			'Create Dashboard',
	createDashboardContent: 		'This screen allows users to create blank dashboards, copy an existing dashboard, or import a dashboard from a shared configuration.',
	addWidgetsTitle: 				'Launch Menu (Alt+Shift+L)',
	addWidgetsContent: 				'This button opens or closes the Launch Menu, allowing users to add widgets to their current dashboard.',
	dashboardSwitcherTitle:			'Dashboard Switcher (Alt+Shift+C)',
	dashboardSwitcherContent:		'This button opens or closes the Dashboard Switcher, allowing users to switch between their dashboards.',
	marketplaceWindowTitle:			'Marketplace (Alt+Shift+M)',
	marketplaceWindowContent:		'This button opens the Marketplace window, allowing users to discover widgets in Marketplace and add them to their OWF instance.',
    metricWindowTitle:		    	'Metric (Alt+Shift+R)',
    metricWindowContent:      		'This button opens the Metric window, where widgets that monitor OWF and widget statistics are located.',
	settingsTitle:					'Settings (Alt+Shift+S)',
	settingsContent:				'This button opens the Settings window, exposing users to functionality for customizing their dashboards, theme, and widgets. ',
	adminToolsTitle:				'Administration (Alt+Shift+A)',
	adminToolsContent:				'This button opens the Administration window, exposing administrators to functionality for managing groups, dashboards, widgets, and users.',
	helpTitle:						'Help (Alt+Shift+H)',
	helpContent:					'This button opens the Help window, allowing users to browse help files for assistance on using OWF.',
	shareTitle: 					'Share Dashboard',
	shareContent: 					'This feature allows a user to export their current dashboard so that other users can import it.',
	customizeDashboardTitle:		'Customize Dashboard',
	customizeDashboardContent: 		'This screen allows users to customize the current dashboard.',
	eventingTitle:					'Dynamic Eventing',
	eventingContent: 				'This screen allows users to manage dynamic widget eventing.',
    themeSelectorTitle:             'Change the styling of your OWF',
    themeSelectorContent:           'This screen allows users to change the background, window color and style for OWF.',
	showBannerTitle: 				'Show/Hide Banner',
	showBannerContent: 				'This button shows and hides the bottom two rows of the dashboard banner.',
	carouselCloseContent: 			'This button closes the widget Launch Menu.',
	carouselCloseTitle: 			'Close Launch Menu',
	carouselManageWidgetsTitle:		'Widget Settings',
	carouselManageWidgetsContent: 	'This screen allows users to customize their Launch Menu, controlling which widgets are visible and the order in which they appear. It also allows for the deletion of widgets and contains a link to the OWF Marketplace. The grouping tags of a widget can also be modified in this screen.',
	adminWDEditTitle: 				'Edit Widget Definition',
	adminWDEditContent: 			'Change the properties of a widget definition. Note that while properties such as URLs will propagate to already existing instances of a widget, malleable properties such as height will not be affected.',
	adminWDDeleteTitle: 			'Delete Widget Definition',
	adminWDDeleteContent: 			'Deletes the selected widget definition. In addition to removing the definition itself, all instances of this widget will be removed from all user dashboards.',
	adminDashAddTitle:				'Add Dashboard',
	adminPWDApplyTitle:				'Apply User Widgets',
    adminPWDApproveTitle:			'Approve User Widgets',
	adminDashCopyTitle: 			'Copy Dashboard',
	adminDashCopyContent: 			'Copy an existing dashboard to one or more users. Note that once copied, each dashboard instance is an independent entity. Changes made to the initial dashboard at a later date will not be copied.',
	adminDashEditTitle: 			'Edit Dashboard',
	adminDashEditContent: 			'Changes the properties of a dashboard. Note that dashboard state is represented as a JSON object, and any changes made to it must be valid JSON.',
	adminDashDeleteTitle: 			'Delete Dashboard',
	adminDashDeleteContent: 		'Deletes the selected dashboard. Note that if a user is currently using the dashboard, they will not be kicked out. However, it will not be available once they navigate away.',
	adminPrefsCopyTitle: 			'Copy Preference',
	adminPrefsCopyContent: 			'Copy an existing preference to one or more users. Note that once copied, each preference instance is an independent entity. Changes made to the initial preference at a later date will not be copied.',
	adminPrefsEditTitle: 			'Edit Preference',
	adminPrefsEditContent: 			'Changes the properties of a preference.',
	adminPrefsDeleteTitle: 			'Delete Preference.',
	adminPrefsDeleteContent: 		'Deletes the selected preference.',
	adminUsersEditTitle: 			'Edit User',
	adminUsersEditContent: 			'Changes the properties of a user. Note that this does not edit any user information in an underlying security implementation. Only the information that is stored in the framework itself will be changed.',
	adminUsersDeleteTitle: 			'Delete User',
	adminUsersDeleteContent:		'Deletes a given user from the framework. Note that this does not delete the user information in an underlying security implementation. Only the user information that is stored in the framework itself will be removed. In addition, it is possible that with certain security implementations such as x509 certificates, a user will be re-created by the framework if they successfully authenticate.',
	adminUserWidgetsDeleteTitle: 	'Delete User Widget',
	adminUserWidgetsDeleteContent: 'Removes access to this widget for a given user. Please note that this will not delete the underlying widget definition - other users will still have access.',
	clearConnectionsTitle: 	'Clear All Connections',
	clearConnectionsContent: 'Removes all directed dynamic eventing connections between the widgets on this dashboard.',
        bannerDockTitle:                        'Dock',
        bannerDockContent:                      'Dock toolbar to banner at top of page.',
        bannerUndockTitle:                      'Undock',
        bannerUndockContent:                    'Undock toolbar to floating position and hide banner.'
};

Ozone.layout.admin = {
	updateDashboardTitle: 			'Update Dashboard',
	dashboardUpdatedContent: 		'Dashboard updated successfully.'
};

Ozone.ux.DashboardMgmtString = {
    createDashboard : 'Create a Dashboard', 
    selectDashboardDotDot : 'Select a dashboard...',
    deleteDashboard : 'Delete a Dashboard', 
    importaDashboard : 'Import a Dashboard',
    exportDashboard : 'Export Current Dashboard', 
    exportDashboardConfig : 'Export Dashboard Configuration', 
    uploadConfig : 'Upload...', 
    setAsDefault : 'Set as default', 
    dashboards : 'Dashboards', 
    title : 'Title', 
    layout : 'Layout', 
    description : 'Description',
    top : 'Top', 
    bottom : 'Bottom', 
    columns : 'Columns', 
    arrangement : 'Arrangement', 
    selectDashboard : 'Select Dashboard', 
    accordion : 'Accordion', 
    portal : 'Portal', 
    tabbed : 'Tabbed', 
    desktop : 'Desktop', 
    fit : 'Fit', 
	tooltipManageDashboards: 'Dashboard Settings',
	tooltipCreateDashboard: 'Create Dashboard',
	
    ok : 'OK', 
    reset : 'Reset',
    about: 'About', 
    logout: 'Logout', 
    importDashboard : 'Import Dashboard', 
    dashboardTitle : 'Dashboard Title', 
    enterDashboardTitle : 'Enter Dashboard Title...',
    browse : 'Browse...', 
	
	loadDefaultMsg : 'Load Default Configuration?',
	noDashboardSelectedMsg : 'No configuration was selected.  Do you want to load the default configuration?',
	changeLanguage : 'Change Language',
	es : 'Spanish',
	en_US : 'English',
	ko : 'Korean'
};

Ozone.layout.AccordionWindowManagerString = {
    configureAccordion : 'Configure Accordion' 
};

Ozone.layout.PortalWindowManagerString = {
    configurePortlets : 'Configure Portlets'    
};

Ozone.layout.TabbedWindowManagerString = {
    configureTabs : '<span class="configureTabButton">Configure Tabs</span>'   
};

Ozone.util.ErrorMessageString = {
	errorTitle : 'Error',
	dashboardConfig : 'Dashboard Configuration',
	widgetConfiguration : 'Widget Configuration', 
	noWidgets : 'There are no widgets to which you have access.', 
	configurationMsg : 'Failed to retrieve configuration data', 
	dashboardBlankMsg: 'Invalid Dashboard Name, it cannot be blank. <br />Please provide a valid Dashboard Name.',
	dashboardInvalidEntryMsg: "Unable to update dashboard name(s) due <br/>to invalid characters.",
	invalidForm : 'Invalid Form',
	invalidFormMsg : 'Form is invalid.  Please make sure all required fields are completed.',
	languagePreference : 'Language Preference',
	languagePreferenceMsg : 'Error saving language preference',
	settingSessionDataMsg : 'Error setting session data',
	retrievingSessionDataMsg : 'Error retrieving session data',
	saveUserPreferences : 'Error saving user preference',
	storeErrorMsg : 'Store Error Message',
	sendAndForget : 'Send and Forget',
	userName : 'User Name',
	updateDashboardMsg : 'Error updating dashboard',
	saveUpdatedViews : 'Update Dashboards',
	saveUpdatedViewsMsg : 'Error updating Dashboards',
	saveUpdatedWidgets : 'Update Widgets',
	saveUpdatedWidgetsMsg : 'Error updating widgets',
	retrieveUpdatedWidgets : 'Retrieving Updated Widgets',
	retrieveUpdatedWidgetsMsg : 'Error retrieving updated widgets',
	invalidUrl: 'Invalid Url',
	invalidUrlMsg: 'The dashboard can not be found. It may have been deleted. You will be redirected to your default dashboard.',
    invalidDashboard: 'Invalid Dashboard Id',
    invalidDashboardGotoDefaultMsg: 'The dashboard can not be found. It may have been deleted. You will be redirected to your default dashboard.',
    invalidDashboardMsg: 'The dashboard can not be found. It may have been deleted. You will be redirected to the previous dashboard',
	invalidDashboardNameMsg: 'Dashboard name is invalid.  It cannot include start or end with a space.',
	leadingOrTrailingWhiteSpacesMsg : 'Leading or trailing spaces around dashboard name are not allowed',
	logoutError: 'Logout Error',
	logoutErrorMsg: 'Please close your browser to ensure logout success.',
	widgetName : 'Widget Name',
	maximumLength : 'The maximum length for this field is {0}',
	about : 'About',
	aboutErrorMsg: 'Error retrieving application information.',
	widgetNotApproved: 'This widget has not yet been approved for use.  Please see a system administrator for approval.',
    restrictedTagError: ' is a restricted tag.  You may not edit it or add it to other widgets',
    mpErrorTitle: 'Marketplace Error',
    mpErrorMsg: 'There has been an error accessing Marketplace. Please contact your System Administrator to verify that Marketplace connectivity has been correctly configured and that the Marketplace server is currently running.',
    oneSingleton: 'Only one instance of a Singleton is permitted'
};

Ozone.layout.MessageBoxButtonText = {
	ok: 'OK',
	cancel : 'Cancel',
    yes : 'Yes',
    no : 'No'
};

Ozone.layout.DialogMessages = {
	update: 'Update',
	updating: 'Updating...',
	updated: 'Updated',
	add: 'Add',
	adding : 'Adding...',
	added: 'Added',
	added_colon: 'Added:',
    added_successfully: 'added successfully',
	copy: 'Copy',
    copying : 'Copying...',
    copied: 'Copied',
    cancel: 'Cancel',
    ok: 'OK',
    error: 'Error',
    addWidget: 'Add Widget',
    editWidget: 'Edit Widget',
    removed_colon: 'Removed:',
    retained_colon: 'Retained:',
    applied_colon: 'Applied:',
    updated_successfully: 'updated successfully',
    added_for: 'added for',
    formInvalid_CheckFieldMessages: 'Form Invalid.<br />Check highlighted field messages (!).',
    formInvalid_SelectOneUser: 'Form Invalid.<br />You need to select at least 1 user.',
    formInvalid_SelectOneWidget: 'Form Invalid.<br />You need to select at least 1 widget.',
    view: 'Dashboard',
    view_status: 'Dashboard Status',
    view_dashboardNameField_label: 'Dashboard name',
    view_dashboardNameField_blankText: 'Please supply a Dashboard Name',
    view_dashboardStateField_label: 'Configuration',
    view_dashboardStateField_blankText: 'Please supply a Dashboard Configuration',
    view_dashboardGuidField_label: 'GUID',
    view_dashboardLayoutField_label: 'Layout',
    view_dashboardIsDefaultField_label: 'Default',
    formError_saveView: 'An error occurred while attempting to save a dashboard.',
    user: 'User',
    users_opt: 'user(s)',
    user_status: 'User Status',
    user_usernameField_label: 'User ID',
    user_usernameField_blankText: 'Please supply a User ID',
    user_userRealNameField_label: 'Name', 
    user_userRealNameField_blankText: 'Please supply a name for the user',
    formError_saveUser: 'An error occurred while attempting to save a user.',
    preference: 'Preference',
    preference_preferenceNameField_label: 'Preference Name',
    preference_preferenceNameField_blankText: 'Please supply a Preference Name',
    preference_preferenceNamespaceField_label: 'Namespace',
    preference_preferenceNamespaceField_blankText: 'Please supply a Preference Namespace',
    preference_preferenceValueField_label: 'Value',
    preference_preferenceValueField_blankText: 'Please supply a Preference Value',
    preference_status: 'Preference Status',
    formError_savePreference: 'An error occurred while attempting to save a preference.',
    widgetDefinition: 'Widget Definition',
    widgetDefinition_status: 'Widget Status',
    widgetDefinition_widgetAccess: 'Widget Access',
    widgetDefinition_descriptorUrlField_blankText: 'Please supply a Widget Descriptor URL',
    widgetDefinition_displayNameField_label: 'Widget Name',
    widgetDefinition_widgetVersionField_label: 'Version',
    widgetDefinition_displayNameField_blankText: 'Please supply a Widget Name',
    widgetDefinition_widgetVersionField_blankText: 'Please supply a Widget Version',
    widgetDefinition_widgetGuidField_label: 'GUID',
    widgetDefinition_widgetUrlField_label: 'URL',
    widgetDefinition_widgetUrlField_blankText: 'Please supply a Widget URL',
    widgetDefinition_imageUrlSmallField_label: 'Container Icon URL',
    widgetDefinition_imageUrlSmallField_blankText: 'Please supply a Container Icon URL',
    widgetDefinition_imageLargeUrlField_label: 'Launch Menu Icon URL',
    widgetDefinition_imageLargeUrlField_blankText: 'Please supply a Launch Menu Icon URL',
    widgetDefinition_widthNumberField_label: 'Width',
    widgetDefinition_widthNumberField_blankText: 'Please supply a Widget width',
    widgetDefinition_heightNumberField_label: 'Height',
    widgetDefinition_heightNumberField_blankText: 'Please supply a Widget height' ,
    widgetDefinition_secureUrl_warningText: 'Entering a secure HTTPS address may prevent browser security warnings such as "This page contains unsecure content."' ,
    personWidgetDef_Apply: 'Apply',
    personWidgetDef_Order: 'Order',
    personWidgetDef_Widget: 'Widget',
    personWidgetDef_WidgetAccessApplied: 'Widget Access Applied',
    personWidgetDef_ApplyStatus: 'Apply Status',
    personWidgetDef_NoChangesNecessary: 'No changes were necessary', 
    formError_savePersonDefWidgets: 'An error occurred while attempting to save user widget(s).',
    formError_saveWidgetDefinition: 'An error occurred while attempting to save the widget.',
    personWidgetDef_WidgetContainerPanelTitle: 'Widgets',
	marketplaceWindow_AddWidget: 'An error occurred while attempting to add the widget from Marketplace.',
	marketplaceWindow_currentUser: 'Could not retrieve current user name and id.',
	widgetAdded: 'Selected widget is already added for this user',
	marketplaceWindow_RequiredListingsAlertMsg: 'The widget you have launched will not work without some dependencies.  These widgets are listed below and will be additionally added to the launch menu.',
    fitPaneFullWarning: 'You are attempting to add a widget to a pane with a single-widget layout. Continuing will replace the existing widget.',
    dashboardLockTitle: 'Lock Dashboard',
    dashboardLockWarning: 'Locking this dashboard disables the Launch Menu. New widgets cannot be launched or added to this layout. Do you still want to lock this dashboard?',
    dashboardLockAlertTitle: 'Locked Dashboard',
    dashboardLockAlert: 'This dashboard is locked. Widgets cannot be added or removed from a locked dashboard.',
    closeBackgroundWidgetWarning: ' is a background widget. You won’t see it on your screen because it runs behind the scenes.<br/><br/>To close the widget, click OK.'
};

Ozone.layout.ThemeSwitcherWindowConstants = {
    title: 'Theme Settings',
    header: 'Change the styling of your OWF',
    subheader: 'Select a theme below to change the background, window color, and style for OWF.',
    ok: 'OK',
    cancel: 'Cancel'
};

/**
 * Version: 1.0 Alpha-1 
 * Build Date: 13-Nov-2007
 * Copyright (c) 2006-2007, Coolite Inc. (http://www.coolite.com/). All rights reserved.
 * License: Licensed under The MIT License. See license.txt and http://www.datejs.com/license/. 
 * Website: http://www.datejs.com/ or http://www.coolite.com/datejs/
 */
Date.CultureInfo = {
	/* Culture Name */
    name: "en-US",
    englishName: "English (United States)",
    nativeName: "English (United States)",
    
    /* Day Name Strings */
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbreviatedDayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    shortestDayNames: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    firstLetterDayNames: ["S", "M", "T", "W", "T", "F", "S"],
    
    /* Month Name Strings */
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbreviatedMonthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

	/* AM/PM Designators */
    amDesignator: "AM",
    pmDesignator: "PM",

    firstDayOfWeek: 0,
    twoDigitYearMax: 2029,
    
    /**
     * The dateElementOrder is based on the order of the 
     * format specifiers in the formatPatterns.DatePattern. 
     *
     * Example:
     <pre>
     shortDatePattern    dateElementOrder
     ------------------  ---------------- 
     "M/d/yyyy"          "mdy"
     "dd/MM/yyyy"        "dmy"
     "yyyy-MM-dd"        "ymd"
     </pre>
     * The correct dateElementOrder is required by the parser to
     * determine the expected order of the date elements in the
     * string being parsed.
     * 
     * NOTE: It is VERY important this value be correct for each Culture.
     */
    dateElementOrder: "mdy",
    
    /* Standard date and time format patterns */
    formatPatterns: {
        shortDate: "M/d/yyyy",
        longDate: "dddd, MMMM dd, yyyy",
        shortTime: "h:mm tt",
        longTime: "h:mm:ss tt",
        fullDateTime: "dddd, MMMM dd, yyyy h:mm:ss tt",
        sortableDateTime: "yyyy-MM-ddTHH:mm:ss",
        universalSortableDateTime: "yyyy-MM-dd HH:mm:ssZ",
        rfc1123: "ddd, dd MMM yyyy HH:mm:ss GMT",
        monthDay: "MMMM dd",
        yearMonth: "MMMM, yyyy"
    },

    /**
     * NOTE: If a string format is not parsing correctly, but
     * you would expect it parse, the problem likely lies below. 
     * 
     * The following regex patterns control most of the string matching
     * within the parser.
     * 
     * The Month name and Day name patterns were automatically generated
     * and in general should be (mostly) correct. 
     *
     * Beyond the month and day name patterns are natural language strings.
     * Example: "next", "today", "months"
     *
     * These natural language string may NOT be correct for this culture. 
     * If they are not correct, please translate and edit this file
     * providing the correct regular expression pattern. 
     *
     * If you modify this file, please post your revised CultureInfo file
     * to the Datejs Discussions located at
     *     http://groups.google.com/group/date-js
     *
     * Please mark the subject with [CultureInfo]. Example:
     *    Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)
     * 
     * We will add the modified patterns to the master source files.
     *
     * As well, please review the list of "Future Strings" section below. 
     */	
    regexPatterns: {
        jan: /^jan(uary)?/i,
        feb: /^feb(ruary)?/i,
        mar: /^mar(ch)?/i,
        apr: /^apr(il)?/i,
        may: /^may/i,
        jun: /^jun(e)?/i,
        jul: /^jul(y)?/i,
        aug: /^aug(ust)?/i,
        sep: /^sep(t(ember)?)?/i,
        oct: /^oct(ober)?/i,
        nov: /^nov(ember)?/i,
        dec: /^dec(ember)?/i,

        sun: /^su(n(day)?)?/i,
        mon: /^mo(n(day)?)?/i,
        tue: /^tu(e(s(day)?)?)?/i,
        wed: /^we(d(nesday)?)?/i,
        thu: /^th(u(r(s(day)?)?)?)?/i,
        fri: /^fr(i(day)?)?/i,
        sat: /^sa(t(urday)?)?/i,

        future: /^next/i,
        past: /^last|past|prev(ious)?/i,
        add: /^(\+|after|from)/i,
        subtract: /^(\-|before|ago)/i,
        
        yesterday: /^yesterday/i,
        today: /^t(oday)?/i,
        tomorrow: /^tomorrow/i,
        now: /^n(ow)?/i,
        
        millisecond: /^ms|milli(second)?s?/i,
        second: /^sec(ond)?s?/i,
        minute: /^min(ute)?s?/i,
        hour: /^h(ou)?rs?/i,
        week: /^w(ee)?k/i,
        month: /^m(o(nth)?s?)?/i,
        day: /^d(ays?)?/i,
        year: /^y((ea)?rs?)?/i,
		
        shortMeridian: /^(a|p)/i,
        longMeridian: /^(a\.?m?\.?|p\.?m?\.?)/i,
        timezone: /^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,
        ordinalSuffix: /^\s*(st|nd|rd|th)/i,
        timeContext: /^\s*(\:|a|p)/i
    },

    abbreviatedTimeZoneStandard: { GMT: "-000", EST: "-0400", CST: "-0500", MST: "-0600", PST: "-0700" },
    abbreviatedTimeZoneDST: { GMT: "-000", EDT: "-0500", CDT: "-0600", MDT: "-0700", PDT: "-0800" }
    
};

/********************
 ** Future Strings **
 ********************
 * 
 * The following list of strings are not currently being used, but 
 * may be incorporated later. We would appreciate any help translating
 * the strings below.
 * 
 * If you modify this file, please post your revised CultureInfo file
 * to the Datejs Discussions located at
 *     http://groups.google.com/group/date-js
 *
 * Please mark the subject with [CultureInfo]. Example:
 *    Subject: [CultureInfo] Translated "da-DK" Danish(Denmark)
 *
 * English Name        Translated
 * ------------------  -----------------
 * date                date
 * time                time
 * calendar            calendar
 * show                show
 * hourly              hourly
 * daily               daily
 * weekly              weekly
 * bi-weekly           bi-weekly
 * monthly             monthly
 * bi-monthly          bi-monthly
 * quarter             quarter
 * quarterly           quarterly
 * yearly              yearly
 * annual              annual
 * annually            annually
 * annum               annum
 * again               again
 * between             between
 * after               after
 * from now            from now
 * repeat              repeat
 * times               times
 * per                 per
 */

var Ozone = Ozone || {};
Ozone.util = Ozone.util || {};


/**
 * @class
 * @private
 *
 * @description
 * Object used to talk to the cross domain and locally.  If the server is local,
 * then AJAX will be used.  If the server is remote, then we must use a
 * hack to get around Same Origin Policy and make the call cross domain.
 *
 * @requires util.js
 */
Ozone.util.Transport = {
    version: Ozone.version.owfversion + Ozone.version.preference
};


/**
 * @private
 *
 * @params  cfg.url               -  url of the request
 *          cfg.method            -  HTTP verb (only POST or GET, use _method = PUT or DELETE with a POST )
 *          cfg.onSuccess         -  callback function to capture the success result
 *          cfg.onFailure         -  callback to execute if there is an error
 *          cfg.content           -  optional content to send with the request, ie {value: 'x', _method: 'PUT'}
 *          cfg.async			  -  optional (default is true, asynchronous send, only applies to Ajax call)
 *          cfg.handleAs          - text or json
 *          cfg.autoSendVersion   -  true to send owf version to the server, false don't send (defaults to true)
 *          cfg.ignoredErrorCodes -  optional array of http error codes to ignore (if these happen onSucess will be called)
 *          cfg.forceXdomain      -  optional flag to force xdomain ajax call using dojo window.name
 *
 *  @returns void, use callbacks
 *
 *  Static method.  Must use 2 callbacks since javascript is asyncronous
 *  we have to wait for the response.
 *
 *  This implementation uses the dojox.windowName hack for a remote server,
  * but could be replaced with something else like JSONP if desired
 */
Ozone.util.Transport.send = function(cfg) {
    if (Ozone.log) {
        Ozone.log.getDefaultLogger().debug('Transport Send', cfg.url, cfg.method, cfg.content);
    }

    var defaultFailure = function(err) {
        // If error is an HTML page, just use body
        if (err == undefined || err == null) err = "";
        var start = err.indexOf("<body");
        if (start > -1) {
            // start at the end of the body tag
            start = err.indexOf(">", start) + 1;
            var stop = err.indexOf("</body>", start);

            if (stop > -1) err = err.substring(start, stop);
            else err = err.substring(start);
        }

        if (!Ozone.Msg)
            Ozone.util.ErrorDlg.show(err,200,50);
        else
            Ozone.Msg.alert('Server Error',err,null,this,{
                cls: "owfAlert"
            });
    };

    // create an onFailure method if one doesn't exist
    if (!cfg.onFailure) {
        cfg.onFailure = function(err){
            defaultFailure(err);
        };
    }

    var methodToUse = cfg.method;
    var hasBody = false;
    if (methodToUse == "PUT" || methodToUse == "DELETE")
    {
        methodToUse = "POST";
    }

    if (methodToUse == "POST") {
        hasBody = true;
    }

    if(cfg.content == null) {
        cfg.content = {};
    }

    //autoSendVersion to server default behavior is true
    if (!(cfg.autoSendVersion === false)) {
        //add version property to send to the server
        cfg.content.version = Ozone.util.Transport.version;
    }

    // Convert state JSON object to string
    if (cfg.content.state) {
        cfg.content.state = Ozone.util.toString(cfg.content.state);
    }

    // Convert defaultSettings JSON object to string
    if (cfg.content.defaultSettings) {
        cfg.content.defaultSettings = Ozone.util.toString(cfg.content.defaultSettings);
    }

    var  content = cfg.content;

    var handleAs = 'json';
    if (cfg.handleAs != null) {
        handleAs = cfg.handleAs;
    }

    // Use AJAX if we can
    if (Ozone.util.isUrlLocal(cfg.url) && !cfg.forceXdomain) {
        return owfdojo.xhr(methodToUse.toUpperCase(), {
            url: cfg.url,
            content: cfg.content,
            preventCache: true,
            sync: cfg.async == false? true : false, //defaults to false (not synchronous)
            timeout : cfg.timeout ? cfg.timeout : 0,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            load: function(response, ioArgs) {
                if (Ozone.log) {
                    Ozone.log.getDefaultLogger().debug('Transport AJAX Return', response);
                }
                if (handleAs == 'json') {
                    try {
                        var json = Ozone.util.parseJson(response);
                        cfg.onSuccess(json);
                    } catch(e) {
                        cfg.onFailure(e.name + " : " + e.message);
                    }
                }
                else {
                    cfg.onSuccess(response);
                }
            },
            error: function(response, ioArgs) {
                if (response.dojoType=='cancel') { return; }
                // FF2 kills all AJAX requests when you refresh. When this happens, it sets the status code to 0
                if (response.status != 0 ){
                    if (cfg.ignoredErrorCodes != null && cfg.ignoredErrorCodes.length > 0 && owfdojo.indexOf(cfg.ignoredErrorCodes,response.status) > -1){
                        cfg.onSuccess({});
                    }
                    else {
                        cfg.onFailure(response.responseText, response.status);
                    }
                }
            }
        }, hasBody);
    } else {
        // Use window.name transport
        try {
            var methodToUse = cfg.method;
            if (methodToUse == "PUT" || methodToUse == "DELETE")
            {
                methodToUse = "POST";
            }
            var deferred = owfdojox.io.windowName.send(methodToUse.toUpperCase(), {
                url: cfg.url,
                content: content,
                preventCache: true,
                timeout: cfg.timeout ? cfg.timeout : 20000,
                load:
                function(result) {
                    try {
                        // OWF-2750 - handle timeout errors which are already JSON objects
                        var json = null;
                        if (result && typeof(result) === 'string') {
                           json = Ozone.util.parseJson(result);
                        }
                        else {
                           json = result;
                        }

                        // OWF-2750 - detect a timeout error and return its message
                        if (json && json.message && json.message == 'Timeout') {
                           return cfg.onFailure('Error: Request timed out');
                        }

                        if (json.status === 200) {
                            if (Ozone.log) {
                                Ozone.log.getDefaultLogger().debug('Transport AJAX Return', json.data);
                            }
                            if (handleAs == 'json') {
                                cfg.onSuccess(json.data);
                            }
                            else {
                                cfg.onSuccess(result);
                            }
                        } else if (json.status === 500 || json.status === 401) {
                            cfg.onFailure(json.data);
                        }
                        //if it is an error code we ignore than call onSuccess with empty data
                        else if (cfg.ignoredErrorCodes != null && cfg.ignoredErrorCodes.length > 0 && owfdojo.indexOf(cfg.ignoredErrorCodes,json.status) > -1){
                            cfg.onSuccess({});
                        }
                        else {
                            cfg.onFailure(json.data,json.status);
                        }
                        return json;
                    }
                    catch(e2) {
                        cfg.onFailure(e2.name + " : " + e2.message);
                    }
                },
                error:
                function(result){
                    if (result.dojoType=='cancel') { return; }
                    if (result instanceof Error){
                        cfg.onFailure(result.name + " : " + result.message);
                    }
                    else{
                        cfg.onFailure(result);
                    }
                }
            });
            return deferred;
        }
        catch(e){
            cfg.onFailure(e.name + " : " + e.message);
        }
    }
	
};
/**
 * @private
 *
 * @params  cfg.url              -  url of the request
 *          cfg.method           -  HTTP verb (only POST or GET, use _method = PUT or DELETE with a POST )
 *          cfg.content          -  optional content to send with the request, ie {value: 'x', _method: 'PUT'}
 *          cfg.async			 -  optional (default is true, asynchronous send, only applies to Ajax call)          
 *
 *  @returns void
 *
 *  Static method.  No callbacks are passed in, so you will not get a response.  Useful for example in
 *                  in 'beforeunload' when the the asyncronous callbacks are guaranteed to have the same
 *                  javascript in the dom when they are firted
 *
 *
 *  This implementation uses the dojox.windowName hack for a remote server,
  * but could be replaced with something else like JSONP if desired
 */
Ozone.util.Transport.sendAndForget = function(cfg) {
    var cfg = cfg;

    if (Ozone.log) {
        Ozone.log.getDefaultLogger().debug('Transport SendAndForget', cfg.url, cfg.method, cfg.content);
    }

    var methodToUse = cfg.method;
    if (methodToUse == "PUT" || methodToUse == "DELETE")
    {
        methodToUse = "POST";
    }
	
    var hasBody = false;
    if (methodToUse == "POST") {
        hasBody = true;
    }
	
    if(cfg.content == null) {
        cfg.content = {};
    }

    //autoSendVersion to server default behavior is true
    if (cfg.autoSendVersion === false) {
        //add version property to send to the server
        cfg.content.version = Ozone.util.Transport.version;
    }

    // Convert state JSON object to string
    if (cfg.content.state) {
        cfg.content.state = Ozone.util.toString(cfg.content.state);
    }

    var content = null;
    if (methodToUse == "GET") {
        content = owfdojo.objectToQuery(cfg.content);
    }
    else {
        content = cfg.content;
    }

    // Use AJAX if we can
    if (Ozone.util.isUrlLocal(cfg.url)) {
        owfdojo.xhr(methodToUse.toUpperCase(), {
            url: cfg.url,
            content: cfg.content,
            preventCache: true,
            sync:  cfg.async == false? false : true //defaults to true
        }, hasBody);
    } else {
        // Use window.name transport
        try {
            var methodToUse = cfg.method;
            if (methodToUse == "PUT" || methodToUse == "DELETE")
            {
                methodToUse = "POST";
            }
            var deferred = owfdojox.io.windowName.send(methodToUse.toUpperCase(), {
                url: cfg.url,
                content: content,
                preventCache: true
            });
        } catch(e) {
            if (!Ozone.Msg)
                Ozone.util.ErrorDlg.show(Ozone.util.ErrorMessageString.sendAndForget,e.name + " : " + e.message,200,50);
            else
                Ozone.Msg.alert(Ozone.util.ErrorMessageString.sendAndForget,e.name + " : " + e.message);
        }
    }
};


/**
 * @private
 *
 *  @params  cfg.urls              -  Array of urls to try
 *           cfg.method           -  HTTP verb (only POST or GET, use _method = PUT or DELETE with a POST )
 *           cfg.onSuccess        -  callback function to capture the success result
 *           cfg.onLastFailure        -  callback to execute if there is an error
 *           cfg.content          -  optional content to send with the request, ie {value: 'x', _method: 'PUT'}
 *
 *  @returns void, use callbacks
 *
 *  Static method.  Allows the user to pass in an array of urls to try.  The first one to return a response stops
 *  the processing.  Uses the Ozone.util.Transport.send method.
 */
Ozone.util.Transport.sendToFirst = function(cfg) {
    var u = cfg.urls.shift();
	
    if (u === undefined) {
        if (cfg.onLastFailure !== undefined) {
            cfg.onLastFailure();
        }
        return;
    }
	
    var onThisFailure = function() {
        Ozone.util.Transport.sendToFirst({
            urls:cfg.urls,
            method:cfg.method,
            onSuccess:cfg.onSuccess,
            onLastFailure:cfg.onLastFailure,
            content:cfg.content
            });
    };
	
    Ozone.util.Transport.send({
        url:u,
        method:cfg.method,
        onSuccess:cfg.onSuccess,
        onFailure:onThisFailure,
        content:cfg.content
        });
};

var Ozone = Ozone || {};
/**
 * @namespace
 * @description Provides OWF utility methods for the widget developer
 * 
 */
Ozone.util = Ozone.util || {};

/**
 * @description This method informs a widget developer if their widget is running
 * in a Container, like OWF
 *
 * @returns  boolean true if the widget is inside a container, false otherwise.
 *
 */
Ozone.util.isInContainer = function() {
    var inContainer = false;

    //check window.name
    if (Ozone.util.parseJson) {
        var configParams = Ozone.util.parseWindowNameData();
        if (configParams != null
                 //is the fact that a json string was in window.name enough to determine the widget is in a container?
                //&& configParams.inContainer
                ) {
            inContainer = true;
        }
    }
    return inContainer;
};

/**
 * @description This method informs a widget developer if their widget is running 
 * from the OWF or from a direct URL call.
 * 
 * @returns  boolean true if the widget is inside OWF, false otherwise.
 *
 */
Ozone.util.isRunningInOWF = function() {
    var isInOwf = false;

    //check window.name
    if (Ozone.util.parseJson) {
        var configParams = Ozone.util.parseWindowNameData();
        if (configParams != null && configParams.owf) {
            isInOwf = true;
        }
    }
    return isInOwf;
};

/**
 * @private
 *
 * @description This method takes a string and removes the passed header from the front of it.
 * Used to convert a unique id attribute into a id that other functions and objects can use.
 * 
 * @param {String} id the id attribute value to be manipulated
 * @param {String} header the header to be removed from the id
 * 
 * @returns String the id minus the header. (Ex. parseID('header1', 'header') returns '1')
 * 
 */
Ozone.util.parseID = function(id, header) {
    return id.substring(0, header.length) == header ? id.substring(header.length) : id;
}

/**
 * @description This method returns flash/flex object from dom.
 * 
 * @returns  flash/flex object from dom
 *
 */
Ozone.util.getFlashApp = function(id) {
    id = id || Ozone.dragAndDrop.WidgetDragAndDrop.getInstance().getFlashWidgetId();
    if(!id)
        return;
    
    if (navigator.appName.indexOf ("Microsoft") !=-1) {
        return window[id];
        }
    else {
        return document[id];
    }
};
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var gadgets = gadgets || {};

/**
 * @fileoverview General purpose utilities that gadgets can use.
 */

/**
 * @static
 * @class Provides general-purpose utility functions.
 * @name gadgets.util
 */

gadgets.util = function() {
  /**
   * Parses URL parameters into an object.
   * @return {Array.&lt;String&gt;} The parameters
   */
  function parseUrlParams() {
    // Get settings from url, 'hash' takes precedence over 'search' component
    // don't use document.location.hash due to browser differences.
    var query;
    var l = document.location.href;
    var queryIdx = l.indexOf("?");
    var hashIdx = l.indexOf("#");
    if (hashIdx === -1) {
      query = l.substr(queryIdx + 1);
    } else {
      // essentially replaces "#" with "&"
      query = [l.substr(queryIdx + 1, hashIdx - queryIdx - 1), "&",
               l.substr(hashIdx + 1)].join("");
    }
    return query.split("&");
  }

  var parameters = null;
  var features = {};
  var onLoadHandlers = [];

  // Maps code points to the value to replace them with.
  // If the value is "false", the character is removed entirely, otherwise
  // it will be replaced with an html entity.
  var escapeCodePoints = {
   // nul; most browsers truncate because they use c strings under the covers.
   0 : false,
   // new line
   10 : true,
   // carriage return
   13 : true,
   // double quote
   34 : true,
   // single quote
   39 : true,
   // less than
   60 : true,
   // greater than
   62 : true,
   // Backslash
   92 : true,
   // line separator
   8232 : true,
   // paragraph separator
   8233 : true
  };

  /**
   * Regular expression callback that returns strings from unicode code points.
   *
   * @param {Array} match Ignored
   * @param {String} value The codepoint value to convert
   * @return {String} The character corresponding to value.
   */
  function unescapeEntity(match, value) {
    return String.fromCharCode(value);
  }

  /**
   * Initializes feature parameters.
   */
  function init(config) {
    features = config["core.util"] || {};
  }
  if (gadgets.config) {
    gadgets.config.register("core.util", null, init);
  }

  return /** @scope gadgets.util */ {

    /**
     * Gets the URL parameters.
     *
     * @return {Object} Parameters passed into the query string
     * @member gadgets.util
     * @private Implementation detail.
     */
    getUrlParameters : function () {
      if (parameters !== null) {
        return parameters;
      }
      parameters = {};
      var pairs = parseUrlParams();
      var unesc = window.decodeURIComponent ? decodeURIComponent : unescape;
      for (var i = 0, j = pairs.length; i < j; ++i) {
        var pos = pairs[i].indexOf('=');
        if (pos === -1) {
          continue;
        }
        var argName = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        // difference to IG_Prefs, is that args doesn't replace spaces in
        // argname. Unclear on if it should do:
        // argname = argname.replace(/\+/g, " ");
        value = value.replace(/\+/g, " ");
        parameters[argName] = unesc(value);
      }
      return parameters;
    },

    /**
     * Creates a closure that is suitable for passing as a callback.
     * Any number of arguments
     * may be passed to the callback;
     * they will be received in the order they are passed in.
     *
     * @param {Object} scope The execution scope; may be null if there is no
     *     need to associate a specific instance of an object with this
     *     callback
     * @param {Function} callback The callback to invoke when this is run;
     *     any arguments passed in will be passed after your initial arguments
     * @param {Object} var_args Initial arguments to be passed to the callback
     *
     * @member gadgets.util
     * @private Implementation detail.
     */
    makeClosure : function (scope, callback, var_args) {
      // arguments isn't a real array, so we copy it into one.
      var baseArgs = [];
      for (var i = 2, j = arguments.length; i < j; ++i) {
       baseArgs.push(arguments[i]);
      }
      return function() {
        // append new arguments.
        var tmpArgs = baseArgs.slice();
        for (var i = 0, j = arguments.length; i < j; ++i) {
          tmpArgs.push(arguments[i]);
        }
        return callback.apply(scope, tmpArgs);
      };
    },

    /**
     * Utility function for generating an "enum" from an array.
     *
     * @param {Array.<String>} values The values to generate.
     * @return {Map&lt;String,String&gt;} An object with member fields to handle
     *   the enum.
     *
     * @private Implementation detail.
     */
    makeEnum : function (values) {
      var obj = {};
      for (var i = 0, v; v = values[i]; ++i) {
        obj[v] = v;
      }
      return obj;
    },

    /**
     * Gets the feature parameters.
     *
     * @param {String} feature The feature to get parameters for
     * @return {Object} The parameters for the given feature, or null
     *
     * @member gadgets.util
     */
    getFeatureParameters : function (feature) {
      return typeof features[feature] === "undefined"
          ? null : features[feature];
    },

    /**
     * Returns whether the current feature is supported.
     *
     * @param {String} feature The feature to test for
     * @return {Boolean} True if the feature is supported
     *
     * @member gadgets.util
     */
    hasFeature : function (feature) {
      return typeof features[feature] !== "undefined";
    },

    /**
     * Registers an onload handler.
     * @param {Function} callback The handler to run
     *
     * @member gadgets.util
     */
    registerOnLoadHandler : function (callback) {
      onLoadHandlers.push(callback);
    },

    /**
     * Runs all functions registered via registerOnLoadHandler.
     * @private Only to be used by the container, not gadgets.
     */
    runOnLoadHandlers : function () {
      for (var i = 0, j = onLoadHandlers.length; i < j; ++i) {
        onLoadHandlers[i]();
      }
    },

    /**
     * Escapes the input using html entities to make it safer.
     *
     * If the input is a string, uses gadgets.util.escapeString.
     * If it is an array, calls escape on each of the array elements
     * if it is an object, will only escape all the mapped keys and values if
     * the opt_escapeObjects flag is set. This operation involves creating an
     * entirely new object so only set the flag when the input is a simple
     * string to string map.
     * Otherwise, does not attempt to modify the input.
     *
     * @param {Object} input The object to escape
     * @param {Boolean} opt_escapeObjects Whether to escape objects.
     * @return {Object} The escaped object
     * @private Only to be used by the container, not gadgets.
     */
    escape : function(input, opt_escapeObjects) {
      if (!input) {
        return input;
      } else if (typeof input === "string") {
        return gadgets.util.escapeString(input);
      } else if (typeof input === "array") {
        for (var i = 0, j = input.length; i < j; ++i) {
          input[i] = gadgets.util.escape(input[i]);
        }
      } else if (typeof input === "object" && opt_escapeObjects) {
        var newObject = {};
        for (var field in input) if (input.hasOwnProperty(field)) {
          newObject[gadgets.util.escapeString(field)]
              = gadgets.util.escape(input[field], true);
        }
        return newObject;
      }
      return input;
    },

    /**
     * Escapes the input using html entities to make it safer.
     *
     * Currently not in the spec -- future proposals may change
     * how this is handled.
     *
     * TODO: Parsing the string would probably be more accurate and faster than
     * a bunch of regular expressions.
     *
     * @param {String} str The string to escape
     * @return {String} The escaped string
     */
    escapeString : function(str) {
      var out = [], ch, shouldEscape;
      for (var i = 0, j = str.length; i < j; ++i) {
        ch = str.charCodeAt(i);
        shouldEscape = escapeCodePoints[ch];
        if (shouldEscape === true) {
          out.push("&#", ch, ";");
        } else if (shouldEscape !== false) {
          // undefined or null are OK.
          out.push(str.charAt(i));
        }
      }
      return out.join("");
    },

    /**
     * Reverses escapeString
     *
     * @param {String} str The string to unescape.
     */
    unescapeString : function(str) {
      return str.replace(/&#([0-9]+);/g, unescapeEntity);
    }
  };
}();
// Initialize url parameters so that hash data is pulled in before it can be
// altered by a click.
gadgets.util.getUrlParameters();


/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * @fileoverview
 * The global object gadgets.json contains two methods.
 *
 * gadgets.json.stringify(value) takes a JavaScript value and produces a JSON
 * text. The value must not be cyclical.
 *
 * gadgets.json.parse(text) takes a JSON text and produces a JavaScript value.
 * It will return false if there is an error.
*/

var gadgets = gadgets || {};

/**
 * @static
 * @class Provides operations for translating objects to and from JSON.
 * @name gadgets.json
 */

/**
 * Port of the public domain JSON library by Douglas Crockford.
 * See: http://www.json.org/json2.js
 */
gadgets.json = function () {

  /**
   * Formats integers to 2 digits.
   * @param {Number} n
   */
  function f(n) {
    return n < 10 ? '0' + n : n;
  }

  Date.prototype.toJSON = function () {
    return [this.getUTCFullYear(), '-',
           f(this.getUTCMonth() + 1), '-',
           f(this.getUTCDate()), 'T',
           f(this.getUTCHours()), ':',
           f(this.getUTCMinutes()), ':',
           f(this.getUTCSeconds()), 'Z'].join("");
  };

  // table of character substitutions
  var m = {
    '\b': '\\b',
    '\t': '\\t',
    '\n': '\\n',
    '\f': '\\f',
    '\r': '\\r',
    '"' : '\\"',
    '\\': '\\\\'
  };

  /**
   * Converts a json object into a string.
   */
  function stringify(value) {
    var a,          // The array holding the partial texts.
        i,          // The loop counter.
        k,          // The member key.
        l,          // Length.
        r = /["\\\x00-\x1f\x7f-\x9f]/g,
        v;          // The member value.

    switch (typeof value) {
    case 'string':
    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe ones.
      return r.test(value) ?
          '"' + value.replace(r, function (a) {
            var c = m[a];
            if (c) {
              return c;
            }
            c = a.charCodeAt();
            return '\\u00' + Math.floor(c / 16).toString(16) +
                (c % 16).toString(16);
            }) + '"'
          : '"' + value + '"';
    case 'number':
    // JSON numbers must be finite. Encode non-finite numbers as null.
      return isFinite(value) ? String(value) : 'null';
    case 'boolean':
    case 'null':
      return String(value);
    case 'object':
    // Due to a specification blunder in ECMAScript,
    // typeof null is 'object', so watch out for that case.
      if (!value) {
        return 'null';
      }
      // toJSON check removed; re-implement when it doesn't break other libs.
      a = [];
      if (typeof value.length === 'number' &&
          !(value.propertyIsEnumerable('length'))) {
        // The object is an array. Stringify every element. Use null as a
        // placeholder for non-JSON values.
        l = value.length;
        for (i = 0; i < l; i += 1) {
          a.push(stringify(value[i]) || 'null');
        }
        // Join all of the elements together and wrap them in brackets.
        return '[' + a.join(',') + ']';
      }
      // Otherwise, iterate through all of the keys in the object.
      for (k in value) if (value.hasOwnProperty(k)) {
        if (typeof k === 'string') {
          v = stringify(value[k]);
          if (v) {
            a.push(stringify(k) + ':' + v);
          }
        }
      }
      // Join all of the member texts together and wrap them in braces.
      return '{' + a.join(',') + '}';
    }
  }

  return {
    stringify: stringify,
    parse: function (text) {
// Parsing happens in three stages. In the first stage, we run the text against
// regular expressions that look for non-JSON patterns. We are especially
// concerned with '()' and 'new' because they can cause invocation, and '='
// because it can cause mutation. But just to be safe, we want to reject all
// unexpected forms.

// We split the first stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace all backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

      if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/b-u]/g, '@').
          replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
          replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        return eval('(' + text + ')');
      }
      // If the text is not JSON parseable, then return false.

      return false;
    }
  };
}();


/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Remote procedure call library for gadget-to-container,
 * container-to-gadget, and gadget-to-gadget (thru container) communication.
 */

var gadgets = gadgets || {};

/**
 * @static
 * @class Provides operations for making rpc calls.
 * @name gadgets.rpc
 */
gadgets.rpc = function() {
  //alert("Initing gadgets.rpc");
  // General constants.
  var CALLBACK_NAME = '__cb';
  var DEFAULT_NAME = '';

  // Consts for FrameElement.
  var FE_G2C_CHANNEL = '__g2c_rpc';
  var FE_C2G_CHANNEL = '__c2g_rpc';

  // Consts for NIX. VBScript doesn't
  // allow items to start with _ for some reason,
  // so we need to make these names quite unique, as
  // they will go into the global namespace.
  var NIX_WRAPPER = 'GRPC____NIXVBS_wrapper';
  var NIX_GET_WRAPPER = 'GRPC____NIXVBS_get_wrapper';
  var NIX_HANDLE_MESSAGE = 'GRPC____NIXVBS_handle_message';
  var NIX_CREATE_CHANNEL = 'GRPC____NIXVBS_create_channel';

  // JavaScript reference to the NIX VBScript wrappers.
  // Gadgets will have but a single channel under
  // nix_channels['..'] while containers will have a channel
  // per gadget stored under the gadget's ID.
  var nix_channels = {};

  var services = {};
  var iframePool = [];
  var relayUrl = {};
  var useLegacyProtocol = {};
  var authToken = {};
  var callId = 0;
  var callbacks = {};
  var setup = {};
  var sameDomain = {};
  var params = {};

  // Load the authentication token for speaking to the container
  // from the gadget's parameters, or default to '0' if not found.
  if (gadgets.util) {
    params = gadgets.util.getUrlParameters();
	//alert("gadget params: " + params);
  }

  authToken['..'] = params.rpctoken || params.ifpctok || 0;

  //ifpc mods
  var URL_LIMIT = 2000;
  var messagesIn = {};
  var useMultiPartMessages = {};
  //ifpc mods


  /*
   * Return a short code representing the best available cross-domain
   * message transport available to the browser.
   *
   * + For those browsers that support native messaging (various implementations
   *   of the HTML5 postMessage method), use that. Officially defined at
   *   http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html.
   *
   *   postMessage is a native implementation of XDC. A page registers that
   *   it would like to receive messages by listening the the "message" event
   *   on the window (document in DPM) object. In turn, another page can
   *   raise that event by calling window.postMessage (document.postMessage
   *   in DPM) with a string representing the message and a string
   *   indicating on which domain the receiving page must be to receive
   *   the message. The target page will then have its "message" event raised
   *   if the domain matches and can, in turn, check the origin of the message
   *   and process the data contained within.
   *
   *     wpm: postMessage on the window object.
   *        - Internet Explorer 8+
   *        - Safari (latest nightlies as of 26/6/2008)
   *        - Firefox 3+
   *        - Opera 9+
   *
   *     dpm: postMessage on the document object.
   *        - Opera 8+
   *
   * + For Internet Explorer before version 8, the security model allows anyone
   *   parent to set the value of the "opener" property on another window,
   *   with only the receiving window able to read it.
   *   This method is dubbed "Native IE XDC" (NIX).
   *
   *   This method works by placing a handler object in the "opener" property
   *   of a gadget when the container sets up the authentication information
   *   for that gadget (by calling setAuthToken(...)). At that point, a NIX
   *   wrapper is created and placed into the gadget by calling
   *   theframe.contentWindow.opener = wrapper. Note that as a result, NIX can
   *   only be used by a container to call a particular gadget *after* that
   *   gadget has called the container at least once via NIX.
   *
   *   The NIX wrappers in this RPC implementation are instances of a VBScript
   *   class that is created when this implementation loads. The reason for
   *   using a VBScript class stems from the fact that any object can be passed
   *   into the opener property.
   *   While this is a good thing, as it lets us pass functions and setup a true
   *   bidirectional channel via callbacks, it opens a potential security hole
   *   by which the other page can get ahold of the "window" or "document"
   *   objects in the parent page and in turn wreak havok. This is due to the
   *   fact that any JS object useful for establishing such a bidirectional
   *   channel (such as a function) can be used to access a function
   *   (eg. obj.toString, or a function itself) created in a specific context,
   *   in particular the global context of the sender. Suppose container
   *   domain C passes object obj to gadget on domain G. Then the gadget can
   *   access C's global context using:
   *   var parentWindow = (new obj.toString.constructor("return window;"))();
   *   Nulling out all of obj's properties doesn't fix this, since IE helpfully
   *   restores them to their original values if you do something like:
   *   delete obj.toString; delete obj.toString;
   *   Thus, we wrap the necessary functions and information inside a VBScript
   *   object. VBScript objects in IE, like DOM objects, are in fact COM
   *   wrappers when used in JavaScript, so we can safely pass them around
   *   without worrying about a breach of context while at the same time
   *   allowing them to act as a pass-through mechanism for information
   *   and function calls. The implementation details of this VBScript wrapper
   *   can be found in the setupChannel() method below.
   *
   *     nix: Internet Explorer-specific window.opener trick.
   *       - Internet Explorer 6
   *       - Internet Explorer 7
   *
   * + For Gecko-based browsers, the security model allows a child to call a
   *   function on the frameElement of the iframe, even if the child is in
   *   a different domain. This method is dubbed "frameElement" (fe).
   *
   *   The ability to add and call such functions on the frameElement allows
   *   a bidirectional channel to be setup via the adding of simple function
   *   references on the frameElement object itself. In this implementation,
   *   when the container sets up the authentication information for that gadget
   *   (by calling setAuth(...)) it as well adds a special function on the
   *   gadget's iframe. This function can then be used by the gadget to send
   *   messages to the container. In turn, when the gadget tries to send a
   *   message, it checks to see if this function has its own function stored
   *   that can be used by the container to call the gadget. If not, the
   *   function is created and subsequently used by the container.
   *   Note that as a result, FE can only be used by a container to call a
   *   particular gadget *after* that gadget has called the container at
   *   least once via FE.
   *
   *     fe: Gecko-specific frameElement trick.
   *        - Firefox 1+
   *
   * + For all others, we have a fallback mechanism known as "ifpc". IFPC
   *   exploits the fact that while same-origin policy prohibits a frame from
   *   accessing members on a window not in the same domain, that frame can,
   *   however, navigate the window heirarchy (via parent). This is exploited by
   *   having a page on domain A that wants to talk to domain B create an iframe
   *   on domain B pointing to a special relay file and with a message encoded
   *   after the hash (#). This relay, in turn, finds the page on domain B, and
   *   can call a receipt function with the message given to it. The relay URL
   *   used by each caller is set via the gadgets.rpc.setRelayUrl(..) and
   *   *must* be called before the call method is used.
   *
   *     ifpc: Iframe-based method, utilizing a relay page, to send a message.
   */
  function getRelayChannel() {
//    return 'ifpc';
    return typeof window.postMessage === 'function' ? 'wpm' :
           typeof window.postMessage === 'object' ? 'wpm':
           typeof document.postMessage === 'function' ? 'dpm' :
           window.ActiveXObject ? 'nix' :
           navigator.product === 'Gecko' ? 'fe' :
           'ifpc';
  }

  /**
   * Conducts any initial global work necessary to setup the
   * channel type chosen.
   */
  function setupChannel() {
    // If the channel type is one of the native
    // postMessage based ones, setup the handler to receive
    // messages.
    if (relayChannel === 'dpm' || relayChannel === 'wpm') {
      var onmessage = function (packet) {
        // TODO validate packet.domain for security reasons
        process(gadgets.json.parse(packet.data));
      }

      if (typeof window.addEventListener != 'undefined') {
        window.addEventListener('message', onmessage, false);
      } else if (typeof window.attachEvent != 'undefined') {
        window.attachEvent('onmessage', onmessage);
      }

    }

    // If the channel type is NIX, we need to ensure the
    // VBScript wrapper code is in the page and that the
    // global Javascript handlers have been set.
    if (relayChannel === 'nix') {

       //alert('nix setup!');

      // VBScript methods return a type of 'unknown' when
      // checked via the typeof operator in IE. Fortunately
      // for us, this only applies to COM objects, so we
      // won't see this for a real Javascript object.
      if (typeof window[NIX_GET_WRAPPER] !== 'unknown') {
        window[NIX_HANDLE_MESSAGE] = function(data) {
          process(gadgets.json.parse(data));
        };

        window[NIX_CREATE_CHANNEL] = function(name, channel, token) {
          // Verify the authentication token of the gadget trying
          // to create a channel for us.
          if (authToken[name] == token) {
            nix_channels[name] = channel;
          }
        };

        // Inject the VBScript code needed.
        var vbscript =
          // We create a class to act as a wrapper for
          // a Javascript call, to prevent a break in of
          // the context.
          'Class ' + NIX_WRAPPER + '\n '

          // An internal member for keeping track of the
          // name of the document (container or gadget)
          // for which this wrapper is intended. For
          // those wrappers created by gadgets, this is not
          // used (although it is set to "..")
          + 'Private m_Intended\n'

          // Stores the auth token used to communicate with
          // the gadget. The GetChannelCreator method returns
          // an object that returns this auth token. Upon matching
          // that with its own, the gadget uses the object
          // to actually establish the communication channel.
          + 'Private m_Auth\n'

          // Method for internally setting the value
          // of the m_Intended property.
          + 'Public Sub SetIntendedName(name)\n '
          + 'If isEmpty(m_Intended) Then\n'
          + 'm_Intended = name\n'
          + 'End If\n'
          + 'End Sub\n'

          // Method for internally setting the value of the m_Auth property.
          + 'Public Sub SetAuth(auth)\n '
          + 'If isEmpty(m_Auth) Then\n'
          + 'm_Auth = auth\n'
          + 'End If\n'
          + 'End Sub\n'

          // A wrapper method which actually causes a
          // message to be sent to the other context.
          + 'Public Sub SendMessage(data)\n '
          + NIX_HANDLE_MESSAGE + '(data)\n'
          + 'End Sub\n'

          // Returns the auth token to the gadget, so it can
          // confirm a match before initiating the connection
          + 'Public Function GetAuthToken()\n '
          + 'GetAuthToken = m_Auth\n'
          + 'End Function\n'

          // Method for setting up the container->gadget
          // channel. Not strictly needed in the gadget's
          // wrapper, but no reason to get rid of it. Note here
          // that we pass the intended name to the NIX_CREATE_CHANNEL
          // method so that it can save the channel in the proper place
          // *and* verify the channel via the authentication token passed
          // here.
          + 'Public Sub CreateChannel(channel, auth)\n '
          + 'Call ' + NIX_CREATE_CHANNEL + '(m_Intended, channel, auth)\n'
          + 'End Sub\n'
          + 'End Class\n'

          // Function to get a reference to the wrapper.
          + 'Function ' + NIX_GET_WRAPPER + '(name, auth)\n'
          + 'Dim wrap\n'
          + 'Set wrap = New ' + NIX_WRAPPER + '\n'
          + 'wrap.SetIntendedName name\n'
          + 'wrap.SetAuth auth\n'
          + 'Set ' + NIX_GET_WRAPPER + ' = wrap\n'
          + 'End Function';

        try {
          //alert('execScript! '+vbscript);
          window.execScript(vbscript, 'vbscript');
        } catch (e) {

          //alert('exception! back to ifpc');
          // Fall through to IFPC.
          relayChannel = 'ifpc';
        }
      }
    }
  }

  //Store the parsed window.name configuration, if necessary
  var config = null;

  //Parse the window.name configuration and cache it.  Handle the case
  //where containers use a JSON string in the window name and a plain string,
//  function getConfig() {
//    if (config == null) {
//        config = {};
//        if (window.name.charAt(0) != '{') {
//            config.rpcId = window.name;
//            config.kernel = true;
//        } else {
//            config = gadgets.json.parse(window.name);
//            config.rpcId = config.id;
//            return config;
//        }
//    } else {
//        return config;
//    }
//  }

  //Get the IFrame ID from the window.name property.  Handle three cases
  //1. OWF Webtop, which assumes IFrame IDs are identical to window names
  //2. OWF Kernel, which assumes that IFrame IDs are contianed in the window name as JSON as the id field
  //3. Others, which use a plain string in the window name and assume the IFrame id is also this plain string
//  function getId(windowName) {
//    var conf = getConfig();
//    if (conf.kernel)
//        return conf.rpcId;
//    else
//        return windowName;
//  }

  function getId(windowName) {
    if (windowName.charAt(0) != '{') {
      return windowName
    }
    else {
      var obj = gadgets.json.parse(windowName);
      var id = obj.id;
      return gadgets.json.stringify({id:obj.id});
    }
  }

  // Pick the most efficient RPC relay mechanism
  var relayChannel = getRelayChannel();
  //alert('relaychannel is '+relayChannel);

  // Conduct any setup necessary for the chosen channel.
  setupChannel();

  // Create the Default RPC handler.
  services[DEFAULT_NAME] = function() {
    //suppress this error - no one should ever try to use a service that wasn't registered using our api
    //throw new Error('Unknown RPC service: ' + this.s);
  };

  // Create a Special RPC handler for callbacks.
  services[CALLBACK_NAME] = function(callbackId, result) {
    var callback = callbacks[callbackId];
    if (callback) {
      delete callbacks[callbackId];
      callback(result);
    }
  };

  /**
   * Conducts any frame-specific work necessary to setup
   * the channel type chosen. This method is called when
   * the container page first registers the gadget in the
   * RPC mechanism. Gadgets, in turn, will complete the setup
   * of the channel once they send their first messages.
   */
  function setupFrame(frameId, token) {
    if (setup[frameId]) {
      return;
    }

    if (relayChannel === 'fe') {
      try {
        var frame = document.getElementById(frameId);
        frame[FE_G2C_CHANNEL] = function(args) {
          process(gadgets.json.parse(args));
        };
      } catch (e) {
        // Something went wrong. System will fallback to
        // IFPC.
      }
    }

    if (relayChannel === 'nix') {
      try {
        var frame = document.getElementById(frameId);
        var wrapper = window[NIX_GET_WRAPPER](frameId, token);
        frame.contentWindow.opener = wrapper;
      } catch (e) {
        // Something went wrong. System will fallback to
        // IFPC.
        //alert('setupFrame Error!:'+e.message);

      }
    }

    setup[frameId] = true;
  }

  /**
   * Encodes arguments for the legacy IFPC wire format.
   *
   * @param {Object} args
   * @return {String} the encoded args
   */
  function encodeLegacyData(args) {
    var stringify = gadgets.json.stringify;
    var argsEscaped = [];
    for(var i = 0, j = args.length; i < j; ++i) {
      argsEscaped.push(encodeURIComponent(stringify(args[i])));
    }
    return argsEscaped.join('&');
  }

  /**
   * Helper function to process an RPC request
   * @param {Object} rpc RPC request object
   * @private
   */
    function process(rpc) {
    //
    // RPC object contents:
    //   s: Service Name
    //   f: From
    //   c: The callback ID or 0 if none.
    //   a: The arguments for this RPC call.
    //   t: The authentication token.
    //
    if (rpc && typeof rpc.s === 'string' && typeof rpc.f === 'string' &&
        rpc.a instanceof Array) {

      //ensure id is compatible
      rpc.f = getId(rpc.f);

      // Validate auth token.
      if (authToken[rpc.f]) {
        // We allow type coercion here because all the url params are strings.
        if (authToken[rpc.f] != rpc.t) {
          throw new Error("Invalid auth token.");
        }
      }

      // If there is a callback for this service, attach a callback function
      // to the rpc context object for asynchronous rpc services.
      //
      // Synchronous rpc request handlers should simply ignore it and return a
      // value as usual.
      // Asynchronous rpc request handlers, on the other hand, should pass its
      // result to this callback function and not return a value on exit.
      //
      // For example, the following rpc handler passes the first parameter back
      // to its rpc client with a one-second delay.
      //
      // function asyncRpcHandler(param) {
      //   var me = this;
      //   setTimeout(function() {
      //     me.callback(param);
      //   }, 1000);
      // }
      if (rpc.c) {
        rpc.callback = function(result) {
          gadgets.rpc.call(rpc.f, CALLBACK_NAME, null, rpc.c, result);
        };
      }

      // Call the requested RPC service.
      var result = (services[rpc.s] ||
                    services[DEFAULT_NAME]).apply(rpc, rpc.a);

      // If the rpc request handler returns a value, immediately pass it back
      // to the callback. Otherwise, do nothing, assuming that the rpc handler
      // will make an asynchronous call later.
      if (rpc.c && typeof result != 'undefined') {
        gadgets.rpc.call(rpc.f, CALLBACK_NAME, null, rpc.c, result);
      }
    }
  }

  /**
   * Attempts to conduct an RPC call to the specified
   * target with the specified data via the NIX
   * method. If this method fails, the system attempts again
   * using the known default of IFPC.
   *
   * @param {String} targetId Module Id of the RPC service provider.
   * @param {String} serviceName Name of the service to call.
   * @param {String} from Module Id of the calling provider.
   * @param {Object} rpcData The RPC data for this call.
   */
  function callNix(targetId, serviceName, from, rpcData) {
    try {
//       alert('try nix targetId='+targetId);
//       alert('try nix from='+from);
      if (from != '..') {
//        alert('try nix1');
        // Call from gadget to the container.
        var handler = nix_channels['..'];

//        alert('Nix handler='+handler);
        //alert('GetAuthToken'+("GetAuthToken" in window.opener));
//        alert('window.opener='+window.opener);

        // If the gadget has yet to retrieve a reference to
        // the NIX handler, try to do so now. We don't do a
        // typeof(window.opener.GetAuthToken) check here
        // because it means accessing that field on the COM object, which,
        // being an internal function reference, is not allowed.
        // "in" works because it merely checks for the prescence of
        // the key, rather than actually accessing the object's property.
        // This is just a sanity check, not a validity check.
        if (!handler && window.opener && "GetAuthToken" in window.opener) {
//          alert('try nix - handler');
          handler = window.opener;

          // Create the channel to the parent/container.
          // First verify that it knows our auth token to ensure it's not
          // an impostor.
          if (handler.GetAuthToken() == authToken['..']) {
            // Auth match - pass it back along with our wrapper to finish.
            // own wrapper and our authentication token for co-verification.
            var token = authToken['..'];
            handler.CreateChannel(window[NIX_GET_WRAPPER]('..', token),
                                  token);
            // Set channel handler
            nix_channels['..'] = handler;
            window.opener = null;
          }
        }

        // If we have a handler, call it.
        if (handler) {
          //alert('sent nix');
          handler.SendMessage(rpcData);
          return;
        }

//        alert('Nix did not send3');
      } else {
        // Call from container to a gadget[targetId].
//        alert('try nix2 - nix_channels[targetId]='+nix_channels[targetId]);

        // If we have a handler, call it.
        if (nix_channels[targetId]) {
//          alert('sent nix');
          nix_channels[targetId].SendMessage(rpcData);
          return;
        }

//        alert('Nix did not send1');
      }

//      alert('Nix did not send2');

    } catch (e) {
//      alert('Nix Failed!:'+e);
    }

//    alert('fallback ifpc');

    // If we have reached this point, something has failed
    // with the NIX method, so we default to using
    // IFPC for this call.
    callIfpc(targetId, serviceName, from, rpcData);
  }

  /**
   * Attempts to conduct an RPC call to the specified
   * target with the specified data via the FrameElement
   * method. If this method fails, the system attempts again
   * using the known default of IFPC.
   *
   * @param {String} targetId Module Id of the RPC service provider.
   * @param {String} serviceName Service name to call.
   * @param {String} from Module Id of the calling provider.
   * @param {Object} rpcData The RPC data for this call.
   * @param {Array.<Object>} callArgs Original arguments to call()
   */
  function callFrameElement(targetId, serviceName, from, rpcData, callArgs) {
    //alert('callFrameElement!');
    try {
      if (from != '..') {
        // Call from gadget to the container.
        var fe = window.frameElement;

        if (typeof fe[FE_G2C_CHANNEL] === 'function') {
          // Complete the setup of the FE channel if need be.
          if (typeof fe[FE_G2C_CHANNEL][FE_C2G_CHANNEL] !== 'function') {
            fe[FE_G2C_CHANNEL][FE_C2G_CHANNEL] = function(args) {
              process(gadgets.json.parse(args));
            };
          }

          // Conduct the RPC call.
          fe[FE_G2C_CHANNEL](rpcData);
          return;
        }
      } else {
        // Call from container to gadget[targetId].
        var frame = document.getElementById(targetId);

        if (typeof frame[FE_G2C_CHANNEL] === 'function' &&
            typeof frame[FE_G2C_CHANNEL][FE_C2G_CHANNEL] === 'function') {

          // Conduct the RPC call.
          frame[FE_G2C_CHANNEL][FE_C2G_CHANNEL](rpcData);
          return;
        }
      }
    } catch (e) {
    }

    // If we have reached this point, something has failed
    // with the FrameElement method, so we default to using
    // IFPC for this call.
    callIfpc(targetId, serviceName, from, rpcData, callArgs);
  }

  /**
   * Conducts an RPC call to the specified
   * target with the specified data via the IFPC
   * method.
   *
   * @param {String} targetId Module Id of the RPC service provider.
   * @param {String} serviceName Service name to call.
   * @param {String} from Module Id of the calling provider.
   * @param {Object} rpcData The RPC data for this call.
   * @param {Array.<Object>} callArgs Original arguments to call()
   */
  function callIfpc(targetId, serviceName, from, rpcData, callArgs) {
    //alert("CONTAINER IFPC params: " + targetId + " " + serviceName + " " + from + " " + rpcData + " " + callArgs);
    // Retrieve the relay file used by IFPC. Note that
    // this must be set before the call, and so we conduct
    // an extra check to ensure it is not blank.
    var relay = gadgets.rpc.getRelayUrl(targetId);

    if (!relay) {
      throw new Error('No relay file assigned for IFPC');
    }

    // The RPC mechanism supports two formats for IFPC (legacy and current).
    var src = null,
        queueOut = [];
    if (useLegacyProtocol[targetId]) {
      // Format: #iframe_id&callId&num_packets&packet_num&block_of_data
      src = [relay, '#', encodeLegacyData([from, callId, 1, 0,
             encodeLegacyData([from, serviceName, '', '', from].concat(
               callArgs))])].join('');
      queueOut.push(src);
    } else {

      // Format: #targetId & sourceId@callId & packetNum & packetId & packetData
      src = [relay, '#', encodeURIComponent(targetId), '&', from, '@', callId, '&'].join('');
      if (!useMultiPartMessages[targetId]) {
        // Format: #targetId & sourceId@callId & packetNum & packetId & packetData
        queueOut.push([src, 1, '&', 0, '&', , encodeURIComponent(rpcData)].join(''));

      }
      else {
        var message = encodeURIComponent(rpcData),
            payloadLength = URL_LIMIT - src.length,
            numPackets = Math.ceil(message.length / payloadLength),
            packetIdx = 0,
            part;
        while (message.length > 0) {
          part = message.substring(0, payloadLength);
          message = message.substring(payloadLength);
          queueOut.push([src, numPackets, '&', packetIdx, '&', part].join(''));
          packetIdx += 1;
        }

      }

    }

    // Conduct the IFPC call by creating the Iframe with
    // the relay URL and appended message.
    do {
      emitInvisibleIframe(queueOut.shift(),targetId);
    } while (queueOut.length > 0);
    return true;


  }

  //IE only: return true if a target iframe id is in a child popup window
  function isInPopup(targetId) {
    if (!targetId) {
      return false;
    }
    if (targetId == "..") {
      return false;
    }
    var frame = document.getElementById(targetId);
    if (frame) {
      return false;
    }
    if (typeof _childWindows === 'undefined') {
      return false;
    }
    return true;
  }

  //IE only: Queue of messages for child windows
  window._childWindowMessageQueue = [];
  //IE only: Unique increasing ID for all messages put on the child window queue
  window._childWindowMessageId = 0;
  //IE only: Allow a child window to retrieve a message from the queue
  window._getChildWindowMessage = function(msgId) {
    var q = _childWindowMessageQueue;
    for(var ii=0; ii < q.length; ii++) {
      var m = q[ii];
      if (m.id == msgId) {
        return m;
      }
    }
  }

  function isMessageComplete(arr, total) {
    for (var i = total - 1; i >= 0; --i) {
      if (typeof arr[i] === 'undefined') {
        return false;
      }
    }
    return true;
  }

  /**
   * Helper function to emit an invisible IFrame.
   * @param {String} src SRC attribute of the IFrame to emit.
   * @private
   */
  function emitInvisibleIframe(src, targetId) {
    if (isInPopup(targetId)) {
        //IE only:
        //Queue the message for our child iframes, which will poll for them.
        //We do this because in IE a parent window does not have access to the
        //document of child popup windows, and hence cannot emit an iframe
        //within them
        var id = window._childWindowMessageId;
        id++;
        window._childWindowMessageQueue.push({id:id, target:targetId, src:src});
        window._childWindowMessageId++;
        if(window._childWindowMessageQueue.length > 20) {
          window._childWindowMessageQueue.shift();
        }
        return;
    }
    var iframe;
    // Recycle IFrames
    for (var i = iframePool.length - 1; i >=0; --i) {
      var ifr = iframePool[i];
      try {
        if (ifr && (ifr.recyclable || ifr.readyState === 'complete')) {
          ifr.parentNode.removeChild(ifr);
          if (window.ActiveXObject) {
            // For MSIE, delete any iframes that are no longer being used. MSIE
            // cannot reuse the IFRAME because a navigational click sound will
            // be triggered when we set the SRC attribute.
            // Other browsers scan the pool for a free iframe to reuse.
            iframePool[i] = ifr = null;
            iframePool.splice(i, 1);
          } else {
            ifr.recyclable = false;
            iframe = ifr;
            break;
          }
        }
      } catch (e) {
        // Ignore; IE7 throws an exception when trying to read readyState and
        // readyState isn't set.
      }
    }
    // Create IFrame if necessary
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.style.border = iframe.style.width = iframe.style.height = '0px';
      iframe.style.visibility = 'hidden';
      iframe.style.position = 'absolute';
      iframe.onload = function() { this.recyclable = true; };
      iframePool.push(iframe);
    }
    iframe.src = src;
    setTimeout(function() { document.body.appendChild(iframe); }, 0);
  }

    //Find a target IFrame or window based off an RPC ID, allowing for
    //the fact that child popup windows with IFrames might exist.
    function getTargetWin(id) {
      if (typeof id === "undefined" || id === "..") {
          //Check to see if we are an iframe in a child window, and if so use the opener
          if(window.parent.opener) {
              return window.parent.opener.parent;
          }
          //Normal case, we are an IFrame in a page
          return window.parent;
      }

      //At this point we are a container looking for a child iframe

      // Cast to a String to avoid an index lookup.
      id = String(id);

      var target = null;

      // Try window.frames first
      //apparently in FF using window.frames will return a bogus window object if the
      //iframe was removed and re-added to the document so it's always better to just do
      //a dom lookup
//      target = window.frames[id];
//      if (target) {
//          return target;
//      }

      // Fall back to getElementById()
      target = document.getElementById(id);
      if (target && target.contentWindow) {
        return target.contentWindow;
      }

      // At this point we have missed on searching for child iframes
      // in the main browser window, so search popup windows
      // This assumes the container is keeping a list of child
      // windows in the global _childWindows array
      if (typeof _childWindows !== 'undefined') {
          for(var ii=0; ii<_childWindows.length;ii++) {
              var childWindow = _childWindows[ii];
              try {
                  //In IE 8, this will throw an exception.
                  if (childWindow.document) {
                      target = childWindow.document.getElementById(id);
                  }
              } catch(e) {
                  //BUG. Don't know how to support
                  //direct WMP calls from parent to child popups
                  //in IE 8.
              }
              if (target && target.contentWindow) {
                return target.contentWindow;
              }
          }
      }
      return null;
    }


  /**
   * Attempts to make an rpc by calling the target's receive method directly.
   * This works when gadgets are rendered on the same domain as their container,
   * a potentially useful optimization for trusted content which keeps
   * RPC behind a consistent interface.
   * @param {String} target Module id of the rpc service provider
   * @param {String} from Module id of the caller (this)
   * @param {String} callbackId Id of the call
   * @param {String} rpcData JSON-encoded RPC payload
   * @return
   */
  function callSameDomain(target, rpc) {
    var fn;

    if (sameDomain[target] !== false) {
      // Seed with a negative, typed value to avoid
      // hitting this code path repeatedly
      sameDomain[target] = false;
      var targetEl = getTargetWin(target);

      try {
        // If this succeeds, then same-domain policy applied
//        sameDomain[target] = targetEl.gadgets.rpc.receiveSameDomain;
        fn = targetEl.gadgets.rpc.receiveSameDomain;
      } catch (e) {
        // Usual case: different domains
      }
    }

    if (typeof fn === 'function') {
      // Call target's receive method
      fn(rpc);
      sameDomain[target] = true;
      return true;
    }
    else
        sameDomain[target] = false;

    return false;
  }

  // gadgets.config might not be available, such as when serving container js.
  if (gadgets.config) {
    /**
     * Initializes RPC from the provided configuration.
     */
    function init(config) {
	  //alert("CONTAINER Config: " + config);
      // Allow for wild card parent relay files as long as it's from a
      // white listed domain. This is enforced by the rendering servlet.
      if (config.rpc.parentRelayUrl.substring(0, 7) === 'http://') {
        relayUrl['..'] = config.rpc.parentRelayUrl;
      } else {
        // It's a relative path, and we must append to the parent.
        // We're relying on the server validating the parent parameter in this
        // case. Because of this, parent may only be passed in the query, not
        // the fragment.
        var params = document.location.search.substring(0).split("&");
		//alert("Init Config method - Setting Params: " + params);
        var parentParam = "";
        for (var i = 0, param; param = params[i]; ++i) {
          // Only the first parent can be validated.
          if (param.indexOf("parent=") === 0) {
            parentParam = decodeURIComponent(param.substring(7));
            break;
          }
        }
        relayUrl['..'] = parentParam + config.rpc.parentRelayUrl;
      }
      useLegacyProtocol['..'] = !!config.rpc.useLegacyProtocol;
    }

    var requiredConfig = {
      parentRelayUrl : gadgets.config.NonEmptyStringValidator
    };
    gadgets.config.register("rpc", requiredConfig, init);
  }

  return /** @scope gadgets.rpc */ {
    /**
     * Registers an RPC service.
     * @param {String} serviceName Service name to register.
     * @param {Function} handler Service handler.
     *
     * @member gadgets.rpc
     */
    register: function(serviceName, handler) {
	//alert("CONTAINER REGISTER VARIABLES: " + serviceName + " -|- " + handler);
      if (serviceName == CALLBACK_NAME) {
        throw new Error("Cannot overwrite callback service");
      }

      if (serviceName == DEFAULT_NAME) {
        throw new Error("Cannot overwrite default service:"
                        + " use registerDefault");
      }
	  services[serviceName] = handler;
    },

    /**
     * Unregisters an RPC service.
     * @param {String} serviceName Service name to unregister.
     *
     * @member gadgets.rpc
     */
    unregister: function(serviceName) {
      if (serviceName == CALLBACK_NAME) {
        throw new Error("Cannot delete callback service");
      }

      if (serviceName == DEFAULT_NAME) {
        throw new Error("Cannot delete default service:"
                        + " use unregisterDefault");
      }

      delete services[serviceName];
    },

    /**
     * Registers a default service handler to processes all unknown
     * RPC calls which raise an exception by default.
     * @param {Function} handler Service handler.
     *
     * @member gadgets.rpc
     */
    registerDefault: function(handler) {
      services[''] = handler;
    },

    /**
     * Unregisters the default service handler. Future unknown RPC
     * calls will fail silently.
     *
     * @member gadgets.rpc
     */
    unregisterDefault: function() {
      delete services[''];
    },

    /**
     * Calls an RPC service.
     * @param {String} targetId Module Id of the RPC service provider.
     *                          Empty if calling the parent container.
     * @param {String} serviceName Service name to call.
     * @param {Function|null} callback Callback function (if any) to process
     *                                 the return value of the RPC request.
     * @param {*} var_args Parameters for the RPC request.
     *
     * @member gadgets.rpc
     */
    call: function(targetId, serviceName, callback, var_args) {
      ++callId;
	  targetId = getId(targetId) || '..';
      if (callback) {
        callbacks[callId] = callback;
      }

      // Default to the container calling.
      var from = '..';

      if (targetId === '..') {
//        from = window.name;
        from = getId(window.name);
      }

      // Not used by legacy, create it anyway...
      var rpc = {
        s: serviceName,
        f: from,
        c: callback ? callId : 0,
        a: Array.prototype.slice.call(arguments, 3),
        t: authToken[targetId]
      };

      // If target is on the same domain, call method directly
      if (callSameDomain(targetId, rpc)) {
        return;
      }

      var rpcData = gadgets.json.stringify(rpc);

      var channelType = relayChannel;

      // If we are told to use the legacy format, then we must
      // default to IFPC.
      if (useLegacyProtocol[targetId]) {
        channelType = 'ifpc';
      }

      //alert('channelType:'+channelType);
      switch (channelType) {
        case 'dpm': // use document.postMessage.
          // Get the window from the document. Fixes a bug with postMessage
          // calls on a target that had been removed then appended to the document object
            var targetWin = getTargetWin(targetId);
            var targetDoc = targetWin.document;

          if (targetDoc != null)
            try {
              targetDoc.postMessage(rpcData);
            } catch (e) {
              callIfpc(targetId, serviceName, from, rpcData, rpc.a);
            }
          break;

        case 'wpm': // use window.postMessage.
          // Get the window from the document. Fixes a bug with postMessage
          // calls on a target that had been removed then appended to the document object
            var targetWin = getTargetWin(targetId);

          if (targetWin != null) {
            try {
              targetWin.postMessage(rpcData, relayUrl[targetId]);
            } catch (e) {
              callIfpc(targetId, serviceName, from, rpcData, rpc.a);
            }
          }
          break;

        case 'nix': // use NIX.
          //alert('callNix!');
          callNix(targetId, serviceName, from, rpcData);
          break;

        case 'fe': // use FrameElement.
          callFrameElement(targetId, serviceName, from, rpcData, rpc.a);
          break;

        default: // use 'ifpc' as a fallback mechanism.
          callIfpc(targetId, serviceName, from, rpcData, rpc.a);
          break;
      }
    },

    /**
     * Gets the relay URL of a target frame.
     * @param {String} targetId Name of the target frame.
     * @return {String|undefined} Relay URL of the target frame.
     *
     * @member gadgets.rpc
     */
    getRelayUrl: function(targetId) {
      return relayUrl[targetId];
    },

    /**
     * Sets the relay URL of a target frame.
     * @param {String} targetId Name of the target frame.
     * @param {String} url Full relay URL of the target frame.
     * @param {Boolean} opt_useLegacy True if this relay needs the legacy IFPC
     *     wire format.
     *
     * @member gadgets.rpc
     */
    setRelayUrl: function(targetId, url, opt_useLegacy, useMultiPartMessagesForIFPC) {
      relayUrl[targetId] = url;
      useLegacyProtocol[targetId] = !!opt_useLegacy;
      useMultiPartMessages[targetId] = !!useMultiPartMessagesForIFPC;
    },

    /**
     * Sets the auth token of a target frame.
     * @param {String} targetId Name of the target frame.
     * @param {String} token The authentication token to use for all
     *     calls to or from this target id.
     *
     * @member gadgets.rpc
     */
    setAuthToken: function(targetId, token) {
      authToken[targetId] = token;
      setupFrame(targetId, token);
    },

    /**
     * Gets the RPC relay mechanism.
     * @return {String} RPC relay mechanism. See above for
     *   a list of supported types.
     *
     * @member gadgets.rpc
     */
    getRelayChannel: function() {
      return relayChannel;
    },

    /**
     * Receives and processes an RPC request. (Not to be used directly.)
     * @param {Array.<String>} fragment An RPC request fragment encoded as
     *        an array. The first 4 elements are target id, source id & call id,
     *        total packet number, packet id. The last element stores the actual
     *        JSON-encoded and URI escaped packet data.
     *
     * @member gadgets.rpc
     */
    receive: function(fragment) {
      if (fragment.length > 4) {
//        // TODO parse fragment[1..3] to merge multi-fragment messages
//        process(gadgets.json.parse(
//            decodeURIComponent(fragment[fragment.length - 1])));

        var from = fragment[1],   // in the form of "<from>@<callid>"
            numPackets = parseInt(fragment[2], 10),
            packetIdx = parseInt(fragment[3], 10),
            payload = fragment[fragment.length - 1],
            completed = numPackets === 1;

        // if message is multi-part, store parts in the proper order
        if (numPackets > 1) {
          if (!messagesIn[from]) {
            messagesIn[from] = [];
          }
          messagesIn[from][packetIdx] = payload;
          // check if all parts have been sent
          if (isMessageComplete(messagesIn[from], numPackets)) {
            payload = messagesIn[from].join('');
            delete messagesIn[from];
            completed = true;
          }
        }

        // complete message sent
        if (completed) {
          process(gadgets.json.parse(decodeURIComponent(payload)));
        }
      }
    },

    /**
     * Receives and processes an RPC request sent via the same domain.
     * (Not to be used directly). Converts the inbound rpc object's
     * Array into a local Array to pass the process() Array test.
     * @param {Object} rpc RPC object containing all request params
     */
    receiveSameDomain: function(rpc) {
      // Pass through to local process method but converting to a local Array
      rpc.a = Array.prototype.slice.call(rpc.a);
	  window.setTimeout(function() { process(rpc) }, 0);
    }
  };
}();

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Gadget-side PubSub library for gadget-to-gadget communication.
 */

var gadgets = gadgets || {};

/**
 * @static
 * @class Provides operations for making rpc calls.
 * @name gadgets.pubsub
 */
gadgets.pubsub = (function() {
  var listeners = {};

  function router(channel, sender, message) {
    var listener = listeners[channel];
    if (typeof listener === 'function') {
      listener(sender, message,channel);
    }
  }

  return /** @scope gadgets.pubsub */ {
    /**
     * Publishes a message to a channel.
     * @param {string} channel Channel name.
     * @param {string} message Message to publish.
     */
    publish: function(channel, message, dest) {
      gadgets.rpc.call('..', 'pubsub', null, 'publish', channel, message, dest);
    },

    /**
     * Subscribes to a channel.
     * @param {string} channel Channel name.
     * @param {function} callback Callback function that receives messages.
     *                   For example:
     *                   function(sender, message) {
     *                     if (isTrustedGadgetSpecUrl(sender)) {
     *                       processMessage(message);
     *                     }
     *                   }
     */
    subscribe: function(channel, callback) {
      listeners[channel] = callback;
      gadgets.rpc.register('pubsub', router);
      gadgets.rpc.call('..', 'pubsub', null, 'subscribe', channel);
    },

    /**
     * Unsubscribes from a channel.
     * @param {string} channel Channel name.
     */
    unsubscribe: function(channel) {
      delete listeners[channel];
      gadgets.rpc.call('..', 'pubsub', null, 'unsubscribe', channel);
      }

  };
})();


/**
 * Copyright 2009 Tim Down.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


if(!Array.prototype.push){Array.prototype.push=function(){for(var i=0,len=arguments.length;i<len;i++){this[this.length]=arguments[i];}
return this.length;};}
if(!Array.prototype.shift){Array.prototype.shift=function(){if(this.length>0){var firstItem=this[0];for(var i=0,len=this.length-1;i<len;i++){this[i]=this[i+1];}
this.length=this.length-1;return firstItem;}};}
if(!Array.prototype.splice){Array.prototype.splice=function(startIndex,deleteCount){var itemsAfterDeleted=this.slice(startIndex+deleteCount);var itemsDeleted=this.slice(startIndex,startIndex+deleteCount);this.length=startIndex;var argumentsArray=[];for(var i=0,len=arguments.length;i<len;i++){argumentsArray[i]=arguments[i];}
var itemsToAppend=(argumentsArray.length>2)?itemsAfterDeleted=argumentsArray.slice(2).concat(itemsAfterDeleted):itemsAfterDeleted;for(i=0,len=itemsToAppend.length;i<len;i++){this.push(itemsToAppend[i]);}
return itemsDeleted;};}
var log4javascript;(function(){function isUndefined(obj){return typeof obj=="undefined";}
function EventSupport(){}
EventSupport.prototype={eventTypes:[],eventListeners:{},setEventTypes:function(eventTypesParam){if(eventTypesParam instanceof Array){this.eventTypes=eventTypesParam;this.eventListeners={};for(var i=0,len=this.eventTypes.length;i<len;i++){this.eventListeners[this.eventTypes[i]]=[];}}else{handleError("log4javascript.EventSupport ["+this+"]: setEventTypes: eventTypes parameter must be an Array");}},addEventListener:function(eventType,listener){if(typeof listener=="function"){if(!array_contains(this.eventTypes,eventType)){handleError("log4javascript.EventSupport ["+this+"]: addEventListener: no event called '"+eventType+"'");}
this.eventListeners[eventType].push(listener);}else{handleError("log4javascript.EventSupport ["+this+"]: addEventListener: listener must be a function");}},removeEventListener:function(eventType,listener){if(typeof listener=="function"){if(!array_contains(this.eventTypes,eventType)){handleError("log4javascript.EventSupport ["+this+"]: removeEventListener: no event called '"+eventType+"'");}
array_remove(this.eventListeners[eventType],listener);}else{handleError("log4javascript.EventSupport ["+this+"]: removeEventListener: listener must be a function");}},dispatchEvent:function(eventType,eventArgs){if(array_contains(this.eventTypes,eventType)){var listeners=this.eventListeners[eventType];for(var i=0,len=listeners.length;i<len;i++){listeners[i](this,eventType,eventArgs);}}else{handleError("log4javascript.EventSupport ["+this+"]: dispatchEvent: no event called '"+eventType+"'");}}};var applicationStartDate=new Date();var uniqueId="log4javascript_"+applicationStartDate.getTime()+"_"+
Math.floor(Math.random()*100000000);var emptyFunction=function(){};var newLine="\r\n";var pageLoaded=false;function Log4JavaScript(){}
Log4JavaScript.prototype=new EventSupport();log4javascript=new Log4JavaScript();log4javascript.version="1.4.1";log4javascript.edition="log4javascript";function toStr(obj){if(obj&&obj.toString){return obj.toString();}else{return String(obj);}}
function getExceptionMessage(ex){if(ex.message){return ex.message;}else if(ex.description){return ex.description;}else{return toStr(ex);}}
function getUrlFileName(url){var lastSlashIndex=Math.max(url.lastIndexOf("/"),url.lastIndexOf("\\"));return url.substr(lastSlashIndex+1);}
function getExceptionStringRep(ex){if(ex){var exStr="Exception: "+getExceptionMessage(ex);try{if(ex.lineNumber){exStr+=" on line number "+ex.lineNumber;}
if(ex.fileName){exStr+=" in file "+getUrlFileName(ex.fileName);}}catch(localEx){logLog.warn("Unable to obtain file and line information for error");}
if(showStackTraces&&ex.stack){exStr+=newLine+"Stack trace:"+newLine+ex.stack;}
return exStr;}
return null;}
function bool(obj){return Boolean(obj);}
function trim(str){return str.replace(/^\s+/,"").replace(/\s+$/,"");}
function splitIntoLines(text){var text2=text.replace(/\r\n/g,"\n").replace(/\r/g,"\n");return text2.split("\n");}
function urlEncode(str){return escape(str).replace(/\+/g,"%2B").replace(/"/g,"%22").replace(/'/g,"%27").replace(/\//g,"%2F").replace(/=/g,"%3D");}
function urlDecode(str){return unescape(str).replace(/%2B/g,"+").replace(/%22/g,"\"").replace(/%27/g,"'").replace(/%2F/g,"/").replace(/%3D/g,"=");}
function array_remove(arr,val){var index=-1;for(var i=0,len=arr.length;i<len;i++){if(arr[i]===val){index=i;break;}}
if(index>=0){arr.splice(index,1);return true;}else{return false;}}
function array_contains(arr,val){for(var i=0,len=arr.length;i<len;i++){if(arr[i]==val){return true;}}
return false;}
function extractBooleanFromParam(param,defaultValue){if(isUndefined(param)){return defaultValue;}else{return bool(param);}}
function extractStringFromParam(param,defaultValue){if(isUndefined(param)){return defaultValue;}else{return String(param);}}
function extractIntFromParam(param,defaultValue){if(isUndefined(param)){return defaultValue;}else{try{var value=parseInt(param,10);return isNaN(value)?defaultValue:value;}catch(ex){logLog.warn("Invalid int param "+param,ex);return defaultValue;}}}
function extractFunctionFromParam(param,defaultValue){if(typeof param=="function"){return param;}else{return defaultValue;}}
function isError(err){return(err instanceof Error);}
if(!Function.prototype.apply){Function.prototype.apply=function(obj,args){var methodName="__apply__";if(typeof obj[methodName]!="undefined"){methodName+=String(Math.random()).substr(2);}
obj[methodName]=this;var argsStrings=[];for(var i=0,len=args.length;i<len;i++){argsStrings[i]="args["+i+"]";}
var script="obj."+methodName+"("+argsStrings.join(",")+")";var returnValue=eval(script);delete obj[methodName];return returnValue;};}
if(!Function.prototype.call){Function.prototype.call=function(obj){var args=[];for(var i=1,len=arguments.length;i<len;i++){args[i-1]=arguments[i];}
return this.apply(obj,args);};}
function getListenersPropertyName(eventName){return"__log4javascript_listeners__"+eventName;}
function addEvent(node,eventName,listener,useCapture,win){win=win?win:window;if(node.addEventListener){node.addEventListener(eventName,listener,useCapture);}else if(node.attachEvent){node.attachEvent("on"+eventName,listener);}else{var propertyName=getListenersPropertyName(eventName);if(!node[propertyName]){node[propertyName]=[];node["on"+eventName]=function(evt){evt=getEvent(evt,win);var listenersPropertyName=getListenersPropertyName(eventName);var listeners=this[listenersPropertyName].concat([]);var currentListener;while((currentListener=listeners.shift())){currentListener.call(this,evt);}};}
node[propertyName].push(listener);}}
function removeEvent(node,eventName,listener,useCapture){if(node.removeEventListener){node.removeEventListener(eventName,listener,useCapture);}else if(node.detachEvent){node.detachEvent("on"+eventName,listener);}else{var propertyName=getListenersPropertyName(eventName);if(node[propertyName]){array_remove(node[propertyName],listener);}}}
function getEvent(evt,win){win=win?win:window;return evt?evt:win.event;}
function stopEventPropagation(evt){if(evt.stopPropagation){evt.stopPropagation();}else if(typeof evt.cancelBubble!="undefined"){evt.cancelBubble=true;}
evt.returnValue=false;}
var logLog={quietMode:false,debugMessages:[],setQuietMode:function(quietMode){this.quietMode=bool(quietMode);},numberOfErrors:0,alertAllErrors:false,setAlertAllErrors:function(alertAllErrors){this.alertAllErrors=alertAllErrors;},debug:function(message){this.debugMessages.push(message);},displayDebug:function(){alert(this.debugMessages.join(newLine));},warn:function(message,exception){},error:function(message,exception){if(++this.numberOfErrors==1||this.alertAllErrors){if(!this.quietMode){var alertMessage="log4javascript error: "+message;if(exception){alertMessage+=newLine+newLine+"Original error: "+getExceptionStringRep(exception);}
alert(alertMessage);}}}};log4javascript.logLog=logLog;log4javascript.setEventTypes(["load","error"]);function handleError(message,exception){logLog.error(message,exception);log4javascript.dispatchEvent("error",{"message":message,"exception":exception});}
log4javascript.handleError=handleError;var enabled=!((typeof log4javascript_disabled!="undefined")&&log4javascript_disabled);log4javascript.setEnabled=function(enable){enabled=bool(enable);};log4javascript.isEnabled=function(){return enabled;};var useTimeStampsInMilliseconds=true;log4javascript.setTimeStampsInMilliseconds=function(timeStampsInMilliseconds){useTimeStampsInMilliseconds=bool(timeStampsInMilliseconds);};log4javascript.isTimeStampsInMilliseconds=function(){return useTimeStampsInMilliseconds;};log4javascript.evalInScope=function(expr){return eval(expr);};var showStackTraces=false;log4javascript.setShowStackTraces=function(show){showStackTraces=bool(show);};var Level=function(level,name){this.level=level;this.name=name;};Level.prototype={toString:function(){return this.name;},equals:function(level){return this.level==level.level;},isGreaterOrEqual:function(level){return this.level>=level.level;}};Level.ALL=new Level(Number.MIN_VALUE,"ALL");Level.TRACE=new Level(10000,"TRACE");Level.DEBUG=new Level(20000,"DEBUG");Level.INFO=new Level(30000,"INFO");Level.WARN=new Level(40000,"WARN");Level.ERROR=new Level(50000,"ERROR");Level.FATAL=new Level(60000,"FATAL");Level.OFF=new Level(Number.MAX_VALUE,"OFF");log4javascript.Level=Level;function Timer(name,level){this.name=name;this.level=isUndefined(level)?Level.INFO:level;this.start=new Date();}
Timer.prototype.getElapsedTime=function(){return new Date().getTime()-this.start.getTime();};var anonymousLoggerName="[anonymous]";var defaultLoggerName="[default]";var nullLoggerName="[null]";var rootLoggerName="root";function Logger(name){this.name=name;this.parent=null;this.children=[];var appenders=[];var loggerLevel=null;var isRoot=(this.name===rootLoggerName);var isNull=(this.name===nullLoggerName);var appenderCache=null;var appenderCacheInvalidated=false;this.addChild=function(childLogger){this.children.push(childLogger);childLogger.parent=this;childLogger.invalidateAppenderCache();};var additive=true;this.getAdditivity=function(){return additive;};this.setAdditivity=function(additivity){var valueChanged=(additive!=additivity);additive=additivity;if(valueChanged){this.invalidateAppenderCache();}};this.addAppender=function(appender){if(isNull){handleError("Logger.addAppender: you may not add an appender to the null logger");}else{if(appender instanceof log4javascript.Appender){if(!array_contains(appenders,appender)){appenders.push(appender);appender.setAddedToLogger(this);this.invalidateAppenderCache();}}else{handleError("Logger.addAppender: appender supplied ('"+
toStr(appender)+"') is not a subclass of Appender");}}};this.removeAppender=function(appender){array_remove(appenders,appender);appender.setRemovedFromLogger(this);this.invalidateAppenderCache();};this.removeAllAppenders=function(){var appenderCount=appenders.length;if(appenderCount>0){for(var i=0;i<appenderCount;i++){appenders[i].setRemovedFromLogger(this);}
appenders.length=0;this.invalidateAppenderCache();}};this.getEffectiveAppenders=function(){if(appenderCache===null||appenderCacheInvalidated){var parentEffectiveAppenders=(isRoot||!this.getAdditivity())?[]:this.parent.getEffectiveAppenders();appenderCache=parentEffectiveAppenders.concat(appenders);appenderCacheInvalidated=false;}
return appenderCache;};this.invalidateAppenderCache=function(){appenderCacheInvalidated=true;for(var i=0,len=this.children.length;i<len;i++){this.children[i].invalidateAppenderCache();}};this.log=function(level,params){if(level.isGreaterOrEqual(this.getEffectiveLevel())){var exception;var finalParamIndex=params.length-1;var lastParam=params[params.length-1];if(params.length>1&&isError(lastParam)){exception=lastParam;finalParamIndex--;}
var messages=[];for(var i=0;i<=finalParamIndex;i++){messages[i]=params[i];}
var loggingEvent=new LoggingEvent(this,new Date(),level,messages,exception);this.callAppenders(loggingEvent);}};this.callAppenders=function(loggingEvent){var effectiveAppenders=this.getEffectiveAppenders();for(var i=0,len=effectiveAppenders.length;i<len;i++){effectiveAppenders[i].doAppend(loggingEvent);}};this.setLevel=function(level){if(isRoot&&level===null){handleError("Logger.setLevel: you cannot set the level of the root logger to null");}else if(level instanceof Level){loggerLevel=level;}else{handleError("Logger.setLevel: level supplied to logger "+
this.name+" is not an instance of log4javascript.Level");}};this.getLevel=function(){return loggerLevel;};this.getEffectiveLevel=function(){for(var logger=this;logger!==null;logger=logger.parent){var level=logger.getLevel();if(level!==null){return level;}}};this.group=function(name,initiallyExpanded){var effectiveAppenders=this.getEffectiveAppenders();for(var i=0,len=effectiveAppenders.length;i<len;i++){effectiveAppenders[i].group(name,initiallyExpanded);}};this.groupEnd=function(name){var effectiveAppenders=this.getEffectiveAppenders();for(var i=0,len=effectiveAppenders.length;i<len;i++){effectiveAppenders[i].groupEnd();}};var timers={};this.time=function(name,level){if(isUndefined(name)){handleError("Logger.time: a name for the timer must be supplied");}else if(level&&!(level instanceof Level)){handleError("Logger.time: level supplied to timer "+
name+" is not an instance of log4javascript.Level");}else{timers[name]=new Timer(name,level);}};this.timeEnd=function(name){if(isUndefined(name)){handleError("Logger.timeEnd: a name for the timer must be supplied");}else if(timers[name]){var timer=timers[name];var milliseconds=timer.getElapsedTime();this.log(timer.level,["Timer "+toStr(name)+" completed in "+milliseconds+"ms"]);delete timers[name];}else{logLog.warn("Logger.timeEnd: no timer found with name "+name);}};this.assert=function(expr){if(!expr){var args=[];for(var i=1,len=arguments.length;i<len;i++){args.push(arguments[i]);}
args=(args.length>0)?args:["Assertion Failure"];args.push(newLine);args.push(expr);this.log(Level.ERROR,args);}};this.toString=function(){return"Logger["+this.name+"]";};}
Logger.prototype={trace:function(){this.log(Level.TRACE,arguments);},debug:function(){this.log(Level.DEBUG,arguments);},info:function(){this.log(Level.INFO,arguments);},warn:function(){this.log(Level.WARN,arguments);},error:function(){this.log(Level.ERROR,arguments);},fatal:function(){this.log(Level.FATAL,arguments);},isEnabledFor:function(level){return level.isGreaterOrEqual(this.getEffectiveLevel());},isTraceEnabled:function(){return this.isEnabledFor(Level.TRACE);},isDebugEnabled:function(){return this.isEnabledFor(Level.DEBUG);},isInfoEnabled:function(){return this.isEnabledFor(Level.INFO);},isWarnEnabled:function(){return this.isEnabledFor(Level.WARN);},isErrorEnabled:function(){return this.isEnabledFor(Level.ERROR);},isFatalEnabled:function(){return this.isEnabledFor(Level.FATAL);}};Logger.prototype.trace.isEntryPoint=true;Logger.prototype.debug.isEntryPoint=true;Logger.prototype.info.isEntryPoint=true;Logger.prototype.warn.isEntryPoint=true;Logger.prototype.error.isEntryPoint=true;Logger.prototype.fatal.isEntryPoint=true;var loggers={};var loggerNames=[];var ROOT_LOGGER_DEFAULT_LEVEL=Level.DEBUG;var rootLogger=new Logger(rootLoggerName);rootLogger.setLevel(ROOT_LOGGER_DEFAULT_LEVEL);log4javascript.getRootLogger=function(){return rootLogger;};log4javascript.getLogger=function(loggerName){if(!(typeof loggerName=="string")){loggerName=anonymousLoggerName;logLog.warn("log4javascript.getLogger: non-string logger name "+
toStr(loggerName)+" supplied, returning anonymous logger");}
if(loggerName==rootLoggerName){handleError("log4javascript.getLogger: root logger may not be obtained by name");}
if(!loggers[loggerName]){var logger=new Logger(loggerName);loggers[loggerName]=logger;loggerNames.push(loggerName);var lastDotIndex=loggerName.lastIndexOf(".");var parentLogger;if(lastDotIndex>-1){var parentLoggerName=loggerName.substring(0,lastDotIndex);parentLogger=log4javascript.getLogger(parentLoggerName);}else{parentLogger=rootLogger;}
parentLogger.addChild(logger);}
return loggers[loggerName];};var defaultLogger=null;log4javascript.getDefaultLogger=function(){if(!defaultLogger){defaultLogger=log4javascript.getLogger(defaultLoggerName);var a=new log4javascript.PopUpAppender();defaultLogger.addAppender(a);}
return defaultLogger;};var nullLogger=null;log4javascript.getNullLogger=function(){if(!nullLogger){nullLogger=new Logger(nullLoggerName);nullLogger.setLevel(Level.OFF);}
return nullLogger;};log4javascript.resetConfiguration=function(){rootLogger.setLevel(ROOT_LOGGER_DEFAULT_LEVEL);loggers={};};var LoggingEvent=function(logger,timeStamp,level,messages,exception){this.logger=logger;this.timeStamp=timeStamp;this.timeStampInMilliseconds=timeStamp.getTime();this.timeStampInSeconds=Math.floor(this.timeStampInMilliseconds/1000);this.milliseconds=this.timeStamp.getMilliseconds();this.level=level;this.messages=messages;this.exception=exception;};LoggingEvent.prototype={getThrowableStrRep:function(){return this.exception?getExceptionStringRep(this.exception):"";},getCombinedMessages:function(){return(this.messages.length==1)?this.messages[0]:this.messages.join(newLine);},toString:function(){return"LoggingEvent["+this.level+"]";}};log4javascript.LoggingEvent=LoggingEvent;var Layout=function(){};Layout.prototype={defaults:{loggerKey:"logger",timeStampKey:"timestamp",millisecondsKey:"milliseconds",levelKey:"level",messageKey:"message",exceptionKey:"exception",urlKey:"url"},loggerKey:"logger",timeStampKey:"timestamp",millisecondsKey:"milliseconds",levelKey:"level",messageKey:"message",exceptionKey:"exception",urlKey:"url",batchHeader:"",batchFooter:"",batchSeparator:"",returnsPostData:false,overrideTimeStampsSetting:false,useTimeStampsInMilliseconds:null,format:function(loggingEvent){handleError("Layout.format: layout supplied has no format() method");},ignoresThrowable:function(){handleError("Layout.ignoresThrowable: layout supplied has no ignoresThrowable() method");},getContentType:function(){return"text/plain";},allowBatching:function(){return true;},setTimeStampsInMilliseconds:function(timeStampsInMilliseconds){this.overrideTimeStampsSetting=true;this.useTimeStampsInMilliseconds=bool(timeStampsInMilliseconds);},isTimeStampsInMilliseconds:function(){return this.overrideTimeStampsSetting?this.useTimeStampsInMilliseconds:useTimeStampsInMilliseconds;},getTimeStampValue:function(loggingEvent){return this.isTimeStampsInMilliseconds()?loggingEvent.timeStampInMilliseconds:loggingEvent.timeStampInSeconds;},getDataValues:function(loggingEvent,combineMessages){var dataValues=[[this.loggerKey,loggingEvent.logger.name],[this.timeStampKey,this.getTimeStampValue(loggingEvent)],[this.levelKey,loggingEvent.level.name],[this.urlKey,window.location.href],[this.messageKey,combineMessages?loggingEvent.getCombinedMessages():loggingEvent.messages]];if(!this.isTimeStampsInMilliseconds()){dataValues.push([this.millisecondsKey,loggingEvent.milliseconds]);}
if(loggingEvent.exception){dataValues.push([this.exceptionKey,getExceptionStringRep(loggingEvent.exception)]);}
if(this.hasCustomFields()){for(var i=0,len=this.customFields.length;i<len;i++){var val=this.customFields[i].value;if(typeof val==="function"){val=val(this,loggingEvent);}
dataValues.push([this.customFields[i].name,val]);}}
return dataValues;},setKeys:function(loggerKey,timeStampKey,levelKey,messageKey,exceptionKey,urlKey,millisecondsKey){this.loggerKey=extractStringFromParam(loggerKey,this.defaults.loggerKey);this.timeStampKey=extractStringFromParam(timeStampKey,this.defaults.timeStampKey);this.levelKey=extractStringFromParam(levelKey,this.defaults.levelKey);this.messageKey=extractStringFromParam(messageKey,this.defaults.messageKey);this.exceptionKey=extractStringFromParam(exceptionKey,this.defaults.exceptionKey);this.urlKey=extractStringFromParam(urlKey,this.defaults.urlKey);this.millisecondsKey=extractStringFromParam(millisecondsKey,this.defaults.millisecondsKey);},setCustomField:function(name,value){var fieldUpdated=false;for(var i=0,len=this.customFields.length;i<len;i++){if(this.customFields[i].name===name){this.customFields[i].value=value;fieldUpdated=true;}}
if(!fieldUpdated){this.customFields.push({"name":name,"value":value});}},hasCustomFields:function(){return(this.customFields.length>0);},toString:function(){handleError("Layout.toString: all layouts must override this method");}};log4javascript.Layout=Layout;var Appender=function(){};Appender.prototype=new EventSupport();Appender.prototype.layout=new PatternLayout();Appender.prototype.threshold=Level.ALL;Appender.prototype.loggers=[];Appender.prototype.doAppend=function(loggingEvent){if(enabled&&loggingEvent.level.level>=this.threshold.level){this.append(loggingEvent);}};Appender.prototype.append=function(loggingEvent){};Appender.prototype.setLayout=function(layout){if(layout instanceof Layout){this.layout=layout;}else{handleError("Appender.setLayout: layout supplied to "+
this.toString()+" is not a subclass of Layout");}};Appender.prototype.getLayout=function(){return this.layout;};Appender.prototype.setThreshold=function(threshold){if(threshold instanceof Level){this.threshold=threshold;}else{handleError("Appender.setThreshold: threshold supplied to "+
this.toString()+" is not a subclass of Level");}};Appender.prototype.getThreshold=function(){return this.threshold;};Appender.prototype.setAddedToLogger=function(logger){this.loggers.push(logger);};Appender.prototype.setRemovedFromLogger=function(logger){array_remove(this.loggers,logger);};Appender.prototype.group=emptyFunction;Appender.prototype.groupEnd=emptyFunction;Appender.prototype.toString=function(){handleError("Appender.toString: all appenders must override this method");};log4javascript.Appender=Appender;function SimpleLayout(){this.customFields=[];}
SimpleLayout.prototype=new Layout();SimpleLayout.prototype.format=function(loggingEvent){return loggingEvent.level.name+" - "+loggingEvent.getCombinedMessages();};SimpleLayout.prototype.ignoresThrowable=function(){return true;};SimpleLayout.prototype.toString=function(){return"SimpleLayout";};log4javascript.SimpleLayout=SimpleLayout;function NullLayout(){this.customFields=[];}
NullLayout.prototype=new Layout();NullLayout.prototype.format=function(loggingEvent){return loggingEvent.messages;};NullLayout.prototype.ignoresThrowable=function(){return true;};NullLayout.prototype.toString=function(){return"NullLayout";};log4javascript.NullLayout=NullLayout;function XmlLayout(combineMessages){this.combineMessages=extractBooleanFromParam(combineMessages,true);this.customFields=[];}
XmlLayout.prototype=new Layout();XmlLayout.prototype.isCombinedMessages=function(){return this.combineMessages;};XmlLayout.prototype.getContentType=function(){return"text/xml";};XmlLayout.prototype.escapeCdata=function(str){return str.replace(/\]\]>/,"]]>]]&gt;<![CDATA[");};XmlLayout.prototype.format=function(loggingEvent){var layout=this;var i,len;function formatMessage(message){message=(typeof message==="string")?message:toStr(message);return"<log4javascript:message><![CDATA["+
layout.escapeCdata(message)+"]]></log4javascript:message>";}
var str="<log4javascript:event logger=\""+loggingEvent.logger.name+"\" timestamp=\""+this.getTimeStampValue(loggingEvent)+"\"";if(!this.isTimeStampsInMilliseconds()){str+=" milliseconds=\""+loggingEvent.milliseconds+"\"";}
str+=" level=\""+loggingEvent.level.name+"\">"+newLine;if(this.combineMessages){str+=formatMessage(loggingEvent.getCombinedMessages());}else{str+="<log4javascript:messages>"+newLine;for(i=0,len=loggingEvent.messages.length;i<len;i++){str+=formatMessage(loggingEvent.messages[i])+newLine;}
str+="</log4javascript:messages>"+newLine;}
if(this.hasCustomFields()){for(i=0,len=this.customFields.length;i<len;i++){str+="<log4javascript:customfield name=\""+
this.customFields[i].name+"\"><![CDATA["+
this.customFields[i].value.toString()+"]]></log4javascript:customfield>"+newLine;}}
if(loggingEvent.exception){str+="<log4javascript:exception><![CDATA["+
getExceptionStringRep(loggingEvent.exception)+"]]></log4javascript:exception>"+newLine;}
str+="</log4javascript:event>"+newLine+newLine;return str;};XmlLayout.prototype.ignoresThrowable=function(){return false;};XmlLayout.prototype.toString=function(){return"XmlLayout";};log4javascript.XmlLayout=XmlLayout;function escapeNewLines(str){return str.replace(/\r\n|\r|\n/g,"\\r\\n");}
function JsonLayout(readable,combineMessages){this.readable=extractBooleanFromParam(readable,false);this.combineMessages=extractBooleanFromParam(combineMessages,true);this.batchHeader=this.readable?"["+newLine:"[";this.batchFooter=this.readable?"]"+newLine:"]";this.batchSeparator=this.readable?","+newLine:",";this.setKeys();this.colon=this.readable?": ":":";this.tab=this.readable?"\t":"";this.lineBreak=this.readable?newLine:"";this.customFields=[];}
JsonLayout.prototype=new Layout();JsonLayout.prototype.isReadable=function(){return this.readable;};JsonLayout.prototype.isCombinedMessages=function(){return this.combineMessages;};JsonLayout.prototype.format=function(loggingEvent){var layout=this;var dataValues=this.getDataValues(loggingEvent,this.combineMessages);var str="{"+this.lineBreak;var i;function formatValue(val,prefix,expand){var formattedValue;var valType=typeof val;if(val instanceof Date){formattedValue=String(val.getTime());}else if(expand&&(val instanceof Array)){formattedValue="["+layout.lineBreak;for(i=0,len=val.length;i<len;i++){var childPrefix=prefix+layout.tab;formattedValue+=childPrefix+formatValue(val[i],childPrefix,false);if(i<val.length-1){formattedValue+=",";}
formattedValue+=layout.lineBreak;}
formattedValue+=prefix+"]";}else if(valType!=="number"&&valType!=="boolean"){formattedValue="\""+escapeNewLines(toStr(val).replace(/\"/g,"\\\""))+"\"";}else{formattedValue=val;}
return formattedValue;}
for(i=0,len=dataValues.length;i<len;i++){str+=this.tab+"\""+dataValues[i][0]+"\""+this.colon+formatValue(dataValues[i][1],this.tab,true);if(i<dataValues.length-1){str+=",";}
str+=this.lineBreak;}
str+="}"+this.lineBreak;return str;};JsonLayout.prototype.ignoresThrowable=function(){return false;};JsonLayout.prototype.toString=function(){return"JsonLayout";};JsonLayout.prototype.getContentType=function(){return"application/json";};log4javascript.JsonLayout=JsonLayout;function HttpPostDataLayout(){this.setKeys();this.customFields=[];this.returnsPostData=true;}
HttpPostDataLayout.prototype=new Layout();HttpPostDataLayout.prototype.allowBatching=function(){return false;};HttpPostDataLayout.prototype.format=function(loggingEvent){var dataValues=this.getDataValues(loggingEvent);var queryBits=[];for(var i=0,len=dataValues.length;i<len;i++){var val=(dataValues[i][1]instanceof Date)?String(dataValues[i][1].getTime()):dataValues[i][1];queryBits.push(urlEncode(dataValues[i][0])+"="+urlEncode(val));}
return queryBits.join("&");};HttpPostDataLayout.prototype.ignoresThrowable=function(loggingEvent){return false;};HttpPostDataLayout.prototype.toString=function(){return"HttpPostDataLayout";};log4javascript.HttpPostDataLayout=HttpPostDataLayout;function formatObjectExpansion(obj,depth,indentation){var objectsExpanded=[];function doFormat(obj,depth,indentation){var i,j,len,childDepth,childIndentation,childLines,expansion,childExpansion;if(!indentation){indentation="";}
function formatString(text){var lines=splitIntoLines(text);for(var j=1,jLen=lines.length;j<jLen;j++){lines[j]=indentation+lines[j];}
return lines.join(newLine);}
if(obj===null){return"null";}else if(typeof obj=="undefined"){return"undefined";}else if(typeof obj=="string"){return formatString(obj);}else if(typeof obj=="object"&&array_contains(objectsExpanded,obj)){try{expansion=toStr(obj);}catch(ex){expansion="Error formatting property. Details: "+getExceptionStringRep(ex);}
return expansion+" [already expanded]";}else if((obj instanceof Array)&&depth>0){objectsExpanded.push(obj);expansion="["+newLine;childDepth=depth-1;childIndentation=indentation+"  ";childLines=[];for(i=0,len=obj.length;i<len;i++){try{childExpansion=doFormat(obj[i],childDepth,childIndentation);childLines.push(childIndentation+childExpansion);}catch(ex){childLines.push(childIndentation+"Error formatting array member. Details: "+
getExceptionStringRep(ex)+"");}}
expansion+=childLines.join(","+newLine)+newLine+indentation+"]";return expansion;}else if(typeof obj=="object"&&depth>0){objectsExpanded.push(obj);expansion="{"+newLine;childDepth=depth-1;childIndentation=indentation+"  ";childLines=[];for(i in obj){try{childExpansion=doFormat(obj[i],childDepth,childIndentation);childLines.push(childIndentation+i+": "+childExpansion);}catch(ex){childLines.push(childIndentation+i+": Error formatting property. Details: "+
getExceptionStringRep(ex));}}
expansion+=childLines.join(","+newLine)+newLine+indentation+"}";return expansion;}else{return formatString(toStr(obj));}}
return doFormat(obj,depth,indentation);}
var SimpleDateFormat;(function(){var regex=/('[^']*')|(G+|y+|M+|w+|W+|D+|d+|F+|E+|a+|H+|k+|K+|h+|m+|s+|S+|Z+)|([a-zA-Z]+)|([^a-zA-Z']+)/;var monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"];var dayNames=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var TEXT2=0,TEXT3=1,NUMBER=2,YEAR=3,MONTH=4,TIMEZONE=5;var types={G:TEXT2,y:YEAR,M:MONTH,w:NUMBER,W:NUMBER,D:NUMBER,d:NUMBER,F:NUMBER,E:TEXT3,a:TEXT2,H:NUMBER,k:NUMBER,K:NUMBER,h:NUMBER,m:NUMBER,s:NUMBER,S:NUMBER,Z:TIMEZONE};var ONE_DAY=24*60*60*1000;var ONE_WEEK=7*ONE_DAY;var DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK=1;var newDateAtMidnight=function(year,month,day){var d=new Date(year,month,day,0,0,0);d.setMilliseconds(0);return d;};Date.prototype.getDifference=function(date){return this.getTime()-date.getTime();};Date.prototype.isBefore=function(d){return this.getTime()<d.getTime();};Date.prototype.getUTCTime=function(){return Date.UTC(this.getFullYear(),this.getMonth(),this.getDate(),this.getHours(),this.getMinutes(),this.getSeconds(),this.getMilliseconds());};Date.prototype.getTimeSince=function(d){return this.getUTCTime()-d.getUTCTime();};Date.prototype.getPreviousSunday=function(){var midday=new Date(this.getFullYear(),this.getMonth(),this.getDate(),12,0,0);var previousSunday=new Date(midday.getTime()-this.getDay()*ONE_DAY);return newDateAtMidnight(previousSunday.getFullYear(),previousSunday.getMonth(),previousSunday.getDate());};Date.prototype.getWeekInYear=function(minimalDaysInFirstWeek){if(isUndefined(this.minimalDaysInFirstWeek)){minimalDaysInFirstWeek=DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK;}
var previousSunday=this.getPreviousSunday();var startOfYear=newDateAtMidnight(this.getFullYear(),0,1);var numberOfSundays=previousSunday.isBefore(startOfYear)?0:1+Math.floor(previousSunday.getTimeSince(startOfYear)/ONE_WEEK);var numberOfDaysInFirstWeek=7-startOfYear.getDay();var weekInYear=numberOfSundays;if(numberOfDaysInFirstWeek<minimalDaysInFirstWeek){weekInYear--;}
return weekInYear;};Date.prototype.getWeekInMonth=function(minimalDaysInFirstWeek){if(isUndefined(this.minimalDaysInFirstWeek)){minimalDaysInFirstWeek=DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK;}
var previousSunday=this.getPreviousSunday();var startOfMonth=newDateAtMidnight(this.getFullYear(),this.getMonth(),1);var numberOfSundays=previousSunday.isBefore(startOfMonth)?0:1+Math.floor(previousSunday.getTimeSince(startOfMonth)/ONE_WEEK);var numberOfDaysInFirstWeek=7-startOfMonth.getDay();var weekInMonth=numberOfSundays;if(numberOfDaysInFirstWeek>=minimalDaysInFirstWeek){weekInMonth++;}
return weekInMonth;};Date.prototype.getDayInYear=function(){var startOfYear=newDateAtMidnight(this.getFullYear(),0,1);return 1+Math.floor(this.getTimeSince(startOfYear)/ONE_DAY);};SimpleDateFormat=function(formatString){this.formatString=formatString;};SimpleDateFormat.prototype.setMinimalDaysInFirstWeek=function(days){this.minimalDaysInFirstWeek=days;};SimpleDateFormat.prototype.getMinimalDaysInFirstWeek=function(){return isUndefined(this.minimalDaysInFirstWeek)?DEFAULT_MINIMAL_DAYS_IN_FIRST_WEEK:this.minimalDaysInFirstWeek;};var padWithZeroes=function(str,len){while(str.length<len){str="0"+str;}
return str;};var formatText=function(data,numberOfLetters,minLength){return(numberOfLetters>=4)?data:data.substr(0,Math.max(minLength,numberOfLetters));};var formatNumber=function(data,numberOfLetters){var dataString=""+data;return padWithZeroes(dataString,numberOfLetters);};SimpleDateFormat.prototype.format=function(date){var formattedString="";var result;var searchString=this.formatString;while((result=regex.exec(searchString))){var quotedString=result[1];var patternLetters=result[2];var otherLetters=result[3];var otherCharacters=result[4];if(quotedString){if(quotedString=="''"){formattedString+="'";}else{formattedString+=quotedString.substring(1,quotedString.length-1);}}else if(otherLetters){}else if(otherCharacters){formattedString+=otherCharacters;}else if(patternLetters){var patternLetter=patternLetters.charAt(0);var numberOfLetters=patternLetters.length;var rawData="";switch(patternLetter){case"G":rawData="AD";break;case"y":rawData=date.getFullYear();break;case"M":rawData=date.getMonth();break;case"w":rawData=date.getWeekInYear(this.getMinimalDaysInFirstWeek());break;case"W":rawData=date.getWeekInMonth(this.getMinimalDaysInFirstWeek());break;case"D":rawData=date.getDayInYear();break;case"d":rawData=date.getDate();break;case"F":rawData=1+Math.floor((date.getDate()-1)/7);break;case"E":rawData=dayNames[date.getDay()];break;case"a":rawData=(date.getHours()>=12)?"PM":"AM";break;case"H":rawData=date.getHours();break;case"k":rawData=date.getHours()||24;break;case"K":rawData=date.getHours()%12;break;case"h":rawData=(date.getHours()%12)||12;break;case"m":rawData=date.getMinutes();break;case"s":rawData=date.getSeconds();break;case"S":rawData=date.getMilliseconds();break;case"Z":rawData=date.getTimezoneOffset();break;}
switch(types[patternLetter]){case TEXT2:formattedString+=formatText(rawData,numberOfLetters,2);break;case TEXT3:formattedString+=formatText(rawData,numberOfLetters,3);break;case NUMBER:formattedString+=formatNumber(rawData,numberOfLetters);break;case YEAR:if(numberOfLetters<=3){var dataString=""+rawData;formattedString+=dataString.substr(2,2);}else{formattedString+=formatNumber(rawData,numberOfLetters);}
break;case MONTH:if(numberOfLetters>=3){formattedString+=formatText(monthNames[rawData],numberOfLetters,numberOfLetters);}else{formattedString+=formatNumber(rawData+1,numberOfLetters);}
break;case TIMEZONE:var isPositive=(rawData>0);var prefix=isPositive?"-":"+";var absData=Math.abs(rawData);var hours=""+Math.floor(absData/60);hours=padWithZeroes(hours,2);var minutes=""+(absData%60);minutes=padWithZeroes(minutes,2);formattedString+=prefix+hours+minutes;break;}}
searchString=searchString.substr(result.index+result[0].length);}
return formattedString;};})();log4javascript.SimpleDateFormat=SimpleDateFormat;function PatternLayout(pattern){if(pattern){this.pattern=pattern;}else{this.pattern=PatternLayout.DEFAULT_CONVERSION_PATTERN;}
this.customFields=[];}
PatternLayout.TTCC_CONVERSION_PATTERN="%r %p %c - %m%n";PatternLayout.DEFAULT_CONVERSION_PATTERN="%m%n";PatternLayout.ISO8601_DATEFORMAT="yyyy-MM-dd HH:mm:ss,SSS";PatternLayout.DATETIME_DATEFORMAT="dd MMM yyyy HH:mm:ss,SSS";PatternLayout.ABSOLUTETIME_DATEFORMAT="HH:mm:ss,SSS";PatternLayout.prototype=new Layout();PatternLayout.prototype.format=function(loggingEvent){var regex=/%(-?[0-9]+)?(\.?[0-9]+)?([acdfmMnpr%])(\{([^\}]+)\})?|([^%]+)/;var formattedString="";var result;var searchString=this.pattern;while((result=regex.exec(searchString))){var matchedString=result[0];var padding=result[1];var truncation=result[2];var conversionCharacter=result[3];var specifier=result[5];var text=result[6];if(text){formattedString+=""+text;}else{var replacement="";switch(conversionCharacter){case"a":case"m":var depth=0;if(specifier){depth=parseInt(specifier,10);if(isNaN(depth)){handleError("PatternLayout.format: invalid specifier '"+
specifier+"' for conversion character '"+conversionCharacter+"' - should be a number");depth=0;}}
var messages=(conversionCharacter==="a")?loggingEvent.messages[0]:loggingEvent.messages;for(var i=0,len=messages.length;i<len;i++){if(i>0&&(replacement.charAt(replacement.length-1)!==" ")){replacement+=" ";}
if(depth===0){replacement+=messages[i];}else{replacement+=formatObjectExpansion(messages[i],depth);}}
break;case"c":var loggerName=loggingEvent.logger.name;if(specifier){var precision=parseInt(specifier,10);var loggerNameBits=loggingEvent.logger.name.split(".");if(precision>=loggerNameBits.length){replacement=loggerName;}else{replacement=loggerNameBits.slice(loggerNameBits.length-precision).join(".");}}else{replacement=loggerName;}
break;case"d":var dateFormat=PatternLayout.ISO8601_DATEFORMAT;if(specifier){dateFormat=specifier;if(dateFormat=="ISO8601"){dateFormat=PatternLayout.ISO8601_DATEFORMAT;}else if(dateFormat=="ABSOLUTE"){dateFormat=PatternLayout.ABSOLUTETIME_DATEFORMAT;}else if(dateFormat=="DATE"){dateFormat=PatternLayout.DATETIME_DATEFORMAT;}}
replacement=(new SimpleDateFormat(dateFormat)).format(loggingEvent.timeStamp);break;case"f":if(this.hasCustomFields()){var fieldIndex=0;if(specifier){fieldIndex=parseInt(specifier,10);if(isNaN(fieldIndex)){handleError("PatternLayout.format: invalid specifier '"+
specifier+"' for conversion character 'f' - should be a number");}else if(fieldIndex===0){handleError("PatternLayout.format: invalid specifier '"+
specifier+"' for conversion character 'f' - must be greater than zero");}else if(fieldIndex>this.customFields.length){handleError("PatternLayout.format: invalid specifier '"+
specifier+"' for conversion character 'f' - there aren't that many custom fields");}else{fieldIndex=fieldIndex-1;}}
replacement=this.customFields[fieldIndex].value;}
break;case"n":replacement=newLine;break;case"p":replacement=loggingEvent.level.name;break;case"r":replacement=""+loggingEvent.timeStamp.getDifference(applicationStartDate);break;case"%":replacement="%";break;default:replacement=matchedString;break;}
var l;if(truncation){l=parseInt(truncation.substr(1),10);var strLen=replacement.length;if(l<strLen){replacement=replacement.substring(strLen-l,strLen);}}
if(padding){if(padding.charAt(0)=="-"){l=parseInt(padding.substr(1),10);while(replacement.length<l){replacement+=" ";}}else{l=parseInt(padding,10);while(replacement.length<l){replacement=" "+replacement;}}}
formattedString+=replacement;}
searchString=searchString.substr(result.index+result[0].length);}
return formattedString;};PatternLayout.prototype.ignoresThrowable=function(){return true;};PatternLayout.prototype.toString=function(){return"PatternLayout";};log4javascript.PatternLayout=PatternLayout;function AlertAppender(){}
AlertAppender.prototype=new Appender();AlertAppender.prototype.layout=new SimpleLayout();AlertAppender.prototype.append=function(loggingEvent){var formattedMessage=this.getLayout().format(loggingEvent);if(this.getLayout().ignoresThrowable()){formattedMessage+=loggingEvent.getThrowableStrRep();}
alert(formattedMessage);};AlertAppender.prototype.toString=function(){return"AlertAppender";};log4javascript.AlertAppender=AlertAppender;function BrowserConsoleAppender(){}
BrowserConsoleAppender.prototype=new log4javascript.Appender();BrowserConsoleAppender.prototype.layout=new NullLayout();BrowserConsoleAppender.prototype.threshold=Level.DEBUG;BrowserConsoleAppender.prototype.append=function(loggingEvent){var appender=this;var getFormattedMessage=function(){var layout=appender.getLayout();var formattedMessage=layout.format(loggingEvent);if(layout.ignoresThrowable()&&loggingEvent.exception){formattedMessage+=loggingEvent.getThrowableStrRep();}
return formattedMessage;};if((typeof opera!="undefined")&&opera.postError){opera.postError(getFormattedMessage());}else if(window.console&&window.console.log){var formattedMesage=getFormattedMessage();if(window.console.debug&&Level.DEBUG.isGreaterOrEqual(loggingEvent.level)){window.console.debug(formattedMesage);}else if(window.console.info&&Level.INFO.equals(loggingEvent.level)){window.console.info(formattedMesage);}else if(window.console.warn&&Level.WARN.equals(loggingEvent.level)){window.console.warn(formattedMesage);}else if(window.console.error&&loggingEvent.level.isGreaterOrEqual(Level.ERROR)){window.console.error(formattedMesage);}else{window.console.log(formattedMesage);}}};BrowserConsoleAppender.prototype.group=function(name){if(window.console&&window.console.group){window.console.group(name);}};BrowserConsoleAppender.prototype.groupEnd=function(){if(window.console&&window.console.groupEnd){window.console.groupEnd();}};BrowserConsoleAppender.prototype.toString=function(){return"BrowserConsoleAppender";};log4javascript.BrowserConsoleAppender=BrowserConsoleAppender;function getXmlHttp(errorHandler){var xmlHttp=null;if(typeof XMLHttpRequest=="object"||typeof XMLHttpRequest=="function"){xmlHttp=new XMLHttpRequest();}else{try{xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");}catch(e1){try{xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");}catch(e2){if(errorHandler){errorHandler();}else{handleError("getXmlHttp: unable to obtain XMLHttpRequest object");}}}}
return xmlHttp;}
function isHttpRequestSuccessful(xmlHttp){return(isUndefined(xmlHttp.status)||xmlHttp.status===0||(xmlHttp.status>=200&&xmlHttp.status<300));}
function AjaxAppender(url){var appender=this;var isSupported=true;if(!url){handleError("AjaxAppender: URL must be specified in constructor");isSupported=false;}
var timed=this.defaults.timed;var waitForResponse=this.defaults.waitForResponse;var batchSize=this.defaults.batchSize;var timerInterval=this.defaults.timerInterval;var requestSuccessCallback=this.defaults.requestSuccessCallback;var failCallback=this.defaults.failCallback;var postVarName=this.defaults.postVarName;var sendAllOnUnload=this.defaults.sendAllOnUnload;var sessionId=null;var queuedLoggingEvents=[];var queuedRequests=[];var sending=false;var initialized=false;function checkCanConfigure(configOptionName){if(initialized){handleError("AjaxAppender: configuration option '"+
configOptionName+"' may not be set after the appender has been initialized");return false;}
return true;}
this.getSessionId=function(){return sessionId;};this.setSessionId=function(sessionIdParam){sessionId=extractStringFromParam(sessionIdParam,null);this.layout.setCustomField("sessionid",sessionId);};this.setLayout=function(layoutParam){if(checkCanConfigure("layout")){this.layout=layoutParam;if(sessionId!==null){this.setSessionId(sessionId);}}};this.isTimed=function(){return timed;};this.setTimed=function(timedParam){if(checkCanConfigure("timed")){timed=bool(timedParam);}};this.getTimerInterval=function(){return timerInterval;};this.setTimerInterval=function(timerIntervalParam){if(checkCanConfigure("timerInterval")){timerInterval=extractIntFromParam(timerIntervalParam,timerInterval);}};this.isWaitForResponse=function(){return waitForResponse;};this.setWaitForResponse=function(waitForResponseParam){if(checkCanConfigure("waitForResponse")){waitForResponse=bool(waitForResponseParam);}};this.getBatchSize=function(){return batchSize;};this.setBatchSize=function(batchSizeParam){if(checkCanConfigure("batchSize")){batchSize=extractIntFromParam(batchSizeParam,batchSize);}};this.isSendAllOnUnload=function(){return sendAllOnUnload;};this.setSendAllOnUnload=function(sendAllOnUnloadParam){if(checkCanConfigure("sendAllOnUnload")){sendAllOnUnload=extractIntFromParam(sendAllOnUnloadParam,sendAllOnUnload);}};this.setRequestSuccessCallback=function(requestSuccessCallbackParam){requestSuccessCallback=extractFunctionFromParam(requestSuccessCallbackParam,requestSuccessCallback);};this.setFailCallback=function(failCallbackParam){failCallback=extractFunctionFromParam(failCallbackParam,failCallback);};this.getPostVarName=function(){return postVarName;};this.setPostVarName=function(postVarNameParam){if(checkCanConfigure("postVarName")){postVarName=extractStringFromParam(postVarNameParam,postVarName);}};function sendAll(){if(isSupported&&enabled){sending=true;var currentRequestBatch;if(waitForResponse){if(queuedRequests.length>0){currentRequestBatch=queuedRequests.shift();sendRequest(preparePostData(currentRequestBatch),sendAll);}else{sending=false;if(timed){scheduleSending();}}}else{while((currentRequestBatch=queuedRequests.shift())){sendRequest(preparePostData(currentRequestBatch));}
sending=false;if(timed){scheduleSending();}}}}
this.sendAll=sendAll;function sendAllRemaining(){if(isSupported&&enabled){var actualBatchSize=appender.getLayout().allowBatching()?batchSize:1;var currentLoggingEvent;var postData="";var batchedLoggingEvents=[];while((currentLoggingEvent=queuedLoggingEvents.shift())){batchedLoggingEvents.push(currentLoggingEvent);if(queuedLoggingEvents.length>=actualBatchSize){queuedRequests.push(batchedLoggingEvents);batchedLoggingEvents=[];}}
if(batchedLoggingEvents.length>0){queuedRequests.push(batchedLoggingEvents);}
waitForResponse=false;timed=false;sendAll();}}
function preparePostData(batchedLoggingEvents){var formattedMessages=[];var currentLoggingEvent;var postData="";while((currentLoggingEvent=batchedLoggingEvents.shift())){var currentFormattedMessage=appender.getLayout().format(currentLoggingEvent);if(appender.getLayout().ignoresThrowable()){currentFormattedMessage+=loggingEvent.getThrowableStrRep();}
formattedMessages.push(currentFormattedMessage);}
if(batchedLoggingEvents.length==1){postData=formattedMessages.join("");}else{postData=appender.getLayout().batchHeader+
formattedMessages.join(appender.getLayout().batchSeparator)+
appender.getLayout().batchFooter;}
postData=appender.getLayout().returnsPostData?postData:urlEncode(postVarName)+"="+urlEncode(postData);if(postData.length>0){postData+="&";}
return postData+"layout="+urlEncode(appender.getLayout().toString());}
function scheduleSending(){setTimeout(sendAll,timerInterval);}
function xmlHttpErrorHandler(){var msg="AjaxAppender: could not create XMLHttpRequest object. AjaxAppender disabled";handleError(msg);isSupported=false;if(failCallback){failCallback(msg);}}
function sendRequest(postData,successCallback){try{var xmlHttp=getXmlHttp(xmlHttpErrorHandler);if(isSupported){if(xmlHttp.overrideMimeType){xmlHttp.overrideMimeType(appender.getLayout().getContentType());}
xmlHttp.onreadystatechange=function(){if(xmlHttp.readyState==4){if(isHttpRequestSuccessful(xmlHttp)){if(requestSuccessCallback){requestSuccessCallback(xmlHttp);}
if(successCallback){successCallback(xmlHttp);}}else{var msg="AjaxAppender.append: XMLHttpRequest request to URL "+
url+" returned status code "+xmlHttp.status;handleError(msg);if(failCallback){failCallback(msg);}}
xmlHttp.onreadystatechange=emptyFunction;xmlHttp=null;}};xmlHttp.open("POST",url,true);try{xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");}catch(headerEx){var msg="AjaxAppender.append: your browser's XMLHttpRequest implementation"+" does not support setRequestHeader, therefore cannot post data. AjaxAppender disabled";handleError(msg);isSupported=false;if(failCallback){failCallback(msg);}
return;}
xmlHttp.send(postData);}}catch(ex){var errMsg="AjaxAppender.append: error sending log message to "+url;handleError(errMsg,ex);isSupported=false;if(failCallback){failCallback(errMsg+". Details: "+getExceptionStringRep(ex));}}}
this.append=function(loggingEvent){if(isSupported){if(!initialized){init();}
queuedLoggingEvents.push(loggingEvent);var actualBatchSize=this.getLayout().allowBatching()?batchSize:1;if(queuedLoggingEvents.length>=actualBatchSize){var currentLoggingEvent;var postData="";var batchedLoggingEvents=[];while((currentLoggingEvent=queuedLoggingEvents.shift())){batchedLoggingEvents.push(currentLoggingEvent);}
queuedRequests.push(batchedLoggingEvents);if(!timed){if(!waitForResponse||(waitForResponse&&!sending)){sendAll();}}}}};function init(){initialized=true;if(sendAllOnUnload){addEvent(window,"unload",sendAllRemaining);}
if(timed){scheduleSending();}}}
AjaxAppender.prototype=new Appender();AjaxAppender.prototype.defaults={waitForResponse:false,timed:false,timerInterval:1000,batchSize:1,sendAllOnUnload:true,requestSuccessCallback:null,failCallback:null,postVarName:"data"};AjaxAppender.prototype.layout=new HttpPostDataLayout();AjaxAppender.prototype.toString=function(){return"AjaxAppender";};log4javascript.AjaxAppender=AjaxAppender;function setCookie(name,value,days,path){var expires;path=path?"; path="+path:"";if(days){var date=new Date();date.setTime(date.getTime()+(days*24*60*60*1000));expires="; expires="+date.toGMTString();}else{expires="";}
document.cookie=escape(name)+"="+escape(value)+expires+path;}
function getCookie(name){var nameEquals=escape(name)+"=";var ca=document.cookie.split(";");for(var i=0,len=ca.length;i<len;i++){var c=ca[i];while(c.charAt(0)===" "){c=c.substring(1,c.length);}
if(c.indexOf(nameEquals)===0){return unescape(c.substring(nameEquals.length,c.length));}}
return null;}
function getBaseUrl(){var scripts=document.getElementsByTagName("script");for(var i=0,len=scripts.length;i<len;++i){if(scripts[i].src.indexOf("log4javascript")!=-1){var lastSlash=scripts[i].src.lastIndexOf("/");return(lastSlash==-1)?"":scripts[i].src.substr(0,lastSlash+1);}}
return null;}
function isLoaded(win){try{return bool(win.loaded);}catch(ex){return false;}}
var ConsoleAppender;(function(){var getConsoleHtmlLines=function(){return['<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">','<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">','<head>','<title>log4javascript</title>','<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />','<!-- Make IE8 behave like IE7, having gone to all the trouble of making IE work -->','<meta http-equiv="X-UA-Compatible" content="IE=7" />','<script type="text/javascript">var isIe = false, isIePre7 = false;</script>','<!--[if IE]><script type="text/javascript">isIe = true</script><![endif]-->','<!--[if lt IE 7]><script type="text/javascript">isIePre7 = true</script><![endif]-->','<script type="text/javascript">','//<![CDATA[','var loggingEnabled=true;var logQueuedEventsTimer=null;var logEntries=[];var logEntriesAndSeparators=[];var logItems=[];var renderDelay=100;var unrenderedLogItemsExist=false;var rootGroup,currentGroup=null;var loaded=false;var currentLogItem=null;var logMainContainer;function copyProperties(obj,props){for(var i in props){obj[i]=props[i];}}','function LogItem(){}','LogItem.prototype={mainContainer:null,wrappedContainer:null,unwrappedContainer:null,group:null,appendToLog:function(){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].appendToLog();}','this.group.update();},doRemove:function(doUpdate,removeFromGroup){if(this.rendered){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].remove();}','this.unwrappedElementContainer=null;this.wrappedElementContainer=null;this.mainElementContainer=null;}','if(this.group&&removeFromGroup){this.group.removeChild(this,doUpdate);}','if(this===currentLogItem){currentLogItem=null;}},remove:function(doUpdate,removeFromGroup){this.doRemove(doUpdate,removeFromGroup);},render:function(){},accept:function(visitor){visitor.visit(this);},getUnwrappedDomContainer:function(){return this.group.unwrappedElementContainer.contentDiv;},getWrappedDomContainer:function(){return this.group.wrappedElementContainer.contentDiv;},getMainDomContainer:function(){return this.group.mainElementContainer.contentDiv;}};LogItem.serializedItemKeys={LOG_ENTRY:0,GROUP_START:1,GROUP_END:2};function LogItemContainerElement(){}','LogItemContainerElement.prototype={appendToLog:function(){var insertBeforeFirst=(newestAtTop&&this.containerDomNode.hasChildNodes());if(insertBeforeFirst){this.containerDomNode.insertBefore(this.mainDiv,this.containerDomNode.firstChild);}else{this.containerDomNode.appendChild(this.mainDiv);}}};function SeparatorElementContainer(containerDomNode){this.containerDomNode=containerDomNode;this.mainDiv=document.createElement("div");this.mainDiv.className="separator";this.mainDiv.innerHTML="&nbsp;";}','SeparatorElementContainer.prototype=new LogItemContainerElement();SeparatorElementContainer.prototype.remove=function(){this.mainDiv.parentNode.removeChild(this.mainDiv);this.mainDiv=null;};function Separator(){this.rendered=false;}','Separator.prototype=new LogItem();copyProperties(Separator.prototype,{render:function(){var containerDomNode=this.group.contentDiv;if(isIe){this.unwrappedElementContainer=new SeparatorElementContainer(this.getUnwrappedDomContainer());this.wrappedElementContainer=new SeparatorElementContainer(this.getWrappedDomContainer());this.elementContainers=[this.unwrappedElementContainer,this.wrappedElementContainer];}else{this.mainElementContainer=new SeparatorElementContainer(this.getMainDomContainer());this.elementContainers=[this.mainElementContainer];}','this.content=this.formattedMessage;this.rendered=true;}});function GroupElementContainer(group,containerDomNode,isRoot,isWrapped){this.group=group;this.containerDomNode=containerDomNode;this.isRoot=isRoot;this.isWrapped=isWrapped;this.expandable=false;if(this.isRoot){if(isIe){this.contentDiv=logMainContainer.appendChild(document.createElement("div"));this.contentDiv.id=this.isWrapped?"log_wrapped":"log_unwrapped";}else{this.contentDiv=logMainContainer;}}else{var groupElementContainer=this;this.mainDiv=document.createElement("div");this.mainDiv.className="group";this.headingDiv=this.mainDiv.appendChild(document.createElement("div"));this.headingDiv.className="groupheading";this.expander=this.headingDiv.appendChild(document.createElement("span"));this.expander.className="expander unselectable greyedout";this.expander.unselectable=true;var expanderText=this.group.expanded?"-":"+";this.expanderTextNode=this.expander.appendChild(document.createTextNode(expanderText));this.headingDiv.appendChild(document.createTextNode(" "+this.group.name));this.contentDiv=this.mainDiv.appendChild(document.createElement("div"));var contentCssClass=this.group.expanded?"expanded":"collapsed";this.contentDiv.className="groupcontent "+contentCssClass;this.expander.onclick=function(){if(groupElementContainer.group.expandable){groupElementContainer.group.toggleExpanded();}};}}','GroupElementContainer.prototype=new LogItemContainerElement();copyProperties(GroupElementContainer.prototype,{toggleExpanded:function(){if(!this.isRoot){var oldCssClass,newCssClass,expanderText;if(this.group.expanded){newCssClass="expanded";oldCssClass="collapsed";expanderText="-";}else{newCssClass="collapsed";oldCssClass="expanded";expanderText="+";}','replaceClass(this.contentDiv,newCssClass,oldCssClass);this.expanderTextNode.nodeValue=expanderText;}},remove:function(){if(!this.isRoot){this.headingDiv=null;this.expander.onclick=null;this.expander=null;this.expanderTextNode=null;this.contentDiv=null;this.containerDomNode=null;this.mainDiv.parentNode.removeChild(this.mainDiv);this.mainDiv=null;}},reverseChildren:function(){var node=null;var childDomNodes=[];while((node=this.contentDiv.firstChild)){this.contentDiv.removeChild(node);childDomNodes.push(node);}','while((node=childDomNodes.pop())){this.contentDiv.appendChild(node);}},update:function(){if(!this.isRoot){if(this.group.expandable){removeClass(this.expander,"greyedout");}else{addClass(this.expander,"greyedout");}}},clear:function(){if(this.isRoot){this.contentDiv.innerHTML="";}}});function Group(name,isRoot,initiallyExpanded){this.name=name;this.group=null;this.isRoot=isRoot;this.initiallyExpanded=initiallyExpanded;this.elementContainers=[];this.children=[];this.expanded=initiallyExpanded;this.rendered=false;this.expandable=false;}','Group.prototype=new LogItem();copyProperties(Group.prototype,{addChild:function(logItem){this.children.push(logItem);logItem.group=this;},render:function(){if(isIe){var unwrappedDomContainer,wrappedDomContainer;if(this.isRoot){unwrappedDomContainer=logMainContainer;wrappedDomContainer=logMainContainer;}else{unwrappedDomContainer=this.getUnwrappedDomContainer();wrappedDomContainer=this.getWrappedDomContainer();}','this.unwrappedElementContainer=new GroupElementContainer(this,unwrappedDomContainer,this.isRoot,false);this.wrappedElementContainer=new GroupElementContainer(this,wrappedDomContainer,this.isRoot,true);this.elementContainers=[this.unwrappedElementContainer,this.wrappedElementContainer];}else{var mainDomContainer=this.isRoot?logMainContainer:this.getMainDomContainer();this.mainElementContainer=new GroupElementContainer(this,mainDomContainer,this.isRoot,false);this.elementContainers=[this.mainElementContainer];}','this.rendered=true;},toggleExpanded:function(){this.expanded=!this.expanded;for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].toggleExpanded();}},expand:function(){if(!this.expanded){this.toggleExpanded();}},accept:function(visitor){visitor.visitGroup(this);},reverseChildren:function(){if(this.rendered){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].reverseChildren();}}},update:function(){var previouslyExpandable=this.expandable;this.expandable=(this.children.length!==0);if(this.expandable!==previouslyExpandable){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].update();}}},flatten:function(){var visitor=new GroupFlattener();this.accept(visitor);return visitor.logEntriesAndSeparators;},removeChild:function(child,doUpdate){array_remove(this.children,child);child.group=null;if(doUpdate){this.update();}},remove:function(doUpdate,removeFromGroup){for(var i=0,len=this.children.length;i<len;i++){this.children[i].remove(false,false);}','this.children=[];this.update();if(this===currentGroup){currentGroup=this.group;}','this.doRemove(doUpdate,removeFromGroup);},serialize:function(items){items.push([LogItem.serializedItemKeys.GROUP_START,this.name]);for(var i=0,len=this.children.length;i<len;i++){this.children[i].serialize(items);}','if(this!==currentGroup){items.push([LogItem.serializedItemKeys.GROUP_END]);}},clear:function(){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].clear();}}});function LogEntryElementContainer(){}','LogEntryElementContainer.prototype=new LogItemContainerElement();copyProperties(LogEntryElementContainer.prototype,{remove:function(){this.doRemove();},doRemove:function(){this.mainDiv.parentNode.removeChild(this.mainDiv);this.mainDiv=null;this.contentElement=null;this.containerDomNode=null;},setContent:function(content,wrappedContent){if(content===this.formattedMessage){this.contentElement.innerHTML="";this.contentElement.appendChild(document.createTextNode(this.formattedMessage));}else{this.contentElement.innerHTML=content;}},setSearchMatch:function(isMatch){var oldCssClass=isMatch?"searchnonmatch":"searchmatch";var newCssClass=isMatch?"searchmatch":"searchnonmatch";replaceClass(this.mainDiv,newCssClass,oldCssClass);},clearSearch:function(){removeClass(this.mainDiv,"searchmatch");removeClass(this.mainDiv,"searchnonmatch");}});function LogEntryWrappedElementContainer(logEntry,containerDomNode){this.logEntry=logEntry;this.containerDomNode=containerDomNode;this.mainDiv=document.createElement("div");this.mainDiv.appendChild(document.createTextNode(this.logEntry.formattedMessage));this.mainDiv.className="logentry wrapped "+this.logEntry.level;this.contentElement=this.mainDiv;}','LogEntryWrappedElementContainer.prototype=new LogEntryElementContainer();LogEntryWrappedElementContainer.prototype.setContent=function(content,wrappedContent){if(content===this.formattedMessage){this.contentElement.innerHTML="";this.contentElement.appendChild(document.createTextNode(this.formattedMessage));}else{this.contentElement.innerHTML=wrappedContent;}};function LogEntryUnwrappedElementContainer(logEntry,containerDomNode){this.logEntry=logEntry;this.containerDomNode=containerDomNode;this.mainDiv=document.createElement("div");this.mainDiv.className="logentry unwrapped "+this.logEntry.level;this.pre=this.mainDiv.appendChild(document.createElement("pre"));this.pre.appendChild(document.createTextNode(this.logEntry.formattedMessage));this.pre.className="unwrapped";this.contentElement=this.pre;}','LogEntryUnwrappedElementContainer.prototype=new LogEntryElementContainer();LogEntryUnwrappedElementContainer.prototype.remove=function(){this.doRemove();this.pre=null;};function LogEntryMainElementContainer(logEntry,containerDomNode){this.logEntry=logEntry;this.containerDomNode=containerDomNode;this.mainDiv=document.createElement("div");this.mainDiv.className="logentry nonielogentry "+this.logEntry.level;this.contentElement=this.mainDiv.appendChild(document.createElement("span"));this.contentElement.appendChild(document.createTextNode(this.logEntry.formattedMessage));}','LogEntryMainElementContainer.prototype=new LogEntryElementContainer();function LogEntry(level,formattedMessage){this.level=level;this.formattedMessage=formattedMessage;this.rendered=false;}','LogEntry.prototype=new LogItem();copyProperties(LogEntry.prototype,{render:function(){var logEntry=this;var containerDomNode=this.group.contentDiv;if(isIe){this.formattedMessage=this.formattedMessage.replace(/\\r\\n/g,"\\r");this.unwrappedElementContainer=new LogEntryUnwrappedElementContainer(this,this.getUnwrappedDomContainer());this.wrappedElementContainer=new LogEntryWrappedElementContainer(this,this.getWrappedDomContainer());this.elementContainers=[this.unwrappedElementContainer,this.wrappedElementContainer];}else{this.mainElementContainer=new LogEntryMainElementContainer(this,this.getMainDomContainer());this.elementContainers=[this.mainElementContainer];}','this.content=this.formattedMessage;this.rendered=true;},setContent:function(content,wrappedContent){if(content!=this.content){if(isIe&&(content!==this.formattedMessage)){content=content.replace(/\\r\\n/g,"\\r");}','for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].setContent(content,wrappedContent);}','this.content=content;}},getSearchMatches:function(){var matches=[];var i,len;if(isIe){var unwrappedEls=getElementsByClass(this.unwrappedElementContainer.mainDiv,"searchterm","span");var wrappedEls=getElementsByClass(this.wrappedElementContainer.mainDiv,"searchterm","span");for(i=0,len=unwrappedEls.length;i<len;i++){matches[i]=new Match(this.level,null,unwrappedEls[i],wrappedEls[i]);}}else{var els=getElementsByClass(this.mainElementContainer.mainDiv,"searchterm","span");for(i=0,len=els.length;i<len;i++){matches[i]=new Match(this.level,els[i]);}}','return matches;},setSearchMatch:function(isMatch){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].setSearchMatch(isMatch);}},clearSearch:function(){for(var i=0,len=this.elementContainers.length;i<len;i++){this.elementContainers[i].clearSearch();}},accept:function(visitor){visitor.visitLogEntry(this);},serialize:function(items){items.push([LogItem.serializedItemKeys.LOG_ENTRY,this.level,this.formattedMessage]);}});function LogItemVisitor(){}','LogItemVisitor.prototype={visit:function(logItem){},visitParent:function(logItem){if(logItem.group){logItem.group.accept(this);}},visitChildren:function(logItem){for(var i=0,len=logItem.children.length;i<len;i++){logItem.children[i].accept(this);}},visitLogEntry:function(logEntry){this.visit(logEntry);},visitSeparator:function(separator){this.visit(separator);},visitGroup:function(group){this.visit(group);}};function GroupFlattener(){this.logEntriesAndSeparators=[];}','GroupFlattener.prototype=new LogItemVisitor();GroupFlattener.prototype.visitGroup=function(group){this.visitChildren(group);};GroupFlattener.prototype.visitLogEntry=function(logEntry){this.logEntriesAndSeparators.push(logEntry);};GroupFlattener.prototype.visitSeparator=function(separator){this.logEntriesAndSeparators.push(separator);};window.onload=function(){if(location.search){var queryBits=unescape(location.search).substr(1).split("&"),nameValueBits;for(var i=0,len=queryBits.length;i<len;i++){nameValueBits=queryBits[i].split("=");if(nameValueBits[0]=="log4javascript_domain"){document.domain=nameValueBits[1];break;}}}','logMainContainer=$("log");if(isIePre7){addClass(logMainContainer,"oldIe");}','rootGroup=new Group("root",true);rootGroup.render();currentGroup=rootGroup;setCommandInputWidth();setLogContainerHeight();toggleLoggingEnabled();toggleSearchEnabled();toggleSearchFilter();toggleSearchHighlight();applyFilters();checkAllLevels();toggleWrap();toggleNewestAtTop();toggleScrollToLatest();renderQueuedLogItems();loaded=true;$("command").value="";$("command").autocomplete="off";$("command").onkeydown=function(evt){evt=getEvent(evt);if(evt.keyCode==10||evt.keyCode==13){evalCommandLine();stopPropagation(evt);}else if(evt.keyCode==27){this.value="";this.focus();}else if(evt.keyCode==38&&commandHistory.length>0){currentCommandIndex=Math.max(0,currentCommandIndex-1);this.value=commandHistory[currentCommandIndex];moveCaretToEnd(this);}else if(evt.keyCode==40&&commandHistory.length>0){currentCommandIndex=Math.min(commandHistory.length-1,currentCommandIndex+1);this.value=commandHistory[currentCommandIndex];moveCaretToEnd(this);}};$("command").onkeypress=function(evt){evt=getEvent(evt);if(evt.keyCode==38&&commandHistory.length>0&&evt.preventDefault){evt.preventDefault();}};$("command").onkeyup=function(evt){evt=getEvent(evt);if(evt.keyCode==27&&evt.preventDefault){evt.preventDefault();this.focus();}};document.onkeydown=function keyEventHandler(evt){evt=getEvent(evt);switch(evt.keyCode){case 69:if(evt.shiftKey&&(evt.ctrlKey||evt.metaKey)){evalLastCommand();cancelKeyEvent(evt);return false;}','break;case 75:if(evt.shiftKey&&(evt.ctrlKey||evt.metaKey)){focusSearch();cancelKeyEvent(evt);return false;}','break;case 40:case 76:if(evt.shiftKey&&(evt.ctrlKey||evt.metaKey)){focusCommandLine();cancelKeyEvent(evt);return false;}','break;}};setTimeout(setLogContainerHeight,20);setShowCommandLine(showCommandLine);doSearch();};window.onunload=function(){if(mainWindowExists()){appender.unload();}','appender=null;};function toggleLoggingEnabled(){setLoggingEnabled($("enableLogging").checked);}','function setLoggingEnabled(enable){loggingEnabled=enable;}','var appender=null;function setAppender(appenderParam){appender=appenderParam;}','function setShowCloseButton(showCloseButton){$("closeButton").style.display=showCloseButton?"inline":"none";}','function setShowHideButton(showHideButton){$("hideButton").style.display=showHideButton?"inline":"none";}','var newestAtTop=false;function LogItemContentReverser(){}','LogItemContentReverser.prototype=new LogItemVisitor();LogItemContentReverser.prototype.visitGroup=function(group){group.reverseChildren();this.visitChildren(group);};function setNewestAtTop(isNewestAtTop){var oldNewestAtTop=newestAtTop;var i,iLen,j,jLen;newestAtTop=Boolean(isNewestAtTop);if(oldNewestAtTop!=newestAtTop){var visitor=new LogItemContentReverser();rootGroup.accept(visitor);if(currentSearch){var currentMatch=currentSearch.matches[currentMatchIndex];var matchIndex=0;var matches=[];var actOnLogEntry=function(logEntry){var logEntryMatches=logEntry.getSearchMatches();for(j=0,jLen=logEntryMatches.length;j<jLen;j++){matches[matchIndex]=logEntryMatches[j];if(currentMatch&&logEntryMatches[j].equals(currentMatch)){currentMatchIndex=matchIndex;}','matchIndex++;}};if(newestAtTop){for(i=logEntries.length-1;i>=0;i--){actOnLogEntry(logEntries[i]);}}else{for(i=0,iLen=logEntries.length;i<iLen;i++){actOnLogEntry(logEntries[i]);}}','currentSearch.matches=matches;if(currentMatch){currentMatch.setCurrent();}}else if(scrollToLatest){doScrollToLatest();}}','$("newestAtTop").checked=isNewestAtTop;}','function toggleNewestAtTop(){var isNewestAtTop=$("newestAtTop").checked;setNewestAtTop(isNewestAtTop);}','var scrollToLatest=true;function setScrollToLatest(isScrollToLatest){scrollToLatest=isScrollToLatest;if(scrollToLatest){doScrollToLatest();}','$("scrollToLatest").checked=isScrollToLatest;}','function toggleScrollToLatest(){var isScrollToLatest=$("scrollToLatest").checked;setScrollToLatest(isScrollToLatest);}','function doScrollToLatest(){var l=logMainContainer;if(typeof l.scrollTop!="undefined"){if(newestAtTop){l.scrollTop=0;}else{var latestLogEntry=l.lastChild;if(latestLogEntry){l.scrollTop=l.scrollHeight;}}}}','var closeIfOpenerCloses=true;function setCloseIfOpenerCloses(isCloseIfOpenerCloses){closeIfOpenerCloses=isCloseIfOpenerCloses;}','var maxMessages=null;function setMaxMessages(max){maxMessages=max;pruneLogEntries();}','var showCommandLine=false;function setShowCommandLine(isShowCommandLine){showCommandLine=isShowCommandLine;if(loaded){$("commandLine").style.display=showCommandLine?"block":"none";setCommandInputWidth();setLogContainerHeight();}}','function focusCommandLine(){if(loaded){$("command").focus();}}','function focusSearch(){if(loaded){$("searchBox").focus();}}','function getLogItems(){var items=[];for(var i=0,len=logItems.length;i<len;i++){logItems[i].serialize(items);}','return items;}','function setLogItems(items){var loggingReallyEnabled=loggingEnabled;loggingEnabled=true;for(var i=0,len=items.length;i<len;i++){switch(items[i][0]){case LogItem.serializedItemKeys.LOG_ENTRY:log(items[i][1],items[i][2]);break;case LogItem.serializedItemKeys.GROUP_START:group(items[i][1]);break;case LogItem.serializedItemKeys.GROUP_END:groupEnd();break;}}','loggingEnabled=loggingReallyEnabled;}','function log(logLevel,formattedMessage){if(loggingEnabled){var logEntry=new LogEntry(logLevel,formattedMessage);logEntries.push(logEntry);logEntriesAndSeparators.push(logEntry);logItems.push(logEntry);currentGroup.addChild(logEntry);if(loaded){if(logQueuedEventsTimer!==null){clearTimeout(logQueuedEventsTimer);}','logQueuedEventsTimer=setTimeout(renderQueuedLogItems,renderDelay);unrenderedLogItemsExist=true;}}}','function renderQueuedLogItems(){logQueuedEventsTimer=null;var pruned=pruneLogEntries();var initiallyHasMatches=currentSearch?currentSearch.hasMatches():false;for(var i=0,len=logItems.length;i<len;i++){if(!logItems[i].rendered){logItems[i].render();logItems[i].appendToLog();if(currentSearch&&(logItems[i]instanceof LogEntry)){currentSearch.applyTo(logItems[i]);}}}','if(currentSearch){if(pruned){if(currentSearch.hasVisibleMatches()){if(currentMatchIndex===null){setCurrentMatchIndex(0);}','displayMatches();}else{displayNoMatches();}}else if(!initiallyHasMatches&&currentSearch.hasVisibleMatches()){setCurrentMatchIndex(0);displayMatches();}}','if(scrollToLatest){doScrollToLatest();}','unrenderedLogItemsExist=false;}','function pruneLogEntries(){if((maxMessages!==null)&&(logEntriesAndSeparators.length>maxMessages)){var numberToDelete=logEntriesAndSeparators.length-maxMessages;var prunedLogEntries=logEntriesAndSeparators.slice(0,numberToDelete);if(currentSearch){currentSearch.removeMatches(prunedLogEntries);}','var group;for(var i=0;i<numberToDelete;i++){group=logEntriesAndSeparators[i].group;array_remove(logItems,logEntriesAndSeparators[i]);array_remove(logEntries,logEntriesAndSeparators[i]);logEntriesAndSeparators[i].remove(true,true);if(group.children.length===0&&group!==currentGroup&&group!==rootGroup){array_remove(logItems,group);group.remove(true,true);}}','logEntriesAndSeparators=array_removeFromStart(logEntriesAndSeparators,numberToDelete);return true;}','return false;}','function group(name,startExpanded){if(loggingEnabled){initiallyExpanded=(typeof startExpanded==="undefined")?true:Boolean(startExpanded);var newGroup=new Group(name,false,initiallyExpanded);currentGroup.addChild(newGroup);currentGroup=newGroup;logItems.push(newGroup);if(loaded){if(logQueuedEventsTimer!==null){clearTimeout(logQueuedEventsTimer);}','logQueuedEventsTimer=setTimeout(renderQueuedLogItems,renderDelay);unrenderedLogItemsExist=true;}}}','function groupEnd(){currentGroup=(currentGroup===rootGroup)?rootGroup:currentGroup.group;}','function mainPageReloaded(){currentGroup=rootGroup;var separator=new Separator();logEntriesAndSeparators.push(separator);logItems.push(separator);currentGroup.addChild(separator);}','function closeWindow(){if(appender&&mainWindowExists()){appender.close(true);}else{window.close();}}','function hide(){if(appender&&mainWindowExists()){appender.hide();}}','var mainWindow=window;var windowId="log4javascriptConsoleWindow_"+new Date().getTime()+"_"+(""+Math.random()).substr(2);function setMainWindow(win){mainWindow=win;mainWindow[windowId]=window;if(opener&&closeIfOpenerCloses){pollOpener();}}','function pollOpener(){if(closeIfOpenerCloses){if(mainWindowExists()){setTimeout(pollOpener,500);}else{closeWindow();}}}','function mainWindowExists(){try{return(mainWindow&&!mainWindow.closed&&mainWindow[windowId]==window);}catch(ex){}','return false;}','var logLevels=["TRACE","DEBUG","INFO","WARN","ERROR","FATAL"];function getCheckBox(logLevel){return $("switch_"+logLevel);}','function getIeWrappedLogContainer(){return $("log_wrapped");}','function getIeUnwrappedLogContainer(){return $("log_unwrapped");}','function applyFilters(){for(var i=0;i<logLevels.length;i++){if(getCheckBox(logLevels[i]).checked){addClass(logMainContainer,logLevels[i]);}else{removeClass(logMainContainer,logLevels[i]);}}','updateSearchFromFilters();}','function toggleAllLevels(){var turnOn=$("switch_ALL").checked;for(var i=0;i<logLevels.length;i++){getCheckBox(logLevels[i]).checked=turnOn;if(turnOn){addClass(logMainContainer,logLevels[i]);}else{removeClass(logMainContainer,logLevels[i]);}}}','function checkAllLevels(){for(var i=0;i<logLevels.length;i++){if(!getCheckBox(logLevels[i]).checked){getCheckBox("ALL").checked=false;return;}}','getCheckBox("ALL").checked=true;}','function clearLog(){rootGroup.clear();currentGroup=rootGroup;logEntries=[];logItems=[];logEntriesAndSeparators=[];doSearch();}','function toggleWrap(){var enable=$("wrap").checked;if(enable){addClass(logMainContainer,"wrap");}else{removeClass(logMainContainer,"wrap");}','refreshCurrentMatch();}','var searchTimer=null;function scheduleSearch(){try{clearTimeout(searchTimer);}catch(ex){}','searchTimer=setTimeout(doSearch,500);}','function Search(searchTerm,isRegex,searchRegex,isCaseSensitive){this.searchTerm=searchTerm;this.isRegex=isRegex;this.searchRegex=searchRegex;this.isCaseSensitive=isCaseSensitive;this.matches=[];}','Search.prototype={hasMatches:function(){return this.matches.length>0;},hasVisibleMatches:function(){if(this.hasMatches()){for(var i=0;i<this.matches.length;i++){if(this.matches[i].isVisible()){return true;}}}','return false;},match:function(logEntry){var entryText=String(logEntry.formattedMessage);var matchesSearch=false;if(this.isRegex){matchesSearch=this.searchRegex.test(entryText);}else if(this.isCaseSensitive){matchesSearch=(entryText.indexOf(this.searchTerm)>-1);}else{matchesSearch=(entryText.toLowerCase().indexOf(this.searchTerm.toLowerCase())>-1);}','return matchesSearch;},getNextVisibleMatchIndex:function(){for(var i=currentMatchIndex+1;i<this.matches.length;i++){if(this.matches[i].isVisible()){return i;}}','for(i=0;i<=currentMatchIndex;i++){if(this.matches[i].isVisible()){return i;}}','return-1;},getPreviousVisibleMatchIndex:function(){for(var i=currentMatchIndex-1;i>=0;i--){if(this.matches[i].isVisible()){return i;}}','for(var i=this.matches.length-1;i>=currentMatchIndex;i--){if(this.matches[i].isVisible()){return i;}}','return-1;},applyTo:function(logEntry){var doesMatch=this.match(logEntry);if(doesMatch){logEntry.group.expand();logEntry.setSearchMatch(true);var logEntryContent;var wrappedLogEntryContent;var searchTermReplacementStartTag="<span class=\\\"searchterm\\\">";var searchTermReplacementEndTag="<"+"/span>";var preTagName=isIe?"pre":"span";var preStartTag="<"+preTagName+" class=\\\"pre\\\">";var preEndTag="<"+"/"+preTagName+">";var startIndex=0;var searchIndex,matchedText,textBeforeMatch;if(this.isRegex){var flags=this.isCaseSensitive?"g":"gi";var capturingRegex=new RegExp("("+this.searchRegex.source+")",flags);var rnd=(""+Math.random()).substr(2);var startToken="%%s"+rnd+"%%";var endToken="%%e"+rnd+"%%";logEntryContent=logEntry.formattedMessage.replace(capturingRegex,startToken+"$1"+endToken);logEntryContent=escapeHtml(logEntryContent);var result;var searchString=logEntryContent;logEntryContent="";wrappedLogEntryContent="";while((searchIndex=searchString.indexOf(startToken,startIndex))>-1){var endTokenIndex=searchString.indexOf(endToken,searchIndex);matchedText=searchString.substring(searchIndex+startToken.length,endTokenIndex);textBeforeMatch=searchString.substring(startIndex,searchIndex);logEntryContent+=preStartTag+textBeforeMatch+preEndTag;logEntryContent+=searchTermReplacementStartTag+preStartTag+matchedText+','preEndTag+searchTermReplacementEndTag;if(isIe){wrappedLogEntryContent+=textBeforeMatch+searchTermReplacementStartTag+','matchedText+searchTermReplacementEndTag;}','startIndex=endTokenIndex+endToken.length;}','logEntryContent+=preStartTag+searchString.substr(startIndex)+preEndTag;if(isIe){wrappedLogEntryContent+=searchString.substr(startIndex);}}else{logEntryContent="";wrappedLogEntryContent="";var searchTermReplacementLength=searchTermReplacementStartTag.length+','this.searchTerm.length+searchTermReplacementEndTag.length;var searchTermLength=this.searchTerm.length;var searchTermLowerCase=this.searchTerm.toLowerCase();var logTextLowerCase=logEntry.formattedMessage.toLowerCase();while((searchIndex=logTextLowerCase.indexOf(searchTermLowerCase,startIndex))>-1){matchedText=escapeHtml(logEntry.formattedMessage.substr(searchIndex,this.searchTerm.length));textBeforeMatch=escapeHtml(logEntry.formattedMessage.substring(startIndex,searchIndex));var searchTermReplacement=searchTermReplacementStartTag+','preStartTag+matchedText+preEndTag+searchTermReplacementEndTag;logEntryContent+=preStartTag+textBeforeMatch+preEndTag+searchTermReplacement;if(isIe){wrappedLogEntryContent+=textBeforeMatch+searchTermReplacementStartTag+','matchedText+searchTermReplacementEndTag;}','startIndex=searchIndex+searchTermLength;}','var textAfterLastMatch=escapeHtml(logEntry.formattedMessage.substr(startIndex));logEntryContent+=preStartTag+textAfterLastMatch+preEndTag;if(isIe){wrappedLogEntryContent+=textAfterLastMatch;}}','logEntry.setContent(logEntryContent,wrappedLogEntryContent);var logEntryMatches=logEntry.getSearchMatches();this.matches=this.matches.concat(logEntryMatches);}else{logEntry.setSearchMatch(false);logEntry.setContent(logEntry.formattedMessage,logEntry.formattedMessage);}','return doesMatch;},removeMatches:function(logEntries){var matchesToRemoveCount=0;var currentMatchRemoved=false;var matchesToRemove=[];var i,iLen,j,jLen;for(i=0,iLen=this.matches.length;i<iLen;i++){for(j=0,jLen=logEntries.length;j<jLen;j++){if(this.matches[i].belongsTo(logEntries[j])){matchesToRemove.push(this.matches[i]);if(i===currentMatchIndex){currentMatchRemoved=true;}}}}','var newMatch=currentMatchRemoved?null:this.matches[currentMatchIndex];if(currentMatchRemoved){for(i=currentMatchIndex,iLen=this.matches.length;i<iLen;i++){if(this.matches[i].isVisible()&&!array_contains(matchesToRemove,this.matches[i])){newMatch=this.matches[i];break;}}}','for(i=0,iLen=matchesToRemove.length;i<iLen;i++){array_remove(this.matches,matchesToRemove[i]);matchesToRemove[i].remove();}','if(this.hasVisibleMatches()){if(newMatch===null){setCurrentMatchIndex(0);}else{var newMatchIndex=0;for(i=0,iLen=this.matches.length;i<iLen;i++){if(newMatch===this.matches[i]){newMatchIndex=i;break;}}','setCurrentMatchIndex(newMatchIndex);}}else{currentMatchIndex=null;displayNoMatches();}}};function getPageOffsetTop(el,container){var currentEl=el;var y=0;while(currentEl&&currentEl!=container){y+=currentEl.offsetTop;currentEl=currentEl.offsetParent;}','return y;}','function scrollIntoView(el){var logContainer=logMainContainer;if(!$("wrap").checked){var logContainerLeft=logContainer.scrollLeft;var logContainerRight=logContainerLeft+logContainer.offsetWidth;var elLeft=el.offsetLeft;var elRight=elLeft+el.offsetWidth;if(elLeft<logContainerLeft||elRight>logContainerRight){logContainer.scrollLeft=elLeft-(logContainer.offsetWidth-el.offsetWidth)/2;}}','var logContainerTop=logContainer.scrollTop;var logContainerBottom=logContainerTop+logContainer.offsetHeight;var elTop=getPageOffsetTop(el)-getToolBarsHeight();var elBottom=elTop+el.offsetHeight;if(elTop<logContainerTop||elBottom>logContainerBottom){logContainer.scrollTop=elTop-(logContainer.offsetHeight-el.offsetHeight)/2;}}','function Match(logEntryLevel,spanInMainDiv,spanInUnwrappedPre,spanInWrappedDiv){this.logEntryLevel=logEntryLevel;this.spanInMainDiv=spanInMainDiv;if(isIe){this.spanInUnwrappedPre=spanInUnwrappedPre;this.spanInWrappedDiv=spanInWrappedDiv;}','this.mainSpan=isIe?spanInUnwrappedPre:spanInMainDiv;}','Match.prototype={equals:function(match){return this.mainSpan===match.mainSpan;},setCurrent:function(){if(isIe){addClass(this.spanInUnwrappedPre,"currentmatch");addClass(this.spanInWrappedDiv,"currentmatch");var elementToScroll=$("wrap").checked?this.spanInWrappedDiv:this.spanInUnwrappedPre;scrollIntoView(elementToScroll);}else{addClass(this.spanInMainDiv,"currentmatch");scrollIntoView(this.spanInMainDiv);}},belongsTo:function(logEntry){if(isIe){return isDescendant(this.spanInUnwrappedPre,logEntry.unwrappedPre);}else{return isDescendant(this.spanInMainDiv,logEntry.mainDiv);}},setNotCurrent:function(){if(isIe){removeClass(this.spanInUnwrappedPre,"currentmatch");removeClass(this.spanInWrappedDiv,"currentmatch");}else{removeClass(this.spanInMainDiv,"currentmatch");}},isOrphan:function(){return isOrphan(this.mainSpan);},isVisible:function(){return getCheckBox(this.logEntryLevel).checked;},remove:function(){if(isIe){this.spanInUnwrappedPre=null;this.spanInWrappedDiv=null;}else{this.spanInMainDiv=null;}}};var currentSearch=null;var currentMatchIndex=null;function doSearch(){var searchBox=$("searchBox");var searchTerm=searchBox.value;var isRegex=$("searchRegex").checked;var isCaseSensitive=$("searchCaseSensitive").checked;var i;if(searchTerm===""){$("searchReset").disabled=true;$("searchNav").style.display="none";removeClass(document.body,"searching");removeClass(searchBox,"hasmatches");removeClass(searchBox,"nomatches");for(i=0;i<logEntries.length;i++){logEntries[i].clearSearch();logEntries[i].setContent(logEntries[i].formattedMessage,logEntries[i].formattedMessage);}','currentSearch=null;setLogContainerHeight();}else{$("searchReset").disabled=false;$("searchNav").style.display="block";var searchRegex;var regexValid;if(isRegex){try{searchRegex=isCaseSensitive?new RegExp(searchTerm,"g"):new RegExp(searchTerm,"gi");regexValid=true;replaceClass(searchBox,"validregex","invalidregex");searchBox.title="Valid regex";}catch(ex){regexValid=false;replaceClass(searchBox,"invalidregex","validregex");searchBox.title="Invalid regex: "+(ex.message?ex.message:(ex.description?ex.description:"unknown error"));return;}}else{searchBox.title="";removeClass(searchBox,"validregex");removeClass(searchBox,"invalidregex");}','addClass(document.body,"searching");currentSearch=new Search(searchTerm,isRegex,searchRegex,isCaseSensitive);for(i=0;i<logEntries.length;i++){currentSearch.applyTo(logEntries[i]);}','setLogContainerHeight();if(currentSearch.hasVisibleMatches()){setCurrentMatchIndex(0);displayMatches();}else{displayNoMatches();}}}','function updateSearchFromFilters(){if(currentSearch){if(currentSearch.hasMatches()){if(currentMatchIndex===null){currentMatchIndex=0;}','var currentMatch=currentSearch.matches[currentMatchIndex];if(currentMatch.isVisible()){displayMatches();setCurrentMatchIndex(currentMatchIndex);}else{currentMatch.setNotCurrent();var nextVisibleMatchIndex=currentSearch.getNextVisibleMatchIndex();if(nextVisibleMatchIndex>-1){setCurrentMatchIndex(nextVisibleMatchIndex);displayMatches();}else{displayNoMatches();}}}else{displayNoMatches();}}}','function refreshCurrentMatch(){if(currentSearch&&currentSearch.hasVisibleMatches()){setCurrentMatchIndex(currentMatchIndex);}}','function displayMatches(){replaceClass($("searchBox"),"hasmatches","nomatches");$("searchBox").title=""+currentSearch.matches.length+" matches found";$("searchNav").style.display="block";setLogContainerHeight();}','function displayNoMatches(){replaceClass($("searchBox"),"nomatches","hasmatches");$("searchBox").title="No matches found";$("searchNav").style.display="none";setLogContainerHeight();}','function toggleSearchEnabled(enable){enable=(typeof enable=="undefined")?!$("searchDisable").checked:enable;$("searchBox").disabled=!enable;$("searchReset").disabled=!enable;$("searchRegex").disabled=!enable;$("searchNext").disabled=!enable;$("searchPrevious").disabled=!enable;$("searchCaseSensitive").disabled=!enable;$("searchNav").style.display=(enable&&($("searchBox").value!=="")&&currentSearch&&currentSearch.hasVisibleMatches())?"block":"none";if(enable){removeClass($("search"),"greyedout");addClass(document.body,"searching");if($("searchHighlight").checked){addClass(logMainContainer,"searchhighlight");}else{removeClass(logMainContainer,"searchhighlight");}','if($("searchFilter").checked){addClass(logMainContainer,"searchfilter");}else{removeClass(logMainContainer,"searchfilter");}','$("searchDisable").checked=!enable;}else{addClass($("search"),"greyedout");removeClass(document.body,"searching");removeClass(logMainContainer,"searchhighlight");removeClass(logMainContainer,"searchfilter");}','setLogContainerHeight();}','function toggleSearchFilter(){var enable=$("searchFilter").checked;if(enable){addClass(logMainContainer,"searchfilter");}else{removeClass(logMainContainer,"searchfilter");}','refreshCurrentMatch();}','function toggleSearchHighlight(){var enable=$("searchHighlight").checked;if(enable){addClass(logMainContainer,"searchhighlight");}else{removeClass(logMainContainer,"searchhighlight");}}','function clearSearch(){$("searchBox").value="";doSearch();}','function searchNext(){if(currentSearch!==null&&currentMatchIndex!==null){currentSearch.matches[currentMatchIndex].setNotCurrent();var nextMatchIndex=currentSearch.getNextVisibleMatchIndex();if(nextMatchIndex>currentMatchIndex||confirm("Reached the end of the page. Start from the top?")){setCurrentMatchIndex(nextMatchIndex);}}}','function searchPrevious(){if(currentSearch!==null&&currentMatchIndex!==null){currentSearch.matches[currentMatchIndex].setNotCurrent();var previousMatchIndex=currentSearch.getPreviousVisibleMatchIndex();if(previousMatchIndex<currentMatchIndex||confirm("Reached the start of the page. Continue from the bottom?")){setCurrentMatchIndex(previousMatchIndex);}}}','function setCurrentMatchIndex(index){currentMatchIndex=index;currentSearch.matches[currentMatchIndex].setCurrent();}','function addClass(el,cssClass){if(!hasClass(el,cssClass)){if(el.className){el.className+=" "+cssClass;}else{el.className=cssClass;}}}','function hasClass(el,cssClass){if(el.className){var classNames=el.className.split(" ");return array_contains(classNames,cssClass);}','return false;}','function removeClass(el,cssClass){if(hasClass(el,cssClass)){var existingClasses=el.className.split(" ");var newClasses=[];for(var i=0,len=existingClasses.length;i<len;i++){if(existingClasses[i]!=cssClass){newClasses[newClasses.length]=existingClasses[i];}}','el.className=newClasses.join(" ");}}','function replaceClass(el,newCssClass,oldCssClass){removeClass(el,oldCssClass);addClass(el,newCssClass);}','function getElementsByClass(el,cssClass,tagName){var elements=el.getElementsByTagName(tagName);var matches=[];for(var i=0,len=elements.length;i<len;i++){if(hasClass(elements[i],cssClass)){matches.push(elements[i]);}}','return matches;}','function $(id){return document.getElementById(id);}','function isDescendant(node,ancestorNode){while(node!=null){if(node===ancestorNode){return true;}','node=node.parentNode;}','return false;}','function isOrphan(node){var currentNode=node;while(currentNode){if(currentNode==document.body){return false;}','currentNode=currentNode.parentNode;}','return true;}','function escapeHtml(str){return str.replace(/&/g,"&amp;").replace(/[<]/g,"&lt;").replace(/>/g,"&gt;");}','function getWindowWidth(){if(window.innerWidth){return window.innerWidth;}else if(document.documentElement&&document.documentElement.clientWidth){return document.documentElement.clientWidth;}else if(document.body){return document.body.clientWidth;}','return 0;}','function getWindowHeight(){if(window.innerHeight){return window.innerHeight;}else if(document.documentElement&&document.documentElement.clientHeight){return document.documentElement.clientHeight;}else if(document.body){return document.body.clientHeight;}','return 0;}','function getToolBarsHeight(){return $("switches").offsetHeight;}','function getChromeHeight(){var height=getToolBarsHeight();if(showCommandLine){height+=$("commandLine").offsetHeight;}','return height;}','function setLogContainerHeight(){if(logMainContainer){var windowHeight=getWindowHeight();$("body").style.height=getWindowHeight()+"px";logMainContainer.style.height=""+','Math.max(0,windowHeight-getChromeHeight())+"px";}}','function setCommandInputWidth(){if(showCommandLine){$("command").style.width=""+Math.max(0,$("commandLineContainer").offsetWidth-','($("evaluateButton").offsetWidth+13))+"px";}}','window.onresize=function(){setCommandInputWidth();setLogContainerHeight();};if(!Array.prototype.push){Array.prototype.push=function(){for(var i=0,len=arguments.length;i<len;i++){this[this.length]=arguments[i];}','return this.length;};}','if(!Array.prototype.pop){Array.prototype.pop=function(){if(this.length>0){var val=this[this.length-1];this.length=this.length-1;return val;}};}','if(!Array.prototype.shift){Array.prototype.shift=function(){if(this.length>0){var firstItem=this[0];for(var i=0,len=this.length-1;i<len;i++){this[i]=this[i+1];}','this.length=this.length-1;return firstItem;}};}','if(!Array.prototype.splice){Array.prototype.splice=function(startIndex,deleteCount){var itemsAfterDeleted=this.slice(startIndex+deleteCount);var itemsDeleted=this.slice(startIndex,startIndex+deleteCount);this.length=startIndex;var argumentsArray=[];for(var i=0,len=arguments.length;i<len;i++){argumentsArray[i]=arguments[i];}','var itemsToAppend=(argumentsArray.length>2)?itemsAfterDeleted=argumentsArray.slice(2).concat(itemsAfterDeleted):itemsAfterDeleted;for(i=0,len=itemsToAppend.length;i<len;i++){this.push(itemsToAppend[i]);}','return itemsDeleted;};}','function array_remove(arr,val){var index=-1;for(var i=0,len=arr.length;i<len;i++){if(arr[i]===val){index=i;break;}}','if(index>=0){arr.splice(index,1);return index;}else{return false;}}','function array_removeFromStart(array,numberToRemove){if(Array.prototype.splice){array.splice(0,numberToRemove);}else{for(var i=numberToRemove,len=array.length;i<len;i++){array[i-numberToRemove]=array[i];}','array.length=array.length-numberToRemove;}','return array;}','function array_contains(arr,val){for(var i=0,len=arr.length;i<len;i++){if(arr[i]==val){return true;}}','return false;}','function getErrorMessage(ex){if(ex.message){return ex.message;}else if(ex.description){return ex.description;}','return""+ex;}','function moveCaretToEnd(input){if(input.setSelectionRange){input.focus();var length=input.value.length;input.setSelectionRange(length,length);}else if(input.createTextRange){var range=input.createTextRange();range.collapse(false);range.select();}','input.focus();}','function stopPropagation(evt){if(evt.stopPropagation){evt.stopPropagation();}else if(typeof evt.cancelBubble!="undefined"){evt.cancelBubble=true;}}','function getEvent(evt){return evt?evt:event;}','function getTarget(evt){return evt.target?evt.target:evt.srcElement;}','function getRelatedTarget(evt){if(evt.relatedTarget){return evt.relatedTarget;}else if(evt.srcElement){switch(evt.type){case"mouseover":return evt.fromElement;case"mouseout":return evt.toElement;default:return evt.srcElement;}}}','function cancelKeyEvent(evt){evt.returnValue=false;stopPropagation(evt);}','function evalCommandLine(){var expr=$("command").value;evalCommand(expr);$("command").value="";}','function evalLastCommand(){if(lastCommand!=null){evalCommand(lastCommand);}}','var lastCommand=null;var commandHistory=[];var currentCommandIndex=0;function evalCommand(expr){if(appender){appender.evalCommandAndAppend(expr);}else{var prefix=">>> "+expr+"\\r\\n";try{log("INFO",prefix+eval(expr));}catch(ex){log("ERROR",prefix+"Error: "+getErrorMessage(ex));}}','if(expr!=commandHistory[commandHistory.length-1]){commandHistory.push(expr);if(appender){appender.storeCommandHistory(commandHistory);}}','currentCommandIndex=(expr==commandHistory[currentCommandIndex])?currentCommandIndex+1:commandHistory.length;lastCommand=expr;}','//]]>','</script>','<style type="text/css">','body{background-color:white;color:black;padding:0;margin:0;font-family:tahoma,verdana,arial,helvetica,sans-serif;overflow:hidden}div#switchesContainer input{margin-bottom:0}div.toolbar{border-top:solid #ffffff 1px;border-bottom:solid #aca899 1px;background-color:#f1efe7;padding:3px 5px;font-size:68.75%}div.toolbar,div#search input{font-family:tahoma,verdana,arial,helvetica,sans-serif}div.toolbar input.button{padding:0 5px;font-size:100%}div.toolbar input.hidden{display:none}div#switches input#clearButton{margin-left:20px}div#levels label{font-weight:bold}div#levels label,div#options label{margin-right:5px}div#levels label#wrapLabel{font-weight:normal}div#search label{margin-right:10px}div#search label.searchboxlabel{margin-right:0}div#search input{font-size:100%}div#search input.validregex{color:green}div#search input.invalidregex{color:red}div#search input.nomatches{color:white;background-color:#ff6666}div#search input.nomatches{color:white;background-color:#ff6666}div#searchNav{display:none}div#commandLine{display:none}div#commandLine input#command{font-size:100%;font-family:Courier New,Courier}div#commandLine input#evaluateButton{}*.greyedout{color:gray !important;border-color:gray !important}*.greyedout *.alwaysenabled{color:black}*.unselectable{-khtml-user-select:none;-moz-user-select:none;user-select:none}div#log{font-family:Courier New,Courier;font-size:75%;width:100%;overflow:auto;clear:both;position:relative}div.group{border-color:#cccccc;border-style:solid;border-width:1px 0 1px 1px;overflow:visible}div.oldIe div.group,div.oldIe div.group *,div.oldIe *.logentry{height:1%}div.group div.groupheading span.expander{border:solid black 1px;font-family:Courier New,Courier;font-size:0.833em;background-color:#eeeeee;position:relative;top:-1px;color:black;padding:0 2px;cursor:pointer;cursor:hand;height:1%}div.group div.groupcontent{margin-left:10px;padding-bottom:2px;overflow:visible}div.group div.expanded{display:block}div.group div.collapsed{display:none}*.logentry{overflow:visible;display:none;white-space:pre}span.pre{white-space:pre}pre.unwrapped{display:inline !important}pre.unwrapped pre.pre,div.wrapped pre.pre{display:inline}div.wrapped pre.pre{white-space:normal}div.wrapped{display:none}body.searching *.logentry span.currentmatch{color:white !important;background-color:green !important}body.searching div.searchhighlight *.logentry span.searchterm{color:black;background-color:yellow}div.wrap *.logentry{white-space:normal !important;border-width:0 0 1px 0;border-color:#dddddd;border-style:dotted}div.wrap #log_wrapped,#log_unwrapped{display:block}div.wrap #log_unwrapped,#log_wrapped{display:none}div.wrap *.logentry span.pre{overflow:visible;white-space:normal}div.wrap *.logentry pre.unwrapped{display:none}div.wrap *.logentry span.wrapped{display:inline}div.searchfilter *.searchnonmatch{display:none !important}div#log *.TRACE,label#label_TRACE{color:#666666}div#log *.DEBUG,label#label_DEBUG{color:green}div#log *.INFO,label#label_INFO{color:#000099}div#log *.WARN,label#label_WARN{color:#999900}div#log *.ERROR,label#label_ERROR{color:red}div#log *.FATAL,label#label_FATAL{color:#660066}div.TRACE#log *.TRACE,div.DEBUG#log *.DEBUG,div.INFO#log *.INFO,div.WARN#log *.WARN,div.ERROR#log *.ERROR,div.FATAL#log *.FATAL{display:block}div#log div.separator{background-color:#cccccc;margin:5px 0;line-height:1px}','</style>','</head>','<body id="body">','<div id="switchesContainer">','<div id="switches">','<div id="levels" class="toolbar">','Filters:','<input type="checkbox" id="switch_TRACE" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide trace messages" /><label for="switch_TRACE" id="label_TRACE">trace</label>','<input type="checkbox" id="switch_DEBUG" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide debug messages" /><label for="switch_DEBUG" id="label_DEBUG">debug</label>','<input type="checkbox" id="switch_INFO" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide info messages" /><label for="switch_INFO" id="label_INFO">info</label>','<input type="checkbox" id="switch_WARN" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide warn messages" /><label for="switch_WARN" id="label_WARN">warn</label>','<input type="checkbox" id="switch_ERROR" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide error messages" /><label for="switch_ERROR" id="label_ERROR">error</label>','<input type="checkbox" id="switch_FATAL" onclick="applyFilters(); checkAllLevels()" checked="checked" title="Show/hide fatal messages" /><label for="switch_FATAL" id="label_FATAL">fatal</label>','<input type="checkbox" id="switch_ALL" onclick="toggleAllLevels(); applyFilters()" checked="checked" title="Show/hide all messages" /><label for="switch_ALL" id="label_ALL">all</label>','</div>','<div id="search" class="toolbar">','<label for="searchBox" class="searchboxlabel">Search:</label> <input type="text" id="searchBox" onclick="toggleSearchEnabled(true)" onkeyup="scheduleSearch()" size="20" />','<input type="button" id="searchReset" disabled="disabled" value="Reset" onclick="clearSearch()" class="button" title="Reset the search" />','<input type="checkbox" id="searchRegex" onclick="doSearch()" title="If checked, search is treated as a regular expression" /><label for="searchRegex">Regex</label>','<input type="checkbox" id="searchCaseSensitive" onclick="doSearch()" title="If checked, search is case sensitive" /><label for="searchCaseSensitive">Match case</label>','<input type="checkbox" id="searchDisable" onclick="toggleSearchEnabled()" title="Enable/disable search" /><label for="searchDisable" class="alwaysenabled">Disable</label>','<div id="searchNav">','<input type="button" id="searchNext" disabled="disabled" value="Next" onclick="searchNext()" class="button" title="Go to the next matching log entry" />','<input type="button" id="searchPrevious" disabled="disabled" value="Previous" onclick="searchPrevious()" class="button" title="Go to the previous matching log entry" />','<input type="checkbox" id="searchFilter" onclick="toggleSearchFilter()" title="If checked, non-matching log entries are filtered out" /><label for="searchFilter">Filter</label>','<input type="checkbox" id="searchHighlight" onclick="toggleSearchHighlight()" title="Highlight matched search terms" /><label for="searchHighlight" class="alwaysenabled">Highlight all</label>','</div>','</div>','<div id="options" class="toolbar">','Options:','<input type="checkbox" id="enableLogging" onclick="toggleLoggingEnabled()" checked="checked" title="Enable/disable logging" /><label for="enableLogging" id="enableLoggingLabel">Log</label>','<input type="checkbox" id="wrap" onclick="toggleWrap()" title="Enable / disable word wrap" /><label for="wrap" id="wrapLabel">Wrap</label>','<input type="checkbox" id="newestAtTop" onclick="toggleNewestAtTop()" title="If checked, causes newest messages to appear at the top" /><label for="newestAtTop" id="newestAtTopLabel">Newest at the top</label>','<input type="checkbox" id="scrollToLatest" onclick="toggleScrollToLatest()" checked="checked" title="If checked, window automatically scrolls to a new message when it is added" /><label for="scrollToLatest" id="scrollToLatestLabel">Scroll to latest</label>','<input type="button" id="clearButton" value="Clear" onclick="clearLog()" class="button" title="Clear all log messages"  />','<input type="button" id="hideButton" value="Hide" onclick="hide()" class="hidden button" title="Hide the console" />','<input type="button" id="closeButton" value="Close" onclick="closeWindow()" class="hidden button" title="Close the window" />','</div>','</div>','</div>','<div id="log" class="TRACE DEBUG INFO WARN ERROR FATAL"></div>','<div id="commandLine" class="toolbar">','<div id="commandLineContainer">','<input type="text" id="command" title="Enter a JavaScript command here and hit return or press \'Evaluate\'" />','<input type="button" id="evaluateButton" value="Evaluate" class="button" title="Evaluate the command" onclick="evalCommandLine()" />','</div>','</div>','</body>','</html>',''];};var defaultCommandLineFunctions=[];ConsoleAppender=function(){};var consoleAppenderIdCounter=1;ConsoleAppender.prototype=new Appender();ConsoleAppender.prototype.create=function(inPage,container,lazyInit,initiallyMinimized,useDocumentWrite,width,height,focusConsoleWindow){var appender=this;var initialized=false;var consoleWindowCreated=false;var consoleWindowLoaded=false;var consoleClosed=false;var queuedLoggingEvents=[];var isSupported=true;var consoleAppenderId=consoleAppenderIdCounter++;initiallyMinimized=extractBooleanFromParam(initiallyMinimized,this.defaults.initiallyMinimized);lazyInit=extractBooleanFromParam(lazyInit,this.defaults.lazyInit);useDocumentWrite=extractBooleanFromParam(useDocumentWrite,this.defaults.useDocumentWrite);var newestMessageAtTop=this.defaults.newestMessageAtTop;var scrollToLatestMessage=this.defaults.scrollToLatestMessage;width=width?width:this.defaults.width;height=height?height:this.defaults.height;var maxMessages=this.defaults.maxMessages;var showCommandLine=this.defaults.showCommandLine;var commandLineObjectExpansionDepth=this.defaults.commandLineObjectExpansionDepth;var showHideButton=this.defaults.showHideButton;var showCloseButton=this.defaults.showCloseButton;var showLogEntryDeleteButtons=this.defaults.showLogEntryDeleteButtons;this.setLayout(this.defaults.layout);var init,createWindow,safeToAppend,getConsoleWindow,open;var appenderName=inPage?"InPageAppender":"PopUpAppender";var checkCanConfigure=function(configOptionName){if(consoleWindowCreated){handleError(appenderName+": configuration option '"+configOptionName+"' may not be set after the appender has been initialized");return false;}
return true;};var consoleWindowExists=function(){return(consoleWindowLoaded&&isSupported&&!consoleClosed);};this.isNewestMessageAtTop=function(){return newestMessageAtTop;};this.setNewestMessageAtTop=function(newestMessageAtTopParam){newestMessageAtTop=bool(newestMessageAtTopParam);if(consoleWindowExists()){getConsoleWindow().setNewestAtTop(newestMessageAtTop);}};this.isScrollToLatestMessage=function(){return scrollToLatestMessage;};this.setScrollToLatestMessage=function(scrollToLatestMessageParam){scrollToLatestMessage=bool(scrollToLatestMessageParam);if(consoleWindowExists()){getConsoleWindow().setScrollToLatest(scrollToLatestMessage);}};this.getWidth=function(){return width;};this.setWidth=function(widthParam){if(checkCanConfigure("width")){width=extractStringFromParam(widthParam,width);}};this.getHeight=function(){return height;};this.setHeight=function(heightParam){if(checkCanConfigure("height")){height=extractStringFromParam(heightParam,height);}};this.getMaxMessages=function(){return maxMessages;};this.setMaxMessages=function(maxMessagesParam){maxMessages=extractIntFromParam(maxMessagesParam,maxMessages);if(consoleWindowExists()){getConsoleWindow().setMaxMessages(maxMessages);}};this.isShowCommandLine=function(){return showCommandLine;};this.setShowCommandLine=function(showCommandLineParam){showCommandLine=bool(showCommandLineParam);if(consoleWindowExists()){getConsoleWindow().setShowCommandLine(showCommandLine);}};this.isShowHideButton=function(){return showHideButton;};this.setShowHideButton=function(showHideButtonParam){showHideButton=bool(showHideButtonParam);if(consoleWindowExists()){getConsoleWindow().setShowHideButton(showHideButton);}};this.isShowCloseButton=function(){return showCloseButton;};this.setShowCloseButton=function(showCloseButtonParam){showCloseButton=bool(showCloseButtonParam);if(consoleWindowExists()){getConsoleWindow().setShowCloseButton(showCloseButton);}};this.getCommandLineObjectExpansionDepth=function(){return commandLineObjectExpansionDepth;};this.setCommandLineObjectExpansionDepth=function(commandLineObjectExpansionDepthParam){commandLineObjectExpansionDepth=extractIntFromParam(commandLineObjectExpansionDepthParam,commandLineObjectExpansionDepth);};var minimized=initiallyMinimized;this.isInitiallyMinimized=function(){return initiallyMinimized;};this.setInitiallyMinimized=function(initiallyMinimizedParam){if(checkCanConfigure("initiallyMinimized")){initiallyMinimized=bool(initiallyMinimizedParam);minimized=initiallyMinimized;}};this.isUseDocumentWrite=function(){return useDocumentWrite;};this.setUseDocumentWrite=function(useDocumentWriteParam){if(checkCanConfigure("useDocumentWrite")){useDocumentWrite=bool(useDocumentWriteParam);}};function QueuedLoggingEvent(loggingEvent,formattedMessage){this.loggingEvent=loggingEvent;this.levelName=loggingEvent.level.name;this.formattedMessage=formattedMessage;}
QueuedLoggingEvent.prototype.append=function(){getConsoleWindow().log(this.levelName,this.formattedMessage);};function QueuedGroup(name,initiallyExpanded){this.name=name;this.initiallyExpanded=initiallyExpanded;}
QueuedGroup.prototype.append=function(){getConsoleWindow().group(this.name,this.initiallyExpanded);};function QueuedGroupEnd(){}
QueuedGroupEnd.prototype.append=function(){getConsoleWindow().groupEnd();};var checkAndAppend=function(){safeToAppend();if(!initialized){init();}else if(consoleClosed&&reopenWhenClosed){createWindow();}
if(safeToAppend()){appendQueuedLoggingEvents();}};this.append=function(loggingEvent){if(isSupported){var formattedMessage=appender.getLayout().format(loggingEvent);if(this.getLayout().ignoresThrowable()){formattedMessage+=loggingEvent.getThrowableStrRep();}
queuedLoggingEvents.push(new QueuedLoggingEvent(loggingEvent,formattedMessage));checkAndAppend();}};this.group=function(name,initiallyExpanded){if(isSupported){queuedLoggingEvents.push(new QueuedGroup(name,initiallyExpanded));checkAndAppend();}};this.groupEnd=function(){if(isSupported){queuedLoggingEvents.push(new QueuedGroupEnd());checkAndAppend();}};var appendQueuedLoggingEvents=function(){var currentLoggingEvent;while(queuedLoggingEvents.length>0){queuedLoggingEvents.shift().append();}
if(focusConsoleWindow){getConsoleWindow().focus();}};this.setAddedToLogger=function(logger){this.loggers.push(logger);if(enabled&&!lazyInit){init();}};this.clear=function(){if(consoleWindowExists()){getConsoleWindow().clearLog();}
queuedLoggingEvents.length=0;};this.focus=function(){if(consoleWindowExists()){getConsoleWindow().focus();}};this.focusCommandLine=function(){if(consoleWindowExists()){getConsoleWindow().focusCommandLine();}};this.focusSearch=function(){if(consoleWindowExists()){getConsoleWindow().focusSearch();}};var commandWindow=window;this.getCommandWindow=function(){return commandWindow;};this.setCommandWindow=function(commandWindowParam){commandWindow=commandWindowParam;};this.executeLastCommand=function(){if(consoleWindowExists()){getConsoleWindow().evalLastCommand();}};var commandLayout=new PatternLayout("%m");this.getCommandLayout=function(){return commandLayout;};this.setCommandLayout=function(commandLayoutParam){commandLayout=commandLayoutParam;};this.evalCommandAndAppend=function(expr){var commandReturnValue={appendResult:true,isError:false};var commandOutput="";try{var result,i;if(!commandWindow.eval&&commandWindow.execScript){commandWindow.execScript("null");}
var commandLineFunctionsHash={};for(i=0,len=commandLineFunctions.length;i<len;i++){commandLineFunctionsHash[commandLineFunctions[i][0]]=commandLineFunctions[i][1];}
var objectsToRestore=[];var addObjectToRestore=function(name){objectsToRestore.push([name,commandWindow[name]]);};addObjectToRestore("appender");commandWindow.appender=appender;addObjectToRestore("commandReturnValue");commandWindow.commandReturnValue=commandReturnValue;addObjectToRestore("commandLineFunctionsHash");commandWindow.commandLineFunctionsHash=commandLineFunctionsHash;var addFunctionToWindow=function(name){addObjectToRestore(name);commandWindow[name]=function(){return this.commandLineFunctionsHash[name](appender,arguments,commandReturnValue);};};for(i=0,len=commandLineFunctions.length;i<len;i++){addFunctionToWindow(commandLineFunctions[i][0]);}
if(commandWindow===window&&commandWindow.execScript){addObjectToRestore("evalExpr");addObjectToRestore("result");window.evalExpr=expr;commandWindow.execScript("window.result=eval(window.evalExpr);");result=window.result;}else{result=commandWindow.eval(expr);}
commandOutput=isUndefined(result)?result:formatObjectExpansion(result,commandLineObjectExpansionDepth);for(i=0,len=objectsToRestore.length;i<len;i++){commandWindow[objectsToRestore[i][0]]=objectsToRestore[i][1];}}catch(ex){commandOutput="Error evaluating command: "+getExceptionStringRep(ex);commandReturnValue.isError=true;}
if(commandReturnValue.appendResult){var message=">>> "+expr;if(!isUndefined(commandOutput)){message+=newLine+commandOutput;}
var level=commandReturnValue.isError?Level.ERROR:Level.INFO;var loggingEvent=new LoggingEvent(null,new Date(),level,[message],null);var mainLayout=this.getLayout();this.setLayout(commandLayout);this.append(loggingEvent);this.setLayout(mainLayout);}};var commandLineFunctions=defaultCommandLineFunctions.concat([]);this.addCommandLineFunction=function(functionName,commandLineFunction){commandLineFunctions.push([functionName,commandLineFunction]);};var commandHistoryCookieName="log4javascriptCommandHistory";this.storeCommandHistory=function(commandHistory){setCookie(commandHistoryCookieName,commandHistory.join(","));};var writeHtml=function(doc){var lines=getConsoleHtmlLines();doc.open();for(var i=0,len=lines.length;i<len;i++){doc.writeln(lines[i]);}
doc.close();};this.setEventTypes(["load","unload"]);var consoleWindowLoadHandler=function(){var win=getConsoleWindow();win.setAppender(appender);win.setNewestAtTop(newestMessageAtTop);win.setScrollToLatest(scrollToLatestMessage);win.setMaxMessages(maxMessages);win.setShowCommandLine(showCommandLine);win.setShowHideButton(showHideButton);win.setShowCloseButton(showCloseButton);win.setMainWindow(window);var storedValue=getCookie(commandHistoryCookieName);if(storedValue){win.commandHistory=storedValue.split(",");win.currentCommandIndex=win.commandHistory.length;}
appender.dispatchEvent("load",{"win":win});};this.unload=function(){logLog.debug("unload "+this+", caller: "+this.unload.caller);if(!consoleClosed){logLog.debug("really doing unload "+this);consoleClosed=true;consoleWindowLoaded=false;consoleWindowCreated=false;appender.dispatchEvent("unload",{});}};var pollConsoleWindow=function(windowTest,interval,successCallback,errorMessage){function doPoll(){try{if(consoleClosed){clearInterval(poll);}
if(windowTest(getConsoleWindow())){clearInterval(poll);successCallback();}}catch(ex){clearInterval(poll);isSupported=false;handleError(errorMessage,ex);}}
var poll=setInterval(doPoll,interval);};var getConsoleUrl=function(){var documentDomainSet=(document.domain!=location.hostname);return useDocumentWrite?"":getBaseUrl()+"console.html"+
(documentDomainSet?"?log4javascript_domain="+escape(document.domain):"");};if(inPage){var containerElement=null;var cssProperties=[];this.addCssProperty=function(name,value){if(checkCanConfigure("cssProperties")){cssProperties.push([name,value]);}};var windowCreationStarted=false;var iframeContainerDiv;var iframeId=uniqueId+"_InPageAppender_"+consoleAppenderId;this.hide=function(){if(initialized&&consoleWindowCreated){if(consoleWindowExists()){getConsoleWindow().$("command").blur();}
iframeContainerDiv.style.display="none";minimized=true;}};this.show=function(){if(initialized){if(consoleWindowCreated){iframeContainerDiv.style.display="block";this.setShowCommandLine(showCommandLine);minimized=false;}else if(!windowCreationStarted){createWindow(true);}}};this.isVisible=function(){return!minimized&&!consoleClosed;};this.close=function(fromButton){if(!consoleClosed&&(!fromButton||confirm("This will permanently remove the console from the page. No more messages will be logged. Do you wish to continue?"))){iframeContainerDiv.parentNode.removeChild(iframeContainerDiv);this.unload();}};open=function(){var initErrorMessage="InPageAppender.open: unable to create console iframe";function finalInit(){try{if(!initiallyMinimized){appender.show();}
consoleWindowLoadHandler();consoleWindowLoaded=true;appendQueuedLoggingEvents();}catch(ex){isSupported=false;handleError(initErrorMessage,ex);}}
function writeToDocument(){try{var windowTest=function(win){return isLoaded(win);};if(useDocumentWrite){writeHtml(getConsoleWindow().document);}
if(windowTest(getConsoleWindow())){finalInit();}else{pollConsoleWindow(windowTest,100,finalInit,initErrorMessage);}}catch(ex){isSupported=false;handleError(initErrorMessage,ex);}}
minimized=false;iframeContainerDiv=containerElement.appendChild(document.createElement("div"));iframeContainerDiv.style.width=width;iframeContainerDiv.style.height=height;iframeContainerDiv.style.border="solid gray 1px";for(var i=0,len=cssProperties.length;i<len;i++){iframeContainerDiv.style[cssProperties[i][0]]=cssProperties[i][1];}
var iframeSrc=useDocumentWrite?"":" src='"+getConsoleUrl()+"'";iframeContainerDiv.innerHTML="<iframe id='"+iframeId+"' name='"+iframeId+"' width='100%' height='100%' frameborder='0'"+iframeSrc+"scrolling='no'></iframe>";consoleClosed=false;var iframeDocumentExistsTest=function(win){try{return bool(win)&&bool(win.document);}catch(ex){return false;}};if(iframeDocumentExistsTest(getConsoleWindow())){writeToDocument();}else{pollConsoleWindow(iframeDocumentExistsTest,100,writeToDocument,initErrorMessage);}
consoleWindowCreated=true;};createWindow=function(show){if(show||!initiallyMinimized){var pageLoadHandler=function(){if(!container){containerElement=document.createElement("div");containerElement.style.position="fixed";containerElement.style.left="0";containerElement.style.right="0";containerElement.style.bottom="0";document.body.appendChild(containerElement);appender.addCssProperty("borderWidth","1px 0 0 0");appender.addCssProperty("zIndex",1000000);open();}else{try{var el=document.getElementById(container);if(el.nodeType==1){containerElement=el;}
open();}catch(ex){handleError("InPageAppender.init: invalid container element '"+container+"' supplied",ex);}}};if(pageLoaded&&container&&container.appendChild){containerElement=container;open();}else if(pageLoaded){pageLoadHandler();}else{log4javascript.addEventListener("load",pageLoadHandler);}
windowCreationStarted=true;}};init=function(){createWindow();initialized=true;};getConsoleWindow=function(){var iframe=window.frames[iframeId];if(iframe){return iframe;}};safeToAppend=function(){if(isSupported&&!consoleClosed){if(consoleWindowCreated&&!consoleWindowLoaded&&getConsoleWindow()&&isLoaded(getConsoleWindow())){consoleWindowLoaded=true;}
return consoleWindowLoaded;}
return false;};}else{var useOldPopUp=appender.defaults.useOldPopUp;var complainAboutPopUpBlocking=appender.defaults.complainAboutPopUpBlocking;var reopenWhenClosed=this.defaults.reopenWhenClosed;this.isUseOldPopUp=function(){return useOldPopUp;};this.setUseOldPopUp=function(useOldPopUpParam){if(checkCanConfigure("useOldPopUp")){useOldPopUp=bool(useOldPopUpParam);}};this.isComplainAboutPopUpBlocking=function(){return complainAboutPopUpBlocking;};this.setComplainAboutPopUpBlocking=function(complainAboutPopUpBlockingParam){if(checkCanConfigure("complainAboutPopUpBlocking")){complainAboutPopUpBlocking=bool(complainAboutPopUpBlockingParam);}};this.isFocusPopUp=function(){return focusConsoleWindow;};this.setFocusPopUp=function(focusPopUpParam){focusConsoleWindow=bool(focusPopUpParam);};this.isReopenWhenClosed=function(){return reopenWhenClosed;};this.setReopenWhenClosed=function(reopenWhenClosedParam){reopenWhenClosed=bool(reopenWhenClosedParam);};this.close=function(){logLog.debug("close "+this);try{popUp.close();this.unload();}catch(ex){}};this.hide=function(){logLog.debug("hide "+this);if(consoleWindowExists()){this.close();}};this.show=function(){logLog.debug("show "+this);if(!consoleWindowCreated){open();}};this.isVisible=function(){return safeToAppend();};var popUp;open=function(){var windowProperties="width="+width+",height="+height+",status,resizable";var windowName="PopUp_"+location.host.replace(/[^a-z0-9]/gi,"_")+"_"+consoleAppenderId;if(!useOldPopUp||!useDocumentWrite){windowName=windowName+"_"+uniqueId;}
var checkPopUpClosed=function(win){if(consoleClosed){return true;}else{try{return bool(win)&&win.closed;}catch(ex){}}
return false;};var popUpClosedCallback=function(){if(!consoleClosed){appender.unload();}};function finalInit(){getConsoleWindow().setCloseIfOpenerCloses(!useOldPopUp||!useDocumentWrite);consoleWindowLoadHandler();consoleWindowLoaded=true;appendQueuedLoggingEvents();pollConsoleWindow(checkPopUpClosed,500,popUpClosedCallback,"PopUpAppender.checkPopUpClosed: error checking pop-up window");}
try{popUp=window.open(getConsoleUrl(),windowName,windowProperties);consoleClosed=false;consoleWindowCreated=true;if(popUp){if(useDocumentWrite&&useOldPopUp&&isLoaded(popUp)){popUp.mainPageReloaded();finalInit();}else{if(useDocumentWrite){writeHtml(popUp.document);}
var popUpLoadedTest=function(win){return bool(win)&&isLoaded(win);};if(isLoaded(popUp)){finalInit();}else{pollConsoleWindow(popUpLoadedTest,100,finalInit,"PopUpAppender.init: unable to create console window");}}}else{isSupported=false;logLog.warn("PopUpAppender.init: pop-ups blocked, please unblock to use PopUpAppender");if(complainAboutPopUpBlocking){handleError("log4javascript: pop-up windows appear to be blocked. Please unblock them to use pop-up logging.");}}}catch(ex){handleError("PopUpAppender.init: error creating pop-up",ex);}};createWindow=function(){if(!initiallyMinimized){open();}};init=function(){createWindow();initialized=true;};getConsoleWindow=function(){return popUp;};safeToAppend=function(){if(isSupported&&!isUndefined(popUp)&&!consoleClosed){if(popUp.closed||(consoleWindowLoaded&&isUndefined(popUp.closed))){appender.unload();logLog.debug("PopUpAppender: pop-up closed");return false;}
if(!consoleWindowLoaded&&isLoaded(popUp)){consoleWindowLoaded=true;}}
return isSupported&&consoleWindowLoaded&&!consoleClosed;};}
this.getConsoleWindow=getConsoleWindow;};ConsoleAppender.addGlobalCommandLineFunction=function(functionName,commandLineFunction){defaultCommandLineFunctions.push([functionName,commandLineFunction]);};function PopUpAppender(lazyInit,initiallyMinimized,useDocumentWrite,width,height){this.create(false,null,lazyInit,initiallyMinimized,useDocumentWrite,width,height,this.defaults.focusPopUp);}
PopUpAppender.prototype=new ConsoleAppender();PopUpAppender.prototype.defaults={layout:new PatternLayout("%d{HH:mm:ss} %-5p - %m{1}%n"),initiallyMinimized:false,focusPopUp:false,lazyInit:true,useOldPopUp:true,complainAboutPopUpBlocking:true,newestMessageAtTop:false,scrollToLatestMessage:true,width:"600",height:"400",reopenWhenClosed:false,maxMessages:null,showCommandLine:true,commandLineObjectExpansionDepth:1,showHideButton:false,showCloseButton:true,showLogEntryDeleteButtons:true,useDocumentWrite:true};PopUpAppender.prototype.toString=function(){return"PopUpAppender";};log4javascript.PopUpAppender=PopUpAppender;function InPageAppender(container,lazyInit,initiallyMinimized,useDocumentWrite,width,height){this.create(true,container,lazyInit,initiallyMinimized,useDocumentWrite,width,height,false);}
InPageAppender.prototype=new ConsoleAppender();InPageAppender.prototype.defaults={layout:new PatternLayout("%d{HH:mm:ss} %-5p - %m{1}%n"),initiallyMinimized:false,lazyInit:true,newestMessageAtTop:false,scrollToLatestMessage:true,width:"100%",height:"220px",maxMessages:null,showCommandLine:true,commandLineObjectExpansionDepth:1,showHideButton:false,showCloseButton:false,showLogEntryDeleteButtons:true,useDocumentWrite:true};InPageAppender.prototype.toString=function(){return"InPageAppender";};log4javascript.InPageAppender=InPageAppender;log4javascript.InlineAppender=InPageAppender;})();function padWithSpaces(str,len){if(str.length<len){var spaces=[];var numberOfSpaces=Math.max(0,len-str.length);for(var i=0;i<numberOfSpaces;i++){spaces[i]=" ";}
str+=spaces.join("");}
return str;}
(function(){function dir(obj){var maxLen=0;for(var p in obj){maxLen=Math.max(toStr(p).length,maxLen);}
var propList=[];for(p in obj){var propNameStr="  "+padWithSpaces(toStr(p),maxLen+2);var propVal;try{propVal=splitIntoLines(toStr(obj[p])).join(padWithSpaces(newLine,maxLen+6));}catch(ex){propVal="[Error obtaining property. Details: "+getExceptionMessage(ex)+"]";}
propList.push(propNameStr+propVal);}
return propList.join(newLine);}
var nodeTypes={ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12};var preFormattedElements=["script","pre"];var emptyElements=["br","img","hr","param","link","area","input","col","base","meta"];var indentationUnit="  ";function getXhtml(rootNode,includeRootNode,indentation,startNewLine,preformatted){includeRootNode=(typeof includeRootNode=="undefined")?true:(includeRootNode?true:false);if(typeof indentation!="string"){indentation="";}
startNewLine=startNewLine?true:false;preformatted=preformatted?true:false;var xhtml;function isWhitespace(node){return((node.nodeType==nodeTypes.TEXT_NODE)&&/^[ \t\r\n]*$/.test(node.nodeValue));}
function fixAttributeValue(attrValue){return attrValue.toString().replace(/\&/g,"&amp;").replace(/</g,"&lt;").replace(/\"/g,"&quot;");}
function getStyleAttributeValue(el){var stylePairs=el.style.cssText.split(";");var styleValue="";var isFirst=true;for(var j=0,len=stylePairs.length;j<len;j++){var nameValueBits=stylePairs[j].split(":");var props=[];if(!/^\s*$/.test(nameValueBits[0])){props.push(trim(nameValueBits[0]).toLowerCase()+":"+trim(nameValueBits[1]));}
styleValue=props.join(";");}
return styleValue;}
function getNamespace(el){if(el.prefix){return el.prefix;}else if(el.outerHTML){var regex=new RegExp("<([^:]+):"+el.tagName+"[^>]*>","i");if(regex.test(el.outerHTML)){return RegExp.$1.toLowerCase();}}
return"";}
var lt="<";var gt=">";if(includeRootNode&&rootNode.nodeType!=nodeTypes.DOCUMENT_FRAGMENT_NODE){switch(rootNode.nodeType){case nodeTypes.ELEMENT_NODE:var tagName=rootNode.tagName.toLowerCase();xhtml=startNewLine?newLine+indentation:"";xhtml+=lt;var prefix=getNamespace(rootNode);var hasPrefix=prefix?true:false;if(hasPrefix){xhtml+=prefix+":";}
xhtml+=tagName;for(i=0,len=rootNode.attributes.length;i<len;i++){var currentAttr=rootNode.attributes[i];if(!currentAttr.specified||currentAttr.nodeValue===null||currentAttr.nodeName.toLowerCase()==="style"||typeof currentAttr.nodeValue!=="string"||currentAttr.nodeName.indexOf("_moz")===0){continue;}
xhtml+=" "+currentAttr.nodeName.toLowerCase()+"=\"";xhtml+=fixAttributeValue(currentAttr.nodeValue);xhtml+="\"";}
if(rootNode.style.cssText){var styleValue=getStyleAttributeValue(rootNode);if(styleValue!==""){xhtml+=" style=\""+getStyleAttributeValue(rootNode)+"\"";}}
if(array_contains(emptyElements,tagName)||(hasPrefix&&!rootNode.hasChildNodes())){xhtml+="/"+gt;}else{xhtml+=gt;var childStartNewLine=!(rootNode.childNodes.length===1&&rootNode.childNodes[0].nodeType===nodeTypes.TEXT_NODE);var childPreformatted=array_contains(preFormattedElements,tagName);for(var i=0,len=rootNode.childNodes.length;i<len;i++){xhtml+=getXhtml(rootNode.childNodes[i],true,indentation+indentationUnit,childStartNewLine,childPreformatted);}
var endTag=lt+"/"+tagName+gt;xhtml+=childStartNewLine?newLine+indentation+endTag:endTag;}
return xhtml;case nodeTypes.TEXT_NODE:if(isWhitespace(rootNode)){xhtml="";}else{if(preformatted){xhtml=rootNode.nodeValue;}else{var lines=splitIntoLines(trim(rootNode.nodeValue));var trimmedLines=[];for(var i=0,len=lines.length;i<len;i++){trimmedLines[i]=trim(lines[i]);}
xhtml=trimmedLines.join(newLine+indentation);}
if(startNewLine){xhtml=newLine+indentation+xhtml;}}
return xhtml;case nodeTypes.CDATA_SECTION_NODE:return"<![CDA"+"TA["+rootNode.nodeValue+"]"+"]>"+newLine;case nodeTypes.DOCUMENT_NODE:xhtml="";for(var i=0,len=rootNode.childNodes.length;i<len;i++){xhtml+=getXhtml(rootNode.childNodes[i],true,indentation);}
return xhtml;default:return"";}}else{xhtml="";for(var i=0,len=rootNode.childNodes.length;i<len;i++){xhtml+=getXhtml(rootNode.childNodes[i],true,indentation+indentationUnit);}
return xhtml;}}
var layouts={};function createCommandLineFunctions(appender){ConsoleAppender.addGlobalCommandLineFunction("$",function(appender,args,returnValue){return document.getElementById(args[0]);});ConsoleAppender.addGlobalCommandLineFunction("dir",function(appender,args,returnValue){var lines=[];for(var i=0,len=args.length;i<len;i++){lines[i]=dir(args[i]);}
return lines.join(newLine+newLine);});ConsoleAppender.addGlobalCommandLineFunction("dirxml",function(appender,args,returnValue){var lines=[];for(var i=0,len=args.length;i<len;i++){var win=appender.getCommandWindow();lines[i]=getXhtml(args[i]);}
return lines.join(newLine+newLine);});ConsoleAppender.addGlobalCommandLineFunction("cd",function(appender,args,returnValue){var win,message;if(args.length===0||args[0]===""){win=window;message="Command line set to run in main window";}else{if(args[0].window==args[0]){win=args[0];message="Command line set to run in frame '"+args[0].name+"'";}else{win=window.frames[args[0]];if(win){message="Command line set to run in frame '"+args[0]+"'";}else{returnValue.isError=true;message="Frame '"+args[0]+"' does not exist";win=appender.getCommandWindow();}}}
appender.setCommandWindow(win);return message;});ConsoleAppender.addGlobalCommandLineFunction("clear",function(appender,args,returnValue){returnValue.appendResult=false;appender.clear();});ConsoleAppender.addGlobalCommandLineFunction("keys",function(appender,args,returnValue){var keys=[];for(var k in args[0]){keys.push(k);}
return keys;});ConsoleAppender.addGlobalCommandLineFunction("values",function(appender,args,returnValue){var values=[];for(var k in args[0]){try{values.push(args[0][k]);}catch(ex){logLog.warn("values(): Unable to obtain value for key "+k+". Details: "+getExceptionMessage(ex));}}
return values;});ConsoleAppender.addGlobalCommandLineFunction("expansionDepth",function(appender,args,returnValue){var expansionDepth=parseInt(args[0],10);if(isNaN(expansionDepth)||expansionDepth<0){returnValue.isError=true;return""+args[0]+" is not a valid expansion depth";}else{appender.setCommandLineObjectExpansionDepth(expansionDepth);return"Object expansion depth set to "+expansionDepth;}});}
function init(){createCommandLineFunctions();initialized=true;}
init();})();function addWindowLoadListener(listener){var oldOnload=window.onload;if(typeof window.onload!="function"){window.onload=listener;}else{window.onload=function(evt){if(oldOnload){oldOnload(evt);}
listener(evt);};}}
addWindowLoadListener(function(){pageLoaded=true;log4javascript.dispatchEvent("load",{});});window.log4javascript=log4javascript;})();
var Ozone = Ozone || {};

/**
 * @class
 * @description Provides functions to log messages and objects
 * @Ozone.log
 * 
 */
/*
 * The only function that can be called from gadgets is Ozone.log.gadgetLog
 */
Ozone.log = {
	
};

Ozone.log.logEnabled = false; 

Ozone.log.defaultLogger = null; 
Ozone.log.defaultAppender = null; 

Ozone.log.version = Ozone.version.owfversion + Ozone.version.logging;

/**
 * @Ozone.log.getLogger
 * @description Get a logger by name, if the logger has not already been created it will be created
 * @param {String} loggerName
 */
Ozone.log.getLogger = function(loggerName) { 
    return log4javascript.getLogger(loggerName);
};

/**
 * @Ozone.log.setEnabled
 * @description Enable/Disable logging for the OWF application
 * @param {Boolean} enabled true will enable logging false will disable
 */
Ozone.log.setEnabled = function(enabled){
	log4javascript.setEnabled(enabled);
};

/**
 * @Ozone.log.getDefaultLogger
 * @description Get OWF's default logger
 */
//The default logger cannot be used from gadgets
Ozone.log.getDefaultLogger = function() {
	if (!Ozone.log.defaultLogger) {
		
	
		var defaultLoggerName = "[ozonedefault]"; 
		
		Ozone.log.defaultLogger =  Ozone.log.getLogger(defaultLoggerName);
		Ozone.log.defaultAppender = new log4javascript.PopUpAppender();
		Ozone.log.defaultAppender.setUseOldPopUp(true);
		Ozone.log.defaultAppender.setComplainAboutPopUpBlocking(false);
		// change the logging level here, for example:
		// Ozone.log.defaultAppender.setThreshold(log4javascript.Level.ERROR);
        Ozone.log.defaultAppender.setThreshold(log4javascript.Level.OFF);
		log4javascript.getRootLogger().addAppender(Ozone.log.defaultAppender);
		//Ozone.log.defaultAppender.setInitiallyMinimized(true);
		
		return Ozone.log.defaultLogger;
	} 
	
	return Ozone.log.defaultLogger;
};

/**
 * @description Launch the log window pop-up, this will re-launch the window in the event 
 * it has been closed
 */
Ozone.log.launchPopupAppender = function() {
	
	Ozone.log.defaultAppender.show();
	
	Ozone.log.getDefaultLogger().debug("Logger Window Lauched");
};


/*
 * Log messages from widgets
 * @param {Object} message
 */
Ozone.log.widgetLog = function() { 
    gadgets.rpc.call('..', 'Ozone.log',null, arguments);
};


if (typeof(Ext) != "undefined") {
	Ext.onReady(function(){
		gadgets.rpc.register('Ozone.log', function(args){
			var logger = Ozone.log.getDefaultLogger(); 
			logger.debug.apply(logger, args);
		});
	});
}

/**
 * @fileoverview The preference server script controls all the preference server communication.
 */



/**
 * @ignore
 */
var Ozone = Ozone || {};

/**
 * @ignore
 */
Ozone.pref = Ozone.pref || {};

(function(window, document, undefined) {
  /**
   * @constructor  None, this is a Singleton
   * @description This object is used to create, retrieve, update and delete user preferences. A user preference is simply a string
   * stored in OWF that is uniquely mapped to a user, namespace, and name combination.
   * <br><br>
   * All public methods of this class accept an onSuccess function. This function is executed upon successful completion of the requested operation and is passed a copy of the preference object.
   * @example
   * The following is an example of a preference object passed to the onSuccess
   * function:
   *
   * {
   *     "value":"true",
   *     "path":"militaryTime",
   *     "user":
   *     {
   *         "userId":"testAdmin1"
   *     },
   *     "namespace":"com.mycompany.AnnouncingClock"
   * }
   *
   * Where:
   *
   * value: The preference value that is stored in the database. This can be any string
   *        including JSON.
   * path: The name of the user preference.
   * user: The user object. The only user information returned at this time is the user
   *       ID.
   * namespace: The namespace of the requested user preference.
   *
   * @requires Ozone.util.Transport
   */
  Ozone.pref.PrefServer = function(_url) {
      if ( _url === undefined || _url === "null" ||  _url.indexOf('$') !== -1 || _url.length === 0 ) {
          // default incase no prefLocation is given
          // ugly alert message, but let's fail fast
           // alert("prefsLocation is null or incorrect.  Perhaps in the OwfConfig.xml file?");
      } else {
          //Strip off a trailing slash.
          if (_url.lastIndexOf("/") === (_url.length -1)) {
              _url = _url.substring(0,_url.length-1);
          }
      }

      /** @private
       * @description Look up a value for the given url. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @return JSON object representing the requested preference
       * @param cfg config object see below for properties
       * @param cfg.url url to be used in the call
       * @param cfg.onSuccess callback function to capture the success result
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided)
       * @param cfg.ignoredErrorCodes allows the caller to ignore certain http error codes.  If they occur onsuccess will be called with a null payload
       *
       * @example var prefs = new Ozone.pref.Prefs();
       *
       * var mysuccess = function(result){
       *         this.value = result;
       *         alert(result);
       *         alert(result.value);
       *
       * getValue({url:_url + "/" + namespace + "/" + path, onSuccess:onSuccessCallback, onFailure:onFailCallback});
       *
       */
      var get = function (cfg) {
          cfg.method = "GET";
          cfg.async = true;
          Ozone.util.Transport.send(cfg);
      };

      /** @private
       * @description Delete instance of the given url. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @param cfg config object see below for properties
       * @param cfg.url url to be used in the call
       * @param cfg.onSuccess callback function to capture the success result
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided)
       *
       * @example
       * var onSuccess = function(result){
       *         this.value = result;
       *         alert(result);
       * }
       *
       * var onFailure = function(err) {
       *   alert("There was an error: " + err);
       * }
       *
       * deleteBase({url:_url + "/" + namespace + "/" + path, onSuccess:onSuccessCallback, onFailure:onFailCallback});
       */
      var deleteBase = function (cfg) {
          cfg.method = 'DELETE';
          setValue(cfg);
      };

      /** @private
       * @description Get an array of object for the requested namespace
       * @param cfg config object see below for properties
       * @param cfg.url        - string
       * @param cfg.onSuccess        - callback function to capture the success result
       * @param cfg.onFailure        - callback to execute if there is an error (optional, a default alert provided)
       * @example
       * var onSuccess = function(result){
       * 		this.value = result;
       * 		alert(result);
       * }
       *
       * var onFailure = function(err) {
       *   alert("There was an error: " + err);
       * }
       *
       * list({namespace:"namespace1", onSuccess:onSuccess, onFailure:onFailure});
       */
      var list = function (cfg) {
          cfg.url = _url + "/" + cfg.url;
          get(cfg);
      };

      /**
       * @private
       * @description Set a value for the given url. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @param cfg.url url to be used in the call
       * @param cfg.content The content of the send. Either map or JSON with the _method property already defined.
       * @param cfg.onSuccess callback function to capture the success result (optional)
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided if an onSuccess callback is passed in)
       * @example
       * var onSuccess = function(result){
       *         this.value = result;
       *         alert(result);  //TODO: the preference server currently doesn't return anything
       * }
       *
       * var onFailure = function(err) {
       *   alert("There was an error: " + err);
       * }
       *
       * setValueBase(_url + "/" + namespace + "/" + path, content, onSuccessCallback, onFailCallback);
       */
      var setValueBase = function(cfg)
      {
           cfg.method = cfg.content["_method"];
           if (cfg.onSuccess) {
              if (!cfg.onFailure) {  //must ensure there is an onfailure method, as we using content
                  cfg.onFailure = function(err) {
                      alert(Ozone.util.ErrorMessageString.saveUserPreferences + " : " + err);
                  };
              }
              Ozone.util.Transport.send(cfg);
          } else {
              Ozone.util.Transport.sendAndForget(cfg);
          }

      };

      /**
       * @private
       * @description Set a value for the given url. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @param cfg config object see below for properties
       * @param cfg.url url to be used in the call
       * @param cfg.json The value to store.
       * @param cfg.method The method for the call. ('DELETE', 'PUT')
       * @param cfg.onSuccess callback function to capture the success result (optional)
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided if an onSuccess callback is passed in)
       * @example
       * var onSuccess = function(result){
       *         this.value = result;
       *         alert(result);  //TODO: the preference server currently doesn't return anything
       * }
       *
       * var onFailure = function(err) {
       *   alert("There was an error: " + err);
       * }
       *
       * setValue({url:_url + "/" + namespace + "/" + path, json:value, method:method, onSuccess:onSuccessCallback, onFailure:onFailCallback});
       */
      var setValue = function (cfg) {
          if (cfg.method == null) {
              cfg.method = 'PUT';
          }

          var content = {
              '_method': cfg.method
          };

          if (cfg.json) {
              content = {
                  '_method': cfg.method,
                  'name': cfg.json.name,
                  'layout': cfg.json.layout,
                  'description': cfg.json.description,
                  'columnCount': cfg.json.columnCount,
                  'guid': cfg.json.guid,
                  'isdefault': cfg.json.isdefault,
                  'locked': cfg.json.locked,
                  'state': cfg.json.state,
                  'defaultSettings': cfg.json.defaultSettings,
                'showLaunchMenu': cfg.json.showLaunchMenu,
                'layoutConfig': cfg.json.layoutConfig,
                'intentConfig': cfg.json.intentConfig
              };
              if (cfg.json.cloned === true) content.cloned = true;
              if (cfg.json.bypassLayoutRearrange === true) content.bypassLayoutRearrange = true;
          }
          cfg.content = content;
          setValueBase(cfg);
      };

      /**
       * @private
       * @description Set a value for the given url by using a JSON object, allowing multiple parameters for PUT/POST. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @param cfg config object see below for properties
       * @param cfg.url url to be used in the call
       * @param cfg.jsonObject The parameters to pass in. Note that the value parameter is required, and this is what will be stored in the "value" column of the appropriate table.
       * @param cfg.method The method for the call. ('DELETE', 'PUT')
       * @param cfg.onSuccess callback function to capture the success result (optional)
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided if an onSuccess callback is passed in)
       * @example
       *
       * ...code setting up a desktop dashboard
       *
       * var postParams =
       *   {
       *     'value': this.config.value,
       *      'path': this.config.value.guid,
       *      'type': 'desktop',
       *      'isdefault': saveAsDefault
       *   };
       *
       *	setValuesViaJSONObject(_url + "/" + namespace + "/" + path, jsonObject, saveMethod, onSuccess, onFailure);
       */
      var setValuesViaJSONObject = function(cfg) {
          if (cfg.jsonObject._method === undefined)
          {
              if (cfg.method == null) {
                  cfg.method = 'PUT';
              }
              cfg.jsonObject._method = cfg.method;
          }
          cfg.json = cfg.jsonObject;
          setValue(cfg);

      };

     /**
       * @private
       * @description Create JSON object with params. This should generally not be called from user code.
       * @param cfg config object see below for properties
       * @param cfg.dashboardId
       * @param cfg.value
       * @param cfg.type
       * @param cfg.isDefault
       * @return the JSON object
       */
      var generateDashboardPostParamsJSON = function (json) {
          var postParams = {
            'name': json.name,
            'layout': json.layout,
            'description': json.description,
            'columnCount': json.columnCount,
            'guid': json.guid,
            'isdefault': json.isdefault,
            'locked': json.locked,
            'state': json.state,
            'defaultSettings': json.defaultSettings,
            'showLaunchMenu': json.showLaunchMenu,
            'layoutConfig': typeof json.layoutConfig === 'string' ? json.layoutConfig : Ozone.util.toString(json.layoutConfig),
            'intentConfig': typeof json.intentConfig === 'string' ? json.intentConfig : Ozone.util.toString(json.intentConfig)
          };
          return postParams;
      };

      return /** @lends Ozone.pref.PrefServer.prototype */{

          dashTypeDesktop: 'desktop',

          dashTypeAccordion: 'accordion',

          dashTypeTabbed: 'tabbed',

          dashTypePortal: 'portal',

          version: Ozone.version.owfversion + Ozone.version.preference,

          /**
           * @description Get the url for the Preference Server
           * @returns {String} url
           */
          getUrl : function() {
              return _url;
          },

          /**
           * @description Sets the url for the Preference Server
           * @param {String} url
           * @returns void
           */
          setUrl : function(url) {
              _url = url;
          },

          /**
           * @description Gets the dashboard with the specified id
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.dashboardId Unigue dashbard identifier
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {String} layout: layout of dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Number} columnCount: number of columns if dashboard is a portal type<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {List} EDashboardLayoutList: list of dashboard types<br>
           *     {String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     {Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
       *     alert(dashboard.name);
       * };
       *
       * var onFailure = function(error) {
           *     alert(error);
       * };
       *
           * Ozone.pref.PrefServer.getDashboard({
           *     dashboardId:'917b4cd0-ecbd-410b-afd9-42d150c26426',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getDashboard : function (cfg){
              cfg.url = _url + "/" + 'dashboard' + "/" + cfg.dashboardId;
              get(cfg);
          },

          /**
           * @description Gets the user's default dashboard
           * @param {Object} cfg config object see below for properties
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {String} layout: layout of dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Number} columnCount: number of columns if dashboard is a portal type<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {List} EDashboardLayoutList: list of dashboard types<br>
           *     {String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     {Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
       *     alert(dashboard.name);
       * };
       *
       * var onFailure = function(error) {
           *     alert(error);
       * };
       *
           * Ozone.pref.PrefServer.getDefaultDashboard({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getDefaultDashboard : function (cfg){
              cfg.url = _url +"/dashboard?isdefault=true";
              cfg.method = "POST";
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @description Sets the user's default dashboard
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.dashboardId Unigue dashbard identifier
           * @param {Boolean} cfg.isDefault true to set as default dashboard
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {String} layout: layout of dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Number} columnCount: number of columns if dashboard is a portal type<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {List} EDashboardLayoutList: list of dashboard types<br>
           *     {String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     {Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
           *     alert(dashboard.name);
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.setDefaultDashboard({
           *     dashboardId:'917b4cd0-ecbd-410b-afd9-42d150c26426',
           *     isDefault:true,
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          setDefaultDashboard : function (cfg){
              cfg.url = _url + "/dashboard/" + cfg.dashboardId + "?isdefault=" + cfg.isDefault;
              cfg.method = 'PUT';
              setValue(cfg);
          },

          /**
           * @description Saves changes to a new or existing dashboard
           * @param {Object} cfg config object see below for properties
           * @param {Object} cfg.json The encoded JSON object representing the dashboard.
           * The dashboard object has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {String} layout: layout of dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Number} columnCount: number of columns if dashboard is a portal type<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {List} EDashboardLayoutList: list of dashboard types<br>
           *     {String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     {Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           * <br>
           * @param {Boolean} cfg.saveAsNew A Boolean indicating whether the entity being saved is new.
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {String} layout: layout of dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Number} columnCount: number of columns if dashboard is a portal type<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {List} EDashboardLayoutList: list of dashboard types<br>
           *     {String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     {Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @param {Boolean} [cfg.async] Async true or false defaults to true
           * @example
           *
           * var onSuccess = function(dashboard) {
           *   alert(dashboard.name);
           * };
           *
           * var onFailure = function(error) {
           *   alert(error);
           * };
           *
           * var dashboard = {
           *   alteredByAdmin: 'false',
           *   createdDate: '04/18/2012 11:29 AM EDT',
           *   isGroupDashboard: false,
           *   layout: 'desktop',
           *   isdefault: false,
           *   name: 'My Dashboard',
           *   columnCount: 0,
           *   user: {
           *     userId: 'testAdmin1',
           *   },
           *   EDashboardLayoutList: ['accordion', 'desktop', 'portal', 'tabbed'],
           *   defaultSettings: {},
           *   createdBy: {
           *     userId: 'testAdmin1',
           *     userRealName: 'Test Admin 1'
           *   },
           *   editedDate: '04/18/2012 11:29 AM EDT',
           *   groups: [],
           *   description: 'This is my dashboard',
           *   guid: guid.util.guid(),
           *   state: [],
           *   showLaunchMenu: false
           * };
           *
           * Ozone.pref.PrefServer.createOrUpdateDashboard({
           *   json: dashboard,
           *   saveAsNew: true,
           *   onSuccess: onSuccess,
           *   onFailure: onFailure,
           *   async: true
           * });
           */
          createOrUpdateDashboard : function (cfg){
              cfg.url = _url + "/" + 'dashboard' + "/" + cfg.json.guid;
              var postParams = generateDashboardPostParamsJSON(cfg.json);
              postParams.bypassLayoutRearrange = true;
              cfg.method = cfg.saveAsNew ? 'POST' : 'PUT';
              cfg.jsonObject = postParams;
              setValuesViaJSONObject(cfg);
          },

          /**
           * @description Copies an existing dashboard and saves it as new
           * @param {Object} cfg config object see below for properties
           * @param {Object} cfg.json The encoded JSON object representing the dashboard.
           * The dashboard object has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {String} layout: layout of dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Number} columnCount: number of columns if dashboard is a portal type<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {List} EDashboardLayoutList: list of dashboard types<br>
           *     {String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     {Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           * <br>
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {String} layout: layout of dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Number} columnCount: number of columns if dashboard is a portal type<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {List} EDashboardLayoutList: list of dashboard types<br>
           *     {String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     {Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
           *   alert(dashboard.name);
           * };
           *
           * var onFailure = function(error) {
           *   alert(error);
           * };
           *
           * var dashboard = {
           *   alteredByAdmin: 'false',
           *   createdDate: '04/18/2012 11:29 AM EDT',
           *   isGroupDashboard: false,
           *   layout: 'desktop',
           *   isdefault: false,
           *   name: 'My Dashboard',
           *   columnCount: 0,
           *   user: {
           *     userId: 'testAdmin1',
           *   },
           *   EDashboardLayoutList: ['accordion', 'desktop', 'portal', 'tabbed'],
           *   defaultSettings: {},
           *   createdBy: {
           *     userId: 'testAdmin1',
           *     userRealName: 'Test Admin 1'
           *   },
           *   editedDate: '04/18/2012 11:29 AM EDT',
           *   groups: [],
           *   description: 'This is my dashboard',
           *   guid: guid.util.guid(),
           *   state: [],
           *   showLaunchMenu: false
           * };
           *
           * Ozone.pref.PrefServer.cloneDashboard({
           *   json: dashboard,
           *   onSuccess: onSuccess,
           *   onFailure: onFailure
           * });
           */
          cloneDashboard : function (cfg){
              cfg.url = _url + "/" + 'dashboard' + "/" + cfg.json.guid;
              var postParams = generateDashboardPostParamsJSON(cfg.json);
              postParams.cloned = true;
              cfg.method = 'POST';
              cfg.jsonObject = postParams;
              setValuesViaJSONObject(cfg);
          },

          /**
           * @description Saves changes to existing dashboards
           * @param {Object} cfg config object see below for properties
           * @param {Array} cfg.viewsToUpdate array of JSON objects containing the view guid and data to be updated
           * @param {Array} cfg.viewGuidsToDelete array of guids of views to be deleted
           * @param {Boolean} cfg.updateOrder flag to update order
           * @param {Function} cfg.onSuccess callback function to capture the success result
           * @param {Function} [cfg.onFailure] callback to execute if there is an error (optional, a default alert provided)
           */
          updateAndDeleteDashboards : function (cfg){
              cfg.url = _url + "/dashboard";
              var postParams = {
                  '_method': 'PUT',
                  'viewsToUpdate': Ozone.util.toString(cfg.viewsToUpdate),
                  'viewGuidsToDelete': Ozone.util.toString(cfg.viewGuidsToDelete),
                  'updateOrder': cfg.updateOrder
              };

              cfg.method = 'POST';
              cfg.content = postParams;
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @description Deletes the dashboard with the specified id
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.dashboardId Unigue dashbard identifier
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {String} layout: layout of dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Number} columnCount: number of columns if dashboard is a portal type<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {List} EDashboardLayoutList: list of dashboard types<br>
           *     {String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     {Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
       *     alert(dashboard.name);
       * };
       *
       * var onFailure = function(error) {
           *     alert(error);
       * };
       *
           * Ozone.pref.PrefServer.deleteDashboard({
           *     dashboardId:'917b4cd0-ecbd-410b-afd9-42d150c26426',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          deleteDashboard : function (cfg){
              cfg.url = _url + "/dashboard/" + cfg.dashboardId;
              deleteBase(cfg);
          },

          /**
           * @description Returns all dashboards for the logged in user.
           * @param {Object} cfg config object see below for properties
           * @param {Function} cfg.onSuccess Callback function to capture the success result.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {Boolean} success: true if dashboards found<br>
           *     {Number} results: number of dashboards found<br>
           *     {Array} data: array of dashboards objects found.  Dashboard object has the following properties:<br>
           *     <br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Date} createdDate: date dashboard was created<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} layout: layout of dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isdefault: true if this is a default dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: name of dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnCount: number of columns if dashboard is a portal type<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{List} EDashboardLayoutList: list of dashboard types<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Date} editedDate: date dashboard was last edited<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} groups:  groups dashboard is assigned to<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} description: description of dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} guid: uniqued dashboard identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           *     <br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     alert(obj.results);
           *     if (obj.results > 0) {
           *         for (var i = 0; i < obj.results; i++) {
           *             alert(obj.data[i].name);
           *         }
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.findDashboards({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          findDashboards : function  (cfg){
              cfg.url = "dashboard";
              list(cfg);
          },

          /**
           * @description Returns all dashboards for the logged in user filtered by the type of dashboard.
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.type A string representing the type of dashboard. If using built in dashboard types, this would include desktop, tabbed, portal, and accordion.
           * @param {Function} cfg.onSuccess Callback function to capture the success result.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {Boolean} success: true if dashboards found<br>
           *     {Number} results: number of dashboards found<br>
           *     {Array} data: array of dashboards objects found.  Dashboard object has the following properties:<br>
           *     <br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Date} createdDate: date dashboard was created<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} layout: layout of dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isdefault: true if this is a default dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: name of dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} columnCount: number of columns if dashboard is a portal type<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{List} EDashboardLayoutList: list of dashboard types<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Date} editedDate: date dashboard was last edited<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} groups:  groups dashboard is assigned to<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} description: description of dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} guid: uniqued dashboard identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} state: array of widget state objects.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
           *     <br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     alert(obj.results);
           *     if (obj.results > 0) {
           *         for (var i = 0; i < obj.results; i++) {
           *             alert(obj.data[i].name);
           *         }
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.findDashboardsByType({
           *     type:'desktop',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          findDashboardsByType : function (cfg){
              cfg.url = "dashboard?layout=" + cfg.type;
              list(cfg);
          },

          /**
           * @description Gets the widget with the specified id
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.widgetId The guid of the widget.
           * @param {String} cfg.universalName The universal name for the widget.
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback is passed the following object as a parameter: {id:Number, namespace:String, value:Object, path:String}
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {Number} id: database pk identifier<br>
           *     {String} namespace: "widget"<br>
           *     {Object} value: widget object having the following properties:<br>
           *     <br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} editable: true if widget can be edited<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} visible: true if widget is visible<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: widget owner identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: widget owner name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} namespace: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} url: url of widget application<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} headerIcon: url of widget header icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} image: url of widget image<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} smallIconUrl: url of widget's small icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} largeIconUrl: url of widget's large icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of the widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of the widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetVersion: widget version<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} tags: array of tag strings<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} definitionVisible: true if definition is visible<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} singleton: true if widget is a singleton<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} background: true if widget runs in the background<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} allRequired: array of all widgets required by this widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} directRequired: array of all widgets directly required by this widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} widgetTypes: array of widget types this widget belongs to<br>
           *     <br>
           *     {String} path: The guid of the widget.<br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     if (obj.value) {
           *         alert(obj.value.namespace);
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.getWidget({
           *     widgetId:'ea5435cf-4021-4f2a-ba69-dde451d12551',
           *     widgetUuid: 'com.company.widget.name',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getWidget : function (cfg){
              cfg.url = _url + "/" + 'widget' + "/" + cfg.widgetId;
              if(cfg.universalName) {
                  cfg.url += '?universalName=' + cfg.universalName;
              }
              get(cfg);
          },

          /**
           * @description Gets all widgets for a given user.
           * @param {Object} cfg config object see below for properties
           * @param {Boolean} [cfg.userOnly] boolean flag that determines whether to only return widgets assigned to the user (excluding widgets to which the user only has access via their assigned groups)
           * @param {Object} [cfg.searchParams] object containing search parameters
           * @param {String} [cfg.searchParams.widgetName] name of widget '%' are wildcards
           * @param {String} [cfg.searchParams.widgetNameExactMatch] true or false to match the name exactly. defaults to false
           * @param {String} [cfg.searchParams.widgetVersion] version of widget '%' are wildcards
           * @param {String} [cfg.searchParams.widgetGuid] Guid of widget '%' are wildcards
           * @param {String} [cfg.searchParams.universalName] Universal name of widget '%' are wildcards
           * @param {Function} cfg.onSuccess callback function to capture the success result.
           * This method is passed an array of objects having the following properties:<br>
           * <br>
           *     {Number} id: database pk identifier<br>
           *     {String} namespace: "widget"<br>
           *     {Object} value: widget object having the following properties:<br>
           *     <br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} editable: true if widget can be edited<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} visible: true if widget is visible<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: widget owner identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: widget owner name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} namespace: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} url: url of widget application<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} headerIcon: url of widget header icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} image: url of widget image<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} smallIconUrl: url of widget's small icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} largeIconUrl: url of widget's large icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of the widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of the widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetVersion: widget version<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} tags: array of tag strings<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} definitionVisible: true if definition is visible<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} singleton: true if widget is a singleton<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} background: true if widget runs in the background<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} allRequired: array of all widgets required by this widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} directRequired: array of all widgets directly required by this widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} widgetTypes: array of widget types this widget belongs to<br>
           *     <br>
           *     {String} path: The guid of the widget.<br>
           * <br>
           * @param {Function} [cfg.onFailure] callback to execute if there is an error (optional, a default alert provided).  This callback is called with two parameters: a error message string, and optionally a status code
           * @example
           *
           * var onSuccess = function(widgets) {
           *     if (widgets.length > 0) {
           *         alert(widgets[0].value.namespace);
           *     }
           * };
           *
           * var onFailure = function(error, status) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.findWidgets({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          findWidgets : function (cfg){

              cfg.url = _url + "/widget";
              if (!cfg.userOnly) {
                  cfg.url += "/listUserAndGroupWidgets";
              }

              // Add search params
              var postParams = {
                  '_method': 'GET'
              };

              if (cfg.searchParams) {
                  if (cfg.searchParams.widgetName && cfg.searchParams.widgetName.length > 0) {
                      var searchTerm = cfg.searchParams.widgetName;
                      if (!cfg.searchParams.widgetNameExactMatch) {
                          searchTerm = '%'+searchTerm+'%';
                      }
                      postParams['widgetName'] = searchTerm;
                  }
                  if (cfg.searchParams.widgetVersion && cfg.searchParams.widgetVersion.length > 0) {
                      postParams['widgetVersion'] = cfg.searchParams.widgetVersion;
                  }
                  if (cfg.searchParams.widgetGuid && cfg.searchParams.widgetGuid.length > 0) {
                      postParams['widgetGuid'] = cfg.searchParams.widgetGuid;
                  }
                  if (cfg.searchParams.universalName && cfg.searchParams.universalName.length > 0) {
                      postParams['universalName'] = cfg.searchParams.universalName;
                  }
                  if (cfg.searchParams.group_id) {
                      postParams['group_id'] = cfg.searchParams.group_id;
                  }
              }

              cfg.method = 'POST';
              cfg.content = postParams;
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @description Saves changes to existing widgets
           * @param {Object} cfg config object see below for properties
           * @param {Array} cfg.widgetsToUpdate array of JSON objects containing the widget guid and data to be updated
           * @param {Array} cfg.widgetGuidsToDelete array of guids of widgets to be deleted
           * @param {Boolean} cfg.updateOrder flag to update order
           * @param {Function} cfg.onSuccess callback function to capture the success result
           * @param {Function} [cfg.onFailure] callback to execute if there is an error (optional, a default alert provided)
           */
          updateAndDeleteWidgets : function (cfg){
              cfg.url = _url + "/widget";
              var postParams = {
                  '_method': 'PUT',
                  'widgetsToUpdate': Ozone.util.toString(cfg.widgetsToUpdate),
                  'widgetGuidsToDelete': Ozone.util.toString(cfg.widgetGuidsToDelete),
                  'updateOrder': cfg.updateOrder
              };

              cfg.method = 'POST';
              cfg.content = postParams;
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @description Retrieves the user preference for the provided name and namespace
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.namespace The namespace of the requested user preference
           * @param {String} cfg.name The name of the requested user preference
           * @param {Function} cfg.onSuccess The function to be called if the user preference is successfully retrieved from
           * the database.  This function takes a single argument, which is a JSON object.  If a preference is found, the
           * complete JSON structure as shown below will be returned.  If it is not found this function be passed an empty JSON object.
           * @example
           * The following is an example of a complete preference object passed to the onSuccess
           * function:
           * {
           *     "value":"true",
           *     "path":"militaryTime",
           *     "user":
           *     {
           *         "userId":"testAdmin1"
           *     },
           *     "namespace":"com.mycompany.AnnouncingClock"
           * }
           * @param {Function} [cfg.onFailure] This parameter is optional. If this function is not specified a default error
           * message will be displayed.This function is called if an error occurs on preference retrieval.  It is not
           * called if the preference is simply missing.
           * This function should accept two arguments:<br>
           * <br>
           * error: String<br>
           * The error message<br>
           * <br>
           * Status: The numeric HTTP Status code (if applicable)<br>
           * 401: You are not authorized to access this entity.<br>
           * 500: An unexpected error occurred.<br>
           * 404: The user preference was not found.<br>
           * 400: The requested entity failed to pass validation.<br>
           * @example
           * The following shows how to make a call to getUserPreference:
           * function onSuccess(pref){
           *     alert(Ozone.util.toString(pref.value));
           * }
           *
           * function onFailure(error,status){
           *     alert('Error ' + error);
           *     alert(status);
           * }
           *
           * // The following code calls getUserPreference with the above defined onSuccess and
           * // onFailure callbacks.
           * Ozone.pref.PrefServer.getUserPreference({
           *     namespace:'com.company.widget',
           *     name:'First President',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getUserPreference : function (cfg){
              cfg.url = _url + "/preference/" + cfg.namespace + "/" + cfg.name;

              //igonore 404 error code, onSuccess will be called with emtpy object payload
              cfg.ignoredErrorCodes = [404];
              get(cfg);
          },

          /**
           * @description Checks for the existence of a user preference for a given namespace and name
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.namespace The namespace of the requested user
           * @param {String} cfg.name The name of the requested user
           * @param {Function} cfg.onSuccess The callback function that is called if a preference successfully return from the database.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {Number} statusCode: status code<br>
           *     {Boolean} preferenceExist: true if preference exists<br>
           * <br>
           * @param {Function} [cfg.onFailure] The callback function that is called if the preference could not be found in the database. Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     if (obj.statusCode = 200) {
           *         alert(obj.preferenceExist);
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.doesUserPreferenceExist({
           *     namespace:'foo.bar.0',
           *     name:'test path entry 0',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          doesUserPreferenceExist: function(cfg) {
              cfg.url = _url + "/hasPreference/" + cfg.namespace + "/" + cfg.name;
              get(cfg);
          },

          /**
           * @description retrieves the current user logged into the system
           * @param {Object} cfg config object see below for properties
           * @param {Function} cfg.onSuccess The callback function that is called for a successful retrieval of the user logged in.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {String} currentUserName: user name<br>
           *     {String} currentUser: user real name<br>
           *     {Date} currentUserPrevLogin: previous login date<br>
           *     {Number} currentId: database pk index<br>
           * <br>
           * @param {Function} cfg.[onFailure] The callback function that is called when the system is unable to retrieve the current user logged in. Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     if (obj) {
           *         alert(obj.currentUser);
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.getCurrentUser({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getCurrentUser: function(cfg) {
              cfg.url = _url + "/person/whoami";
              get(cfg);
          },

          /**
           * @description For retrieving the OWF system server version
           * @param {Object} cfg config object see below for properties
           * @param {Function} cfg.onSuccess The callback function that is called for successfully retrieving the server version of the OWF system.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {String} {serverVersion: server version<br>
           * <br>
           * @param {Function} [cfg.onFailure] The callback function that is called when the system fails to retrieve the server version of the OWF system. Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     if (obj) {
           *         alert(obj.serverVersion);
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.getServerVersion({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getServerVersion: function(cfg) {
              cfg.url = _url + "/server/resources";
              get(cfg);
          },

          /**
           * @description Creates or updates a user preference for the provided namespace and name.
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.namespace  The namespace of the user preference
           * @param {String} cfg.name The name of the user preference
           * @param {String} cfg.value  The value of the user preference. The value can be any string including JSON.
           * @param {Function} cfg.onSuccess The function to be called if the user preference is successfully updated in
           * the database.
       * @example
       * The following is an example of a complete preference object passed to the onSuccess
           * function:
       * {
       *     "value":"true",
       *     "path":"militaryTime",
       *     "user":
       *     {
       *         "userId":"testAdmin1"
       *     },
       *     "namespace":"com.mycompany.AnnouncingClock"
       * }
           * @param {Function} [cfg.onFailure] The function to be called if the user preference cannot be stored in the database.
           * If this function is not specified a default error message will be displayed. This function is passed
           * back the following parameters:<br>
           * <br>
           * error: String<br>
           * The error message<br>
           * <br>
           * Status: The HTTP Status code<br>
           * 401: You are not authorized to access this entity.<br>
           * 500: An unexpected error occurred.<br>
           * 404: The requested entity was not found.<br>
           * 400: The requested entity failed to pass validation.<br>
           * @example
           *
           * function onSuccess(pref){
           *     alert(pref.value);
           * }
           *
           * function onFailure(error,status){
           *     alert('Error ' + error);
           *     alert(status);
           * }
           *
           * var text = 'George Washington';
           * Ozone.pref.PrefServer.setUserPreference({
           *     namespace:'com.company.widget',
           *     name:'First President',
           *     value:text,
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          setUserPreference : function (cfg) {
              cfg.url = _url + "/preference/" + cfg.namespace + "/" + cfg.name;
              if (cfg.method == null) {
                  cfg.method = 'PUT';
              }
              cfg.content = {
                  '_method': cfg.method,
                  'value': cfg.value
              };

              if (cfg.onSuccess) {
                  if (!cfg.onFailure) {  //must ensure there is an onfailure method, as we using content
                      cfg.onFailure = function(err) {
                          alert(Ozone.util.ErrorMessageString.saveUserPreferences + " : " + err);
                      };
                  }
                  Ozone.util.Transport.send(cfg);
              } else {
                  Ozone.util.Transport.sendAndForget(cfg);
              }
          },

          /**
           * @description Deletes a user preference with the provided namespace and name.
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.namespace The namespace of the user preference
           * @param {String} cfg.name The name of the user preference
           * @param {Function} cfg.onSuccess The function to be called if the user preference is successfully deleted from the database.
           * @example
           * The following is an example of a complete preference object passed to the onSuccess
           * function:
           *
           * {
           *     "value":"true",
           *     "path":"militaryTime",
           *     "user":
           *     {
           *         "userId":"testAdmin1"
           *     },
           *     "namespace":"com.mycompany.AnnouncingClock"
           * }
           * @param {Function} [cfg.onFailure] The function to be called if the user preference cannot be deleted from the
           * database or if the preference does not exist. If this function is not specified a default error message will be
           * displayed. This function is passed back the following parameters: <br>
           * <br>
           * error: String <br>
           * The error message <br>
           * <br>
           * Status: The HTTP Status code<br>
           * <br>
           * 401: You are not authorized to access this entity.<br>
           * 500: An unexpected error occurred.<br>
           * 404: The user preference was not found.<br>
           * 400: The requested entity failed to pass validation. <br>
           * <br>
           * @example
           * function onSuccess(pref){
           *     alert(pref.value);
           * }
           *
           * function onFailure(error,status){
           *     alert('Error ' + error);
           *     alert(status);
           * }
           *
           * Ozone.pref.PrefServer.deleteUserPreference({
           *     namespace:'com.company.widget',
           *     name:'First President',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          deleteUserPreference : function (cfg){
              cfg.method = "DELETE";
              //igonore 404 error code, onSuccess will be called with null payload
              cfg.ignoredErrorCodes = [404];
              cfg.path = cfg.name;
              Ozone.pref.PrefServer.setUserPreference(cfg);
          },

          /**
           * @private
           */
          getDependentWidgets : function (cfg) {
              cfg.url = _url + '/widgetDefinition/dependents';
              cfg.method = 'POST';
              if (!cfg.content) { cfg.content = {}; }
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @private
           */
          getDependentPersonWidgets : function (cfg) {
              cfg.url = _url + '/personWidgetDefinition/dependents';
              cfg.method = 'POST';
              if (!cfg.content) { cfg.content = {}; }
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @private
           */
          deleteWidgetDefs : function (cfg) {
              cfg.url = _url + '/widgetDefinition';
              cfg.method = 'DELETE';
              if (!cfg.content) { cfg.content = {}; }
              Ozone.util.Transport.send(cfg);
          }

      };
  };

  var configParams = Ozone.util.parseWindowNameData();
  var url = null;
  if (configParams != null && configParams.preferenceLocation != null) {
   url = configParams.preferenceLocation;
  }
  else {
    url = Ozone.config.prefsLocation;
  }

  Ozone.pref.PrefServer = Ozone.pref.PrefServer(url);
  if(url == null) {
    for (var fname in Ozone.pref.PrefServer)  {
      if (typeof Ozone.pref.PrefServer[fname] == 'function') {
        //dummyfy
        Ozone.pref.PrefServer[fname] = function(){};
      }
    }
  }
}(window, document));
/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.eventing = Ozone.eventing ? Ozone.eventing : {};

//-----------------------------------------------------------------
//Ozone Eventing Widget Object
//-----------------------------------------------------------------
/**
 * @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.eventing.Widget.getInstance</a>
 * @constructor
 * @param {String} widgetRelay The URL for the widget relay file. The relay file must be specified with full location details, but without a fully
 * qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 * widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @param {Function} afterInit - callback to be executed after the widget is finished initializing.
 * @description The Ozone.eventing.Widget object manages the eventing for an individual widget (Deprecated).  This constructor is deprecated.
 *  You should use <a href="#.getInstance">Ozone.eventing.Widget.getInstance</a>
 * @example
 * this.widgetEventingController = new Ozone.eventing.Widget(
 * 'owf-sample-html/js/eventing/rpc_relay.uncompressed.html', function() {
 * 
 *  //put code here to execute after widget init - perhaps immediately publish to a channel
 * 
 * });
 * @throws {Error} throws an error with a message if widget initialization fails
 */
Ozone.eventing.Widget = function(widgetRelay, afterInit) {
  if (Ozone.eventing.Widget.instance == null) {
    Ozone.eventing.Widget.instance = this;
    this.isAfterInit = false;
    //connect passed in function to the internal callback function
    if (afterInit != null) {
      owfdojo.connect(
              this,'afterInitCallBack',
              this,afterInit);
    }
    this.setWidgetRelay(widgetRelay);
    try {
        this.widgetInit();
    } catch (error) {
        throw 'Widget relay init failed. Relaying will not work. Inner Exception: ' + error.name + ": " + error.message;
    }
  }
  else {
    if (afterInit != null) {
      if (this.isAfterInit === false) {
        //connect passed in function to the internal callback function
        owfdojo.connect(
                this,'afterInitCallBack',
                this,afterInit);
    }
      else {
        //already initialized just execute the supplied callback
        setTimeout(afterInit,50);
  }
    }
  }
  return Ozone.eventing.Widget.instance;
};

/**
 * @description The location of the widget relay file.  The relay file should be defined
 *   globally for the entire widget by setting Ozone.eventing.Widget.widgetRelayURL to the relay file url, immediately after
 *   including the widget bundle javascript.  If the relay is not defined at all it is assumed to be at
 *   /[context]/js/eventing/rpc_relay.uncompressed.html. The relay file must be specified with full location details, but without a fully
 *   qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 *   widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @since OWF 3.7.0
 * @example
 * &lt;script type="text/javascript" src="../../js-min/owf-widget-min.js"&gt;&lt;/script&gt;
 * &lt;script&gt;
 *       //The location is assumed to be at /[context]/js/eventing/rpc_relay.uncompressed.html if it is not
 *       //set the path correctly below
 *       Ozone.eventing.Widget.widgetRelayURL = '/owf/js/eventing/rpc_relay.uncompressed.html';
 *       //...
 * &lt;/script&gt;
 *
 */
Ozone.eventing.Widget.widgetRelayURL = Ozone.eventing.Widget.widgetRelayURL ? Ozone.eventing.Widget.widgetRelayURL : null;

Ozone.eventing.Widget.prototype = {

    version: Ozone.version.owfversion + Ozone.version.eventing,

    /**
     * @ignore
     * @returns The URL for the widgetRelay
     * @description This should not be called from usercode.
     */
    getWidgetRelay : function() {
        return this.widgetRelay;
    },
    /**
     * @ignore
     * @param The relaypath to set.
     * @description This should not be called from usercode.
     */
    setWidgetRelay : function(relaypath) {
      //if null figure out path
      if (relaypath == null) {
        //check if global path variable was set
        if (Ozone.eventing.Widget.widgetRelayURL != null) {
          relaypath = Ozone.eventing.Widget.widgetRelayURL;
        }
        //else calculate a standard relative path
        else {
          //find root context - assume relay file is at /<context/js/eventing/rpc_relay.uncompressed.html
          var baseContextPath = window.location.pathname;
          var baseContextPathRegex = /^(\/[^\/]+\/).*$/i;
          var matches = baseContextPath.match(baseContextPathRegex);
          if (matches != null && matches[1] != null && matches[1].length > 0) {
            baseContextPath = matches[1];
            //remove final /
            baseContextPath = baseContextPath.substring(0,baseContextPath.length-1);
          }
          else {
            baseContextPath = '';
          }
          relaypath = baseContextPath + '/js/eventing/rpc_relay.uncompressed.html';
        }
      }
      this.widgetRelay = window.location.protocol + "//" + window.location.host + (relaypath.charAt(0) != '/'? ('/'+relaypath) : relaypath);
    },
    /**
     * @description Returns the Widget Id
     * @returns {String} The widgetId is a complex JSON encoded string which identifies a widget for Eventing.
     *   Embedded in this string is the widget's uniqueId as the 'id' attribute.  There is other data is in the string
     *   which is needed for Eventing and other APIs to function properly. This complex widgetId string may be used in
     *   the <a href="#publish">Ozone.eventing.Widget.publish</a> function to designate a specific recipient for a message.
     *   Additionally, once subscribed to a channel via <a href="#subscribe">Ozone.eventing.Widget.subscribe</a> during the
     *   receipt of a message, the sender's widgetId is made available as the first argument to the handler function.
     * @example
     * //decode and retrieve the widget's unique id
     * var complexIdString = this.eventingController.getWidgetId();
     * var complexIdObj = owfdojo.toJson(complexIdString);
     *
     * //complexIdObj will look like
     * // {
     * //  //widget's uniqueId
     * //  id:"49cd21f0-3110-8121-d905-18ffa81b442e"
     * // }
     *
     * //get Widget's uniqueId
     * alert('widget id = ' + complexIdObj.id);
     */
    getWidgetId : function() {
        return this.widgetId;
    },
    /**
     * @ignore
     * @returns The containerRelay
     * @description This should not be called from usercode.
     */
    getContainerRelay : function() {
        return this.containerRelay;
    },
    /**
     * @ignore
     * @description This method is called by the Widget's constructor. It should never be called from user code.
     */
    widgetInit : function() {
        var queryHash = {};
        var jsonString = null;

        //check for data in window.name
        var configParams = Ozone.util.parseWindowNameData();
        if (configParams != null) {

          //the id is the whole contents of the window.name
          this.widgetId = '{\"id\":\"' + configParams.id + '\"}';
          this.locked = configParams.locked;

          //embedded in the id is the relay
          this.containerRelay = configParams.relayUrl;
        }
        else {
          throw {
            name :'WidgetInitException',
            message :'The call to container_init failed. Inner Exception: '
          };
        }

        gadgets.rpc.setRelayUrl("..", this.containerRelay, false, true);

        
        var onClickHandler,
            onKeyDownHandler;

        function activateWidget() {

             var config = {
                 fn: "activateWidget",
                 params: {
                    guid: configParams.id,
                    focusIframe: document.activeElement === document.body
                 }
             };

             var stateChannel = '_WIDGET_STATE_CHANNEL_' + configParams.id;
             if (!this.disableActivateWidget) {
               gadgets.rpc.call('..', stateChannel, null, this.widgetId, config);
             }
             else {
               this.disableActivateWidget = false;
             }
        }

        //register for after_container_init
        gadgets.rpc.register("after_container_init", owfdojo.hitch(this,function() {

            gadgets.rpc.unregister("after_container_init");
            
            //attach mouse click and keydown listener to send activate calls for the widget
            if(!onClickHandler) {
                onClickHandler = owfdojo.connect(document, 'click', owfdojo.hitch(this, activateWidget));
            }
            
            if(!onKeyDownHandler) {
                onKeyDownHandler = owfdojo.connect(document, 'onkeyup', owfdojo.hitch(this, activateWidget));
            }

            //execute callback
            this.afterContainerInit();

        }));

        gadgets.rpc.register("_widget_activated", owfdojo.hitch(this,function() {
            //console.log("_widget_activated => " + configParams.id);
            
            if(onClickHandler) {
                owfdojo.disconnect(onClickHandler);
            }
            if(onClickHandler) {
                owfdojo.disconnect(onKeyDownHandler);
            }
                        
            onClickHandler = null;
            onKeyDownHandler = null;

        }));

        gadgets.rpc.register("_widget_deactivated", owfdojo.hitch(this,function() {
            //console.log("_widget_deactivated => " + configParams.id);

            if(!onClickHandler) {
                onClickHandler = owfdojo.connect(document, 'click', owfdojo.hitch(this, activateWidget));
            }
            if(!onKeyDownHandler) {
                onKeyDownHandler = owfdojo.connect(document, 'onkeyup', owfdojo.hitch(this, activateWidget));
            }
        }));

        //register with container
        try {
            var idString = '{\"id\":\"' + configParams.id + '\"}';
            var data = {
              id: idString,
              version: this.version,
              useMultiPartMessagesForIFPC: true,
              relayUrl: this.widgetRelay
            };

            if (Ozone.util.pageLoad.loadTime != null && Ozone.util.pageLoad.autoSend) {
              data.loadTime = Ozone.util.pageLoad.loadTime;
            }

            //jsonString = gadgets.json.stringify(data);
            jsonString = Ozone.util.toString(data);
            gadgets.rpc.call('..', 'container_init', null, idString, jsonString);

        } catch (error) {
            throw {
                name :'WidgetInitException',
                message :'The call to container_init failed. Inner Exception: ' + error
            };
        }
    },

    isInitialized: function() {
      return this.isAfterInit;
    },

    /**
     * @ignore
     * default noop callback
     */
    afterInitCallBack: function(widgetEventingController) {

    },

    /**
     * @ignore
     * @description This method is called by the Widget's constructor. It should never be called from user code.
     */
     afterContainerInit: function() {
       this.isAfterInit = true;
       if (this.afterInitCallBack != null) {
         this.afterInitCallBack(this);
       }
     },

    /**
     * @ignore
     */
    registerHandler : function(handlerName, handlerObject) {
      //Simple wrapper for manager objects to register handler functions
      gadgets.rpc.register(handlerName, handlerObject);
    },

    /**
     * @ignore
     * Wraps gadgets.rpc.call.
     */
    send:function () {
        gadgets.rpc.call.apply(gadgets.rpc, arguments);
    },

    /**
     * @description Subscribe to a named channel for a given function.
     * @param {String} channelName The channel to subscribe to.
     * @param {Function} handler The function you wish to subscribe.  This function will be called with three
     *   arguments: sender, msg, channel.
     * @param {String} [handler.sender] The first argument passed to the handler function is the id of the sender
     *   of the message.  See <a href="#getWidgetId">Ozone.eventing.Widget.getWidgetId</a>
     *   for a description of this id.
     * @param {Object} [handler.msg] The second argument passed to the handler function is the message itself.
     * @param {String} [handler.channel] The third argument passed to the handler function is the channel the message was
     *   published on.
     * @example
     * this.widgetEventingController = Ozone.eventing.Widget.getInstance();
     * this.widgetEventingController.subscribe("ClockChannel", this.update);
     *
     * var update = function(sender, msg, channel) {
     *     document.getElementById('currentTime').innerHTML = msg;
     * }
     *
     */
    subscribe : function(channelName, handler) {
        gadgets.pubsub.subscribe(channelName, handler);
        return this;
    },
    /**
     * @description Unsubscribe to a named channel
     * @param {String} channelName The channel to unsubscribe to.
     * @example
     * this.widgetEventingController.unsubscribe("ClockChannel");
     */
    unsubscribe : function(channelName) {
        gadgets.pubsub.unsubscribe(channelName);
        return this;
    },
    /**
     * @description Publish a message to a given channel
     * @param {String} channelName The name of the channel to publish to
     * @param {Object} message The message to publish to the channel.
     * @param {String} [dest] The id of a particular destination.  Defaults to null which sends to all
     *                 subscribers on the channel.  See <a href="#getWidgetId">Ozone.eventing.Widget.getWidgetId</a>
     *                 for a description of the id.
     * @example
     * this.widgetEventingController = Ozone.eventing.Widget.getInstance();
     * this.widgetEventingController.publish("ClockChannel", currentTimeString);
     */
    publish : function(channelName, message, dest) {
        gadgets.pubsub.publish(channelName, message, dest);
        return this;
    }
};

/**
 * @description Retrieves Ozone.eventing.Widget Singleton instance
 * @param {Function} [afterInit] callback function to be executed after the Ozone.eventing.Widget singleton is initialized
 * @param {String} [widgetRelay] Optionally redefine the location of the relay file.  The relay file should be defined
 *   globally for the entire widget by setting Ozone.eventing.Widget.widgetRelayURL to the relay file url, immediately after
 *   including the widget bundle javascript.  If the relay is not defined at all it is assumed to be at
 *   /[context]/js/eventing/rpc_relay.uncompressed.html.  The relay file must be specified with full location details, but without a fully
 *   qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 *   widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @since OWF 3.7.0
 * @throws {Error} throws an error with a message if widget initialization fails
 * @example
 * &lt;script type="text/javascript" src="../../js-min/owf-widget-min.js"&gt;&lt;/script&gt;
 * &lt;script&gt;
 *       //The location is assumed to be at /[context]/js/eventing/rpc_relay.uncompressed.html if it is not
 *       //set the path correctly below
 *       Ozone.eventing.Widget.widgetRelayURL = '/owf/js/eventing/rpc_relay.uncompressed.html';
 *
 *       owfdojo.addOnLoad(function() {
 *         //get widget instance
 *         var widgetEventingController = Ozone.eventing.Widget.getInstance();
 *         //do something
 *         widgetEventingController.publish("FooChannel", 'message goes here');
 *       });
 * &lt;/script&gt;
 */
Ozone.eventing.Widget.getInstance = function(afterInit, widgetRelay) {
  if (Ozone.eventing.Widget.instance == null) {
    Ozone.eventing.Widget.instance = new Ozone.eventing.Widget(widgetRelay, afterInit);
  }
  else {
    if (afterInit != null) {
      if (!Ozone.eventing.Widget.instance.isAfterInit) {
        //connect passed in function to the internal callback function
        owfdojo.connect(
                Ozone.eventing.Widget.instance,'afterInitCallBack',
                Ozone.eventing.Widget.instance,afterInit);
      }
      else {
        //already initialized just execute the supplied callback
      setTimeout(function() {
        afterInit(Ozone.eventing.Widget.instance)
      },50);
    }
  }
  }
  return Ozone.eventing.Widget.instance;
};

/**
 * @ignore
 * @namespace
 * @since OWF 5.0
 */
OWF = window.OWF ? window.OWF : {};

(function (window, document, undefined) {

    /**
     * @namespace
     */
    OWF.Intents = function () {
        var INTENTS_SERVICE_NAME = '_intents',
            INTENTS_SERVICE_RECEIVE_NAME = '_intents_receive',
            intentReceiverMap = {};

        return /** @lends OWF.Intents */ {

            /**
             * Starts an Intent.  This will send the intent and data to one or more widgets.
             * @param {Object} intent Object representing the Intent
             * @param {String} intent.action Name of the Intent
             * @param {String} intent.dataType Describes the data that will be sent with the intent.  It is recommended
             *   that this be a MIME type.
             * @param {Object} data Data to be sent with the intent
             * @param {Function} handler Function to be executed once the Intent has been sent to a destination widget
             * @param {Object[]} [handler.dest] The first argument passed to the handler function is the id(s) of the recipient(s)
             *   of the message. See <a href="./OWF.html#.getIframeId">OWF.getIframeId</a>
             *   for a description of this id.
             * @param {Object[]} [dest] Explicitly define which widgets will get this intent using Widget Proxies
             * @example
             * OWF.Intents.startActivity(
             *   {
             *    action: 'Plot',
             *    dataType: 'application/vnd.owf.latlon'
             *   },
             *   {
             *     lat: 0,
             *     lon: 0
             *   },
             *   function(dest) {
             *     //dest is an array of destination widget proxies
             *   }
             * );
             */
            startActivity:function (intent, data, handler, dest) {
                var destIds = [];

                //pull destIds from any proxies passed in
                if (dest != null) {
                    for (var i = 0; i < dest.length; i++) {
                        destIds.push(dest[i].id);
                    }
                }

                gadgets.rpc.call('..', INTENTS_SERVICE_NAME,
                    //callback for when an intent has reached the destination widget(s)
                    function (ids) {
                        //exec handler
                        if (handler != null) {
                            var widgets = [];
                            if (ids != null) {
                                var destWidgetIds = [].concat(ids);
                                for (var i = 0; i < destWidgetIds.length; i++) {
                                    //get dest widget proxy
                                    var widget = Ozone.eventing.getWidgetProxyMap()[destWidgetIds];
                                    if (widget != null) {
                                        widgets.push(widget);
                                        if (widgets.length == destWidgetIds.length) {
                                            handler(widgets);
                                        }
                                    }
                                    //if null create new widget proxy
                                    else {
                                        Ozone.eventing.importWidget(destWidgetIds[i], function (wproxy) {
                                            widgets.push(wproxy);
                                            if (widgets.length == destWidgetIds.length) {
                                                handler(widgets);
                                            }
                                        });
                                    }

                                }
                                if (destWidgetIds.length < 1) {
                                    //no dest ids were sent send back an empty array
                                    handler(widgets);
                                }
                            }
                            else {
                                //no dest ids were sent send back an empty array
                                handler(widgets);
                            }
                        }
                    }, OWF.getIframeId(), intent, data, destIds);
            },

            /**
             * Register to receive an Intent
             * @param {Object} intent Object representing the Intent
             * @param {String} intent.action Name of the Intent
             * @param {String} intent.dataType Describes the data that will be sent with the intent.  It is recommended
             *   that this be a MIME type.
             * @param {Function} handler Function to be executed once an Intent has been received
             * @param {String} [handler.sender] The first argument passed to the handler function is the id of the sender
             *   of the message. See <a href="./OWF.html#.getIframeId">OWF.getIframeId</a>
             *   for a description of this id.
             * @param {Object} [handler.intent] The second argument passed to the handler function is the intent itself.
             * @param {Object} [handler.data] The third argument passed to the handler function is the intent data.
             * @example
             * OWF.Intents.receive(
             *   {
             *     action: 'Plot',
             *    dataType: 'application/vnd.owf.latlon'
             *   },
             *   function(sender,intent, data) {
             *     //do something with the data
             *   }
             * );
             */
            receive:function (intent, handler) {
                var intentKey = owfdojo.toJson(intent);

                //save a list of handlers per intent
                intentReceiverMap[intentKey] = handler;

                //register with shindig for when the intent message is sent
                gadgets.rpc.register(INTENTS_SERVICE_NAME, function(sender, intent, data) {
                     var intentKey = owfdojo.toJson(intent);

                    //execute the handler that matches the intent
                    var receiverHandler = intentReceiverMap[intentKey];
                    if (intentReceiverMap[intentKey] != null) {
                        receiverHandler.call(this, sender, intent, data);
                    }

                });
                gadgets.rpc.call('..', INTENTS_SERVICE_RECEIVE_NAME, null, intent, OWF.getIframeId());
            }
        };

    }();


}(window, document));
/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.chrome = Ozone.chrome ? Ozone.chrome : {};

/**
 *  @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.chrome.WidgetChrome.getInstance</a>
 *  @constructor  widgetEventingController - Ozone.eventing.Widget object
 *  @param  {Object} config - config object with parameters
 *  @param  {Ozone.eventing.Widget} config.widgetEventingController - widget eventing object which handles eventing for the widget
 *  @description This object allows a widget to modify the button contained in the widget header (the chrome).  
 *  To do so it requires a widgetEventingController
 *  @example
 *    this.wc = new Ozone.chrome.WidgetChrome({
 *        widgetEventingController: this.widgetEventingController
 *    });
 *
 * @throws {Error} throws an error with a message if widget initialization fails
 */
Ozone.chrome.WidgetChrome = function(config) {
  if (Ozone.chrome.WidgetChrome.instance == null) {
    var scope = this;
    scope.channelName = "Ozone._WidgetChromeChannel";
    scope.version = Ozone.version.owfversion + Ozone.version.widgetChrome;
    scope.items = {};
    scope.registerChromeMenu = function(menuConfig) {
  		// Regular menu item
       	scope.items[menuConfig.itemId != null ? menuConfig.itemId : menuConfig.id] = menuConfig;
       	
  	  	if (menuConfig.menu) {
  	    	for (var j = 0 ; j < menuConfig.menu.items.length ; j++) {
  	    		var menuItem = menuConfig.menu.items[j];
    			// Sub-menu
    			scope.registerChromeMenu(menuItem);
  	    	}
	  	}
    };

    var pub = /** @lends Ozone.chrome.WidgetChrome.prototype */ {

      init : function(config) {

        config = config || {};

          scope.widgetEventingController = config.widgetEventingController || Ozone.eventing.Widget.instance;
          scope.widgetEventingController.registerHandler(scope.channelName, function(sender, msg) {
            var returnValue = true;

            //msg will always be a json string
            var data = Ozone.util.parseJson(msg);

            var id = data.itemId != null ? data.itemId : data.id;
            var handler = scope.items[id].handler;
            if (handler != null && owfdojo.isFunction(handler)) {
              returnValue = handler.apply(data.scope != null ? data.scope : window, data.args != null ? data.args : []);
            }

            return returnValue;
          });
      },

      /**
       * @description Checks to see if the Widget Chrome has already been modified.  This is useful if the widget iframe is reloaded
       * @param {Object} cfg config object see below for properties
       * @param {Function} cfg.callback The function which receives the results.
       * This method will be passed an object which has following properties. <br>
       * <br>
       *     {Boolean} success: true if the widget is currently opened on the dashboard, or else false. <br>
       *     {Boolean} modified: true if the widget chrome(header) is modified, or else false. <br>
       *
       * @example
       *    //this.wc is an already instantiated WidgetChrome obj
       *    this.wc.isModified({
       *     callback: function(msg) {
       *         //msg will always be a json string
       *         var res = Ozone.util.parseJson(msg);
       *         if (res.success) {
       *
       *             //if the chrome was never modified
       *             if (!res.modified) {
       *                //do something, perhaps add buttons
       *             }
       *             //if we already modified the chrome
       *             else {
       *               //do something or perhaps nothing if the buttons are already added
       *             }
       *         }
       *     }
       *   });
       */
      isModified: function(cfg) {
        var data = {
          action: 'isModified'
        };
        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },

      /**
       * @description Adds buttons to the Widget Chrome.  Buttons are added after existing buttons.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of buttons configurations to add to the chrome.  See example for button configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
       * @param {String} cfg.items[*].xtype xtype is ExtJS-like property used to determine the component to create.  Currently the Widget Chrome API only supports two xtype values: ‘button’ and ‘widgettool’.  xtype is an optional field, if it is omitted ‘widgettool’ is used.
       * @param {String} cfg.items[*].type Used only for ‘widgettool’ buttons.  It determines the standard icon to be used.  For a complete list of types please see the ExtJS 4.x API documentation, <a href='http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type'>http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type</a>
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the button.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the button.  This property is only used if the xtype is ‘button.’  ‘widgettool’ will not show text.
       * @param {Object} cfg.items[*].tooltip This property defines a tooltip.  It has two important sub properties, title and text.  tooltip is only used when the xtype is ‘button’
       * @param {Function} cfg.items[*].handler The handler attribute defines a function to be executed when the button is pressed. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function’s parameter list contains the standard parameters for an Eventing callback function.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.addHeaderButtons({
       *             items:
       *              [
       *               {
       *                 xtype: 'button',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/exclamation.png',
       *                 text: 'Alert',
       *                 itemId:'alert',
       *                 tooltip:  {
       *                   text: 'Alert!'
       *                 },
       *                 handler: function(sender, data) {
       *                   //widgetState is an already instantiated WidgetState Obj
       *                   if (widgetState) {
       *                     widgetState.getWidgetState({
       *                         callback: function(state) {
       *
       *                           //check if the widget is visible
       *                           if (!state.collapsed && !state.minimized && state.active) {
       *                             //only render visual content, perhaps popup a message box if the widget is visible
       *                             //otherwise it may not render correctly
       *                           }
       *                         }
       *                     });
       *                   }
       *                 }
       *               },
       *               {
       *                 xtype: 'widgettool',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/information.png',
       *                 itemId:'help',
       *                 handler: function(sender, data) {
       *                   alert('About Button Pressed');
       *                 }
       *               },
       *               {
       *                 //gear is a standard ext tool type
       *                 type: 'gear',
       *                 itemId:'gear',
       *                 handler: function(sender, data) {
       *                   alert('Utility Button Pressed');
       *                 }
       *               }
       *             ]
       *     });
       */
      addHeaderButtons : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'addHeaderButtons';
        data.type = 'button';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          scope.items[items[i].itemId != null ? items[i].itemId : items[i].id] = items[i];
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);

      },

      /**
       * @description Updates any existing buttons in the Widget Chrome based on the itemId.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of buttons configurations to add to the chrome.  See example below for button configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
       * @param {String} cfg.items[*].xtype xtype is ExtJS-like property used to determine the component to create.  Currently the Widget Chrome API only supports two xtype values: ‘button’ and ‘widgettool’.  xtype is an optional field, if it is omitted ‘widgettool’ is used.
       * @param {String} cfg.items[*].type Used only for ‘widgettool’ buttons.  It determines the standard icon to be used.  For a complete list of types please see the ExtJS 4.x API documentation, <a href='http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type'>http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type</a>
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the button.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the button.  This property is only used if the xtype is ‘button.’  ‘widgettool’ will not show text.
       * @param {Object} cfg.items[*].tooltip This property defines a tooltip.  It has two important sub properties, title and text.  tooltip is only used when the xtype is ‘button’
       * @param {Function} cfg.items[*].handler The handler attribute defines a function to be executed when the button is pressed. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function’s parameter list contains the standard parameters for an Eventing callback function.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.updateHeaderButtons({
       *             items:
       *              [
       *               {
       *                 xtype: 'button',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/exclamation.png',
       *                 text: 'Alert',
       *                 itemId:'alert',
       *                 tooltip:  {
       *                   text: 'Alert!'
       *                 },
       *                 handler: function(sender, data) {
       *                   //widgetState is an already instantiated WidgetState Obj
       *                   if (widgetState) {
       *                     widgetState.getWidgetState({
       *                         callback: function(state) {
       *
       *                           //check if the widget is visible
       *                           if (!state.collapsed && !state.minimized && state.active) {
       *                             //only render visual content, perhaps popup a message box if the widget is visible
       *                             //otherwise it may not render correctly
       *                           }
       *                         }
       *                     });
       *                   }
       *                 }
       *               },
       *               {
       *                 xtype: 'widgettool',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/information.png',
       *                 itemId:'help',
       *                 handler: function(sender, data) {
       *                   alert('About Button Pressed');
       *                 }
       *               },
       *               {
       *                 //gear is a standard ext tool type
       *                 type: 'gear',
       *                 itemId:'gear',
       *                 handler: function(sender, data) {
       *                   alert('Utility Button Pressed');
       *                 }
       *               }
       *             ]
       *     });
       */
      updateHeaderButtons : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'updateHeaderButtons';
        data.type = 'button';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          //save data
          var id = items[i].itemId != null ? items[i].itemId : items[i].id;
          if (scope.items[id] != null) {
            owfdojo.mixin(scope.items[id], items[i]);
          }
          else {
            scope.items[id] = items[i];
          }
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);

      },

      /**
       * @description Inserts new buttons to the Widget Chrome.  Buttons are added to the same area as existing buttons.
       * @param {Object} cfg config object see below for properties
       * @param {Number} [cfg.pos=0] 0-based index of where buttons will be added, among any pre-existing buttons.
       * @param {Object[]} cfg.items an array of buttons configurations to insert to the chrome.  See example below for button configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
       * @param {String} cfg.items[*].xtype xtype is ExtJS-like property used to determine the component to create.  Currently the Widget Chrome API only supports two xtype values: ‘button’ and ‘widgettool’.  xtype is an optional field, if it is omitted ‘widgettool’ is used.
       * @param {String} cfg.items[*].type Used only for ‘widgettool’ buttons.  It determines the standard icon to be used.  For a complete list of types please see the ExtJS 4.x API documentation, <a href='http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type'>http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type</a>
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the button.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the button.  This property is only used if the xtype is ‘button.’  ‘widgettool’ will not show text.
       * @param {Object} cfg.items[*].tooltip This property defines a tooltip.  It has two important sub properties, title and text.  tooltip is only used when the xtype is ‘button’
       * @param {Function} cfg.items[*].handler The handler attribute defines a function to be executed when the button is pressed. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function’s parameter list contains the standard parameters for an Eventing callback function.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.insertHeaderButtons({
       *             pos: 0,
       *             items:
       *              [
       *               {
       *                 xtype: 'button',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/exclamation.png',
       *                 text: 'Alert',
       *                 itemId:'alert',
       *                 tooltip:  {
       *                   text: 'Alert!'
       *                 },
       *                 handler: function(sender, data) {
       *                   //widgetState is an already instantiated WidgetState Obj
       *                   if (widgetState) {
       *                     widgetState.getWidgetState({
       *                         callback: function(state) {
       *
       *                           //check if the widget is visible
       *                           if (!state.collapsed && !state.minimized && state.active) {
       *                             //only render visual content, perhaps popup a message box if the widget is visible
       *                             //otherwise it may not render correctly
       *                           }
       *                         }
       *                     });
       *                   }
       *                 }
       *               },
       *               {
       *                 xtype: 'widgettool',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/information.png',
       *                 itemId:'help',
       *                 handler: function(sender, data) {
       *                   alert('About Button Pressed');
       *                 }
       *               },
       *               {
       *                 //gear is a standard ext tool type
       *                 type: 'gear',
       *                 itemId:'gear',
       *                 handler: function(sender, data) {
       *                   alert('Utility Button Pressed');
       *                 }
       *               }
       *             ]
       *     });
       */
      insertHeaderButtons : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'insertHeaderButtons';
        data.type = 'button';
        if (cfg.pos != null) {
          data.pos = cfg.pos;
        }
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          scope.items[items[i].itemId != null ? items[i].itemId : items[i].id] = items[i];
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },

      /**
       * @description Removes existing buttons on the Widget Chrome based on itemId.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of buttons configurations to remove to the chrome.  Only itemId is required.
       *   See example below for button configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.removeHeaderButtons({
       *             items:
       *              [
       *               {
       *                 itemId:'alert'
       *               },
       *               {
       *                 itemId:'help'
       *               },
       *               {
       *                 itemId:'gear'
       *               }
       *             ]
       *     });
       */
      removeHeaderButtons : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'removeHeaderButtons';
        data.type = 'button';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          var id = items[i].itemId != null ? items[i].itemId : items[i].id;
          if (scope.items[id] != null) {
            //delete saved data
            delete scope.items[id];
          }
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },
     
    
    /**
     * @description Lists all buttons that have been added to the widget chrome.
     * @param {Object} cfg config object see below for properties
     * @param {Function} cfg.callback The function which receives the results.
     *
     * @example
     *    //this.wc is an already instantiated WidgetChrome obj
     *    this.wc.listHeaderButtons({
     *     callback: function(msg) {
     *         //msg will always be a json string
     *         var res = Ozone.util.parseJson(msg);
     *         if (res.success) {
     *             for (var i = 0; i < res.items.length; i++) {
     *             	// do something with the buttons
     *             }
     *         }
     *     }
     *   });
     */
    listHeaderButtons: function(cfg) {
      var data = {
        action: 'listHeaderMenus',
        type: 'button'
      };
      var jsonString = gadgets.json.stringify(data);
      gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
    },
    
      /**
       * @description Adds menus to the Widget Chrome.  Menus are added after existing menus.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of menu configurations to add to the chrome.  See example for menu configs
       * @param {String} cfg.items[*].parentId itemId is the itemId of the menu to which this configuration should be added as a sub-menu.  If omitted, the configuration will be added as a main menu on the menu toolbar.  
       * @param {String} cfg.items[*].itemId itemId is a unique id among all menus that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate menus which may not be able to be removed properly.
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the menu.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the menu.  
       * @param {Object} cfg.items[*].menu menu configuration object
       * @param {Object[]} cfg.items[*].menu.items an array of menu item configurations to add to the chrome.  See example for menu item configs
       * @param {String} cfg.items[*].menu.items[*].itemId itemId is a unique id among all menu items that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.
       * @param {String} cfg.items[*].menu.items[*].xtype xtype is used to specify the type of menu item to add.  This attribute should be omitted unless specifying a menuseparator. Setting this value to "menuseparator" adds a separator bar to a menu, used to divide logical groups of menu items. If specified, only xtype should be specified.  Generally you will add one of these by using "-" in your items config rather than creating one directly using xtype.  See example below for usage. 
       * @param {String} cfg.items[*].menu.items[*].icon This property defines the URL of the image to be used for the menu item.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].menu.items[*].text This property defines text to appear for the menu item. 
       * @param {Function} cfg.items[*].menu.items[*].handler The handler attribute defines a function to be executed when the menu item is clicked. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function's parameter list contains the standard parameters for an Eventing callback function.
       * @param {Object} cfg.items[*].menu.items[*].menu sub-menu configuration object.  See example for sub-menu config.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.addHeaderMenus({
       *             items:
       *              [
       *				{
       *					itemId:'regularMenu',
       *					icon: './themes/common/images/skin/exclamation.png',
       *					text: 'Regular Menu',
       *					menu: {
       *						items: [
       *						    {
       *						    	itemId:'regularMenuItem1',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Regular Menu Item 1',
       *						    	handler: function(sender, data) {
       *						    		alert('You clicked the Regular Menu menu item.');
       *						    	}
       *						    }
       *						]
       *					}
       *				},
       *				{
       *					itemId:'snacks',
       *					icon: './themes/common/images/skin/exclamation.png',
       *					text: 'Menu with Sub-Menu',
       *					menu: {
       *						items: [
       *						    {
       *						    	itemId:'fruits',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Fruits',
       *						    	menu: {
       *							    	items: [
       *							    	    {
       *							    	    	itemId:'apple',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Apple',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be an Apple.');
       *							    	    	}
       *							    	    },
       *                                        {
       *                                            xtype: 'menuseparator'
       *                                        },
       *							    	    {
       *							    	    	itemId:'banana',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Banana',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be a Banana.');
       *							    	    	}
       *							    	    }, {
       *							    	    	itemId:'cherry',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Cherries',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be Cherries.');
       *							    	    	}
       *							    	    }
       *							    	]
       *						    	}
       *						    },
       *							'-', // another way to add a menu separator 
       *							{
       *						    	itemId:'cupcake',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Cupcake',
       *						    	handler: function(sender, data) {
       *						    		alert('Your snack will be a Cupcake.');
       *						    	}
       *						    }, {
       *						    	itemId:'chips',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Potato Chips',
       *						    	handler: function(sender, data) {
       *						    		alert('Your snack will be a Potato Chips.');
       *						    	}
       *						    }
       *						]
       *					}
       *				}
       *             ]
       *     });
       */
      addHeaderMenus : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'addHeaderMenus';
        data.type = 'menu';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
        	var item = items[i];
        	scope.registerChromeMenu(item);
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);

      },
      
      /**
       * @description Updates any existing menus in the Widget Chrome based on the itemId.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of menu configurations to add to the chrome.  See example for menu configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all menus that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate menus which may not be able to be removed properly.
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the menu.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the menu.  
       * @param {Object} cfg.items[*].menu menu configuration object
       * @param {Object[]} cfg.items[*].menu.items an array of menu item configurations to add to the chrome.  See example for menu item configs
       * @param {String} cfg.items[*].menu.items[*].itemId itemId is a unique id among all menu items that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.
       * @param {String} cfg.items[*].menu.items[*].xtype xtype is used to specify the type of menu item to add.  This attribute should be omitted unless specifying a menuseparator. Setting this value to "menuseparator" adds a separator bar to a menu, used to divide logical groups of menu items. If specified, only xtype should be specified.  See example below for usage.
       * @param {String} cfg.items[*].menu.items[*].icon This property defines the URL of the image to be used for the menu item.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].menu.items[*].text This property defines text to appear for the menu item. 
       * @param {Function} cfg.items[*].menu.items[*].handler The handler attribute defines a function to be executed when the menu item is clicked. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function's parameter list contains the standard parameters for an Eventing callback function.
       * @param {Object} cfg.items[*].menu.items[*].menu sub-menu configuration object.  See example for sub-menu config.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.updateHeaderMenus({
       *             items:
       *              [
       *				{
       *					itemId:'regularMenu',
       *					icon: './themes/common/images/skin/exclamation.png',
       *					text: 'Regular Menu',
       *					menu: {
       *						items: [
       *						    {
       *						    	itemId:'regularMenuItem1',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Regular Menu Item 1',
       *						    	handler: function(sender, data) {
       *						    		alert('You clicked the Regular Menu menu item.');
       *						    	}
       *						    }
       *						]
       *					}
       *				},
       *				{
       *					itemId:'snacks',
       *					icon: './themes/common/images/skin/exclamation.png',
       *					text: 'Menu with Sub-Menu',
       *					menu: {
       *						items: [
       *						    {
       *						    	itemId:'fruits',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Fruits',
       *						    	menu: {
       *							    	items: [
       *							    	    {
       *							    	    	itemId:'apple',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Apple',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be an Apple.');
       *							    	    	}
       *							    	    },
       *                                        {
       *                                            xtype: 'menuseparator'
       *                                        },
       *							    	    {
       *							    	    	itemId:'banana',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Banana',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be a Banana.');
       *							    	    	}
       *							    	    }, {
       *							    	    	itemId:'cherry',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Cherries',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be Cherries.');
       *							    	    	}
       *							    	    }
       *							    	]
       *						    	}
       *						    },
       *							'-', // another way to add a menu separator 
       *							{
       *						    	itemId:'cupcake',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Cupcake',
       *						    	handler: function(sender, data) {
       *						    		alert('Your snack will be a Cupcake.');
       *						    	}
       *						    }, {
       *						    	itemId:'chips',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Potato Chips',
       *						    	handler: function(sender, data) {
       *						    		alert('Your snack will be a Potato Chips.');
       *						    	}
       *						    }
       *						]
       *					}
       *				}
       *             ]
       *     });
       */
      updateHeaderMenus : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'updateHeaderMenus';
        data.type = 'menu';
        data.items = items;
        
        var merge = function(source, key, value) {
            if (typeof key === 'string') {
                if (value && value.constructor === Object) {
                    if (source[key] && source[key].constructor === Object) {
                        merge(source[key], value);
                    }
                    else {
                        source[key] = Ext.clone(value);
                    }
                }
                else {
                    source[key] = value;
                }

                return source;
            }

            var i = 1,
                ln = arguments.length,
                object, property;

            for (; i < ln; i++) {
                object = arguments[i];

                for (property in object) {
                    if (object.hasOwnProperty(property)) {
                        merge(source, property, object[property]);
                    }
                }
            }

            return source;
        };
        
        for (var i = 0; i < items.length; i++) {
        	var item = items[i];
        	// don't re-register menu if submenu or handler are unchanged
        	if (item.menu || item.handler) {
        		scope.registerChromeMenu(item);
        	}
        	if (item.menu) {
	        	for (var j = 0 ; j < item.menu.items.length ; j++) {
	        		var menuItem = item.menu.items[j];
	        		if (!menuItem.menu) {
	        			// Regular menu item
	        			// Merge with current menu item
	        			var key = menuItem.itemId != null ? menuItem.itemId : menuItem.id;
	        			scope.items[key] = scope.items[key] ? scope.items[key] : {};
	                	scope.items[key] = merge(scope.items[key], menuItem);
	        		} else {
	        			// Sub-menu 
	        			for (var k = 0 ; k < menuItem.menu.items.length ; k++) {
	        				var subMenuItem = menuItem.menu.items[k];
		        			// Merge with current sub-menu item
		        			var key = subMenuItem.itemId != null ? subMenuItem.itemId : subMenuItem.id;
		        			scope.items[key] = scope.items[key] ? scope.items[key] : {};
		                	scope.items[key] = merge(scope.items[key], subMenuItem);
	        			}
	        		}
	        	}
        	} else {
    			// Regular menu item
    			// Merge with current menu item
    			var key = item.itemId != null ? item.itemId : item.id;
    			scope.items[key] = scope.items[key] ? scope.items[key] : {};
            	scope.items[key] = merge(scope.items[key], item);
        	}
        	
        	// Update data with merged item
        	data.items[i] = scope.items[data.items[i].itemId];
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);

      },

      /**
       * @description Inserts new menus into the Widget Chrome.  Menus are added to the same area as existing menus.
       * @param {Object} cfg config object see below for properties
       * @param {Number} [cfg.pos=0] 0-based index of where menus will be added, among any pre-existing menus.
       * @param {Object[]} cfg.items an array of menu configurations to add to the chrome.  See example for menu configs
       * @param {String} cfg.items[*].parentId itemId is the itemId of the menu to which this configuration should be added as a sub-menu.  If omitted, the configuration will be added as a main menu on the menu toolbar.  
       * @param {String} cfg.items[*].itemId itemId is a unique id among all menus that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate menus which may not be able to be removed properly.
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the menu.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the menu.  This property is only used if the xtype is ‘menu.’  ‘widgettool’ will not show text.
       * @param {Object} cfg.items[*].menu menu configuration object
       * @param {Object[]} cfg.items[*].menu.items an array of menu item configurations to add to the chrome.  See example for menu item configs
       * @param {String} cfg.items[*].menu.items[*].itemId itemId is a unique id among all menu items that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.
       * @param {String} cfg.items[*].menu.items[*].xtype xtype is used to specify the type of menu item to add.  This attribute should be omitted unless specifying a menuseparator. Setting this value to "menuseparator" adds a separator bar to a menu, used to divide logical groups of menu items. If specified, only xtype should be specified.  See example below for usage.
       * @param {String} cfg.items[*].menu.items[*].icon This property defines the URL of the image to be used for the menu item.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].menu.items[*].text This property defines text to appear for the menu item. 
       * @param {Function} cfg.items[*].menu.items[*].handler The handler attribute defines a function to be executed when the menu item is clicked. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function's parameter list contains the standard parameters for an Eventing callback function.
       * @param {Object} cfg.items[*].menu.items[*].menu sub-menu configuration object.  See example for sub-menu config.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.insertHeaderMenus({
       *             pos: 0,
       *             items: [{
       *			 itemId:'insertedMenu',
       *				icon: './themes/common/images/skin/exclamation.png',
       *				text: 'Inserted Menu',
       *				menu: {
       *					items: [
       *					    {
       *					    	itemId:'insertedMenuItem1',
       *					    	icon: './themes/common/images/skin/exclamation.png',
       *					    	text: 'Inserted Menu Item 1',
       *					    	handler: function(sender, data) {
       *					    		alert('You clicked the Inserted Menu menu item.');
       *					    	}
       *					    },
       *					    {
       *					    	xtype: 'menuseparator'
       *					    },
       *					    {
       *					    	itemId:'insertedMenuItem2',
       *					    	icon: './themes/common/images/skin/exclamation.png',
       *					    	text: 'Inserted Menu Item 2',
       *					    	handler: function(sender, data) {
       *					    		alert('You clicked the Inserted Menu menu item.');
       *					    	}
       *						},
       *						'-', // another way to add a menu separator 
       *						{
       *					    	itemId:'insertedMenuItem3',
       *					    	icon: './themes/common/images/skin/exclamation.png',
       *					    	text: 'Inserted Menu Item 3',
       *					    	handler: function(sender, data) {
       *					    		alert('You clicked the Inserted Menu menu item.');
       *					    	}
       *					    }
       *					]
       *				}
       *			}]
       *     });
       */
      insertHeaderMenus : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'insertHeaderMenus';
        data.type = 'menu';
        if (cfg.pos != null) {
          data.pos = cfg.pos;
        }
        data.items = items;
        for (var i = 0; i < items.length; i++) {
        	var item = items[i];
        	if (item.menu) {
	        	for (var j = 0 ; j < item.menu.items.length ; j++) {
	        		var menuItem = item.menu.items[j];
	        		if (!menuItem.menu) {
	        			// Regular menu item
	                	scope.items[menuItem.itemId != null ? menuItem.itemId : menuItem.id] = menuItem;
	        		} else {
	        			// Sub-menu 
	        			for (var k = 0 ; k < menuItem.menu.items.length ; k++) {
	        				var subMenuItem = menuItem.menu.items[k];
	                    	scope.items[subMenuItem.itemId != null ? subMenuItem.itemId : subMenuItem.id] = subMenuItem;
	        			}
	        		}
	        	}
        	} else {
    			// Regular menu item
            	scope.items[item.itemId != null ? item.itemId : item.id] = item;
        	}
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },

      /**
       * @description Removes existing menus on the Widget Chrome based on itemId.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of objects containing itemIds for the menus to remove from the chrome.
       *   See example below for button configs
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.removeHeaderMenus({
       *             items: [{
       *            	 itemId: 'regularMenu'
       *             }]
       *     });
       */
      removeHeaderMenus : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'removeHeaderMenus';
        data.type = 'menu';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          var id = items[i];
          if (scope.items[id] != null) {
            //delete saved data
            delete scope.items[id];
          }
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },
      
      /**
       * @description Lists all menus that have been added to the widget chrome.
       * @param {Object} cfg config object see below for properties
       * @param {Function} cfg.callback The function which receives the results.
       *
       * @example
       *    //this.wc is an already instantiated WidgetChrome obj
       *    this.wc.listHeaderMenus({
       *     callback: function(msg) {
       *         //msg will always be a json string
       *         var res = Ozone.util.parseJson(msg);
       *         if (res.success) {
       *             for (var i = 0; i < res.items.length; i++) {
       *             	// do something with the menus
       *             }
       *         }
       *     }
       *   });
       */
      listHeaderMenus: function(cfg) {
        var data = {
          action: 'listHeaderMenus',
          type: 'menu'
        };
        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      }

    };

    pub.init(config);
    Ozone.chrome.WidgetChrome.instance = pub;
  }
  return Ozone.chrome.WidgetChrome.instance;
};

/**
 *  @description Retrieves Ozone.chrome.WidgetChrome Singleton instance.  To do so it requires a widgetEventingController
 *  @param  {Object} config - config object with parameters
 *  @param  {Ozone.eventing.Widget} config.widgetEventingController - widget eventing object which handles eventing for the widget
 *  @example
 *    this.wc = Ozone.chrome.WidgetChrome.getInstance({
 *        widgetEventingController: this.widgetEventingController
 *    });
 *
 * @throws {Error} throws an error with a message if widget initialization fails
 */
Ozone.chrome.WidgetChrome.getInstance = function(cfg) {
  if (Ozone.chrome.WidgetChrome.instance == null) {
    Ozone.chrome.WidgetChrome.instance = new Ozone.chrome.WidgetChrome(cfg);
  }
  return Ozone.chrome.WidgetChrome.instance;
};



/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.dragAndDrop = Ozone.dragAndDrop ? Ozone.dragAndDrop : {};

/**
 * @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.dragAndDrop.WidgetDragAndDrop.getInstance</a>
 * @constructor
 * @param {Object} cfg config object see below for properties
 * @param {Object} [cfg.widgetEventingController]  The widgetEventingController.
 * @param {Boolean} [cfg.autoInit]  True to automatically call init(), False otherwise.  The default is True if left undefined
 * @param {Object} [cfg.callbacks]  Object with callbacks who's names match drag and drop events.  Alternatively one could
 * use the <a href="#addCallback">addCallback</a> function
 * @description The Ozone.dragAndDrop.WidgetDragAndDrop object manages the drag and drop for an individual widget.
 * @requires owfdojo which is a custom version of dojo for OWF
 * @requires <a href="Ozone.eventing.Widget.html">Ozone.eventing.Widget</a> for eventing
 * @see <a href="#addCallback">addCallback</a>
 * @example
 *
 * var wdd = new Ozone.dragAndDrop.WidgetDragAndDrop({
 *                   widgetEventingController: this.widgetEventingController
 *               });
 *
 */
Ozone.dragAndDrop.WidgetDragAndDrop = function(cfg) {

    this.listeners = {};
    this.callbacks = {};
    this.dragging = false;
    this.dropEnabledFlag = false;
    this.dropZoneHandlers = [];

    cfg = cfg || {};

    //set initial drag text
    this.dragIndicatorText = cfg.dragIndicatorText ? cfg.dragIndicatorText : 'Dragging Data';

    if (cfg.callbacks != null && owfdojo.isObject(cfg.callbacks)) {
      owfdojo.mixin(this.callbacks, cfg.callbacks)
    }

    //create drag indicator
    this.dragIndicator = this.createDragIndicator();
    this.dragIndicatorTextNode = owfdojo.query('span.ddText', this.dragIndicator)[0];

    this.widgetEventingController = cfg.widgetEventingController || Ozone.eventing.Widget.instance;

    if (cfg.keepMouseListenersAttached === undefined && owfdojo.isIE) {
        cfg.keepMouseListenersAttached = true;
    }

    if (cfg.autoInit || cfg.autoInit === undefined) {
        this.init(cfg);
    }

    function fireMouseEvent(el, type, msg) {
        var evt;
        if(document.createEvent) {
            evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(type, true, true, window, 1, 
                msg.screenX, msg.screenY, msg.pageX, msg.pageY, 
                false, false, false, false, null, null
            );
            el.dispatchEvent(evt);
        } else if( document.createEventObject ) {
            evt = document.createEventObject();
            el.fireEvent('on' + type, evt);
        }
    }

    gadgets.rpc.register('_fire_mouse_move', owfdojo.hitch(this, function(msg) {

        var el = document.elementFromPoint(msg.pageX, msg.pageY);

        if(this.getFlashWidgetId()) {
            if(msg.sender !== this.widgetEventingController.getWidgetId()) {
                Ozone.util.getFlashApp().dispatchExternalMouseEvent(msg.pageX, msg.pageY);
            }
            this.mouseMove(msg, true);
        }
        else {
            if(!arguments.callee.lastEl) {
                arguments.callee.lastEl = el;
                fireMouseEvent(el, 'mouseover', msg);
            }
            else if(arguments.callee.lastEl !== el) {
                //console.log('lastEl ', arguments.callee.lastEl);
                //console.log('el ', el);
                fireMouseEvent(arguments.callee.lastEl, 'mouseout', msg);
                fireMouseEvent(el, 'mouseover', msg);
                arguments.callee.lastEl = el;
            }

            fireMouseEvent(el, 'mousemove', msg);
        }

    }));

    gadgets.rpc.register('_fire_mouse_up', owfdojo.hitch(this, function(msg) {
        var el = document.elementFromPoint(msg.pageX, msg.pageY);
        if(el && el.nodeName === 'OBJECT') {
            this.mouseUp(msg, true);
        }
        else {
            fireMouseEvent(el, 'mouseup', msg);
        }
    }));

    Ozone.dragAndDrop.WidgetDragAndDrop.instance = this;
    return this;
};

Ozone.dragAndDrop.WidgetDragAndDrop.prototype = {

  //public events
  /**
   * @field
   * @description dragStart is the name of the event when a drag is started.  Use 'dragStart' with the addCallback function
   * to add a callback function when a dragStart event occurs
   * @see <a href="#addCallback">addCallback</a>
   * @example
   *
   *  //this.wdd is a initialized WidgetDragAndDrop object
   *  this.wdd.addCallback('dragStart',function() {
   *    //use this function to change styles or change state when a drag is initiated
   *    cmp.dragging = true;
   *    cmp.getView().scroller.addCls('ddOver');
   *  });
   *
   */
  dragStart: 'dragStart',

  /**
   * @field
   * @description dragStop is the name of the event when a drag is stopped.  Use 'dragStop' with the addCallback function
   * to add a callback function when a dragStop event occurs
   * @see <a href="#addCallback">addCallback</a>
   * @example
   *
   *  //this.wdd is a initialized WidgetDragAndDrop object
   *  this.wdd.addCallback('dragStop',function() {
   *    //use this function to change styles or change state when a drag is stopped
   *    cmp.dragging = false;
   *    cmp.getView().scroller.removeCls('ddOver');
   *  });
   *
   */
  dragStop: 'dragStop',

  /**
   * @field
   * @description dropReceive is the name of the event when a drop occurs on this widget.  This event indicates a successful
   * drag and drop and data will be passed to the callback function.  Use 'dropReceive' with the addCallback function
   * to add a callback function when a dropReceive event occurs.  This callback function for this event will be called for
   * all successful drops.  To support multiple drop zones use <a href="#addDropZoneHandler">addDropZoneHandler</a>
   * @see <a href="#addCallback">addCallback</a>
   * @example
   *
   *  //this.wdd is a initialized WidgetDragAndDrop object
   *   this.wdd.addCallback('dropReceive',function(msg) {
   *      //msg.dragDropData contains the data - this example the data is a channel name that will be subscribed to
   *      this.subscribeToChannel(msg.dragDropData);
   *   }.bind(this));
   */
  dropReceive: 'dropReceive',

  //private events
  dragStartName: '_dragStart',
  dragOverWidgetName: '_dragOverWidget',
  dragOutName: '_dragOutName',
  dragStopInContainerName: '_dragStopInContainer',
  dragStopInWidgetName: '_dragStopInWidget',
  dragSendDataName: "_dragSendData",
  dropReceiveDataName: "_dropReceiveData",

  /**
   * @field
   * @description version number
   */
  version: Ozone.version.owfversion + Ozone.version.dragAndDrop,

  /**
   * @description Initializes the WidgetDragAndDrop object.  Using this function is only required if autoInit config is false
   * in the constructor.  This function is sometimes useful when it is necessary to defer drag and drop event handling after
   * creating the Ozone.dragAndDrop.WidgetDragAndDrop object
   * @param {Object} [cfg] config object
   * @see <a href="#constructor">constructor</a>
   */
  init : function (cfg) {
    cfg = cfg || {};

    //subscribe to channels
    this.widgetEventingController.subscribe(this.dragStartName, owfdojo.hitch(this, this.onStartDrag));
    this.widgetEventingController.subscribe(this.dragOutName, owfdojo.hitch(this, this.onDragOut));
    this.widgetEventingController.subscribe(this.dragStopInContainerName, owfdojo.hitch(this, this.onDragStopInContainer));
    this.widgetEventingController.subscribe(this.dropReceiveDataName, owfdojo.hitch(this, this.dropReceiveData));

    if (cfg.keepMouseListenersAttached === true) {
      this.keepMouseListenersAttached = true;

      //hook mouse move and mouse up
      if (this.listeners.onmousemove == null) {
        this.listeners.onmousemove = owfdojo.connect(document, 'onmousemove', this, this.mouseMove);
      }
      if (this.listeners.onmouseup == null) {
        this.listeners.onmouseup = owfdojo.connect(document, 'onmouseup', this, this.mouseUp);
      }
    }
  },

  /**
   * @private
   */
  createDragIndicator: function () {
    return owfdojo.create('span', {
      className: 'ddBox ddBoxCannotDrop',
      style: {display: 'none'},
      innerHTML: '<span class="ddText">' + this.dragIndicatorText + '</span>'
    },
    owfdojo.body()
    );
  },

  /**
   * @description Starts a drag.  The config object passed in describes the drag and contains the data to be passed to the drop.
   * @param {Object} cfg config object see below
   * @param {String} cfg.dragDropLabel Name to be used as text for the dragDrop indicator
   * @param {Object} cfg.dragDropData Data to be sent on a successful drag and drop.  This property is only sent to the
   * successful recipient of the drag (the dropReceive event).  It will not be sent for other events.
   * @param {Object} cfg.dragZone dom node which presents a dragZone which is associated with this drag.  This property is
   * only saved and used locally to the widget to identify whether a dragZone is in fact the node as a dropZone.  It will not be
   * sent to other events callbacks.
   * @param {Object} cfg.* other custom properties may be specified, these will be passed along to event handlers
   * @example
   *
   *  //add handler to text field for dragging
   *  owfdojo.connect(document.getElementById('dragSource'),'onmousedown',this,function(e) {
   *      e.preventDefault();
   *      var data = document.getElementById('InputChannel').value;
   *      if (data != null && data != '') {
   *        this.wdd.doStartDrag({
   *            dragDropLabel: data,
   *            dragZone:  document.getElementById('dragZone'),
   *            dragDropGroup: 'location',  //extra property to pass along
   *            dragDropData: data
   *        });
   *      }
   *  });
   */
  doStartDrag : function (cfg) {

    var dragStartCfg = {
      dragSourceId: this.widgetEventingController.getWidgetId()
    };

    this.dragZone = cfg.dragZone;

    //allow caller to pass extra properties to dragStart
    //be sure to not send the dragDropData
    owfdojo.mixin(dragStartCfg,cfg);
    delete dragStartCfg.dragDropData;
    delete dragStartCfg.dragZone;

    //start drag
    this.onStartDrag(this.widgetEventingController.getWidgetId(),dragStartCfg);

    //send message to start dragging for other widgets - unsubscribe so we don't repeat onstartdrag
    this.widgetEventingController.unsubscribe(this.dragStartName);
    this.widgetEventingController.publish(this.dragStartName, dragStartCfg);
    this.widgetEventingController.subscribe(this.dragStartName, owfdojo.hitch(this, this.onStartDrag));

    //send data to container
    this.widgetEventingController.publish(this.dragSendDataName, owfdojo.mixin({
      dragSourceId: this.widgetEventingController.getWidgetId()
    },cfg),'..');

  },

  /**
   * @private
   */
  onStartDrag : function(sender, msg) {

    this.dragging = true;

    this.dragStartData = msg;

    if (owfdojo.isFunction(this.callbacks[this.dragStart])) {
      //execute callback if false is returned don't continue
      if (this.callbacks[this.dragStart](sender,msg) === false) {
        this.dragging = false;
        return;
      }
    }

    //prevent IE bug where text is dragged instead of the node
    if (owfdojo.isIE) {
      document.onselectstart = function() {
        return false;
      };
      document.ondragstart = function () {
        return false;
      };
    }

    this.dragIndicatorText = msg.dragDropLabel;
    this.dragIndicatorTextNode.innerHTML = this.dragIndicatorText;

    //hook mouse move and mouse up
    if (this.listeners.onmousemove == null) {
      this.listeners.onmousemove = owfdojo.connect(document, 'onmousemove', this, this.mouseMove);
    }
    if (this.listeners.onmouseup == null) {
      this.listeners.onmouseup = owfdojo.connect(document, 'onmouseup', this, this.mouseUp);
    }
  },

  /**
   * @private
   */
  onDragOut : function(sender, msg) {
    owfdojo.style(this.dragIndicator, {
      display: 'none'
    });
  },

  /**
   * @private
   */
  getMouseCoordinates: function (e) {
    var returnValue = null;
    if (e.pageX || e.pageY) {
      returnValue = {
        x : e.pageX,
        y : e.pageY
      };
    }
    else {
      returnValue = {
        x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
        y : e.clientY + document.body.scrollTop - document.body.clientTop
      };
    }
    return returnValue;
  },

    /**
    * @private
    */
    mouseMove : function (e, fake) {
        //only show the indicator if we are currenlty dragging
        if (this.dragging === true) {

            // if this is a flex widget, event is not faked and current dashboard layout is tabbed, fake 
            // mouse events as soon as the drag starts
            if(this.getFlashWidgetId() && fake !== true && Ozone.Widget.getDashboardLayout() === 'tabbed') {
                 gadgets.rpc.call('..', '_fake_mouse_move', null, {
                    sender: this.widgetEventingController.getWidgetId(),
                    pageX: e.pageX,
                    pageY: e.pageY,
                    screenX: e.screenX,
                    screenY: e.screenY
                });
                return;
            }

            var clientWidth = null;
            var clientHeight = null;
            var mousePosition = this.getMouseCoordinates(e);
            var leftWidth = mousePosition.x;
            var topHeight = mousePosition.y;

            // Hide the drag indicator box while we move it
            owfdojo.style(this.dragIndicator, {
                display: 'none'
            });

            if (e === undefined) {
                e = window.event;
            }

            if (owfdojo.isIE) {
                clientWidth = document.body.clientWidth;
                clientHeight = document.body.clientHeight;
            }
            else {
                clientWidth = window.innerWidth;
                clientHeight = window.innerHeight;
            }

            if((owfdojo.isFF && owfdojo.isFF >= 4) || this.getFlashWidgetId()) {

                if(e.clientX < 0 || e.clientX > clientWidth || 
                    e.clientY < 0 || e.clientY > clientHeight) {

                    // set variable on function to keep track if we faked an event
                    // so that we can fake mouseout later when mouseover the current widget
                    if(!arguments.callee._fakeEventCounter)
                        arguments.callee._fakeEventCounter = 1;
                    else
                        arguments.callee._fakeEventCounter += 1;
                    
                    gadgets.rpc.call('..', '_fake_mouse_move', null, {
                        sender: this.widgetEventingController.getWidgetId(),
                        pageX: e.pageX,
                        pageY: e.pageY,
                        screenX: e.screenX,
                        screenY: e.screenY
                    });
                    return;
                }
                else if( arguments.callee._fakeEventCounter ) {
                    // we had faked a mousemove event before
                    // now fake mouseout event on the container
                    arguments.callee._fakeEventCounter = null;
                    gadgets.rpc.call('..', '_fake_mouse_out');
                }
            }

            // flipping mechanism when the cursor reaches the right or bottom edge of the widget
            this.dragIndicator.style.top = topHeight + 19 + "px";

            var rightLimit = clientWidth - 100;
            if ((leftWidth < clientWidth) && (leftWidth > rightLimit)) {
                this.dragIndicator.style.left = leftWidth - 88 + "px";
            }
            else {
                this.dragIndicator.style.left = leftWidth + 12 + "px";
            }
            var bottomLimit = clientHeight - 40;
            if ((topHeight > bottomLimit) && (topHeight < clientHeight)) {
                this.dragIndicator.style.top = topHeight - 30 + "px";
            }

            // set text on indicator
            this.dragIndicatorTextNode.innerHTML = this.dragIndicatorText;
            owfdojo.style(this.dragIndicator, {
                display: 'block'
            });

        }
    },

  /**
   * @private
   */
  onDragStopInContainer : function(sender, msg) {
    owfdojo.style(this.dragIndicator, {
      display: 'none'
    });
    //disconnect listeners
    if (!this.keepMouseListenersAttached) {
      for (l in this.listeners) {
        owfdojo.disconnect(this.listeners[l]);
        this.listeners[l] = null;
      }
    }

    this.dragging = false;
    this.dragStartData = null;
    this.dragZone = null;
    this.setDropEnabled(false);

    if (owfdojo.isFunction(this.callbacks[this.dragStop])) {
      this.callbacks[this.dragStop](this.dropTarget);
    }
  },

  /**
   * @private
   */
  mouseUp : function (e, fake) {
    if (this.dragging === true) {
      this.dragging = false;

      //prevent IE bug where text is dragged instead of the node
      if (owfdojo.isIE) {
        document.onselectstart = function() {
          return true;
        };
        document.ondragstart = function () {
          return true;
        };
      }

      owfdojo.style(this.dragIndicator, {
        display: 'none'
      });

      if(this.getFlashWidgetId()) {

          var clientWidth = null;
          var clientHeight = null;
          if (owfdojo.isIE) {
              clientWidth = document.body.clientWidth;
              clientHeight = document.body.clientHeight;
          }
          else {
              clientWidth = window.innerWidth;
              clientHeight = window.innerHeight;
          }

          if((e.clientX < 0 || e.clientX > clientWidth || 
                e.clientY < 0 || e.clientY > clientHeight
                || Ozone.Widget.getDashboardLayout() === 'tabbed')
                && fake !== true) {
              
              gadgets.rpc.call('..', '_fake_mouse_up', null, {
                  sender: this.widgetEventingController.getWidgetId(),
                  pageX: e.pageX,
                  pageY: e.pageY,
                  screenX: e.screenX,
                  screenY: e.screenY
              });
              return;
          }
      }

      //disconnect listeners
      for (l in this.listeners) {
        owfdojo.disconnect(this.listeners[l]);
        this.listeners[l] = null;
      }

      //save dropzone info
      this.dropTarget = e.target;

      //send message
      this.widgetEventingController.publish(this.dragStopInWidgetName, this.widgetEventingController.getWidgetId());

  //    if (owfdojo.isFunction(this.callbacks[this.dragStop])) {
  //      this.callbacks[this.dragStop](this.dropTarget);
  //    }
      }
  },

  /**
   * @private
   */
  dropReceiveData : function (sender, msg, channel) {

    //only if the mouse is over a drop zone
    if (this.dropEnabledFlag) {
      if (this.dropTarget) {
        msg.dropTarget = this.dropTarget;

        //find if we have any dropzone handlers for the dropzone used and execute
        for (var i = 0; i < this.dropZoneHandlers.length; i++) {
          //match either on id or class or is target node a child of the dropZone
          //also make sure the dropZone is not the same as the dragZone
          if (((this.dropTarget.id == this.dropZoneHandlers[i].id && this.dropTarget.id != null)
                  || (owfdojo.hasClass(this.dropTarget, this.dropZoneHandlers[i].className))
                  || (owfdojo.isDescendant(this.dropTarget, this.dropZoneHandlers[i].dropZone)))
                  && this.dragZone != this.dropZoneHandlers[i].dropZone
                  ) {
            this.dropZoneHandlers[i].handler(msg);
          }
        }

        //clear dropTarget because the drop is over
        this.dropTarget = null;
      }

      //notify that a drop has happened and send the data
      if (owfdojo.isFunction(this.callbacks[this.dropReceive])) {
        this.callbacks[this.dropReceive](msg);
      }
    }
  },

  /**
   * @description Adds a function as a callback to Drag and Drop events.  This function supports multiple callbacks for
   * the same event by allowing the user call it more than once with different callback functions
   * @param {String} eventName The event name.
   * @param {Function} cb The function to execute as a callback.
   * @see <a href="#dragStart">dragStart Event</a> -
   * the callback for the dragStart event is called with the same config object used in the <a href="#doStartDrag">doStartDrag</a> function
   * with the exception of the dragDropData and the dragZone properties.
   * @see <a href="#dragStop">dragStop Event</a> -
   * If the drag stopped in the same widget that started the drag the callback for dragStop will be called with the dropTarget
   * HTML node otherwise the first argument will be null.
   * @see <a href="#dropReceive">dropReceive Event</a> -
   * the callback for the dropReceive event is called for any drop that occurs on a widget.  If one has multiple dropZones
   * in a widget it is easier to use <a href="#addDropZoneHandler">addDropZoneHandler</a>
   * @example
   * //example dragStart handler which highlights an Ext Grid when a drag occurs
   * this.wdd.addCallback('dragStart', (function(sender, msg){
   *      //get the Ext Grid
   *      var grid = this.getComponent(this.gridId);
   *
   *      //check custom dragDropGroup property to see if the drag is meant for this grid
   *      //if so highlight the grid by adding the ddOver class
   *      if (grid && msg != null && msg.dragDropGroup == 'users') {
   *          grid.getView().scroller.addClass('ddOver');
   *      }
   *  }).createDelegate(this));  //createDelegate is an Ext function which sets the scope
   *
   *  //this.wdd is a initialized WidgetDragAndDrop object
   *   this.wdd.addCallback('dropReceive',owfdojo.hitch(this,function(msg) {
   *      //msg.dragDropData contains the data
   *      //this example the data is a channel name that will be subscribed to
   *      this.subscribeToChannel(msg.dragDropData);
   *   }));
   */
  addCallback : function(eventName, cb) {

    if (this.callbacks[eventName] == null) {
      //put dummy function in
      this.callbacks[eventName] = cb;
    }
    else {
      //callback already exists chain the subsequent callbacks to the first
      owfdojo.connect(this.callbacks,eventName,cb);
    }
  },
  /**
   * @description Adds a new drop zone to be managed.  The handler function defined in the cfg object will be called when
   * a drop occurs over a dom node which matches the id or the className or is equal to or a child of the dropTarget node
   * @see doStartDrag
   * @param {Object} cfg config object see below
   * @param {className} cfg.class class of the dropZone
   * @param {String} cfg.id Id of the dropZone
   * @param {Node} cfg.dropZone HTML node which represents the dropZone
   * @param {Function} cfg.handler function to be called when a drop occurs over the dropZone.  A msg object will be passed in
   *
   * @example
   * //Example cfg Object
   * {
   *  id: 'mygrid-1',
   *  className: 'mygridClass',
   *  dropZone: document.getElementById('dropZone'),
   *  handler: function(msg) {
   *    //some code here to handle the msg and respond
   *  }
   * }
   *
   * //Example usage of addDropZoneHandler which handles a drop that occurs over an Ext Grid and inserts new data into
   * //that grid based on the dragged data
   * //this.wdd is the WidgetDragAndDrop Object
   * this.wdd.addDropZoneHandler({
   *   //dom node of an Ext grid
   *   dropZone:grid.getView().scroller.dom,
   *
   *   //this function is called only when a drop occurs over the grid (i.e. the mouse was released over the grid)
   *   handler: (function(msg){
   *
   *     var store = grid.getStore();
   *     var processedSelections = [];
   *     var errorMsg = null;
   *
   *     //loop through msg.dragDropData which is an array and check for dupes versus the destination store
   *     for (var i = 0; i < msg.dragDropData.length; i++) {
   *       //get data for one possible new record in the dragDropData
   *       var recData = msg.dragDropData[i];
   *
   *       //is it already in the dest Ext Store?
   *       if (store.findExact('id',recData.id) >= 0) {
   *         //found the record already in the store
   *       }
   *       else {
   *         //add new record based on the dragDropData
   *         var newRec = new store.recordType(recData);
   *         //calling an external function to decide whether to add the new rec
   *         var rs = displayPanel.validateRecordOnAdd(newRec);
   *         if (rs.success) {
   *           processedSelections.push(newRec);
   *         }
   *         else {
   *           errorMsg = rs.msg;
   *         }
   *       }
   *     }
   *
   *     if (errorMsg) {
   *       Ext.Msg.alert('Error', errorMsg);
   *     }
   *
   *     //actually insert into the store which adds it the new recs to the grid
   *     if (processedSelections.length > 0) {
   *       store.insert(0, processedSelections);
   *     }
   *
   * }).createDelegate(grid)});   //createDelegate is an Ext function which sets the scope of the callback
   *
   *
   */
  addDropZoneHandler: function(cfg) {
    this.dropZoneHandlers.push(cfg)
  },
  /**
   * @description returns whether the a drop is enabled (this is only true when the mouse is over a drop zone)
   */
  getDropEnabled : function() {
    return this.dropEnabledFlag;
  },

  /**
   * @description returns whether a drag is in progress
   */
  isDragging : function() {
    return this.dragging;
  },

  /**
   * @description returns data sent when a drag was started
   */
  getDragStartData : function() {
    return owfdojo.mixin(this.dragStartData,{dragZone:this.dragZone});
  },

  /**
   * @description toggles the dragIndicator to indicate successful or unsuccessful drop
   * @param {Boolean} dropEnabled true to enable a drop, false to indicate a unsuccessful drop
   * @example
   *
   *  //attach mouseover callback to a particular area. If the mouse is here allow a drop
   *  cmp.getView().scroller.on('mouseover',function(e,t,o) {
   *    if (cmp.dragging) {
   *      this.wdd.setDropEnabled(true);
   *    }
   *  },this);
   *
   *  //attach a mouse out callback to a particular area. If the mouse leaves disable drop
   *  cmp.getView().scroller.on('mouseout',function(e,t,o) {
   *    if (cmp.dragging) {
   *      this.wdd.setDropEnabled(false);
   *    }
   *  },this);
   */
  setDropEnabled : function(dropEnabled) {
    if (dropEnabled) {
      this.dropEnabledFlag = true;
      owfdojo.removeClass(this.dragIndicator, 'ddBoxCannotDrop');
      owfdojo.addClass(this.dragIndicator, 'ddBoxCanDrop');
    }
    else {
      this.dropEnabledFlag = false;
      owfdojo.removeClass(this.dragIndicator, 'ddBoxCanDrop');
      owfdojo.addClass(this.dragIndicator, 'ddBoxCannotDrop');
    }
  },

  setFlashWidgetId: function(id) {
    this.flashWidgetId = id;
  },

  getFlashWidgetId: function(id) {
    return this.flashWidgetId;
  }
};

/**
 * @description Retrieves Ozone.dragAndDrop.WidgetDragAndDrop Singleton instance. Manages the drag and drop for an individual widget.
 * @param {Object} cfg config object see below for properties
 * @param {Object} [cfg.widgetEventingController]  The widgetEventingController
 * @param {Boolean} [cfg.autoInit]  True to automatically call init(), False otherwise.  The default is True if left undefined
 * @param {Object} [cfg.callbacks]  Object with callbacks who's names match drag and drop events.  Alternatively one could
 * use the <a href="#addCallback">addCallback</a> function
 * @requires owfdojo which is a custom version of dojo for OWF
 * @requires <a href="Ozone.eventing.Widget.html">Ozone.eventing.Widget</a> for eventing
 * @see <a href="#addCallback">addCallback</a>
 * @example
 *
 * var wdd = Ozone.dragAndDrop.WidgetDragAndDrop.getInstance({
 *                   widgetEventingController: this.widgetEventingController
 *               });
 *
 */
Ozone.dragAndDrop.WidgetDragAndDrop.getInstance = function(cfg) {
  if (Ozone.dragAndDrop.WidgetDragAndDrop.instance == null) {
    Ozone.dragAndDrop.WidgetDragAndDrop.instance = new Ozone.dragAndDrop.WidgetDragAndDrop(cfg);
  }
  return owfdojo.mixin(Ozone.dragAndDrop.WidgetDragAndDrop.instance, cfg);
};


/**
 * @namespace
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.launcher = Ozone.launcher ? Ozone.launcher : {};

(function() {

    var launchChannelName = "_WIDGET_LAUNCHER_CHANNEL";

    /**
     *  @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.launcher.WidgetLauncher.getInstance</a>
     *  @constructor  widgetEventingController - Ozone.eventing.Widget object
     *  @param  {Ozone.eventing.Widget} [widgetEventingController] - widget eventing object which handles eventing for the widget
     *  @description This object is used launch other widgets.  To do so it requires a widgetEventingController
     *
     */
    Ozone.launcher.WidgetLauncher = function() {
        if (Ozone.launcher.WidgetLauncher.instance == null) {
            this.version = Ozone.version.owfversion + Ozone.version.widgetLauncher

            Ozone.launcher.WidgetLauncher.instance = this;
        }

        return Ozone.launcher.WidgetLauncher.instance;
    };

    Ozone.launcher.WidgetLauncher.prototype = {

      /**
       * @description launches a Widget based on the config
       * @param {Object} config object see example for structure
       * @param {Function} callback a function to be called once after the launchWidget is executed
       *
       * @example
       *
       * //Example for launching a widget
       * var widgetEventingController = Ozone.eventing.Widget.getInstance();
       * var widgetLauncher = Ozone.launcher.WidgetLauncher.getInstance(this.widgetEventingController);
       * var data = {
       *   channel: channel,
       *   message: message
       * };
       * var dataString = Ozone.util.toString(data);
       * widgetLauncher.launchWidget({
       *     universalName: <universal name of widget to launch>,  //universalName or guid maybe identify the widget to be launched
       *     guid: <guid of widget to launch>,
       *     launchOnlyIfClosed: true, //if true will only launch the widget if it is not already opened.
       *                               //if it is opened then the widget will be restored
       *     data: dataString  //initial launch config data to be passed to a widget only if the widget is opened.  this must be a string
       * });
       *
       */
        launchWidget: function(config,callback) {
            //send message to launch a widget
            var jsonString = gadgets.json.stringify(config);
            gadgets.rpc.call('..', launchChannelName, callback, OWF.getIframeId(), jsonString);
        }
    };

    /**
     *  @constructor none
     *  @description Utility functions for a widget that has been launched
     *
     */
    Ozone.launcher.WidgetLauncherUtils = {
      /**
       * @description gets initial launch config data for this widget if it was just launched
       * @returns {Object} data object which contains initial information for the widget 
       * @example
       *
       * var launchConfig = Ozone.launcher.WidgetLauncherUtils.getLaunchConfigData();
       * if (launchConfig != null) {
       *   var data = Ozone.util.parseJson(launchConfig);  //in this example the data object has two fields: channel and message
       *   if (data != null) {
       *       //do something with the data
       *       scope.subscribeToChannel(data.channel);
       *       scope.addToGrid(null,data.message,data.channel);
       *   }
       * }
       *
       */
        getLaunchConfigData: function() {
            var launchConfig = null;

            //check for data in window.name
            var configParams = Ozone.util.parseWindowNameData();
            if (configParams != null) {

                //get launchConfig
                launchConfig = configParams.data;
            }

            return launchConfig;
        }
    };

    /**
     *  @description Retrieves Ozone.eventing.Widget Singleton instance. This object is used launch other widgets.
     *  @example
     *  this.widgetLauncher = Ozone.launcher.WidgetLauncher.getInstance(this.widgetEventingController);
     */
    Ozone.launcher.WidgetLauncher.getInstance = function() {
        if (Ozone.launcher.WidgetLauncher.instance == null) {
            Ozone.launcher.WidgetLauncher.instance = new Ozone.launcher.WidgetLauncher();
        }
        return Ozone.launcher.WidgetLauncher.instance;
    };

}());

/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.state = Ozone.state ? Ozone.state : {};

/**
 *  @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.state.WidgetStateHandler.getInstance</a>
 *  @constructor  WidgetStateHandler - Handles eventing from OWF widget to OWF container
 *  @param  {Ozone.eventing.Widget} widgetEventingController - widget eventing object which handles eventing for the widget
 *  @description This object is used handle widget requests.  To do so it requires a widgetEventingController
 *
 */
Ozone.state.WidgetStateHandler = function(widgetEventingController) {
  if (Ozone.state.WidgetStateHandler.instance == null) {
    this.stateChannelName = "_WIDGET_STATE_CHANNEL_";
    this.widgetEventingController = widgetEventingController || Ozone.eventing.Widget.instance;
    this.widgetIdJSON = Ozone.util.parseJson(this.widgetEventingController.getWidgetId());
    this.version = Ozone.version.owfversion + Ozone.version.widgetStateHandler

    Ozone.state.WidgetStateHandler.instance = this;
  }

  return Ozone.state.WidgetStateHandler.instance;
};

Ozone.state.WidgetStateHandler.prototype = {

  /**
   * @description handles a widget state request based on the config
   * @param {Object} config object see example for structure
   * @param {Function} callback a function to be called once after the stateWidget is executed
   *
   * @example
   *
   * //Example for closing a widget
   * var widgetEventingController = new Ozone.eventing.Widget(Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html');
   * var widgetStateHandler = new Ozone.state.WidgetStateHandler(this.widgetEventingController);
   * widgetStateHandler.handleStateRequest({
   *     fn: 'closeWidget',
   *     params: {
   *     	guid: <widgetGuid>
   *     }
   * });
   *
   */
	handleWidgetRequest: function(config, callback) {

		//send state request to a widget
		var stateChannel = this.stateChannelName + this.widgetIdJSON.id;
	    gadgets.rpc.call('..', stateChannel, callback, this.widgetIdJSON, config);	
	}
};

/**
 *  @description Retrieves Ozone.eventing.Widget Singleton instance.
 *    This object is used handle widget requests.  To do so it requires a widgetEventingController
 *  @param  {Ozone.eventing.Widget} widgetEventingController - widget eventing object which handles eventing for the widget
 *  @example
 *  this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance(this.widgetEventingController);
 */
Ozone.state.WidgetStateHandler.getInstance = function(widgetEventingController) {
  if (Ozone.state.WidgetStateHandler.instance == null) {
    Ozone.state.WidgetStateHandler.instance = new Ozone.state.WidgetStateHandler(widgetEventingController);
  }
  return Ozone.state.WidgetStateHandler.instance;
};

/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.state = Ozone.state ? Ozone.state : {};

/**
 * @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.state.WidgetState.getInstance</a>

 * @constructor
 * @param {Object} [cfg] config object see below for properties
 * @param {String} [cfg.widgetEventingController]  The widgetEventingController
 * @param {Boolean} [cfg.autoInit] Whether or not to automatically start listening to the state channel.  Default is true.
 * @param {String} [cfg.widgetGuid]  The guid of the widget to monitor. Default is itself.
 * @param {String} [cfg.onStateEventReceived]  The callback function when an event is received.
 * @description The Ozone.state.WidgetState object manages the two-way communication between an OWF widget and its OWF Container.
 * @requires <a href="Ozone.eventing.Widget.html">Ozone.eventing.Widget</a> for eventing
 * @example
 *
 * var widgetState = new Ozone.state.WidgetState({
 *     onStateEventReceived: function(sender, msg) {
 *     		// do something
 *     }
 * });
 *
 */
Ozone.state.WidgetState = function(cfg) {

  if (Ozone.state.WidgetState.instance == null) {

	var STATE_EVENT_CHANNEL_NAME_prefix = "_WIDGET_STATE_CHANNEL_";

    cfg = cfg || {};

	// initialize the state handling
    this.widgetEventingController = cfg.widgetEventingController || Ozone.eventing.Widget.instance;
	this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance(this.widgetEventingController);
	this.widgetIdJSON = Ozone.util.parseJson(this.widgetEventingController.getWidgetId());
	this.widgetGuid = cfg.widgetGuid ? cfg.widgetGuid : this.widgetIdJSON.id;
    this.stateChannel = STATE_EVENT_CHANNEL_NAME_prefix + this.widgetGuid;
	this.onStateEventReceived = cfg.onStateEventReceived ? cfg.onStateEventReceived : this.onStateEventReceived;
	
	if (cfg.autoInit !== false) {
		this.init();
	}

     Ozone.state.WidgetState.instance = this;
  }

  return Ozone.state.WidgetState.instance;
};

Ozone.state.WidgetState.prototype = {
	/**
	 * @field
	 * @description version number
	 */
	version: Ozone.version.owfversion + Ozone.version.state,

	/**
     * @description Initializes the WidgetState object.  Using this function is only required if autoInit config is false
     * in the constructor.  This function is sometimes useful when it is necessary to defer event handling after
     * creating the Ozone.state.WidgetState object
     * @param {Object} [cfg] config object
     * @see <a href="#constructor">constructor</a>
     */
	init : function () {
		this.widgetEventingController.subscribe(this.stateChannel, this.onStateEventReceived);
//		this.widgetEventingController.registerHandler(this.stateChannel, this.onStateEventReceived);
	},
	
	/**
	 * @description The default callback function when an event is received. 
	 */
	onStateEventReceived: function () {
		return true;
	},
	
	getStateChannel: function () {
		return this.stateChannel;
	},

	/**
	 * @description Gets current widget state.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose state should be retrieved. Defaults to current widget guid.
     * @param {Function} [cfg.callback] Function to be called once after the state is retrieved.
     * This method will be passed the state object which has following properties. <br>
     * <br>
     *     {String} name: name of the widget <br>
     *     {Number} x: x-coordinate value of the top left corner of the widget<br>
     *     {Number} y: y-coordinate value of the top left corner of the widget<br>
     *     {Number} width: width of the widget <br>
     *     {Number} height: height of the widget <br>
     *     {Boolean} active: true if the widget is active, or else false. This property is applicable for desktop layout only. <br>
     *     {Boolean} maximized: true if the widget is maximized, or else false <br>
     *     {Boolean} minimized: true if the widget is minimized, or else false <br>
     *     {Boolean} collapsed: true if the widget is collapsed, or else false <br>
     *     {Boolean} singleton: true if the widget is singleton, or else false <br>
     *     {Boolean} pinned: true if the widget is pinned, or else false <br>
     *     {String} uniqueId: unique id of the widget <br>
     *     {String} widgetGuid: guid of the widget <br>
     *     {String} paneGuid: guid of the pane <br>
     *     {String} dashboardGuid: guid of the dashboard the widget is opened on <br>
     *     {String} region: region of the widget. This property is applicable for accordion layout only. Possible values for accordion layout are "accordion", "center" and "south". In other layouts, its value is "none". <br>
     *     {Number} columnPos: column the widget is opened in. This property is applicable for portal layout only. Possible values for portal layout are 0, 1 and 2. In other layouts, its value is 0. <br>
     *     {Number} zIndex: z-index of the widget. <br>
	 *
	 * @example
	 *
	 * widgetState.getWidgetState({
     *     callback: function(state) {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	getWidgetState: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "getWidgetState",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Gets registered widget state events
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be retrieved. Defaults to current widget guid.
     * @param {Function} [cfg.callback] Function to be called once after the stateWidget is executed.
	 *
	 * @example
	 *
	 * widgetState.getRegisteredStateEvents({
	 *     callback: function(events) {
	 *     		for (var i = 0; i < events.length; i++) {
	 *     			// Do something
	 *     		}
	 *     }
	 * });
	 *
	 */
	getRegisteredStateEvents: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "getWidgetStateEvents",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
    /**
     * @description Activates a widget.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget to activate. Defaults to current widget's guid.
     * @param {Function} [cfg.callback] Function to be called once after the widget has been activated.
     * This function is passed back the following parameters. <br>
     * <br>
     *          {Boolean} result: true if the widget has been activated, or else false.
     *
     * @example
     *
     * widgetState.activateWidget({
     *     guid: "GUID_OF_A_WIDGET",
     *     callback: function(result) {
     *     		// Do something
     *     }
     * });
     *
     */
    activateWidget: function(cfg) {
        cfg = cfg ? cfg : {};

        var config = {
            fn: "activateWidget",
            params: {
                guid: cfg.guid ? cfg.guid : this.widgetGuid
            }
        };
        this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
    },

	/**
	 * @description Closes a widget.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget to close. Defaults to current widget's guid.
     * @param {Function} [cfg.callback] Function to be called once after the widget is closed. Only use this if the widget is not closing itself.
     * This function is passed back the following parameters. <br>
     * <br>
     *          {Boolean} result: true if the widget has been closed, or else false.
	 *
	 * @example
	 *
	 * widgetState.closeWidget({
     *     guid: "GUID_OF_A_WIDGET",
     *     callback: function(result) {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	closeWidget: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "closeWidget",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Adds custom state event handlers to listen to widget events.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be monitored. Defaults to current widget guid.
     * @param {Array} [cfg.events] Array of events. If no event is provided this method will add listeners to all registered events.
     * @param {Function} [cfg.callback] Function to be called once after the listener is added.
	 *
	 * @example
	 *
	 * widgetState.addStateEventListeners({
	 * 	   events: ['beforeclose','maximize'],
	 *     callback: function() {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	addStateEventListeners: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "addStateEventListeners",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid,
				events: cfg.events
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Removes custom state event listeners from a widget.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be monitored. Defaults to current widget guid.
     * @param {Array} [cfg.events] Array of events. If no event is provided this method will remove only custom listeners from all registered events.
     * @param {Function} [cfg.callback] Function to be called once after the listener is removed.
	 *
	 * @example
	 *
	 * widgetState.removeStateEventListeners({
	 * 	   events: ['beforeclose','maximize'],
	 *     callback: function() {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	removeStateEventListeners: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "removeStateEventListeners",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid,
				events: cfg.events
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Adds custom state event handlers to override a widget event.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be monitored. Defaults to current widget guid.
     * @param {Array} [cfg.events] Array of events. If no event is provided this method will add listeners to all registered events.
     * @param {Function} [cfg.callback] Function to be called once after the listener is added.
	 *
	 * @example
	 *
	 * widgetState.addStateEventOverrides({
	 * 	   events: ['beforeclose','maximize'],
	 *     callback: function() {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	addStateEventOverrides: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "addStateEventOverrides",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid,
				events: cfg.events
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	},
	
	/**
	 * @description Removes custom state event listeners from a widget.
     * @param {Object} [cfg] Config object. See below for properties.
     * @param {String} [cfg.guid]  Id of the widget whose events should be monitored. Defaults to current widget guid.
     * @param {Array} [cfg.events] Array of events. If no event is provided this method will remove only custom listeners from all registered events.
     * @param {Function} [cfg.callback] Function to be called once after the listener is removed.
	 *
	 * @example
	 *
	 * widgetState.removeStateEventOverrides({
	 * 	   events: ['beforeclose','maximize'],
	 *     callback: function() {
	 *     		// Do something
	 *     }
	 * });
	 *
	 */
	removeStateEventOverrides: function(cfg) {
		cfg = cfg ? cfg : {};
		
		var config = {
			fn: "removeStateEventOverrides",
			params: {
				guid: cfg.guid ? cfg.guid : this.widgetGuid,
				events: cfg.events
			}
		};
		this.widgetStateHandler.handleWidgetRequest(config, cfg.callback);
	}

};

/**
 * @param {Object} [cfg] config object see below for properties
 * @param {String} [cfg.widgetEventingController]  The widgetEventingController
 * @param {Boolean} [cfg.autoInit] Whether or not to automatically start listening to the state channel.  Default is true.
 * @param {String} [cfg.widgetGuid]  The guid of the widget to monitor. Default is itself.
 * @param {String} [cfg.onStateEventReceived]  The callback function when an event is received.
 * @description Retrieves Ozone.state.WidgetState Singleton instance. Manages the two-way communication between an OWF widget and its OWF Container.
 * @requires <a href="Ozone.eventing.Widget.html">Ozone.eventing.Widget</a> for eventing
 * @since OWF 3.7.0
 * @example
 * var widgetState = Ozone.state.WidgetState.getInstance({
 *     onStateEventReceived: function(sender, msg) {
 *          // do something
 *     }
 * });
 *
 */
Ozone.state.WidgetState.getInstance = function(cfg) {
  if (Ozone.state.WidgetState.instance == null) {
    Ozone.state.WidgetState.instance = new Ozone.state.WidgetState(cfg);
  }
  return Ozone.state.WidgetState.instance;
};

/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.eventing = Ozone.eventing ? Ozone.eventing : {};

(function (window, document, undefined) {

    function rpcCall(widgetId, widgetIdCaller, functionName, var_args) {
        gadgets.rpc.call("..", "FUNCTION_CALL", null, widgetId, widgetIdCaller, functionName, var_args);
    }

    /**
     * Creates or updates a proxy - This is a private constructor - Do not call this directly.  The other
     * Widget APIs such as Widget Intents may return a proxy.  A proxy may contain dynamic functions that were
     * registered by the origin widget.
     *
     * @param {String} wid Id of the Widget this proxy represents
     * @param {Object[]} functions Array of objects representing proxy functions
     * @param {String} srcId Id of the source Widget who is using the proxy
     * @param {Ozone.eventing.WidgetProxy} [proxy] A existing proxy object to be used, instead of creating a new instance
     * @constructor
     */
    Ozone.eventing.WidgetProxy = function (wid, functions, srcId, proxy) {
        var widgetId = wid,
            readyList = [],
            pub = proxy;

        if (pub == null) {
            pub = /** @lends Ozone.eventing.WidgetProxy.prototype */ {

                /**
                 * Id of the Widget that this proxy represents
                 */
                id:wid,
                /**
                 * Flag which represents if the Widget this proxy represents
                 */
                isReady:false,
                callbacks:{},
                /**
                 * Sends a direct message to the Widget this proxy represents
                 * @param {Object} dataToSend
                 * @example
                 * var widgetProxy = OWF.RPC.getWidgetProxy(id);
                 * widgetProxy.sendMessage({data:'foo'});
                 */
                sendMessage:function (dataToSend) {
                    gadgets.rpc.call("..", 'DIRECT_MESSAGE', null, widgetId, dataToSend);
                },

                /**
                 * Registers a listener function to be executed when the Widget has called notifyReady
                 * @param {function} readyListener function to execute
                 * @param {Object} readyListenerScope scope for the function to execute with
                 * @example
                 * var widgetProxy = OWF.RPC.getWidgetProxy(id);
                 * widgetProxy.onReady(function() { console.log("Other widget is ready!"); });
                 */
                onReady:function (readyListener, readyListenerScope) {

                    if (this.isReady) {
                        //just execute because the widget is already ready
                        readyListener.call(readyListenerScope);
                    }
                    else {
                        //save ready listeners
                        readyList.push({fn:readyListener, scope:readyListenerScope});
                    }
                },
                fireReady: function() {
                    this.isReady = true;
                    for (var i = 0, len = readyList.length; i < len; i++) {
                        readyList[i].fn.call(readyList[i].scope);
                    }
                }
            };
        }

        if (functions != null) {
            for (var ii = 0; ii < functions.length; ii++) {
                var functionName = functions[ii];

                pub[functionName] = function (name) {
                    return function () {
                        var callback = arguments[arguments.length - 1];
                        var callbackExists = typeof callback == 'function';
                        var args = Array.prototype.slice.call(arguments, 0, callbackExists ? arguments.length - 1 : arguments.length);
                        if (callbackExists) {
                            pub.callbacks[name] = callback;
                        }
                        rpcCall.call(this, widgetId, srcId, name, args);
                    }
                }(functionName);

            }
        }

        return pub;
    };

}(window, document));
//Top level namespace defs
var Ozone = Ozone || {};
Ozone.eventing = Ozone.eventing || {};
Ozone.eventing.priv = Ozone.eventing.priv || {};

if (typeof JSON === 'undefined') {
    JSON = gadgets.json;
}

(function (ozoneEventing) {

    //////////////////////////////////////////////////////////////////////////
    // private objects and functions
    //////////////////////////////////////////////////////////////////////////

    var WIDGET_READY_SERVICE_NAME = '_widgetReady',
        GET_WIDGET_READY_SERVICE_NAME = '_getWidgetReady',
        config = null,
        fnMap = {},
        widgetProxyMap = {};

    function getConfig() {
        if (config == null) {
            config = {};
            if (window.name.charAt(0) != '{') {
                config.rpcId = window.name;
            }
            else {
                config = JSON.parse(window.name);
                config.rpcId = config.id;
                return config;
            }
        }
        else {
            return config;
        }
    }

    function getWidgetProxyMap() {
        return widgetProxyMap;
    }

    function getIdFromWindowName() {
        return getConfig().rpcId;
    }

    function handleDirectMessageWrapper(message) {
        if (ozoneEventing.handleDirectMessage) ozoneEventing.handleDirectMessage(message);
        else {
            if (console && console.log) {
                console.log("ChildWidget: Kernel: Default direct message handler, doing nothing.  Override by defining Ozone.eventing.handleDirectMessage");
            }
        }
    }

    function handleFunctionCall() {
        var var_args = Array.prototype.slice.call(arguments);
        var fn_args = Array.prototype.slice.call(arguments, 3);
        var widgetId = var_args[0];
        var widgetIdCaller = var_args[1];

        var fnName = var_args[2];
        var fnObj = fnMap[fnName];

        //id of the calling widget
        fnObj.fn.widgetIdCaller = widgetIdCaller;

        var result = fnObj.fn.apply(fnObj.scope, fn_args[0]);

        gadgets.rpc.call("..", 'FUNCTION_CALL_RESULT', null, widgetId, widgetIdCaller, fnName, result);
    }

    function handleFunctionCallResult(widgetId, functionName, result) {
        var wproxy = widgetProxyMap[widgetId];
        if (wproxy != null) {
            var cb = wproxy.callbacks[functionName];
            if (typeof cb === 'function') {
                cb.call(window, result);
            }
        }
    }

    function handleEventCall(eventName) {
        var fn = ozoneEventing.priv.clientEventNameToHandler[eventName];
        var var_args = Array.prototype.slice.call(arguments, 1);
        fn.apply(window, var_args);
    }

    ozoneEventing.priv.clientEventNameToHandler = {};

    ozoneEventing.after_container_init = function () {
    };

    //Record all public functions from a widget
    function getFunctionNames(functions) {
        if (functions) {
            var funcNames = [];
            for (var ii = 0; ii < functions.length; ii++) {
                var fnName = functions[ii].name;
                funcNames.push(fnName);
            }
            return funcNames;
        }
    }

    function createClientSideFunctionShims(widgetId, functions, initialProxy) {
        widgetProxyMap[widgetId] = new Ozone.eventing.WidgetProxy(widgetId, functions, getIdFromWindowName(), initialProxy);
        return widgetProxyMap[widgetId];
    }

    function getRelayUrl(url) {
        var protocolIdx = url.indexOf("//");
        var protocolEndIdx = url.indexOf("/", protocolIdx + 2);
        var appEndIdx = url.indexOf("/", protocolEndIdx + 1);
        var relay = url.substring(0, appEndIdx + 1) + "rpc_relay.html";
        return relay;
    }

    function cacheFunctions(functions) {
        var fnObj;

        for (var i = 0, len = functions.length; i < len; i++) {
            fnObj = functions[i];

            if (!fnObj.name)
                throw 'Error: name is not set'
            if (!fnObj.fn)
                throw 'Error: fn is not set'

            fnMap[fnObj.name] = fnObj;
        }
    }

    //////////////////////////////////////////////////////////////////////////
    // public objects and functions
    //////////////////////////////////////////////////////////////////////////


    /**
     * clientInitialize - Initialize a widget
     *
     * @params        publicFucnctions - optional array of functions to expose to other widgets
     *
     *    For example
     *        function plot(lat, lon) { //do some plotting }
     *        function center(lat, lon) { //do some centering }
     */
    function clientInitialize(publicFunctions, relayUrl) {
        gadgets.rpc.setRelayUrl("..", getConfig().relayUrl, false, true);
        gadgets.rpc.register("after_container_init", ozoneEventing.after_container_init);

        publicFunctions = [].concat(publicFunctions);
        cacheFunctions(publicFunctions);

        var fnNames = getFunctionNames(publicFunctions);
        var id = getIdFromWindowName();

        if (relayUrl == null) {
            relayUrl = getRelayUrl(document.location.href);
        }

//        gadgets.rpc.call("..", "TELL_FUNCTIONS", null, id, fnNames, relayUrl);

        //this rpc call must be consistent with OWF container_init
        var idString = '{\"id\":\"' + id + '\"}';
        var data = {
            id:idString,
            version:'1.0',
            useMultiPartMessagesForIFPC:true,
            relayUrl:relayUrl
        };
        var dataString = JSON.stringify(data);
        gadgets.rpc.call("..", "container_init", null, idString, dataString, fnNames);
    }

    function registerFunctions(functions) {
        functions = [].concat(functions);

        cacheFunctions(functions);
        gadgets.rpc.call("..", "register_functions", null, window.name, getFunctionNames(functions));
    }

    /**
     * importWidget - Get a proxy to another widget in the container
     *
     * @returns       a proxy object that can be used to send direct messages, handle events,
     *                or call functions \
     *
     *  Note that once created, the proxy will be available in the global Ozone.eventing
     *  collection
     *    For example
     *        createWidget("http://maps.com/widgetMap", "MyMapWidget", "div1", "100%", "100%", ok);
     *        function ok() {
     *           Ozone.eventing.MyMapWidget.plot(1.1,2.2);
     *        }
     */
    function importWidget(widgetId, ready) {
        var proxy = createClientSideFunctionShims(widgetId);

        function processFunctionsFromContainer(functions) {
            proxy = createClientSideFunctionShims(widgetId, functions, proxy);
            gadgets.rpc.call("..", GET_WIDGET_READY_SERVICE_NAME, function(isReady) {
                if (isReady) {
                  proxy.fireReady();
                }
                if (typeof ready == 'function') ready.call(this, proxy);
            }, widgetId, srcWidgetId);
        }

        var id = getIdFromWindowName();
        var srcWidgetId = '{\"id\":\"' + id + '\"}';
        gadgets.rpc.call("..", 'GET_FUNCTIONS', processFunctionsFromContainer, widgetId, srcWidgetId);
        return proxy;
    }

    /**
     * Listen for events of a given name using the specified handler function
     */
    function addEventHandler(eventName, handler) {
        ozoneEventing.priv.clientEventNameToHandler[eventName] = handler;
        var widgetId = getIdFromWindowName();
        gadgets.rpc.call("..", 'ADD_EVENT', null, widgetId, eventName);
    }

    /**
     * Raise and event with a json payload
     */
    function raiseEvent(eventName, payload) {
        gadgets.rpc.call("..", 'CALL_EVENT', null, eventName, payload);
    }

    /**
     * closeDialog - Close current dialog widget, returning a json payload to the container.
     */
    function closeDialog(payload) {
        document.body.display = "none";
        gadgets.rpc.call("..", 'CLOSE_EVENT', null, getIdFromWindowName(), payload);
    }

    /**
     * getAllWidgets - Get an array of objects containing the url and id of all currently
     *                 open widgets.
     *
     *   eg [ { url: "http://www.example.com", id: "foo" }, ... ]
     */
    function getAllWidgets(handlerFn) {
        function listResultHandler(widgetList) {
            handlerFn(widgetList);
        }

        gadgets.rpc.call("..", 'LIST_WIDGETS', listResultHandler);
    }

    gadgets.rpc.register('DIRECT_MESSAGEL_CLIENT', handleDirectMessageWrapper);
    gadgets.rpc.register("FUNCTION_CALL_CLIENT", handleFunctionCall);
    gadgets.rpc.register("FUNCTION_CALL_RESULT_CLIENT", handleFunctionCallResult);
    gadgets.rpc.register("EVENT_CLIENT", handleEventCall);
    gadgets.rpc.register(WIDGET_READY_SERVICE_NAME, function (widgetId) {
        var wproxy = widgetProxyMap[widgetId];
        if (wproxy != null) {
            wproxy.fireReady();
        }
    });



    ozoneEventing.clientInitialize = clientInitialize;
    ozoneEventing.registerFunctions = registerFunctions;
    ozoneEventing.importWidget = importWidget;
    ozoneEventing.addEventHandler = addEventHandler;
    ozoneEventing.raiseEvent = raiseEvent;
    ozoneEventing.closeDialog = closeDialog;
    ozoneEventing.getAllWidgets = getAllWidgets;
    ozoneEventing.getWidgetProxyMap = getWidgetProxyMap;

})(Ozone.eventing);

/**
 * @fileoverview Basic metrics capability.  Expectation is that new metrics will 
 *  likely be set up as separate files / separate sets.    
 */

/**
 * @namespace
 */
var Ozone = Ozone || {};

/**
 * @namespace
 */
Ozone.metrics = Ozone.metrics || {};

/**
 * @description Basic logging capability - meant to be called by other methods
 *    which transform or validate data  
 * @since OWF 3.8.0
 *
 * @param {String} userId
 * @param {String} userName
 * @param {String} metricSite Identifier, potentially URL, for source of metric - typically OWF instance
 * @param {String} componentName    
 * @param {String} componentId 
 * @param {String} componentInstanceId
 * @param {String} metricTypeId String describing metric - recommend package name construct
 * @param {String} metricData Any additional data for metric - do any necessary validation appropriate to metricTypeId before sending through 
 */
Ozone.metrics.logMetric = function(userId, userName, metricSite, componentName, componentId, componentInstanceId, metricTypeId, metricData) {
	var currentDate = new Date();
	
    Ozone.util.Transport.send({
        url: OWF.getContainerUrl() + '/metric',
        method: 'POST',
        onSuccess: function(response) {
        },
        autoSendVersion : false,
        content : {
          metricTime: currentDate.getTime(),
          userId: userId,
          userName: userName,
          site: metricSite,
          userAgent: navigator.userAgent,
          component: componentName,
          componentId: componentId,
          instanceId: componentInstanceId,
          metricTypeId: metricTypeId,
          widgetData: metricData
        }
    });
};

/**
 * @description Logs a set of metrics to the server all at once.  All
 * metrics passed into a call to this function will be logged in a single
 * HTTP request, instead of one request per metric
 * @since OWF 6.0
 *
 * @param {Array} metrics 
 * @param {String} metrics[*].userId
 * @param {String} metrics[*].userName
 * @param {Number} metrics[*].metricTime The time at which is metric was collected (in UNIX time)
 * @param {String} metrics[*].site Identifier, potentially URL, for source of metric - typically OWF instance
 * @param {String} metrics[*].component
 * @param {String} metrics[*].componentId 
 * @param {String} metrics[*].instanceId
 * @param {String} metrics[*].metricTypeId String describing metric - recommend package name construct
 * @param {String} metrics[*].widgetData Any additional data for metric - do any necessary validation appropriate to metricTypeId before sending through 
 * @param {String} metrics[*].userAgent Should be set to the user-agent string of the browser
 */
Ozone.metrics.logBatchMetrics = function(metrics) {
	var currentDate = new Date();
	
    Ozone.util.Transport.send({
        url: OWF.getContainerUrl() + '/metric',
        method: 'POST',
        onSuccess: function(response) {
        },
        autoSendVersion : false,
        content : {
        	data: metrics
        }
    });
};

/**
 * @description Log view of widget - see calls in dashboards
 * @since OWF 3.8.0
 *
 * @param {String} userId     - see Ozone.metrics.logMetric userId
 * @param {String} userName   - see Ozone.metrics.logMetric userName
 * @param {String} metricSite - see Ozone.metrics.logMetric metricSite
 * @param {Object} widget   
 */ 
Ozone.metrics.logWidgetRender = function(userId, userName, metricSite, widget) {

  // checking here, on the assumption we may save ourselves some validation time
  //   on any widget data validation (last param)
  if (Ozone.config.metric.enabled === true) {
      Ozone.metrics.logMetric(userId, userName, metricSite, widget.name, widget.widgetGuid, widget.id, "ozone.widget.view", "");
      }
};

/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @namespace
 * @since OWF 5.0
 */
OWF = window.OWF ? window.OWF : {};

(function(window, document, undefined) {

	var WIDGET_READY_SERVICE_NAME = '_widgetReady',

        isReady = false,
		readyList = [],
		widget = Ozone.util.parseWindowNameData(),
		eventingController,
		dragAndDropController,
		launchingController,
		chromeController;

	owfdojo.mixin(OWF, /** @lends OWF */ {

		/**
		 * The OWF.Eventing object manages the eventing for an individual widget
		 * 
		 * @namespace
		 * @name OWF.Eventing
		 */
		Eventing: {},

		/**
		 * @namespace
		 * @name OWF.RPC
		 */
		RPC: {},

		/**
		 * This object is used to create, retrieve, update and delete user preferences.
		 * 
		 * @namespace
		 * @name OWF.Preferences
		 */
		Preferences: {},

		/**
		 * This object is used launch other widgets. 
		 *
		 * @namespace
		 * @name OWF.Launcher
		 */
		Launcher: {},

		/**
		 * The OWF.DragAndDrop object manages the drag and drop for an individual widget.
		 * 
		 * @namespace
		 * @name OWF.DragAndDrop
		 */
		DragAndDrop: {},

		/**
		 * This object allows a widget to modify the button contained in the widget header (the chrome). 
		 *
		 * @namespace
		 * @name OWF.Chrome
		 */
		Chrome: {},

		/**
		 * Provides OWF utility methods for the widget developer 
		 *
		 * @namespace
		 * @name OWF.Util
		 */
		Util: Ozone.util,

		/**
		 * 
		 *
		 * @namespace
		 * @name OWF.Metrics
		 */
		Metrics: Ozone.metrics,

		/**
		 * Provides functions to log messages and objects
		 * 
		 * @namespace
		 * @name OWF.Log
		 */
		Log: Ozone.log,

		/**
		 * Provides utility methods for localization
		 *
		 * @namespace
		 * @name OWF.Lang
		 */
		Lang: Ozone.lang,
		
		Version: Ozone.version,

		/**
			Accepts a function that is executed when Ozone APIs are ready for use
			@param {Function} handler Function to execute when OWF APIs are ready
			@param {Object} scope The scope (this reference) in which the function is executed. If omitted, defaults to the browser window.
		*/
		ready: function(handler, scope) {

			if(handler === undefined) {
				throw 'Error: no arguments passed';
				return;
			}
			
			if(typeof handler !== 'function') {
				throw 'Error: handler must be a function';
				return;
			}

			isReady === true ? handler.call(scope) : readyList.push( {fn: handler, scope: scope} );

		},

      /**
       * This function should be called once the widget is ready and all initialization is completed.  This will send a
       * message to the container which in turn may notify other widgets
       */
        notifyWidgetReady: function() {
          //send a message to container that this widget is ready
          gadgets.rpc.call('..', WIDGET_READY_SERVICE_NAME, null, OWF.getIframeId());
        },

		/**
			Returns definition GUID of the widget. This is auto generated by OWF when the widget was brought in an OWF instance.
		*/
		getWidgetGuid : function() {
			return widget.guid;
		},

		/**
			Returns instance GUID of the widget.
		*/
		getInstanceId : function() {
			return widget.id;
		},

        /**
         * @description Returns the Widget Id
         * @returns {String} The widgetId is a complex JSON encoded string which identifies a widget for Eventing.
         *   Embedded in this string is the widget's uniqueId as the 'id' attribute.  There is other data is in the string
         *   which is needed for Eventing and other APIs to function properly. This complex widgetId string may be used in
         *   the <a href="./OWF.Eventing.html#.publish">OWF.Eventing.publish</a> function to designate a specific recipient for a message.
         *   Additionally, once subscribed to a channel via <a href="./OWF.Eventing.html#.subscribe">OWF.Eventing.subscribe</a> during the
         *   receipt of a message, the sender's widgetId is made available as the first argument to the handler function.
         * @example
         * //decode and retrieve the widget's unique id
         * var complexIdString = OWF.getIframeId();
         * var complexIdObj = owfdojo.toJson(complexIdString);
         *
         * //complexIdObj will look like
         * // {
         * //  //widget's uniqueId
         * //  id:"49cd21f0-3110-8121-d905-18ffa81b442e"
         * // }
         *
         * //get Widget's uniqueId
         * alert('widget id = ' + complexIdObj.id);
         */
		getIframeId : function() {
			return '{\"id\":\"' + widget.id + '\"}';
		},

		/**
			Returns type of dashboard in which the widget is opened. [portal, desktop, accordion, tabbed]
		*/
		getDashboardLayout : function() {
			return widget.layout;
		},

		/**
			Returns version of the widget.
		*/
		getVersion : function() {
			return widget.version;
		},

		/**
			Returns URL of the widget.
		*/
		getUrl : function() {
			return widget.url;
		},

		/**
			Returns an object containing information on the current OWF theme
			@returns {Object} Returns an object below: <br>
			{ <br>
				//name of the theme <br>
				themeName: 'theme-name', <br>
				<br>
				//describes color contrast of the theme.  This may be one of 3 values: <br>
				// 'standard' (colors provide no special contrast) <br>
				// 'black-on-white' (black on white color contrast) <br>
				// 'white-on-black' (white on black color contrast) <br>
				themeContrast: 'black-on-white', <br>
				<br>
				//this field is a number of the fontSize in pixels <br>
				themeFontSize: 12 <br>
			}
			@example
			var themeObj = OWF.getCurrentTheme();
		*/
		getCurrentTheme : function() {
			return widget.currentTheme;
		},

		/**
			Returns the name of the Container the Widget is in
		*/
		getContainerName: function() {
			return widget.containerName;
		},
		
		/**
			Returns the version of the Container the Widget is in
		*/
		getContainerVersion: function() {
			return widget.containerVersion;
		},

		/**
			Returns whether or not the dashboard in which the widget is opened is locked. 
		*/
		isDashboardLocked : function() {
			return widget.locked;
		},

		/**
		Returns the URL of the Container the Widget is in
		*/
		getContainerUrl: function() {
            //figure out from preference location
			var pref = widget.preferenceLocation;
            return pref.substring(0, pref.length - 6);
		},

		/**
			Gets all opened widgets on the current dashboard.

			@param {Function} callback function to execute when opened widgets are retrieved from OWF. Function is passed an array of objects with the structure below: <br>
			{<br>
				id: 'instance guid of widget',<br>
				frameId: 'iframe id of widget',<br>
				widgetGuid: 'widget guid of the widget',<br>
				url: 'url of the widget',<br>
				name: 'name of the widget'<br>
			}<br>
			@example
			OWF.getOpenedWidgets(function(openedWidgets) {
				
			});
		*/
		getOpenedWidgets: function(fn) {
			
			if(fn === undefined) {
				throw 'Error: no arguments passed';
				return;
			}

			if(typeof fn !== 'function') {
				throw 'Error: fn must be a function';
				return;
			}

			Ozone.eventing.getAllWidgets(fn);
		}
	});

	// for backwards compatibility
	Ozone.Widget = OWF;

	OWF._init = function(window, document, undefined) {

        if (OWF.relayFile != null) {
          Ozone.eventing.Widget.widgetRelayURL = OWF.relayFile;
        }

		// Eventing API
		function initEventing() {
			for(var i = 0, methods = ['publish', 'subscribe', 'unsubscribe'] ; i < methods.length ; i++) {
				OWF.Eventing[ methods[i] ] = this[ methods[i] ];
			}
		}

		// RPC/Directed Eventing API
		function initRPC() {
			OWF.RPC.registerFunctions = Ozone.eventing.registerFunctions;
			OWF.RPC.getWidgetProxy = Ozone.eventing.importWidget;
			OWF.RPC.handleDirectMessage = function(fn) {
				if(typeof fn !== 'function') {
					throw 'Error: fn must be a function';
					return;
				}
				Ozone.eventing.handleDirectMessage = fn;
			};
		}

		// Preferences API
		function initPreferences() {
			for(var i in Ozone.pref.PrefServer) {
				if(typeof Ozone.pref.PrefServer[ i ] === 'function')
					OWF.Preferences[ i ] = Ozone.pref.PrefServer[ i ];
			}
		}

		// Launching API
		function initLauncher() {
			OWF.Launcher.launch = launchingController.launchWidget;
			OWF.Launcher.getLaunchData = Ozone.launcher.WidgetLauncherUtils.getLaunchConfigData;
		}

		// Drag and Drop API
		function initDragAndDrop() {
			OWF.DragAndDrop = {
				onDragStart: function(callback, scope) {
					dragAndDropController.addCallback('dragStart', owfdojo.hitch(scope, callback));
					return this;
				},

				onDragStop: function(callback, scope) {
					dragAndDropController.addCallback('dragStop', owfdojo.hitch(scope, callback));
					return this;
				},

				onDrop: function(callback, scope) {
					dragAndDropController.addCallback('dropReceive', owfdojo.hitch(scope, callback));
					return this;
				},

				startDrag: function(cfg) {
					dragAndDropController.doStartDrag(cfg);
					return this;
				}
			};

			for(var i = 0, methods = ['addDropZoneHandler', 'getDragStartData', 'getDropEnabled', 'setDropEnabled', 'isDragging', 'getFlashWidgetId', 'setFlashWidgetId'] ; i < methods.length ; i++) {
				
				OWF.DragAndDrop[ methods[i] ] = function( methodName ) {
					
					return function() {
						return dragAndDropController[methodName].apply(dragAndDropController, arguments);
					};

				}( methods[i] );
			
			}
		}

		// Chrome API
		function initChrome() {
			for(var i = 0, 
				methods = ['addHeaderButtons', 'addHeaderMenus', 'insertHeaderButtons', 'insertHeaderMenus', 'isModified', 'listHeaderButtons', 'listHeaderMenus', 'removeHeaderButtons', 'removeHeaderMenus', 'updateHeaderButtons', 'updateHeaderMenus'] ; i < methods.length ; i++) {
				OWF.Chrome[ methods[i] ] = chromeController[ methods[i] ];
			}
		}

		eventingController = Ozone.eventing.Widget.getInstance(function() {

			dragAndDropController = Ozone.dragAndDrop.WidgetDragAndDrop.getInstance({
				widgetEventingController: this
			});
			launchingController = Ozone.launcher.WidgetLauncher.getInstance();
			chromeController = Ozone.chrome.WidgetChrome.getInstance({
				widgetEventingController: this
			});

			initEventing.call(this);
			initRPC();
			initPreferences();
			initLauncher();
			initDragAndDrop();
			initChrome();

			Ozone.components.keys.createKeyEventSender(this);

			// execute ready listeners
			isReady = true;
			for(var i = 0, len = readyList.length ; i < len ; i++) {
				readyList[i].fn.call(readyList[i].scope);
			}

		});

	};

}(window, document));

// --------------------------------------------------------------------------------------------------
// ------------------- Eventing ---------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
/**
 * @name relayFile
 * @memberOf OWF
 * @description The location of the widget relay file.  The relay file should be defined
 *   globally for the entire widget by setting OWF.relayFile to the relay file url, immediately after
 *   including the widget bundle javascript.  If the relay is not defined at all it is assumed to be at
 *   /[context]/js/eventing/rpc_relay.uncompressed.html. The relay file must be specified with full location details, but without a fully
 *   qualified path. In the case where the relay is residing @ http://server/path/relay.html, the path used must be from the context root of the local
 *   widget. In this case, it would be /path/relay.html.  Do not include the protocol.
 * @since OWF 5.0.0
 * @example
 * &lt;script type="text/javascript" src="../../js-min/owf-widget-min.js"&gt;&lt;/script&gt;
 * &lt;script&gt;
 *       //The location is assumed to be at /[context]/js/eventing/rpc_relay.uncompressed.html if it is not
 *       //set the path correctly below
 *       OWF.relayFile = '/owf/js/eventing/rpc_relay.uncompressed.html';
 *       //...
 * &lt;/script&gt;
 *
 */

/**
	Subscribe to a named channel for a given function.
	@name subscribe
	@methodOf OWF.Eventing

	@param {String} channelName The channel to subscribe to.
	@param {Function} handler The function you wish to subscribe.  This function will be called with three
		arguments: sender, msg, channel.
	@param {String} [handler.sender] The first argument passed to the handler function is the id of the sender of the message. See <a href="OWF.html#.getIframeId">OWF.getIframeId</a> for a description of this id.
	@param {Object} [handler.msg] The second argument passed to the handler function is the message itself.
	@param {String} [handler.channel] The third argument passed to the handler function is the channel the message was published on.
		
	@example
OWF.Eventing.subscribe("ClockChannel", this.update);
var update = function(sender, msg, channel) {
	document.getElementById('currentTime').innerHTML = msg;
}
 */

/**
	Unsubscribe to a named channel.
	@name unsubscribe
	@methodOf OWF.Eventing

	@param {String} channelName The channel to unsubscribe to.
	
	@example
OWF.Eventing.unsubscribe("ClockChannel");
 */

/**
	Publishes a message to a given channel.
	@name publish
	@methodOf OWF.Eventing

	@param {String} channelName The name of the channel to publish to
	@param {Object} message The message to publish to the channel.
	@param {String} [dest] The id of a particular destination.  Defaults to null which sends to all
		subscribers on the channel.  See <a href="OWF.html#.getIframeId">OWF.getIframeId</a>
		for a description of the id.
	
	@example
OWF.Eventing.publish("ClockChannel", currentTimeString);
*/

// --------------------------------------------------------------------------------------------------
// ------------------- RPC --------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

/**
	Register one or more functions to OWF to expose to other widgets.
	@name registerFunctions
	@methodOf OWF.RPC

	@param {Object/Array} objs Object or an array of objects of following structure.<br />
		{<br />
			name: 'name of the function', <br />
			fn: function() {}, <br />
			scope: window //The scope (this reference) in which the function is executed. If omitted, defaults to the browser window.<br />
		}<br />

	@example
Calculator = {
	add: function() {
		var args = arguments,
			val = 0;
		for(var i = 0, len = args.length; i < len; i++) {
			val += parseFloat(args[i]);
		}
		return val;
	},
	multiply: function() {
		var args = arguments,
			val = 1;
		for(var i = 0, len = args.length; i < len; i++) {
			val *= parseFloat(args[i]);
		}
		return val;
	}
};
OWF.RPC.registerFunctions([
	{
		name: 'add'
		fn: Calculator.add,
		scope: Calculator
	},
	{
		name: 'multiply'
		fn: Calculator.multiply,
		scope: Calculator
	}
]);
*/

/**
	Gets a proxy object that contains methods exposed by other widget.
	@name getWidgetProxy
	@methodOf OWF.RPC

	@param {String} instanceGuid instance guid of the widget to import
	@param {Function} callback function that will be executed if the widget is found opened on the current dashboard. The function is passed a proxy object as the first argument which will contain methods that were exposed by the widget. In addition, the proxy abject also has sendMessage method to send a direct message to the widget.

	@example
OWF.RPC.getWidgetProxy('instanceGuid of widgetA', function(widgetA) {

	widgetA.add(1,2,3, function(result) {
		console.log(result); // log the result
	})

	widgetA.sendMessage('some secret message');

});
*/

/**
	Register a function to be executed when a direct message is received from another widget.
	@name handleDirectMessage
	@methodOf OWF.RPC

	@param {Function} fn function that will be executed when a direct message is received from another widget.

	@example
OWF.RPC.handleDirectMessage(function(msg) {
	// do something with the message
});
*/

// --------------------------------------------------------------------------------------------------
// ------------------- Drag and Drop ----------------------------------------------------------------
// --------------------------------------------------------------------------------------------------
/**
	Use this method to set flex dom element id, so that drag and drop can be enabled in flex widgets.
	@name setFlashWidgetId
	@methodOf OWF.DragAndDrop

	@param {String} id dom element id of flex widget
*/

/**
	Starts a drag.  The config object passed in describes the drag and contains the data to be passed to the drop.
	@name startDrag
	@methodOf OWF.DragAndDrop

	@param {Object} cfg config object see below
	@param {String} cfg.dragDropLabel Name to be used as text for the dragDrop indicator
	@param {Object} cfg.dragDropData Data to be sent on a successful drag and drop.  This property is only sent to the
	successful recipient of the drag (the dropReceive event).  It will not be sent for other events.
	@param {Object} cfg.dragZone dom node which presents a dragZone which is associated with this drag.  This property is
	only saved and used locally to the widget to identify whether a dragZone is in fact the node as a dropZone.  It will not be
	sent to other events callbacks.
	@param {Object} cfg.* other custom properties may be specified, these will be passed along to event handlers
	
	@example
//add handler to text field for dragging
owfdojo.connect(document.getElementById('dragSource'), 'onmousedown', this, function(e) {
	e.preventDefault();
	var data = document.getElementById('InputChannel').value;
	if (data) {
		OWF.DragAndDrop.startDrag({
			dragDropLabel: data,
			dragDropData: data,
			dragZone:  document.getElementById('dragZone'),
			dragDropGroup: 'location'  //extra property to pass along
		});
	}
});
*/


/**
	Adds a new drop zone to be managed.  The handler function defined in the cfg object will be called when
	a drop occurs over a dom node which matches the id or the className or is equal to or a child of the dropTarget node
	@name addDropZoneHandler
	@methodOf OWF.DragAndDrop

	@param {Object} cfg config object see below
	@param {className} cfg.class class of the dropZone
	@param {String} cfg.id Id of the dropZone
	@param {Node} cfg.dropZone HTML node which represents the dropZone
	@param {Function} cfg.handler function to be called when a drop occurs over the dropZone.  A msg object will be passed in

	@example
//Example cfg Object
{
	id: 'mygrid-1',
	className: 'mygridClass',
	dropZone: document.getElementById('dropZone'),
	handler: function(msg) {
		//some code here to handle the msg and respond
	}
}

//Example usage of addDropZoneHandler which handles a drop that occurs over an Ext Grid and inserts new data into
//that grid based on the dragged data
OWF.DragAndDrop.addDropZoneHandler({
	//dom node of an Ext grid
	dropZone:grid.getView().scroller.dom,

	//this function is called only when a drop occurs over the grid (i.e. the mouse was released over the grid)
	handler: (function(msg){
	
		var store = grid.getStore();
		var processedSelections = [];
		var errorMsg = null;

		//loop through msg.dragDropData which is an array and check for dupes versus the destination store
		for (var i = 0; i < msg.dragDropData.length; i++) {
			//get data for one possible new record in the dragDropData
			var recData = msg.dragDropData[i];

			//is it already in the dest Ext Store?
			if (store.findExact('id',recData.id) >= 0) {
				//found the record already in the store
			}
			else {
				//add new record based on the dragDropData
				var newRec = new store.recordType(recData);
				//calling an external function to decide whether to add the new rec
				var rs = displayPanel.validateRecordOnAdd(newRec);
				if (rs.success) {
					processedSelections.push(newRec);
				}
				else {
					errorMsg = rs.msg;
				}
			}
		}

		if (errorMsg) {
			Ext.Msg.alert('Error', errorMsg);
		}

		//actually insert into the store which adds it the new recs to the grid
		if (processedSelections.length > 0) {
			store.insert(0, processedSelections);
		}

}).createDelegate(grid)});   //createDelegate is an Ext function which sets the scope of the callback

*/


/**
	Returns whether the a drop is enabled (this is only true when the mouse is over a drop zone)
	@name getDropEnabled
	@methodOf OWF.DragAndDrop
*/

/**
	Returns whether a drag is in progress
	@name isDragging
	@methodOf OWF.DragAndDrop
*/

/**
	Returns data sent when a drag was started
	@name getDragStartData
	@methodOf OWF.DragAndDrop
*/

/**
	Toggles the dragIndicator to indicate successful or unsuccessful drop
	@name setDropEnabled
	@methodOf OWF.DragAndDrop

	@param {Boolean} dropEnabled true to enable a drop, false to indicate a unsuccessful drop
	
	@example
//attach mouseover callback to a particular area. If the mouse is here allow a drop
cmp.getView().scroller.on('mouseover',function(e,t,o) {
	if (cmp.dragging) {
		OWF.DragAndDrop.setDropEnabled(true);
	}
},this);

//attach a mouse out callback to a particular area. If the mouse leaves disable drop
cmp.getView().scroller.on('mouseout',function(e,t,o) {
	if (cmp.dragging) {
		OWF.DragAndDrop.setDropEnabled(false);
	}
},this);
   */


/**
	Executes the callback passed when a drag starts in any widget.
	@name onDragStart
	@methodOf OWF.DragAndDrop
	
	@param {Function} callback The function to execute as a callback.
	@param {Object} scope The scope (this reference) in which the function is executed. If omitted, defaults to the browser window.

	@example
//example callback, highlights an Ext Grid when a drag occurs
OWF.DragAndDrop.onDragStart(function(sender, msg) {
	//get the Ext Grid
	var grid = this.getComponent(this.gridId);

	//check custom dragDropGroup property to see if the drag is meant for this grid
	//if so highlight the grid by adding the ddOver class
	if (grid && msg != null && msg.dragDropGroup == 'users') {
		grid.getView().scroller.addClass('ddOver');
	}
}, this);
*/

/**
	Executes the callback passed when a drag stops in any widget.
	@name onDragStop
	@methodOf OWF.DragAndDrop
	
	@param {Function} callback The function to execute as a callback.
	@param {Object} scope The scope (this reference) in which the function is executed. If omitted, defaults to the browser window.

	@example

OWF.DragAndDrop.onDragStop(function(sender, msg) {
	// do something here
}, this);
*/

/**
	Executes the callback passed when a drop occurs in the widget. If one has multiple dropZones in a widget it is easier to use <a href="#addDropZoneHandler">addDropZoneHandler</a>
	@name onDrop
	@methodOf OWF.DragAndDrop
	
	@param {Function} callback The function to execute as a callback.
	@param {Object} scope The scope (this reference) in which the function is executed. If omitted, defaults to the browser window.

	@example

OWF.DragAndDrop.onDrop(function(sender, msg) {
	var data = msg.dragDropData;

	// do something with the data here
}, this);
	*/

// --------------------------------------------------------------------------------------------------
// ------------------- Launcher ---------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

/**
	Launches a Widget based on the config.
	@name launch
	@methodOf OWF.Launcher

	@param {Object} config object see example for structure
	@param {Function} callback a function to be called once after the launchWidget is executed

	@example
OWF.Launcher.launch({
	guid: 'guid_of_widget_to_launch',
	launchOnlyIfClosed: true,	//if true will only launch the widget if it is not already opened.
								//if it is opened then the widget will be brought to focus
	data: dataString			//initial launch data to be passed to a widget only if the widget is opened. This must be a string.
}, callback);
 */

/**
	Retrieves initial launch data for this widget if it is opened by another widget.
	@name getLaunchData
	@methodOf OWF.Launcher

	@returns {Object} data object which contains initial launch data for the widget 

	@example
var launchData = OWF.Launcher.getLaunchData();
if (launchData != null) {
	var data = Ozone.util.parseJson(launchData);  //in this example the data object has two fields: channel and message
	if (data != null) {
		//do something with the data
		OWF.Eventing.subscribe(data.channel, function() {});
	}
}
*/

// --------------------------------------------------------------------------------------------------
// ------------------- Chrome -----------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

/**
	Checks to see if the Widget Chrome has already been modified.  This is useful when the widget iframe is reloaded.
	@name isModified
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Function} cfg.callback The function which receives the results.
	This method will be passed an object which has following properties. <br>
	<br>
		{Boolean} success: true if the widget is currently opened on the dashboard, or else false. <br>
		{Boolean} modified: true if the widget chrome(header) is modified, or else false. <br>
	*
	@example
OWF.Chrome.isModified({
	callback: function(msg) {
		//msg will always be a json string
		var res = Ozone.util.parseJson(msg);
		if (res.success) {
			//if the chrome was never modified
			if (!res.modified) {
			   //do something, perhaps add buttons
			}
			//if we already modified the chrome
			else {
			  //do something or perhaps nothing if the buttons are already added
			}
		}
	}
});
*/


/**
	Adds buttons to the Widget Chrome. Buttons are added after existing buttons.
	@name addHeaderButtons
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Object[]} cfg.items an array of buttons configurations to add to the chrome.  See example for button configs
	@param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
	@param {String} cfg.items[*].xtype xtype is ExtJS-like property used to determine the component to create.  Currently the Widget Chrome API only supports two xtype values: ‘button’ and ‘widgettool’.  xtype is an optional field, if it is omitted ‘widgettool’ is used.
	@param {String} cfg.items[*].type Used only for ‘widgettool’ buttons.  It determines the standard icon to be used.  For a complete list of types please see the ExtJS 4.x API documentation, <a href='http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type'>http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type</a>
	@param {String} cfg.items[*].icon This property defines the URL of the image to be used for the button.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
	@param {String} cfg.items[*].text This property defines text to appear alongside the button.  This property is only used if the xtype is ‘button.’  ‘widgettool’ will not show text.
	@param {Object} cfg.items[*].tooltip This property defines a tooltip.  It has two important sub properties, title and text.  tooltip is only used when the xtype is ‘button’
	@param {Function} cfg.items[*].handler The handler attribute defines a function to be executed when the button is pressed. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function’s parameter list contains the standard parameters for an Eventing callback function.
	
	@example
OWF.Chrome.addHeaderButtons({
	items: [
		{
			xtype: 'button',
			//path to an image to use. this path should either be fully qualified or relative to the /owf context
			icon: './themes/common/images/skin/exclamation.png',
			text: 'Alert',
			itemId:'alert',
			tooltip:  {
			  text: 'Alert!'
			},
			handler: function(sender, data) {
				//widgetState is an already instantiated WidgetState Obj
				if (widgetState) {
					widgetState.getWidgetState({
						callback: function(state) {
							//check if the widget is visible
							if (!state.collapsed && !state.minimized && state.active) {
								//only render visual content, perhaps popup a message box if the widget is visible
								//otherwise it may not render correctly
							}
						}
					});
				}
			}
		},
		{
			xtype: 'widgettool',
			//path to an image to use. this path should either be fully qualified or relative to the /owf context
			icon: './themes/common/images/skin/information.png',
			itemId:'help',
			handler: function(sender, data) {
				alert('About Button Pressed');
			}
		},
		{
			//gear is a standard ext tool type
			type: 'gear',
			itemId:'gear',
			handler: function(sender, data) {
				alert('Utility Button Pressed');
			}
		}
	]
});
   */

/**
	Updates any existing buttons in the Widget Chrome based on the itemId.
	@name updateHeaderButtons
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Object[]} cfg.items an array of buttons configurations to add to the chrome.  See example below for button configs
	@param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
	@param {String} cfg.items[*].xtype xtype is ExtJS-like property used to determine the component to create.  Currently the Widget Chrome API only supports two xtype values: ‘button’ and ‘widgettool’.  xtype is an optional field, if it is omitted ‘widgettool’ is used.
	@param {String} cfg.items[*].type Used only for ‘widgettool’ buttons.  It determines the standard icon to be used.  For a complete list of types please see the ExtJS 4.x API documentation, <a href='http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type'>http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type</a>
	@param {String} cfg.items[*].icon This property defines the URL of the image to be used for the button.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
	@param {String} cfg.items[*].text This property defines text to appear alongside the button.  This property is only used if the xtype is ‘button.’  ‘widgettool’ will not show text.
	@param {Object} cfg.items[*].tooltip This property defines a tooltip.  It has two important sub properties, title and text.  tooltip is only used when the xtype is ‘button’
	@param {Function} cfg.items[*].handler The handler attribute defines a function to be executed when the button is pressed. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function’s parameter list contains the standard parameters for an Eventing callback function.
		
	@example
OWF.Chrome.updateHeaderButtons({
	items: [
		{
			xtype: 'button',
			//path to an image to use. this path should either be fully qualified or relative to the /owf context
			icon: './themes/common/images/skin/exclamation.png',
			text: 'Alert',
			itemId:'alert',
			tooltip:  {
			  text: 'Alert!'
			},
			handler: function(sender, data) {
				//widgetState is an already instantiated WidgetState Obj
				if (widgetState) {
					widgetState.getWidgetState({
						callback: function(state) {
							//check if the widget is visible
							if (!state.collapsed && !state.minimized && state.active) {
								//only render visual content, perhaps popup a message box if the widget is visible
								//otherwise it may not render correctly
							}
						}
					});
				}
			}
		},
		{
			xtype: 'widgettool',
			//path to an image to use. this path should either be fully qualified or relative to the /owf context
			icon: './themes/common/images/skin/information.png',
			itemId:'help',
			handler: function(sender, data) {
				alert('About Button Pressed');
			}
		},
		{
			//gear is a standard ext tool type
			type: 'gear',
			itemId:'gear',
			handler: function(sender, data) {
				alert('Utility Button Pressed');
			}
		}
	]
});
*/

/**
	Inserts new buttons to the Widget Chrome.  Buttons are added to the same area as existing buttons.
	@name insertHeaderButtons
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Number} [cfg.pos=0] 0-based index of where buttons will be added, among any pre-existing buttons.
	@param {Object[]} cfg.items an array of buttons configurations to insert to the chrome.  See example below for button configs
	@param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
	@param {String} cfg.items[*].xtype xtype is ExtJS-like property used to determine the component to create.  Currently the Widget Chrome API only supports two xtype values: ‘button’ and ‘widgettool’.  xtype is an optional field, if it is omitted ‘widgettool’ is used.
	@param {String} cfg.items[*].type Used only for ‘widgettool’ buttons.  It determines the standard icon to be used.  For a complete list of types please see the ExtJS 4.x API documentation, <a href='http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type'>http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type</a>
	@param {String} cfg.items[*].icon This property defines the URL of the image to be used for the button.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
	@param {String} cfg.items[*].text This property defines text to appear alongside the button.  This property is only used if the xtype is ‘button.’  ‘widgettool’ will not show text.
	@param {Object} cfg.items[*].tooltip This property defines a tooltip.  It has two important sub properties, title and text.  tooltip is only used when the xtype is ‘button’
	@param {Function} cfg.items[*].handler The handler attribute defines a function to be executed when the button is pressed. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function’s parameter list contains the standard parameters for an Eventing callback function.
	
	@example
OWF.Chrome.insertHeaderButtons({
	pos: 0,
	items: [
		{
			xtype: 'button',
			//path to an image to use. this path should either be fully qualified or relative to the /owf context
			icon: './themes/common/images/skin/exclamation.png',
			text: 'Alert',
			itemId:'alert',
			tooltip:  {
				text: 'Alert!'
			},
			handler: function(sender, data) {
				//widgetState is an already instantiated WidgetState Obj
				if (widgetState) {
					widgetState.getWidgetState({
						callback: function(state) {
							//check if the widget is visible
							if (!state.collapsed && !state.minimized && state.active) {
								//only render visual content, perhaps popup a message box if the widget is visible
								//otherwise it may not render correctly
							}
						}
					});
				}
			}
		},
		{
			xtype: 'widgettool',
			//path to an image to use. this path should either be fully qualified or relative to the /owf context
			icon: './themes/common/images/skin/information.png',
			itemId:'help',
			handler: function(sender, data) {
				alert('About Button Pressed');
			}
		},
			{
			//gear is a standard ext tool type
			type: 'gear',
			itemId:'gear',
			handler: function(sender, data) {
				alert('Utility Button Pressed');
			}
		}
	]
});
*/

/**
	Removes existing buttons on the Widget Chrome based on itemId.
	@name removeHeaderButtons
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Object[]} cfg.items an array of buttons configurations to remove to the chrome.  Only itemId is required.
	See example below for button configs
	@param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
	
	@example
OWF.Chrome.removeHeaderButtons({
		items:[
			{
				itemId:'alert'
			},
			{
				itemId:'help'
			},
			{
				itemId:'gear'
			}
		]
});
*/

/**
	Lists all buttons that have been added to the widget chrome.
	@name listHeaderButtons
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Function} cfg.callback The function which receives the results.
	
	@example
OWF.Chrome.listHeaderButtons({
	callback: function(msg) {
		//msg will always be a json string
		var res = Ozone.util.parseJson(msg);
		if (res.success) {
			for (var i = 0; i < res.items.length; i++) {
				// do something with the buttons
			}
		}
	}
});
*/

/**
	Adds menus to the Widget Chrome.  Menus are added after existing menus.
	@name addHeaderMenus
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Object[]} cfg.items an array of menu configurations to add to the chrome.  See example for menu configs
	@param {String} cfg.items[*].parentId itemId is the itemId of the menu to which this configuration should be added as a sub-menu.  If omitted, the configuration will be added as a main menu on the menu toolbar.  
	@param {String} cfg.items[*].itemId itemId is a unique id among all menus that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate menus which may not be able to be removed properly.
	@param {String} cfg.items[*].icon This property defines the URL of the image to be used for the menu.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
	@param {String} cfg.items[*].text This property defines text to appear alongside the menu.  
	@param {Object} cfg.items[*].menu menu configuration object
	@param {Object[]} cfg.items[*].menu.items an array of menu item configurations to add to the chrome.  See example for menu item configs
	@param {String} cfg.items[*].menu.items[*].itemId itemId is a unique id among all menu items that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.
	@param {String} cfg.items[*].menu.items[*].xtype xtype is used to specify the type of menu item to add.  This attribute should be omitted unless specifying a menuseparator. Setting this value to "menuseparator" adds a separator bar to a menu, used to divide logical groups of menu items. If specified, only xtype should be specified.  Generally you will add one of these by using "-" in your items config rather than creating one directly using xtype.  See example below for usage. 
	@param {String} cfg.items[*].menu.items[*].icon This property defines the URL of the image to be used for the menu item.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
	@param {String} cfg.items[*].menu.items[*].text This property defines text to appear for the menu item. 
	@param {Function} cfg.items[*].menu.items[*].handler The handler attribute defines a function to be executed when the menu item is clicked. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function's parameter list contains the standard parameters for an Eventing callback function.
	@param {Object} cfg.items[*].menu.items[*].menu sub-menu configuration object.  See example for sub-menu config.
	
	@example
OWF.Chrome.addHeaderMenus({
	items: [
		{
			itemId:'regularMenu',
			icon: './themes/common/images/skin/exclamation.png',
			text: 'Regular Menu',
			menu: {
				items: [
					{
						itemId:'regularMenuItem1',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Regular Menu Item 1',
						handler: function(sender, data) {
							alert('You clicked the Regular Menu menu item.');
						}
					}
				]
			}
		},
		{
			itemId:'snacks',
			icon: './themes/common/images/skin/exclamation.png',
			text: 'Menu with Sub-Menu',
			menu: {
				items: [
					{
						itemId:'fruits',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Fruits',
						menu: {
							items: [
								{
									itemId:'apple',
									icon: './themes/common/images/skin/exclamation.png',
									text: 'Apple',
									handler: function(sender, data) {
										alert('Your snack will be an Apple.');
									}
								},
							   {
								   xtype: 'menuseparator'
							   },
								{
									itemId:'banana',
									icon: './themes/common/images/skin/exclamation.png',
									text: 'Banana',
									handler: function(sender, data) {
										alert('Your snack will be a Banana.');
									}
								}, {
									itemId:'cherry',
									icon: './themes/common/images/skin/exclamation.png',
									text: 'Cherries',
									handler: function(sender, data) {
										alert('Your snack will be Cherries.');
									}
								}
							]
						}
					},
					'-', // another way to add a menu separator 
					{
						itemId:'cupcake',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Cupcake',
						handler: function(sender, data) {
							alert('Your snack will be a Cupcake.');
						}
					},
					{
						itemId:'chips',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Potato Chips',
						handler: function(sender, data) {
							alert('Your snack will be a Potato Chips.');
						}
					}
				]
			}
		}
	]
});
*/

/**
	Updates any existing menus in the Widget Chrome based on the itemId.
	@name updateHeaderMenus
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Object[]} cfg.items an array of menu configurations to add to the chrome.  See example for menu configs
	@param {String} cfg.items[*].itemId itemId is a unique id among all menus that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate menus which may not be able to be removed properly.
	@param {String} cfg.items[*].icon This property defines the URL of the image to be used for the menu.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
	@param {String} cfg.items[*].text This property defines text to appear alongside the menu.  
	@param {Object} cfg.items[*].menu menu configuration object
	@param {Object[]} cfg.items[*].menu.items an array of menu item configurations to add to the chrome.  See example for menu item configs
	@param {String} cfg.items[*].menu.items[*].itemId itemId is a unique id among all menu items that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.
	@param {String} cfg.items[*].menu.items[*].xtype xtype is used to specify the type of menu item to add.  This attribute should be omitted unless specifying a menuseparator. Setting this value to "menuseparator" adds a separator bar to a menu, used to divide logical groups of menu items. If specified, only xtype should be specified.  See example below for usage.
	@param {String} cfg.items[*].menu.items[*].icon This property defines the URL of the image to be used for the menu item.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
	@param {String} cfg.items[*].menu.items[*].text This property defines text to appear for the menu item. 
	@param {Function} cfg.items[*].menu.items[*].handler The handler attribute defines a function to be executed when the menu item is clicked. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function's parameter list contains the standard parameters for an Eventing callback function.
	@param {Object} cfg.items[*].menu.items[*].menu sub-menu configuration object.  See example for sub-menu config.
	
	@example
OWF.Chrome.updateHeaderMenus({
	items:[
		{
			itemId:'regularMenu',
			icon: './themes/common/images/skin/exclamation.png',
			text: 'Regular Menu',
			menu: {
				items: [
					{
						itemId:'regularMenuItem1',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Regular Menu Item 1',
						handler: function(sender, data) {
							alert('You clicked the Regular Menu menu item.');
						}
					}
				]
			}
		},
		{
			itemId:'snacks',
			icon: './themes/common/images/skin/exclamation.png',
			text: 'Menu with Sub-Menu',
			menu: {
				items: [
					{
						itemId:'fruits',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Fruits',
						menu: {
							items: [
								{
									itemId:'apple',
									icon: './themes/common/images/skin/exclamation.png',
									text: 'Apple',
									handler: function(sender, data) {
										alert('Your snack will be an Apple.');
									}
								},
							   {
								   xtype: 'menuseparator'
							   },
								{
									itemId:'banana',
									icon: './themes/common/images/skin/exclamation.png',
									text: 'Banana',
									handler: function(sender, data) {
										alert('Your snack will be a Banana.');
									}
								}, {
									itemId:'cherry',
									icon: './themes/common/images/skin/exclamation.png',
									text: 'Cherries',
									handler: function(sender, data) {
										alert('Your snack will be Cherries.');
									}
								}
							]
						}
					},
					'-', // another way to add a menu separator 
					{
						itemId:'cupcake',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Cupcake',
						handler: function(sender, data) {
							alert('Your snack will be a Cupcake.');
						}
					},
					{
						itemId:'chips',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Potato Chips',
						handler: function(sender, data) {
							alert('Your snack will be a Potato Chips.');
						}
					}
				]
			}
		}
	]
});
*/

/**
	Inserts new menus into the Widget Chrome. Menus are added to the same area as existing menus.
	@name insertHeaderMenus
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Number} [cfg.pos=0] 0-based index of where menus will be added, among any pre-existing menus.
	@param {Object[]} cfg.items an array of menu configurations to add to the chrome.  See example for menu configs
	@param {String} cfg.items[*].parentId itemId is the itemId of the menu to which this configuration should be added as a sub-menu.  If omitted, the configuration will be added as a main menu on the menu toolbar.  
	@param {String} cfg.items[*].itemId itemId is a unique id among all menus that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate menus which may not be able to be removed properly.
	@param {String} cfg.items[*].icon This property defines the URL of the image to be used for the menu.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
	@param {String} cfg.items[*].text This property defines text to appear alongside the menu.  This property is only used if the xtype is ‘menu.’  ‘widgettool’ will not show text.
	@param {Object} cfg.items[*].menu menu configuration object
	@param {Object[]} cfg.items[*].menu.items an array of menu item configurations to add to the chrome.  See example for menu item configs
	@param {String} cfg.items[*].menu.items[*].itemId itemId is a unique id among all menu items that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.
	@param {String} cfg.items[*].menu.items[*].xtype xtype is used to specify the type of menu item to add.  This attribute should be omitted unless specifying a menuseparator. Setting this value to "menuseparator" adds a separator bar to a menu, used to divide logical groups of menu items. If specified, only xtype should be specified.  See example below for usage.
	@param {String} cfg.items[*].menu.items[*].icon This property defines the URL of the image to be used for the menu item.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
	@param {String} cfg.items[*].menu.items[*].text This property defines text to appear for the menu item. 
	@param {Function} cfg.items[*].menu.items[*].handler The handler attribute defines a function to be executed when the menu item is clicked. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function's parameter list contains the standard parameters for an Eventing callback function.
	@param {Object} cfg.items[*].menu.items[*].menu sub-menu configuration object.  See example for sub-menu config.
	
	@example
OWF.Chrome.insertHeaderMenus({
		pos: 0,
		items: [{
		 itemId:'insertedMenu',
			icon: './themes/common/images/skin/exclamation.png',
			text: 'Inserted Menu',
			menu: {
				items: [
					{
						itemId:'insertedMenuItem1',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Inserted Menu Item 1',
						handler: function(sender, data) {
							alert('You clicked the Inserted Menu menu item.');
						}
					},
					{
						xtype: 'menuseparator'
					},
					{
						itemId:'insertedMenuItem2',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Inserted Menu Item 2',
						handler: function(sender, data) {
							alert('You clicked the Inserted Menu menu item.');
						}
					},
					'-', // another way to add a menu separator 
					{
						itemId:'insertedMenuItem3',
						icon: './themes/common/images/skin/exclamation.png',
						text: 'Inserted Menu Item 3',
						handler: function(sender, data) {
							alert('You clicked the Inserted Menu menu item.');
						}
					}
				]
			}
		}]
});
*/

/**
	Removes existing menus on the Widget Chrome based on itemId.
	@name removeHeaderMenus
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Object[]} cfg.items an array of objects containing itemIds for the menus to remove from the chrome.
	  See example below for button configs
	
	@example
OWF.Chrome.removeHeaderMenus({
	items: [{
		itemId: 'regularMenu'
	}]
});
*/

/**
	Lists all menus that have been added to the widget chrome.
	@name listHeaderMenus
	@methodOf OWF.Chrome

	@param {Object} cfg config object see below for properties
	@param {Function} cfg.callback The function which receives the results.
	
	@example
OWF.Chrome.listHeaderMenus({
	callback: function(msg) {
		//msg will always be a json string
		var res = Ozone.util.parseJson(msg);
		if (res.success) {
			for (var i = 0; i < res.items.length; i++) {
				// do something with the menus
			}
		}
	}
});
	*/

// --------------------------------------------------------------------------------------------------
// ------------------- Preferences ------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------

/**
	Get the url for the Preference Server
	@name getUrl
	@methodOf OWF.Preferences

	@returns {String} url
 */

/**
	Sets the url for the Preference Server
	@name setUrl
	@methodOf OWF.Preferences

	@param {String} url
	@returns void
 */

/**
	Gets the dashboard with the specified id
	@name getDashboard
	@methodOf OWF.Preferences
	
	@param {Object} cfg config object see below for properties
	@param {String} cfg.dashboardId Unigue dashbard identifier
	@param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a dashboard.
	This method will be passed the dashboard object which has the following properties:<br>
	<br>
		{Boolean} alteredByAdmin: true if altered by an administrator<br>
		{Date} createdDate: date dashboard was created<br>
		{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		{String} layout: layout of dashboard<br>
		{Boolean} isdefault: true if this is a default dashboard<br>
		{String} name: name of dashboard<br>
		{Number} columnCount: number of columns if dashboard is a portal type<br>
		{Object} user: the dashoard owner.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		{List} EDashboardLayoutList: list of dashboard types<br>
		{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		{Object} createdBy: dashboard creator.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
		{Date} editedDate: date dashboard was last edited<br>
		{Array} groups:  groups dashboard is assigned to<br>
		{String} description: description of dashboard<br>
		{String} guid: uniqued dashboard identifier<br>
		{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
	<br>
		@param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
		
		@example
var onSuccess = function(dashboard) {
	alert(dashboard.name);
};
var onFailure = function(error) {
	alert(error);
};

OWF.Preferences.getDashboard({
	dashboardId:'917b4cd0-ecbd-410b-afd9-42d150c26426',
	onSuccess:onSuccess,
	onFailure:onFailure
});
 */

/**
	Gets the user's default dashboard
	@name getDefaultDashboard
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
	This method will be passed the dashboard object which has the following properties:<br>
	<br>
		{Boolean} alteredByAdmin: true if altered by an administrator<br>
		{Date} createdDate: date dashboard was created<br>
		{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		{String} layout: layout of dashboard<br>
		{Boolean} isdefault: true if this is a default dashboard<br>
		{String} name: name of dashboard<br>
		{Number} columnCount: number of columns if dashboard is a portal type<br>
		{Object} user: the dashoard owner.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		{List} EDashboardLayoutList: list of dashboard types<br>
		{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		{Object} createdBy: dashboard creator.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
		{Date} editedDate: date dashboard was last edited<br>
		{Array} groups:  groups dashboard is assigned to<br>
		{String} description: description of dashboard<br>
		{String} guid: uniqued dashboard identifier<br>
		{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
		<br>
		@param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
		
		@example
var onSuccess = function(dashboard) {
	alert(dashboard.name);
};
var onFailure = function(error) {
	alert(error);
};
OWF.Preferences.getDefaultDashboard({
	onSuccess:onSuccess,
	onFailure:onFailure
});
 */

/**
	Sets the user's default dashboard
	@name setDefaultDashboard
	@methodOf OWF.Preferences
	@param {Object} cfg config object see below for properties
	@param {String} cfg.dashboardId Unigue dashbard identifier
	@param {Boolean} cfg.isDefault true to set as default dashboard
	@param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
	This method will be passed the dashboard object which has the following properties:<br>
	<br>
		{Boolean} alteredByAdmin: true if altered by an administrator<br>
		{Date} createdDate: date dashboard was created<br>
		{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		{String} layout: layout of dashboard<br>
		{Boolean} isdefault: true if this is a default dashboard<br>
		{String} name: name of dashboard<br>
		{Number} columnCount: number of columns if dashboard is a portal type<br>
		{Object} user: the dashoard owner.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		{List} EDashboardLayoutList: list of dashboard types<br>
		{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		{Object} createdBy: dashboard creator.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
		{Date} editedDate: date dashboard was last edited<br>
		{Array} groups:  groups dashboard is assigned to<br>
		{String} description: description of dashboard<br>
		{String} guid: uniqued dashboard identifier<br>
		{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
	<br>
	@param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
	
	@example
var onSuccess = function(dashboard) {
	alert(dashboard.name);
};

var onFailure = function(error) {
	alert(error);
};

OWF.Preferences.setDefaultDashboard({
	dashboardId:'917b4cd0-ecbd-410b-afd9-42d150c26426',
	isDefault:true,
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	@description Saves changes to a new or existing dashboard
	@name createOrUpdateDashboard
	@methodOf OWF.Preferences
	@param {Object} cfg config object see below for properties
	@param {Object} cfg.json The encoded JSON object representing the dashboard.
	The dashboard object has the following properties:<br>
	<br>
		{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		{String} layout: layout of dashboard<br>
		{Boolean} isdefault: true if this is a default dashboard<br>
		{String} name: name of dashboard<br>
		{Number} columnCount: number of columns if dashboard is a portal type<br>
		{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		{Array} groups:  groups dashboard is assigned to<br>
		{String} description: description of dashboard<br>
		{String} guid: uniqued dashboard identifier<br>
		{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
	<br>
	@param {Boolean} cfg.saveAsNew A Boolean indicating whether the entity being saved is new.
	@param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
	This method will be passed the dashboard object which has the following properties:<br>
	<br>
		{Boolean} alteredByAdmin: true if altered by an administrator<br>
		{Date} createdDate: date dashboard was created<br>
		{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		{String} layout: layout of dashboard<br>
		{Boolean} isdefault: true if this is a default dashboard<br>
		{String} name: name of dashboard<br>
		{Number} columnCount: number of columns if dashboard is a portal type<br>
		{Object} user: the dashoard owner.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		{List} EDashboardLayoutList: list of dashboard types<br>
		{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		{Object} createdBy: dashboard creator.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
		{Date} editedDate: date dashboard was last edited<br>
		{Array} groups:  groups dashboard is assigned to<br>
		{String} description: description of dashboard<br>
		{String} guid: uniqued dashboard identifier<br>
		{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
	<br>
	@param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
	@param {Boolean} [cfg.async] Async true or false defaults to true
	@example

var onSuccess = function(dashboard) {
	alert(dashboard.name);
};

var onFailure = function(error) {
	alert(error);
};

var dashboard = {
	isGroupDashboard: false,
	layout: 'desktop',
	isdefault: false,
	name: 'My Dashboard',
	columnCount: 0,
	defaultSettings: {},
	groups: [],
	description: 'This is my dashboard',
	guid: guid.util.guid(),
	state: [],
	showLaunchMenu: false
};

OWF.Preferences.createOrUpdateDashboard({
	json: dashboard,
	saveAsNew: true,
	onSuccess: onSuccess,
	onFailure: onFailure,
	async: true
});
*/

/**
	@description Copies an existing dashboard and saves it as new
	@name cloneDashboard
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {Object} cfg.json The encoded JSON object representing the dashboard.
	The dashboard object has the following properties:<br>
	<br>
		{Boolean} alteredByAdmin: true if altered by an administrator<br>
		{Date} createdDate: date dashboard was created<br>
		{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		{String} layout: layout of dashboard<br>
		{Boolean} isdefault: true if this is a default dashboard<br>
		{String} name: name of dashboard<br>
		{Number} columnCount: number of columns if dashboard is a portal type<br>
		{Object} user: the dashoard owner.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		{List} EDashboardLayoutList: list of dashboard types<br>
		{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		{Object} createdBy: dashboard creator.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
		{Date} editedDate: date dashboard was last edited<br>
		{Array} groups:  groups dashboard is assigned to<br>
		{String} description: description of dashboard<br>
		{String} guid: uniqued dashboard identifier<br>
		{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
	<br>
	@param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
	This method will be passed the dashboard object which has the following properties:<br>
	<br>
		{Boolean} alteredByAdmin: true if altered by an administrator<br>
		{Date} createdDate: date dashboard was created<br>
		{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		{String} layout: layout of dashboard<br>
		{Boolean} isdefault: true if this is a default dashboard<br>
		{String} name: name of dashboard<br>
		{Number} columnCount: number of columns if dashboard is a portal type<br>
		{Object} user: the dashoard owner.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		{List} EDashboardLayoutList: list of dashboard types<br>
		{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		{Object} createdBy: dashboard creator.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
		{Date} editedDate: date dashboard was last edited<br>
		{Array} groups:  groups dashboard is assigned to<br>
		{String} description: description of dashboard<br>
		{String} guid: uniqued dashboard identifier<br>
		{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
	<br>
	@param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
	
	@example
var onSuccess = function(dashboard) {
	alert(dashboard.name);
};

var onFailure = function(error) {
	alert(error);
};

var dashboard = {
	alteredByAdmin: 'false',
	createdDate: '04/18/2012 11:29 AM EDT',
	isGroupDashboard: false,
	layout: 'desktop',
	isdefault: false,
	name: 'My Dashboard',
	columnCount: 0,
	user: {
		userId: 'testAdmin1',
	},
	EDashboardLayoutList: ['accordion', 'desktop', 'portal', 'tabbed'],
	defaultSettings: {},
	createdBy: {
		userId: 'testAdmin1',
		userRealName: 'Test Admin 1'
	},
	editedDate: '04/18/2012 11:29 AM EDT',
	groups: [],
	description: 'This is my dashboard',
	guid: guid.util.guid(),
	state: [],
	showLaunchMenu: false
};

OWF.Preferences.cloneDashboard({
	json: dashboard,
	onSuccess: onSuccess,
	onFailure: onFailure
});
 */

/**
	@description Saves changes to existing dashboards
	@name updateAndDeleteDashboards
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {Array} cfg.viewsToUpdate array of JSON objects containing the view guid and data to be updated
	@param {Array} cfg.viewGuidsToDelete array of guids of views to be deleted
	@param {Boolean} cfg.updateOrder flag to update order
	@param {Function} cfg.onSuccess callback function to capture the success result
	@param {Function} [cfg.onFailure] callback to execute if there is an error (optional, a default alert provided)
 */

/**
	@description Deletes the dashboard with the specified id
	@name deleteDashboard
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {String} cfg.dashboardId Unigue dashbard identifier
	@param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
	This method will be passed the dashboard object which has the following properties:<br>
	<br>
		{Boolean} alteredByAdmin: true if altered by an administrator<br>
		{Date} createdDate: date dashboard was created<br>
		{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		{String} layout: layout of dashboard<br>
		{Boolean} isdefault: true if this is a default dashboard<br>
		{String} name: name of dashboard<br>
		{Number} columnCount: number of columns if dashboard is a portal type<br>
		{Object} user: the dashoard owner.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		{List} EDashboardLayoutList: list of dashboard types<br>
		{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		{Object} createdBy: dashboard creator.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
		{Date} editedDate: date dashboard was last edited<br>
		{Array} groups:  groups dashboard is assigned to<br>
		{String} description: description of dashboard<br>
		{String} guid: uniqued dashboard identifier<br>
		{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
	<br>
	@param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
	
	@example
var onSuccess = function(dashboard) {
	alert(dashboard.name);
};

var onFailure = function(error) {
	 alert(error);
};

OWF.Preferences.deleteDashboard({
	dashboardId:'917b4cd0-ecbd-410b-afd9-42d150c26426',
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	@description Returns all dashboards for the logged in user.
	@name findDashboards
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {Function} cfg.onSuccess Callback function to capture the success result.
	This method is passed an object having the following properties:<br>
	<br>
		{Boolean} success: true if dashboards found<br>
		{Number} results: number of dashboards found<br>
		{Array} data: array of dashboards objects found.  Dashboard object has the following properties:<br>
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} alteredByAdmin: true if altered by an administrator<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Date} createdDate: date dashboard was created<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} layout: layout of dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isdefault: true if this is a default dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: name of dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnCount: number of columns if dashboard is a portal type<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Object} user: the dashoard owner.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{List} EDashboardLayoutList: list of dashboard types<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Object} createdBy: dashboard creator.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Date} editedDate: date dashboard was last edited<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} groups:  groups dashboard is assigned to<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} description: description of dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} guid: uniqued dashboard identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
		<br>
	<br>
	@param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
	
	@example
var onSuccess = function(obj) {
	alert(obj.results);
	if (obj.results > 0) {
		for (var i = 0; i < obj.results; i++) {
			alert(obj.data[i].name);
		}
	}
};

var onFailure = function(error) {
	alert(error);
};

OWF.Preferences.findDashboards({
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	@description Returns all dashboards for the logged in user filtered by the type of dashboard.
	@name findDashboardsByType
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {String} cfg.type A string representing the type of dashboard. If using built in dashboard types, this would include desktop, tabbed, portal, and accordion.
	@param {Function} cfg.onSuccess Callback function to capture the success result.
	This method is passed an object having the following properties:<br>
	<br>
		{Boolean} success: true if dashboards found<br>
		{Number} results: number of dashboards found<br>
		{Array} data: array of dashboards objects found.  Dashboard object has the following properties:<br>
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} alteredByAdmin: true if altered by an administrator<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Date} createdDate: date dashboard was created<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} layout: layout of dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isdefault: true if this is a default dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} name: name of dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnCount: number of columns if dashboard is a portal type<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Object} user: the dashoard owner.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{List} EDashboardLayoutList: list of dashboard types<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Object} createdBy: dashboard creator.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Date} editedDate: date dashboard was last edited<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} groups:  groups dashboard is assigned to<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} description: description of dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} guid: uniqued dashboard identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} state: array of widget state objects.  Has the following properties:<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetGuid: unique widget identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} zIndex: in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} region: containing region on dashboard.  Dashboard type specific.<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} pinned: true if widget is pinned open<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} buttonId: identifier of button that opens widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} columnPos: position of widget in a column<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} name: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} statePosition<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} active: true if this widget is the active (has focus) widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} uniqueId: unique widget identifier on dashboard<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} buttonOpened: true if button launched widget is opened<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} collapsed: true if widget is collapsed<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} showLaunchMenu: true if launch menu is opened on dashboard<br>
		<br>
	<br>
	@param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
	
	@example	
var onSuccess = function(obj) {
	alert(obj.results);
	if (obj.results > 0) {
		for (var i = 0; i < obj.results; i++) {
			alert(obj.data[i].name);
		}
	}
};

var onFailure = function(error) {
	alert(error);
};

OWF.Preferences.findDashboardsByType({
	type:'desktop',
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	@description Gets the widget with the specified id
	@name getWidget
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {String} cfg.widgetId The unique identifier (normally a guid) for the widget.
	@param {Function} cfg.onSuccess Callback function to capture the success result. Callback is passed the following object as a parameter: {id:Number, namespace:String, value:Object, path:String}
	This method is passed an object having the following properties:<br>
	<br>
		{Number} id: database pk identifier<br>
		{String} namespace: "widget"<br>
		{Object} value: widget object having the following properties:<br>
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} editable: true if widget can be edited<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} visible: true if widget is visible<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} position<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: widget owner identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: widget owner name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} namespace: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} url: url of widget application<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} headerIcon: url of widget header icon<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} image: url of widget image<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} smallIconUrl: url of widget's small icon<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} largeIconUrl: url of widget's large icon<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of the widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of the widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetVersion: widget version<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} tags: array of tag strings<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} definitionVisible: true if definition is visible<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} singleton: true if widget is a singleton<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} background: true if widget runs in the background<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} allRequired: array of all widgets required by this widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} directRequired: array of all widgets directly required by this widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} widgetTypes: array of widget types this widget belongs to<br>
		<br>
		{String} path: unnique widget identifier<br>
	<br>
	@param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
	
	@example	
var onSuccess = function(obj) {
	if (obj.value) {
		alert(obj.value.namespace);
	}
};

var onFailure = function(error) {
	alert(error);
};

OWF.Preferences.getWidget({
	widgetId:'ea5435cf-4021-4f2a-ba69-dde451d12551',
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	@description Gets all widgets for a given user.
	@name findWidgets
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {Boolean} [cfg.userOnly] boolean flag that determines whether to only return widgets assigned to the user (excluding widgets to which the user only has access via their assigned groups)
	@param {Object} [cfg.searchParams] object containing search parameters
	@param {String} [cfg.searchParams.widgetName] name of widget '%' are wildcards
	@param {String} [cfg.searchParams.widgetNameExactMatch] true or false to match the name exactly. defaults to false
	@param {String} [cfg.searchParams.widgetVersion] version of widget '%' are wildcards
	@param {String} [cfg.searchParams.widgetGuid] guid of widget '%' are wildcards
	@param {Function} cfg.onSuccess callback function to capture the success result.
	This method is passed an array of objects having the following properties:<br>
	<br>
		{Number} id: database pk identifier<br>
		{String} namespace: "widget"<br>
		{Object} value: widget object having the following properties:<br>
		<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} editable: true if widget can be edited<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} visible: true if widget is visible<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} position<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: widget owner identifier<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: widget owner name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} namespace: widget name<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} url: url of widget application<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} headerIcon: url of widget header icon<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} image: url of widget image<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} smallIconUrl: url of widget's small icon<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} largeIconUrl: url of widget's large icon<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of the widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of the widget in pixels<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{String} widgetVersion: widget version<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} tags: array of tag strings<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} definitionVisible: true if definition is visible<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} singleton: true if widget is a singleton<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Boolean} background: true if widget runs in the background<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} allRequired: array of all widgets required by this widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} directRequired: array of all widgets directly required by this widget<br>
		&nbsp;&nbsp;&nbsp;&nbsp;{Array} widgetTypes: array of widget types this widget belongs to<br>
		<br>
		{String} path: unnique widget identifier<br>
	<br>
	@param {Function} [cfg.onFailure] callback to execute if there is an error (optional, a default alert provided).  This callback is called with two parameters: a error message string, and optionally a status code
	
	@example
var onSuccess = function(widgets) {
	if (widgets.length > 0) {
		alert(widgets[0].value.namespace);
	}
};

var onFailure = function(error, status) {
	alert(error);
};

OWF.Preferences.findWidgets({
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	@description Saves changes to existing widgets
	@name updateAndDeleteWidgets
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {Array} cfg.widgetsToUpdate array of JSON objects containing the widget guid and data to be updated
	@param {Array} cfg.widgetGuidsToDelete array of guids of widgets to be deleted
	@param {Boolean} cfg.updateOrder flag to update order
	@param {Function} cfg.onSuccess callback function to capture the success result
	@param {Function} [cfg.onFailure] callback to execute if there is an error (optional, a default alert provided)
 */

/**
	@description Retrieves the user preference for the provided name and namespace
	@name getUserPreference
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {String} cfg.namespace The namespace of the requested user preference
	@param {String} cfg.name The name of the requested user preference
	@param {Function} cfg.onSuccess The function to be called if the user preference is successfully retrieved from
	the database.  This function takes a single argument, which is a JSON object.  If a preference is found, the
	complete JSON structure as shown below will be returned.  If it is not found this function be passed an empty JSON object.
	@example
The following is an example of a complete preference object passed to the onSuccess
function:
{
	"value":"true",
	"path":"militaryTime",
	"user":
	{
		"userId":"testAdmin1"
	},
	"namespace":"com.mycompany.AnnouncingClock"
}
		@param {Function} [cfg.onFailure] This parameter is optional. If this function is not specified a default error 
		message will be displayed.This function is called if an error occurs on preference retrieval.  It is not
		called if the preference is simply missing.
		This function should accept two arguments:<br>
		<br>
		error: String<br>
		The error message<br>
		<br>
		Status: The numeric HTTP Status code (if applicable)<br>
		401: You are not authorized to access this entity.<br>
		500: An unexpected error occurred.<br>
		404: The user preference was not found.<br>
		400: The requested entity failed to pass validation.<br>
		
		@example
The following shows how to make a call to getUserPreference:
function onSuccess(pref){
	alert(Ozone.util.toString(pref.value));
}

function onFailure(error,status){
	alert('Error ' + error);
	alert(status);
}

// The following code calls getUserPreference with the above defined onSuccess and
// onFailure callbacks.
OWF.Preferences.getUserPreference({
	namespace:'com.company.widget', 
	name:'First President',
	onSuccess:onSuccess, 
	onFailure:onFailure
});
*/

/**
	@description Checks for the existence of a user preference for a given namespace and name
	@name doesUserPreferenceExist
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {String} cfg.namespace The namespace of the requested user
	@param {String} cfg.name The name of the requested user
	@param {Function} cfg.onSuccess The callback function that is called if a preference successfully return from the database.
	This method is passed an object having the following properties:<br>
	<br>
		{Number} statusCode: status code<br>
		{Boolean} preferenceExist: true if preference exists<br>
	<br>
	@param {Function} [cfg.onFailure] The callback function that is called if the preference could not be found in the database. Callback parameter is an error string.
	
	@example
var onSuccess = function(obj) {
	if (obj.statusCode = 200) {
		alert(obj.preferenceExist);
	}
};

var onFailure = function(error) {
	alert(error);
};

OWF.Preferences.doesUserPreferenceExist({
	namespace:'foo.bar.0',
	name:'test path entry 0',
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	@description retrieves the current user logged into the system
	@name getCurrentUser
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {Function} cfg.onSuccess The callback function that is called for a successful retrieval of the user logged in.
	This method is passed an object having the following properties:<br>
	<br>
		{String} currentUserName: user name<br>
		{String} currentUser: user real name<br>
		{Date} currentUserPrevLogin: previous login date<br>
		{Number} currentId: database pk index<br>
	<br>
	@param {Function} cfg.[onFailure] The callback function that is called when the system is unable to retrieve the current user logged in. Callback parameter is an error string.
	
	@example
var onSuccess = function(obj) {
	if (obj) {
		alert(obj.currentUser);
	}
};

var onFailure = function(error) {
	alert(error);
};

OWF.Preferences.getCurrentUser({
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	@description For retrieving the OWF system server version
	@name getServerVersion
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {Function} cfg.onSuccess The callback function that is called for successfully retrieving the server version of the OWF system.
	This method is passed an object having the following properties:<br>
	<br>
		{String} {serverVersion: server version<br>
	<br>
	@param {Function} [cfg.onFailure] The callback function that is called when the system fails to retrieve the server version of the OWF system. Callback parameter is an error string.
	@example
	
var onSuccess = function(obj) {
	if (obj) {
		alert(obj.serverVersion);
	}
};

var onFailure = function(error) {
	alert(error);
};

OWF.Preferences.getServerVersion({
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	@description Creates or updates a user preference for the provided namespace and name.
	@name setUserPreference
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {String} cfg.namespace  The namespace of the user preference
	@param {String} cfg.name The name of the user preference
	@param {String} cfg.value  The value of the user preference. The value can be any string including JSON.
	@param {Function} cfg.onSuccess The function to be called if the user preference is successfully updated in
	the database.
	
	@example
The following is an example of a complete preference object passed to the onSuccess function:
{
	"value":"true",
	"path":"militaryTime",
	"user": {
		"userId":"testAdmin1"
	},
	"namespace":"com.mycompany.AnnouncingClock"
}
		@param {Function} [cfg.onFailure] The function to be called if the user preference cannot be stored in the database.
		If this function is not specified a default error message will be displayed. This function is passed
		back the following parameters:<br>
		<br>
		error: String<br>
		The error message<br>
		<br>
		Status: The HTTP Status code<br>
		401: You are not authorized to access this entity.<br>
		500: An unexpected error occurred.<br>
		404: The requested entity was not found.<br>
		400: The requested entity failed to pass validation.<br>
		
		@example
function onSuccess(pref){
	alert(pref.value);
}

function onFailure(error,status){
	alert('Error ' + error);
	alert(status);
}

var text = 'George Washington';
OWF.Preferences.setUserPreference({
	namespace:'com.company.widget',
	name:'First President',
	value:text,
	onSuccess:onSuccess,
	onFailure:onFailure
});
*/

/**
	Deletes a user preference with the provided namespace and name.
	@name deleteUserPreference
	@methodOf OWF.Preferences

	@param {Object} cfg config object see below for properties
	@param {String} cfg.namespace The namespace of the user preference
	@param {String} cfg.name The name of the user preference
	@param {Function} cfg.onSuccess The function to be called if the user preference is successfully deleted from the database.
	@example
The following is an example of a complete preference object passed to the onSuccess
function:

{
	"value":"true",
	"path":"militaryTime",
	"user":
	{
		"userId":"testAdmin1"
	},
	"namespace":"com.mycompany.AnnouncingClock"
}
		@param {Function} [cfg.onFailure] The function to be called if the user preference cannot be deleted from the
		database or if the preference does not exist. If this function is not specified a default error message will be
		displayed. This function is passed back the following parameters: <br>
		<br>
		error: String <br>
		The error message <br>
		<br>
		Status: The HTTP Status code<br>
		<br>
		401: You are not authorized to access this entity.<br>
		500: An unexpected error occurred.<br>
		404: The user preference was not found.<br>
		400: The requested entity failed to pass validation. <br>
		<br>
		@example
function onSuccess(pref){
	alert(pref.value);
}

function onFailure(error,status){
	alert('Error ' + error);
	alert(status);
}

OWF.Preferences.deleteUserPreference({
	namespace:'com.company.widget',
	name:'First President',
	onSuccess:onSuccess,
	onFailure:onFailure
});
 */

/**
	This method informs a widget developer if their widget is running from the OWF or from a direct URL call.
	@name isRunningInOWF
	@methodOf OWF.Util

	@returns  boolean true if the widget is inside OWF, false otherwise.
 */

/**
 @name isInContainer
 @methodOf OWF.Util
 * @description This method informs a widget developer if their widget is running
 * in a Container, like OWF
 *
 * @returns  boolean true if the widget is inside a container, false otherwise.
 *
 */

/**
	Returns a globally unique identifier (guid).
	@name guid
	@methodOf OWF.Util

	@returns  boolean true if the widget is inside OWF, false otherwise.
 */

/**
	This method returns flash/flex dom element from dom.
	@name getFlashApp
	@methodOf OWF.Util
	
	@param {String} id id of the flex dom element

	@returns  flash/flex object from dom
 */

 /**
	Basic logging capability - meant to be called by other methods which transform or validate data.
	@name logMetric
	@methodOf OWF.Metrics
	@since OWF 3.8.0

	@param {String} userId
	@param {String} userName
	@param {String} metricSite Identifier, potentially URL, for source of metric - typically OWF instance
	@param {String} componentName    
	@param {String} componentId 
	@param {String} componentInstanceId
	@param {String} metricTypeId String describing metric - recommend package name construct
	@param {String} metricData Any additional data for metric - do any necessary validation appropriate to metricTypeId before sending through 
 */

/**
 * @description Logs a set of metrics to the server all at once.  All
 * metrics passed into a call to this function will be logged in a single
 * HTTP request, instead of one request per metric
 * @name logBatchMetrics
 * @methodOf OWF.Metrics
 * @since OWF 6.0
 *
 * @param {Array} metrics 
 * @param {String} metrics[*].userId
 * @param {String} metrics[*].userName
 * @param {Number} metrics[*].metricTime The time at which is metric was collected (in UNIX time)
 * @param {String} metrics[*].site Identifier, potentially URL, for source of metric - typically OWF instance
 * @param {String} metrics[*].component
 * @param {String} metrics[*].componentId 
 * @param {String} metrics[*].instanceId
 * @param {String} metrics[*].metricTypeId String describing metric - recommend package name construct
 * @param {String} metrics[*].widgetData Any additional data for metric - do any necessary validation appropriate to metricTypeId before sending through 
 * @param {String} metrics[*].userAgent Should be set to the user-agent string of the browser
 */

/**
	Log view of widget - see calls in dashboards.
	@name logWidgetRender
	@methodOf OWF.Metrics
	@since OWF 3.8.0
	
	@param {String} userId     - see Ozone.metrics.logMetric userId
	@param {String} userName   - see Ozone.metrics.logMetric userName
	@param {String} metricSite - see Ozone.metrics.logMetric metricSite
	@param {Object} widget   
 */

/**
	Get a logger by name, if the logger has not already been created it will be created.
	@name getLogger
	@methodOf OWF.Log
	@since OWF 3.8.0
	@param {String} loggerName
 */

/**
	Enable/Disable logging for the OWF application.
	@name setEnabled
	@methodOf OWF.Log
	@since OWF 3.8.0
	@param {Boolean} enabled true will enable logging false will disable
 */

/**
	Get OWF's default logger
	@name getDefaultLogger
	@methodOf OWF.Log
	@since OWF 3.8.0
 */

/**
	Launch the log window pop-up, this will re-launch the window in the event it has been closed.
	@name launchPopupAppender
	@methodOf OWF.Log
	@since OWF 3.8.0
 */

/**
	Gets the language that is currently being used by OWF.
	@name getLanguage
	@methodOf OWF.Lang

	@returns {String} Returns the ISO 639-1 language code for the language that is currently being used by OWF.
 */

if (!Ozone.disableWidgetInit) {


    owfdojo.addOnLoad(function() {

        //calc pageload time
        Ozone.util.pageLoad.afterLoad = (new Date()).getTime();
        Ozone.util.pageLoad.calcLoadTime();

        if(Ozone.util.isInContainer()) {
            OWF._init(window, document);
        }

    });
}
