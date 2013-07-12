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

        className: 'appcomponents-carousel',

        // auto instantiate carousel
        autoInit: true,

        // boolean flag indicating whether or not carousel is instantiated
        _carousel: false,

        filter: function (query) {
            this.destroyCarousel();
            SuperClass.prototype.filter.call(this, query);
            this.initCarousel();
        },

        shown: function () {
            this.initCarousel();
            return this;
        },

        initCarousel: function (force) {
            if(this.views.length > 0 && (this.autoInit || this.force)) {
                this._carousel = true;
                this.$el.bxSlider({
                    oneItemPerSlide: false,
                    infiniteLoop: true,
                    touchEnabled: false
                });
            }
            return this;
        },

        getSlides: function () {
            if(this._carousel) {
                return this.$el.getSlides();    
            }
        },

        reloadCarousel: function (evt) {
            this.destroyCarousel()
                .initCarousel();
        },

        destroyCarousel: function () {
            if(this._carousel) {
                this.$el.destroySlider();
            }
            this._carousel = false;
            return this;
        },

        remove: function () {
            this.destroyCarousel();

            return SuperClass.prototype.remove.call(this);
        }

    });

})();