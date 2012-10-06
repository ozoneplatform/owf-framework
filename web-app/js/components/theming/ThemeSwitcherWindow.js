Ext.define('Ozone.components.theming.ThemeSwitcherWindow', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: 'widget.themeswitcherwindow',

    id: 'themeSwitcher',
    iconCls: 'themeSwitcher-header-icon',
    modalAutoClose: true,

    //private
    selectedTheme: null,
    
    initComponent: function() {
        this.items = [
            {
                xtype: 'themebrowser',
                id: 'theme-browser-view',
                itemId: 'theme-browser-view',
                region: 'center',
                autoScroll: true,
                listeners: {
                    scope: this,
                    selectionchange: function() {
                        this.scrollToSelectedTheme.apply(this, arguments);
                        this.onThemeSelect.apply(this, arguments);
                    },
                    itemkeydown: function(view, record, node, idx, evt) {
                        if (evt.getKey() === evt.ENTER || evt.getKey() === evt.SPACE)
                            this.applyTheme();
                    }
                }
            },
            {
                xtype: 'themeinfopanel',
                id: 'theme-info-panel',
                region: 'east',
                split: true,
                preventHeader: true
//                listeners: {
//                    expand: {
//                        fn: this.scrollToSelectedTheme,
//                        scope: this
//                    }
//                }
            }
        ];
        
        this.okBtn = Ext.widget('button', {
            itemId: 'okBtn',
            text: Ozone.layout.ThemeSwitcherWindowConstants.ok,
//            iconCls: 'okSaveBtnIcon',
            disabled: true,
            scope: this,
            handler: function() {
                this.close();
                this.applyTheme();
            }
        });

        this.cancelBtn = Ext.widget('button', {
            xtype: 'button',
            itemId: 'cancelBtn',
            text: Ozone.layout.ThemeSwitcherWindowConstants.cancel,
//            iconCls: 'cancelBtnIcon',
            scope: this,
            handler: function() {
                this.close();
            }
        });

        this.dockedItems = [
          {
            xtype: 'toolbar',
            dock: 'bottom',
            defaults: {
              minWidth: 60
            },
            layout: {
              type: 'hbox',
              pack: 'end'
            },
            items: [
              this.okBtn,
              this.cancelBtn
            ]
          }
        ];

      this.on('afterrender', function(cmp) {
            var view = cmp.getComponent('theme-browser-view'),
                store = view.getStore();

            cmp.setupFocus(view.getEl(), cmp.cancelBtn.getEl());

            //after the store loads, automatically select
            //the current theme
            store.on('load', function(store) {
                record = store.find('name', Ozone.config.currentTheme.themeName);
                this.select(record);
            }, view);

            //WARNING: this Ext property is undocumented
            view.getSelectionModel().deselectOnContainerClick = false;
        });

        //Ensure the shadow follows the window in IE
        this.on('resize', function() {
            this.syncShadow();
        });
        
        this.callParent(arguments);

    },
    
    // keep track of selected theme, and enable/disable 'Apply' button based on 
    // the selection
    onThemeSelect: function(dataview, selections) {
        var selected = selections[0],
            themeInfoPanel = this.down('themeinfopanel');
        
        if (selected) {
            this.selectedTheme = selected;
            this.okBtn.enable();
            
            themeInfoPanel.loadThemeInfo(selected);
        }
    },
    
    // apply selected theme and refresh
    applyTheme: function() {
        if(this.selectedTheme && this.selectedTheme.data && this.selectedTheme.data.css) {
            Ozone.pref.PrefServer.setUserPreference({
                namespace: "owf",
                name: "selected_theme",
                value: this.selectedTheme.data.name,
                onSuccess: Ext.bind(function() {
                      window.location.reload();
                }, this)
            });
        }
    },

    // scroll to the selected theme
    scrollToSelectedTheme: function() {
        var themeBrowser = this.down('themebrowser'),
            selectedNode = themeBrowser.getSelectedNodes()[0];

        if (selectedNode) {
            offsets = Ext.get(selectedNode).getOffsetsTo(themeBrowser.getEl());

            themeBrowser.getEl().scroll('b', offsets[1], true);
        }
    }

});

