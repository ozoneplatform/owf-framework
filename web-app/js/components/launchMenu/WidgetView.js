/**
 * This class is component which contains both a icon widget view and a widget grid in a card layout
 */
Ext.define('Ozone.components.launchMenu.WidgetView', {
    extend:'Ext.Container',
    alias:'widget.widgetview',

    alreadyOpenedWidget: false,
    disableDragAndDrop: false,
    disableDragLaunching: false,

    initComponent:function () {
        var me = this;

        //create a copy of the widgetstore for the widget grid
        this.gridStore = Ext.create('Ozone.data.WidgetStore', {
            sorters:[
                {
                    property:'name',
                    direction:'ASC'
                }
            ]
        });
        //add data from widgetStore
        this.gridStore.add(this.widgetStore.getRange());

        //todo if we ever do paging or inf scrolling this store will need to independently query,filter,and sort server side
        //bind events add and remove events on widgetStore to gridStore
        this.widgetStore.on({
            datachanged:{
                fn:function (store, eOpts) {
                    this.gridStore.removeAll();
                    this.gridStore.add(store.getRange());
                    this.gridStore.sort(this.gridStore.getSorters());
                },
                scope:this
            }
        });


        Ext.apply(this, {
            layout:{
                type:'card',
                deferredRender:true
            },
            activeItem:0,
            items:[
                //widget icon view
                {
                    xtype:'ddview',
                    itemId:'view',
                    itemSelector:'.widget',
                    overItemCls:'widget-over',
                    selectedItemCls:'widget-selected',
                    trackOver:true,
                    singleSelect:true,
//                    multiSelect: true,
                    store:this.widgetStore,
                    disableDragAndDrop: this.disableDragAndDrop,
                    disableDragLaunching: this.disableDragLaunching,
                    autoScroll:true,
                    ddGroup:'widgets',
                    plugins:{
                        ptype:'instancevariablizer',
                        container:this
                    },
                    tpl:new Ext.XTemplate(
                        '<tpl for=".">',
                        '<div class="widget <tpl if="this.setDisabled(values)">widget-disabled</tpl>" >',
                        '<div class="thumb-wrap" id={widgetGuid}>',

                        '<img onerror="this.src = \'{[this.getDefaultIcon()]}\'" src="{[this.getIcon(xindex, values)]}" class="thumb" />',
                        '</div>',
                        '<div class="thumb-text">{[this.encodeAndEllipsize(values.name)]}</div>',
                        '</div>',
                        '</tpl>',
                        {
                            compiled:true,

                            setDisabled: function(values) {
                                var returnValue = false;

                                if (values.disabled !== null || values.disabled !== undefined) {
                                    returnValue = values.disabled;
                                }
                                else {
                                    var rec = me.widgetStore.getById(values.uniqueId);
                                    if (rec != null) {
                                        returnValue = rec.get('disabled');
                                    }
                                }

                                return returnValue;
                            },

                            getIcon:function (xindex, values) {
                                var icon = null;
                                if (values.image != null) {
                                    icon = encodeURI(decodeURI(values.image));
                                }
                                else {
                                    //me.widgetStore is a stateStore in this case
                                    var rec = me.widgetStore.getById(values.uniqueId);
                                    if (rec != null) {
                                        icon = encodeURI(decodeURI(rec.get('image')));
                                    }
                                }
                                return icon;
                            },
                            getDefaultIcon:function () {
                                return 'themes/common/images/settings/WidgetsIcon.png';
                            },
                            encodeAndEllipsize: function(str) {
                                //html encode the result since ellipses are special characters
                                return Ext.util.Format.htmlEncode(
                                    Ext.Array.map (
                                        //get an array containing the first word of rowData.name as one elem, and the rest of name as another
                                        Ext.Array.erase (/^([\S]+)\s*(.*)?/.exec(Ext.String.trim(str)), 0, 1),
                                        function(it) {
                                            //for each elem in the array, truncate it with an ellipsis if it is longer than 11 characters
                                            return Ext.util.Format.ellipsis(it, 11);
                                        }
                                    //join the array back together with spaces
                                    ).join(' ')
                                );
                            }
                        }
                    ),
                    listeners:{
                        itemclick:{
                            fn:function (view, record, elem, index, event, eOpts) {
                                Ext.apply(record.data,{
                                  alreadyOpenedWidget: this.alreadyOpenedWidget
                                });
                                this.fireEvent('itemclick', view, record, elem, index, event, eOpts);
                            },
                            scope:this
                        },
                        itemdblclick:{
                            fn:function (view, record, elem, index, event, eOpts) {
                                Ext.apply(record.data,{
                                  alreadyOpenedWidget: this.alreadyOpenedWidget
                                });
                                this.fireEvent('itemdblclick', view, record, elem, index, event, eOpts);
                            },
                            scope:this
                        },
                        itemkeydown: {
                            fn:function (view, record, item, index, event, eOpts) {
                                Ext.apply(record.data,{
                                  alreadyOpenedWidget: this.alreadyOpenedWidget
                                });
                                this.fireEvent('itemkeydown', view, record, item, index, event, eOpts);
                            },
                            scope:this
                        },
                        selectionchange: {
                            fn:function (selModel, records, eOpts) {
                                if (records.length > 0) {
                                    for (var i = 0 ; i < records.length ; i++) {
                                        var record = records[i];
                                        Ext.apply(record.data,{
                                          alreadyOpenedWidget: this.alreadyOpenedWidget
                                        });
                                    }
                                }
                                this.fireEvent('selectionchange', selModel, records, eOpts);
                            },
                            scope:this
                        }
                    }
                },

                //widget grid panel
                {
                    xtype:'grid',
                    store:this.gridStore,
                    itemId:'grid',
                    forceFit:true,
                    plugins: [
                        new Ozone.components.focusable.FocusableGridPanel(),
                        {
                            ptype: 'instancevariablizer',
                            container: this
                        }
                    ],
                    viewConfig: {
                        getRowClass: function(record, rowIndex, rowParams, store){
                            if (record.get('disabled')) {
                                return 'widget-disabled';
                            }
                            return '';
                        },
                        listeners: {
                            itemkeydown: {
                                fn:function (view, record, item, index, event, eOpts) {
                                    Ext.apply(record.data,{
                                      alreadyOpenedWidget: this.alreadyOpenedWidget
                                    });
                                    this.fireEvent('itemkeydown', view, record, item, index, event, eOpts);
                                },
                                scope:this
                            }
                        }
                    },
                    columns:[
                        {
                            header:'Icon',
                            renderer:function (val, metaData, record, rowIndex, colIndex, store, view) {
                                //todo consolidate references to this image
                                var defaultIcon = 'themes/common/images/settings/WidgetsIcon.png';

                                var icon = null;
                                if (val != null) {
                                    icon = encodeURI(val);
                                }
                                else {
                                    //if the val is null then get the image directly from the record
                                    //if this record is from a statestore it will lookup the right widgetdef
                                    //and return the image
                                    icon = encodeURI(record.get('image'));
                                }


                                //todo remove this hardcoded style
                                return '<img onerror="this.src = \''+defaultIcon+'\'" src="' + icon + '" style="width: 24px;height: 24px">';
                            },
                            dataIndex:'image',
                            flex:0,
                            width:45,
                            sortable:false
                        },
                        {
                            header:'Name',
                            dataIndex:'name',
                            renderer:function (val) {
                                return Ext.htmlEncode(val);
                            },
                            flex:0,
                            width:200
                        },
                        {
                            header:'Tags',
                            sortable: false,
                            renderer:function (val, metaData, record) {
                                var tagList = '';
                                if (val == null) {
                                     var rec = me.widgetStore.getById(record.get('uniqueId'));
                                     val = rec.get('tags');
                                }
                                for (var i = 0; i < val.length; i++) {
                                    var tag = (val[i]).name;
                                    if (i == val.length - 1) {
                                        tagList += tag;
                                    }
                                    else {
                                        tagList += tag + ",";
                                    }

                                }
                                return Ext.htmlEncode(tagList);
                            },
                            dataIndex:'tags',
                            flex:1
                        }
                    ],
                    listeners:{
                        render:{
                            fn:function (grid) {
                                //this should be done elsewhere
                                //this.filterGrid();

                                grid.enableBubble(['dragStarted', 'dragEnd', 'invalidDrop']);

                                if (!this.disableDragAndDrop) {
                                  grid.dragZone = new Ext.dd.DragZone(grid.getEl(), {
                                    ddGroup:'widgets',
                                    getDragData:function (e) {
                                        var sourceEl = e.getTarget(grid.getView().itemSelector);
                                        if (sourceEl) {
                                            var selected = grid.getSelectionModel().getLastSelected();
                                            var d = sourceEl.cloneNode(true);
                                            d.id = Ext.id();
                                            return {
                                                ddel:d,
                                                sourceEl:sourceEl,
                                                repairXY:Ext.fly(sourceEl).getXY(),
                                                widgetModel:selected
                                            }
                                        }
                                    },

                                    getRepairXY:function () {
                                        return this.dragData.repairXY;
                                    },
                                    onStartDrag:function () {
                                        grid.fireEvent('dragStarted',grid.dragZone,this.disableDragLaunching);
                                    },

                                    endDrag:function () {
                                        grid.fireEvent('dragEnd');
                                    },

                                    afterInvalidDrop:function (e, id) {
                                        grid.fireEvent('invalidDrop');
                                    }
                                });
                                }
                            },
                            scope:this
                        },
                        itemclick:{
                            fn:function (view, record, elem, index, event, eOpts) {
                                Ext.apply(record.data,{
                                  alreadyOpenedWidget: this.alreadyOpenedWidget
                                });
                                this.fireEvent('itemclick', view, record, elem, index, event, eOpts);
                            },
                            scope:this
                        },
                        itemdblclick:{
                            fn:function (view, record, elem, index, event, eOpts) {
                                Ext.apply(record.data,{
                                  alreadyOpenedWidget: this.alreadyOpenedWidget
                                });
                                this.fireEvent('itemdblclick', view, record, elem, index, event, eOpts);
                            },
                            scope:this
                        },
                        selectionchange: {
                            fn:function (selModel, records, eOpts) {
                                if (records.length > 0) {
                                    for (var i = 0 ; i < records.length ; i++) {
                                        var record = records[i];
                                        Ext.apply(record.data,{
                                          alreadyOpenedWidget: this.alreadyOpenedWidget
                                        });
                                    }
                                    this.fireEvent('selectionchange', selModel, records, eOpts);
                                }
                            },
                            scope:this
                        }
                    }
                }
            ]
        });

        this.callParent();

        this.addEvents(['itemclick', 'itemdblclick', 'itemkeydown', 'selectionchange']);
        this.enableBubble(['itemclick', 'itemdblclick', 'itemkeydown', 'selectionchange']);
    }
});