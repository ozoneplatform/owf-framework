define([    
    'jquery',
    'underscore',
    'backbone',
    '../views/base/EditableTextCellView'
], function($, _, Backbone, EditableTextCellView){
    
    /*
     * This class represents a Boolean configuration parameter
     */ 
    
    return EditableTextCellView.extend({
        
        className: "app_config_column_right",
    
        template:  _.template("<div  class=' <%= valueClass %>' id='booleanValueDiv<%= id %>'> </div> "),

        readOnlyTempate : _.template("<div id='booleanValueDiv<%= id %>'> <%= value %> </div> "),
        
        initialize: function(options){
           this.on("refresh", this.refresh, this);
           this.model.on("postSave", this.postSave, this);
        },
        
        postSave: function(e) {
            if(this.model.get("saveSuccessful")) {
                switch(this.model.get("code")) {
                    case "store.enable.scoreCard":
                        if(this.model.get("value") === "true")
                            $("#scoreCardQuestionsLink").fadeIn('slow');
                        else
                            $("#scoreCardQuestionsLink").fadeOut('slow');
                        break;
                } 
                
                this.trigger("refresh");
            } 
        },
        
        refresh: function(){
            this.$el.fadeOut('slow');
            this.$el.html(null);
            this.render();
            this.$el.fadeIn(300);
        },
        
        events: {
            "click .app_config_item_value_yes, .app_config_item_value_no": "saveBooleanApplicationConfig"
        },
                    
        saveBooleanApplicationConfig: function(e){
            this._saveStringApplicationConfig(e, this.model.get("value") === "true" ? "false" : "true");    
        },  
        
        render: function(){
            var html = "";
            var value = $.trim(this.model.get("value"));
            if(this.model.get("mutable") == true){
                var html = this.template({id: this.model.get("id"), 
                      value: value,
                      valueClass: value === 'true' ? 'app_config_item_value_yes' : 'app_config_item_value_no'});                
            } else{
                html = this.readOnlyTempate({id: this.model.get("id"), value: value == 'true' ? "On" : "Off"});
            }

            
            $(this.el).append(html);        
        }
        
    });

});