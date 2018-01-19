define([
], function() {

    return {

        contextPath: (function(window) {
            var contextPath = window.location.pathname;

            // fixes 'Error: Illegal Operator !=' error in IE
            contextPath = contextPath.replace(/\;jsessionid=.*/g,'');

            // Return first part after first slash, and before second slash
            contextPath = contextPath.replace(/^\/([^\/]*).*$/, '$1');

            return '/' + contextPath;
        })(window)

    };

});