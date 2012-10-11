({
	buttons: [
	  {
	    xtype: 'button',
	    //path to an image to use. this path should either be fully qualified or relative to the /owf context
	    icon: './themes/common/images/skin/exclamation.png',
	    text: 'Alert',
	    itemId:'alert',
	    tooltip:  {
	      text: '<b>Alert!</b>'
	    },
	    handler: function(sender, data) {
            Ext.Msg.alert('Alert', 'Alert Button Pressed');
	    }
	  },
	  {
	    xtype: 'widgettool',
	    //path to an image to use. this path should either be fully qualified or relative to the /owf context
	    icon: './themes/common/images/skin/information.png',
	    itemId:'help',
	    handler: function(sender, data) {
            Ext.Msg.alert('About', 'About Button Pressed');
	    }
	  },
	  {
	    //gear is a standard ext tool type
	    type: 'gear',
	    itemId:'gear',
	    handler: function(sender, data) {
            Ext.Msg.alert('Utility', 'Utility Button Pressed');
	    }
	  }
  ],
  
  menus: [{
		itemId: 'menus',
    	text: 'Menus',
    	menu: {
            items: [
                /*************************** ADDING HEADER MENUS *******************************/
                /* The section below demonstrates an example of adding a menu/submenu on the   */
                /* Widget Chrome menubar.                                                      */
                /*******************************************************************************/
                {
                	itemId: 'addmenu',
                    text: 'Add',
                    handler: function(btn, state) {
                        var cmp = Ext.getCmp('widgetChrome-example');
                        var msgBox = Ext.Msg.show({
                        	title: 'Add Menu',
                        	msg: 'Menu Configuration: ',
                        	width: cmp.getWidth() - 50,
                        	buttons: Ext.Msg.OKCANCEL,
                        	defaultTextHeight: cmp.getHeight() - 150,
                        	multiline: true,
                        	fn: function(btn, text){
                        		if (btn == 'ok') {
                                    //don't ever really do this eval is bad practice
                                    var data = eval("(" + text + ");");
                                    if (!owfdojo.isArray(data)) {
                                    	data = [data];
                                    }
                                    OWF.Chrome.addHeaderMenus({
                                        items: data
                                    });
                        		}
                        	}
                        });
                        //Fix for the textArea extending beyond the messagebox
                        msgBox.textArea.setWidth(msgBox.width - 30);
                        msgBox.textArea.setHeight(msgBox.height - 100);
                        msgBox.textArea.doComponentLayout();
                    }
                },

                /*************************** INSERTING HEADER MENUS ***********************/
                /* The section below demonstrates an example of inserting a menu into the */
                /* Widget Chrome menubar.                                                 */
                /**************************************************************************/
                {
                	itemId: 'insertmenu',
                    text: 'Insert',
                    handler: function(btn, state) {
                        var cmp = Ext.getCmp('widgetChrome-example');
                        var msgBox = Ext.Msg.show({
                        	title: 'Insert Menu',
                        	msg: 'Menu Configuration: ',
                        	width: cmp.getWidth() - 50,
                        	buttons: Ext.Msg.OKCANCEL,
                        	defaultTextHeight: cmp.getHeight() - 150,
                        	multiline: true,
                        	fn: function(btn, text){
                        		if (btn == 'ok') {
                                    //don't ever really do this eval is bad practice
                                    var data = eval("(" + text + ");");
                                    OWF.Chrome.insertHeaderMenus(data);
                        		}
                        	}
                        });
                        //Fix for IE7 where the textArea extends beyond the messagebox
                        msgBox.textArea.setWidth(msgBox.width - 30);
                        msgBox.textArea.setHeight(msgBox.height - 100);
                        msgBox.textArea.doComponentLayout();
                    }
                },
                
                /*************************** UPDATING HEADER MENUS ***********************/
                /* The section below demonstrates an example of updating a menu on the   */
                /* Widget Chrome menubar.                                                */
                /*************************************************************************/
                {
                	itemId: 'updatemenu',
                    text: 'Update',
                    handler: function(btn, state) {
                        var cmp = Ext.getCmp('widgetChrome-example');
                        var msgBox = Ext.Msg.show({
                        	title: 'Update Menu',
                        	msg: 'Menu Configuration: ',
                        	width: cmp.getWidth() - 50,
                        	buttons: Ext.Msg.OKCANCEL,
                        	defaultTextHeight: cmp.getHeight() - 150,
                        	multiline: true,
                        	fn: function(btn, text){
                        		if (btn == 'ok') {
                                    //don't ever really do this eval is bad practice
                                    var data = eval("(" + text + ");");
                                    if (!owfdojo.isArray(data)) {
                                    	data = [data];
                                    }
                                    OWF.Chrome.updateHeaderMenus({
                                        items: data
                                    });
                        		}
                        	}
                        });
                        //Fix for IE7 where the textArea extends beyond the messagebox
                        msgBox.textArea.setWidth(msgBox.width - 30);
                        msgBox.textArea.setHeight(msgBox.height - 100);
                        msgBox.textArea.doComponentLayout();
                    }
                },

                /*************************** REMOVING HEADER MENUS ***********************/
                /* The section below demonstrates an example of removing a menu on the   */
                /* Widget Chrome menubar.                                                */
                /*************************************************************************/
                {
                	itemId: 'removemenu',
                    text: 'Remove',
                    handler: function(btn, state) {
                        var cmp = Ext.getCmp('widgetChrome-example');
                        var msgBox = Ext.Msg.prompt('Remove Menu', 'Menu itemId: ', function(btn, text){
                       		if (btn == 'ok') {
                       			var protectedMenus = ['menus','addmenu','insertmenu','updatemenu','removemenu','listmenu'];
                       			if (Ext.Array.indexOf(protectedMenus, text) == -1) {
                                        OWF.Chrome.removeHeaderMenus({
                                       items:[{
                                       	itemId: text
                                       }]
                                   });
                       			} else {
                       	            Ext.Msg.alert('Error', 'You may not remove that menu.');
                       			}
                       		}
                        });
                        //Fix for IE7 where the textfield extends beyond the messagebox
                        msgBox.textField.maxWidth = msgBox.width - 30;
                        msgBox.textField.doComponentLayout();
                    }
                },

                /*************************** LISTING HEADER MENUS **************************/
                /* The section below demonstrates an example of listing all menus,         */
                /* including submenus, on the Widget Chrome menubar.                       */
                /***************************************************************************/
                {
                	itemId: 'listmenu',
                    text: 'List',
                    handler: function(btn, state) {
                        var cmp = Ext.getCmp('widgetChrome-example');
                        OWF.Chrome.listHeaderMenus({
                         	callback: Ext.bind(function(msg) {
                                var result = Ozone.util.parseJson(msg);
                                var menus = result.items.toString().replace(/,/gi, "<br />");
                                Ext.Msg.show({
                                	title: 'Widget Chrome Menus',
                                	msg: menus,
                                	width: cmp.getWidth() - 50,
                                	height: cmp.getHeight() - 150,
                                	buttons: Ext.Msg.OK
                                });
                          	}, cmp)
                        });
                    }
                }
            ]
        }
  	}
  ]
});