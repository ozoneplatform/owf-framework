Ext.define('Ozone.components.admin.group.GroupEditStacksTab', {
  extend: 'Ozone.components.admin.StacksTabPanel',
  alias: ['widget.groupeditstacks',
    'widget.groupeditstackstab',
    'widget.Ozone.components.admin.group.GroupEditStacksTab'],

  cls: 'groupeditstackstab',

  initComponent: function () {
    Ext.apply(this, {
      padding: 5,
      iconCls: 'stacks-tab',
      editor: 'Group',
      componentId: 'group_id',
      title: 'Apps',
      storeCfg: {
                api: {
                    read: '/stack',
                    create: '/group',
                    update: '/stack',
                    destroy: '/group'
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
      group_id: record.data.id
    };
    this.applyFilter();
  }

});