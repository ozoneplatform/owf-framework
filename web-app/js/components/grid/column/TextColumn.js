/**
 * @class Ext.grid.column.TextColumn
 * @extends Ext.grid.column.Column
 */
Ext.define('Ext.grid.column.TextColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.textcolumn',
    _textBoxClsOver: Ext.baseCSSPrefix + 'grid-column-over',
    
    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
    	if(type == 'mouseover') {
        	var thisCellNode = Ext.fly(cell);
        	thisCellNode.addCls(this._textBoxClsOver);
        	return this.callParent(arguments);
        } else if(type == 'mouseout') {
			var thisCellNode = Ext.fly(cell);
        	thisCellNode.removeCls(this._textBoxClsOver);
        	return this.callParent(arguments);
        } else {
            return this.callParent(arguments);
        }
    }
});
