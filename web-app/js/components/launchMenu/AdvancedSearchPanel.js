Ext.define('Ozone.components.launchMenu.AdvancedSearchPanel', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.advancedsearchpanel',

    cls: 'search-panel',
    autoScroll: true,

    widgetStore: null,

    dontLoadWidgetStore: false,

    initComponent: function () {
        var me = this;

        this.groupStore = Ext.create("Ozone.data.GroupStore");
        this.loadGroupStore();

        this.intentTreeStore = Ext.create('Ext.data.TreeStore');
        this.loadIntentTreeStore();

        this.tagGridStore = Ext.create("Ext.data.Store", {
            fields: [
                {name: 'tag'}
            ],
            data: [],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'array'
                }
            },
            listeners: {
                add: {
                    fn: function (s) {
                        var tagGrid = this.down('#tagGrid');
//                                            var el = tagGrid.getView().getEl();
//                                            el.dom.tabIndex = 0;
                        tagGrid.enable();
                        tagGrid.show();
                    },
                    scope: this
                },
                remove: {
                    fn: function (s) {
                        if (s.getCount() == 0) {
                            var tagGrid = this.down('#tagGrid');
//                                                var el = tagGrid.getView().getEl();
//                                                el.dom.tabIndex = -1;
                            tagGrid.disable();
                            tagGrid.hide();
                        }
                    },
                    scope: this
                },
                clear: {
                    fn: function (s) {
                        if (s.getCount() == 0) {
                            var tagGrid = this.down('#tagGrid');
//                                                var el = tagGrid.getView().getEl();
//                                                el.dom.tabIndex = -1;
                            tagGrid.disable();
                            tagGrid.hide();
                        }
                    },
                    scope: this
                }
            }
        });

        this.tagCloudStore = Ext.create("Ext.data.Store", {
            fields: [
                {name: 'tag'},
                {name: 'uses', type: 'int'}
            ]
        });
        this.loadTagCloudStore();


        var deleteColumn = {
            xtype: 'actioncolumn',
            width: 25,
            items: [
                {
                    icon: 'themes/common/images/delete.png',
                    tooltip: 'Delete',
                    handler: function (grid, rowIndex, colIndex) {
                        var rec = grid.getStore().getAt(rowIndex);
                        grid.getStore().remove(rec);
                        this.search();
                    },
                    scope: this
                }
            ]
        };

        Ext.apply(this, {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                {
                    xtype: 'searchbox',
                    itemId: 'searchbox',
                    width: this.width - 25,
                    listeners: {
                        searchChanged: {
                            fn: function (cmp, value) {
                                // adds search word to the term grid
                                if (value != '') {

                                    var grid = me.down("#termGrid");

                                    if (!(grid.store.findRecord('term', Ext.htmlEncode(value)))) {
                                        grid.store.add({term: Ext.htmlEncode(value)});
                                        cmp.setRawValue('');
                                        this.search();
                                    }
                                }
                            },
                            scope: this
                        }
                    }
                },
                {
                    xtype: 'grid',
                    itemId: 'termGrid',
                    cls: 'term-grid',
                    autoScroll: true,
                    hidden: true,
                    disabled: true,
                    flex:.8,
                    plugins: [
                        new Ozone.components.focusable.FocusableGridPanel()
                    ],
                    store: Ext.create("Ext.data.Store", {
                        fields: [
                            {name: 'term'}
                        ],
                        data: [],
                        proxy: {
                            type: 'memory',
                            reader: {
                                type: 'array'
                            }
                        },
                        listeners: {
                            add: {
                                fn: function (s) {
                                    var termGrid = this.down('#termGrid');
                                    termGrid.setDisabled(false);
                                    termGrid.show();

                                },
                                scope: this
                            },
                            remove: {
                                fn: function (s) {
                                    if (s.getCount() == 0) {
                                        var termGrid = this.down('#termGrid');
                                        termGrid.setDisabled(true);
                                        termGrid.hide();

                                    }
                                },
                                scope: this
                            },
                            clear: {
                                fn: function (s) {
                                    if (s.getCount() == 0) {
                                        var termGrid = this.down('#termGrid');
                                        termGrid.setDisabled(true);
                                        termGrid.hide();

                                    }
                                },
                                scope: this
                            }
                        }
                    }),
                    hideHeaders: true,
                    columns: [
                        {header: '', dataIndex: 'term', flex: 1},
                        deleteColumn
                    ],
                    viewConfig: {
                        listeners: {
                            itemkeydown: {
                                fn: function(view, record, dom, index, evt) {
                                    switch(evt.getKey()) {
                                        //allow space, enter, or delete to delete the term
                                        case evt.SPACE:
                                        case evt.ENTER:
                                        case evt.DELETE:
                                            var grid = this.down('#termGrid');
                                            grid.getStore().remove(record);
                                            this.search();
                                            break;
                                        default:
                                            break;
                                    }
                                },
                                scope: this
                            }
                        }
                    }
                },
//                {
//                  xtype: 'container',
//                    layout: 'fit',
//                    flex: 1,
//                    items: [
                        {
                            xtype: 'grid',
                            title: "Groups",
                            itemId: 'groupGrid',
                            cls: 'group-grid',
                            store: this.groupStore,
                            flex: 1,
                            hideHeaders: true,
                            collapsible: true,
                            plugins: [
                                new Ozone.components.focusable.FocusableGridPanel()
                            ],
                            selModel: Ext.create('Ext.selection.CheckboxModel', {
                                checkOnly: true,
                                listeners: {
                                    selectionchange: {
                                        fn: function (sm, selections) {
                                            //me.groupFilter(selections);
                                            this.search();
                                        },
                                        scope: this
                                    }
                                }
                            }),
                            columns: [
                                {
                                    header: '',
                                    dataIndex: 'displayName',
                                    renderer: function (val) {
                                        return Ext.htmlEncode(val);
                                    },
                                    flex: 1
                                }
                            ]
                        },
//                    ]
//                },
                {
                    xtype: 'nocollapsesplitter',
                    collapsible: false
                },
                {
                    xtype: 'treepanel',
                    title: 'Intents',
                    //id:'intentsTree',
                    itemId: 'intentsTree',
                    plugins: [
                        new Ozone.components.focusable.FocusableGridPanel()
                    ],
                    columns: [
                        {
                            xtype: 'simpletreecolumn',
                            text: 'Name',
                            flex: 1,
                            dataIndex: 'text',
                            renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                              return Ext.htmlEncode(value);
                            }
                        }
                    ],
                    cls: 'group-grid',
                    store: this.intentTreeStore,
                    rootVisible: false,
                    allowDeselect: true,
                    flex: 1,
                    hideHeaders: true,
                    collapsible: true,
                    listeners: {
                        selectionchange: {
                            fn: function (selModel, selected, eOpts) {
                                this.search();
                            },
                            scope: this
                        }
                    },
                    viewConfig: {
                        listeners: {
                            itemkeydown: {
                                fn: function(view, record, dom, index, evt) {
                                    switch(evt.getKey()) {
                                        //allow space, enter, or delete to delete the term
                                        case evt.SPACE:
                                        case evt.ENTER:
                                            view.selModel.selectWithEvent(record, evt);
                                            break;
                                        default:
                                            break;
                                    }
                                },
                                scope: this
                            }
                        }
                    }
                },
                {
                    xtype: 'nocollapsesplitter',
                    collapsible: false

                },
                {
                    xtype: 'panel',
                    itemId: 'tagPanel',
                    title: 'Tags',
                    cls: 'tag-grid',
                    layout: {
                      type: 'vbox',
                      align: 'stretch'
                    },
                    collapsible: true,
                    flex: 1,
                    autoScroll: true,
                    items: [
                        {
                            xtype: 'grid',
//                            title: 'Tags',
                            itemId: 'tagGrid',
                            cls: 'tag-grid',
                            flex:.8,
                            hidden: true,
                            plugins: [
                                new Ozone.components.focusable.FocusableGridPanel()
                            ],
                            store: this.tagGridStore,
                            hideHeaders: true,
//                            collapsible: true,
                            anchor: '100%',
                            columns: [
                                {header: '', dataIndex: 'tag', flex: 1},
                                {
                                    xtype: 'actioncolumn',
                                    width: 25,
                                    items: [
                                        {
                                            icon: 'themes/common/images/delete.png',
                                            tooltip: 'Delete',
                                            handler: function (grid, rowIndex, colIndex) {
                                                var rec = grid.getStore().getAt(rowIndex);
                                                grid.getStore().remove(rec);
                                                this.search();
                                            },
                                            scope: this
                                        }
                                    ]
                                }
                            ],
                            listeners: {
                                afterrender: {
                                    fn: function (cmp) {
                                        var view = cmp.getView();
                                        var el = view.getEl();
                                        el.dom.tabIndex = -1;
                                    },
                                    scope: this
                                }
                            },
                            viewConfig: {
                                listeners: {
                                    itemkeydown: {
                                        fn: function(view, record, dom, index, evt) {
                                            switch(evt.getKey()) {
                                                //allow space, enter, or delete to delete
                                                case evt.SPACE:
                                                case evt.ENTER:
                                                case evt.DELETE:
                                                    var grid = this.down('#tagGrid');
                                                    grid.getStore().remove(record);
                                                    this.search();
                                                    break;
                                                default:
                                                    break;
                                            }
                                        },
                                        scope: this
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'tagcloud',
                            itemId: 'tagCloud',
                            cls: 'tagCloud',
                            itemSelector: '.tag',
                            selectedItemCls: 'tag-selected',
                            trackOver: true,
                            overItemCls: 'tag-over',
                            flex: 1,
                            minHeight: 100,
                            autoScroll: true,
                            store: this.tagCloudStore,
                            listeners: {
                                itemkeydown: {
                                    fn: function (view, record, dom, index, evt) {
                                        switch (evt.getKey()) {
                                            case evt.SPACE:
                                            case evt.ENTER:
                                                var grid = this.down("#tagGrid");
                                                if (!(grid.store.findRecord('tag', Ext.htmlEncode(record.data.tag)))) {
                                                    grid.store.add({tag: Ext.htmlEncode(record.data.tag)});
                                                    this.search();
                                                }
                                                break;
                                            default:
                                                break;
                                        }

                                    },
                                    scope: this
                                },
                                itemClick: {
                                    fn: function (view, record, item, index, event, eOpts) {
                                        var grid = this.down("#tagGrid");
                                        if (!(grid.store.findRecord('tag', Ext.htmlEncode(record.data.tag)))) {
                                            grid.store.add({tag: Ext.htmlEncode(record.data.tag)});
                                            this.search();
                                        }

                                    },
                                    scope: this
                                }
                            }
                        }
                    ]
                }
            ],
            bbar: {
                xtype: 'toolbar',
                itemId: 'reset-bar',
                items: [
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'button',
                        text: 'Reset',
                        handler: function (b, e) {
                            me.clearAllFilters();
                            me.search();
                        }
                    }
                ]
            }
        });

        this.callParent(arguments);
    },

    loadGroupStore: function() {
        this.groupStore.removeAll();
        for (var i = 0, len = this.widgetStore.getCount(); i < len; i++) {
            var groups = this.widgetStore.getAt(i).get('groups');
            if (groups != null && groups.length > 0) {
                for (var j = 0, jlen = groups.length ; j < jlen ; j++) {
                  if (this.groupStore.findExact('id',groups[j].id) < 0  && !groups[j].stackDefault) {
                      this.groupStore.add(groups[j]);
                  }
                }
            }
        }
    },

    loadIntentTreeStore: function () {
        var rootNode = {
            expanded: true,
            children: []
        };
        var intentMap = {};
        var dataTypeMap = {};
        //loop through widgetStore and seed other stores with values to filter by
        for (var i = 0, len = this.widgetStore.getCount(); i < len; i++) {
            var widgetData = this.widgetStore.getAt(i).data;
            if (widgetData.intents != null && widgetData.intents.receive != null) {
                //loop through each intent
                for (var j = 0; j < widgetData.intents.receive.length; j++) {
                    var intent = widgetData.intents.receive[j];
                    if (intent != null) {
                        var intentNode = intentMap[intent.action];
                        //create the node it doesn't exist (ie we've already seen it)
                        if (intentNode == null) {
                            intentNode = {
                                //todo html encode this
                                text: intent.action,
                                //action: intent.action,
                                expanded: true,

                                //todo see if we can fix this bug - tree nodes can still be expanded if the node is double clicked
                                //http://www.sencha.com/forum/showthread.php?220296-4.1-NodeInterface-Can-Still-be-Expanded-When-Expandable-Value-is-Set-to-False
                                expandable: false,

                                children: []
                            };
                            intentMap[intent.action] = intentNode;
                            rootNode.children.push(intentNode);
                        }
                        //loop through each datatype
                        if (intent.dataTypes != null) {
                            for (var k = 0; k < intent.dataTypes.length; k++) {
                                var dataType = intent.dataTypes[k],
                                    mapKey = dataType + '\0' + intent.action;

                                //key off of a combination of dataType and action
                                var dataTypeNode = dataTypeMap[mapKey];

                                //create the node it doesn't exist (ie we've already seen it)
                                if (dataTypeNode == null) {
                                    dataTypeNode = {
                                        text: dataType,
                                        leaf: true
                                    };
                                    dataTypeMap[mapKey] = dataTypeNode;
                                    intentNode.children.push(dataTypeNode);
                                }
                            }
                        }
                    }
                }
            }
        }
        this.intentTreeStore.setRootNode(rootNode);
    },

    refresh: function (suppressEvent) {
        this.clearAllFilters(suppressEvent);

        this.loadGroupStore();
        this.loadIntentTreeStore();

        var intentsTree = this.down('#intentsTree');
        intentsTree.getSelectionModel().setLocked(false);

        this.loadTagCloudStore();
    },

    loadTagCloudStore: function () {
        var map = {};
        var tagList = [];

        this.tagCloudStore.removeAll();
        for (var i = 0; i < this.widgetStore.getCount(); i++) {
            var record = this.widgetStore.getAt(i);

            var tags = record.data.tags;
            for (var index in tags) {
                var tagName = tags[index].name;

                if (this.tagGridStore.findExact('tag', tagName) < 0) {
                    if (map[tagName] == null) {
                        map[tagName] = {tag: tagName, uses: 1};
                        tagList.push(map[tagName]);
                    }
                    else {
                        map[tagName].uses++;
                    }
                }
            }

        }
        this.tagCloudStore.add(tagList);
    },

    search: function (overrideFilterCfg) {
        if (!this.dontLoadWidgetStore) {
            var isFiltered = false;

            var termStore = this.down("#termGrid").getStore();
            var tagStore = this.down("#tagGrid").getStore();
            var groupGrid = this.down("#groupGrid");
            var groupSelections = groupGrid.getSelectionModel().getSelection();

            var intent = {};
            var intentsTree = this.down('#intentsTree');
            var intentsSelection = intentsTree.selModel.getSelection();
            if (intentsSelection.length > 0) {
                isFiltered = true;
                //if the selection is a leaf node then it is a datatype
                if (intentsSelection[0].isLeaf()) {
                    var parent = intentsSelection[0].parentNode;
                    intent.action = parent.get('text');
                    intent.dataType = intentsSelection[0].get('text');
                }
                else {
                    intent.action = intentsSelection[0].get('text');
                }
                intent.receive = true;
            }

            //handle overrideFilterCfg
            if (overrideFilterCfg != null) {
                if (overrideFilterCfg.customWidgetName != null && overrideFilterCfg.customWidgetName != '') {
                    termStore = Ext.create("Ext.data.Store", {
                        fields: [
                            {name: 'term'}
                        ],
                        data: [],
                        proxy: {
                            type: 'memory',
                            reader: {
                                type: 'array'
                            }
                        }});
                    termStore.add({term:overrideFilterCfg.customWidgetName});
                }
                if (overrideFilterCfg.intent != null) {
                  intent = overrideFilterCfg.intent;
                }
            }

            //clear the widgetstore we are going to repopulate it
            this.widgetStore.removeAll();

            //loop through main widget store and add any widgets that meet the filter
            var containerWidgetStore = this.dashboardContainer.widgetStore;
            var widgetsToAdd = [];
            for (var i = 0, len = containerWidgetStore.getCount() ; i < len ; i++ ) {
                var keepWidgetFlag = true;
                var widgetRec = containerWidgetStore.getAt(i);

                //check if visible
                keepWidgetFlag = widgetRec.get('visible') && widgetRec.get('definitionVisible');

                //check if type is standard
                if (keepWidgetFlag) {
                    var types = widgetRec.get('widgetTypes');
                    if (types != null) {
                        var foundStandard = false;
                        for (var j = 0; j < types.length; j++) {
                            var type = types[j];
                            if (type.name == 'standard') {
                                foundStandard = true;
                            }
                        }
                        if (!foundStandard) {
                            keepWidgetFlag = false;
                        }
                    }

                }

                //check if this matches the search terms
                if (keepWidgetFlag) {
                    for (var j = 0; j < termStore.getCount(); j++) {
                        var term = Ext.htmlDecode(termStore.getAt(j).get('term'));
                        isFiltered = true;

                        if (widgetRec.get('name') != null && !widgetRec.get('name').match(new RegExp('.*' + term + '.*', 'i'))) {
                          keepWidgetFlag = false;
                          break;
                        }

                    }
                }

                //check against groups
                if (keepWidgetFlag) {

                    //loop through selected groups
                    var widgetGroups = widgetRec.get('groups');
                    for (var j = 0; j < groupSelections.length; j++) {
                        isFiltered = true;
                        var group = groupSelections[j].get('id');

                        //loop through the groups for the current widget
                        var foundGroup = false;
                        for (var k = 0; k < widgetGroups.length; k++) {

                            var wgroup = widgetGroups[k].id;
                            if (group == wgroup) {
                                foundGroup = true;
                            }

                        }

                        if (!foundGroup) {
                            keepWidgetFlag = false;
                            break;
                        }
                    }
                }

                //check against receiving intents
                if (keepWidgetFlag) {
                    if (intent.action != null) {

                        var widgetIntents = widgetRec.get('intents').receive;
                        var foundIntent = false;
                        for (var k = 0; k < widgetIntents.length; k++) {
                            var widgetIntent = widgetIntents[k];

                            //check if this widget matches the intent action
                            if (intent.action == widgetIntent.action) {

                              //action matches check dataType if it exists
                              if (intent.dataType != null) {
                                var widgetDataTypes = widgetIntent.dataTypes;
                                if (widgetDataTypes != null) {
                                    foundIntent = false;
                                    for (var l = 0; l < widgetDataTypes.length; l++) {
                                      var widgetDataType = widgetDataTypes[l];
                                      if (intent.dataType == widgetDataType) {
                                        foundIntent = true;
                                      }
                                    }
                                }
                              }
                              //no dataType so the intent matches just by action
                              else {
                                foundIntent = true;
                              }
                            }
                        }

                        if (!foundIntent) {
                            keepWidgetFlag = false;
                        }
                    }
                }

                //check against tags
                if (keepWidgetFlag) {
                    //loop through selected tags
                    var widgetTags = widgetRec.get('tags');
                    for (var j = 0; j < tagStore.getCount(); j++) {
                        var tag = Ext.htmlDecode(tagStore.getAt(j).get('tag'));

                        //loop through the tags for the current widget
                        var foundTag = false;
                        for (var k = 0; k < widgetTags.length; k++) {
                            isFiltered = true;

                            var wtag = widgetTags[k].name;
                            if (tag == wtag) {
                                foundTag = true;
                            }

                        }

                        if (!foundTag) {
                            keepWidgetFlag = false;
                            break;
                        }

                    }
                }

                //add the record
                if (keepWidgetFlag) {
                    widgetsToAdd.push(widgetRec.copy());
                }
            }

            //add all at once so there is only one add event fired
            this.widgetStore.add(widgetsToAdd);

            //save isfiltered state
            this.widgetStore.widgetFiltered = isFiltered;

            //reload the tagcloud store after the search is finished
            this.loadTagCloudStore();
        }
    },

    clearAllFilters: function (suppressEvent) {
        var tagGrid = this.down("#tagGrid");
        tagGrid.store.removeAll();

        var termGrid = this.down("#termGrid");
        termGrid.store.removeAll();

        var groupGrid = this.down("#groupGrid");
        groupGrid.getSelectionModel().deselectAll(suppressEvent);

        //clear intents tree filter only if the tree is not locked
        //if it's locked don't change the selection
        var intentsTree = this.down('#intentsTree');
        var intentsTreeSelModel = intentsTree.getSelectionModel();
        var intentsTreeSelModelLocked = intentsTreeSelModel.isLocked();
        if (!intentsTreeSelModelLocked) {
            intentsTreeSelModel.deselectAll(suppressEvent);
        }

        var searchbox = this.down('#searchbox');
        searchbox.reset();
    }
});
