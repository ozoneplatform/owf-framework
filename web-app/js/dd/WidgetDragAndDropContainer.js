/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.dragAndDrop = Ozone.dragAndDrop ? Ozone.dragAndDrop : {};

Ozone.dragAndDrop.WidgetDragAndDropContainer = function(cfg) {

    this.callback = cfg.callback;

    //set initial drag text
    this.dragIndicatorText = cfg.dragIndicatorText ? cfg.dragIndicatorText : 'Dragging Data';

    //create drag indicator
    this.dragIndicator = this.createDragIndicator();
    this.dragIndicatorTextNode = owfdojo.query('span.ddText',this.dragIndicator)[0];

    //subscribe to channels
    this.eventingContainer = cfg.eventingContainer;
    this.eventingContainer.subscribe(this.dragStartName, owfdojo.hitch(this, this.onStartDrag));
    this.eventingContainer.subscribe(this.dragStopInWidgetName, owfdojo.hitch(this, this.onDragStopInWidget));
    this.eventingContainer.subscribe(this.dragSendDataName, owfdojo.hitch(this, this.onDragSendData));

    //hook mouse move and mouse up
    this.listeners = {};

    this.callbacks = {};

    var lastEl;

    function fireMouseEvent(el, type, msg) {
        var evt;
        if(document.createEvent) {
            evt = document.createEvent('MouseEvents');
            evt.initMouseEvent(type, true, true, window, 1, 
                msg.screenX, msg.screenY, msg.pageX, msg.pageY, 
                false, false, false, false, null, null
            );
            el.dispatchEvent(evt);
        }
        else if(document.createEventObject) {
            evt = document.createEventObject();
            el.fireEvent('on' + type, evt);
        }
    }

    gadgets.rpc.register('_fake_mouse_move', owfdojo.hitch(this, function(msg) {
        var senderObj = gadgets.json.parse(msg.sender);
        var iframeId = gadgets.json.stringify({id:senderObj.id});
        var position = Ext.get(iframeId).getOffsetsTo(Ext.getBody());
        var el = document.elementFromPoint(position[0]+msg.pageX, position[1]+msg.pageY);

        // convert widget pageX and pageY to container pageX and pageY
        msg.pageX += position[0];
        msg.pageY += position[1];

        if(lastEl && lastEl !== el) {
            if(lastEl.nodeName === 'IFRAME') {
                this.eventingContainer.publish(this.dragOutName, null, lastEl.id);
            }
            else {
                fireMouseEvent(lastEl, 'mouseout', msg);
                fireMouseEvent(el, 'mouseover', msg);
            }
        }
        if(el && el.nodeName === 'IFRAME') {
            var elPos = Ext.get(el.id).getOffsetsTo(Ext.getBody());

            // convert container pageX and pageY to sending widget's pageX and pageY to 
            msg.pageX -= elPos[0];
            msg.pageY -= elPos[1];

            gadgets.rpc.call(el.id, '_fire_mouse_move', null, msg);
            this.hideDragIndicator();
        }
        else if(el){
            fireMouseEvent(el, 'mousemove', msg);
        }
        // update lastEl
        lastEl = el;
    }));

    gadgets.rpc.register('_fake_mouse_out', owfdojo.hitch(this, this.hideDragIndicator));

    gadgets.rpc.register('_fake_mouse_up', owfdojo.hitch(this, function(msg) {
        var senderObj = gadgets.json.parse(msg.sender);
        var iframeId = gadgets.json.stringify({id:senderObj.id});
        var position = Ext.get(iframeId).getOffsetsTo(Ext.getBody());
        var el = document.elementFromPoint(position[0]+msg.pageX, position[1]+msg.pageY);

        msg.pageX += position[0];
        msg.pageY += position[1];

        if(el.nodeName === 'IFRAME') {
            var elPos = Ext.get(el.id).getOffsetsTo(Ext.getBody())
            msg.pageX -= elPos[0];
            msg.pageY -= elPos[1];
            gadgets.rpc.call(el.id, '_fire_mouse_up', null, msg);
        }
        else {
            fireMouseEvent(el, 'mouseup', msg);
        }
        lastEl = null;
    }));
};

