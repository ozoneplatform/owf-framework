Ext.define('Ozone.components.admin.dashboard.DashboardEditGroupsTab', {
  extend: 'Ozone.components.admin.GroupsTabPanel',
  alias: ['widget.dashboardeditgroups',
    'widget.dashboardeditgroupstab',
    'widget.Ozone.components.admin.dashboard.DashboardEditGroupsTab'],

  cls: 'dashboardeditgroupstab',

  initComponent: function () {
    Ext.apply(this, {
      padding: 5,
      iconCls: 'groups-tab',
      editor: 'Dashboard',
      componentId: 'dashboard_id',
      title: 'Groups',
      //userRecord: null,
      storeCfg: {
				api: {
					read: '/group',
                    create: '/dashboard',
                    update: '/group',
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