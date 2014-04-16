    ;(function(Backbone, _, Ozone) {
    'use strict';

    var Superclass = Ozone.views.BaseView;

    var headerHtml = '<h3 class="notification-list-header">Notifications</h3>';

    var NotificationsGroupedListView = Superclass.extend(_.extend({},
            Ozone.views.PopoverViewMixin, {

        className: 'notifications-grouped-list',

        //map from message sourceURL to UI section
        sections: null,

        modelEvents: {
            'add': 'addToSection',
            'remove': 'removeFromSection'
        },

        popoverConfig: {
            placement: 'bottom'
        },

        initialize: function(options) {
            Superclass.prototype.initialize.apply(this, arguments);

            this.sections = {};

            Ozone.views.PopoverViewMixin.initialize.call(this, {
                parentEl: options.parentEl,
                preventClickClose: true
            });
        },

        render: function() {
            this.$el.append(headerHtml);
            this.renderSections();

            Ozone.views.PopoverViewMixin.render.apply(this, arguments);
            return this;
        },

        renderSections: function() {
            var me = this,
                sourceWidgets = _.unique(this.collection.map(function(model) {
                    return me.getSourceWidget(model);
                }), null, function(sourceWidget) {
                    //compute uniqueness based on the sourceWidget's URL
                    return sourceWidget.get('url');
                }),
                //NOTE This only works assuming that the sourceURL === the sourceWidget's url
                groupedWidgets = this.collection.groupBy('sourceURL');



            _.each(sourceWidgets, function(widget) {
                var url = widget ? widget.get('url') : null;

                if (me.sections[url]) {
                    throw new Error("Duplicate sections being created");
                }

                me.makeSection(widget, groupedWidgets[url]);
            });
        },

        addToSection: function(model) {
            var sourceWidget = this.getSourceWidget(model),
                url = sourceWidget.get('url'),
                section = this.sections[url] || this.makeSection(sourceWidget);

            section.collection.add(model);
        },

        removeFromSection: function(model) {
            var sourceWidget = this.getSourceWidget(model),
                url = sourceWidget.get('url'),
                section = this.sections[url];

            if (section) {
                section.collection.remove(model);

                /*
                 * normally this would happen automatically, but
                 * it turns out that backbone prevents remove events for models that
                 * are owned by a different collection from having any effect, so the remove
                 * listener in the section does not get called
                 */
                section.removeOne(model);

                if (section.collection.isEmpty()) {
                    delete this.sections[url];
                    section.remove();
                }
            }
        },

        dismissAll: function() {
            _.each(this.sections, function(section) {
                section.collection.reset();
            });

            this.collection.reset();
        },

        fakeSourceWidget: function(sourceURL) {
            return new Backbone.Model({
                url: sourceURL,
                originalName: 'Unknown',
                headerIcon: ''
            });
        },

        getSourceWidget: function(model) {
            return model.get('sourceWidget') || this.fakeSourceWidget(model.get('sourceURL'));
        },

        /**
         * Create a section for the given source URL, with the given optional starting collection
         */
        makeSection: function(sourceWidget, models) {
            var collection = this.makeCollection(models);

            var section = new Ozone.views.notifications.NotificationsGroupView({
                sourceWidgetModel: sourceWidget,
                collection: collection
            });

            this.$el.append(section.render().$el);
            this.sections[sourceWidget.get('url')] = section;

            return section;
        },

        makeCollection: function(models) {
            var collection = new Backbone.Collection(models);
            collection.comparator = this.collection.comparator;

            return collection;
        },

        //to deal with popover issues, remove and re-add events on hide-show
        hide: function() {
            Ozone.views.PopoverViewMixin.hide.apply(this, arguments);

            _.each(this.sections, function(section) {
                section.recursiveUndelegateEvents();
            });
        },

        show: function() {
            Ozone.views.PopoverViewMixin.show.apply(this, arguments);

            _.each(this.sections, function(section) {
                section.delegateEvents();
                section.recursiveDelegateEvents();
            });
        }
    }));

    $.extend(true, Ozone, { views: { notifications: {
        NotificationsGroupedListView: NotificationsGroupedListView}}});
})(window.Backbone, window._, window.Ozone);
