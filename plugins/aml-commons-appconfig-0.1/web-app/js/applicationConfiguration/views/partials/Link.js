define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    return Backbone.View.extend({

        tagName: "div",
        template:   _.template("<div class='app_config_pageLink'> <a href='<%= link %>' class='pageLink' id='<%= linkId %>' style='<%= isVisible %>'><%= linkText %></a></div>"),
            
        
        initialize: function(options){
            this.on("showLink", this.showLink);
            this.on("hideLink", this.hideLink);
        },
        
        showLink: function(){
            this.$txtArea = this.$el.find(".pageLink:first");
            this.$txtArea.fadeIn('slow');
        },

        hideLink: function(){
            this.$txtArea = this.$el.find(".pageLink:first");
            this.$txtArea.fadeOut('slow');
        },
        
        render: function(){
            var visible = "";
            if(this.model.get("value") === "false")
                visible = 'display: none;';
                
            var templateParams = {
                    linkId: this.model.get("linkId"), 
                    link: this.model.get("link"),
                    linkText: this.model.get("linkText"),
                    isVisible:visible
            }
            
            var html = this.template(templateParams);
            
            this.$el.append(html);
        },

        remove: function () {
            this.off();
            Backbone.View.prototype.remove.call(this);
        }
    });

});