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

    Ozone.components.appcomponents.AppComponentsCarousel = SuperClass.extend({

        className: 'appcomponents-menu',

        events: _.extend({}, SuperClass.prototype.events, {
            'keyup .search-input': '_inputKeyUp',
            'dblclick .widget': '_onDblClick',
            'click .x-tool': 'hide'
        }),

        initialize: function () {
            SuperClass.prototype.initialize.apply(this, arguments);
            _.bindAll(this, 'reloadSlider');
            $(window).on('resize', this.reloadSlider);
        },

        render: function () {
            this.$el.html(  '<div class="header">' +
                                '<a class="x-tool">' +
                                    '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-tool-close">' +
                                '</a>' +
                                '<input type="text" class="search-input">' +
                                '<span>App Components</span>'+
                            '</div>' + 
                            '<div class="body"></div>'
            );

            this.$body = this.$el.find('.body');

            this.list = new Ozone.components.appcomponents.AppComponentsList({
                el: this.$body,
                collection: this.options.collection,
                addFilterFn: function (model, index) {
                    if(model.get('name').indexOf(this.searchQuery) < 0 || model.get('widgetTypes')[0].name !== 'standard') {
                        return false;
                    }
                    return true;
                }
            });
            this.list.render();
            return this;
        },

        filter: function (query) {
            this._destroyCarousel();
            this.list.filter(query);
            this._initCarousel();
        },

        launch: function (app, isEnterPressed, isDragAndDrop) {
            var me = this;

            me.hide();
            me.options.dashboardContainer
                .launchWidgets(app, isEnterPressed, isDragAndDrop)
                .always(function () {
                    me.show();
                })
        },

        reloadSlider: _.debounce(function (evt) {
            this._destroyCarousel()
                ._initCarousel();
        }, 1000),

        shown: function () {
            this._initCarousel();
            return this;
        },

        remove: function () {
            this._destroyCarousel();
            this.list.remove();
            delete this.list;
            $(window).off('resize', this.reloadSlider);

            return SuperClass.prototype.remove.call(this);
        },

        _inputKeyUp: _.debounce(function (evt) {
            this.filter($(evt.target).val());
        }, 500),

        _onDblClick: function (evt) {
            var model = $(evt.currentTarget).data('view').model;
            this.launch(model, false, false);
        },

        _initCarousel: function () {
            if(this.list.views.length) {
                this.carousel = this.list.$el.bxSlider({
                    oneItemPerSlide: false,
                    infiniteLoop: true,
                    touchEnabled: false
                });
                this._initSortable();
            }
            return this;
        },

        _initSortable: function () {
            var me = this,
                $slides = me.carousel.getSlides();

            $slides
                .sortable({
                    helper: 'clone',
                    appendTo: $('body'),
                    connectWith: '.bx-slide',
                    tolerance: "pointer",
                    cursorAt: { left: -25, top: -25 },

                    start: function(event, ui) {
                        var model = ui.item.data('view').model;

                        me.$el.on('mouseleave.launch', function () {
                            me._dragging = true;
                            me.launch(model, false, true);
                        });
                    },

                    stop: function () {
                        if(me._dragging) {
                            $slides.sortable('cancel');
                        }
                        me.$el.off('.launch');
                        delete me._dragging;
                    }
                });
            return this;
        },

        _destroyCarousel: function () {
            if(this.carousel) {
                this.carousel.getSlides().sortable('destroy');
                this.carousel.destroySlider();
            }
            delete this.carousel;
            return this;
        }

    });

})();