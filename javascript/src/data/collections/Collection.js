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

    Ozone.data.collections.Collection = Backbone.Collection.extend({

        /**
         * Reorders the collection so that the specified model is 
         * moved one index to the right. example: 
         * [one, two]
         * bumpRight(one) 
         * [two, one]
         * @param model The model to move
         * @param {boolean} options.silent [options.silent=false] Suppress reset event after 
         * rearranging collection
         */
        moveRight: function(model, options) {
            if(!this.includes(model)) {
                return;
            }

            options || (options = {silent: false});
            var indexOf = this.indexOf(model);
            if(indexOf < this.length - 1) {
                this.updateIndex(model, indexOf + 1);
            }

            if(!options.silent) {
                this.trigger('reset', this, options);
            }
            return this;
        },

        /**
         * Reorders the collection so that the specified model is 
         * moved one index to the left. example: 
         * [one, two]
         * bumpRight(two) 
         * [two, one]
         * @param model The model to move
         * @param {boolean} options.silent [options.silent=false] Suppress reset event after 
         * rearranging collection
         */        
         moveLeft: function(model, options) {
            if(!this.includes(model)) {
                return;
            }

            options || (options = {silent: false});
            var indexOf = this.indexOf(model);
            if(indexOf > 0) {
                this.updateIndex(model, indexOf - 1);
            }

            if(!options.silent) {
                this.trigger('reset', this, options);
            }
            return this;
        },

        /**
         * Reorders the collection so that the 
         * specified model is at the specified index.
         * Relative ordering of all other models is preserved.
         * In the case where the model being moved was previously
         * at a lower index, the element that was at the newIndex
         * will end up before the model being moved.
         *
         * @param model The model to move
         * @param newIndex The desired index of the model
         * @fires reorder (model, newIndex) Upon completion
         */
        move: function(model, newIndex) {
            if (!this.includes(model)) {
                return;
            }

            this.remove(model, {silent: true});
            this.add(model, {at: newIndex, silent: true});

            this.trigger('reorder', model, newIndex);
        }
    });

})();
