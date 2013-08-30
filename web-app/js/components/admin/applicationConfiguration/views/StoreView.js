define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    return Backbone.View.extend({

        tagName: 'div',
        className: 'app-config-store-view',

        tpl:    '<img class="icon" src="<%= iconUrl %>"/>' + 
                '<div class="name" title="<%= name %>"><%= name %></div>' +
                '<div class="edit" title="Edit Store">&nbsp;</div>' +
                '<div class="delete" title="Delete Store">&nbsp;</div>',

        refresh: function() {
            this.$el.empty();
            this.render();
        },

        render: function() {
            this.$el.html(
                _.template(this.tpl, {
                    iconUrl: this.model.get('smallIconUrl'),
                    name: this.model.get('name')
                })
            );

            this.$el.data('store-id', this.model.get('widgetGuid'));

            return this;
        },

        remove: function() {
            this.$el.empty();
            Backbone.View.prototype.remove.call(this);
        }
    });
});