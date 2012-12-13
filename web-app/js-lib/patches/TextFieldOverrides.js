//this fixes a bug where if one enters same text as the emptyText the field will be considered empty
//the text will be grayed out the field will report an error if is required or must be not blank
Ext.override(Ext.form.field.Text, {
    
    supportsPlaceholder: false,
    usePlaceholderIfAvailable: true,
    

  initEvents:function () {
    var me = this,
        el = me.inputEl;

    this.callOverridden();
    if (me.usePlaceholderIfAvailable) {
        me.supportsPlaceholder = Ext.supports.Placeholder
    }
    if (!me.supportsPlaceholder) {
      me.mon(el, 'keydown', function (e) {
        if (!e.isSpecialKey()) {
          me.firstKeyPressed = true;
          me.placeholderUsed = false;
        }
      }, me);
    }
  },

    afterRender: function(){
        var me = this;
        if (me.enforceMaxLength) {
            me.inputEl.dom.maxLength = me.maxLength;
        }
        me.beforeApplyEmptyText();
        me.applyEmptyText();
        me.autoSize();
        me.callParent();
    },

  preFocus : function(){
      var me = this,
          inputEl = me.inputEl,
          emptyText = me.emptyText,
          isEmpty;

      if (emptyText && !me.supportsPlaceholder && me.placeholderUsed && inputEl.dom.value == emptyText) {
          me.setRawValue('');
          isEmpty = true;
          inputEl.removeCls(me.emptyCls);
      } else if (me.supportsPlaceholder) {
          me.inputEl.removeCls(me.emptyCls);
      }
      if (me.selectOnFocus || isEmpty) {
          inputEl.dom.select();
      }
  },
    beforeBlur: function () {
        this.beforeApplyEmptyText();
    },

    beforeApplyEmptyText: function () {
        var me = this,
                emptyText = me.emptyText,
                inputEl = me.inputEl,
                isEmpty;

        if (me.rendered && emptyText) {
            isEmpty = inputEl.dom.value.length < 1;

            if (!this.firstKeyPressed) {
                me.placeholderUsed = isEmpty || inputEl.dom.value == emptyText;
            }
            else {
                me.placeholderUsed = isEmpty;
            }
        }

    },

    // private
    postBlur : function(){
        this.fromBlur = true;
        this.applyEmptyText();
        this.keyPressedWithData = false;
        this.fromBlur = false;
    },

    reset : function(){
        this.callParent();
    },

  applyEmptyText : function(){
      var me = this,
          emptyText = me.emptyText,
          inputEl = me.inputEl,
          isEmpty;

      if (me.rendered && emptyText) {
          isEmpty = inputEl.dom.value.length < 1;

          if (me.supportsPlaceholder) {
              me.inputEl.dom.placeholder = emptyText;
          } else if (isEmpty) {
              me.setRawValue(emptyText);
          }

          //all browsers need this because of a styling issue with chrome + placeholders.
          //the text isnt vertically aligned when empty (and using the placeholder)
          if (isEmpty) {
              me.inputEl.addCls(me.emptyCls);
          }

          me.autoSize();
      }
  },
  getErrors: function(value) {
      var me = this,
          errors = me.callParent(arguments),
          validator = me.validator,
          emptyText = me.emptyText,
          allowBlank = me.allowBlank,
          vtype = me.vtype,
          vtypes = Ext.form.field.VTypes,
          regex = me.regex,
          format = Ext.String.format,
          msg;

      value = value || me.processRawValue(me.getRawValue());

      if (Ext.isFunction(validator)) {
          msg = validator.call(me, value);
          if (msg !== true) {
              errors.push(msg);
          }
      }

      if (value.length < 1 || (!me.supportsPlaceholder && me.placeholderUsed)) {
          if (!allowBlank) {
              errors.push(me.blankText);
          }
          //if value is blank, there cannot be any additional errors
          return errors;
      }

      if (value.length < me.minLength) {
          errors.push(format(me.minLengthText, me.minLength));
      }

      if (value.length > me.maxLength) {
          errors.push(format(me.maxLengthText, me.maxLength));
      }

      if (vtype) {
          if(!vtypes[vtype](value, me)){
              errors.push(me.vtypeText || vtypes[vtype +'Text']);
          }
      }

      if (regex && !regex.test(value)) {
          errors.push(me.regexText || me.invalidText);
      }

      return errors;
  },
  getRawValue: function() {
      var me = this,
          v = me.callParent();
      if (v === me.emptyText && me.placeholderUsed && !me.supportsPlaceholder) {
          v = '';
      }
      return v;
  },
    setValue: function (value) {
        var me = this,
            inputEl = me.inputEl;

        if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
            inputEl.removeCls(me.emptyCls);
        }

        me.callParent(arguments);

        //rename this
        me.beforeApplyEmptyText();
        me.applyEmptyText();

        return me;
    }

});
