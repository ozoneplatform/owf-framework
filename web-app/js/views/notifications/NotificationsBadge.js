;(function(Backbone, $, Ozone) {
    'use strict';

    var Superclass = Ozone.views.BaseView;

    var NotificationsBadge = Superclass.extend({
        className: 'notification-badge',

        tagName: 'strong',

        modelEvents: {
            'add': 'updateCount',
            'remove': 'updateCount',
            'reset': 'updateCount'
        },

        //update the count in the UI and show or hide the badge as necessary
        updateCount: function() {
            var count = this.collection.size();

            if (count > 99) count = '99+';

            if (!this.isRendered()) this.render();

            this.$el.text(count);
        }
    });

    $.extend(true, Ozone, { views: {notifications: { NotificationsBadge: NotificationsBadge}}});
})(window.Backbone, window.$, window.Ozone);
