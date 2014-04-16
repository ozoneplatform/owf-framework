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

;(function(Backbone, $, _, Ozone) {
    'use strict';

    var SuperClass = Backbone.View;

    var BaseView = SuperClass.extend({

        //events that will be bound to the model or collection.
        //Syntax is similar to the 'events' property
        modelEvents: null,

        _isShown: false,

        initialize: function () {
            this.$el.addClass('bb-view').data('view', this);

            // add class when existing el is passed
            if (this.className) this.$el.addClass(_.result(this, 'className'));

            // merge all options onto current view instance
            _.extend(this, _.omit(this.options, 'el', '$el'));

            if (this.modelEvents) {
                this._prepareEventsProperty('modelEvents');

                if (this.model) {
                    this.listenTo(this.model, this.modelEvents);
                }
                if (this.collection) {
                    this.listenTo(this.collection, this.modelEvents);
                }
            }
        },

        promise: function () {
            this.async = true;
            this.__renderDeferred__ = this.__renderDeferred__ || $.Deferred();
            if (this.__isRendered__) this.__renderDeferred__.resolve();
            return this.__renderDeferred__.promise();
        },

        isVisible: function () {
            return this.$el.is(':visible');
        },

        isRendered: function() {
            return $.contains(document.documentElement, this.el);
        },

        toggle: function () {
            if(this.isVisible()) this.hide();
            else this.show();

            return this;
        },

        show: function () {
            this.$el.show();
            this.$el.trigger('show');
            return this;
        },

        hide: function () {
            this.$el.hide();
            this.$el.trigger('hide');
            return this;
        },

        remove: function () {
            SuperClass.prototype.remove.call(this);
            this.$el.off();
            this.$el.data('view', null);
            return this;
        },

        /**
         * Called as soon as the view has been loaded into the DOM initially.
         * @returns {BaseView} this for chaining purposes
         */
        shownOnce: function () {
            return this;
        },

        /**
         * Called when view is shown. You can safely do DOM-specific stuff here.
         * @returns {BaseView} this for chaining purposes
         */
        shown: function() {
            if(this._isShown === false) {
                this._isShown = true;
                this.shownOnce();
            }
            return this;
        },

        /*
        * Focuses first focusable element unless a CSS selector is passed.
        */
        focus: function (selector) {
            if (selector) {
                this.$(selector).focus();
            }
            else if(this.$el.attr('tabindex') >= 0) {
                this.$el.focus();
            }
            else {
                this.$focusables().first().focus();
            }
            return this;
        },

        /*
        * Returns all focusable elements.
        */
        $focusables: function () {
            return this.$el.find(BaseView.FOCUSABLE_ELEMENTS_SELECTOR).not('[tabindex="-1"]');
        },

        //turn string fn names into actual functions
        _prepareEventsProperty: function(property) {

            //clone so we preparations only affect this instance
            var events = _.clone(_.result(this, property)),
                evt,
                fn;

            /*jshint forin:false*/
            for (evt in events) {
                fn = events[evt];
                if (_.isString(fn)) {
                    events[evt] = _.bind(this[fn], this);
                }
            }

            this[property] = events;
        },

        //allow the model for this view to be switched out
        setModel: function(model) {
            this.stopListening(this.model);
            this.model = model;
            this.listenTo(this.model, this.modelEvents);
        }

    }, {
        FOCUSABLE_ELEMENTS_SELECTOR: '*[tabindex], a, button, input, textarea, select'
    });

    Ozone.views = $.extend(Ozone.views, { BaseView: BaseView });

})(window.Backbone, window.jQuery, window._, window.Ozone);
