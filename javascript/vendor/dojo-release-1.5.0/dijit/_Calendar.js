/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dijit._Calendar"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dijit._Calendar"] = true;
dojo.provide("dijit._Calendar");

dojo.require("dijit.Calendar");
dojo.deprecated("dijit._Calendar is deprecated", "dijit._Calendar moved to dijit.Calendar", 1.5);

// dijit._Calendar had an underscore all this time merely because it did
// not satisfy dijit's a11y policy.
dijit._Calendar = dijit.Calendar;

}
