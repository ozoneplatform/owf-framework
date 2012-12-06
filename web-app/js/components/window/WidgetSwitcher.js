Ext.define('Ozone.components.window.WidgetSwitcher', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: 'widget.widgetswitcher',

    closeAction: 'hide',
    modal: true,
    modalAutoClose: true,
    width: 520,
    preventHeader: true,
    shadow: false,
//    ui: 'widget-switcher',
    ui: 'system-window',

    store: null,
    dashboard: null,

    viewId: 'widget-switcher-widgets-view',
    noWidgetsViewId: 'widget-switcher-no-widgets',

    activateWidget: function(view, record, item, index, event, eOpts) {
        //the ordering of these calls is important
        this.close();

        this.activeDashboard.activateWidget(record.data.uniqueId, true, true);

        if(!record.data.background) {
            Ext.getCmp(record.data.uniqueId).focus(false, false, true, true);
        }
        else {
            this.confirmRemoveBackgroundWidget(record);
        }
    },

    showNoWidgetsView: function() {
      if(this.view) {
          this.view.getEl().hide();
      }
      if(!this.noWidgetsView) {
          this.noWidgetsView = Ext.create('Ext.Component', {
              itemId: this.noWidgetsViewId,
              autoEl: {
                  tag: 'span',
                  tabIndex: '0',
                  html: 'No open widgets found!'
              }
          });

          this.add(this.noWidgetsView);

          this.noWidgetsView.keynav = new Ext.util.KeyNav(this.noWidgetsView.getEl(), {
              "tab" : function(e) {
                  this.focus();
              },
              scope : this.noWidgetsView
          });

          Ozone.components.focusable.Focusable.clearOutline(this.noWidgetsView.getEl());
      }
      else {
          this.noWidgetsView.getEl().setVisible();
      }
      this.noWidgetsView.focus();
    },

    setStore: function(store) {
        var i = store.getCount() - 1,
            newStore,
            backgroundWidgets = [];

        //create new store
        newStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: '.'
                }
            }
        });

        //loop through store adding widgets to the newStore
        while(i > -1) {
            var widgetDefRec = this.widgetStore.getById(store.getAt(i).get('widgetGuid'));
            if (widgetDefRec) {
                //If background save it so they are always at the end of the list
                if (widgetDefRec.get('background')) {
                    backgroundWidgets.push(store.data.items[i]);
                }
                else {
                    newStore.add(store.data.items[i]);
                }
            }
            i -= 1;
        }
        newStore.add(backgroundWidgets);

        //show switcher with the widgets
        if (newStore.getCount() > 0) {
            //hide the noWidgetsView
            if(this.noWidgetsView) {
                this.noWidgetsView.getEl().hide();
            }

            //get and setup view
            if(this.view) {
                this.view.getEl().setVisible();
            }
            else {
                this.add(this.initView());
            }

            this.view.bindStore(newStore);
        }
        //no widgets available show noWidgetsView
        else {
            this.showNoWidgetsView();
        }
    },

    initView: function() {
        var me = this;

        if(this.view)
            return this.view;

        this.view = Ext.create('Ozone.components.focusable.FocusableView', {
            itemId: this.viewId,
            itemSelector: '.widget',
            overItemCls: 'widget-over',
            selectedItemCls: 'widget-selected',
            trackOver: true,
            singleSelect: true,

            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="widget" tabindex="0" data-qtip="{[Ext.htmlEncode(Ext.htmlEncode(values.name))]}">', //Must be encoded 2x for some reason
                        '<div class="thumb-wrap">',
                            '<img src="{[this.getIcon(xindex, values)]}" class="thumb" />',
                        '</div>',
                        '<div class="thumb-text">{[Ext.String.ellipsis(Ext.htmlEncode(values.name),20,false)]}</div>',
                    '</div>',
                '</tpl>'
                ,
                {
                    compiled: true,

                    getIcon: function(xindex, values) {
                        var icon = me.activeDashboard.widgetStore.getById(values.widgetGuid).data.image;
                        return icon;
                    }
                }
            )
        });
        
        this.view.on('itemclick', this.activateWidget, this);
        this.view.on('itemkeydown', function(view, record, item, index, event, eOpts) {
            switch (event.getKey()) {
                case event.ENTER: 
                case event.SPACE:
                    event.preventDefault();
                    this.activateWidget(view, record, item, index, event, eOpts);
            }
        }, this);


        this.view.on('viewready', function() {
            var firstEl,
                me = this;
            
            if(this.getStore().getCount() > 0) {
                this.widgetEls = this.getEl().query(this.itemSelector);
                firstEl = this.widgetEls[0];
                
                if(firstEl) {
                    // needed for IE
                    setTimeout(function() {
                        me.getNode(0).focus();
                    }, 100);
                }
            }
        }, this.view);

        this.view.on('refresh', function() {
            var widgetEls = this.view.getEl().query(this.view.itemSelector),
                len = widgetEls.length;
            if(len > 0) {
                this.setupFocus(Ext.get(widgetEls[0]), Ext.get(widgetEls[len-1]));
            }
        }, this);

        return this.view;
    },

    confirmRemoveBackgroundWidget: function(record) {
        var me = this;
        Ext.widget('alertwindow', {
            title: 'Warning',
            html: '<i>' + Ext.htmlEncode(record.get('name')) + '</i>' 
                + Ozone.layout.DialogMessages.closeBackgroundWidgetWarning,
            width: 400,
            dashboardContainer: me.activeDashboard.dashboardContainer,
            okFn: function() {
                var paneStore = Ext.getCmp(record.get('paneGuid')).stateStore,
                    dashboardStore = me.activeDashboard.stateStore;

                // find the record in pane store matching id of widget switcher record
                // this is needed because stores aren't same
                paneStore.remove(paneStore.findRecord('uniqueId', record.get('uniqueId')));
            }
        }).show();
    }

//    enableKeyNav: function() {
//        if(this.view.keynav) {
//            this.view.keynav.destroy();
//        }
//        this.view.keynav = new Ext.util.KeyNav(this.view.getEl(), {
//            tab: function(e) {
//                var selectedNode = this.getSelectedNodes()[0],
//                    selectedIndex = this.indexOf(selectedNode),
//                    total = this.getStore().getCount() - 1;
//                
//                if(e.shiftKey) {
//                    selectedIndex -= 1;
//                    selectedIndex = selectedIndex === -1 ? total : selectedIndex;
//                }
//                else {
//                    selectedIndex = selectedIndex === total ? 0 : selectedIndex + 1;
//                }
//                this.select(selectedIndex);
//                alert('before: widget = ' + this.widgetEls[selectedIndex]);
//                this.widgetEls[selectedIndex].focus();
//                alert('after');
//            },
//            scope : this.view
//        });
//    }
});