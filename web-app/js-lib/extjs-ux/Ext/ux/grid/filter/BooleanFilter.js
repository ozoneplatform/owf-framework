/** 
 * Boolean filters use unique radio group IDs (so you can have more than one!)
 * 
 * <br /><b>Example Usage:</b>
 * <pre><code>    
 var filters = new Ext.ux.grid.GridFilters({
     ...
     filters: [{
         type: 'boolean',
         defaultValue: null, //leave unselected (false selected by default)
         yesText: 'Yes', //default
         noText: 'No', //default
         dataIndex: 'visible'
     }]
 });
});</code></pre>
 * 
 * @class Ext.ux.grid.filter.BooleanFilter
 * @extends Ext.ux.grid.filter.Filter
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version 0.2.8 (Aug 22, 2008)
 */
Ext.ux.grid.filter.BooleanFilter = Ext.extend(Ext.ux.grid.filter.Filter, {
	/**
	 * @cfg {Boolean} defaultValue
	 * Set this to null if you do not want either option to be checked by default. Defaults to false.
	 */
	defaultValue: false,
	/**
	 * @cfg {String} yesText
	 * Defaults to "Yes".
	 */
	yesText: "Yes",
	/**
	 * @cfg {String} noText
	 * Defaults to "No".
	 */
	noText:  "No",

	/** @private */
	init: function(){
    var gId = Ext.id();
		this.options = [
			new Ext.menu.CheckItem({text: this.yesText, group: gId, checked: this.defaultValue === true}),
			new Ext.menu.CheckItem({text: this.noText, group: gId, checked: this.defaultValue === false})];
		
		this.menu.add(this.options[0], this.options[1]);
		
		for(var i=0; i<this.options.length; i++){
			this.options[i].on('click', this.fireUpdate, this);
			this.options[i].on('checkchange', this.fireUpdate, this);
		}
	},
	
	isActivatable: function(){
		return true;
	},
	
	fireUpdate: function(){		
		this.fireEvent("update", this);			
		this.setActive(true);
	},
	
	setValue: function(value){
		this.options[value ? 0 : 1].setChecked(true);
	},
	
	getValue: function(){
		return this.options[0].checked;
	},
	
	serialize: function(){
		var args = {type: 'boolean', value: this.getValue()};
		this.fireEvent('serialize', args, this);
		return args;
	},
	
	validateRecord: function(record){
		return record.get(this.dataIndex) == this.getValue();
	}
});