Ext.namespace("Ext.ux.menu");
Ext.ux.menu.ListMenu = function(cfg){
	this.addEvents('checkchanged');
	Ext.ux.menu.ListMenu.superclass.constructor.call(this, cfg = cfg || {});

	if(!cfg.store && cfg.options){
		var options = [];
		for(var i=0, len=cfg.options.length; i<len; i++){
			var value = cfg.options[i];
			switch(Ext.type(value)){
				case 'array':  options.push(value); break;
				case 'object': options.push([value.id, value[this.labelField]]); break;
				case 'string': options.push([value, value]); break;
			}
		}
		
		this.store = new Ext.data.Store({
			reader: new Ext.data.ArrayReader({id: 0}, ['id', this.labelField]),
			data:   options,
			listeners: {
				'load': this.onLoad,
				scope:  this
			}
		});
		this.loaded = true;
	} else {
		this.add({text: this.loadingText, iconCls: 'loading-indicator'});
		this.store.on('load', this.onLoad, this);
	}
};


/** 
 * @class Ext.ux.menu.ListMenu
 * @extends Ext.menu.Menu
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version X
 */
Ext.extend(Ext.ux.menu.ListMenu, Ext.menu.Menu, {
	/**
	 * @cfg {String} labelField
	 * Defaults to 'text'.
	 */
	labelField:  'text',
	/**
	 * @cfg {String} paramPrefix
	 * Defaults to 'Loading...'.
	 */
	loadingText: 'Loading...',
	/**
	 * @cfg {Boolean} loadOnShow
	 * Defaults to true.
	 */
	loadOnShow:  true,
	/**
	 * @cfg {Boolean} single
	 * Defaults to false.
	 */
	single:      false,

	/** @private */
	selected:    [],
	
	/**
	 * Lists will initially show a 'loading' item while the data is retrieved from the store. In some cases the
	 * loaded data will result in a list that goes off the screen to the right (as placement calculations were done
	 * with the loading item). This adapter will allow show to be called with no arguments to show with the previous
	 * arguments and thus recalculate the width and potentially hang the menu from the left.
	 */
	show: function(){
		var lastArgs = null;
		return function(){
			if(arguments.length == 0){
				Ext.ux.menu.ListMenu.superclass.show.apply(this, lastArgs);
			} else {
				lastArgs = arguments;
				if(this.loadOnShow && !this.loaded) this.store.load();
				Ext.ux.menu.ListMenu.superclass.show.apply(this, arguments);
			}
		};
	}(),
	
	/** @private */
	onLoad: function(store, records){
		var visible = this.isVisible();
		this.hide(false);
		
		this.removeAll();
		
		var gid = this.single ? Ext.id() : null;
		for(var i=0, len=records.length; i<len; i++){
			var item = new Ext.menu.CheckItem({
				text:    records[i].get(this.labelField), 
				group:   gid,
				checked: this.selected.indexOf(records[i].id) > -1,
				hideOnClick: false});
			
			item.itemId = records[i].id;
			item.on('checkchange', this.checkChange, this);
						
			this.add(item);
		}
		
		this.loaded = true;
		
		if(visible)
			this.show();
			
		this.fireEvent('load', this, records);
	},
	
	/** @private */
	setSelected: function(value){
		var value = this.selected = [].concat(value);

		if(this.loaded)
			this.items.each(function(item){
				item.setChecked(false, true);
				for(var i=0, len=value.length; i<len; i++)
					if(item.itemId == value[i]) 
						item.setChecked(true, true);
			}, this);
	},
	
    /**
     * 
     * @param {Object} item
     * @param {Object} checked
     * @return {void}
     */
	checkChange: function(item, checked){
		var value = [];
		this.items.each(function(item){
			if(item.checked)
				value.push(item.itemId);
		},this);
		this.selected = value;
		
		this.fireEvent("checkchange", item, checked);
	},
	
    /**
     * @return {array} selected
     */
	getSelected: function(){
		return this.selected;
	}
});