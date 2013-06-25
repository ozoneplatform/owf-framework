define([    
    'jquery',
    'underscore',
    'backbone',
    'views/OWFConfigPage',
    'views/StaticPage'  
], function($, _, Backbone, ApplicationConfigurationPageView, ApplicationConfigurationStaticPageView){
    
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
            this.view = new ApplicationConfigurationPageView({
                groupName: name
            });
            this.container.append(this.view.el);
        }
    
    });

});