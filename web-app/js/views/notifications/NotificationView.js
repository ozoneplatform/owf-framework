;(function(Backbone, _, Handlebars, Ozone) {
    'use strict';

    var Superclass = Ozone.views.BaseView;

    /**
     * A simple view of a notification that simply displays the message
     */
    var NotificationView = Superclass.extend({
        className: 'notification',

        render: function() {
            this.$el.text(this.model.get('body'));
            return this;
        }
    });

    $.extend(true, Ozone, { views: { notifications: { NotificationView: NotificationView}}});
})(window.Backbone, window._, window.Handlebars, window.Ozone);
