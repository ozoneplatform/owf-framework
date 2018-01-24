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

    Ozone.components.appcomponents.DetailsTip = SuperClass.extend({

        id: 'widget-details-tip',

        tpl:    '<div class="header">' +
                    '<a class="x-tool">' +
                        '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-tool-close">' +
                    '</a>' +
                    '<h3 class="widget-name"><%- name %></h3>'+
                '</div>' +
                '<% if (typeof description === "string") { %>' +
                    '<p class="widget-description" ><%- description %></p>' +
                '<% } %>' +
                '<div class="footer">' +
                    '<a href="#" class="widget-remove"><span>Remove</span></a>' +
                '</div>',

        events: {
            'click .x-tool': 'hide'
        },

        render: function () {
            var compiled = _.template(this.tpl);
            this.$el.append(compiled(this.model.attributes));
            return this;
        },

        shown: function () {
            // constrain tooltip in viewport
            var offset = this.$el.offset(),
                width = this.$el.width(),
                height = this.$el.height(),
                $parent = this.$el.parent(),
                parentWidth = $parent.width(),
                parentHeight = $parent.height(),
                css = {};

            if(offset.left < 0) {
                css.left = 0;
            }

            if(offset.left + width > parentWidth) {
                css.left = parentWidth - width;
            }

            if(offset.top + height > parentHeight) {
                css.top = parentHeight - height;
            }

            this.$el.css(css);

            return this;
        },

        hide: function () {
            SuperClass.prototype.hide.call(this);
            return this.remove();
        }

    });

})();
