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
                          '<table>',
                            '<tr class="show-animations-row">',
                              '<td>',
                                '<input class="show-animations-checkbox" type="checkbox" {checked}/>',
                              '</td>',
                              '<td class="fieldLabel">',
                                'Enable animations',
                              '</td>',
                            '</tr>',
                          '</table>'
                  ),
                  renderData: {checked: ((Ozone.config.showAnimations) ? ('checked="checked"') : (''))}
                }
              ],
              listeners: {
                afterrender: function() {
                  // cache jQuery objects
                  var $el = $(this.el.dom);
                  me.$showAnimationsRow = $el.find('.show-animations-row');
                  me.$userPrefNotification = $el.find('.user-pref-notification');

                  // listen for checkbox clicks
                  me.$showAnimationsRow.on('click.show-animations', function(evt) {
                    // grab the target and the checkbox
                    var $target = $(evt.target);
                    var $checkbox = me.$showAnimationsRow.find('.show-animations-checkbox');

                    // grab whether the checkbox is the target
                    // and whether the checkbox is checked
                    var checkboxIsTarget = $checkbox.is($target);
                    var checkboxIsChecked = $checkbox.is(':checked');

                    // the checkbox is not the target?
                    if (!checkboxIsTarget) {
                      // manually toggle the checkbox
                      checkboxIsChecked = !checkboxIsChecked;
                      $checkbox.prop('checked', checkboxIsChecked);
                    }
                    
                    // the checkbox is checked?
                    if (checkboxIsChecked) {
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
                    }
                    // the checkboc is not checked?
                    else {
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
                    me.$userPrefNotification.show();
                  });
                },
                destroy: function() {
                  // stop listening for show animations checkbox changes
                  if (
                    me.$showAnimationsRow &&
                    me.$showAnimationsRow.length > 0
                  ) {
                    me.$showAnimationsRow.off('.show-animations');
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
