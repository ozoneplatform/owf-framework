/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.xml.Script"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.xml.Script"] = true;
dojo.provide("dojox.xml.Script");
dojo.require("dojo.parser");
dojo.require("dojox.xml.widgetParser");

dojo.declare("dojox.xml.Script", null, {
	constructor: function(props, node){
		dojo.parser.instantiate(
			dojox.xml.widgetParser._processScript(node)
		);
	}
});

}
