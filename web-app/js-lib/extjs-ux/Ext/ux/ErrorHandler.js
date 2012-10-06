Ext.ns("Ext.ux");
/**
 * <p>
 *  The ErrorHandler class is intended to be a simple solution for client-side
 *  exception handling. Unfortunately, browser inconsistencies are making this
 *  extremely difficult. Here is a list of the browsers I used in my testing,
 *  in order of best features:
 *  <ul>
 *   <li>Firefox 3.0.3</li>
 *   <li>Internet Explorer 7.0.5730.13</li>
 *   <li>Safari 3.1.2 (525.21)</li>
 *   <li>Google Chrome 0.2.149.30</li>
 *   <li>Opera 9.61.10463</li>
 *  </ul>
 * </p>
 * <p>
 *  The class is automatically instantiated and available for immediate use.
 *  The class exposes a single event (<b><tt>error</tt></b>) which is fired when any exception
 *  has been handled by the class.  By subscribing to the <b><tt>error</tt></b> event, the
 *  developer has a simple mechanism for logging all exceptions.
 * </p>
 * <pre>
 *  Ext.ux.ErrorHandler.on("error", function(ex) {
 *      // send information to the browser's console
 *      // send information to server for logging or to email to the developer
 *      // alert the user with a friendly message
 *      // etc, etc
 *  });
 * </pre>
 * <p>
 *  To catch unhandled exceptions, call the init method to setup a browser
 *  level "catch-all" exception handler:
 * </p>
 * <pre>
 *  Ext.ux.ErrorHandler.init();
 * </pre>
 * <p>
 *  Unfortunately, the browser level "catch-all" exception handler is only
 *  supported on Firefox and Internet Explorer.
 * </p>
 * <p>
 *  Using try...catch blocks will result in better code and more predictable
 *  results. "More predictable," because you are taking control of your code
 *  and not relying on the browser.  In this case, call the <b><tt>handleError</tt></b>
 *  method:
 * </p>
 * <pre>
 *  try {
 *      var nullObject = null;
 *      nullObject.oops = 5;
 *  } catch (ex) {
 *      Ext.ux.ErrorHandler.handleError(ex);
 *  }
 * </pre>
 * <i>This class is a singleton and cannot be created directly.</i>
 * @class Ext.ux.ErrorHandler
 * @singleton
 * @extends Ext.util.Observable
 * @author Harley Jones, aka <a href="http://extjs.com/forum/member.php?u=118">harley.333</a>
 * @license <a href="http://creativecommons.org/licenses/LGPL/2.1/">LGPL 2.1</a>
 * @version 0.2 (October 28, 2008)
 */
