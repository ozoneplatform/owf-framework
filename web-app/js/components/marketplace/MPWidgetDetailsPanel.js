/* TEST FUNCTION TO LOAD A BUNCH OF RECORDS 
function createFakeData(count, testData) {
	var data = [];
	var index = 0;
	testData = testData ? testData : [{"createdDate":"2011-09-14T19:33:37Z","owfProperties":{"visibleInLaunch":true,"singleton":true,"id":65},"avgRate":0,"approvalStatus":"Approved","screenshot1Url":"http://www.freeiconsweb.com/Icons-show/IconsLandVistaSportIcons/Football_Ball.png","title":"Football","requires":[{"title":"Football Field","uuid":"6fd10261-d4fb-4e66-9908-aabe3f7e0010","id":70},{"title":"Football Player1","uuid":"07bbaf79-1f17-41cf-88fd-783d777b8f1c","id":78},{"title":"Football Player2","uuid":"1001f651-b40c-4cc9-8ca1-632d3009dfca","id":81},{"title":"Football Player3","uuid":"e778a9b5-4f5b-4627-8b49-79b832e1d3fe","id":74}],"imageSmallUrl":"http://www.freeiconsweb.com/Icons-show/IconsLandVistaSportIcons/Football_Ball.png","categories":[{"title":"Category C","id":8}],"imageLargeUrl":"http://www.freeiconsweb.com/Icons-show/IconsLandVistaSportIcons/Football_Ball.png","totalVotes":0,"id":66,"launchUrl":"http://www.google.com","isPublished":true,"uuid":"342c55f3-2c46-4e6f-abcb-9ba002968bed","versionName":"1.1","releaseDate":"2011-09-21T04:00:00Z","organization":"unknown","dependencies":null,"types":{"hasLaunchUrl":true,"title":"Widget","ozoneAware":true,"hasIcons":true,"id":16},"recommendedLayouts":["Accordion","Desktop"],"isEnabled":true,"screenshot2Url":null,"createdBy":{"username":"MikePAdmin","name":"Michael Parizer","id":63},"requirements":null,"docUrl":null,"techPoc":"MikePAdmin","editedDate":"2011-09-14T19:43:08Z","editedBy":{"username":"MikePAdmin","name":"Michael Parizer","id":63},"customFields":[],"totalComments":0,"description":"Test For required widgets","state":{"title":"Active","id":23},"installUrl":null,"ozoneAware":true,"lastActivity":{"activityDate":"2011-09-14T19:43:08Z"},"author":"MikePAdmin"},{"createdDate":"2011-09-14T19:34:10Z","owfProperties":{"visibleInLaunch":true,"singleton":true,"id":69},"avgRate":0,"approvalStatus":"Approved","screenshot1Url":null,"title":"Football Field","requires":[],"imageSmallUrl":"http://www.freeiconsweb.com/Icons-show/choose_your_sport__win/football.png","categories":[{"title":"Category C","id":8}],"imageLargeUrl":"http://www.freeiconsweb.com/Icons-show/choose_your_sport__win/football.png","totalVotes":0,"id":70,"launchUrl":"http://www.google.com","isPublished":true,"uuid":"6fd10261-d4fb-4e66-9908-aabe3f7e0010","versionName":"1.1","releaseDate":"2011-09-21T04:00:00Z","organization":"unknown","dependencies":null,"types":{"hasLaunchUrl":true,"title":"Widget","ozoneAware":true,"hasIcons":true,"id":16},"recommendedLayouts":["Accordion","Desktop"],"isEnabled":true,"screenshot2Url":null,"createdBy":{"username":"MikePAdmin","name":"Michael Parizer","id":63},"requirements":null,"docUrl":null,"techPoc":"MikePAdmin","editedDate":"2011-09-21T17:41:34Z","editedBy":{"username":"WayneAdmin","name":"Wayne Admin","id":47},"customFields":[],"totalComments":0,"description":"Test For required widgets","state":{"title":"Active","id":23},"installUrl":null,"ozoneAware":true,"lastActivity":{"activityDate":"2011-09-21T17:41:34Z"},"author":"MikePAdmin"},{"createdDate":"2011-09-14T19:35:16Z","owfProperties":{"visibleInLaunch":true,"singleton":false,"id":77},"avgRate":0,"approvalStatus":"Approved","screenshot1Url":null,"title":"Football Player1","requires":[{"title":"Football Sponsor","uuid":"8f206360-dcfc-4306-8e22-d765d06bce36","id":88}],"imageSmallUrl":"http://www.freeiconsweb.com/Icons-show/IconsLandVistaPeopleIconsDemo/FootballPlayer_Male_Dark.png","categories":[{"title":"Category C","id":8}],"imageLargeUrl":"http://www.freeiconsweb.com/Icons-show/IconsLandVistaPeopleIconsDemo/FootballPlayer_Male_Dark.png","totalVotes":0,"id":78,"launchUrl":"http://www.google.com","isPublished":true,"uuid":"07bbaf79-1f17-41cf-88fd-783d777b8f1c","versionName":"1.1","releaseDate":"2011-09-21T04:00:00Z","organization":"unknown","dependencies":null,"types":{"hasLaunchUrl":true,"title":"Widget","ozoneAware":true,"hasIcons":true,"id":16},"recommendedLayouts":["Accordion","Desktop"],"isEnabled":true,"screenshot2Url":null,"createdBy":{"username":"MikePAdmin","name":"Michael Parizer","id":63},"requirements":null,"docUrl":null,"techPoc":"MikePAdmin","editedDate":"2011-09-21T17:41:34Z","editedBy":{"username":"WayneAdmin","name":"Wayne Admin","id":47},"customFields":[],"totalComments":0,"description":"Test For required widgets","state":{"title":"Active","id":23},"installUrl":null,"ozoneAware":true,"lastActivity":{"activityDate":"2011-09-21T17:41:34Z"},"author":"MikePAdmin"},{"createdDate":"2011-09-14T19:35:32Z","owfProperties":{"visibleInLaunch":true,"singleton":false,"id":80},"avgRate":0,"approvalStatus":"Approved","screenshot1Url":null,"title":"Football Player2","requires":[{"title":"Football Sponsor","uuid":"8f206360-dcfc-4306-8e22-d765d06bce36","id":88}],"imageSmallUrl":"http://www.freeiconsweb.com/Icons-show/IconsLandVistaPeopleIconsDemo/FootballPlayer_Female_Light.png","categories":[{"title":"Category C","id":8}],"imageLargeUrl":"http://www.freeiconsweb.com/Icons-show/IconsLandVistaPeopleIconsDemo/FootballPlayer_Female_Light.png","totalVotes":0,"id":81,"launchUrl":"http://www.google.com","isPublished":true,"uuid":"1001f651-b40c-4cc9-8ca1-632d3009dfca","versionName":"1.1","releaseDate":"2011-09-21T04:00:00Z","organization":"unknown","dependencies":null,"types":{"hasLaunchUrl":true,"title":"Widget","ozoneAware":true,"hasIcons":true,"id":16},"recommendedLayouts":["Accordion","Desktop"],"isEnabled":true,"screenshot2Url":null,"createdBy":{"username":"MikePAdmin","name":"Michael Parizer","id":63},"requirements":null,"docUrl":null,"techPoc":"MikePAdmin","editedDate":"2011-09-21T17:41:34Z","editedBy":{"username":"WayneAdmin","name":"Wayne Admin","id":47},"customFields":[],"totalComments":0,"description":"Test For required widgets","state":{"title":"Active","id":23},"installUrl":null,"ozoneAware":true,"lastActivity":{"activityDate":"2011-09-21T17:41:34Z"},"author":"MikePAdmin"},{"createdDate":"2011-09-14T19:34:55Z","owfProperties":{"visibleInLaunch":false,"singleton":false,"id":73},"avgRate":0,"approvalStatus":"Approved","screenshot1Url":null,"title":"Football Player3","requires":[{"title":"Football Sponsor","uuid":"8f206360-dcfc-4306-8e22-d765d06bce36","id":88}],"imageSmallUrl":"http://www.freeiconsweb.com/Icons-show/IconsLandVistaPeopleIconsDemo/FootballPlayer_Male_Light.png","categories":[{"title":"Category C","id":8}],"imageLargeUrl":"http://www.freeiconsweb.com/Icons-show/IconsLandVistaPeopleIconsDemo/FootballPlayer_Male_Light.png","totalVotes":0,"id":74,"launchUrl":"http://www.google.com","isPublished":true,"uuid":"e778a9b5-4f5b-4627-8b49-79b832e1d3fe","versionName":"1.1","releaseDate":"2011-09-21T04:00:00Z","organization":"unknown","dependencies":null,"types":{"hasLaunchUrl":true,"title":"Widget","ozoneAware":true,"hasIcons":true,"id":16},"recommendedLayouts":["Accordion","Desktop"],"isEnabled":true,"screenshot2Url":null,"createdBy":{"username":"MikePAdmin","name":"Michael Parizer","id":63},"requirements":null,"docUrl":null,"techPoc":"MikePAdmin","editedDate":"2011-09-21T17:41:34Z","editedBy":{"username":"WayneAdmin","name":"Wayne Admin","id":47},"customFields":[],"totalComments":0,"description":"Test For required widgets","state":{"title":"Active","id":23},"installUrl":null,"ozoneAware":true,"lastActivity":{"activityDate":"2011-09-21T17:41:34Z"},"author":"MikePAdmin"},{"createdDate":"2011-09-14T19:36:26Z","owfProperties":{"visibleInLaunch":true,"singleton":false,"id":87},"avgRate":0,"approvalStatus":"Approved","screenshot1Url":null,"title":"Football Sponsor","requires":[],"imageSmallUrl":"http://www.freeiconsweb.com/Icons-show/Zosha_Icon_Pack/football_Nike_alt.png","categories":[{"title":"Category C","id":8}],"imageLargeUrl":"http://www.freeiconsweb.com/Icons-show/Zosha_Icon_Pack/football_Nike_alt.png","totalVotes":0,"id":88,"launchUrl":"http://www.google.com","isPublished":true,"uuid":"8f206360-dcfc-4306-8e22-d765d06bce36","versionName":"1.1","releaseDate":"2011-09-21T04:00:00Z","organization":"unknown","dependencies":null,"types":{"hasLaunchUrl":true,"title":"Widget","ozoneAware":true,"hasIcons":true,"id":16},"recommendedLayouts":["Accordion","Desktop"],"isEnabled":true,"screenshot2Url":null,"createdBy":{"username":"MikePAdmin","name":"Michael Parizer","id":63},"requirements":null,"docUrl":null,"techPoc":"MikePAdmin","editedDate":"2011-09-21T17:41:34Z","editedBy":{"username":"WayneAdmin","name":"Wayne Admin","id":47},"customFields":[],"totalComments":0,"description":"Test For required widgets","state":{"title":"Active","id":23},"installUrl":null,"ozoneAware":true,"lastActivity":{"activityDate":"2011-09-21T17:41:33Z"},"author":"MikePAdmin"}];
	for (var i = 0; i < (count || testData.length); i++) {
		if (index == testData.length) index = 0;
		data.push(testData[index]);
		index++;
	}
	return data;
}
*/

