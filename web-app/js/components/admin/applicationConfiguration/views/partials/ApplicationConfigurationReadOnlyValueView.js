define([
    'jquery',
    'underscore',
    'backbone',
    'marketplace'
], function($, _, Backbone, Marketplace){

    return Backbone.View.extend({

        tagName: "div",

        valueInDivTemplate:      _.template("<div class='<%= editCellDivClass %> <%= helpTextClass %>' title='<%= helpText %>' id='editableTextAreaCell<%= id %>'> <%= truncatedText %> </div>"),
        
        valueInImageTemplate :   _.template("<div class='<%= editCellDivClass %>' id='editableTextAreaCell<%= id %>'> <img class='editable_cell_image' src='<%= value %>' /></div>"),
        
        
        initialize: function(options){
            this.template = options.showInImage == true ? this.valueInImageTemplate : this.valueInDivTemplate;
        },

                
        getValueText: function() {
            return this.model.get("value") ? this.model.get("value") : this.model.get("help");
        },
        
        
        render: function(){
            var templateParams = {
                    id: this.model.get("id"), 
                    value: $.trim(this.model.get("value")),
                    truncatedText: Marketplace.getTruncatedValue(this.getValueText(), 200),
                    editCellDivClass: this.model.get("mutable") == true ? 'editable_cell' : null,
                    helpTextClass: this.model.get("value") ? null : 'app_config_help_text',
                    helpText: this.model.get("help")
            }
            
            var html =  this.template(templateParams);
            
            $(this.el).append(html);
        }

    });

});