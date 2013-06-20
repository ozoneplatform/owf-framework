define([    
    'jquery',
    'underscore',
    'backbone',
    'views/ApplicationConfigurationPageView',
    'views/ApplicationConfigurationStaticPageView'  
], function($, _, Backbone, ApplicationConfigurationPageView, ApplicationConfigurationStaticPageView){
    
    return  Backbone.Router.extend({

        initialize: function(options) {
            
            
            this.on('route:getGroup', function (name) {
                switch(name){
                case "data_exchange":
                    var listView = new ApplicationConfigurationStaticPageView({groupName: name});
                    break;
                case "listing_management":
                    var listView = new ApplicationConfigurationStaticPageView({groupName: name});
                    break;
                default:
                    var listView = new ApplicationConfigurationPageView({groupName: name});
                    break;
                }
            });
            
            this.on('route:show', function (actions) {
                var listView = new ApplicationConfigurationPageView({groupName: 'auditing'});
            });
        
        },      
        
        routes: {
            "config/:id": "getGroup",
            "*actions": "show"          //default view
        }
        
    
    });

});