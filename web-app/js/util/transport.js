var Ozone = Ozone || {};
Ozone.util = Ozone.util || {};


/**
 * @class
 * @private
 *
 * @description
 * Object used to talk to the cross domain and locally.  If the server is local,
 * then AJAX will be used.  If the server is remote, then we must use a
 * hack to get around Same Origin Policy and make the call cross domain.
 *
 * @requires util.js
 */
Ozone.util.Transport = {
    version: Ozone.version.owfversion + Ozone.version.preference
};


/**
 * @private
 *
 * @params  cfg.url               -  url of the request
 *          cfg.method            -  HTTP verb (only POST or GET, use _method = PUT or DELETE with a POST )
 *          cfg.onSuccess         -  callback function to capture the success result
 *          cfg.onFailure         -  callback to execute if there is an error
 *          cfg.content           -  optional content to send with the request, ie {value: 'x', _method: 'PUT'}
 *          cfg.async			  -  optional (default is true, asynchronous send, only applies to Ajax call)
 *          cfg.handleAs          - text or json
 *          cfg.autoSendVersion   -  true to send owf version to the server, false don't send (defaults to true)
 *          cfg.ignoredErrorCodes -  optional array of http error codes to ignore (if these happen onSucess will be called)
 *          cfg.forceXdomain      -  optional flag to force xdomain ajax call using dojo window.name
 *
 *  @returns void, use callbacks
 *
 *  Static method.  Must use 2 callbacks since javascript is asyncronous
 *  we have to wait for the response.
 *
 *  This implementation uses the dojox.windowName hack for a remote server,
  * but could be replaced with something else like JSONP if desired
 */
Ozone.util.Transport.send = function(cfg) {
    if (Ozone.log) {
        Ozone.log.getDefaultLogger().debug('Transport Send', cfg.url, cfg.method, cfg.content);
    }

    var defaultFailure = function(err) {
        // If error is an HTML page, just use body
        if (err == undefined || err == null) err = "";
        var start = err.indexOf("<body");
        if (start > -1) {
            // start at the end of the body tag
            start = err.indexOf(">", start) + 1;
            var stop = err.indexOf("</body>", start);

            if (stop > -1) err = err.substring(start, stop);
            else err = err.substring(start);
        }

        if (!Ozone.Msg)
            Ozone.util.ErrorDlg.show(err,200,50);
        else
            Ozone.Msg.alert('Server Error',err,null,this,{
                cls: "owfAlert"
            });
    };

    // create an onFailure method if one doesn't exist
    if (!cfg.onFailure) {
        cfg.onFailure = function(err){
            defaultFailure(err);
        };
    }

    var methodToUse = cfg.method;
    var hasBody = false;
    if (methodToUse == "PUT" || methodToUse == "DELETE")
    {
        methodToUse = "POST";
    }

    if (methodToUse == "POST") {
        hasBody = true;
    }

    if(cfg.content == null) {
        cfg.content = {};
    }

    //autoSendVersion to server default behavior is true
    if (!(cfg.autoSendVersion === false)) {
        //add version property to send to the server
        cfg.content.version = Ozone.util.Transport.version;
    }

    // Convert state JSON object to string
    if (cfg.content.state) {
        cfg.content.state = Ozone.util.toString(cfg.content.state);
    }

//    // Convert defaultSettings JSON object to string
//    if (cfg.content.defaultSettings) {
//        cfg.content.defaultSettings = Ozone.util.toString(cfg.content.defaultSettings);
//    }

    var  content = cfg.content;

    var handleAs = 'json';
    if (cfg.handleAs != null) {
        handleAs = cfg.handleAs;
    }

    // Use AJAX if we can
    if (Ozone.util.isUrlLocal(cfg.url) && !cfg.forceXdomain) {
        return owfdojo.xhr(methodToUse.toUpperCase(), {
            url: cfg.url,
            content: cfg.content,
            preventCache: true,
            sync: cfg.async == false? true : false, //defaults to false (not synchronous)
            timeout : cfg.timeout ? cfg.timeout : 0,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            load: function(response, ioArgs) {
                if (Ozone.log) {
                    Ozone.log.getDefaultLogger().debug('Transport AJAX Return', response);
                }
                if (handleAs == 'json') {
                    try {
                        var json = Ozone.util.parseJson(response);
                        cfg.onSuccess(json);
                    } catch(e) {
                        cfg.onFailure(e.name + " : " + e.message);
                    }
                }
                else {
                    cfg.onSuccess(response);
                }
            },
            error: function(response, ioArgs) {
                if (response.dojoType=='cancel') { return; }
                // FF2 kills all AJAX requests when you refresh. When this happens, it sets the status code to 0
                if (response.status != 0 ){
                    if (cfg.ignoredErrorCodes != null && cfg.ignoredErrorCodes.length > 0 && owfdojo.indexOf(cfg.ignoredErrorCodes,response.status) > -1){
                        cfg.onSuccess({});
                    }
                    else {
                        cfg.onFailure(response.responseText, response.status);
                    }
                }
            }
        }, hasBody);
    } else {
        // Use window.name transport
        try {
            var methodToUse = cfg.method;
            if (methodToUse == "PUT" || methodToUse == "DELETE")
            {
                methodToUse = "POST";
            }
            var deferred = owfdojox.io.windowName.send(methodToUse.toUpperCase(), {
                url: cfg.url,
                content: content,
                preventCache: true,
                timeout: cfg.timeout ? cfg.timeout : 20000,
                load:
                function(result) {
                    try {
                        // OWF-2750 - handle timeout errors which are already JSON objects
                        var json = null;
                        if (result && typeof(result) === 'string') {
                           json = Ozone.util.parseJson(result);
                        }
                        else {
                           json = result;
                        }

                        // OWF-2750 - detect a timeout error and return its message
                        if (json && json.message && json.message == 'Timeout') {
                           return cfg.onFailure('Error: Request timed out');
                        }

                        if (json.status === 200) {
                            if (Ozone.log) {
                                Ozone.log.getDefaultLogger().debug('Transport AJAX Return', json.data);
                            }
                            if (handleAs == 'json') {
                                cfg.onSuccess(json.data);
                            }
                            else {
                                cfg.onSuccess(result);
                            }
                        } else if (json.status === 500 || json.status === 401) {
                            cfg.onFailure(json.data);
                        }
                        //if it is an error code we ignore than call onSuccess with empty data
                        else if (cfg.ignoredErrorCodes != null && cfg.ignoredErrorCodes.length > 0 && owfdojo.indexOf(cfg.ignoredErrorCodes,json.status) > -1){
                            cfg.onSuccess({});
                        }
                        else {
                            cfg.onFailure(json.data,json.status);
                        }
                        return json;
                    }
                    catch(e2) {
                        cfg.onFailure(e2.name + " : " + e2.message);
                    }
                },
                error:
                function(result){
                    if (result.dojoType=='cancel') { return; }
                    if (result instanceof Error){
                        cfg.onFailure(result.name + " : " + result.message);
                    }
                    else{
                        cfg.onFailure(result);
                    }
                }
            });
            return deferred;
        }
        catch(e){
            cfg.onFailure(e.name + " : " + e.message);
        }
    }
	
};
/**
 * @private
 *
 * @params  cfg.url              -  url of the request
 *          cfg.method           -  HTTP verb (only POST or GET, use _method = PUT or DELETE with a POST )
 *          cfg.content          -  optional content to send with the request, ie {value: 'x', _method: 'PUT'}
 *          cfg.async			 -  optional (default is true, asynchronous send, only applies to Ajax call)          
 *
 *  @returns void
 *
 *  Static method.  No callbacks are passed in, so you will not get a response.  Useful for example in
 *                  in 'beforeunload' when the the asyncronous callbacks are guaranteed to have the same
 *                  javascript in the dom when they are firted
 *
 *
 *  This implementation uses the dojox.windowName hack for a remote server,
  * but could be replaced with something else like JSONP if desired
 */
