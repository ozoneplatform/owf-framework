Ext.define('Ozone.components.window.ModalWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.modalwindow','widget.Ozone.components.window.ModalWindow'],

    mixins: {
      widget: 'Ozone.components.focusable.CircularFocus'
    },
    modal: true,
    hideMode: 'display',

    initComponent: function() {

        this.callParent(arguments);

        //Ensure its on top
        this.dashboardContainer && this.on('show', function() {
            this.dashboardContainer.modalWindowManager.register(this);
            this.dashboardContainer.modalWindowManager.bringToFront(this);
        });
    },

    afterRender: function() {
        
        var me = this, keyMap;
        me.callParent(arguments);
        
        //if closable, this has already been done
        if (!me.closable) {
            keyMap = me.getKeyMap();
            keyMap.on(27, me.onEsc, me);
            keyMap.disable();
        }
        
    },

    onEsc: function(k, e) {
        //close event needs to be fired
        if (this.onClose)
            this.onClose();

        this.callParent(arguments);
    }
});
