Ext.define('Ozone.components.window.MyAppTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.myapptip',
    clickedStack:null,
    event:null,
    cls: 'ozonequicktip itemTip',
    shadow: false,
    closable:true,
    autoHide:false,
    target: null,

    listeners: {
        'close': {
            fn: function(){
                this.destroy()
            }
        },
        'afterRender': {
            fn: function() {
                this.hideButtons();
                this.bindHandlers();
                $('.name').dotdotdot({
                    ellipsis: '…'
                });
            }
        }
    },

    dashboardContainer: null,
    appsWindow: null,

    initComponent: function() {
        var me = this;

        me.target = $(me.event.target.parentElement);
        me.html = me.getToolTip();

        me.callParent(arguments);
    },

    isUserTheOwner: function() {
        var currentUserName = Ozone.config.user && Ozone.config.user.displayName;
        var ownerName = this.clickedStack && this.clickedStack.owner && this.clickedStack.owner.username;
        return ownerName === currentUserName;
    },

    clickedStackIsFullscreen: function() {
        return this.clickedStack.dashboards.length == 1 && this.clickedStack.dashboards[0].type == 'fullscreen'
    },

    hideButtons: function() {
        var me = this;
        var notOwner = !me.isUserTheOwner();

        if(me.clickedStackIsFullscreen()) {
            // Fullscreen stacks (which are created by the store for web apps) can only be deleted
            me.hideButton('.addButton, .editButton, .pushButton, .restoreButton, .shareButton');
        }
        else if(notOwner) {
            me.hideButton('.addButton, .editButton, .pushButton, .shareButton');
        }
    },

    getToolTip: function () {
        var me = this,
            banner = me.dashboardContainer.getBanner(),
            hasMarketplace = banner.hasMarketplaceButton,
            icn = me.clickedStack.imageUrl && me.clickedStack.imageUrl != ' ' ?
                '<img class=\'tipIcon\'src=\'' + encodeURI(decodeURI(me.clickedStack.imageUrl)) + '\' />' :
                '<div class=\'tipIcon noIconGivenStack\'></div>',
            str = '<div class=\'dashboard-tooltip-content\'>' + icn +
                '<h3 class=\'name\' title="'+ Ext.htmlEncode(me.clickedStack.name) +'">' + Ext.htmlEncode(me.clickedStack.name) + '</h3>';

        me.clickedStack.description ? (str += '<div class=\'description\'><p class=\'tip-description\'>' + Ext.htmlEncode(me.clickedStack.description) +'</p></div>'):
                                                 (str += '<p class=\'tip-description\'>  </p>');

        var liAdjustCls = ' liStoreAdjust ';

        if (banner.hasMarketplaceButton)
            liAdjustCls = '';


        // append buttons
        str += '<ul class="buttonBar">'+
                    '<li class="addButton actionButton '+liAdjustCls+'">'+
                        '<span class="createPageImg"></span>'+
                        '<p class="actionText">Add Page</p>'+
                    '</li>'+
                    '<li class="pushButton actionButton ' + (!hasMarketplace ? "hide" : "") +liAdjustCls+ '" data-qtip="">'+
                        '<span class="pushImg"></span>'+
                        '<p class="actionText">Push to Store</p>'+
                    '</li>'+
                    '<li class="shareButton actionButton ' + (hasMarketplace ? "hide" : "") +liAdjustCls+ '" data-qtip="">'+
                        '<span class="pushImg"></span>'+
                        '<p class="actionText">Share</p>'+
                    '</li>'+
                    '<li class="restoreButton actionButton '+liAdjustCls+'">'+
                        '<span class="restoreImg"></span>'+
                        '<p class="actionText">Restore</p>'+
                    '</li>'+
                    '<li class="editButton actionButton '+liAdjustCls+'">'+
                        '<span class="editImg"></span>'+
                        '<p class="actionText">Edit</p>'+
                    '</li>'+
                    '<li class="deleteButton actionButton '+liAdjustCls+'">'+
                        '<span class="deleteImg"></span>'+
                        '<p class="actionText">Delete</p>'+
                    '</li>'+
               '</ul>' +
              '</div>';

        return str;
    },

    bindHandlers: function() {
        var me = this;

        if(me.clickedStack.isStack) {

            $('.addButton').on('click', $.proxy(me.addPageToApp, me));
            $('.restoreButton').on('click', $.proxy(me.handleStackRestore, me));
            $('.pushButton').on('click', $.proxy(me.handlePushToStore, me));
            $('.shareButton').on('click', $.proxy(me.handleShareButton, me));
            $('.editButton').on('click', $.proxy(me.handleStackEdit, me));
            $('.deleteButton').on('click', $.proxy(me.handleStackDelete, me));
                /*function(evt) {
                me.handleStackDelete(evt, me);
            });*/


        }

        $('#my-apps-window').click(function() {
              //Hide the tip if outside click
            me.destroy()
        });
    },

    hideButton: function(className) {
        $(className).hide();
    },

    showButton: function(className) {
        $(className).show();
    },

    addPageToApp: function (evt) {
        var stack = this.clickedStack;

        var createDashWindow = Ext.widget('createdashboardwindow', {
            stackId: stack.id,
            title: Ozone.ux.DashboardMgmtString.createNewPageTitle,
            headerText: Ozone.ux.DashboardMgmtString.createNewPageHeader,
            itemId: 'createDashWindow',
            dashboardContainer: this.dashboardContainer,
            ownerCt: this.dashboardContainer
        });

        createDashWindow.show();
        this.close();
        this.appsWindow.close();
    },

    handleStackRestore: function(evnt) {
        evnt.stopPropagation();
        var me = this;

        // Check whether the App has been pushed to store
        var stack = me.clickedStack;

        var msg;
        if (me.appWasPublishedToStore(stack)) {
            msg = 'Click OK to delete changes you made to <span class="heading-bold">' + Ext.htmlEncode(stack.name) + '</span> and restore its default settings.'
            me.warn('ok_cancel', $.proxy(me.restoreStack, me), msg);
        } else {
            msg = 'Application pages cannot be restored until the Application is pushed to store'
            me.warn('ok', null, msg);
        }
    },

    appWasPublishedToStore: function(stack) {
        return Boolean(_.find(stack.dashboards, { 'publishedToStore': true }));
    },

    restoreStack: function() {
        var me = this;

        var stack = this.clickedStack;

        Ext.Ajax.request({
            url: Ozone.util.contextPath() + '/stack/restore',
            params: {
                id: stack.id
            },
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);

                if (json != null && json.updatedDashboards != null && json.updatedDashboards.length > 0) {
                    me.appsWindow.notify('Restore App', '<span class="heading-bold">' + Ext.htmlEncode(stack.name) + '</span> is restored successfully to its default state!');

                    var dashboards = stack.dashboards;
                    for(var i = 0; i < dashboards.length; i++) {
                        for(var j = 0; j < json.updatedDashboards.length; j++) {
                            var dash = json.updatedDashboards[j];
                            if(dash.guid == dashboards[i].guid) {
                                dashboards[i].model.set({
                                    'name': dash.name,
                                    'description': dash.description,
                                    'layoutConfig': dash.layoutConfig,
                                    'iconImageUrl': dash.iconImageUrl
                                });
                                dashboards[i].name = dash.name;
                                dashboards[i].description = dash.description;
                            }
                        }
                    }

                    me.appsWindow.updateStackDashboardsEl(stack);
                    me.appsWindow.reloadDashboards = true;
                    //$stack.focus();
                }
            },
            failure: function(response, opts) {
                Ozone.Msg.alert('Dashboard Manager', "Error restoring stack.", function() {
                    Ext.defer(function() {
                        $stack[0].focus();
                    }, 200, me);
                }, me, null, me.dashboardContainer.modalWindowManager);
                return;
            }
        });
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
    },

    onDestroy: function() {
        //clean up inner dom, including event handlers
        $(this.getEl().dom).empty();

        this.callParent(arguments);
    },

    _syncApp: function (stack, onSuccess, onFailure) {
        Ozone.util.Transport.send({
            url : Ozone.util.contextPath()  + '/stack/share?id=' + stack.id,
            method : "POST",
            onSuccess: onSuccess,
            onFailure: onFailure,
            autoSendVersion : false,
            handleAs: 'text'
        });
    },

    handlePushToStore: function (evt) {
        evt.stopPropagation();
        var me = this,
            stack = me.clickedStack,
            banner = me.dashboardContainer.getBanner(),
            mpLauncher;


        if (!banner.hasMarketplaceButton)  {
            console.log ('Error', 'You do not have a Marketplace widget defined');
            return;
        }

        Ext.Msg.show({
            title: 'Push App to Store',
            msg: 'You are pushing this App to a Store. If you have access to more than one Store, you will ' +
                'be prompted to choose. To continue, click OK. Otherwise, click Cancel.',
            buttons: Ext.Msg.OKCANCEL,
            closable: false,
            modal: true,
            fn: function(btn) {
                if (btn == 'ok') {
                    mpLauncher = banner.getMarketplaceLauncher();

                    // Get the stack json
                    me._syncApp(stack, function (json) {
                        me.sendRequest(json, mpLauncher, banner.marketplaceWidget, stack);
                    }, function (errorMsg) {
                        // Display error message
                        Ext.Msg.show({
                            title: 'Error',
                            msg: errorMsg,
                            buttons: Ext.Msg.OK,
                            closable: false,
                            modal: true
                        });
                    });
                }
            }
        });

        me.close();
        me.appsWindow.close();
    },

    handleShareButton: function (evt) {
        evt.stopPropagation();
        var me = this,
            stack = me.clickedStack,
            msg = 'You are allowing this App to be shared with other users. To continue, click OK. Otherwise, click Cancel.';

        me.warn('ok_cancel', function (btn) {
            me._syncApp(stack, function () {
                me.appsWindow.notify(
                    'Share App',
                    '<span class="heading-bold">' + Ext.htmlEncode(stack.name) + '</span> App can be shared with other users.'
                );
            }, function (errorMsg) {
                // Display error message
                Ext.Msg.show({
                    title: 'Error',
                    msg: errorMsg,
                    buttons: Ext.Msg.OK,
                    closable: false,
                    modal: true
                });
            });
        }, msg);
        return;
    },

    isAttributeSet: function(attr) {
        return !(attr == null ||
                 attr == undefined ||
                 Ext.isEmpty(Ext.String.trim(attr)));
    },

    handleStackEdit: function(event) {
        event.stopPropagation();

        var stack = this.clickedStack;
        var dashboardCount = stack.dashboards.length;
        var dashboardModel = (dashboardCount === 1) ? stack.dashboards[0].model : null;

        var editDashWindow = Ext.widget('createdashboardwindow', {
            itemId: 'editDashWindow',
            title: null,
            height: 265,
            dashboardContainer: this.dashboardContainer,
            ownerCt: this.dashboardContainer,
            hideViewSelectRadio: true,
            closable: false,
            constrainHeader: false,
            existingDashboardRecord: dashboardModel,
            existingStackRecord: stack
        }).show();

        this.close();
        this.appsWindow.close();
    },


    handleStackDelete: function (evt) {
        evt.stopPropagation();

        var me = this;
        var msg;

        var stack = me.clickedStack;
        var stackGroups;
        var userGroups = Ozone.config.user.groups;

        // Request the list of stack's groups from the server, since the client list may be out-of-date
        Ext.Ajax.request({
            url: Ozone.util.contextPath() + '/stack/listGroups',
            method: 'GET',
            params: {
                id: stack.id
            },
            callback: function(options, success, response) {
                stackGroups = success ? Ext.decode(response.responseText) : [];

                var groupAssignment
                // Find out whether stack belongs to one of the user's groups (including OWF Users and OFW Administrators)
                if (_.find(stackGroups, function(stackGroup) { return _.find(userGroups, {'id' : stackGroup.id})})) {
                    groupAssignment = true;
                } else {
                    // A hack to verify whether the stack is in one of the user's implicit groups
                    groupAssignment = Boolean(_.find(stackGroups, { 'displayName': 'OWF Users' }) ||
                        (Ozone.config.user.isAdmin && _.find(stackGroups, { 'displayName': 'OWF Administrators' })));
                }

                if(groupAssignment) {
                    msg = 'Group members cannot delete applications assigned to the group. Please contact your administrator.';
                    me.warn('ok', null, msg);
                } else {
                    msg = 'This action will permanently delete <span class="heading-bold">' +
                        Ext.htmlEncode(me.clickedStack.name) + '</span>.';
                    me.warn('ok_cancel', $.proxy(me.removeStack, me), msg);
                }
            }
        });
    },

    removeStack:function() {
        var me = this;

        me.dashboardContainer.stackStore.remove( me.dashboardContainer.stackStore.getById(me.clickedStack.id) );
        me.dashboardContainer.stackStore.save();
        me.appsWindow.removeStackOrDashboard(me.clickedStack);

        if( me.appsWindow._lastExpandedStack === me.clickedStack) {
            me.appsWindow.hideStackDashboards();
        }

        me.appsWindow._deletedStackOrDashboards.push(me.clickedStack);
        me.appsWindow.reloadDashboards = true;

        me.close();

        me.removeOrphanFullscreenDashboards(me.clickedStack);
    },

    /**
     * @param widget the Marketplace wiget to launch. If undefined, the marketplace
     * switcher will be shown, allowing the user to choose
     */
    sendRequest: function(json, mpLauncher, widget, stack) {
        var me = this;


        mpLauncher.on(OWF.Events.Marketplace.OPENED, function(instance, mpUrl) {
            var urlString = mpUrl.replace(/\/$/, "") + '/listing';

            me.dashboardContainer.loadMask.show();

            Ozone.util.Transport.send({
                url : urlString,
                method : "POST",
                content: {
                    data: json
                },

                onSuccess: function(result) {
                    var id = result.data && result.data.id;

                    function displayCompletion() {
                        // Display completion message
                        Ext.Msg.show({
                            title: 'Push to Store Complete',
                            msg: typeof result.data === 'string' ? result.data : result.data.msg,
                            buttons: Ext.Msg.OK,
                            closable: false,
                            modal: true
                        });

                        me.dashboardContainer.loadMask.hide();
                    }


                    if (id != null) {
                        //send only to this mp widget
                        Ozone.eventing.Container.publish('ozone.marketplace.show', id,
                            Ozone.eventing.Container.getIframeId(instance.data.uniqueId));

                        //hide loading mask once the widget has refreshed
                        Ozone.eventing.Container.subscribe('ozone.marketplace.pageLoaded',
                                function() {
                            Ozone.eventing.Container.unsubscribe('ozone.marketplace.pageLoaded');

                            Ext.Ajax.request({
                                url: Ozone.util.contextPath() + '/stack/' + stack.id,
                                method: 'POST'
                            });

                            // mark dashboards as published to store
                            _.forEach(stack.dashboards, function(dashboard) {
                                var store = me.dashboardContainer.dashboardStore;
                                var dashboardFromStore = store.getAt(store.find('guid', dashboard.guid));
                                dashboardFromStore.set('publishedToStore', true);
                            });

                            displayCompletion();
                        });
                    }
                    else {
                        displayCompletion();
                    }
                },

                onFailure: function (errorMsg){
                    // Display error message
                    Ext.Msg.show({
                        title: 'Error',
                        msg: errorMsg,
                        buttons: Ext.Msg.OK,
                        closable: false,
                        modal: true
                    });

                     me.dashboardContainer.loadMask.hide();

                },
                autoSendVersion : false
            });

        }, this, {single: true});
        mpLauncher.gotoMarketplace(widget);
    },

    /**
     * Deletes "fullscreen" dashboards and App Components from client state.
     * Said App Components are only added from Marketplace when a user runs
     * a web-app in OWF that is NOT OZONE-aware. And "fullscreen" App
     * Components are never shown in the App Components picker. (Only those
     * with "standard" type are shown.)
     * @param removedStack Model of stack that has already been removed from
     *        the stackStore.
     */
    removeOrphanFullscreenDashboards: function(removedStack) {
        var me = this;
        var orphanAppComponents = [];
        var orphanDashboardGuids = [];

        for (var i = 0; i < removedStack.dashboards.length; i++) {
            var dash = removedStack.dashboards[i];

            if (dash.type === 'fullscreen' && dash.layoutConfig.widgets) {
                orphanDashboardGuids.push(dash.guid);

                for (var j = 0; j < dash.layoutConfig.widgets.length; j++) {
                    var widget = dash.layoutConfig.widgets[j];
                    var isOrphan = true;

                    // Determine if widget is used on another dashboard
                    me.dashboardContainer.stackStore.each(function(stack) {
                        if (isOrphan && stack.data.dashboards) {
                            for (var k = 0; k < stack.data.dashboards.length && isOrphan; k++) {
                                var otherDash = stack.data.dashboards[k];

                                // Search is simplified since fullscreen
                                // components will only be on fullscreen
                                // dashboards
                                if (otherDash.data.type === 'fullscreen' &&
                                    otherDash.data.layoutConfig.widgets) {
                                    var widgetsList = otherDash.data.layoutConfig.widgets;

                                    for (var l = 0; l < widgetsList.length; l++) {
                                        if (widget.widgetGuid === widgetsList[l].widgetGuid) {
                                            isOrphan = false;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });

                    if (isOrphan) {
                        orphanAppComponents.push(widget);
                    }
                }
            }
        }

        me.dashboardContainer.deleteDashboards(orphanDashboardGuids, false);

        for (var j = 0; j < orphanAppComponents.length; j++) {
            var removeItem = OWF.Collections.AppComponents.findWhere({widgetGuid: orphanAppComponents[j].widgetGuid});

            if (removeItem) {
                var widgetType = removeItem.get('widgetTypes')[0];

                if (widgetType.name === 'fullscreen') {
                    OWF.Collections.AppComponents.remove(removeItem);
                }
            }
        }
    }

});
