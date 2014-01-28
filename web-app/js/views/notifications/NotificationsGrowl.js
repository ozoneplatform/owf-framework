;(function(Backbone, _, Handlebars, Ozone) {
    'use strict';

    var Superclass = Ozone.views.BaseView;

    var moreNotificationsTemplate = Handlebars.compile('<span class="notification-icon"></span>' +
        '{{count}} other notifications');

    var FADE_TIMEOUT_LENGTH = 5000;

    /**
     * This view is a popover
     */
    var NotificationsGrowl = Superclass.extend(_.extend({}, Ozone.views.PopoverViewMixin, {
        modelEvents: {
            'fetchMore': 'updateGrowl'
        },

        popoverConfig: {
            placement: 'bottom'
        },

        //events: {
            //'mouseenter': 'onMouseEnter',
            //'mouseleave': 'onMouseLeave'
        //},

        sectionHeader: null,
        notificationView: null,
        $moreNotificationsEl: null,

        initialize: function(options) {
            Superclass.prototype.initialize.apply(this, arguments);
            Ozone.views.PopoverViewMixin.initialize.call(this, { parentEl: options.parentEl });

            this.sectionHeader = new Ozone.views.notifications.NotificationsHeader();
            this.notificationView = new Ozone.views.notifications.NotificationView();

            this.$el.on({
                'mouseenter': _.bind(this.onMouseEnter, this),
                'mouseleave': _.bind(this.onMouseLeave, this)
            });
        },

        render: function() {
            this.$moreNotificationsEl = $('<div class="more-notifications"/>');

            this.$el
                .append('<button class="close"></button>')
                .append(this.sectionHeader.$el)
                .append(this.notificationView.$el)
                .append(this.$moreNotificationsEl);

            Ozone.views.PopoverViewMixin.render.apply(this, arguments);

            return this;
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
        },

        //start the timer that will cause the growl to fade out after awhile
        startFadeTimer: function() {
            var fadeEl = this.$el,
                me = this;

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
console.debug('onMouseEnter');
            this.mouseIsOver = true;
            this.cancelFade();
            this._show();
        },

        onMouseLeave: function() {
console.debug('onMouseLeave');
            this.mouseIsOver = false;
            this.startFadeTimer();
        }
    }));

    $.extend(true, Ozone, { views: { notifications: { NotificationsGrowl: NotificationsGrowl}}});
})(window.Backbone, window._, window.Handlebars, window.Ozone);
