// Create the namespace
Ext.ns('Ext.ux.grid');

/**
 * @class Ext.ux.grid.CellExpander
 * @extends Ext.util.Observable
 * <p>Grid Plugin as a replacement for RowExpander with support for
 * multiple expanders in one grid.</p>
 * <p>Supports Ajax loading of data by specifying an 'url' property.</p>
 * <p>For Ajax loading, the current row record's data is passed in the
 * request, unless the paramsFunction is defined.</p>
 * <pre><code>
 * var expander = new Ext.grid.RowExpander({
 * &nbsp; tpl: '&lt;h2&gt;Details:&lt;/h2&gt;&lt;p&gt;{detailstext}&lt;/p&gt;&lt;p&gt;Changed: {changed}&lt;/p&gt;',
 * &nbsp; url: '/ajax/details.php',
 * &nbsp; paramsFunction: function(record) { 
 * &nbsp;   return {
 * &nbsp;     'item':  record.get('itemid')
 * &nbsp;   };
 * &nbsp; }
 * });
 *
 * new Ext.grid.GridPanel({
 * &nbsp; ...,
 * &nbsp; plugins: [expander],
 * &nbsp; columns: [
 * &nbsp;   expander,
 * &nbsp;   { header: 'Name', dataIndex: 'name', width: 100 }
 * &nbsp; ],
 * &nbsp; ...
 * });
 * </code></pre>
 * <p>Credits: to saki for his RowExpander 
 * @author win
 * @version 1.01
 * @license <a href="http://en.wikipedia.org/wiki/WTFPL">WTFPL</a>
 */
