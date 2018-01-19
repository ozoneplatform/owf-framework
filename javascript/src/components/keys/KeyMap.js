Ext.define('Ozone.components.keys.KeyMap', {
    extend: 'Ext.util.KeyMap',
    alternateClassName: 'Ozone.KeyMap',
    singleton: true,

    previousKey: null,

    constructor: function() {
        this.callParent([document, [], Ozone.components.keys.EVENT_NAME]);
    },

    addBinding: function (binding) {
        function doApply(item) {
            Ext.applyIf(item, {
                shift: true,
                alt: true,
                activeInWidget: true,
                activeOutsideWidget: true
            });
        }

        Ext.isArray(binding) ? Ext.each(binding, doApply) : doApply(binding);

        this.callParent(arguments);
    },

    // overrides Ext.util.KeyMap's processBinding method
    processBinding: function(binding, event){
        if (!binding.activeOutsideWidget)
            return;

        if (this.checkModifiers(binding, event)) {
            var key = event.getKey(),
                handler = binding.fn || binding.handler,
                scope = binding.scope || this,
                keyCode = binding.keyCode,
                defaultEventAction = binding.defaultEventAction,
                i,
                len,
                keydownEvent = new Ext.EventObjectImpl(event);
            
            for (i = 0, len = keyCode.length; i < len; ++i) {
                // keys match and an exclusive hotkey binding is not active
                // or 
                // keys match and exclusive hotkey binding is active
                if ((key === keyCode[i] && !this.previousKey) || 
                    (key === keyCode[i] && this.previousKey && 
                        (this.compareHotKeys(binding, this.previousKey) || !this.previousKey.exclusive))) {

                    this.set(binding);

                    if (handler.call(scope, key, event) !== true && defaultEventAction) {
                        keydownEvent[defaultEventAction]();
                    }
                    break;
                }
            }
        }
    },

    // enables all hotkeys to work after a component hide
    reset: function() {
        this.previousKey = null;
    },

    set: function(key) {
        this.previousKey = key;
    },

    /*
     * manually fire a handler for a particular key.
     * @param keyevent An object containing, at a minimum, 
     * the keycode, alt, and shift associated with the 
     * key handler to fire. The keyevent can also
     * have a 'fromWidget' attribute. When true, this 
     * attribute signals that the event was received from
     * a widget, not from a keypress in the container
     */
    handleKey: function(keyevent, sender) {

        //WARNING: this.bindings is a private Ext.util.KeyMap property, 
        //so this may break on future upgrades of Ext.
        Ext.iterate(this.bindings, function(binding, index, hotKeys) {
            if (binding.key == keyevent.keyCode && binding.alt === keyevent.altKey 
                && binding.shift === keyevent.shiftKey 
                && binding.ctrl === keyevent.ctrlKey 
                && (binding.activeInWidget == keyevent.fromWidget 
                    || binding.activeOutsideWidget == !keyevent.fromWidget)) {

                var id = sender ? Ozone.util.parseJson(sender).id : null;

                binding.fn.call(binding.scope, keyevent.keyCode, keyevent, id);

                return false; //stop the iteration
            }
        });
    },

    /*
     * This function gets around a special case that occurs in IE.
     * In IE, focusing an iframe does not automatically focus the iframes
     * contentWindow.  Thus it ends up in an in-between state where it
     * is "focused" on a widget, but the keys that only work from
     * within a widget (such as ESC) do not work.  To get around this, we
     * bind all such keys to the iframe itself.
     * @param iframeCmp A WidgetIframe component
     */
    bindWidgetEvents: function(iframeCmp) {
        iframeCmp.getEl().on(Ozone.components.keys.EVENT_NAME, function (evt) {
            evt.fromWidget = true;
            this.handleKey(evt, iframeCmp.getEl().id);
            delete evt.fromWidget;  //necessary in IE7 because there seems to be one
                                    //global evt object
        }, this);
    },

    /*
     * Compares Ext KeyMap binding to Ozone KeyMap hotkey
     */
    compareHotKeys: function(binding, hotkey) {
        if(binding === hotkey)
            return true;

        var areEqual = true;

        Ext.Object.each(hotkey, function(key, value) {
            if(hotkey[key] !== binding[key]) {
                areEqual = false;
                return false; // stop the iteration
            }
        });

        return areEqual;
    }
});


