/**
 * @ignore
 */
var Ozone = Ozone ? Ozone : {};

/**
 * @ignore
 * @namespace
 */
Ozone.marketplace = Ozone.marketplace || {};

Ozone.marketplace.AddWidgetContainer = function (eventingContainer, dashboardContainer) {

    this.addWidgetChannelName = "_ADD_WIDGET_CHANNEL";
    this.addStackChannelName = "_ADD_STACK_CHANNEL";
    this.windowManager = null;
    this.ANIMATION_DURATION = 1000;

    this.dashboardContainer = dashboardContainer;

    if (eventingContainer != null) {
        this.eventingContainer = eventingContainer;
        //register on add widget channel
        var scope = this;
        this.eventingContainer.registerHandler(this.addWidgetChannelName, function (sender, msg) {
            var me = this;

            return scope.addWidget(Ozone.util.parseJson(sender), Ozone.util.parseJson(msg), function (result) {
                me.callback && me.callback(result);
            });
        });
        this.eventingContainer.registerHandler(this.addStackChannelName, function (sender, msg) {
            var me = this;
            // Must return a value for the callback function to be invoked on the client side.
            return scope.addStack(Ozone.util.parseJson(sender), Ozone.util.parseJson(msg), function (result) {
                me.callback && me.callback(result);
            });
        });
    }
    else {
        throw {
            name:'AddWidgetContainerException',
            message:'eventingContainer is null'
        };
    }

};

