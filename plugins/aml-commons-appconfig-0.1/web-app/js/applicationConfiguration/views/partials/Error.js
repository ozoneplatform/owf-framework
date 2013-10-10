define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    return Backbone.View.extend({

        tagName: "div",

        className: "app_config_field_error",

        errorRow : _.template("<%= message %>"),

        initialize: function(options){
            this.on("display", this.display, this);
        },
        
        render: function(){
            var errorString = "";
            var errors = this.model.get("errors");
            if(errors) {
                for(var i =0 ; i < errors.length ; i++){
                    var error = errors[i];
                    errorString = errorString + error + "\n";
                }
            }
            var err  = this.errorRow({message: errorString});
            this.$el.append(err);
        },
        
        display: function(){
            this.$el.empty();
            this.render();
            this.$el.fadeIn(300);
        },

        remove: function () {
            this.off();
            Backbone.View.prototype.remove.call(this);
        }

    });

});