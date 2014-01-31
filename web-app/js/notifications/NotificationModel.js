(function(Backbone, $, _, Ozone) {
    'use strict';

    var NotificationModel = Backbone.Model.extend({
        parse: function(json) {
            var extSourceWidget =
                Ozone.util.findWidgetDefinitionByLongestUrlMatch(json.sourceURL);

            return {
                sourceURL: json.sourceURL || null,
                sourceWidget: extSourceWidget ?
                    Ozone.util.convertExtModelToBackboneModel(extSourceWidget) :
                    null,
                body: json.body,
                timestamp: json.timestamp
            };
        },

        toJSON: function() {
            return {
                sourceURL: this.get('sourceURL'),
                body: this.get('body'),
                timestamp: this.get('timestamp')
            };
        }
    });

    $.extend(true, Ozone, { notifications: { NotificationModel: NotificationModel }});
})(window.Backbone, window.$, window._, window.Ozone);
