Ext.define('Ozone.components.window.HelpWindow', {
  extend: 'Ext.window.Window',
  alias: ['widget.helpwindow', 'widget.Ozone.components.window.HelpWindow'],

  id: 'helpWindow',
  title: 'Help',
  closable: true,
  maximizable: true,
  autoScroll: false,

  defaultFocus: 'helpTreeView',

  height: 600,
  width: 900,

  noHelpFileTitle: 'No Help Files',
  noHelpFileMsg: 'Sorry, no help files were found.',

  mixins: {
      circularFocus: 'Ozone.components.focusable.CircularFocus'
  },
  plugins: new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.HELP),

  warnNoHelp: function() {
        // create and show warning modal.
        Ext.widget('alertwindow',{
            title: this.noHelpFileTitle,
            html:  this.noHelpFileMsg,
            minHeight: 115,
            dashboardContainer: this.dashboardContainer,
            cls: 'alert-window-widget',
            showCancelButton: false
        }).show();

        // make sure warning modal is on top.
        this.dashboardContainer.modalWindowManager.register(Ext.ComponentQuery.query('alertwindow')[0]);
        this.dashboardContainer.modalWindowManager.bringToFront(Ext.ComponentQuery.query('alertwindow')[0]);
  },

  initComponent: function() {

    function treeListener(scope, record, item, index, e) {
        if (record.get('leaf')) {
          this.down('#helpPanel').getEl().set({
            src: 'help' + record.get('path')
          });
        }
    }

    Ext.apply(this, {
      layout: {
        type: 'border'
      },

      items: [
        {
          xtype: 'treepanel',
          preventHeader: true,
          viewConfig: {
            plugins: new Ozone.components.focusable.Focusable(),
            itemId: 'helpTreeView',
            listeners: {
                itemclick: treeListener,
                itemkeydown: function(scope, record, item, index, e) {
                  switch (e.getKey()) {
                      case e.ENTER:
                      case e.SPACE:
                          treeListener.apply(this, arguments);
                  }
                },
                scope: this
            }
          },
          store: Ext.create('Ext.data.TreeStore', {
            fields: ['text', 'path'],
            proxy: {
              type: 'ajax',
              url: 'helpFiles'
            },
            reader: {
              type: 'json',
              root: 'children'
            },
            autoLoad: true
          }),
          rootVisible: false,
          region: 'west',
          split: true,
          collapsible: true,
          collapseMode: 'mini',
          flex: 1,
          listeners: {
            load: {
              fn: function() {
                //setup initial item in the tree to be focused on open
                var view = this.down('#helpTreeView');
                if (view.getSelectedNodes().length === 0 && view.getStore().getCount() > 0) {
                    view.select(0);

                    //since this item is selected fire a click on it
                    view.fireEvent('itemclick',this,view.getStore().getAt(0),view.getNode(0),0,{});

                }
//                view.mon(view.getEl(), 'focus', function() {
//                    if (view.getSelectedNodes().length === 0 && view.getStore().getCount() > 0) {
//                        view.select(0);
//                    }
//                });

                if (this.down('#helpTreeView').getStore().getCount() == 0) {
                    this.warnNoHelp();
                }
              },
              scope: this
            }
          }
        },
        {
          flex: 2,
          region: 'center',
          xtype: 'component',
          itemId: 'helpPanel',
          cls: 'helpPanel',
          autoEl: {
            tag: 'iframe'
          },
          plugins: new Ozone.components.focusable.Focusable(),
          autoScroll: true
        }
      ],
      dockedItems: [{
          xtype: 'focuscatch',
          itemId: 'focusCatch',
          dock: 'bottom'
      }],
      listeners: {
        afterrender: function(cmp) {
            var focusCatch = cmp.getComponent('focusCatch').getEl();

            //circular focus
            cmp.setupFocus(cmp.down('#helpTreeView').getEl(), focusCatch);

            //setup focus frame on window when focus catch
            //is focused
            cmp.mon(focusCatch, {
                focus: function() {
                    this.getEl().addCls('x-focus');
                },
                blur: function() {
                    this.getEl().removeCls('x-focus');
                },
                scope: cmp
            });

            cmp.mon(cmp.getEl(), 'keydown', function(evt) {
                if (!(evt.altKey && evt.shiftKey))
                    return;

                switch (evt.getKey()) {
                    case evt.UP:
                        evt.stopEvent();
                        this.maximize();
                        break;
                    case evt.DOWN: 
                        evt.stopEvent();
                        this.restore();
                        break;
                }
            }, cmp);
        },
        //Ensure the shadow follows the window in IE
        resize: function(cmp) {
            cmp.syncShadow();
        },
        
        beforeclose: function(cmp, eOpts) {
            // Set iframe source to blank before close.
            // Fixes an IE9 problem with pdfs loaded in an iframe.
            cmp.down('#helpPanel').getEl().set({
                src: ''
            });
        }
      }
    });

    //Ensure it is on top
    this.dashboardContainer && this.on('show', function() {
        this.dashboardContainer.modalWindowManager.register(this);
        this.dashboardContainer.modalWindowManager.bringToFront(this);
    });

    this.callParent(arguments);
  }
});
