/**
 * @ignore
 */
var Ozone = Ozone || {};
Ozone.util = Ozone.util || {};
Ozone.util.formField = Ozone.util.formField || {};
Ozone.config = Ozone.config || {};
Ozone.config.dataguard = Ozone.config.dataguard || {};
Ozone.widgetAccesses = Ozone.widgetAccesses || {};

/**
 * @private
 *
 * @description This method is useful if you want to see if a specfic url is the same
 * as the local url.  Can be used to test if AJAX can be used.  If url
 * is not a URL, it's assumed to be a relative filename, so this function
 * returns true.
 *
 * @param {String} url String that you want to check to see if its local.
 *
 * @returns Boolean
 *
 * @throws "Not a valid URL" if the parameter is not a valid url
 */
Ozone.util.isUrlLocal = function(url) {

    var webContextPath = Ozone.util.contextPath();

    //append last '/' this value should never be null
    if (webContextPath != '' && webContextPath != null) {
        webContextPath += '/';
    }

    //this regex matches urls against the configured webcontext path https://<contextPath>/.....
    //only one match is possible since this regex matches from the start of the string
    var regex = new RegExp("^(https?:)//([^/:]+):?(.*?)" + webContextPath);
    var server = url.match(regex);

    //check if this might be a relative url
    if (!server) {
        if (url.match(new RegExp('^https?:\/\/'))) {
            return false;
        }
        else {
            return true;
        }
    }

    var port = window.location.port;// || ( window.location.protocol === "https:" ? "443" : "80" )

    //todo need to find a better way of checking same domain requests
    // see if solution posted here works: http://stackoverflow.com/questions/9404793/check-if-same-origin-policy-applies
    return window.location.protocol === server[1] && window.location.hostname === server[2] && port === server[3]
};

/**
 * @private
 *
 * @description This method will convert a string into a json object.  There is a check
 * done to ensure no unsafe json is included.
 *
 * @param {String} str String that represents a json object
 *
 * @returns {Object} json object
 *
 * @throws Error if parameter is not a string
 * @throws Error if secure check finds unsafe JSON
 * @throws Error if there is an issue converting to JSON
 *
 * @requires dojox.secure.capability
 * @requires dojo base
 */
Ozone.util.parseJson = function(str) {
    if (typeof(str) === 'string') {
        owfdojox.secure.capability.validate(str,[],{}); // will error if there is unsafe JSON
        var x = owfdojo.fromJson(str);
        return x;
    } else {
        throw "Ozone.util.parseJson expected a string, but didn't get one";
    }
};

/**
 * @private
 */
Ozone.util.HTMLEncodeReservedJS = function(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, "&#39;");
};

/**
 * @private
 *
 * @description Similar to Ext.util.Format.htmlEncode except this method also handles the single quote
 */
Ozone.util.HTMLEncode = function(str){
    return !str ? str : String(str).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
};

/**
 * @private
 *
 * Constructively clears the entire array
 */
Ozone.util.parseWindowNameData = function() {
  var configParams = null;
  return function() {

    //if already parsed just return the value
    if (configParams) return configParams;

    //parse out the config
    try {
      configParams = Ozone.util.parseJson(
              window.name
      );
      return configParams;
    }
    catch (e) {
      return null;
    }
  }
}();


/**
 * @private
 *
 * @description This method returns the current context path by
 * calling a controller at the server (will not
 * make the call if it has already been done).
 *
 * @param {Object} o unused
 *
 * @returns context path with leading slash
 *          (ex. "/owf")
 *
 * @requires Ext base, dojo
 */
Ozone.util.contextPath = (function() {
    var configParams = Ozone.util.parseWindowNameData(),
        contextPath = Ozone.config.webContextPath;

    if (configParams) {
        if(configParams.webContextPath) {
            Ozone.config.webContextPath = configParams.webContextPath;
        }
        contextPath = configParams.webContextPath;
    }

    return function () {
        return contextPath || '';
    }
})();

/**
 * @private
 *
 * @description Checks whether the url context is local or not,
 * then returns the valid url w/ context.
 *
 * @param {String} value the url
 * @param {String} validContext valid context
 *
 * @returns valid url w/context if necessary, if not local then the url
 */
