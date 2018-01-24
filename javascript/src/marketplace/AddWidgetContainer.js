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
    this.launchStackChannelName = "_LAUNCH_STACK_CHANNEL";
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

        this.eventingContainer.registerHandler(this.launchStackChannelName, function (sender, msg) {
            var me = this;

            return scope.launchStack(Ozone.util.parseJson(sender), Ozone.util.parseJson(msg), function (result) {
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
            animTargetX = "128px";
            animTargetBtn = "appComponentsBtn";
        }
        else if (listingType === "stack") {
            animTargetX = "32px";
            animTargetBtn = "myAppsBtn";
        }

        // fallbackToolTipText is only used if animations are disabled
        var visualizeAddition = function(fallbackToolTipText) {
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
                        width: btn.btnEl.getHeight() + 'px',
                        height: btn.btnEl.getHeight() + 'px'
                    });
            }
            else {
                btn.blink();

                if (fallbackToolTipText) {
                    var tip = Ext.create('Ext.tip.ToolTip', {
                        html: fallbackToolTipText,
                        anchor: 'left',
                        target: animTargetBtn,
                        cls: 'focusTooltip',
                        listeners: {
                            hide: function () {
                                tip.destroy();
                            }
                        }
                    });

                    tip.show();
                }

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
            content:{
                addExternalStackToUser:true,
                guid:stackUuid
            },
            load: function (response, ioArgs) {
                var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

                $.pnotify({
                    title: Ozone.layout.DialogMessages.added,
                    text: "The application was successfully added.",
                    type: 'success',
                    addclass: "stack-bottomright",
                    stack: stack_bottomright,
                    history: false,
                    sticker: false,
                    icon: false
                });

                addStackCallback && addStackCallback("The application has been added successfully from AppsMall.");
                self.dashboardContainer.refreshAppComponentsView();
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

        var doLaunch = false,
            baseUrl, id, visualizeAddition;

        if(config.widgetsJSON) {
            baseUrl = config.widgetsJSON.baseUrl;
            id = config.widgetsJSON.itemId;
            visualizeAddition = $.noop;
        }
        else {
            baseUrl = config.baseUrl;
            id = config.data.id;
            doLaunch = config.doLaunch;
            visualizeAddition = this.getlistingVisualizer(sender, config, marketplaceCallback, "widget");
        }

        this.processMarketplaceWidgetData(baseUrl, id, doLaunch, visualizeAddition, marketplaceCallback);
    },

    processMarketplaceWidgetData: function(marketplaceUrl, widgetId, doLaunch, addWidgetCallback, doLaunchCallback) {
        var self = this;
        Ozone.util.Transport.send({
            url: marketplaceUrl + "/relationship/getOWFRequiredItems",
            method: "POST",
            content: {
                id: widgetId,
                accessAlertShown: true  //avoid the access alert in older marketplaces
            },
            onSuccess: function(jsonData) {
                var widgetListJson = [], data = jsonData.data;
                for (var i = 0, len = data.length; i < len; i++) {
                    var serviceItem = data[i];

                    // widget requires stacks, need to refresh dashboards
                    if(serviceItem.owfProperties && serviceItem.owfProperties.stackDescriptor) {
                        self.dashboardContainer.dashboardsNeedRefresh = true;
                    }

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
                        widgetListJson.push(self.createOwfWidgetJson(serviceItem, widgetId));
                    }
                }

                if (widgetListJson.length > 0) {
                    // OZP-476: MP Synchronization
                    // Added the URL of the Marketplace we're looking at to the
                    // JSON we send to the widget controller.
                    self.submitWidgetList(widgetListJson, marketplaceUrl, doLaunch, addWidgetCallback, doLaunchCallback);
                }
            },
            onFailure: function(json) {
                Ext.Msg.alert("Error", "Error has occurred while adding App Components from AppsMall");

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
            imageUrlMedium: serviceItem.imageMediumUrl || serviceItem.imageLargeUrl,
            imageUrlSmall: serviceItem.imageSmallUrl,
            widgetGuid: serviceItem.uuid,
            widgetUrl: serviceItem.launchUrl,
            widgetVersion: serviceItem.versionName,
            isSelected: widgetId == serviceItem.id, // true if this is the widget the user selected and not a dependent widget
            isExtAjaxFormat: true
        };
        if (serviceItem.ozoneAware) {
            // Get the widget properties from the store info
            widgetJson.singleton = serviceItem.owfProperties.singleton;
            widgetJson.visible = serviceItem.owfProperties.visibleInLaunch;
            widgetJson.background = serviceItem.owfProperties.background;
            widgetJson.mobileReady = serviceItem.owfProperties.mobileReady;
            widgetJson.height = serviceItem.owfProperties.height;
            widgetJson.width = serviceItem.owfProperties.width;
            widgetJson.universalName = serviceItem.owfProperties.universalName || "";
            widgetJson.descriptorUrl = serviceItem.owfProperties.descriptorUrl || "";
            widgetJson.widgetTypes = [serviceItem.owfProperties.owfWidgetType];
            widgetJson.listingIntents = serviceItem.intents;
        } else {
            // For web app listings, create some default info
            widgetJson.singleton = false;
            widgetJson.visible = false;
            widgetJson.background = false;
            widgetJson.mobileReady = false;
            widgetJson.height = 200;
            widgetJson.width = 200;
            widgetJson.universalName = "";
            widgetJson.descriptorUrl = "";
            widgetJson.widgetTypes = ["fullscreen"];
            widgetJson.listingIntents = [];
        }

        if (directRequired.length > 0) {
            widgetJson.directRequired = directRequired;
        }
        return widgetJson;
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
                widgets: Ext.JSON.encode(widgetList)
            },
            load:function (response, ioArgs) {

                // var widgetLauncher = Ext.getCmp('widget-launcher');
                // widgetLauncher.loadLauncherState();

                var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};

                // AML-2924 - This will display the dashboard switcher and add a listener to launch the widget if
                // requested

                var result = Ext.JSON.decode(response),
                    notifyTitle = Ozone.layout.DialogMessages.added,
                    notifyText;

                if (result.success) {
                    var widgetGuid = result.data[0].widgetGuid,
                        widgetDefs;

                    self.dashboardContainer.refreshAppComponentsView().then(function () {
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
                                notifyTitle = 'Success';
                            } else {
                                notifyText = "The App Component was successfully added.";
                                addWidgetCallback && addWidgetCallback(widgetDefs.get(0).get('name') + ' has been added successfully from AppsMall.');
                            }
                        } else {
                            // Failure message
                            notifyText = Ozone.layout.DialogMessages.marketplaceWindow_AddWidget;
                        }
                        //Display the message
                        notifyText && $.pnotify({
                            title: notifyTitle,
                            text: notifyText,
                            type: 'success',
                            addclass: "stack-bottomright",
                            stack: stack_bottomright,
                            history: false,
                            sticker: false,
                            icon: false
                        });

                        self.dashboardContainer.loadMask.hide();
                    });

                } else {
                    notifyText = Ozone.layout.DialogMessages.marketplaceWindow_AddWidget;
                    $.pnotify({
                        title: notifyTitle,
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
                    type: 'fullscreen',
                    layoutConfig : {
                        xtype: 'container',
                        flex: 1,
                        height: '100%',
                        items: [],
                        paneType: 'fitpane',
                        widgets: []
                    },
                    stack: {
                        "name": widgetDef.data.title,
                        "description": widgetDef.get("description"),
                        "owner": null //explicitly null owner so the backend doesn't auto-assign
                    },
                    publishedToStore: true  //allow the user to get their own copy of the
                                            //dashboard
                });

                self.dashboardContainer.saveDashboard(dashboard.data, 'create', function(json) {
                    self.dashboardContainer.addListener(OWF.Events.Dashboard.CHANGED, function() {
                        self.dashboardContainer.launchWidgets(null, widgetDef, true);
                        self.dashboardContainer.activeDashboard.config.locked = true;
                        self.dashboardContainer.saveDashboard(self.dashboardContainer.activeDashboard, 'update', function() {});
                        self.dashboardContainer.getBanner().disableAppComponentsBtn();
                        self.dashboardContainer.getBanner().getUserMenuBtn().disableAdminMenuItem();
                        self.dashboardContainer.getBanner().getUserMenuBtn().disableMetricsMenuItem();
                    }, self.dashboardContainer, {/*delay:2000,*/ single:true});
                    self.dashboardContainer.activateDashboard(json.guid);
                });

                notifyText =  Ozone.layout.DialogMessages.marketplaceWindow_WebappLaunchSuccessful;
            }
        } else {
            var dashboardSelectionPromise = self.dashboardContainer.selectDashboard();
            dashboardSelectionPromise.done(function(evt, dashboardId) {
                var model = OWF.Collections.AppComponents.findWhere({widgetGuid: widgetDef.data.widgetGuid});
                self.dashboardContainer.launchWidgets(evt, model, true, false);
            });

            notifyText =  Ozone.layout.DialogMessages.marketplaceWindow_LaunchSuccessful;
        }
        doLaunchCallback && doLaunchCallback();

        return notifyText;
    },

    registerWindowManager:function (window_manager) {
        this.windowManager = window_manager;
    },

    launchStack: function(sender, config, launchedCallback) {
        var me = this;

        me.dashboardContainer.loadMask.show();

        var findStack = function(stackContext) {
            var result = null;

            for (var i = 0, len = me.dashboardContainer.stackStore.getCount(); i < len; i++) {
                var model = me.dashboardContainer.stackStore.getAt(i).data;

                if (model.stackContext &&
                    model.stackContext === stackContext) {
                    result = model;
                    break;
                }
            }

            return result;
        };

        var onStackLoaded = function(stackModel, activate) {
            if (activate) {
                me.dashboardContainer.activateDashboard(null, false,
                    stackModel.stackContext);
            }

            // Handle stack with multiple pages
            if (stackModel.dashboards && stackModel.dashboards.length > 1) {
                setTimeout(function() {
                    me.dashboardContainer.showMyAppsWind().then(
                        function(appsWindow) {
                            appsWindow.focusActiveDashboard();

                            var stack_bottomright = {
                                "dir1": "up", "dir2": "left",
                                "firstpos1": 25, "firstpos2": 25
                            };

                            $.pnotify({
                                title: Ozone.ux.DashboardMgmtString.selectDashboard,
                                text: Ozone.layout.DialogMessages.marketplaceWindow_StackLaunchSelectPage,
                                type: 'success',
                                addclass: "stack-bottomright",
                                stack: stack_bottomright,
                                history: false,
                                sticker: false,
                                icon: false
                            });
                        }
                    );
                }, activate ? 200 : 0);
            }

            me.dashboardContainer.loadMask.hide();
            launchedCallback && launchedCallback(true);
        }

        var targetStack = findStack(config.stackContext);

        if (targetStack) {
            onStackLoaded(targetStack, true);
        } else {
            // Reload from server and then select target stack
            me.dashboardContainer.reloadDashboards(function() {
                // Check if the desired stack was found
                targetStack = findStack(config.stackContext);

                if (targetStack) {
                    // The stack was already activated by the reload above
                    onStackLoaded(targetStack, false);
                } else {
                    me.dashboardContainer.loadMask.hide();
                    launchedCallback && launchedCallback(false);
                    Ozone.Msg.alert(Ozone.layout.DialogMessages.error,
                                    Ozone.util.ErrorMessageString.stackNotFound,
                                    null, null, null);
                }
            }, config.stackContext /* Will activate if found after load */);
        }
    }
};
