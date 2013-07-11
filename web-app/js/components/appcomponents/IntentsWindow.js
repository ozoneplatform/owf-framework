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
            'dblclick .widget': '_onComponentDblClick',
            'mousedown .widget': '_onComponentMouseDown',
            'click .remember': '_onRememberClick',
            'click .x-tool': 'cancel',
            'click .show-new-component': '_showNewComponentView'
        },

        BLANK_IMAGE_SRC: "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",

        isShowingOpenInstances: false,

        noOfNewComponentsToShowAtOnce: 18,

        headerText: {
            openInstances: 'Select the component to which you would like to send this action: ',
            allInstances: 'Select the new component to which you would like to send this action:'
        },

        initialize: function () {
            SuperClass.prototype.initialize.apply(this, arguments);
            _.extend(this, _.pick(this.options, 
                    ['dashboardContainer', 'matchingOpenedAppComponents', 'matchingAppComponents']));

            this.isShowingOpenInstances = this.matchingOpenedAppComponents.length > 0;
        },

        getHeaderText: function () {
            return this.isShowingOpenInstances ? this.headerText.openInstances : this.headerText.allInstances;
        },

        render: function () {
                                
            this.$el.html(  '<div class="header">' +
                                '<a class="x-tool">' +
                                    '<img src="' + this.BLANK_IMAGE_SRC + '" class="x-tool-close">' +
                                '</a>' +
                                '<span>' + this.getHeaderText() + '</span>'+
                            '</div>' + 
                            '<div class="body"></div>' +
                            '<div class="footer"></div>'
            );
            this.$body = this.$el.find('.body');

            this.renderSubView()
                .renderFooter();

            return this;
        },

        renderSubView: function () {
            this.list = new Ozone.components.appcomponents.AppComponentsList({
                collection: this.isShowingOpenInstances ? this.matchingOpenedAppComponents : this.matchingAppComponents
            });

            this.list.render().$el.appendTo(this.$body);
            return this;
        },

        renderFooter: function () {
            var footerHTML = '';
            if(this.isShowingOpenInstances) {
                footerHTML += '<p>OR Choose a <a href="#" class="show-new-component">new component</a></p>';
            }
            
            footerHTML += '<input type="checkbox" class="remember-checkbox">' +
                            '<label class="remember">Remember this decision</label>';

            this.$el.children('.footer').html(footerHTML);
            return this;
        },

        shown: function () {
            // show maximum of 3 rows
            if(!this.isShowingOpenInstances && this.matchingAppComponents.length > 18) {
                var $first = this.list.$el.children(':first-child');
                this.list.$el.css({
                    height: ($first.outerHeight(true) * 3)
                });
            }
        },

        launch: function (model, isEnterPressed, isDragAndDrop) {
            this.hide();

            if(this.isShowingOpenInstances) {
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

        _showNewComponentView: function (evt) {
            evt.preventDefault();
            this.isShowingOpenInstances = false;

            $header = this.$el.children('.header');
            $header.children('span').html(this.getHeaderText());

            // detach to prevent reflows
            this.$body.detach();

            this.list.remove();

            this.renderSubView()
                .renderFooter()
                .shown();
            
            this.$body.insertAfter($header);
        },

        _onComponentMouseDown: function (evt) {
            var me = this,
                $el = $(evt.currentTarget),
                view = $el.data('view'),
                model = view.model,
                $doc = $(document),
                zIndex = me.$el.css('z-index'),
                $proxy;

            evt.preventDefault();

            me.$el.on('mouseleave.launch', function () {
                me.launch(model, false, true);
            });

            $doc.on('mousemove.launch', function (evt) {
                    // create proxy if not created
                    if(!$proxy) {
                        $proxy = view.copy().$el;
                        $('body').append($proxy);
                    }

                    // move proxy to new location
                    $proxy.css({
                        position: 'absolute',
                        left: evt.pageX + 25,
                        top: evt.pageY + 25,
                        zIndex: zIndex
                    });

                })
                .on('mouseup.launch', function () {
                    // remove proxy
                    if($proxy) {
                        $proxy.remove();
                        $proxy = null;
                    }

                    me.$el.off('.launch');
                    $doc.off('.launch');
                    $doc = null;
                });
        },

        _onComponentDblClick: function (evt) {
            var model = $(evt.currentTarget).data('view').model;

            this.launch(model, false, false);
        },

        _onRememberClick: function (evt) {
            var $checkbox = $(evt.currentTarget).siblings('.remember-checkbox');
            $checkbox.prop('checked', !$checkbox.is(':checked'));
        }

    });

})();