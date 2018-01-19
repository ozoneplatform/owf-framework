/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.mobile.app._Widget"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.mobile.app._Widget"] = true;
dojo.provide("dojox.mobile.app._Widget");
dojo.experimental("dojox.mobile.app._Widget");

dojo.require("dijit._Widget");

dojo.declare("dojox.mobile.app._Widget", dijit._Widget, {
	// summary:
	//		The base mobile app widget.

	getScroll: function(){
		// summary:
		//		Returns the scroll position.
		return {
			x: window.scrollX,
			y: window.scrollY
		};
	},

	connect: function(target, event, fn){
		if(event.toLowerCase() == "dblclick"
			|| event.toLowerCase() == "ondblclick"){

			if(window["Mojo"]){
				// Handle webOS tap event
				return this.connect(target, Mojo.Event.tap, fn);
			}
		}
		return this.inherited(arguments);
	}
});

}
