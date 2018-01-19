/**
 * @fileoverview The preference server script controls all the preference server communication.
 */



/**
 * @ignore
 */
var Ozone = Ozone || {};

/**
 * @ignore
 */
Ozone.pref = Ozone.pref || {};

(function(window, document, undefined) {
  /**
   * @constructor  None, this is a Singleton
   * @description This object is used to create, retrieve, update and delete user preferences. A user preference is simply a string
   * stored in OWF that is uniquely mapped to a user, namespace, and name combination.
   * <br><br>
   * All public methods of this class accept an onSuccess function. This function is executed upon successful completion of the requested operation and is passed a copy of the preference object.
   * @example
   * The following is an example of a preference object passed to the onSuccess
   * function:
   *
   * {
   *     "value":"true",
   *     "path":"militaryTime",
   *     "user":
   *     {
   *         "userId":"testAdmin1"
   *     },
   *     "namespace":"com.mycompany.AnnouncingClock"
   * }
   *
   * Where:
   *
   * value: The preference value that is stored in the database. This can be any string
   *        including JSON.
   * path: The name of the user preference.
   * user: The user object. The only user information returned at this time is the user
   *       ID.
   * namespace: The namespace of the requested user preference.
   *
   * @requires Ozone.util.Transport
   */
  Ozone.pref.PrefServer = function(_url) {
      if ( _url === undefined || _url === "null" ||  _url.indexOf('$') !== -1 || _url.length === 0 ) {
          // default incase no prefLocation is given
          // ugly alert message, but let's fail fast
           // alert("prefsLocation is null or incorrect.  Perhaps in the OwfConfig.xml file?");
      } else {
          //Strip off a trailing slash.
          if (_url.lastIndexOf("/") === (_url.length -1)) {
              _url = _url.substring(0,_url.length-1);
          }
      }

      /** @private
       * @description Look up a value for the given url. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @return JSON object representing the requested preference
       * @param cfg config object see below for properties
       * @param cfg.url url to be used in the call
       * @param cfg.onSuccess callback function to capture the success result
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided)
       * @param cfg.ignoredErrorCodes allows the caller to ignore certain http error codes.  If they occur onsuccess will be called with a null payload
       *
       * @example var prefs = new Ozone.pref.Prefs();
       *
       * var mysuccess = function(result){
       *         this.value = result;
       *         alert(result);
       *         alert(result.value);
       *
       * getValue({url:_url + "/" + namespace + "/" + path, onSuccess:onSuccessCallback, onFailure:onFailCallback});
       *
       */
      var get = function (cfg) {
          cfg.method = "GET";
          cfg.async = true;
          Ozone.util.Transport.send(cfg);
      };

      /** @private
       * @description Delete instance of the given url. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @param cfg config object see below for properties
       * @param cfg.url url to be used in the call
       * @param cfg.onSuccess callback function to capture the success result
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided)
       *
       * @example
       * var onSuccess = function(result){
       *         this.value = result;
       *         alert(result);
       * }
       *
       * var onFailure = function(err) {
       *   alert("There was an error: " + err);
       * }
       *
       * deleteBase({url:_url + "/" + namespace + "/" + path, onSuccess:onSuccessCallback, onFailure:onFailCallback});
       */
      var deleteBase = function (cfg) {
          cfg.method = 'DELETE';
          setValue(cfg);
      };

      /** @private
       * @description Get an array of object for the requested namespace
       * @param cfg config object see below for properties
       * @param cfg.url        - string
       * @param cfg.onSuccess        - callback function to capture the success result
       * @param cfg.onFailure        - callback to execute if there is an error (optional, a default alert provided)
       * @example
       * var onSuccess = function(result){
       * 		this.value = result;
       * 		alert(result);
       * }
       *
       * var onFailure = function(err) {
       *   alert("There was an error: " + err);
       * }
       *
       * list({namespace:"namespace1", onSuccess:onSuccess, onFailure:onFailure});
       */
      var list = function (cfg) {
          cfg.url = _url + "/" + cfg.url;
          get(cfg);
      };

      /**
       * @private
       * @description Set a value for the given url. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @param cfg.url url to be used in the call
       * @param cfg.content The content of the send. Either map or JSON with the _method property already defined.
       * @param cfg.onSuccess callback function to capture the success result (optional)
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided if an onSuccess callback is passed in)
       * @example
       * var onSuccess = function(result){
       *         this.value = result;
       *         alert(result);  //TODO: the preference server currently doesn't return anything
       * }
       *
       * var onFailure = function(err) {
       *   alert("There was an error: " + err);
       * }
       *
       * setValueBase(_url + "/" + namespace + "/" + path, content, onSuccessCallback, onFailCallback);
       */
      var setValueBase = function(cfg)
      {
           cfg.method = cfg.content["_method"];
           if (cfg.onSuccess) {
              if (!cfg.onFailure) {  //must ensure there is an onfailure method, as we using content
                  cfg.onFailure = function(err) {
                      alert(Ozone.util.ErrorMessageString.saveUserPreferences + " : " + err);
                  };
              }
              Ozone.util.Transport.send(cfg);
          } else {
              Ozone.util.Transport.sendAndForget(cfg);
          }

      };

      /**
       * @private
       * @description Set a value for the given url. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @param cfg config object see below for properties
       * @param cfg.url url to be used in the call
       * @param cfg.json The value to store.
       * @param cfg.method The method for the call. ('DELETE', 'PUT')
       * @param cfg.onSuccess callback function to capture the success result (optional)
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided if an onSuccess callback is passed in)
       * @example
       * var onSuccess = function(result){
       *         this.value = result;
       *         alert(result);  //TODO: the preference server currently doesn't return anything
       * }
       *
       * var onFailure = function(err) {
       *   alert("There was an error: " + err);
       * }
       *
       * setValue({url:_url + "/" + namespace + "/" + path, json:value, method:method, onSuccess:onSuccessCallback, onFailure:onFailCallback});
       */
      var setValue = function (cfg) {
          if (cfg.method == null) {
              cfg.method = 'PUT';
          }

          var content = {
              '_method': cfg.method
          };

          if (cfg.json) {
              content = {
                  '_method': cfg.method,
                  'name': cfg.json.name,
                  'description': cfg.json.description,
                  'iconImageUrl': cfg.json.iconImageUrl,
                  'type': cfg.json.type,
                  'guid': cfg.json.guid,
                  'isdefault': cfg.json.isdefault,
                  'locked': cfg.json.locked,
                  'state': cfg.json.state,
                  'layoutConfig': cfg.json.layoutConfig,
                  'stack': cfg.json.stack,
                  'markedForDeletion': cfg.json.markedForDeletion,
                  'publishedToStore': cfg.json.publishedToStore
              };
              if (cfg.json.cloned === true) content.cloned = true;
              if (cfg.json.bypassLayoutRearrange === true) content.bypassLayoutRearrange = true;
          }
          cfg.content = content;
          setValueBase(cfg);
      };

      /**
       * @private
       * @description Set a value for the given url by using a JSON object, allowing multiple parameters for PUT/POST. This should generally not be called from user code, rather, an entity-specific method should be called.
       * @param cfg config object see below for properties
       * @param cfg.url url to be used in the call
       * @param cfg.jsonObject The parameters to pass in. Note that the value parameter is required, and this is what will be stored in the "value" column of the appropriate table.
       * @param cfg.method The method for the call. ('DELETE', 'PUT')
       * @param cfg.onSuccess callback function to capture the success result (optional)
       * @param cfg.onFailure callback to execute if there is an error (optional, a default alert is provided if an onSuccess callback is passed in)
       * @example
       *
       * ...code setting up a desktop dashboard
       *
       * var postParams =
       *   {
       *     'value': this.config.value,
       *      'path': this.config.value.guid,
       *      'type': 'desktop',
       *      'isdefault': saveAsDefault
       *   };
       *
       *	setValuesViaJSONObject(_url + "/" + namespace + "/" + path, jsonObject, saveMethod, onSuccess, onFailure);
       */
      var setValuesViaJSONObject = function(cfg) {
          if (cfg.jsonObject._method === undefined)
          {
              if (cfg.method == null) {
                  cfg.method = 'PUT';
              }
              cfg.jsonObject._method = cfg.method;
          }
          cfg.json = cfg.jsonObject;
          setValue(cfg);

      };

     /**
       * @private
       * @description Create JSON object with params. This should generally not be called from user code.
       * @param cfg config object see below for properties
       * @param cfg.dashboardId
       * @param cfg.value
       * @param cfg.type
       * @param cfg.isDefault
       * @return the JSON object
       */
      var generateDashboardPostParamsJSON = function (json) {
          var postParams = {
            'name': json.name,
            'description': json.description,
            'iconImageUrl': json.iconImageUrl,
            'type': json.type,
            'guid': json.guid,
            'isdefault': json.isdefault,
            'locked': json.locked,
            'state': json.state,
            'layoutConfig': typeof json.layoutConfig === 'string' ? json.layoutConfig : Ozone.util.toString(json.layoutConfig),
            'stack': json.stack,
            'markedForDeletion' : json.markedForDeletion,
            'publishedToStore' : json.publishedToStore
          };

          //remove undefined fields, which are serialized incorrectly by Ozone.util.toString
          for (var prop in postParams) {
            if (postParams[prop] === undefined) {
                delete postParams[prop];
            }
          }
          return postParams;
      };

      var generateStackPostParamsJSON = function (json) {
          var stack;

          if (json.stack) {
              if (json.stack.id) {
                  stack = { 'id': json.stack.id };
              } else {
                  stack = {
                      'name': json.stack.name,
                      'description': json.stack.description,
                      'imageUrl': json.stack.imageUrl,
                      'stackContext': json.stack.stackContext
                  };
              }
          }
          else {
              stack = {
                  "name": json.name,
                  "description": json.description,
                  "imageUrl": json.iconImageUrl,
                  "stackContext": json.stackContext
              };
          }

          for (var prop in stack) {
            if (stack[prop] === undefined) {
                delete stack[prop];
            }
          }

          return stack;
      };

      /**
       * @private
       * @description Create JSON object with params. This should generally not be called from user code.
       * @param cfg config object see below for properties
       * @param cfg.dashboardId
       * @param cfg.value
       * @param cfg.type
       * @param cfg.isDefault
       * @return the JSON object
       */
      var generateAppPostParamsJSON = function (json) {
          return {
              'stackData': Ozone.util.toString(generateStackPostParamsJSON(json)),
              'dashboardData': Ozone.util.toString(generateDashboardPostParamsJSON(json)),
              'tab': 'dashboards',
              'update_action': 'createAndAddDashboard',
              'adminEnabled': false,
              '_method': 'POST'
          };
      };

      return /** @lends Ozone.pref.PrefServer.prototype */{

          version: Ozone.version.owfversion + Ozone.version.preference,

          /**
           * @description Get the url for the Preference Server
           * @returns {String} url
           */
          getUrl : function() {
              return _url;
          },

          /**
           * @description Sets the url for the Preference Server
           * @param {String} url
           * @returns void
           */
          setUrl : function(url) {
              _url = url;
          },

          /**
           * @description Gets the dashboard with the specified id
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.dashboardId Unigue dashbard identifier
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {String} layoutConfig: Holds the various containers and panes on a dashboard and the widgets inside of the panes, including the widget states.
           *     This parameter provides an EXT JS style configuration used to layout the supported pane types in an OWF dashboard along. Each
           *     internal definition can hold nested panes in an items array, widgets in a widgets array, and default values for those widgets in a defaultValues array.
           *     Panes can have the following parameters:<br>
           *     <ul style="list-style-type:none">
           *        <li>{String} xtype: container|accordionpane|desktoppane|fitpane|portalpane|tabbedpane|dashboardsplitter</li>
           *        <li>{Number} flex: 1 if for a pane; 3 for a container<li>
           *        <li>{String} htmlText: in pixels (e.g., 300px) or percent (e.g., 100%) or "variable"; valid if nested in a horizontally/vertically split pane</li>
           *        <li>{String} cls: left|right if nested in a horizontally split pane; top|bottom if nested in a vertically split pane; vbox|hbox if xtype is container</li>
           *        <li>{Array} items: an array of 2 nested pane configurations along with a possible dashboardspliiter for vbox and hbox containers; empty otherwise</li>
           *        <li>{String} paneType: accordionpane|desktoppane|fitpane|portalpane|tabbedpane; valid if xtype is not container</li>
           *        <li>{Array} layout: valid only for container xtype.  Includes the following elements:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} type: vbox|hbox</li>
           *           <li>{String} align: stretch</li>
           *        </ul>
           *        <li>{Array} widgets: array of widget state objects.  Each has the following properties:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} widgetGuid: unique widget identifier</li>
           *           <li>{Number} width: width of widget in pixels</li>
           *           <li>{Number} zIndex: in pixels</li>
           *           <li>{String} region: containing region on dashboard.  Dashboard type specific.</li>
           *           <li>{Boolean} pinned: true if widget is pinned open</li>
           *           <li>{String} buttonId: identifier of button that opens widget</li>
           *           <li>{Number} height: height of widget in pixels</li>
           *           <li>{Number} columnPos: position of widget in a column</li>
           *           <li>{String} name: widget name</li>
           *           <li>{Number} statePosition</li>
           *           <li>{Boolean} active: true if this widget is the active (has focus) widget</li>
           *           <li>{String} uniqueId: unique widget identifier on dashboard</li>
           *           <li>{Boolean} minimized: true if widget is minimized</li>
           *           <li>{Boolean} buttonOpened: true if button launched widget is opened</li>
           *           <li>{Boolean} collapsed: true if widget is collapsed</li>
           *           <li>{Number} y: y-axis position in pixels</li>
           *           <li>{Number} x: x-axis position in pixels</li>
           *           <li>{Boolean} maximized: true if widget is maximized</li>
           *        </ul>
           *        <li>{String} defaultSettings: JSON string of default settings which varies by pane type; not valid for containers</li>
           *     </ul>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
           *     alert(dashboard.name);
           * };
           *
           * var onFailure = function(error) {
               *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.getDashboard({
           *     dashboardId:'917b4cd0-ecbd-410b-afd9-42d150c26426',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getDashboard : function (cfg){
              cfg.url = _url + "/" + 'dashboard' + "/" + cfg.dashboardId;
              get(cfg);
          },

          /**
           * @description Gets the user's default dashboard
           * @param {Object} cfg config object see below for properties
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {String} layoutConfig: Holds the various containers and panes on a dashboard and the widgets inside of the panes, including the widget states.
           *     This parameter provides an EXT JS style configuration used to layout the supported pane types in an OWF dashboard along. Each
           *     internal definition can hold nested panes in an items array, widgets in a widgets array, and default values for those widgets in a defaultValues array.
           *     Panes can have the following parameters:<br>
           *     <ul style="list-style-type:none">
           *        <li>{String} xtype: container|accordionpane|desktoppane|fitpane|portalpane|tabbedpane|dashboardsplitter</li>
           *        <li>{Number} flex: 1 if for a pane; 3 for a container<li>
           *        <li>{String} htmlText: in pixels (e.g., 300px) or percent (e.g., 100%) or "variable"; valid if nested in a horizontally/vertically split pane</li>
           *        <li>{String} cls: left|right if nested in a horizontally split pane; top|bottom if nested in a vertically split pane; vbox|hbox if xtype is container</li>
           *        <li>{Array} items: an array of 2 nested pane configurations along with a possible dashboardspliiter for vbox and hbox containers; empty otherwise</li>
           *        <li>{String} paneType: accordionpane|desktoppane|fitpane|portalpane|tabbedpane; valid if xtype is not container</li>
           *        <li>{Array} layout: valid only for container xtype.  Includes the following elements:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} type: vbox|hbox</li>
           *           <li>{String} align: stretch</li>
           *        </ul>
           *        <li>{Array} widgets: array of widget state objects.  Each has the following properties:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} widgetGuid: unique widget identifier</li>
           *           <li>{Number} width: width of widget in pixels</li>
           *           <li>{Number} zIndex: in pixels</li>
           *           <li>{String} region: containing region on dashboard.  Dashboard type specific.</li>
           *           <li>{Boolean} pinned: true if widget is pinned open</li>
           *           <li>{String} buttonId: identifier of button that opens widget</li>
           *           <li>{Number} height: height of widget in pixels</li>
           *           <li>{Number} columnPos: position of widget in a column</li>
           *           <li>{String} name: widget name</li>
           *           <li>{Number} statePosition</li>
           *           <li>{Boolean} active: true if this widget is the active (has focus) widget</li>
           *           <li>{String} uniqueId: unique widget identifier on dashboard</li>
           *           <li>{Boolean} minimized: true if widget is minimized</li>
           *           <li>{Boolean} buttonOpened: true if button launched widget is opened</li>
           *           <li>{Boolean} collapsed: true if widget is collapsed</li>
           *           <li>{Number} y: y-axis position in pixels</li>
           *           <li>{Number} x: x-axis position in pixels</li>
           *           <li>{Boolean} maximized: true if widget is maximized</li>
           *        </ul>
           *        <li>{String} defaultSettings: JSON string of default settings which varies by pane type; not valid for containers</li>
           *     </ul>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
           *     alert(dashboard.name);
           * };
           *
           * var onFailure = function(error) {
               *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.getDefaultDashboard({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getDefaultDashboard : function (cfg){
              cfg.url = _url +"/dashboard?isdefault=true";
              cfg.method = "POST";
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @description Sets the user's default dashboard
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.dashboardId Unigue dashbard identifier
           * @param {Boolean} cfg.isDefault true to set as default dashboard
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {String} layoutConfig: Holds the various containers and panes on a dashboard and the widgets inside of the panes, including the widget states.
           *     This parameter provides an EXT JS style configuration used to layout the supported pane types in an OWF dashboard along. Each
           *     internal definition can hold nested panes in an items array, widgets in a widgets array, and default values for those widgets in a defaultValues array.
           *     Panes can have the following parameters:<br>
           *     <ul style="list-style-type:none">
           *        <li>{String} xtype: container|accordionpane|desktoppane|fitpane|portalpane|tabbedpane|dashboardsplitter</li>
           *        <li>{Number} flex: 1 if for a pane; 3 for a container<li>
           *        <li>{String} htmlText: in pixels (e.g., 300px) or percent (e.g., 100%) or "variable"; valid if nested in a horizontally/vertically split pane</li>
           *        <li>{String} cls: left|right if nested in a horizontally split pane; top|bottom if nested in a vertically split pane; vbox|hbox if xtype is container</li>
           *        <li>{Array} items: an array of 2 nested pane configurations along with a possible dashboardspliiter for vbox and hbox containers; empty otherwise</li>
           *        <li>{String} paneType: accordionpane|desktoppane|fitpane|portalpane|tabbedpane; valid if xtype is not container</li>
           *        <li>{Array} layout: valid only for container xtype.  Includes the following elements:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} type: vbox|hbox</li>
           *           <li>{String} align: stretch</li>
           *        </ul>
           *        <li>{Array} widgets: array of widget state objects.  Each has the following properties:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} widgetGuid: unique widget identifier</li>
           *           <li>{Number} width: width of widget in pixels</li>
           *           <li>{Number} zIndex: in pixels</li>
           *           <li>{String} region: containing region on dashboard.  Dashboard type specific.</li>
           *           <li>{Boolean} pinned: true if widget is pinned open</li>
           *           <li>{String} buttonId: identifier of button that opens widget</li>
           *           <li>{Number} height: height of widget in pixels</li>
           *           <li>{Number} columnPos: position of widget in a column</li>
           *           <li>{String} name: widget name</li>
           *           <li>{Number} statePosition</li>
           *           <li>{Boolean} active: true if this widget is the active (has focus) widget</li>
           *           <li>{String} uniqueId: unique widget identifier on dashboard</li>
           *           <li>{Boolean} minimized: true if widget is minimized</li>
           *           <li>{Boolean} buttonOpened: true if button launched widget is opened</li>
           *           <li>{Boolean} collapsed: true if widget is collapsed</li>
           *           <li>{Number} y: y-axis position in pixels</li>
           *           <li>{Number} x: x-axis position in pixels</li>
           *           <li>{Boolean} maximized: true if widget is maximized</li>
           *        </ul>
           *        <li>{String} defaultSettings: JSON string of default settings which varies by pane type; not valid for containers</li>
           *     </ul>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
           *     alert(dashboard.name);
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.setDefaultDashboard({
           *     dashboardId:'917b4cd0-ecbd-410b-afd9-42d150c26426',
           *     isDefault:true,
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          setDefaultDashboard : function (cfg){
              cfg.url = _url + "/dashboard/" + cfg.dashboardId + "?isdefault=" + cfg.isDefault;
              cfg.method = 'PUT';
              setValue(cfg);
          },

          /**
           * @description Saves changes to a new or existing dashboard
           * @param {Object} cfg config object see below for properties
           * @param {Object} cfg.json The encoded JSON object representing the dashboard.
           * The dashboard object has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {String} layout: layout of dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Number} columnCount: number of columns if dashboard is a portal type<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {List} EDashboardLayoutList: list of dashboard types<br>
           *     {String} defaultSettings: JSON string of default settings which varies by dashboard type<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {String} layoutConfig: Holds the various containers and panes on a dashboard and the widgets inside of the panes, including the widget states.
           *     This parameter provides an EXT JS style configuration used to layout the supported pane types in an OWF dashboard along. Each
           *     internal definition can hold nested panes in an items array, widgets in a widgets array, and default values for those widgets in a defaultValues array.
           *     Panes can have the following parameters:<br>
           *     <ul style="list-style-type:none">
           *        <li>{String} xtype: container|accordionpane|desktoppane|fitpane|portalpane|tabbedpane|dashboardsplitter</li>
           *        <li>{Number} flex: 1 if for a pane; 3 for a container<li>
           *        <li>{String} htmlText: in pixels (e.g., 300px) or percent (e.g., 100%) or "variable"; valid if nested in a horizontally/vertically split pane</li>
           *        <li>{String} cls: left|right if nested in a horizontally split pane; top|bottom if nested in a vertically split pane; vbox|hbox if xtype is container</li>
           *        <li>{Array} items: an array of 2 nested pane configurations along with a possible dashboardspliiter for vbox and hbox containers; empty otherwise</li>
           *        <li>{String} paneType: accordionpane|desktoppane|fitpane|portalpane|tabbedpane; valid if xtype is not container</li>
           *        <li>{Array} layout: valid only for container xtype.  Includes the following elements:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} type: vbox|hbox</li>
           *           <li>{String} align: stretch</li>
           *        </ul>
           *        <li>{Array} widgets: array of widget state objects.  Each has the following properties:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} widgetGuid: unique widget identifier</li>
           *           <li>{Number} width: width of widget in pixels</li>
           *           <li>{Number} zIndex: in pixels</li>
           *           <li>{String} region: containing region on dashboard.  Dashboard type specific.</li>
           *           <li>{Boolean} pinned: true if widget is pinned open</li>
           *           <li>{String} buttonId: identifier of button that opens widget</li>
           *           <li>{Number} height: height of widget in pixels</li>
           *           <li>{Number} columnPos: position of widget in a column</li>
           *           <li>{String} name: widget name</li>
           *           <li>{Number} statePosition</li>
           *           <li>{Boolean} active: true if this widget is the active (has focus) widget</li>
           *           <li>{String} uniqueId: unique widget identifier on dashboard</li>
           *           <li>{Boolean} minimized: true if widget is minimized</li>
           *           <li>{Boolean} buttonOpened: true if button launched widget is opened</li>
           *           <li>{Boolean} collapsed: true if widget is collapsed</li>
           *           <li>{Number} y: y-axis position in pixels</li>
           *           <li>{Number} x: x-axis position in pixels</li>
           *           <li>{Boolean} maximized: true if widget is maximized</li>
           *        </ul>
           *        <li>{String} defaultSettings: JSON string of default settings which varies by pane type; not valid for containers</li>
           *     </ul>
           * <br>
           * @param {Boolean} cfg.saveAsNew A Boolean indicating whether the entity being saved is new.
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {String} layoutConfig: Holds the various containers and panes on a dashboard and the widgets inside of the panes, including the widget states.
           *     This parameter provides an EXT JS style configuration used to layout the supported pane types in an OWF dashboard along. Each
           *     internal definition can hold nested panes in an items array, widgets in a widgets array, and default values for those widgets in a defaultValues array.
           *     Panes can have the following parameters:<br>
           *     <ul style="list-style-type:none">
           *        <li>{String} xtype: container|accordionpane|desktoppane|fitpane|portalpane|tabbedpane|dashboardsplitter</li>
           *        <li>{Number} flex: 1 if for a pane; 3 for a container<li>
           *        <li>{String} htmlText: in pixels (e.g., 300px) or percent (e.g., 100%) or "variable"; valid if nested in a horizontally/vertically split pane</li>
           *        <li>{String} cls: left|right if nested in a horizontally split pane; top|bottom if nested in a vertically split pane; vbox|hbox if xtype is container</li>
           *        <li>{Array} items: an array of 2 nested pane configurations along with a possible dashboardspliiter for vbox and hbox containers; empty otherwise</li>
           *        <li>{String} paneType: accordionpane|desktoppane|fitpane|portalpane|tabbedpane; valid if xtype is not container</li>
           *        <li>{Array} layout: valid only for container xtype.  Includes the following elements:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} type: vbox|hbox</li>
           *           <li>{String} align: stretch</li>
           *        </ul>
           *        <li>{Array} widgets: array of widget state objects.  Each has the following properties:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} widgetGuid: unique widget identifier</li>
           *           <li>{Number} width: width of widget in pixels</li>
           *           <li>{Number} zIndex: in pixels</li>
           *           <li>{String} region: containing region on dashboard.  Dashboard type specific.</li>
           *           <li>{Boolean} pinned: true if widget is pinned open</li>
           *           <li>{String} buttonId: identifier of button that opens widget</li>
           *           <li>{Number} height: height of widget in pixels</li>
           *           <li>{Number} columnPos: position of widget in a column</li>
           *           <li>{String} name: widget name</li>
           *           <li>{Number} statePosition</li>
           *           <li>{Boolean} active: true if this widget is the active (has focus) widget</li>
           *           <li>{String} uniqueId: unique widget identifier on dashboard</li>
           *           <li>{Boolean} minimized: true if widget is minimized</li>
           *           <li>{Boolean} buttonOpened: true if button launched widget is opened</li>
           *           <li>{Boolean} collapsed: true if widget is collapsed</li>
           *           <li>{Number} y: y-axis position in pixels</li>
           *           <li>{Number} x: x-axis position in pixels</li>
           *           <li>{Boolean} maximized: true if widget is maximized</li>
           *        </ul>
           *        <li>{String} defaultSettings: JSON string of default settings which varies by pane type; not valid for containers</li>
           *     </ul>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @param {Boolean} [cfg.async] Async true or false defaults to true
           * @example
           *
           * var onSuccess = function(dashboard) {
           *   alert(dashboard.name);
           * };
           *
           * var onFailure = function(error) {
           *   alert(error);
           * };
           *
           * var dashboard = {
           *   alteredByAdmin: 'false',
           *   createdDate: '04/18/2012 11:29 AM EDT',
           *   isGroupDashboard: false,
           *   isdefault: false,
           *   locked: false,
           *   name: 'My Dashboard',
           *   user: {
           *     userId: 'testAdmin1',
           *   },
           *   createdBy: {
           *     userId: 'testAdmin1',
           *     userRealName: 'Test Admin 1'
           *   },
           *   editedDate: '04/18/2012 11:29 AM EDT',
           *   groups: [],
           *   description: 'This is my dashboard',
           *   guid: guid.util.guid(),
           *   layoutConfig: {
           *       xtype: "desktoppane",
           *       flex: 1,
           *       height: "100%",
           *       items: [
           *       ],
           *       paneType: "desktoppane",
           *       widgets: [{
           *               widgetGuid: "ec5435cf-4021-4f2a-ba69-dde451d12551",
           *               uniqueId: guid.util.guid(),
           *               dashboardGuid: "6d7219cb-b485-ace5-946b-0affa1f227a3",
           *               paneGuid: guid.util.guid(),
           *               name: "Channel Listener",
           *               active: false,
           *               x: 50,
           *               y: 66,
           *               minimized: false,
           *               maximized: false,
           *               pinned: false,
           *               collapsed: false,
           *               columnPos: 0,
           *               buttonId: null,
           *               buttonOpened: false,
           *               region: "none",
           *               statePosition: 1,
           *               intentConfig: null,
           *               singleton: false,
           *               floatingWidget: false,
           *               background: false,
           *               zIndex: 19050,
           *               height: 440,
           *               width: 540
           *           }
           *       ],
           *       defaultSettings: {
           *           widgetStates: {
           *               "ec5435cf-4021-4f2a-ba69-dde451d12551": {
           *                   x: 50,
           *                   y: 66,
           *                   height: 440,
           *                   width: 540,
           *                   timestamp: 1349809747336
           *                }
           *           }
           *       }
           *      }
           * };
           *
           * Ozone.pref.PrefServer.createOrUpdateDashboard({
           *   json: dashboard,
           *   saveAsNew: true,
           *   onSuccess: onSuccess,
           *   onFailure: onFailure,
           *   async: true
           * });
           */
          createOrUpdateDashboard : function (cfg){
              // New dashboard is added to its stack, existing dashboard is updated
              if (cfg.saveAsNew) {
                  this.createDashboardWithStack(cfg);
              } else {
                  this.createOrUpdateDashboardInternal(cfg);
              }
          },

          createDashboardWithStack: function(cfg) {
              cfg.url = Ozone.util.contextPath()  + '/stack/addPage';
              cfg.method = 'POST';
              cfg.content = generateAppPostParamsJSON(cfg.json);
              setValueBase(cfg);
          },

          createOrUpdateDashboardInternal : function (cfg){
              cfg.url = _url + "/" + 'dashboard' + "/" + cfg.json.guid;
              var postParams = generateDashboardPostParamsJSON(cfg.json);
              postParams.bypassLayoutRearrange = true;
              cfg.method = cfg.saveAsNew ? 'POST' : 'PUT';
              cfg.jsonObject = postParams;
              setValuesViaJSONObject(cfg);
          },

          /**
           * @description Copies an existing dashboard and saves it as new
           * @param {Object} cfg config object see below for properties
           * @param {Object} cfg.json The encoded JSON object representing the dashboard.
           * The dashboard object has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {String} layoutConfig: Holds the various containers and panes on a dashboard and the widgets inside of the panes, including the widget states.
           *     This parameter provides an EXT JS style configuration used to layout the supported pane types in an OWF dashboard along. Each
           *     internal definition can hold nested panes in an items array, widgets in a widgets array, and default values for those widgets in a defaultValues array.
           *     Panes can have the following parameters:<br>
           *     <ul style="list-style-type:none">
           *        <li>{String} xtype: container|accordionpane|desktoppane|fitpane|portalpane|tabbedpane|dashboardsplitter</li>
           *        <li>{Number} flex: 1 if for a pane; 3 for a container<li>
           *        <li>{String} htmlText: in pixels (e.g., 300px) or percent (e.g., 100%) or "variable"; valid if nested in a horizontally/vertically split pane</li>
           *        <li>{String} cls: left|right if nested in a horizontally split pane; top|bottom if nested in a vertically split pane; vbox|hbox if xtype is container</li>
           *        <li>{Array} items: an array of 2 nested pane configurations along with a possible dashboardspliiter for vbox and hbox containers; empty otherwise</li>
           *        <li>{String} paneType: accordionpane|desktoppane|fitpane|portalpane|tabbedpane; valid if xtype is not container</li>
           *        <li>{Array} layout: valid only for container xtype.  Includes the following elements:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} type: vbox|hbox</li>
           *           <li>{String} align: stretch</li>
           *        </ul>
           *        <li>{Array} widgets: array of widget state objects.  Each has the following properties:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} widgetGuid: unique widget identifier</li>
           *           <li>{Number} width: width of widget in pixels</li>
           *           <li>{Number} zIndex: in pixels</li>
           *           <li>{String} region: containing region on dashboard.  Dashboard type specific.</li>
           *           <li>{Boolean} pinned: true if widget is pinned open</li>
           *           <li>{String} buttonId: identifier of button that opens widget</li>
           *           <li>{Number} height: height of widget in pixels</li>
           *           <li>{Number} columnPos: position of widget in a column</li>
           *           <li>{String} name: widget name</li>
           *           <li>{Number} statePosition</li>
           *           <li>{Boolean} active: true if this widget is the active (has focus) widget</li>
           *           <li>{String} uniqueId: unique widget identifier on dashboard</li>
           *           <li>{Boolean} minimized: true if widget is minimized</li>
           *           <li>{Boolean} buttonOpened: true if button launched widget is opened</li>
           *           <li>{Boolean} collapsed: true if widget is collapsed</li>
           *           <li>{Number} y: y-axis position in pixels</li>
           *           <li>{Number} x: x-axis position in pixels</li>
           *           <li>{Boolean} maximized: true if widget is maximized</li>
           *        </ul>
           *        <li>{String} defaultSettings: JSON string of default settings which varies by pane type; not valid for containers</li>
           *     </ul>
           * <br>
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {String} layoutConfig: Holds the various containers and panes on a dashboard and the widgets inside of the panes, including the widget states.
           *     This parameter provides an EXT JS style configuration used to layout the supported pane types in an OWF dashboard along. Each
           *     internal definition can hold nested panes in an items array, widgets in a widgets array, and default values for those widgets in a defaultValues array.
           *     Panes can have the following parameters:<br>
           *     <ul style="list-style-type:none">
           *        <li>{String} xtype: container|accordionpane|desktoppane|fitpane|portalpane|tabbedpane|dashboardsplitter</li>
           *        <li>{Number} flex: 1 if for a pane; 3 for a container<li>
           *        <li>{String} htmlText: in pixels (e.g., 300px) or percent (e.g., 100%) or "variable"; valid if nested in a horizontally/vertically split pane</li>
           *        <li>{String} cls: left|right if nested in a horizontally split pane; top|bottom if nested in a vertically split pane; vbox|hbox if xtype is container</li>
           *        <li>{Array} items: an array of 2 nested pane configurations along with a possible dashboardspliiter for vbox and hbox containers; empty otherwise</li>
           *        <li>{String} paneType: accordionpane|desktoppane|fitpane|portalpane|tabbedpane; valid if xtype is not container</li>
           *        <li>{Array} layout: valid only for container xtype.  Includes the following elements:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} type: vbox|hbox</li>
           *           <li>{String} align: stretch</li>
           *        </ul>
           *        <li>{Array} widgets: array of widget state objects.  Each has the following properties:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} widgetGuid: unique widget identifier</li>
           *           <li>{Number} width: width of widget in pixels</li>
           *           <li>{Number} zIndex: in pixels</li>
           *           <li>{String} region: containing region on dashboard.  Dashboard type specific.</li>
           *           <li>{Boolean} pinned: true if widget is pinned open</li>
           *           <li>{String} buttonId: identifier of button that opens widget</li>
           *           <li>{Number} height: height of widget in pixels</li>
           *           <li>{Number} columnPos: position of widget in a column</li>
           *           <li>{String} name: widget name</li>
           *           <li>{Number} statePosition</li>
           *           <li>{Boolean} active: true if this widget is the active (has focus) widget</li>
           *           <li>{String} uniqueId: unique widget identifier on dashboard</li>
           *           <li>{Boolean} minimized: true if widget is minimized</li>
           *           <li>{Boolean} buttonOpened: true if button launched widget is opened</li>
           *           <li>{Boolean} collapsed: true if widget is collapsed</li>
           *           <li>{Number} y: y-axis position in pixels</li>
           *           <li>{Number} x: x-axis position in pixels</li>
           *           <li>{Boolean} maximized: true if widget is maximized</li>
           *        </ul>
           *        <li>{String} defaultSettings: JSON string of default settings which varies by pane type; not valid for containers</li>
           *     </ul>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
           *   alert(dashboard.name);
           * };
           *
           * var onFailure = function(error) {
           *   alert(error);
           * };
           *
           * var dashboard = {
           *   alteredByAdmin: 'false',
           *   createdDate: '04/18/2012 11:29 AM EDT',
           *   isGroupDashboard: false,
           *   isdefault: false,
           *   name: 'My Dashboard',
           *   user: {
           *     userId: 'testAdmin1',
           *   },
           *   createdBy: {
           *     userId: 'testAdmin1',
           *     userRealName: 'Test Admin 1'
           *   },
           *   editedDate: '04/18/2012 11:29 AM EDT',
           *   groups: [],
           *   description: 'This is my dashboard',
           *   guid: guid.util.guid(),
           * };
           *
           * Ozone.pref.PrefServer.cloneDashboard({
           *   json: dashboard,
           *   onSuccess: onSuccess,
           *   onFailure: onFailure
           * });
           */
          cloneDashboard : function (cfg){
              cfg.url = Ozone.util.contextPath()  + '/stack/addPage';
              cfg.method = 'POST';
              cfg.content = generateAppPostParamsJSON(cfg.json);
              setValueBase(cfg);
          },

          /**
           * @description Saves changes to existing dashboards
           * @param {Object} cfg config object see below for properties
           * @param {Array} cfg.viewsToUpdate array of JSON objects containing the view guid and data to be updated
           * @param {Array} cfg.viewGuidsToDelete array of guids of views to be deleted
           * @param {Boolean} cfg.updateOrder flag to update order
           * @param {Function} cfg.onSuccess callback function to capture the success result
           * @param {Function} [cfg.onFailure] callback to execute if there is an error (optional, a default alert provided)
           */
          updateAndDeleteDashboards : function (cfg){
              cfg.url = _url + "/dashboard";
              var postParams = {
                  '_method': 'PUT',
                  'viewsToUpdate': Ozone.util.toString(cfg.viewsToUpdate),
                  'viewGuidsToDelete': Ozone.util.toString(cfg.viewGuidsToDelete),
                  'updateOrder': cfg.updateOrder
              };

              cfg.method = 'POST';
              cfg.content = postParams;
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @description Deletes the dashboard with the specified id
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.dashboardId Unigue dashbard identifier
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback parameter is json representation of a Dashboard.
           * This method will be passed the dashboard object which has the following properties:<br>
           * <br>
           *     {Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     {Date} createdDate: date dashboard was created<br>
           *     {Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     {Boolean} isdefault: true if this is a default dashboard<br>
           *     {String} name: name of dashboard<br>
           *     {Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     {Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     {Date} editedDate: date dashboard was last edited<br>
           *     {Array} groups:  groups dashboard is assigned to<br>
           *     {String} description: description of dashboard<br>
           *     {String} guid: uniqued dashboard identifier<br>
           *     {String} layoutConfig: Holds the various containers and panes on a dashboard and the widgets inside of the panes, including the widget states.
           *     This parameter provides an EXT JS style configuration used to layout the supported pane types in an OWF dashboard along. Each
           *     internal definition can hold nested panes in an items array, widgets in a widgets array, and default values for those widgets in a defaultValues array.
           *     Panes can have the following parameters:<br>
           *     <ul style="list-style-type:none">
           *        <li>{String} xtype: container|accordionpane|desktoppane|fitpane|portalpane|tabbedpane|dashboardsplitter</li>
           *        <li>{Number} flex: 1 if for a pane; 3 for a container<li>
           *        <li>{String} htmlText: in pixels (e.g., 300px) or percent (e.g., 100%) or "variable"; valid if nested in a horizontally/vertically split pane</li>
           *        <li>{String} cls: left|right if nested in a horizontally split pane; top|bottom if nested in a vertically split pane; vbox|hbox if xtype is container</li>
           *        <li>{Array} items: an array of 2 nested pane configurations along with a possible dashboardspliiter for vbox and hbox containers; empty otherwise</li>
           *        <li>{String} paneType: accordionpane|desktoppane|fitpane|portalpane|tabbedpane; valid if xtype is not container</li>
           *        <li>{Array} layout: valid only for container xtype.  Includes the following elements:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} type: vbox|hbox</li>
           *           <li>{String} align: stretch</li>
           *        </ul>
           *        <li>{Array} widgets: array of widget state objects.  Each has the following properties:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} widgetGuid: unique widget identifier</li>
           *           <li>{Number} width: width of widget in pixels</li>
           *           <li>{Number} zIndex: in pixels</li>
           *           <li>{String} region: containing region on dashboard.  Dashboard type specific.</li>
           *           <li>{Boolean} pinned: true if widget is pinned open</li>
           *           <li>{String} buttonId: identifier of button that opens widget</li>
           *           <li>{Number} height: height of widget in pixels</li>
           *           <li>{Number} columnPos: position of widget in a column</li>
           *           <li>{String} name: widget name</li>
           *           <li>{Number} statePosition</li>
           *           <li>{Boolean} active: true if this widget is the active (has focus) widget</li>
           *           <li>{String} uniqueId: unique widget identifier on dashboard</li>
           *           <li>{Boolean} minimized: true if widget is minimized</li>
           *           <li>{Boolean} buttonOpened: true if button launched widget is opened</li>
           *           <li>{Boolean} collapsed: true if widget is collapsed</li>
           *           <li>{Number} y: y-axis position in pixels</li>
           *           <li>{Number} x: x-axis position in pixels</li>
           *           <li>{Boolean} maximized: true if widget is maximized</li>
           *        </ul>
           *        <li>{String} defaultSettings: JSON string of default settings which varies by pane type; not valid for containers</li>
           *     </ul>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(dashboard) {
           *     alert(dashboard.name);
           * };
           *
           * var onFailure = function(error) {
               *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.deleteDashboard({
           *     dashboardId:'917b4cd0-ecbd-410b-afd9-42d150c26426',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          deleteDashboard : function (cfg){
              cfg.url = _url + "/dashboard/" + cfg.dashboardId;
              deleteBase(cfg);
          },

          /**
           * @description Returns all dashboards for the logged in user.
           * @param {Object} cfg config object see below for properties
           * @param {Function} cfg.onSuccess Callback function to capture the success result.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {Boolean} success: true if dashboards found<br>
           *     {Number} results: number of dashboards found<br>
           *     {Array} data: array of dashboards objects found.  Dashboard object has the following properties:<br>
           *     <br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} alteredByAdmin: true if altered by an administrator<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Date} createdDate: date dashboard was created<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isGroupDashboard: true if dashboard is a group dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} isdefault: true if this is a default dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} name: name of dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Object} user: the dashoard owner.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Object} createdBy: dashboard creator.  Has the following properties:<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userId: unique user identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: user's name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Date} editedDate: date dashboard was last edited<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} groups:  groups dashboard is assigned to<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} description: description of dashboard<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} guid: uniqued dashboard identifier<br>
           *     {String} layoutConfig: Holds the various containers and panes on a dashboard and the widgets inside of the panes, including the widget states.
           *     This parameter provides an EXT JS style configuration used to layout the supported pane types in an OWF dashboard along. Each
           *     internal definition can hold nested panes in an items array, widgets in a widgets array, and default values for those widgets in a defaultValues array.
           *     Panes can have the following parameters:<br>
           *     <ul style="list-style-type:none">
           *        <li>{String} xtype: container|accordionpane|desktoppane|fitpane|portalpane|tabbedpane|dashboardsplitter</li>
           *        <li>{Number} flex: 1 if for a pane; 3 for a container<li>
           *        <li>{String} htmlText: in pixels (e.g., 300px) or percent (e.g., 100%) or "variable"; valid if nested in a horizontally/vertically split pane</li>
           *        <li>{String} cls: left|right if nested in a horizontally split pane; top|bottom if nested in a vertically split pane; vbox|hbox if xtype is container</li>
           *        <li>{Array} items: an array of 2 nested pane configurations along with a possible dashboardspliiter for vbox and hbox containers; empty otherwise</li>
           *        <li>{String} paneType: accordionpane|desktoppane|fitpane|portalpane|tabbedpane; valid if xtype is not container</li>
           *        <li>{Array} layout: valid only for container xtype.  Includes the following elements:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} type: vbox|hbox</li>
           *           <li>{String} align: stretch</li>
           *        </ul>
           *        <li>{Array} widgets: array of widget state objects.  Each has the following properties:</li>
           *        <ul style="list-style-type:none">
           *           <li>{String} widgetGuid: unique widget identifier</li>
           *           <li>{Number} width: width of widget in pixels</li>
           *           <li>{Number} zIndex: in pixels</li>
           *           <li>{String} region: containing region on dashboard.  Dashboard type specific.</li>
           *           <li>{Boolean} pinned: true if widget is pinned open</li>
           *           <li>{String} buttonId: identifier of button that opens widget</li>
           *           <li>{Number} height: height of widget in pixels</li>
           *           <li>{Number} columnPos: position of widget in a column</li>
           *           <li>{String} name: widget name</li>
           *           <li>{Number} statePosition</li>
           *           <li>{Boolean} active: true if this widget is the active (has focus) widget</li>
           *           <li>{String} uniqueId: unique widget identifier on dashboard</li>
           *           <li>{Boolean} minimized: true if widget is minimized</li>
           *           <li>{Boolean} buttonOpened: true if button launched widget is opened</li>
           *           <li>{Boolean} collapsed: true if widget is collapsed</li>
           *           <li>{Number} y: y-axis position in pixels</li>
           *           <li>{Number} x: x-axis position in pixels</li>
           *           <li>{Boolean} maximized: true if widget is maximized</li>
           *        </ul>
           *        <li>{String} defaultSettings: JSON string of default settings which varies by pane type; not valid for containers</li>
           *     </ul>
           *     <br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     alert(obj.results);
           *     if (obj.results > 0) {
           *         for (var i = 0; i < obj.results; i++) {
           *             alert(obj.data[i].name);
           *         }
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.findDashboards({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          findDashboards : function  (cfg){
              cfg.url = "dashboard";
              list(cfg);
          },

          /**
           * @deprecated Deprecated starting with OWF 7. Dashboards no longer have a specific type. This function is stubbed
           * to return success with 0 results until removal.
           * @description Returns all dashboards for the logged in user filtered by the type of dashboard.
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.type A string representing the type of dashboard. If using built in dashboard types, this would include desktop, tabbed, portal, and accordion.
           * @param {Function} cfg.onSuccess Callback function to capture the success result.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {Boolean} success: true if dashboards found<br>
           *     {Number} results: number of dashboards found<br>
           *     {Array} data: an empty array<br>
           *
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     alert(obj.results);
           *     if (obj.results > 0) {
           *         for (var i = 0; i < obj.results; i++) {
           *             alert(obj.data[i].name);
           *         }
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.findDashboardsByType({
           *     type:'desktop',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          findDashboardsByType : function (cfg){
              if (typeof cfg.onSuccess === 'function') {
                  var retVal = {
                          data: [],
                          results: 0,
                          success: true
                      };
                  cfg.onSuccess(retVal);
              }
          },

          /**
           * @description Gets the widget with the specified id
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.widgetId The guid of the widget.
           * @param {String} cfg.universalName The universal name for the widget.
           * @param {Function} cfg.onSuccess Callback function to capture the success result. Callback is passed the following object as a parameter: {id:Number, namespace:String, value:Object, path:String}
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {Number} id: database pk identifier<br>
           *     {String} namespace: "widget"<br>
           *     {Object} value: widget object having the following properties:<br>
           *     <br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} editable: true if widget can be edited<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} visible: true if widget is visible<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: widget owner identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: widget owner name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} namespace: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} url: url of widget application<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} headerIcon: url of widget header icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} image: url of widget image<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} smallIconUrl: url of widget's small icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} largeIconUrl: url of widget's large icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of the widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of the widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetVersion: widget version<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} definitionVisible: true if definition is visible<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} singleton: true if widget is a singleton<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} background: true if widget runs in the background<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} allRequired: array of all widgets required by this widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} directRequired: array of all widgets directly required by this widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} widgetTypes: array of widget types this widget belongs to<br>
           *     <br>
           *     {String} path: The guid of the widget.<br>
           * <br>
           * @param {Function} [cfg.onFailure] Callback to execute if there is an error (optional, a default alert provided). Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     if (obj.value) {
           *         alert(obj.value.namespace);
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.getWidget({
           *     widgetId:'ea5435cf-4021-4f2a-ba69-dde451d12551',
           *     widgetUuid: 'com.company.widget.name',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getWidget : function (cfg){
              cfg.url = _url + "/" + 'widget' + "/" + cfg.widgetId;
              if(cfg.universalName) {
                  cfg.url += '?universalName=' + cfg.universalName;
              }
              get(cfg);
          },

          /**
           * @description Gets all widgets for a given user.
           * @param {Object} cfg config object see below for properties
           * @param {Boolean} [cfg.userOnly] boolean flag that determines whether to only return widgets assigned to the user (excluding widgets to which the user only has access via their assigned groups)
           * @param {Object} [cfg.searchParams] object containing search parameters
           * @param {String} [cfg.searchParams.widgetName] name of widget '%' are wildcards
           * @param {String} [cfg.searchParams.widgetNameExactMatch] true or false to match the name exactly. defaults to false
           * @param {String} [cfg.searchParams.widgetVersion] version of widget '%' are wildcards
           * @param {String} [cfg.searchParams.widgetGuid] Guid of widget '%' are wildcards
           * @param {String} [cfg.searchParams.universalName] Universal name of widget '%' are wildcards
           * @param {Function} cfg.onSuccess callback function to capture the success result.
           * This method is passed an array of objects having the following properties:<br>
           * <br>
           *     {Number} id: database pk identifier<br>
           *     {String} namespace: "widget"<br>
           *     {Object} value: widget object having the following properties:<br>
           *     <br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} editable: true if widget can be edited<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} visible: true if widget is visible<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userId: widget owner identifier<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} userRealName: widget owner name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} namespace: widget name<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} url: url of widget application<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} headerIcon: url of widget header icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} image: url of widget image<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} smallIconUrl: url of widget's small icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} largeIconUrl: url of widget's large icon<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} width: width of the widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} height: height of the widget in pixels<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} x: x-axis position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Number} y: y-axis position<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} minimized: true if widget is minimized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} maximized: true if widget is maximized<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{String} widgetVersion: widget version<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} definitionVisible: true if definition is visible<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} singleton: true if widget is a singleton<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Boolean} background: true if widget runs in the background<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} allRequired: array of all widgets required by this widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} directRequired: array of all widgets directly required by this widget<br>
           *     &nbsp;&nbsp;&nbsp;&nbsp;{Array} widgetTypes: array of widget types this widget belongs to<br>
           *     <br>
           *     {String} path: The guid of the widget.<br>
           * <br>
           * @param {Function} [cfg.onFailure] callback to execute if there is an error (optional, a default alert provided).  This callback is called with two parameters: a error message string, and optionally a status code
           * @example
           *
           * var onSuccess = function(widgets) {
           *     if (widgets.length > 0) {
           *         alert(widgets[0].value.namespace);
           *     }
           * };
           *
           * var onFailure = function(error, status) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.findWidgets({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          findWidgets : function (cfg){

              cfg.url = _url + "/widget";
              if (!cfg.userOnly) {
                  cfg.url += "/listUserAndGroupWidgets";
              }

              // Add search params
              var postParams = {
                  '_method': 'GET'
              };

              if (cfg.searchParams) {
                  if (cfg.searchParams.widgetName && cfg.searchParams.widgetName.length > 0) {
                      var searchTerm = cfg.searchParams.widgetName;
                      if (!cfg.searchParams.widgetNameExactMatch) {
                          searchTerm = '%'+searchTerm+'%';
                      }
                      postParams['widgetName'] = searchTerm;
                  }
                  if (cfg.searchParams.widgetVersion && cfg.searchParams.widgetVersion.length > 0) {
                      postParams['widgetVersion'] = cfg.searchParams.widgetVersion;
                  }
                  if (cfg.searchParams.widgetGuid && cfg.searchParams.widgetGuid.length > 0) {
                      postParams['widgetGuid'] = cfg.searchParams.widgetGuid;
                  }
                  if (cfg.searchParams.universalName && cfg.searchParams.universalName.length > 0) {
                      postParams['universalName'] = cfg.searchParams.universalName;
                  }
                  if (cfg.searchParams.group_id) {
                      postParams['group_id'] = cfg.searchParams.group_id;
                  }
              }

              cfg.method = 'POST';
              cfg.content = postParams;
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @description Saves changes to existing widgets
           * @param {Object} cfg config object see below for properties
           * @param {Array} cfg.widgetsToUpdate array of JSON objects containing the widget guid and data to be updated
           * @param {Array} cfg.widgetGuidsToDelete array of guids of widgets to be deleted
           * @param {Boolean} cfg.updateOrder flag to update order
           * @param {Function} cfg.onSuccess callback function to capture the success result
           * @param {Function} [cfg.onFailure] callback to execute if there is an error (optional, a default alert provided)
           */
          updateAndDeleteWidgets : function (cfg){
              cfg.url = _url + "/widget";
              var postParams = {
                  '_method': 'PUT',
                  'widgetsToUpdate': Ozone.util.toString(cfg.widgetsToUpdate),
                  'widgetGuidsToDelete': Ozone.util.toString(cfg.widgetGuidsToDelete),
                  'updateOrder': cfg.updateOrder
              };

              cfg.method = 'POST';
              cfg.content = postParams;
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @description Retrieves the user preference for the provided name and namespace
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.namespace The namespace of the requested user preference
           * @param {String} cfg.name The name of the requested user preference
           * @param {Function} cfg.onSuccess The function to be called if the user preference is successfully retrieved from
           * the database.  This function takes a single argument, which is a JSON object.  If a preference is found, the
           * complete JSON structure as shown below will be returned.  If it is not found this function be passed an empty JSON object.
           * @example
           * The following is an example of a complete preference object passed to the onSuccess
           * function:
           * {
           *     "value":"true",
           *     "path":"militaryTime",
           *     "user":
           *     {
           *         "userId":"testAdmin1"
           *     },
           *     "namespace":"com.mycompany.AnnouncingClock"
           * }
           * @param {Function} [cfg.onFailure] This parameter is optional. If this function is not specified a default error
           * message will be displayed.This function is called if an error occurs on preference retrieval.  It is not
           * called if the preference is simply missing.
           * This function should accept two arguments:<br>
           * <br>
           * error: String<br>
           * The error message<br>
           * <br>
           * Status: The numeric HTTP Status code (if applicable)<br>
           * 401: You are not authorized to access this entity.<br>
           * 500: An unexpected error occurred.<br>
           * 404: The user preference was not found.<br>
           * 400: The requested entity failed to pass validation.<br>
           * @example
           * The following shows how to make a call to getUserPreference:
           * function onSuccess(pref){
           *     alert(Ozone.util.toString(pref.value));
           * }
           *
           * function onFailure(error,status){
           *     alert('Error ' + error);
           *     alert(status);
           * }
           *
           * // The following code calls getUserPreference with the above defined onSuccess and
           * // onFailure callbacks.
           * Ozone.pref.PrefServer.getUserPreference({
           *     namespace:'com.company.widget',
           *     name:'First President',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getUserPreference : function (cfg){
              cfg.url = _url + "/preference/" + cfg.namespace + "/" + cfg.name;

              //igonore 404 error code, onSuccess will be called with emtpy object payload
              cfg.ignoredErrorCodes = [404];
              get(cfg);
          },

          /**
           * @description Checks for the existence of a user preference for a given namespace and name
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.namespace The namespace of the requested user
           * @param {String} cfg.name The name of the requested user
           * @param {Function} cfg.onSuccess The callback function that is called if a preference successfully return from the database.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {Number} statusCode: status code<br>
           *     {Boolean} preferenceExist: true if preference exists<br>
           * <br>
           * @param {Function} [cfg.onFailure] The callback function that is called if there was
           * an error looking up the preference.  This function is <em>not</em> called
           * if the preference simply does not exist
           * @example
           *
           * var onSuccess = function(obj) {
           *     if (obj.statusCode = 200) {
           *         alert(obj.preferenceExist);
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.doesUserPreferenceExist({
           *     namespace:'foo.bar.0',
           *     name:'test path entry 0',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          doesUserPreferenceExist: function(cfg) {
              cfg.url = _url + "/hasPreference/" + cfg.namespace + "/" + cfg.name;
              get(cfg);
          },

          /**
           * @description retrieves the current user logged into the system
           * @param {Object} cfg config object see below for properties
           * @param {Function} cfg.onSuccess The callback function that is called for a successful retrieval of the user logged in.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {String} currentUserName: user name<br>
           *     {String} currentUser: user real name<br>
           *     {Date} currentUserPrevLogin: previous login date<br>
           *     {Number} currentId: database pk index<br>
           * <br>
           * @param {Function} cfg.[onFailure] The callback function that is called when the system is unable to retrieve the current user logged in. Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     if (obj) {
           *         alert(obj.currentUser);
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.getCurrentUser({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getCurrentUser: function(cfg) {
              cfg.url = _url + "/person/whoami";
              get(cfg);
          },

          /**
           * @description For retrieving the OWF system server version
           * @param {Object} cfg config object see below for properties
           * @param {Function} cfg.onSuccess The callback function that is called for successfully retrieving the server version of the OWF system.
           * This method is passed an object having the following properties:<br>
           * <br>
           *     {String} {serverVersion: server version<br>
           * <br>
           * @param {Function} [cfg.onFailure] The callback function that is called when the system fails to retrieve the server version of the OWF system. Callback parameter is an error string.
           * @example
           *
           * var onSuccess = function(obj) {
           *     if (obj) {
           *         alert(obj.serverVersion);
           *     }
           * };
           *
           * var onFailure = function(error) {
           *     alert(error);
           * };
           *
           * Ozone.pref.PrefServer.getServerVersion({
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          getServerVersion: function(cfg) {
              cfg.url = _url + "/server/resources";
              get(cfg);
          },

          /**
           * @description Creates or updates a user preference for the provided namespace and name.
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.namespace  The namespace of the user preference
           * @param {String} cfg.name The name of the user preference
           * @param {String} cfg.value  The value of the user preference. The value can be any string including JSON.
           * @param {Function} cfg.onSuccess The function to be called if the user preference is successfully updated in
           * the database.
       * @example
       * The following is an example of a complete preference object passed to the onSuccess
           * function:
       * {
       *     "value":"true",
       *     "path":"militaryTime",
       *     "user":
       *     {
       *         "userId":"testAdmin1"
       *     },
       *     "namespace":"com.mycompany.AnnouncingClock"
       * }
           * @param {Function} [cfg.onFailure] The function to be called if the user preference cannot be stored in the database.
           * If this function is not specified a default error message will be displayed. This function is passed
           * back the following parameters:<br>
           * <br>
           * error: String<br>
           * The error message<br>
           * <br>
           * Status: The HTTP Status code<br>
           * 401: You are not authorized to access this entity.<br>
           * 500: An unexpected error occurred.<br>
           * 404: The requested entity was not found.<br>
           * 400: The requested entity failed to pass validation.<br>
           * @example
           *
           * function onSuccess(pref){
           *     alert(pref.value);
           * }
           *
           * function onFailure(error,status){
           *     alert('Error ' + error);
           *     alert(status);
           * }
           *
           * var text = 'George Washington';
           * Ozone.pref.PrefServer.setUserPreference({
           *     namespace:'com.company.widget',
           *     name:'First President',
           *     value:text,
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          setUserPreference : function (cfg) {
              cfg.url = _url + "/preference/" + cfg.namespace + "/" + cfg.name;
              if (cfg.method == null) {
                  cfg.method = 'PUT';
              }
              cfg.content = {
                  '_method': cfg.method,
                  'value': cfg.value
              };

              if (cfg.onSuccess) {
                  if (!cfg.onFailure) {  //must ensure there is an onfailure method, as we using content
                      cfg.onFailure = function(err) {
                          alert(Ozone.util.ErrorMessageString.saveUserPreferences + " : " + err);
                      };
                  }
                  Ozone.util.Transport.send(cfg);
              } else {
                  Ozone.util.Transport.sendAndForget(cfg);
              }
          },

          /**
           * @description Deletes a user preference with the provided namespace and name.
           * @param {Object} cfg config object see below for properties
           * @param {String} cfg.namespace The namespace of the user preference
           * @param {String} cfg.name The name of the user preference
           * @param {Function} cfg.onSuccess The function to be called if the user preference is successfully deleted from the database.
           * @example
           * The following is an example of a complete preference object passed to the onSuccess
           * function:
           *
           * {
           *     "value":"true",
           *     "path":"militaryTime",
           *     "user":
           *     {
           *         "userId":"testAdmin1"
           *     },
           *     "namespace":"com.mycompany.AnnouncingClock"
           * }
           * @param {Function} [cfg.onFailure] The function to be called if the user preference cannot be deleted from the
           * database or if the preference does not exist. If this function is not specified a default error message will be
           * displayed. This function is passed back the following parameters: <br>
           * <br>
           * error: String <br>
           * The error message <br>
           * <br>
           * Status: The HTTP Status code<br>
           * <br>
           * 401: You are not authorized to access this entity.<br>
           * 500: An unexpected error occurred.<br>
           * 404: The user preference was not found.<br>
           * 400: The requested entity failed to pass validation. <br>
           * <br>
           * @example
           * function onSuccess(pref){
           *     alert(pref.value);
           * }
           *
           * function onFailure(error,status){
           *     alert('Error ' + error);
           *     alert(status);
           * }
           *
           * Ozone.pref.PrefServer.deleteUserPreference({
           *     namespace:'com.company.widget',
           *     name:'First President',
           *     onSuccess:onSuccess,
           *     onFailure:onFailure
           * });
           */
          deleteUserPreference : function (cfg){
              cfg.method = "DELETE";
              //igonore 404 error code, onSuccess will be called with null payload
              cfg.ignoredErrorCodes = [404];
              cfg.path = cfg.name;
              Ozone.pref.PrefServer.setUserPreference(cfg);
          },

          /**
           * @private
           */
          getDependentWidgets : function (cfg) {
              cfg.url = _url + '/widgetDefinition/dependents';
              cfg.method = 'POST';
              if (!cfg.content) { cfg.content = {}; }
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @private
           */
          getDependentPersonWidgets : function (cfg) {
              cfg.url = _url + '/personWidgetDefinition/dependents';
              cfg.method = 'POST';
              if (!cfg.content) { cfg.content = {}; }
              Ozone.util.Transport.send(cfg);
          },

          /**
           * @private
           */
          deleteWidgetDefs : function (cfg) {
              cfg.url = _url + '/widgetDefinition';
              cfg.method = 'DELETE';
              if (!cfg.content) { cfg.content = {}; }
              Ozone.util.Transport.send(cfg);
          }

      };
  };

  var configParams = Ozone.util.parseWindowNameData();
  var url = null;
  if (configParams != null && configParams.preferenceLocation != null) {
   url = configParams.preferenceLocation;
  }
  else {
    url = Ozone.config.prefsLocation;
  }

  Ozone.pref.PrefServer = Ozone.pref.PrefServer(url);
  if(url == null) {
    for (var fname in Ozone.pref.PrefServer)  {
      if (typeof Ozone.pref.PrefServer[fname] == 'function') {
        //dummyfy
        Ozone.pref.PrefServer[fname] = function(){};
      }
    }
  }
}(window, document));
