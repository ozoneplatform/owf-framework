;(function(Backbone, _, Handlebars, Ozone) {
    var Superclass = Ozone.views.BaseView;

    var moreNotificationsTemplate = Handlebars.compile('<span class="notification-icon"></span>' +
        '{{count}} other notifications');

    /**
     * This view is a popover
     */
    var NotificationsGrowl = Superclass.extend(_.extend({}, Ozone.views.PopoverViewMixin, {
        modelEvents: {
            'fetchMore': 'updateGrowl'
        },

        sectionHeader: null,
        notificationView: null,
        $moreNotificationsEl: null,

        initialize: function() {
            Superclass.prototype.initialize.apply(this, arguments);
            this.sectionHeader = new Ozone.views.notifications.NotificationsSectionHeader();
            this.notificationView = new Ozone.views.notifications.NotificationView();
        },

        innerRender: function(parentEl) {
            this.$moreNotificationsEl = $('<div class="more-notifications"/>');

            this.$el
                .append('<button class="close"></button>')
                .append(this.sectionHeader.$el)
                .append(this.notificationView.$el)
                .append(this.$moreNotificationsEl);
        },

        updateGrowl: function(newNotificationCount) {
            //don't growl if no new records were fetched
            if (!newNotificationCount) return;

            var notificationToShow = this.collection.first(),
                sourceUrl = notificationToShow.get('sourceUrl'),
                extSourceWidget = Ozone.util.findWidgetDefinitionByLongestUrlMatch(sourceUrl),
                sourceWidget = Ozone.util.convertExtModelToBackboneModel(extSourceWidget);

            //update section header
            this.sectionHeader.setModel(sourceWidget);
            this.sectionHeader.render();

            //update notification view
            this.notificationView.setModel(notificationToShow);
            this.notificationView.render();

            if (newNotificationCount > 1) {
                this.$moreNotificationsEl.html(moreNotificationsTemplate({
                    count: newNotificationCount - 1
                })).show();
            }
            else {
                this.$moreNotificationsEl.hide();
            }
        }
    }));

    $.extend(true, Ozone, { views: { notifications: { NotificationsGrowl: NotificationsGrowl}}});
})(Backbone, _, Handlebars, Ozone);
