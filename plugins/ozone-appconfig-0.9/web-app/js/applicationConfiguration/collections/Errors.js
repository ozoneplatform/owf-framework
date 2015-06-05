define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

    return Backbone.Collection.extend({
        url:  './configs/validate'
    });

});