Ozone.util.validUrlContext = function(value, validContext){
    var containsRelDotPath = (value.indexOf("../") == 0)?true:false;
    var containsRelPath = (value.indexOf("/") == 0)?true:false;
    var isLocalUrl = (containsRelPath || containsRelDotPath || (value.indexOf("localhost") == 7) || (value.indexOf("localhost") == 11) || (value.indexOf("127.0.0.1") == 7)) ? true : false;
    var urlValidContext = value;
    validContext = ((validContext == undefined) ? Ozone.util.contextPath() : validContext);
    if((isLocalUrl == true) && (validContext != null)){
        if(containsRelPath){
            urlValidContext = String.format("{0}{1}", validContext, value);
        }else if(containsRelDotPath){
            var valuePathNoRel = value.substring(3);
            urlValidContext = String.format("{0}/{1}", validContext, valuePathNoRel);
        }
    }
    return urlValidContext;
};

/**
 * @private
 *
 * @description This method centralizes the container relay file for
 * RPC calls.
 *
 * @returns relay file path with context
 */
Ozone.util.getContainerRelay = function() {
    return Ozone.util.contextPath() +
    '/js/eventing/rpc_relay.uncompressed.html';
};

/**
 * @private
 *
 * @description This method will convert anything to a string.
 * There is no check for recursion, so don't do that
 *
 * @param {Object} obj object to convert
 *
 * @returns string
 *
 * @requires dojo base
 */
Ozone.util.toString = function(obj) {
    if (typeof(obj) === 'object') {
        return owfdojo.toJson(obj);
    } else {
        return obj+'';
    }
};

/**
 * @private
 */
Ozone.util.formatWindowNameData = function(data) {
    // this value needs to be not uri encoded
    // return decodeURIComponent(owfdojo.objectToQuery(data));
    return Ozone.util.toString(data);
};

/**
 * @private
 *
 * Removes the Leading and Trailing Spaces in any ExtJs Form Field
 */
Ozone.util.formField.removeLeadingTrailingSpaces = function(thisField){
    var thisField_noLeadingTrailingSpacesValue = thisField.getValue().replace(new RegExp(Ozone.lang.regexLeadingTailingSpaceChars), '');
    thisField.setValue(thisField_noLeadingTrailingSpacesValue);
    return thisField_noLeadingTrailingSpacesValue;
};

