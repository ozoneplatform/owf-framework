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

    var ItemViem = Backbone.View.extend({
        
        className: 'widget',

        tpl: '<div class="thumb-wrap">' +
                '<img onerror="this.src = \'themes/common/images/settings/WidgetsIcon.png\'" src="<%= image %>" class="thumb" />' +
            '</div>' +
            '<div class="thumb-text"><%= name %></div>',

        attributes: function () {
            return {
                tabindex: 0,
                'data-id': this.model.get('id')
            };
        },

        initialize: function () {
            Backbone.View.prototype.initialize.apply(this, arguments);
            this.$el.data('view', this);
            this.model = this.options.model;
        },

        render: function () {
            this.$el.append(_.template(this.tpl, this.model.attributes));
            return this;
        }

    });

    Ozone.components.appcomponents.AppComponentsMenu = Backbone.View.extend({

        className: 'appcomponents-menu',

        searchQuery: '',

        initialize: function () {
            _.bindAll(this, 'addOne', 'reloadSlider');
            $(window).on('resize', this.reloadSlider);
        },

        events: {
            'keyup .search-input': '_inputKeyUp',
            'dblclick .widget': '_onDblClick',
            'click .x-tool': 'toggle'
        },

        render: function () {
            this.$el.html(  '<div class="header">' +
                                '<a class="x-tool">' +
                                    '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-tool-close">' +
                                '</a>' +
                                '<input type="text" class="search-input">' +
                                '<span>App Components</span>'+
                            '</div>' + 
                            '<div class="body"></div>');
            this.$body = this.$el.find('.body');

            this.addAll();
            return this;
        },

        addAll: function () {
            _.invoke(this.views, 'remove');
            this.views = [];
            this.options.collection.each(this.addOne);
            return this;
        },

        addOne: function (model, index) {
            if(model.get('name').indexOf(this.searchQuery) < 0 || model.get('widgetTypes')[0].name !== 'standard') {
                return;
            }

            var view = new ItemViem({
                model: model
            });
            this.views.push(view);

            this.$body.append(view.render().$el);
        },

        filter: function (query) {
            this.searchQuery = query;

            this._destroyCarousel()
                .addAll()
                ._initCarousel();
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

        toggle: function () {
            this.$el.is(':visible') ? this.hide() : this.show();
        },

        shown: function () {
            this._initCarousel();
            return this;
        },

        show: function () {
            this.$el.show();
            return this;
        },

        hide: function () {
            this.$el.hide();
            return this;
        },

        remove: function () {
            _.invoke(this.views, 'remove');
            delete this.views;

            this._destroyCarousel();
            $(window).off('resize', this.reloadSlider);

            return Backbone.View.prototype.remove.call(this);
        },

        _inputKeyUp: _.debounce(function (evt) {
            this.filter($(evt.target).val());
        }, 500),

        _onDblClick: function (evt) {
            var model = $(evt.currentTarget).data('view').model;
            this.launch(model, false, false);
        },

        _initCarousel: function () {
            if(this.views.length) {
                this.carousel = this.$body.bxSlider({
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

            $slides.sortable({
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
        },

        _destroyCarousel: function () {
            if(this.carousel) {
                this.carousel.getSlides().sortable('destroy');
                this.carousel.destroySlider();
            }
            return this;
        }

    });

})();