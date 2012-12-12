/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.chrome = Ozone.chrome ? Ozone.chrome : {};

/**
 *  @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.chrome.WidgetChrome.getInstance</a>
 *  @constructor  widgetEventingController - Ozone.eventing.Widget object
 *  @param  {Object} config - config object with parameters
 *  @param  {Ozone.eventing.Widget} config.widgetEventingController - widget eventing object which handles eventing for the widget
 *  @description This object allows a widget to modify the button contained in the widget header (the chrome).  
 *  To do so it requires a widgetEventingController
 *  @example
 *    this.wc = new Ozone.chrome.WidgetChrome({
 *        widgetEventingController: this.widgetEventingController
 *    });
 *
 * @throws {Error} throws an error with a message if widget initialization fails
 */
Ozone.chrome.WidgetChrome = function(config) {
  if (Ozone.chrome.WidgetChrome.instance == null) {
    var scope = this;
    scope.channelName = "Ozone._WidgetChromeChannel";
    scope.version = Ozone.version.owfversion + Ozone.version.widgetChrome;
    scope.items = {};
    scope.registerChromeMenu = function(menuConfig) {
  		// Regular menu item
       	scope.items[menuConfig.itemId != null ? menuConfig.itemId : menuConfig.id] = menuConfig;
       	
  	  	if (menuConfig.menu) {
  	    	for (var j = 0 ; j < menuConfig.menu.items.length ; j++) {
  	    		var menuItem = menuConfig.menu.items[j];
    			// Sub-menu
    			scope.registerChromeMenu(menuItem);
  	    	}
	  	}
    };

    var pub = /** @lends Ozone.chrome.WidgetChrome.prototype */ {

      init : function(config) {

        config = config || {};

          scope.widgetEventingController = config.widgetEventingController || Ozone.eventing.Widget.instance;
          scope.widgetEventingController.registerHandler(scope.channelName, function(sender, msg) {
            var returnValue = true;

            //msg will always be a json string
            var data = Ozone.util.parseJson(msg);

            var id = data.itemId != null ? data.itemId : data.id;
            var handler = scope.items[id].handler;
            if (handler != null && owfdojo.isFunction(handler)) {
              returnValue = handler.apply(data.scope != null ? data.scope : window, data.args != null ? data.args : []);
            }

            return returnValue;
          });
      },

      /**
       * @description Checks to see if the Widget Chrome has already been modified.  This is useful if the widget iframe is reloaded
       * @param {Object} cfg config object see below for properties
       * @param {Function} cfg.callback The function which receives the results.
       * This method will be passed an object which has following properties. <br>
       * <br>
       *     {Boolean} success: true if the widget is currently opened on the dashboard, or else false. <br>
       *     {Boolean} modified: true if the widget chrome(header) is modified, or else false. <br>
       *
       * @example
       *    //this.wc is an already instantiated WidgetChrome obj
       *    this.wc.isModified({
       *     callback: function(msg) {
       *         //msg will always be a json string
       *         var res = Ozone.util.parseJson(msg);
       *         if (res.success) {
       *
       *             //if the chrome was never modified
       *             if (!res.modified) {
       *                //do something, perhaps add buttons
       *             }
       *             //if we already modified the chrome
       *             else {
       *               //do something or perhaps nothing if the buttons are already added
       *             }
       *         }
       *     }
       *   });
       */
      isModified: function(cfg) {
        var data = {
          action: 'isModified'
        };
        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },

      /**
       * @description Adds buttons to the Widget Chrome.  Buttons are added after existing buttons.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of buttons configurations to add to the chrome.  See example for button configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
       * @param {String} cfg.items[*].xtype xtype is ExtJS-like property used to determine the component to create.  Currently the Widget Chrome API only supports two xtype values: ‘button’ and ‘widgettool’.  xtype is an optional field, if it is omitted ‘widgettool’ is used.
       * @param {String} cfg.items[*].type Used only for ‘widgettool’ buttons.  It determines the standard icon to be used.  For a complete list of types please see the ExtJS 4.x API documentation, <a href='http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type'>http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type</a>
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the button.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the button.  This property is only used if the xtype is ‘button.’  ‘widgettool’ will not show text.
       * @param {Object} cfg.items[*].tooltip This property defines a tooltip.  It has two important sub properties, title and text.  tooltip is only used when the xtype is ‘button’
       * @param {Function} cfg.items[*].handler The handler attribute defines a function to be executed when the button is pressed. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function’s parameter list contains the standard parameters for an Eventing callback function.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.addHeaderButtons({
       *             items:
       *              [
       *               {
       *                 xtype: 'button',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/exclamation.png',
       *                 text: 'Alert',
       *                 itemId:'alert',
       *                 tooltip:  {
       *                   text: 'Alert!'
       *                 },
       *                 handler: function(sender, data) {
       *                   //widgetState is an already instantiated WidgetState Obj
       *                   if (widgetState) {
       *                     widgetState.getWidgetState({
       *                         callback: function(state) {
       *
       *                           //check if the widget is visible
       *                           if (!state.collapsed && !state.minimized && state.active) {
       *                             //only render visual content, perhaps popup a message box if the widget is visible
       *                             //otherwise it may not render correctly
       *                           }
       *                         }
       *                     });
       *                   }
       *                 }
       *               },
       *               {
       *                 xtype: 'widgettool',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/information.png',
       *                 itemId:'help',
       *                 handler: function(sender, data) {
       *                   alert('About Button Pressed');
       *                 }
       *               },
       *               {
       *                 //gear is a standard ext tool type
       *                 type: 'gear',
       *                 itemId:'gear',
       *                 handler: function(sender, data) {
       *                   alert('Utility Button Pressed');
       *                 }
       *               }
       *             ]
       *     });
       */
      addHeaderButtons : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'addHeaderButtons';
        data.type = 'button';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          scope.items[items[i].itemId != null ? items[i].itemId : items[i].id] = items[i];
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);

      },

      /**
       * @description Updates any existing buttons in the Widget Chrome based on the itemId.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of buttons configurations to add to the chrome.  See example below for button configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
       * @param {String} cfg.items[*].xtype xtype is ExtJS-like property used to determine the component to create.  Currently the Widget Chrome API only supports two xtype values: ‘button’ and ‘widgettool’.  xtype is an optional field, if it is omitted ‘widgettool’ is used.
       * @param {String} cfg.items[*].type Used only for ‘widgettool’ buttons.  It determines the standard icon to be used.  For a complete list of types please see the ExtJS 4.x API documentation, <a href='http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type'>http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type</a>
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the button.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the button.  This property is only used if the xtype is ‘button.’  ‘widgettool’ will not show text.
       * @param {Object} cfg.items[*].tooltip This property defines a tooltip.  It has two important sub properties, title and text.  tooltip is only used when the xtype is ‘button’
       * @param {Function} cfg.items[*].handler The handler attribute defines a function to be executed when the button is pressed. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function’s parameter list contains the standard parameters for an Eventing callback function.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.updateHeaderButtons({
       *             items:
       *              [
       *               {
       *                 xtype: 'button',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/exclamation.png',
       *                 text: 'Alert',
       *                 itemId:'alert',
       *                 tooltip:  {
       *                   text: 'Alert!'
       *                 },
       *                 handler: function(sender, data) {
       *                   //widgetState is an already instantiated WidgetState Obj
       *                   if (widgetState) {
       *                     widgetState.getWidgetState({
       *                         callback: function(state) {
       *
       *                           //check if the widget is visible
       *                           if (!state.collapsed && !state.minimized && state.active) {
       *                             //only render visual content, perhaps popup a message box if the widget is visible
       *                             //otherwise it may not render correctly
       *                           }
       *                         }
       *                     });
       *                   }
       *                 }
       *               },
       *               {
       *                 xtype: 'widgettool',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/information.png',
       *                 itemId:'help',
       *                 handler: function(sender, data) {
       *                   alert('About Button Pressed');
       *                 }
       *               },
       *               {
       *                 //gear is a standard ext tool type
       *                 type: 'gear',
       *                 itemId:'gear',
       *                 handler: function(sender, data) {
       *                   alert('Utility Button Pressed');
       *                 }
       *               }
       *             ]
       *     });
       */
      updateHeaderButtons : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'updateHeaderButtons';
        data.type = 'button';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          //save data
          var id = items[i].itemId != null ? items[i].itemId : items[i].id;
          if (scope.items[id] != null) {
            owfdojo.mixin(scope.items[id], items[i]);
          }
          else {
            scope.items[id] = items[i];
          }
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);

      },

      /**
       * @description Inserts new buttons to the Widget Chrome.  Buttons are added to the same area as existing buttons.
       * @param {Object} cfg config object see below for properties
       * @param {Number} [cfg.pos=0] 0-based index of where buttons will be added, among any pre-existing buttons.
       * @param {Object[]} cfg.items an array of buttons configurations to insert to the chrome.  See example below for button configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
       * @param {String} cfg.items[*].xtype xtype is ExtJS-like property used to determine the component to create.  Currently the Widget Chrome API only supports two xtype values: ‘button’ and ‘widgettool’.  xtype is an optional field, if it is omitted ‘widgettool’ is used.
       * @param {String} cfg.items[*].type Used only for ‘widgettool’ buttons.  It determines the standard icon to be used.  For a complete list of types please see the ExtJS 4.x API documentation, <a href='http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type'>http://docs.sencha.com/ext-js/4-0/#/api/Ext.panel.Tool-cfg-type</a>
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the button.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the button.  This property is only used if the xtype is ‘button.’  ‘widgettool’ will not show text.
       * @param {Object} cfg.items[*].tooltip This property defines a tooltip.  It has two important sub properties, title and text.  tooltip is only used when the xtype is ‘button’
       * @param {Function} cfg.items[*].handler The handler attribute defines a function to be executed when the button is pressed. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function’s parameter list contains the standard parameters for an Eventing callback function.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.insertHeaderButtons({
       *             pos: 0,
       *             items:
       *              [
       *               {
       *                 xtype: 'button',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/exclamation.png',
       *                 text: 'Alert',
       *                 itemId:'alert',
       *                 tooltip:  {
       *                   text: 'Alert!'
       *                 },
       *                 handler: function(sender, data) {
       *                   //widgetState is an already instantiated WidgetState Obj
       *                   if (widgetState) {
       *                     widgetState.getWidgetState({
       *                         callback: function(state) {
       *
       *                           //check if the widget is visible
       *                           if (!state.collapsed && !state.minimized && state.active) {
       *                             //only render visual content, perhaps popup a message box if the widget is visible
       *                             //otherwise it may not render correctly
       *                           }
       *                         }
       *                     });
       *                   }
       *                 }
       *               },
       *               {
       *                 xtype: 'widgettool',
       *                 //path to an image to use. this path should either be fully qualified or relative to the /owf context
       *                 icon: './themes/common/images/skin/information.png',
       *                 itemId:'help',
       *                 handler: function(sender, data) {
       *                   alert('About Button Pressed');
       *                 }
       *               },
       *               {
       *                 //gear is a standard ext tool type
       *                 type: 'gear',
       *                 itemId:'gear',
       *                 handler: function(sender, data) {
       *                   alert('Utility Button Pressed');
       *                 }
       *               }
       *             ]
       *     });
       */
      insertHeaderButtons : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'insertHeaderButtons';
        data.type = 'button';
        if (cfg.pos != null) {
          data.pos = cfg.pos;
        }
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          scope.items[items[i].itemId != null ? items[i].itemId : items[i].id] = items[i];
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },

      /**
       * @description Removes existing buttons on the Widget Chrome based on itemId.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of buttons configurations to remove to the chrome.  Only itemId is required.
       *   See example below for button configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all buttons that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate buttons which may not be able to be removed properly.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.removeHeaderButtons({
       *             items:
       *              [
       *               {
       *                 itemId:'alert'
       *               },
       *               {
       *                 itemId:'help'
       *               },
       *               {
       *                 itemId:'gear'
       *               }
       *             ]
       *     });
       */
      removeHeaderButtons : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'removeHeaderButtons';
        data.type = 'button';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          var id = items[i].itemId != null ? items[i].itemId : items[i].id;
          if (scope.items[id] != null) {
            //delete saved data
            delete scope.items[id];
          }
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },
     
    
      /**
     * @description Lists all buttons that have been added to the widget chrome.
     * @param {Object} cfg config object see below for properties
     * @param {Function} cfg.callback The function which receives the results.
     *
     * @example
     *    //this.wc is an already instantiated WidgetChrome obj
     *    this.wc.listHeaderButtons({
     *     callback: function(msg) {
     *         //msg will always be a json string
     *         var res = Ozone.util.parseJson(msg);
     *         if (res.success) {
     *             for (var i = 0; i < res.items.length; i++) {
     *             	// do something with the buttons
     *             }
     *         }
     *     }
     *   });
     */
      listHeaderButtons: function(cfg) {
      var data = {
        action: 'listHeaderMenus',
        type: 'button'
      };
      var jsonString = gadgets.json.stringify(data);
      gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
    },
    
      /**
       * @description Adds menus to the Widget Chrome.  Menus are added after existing menus.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of menu configurations to add to the chrome.  See example for menu configs
       * @param {String} cfg.items[*].parentId itemId is the itemId of the menu to which this configuration should be added as a sub-menu.  If omitted, the configuration will be added as a main menu on the menu toolbar.  
       * @param {String} cfg.items[*].itemId itemId is a unique id among all menus that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate menus which may not be able to be removed properly.
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the menu.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the menu.  
       * @param {Object} cfg.items[*].menu menu configuration object
       * @param {Object[]} cfg.items[*].menu.items an array of menu item configurations to add to the chrome.  See example for menu item configs
       * @param {String} cfg.items[*].menu.items[*].itemId itemId is a unique id among all menu items that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.
       * @param {String} cfg.items[*].menu.items[*].xtype xtype is used to specify the type of menu item to add.  This attribute should be omitted unless specifying a menuseparator. Setting this value to "menuseparator" adds a separator bar to a menu, used to divide logical groups of menu items. If specified, only xtype should be specified.  Generally you will add one of these by using "-" in your items config rather than creating one directly using xtype.  See example below for usage. 
       * @param {String} cfg.items[*].menu.items[*].icon This property defines the URL of the image to be used for the menu item.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].menu.items[*].text This property defines text to appear for the menu item. 
       * @param {Function} cfg.items[*].menu.items[*].handler The handler attribute defines a function to be executed when the menu item is clicked. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function's parameter list contains the standard parameters for an Eventing callback function.
       * @param {Object} cfg.items[*].menu.items[*].menu sub-menu configuration object.  See example for sub-menu config.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.addHeaderMenus({
       *             items:
       *              [
       *				{
       *					itemId:'regularMenu',
       *					icon: './themes/common/images/skin/exclamation.png',
       *					text: 'Regular Menu',
       *					menu: {
       *						items: [
       *						    {
       *						    	itemId:'regularMenuItem1',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Regular Menu Item 1',
       *						    	handler: function(sender, data) {
       *						    		alert('You clicked the Regular Menu menu item.');
       *						    	}
       *						    }
       *						]
       *					}
       *				},
       *				{
       *					itemId:'snacks',
       *					icon: './themes/common/images/skin/exclamation.png',
       *					text: 'Menu with Sub-Menu',
       *					menu: {
       *						items: [
       *						    {
       *						    	itemId:'fruits',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Fruits',
       *						    	menu: {
       *							    	items: [
       *							    	    {
       *							    	    	itemId:'apple',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Apple',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be an Apple.');
       *							    	    	}
       *							    	    },
       *                                        {
       *                                            xtype: 'menuseparator'
       *                                        },
       *							    	    {
       *							    	    	itemId:'banana',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Banana',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be a Banana.');
       *							    	    	}
       *							    	    }, {
       *							    	    	itemId:'cherry',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Cherries',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be Cherries.');
       *							    	    	}
       *							    	    }
       *							    	]
       *						    	}
       *						    },
       *							'-', // another way to add a menu separator 
       *							{
       *						    	itemId:'cupcake',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Cupcake',
       *						    	handler: function(sender, data) {
       *						    		alert('Your snack will be a Cupcake.');
       *						    	}
       *						    }, {
       *						    	itemId:'chips',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Potato Chips',
       *						    	handler: function(sender, data) {
       *						    		alert('Your snack will be a Potato Chips.');
       *						    	}
       *						    }
       *						]
       *					}
       *				}
       *             ]
       *     });
       */
      addHeaderMenus : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'addHeaderMenus';
        data.type = 'menu';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
        	var item = items[i];
        	scope.registerChromeMenu(item);
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);

      },
      
      /**
       * @description Updates any existing menus in the Widget Chrome based on the itemId.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of menu configurations to add to the chrome.  See example for menu configs
       * @param {String} cfg.items[*].itemId itemId is a unique id among all menus that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate menus which may not be able to be removed properly.
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the menu.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the menu.  
       * @param {Object} cfg.items[*].menu menu configuration object
       * @param {Object[]} cfg.items[*].menu.items an array of menu item configurations to add to the chrome.  See example for menu item configs
       * @param {String} cfg.items[*].menu.items[*].itemId itemId is a unique id among all menu items that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.
       * @param {String} cfg.items[*].menu.items[*].xtype xtype is used to specify the type of menu item to add.  This attribute should be omitted unless specifying a menuseparator. Setting this value to "menuseparator" adds a separator bar to a menu, used to divide logical groups of menu items. If specified, only xtype should be specified.  See example below for usage.
       * @param {String} cfg.items[*].menu.items[*].icon This property defines the URL of the image to be used for the menu item.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].menu.items[*].text This property defines text to appear for the menu item. 
       * @param {Function} cfg.items[*].menu.items[*].handler The handler attribute defines a function to be executed when the menu item is clicked. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function's parameter list contains the standard parameters for an Eventing callback function.
       * @param {Object} cfg.items[*].menu.items[*].menu sub-menu configuration object.  See example for sub-menu config.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.updateHeaderMenus({
       *             items:
       *              [
       *				{
       *					itemId:'regularMenu',
       *					icon: './themes/common/images/skin/exclamation.png',
       *					text: 'Regular Menu',
       *					menu: {
       *						items: [
       *						    {
       *						    	itemId:'regularMenuItem1',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Regular Menu Item 1',
       *						    	handler: function(sender, data) {
       *						    		alert('You clicked the Regular Menu menu item.');
       *						    	}
       *						    }
       *						]
       *					}
       *				},
       *				{
       *					itemId:'snacks',
       *					icon: './themes/common/images/skin/exclamation.png',
       *					text: 'Menu with Sub-Menu',
       *					menu: {
       *						items: [
       *						    {
       *						    	itemId:'fruits',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Fruits',
       *						    	menu: {
       *							    	items: [
       *							    	    {
       *							    	    	itemId:'apple',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Apple',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be an Apple.');
       *							    	    	}
       *							    	    },
       *                                        {
       *                                            xtype: 'menuseparator'
       *                                        },
       *							    	    {
       *							    	    	itemId:'banana',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Banana',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be a Banana.');
       *							    	    	}
       *							    	    }, {
       *							    	    	itemId:'cherry',
       *							    	    	icon: './themes/common/images/skin/exclamation.png',
       *							    	    	text: 'Cherries',
       *							    	    	handler: function(sender, data) {
       *							    	    		alert('Your snack will be Cherries.');
       *							    	    	}
       *							    	    }
       *							    	]
       *						    	}
       *						    },
       *							'-', // another way to add a menu separator 
       *							{
       *						    	itemId:'cupcake',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Cupcake',
       *						    	handler: function(sender, data) {
       *						    		alert('Your snack will be a Cupcake.');
       *						    	}
       *						    }, {
       *						    	itemId:'chips',
       *						    	icon: './themes/common/images/skin/exclamation.png',
       *						    	text: 'Potato Chips',
       *						    	handler: function(sender, data) {
       *						    		alert('Your snack will be a Potato Chips.');
       *						    	}
       *						    }
       *						]
       *					}
       *				}
       *             ]
       *     });
       */
      updateHeaderMenus : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'updateHeaderMenus';
        data.type = 'menu';
        data.items = items;
        
        var merge = function(source, key, value) {
            if (typeof key === 'string') {
                if (value && value.constructor === Object) {
                    if (source[key] && source[key].constructor === Object) {
                        merge(source[key], value);
                    }
                    else {
                        source[key] = Ext.clone(value);
                    }
                }
                else {
                    source[key] = value;
                }

                return source;
            }

            var i = 1,
                ln = arguments.length,
                object, property;

            for (; i < ln; i++) {
                object = arguments[i];

                for (property in object) {
                    if (object.hasOwnProperty(property)) {
                        merge(source, property, object[property]);
                    }
                }
            }

            return source;
        };
        
        for (var i = 0; i < items.length; i++) {
        	var item = items[i];
        	// don't re-register menu if submenu or handler are unchanged
        	if (item.menu || item.handler) {
        		scope.registerChromeMenu(item);
        	}
        	if (item.menu) {
	        	for (var j = 0 ; j < item.menu.items.length ; j++) {
	        		var menuItem = item.menu.items[j];
	        		if (!menuItem.menu) {
	        			// Regular menu item
	        			// Merge with current menu item
	        			var key = menuItem.itemId != null ? menuItem.itemId : menuItem.id;
	        			scope.items[key] = scope.items[key] ? scope.items[key] : {};
	                	scope.items[key] = merge(scope.items[key], menuItem);
	        		} else {
	        			// Sub-menu 
	        			for (var k = 0 ; k < menuItem.menu.items.length ; k++) {
	        				var subMenuItem = menuItem.menu.items[k];
		        			// Merge with current sub-menu item
		        			var key = subMenuItem.itemId != null ? subMenuItem.itemId : subMenuItem.id;
		        			scope.items[key] = scope.items[key] ? scope.items[key] : {};
		                	scope.items[key] = merge(scope.items[key], subMenuItem);
	        			}
	        		}
	        	}
        	} else {
    			// Regular menu item
    			// Merge with current menu item
    			var key = item.itemId != null ? item.itemId : item.id;
    			scope.items[key] = scope.items[key] ? scope.items[key] : {};
            	scope.items[key] = merge(scope.items[key], item);
        	}
        	
        	// Update data with merged item
        	data.items[i] = scope.items[data.items[i].itemId];
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);

      },

      /**
       * @description Inserts new menus into the Widget Chrome.  Menus are added to the same area as existing menus.
       * @param {Object} cfg config object see below for properties
       * @param {Number} [cfg.pos=0] 0-based index of where menus will be added, among any pre-existing menus.
       * @param {Object[]} cfg.items an array of menu configurations to add to the chrome.  See example for menu configs
       * @param {String} cfg.items[*].parentId itemId is the itemId of the menu to which this configuration should be added as a sub-menu.  If omitted, the configuration will be added as a main menu on the menu toolbar.  
       * @param {String} cfg.items[*].itemId itemId is a unique id among all menus that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.  If itemId is not unique this may result in duplicate menus which may not be able to be removed properly.
       * @param {String} cfg.items[*].icon This property defines the URL of the image to be used for the menu.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].text This property defines text to appear alongside the menu.  This property is only used if the xtype is ‘menu.’  ‘widgettool’ will not show text.
       * @param {Object} cfg.items[*].menu menu configuration object
       * @param {Object[]} cfg.items[*].menu.items an array of menu item configurations to add to the chrome.  See example for menu item configs
       * @param {String} cfg.items[*].menu.items[*].itemId itemId is a unique id among all menu items that are added.  It is a required property.  It is used for identification and defines the internal Eventing channel which is used to execute the handler function.
       * @param {String} cfg.items[*].menu.items[*].xtype xtype is used to specify the type of menu item to add.  This attribute should be omitted unless specifying a menuseparator. Setting this value to "menuseparator" adds a separator bar to a menu, used to divide logical groups of menu items. If specified, only xtype should be specified.  See example below for usage.
       * @param {String} cfg.items[*].menu.items[*].icon This property defines the URL of the image to be used for the menu item.  If the URL is a relative path, it will be relative to the /owf context.  This is useful if the desired image is hosted by the OWF web server.  Otherwise a fully qualified URL should be used.  If type is being used to determine the image, the icon property is optional
       * @param {String} cfg.items[*].menu.items[*].text This property defines text to appear for the menu item. 
       * @param {Function} cfg.items[*].menu.items[*].handler The handler attribute defines a function to be executed when the menu item is clicked. This function is executed using Widget Eventing API from inside the widget.  The internal channel name used is the itemId attribute. This function's parameter list contains the standard parameters for an Eventing callback function.
       * @param {Object} cfg.items[*].menu.items[*].menu sub-menu configuration object.  See example for sub-menu config.
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.insertHeaderMenus({
       *             pos: 0,
       *             items: [{
       *			 itemId:'insertedMenu',
       *				icon: './themes/common/images/skin/exclamation.png',
       *				text: 'Inserted Menu',
       *				menu: {
       *					items: [
       *					    {
       *					    	itemId:'insertedMenuItem1',
       *					    	icon: './themes/common/images/skin/exclamation.png',
       *					    	text: 'Inserted Menu Item 1',
       *					    	handler: function(sender, data) {
       *					    		alert('You clicked the Inserted Menu menu item.');
       *					    	}
       *					    },
       *					    {
       *					    	xtype: 'menuseparator'
       *					    },
       *					    {
       *					    	itemId:'insertedMenuItem2',
       *					    	icon: './themes/common/images/skin/exclamation.png',
       *					    	text: 'Inserted Menu Item 2',
       *					    	handler: function(sender, data) {
       *					    		alert('You clicked the Inserted Menu menu item.');
       *					    	}
       *						},
       *						'-', // another way to add a menu separator 
       *						{
       *					    	itemId:'insertedMenuItem3',
       *					    	icon: './themes/common/images/skin/exclamation.png',
       *					    	text: 'Inserted Menu Item 3',
       *					    	handler: function(sender, data) {
       *					    		alert('You clicked the Inserted Menu menu item.');
       *					    	}
       *					    }
       *					]
       *				}
       *			}]
       *     });
       */
      insertHeaderMenus : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'insertHeaderMenus';
        data.type = 'menu';
        if (cfg.pos != null) {
          data.pos = cfg.pos;
        }
        data.items = items;
        for (var i = 0; i < items.length; i++) {
        	var item = items[i];
        	if (item.menu) {
	        	for (var j = 0 ; j < item.menu.items.length ; j++) {
	        		var menuItem = item.menu.items[j];
	        		if (!menuItem.menu) {
	        			// Regular menu item
	                	scope.items[menuItem.itemId != null ? menuItem.itemId : menuItem.id] = menuItem;
	        		} else {
	        			// Sub-menu 
	        			for (var k = 0 ; k < menuItem.menu.items.length ; k++) {
	        				var subMenuItem = menuItem.menu.items[k];
	                    	scope.items[subMenuItem.itemId != null ? subMenuItem.itemId : subMenuItem.id] = subMenuItem;
	        			}
	        		}
	        	}
        	} else {
    			// Regular menu item
            	scope.items[item.itemId != null ? item.itemId : item.id] = item;
        	}
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },

      /**
       * @description Removes existing menus on the Widget Chrome based on itemId.
       * @param {Object} cfg config object see below for properties
       * @param {Object[]} cfg.items an array of objects containing itemIds for the menus to remove from the chrome.
       *   See example below for button configs
       * @example
       *     //this.wc is an already instantiated WidgetChrome obj
       *     this.wc.removeHeaderMenus({
       *             items: [{
       *            	 itemId: 'regularMenu'
       *             }]
       *     });
       */
      removeHeaderMenus : function(cfg) {
        var data = {};
        var items = null;

        if (!owfdojo.isArray(cfg.items)) {
          items = [cfg.items];
        }
        else {
          items = cfg.items;
        }

        data.action = 'removeHeaderMenus';
        data.type = 'menu';
        data.items = items;
        for (var i = 0; i < items.length; i++) {
          var id = items[i];
          if (scope.items[id] != null) {
            //delete saved data
            delete scope.items[id];
          }
        }

        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },
      
      /**
       * @description Lists all menus that have been added to the widget chrome.
       * @param {Object} cfg config object see below for properties
       * @param {Function} cfg.callback The function which receives the results.
       *
       * @example
       *    //this.wc is an already instantiated WidgetChrome obj
       *    this.wc.listHeaderMenus({
       *     callback: function(msg) {
       *         //msg will always be a json string
       *         var res = Ozone.util.parseJson(msg);
       *         if (res.success) {
       *             for (var i = 0; i < res.items.length; i++) {
       *             	// do something with the menus
       *             }
       *         }
       *     }
       *   });
       */
      listHeaderMenus: function(cfg) {
        var data = {
          action: 'listHeaderMenus',
          type: 'menu'
        };
        var jsonString = gadgets.json.stringify(data);
        gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
      },

       /**
         * @description Gets the Widget's Title from the Chrome
         * @param {Object} cfg config object see below for properties
         * @param {Function} cfg.callback The function which receives the results.
         *
         * @example
         *    //this.wc is an already instantiated WidgetChrome obj
         *    this.wc.getTitle({
         *     callback: function(msg) {
         *         //msg will always be a json string
         *         var res = Ozone.util.parseJson(msg);
         *         if (res.success) {
         *
         *           //do something with title
         *           // res.title
         *         }
         *     }
         *   });
         */
       getTitle: function(cfg) {
         var data = {
            action: 'getTitle'
          };
         var jsonString = gadgets.json.stringify(data);
         gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
       },

        /**
          * @description Sets the Widget's Title in the Chrome
          * @param {Object} cfg config object see below for properties
          * @param {String} cfg.title The string which will replace the widget title
          * @param {Function} cfg.callback The function which receives the results.
          *
          * @example
          *    //this.wc is an already instantiated WidgetChrome obj
          *    this.wc.setTitle({
          *     title: 'new title',
          *     callback: function(msg) {
          *         //msg will always be a json string
          *         var res = Ozone.util.parseJson(msg);
          *         if (res.success) {
          *           //get title back for confirmation
          *           // res.title
          *
          *         }
          *     }
          *   });
          */
        setTitle: function(cfg) {
          var data = {
             action: 'setTitle',
             title: cfg.title
           };
          var jsonString = gadgets.json.stringify(data);
          gadgets.rpc.call('..', scope.channelName, cfg.callback, scope.widgetEventingController.getWidgetId(), jsonString);
        }

    };

    pub.init(config);
    Ozone.chrome.WidgetChrome.instance = pub;
  }
  return Ozone.chrome.WidgetChrome.instance;
};

/**
 *  @description Retrieves Ozone.chrome.WidgetChrome Singleton instance.  To do so it requires a widgetEventingController
 *  @param  {Object} config - config object with parameters
 *  @param  {Ozone.eventing.Widget} config.widgetEventingController - widget eventing object which handles eventing for the widget
 *  @example
 *    this.wc = Ozone.chrome.WidgetChrome.getInstance({
 *        widgetEventingController: this.widgetEventingController
 *    });
 *
 * @throws {Error} throws an error with a message if widget initialization fails
 */
Ozone.chrome.WidgetChrome.getInstance = function(cfg) {
  if (Ozone.chrome.WidgetChrome.instance == null) {
    Ozone.chrome.WidgetChrome.instance = new Ozone.chrome.WidgetChrome(cfg);
  }
  return Ozone.chrome.WidgetChrome.instance;
};


