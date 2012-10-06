Ext.define('Ozone.components.focusable.FocusableGridPanel', {
    extend: 'Ext.AbstractPlugin', 

    init: function (gridpanel) {
        var view = gridpanel.getView();
        if (view !== null) {
            view.on('afterrender', function(cmp) {
                var el = cmp.getEl();

                el.dom.tabIndex = gridpanel.isDisabled() ? -1 : 0;

                //if a mouse click happens disable the focus select logic
                view.on({
                   beforeitemmousedown: {
                     fn: function(v, record, item, index, e, eOpts) {
                       this.disableFocusSelect = true;
                     },
                     scope: view
                   }
                });

                el.on('focus', function() {
                    //only select the first row in the grid if there was no selection, there are available items
                    //and this focus was not caused by a mouse click (clicking on the grid should select/deselect
                    //the row that was actually clicked on)
                    if (this.getSelectedNodes().length === 0 && this.getNodes().length > 0 && !this.disableFocusSelect) {
                        this.select(0);
                    }
                    this.addCls('x-grid-view-focus');
                    this.disableFocusSelect = false;
                }, view);

                //if the default of mousedown is prevented,
                //which happens in customize deashboard for dragging
                //reasons, then we need to manually cause focus
                el.on('click', function () {
                    this.focus();
                }, el);

                el.on('blur', function() {
                    view.removeCls('x-grid-view-focus');
                }, view);
            }, gridpanel);
        }

        gridpanel.on('edit', function() {
            this.getView().focus();
        }, gridpanel);

        gridpanel.on('disable', function () {
            this.getEl().dom.tabIndex = -1;
        }, view);
        
        gridpanel.on('enable', function () {
            this.getEl().dom.tabIndex = 0;
        }, view);
    }
});
