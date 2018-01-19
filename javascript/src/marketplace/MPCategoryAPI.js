// @namespace
Ext.namespace('Ozone.marketplace');

// Set up a model to use in our Store
Ext.define('Ozone.marketplace.model.Category', {
    extend: 'Ext.data.Model',
    fields: [
        'class', 'id', 'title', 'description', 'isDeleted'
    ]
});

/**
 * @class Creates a new MPCategoryAPI object
 * @extends Ext.marketplace.MPCategoryAPI
 * @description The Ozone.marketplace.MPCategoryAPI object encapsulates a data store holding Marketplace Category data,
 * and also provides 'get' and 'load' functions on the store.  
 * <p>Use <span style="font-family:monospace">MPCategoryAPI.getStore()</span> to obtain a reference to the object's data store.</p>
 * <p>Use <span style="font-family:monospace">MPCategoryAPI.loadStore()</span> to force the store to load from the JSON source.  Used 
 * in conjuntion with MPCategoryRetriever and JsonProxy.</p>
 * @example
 * // Example usage:
 * myMPCategoryAPI = new Ozone.marketplace.MPCategoryAPI();
 * @constructor
 */

Ozone.marketplace.MPCategoryAPI = function() {

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
        jsonRetriever: Ext.create('Ozone.marketplace.MPCategoryRetriever')
    });
        
    // proxy event handling
    // @event
    proxy.jsonRetriever.on('success', function(jsonResponse, op, callback, scope) {
        proxy.processJson(jsonResponse, op, callback, scope);
    });
    // @event
    proxy.jsonRetriever.on('failure', function(jsonResponse, op, callback, scope) {
        proxy.processJson(jsonResponse, op, callback, scope);
    });

    var store = Ext.create('Ext.data.Store', {
        model: 'Ozone.marketplace.model.Category',
        proxy: proxy,
        remoteSort: true,
        lastOptions: {
            params: {
                sort : 'title',
                order: 'asc',
                limit: 20,
                start: 0
            }
        }
    });
        
    // --------------------------------------------------------------------
    // public ...
	
    // Return a reference to the store.
    // @public
    this.getStore = function() {
        // @returns a reference to the MPCategoryAPI's store
        return store;
    };

    // Load the store.  
    // @public
    this.loadStore = function(options, merge) {
        
        options = options || {};
        if (merge) { options = Ext.applyIf(options, store.lastOptions.params); }
        store.lastOptions.params = options;
        
        store.load(options);
    };
	
};