Ozone.util.Transport.sendAndForget = function(cfg) {
    var cfg = cfg;

    if (Ozone.log) {
        Ozone.log.getDefaultLogger().debug('Transport SendAndForget', cfg.url, cfg.method, cfg.content);
    }

    var methodToUse = cfg.method;
    if (methodToUse == "PUT" || methodToUse == "DELETE")
    {
        methodToUse = "POST";
    }
	
    var hasBody = false;
    if (methodToUse == "POST") {
        hasBody = true;
    }
	
    if(cfg.content == null) {
        cfg.content = {};
    }

    //autoSendVersion to server default behavior is true
    if (cfg.autoSendVersion === false) {
        //add version property to send to the server
        cfg.content.version = Ozone.util.Transport.version;
    }

    // Convert state JSON object to string
    if (cfg.content.state) {
        cfg.content.state = Ozone.util.toString(cfg.content.state);
    }

    var content = null;
    if (methodToUse == "GET") {
        content = owfdojo.objectToQuery(cfg.content);
    }
    else {
        content = cfg.content;
    }

    // Use AJAX if we can
    if (Ozone.util.isUrlLocal(cfg.url)) {
        owfdojo.xhr(methodToUse.toUpperCase(), {
            url: cfg.url,
            content: cfg.content,
            preventCache: true,
            sync:  cfg.async == false? false : true //defaults to true
        }, hasBody);
    } else {
        // Use window.name transport
        try {
            var methodToUse = cfg.method;
            if (methodToUse == "PUT" || methodToUse == "DELETE")
            {
                methodToUse = "POST";
            }
            var deferred = owfdojox.io.windowName.send(methodToUse.toUpperCase(), {
                url: cfg.url,
                content: content,
                preventCache: true
            });
        } catch(e) {
            if (!Ozone.Msg)
                Ozone.util.ErrorDlg.show(Ozone.util.ErrorMessageString.sendAndForget,e.name + " : " + e.message,200,50);
            else
                Ozone.Msg.alert(Ozone.util.ErrorMessageString.sendAndForget,e.name + " : " + e.message);
        }
    }
};


/**
 * @private
 *
 *  @params  cfg.urls              -  Array of urls to try
 *           cfg.method           -  HTTP verb (only POST or GET, use _method = PUT or DELETE with a POST )
 *           cfg.onSuccess        -  callback function to capture the success result
 *           cfg.onLastFailure        -  callback to execute if there is an error
 *           cfg.content          -  optional content to send with the request, ie {value: 'x', _method: 'PUT'}
 *
 *  @returns void, use callbacks
 *
 *  Static method.  Allows the user to pass in an array of urls to try.  The first one to return a response stops
 *  the processing.  Uses the Ozone.util.Transport.send method.
 */
Ozone.util.Transport.sendToFirst = function(cfg) {
    var u = cfg.urls.shift();
	
    if (u === undefined) {
        if (cfg.onLastFailure !== undefined) {
            cfg.onLastFailure();
        }
        return;
    }
	
    var onThisFailure = function() {
        Ozone.util.Transport.sendToFirst({
            urls:cfg.urls,
            method:cfg.method,
            onSuccess:cfg.onSuccess,
            onLastFailure:cfg.onLastFailure,
            content:cfg.content
            });
    };
	
    Ozone.util.Transport.send({
        url:u,
        method:cfg.method,
        onSuccess:cfg.onSuccess,
        onFailure:onThisFailure,
        content:cfg.content
        });
};
