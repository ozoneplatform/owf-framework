Ext.define('Ext.ux.RadioColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.radiocolumn',
    _radioCls: Ext.baseCSSPrefix + 'grid-column-radio',
    _radioClsOn: Ext.baseCSSPrefix + 'grid-column-radio-on',
    _radioClsOff: Ext.baseCSSPrefix + 'grid-column-radio-off',
    _radioClsOver: Ext.baseCSSPrefix + 'grid-column-over',
    
    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
            var record = view.panel.store.getAt(recordIndex);
            var isDisabled = this.cellDisabled(view, record);
            if (!isDisabled) {
                record.set(this.dataIndex, true);
                this.fireEvent('change',this,record);
                for (var i = 0; i < view.panel.store.data.items.length; i++) {
                    record = view.panel.store.getAt(i);
                    // Only allow one to be selected at a time
                    if (i !== recordIndex) {
                        record.set(this.dataIndex, false);
                    }
                }
            }
       
            // cancel selection.
            return false;
        } else if(type == 'mouseover') {
        	var thisCellNode = Ext.fly(cell);
        	thisCellNode.addCls(this._radioClsOver);
        	return this.callParent(arguments);
        } else if(type == 'mouseout') {
			var thisCellNode = Ext.fly(cell);
        	thisCellNode.removeCls(this._radioClsOver);
        	return this.callParent(arguments);
        } else {
            return this.callParent(arguments);
        }
    },
    
    cellDisabled : function(view, record) {return false;}, // this should be overridden

    renderer : function(value, metaData, record, rowIndex, colIndex, store) {
        var thisColumn = this.columns[colIndex];
        var cls = [thisColumn._radioCls];
        if (!value || 'false' == value) {
            cls.push(thisColumn._radioClsOff);
        } else {
            cls.push(thisColumn._radioClsOn);
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    }
    
});
