Ext.namespace("Ext.ux.grid");
Ext.ux.grid.GridFilters = function(config){		
	this.filters = new Ext.util.MixedCollection();
	this.filters.getKey = function(o){return o ? o.dataIndex : null};
	
	for(var i=0, len=config.filters.length; i<len; i++)
		this.addFilter(config.filters[i]);
	
	this.deferredUpdate = new Ext.util.DelayedTask(this.reload, this);
	
	delete config.filters;
	Ext.apply(this, config);
};
/**
 * <p>GridFilter is a plug-in for grids that allow for a slightly more robust representation of filtering than what is 
 * provided by the default store.</p>
 * <p><b>Feature List:</b></p>
 * <ul>
 * <li>+ Packaged with filters for Strings, Numeric Ranges, Date Ranges, Lists (which can be backed by a Ext.data.Store), and Boolean</li>
 * <li>+ Additional custom filter types and menus are easily created by extending Ext.ux.grid.filter.Filter.</li>
 * <li>+ Optional local store filtering</li>
 * <li>+ Customizable parameter serialization.</li>
 * <li>+ If specified as a plugin to the grid's configured PagingToolbar, the current page will be reset to page 1 whenever you update the filters.</li>
 * <li>+ Grid configuration information can be persisted across page loads by passing a string value for the config option 'stateId'.</li>
 * <li>+ Filters can be configured in the grid's column header menu (this menu can be disabled through configuration). Through this menu users can configure, enable, and disable filters for each column. There has been some criticism by a few developers who feel that the filter configuration should be done in a single panel / window. However, the API does not preclude some one else writing a different interface entirely, but no one has taken up the call as of yet =)
 * <li>+ Fully event driven</li>
 * <li>++ The filter collection binds to the 'beforestaterestore' and 'beforestatesave' events in order to be stateful. Set your stateId on the associated grid.</li>
 * <li>++ A filterupdate event is added to the grid and is fired upon onStateChange completion.</li>
 * <li>+ Columns that are filtered have a configurable css class applied to the column headers.</li>
 * <li>++ Green tinted column header graphics and CSS classes for filtered columns </li>
 * <li>+ <a href="http://extjs.com/forum/showthread.php?p=149052#post149052">Localization support</a></li>
 * <li>+ EditableItem to has improved icon support</li>
 * <li>+ Icons are now all defined as styles in the resources/style.css file. You'll need to link to this in order to have them and get the new column header style. (no more need for prototype changes) </li>
 * </ul>
 * <br /><b>Example Usage:</b>
 * <pre><code>    
 var ds = new Ext.data.GroupingStore({
     ...
 });
 
 var filters = new Ext.ux.grid.GridFilters({
     autoReload: false, //don't reload automatically
     local: true,  //only filter locally
     filters: [{
        type: 'numeric',
         dataIndex: 'id'
     }, {
         type: 'string',
         dataIndex: 'name'
     }, {
         type: 'numeric',
         dataIndex: 'price'
     }, {
         type: 'date',
         dataIndex: 'dateAdded'
     }, {
         type: 'list',
         dataIndex: 'size',
         options: ['extra small', 'small', 'medium', 'large', 'extra large'],
         phpMode: true
     }, {
         type: 'boolean',
         dataIndex: 'visible'
     }]
 });
 
 var cm = new Ext.grid.ColumnModel([{
     ...
 }]);
 
 var grid = new Ext.grid.GridPanel({
     ds: ds,
     cm: cm,
     view: new Ext.grid.GroupingView(),
     plugins: filters,
     height: 400,
     width: 700,
     bbar: new Ext.PagingToolbar({
         store: ds,
         pageSize: 15,
         plugins: filters //reset page to page 1 if filters change
     })
 });
 grid.render();
 ds.load({params: {start: 0, limit: 15}});
});</code></pre>
 * <br /><b>Server side code examples:</b>
 * <ul>
 * <li><a href="http://www.vinylfox.com/extjs/grid-filter-php-backend-code.php">PHP</a> - (Thanks VinylFox)</li>
 * <li><a href="http://extjs.com/forum/showthread.php?p=77326#post77326">Ruby on Rails</a> - (Thanks Zyclops)</li>
 * <li><a href="http://extjs.com/forum/showthread.php?p=176596#post176596">Ruby on Rails</a> - (Thanks Rotomaul)</li>
 * <li><a href="http://www.debatablybeta.com/posts/using-extjss-grid-filtering-with-django/">Python</a> - (Thanks Matt)</li>
 * <li><a href="http://mcantrell.wordpress.com/2008/08/22/extjs-grids-and-grails/">Grails</a> - (Thanks Mike)</li>
 * </ul>
 * @class Ext.ux.grid.GridFilters
 * @extends Ext.util.Observable
 * @author Steve Skrla (<a href="http://extjs.com/forum/member.php?u=865">ambience</a>); published: Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>)
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission. 
 * @version 0.2.9 (Sep 2, 2008)
 */
