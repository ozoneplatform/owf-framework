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

    initComponent: function() {
        var me = this;
        var newGuid = guid.util.guid();
        this.widgetTypeStore = Ext.create('Ozone.data.WidgetTypeStore');
        
      Ext.applyIf(this, {
        layout:'fit',
        title: 'Properties',
        iconCls: 'properties-tab',
        defaults: {
          labelWidth: 150
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
        		  descriptorUrlTitle: 'Create Widget from Descriptor URL'
        	  },
              renderSelectors: {
                  iconEl: '.descriptorUrlInfoIcon'
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
        	  html: 'Enter the URL of a Widget Descriptor and click the Load button. This allows all pertinent Widget Information, including the Universal Name, to be used in the creation of a Widget Definition.'
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
              emptyText: 'https://mycompany.com/widget/descriptor.html',
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
        	    	  text: '<u>Don\'t have a descriptor URL?</u>',
        	    	  itemId: 'manualEntryLinkBtn',
        	    	  cls: 'manualEntryLinkBtn',
        	    	  handler: function(btn) {
		        		  var field = this.getComponent('descriptorUrl');
		        		  var universalName = this.getComponent('universalName');
                                          var description_dsp = this.getComponent('description_dsp');
		        		  field.setValue("");
		        		  // Show all major properties.
        	    		  this.showProperties(true);
        	    		  // Explicitly hide the Universal ID in manual entry mode.
        	    		  universalName.hide();
                                  description_dsp.hide();
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
        	  html: 'Unable to retrieve widget information. Please check your descriptor and try again.'
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
        	  html: 'Enter Widget Description'
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
            emptyText: 'MyWidget',
            fieldLabel: Ozone.util.createRequiredLabel('Name')
          },
          {
            xtype: 'textarea',
            itemId: 'description',
            name: 'description',
            hidden: true,
            allowBlank: true,
            maxLength: 4000,
            emptyText: 'Describe the widget',
            fieldLabel: 'Description'
          },
          {
            xtype: 'displayfield',
            itemId: 'description_dsp',
            name: 'description_dsp',
            fieldLabel: 'Description',
            hidden: true
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
            fieldLabel: 'Version'
          },
          {
            xtype: 'displayfield',
            name: 'universalName',
            itemId: 'universalName',
            hidden: true,
            allowBlank: true,
            emptyText: 'MyWidget.mycompany.com',
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
            emptyText: 'https://mycompany.com/widget/MyWidget.html',
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
            emptyText: 'https://mycompany.com/widget/images/containerIcon.png',
            fieldLabel: Ozone.util.createRequiredLabel('Container Icon URL')
          },
          {
            xtype: 'urlfield',
            name: 'image',
            itemId: 'image',
            hidden: true,
            allowBlank: false,
            blankText: Ozone.layout.DialogMessages.widgetDefinition_imageLargeUrlField_blankText,
            maxLength: 2083,
            emptyText: 'https://mycompany.com/widget/images/launchMenuIcon.png',
            fieldLabel: Ozone.util.createRequiredLabel('Launch Menu Icon URL')
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
            xtype: 'textfield',
            name: '_tags',
            itemId: '_tags',
            hidden: true,
            emptyText: 'geo, map, tracking',
            fieldLabel: 'Default Tags'
          },
          {
            xtype: 'combobox',
            name: '_types',
            itemId: '_types',
            hidden: true,
            fieldLabel: Ozone.util.createRequiredLabel('Widget Type'),
            valueNotFoundText: 'invalid widget type',
            forceSelection: true,
            allowBlank: false,
            editable: false,
            store: this.widgetTypeStore,
            displayField: 'name',
            valueField: 'id',
            autoSelect:true,
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
          }]
      });
      this.addEvents('recordupdated');
      
      this.callParent(arguments);
      //handle auto-selecting widget type for a new widget
      this.on('afterrender',
        function() {
    	  if (this.ownerCt.launchData && this.ownerCt.launchData.id) {
    		  this.showProperties(true);
    	  }
          var widgetType = this.getComponent('_types');
          if(!widgetType.value) {
            this.widgetTypeStore.load({
              callback: function() {
                widgetType.setRawValue(widgetType.store.findRecord('name','standard').get('name'));
                me.setWidgetType();
              }
            });
          }
    	}, this, {
          single: true
        } 
      );
    },
    initFieldValues: function(record) {
        var component = this;
        var data = record ? record.data : record;
        this.record = data;
        if (data) {
            var strTags = "";
            var newGuid = (data && data.widgetGuid) ? data.widgetGuid : guid.util.guid();
			var widgetGuid = component.getComponent('widgetGuid'),
			    name = component.getComponent('name'),
			    description = component.getComponent('description'),
                            description_dsp = component.getComponent('description_dsp'),
				version = component.getComponent('version'),
				universalName = component.getComponent('universalName'),
				guid = component.getComponent('guid'),
				url = component.getComponent('url'),
				headerIcon = component.getComponent('headerIcon'),
				image = component.getComponent('image'),
				width = component.getComponent('width'),
				height = component.getComponent('height'),
				tags = component.getComponent('_tags'),
				singleton = component.getComponent('singleton'),
				visible = component.getComponent('visible'),
				background = component.getComponent('background'),
				widgetType = component.getComponent('_types'),
        		descriptorUrl = component.getComponent('descriptorUrl'),
				intents = component.getComponent('intents');

            for (var i = 0; data && data.tags && i < data.tags.length; i++) {
                strTags += data.tags[i].name;
                if (i < data.tags.length - 1) {
                    strTags += ", ";
                }
            }
            strTags = Ext.util.Format.htmlDecode(strTags);

            widgetGuid.setValue(newGuid).originalValue = newGuid;
            name.setValue(data.name).originalValue = data.name;
            description.setValue(data.description).originalValue = data.description;
            description_dsp.setValue(data.description)
            version.setValue(data.version).originalValue = data.version;
            universalName.setValue(data.universalName).originalValue = data.universalName;
            guid.setValue(newGuid).originalValue = newGuid;
            url.setValue(data.url).originalValue = data.url;
            headerIcon.setValue(data.headerIcon).originalValue = data.headerIcon;
            image.setValue(data.image).originalValue = data.image;
            width.setValue(data.width).originalValue = data.width;
            height.setValue(data.height).originalValue = data.height;
            tags.setValue(strTags).originalValue = strTags;
            singleton.setValue(data.singleton).originalValue = data.singleton;
            visible.setValue(data.visible).originalValue = data.visible;
            background.setValue(data.background).originalValue = data.background;
            descriptorUrl.setValue(data.descriptorUrl).originalValue = data.descriptorUrl;
            
            var strIntents = Ext.JSON.encode(data.intents);
            intents.setValue(strIntents).originalValue = strIntents;
            this.setWidgetType();
            
            // If we have a descriptor URL, disable the edit fields.
            if(data.descriptorUrl) {
            	this.loadedFromDescriptor = true;
            	this.disablePropertiesFields();
                description.hide();
            }
            else {
                universalName.hide();
                description_dsp.hide();
            }
            this.getForm().isValid();
        }
        
      	// Enable the apply button.
      	var toolbars = this.getDockedItems('toolbar[dock="bottom"]');
      	var applyBtn = toolbars[0].getComponent('apply');
      	applyBtn.disable(); 
      	
        this.ownerCt.fireEvent('recordupdated', this.record);
    },
    
    loadDescriptor: function(component) {
		var field = component.getComponent('descriptorUrl');
		var loading = component.getComponent('descriptorUrlLoading');
		var text = Ext.String.trim(field.getValue());
		var btn = component.getComponent('descriptorUrlToolbar').getComponent('descriptorUrlBtn');
		
		component.getComponent('descriptorUrlErrorMsg').hide();
		field.disable();
		component.showProperties(false);
		loading.show();
		component.xhr = Ozone.util.Transport.send({
            url : text,
            method : "GET",
            forceXdomain: true,
            onSuccess: Ext.bind(component.updatePropertiesFromDescriptor, component),
            onFailure: function (json){
          	  	loading.hide();
        		field.enable();
    			btn.setText('Load');
    			component.showProperties(true);
    			component.getComponent('descriptorUrlErrorMsg').show();
            },
            autoSendVersion : false
        });
		btn.setText('Cancel');
    },
    
    updatePropertiesFromDescriptor: function(data) {
    	this.loadedFromDescriptor = true;
    	this.showProperties(true);
        var component = this;
		var loading = this.getComponent('descriptorUrlLoading');
		loading.hide();
		var btn = this.getComponent('descriptorUrlToolbar').getComponent('descriptorUrlBtn');
		btn.setText('Load');
		var field = this.getComponent('descriptorUrl');
		field.enable();
        this.record = data;
    	this.record.descriptorUrl = field.getValue();
        if (data) {
            var strTags = "";
            var newGuid = (data && data.widgetGuid) ? data.widgetGuid : this.generateNewGuid();
			var widgetGuid = component.getComponent('widgetGuid'),
			    name = component.getComponent('name'),
			    description = component.getComponent('description'),
                            description_dsp = component.getComponent('description_dsp'),
				version = component.getComponent('version'),
				universalName = component.getComponent('universalName'),
				guid = component.getComponent('guid'),
				url = component.getComponent('url'),
				headerIcon = component.getComponent('headerIcon'),
				image = component.getComponent('image'),
				width = component.getComponent('width'),
				height = component.getComponent('height'),
				tags = component.getComponent('_tags'),
				singleton = component.getComponent('singleton'),
				visible = component.getComponent('visible'),
				background = component.getComponent('background'),
				widgetType = component.getComponent('_types'),
				intents = component.getComponent('intents');

            for (var i = 0; data && data.defaultTags && i < data.defaultTags.length; i++) {
                strTags += data.defaultTags[i];
                if (i < data.defaultTags.length - 1) {
                    strTags += ", ";
                }
            }
            strTags = Ext.util.Format.htmlDecode(strTags);

            // Only change guid and universalId if this is a new record
            if (!this.ownerCt.recordId) {
                widgetGuid.setValue(Ext.String.trim(newGuid));
                guid.setValue(Ext.String.trim(newGuid));
            }
            
            // Set the description values
            name.setValue(Ext.String.trim(data.displayName));
            description.setValue(Ext.String.trim(data.description || ""));
            description_dsp.setValue(Ext.String.trim(data.description || ""));
            version.setValue(Ext.String.trim(data.widgetVersion || ""));
            universalName.setValue(Ext.htmlEncode(data.universalName) || "");
            url.setValue(Ext.String.trim(data.widgetUrl));
            headerIcon.setValue(Ext.String.trim(data.imageUrlSmall));
            image.setValue(Ext.String.trim(data.imageUrlLarge));
            width.setValue(data.width);
            height.setValue(data.height);
            tags.setValue(Ext.String.trim(strTags));
            singleton.setValue(data.singleton);
            visible.setValue(data.visible);
            background.setValue(data.background);
            intents.setValue(Ext.JSON.encode(data.intents || ""));
            
            this.record.intents = data.intents || {};
            
            // Set widget type
            var typeId = data.widgetTypes[0];
            if(!Ext.isNumeric(typeId))
            {
                widgetType.setRawValue(widgetType.store.findRecord('name','standard').get('name'));
            	typeId = this.widgetTypeStore.getAt(this.widgetTypeStore.find('name',typeId)).get('id');
            }
            this.getComponent('_types').setValue(typeId);
            
            // Disable properties fields
            this.disablePropertiesFields();
            
            description.hide();
            
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

    showProperties: function(show) {
		var descriptorUrlToolbar = this.getComponent('descriptorUrlToolbar');
		var manualEntryLinkBtn = descriptorUrlToolbar.getComponent('manualEntryLinkBtn');
		manualEntryLinkBtn.hide();
		
        var component = this;
		component.getComponent('descriptorUrlErrorMsg').hide();
		var horizontalRule = component.getComponent('horizontalRule'),
			manualEntryTitle = component.getComponent('manualEntryTitle'),
			name = component.getComponent('name'),
			description = component.getComponent('description'),
                        description_dsp = component.getComponent('description_dsp'),
			version = component.getComponent('version'),
			universalName = component.getComponent('universalName'),
			guid = component.getComponent('guid'),
			url = component.getComponent('url'),
			headerIcon = component.getComponent('headerIcon'),
			image = component.getComponent('image'),
			width = component.getComponent('width'),
			height = component.getComponent('height'),
			tags = component.getComponent('_tags'),
			singleton = component.getComponent('singleton'),
			visible = component.getComponent('visible'),
			background = component.getComponent('background'),
			widgetType = component.getComponent('_types');
		
        if (show) {
        	horizontalRule.show();
        	manualEntryTitle.show();
            name.show();
            description.show();
            description_dsp.show();
            version.show();
            universalName.show();
            guid.show();
            url.show();
            headerIcon.show();
            image.show();
            width.show();
            height.show();
            tags.show();
            singleton.show();
            visible.show();
            background.show();
            widgetType.show();
        } else {
        	horizontalRule.hide();
        	manualEntryTitle.hide();
            name.hide();
            description.hide();
            description_dsp.hide();
            version.hide();
            universalName.hide();
            guid.hide();
            url.hide();
            headerIcon.hide();
            image.hide();
            width.hide();
            height.hide();
            tags.hide();
            singleton.hide();
            visible.hide();
            background.hide();
            widgetType.hide();
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
        // Disable the apply button until a valid descriptor file has been loaded
        // unless the user returns the value to its original state.
        var toolbars = this.getDockedItems('toolbar[dock="bottom"]');
        var applyBtn = toolbars[0].getComponent('apply');
        if ((typeof (me.record) === 'undefined') ||
                (me.record !== null && me.record.descriptorUrl !== null && field.getValue() !== me.record.descriptorUrl) ||
                (me.record !== null && me.record.descriptorUrl === null && field.getValue() !== "")) {
            applyBtn.disable();
        }
    },
    onApply: function() {        
    	// Enable the apply button.
    	var toolbars = this.getDockedItems('toolbar[dock="bottom"]');
    	var applyBtn = toolbars[0].getComponent('apply');
    	applyBtn.disable();
        
      var panel = this;
      var widget = panel.ownerCt;
      var record = null;

      // Collect form values. Can't use this.getValues() because if descriptorUrl is used
      // fields may be disabled.
  	  var formFields = ['widgetGuid', 'name', 'description', 'version', 'universalName', 
	                  'guid', 'url', 'headerIcon', 'image', 'width',
	                  'height', '_tags', 'singleton', 'visible', 
	                  'background', '_types', 'descriptorUrl', 'intents'];
      
  	  var formValues = {};
      for (var i = 0; i < formFields.length; i++) {
    	  var field = formFields[i];
    	  var cmp = this.getComponent(field);
    	  var value = cmp.getValue();
    	  if (Ext.isEmpty(value) || (cmp.inputEl && cmp.inputEl.hasCls(cmp.emptyCls))) {
    		  if (field in ['singleton', 'visible', 'background']) {
    			  formValues[field] = false;
    		  } else {
    			  formValues[field] = "";
    		  }
    	  } else if (field == 'intents' && value){
        	  formValues[field] = Ozone.util.parseJson(value);
    	  } else {
    		  formValues[field] = value;
    	  }
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

      //the _tags text field it needs to be turned into json
        var tags = [];
        var tagString = formValues['_tags'];
        if (tagString && tagString.length > 0 && tagString != '') {
            var splits = tagString.split(',');
            for (var j = 0 ; j < splits.length ; j++) {
                var name = Ext.String.trim(splits[j]);
                if (name != '') {
                    tags.push({
                        name: name,
                        visible: true,

                        //todo use position to order groups for now just set to -1
                        position: -1,
                        editable: true
                    });
                }
            }
        }
        var types = [];
        var typeId = formValues['_types'];
        if(!Ext.isNumeric(typeId))
        {
          typeId = this.widgetTypeStore.getAt(this.widgetTypeStore.find('name',typeId)).get('id');
        }
        types.push({
          id:typeId,
          name: this.widgetTypeStore.getById(typeId).get('name')
        });
       record.beginEdit();
       // Set title because incoming json won't have this value
       record.set('title', formValues['name']);
       
       //set the tags record with the json
       record.set('tags', tags);
       record.set('widgetTypes',types);
       record.endEdit();

       widget.record = record;
       widget.store.on({
         write: {
           fn: function() {
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
    },
    setWidgetType: function() {
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
    disablePropertiesFields: function() {
    	var formFields = ['widgetGuid', 'name', 'description', 'description_dsp', 'version', 'universalName', 
    	                  'guid', 'url', 'headerIcon', 'image', 'width',
    	                  'height', '_tags', 'singleton', 'visible', 
    	                  'background', '_types'];
		var manualEntryTitle = this.getComponent('manualEntryTitle');
		manualEntryTitle.update('Widget Description');
		
		for (var i = 0; i < formFields.length; i++) {
			var fieldname = formFields[i];
			var field = this.getComponent(fieldname);
	        field.changed = true;
	        field.doComponentLayout();
	        field.setReadOnly(true);
	        field.addCls('x-item-readOnly');
	        if (Ext.isEmpty(field.getValue())) {
	        	field.addCls('x-item-hidden-field');
	        } else {
	        	field.removeCls('x-item-hidden-field');
	        }
		}
    },
    generateNewGuid: function() {
    	return guid.util.guid();
    }
});
