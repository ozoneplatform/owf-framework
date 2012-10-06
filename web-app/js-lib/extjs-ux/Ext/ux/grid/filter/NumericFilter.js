/** 
 * <br /><b>Example Usage:</b>
 * <pre><code>    
 var filters = new Ext.ux.grid.GridFilters({
     ...
     filters: [{
         type: 'numeric',
         dataIndex: 'price'
     }]
 });
});</code></pre>
 * 
 * @class Ext.ux.grid.filter.NumericFilter
 * @extends Ext.ux.grid.filter.Filter
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version 0.2.8 (Aug 22, 2008)
 */
Ext.ux.grid.filter.NumericFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	/** @private */
	init: function(){
		this.menu = new Ext.ux.menu.RangeMenu({updateBuffer: this.updateBuffer});
		
		this.menu.on("update", this.fireUpdate, this);
	},
	
	/** @private */
	fireUpdate: function(){
		this.setActive(this.isActivatable());
		this.fireEvent("update", this);
	},
	
	isActivatable: function(){
		var value = this.menu.getValue();
		return value.eq !== undefined || value.gt !== undefined || value.lt !== undefined;
	},
	
	setValue: function(value){
		this.menu.setValue(value);
	},
	
	getValue: function(){
		return this.menu.getValue();
	},
	
	serialize: function(){
		var args = [];
		var values = this.menu.getValue();
		for(var key in values)
			args.push({type: 'numeric', comparison: key, value: values[key]});

		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record){
		var val    = record.get(this.dataIndex),
			values = this.menu.getValue();
			
		if(values.eq != undefined && val != values.eq)
			return false;
		
		if(values.lt != undefined && val >= values.lt)
			return false;
		
		if(values.gt != undefined && val <= values.gt)
			return false;
			
		return true;
	}
});