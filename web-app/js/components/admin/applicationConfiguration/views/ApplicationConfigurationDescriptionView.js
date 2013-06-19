define([    
  'jquery',
  'underscore',
  'backbone' ,
  '../views/partials/ApplicationConfigurationLinkView'
], function($, _, Backbone, ApplicationConfigurationLinkView){
    
    /*
     * This class represents the title and description block of a configuration parameter
     */ 
    
    return Backbone.View.extend({
        
        tagName: "div",
        
        className:  "app_config_column_left",
        
        template:  _.template("<div  class='app_config_item_title' > <%= title %>  <br>      </div> " +
                              "<div  class='app_config_item_description'> <%= description %> </div> "),
                              
        render: function(){
            var html = this.template({title: this.model.get("title"),  description: this.model.get("description")});
            
            $(this.el).append(html);
            
            switch(this.model.get("code")) {
                case "store.enable.scoreCard":
                    this.model.set("linkId", "scoreCardQuestionsLink");
                    this.model.set("link","../scoreCardItem/show");
                    this.model.set("linkText", "Manage  Questions by clicking here.");
                    this.linkView = new ApplicationConfigurationLinkView({model: this.model});
                    this.linkView.render();
                    $(this.el).append(this.linkView.el);
                    break;
                } 
        }
    
    });

});