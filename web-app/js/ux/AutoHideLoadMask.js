Ext.define('Ozone.ux.AutoHideLoadMask', {
    extend: 'Ext.LoadMask',
    alias: [
        'widget.autohideloadmask'
    ],

    initComponent: function() {
        var me = this;

        me.callParent(arguments);

        // hide the mask on an error
        Ext.EventManager.on(window, 'error', function() {
             me.hide();
        });
    },
    
    show: function () {
        var me = this;

        me.callParent(arguments);

        // fallback if onerror isn't supported
        // auto hide mask after 30 seconds
        setTimeout(function() {
            me.hide();
        }, 30000);
    }
});