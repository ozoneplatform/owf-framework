Ext.namespace("Ext.ux.menu");
/** 
 * @class Ext.ux.menu.EditableItem
 * @extends Ext.menu.BaseItem
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version X
 */
Ext.ux.menu.EditableItem = Ext.extend(Ext.menu.BaseItem, {
	/**
	 * @cfg {String} itemCls
	 * css class entered as a string. Defaults to 'x-menu-item.
	 */
    itemCls : "x-menu-item",
	/**
	 * @cfg {Boolean} hideOnClick
	 * Defaults to false.
	 */
    hideOnClick: false,
    
	/** @private */
    initComponent: function(){
    	this.addEvents({keyup: true});
		this.editor = this.editor || new Ext.form.TextField();
		if(this.text)
			this.editor.setValue(this.text);
    },
    
	/** @private */
    onRender: function(container){
        var s = container.createChild({
        	cls: this.itemCls,
        	html: '<img src="' + (this.icon||Ext.BLANK_IMAGE_URL)+ '" class="x-menu-item-icon'+(this.iconCls?' '+this.iconCls:'')+'" style="margin: 3px 7px 2px 2px;" />'});
        
        Ext.apply(this.config, {width: 125});
        this.editor.render(s);
        
        this.el = s;
        this.relayEvents(this.editor.el, ["keyup"]);
		
		this.el.swallowEvent(['keydown','keypress']);
        Ext.each(["keydown", "keypress"], function (eventName) {
			this.el.on(eventName, function (e) {
				if (e.isNavKeyPress())
				  e.stopPropagation();
			}, this);
        }, this);
        
        if(Ext.isGecko) {
            s.setOverflow('auto');
            var containerSize = container.getSize();
            this.editor.getEl().setStyle('position', 'fixed');
            container.setSize(containerSize);
        }
			
        Ext.ux.menu.EditableItem.superclass.onRender.apply(this, arguments);
    },
    
    getValue: function(){
    	return this.editor.getValue();
    },
    
    setValue: function(value){
    	this.editor.setValue(value);
    },
    
    /**
     * 
     * @param {Object} preventMark
     */
    isValid: function(preventMark){
    	return this.editor.isValid(preventMark);
    }
});