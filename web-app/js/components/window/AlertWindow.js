Ext.define('Ozone.components.window.AlertWindow', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: ['widget.alertwindow','widget.Ozone.components.window.AlertWindow'],

    resizable: false,
    buttonAlign: 'center',
    focusOnClose: null,

    dashboardContainer: null,

    initComponent: function() {
        var me = this;

        me.buttons = [
            {
                text: 'OK',
                itemId: 'ok',
                scope: this
            }
        ];

        if(me.showCancelButton !== false) {
            me.buttons.push({
                text: 'Cancel',
                itemId: 'cancel',
                scope: this
            });
        }

        me.on('afterrender', function() {
            var el = me.getEl();

            var okBtn = me.down('#ok');
            var okBtnEl = okBtn.getEl();

            if(me.showCancelButton !== false) {
                var cancelBtn = me.down('#cancel');
                var cancelBtnEl = cancelBtn.getEl();

                me.defaultFocus = cancelBtn;

                if(me.initialConfig.cancelText && me.showCancelButton !== false) {
                    cancelBtn.setText(me.initialConfig.cancelText);
                }

                me.cancelKeyMap = new Ext.util.KeyMap(cancelBtnEl, {
                    key: [Ext.EventObject.ENTER],
                    fn: me.onCancelBtnEnter,
                    scope: me
                });

                cancelBtn.on('click', function(btn, e) {
                    me.close();
                });

                //Set up circular focus on buttons
                me.setupFocus(el,cancelBtnEl);
            }
            else {
                me.defaultFocus = okBtn;
                // Set up circular focus on buttons
                me.setupFocus(el,okBtnEl);
            }

            if(me.initialConfig.okText) {
                okBtn.setText(me.initialConfig.okText);
            }

            //Set up KeyMaps on buttons for enter
            me.okKeyMap = new Ext.util.KeyMap(okBtnEl, {
                key: [Ext.EventObject.ENTER],
                fn: me.onOkBtnEnter,
                scope: me
            });

            //Set up click handlers
            okBtn.on('click', function(btn, e) {
                if(me.initialConfig.okFn) {
                    me.initialConfig.okFn();
                }
                me.skipCancelFn = true;
                me.close();
            });

            //Ensure its on top
            // me.dashboardContainer && me.mon(el, 'show', function() {
            //     this.dashboardContainer.floatingWidgetManager.register(this);
            //     this.dashboardContainer.floatingWidgetManager.bringToFront(this);
            // });

            //Set up focus css on buttons
            me.mon(el,'focus',function() {
                el.removeCls('x-focus');
                me.initialConfig.firstEl ? me.initialConfig.firstEl.focus() : okBtn.focus();
            });
        });

        //Clean up listeners, keymaps, and focus next element
        me.on('beforeclose', function() {
            me.down('#ok').clearListeners();
            
            var cancelBtn;
            if(cancelBtn = me.down('#cancel'))
                cancelBtn.clearListeners();

            me.clearListeners();

            me.okKeyMap.destroy();
            me.cancelKeyMap && me.cancelKeyMap.destroy();

            if(me.focusOnClose) {
                me.focusOnClose.focus();  
            }

            //cancelFn done on close unless from okBtn press so it can 
            //occur whether cancel is pressed or the window is x'ed out
            if(!me.skipCancelFn && me.initialConfig.cancelFn) {
                me.initialConfig.cancelFn();
            }
        });

        me.callParent(arguments);
    },

    onCancelBtnEnter: function() {
        var me = this;
        
        //Destroy this keymap so it only fires once
        me.cancelKeyMap.destroy();

        //Remove click listener so close occurs on keyup
        me.down('#cancel').clearListeners();

        //Close on keyup, necessary so keyup event can be 
        //stopped before bubbling down to the calling class
        me.on('keyup', function(e) {
            if(me.initialConfig.cancelFn) {
                me.initialConfig.cancelFn();
            }

            e.stopEvent();

            me.skipCancelFn = true;
            me.close();
        }, me, { element: 'el' });
    },

    onOkBtnEnter: function() {
        var me = this;

        //Destroy this keymap so it only fires once
        me.okKeyMap.destroy();

        //Remove click listener so close occurs on keyup
        me.down('#ok').clearListeners();

        //Close on keyup, necessary so keyup event can be 
        //stopped before bubbling down to the calling class
        me.on('keyup', function(e) {
            if(me.initialConfig.okFn) {
                me.initialConfig.okFn();
            }

            e.stopEvent();
            
            me.skipCancelFn = true;
            me.close();
        }, me, { element: 'el' });
    }
});