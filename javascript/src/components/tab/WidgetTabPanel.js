Ext.define('Ozone.components.tab.WidgetTabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.widgettabpanel',

    initComponent: function() {
        var me = this,
            dockedItems = me.dockedItems || [],
            activeTab = me.activeTab || 0;

        me.layout = Ext.create('Ext.layout.container.Card', Ext.apply({
            owner: me,
            deferredRender: me.deferredRender,
            activeItem: me.activeItem ? me.activeItem : 0,
            itemCls: me.itemCls,
            // Override parseActiveItem method so that
            // card layout doesn't force you to have an
            // active item.
            parseActiveItem: function(item) {
                if (!Ext.isDefined(item)) {
                    return null;
                }
                else if (item && item.isComponent) {
                    return item;
                }
                else if (typeof item == 'number') {
                    return this.getLayoutItems()[item];
                }
                else {
                    return this.owner.getComponent(item);
                }
            }            
        }, me.layout));

        /**
         * @property tabBar
         * @type Ext.TabBar
         * Internal reference to the docked TabBar
         */
        me.tabBar = Ext.create('Ozone.components.tab.WidgetTabBar', Ext.apply({}, me.tabBar, {
            dock: me.tabPosition,
            border: me.border,
            cardLayout: me.layout,
            //height: 33,
            tabPanel: me
        }));
        
        me.tabBar.on('render', function(cmp){
            cmp.layout.overflowHandler.on('scroll', function(scrollCmp, newPosition, animate){
                this.layout.scollerResetPerformed = false;
            }, cmp)}, this, {single: true});

        if (dockedItems && !Ext.isArray(dockedItems)) {
            dockedItems = [dockedItems];
        }

        dockedItems.push(me.tabBar);
        me.dockedItems = dockedItems;

        me.addEvents(
            /**
             * @event beforetabchange
             * Fires before a tab change (activated by {@link #setActiveTab}). Return false in any listener to cancel
             * the tabchange
             * @param {Ext.tab.Panel} tabPanel The TabPanel
             * @param {Ext.Component} newCard The card that is about to be activated
             * @param {Ext.Component} oldCard The card that is currently active
             */
            'beforetabchange',

            /**
             * @event tabchange
             * Fires when a new tab has been activated (activated by {@link #setActiveTab}).
             * @param {Ext.tab.Panel} tabPanel The TabPanel
             * @param {Ext.Component} newCard The newly activated item
             * @param {Ext.Component} oldCard The previously active item
             */
            'tabchange'
        );

        //bypass parent
         Ozone.components.tab.WidgetTabPanel.superclass.superclass.initComponent.apply(this, arguments);

        //set the active tab
        me.setActiveTab(activeTab);
        //set the active tab after initial layout
        me.on('afterlayout', me.afterInitialLayout, me, {single: true});
    },

    /**
     * @ignore
     * Makes sure we have a Tab for each item added to the TabPanel
     */
    onAdd: function(item, index) {
        var me = this;

        item.tab = me.tabBar.insert(index, {
            xtype: 'widgettab',
            card: item,
            cls: 'widget-tab',
            title: item.title,
            itemId: item.itemId,
            model: item.model,
            stateful: false,
            icon: item.icon,
            disabled: item.disabled,
            closable: item.closable,
            hidden: item.hidden,
            width: 200,
            tabBar: me.tabBar,
            singleton: item.singleton,
            listeners: {
              //listen to activate event for tab clicks
              activate: {
                fn: function(cmp) {
                   this.setActiveTab(cmp.card,true);
                },
                scope: this
              },
              beforeclose: {
            	  fn: this.onBeforeClose,
            	  scope: this
              },
              //listen to close event for tab close tool clicks
              close: {
                fn: function(cmp) {
                   this.tabBar.closeTab(cmp,true);
                },
                scope: this
              },
              //listen to titlechange event and set title on the actual panel (item)
              titlechange: {
                fn: function(tabcmp, newtitle, oldtitle) {
                  if (newtitle != oldtitle) {
                    tabcmp.suspendEvents();
                    item.setTitle(newtitle);
                    tabcmp.resumeEvents();
                  }
                },
                scope: this
              }
            }
        });

        item.on({
            scope : me,
            enable: me.onItemEnable,
            disable: me.onItemDisable
//          ,
////            beforeshow: me.onItemBeforeShow,
//            iconchange: me.onItemIconChange,
//            titlechange: me.onItemTitleChange
        });

        if (item.isPanel) {
            if (me.removePanelHeader) {
                item.preventHeader = true;
                if (item.rendered) {
                    item.updateHeader();
                }
            }
            if (item.isPanel && me.border) {
                item.setBorder(false);
            }
        }

        // ensure that there is at least one active tab
        if (this.rendered && me.items.getCount() === 1) {
            me.setActiveTab(0);
        }
    },

    /**
     * Makes the given card active (makes it the visible card in the TabPanel's CardLayout and highlights the Tab)
     * @param {Ext.Component} card The card to make active
     */
    setActiveTab: function(card,supressActivateEvent) {
        var me = this,
            previous;

        card = me.getComponent(card);
        if (card) {
            previous = me.getActiveTab();

            if (previous && previous !== card && me.fireEvent('beforetabchange', me, card, previous) === false) {
                return false;
            }

            me.tabBar.setActiveTab(card.tab,supressActivateEvent);
            me.activeTab = card;
            if (me.rendered) {
                me.layout.setActiveItem(card);
            }

            if (previous && previous !== card) {
                me.fireEvent('tabchange', me, card, previous);
            }
        }
    },

    /**
     * @private
     * Enable corresponding tab when item is enabled.
     */
    onItemActivate: function(item){
        this.tabBar.setActiveTab(item.tab);
    },

    /**
     * @private
     * Enable corresponding tab when item is enabled.
     */
    onItemClose: function(item){
        this.tabBar.closeTab(item.tab);
    },

    /**
     * @private
     * Update the tab iconCls when panel iconCls has been set or changed.
     */
    onItemIconChange: function(item, newIconCls) {
        item.tab.setIconCls(newIconCls);
        this.getTabBar().doLayout();
    },

    /**
     * @private
     * Update the tab title when panel title has been set or changed.
     */
    onItemTitleChange: function(item, newTitle) {
        item.tab.setTitle(newTitle);
        this.getTabBar().doLayout();
    },
    
    /**
     * @private
     * Don't close widgets on a locked dashboard unless they're floating.
     */
    onBeforeClose: function(cmp) {
		if(cmp.card.dashboard.configRecord.get('locked') && !cmp.card.model.get('floatingWidget')) {
			Ozone.Msg.alert(Ozone.layout.DialogMessages.dashboardLockAlertTitle, Ozone.layout.DialogMessages.dashboardLockAlert,
                null, null, null, cmp.card.dashboard.dashboardContainer.modalWindowManager);
			return false;
		}
	}    

});
