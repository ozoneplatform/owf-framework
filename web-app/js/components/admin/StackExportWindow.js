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
                itemId: 'filename',
                fieldLabel: 'Filename',
                labelWidth: 140,
                allowBlank: true,
                name: 'filename',
                maxLength: 200,
                regex: /^[a-zA-Z\d\-\_]+$/,
                regexText: 'Invalid characters! The Filename may only contain letters, numbers, dashes, and underscores.'
            }, {
                xtype: 'radiogroup',
                itemId: 'extension',
                fieldLabel: 'File Type',
                labelWidth: 140,
                columns: [100, 100],
                vertical: true,
                items: [
                    {
                        boxLabel: '.war',
                        name: 'val',
                        inputValue: 'war',
                        checked: true
                    }, {
                        boxLabel: '.zip',
                        name: 'val',
                        inputValue: 'zip'
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
        
        me.on('beforeshow', function() {
            me.setTitle(me.generateTitle());
        });
        
        me.on('afterrender', function() {
            
            var form = me.down('#form');
            var filename = me.down('#filename');
            var extension = me.down('#extension');
            var okBtn = me.down('#ok');
            var cancelBtn = me.down('#cancel');
            
            form.on('fieldvaliditychange', function(form, t, isValid, eOpts) {
                if (isValid) {
                    okBtn.enable();
                } else {
                    okBtn.disable();
                }
            });
            
            cancelBtn.on('click', function(btn, e) {
                me.close();
            });
            
            okBtn.on('click', function(btn, e) {
                if(me.okFn) {
                    var extn = extension.getValue();
                    me.okFn(filename.value, extn.val);
                }
                me.close();
            });
            
            me.setupFocus(filename.getFocusEl(), cancelBtn.getFocusEl());
        });
        
        me.on('beforeclose', function() {
            me.down('#form').clearListeners();
            me.down('#ok').clearListeners();
            me.down('#cancel').clearListeners();
            me.focusOnClose && me.focusOnClose.focus();
        });
        
        me.callParent(arguments);
    },
    
    generateTitle: function() {
        var title = "Export";
        if (this.itemName) { title = "Export " + this.itemName; }

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