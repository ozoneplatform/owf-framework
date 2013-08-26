define([
    'underscore',
    'backbone'
], function (_, Backbone) {

    return Backbone.Model.extend({

        defaults: {
            version: 1.0,
            visible: true,
            singleton: false,
            background: false,
            height: 200,
            width: 200,
            widgetTypes: ['standard']
        },

        isStore: function () {
            return _.contains(this.get('widgetTypes'), 'store');
        }
    });
});
