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
    
    Ozone.data.collections = Ozone.data.collections || {};

    Ozone.data.collections.Widgets = Ozone.data.collections.Collection.extend({

        url: Ozone.util.contextPath() + '/prefs/widgetList',

        parse: function (resp, options) {
            return _.map(resp.rows, function (widget) {
                var val = _.omit(widget.value, 'namespace', 'path', 'widgetVersion');
                val.id = widget.path;
                val.widgetGuid = widget.path;
                val.name = widget.value.namespace;
                val.title = widget.value.namespace;
                val.version = widget.value.widgetVersion;
                val.image = encodeURI(decodeURI(val.image));
                return val;
            });
        },

        findWidgetsByType: function (type) {
            var widgets = [];

            this.each(function (widget) {
                if(widget.data.widgetTypes[0].name === type) {
                    widgets.push(widget);
                }
            });

            return widgets;
        }

    });

})();