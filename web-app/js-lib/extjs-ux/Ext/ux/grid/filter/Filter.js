Ext.namespace("Ext.ux.grid.filter");
/** 
 * @class Ext.ux.grid.filter.Filter
 * @extends Ext.util.Observable
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version 0.2.8 (Aug 22, 2008)
 */
Ext.ux.grid.filter.Filter = function(config){
	Ext.apply(this, config);
		
	this.addEvents(
		/**
		 * Fires when an inactive filter becomes active
		 * @event activate
		 * @param {Ext.ux.grid.filter.Filter} this
		 */
		'activate',
		/**
		 * Fires when an active filter becomes inactive
		 * @event deactivate
		 * @param {Ext.ux.grid.filter.Filter} this
		 */
		'deactivate',
		/**
		 * Fires after the serialization process. Use this to attach additional parameters to serialization
		 * data before it is encoded and sent to the server.
		 * @event serialize
		 * @param {Array/Object} data A map or collection of maps representing the current filter configuration.
		 * @param {Ext.ux.grid.filter.Filter} filter The filter being serialized.
		 */
		'serialize',
		/**
		 * Fires when a filter configuration has changed
		 * @event update
		 * @param {Ext.ux.grid.filter.Filter} this
		 */
		'update'
	);
	Ext.ux.grid.filter.Filter.superclass.constructor.call(this);
	
	this.menu = new Ext.menu.Menu();
	this.init(config);
	
	if(config && config.value){
		this.setValue(config.value);
		this.setActive(config.active !== false, true);
		delete config.value;
	}
};
/** @private */
Ext.extend(Ext.ux.grid.filter.Filter, Ext.util.Observable, {
	/**
	 * @cfg {Boolean} active
	 * Indicates the default status of the filter (defaults to false).
	 */
    /**
     * True if this filter is active.  Use setActive() to alter after configuration.
     * @type Boolean
     * @property
     */
	active: false,
	/**
	 * @cfg {String} dataIndex 
	 * The {@link Ext.data.Store} data index of the field this filter represents. The dataIndex
	 * does not actually have to exist in the store.
	 */
	dataIndex: null,
	/**
	 * The filter configuration menu that will be installed into the filter submenu of a column menu.
	 * @type Ext.menu.Menu
	 * @property
	 */
	menu: null,
	
	/**
	 * @cfg {Number} updateBuffer
	 * Number of milliseconds to wait after user interaction to fire an update. Only supported 
	 * by filters: 'list', 'numeric', and 'string'. Defaults to 500.
	 */
	updateBuffer: 500,
	
	/**
	 * Initialize the filter and install required menu items.
	 */
	/** @private */
	init: Ext.emptyFn,
	
	/** @private */
	fireUpdate: function(){
		if(this.active)
			this.fireEvent("update", this);
			
		this.setActive(this.isActivatable());
	},
	
	/**
	 * Returns true if the filter has enough configuration information to be activated.
	 * @return {Boolean}
	 */
	isActivatable: function(){
		return true;
	},
	
	/**
	 * Sets the status of the filter and fires the appropriate events.
	 * @param {Boolean} active        The new filter state.
	 * @param {Boolean} suppressEvent True to prevent events from being fired.
	 * @methodOf Ext.ux.grid.filter.Filter
	 */
	setActive: function(active, suppressEvent){
		if(this.active != active){
			this.active = active;
			if(suppressEvent !== true)
				this.fireEvent(active ? 'activate' : 'deactivate', this);
		}
	},
	
	/**
	 * Get the value of the filter
	 * @return {Object} The 'serialized' form of this filter
	 * @methodOf Ext.ux.grid.filter.Filter
	 */
	getValue: Ext.emptyFn,
	
	/**
	 * Set the value of the filter.
	 * @param {Object} data The value of the filter
	 * @methodOf Ext.ux.grid.filter.Filter
	 */	
	setValue: Ext.emptyFn,
	
	/**
	 * Serialize the filter data for transmission to the server.
	 * @return {Object/Array} An object or collection of objects containing key value pairs representing
	 * 	the current configuration of the filter.
	 * @methodOf Ext.ux.grid.filter.Filter
	 */
	serialize: Ext.emptyFn,
	
	/**
	 * Validates the provided Ext.data.Record against the filters configuration.
	 * @param {Ext.data.Record} record The record to validate
	 * @return {Boolean} True if the record is valid with in the bounds of the filter, false otherwise.
	 */
	 validateRecord: function(){return true;}
});