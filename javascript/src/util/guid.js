var guid = guid || {};
var Ozone = Ozone || {};
Ozone.util = Ozone.util || {};

guid.util = function() {
	function S4() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}
	return {
		guid : function () {
		  	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
		}
	};
}();

/**
 * @description Returns a globally unique identifier (guid)
 * 
 * @returns {String} guid
 */
Ozone.util.guid = function() {
    return guid.util.guid();
}