(function(Backbone, _, $, Ext, Ozone, undefined) {
    'use strict';

    var Superclass = Ozone.views.BaseView,
        CollectionClass = Ozone.notifications.XMPPNotificationsCollection;

    /**
     * A Backbone view for the NotificationsButton
     */
    var NotificationsButton = Superclass.extend({

        menu: null,
        growl: null,
        badge: null,

        childView: [],

        collection: null,

        events: {
            'click': 'toggleMenu'
        },

        initialize: function(options) {
            this.collection = new CollectionClass();

            this.menu = new Ozone.views.notifications.NotificationsGroupedListView({
                collection: this.collection
            });
            this.growl = new Ozone.views.notifications.NotificationsGrowl({
                collection: this.collection
            });
            this.badge = new Ozone.views.notifications.NotificationsBadge({
                collection: this.collection
            });

            this.childViews = [this.badge, this.growl, this.menu];
        },

        render: function() {
            this.$el.append($('<button class="notifications-button"/>'));
            this.badge.$el.appendTo(this.$el);
            this.growl.render(this.$el);
            this.menu.render(this.$el);

            return this;
        },

        toggleMenu: function() {
            this.growl.hide();
            this.menu.toggle();
        },

        remove: function() {
            _.each(this.childViews, function(view) { view.remove(); });
        }
    });


    $.extend(true, Ozone, { views: { notifications: {
        NotificationsButton: NotificationsButton}}});
})(window.Backbone, window._, window.$, window.Ext, window.Ozone);
