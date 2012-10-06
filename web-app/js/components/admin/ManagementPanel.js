Ext.define('Ozone.components.admin.ManagementPanel', {
  extend: 'Ext.panel.Panel',
  alias: ['widget.management', 'widget.managementpanel', 'widget.Ozone.components.admin.ManagementPanel'],

  initComponent: function() {

    this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance();

    //add common cls
    this.addCls('managementpanel');

    this.callParent();
  },

  launchFailureHandler: function(response) {
      if (response.error) {
          Ext.Msg.alert('Error', 'Widget Launch Failed: ' + response.message);
      }
  },

  doCreate: function() {
        OWF.Launcher.launch({
            guid: this.guid_EditCopyWidget,
            launchOnlyIfClosed: false,
      data: undefined
        }, this.launchFailureHandler);
    },

  doEdit: function(id) {
    var dataString = Ozone.util.toString({
      id: id,
      copyFlag: false
        });

    OWF.Launcher.launch({
      guid: this.guid_EditCopyWidget,
      launchOnlyIfClosed: false,
      data: dataString
    }, this.launchFailureHandler);
  },

  doDelete: function() {
    var grid = this.down('#grid');
    var records = grid.getSelectionModel().getSelection();
    if (records && records.length > 0) {
        var strSelections = '<div class="owf-user-indent"><b>';
        for (var i = 0; i < records.length; i++) {
        strSelections += records[i].data['name'] + '<br />';
        }
        strSelections += '</b></div>';
      Ext.Msg.confirm('Delete Selection', 'Are you sure you want to delete the following?<br /><br />' + strSelections, function(btn, text) {
            if (btn == 'yes') {
          var store = grid.getStore();
                var autoSave = store.autoSave;
                store.autoSave = false;
                store.remove(records);
                store.on({
                    save: {
              fn: function(s, b, data) {
                            store.reload();
                            store.autoSave = autoSave;
                        },
                        single: true
                    }
                });
                store.save();
                this.refreshWidgetLaunchMenu();
            }
        }, this);
    }
    else {
      Ext.Msg.alert('Error', "No records selected");
    }
    },

  refreshWidgetLaunchMenu: function() {
    if (this.widgetStateHandler) {
      this.widgetStateHandler.handleWidgetRequest({
        fn: 'refreshWidgetLaunchMenu'
      });
    }
    },

  //cache components that are searched for
  down: function(selector) {
    if (this.cmpCache == null) {
      this.cmpCache = Ext.create('Ext.util.MixedCollection');
                }

    var cmp = this.cmpCache.getByKey(selector);
    if (cmp == null) {
      cmp = this.callParent(arguments);
      if (cmp != null) {
        this.cmpCache.add(selector, cmp);
            }
    }

    return cmp;
  }
});
