define([
    '../views/base/EditableTextCell',
    'jquery',
    'underscore',
    'backbone'
], function (EditableTextCellView, $, _, Backbone) {

    return EditableTextCellView.extend({

        tagName: "div",

        className: "app_config_column_right",

        templateText:
            "<ul id='<%= id %>' class='app_config_radio_button_area'>" +
            "<% _.each(options, function(optionInfo) { %>" +
                "<li>" +
                    "<input class='app_config_radio_button' " +
                    "<% if(selectedValue === optionInfo.value) { %>" +
                    " checked='checked' " +
                    "<% } %>" +
                    "type='radio' id='<%= optionInfo.value %>' name='inside_outside_behaviors' value='<%= optionInfo.value %>'><label for='<%= optionInfo.value %>' class='app_config_radio_button_label'><%= optionInfo.description %></label><br>" +
                "<% }); %>" +
                "</li>" +
            "</ul>",

        events: {
            "click input.app_config_radio_button": "clickReact"
        },

        initialize: function(options){
            this.dispatcher = options.dispatcher;
            options.model.capturePriorValue();
        },

        clickReact: function(e){
            var me = this;
            var newValue = e.currentTarget.value;
            var lastValue = me.model.get('priorValue');

            var confirmationHandler = function(id) {
                if (id === 'yes' || id === 'ok') {
                       changeConfirmed();
                } else if (id === 'no' || id === 'cancel') {
                       changeRejected();
                }
            };

            var changeSuccess = function() {
                me.model.capturePriorValue();
            };

            var changeConfirmed = function() {
                me._saveStringApplicationConfig(e, newValue, null, changeSuccess);
            };

            var changeRejected = function() {
                $('input#' + lastValue).prop('checked', true);
            };

            if (newValue !== lastValue) {
                var confirmMsg = '';

                if (newValue === 'ALL_INSIDE') {
                    confirmMsg = 'All listings will have their visibility attribute set to Inside. '
                        + 'Continue?';
                } else if (newValue === 'ALL_OUTSIDE') {
                    confirmMsg = 'All listings will have their visibility attribute set to Outside. '
                        + 'Continue?';
                } else {
                    confirmMsg = 'Enable administrators to individually set the '
                        + 'Inside/Outside visibility attribute for each listing?';
                }

                $(e.target).confirm({
                    trigger: 'manual',
                    placement: 'bottom',
                    container: $(document.body).children('.modal-container'),
                    title: 'Changing Inside/Outside Behavior',
                    content: confirmMsg,
                    ok: changeConfirmed,
                    cancel: changeRejected
                }).confirm('toggle');
            }
        },

        //This renders the description in the text area and also in a read only div
        render: function(){
            var optionsInfo = [
                {value:'ALL_INSIDE', description:'Make All Listings Inside'},
                {value:'ALL_OUTSIDE', description:'Make All Listings Outside'},
                {value:'ADMIN_SELECTED', description:'Manual Selection by Listing'}
            ];

            var value = this.model.get('value');
            var html = _.template(this.templateText, {id: this.model.get("id"), selectedValue: value, options : optionsInfo});

            this.$el.append(html);
        }
    });
});
