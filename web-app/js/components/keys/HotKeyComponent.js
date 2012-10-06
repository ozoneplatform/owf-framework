/*
 * A plugin that makes components disable the global keymap
 * while they are active. This is used to prevent users from using
 * hotkeys to create multiple modal windows at the same time
 */
Ext.define('Ozone.components.keys.HotKeyComponent', {
    extend: 'Ext.AbstractPlugin', 

    constructor: function (hotkey) {
        this.init = function(cmp) {

            cmp.on('show', function() {
                Ozone.KeyMap.set(hotkey);
            });
            
            cmp.on('hide', function() {
                Ozone.KeyMap.reset();

                // required so that focus doesn't stay in the window after closed/hidden
                if(cmp.getEl().contains(document.activeElement))
                    document.activeElement.blur();
            });

            cmp.on('destroy', function() {
                Ozone.KeyMap.reset();
            });
        };
    }
});
