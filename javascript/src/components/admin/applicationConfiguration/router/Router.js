define([
    'jquery',
    'underscore',
    'backbone',
    '../collections/Collection',
    'views/Page',
    'views/StaticPage',
    'views/StoresView'
], function ($, _, Backbone, ApplicationConfigurationCollection, ApplicationConfigurationPageView, ApplicationConfigurationStaticPageView, ApplicationConfigurationStoresView) {

    return Backbone.Router.extend({

        view: null,        // current view instance
        appConfigs: {},            // a map of the app config models associated by groupName
        viewModels: {},

        container: $('body'),

        routes: {
            'config/:id': 'showGroup'
        },

        initialize: function() {
            _.bindAll(this, 'sortAndIndexModels');
            this.collection = new ApplicationConfigurationCollection();
            var me = this;
            //TODO: load with initial models already bootstrapped?
            this.collection.fetch({success: function() {
                me.sortAndIndexModels();
                me.showGroup('AUDITING');
            }});
        },

        cleanup: function () {
            this.view && this.view.remove();
            delete this.view;
        },

        showGroup: function (name) {
            this.cleanup();
            this.collection.fetch();
            switch (name) {
                case "store":
                    this.view = new ApplicationConfigurationStoresView();
                    break;
                default:
                    this.view = new ApplicationConfigurationPageView({ collection: new ApplicationConfigurationCollection() });
                    this.view.appConfigs = this.appConfigs;
                    this.view.collection.reset(this.viewModels[name]);
                    break;
            }
            this.container.append(this.view.el);
        },

        //set appConfigs to model references indexed by code
        //set viewModels to lists of model references indexed by groupName
        sortAndIndexModels: function() {
            this.appConfigs = _.groupBy(this.collection.models, function(m){ return m.get("code"); });
            this.viewModels = _.chain(this.collection.models)
                .sortBy(function(m){ return m.get("id"); })
                .groupBy(function(m){ return m.get("groupName"); })
                .value();
        }

    });
});
