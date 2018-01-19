Ext.define('Ozone.components.tab.WidgetTabBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.widgettabbar',
    cls: 'widget-tab-bar',
    // @private
    defaultType: 'widgettab',


    // @private
    initComponent: function() {
        var me = this;
        me.addEvents(
            /**
             * @event change
             * Fired when the currently-active tab has changed
             * @param {Ext.tab.Bar} tabBar The TabBar
             * @param {Ext.Tab} tab The new Tab
             * @param {Ext.Component} card The card that was just shown in the TabPanel
             */
            'change'
        );

      //-- pulled in code below from parent and left out registering with FocusManager

        // check for simplified (old-style) overflow config:
        if (!me.layout && me.enableOverflow) {
            me.layout = { overflowHandler: 'Menu' };
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

        //bypass immediate parent
        Ozone.components.tab.WidgetTabBar.superclass.superclass.initComponent.apply(this,arguments);

        /**
         * @event overflowchange
         * Fires after the overflow state has changed.
         * @param {Object} c The Container
         * @param {Boolean} lastOverflow overflow state
         */
        me.addEvents('overflowchange');


      //--
        var layout = me.getLayout();
        layout.overflowHandler = Ext.create('Ext.layout.container.boxOverflow.Scroller', layout, {
          beforeScrollerCls: Ext.baseCSSPrefix + 'toolbar' + '-scroll-' + me.layout.parallelBefore,
          afterScrollerCls: Ext.baseCSSPrefix + 'toolbar' + '-scroll-' + me.layout.parallelAfter
        });
        layout.scollerResetPerformed = false;
        layout.autoSize = false;
        layout.clearInnerCtOnLayout = true;
        
        
    },

    /**
     *
     */
    closeTab: function(tab,supressEvent) {
        var card    = tab.card,
            tabPanel = this.tabPanel,
            nextTab;

        if (tab.active && this.items.getCount() > 1) {
            nextTab = tab.next('tab') || this.items.items[0];
            this.setActiveTab(nextTab,supressEvent);
            if (tabPanel) {
                tabPanel.setActiveTab(nextTab.card);
            }
        }
        this.remove(tab);

        if (tabPanel && card) {
            tabPanel.remove(card);
        }
        
        if (nextTab) {
            nextTab.focus();
        }

        //tabPanel.ownerCt.attemptScrollerReset(this);
    },

    /**
     * @private
     * Marks the given tab as active
     * @param {Ext.Tab} tab The tab to mark active
     */
    setActiveTab: function(tab,supressActivateEvent) {
        if (tab.disabled) {
            return;
        }
        var me = this;
        if (me.activeTab) {
            me.activeTab.deactivate();
        }
        tab.activate(supressActivateEvent);
        
        if (me.rendered) {
            me.layout.layout();
            tab.el.scrollIntoView(me.layout.getRenderTarget());
        }
        me.activeTab = tab;
        me.fireEvent('change', me, tab, tab.card);
    }
});