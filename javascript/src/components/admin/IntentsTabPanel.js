Ext.define('Ozone.components.admin.IntentsTabPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.intentstabpanel'],
    
    initComponent: function() {
        
        Ext.apply(this, {

            layout:'fit',
            itemId: 'intents-tab',
            cls: 'widgeteditintentstab',
            iconCls: 'intents-tab',
            title: 'Intents',
            editor: 'Widget',
            componentId: 'intent_id',
            preventHeader: true,
            border: true,
            padding: 5,
    
            items: [{
                xtype: 'intentsgrid',
                itemId: 'intentsGrid',
                preventHeader: true,
                border: false
            }],

            dockedItems: [{
                xtype: 'toolbar',
                itemId: 'tbIntentsGridHdr',
                cls: 'tbIntentsGridHdr',
                dock: 'top',
                items: [{
                    xtype: 'tbtext',
                    itemId: 'lblIntentsGrid',
                    cls: 'tbIntentsGridHdr',
                    text: 'Intents'
                },
                '->',
                {
                    xtype: 'searchbox',
                    listeners: {
                        searchChanged: {
                            fn: function(cmp, value) {
                                var grid = this.getComponent('intentsGrid');
                                if (grid != null) {
                                    if (!value)
                                        grid.clearFilters();
                                    else
                                        grid.applyFilter(value);
                                }
                            },
                            scope: this
                        }
                    }
                }]
            },
            {
                xtype: 'toolbar',
                itemId: 'tbDashboardsGridFtr',
                dock: 'bottom',
                ui: 'footer',
                defaults: {
                    minWidth: 80
                },
                items: [{
                    xtype: 'button',
                    text: 'Create',
                    itemId: 'btnCreate',
                    handler: this.onCreateOrEdit,
                    disabled: true,
                    scope: this
                },
                {
                    xtype: 'button',
                    text: 'Edit',
                    itemId: 'btnEdit',
                    handler: this.onCreateOrEdit,
                    disabled: true,
                    scope: this
                },
                {
                    xtype: 'button',
                    text: 'Delete',
                    itemId: 'btnDelete',
                    handler: this.onDelete,
                    disabled: true,
                    scope: this
                }]
            }]
        });
        
        this.callParent(arguments);
        
        this.on({
            activate: {
                scope: this,
                fn: function(cmp, opts) {
                    var comp = cmp.ownerCt;
                    
                    // Set the title
                    if (comp.record.data) {
                        var titleText = Ext.htmlEncode(Ext.util.Format.ellipsis(comp.record.get('title'), 25)) || 'Intents';
                        var title = cmp.getDockedItems('toolbar[dock="top"]')[0].getComponent('lblIntentsGrid');
                        title.setText(titleText);
                    }
                },
                single: true
            }
        });
        
        this.on({
            activate: {
                fn: function(cmp) {
                    var grid = cmp.getComponent('intentsGrid');
                    if (grid) {
                        grid.on({
                            itemdblclick: {
                                fn: function() {
                                    var editBtn = this.down('#btnEdit');
                                    if(!editBtn.isDisabled()) {
                                        var selectedIntent = this.getComponent('intentsGrid').getSelectionModel().getSelection()[0];
                                        this.onCreateOrEdit(editBtn);
                                    }
                                },
                                scope: this
                            }
                        });
                    }
                },
                single: true
            },
        	afterrender: {
        		fn: function(cmp) {
        	        this.ownerCt.on({
        	        	recordupdated: {
        	             fn: function(record) {
        	               var grid = this.getComponent('intentsGrid');
        	               var store = grid.getStore();
        	               var intents = record ? record.intents : null;
        	               
        	               var storeData = [];
        	            	 
        	               // Format intents for store
        	               if (intents) {
        	            	   // Add send intents
        	        		   for (var i = 0; intents.send && i < intents.send.length; i++) {
        	        			   var intent = intents.send[i];
        	        			   var action = intent.action;
        	        			   
        	        			   for (var j = 0; intent.dataTypes && j < intent.dataTypes.length; j++) {
        	        				   storeData.push({
        	        					   action: action,
        	        					   dataType: intent.dataTypes[j],
        	        					   send: true,
        	        					   receive: false	// default value; will be overridden if widget receives the same intent
        	        				   });
        	        			   }
        	        		   }
        	        		   
        	            	   // Add receive intents
        	        		   for (var i = 0; intents.receive && i < intents.receive.length; i++) {
        	        			   var intent = intents.receive[i];
        	        			   var action = intent.action;
        	        			   
        	        			   for (var j = 0; intent.dataTypes && j < intent.dataTypes.length; j++) {
        	        				   var intentFound = false;
        	        				   
        	        				   for (var k = 0; k < storeData.length; k++) {
        	        					   if (storeData[k].action == action && storeData[k].dataType == intent.dataTypes[j]) {
        	                				   storeData[k].receive = true;
        	                				   intentFound = true;
        	        					   }
        	        				   }
        	        				   
        	        				   if (!intentFound) {
        		        				   storeData.push({
        		        					   action: action,
        		        					   dataType: intent.dataTypes[j],
        		        					   send: false,
        		        					   receive: true
        		        				   });
        	        				   }
        	        			   }
        	        		   }
        	               }
        	               
        	               // Update grid data
        	               if (store) {
        	                   store.loadData(storeData);
        	                   
        	                   //allow headers to be focused
        	             	   var groupHeaders = grid.getEl().query('.x-grid-group-hd');
        	             	   if (groupHeaders) {
        	             		   for (var i = 0; i < groupHeaders.length; i++) {
        	                           var el = new Ext.Element(groupHeaders[i]);
        	                           var selectedEl = el.down('.x-grid-cell-inner');
        	                           if (selectedEl) {
        	                        	   Ozone.components.focusable.Focusable.setupFocus(selectedEl, this);

        	                        	   new Ext.util.KeyMap(selectedEl, {
        	                                   key: [Ext.EventObject.ENTER, Ext.EventObject.SPACE],
        	                                   fn: function (key, evt) {
        	                                       // required for IE, focus goes back to active widget for some reason
        	                                       evt.preventDefault();
        	                                       evt.stopPropagation();

        	                                       var group = grid.features[0];
        	                                       group.onGroupClick(grid.getView(), this);
        	                                   },
        	                                   scope: el.dom
        	                               });
        	                        	   
        	                               new Ext.util.KeyMap(selectedEl, {
        	                                   key: [Ext.EventObject.UP, Ext.EventObject.DOWN],
        	                                   fn: function (key, evt) {
        	                                       // required for IE, focus goes back to active widget for some reason
        	                                       evt.preventDefault();
        	                                       evt.stopPropagation();

        	                                       var node = (key == Ext.EventObject.UP) ? this.previousSibling : this.nextSibling;
        		                           	       if (node) {
        		                           	    	   // Select last row of previous section
        		                           	    	   var siblingEl = Ext.fly(node);
        		                           	    	   var rows = siblingEl.select('.x-grid-row');
        		                           	    	   if (rows) {
        		                           	    		   var view = grid.getView();
        		                           	    		   var record = view.getRecord(rows.elements[0]);
        		                           	    		   view.focus();
        		                           	    		   view.focusRow(record);
        		                           	    		   view.select(record.index);
        		                           	    		   view.addCls('x-grid-view-focus');
        		                           	    	   }
        		                           	       }
        	                                   },
        	                                   scope: el.dom
        	                               });
        	                           }
        	             		   }
        	             	  }
        	               }
        	             },
        	             scope: this
        	           }
        	        });
        		},
        		scope: this
        	}
        });
    },

    onCreateOrEdit: function(btn, evt) {
        var me = this;

        var isEdit = false,
            selectedIntent = null;

        if(btn == me.down('#btnEdit')) {
            isEdit = true;
            //Get the intent to edit
            selectedIntent = this.getComponent('intentsGrid').getSelectionModel().getSelection()[0];
        }

        if(!isEdit || (isEdit && selectedIntent)) {
            evt && evt.stopPropagation();
            Ext.create('Ozone.components.admin.EditIntentWindow', {
                title: 'Create Intent',
                action: isEdit ? selectedIntent.get('action') : null,
                dataType: isEdit ? selectedIntent.get('dataType') : null,
                send: isEdit ? selectedIntent.get('send') : null,
                receive: isEdit ? selectedIntent.get('receive') : null,
                width: Math.round(Ext.getBody().getViewSize().width * .9),
                height: 260,
                scope: this,
                callback: function(values) {
                    if (values != undefined) {
                        var intent = {action: values.action, dataTypes: [values.dataType]},
                            widget = me.ownerCt,
                            record = widget.store.getById(widget.recordId),
                            intents = record.get('intents');

                        //If edit, remove the old intent first
                        if(isEdit) {
                            var oldIntent = {action: selectedIntent.get('action'), dataTypes: [selectedIntent.get('dataType')]};
                            me.removeIntentFromArray(oldIntent, intents.send);
                            me.removeIntentFromArray(oldIntent, intents.receive);
                        }

                        //If the new intent already exists remove it
                        me.removeIntentFromArray(intent, intents.send);
                        me.removeIntentFromArray(intent, intents.receive);

                        //If action exists still, use the same case as it
                        var getExistingAction = function(action, intentArray) {
                            if(intentArray) {
                                for(var i = 0; i < intentArray.length; i++) {
                                    if(intentArray[i].action.toLowerCase() === intent.action.toLowerCase()) {
                                        return intentArray[i].action;
                                    }
                                }
                            }
                            return action;
                        }
                        intent.action = getExistingAction(getExistingAction(intent.action, intents.send), intents.receive);

                        //Add the new intent
                        if(values.send) {
                            !intents.send && (intents.send = [])
                            intents.send.push(intent);
                        }
                        if(values.receive) {
                            !intents.receive && (intents.receive = [])
                            intents.receive.push(intent);
                        }

                        //Edit and save the widget definition record with the new intent
                        record.beginEdit();
                        record.set('intents', intents);
                        record.setDirty();
                        record.endEdit();

                        widget.store.save();

                        //Refresh the intents grid
                        widget.fireEvent('recordupdated', {intents: intents});
                        
                        //Update the intents field of the properties tab
                        widget.down('#widgeteditproperties').getComponent('intents').setValue(Ext.JSON.encode(intents));
                    }
                }
            }).show();
        }
        else {
            me.editPanel.showAlert("Error", "You must select an intent to edit.");
        }
    },

    onDelete: function(btn, evt) {
        var me = this,
            selectedIntent = this.getComponent('intentsGrid').getSelectionModel().getSelection()[0];

        if(selectedIntent) {
            me.editPanel.showConfirmation('Delete Intent', 
                'This action will permanently delete intent <b>' + Ext.htmlEncode(selectedIntent.get('action')) 
                + '</b> with data type <b>' + Ext.htmlEncode(selectedIntent.get('dataType')) + '</b> from this widget.', 
                function(btn, text, opts) {
                    if (btn == 'ok') {
                        var intent = {action: selectedIntent.get('action'), dataTypes: [selectedIntent.get('dataType')]},
                            widget = me.ownerCt,
                            record = widget.store.getById(widget.recordId),
                            intents = record.get('intents');

                        me.removeIntentFromArray(intent, intents.send);
                        me.removeIntentFromArray(intent, intents.receive);

                        //Edit and save the widget definition record with the intent removed
                        record.beginEdit();
                        record.set('intents', intents);
                        record.setDirty();
                        record.endEdit();

                        widget.store.save();

                        //Refresh the intents grid
                        widget.fireEvent('recordupdated', {intents: intents});
                        
                        //Update the intents field of the properties tab
                        widget.down('#widgeteditproperties').getComponent('intents').setValue(Ext.JSON.encode(intents));
                    }
                });
        }
        else {
            me.editPanel.showAlert("Error", "You must select an intent to delete.");
        }
    },

    //Looks through an array of intents for the given intent and data type and removes it (case-insensitive)
    removeIntentFromArray: function(intent, intentArray) {
        if(intentArray) {
            for(var i = 0; i < intentArray.length; i++) {
                if(intentArray[i].action.toLowerCase() === intent.action.toLowerCase()) {
                    if(intentArray[i].dataTypes) {
                        for(var j = 0; j < intentArray[i].dataTypes.length; j++) {
                            //If dataType found, remove it from the list of dataTypes
                            if(intentArray[i].dataTypes[j].toLowerCase() == intent.dataTypes[0].toLowerCase()) {
                                Ext.Array.remove(intentArray[i].dataTypes, intentArray[i].dataTypes[j]);
                                //If dataType removed makes the dataTypes empty, remove the intent
                                if(intentArray[i].dataTypes.length == 0) {
                                    Ext.Array.remove(intentArray, intentArray[i]);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }
});
