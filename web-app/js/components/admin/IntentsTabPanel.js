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
                                        grid.applyFilter(value, ['dataType']);
                                }
                            },
                            scope: this
                        }
                    }
                }]
            }]
        });
        
        this.callParent(arguments);
        
        this.on({
        	afterrender: {
        		fn: function(cmp) {
        	        this.ownerCt.on({
        	        	recordupdated: {
        	             fn: function(record) {
        	               var grid = this.getComponent('intentsGrid');
        	               var store = grid.getStore();
        	               var intents = record ? record.intents : null;
        	               
        	               var storeData = [];
        	            	 
        	               // Set the title
        	               if (record) {
        	            	   var titleText = record.title || 'Intents';
        	                   var title = this.getDockedItems('toolbar[dock="top"]')[0].getComponent('lblIntentsGrid');
        	                   title.setText(titleText);
        	               }
        	               
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
    }
    
});
