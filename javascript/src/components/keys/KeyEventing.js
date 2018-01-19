(function() {

    gadgets.rpc.register("_widget_iframe_ready", function(sender) {
        var widget = Ext.getCmp(Ozone.util.parseJson(sender).id);
        if(widget) {
            widget.iframeReady = true;
        }
    });

    gadgets.rpc.register("_key_eventing", function (sender, msg) {
        var E = Ext,
            el;

        //document.body.focus();
        if(msg.focusParent) {
            el = E.get(sender);
            if (el) el.blur();
        }

        if(!msg.keydown) {
            Ozone.KeyMap.handleKey(E.apply(msg, {
                fromWidget: true
            }), sender);
        }
        else {
            Ozone.MoveKeyMap.handleKey(E.apply(msg, {
                fromWidget: true
            }), sender);
        }
    });

})();
