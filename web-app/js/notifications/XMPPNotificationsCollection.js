;(function(Backbone, $, _, Ozone) {
    var Superclass = Backbone.Collection;

    var XMPPNotificationsCollection = Superclass.extend({
        url: Ozone.util.contextPath() + '/notification',
        model: Ozone.notifications.NotificationModel,

        //sort in reverse date order
        comparator: function(model) {
            return -(moment(model.get('timestamp')).getTime());
        },

        //do not remove previous notifications when a new fetch occurs
        fetch: function(options) {
            var me = this,
                oldCount = me.size();

            return Superclass.prototype.fetch.call(me, _.defaults({
                remove: false
            }, options)).done(function() {

                //fire the fetchMore event with the number of new notifications as the
                //argument.  Since the notifications are sorted chronologically it should
                //be easy for the listener to retrieve the new notifications
                me.trigger('fetchMore', me.size() - oldCount);
            });
        },

        initialize: function() {
            Superclass.prototype.initialize.apply(this, arguments);
            this.autoFetch();
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
                        //Ozone.config.notificationPollingInterval);
                        5000); //TODO remove once the config is in place
            });
        }
    });

    $.extend(Ozone, { notifications: {
        XMPPNotificationsCollection: XMPPNotificationsCollection
    }});
})(Backbone, $, _, Ozone);
