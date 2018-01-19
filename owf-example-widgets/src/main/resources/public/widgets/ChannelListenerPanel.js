Ext.define('Ozone.data.ActiveChannelModel', {
  extend: 'Ext.data.Model',
  idProperty: 'channel',
  fields:[
    'channel'
  ]
});

Ext.define('Ozone.data.ActiveLogModel', {
  extend: 'Ext.data.Model',
  idProperty: 'date',
  fields:[
    'date','channel','message'
  ]
});

Ext.define('Ozone.components.ChannelListenerPanel', {
  extend: 'Ext.Viewport',
  alias: ['widget.channellistenerpanel', 'widget.Ozone.components.ChannelListenerPanel'],

  cls: 'channelListenerPanel',

  initComponent: function() {

    //this will add buttons to the end, to the right of any standard buttons
    OWF.Chrome.insertHeaderButtons({
      items:[
        {
          xtype: 'widgettool',
          //path to an image to use. this path should either be fully qualified or relative to the /owf context
          icon: './themes/common/images/skin/information.png',
          itemId:'help',
          handler: owfdojo.hitch(this, function(sender, data) {
            var widgetEventingController = Ozone.eventing.Widget.getInstance();
            var widgetState = Ozone.state.WidgetState.getInstance({
                widgetEventingController: widgetEventingController,
                autoInit: true
            });
            if (widgetState) {
              widgetState.getWidgetState({
                callback: function(state) {
                  //only show the about dialog when the widget is visible
                  if (!state.collapsed && !state.minimized && state.active) {
                    Ext.Msg.alert('About', 'Channel Listener Widget released with OWF ' + Ozone.version.owfversion);
                  }
                }
              });
            }
          })
        }
      ]
    });


    if (Ozone.lang.getLanguage() == 'es') {
      Ext.apply(this, {
        languageBundle: {
          channelSubscriptions: 'Suscripciones del canal',
          addChannel: 'Agregue el canal',
          activeChannels: 'Canales activos',
          activityLog: 'Registro de actividad',
          messageDetail: 'Detalle del mensaje',
          clearLog: 'Registro claro',
          exportLog: 'Registro de la exportacion',
          date: 'Fecha',
          channel: 'Canal',
          message: 'Mensaje'
        }});
    }
    else {
      Ext.apply(this, {
        languageBundle: {
          channelSubscriptions : 'Channel Subscriptions',
          addChannel : 'Add Channel',
          activeChannels : 'Active Channels',
          activityLog : 'Activity Log',
          messageDetail : 'Message Detail',
          clearLog : 'Clear Log',
          exportLog :'Export Log',
          date : 'Date',
          channel : 'Channel',
          message : 'Message'
        }});
    }

    Ext.apply(this, {
      layout: {
        type: 'border'
      },
      border: false,
      frame: false,
      items: [
        {
          itemId: 'activeChannelPanel',
          xtype: 'panel',
          title: this.languageBundle.channelSubscriptions,
          split: true,
          //frame: false,
          border: false,
          region:'north',
//          margins: '5 0 0 0',
//          cmargins: '5 5 0 0',
          width: 250,
          height: 150,
          minSize: 100,
          collapsible: false,
          layout:'fit',
          dockedItems: [
            {
              xtype: 'toolbar',
              dock: 'top',
              items: [
                {
                  itemId: 'channelToolbarTextField',
                  xtype: 'textfield'
                },
                '|',
                {
                  xtype: 'button',
                  itemId:'btnChannelToolbarAddChannel',
                  //icon: '../../../images/blue/icons/iconCreateView.gif',
                  //cls: 'x-btn-text-icon',
                  text: this.languageBundle.addChannel,
                  scope: this,
                  handler: function() {
                    this.subscribeToChannel();
                  }
                },
                '|',
                {
                  xtype: 'button',
                  text: 'Clear Channels',
                  //cls: 'x-btn-text-icon',
                  //icon: '../../../images/blue/icons/iconClearAll.gif',
                  scope: this,
                  handler: function() {
                    this.clearAllChannels();
                  }
                }
              ]
            }
          ],
          items: [
            {
              itemId:'activeChannelGrid',
              xtype: 'gridpanel',
              stateful: false,
              autoScroll: true,
              store: Ext.create('Ext.data.Store', {
                model: 'Ozone.data.ActiveChannelModel',
                proxy: {
                  type: 'memory',
                  reader: {
                    root: 'rows',
                    type: 'json'
                  }
                }
              }),
              multiSelect: false,
              columns: [
                {id:'activeChannel', header: this.languageBundle.activeChannels, dataIndex: 'channel', sortable:true, flex:1}
              ],
              listeners : {
                afterrender : {
                  fn : function(cmp) {
                    OWF.DragAndDrop.onDragStart(function() {
                      cmp.dragging = true;
                      cmp.getView().addCls('ddOver');
                    });
                    OWF.DragAndDrop.onDragStop(function() {
                      cmp.dragging = false;
                      cmp.getView().removeCls('ddOver');
                    });
                    OWF.DragAndDrop.onDrop(function(msg) {
                      this.subscribeToChannel(msg.dragDropData);
                      cmp.dragging = false;
                      cmp.getView().removeCls('ddOver');
                    }, this);

                    var view = cmp.getView();
                    view.el.on('mouseover', function(e, t, o) {
                      if (cmp.dragging) {
                        OWF.DragAndDrop.setDropEnabled(true);
                      }
                    }, this);
                    view.el.on('mouseout', function(e, t, o) {
                      if (cmp.dragging) {
                        OWF.DragAndDrop.setDropEnabled(false);
                      }
                    }, this);
                  },
                  scope : this
                }
              }
            }
          ]
        },
        {
          itemId: 'activityLogPanel',
          region:'center',
          split: true,
          //frame: false,
          border: false,
          collapsible: false,
          title: this.languageBundle.activityLog,
//          margins: '5 0 0 0',
          layout:'fit',
          dockedItems: [
            {
              xtype: 'toolbar',
              dock: 'top',
              items: [
                {
                  xtype: 'button',
                  //cls:'listenButton',
                  text: this.languageBundle.messageDetail,
                  scope: this,
                  handler: function(f) {
                    var activityLogGrid = this.down('#activityLogGrid');
                    var selections = activityLogGrid.getSelectionModel().getSelection();
                    var selected = selections[0];
                    if (selected !== undefined && selected !== null) {
                      var message = selected.data.message;
                      var w = new Ext.Window({
                        title: 'Channel:' + selected.data.channel + ' on ' + selected.data.date,
                        // cls:'testClassFind2', // this controls the message detail window that pops up
                        height:400,
                        width:400,
                        layout:'fit',
                        items:[
                          {xtype: 'textarea', hideLabel:true, value: Ext.htmlDecode(message)}
                        ]
                      });
                      w.show();
                    }
                  }
                },
                '|',
                {
                  xtype: 'button',
                  //cls:'listenButton',
                  text: this.languageBundle.clearLog,
                  scope: this,
                  handler: function(f) {
                    var activityLogGrid = this.down('#activityLogGrid');
                    activityLogGrid.getStore().removeAll();
                  }
                },
                '|',
                {
                  xtype: 'button',
                  //cls:'listenButton',
                  text: this.languageBundle.exportLog,
                  scope: this,
                  handler: function(f) {
                    var strings = [];
                    strings.push('<items>');
                    var activityLogGrid = this.down('#activityLogGrid');
                    var store = activityLogGrid.getStore();
                    for (var i = 0; i < store.getCount(); i++) {
                      var item = store.getAt(i);
                      strings.push('<item>');
                      strings.push('<date>' + item.data.date + '</date>');
                      strings.push('<channel>' + Ext.htmlDecode(item.data.channel) + '</channel>');
                      strings.push('<message>' + Ext.htmlDecode(item.data.message) + '</message>');
                      strings.push('</item>');
                    }
                    strings.push('</items>');

                    var content = strings.join('');

                    var w = new Ext.Window({
                      title: 'XML Export',
                      // cls:'testClassFind', // this controls the export window that pops up
                      height:400,
                      width:400,
                      layout:'fit',
                      items:[
                        {xtype: 'textarea', hideLabel:true, value: content}
                      ]
                    });
                    w.show();
                  }
                }
              ]
            }
          ],
          items:[
            {
              itemId: 'activityLogGrid',
              xtype: 'gridpanel',
              autoScroll: true,
              stateful: false,
              store: Ext.create('Ext.data.Store', {
                model: 'Ozone.data.ActiveLogModel',
                proxy: {
                  type: 'memory',
                  reader: {
                    root: 'rows',
                    type: 'json'
                  }
                }
              }),
              multiSelect: false,
              columns: [
                {header: this.languageBundle.date, dataIndex: 'date', renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s:u'), sortable:true, width: 150},
                {header: this.languageBundle.channel, dataIndex: 'channel', sortable:true},
                {id:'message', header: this.languageBundle.message, dataIndex: 'message', sortable:true, flex:1}
              ],
              listeners: {
                itemdblclick: {
                  fn: function(view, record, item, index, e, options) {
                    var selected = record;

                    if (selected !== undefined && selected !== null) {
                      var message = selected.data.message;
                      var w = new Ext.Window({
                        title: 'Channel:' + selected.data.channel + ' on ' + selected.data.date,
                        height:400,
                        width:400,
                        layout:'fit',
                        items:[
                          {xtype: 'textarea', hideLabel:true, value: Ext.htmlDecode(message)}
                        ]
                      });
                      w.show();
                    }
                  },
                  scope: this
                }
              }
            }
          ]
        }
      ]
    });

    this.callParent();

    this.on({
      afterrender: {
        fn: function(cmp) {
          OWF.RPC.registerFunctions([
               {
                   name: 'addToGrid',
                   fn:  this.addToGrid,
                   scope: this
               }
          ]);
          var launchConfig = OWF.Launcher.getLaunchData();
          if (launchConfig != null) {
    		var data = launchConfig;
        	try {
                data = OWF.Util.parseJson(launchConfig);
        	} catch(e) {
        		// do nothing
        	}
            if (data != null) {
              this.subscribeToChannel(data.channel);
              this.addToGrid(null, data.message, data.channel);
            }
          }
        },
        scope: this
      }
    });

  },

  subscribeToChannel: function (channel) {
    var channelToolbarTextField = this.down('#channelToolbarTextField');
    var activeChannelGrid = this.down('#activeChannelGrid');
    var text = channel ? channel : channelToolbarTextField.getValue();

    //check if the channel is already subscribed
    if (text != null && text != '' && activeChannelGrid.getStore().findExact('channel', text) == -1) {
      var channelName = text;
      activeChannelGrid.getStore().insert(0, {channel:Ext.htmlEncode(text)});
      OWF.Eventing.subscribe(channelName, owfdojo.hitch(this, this.addToGrid));
    }

  },

  clearAllChannels: function() {
    //check number of channels
    var activeChannelGrid = this.down('#activeChannelGrid');
    if (activeChannelGrid.getStore().getCount() > 0) {
      activeChannelGrid.getStore().each(function(record) {
        var channel = record.data.channel;
        OWF.Eventing.unsubscribe(channel);
      }, this);
      activeChannelGrid.getStore().removeAll();
    }
  },

  addToGrid:function(sender, msg, channel) {
    var channelName = channel;
    var activityLogGrid = this.down('#activityLogGrid');
    activityLogGrid.getStore().insert(0, {date: new Date(),channel: Ext.htmlEncode(channelName), message: Ext.htmlEncode(msg)});
  },

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
