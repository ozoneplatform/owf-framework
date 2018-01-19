Ozone = Ozone || {};
Ozone.components = Ozone.components || {};
Ozone.components.keys = Ozone.components.keys || {};

Ozone.components.keys.createKeyEventSender = function(widgetEventingController) {
    var keyChannelName = '_keyEvent',
        rpc = gadgets.rpc,
        callrpc = rpc.call;

    
    rpc.register('_focus_widget_window', function() {
        try {
            window.focus();
        }
        catch(e) {}
    });

    callrpc('..', '_widget_iframe_ready', null, widgetEventingController.getWidgetId());

    owfdojo.connect(document, 'on' + Ozone.components.keys.EVENT_NAME, this, function(keyevent) {
        var keys = Ozone.components.keys.HotKeys,
            key, found = false;

        for (var key_i in keys) {
            key = keys[key_i];

            if (key.key === keyevent.keyCode 
                && key.alt === keyevent.altKey
                && key.shift === keyevent.shiftKey) {

                if(key.focusParent === true) {
                    parent.focus();
                    //window.blur();
                }

                callrpc('..', '_key_eventing', null, widgetEventingController.getWidgetId(), {
                    keyCode: keyevent.keyCode,
                    altKey: keyevent.altKey,
                    shiftKey: keyevent.shiftKey,
                    focusParent: key.focusParent
                });

                found = true;
                break;  //in case the same key is in keys twice, we still only want
                        //to send one event
            }
        }

        if(found === true) {
            return;
        }

        keys = Ozone.components.keys.MoveHotKeys;

        for (var key_i in keys) {
            key = keys[key_i];

            if (key.key === keyevent.keyCode 
                && key.ctrl === keyevent.ctrlKey
                && key.alt === keyevent.altKey
                && key.shift === keyevent.shiftKey) {
                
                callrpc('..', '_key_eventing', null, widgetEventingController.getWidgetId(), {
                    keyCode: keyevent.keyCode,
                    ctrlKey: keyevent.ctrlKey,
                    altKey: keyevent.altKey,
                    shiftKey: keyevent.shiftKey,
                    focusParent: key.focusParent
                });

                break;
            }
        }
    });

    owfdojo.connect(document, 'onkeydown', this, function(keyevent) {
        var keys = Ozone.components.keys.MoveHotKeys,
            key;

        for (var key_i in keys) {
            key = keys[key_i];

            if (key.key === keyevent.keyCode 
                && key.ctrl === keyevent.ctrlKey
                && key.alt === keyevent.altKey
                && key.shift === keyevent.shiftKey) {

                callrpc('..', '_key_eventing', null, widgetEventingController.getWidgetId(), {
                    keyCode: keyevent.keyCode,
                    ctrlKey: keyevent.ctrlKey,
                    altKey: keyevent.altKey,
                    shiftKey: keyevent.shiftKey,
                    keydown: true,
                    focusParent: key.focusParent
                });

                break;
            }
        }
    });
};
