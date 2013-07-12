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

    Ozone.components.appcomponents.AppComponentsView = SuperClass.extend({

        id: 'appcomponents-view',

        events: _.extend({}, SuperClass.prototype.events, {
            'keyup .search-input': '_inputKeyUp',
            'click .widget': '_onDblClick',
            'click .x-tool': 'hide'
        }),

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

            this.carousel = new Ozone.components.appcomponents.AppComponentsCarousel({
                el: this.$body,
                collection: this.options.collection,
                selectable: false,
                addFilterFn: function (model, index) {
                    if(model.get('name').indexOf(this.searchQuery) < 0 || model.get('widgetTypes')[0].name !== 'standard') {
                        return false;
                    }
                    return true;
                }
            });
            this.carousel.render();

            _.bindAll(this, 'refresh');
            $(window).on('resize', this.refresh);

            return this;
        },

        filter: function (query) {
            this._destroySortable();
            this.carousel.filter(query);
            this._initSortable();
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

        refresh: _.debounce(function (evt) {
            this._destroySortable();
            this.carousel.reloadCarousel();
            this._initSortable();
        }, 1000),

        shown: function () {
            this.carousel.shown();
            this._initSortable();
            return this;
        },

        remove: function () {
            this._destroySortable();
            this.carousel.remove();
            this.carousel = null;

            $(window).off('resize', this.refresh);

            return SuperClass.prototype.remove.call(this);
        },

        _inputKeyUp: _.debounce(function (evt) {
            this.filter($(evt.target).val());
        }, 500),

        _onDblClick: function (evt) {
            var model = $(evt.currentTarget).data('view').model;
            this.launch(model, false, false);
        },

        _initSortable: function () {
            var me = this,
                $slides = me.carousel.getSlides();

            if($slides) {
                $slides
                    .sortable({
                        helper: 'clone',
                        appendTo: $('body'),
                        connectWith: '.bx-slide',
                        tolerance: "pointer",
                        cursorAt: { left: -25, top: -25 },

                        start: function(event, ui) {
                            var model = ui.item.data('view').model;

                            // mouseleave doesn't fire in IE7 when using sortable
                            // manually check for mouseleav by checking evt.target
                            me.$el.on('mouseout.launch', function (evt) {
                                if(me.$el[0] === evt.target) {
                                    me._dragging = true;
                                    me.launch(model, false, true);
                                }
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
            }
            return this;
        },

        _destroySortable: function () {
            var $slides = this.carousel.getSlides()
            $slides && $slides.sortable('destroy');
            return this;
        }

    });

})();