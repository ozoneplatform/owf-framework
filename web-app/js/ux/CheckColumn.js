/**
 * @class Ext.ux.CheckColumn
 * @extends Ext.grid.column.Column
 * <p>A Header subclass which renders a checkbox in each column cell which toggles the truthiness of the associated data field on click.</p>
 * <p><b>Note. As of ExtJS 3.3 this no longer has to be configured as a plugin of the GridPanel.</b></p>
 * <p>Example usage:</p>
 * <pre><code>
// create the grid
var grid = new Ext.grid.GridPanel({
    ...
    columns: [{
           text: 'Foo',
           ...
        },{
           xtype: 'checkcolumn',
           text: 'Indoor?',
           dataIndex: 'indoor',
           width: 55
        }
    ]
    ...
});
 * </code></pre>
 * In addition to toggling a Boolean value within the record data, this
 * class adds or removes a css class <tt>'x-grid-checked'</tt> on the td
 * based on whether or not it is checked to alter the background image used
 * for a column.
 */
Ext.define('Ext.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumn',
    checkbox: true,
    _checkBoxCls: Ext.baseCSSPrefix + 'grid-column-checkbox',
    _checkBoxClsOn: Ext.baseCSSPrefix + 'grid-column-checkbox-on',
    _checkBoxClsOff: Ext.baseCSSPrefix + 'grid-column-checkbox-off',
    _checkBoxClsOver: Ext.baseCSSPrefix + 'grid-column-over',
    
    //can be set by the caller to enable a particular key to
    //toogle the checkbox
    toggleKey: null,

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        if (type == 'mousedown' 
            || (type == 'keydown' && toggleKey && e.getKey() == togleKey)) {
            var record = view.panel.store.getAt(recordIndex);
            var checked = record.data[this.dataIndex];

            var isDisabled = this.cellDisabled(record);
            if (!isDisabled) {
            record.set(this.dataIndex, !checked);
            if (checked) {
                this.onUnchecked(view, record);
            } else {
                this.onChecked(view, record);
            }
            }
            // cancel selection.
            return false;
        } else if(type == 'mouseover') {
        	var thisCellNode = Ext.fly(cell);
        	thisCellNode.addCls(this._checkBoxClsOver);
        	return this.callParent(arguments);
        } else if(type == 'mouseout') {
			var thisCellNode = Ext.fly(cell);
        	thisCellNode.removeCls(this._checkBoxClsOver);
        	return this.callParent(arguments);
        } else {
            return this.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value, metaData, record, rowIndex, colIndex, store){
        var thisColumn = this.columns[colIndex];
        var cls = [thisColumn._checkBoxCls];
        if (!value || 'false' == value) {
            cls.push(thisColumn._checkBoxClsOff);
        } else {
            cls.push(thisColumn._checkBoxClsOn);
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    },
    
    onGridHeaderCtClick : function(grid, e, t){
        e.stopEvent();
        var thisNode = Ext.fly(t);
        var clickedCheckbox = (thisNode.hasCls(this._checkBoxClsOn) || thisNode.hasCls(this._checkBoxClsOff)) ? true : false;
        if (clickedCheckbox) {
	        var isChecked = thisNode.hasCls(this._checkBoxClsOn);
	        if(isChecked){
	            thisNode.removeCls(this._checkBoxClsOn);
	            thisNode.addCls(this._checkBoxClsOff);
	            this.clearSelections(grid);
	        }else{
	            thisNode.removeCls(this._checkBoxClsOff);
	            thisNode.addCls(this._checkBoxClsOn);
	            this.selectAll(grid);
	        }
        }
    },
    
    clearSelections : function(grid) {
      var view = grid.getView();
      for (var i = 0, len = grid.store.data.items.length; i < len; i++) {
        var record = grid.store.getAt(i);
        var isDisabled = this.cellDisabled(record);
        if (!isDisabled) {
          if (this.dataIndex == "removed") {
            record.set(this.dataIndex, false);
            view.removeRowCls(i, "x-item-disabled");
          }
          else {
            var isRemoved = record.get("removed");
            if (!isRemoved) {
              record.set(this.dataIndex, false);
              this.onUnchecked(view, record);
            }
          }
        }
      }
    },
    
    selectAll : function(grid) {
        var view = grid.getView();
        for (var i = 0, len = grid.store.data.items.length; i < len; i++) {
          var record = grid.store.getAt(i);
          var isDisabled = this.cellDisabled(record);
          if (!isDisabled) {
            if (this.dataIndex == "removed") {
              record.set(this.dataIndex, true);
              view.addRowCls(i, "x-item-disabled");
            }
            else {
              var isRemoved = record.get("removed");
              if (!isRemoved) {
                record.set(this.dataIndex, true);
                this.onChecked(view, record);
              }
            }
          }
        }
      },
    
    cellDisabled : function(record) { return false; },	// this should be overridden
    
    onChecked: function(view, record) {}, // This should be overridden

    onUnchecked: function(view, record) {} // This should be overridden
});
