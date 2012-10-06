Ext.override(Ext.dd.DragZone, {
	unreg: function() {
		this.callOverridden(arguments);

		// PATCH START
		// destroy proxy manually as Ext doesn't
		this.proxy && this.proxy.destroy();
		// PATCH END
	}
});