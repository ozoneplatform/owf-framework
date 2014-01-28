;(function(Ozone, Handlebars, _) {
    'use strict';

    var Superclass = Ozone.views.notifications.NotificationsHeader;

    var collapseBtnHtml = '<span class="collapse-toggle"></span>',
        extraBtnsHtml = '<span class="count"></span>' +
            '<a href="" class="dismiss-all">Dismiss All</a>';

    var NotificationsSectionHeader = Superclass.extend({
        tag: 'h4',

        events: {
            'click .dismiss-all': 'dismissAll',
            'click .collapse-toggle': 'toggleCollapse'
        },

        /**
         * Expected options:
         *  model - A Widget Definition Model for the widget that is the source
         *  of these notifications
         *  parentView - A view that should define the function toggleCollapse
         *  notificationsCollection - A collection of notifications
         */
        initialize: function(options) {
            var updateCount = _.bind(this.updateCount, this);

            Superclass.prototype.initialize.apply(this, arguments);

            this.parentView = options.parentView;
            this.notificationCollection = options.notificationCollection;



            this.listenTo(this.notificationsCollection, {
                add: updateCount,
                remove: updateCount,
                reset: updateCount
            });
        },

        //NOTE This render function can safely be called repeatedly
        render: function() {
            Superclass.prototype.render.apply(this, arguments);

            //add the collapse/expand button and the dismiss all button
            this.$el.prepend(collapseBtnHtml).append(extraBtnsHtml);
            this.updateCount();

            return this;
        },

        dismissAll: function(e) {
            e.preventDefault();
            e.stopPropagation();

            //make a copy of the models list since iterating over the original list
            //while removing doesn't work right
            var models = _.clone(this.notificationsCollection.models);

            //since our models are not owned by our collection, the cleanest
            //way to remove the models is to remove them from the collection
            //that owns them and let the results trickle down
            _.each(models, function(model) {
                model.collection.remove(model);
            });
        },

        toggleCollapse: function() {
            this.parentView.toggleCollapse();
        },

        updateCount: function() {
            this.$('.count').text(this.notificationsCollection.size());
        }
    });

    $.extend(true, Ozone, { views: { notifications: {
        NotificationsSectionHeader: NotificationsSectionHeader }}});
})(window.Ozone, window.Handlebars, window._);