if (!Ozone.util.ModalBox) {
    Ozone.util.ModalBox = function() {
        var ab = 'absolute';
        var n = 'none';
        var obody = document.getElementsByTagName('body')[0];
        var frag = document.createDocumentFragment();
        var obol = document.createElement('div');
        obol.setAttribute('id', 'ol');
        obol.style.display = n;
        obol.style.position = ab;
        obol.style.top = 0;
        obol.style.left = 0;
        obol.style.zIndex = 10000;
        obol.style.width = '100%';
        obol.style.backgroundColor = "#555";
        obol.style.filter = 'alpha(opacity=50)';
        obol.style.MozOpacity = 0.5;
        obol.style.opacity = 0.5;


        frag.appendChild(obol);
        this.obol = obol;
        var obbx = document.createElement('div');
        obbx.setAttribute('id', 'mbox');
        obbx.style.display = n;
        obbx.style.position = ab;
        obbx.style.backgroundColor = '#eee';
        obbx.style.padding = '8px';
        obbx.style.border = '2px outset #666';
        obbx.style.zIndex = 10001;
        this.obbx = obbx;
        var obl = document.createElement('span');
        obbx.appendChild(obl);
        var obbxd = document.createElement('div');
        obbxd.setAttribute('id', 'mbd');
        var d = document.createElement('div');
        var txt = document.createElement('span');
        txt.innerHTML = 'Press OK to continue.';
        this.txt = txt;
        var d2 = document.createElement('div');
        d2.style.textAlign = 'center';
        d2.style.fontSize = '14px';
        d2.appendChild(txt);
        d2.appendChild(document.createElement('br'));
        var but = document.createElement('button');

        but.innerHTML = 'OK';
        var self = this;
        but.onclick= function()
        {
            self.hide();
        }
        d2.appendChild(but);
        d.appendChild(d2);
        obbxd.appendChild(d);
        this.obbxd = obbxd;
        obl.appendChild(obbxd);
        frag.insertBefore(obbx, obol.nextSibling);
        obody.insertBefore(frag, obody.firstChild);
        window.onscroll = function(){
            self.scrollFix();
        }
        window.onresize = function(){
            self.sizeFix();
        }
    }

    Ozone.util.ModalBox.prototype.pageWidth = function () {
        return window.innerWidth != null ? window.innerWidth
        : document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth
        : document.body != null ? document.body.clientWidth : null;
    }
    Ozone.util.ModalBox.prototype.pageHeight = function () {
        return window.innerHeight != null ? window.innerHeight
        : document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight
        : document.body != null ? document.body.clientHeight : null;
    }
    Ozone.util.ModalBox.prototype.posLeft = function() {
        return typeof window.pageXOffset != 'undefined' ? window.pageXOffset
        : document.documentElement && document.documentElement.scrollLeft ? document.documentElement.scrollLeft
        : document.body.scrollLeft ? document.body.scrollLeft : 0;
    }
    Ozone.util.ModalBox.prototype.posTop = function () {
        return typeof window.pageYOffset != 'undefined' ? window.pageYOffset
        : document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop
        : document.body.scrollTop ? document.body.scrollTop : 0;
    }

    Ozone.util.ModalBox.prototype.scrollFix = function()
    {
        //var obol = $('ol');
        this.obol.style.top = this.posTop() + 'px';
        this.obol.style.left = this.posLeft() + 'px'
    }
    Ozone.util.ModalBox.prototype.sizeFix = function () {
        //var obol = $('ol');
        this.obol.style.height = this.pageHeight() + 'px';
        this.obol.style.width = this.pageWidth() + 'px';
        var tp = this.posTop() + ((this.pageHeight() - this.height) / 2) - 12;
        var lt = this.posLeft() + ((this.pageWidth() - this.width) / 2) - 12;
        this.obbx.style.top = (tp < 0 ? 0 : tp) + 'px';
        this.obbx.style.left = (lt < 0 ? 0 : lt) + 'px';

    }
    Ozone.util.ModalBox.prototype.kp = function (e) {
        ky = e ? e.which : event.keyCode;
        if (ky == 88 || ky == 120)
            this.hide();
        return false
    }
    Ozone.util.ModalBox.prototype.inf = function (h) {
        tag = document.getElementsByTagName('select');
        for (i = tag.length - 1; i >= 0; i--)
            tag[i].style.visibility = h;
        tag = document.getElementsByTagName('iframe');
        for (i = tag.length - 1; i >= 0; i--)
            tag[i].style.visibility = h;
        tag = document.getElementsByTagName('object');
        for (i = tag.length - 1; i >= 0; i--)
            tag[i].style.visibility = h;
    }
    Ozone.util.ModalBox.prototype.hide = function () {
        var v = 'visible';
        var n = 'none';
        this.obol.style.display = n;
        this.obbx.style.display = n;
        this.inf(v);
        document.onkeypress = ''
    }
    Ozone.util.ModalBox.prototype.show = function (msg,wd, ht) {
        var h = 'hidden';
        var b = 'block';
        var p = 'px';
        wd = wd | 200;
        ht = ht | 100;
        var obol = this.obol
        var obbxd = this.obbxd;
        this.txt.innerHTML = msg;
        obol.style.height = this.pageHeight() + p;
        obol.style.width = this.pageWidth() + p;
        obol.style.top = this.posTop() + p;
        obol.style.left = this.posLeft() + p;
        obol.style.display = b;
        var tp = this.posTop() + ((this.pageHeight() - ht) / 2) - 12;
        var lt = this.posLeft() + ((this.pageWidth() - wd) / 2) - 12;
        var obbx = this.obbx
        obbx.style.top = (tp < 0 ? 0 : tp) + p;
        obbx.style.left = (lt < 0 ? 0 : lt) + p;
        obbx.style.width = wd + p;
        obbx.style.height = ht + p;
        this.inf(h);
        obbx.style.display = b;
        this.width = wd;
        this.height = ht;
        return false;
    }
}
if (!Ozone.util.ErrorDlg)
{
    Ozone.util.ErrorDlg = {};
    Ozone.util.ErrorDlg.show=function(msg,width,height)
    {
        if (!this.dlgBox)
            this.dlgBox = new Ozone.util.ModalBox();
        this.dlgBox.show(msg,width,height);
    };
}


/**
 * @private
 */
Ozone.util.fireBrowserEvent = function(dom, type, bubble, cancelable) {
    if (document.createEvent) {
        var event = document.createEvent('Events');
        event.initEvent(type, bubble || true, cancelable || true);
        dom.dispatchEvent(event);
    }
    else if (document.createEventObject) {
        dom.fireEvent('on' + type);
    }
};

