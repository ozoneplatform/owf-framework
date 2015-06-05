define([
    '../views/base/EditableTextCell',
    '../views/partials/Error',
    'jquery',
    'underscore',
    'backbone',
    'bootstrap'
], function (EditableTextCellView, ApplicationConfigurationErrorView, $, _, Backbone) {

    /*
     * This class represents a Boolean configuration parameter
     */

    return EditableTextCellView.extend({



        className: "app_config_column_right bootstrap-active",

        template:  _.template('<input class="ios switch brand-success" type="checkbox" <% if (checked) { %> checked <% } %> />'),

        readOnlyTempate : _.template("<div> <%= value %> </div> "),

        events: {
            'change input[type="checkbox"]': 'saveBooleanApplicationConfig'
        },

        initialize: function (options) {
           this.on("refresh", this.refresh, this);
           this.listenTo(this.model, 'postSave', this.postSave);
           this.dispatcher = options.dispatcher;
        },

        postSave: function (e) {
            var $link;
            if(this.model.get("saveSuccessful")) {
                switch(this.model.get("code")) {
                    case "store.enable.scoreCard":
                        $link = $("#scoreCardQuestionsLink");
                        this.model.get("value") === "true" ? $link.fadeIn('slow') : $link.fadeOut('slow');
                        break;
                }

                this.trigger("refresh");
            } else {
                this.errorView.trigger("display");
            }
        },

        refresh: function () {
            this.$el.empty();
            this.render();
        },

        saveBooleanApplicationConfig: function (e) {
            this._saveStringApplicationConfig(e, this.model.get("value") === "true" ? "false" : "true");
        },

        render: function () {
            var html = "";
            var value = $.trim(this.model.get("value"));
            if(this.model.get("mutable") == true) {
                var html = this.template({
                    id: this.model.get("id"),
                    checked: value === "true" ? true : false
                });
            } else{
                html = this.readOnlyTempate({id: this.model.get("id"), value: value == 'true' ? "On" : "Off"});
            }

            this.$el.append(html);
            this.$el.find('input[type="checkbox"]').svitch();

            this.errorView = new ApplicationConfigurationErrorView({model: this.model});
            this.errorView.render();
            this.$el.append(this.errorView.el);
        },

        remove: function () {
            this.off();
            Backbone.View.prototype.remove.call(this);
        }

    });

});