Ozone.dragAndDrop.WidgetDragAndDropContainer.prototype = {

  //public events
  dragStart: 'dragStart',
  dragStop: 'dragStop',
  dropReceive: 'dropReceive',

  //private events
  dragStartName: '_dragStart',
  dragOverWidgetName: '_dragOverWidget',  
  dragOutName: '_dragOutName',
  dragStopInContainerName: '_dragStopInContainer',
  dragStopInWidgetName: '_dragStopInWidget',
  dragSendDataName: "_dragSendData",
  dropReceiveDataName: "_dropReceiveData",
  version: Ozone.version.owfversion + Ozone.version.dragAndDrop,
  dragDropData: null,


  createDragIndicator: function () {
    return owfdojo.create('span', {
      className: 'ddBox ddBoxCannotDrop',
      style: 'display: none',
      innerHTML: '<span class="ddText">' + this.dragIndicatorText + '</span>'
    },
    owfdojo.body()
    );
  },

  onStartDrag : function(sender, msg) {
    this.dragging = true;

    if (owfdojo.isFunction(this.callbacks[this.dragStart])) {
      //execute callback if false is returned don't continue
      if (this.callbacks[this.dragStart](sender,msg) === false) {
        return;
      }
    }

    this.dragIndicatorText = msg.dragDropLabel;

    if (this.listeners.onmousemove == null) {
        this.listeners.onmousemove = owfdojo.connect(document, 'onmousemove', this, this.mouseMove);
    }
    if (this.listeners.onmouseup == null) {
      this.listeners.onmouseup = owfdojo.connect(document, 'onmouseup', this, this.mouseUp);
    }
    if (this.listeners.onmouseout == null) {
      this.listeners.onmouseout = owfdojo.connect(document, 'onmouseout', this, this.mouseOut);
    }
  },

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

  mouseMove : function(e) {
    var clientWidth = null;
    var clientHeight = null;
    var mousePosition = this.getMouseCoordinates(e);
    var leftWidth = mousePosition.x;
    var topHeight = mousePosition.y;

    // Hide the drag indicator box while we move it
    this.hideDragIndicator();

    if (e === undefined) {
      e = window.event;
    }

    // flipping mechanism when the cursor reaches the right or bottom edge of the widget
    this.dragIndicator.style.top = topHeight + 19 + "px";
    if (owfdojo.isIE) {
      clientWidth = document.body.clientWidth;
      clientHeight = document.body.clientHeight;
    }
    else {
      clientWidth = window.innerWidth;
      clientHeight = window.innerHeight;
    }

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
  },

  onDragStopInWidget : function(sender, msg) {
    this.hideDragIndicator();

    //disconnect listeners
    for (l in this.listeners) {
      owfdojo.disconnect(this.listeners[l]);
      this.listeners[l] = null;
    }

    //actually send data
    this.eventingContainer.publish(this.dropReceiveDataName, this.dragDropData,sender);
    // Publish event to let widgets know that the mouse button was released
    this.eventingContainer.publish(this.dragStopInContainerName, null);

    this.dragging = false;

    if (owfdojo.isFunction(this.callbacks[this.dragStop])) {
      //execute callback if false is returned don't continue
      this.callbacks[this.dragStop](msg);
    }
  },

  mouseUp: function() {
    this.hideDragIndicator();

    //disconnect listeners
    for (l in this.listeners) {
      owfdojo.disconnect(this.listeners[l]);
      this.listeners[l] = null;
    }

    // Publish event to let widgets know that the mouse button was released
    this.eventingContainer.publish(this.dragStopInContainerName, null);

    this.dragging = false;

    if (owfdojo.isFunction(this.callbacks[this.dragStop])) {
      //execute callback if false is returned don't continue
      this.callbacks[this.dragStop]();
    }
  },

  mouseOut : function(e) {
    if (e === undefined) {
      e = window.event;
    }
    var mouseOutTarget = null;
    if (e.toElement === undefined) {
      mouseOutTarget = e.relatedTarget;
    }
    else {
      mouseOutTarget = e.toElement;
    }
    if (mouseOutTarget) {

      this.hideDragIndicator();

      // Mouse cursor is moving into the desktop or another widget,
      //  so we send an event informing widgets of this
      this.eventingContainer.publish(this.dragOutName, null);
    }
  },

  onDragSendData: function(sender,data) {
     this.dragDropData = data;
  },

  addCallback : function(eventName, cb) {
    this.callbacks[eventName] = cb;
  },

  /**
   * @description returns whether a drag is in progress
   */
  isDragging : function() {
    return this.dragging;
  },

    hideDragIndicator: function() {
        owfdojo.style(this.dragIndicator, {
            display: 'none'
        });
    }
};
