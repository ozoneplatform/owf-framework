Ext.define('Ozone.components.admin.AdminEditorAddWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.admineditoraddwindow', 'widget.AdminEditorAddWindow'],

    mixins: {
      widget: 'Ozone.components.focusable.CircularFocus'
    },

    title: 'Add',
    itemId: 'admineditoraddwindow',
    modal: true,
    closable: true,
    draggable: false,
    resizable: false,
    closeAction: 'hide',
    border: false,
    minWidth: 250,
    minHeight: 200,
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [{
        xtype: 'panel',
        itemId: 'admineditoraddpanel',
        cls: 'admineditoraddpanel',
        layout: 'fit',
        flex: 1,
        dockedItems: [{
            xtype: 'toolbar',
            itemId: 'admineditoraddtoolbar',
            dock: 'top',
            items: [{
                xtype: 'tbtext',
                itemId: 'tbAdminEditorAddGridHdr',
                cls: 'tbAdminEditorAddGridHdr',
                text: 'Add'
            },
            '->',
            {
                xtype: 'searchbox',
                itemId: 'searchbox'
            }]
        }]
    }],
    buttons: [{
        text: 'OK',
        itemId: 'ok'
    }, {
        text: 'Cancel',
        itemId: 'cancel'
    }],

    initComponent: function() {
        var me = this;

        var vpSize = Ext.getBody().getViewSize();
        me.setWidth(Math.round(vpSize.width * .9));
        me.setHeight(Math.round(vpSize.height * .9));

        me.on('beforeshow', function() {
            me.setTitle(me.generateTitle());

            me.down('#tbAdminEditorAddGridHdr').setText(me.addType + 's');

            me.instructions && me.down('#admineditoraddpanel').addDocked(Ext.widget('label', {
                border: false,
                text: me.instructions,
                style: {
                    textAlign: 'left'
                }
            }), 'top');

            me.down('#admineditoraddpanel').add(me.grid);
        });

        me.on('afterrender', function() {

            var usersAddStore = me.grid.getStore();
            if (usersAddStore) {
                usersAddStore.load({
                    params: {
                        offset: 0,
                        max: usersAddStore.pageSize
                    }
                });
            }

            var searchbox = me.down('#searchbox');
            searchbox.on('searchchanged', function(cmp, queryString) {
                if(me.searchFields) {
                    me.grid.applyFilter(queryString, me.searchFields);
                }
                else {
                    me.grid.applyFilter(queryString, me.grid.quickSearchFields);
                }
            });

            var okBtn = me.down('#ok');
            var cancelBtn = me.down('#cancel');

            //Set up click handlers
            okBtn.on('click', function(btn, e) {
                if(me.okFn) {
                    me.okFn();
                }
                else {
                    var records = me.grid.getSelectionModel().getSelection(),
                        recordsToAdd = [];
                    
                    for (var i = 0 ; i < records.length ; i++) {
                        var rec = records[i],
                            searchBy = rec.get('id') ? 'id' : 'guid';

                        // skip records already in store
                        if (me.existingItemsStore.findExact(searchBy, rec.get(searchBy)) === -1) {
                            var newRec = me.existingItemsStore.createModel(rec);
                            newRec.phantom = true;
                            recordsToAdd.push(newRec);
                        }
                    }
                    if (recordsToAdd.length > 0) {
                        me.existingItemsStore.insert(0, recordsToAdd);
                        me.existingItemsStore.save();
                    }
                }
                me.close();
            });

            cancelBtn.on('click', function(btn, e) {
                me.close();
            });

            me.setupFocus(searchbox.getFocusEl(), cancelBtn.getFocusEl());

            Ext.defer(function() {
                searchbox.focus();
            }, 1);
        });

        //Clean up listeners
        me.on('beforeclose', function() {
            me.grid.clearListeners();
            me.down('#searchbox').clearListeners();
            me.down('#ok').clearListeners();
            me.down('#cancel').clearListeners();

            me.focusOnClose && me.focusOnClose.focus();
        });

        me.callParent(arguments);
    },

    generateTitle: function() {
        var title = "Add " + this.addType + "(s)";
        if(this.itemName) {
            if(this.editor === "Group" || this.editor === "Stack" || (this.editor === "User" && this.addType === "Widget")) {
                title += " to " + this.itemName;
            } else {
                title = "Add " + this.itemName + " to " + this.addType + "(s)";
            }
        }

        //Set a character limit to start at and truncate the title to it if necessary
        var charLimit = 100;
        title = Ext.util.Format.ellipsis(title, charLimit);

        //Get the size of the parent container
        var vpSize = Ext.getBody().getViewSize();

        //Use TextMetrics to get the pixel width of the title
        var textMetrics = new Ext.util.TextMetrics();
        var titleWidth = textMetrics.getWidth(title);

        //If the title's pixel width is too large for the window, decrease it
        //by 5 characters until its pixel width fits
        while(titleWidth > ((vpSize.width * .8))) {
            charLimit -= 5;
            title = Ext.util.Format.ellipsis(title, charLimit);
            titleWidth = textMetrics.getWidth(title);
        }

        textMetrics.destroy();

        return Ext.htmlEncode(title);
    }
});
