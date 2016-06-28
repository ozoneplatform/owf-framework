/**
 * Ext 4.0.7 does not officially support IE11 and does not correctly detect it.  This
 * monkey-patches the isIE flag so that all IE versions are correctly detected.  Note that this
 * does not detect MS Edge
 */
;(function() {
    'use strict';

    //http://stackoverflow.com/a/23159778
    //http://stackoverflow.com/a/22082397
    Ext.isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

    //TODO detect IE10 if necessary.  Right now IE10 has isIE === true but there is no
    //isIE10 flag

    Ext.isIE = Ext.isIE || Ext.isIE11;
})();
