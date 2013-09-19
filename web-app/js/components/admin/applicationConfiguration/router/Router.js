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

        // current view instance
        view: null,

        container: $('body'),

        routes: {
            'config/:id': 'getGroup'
        },

        initialize: function() {
            var me = this;
            this.collection = new ApplicationConfigurationCollection();
            this.collection.fetch().complete(function() {
                me.getGroup('AUDITING');
            });
        },

        cleanup: function () {
            this.view && this.view.remove();
            delete this.view;
        },

        getGroup: function (name) {
            this.cleanup();
            switch (name) {
                case "store":
                    this.view = new ApplicationConfigurationStoresView();
                    break;
                default:
                    this.view = new ApplicationConfigurationPageView({
                        collection: new ApplicationConfigurationCollection()
                    });
                    this.setModelsOnView(name);
                    break;
            }
            this.container.append(this.view.el);
        },

        setModelsOnView: function(groupName) {
            var viewModels = [];
            var me = this;
            this.collection.each(function(mod) {
                var code = mod.get("code")
                if(code === "free.warning.content") {
                    me.view.freeTextWarningModel = mod;
                }
                if(mod.get("groupName") === groupName) {
                    viewModels.push(mod);
                }
            });

            this.view.collection.reset(viewModels);
        }
    });
});