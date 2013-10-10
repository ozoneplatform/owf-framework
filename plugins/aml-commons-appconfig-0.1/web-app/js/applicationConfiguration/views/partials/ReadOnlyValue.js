define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

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
                truncatedText: this.getTruncatedValue(this.getValueText(), 200),
                editCellDivClass: this.model.get("mutable") == true ? 'editable_cell' : null,
                helpTextClass: this.model.get("value") ? null : 'app_config_help_text',
                helpText: this.model.get("help")
            };
            
            var html =  this.template(templateParams);
            
            this.$el.append(html);
        },

        // TODO...move to utility API
        getTruncatedValue: function(val, textMaxLength, lineCount){
            if(val == undefined || val == null)
                return "";
            
            //First check the number of lines
            if(lineCount != undefined){
                var linesInVal = val.split("\n");
                //If the number of lines is greater than the line count we need to pair it down
                if(linesInVal.length > lineCount){
                    var returnVal = "";
                    for(var i = 0; i < lineCount ; i++){
                        returnVal = returnVal + linesInVal[i] + "\n";
                    } 
                    //Its possible this text length is greater than the allowed length so we need to continue processing
                    val = returnVal;
                }
            }
            
            //At this point if the length of the text is < the length of the allowed text just return the inital val
            if(val.length <= textMaxLength)
                return val;
            
            //Otherwise truncate the string....
            return val.substring(0, textMaxLength)  + "...";    
        }

    });

});