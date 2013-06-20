define([    
    'jquery',
    'underscore',
    'backbone',
    '../views/partials/ApplicationConfigurationReadOnlyValueView',
    '../views/partials/ApplicationConfigurationEditableValueView',  
    '../views/base/EditableTextCellView',
    '../views/partials/ApplicationConfigurationErrorView'
], function($, _, Backbone
                , ApplicationConfigurationReadOnlyValueView
                , ApplicationConfigurationEditableValueView
                , EditableTextCellView
                , ApplicationConfigurationErrorView){
    
    return EditableTextCellView.extend({
        
        tagName: "div",
        
        className: "app_config_column_right",
                
        initialize: function(options){
           this.showInImage = options.showInImage;
           this.on("openForEdit", this.enabledCellEditing, this);
           this.on("refresh", this.refresh, this);
           this.model.on("postSave", this.postSave, this);
        },
                           
        events: {
            "blur  .app_config_text_area": "saveStringApplicationConfig",
            "click .editable_cell" : "enabledCellEditing"
        },

        postSave: function(e) {
            if(this.model.get("saveSuccessful")) {
                this.editableValueView.trigger("closeForEdit");
                this.trigger("refresh");
            } else {
                this.errorView.trigger("display");
            }
        },
        
        refresh: function(){
            this.$el.html(null);
            this.render();
        },
        
        enabledCellEditing: function(e){
            console.log("editing");
            this.editableValueView.trigger("openForEdit");
            this.readOnlyValueView.$el.hide();
        },
                
        //Use value from input to update model and reset the form
        saveStringApplicationConfig: function(e){
            this._saveStringApplicationConfig(e, this.editableValueView.getVal());
        },
        
        
        //This renders the description in the text area and also in a read only div
        render: function(){

            this.editableValueView = new ApplicationConfigurationEditableValueView({model: this.model});
            this.editableValueView.render();
            $(this.el).append(this.editableValueView.el);   
            
            //Attache the read only part to this element
            this.readOnlyValueView  = new ApplicationConfigurationReadOnlyValueView({model: this.model, showInImage : this.showInImage});
            this.readOnlyValueView.render();            
            $(this.el).append(this.readOnlyValueView.el);

            this.errorView = new ApplicationConfigurationErrorView({model: this.model});
            this.errorView.render();
            $(this.el).append(this.errorView.el);

            var defaultImage = this._defaultImage;      
            $(".editable_cell_image").error(function() {
                  $(this).attr("src", defaultImage);
            });
        }
    });
});