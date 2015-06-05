Ext.override(Ext.button.Button, {
    initComponent: function() {
        this.showFocus = true;

        this.on('afterrender', function(cmp) {
            cmp.mon(cmp.getEl(), 'mousedown', function() {
                this.showFocus = false;   
            }, cmp);
            
            cmp.mon(cmp.getEl(), 'mouseup', function() {
                this.showFocus = true;
            }, cmp);

            cmp.mon(cmp.getEl(), 'mouseout', function() {
                this.showFocus = true;
            }, cmp);
        });
        
        this.callOverridden(arguments);
    },

    onFocus: function() {
        if (this.showFocus)
            this.callOverridden(arguments);
    }
});

Ext.override(Ext.tip.Tip, {
    maxWidth: 500
});

;(function () {

    var focusColor;

    Ext.button.Button.prototype.blink = function () {
        var me = this;

        if(!Modernizr.cssanimations) {
            focusColor = focusColor || Ext.util.CSS.getRule('.x-focus', true).style.borderColor;
            me.el.frame(focusColor);
        }
        else {
            me.el.on(CSS.Animation.ANIMATION_END, function () {
                me.el.removeCls('blink');
            }, null, {
                single: true
            });
            me.el.addCls('blink');
        }
    };

})();