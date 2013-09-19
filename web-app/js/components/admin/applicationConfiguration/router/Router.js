define([
    'jquery',
    'underscore',
    'backbone',
    '../collections/Collection',
    'views/OWFConfigPage',
    'views/StaticPage',
    'views/StoresView'
], function ($, _, Backbone, ApplicationConfigurationCollection, ApplicationConfigurationPageView, ApplicationConfigurationStaticPageView, ApplicationConfigurationStoresView) {

    return Backbone.Router.extend({

        view: null,        // current view instance
        appConfigs: null,            // a map of the app config models associated by groupName
        freeTextWarningModel: null,

        container: $('body'),

        routes: {
            'config/:id': 'showGroup'
        },

        initialize: function() {
            var me = this;
            var configs = new ApplicationConfigurationCollection();
            configs.fetch().complete(function() {
                me.appConfigs = _.chain(configs.models)
                                 .sortBy(function(mod) {
                                     if(mod.get("code") === "free.warning.content") { me.freeTextWarningModel = mod }
                                     return mod.get("id");
                                 })
                                 .groupBy(function(mod) { return mod.get("groupName"); })
                                 .value();
                me.showGroup('AUDITING');
            });
        },

        cleanup: function () {
            this.view && this.view.remove();
            delete this.view;
        },

        showGroup: function (name) {
            this.cleanup();
            switch (name) {
                case "store":
                    this.view = new ApplicationConfigurationStoresView();
                    break;
                default:
                    this.view = new ApplicationConfigurationPageView({
                        collection: new ApplicationConfigurationCollection()
                    });
                    this.view.freeTextWarningModel = this.freeTextWarningModel;
                    this.view.collection.reset(this.appConfigs[name]);
                    break;
            }
            this.container.append(this.view.el);
        }
    });
});