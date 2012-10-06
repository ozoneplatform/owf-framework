/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["doh._rhinoRunner"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["doh._rhinoRunner"] = true;
if(this["dojo"]){
	dojo.provide("doh._rhinoRunner");
}

doh.debug = print;
doh.error = print;

// Override the doh._report method to make it quit with an 
// appropriate exit code in case of test failures.
(function(){
	var oldReport = doh._report;
	doh._report = function(){
		oldReport.apply(doh, arguments);
		if(this._failureCount > 0 || this._errorCount > 0){
			quit(1);
		}
	}
})();

}
