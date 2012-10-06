var ONESECOND = 1000;
var ONEMINUTE = ONESECOND * 60;
Ext.ns("Ext.ux");
/**
 * <p>
 *  stuff
 * </p>
 * @class Ext.ux.InactivityMonitor
 * @extends Ext.util.Observable
 * @author Harley Jones, aka <a href="http://extjs.com/forum/member.php?u=118">harley.333</a>
 * @license <a href="http://creativecommons.org/licenses/LGPL/2.1/">LGPL 2.1</a>
 * @version 0.1 (December 28, 2008)
 */
Ext.ux.InactivityMonitor = Ext.extend(Ext.util.Observable, {
    /**
	 * @cfg {Number} inactivityTimeout description
	 */
	inactivityTimeout: ONEMINUTE * 3,
    /**
	 * @cfg {String} pollActionParam description
	 */
    pollActionParam: "a",
    /**
	 * @cfg {String} pollAction description
	 */
    pollAction: "StayAlive",
    /**
	 * @cfg {Number} pollInterval description
	 */
    pollInterval: ONEMINUTE,
    /**
	 * @cfg {String} pollUrl description
	 */
    pollUrl: "Default.aspx",
    /**
	 * @cfg {Object} messageBoxConfig description
	 */
    messageBoxConfig: {}, // allows developers to override the appearance of the messageBox
    /**
	 * @cfg {Number} messageBoxCountdown description
	 */
    messageBoxCountdown: 30, // how long should the messageBox wait?
    
    /**
	 * @constructor
     * creates a new InactivityMonitor
	 * @name Ext.ux.InactivityMonitor
	 * @methodOf Ext.ux.InactivityMonitor
	 * @param {Object} config Configuration options
     */
    constructor: function(config) {
        this.addEvents({timeout: true});
        Ext.apply(this, config);
        Ext.ux.InactivityMonitor.superclass.constructor.apply(this, arguments);
        if (this.inactivityTimeout >= ONEMINUTE) {
            this.resetTimeout();
            this._pollTask = Ext.TaskMgr.start({
                run: function () {
                    var params = {};
                    params[this.pollActionParam] = this.pollAction;
                    Ext.Ajax.request({params: params, url: this.pollUrl});
                },
                interval: this.pollInterval,
                scope: this
            });
            var body = Ext.get(document.body);
            body.on("click", this.resetTimeout, this);
            body.on("keypress", this.resetTimeout, this);
        }
    },
    
    destroy: function() {
        var body = Ext.get(document.body);
        body.un("click", this.resetTimeout, this);
        body.un("keypress", this.resetTimeout, this);
		Ext.TaskMgr.stop(this._pollTask);
		this._inactivityTask.cancel();
		Ext.TaskMgr.stop(this._countdownTask);
    },
    
    resetTimeout: function () {
        if (!this._inactivityTask) {
            this._inactivityTask = new Ext.util.DelayedTask(this._beginCountdown, this);
        }
        this._inactivityTask.delay(this.inactivityTimeout);
    },
    
    // private stuff
    _pollTask: null, // task to poll server
    _countdownTask: null, // ONESECOND interval for updating countdown MessageBox
    _countdownMessage: null, // countdown MessageBox
    _inactivityTask: null, // task to start countdown
    _beginCountdown: function () {
        var config = Ext.apply({
            buttons: {ok: "Keep Working"},
            closable: true,
            fn: function (btn) {
                Ext.TaskMgr.stop(this._countdownTask);
                this.resetTimeout();
            },
            msg: "Your session has been idle for too long.  Click the button to keep working.",
            progress: true,
            scope: this,
            title: "Inactivity Warning"
        }, this.messageBoxConfig);
        if (!this._countdownMessage) {
			// only create the MessageBox once
            this._countdownMessage = Ext.MessageBox.show(config);
        }
        var win = this._countdownMessage;
        if (!win.isVisible()) {
            win.show(config);
        }
        win.updateProgress(0);
        win.seconds = 0;
        this._countdownTask = Ext.TaskMgr.start({
            run: function () {
                win.seconds += 1;
                if (win.seconds > this.messageBoxCountdown) {
                    Ext.TaskMgr.stop(this._countdownTask);
                    this.fireEvent("timeout", this, win);
                } else {
                    win.updateProgress(win.seconds / this.messageBoxCountdown);
                }
            },
            scope: this,
            interval: ONESECOND
        });
    }
});
