// @namespace
Ext.namespace('Ozone.marketplace');

/**
 * @class Creates a new MPListingsRetriever object
 * @extends Ext.marketplace.MPListingsRetriever
 * @description The Ozone.marketplace.MPListingsRetriever object calls the Marketplace API to retrieve Listings data.
 * <p><span style="font-family:monospace">This object's <span style="font-family:monospace">retrieve()</span> method 
 * is called from the JsonProxy object defined on the store in MPListingsAPI.  'success' or 'failure' events both result in a call to the 
 * <span style="font-family:monospace">processJson()</span> method of JsonProxy, which then loads data into the store.</p>
 * @example
 * // Example usage:
 * myMPListingsRetriever = new Ozone.marketplace.MPListingsRetriever();
 * @constructor
 */

Ext.define('Ozone.marketplace.MPListingsRetriever', {
    extend:'Ext.util.Observable',
    
    constructor: function(config) {
        this.addEvents({ 
            success: true,
            failure: true
        });
        
        this.callParent();
    },
	
    retrieve: function(op, callback, scope) {

        var self = this;
        var failureJson = {
            "total":0,
            "data":[]
        };
        
        var sort = 'title';
        var order = 'asc';
        
        if (op.sorters && op.sorters[0]) {
            sort = op.sorters[0].property;
            order = op.sorters[0].direction;
        }
		
        // Marketplace API call to retrieve widget LISTINGS.
        Ozone.marketplace.util.getOwfCompatibleItems({
			
            max: op.limit,
            offset: op.start,
            sort: sort,
            order: order,
            categoryIDs: op.categoryIDs,
            typeIDs: op.typeIDs,
            stateIDs: op.stateIDs,
            title: op.title,
            description: op.description,
            author: op.author,
            queryString: op.queryString,
            useIndex: op.useIndex,
			
            success: function onSuccess(json) {
                // Fire 'success' event to run proxy.processJson() function.
                self.fireEvent('success', json, op, callback, scope);
            },
		    
            failure: function onGetFailure(error, status) {
                // Fire 'failure' event to run proxy.processJson() function.
                self.fireEvent('failure', failureJson, op, callback, scope);
            }
		 	
        });

    }
});

