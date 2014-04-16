;(function(Ozone) {
    'use strict';

    var Superclass = Ozone.views.BaseView;

    var NotificationsHeader = Superclass.extend({
        tag: 'h4',
        className: 'notifications-header',

        //NOTE This render function can safely be called repeatedly
        render: function() {
            this.$el.empty();

            //only add the image if we have a url
            if (this.model.get('headerIcon')) {
                this.$el.append($('<img>').attr('src', this.model.get('headerIcon')));
            }

            this.$el.append(document.createTextNode(this.model.get('originalName')));

            return this;
        }
    });

    $.extend(true, Ozone, { views: { notifications: {
        NotificationsHeader: NotificationsHeader }}});
})(window.Ozone);
