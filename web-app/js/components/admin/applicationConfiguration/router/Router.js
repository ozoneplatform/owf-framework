define([
    'jquery',
    'underscore',
    'backbone',
    'views/OWFConfigPage',
    'views/StaticPage',
    'views/StoresView'
], function ($, _, Backbone, ApplicationConfigurationPageView, ApplicationConfigurationStaticPageView, ApplicationConfigurationStoresView) {

    return Backbone.Router.extend({

        // current view instance
        view: null,

        container: $('body'),

        routes: {
            'config/:id': 'getGroup',
            '*actions': 'show'          //default view
        },

        cleanup: function () {
            this.view && this.view.remove();
            delete this.view;
        },

        show: function () {
            this.cleanup();
            this.view = new ApplicationConfigurationPageView({
                groupName: 'auditing'
            });
            this.container.append(this.view.el);
        },

        getGroup: function (name) {
            this.cleanup();
            switch (name) {
                case "store":
                    this.view = new ApplicationConfigurationStoresView();
                    break;
                default:
                    this.view = new ApplicationConfigurationPageView({
                        groupName: name
                    });
                    break;
            }
            this.container.append(this.view.el);
        }

    });

});