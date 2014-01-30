(function(Backbone, $, _, Ozone) {
    'use strict';

    var NotificationModel = Backbone.Model.extend({
        parse: function(json) {
            var extSourceWidget =
                Ozone.util.findWidgetDefinitionByLongestUrlMatch(json.sourceURL);

            return {
                sourceURL: json.sourceUrl || null,
                sourceWidget: extSourceWidget ?
                    Ozone.util.convertExtModelToBackboneModel(extSourceWidget) :
                    null,
                body: json.body,
                timestamp: json.timestamp
            };
        }
    });

    $.extend(true, Ozone, { notifications: { NotificationModel: NotificationModel }});
})(window.Backbone, window.$, window._, window.Ozone);
