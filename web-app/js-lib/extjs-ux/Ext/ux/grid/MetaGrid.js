Ext.ns('Ext.ux.grid');

/**
 * @class Ext.ux.grid.MetaGrid
 * @extends Object
 * <p><b>Demo</b> link (<i>Firefox only for this particular demo!</i>): <a href="http://extjs-ux.org/repo/authors/mjlecomte/trunk/Ext/ux/metagrid.html">here</a></p>
 * <p>Plugin (ptype = 'ux-grid-metagrid') to add capability to automatically process a data packet
 * with metaData sent by the server to configure a GridPanel or EditorGridPanel.  To use, configure the
 * grid using this plugin, and let the server do the rest.</p>
 * <p>Sample usage:</p>
 * <pre><code>
var grid = new Ext.grid.EditorGridPanel({
    plugins: [
        {ptype: 'ux-grid-metagrid'}
    ],
    //colModel: provided by the plugin, configured through the metaData.fields
    //          property in the data packet sent back by server
    store: {
        //xtype: 'groupingstore',// Ext.data.GroupingStore
        autoDestroy: true,
        baseParams: {
            foo: 'bar'
        },
        // create reader (reader will be further configured through metaData sent by server)
        reader: new Ext.data.JsonReader(),
        url: 'meta-data.txt' // see options parameter for Ext.Ajax.request
    },
    //autoExpandColumn: 'company', // configurable through metaData
    loadMask: true,
    clicksToEdit:1,
    stripeRows: true,
    viewConfig: {
        emptyText: 'No Data'
    }
});
 * </code></pre>
 * <p>Anatomy of a data packet:</p>
 * <pre><code>
{
    // the typical total and results
    "total":30,
    "results":[
        // record data objects go here
    ],
    "success":30,
    // metaData to configure the grid    
    "metaData":{
        // metaData goes here
    }
} 
 * </code></pre>
 * <p>Typically the metaData packet will provide at least the following configuration specifications:
 * <pre><code>
{
   ...
   "metaData":{
      "idProperty":"id",
      "root":"results",            // notice this corresponds to the "results" property sent back above
      "successProperty":"success",
      "totalProperty":"total",     // notice this corresponds to the "total" property sent back above
      ...
   }
} 
 * </code></pre>
 * <p>The reader and column model are configured through the metaData fields property:</p> 
 * <pre><code>
{
   ...
   "metaData":{
      ...
      "fields":[
         // fields config objects go here
      ],
      ...
   }
} 
 * </code></pre>
 * <p>Additional configuration and custom properties can be specified in the metaData object:</p> 
 * <pre><code>
{
   ...
   "metaData":{
      ...
      "sortInfo":{
         "field":"id",
         "direction":"ASC"
      },
      // column model defaults
      "cmDefaults":{
         "sortable":true,
         "menuDisabled":false,
         "width":100
      },
      // column model listeners
      "cmListeners":{
         "widthchange":function(cm,colIndex,width){
                saveConfig(colIndex,width);
         }
      },
      // support for some grid configuration
      "gridConfig":{
	      "autoExpandColumn":"company",
	      "viewConfig":{
	         "forceFit":true
	      }
      },
      // potential to alter the type of store used by the grid
      "storeConfig":{
	      "xtype":"groupingstore"
	      // other store configs
      },
      ...
   }
} 
 * </code></pre>
 * <p>The metaData configuration shown here would consume a data object of this format:</p> 
 * <pre><code>
   "results":[
      {
         "companyID":"166",
         "company":"3m Company",
         "price":"44",
         "change":"0.02",
         "pctChange":"0.03",
         "lastChange":"2007-08-01 00:00:00",
         "industryID":"5",
         "stars":"1",
         "check":false,
         "industry":"1",
         "desc":"foo",
         "tax":2.64
      }
   ]
 * </code></pre>
 * <p>Typical field configuration objects look something like this:</p> 
 * <pre><code>
{
   ...
      "fields":[
         {
            "name":"id",         // a standard field
            "mapping":"companyID",
            "header":"ID",
            "align":"right",
            "sortable":false,
            "menuDisabled":true
         },{
            "name":"company",
            "id":"company",      // id for the autoExpandColumn
            "editor":{           // an editable field
               "xtype":"textfield",
               "allowBlank":false
            },
            "fixed":false,
            "header":"Company",
            "hidden":false,
            "hideable":true,
            "locked":false,
            "mapping":"company",
            "tooltip":"Click to sort"
         },{
            "name":"tax",
            "ignoreColumn":true  // a field in the data object, but not in the column model
         },
 * </code></pre>
 * <p>Fields that utilize a renderer or column xtype for rendering:</p> 
 * <pre><code>
{
   ...
      "fields":[
         {
            "name":"price",
            "header":"Price",
            "align":"right",
            "renderer":"Ext.util.Format.usMoney"
         },
         {
            "name":"lastChange",
            "dateFormat":"Y-m-d H:i:s",
            "editor":{
               "xtype":"datefield",
               "allowBlank":false,
               "selectOnFocus":true
            },
            "fixed":false,
            "header":"Last Change",
            "hidden":false,
            "hideable":true,
            "locked":false,
            "mapping":"lastChange",
            "tooltip":"Click to sort",
            "type":"date",
            // instead of renderer use an xtype:
            "xtype": "datecolumn", 
            "format": "M/d/Y"  // config for datecolumn xtype
         },
 * </code></pre>
 * <p>A field with ComboBox editor and renderer:</p> 
 * <pre><code>
{
   ...
      "fields":[
         {
            "name":"industry",
            "header":"Industry",
            // add combobox rendering capability:
            "xtype": 'combocolumn',
            // combobox rendering needs an editor:
            "editor":{
               "xtype":"combo",
               "name":"foo", // needed?
               "editable":false,
               "forceSelection":true,
               "selectOnFocus":true,
               "lazyRender":true,
               "listClass":"x-combo-list-small",
               "mode":"local",
               "triggerAction":"all",
               "typeAhead":false,
		       "valueNotFoundText":"Select Industry...",
               // the store:
	        "store": {
		            "xtype": "arraystore",
		            "id": 0,
		            "fields": [
		                "myId",
		                "displayText"
		            ],
		            "data": [
		                [ 1, "Food"],
		                [ 2, "Retail"],
		                [ 3, "Aerospace"],
		                [ 4, "Communications"],
		                [ 5, "Construction"],
		                [ 5, "Finance"]
		            ]
		        },
		        "valueField": "myId",          // as per store.fields configuration
		        "displayField": "displayText"  // as per store.fields configuration
             }
         },
 * </code></pre>
 * <p>Examples of fields that invoke plugins:</p> 
 * <pre><code>
{
   ...
      "fields":[
         {
            "ptype":"rownumberer", // must be a registered ptype
            "header":"",
            "autoDestroy":true     // used to trigger destruction of plugin
         },{
            "ptype":"ux-rowexpander",
            "header":"",
            "autoDestroy":true,
            // ability to execute arbitrary javascript:
            "script":"(function (){return {tpl : new Ext.Template('&lt;p>&lt;b>Company:&lt;/b> {company}&lt;/p>&lt;br>','&lt;p>&lt;b>Summary:&lt;/b> {desc}&lt;/p>')}})()"
         },{
            "ptype":"ux-checkcolumn", // must be a registered ptype
            "autoDestroy":true,
            "name":"check",
            "align":"center",
            "fixed":false,
            "header":"Check",
            "hidden":false,
            "hideable":true,
            "locked":false,
            "mapping":"check",
            "sortable":true,
            "tooltip":"Click to sort",
            "width":50
         },{
            // experimental: changing the selection model
            "selModel":{
            	"type":"CheckboxSelectionModel",
            	"cfg":{}
            },
            "autoDestroy":true
         },
 * </code></pre>
 */
