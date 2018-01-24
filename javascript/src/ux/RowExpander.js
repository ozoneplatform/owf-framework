// feature idea to enable Ajax loading and then the content
// cache would actually make sense. Should we dictate that they use
// data or support raw html as well?

/**
 * @class Ext.ux.RowExpander
 * @extends Ext.grid.Header
 * Plugin (ptype = 'rowexpander') that adds the ability to have a Column in a grid which enables
 * a second row body which expands/contracts.  The expand/contract behavior is configurable to react
 * on clicking of the column, double click of the row, and/or hitting enter while a row is selected.
 *
 * @ptype rowexpander
 */
Ext.define('Ext.ux.RowExpander', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.rowexpander',
        
    rowBodyTpl: null,
    
    /**
     * @cfg {Boolean} expandOnEnter
     * <tt>true</tt> to toggle selected row(s) between expanded/collapsed when the enter
     * key is pressed (defaults to <tt>true</tt>).
     */
    expandOnEnter: true,
    
    /**
     * @cfg {Boolean} expandOnDblClick
     * <tt>true</tt> to toggle a row between expanded/collapsed when double clicked
     * (defaults to <tt>true</tt>).
     */
    expandOnDblClick: true,
    
    rowBodyTrSelector: '.x-grid-rowbody-tr',
    rowBodyHiddenCls: 'x-grid-row-body-hidden',
    rowCollapsedCls: 'x-grid-row-collapsed',
    
    
    
    renderer: function(value, metadata, record, rowIdx, colIdx) {
        if (colIdx === 0) {
            metadata.tdCls = 'x-grid-td-expander';
        }
        return '<div class="x-grid-row-expander">&#160;</div>';
    },
    
    constructor: function() {
        this.callParent(arguments);
        var grid = this.getCmp();
        this.recordsExpanded = {};
        // <debug>
        if (!this.rowBodyTpl) {
            throw "RowExpander: rowBodyTpl is not defined.";
        }
        // </debug>
        // TODO: if XTemplate/Template receives a template as an arg, should
        // just return it back!
        var rowBodyTpl = new Ext.XTemplate(this.rowBodyTpl);
        
        grid.features = [{
            ftype: 'rowbody',
            columnId: this.getHeaderId(),
            recordsExpanded: this.recordsExpanded,
            rowBodyHiddenCls: this.rowBodyHiddenCls,
            rowCollapsedCls: this.rowCollapsedCls,
            getAdditionalData: this.getRowBodyFeatureData,
            getRowBodyContents: function(data) {
                return rowBodyTpl.applyTemplate(data);
            }
        },{
            ftype: 'rowwrap'
        }];

        grid.columns.unshift(this.getHeaderConfig());
        grid.on('afterlayout', this.onGridAfterLayout, this, {single: true});
    },
    
    getHeaderId: function() {
        if (!this.headerId) {
            this.headerId = Ext.id();
        }
        return this.headerId;
    },
    
    getRowBodyFeatureData: function(data, idx, record, orig) {
        var o = Ext.grid.feature.RowBody.prototype.getAdditionalData.apply(this, arguments),
            id = this.columnId;
        o.rowBodyColspan = o.rowBodyColspan - 1;
        o.rowBody = this.getRowBodyContents(data);
        o.rowCls = this.recordsExpanded[record.internalId] ? '' : this.rowCollapsedCls;
        o.rowBodyCls = this.recordsExpanded[record.internalId] ? '' : this.rowBodyHiddenCls;
        o[id + '-tdAttr'] = ' valign="top" rowspan="2" ';
        if (orig[id+'-tdAttr']) {
            o[id+'-tdAttr'] += orig[id+'-tdAttr'];
        }
        return o;
    },
    
    onGridAfterLayout: function() {
        var grid = this.getCmp(),
            view, viewEl;
            
        if (!grid.hasView) {
            this.getCmp().on('afterlayout', this.onGridAfterLayout, this, {single: true});
        } else {
            view = grid.down('gridview');
            viewEl = view.getEl();
            
            if (this.expandOnEnter) {
                this.keyNav = new Ext.KeyNav(viewEl, {
                    'enter' : this.onEnter,
                    scope: this
                });
            }
            if (this.expandOnDblClick) {
                view.on('dblclick', this.onDblClick, this);
            }
            viewEl.on('click', this.onViewElClick, this, {delegate: '.x-grid-row-expander'});
            this.view = view;
        }
    },
    
    onViewElClick : function(e, t){
        e.stopEvent();
        var row = e.getTarget('.x-grid-row');
        this.toggleRow(row);
    },
    
    onEnter: function(e) {
        var view = this.view,
            ds   = view.store,
            sm   = view.getSelectionModel(),
            sels = sm.getSelection(),
            ln   = sels.length,
            i = 0,
            rowIdx;
            
        for (; i < ln; i++) {
            rowIdx = ds.indexOf(sels[i]);
            this.toggleRow(rowIdx);
        }
    },
    
    toggleRow: function(rowIdx) {
        var rowNode = this.view.getNode(rowIdx),
            row = Ext.get(rowNode),
            nextBd = Ext.get(row).down(this.rowBodyTrSelector),
            record = this.view.getRecord(rowNode);
            
        if (row.hasCls(this.rowCollapsedCls)) {
            row.removeCls(this.rowCollapsedCls);
            nextBd.removeCls(this.rowBodyHiddenCls);
            this.recordsExpanded[record.internalId] = true;
            this.view.fireEvent('expandbody');
        } else {
            row.addCls(this.rowCollapsedCls);
            nextBd.addCls(this.rowBodyHiddenCls);
            this.recordsExpanded[record.internalId] = false;
            this.view.fireEvent('collapsebody');
        }
        this.view.up('gridpanel').invalidateScroller();
    },
    
    onDblClick: function(view, cell, rowIdx, cellIndex, e) {
        this.toggleRow(rowIdx);
    },
    
    getHeaderConfig: function() {
        return {
            id: this.getHeaderId(),
            width: 24,
            sortable: false,
            fixed: true,
            hideable: false,
            menuDisabled: true,
            cls: Ext.baseCSSPrefix + 'grid-header-special',
            renderer: function(value, metadata) {
                metadata.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
                
                return '<div class="' + Ext.baseCSSPrefix + 'grid-row-expander">&#160;</div>';
            }
        };
    }
});