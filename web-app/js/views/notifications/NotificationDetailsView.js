;(function(Backbone, _, Handlebars, moment, Ozone) {
    var Superclass = Ozone.views.notifications.NotificationView;

    var template = Handlebars.compile(
        '<span class="message">{{message}}</span>' +
        '<span class="time">{{relativeTime}}</span>' +
        '<span class="close"></span>'
    );

    var NotificationDetailsView = Superclass.extend({
        events: {
            '.close': 'dismiss'
        },

        render: function() {
            //for the template, use the model attributes plus a fuzzy time string
            var attrs = _.extend({
                relativeTime: moment(this.model.get('timestamp')).fromNow()
            }, this.model.attributes);

            this.$el.html(template(attrs));

            return this;
        },

        dismiss: function() {
            var collection = this.model.collection;

            if (collection) {
                collection.remove(this.model);
            }
        }
    });

    $.extend(true, Ozone, { views: { notifications: {
        NotificationDetailsView: NotificationDetailsView}}});
})(Backbone, _, Handlebars, moment, Ozone);
