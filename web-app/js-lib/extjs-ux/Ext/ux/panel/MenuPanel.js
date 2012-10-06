declare ('Ext::ux::panel::MenuPanel', function(){
	/**
	 * A persistent menu, rendered on panel. This menu can be rendered like any other panel, there is no need in additional <b>show()</b> call.
	 * This menu is not closed when its child element is clicked or child menu is hidden. 
	 * <br>Based on Animal's code : <a href="http://extjs.com/forum/showthread.php?t=26395">http://extjs.com/forum/showthread.php?t=26395</a>
	 * <br><br>Demo link: <a href="http://extjs-ux.org/repo/authors/SamuraiJack/trunk/Ext/ux/panel/MenuPanel/menus.html">http://extjs-ux.org/repo/authors/SamuraiJack/trunk/Ext/ux/panel/MenuPanel/menus.html</a>
	 * <br><br>Forum thread: <a href="http://extjs.com/forum/showthread.php?t=45448">http://extjs.com/forum/showthread.php?t=45448</a>
	 * <br><br>This is link to another class: {@link Ext.ux.event.Broadcast}
	 * <br>This is link to symbol in the current class: {@link #Ext.ux.panel.MenuPanel-add}
	 * @class Ext.ux.panel.MenuPanel
	 * @extends Ext.Panel
	 * @version 0.1
	 * @author <a href="http://extjs.com/forum/member.php?u=36826">SamuraiJack</a>
	 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
	 * @donate <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_s-xclick">
<input type="image" src="https://www.paypal.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
<input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
</form>
	 */
	
	Ext.ux.panel.MenuPanel = Ext.extend(Ext.Panel, {
	    /**
	     * @cfg {Object} defaults
	     * A config object that will be applied to all items added to this container either via the {@link #Ext.ux.panel.MenuPanel-items}
	     * config or via the {@link #Ext.ux.panel.MenuPanel-add} method.  The defaults config can contain any number of
	     * name/value property pairs to be added to each item, and should be valid for the types of items
	     * being added to the menu.
	     */
		defaults : undefined,
	    /**
	     * @cfg {Mixed} items
	     * An array of items to be added to this menu.  See {@link #Ext.ux.panel.MenuPanel-add} for a list of valid item types.
	     */
		items : undefined,
	    /**
	     * @cfg {String} subMenuAlign The Ext.Element.alignTo anchor position value to use for submenus of
	     * this menu (defaults to "tl-tr?")
	     */
	    subMenuAlign : "tl-tr?",
	    /**
	     * @cfg {String} defaultAlign The default Ext.Element.alignTo anchor position value for this menu
	     * relative to its element of origin (defaults to "tl-bl?")
	     */
	    defaultAlign : "tl-bl?",
	    /**
	     * @cfg {Boolean} allowOtherMenus True to allow multiple menus to be displayed at the same time (defaults to false)
	     */
	    allowOtherMenus : false,
		
		/**
	     * @cfg {Boolean} persistent True to keep this menu from destroying on child clicks (defaults to true)
	     */
		persistent : true,
	
		border : false,
		
	    /**
		 * Constructor - creates a new MenuPanel
		 * @name Ext.ux.panel.MenuPanel
		 * @methodOf Ext.ux.panel.MenuPanel
		 * @param {Object} config Configuration options
	     */
		constructor: function(config){
	        if(Ext.isArray(config)){
	            config = {items:config};
	        }
	        Ext.apply(this, config);
	        this.addEvents(
	            /**
	             * Fires when this menu is clicked (or when the enter key is pressed while it is active)
	             * @event click
	             * @param {Ext.ux.panel.MenuPanel} this
	             * @param {Ext.menu.Item} menuItem The menu item that was clicked
	             * @param {Ext.EventObject} e
	             */
	            'click',
	            /**
	             * Fires when the mouse is hovering over this menu
	             * @event mouseover
	             * @param {Ext.ux.panel.MenuPanel} this
	             * @param {Ext.EventObject} e
	             * @param {Ext.menu.Item} menuItem The menu item that was clicked
	             */
	            'mouseover',
	            /**
	             * Fires when the mouse exits this menu
	             * @event mouseout
	             * @param {Ext.ux.panel.MenuPanel} this
	             * @param {Ext.EventObject} e
	             * @param {Ext.menu.Item} menuItem The menu item that was clicked
	             */
	            'mouseout',
	            /**
	             * Fires when a menu item contained in this menu is clicked
	             * @event itemclick
	             * @param {Ext.menu.BaseItem} baseItem The BaseItem that was clicked
	             * @param {Ext.EventObject} e
	             */
	            'itemclick'
	        );
	        if (!this.persistent) Ext.menu.MenuMgr.register(this);
	        Ext.ux.panel.MenuPanel.superclass.constructor.call(this);
	    },
	    
	    /** @private */
		onRender : function(ct, position){
	        Ext.ux.panel.MenuPanel.superclass.onRender.apply(this, arguments);
			
	        this.menu_wrp = Ext.DomHelper.append(this.body,{
                id: this.getId(),
                cls: 'x-menu ' + (this.cls ? (this.cls + '') : '') + (this.plain ? ' x-menu-plain' : ''),
                cn: [
                    {tag: 'a', cls: 'x-menu-focus', href: '#', onclick: 'return false;', tabIndex:'-1'},
                    {tag: 'ul', cls: 'x-menu-list'}
                ]
	        },true);
			
	        this.setLayout(new Ext.layout.ContainerLayout({
	            renderItem : this.renderItem
	        }));
	        
			
	        if(!this.keyNav){
	            this.keyNav = new Ext.ux.panel.MenuPanelNav(this);
	        }
	        // generic focus element
	        this.focusEl = this.menu_wrp.child('a.x-menu-focus');
	        this.ul = this.menu_wrp.child('ul.x-menu-list');
	        this.ul.on("click", this.onClick, this);
	        this.ul.on("mouseover", this.onMouseOver, this);
	        this.ul.on("mouseout", this.onMouseOut, this);
	    },
	
	    /** @private */
		getLayoutTarget : function() {
	        return this.ul;
	    },
	
	//    This function is being poked into an instance of ContainerLayout to render Menu Items.
	//    so this.container refers to the Menu.
	    /** @private */
		renderItem : function(c, position, target){
	        if(c && !c.rendered){
				
				if (this.persistent) c.hideOnClick = false;
	        
	            var li = document.createElement("li");
	            li.className = "x-menu-list-item";
	            c.render(li, this.container);
	
	            if(typeof position == 'number'){
	                position = target.dom.childNodes[position];
	            }
	            target.dom.insertBefore(li, position || null);
	            if(this.extraCls){
	                var t = c.getPositionEl ? c.getPositionEl() : c;
	                t.addClass(this.extraCls);
	            }
	        }else if(c && !this.isValidParent(c, target)){
	            if(this.extraCls){
	                c.addClass(this.extraCls);
	            }
	            if(typeof position == 'number'){
	                position = target.dom.childNodes[position];
	            }
	            target.dom.insertBefore(c.getActionEl().dom, position || null);
	        }
	    },
		
		/** @private */
		adjustSize : function(w, h){
			this.autoWidth = false;
			var res = Ext.ux.panel.MenuPanel.superclass.adjustSize.call(this, w, h);
			this.autoWidth = Ext.emptyFn;
			
			return res;
		},
		
		/** @private */
		syncSize : function(){
			this.autoWidth = false;
			var res = Ext.ux.panel.MenuPanel.superclass.syncSize.call(this);
			this.autoWidth = Ext.emptyFn;
			
			return res;
		},
		
	    /** @private */
	    autoWidth : Ext.emptyFn, 

	
	    /** @private */
	    findTargetItem : function(e){
	        var t = e.getTarget(".x-menu-list-item", this.ul,  true);
	        if(t && t.menuItemId){
	            return this.items.get(t.menuItemId);
	        }
	    },
	
	    /** @private */
	    onClick : function(e){
	        var t;
	        if(t = this.findTargetItem(e)){
	            t.onClick(e);
	            this.fireEvent("click", this, t, e);
	        }
	    },
	
	    /** @private */
	    setActiveItem : function(item, autoExpand){
	        if(item != this.activeItem){
	            if(this.activeItem){
	                this.activeItem.deactivate();
	            }
	            this.activeItem = item;
	            item.activate(autoExpand);
	        }else if(autoExpand){
	            item.expandMenu();
	        }
	    },
	
	    /** @private */
	    tryActivate : function(start, step){
	        var items = this.items;
	        for(var i = start, len = items.length; i >= 0 && i < len; i+= step){
	            var item = items.get(i);
	            if(!item.disabled && item.canActivate){
	                this.setActiveItem(item, false);
	                return item;
	            }
	        }
	        return false;
	    },
	
	    /** @private */
	    onMouseOver : function(e){
	        var t;
	        if(t = this.findTargetItem(e)){
	            if(t.canActivate && !t.disabled){
	                this.setActiveItem(t, true);
	            }
	        }
	        this.fireEvent("mouseover", this, e, t);
	    },
	
	    /** @private */
	    onMouseOut : function(e){
	        var t;
	        if(t = this.findTargetItem(e)){
	            if(t == this.activeItem && t.shouldDeactivate(e)){
	                this.activeItem.deactivate();
	                delete this.activeItem;
	            }
	        }
	        this.fireEvent("mouseout", this, e, t);
	    },
	
	    /** @private */
		focus : function(){
	        if(!this.hidden){
	            this.doFocus.defer(50, this);
	        }
	    },
	
		/** @private */
	    doFocus : function(){
	        if(!this.hidden){
	            this.focusEl.focus();
	        }
	    },
	
	    /**
	     * Hides this menu and optionally all parent menus
	     * @param {Boolean} deep (optional) True to hide all parent menus recursively, if any (defaults to false)
	     */
	    hide : function(deep){
	        if (this.persistent) return;
			
			if(this.ul && this.isVisible()){
	            
	            if(this.activeItem){
	                this.activeItem.deactivate();
	                this.activeItem = null;
	            }
	            Ext.ux.panel.MenuPanel.superclass.hide();
	        }
	        if(deep === true && this.parentMenu){
	            this.parentMenu.hide(true);
	        }
	    },
	
	    /**
	     * Addds one or more items of any type supported by the Menu class, or that can be converted into menu items.
	     * @name add
		 * @methodOf Ext.ux.panel.MenuPanel
	     * @param {Mixed} args One or more menu items, menu item configs or other objects that can be converted to menu items
		 * Any of the following are valid:
	     * <ul>
	     * <li>Any menu item object based on Ext.menu.Item</li>
	     * <li>An HTMLElement object which will be converted to a menu item</li>
	     * <li>A menu item config object that will be created as a new menu item</li>
	     * <li>A string, which can either be '-' or 'separator' to add a menu separator, otherwise
	     * it will be converted into a Ext.menu.TextItem and added</li>
	     * </ul>
	     * Usage:
	     * <pre>
	// Create the menu
	var menu = new Ext.ux.panel.MenuPanel();
	
	// Create a menu item to add by reference
	var menuItem = new Ext.menu.Item({ text: 'New Item!' });
	
	// Add a bunch of items at once using different methods.
	// Only the last item added will be returned.
	var item = menu.add(
	    menuItem,                // add existing item by ref
	    'Dynamic Item',          // new TextItem
	    '-',                     // new separator
	    { text: 'Config Item' }  // new item by config
	);
	</pre>
	     * @return {Ext.menu.Item} The menu item that was added, or the last one if multiple items were added
	     */
	    add : function(){
	        var a = arguments, l = a.length, item;
	        for(var i = 0; i < l; i++){
	            var el = a[i];
	            if(el.render){ // some kind of Item
	                item = this.addItem(el);
	            }else if(typeof el == "string"){ // string
	                if(el == "separator" || el == "-"){
	                    item = this.addSeparator();
	                }else{
	                    item = this.addText(el);
	                }
	            }else if(el.tagName || el.el){ // element
	                item = this.addElement(el);
	            }else if(typeof el == "object"){ // must be menu item config?
	                Ext.applyIf(el, this.defaults);
	                item = this.addMenuItem(el);
	            }
	        }
	        return item;
	    },
	
//	    /**
//	     * Returns this menu's underlying Ext.Element object
//	     * @return {Ext.Element} The element
//	     */
//	    getEl : function(){
//	        if(!this.el){
//	            this.render();
//	        }
//	        return this.el;
//	    },
	
	    /**
	     * Adds a separator bar to the menu
	     * @return {Ext.menu.Item} The menu item that was added
	     */
	    addSeparator : function(){
	        return this.addItem(new Ext.menu.Separator());
	    },
	
	    /**
	     * Adds an Ext.Element object to the menu
	     * @param {Mixed} el The element or DOM node to add, or its id
	     * @return {Ext.menu.Item} The menu item that was added
	     */
	    addElement : function(el){
	        return this.addItem(new Ext.menu.BaseItem(el));
	    },
	
	    /**
	     * Adds an existing object based on Ext.menu.Item to the menu
	     * @param {Ext.menu.Item} item The menu item to add
	     * @return {Ext.menu.Item} The menu item that was added
	     */
	    addItem : function(item){
	        Ext.ux.panel.MenuPanel.superclass.add.call(this, item);
	        if (this.rendered) this.doLayout();
	        return item;
	    },
	
	    /**
	     * Creates a new Ext.menu.Item based an the supplied config object and adds it to the menu
	     * @param {Object} config A MenuItem config object
	     * @return {Ext.menu.Item} The menu item that was added
	     */
	    addMenuItem : function(config){
	        if(!(config instanceof Ext.menu.Item)){
	            if(typeof config.checked == "boolean"){ // must be check menu item config?
	                config = new Ext.menu.CheckItem(config);
	            }else{
	                config = new Ext.menu.Item(config);
	            }
	        }
	        return this.addItem(config);
	    },
	
	    /**
	     * Creates a new Ext.menu.TextItem with the supplied text and adds it to the menu
	     * @param {String} text The text to display in the menu item
	     * @return {Ext.menu.Item} The menu item that was added
	     */
	    addText : function(text){
	        return this.addItem(new Ext.menu.TextItem(text));
	    },
	
	    /**
	     * Inserts an existing object based on Ext.menu.Item to the menu at a specified index
	     * @param {Number} index The index in the menu's list of current items where the new item should be inserted
	     * @param {Ext.menu.Item} item The menu item to add
	     * @return {Ext.menu.Item} The menu item that was added
	     */
	    insert : function(index, item){
	        Ext.ux.panel.MenuPanel.superclass.insert.apply(this, arguments);
	        if (this.rendered) this.doLayout();
	        return item;
	    },
	
	    /**
	     * Removes an Ext.menu.Item from the menu and destroys the object
	     * @param {Ext.menu.Item} item The menu item to remove
	     */
	    remove : function(item){
	        Ext.ux.panel.MenuPanel.superclass.remove.call(this, item, true);
	        if (this.rendered) this.doLayout();
	    },
	
	    /**
	     * Removes and destroys all items in the menu
	     */
	    removeAll : function(){
	        if (this.items) {
	            var f;
	            while(f = this.items.first()){
	                this.remove(f);
	            }
	        }
	    },
	
	    /** @private */
	    onDestroy : function(){
	        Ext.ux.panel.MenuPanel.superclass.onDestroy.apply(this, arguments);
	        Ext.menu.MenuMgr.unregister(this);
	        if (this.keyNav) {
	            this.keyNav.disable();    
	        }
	        if (this.ul) {
	            this.ul.removeAllListeners();    
	        }
	    }
	});
	
	Ext.reg('menupanel', Ext.ux.panel.MenuPanel);
	
	// MenuNav is a private utility class used internally by the Menu
	/** @private */
	Ext.ux.panel.MenuPanelNav = function(menu){
	    Ext.ux.panel.MenuPanelNav.superclass.constructor.call(this, menu.el);
	    this.scope = this.menu = menu;
	};
	
	/** @private */
	Ext.extend(Ext.ux.panel.MenuPanelNav, Ext.KeyNav, {
	    doRelay : function(e, h){
	        var k = e.getKey();
	        if(!this.menu.activeItem && e.isNavKeyPress() && k != e.SPACE && k != e.RETURN){
	            this.menu.tryActivate(0, 1);
	            return false;
	        }
	        return h.call(this.scope || this, e, this.menu);
	    },
	
	    up : function(e, m){
	        if(!m.tryActivate(m.items.indexOf(m.activeItem)-1, -1)){
	            m.tryActivate(m.items.length-1, -1);
	        }
	    },
	
	    down : function(e, m){
	        if(!m.tryActivate(m.items.indexOf(m.activeItem)+1, 1)){
	            m.tryActivate(0, 1);
	        }
	    },
	
	    right : function(e, m){
	        if(m.activeItem){
	            m.activeItem.expandMenu(true);
	        }
	    },
	
	    left : function(e, m){
	        m.hide();
	        if(m.parentMenu && m.parentMenu.activeItem){
	            m.parentMenu.activeItem.activate();
	        }
	    },
	
	    enter : function(e, m){
	        if(m.activeItem){
	            e.stopPropagation();
	            m.activeItem.onClick(e);
	            m.fireEvent("click", this, m.activeItem);
	            return true;
	        }
	    }
	});
	
	/*css

		.calendar {
			background-image:url(../../lib/Ext/resources/images/default/shared/calendar.gif) !important;
		}

		.blist {
			background-image: url(../../lib/Ext/resources/images/icons/gif/list-items.gif) !important;
		}
		
		.bmenu {
			background-image: url(../../lib/Ext/resources/images/icons/gif/menu-show.gif) !important;
		}
		
	 css*/	

}); //eof declare
