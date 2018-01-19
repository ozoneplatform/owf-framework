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

    // destroy on close
    closeAction: 'destroy',

    mixins: {
        escHelper: 'Ozone.components.focusable.EscCloseHelper'
    },

    // cached JQuery objects
    $showAnimationsRow: null,
    $userPrefNotification: null,

    initComponent: function() {
        var me = this;

        var dashPanelHeight = me.ownerCt.getHeight();
        var dashPanelWidth = me.ownerCt.getWidth();

        me.height = (dashPanelHeight > 379) ? 370 : dashPanelHeight - 10;
        me.width = (dashPanelWidth > 559) ? 550 : dashPanelWidth - 10;
        me.minHeight = 250;

        Ext.apply(this, {
          layout: {
            type: 'vbox',
            align: 'stretch'
          },
          items:[
            {
              xtype: 'panel',
              cls: 'userInfo',
              title: 'User Information',
              flex: 1,
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
            },
            {
              xtype: 'panel',
              cls: 'userPref',
              title: 'User Preferences',
              flex: 1,
              items: [
                {
                  xtype: 'component',
                  cls: 'userPrefTable',
                  renderTpl: new Ext.XTemplate(
                          '<p class="user-pref-notification" style="display: none;">',
                            "Please refresh your browser to see the changes you've made in User Preferences.",
                          '</p>',
                          '<p class="user-pref-notification" style="display: none;">',
                            "Note: Enabling animations may cause issues with third-party plug-ins like Google Earth.",
                          '</p>',
                          '<table>',
                            '<tr class="show-animations-row">',
                              '<td>',
                                '<input name="show-animations" class="show-animations-checkbox" type="checkbox" {animations}/>',
                              '</td>',
                              '<td class="fieldLabel">',
                                'Enable animations',
                              '</td>',
                            '</tr>',
                            '<tr class="show-hints-row">',
                              '<td>',
                                '<input name="show-hints" class="show-hints-checkbox" type="checkbox" {hints}/>',
                              '</td>',
                              '<td class="fieldLabel">',
                                'Enable hints',
                              '</td>',
                            '</tr>',
                          '</table>'
                  ),
                  renderData: {
                    animations: ((Ozone.config.showAnimations) ? ('checked="checked"') : ('')),
                    hints: ((Ozone.config.showHints) ? ('checked="checked"') : (''))
                  }
                }
              ],
              listeners: {
                afterrender: function() {
                  var $el = $(this.el.dom),
                      $userPrefNotification = $el.find('.user-pref-notification');

                  $el.on('click.save-prefs', 'input[type="checkbox"]', function(evt) {
                    var $checkbox = $(evt.target),
                        name = $checkbox.attr('name');

                    Ozone.pref.PrefServer.setUserPreference({
                      namespace: "owf",
                      name: name,
                      value: $checkbox.is(':checked'),
                      onSuccess: $.noop,
                      onFailure: $.noop
                    });

                    // let the user know that refreshing
                    // the browser would be a good idea
                    $userPrefNotification.show();
                  });
                },
                destroy: function() {
                  $(this.el.dom).off('.save-prefs');
                }
              }
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
