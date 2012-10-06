Ext.define('Ozone.components.PropertiesPanel', {
    extend: 'Ext.form.Panel',
    alias: ['widget.propertiespanel', 'widget.Ozone.components.PropertiesPanel'],
    layout: 'anchor',
    bodyCls: 'properties-body',
    border: false,
    bodyBorder: true,
    preventHeader: true,
    padding: 5,
    autoScroll: true,
    
    initComponent: function() {
        var me = this;

        me.buttonAlign = me.buttonAlign || 'left';
        me.buttons = [{
            text: 'Apply',
            itemId: 'apply',
            disabled: true,
            handler: me.onApply,
            scope: me
        }];
        
        me.defaults = Ext.apply(me.defaults || {}, {
            labelSeparator: '',
            margin: '5 5 0 5',
            msgTarget: 'side',
            anchor: '100%',
            listeners: {
                blur: {
                    fn: function(field) {
                        field.changed = true;
                        field.doComponentLayout();
                        if (field.getXType() == 'textfield') {
                        	field.setValue(Ext.String.trim(field.getValue()));
                        }
                    },
                    scope: me
                },
                change: {
                    fn: me.handleChange,
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
                                	var panel = owner.findParentByType('widgeteditpropertiestab');
                                	var loadedFromDescriptor = panel ? panel.loadedFromDescriptor : false;
                                    var errorEl = owner.errorEl;
                                    
                                    var isRequired = owner.fieldLabel.indexOf('required-label') < 0 ? false : true;
                                    if ((owner.hasActiveError() && owner.changed) ||
                                        ( isRequired && Ext.isEmpty(owner.getValue()) && loadedFromDescriptor )) {
                                        	
                                        errorEl.removeCls(['owf-form-valid-field', 'x-form-warning-icon', 'owf-form-unchanged-field']);
                                        errorEl.addCls(Ext.baseCSSPrefix + 'form-invalid-icon');
                                        layout.tip = layout.tip ? layout.tip : Ext.create('Ext.tip.QuickTip', {
                                            baseCls: Ext.baseCSSPrefix + 'form-invalid-tip',
                                            renderTo: Ext.getBody()
                                        });
                                        layout.tip.tagConfig = Ext.apply({}, {
                                            attribute: 'errorqtip'
                                        }, layout.tip.tagConfig);
                                        errorEl.dom.setAttribute('data-errorqtip', owner.getActiveError() || '');
                                        if ( isRequired && Ext.isEmpty(owner.getValue()) ) {
                                        	errorEl.setDisplayed(true);
                                        } else {
                                            errorEl.setDisplayed(owner.hasActiveError());
                                        }
                                    }
                                    else if (owner.hasActiveWarning && owner.hasActiveWarning() && owner.changed) {
                                        errorEl.removeCls([Ext.baseCSSPrefix + 'form-invalid-icon', 'owf-form-valid-field', 'owf-form-unchanged-field']);
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
                                    else if (owner.changed && !loadedFromDescriptor) {
                                        if (layout.tip) 
                                            layout.tip.unregister(errorEl);
                                        errorEl.removeCls([Ext.baseCSSPrefix + 'form-invalid-icon', 'x-form-warning-icon', 'owf-form-unchanged-field']);
                                        errorEl.addCls('owf-form-valid-field');
                                        errorEl.dom.setAttribute('data-errorqtip', '');
                                        errorEl.setDisplayed(true);
                                    }
                                    else {
                                        errorEl.removeCls([Ext.baseCSSPrefix + 'form-invalid-icon', 'x-form-warning-icon', 'owf-form-valid-field']);
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
                            //field.validate();
                        }
                    },
                    scope: me
                }
            }
        });
        
        me.on('afterrender', function(component) {
            var widget = component.ownerCt;
                            
            if (widget.record)
                component.initFieldValues(widget.record);
            else
                widget.on('initialdataloaded', component.initFieldValues, component);
            
            if (widget.store) {
                widget.store.on(
                    'write',
                    function(store, operation, eOptd) {
                        var recs = operation.getRecords();
                        if (recs) {
                            var rec = recs[0];
                            if (rec) {
                                var id = rec.get('id');
                                if (id) {
                                    widget.recordId = id;
                                }
                            }
                        }
                        widget.enableTabs();
                    }
                );
                if (widget.store.proxy) {
                    var panel = component;
                    widget.store.proxy.on(
                        'exception',
                        function(proxy, response, operation, eOpts) {
                            if ('create' == operation.action) {
                                widget.store.removeAll();
                                if (Ext.isFunction(panel.initFieldValues)) {
                                    panel.initFieldValues({});
                                }
                            }
                            var json;
                            try {
                                json = (typeof response) == 'string' ?  Ext.JSON.decode(response) : response;
                            } catch(e) {
                                json = {
                                    errorMsg: response
                                }
                            }
                            Ext.Msg.alert('Server Error!',
                               'Error during ' + operation.action + ':  ' + Ext.htmlEncode(json.errorMsg));
                        }
                    );
                }
            }
        });

        if (Ozone.config.freeTextEntryWarningMessage != null && Ozone.config.freeTextEntryWarningMessage != '') {
            var message = Ozone.config.freeTextEntryWarningMessage;
            this.items = this.items || [];
            this.items.splice(0,0,{
               xtype: 'component',
               //margin: '5 5 10 5',
               //height: (message && message.length > 0) ? 40 : 16,
               renderTpl: '<div id="{id}" class="{cls}"><div class="headerSpacer"></div>{message}</div>',
               renderData: {
                   cls: (message && message.length > 0) ? 'dialogHeader' : '',
                   message: message ? message : ''
              }
            });
        }

        this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance();

        me.callParent();
    },
    initFieldValues: Ext.emptyFn,
    handleChange: function(field, newValue, oldValue, eOpts) {
        var form = this.getForm(),
            applyButton = this.getDockedItems()[0].getComponent('apply');
        if (!field.changed && field.isDirty()) field.changed = true;
        if (form.isDirty() && !form.hasInvalidField()) {
            applyButton.enable();
        } else {
            applyButton.disable();
        }
    },
    refreshWidgetLaunchMenu: function()
    {
        if (this.widgetStateHandler) {
            this.widgetStateHandler.handleWidgetRequest({
                fn: 'refreshWidgetLaunchMenu'
            });
        }
    },
    onApply: function() {
        var panel = this;
        var widget = panel.ownerCt;
        var formValues = this.getValues();

        if (widget.store.data.length > 0) {
            var record = widget.store.getById(widget.recordId);
            record.beginEdit();
            for (var field in formValues) {
                if (!Ext.isFunction(field)) {
                    record.set(field, formValues[field]);
                }
            }
            record.endEdit();
        } else {
            widget.store.add(formValues);
            widget.store.data.items[0].phantom = true;
            if (Ext.isFunction(panel.initFieldValues)) {
                panel.initFieldValues(widget.store.data.items[0]);
            }
        }
        widget.store.save();
    }
});
