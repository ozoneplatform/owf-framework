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
              name: 'title',
              itemId: 'title',
              fieldLabel: Ozone.util.createRequiredLabel('Title'),
              allowBlank: false,
              maxLength: 255,
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
              xtype: 'urlfield',
              name: 'icon',
              itemId: 'icon',
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
  			var title = this.getComponent('title'), 
  			    description = this.getComponent('description'), 
  				icon = this.getComponent('icon');
  			
  			title.setValue(data.title).originalValue = data.title;
  			description.setValue(data.description).originalValue = data.description;
  			icon.setValue(data.icon).originalValue = data.icon;
  		}
    }
});
