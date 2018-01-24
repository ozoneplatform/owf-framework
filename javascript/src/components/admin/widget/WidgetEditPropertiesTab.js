Ext.define('Ozone.components.admin.widget.WidgetEditPropertiesTab', {
    extend: 'Ozone.components.PropertiesPanel',
    alias: [
        'widget.widgeteditproperties',
        'widget.widgeteditpropertiestab',
        'widget.Ozone.components.admin.widget.WidgetEditPropertiesTab'
    ],
    widgetTypeStore: null,
    cls: 'widgeteditpropertiestab',
    record: null,
    xhr: null,

    initComponent: function () {
        var me = this;
        var newGuid = guid.util.guid();
        this.widgetTypeStore = Ext.create('Ozone.data.WidgetTypeStore');

        Ext.applyIf(this, {
            layout: 'fit',
            title: 'Properties',
            iconCls: 'properties-tab',
            defaults: {
                labelWidth: 155
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
                        descriptorUrlTitle: 'Import App Component from Descriptor URL'
                    },
                    renderSelectors: {
                        iconEl: '.descriptorUrlInfoIcon',
                        titleEl: '.descriptorUrlTitle'
                    },
                    listeners: {
                        afterrender: function (cmp) {
                            // After rendering the component will have an iconEl property
                            cmp.iconEl.on('click', function () {
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
                    html: 'Enter the URL of a App Component Descriptor and click the Load button. App Component data is automatically retrieved from a Web-accessible location. To create the App Component Definition in OWF, click Apply.'
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
                    emptyText: 'https://mycompany.com/appcomponent/descriptor.html',
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
                            fn: function (field, e) {
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
                            text: '<u>Don\'t have a descriptor URL?</u>',
                            itemId: 'manualEntryLinkBtn',
                            cls: 'manualEntryLinkBtn',
                            handler: function (btn) {
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
                            handler: function (btn) {
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
                    html: 'Unable to retrieve App Component information. Please check your descriptor and try again.'
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
                    html: 'Enter App Component Description'
                },
                {
                    xtype: 'hidden',
                    name: 'widgetGuid',
                    itemId: 'widgetGuid',
                    value: newGuid,
                    preventMark: true
                },
                {
                    xtype: 'textfield',
                    itemId: 'name',
                    name: 'name',
                    hidden: true,
                    allowBlank: false,
                    blankText: Ozone.layout.DialogMessages.widgetDefinition_displayNameField_blankText,
                    maxLength: 256,
                    emptyText: 'MyAppComponent',
                    usePlaceholderIfAvailable: false,
                    fieldLabel: Ozone.util.createRequiredLabel('Name')
                },
                {
                    xtype: 'textarea',
                    itemId: 'description',
                    name: 'description',
                    hidden: true,
                    allowBlank: true,
                    maxLength: 4000,
                    emptyText: 'Describe the App Component',
                    usePlaceholderIfAvailable: false,
                    fieldLabel: 'Description'
                },
                {
                    xtype: 'textfield',
                    name: 'version',
                    itemId: 'version',
                    hidden: true,
                    allowBlank: true,
                    blankText: Ozone.layout.DialogMessages.widgetDefinition_widgetVersionField_blankText,
                    maxLength: 256,
                    emptyText: '1.0',
                    usePlaceholderIfAvailable: false,
                    fieldLabel: 'Version'
                },
                {
                    xtype: 'textfield',
                    name: 'universalName',
                    itemId: 'universalName',
                    hidden: true,
                    allowBlank: true,
                    emptyText: 'MyAppComponent.mycompany.com',
                    usePlaceholderIfAvailable: false,
                    fieldLabel: 'Universal Name'
                },
                {
                    xtype: 'displayfield',
                    fieldLabel: 'GUID',
                    itemId: 'guid',
                    hidden: true,
                    value: newGuid,
                    preventMark: true
                },
                {
                    xtype: 'urlfield',
                    name: 'url',
                    itemId: 'url',
                    hidden: true,
                    allowBlank: false,
                    blankText: Ozone.layout.DialogMessages.widgetDefinition_widgetUrlField_blankText,
                    fieldLabel: Ozone.util.createRequiredLabel('URL'),
                    emptyText: 'https://mycompany.com/appcomponent/MyAppComponent.html',
                    usePlaceholderIfAvailable: false,
                    maxLength: 2083
                },
                {
                    xtype: 'urlfield',
                    name: 'headerIcon',
                    itemId: 'headerIcon',
                    hidden: true,
                    allowBlank: false,
                    blankText: Ozone.layout.DialogMessages.widgetDefinition_imageUrlSmallField_blankText,
                    maxLength: 2083,
                    emptyText: 'https://mycompany.com/appcomponent/images/containerIcon.png',
                    usePlaceholderIfAvailable: false,
                    fieldLabel: Ozone.util.createRequiredLabel('Small Icon URL')
                },
                {
                    xtype: 'urlfield',
                    name: 'image',
                    itemId: 'image',
                    hidden: true,
                    allowBlank: false,
                    blankText: Ozone.layout.DialogMessages.widgetDefinition_imageLargeUrlField_blankText,
                    maxLength: 2083,
                    emptyText: 'https://mycompany.com/appcomponent/images/launchMenuIcon.png',
                    usePlaceholderIfAvailable: false,
                    fieldLabel: Ozone.util.createRequiredLabel('Medium Icon URL')
                },
                {
                    xtype: 'numberfield',
                    name: 'width',
                    itemId: 'width',
                    hidden: true,
                    allowBlank: false,
                    blankText: Ozone.layout.DialogMessages.widgetDefinition_widthNumberField_blankText,
                    fieldLabel: Ozone.util.createRequiredLabel('Width'),
                    value: 200,
                    minValue: 200,
                    maxValue: 2000
                },
                {
                    xtype: 'numberfield',
                    name: 'height',
                    itemId: 'height',
                    hidden: true,
                    allowBlank: false,
                    blankText: Ozone.layout.DialogMessages.widgetDefinition_heightNumberField_blankText,
                    fieldLabel: Ozone.util.createRequiredLabel('Height'),
                    value: 200,
                    minValue: 200,
                    maxValue: 2000
                },
                {
                    xtype: 'combobox',
                    name: '_types',
                    itemId: '_types',
                    hidden: true,
                    fieldLabel: Ozone.util.createRequiredLabel('App Component Type'),
                    valueNotFoundText: 'invalid App Component type',
                    forceSelection: true,
                    allowBlank: false,
                    editable: false,
                    store: this.widgetTypeStore,
                    displayField: 'displayName',
                    valueField: 'id',
                    autoSelect: true,
                    queryMode: 'local'
                },
                {
                    xtype: 'checkbox',
                    name: 'singleton',
                    itemId: 'singleton',
                    hidden: true,
                    submitValue: true,
                    fieldLabel: 'Singleton',
                    preventMark: true
                },
                {
                    xtype: 'checkbox',
                    name: 'mobileReady',
                    itemId: 'mobileReady',
                    hidden: true,
                    submitValue: true,
                    fieldLabel: 'Mobile Ready',
                    preventMark: true
                },
                {
                    xtype: 'checkbox',
                    name: 'visible',
                    itemId: 'visible',
                    hidden: true,
                    submitValue: true,
                    checked: true,
                    fieldLabel: 'Visible',
                    preventMark: true
                },
                {
                    xtype: 'checkbox',
                    name: 'background',
                    itemId: 'background',
                    hidden: true,
                    submitValue: true,
                    checked: false,
                    fieldLabel: 'Background',
                    preventMark: true
                },
                {
                    xtype: 'hidden',
                    name: 'intents',
                    itemId: 'intents',
                    value: null,
                    preventMark: true
                }
            ]
        });
        this.addEvents('recordupdated');

        this.callParent(arguments);
        //handle auto-selecting widget type for a new widget
        this.on('afterrender',
            function () {
                // Disable apply button until descriptor load or manual entry mode
                var toolbars = this.getDockedItems('toolbar[dock="bottom"]');
                var applyBtn = toolbars[0].getComponent('apply');
                applyBtn.disable();

                if (this.ownerCt.launchData && this.ownerCt.launchData.id) {
                    this.showProperties(true);
                }
                var widgetType = this.getComponent('_types');
                if (!widgetType.value) {
                    this.widgetTypeStore.load({
                        callback: function () {
                            widgetType.setRawValue(widgetType.store.findRecord('name', 'standard').get('displayName'));
                            me.setWidgetType();
                        }
                    });
                }
            }, this, {
                single: true
            }
        );
    },
    initFieldValues: function (record) {
        var component = this;
        var data = record ? record.data : record;
        this.record = data;
        if (data) {
            var newGuid = (data && data.widgetGuid) ? data.widgetGuid : guid.util.guid();
            var widgetGuid = component.getComponent('widgetGuid'),
                name = component.getComponent('name'),
                description = component.getComponent('description'),
                version = component.getComponent('version'),
                universalName = component.getComponent('universalName'),
                guid = component.getComponent('guid'),
                url = component.getComponent('url'),
                headerIcon = component.getComponent('headerIcon'),
                image = component.getComponent('image'),
                width = component.getComponent('width'),
                height = component.getComponent('height'),
                singleton = component.getComponent('singleton'),
                visible = component.getComponent('visible'),
                background = component.getComponent('background'),
                mobileReady = component.getComponent('mobileReady'),
                widgetType = component.getComponent('_types'),
                descriptorUrl = component.getComponent('descriptorUrl'),
                intents = component.getComponent('intents');


            widgetGuid.setValue(newGuid).originalValue = newGuid;
            name.setValue(data.name).originalValue = data.name;
            description.setValue(data.description).originalValue = data.description;
            version.setValue(data.version).originalValue = data.version;
            universalName.setValue(data.universalName).originalValue = data.universalName;
            guid.setValue(newGuid).originalValue = newGuid;
            url.setValue(data.url).originalValue = data.url;
            headerIcon.setValue(data.headerIcon).originalValue = data.headerIcon;
            image.setValue(data.image).originalValue = data.image;
            width.setValue(data.width).originalValue = data.width;
            height.setValue(data.height).originalValue = data.height;
            singleton.setValue(data.singleton).originalValue = data.singleton;
            visible.setValue(data.visible).originalValue = data.visible;
            background.setValue(data.background).originalValue = data.background;
            mobileReady.setValue(data.mobileReady).originalValue = data.mobileReady;
            if (!descriptorUrl.getValue()) {
                descriptorUrl.setValue(data.descriptorUrl).originalValue = data.descriptorUrl;
            }

            var strIntents = Ext.JSON.encode(data.intents);
            intents.setValue(strIntents).originalValue = strIntents;
            this.setWidgetType();

            //Update the descriptorUrlInfo title and help message for editing an existing widget
            component.getComponent('descriptorUrlInfo').titleEl.dom.innerHTML = 'Update App Component from Descriptor URL';
            component.getComponent('descriptorUrlInfoMsg').update('Click Load to update the App Component. If the App Component file changed since it was added to your instance of OWF, clicking Load will retrieve the latest App Component data. To upload it to your OWF, click Apply.');

            //Enable all the intent CRUD buttons
            var intentsTab = component.ownerCt.down('#intents-tab');
            intentsTab.down('#btnCreate').enable();
            intentsTab.down('#btnEdit').enable();
            intentsTab.down('#btnDelete').enable();
            this.getForm().isValid();
        }

        this.ownerCt.fireEvent('recordupdated', this.record);
    },

    loadDescriptor: function (component) {
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
            url: text,
            onSuccess: Ext.bind(component.updatePropertiesFromDescriptor, component),
            onFailure: function (json) {
                if (component.record) {
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

    updatePropertiesFromDescriptor: function (data) {
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
        this.record = data;
        if (data) {
            var newGuid = (data && data.widgetGuid) ? data.widgetGuid : this.generateNewGuid();
            var widgetGuid = component.getComponent('widgetGuid'),
                name = component.getComponent('name'),
                description = component.getComponent('description'),
                version = component.getComponent('version'),
                universalName = component.getComponent('universalName'),
                guid = component.getComponent('guid'),
                url = component.getComponent('url'),
                headerIcon = component.getComponent('headerIcon'),
                image = component.getComponent('image'),
                width = component.getComponent('width'),
                height = component.getComponent('height'),
                singleton = component.getComponent('singleton'),
                visible = component.getComponent('visible'),
                background = component.getComponent('background'),
                mobileReady = component.getComponent('mobileReady'),
                widgetType = component.getComponent('_types'),
                intents = component.getComponent('intents');

            // Only change guid and universalId if this is a new record
            if (!this.ownerCt.recordId) {
                widgetGuid.setValue(Ext.String.trim(newGuid));
                guid.setValue(Ext.String.trim(newGuid));
            }

            // Set the description values
            name.setValue(Ext.String.trim(data.displayName));
            description.setValue(Ext.String.trim(data.description || ""));
            version.setValue(Ext.String.trim(data.widgetVersion || ""));
            universalName.setValue(Ext.htmlEncode(data.universalName) || "");
            url.setValue(Ext.String.trim(data.widgetUrl));
            headerIcon.setValue(Ext.String.trim(data.imageUrlSmall));
            image.setValue(Ext.String.trim(data.imageUrlMedium || data.imageUrlLarge));
            width.setValue(data.width);
            height.setValue(data.height);
            singleton.setValue(data.singleton);
            visible.setValue(data.visible);
            background.setValue(data.background);
            mobileReady.setValue(data.mobileReady);
            intents.setValue(Ext.JSON.encode(data.intents || ""));

            this.record.intents = data.intents || {};

            // Set widget type
            var typeId = data.widgetTypes[0];
            if (!Ext.isNumeric(typeId)) {
                widgetType.setRawValue(widgetType.store.findRecord('name', 'standard').get('displayName'));
                typeId = this.widgetTypeStore.getAt(this.widgetTypeStore.find('name', typeId)).get('id');
            }
            this.getComponent('_types').setValue(typeId);

            // Set title because incoming json won't have this value
            data.title = Ext.String.trim(data.displayName);

            // Set record
            this.ownerCt.record = new Ozone.data.WidgetDefinition(data);
            this.ownerCt.record.phantom = true;

            // Enable the apply button.
            var toolbars = this.getDockedItems('toolbar[dock="bottom"]');
            var applyBtn = toolbars[0].getComponent('apply');
            applyBtn.enable();
        }
        this.getForm().isValid();
        this.ownerCt.fireEvent('recordupdated', this.record);
    },

    showProperties: function (show) {
        var descriptorUrlToolbar = this.getComponent('descriptorUrlToolbar');
        var manualEntryLinkBtn = descriptorUrlToolbar.getComponent('manualEntryLinkBtn');
        manualEntryLinkBtn.hide();

        var component = this;
        var horizontalRule = component.getComponent('horizontalRule'),
            manualEntryTitle = component.getComponent('manualEntryTitle'),
            name = component.getComponent('name'),
            description = component.getComponent('description'),
            version = component.getComponent('version'),
            universalName = component.getComponent('universalName'),
            guid = component.getComponent('guid'),
            url = component.getComponent('url'),
            headerIcon = component.getComponent('headerIcon'),
            image = component.getComponent('image'),
            width = component.getComponent('width'),
            height = component.getComponent('height'),
            singleton = component.getComponent('singleton'),
            visible = component.getComponent('visible'),
            background = component.getComponent('background'),
            mobileReady = component.getComponent('mobileReady'),
            widgetType = component.getComponent('_types');

        if (show) {
            // Enable the apply button.
            var toolbars = this.getDockedItems('toolbar[dock="bottom"]');
            var applyBtn = toolbars[0].getComponent('apply');
            applyBtn.enable();

            horizontalRule.show();
            manualEntryTitle.show();
            name.show();
            description.show();
            version.show();
            universalName.show();
            guid.show();
            url.show();
            headerIcon.show();
            image.show();
            width.show();
            height.show();
            singleton.show();
            visible.show();
            background.show();
            mobileReady.show();
            widgetType.show();
        } else {
            horizontalRule.hide();
            manualEntryTitle.hide();
            name.hide();
            description.hide();
            version.hide();
            universalName.hide();
            guid.hide();
            url.hide();
            headerIcon.hide();
            image.hide();
            width.hide();
            height.hide();
            singleton.hide();
            visible.hide();
            background.hide();
            mobileReady.hide();
            widgetType.hide();
        }
    },
    handleDescriptorUrlChange: function (field, newValue, oldValue, eOpts) {
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
    onApply: function () {
        this.validateFields();

        if (!this.getForm().hasInvalidField()) {
            var panel = this;
            var widget = panel.ownerCt;
            var record = null;

            // Collect form values. Can't use this.getValues() because if descriptorUrl is used
            // fields may be disabled.
            var formFields = ['widgetGuid', 'name', 'description', 'version', 'universalName',
                'guid', 'url', 'headerIcon', 'image', 'width',
                'height', 'singleton', 'visible',
                'background', '_types', 'intents', 'mobileReady'];

            var formValues = {};
            for (var i = 0; i < formFields.length; i++) {
                var field = formFields[i];
                var cmp = this.getComponent(field);
                var value = cmp.getValue();
                if (Ext.isEmpty(value) || (cmp.inputEl && cmp.inputEl.hasCls(cmp.emptyCls))) {
                    if (field in ['singleton', 'visible', 'background', 'mobileReady']) {
                        formValues[field] = false;
                    } else {
                        formValues[field] = "";
                    }
                } else if (field == 'intents' && value) {
                    formValues[field] = Ozone.util.parseJson(value);
                } else {
                    formValues[field] = value;
                }
            }

            //If descriptor url was successfully loaded save it, otherwise ignore it so we don't change
            //the record's previous value.
            if (panel.loadedDecriptorUrl) {
                formValues['descriptorUrl'] = panel.loadedDecriptorUrl;
            }

            if (widget.store.data.length > 0) {
                record = widget.store.getById(widget.recordId);
                record.beginEdit();
                for (field in formValues) {
                    record.set(field, formValues[field]);
                }
                record.endEdit();
            }
            else {
                widget.store.add(formValues);
                record = widget.store.data.items[0];
                record.phantom = true;
            }

            var types = [];
            var typeId = formValues['_types'];
            if (!Ext.isNumeric(typeId)) {
                typeId = this.widgetTypeStore.getAt(this.widgetTypeStore.find('name', typeId)).get('id');
            }
            types.push({
                id: typeId,
                name: this.widgetTypeStore.getById(typeId).get('name')
            });
            record.beginEdit();
            // Set title because incoming json won't have this value
            record.set('title', formValues['name']);

            record.set('widgetTypes', types);
            record.endEdit();

            widget.record = record;
            widget.store.on({
                write: {
                    fn: function () {
                        if (Ext.isFunction(panel.initFieldValues)) {
                            panel.showProperties(true);
                            panel.initFieldValues(widget.record);
                        }
                        this.refreshWidgetLaunchMenu();
                    },
                    scope: this,
                    single: true
                }
            });
            widget.store.save();
        }
        else {
            this.showApplyAlert('Invalid field, changes cannot be saved.', 3000);
        }
    },
    setWidgetType: function () {
        var widgetTypeCmp = this.getComponent('_types');
        if (widgetTypeCmp) {
            if (this.record && this.record.widgetTypes) {
                var widgetTypeObj = this.record.widgetTypes[0];
                if (widgetTypeObj) {
                    widgetTypeCmp.setValue(widgetTypeObj.id).originalValue = widgetTypeObj.id;
                }
            }
        }
    },
    generateNewGuid: function () {
        return guid.util.guid();
    }
});