/**
    Clones dashboard and returns a dashboard cfg object that can be used to create new dashboards.
    @name cloneDashboard
    @methodOf OWF.Util

    @returns Object dashboard cfg object that can be used to create new dashboards.
 */
Ozone.util.cloneDashboard = function(dashboardCfg, regenerateIds, removeLaunchData) {

    var dashboardStr = Ozone.util.toString(dashboardCfg);

    if(regenerateIds === true) {
        var newDashboardGuid = guid.util.guid(),
            dashboardGuid = dashboardCfg.guid;

        // update dashboard guid
        dashboardStr = dashboardStr.replace(new RegExp(dashboardGuid, 'g'), newDashboardGuid);
        dashboardStrCopy = dashboardStr;

        // update widget instance ids
        var widgetInstanceIdRegex = /\"uniqueId\"\:\"([A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12})\"/g;
        var result;
        while ((result = widgetInstanceIdRegex.exec(dashboardStrCopy)) != null) {
            // var msg = "Found " + result[1];
            // console.log(msg);
            dashboardStr = dashboardStr.replace(new RegExp(result[1], 'g'), guid.util.guid());
        }
    }

    var dashboard = Ozone.util.parseJson(dashboardStr);

    if(removeLaunchData === true) {
        var cleanData = function(cfg) {
            if(!cfg || !cfg.items)
                return;

            if(cfg.items.length === 0 && cfg.widgets) {
                for(var i = 0, len = cfg.widgets.length; i < len; i++) {
                    delete cfg.widgets[i].launchData;
                }
            }
            else {
                for(var i = 0, len = cfg.items.length; i < len; i++) {
                    cleanData(cfg.items[i]);
                }

            }
        };

        cleanData(dashboard.layoutConfig);
    }

    return dashboard;
};

Ozone.util.createRequiredLabel= function(label) {
    return "<span class='required-label'>" + label + " <span class='required-indicator'>*</span></span>";
}

/**
 * @private
 *
 * @description This method determine whether a channel name is a reserved owf channel name.
 *
 * @param {String} channel The channel name
 *
 * @returns {Boolean} True if the channel name is reserved, false otherwise.
 */
Ozone.util.isReservedChannel = function(channel) {
    // This is a horrible way of reserving channel names. Need to make this some sort of calculation
    // so that widgets can't just pass data on an OWF reserved channel name to skirt security.
    // I'm thinking generating a random guid at the start of a session to append to all OWF reserved channel
    // names.
    if(channel) {
        if (channel.indexOf('_WIDGET_STATE_CHANNEL_') == 0 ||
                channel == '_WIDGET_LAUNCHER_CHANNEL' ||
                channel == '_ADD_WIDGET_CHANNEL' ||
                channel == '_ADD_STACK_CHANNEL' ||
                channel == '_LAUNCH_STACK_CHANNEL' ||
                channel == '_dragStart' ||
                channel == '_dragOverWidget' ||
                channel == '_dragOutName' ||
                channel == '_dragStopInContainer' ||
                channel == '_dragStopInWidget' ||
                channel == '_dragSendData' ||
                channel == '_dropReceiveData' ||
                channel == '_intents' ||
                channel == '_intents_receive' ||
                channel == 'Ozone._WidgetChromeChannel' ||
                channel == '_widgetReady' ||
                channel == '_MARKETPLACE_MENU_ITEM_CLICK' ||
                channel == '_MARKETPLACE_MENU_ADMIN_TOGGLE' ||
                channel == 'ozone.marketplace.show' ||
                channel == 'ozone.marketplace.pageLoaded' ||
                channel == 'Ozone.eventing.widget.public' ||
                channel == 'Ozone.eventing.widget.public' ||
                channel == '_DASHBOARD_GET_PANES' ||
                channel == '_MARKETPLACE_LISTING_CHECK')

            return true;
    }
    return false;
};

