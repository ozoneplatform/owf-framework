;(function(Ozone, Handlebars) {
    'use strict';

    var Superclass = Ozone.views.BaseView;

    var template = Handlebars.compile('<img src="{{headerIcon}}" />{{originalName}}');

    var NotificationsHeader = Superclass.extend({
        tag: 'h4',
        className: 'notifications-header',

        //NOTE This render function can safely be called repeatedly
        render: function() {
            this.$el.html(template(this.model.attributes));
        }
    });

    $.extend(true, Ozone, { views: { notifications: {
        NotificationsHeader: NotificationsHeader }}});
})(window.Ozone, window.Handlebars);
