define([
    'backbone',
    './Widget'
], function (Backbone, Widget) {

    return Widget.extend({

        initialize: function() {
            this.defaults = this.defaults || {};
            this.defaults.widgetTypes = ['store'];
        },

        validate: function (attrs, options) {
            if (!attrs.displayName || attrs.displayName === '') {
                return 'name cannot be empty';
            }

            if (!attrs.iconUrl || attrs.iconUrl === '') {
                return 'icon URL cannot be empty'
            }
        }
    });
});
