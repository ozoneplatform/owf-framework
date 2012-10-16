Ext.define('Ozone.components.admin.widget.ApprovePanel', {
  extend: 'Ext.panel.Panel',
  alias: ['widget.approvepanel', 'widget.Ozone.components.admin.widget.ApprovePanel'],

  widgets: null,
  itemId: 'approvepanel',
  cls: 'approvepanel',

  // private
  initComponent: function() {

    this.addEvents(['approve','cancel']);

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
          itemId: 'titlePanel',
          cls: 'titlePanel',
          layout: 'fit',
          border: false,
          height: 30,
          renderTpl: ['You have selected to approve {name}.'],
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
                  'Approving these widgets will additionally approve the widgets listed below.']
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
          handler: function(button) {
            this.approve();
          },
          scope: this
        },
        {
          text: 'Cancel',
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
          if (this.widgets != null) {
            this.loadData(this.widgets);
          }
        },
        scope: this
      }
    })
  },

  loadData: function(widgets) {
    if (widgets != null) {
      this.store.loadData(widgets);

      var titlePanel = this.down('#titlePanel');
      var selectedWidgetCount = this.store.getCount();
      var renderData = {
        name: selectedWidgetCount > 1 ? ('<span class="heading-bold">'+ selectedWidgetCount + '</span> widgets') : ('<span class="heading-bold">'+this.store.getAt(0).data.name+'</span>')
      };
      if (titlePanel.rendered) {
        titlePanel.renderTpl.overwrite(titlePanel.getTargetEl(), renderData);
      }
      else {
        titlePanel.renderData = renderData;
      }

      var data = this.requiredWidgets;
      var reqGrid = this.down('#reqGrid');
      var reqStore = reqGrid.getStore();
      if (reqStore) {
        reqStore.removeAll();
        if (data.length > 0) {
          reqStore.loadData(data);
        }
        this.doLayout();
      }
    }
  },

  approve: function() {
    var widgetRecs = this.store.getRange();
    var reqGrid = this.down('#reqGrid');
    var reqStore = reqGrid.getStore();
    var reqRecs = reqStore.getRange();
    var allRecs = widgetRecs.concat(reqRecs);

    this.fireEvent('approve', {
      widgetRecs: allRecs
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
