(function(Backbone, window, undefined) {
    var NotificationModel = Backbone.Model.extend();

    $.extend(true, Ozone, { notifications: { NotificationModel: NotificationModel }});
})(Backbone, window);
