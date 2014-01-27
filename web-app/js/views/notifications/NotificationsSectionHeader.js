;(function(Ozone, Handlebars) {
    'use strict';

    var Superclass = Ozone.views.BaseView;

    var template = Handlebars.compile('<img src="{{headerIcon}}" />{{originalName}}');

    var NotificationsSectionHeader = Superclass.extend({
        tag: 'h3',
        className: 'notification-section-header',

        //NOTE This render function can safely be called repeatedly
        render: function() {
            this.$el.html(template(this.model.attributes));
        }
    });

    Ozone.views.notifications.NotificationsSectionHeader = NotificationsSectionHeader;
})(window.Ozone, window.Handlebars);
