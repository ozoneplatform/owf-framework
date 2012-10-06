// Create the namespace
Ext.ns('Ext.ux.plugins.grid');

/**
 * @class Ext.ux.plugins.grid.CellToolTips
 * @extends Ext.util.Observable
 * <p>Plugin for Ext.grid.GridPanel</p>
 * <p>A GridPanel plugin that enables the creation of record based,
 * per-column tooltips that can also be dynamically loaded via Ajax
 * calls.</p>
 * <p>Requires Animal's triggerElement override when using ExtJS 2.x
 * (from <a href="http://extjs.com/forum/showthread.php?p=265259#post265259">http://extjs.com/forum/showthread.php?p=265259#post265259</a>)
 * In ExtJS 3.0 this feature is arealy in the standard.</p>
 * <p>Starting from version 1.1, CellToolTips also supports dynamic
 * loading of tooltips via Ajax. Just specify the 'url' parameter
 * in the respective column configuration for the CellToolTips,
 * and the data for the tooltip will be loaded from there. By
 * default, the record data for the current row will be passed
 * to the request.</p>
 * <p>If you want to supply different parameters, you can specify a
 * function with the 'fn' parameter. This function gets the data
 * object for the current row record. The object it returns will
 * be used as the Ajax paremeters.</p>
 * <p>An example configuration:</p>
 * <pre><code>
 *	var tts = new Ext.ux.plugins.grid.CellToolTips([
 *		{
 *			// 'Standard' CellToolTip, the current row record is applied
 *			// to the template.
 *			field: 'company',
 *			tpl:   '<b>Company: {company}</b><br />This is a local column tooltip'
 *		},
 *		{
 *			// Simple Ajax CellToolTip, an Ajax request is dispatched with the
 *			// current row record as its parameters, and the return data is applied
 *			// to the template.
 *			field: 'price', 
 *			tpl: '<b>Company: {company}</b><br /><hr />Description: {description}<br /><hr />Price: {price} $<br />Change: {pctChange}%', 
 *			url: 'json_ajaxtip1.php'
 *		},
 *		{
 *			// Advanced Ajax CellToolTip, the current row record is passed to the
 *			// function in 'fn', its return values are passed to an Ajax call and
 *			// the Ajax return data is applied to the template.
 *			field: 'change', 
 *			tpl: '<b>Company: {company}</b><br /><hr />Description: {description}<br /><hr />Price: {price} $<br />Change: {pctChange}%', 
 *			fn: function(parms) {
 *				parms.price = parms.price * 100;
 *				return Ext.apply({},parms);
 *			},
 *			url: '/json_ajaxtip2.php'
 *		}
 *	]);
 *	
 *	var grid = new Ext.grid.GridPanel({
 *		... normal config ...
 *		,plugins:	[ tts ]
 *		// Optional: filter which rows should have a tooltip:
 *		,CellToolTipCondition: function( row, rec ) {
 *			// don't show a tooltip for the first row or if
 *			// the record has a property 'secret' set to true
 *			if( row == 0 || rec.get('secret') == true ) {
 *				return false;
 *			}
 *		}
 * </code></pre>
 * <p>A complete example can be found <a href="http://www.chrwinter.de/ext3/CellToolTips.html">here</a>.</p>
 * @author  BitPoet
 * @version 1.1
 * @license <a href="http://en.wikipedia.org/wiki/WTFPL">WTFPL</a>
 */
Ext.ux.plugins.grid.CellToolTips = function(config) {
    var cfgTips;
    if( Ext.isArray(config) ) {
        cfgTips = config;
        config = {};
    } else {
    	cfgTips = config.ajaxTips;
    }
    Ext.ux.plugins.grid.CellToolTips.superclass.constructor.call(this, config);
    if( config.tipConfig ) {
    	this.tipConfig = config.tipConfig;
    }
    this.ajaxTips = cfgTips;
} // End of constructor

