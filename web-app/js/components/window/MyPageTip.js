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
        'close':function(){
            this.destroy();
        }
    },

    dashboardContainer: null,
    appsWindow: null,
    $dashboard: null,
    
    getToolTip: function () {
        var me = this;
        var icn = me.clickedDashboard.iconImageUrl && me.clickedDashboard.iconImageUrl !=' ' ? '<img class=\'tipIcon\' src=\''+me.clickedDashboard.iconImageUrl+'\' />':
        						   															   '<div class=\'tipIcon noIconGivenPage\'></div>';
        var str = '<div class=\'dashboard-tooltip-content\'>' + icn + 
                '<h3 class=\'name\'>'+ Ext.htmlEncode(Ext.htmlEncode(me.clickedDashboard.name)) + '</h3>';

        me.clickedDashboard.description ? (str += '<div class=\'description\'><p class=\'tip-description\'>' + Ext.htmlEncode(Ext.htmlEncode(me.clickedDashboard.description)) +'  </p></div>') :
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
    
    initComponent: function() {
        var me = this;
        
        me.target = me.event.target.parentElement.id;
        me.html = me.getToolTip();

        me.callParent(arguments);
    },

    setupClickHandlers : function() {
        var me = this,
            $ = jQuery;

        $(me.getEl().dom)
            .on('click', '.editButton', $.proxy(me.editPage, me))
            .on('click', '.deleteButton', $.proxy(me.deletePage, me))
            .on('click', '.restoreButton', $.proxy(me.restorePage, me));
        
        $('#dashboard-switcher').click(function() {
	      	  //Hide the tip if outside click 
	      	this.destroy()
	      });
    },

    onRender: function() {
        this.callParent(arguments);
        this.setupClickHandlers();
    },

    hideButton: function(className) {
    	var $ = jQuery;
    	
    	$(className).hide();
    },
    
    showButton: function(className) {
    	var $ = jQuery; 
    	
    	$(className).show();
    },

    editPage: function (evt) {
        evt.stopPropagation();

        var dashboard = this.clickedDashboard;

        var editDashWindow = Ext.widget('createdashboardwindow', {
            itemId: 'editDashWindow',
            title: 'Edit Page',
            height: 300,
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
        if(dashboard.stack && Ozone.config.user.displayName !== dashboard.stack.owner.username) {
            this.appsWindow.warn('Users cannot remove individual pages from an App. Please contact your administrator.', focusEl);
            return;
        }

        // Only allow deleting a dashboard if its only group is a stack (and we applied the stack membership rule before)
        if(!dashboard.groups || dashboard.groups.length == 0 || (dashboard.groups.length == 1 && dashboard.groups[0].stackDefault)) {
            msg = 'Are you sure you want to delete this Page?';

            var deletePageHandler = function () {
                dashboardStore.remove(dashboard.model);
                dashboardStore.save();
                me.appsWindow.notify('Delete Page', '<span class="heading-bold">' + Ext.htmlEncode(dashboard.name) + '</span> deleted!');
                me.appsWindow.reloadDashboards = true;
                var $prev = me.$dashboard.prev();
                me.$dashboard.remove();
                $prev.focus();
            }

            me.warn('ok_cancel', deletePageHandler, msg);

        } else {
            this.appsWindow.warn('Users cannot remove pages assigned to a group. Please contact your administrator.', focusEl);
        }
    },

    restorePage: function (evt) {
        evt.stopPropagation();
        var me = this,
            $dashboard = this.$dashboard,
            dashboard = this.clickedDashboard,
            dashboardGuid = dashboard.guid;

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

        me.doLayout();
    }

});
