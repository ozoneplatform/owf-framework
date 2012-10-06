Ext.define('Ozone.components.window.ProfileWindow', {
    extend: 'Ozone.layout.window.ManagerWindow',
    alias: [
        'widget.profileWindow'
    ],

    title: 'Profile',

    constrain: Ext.isIE,
    constrainHeader: true,
    modal: true,
    modalAutoClose: true,
    cls: 'profileWindow',
    
    mixins: {
        escHelper: 'Ozone.components.focusable.EscCloseHelper'
    },

    initComponent: function() {
        var me = this;

        var dashPanelHeight = me.ownerCt.getHeight();
        var dashPanelWidth = me.ownerCt.getWidth();

        me.height = (dashPanelHeight > 379) ? 370 : dashPanelHeight - 10;
        me.width = (dashPanelWidth > 559) ? 550 : dashPanelWidth - 10;
        me.minHeight = 250;

        Ext.apply(this, {
          items:[
            {
              xtype: 'panel',
              cls: 'userInfo',
              title: 'User Information',
              layout: {
                type: 'fit'
              },
              autoScroll: true,
              items: [
                {
                  xtype: 'component',
                  cls : 'userInfoTable',
                  renderTpl: new Ext.XTemplate(
                          '<table>',
                          '<tr>',
                            '<td class="fieldLabel">',
                            'User Name',
                            '</td>',
                            '<td class="fieldValue displayName">',
                            '{displayName:htmlEncode}',
                            '</td>',
                          '</tr>',
                          '<tr>',
                            '<td class="fieldLabel">',
                            'Full Name',
                            '</td>',
                            '<td class="fieldValue">',
                            '{userRealName:htmlEncode}',
                            '</td>',
                          '</tr>',
                          '<tr>',
                            '<td class="fieldLabel">',
                            'Email',
                            '</td>',
                            '<td class="fieldValue">',
                            '{email:htmlEncode}',
                            '</td>',
                          '</tr>',
                          '<tr>',
                            '<td class="fieldLabel">',
                            'Member of',
                            '</td>',
                            '<td class="fieldValue">',
                            '{[this.renderGroupList(values.groups)]}',
                            '</td>',
                          '</tr>',
                          '</table>',
                          {
                            renderGroupList: function(groups) {
                              var listString = '';
                              if (groups != null && groups.length > 0) {
                                for (var i = 0, len = groups.length; i < len; i++) {
                                  listString += Ext.htmlEncode(groups[i].name)
                                  if (i < len - 1) {
                                    listString += ', ';
                                  }
                                }
                              }
                              return listString;
                            }
                          }
                  ),
                  renderData: this.user
                }
              ]
            }
          ]
        });


//        me.items = [{
//            xtype: 'owfCreateDashboardsContainer',
//            dashboardContainer: me.dashboardContainer,
//            winId: me.id,
//            listeners: {
//                saved: function() {
//                    me.fireEvent('saved');
//                },
//                failed: function() {
//                    me.fireEvent('failed');
//                }
//            }
//        }];

        me.callParent(arguments);
    }

});
