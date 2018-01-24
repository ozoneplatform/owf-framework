;(function(Backbone, _, Handlebars, moment, Ozone) {
    'use strict';

    var Superclass = Ozone.views.notifications.NotificationView;

    var template = Handlebars.compile(
        '<span class="message">{{body}}</span>' +
        '<span class="time"></span>' +
        '<button class="close">&times;</button>'
    );

    var NotificationDetailsView = Superclass.extend({
        events: _.extend({
            'click .close': 'dismiss'
        }, Superclass.prototype.events),

        className: 'notification-details',

        fuzzyDateTimeout: null,

        render: function() {
            var me = this;

            //update the fuzzy date once every minute
            function fuzzyDateSetTimeout() {
                me.updateFuzzyDate();
                me.fuzzyDateTimeout = setTimeout(fuzzyDateSetTimeout, 60000);
            }

            this.$el.html(template(this.model.attributes));
            fuzzyDateSetTimeout();

            return this;
        },

        dismiss: function(e) {
            var collection = this.model.collection;

            if (collection) {
                collection.remove(this.model);
            }

            this.stopListening(this.model);
            this.model = null;

            e.stopPropagation();
        },

        updateFuzzyDate: function() {
            this.$('.time').text(this.fuzzyDate());
        },

        fuzzyDate: function() {
            //in some race condition that I haven't been able to track down, this.model
            //is sometimes null here
            return this.model ? moment(this.model.get('timestamp')).fromNow() :
                '-';
        },

        remove: function() {
            clearTimeout(this.fuzzyDateTimeout);
            Superclass.prototype.remove.apply(this, arguments);
        }
    });

    $.extend(true, Ozone, { views: { notifications: {
        NotificationDetailsView: NotificationDetailsView}}});
})(window.Backbone, window._, window.Handlebars, window.moment, window.Ozone);
