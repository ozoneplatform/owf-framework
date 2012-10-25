Ext.define('Ozone.components.admin.widget.DeleteWidgetsPanel', {
  extend: 'Ext.panel.Panel',
  alias: ['widget.deletewidgetspanel', 'widget.Ozone.components.admin.widget.DeleteWidgetsPanel'],

  mixins: {
    circularFocus: 'Ozone.components.focusable.CircularFocus'
  },

  delWidgets: null,
  itemId: 'deletepanel',
  cls: 'deletepanel',

  // private
  initComponent: function() {

    this.addEvents(['delete','cancel']);

    //create new store
    if (this.store == null) {
      this.store = Ext.StoreMgr.lookup({
        type: 'adminwidgetstore'
      });
    }

    Ext.apply(this, {
      layout: {
        type: 'vbox',
        align: 'stretch'
      },
      items: [
        {
          xtype: 'component',
          itemId: 'delTitlePanel',
          cls: 'delTitlePanel',
          layout: 'fit',
          border: false,
          height: 30,
          renderTpl: ['You have selected to delete {name}.'],
          renderData: {
            name: '0 widget(s)'
          }
        }
        ,
        {
          xtype: 'component',
          itemId: 'reqTitlePanel',
          cls: 'reqTitlePanel',
          layout: 'fit',
          border: false,
          height: 50,
          renderTpl: ['These widgets are required by other widgets in OWF. ' +
                  'Deleting these widgets will additionally delete the widgets listed below.']
        },
        {
          xtype: 'grid',
          itemId: 'reqGrid',
          autoScroll: true,
          forceFit: true,
          flex: 1,
          border: false,
          store: {
            type: 'adminwidgetstore',
            remoteSort: false
          },
          columns: [
            {
              itemId: 'name',
              header: 'Title',
              dataIndex: 'name',
              flex: 1,
              minWidth: 200,
              sortable: true,
              renderer:  function(value, metaData, record, rowIndex, columnIndex, store, view) {

                var title = value;
                var url = record.get('headerIcon');

                var contextPath = Ozone.util.contextPath();
                if (!url.match(new RegExp('^/?' + contextPath + '/.*$', 'i')) && !url.match(new RegExp('^https?://.*', 'i'))) {
                  //url is not relative to the contextPath
                  if (url.indexOf('/') == 0) {
                    url = contextPath + url;
                  }
                  else {
                    url = contextPath + '/' + url;
                  }
                }

                var retVal = '<div class="grid-widget"><div class="grid-icon-and-text-title-box"><div class="grid-icon-and-text-icon"><img class="grid-icon-and-text-icon-image" src="' + url + '"> ';
                retVal += '</div>';
                retVal += '<div class="grid-icon-and-text-title">' + title + '</div>';


                return  retVal;
              }
            },
            {
              itemId: 'widgetUrl',
              header: 'URL',
              dataIndex: 'url',
              flex: 1,
              minWidth: 250,
              menuDisabled: true,
              sortable: true
            }
          ]
        }
      ],
      buttons: [
        {
          text: Ozone.layout.DialogMessages.ok,
          itemId: 'ok',
          handler: function(button) {
            this.del();
          },
          scope: this
        },
        {
          text: 'Cancel',
          itemId: 'cancel',
          handler: function(button) {
            this.cancel();
          },
          scope: this
        }
      ]
    });

    this.callParent();

    this.on({
      afterrender: {
        fn: function() {
            if (this.delWidgets != null) {
            this.loadData(this.delWidgets);
            }
            var okBtn = this.down('#ok').getFocusEl(),
                cancelBtn = this.down('#cancel').getFocusEl();
            this.setupFocus(okBtn, cancelBtn);
            Ext.defer(function() {cancelBtn.focus();}, 400);
        },
        scope: this
      }
    });
  },

  loadData: function(delWidgets) {
    if (delWidgets != null) {
      this.store.loadData(delWidgets);

      var delTitlePanel = this.down('#delTitlePanel');
      var selectedWidgetCount = this.store.getCount();
      var renderData = {
        name: selectedWidgetCount > 1 ? ('<span class="heading-bold">'+selectedWidgetCount + '</span> widgets') : ('<span class="heading-bold">'+this.store.getAt(0).data.name+'</span>')
      };
      if (delTitlePanel.rendered) {
        delTitlePanel.renderTpl.overwrite(delTitlePanel.getTargetEl(), renderData);
      }
      else {
        delTitlePanel.renderData = renderData;
      }

      var requiredWidgets = [];
      var data = this.requiredWidgets;

      if (data) {
        for (var i = 0; i < data.length; i++) {
          if (-1 == this.store.find('guid', data[i].path)) {
            requiredWidgets.push({
              id: data[i].path,
              name: data[i].value.namespace,
              version: data[i].value.widgetVersion,
              url: data[i].value.url,
              headerIcon: data[i].value.headerIcon,
              image: data[i].value.image,
              width: data[i].value.width,
              height: data[i].value.height,
              widgetGuid: data[i].path,
              maximized: data[i].value.maximized,
              minimized: data[i].value.minimized,
              x: data[i].value.x,
              y: data[i].value.y,
              visible: data[i].value.visible,
              tags: data[i].value.tags,
              totalUsers: data[i].value.totalUsers,
              totalGroups: data[i].value.totalGroups,
              singleton: data[i].value.singleton
            });
          }
        }
      }

      var reqGrid = this.down('#reqGrid');
      var reqStore = reqGrid.getStore();
      if (reqStore) {
        reqStore.removeAll();
        if (requiredWidgets.length > 0) {
          reqStore.loadData(requiredWidgets);
        }
        this.doLayout();
      }
    }
  },

  del: function() {
    var delRecs = this.store.getRange();
    var reqGrid = this.down('#reqGrid');
    var reqStore = reqGrid.getStore();
    var reqRecs = reqStore.getRange();
    var allRecs = Ext.create('Ext.util.MixedCollection');
    for (var i = 0; i < delRecs.length; i++) {
      allRecs.add(delRecs[i].data.widgetGuid,delRecs[i].data.widgetGuid);
    }
    for (var i = 0; i < reqRecs.length; i++) {
      allRecs.add(reqRecs[i].data.widgetGuid,reqRecs[i].data.widgetGuid);
    }

    this.fireEvent('delete', {
      widgetGuidsToDelete: allRecs.getRange()
    });
  },

  cancel: function() {
    this.fireEvent('cancel');
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
