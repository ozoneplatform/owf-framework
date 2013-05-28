Ext.define('Ozone.plugins.Dashboard', {
	extend: 'Ext.AbstractPlugin', 

	init: function(cmp) {
		
		// console.log('Dashboard external plugin');
        //if  (Ozone.config.debugFeatureFlags && Ozone.config.debugFeatureFlags.OP23 && Ozone.config.debugFeatureFlags.OP23 === true) {
            console.log("Modifiable..." + cmp.getIsModifiable());
        //}


	}
});