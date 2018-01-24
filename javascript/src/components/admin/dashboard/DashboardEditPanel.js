Ext.define('Ozone.components.admin.dashboard.DashboardEditPanel', {
  extend: 'Ozone.components.EditWidgetPanel',
  alias: ['widget.dashboardedit','widget.dashboardeditpanel','widget.Ozone.components.admin.dashboard.DashboardEditPanel'],

  mixins: ['Ozone.components.WidgetAlerts'],

  cls: 'dashboardeditpanel',

  initComponent: function () {
    var self = this;

    this.launchConfig = Ozone.launcher.WidgetLauncherUtils.getLaunchConfigData();
    if (this.launchConfig != null) {
      this.launchData = Ozone.util.parseJson(this.launchConfig);
      this.hideEditorToolbar = !this.launchData.isGroupDashboard;
    }

    Ext.apply(this, {
      xtype: 'editwidgetpanel',
      cls: 'adminEditor',
      bodyCls: 'adminEditor-body',
      dragAndDrop: false,
      launchesWidgets: false,
      domain: 'Dashboard',
      channel: 'AdminChannel',
      store: Ext.StoreMgr.lookup({
        type: 'admindashboardstore'
      }),
      items: [
        {
          xtype: 'dashboardeditproperties',
          itemId: 'dashboardeditproperties',
          editPanel: self
        },
        {
          xtype: 'dashboardeditgroups',
          itemId: 'dashboardeditgroups',
          editPanel: self
        }
    ]
    });

    this.callParent(arguments);
    this.store.proxy.extraParams = {
      adminEnabled: true
    };
    if (this.launchConfig != null) {
      this.launchData = Ozone.util.parseJson(this.launchConfig);
      this.store.proxy.extraParams.isGroupDashboard = this.launchData.isGroupDashboard ;
      if (this.launchData.isGroupDashboard) {
        this.store.proxy.extraParams.group_id = this.launchData.group_id;
      }
      else {
        this.store.proxy.extraParams.user_id = this.launchData.user_id;
      }
    }
    else {
      //default to group dashboard editing
      this.store.proxy.extraParams.isGroupDashboard = true;
    }
  }
});
