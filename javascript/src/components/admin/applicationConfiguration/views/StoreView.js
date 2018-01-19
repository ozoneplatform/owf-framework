define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var SuperClass = Backbone.View;

    return SuperClass.extend({

        tagName: 'div',
        className: 'app-config-store-view',

        tpl:    '<img class="icon" src="<%= iconUrl %>"/>' + 
                '<div class="name" title="<%= name %>"><%= name %></div>' +
                '<div class="edit" title="Edit Store">&nbsp;</div>' +
                '<div class="delete" title="Delete Store">&nbsp;</div>',

        initialize: function (options) {
            SuperClass.prototype.initialize.call(this, options);
            this.listenTo(this.model, 'change', _.bind(this.render, this));
        },

        render: function() {
            var compiled = _.template(this.tpl);
            this.$el.html(
            	compiled({
                    iconUrl: this.model.get('smallIconUrl'),
                    name: this.model.get('name')
                })
            );

            this.$el.data('store-id', this.model.get('widgetGuid'));

            return this;
        }
    });
});