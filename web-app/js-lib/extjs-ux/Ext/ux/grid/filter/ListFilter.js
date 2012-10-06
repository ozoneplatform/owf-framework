/** 
 * List filters are able to be preloaded/backed by an Ext.data.Store to load their options the first time they are shown.
 * ListFilter has been refactored to use a new Ext.ux.menu.ListMenu component
 * 
 * <br /><b>Example Usage:</b>
 * <pre><code>    
 var filters = new Ext.ux.grid.GridFilters({
     ...
     filters: [{
         type: 'list',
         dataIndex: 'size',
         options: ['extra small', 'small', 'medium', 'large', 'extra large'],
         phpMode: true
     }]
 });
});</code></pre>
 * 
 * @class Ext.ux.grid.filter.ListFilter
 * @extends Ext.ux.grid.filter.Filter
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version 0.2.8 (Aug 22, 2008)
 */
Ext.ux.grid.filter.ListFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	/**
	 * @cfg {Boolean} phpMode
	 * Defaults to false.
	 */
	phpMode:     false,
	
	/** @private */
	init: function(config){
		this.dt = new Ext.util.DelayedTask(this.fireUpdate, this);

		this.menu = new Ext.ux.menu.ListMenu(config);
		this.menu.on('checkchange', this.onCheckChange, this);
	},
	
	/** @private */
	onCheckChange: function(){
		this.dt.delay(this.updateBuffer);
	},
	
	isActivatable: function(){
		return this.menu.getSelected().length > 0;
	},
	
	setValue: function(value){
		this.menu.setSelected(value);
			
		this.fireEvent("update", this);
	},
	
	getValue: function(){
		return this.menu.getSelected();
	},
	
	serialize: function(){
	    var args = {type: 'list', value: this.phpMode ? this.getValue().join(',') : this.getValue()};
	    this.fireEvent('serialize', args, this);
		
		return args;
	},
	
	validateRecord: function(record){
		return this.getValue().indexOf(record.get(this.dataIndex)) > -1;
	}
});