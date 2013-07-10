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

    var SuperClass = Backbone.View;

    Ozone.components.appcomponents.IntentsWindow = SuperClass.extend({

        className: 'intents-window',

        events: {
            'click .x-tool': 'toggle'
        },

        render: function () {
            this.$el.html(  '<div class="header">' +
                                '<a class="x-tool">' +
                                    '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-tool-close">' +
                                '</a>' +
                                '<input type="text" class="search-input">' +
                                '<span>Select the components you would like to send this action to: </span>'+
                            '</div>' + 
                            '<div class="body"></div>'
            );

            this.$body = this.$el.find('.body');

            this.list = new Ozone.components.appcomponents.AppComponentsList({
                el: this.$body,
                collection: this.options.collection
            });
            
            this.list.render();
            return this;
        }

    });

})();