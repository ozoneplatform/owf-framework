(function(Backbone, $, _, Ozone) {
    'use strict';

    var NotificationModel = Backbone.Model.extend({
        parse: function(json) {
            var extSourceWidget = Ozone.util.findWidgetDefinitionByLongestUrlMatch(
                //TODO remove this testing code
                'examples/walkthrough/widgets/ChannelShouter.gsp');

            return {
                sourceUrl: json.sourceUrl || null,
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
