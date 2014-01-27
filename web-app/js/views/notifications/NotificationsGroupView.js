;(function(Backbone, _, Ozone) {
    'use strict';

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
})(window.Backbone, window._, window.Ozone);
