Ext.define('Ozone.components.window.MyPageTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.mypagetip',
    clickedDashboard: null,
    event:null,
    cls: 'ozonequicktip itemTip',
    shadow: false,
    closable:true,
    autoHide:false,
    draggable:false,
    listeners: {
        'close': {
            fn: function(){
                this.destroy();
            }
        },
        'afterRender': {
            fn: function() {
                this.hideButtons();
                this.setupClickHandlers();
                $('.name').dotdotdot({
                    ellipsis: '…'
                });
            }
        }
    },

    dashboardContainer: null,
    appsWindow: null,
    $dashboard: null,

    getToolTip: function () {
        var me = this,
            icn = me.clickedDashboard.iconImageUrl && me.clickedDashboard.iconImageUrl != ' ' ?
                '<img class=\'tipIcon\' src=\'' + encodeURI(decodeURI(me.clickedDashboard.iconImageUrl)) +
                '\' />' : '<div class=\'tipIcon noIconGivenPage\'></div>',
            str = '<div class=\'dashboard-tooltip-content\'>' + icn +
                '<h3 class=\'name\' title="'+ Ext.htmlEncode(me.clickedDashboard.name) +'">'+ Ext.htmlEncode(me.clickedDashboard.name) + '</h3>';

        me.clickedDashboard.description ? (str += '<div class=\'description\'><p class=\'tip-description\'>' + Ext.htmlEncode(me.clickedDashboard.description) +'  </p></div>') :
        								  (str += '<p class=\'tip-description\'>  </p>');

        // append buttons
        str += '<ul style=\'buttonBar \'>' +
                    '<li class=\'restoreButton actionButton liPageAdjust\'>'+
                        '<span class=\'restoreImg \' ></span>'+
                        '<p class=\'actionText\'>Restore</p>'+
                    '</li>'+
                    '<li class=\'editButton actionButton liPageAdjust\'>'+
                        '<span class=\'editImg \'></span>'+
                        '<p class=\'actionText\'>Edit</p>'+
                    '</li>'+
                    '<li class=\'deleteButton actionButton liPageAdjust\' >'+
                        '<span class=\'deleteImg \'></span>'+
                        '<p class=\'actionText\'>Delete</p>'+
                    '</li>'+
               '</ul>' +
              '</div>';

        return str;
    },

    isUserTheOwner: function() {
        var currentUserName = Ozone.config.user && Ozone.config.user.displayName;
        var ownerName = this.clickedDashboard && this.clickedDashboard.stack && this.clickedDashboard.stack.owner && this.clickedDashboard.stack.owner.username;
        return ownerName === currentUserName;
    },

    hideButtons: function() {
        var me = this;
        var notOwner = !me.isUserTheOwner();

        if(notOwner) {
            me.appsWindow.hideButton('.deleteButton');
            me.appsWindow.hideButton('.editButton');
        }
    },

    initComponent: function() {
        var me = this;

        me.target = me.event.target.parentElement.id;
        me.html = me.getToolTip();

        me.callParent(arguments);
    },

    setupClickHandlers : function() {
        var me = this;

        $(me.getEl().dom)
            .on('click', '.editButton', $.proxy(me.editPage, me))
            .on('click', '.deleteButton', $.proxy(me.deletePage, me))
            .on('click', '.restoreButton', $.proxy(me.restorePage, me));

        $('#my-apps-window').click(function() {
	      	  //Hide the tip if outside click
	      	me.destroy()
	      });
    },

    onRender: function() {
        this.callParent(arguments);
    },

    editPage: function (evt) {
        evt.stopPropagation();

        var dashboard = this.clickedDashboard;

        var editDashWindow = Ext.widget('createdashboardwindow', {
            itemId: 'editDashWindow',
            title: null,
            height: 265,
            dashboardContainer: this.dashboardContainer,
            ownerCt: this.dashboardContainer,
            hideViewSelectRadio: true,
            closable: false,
            constrainHeader: false,
            existingDashboardRecord: dashboard.model
        }).show();

        this.close();
        this.appsWindow.close();
    },

    deletePage: function (evt) {
        evt.stopPropagation();

        var dashboard = this.clickedDashboard,
            dashboardStore = this.appsWindow.dashboardStore,
            me = this,
            msg;

        function focusEl () {
            evt.currentTarget.focus();
        }

        // Only allow the App owner to delete an App page
        if(!this.isUserTheOwner()) {
            me.warn('ok', null, 'Users cannot remove individual pages from an App. Please contact your administrator.');
            return;
        }

        // Only allow deleting a dashboard if its only group is a stack (and we applied the stack membership rule before)
        if(!dashboard.groups || dashboard.groups.length == 0 || (dashboard.groups.length == 1 && dashboard.groups[0].stackDefault)) {
            msg = 'Are you sure you want to delete this Page?';

            var deletePageHandler = function () {
                //remove from stack dashboard list so if only one page remains the stack will launch on single click
                var stack_dashboards = me.appsWindow.stacks[dashboard.stack.id].dashboards;
                stack_dashboards.splice($.inArray(stack_dashboards, dashboard), 1);
                if(stack_dashboards.length === 1) {
                    me.appsWindow.hideStackDashboards();
                }

                dashboardStore.remove(dashboard.model);
                dashboardStore.save();
                me.appsWindow.notify('Delete Page', '<span class="heading-bold">' + Ext.htmlEncode(dashboard.name) + '</span> deleted!');
                me.appsWindow._deletedStackOrDashboards.push(dashboard);
                var isActiveDashboard = (me.dashboardContainer.activeDashboard.guid === dashboard.model.get('guid'))
                if (isActiveDashboard) {
                    // If deleting the active dashboard, reload dashboards
                    me.appsWindow.reloadDashboards = true;
                }
                var $prev = me.$dashboard.prev();
                me.$dashboard.remove();
                $prev.focus();
            }

            me.warn('ok_cancel', deletePageHandler, msg);

        } else {
            this.warn('ok', null, 'Users cannot remove pages assigned to a group. Please contact your administrator.');
        }
    },

    restorePage: function (evt) {
        evt.stopPropagation();
        var me = this,
            $dashboard = this.$dashboard,
            dashboard = this.clickedDashboard,
            dashboardGuid = dashboard.guid;

        if (dashboard.publishedToStore) {
            var msg = 'Click OK to delete changes you made to this Page and restore its default settings.';

            var restorePageHandler = function () {
                Ext.Ajax.request({
                    url: Ozone.util.contextPath() + '/dashboard/restore',
                    params: {
                        guid: dashboardGuid,
                        isdefault: dashboardGuid == me.appsWindow.activeDashboard.guid
                    },
                    success: function(response, opts) {
                        var json = Ext.decode(response.responseText);
                        if (json != null && json.data != null && json.data.length > 0) {
                            me.appsWindow.notify('Restore Page', '<span class="heading-bold">' + Ext.htmlEncode(dashboard.name) + '</span> is restored successfully to its default state!');

                            var name = json.data[0].name,
                                description = json.data[0].description;

                            dashboard.model.set({
                                'name': name,
                                'description': description
                            });
                            dashboard.name = name;
                            dashboard.description = name;

                            me.appsWindow.updateDashboardEl($dashboard, dashboard);

                            me.appsWindow.reloadDashboards = true;
                        }
                    },
                    failure: function(response, opts) {
                        Ozone.Msg.alert('Page Manager', "Error restoring page.", function() {
                            Ext.defer(function() {
                                $dashboard[0].focus();
                            }, 200, me);
                        }, me, null, me.dashboardContainer.modalWindowManager);
                        return;
                    }
                });
            }

            me.warn('ok_cancel', restorePageHandler, msg);
        } else {
            msg = 'Application pages cannot be restored until the Application is pushed to store'
            me.warn('ok', null, msg);
        }

    },

    warn: function(buttons, button_handler, text) {
        var me = this;

        me.update('');
        me.removeAll();

        me.add(Ext.create('Ozone.components.window.TipWarning', {
            tip: me,
            buttonConfig: buttons,
            buttonHandler: button_handler,
            text: text
        }));

        me.width = 300;

        me.doLayout();
    }

});
