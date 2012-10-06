//this fixes a bug where tree nodes that are marked expandable false can still be expanded via user actions
Ext.override(Ext.tree.View, {
    toggle: function(record) {
        //PATCH added this if statement
        if (record.data.expandable) {
          this[record.isExpanded() ? 'collapse' : 'expand'](record);
        }
    },
    /**
     * Expands a record that is loaded in the view.
     * @param {Ext.data.Model} record The record to expand
     * @param {Boolean} deep (optional) True to expand nodes all the way down the tree hierarchy.
     * @param {Function} callback (optional) The function to run after the expand is completed
     * @param {Object} scope (optional) The scope of the callback function.
     */
    expand: function(record, deep, callback, scope) {
        //PATCH added this if statement
        if (record.data.expandable) {
          return record.expand(deep, callback, scope);
        }
    },

    /**
     * Collapses a record that is loaded in the view.
     * @param {Ext.data.Model} record The record to collapse
     * @param {Boolean} deep (optional) True to collapse nodes all the way up the tree hierarchy.
     * @param {Function} callback (optional) The function to run after the collapse is completed
     * @param {Object} scope (optional) The scope of the callback function.
     */
    collapse: function(record, deep, callback, scope) {
        //PATCH added this if statement
        if (record.data.expandable) {
          return record.collapse(deep, callback, scope);
        }
    }

});