Ext.define('Ozone.components.window.MyAppTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.myapptip',
    clickedStackOrDashboard:null,
    event:null,
    cls: 'ozonequicktip itemTip',
    shadow: false,
    closable:true,
    autoHide:false,
    draggable:true,
    listeners: {
    	'close': {
    		fn: function(){
    			this.destroy()
    		}
    	},
    	'afterRender': {
    		fn: function() {
    			this.bindHandlers()
    		}
    	}
    },

    dashboardContainer: null,
    appsWindow: null,

    initComponent: function() {
        var me = this;
        
        me.target = me.event.target.parentElement.id;
        me.html = me.getToolTip();

        me.setupClickHandlers();
        
        me.callParent(arguments);
    },
    
    getToolTip: function () {
        var me = this;
        var icn = me.clickedStackOrDashboard.iconImageUrl && me.clickedStackOrDashboard.iconImageUrl !=' ' ? '<img height=\'64\' width=\'64\' style=\'padding-right:15px;\' src=\''+me.clickedStackOrDashboard.iconImageUrl+'\' />':'';
        var str = '<div class=\'dashboard-tooltip-content\'>' + 
                '<h3 class=\'name\'>' + icn + Ext.htmlEncode(Ext.htmlEncode(me.clickedStackOrDashboard.name)) + '</h3>';

        me.clickedStackOrDashboard.description && (str += '<p class=\'tip-description\'>' + Ext.htmlEncode(Ext.htmlEncode(me.clickedStackOrDashboard.description)) +'</p><br>');
        
        // append buttons
        str += '<ul>' +
                    '<li class=\'addButton actionButton\'>'+
                        '<span class=\'createImg\'></span>'+
                        '<p class=\'actionText\'>Add Page</p>'+
                    '</li>'+
                    '<li class=\'pushButton actionButton\'>'+
                        '<span class=\'pushImg\'></span>'+
                        '<p class=\'actionText\'>Push to Store</p>'+
                    '</li>'+
                    '<li class=\'restoreButton actionButton\'>'+
                        '<span class=\'restoreImg\'></span>'+
                        '<p class=\'actionText\'>Restore</p>'+
                    '</li>'+
                    '<li class=\'editButton actionButton\'>'+
                        '<span class=\'editImg\'></span>'+
                        '<p class=\'actionText\'>Edit</p>'+
                    '</li>'+
                    '<li class=\'deleteButton actionButton\'>'+
                        '<span class=\'deleteImg\'></span>'+
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
            $('.restoreButton').on('click', me.handleStackRestore);
            $('.pushButton').ON('click', $.proxy(me.handlePushToStore, me));
            $('.editButton').on('click', me.handleStackEdit);
            $('.deleteButton').on('click', $.proxt(me.handleStackDelete, me);
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
                me.sendRequest(json, mpLauncher);
                //if (banner.marketplaceWidget) {

                    //me.sendRequest(banner.marketplaceWidget.data.url, json, mpLauncher, banner.marketplaceWidget);

                //} else {

                    //var chooser = Ext.widget('marketplacewindow', {
                        //dashboardContainer: me.dashboardContainer,
                        //callback: function(marketplaceWidget) {
                            //me.sendRequest(marketplaceWidget.data.url, json, mpLauncher, marketplaceWidget);
                        //}
                    //});

                    //chooser.show();
                //}
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

    handleStackDelete: function (evt, parent) {
        evt.stopPropagation();

        var me = parent;

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
            me.update('');
            me.removeAll();

            me.add({
                xtype: 'panel',
                html: 'Users in a group cannot remove stacks assigned to the group. Please contact your administrator.',
                bbar: ['->', {
                    text: 'OK',
                    handler: function() {
                        me.close();
                        me.destroy();
                    }
                }]
            });

            me.doLayout();

            return;
        }


        me.update('');
        me.removeAll();

        me.add({
            xtype: 'panel',
            html: msg,
            bbar: ['->', {
                text: 'OK',
                handler: function() {
                    console.log(me.dashboardContainer.stackStore);
                    me.dashboardContainer.stackStore.remove( me.dashboardContainer.stackStore.getById(me.clickedStackOrDashboard.id) );
                    me.dashboardContainer.stackStore.save();
                    console.log(me.dashboardContainer.stackStore);

                    if( me.appsWindow._lastExpandedStack === me.clickedStackOrDashboard) {
                        me.hideStackDashboards();
                    }

                    var $prev = me.target;
                    me.target.remove();
                    $prev.focus();
                    
                    me.appsWindow._deletedStackOrDashboards.push(me.clickedStackOrDashboard);
                    me.reloadDashboards = true;
                }
            },{
                text: 'Cancel',
                handler: function() {
                    me.close();
                    me.destroy();
                }
            }]
        });
    },

    sendRequest: function(json, mpLauncher) {
        var me = this;

        mpLauncher.gotoMarketplace();
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