Ext.ux.ErrorHandler = Ext.extend(Ext.util.Observable, (function() {
    return {
        /**
         * @private
         * @constructor
         */
        constructor: function() {
            Ext.ux.ErrorHandler.superclass.constructor.call(this);
            this.addEvents(
                /**
                 * Fires when an error has been handled.  This event is fired from the handleError method.
                 * @event error
                 * @param {Object} error An object containing the following:
                 * <ul>
                 *  <li>raw : <b>Object</b><p class="sub-desc">the original arguments passed to handleError</p></li>
                 *  <li>isError : <b>Boolean</b><p class="sub-desc"><b><tt>true</tt></b>, if the first argument is a JS Error object</p></li>
                 *  <li>isUnhandledException : <b>Boolean</b><p class="sub-desc"><b><tt>true</tt></b>, if the arguments match the signature of an unhandled exception <b><tt>(message, url, line)</tt></b></p></li>
                 *  <li>isImageLoadingError : <b>Boolean</b><p class="sub-desc"><b><tt>true</tt></b>, if IMG tag loading error</p></li>
                 *  <li>isScriptLoadingError : <b>Boolean</b><p class="sub-desc"><b><tt>true</tt></b>, if SCRIPT tag loading error <i>only supported by Firefox</i></p></li>
                 *  <li>name : <b>String</b><p class="sub-desc"><b><tt>name</tt></b> property of JS Error object</p></li>
                 *  <li>message : <b>String</b><p class="sub-desc">description of error</p></li>
                 *  <li>url : <b>String</b><p class="sub-desc">location of error</p></li>
                 *  <li>lineNumber : <b>Number</b><p class="sub-desc">location of error <i>(not reliable)</i></p></li>
                 *  <li>stack : <b>Array</b><p class="sub-desc">An array of objects containing a full stack trace (starting with the method that caused the exception)<br><b><tt>[{args: [], func: func}, ...]</tt></b></p></li>
                 * </ul>
                 */
                "error"
            );
        },
        /**
         * Sets up a handler for "unhandled" exceptions that bubble up to the browser's window object.
         * @returns {void}
         */
        init: function () {
            // window.onerror is the browser's hook for unhandled exceptions (IE and Firefox only)
            // if another developer is already using window.onerror, let's be respectful
            window.onerror = !window.onerror ? Ext.ux.ErrorHandler.handleError : window.onerror.createSequence(Ext.ux.ErrorHandler.handleError);
            Ext.select("img").each(function(el, list, index) {
                el.on("error", Ext.ux.ErrorHandler.handleError);
            });
        },
        /**
         * This method handles all exception and fires the <b><tt>error</tt></b> event.
         * @param {Object...} args
         * @returns {Boolean} Returns <b><tt>true</tt></b>, unless an event handler throws an exception (if this occurs, we allow the browser to handle these exceptions in the default manner).
         */
        handleError:  function () {
            // the arguments collection is not a true Array, so we'll make one
            var args = [];
            for (var x = 0; x < arguments.length; x++) {
                args[x] = arguments[x];
            }
            if (args.length > 0) {
                var ex = {
                    raw: null,
                    isError: false,
                    isUnhandledException: false,
                    isImageLoadingError: false,
                    isScriptLoadingError: false, // Firefox only
                    name: null,
                    message: null,
                    url: null, // Safari and Firefox only
                    lineNumber: null, // Safari and Firefox only
                    stack: null // Firefox and Opera only
                };
                ex.raw = args;
                ex.isError = args[0] instanceof Error; // Error object thrown in try...catch
                // Check the signature for a match with an unhandled exception
                ex.isUnhandledException = (args.length === 3) && (typeof args[2] === "number");
                ex.isImageLoadingError = !!args[0].browserEvent && args[1] && args[1].tagName == "IMG";
                if (ex.isError) {
                    var err = args[0];
                    ex.name = err.name || "Error"; // Safari is inconsistent
                    ex.message = err.message || err.type; // Chrome is inconsistent
                    ex.lineNumber = err.line || err.lineNumber; // Safari and Firefox
                    ex.url = err.sourceURL || err.fileName; // Safari and Firefox
                    ex.stack = err.stack || err.stacktrace; // Firefox and Opera
                } else if (ex.isUnhandledException) {
                    ex.name = "ERR_UNHANDLED";
                    ex.message = args[0];
                    ex.url = args[1];
                    ex.lineNumber = args[2];
                    if (ex.message == "Error loading script") {
                        ex.isScriptLoadingError = true;
                        ex.name = "ERR_LOAD_SCRIPT";
                    }
                } else if (ex.isImageLoadingError) {
                    ex.name = "ERR_LOAD_IMG";
                    ex.message = "Error loading image";
                    ex.url = args[1].src;
                } else {
					ex.name = "ERR_UNKNOWN";
					ex.message = Ext.encode(args[0]);
                }
                // rebuild the stack (ignore Firefox and Opera)
                //  arguments.callee               // the handleError method
                //  arguments.callee.caller        // delegate for handleError
                //  arguments.callee.caller.caller // the beginning of the stack
                if (arguments.callee && arguments.callee.caller && arguments.callee.caller.caller) {
                    var a = [];
                    getStack(a, arguments.callee.caller.caller);
                    ex.stack = a;
                }
                try {
                    this.fireEvent("error", ex);
                } catch (e) {
                    if (!ex.isUnhandledException) {
                        throw e;
                    }
                    // if the errorHandler is broken, let the user see the browser's error handler
                    return false;
                }
            }
            return true;
        }
    };

    function getStack(a, func) {
        if (func.caller) {
            getStack(a, func.caller);
        }
        var args = [];
        for (var x = 0; x < func.arguments.length; x++) {
            args[x] = func.arguments[x];
        }
        a.unshift({args: args, func: func});
    }
})());
// the following line makes this a singleton class
Ext.ux.ErrorHandler = new Ext.ux.ErrorHandler();
// the following line ensures that the handleError method always executes in the scope of ErrorHandler
Ext.ux.ErrorHandler.handleError = Ext.ux.ErrorHandler.handleError.createDelegate(Ext.ux.ErrorHandler);