Ext.define('Ozone.components.admin.group.StackEditPropertiesTab', {
    extend: 'Ozone.components.PropertiesPanel',
    alias: [
        'widget.stackeditproperties',
        'widget.stackeditpropertiestab',
        'widget.Ozone.components.admin.stack.StackEditPropertiesTab'
    ],
    cls: 'stackeditpropertiestab',
    
    initComponent: function () {
        var self = this;
        Ext.applyIf(this, {
            layout: 'fit',
            title: 'Properties',
            iconCls: 'properties-tab',
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    itemId: 'name',
                    fieldLabel: Ozone.util.createRequiredLabel('Title'),
                    allowBlank: false,
                    maxLength: 200,
                    enforceMaxLength: true
                },
                {
                    xtype: 'textarea',
                    name: 'description',
                    itemId: 'description',
                    fieldLabel: 'Description',
                    height: 100,
                    allowBlank: true,
                    maxLength: 255,
                    enforceMaxLength: true
                },
                {
                    xtype: 'textfield',
                    name: 'stackContext',
                    itemId: 'stackContext',
                    fieldLabel: Ozone.util.createRequiredLabel('Context'),
                    allowBlank: false,
                    maxLength: 200,
                    enforceMaxLength: true
                },
                {
                    xtype: 'urlfield',
                    name: 'imageUrl',
                    itemId: 'imageUrl',
                    fieldLabel: Ozone.util.createRequiredLabel('Icon URL'),
                    allowBlank: false,
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
        }
    }
});
