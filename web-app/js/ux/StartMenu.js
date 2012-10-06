Ext.namespace("Ozone.ux");

Ozone.ux.StartMenu = function(config){
	Ozone.ux.StartMenu.superclass.constructor.call(this, config);
    
    var tools = this.toolItems;
    this.toolItems = new Ext.util.MixedCollection();
    if(tools){
        this.addTool.apply(this, tools);
    }
};

Ext.extend(Ozone.ux.StartMenu, Ext.menu.Menu, {
    // private
    render : function(){
        if(this.el){
            return;
        }
        var el = this.el = new Ext.Layer({
            cls: "x-menu ux-start-menu", // this might affect item click
            shadow:this.shadow,
            constrain: false,
            parentEl: this.parentEl || document.body,
            zindex:15000
        });
        
        var header = el.createChild({
        	tag: "div",
        	cls: "x-window-header x-unselectable x-panel-icon "+this.iconCls
        });
		this.header = header;
		var headerText = header.createChild({
			tag: "span",
			cls: "x-window-header-text"
		});
		var tl = header.wrap({
			cls: "ux-start-menu-tl"
		});
		var tr = header.wrap({
			cls: "ux-start-menu-tr"
		});
		var tc = header.wrap({
			cls: "ux-start-menu-tc"
		});
		
		this.menuBWrap = el.createChild({
			tag: "div",
			cls: "x-window-body x-border-layout-ct ux-start-menu-body"
		});
		var ml = this.menuBWrap.wrap({
			cls: "ux-start-menu-ml"
		});
		var mc = this.menuBWrap.wrap({
			cls: "x-window-mc ux-start-menu-bwrap"
		});
		
		this.toolsPanel = this.menuBWrap.createChild({
			tag: "div",
			cls: "x-panel x-border-panel ux-start-menu-tools-panel"
		});
		
		var bwrap = ml.wrap({cls: "x-window-bwrap"});
		var bc = bwrap.createChild({
			tag: "div",
			cls: "ux-start-menu-bc"
		});
		var bl = bc.wrap({
			cls: "ux-start-menu-bl x-panel-nofooter"
		});
		var br = bc.wrap({
			cls: "ux-start-menu-br"
		});
		
        this.keyNav = new Ext.menu.MenuNav(this);

        if(this.plain){
            el.addCls("x-menu-plain");
        }
        if(this.cls){
            el.addCls(this.cls);
        }
        // generic focus element
        this.focusEl = el.createChild({
            tag: "a",
            cls: "x-menu-focus",
            href: "#",
            onclick: "return false;",
            tabIndex:"-1"
        });
        
        var toolsUl = this.toolsPanel.createChild({
        	tag: "ul",
        	cls: "x-menu-list"
        });
        
        var ulListeners = {
        	"click": {
        		fn: this.onClick,
        		scope: this
        	},
        	"mouseover": {
        		fn: this.onMouseOver,
        		scope: this
        	},
        	"mouseout": {
        		fn: this.onMouseOut,
        		scope: this
        	}
        };
        
        toolsUl.on(ulListeners);
        
        this.toolItems.each(
        	function(item){
	            var li = document.createElement("li");
	            li.className = "x-menu-list-item";
	            toolsUl.dom.appendChild(li);
	            item.render(li, this);
	        }, this);
	        
        this.toolsUl = toolsUl;
             
        this.menuBWrap.setStyle('position', 'relative');  
        this.menuBWrap.setHeight(this.height);
        
        this.toolsPanel.setStyle({
        	padding: '2px 4px 2px 2px',
        	position: 'absolute',
        	overflow: 'visible'
        });
        
        this.setTitle(this.title);

        // Set menu size to longest string plus 16 for padding
        var toolsWidth = this.toolsPanel.getWidth();
        var headerWidth = this.header.getWidth();
        var newWidth = headerWidth;

        if (Ext.isIE) {
        	toolsWidth = this.toolsUl.getWidth();
        	headerWidth = this.header.getTextWidth();
        }

        if (headerWidth < toolsWidth) {
        	newWidth = toolsWidth;
        }

        this.toolsUl.setWidth(newWidth);
        this.el.setWidth(newWidth + 16);        	
    },
    
    // private
    findTargetItem : function(e){
        var t = e.getTarget(".x-menu-list-item", this.ul,  true);
        if(t && t.menuItemId){
        	if(this.items.get(t.menuItemId)){
            	return this.items.get(t.menuItemId);
            }else{
            	return this.toolItems.get(t.menuItemId);
            }
        }
    },

    /**
     * Displays this menu relative to another element
     * @param {Mixed} element The element to align to
     * @param {String} position (optional) The {@link Ext.Element#alignTo} anchor position to use in aligning to
     * the element (defaults to this.defaultAlign)
     * @param {Ozone.ux.StartMenu} parentMenu (optional) This menu's parent menu, if applicable (defaults to undefined)
     */
    show : function(el, pos, parentMenu){
        this.parentMenu = parentMenu;
        if(!this.el){
            this.render();
        }

        this.fireEvent("beforeshow", this);
        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign), parentMenu, false);
        
        var box = this.menuBWrap.getBox();
        
        this.toolsPanel.setX(box.x);
        this.toolsPanel.setHeight(box.height);
    },
    
    addTool : function(){
        var a = arguments, l = a.length, item;
        for(var i = 0; i < l; i++){
            var el = a[i];
            if(el.render){ // some kind of Item
                item = this.addToolItem(el);
            }else if(typeof el == "string"){ // string
                if(el == "separator" || el == "-"){
                    item = this.addToolSeparator();
                }else{
                    item = this.addText(el);
                }
            }else if(el.tagName || el.el){ // element
                item = this.addElement(el);
            }else if(typeof el == "object"){ // must be menu item config?
                item = this.addToolMenuItem(el);
            }
        }
        return item;
    },
    
    /**
     * Adds a separator bar to the Tools
     * @return {Ext.menu.Item} The menu item that was added
     */
    addToolSeparator : function(){
        return this.addToolItem(new Ext.menu.Separator({itemCls: 'ux-toolmenu-sep'}));
    },

    addToolItem : function(item){
        this.toolItems.add(item);
        if(this.ul){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            this.ul.dom.appendChild(li);
            item.render(li, this);
            this.delayAutoWidth();
        }
        return item;
    },

    addToolMenuItem : function(config){
        if(!(config instanceof Ext.menu.Item)){
            if(typeof config.checked == "boolean"){ // must be check menu item config?
                config = new Ext.menu.CheckItem(config);
            }else{
                config = new Ext.menu.Item(config);
            }
        }
        return this.addToolItem(config);
    },
    
    setTitle : function(title, iconCls){
        this.title = title;
        this.header.child('span').update(title);
        return this;
    }
});