//TODO reimplement that class as a proper Ext.menu.Menu, the way it is now the menu this button creates uses a hardcoded
//z-index and does not participate in Ext's ZindexManagement.  This makes it hard to use tooltips on the menu items
Ext.define('Ozone.components.button.UserMenuButton', {
    extend: 'Ext.button.Button',
    alias: ['widget.usermenubutton', 'widget.Ozone.components.button.UserMenuButton'],

//    plugins: new Ozone.components.focusable.Focusable(),

    iconAlign: 'right',
    iconCls: 'userMenuIcon',
    
    scale: 'banner-large',

    user: null,

    logoutText: "Sign Out",

    menuHidden: true,
    hideMenu: false,
    hideDelay: 100,
    showDelay: 800,

    initComponent: function() {
        var me = this;
        
        me.text = Ext.htmlEncode(me.user.userRealName);

        var toggleAboutWindow = (function() {
            //save the about window between calls
            var win;

            return function toggleAboutWindow() {
                if (!win || win.isDestroyed) {
                    win = Ext.create("Ozone.components.window.ModalWindow", {
                        id: 'about-window',
                        ui: 'system-window',
                        cls: 'system-window',
                        modalAutoClose: true,
                        preventHeader: true,
                        width: 550,
                        draggable: false,
                        resizable: false,
                        shadow: false,
                        dashboardContainer: me.dashboardContainer
                    });

                    Ext.Ajax.request({
                        url: Ozone.util.contextPath() + "/about.jsp",
                        success: function(response){
                            var text = response.responseText;
                            
                            function setupWindow() {
                                Ext.DomHelper.append(win.body, text);
                                win.setupFocus();
                                win.center();
                            }

                            if (win.isVisible())
                                setupWindow();
                            else 
                                win.on('show', function() {
                                    setupWindow();
                                });

                        }
                    });
                }

                if (!win.isVisible()) {
                    win.show();
                    win.center();
                }
                else
                    win.hide();
            }
        })();

        //create user menu
      me.items = [
        {
          text: 'Previous Sign In ' + me.user.prettyPrevLogin,
          id: 'prevLogin',
          clickable: false
        },
        {
          text: 'Profile',
          id: 'profile',
          handler: Ext.bind(function() {
            if (this.profileWindow == null || this.profileWindow.isDestroyed) {
              this.profileWindow = Ext.widget('profileWindow', {
                ownerCt: this.dashboardContainer,
                dashboardContainer: this.dashboardContainer,
                user: this.user
              });
            }
            this.profileWindow.show();
          },this)
        },
        {
          text: 'About',
          id: 'about',
          handler: toggleAboutWindow
        }
      ];

      //check if logout link is active if so add config to owfbanner item
        if (Ozone.config.logoutURL != null) {
            me.items.push(
                {
                    spacer: true   
                },
                {
                    text: me.logoutText,
                    id: 'logout',
                    handler: logout
                }
            );
        }

        //defaults for user menu items
        for (var i = 0, len = me.items.length; i < len; i++) {
            var item = me.items[i];
            Ext.applyIf(item, { spacer: false, clickable: true });

            //spacers are not clickable
            if (item.spacer) item.clickable = false;
        }

    	function logout(){
			window.location.href = Ozone.util.contextPath() + Ozone.config.logoutURL;
    	}

        Ozone.KeyMap.addBinding([
            Ext.apply({
                scope: this,
                fn: logout
            }, Ozone.components.keys.HotKeys.LOGOUT)
        ]);

        // // Resolve WelcomeMessage, possibly using previous login date (OWFPATCHES-5)
        // var welcomeMsg = Ozone.layout.DesktopWindowManagerString.welcomeMessage + ' ' + Ext.util.Format.htmlEncode(this.user.displayName);

        // if (Ozone.config.showLastLogin == 'true') {
        //    // First resolve the last login date
        //    var prevDateStr = Ext.util.Format.date(prevDate.toLocaleString(), Ozone.config.lastLoginDateFormat);
        //    // Now replace date into string format
        //    var lastLoginStr = new String(Ozone.config.lastLoginText);
        //    lastLoginStr = lastLoginStr.replace(/\[lastLoginDate\]/g, prevDateStr);
        //    welcomeMsg = welcomeMsg + ' ' + lastLoginStr;
        // }
        // else {
        //    welcomeMsg = Ozone.layout.DesktopWindowManagerString.welcomeMessage + ' ' + Ext.util.Format.htmlEncode(this.user.displayName) + ' ';
        // }

        me.userMenu = new Ext.XTemplate(
            '<ul id="userMenu">',
                '<tpl for=".">',
                    '<tpl if="spacer">',
                        '<hr/>',
                    '</tpl>',
                    '<tpl if="!spacer">',
                        '<li id="{id}" ',
                        '<tpl if="clickable">',
                            'class="clickable"',
                        '</tpl>',
                            '><span>',
                                '{text}',
                            '</span>',
                        '</li>',
                    '</tpl>',
                '</tpl>',
            '</ul>'
        );


        me.on('afterrender', me.onAfterRender, this);
        me.on('click', me.onClick, this);

        me.callParent(arguments);
    },

    //only call this after render
    getClickables: (function() {
        var cached;

        return function() {
            if (!cached) cached = this.userMenu.el.select('.clickable');
            return cached;
        }
    })(),

    //automatically transition focus
    //from the button to the menu and back
    setupFocusBridge: function() {
        //using apply to make a copy, since this is the flyweight
        //object
        var firstMenuEl = Ext.apply({}, this.getClickables().first()),
            btnEl = this.getFocusEl();

        this.mon(btnEl, 'keydown', function (evt) {
            if (evt.keyCode === Ext.EventObject.TAB && evt.shiftKey === false) {
                evt.preventDefault();
                firstMenuEl.focus();
            }
        });

        this.mon(firstMenuEl, 'keydown', function(evt) {
            if (evt.keyCode === Ext.EventObject.TAB && evt.shiftKey === true) {
                evt.preventDefault();
                btnEl.focus();
            }
        });
    },

    onAfterRender: function(cmp) {
        var clickables;
//        var keymap;
        
        cmp.userMenu.el = Ext.get(cmp.userMenu.append(Ext.getBody(), cmp.items));
        cmp.userMenu.el.setVisibilityMode(Ext.Element.DISPLAY);
        cmp.userMenu.el.setVisible(false);

        cmp.setupFocusBridge();

        clickables = cmp.getClickables();
        
        cmp.addMenuShowHideHandlers();

        clickables.each(function(it) {
            it.addClsOnOver('over');
            it.addClsOnOver(it.id + '-over');
            it.addClsOnFocus(it.id + '-focus');

            Ozone.components.focusable.Focusable.setupFocus(it.dom, cmp);
        });

        //handle item clicks
        for (var i = 0, len = cmp.items.length; i < len; i++) {
            var item = cmp.items[i];
            
            if (item.clickable) {
                var el = Ext.get(item.id);
                el.handler = item.handler;

                cmp.mon(el, 'click', el.handler);
            }
        }

//        //handle ENTER on userMenuBtn
//        keymap = new Ext.util.KeyMap(cmp.getEl(), {
//            key: [Ext.EventObject.ENTER, Ext.EventObject.SPACE, Ext.EventObject.DOWN],
//            handler: function() {
//                this.showUserMenu();
//                this.getClickables().first().focus();
//            },
//            scope: cmp
//        });
//
//        //clean up keymap
//        cmp.on('destroy', function() {
//            this.destroy();
//        }, keymap);

        cmp.setupMenuNav();

        Ext.widget('tooltip',{
          id: 'prevLoginToolTip',
          target: Ext.get('prevLogin'),
          html: 'Previous Sign In ' + this.formatLoginDate(this.user.prevLogin),
          listeners: {
            show: {
              fn: function(cmp, opts) {
                cmp.setZIndex(100000001);
              }
            }
          }
        });
    },
    
    onClick: function() {
        if (this.menuHidden) {
            this.hideMenu = false;
            this._showMenu();
        } else {
            this.hideMenu = true;
            this._hideMenu();
        }
    },

    setupMenuNav: function() {
        var me = this,
            nav;

        //given the dom node of one of the clickable menu items,
        //focus either the next clickable one or the previous, depending
        //on whether or not backwards is true
        function focusClickableSibling(dom, backwards) {
                var newNode = Ext.get(dom),
                    property = backwards ? 'previousSibling' : 'nextSibling';
                
                //look backwards or forwards through the nodes until another 
                //clickable one is found
                while ((newNode = Ext.get(newNode.dom[property])) && !newNode.hasCls('clickable'));

                if (newNode) newNode.focus();
        }

        //keynav for the user menu
        var nav = new Ext.util.KeyNav(this.userMenu.el, {
            "up": function(evt) {
                focusClickableSibling(evt.getTarget(), true)
            },
            "down": function(evt) {
                focusClickableSibling(evt.getTarget())
            },
            "esc": Ext.bind(me.hideUserMenu, me),
            "enter": function(evt) {
                Ext.get(evt.getTarget()).handler.call()
            }
        });

        me.on('destroy', function() {
            this.destroy();
        }, nav);
    },


    formatLoginDate: function(unformattedDate) {
        var prevDate = new Date();
 
        if(unformattedDate) {
             prevDate.setUTCFullYear(unformattedDate.substring(0,4));
             prevDate.setUTCMonth(unformattedDate.substring(5,7)-1);
             prevDate.setUTCDate(unformattedDate.substring(8, 10));
             prevDate.setUTCHours(unformattedDate.substring(11,13),unformattedDate.substring(14,16));
        }

        return Ext.util.Format.date(prevDate, Ozone.config.lastLoginDateFormat);

    },

    addMenuShowHideHandlers: function() {
        var me = this,
            menuEl = me.userMenu.el,
            clickables = me.getClickables();

        //keep menu shown while mouse is over it
        me.mon(menuEl, 'mouseover', me.keepMenuOpen, me);

        //hide menu when mouse leaves it
        me.mon(menuEl, 'mouseout', me.hideUserMenu, me);

        //hide menu when mouse leaves button
        me.on('mouseout', me.hideUserMenu, me);

        //show menu when button is hovered over
        me.on('mouseover', me.showUserMenu, me);
        me.mon(me.getFocusEl(), 'focus', me.showUserMenu, me);

        me.mon(clickables, 'focus', me.keepMenuOpen, me);
        me.mon(clickables, 'blur', me.hideUserMenu, me);
        me.mon(me.getFocusEl(), 'blur', me.hideUserMenu, me);
    },
    
    keepMenuOpen: function() {
        this.hideMenu = false;
    },

    showUserMenu: function() {
        var me = this,
            menuEl = me.userMenu.el;

        me.hideMenu = false;
        
        if (!me.showTask) {
            me.showTask = Ext.create('Ext.util.DelayedTask', function() {
                me._showMenu();
            });
        }
        me.showTask.delay(Ext.isNumber(me.showDelay) ? me.showDelay : 800, null);
    },

    hideUserMenu: function() {
        var me = this;


        me.hideMenu = true;

        if (!me.hideTask) {
            me.hideTask = Ext.create('Ext.util.DelayedTask', function() {
                me._hideMenu();
            });
        }
        me.hideTask.delay(Ext.isNumber(me.hideDelay) ? me.hideDelay : 100, null);
    },
    
    _showMenu: function() {
        var me = this,
            menuEl = me.userMenu.el;
            
        if(me.hideTask) {
            me.hideTask.cancel();
        }

        me.menuHidden = false;
        
        /*
         * if it is currently fading out, 
         * stop it so that setVisible(false) 
         * does not get called out of order
         */
        menuEl.stopAnimation(); 

        menuEl.setVisible(true);
        menuEl.alignTo(me.getEl(), "tr-br");
        menuEl.fadeIn();
    },
    
    _hideMenu: function() {
        var me = this;
        
        if(me.showTask) {
            me.showTask.cancel();
        }
        if (me.menuHidden) return; //already hidden

        if(me.hideMenu === true && me.userMenu && me.userMenu.el) {
            me.menuHidden = true;

            me.userMenu.el.fadeOut({
                listeners: {
                    afteranimate: {
                        fn: function() {
                            //don't want the hidden menu to have focus
                            if (me.userMenu.el.contains(document.activeElement))
                                document.activeElement.blur();

                            //set display: none after fade is finished
                            this.userMenu.el.setVisible(false);
                        },
                        scope: me
                    }
                }
            });
        }
    }

});
