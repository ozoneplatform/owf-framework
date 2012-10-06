//unfortunately Ext.Element and Ext.fx.Manager are singletons so the only way to fix this bug is to override the entire
//functions. which makes these patches very ExtJS 4.0.6 specific and this code needs to be checked every ExtJS upgrade

Ext.apply(Ext.Element.prototype,{
  slideIn: function(anchor, obj, slideOut) {
      var me = this,
          elStyle = me.dom.style,
          beforeAnim, wrapAnim;

      anchor = anchor || "t";
      obj = obj || {};

      beforeAnim = function() {
          var animScope = this,
              listeners = obj.listeners,
              box, position, restoreSize, wrap, anim;

          if (!slideOut) {
              me.fixDisplay();
          }

          box = me.getBox();
          if ((anchor == 't' || anchor == 'b') && box.height === 0) {
              box.height = me.dom.scrollHeight;
          }
          else if ((anchor == 'l' || anchor == 'r') && box.width === 0) {
              box.width = me.dom.scrollWidth;
          }

          position = me.getPositioning();
          me.setSize(box.width, box.height);

          wrap = me.wrap({
              style: {
                  visibility: slideOut ? 'visible' : 'hidden'
              }
          });
          wrap.setPositioning(position);
          if (wrap.isStyle('position', 'static')) {
              wrap.position('relative');
          }
          me.clearPositioning('auto');
          wrap.clip();

          // This element is temporarily positioned absolute within its wrapper.
          // Restore to its default, CSS-inherited visibility setting.
          // We cannot explicitly poke visibility:visible into its style because that overrides the visibility of the wrap.
          me.setStyle({
              visibility: '',
              position: 'absolute'
          });
          if (slideOut) {
              wrap.setSize(box.width, box.height);
          }

          switch (anchor) {
              case 't':
                  anim = {
                      from: {
                          width: box.width + 'px',
                          height: '0px'
                      },
                      to: {
                          width: box.width + 'px',
                          height: box.height + 'px'
                      }
                  };
                  elStyle.bottom = '0px';
                  break;
              case 'l':
                  anim = {
                      from: {
                          width: '0px',
                          height: box.height + 'px'
                      },
                      to: {
                          width: box.width + 'px',
                          height: box.height + 'px'
                      }
                  };
                  elStyle.right = '0px';
                  break;
              case 'r':
                  anim = {
                      from: {
                          x: box.x + box.width,
                          width: '0px',
                          height: box.height + 'px'
                      },
                      to: {
                          x: box.x,
                          width: box.width + 'px',
                          height: box.height + 'px'
                      }
                  };
                  break;
              case 'b':
                  anim = {
                      from: {
                          y: box.y + box.height,
                          width: box.width + 'px',
                          height: '0px'
                      },
                      to: {
                          y: box.y,
                          width: box.width + 'px',
                          height: box.height + 'px'
                      }
                  };
                  break;
              case 'tl':
                  anim = {
                      from: {
                          x: box.x,
                          y: box.y,
                          width: '0px',
                          height: '0px'
                      },
                      to: {
                          width: box.width + 'px',
                          height: box.height + 'px'
                      }
                  };
                  elStyle.bottom = '0px';
                  elStyle.right = '0px';
                  break;
              case 'bl':
                  anim = {
                      from: {
                          x: box.x + box.width,
                          width: '0px',
                          height: '0px'
                      },
                      to: {
                          x: box.x,
                          width: box.width + 'px',
                          height: box.height + 'px'
                      }
                  };
                  elStyle.right = '0px';
                  break;
              case 'br':
                  anim = {
                      from: {
                          x: box.x + box.width,
                          y: box.y + box.height,
                          width: '0px',
                          height: '0px'
                      },
                      to: {
                          x: box.x,
                          y: box.y,
                          width: box.width + 'px',
                          height: box.height + 'px'
                      }
                  };
                  break;
              case 'tr':
                  anim = {
                      from: {
                          y: box.y + box.height,
                          width: '0px',
                          height: '0px'
                      },
                      to: {
                          y: box.y,
                          width: box.width + 'px',
                          height: box.height + 'px'
                      }
                  };
                  elStyle.bottom = '0px';
                  break;
          }

          wrap.show();
          wrapAnim = Ext.apply({}, obj);
          delete wrapAnim.listeners;
          wrapAnim = Ext.create('Ext.fx.Anim', Ext.applyIf(wrapAnim, {
              target: wrap,
              duration: 500,
              easing: 'ease-out',
              from: slideOut ? anim.to : anim.from,
              to: slideOut ? anim.from : anim.to
          }));

          // In the absence of a callback, this listener MUST be added first
          wrapAnim.on('afteranimate', function() {
              if (slideOut) {
                  me.setPositioning(position);
                  if (obj.useDisplay) {
                      me.setDisplayed(false);
                  } else {
                      me.hide();
                  }
              }
              else {
                  me.clearPositioning();
                  me.setPositioning(position);
              }
              if (wrap.dom) {
                  var targetId = wrap.id;

                  wrap.dom.parentNode.insertBefore(me.dom, wrap.dom);
                  wrap.remove();

                  //PATCH adding a disabled attribute here.  It is possible that the wrapAnim obj is still referenced
                  //by the fx manager after the wrap node has been removed, thus setting disabled attribute to true
                  //will allow the wrapAnim to be ignored - to avoid a exception when accessing a node that is already
                  //removed
                  wrapAnim.disabled = true;
                  //PATCH end


              }
              me.setSize(box.width, box.height);
              animScope.end();
          });
          // Add configured listeners after
          if (listeners) {
              wrapAnim.on(listeners);
          }
      };

      me.animate({
          duration: obj.duration ? obj.duration * 2 : 1000,
          listeners: {
              beforeanimate: {
                  fn: beforeAnim
              },
              afteranimate: {
                  fn: function() {
                      if (wrapAnim && wrapAnim.running) {
                          wrapAnim.end();
                      }
                  }
              }
          }
      });
      return me;
  }

});

Ext.apply(Ext.fx.Manager,{
  /**
   * @private
   * Run the individual animation for this frame
   */
  runAnim: function(anim) {
      //PATCH - if there is a disabled attribute which is true, simply ignore the anim obj
      if (!anim || anim.disabled === true) {
          return;
      }
      //PATCH end

      var me = this,
          targetId = anim.target.getId(),
          useCSS3 = me.useCSS3 && anim.target.type == 'element',
          elapsedTime = me.timestamp - anim.startTime,
          target, o;

      this.collectTargetData(anim, elapsedTime, useCSS3);

      // For CSS3 animation, we need to immediately set the first frame's attributes without any transition
      // to get a good initial state, then add the transition properties and set the final attributes.
      if (useCSS3) {
          // Flush the collected attributes, without transition
          anim.target.setAttr(me.targetData[targetId], true);

          // Add the end frame data
          me.targetData[targetId] = [];
          me.collectTargetData(anim, anim.duration, useCSS3);

          // Pause the animation so runAnim doesn't keep getting called
          anim.paused = true;

          target = anim.target.target;
          // We only want to attach an event on the last element in a composite
          if (anim.target.isComposite) {
              target = anim.target.target.last();
          }

          // Listen for the transitionend event
          o = {};
          o[Ext.supports.CSS3TransitionEnd] = anim.lastFrame;
          o.scope = anim;
          o.single = true;
          target.on(o);
      }
      // For JS animation, trigger the lastFrame handler if this is the final frame
      else if (elapsedTime >= anim.duration) {
          me.applyPendingAttrs(true);
          delete me.targetData[targetId];
          delete me.targetArr[targetId];
          anim.lastFrame();
      }
  }

});