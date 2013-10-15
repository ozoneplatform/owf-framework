define([
    '../views/partials/ReadOnlyValue',
    '../views/partials/EditableValue',
    '../views/base/EditableTextCell',
    '../views/partials/Error',
    '../views/partials/FreeTextWarning',
    'jquery',
    'underscore',
    'backbone'
], function(ApplicationConfigurationReadOnlyValueView,
            ApplicationConfigurationEditableValueView,
            EditableTextCellView,
            ApplicationConfigurationErrorView,
            FreeTextWarningView,
            $, _, Backbone){

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
            this.$el.empty();
            this.render();
        },

        enabledCellEditing: function(e){
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
            this.$el.append(this.editableValueView.el);

            //Attache the read only part to this element
            this.readOnlyValueView  = new ApplicationConfigurationReadOnlyValueView({model: this.model, showInImage : this.showInImage});
            this.readOnlyValueView.render();
            this.$el.append(this.readOnlyValueView.el);

            this.errorView = new ApplicationConfigurationErrorView({model: this.model});
            this.errorView.render();
            this.$el.append(this.errorView.el);

            this.freeTextWarningView = new FreeTextWarningView({ model: this.appConfigs["free.warning.content"][0] });
            this.freeTextWarningView.render();
            this.$el.append(this.freeTextWarningView.el);

            this.freeTextWarningView.listenTo(this.editableValueView, 'openForEdit', this.freeTextWarningView.showFreeTextWarning);
            this.freeTextWarningView.listenTo(this.editableValueView, 'closeForEdit', this.freeTextWarningView.hideFreeTextWarning);

            var defaultImage = this._defaultImage;
            $(".editable_cell_image").error(function() {
                  $(this).attr("src", defaultImage);
            });
        },

        remove: function () {
            this.off();
            this.editableValueView.remove();
            this.readOnlyValueView.remove();
            this.errorView.remove();
            this.freeTextWarningView.remove();
            Backbone.View.prototype.remove.call(this);
        }
    });
});