Ext.ux.grid.CellExpander = Ext.extend( Ext.util.Observable, {
	/**
	 * @cfg {String} header
	 * The column header for the expander column, normally left empty
	 */
    header : '',
    width : 20,
    fixed : true,
    sortable : false,
    dataIndex : '',
    name: 'expander',
    /**
     * @cfg {String} loadingText
     * Text to display in the expanded space while the data is being
     * loaded via Ajax.
     */
    loadingText: 'Loading...',
    /**
     * @cfg {Boolean} enableCaching
     * <tt>true</tt> to enable caching of Ajax data for the expander.
     */
    enableCaching: false,
    /**
     * @cfg String
     * URL where the Ajax request will be made to (POST)
     */
    url:	false,
    /**
     * @cfg {Function} paramsFunction
     * Pass a function here that will be passed the row's underlying record,
     * the row index and the column index, and that returns an object that
     * will be used as POST parameters for the request. If the paramsFunction
     * is not assigned, the whole record data for the current row will be sent!
     */
    paramsFunction:	false,

    constructor: function(config){
    	  if( ! config.id ) {
    	  	config.id = Ext.id();
    	  }
        Ext.apply(this, config);
        this.addEvents({
            /**
             * @event beforeexpand
             * Fires before the row expands. Have the listener return false to prevent the row from expanding.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            beforeexpand: true,
            /**
             * @event expand
             * Fires after the row expands.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            expand: true,
            /**
             * @event beforecollapse
             * Fires before the row collapses. Have the listener return false to prevent the row from collapsing.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            beforecollapse: true,
            /**
             * @event collapse
             * Fires after the row collapses.
             * @param {Object} this RowExpander object.
             * @param {Object} Ext.data.Record Record for the selected row.
             * @param {Object} body body element for the secondary row.
             * @param {Number} rowIndex The current row index.
             */
            collapse: true
        });
        Ext.ux.grid.CellExpander.superclass.constructor.call(this);
        if(this.tpl){
            if(typeof this.tpl == 'string'){
                this.tpl = new Ext.XTemplate(this.tpl);
            }
            this.tpl.compile();
        }
        this.state = {};
        this.bodyContent = {};
    },

    init : function(grid){
        this.grid = grid;
        var view = grid.getView();
        
				this.state = {};
				this.bodyContent = {};
				        
        view.enableRowBody = true;

				if( ! view.expanders ) {
					view.expanders = new Ext.util.MixedCollection();
				}
				view.expanders.add(this);

       	grid.on('render', this.onRender, this);
       	grid.on('destroy', this.onDestroy, this);
    },

    onRender: function() {
        var grid = this.grid;
        var mainBody = grid.getView().mainBody;
        mainBody.on('mousedown', this.onMouseDown, this, {delegate: '.ux-' + this.id + '-expander'});
    },

    renderer : function(v, p, record){
        p.cellAttr = 'rowspan="2"';
        return '<div class="ux-grid3-cell-expander-outer"><div class="ux-grid3-cell-expander ux-' + this.id + '-expander">&#160;</div></div>';
    },

    // @private    
    onDestroy: function() {
    		this.grid.getView().expanders.remove(this);
        var mainBody = this.grid.getView().mainBody;
        mainBody.un('mousedown', this.onMouseDown, this);
    },

    getBodyContent : function(record, rowIdx, colIdx, body){
    	if( this.url ) {
    		if( this.enableCaching && this.bodyContent[record.id] ) {
    			content = this.bodyContent(record.id);
    		} else {
    			content = this.loadingText;
    			this.fireRequest(record, rowIdx, colIdx, body);
    		}
      } else {
        if(!this.enableCaching){
            return this.tpl.apply(record.data);
        }
        var content = this.bodyContent[record.id];
        if(!content){
            content = this.tpl.apply(record.data);
            this.bodyContent[record.id] = content;
        }
      }
      return content;
    },

	fireRequest: function(record, rowIdx, colIdx, body) {
		var req = {
			url:		this.url,
			method:		'POST',
			success:	this.onAjaxSuccess.createDelegate(this, [body], true),
			failure:	function(error) {
				body.innerHTML = '<div id="error-"' + Ext.id() + '">Error loading content</div>';
			},
			params: this.paramsFunction ? this.paramsFunction(record, rowIdx, colIdx) : record.data
		};
		Ext.Ajax.request(req);
	},

    onMouseDown : function(e, t){
        e.stopEvent();
        var cell = e.getTarget('.x-grid3-cell');
        this.toggleCell(cell);
    },

    toggleCell : function(cell){
    	var row = this.grid.view.findRowIndex(cell);
    	var col = this.grid.view.findCellIndex(cell);
      this[Ext.fly(cell).select('.ux-grid3-cell-expander-outer').first().hasClass('ux-grid3-cell-expanded') ? 'collapseCell' : 'expandCell'](row,col);
    },

    beforeExpand : function(record, body, rowIndex, colIndex){
        if(this.fireEvent('beforeexpand', this, record, body, rowIndex, colIndex) !== false){
            if(this.tpl){
                body.innerHTML = this.getBodyContent(record, rowIndex, colIndex, body);
            }
            return true;
        }else{
            return false;
        }
    },

	collapseAll : function(row) {
		if( typeof row == 'number' ) {
			row = this.grid.view.getRow(row);
		}
		Ext.fly(row).replaceClass('ux-grid3-row-expanded', 'ux-grid3-row-collapsed');
		Ext.fly(row).select('.ux-grid3-cell-expander-outer').replaceClass('ux-grid3-cell-expanded', 'ux-grid3-cell-collapsed');
	},

    expandCell : function(row,col){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        this.collapseAll(row);
        var cell = this.grid.view.getCell(row.rowIndex,col);
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
        if(this.beforeExpand(record, body, row.rowIndex, col)){
            this.state[record.id] = true;
            Ext.get(row).replaceClass('ux-grid3-row-collapsed', 'ux-grid3-row-expanded');
            Ext.get(cell).select('.ux-grid3-cell-expander-outer').replaceClass('ux-grid3-cell-collapsed', 'ux-grid3-cell-expanded');
            this.fireEvent('expand', this, record, body, row.rowIndex, col);
        }
    },

    collapseCell : function(row,col){
        if(typeof row == 'number'){
            row = this.grid.view.getRow(row);
        }
        this.collapseAll(row);
        var cell = this.grid.view.getCell(row.rowIndex,col);
        var record = this.grid.store.getAt(row.rowIndex);
        var body = Ext.DomQuery.selectNode('tr:nth(2) div.x-grid3-row-body', row);
        body.innerHTML = '';
        if(this.fireEvent('beforecollapse', this, record, body, row.rowIndex, col) !== false){
            this.state[record.id] = false;
            Ext.get(row).replaceClass('ux-grid3-row-expanded', 'ux-grid3-row-collapsed');
            Ext.get(cell).select('.ux-grid3-cell-expander-outer').replaceClass('ux-grid3-cell-expanded', 'ux-grid3-cell-collapsed');
            this.fireEvent('collapse', this, record, body, row.rowIndex, col);
        }
    },

	onAjaxSuccess:	function(resp, opt, body) {
		this.tpl.overwrite(body, Ext.decode(resp.responseText));
	}

});
