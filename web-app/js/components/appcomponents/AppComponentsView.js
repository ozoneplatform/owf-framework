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
            'click .x-tool': 'hide',
            'mouseover .bx-prev': '_goToPrevSlide',
            'mouseover .bx-next': '_goToNextSlide'
        }),

        // flag indicating whether launch is being performed
        _launching: false,

        // flag indicating whether sort is being performed
        _sorting: false,

        // flag indicating whether reorder has been performed
        _reordered: false,

        // current search query
        searchQuery: '',

        // collection of all app components person has access to
        allAppComponents: null,

        initialize: function () {
            SuperClass.prototype.initialize.apply(this, arguments);
            this.allAppComponents = this.collection;

            var standardAppComponents = this.allAppComponents.filter(function(appComponent) {
                return appComponent.get('widgetTypes')[0].name === 'standard';
            });

            this.collection = new Ozone.data.collections.Widgets(standardAppComponents);
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

            this.carousel = new Ozone.components.appcomponents.AppComponentsCarousel({
                el: this.$body,
                collection: this.collection,
                allAppComponents: this.allAppComponents,
                selectable: false,
                addFilterFn: function (model, index) {
                    if(model.get('name').indexOf(this.searchQuery) < 0) {
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
            this.searchQuery = query;
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

        save: function (sync) {
            if(!this._reordered) {
                return;
            }

            Ozone.pref.PrefServer.updateAndDeleteWidgets({
                widgetsToUpdate: this.collection.map(function (appComponent) {
                    return {
                        guid: appComponent.get('widgetGuid')
                    };
                }),
                widgetGuidsToDelete: [],
                updateOrder: true,
                async: !sync,
                onSuccess: $.noop,
                onFailure: $.noop
            });
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
                $slides;

            if(this.searchQuery !== '') {
                return;
            }

            $slides = me.carousel.getSlides();

            if($slides) {
                $slides
                    .sortable({
                        helper: 'clone',
                        appendTo: $('body'),
                        connectWith: '.bx-slide',
                        tolerance: 'pointer',
                        scroll: false,
                        cursorAt: { left: -5, top: -25 },

                        start: function(evt, ui) {
                            var model = ui.item.data('view').model;

                            me._sorting = true;

                            ui.helper.addClass('selected');

                            // mouseleave doesn't fire in IE7 when using sortable
                            // manually check for mouseleav by checking evt.target
                            me.$el.on('mouseout.launch', function (evt) {
                                if(me.$el[0] === evt.target) {
                                    me._sorting = false;
                                    me._launching = true;
                                    me.launch(model, false, true);
                                }
                            });
                        },

                        stop: function (evt, ui) {
                            if(me._launching) {
                                $slides.sortable('cancel');
                            }
                            else {
                                var $item = ui.item,
                                    $prev = ui.item.prev(),
                                    $next = ui.item.next(),
                                    prevIndex = $prev.index(),
                                    itemView = $item.data('view'),
                                    newIndex;

                                if(prevIndex > -1) {
                                    newIndex = me.collection.indexOf($prev.data('view').model);
                                }
                                else {
                                    newIndex = me.collection.indexOf($next.data('view').model);
                                }

                                me.collection.move(itemView.model, newIndex);
                                me._reordered = true;
                            }
                            me.$el.off('.launch');

                            me._sorting = false;
                            me._launching = false;

                            setTimeout(function () {
                                me._destroySortable();
                                me.carousel.reloadCarousel(me.carousel.$el.getCurrentSlide());
                                me._initSortable();
                            }, 0);
                        }
                    });
            }
            return this;
        },

        _destroySortable: function () {
            var $slides;

            if(this.searchQuery !== '') {
                return;
            }
            
            $slides = this.carousel.getSlides();
            $slides && $slides.sortable('destroy');

            return this;
        },

        _goToPrevSlide: function () {
            this._sorting && this.carousel.$el.goToPrevSlide();
        },

        _goToNextSlide: function (argument) {
            this._sorting && this.carousel.$el.goToNextSlide();
        }

    });

})();