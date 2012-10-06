/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.dragAndDrop = Ozone.dragAndDrop ? Ozone.dragAndDrop : {};

/**
 * @deprecated Since OWF 3.7.0  You should use <a href="#.getInstance">Ozone.dragAndDrop.WidgetDragAndDrop.getInstance</a>
 * @constructor
 * @param {Object} cfg config object see below for properties
 * @param {Object} [cfg.widgetEventingController]  The widgetEventingController.
 * @param {Boolean} [cfg.autoInit]  True to automatically call init(), False otherwise.  The default is True if left undefined
 * @param {Object} [cfg.callbacks]  Object with callbacks who's names match drag and drop events.  Alternatively one could
 * use the <a href="#addCallback">addCallback</a> function
 * @description The Ozone.dragAndDrop.WidgetDragAndDrop object manages the drag and drop for an individual widget.
 * @requires owfdojo which is a custom version of dojo for OWF
 * @requires <a href="Ozone.eventing.Widget.html">Ozone.eventing.Widget</a> for eventing
 * @see <a href="#addCallback">addCallback</a>
 * @example
 *
 * var wdd = new Ozone.dragAndDrop.WidgetDragAndDrop({
 *                   widgetEventingController: this.widgetEventingController
 *               });
 *
 */
Ozone.dragAndDrop.WidgetDragAndDrop = function(cfg) {

    this.listeners = {};
    this.callbacks = {};
    this.dragging = false;
    this.dropEnabledFlag = false;
    this.dropZoneHandlers = [];

    cfg = cfg || {};

    //set initial drag text
    this.dragIndicatorText = cfg.dragIndicatorText ? cfg.dragIndicatorText : 'Dragging Data';

    if (cfg.callbacks != null && owfdojo.isObject(cfg.callbacks)) {
      owfdojo.mixin(this.callbacks, cfg.callbacks)
    }

    //create drag indicator
    this.dragIndicator = this.createDragIndicator();
    this.dragIndicatorTextNode = owfdojo.query('span.ddText', this.dragIndicator)[0];

    this.widgetEventingController = cfg.widgetEventingController || Ozone.eventing.Widget.instance;

    if (cfg.keepMouseListenersAttached === undefined && owfdojo.isIE) {
        cfg.keepMouseListenersAttached = true;
    }

    if (cfg.autoInit || cfg.autoInit === undefined) {
        this.init(cfg);
    }

    function fireMouseEvent(el, type, msg) {
        var evt;
        if(document.createEvent) {
            evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(type, true, true, window, 1, 
                msg.screenX, msg.screenY, msg.pageX, msg.pageY, 
                false, false, false, false, null, null
            );
            el.dispatchEvent(evt);
        } else if( document.createEventObject ) {
            evt = document.createEventObject();
            el.fireEvent('on' + type, evt);
        }
    }

    gadgets.rpc.register('_fire_mouse_move', owfdojo.hitch(this, function(msg) {

        var el = document.elementFromPoint(msg.pageX, msg.pageY);

        if(this.getFlashWidgetId()) {
            if(msg.sender !== this.widgetEventingController.getWidgetId()) {
                Ozone.util.getFlashApp().dispatchExternalMouseEvent(msg.pageX, msg.pageY);
            }
            this.mouseMove(msg, true);
        }
        else {
            if(!arguments.callee.lastEl) {
                arguments.callee.lastEl = el;
                fireMouseEvent(el, 'mouseover', msg);
            }
            else if(arguments.callee.lastEl !== el) {
                //console.log('lastEl ', arguments.callee.lastEl);
                //console.log('el ', el);
                fireMouseEvent(arguments.callee.lastEl, 'mouseout', msg);
                fireMouseEvent(el, 'mouseover', msg);
                arguments.callee.lastEl = el;
            }

            fireMouseEvent(el, 'mousemove', msg);
        }

    }));

    gadgets.rpc.register('_fire_mouse_up', owfdojo.hitch(this, function(msg) {
        var el = document.elementFromPoint(msg.pageX, msg.pageY);
        if(el && el.nodeName === 'OBJECT') {
            this.mouseUp(msg, true);
        }
        else {
            fireMouseEvent(el, 'mouseup', msg);
        }
    }));

    Ozone.dragAndDrop.WidgetDragAndDrop.instance = this;
    return this;
};

