(function(Backbone, $, _, Ozone) {
    'use strict';

    var NotificationModel = Backbone.Model.extend({
        parse: function(json) {
            //TODO remove this testing code
            json = _.extend({
                sourceUrl: 'examples/walkthrough/widgets/ChannelShouter.gsp'
            }, json);

            var extSourceWidget = Ozone.util.findWidgetDefinitionByLongestUrlMatch(
                json.sourceUrl);

            json.sourceWidget = extSourceWidget ?
                Ozone.util.convertExtModelToBackboneModel(extSourceWidget) :
                null;

            return json;
        },
    });

    $.extend(true, Ozone, { notifications: { NotificationModel: NotificationModel }});
})(window.Backbone, window.$, window._, window.Ozone);
