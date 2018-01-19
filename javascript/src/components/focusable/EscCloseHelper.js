Ext.define('Ozone.components.focusable.EscCloseHelper', {

    //sets up the proper listeners to return focus to 
    //a particular element (usually of a parent window)
    //on close.  This mixin should be used when an element 
    //clsoes on esc and you need to catch the escape keyup 
    //afterwards to prevent the banner from focusing
    setupFocusOnEsc: function (targetEl, useSpecialKey) {
        function focus() {
            targetEl.focus();
        }

        function handler(evt) {

            function escUpHandler() {
                Ext.defer(focus, 1);
                this.un('keyup', arguments.callee); //remove this event handler once it is called
            }
        
            //Typically, the component will close on ESC, resulting in
            //either the document or the body getting focus (depending on the
            //browser).  We need to catch the resulting keyup and redirect
            //focus after it
            var el = Ext.isFF3_6 ? Ext.getDoc() : Ext.getBody();

            if (evt.getKey() === evt.ESC) 
                el.on(Ozone.components.keys.EVENT_NAME, escUpHandler, el);
        }

        if (useSpecialKey)
            //use the specialkey event instead of keydown
            this.on('specialkey', function (ed, field, evt) {
                handler(evt);
            });
        else
            this.mon(this.getEl(), 'keydown', handler);

        //focus the target El on any non-ESC related close as well
        this.on('close', focus);
    }

});