Ozone.marketplace.AddWidgetContainer.prototype = {
    getlistingVisualizer: function(sender, config, marketplaceCallback, listingType) {
        var self = this;
        var animTargetX,
            animTargetBtn,
            id = config.data.id,
            imageInfo = config.data.image;

        if (listingType === "widget") {
            animTargetX = "67px";
            animTargetBtn = "appComponentsBtn";
        }
        else if (listingType === "stack") {
            animTargetX = "0px";
            animTargetBtn = "myAppsBtn";
        }

        var visualizeAddition = function(definitionName) {
            var btn = Ext.getCmp(animTargetBtn);
            if(Modernizr.csstransitions && Modernizr.cssanimations) {
                var listing = Ext.getCmp(sender.id),
                    listingOffsets = listing.el.getOffsetsTo(Ext.getBody()),
                    imgHTML = ['<img class="marketplace_animate_listing" src="', imageInfo.URL,
                        '" style="',
                        ';width:', imageInfo.width, 'px',
                        ';height:', imageInfo.height, 'px',
                        ';left:', (imageInfo.left + listingOffsets[0]), 'px',
                        ';top:', (imageInfo.top + listingOffsets[1]), 'px',
                        ';">'
                    ].join(''),
                    img = Ext.DomHelper.insertHtml('beforeEnd', Ext.getBody().dom, imgHTML),
                    $img = jQuery(img);

                $img
                    .one(CSS.Transition.TRANSITION_END, function () {
                        $img.remove();
                        btn.blink();
                        marketplaceCallback && marketplaceCallback(id);
                    })
                    .css({
                        top: '0px',
                        left: animTargetX,
                        width: btn.btnEl.getWidth() + 'px',
                        height: btn.btnEl.getHeight() + 'px'
                    });
            }
            else {
                var tip = Ext.create('Ext.tip.ToolTip', {
                    html: definitionName + ' has been added successfully from AppsMall.',
                    anchor: 'left',
                    target: animTargetBtn,
                    cls: 'focusTooltip',
                    listeners: {
                        hide: function () {
                            tip.destroy();
                        }
                    }
                });
                btn.blink();
                tip.show();
                marketplaceCallback && marketplaceCallback(id);
            }
        };
        return visualizeAddition;
    },

    addStack: function (sender, config, marketplaceCallback) {
        this.dashboardContainer.loadMask.show();
        var stackJSON = config.widgetsJSON;
        this.dashboardContainer.dashboardsNeedRefresh = true;
        var visualizeAddition = this.getlistingVisualizer(sender, config, marketplaceCallback, "stack");
        this.processMarketplaceStackData(stackJSON.itemUuid, visualizeAddition);
        return stackJSON.itemId;
    },

    processMarketplaceStackData: function(stackUuid, addStackCallback) {
        var self = this;
        return owfdojo.xhrPost({
            url:Ozone.util.contextPath() + '/stack/',
            sync:true,
            content:{
                addExternalStackToUser:true,
                guid:stackUuid
            },
            load: function (response, ioArgs) {
                var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

                $.pnotify({
                    title: Ozone.layout.DialogMessages.added,
                    text: "The stack was successfully added.",
                    type: 'success',
                    addclass: "stack-bottomright",
                    stack: stack_bottomright,
                    history: false,
                    sticker: false,
                    icon: false
                });

                addStackCallback && addStackCallback("The stack");
                self.dashboardContainer.widgetStore.load();
                self.dashboardContainer.loadMask.hide();
            },
            error: function(jsonData) {
                self.dashboardContainer.loadMask.hide();
                Ozone.Msg.alert("Error", jsonData);
            }
        });
    },

    addWidget:function (sender, config, marketplaceCallback) {
        this.dashboardContainer.loadMask.show();

        var visualizeAddition = this.getlistingVisualizer(sender, config, marketplaceCallback, "widget");

        this.processMarketplaceWidgetData(config.baseUrl, config.data.id, config.doLaunch, visualizeAddition, marketplaceCallback);
    },

    processMarketplaceWidgetData: function(marketplaceUrl, widgetId, doLaunch, addWidgetCallback, doLaunchCallback) {
        var self = this;
        Ozone.util.Transport.send({
            url: marketplaceUrl + "/relationship/getOWFRequiredItems",
            method: "POST",
            content: {
                id: widgetId
            },
            onSuccess: function(jsonData) {
                var widgetListJson = [], data = jsonData.data;

                for (var i = 0, len = data.length; i < len; i++) {
                    var serviceItem = data[i];

                    var customFields = {};
                    Ext.Array.each(serviceItem.customFields, function(field, index, list) {
                        customFields[field.name] = field.value;
                    });
                    if (serviceItem.types.title === 'Dashboard') {
                        if (customFields.dashboardDefinition) {
                            Ozone.pref.PrefServer.createOrUpdateDashboard({
                                json: JSON.parse(customFields.dashboardDefinition),
                                onSuccess: function(dashboard) {}
                            });
                        }
                    } else {
                        widgetListJson.push(Ext.JSON.encode(self.createOwfWidgetJson(serviceItem, widgetId)));
                    }
                }

                if (widgetListJson.length > 0) {
                    // OZP-476: MP Synchronization
                    // Added the URL of the Marketplace we're looking at to the
                    // JSON we send to the widget controller.
                    self.submitWidgetList(Ext.JSON.encode(widgetListJson), marketplaceUrl, doLaunch, addWidgetCallback, doLaunchCallback);
                }
            },
            onFailure: function(json) {
                Ext.Msg.alert("Error", "Error has occurred while adding widgets from Marketplace");

                self.dashboardContainer.loadMask.hide();
            }
        });
    },

    createOwfWidgetJson: function (serviceItem, widgetId) {
        var directRequired = [];
        for (var j = 0; j < serviceItem.requires.length; j++) {
            directRequired.push(serviceItem.requires[j].uuid);
        }

        var widgetJson = {
            displayName: serviceItem.title,
            description: serviceItem.description ? serviceItem.description : '',
            imageUrlLarge: serviceItem.imageLargeUrl,
            imageUrlSmall: serviceItem.imageSmallUrl,
            widgetGuid: serviceItem.uuid,
            widgetUrl: serviceItem.launchUrl,
            widgetVersion: serviceItem.versionName,
            //FIXME this ternary is a hack for AML-3148
            singleton: (!serviceItem.ozoneAware ? false : serviceItem.owfProperties.singleton),
            //FIXME this ternary is a hack for AML-3148
            visible: (!serviceItem.ozoneAware ? false : serviceItem.owfProperties.visibleInLaunch),
            //FIXME this ternary is a hack for AML-3148
            background: (!serviceItem.ozoneAware ? false : serviceItem.owfProperties.background),
            isSelected: widgetId == serviceItem.id, // true if this is the widget the user selected and not a dependent widget
            //FIXME this ternary is a hack for AML-3148
            height: (!serviceItem.ozoneAware  ? 200 : serviceItem.owfProperties.height),
            //FIXME this ternary is a hack for AML-3148
            width: (!serviceItem.ozoneAware  ? 200 : serviceItem.owfProperties.width),
            //FIXME this ternary is a hack for AML-3148
            universalName: (!serviceItem.ozoneAware ? "" : (serviceItem.owfProperties.universalName || "" )),
            isExtAjaxFormat: true,
            //FIXME this ternary is a hack for AML-3148
            widgetTypes: [(!serviceItem.ozoneAware ? "fullscreen" : serviceItem.owfProperties.owfWidgetType)]
//                ,
//                tags: Ext.JSON.encode([this.createApprovalTag()])
        };
        
        
        if (directRequired.length > 0) {
            widgetJson.directRequired = Ext.JSON.encode(directRequired);
        }
        return widgetJson;
    },

    createApprovalTag: function() {
        var approvalTag = {};
        if (Ozone.config.enablePendingApprovalWidgetTagGroup) {
            approvalTag = {
                name:Ozone.config.carousel.pendingApprovalTagGroupName,
                visible:true,
                position:-1,
                editable:false
            };
        }
        else {
            var dt = new Date();
            var dateString = Ext.Date.format(dt, 'Y-m-d');
            approvalTag = {
                name:Ozone.config.carousel.approvedTagGroupName + ' on ' + dateString,
                visible:true,
                position:-1,
                editable:true
            };
        }
        return approvalTag;
    },

    // OZP-476: MP Synchronization
    // Added the URL of the Marketplace we're looking at to the JSON we send to
    // the widget controller.
    submitWidgetList: function(widgetList, mpUrl, doLaunch, addWidgetCallback, doLaunchCallback) {
		var self = this;
        return owfdojo.xhrPost({
            url:Ozone.util.contextPath() + '/widget/',
            sync:true,
            content:{
                marketplaceUrl: mpUrl,
                addExternalWidgetsToUser:true,
                widgets:widgetList
            },
            load:function (response, ioArgs) {

                var widgetLauncher = Ext.getCmp('widget-launcher');
                widgetLauncher.loadLauncherState();

                var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

                // AML-2924 - This will display the dashboard switcher and add a listener to launch the widget if
                // requested


                var result = Ext.JSON.decode(response),
                    notifyText;

                if (result.success) {
                    var widgetGuid = result.data[0].widgetGuid,
                        widgetDefs;

                    self.dashboardContainer.widgetStore.on({
                        // Have to load the store first. Add a listener so we can work with the newly loaded store
                        load: {
                            fn: function(store, records, success, operation, eOpts) {

                                // Get the widget definition
                                widgetDefs = self.dashboardContainer.widgetStore.queryBy(function(record,id) {
                                    return record.data.widgetGuid == widgetGuid;
                                });

                                // The widget is in the store
                                if (widgetDefs && widgetDefs.getCount() > 0)  {

                                    // If the widget is to be launched
                                    if (doLaunch) {
                                        // It will be the first item if there is more than one (the remaining are required items)
                                        var widgetDef = widgetDefs.get(0);

                                        notifyText = self.launchWidget(widgetDef, doLaunchCallback);

                                    } else {
                                        notifyText = "The widget was successfully added.";
                                        addWidgetCallback && addWidgetCallback(widgetDefs.get(0).get('name'));
                                    }
                                } else {
                                    // Failure message
                                    notifyText = Ozone.layout.DialogMessages.marketplaceWindow_AddWidget;
                                }
                                //Display the message
                                notifyText && $.pnotify({
                                    title: Ozone.layout.DialogMessages.added,
                                    text: notifyText,
                                    type: 'success',
                                    addclass: "stack-bottomright",
                                    stack: stack_bottomright,
                                    history: false,
                                    sticker: false,
                                    icon: false
                                });

                                self.dashboardContainer.loadMask.hide();
                            } ,
                            scope: this,
                            single: true
                        }
                    });

                    self.dashboardContainer.widgetStore.load();

                }   else {
                    notifyText = Ozone.layout.DialogMessages.marketplaceWindow_AddWidget;
                    $.pnotify({
                        title: Ozone.layout.DialogMessages.added,
                        text: notifyText,
                        type: 'success',
                        addclass: "stack-bottomright",
                        stack: stack_bottomright,
                        history: false,
                        sticker: false,
                        icon: false
                    });

                    self.dashboardContainer.loadMask.hide();
                }




                // End AML-2924



            },
            error:function (response, ioArgs) {
                Ozone.Msg.alert(Ozone.layout.DialogMessages.error, Ozone.layout.DialogMessages.marketplaceWindow_AddWidget, null, null, {
                    cls:'confirmationDialog'
                });
                self.dashboardContainer.loadMask.hide();
            }
        });
    },

    launchWidget: function(widgetDef, doLaunchCallback) {
        var self = this;

        var notifyText = null;

        if(widgetDef.data.widgetTypes[0].name == "fullscreen") {
            var dashboard;
            var dashboardStore = self.dashboardContainer.dashboardStore;

            var tmpDashboard = null;
            for(var storeCount = 0; storeCount < dashboardStore.getCount(); storeCount++) {
                tmpDashboard = dashboardStore.getAt(storeCount);

                if(tmpDashboard.data.name == widgetDef.data.title) {
                    if(tmpDashboard.data.locked == true) {
                        if(tmpDashboard.data.layoutConfig.widgets[0] &&
                            tmpDashboard.data.layoutConfig.widgets[0].widgetGuid == widgetDef.data.widgetGuid) {
                            dashboard = tmpDashboard;
                        }
                    }
                }
            }

            if(dashboard) {
                self.dashboardContainer.activateDashboard(dashboard.data.guid);
            } else {
                dashboard = Ext.create('Ozone.data.Dashboard', {
                    name: widgetDef.data.title,
                    layoutConfig : {
                        xtype: 'container',
                        flex: 1,
                        height: '100%',
                        items: [],
                        paneType: 'fitpane',
                        widgets: []
                    }

                });

                self.dashboardContainer.saveDashboard(dashboard.data, 'create', function() {
                    self.dashboardContainer.addListener(OWF.Events.Dashboard.CHANGED, function() {
                        self.dashboardContainer.launchWidgets(widgetDef, true);
                        self.dashboardContainer.activeDashboard.config.locked = true;
                        self.dashboardContainer.saveDashboard(self.dashboardContainer.activeDashboard, 'update', function() {});
                        self.dashboardContainer.getBanner().disableAppComponentsBtn();
                    }, self.dashboardContainer, {/*delay:2000,*/ single:true});
                    self.dashboardContainer.activateDashboard(dashboard.data.guid);
                });

                notifyText =  Ozone.layout.DialogMessages.marketplaceWindow_WebappLaunchSuccessful;
            }
        } else {

            var dashboardSelectionPromise = self.dashboardContainer.selectDashboard();
            dashboardSelectionPromise.done(function() {
                self.dashboardContainer.launchWidgets(widgetDef, true);
            });

            notifyText =  Ozone.layout.DialogMessages.marketplaceWindow_LaunchSuccessful;
        }
        doLaunchCallback && doLaunchCallback();

        return notifyText;
    },

    registerWindowManager:function (window_manager) {
        this.windowManager = window_manager;
    }
};
