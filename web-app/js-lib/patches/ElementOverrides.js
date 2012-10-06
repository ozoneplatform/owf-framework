(function() {

    // PATCH BEGIN
    var opacityRe = /alpha\(opacity=(.*)\)/i;
    var trimRe = /^\s+|\s+$/g;
    var focusRe = /button|input|textarea|select|object/;
    // PATCH END

    Ext.apply(Ext.Element.prototype, {


        setOpacity: function(opacity, animate) {
            var me = this,
                dom = me.dom,
                val,
                style;

            if (!me.dom) {
                return me;
            }

            style = me.dom.style;

            if (!animate || !me.anim) {
                // PATCH BEGIN
                if (!Ext.supports.Opacity || (Ext.isIE9 && document.compatMode === "BackCompat")) {
                // PATCH END
                    opacity = opacity < 1 ? 'alpha(opacity=' + opacity * 100 + ')': '';
                    val = style.filter.replace(opacityRe, '').replace(trimRe, '');

                    style.zoom = 1;
                    style.filter = val + (val.length > 0 ? ' ': '') + opacity;
                }
                else {
                    style.opacity = opacity;
                }
            }
            else {
                if (!Ext.isObject(animate)) {
                    animate = {
                        duration: 350,
                        easing: 'ease-in'
                    };
                }
                me.animate(Ext.applyIf({
                    to: {
                        opacity: opacity
                    }
                },
                animate));
            }
            return me;
        },

        clearOpacity: function() {
            var style = this.dom.style;
            // PATCH BEGIN
            if(!Ext.supports.Opacity || (Ext.isIE9 && document.compatMode === "BackCompat")){
            // PATCH END
                if(!Ext.isEmpty(style.filter)){
                    style.filter = style.filter.replace(opacityRe, '').replace(trimRe, '');
                }
            }else{
                style.opacity = style['-moz-opacity'] = style['-khtml-opacity'] = '';
            }
            return this;
        },

        focusable: function(){
            // OWF-4308
            // When clicking on disabled items, dom.nodeName is undefined
            try {
                var dom = this.dom,
                    nodeName = dom.nodeName.toLowerCase(),
                    canFocus = false,
                    //check for -1 added as part of patch.  At least on chrome, tabIndex is never NaN
                    hasTabIndex = !isNaN(dom.tabIndex) && dom.tabIndex !== -1;
                
                if (!dom.disabled) {
                    if (focusRe.test(nodeName)) {
                        canFocus = true;
                    } else {
                        canFocus = nodeName == 'a' ? dom.href || hasTabIndex : hasTabIndex;
                    }
                }
                return canFocus && this.isVisible(true);
            }
            catch(e) {
                return false;
            }
        }

    });
})();
