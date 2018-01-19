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

        tpl: '<div class="app-components"><div class="app-components-body"></div>',

        // container element
        $container: null,

        // default size to user
        size: null,

        // gripper height
        GRIPPER_HEIGHT: 25 + 21,

        render: function () {
            var height,
                $el = $(this.tpl);

            this.$el.html($el);
            this.$container = this.$el;
            this.$appcomponents = $el;
            this.setElement($el.children('.app-components-body'));

            if(this.size && this.size.height && this.size.height < 1) {
                height = this.size.height * $(window).height();

                // don't set height if less than min required
                if(height > (139 + this.GRIPPER_HEIGHT)) {
                    this.$container.height(height);

                    // substract gripper height for carousel pager to show
                    this.$el.height(height - this.GRIPPER_HEIGHT);
                }
            }

            return SuperClass.prototype.render.call(this);
        },

        filter: function (query) {
            this.destroyCarousel();
            SuperClass.prototype.filter.call(this, query);
            this.ellipsis();
            this.initCarousel();

            this._constrain();
        },

        shown: function () {
            this.ellipsis();
            this.initResizable();
            this.initCarousel();
            // OP-2531: Before showing, always make sure that
            // if the carousel is empty, the gripper will be in the right spot.
            this._constrain();
            return this;
        },

        ellipsis: function () {
            this.$el.find('.ellipsis').dotdotdot();
        },

        state: function () {
            return {
                height: (this.$container.height() / $(window).height())
            };
        },

        initResizable: function () {
            var me = this,
                minHeight = 139 + this.GRIPPER_HEIGHT,
                rowHeight = 135,
                // leave bottom 64px visible
                maxHeight = $(window).height() - this.$container.offset().top - 64,
                $bx;

            this.$container.resizable({
                handles: 's',
                minHeight: minHeight,
                maxHeight: maxHeight,
                start: function (evt, ui) {
                    $bx = me.$container.find('.bx-wrapper, .bx-viewport');
                },
                resize: function (evt, ui) {
                    var height = ui.size.height - me.GRIPPER_HEIGHT;

                    me.$appcomponents.height(height);
                    $bx.height(height);

                    me._constrain();
                },
                stop: function (evt, ui) {
                    // Snap to the nearest row height on release. The rows are so tall that using
                    // jQuery's grid snapping (which snaps as you drag) feels unnatural, so we snap
                    // on release.
                    // We snap to row height to prevent users from seeing the extra row that is
                    // created when dragging from one page to another (OP-2054).
                    var roundedHeight = Math.round((ui.size.height - minHeight) / rowHeight) * rowHeight + minHeight,
                        componentsHeight = roundedHeight - me.GRIPPER_HEIGHT;
                    ui.size.height = roundedHeight;
                    ui.element.height(roundedHeight);
                    me.$appcomponents.height(componentsHeight);
                    me.doLayout(evt, ui);
                }
            });

            return this;
        },

        doLayout: function (evt, ui) {
            var size = ui.size,
                height = size.height;

            this.destroyCarousel();

            // substract margin bottom and grabber height for carousel pager to show
            this.$el.height(height - this.GRIPPER_HEIGHT);

            this.initCarousel();
        },

        destroyResizable: function () {
            this.$container.resizable('destroy');
            return this;
        },

        initCarousel: function (startSlide, force) {
            if(this.views.length > 0 && (this.autoInit || this.force)) {
                this._carousel = true;
                this.$el.bxSlider({
                    startSlide: startSlide,
                    oneItemPerSlide: false,
                    infiniteLoop: true,
                    touchEnabled: false,
                    responsive: false
                });

                this.$el.trigger('initcarousel');
            }
            return this;
        },

        getSlides: function () {
            if(this._carousel) {
                return this.$el.getSlides();
            }
        },

        reloadCarousel: function (startSlide, force) {
            this.destroyResizable()
                .destroyCarousel()
                .initCarousel(startSlide, force)
                .initResizable()
                .removeDetailsTip();
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
        },

        _constrain: function () {
            if(this.views.length === 0) {
                this.$appcomponents.css({
                    'height': this.$container.height() - 25,
                    'margin-bottom': '25px'
                });
            }
        }

    });

})();