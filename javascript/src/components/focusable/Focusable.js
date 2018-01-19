/*
 * A plugin for making any Ext component use the x-focus css class.
 * This plugin's constructor takes a string that is the name
 * of the childEl that should be watched for focus and blur events.
 * If a falsey value is passed in, the 'el' attribute is used instead.
 *
 * The second parameter (also optional) is the name of the css
 * class to apply on focus.  Defaults to x-focus
 */
Ext.define('Ozone.components.focusable.Focusable', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.focusable',

    constructor: function(focusElName, focusCls) {
        this.init = function(cmp) {

            cmp.on('afterrender', function() {
                var el = focusElName ? cmp[focusElName] : cmp.el;

                Ozone.components.focusable.Focusable.setupFocus(el, cmp, focusCls);
            });
        };
    }
});

/*
 * The real work of the Focusable plugin.
 * This is exposed as an external function so that it can be used
 * on things besides Ext components.  
 */
Ozone.components.focusable.Focusable.setupFocus = function(el, observable, focusCls) {
    focusCls = focusCls || 'x-focus';
    el = Ext.get(el);
    
    //if is optional, but highly recommended, to pass an observable in
    //so that the listeners attached here will have a lifecycle. 
    //If no observable is passed in, create a dummy one
    observable = observable || Ext.create('Ext.util.Observable');

    if(!el)
        return;

    var allowFocus = true;

    observable.mon(el, 'focus', function(evt, dom) {
        if (allowFocus) {
            Ext.fly(dom).addCls(focusCls);
        }
    });

    observable.mon(el, 'blur', function(evt, dom) {
        Ext.fly(dom).removeCls(focusCls);
    });

    observable.mon(el, 'mousedown', function() {
        //do not show the border form mouse events
        allowFocus = false;
    });

    function enableBorder() {
        allowFocus = true;
    }

    observable.mon(el, {
        mouseup: enableBorder, 
        mouseout: enableBorder
    });

    Ozone.components.focusable.Focusable.clearOutline(el);
};

Ozone.components.focusable.Focusable.clearOutline = function(el) {
    el = Ext.get(el);

    if(!el)
        return;
    
    el.dom.tabIndex = 0;

    el.dom.hideFocus = true;        //hide dotted outline in IE7
    el.dom.style.outlineStyle = 'none'; //hide dotted outline in IE8
};
