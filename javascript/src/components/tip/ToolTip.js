Ext.define('Ozone.components.tip.ToolTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.ozonetooltip',

    zIndexManager: Ext.create('Ext.ZIndexManager'),

    onFloatRender: function() {
      if (this.zIndexManager) this.zIndexManager.register(this);
    }

});
