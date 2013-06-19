define([
    'jquery',
    'underscore',
    'backbone',
    '../models/ApplicationConfigurationModel'
], function($, _, Backbone){

    return ApplicationConfigurationCollection = Backbone.Collection.extend({
           model: ApplicationConfigurationModel,
           url:  '../applicationConfiguration/configs'
    }); 
    
});
