Ext.namespace("Ext.ux.menu");
Ext.ux.menu.RangeMenu = function(){
	Ext.ux.menu.RangeMenu.superclass.constructor.apply(this, arguments);
	this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);

	var cfg = this.fieldCfg;
	var cls = this.fieldCls;
	var fields = this.fields = Ext.applyIf(this.fields || {}, {
		'gt': new Ext.ux.menu.EditableItem({
			iconCls:  this.icons.gt,
			editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)}),
		'lt': new Ext.ux.menu.EditableItem({
			iconCls:  this.icons.lt,
			editor: new cls(typeof cfg == "object" ? cfg.lt || '' : cfg)}),
		'eq': new Ext.ux.menu.EditableItem({
			iconCls:   this.icons.eq, 
			editor: new cls(typeof cfg == "object" ? cfg.gt || '' : cfg)})
	});
	this.add(fields.gt, fields.lt, '-', fields.eq);
	
	for(var key in fields)
		fields[key].on('keyup', function(event, input, notSure, field){
			if(event.getKey() == event.ENTER && field.isValid()){
				this.hide(true);
				return;
			}
			
			if(field == fields.eq){
				fields.gt.setValue(null);
				fields.lt.setValue(null);
			} else {
				fields.eq.setValue(null);
			}
			
			this.updateTask.delay(this.updateBuffer);
		}.createDelegate(this, [fields[key]], true));

	this.addEvents(
		/**
		 * Fires when a filter configuration has changed
		 * @event update
		 * @param {Ext.ux.grid.filter.Filter} this
		 */
		'update'
	);
};
/**
 * <br /><b>Example Usage:</b>
 * <pre><code>    
   var rangeMenu = new Ext.menu.RangeMenu({
      listeners: {
        //subscribe to update event
        update: function(menu) {
          Ext.example.msg('range selected');
        }
      }
    });
    
    var menu = new Ext.menu.Menu({
        id: 'mainMenu',
        items: [
            {
                text: 'Choose a range',
                menu: rangeMenu
            }
        ]
    });

    var tb = new Ext.Toolbar();
    tb.render('toolbar');
    tb.add({text:'Button w/ Menu', iconCls: 'bmenu', menu: menu});
 *</code></pre>
 * @class Ext.ux.menu.RangeMenu
 * @extends Ext.menu.Menu
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version 0.1
 */
 Ext.extend(Ext.ux.menu.RangeMenu, Ext.menu.Menu, {
	/**
	 * @cfg {Object} fieldCls
	 * Defaults to Ext.form.NumberField.
	 */
	fieldCls:     Ext.form.NumberField,
	/**
	 * @cfg {String} fieldCfg
	 * Defaults to ''.
	 */
 	fieldCfg:     '',
	/**
	 * @cfg {Number} updateBuffer
	 * Not used?
	 */
	updateBuffer: 500,
	/**
	 * @cfg {Object} icons
	 * Object literal associating each filter type to a css class entered as a string. Defaults to {gt: 'ux-rangemenu-gt',
	 * lt: 'ux-rangemenu-lt', eq: 'ux-rangemenu-eq'}.  May also specify individually as icons.gt, icons.lt, icons.eq.
	 */
	icons: {
		gt: 'ux-rangemenu-gt', 
		lt: 'ux-rangemenu-lt',
		eq: 'ux-rangemenu-eq'},
		
	/** @private */
	fireUpdate: function(){
		this.fireEvent("update", this);
	},
	
	setValue: function(data){
		for(var key in this.fields)
			this.fields[key].setValue(data[key] !== undefined ? data[key] : '');
		
		this.fireEvent("update", this);
	},
	
	getValue: function(){
		var result = {};
		for(var key in this.fields){
			var field = this.fields[key];
			if(field.isValid() && String(field.getValue()).length > 0)
				result[key] = field.getValue();
		}
		
		return result;
	}
});