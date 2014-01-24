(function(Backbone, $) {
    var Superclass = Ozone.views.BaseView;

    var NotificationsBadge = Superclass.extend({
        cls: 'notification-badge',

        tag: 'span',

        modelEvents: {
            'add': 'updateCount',
            'remove': 'updateCount'
        },

        //update the count in the UI and show or hide the badge as necessary
        updateCount: function() {
            var count = this.collection.size();

            if (!this.isRendered()) this.render();

            this.$el.text(count);
            this[this.count ? 'show' : 'hide']();
        }
    });

    $.extend(true, Ozone, { views: {notifications: { NotificationsBadge: NotificationsBadge}}});
})(Backbone, $);
