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
                    xtype: 'textfield',
                    name: 'name',
                    itemId: 'name',
                    fieldLabel: Ozone.util.createRequiredLabel('Title'),
                    allowBlank: false,
                    maxLength: 256
                },
                {
                    xtype: 'textfield',
                    name: 'stackContext',
                    itemId: 'stackContext',
                    fieldLabel: Ozone.util.createRequiredLabel('URL Name'),
                    allowBlank: false,
                    maxLength: 200,
                    regex: /^[a-zA-Z\d\-\_]+$/,
                    regexText: 'Invalid characters! The URL Name may only contain letters, numbers, dashes, and underscores.',
                    listeners: {
                        change: {
                            fn: function(field) {
                                me.handleChange(field);
                                me.down('#stackUrl').setValue(OWF.getContainerUrl() + '/' + this.getValue());
                            }
                        }
                    }
                },
                {
                    xtype: 'displayfield',
                    name: 'stackUrl',
                    itemId: 'stackUrl',
                    fieldLabel: 'Stack URL',
                    value: OWF.getContainerUrl() + '/',
                    disabled: true
                },
                {
                    xtype: 'textarea',
                    name: 'description',
                    itemId: 'description',
                    fieldLabel: 'Description',
                    height: 100,
                    allowBlank: true,
                    maxLength: 4000
                },
                {
                    xtype: 'urlfield',
                    name: 'imageUrl',
                    itemId: 'imageUrl',
                    fieldLabel: 'Icon URL',
                    allowBlank: true,
                    maxLength: 2083,
                    emptyText: 'https://mycompany.com/widget/images/icon.png'
                }
            ]
        });
        this.callParent(arguments);
    },
    
    initFieldValues: function(record) {
        var data = record ? record.data : record;
        
        if (data) {
            var name = this.getComponent('name'),
                description = this.getComponent('description'),
                stackContext = this.getComponent('stackContext'),
                imageUrl = this.getComponent('imageUrl');
  			
            name.setValue(data.name).originalValue = data.name;
            description.setValue(data.description).originalValue = data.description;
            stackContext.setValue(data.stackContext).originalValue = data.stackContext;
            imageUrl.setValue(data.imageUrl).originalValue = data.imageUrl;
            this.getForm().isValid();
        }
    }
});
