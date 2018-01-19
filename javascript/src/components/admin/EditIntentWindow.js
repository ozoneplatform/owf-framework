Ext.define('Ozone.components.admin.EditIntentWindow', {
    extend: 'Ext.window.Window',
    alias: [
        'widget.editintentwindow',
        'widget.Ozone.components.admin.EditIntentWindow'
    ],

    mixins: {
      widget: 'Ozone.components.focusable.CircularFocus'
    },

    cls: 'editintentwindow',
    
    callback: Ext.emptyFn,
    scope: undefined,

    action: undefined,
    dataType: undefined,
    send: undefined,
    receive: undefined,
    
    resizable: false,
    modal: true,
            
    initComponent: function() {
        
        var me = this;
        var message = Ozone.config.freeTextEntryWarningMessage;
        
        if (!this.scope)
            this.scope = this;
            
        Ext.apply(this, {
            layout: 'fit',
            items: [{
                xtype: 'panel',
                cls: 'usereditpanel',
                layout: 'fit',
                items: [{
                    xtype: 'panel',
                    cls: 'adminEditor',
                    bodyCls: 'adminEditor-body',
                    layout: 'fit',
                    border: false,
                    
                    items: [{
                        xtype: 'form',
                        itemId: 'form',
                        layout: 'anchor',
                        bodyCls: 'properties-body',
                        border: false,
                        bodyBorder: true,
                        preventHeader: true,
                        padding: 5,
                        autoScroll: true,
                        
                        defaults: {
                            anchor: '100%',
                            msgTarget: 'side',
                            labelSeparator: '',
                            margin: '5 5 0 5',
                            listeners: {
                                blur: {
                                    fn: function(field) {
                                        field.changed = true;
                                        field.doComponentLayout();
                                    },
                                    scope: me
                                },
                                change: {
                                    fn: function(field, newValue, oldValue, eOpts) {
                                        if(!field.changed && field.isDirty()) field.changed = true;
                                    },
                                    scope: me
                                },
                                afterrender: {
                                    fn: function(field, eOpts) {
                                        var layout = field.getComponentLayout();
                                        if (layout.errorStrategies != null) {
                                            layout.previousBeforeLayout = layout.beforeLayout;
                                            layout.beforeLayout = function(width, height){
                                                return this.previousBeforeLayout() || !this.owner.preventMark;
                                            };
                                            layout.errorStrategies.side = {
                                                prepare: function(owner){
                                                    var errorEl = owner.errorEl;
                                    
                                                    if (owner.hasActiveError() && owner.changed) {
                                                        errorEl.removeCls('owf-form-valid-field');
                                                        errorEl.removeCls('x-form-warning-icon');
                                                        errorEl.removeCls('owf-form-unchanged-field');
                                                        errorEl.addCls(Ext.baseCSSPrefix + 'form-invalid-icon');
                                                        layout.tip = layout.tip ? layout.tip : Ext.create('Ext.tip.QuickTip', {
                                                            baseCls: Ext.baseCSSPrefix + 'form-invalid-tip',
                                                            renderTo: Ext.getBody()
                                                        });
                                                        layout.tip.tagConfig = Ext.apply({}, {
                                                            attribute: 'errorqtip'
                                                        }, layout.tip.tagConfig);
                                                        errorEl.dom.setAttribute('data-errorqtip', owner.getActiveError() || '');
                                                        errorEl.setDisplayed(owner.hasActiveError());
                                                    }
                                                    else if (owner.hasActiveWarning && owner.hasActiveWarning() && owner.changed) {
                                                        errorEl.removeCls(Ext.baseCSSPrefix + 'form-invalid-icon');
                                                        errorEl.removeCls('owf-form-valid-field');
                                                        errorEl.removeCls('owf-form-unchanged-field');
                                                        errorEl.addCls('x-form-warning-icon');
                                                        layout.tip = layout.tip ? layout.tip : Ext.create('Ext.tip.QuickTip', {
                                                            iconCls: 'x-form-warning-icon',
                                                            renderTo: Ext.getBody()
                                                        });
                                                        layout.tip.tagConfig = Ext.apply({}, {
                                                            attribute: 'errorqtip'
                                                        }, layout.tip.tagConfig);
                                                        errorEl.dom.setAttribute('data-errorqtip', owner.getActiveWarning() || '');
                                                        errorEl.setDisplayed(owner.hasActiveWarning());
                                                    }
                                                    else if (owner.changed) {
                                                        if (layout.tip) 
                                                            layout.tip.unregister(errorEl);
                                                        errorEl.removeCls(Ext.baseCSSPrefix + 'form-invalid-icon');
                                                        errorEl.removeCls('x-form-warning-icon');
                                                        errorEl.removeCls('owf-form-unchanged-field');
                                                        errorEl.addCls('owf-form-valid-field');
                                                        errorEl.dom.setAttribute('data-errorqtip', '');
                                                        errorEl.setDisplayed(true);
                                                    }
                                                    else {
                                                        errorEl.removeCls(Ext.baseCSSPrefix + 'form-invalid-icon');
                                                        errorEl.removeCls('x-form-warning-icon');
                                                        errorEl.removeCls('owf-form-valid-field');
                                                        //errorEl.addCls('owf-form-unchanged-field');
                                                        errorEl.dom.setAttribute('data-errorqtip', '');
                                                        errorEl.setDisplayed(false);
                                                    }
                                                },
                                                adjustHorizInsets: function(owner, info){
                                                    if (owner.autoFitErrors) {
                                                        info.insets.right += owner.errorEl.getWidth();
                                                    }
                                                },
                                                adjustVertInsets: Ext.emptyFn,
                                                layoutHoriz: function(owner, info){
                                                    owner.errorEl.setStyle('left', info.width - info.insets.right + 'px');
                                                },
                                                layoutVert: function(owner, info){
                                                    owner.errorEl.setStyle('top', info.insets.top + 'px');
                                                },
                                                onFocus: Ext.emptyFn
                                            };
                                        }
                                    },
                                    scope: me
                                }
                            }
                        },
                        items: [{
                            xtype: 'component',
                            hidden: message == null || message == '',
                            renderTpl: '<div id="{id}" class="{cls}"><div class="headerSpacer"></div>{message}</div>',
                            renderData: {
                                cls: (message && message.length > 0) ? 'dialogHeader' : '',
                                message: message ? message : ''
                            }
                        }, {
                            xtype: 'textfield',
                            name: 'action',
                            itemId: 'nameField',
                            value: me.action,
                            fieldLabel: Ozone.util.createRequiredLabel('Action'),
                            labelWidth: 130,
                            allowBlank: false,
                            maxLength: 255
                        }, {
                            xtype: 'textfield',
                            name: 'dataType',
                            itemId: 'dataTypeField',
                            value: me.dataType,
                            fieldLabel: Ozone.util.createRequiredLabel('Data Type'),
                            labelWidth: 130,
                            allowBlank: false,
                            maxLength: 255
                        }, {
                            xtype: 'checkbox',
                            name: 'send',
                            itemId: 'sendChk',
                            fieldLabel: 'Send',
                            labelWidth: 130,
                            submitValue: true,
                            preventMark: true,
                            checked: (me.send != undefined) ? me.send : true
                        },{
                            xtype: 'checkbox',
                            name: 'receive',
                            itemId: 'receiveChk',
                            fieldLabel: 'Receive',
                            labelWidth: 130,
                            submitValue: true,
                            preventMark: true,
                            checked: me.receive
                        }]
                    }],
                    buttons: [{
                        text: 'OK',
                        itemId: 'ok',
                        handler: function(button, e) {
                            //Show validation on fields
                            var textfields = this.query('textfield');
                            for (var i = 0; i < textfields.length; i++) {
                                var field = textfields[i];
                                if (!Ext.isFunction(field)) {
                                    field.isValid();
                                    field.changed = true;
                                    field.doComponentLayout();
                                    if (field.getXType() == 'textfield') {
                                        field.setValue(Ext.String.trim(field.getValue()));
                                    }
                                }
                            }
                            var p = button.ownerCt.ownerCt;
                            this.submitValues = p.getComponent('form').getValues();
                            var fields = p.getComponent('form').getForm().getFields().items;
                            
                            var blankField = false;
                            for(field in fields) {
                                if(fields[field].name) this.submitValues['original' + fields[field].name.charAt(0).toUpperCase() + fields[field].name.slice(1)] = fields[field].originalValue;
                                if(fields[field].xtype == 'textfield' && fields[field].getValue() == '') blankField = true;
                            }
                            if(!blankField) {
                                this.callback.call(this.scope, this.submitValues);
                                this.close();
                            }
                        },
                        scope: this
                    }, {
                        text: 'Cancel',
                        itemId: 'cancel',
                        handler: function(button, e) {
                            this.close();
                        },
                        scope: this
                    }]
                }]
        
            }]
        })
        
        this.callParent(arguments);

        var sendChk = this.down('#sendChk'),
            receiveChk = this.down('#receiveChk');

        //Ensure that at least one of the send and receive checkboxes are always checked
        sendChk.on('change', function() {
            //Stop events temporarily so change doesn't fire other listener
            receiveChk.suspendEvents(false);
            receiveChk.setValue(true);
            receiveChk.resumeEvents();
        });
        receiveChk.on('change', function() {
            //Stop events temporarily so change doesn't fire again
            sendChk.suspendEvents(false);
            sendChk.setValue(true);
            sendChk.resumeEvents();
        });

        this.on('afterrender', function() {
            this.setupFocus(this.down('#nameField').getFocusEl(), this.down('#cancel').getFocusEl());
        });
    }
});
