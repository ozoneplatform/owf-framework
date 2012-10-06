Ext.define('Ozone.components.dd.WidgetDragZone', {
    extend: 'Ext.dd.DragZone',

    ddGroup: 'widgets',
//                containerScroll: true,

//    view: null,
//    store: null,
//    itemSelector: null,

    constructor: function (el, config) {
        this.callParent(el, config);

        if (this.extraGroups != null) {
            var groups = [].concat(this.extraGroups);
            for (var i = 0; i < groups.length; i++) {
                this.addToGroup(groups[i]);
            }
        }

    },

    getDragData: function (e) {
        var v = this.view;
        var sourceEl = e.getTarget(v.itemSelector);
        if (sourceEl) {
            var index = v.indexOf(sourceEl);
            var d = Ext.fly(sourceEl).down('img').dom.cloneNode(true);
            d.id = Ext.id();
            return {
                ddel: d,
                sourceEl: sourceEl,
                repairXY: Ext.fly(sourceEl).getXY(),
                sourceStore: v.store,
                view: v,
                origIdx: index,
                lastIdx: index,
                widgetModel: v.getRecord(sourceEl)
            };
        }
    },

    getRepairXY: function () {
        return this.dragData.repairXY;
    },

//                onBeforeDrag: function(data,e) {
//                    return true;
//                },

    onStartDrag: function (x, y) {
        this.view.fireEvent('dragStarted', this.view.dragZone, this.disableDragLaunching);
    },

    endDrag: function () {
        this.view.fireEvent('dragEnd', this.view.dragZone);
    },

    afterInvalidDrop: function (e, id) {
        this.view.fireEvent('invalidDrop');
    }

});