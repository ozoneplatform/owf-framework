Ext.ux.CheckboxCellSelectionModel = function(config){
    Ext.apply(this, config);
    
    this.addEvents(
        /**
         * @event beforecellselect
         * Fires when a cell is being selected, return false to cancel.
         * @param {Ext.ux.CheckboxCellSelectionModel} this
         * @param {Array} cellInfo An array of cell indices ([rowIndex, columnIndex])
         * @param {Boolean} keepExisting False if other selections will be cleared
         */
        "beforecellselect",
        /**
         * @event cellselect
         * Fires when a cell is selected.
         * @param {Ext.ux.CheckboxCellSelectionModel} this
         * @param {Array} cellInfo An array of cell indices ([rowIndex, columnIndex])
         */
        "cellselect"
    );

    Ext.ux.CheckboxCellSelectionModel.superclass.constructor.call(this);
};



Ext.extend(Ext.ux.CheckboxCellSelectionModel, Ext.grid.CheckboxSelectionModel,   {
	
  	/**
     * @cfg {Boolean} moveEditorOnEnter
     * False to turn off moving the editor to the next cell when the enter key is pressed
     */

    // private
    initEvents : function(){
		if(!this.grid.enableDragDrop && !this.grid.enableDrag){
            this.grid.on("cellmousedown", this.handleCellMouseDown, this);
        }else{ // allow click to work like normal
            this.grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
                if(e.button === 0 && !e.shiftKey && !e.ctrlKey) {
                    this.selectCell([rowIndex, columnIndex], false);
                    this.selectRow(rowIndex, false);
                    grid.view.focusRow(rowIndex);
                }
            }, this);
        }
       
       this.rowNav = new Ext.KeyNav(this.grid.getGridEl(), {
            "up" : function(e){
                if(!e.shiftKey){
                    this.selectPrevious(e.shiftKey);
                }else if(this.last !== false && this.lastActive !== false){
                    var last = this.last;
                    this.selectRange(this.last,  this.lastActive-1);
                    this.grid.getView().focusRow(this.lastActive);
                    if(last !== false){
                        this.last = last;
                    }
                }else{
                    this.selectFirstRow();
                }
            },
            "down" : function(e){
                if(!e.shiftKey){
                    this.selectNext(e.shiftKey);
                }else if(this.last !== false && this.lastActive !== false){
                    var last = this.last;
                    this.selectRange(this.last,  this.lastActive+1);
                    this.grid.getView().focusRow(this.lastActive);
                    if(last !== false){
                        this.last = last;
                    }
                }else{
                    this.selectFirstRow();
                }
            },
            scope: this
        });

        var view = this.grid.view;
        view.on("refresh", this.onRefresh, this);
        view.on("rowupdated", this.onRowUpdated, this);
        view.on("rowremoved", this.onRemove, this);
    	this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
            Ext.fly(view.innerHd).on('mousedown', this.onHdMouseDown, this);

        }, this);
    },

    // private
    handleCellMouseDown : function(g, rowIndex, columnIndex, e){
        if(e.button !== 0 || this.isLocked()){
            return;
        };
        this.selectCell([rowIndex, columnIndex], e.ctrlKey || e.shiftKey);
        this.handleMouseDown(g, rowIndex, e);
    },

    /**
     * Selects a cell.
     * @param {Array} cell The index of the cell ([rowIndex, columnIndex]) to select
     * @param {Boolean} keepExisting (optional) True to keep existing selections
     */
    selectCell : function(index, keepExisting, preventViewNotify){
        if (this.locked) return;
        var row = index[0];
        var col = index[1];
        if (row < 0 || row >= this.grid.store.getCount()) return;
        if (col < 0 || col >= this.grid.getColumnModel().getColumnCount()) return;

        if (this.fireEvent("beforecellselect", this, index, keepExisting) !== false) {
            this.fireEvent("cellselect", this, index);
        }
    }
});