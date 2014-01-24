;(function(Ozone, Handlebars) {
    var Superclass = Ozone.views.BaseView;

    var template = Handlebars.compile('<img src="{{headerIcon}}" />{{originalName}}');

    var NotificationsSectionHeader = Superclass.extend({
        tag: 'h3',
        cls: 'notification-section-header',

        //NOTE This render function can safely be called repeatedly
        render: function() {
            this.$el.html(template(this.model.attributes));
        }
    });

    Ozone.views.notifications.NotificationsSectionHeader = NotificationsSectionHeader;
})(Ozone, Handlebars);
