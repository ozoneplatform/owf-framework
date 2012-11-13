Ext.define('Ozone.components.admin.StackExportWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.stackexportwindow', 'widget.StackExportWindow'],

    mixins: {
        widget: 'Ozone.components.focusable.CircularFocus'
    },

    title: 'Export',
    itemId: 'stackexportwindow',
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
        itemId: 'stackexportpanel',
        cls: 'admineditoraddpanel',
        layout: 'fit',
        border: false,
        flex: 1,
        items: [{
            xtype: 'form',
            itemId: 'form',
            layout: 'anchor',
            bodyCls: 'properties-body',
            border: false,
            preventHeader: true,
            padding: 5,
            autoScroll: true,
            defaults: {
                anchor: '100%',
                msgTarget: 'side',
                labelSeparator: '',
                margin: '5 5 0 5'
            },
            items: [{
                xtype: 'textfield',
                fieldLabel: 'Filename',
                labelWidth: 140,
                allowBlank: false,
                name: 'filename',
                maxLength: 200
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: 'File Type',
                labelWidth: 140,
                defaultType: 'radiofield',
                defaults: {
                    width: 100
                },
                layout: 'hbox',
                items: [
                    {
                        boxLabel: '.war',
                        name: 'war',
                        inputValue: 'war',
                        id: 'optWar',
                        checked: true
                    }, {
                        boxLabel: '.zip',
                        name: 'zip',
                        inputValue: 'zip',
                        id: 'optZip'
                    }
                ]
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
        me.setHeight(Math.round(vpSize.height * .5));
        
        me.on('afterrender', function() {
            var cancelBtn = me.down('#cancel');
            cancelBtn.on('click', function(btn, e) {
                me.close();
            });
        });
        
        me.on('beforeclose', function() {
            me.down('#cancel').clearListeners();
            me.focusOnClose && me.focusOnClose.focus();
        });
        
        me.callParent(arguments);
    }
});