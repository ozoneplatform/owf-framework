Ext.define('Ozone.data.stores.WidgetApprovalStore', {
  extend:'Ozone.data.OWFStore',
  model: 'Ozone.data.WidgetDefinition',
  alias: 'store.widgetapprovalstore',

  sorters: [
    {
      property : 'name',
      direction: 'ASC'
    }
  ],

  constructor: function(config) {

    Ext.applyIf(config, {
      api: {
        read: "/widget/listUserWidgets"
//        ,
//        create: "/widget",
//        update: "/widget",
//        destroy: "/widget"
      }
    });

    this.callParent(arguments);
  }

});