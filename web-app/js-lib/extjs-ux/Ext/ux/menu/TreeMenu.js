Ext.namespace('Ext.ux.menu');
Ext.ux.menu.TreeMenu = function(cfg){
	Ext.ux.menu.TreeMenu.superclass.constructor.call(this, {
		plain: false,
		items: [new Ext.ux.menu.TreeMenuItem(cfg)],
		cls: 'ux-tree-menu'
	});
	this.relayEvents(this.items.get(0), ["select", "search"]);
	this.tree = cfg.tree;
};
/** 
 * @class Ext.ux.menu.TreeMenu
 * @extends Ext.menu.Menu
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version X
 */
Ext.extend(Ext.ux.menu.TreeMenu, Ext.menu.Menu);

Ext.ux.menu.TreeMenuItem = function(cfg){
	/**
	 * Fires when ....
	 * @event select
	 * @param {} node.id
	 * @param {} node
	 */
	this.addEvents({select: true, search: true});
	Ext.ux.menu.TreeMenu.superclass.constructor.call(this, cfg);
	
	this.qTask = new Ext.util.DelayedTask(this.doQuery, this);
	this.searchBox = new Ext.form.TextField({
		cls: 'ux-tree-menu-search',
		emptyText: this.emptyText
	});
	
	this.tree.getSelectionModel().on('selectionchange', this.onSelect, this);
};


/** 
 * @class Ext.ux.menu.TreeMenuItem
 * @extends Ext.menu.BaseItem
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version X
 */
Ext.extend(Ext.ux.menu.TreeMenuItem, Ext.menu.BaseItem, {
	minHeight:   240,
	minWidth:    200,
	hideOnClick: false,
	/**
	 * @cfg {Integer} searchDelay
	 * Amount of time in miliseconds to wait before invoking the searchFn after the content of the search box is changed.
	 */
	searchDelay: 500,
	/**
	 * @cfg {Ext.tree.TreePanel} tree
	 * The tree to be encapsulated by the TreeMenu
	 */
	tree:        undefined,
	/**
	 * @cfg {Function} searchFn
	 * The function to call to search the tree. If not set, the search field will be hidden. The method signature should be compatable with:
	 * <code>fn({String} queryString, {Function} callback)</code>
	 */
	searchFn: undefined,
	emptyText: 'Search...',
	handelOffset: 3,
	
	/** @private */
    onRender : function(container){
        var el = this.el = container.createChild({
			cls:      'ux-tree-menu-wrap',
			children: [{cls: 'ux-tree-menu-search-icon'}]
		});
		
		if(this.searchFn){
			this.searchBox.render(el);
			this.searchBox.getEl().setStyle('margin-bottom', '3px');
			this.searchBox.el.on('keyup', function(){this.qTask.delay(this.searchDelay);}, this);
		}	
		
		this.tree.autoScroll = true;
		this.tree.render(el);
		
		var resizer = new Ext.Resizable(el, {
			pinned:true, 
			handles:'se',
			listeners: {
				'resize': function(rsz, w, h){
					this.resize(w, h);
					this.parentMenu.autoWidth();
					this.parentMenu.el.show();
				},
				scope: this
			}
		});
		this.resize(this.minWidth, this.minHeight);
		
		if(this.searchFn)
			this.doQuery();
	},
	
	onSelect: function(model, node){
		this.fireEvent('select', node.id, node);
	},
	
	doQuery: function(callback){
		var value = this.searchBox.getValue();
		
		this.searchFn(value.length > 0 ? value : null, callback);
			
		this.fireEvent('search', value);
	},
	
	resize: function(w, h){
		var search    = this.searchBox.getEl();
			padding   = this.el.getFrameWidth('tb'),
			searchOff = 0;
		
		if(search){
			search.setWidth(w - this.el.getFrameWidth('lr'));
			searchOff = search.getHeight();
		}
		this.tree.setWidth(w);
		this.tree.setHeight(h - searchOff - padding - this.handelOffset);
	}
});