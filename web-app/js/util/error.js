var Ozone = Ozone || {};
Ozone.util = Ozone.util || {};


//uses Ext.msg.alert but forces the zseed in Ext.WindowMgr to a very high number (50,000) to force the alert on top of everything.
Ozone.util.alert = function(title, msg, fn, scope, options) {
    var tmpZseed = Ext.WindowMgr.zseed;
    Ext.WindowMgr.zseed = 50000;
    Ozone.Msg.alert(title, msg, fn, scope, options);
    Ext.WindowMgr.zseed = tmpZseed;    
};

Ozone.util.validateGuid = function(guid) {
	if (guid == null) return false;
	var match = guid.search(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
	if (match < 0) return false;
	return true;
};
	
Ozone.util.validateDashboardJSON = function(json) {
	// All dashboards have the same structure.
    // None of the attributes can be undefined.
	if (json.name == null || json.guid == null || json.isdefault == null) {
		return false;
	}
	
    return true;
};
