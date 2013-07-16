Ext.define('Ozone.components.window.MyAppTip', {
    extend: 'Ext.tip.ToolTip',
    alias: 'widget.myapptip',
    
    cls: 'ozonequicktip itemTip',
	shadow: false,
	closable:true,
	autoHide:false,
	draggable:true,
    listeners: {
    	'close':function(){
    		this.destroy()
    	}
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
         
        return str
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
        // Push to store handler
        $('.pushButton').on('click', me.pushToStore);

    },

    pushToStore: function (evt) {
        evt.stopPropagation();
        var me = this,
            $stack = this.getElByClassFromEvent(evt, 'stack'),
            stack = this.getStack($stack),
            dashboardContainer = me.activeDashboard.dashboardContainer,
            banner = dashboardContainer.getBanner(),
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
            onSuccess: Ext.bind(function (json){

                if (banner.marketplaceWidget) {

                    me.sendRequest(banner.marketplaceWidget.data.url, json, mpLauncher, banner.marketplaceWidget);

                } else {

                    var chooser = Ext.widget('marketplacewindow', {
                        dashboardContainer: dashboardContainer,
                        callback: function(marketplaceWidget) {
                            me.sendRequest(marketplaceWidget.data.url, json, mpLauncher, marketplaceWidget);
                        }
                    });

                    chooser.show();
                }
            }, me) ,

            onFailure: function (errorMsg){
                var msg = 'The sharing of ' + ' ' + Ext.htmlEncode(record.get('name')) + ' failed.';
                console.log('Error', errorMsg ? errorMsg : msg);

            },
            autoSendVersion : false

        });

        me.close();

    },

    sendRequest: function(url, json, mpLauncher, myMarketplace) {

        var me = this,
            urlString = url.replace(/\/$/, "");

        urlString += '/listing';

        Ozone.util.Transport.send({
            url : urlString,
            method : "POST",
            content: {
                data: json,
                windowname: true
            },

            onSuccess: Ext.bind(function(result) {

                console.log("success", "ID is " + result.data.id + ", New item created? " + result.data.isNew +
                    ", Message: " + result.data.msg) ;
                mpLauncher.gotoMarketplace(myMarketplace);


            }, me) ,

            onFailure: function (errorMsg){
                var msg = 'The sharing of ' + 'shareItem' + ' ' + Ext.htmlEncode(record.get('name')) + ' failed.';
                console.log('Error', errorMsg ? errorMsg : msg);
            },
            autoSendVersion : false

        })

    },
    
});