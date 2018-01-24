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

    Ozone.components.appcomponents.AppComponent = SuperClass.extend({

        className: 'widget',

        tpl: '<div class="thumb-wrap">' +
                '<img onerror="this.src = \'themes/common/images/settings/WidgetsIcon.png\'" src="<%- image %>" class="thumb" />' +
            '</div>' +
            '<div class="thumb-text ellipsis"><%- name %></div>'+
            '<% if (details) { %>' +
                '<a href="#" class="widget-details" style="visibility: hidden;"></a>' +
            '<% } %>',

        // boolean flag indicating whether or not to show details link
        details: true,

        attributes: function () {
            return {
                tabindex: 0,
                'data-id': this.model.get('id') || this.model.get('uniqueId')
            };
        },

        render: function () {
            var compiled = _.template(this.tpl);
            this.$el.append( compiled( _.extend({
                details: this.details
            }, this.model.attributes) ) );
            return this;
        },

        copy: function () {
            var view = new Ozone.components.appcomponents.AppComponent({
                model: this.model
            }).render();

            return view;
        }

    });

})();
