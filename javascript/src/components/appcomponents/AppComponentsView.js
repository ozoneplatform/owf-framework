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

    var SuperClass = Ozone.views.BaseView;

    var $window = $(window),
        $document = $(document),
        windowWidth = $window.width(),
        windowHeight = $window.height();

    Ozone.components.appcomponents.AppComponentsView = SuperClass.extend({

        id: 'appcomponents-view',

        events: _.extend({}, SuperClass.prototype.events, {
            'keyup .search-input': '_inputKeyUp',
            'click .widget': '_onDblClick',
            'click .close': 'hide',
            'click .pin': 'togglePin',
            'mouseover .bx-prev': '_goToPrevSlide',
            'mouseover .bx-next': '_goToNextSlide',
            'mousedown .ui-resizable-handle': '_shim',
            'resizestart': '_onResizeStart',
            'resizestop': '_unshim',
            'sortstart': '_shim',
            'sortstop': '_unshim'
        }),

        // flag indicating whether launch is being performed
        _launching: false,

        // flag indicating whether sort is being performed
        _sorting: false,

        // flag indicating whether reorder has been performed
        _reordered: false,

        // flag indicating whether resize has been performed
        _resized: false,

        // current search query
        searchQuery: '',

        // collection of all app components person has access to
        allAppComponents: null,

        // flag indicating whether view is pinned or not
        pinned: false,

        initialize: function () {
            SuperClass.prototype.initialize.apply(this, arguments);

            this.allAppComponents = this.collection;
            this.pinned = this.state ? this.state.pinned : false;

            var standardAppComponents = this.allAppComponents.filter(function(appComponent) {
                return appComponent.get('widgetTypes')[0].name === 'standard';
            });

            this.collection = new Ozone.data.collections.Widgets(standardAppComponents);

            _.bindAll(this, '_refreshDebounce');
        },

        render: function () {
            this.$el.html(  '<div class="header">' +
                                '<a class="x-tool close">' +
                                    '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-tool-close">' +
                                '</a>' +
                                '<a class="x-tool pin ' + (this.pinned ? 'pinned' : '') + ' ">' +
                                    '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-tool-pin">' +
                                '</a>' +
                                '<input type="text" class="search-input">' +
                            '</div>' +
                            '<div class="body"></div>'
            );

            this.$body = this.$el.find('.body');

            this.carousel = new Ozone.components.appcomponents.AppComponentsCarousel({
                el: this.$body,
                collection: this.collection,
                allAppComponents: this.allAppComponents,
                selectable: false,
                size: this.state
            });

            this.carousel.setFilter(function (model, index) {
                var name = model.get('name').toLowerCase();
                var description = (model.get('description') || '').toLowerCase();
                var searchQuery = this.searchQuery.toLowerCase();
                var isVisible = model.get('visible') && model.get('definitionVisible');

                return isVisible && (_.includes(name, searchQuery) || _.includes(description, searchQuery));
            });

            this.carousel.render().$el.on({
                'beforedestroycarousel.carousel': _.bind(this._destroySortable, this),
                'initcarousel.carousel': _.bind(this._initSortable, this)
            });

            return this;
        },

        filter: function (query) {
            this.searchQuery = query;
            this.carousel.filter(query);
        },

        launch: function (evt, view, isEnterPressed, isDragAndDrop) {
            var me = this;

            me.hide();
            me.dashboardContainer
                .launchWidgets(evt, view.model, isEnterPressed, isDragAndDrop)
                .always(function () {
                    // only show if pinned
                    if(me.pinned) {
                        me.show();
                    }
                });
        },

        pin: function () {
            var $pin = this.$el.find('.pin');

            $pin.addClass('pinned');
            this.pinned = true;

            this.$shim && this.$shim.remove();
            this.$shim = null;
        },

        unpin: function () {
            var $pin = this.$el.find('.pin');

            $pin.removeClass('pinned');

            this.$shim = $('<div class="shim"></div>').on('click', _.bind(this.hide, this));
            this.$shim.appendTo($('#dashboardCardPanel-body'));

            this.pinned = false;
        },

        togglePin: function (evt) {
            this[this.pinned ? 'unpin' : 'pin']();
        },

        refresh: function () {
            var newWindowHeight = $window.height(),
                newWindowWidth = $window.width();

            // dont refresh if size hasn't changed
            if(newWindowWidth !== windowWidth || newWindowHeight !== windowHeight) {
                windowWidth = newWindowWidth;
                windowHeight = newWindowHeight;

                this.isVisible() && this.carousel.reloadCarousel();
            }
        },

        _refreshDebounce: _.debounce(function () {
            this.refresh();
        }, 1000),

        show: function () {
            this[this.pinned ? 'pin' : 'unpin']();
            $window.on('resize', this._refreshDebounce);
            return SuperClass.prototype.show.call(this);
        },

        hide: function () {
            $window.off('resize', this._refreshDebounce);
            this.carousel.removeDetailsTip();

            this.$shim && this.$shim.remove();
            this.$shim = null;

            return SuperClass.prototype.hide.call(this);
        },

        isVisible: function () {
            return this.$el.is(':visible');
        },

        isHidden: function () {
            return !this.isVisible();
        },

        shown: function () {
            this.carousel.shown();
            return this;
        },

        getState: function () {
            var state = {
                pinned: this.pinned
            };

            if(this.state) {
                state = $.extend(this.state, state);
            }

            if(this._resized) {
                state = _.extend(state, this.carousel.state());
            }
            return state;
        },

        save: function (sync) {
            Ozone.pref.PrefServer.setUserPreference({
                namespace: "owf",
                name: "appcomponent-view",
                async: !sync,
                value: Ozone.util.toString(this.getState()),
                onSuccess: $.noop,
                onFailure: $.noop
            });

            if(this._reordered) {
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
            }
        },

        remove: function () {
            this.carousel.remove();
            this.carousel = null;

            this.$el.off('.carousel');
            $(window).off('resize', this.refresh);

            return SuperClass.prototype.remove.call(this);
        },

        _inputKeyUp: _.debounce(function (evt) {
            this.filter($(evt.target).val());
        }, 500),

        // debounce to prevent double-click from launching widget twice
        _onDblClick: _.debounce(function (evt) {
            var me = this,
                view = $(evt.currentTarget).data('view');

            // delay call to launch to allow click event to bubble up so that it is not
            // considered as a pane click
            setTimeout(function () {
                me.launch(evt, view, false, false);
            }, 200);

        }, 201, {
            leading: true,
            trailing: false
        }),

        _initSortable: function () {
            var me = this,
                $doc = $document,
                $slides;

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
                            var view = ui.item.data('view');
                            me._sorting = true;

                            //OP-2183 Remove the drag proxy's details icon and remove the height style so it resizes
                            ui.helper.children('.widget-details').remove();
                            ui.helper.css('height', '');
                            ui.helper.children('.thumb-text').css('height', 'auto');

                            ui.helper.addClass('selected');

                            // checking for mouseout or mouseleave on current $el doesn't work
                            // check for mouseout by checking for mousemove on paneshims
                            $doc.one('mousemove.launch', '.shim', function (evt) {
                                me._sorting = false;
                                me._launching = true;
                                me.launch(evt, view, false, true);
                            });
                        },

                        stop: function (evt, ui) {
                            if(me._launching) {
                                $slides.sortable('cancel');
                            }
                            // dont perform sort if view is filtered
                            else if(me.searchQuery === '') {
                                var $item = ui.item,
                                    $prev = ui.item.prev(),
                                    $next = ui.item.next(),
                                    prevIndex = $prev.index(),
                                    itemView = $item.data('view'),
                                    newIndex;

                                // only reorder if page has more than 1 item
                                if($prev.length > 0 || $next.length > 0) {
                                    if(prevIndex > -1) {
                                        newIndex = me.collection.indexOf($prev.data('view').model);
                                    }
                                    else {
                                        newIndex = me.collection.indexOf($next.data('view').model);
                                    }

                                    me.collection.move(itemView.model, newIndex);
                                    me._reordered = true;

                                    setTimeout(function () {
                                        me.carousel.reloadCarousel(me.carousel.$el.getCurrentSlide());
                                    }, 0);
                                }
                            }

                            // remove event handlers
                            me.$el.off('.launch');
                            $doc.off('.launch');

                            me._sorting = false;
                            me._launching = false;
                        }
                    });
            }
            return this;
        },

        _destroySortable: function () {
            var $slides;

            $slides = this.carousel.getSlides();
            $slides && $slides.sortable('destroy');

            return this;
        },

        _goToPrevSlide: function () {
            this._sorting && this.carousel.$el.goToPrevSlide();
        },

        _goToNextSlide: function (argument) {
            this._sorting && this.carousel.$el.goToNextSlide();
        },

        _onResizeStart: function () {
            this._resized = true;
        },

        _shim: function () {
            this.dashboardContainer.activeDashboard.shimPanes();
        },

        _unshim: function () {
            this.dashboardContainer.activeDashboard.unshimPanes();
        }

    });

})();
