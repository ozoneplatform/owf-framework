Ext.define('Ozone.data.stores.PreferenceStore', {
  extend:'Ozone.data.OWFStore',
  model: 'Ozone.data.Preference',
  alias: 'store.preferencestore',
  remoteSort: true,
  sorters: [
    {
      property : 'namespace',
      direction: 'ASC'
    }
  ],
  constructor: function(config) {

    Ext.applyIf(config, {
      api: {
        read: "/administration/listPreferences",
        create: "/administration/addCopyPreferenceSubmit",
        update: "/administration/updatePreference",
        destroy: "/administration/deletePreferences"
      }
    });

    this.callParent(arguments);
  }

});