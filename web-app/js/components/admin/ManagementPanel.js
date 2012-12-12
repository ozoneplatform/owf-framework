Ext.define('Ozone.components.admin.ManagementPanel', {
  extend: 'Ext.panel.Panel',
  alias: ['widget.management', 'widget.managementpanel', 'widget.Ozone.components.admin.ManagementPanel'],

  mixins: ['Ozone.components.WidgetAlerts'],

  initComponent: function() {

    this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance();

    //add common cls
    this.addCls('managementpanel');

    this.callParent();
  },

  launchFailureHandler: function(response) {
      if (response.error) {
          this.showAlert('Error', 'Widget Launch Failed: ' + response.message);
      }
  },

  doCreate: function() {
        OWF.Launcher.launch({
            guid: this.guid_EditCopyWidget,
            launchOnlyIfClosed: false,
            data: undefined
        }, this.launchFailureHandler);
    },

  doEdit: function(id, title) {
    var dataString = Ozone.util.toString({
      id: id,
      copyFlag: false
        });

    OWF.Launcher.launch({
      guid: this.guid_EditCopyWidget,
      title: '$1 - ' + title,
      titleRegex: /(.*)/,
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
        this.showConfirmation('Delete Selection', 'Are you sure you want to delete the following?<br /><br />' + strSelections, function(btn, text) {
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
        });
    }
    else {
        this.showAlert('Error', "No records selected");
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
  },
    
    //Can export a widget or stack descriptor
    doExport: function(exportItem, record) {
        var me = this;

        var okFn = function(filename) {
            var exportFailed = function(errorMsg) {
                var msg = 'The export of ' + exportItem + ' ' + Ext.htmlEncode(record.get('name')) + ' failed.';
                me.showAlert('Server Error!', errorMsg ? errorMsg : msg);
            }

            //Create hidden iframe to retrieve file without navigating widget or OWF on failure
            var iframe = document.createElement('iframe');
            iframe.id = 'exportIFrame';
            iframe.src = Ozone.util.contextPath() + '/' + exportItem + '/export?id=' + record.get('id') + '&filename=' + filename;
            iframe.style.display = "none";

            //Inspect body of hidden iframe after load for error message and display alert if found
            iframe.onload = function() {
                var iframe = this, bodyIframe = null;
                try {
                    if (iframe.contentWindow && iframe.contentWindow.document.body) {
                        bodyIframe = iframe.contentWindow.document.body;
                    } else if (iframe.document && iframe.document.body) {
                        bodyIframe = iframe.document.body;
                    } else if (iframe.contentDocument && iframe.contentDocument.body) {
                        bodyIframe = iframe.contentDocument.body;
                    }

                    //If there is html in the body, check if success if false, if so export failed
                    if(bodyIframe.innerHTML) {
                        var response = Ozone.util.parseJson(bodyIframe.innerHTML);
                        if(!response.success) {
                            exportFailed(response.errorMsg);
                        }
                    }
                } catch(e) {
                    //Catches a bug in IE where an 'Access denied' error
                    //is thrown due to the iframe src returning a 500 response
                    exportFailed();
                }
            }

            //Append iframe to document, which triggers the src call to get the file
            document.body.appendChild(iframe);
        }

        //Get the filename of the item's descriptor url to prefill the filename
        //field of the export window
        var itemFilename = '',
            url = record.get('descriptorUrl');
        if(url) {
            itemFilename = url.substring(url.lastIndexOf('/')+1, url.length);
            itemFilename.indexOf('.') > -1 && (itemFilename = itemFilename.substring(0, itemFilename.lastIndexOf('.')));
        }

        var win = Ext.widget('exportwindow', {
            focusOnClose: this.down(),
            itemName: record.get('name'),
            itemFilename: itemFilename,
            okFn: okFn
        });
        win.show();
    }
});
