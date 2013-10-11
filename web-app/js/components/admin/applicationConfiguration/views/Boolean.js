define([
    '../views/base/EditableTextCell',
    'jquery',
    'underscore',
    'backbone'
], function(EditableTextCellView, $, _, Backbone){
    
    /*
     * This class represents a Boolean configuration parameter
     */ 
    
    return EditableTextCellView.extend({
        
        className: "app_config_column_right",
    
        template:  _.template("<div  class=' <%= valueClass %>' id='booleanValueDiv<%= id %>'> </div> "),

        readOnlyTempate : _.template("<div id='booleanValueDiv<%= id %>'> <%= value %> </div> "),
        
        events: {
            "click .app_config_item_value_yes, .app_config_item_value_no": "saveBooleanApplicationConfig"
        },
        
        initialize: function(options){
           this.on("refresh", this.refresh, this);
           this.model.on("postSave", this.postSave, this);
           this.dispatcher = options.dispatcher;
        },
        
        postSave: function(e) {
            var $link;
            if(this.model.get("saveSuccessful")) {
                switch(this.model.get("code")) {
                    case "store.enable.scoreCard":
                        $link = $("#scoreCardQuestionsLink");
                        this.model.get("value") === "true" ? $link.fadeIn('slow') : $link.fadeOut('slow');
                        break;
                } 
                
                this.trigger("refresh");
            } 
        },
        
        refresh: function(){
            this.$el.empty();
            this.render();
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

            
            this.$el.append(html);        
        },

        remove: function () {
            this.off();
            this.model.off("postSave", this.postSave, this);
            Backbone.View.prototype.remove.call(this);
        }
        
    });

});