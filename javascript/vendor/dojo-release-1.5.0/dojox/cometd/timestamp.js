/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.cometd.timestamp"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.cometd.timestamp"] = true;
dojo.provide("dojox.cometd.timestamp");
dojo.require("dojox.cometd._base");

// A cometd extension that adds a timestamp to every message
dojox.cometd._extendOutList.push(function(msg){
	msg.timestamp = new Date().toUTCString();
	return msg
});

}
