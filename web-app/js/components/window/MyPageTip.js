Ext.define('Ozone.components.window.MyPageTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.mypagetip',
    clickedStackOrDashboard: null,
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
        var icn = me.clickedStackOrDashboard.iconImageUrl && me.clickedStackOrDashboard.iconImageUrl !=' ' ? '<img height=\'64\' width=\'64\' style=\'padding-right:15px;\' src=\''+me.clickedStackOrDashboard.iconImageUrl+'\' />':'';
        var str = '<div class=\'dashboard-tooltip-content\'>' + 
                '<h3 class=\'name\'>' + icn + Ext.htmlEncode(Ext.htmlEncode(me.clickedStackOrDashboard.name)) + '</h3>';

        me.clickedStackOrDashboard.description && (str += '<p class=\'tip-description\'>' + Ext.htmlEncode(Ext.htmlEncode(me.clickedStackOrDashboard.description)) +'</p><br>');
        
        // append buttons
        str += '<ul style=\'padding-bottom:2%;\'>' +
                    '<li class=\'restoreButton actionButton liPageAdjust\'>'+
                        '<span class=\'restoreImg imgPageAdjust\' ></span>'+
                        '<p class=\'actionText\'>Restore</p>'+
                    '</li>'+
                    '<li class=\'editButton actionButton liPageAdjust\'>'+
                        '<span class=\'editImg imgPageAdjust\'></span>'+
                        '<p class=\'actionText\'>Edit</p>'+
                    '</li>'+
                    '<li class=\'deleteButton actionButton liPageAdjust\'>'+
                        '<span class=\'deleteImg imgPageAdjust\'></span>'+
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

        me.setupClickHandlers();
        
        me.callParent(arguments);
    },

    setupClickHandlers : function() {

        var me = this,
            $ = jQuery;

        $(document).on('click', '.editButton', $.proxy(me.editPage, me));
        $(document).on('click', '.deleteButton', $.proxy(me.deletePage, me));
    },

    editPage: function (evt) {
        evt.stopPropagation();

        var dashboard = this.clickedStackOrDashboard;

        var editDashWindow = Ext.widget('createdashboardwindow', {
            itemId: 'editDashWindow',
            title: 'Edit Dashboard',
            height: 250,
            dashboardContainer: this.dashboardContainer,
            ownerCt: this.dashboardContainer,
            hideViewSelectRadio: true,
            existingDashboardRecord: dashboard.model
        }).show();

        this.close();
    },

    deletePage: function (evt) {
        evt.stopPropagation();

        var dashboard = this.clickedStackOrDashboard,
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
            msg = 'This action will permanently delete <span class="heading-bold">' + Ext.htmlEncode(dashboard.name) + '</span>.';

            this.appsWindow.warn(msg, function () {
                dashboardStore.remove(dashboard.model);
                dashboardStore.save();
                me.appsWindow.notify('Delete Dashboard', '<span class="heading-bold">' + Ext.htmlEncode(dashboard.name) + '</span> deleted!');
                var $prev = me.$dashboard.prev();
                me.$dashboard.remove();
                $prev.focus();

            }, focusEl);
        } else {
            this.appsWindow.warn('Users cannot remove dashboards assigned to a group. Please contact your administrator.', focusEl);
        }
        this.close();
    }


});
