Ext.define('Ozone.data.JsonProxy', {
    extend: 'Ext.data.ClientProxy',
    alias: 'proxy.ozone.data.jsonproxy',
    
    /**
     * @class Creates a new JsonProxy object
     * @extends Ext.data.ClientProxy
     * @param {Object} config The configuration object with which to construct a JsonProxy object.  JsonProxy requires a single config property
     * named 'jsonRetriever', which holds a reference to the current Ozone.data.MPyourentityRetriever object instance.
     * @description The Ozone.data.JsonProxy object is an extension of Ext.data.ClientProxy, and provides proxy functionality to a Json-producing
     * function instead of making a server call to an HTTP URL.
     * Reference the following class for a usage example: <i>MPCategoryAPI</i>
     * @example
     * // Example usage:
     *	var proxy = new Ozone.data.JsonProxy({
     *		jsonRetriever: new Ozone.marketplace.MP_entity_Retriever()
     *	});
     * @constructor
     */
    constructor: function(config){
    
        this.jsonRetriever = config.jsonRetriever;
        
        this.callParent([config]);
    },
    
    read: function(op, callback, scope) {
        this.jsonRetriever.retrieve(op, callback, scope);
    },
    
    processJson: function(jsonResponse, op, callback, scope){
        
        var result;
        try {

            result = this.getReader().readRecords(jsonResponse);
            op.resultSet = result;
            op.setSuccessful();
            op.setCompleted();
        } 
        catch (e) {
            this.fireEvent("loadexception", this, null, arg, e);
            callback.call(scope, op);
            return;
        }
        callback.call(scope, op);
    }
});
