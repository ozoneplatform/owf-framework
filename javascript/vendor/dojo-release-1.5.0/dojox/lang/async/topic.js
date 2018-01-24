/*
	Copyright (c) 2004-2010, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["dojox.lang.async.topic"]){ //_hasResource checks added by build. Do not use _hasResource directly in your code.
dojo._hasResource["dojox.lang.async.topic"] = true;
dojo.provide("dojox.lang.async.topic");

// Source of Deferred for topics

(function(){
	var d = dojo, topic = dojox.lang.async.topic;

	topic.from = function(topic){
		return function(){
			var h, cancel = function(){
					if(h){
						d.unsubscribe(h);
						h = null;
					}
				},
				x = new d.Deferred(cancel);
			h = d.subscribe(topic, function(){
				cancel();
				x.callback(arguments);
			});
			return x;
		};
	};

	topic.failOn = function(topic){
		return function(){
			var h, cancel = function(){
					if(h){
						d.unsubscribe(h);
						h = null;
					}
				},
				x = new d.Deferred(cancel);
			h = d.subscribe(topic, function(evt){
				cancel();
				x.errback(new Error(arguments));
			});
			return x;
		};
	};
})();

}
