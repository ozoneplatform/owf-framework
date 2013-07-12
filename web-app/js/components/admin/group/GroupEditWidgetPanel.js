Ext.define('Ozone.components.admin.group.GroupEditWidgetPanel', {
	extend: 'Ozone.components.EditWidgetPanel',
	alias: [
    'widget.groupeditwidgetpanel',
    'widget.groupeditwidgetpanel',
    'widget.Ozone.components.admin.group.GroupEditWidgetPanel'
  ],

	enableTabs: function() {
        var tb = this.getDockedComponent('editorToolbar');
        var group = this.store.getAt(0)
        for (var i = 0; tb.items && i < tb.items.getCount(); i++) {
            var button = tb.items.getAt(i);
            if (button) {
                if ((group.data.name === 'OWF Administrators' || group.data.name === 'OWF Users')
                    && (group.data.automatic === true)
                    && (button.text === 'Users')) {
                  button.setDisabled(true);
                }
                else {
                  button.setDisabled(false);
                }
            }
        }
    }
});