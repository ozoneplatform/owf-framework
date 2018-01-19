Ext.define('Ozone.components.tab.WidgetTab', {
    extend: 'Ozone.components.widget.WidgetPanel',
    alias: ['widget.widgettab','widget.Ozone.components.tab.WidgetTab'],

    activeCls: 'active',

    //inactiveCls: 'inactive',
   // bodyBorder: false,

    /**
     * @ignore
     */
    onRender: function() {
        var me = this;

        me.callParent(arguments);
        me.el.setStyle('cursor','pointer');
        me.mon(me.el,{
          scope: me,
          click: me.onClick
        });

        if (me.active) {
            me.activate(true);
        }

        me.keyMap = new Ext.util.KeyMap(me.el, [{
            key: Ext.EventObject.ENTER,
            handler: me.onEnterKey,
            scope: me
    },
        {
            key: Ext.EventObject.DOWN,
            handler: me.onDown,
            scope: me  
        }]);
    },

    onClick: function(e) {
        this.activate();
    },

    // inherit docs
    enable : function(silent) {
        var me = this;

        me.callParent(arguments);

        me.removeClsWithUI(me.position + '-disabled');

        return me;
    },

    // inherit docs
    disable : function(silent) {
        var me = this;

        me.callParent(arguments);

        me.addClsWithUI(me.position + '-disabled');

        return me;
    },

    /**
     * @ignore
     */
    onDestroy: function() {
        var me = this;

        Ext.destroy(me.keyMap);
        delete me.keyMap;

        me.callParent(arguments);
    },

    /**
     * Sets the tab as either closable or not
     * @param {Boolean} closable Pass false to make the tab not closable. Otherwise the tab will be made closable (eg a
     * close button will appear on the tab)
     */
    setClosable: function(closable) {
        var me = this;

        // Closable must be true if no args
        closable = (!arguments.length || !!closable);

        if (me.closable != closable) {
            me.closable = closable;

            // set property on the user-facing item ('card'):
            if (me.card) {
                me.card.closable = closable;
            }

            me.syncClosableUI();

            if (me.rendered) {
                me.syncClosableElements();

                // Tab will change width to accommodate close icon
                me.doComponentLayout();
                if (me.ownerCt) {
                    me.ownerCt.doLayout();
                }
            }
        }
    },

    /**
     * Sets this tab's attached card. Usually this is handled automatically by the {@link Ext.tab.Panel} that this Tab
     * belongs to and would not need to be done by the developer
     * @param {Ext.Component} card The card to set
     */
    setCard: function(card) {
        var me = this;

        me.card = card;
        me.setTitle(me.title || card.title);
        //me.setIconCls(me.iconCls || card.iconCls);
    },

    /**
     * @private
     * Listener attached to click events on the Tab's close button
     */
    onCloseClick: function() {
        var me = this;

        if (me.fireEvent('beforeclose', me) !== false) {
            me.fireEvent('close', me);
        }
    },

    /**
     * @private
     */
    onEnterKey: function(key, e) {
        var me = this;

        me.fireEvent('click', this, e);
    },

    onDown: function () {
         this.card.focus(null, null, true, true);       
    },

   /**
     * @private
     */
//    onDeleteKey: function(e) {
//        var me = this;
//
//        if (me.closable) {
//            me.onCloseClick();
//        }
//    },

    // @private
    activate : function(supressEvent) {
        var me = this;

        me.active = true;
        me.addClsWithUI([me.activeCls]);
//        me.removeCls(me.inactiveCls);

        if (supressEvent !== true) {
            me.fireEvent('activate', me);
        }
    },

    // @private
    deactivate : function(supressEvent) {
        var me = this;

        me.active = false;
        me.removeClsWithUI([me.activeCls]);
//        me.addCls(me.inactiveCls);

        if (supressEvent !== true) {
            me.fireEvent('deactivate', me);
        }
    }
});
