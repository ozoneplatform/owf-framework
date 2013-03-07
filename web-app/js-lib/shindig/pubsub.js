/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/**
 * @fileoverview Gadget-side PubSub library for gadget-to-gadget communication.
 */

var gadgets = gadgets || {};

/**
 * @static
 * @class Provides operations for making rpc calls.
 * @name gadgets.pubsub
 */
gadgets.pubsub = (function() {
  var listeners = {};

  function router(channel, sender, message) {
    var listener = listeners[channel];
    if (typeof listener === 'function') {
      listener(sender, message,channel);
    }
  }

  return /** @scope gadgets.pubsub */ {
    /**
     * Publishes a message to a channel.
     * @param {string} channel Channel name.
     * @param {string} message Message to publish.
     */
    publish: function(channel, message, dest, accessLevel) {
      gadgets.rpc.call('..', 'pubsub', null, 'publish', channel, message, dest, accessLevel);
    },

    /**
     * Subscribes to a channel.
     * @param {string} channel Channel name.
     * @param {function} callback Callback function that receives messages.
     *                   For example:
     *                   function(sender, message) {
     *                     if (isTrustedGadgetSpecUrl(sender)) {
     *                       processMessage(message);
     *                     }
     *                   }
     */
    subscribe: function(channel, callback) {
      listeners[channel] = callback;
      gadgets.rpc.register('pubsub', router);
      gadgets.rpc.call('..', 'pubsub', null, 'subscribe', channel);
    },

    /**
     * Unsubscribes from a channel.
     * @param {string} channel Channel name.
     */
    unsubscribe: function(channel) {
      delete listeners[channel];
      gadgets.rpc.call('..', 'pubsub', null, 'unsubscribe', channel);
      }

  };
})();

