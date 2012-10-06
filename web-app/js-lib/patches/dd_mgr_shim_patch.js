/**
*
*	Patch for adding a drag and drop shim to the DragDropMgr Singleton.  This will help with items that are dragged over problem
*   areas on the page such as iframes.
*
*   Usage: Include this file after the ext js files but before any user defined files that make use
*   of the ext drag and drop functionality.
*   Add the following to your file:
*   Ext.dd.DragDropMgr.useShim = true;
*
*   By default the shim is not used.  This shim covers the entire viewport region passing mouse event back the manager.
*
*   For debugging add the following:
*   Ext.dd.DragDropMgr._debugShim = true;
*
*   This will color the background shim red.  Logging has not been enabled for this functionality.
*
*/

/**
* This property is used to turn on global use of the shim element on all DragDrop instances, defaults to false for backcompat. (Use: YAHOO.util.DDM.useShim = true)
* @property useShim
* @type Boolean
* @static
*/
Ext.dd.DragDropMgr.useShim = false;
/**
* This property is used to determine if the shim is active over the screen, default false.
* @private
* @property _shimActive
* @type Boolean
* @static
*/
Ext.dd.DragDropMgr._shimActive = false;
/**
* This property is used when useShim is set on a DragDrop object to store the current state of DDM.useShim so it can be reset when a drag operation is done.
* @private
* @property _shimState
* @type Boolean
* @static
*/
Ext.dd.DragDropMgr._shimState = false;
/**
* This property is used when useShim is set to true, it will set the opacity on the shim to .5 for debugging. Use: (YAHOO.util.DDM._debugShim = true;)
* @private
* @property _debugShim
* @type Boolean
* @static
*/
Ext.dd.DragDropMgr._debugShim = false;
/**
* This method will create a shim element (giving it the id of ext-ddm-shim), it also attaches the mousemove and mouseup listeners to it and attaches a scroll listener on the window
* @private
* @method _sizeShim
* @static
*/
Ext.dd.DragDropMgr._createShim = function() {
	var s = document.createElement('div');
	s.id = 'ext-ddm-shim';
	if (document.body.firstChild) {
		document.body.insertBefore(s, document.body.firstChild);
	} else {
		document.body.appendChild(s);
	}
	s.style.display = 'none';
	s.style.backgroundColor = 'red';
	s.style.position = 'absolute';
	s.style.zIndex = '9999999';
	new Ext.Element(s.id).setOpacity(0);
	this._shim = s;
	Ext.EventManager.on(s, "mouseup",   this.handleMouseUp, this);
	Ext.EventManager.on(s, "mousemove", this.handleMouseMove, this);
	Ext.EventManager.on(window, 'scroll', this._sizeShim, this);
};
/**
* This method will size the shim, called from activate and on window scroll event
* @private
* @method _sizeShim
* @static
*/
Ext.dd.DragDropMgr._sizeShim = function() {
	if (this._shimActive) {
		var s = this._shim;
		s.style.height = Ext.lib.Dom.getDocumentHeight() + 'px';
		s.style.width = Ext.lib.Dom.getDocumentWidth() + 'px';
		s.style.top = '0';
		s.style.left = '0';
	}
};
/**
* This method will create the shim element if needed, then show the shim element, size the element and set the _shimActive property to true
* @private
* @method _activateShim
* @static
*/
Ext.dd.DragDropMgr._activateShim = function() {
	if (this.useShim) {
		if (!this._shim) {
			this._createShim();
		}
		this._shimActive = true;
		var s = this._shim,
			o = 0;
		if (this._debugShim) {
			o = .5;
		}
		new Ext.Element(s.id).setOpacity(o);		
		this._sizeShim();
		s.style.display = 'block';
	}
};
/**
* This method will hide the shim element and set the _shimActive property to false
* @private
* @method _deactivateShim
* @static
*/
Ext.dd.DragDropMgr._deactivateShim = function() {	
	this._shim.style.display = 'none';
	this._shimActive = false;
};
/**
* The HTML element created to use as a shim over the document to track mouse movements
* @private
* @property _shim
* @type HTMLElement
* @static
*/
Ext.dd.DragDropMgr._shim = null;

/**
 * Fired when either the drag pixel threshold or the mousedown hold 
 * time threshold has been met.
 * @method startDrag
 * @param x {int} the X position of the original mousedown
 * @param y {int} the Y position of the original mousedown
 * @static
 */
Ext.dd.DragDropMgr.startDrag = function(x, y) {
	if (this.dragCurrent.useShim) {
		this._shimState = this.useShim;
		this.useShim = true;
	}
	this._activateShim();      

	clearTimeout(this.clickTimeout);
	if (this.dragCurrent) {
		this.dragCurrent.b4StartDrag(x, y);
		this.dragCurrent.startDrag(x, y);
	}
	this.dragThreshMet = true;
};

/** 
 * Ends the current drag, cleans up the state, and fires the endDrag
 * and mouseUp events.  Called internally when a mouseup is detected
 * during the drag.  Can be fired manually during the drag by passing
 * either another event (such as the mousemove event received in onDrag)
 * or a fake event with pageX and pageY defined (so that endDrag and
 * onMouseUp have usable position data.).  Alternatively, pass true
 * for the silent parameter so that the endDrag and onMouseUp events
 * are skipped (so no event data is needed.)
 *
 * @method stopDrag
 * @param {Event} e the mouseup event, another event (or a fake event) 
 *                  with pageX and pageY defined, or nothing if the 
 *                  silent parameter is true
 * @param {boolean} silent skips the enddrag and mouseup events if true
 * @static
 */
Ext.dd.DragDropMgr.stopDrag = function(e, silent) {
	// Fire the drag end event for the item that was dragged
	if (this.dragCurrent) {
		if (this.dragThreshMet) {
			this.dragCurrent.b4EndDrag(e);
			this.dragCurrent.endDrag(e);
		}

		this.dragCurrent.onMouseUp(e);
	}

	if (this._shimActive) {
		this._deactivateShim();
		if (this.dragCurrent.useShim) {
			this.useShim = this._shimState;
			this._shimState = false;
		}
	}

	this.dragCurrent = null;
	this.dragOvers = {};
};