/**
Returns .
 *
 * @description This method determines whether or not the widget with the specified id has the specified access level.
 *
 * @param {Object} cfg Config object
 *
*/
Ozone.util.hasAccess = function(cfg) {
    var widgetId, accessLevel, channel, senderId, callback;

    // Make sure cfg object was passed in and flag to check access is set to true
    if (!cfg || !cfg.widgetId || !cfg.callback) {
        var response = "Insufficient information provided to determine access level.";
        if (!Ozone.Msg)
            Ozone.util.ErrorDlg.show(response,200,50);
        else
            Ozone.Msg.alert('Error',response,null,this,{
                cls: "owfAlert"
            });

        if (cfg.callback) {
            cfg.callback({
                widgetId: widgetId,
                accessLevel: accessLevel,
                hasAccess: false
            });
        }
        return;
    } else if (!Ozone.config.dataguard.restrictMessages) {
        cfg.callback({
            widgetId: widgetId,
            accessLevel: accessLevel,
            hasAccess: true
        });
        return;
    } else {
        widgetId = cfg.widgetId;
        accessLevel = cfg.accessLevel;
        channel = cfg.channel;
        senderId = cfg.senderId;
        callback = cfg.callback;
    }

    // Allow OWF reserved channels to receive all data because those are used for
    // OWF-specific things like drag-and-drop
    if(Ozone.util.isReservedChannel(cfg.channel)) {
        callback({
            widgetId: widgetId,
            accessLevel: accessLevel,
            hasAccess: true
        });
        return;
    }

    // Err on the side of caution by defaulting to false
    var hasAccess = false;

    // Must specify either an accessLevel or senderId
    if (!accessLevel) {
        if (!senderId || !Ozone.config.dataguard.allowMessagesWithoutAccessLevel) {
            Ozone.audit.log({
                message: "Widget with id " + widgetId + " could not receive data because no access level was provided.",
                accessOutcomeGood: false,
                outcomeCategory: Ozone.util.hasAccess.outcomeCategories.noLevelGiven,
                sendingWidget: senderId,
                receivingWidget: widgetId

            });
            callback({
                widgetId: widgetId,
                accessLevel: accessLevel,
                hasAccess: false
            });
            return;
        }
    }

    function checkAccess(widgetId, accessLevel, channel, senderId, callback) {
        // Check cache
        var accessLevelCacheId = accessLevel ? accessLevel.toUpperCase() : senderId;
        var accessLevelFormatted = accessLevel ? accessLevel : "UNSPECIFIED ACCESS LEVEL";

        if (Ozone.widgetAccesses[widgetId] && Ozone.widgetAccesses[widgetId][accessLevelCacheId]) {
            // Make sure timestamp is less than 1 hour old
            var accessLevelTimestamp = Ozone.widgetAccesses[widgetId][accessLevelCacheId].timestamp.getTime();
            var currentTimestamp = (new Date()).getTime();
            if ((currentTimestamp - accessLevelTimestamp) < Ozone.config.dataguard.accessLevelCacheTimeout) {
                hasAccess = Ozone.widgetAccesses[widgetId][accessLevelCacheId].hasAccess;

                // Log failed access
                if (!hasAccess) {
                    Ozone.audit.log({
                        message: "Widget with id " + widgetId + " does not have sufficient privileges to access " + accessLevelFormatted + " data.",
                        accessOutcomeGood: false,
                        outcomeCategory: Ozone.util.hasAccess.outcomeCategories.insufficient,
                        accessLevel: accessLevelFormatted,
                        sendingWidget: senderId,
                        receivingWidget: widgetId
                    });
                } else if (Ozone.config.dataguard.auditAllMessages || !accessLevel) {
                    Ozone.audit.log({
                        message: "Widget with id " + widgetId + " received message with access level " + accessLevelFormatted + " data.",
                        accessOutcomeGood: true,
                        accessLevel: accessLevelFormatted,
                        sendingWidget: senderId,
                        receivingWidget: widgetId
                    });
                }

                callback({
                    widgetId: widgetId,
                    accessLevel: accessLevel,
                    hasAccess: hasAccess
                });
                return;
            }
        }

        // Evaluate access level
        Ozone.util.Transport.send({
            url: OWF.getContainerUrl() + '/access',
            method: 'POST',
            onSuccess: function(response) {
                hasAccess = response.data.hasAccess;
                Ozone.widgetAccesses[widgetId] = Ozone.widgetAccesses[widgetId] || {};
                Ozone.widgetAccesses[widgetId][accessLevelCacheId] = {
                    hasAccess: hasAccess,
                    timestamp: new Date()
                };

                // Log failed access
                if (!hasAccess) {
                    Ozone.audit.log({
                        message: "Widget with id " + widgetId + " does not have sufficient privileges to access " + accessLevelFormatted + " data.",
                        accessOutcomeGood: false,
                        outcomeCategory: Ozone.util.hasAccess.outcomeCategories.insufficient,
                        accessLevel: accessLevelFormatted,
                        sendingWidget: senderId,
                        receivingWidget: widgetId
                    });
                } else if (Ozone.config.dataguard.auditAllMessages || !accessLevel) {
                    Ozone.audit.log({
                        message: "Widget with id " + widgetId + " received message with access level " + accessLevelFormatted + " data.",
                        accessOutcomeGood: true,
                        accessLevel: accessLevelFormatted,
                        sendingWidget: senderId,
                        receivingWidget: widgetId
                    });
                }

                callback({
                    widgetId: widgetId,
                    accessLevel: accessLevel,
                    hasAccess: hasAccess
                });
            },
            onFailure: function(response) {
                Ozone.audit.log({
                    message: "Failed to determine whether Widget with id " + widgetId + " has sufficient privileges to access " + accessLevelFormatted + " data.",
                    accessOutcomeGood: false,
                    outcomeCategory: Ozone.util.hasAccess.outcomeCategories.noLevelGiven,
                    accessLevel: accessLevelFormatted,
                    sendingWidget: senderId,
                    receivingWidget: widgetId

                });

                if (response == undefined || response == null) response = "";

                if (!Ozone.Msg)
                    Ozone.util.ErrorDlg.show(response,200,50);
                else
                    Ozone.Msg.alert('Server Error',response,null,this,{
                        cls: "owfAlert"
                    });

                callback({
                    widgetId: widgetId,
                    accessLevel: accessLevel,
                    hasAccess: false
                });
            },
            autoSendVersion : false,
            content : {
                widgetId: widgetId,
                accessLevel: accessLevel ? accessLevel : null,
                senderId: senderId ? senderId : null
            }
        });
    }

    if (OWF.getOpenedWidgets && OWF.getOpenedWidgets instanceof Function) {
        OWF.getOpenedWidgets(function(openedWidgets) {
            for (var i = 0; i < openedWidgets.length; i++) {
                var w = openedWidgets[i];
                if (widgetId == w.id) widgetId = w.widgetGuid;
                if (senderId == w.id) senderId = w.widgetGuid;
            }
            checkAccess(widgetId, accessLevel, channel, senderId, callback);
        });
    } else {
        // Ensure widgetId and senderId point to widget guid, not instance id
        var openedWidgets = OWF.Container.Eventing.getOpenedWidgets();
        for (var i = 0; i < openedWidgets.length; i++) {
            var w = openedWidgets[i];
            if (widgetId == w.id) widgetId = w.widgetGuid;
            if (senderId == w.id) senderId = w.widgetGuid;
        }
        checkAccess(widgetId, accessLevel, channel, senderId, callback);
    }
};

