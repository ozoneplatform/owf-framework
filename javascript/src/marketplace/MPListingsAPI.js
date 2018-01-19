// @namespace
Ext.namespace('Ozone.marketplace');

// Set up a model to use in our Store
Ext.define('Ozone.marketplace.model.ServiceItem', {
    extend: 'Ext.data.Model',
    fields: [
        'imageLargeUrl', 'launchUrl', 'state', 'screenshot2Url', 'requirements',
        'id', 'author', 'organization', 'avgRate', 'title', 'releaseDate',
        'recommendedLayouts', 'dependencies', 'description', 'docUrl', 'totalVotes',
        'approvalStatus', 'types', 'techPoc', 'screenshot1Url', 'customFields',
        'isPublished', 'versionName', 'installUrl', 'categories', 'uuid',
        'imageSmallUrl', 'createdDate', 'editedDate', 'isEnabled', 'createdBy', 'lastActivity',
        'owfProperties'
    ]
});

/**
 * @class Creates a new MPListingsAPI object
 * @extends Ext.marketplace.MPListingsAPI
 * @description The Ozone.marketplace.MPListingsAPI object encapsulates a data store holding Marketplace Listings data,
 * and also provides 'get' and 'load' functions on the store.  
 * <p>Use <span style="font-family:monospace">MPListingsAPI.getStore()</span> to obtain a reference to the object's data store.</p>
 * <p>Use <span style="font-family:monospace">MPListingsAPI.loadStore()</span> to force the store to load from the JSON source.  Used 
 * in conjuntion with MPListingsRetriever and JsonProxy.</p>
 * @example
 * // Example usage:
 * myMPListingsAPI = new Ozone.marketplace.MPListingsAPI();
 * @constructor
 */

Ozone.marketplace.MPListingsAPI = function() {

    // --------------------------------------------------------------------
    // private...
	
    // proxy definition
    var proxy = Ext.create('Ozone.data.JsonProxy', {
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            idProperty: 'id',
            successProperty: 'success'
        },
        jsonRetriever: Ext.create('Ozone.marketplace.MPListingsRetriever', {})
    });
    
    // proxy event handling
    proxy.jsonRetriever.on('success', function( jsonResponse, op, callback, scope) {
        proxy.processJson(jsonResponse, op, callback, scope);
    });
    proxy.jsonRetriever.on('failure', function( jsonResponse, op, callback, scope) {
        proxy.processJson(jsonResponse, op, callback, scope);
    });
    
    // JSON data store
    var store = Ext.create('Ext.data.Store', {
        model: 'Ozone.marketplace.model.ServiceItem',
        proxy: proxy,
        remoteSort: true,
        pageSize: 12,
        sorters: [
            {
                property : 'title',
                direction: 'asc'
            }
        ],
        lastOptions: {
            params: {
                limit: 20,
                start: 0
            }
        },
        listeners: {
            load: {
                fn: function(store, records, options) {
                    var storeRecords = store.getRange();
                    for (var i = 0; i < storeRecords.length; i++) {
                        var record = storeRecords[i].data;
                        record.dependencies = Ext.util.Format.htmlEncode(record.dependencies);
                        record.description = Ext.util.Format.htmlEncode(record.description);
                        record.requirements = Ext.util.Format.htmlEncode(record.requirements);
                        record.title = Ext.util.Format.htmlEncode(record.title);
                        record.versionName = Ext.util.Format.htmlEncode(record.versionName);
                        record.launchUrl = Ext.util.Format.htmlEncode(record.launchUrl);
                        record.author = Ext.util.Format.htmlEncode(record.author);
                        
                        if (Ext.isEmpty(record.owfProperties)) {
                            record.owfProperties = {
                                visibleInLaunch: true,
                                singleton: false
                            };
                    }
                    }
                },
                scope: this
            }
        }
    });
    
    // --------------------------------------------------------------------
    // public...

    // Return a reference to the store.
    this.getStore = function() {
        return store;
    };

    // Load the store.  Update widget counts for each category.
    //this.loadStore = function( params, cb, scope, append ) {
    this.loadStore = function(options, merge) {
        
        options = options || {};
        if (merge) {options = Ext.applyIf(options, store.lastOptions.params);}
        store.lastOptions.params = options;
        
        if (options.sorters && options.sorters[0]) {
            store.sorters.items[0].property = options.sorters[0].property;
            store.sorters.items[0].direction = options.sorters[0].direction;
        }
        
        if (options.currentPage) { store.currentPage = options.currentPage; }
        
        store.load({
            
            categoryIDs: options.categoryIDs,
            typeIDs: options.typeIDs,
            stateIDs: options.stateIDs,
            title: options.title,
            description: options.description,
            author: options.author,
            queryString: options.queryString,
            scope: options.scope,
            start: options.start,
            limit: options.limit,
            sorters: options.sorters,
            event: options.event,
            pageSize: options.pageSize,
            useIndex: (options.useIndex !== false) ? true : false,

            callback: options.countCategories ? function(rec, opts, success) {

                // ------------------------------------------------------
                // Update category tree with widget counts by category
                // ------------------------------------------------------

                // get total count for each category:
                var categoryCount = [];
                store.each( function(record) {
                    var len = record.data.categories.length;
                    if (len > 0) {
                        // Count widgets by category.
                        for (var idx = 0; idx < len; idx++) {
                            var catId = parseInt(record.data.categories[idx].id);
                            if ( isNaN(categoryCount[catId]) ) {
                                // first instance, array el not initialized so value is NaN and can't be incremented
                                categoryCount[catId] = 1;			
                            } else {
                                // 2nd and subseq instances, just increment
                                categoryCount[catId]++;				
                            }
                        }
                    }
                });
				
                // update category descriptions:
                var cat_els = Ext.query("*[class*=category-selectable]", Ext.get('mpCategoryTree').dom);
                Ext.each(cat_els, function(cat_el, index) {
                    var cat_el_catid = cat_el.id.substr(14);		// category id of current element of class 'category-selectable'
                    if ( cat_el ) {
                        if (cat_el.id != 'category-tree-all') {
                            // count for unique category:
                            var el_catid_count = categoryCount[parseInt(cat_el_catid)];
                            var countNode = Ext.query("*[id="+cat_el.id+"-count]", cat_el);
                            if ( el_catid_count != undefined && el_catid_count != null && !isNaN(el_catid_count) ) {
                                countNode[0].innerHTML = " (" + el_catid_count + ")";
                            } else {
                                // default for categories with no widgets: 
                                countNode[0].innerHTML = " (0)";
                            }
                        }
                    }
                });
				
                // --------------------
                // execute callback (?):
                // --------------------
                if (options.callback) {
                    options.callback.call(rec, opts, success);
                }
            } : options.callback,

            add: options.append
		
        });
    };
    
    // Utility method to retrieve widget count for a specified category id number.
    this.getCategoryCount = function( category_id ) {
        if (!isNaN(category_id)) {
            return categoryCount[ parseInt( category_id ) ];
        }
    };
	
}
