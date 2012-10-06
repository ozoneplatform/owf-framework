//Constructor for our custom keymap object that extends 
//Ext.util.KeyMap
Ext.define('Ozone.components.keys.MoveKeyMap', {
    extend: 'Ext.util.KeyMap',
    alternateClassName: 'Ozone.MoveKeyMap',
    singleton: true,

    constructor: function() {
        this.callParent([document, [], 'keydown']);
    },

    addBinding: function (binding) {
        function doApply(item) {
            Ext.applyIf(item, {
                shift: true,
                alt: false
            });
        }

        Ext.isArray(binding) ? Ext.each(binding, doApply) : doApply(binding);

        this.callParent(arguments);
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
                && binding.ctrl === keyevent.ctrlKey
                && binding.shift === keyevent.shiftKey) {

                var id = sender ? Ozone.util.parseJson(sender).id : null;

                binding.fn.call(binding.scope, keyevent.keyCode, keyevent, id);

                return false; //stop the iteration
            }
        });
    }
});


