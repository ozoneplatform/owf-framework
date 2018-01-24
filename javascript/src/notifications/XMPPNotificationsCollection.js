;(function(Backbone, moment, $, _, Ozone) {
    'use strict';

    var Superclass = Backbone.Collection;

    var XMPPNotificationsCollection = Superclass.extend({
        url: Ozone.util.contextPath() + '/messages',
        model: Ozone.notifications.NotificationModel,

        //sort in reverse date order
        comparator: function(model) {
            return -(moment(model.get('timestamp')).unix());
        },

        //do not remove previous notifications when a new fetch occurs
        fetch: function(options) {
            var me = this,
                oldCount = me.size();

            return Superclass.prototype.fetch.call(me, _.defaults({
                remove: false,
                cache: false
            }, options)).done(function() {

                //fire the fetchMore event with the number of new notifications as the
                //argument.  Since the notifications are sorted chronologically it should
                //be easy for the listener to retrieve the new notifications
                me.trigger('fetchMore', me.size() - oldCount);
            });
        },

        initialize: function(options) {
            Superclass.prototype.initialize.apply(this, arguments);

            //if autoFetch is set in the options, immediately beging autoFetching, otherwise,
            //that method will need to be called explicitly by outside code
            if (options && options.autoFetch) this.autoFetch();
        },

        /**
         * If the collection is destroyed stop the autoFetch cycle
         */
        destroy: function() {
            clearTimeout(this.fetchTimeout);
        },

        /**
         * Use setTimeout to periodically fetch notifications
         */
        autoFetch: function() {
            var thisFn = _.bind(this.autoFetch, this);

            //after a fetch comes back, always do another one a little while later
            this.fetch().always(function() {
                this.fetchTimeout = window.setTimeout(thisFn,
                        1000 * Ozone.config.notificationsPollingInterval);
            });
        }
    });

    $.extend(Ozone, { notifications: {
        XMPPNotificationsCollection: XMPPNotificationsCollection
    }});
})(window.Backbone, window.moment, window.$, window._, window.Ozone);
