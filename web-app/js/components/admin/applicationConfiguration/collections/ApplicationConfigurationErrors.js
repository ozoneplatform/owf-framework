define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    return ApplicationConfigurationErrors = Backbone.Collection.extend({
        url:  './configs/validate'
    });

});
