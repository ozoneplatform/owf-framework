Ext.override(Ext.button.Button, {
    initComponent: function() {
        this.showFocus = true;

        this.on('afterrender', function(cmp) {
            cmp.mon(cmp.getEl(), 'mousedown', function() {
                this.showFocus = false;   
            }, cmp);
            
            cmp.mon(cmp.getEl(), 'mouseup', function() {
                this.showFocus = true;
            }, cmp);

            cmp.mon(cmp.getEl(), 'mouseout', function() {
                this.showFocus = true;
            }, cmp);
        });
        
        this.callOverridden(arguments);
    },

    onFocus: function() {
        if (this.showFocus)
            this.callOverridden(arguments);
    }
});

Ext.override(Ext.tip.Tip, {
    maxWidth: 500
});
