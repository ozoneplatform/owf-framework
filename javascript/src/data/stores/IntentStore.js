Ext.define('Ozone.data.stores.IntentStore', {
  extend:'Ext.data.Store',
  model: 'Ozone.data.Intent',
  alias: 'store.intentstore',

  groupField: 'action',

  sorters: [
    {
        property : 'action',
        direction: 'ASC'
    },
    {
        property : 'dataType',
        direction: 'ASC'
    },
    {
        property : 'send',
        direction: 'ASC'
    },
    {
      property : 'receive',
      direction: 'ASC'
    }
  ],
  constructor: function(config) {

    this.callParent(arguments);
  }
});