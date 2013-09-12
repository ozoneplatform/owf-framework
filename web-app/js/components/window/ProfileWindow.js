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

    // cache JQuery show animations checkbox object
    $showAnimationsCheckbox: null,

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
            align: 'stretch',
            pack: 'start',
          },
          items:[
            {
              xtype: 'panel',
              cls: 'userInfo',
              title: 'User Information',
              flex: 1,
              frame: false,
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
              frame: false,
              items: [
                {
                  xtype: 'component',
                  cls: 'userPrefTable',
                  renderTpl: new Ext.XTemplate(
                          '<table>',
                          '<tr>',
                            '<td>',
                              '<input id="show-animations-checkbox" type="checkbox" {checked}/>',
                            '</td>',
                            '<td class="fieldLabel">',
                              'Enable animations',
                            '</td>',
                          '</tr>',
                          '</table>'
                  ),
                  renderData: {checked: Ozone.config.showAnimations ? 'checked="checked"' : ''}
                }
              ],
              listeners: {
                afterrender: function() {
                  // cache jQuery show animations checkbox object
                  me.$showAnimationsCheckbox = $('#show-animations-checkbox');

                  // listen for show animations checkbox changes
                  me.$showAnimationsCheckbox.on('change.animation', function() {
                    // checked?
                    if (this.checked) {
                      // create the show animations user preference
                      Ozone.pref.PrefServer.setUserPreference({
                        namespace: "owf",
                        name: "show-animations",
                        value: true,
                        onSuccess: $.noop,
                        onFailure: $.noop
                      });
                      // update the config
                      Ozone.config.showAnimations = true;
                    } else {
                      // delete the show animations user preference
                      Ozone.pref.PrefServer.deleteUserPreference({
                        namespace: "owf",
                        name: "show-animations",
                        onSuccess: $.noop,
                        onFailure: $.noop
                      });
                      // update the config
                      Ozone.config.showAnimations = false;
                    }

                    // let the user know that refreshing
                    // the browser would be a good idea
                    var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
                    $.pnotify({
                        title: 'Refresh Required',
                        text: "Please refresh your browser to see the changes you've made in User Preferences.",
                        type: 'success',
                        addclass: "stack-bottomright",
                        stack: stack_bottomright,
                        history: false,
                        sticker: false,
                        icon: false,
                        delay: 3000
                    });
                  });
                },
                destroy: function() {
                  // stop listening for show animations checkbox changes
                  if (
                    me.$showAnimationsCheckbox &&
                    me.$showAnimationsCheckbox.length > 0
                  ) {
                    me.$showAnimationsCheckbox.off('.animation');
                  }
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