// plugin code
Ext.extend( Ext.ux.plugins.grid.CellToolTips, Ext.util.Observable, {
    version: 1.1,
    /**
     * @cfg {String} field
     * The column index to which this tooltip config applies.
     */
   
   /**
    * @cfg {String} tpl
    * The XTemplate fragment to be used for the tooltip.
    */
   
   /**
    * @cfg {String} url
    * (Optional) The url from which to load the tooltip data.
    */
   
   /**
    * @cfg {String} fn
    * (Optional) A function that returns the params object to be
    * used for the Ajax call. Gets passed a copy of the data object
    * of the underlying record for this row.
    */
   
    /**
     * Temp storage from the config object
     *
     * @private
     */
    ajaxTips: false,
    
    /**
     * Tooltip Templates indexed by column id
     *
     * @private
     */
    tipTpls: false,

    /**
     * Tooltip data filter function for setting base parameters
     *
     * @private
     */
    tipFns: false,
    
    /**
     * URLs for ajax backend
     *
     * @private
     */
    tipUrls: '',
    
    /**
     * Tooltip configuration items
     *
     * @private
     */
    tipConfig: {},

    /**
     * Loading action
     *
     * @private
     */
    request: false,

    /**
     * Plugin initialization routine
     *
     * @param {Ext.grid.GridPanel} grid
     */
    init: function(grid) {
        if( ! this.ajaxTips ) {
            return;
        }
        this.tipTpls = {};
        this.tipFns  = {};
        this.tipUrls = {};
        // Generate tooltip templates
        Ext.each( this.ajaxTips, function(tip) {
        	this.tipTpls[tip.field] = new Ext.XTemplate( tip.tpl );
        	if( tip.url ) {
        		this.tipUrls[tip.field] = tip.url;
        		if( tip.fn )
        			this.tipFns[tip.field] = tip.fn;
        	}
        }, this);
        // delete now superfluous config entry for ajaxTips
        delete( this.ajaxTips );
        grid.on( 'render', this.onGridRender.createDelegate(this) );
    } // End of function init

    /**
     * Set/Add a template for a column
     *
     * @param {String} fld
     * @param {String | Ext.XTemplate} tpl
     */
    ,setFieldTpl: function(fld, tpl) {
        this.tipTpls[fld] = Ext.isObject(tpl) ? tpl : new Ext.XTemplate(tpl);
    } // End of function setFieldTpl

    /**
     * Set up the tooltip when the grid is rendered
     *
     * @private
     * @param {Ext.grid.GridPanel} grid
     */
    ,onGridRender: function(grid) 
    {
        if( ! this.tipTpls ) {
            return;
        }
        // Create one new tooltip for the whole grid
        Ext.apply(this.tipConfig, {
            target:      grid.getView().mainBody,
            delegate:    '.x-grid3-cell-inner',
            trackMouse:  true,
            renderTo:    document.body,
            finished:	 false
        });
        this.tip = new Ext.ToolTip( this.tipConfig );
        this.tip.ctt = this;
        // Hook onto the beforeshow event to update the tooltip content
        this.tip.on('beforeshow', this.beforeTipShow.createDelegate(this.tip, [this, grid], true));
        this.tip.on('hide', this.hideTip);
    } // End of function onGridRender

    /**
     * Replace the tooltip body by applying current row data to the template
     *
     * @private
     * @param {Ext.ToolTip} tip
     * @param {Ext.ux.plugins.grid.CellToolTips} ctt
     * @param {Ext.grid.GridPanel} grid
     */
    ,beforeTipShow: function(tip, ctt, grid) {
	// Get column id and check if a tip is defined for it
	var colIdx = grid.getView().findCellIndex( tip.triggerElement );
	var tipId = grid.getColumnModel().getDataIndex( colIdx );
       	if( ! ctt.tipTpls[tipId] )
       	    return false;
    	if( ! tip.finished ) {
	       	var isAjaxTip = (typeof ctt.tipUrls[tipId] == 'string');
        	// Fetch the row's record from the store and apply the template
        	var rowNum = grid.getView().findRowIndex( tip.triggerElement );
        	var cellRec = grid.getStore().getAt( rowNum );
	        if( grid.CellToolTipCondition && grid.CellToolTipCondition(rowNum, cellRec) === false ) {
        	    return false;
        	}
        	// create a copy of the record and use its data, otherwise we might
        	// accidentially modify the original record's values
        	var data = cellRec.copy().data;
        	if( isAjaxTip ) {
        		ctt.loadDetails((ctt.tipFns[tipId]) ? ctt.tipFns[tipId](data) : data, tip, grid, ctt, tipId);
        		tip.body.dom.innerHTML = 'Loading...';
        	} else {
			tip.body.dom.innerHTML = ctt.tipTpls[tipId].apply( cellRec.data );
		}       		
        } else {
        	tip.body.dom.innerHTML = tip.ctt.tipTpls[tipId].apply( tip.tipdata );
        }
    } // End of function beforeTipShow
    
    /**
     * Fired when the tooltip is hidden, resets the finished handler.
     *
     * @private
     * @param {Ext.ToolTip} tip
     */
    ,hideTip: function(tip) {
    	tip.finished = false;
    }
    
    /**
     * Loads the data to apply to the tip template via Ajax
     *
     * @private
     * @param {object} data Parameters for the Ajax request
     * @param {Ext.ToolTip} tip The tooltip object
     * @param {Ext.grid.GridPanel} grid The grid
     * @param {Ext.ux.plugins.grid.CellToolTips} ctt The CellToolTips object
     * @param {String} tipid Id of the tooltip (= field name)
     */
    ,loadDetails: function(data, tip, grid, ctt, tipid) {
    	Ext.Ajax.request({
    		url:	ctt.tipUrls[tipid],
    		params:	data,
    		method: 'POST',
    		success:	function(resp, opt) {
    			tip.finished = true;
    			tip.tipdata  = Ext.decode(resp.responseText);
    			tip.show();
    		}
    	});
    }

}); // End of extend