Ext.define('Ozone.components.window.MyAppTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.myapptip',
    clickedStackOrDashboard:null,
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
    
    getToolTip: function () {
        var me = this;
    	var banner = me.dashboardContainer.getBanner();
        var icn = me.clickedStackOrDashboard.iconImageUrl && me.clickedStackOrDashboard.iconImageUrl !=' ' ? '<img height=\'64\' width=\'64\' style=\'padding-right:15px;\' src=\''+me.clickedStackOrDashboard.iconImageUrl+'\' />':'';
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
            .on('click', '.pushButton', $.proxy(me.pushToStore, me))
            .on('click', '.addButton', $.proxy(me.addPageToApp, me));
    },

    onRender: function() {
        this.callParent(arguments);
        this.setupClickHandlers();
    },

    onDestroy: function() {
        //clean up inner dom, including event handlers
        $(this.getEl().dom).empty();

        this.callParent(arguments);
    },

    pushToStore: function (evt) {
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
    }

});
