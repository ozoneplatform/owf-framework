Ext.define('Ozone.components.WidgetAlerts', {

    //Creates a simple alert with an Ok button that
    //the user cannot tab out of until it is closed
    showAlert: function(title, msg) {
        //Set the messagebox to use display:none to hide otherwise
        //the circular focus of the editor will break
        Ext.Msg.hideMode = 'display';

        var alert = Ext.Msg.show({
            title: title,
            msg: msg,
            buttons: Ext.Msg.OK,
            closable: false,
            modal: true,
            width: this.ownerCt.width * .7
        });
        var okBtnEl = alert.down('button').btnEl;
            
        var onKeyDown = function(event) {
            if(event.keyCode === Ext.EventObject.TAB) {
                //Disable tabbing out of the alert
                event.stopEvent();
            }
        };

        okBtnEl.on('keydown', onKeyDown);

        alert.on('hide', function() {
            okBtnEl.un('keydown', onKeyDown);
        }, this, {single: true});
    },

    //Creates a confirmation with an Ok and Cancel button that
    //the user cannot tab out of until it is ok'ed or canceled
    showConfirmation: function(title, msg, closeFn) {
        //Set the messagebox to use display:none to hide otherwise
        //the circular focus of the editor will break
        Ext.Msg.hideMode = 'display';
        
        var alert = Ext.Msg.show({
            title: title,
            msg: msg,
            buttons: Ext.Msg.OKCANCEL,
            closable: false,
            modal: true,
            scope: this,
            listeners: null,
            fn: closeFn,
            width: this.ownerCt.width * .7
        });

        var buttons = alert.query('button'),
            okBtn, cancelBtn;

        for(var i = 0; i < buttons.length; i++) {
            if(buttons[i].itemId === 'ok') {
                okBtn = buttons[i];
            }
            else if(buttons[i].itemId === 'cancel') {
                cancelBtn = buttons[i];
            }
        }

        var onKeyDownOkBtn = function(event) {
            if(event.keyCode === Ext.EventObject.TAB) {
                event.stopEvent();
                Ext.defer(function() {
                    cancelBtn.focus();
                }, 1);
            }
        };
        var onKeyDownCancelBtn = function(event) {
            if(event.keyCode === Ext.EventObject.TAB) {
                event.stopEvent();
                Ext.defer(function() {
                    okBtn.focus();
                }, 1);
            }
        };

        okBtn.el.on('keydown', onKeyDownOkBtn);
        cancelBtn.el.on('keydown', onKeyDownCancelBtn);

        alert.on('hide', function() {
            okBtn.el.un('keydown', onKeyDownOkBtn);
            cancelBtn.el.un('keydown', onKeyDownCancelBtn);
        }, this, {single: true});
    }
});