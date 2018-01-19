define([
    './Page'
], function(Page){

    return Page.extend({

        initialize: function(options) {
            Page.prototype.initialize.apply(this, arguments);
        }
    });
});
