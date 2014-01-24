;(function(Backbone, _, Handlebars, Ozone) {
    var Superclass = Ozone.views.BaseView;

    /**
     * A simple view of a notification that simply displays the message
     */
    var NotificationView = Superclass.extend({
        cls: 'notification',

        render: function() {
            this.$el.text(this.model.message);
            return this;
        }
    });

    $.extend(true, Ozone, { views: { notifications: { NotificationView: NotificationView}}});
})(Backbone, _, Handlebars, Ozone);
