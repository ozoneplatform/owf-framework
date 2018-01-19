Ext.define('Ozone.components.widget.BackgroundWidget', {
    extend: 'Ext.Container',
    alias: ['widget.backgroundwidget'],

    style: 'display: none',
    
    initComponent : function() {

        this.items = [{
            xtype: 'widgetiframe',
            isWidget: true,
            iframeProperties: this.iframeProperties
        }];

        this.callParent(arguments);
    }

});
