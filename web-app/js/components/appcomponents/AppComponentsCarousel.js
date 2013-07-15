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

    var SuperClass = Ozone.components.appcomponents.AppComponentsList;

    Ozone.components.appcomponents.AppComponentsCarousel = SuperClass.extend({

        // auto instantiate carousel
        autoInit: true,

        // boolean flag indicating whether or not carousel is instantiated
        _carousel: false,

        tpl: '<div class="app-components"></div>',

        // container element
        $container: null,

        render: function () {
            var $el = $(this.tpl);
            this.$el.html($el);
            this.$container = this.$el;
            this.setElement($el);

            return SuperClass.prototype.render.call(this);
        },

        filter: function (query) {
            this.destroyCarousel();
            SuperClass.prototype.filter.call(this, query);
            this.initCarousel();
        },

        shown: function () {
            this.initCarousel();
            this.initResizable();
            return this;
        },

        initResizable: function () {
            // leave bottom 64px visible
            var maxHeight = $(window).height() - this.$container.offset().top - 64

            this.$container.resizable({
                handles: 's',
                maxHeight: maxHeight,
                stop: _.bind(this.doLayout, this)
            });
        },

        doLayout: function (evt, ui) {
            var size = ui.size,
                $resizable = this.$container.children('.ui-resizable-s'),
                marginBottom = parseInt(this.$container.children('.bx-wrapper').css('margin-bottom'), 10),
                height = size.height - $resizable.height();

            this.destroyCarousel();

            // substract margin bottom for carousel pager to show
            this.$el.height(height - marginBottom);

            this.initCarousel();
        },

        destroyResizable: function () {
            this.$container.resizable('destroy');
        },

        initCarousel: function (startSlide, force) {
            if(this.views.length > 0 && (this.autoInit || this.force)) {
                this._carousel = true;
                this.$el.bxSlider({
                    startSlide: startSlide,
                    oneItemPerSlide: false,
                    infiniteLoop: false,
                    touchEnabled: false
                }); 

                this.$el.trigger('initcarousel')
            }
            return this;
        },

        getSlides: function () {
            if(this._carousel) {
                return this.$el.getSlides();    
            }
        },

        reloadCarousel: function (startSlide, force) {
            this.destroyCarousel()
                .initCarousel(startSlide, force)
                ._removeDetailsTip();
        },

        destroyCarousel: function () {
            if(this._carousel) {
                this.$el.trigger('beforedestroycarousel')
                        .destroySlider();
            }
            this._carousel = false;
            return this;
        },

        remove: function () {
            this.destroyCarousel();
            this.destroyResizable();

            return SuperClass.prototype.remove.call(this);
        }

    });

})();