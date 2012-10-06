// TODO: review this when upgrading EXT - when we build EXT from source move this patch directly onto the respective
// source files
// Added for a bug in Ext 4.0.7: OWF-2686

//it seems the removeListener function for adding a listener to a dom element do not pass the captureFlag
//this means if you add an event listener with {capture:true} you will never be able to remove it in FF

(function() {

  var removeListenerEventManager = function(element, eventName, fn, scope, options) {
        // handle our listener config object syntax
        if (typeof eventName !== 'string') {
            this.prepareListenerConfig(element, eventName, true);
            return;
        }

        var dom = Ext.getDom(element),
            cache = this.getEventListenerCache(dom, eventName),
            bindName = this.normalizeEvent(eventName).eventName,
            i = cache.length, j,
            listener, wrap, tasks;

        //patch - defaulted options to be empty obj if null
        options = options || {};

        while (i--) {
            listener = cache[i];

            if (listener && (!fn || listener.fn == fn) && (!scope || listener.scope === scope)) {
                wrap = listener.wrap;

                // clear buffered calls
                if (wrap.task) {
                    clearTimeout(wrap.task);
                    delete wrap.task;
                }

                // clear delayed calls
                j = wrap.tasks && wrap.tasks.length;
                if (j) {
                    while (j--) {
                        clearTimeout(wrap.tasks[j]);
                    }
                    delete wrap.tasks;
                }

                if (dom.detachEvent) {
                    dom.detachEvent('on' + bindName, wrap);
                } else {
                    //patch - passing the capture flag to removeEventListener
                    dom.removeEventListener(bindName, wrap, options.capture || false);
                }

                if (wrap && dom == document && eventName == 'mousedown') {
                    this.stoppedMouseDownEvent.removeListener(wrap);
                }

                // remove listener from cache
                Ext.Array.erase(cache, i, 1);
            }
        }
  };
  Ext.apply(Ext.EventManager, {

    /**
    * Removes an event handler from an element.  The shorthand version {@link #un} is equivalent.  Typically
    * you will use {@link Ext.Element#removeListener} directly on an Element in favor of calling this version.
    * @param {String/HTMLElement} el The id or html element from which to remove the listener.
    * @param {String} eventName The name of the event.
    * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
    * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
    * then this must refer to the same object.
    */
    removeListener : removeListenerEventManager,

    un : removeListenerEventManager
  });

  var removeListenerElement = function(eventName, fn, scope, options) {
        Ext.EventManager.un(this.dom, eventName, fn, scope || this, options);
        return this;
  };
  Ext.apply(Ext.Element.prototype, {
    /**
     * Removes an event handler from this element.
     *
     * **Note**: if a *scope* was explicitly specified when {@link #addListener adding} the listener,
     * the same scope must be specified here.
     *
     * Example:
     *
     *     el.removeListener('click', this.handlerFn);
     *     // or
     *     el.un('click', this.handlerFn);
     *
     * @param {String} eventName The name of the event from which to remove the handler.
     * @param {Function} fn The handler function to remove. **This must be a reference to the function passed into the
     * {@link #addListener} call.**
     * @param {Object} scope If a scope (**this** reference) was specified when the listener was added, then this must
     * refer to the same object.
     * @return {Ext.Element} this
     */
    removeListener: removeListenerElement,

    un: removeListenerElement

  });

  var observableOverrides = {

    /**
     * Removes listeners that were added by the {@link #mon} method.
     *
     * @param {Ext.util.Observable/Ext.Element} item The item from which to remove a listener/listeners.
     * @param {Object/String} ename The event name, or an object containing event name properties.
     * @param {Function} fn (optional) If the `ename` parameter was an event name, this is the handler function.
     * @param {Object} scope (optional) If the `ename` parameter was an event name, this is the scope (`this` reference)
     * in which the handler function is executed.
     */
      removeManagedListener: function(item, ename, fn, scope, opts) {
          var me = this,
              options,
              config,
              managedListeners,
              length,
              i;

          if (typeof ename !== 'string') {
              options = ename;
              for (ename in options) {
                  if (options.hasOwnProperty(ename)) {
                      config = options[ename];
                      if (!me.eventOptionsRe.test(ename)) {
                          //patch - added opts to args
                          me.removeManagedListener(item, ename, config.fn || config, config.scope || options.scope, opts);
                      }
                  }
              }
          }

          managedListeners = me.managedListeners ? me.managedListeners.slice() : [];

          for (i = 0, length = managedListeners.length; i < length; i++) {
              //patch - added opts to args
              me.removeManagedListenerItem(false, managedListeners[i], item, ename, fn, scope, opts);
          }
      },

      /**
       * Remove a single managed listener item
       * @private
       * @param {Boolean} isClear True if this is being called during a clear
       * @param {Object} managedListener The managed listener item
       * See removeManagedListener for other args
       */
      removeManagedListenerItem: function(isClear, managedListener, item, ename, fn, scope, options){
          //patch - added options to if condidition
          if (isClear || (managedListener.item === item && managedListener.ename === ename && (!fn || managedListener.fn === fn)
                  && (!scope || managedListener.scope === scope)&& (!options || managedListener.options === options))) {
              //patch - added options to if condidition
              managedListener.item.un(managedListener.ename, managedListener.fn, managedListener.scope, managedListener.options);
              if (!isClear) {
                  Ext.Array.remove(this.managedListeners, managedListener);
              }
          }
      }
  };

  //Because Observable is a mixin, every class which uses it will have already copied the original functions
  //into their prototype during that classes creation.  This means the overrides need to be used on every
  //class which may use the mixin individually - which is cumbersome
  Ext.override(Ext.util.Observable, observableOverrides);
  Ext.override(Ozone.components.tab.WidgetTab, observableOverrides);


})();