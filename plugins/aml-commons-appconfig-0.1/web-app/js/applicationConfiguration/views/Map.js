define([
    '../views/base/EditableTextCell',
    '../views/partials/Error',
    '../views/partials/FreeTextWarning',
    'jquery',
    'underscore',
    'backbone'
], function(EditableTextCellView, ApplicationConfigurationErrorView, FreeTextWarningView, $, _, Backbone){

    /*
     * This is pretty specific to a configuration item that is a map and is associated with an image.
     * If other views of this type crop up its best to rename this one to the config item name
     * and use this to seed a more generic key/value pair view.
     */
    return EditableTextCellView.extend({

        keyValueDelimeter: "::",

        tagName: "div",

        className: "app_config_column_right",

        // Added float lefts here to get the read-only box for the span to be the right size
        template:      _.template("<div class= 'app_config_map_row'>" +
                                        "<img src='<%= value %>'  class='application_config_edit_value editable_cell_image' /> " +
                                        "<textarea class='app_config_text_area application_config_key'    id='textAreaKey<%= id %>'><%= key %></textarea>" +
                                        "<textarea class='app_config_text_area application_config_value'  id='textAreaValue<%= id %>'><%= value %></textarea>" +
                                        "<span class='<%= editCellDivClass %>' id='editableTextAreaCell<%= id %>'> <%= truncatedText %> </span>" +
                                 "</div>"),

        editKey:       _.template("<img src='<%= value %>' class='application_config_edit_value editable_cell_image' /> "),

        events: {
            "blur  .application_config_key, .application_config_value"  : "saveStringApplicationConfigValueAsMap",
            "click .application_config_edit_value"                      : "enabledCellEditingValue",
            "click .application_config_edit_key"                        : "enabledCellEditingKey"
        },

        initialize: function(options) {
            this.on("refresh", this.refresh, this);
            this.model.on("postSave", this.postSave, this);
        },

        postSave: function(e) {
            if(this.model.get("saveSuccessful")) {
                this.trigger("refresh");
            } else {
                this.errorView.trigger("display");
            }
        },

        refresh: function(){
            this.$el.empty();
            this.render();
        },

        //This enables the appropriate text area when the image is clicked (in this case the key part of the param)
        enabledCellEditingKey: function(e){
            var appConfigMapRow = $(e.target).parent();   //The parent element is the div 'app_config_map_row'

            var elementToShow = appConfigMapRow.find(".application_config_key:first");
            var elementToHide = $(e.target);

            this.freeTextWarningView.showFreeTextWarning();
            this._enabledCellEditing(e, elementToShow, elementToHide);
        },

        //This enables the appropriate text area when the image is clicked (in this case the value part of the param)
        enabledCellEditingValue: function(e){
            var appConfigMapRow = $(e.target).parent();   //The parent element is the div 'app_config_map_row'

            var elementToShow = appConfigMapRow.find(".application_config_value:first");
            var elementToHide = appConfigMapRow.find("span:first");

            this.freeTextWarningView.showFreeTextWarning();
            this._enabledCellEditing(e, elementToShow, elementToHide);
        },

        //TODO this should be using the same paradigm as String view where it delegates to ApplicationConfigurationEditableValueView.js
        _enabledCellEditing: function(e, elementToShow, elementToHide, callback){

            elementToHide.hide(300, function(){
                elementToShow.fadeIn('slow');               //show the text area
                elementToShow.focus();                      //Give the control focus
                if(typeof callback === 'function'){
                    callback();
                }
            });
        },


        //Saves if the action comes from a value element
        saveStringApplicationConfigValueAsMap: function(e){
            var me = this;
            var val = this.getValueMap();
            this._saveStringApplicationConfig(e, val);
        },

        validateImage: function(imageSelector){
            var me = this;
            $(imageSelector).error(function() {
                  var image = $(this);
                  image.attr("src", me._defaultImage);
                  image.next().next().val(me._defaultImage);
            });
        },

        //This constructs the value for the parameter that will be send back to the server side
        getValueMap: function(){
            var me = this;
            var val = "";
            this.$el.find('.app_config_map_row').each(function(){
                var key =  $(this).find(".application_config_key").val();
                var value =  $(this).find(".application_config_value").val();
                val = val + (key + me.keyValueDelimeter + value + ",");
            });

            return $.trim(val.substring(0, val.length - 1));
        },

        //This renders the description in the text area and also in a read only div
        render: function(){

            //The config values in a collection are split by commas
            var line = this.model.get("value").split(",");

            var html = "";

            //TODO if each one of these was a view then when we call render only the one line would be rendered
            for (i = 0, l = line.length; i < l; i++) {

                //Splitting the line on the delimeter will get the keyValue array
                var keyValue = line[i].split(this.keyValueDelimeter);
                var key, value = null;

                if(keyValue.length > 1){
                    //Get the key/value from this line
                    key   = $.trim(keyValue[0]);
                    value = $.trim(keyValue[1]);

                    html = html + this.template({
                        id: this.model.get("id") + "_" + i,
                        key:   key,
                        value: value,
                        truncatedText: key,
                        editCellDivClass: this.model.get("mutable") == true ? 'editable_cell application_config_edit_key' : 'non_editable_cell'
                    });
                }
            }

            this.$el.append(html);

            this.freeTextWarningView = new FreeTextWarningView({ model: this.appConfigs["free.warning.content"][0] });
            this.freeTextWarningView.render();
            this.$el.append(this.freeTextWarningView.el);

            this.errorView = new ApplicationConfigurationErrorView({model: this.model});
            this.errorView.render();
            this.$el.append(this.errorView.el);

            //Not sure why an event doesnt work for onerror, but this does the trick
            this.validateImage(".editable_cell_image");
        },

        remove: function () {
            this.off();
            this.model.off("postSave", this.postSave, this);
            this.errorView.remove();
            this.freeTextWarningView.remove();
            Backbone.View.prototype.remove.call(this);
        }

    });
});