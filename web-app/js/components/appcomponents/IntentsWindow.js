/*
 * Copyright 2013 Next Century Corporation 
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 ;(function () {
    
    Ozone.components.appcomponents = Ozone.components.appcomponents || {};

    var SuperClass = Ozone.components.BaseView;

    Ozone.components.appcomponents.IntentsWindow = SuperClass.extend({

        className: 'intents-window',

        events: {
            'click .widget': '_onSelect',
            'dblclick .widget': '_onDblClick',
            'click .remember': '_onRememberClick',
            'click .x-tool': 'cancel',
        },

        intent: null,

        setIntent: function (intent) {
            this.intent = intent;
            return this;
        },

        initialize: function () {
            SuperClass.prototype.initialize.apply(this, arguments);
            _.extend(this, _.pick(this.options, ['intent', 'dashboardContainer']));
        },

        render: function () {
            this.$el.html(  '<div class="header">' +
                                '<a class="x-tool">' +
                                    '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-tool-close">' +
                                '</a>' +
                                '<span>Select the components you would like to send this action to: </span>'+
                            '</div>' + 
                            '<div class="body"></div>' +
                            '<div class="footer" style="visibility: hidden;">' + 
                                '<input type="checkbox" class="remember-checkbox">' +
                                '<label class="remember">Remember this decision</label>' + 
                            '</div>'
            );

            this.$body = this.$el.find('.body');

            this.list = new Ozone.components.appcomponents.AppComponentsList({
                el: this.$body,
                collection: this.options.collection
            });

            this.list.render();

            return this;
        },

        launch: function (model) {
            this.dashboardContainer.activeDashboard.handleAlreadyLaunchedWidget(model.attributes);
            this.hide();
        },

        cancel: function () {
            this.hide();
            this.$el.trigger('cancel');
        },

        remove: function () {
            this.list.remove();
            delete this.list;

            return SuperClass.prototype.remove.call(this);
        },

        isRememberSelection: function () {
            return this.$el.find('.remember-checkbox').is(':checked');
        },

        _onSelect: function () {
            this.$el.children('.footer').css('visibility', '');
        },

        _onDblClick: function (evt) {
            var model = $(evt.currentTarget).data('view').model;
            this.launch(model);
        },

        _onRememberClick: function (evt) {
            var $checkbox = $(evt.currentTarget).siblings('.remember-checkbox');
            $checkbox.prop('checked', !$checkbox.is(':checked'));
        }

    });

})();