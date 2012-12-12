Ext.define('Ozone.components.admin.widget.WidgetDetailPanel', {
  extend: 'Ext.panel.Panel',
  alias: ['widget.widgetdetailpanel'],
  layout: {
      type: 'vbox',
      align: 'stretch'
  },
  viewGroup: null,

  initComponent: function() {
    var me = this;
    
    OWF.Preferences.getUserPreference({
        namespace: 'owf.admin.WidgetEditCopy',
        name: 'guid_to_launch',
        onSuccess: function(result) {
            me.guid_EditCopyWidget = result.value;
        },
        onFailure: function(err){ /* No op */
            Ext.Msg.alert('Preferences Error', 'Error looking up Widget Editor: ' + err);
        }
    });

    //create new store
    if (this.store == null) {
      this.store = Ext.StoreMgr.lookup({
        type: 'adminwidgetstore'
      });
    }

    this.viewGroup = Ext.create('Ext.view.View', {
		cls: 'widgetDetailsView',
		store: this.store,
		deferEmptyText: false,
		//minHeight: 200,
		//autoScroll: true,
		flex: 1,
		tpl: new Ext.XTemplate(
			'<tpl for=".">',
			'<div class="detail-info">',
			'<div class="detail-header-block">',
			'<div class="detail-widget">',
			'<div class="detail-icon">',
			  '<img src={image:this.renderImage} title="{name:htmlEncode}" class="detail-icon-image">',
			'</div>',
			'</div>',
			'<div class="detail-icon-block">',
			'<div class="detail-title">{name:htmlEncode}</div>',
			 '<div><span class="detail-label">Version:</span> {version:htmlEncode}</div>',
			'</div>',
			'</div>',
			'<div class="detail-block">',
			'<div><span class="detail-label">Description:</span> {description:htmlEncode}</div>',
			'<div><span class="detail-label">Universal Name:</span> {universalName:htmlEncode}</div>',
			'<div><span class="detail-label">Default Tags:</span> {tags:this.renderTags}</div>',
			'<div><span class="detail-label">Single Instance:</span> {singleton}</div>',
			'<div><span class="detail-label">Visible:</span> {definitionVisible}</div>',
      '<div><span class="detail-label">Background:</span> {background}</div>',
			'<div><span class="detail-label">Requires Widgets:</span> {directRequired:this.renderRequiresFlag}</div>',
			'<div><span class="detail-label">Width:</span> {width}</div>',
			'<div><span class="detail-label">Height:</span> {height}</div>',
			'</div>',
			'</div>',
			'</tpl>',
			{
				// XTemplate configuration:
				compiled: true,
				// member functions:
				renderImage: function(url) {
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
					return encodeURI(decodeURI(url));
				},
				renderTags: function(tags) {
					var strTags = "";
					if (tags != null) {
						for (var i = 0; i < tags.length; i++) {
							strTags += Ext.htmlEncode(tags[i].name);
							if (i < tags.length - 1) {
								strTags += ", ";
							}
						}
					}

					if (strTags == "") {
						strTags = "<i>none</i>";
					}

					return strTags;
				},
				renderRequiresFlag: function(directRequired) {
					return directRequired != null && directRequired.length > 0 ;
				}
			}
		),
		emptyText: 'No widget selected',
		itemSelector: 'div.mpDetailSummary',
		autoScroll: 'true'
    });

    this.items = [
      this.viewGroup,
      {
        xtype: 'grid',
        itemId: 'reqGrid',
        cls: 'reqGrid',
        autoScroll: true,
        hidden: true,
        hideHeaders: true,
        forceFit: true,
//        disableSelection: true,
        flex: 1,
        border: false,
        store: {
          type: 'adminwidgetstore',
          remoteSort: false
        },
//        title: 'This Widget Requires:',
        dockedItems: [
          {
            xtype: 'toolbar',
            dock: 'top',
            items: [
              {
                xtype: 'tbtext',
                text: 'This Widget Requires:'
              }
            ]
          }
        ],
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
          }
        ],
        listeners: {
          itemdblclick: {
            fn: function(view) {
              var records = view.getSelectionModel().getSelection();
              if (records && records.length > 0) {
                for (var i = 0; i < records.length; i++) {
                  this.doEdit(records[i].data.id, records[i].data.name);
                }
              }
              else {
                Ext.Msg.alert("Error", "You must select at least one widget to edit.");
              }
            },
            scope: this
          }
        }
      }

    ];

    this.callParent(arguments);

  },

  clear: function() {
    this.load(null);
  },

  load: function(record) {
    var reqGrid = this.getComponent('reqGrid');

    var records = [];
    if (record != null) {
      records.push(record);
    }
    //set the detailsView to display info for the passed in widget
    this.viewGroup.store.loadData(records, false);

    //there are required widgets display them
    if (record != null && record.data.allRequired != null && record.data.allRequired.length > 0) {
      //save off where this request comes from for later
      this.requestFrom = record.data.id;
      //get all required widgets via ajax call
      Ext.Ajax.request({
          url: Ozone.util.contextPath() + '/widget',
          params: {
              id: record.data.allRequired,
              _method: 'GET'
          },
          success: function(response, opts) {
              var json = Ext.decode(response.responseText);
              if (json) {
                var data = json.data;
                if (data != null && data.length > 0) {

                  var requiredWidgets = [];
                  if (data) {
                    for (var i = 0; i < data.length; i++) {
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

                  //show required widgets
                  if (reqGrid && this.store.getAt(0).get('id') == this.requestFrom) {
                    reqGrid.store.loadData(requiredWidgets);
                    reqGrid.setVisible(true);
                  }
                }
                else {
                  //hide grid there are no required widgets
                  if (reqGrid) {
                    reqGrid.store.removeAll(true);
                    reqGrid.setVisible(false);
                  }
                }
              }
          },
          failure: function(response, opts) {
              Ext.Msg.alert('Server Error','Error retrieving required widgets: ' + response);
          },
          scope: this
      });
    }
    else {
      if (reqGrid) {
        reqGrid.store.removeAll(true);
        reqGrid.setVisible(false);
      }
    }
  },

  doEdit: function(id, title) {
    var dataString = Ozone.util.toString({
      id: id,
      copyFlag: false
    });

    OWF.Launcher.launch({
      title: '$1 - ' + title,
      titleRegex: /(.*)/,
      guid: this.guid_EditCopyWidget,
      launchOnlyIfClosed: false,
      data: dataString
    }, function(response) {
      if (response.error) {
        Ext.Msg.alert('Launch Error', 'Widget Editor Launch Failed: ' + response.message);
      }
    });
  }


});
