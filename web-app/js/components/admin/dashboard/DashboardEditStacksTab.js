Ext.define('Ozone.components.admin.dashboard.DashboardEditStacksTab', {
  extend: 'Ozone.components.admin.StacksTabPanel',
  alias: ['widget.dashboardeditstacks',
    'widget.dashboardeditstackstab',
    'widget.Ozone.components.admin.dashboard.DashboardEditStacksTab'],

  cls: 'dashboardeditstackstab',

  initComponent: function () {
    Ext.apply(this, {
      padding: 5,
      iconCls: 'stacks-tab',
      editor: 'Dashboard',
      componentId: 'dashboard_id',
      title: 'Stacks',
      storeCfg: {
				api: {
					read: '/stack',
                    create: '/dashboard',
                    update: '/stack',
                    destroy: '/dashboard'
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
      dashboard_id: record.data.id
    };
    this.applyFilter();
  }

});