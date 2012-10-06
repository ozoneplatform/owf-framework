/** 
 * 
 * <br /><b>Example Usage:</b>
 * <pre><code>    
 var filters = new Ext.ux.grid.GridFilters({
     ...
     filters: [{
         type: 'string',
         dataIndex: 'name',
         icon: 'ux-gridfilter-text-icon' //default
     }]
 });
});</code></pre>
 * 
 * @class Ext.ux.grid.filter.StringFilter
 * @extends Ext.ux.grid.filter.Filter
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version 0.2.8 (Aug 22, 2008)
 */
Ext.ux.grid.filter.StringFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	/**
	 * @cfg {String} icon
	 * Defaults to 'ux-gridfilter-text-icon'.
	 */
	icon: 'ux-gridfilter-text-icon',
	
	/** @private */
	init: function(){
		var value = this.value = new Ext.ux.menu.EditableItem({iconCls: this.icon});
		value.on('keyup', this.onKeyUp, this);
		this.menu.add(value);
		
		this.updateTask = new Ext.util.DelayedTask(this.fireUpdate, this);
	},
	
	/** @private */
	onKeyUp: function(event){
		if(event.getKey() == event.ENTER){
			this.menu.hide(true);
			return;
		}
			
		this.updateTask.delay(this.updateBuffer);
	},
	
	isActivatable: function(){
		return this.value.getValue().length > 0;
	},
	
	/** @private */
	fireUpdate: function(){		
		if(this.active)
			this.fireEvent("update", this);
			
		this.setActive(this.isActivatable());
	},
	
	setValue: function(value){
		this.value.setValue(value);
		this.fireEvent("update", this);
	},
	
	getValue: function(){
		return this.value.getValue();
	},
	
	serialize: function(){
		var args = {type: 'string', value: this.getValue()};
		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record){
		var val = record.get(this.dataIndex);
		
		if(typeof val != "string")
			return this.getValue().length == 0;
			
		return val.toLowerCase().indexOf(this.getValue().toLowerCase()) > -1;
	}
});