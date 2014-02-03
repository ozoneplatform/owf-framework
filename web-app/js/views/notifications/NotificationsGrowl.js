;(function(Backbone, _, Handlebars, Ozone) {
    'use strict';

    var Superclass = Ozone.views.BaseView;

    var moreNotificationsTemplate = Handlebars.compile('{{count}} other notifications');

    var FADE_TIMEOUT_LENGTH = 5000;

    /**
     * This view is a popover
     */
    var NotificationsGrowl = Superclass.extend(_.extend({}, Ozone.views.PopoverViewMixin, {

        className: 'notifications-growl',

        modelEvents: {
            'fetchMore': 'updateGrowl'
        },

        popoverConfig: {
            placement: 'bottom'
        },

        events: {
            'mouseenter': 'onMouseEnter',
            'mouseleave': 'onMouseLeave',
            'click .more-notifications': 'openNotifications',
            'click .close': 'hide'
        },

        sectionHeader: null,
        notificationView: null,
        $moreNotificationsEl: null,

        //the view that contains the toggleMenu method that shows the notifications menu
        notificationsControllerView: null,

        initialize: function(options) {
            this.notificationsControllerView = options.notificationsControllerView;

            Superclass.prototype.initialize.apply(this, arguments);
            Ozone.views.PopoverViewMixin.initialize.call(this, { parentEl: options.parentEl });

            this.sectionHeader = new Ozone.views.notifications.NotificationsHeader();
            this.notificationView = new Ozone.views.notifications.NotificationView();
        },

        render: function() {
            this.$moreNotificationsEl = $('<a class="more-notifications"></a>');

            this.$el
                .append($('<div class="header-container">')
                    .append(this.sectionHeader.$el)
                    .append('<button class="close">&times;</button>'))
                .append(this.notificationView.$el)
                .append(this.$moreNotificationsEl);

            Ozone.views.PopoverViewMixin.render.apply(this, arguments);

            return this;
        },

        updateGrowl: function(newNotificationCount) {
            //don't growl if no new records were fetched
            if (!newNotificationCount) return;

            var notificationToShow = this.collection.first(),
                sourceWidget = notificationToShow.get('sourceWidget') || new Backbone.Model({
                    url: null,
                    originalName: 'Unknown',
                    headerIcon: ''
                });

            //update section header
            this.sectionHeader.setModel(sourceWidget);
            this.sectionHeader.render();

            //update notification view
            this.notificationView.setModel(notificationToShow);
            this.notificationView.render();

            if (newNotificationCount > 1) {
                this.$moreNotificationsEl.html(moreNotificationsTemplate({
                    count: newNotificationCount - 1
                })).css('display', ''); //don't use show/hide methods because they get confused
                                        //when the popover hasn't rendered yet
            }
            else {
                this.$moreNotificationsEl.css('display', 'none');
            }
        },

        //start the timer that will cause the growl to fade out after awhile
        startFadeTimer: function() {
            var me = this;

            //avoid having mulitple fade timers going at once
            if (this.fadeTimeout || this.mouseIsOver) return;

            this.fadeTimeout = setTimeout(function() {
                //fade time: 1 second
                //fadeEl.fadeOut(1000);
                me.fadeTimeout = null;
                me._hide();
            }, FADE_TIMEOUT_LENGTH);
        },

        cancelFade: function() {
            if (this.fadeTimeout) {
                clearTimeout(this.fadeTimeout);
                this.fadeTimeout = null;
            }
        },

        _show: function() {
            Ozone.views.PopoverViewMixin.show.apply(this, arguments);
        },

        _hide: function() {
            Ozone.views.PopoverViewMixin.hide.apply(this, arguments);
        },

        //show the popover and start the fade timer
        show: function() {
            this._show();

            //when shown, automatically start fading
            this.startFadeTimer();
            return this;
        },

        hide: function() {
            this._hide();

            this.cancelFade();
            return this;
        },

        onMouseEnter: function() {
            this.mouseIsOver = true;
            this.cancelFade();
            this._show();
        },

        onMouseLeave: function() {
            this.mouseIsOver = false;
            this.startFadeTimer();
        },

        //open the notifications menu
        openNotifications: function() {
            this.notificationsControllerView.toggleMenu();
        }
    }));

    $.extend(true, Ozone, { views: { notifications: { NotificationsGrowl: NotificationsGrowl}}});
})(window.Backbone, window._, window.Handlebars, window.Ozone);
