Ext.define('Ozone.components.admin.group.StackEditPropertiesTab', {
    extend: 'Ozone.components.PropertiesPanel',
    alias: [
        'widget.stackeditproperties',
        'widget.stackeditpropertiestab',
        'widget.Ozone.components.admin.stack.StackEditPropertiesTab'
    ],
    cls: 'stackeditpropertiestab',

    initComponent: function () {
        var me = this;
        Ext.applyIf(this, {
            layout: 'fit',
            title: 'Properties',
            iconCls: 'properties-tab',
            defaults: {
                labelWidth: 140
            },
            items: [
                 {
                    xtype: 'component',
                    itemId: 'descriptorUrlInfo',
                    name: 'descriptorUrlInfo',
                    cls: 'descriptorUrlInfo',
                    renderTpl: '<div class="descriptorUrlHeader">' +
                                '<div class="descriptorUrlTitle">{descriptorUrlTitle}</div><button class="descriptorUrlInfoIcon" ></button>' +
                                '</div>',
                    renderData: {
                        descriptorUrlTitle: 'Import Applifcation from Descriptor URL'
                    },
                    renderSelectors: {
                        iconEl: '.descriptorUrlInfoIcon',
                        titleEl: '.descriptorUrlTitle'
                    },
                    listeners: {
                        afterrender: function(cmp){
                            // After rendering the component will have an iconEl property
                            cmp.iconEl.on('click', function() {
                                var descriptorUrlInfoMsg = cmp.ownerCt.getComponent('descriptorUrlInfoMsg');
                                if (descriptorUrlInfoMsg.isVisible()) {
                                    descriptorUrlInfoMsg.hide();
                                } else {
                                    descriptorUrlInfoMsg.show();
                                }
                            }, this);

                            Ozone.components.focusable.Focusable.setupFocus(cmp.iconEl, this);
                            //pressing enter on the header toggles collapse
                            new Ext.util.KeyMap(cmp.iconEl, {
                                key: [Ext.EventObject.ENTER],
                                fn: function (key, evt) {
                                    // required for IE, focus goes back to active widget for some reason
                                    evt.stopEvent();

                                    var descriptorUrlInfoMsg = this.ownerCt.getComponent('descriptorUrlInfoMsg');
                                    if (descriptorUrlInfoMsg.isVisible()) {
                                        descriptorUrlInfoMsg.hide();
                                    } else {
                                        descriptorUrlInfoMsg.show();
                                    }
                                },
                                scope: cmp
                            });
                        }
                    }
                },
                {
                    xtype: 'component',
                    itemId: 'descriptorUrlInfoMsg',
                    name: 'descriptorUrlInfoMsg',
                    cls: 'descriptorUrlInfoMsg',
                    hidden: true,
                    html: 'Enter the URL of a Application Descriptor and click the Load button. Application data, including page and widget definitions, is automatically retrieved from a Web-accessible location. To create the applifcation in OWF, click Apply.'
                },
                {
                    xtype: 'urlfield',
                    itemId: 'descriptorUrl',
                    name: 'descriptorUrl',
                    cls: 'descriptorUrlField',
                    allowBlank: true,
                    maxLength: 2083,
                    enableKeyEvents: true,
                    preventMark: true,
                    emptyText: 'https://mycompany.com/stack/descriptor.html',
                    usePlaceholderIfAvailable: false,
                    value: '',
                    rawValue: '',
                    anchor: '100%',
                    listeners: {
                        change: {
                            fn: this.handleDescriptorUrlChange,
                            scope: this
                        },
                        specialkey: {
                            fn: function(field, e){
                                // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                                // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                                if (e.getKey() == e.ENTER) {
                                    this.loadDescriptor(this);
                                }
                            },
                            scope: this
                        }
                    }
                },
                {
                    xtype: 'toolbar',
                    dock: 'bottom',
                    itemId: 'descriptorUrlToolbar',
                    name: 'descriptorUrlToolbar',
                    cls: 'descriptorUrlToolbar',
                    ui: 'footer',
                    defaults: {minWidth: 75},
                    items: [
                        {
                            text: '<u>Don\'t have an application descriptor?</u>',
                            itemId: 'manualEntryLinkBtn',
                            cls: 'manualEntryLinkBtn',
                            handler: function(btn) {
                                var field = this.getComponent('descriptorUrl');
                                field.setValue("");
                                // Show all major properties.
                                this.showProperties(true);
                                this.getComponent('descriptorUrlErrorMsg').hide();
                            },
                            scope: this
                        },
                        '->',
                        {
                            text: 'Load',
                            itemId: 'descriptorUrlBtn',
                            name: 'descriptorUrlBtn',
                            cls: 'descriptorUrlBtn',
                            margin: 0,
                            disabled: true,
                            handler: function(btn) {
                                var btnText = btn.getText();
                                if (btnText == 'Load') {
                                    this.loadDescriptor(this);
                                } else {
                                    var loading = this.getComponent('descriptorUrlLoading');
                                    var field = this.getComponent('descriptorUrl');
                                    if (this.xhr) {
                                        this.xhr.cancel();
                                    }
                                    loading.hide();
                                    field.enable();
                                    btn.setText('Load');
                                }
                            },
                            scope: this
                        }
                    ]
                },
                {
                    xtype: 'component',
                    itemId: 'descriptorUrlLoading',
                    name: 'descriptorUrlLoading',
                    cls: 'descriptorUrlLoading',
                    hidden: true,
                    html: '<img src="../themes/common/images/shared/large-loading.gif" /><br />Loading...'
                },
                {
                    xtype: 'component',
                    itemId: 'descriptorUrlErrorMsg',
                    name: 'descriptorUrlErrorMsg',
                    cls: 'descriptorUrlErrorMsg',
                    hidden: true,
                    html: 'Unable to retrieve application information. Please check your descriptor and try again.'
                },
                {
                    xtype: 'component',
                    name: 'horizontalRule',
                    itemId: 'horizontalRule',
                    cls: 'horizontalRule',
                    hidden: true,
                    html: '<hr>'
                },
                {
                    xtype: 'component',
                    itemId: 'manualEntryTitle',
                    name: 'manualEntryTitle',
                    cls: 'manualEntryTitle',
                    hidden: true,
                    html: 'Enter Application Description'
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    itemId: 'name',
                    fieldLabel: Ozone.util.createRequiredLabel('Title'),
                    hidden: true,
                    allowBlank: false,
                    maxLength: 256
                },
                {
                    xtype: 'textfield',
                    name: 'stackContext',
                    itemId: 'stackContext',
                    fieldLabel: Ozone.util.createRequiredLabel('URL Name'),
                    hidden: true,
                    allowBlank: false,
                    maxLength: 200,
                    regex: /^[a-zA-Z\d\-\_]+$/,
                    regexText: 'Invalid characters! The URL Name may only contain letters, numbers, dashes, and underscores.',
                    listeners: {
                        blur: {
                            fn: me.handleBlur
                        },
                        change: {
                            fn: function(field) {
                                me.handleChange(field);
                                me.down('#stackUrl').setValue(Ext.htmlEncode(OWF.getContainerUrl() + '/#stack=' + this.getValue()));
                            }
                        }
                    }
                },
                {
                    xtype: 'displayfield',
                    name: 'stackUrl',
                    itemId: 'stackUrl',
                    fieldLabel: 'Stack URL',
                    hidden: true,
                    value: OWF.getContainerUrl() + '/',
                    disabled: true
                },
                {
                    xtype: 'textarea',
                    name: 'description',
                    itemId: 'description',
                    fieldLabel: 'Description',
                    hidden: true,
                    height: 100,
                    allowBlank: true,
                    maxLength: 4000
                }
                // {
                //     xtype: 'urlfield',
                //     name: 'imageUrl',
                //     itemId: 'imageUrl',
                //     fieldLabel: 'Icon URL',
                //     hidden: true,
                //     allowBlank: true,
                //     maxLength: 2083,
                //     emptyText: 'https://mycompany.com/widget/images/icon.png'
                // }
            ]
        });
        this.callParent(arguments);

        this.on('afterrender',
        function() {
          // Disable apply button until descriptor load or manual entry mode
          var toolbars = this.getDockedItems('toolbar[dock="bottom"]');
          var applyBtn = toolbars[0].getComponent('apply');
          applyBtn.disable();

          if (this.ownerCt.launchData && this.ownerCt.launchData.id) {
              this.showProperties(true);
          }
        }, this, {
          single: true
        }
      );
    },

    initFieldValues: function(record) {
        var data = record ? record.data : record;
        this.record = data;

        if (data) {
            var name = this.getComponent('name'),
                description = this.getComponent('description'),
                stackContext = this.getComponent('stackContext'),
                descriptorUrl = this.getComponent('descriptorUrl');
                // imageUrl = this.getComponent('imageUrl');

            name.setValue(data.name).originalValue = data.name;
            description.setValue(data.description).originalValue = data.description;
            stackContext.setValue(data.stackContext).originalValue = data.stackContext;
            // imageUrl.setValue(data.imageUrl).originalValue = data.imageUrl;
            if(!descriptorUrl.getValue()) {
                descriptorUrl.setValue(data.descriptorUrl).originalValue = data.descriptorUrl;
            }

            //Update the descriptorUrlInfo title and help message for editing an existing widget
            this.getComponent('descriptorUrlInfo').titleEl.dom.innerHTML = 'Update Application from Descriptor URL';
            this.getComponent('descriptorUrlInfoMsg').update('Click Load to update the application. If the application descriptor file changed since it was added to your instance of OWF, clicking Load will retrieve the latest application data. To upload it to your OWF, click Apply.');

            if(data.descriptorUrl && this.getComponent('descriptorUrlErrorMsg').isHidden()) {
                this.loadedFromDescriptor = true;
                //this.disablePropertiesFields();
            }

            this.getForm().isValid();
        }
    },

    loadDescriptor: function(component) {
        var field = component.getComponent('descriptorUrl'),
            loading = component.getComponent('descriptorUrlLoading'),
            text = Ext.String.trim(field.getValue()),
            btn = component.getComponent('descriptorUrlToolbar').getComponent('descriptorUrlBtn'),
            applyBtn = this.getDockedItems('toolbar[dock="bottom"]')[0].getComponent('apply'),
            manualEntryLinkBtn = descriptorUrlToolbar.getComponent('manualEntryLinkBtn');

        component.getComponent('descriptorUrlErrorMsg').hide();
        field.disable();
        component.showProperties(false);
        loading.show();
        component.xhr = Ozone.util.Transport.getDescriptor({
            url : text,
            onSuccess: Ext.bind(component.updatePropertiesFromDescriptor, component),
            onFailure: function (json){
                if(component.record) {
                    component.showProperties(true);
                }
                else {
                    manualEntryLinkBtn.show();
                }
                loading.hide();
                field.enable();
                btn.setText('Load');
                component.getComponent('descriptorUrlErrorMsg').show();
            }
        });
        btn.setText('Cancel');
        //Disable the apply button while descriptor is loading
        applyBtn.disable();
    },

    updatePropertiesFromDescriptor: function(data) {
        this.loadedFromDescriptor = true;
        this.showProperties(true);
        var component = this;
        var loading = this.getComponent('descriptorUrlLoading');
        loading.hide();
        var btn = this.getComponent('descriptorUrlToolbar').getComponent('descriptorUrlBtn');
        btn.setText('Load');
        var descriptorUrl = component.getComponent('descriptorUrl');
        descriptorUrl.enable();
        this.loadedDecriptorUrl = descriptorUrl.getValue();
        this.descriptorData = data;
        if (data) {
            var name = component.getComponent('name'),
                description = component.getComponent('description'),
                stackContext = component.getComponent('stackContext')

            // Set the description values
            name.setValue(Ext.String.trim(data.name));
            description.setValue(Ext.String.trim(data.description || ""));
            stackContext.setValue(Ext.String.trim(data.stackContext));

            // Enable the apply button.
            var toolbars = this.getDockedItems('toolbar[dock="bottom"]');
            var applyBtn = toolbars[0].getComponent('apply');
            applyBtn.enable();
        }
        this.getForm().isValid();
        // this.ownerCt.fireEvent('recordupdated', this.record);
    },

    showProperties: function(show) {
        var descriptorUrlToolbar = this.getComponent('descriptorUrlToolbar');
        var manualEntryLinkBtn = descriptorUrlToolbar.getComponent('manualEntryLinkBtn');
        manualEntryLinkBtn.hide();

        var component = this;
        var horizontalRule = component.getComponent('horizontalRule'),
            manualEntryTitle = component.getComponent('manualEntryTitle'),
            name = component.getComponent('name'),
            stackContext = component.getComponent('stackContext'),
            description = component.getComponent('description'),
            stackUrl = component.getComponent('stackUrl')

        if (show) {
            // Enable the apply button.
            var toolbars = this.getDockedItems('toolbar[dock="bottom"]');
            var applyBtn = toolbars[0].getComponent('apply');
            applyBtn.enable();

            horizontalRule.show();
            manualEntryTitle.show();
            name.show();
            stackContext.show();
            description.show();
            stackUrl.show();
        } else {
            horizontalRule.hide();
            manualEntryTitle.hide();
            name.hide();
            stackContext.hide();
            description.hide();
            stackUrl.hide();
        }
    },

    handleDescriptorUrlChange: function(field, newValue, oldValue, eOpts) {
        var me = this,
            form = this.getForm();
            descriptorUrlToolbar = this.getComponent('descriptorUrlToolbar');
            descriptorUrlBtn = descriptorUrlToolbar.getComponent('descriptorUrlBtn');
        if (!field.changed && field.isDirty()) field.changed = true;
        if (field.isValid() && field.getValue()) {
            descriptorUrlBtn.enable();
        } else {
            descriptorUrlBtn.disable();
        }
    },

    onApply: function() {

        var me = this;

        this.validateFields();
        if(!this.getForm().hasInvalidField()){
        	//only perform this on creation of new stack from a descriptor
	        if(this.loadedFromDescriptor && !this.record) {

	            var dashboards = me.descriptorData.dashboards;
	            var validJson = true;
	            for (var i in dashboards) {
	                var dash = dashboards[i]
	                if(!Ozone.util.validateDashboardJSON(dash)){
	                    validJson = false;
	                }
	            }

	            var name = me.getComponent('name'),
                description = me.getComponent('description'),
                stackContext = me.getComponent('stackContext');

	            //overwrite json from editable form fields
	            me.descriptorData.name = name.getValue();
	            me.descriptorData.description = description.getValue();
	            me.descriptorData.stackContext = stackContext.getValue();
	            var owner = me.ownerCt;
	            if(validJson) {
	                Ozone.util.Transport.send({
	                    url : Ozone.util.contextPath() + '/stack/import',
	                    method : "POST",
	                    onSuccess: Ext.bind(function (json){
	                        me.showApplyAlert("Your changes have been saved.");

	                        owner.store.load({
	                        	callback: function(records, operation, success) {
	                        		owner.record = owner.store.getById(json.id);
	                        		owner.recordId = owner.record.get('id');
	    	                        me.initFieldValues(owner.record);
	    	                        owner.enableTabs();

	    	                        //need to publish here because there is no store write when importing
	    	                        OWF.Eventing.publish(owner.channel, {
	    	                            action: "created",
	    	                            domain: owner.domain,
	    	                            records: owner.record
	    	                        });
	                        	}
	                        });
	                    },me),
	                    onFailure: function (msg){
	                        me.editPanel.showAlert("Server Error!", Ext.JSON.decode(msg).errorMsg);
	                    },
	                    content : {
	                        data: Ext.encode(me.descriptorData),
	                        descriptorUrl: me.loadedDecriptorUrl
	                    }
	                });

	            }
	            else {
	            	me.editPanel.showAlert("Error", "Error while " +
                            "creating stack: " +
                            "invalid page json.");
	            }
	        }
	        else {
	            this.callParent();
	        }
        }
        else {
            this.showApplyAlert('Invalid field, changes cannot be saved.', 3000);
        }
    }
});