/*
 * @Ozone.components.MPWidgetDetailsPanel
 *
 * @param {Object} windowGroup used for the manager of the Marketplace popup.
 *
 */
Ext.define('Ozone.components.marketplace.MPWidgetDetailsPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.marketplace.widgetdetails', 'widget.Ozone.components.marketplace.MPWidgetDetailsPanel'],
    
    itemId: 'mpWidgetDetailPage',
    cls: 'mpWidgetDetailPage',
    preventHeader: true,
    autoScroll: true,

    recordId: null,
    parentWidget: {},
    requiredListings: [],
    
    mpWidgetSummary: null,
    mpWidgetSpecifications: null,
    mpWidgetAssociations: null,
    
    // This should be overridden when component is initialized.
    returnToSearchResults: function() {
        var mpMainPanel = this.up('#mpMainPanel'),
            mpWindow = mpMainPanel.up('#mpWindow');
        mpMainPanel.layout.setActiveItem('mpSearchResultsPanel');

        mpWindow.focus();
    },
    
    refreshPage: function(parentWidget, requiredListings) {
    	this.parentWidget = parentWidget ? parentWidget : this.parentWidget;
    	this.requiredListings = requiredListings ? requiredListings : this.requiredListings;
    	
        // Update widget detail page
        this.mpWidgetSummary.store = new Ext.data.Store({
            model: 'Ozone.marketplace.model.ServiceItem',
            data: [this.parentWidget]
        });
        this.mpWidgetSummary.tpl.overwrite(this.mpWidgetSummary.el, this.parentWidget);
        this.mpWidgetSummary.doComponentLayout();
        
        // Relink search results link
        var elemReturn = Ext.get('mpSearchResultsLink');
        if (elemReturn) {
            Ozone.components.focusable.Focusable.setupFocus(elemReturn);   

            elemReturn.addListener({
                click: {
                    fn: this.returnToSearchResults,
                    scope: this
                },
                keydown: {
                    fn: function(evt, dom) {
                        switch (evt.getKey()) {
                            case evt.ENTER: 
                            case evt.SPACE:
                                this.returnToSearchResults();
                        }
                    },
                    scope: this
                }
            });
        }
        
        // Add the "Add Widget" Button
        var elemAdd = Ext.get('mpAddButton');
        if (elemAdd) {
            Ext.create('Ext.Button', {
                text    : 'Add Widget',
                renderTo: 'mpAddButton',
                width: 100,
                handler : function() {
                    this.addWidget();
                },
                scope: this
            });
        }
        
        this.mpWidgetSpecifications.tpl.overwrite(this.mpWidgetSpecifications.body, this.parentWidget);
        this.mpWidgetSpecifications.doComponentLayout();
        
        // Update widget associations
//        this.requiredListings = createFakeData(25, this.requiredListings);  // test loading a bunch of records
    	var records = [];
        for (var i = 0; i < this.requiredListings.length; i++) {
            records.push(Ext.create('Ozone.marketplace.model.ServiceItem', this.requiredListings[i]));
        }
        this.mpWidgetAssociations.setTitle(this.parentWidget.title + ' Requires:');        
        
        this.mpWidgetAssociations.store = Ext.data.StoreManager.lookup('requiredWidgetsStore');
        this.mpWidgetAssociations.store.loadRecords(records, {addRecords: false});
        if (this.requiredListings && this.requiredListings.length > 0) {
        	this.mpWidgetAssociations.show();
        } else {
        	this.mpWidgetAssociations.hide();
        }

        this.mpWidgetSummary.fireEvent('refresh', this.mpWidgetSummary);
    },
    
    updateDetails: function(recordId) {
    	this.recordId = recordId ? recordId : this.recordId;
    	
    	if (this.recordId) {
	    	var scope = this;
	    	this.setLoading(true);
	    	Ozone.marketplace.util.getOWFRequiredListings({
			
	            id: this.recordId,
				
	            success: function onSuccess(json) {
	            	if (json.data instanceof Array) {
	            	scope.refreshPage(json.data[0], json.data.slice(1));
	            	} else {
		            	scope.refreshPage(json.data, []);
	            	}
	    	    	scope.setLoading(false);
	            },
	            
	            failure: function onGetFailure(error, status) {
	            	// Display error?
	    	    	scope.setLoading(false);
	            }
	        });
    	}
    },
    
    addWidget: function() {
		var approvalTag = {};
        var widgetsJSON = [];
        var directRequired = [];
        var requiredListings = this.requiredListings;
        var parentWidget = this.parentWidget;

        if (Ozone.config.enablePendingApprovalWidgetTagGroup) {
            approvalTag = {
                name: Ozone.config.carousel.pendingApprovalTagGroupName, 
                visible:true, 
                position: -1, 
                editable: false
            };
        }
        else {
            var dt = new Date();
            var dateString = Ext.Date.format(dt, 'Y-m-d');
            approvalTag = {
                name: Ozone.config.carousel.approvedTagGroupName+' on '+dateString, 
                visible:true, 
                position: -1, 
                editable: true
            };
        }
        
        if (parentWidget.requires) {
        for (var i = 0; i < parentWidget.requires.length; i++) {
        	directRequired.push(parentWidget.requires[i].uuid);
        }
        }
        
        // Add parent widget
        var json = {
            displayName: parentWidget.title,
            height: 200,
            imageUrlLarge: parentWidget.imageLargeUrl ? parentWidget.imageLargeUrl : Ozone.util.contextPath(),
            imageUrlSmall: parentWidget.imageSmallUrl ? parentWidget.imageSmallUrl : Ozone.util.contextPath(),
            isExtAjaxFormat: true,
            widgetGuid: parentWidget.uuid,
            widgetUrl: parentWidget.launchUrl,
            width: 200,
            widgetVersion: parentWidget.versionName,
            tags: Ext.JSON.encode([approvalTag]),
            singleton: parentWidget.owfProperties && parentWidget.owfProperties != "" ? parentWidget.owfProperties.singleton : false,
            visible: parentWidget.owfProperties && parentWidget.owfProperties != "" ? parentWidget.owfProperties.visibleInLaunch : true,
            isSelected: true,
            background: false
        };
    	if (directRequired.length > 0) {
    		json.directRequired = Ext.JSON.encode(directRequired);
    	}
    	widgetsJSON.push(Ext.JSON.encode(json));
        
    	if (requiredListings && requiredListings.length > 0) {
        	
        	// Add required widgets
            for (var i = 0; i < requiredListings.length; i++) {
            	directRequired = [];
            	
                for (var j = 0; j < requiredListings[i].requires.length; j++) {
                	directRequired.push(requiredListings[i].requires[j].uuid);
                }
                
            	json = {
                    displayName: requiredListings[i].title,
                    height: 200,
                    imageUrlLarge: requiredListings[i].imageLargeUrl ? requiredListings[i].imageLargeUrl : Ozone.util.contextPath(),
                    imageUrlSmall: requiredListings[i].imageSmallUrl ? requiredListings[i].imageSmallUrl : Ozone.util.contextPath(),
                    isExtAjaxFormat: true,
                    widgetGuid: requiredListings[i].uuid,
                    widgetUrl: requiredListings[i].launchUrl,
                    width: 200,
                    widgetVersion: requiredListings[i].versionName,
                    tags: Ext.JSON.encode([approvalTag]),
                    singleton: requiredListings[i].owfProperties ? requiredListings[i].owfProperties.singleton : false,
                    visible: requiredListings[i].owfProperties ? requiredListings[i].owfProperties.visibleInLaunch : true,
                    background: false
            	};
            	if (directRequired.length > 0) {
            		json.directRequired = Ext.JSON.encode(directRequired);
            	}
            	widgetsJSON.push(Ext.JSON.encode(json));
            }
        	
        	var alertView = Ext.create('Ext.panel.Panel', {
                autoScroll: true,
                preventHeader: true,
                cls: 'mpWindow',
                bodyCls: 'mpMsgWindow',
                data: requiredListings,
                tpl: Ext.create('Ext.XTemplate', 
            		'<div class="mpParentListing">',
	                	'<table>',
	                		'<tr>',
		                		'<td valign="top" width="65">',
	                				'<div class="parent-icon">',
	                					'<img src="' + parentWidget.imageLargeUrl + '" title="' + Ext.util.Format.htmlEncode(parentWidget.title) + '">',
		                			'</div>',
		                		'</td>',
		                		'<td valign="top">',
		                			'<div class="parent-title">' + Ext.util.Format.htmlEncode(parentWidget.title) + '</div>',
		                			'<div class="parent-text">' + Ozone.layout.DialogMessages.marketplaceWindow_RequiredListingsAlertMsg + '</div>',
		                		'</td>',
		                	'</tr>',
		                '</table>',
	                '</div>',
	                '<div id="mpMsgWindowProgress" class="mpMsgWindowProgress"></div>',
            		'<div class="mpRequiredListings">',
		                '<tpl for=".">',
		                	'<div class="mpDetailSummary {[xindex % 2 === 0 ? "" : "striped-row"]}">',
		                		'<table width="100%">',
		                			'<tr>',
		                				'<td valign="top" width="85">',
	                						'<div class="detail-icon">',
	                							'<img src="{imageLargeUrl}" title="{title:this.htmlEncode}">',
	                						'</div>',
		                				'</td>',
		                				'<td valign="top">',
		                					'<div class="detail-title">{title:this.htmlEncode}</div>',
		                					'<div class="detail-version">',
		                						'Version {versionName:this.htmlEncode}&nbsp;&nbsp;{owfProperties:this.visibleInLaunch}',
		                					'</div>',
		                					'<div class="mpDetailInfo">',
		                						'<span class="detail-author-label">Owner: </span>',
		                						'<span class="detail-author">{author:this.htmlEncode}</span>',
		                					'</div>',
                                            '<tpl if="releaseDate != &quot;&quot;">',
		                					'<div class="mpDetailInfo">',
		                						'<span class="detail-released-label">Released: </span>',
                                                '<tpl if="releaseDate != &quot;&quot;">',
                                                '<span class="detail-released">{releaseDate:this.displayDate}</span>',
                                                '</tpl>',
		                					'</div>',
                                            '</tpl>',
		                				'</td>',
		                				'<td valign="top">',
	                						'<div style="padding-top:25px;">&nbsp;</div>',
		                					'<div class="mpDetailInfo">',
		                						'<span class="detail-organization-label">Organization: </span>',
		                						'<span class="detail-organization">{organization:this.htmlEncode}</span>',
		                					'</div>',
                                            '<tpl if="lastActivity != null && lastActivity.activityDate != &quot;&quot;">',
		                					'<div class="mpDetailInfo">',
		                						'<span class="detail-modified-label">Modified: </span>',
                                                '<tpl if="lastActivity != null && lastActivity.activityDate != &quot;&quot;">',
                                                '<span class="detail-modified">{lastActivity.activityDate:this.displayDate}</span>',
                                                '</tpl>',
		                					'</div>',
                                            '</tpl>',
		                				'</td>',
			                		'</tr>',
		                		'</table>',
		                	'</div>',
		                '</tpl>', 
                	'</div>', {
                    compiled: true,
                    htmlEncode: function(str) {
                    	return Ext.util.Format.htmlEncode(str);
                    },
                    displayDate: function(strDate) {
                    	if (strDate) {
                    		var yyyy = strDate.substr(0,4);
                    		var mm = parseInt(strDate.substr(5,2),10) - 1; // months go from 0 - 11
                    		var dd = strDate.substr(8,2);
                    		var H = strDate.substr(11,2);
                    		var min = strDate.substr(14,2);
                    		var sec = strDate.substr(17,2);
                    		var dt = new Date(yyyy, mm, dd, H, min, sec, 0);
                    		strDate = Ext.Date.format(dt, 'm/d/Y');
                    	}
                    	return strDate ? strDate : "";
                    },
                    visibleInLaunch: function (owfProperties) {
                    	return owfProperties && owfProperties.visibleInLaunch ? "" : "(Hidden)";
                    }
                })
        	});
        	
        	var alertWin = Ext.create('Ext.window.Window', {
        	    title: 'Adding Widget',
        	    width: 650,
        	    height: 400,
        	    layout: 'fit',
        	    modal: true,
        	    items: [alertView],
        	    dockedItems: [{
        	        xtype: 'toolbar',
        	        dock: 'bottom',
        	        ui: 'footer',
        	        items: [
        	            { 
                            xtype: 'tbfill'
                        },{
        	            	xtype: 'button',
                            itemId: 'okBtn',
        	            	text: Ozone.layout.MessageBoxButtonText.ok,
        	            	handler: function() {
        	            		var progressBar = Ext.create('Ext.ProgressBar', {
     	            			   text: 'Adding Widget...',
     	            			   autoShow: true,
     	            			   renderTo: 'mpMsgWindowProgress'
        	            		});
        	            		
        	            		progressBar.wait({
      	            			   text: 'Adding Widget...',
    	            			   interval: 1000, //bar will move fast!
    	            			   increment: 100
    	            			});
        	            		        	                    
        	                    owfdojo.xhrPost({
        	                        url: Ozone.util.contextPath() + '/widget/',
        	                        sync: true,
        	                        content: {
        	                            addExternalWidgetsToUser: true,
        	                            widgets: Ext.JSON.encode(widgetsJSON)
        	                        },
        	                        load: function(response, ioArgs) {
        	                            var cp = Ext.getCmp('launchMenuPanel');
        	                            cp.widgetStore.load();
                	                    alertWin.close();
        	                        },
        	                        error: function(response, ioArgs) {
                	                    alertWin.close();
        	                            Ozone.Msg.alert(Ozone.layout.DialogMessages.error, Ozone.layout.DialogMessages.marketplaceWindow_AddWidget, null, null, {
        	                                cls:'confirmationDialog'
        	                            });
        	                        }
        	                    });        	                    
        	            	}
        	            }, { 
        	            	xtype: 'button', 
                            itemId: 'cancelBtn',
        	            	text: Ozone.layout.MessageBoxButtonText.cancel,
        	            	handler: function() {
        	            		alertWin.close();
        	            	}
        	            }, {
                            xtype: 'tbfill'
        	            }
        	        ]
        	    }],
                listeners: {
                    afterrender: function (cmp) {
                        Ext.applyIf(cmp, 
                            new Ozone.components.focusable.EscCloseHelper());

                        cmp.setupFocusOnEsc(Ext.getCmp('mpWindow').getFocusEl());

                        Ext.applyIf(cmp, 
                            new Ozone.components.focusable.CircularFocus());

                        //circular focus
                        cmp.setupFocus(
                            cmp.down('#okBtn').getFocusEl(), 
                            cmp.down('#cancelBtn').getFocusEl()
                        );

                    }
                }
        	});
        	alertWin.show();
    	} else {
            owfdojo.xhrPost({
                url: Ozone.util.contextPath() + '/widget/',
                sync: true,
                content: {
                    addExternalWidgetsToUser: true,
                    widgets: Ext.JSON.encode(widgetsJSON)
                },
                load: function(response, ioArgs) {
                    var cp = Ext.getCmp('launchMenuPanel');
                    cp.widgetStore.load();
                },
                error: function(response, ioArgs) {
                    Ozone.Msg.alert(Ozone.layout.DialogMessages.error, Ozone.layout.DialogMessages.marketplaceWindow_AddWidget, null, null, {
                        cls:'confirmationDialog'
                    });
                }
            });
    	}
    },
    
    // private
    onBeforeShow: function(cmp){
        this.callParent(arguments);        
    },
    
    onShow: function(cmp){
        this.callParent(arguments);        
        this.updateDetails();
    },
    
    onRender: function(cmp){
        this.callParent(arguments);        
        this.updateDetails();
    },
    
    initComponent: function(){
        Ozone.components.MPListingsAPI = new Ozone.marketplace.MPListingsAPI();
        Ozone.components.MPCategoryAPI = new Ozone.marketplace.MPCategoryAPI();
        
        var items = [];

        this.mpWidgetSummary = Ext.widget('templateeventdataview', {
            itemId: 'mpWidgetDetailPage',
            cls: 'mpWidgetDetailPage',
            multiSelect: false,
            singleSelect: false,
            simpleSelect: false,
            autoScroll: true,
            autoHeight: true,
            itemSelector: '.selectable',
            listeners: {
                itemclick: {
                    scope: this,
                    fn: function(dataView, index, node, event){
                    	// Update Categories links to search by category
                    }
                },
                templaterendered: {
                    fn: function(dataView){

                        //start with the focus on the view itself, so the next tab
                        //will put it on the first focusable elem
                        dataView.el.dom.tabIndex = 0;
                        dataView.focus();

                        var elemReturn = Ext.get('mpSearchResultsLink');
                        if (elemReturn) {
                            var returnHandler = Ext.bind(function() {
                            	this.returnToSearchResults();
                            }, this);

                            elemReturn.addListener('click', returnHandler, this);
                            elemReturn.addListener('keydown', function(evt) {
                                switch (evt.getKey()) {
                                    case Ext.EventObject.ENTER:
                                    case Ext.EventObject.SPACE:
                                        returnHandler();
                                }
                            }, this);
                        };
                        
                        var elemAdd = Ext.get('mpAddButton');
                        if (elemAdd) {
                        	Ext.create('Ext.Button', {
                        	    text    : 'Add Widget',
                        	    renderTo: 'mpAddButton',
                        	    width: 100,
                        	    handler : function() {
                        	    	this.addWidget();
                        	    },
                        	    scope: this
                        	});
                        };

                        var elemReturn = Ext.get('mpSearchResultsLink');
                        if (elemReturn) {
                            Ozone.components.focusable.Focusable.setupFocus(elemReturn, this);
                        }
                    },
                    scope: this
                }
            },
            tpl: Ext.create('Ext.XTemplate', '<tpl for=".">', '<div id="mpSearchResultsLink" class="return-search-link detail-selectable">Return to Search Results</div>', '<div class="detail-title">{title:this.htmlEncode}</div>', '<div id="mpDetailSummary" class="mpDetailSummary">', '<table>', '<tr>', '<td valign="top" width="125" class="detail-top-row">', '<div id="mpDetailIcon" class="mpDetailIcon">', '<div class="detail-icon">', '<img src="{imageLargeUrl}" title="{title:this.htmlEncode}">', '</div>', '<div id="mpAddButton" class="detail-add-button">', '</div>', '</div>', '</td>', '<td valign="top">', '<div id="mpDetailInfo" class="mpDetailInfo">', '<span class="detail-author-label">Owner: </span>', '<span class="detail-author">{author:this.htmlEncode}</span>', '<span class="detail-version">Version {versionName:this.htmlEncode}</span>', '</div>', '<div class="detail-description">{description:this.htmlEncode}</div>', '<div class="detail-categories">', '<span class="detail-category-header">Categories: </span>', '<span class="detail-category">{categories:this.listCategoryLinks}</span>', '</td>', '</td>', '</tr>', '</table>', '</div>', '<div id="mpAddlInfo" class="mpAddlInfo">', '</div>', '<div id="mpDependencies" class="mpDependencies">', '</div>', '</tpl>',{
                compiled: true,
                idHeader: 'detail-category-',
                htmlEncode: function(str) {
                	return Ext.util.Format.htmlEncode(str);
                },
                listCategoryLinks: function(categories) {
                	var html = '';
                	for (var i = 0; i < categories.length; i++) {
                		var id = categories[i].id ? this.idHeader + categories[i].id : this.idHeader + 'all';
                		var title = Ext.util.Format.htmlEncode(categories[i].title);
                		html += '<span id="' + id + '" class="detail-category-link">' + title + '</span>';
                		if (categories.length > 1 && i < categories.length - 1) {
                			html += ', ';
                		}
                	}
                	return html;
                }
            })
        });
        items.push(this.mpWidgetSummary);
        
        this.mpWidgetSpecifications = Ext.create('Ext.panel.Panel', {
	        title: 'Specifications',
            data: this.parentWidget,
    	    componentCls: 'mp-specifications-panel',
	        tpl: Ext.create('Ext.XTemplate', 
        		'<tpl for=".">', 
        			'<table>', 
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', 
        						'<div>State:</div>', 
        					'</td>', 
        					'<td valign="top" class="detail-specifications-row">', '<tpl for="state">', '<div>{title:this.htmlEncode}</div>', '</tpl>', '</td>', 
        				'</tr>', 
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', '<div>Launch URL:</div>', '</td>', 
        					'<td valign="top" class="detail-specifications-row">', '<div>{launchUrl}</div>', '</td>', 
        				'</tr>', 
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', '<div>Organization:</div>', '</td>', 
        					'<td valign="top" class="detail-specifications-row">', '<div>{organization:this.htmlEncode}</div>', '</td>', 
        				'</tr>', 
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', '<div>Technical POC:</div>', '</td>', 
        					'<td valign="top" class="detail-specifications-row">', '<div>{techPoc:this.htmlEncode}</div>', '</td>', 
        				'</tr>', 
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', '<div>Recommended Layouts:</div>', '</td>', 
        					'<td valign="top" class="detail-specifications-row">', '<div>{recommendedLayouts:this.convertArrayToString}</div>', '</td>', 
        				'</tr>', 
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', '<div>Singleton:</div>', '</td>', 
        					'<td valign="top" class="detail-specifications-row">', '<div>{owfProperties:this.isSingleton}</div>', '</td>', 
        				'</tr>', 
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', '<div>Visible in Launch Menu:</div>', '</td>', 
        					'<td valign="top" class="detail-specifications-row">', '<div>{owfProperties:this.isVisible}</div>', '</td>', 
        				'</tr>', 
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', '<div>Screenshot:</div>', '</td>', 
        					'<td valign="top" class="detail-specifications-row">{screenshot1Url:this.createScreenshot}', '</td>', 
        				'</tr>', 
        				'<tpl if="this.getCreatedBy(createdBy)">',
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', '<div>Created By:</div>', '</td>', 
        					'<td valign="top" class="detail-specifications-row">', '<div>{createdBy:this.getCreatedBy}</div>', '</td>', 
        				'</tr>', 
        				'</tpl>',
                        '<tpl if="createdDate != &quot;&quot;">',
        				'<tr class="detail-specifications">', 
        					'<td valign="top" width="125" class="detail-specifications-row">', '<div>Created Date:</div>', '</td>', 
        					'<td valign="top" class="detail-specifications-row">', '<div>{createdDate:this.displayDate}</div>', '</td>', 
        				'</tr>', 
                        '</tpl>',
        			'</table>', 
        		'</div>', 
        	'</tpl>', {
                compiled: true,
                htmlEncode: function(str) {
                	return Ext.util.Format.htmlEncode(str);
                },
                getCreatedBy: function(obj) {
                	return Ext.util.Format.htmlEncode(obj.name);
                },
                displayDate: function(strDate) {
                	if (strDate) {
                		var yyyy = strDate.substr(0,4);
                		var mm = parseInt(strDate.substr(5,2),10) - 1; // months go from 0 - 11
                		var dd = strDate.substr(8,2);
                		var H = strDate.substr(11,2);
                		var min = strDate.substr(14,2);
                		var sec = strDate.substr(17,2);
                		var dt = new Date(yyyy, mm, dd, H, min, sec, 0);
                		strDate = Ext.Date.format(dt, 'M d, Y h:i:s A T');
                	}
                	return strDate ? strDate : "";
                },
                convertArrayToString: function(arr){
                    return arr ? arr.toString().replace(/,/g,", ") : '';
                },
                createScreenshot: function(url) {
                	return url ? '<div class="detail-specifications-screenshot"><img src="' + url + '" title="{title}"></div>' : "";
                },
				isVisible: function(obj) {
					return (obj && Ext.isDefined(obj.visibleInLaunch)) ? obj.visibleInLaunch : true;
				},
				isSingleton: function(obj) {
					return (obj && obj.singleton) ? obj.singleton : false;
				}
	        })
	    }); 
        items.push(this.mpWidgetSpecifications);

        var requiredWidgetsStore = Ext.create('Ext.data.Store', {
    	    storeId:'requiredWidgetsStore',
    	    model: 'Ozone.marketplace.model.ServiceItem'
    	});
        
        // create the Data Store
        this.mpWidgetAssociations = Ext.create('Ext.grid.Panel', {
            title: this.parentWidget.title + ' Requires:',
            store: requiredWidgetsStore,
            hideHeaders: true,
    	    componentCls: 'mp-required-panel',
    	    bodyCls: 'mp-required-body',
            loadMask: true,
    	    viewConfig: {
    	    	stripeRows: false
            },
            height: 200,
            // grid columns
    	    columns: [
    	        {
		        	xtype: 'gridcolumn',
		        	dataIndex: 'imageSmallUrl', 
		        	width: 36,
		        	sortable: false,
		        	resizable: false,
		        	menuDisabled: true,
		        	renderer: function (val, metaData, record, rowIndex, colIndex, store){
						var retVal = '<div><img width=\"24px\" height=\"24px\" src="'+val+'"></div>';
	                    return  val ? retVal : "";
	                }
		        }, {
		        	dataIndex: 'title', 
		        	flex:1,
		        	renderer: function (val, metaData, record, rowIndex, colIndex, store){
	                    return  val ? Ext.util.Format.htmlEncode(val) : "";
	                }
		        }, {
		        	xtype: 'gridcolumn',
		        	dataIndex: 'versionName', 
		        	width: 75,
		        	sortable: false,
		        	menuDisabled: true,
		        	renderer: function (val, metaData, record, rowIndex, colIndex, store){
						var retVal = '<span class="requiredListingsVersion">v.'+Ext.util.Format.htmlEncode(val)+'</span>';
	                    return  val ? retVal : "";
	                }
		        }
    	    ],
    	    listeners: {
    	    	itemdblclick: {
    	    		scope: this,
    	    		fn: function(dataview, record, el, index, event) {
    	    			this.updateDetails(record.data.id);
    	    		}
    	    	}
    	    }
        });

        items.push(this.mpWidgetAssociations);

        
        Ext.applyIf(this, {
            items: [items]
        });
        
        //call super init
        this.callParent();
    }
});

