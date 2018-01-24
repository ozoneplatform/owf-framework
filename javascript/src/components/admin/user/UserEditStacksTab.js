Ext.define('Ozone.components.admin.user.UserEditStacksTab', {
  extend: 'Ozone.components.admin.StacksTabPanel',
  alias: ['widget.usereditstacks',
    'widget.usereditstackstab',
    'widget.Ozone.components.admin.user.UserEditStacksTab'],

  cls: 'usereditstackstab',

  initComponent: function () {
    Ext.apply(this, {
      padding: 5,
      iconCls: 'stacks-tab',
      editor: 'Stack',
      componentId: 'user_id',
      title: 'Apps',
      storeCfg: {
                api: {
                    read: '/stack',
                    create: '/user',
                    update: '/stack',
                    destroy: '/user'
                },
                methods: {
                    read: 'GET',
                    load: 'GET',
                    create: 'PUT',
                    update: 'PUT',
                    save: 'POST',
                    destroy: 'PUT'
                },
                updateActions: {
                    destroy: 'remove',
                    create: 'add'
                },
                pageSize: 50
            }
    });
    this.callParent(arguments);
  },
  initBaseParams: function(record) {
    this.baseParams = {
      user_id: record.data.id
    };
    this.applyFilter();
  }

});