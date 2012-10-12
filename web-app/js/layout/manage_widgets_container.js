/**
 * @class Ozone.layout.ManageWidgetsContainer
 * @extends Ext.form.Panel
 */
Ext.define('Ozone.layout.ManageWidgetsContainer', {
    extend: 'Ext.form.Panel', /** @lends Ozone.layout.ManageWidgetsContainer */
    alias: ['widget.owfManageWidgetsContainer', 'widget.Ozone.layout.ManageWidgetsContainer'],
    requires: [
        'Ext.layout.container.VBox'
    ],

    layout: {
      type: 'vbox',
      align: 'stretch'
    },

    border: false,

    cls: 'mwc-manageWidgetsContainer',

    mixins: {
        focus: 'Ozone.components.focusable.CircularFocus'
    },

    loadGridData: function(){
    this.setLoading(true);
    var existingWidgetStore = this.dashboardContainer.widgetStore;

        // Add removed flag for delete column
        var storeData = [];
        for (var i = 0; i < existingWidgetStore.getCount(); i++) {
            var widget = existingWidgetStore.getAt(i).data;
            widget["removed"] = false;
            if (widget.definitionVisible && widget.widgetTypes != null) {
              //loop through widget types and find 'standard'
              var widgetTypes = widget.widgetTypes;
              var isStandard = false;
              for (var j = 0 ; j < widgetTypes.length ; j++) {
                var widgetType = widgetTypes[j];
                if (widgetType != null && widgetType.name == 'standard') {
                  isStandard = true;
                  break;
                }
              }

              //only show standard and visible widgetdefs
              if (isStandard) {
                storeData.push(widget);
              }
            }
        }

        this.store.loadData(storeData);
        this.setLoading(false);
    },

    refreshOriginalWidgetNames: function(params) {
        this.setLoading(true);
        var scope = this;
        Ozone.pref.PrefServer.findWidgets({
          onSuccess: function(records) {
                // Update originalWidgetNames
                for (var i = 0; i < records.length; i++) {
                    scope.dashboardContainer.originalWidgetNames[records[i].path] = records[i].value.namespace;
                }

                if (params.reloadGrid == true) {
                    scope.loadGridData();
                } else {
                    scope.setLoading(false);
                }
                params.callback();
            },
            
            onFailure: function() {
                scope.setLoading(false);
                params.callback();
            }
        });
    },
    initComponent: function() {
        var scope = this;
          
          // Set up a model to use in our Store
        var widgetJsonModel = Ext.define('widgetJsonModel', {
            extend: 'Ext.data.Model',
            fields: ['widgetGuid', {name:'name', sortType:Ext.data.SortTypes.asUCString}, 'visible', 'removed', 'headerIcon','tags', 'editable', '_tags','_editable']
        });
          
          // Create data store
        this.store = Ext.create('Ext.data.JsonStore', {
            model:'widgetJsonModel',
            sorters: [{
                property : 'name',
                direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
            }],
            listeners : {
                datachanged : {
                    fn : function(s) {
                        //preprocess store
                        var store = s;
                        store.suspendEvents();
                        for (var i = 0 ; i < store.getCount() ; i++) {
                            var rec = store.getAt(i);
                            var recData = rec.data;
                            if (Ext.isArray(recData.tags) && recData.tags.length > 0) {
                                var _tags = '';
                                var editable = true;
                                for (var j = 0 ; j < recData.tags.length ; j++) {
                                    _tags +=recData.tags[j].name;
                                    if (j < recData.tags.length -1) {
                                        _tags+=', ';
                                    }
                                    if (recData.tags[j].editable === false) {
                                        editable = false;
                                    }
                                }
                                rec.set('_tags',_tags);
                                rec.set('_editable',editable);
                                rec.commit();
                            }
                            else {
                                rec.set('_tags','');
                                rec.set('_editable',true);
                                rec.commit();
                            }
                        }
                        store.resumeEvents();
                    },
                    scope : this
                }
            }
        });

        // Create editable Dashboard Name field
        this.nameField = Ext.create('Ext.form.field.Text', {
            maxLength: 200,
            allowBlank: false,
            blankText: Ozone.layout.DialogMessages.view_dashboardNameField_blankText,
            validator: function(value) {
                if (this.value) {
                    if (this.value.toUpperCase() != value.toUpperCase()) {                  
                        for (var i = 0; i < store.data.items.length; i++) {
                            if(value.charAt(0) === ' ' || value.charAt(value.length-1) === ' ') {
                                return Ozone.util.ErrorMessageString.invalidDashboardNameMsg;
                            }
                        }
                    } 
                    else {
                        if(this.value.charAt(0) === ' ' || this.value.charAt(this.value.length-1) === ' ') {
                            return Ozone.util.ErrorMessageString.invalidDashboardNameMsg;
                        }                    
                    }
                    return true;
                }
                return true;
            }
        });
            
        this.tagsField = Ext.create('Ext.form.field.Text', {
            allowBlank: true,
            validator: function(val) {
                if (val.match(Ozone.config.carousel.restrictedTagGroupsRegex) != null) {
                return '"'+val+'"'+Ozone.util.ErrorMessageString.restrictedTagError;
                }
                else {
                return true;
                }
            }
        });
          
        var resetTitleAction = Ext.create('Ext.Action', {
            text: 'Reset Title',
            handler: function(widget, event) {
                var rec = scope.widgetGrid.getSelectionModel().getSelection()[0];
                if (rec) {
                    scope.refreshOriginalWidgetNames({
                        reloadGrid: false,
                        callback: function() {
                            var originalName = rec.get('originalName');
                            rec.set('name', originalName);
                        }
                    });
                }
            }
        });
        var resetAllTitlesAction = Ext.create('Ext.Action', {
            text: 'Reset All Titles',
            handler: function(widget, event) {
                var records = scope.widgetGrid.getStore().getRange();
                scope.refreshOriginalWidgetNames({
                    reloadGrid: false,
                    callback: function() {
                        for (var i = 0; i < records.length; i++) {
                            if (records[i].data.editable) {
                                // Reset titles
                                var originalName = records[i].get('originalName');
                                records[i].data.name = originalName;

                                // Update tags
                                var tags = [];
                                if (records[i].data._tags.length > 0 && records[i].data._tags != '') {
                                    var splits = records[i].data._tags.split(',');
                                    for (var j = 0 ; j < splits.length ; j++) {
                                        var name = Ext.String.trim(splits[j]);
                                        if (name != '') {
                                            tags.push({
                                                name: name,
                                                visible: true,

                                                //todo use position to order groups for now just set to -1
                                                position: -1,
                                                editable: records[i].data._editable
                                            });
                                        }
                                    }
                                }
                                records[i].data.tags = tags;
                            }
                        }
                        scope.store.loadRecords(records, {
                            addRecords: false
                        });
                    }
                });
            }
        });

        var contextMenu = Ext.create('Ext.menu.Menu', {
            items: [
                resetTitleAction,
                resetAllTitlesAction
            ]
        });

        this.widgetGrid = Ext.create('Ext.grid.GridPanel', {
            ddGroup: 'ddWidgets',
            cls:'mwc-widgetGridPanel',
            store: this.store,
            autoScroll: true,
            scroll: true,
            viewConfig: {
                listeners: {
                    itemcontextmenu: {
                        fn: function (view, rec, node, index, e) {
                            e.stopEvent();
                            this.dashboardContainer.modalWindowManager.register(contextMenu);
                            contextMenu.showAt(e.getXY());
                            this.dashboardContainer.modalWindowManager.bringToFront(contextMenu);
                            return false;
                        },
                        scope: this
                    },
                    itemkeydown: {
                        fn: function (view, record, item, index, evt) {
                            switch (evt.getKey()) {
                                case Ext.EventObject.S:
                                    record.set('visible', !record.get('visible'));
                                    view.refreshNode(index);
                                    
                                    //Fire the column's appropriate checked/unchecked method
                                    var col = this.down('#showCheckColumn');
                                    record.get('visible') ? col.onChecked(view, record) : col.onUnchecked(view, record);
                                    break;

                                case Ext.EventObject.D:
                                    record.set('removed', !record.get('removed'));
                                    view.refreshNode(index);
                                    
                                    //Fire the column's appropriate checked/unchecked method
                                    var col = this.down('#deleteCheckColumn');
                                    record.get('removed') ? col.onChecked(view, record) : col.onUnchecked(view, record);
                                    break;

                                case Ext.EventObject.R:
                                    if(!Ext.EventObject.hasModifier()) {
                                        //Get the 3rd cell (in the Tags column) of the selected row to get starting point
                                        //for XY coordinates to place the context menu inside the selected row appropriately.
                                        var thirdCellInSelectedRow = Ext.select('tr[class*=x-grid-row-focused]:first td').item(2);
                                        var coordinates = thirdCellInSelectedRow.getXY();
                                        coordinates[0] -= 5;
                                        coordinates[1] += 10; // Approximates a good location for the context menu to appear

                                        this.dashboardContainer.modalWindowManager.register(contextMenu);
                                        contextMenu.showAt(coordinates);
                                        this.dashboardContainer.modalWindowManager.bringToFront(contextMenu);

                                        //Add a listener to the context menu so that when it is closed with ESC it will 
                                        //move focus back to the widget grid
                                        contextMenu.addListener('hide', function(view, record, item) {
                                            //Set on a defer to wait until focus is moved to the banner, then pulls focus back
                                            Ext.defer(function() {
                                                //Set focus on the widget grid, which is 3 levels down from the manageWidgetsWindow
                                                Ext.getCmp("manageWidgetsWindowId").getComponent(0).getComponent(0).getComponent(0).focus();
                                            }, 100, this);

                                            //Remove this listener after the context menu is hidden
                                            contextMenu.removeListener('hide', arguments.callee);
                                        });
                                    }
                                    break;

                                case Ext.EventObject.ENTER:
                                    var header = view.headerCt.getHeaderAtIndex(1);
                                    view.editingPlugin.startEdit(record, header);
                            }
                        },
                        scope: this
                    },
                    afterrender: function (cmp) {
                        cmp.getEl().on('keyup', function(evt) {
                            //prevent ESC key from escaping to the 
                            //body.  Since ESC keydown is stopped
                            //internally to the grid, we need to to
                            //stop the keyup as well
                            if (evt.getKey() === evt.ESC)
                                evt.stopPropagation();
                        });
                    }
                }
            },
            columns: [
                {
                    xtype: 'gridcolumn',
                    text: '<span class="gridHdr">Icon</span>', 
                    dataIndex: 'headerIcon', 
                    width: 36,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    renderer: function (val, metaData, record, rowIndex, colIndex, store) {
                        if (record.get('editable') == false) {
                            metaData.attr = 'ext:qtip="This widget belongs to a Group and may not be edited or deleted"';
                            metaData.tdCls += ' x-item-disabled';
                        }
                
                        var retVal = '<div><img width=\"24px\" height=\"24px\" src="'+val+'">';
                        retVal += '</div>';

                        return  retVal;
                    }
                },
                {
                    xtype: 'textcolumn',
                    text: '<span class="gridHdr">Widget</span>', 
                    dataIndex: 'name',
                    field: this.nameField,
                    width: 176,
                    resizable: false,
                    menuDisabled: true,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        if(record.get('editable') != false && record.get('_editable')!= false) {
                            metaData.tdCls += ' manage-editable';
                        }
                        if (record.get('editable') == false) {
                            metaData.tdAttr = 'data-qtip="This widget belongs to a Group and may not be edited or deleted"';
                            metaData.tdCls += ' x-item-disabled';
                        }
                        return Ext.util.Format.htmlEncode(value);
                    }
                },
                {
                    xtype:'textcolumn',
                    menuDisabled: true,
                    text: '<span class="gridHdr">Tags</span>',
                    field : this.tagsField,
                    dataIndex: '_tags',
                    width: 170,
                    sortable: false,
                    resizable: false,
                    renderer: function(value, metaData, record, rowIndex, colIndex, store) {
                        metaData.tdCls = 'hd-tags';
                        if (record.get('_editable') == false) {
                            metaData.tdCls += ' x-item-disabled';
                        }
                        if (record.get('editable') == false) {
                            metaData.tdAttr = 'data-qtip="This widget belongs to a Group and may not be edited or deleted"';
                            metaData.tdCls += ' x-item-disabled';
                        }
                        if(record.get('editable') != false && record.get('_editable')!= false)
                        {
                            metaData.tdCls += ' manage-editable';
                            var encValue = Ext.util.Format.htmlEncode(value);
                            //work-around to html-encode html tags - can't just directly htmlEncode stuff
                            //so we inject an XTemplate to handle it
                            metaData.tdAttr = 'data-qtip="'+new Ext.XTemplate('{foo:htmlEncode}').apply({
                                foo:encValue
                            })+'"';
                        }
                        return Ext.util.Format.htmlEncode(value);  
                    }
                },
                {
                    xtype:'checkcolumn',
                    itemId: 'showCheckColumn',
                    text: '<span class="gridHdrShow"><span class="x-grid-column-checkbox-off"></span><span class="underline">S</span>how</span>',
                    dataIndex: 'visible',
                    width: 90,
                    sortable: false,
                    tdCls:'gridCellShowWidgets-chkbox',
                    listeners: {
                        afterrender: {
                            scope: this,
                            single: true,
                            fn: function(cmp) {
                                this.store.mon(this.store, 'datachanged', function() {
                                    if(this.find('visible', false) === -1) {
                                        //All rows are checked on open, so check the column's overall checkbox
                                        cmp.toggleHeader(true);
                                    }
                                });
                            }
                        }
                    }
                },
                {
                    xtype:'checkcolumn',
                    itemId: 'deleteCheckColumn',
                    text: '<span class="gridHdrDelete"><span class="x-grid-column-checkbox-off"></span><span class="underline">D</span>elete</span>',
                    dataIndex: 'removed',
                    width: 90,
                    sortable: false,
                    tdCls:'gridCellDeleteWidgets-chkbox'
                }
            ],
            selType:'rowmodel',
            frame: false,
            enableDragDrop: true,
            enableHdMenu: false,
            enableColumnResize: false,
            plugins: [
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 1
                }),
                new Ozone.components.focusable.FocusableGridPanel()
            ],
            flex: 1,
            listeners: {
                //Handle Before Edit has taken place
                beforeedit: function(e) {
                    var isCellEditable = function(record) {
                        if (record.get('removed') || record.get('_editable') === false ||  record.get('editable') === false) {
                            return false;
                        }
                        return true;
                    };
                    return isCellEditable(e.record);
                },
                //Handle After Edit has taken place
                edit: function(editor, e) {
                    if(editor.editors.items[e.column.id]) {
                        e.record.set('_tags',editor.editors.items[e.column.id].field.value.toLowerCase());
                    }
                }
            }
        });

        this.items = [
            this.widgetGrid
        ];

        /***
         * IMPLEMENT HEADER CLICKED.
         */
        this.widgetGrid.headerCt.on('headerclick', function(ct, column, evt, htmlElem) {
                if(typeof column.onGridHeaderCtClick == 'function') {
                    column.onGridHeaderCtClick(this.widgetGrid, evt, htmlElem);
                }
            }, 
            this
        );

        this.keys = [];
        this.keys.push({
            key: Ext.EventObject.ENTER,
            fn: function (k,e) {
                var button = this.getFooterToolbar().getComponent('saveButton');
                if (button) {
                    e.button = 0;
                    button.onClick(e);
                }
            },
            scope: this
        });
          
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'bottom',
            defaults: {
                minWidth: this.minButtonWidth
            },
            layout: {
                type: 'hbox',
                pack: 'end'
            },
            items: [
                {
                    xtype:'button',
                    scale: 'small',
                    text: Ozone.layout.MessageBoxButtonText.ok,
                    itemId: 'saveButton',
                    //                iconCls: 'okSaveBtnIcon',
                    handler: function() {
                        scope.onSaveClick();
                    },
                    listeners: {
                        // afterrender: function(button) {
                        //     button.getEl().on('keydown', function(e) {
                        //         e.stopPropagation();
                        //     });
                        // }
                    }
                },
                {
                    xtype:'button',
                    scale: 'small',
                    itemId: 'cancelBtn',
                    text: Ozone.layout.MessageBoxButtonText.cancel,
                    // iconCls: 'cancelBtnIcon',
                    handler: function() {
                        Ext.getCmp(scope.winId).close();
                    }
                }
            ]
        }];
          
        //Need this to get rid of destory errors with ExtJS
        this.on('beforedestroy', function(cmp) {
            cmp.dockedItems = null;
        });

        this.on({
            afterrender: {
                fn: function(cmp) {
                    var winCmp = Ext.getCmp(cmp.winId);

                    winCmp.on('show', function() {
                        cmp.loadGridData();
                    });

                    winCmp.setupFocus(cmp.widgetGrid.getView().getEl(), 
                    cmp.down('#cancelBtn').getFocusEl());

                },
                scope: this
            }
        });

        //Ensure the shadow follows the window in IE
        this.on('resize', function() {
            this.syncShadow();
        });

        this.callParent();
    },

    onSaveClick: function() {
        // Create array of widgets
        var gridData = this.widgetGrid.store.data.items;
        var widgetsToUpdate = [];
        var widgetsToDelete = [];
        var widgetGuidsToDelete = [];
        //this.dashboardContainer.widgetNames = {};
        for (var i = 0; i < gridData.length; i++) {

            if (gridData[i].data.editable) {
                if (!gridData[i].data.removed) {
                    var recData = gridData[i].data;
                    var tags = [];
                    if (recData._tags.length > 0 && recData._tags != '') {
                        var splits = recData._tags.split(',');
                        for (var j = 0 ; j < splits.length ; j++) {
                            var name = Ext.String.trim(splits[j]);
                            if (name != '') {
                                tags.push({
                                    name: name,
                                    visible: true,

                                    //todo use position to order groups for now just set to -1
                                    position: -1,
                                    editable: recData._editable
                                });
                            }
                        }
                    }

                    var widget = {
                        guid: gridData[i].data.widgetGuid,
                        visible: gridData[i].data.visible,
                        tags: tags
                    };
                    var originalName = gridData[i].data.originalName;
                    if (gridData[i].data.name !== originalName) {
                        widget.name = gridData[i].data.name;
                    }
                    widgetsToUpdate.push(widget);

                } else {
                    widgetGuidsToDelete.push(gridData[i].data.widgetGuid);
                    widgetsToDelete.push({
                        guid: gridData[i].data.widgetGuid,
                        name: gridData[i].data.name,
                        headerIcon: gridData[i].data.headerIcon,
                        image: gridData[i].data.image
                    });
                }
            }
        }

        var scope = this;
        function onSuccess() {
            //Call method to refresh the 'widget launch menu' widgets.
            scope.dashboardContainer.retrieveUpdatedWidgets();
        }
        
        function onFailure() {
            Ozone.Msg.alert(Ozone.util.ErrorMessageString.saveUpdatedWidgets, Ozone.util.ErrorMessageString.saveUpdatedWidgetsMsg,
                null, null, null, scope.dashboardContainer.modalWindowManager);
        }
        
        Ext.getCmp(this.winId).close();
        Ozone.pref.PrefServer.updateAndDeleteWidgets({
            widgetsToUpdate:widgetsToUpdate,
            widgetGuidsToDelete:[], 
            updateOrder:false,
            onSuccess:onSuccess, 
            onFailure:onFailure
        });
      
        if (widgetGuidsToDelete.length > 0) {
          
            Ext.create('Ext.window.Window', {
                title: 'Deleting Widgets',
                cls: 'delete-widgets-window',
                height: 550,
                ownerCt: scope.dashboardContainer,
                dashboardContainer: scope.dashboardContainer,
                constrain: Ext.isIE,
                constrainHeader: true,
                width: 600,
                layout: 'fit',
                resizable: false,
                modal: true,
                items: {
                    xtype: 'deletewidgetspanel',
                    delWidgets: widgetsToDelete,
                    dashboardContainer: scope.dashboardContainer
                },
                listeners: {
                    show: function (cmp) {
                        //Ensure its on top
                        cmp.dashboardContainer.modalWindowManager.register(cmp);
                        cmp.dashboardContainer.modalWindowManager.bringToFront(cmp);
                        
                        /*
                         * Needs to be deferred or it will happen before the
                         * window close in IE
                         */
                        Ext.defer(function() {
                            this.focus();
                        }, 100, cmp.getComponent('topdeletepanel').okBtn);
                    }
                }
            }).show();
            
        }
    }
});