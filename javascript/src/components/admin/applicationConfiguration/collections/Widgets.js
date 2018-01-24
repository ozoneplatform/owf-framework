define([
    'underscore',
    'backbone',
    '../models/Widget'
], function (_, Backbone, Widget) {

    // This is pretty much the same as Widgets.js used by App Components,
    // but is managed by RequireJS.
    return Backbone.Collection.extend({

        url: Ozone.util.contextPath() + '/widget',

        model: Widget,

        parse: function (resp, options) {
            return resp.data;
        }

    });

});
