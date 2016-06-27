/**
 * Ext 4.0.7 does not officially support IE11 and does not correctly detect it.  This
 * monkey-patches the isIE flag so that all IE versions are correctly detected.  Note that this
 * does not detect MS Edge
 */
;(function() {
    'use strict';

    Ext.isIE = "ActiveXObject" in window;
})();
