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

    Ozone.components.appcomponents.AppComponentsList = Backbone.View.extend({

        // managed sub views
        views: null,

        searchQuery: '',

        initialize: function () {
            _.bindAll(this, 'addOne');
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

        addOne: function (model) {
            if(model.get('name').indexOf(this.searchQuery) < 0 || model.get('widgetTypes')[0].name !== 'standard') {
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

        toggle: function () {
            this.$el.is(':visible') ? this.hide() : this.show();
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

            return Backbone.View.prototype.remove.call(this);
        }

    });

})();