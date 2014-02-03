;(function(Backbone, _, Ozone) {
    'use strict';

    var Superclass = Ozone.views.CollectionView;

    var ItemView = Ozone.views.notifications.NotificationDetailsView.extend({
        tagName: 'li'
    });

    var NotificationsGroupView = Superclass.extend({
        CollectionItemView: ItemView,

        className: 'notifications-group',

        header: null,
        sourceWidgetModel: null,

        //the containing element for the individual notification views
        $container: null,

        initialize: function(options) {
            this.sourceWidgetModel = options.sourceWidgetModel;

            Superclass.prototype.initialize.apply(this, arguments);

            this.header = new Ozone.views.notifications.NotificationsSectionHeader({
                parentView: this,
                model: this.sourceWidgetModel,
                notificationsCollection: this.collection
            });
        },

        render: function() {
            this.$el
                .append(this.header.render().$el)
                .append(this.$container = $('<ol>'));

            return Superclass.prototype.render.apply(this, arguments);
        },

        addOne: function(model) {
            Superclass.prototype.addOne.call(this, model, this.$container);

            _.each(this.viewMap, function(view) {
                //make sure fuzzy dates are up to date so that they don't appear to be out
                //of order
                view.updateFuzzyDate();
            });
        },

        toggleCollapse: function() {
            this.$el.toggleClass('collapsed');
        },

        recursiveUndelegateEvents: function() {
            this.undelegateEvents();

            this.header.undelegateEvents();
            _.each(this.viewMap, function(view) {
                view.undelegateEvents();
            });
        },

        recursiveDelegateEvents: function() {
            this.delegateEvents();

            this.header.delegateEvents();
            _.each(this.viewMap, function(view) {
                view.delegateEvents();
            });
        }
    });

    $.extend(true, Ozone, { views: { notifications: {
        NotificationsGroupView: NotificationsGroupView}}});
})(window.Backbone, window._, window.Ozone);