Ozone.dragAndDrop.WidgetDragAndDrop.prototype = {

  //public events
  /**
   * @field
   * @description dragStart is the name of the event when a drag is started.  Use 'dragStart' with the addCallback function
   * to add a callback function when a dragStart event occurs
   * @see <a href="#addCallback">addCallback</a>
   * @example
   *
   *  //this.wdd is a initialized WidgetDragAndDrop object
   *  this.wdd.addCallback('dragStart',function() {
   *    //use this function to change styles or change state when a drag is initiated
   *    cmp.dragging = true;
   *    cmp.getView().scroller.addCls('ddOver');
   *  });
   *
   */
  dragStart: 'dragStart',

  /**
   * @field
   * @description dragStop is the name of the event when a drag is stopped.  Use 'dragStop' with the addCallback function
   * to add a callback function when a dragStop event occurs
   * @see <a href="#addCallback">addCallback</a>
   * @example
   *
   *  //this.wdd is a initialized WidgetDragAndDrop object
   *  this.wdd.addCallback('dragStop',function() {
   *    //use this function to change styles or change state when a drag is stopped
   *    cmp.dragging = false;
   *    cmp.getView().scroller.removeCls('ddOver');
   *  });
   *
   */
  dragStop: 'dragStop',

  /**
   * @field
   * @description dropReceive is the name of the event when a drop occurs on this widget.  This event indicates a successful
   * drag and drop and data will be passed to the callback function.  Use 'dropReceive' with the addCallback function
   * to add a callback function when a dropReceive event occurs.  This callback function for this event will be called for
   * all successful drops.  To support multiple drop zones use <a href="#addDropZoneHandler">addDropZoneHandler</a>
   * @see <a href="#addCallback">addCallback</a>
   * @example
   *
   *  //this.wdd is a initialized WidgetDragAndDrop object
   *   this.wdd.addCallback('dropReceive',function(msg) {
   *      //msg.dragDropData contains the data - this example the data is a channel name that will be subscribed to
   *      this.subscribeToChannel(msg.dragDropData);
   *   }.bind(this));
   */
  dropReceive: 'dropReceive',

  //private events
  dragStartName: '_dragStart',
  dragOverWidgetName: '_dragOverWidget',
  dragOutName: '_dragOutName',
  dragStopInContainerName: '_dragStopInContainer',
  dragStopInWidgetName: '_dragStopInWidget',
  dragSendDataName: "_dragSendData",
  dropReceiveDataName: "_dropReceiveData",

  /**
   * @field
   * @description version number
   */
  version: Ozone.version.owfversion + Ozone.version.dragAndDrop,

  /**
   * @description Initializes the WidgetDragAndDrop object.  Using this function is only required if autoInit config is false
   * in the constructor.  This function is sometimes useful when it is necessary to defer drag and drop event handling after
   * creating the Ozone.dragAndDrop.WidgetDragAndDrop object
   * @param {Object} [cfg] config object
   * @see <a href="#constructor">constructor</a>
   */
  init : function (cfg) {
    cfg = cfg || {};

    //subscribe to channels
    this.widgetEventingController.subscribe(this.dragStartName, owfdojo.hitch(this, this.onStartDrag));
    this.widgetEventingController.subscribe(this.dragOutName, owfdojo.hitch(this, this.onDragOut));
    this.widgetEventingController.subscribe(this.dragStopInContainerName, owfdojo.hitch(this, this.onDragStopInContainer));
    this.widgetEventingController.subscribe(this.dropReceiveDataName, owfdojo.hitch(this, this.dropReceiveData));

    if (cfg.keepMouseListenersAttached === true) {
      this.keepMouseListenersAttached = true;

      //hook mouse move and mouse up
      if (this.listeners.onmousemove == null) {
        this.listeners.onmousemove = owfdojo.connect(document, 'onmousemove', this, this.mouseMove);
      }
      if (this.listeners.onmouseup == null) {
        this.listeners.onmouseup = owfdojo.connect(document, 'onmouseup', this, this.mouseUp);
      }
    }
  },

  /**
   * @private
   */
  createDragIndicator: function () {
    return owfdojo.create('span', {
      className: 'ddBox ddBoxCannotDrop',
      style: {display: 'none'},
      innerHTML: '<span class="ddText">' + this.dragIndicatorText + '</span>'
    },
    owfdojo.body()
    );
  },

  /**
   * @description Starts a drag.  The config object passed in describes the drag and contains the data to be passed to the drop.
   * @param {Object} cfg config object see below
   * @param {String} cfg.dragDropLabel Name to be used as text for the dragDrop indicator
   * @param {Object} cfg.dragDropData Data to be sent on a successful drag and drop.  This property is only sent to the
   * successful recipient of the drag (the dropReceive event).  It will not be sent for other events.
   * @param {Object} cfg.dragZone dom node which presents a dragZone which is associated with this drag.  This property is
   * only saved and used locally to the widget to identify whether a dragZone is in fact the node as a dropZone.  It will not be
   * sent to other events callbacks.
   * @param {Object} cfg.* other custom properties may be specified, these will be passed along to event handlers
   * @example
   *
   *  //add handler to text field for dragging
   *  owfdojo.connect(document.getElementById('dragSource'),'onmousedown',this,function(e) {
   *      e.preventDefault();
   *      var data = document.getElementById('InputChannel').value;
   *      if (data != null && data != '') {
   *        this.wdd.doStartDrag({
   *            dragDropLabel: data,
   *            dragZone:  document.getElementById('dragZone'),
   *            dragDropGroup: 'location',  //extra property to pass along
   *            dragDropData: data
   *        });
   *      }
   *  });
   */
  doStartDrag : function (cfg) {

    var dragStartCfg = {
      dragSourceId: this.widgetEventingController.getWidgetId()
    };

    this.dragZone = cfg.dragZone;

    //allow caller to pass extra properties to dragStart
    //be sure to not send the dragDropData
    owfdojo.mixin(dragStartCfg,cfg);
    delete dragStartCfg.dragDropData;
    delete dragStartCfg.dragZone;

    //start drag
    this.onStartDrag(this.widgetEventingController.getWidgetId(),dragStartCfg);

    //send message to start dragging for other widgets - unsubscribe so we don't repeat onstartdrag
    this.widgetEventingController.unsubscribe(this.dragStartName);
    this.widgetEventingController.publish(this.dragStartName, dragStartCfg);
    this.widgetEventingController.subscribe(this.dragStartName, owfdojo.hitch(this, this.onStartDrag));

    //send data to container
    this.widgetEventingController.publish(this.dragSendDataName, owfdojo.mixin({
      dragSourceId: this.widgetEventingController.getWidgetId()
    },cfg),'..');

  },

  /**
   * @private
   */
  onStartDrag : function(sender, msg) {

    this.dragging = true;

    this.dragStartData = msg;

    if (owfdojo.isFunction(this.callbacks[this.dragStart])) {
      //execute callback if false is returned don't continue
      if (this.callbacks[this.dragStart](sender,msg) === false) {
        this.dragging = false;
        return;
      }
    }

    //prevent IE bug where text is dragged instead of the node
    if (owfdojo.isIE) {
      document.onselectstart = function() {
        return false;
      };
      document.ondragstart = function () {
        return false;
      };
    }

    this.dragIndicatorText = msg.dragDropLabel;
    this.dragIndicatorTextNode.innerHTML = this.dragIndicatorText;

    //hook mouse move and mouse up
    if (this.listeners.onmousemove == null) {
      this.listeners.onmousemove = owfdojo.connect(document, 'onmousemove', this, this.mouseMove);
    }
    if (this.listeners.onmouseup == null) {
      this.listeners.onmouseup = owfdojo.connect(document, 'onmouseup', this, this.mouseUp);
    }
  },

  /**
   * @private
   */
  onDragOut : function(sender, msg) {
    owfdojo.style(this.dragIndicator, {
      display: 'none'
    });
  },

  /**
   * @private
   */
  getMouseCoordinates: function (e) {
    var returnValue = null;
    if (e.pageX || e.pageY) {
      returnValue = {
        x : e.pageX,
        y : e.pageY
      };
    }
    else {
      returnValue = {
        x : e.clientX + document.body.scrollLeft - document.body.clientLeft,
        y : e.clientY + document.body.scrollTop - document.body.clientTop
      };
    }
    return returnValue;
  },

    /**
    * @private
    */
    mouseMove : function (e, fake) {
        //only show the indicator if we are currenlty dragging
        if (this.dragging === true) {

            // if this is a flex widget, event is not faked and current dashboard layout is tabbed, fake 
            // mouse events as soon as the drag starts
            if(this.getFlashWidgetId() && fake !== true && Ozone.Widget.getDashboardLayout() === 'tabbed') {
                 gadgets.rpc.call('..', '_fake_mouse_move', null, {
                    sender: this.widgetEventingController.getWidgetId(),
                    pageX: e.pageX,
                    pageY: e.pageY,
                    screenX: e.screenX,
                    screenY: e.screenY
                });
                return;
            }

            var clientWidth = null;
            var clientHeight = null;
            var mousePosition = this.getMouseCoordinates(e);
            var leftWidth = mousePosition.x;
            var topHeight = mousePosition.y;

            // Hide the drag indicator box while we move it
            owfdojo.style(this.dragIndicator, {
                display: 'none'
            });

            if (e === undefined) {
                e = window.event;
            }

            if (owfdojo.isIE) {
                clientWidth = document.body.clientWidth;
                clientHeight = document.body.clientHeight;
            }
            else {
                clientWidth = window.innerWidth;
                clientHeight = window.innerHeight;
            }

            if((owfdojo.isFF && owfdojo.isFF >= 4) || this.getFlashWidgetId()) {

                if(e.clientX < 0 || e.clientX > clientWidth || 
                    e.clientY < 0 || e.clientY > clientHeight) {

                    // set variable on function to keep track if we faked an event
                    // so that we can fake mouseout later when mouseover the current widget
                    if(!arguments.callee._fakeEventCounter)
                        arguments.callee._fakeEventCounter = 1;
                    else
                        arguments.callee._fakeEventCounter += 1;
                    
                    gadgets.rpc.call('..', '_fake_mouse_move', null, {
                        sender: this.widgetEventingController.getWidgetId(),
                        pageX: e.pageX,
                        pageY: e.pageY,
                        screenX: e.screenX,
                        screenY: e.screenY
                    });
                    return;
                }
                else if( arguments.callee._fakeEventCounter ) {
                    // we had faked a mousemove event before
                    // now fake mouseout event on the container
                    arguments.callee._fakeEventCounter = null;
                    gadgets.rpc.call('..', '_fake_mouse_out');
                }
            }

            // flipping mechanism when the cursor reaches the right or bottom edge of the widget
            this.dragIndicator.style.top = topHeight + 19 + "px";

            var rightLimit = clientWidth - 100;
            if ((leftWidth < clientWidth) && (leftWidth > rightLimit)) {
                this.dragIndicator.style.left = leftWidth - 88 + "px";
            }
            else {
                this.dragIndicator.style.left = leftWidth + 12 + "px";
            }
            var bottomLimit = clientHeight - 40;
            if ((topHeight > bottomLimit) && (topHeight < clientHeight)) {
                this.dragIndicator.style.top = topHeight - 30 + "px";
            }

            // set text on indicator
            this.dragIndicatorTextNode.innerHTML = this.dragIndicatorText;
            owfdojo.style(this.dragIndicator, {
                display: 'block'
            });

        }
    },

  /**
   * @private
   */
  onDragStopInContainer : function(sender, msg) {
    owfdojo.style(this.dragIndicator, {
      display: 'none'
    });
    //disconnect listeners
    if (!this.keepMouseListenersAttached) {
      for (l in this.listeners) {
        owfdojo.disconnect(this.listeners[l]);
        this.listeners[l] = null;
      }
    }

    this.dragging = false;
    this.dragStartData = null;
    this.dragZone = null;
    this.setDropEnabled(false);

    if (owfdojo.isFunction(this.callbacks[this.dragStop])) {
      this.callbacks[this.dragStop](this.dropTarget);
    }
  },

  /**
   * @private
   */
  mouseUp : function (e, fake) {
    if (this.dragging === true) {
      this.dragging = false;

      //prevent IE bug where text is dragged instead of the node
      if (owfdojo.isIE) {
        document.onselectstart = function() {
          return true;
        };
        document.ondragstart = function () {
          return true;
        };
      }

      owfdojo.style(this.dragIndicator, {
        display: 'none'
      });

      if(this.getFlashWidgetId()) {

          var clientWidth = null;
          var clientHeight = null;
          if (owfdojo.isIE) {
              clientWidth = document.body.clientWidth;
              clientHeight = document.body.clientHeight;
          }
          else {
              clientWidth = window.innerWidth;
              clientHeight = window.innerHeight;
          }

          if((e.clientX < 0 || e.clientX > clientWidth || 
                e.clientY < 0 || e.clientY > clientHeight
                || Ozone.Widget.getDashboardLayout() === 'tabbed')
                && fake !== true) {
              
              gadgets.rpc.call('..', '_fake_mouse_up', null, {
                  sender: this.widgetEventingController.getWidgetId(),
                  pageX: e.pageX,
                  pageY: e.pageY,
                  screenX: e.screenX,
                  screenY: e.screenY
              });
              return;
          }
      }

      //disconnect listeners
      for (l in this.listeners) {
        owfdojo.disconnect(this.listeners[l]);
        this.listeners[l] = null;
      }

      //save dropzone info
      this.dropTarget = e.target;

      //send message
      this.widgetEventingController.publish(this.dragStopInWidgetName, this.widgetEventingController.getWidgetId());

  //    if (owfdojo.isFunction(this.callbacks[this.dragStop])) {
  //      this.callbacks[this.dragStop](this.dropTarget);
  //    }
      }
  },

  /**
   * @private
   */
  dropReceiveData : function (sender, msg, channel) {

    //only if the mouse is over a drop zone
    if (this.dropEnabledFlag) {
      if (this.dropTarget) {
        msg.dropTarget = this.dropTarget;

        //find if we have any dropzone handlers for the dropzone used and execute
        for (var i = 0; i < this.dropZoneHandlers.length; i++) {
          //match either on id or class or is target node a child of the dropZone
          //also make sure the dropZone is not the same as the dragZone
          if (((this.dropTarget.id == this.dropZoneHandlers[i].id && this.dropTarget.id != null)
                  || (owfdojo.hasClass(this.dropTarget, this.dropZoneHandlers[i].className))
                  || (owfdojo.isDescendant(this.dropTarget, this.dropZoneHandlers[i].dropZone)))
                  && this.dragZone != this.dropZoneHandlers[i].dropZone
                  ) {
            this.dropZoneHandlers[i].handler(msg);
          }
        }

        //clear dropTarget because the drop is over
        this.dropTarget = null;
      }

      //notify that a drop has happened and send the data
      if (owfdojo.isFunction(this.callbacks[this.dropReceive])) {
        this.callbacks[this.dropReceive](msg);
      }
    }
  },

  /**
   * @description Adds a function as a callback to Drag and Drop events.  This function supports multiple callbacks for
   * the same event by allowing the user call it more than once with different callback functions
   * @param {String} eventName The event name.
   * @param {Function} cb The function to execute as a callback.
   * @see <a href="#dragStart">dragStart Event</a> -
   * the callback for the dragStart event is called with the same config object used in the <a href="#doStartDrag">doStartDrag</a> function
   * with the exception of the dragDropData and the dragZone properties.
   * @see <a href="#dragStop">dragStop Event</a> -
   * If the drag stopped in the same widget that started the drag the callback for dragStop will be called with the dropTarget
   * HTML node otherwise the first argument will be null.
   * @see <a href="#dropReceive">dropReceive Event</a> -
   * the callback for the dropReceive event is called for any drop that occurs on a widget.  If one has multiple dropZones
   * in a widget it is easier to use <a href="#addDropZoneHandler">addDropZoneHandler</a>
   * @example
   * //example dragStart handler which highlights an Ext Grid when a drag occurs
   * this.wdd.addCallback('dragStart', (function(sender, msg){
   *      //get the Ext Grid
   *      var grid = this.getComponent(this.gridId);
   *
   *      //check custom dragDropGroup property to see if the drag is meant for this grid
   *      //if so highlight the grid by adding the ddOver class
   *      if (grid && msg != null && msg.dragDropGroup == 'users') {
   *          grid.getView().scroller.addClass('ddOver');
   *      }
   *  }).createDelegate(this));  //createDelegate is an Ext function which sets the scope
   *
   *  //this.wdd is a initialized WidgetDragAndDrop object
   *   this.wdd.addCallback('dropReceive',owfdojo.hitch(this,function(msg) {
   *      //msg.dragDropData contains the data
   *      //this example the data is a channel name that will be subscribed to
   *      this.subscribeToChannel(msg.dragDropData);
   *   }));
   */
  addCallback : function(eventName, cb) {

    if (this.callbacks[eventName] == null) {
      //put dummy function in
      this.callbacks[eventName] = cb;
    }
    else {
      //callback already exists chain the subsequent callbacks to the first
      owfdojo.connect(this.callbacks,eventName,cb);
    }
  },
  /**
   * @description Adds a new drop zone to be managed.  The handler function defined in the cfg object will be called when
   * a drop occurs over a dom node which matches the id or the className or is equal to or a child of the dropTarget node
   * @see doStartDrag
   * @param {Object} cfg config object see below
   * @param {className} cfg.class class of the dropZone
   * @param {String} cfg.id Id of the dropZone
   * @param {Node} cfg.dropZone HTML node which represents the dropZone
   * @param {Function} cfg.handler function to be called when a drop occurs over the dropZone.  A msg object will be passed in
   *
   * @example
   * //Example cfg Object
   * {
   *  id: 'mygrid-1',
   *  className: 'mygridClass',
   *  dropZone: document.getElementById('dropZone'),
   *  handler: function(msg) {
   *    //some code here to handle the msg and respond
   *  }
   * }
   *
   * //Example usage of addDropZoneHandler which handles a drop that occurs over an Ext Grid and inserts new data into
   * //that grid based on the dragged data
   * //this.wdd is the WidgetDragAndDrop Object
   * this.wdd.addDropZoneHandler({
   *   //dom node of an Ext grid
   *   dropZone:grid.getView().scroller.dom,
   *
   *   //this function is called only when a drop occurs over the grid (i.e. the mouse was released over the grid)
   *   handler: (function(msg){
   *
   *     var store = grid.getStore();
   *     var processedSelections = [];
   *     var errorMsg = null;
   *
   *     //loop through msg.dragDropData which is an array and check for dupes versus the destination store
   *     for (var i = 0; i < msg.dragDropData.length; i++) {
   *       //get data for one possible new record in the dragDropData
   *       var recData = msg.dragDropData[i];
   *
   *       //is it already in the dest Ext Store?
   *       if (store.findExact('id',recData.id) >= 0) {
   *         //found the record already in the store
   *       }
   *       else {
   *         //add new record based on the dragDropData
   *         var newRec = new store.recordType(recData);
   *         //calling an external function to decide whether to add the new rec
   *         var rs = displayPanel.validateRecordOnAdd(newRec);
   *         if (rs.success) {
   *           processedSelections.push(newRec);
   *         }
   *         else {
   *           errorMsg = rs.msg;
   *         }
   *       }
   *     }
   *
   *     if (errorMsg) {
   *       Ext.Msg.alert('Error', errorMsg);
   *     }
   *
   *     //actually insert into the store which adds it the new recs to the grid
   *     if (processedSelections.length > 0) {
   *       store.insert(0, processedSelections);
   *     }
   *
   * }).createDelegate(grid)});   //createDelegate is an Ext function which sets the scope of the callback
   *
   *
   */
  addDropZoneHandler: function(cfg) {
    this.dropZoneHandlers.push(cfg)
  },
  /**
   * @description returns whether the a drop is enabled (this is only true when the mouse is over a drop zone)
   */
  getDropEnabled : function() {
    return this.dropEnabledFlag;
  },

  /**
   * @description returns whether a drag is in progress
   */
  isDragging : function() {
    return this.dragging;
  },

  /**
   * @description returns data sent when a drag was started
   */
  getDragStartData : function() {
    return owfdojo.mixin(this.dragStartData,{dragZone:this.dragZone});
  },

  /**
   * @description toggles the dragIndicator to indicate successful or unsuccessful drop
   * @param {Boolean} dropEnabled true to enable a drop, false to indicate a unsuccessful drop
   * @example
   *
   *  //attach mouseover callback to a particular area. If the mouse is here allow a drop
   *  cmp.getView().scroller.on('mouseover',function(e,t,o) {
   *    if (cmp.dragging) {
   *      this.wdd.setDropEnabled(true);
   *    }
   *  },this);
   *
   *  //attach a mouse out callback to a particular area. If the mouse leaves disable drop
   *  cmp.getView().scroller.on('mouseout',function(e,t,o) {
   *    if (cmp.dragging) {
   *      this.wdd.setDropEnabled(false);
   *    }
   *  },this);
   */
  setDropEnabled : function(dropEnabled) {
    if (dropEnabled) {
      this.dropEnabledFlag = true;
      owfdojo.removeClass(this.dragIndicator, 'ddBoxCannotDrop');
      owfdojo.addClass(this.dragIndicator, 'ddBoxCanDrop');
    }
    else {
      this.dropEnabledFlag = false;
      owfdojo.removeClass(this.dragIndicator, 'ddBoxCanDrop');
      owfdojo.addClass(this.dragIndicator, 'ddBoxCannotDrop');
    }
  },

  setFlashWidgetId: function(id) {
    this.flashWidgetId = id;
  },

  getFlashWidgetId: function(id) {
    return this.flashWidgetId;
  }
};