Ozone.util.hasAccess.outcomeCategories = { noLevelGiven: "NOT_SPECIFIED", insufficient: "INSUFFICIENT_ACCESS" };


Ozone.util._findByReceiveIntent = function (array, intent) {
    return _.filter(array, function (state) {

        if(!intent.dataType) {
            return false;
        }

        var intents = state.get('intents'),
            found = false;

        _.each(intents.receive, function (componentIntent) {
            if(componentIntent.action === intent.action) {
                _.each(componentIntent.dataTypes, function (dataType) {
                    if(dataType === intent.dataType) {
                        found = true;
                    }
                })
            }
        });

        return found;

    });
};

/**
 * Look through all available widget definitions and return the one whose
 * URL is the longest leading substring of the url passed in
 * @param url The URL to match on
 */
Ozone.util.findWidgetDefinitionByLongestUrlMatch = function(url) {
    var store = Ext.StoreManager.lookup('widgetStore'),
        match = null;

    if (!url) return null;

    store.each(function(widget) {
        var widgetUrl = widget.get('url');

        //if this url is the beginning of the url in question
        if (url.indexOf(widgetUrl) === 0) {
            //if this is a better match than the previous best
            if (!match || match.get('url').length < widgetUrl.length) {
                match = widget;
            }
        }
    });

    return match;
};

/**
 * Given and Ext model, creates a Backbone model holding the same data.
 */
Ozone.util.convertExtModelToBackboneModel = function(extModel) {
    return new Backbone.Model(extModel.data);
};
