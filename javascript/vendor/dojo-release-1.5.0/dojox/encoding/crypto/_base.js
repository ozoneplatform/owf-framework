/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.encoding.crypto._base"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.encoding.crypto._base"] = true;
dojo.provide("dojox.encoding.crypto._base");

(function(){
	var c=dojox.encoding.crypto;
	c.cipherModes={
		//	summary
		//	Enumeration for various cipher modes.
		ECB:0, CBC:1, PCBC:2, CFB:3, OFB:4, CTR:5 
	};
	c.outputTypes={ 
		//	summary
		//	Enumeration for input and output encodings.
		Base64:0, Hex:1, String:2, Raw:3 
	};
})();

}
