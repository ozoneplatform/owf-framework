Ext.define('Ozone.components.panel.WidgetTool', {
    extend: 'Ext.panel.Tool',
    alias: ['widget.widgettool','widget.Ozone.components.panel.WidgetTool'],
    renderTpl: ['<img id="{id}-toolEl" src="{icon}" class="{baseCls}-{type}" role="presentation"/>'],

    plugins: [
        new Ozone.components.focusable.Focusable('toolEl')
    ],

    initComponent: function() {
        var me = this;

        this.renderData = this.renderData ? this.renderData : {};
        Ext.apply(this.renderData, {
          icon : this.icon != null ? this.icon : Ext.BLANK_IMAGE_URL
        });

        me.childEls = ['toolEl'];

        me.callParent();

        me.on('afterrender', function() {

            //bind enter to the click handler
            var keyMap = new Ext.util.KeyMap(me.el, {
                key: [Ext.EventObject.ENTER, Ext.EventObject.SPACE],
                fn: function(key, evt) {
                    evt.preventDefault(); //stop keypress from firing since the handler might
                                          //change the focus
                    me.handler.call(this, evt);
                },
                scope: me.scope || me
            });
        });
    },

//    focus: function() {
//        this.callParent();
//
//        //set keyboard focus to the img tag.
//        //The div itself cannot be focused because
//        //it does not have a tabindex
//        this.toolEl.focus();
//    },

    getFocusEl: function() {
        return this.toolEl;
    },

    isFocused: function() {
        return (this.toolEl.dom === document.activeElement);
    },

  /**
   * Called when the user presses their mouse button down on a tool
   * Adds the press class ({@link #toolPressedCls})
   * @private
   */
  onMouseDown: function() {
      if (this.disabled) {
          return false;
      }

      this.el.addCls(this.toolPressedCls);

      this.wasClicked = true;
      if (this.ownerCt) {
        this.ownerCt.toolClicked = true;
      }
  },

  onClick: function(e, target) {
    var returnValue = null;

    returnValue = this.callParent(arguments);
    this.wasClicked = false;
    if (this.ownerCt) {
      this.ownerCt.toolClicked = false;
    }

    return returnValue;

  }
});
