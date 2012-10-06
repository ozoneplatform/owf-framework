Ext.define('Ozone.components.view.DDView', {
    extend: 'Ozone.components.focusable.FocusableView',

    alias: 'widget.ddview',

    store: null,

    ddGroup: null,
    disableDragAndDrop: false,
    disableDragLaunching: false,

    indicatorHtml: '<div class="x-view-drop-indicator-left"></div><div class="x-view-drop-indicator-right"></div>',
    indicatorCls: 'x-view-drop-indicator',

    dragImgSelector: 'img',

    initComponent: function () {

        this.disabledItems = Ext.create('Ext.util.MixedCollection');

        this.defaultFilterFunction = function(rec, id) {
            return rec.get('visible') && rec.get('definitionVisible');
        };
        this.filterFunction = this.defaultFilterFunction;

        this.on('render', this.setupDragZone);

        this.callParent(arguments);


        this.addEvents(['dragStarted', 'dragEnd', 'invalidDrop']);
        this.enableBubble(['dragStarted', 'dragEnd', 'invalidDrop']);
    },

    refresh: function() {
        this.callParent(arguments);
        if (this.sizeCfg) this.setItemSize(this.sizeCfg);
    },

    setupDragZone: function() {
        var v = this;

        if (!this.disableDragAndDrop) {
            var dragProxy = Ext.create('Ext.dd.StatusProxy', {
                shadow: false
            });

            v.dragZone = new Ext.dd.DragZone(v.getEl(), {
                ddGroup: this.ddGroup,
                proxy: dragProxy,

                getDragData: function(e) {
                    var sourceEl = e.getTarget(v.itemSelector);
                    if (sourceEl) {
                        var index = v.indexOf(sourceEl);
                        //d = sourceEl.cloneNode(true);
                        var d = v.dragImgSelector === '.' ?
                            Ext.fly(sourceEl).dom.cloneNode(true) : 
                            Ext.fly(sourceEl).down(v.dragImgSelector).dom.cloneNode(true);

                        Ext.fly(d).addCls('widget-drag-proxy');
                        
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

                getRepairXY: function() {
                    return this.dragData.repairXY;
                },

//                onBeforeDrag: function(data,e) {
//                    return true;
//                },

                onStartDrag: function(x,y) {
                    v.fireEvent('dragStarted', v.dragZone, this.disableDragLaunching);
                },

                endDrag: function() {
                    v.fireEvent('dragEnd', v.dragZone);
                },

                afterInvalidDrop: function (e, id) {
                    v.fireEvent('invalidDrop');
                }
            });

            v.dropZone = new Ext.dd.DropZone(v.getEl(), {
                ddGroup: this.ddGroup,

                getTargetFromEvent: function(e) {
                    return e.getTarget(v.itemSelector);
                },

                // On entry into a target node
                onNodeEnter : function(target, dd, e, data) {
                },

                // On exit from a target node
                onNodeOut : function(target, dd, e, data) {
                    Ext.fly(target).removeCls(['drag-cls', 'x-view-drop-indicator-right', 'x-view-drop-indicator-left']);
                    /*index = v.indexOf(target);
                     record = v.store.getAt(index);

                     v.store.remove(data.data);
                     v.store.insert(data.origIdx, data.data);
                     v.refresh();*/

                },

                onNodeOver : function(target, dd, e, data) {
                    var pt = v.getDropPoint(e, target, dd);
                    if (pt == 'before') {
                        Ext.fly(target).replaceCls('x-view-drop-indicator-right', 'x-view-drop-indicator-left');
                    }
                    else {
                        Ext.fly(target).replaceCls('x-view-drop-indicator-left', 'x-view-drop-indicator-right');
                    }
                    return Ext.dd.DropZone.prototype.dropAllowed;
                },

                onNodeDrop : function(target, dd, e, data) {
                    //figure out which side of the target widget the new widget is to be added at
                    var pt = v.getDropPoint(e, target, dd);

                    //check if the origin view is the same as the target view
                    if (v == data.view) {
                        //if so remove the widget being dragged
                        data.sourceStore.remove(data.widgetModel);
                    }

                    //check if the widget being dragged is in the dest view's store
                    var existingWidgetIndex = v.store.findExact('widgetGuid',data.widgetModel.get('widgetGuid'));
                    if (existingWidgetIndex > -1) {
                        //remove it if found
                        v.store.removeAt(existingWidgetIndex);
                    }

                    //now determine where to insert the new widget based on the target of the drag
                    var targetIndex = v.indexOf(target);
                    var record = v.store.getAt(targetIndex);


//                    data.lastIdx = index;

                    //if the drop point is after the target widget(the widget being hovered over) then increment the index
                    //so the dropped widget appears after the target widget
                    if (pt == 'after') {
                        targetIndex++;
                    }
                    v.store.insert(targetIndex, [data.widgetModel]);
                    //v.refresh();

                    data.view.fireEvent('drag', v, record, target, targetIndex, e);
                    return true;
                }

//                onContainerOver: function (source, e, data) {
//                    return Ext.dd.DropZone.prototype.dropAllowed;
//
//                },
//                onContainerDrop: function (source, e, data) {
//                    v.store.add(data.widgetModel);
//                }

            });
        }

    },

    onItemKeyDown: function (record, item, index, evt) {
        //left bracket
        if (evt.getKey() == 219) {
          //move item left
            if (index > 0) {
                this.store.removeAt(index);
                this.store.insert(index - 1,record);
                this.select(record);
            }
        }
        //right bracket
        else if (evt.getKey() == 221) {
            if (index < this.store.getCount()) {
                this.store.removeAt(index);
                this.store.insert(index + 1, record);
                this.select(record);
            }
        }

    },

    // determines whether the cursor is over the left (before) or right (after) side of the target
    getDropPoint : function(e, target, dd) {
        if (target == this.el.dom) {
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
    },

    defaultFilter: function() {
        this.filterFunction = this.defaultFilterFunction
        this.store.filter({filterFn: this.filterFunction});
    },

    enableAllItems: function() {
        if (this.rendered) {
            for (var i = 0; i < this.disabledItems.getCount(); i++) {
                var item = this.el.down("#" + this.disabledItems.getAt(i));
                if (item != null) {
                    var img = item.down('img');
                    if (img != null) {
                        img.applyStyles('zoom: 1; filter: alpha(opacity=100);opacity:1.0;');
                    }
                }
            }
        }
    },

    enableItem: function(widgetDefId) {
        if (this.rendered) {
            //search for widget node
            var item = this.el.down("#" + widgetDefId);

            //if node was found search for img
            if (item != null) {
                //remove from our disabledItems collection
                this.disabledItems.removeAtKey(widgetDefId);

                //search for img and set style
                var img = item.down('img');
                if (img != null) {
                    img.applyStyles('zoom: 1; filter: alpha(opacity=100);opacity:1.0;');
                }
            }
        }
    },

    disableItem: function(widgetDefId) {
        if (this.rendered) {
            //search for widget node
            var item = this.el.down("#" + widgetDefId);

            //if node was found search for img
            if (item != null) {

                //remember that this item was disabled
                this.disabledItems.add(widgetDefId, widgetDefId);

                //search for img and set style
                var img = item.down('img');
                if (img != null) {
                    img.applyStyles('zoom: 1;filter: alpha(opacity=20);opacity: 0.2;');
                }
            }
        }
    },

    // last three params are optional; clearFilter defaults true and searchTag/searchDescr default false
    searchByText: function(item, newText, clearFilter, searchTag, searchDescr) {
        clearFilter = (clearFilter !== null) ? clearFilter : true;
        searchTag = (searchTag !== null) ? searchTag : false;
        searchDescr = (searchDescr !== null) ? searchDescr : false;


        if (clearFilter) {
            this.store.clearFilter(true);
        }

        if (newText === '' || newText === null) {
            this.filterFunction = this.defaultFilterFunction;
            item.loadViewStore();
            item.widgetSelect(item.lastSelected);
            return this.filterFunction;
        }
        else if (searchTag) {
            this.filterFunction = Ext.bind(function(rec, id) {
                return this.searchByTagFilter(newText, rec, id);
            }, this);
        }
        else {
            this.filterFunction = Ext.bind(function(rec, id) {
                return this.searchByTextFilter(newText, rec, id, searchDescr);
            }, this);
        }

        this.store.filter({filterFn: this.filterFunction});
        //this.refresh();

        return this.filterFunction;
    },

    //private
    searchByTextFilter: function(newText, rec, id, searchDescr) {
        var regex = new RegExp(newText, 'i');

        if ((rec.get('name').match(regex)) && rec.get('visible') && rec.get('definitionVisible')) {
            return rec;
        }
    },

    //private
    searchByTagFilter: function(newText, rec, id) {
        //var regex = new RegExp(newText, 'i');

        var tags = rec.get('tags');
        var matchedTag = false;
        for (var i = 0; i < tags.length; i++) {
            newText = newText.replace("_", " ");
            if (tags[i].name == newText) {
                matchedTag = true;
            }
        }

        if (matchedTag && rec.get('visible') && rec.get('definitionVisible')) {
            return rec;
        }
    },

    /**
     * sets width and height for each element in the view.  Accepts an
     * object where the keys are element CSS selectors and the values are
     * objects containing the height and width to apply to the elements
     * matched by the corresponding selectors.  All CSS selectors are relative
     * to the nodes returned by this.getNodes().  The string '.' is treated
     * specially when passed as a selector here.  it refers to the nodes
     * returned by this.getNodes().
     */
    setItemSize: function(sizeCfg) {
        this.sizeCfg = sizeCfg;

        Ext.Object.each(sizeCfg, function(elName, sizeObj) {
            if (sizeObj) this.setElementSize(sizeObj.width, sizeObj.height, elName);
        }, this);

    },

    /**
     * @private
     */
    setElementSize: function(width, height, sizeElSelector) {
        var nodes = new Ext.CompositeElementLite(this.getNodes());

        if (typeof sizeElSelector === 'undefined')
            sizeElSelector = this.sizeElSelector;

        //if widthElSelect is defined, use it to get subelements
        if (sizeElSelector !== '.') {
            var parentNodes = nodes;
            nodes = new Ext.CompositeElementLite();

            parentNodes.each(function(parentNode) {
                nodes.add(parentNode.select(sizeElSelector));
            }, this);
        }

        if (width) nodes.setWidth(width);
        if (height) nodes.setHeight(height);
    }

});
