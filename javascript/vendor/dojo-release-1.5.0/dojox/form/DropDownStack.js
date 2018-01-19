/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.form.DropDownStack"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.form.DropDownStack"] = true;
dojo.provide("dojox.form.DropDownStack");

dojo.require("dijit.form.Select");
dojo.require("dojox.form._SelectStackMixin");

dojo.declare("dojox.form.DropDownStack",
	[ dijit.form.Select, dojox.form._SelectStackMixin ], {
	// summary: A dropdown-based select stack.
	
});

}
