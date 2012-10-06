Ext.ns('Ext.ux.window'); 

/**
 * @class Ext.ux.window.MessageWindowGroup
 * @extends Ext.WindowGroup
 * An object that represents a group of {@link Ext.ux.window.MessageWindow} instances
 * and provides position management in addition to the standard Window Group features.
 * @constructor
 */
Ext.ux.window.MessageWindowGroup = function (config) {
    config = config || {};
    var mgr = new Ext.WindowGroup();
    mgr.positions = [];
    Ext.apply(mgr, config);
    return mgr;
};

/**
 * @class Ext.ux.window.MessageWindowMgr
 * @extends Ext.ux.window.MessageWindowGroup
 * The default global Message Window group that is available automatically.  To have
 * more than one group of Message Windows to utilize separate positioning in addition
 * to the standard Window Manager features create additional instances of 
 * {@link Ext.ux.window.MessageWindowGroup} as needed.
 * @singleton
 */
Ext.ux.window.MessageWindowMgr = Ext.ux.window.MessageWindowGroup(); 

/**
 * @class Ext.ux.window.MessageWindow
 * @extends Ext.Window
 * <p>If you are looking for a lightweight implementation of Toast or Notification windows this is
 * <b>NOT</b> the class you want.  This class builds upon the implementation by <i>Edouard Fattal</i>.
 * This class creates a specialized Window for notification messages and offers the following features:</p>
 * 
 * <br>Demo link: <a href="http://extjs-ux.org/repo/authors/mjlecomte/trunk/Ext/ux/window/msgWindow.html">here</a>
 * <br>Forum thread: <a href="http://extjs.com/forum/showthread.php?t=48135">here</a><br>
 * 
 * <b>Features:</b>
 * <ul>
 * <li>+ Message windows may be bound to any element through configuration.</li>
 * <li>+ A single Message Window may be reused or multiple Message Windows may be used simultaneously.</li>
 * <li>+ Message windows can be managed by groups.</li>
 * <li>+ Several configurable options.</li>
 * <li>++ By default, Message Window will not steal focus.</li>
 * </ul>
 * <br>
 * <b>Known issues/caveats/bugs/roadmap:</b>
 * <ul>
 * <li>+ config for custom showFx incomplete </li>
 * <li>+ vertical location of subsequent windows may overlap if height changes.</li>
 * <li>+ add config to limit drag options (for example lock x or y axis, etc.)</li>
 * </ul>
 * @author Michael LeComte (<a href="http://extjs.com/forum/member.php?u=6834">mjlecomte</a>), inspired by Ext.ux.Notification\ToastWindow (Edouard Fattal)
 * @license <a href="http://www.gnu.org/licenses/lgpl.html">LGPL 3.0</a>
 * @version 0.3 - April 20, 2009
 */
