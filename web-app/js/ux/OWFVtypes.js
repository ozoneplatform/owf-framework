Ext.apply(Ext.form.field.VTypes, {
	
    dashboardTitle: function(val, field) {
    	if (field.getValue()) {
	        var viewCb = field.up('form').down('#' + field.newDashboardField);
	        if (Ext.isEmpty(viewCb.getValue())) return false;
    	}
        return true;
    },

    newDashboard: function(val, field) {
    	if (val) {
	        var viewCb = field.up('form').down('#' + field.newDashboardField);
	        if (Ext.isEmpty(viewCb.getValue())) return false;
    	}
        return true;
    },

    newDashboardText: 'You must select a layout type.',
    
    copiedDashboard: function(val, field) {
    	if (val) {
	        var existViewCb = field.up('form').down('#' + field.copiedDashboardField);
	        if (Ext.isEmpty(existViewCb.getValue())) return false;
    	}
        return true;
    },

    copiedDashboardText: 'You must select a dashboard to copy.',  
    
    importedDashboard: function(val, field) {
    	if (val) {
	        var importFileupload = field.up('form').down('#' + field.importedDashboardField);
	        if (Ext.isEmpty(importFileupload.getValue())) return false;
    	}
        return true;
    },

    importedDashboardText: 'You must select a file to import.'
});
