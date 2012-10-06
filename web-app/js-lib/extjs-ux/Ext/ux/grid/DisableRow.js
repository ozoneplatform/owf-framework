Ext.namespace('Ext.ux.grid');

/**
 * @class Ext.ux.grid.DisableRow
 * @extends Ext.util.Observable
 * <p>
 * Row Disable plugin provides the ability to visually disable a grid row and prevent any further selections.
 * </p>
 * <p>
 * <b>Notes:</b><ul>
 * <li>This plugin only applies to grids that are using a RowSelectionModel or a CheckboxSelectionModel.</li>
 * <li>Compatible with Ext 3.0</li>
 * </ul>
 * </p>
 * <pre><code>
 * var grid = new Ext.grid.EditorGrid({plugins:new Ext.ux.grid.DisableRow(), ...})
 * var record = grid.getStore().getAt(0);
 * var id = record.id;
 * //applies load mask to row and prevents any further selection.
 * grid.disableRow(id); 
 * ...
 * //removes the existing load mask and allows for row selection.
 * grid.enableRow(id); 
 * ...
 * //determine if a row is disabled.
 * var isDisabled = grid.isRowDisabled(id); 
 * </code></pre>
 * @author Phil Crawford
 * @license Licensed under the terms of the Open Source <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0 license</a>.  Commercial use is permitted to the extent that the code/component(s) do NOT become part of another Open Source or Commercially licensed development library or toolkit without explicit permission.
 *  
 * @version 0.8 (September 1, 2009)
 * @ version 0.7 (August 14, 2009)
 * @ version 0.6 (May 19, 2009)
 * @ version 0.5 (January 12, 2009)
 * @ version 0.4 (December 16, 2008)
 * @ version 0.3 (December 15, 2008)
 * @ version 0.2 (December 15, 2008)
 * @ version 0.1 (December 12, 2008)
 * @constructor
 * @param {Object} config 
 */
Ext.ux.grid.DisableRow = function(config) {
    Ext.apply(this, config);
    //events must be added before constructor
    this.addEvents({
       /**
         * Fires when the plugin is initialized
         * @event initialize
         * @param {Ext.Component} this
         * @param {Ext.Component} The component that contains this plugin
         */
        'initialize': true
        /**
         * Fires after the plugin is destroyed.
         * @event destroy
         * @param {Ext.Component} this
         */
        ,'destroy': true
    });
    
    Ext.ux.grid.DisableRow.superclass.constructor.call(this);
}; // eo constructor

Ext.extend(Ext.ux.grid.DisableRow, Ext.util.Observable, {
    //configurables
    /**
     * @cfg {Boolean} preventSelection True to prevent selection of a row that is disabled. Default true.
     */
    preventSelection: true

    /**
     * @property rows
     * @type Ext.util.MixedCollection
     */
    ,rows: null
    
    /**
     * @private
     */
    ,init: function(grid) {
        //Our collection of disabled rows and associated masks.
        this.rows = new Ext.util.MixedCollection();
        //keep a ref
        this.grid = grid;
        grid.on('destroy', this.destroy, this, {single: true});
        
        //prevent the selection of disabled rows
        if (this.preventSelection) {
            var beforeSelect = function(sm, row, keep, record) {
                if (this.rows.containsKey(record.id)) {
                    //cancel the row select b/c this row is disabled
                    return false;
                }
            };
            grid.getSelectionModel().on('beforerowselect', beforeSelect, this);
        }
        
        //expose new methods to the grid
        Ext.apply(grid, {
            /**
             * Disable all rows in the grid.
             */
            disableAllRows: function() {
                var g = this.grid, ds = g.getStore();
                ds.each(function(record) {
                    g.disableRow(record.id);
                });
                
            }.createDelegate(this)
            
            /**
             * Disable a row in the grid and if configured, prevent any selection.
             * @param {String} id The record id of the item to be disabled.
             */
            ,disableRow: function(id) {
                //make sure the row is not already disabled
                var r = this.rows;
                if (r.containsKey(id)) { return; }
                
                var g = this.grid;
                //lookup the row index for the record
                var row = g.getStore().indexOfId(id);
                if (row === -1) { return; } //not found
                //get the html el for attaching the mask
                var el = g.getView().getRow(row);
                if (!el) { return; }
                //use a simple mask without a message to visually indicate the row is disabled
                var m = new Ext.LoadMask(el, {msg: undefined});
                m.show();
                if (this.preventSelection) {
                    //make sure the row is no longer selected once disabled
                    g.getSelectionModel().deselectRow(row);
                }
                //add index as key and mask as object
                r.add(id, m);
            }.createDelegate(this)
            
            /**
             * Enable all rows in the grid.
             */
            ,enableAllRows: function() {
                //no rows means nothing to do
                var r = this.rows;
                if (r.length === 0) { return; }
                //can't use eachKey since items are being removed from the collection we are iterating
                for(var i = 0; i < r.length; i++){
                    var m = r.itemAt(i);
                    if (m) {
                        m.hide();
                        m.destroy();
                    }
                }
                r.clear();
            }.createDelegate(this)
            
            
            /**
             * Enable a row in the grid and allow selection again.
             * @param {String} id The record id of the item to be enabled.
             */
            ,enableRow: function(id) {
                var r = this.rows;
                //we can not enable a row that is not already disabled
                if (!r.containsKey(id)) return;
                var m = r.get(id);
                //ensure our associated mask gets destroyed
                m.hide();
                m.destroy();
                r.removeKey(id);
            }.createDelegate(this)
            
            /**
             * Determine if a row is already disabled
             * @param {String} The record id to test.
             */
            ,isRowDisabled: function(id) {
                return this.rows.containsKey(id);
            }.createDelegate(this)
        });
        
        //each time the store loads, clear any disabled rows; defined after the functions are added to grid
        grid.getStore().on('beforeload', grid.enableAllRows, this);

        this.fireEvent('initialize', this, grid);
        this.onInit(grid);
    } // eof init

    
    /**
     * Destroy the plugin.  Called automatically when the grid is destroyed.
     */
    ,destroy: function() {
        if (this.grid) {
            //destroy any masks we created
            this.grid.enableAllRows();
            //destroy our ref to the grid
            this.grid = null;
        }
        this.onDestroy();
        this.fireEvent('destroy', this);
        this.purgeListeners();
    }

    //available to override
    ,onDestroy: Ext.emptyFn
    
    //available to override
    ,onInit: Ext.emptyFn

});
//register plugin
Ext.reg('disablerow', Ext.ux.grid.DisableRow);