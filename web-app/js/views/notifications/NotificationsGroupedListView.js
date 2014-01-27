;(function(Backbone, _, Ozone) {
    'use strict';

    var Superclass = Ozone.views.BaseView;

    var headerHtml = '<h2 class="notification-list-header">Notifications' +
        '<span class="close"></span>' +
    '</h2>';

    var NotificationsGroupedListView = Superclass.extend(_.extend({},
            Ozone.views.PopoverViewMixin, {
        //map from message sourceUrl to UI section
        sections: {},

        //map from sourceUrl to collection
        collections: {},

        modelEvents: {
            'add': 'addToSection',
            'remove': 'removeFromSection'
        },

        popoverConfig: {
            placement: 'bottom'
        },

        innerRender: function() {
            this.$el.append(headerHtml);
            this.renderSections();
        },

        renderSections: function() {
            var urls = _.unique(this.collection.map(function(model) {
                    return model.get('sourceUrl');
                })),
                groupedWidgets = this.collection.groupBy('url'),
                me = this;

            _.each(urls, function(url) {
                if (me.sections[url]) {
                    throw new Error("Duplicate sections being created");
                }

                var section = me.makeSection(url, new Backbone.Collection(groupedWidgets[url]));

                me.$el.append(section.render().$el);
                me.sections[url] = section;
            });
        },

        addToSection: function(model) {
            var url = model.get('url'),
                section = this.sections[url] || this.makeSection(url);

            section.collection.add(model);
        },

        removeFromSection: function(model) {
            var url = model.get('url'),
                section = this.sections[url];

            if (section) section.collection.remove(model);
        },

        /**
         * Create a section for the given source URL, with the given optional starting collection
         */
        makeSection: function(sourceUrl, collection) {
            var extSourceWidget = Ozone.util.findWidgetDefinitionByLongestUrlMatch(sourceUrl),
                sourceWidget = Ozone.util.convertExtModelToBackboneModel(extSourceWidget),
                section = new Ozone.view.notifications.NotifcationsGroupView({
                    sourceWidget: sourceWidget,
                    collection: collection || new Backbone.Collection()
                });

            return section;
        }
    }));

    $.extend(true, Ozone, { views: { notifications: {
        NotificationsGroupedListView: NotificationsGroupedListView}}});
})(window.Backbone, window._, window.Ozone);
