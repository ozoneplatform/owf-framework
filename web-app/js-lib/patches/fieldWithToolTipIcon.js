/**
 *
 * http://extjs.com/forum/showthread.php?t=11537
 */
Ext.override(Ext.form.Field, {
  afterRender : function() {

    var findLabel = function(field) {

      var wrapDiv = null;
      var label = null

      //find form-item and label
      wrapDiv = field.getEl().up('div.x-form-item');
      if (wrapDiv) {
        label = wrapDiv.child('label');
      }
      if (label) {
        return label;
      }

    };
    if (this.helpText) {

      var label = findLabel(this);

      if (label) {

        var helpImage = label.createChild({
          tag: 'img',
          src: this.helpIcon,
          style: 'margin-bottom: 0px; margin-left: 5px; padding: 0px; vertical-align: top;',
          width: 16,
          height: 16
        });


        Ext.QuickTips.register({
          target:  helpImage,
          text: this.helpText,
          enabled: true
        });

      }
    }
    Ext.form.Field.superclass.afterRender.call(this);
    this.initEvents();
    this.initValue();
  }
});
