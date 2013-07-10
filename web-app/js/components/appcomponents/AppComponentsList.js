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

    Ozone.components.appcomponents.AppComponentsList = SuperClass.extend({

        // managed sub views
        views: null,

        searchQuery: '',

        addFilterFn: $.noop,

        selected: null,

        selectClass: 'selected',

        events: {
            'click .widget': '_onClick',
        },

        initialize: function () {
            SuperClass.prototype.initialize.apply(this, arguments);
            _.bindAll(this, 'addOne');
            this.addFilterFn = this.options.addFilterFn || this.addFilterFn;
        },

        render: function () {
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
            if(this.addFilterFn(model, index) === false) {
                return;
            }

            var view = new Ozone.components.appcomponents.AppComponent({
                model: model
            });
            this.views.push(view);

            this.$el.append(view.render().$el);
        },

        filter: function (query) {
            this.searchQuery = query;
            return this.addAll();
        },

        remove: function () {
            _.invoke(this.views, 'remove');
            delete this.views;

            return SuperClass.prototype.remove.call(this);
        },

        _onClick: function (evt) {
            var view = $(evt.currentTarget).data('view');

            if(this.selected) {
                this.selected.$el.removeClass(this.selectClass);
            }
            this.selected = view;
            this.selected.$el.addClass(this.selectClass);
        }

    });

})();