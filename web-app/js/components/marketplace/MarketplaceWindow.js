var DEFAULT_ICON_HEIGHT = 49;
var DEFAULT_ICON_WIDTH = 48;
var DEFAULT_ITEM_WIDTH = 75;

/*
 * @Ozone.components.MarketplaceWindow
 *
 * @param {Object} windowGroup used for the manager of the Marketplace popup.
 *
 * This function setup the on click event of the Marketplace button on the
 * carousel.  Closing the window removes it from the DOM
 */
Ext.define('Ozone.components.marketplace.MarketplaceWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.marketplace', 'widget.Ozone.components.marketplace.MarketplaceWindow'],
    
    id: 'mpWindow',
    itemId: 'mpWindow',
    cls: 'mpWindow',
    layout: 'fit',
    width: 800,
    height: 500,
    closable: true,
    closeAction: 'hide',
    title: 'Marketplace',

    plugins: new Ozone.components.keys.HotKeyComponent(Ozone.components.keys.HotKeys.MARKETPLACE),

    mixins: {
        circularFocus: 'Ozone.components.focusable.CircularFocus'
    },
    
    mpPanel: null,
    mpMainPanelContainer: null,
    
    mpWidgetDetailPage: null,
    
    mpSearchResults: null,
    
    mpHomeIcon: {
        itemId: 'mpHomeIcon',
        cls: 'mpHomeIcon',
        height: 90,
        region: 'north',
        html: '<div id="mpShoppeIcon" class="mpShoppeIcon">' +
        '<img class="market-icon" src="images/marketplace/shoppe.png" />' +
        '<div class="market-text">Market</div>' +
        '</div>'
    },
    
    mpCategories: null,
    
    listeners: {
        activate: {
            fn: function(cmp){
                cmp.removeCls('floatingWinContainerInactive');
            },
            scope: this
        },
        deactivate: {
            fn: function(cmp){
                cmp.addCls('floatingWinContainerInactive');
            },
            scope: this
        },
        move: {
            fn: function(win, x, y){
                var browserWidth = Ext.core.Element.getViewportWidth();
                var browserHeight = Ext.core.Element.getViewportHeight();
                var newX = x;
                var newY = y;
                
                if (y < 19) 
                    newY = 19;
                else 
                    if (y > browserHeight - (win.getHeight() + 19)) 
                        newY = browserHeight - (win.getHeight() + 19);
                if (x < 0) 
                    newX = 0;
                else 
                    if (x > browserWidth - win.getWidth()) 
                        newX = browserWidth - win.getWidth();
                
                if (newX != x || newY != y) 
                    win.setPagePosition(newX, newY);
            },
            scope: this
        }
    },
    
    searchByText: function(newText){
        var dataView = this.mpSearchResults;
        if (dataView) {
            // Set up params based on last options
            var listingsStore = Ozone.components.MPListingsAPI.getStore();
            var lastOptions = listingsStore.lastOptions;
            
            if (newText == '') {
                // remove search params for title, author, and description
                newText = null;
            }
            
            Ext.apply(lastOptions.params, {
                useIndex: true,
                queryString: newText,
                countCategories: false,
                start: 0,
                limit: listingsStore.lastOptions.params.limit,
                dir: listingsStore.lastOptions.params.dir,
                sort: listingsStore.lastOptions.params.sort
            });
            
            // Run new search
            Ozone.components.MPListingsAPI.loadStore(lastOptions.params);
        }
    },
    
    addWidget: function() {
        var parentWidget = this.down('#mpWidgetDetailPage').data;
        var requiredListings = this.down('#mpWidgetDetailPage').data.requiredListings;
        var approvalTag = {};
        var widgetsJSON = [];
        var directRequired = [];

        
        if (Ozone.config.enablePendingApprovalWidgetTagGroup) {
            approvalTag = {
                name: Ozone.config.carousel.pendingApprovalTagGroupName, 
                visible:true, 
                position: -1, 
                editable: false
            };
        }
        else {
            var dt = new Date();
            var dateString = Ext.Date.format(dt, 'Y-m-d');
            approvalTag = {
                name: Ozone.config.carousel.approvedTagGroupName+' on '+dateString, 
                visible:true, 
                position: -1, 
                editable: true
            };
        }
        
        if (requiredListings && requiredListings[0].requires) {
            for (var i = 0; i < requiredListings[0].requires.length; i++) {
                directRequired.push(requiredListings[0].requires[i].uuid);
            }
        }
        
        // Add parent widget
        var json = {
            displayName: parentWidget.title,
            height: 200,
            imageUrlLarge: parentWidget.imageLargeUrl ? parentWidget.imageLargeUrl : Ozone.util.contextPath(),
            imageUrlSmall: parentWidget.imageSmallUrl ? parentWidget.imageSmallUrl : Ozone.util.contextPath(),
            isExtAjaxFormat: true,
            widgetGuid: parentWidget.uuid,
            widgetUrl: parentWidget.launchUrl,
            width: 200,
            widgetVersion: parentWidget.versionName,
            tags: Ext.JSON.encode([approvalTag]),
            singleton: parentWidget.owfProperties && parentWidget.owfProperties != "" ? parentWidget.owfProperties.singleton : false,
            visible: parentWidget.owfProperties && parentWidget.owfProperties != "" ? parentWidget.owfProperties.visibleInLaunch : true
        };
        if (directRequired.length > 0) {
            json.directRequired = Ext.JSON.encode(directRequired);
        }
        widgetsJSON.push(Ext.JSON.encode(json));
        
        if (requiredListings && requiredListings.length > 1) {
            requiredListings = requiredListings.slice(1);
            
            // Add required widgets
            for (var i = 0; i < requiredListings.length; i++) {
                directRequired = [];
                
                for (var j = 0; j < requiredListings[i].requires.length; j++) {
                    directRequired.push(requiredListings[i].requires[j].uuid);
                }
                
                json = {
                    displayName: requiredListings[i].title,
                    height: 200,
                    imageUrlLarge: requiredListings[i].imageLargeUrl ? requiredListings[i].imageLargeUrl : Ozone.util.contextPath(),
                    imageUrlSmall: requiredListings[i].imageSmallUrl ? requiredListings[i].imageSmallUrl : Ozone.util.contextPath(),
                    isExtAjaxFormat: true,
                    widgetGuid: requiredListings[i].uuid,
                    widgetUrl: requiredListings[i].launchUrl,
                    width: 200,
                    widgetVersion: requiredListings[i].versionName,
                    tags: Ext.JSON.encode([approvalTag]),
                    singleton: requiredListings[i].owfProperties ? requiredListings[i].owfProperties.singleton : false,
                    visible: requiredListings[i].owfProperties ? requiredListings[i].owfProperties.visibleInLaunch : true
                };
                if (directRequired.length > 0) {
                    json.directRequired = Ext.JSON.encode(directRequired);
                }
                widgetsJSON.push(Ext.JSON.encode(json));
            }
            
            var alertView = Ext.widget('templateeventdataview', {
                multiSelect: false,
                singleSelect: false,
                simpleSelect: false,
                autoScroll: true,
                cls: 'mpWindow',
                style: {
                    background: "none"
                },
                itemSelector: '.selectable',
                data: requiredListings,
                tpl: Ext.create('Ext.XTemplate', 
                    '<div class="mpMsgWindow">',
                        '<div class="mpParentListing">',
                            '<table width="100%">',
                                '<tr>',
                                    '<td valign="top" width="65">',
                                        '<div class="parent-icon">',
                                            '<img src="' + parentWidget.imageLargeUrl + '" title="' + Ext.util.Format.htmlEncode(parentWidget.title) + '">',
                                        '</div>',
                                    '</td>',
                                    '<td valign="top">',
                                        '<div class="parent-title">' + Ext.util.Format.htmlEncode(parentWidget.title) + '</div>',
                                        '<div class="parent-text">' + Ozone.layout.DialogMessages.marketplaceWindow_RequiredListingsAlertMsg + '</div>',
                                    '</td>',
                                '</tr>',
                            '</table>',
                        '</div>',
                        '<div id="mpMsgWindowProgress" class="mpMsgWindowProgress"></div>',
                        '<div class="mpRequiredListings">',
                            '<tpl for=".">',
                                '<div class="mpDetailSummary {[xindex % 2 === 0 ? "" : "striped-row"]}">',
                                    '<table width="100%">',
                                        '<tr>',
                                            '<td valign="top" width="85">',
                                                '<div class="detail-icon">',
                                                    '<img src="{imageLargeUrl}" title="{title:this.htmlEncode}">',
                                                '</div>',
                                            '</td>',
                                            '<td valign="top">',
                                                '<div class="detail-title">{title:this.htmlEncode}</div>',
                                                '<div class="detail-version">',
                                                    'Version {versionName:this.htmlEncode}&nbsp;&nbsp;{owfProperties:this.visibleInLaunch}',
                                                '</div>',
                                                '<div class="mpDetailInfo">',
                                                    '<span class="detail-author-label">Owner: </span>',
                                                    '<span class="detail-author">{author:this.htmlEncode}</span>',
                                                '</div>',
                                                '<div class="mpDetailInfo">',
                                                    '<span class="detail-released-label">Released: </span>',
                                                    '<span class="detail-released">{createdDate:this.displayDate}</span>',
                                                '</div>',
                                            '</td>',
                                            '<td valign="top">',
                                                '<div style="padding-top:25px;">&nbsp;</div>',
                                                '<div class="mpDetailInfo">',
                                                    '<span class="detail-organization-label">Organization: </span>',
                                                    '<span class="detail-organization">{organization:this.htmlEncode}</span>',
                                                '</div>',
                                                '<div class="mpDetailInfo">',
                                                    '<span class="detail-modified-label">Modified: </span>',
                                                    '<span class="detail-modified">{editedDate:this.displayDate}</span>',
                                                '</div>',
                                            '</td>',
                                        '</tr>',
                                    '</table>',
                                '</div>',
                            '</tpl>', 
                        '</div>',
                    '</div>', {
                    compiled: true,
                    htmlEncode: function(str) {
                        return Ext.util.Format.htmlEncode(str);
                    },
                    displayDate: function(strDate) {
                        if (strDate) {
                            var yyyy = strDate.substr(0,4);
                            var mm = parseInt(strDate.substr(5,2),10) - 1; // months go from 0 - 11
                            var dd = strDate.substr(8,2);
                            var H = strDate.substr(11,2);
                            var min = strDate.substr(14,2);
                            var sec = strDate.substr(17,2);
                            var dt = new Date(yyyy, mm, dd, H, min, sec, 0);
                            strDate = Ext.Date.format(dt, 'm/d/Y');
                        }
                        return strDate ? strDate : "";
                    },
                    visibleInLaunch: function (owfProperties) {
                        return owfProperties && owfProperties.visibleInLaunch ? "" : "(Hidden)";
                    }
                })
            });
            
            var alertWin = Ext.create('Ext.window.Window', {
                title: 'Adding Widget',
                width: 750,
                height: 450,
                layout: 'fit',
                modal: true,
                items: [alertView],
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'bottom',
                    ui: 'footer',
                    items: [
                        { 
                            xtype: 'tbfill'
                        },{
                            xtype: 'button', 
                            text: Ozone.layout.MessageBoxButtonText.ok,
                            handler: function() {
                                var progressBar = Ext.create('Ext.ProgressBar', {
                                   text: 'Adding Widget...',
                                   autoShow: true,
                                   renderTo: 'mpMsgWindowProgress'
                                });
                                
                                progressBar.wait({
                                   text: 'Adding Widget...',
                                   interval: 1000, //bar will move fast!
                                   increment: 100
                                });
                                                                
                                owfdojo.xhrPost({
                                    url: Ozone.util.contextPath() + '/widget/',
                                    sync: true,
                                    content: {
                                        addExternalWidgetsToUser: true,
                                        widgets: Ext.JSON.encode(widgetsJSON)
                                    },
                                    load: function(response, ioArgs) {
                                        var cp = Ext.getCmp('launchMenuPanel');
                                        cp.widgetStore.load();
                                        alertWin.close();
                                    },
                                    error: function(response, ioArgs) {
                                        alertWin.close();
                                        Ozone.Msg.alert(Ozone.layout.DialogMessages.error, Ozone.layout.DialogMessages.marketplaceWindow_AddWidget, null, null, {
                                            cls:'confirmationDialog'
                                        });
                                    }
                                });                             
                            }
                        }, { 
                            xtype: 'button', 
                            text: Ozone.layout.MessageBoxButtonText.cancel,
                            handler: function() {
                                alertWin.close();
                            }
                        }, {
                            xtype: 'tbfill'
                        }
                    ]
                }]
            }).show();
        } else {
            owfdojo.xhrPost({
                url: Ozone.util.contextPath() + '/widget/',
                sync: true,
                content: {
                    addExternalWidgetsToUser: true,
                    widgets: Ext.JSON.encode(widgetsJSON)
                },
                load: function(response, ioArgs) {
                    var cp = Ext.getCmp('launchMenuPanel');
                    cp.widgetStore.load();
                },
                error: function(response, ioArgs) {
                    Ozone.Msg.alert(Ozone.layout.DialogMessages.error, Ozone.layout.DialogMessages.marketplaceWindow_AddWidget, null, null, {
                        cls:'confirmationDialog'
                    });
                }
            });
        }
    },
    
    // private
    initComponent: function(){
        Ozone.components.MPListingsAPI = new Ozone.marketplace.MPListingsAPI();
        Ozone.components.MPCategoryAPI = new Ozone.marketplace.MPCategoryAPI();
        
        this.mpWidgetDetailPage = Ext.create('Ozone.components.marketplace.MPWidgetDetailsPanel', {
            parentWidget: {},
            requiredListings: []
        });

        //for some browsers, this needs to be done on refresh.
        //for others it needs to be done on templaterendered
        this.mpWidgetDetailPage.mpWidgetSummary.on('templaterendered', 
                this.resetCircularFocus, this);
        this.mpWidgetDetailPage.mpWidgetSummary.on('refresh', 
                this.resetCircularFocus, this);
                
        var itemOpenFunction = function(view, record) {
            var mpWidgetDetailPage = this.down('#mpWidgetDetailPage');
            mpWidgetDetailPage.recordId = record.data.id;
            
            // Switch to widget detail page
            var mpMainPanel = this.down('#mpMainPanel');
            mpMainPanel.layout.setActiveItem('mpWidgetDetailPage');                     
        };

        this.mpSearchResults = Ext.widget('templateeventdataview', {
            pageSize: 12,
            itemId: 'mpSearchResults',
            tpl: Ext.create('Ext.XTemplate', '<tpl for=".">', '<div id="{uuid}-thumb" class="thumb-wrap dataview-item" style="width:' + DEFAULT_ITEM_WIDTH + 'px;">', '<center>', '<div id="{uuid}-thumb-icon" class="thumb">', '<img src="{imageLargeUrl}">', '</div>', '<div id="{uuid}-thumb-name" class="thumb-text">{shortName}</div>', '<div id="{uuid}-thumb-author" class="thumb-text">By {shortAuthor}</div>', '</center>', '</div>', '</tpl>', {
                compiled: true,
                createTooltip: function(title, description){
                    return Ext.util.Format.htmlEncode(Ext.util.Format.ellipsis(title, 30)) + '<br>' +
                    Ext.util.Format.htmlEncode(Ext.util.Format.ellipsis(description, 144));
                }
            }),
            multiSelect: false,
            singleSelect: true,
            autoScroll: true,
            store: Ozone.components.MPListingsAPI.getStore(),
            autoHeight: true,
            cls: 'mpSearchResults',
            itemSelector: 'div.dataview-item',
            overItemCls: 'x-grid3-row-over',
            selectedItemCls: 'x-grid3-cell-selected',
            region: 'center',
            listeners: {
                itemdblclick: {
                    fn: itemOpenFunction,
                    scope: this
                },
                itemkeydown: {
                    fn: function(view, record, node, index, evt) {
                        switch (evt.getKey()) {
                            case evt.ENTER:
                            case evt.SPACE:
                                itemOpenFunction.apply(this, arguments);
                        }
                    },
                    scope: this
                },
                templaterendered: {
                    fn: function(dataview){
                        var nodes = dataview.getNodes();
                        var records = dataview.getRecords(nodes);
                        for (var i = 0; i < nodes.length; i++) {
                            var title = Ext.util.Format.htmlEncode(records[i].data.title);
                            var description = Ext.util.Format.htmlEncode(Ext.util.Format.ellipsis(records[i].data.description, 144));
                            var tooltip = '<div class="tooltip-title">' + title + '</div><div>' + description + '</div>';
                            Ext.create('Ext.tip.ToolTip', {
                                target: nodes[i],
                                html: tooltip
                            });

                            Ozone.components.focusable.Focusable.setupFocus(nodes[i]);

                        }
                    },
                    scope: this
                }            },
            prepareData: function(data){
                data.shortName = Ext.util.Format.htmlEncode(Ext.util.Format.ellipsis(data.title, 10));
                data.shortAuthor = Ext.util.Format.htmlEncode(Ext.util.Format.ellipsis(data.author, 7));
                return data;
            }
        });

        function mpCategoriesHandler(dataView, index, node, event) {
            var parseID = Ozone.util.parseID;
            var header = dataView.tpl.idHeader;
            var categoryID = parseID(node.id, header) != 'all' ? parseInt(parseID(node.id, header), 10) : undefined;
            var categoryIDs = [];
            if (categoryID) 
                categoryIDs.push(categoryID);
            
            var store = Ozone.components.MPListingsAPI.getStore();
            var lastOptions = store.lastOptions;
            Ext.apply(lastOptions.params, {
                categoryIDs: categoryIDs.length > 0 ? ("[" + categoryIDs.toString() + "]") : undefined,
                event: {
                    dataView: dataView,
                    index: index,
                    node: node,
                    event: event
                },
                countCategories: false,
                start: 0,
                limit: this.mpSearchResults.pageSize,
                currentPage: 1,
                queryString: lastOptions.params.queryString,
                callback: function(records, options, success) {
                    var event = options.event;
                    var nodes = event.dataView.getNodes();
                    for (var i = 0; i < nodes.length; i++) {
                        if (event.node.id == nodes[i].id) 
                            (Ext.create('Ext.core.Element', nodes[i])).addCls('category-selected');
                        else 
                            (Ext.create('Ext.core.Element', nodes[i])).removeCls('category-selected');
                    }
                    
                    var elemAllCats = Ext.get('category-tree-all');
                    if (elemAllCats) {
                        elemAllCats.removeCls('category-selected');
                    }
                
                    var mpMainPanel = this.down('#mpMainPanel');
                    var widgetStore = Ozone.components.MPListingsAPI.getStore();
                    if (widgetStore && mpMainPanel) {
                        //only bind the store if it is not already.  Rebinding it will refresh the
                        //elements, which will lose all modifications (tooltips, focusability, etc)
                        if (widgetStore !== this.mpSearchResults.store)
                            this.mpSearchResults.bindStore(widgetStore);
                        mpMainPanel.layout.setActiveItem('mpSearchResultsPanel');
                    }
                },
                scope: this
            });
            Ozone.components.MPListingsAPI.loadStore(lastOptions.params, true);
        }
        
        this.mpCategories = Ext.widget('templateeventdataview', {
            id: 'mpCategoryTree',
            itemId: 'mpCategoryTree',
            multiSelect: false,
            singleSelect: true,
            store: Ozone.components.MPCategoryAPI.getStore(),
            autoHeight: false,
            autoScroll: true,
            itemSelector: 'span.category-selectable',
            region: 'center',
            ctCls: 'navigation-panel',
            selectedItemCls: '',
            listeners: {
                itemclick: {
                    fn: mpCategoriesHandler,
                    scope: this
                },
                itemkeydown: {
                    fn: function(dataView, record, item, index, evt) {
                        switch (evt.getKey()) {
                            case evt.ENTER:
                            case evt.SPACE:
                                mpCategoriesHandler.apply(this, arguments);                            
                        }
                    },
                    scope: this
                },
                templaterendered: {
                    fn: function(dataView){
                        var elemAllCats = Ext.get('category-tree-all')
                        if (elemAllCats) {
                            function handler() {
                                var parseID = Ozone.util.parseID;
                                var header = dataView.tpl.idHeader;
                                var categoryID = undefined;
                                var categoryIDs = [];
                                if (categoryID) 
                                    categoryIDs.push(categoryID);
                        
                                var store = Ozone.components.MPListingsAPI.getStore();
                                Ozone.components.MPListingsAPI.loadStore({
                                    queryString: store.lastOptions.params.queryString,
                                    categoryIDs: undefined,
                                    countCategories: false,
                                    start: 0,
                                    limit: this.mpSearchResults.pageSize,
                                    sort: 'title',
                                    order: 'asc',
                                    callback: function(records, options, success) {
                                        var nodes = dataView.getNodes();
                                        for (var i = 0; i < nodes.length; i++) {
                                            (Ext.create('Ext.core.Element', nodes[i])).removeCls('category-selected');
                                        }
                                        
                                        if (elemAllCats) {
                                            elemAllCats.addCls('category-selected');
                                        }
                            
                                        var mpMainPanel = this.down('#mpMainPanel');
                                        var widgetStore = Ozone.components.MPListingsAPI.getStore();
                                        if (widgetStore && mpMainPanel) {
                                            //only bind the store if it is not already.  Rebinding it will refresh the
                                            //elements, which will lose all modifications (tooltips, focusability, etc)
                                            if (widgetStore !== this.mpSearchResults.store)
                                                this.mpSearchResults.bindStore(widgetStore);
                                            mpMainPanel.layout.setActiveItem('mpSearchResultsPanel');
                                        }
                                    },
                                    scope: this
                                });
                            }
                            elemAllCats.addListener('click', handler, this);
                            elemAllCats.addListener('keydown', function(evt) {
                                switch (evt.getKey()) {
                                    case evt.ENTER:
                                    case evt.SPACE:
                                        handler.apply(this);
                                }
                            }, this);
                        }

                        Ext.select('.category-selectable, .category-all-selectable').each(function (fly) {
                            Ozone.components.focusable.Focusable.setupFocus(fly.dom, this);
                        }, this);

                        this.resetCircularFocus();

                    },
                    scope: this
                }
            },
            tpl: Ext.create('Ext.XTemplate', '<div id="category-tree" class="category-tree">', '<span class="category-header">Categories</span><br>', '<span id={id:this.createID} class="category-selected category-all-selectable">All Categories</span><br>', '<tpl for=".">', '<span id={id:this.createID} class="category-selectable">', '{title}<span id="{id:this.createID}-count"></span>', '</span><br>', '</tpl>', '</div>', {
                compiled: true,
                idHeader: 'category-tree-',
                createID: function(id){
                    return id ? this.idHeader + id : this.idHeader + 'all';
                }
            })
        });
        
        this.mpNavigation = {
            itemId: 'mpNavigation',
            cls: 'mpNavigation',
            region: 'west',
            split: false,
            border: true,
            layout: 'border',
            width: 200,
            items: [this.mpHomeIcon, this.mpCategories]
        };
        
        var sortData = [['Alphabetical: A -> Z', 'title-asc'], ['Alphabetical: Z -> A', 'title-desc'], ['Newest -> Oldest', 'releaseDate-desc'], ['Oldest -> Newest', 'releaseDate-asc']];
        
        // configure top toolbar of the marketplace widget
        var tbarButtons = new Array();
        tbarButtons.push('Sort&nbsp;');
        tbarButtons.push({
            xtype: 'combo',
            itemId: 'mpSortCombo',
            store: new Ext.data.SimpleStore({
                data: sortData,
                fields: ['sortLabel', 'sortType']
            }),
            valueField: 'sortType',
            displayField: 'sortLabel',
            typeAhead: true,
            mode: 'local',
            triggerAction: 'all',
            selectOnFocus: true,
            allowBlank: true,
            forceSelection: true,
            width: 125,
            listeners: {
                select: {
                    scope: this,
                    fn: function(combo, record, index){
                        var options = {sorters: []};
                        switch (combo.getValue()) {
                            case 'releaseDate-asc':
                                options.sorters.push({property : 'releaseDate', direction: 'asc'})
                                break;
                            case 'releaseDate-desc':
                                options.sorters.push({property : 'releaseDate', direction: 'desc'})
                                break;
                            case 'title-desc':
                                options.sorters.push({property : 'title', direction: 'desc'})
                                break;
                            case 'title-asc':
                                options.sorters.push({property : 'title', direction: 'asc'})
                                break;
                        }
                        Ozone.components.MPListingsAPI.loadStore(options, true);
                    }
                }
            }
        });
        tbarButtons.push('->');
        tbarButtons.push({
            xtype: 'searchbox',
            listeners: {
                searchchanged: function(field, newText){
                    // Perform Marketplace search on widget title, description, and author
                    var mpMainPanel = this.down('#mpMainPanel');
                    if (mpMainPanel) {
                        mpMainPanel.layout.setActiveItem('mpSearchResultsPanel');
                        this.searchByText(newText);
                    }
                },
                scope: this
            }
        });
        
        var mpSearchResultsPanel = {
            itemId: 'mpSearchResultsPanel',
            cls: 'mpSearchResultsPanel',
            items: [this.mpSearchResults],
            autoScroll: true,
            autoHeight: false,
            bbar: Ext.widget('sortablepagingtoolbar', {
                itemId: 'mpPagingToolbar',
                cls: 'mpPagingToolbar',
                pageSize: this.mpSearchResults.pageSize,
                store: this.mpSearchResults.store,
                displayInfo: true
            })
        };
        
        this.mpMainPanel = {
            itemId: 'mpMainPanel',
            cls: 'mpMainPanel',
            xtype: 'panel',
            region: 'center',
            activeItem: 0,
            layout: 'bufferedcard',
            flex: 3,
            layoutConfig: {
                deferredRender: true,
                layoutOnCardChange: true
            },
            dockedItems: {
                xtype: 'toolbar',
                dock: 'top',
                layout: {
                    type: 'hbox',
                    align: 'stretchmax'
                },
                items: tbarButtons
            },
            listeners: {
                afterlayout: {
                    fn: function(panel, layout) {
                        this.resetCircularFocus();
                    },
                    scope: this
                }
            },
            items: [mpSearchResultsPanel, this.mpWidgetDetailPage]
        };
        
        this.mpPanel = Ext.create('Ext.panel.Panel', {
            itemId: 'mpPanel',
            region: 'center',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            split: false,
            border: false,
            items: [this.mpNavigation, this.mpMainPanel]
        });
        
        var mpLoginPanel = Ext.create('Ext.panel.Panel', {
            itemId: 'mpLoginPanel',
            html: '<iframe id="mpLoginIFrame" src="' + Ozone.config.marketplaceLocation + '/about.gsp" height="100%" width="100%"></iframe>'
        });
        
        this.mpMainPanelContainer = {
            itemId: 'mpMainPanelContainer',
            cls: 'mpMainPanelContainer',
            xtype: 'panel',
            region: 'center',
            activeItem: 'mpLoginPanel',
            layout: 'bufferedcard',
            layoutConfig: {
                deferredRender: true,
                layoutOnCardChange: true
            },
            items: [mpLoginPanel]
        };
        
        this.mpProgressBar = Ext.create('Ext.ProgressBar', {
            itemId: 'mpProgressBar',
            width: this.width - 16
        });
        
        Ext.applyIf(this, {
            items: [this.mpMainPanelContainer],
            bbar: [this.mpProgressBar]
        });
        
        this.on('resize', this.onResize);
        
        //call super init
        this.callParent();
    },
    
    // private
    onResize: function(win, newWidth, newHeight){
        this.callParent(arguments);
        
        var mpProgressBar = this.down('#mpProgressBar');
        mpProgressBar.setWidth(newWidth - 16);
    },
    
    // private
    onShow: function(cmp){
        this.callParent(arguments);
        
        this.maxTimeout = 30000;
        this.timeoutInterval = 5000;
        if (!this.alreadyShownFlag) {
            this.initialTimeoutInterval = Ozone.config.mpInitialPollingInterval;
        }
        else {
            this.initialTimeoutInterval = this.timeoutInterval;
        }
        this.alreadyShownFlag = true;
        
        var mpProgressBar = this.down('#mpProgressBar');
        var mpMainPanelContainer = this.getComponent('mpMainPanelContainer');
        
        // Set progress bar text
        var progressText = 'Loading Marketplace Widget';
        if (mpMainPanelContainer.layout.activeItem.itemId != 'mpLoginPanel') {
            progressText = 'Refreshing Marketplace Widget';
        }
        
        // Start progress bar
        mpProgressBar.wait({
            text: progressText,
            increment: (this.maxTimeout / 1000)
        });
        
        var isComplete = false;
        var timeoutObj = {
            pingMP: function(scope){
                if (scope.maxTimeout) {
                    scope.maxTimeout = scope.maxTimeout - scope.timeoutInterval;
                }
                else {
                    // If maxTimeout is null then Marketplace widget is refreshing
                    progressText = 'Refreshing Marketplace Widget';
                    mpProgressBar.updateText(progressText);
                    
                    // Start progress bar
                    mpProgressBar.wait({
                        text: progressText,
                        increment: (scope.timeoutInterval / 1000)
                    });
                }
                
                try {
                    Ozone.marketplace.util.getOwfCompatibleItems({
                        useIndex: true,
                        max: 0,
                        timeout: 2000,
                        
                        success: function onSuccess(json){
                            // Set because calls are asynchronous
                            isComplete = true;
                            
                            // Stop pinging Marketplace
                            clearTimeout(scope.timeout);
                            
                            // Reset url (in case iframe redirected)
                            document.getElementById('mpLoginIFrame').src = Ozone.config.marketplaceLocation + "/about.gsp";
                            
                            if (mpMainPanelContainer) {
                                // If you're on the login panel...
                                if (mpMainPanelContainer.layout.activeItem.itemId == 'mpLoginPanel') {
                                    // Add mpPanel
                                    mpMainPanelContainer.add(scope.mpPanel);
                                    
                                    // Go to Marketplace Widget main view
                                    mpMainPanelContainer.layout.setActiveItem('mpPanel');
                                    
                                    // Load stores
                                    Ozone.components.MPCategoryAPI.loadStore({
                                        start: 0,
                                        limit: 20,
                                        callback: function() {
                                            Ozone.components.MPListingsAPI.loadStore({
                                                countCategories: false,
                                                start: 0,
                                                limit: this.mpSearchResults.pageSize,
                                                pageSize: this.mpSearchResults.pageSize,
                                                sorters: [
                                                    {
                                                        property : 'title',
                                                        direction: 'asc'
                                                    }
                                                ]
                                            });
                                        },
                                        scope: scope
                                    });
                                }
                                else {
                                    // Try to refresh the categories and listings
                                    try {
                                        var listingsStore = Ozone.components.MPListingsAPI.getStore();
                                        Ozone.components.MPListingsAPI.loadStore(listingsStore.lastOptions.params, true);
                                    } 
                                    catch (e) {
                                        // Do nothing
                                        var err = e;
                                    }
                                    
                                    // Try to refresh the details panel
                                    if (scope.down('#mpMainPanel').layout.activeItem.itemId == 'mpWidgetDetailPage') {
                                        var mpWidgetDetailPage = scope.down('#mpWidgetDetailPage');
                                        mpWidgetDetailPage.updateDetails();
                                    }
                                }
                            }
                            mpProgressBar.reset();
                            mpProgressBar.updateText('');
                            
                            // Increase timeout interval to ping Marketplace every 5 minutes
                            // so that the session stays active.
                            scope.timeoutInterval = Ozone.config.mpPollingInterval ? Ozone.config.mpPollingInterval : 300000;
                            // success case poll indefinitely
                            scope.maxTimeout = scope.timeoutInterval * 2;
                            scope.timeout = setTimeout(owfdojo.hitch(timeoutObj, "pingMP", scope), scope.timeoutInterval);
                        },
                        
                        failure: function onGetFailure(error, status){
                            if (scope.maxTimeout <= 0) {
                                clearTimeout(scope.timeout);
                                mpProgressBar.reset();
                                Ozone.Msg.alert(Ozone.util.ErrorMessageString.mpErrorTitle, Ozone.util.ErrorMessageString.mpErrorMsg);
                                Ext.getCmp('mpWindow').hide();
                            }
                            else {
                                //make sure login page is shown
                                if (!isComplete && mpMainPanelContainer.layout.activeItem && mpMainPanelContainer.layout.activeItem.itemId != 'mpLoginPanel') {
                                    // Reset url (in case iframe redirected)
                                    document.getElementById('mpLoginIFrame').src = Ozone.config.marketplaceLocation + "/about.gsp";
                                    mpMainPanelContainer.layout.setActiveItem('mpLoginPanel');
                                }
                                
                                //decrease interval because there was a failure
                                scope.timeoutInterval = 5000;
                                if (scope.maxTimeout >= 30000) {
                                    scope.maxTimeout = 30000;
                                }
                                clearTimeout(scope.timeout);
                                scope.timeout = setTimeout(owfdojo.hitch(timeoutObj, "pingMP", scope), scope.timeoutInterval);
                                
                                
                            }
                        }
                    });
                    //                  clearTimeout(scope.timeout);
                    //                  scope.timeout = setTimeout(owfdojo.hitch(timeoutObj, "pingMP", scope), scope.timeoutInterval);
                } 
                catch (e) {
                    clearTimeout(scope.timeout);
                    mpProgressBar.reset();
                    Ozone.Msg.alert(Ozone.util.ErrorMessageString.mpErrorTitle, Ozone.util.ErrorMessageString.mpErrorMsg);
                    Ext.getCmp('mpWindow').hide();
                }
            }
        };
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(owfdojo.hitch(timeoutObj, "pingMP", this), this.initialTimeoutInterval);
        
        var mpShoppeIcon = Ext.get('mpShoppeIcon');
        if (mpShoppeIcon) {
            //remove any listeners on the mpShoppeIcon in case this is called multiple times
            mpShoppeIcon.removeAllListeners();
            
            mpShoppeIcon.on('click', function(evt, target, win){
                var mpMainPanel = this.down('#mpMainPanel');
                if (mpMainPanel) {
                    mpMainPanel.layout.setActiveItem('mpSearchResultsPanel');
                    // TODO: Reset search results to display newest mp listings
                }
            });
            mpShoppeIcon.on("mouseover", function(evt, obj){
                this.dom.style.cursor = "pointer";
            });
            mpShoppeIcon.on("mouseout", function(evt, obj){
                this.dom.style.cursor = "default";
            });
        }
    },

    resetCircularFocus: function() {
        //remove old circular focus, set up new one.
        //this is necessary because the last focusable element
        //changes when the active panel is switched
        this.tearDownCircularFocus();
        this.setupFocus(
            this.getEl().select('.category-all-selectable')
                .first(), 
            this.getEl().select('button').filter(function(el) {
                return el.isVisible(true);
            }).last()
        );
    }
});
