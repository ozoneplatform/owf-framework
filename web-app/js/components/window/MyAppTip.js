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
                jQuery('.name').dotdotdot();
    		}
    	}
    },

    dashboardContainer: null,
    appsWindow: null,

    initComponent: function() {
        var me = this;
        
        me.target = jQuery(me.event.target.parentElement);
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
            me.hideButton('.addButton');
            me.hideButton('.editButton');
            me.hideButton('.pushButton');
            me.hideButton('.restoreButton')
        }
        else if(notOwner) {
            me.hideButton('.addButton');
            me.hideButton('.editButton');
            me.hideButton('.pushButton');
        }
    },

    getToolTip: function () {
        var me = this,
            banner = me.dashboardContainer.getBanner(),
            icn = me.clickedStack.imageUrl && me.clickedStack.imageUrl != ' ' ? 
                '<img class=\'tipIcon\'src=\'' + encodeURI(decodeURI(me.clickedStack.imageUrl)) + 
                '\' />' : '<div class=\'tipIcon noIconGivenStack\'></div>',
            str = '<div class=\'dashboard-tooltip-content\'>' + icn +
                '<h3 class=\'name\' data-qtip="'+ Ext.htmlEncode(me.clickedStack.name) +'">' + Ext.htmlEncode(me.clickedStack.name) + '</h3>';

        me.clickedStack.description ? (str += '<div class=\'description\'><p class=\'tip-description\'>' + Ext.htmlEncode(me.clickedStack.description) +'</p></div>'):
        										 (str += '<p class=\'tip-description\'>  </p>');
        
        var liAdjustCls = 'liStoreAdjust';
        	
        if (banner.hasMarketplaceButton)
        	liAdjustCls = '';

        
        // append buttons
        str += '<ul class=\'buttonBar\'>'+
                    '<li class=\'addButton actionButton '+liAdjustCls+'\'>'+
                        '<span class=\'createPageImg  \'></span>'+
                        '<p class=\'actionText\'>Add Page</p>'+
                    '</li>'+
                    '<li class=\'pushButton actionButton\' data-qtip="">'+
                    	'<span class=\'pushImg\'></span>'+
                    	'<p class=\'actionText\'>Push to Store</p>'+
                    '</li>'+
                    '<li class=\'restoreButton actionButton '+liAdjustCls+'\'>'+
                        '<span class=\'restoreImg  \'></span>'+
                        '<p class=\'actionText\'>Restore</p>'+
                    '</li>'+
                    '<li class=\'editButton actionButton '+liAdjustCls+'\'>'+
                        '<span class=\'editImg \'></span>'+
                        '<p class=\'actionText\'>Edit</p>'+
                    '</li>'+
                    '<li class=\'deleteButton actionButton '+liAdjustCls+'\'>'+
                        '<span class=\'deleteImg \'></span>'+
                        '<p class=\'actionText\'>Delete</p>'+
                    '</li>'+
               '</ul>' +
              '</div>';
         
        return str;
    },

    bindHandlers: function() {
        var me = this;
        var $ = jQuery;
    	var banner = me.dashboardContainer.getBanner();

        if (!banner.hasMarketplaceButton)
        	me.hideButton('.pushButton');
        
        if(me.clickedStack.isStack) {

            $('.addButton').on('click', $.proxy(me.addPageToApp, me));
            $('.restoreButton').on('click', $.proxy(me.handleStackRestore, me));
            $('.pushButton').on('click', $.proxy(me.handlePushToStore, me));
            $('.editButton').on('click', $.proxy(me.handleStackEdit, me));
            $('.deleteButton').on('click', $.proxy(me.handleStackDelete, me));
                /*function(evt) {
                me.handleStackDelete(evt, me);
            });*/
            
            
        }
        
        $('#dashboard-switcher').click(function() {
        	  //Hide the tip if outside click 
        	me.destroy()
        });
    },
    
    hideButton: function(className) {
    	var $ = jQuery;
    	
    	$(className).hide();
    },
    
    showButton: function(className) {
    	var $ = jQuery; 
    	
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

        var stack = me.clickedStack;

        var msg = 'Click OK to delete changes you made to <span class="heading-bold">' + Ext.htmlEncode(stack.name) + '</span> and restore its default settings.'
        me.warn('ok_cancel', jQuery.proxy(me.restoreStack, me), msg);
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
                    me.reloadDashboards = true;
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

                    Ozone.util.Transport.send({

                        url : Ozone.util.contextPath()  + '/stack/share?id=' + stack.id,
                        method : "POST",
                        onSuccess: function (json){
                            me.sendRequest(json, mpLauncher, banner.marketplaceWidget, stack);
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
                        },
                        autoSendVersion : false,
                        handleAs: 'text'

                    });

                }
            }
        });

      me.close();
        me.appsWindow.close();
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

        var msg = 'This action will permanently delete <span class="heading-bold">' + 
                Ext.htmlEncode(me.clickedStack.name) + '</span>.';

        var groupAssignment = me.isStackAGroupAssignment(me.clickedStack);

        if(groupAssignment) {
            msg = 'Users in a group cannot remove stacks assigned to the group. Please contact your administrator.'
            me.warn('ok', null, msg);
            return;
        }


        me.warn('ok_cancel', jQuery.proxy(me.removeStack, me), msg);
    },

    removeStack:function() {
        var me = this;

        me.dashboardContainer.stackStore.remove( me.dashboardContainer.stackStore.getById(me.clickedStack.id) );
        me.dashboardContainer.stackStore.save();
        
        if( me.appsWindow._lastExpandedStack === me.clickedStack) {
            me.appsWindow.hideStackDashboards();
        }

        var $target = jQuery(me.event.target.parentElement.parentElement);
        var $prev = $target.prev();
        $target.remove();
        //$prev.focus(); //for keyboard nav which is no longet supported.
        
        me.appsWindow._deletedStackOrDashboards.push(me.clickedStack);
        me.appsWindow.reloadDashboards = true;

        me.close();
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
                    data: json,
                    windowname: true
                },

                onSuccess: function(result) {
                    var id = result.data && result.data.id;


                    //send only to this mp widget
                    Ozone.eventing.Container.publish('ozone.marketplace.show', id, 
                        Ozone.eventing.Container.getIframeId(instance.data.uniqueId)); 

                    //hide loading mask once the widget has refreshed
                    Ozone.eventing.Container.subscribe('ozone.marketplace.pageLoaded', 
                            function() {
                        me.dashboardContainer.loadMask.hide();
                        Ozone.eventing.Container.unsubscribe('ozone.marketplace.pageLoaded');

                        Ext.Ajax.request({
                            url: Ozone.util.contextPath() + '/stack/' + stack.id,
                            method: 'POST'
                        });

                        // Display completion message
                        Ext.Msg.show({
                            title: 'Push to Store Complete',
                            msg: result.data.msg,
                            buttons: Ext.Msg.OK,
                            closable: false,
                            modal: true
                        });

                    });
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
     * Returns true if the stack and the current user belong to the same group.
     * @param stack
     * @returns {*}
     */
    isStackAGroupAssignment: function(stack) {
        var stackGroups = stack.groups
        var userGroups = Ozone.config.user.groups

        if (_.intersection(stackGroups, userGroups).length > 0) {
            return true;
        } else {
            // A hack to verify whether the stack is in one of the user's implicit groups
            return Boolean(_.find(stackGroups, { 'displayName': 'OWF Users' }) ||
                (Ozone.config.user.isAdmin && _.find(stackGroups, { 'displayName': 'OWF Administrators' })));
        }

    }

});
