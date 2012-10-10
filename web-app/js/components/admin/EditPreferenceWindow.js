Ext.define('Ozone.components.admin.EditPreferenceWindow', {
    extend: 'Ext.window.Window',
    alias: [
        'widget.editpreferencewindow',
        'widget.usereditpreferencestab',
        'widget.Ozone.components.admin.EditPreferenceWindow'
    ],

    mixins: {
      widget: 'Ozone.components.focusable.CircularFocus'
    },

    cls: 'editpreferencewindow',
    
    callback: Ext.emptyFn,
    scope: undefined,
    namespace: undefined,
    path: undefined,
    value: undefined,
    username: undefined,
    
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
                                        var f = field.ownerCt;
                                        var form = f.getForm(),
                                        applyButton = f.ownerCt.getDockedItems()[0].getComponent('ok');
                                        if (!field.changed && field.isDirty()) field.changed = true;
                                        if (form.isDirty() && !form.hasInvalidField()) {
                                            applyButton.enable();
                                        } else {
                                            applyButton.disable();
                                        }
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
                            xtype: 'hidden',
                            value: this.username,
                            name: 'username'
                        }, {
                            xtype: 'textfield',
                            itemId: 'nameField',
                            value: this.path,
                            fieldLabel: Ozone.util.createRequiredLabel('Preference Name'),
                            labelWidth: 140,
                            allowBlank: false,
                            name: 'path',
                            maxLength: 200,
                            enforceMaxLength: true
                        }, {
                            xtype: 'textfield',
                            value: this.namespace,
                            fieldLabel: Ozone.util.createRequiredLabel('Namespace'),
                            labelWidth: 140,
                            allowBlank: false,
                            name: 'namespace',
                            maxLength: 200,
                            enforceMaxLength: true
                        }, {
                            xtype: 'textarea',
                            value: this.value,
                            fieldLabel: Ozone.util.createRequiredLabel('Value'),
                            labelWidth: 140,
                            allowBlank: false,
                            name: 'value'
                        }]
                    }],
                    buttons: [{
                        text: 'OK',
                        itemId: 'ok',
                        disabled: true,
                        handler: function(button, e) {
                            this.closeButton = button;
                            var p = button.ownerCt.ownerCt;
                            this.submitValues = p.getComponent('form').getValues();
                            var fields = p.getComponent('form').getForm().getFields().items;
                            for (field in fields)
                                if (fields[field].name) this.submitValues['original' + fields[field].name.charAt(0).toUpperCase() + fields[field].name.slice(1)] = fields[field].originalValue;
                            this.close();
                        },
                        scope: this
                    }, {
                        text: 'Cancel',
                        itemId: 'cancel',
                        handler: function(button, e) {
                            this.closeButton = button;
                            this.close();
                        },
                        scope: this
                    }]
                }]
        
            }]
        })
        
        this.callParent(arguments);

        this.on('afterrender', function() {
            this.setupFocus(this.down('#nameField').getFocusEl(), this.down('#cancel').getFocusEl());
        });
        
        this.on('beforeclose', function(panel, e) {
            this.callback.call(this.scope, this.submitValues, this.closeButton);
        });
    }
});