/**
 * @description Retrieves Ozone.dragAndDrop.WidgetDragAndDrop Singleton instance. Manages the drag and drop for an individual widget.
 * @param {Object} cfg config object see below for properties
 * @param {Object} [cfg.widgetEventingController]  The widgetEventingController
 * @param {Boolean} [cfg.autoInit]  True to automatically call init(), False otherwise.  The default is True if left undefined
 * @param {Object} [cfg.callbacks]  Object with callbacks who's names match drag and drop events.  Alternatively one could
 * use the <a href="#addCallback">addCallback</a> function
 * @requires owfdojo which is a custom version of dojo for OWF
 * @requires <a href="Ozone.eventing.Widget.html">Ozone.eventing.Widget</a> for eventing
 * @see <a href="#addCallback">addCallback</a>
 * @example
 *
 * var wdd = Ozone.dragAndDrop.WidgetDragAndDrop.getInstance({
 *                   widgetEventingController: this.widgetEventingController
 *               });
 *
 */
Ozone.dragAndDrop.WidgetDragAndDrop.getInstance = function(cfg) {
  if (Ozone.dragAndDrop.WidgetDragAndDrop.instance == null) {
    Ozone.dragAndDrop.WidgetDragAndDrop.instance = new Ozone.dragAndDrop.WidgetDragAndDrop(cfg);
  }
  return owfdojo.mixin(Ozone.dragAndDrop.WidgetDragAndDrop.instance, cfg);
};

