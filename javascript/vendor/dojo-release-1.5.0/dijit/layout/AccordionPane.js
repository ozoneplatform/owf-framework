/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dijit.layout.AccordionPane"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit.layout.AccordionPane"] = true;
dojo.provide("dijit.layout.AccordionPane");

dojo.require("dijit.layout.ContentPane");

dojo.declare("dijit.layout.AccordionPane", dijit.layout.ContentPane, {
	// summary:
	//		Deprecated widget.   Use `dijit.layout.ContentPane` instead.
	// tags:
	//		deprecated

	constructor: function(){
		dojo.deprecated("dijit.layout.AccordionPane deprecated, use ContentPane instead", "", "2.0");
	},

	onSelected: function(){
		// summary:
		//		called when this pane is selected
	}
});

}
