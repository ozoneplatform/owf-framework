;(function(Backbone, _, Ozone) {
    var Superclass = Ozone.views.CollectionView;

    var ItemView = Ozone.views.notifications.NotificationDetailsView.extend({
        tag: 'li'
    });

    var NotificationsGroupView = Superclass.extend({
        tag: 'ol',
        CollectionItemView: ItemView
    });

    $.extend(true, Ozone, { views: { notifications: {
        NotificationsGroupView: NotificationsGroupView}}});
})(Backbone, _, Ozone);
