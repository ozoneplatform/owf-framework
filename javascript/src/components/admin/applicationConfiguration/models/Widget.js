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
            mobileReady: false,
            height: 200,
            width: 200,
            widgetTypes: ['standard']
        },

        parse: function (widget) {
            var val = _.omit(widget.value, 'namespace', 'path', 'widgetVersion');
            val.id = widget.path;
            val.widgetGuid = widget.path;
            val.name = widget.value.namespace;
            val.title = widget.value.namespace;
            val.version = widget.value.widgetVersion;
            val.image = encodeURI(decodeURI(val.image));
            return val;
        },

        isStore: function () {
            return _.contains(this.get('widgetTypes'), 'store');
        }
    });
});
