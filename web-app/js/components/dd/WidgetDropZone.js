Ext.define('Ozone.components.dd.WidgetDropZone', {
    extend: 'Ext.dd.DropZone',

    ddGroup: 'widgets',

//    extraGroups: null,
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

    getTargetFromEvent: function (e) {
        return e.getTarget(this.itemSelector);
    },

    // On entry into a target node
    onNodeEnter: function (target, dd, e, data) {
    },

    // On exit from a target node
    onNodeOut: function (target, dd, e, data) {
        Ext.fly(target).removeCls(['drag-cls', 'x-view-drop-indicator-right', 'x-view-drop-indicator-left']);
    },

    onNodeOver: function (target, dd, e, data) {
        var pt = this.getDropPoint(e, target, dd);
        if (pt == 'before') {
            Ext.fly(target).replaceCls('x-view-drop-indicator-right', 'x-view-drop-indicator-left');
        }
        else {
            Ext.fly(target).replaceCls('x-view-drop-indicator-left', 'x-view-drop-indicator-right');
        }
        return Ext.dd.DropZone.prototype.dropAllowed;
    },

    onNodeDrop: function (target, dd, e, data) {
        var v = this.view;

        //figure out which side of the target widget the new widget is to be added at
        var pt = this.getDropPoint(e, target, dd);

        //check if the origin view is the same as the target view
        if (v == data.view) {
            //if so remove the widget being dragged
            data.sourceStore.remove(data.widgetModel);
        }

        //check if the widget being dragged is in the dest view's store
        var existingWidgetIndex = v.store.findExact('widgetGuid', data.widgetModel.get('widgetGuid'));
        if (existingWidgetIndex > -1) {
            //remove it if found
            v.store.removeAt(existingWidgetIndex);
        }

        //now determine where to insert the new widget based on the target of the drag
        var targetIndex = v.indexOf(target);
        var record = v.store.getAt(targetIndex);

        //if the drop point is after the target widget(the widget being hovered over) then increment the index
        //so the dropped widget appears after the target widget
        if (pt == 'after') {
            targetIndex++;
        }
        v.store.insert(targetIndex, [data.widgetModel]);
        v.refresh();

        data.view.fireEvent('drag', v, record, target, targetIndex, e);

        return true;
    },

    onContainerOver: function (source, e, data) {
        return Ext.dd.DropZone.prototype.dropAllowed;

    },
    onContainerDrop: function (source, e, data) {
        var existingWidgetIndex = this.view.store.findExact('widgetGuid', data.widgetModel.get('widgetGuid'));
        if (existingWidgetIndex > -1) {
            //remove it if found
            this.view.store.removeAt(existingWidgetIndex);
        }
        this.view.store.add(data.widgetModel);
    },

    // determines whether the cursor is over the left (before) or right (after) side of the target
    getDropPoint: function (e, target, dd) {
        if (target == this.view.el.dom) {
            return "before";
        }
        var t = Ext.fly(target).getX(), b = t + target.offsetWidth;
        var c = t + (b - t) / 2;
        var y = e.getX();
        if (y <= c) {
            return "before";
        }
        else {
            return "after";
        }
    }
});