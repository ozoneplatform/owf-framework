Ext.define('Ozone.components.admin.form.UrlField', {
	 extend: 'Ext.form.field.Text',
	 alias: 'widget.urlfield',
	 
     urlRegex: /(^https):\/\/\S+/i,
     urlRegexText: Ozone.layout.DialogMessages.widgetDefinition_secureUrl_warningText,
	 hasActiveWarning: function() {
             var value = this.getValue();
		if (this.urlRegex && !this.urlRegex.test(value) && value != null && value != '')
			return true;
		else
			return false;
           },
	 getActiveWarning: function() {
	 	return this.hasActiveWarning() ? this.urlRegexText : '';
                }
});