Ext.extend(Ext.ux.grid.GridFilters, Ext.util.Observable, {
	/**
	 * @cfg {Array} filters
	 * An Array of filters config objects. Refer to each filter type class for configuration details specific to each filter type.
	 * Filters for Strings, Numeric Ranges, Date Ranges, Lists, and Boolean are the standard filters available.</li>
	 */
	/**
	 * @cfg {Integer} updateBuffer
	 * Number of milliseconds to defer store updates since the last filter change.
	 */
	updateBuffer: 500,
	/**
	 * @cfg {String} paramPrefix
	 * The url parameter prefix for the filters.
	 */
	paramPrefix: 'filter',
	/**
	 * @cfg {String} fitlerCls
	 * The css class to be applied to column headers that active filters. Defaults to 'ux-filterd-column'
	 */
	filterCls: 'ux-filtered-column',
	/**
	 * @cfg {Boolean} local
	 * True to use Ext.data.Store filter functions (local filtering) instead of server side filtering.
	 */
	local: false,
	/**
	 * @cfg {Boolean} autoReload
	 * Defaults to true. Set this to false if you wish to prevent the datastore from being reloaded when
	 * you make changes to the filters. True will automagicly reload the datasource when a filter change happens. 
	 */
	autoReload: true,
	/**
	 * @cfg {String} stateId
	 * Name of the Ext.data.Store value to be used to store state information.
	 */
	stateId: undefined,
	/**
	 * @cfg {Boolean} showMenu
	 * Defaults to true, including a filter submenu in the default header menu.
	 */
	showMenu: true,
	/**
	 * @cfg {String} menuFilterText
	 * defaults to 'Filters'.
	 */
	menuFilterText: 'Filters',

	/** @private */
	init: function(grid){
		if(grid instanceof Ext.grid.GridPanel){
			this.grid  = grid;
		  
			this.store = this.grid.getStore();
			if(this.local){
				this.store.on('load', function(store){
					store.filterBy(this.getRecordFilter());
				}, this);
			} else {
			  this.store.on('beforeload', this.onBeforeLoad, this);
			}
			  
			this.grid.filters = this;
			 
			this.grid.addEvents({"filterupdate": true});
			  
			grid.on("render", this.onRender, this);
			  
			grid.on("beforestaterestore", this.applyState, this);
			grid.on("beforestatesave", this.saveState, this);
					  
		} else if(grid instanceof Ext.PagingToolbar){
		  this.toolbar = grid;
		}
	},
		
	/** @private */
	applyState: function(grid, state){
		this.applyingState = true;
		this.clearFilters();
		if(state.filters)
			for(var key in state.filters){
				var filter = this.filters.get(key);
				if(filter){
					filter.setValue(state.filters[key]);
					filter.setActive(true);
				}
			}
			
		this.deferredUpdate.cancel();
		if(this.local)
			this.reload();
			
		delete this.applyingState;
	},
	
	/** @private */
	saveState: function(grid, state){
		var filters = {};
		this.filters.each(function(filter){
			if(filter.active)
				filters[filter.dataIndex] = filter.getValue();
		});
		return state.filters = filters;
	},
	
	/** @private */
	onRender: function(){
		var hmenu;
		
		if(this.showMenu){
			hmenu = this.grid.getView().hmenu;
			
			this.sep  = hmenu.addSeparator();
			this.menu = hmenu.add(new Ext.menu.CheckItem({
					text: this.menuFilterText,
					menu: new Ext.menu.Menu()
				}));
			this.menu.on('checkchange', this.onCheckChange, this);
			this.menu.on('beforecheckchange', this.onBeforeCheck, this);
				
			hmenu.on('beforeshow', this.onMenu, this);
		}
		
		this.grid.getView().on("refresh", this.onRefresh, this);
		this.updateColumnHeadings(this.grid.getView());
	},
	
	/** @private */
	onMenu: function(filterMenu){
		var filter = this.getMenuFilter();
		if(filter){
			this.menu.menu = filter.menu;
			this.menu.setChecked(filter.active, false);
		}
		
		this.menu.setVisible(filter !== undefined);
		this.sep.setVisible(filter !== undefined);
	},
	
	/** @private */
	onCheckChange: function(item, value){
		this.getMenuFilter().setActive(value);
	},
	
	/** @private */
	onBeforeCheck: function(check, value){
		return !value || this.getMenuFilter().isActivatable();
	},
	
	/** @private */
	onStateChange: function(event, filter){
    	if(event == "serialize") return;
    
		if(filter == this.getMenuFilter())
			this.menu.setChecked(filter.active, false);
			
		if((this.autoReload || this.local) && !this.applyingState)
			this.deferredUpdate.delay(this.updateBuffer);
		
		var view = this.grid.getView();
		this.updateColumnHeadings(view);
			
		if(!this.applyingState)
			this.grid.saveState();
			
		this.grid.fireEvent('filterupdate', this, filter);
	},
	
	/** @private */
	onBeforeLoad: function(store, options){
    options.params = options.params || {};
		this.cleanParams(options.params);		
		var params = this.buildQuery(this.getFilterData());
		Ext.apply(options.params, params);
	},
	
	/** @private */
	onRefresh: function(view){
		this.updateColumnHeadings(view);
	},
	
	/** @private */
	getMenuFilter: function(){
		var view = this.grid.getView();
		if(!view || view.hdCtxIndex === undefined)
			return null;
		
		return this.filters.get(
			view.cm.config[view.hdCtxIndex].dataIndex);
	},
	
	/** @private */
	updateColumnHeadings: function(view){
		if(!view || !view.mainHd) return;
		
		var hds = view.mainHd.select('td').removeClass(this.filterCls);
		for(var i=0, len=view.cm.config.length; i<len; i++){
			var filter = this.getFilter(view.cm.config[i].dataIndex);
			if(filter && filter.active)
				hds.item(i).addClass(this.filterCls);
		}
	},
	
	/** @private */
	reload: function(){
		if(this.local){
			this.grid.store.clearFilter(true);
			this.grid.store.filterBy(this.getRecordFilter());
		} else {
			this.deferredUpdate.cancel();
			var store = this.grid.store;
			if(this.toolbar){
				var start = this.toolbar.paramNames.start;
				if(store.lastOptions && store.lastOptions.params && store.lastOptions.params[start])
					store.lastOptions.params[start] = 0;
			}
			store.reload();
		}
	},
	
	/**
	 * Method factory that generates a record validator for the filters active at the time
	 * of invokation.
	 * @private
	 */
	getRecordFilter: function(){
		var f = [];
		this.filters.each(function(filter){
			if(filter.active) f.push(filter);
		});
		
		var len = f.length;
		return function(record){
			for(var i=0; i<len; i++)
				if(!f[i].validateRecord(record))
					return false;
				
			return true;
		};
	},
	
	/**
	 * Adds a filter to the collection.
	 * @param {Object/Ext.ux.grid.filter.Filter} config A filter configuration or a filter object.
	 * @return {Ext.ux.grid.filter.Filter} The existing or newly created filter object.
	 */
	addFilter: function(config){
		var filter = config.menu ? config : 
				new (this.getFilterClass(config.type))(config);
		this.filters.add(filter);
		
		Ext.util.Observable.capture(filter, this.onStateChange, this);
		return filter;
	},
	
	/**
	 * Returns a filter for the given dataIndex, if one exists.
	 * @param {String} dataIndex The dataIndex of the desired filter object.
	 * @return {Ext.ux.grid.filter.Filter}
	 */
	getFilter: function(dataIndex){
		return this.filters.get(dataIndex);
	},

	/**
	 * Turns all filters off. This does not clear the configuration information.
	 */
	clearFilters: function(){
		this.filters.each(function(filter){
			filter.setActive(false);
		});
	},

	/**
	 * Returns current filters.
	 */
	getFilterData: function(){
		var filters = [],
			fields  = this.grid.getStore().fields;
		
		this.filters.each(function(f){
			if(f.active){
				var d = [].concat(f.serialize());
				for(var i=0, len=d.length; i<len; i++)
					filters.push({
						field: f.dataIndex,
						data: d[i]
					});
			}
		});
		
		return filters;
	},
	
	/**
	 * Function to take structured filter data and 'flatten' it into query parameteres. The default function
	 * will produce a query string of the form:
	 * 		filters[0][field]=dataIndex&filters[0][data][param1]=param&filters[0][data][param2]=param...
	 * You can override this function to return json:
     * <pre><code>
     * buildQuery: function(filters) {
     *     var p  = {};
     *     var len  = filters.length;
     *     for(var i=0; i<len; i++) {
     *         var f = filters[i];
     *         if (f.data.comparison) {
     *             if (typeof(p[f.field]) != 'object') {
     *                 p[f.field] = new Object();
     *             }
     *             p[f.field][f.data.comparison] = f.data.value;
     *         } else {
     *             p[f.field] = f.data.value;
     *         }
     *     }
     *     var tmp = {};
     *     tmp["extjs_filter_encoded"] = Ext.util.JSON.encode(p)
     *     return tmp;
     * }
     * </code></pre>
	 * @param {Array} filters A collection of objects representing active filters and their configuration.
	 * 	  Each element will take the form of {field: dataIndex, data: filterConf}. dataIndex is not assured
	 *    to be unique as any one filter may be a composite of more basic filters for the same dataIndex.
	 * @return {Object} Query keys and values
	 */
	buildQuery: function(filters){
		var p = {};
		for(var i=0, len=filters.length; i<len; i++){
			var f    = filters[i];
			var root = [this.paramPrefix, '[', i, ']'].join('');
			p[root + '[field]'] = f.field;
			
			var dataPrefix = root + '[data]';
			for(var key in f.data)
				p[[dataPrefix, '[', key, ']'].join('')] = f.data[key];
		}
		
		return p;
	},
	
	/**
	 * Removes filter related query parameters from the provided object.
	 * @param {Object} p Query parameters that may contain filter related fields.
	 */
	cleanParams: function(p){
		var regex = new RegExp("^" + this.paramPrefix + "\[[0-9]+\]");
		for(var key in p)
			if(regex.test(key))
				delete p[key];
	},
	
	/**
	 * Function for locating filter classes, overwrite this with your favorite
	 * loader to provide dynamic filter loading.
	 * @param {String} type The type of filter to load.
	 * @return {Class}
	 */
	getFilterClass: function(type){
		return Ext.ux.grid.filter[type.substr(0, 1).toUpperCase() + type.substr(1) + 'Filter'];
	}
});