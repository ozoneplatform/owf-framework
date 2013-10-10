define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    return Backbone.View.extend({

        template:   _.template("<textarea class='app_config_text_area' id='textArea<%= id %>'><%= value %></textarea>"),
            
        
        initialize: function(options){
            this.on("openForEdit", this.openForEdit);
            this.on("closeForEdit", this.closeForEdit);
        },
        
        openForEdit: function(){
            this.$txtArea = this.$el.find(".app_config_text_area:first");
            this.$txtArea.show("slow");
            this.$txtArea.focus();
        },

        closeForEdit: function(){
            this.$txtArea.hide();
        },
        
        render: function(){
            var templateParams = {
                    id: this.model.get("id"), 
                    value: $.trim(this.model.get("value"))
            };
            
            var html = this.template(templateParams);
            
            this.$el.append(html);
            return this;
        },
        
        getVal: function(){
            return this.$txtArea.val();
        },

        remove: function () {
            this.off();
            Backbone.View.prototype.remove.call(this);
        }

    });

});