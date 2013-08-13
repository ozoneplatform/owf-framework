/*
 * This file contains constant definitions that define global OWF hotkeys
 */

Ozone = Ozone || {};
Ozone.components = Ozone.components || {};
Ozone.components.keys = Ozone.components.keys || {};
Ozone.components.keys.EVENT_NAME = 'keyup'; //keyup only fires once, which is what we want. keydown may fire repeatedly
Ozone.components.keys.HotKeys = Ozone.components.keys.HotKeys || {};
Ozone.components.keys.MoveHotKeys = Ozone.components.keys.MoveHotKeys || {};

(function() {
    var k = Ozone.components.keys.HotKeys;
    
    /*
    * keys are defined here.  Each key is defined
    * as the Ext.EventObject constant representing
    * that key. Unfortunately, since this file is
    * included both container side and widget side, 
    * it cannot actually use the Ext.EventObject constants
    * since Ext is not defined widget side. Therefore
    * we use the owfdojo constants and ascii codes, which happen
    * to all be the same as the Ext constants.  
    */
    k.SETTINGS = {
        key: 'S'.charCodeAt(0),
        exclusive: true
    }; 
    
    k.ADMINISTRATION= {
        key: 'A'.charCodeAt(0),
        exclusive: true
    };

    k.MARKETPLACE= {
        key: 'M'.charCodeAt(0),
        exclusive: true
    };

    k.METRIC= {
        key: 'R'.charCodeAt(0),
        exclusive: true
    };

    k.LAUNCH_MENU = { key: 'F'.charCodeAt(0) };

    k.HELP = {
        key: 'H'.charCodeAt(0),
        exclusive: false
    };

    k.LOGOUT = { key: 'O'.charCodeAt(0) }; //O for 'out'

    k.PREVIOUS_DASHBOARD = { key: owfdojo.keys.PAGE_UP }; 
    
    k.NEXT_DASHBOARD = { key: owfdojo.keys.PAGE_DOWN };

    k.DASHBOARD_SWITCHER = {
        key: 'C'.charCodeAt(0),
        exclusive: true
    };
    
    k.WIDGET_SWITCHER = {
        key: 'Q'.charCodeAt(0),
        exclusive: true
    }; 
    
    k.DEFAULT_DASHBOARD = { key: owfdojo.keys.HOME };
    
    k.CLOSE_WIDGET = { key: 'W'.charCodeAt(0) }; 
    
    k.MAXIMIZE_COLLAPSE_WIDGET = { 
        key: owfdojo.keys.UP_ARROW,
        focusParent: false
    };
    
    k.MINIMIZE_EXPAND_WIDGET = { 
        key: owfdojo.keys.DOWN_ARROW,
        focusParent: false
    };
    
    k.ESCAPE_FOCUS = { 
        key: owfdojo.keys.ESCAPE,
        //the escape key should not use alt+shift
        alt: false,
        shift: false
    };

    // hash map of key codes
    var keyCodes = {};

    //Add shift and alt modifiers to 
    //all keys that don't already have
    //them. Default to requiring both
    //shift and alt
    for (var key_i in k) {
        var hotKey = k[key_i];

        if (hotKey.alt === undefined) {
            hotKey.alt = true;
        }
        if (hotKey.shift === undefined) {
            hotKey.shift = true;
        }
        if (hotKey.focusParent === undefined) {
            hotKey.focusParent = true;
        }
        keyCodes[hotKey.key] = hotKey;
    }

    // for owf specific hotkeys, prevent default on keydown
    // this is necessary for IE
    function preventDefaultOnKeyDown(event) {
        var hotKey = keyCodes[event.keyCode];

        if(hotKey && event.altKey === hotKey.alt && event.shiftKey === hotKey.shift) {
            if(event.preventDefault) {
                event.preventDefault();
            }
            else {
                event.returnValue = false;
            }
        }
    }

    if(document.addEventListener) {
        document.addEventListener('keydown', preventDefaultOnKeyDown);
    }
    else {
        document.attachEvent('onkeydown', preventDefaultOnKeyDown);
    }

    var moveKeys = Ozone.components.keys.MoveHotKeys;
    moveKeys.MOVE_UP = {
        key: owfdojo.keys.UP_ARROW
    };
    moveKeys.MOVE_RIGHT = {
        key: owfdojo.keys.RIGHT_ARROW
    };
    moveKeys.MOVE_DOWN = {
        key: owfdojo.keys.DOWN_ARROW
    };
    moveKeys.MOVE_LEFT = {
        key: owfdojo.keys.LEFT_ARROW
    };

    for (key_i in moveKeys) {
        var hotKey = moveKeys[key_i];

        if (hotKey.ctrl === undefined) {
            hotKey.ctrl = true;
        }
        if (hotKey.alt === undefined) {
            hotKey.alt = false;
        }
        if (hotKey.shift === undefined) {
            hotKey.shift = false;
        }
        if (hotKey.focusParent === undefined) {
            hotKey.focusParent = false;
        }
    }
})();

