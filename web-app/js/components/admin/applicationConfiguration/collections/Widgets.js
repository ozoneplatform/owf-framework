define([
    'underscore',
    'backbone',
    '../models/Widget'
], function (_, Backbone, Widget) {

    return Backbone.Collection.extend({

        url: '/owf/widget',

        model: Widget,

        parse: function (resp, options) {
            return _.map(resp.data, function (widget) {
                var val = _.omit(widget.value, 'namespace', 'path', 'widgetVersion');
                val.id = widget.path;
                val.widgetGuid = widget.path;
                val.name = widget.value.namespace;
                val.title = widget.value.namespace;
                val.version = widget.value.widgetVersion;
                val.image = encodeURI(decodeURI(val.image));
                return val;
            });
        }

    });

});
