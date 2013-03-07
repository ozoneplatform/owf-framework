/**
 * @fileoverview Basic auditing capability.  Audit info is sent to the server, which then 
 *      routes the info to the lof4j handler (which can then route it to any other 
 *      needed handler).
 */

/**
 * @namespace
 */
var Ozone = Ozone || {};

/**
 * @namespace
 */
Ozone.audit = Ozone.audit || {};

/**
 * @description Basic auditing capability - meant to be called by other methods
 *    which need to send audit info to the server  
 * @since OWF 7.1.0
 *
 * @param {Object} data
 */
Ozone.audit.log = function(data) {
	
    Ozone.util.Transport.send({
        url: OWF.getContainerUrl() + '/audit',
        method: 'POST',
        onSuccess: function(response) {
        },
        autoSendVersion : false,
        content : data
    });
};
