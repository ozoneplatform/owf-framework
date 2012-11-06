Ext.define('Ozone.components.admin.dashboard.DashboardEditPropertiesTab', {
  extend: 'Ozone.components.PropertiesPanel',
  alias: ['widget.dashboardeditproperties',
    'widget.dashboardeditpropertiestab',
    'widget.Ozone.components.admin.dashboard.DashboardEditPropertiesTab'],

  cls: 'dashboardeditpropertiestab',

  initComponent: function () {
    Ext.apply(this, {
      title: 'Properties',
      iconCls: 'properties-tab',
      items: [
        {
          xtype: 'hidden',
          name: 'guid',
          preventMark: true,
          itemId: 'guid'
        },
        {
          xtype: 'textfield',
          name: 'name',
          fieldLabel: Ozone.util.createRequiredLabel('Name'),
          allowBlank: false,
          maxLength: 200,
          enforceMaxLength: true,
          itemId: 'name',
          labelWidth: 140 //done in javascript because Ext would ignore anything we did in css anyway
        },
        {
          xtype: 'textarea',
          name: 'description',
          fieldLabel: 'Description',
          allowBlank: true,
          maxLength: 255,
          enforceMaxLength: true,
          itemId: 'description',
          labelWidth: 140 //done in javascript because Ext would ignore anything we did in css anyway
        },
        {
          xtype: 'textarea',
          fieldLabel: Ozone.util.createRequiredLabel('Definition'),
          name: 'definition',
          itemId: 'definition',
          allowBlank: true,
          labelWidth: 140, //done in javascript because Ext would ignore anything we did in css anyway
          height: 160,
          minHeight: 160,
          //anchor: '100% -90',
          validator: function(value) {
            try {
              Ext.decode(value);
            }
            catch (err) {
              return 'This field must be a valid JSON Object string';
            }

            //check for brackets which would indicate an array
            if (value != null && value.length > 0 && value.charAt(0) == '[' && value.charAt(value.length -1) == ']') {
              return 'This field must be a valid JSON Object string';
            }

            return true;
          }
        }
      ]
    });
    this.callParent(arguments);
  },
  initFieldValues: function(record) {
    var data = record ? record.data : record;

    if (data != null) {
      this.getComponent('guid').setValue(data.guid != null ? data.guid : '');
      this.getComponent('name').setValue(data.name != null ? data.name : '');
		
      this.getComponent('description').setValue(data.description != null ? data.description : '');
      
      var jsonString = null;
      if (data != null) {
        jsonString = owfdojo.toJson(data, true);
      }
      this.getComponent('definition').setValue(jsonString != null ? jsonString : '');
    }
  },
  onApply: function() {
    this.validateFields();
        
    if(!this.getForm().hasInvalidField()) {
        var panel = this;
        var widget = panel.ownerCt;

        //get values from the form
        var formValues = this.getValues();
        var name = formValues.name;
        var description = formValues.description;
        var definition = formValues.definition;

        ///get defObj
        var defObj = Ext.decode(definition);

        //override fields in defObj
        if (formValues.guid != '' && formValues.guid != null ) {
          defObj.guid = formValues.guid;
        }
        defObj.name = name;
        defObj.description = description;

        var record = widget.store.getAt(0);
        //editing an existing record
        if (record != null) {
          record.beginEdit();

          //clear all data fields
          record.data = {};

          //copy new data from the form into the fields
          for (var field in defObj) {
            if (!Ext.isFunction(field)) {
              record.set(field, defObj[field]);
            }
          }
          record.endEdit();
        }
        //no record found, creating new one
        else {
          //use a new guid if needed
          if (widget.launchData == null || widget.launchData.isCreate || formValues.guid == '' || formValues.guid == null) {
            defObj.guid = guid.util.guid();
          }

          widget.store.add(defObj);
          record = widget.store.data.items[0];
          record.phantom = true;
        }


        //sync form with the data which returns from the store.sync
        widget.store.on({
          write: {
            fn: function(store, operation, eOpts) {
            var recs = operation.getRecords();
            if (recs) {
              var rec = recs[0];
              if (rec) {
                var id = rec.getId();
                if (id) {
                  widget.recordId = id;
                }
                //once the save/update is complete update the form
                this.initFieldValues(rec);

                widget.enableTabs();
              }
            }
            widget.fireEvent('itemcreated', widget.recordId);
            },
            scope: this,
            single: this
          }
        });
        widget.store.sync();
    }
    else {
        this.showApplyAlert('Invalid field, changes cannot be saved.', 3000);
    }
  }

});
