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
            'dblclick .widget': '_onDblClick',
            'click .remember': '_onRememberClick',
            'click .x-tool': 'cancel',
        },

        BLANK_IMAGE_SRC: "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",

        showingOpenInstances: false,

        headerText: {
            openInstances: 'Select the component to which you would like to send this action: ',
            allInstances: 'Select the component to which you would like to send this action:'
        },

        initialize: function () {
            SuperClass.prototype.initialize.apply(this, arguments);
            _.extend(this, _.pick(this.options, 
                    ['dashboardContainer', 'matchingOpenedAppComponents', 'matchingAppComponents']));

            if(this.matchingOpenedAppComponents.length > 0) {
                this.showingOpenInstances = true;
                this.matchingOpenedAppComponents.add(new Backbone.Model({
                    id: 'new-component',
                    name: 'A new component',
                    image: this.BLANK_IMAGE_SRC,
                    newComponent: true
                }));
            }
        },

        getHeaderText: function () {
            return this.showingOpenInstances ? this.headerText.openInstances : this.headerText.allInstances;
        },

        render: function () {
                                
            this.$el.html(  '<div class="header">' +
                                '<a class="x-tool">' +
                                    '<img src="' + this.BLANK_IMAGE_SRC + '" class="x-tool-close">' +
                                '</a>' +
                                '<span>' + this.getHeaderText() + '</span>'+
                            '</div>' + 
                            '<div class="body"></div>' +
                            '<div class="footer">' + 
                                '<input type="checkbox" class="remember-checkbox">' +
                                '<label class="remember">Remember this decision</label>' + 
                            '</div>'
            );

            this.$body = this.$el.find('.body');

            this.list = new Ozone.components.appcomponents.AppComponentsList({
                collection: this.showingOpenInstances ? this.matchingOpenedAppComponents : this.matchingAppComponents
            });

            this.list.render().$el.appendTo(this.$body);

            return this;
        },

        shown: function () {
            if(this.showingOpenInstances) {
                var $lastEl = this.list.$el.children(':last-child');
                $lastEl.children('.thumb-wrap').hide();
                $lastEl.outerHeight($lastEl.prev().outerHeight(true));
            }
        },

        launch: function (model, isEnterPressed, isDragAndDrop) {
            this.hide();

            if(this.showingOpenInstances) {
                this.dashboardContainer.activeDashboard.handleAlreadyLaunchedWidget(model.attributes);
            }
            else {
                this.dashboardContainer.launchWidgets(model, isEnterPressed, isDragAndDrop);
            }
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

        _onDblClick: function (evt) {
            var model = $(evt.currentTarget).data('view').model,
                $header;

            if(this.showingOpenInstances && model.get('newComponent')) {
                this.showingOpenInstances = false;

                $header = this.$el.children('.header');
                $header.children('span').html(this.getHeaderText());

                // detach to prevent reflows
                this.$body.detach();

                this.list.remove();
                this.list = new Ozone.components.appcomponents.AppComponentsList({
                    collection: this.matchingAppComponents
                });

                this.$body.insertAfter($header);

                this.list.render().$el.appendTo(this.$body);
            }
            else {
                this.launch(model, false, false);
            }
        },

        _onRememberClick: function (evt) {
            var $checkbox = $(evt.currentTarget).siblings('.remember-checkbox');
            $checkbox.prop('checked', !$checkbox.is(':checked'));
        }

    });

})();