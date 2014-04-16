(function(Backbone, _, $, Ext, JSON, Ozone, undefined) {
    'use strict';

    var Superclass = Ozone.views.BaseView,
        CollectionClass = Ozone.notifications.XMPPNotificationsCollection;

    var html = '<button class="notifications-button"/>' +
        '<span class="popover-container menu-container"></span>' +
        '<span class="popover-container growl-container"></span>';

    /**
     * A Backbone view for the NotificationsButton
     */
    var NotificationsButton = Superclass.extend({

        menu: null,
        growl: null,
        badge: null,

        childView: [],

        className: 'notifications',

        collection: null,

        //a jquery fragment that contains the internal structure of this view
        //(not counting subviews)
        childEls: null,

        events: {
            'click .notifications-button': 'toggleMenu'
        },

        modelEvents: {
            'fetchMore': 'showGrowl',
            'add': 'handleCountChange',
            'remove': 'handleCountChange',
            'reset': 'handleCountChange'
        },

        initialize: function() {
            var me = this;

            function startAutoFetch(notifications) {
                try {
                    me.collection.add(notifications, { parse: true });
                }
                catch (e) {
                    //ensure that exceptions here don't prevent autoFetch from starting
                    if (window.console) {
                        window.console.log('Exception retrieving notifications:', e);
                    }
                }
                me.collection.autoFetch();
            }

            this.collection = new CollectionClass();

            //get the user's previous undismissed notifications, and then start auto-fetching
            this.retrieveUndismissedNotifications().always(startAutoFetch);

            //on page unload, save the user's undismissed notifications
            $(window).unload(_.bind(this.saveUndismissedNotifications, this));

            this.childEls = $(html);

            //popovers don't play nice when they are
            this.menu = new Ozone.views.notifications.NotificationsGroupedListView({
                collection: this.collection,
                parentEl: this.childEls.filter('.menu-container')
            });
            this.growl = new Ozone.views.notifications.NotificationsGrowl({
                collection: this.collection,
                parentEl: this.childEls.filter('.growl-container'),
                notificationsControllerView: this
            });
            this.badge = new Ozone.views.notifications.NotificationsBadge({
                collection: this.collection
            });

            this.childViews = [this.badge, this.growl, this.menu];

            Superclass.prototype.initialize.apply(this, arguments);
        },

        render: function() {
            this.$el.append(this.childEls);
            this.badge.$el.appendTo(this.$el);
            this.growl.render();
            this.menu.render();

            return this;
        },

        toggleMenu: function() {
            this.growl.hide();
            this.menu.toggle();
        },

        remove: function() {
            _.each(this.childViews, function(view) { view.remove(); });
        },

        showGrowl: function(newNotifications) {
            //only show the growl if the notifications menu is not already open
            if (newNotifications && !this.menu.isVisible()) {
                this.growl.show();
            }
        },

        handleCountChange: function() {
            var count = this.collection.size(),
                verb = count ? 'add' : 'remove',
                method = verb + 'Class';

            this.$el[method]('has-notifications');
        },

        /**
         * Persist the currently undismissed notifications to the OWF server using the
         * preferences API
         */
        saveUndismissedNotifications: function() {
            Ozone.pref.PrefServer.setUserPreference({
                namespace: 'owf',
                name: 'current_notifications',
                value: JSON.stringify(this.collection.toJSON())
                //no callbacks since this happens on unload
            });
        },

        retrieveUndismissedNotifications: function() {
            var deferred = $.Deferred();

            Ozone.pref.PrefServer.getUserPreference({
                namespace: 'owf',
                name: 'current_notifications',
                onSuccess: function(value) {
                    deferred.resolve(JSON.parse(value.value));
                },
                onFailure: function() {
                    deferred.reject(null);
                }
            });

            return deferred.promise();
        }
    });


    $.extend(true, Ozone, { views: { notifications: {
        NotificationsButton: NotificationsButton}}});
})(window.Backbone, window._, window.$, window.Ext, window.JSON, window.Ozone);
