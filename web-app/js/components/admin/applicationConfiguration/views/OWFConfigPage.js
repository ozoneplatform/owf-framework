define([
    './Page'
], function(Page){
  
    /*
    * This is the entry point for the views.  This class will fetch the data, iterate through it
    * and call the ItemView for each record.
    */ 
    return Page.extend({

        initialize: function(options) {
            Page.prototype.initialize.apply(this, arguments);
            this.fetchAndRender();
        }
        
    });
});
