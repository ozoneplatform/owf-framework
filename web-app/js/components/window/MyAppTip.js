Ext.define('Ozone.components.window.MyAppTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.myapptip',
    clickedStackOrDashboard:null,
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
                this.bindHandlers();
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
    
    getToolTip: function () {
        var me = this;
    	var banner = me.dashboardContainer.getBanner();
        var icn = me.clickedStackOrDashboard.imageUrl && me.clickedStackOrDashboard.imageUrl !=' ' ? '<img height=\'64\' width=\'64\' style=\'margin-right:15px;\' src=\''+me.clickedStackOrDashboard.imageUrl+'\' />':'';
        var str = '<div class=\'dashboard-tooltip-content\'>' + 
                '<h3 class=\'name\'>' + icn + Ext.htmlEncode(Ext.htmlEncode(me.clickedStackOrDashboard.name)) + '</h3>';

        me.clickedStackOrDashboard.description && (str += '<p class=\'tip-description\'>' + Ext.htmlEncode(Ext.htmlEncode(me.clickedStackOrDashboard.description)) +'</p><br>');
        
        var pushBtn = '',
        	ulAdjustCls = 'ulStoreAdjust',
        	liAdjustCls = 'liStoreAdjust',
        	imgAdjustCls = 'imgStoreAdjust';
        	
        if (banner.hasMarketplaceButton)  {
        	ulStoreAdjustCls = '';
        	liAdjustCls = '';
        	imgAdjustCls = '';
        	pushBtn = '<li class=\'pushButton actionButton\'>'+
                        '<span class=\'pushImg\'></span>'+
                        '<p class=\'actionText\'>Push to Store</p>'+
                    '</li>';
        }
        
        // append buttons
        str += '<ul class=\''+ulAdjustCls+'\'>'+
                    '<li class=\'addButton actionButton '+liAdjustCls+'\' style=\'border-radius: 0 0 0 10px;\'>'+
                        '<span class=\'createPageImg  '+imgAdjustCls+'\'></span>'+
                        '<p class=\'actionText\'>Add Page</p>'+
                    '</li>'+
                    pushBtn+
                    '<li class=\'restoreButton actionButton '+liAdjustCls+'\'>'+
                        '<span class=\'restoreImg  '+imgAdjustCls+'\'></span>'+
                        '<p class=\'actionText\'>Restore</p>'+
                    '</li>'+
                    '<li class=\'editButton actionButton '+liAdjustCls+'\'>'+
                        '<span class=\'editImg  '+imgAdjustCls+'\'></span>'+
                        '<p class=\'actionText\'>Edit</p>'+
                    '</li>'+
                    '<li class=\'deleteButton actionButton '+liAdjustCls+'\' style=\'border-radius: 0 0 10px 0;\'>'+
                        '<span class=\'deleteImg '+imgAdjustCls+'\'></span>'+
                        '<p class=\'actionText\'>Delete</p>'+
                    '</li>'+
               '</ul>' +
              '</div>';
         
        return str;
    },

    bindHandlers: function() {
        var me = this;
        var $ = jQuery;

        if(me.clickedStackOrDashboard.isStack) {

            $('.addButton').on('click', $.proxy(me.addPageToApp, me));
            $('.restoreButton').on('click', $.proxy(me.handleStackRestore, me));
            $('.pushButton').on('click', $.proxy(me.handlePushToStore, me));
            $('.editButton').on('click', $.proxy(me.handleStackEdit, me));
            $('.deleteButton').on('click', $.proxy(me.handleStackDelete, me));
                /*function(evt) {
                me.handleStackDelete(evt, me);
            });*/
            
            
        }
    },

    addPageToApp: function (evt) {
        var stack = this.clickedStackOrDashboard;

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
    },

    handleStackRestore: function(evnt) {
        evnt.stopPropagation();
        var me = this;

        var stack = me.clickedStackOrDashboard;

        var msg = 'This action will return the stack <span class="heading-bold">' + Ext.htmlEncode(stack.name) + '</span> to its current default state. If an administrator changed any dashboard in the stack after it was assigned to you, the default state may differ from the one that originally appeared in your Switcher.'
        me.warn('ok_cancel', jQuery.proxy(me.restoreStack, me), msg);
    },

    restoreStack: function() {
        var me = this;

        var stack = this.clickedStackOrDashboard;

        Ext.Ajax.request({
            url: Ozone.util.contextPath() + '/stack/restore',
            params: {
                id: stack.id
            },
            success: function(response, opts) {
                var json = Ext.decode(response.responseText);
                
                if (json != null && json.updatedDashboards != null && json.updatedDashboards.length > 0) {
                    me.appsWindow.notify('Restore Stack', '<span class="heading-bold">' + Ext.htmlEncode(stack.name) + '</span> is restored successfully to its default state!');
                    
                    var dashboards = stack.dashboards;
                    for(var i = 0; i < dashboards.length; i++) {
                        for(var j = 0; j < json.updatedDashboards.length; j++) {
                            var dash = json.updatedDashboards[j];
                            if(dash.guid == dashboards[i].guid) {
                                dashboards[i].model.set({
                                    'name': dash.name,
                                    'description': dash.description
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

        console.log(me);

        me.update('');
        me.removeAll();

        me.add(Ext.create('Ozone.components.window.TipWarning', {
            tip: me,
            buttonConfig: buttons,
            buttonHandler: button_handler,
            text: text
        }));

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
            stack = me.clickedStackOrDashboard,
            banner = me.dashboardContainer.getBanner(),
            mpLauncher;


        if (!banner.hasMarketplaceButton)  {
            console.log ('Error', 'You do not have a Marketplace widget defined');
            return;
        }

        mpLauncher = banner.getMarketplaceLauncher();

        // Get the stack json

        Ozone.util.Transport.send({

            url : Ozone.util.contextPath()  + '/stack/share?id=' + stack.id,
            method : "POST",
            onSuccess: function (json){
                me.sendRequest(json, mpLauncher, banner.marketplaceWidget);
            },

            onFailure: function (errorMsg){
                var msg = 'The sharing of ' + ' ' + Ext.htmlEncode(record.get('name')) + ' failed.';
                console.log('Error', errorMsg ? errorMsg : msg);

            },
            autoSendVersion : false

        });

        me.close();
        me.appsWindow.close();
    },

    handleStackEdit: function(evnt) {

    },

    handleStackDelete: function (evt) {
        evt.stopPropagation();

        var me = this;

        var msg = 'This action will permanently delete stack <span class="heading-bold">' + 
                Ext.htmlEncode(me.clickedStackOrDashboard.name) + '</span> and its dashboards.';

        var stackGroups = me.clickedStackOrDashboard.groups
        var userGroups = Ozone.config.user.groups
        var groupAssignment = false;
        
        if(stackGroups && userGroups && stackGroups.length > 0 && userGroups.length > 0) {
            for (var i = 0, len1 = stackGroups.length; i < len1; i++) {
                var stackGroup = stackGroups[i];
                
                for (var j = 0, len2 = userGroups.length; j < len2; j++) {
                    var userGroup = userGroups[j];
                    if(stackGroup.id === userGroup.id) {
                        groupAssignment = true;
                        break;
                    }
                }

                if(groupAssignment === true)
                    break;
            }
        }

        if(groupAssignment) {
            msg = 'Users in a group cannot remove stacks assigned to the group. Please contact your administrator.'
            me.warn('ok', null, msg);
            return;
        }


        me.warn('ok_cancel', jQuery.proxy(me.removeStack, me), msg);
    },

    removeStack:function() {
        var me = this;

        console.log(me);

        me.dashboardContainer.stackStore.remove( me.dashboardContainer.stackStore.getById(me.clickedStackOrDashboard.id) );
        me.dashboardContainer.stackStore.save();
        
        if( me.appsWindow._lastExpandedStack === me.clickedStackOrDashboard) {
            me.hideStackDashboards();
        }

        var $target = jQuery(me.event.target.parentElement.parentElement);
        var $prev = $target.prev();
        $target.remove();
        //$prev.focus(); //for keyboard nav which is no longet supported.
        
        me.appsWindow._deletedStackOrDashboards.push(me.clickedStackOrDashboard);
        me.appsWindow.reloadDashboards = true;

        me.close();
    },

    /**
     * @param widget the Marketplace wiget to launch. If undefined, the marketplace
     * switcher will be shown, allowing the user to choose
     */
    sendRequest: function(json, mpLauncher, widget) {
        var me = this;

        mpLauncher.gotoMarketplace(widget);
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

                    console.log("success", "ID is " + id + ", New item created? " + 
                        result.data.isNew);
                    
                    //send only to this mp widget
                    Ozone.eventing.Container.publish('ozone.marketplace.show', id, 
                        Ozone.eventing.Container.getIframeId(instance.data.uniqueId)); 

                    //hide loading mask once the widget has refreshed
                    Ozone.eventing.Container.subscribe('ozone.marketplace.pageLoaded', 
                            function() {
                        me.dashboardContainer.loadMask.hide();
                        Ozone.eventing.Container.unsubscribe('ozone.marketplace.pageLoaded');
                    });
                },
                onFailure: function (errorMsg){
                     //var msg = 'The sharing of ' + 'shareItem' + ' ' + 
                        //Ext.htmlEncode(record.get('name')) + ' failed.';
                     console.log('Error', errorMsg /*? errorMsg : msg*/);

                     me.dashboardContainer.loadMask.hide();
                },
                autoSendVersion : false
            });
        }, {single: true}); 
    }

});
