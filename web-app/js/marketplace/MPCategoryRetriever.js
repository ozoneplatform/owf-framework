// @namespace
Ext.namespace('Ozone.marketplace');

/**
 * @class Creates a new MPCategoryRetriever object
 * @extends Ext.marketplace.MPCategoryRetriever
 * @description The Ozone.marketplace.MPCategoryRetriever object calls the Marketplace API to retrieve Category data.
 * <p><span style="font-family:monospace">This object's <span style="font-family:monospace">retrieve()</span> method 
 * is called from the JsonProxy object defined on the store in MPCategoryAPI.  'success' or 'failure' events both result in a call to the 
 * <span style="font-family:monospace">processJson()</span> method of JsonProxy, which then loads data into the store.</p>
 * @example
 * // Example usage:
 * myMPCategoryRetriever = new Ozone.marketplace.MPCategoryRetriever();
 * @constructor
 */

Ext.define('Ozone.marketplace.MPCategoryRetriever', {
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
        
        // Marketplace API call to retrieve CATEGORIES.
        Ozone.marketplace.util.getCategories({
            
            max: op.limit,
            offset: op.start,
            sort: op.sort,
            order: op.order,
            
            success: function onSuccess(json) {
                // Fire 'success' event to run proxy.processJson() function.
                self.fireEvent('success', json, op, callback, scope);
            },
            
            failure: function onGetFailure(error, status) {
                // Fire 'failure' event to run proxy.processJson() function.
                self.fireEvent('failure', [], op, callback, scope);
            }
            
        });
        
    }
});