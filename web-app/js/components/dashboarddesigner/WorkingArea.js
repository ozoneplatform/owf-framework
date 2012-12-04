Ext.define('Ozone.components.dashboarddesigner.WorkingArea', {
    extend: 'Ext.container.Container',
    alias: [
        'widget.dashboarddesignerworkingarea',
        'widget.Ozone.components.dashboarddesigner.WorkingArea'
    ],

    mixins: {
        circularFocus: 'Ozone.components.focusable.CircularFocus'
    },

    componentCls: 'droppable',

    initComponent: function() {
        this.on({
            paneselect: {
                fn: this.paneSelected,
                scope: this
            }
        });

        this.callParent(arguments);
    },

    paneSelected: function(pane) {
        var sibling;

        sibling = pane.getNextPane();

        // just 1 pane
        if(!sibling)
            return;

        if(this._lastClickedPane && !this._lastClickedPane.isDestroyed)
            this._lastClickedPane.el.removeCls('active-pane');
        
        if(this._lastClickedPaneSibling && !this._lastClickedPaneSibling.isDestroyed)
            this._lastClickedPaneSibling.el.removeCls('sibling-active-pane');

        this._lastClickedPane = pane;
        this._lastClickedPaneSibling = sibling;

        pane.el.addCls('active-pane');
        sibling.el.addCls('sibling-active-pane');
    }
    
});
