Ext.override(Ext.ZIndexManager, {

  assignZIndices: function() {
    var a = this.zIndexStack, len = a.length, i = 0, zIndex = this.zseed, comp;

    for (; i < len; i++) {
      comp = a[i];
      if (comp && !comp.hidden) {

        // Setting the zIndex of a Component returns the topmost zIndex consumed by
        // that Component.
        // If it's just a plain floating Component such as a BoundList, then the
        // return value is the passed value plus 10, ready for the next item.
        // If a floating *Container* has its zIndex set, it re-orders its managed
        // floating children, starting from that new base, and returns a value 10000 above
        // the highest zIndex which it allocates.
        zIndex = comp.setZIndex(zIndex);

        if (comp.fixedZIndex != null) {
          comp.zIndex = zIndex;
          comp.setZIndex(comp.fixedZIndex);
        }

      }
    }
    this._activateLast();
    return zIndex;
  },

  _showModalMask: function(comp) {
    var zIndex = comp.el.getStyle('zIndex') - 4, maskTarget = comp.floatParent ? comp.floatParent.getTargetEl() : Ext.get(comp.getEl().dom.parentNode), parentBox;

    if (!maskTarget) {
      //<debug>
      Ext.global.console && Ext.global.console.warn && Ext.global.console.warn('mask target could not be found. Mask cannot be shown');
      //</debug>
      return;
    }

    //search for fixedZIndexed Comps and set their index to just under the shim
    for (var i = 0, len = this.zIndexStack.length; i < len; i++) {
      var c = this.zIndexStack[i];
      if (c && !c.hidden) {
        if (c.fixedZIndex != null) {
          c.setZIndex(zIndex - 1);
//          c.setZIndex(c.zIndex);
        }
      }
    }

    parentBox = maskTarget.getBox();

    if (!this.mask) {
      this.mask = Ext.getBody().createChild({
        cls: Ext.baseCSSPrefix + 'mask'
      });
      this.mask.setVisibilityMode(Ext.Element.DISPLAY);
      this.mask.on('click', this._onMaskClick, this);
    }
    if (maskTarget.dom === document.body) {
      parentBox.height = Ext.Element.getViewHeight();
    }
    maskTarget.addCls(Ext.baseCSSPrefix + 'body-masked');
    this.mask.setBox(parentBox);
    this.mask.setStyle('zIndex', zIndex);
    this.mask.show();
  },

  _hideModalMask: function() {
    if (this.mask && this.mask.dom.parentNode) {
      Ext.get(this.mask.dom.parentNode).removeCls(Ext.baseCSSPrefix + 'body-masked');
      this.mask.hide();

      //search for fixedZIndexed Comps and set their index to just under the shim
      for (var i = 0, len = this.zIndexStack.length; i < len; i++) {
        var c = this.zIndexStack[i];
        if (c && !c.hidden) {
          if (c.fixedZIndex != null) {
            c.setZIndex(c.fixedZIndex);
          }
        }
      }
    }
  },

  /*
   * Close the modal component, when mask is clicked.
   */
  _onMaskClick: function() {
    if (this.front) {
      //allows a modal window to auto close if you click outside
      if (this.front.modalAutoClose) {
        this.front.fireEvent('modalAutoClose');
        this.front.close();
      }
      else {
        this.front.focus();
      }
    }
  }
});
