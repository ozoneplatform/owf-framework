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
 * @fileoverview Container-side message router for PubSub, a gadget-to-gadget
 * communication library.
 */

var gadgets = gadgets || {};

/**
 * @static
 * @class Routes PubSub messages.
 * @name gadgets.pubsubrouter
 */
gadgets.pubsubrouter = (function() {
  var gadgetIdToSpecUrl;
  var subscribers = {};
  var onSubscribe;
  var onUnsubscribe;
  var onPublish;
  var onRoute;
  var containerListeners = {};
  
  function router(command, channel, message, dest, accessLevel) {
    var gadgetId = this.f;
    var sender = gadgetIdToSpecUrl(gadgetId);
    if (sender) {
      switch (command) {
      case 'subscribe':
        if (onSubscribe && onSubscribe(gadgetId, channel)) {
          break;
        }
          if (!subscribers[channel]) {
            subscribers[channel] = {};
          }
          subscribers[channel][gadgetId] = true;
        break;
      case 'unsubscribe':
        if (onUnsubscribe && onUnsubscribe(gadgetId, channel)) {
          break;
        }
          if (subscribers[channel]) {
            delete subscribers[channel][gadgetId];
          }
          if (containerListeners[channel] && gadgetId == '..') {
            delete containerListeners[channel];
          }
        break;
      case 'publish':
        if (onPublish && onPublish(gadgetId, channel, message, accessLevel)) {
          break;
        }
        var channelSubscribers = subscribers[channel];
        if (channelSubscribers) {
          for (var subscriber in channelSubscribers) {
          // Check for the subscriber iframe.  It's possible the iframe
          // was removed from the dom and is no longer accessable
          if (document.getElementById(subscriber) != null) {
        	  // Only continue if the receiving widget has the correct access level
        	  var widgetId = Ozone.util.parseJson(subscriber).id;
        	  var senderId = null;
        	  try {
        		  senderId = Ozone.util.parseJson(sender).id;
        	  } catch(e) {
        		  // Do nothing...probably sent from container
        	  }
        	  
        	  Ozone.util.hasAccess({
            	  	widgetId: widgetId, 
            	  	accessLevel: accessLevel, 
            	  	channel: channel,
            	  	senderId: senderId,
            	  	callback: function(response) {
            	  		if (response.hasAccess) {
            	  			if (onRoute && !onRoute(sender, subscriber, channel, message)
    	                          && (dest == null || subscriber == dest)) {   
            	  				gadgets.rpc.call(subscriber, 'pubsub', null, channel, sender, message);
            	  			}
            	  		}
            	  	}
              });
          }
          // .. is a special term for the container
          else if (subscriber == '..' && (dest == null || subscriber == dest)) {
            //execute containerlistener
                var listener = containerListeners[channel];
            if (typeof listener === 'function') {
                  listener(sender, message,channel);
            }
          } else if (typeof _childWindows !== 'undefined') {
                //Speculatively dispatch the message to child popup windows
                gadgets.rpc.call(subscriber, 'pubsub', null, channel, sender, message);
          }
          else{
               delete channelSubscribers[subscriber];
              }
          }
        }
        break;
      default:
        throw new Error('Unknown pubsub command');
      }
    }
  }

  return /** @scope gadgets.pubsubrouter */ {
    /**
     * Initializes the PubSub message router.
     * @param {function} gadgetIdToSpecUrlHandler Function that returns the full
     *                   gadget spec URL of a given gadget id. For example:
     *                   function(id) { return idToUrlMap[id]; }
     * @param {object} opt_callbacks Optional event handlers. Supported handlers:
     *                 opt_callbacks.onSubscribe: function(gadgetId, channel)
     *                   Called when a gadget tries to subscribe to a channel.
     *                 opt_callbacks.onUnsubscribe: function(gadgetId, channel)
     *                   Called when a gadget tries to unsubscribe from a channel.
     *                 opt_callbacks.onPublish: function(gadgetId, channel, message)
     *                   Called when a gadget tries to publish a message.
     *                 *ADDED BY OZONE* opt_callbacks.onRoute: function(sender, subscriber, channel, message)
     *                   Called when a gadget tries to route a message to a subscriber
     *                 All these event handlers may reject a particular PubSub
     *                 request by returning true.
     */
    init: function(gadgetIdToSpecUrlHandler, opt_callbacks) {
      if (typeof gadgetIdToSpecUrlHandler != 'function') {
        throw new Error('Invalid handler');
      }
      if (typeof opt_callbacks === 'object') {
        onSubscribe = opt_callbacks.onSubscribe;
        onUnsubscribe = opt_callbacks.onUnsubscribe;
        onPublish = opt_callbacks.onPublish;
        onRoute = opt_callbacks.onRoute; 
      }
      gadgetIdToSpecUrl = gadgetIdToSpecUrlHandler;
      gadgets.rpc.register('pubsub', router);
    },
    publish : function(channel, message, dest, accessLevel) {
      router.call({f:'..'},'publish',channel,message, dest, accessLevel);
    },
    subscribe : function(channel, handler) {
      containerListeners[channel] = handler;
      router.call({f:'..'},'subscribe',channel);
    },
    unsubscribe : function(channel) {
      router.call({f:'..'},'unsubscribe',channel);
    }
  };
})();

