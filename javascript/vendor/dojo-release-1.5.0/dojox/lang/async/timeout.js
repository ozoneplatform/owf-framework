/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.lang.async.timeout"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.lang.async.timeout"] = true;
dojo.provide("dojox.lang.async.timeout");

// Source of Deferred for timeouts

(function(){
	var d = dojo, timeout = dojox.lang.async.timeout;

	timeout.from = function(ms){
		return function(){
			var h, cancel = function(){
					if(h){
						clearTimeout(h);
						h = null;
					}
				},
				x = new d.Deferred(cancel);
			h = setTimeout(function(){
				cancel();
				x.callback(ms);
			}, ms);
			return x;
		};
	};

	timeout.failOn = function(ms){
		return function(){
			var h, cancel = function(){
					if(h){
						clearTimeout(h);
						h = null;
					}
				},
				x = new d.Deferred(cancel);
			h = setTimeout(function(){
				cancel();
				x.errback(ms);
			}, ms);
			return x;
		};
	};
})();

}
