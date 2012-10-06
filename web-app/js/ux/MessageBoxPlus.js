var Ozone = Ozone || {};

/**
 * @private
 */
Ozone.MessageBoxPlus = function(){
    var extMsg = Ext.Msg;

    var setLocalizedButtonText = function(){
        extMsg.buttonText = {
            ok : Ozone.layout.MessageBoxButtonText.ok,
            cancel : Ozone.layout.MessageBoxButtonText.cancel,
            yes : Ozone.layout.MessageBoxButtonText.yes,
            no : Ozone.layout.MessageBoxButtonText.no
        };
    };

    var setClsRemoval = function(cls){
        if(cls != undefined) {
            extMsg.on('hide', function(thisComp){
                thisComp.removeCls(cls);
            });
        }
    };
     
    return {

        /**
         * Displays a message box with a progress bar.  This message box has no buttons and is not closeable by
         * the user.  You are responsible for updating the progress bar as needed via {@link Ext.MessageBox#updateProgress}
         * and closing the message box when the process is complete.
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {String} progressText (optional) The text to display inside the progress bar (defaults to '')
         * @param {String} options (optional)
         * @return {Ozone.MessageBoxPlus} this
         */
        progress : function(title, msg, progressText, options){
            setLocalizedButtonText();
            setClsRemoval((options != undefined) ? options.cls : null);
            extMsg.show({
                title : title,
                msg : msg,
                buttons: false,
                progress:true,
                closable:false,
                minWidth: extMsg.minProgressWidth,
                progressText: progressText,
                cls: (options != undefined) ? options.cls : null
            });
            return this;
        },

        /**
         * Displays a message box with an infinitely auto-updating progress bar.  This can be used to block user
         * interaction while waiting for a long-running process to complete that does not have defined intervals.
         * You are responsible for closing the message box when the process is complete.
         * @param {String} msg The message box body text
         * @param {String} title (optional) The title bar text
         * @param {Object} config (optional) A {@link Ext.ProgressBar#waitConfig} object
         * @param {String} options (optional)
         * @return {Ozone.MessageBoxPlus} this
         */
        wait : function(msg, title, config, options){
            setLocalizedButtonText();
            setClsRemoval((options != undefined) ? options.cls : null);
            extMsg.show({
                title : title,
                msg : msg,
                buttons: false,
                closable:false,
                wait:true,
                modal:true,
                minWidth: extMsg.minProgressWidth,
                waitConfig: config,
                cls: (options != undefined) ? options.cls : null
            });
            return this;
        },

        /**
         * Displays a standard read-only message box with an OK button (comparable to the basic JavaScript alert prompt).
         * If a callback function is passed it will be called after the user clicks the button, and the
         * id of the button that was clicked will be passed as the only parameter to the callback
         * (could also be the top-right close button).
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @param {String} options (optional)
         * @param {ZIndexManager} zIndexManager (optional) The ZIndexManager to register to
         * @return {Ozone.MessageBoxPlus} this
         */
        alert : function(title, msg, fn, scope, options, zIndexManager){
            setLocalizedButtonText();
            setClsRemoval((options != undefined) ? options.cls : null);
            extMsg.show({
                title : title,
                msg : msg,
                buttons: extMsg.OK,
                fn: fn,
                scope : scope,
                cls: (options != undefined) ? options.cls : null,
                closable: (options != undefined) ? (options.closable == false ? false : true) : true
            });
            zIndexManager && zIndexManager.register(extMsg);
            zIndexManager && zIndexManager.bringToFront(extMsg);
            return this;
        },

        /**
         * Displays a confirmation message box with Yes and No buttons (comparable to JavaScript's confirm).
         * If a callback function is passed it will be called after the user clicks either button,
         * and the id of the button that was clicked will be passed as the only parameter to the callback
         * (could also be the top-right close button).
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @param {String} options (optional)
         * @return {Ozone.MessageBoxPlus} this
         */
        confirm : function(title, msg, fn, scope, options){
            setLocalizedButtonText();
            setClsRemoval((options != undefined) ? options.cls : null);
            extMsg.show({
                title : title,
                msg : msg,
                buttons: extMsg.YESNO,
                fn: fn,
                scope : scope,
                icon: extMsg.QUESTION,
                cls: (options != undefined) ? options.cls : null
            });
            return this;
        },

        /**
         * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to JavaScript's prompt).
         * The prompt can be a single-line or multi-line textbox.  If a callback function is passed it will be called after the user
         * clicks either button, and the id of the button that was clicked (could also be the top-right
         * close button) and the text that was entered will be passed as the two parameters to the callback.
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @param {Boolean/Number} multiline (optional) True to create a multiline textbox using the defaultTextHeight
         * property, or the height in pixels to create the textbox (defaults to false / single-line)
         * @param {String} value (optional) Default value of the text input element (defaults to '')
         * @param {String} options (optional)
         * @return {Ozone.MessageBoxPlus} this
         */
        prompt : function(title, msg, fn, scope, multiline, value, options){
            setLocalizedButtonText();
            setClsRemoval((options != undefined) ? options.cls : null);
            extMsg.show({
                title : title,
                msg : msg,
                buttons: extMsg.OKCANCEL,
                fn: fn,
                minWidth:250,
                scope : scope,
                prompt:true,
                multiline: multiline,
                value: value,
                cls: (options != undefined) ? options.cls : null
            });
            return this;
        }
    };
}();

/**
 * @private
 * Shorthand for {@link Ozone.MessageBoxPlus}
 */
Ozone.Msg = Ozone.MessageBoxPlus;