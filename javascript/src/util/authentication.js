var auth = auth || {};

auth.util = function() {
	return {
		getUser : function () {
		  	return "user1";
		},
		getDashboardNamespace : function() {
			return "dashboard";
		}
	};
}();