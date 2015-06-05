define([
    '../models/Model',
    'jquery',
    'underscore',
    'backbone'
], function(Model, $, _, Backbone){

    return Backbone.Collection.extend({
           model: Model,
           url:  './configs'
    }); 
    
});
