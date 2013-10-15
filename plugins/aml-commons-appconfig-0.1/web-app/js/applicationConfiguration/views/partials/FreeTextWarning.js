define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    return Backbone.View.extend({

        tagName: "div",

        className: "app_config_free_text_warning",

        template: _.template("<%= message %>"),

        render: function() {
            this.$el.empty();
            return this;
        },

        showFreeTextWarning: function() {
            var message = this.model.get("value");
            var html = this.template({
                message: message ? message : ""
            });
            this.$el.html(html);
            this.$el.show();
            return false;
        },

        hideFreeTextWarning: function() {
            this.$el.hide();
            return false;
        },

        remove: function () {
            Backbone.View.prototype.remove.call(this);
        }
    });

});