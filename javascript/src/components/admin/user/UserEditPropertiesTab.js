Ext.define('Ozone.components.admin.user.UserEditPropertiesTab', {
    extend: 'Ozone.components.PropertiesPanel',
    alias: ['widget.usereditproperties',
            'widget.usereditpropertiestab',
            'widget.Ozone.components.admin.user.UserEditPropertiesTab'],
        
    cls: 'usereditpropertiestab',
    
    initComponent: function () {
        //get widget to launch
        Ext.apply(this,{
            title: 'Properties',
            iconCls: 'properties-tab',
            items: [{
                xtype: 'textfield',
                name: 'username',
                fieldLabel: Ozone.util.createRequiredLabel('User Name'),
                disabledCls: 'properties-field-disabled',
                maxLength: 200,
                allowBlank: false,
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
                itemId: 'username'
            }, {
                xtype: 'textfield',
                fieldLabel: Ozone.util.createRequiredLabel('Full Name'),
                name: 'userRealName',
                itemId: 'userRealName',
                allowBlank: false,
                maxLength: 200
            }, {
                xtype: 'textfield',
                allowBlank: true,
                fieldLabel: 'Email',
                name: 'email',
                itemId: 'email',
                vtype: 'email',
                maxLength: 200
            }]
        });
        this.callParent(arguments);
    },
    
    initFieldValues: function(record) {
        var component = this;
        var data = record ? record.data : record;
        
        if (data) {
			var username = component.getComponent('username'),
			    userRealName = component.getComponent('userRealName'),
				email = component.getComponent('email');
			
            username.setValue(data.username).originalValue = data.username;
            username.setDisabled(true);
            userRealName.setValue(data.userRealName).originalValue = data.userRealName;
            email.setValue(data.email).originalValue = data.email;
        }
    }
});