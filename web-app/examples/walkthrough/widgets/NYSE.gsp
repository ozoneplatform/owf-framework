<!DOCTYPE html>
<html>
<head>
	<head>
	<title>HTML Viewer</title>

	<g:if test="${params.themeName != null && params.themeName != ''}">
		<link rel='stylesheet' type='text/css' href='../../../themes/${params.themeName.encodeAsHTML()}.theme/css/${params.themeName.encodeAsHTML()}.css' />
	</g:if>
	<g:else>
		<link href="../../../js-lib/ext-4.0.7/resources/css/ext-all.css" rel="stylesheet" type="text/css">
		<link href="../../../css/dragAndDrop.css" rel="stylesheet" type="text/css">
	</g:else>

	<style type="text/css">
		.clickable {
			color: black;
		}
		
		.x-scroller-vertical {
			border: 1px solid #BABFC3;
		}	
		
		.gain {
			color: green;
		}	
		
		.loss {
			color: red;
		}	
	</style>
	<g:if test="${params.themeName == 'accessibility-wob'}">
	<style type="text/css">		
		.clickable {
			color: white;
		}
                
                .x-grid-view-focus .x-grid-table .x-grid-row-selected.x-grid-row-selected .x-grid-cell .clickable {
                        color: black;
                }
		
		.gain {
			color: #8AE235;
		}	
		
		.loss {
			color: #FDD017;
		}	
	</style>
	</g:if>
	<g:if test="${params.themeName == 'large-text'}">
	<style type="text/css">
	</style>
	</g:if>
	
	
	<script type="text/javascript" src="../../../js-lib/ext-4.0.7/ext-all-debug.js"></script>
    <p:javascript src="owf-widget" pathToRoot="../../../" />
    <script type="text/javascript" src="../../../js/components/focusable/Focusable.js"></script>
    <script type="text/javascript" src="../../../js/components/focusable/FocusableGridPanel.js"></script>
    <script type="text/javascript" src="../../../js/components/layout/SearchBoxLayout.js"></script>
    <script type="text/javascript" src="../../../js/components/form/field/SearchBox.js"></script>
    <script type="text/javascript" src="StockTimer.js"></script>
    <script type="text/javascript">
      //The location is assumed to be at /<context>/js/eventing/rpc_relay.uncompressed.html if it is not set
      //OWF.relayFile = Ozone.util.contextPath() + '/js/eventing/rpc_relay.uncompressed.html';
      owfdojo.config.dojoBlankHtmlUrl = '../../../js-lib/dojo-1.5.0-windowname-only/dojo/resources/blank.html';

      if (Ext.isIE) {
          Ext.BLANK_IMAGE_URL = '../../../themes/common/images/s.gif';
      }

      var _tm;

      function init() {
          _tm = new Ozone.components.StockTimer(
              function(widgetId, proxy, data) {
                  
                OWF.getOpenedWidgets(function(widgetList) {
                    if (widgetList != null) {
                        var found = false;
                        for (var i = 0; i < widgetList.length; i++) {
                            if (widgetList[i].id == widgetId) {
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            OWF.RPC.getWidgetProxy(widgetId, function(widget) {
                                if (Ext.isFunction(widget.doPlot)) { widget.doPlot(data); }
                            });
                        } else {
                            if (_tm) { _tm.remove(widgetId); }
                        }
                    }
                });
            },
            5000
        );
        _tm.start();
          
	    Ext.QuickTips.init();
	    
	    Ext.define('Stock', {
	        extend: 'Ext.data.Model',
	        fields: [
	            {name: 'symbol'},
	            {name: 'company'},
	            {name: 'address'},
	            {name: 'city'},
	            {name: 'state'},
	            {name: 'zip'},
	            {name: 'phone'},
	            {name: 'profile'},
	            {name: 'date', type: 'date', dateFormat: 'n/j h:ia'},
	            {name: 'open', type: 'float'},
	            {name: 'high', type: 'float'},
	            {name: 'low', type: 'float'},
	            {name: 'close', type: 'float'},
	            {name: 'volume', type: 'float'}
	         ]
	    });
	    
	    // create the data stores
	    var NYSEStore = Ext.create('Ext.data.Store', {
	        model: 'Stock',
	        autoLoad: true,
		    proxy: {
		        type: 'ajax',
		        url : '../data/NYSE.xml',
		        reader: {
		            type: 'xml',
		            record: 'Row'
		        }
		    }
	    });
	
	    /**
	     * Custom function used for column renderer
	     * @param {Object} val
	     */
	    function change(value, metaData, record, rowIndex, colIndex, store, view) {
	        if (value > record.data.open) {
	            return '<span class="gain">' + value + '</span>';
	        } else if (value < record.data.open) {
	            return '<span class="loss">' + value + '</span>';
	        }
	        return value;
	    }

	    /**
	     * Custom function used for column renderer
	     * @param {Object} val
	     */
	    function profile(value, metaData, record, rowIndex, colIndex, store, view) {
	        return '<span class="company-profile">' + value + '</span>';
	    }

        // create the Grid
        var sm = new Ext.selection.CheckboxModel({
            checkOnly: true
        });	 
		   
        new Ext.Viewport({
            layout: 'fit',
            items: [{
            	xtype: 'grid',
				plugins: new Ozone.components.focusable.FocusableGridPanel(),
            	itemId: 'NYSEGrid',
            	preventHeader: true,
		        store: NYSEStore,
		        selModel: sm,
		        enableColumnHide: false,
		        sortableColumns: true,
		        columns: [
		            {text: 'Symbol', dataIndex: 'symbol'},
		            {
		            	text: 'Company', 
		            	flex: 1, 
		            	dataIndex: 'company',
		            	renderer: function (value) {
						    return '<a href="#" class="clickable">'+value+'</a>';
						}
		            },
            		{text: 'Open', dataIndex: 'open'},
		            {text: 'High', dataIndex: 'high'},
		            {text: 'Low', dataIndex: 'low'},
		            {text: 'Close', renderer: change, dataIndex: 'close'},
		            {text: 'Volume', dataIndex: 'volume'}
		        ],
		        viewConfig: {
		        	forceFit: true,
		            stripeRows: true,
				    listeners: {
				        cellclick: function (view, cell, cellIndex, record, row, rowIndex, e) {
				
				            var linkClicked = (e.target.tagName == 'A'),
                                clickedDataIndex = view.panel.headerCt.getHeaderAtIndex(cellIndex).dataIndex;
				
				            if (linkClicked && clickedDataIndex == 'company') {
                                // Flag so the view doesn't auto-select the first row on focus
                                view.disableFocusSelect = true;

                        		// Build HTML
                        		var companyTitle = record.data.symbol ? (record.data.company + "(" + record.data.symbol + ")") : record.data.company;
                        		var html = "<div class='company-profile'><div class='company'><h1>" + companyTitle + "</h1></div>" +
                        			"<div class='address1'>" + record.data.address + "</div>" +
                        			"<div class='address2'>" + record.data.city + ", " + record.data.state + "&nbsp;" + record.data.zip + "</div>" +
                        			"<div class='phone'>" + record.data.phone + "<br /><hr /></div>" +
                        			"<div class='profile'>" + record.data.profile + "</div>" +
                        			"</div>";
                        		
                                var data = [];
                        		data.push({
			                    	id: record.data.symbol ? record.data.symbol : record.data.company,
			                    	html: html
                        		});
	                        	
					            OWF.Intents.startActivity(
					                {
					                    action:'View',
					                    dataType: 'text/html'
					                },
					                {
					                    data: data
					                },
				                    function (dest) {
				                        //dest is an array of destination widget proxies
				                        if (dest.length <= 0) {
				                            // alert('Intent was canceled');
				                        }
				                    }					                
					            );
				            }
				        }
				    }		            
		        },
	            dockedItems: [{
	                xtype: 'toolbar',
	                itemId: 'tbNYSEGridHdr',
	                cls: 'tbIntentsGridHdr',
	                dock: 'top',
	                items: [{
	                    xtype: 'tbtext',
	                    itemId: 'lblNYSEGrid',
	                    cls: 'lblIntentsGrid',
	                    text: '<span class="heading-bold">NYSE End of Day Summary</span>'
	                },
	                '->',
	                {
	                    xtype: 'searchbox',
	                    listeners: {
	                        searchChanged: {
	                            fn: function(cmp, value) {
	                                var grid = cmp.ownerCt.ownerCt;
	                                if (grid != null) {
	                                    grid.getView().setLoading(true);
	                                    if (!value)
	                                        grid.getStore().clearFilter();
	                                    else 
	                                        grid.getStore().filterBy(function(record, id) {
	                                        	var val = value.toLowerCase();
	                                        	return ((record.data.symbol.toLowerCase().indexOf(val) > -1) || (record.data.company.toLowerCase().indexOf(val) > -1))
	                                        });
	                                    grid.getView().setLoading(false);
	                                }
	                            },
	                            scope: this
	                        }
	                    }
	                }]
	            }],
                bbar: [
                	'->',
                    {
                        text: 'View Current Prices',
                        handler: function(button) {
                        	// Get selected rows
                        	var gridPanel = button.findParentByType('grid');
                        	var selectedRows = gridPanel.getSelectionModel().getSelection();
                        	var data = [];
                            var symbols = [];
                            var dt = new Date();
                        	
                        	for (var i = 0; i < selectedRows.length; i++) {
                        		var row = selectedRows[i];
                        		data.push({
                                    date: dt,
                                    symbol: row.data.symbol,
                                    price: Math.floor((Math.random()*25)+1)
                        		});
                                symbols.push(row.data.symbol);
                        	}
                        	
				            OWF.Intents.startActivity(
				                {
				                    action:'Graph',
				                    dataType:'application/vnd.owf.sample.price'
				                },
				                {
				                    data: data
				                },
                                function (dest) {
                                  //dest is an array of destination widget proxies
                                  if (dest.length > 0) {
                                      Ext.Array.each(dest, function(datum, index, dataRef) {
                                          var json = Ext.JSON.decode(datum.id);
                                          var widgetId = json.id;
                                          var proxy = datum.id;
                                          if (_tm) { _tm.reset(widgetId, proxy, symbols) ;}
                                      });
                                  }
                                  else {
                                      // alert('Intent was canceled');
                                  }
                              	}					                
                          	);
                      	}
                  	}
              	]
          	}]
      	});
	}
	      	
    Ext.onReady(function() {
      	OWF.ready(init);
    });
  </script>
</head>
<body>
</body>
</html>