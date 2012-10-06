dependencies = {
	layers: [
		{
			name: "dojo.js",
			dependencies: [
				"dojox.io.windowName",
				"dojox.secure.capability"
			]
		}
	],

	prefixes: [
		[ "dijit", "../dijit" ],
		[ "dojox", "../dojox" ]
	],

    scopeDjConfig: '{scopeMap:[["dojo","owfdojo"],["dijit","owfdijit"],["dojox","owfdojox"]]}'
};
