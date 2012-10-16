Ext.define('Ozone.components.admin.group.GroupEditPropertiesTab', {
    extend: 'Ozone.components.PropertiesPanel',
    alias: [
        'widget.groupeditproperties',
        'widget.groupeditpropertiestab',
        'widget.Ozone.components.admin.group.GroupEditPropertiesTab'
    ],
    cls: 'groupeditpropertiestab',
    
    initComponent: function () {
        //get widget to launch
        var self = this;
        Ext.applyIf(this, {
          layout: 'fit',
          title: 'Properties',
          iconCls: 'properties-tab',
          items: [{
              xtype: 'textfield',
              name: 'name',
              fieldLabel: Ozone.util.createRequiredLabel('Name'),
              labelWidth: 150,
              allowBlank: false,
              maxLength: 200,
              enforceMaxLength: true,
              disabledCls: 'properties-field-disabled',
              disable: function(silent) {
                  var me = this;

                  if (me.rendered) {
                      me.el.addCls(me.disabledCls);
//                      me.el.dom.disabled = true;
                      me.onDisable();
                  }

                  me.disabled = true;

                  if (silent !== true) {
                      me.fireEvent('disable', me);
                  }

                  return me;
              },
              itemId: 'name'
            },
            {
              xtype: 'textfield',
              name: 'displayName',
              fieldLabel: 'Display Name',
              allowBlank: true,
              maxLength: 200,
              enforceMaxLength: true,
              itemId: 'displayName',
              labelWidth: 150
            },
            {
              xtype: 'textarea',
              fieldLabel: 'Description',
              labelWidth: 150,
              name: 'description',
              itemId: 'description',
              height: 100,
              allowBlank: true,
              maxLength: 255,
              enforceMaxLength: true
            },
            {
              xtype: 'checkbox',
              name: 'automatic',
              submitValue: true,
              inputValue: true,
              disabledCls: 'properties-checkboxfield-disabled',
              fieldLabel: 'User Management',
              labelWidth: 150,
              boxLabel: 'Automatic',
			  preventMark: true,
              disable: function(silent) {
                  var me = this;

                  if (me.rendered) {
                      me.el.addCls(me.disabledCls);
//                      me.el.dom.disabled = true;
                      me.onDisable();
                  }

                  me.disabled = true;

                  if (silent !== true) {
                      me.fireEvent('disable', me);
                  }

                  return me;
              },
              itemId: 'automatic'
            },
            {
              xtype: 'checkbox',
              name: 'activated',
              submitValue: false,
              fieldLabel: 'Active',
              labelWidth: 150,
              itemId: 'activated',
              boxLabel: 'True',
			  preventMark: true,
              listeners: {
                change: function(field, newValue, oldValue, opts) {
                  var fld = self.getComponent('status');
                  if (fld) {
                    if (newValue) {
                      fld.setValue('active');
                    }
                    else {
                      fld.setValue('inactive');
                    }
                  }
                }
              }
            },
            {
              xtype: 'hidden',
              name: 'status',
              itemId: 'status',
			  preventMark: true,
			  value: 'inactive'
            }
          ]
        });
        this.callParent(arguments);
    },
    initFieldValues: function(record) {
        var component = this;
        var data = record ? record.data : record;
        
  		if (data) {
  			var name = component.getComponent('name'), 
  			    description = component.getComponent('description'), 
  				automatic = component.getComponent('automatic'), 
  				activated = component.getComponent('activated'), 
  				status = component.getComponent('status'),
  				displayName = component.getComponent('displayName');
  			
  			name.setValue(data.name).originalValue = data.name;
  			name.setDisabled(data.automatic);
  			displayName.setValue(data.displayName).originalValue = data.displayName;
  			description.setValue(data.description).originalValue = data.description;
  			automatic.setValue(data.automatic).originalValue = data.automatic;
  			automatic.setDisabled(true);
  			activated.setValue('active' == data.status).originalValue = 'active' == data.status;
  			status.setValue(data.status).originalValue = data.status;
  		}
    }
});
