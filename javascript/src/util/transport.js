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
 *          cfg.async             -  optional (default is true, asynchronous send, only applies to Ajax call)
 *          cfg.handleAs          -  text or json
 *          cfg.autoSendVersion   -  true to send owf version to the server, false don't send (defaults to true)
 *          cfg.ignoredErrorCodes -  optional array of http error codes to ignore (if these happen onSucess will be called)
 *          cfg.forceXdomain      -  optional flag to force xdomain ajax call using dojo window.name
 *          cfg.forceNoCors       -  FOR INTERNAL USE ONLY, set true when CORS request fails in order to force window.name on retry
 *
 *  @returns void, use callbacks
 *
 *  Static method.  Must use 2 callbacks since javascript is asynchronous
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

    // Always try CORS first for cross domain if supported by browser. (Will
    // fall back to window.name on failure.)
    var tryCors = Ozone.util.Transport.browserHasCors && !cfg.forceNoCors;

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
                if (cfg.ignoredErrorCodes != null && cfg.ignoredErrorCodes.length > 0 && 
                        owfdojo.indexOf(cfg.ignoredErrorCodes,response.status) > -1){
                    cfg.onSuccess({});
                }
                else {
                    cfg.onFailure(response.responseText, response.status);
                }
            }
        }, hasBody);
    } else if (tryCors) {
        cfg.method = methodToUse.toUpperCase();

        var retryXhr;

        // Ensure we fall back to window.name if CORS fails, unless we know
        // the browser would hang on use of window.name
        if (!Ozone.util.Transport.isWindowNameBroken) {
            var originalOnFailure = cfg.onFailure;

            cfg.onFailure = function() {
                cfg.forceNoCors = true;

                if (Ozone.log) {
                    Ozone.log.getDefaultLogger().warn(
                        'CORS failed. Will try window.name transport.' +
                        ' URL = ' + cfg.url);
                }

                cfg.onFailure = originalOnFailure;

                cfg.content = cfg.content || {};
                cfg.content.windowname = true;

                retryXhr = Ozone.util.Transport.send(cfg);
            };
        }

        var xhr = Ozone.util.Transport.sendWithCors(cfg);

        // Ensure the window.name retry can also be canceled
        var originalCancel = xhr.cancel;

        xhr.cancel = function() {
            originalCancel();

            if (retryXhr) {
                retryXhr.cancel();
            }
        };

        return xhr;
    } else {
        // Use window.name transport
        try {
            var methodToUse = cfg.method;
            if (methodToUse == "PUT" || methodToUse == "DELETE") {
                methodToUse = "POST";
            }
            var deferred = owfdojox.io.windowName.send(methodToUse.toUpperCase(), {
                url: cfg.url,
                content: content,
                preventCache: true,
                timeout: cfg.timeout ? cfg.timeout : 20000,
                load: function(result) {
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
                error: function(result){
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
 *          cfg.async            -  optional (default is true, asynchronous send, only applies to Ajax call)
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

    // Always try CORS first for cross domain if supported by browser. (Will
    // fall back to window.name on failure.)
    var tryCors = Ozone.util.Transport.browserHasCors && !cfg.forceNoCors;

    // Use AJAX if we can
    if (Ozone.util.isUrlLocal(cfg.url)) {
        owfdojo.xhr(methodToUse.toUpperCase(), {
            url: cfg.url,
            content: cfg.content,
            preventCache: true,
            sync:  cfg.async == false? false : true //defaults to true
        }, hasBody);
    } else if (tryCors) {
        cfg.method = methodToUse.toUpperCase();
        cfg.content = content;

        cfg.onFailure = function() {
            cfg.forceNoCors = true;

            if (Ozone.log) {
                Ozone.log.getDefaultLogger().warn(
                    'CORS failed. Will try window.name transport.' +
                    ' URL = ' + cfg.url);
            }

            Ozone.util.Transport.send(cfg);
        };

        Ozone.util.Transport.sendWithCors(cfg);
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
 *  @params  cfg.urls             -  Array of urls to try
 *           cfg.method           -  HTTP verb (only POST or GET, use _method = PUT or DELETE with a POST )
 *           cfg.onSuccess        -  callback function to capture the success result
 *           cfg.onLastFailure    -  callback to execute if there is an error
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

/**
 * @private
 * Perform a request using Cross Origin Resource sharing (CORS). This method
 * really does not do anything special aside from verifying the browser has
 * CORS and setting the request for authentication in the right place. (Also
 * uses XMLHTTPRequest2 for simplicity.)
 *
 * @params  cfg.url               -  url of the request
 *          cfg.method            -  HTTP verb
 *          cfg.onSuccess         -  callback function to capture the success result
 *          cfg.onFailure         -  callback to execute if there is an error
 *          cfg.content           -  optional content to send with the request, ie {value: 'x', _method: 'PUT'}
 *          cfg.handleAs          -  text or json
 */
Ozone.util.Transport.sendWithCors = function(cfg) {
    if (!Ozone.util.Transport.browserHasCors) {
        throw 'Browser does not support standard CORS via XHR';
    }

    var xhr = new XMLHttpRequest();
    var deferred = new owfdojo.Deferred(function() { /* canceler */ xhr.abort();} );

    var onFailure = function(e) {
        if (cfg.onFailure) {
            cfg.onFailure(e);
        }
    };

    // IE 11 denies access when HTTPS tries CORS to HTTP
    try {
        xhr.open(cfg.method.toUpperCase(), cfg.url);
    } catch(e) {
        onFailure(e.name + " : " + e.message);
        return;
    }

    xhr.withCredentials = true; // Must set after open!

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

    xhr.onload = function(e) {
        if (cfg.onSuccess) {
            if (!cfg.handleAs || cfg.handleAs == 'json') {
                try {
                    var json = Ozone.util.parseJson(xhr.responseText);
                    cfg.onSuccess(json);
                    deferred.resolve(json);
                } catch(e) {
                    onFailure(e.name + " : " + e.message);
                }
            } else {
                cfg.onSuccess(xhr.responseText);
            }
        }
    };

    xhr.onerror = function() {
        onFailure();
    };

    var formData = null;

    if (cfg.content) {
        for (key in cfg.content) {
            if (formData) {
                formData += '&';
            } else {
                formData = '';
            }

            formData += key + '=' + encodeURIComponent(cfg.content[key]);
        }
    }

    xhr.send(formData);

    return deferred;
};

/**
 * @private
 * Determine if the web browser natively supports CORS through XHR. Returns
 * false in Internet Explorer 8 and 9 as they use a nonstandard object
 * (XDomainRequest) for CORS support.
 */
Ozone.util.Transport.browserHasCors = (function() {
    var result = false;

    var xhr = new XMLHttpRequest();

    // Ensure this browser supports XMLHTTPRequest2
    if ("withCredentials" in xhr && "onload" in xhr && "onerror" in xhr) {
        result = true;
    }

    return result;
})();

/**
 * @private
 * Read and parse a widget or stack descriptor from a remote server. Said
 * descriptors were originally designed for window.name transport, but must
 * also be readable in a CORS environment.
 *
 * The OWF descriptor is a HTML file with embedded JSON. For historical
 * reasons the JavaScript in the HTML must be executed in order to process
 * the file correctly. (For example, some existing descriptor files have
 * code that does computations using window.location in order to allow the
 * same descriptor to be reused on different widget servers without hard
 * coding an absolute path for the widget launch URL.)
 *
 * @params  cfg.url        -  url of the descriptor file
 *          cfg.onSuccess  -  callback function to capture the success result
 *          cfg.onFailure  -  callback to execute if there is an error
 */
Ozone.util.Transport.getDescriptor = function(cfg) {
    var handleFailure = function(error) {
        if (cfg.onFailure) cfg.onFailure(error);
    };

    // Create an object with the same properties as window.location, but for
    // a given location
    var makeLocation = function(url) {
        var result = {};
        var propNames = [];

        for (var key in window.location) {
            if (typeof(window.location[key]) === "string") {
                propNames.push(key);
            }
        }

        var a = document.createElement('a');

        a.href = url;

        // In Internet Explorer anchor fails to populate all link properties
        // when href is relative. After it is set once href becomes absolute
        // and can thus solve the problem.
        if (a.host == "") {
            a.href = a.href;
        }

        // Copy properties to a new object so we can fix some bad behavior
        for (var i = 0; i < propNames.length; i++) {
            var key = propNames[i];
            result[key] = a[key];
        }

        // All browsers, except IE, always have leading '/' on pathname when
        // fully qualified
        if (result.pathname[0] !== '/') {
            result.pathname = '/' + result.pathname;
        }

        return result;
    }

    // Must return Deferred so user has ability to cancel the request
    return Ozone.util.Transport.send({
        url: cfg.url,
        method: 'GET',
        handleAs: 'text', // Descriptor file is in HTML, not JSON!
        forceXdomain: true,
        autoSendVersion: false,
        onSuccess: function(response) {
            // Transport tries CORS first and then falls back to
            // window.name. If window.name was used the result is a JSON
            // string. Otherwise we need to evaluate JavaScript wrapped
            // within HTML to get the actual descriptor information.
            var responseJson;

            try {
                responseJson = Ozone.util.parseJson(response);
            }
            catch(e) {}

            // handle json
            if (responseJson && responseJson.data) {
                cfg.onSuccess(responseJson.data);
                return;
            }
            // handle window.name html response
            else if(response.indexOf('<html>') >= 0) {
                var a = makeLocation(cfg.url);
                var el = document.createElement("div");

                el.innerHTML = response;

                var scriptTags = el.getElementsByTagName("script");

                if (scriptTags && scriptTags.length) {
                    var scripts = '';
                    for (var i = 0; i < scriptTags.length; i++) {
                        scripts += scriptTags[i].innerHTML;
                    }

                    var getWindowNameFunc = 'var window = {};' +
                        'var Ozone = {};var owfdojo={};var Ext={};';

                    // Set window.location to our object that simulates some
                    // properties of location, but for the descriptor URL
                    getWindowNameFunc += 'window.location = a;';

                    getWindowNameFunc += scripts;
                    getWindowNameFunc += 'return window.name;';

                    // Marketplace descriptor has code that inserts result
                    // JSON into the page so user can see it for debugging
                    // if viewing the descriptor in the browser. Remove said
                    // code since the HTML it depends on is not part of our
                    // current page and would fail.
                    getWindowNameFunc = getWindowNameFunc.replace(
                        /document\.getElementById[^;]*;/g, '');

                    try {
                        responseJson = (new Function('a', getWindowNameFunc))(a);
                        responseJson = Ozone.util.parseJson(responseJson);
                    }
                    catch(e) {
                        responseJson = null;

                        if (Ozone.log) {
                            var logger = Ozone.log.getDefaultLogger();
                            logger.error('Unable to execute descriptor ' +
                                         'JavaScript. ERROR = ' + e);
                            logger.debug('SCRIPT = "' + getWindowNameFunc + '"');
                        }
                    }

                    if (responseJson && responseJson.data) {
                        cfg.onSuccess(responseJson.data);
                        return;
                    }
                }
            }

            handleFailure("Invalid descriptor file at " + cfg.url);
        },
        onFailure: handleFailure
    });
};

/**
 * @private
 * Determine if window.name transport is broken in the current browser.
 * Internet Explorer 10 and 11 are known to hang if you attempt to use said
 * technique.
 */
Ozone.util.Transport.isWindowNameBroken = (function() {
    // dojo.isIE is currently known to fail for IE 11. Need to do extra work
    // to check Trident engine version. Trident 7 is IE 11.
    var trident = /Trident\/(\d+)\.\d/g.exec(navigator.userAgent);

    if (trident) {
        trident = Number(trident[1]);
    }

    return (owfdojo.isIE && owfdojo.isIE >= 10) || trident >= 7;
})();
