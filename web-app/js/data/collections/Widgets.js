;(function () {
    
    Ozone.data.collections = Ozone.data.collections || {};

    Ozone.data.collections.Widgets = Backbone.Collection.extend({

        url: Ozone.util.contextPath() + '/prefs/widgetList',

        parse: function (resp, options) {
            return _.map(resp.rows, function (widget) {
                var val = widget.value;
                val.id = widget.path;
                val.image = encodeURI(decodeURI(val.image));
                return val;
            });
        },

        findWidgetsByType: function (type) {
            var widgets = [];

            this.each(function (widget) {
                if(widget.data.widgetTypes[0].name === type) {
                    widgets.push(widget);
                }
            });

            return widgets;
        }

    });

})();