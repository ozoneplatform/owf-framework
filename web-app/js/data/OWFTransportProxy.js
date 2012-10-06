Ext.define('Ozone.data.OWFTransportProxy', {
    extend:'Ext.data.proxy.Server', //caution, this may change
    alias: 'proxy.owftransportproxy',

    constructor: function (config) {
        this.callParent(arguments);
        if (config.methods) {
            this.methods = config.methods
        } else {
            this.methods = {
                read: 'GET', 
                load: 'GET',  
                create: 'POST', 
                update: 'PUT', 
                save: 'POST', 
                destroy: 'DELETE'
        };
        }
        if (config.updateActions) {
            this.updateActions = config.updateActions;
        }
        if (config.callback) {
        	this.callback = config.callback;
        }
    },
    
    doRequest: function (operation, callback, scope) {
        var writer  = this.getWriter();
        var request = this.buildRequest(operation, callback, scope);
        
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        
        operation.params = request.params;
        operation.params.owfversion = Ozone.version.owfversion;
        operation.params._method = this.api[operation.action].method ? this.api[operation.action].method : this.methods[operation.action];
        if (this.updateActions && this.updateActions[operation.action]) { operation.params.update_action = this.updateActions[operation.action]; }
        var proxyScope = this;
        var proxyCallback = function (operation, json) {
            operation.resultSet = proxyScope.reader.readRecords(json);
            operation.setCompleted();
            operation.setSuccessful();
            if (Ext.isFunction(proxyScope.callback)) {
            	proxyScope.callback(operation);
        }
        };
        Ozone.util.Transport.send({
            url : Ozone.util.contextPath() + this.api[operation.action],
            method : "POST",
            onSuccess: function (json){
                proxyCallback(operation, json);
                callback.call(scope, operation);
    },
            onFailure: Ext.bind(function (msg){
              operation.setException(msg);
              this.fireEvent('exception', this, msg, operation);
            },this),
            autoSendVersion : false,
            timeout : null,
            content : operation.params
        });
                }
	
});
