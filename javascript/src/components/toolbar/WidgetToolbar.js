Ext.define('Ozone.components.toolbar.WidgetToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.widgettoolbar',
    
    //defaultType for the widgetHandles
    defaultType: 'wigdetpanel',
    
    
    initComponent: function(){
        var me = this, keys;
        
        // check for simplified (old-style) overflow config:
        if (!me.layout && me.enableOverflow) {
            me.layout = {
                overflowHandler: 'Menu'
            };
        }
        
        if (me.dock === 'right' || me.dock === 'left') {
            me.vertical = true;
        }
        
        me.layout = Ext.applyIf(Ext.isString(me.layout) ? {
            type: me.layout
        } : me.layout || {}, {
            type: me.vertical ? 'vbox' : 'hbox',
            align: me.vertical ? 'stretchmax' : 'middle'
        });
        
        if (me.vertical) {
            me.addClsWithUI('vertical');
        }
        
        // @TODO: remove this hack and implement a more general solution
        if (me.ui === 'footer') {
            me.ignoreBorderManagement = true;
        }
        
        Ozone.components.toolbar.WidgetToolbar.superclass.superclass.initComponent.apply(this, arguments);
        
        /**
         * @event overflowchange
         * Fires after the overflow state has changed.
         * @param {Object} c The Container
         * @param {Boolean} lastOverflow overflow state
         */
        me.addEvents('overflowchange');
        
        //need to avoid this for now because FocusManager binds keys even though it is disabled
        // Subscribe to Ext.FocusManager for key navigation
        //        keys = me.vertical ? ['up', 'down'] : ['left', 'right'];
        //        Ext.FocusManager.subscribe(me, {
        //            keys: keys
        //        });
        
        var layout = me.getLayout();
        layout.overflowHandler = Ext.create('Ext.layout.container.boxOverflow.Scroller', layout, {
            beforeScrollerCls: Ext.baseCSSPrefix + 'toolbar' + '-scroll-' + me.layout.parallelBefore,
            afterScrollerCls: Ext.baseCSSPrefix + 'toolbar' + '-scroll-' + me.layout.parallelAfter
        });
        layout.scrollerResetPerformed = false;
        layout.autoSize = false;
        layout.clearInnerCtOnLayout = true;
    }
});
