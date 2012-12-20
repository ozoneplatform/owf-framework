/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.chrome = Ozone.chrome ? Ozone.chrome : {};

Ozone.chrome.WidgetChromeContainer = function(config) {

  var scope = this;
  this.channelName = "Ozone._WidgetChromeChannel";
  this.dashboard = null;
  scope.registerChromeMenuHandlers = function(menuConfig, sender) {
	  if (menuConfig.menu) {
	    // set css class on menu
	    menuConfig.menu.componentCls = "widgetmenubar";
	    menuConfig.menu.tabIndex = 0;
	    
	    // register handlers
	    for (var j = 0 ; j < menuConfig.menu.items.length ; j++) {
	  	  var menuItem = menuConfig.menu.items[j];
	  	  if (!menuItem.menu) {
	  		  // Regular menu item
	      	  menuItem.handler = function() {
	      		  //call click handler
	      		  var jsonString = gadgets.json.stringify({itemId:this.itemId});
	      		  gadgets.rpc.call(sender, scope.channelName, null,'..', jsonString);
	          };
	  	  } else {
	  		  // Sub-menu 
	  		  scope.registerChromeMenuHandlers(menuItem, sender);
	  	  }
	    }
	  } else {
  		  // Regular menu item
      	  menuConfig.handler = function() {
      		  //call click handler
      		  var jsonString = gadgets.json.stringify({itemId:this.itemId});
      		  gadgets.rpc.call(sender, scope.channelName, null,'..', jsonString);
          };
	  }
  };

  //private

    /**
     * Returns an object containing only the properties listed in propList.
     * Also htmlEncode all properties on the returned object
     */
    var secureProperties = function (obj, propList) {
        var retval = {};
        
        if (obj === undefined) return;

        for (var i = 0; i < propList.length; i++) {
            if (obj[propList[i]])
                retval[propList[i]] = Ext.htmlEncode(obj[propList[i]]);
        }

        return retval;
    },
    secureButton = function(btnConfig) {
        //only support these properties.  This minimizes the risk of security problems
        var item = secureProperties(btnConfig, ['itemId', 'xtype', 'type', 'icon', 'text', 'disabled']);
        item.tooltip = secureProperties(btnConfig.tooltip, ['title', 'text']);

        return item;
    },
    secureMenu = function(menuConfig) {
        //secure this item
        var retval = secureProperties(menuConfig, ['itemId', 'parentId', 'icon', 'text', 'disabled']);

        //secure sub-menu
        if (menuConfig.menu) {
          retval.menu = {};
          retval.menu.items = Ext.Array.map(menuConfig.menu.items, secureMenu);
        }

        return retval;
    };

  var handleAdd = function(sender,data) {
    var returnValue = {success:false},
        item;

    //parse out widgetid from sender
    var widgetCfg = Ozone.util.parseJson(sender);
    if (widgetCfg != null ) {
      var cmp = Ext.getCmp(widgetCfg.id);
      if (cmp != null) {
    	  if (data.items != null) {
    		  var items = data.items
	      	  if (!Ext.isArray(data.items)) {
	      		  items = [data.items];
		      }
              for (var i = 0 ; i < items.length ; i++) {
                  if (data.type === 'button') {

                      item = secureButton(items[i]);
	                  item.handler = function() {
	                    //call click handler
	                    var jsonString = gadgets.json.stringify({itemId:this.itemId});
	                    gadgets.rpc.call(sender, scope.channelName, null,'..', jsonString);
	                  };
	
	                  //buttons need a tabindex so that they are keyboard-navigable.
	                  //widgettools are automatically keyboard navigable
	                  if (item.xtype === 'button') item.tabIndex = 0;
	
	                  cmp.addTool(item);
	                  cmp.headerModified = true;
                  } else if (data.type === 'menu') {
                      item = secureMenu(items[i]);
                      

              		  scope.registerChromeMenuHandlers(item, sender);
                      addMenuCloseHandler(item);
                      var menuBar = cmp.getDockedComponent("menuBar");
                      if (!menuBar) {
                    	  menuBar = Ext.create('Ext.toolbar.Toolbar', {
                    		  itemId: "menuBar",
                    		  cls: "widgetmenubar",
                    		  enableOverflow: true,
                    		  style: {
                    			  overflow: "hidden" // had to add this because stylesheets were overriding it
                    		  },
                    		  layout: {
                    			  overflowHandler: {
                    				  type: "StyleableMenu"
                    			  }
                    		  },
                    		  items: []
                    	  });
                    	  cmp.addDocked(menuBar);
                      } 
                      
                      if (item.parentId) {
                          // Find parent menu
                    	  var ownerCt = menuBar.down("#" + item.parentId);
	                      if (ownerCt) {
	                    	  ownerCt.menu.add(item);
	                          cmp.headerModified = true;
	                      }
                      } else {
                          menuBar.add(item);
                    	  var isFirstItem = menuBar.items.length == 1 ? true : false;
                          if (isFirstItem) cmp.forceComponentLayout();
    	                  cmp.headerModified = true;
                      }
                  }
              }  
        }

        returnValue.success = true;
      }
    }

    return gadgets.json.stringify(returnValue);
  };
  var handleInsert = function(sender, data) {
    var returnValue = {success:false},
        item;

    //parse out widgetid from sender
    var widgetCfg = Ozone.util.parseJson(sender);
    if (widgetCfg != null) {
      var cmp = Ext.getCmp(widgetCfg.id);
      if (cmp != null) {
	        //add button here
	        if (data.items != null) {
	          data.pos = data.pos ? data.pos : 0;
	          var items = data.items;
	          if (!Ext.isArray(data.items)) {
	            items = [data.items];
	          }
	          for (var i = 0; i < items.length; i++) {
	              if (data.type === 'button') {

                      item = secureButton(items[i]);
	            	  item.handler = function() {
		                //call click handler
		                var jsonString = gadgets.json.stringify({itemId:this.itemId});
		                gadgets.rpc.call(sender, scope.channelName, null, '..', jsonString);
		              };
		
		              cmp.insertTool(item, data.pos + i);
		              cmp.headerModified = true;
	              } else if (data.type === 'menu') {
                      item = secureMenu(items[0]);

              		  scope.registerChromeMenuHandlers(item, sender);
                      addMenuCloseHandler(item);
                      var menuBar = cmp.getDockedComponent("menuBar");
                      if (!menuBar) {
                    	  menuBar = Ext.create('Ext.toolbar.Toolbar', {
                    		  itemId: "menuBar",
                    		  cls: "widgetmenubar",
                    		  enableOverflow: true,
                    		  style: {
                    			  overflow: "hidden" // had to add this because stylesheets were overriding it
                    		  },
                    		  layout: {
                    			  overflowHandler: {
                    				  type: "StyleableMenu"
                    			  }
                    		  },
                    		  items: []
                    	  });
                    	  cmp.addDocked(menuBar);
                      } 
                      
                      if (item.parentId) {
                          // Find parent menu
                    	  var ownerCt = menuBar.down("#" + item.parentId);
	                      if (ownerCt) {
	                    	  ownerCt.menu.insert(data.pos + i, item);
	                          cmp.headerModified = true;
	                      }
                      } else {
                          menuBar.insert(data.pos + i, item);
                    	  var isFirstItem = menuBar.items.length == 1 ? true : false;
                          if (isFirstItem) cmp.forceComponentLayout();
    	                  cmp.headerModified = true;
                      }
	              }
	          }
	          returnValue.success = true;
	    }
      }
    }

    return gadgets.json.stringify(returnValue);
  };

  var handleUpdate = function(sender,data) {
    var returnValue = {success:false},
        item;

    var widgetCfg = Ozone.util.parseJson(sender);
    if (widgetCfg != null ) {
      var cmp = Ext.getCmp(widgetCfg.id);
      if (cmp != null) {
        returnValue.success = true;
        var items = data.items;
        if (!Ext.isArray(data.items)) {
          items = [data.items];
        }
        for (var i = 0; i < items.length; i++) {
            if (data.type === 'button') {

              item = secureButton(items[0]);
          	  item.handler = function() {
	              //call click handler
	              var jsonString = gadgets.json.stringify({itemId:this.itemId});
	              gadgets.rpc.call(sender, scope.channelName, null, '..', jsonString);
	            };
	
	            cmp.updateTool(item);
	            cmp.headerModified = true;
            } else if (data.type === 'menu') {
                item = secureMenu(items[0]);

        		scope.registerChromeMenuHandlers(item, sender);
                addMenuCloseHandler(item);
                var menuBar = cmp.getDockedComponent("menuBar");
                if (menuBar) {
                	var menuBarItem = menuBar.down("#" + item.itemId);
                	// Do it this way because menuBarItem may be a sub-menu
                	var ownerCt = menuBarItem.ownerCt;
                	var pos = ownerCt.items.indexOfKey(item.itemId);
                	if (pos > -1) {
                		// Replace entire object (so that menus will render properly)
                		ownerCt.remove(item.itemId, true);
                		ownerCt.insert(pos, item);
                        cmp.headerModified = true;
                	} else {
                		alert("Error updating menu. Invalid itemId");
                	}
                }
            }
        }
      }
    }

    return gadgets.json.stringify(returnValue);
  };

  var handleRemove = function(sender,data) {
    var returnValue = {success:false};

    var widgetCfg = Ozone.util.parseJson(sender);
    if (widgetCfg != null ) {
      var cmp = Ext.getCmp(widgetCfg.id);
      if (cmp != null) {
        returnValue.success = true;
        var items = data.items;
        if (!Ext.isArray(data.items)) {
          items = [data.items];
        }
        for (var i = 0; i < items.length; i++) {
            var item = Ext.apply({},items[i]);
            if (data.type === 'button') {
            	cmp.removeTool(item.itemId);
            } else if (data.type === 'menu') {
                var menuBar = cmp.getDockedComponent("menuBar");
                if (menuBar) {
                	var menuBarItem = menuBar.down("#" + item.itemId);
                	if (menuBarItem) {
                    	// Do it this way because menuBarItem may be a sub-menu
	                	var ownerCt = menuBarItem.ownerCt;
	            		ownerCt.remove(item.itemId, true);
	                    if (menuBar.items.items.length == 0) {
	                    	cmp.removeDocked(menuBar);
	                    }
                	}
                }
            }
        }
      }
    }

    return gadgets.json.stringify(returnValue);
  };
  var handleList = function(sender,data) {
    var returnValue = {success:false};

    //parse out widgetid from sender
    var widgetCfg = Ozone.util.parseJson(sender);
    if (widgetCfg != null ) {
      var cmp = Ext.getCmp(widgetCfg.id);
      if (cmp != null) {
        returnValue.success = true;
        returnValue.items = [];
        if (data.type == 'button' && cmp.tools != null) {
          for (var i in cmp.tools) {
            returnValue.items.push(cmp.tools[i].id);
          }
        } else if (data.type == 'menu') {
        	function buildList(cfg) {
        		var list = [];
        		if (cfg.itemId) {
        			list.push(cfg.itemId);
        		}
        		
        		if (cfg.menu) {
	                for (var i = 0; i < cfg.menu.items.items.length; i++) {
	                	list = list.concat(buildList(cfg.menu.items.items[i]));
	                }   
        		}
                
                return list;
        	}
        	
            var menuBar = cmp.getDockedComponent("menuBar");
            if (menuBar) {
                for (var i = 0; i < menuBar.items.length; i++) {
                	var menus = buildList(menuBar.items.items[i]);
                	returnValue.items = returnValue.items.concat(menus);
                }
            }
        }
      }
    }
    return gadgets.json.stringify(returnValue);
  };

  var isModified = function(sender,data) {
    var returnValue = {success:false};
    //parse out widgetid from sender
    var widgetCfg = Ozone.util.parseJson(sender);
    if (widgetCfg != null ) {
      var cmp = Ext.getCmp(widgetCfg.id);
      if (cmp != null) {
        returnValue.success = true;
        returnValue.modified = (cmp.headerModified == true);
      }
    }
    return gadgets.json.stringify(returnValue);
  };

  var addMenuCloseHandler = function(item) {
	  if (item.menu) {
	    item.menu.listeners = {
	        hide: function(cmp) {
	        	var constrainTo = Ext.getCmp(cmp.constrainTo.id);
	        	if (constrainTo) {
	        		constrainTo.getFocusEl().focus();
	        	}
	        }
	    };
	  }
  };

  var getTitle = function(sender) {
      var returnValue = {success:false};
      //parse out widgetid from sender
      var widgetCfg = Ozone.util.parseJson(sender);
      if (widgetCfg != null ) {
        var cmp = Ext.getCmp(widgetCfg.id);
        if (cmp != null) {
          returnValue.success = true;
          returnValue.title = cmp.title;
        }
      }
      return gadgets.json.stringify(returnValue);
  };

  var setTitle = function(sender,data) {
      var returnValue = {success:false};
      //parse out widgetid from sender
      var widgetCfg = Ozone.util.parseJson(sender);
      if (widgetCfg != null ) {
        var cmp = Ext.getCmp(widgetCfg.id);
        if (cmp != null && cmp.setTitle != null) {
          returnValue.success = true;
          cmp.setTitle(data.title);
          returnValue.title = cmp.title;
        }
      }
      return gadgets.json.stringify(returnValue);
  };

  if (config != null && config.eventingContainer != null) {
    this.eventingContainer = config.eventingContainer;
    this.eventingContainer.registerHandler(this.channelName, function(sender, msg) {
      var returnValue = true;

      //msg will always be a json string
      var data = Ozone.util.parseJson(msg);

      switch (data.action) {
        case 'isModified' :
          returnValue = isModified(sender,data);
          break;
        case 'addHeaderButtons' :
          returnValue = handleAdd(sender,data);
          break;
        case 'updateHeaderButtons' :
          returnValue = handleUpdate(sender,data);
          break;
        case 'insertHeaderButtons' :
          returnValue = handleInsert(sender,data);
          break;
        case 'removeHeaderButtons' :
          returnValue = handleRemove(sender,data);
          break;
        case 'listHeaderButtons' :
          returnValue = handleList(sender,data);
          break;
        case 'addHeaderMenus' :
            returnValue = handleAdd(sender,data);
            break;
        case 'updateHeaderMenus' :
            returnValue = handleUpdate(sender,data);
            break;
        case 'insertHeaderMenus' :
            returnValue = handleInsert(sender,data);
            break;
        case 'removeHeaderMenus' :
            returnValue = handleRemove(sender,data);
            break;
        case 'listHeaderMenus' :
            returnValue = handleList(sender,data);
            break;
        case 'getTitle' :
            returnValue = getTitle(sender,data);
            break;
        case 'setTitle' :
            returnValue = setTitle(sender,data);
            break;
        default:
      }

      return returnValue;
    });
  }
  else {
    throw {
      name :'WidgetChromeContainerException',
      message :'eventingContainer is null'
    }
  }
};

