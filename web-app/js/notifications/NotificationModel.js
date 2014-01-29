(function(Backbone, $, _, Ozone) {
    'use strict';

    var NotificationModel = Backbone.Model.extend({
//TODO remove this function once urls are present in the data
parse: function(json) {
    return _.extend({
        sourceUrl: 'examples/walkthrough/widgets/ChannelShouter.gsp'
    }, json);
},
    });

    $.extend(true, Ozone, { notifications: { NotificationModel: NotificationModel }});
})(window.Backbone, window.$, window._, window.Ozone);
