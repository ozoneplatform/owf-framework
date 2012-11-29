Ext.define('Ozone.components.admin.ExportWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.exportwindow', 'widget.ExportWindow'],

    mixins: {
        widget: 'Ozone.components.focusable.CircularFocus'
    },

    title: 'Export',
    itemId: 'exportwindow',
    modal: true,
    closable: true,
    draggable: false,
    resizable: false,
    closeAction: 'hide',
    border: false,
    minWidth: 250,
    layout: 'auto',
    items: [{
        xtype: 'panel',
        itemId: 'exportpanel',
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
                fieldLabel: 'File Name',
                labelWidth: 130,
                allowBlank: false,
                name: 'filename',
                maxLength: 200,
                regex: /^[a-zA-Z\d\-\_]+$/,
                regexText: 'Invalid characters! The Filename may only contain letters, numbers, dashes, and underscores.'
            }]
        }]
    }],
    buttons: [{
        text: 'OK',
        itemId: 'ok',
        disabled: true
    }, {
        text: 'Cancel',
        itemId: 'cancel'
    }],

    initComponent: function() {
        var me = this;
        
        me.setWidth(Math.round(Ext.getBody().getViewSize().width * .9));
        
        me.on('beforeshow', function() {
            me.setTitle(me.generateTitle());
        });
        
        me.on('afterrender', function() {
            
            var form = me.down('#form');
            var filename = me.down('#filename');
            var okBtn = me.down('#ok');
            var cancelBtn = me.down('#cancel');

            //If a filename is given, use it in the filename field initially and enable ok button
            me.itemFilename && filename.setValue(me.itemFilename) && okBtn.enable();
            
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
                    me.okFn(filename.value);
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