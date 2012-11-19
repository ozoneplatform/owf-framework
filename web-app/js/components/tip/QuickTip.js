Ext.define('Ozone.components.tip.QuickTip', {
    extend: 'Ext.tip.QuickTip',
    alias: 'widget.ozonequicktip',

    cls: 'ozonequicktip',

    onFloatRender: function() {
        if (this.zIndexManager) {
            this.zIndexManager.register(this);
        }
    }

});
