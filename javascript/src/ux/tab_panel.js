Ext.namespace("Ozone.ux");

Ozone.ux.StatefulTabPanel = function(config) {
	Ext.state.StatefulTabPanel.superclass.constructor.call(this);
	Ext.apply(this, config);
};

Ozone.ux.StatefulTabPanel = Ext.extend(Ext.TabPanel, {
	stateEvents : ['tabchange'],
	getState : function() {		
		var o = {
			activeTab: this.getActiveTab().id
		};
		return o;
	},
	applyState : function(state) {
        // Check to see if the active tab
        // exists and if it doesn't set
        // the first item as active
        if (this.getItem(state.activeTab)  === null ||
            this.getItem(state.activeTab === 'undefined')){
                this.setActiveItem(this.items.item[0].id);
            }
        else {
            this.setActiveTab(state.activeTab);
        }
	}
});