Ext.ux.grid.MetaGrid = Ext.extend(Object, {

    /**
     * @cfg {Boolean} maskEmpty
     * Defaults to <tt>true</tt> to mask the grid if there's no data to make it
     * even more obvious that the grid is empty.  This will apply a mask to the
     * grid's body with a message in the middle if there are zero rows - quite
     * hard for the user to miss.
     */
    maskEmpty: true,
    
    paging: {
        perPage: 25
    },
    stripeRows: true,
    /**
     * @cfg {Boolean} trackMouseOver
     * Defaults to <tt>true</tt>.  See Ext.grid.GridPanel.
     */
    trackMouseOver: true,
    
    constructor: function (config) {
        Ext.apply(this, config);
    },

    // @private
    init: function(grid) {
        this.grid = grid;
        this.grid.on({
            render: this.onRender,
            destroy: this.onDestroy,
            scope: this
        });

        grid.store.on({
            // register to the store's metachange event
            metachange: {
                fn: this.onMetaChange,
                scope: this
            },
            loadexception: {
                fn: function(proxy, options, response, e){
                    if (Ext.isFirebug) {
                        console.warn('store loadexception: ', arguments);
                    }
                    else {
                        Ext.Msg.alert('store loadexception: ', arguments);
                    }
                }
            },
            scope: this
        });

        // mask the grid if there is no data if so configured
        if (this.maskEmpty) {
            grid.store.on(
                'load', function() {
                    if (this.store.getTotalCount() == 0) {
                        var el = this.getGridEl();
                        if (typeof el == 'object'){
                            el.mask('No Data', 'x-mask');
                        }
                    }
                },
                grid // scope it to grid
            );
        } 

        if (grid.filters) {
            grid.filters = new Ext.grid.GridFilters({
                filters:[]
            });  
            this.plugins.push(grid.filters);
            this.paging.plugins = [];  
            this.pagingPlugins.push(grid.filters);
        }
/*
        //Create Paging Toolbar      
        this.pagingToolbar = new Ext.PagingToolbar({
            store: grid.store,
            pageSize: this.pageSize || 25, //default is 20
            plugins: this.pagingPlugins,
            displayInfo: true,//default is false (to not show displayMsg)
            displayMsg: 'Displaying {0} - {1} of {2}',
            emptyMsg: "No data to display",//display message when no records found
            items: [{
                text: 'Change data',
                scope: this
            }]
        });
        
        //Add a bottom bar      
        this.bbar = this.pagingToolbar;
*/        
        /*
         * JSONReader provides metachange functionality which allows you to create
         * dynamic records natively
         * It does not allow you to create the grid's column model dynamically.
         */
        if (grid.columns && (grid.columns instanceof Array)) {
            grid.colModel = new Ext.grid.ColumnModel(grid.columns);
            delete grid.columns;
        }
        
        // Create a empty colModel if none given
        if (!grid.colModel) {
            grid.colModel = new Ext.grid.ColumnModel([]);
        }
        
    },
 
    // @private
    onRender : function() {

        var params = { //this is only parameters for the FIRST page load,
            reconfigure: true,
            start: 0, //pass start/limit parameters for paging
            limit: this.paging.perPage
        };

        this.grid.store.load({params: params});
    },
 
    // @private
    onDestroy: function() {

    },

    /**
     * Configure the reader using the server supplied meta data.
     * This grid is observing the store's metachange event (which will be triggered
     * when the metaData property is detected in the returned json data object).
     * This method is specified as the handler for the that metachange event.
     * This method interrogates the metaData property of the json packet (passed
     * to this method as the 2nd argument ).
     * @param {Object} store
     * @param {Object} meta The reader's meta property that exposes the JSON metadata
     */
    onMetaChange: function(store, meta){
    
        var cols = [], script;

        Ext.each(meta.fields, function(col){
        
            // do not add to column model if ignoreColumn == true
            if (col.ignoreColumn) {
                return;
            }
            
            // if not specified assign dataIndex to name               
            if (typeof col.dataIndex == "undefined" && col.name) {
                col.dataIndex = col.name;
            }
            
            //if using gridFilters extension
            if (this.grid.filters) {
                if (col.filter !== undefined) {
                    if ((col.filter.type !== undefined)) {
                        col.filter.dataIndex = col.dataIndex;
                        this.filters.addFilter(col.filter);
                    }
                }
                delete col.filter;
            }
            
            // if renderer specified
            if (typeof col.renderer == "string") {
            
                // if specified Ext.util or a function will eval to get that function
                if (col.renderer.indexOf("Ext") < 0 && col.renderer.indexOf("function") < 0) {
                    col.renderer = this.grid[col.renderer].createDelegate(this.grid);
                }
                else {
                    col.renderer = eval(col.renderer);
                }
            }
            
            // if listeners specified in meta data
            l = col.listeners;
            if (typeof l == "object") {
                for (var e in l) {
                    if (typeof e == "string") {
                        for (var c in l[e]) {
                            if (typeof c == "string") {
                                l[e][c] = eval(l[e][c]);
                            }
                        }
                    }
                }
            }
            
            // if convert specified assume it's a function and eval it
            if (col.convert) {
                col.convert = eval(col.convert);
            }

            // column editor
            if (col.editor) {
                col.editor = Ext.create(col.editor, 'textfield');
            }
            
            // check if script property specified on the column
            // use this property to pass back custom code wrapped inside a self evaluating function:
            // (function () {  <<do whatever>>  })()
            if (col.script){
                script = eval(col.script);
                Ext.apply(col, script);
            }

            // if plugin specified add it
            if (col.ptype !== undefined) {
                // requires overrides to Ext.Component and Ext.ComponentMgr
                col = this.grid.addPlugin(col);
            }

            // add ability to change to CheckboxSelectionModel
            if (col.selModel){
                col = this.setSelectionModel(col.selModel);
            }
            
            // add column to colModel config array            
            cols.push(col);
            
        }, this); // end of columns loop        

        var cm = new Ext.grid.ColumnModel({
            columns: cols,
            defaults: meta.cmDefaults || {},
            listeners: meta.cmListeners || {}
        });

        // apply any passed grid configs (eg, autoExpandColumn, etc)
        if (meta.gridConfig) {
            Ext.apply(this.grid, meta.gridConfig);
            // explicitly apply any viewConfigs to view
            if (meta.gridConfig.viewConfig){
                Ext.apply(this.grid.getView(), meta.gridConfig.viewConfig);
                // will have limited success, scroller won't be changed, etc.
                // if setting forceFit=true might need:
                //this.grid.getView().scroller.setStyle('overflow-x', 'hidden');
            } 
        }

        // use meta.storeConfig to provide capability to change the store,
        // perhaps change to a GroupingStore, etc.
        var newStore; 
        if (meta.storeConfig) {
            var storeConfig = Ext.apply({}, meta.storeConfig);
            newStore = Ext.StoreMgr.lookup(storeConfig);

        } else {
            newStore = store;
        }
        
        // Reconfigure the grid to use a different Store and Column Model. The View 
        // will be bound to the new objects and refreshed. 
        this.grid.reconfigure(newStore, cm);

        // update the store for the pagingtoolbar also
        if(this.grid.pagingToolbar){
            this.grid.pagingToolbar.bindStore(newStore);
        }

        if (this.grid.stateful) {
            this.grid.initState();
        }
    },

    // experimental, dynamically change selection model
    setSelectionModel : function(sm){
        delete this.grid.selModel;
        this.grid.selModel = new Ext.grid[sm.type](sm.cfg);
        sm = this.grid.selModel;
        sm.grid = this.grid;

        var view = this.grid.getView();
        view.mainBody.on('mousedown', sm.onMouseDown, sm);
        Ext.fly(view.innerHd).on('mousedown', sm.onHdMouseDown, sm);

        return sm; 
    }
});
// register ptype
Ext.reg('ux-grid-metagrid', Ext.ux.grid.MetaGrid);