Ext.ux.window.MessageWindow = Ext.extend(Ext.Window, {

    /**
     * @cfg {String} hideAction
     * The action to take after the message window has been hidden. The default is <tt>'close'</tt> which
     * will close() the window. The other supported value is <tt>'hide'</tt> which will keep the window
     * available to be redisplayed via the {@link #show} method.
     */
    hideAction: 'close',

    /**
     * @cfg {Boolean} autoHide
     * {@link #autoHide}
     * True to have message window automatically hide itself (defaults to true).
     */
    autoHide: true,

    /**
     * @cfg {Boolean} autoHeight
     * True to use height:'auto', false to use fixed height (defaults to false).
     */
    autoHeight: false,
			
    /**
     * @cfg {String} bodyStyle
     * Custom CSS styles to be applied to the body element in the format expected by 
     * Ext.Element.applyStyles (defaults to 'text-align:left;padding:10px;').
     */
    bodyStyle: 'text-align:left;padding:10px;',

    /**
    * @cfg {String} baseCls
    * The base CSS class to apply to this panel's element (defaults to 'x-window').
    */

    /**
     * @cfg {String} buttonAlign
     * The alignment of any buttons added to this panel. Valid values are 'right', 'left',
     * and 'center' (defaults to 'center').
     */
    buttonAlign: 'center',

    /**
     * @cfg {String} cls
     * An optional extra CSS class that will be added to this component's Element (defaults
     * to 'x-notification'). This can be useful for adding customized styles to the component
     * or any of its children using standard CSS rules.
     */
    cls: 'confirmationDialog',

    /**
     * @cfg {Boolean} constrain
     * True to constrain the window to the viewport, false to allow it to fall outside of
     * the viewport (defaults to true).  Optionally the header only can be constrained using
     * {@link #constrainHeader}.
     */
    constrain: true,

    /**
     * @cfg {Boolean} constrainHeader
     * True to constrain the window header to the viewport, allowing the window body to fall
     * outside of the viewport, false to allow the header to fall outside the viewport (defaults
     * to true).  Optionally the entire window can be constrained using {@link #constrain}.
     */
    constrainHeader: true,

    /**
     * @cfg {Boolean} draggable
     * True to allow the window to be dragged by the header bar, false to disable dragging
     * (defaults to true).  Note that by default the window will be centered in the viewport,
     * so if dragging is disabled the window may need to be positioned programmatically after
     * render (e.g., myWindow.setPosition(100, 100);).
     */
    draggable: true,

    /** @cfg {Boolean} floating */
    /** @private */
    floating: true,

    /**
     * @cfg {Boolean} focusOnShow
     * True to focus the window when shown (defaults to false).
     */

    /** @cfg {Boolean} frame */
    /** @private */
    frame: true,
    
    /**
     * @cfg {Ext.ux.window.MessageWindowGroup} manager
     * A reference to the MessageWindowGroup that should manage this Message Window (defaults 
     * to {@link Ext.ux.window.MessageWindowMgr}). Specify a reference to an instance unless
     * you want a new manager for each instance:
     * <pre><code>
     * var group2 = new Ext.ux.window.MessageWindowGroup({
     *     //override any defaults or add to base class instance
     *     groupId: 2, //groupId not implemented at this time
     *     zseed: 2000 //change the zseed (default = 9000)
     * });
     * var mw1 = new Ext.ux.window.MessageWindow({
     *     manager: group2//specify the MessageWindowGroup manager (instead of using default manager)
     * });
     * var mw2 = new Ext.ux.window.MessageWindow({
     *     manager: group2//specify the MessageWindowGroup manager (instead of using default manager)
     * });
     * var mw3 = new Ext.ux.window.MessageWindow({
     *     //will use default manager
     * });
     * </pre></code>
     */

    /**
     * @cfg {Function} handleHelp
     * Handler function when the help tool is clicked (defaults to {@link Ext#emptyFn}). 
     * @param {Object} event The click event.
     * @param {Object} toolEl The tool Element.
     * @param {Object} panel The host Panel.
     */
    handleHelp: Ext.emptyFn,

    /**
     * @cfg {Boolean} help
     * True to display tools for help.  Defaults to true.
     */
    help: true,

    /**
     * @cfg {Object} hideFx
     * Config object for hide effects settings. An example with defaults shown:
     * <pre><code>
     * hideFx: {
     *     delay: 5000,  //time in milliseconds to delay the start of the effect
     *     duration: 0.25, //duration of the effect
     *     mode: 'standard', // null = will not hide
     *                       // 'standard' = traditional window hide (vanish)
     *                       // 'standard' = traditional window hide (vanish)
     *                       // anything else will use the default of ghost
     *     useProxy: true //default is false to hide window instead
     * }
     * </code></pre>
     */
    hideFx: {
        delay: 5000
    },

    /**
     * @cfg {String} hoverCls
     * An extra CSS class that will be added to this component's Element when
     * hovering over (defaults to 'msg-over').
     */
    hoverCls: 'msg-over',

    /**
     * @cfg {String} iconCls
     * A CSS class that will provide a background image to be used as the header icon (defaults
     * to 'x-icon-information'). An example custom icon class would be something like: 
     * .my-icon { background: url(../images/my-icon.gif) 0 6px no-repeat !important;} 
     */
    iconCls: 'x-icon-information',

    /**
     * @cfg {Boolean} maximizable
     * True to display the 'maximize' tool button and allow the user to maximize the window, false to hide the button
     * and disallow maximizing the window (defaults to false).  Note that when a window is maximized, the tool button
     * will automatically change to a 'restore' button with the appropriate behavior already built-in that will
     * restore the window to its previous size.
     */

    /**
     * @cfg {Boolean} minimizable
     * True to display the 'minimize' tool button and allow the user to minimize the window, false to hide the button
     * and disallow minimizing the window (defaults to false).  Note that this button provides no implementation --
     * the behavior of minimizing a window is implementation-specific, so the minimize event must be handled and a
     * custom minimize behavior implemented for this option to be useful.
     */

    /**
     * @cfg {Number} minHeight
     * The minimum height in pixels allowed for this window (defaults to 100).  Only applies when resizable = true.
     */
    minHeight: 40,

    /**
     * @cfg {Number} minWidth
     * The minimum width in pixels allowed for this window (defaults to 200).  Only applies when resizable = true.
     */
    minWidth: 200,

    /**
     * @cfg {Boolean} modal
     * True to make the window modal and mask everything behind it when displayed, false to display it without
     * restricting access to other UI elements (defaults to false).
     */

    /**
     * @cfg {Array} msgs
     * An array to hold the message queue for refreshing messages.  Body of the message window will be updated
     * from the <b>text</b> element.
     * <b>Example</b>:
     * <pre><code>
     * msgs: [
     *     {text: 'Some text message 1', url:'http://extjs.com/support/training/'},
     *     {text: 'Some text message 2 &raquo;', url:'http://extjs.com/support/training/'}
     * ],
     * </code></pre>
     * The first message that will be displayed uses the <b>Title</b> and <b>html</b> config options.
     */
    msgs: [],

    /**
     * @cfg {Boolean} monitorResize
     * This is automatically managed based on the value of constrain and constrainToHeader
     */
    monitorResize : true,

    /**
     * @cfg {Function} onEsc
     * Allows override of the built-in processing for the escape key. Default action
     * is to close the Window (performing whatever action is specified in {@link #closeAction}.
     * To prevent the Window closing when the escape key is pressed, specify this as
     * Ext.emptyFn (See {@link Ext#emptyFn}).
     */

    /**
     * @cfg {Object} origin
     * Config object for the message origin with the following sample of default properties:
     * <b>Example</b>:
     * <pre><code>
     * //configure a different origin than the default bottom right corner of the window:
     * origin: {
     *     //get window's Ext.element:
     *     el: Ext.get('northRegion'), //element to align to (defaults to document)
     *     increment: true, // default is to increment position of subsequent messages
     *     pos: "bl-bl", // position to align to (see {@link Ext.Element#alignTo} for more details defaults to "br-br").
     *     offX: 10,     // amount to offset horizontally (-20 by default)
     *     offY: 0       // amount to offset vertically (-20 by default)
     *     spaY: 5       // vertical spacing between adjacent messages (5 by default)
     * },
     * </code></pre>
     */

    /**
     * @cfg {Boolean} pinOnClick
     * True to display the 'pin' tool button and allow the user to pin the window, false
     * to hide the button and disallow pinning the window (defaults to true).
     */
    pinOnClick: true,

    /**
     * @cfg {String} pinState
     * Specify the initial pin state when the window is first shown. Specify null, 'pin', or the default
     * 'unpin'. <pre>
     * pinState  effect
     * --------  ------
     * null      window will show/hide itself, user can not control
     * 'pin'     window will initially show itself in pinned state, user will need to click unpin to hide
     * 'unpin'   window will initially show itself in unpinned state, user will need to click pin to keep open
     * </pre>
     */
    pinState: 'unpin',

    /**
     * @cfg {Boolean} plain
     * True to render the window body with a transparent background so that it will blend into the framing
     * elements, false to add a lighter background color to visually highlight the body element and separate it
     * more distinctly from the surrounding frame (defaults to false).
     */
    plain: false,
    
    /**
     * @cfg {Boolean} resizable
     * True to allow user resizing at each edge and corner of the window, false to disable resizing (defaults to false).
     */
    resizable: false,

    /**
     * @cfg {String} resizeHandles
     * A valid {@link Ext.Resizable} handles config string (defaults to 'all').  Only applies when resizable = true.
     */

    /**
     * @cfg {String} textHelp
     * Qtip text to display for help tool (defaults to 'Get hel').  Only applicable if help = true. 
     */
    textHelp: 'Get help',

    /**
     * @cfg {String} textPin
     * Qtip text to display for pin tool.  Only applicable if {@link pinState} == 'pin' or 'unpin'.
     */
    textPin: 'Pin this to prevent closing',

    /**
     * @cfg {String} textUnpin
     * Qtip text to display for unpin tool.  Only applicable if {@link pinState} == 'pin' or 'unpin'.
     */
    textUnpin: 'Unpin this to close',

    /**
     * @cfg {Number} x
     * The X position of the left edge of the Window on initial showing. Defaults to centering the Window within
     * the width of the Window's container {@link Ext.Element Element) (The Element that the Window is rendered to).
     */

    /**
     * @cfg {Number} y
     * The Y position of the top edge of the Window on initial showing. Defaults to centering the Window within
     * the height of the Window's container {@link Ext.Element Element) (The Element that the Window is rendered to).
     */

    /** @private */
    initHidden : true,

    /** @private */
    initComponent : function () {

        Ext.apply(this, {
            collapsible: false,
            footer: false,
            minHeight: 20,
            stateful: false
        });
        
        //if interval is specified automatically show message windows
        if (this.interval) {
            this.startAutoRefresh();
        } 
        //set up automatic hide/close of window if so configured
        if (this.autoHide) {
            if (this.pinState === 'unpin') {
                this.task = new Ext.util.DelayedTask( this[this.hideAction], this, [this.animateTarget]);
            }
        } 
//new
        else {
			this.closable = true;
		}
//added this.closable
        
        //call parent
        Ext.ux.window.MessageWindow.superclass.initComponent.call(this);

        //add listeners
        this.on({
            mouseout: {
                scope: this,
                fn: this.onMouseout
            }
        });

        //add events
        this.addEvents(
            /**
             * @event activate
             * Fires after the window has been visually activated via {@link setActive}.
             * @param {Ext.ux.window.MessageWindow} this
             */
            /**
             * @event deactivate
             * Fires after the window has been visually deactivated via {@link setActive}.
             * @param {Ext.ux.window.MessageWindow} this
             */
            /**
             * @event resize
             * Fires after the window has been resized.
             * @param {Ext.ux.window.MessageWindow} this
             * @param {Number} width The window's new width
             * @param {Number} height The window's new height
             */
            /**
             * @event maximize
             * Fires after the window has been maximized.
             * @param {Ext.ux.window.MessageWindow} this
             */
            /**
             * @event minimize
             * Fires after the window has been minimized.
             * @param {Ext.ux.window.MessageWindow} this
             */
            /**
             * @event restore
             * Fires after the window has been restored to its original size after being maximized.
             * @param {Ext.ux.window.MessageWindow} this
             */
            /**
             * @event pinned
             * Fires after the window has been pinned.
             * @param {Ext.ux.window.MessageWindow} this
             */
            'afterpin',
            /**
             * @event unpinned
             * Fires after the window has been unpinned.
             * @param {Ext.ux.window.MessageWindow} this
             */
            'afterunpin',
            /**
             * @event click
             * Fires after the window has been clicked.
             * @param {Ext.ux.window.MessageWindow} this
             * @param {Ext.ux.window.MessageWindow} msg The message from the message array if configured.
             */
            'click');

        this.initFx();
    },

    //override
    /** @private */
    initEvents: function () {
        
        //use a slighly enhanced Ext.ux.window.MessageWindowMgr instead of the default WindowMgr
        this.manager = this.manager || Ext.ux.window.MessageWindowMgr;

        //the parent class will register, so no need to do it here:
        //this.manager = this.manager || Ext.WindowMgr;
        
        Ext.ux.window.MessageWindow.superclass.initEvents.call(this);
    },

    focus: function () {
        Ext.ux.window.MessageWindow.superclass.focus.call(this);
    },
    
    /** @private */
    toFront: function () {
        if(this.manager.bringToFront(this)){
            //only focus if configured as such
            if(this.focusOnShow){
                this.focus();
            }
        }
        return this;
    },

    /** @private */
    initTools: function () {
        if (this.pinOnClick) {
            this.addTool({
                id: 'unpin', // image points left
                handler: this.handlePin,
                //set initial visibility (also check if pinState is null)
                hidden: (!this.pinState || this.pinState === 'pin'), 
                qtip: this.textPin,
                scope: this
            });
    
            this.addTool({
                id: 'pin',// image points down
                handler: this.handleUnpin,
                hidden: (!this.pinState || this.pinState === 'unpin'), 
                qtip: this.textUnpin,
                scope: this
            });
        }
        if (this.help) {
            this.addTool({
                id: 'help',
                handler: this.handleHelp,
                qtip: this.textHelp,
                scope: this
            });
        }

        // let the default tools be applied farthest to the right
        Ext.ux.window.MessageWindow.superclass.initTools.apply(this, arguments);
    },

    /** @private */
    onRender: function (ct, position) {
        Ext.ux.window.MessageWindow.superclass.onRender.call(this, ct, position);
        //after call to parent class onRender this.el exists.

        //clip part of the window (for example the recurring messages that
        //eject from a border have the bottom rounded edge, etc. clipped off.
        if (this.clip) {
            switch (this.clip) {
            case 'bottom':
                Ext.destroy(this.getEl().child('.' + this.baseCls + '-bl'));
                break;
            }
        }

        //add a class when hovering over in order to disable
        //any updates to the window while hovering over
        if (true) {
            this.el.addClassOnOver(this.hoverCls);
        }
        
        //add click listener to body
        Ext.fly(this.body.dom).on('click', this.handleClick, this);
    },

////////////////////////////////
// Temporary override?
    /**
     * Closes the window, removes it from the DOM and destroys the window object.  The beforeclose event is fired
     * before the close happens and will cancel the close action if it returns false.
     */
//    close : function(){
    close : function(animateTarget){
        if(this.fireEvent("beforeclose", this) !== false){
            this.hide(animateTarget=undefined, function(){
                this.fireEvent('close', this);
                this.destroy();
            }, this);
        }
    },
/////////////////////////////////

    /**
     * Toggles the active pin state.
     */
    togglePinState: function (event) {
        if (this.pinOnClick) {
            //check which tool is visible
            if (this.tools.unpin.isVisible()) {
                this.handlePin(event, this.tools.unpin, this);
            } else {
                this.handleUnpin(event, this.tools.pin, this);
            }
        }
    },

    /**
     * Override to the Panel Class createElement method.  This method is called by
     * Panel Class' onRender().  Normally the panel class will create a header in the
     * *-tc class, to utilize the default box class for styling we'll move the header
     * inside the *-mc class to utilize  
Ext.Element.boxMarkup:
<div class="{0}-tl">
    <div class="{0}-tr">
        <div class="{0}-tc">
            ##HEADER##
            <div class="{0}-header {0}-draggable">
                <div class="x-tool x-tool-close">
                </div>
                <span class="{0}-header-text">
                </span>
            </div>
        </div>
    </div>
</div>
<div class="{0}-ml">
    <div class="{0}-mr">
        <div class="{0}-mc">
            <div class="{0}-body">
                CONTAINER
                ###############
            </div>
        </div>
    </div>
</div>
<div class="{0}-bl">
    <div class="{0}-br">
        <div class="{0}-bc">
        </div>
    </div>
</div>   



 <div class="x-box-bwrap" id="ext-gen117">
    <div class="x-box-ml">
        <div class="x-box-mr">
            <div class="x-box-mc">
                <div style="-moz-user-select: none;" id="ext-gen116" class="x-box-header x-unselectable x-window-draggable">
                    <div id="ext-gen128" class="x-tool x-tool-help">
                    </div>
                    <span class="x-box-header-text" id="ext-gen126"><h2>Title</h2></span>
                </div>
                <div class="x-box-body" id="ext-gen118" style="height: auto; width: 72px;">
                    Message
                </div>
            </div>
        </div>
    </div>
    <div class="x-box-bl x-panel-nofooter">
        <div class="x-box-br">
            <div class="x-box-bc"/>
        </div>
    </div>
</div>
     * @param {Object} name
     * @param {Object} pnode
     *///override panel class method:
    // private
    createElement : function (name, pnode) {
        if (this.shiftHeader) {
            switch (name) {
            case 'header':
                //don't create header yet if putting inside mc, do it when tbar is done
                return;
            case 'tbar':
                Ext.ux.window.MessageWindow.superclass.createElement.call(this, 'header', pnode);
                Ext.ux.window.MessageWindow.superclass.createElement.call(this, name, pnode);
                return;
            }
        }
        //caught the ones we needed to, call the default implementation
        Ext.ux.window.MessageWindow.superclass.createElement.call(this, name, pnode);
    },

    //override/disable focus, see above.
    focus: Ext.emptyFn, 

    /** @private */
    getState : function () {
        return Ext.apply(Ext.ux.window.MessageWindow.superclass.getState.call(this) || {}, this.getBox());
    },

    /**
     * Handler for when the message window body is clicked
     * @param {Object} event The click event.
     */
    handleClick: function (event) {
        this.fireEvent('click', this, this.msg);
        this.togglePinState(event);
    },

    /**
     * Handler for when pin button is clicked
     * @param {Object} event The click event.
     * @param {Object} toolEl The tool Element.
     * @param {Object} panel The host Panel.
     */
    handlePin: function (event, toolEl, panel) {
        //hide the unpin button
        toolEl.hide();
        
        //show the pin button
        this.tools.pin.show();

        this.cancelHiding();
        
        this.fireEvent('afterpin', this);
    },

    /**
     * Handler for when pin button is clicked
     * @param {Object} event The click event.
     * @param {Object} toolEl The tool Element.
     * @param {Object} panel The host Panel.
     */
    handleUnpin: function (event, toolEl, panel) {

        //hide the pin button
        toolEl.hide();
        
        //show the unpin button
        this.tools.unpin.show();

        this[this.hideAction](this.animateTarget);

        this.fireEvent('afterunpin', this);
    },

    /**
     * cancel hiding of the window if {@link #autoHide} is true
     */
    cancelHiding: function () {
        this.addClass('fixed');
        if (this.autoHide) {
            if (this.pinState === 'unpin') {
                this.task.cancel();
            }
        }
        if (this.tools.pin) {
            //show the pin button
            this.tools.pin.show();
        }
        if (this.tools.unpin) {
            //make sure the unpin button is hidden
            this.tools.unpin.hide();
        }
 },

    /** @private */
    initFx : function () {
        this.showFx = this.showFx || {};
        Ext.applyIf(this.showFx, {
            align: 'b',
            duration: 1,
            callback: this.afterShow,
            scope: this
        });

        this.hideFx = this.hideFx || {};
        Ext.applyIf(this.hideFx, {
            block: false,//default for window is true
            callback: this.afterHide,
            easing: 'easeOut',//'easeNone';
            remove: true,
            scope: this
        });

        this.origin = this.origin || {};
        Ext.applyIf(this.origin, {
            el: Ext.getDoc(), //defaults to document
            increment: true, //whether to increment position of subsequent messages
            pos: "br-br",//position to align to (see {@link Ext.Element#alignTo} for more details defaults to "br-br").
            offX: -20, //amount to offset horizontally
            offY: -20, //amount to offset vertically
            spaY: 5    //vertical spacing between adjacent messages
        });
    },


    getAnimEl : function (fx) {
        var animEl;

        //animate using a proxy instead of actual element if so configured
        if (fx.useProxy) {
            animEl = this.proxy;
            this.proxy.setOpacity(0.5);
            this.proxy.show();
            var tb = this.getBox(false);
            this.proxy.setBox(tb);
            this.el.hide();
            //Ext.apply(fx, tb);
        } else {
            animEl = this.el;
        }
        
        return animEl;
    },

    //override parent method
    /** @private */
    animHide : function () {

        //remove the position of this element from the manager
        this.manager.positions.remove(this.pos);

        // configured Fx and element to hide
        var fx = this.hideFx, w = this.getAnimEl(fx);
        
        switch (fx.mode) {
            case 'none':
                break;
            case 'slideIn':
                w[fx.mode]("b", fx);
                //w.slideIn("b", fx);
                break;
            case 'custom':
                Ext.callback(fx.callback, fx.scope, [this, w, fx]);//callback(cb,scope,args,delay)
                break;
            case 'standard':
                fx.duration = fx.duration || 0.25;
                fx.opacity = 0;
                w.shift(fx);
                break;
            default:
                fx.duration = fx.duration || 1;
                w.ghost("b", fx);
                break;
        }
    },

    //override parent method
    /** @private */
    afterShow: function () {
        Ext.ux.window.MessageWindow.superclass.afterShow.call(this);
        
        //if user moves remove from position manager and cancel hiding
		this.on('move', function(){
            //remove the position of this element from the manager
            this.manager.positions.remove(this.pos);
            this.cancelHiding();
		}, this);

        if (this.autoHide) {
           if (this.pinState === 'unpin') {
                this.task.delay(this.hideFx.delay);
            }
        }
    },

    /** @private */
    animShow: function () {

        //don't update if hovering over message
        //check if visible so it will show initially
        if (this.el.isVisible() && this.el.hasClass(this.hoverCls)) {
            return;
        }

        if (this.msgs.length > 1) {
            this.updateMsg();
        }

        //element to hide and configured Fx
        var fx = this.showFx, el = this.el;

        this.position(el);
        el.slideIn(fx.align, fx);
    },

    /**
     * some cleanup still needed this method
     * sizing / placement issues when height of windows changes
     * should recalculate placement based on window height
     */
    position : function (el) {

        var y,
            // push down instead of up if align top
            dir = (this.showFx.align.substr(0,1) == 't') ? 1 : -1;            

        //track positions of each instance
        this.pos = 0;

        if (this.origin.increment) {
            while (this.manager.positions.indexOf(this.pos) > -1) {
                this.pos++;
            }
            this.manager.positions.push(this.pos);
        }

        //set the window size
        this.setSize(this.width || this.minWidth, this.height || this.minHeight);

        //increment the vertical position of the window
        if (this.origin.increment) {
            y = this.origin.offY + ((this.getSize().height + this.origin.spaY) * this.pos * dir);            
        } else {
            y = 0;
        }

        el.alignTo(
            this.origin.el, // element to align to.
            this.origin.pos,        // position to align to (see {@link Ext.Element#alignTo} for more details).
            [ this.origin.offX, y ] // Offset the positioning by [x, y]: 
        );
    },

    onMouseout: function () {
        //console.info('in onMouseout');
        //console.info(arguments);
    },


    /**
     * @param {Object} el
     * @param {Object} x
     * @param {Object} y
     * @private
     */
	positionPanel: function (el, x, y) {
        if(x && typeof x[1] == 'number'){
            y = x[1];
            x = x[0];
        }
        el.pageX = x;
        el.pageY = y;
       	
        if(x === undefined || y === undefined){ // cannot translate undefined points
            return;
        }
        
        if(y < 0){ y = 10; }
        
        var p = el.translatePoints(x, y);
        el.setLocation(p.left, p.top);
        return el;
    },

    /**
     * Specify the message to be shown
     * @param {String} msg Message to update the body with.
     */
    setMessage: function (msg) {
        this.body.update(msg);
    },

    /**
     * Set the title of the message window
     * @param {String} title Title of Window
     * @param {String} iconCls icon to use in header area
     */
    setTitle: function (title, iconCls) {
        Ext.ux.window.MessageWindow.superclass.setTitle.call(this, title, iconCls || this.iconCls);
    },

    /**
     * Start recurring messages
     * @param {Boolean} update Whether to update the message before starting automatic refreshes.
     */

    startAutoRefresh : function(update){
        if(update){
            this.updateMsg(true);
        }
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
        }
        // native javascript function to delay for a specified time before triggering the
        // execution of a specific function. After triggering the called function the command
        // doesn't complete. Instead it waits for the specified time again and then triggers
        // the function again and continues to repeat this process of triggering the function
        // at the specified intervals until either the web page is unloaded or the clearInterval
        // function is called.
        this.autoRefreshProcId = setInterval(this.animShow.createDelegate(this, []), this.interval);
    },

    /**
     * Stop recurring messages
     */
    stopAutoRefresh : function(){
        if(this.autoRefreshProcId){
            clearInterval(this.autoRefreshProcId);
        }
    },

    /**
     * Update the message
     * @param {String} msg The updated msg
     */
    updateMsg: function (msg) {

        //don't update if hovering over message
        if (this.el && !this.el.hasClass(this.hoverCls)) {

            if (msg) {
//                console.info('message passed');   
            } else {
                this.msgIndex = this.msgs[this.msgIndex + 1] ? this.msgIndex + 1 : 0;
                this.msg = this.msgs[this.msgIndex];
            }

            //update the innerHTML of element
            //this.el.dom.update(this.msg.text);
            this.body.update(this.msg.text);
        } else {
            //console.info('hovering');
        }
    }    
});

//register the xtype
Ext.reg('message-window', Ext.ux.window.MessageWindow);