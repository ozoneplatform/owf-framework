Ext.define('Ozone.layout.window.ManagerWindow', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: ['widget.managerwindow','widget.Ozone.layout.window.ManagerWindow'],

    //defaults
    stateful: false,
    closeAction: 'hide',
    closable: true,
    maximizable: false,
    minimizable: false,
    layout:'fit',
    constrain: true,

    initComponent: function() {
        var me = this;

        me.width = me.width ? me.width  : me.ownerCt.getWidth() - 200;
        me.height = me.height ? me.height : me.ownerCt.getHeight() - 100;

        me.callParent();

        me.on('afterrender', function() {
            var el = this.getEl();

            el.dom.tabIndex = 0;
            el.dom.hideFocus = true;
            el.dom.outlineStyle = 'none';
        }, me);

        //Ensure the shadow follows the window in IE
        me.on('resize', function() {
            me.syncShadow();
        });
        
        if(me.launchingBtn) {
            me.on('hide', me.focusLaunchingBtn, me);
        }
    },

    focusLaunchingBtn: function() {
        if(this.launchingBtn)
            this.launchingBtn.focus();
    }
});