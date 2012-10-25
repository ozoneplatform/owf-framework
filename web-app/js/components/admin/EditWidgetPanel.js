Ext.define('Ozone.components.EditWidgetPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.editwidgetpanel', 'widget.Ozone.components.EditWidgetPanel'],
    layout: 'card',
    bodyCls: 'editpanel-body',
	
    initComponent: function() {
        this.addEvents('itemcreated', 'itemupdated', 'initialdataloaded');

        this.widgetStateHandler = Ozone.state.WidgetStateHandler.getInstance();

        OWF.Eventing.subscribe(this.channel, Ext.bind(this.handleSubscriptionEvent, this));

        this.launchConfig = OWF.Launcher.getLaunchData();
        if (this.launchConfig != null) {
            this.launchData = Ozone.util.parseJson(this.launchConfig);
        }
			
		this.widgetState = Ozone.state.WidgetState.getInstance({
			autoInit: true,
			onStateEventReceived: Ext.bind(this.handleStateEvent, this)
		});
		/*this.widgetState.addStateEventOverrides({
			events: ['beforeclose']
		});*/

        this.store.on('write', function(store, action, result, records, rs) {
            OWF.Eventing.publish(this.channel, {
                action: action,
                domain: this.domain,
                records: result
            })
        }, this);
		
        this.on('itemcreated', function(itemId) {
            this.recordId = itemId;
            OWF.Eventing.publish(this.channel, {
                action: 'created',
                id: itemId
            });
        }, this);
		
        this.on('itemupdated', function(itemId) {
            OWF.Eventing.publish(this.channel, {
                action: 'modified',
                id: itemId
            });
        }, this);
		
        this.on('afterrender', function(component, eOpts) {
            if (this.launchConfig != null) {
                if (!this.launchData.isCreate) {
                    this.store.load({
                        params: {
                            id: this.launchData.id
                        },
                        callback: function() {
                            this.record = this.store.getById(this.launchData.id);
                            this.recordId = this.record ? this.record.getId() : null;
                            this.fireEvent('initialdataloaded', this.record);
                            this.enableTabs();
                        },
                        scope: this
                    });
                }
            }
            else {
                this.record = {};
                this.fireEvent('initialdataloaded', this.record);
            }

            var tbarItems = [];
            for (var i = 0; this.items && i < this.items.getCount(); i++) {
                tbarItems.push({
                    xtype: 'button',
                    pressed: i == 0,
                    disabled: this.items.getAt(i).initDisabled,
            //        width: 70,
                    toggleGroup: 'editorTabs',
                    allowDepress: false,
                    text: this.items.getAt(i).title,
                    iconCls: this.items.getAt(i).iconCls,
                    icon: this.items.getAt(i).iconCls == undefined ? this.items.getAt(i).icon : undefined,
                    iconAlign: 'top',
                    scale: 'xlarge',
                    index: i,
                    handler: function(button, e) {
                        this.getLayout().setActiveItem(button.index);
                    },
                    scope: this
                });
            }

            this.addDocked([{
                itemId: 'editorToolbar',
                hidden: this.hideEditorToolbar,
                xtype: 'toolbar',
                cls: 'editor-tabs',
                dock: 'top',
                items: tbarItems,
                enableOverflow: true,
                listeners: {
                    afterlayout: function(cmp) {
                        //make height explicit so that height:100% works on children
                        cmp.setHeight(cmp.getHeight());
                    }
                }
            }])

        },this);
		
        this.callParent(arguments);
    },
    handleStateEvent: function(sender, msg) {	
        if (msg.eventName.indexOf("afterEventIntercept_") == -1) {
            // Confirm before closing if data has not been saved
            if (msg.eventName == "beforeclose") {
                this.widgetState.removeStateEventOverrides({
                    events: ['beforeclose'],
                    callback: Ext.bind(function() {
                        // close widget in callback
                        this.widgetState.closeWidget();
                    },this)
                });
            }
        } 
    },
    handleSubscriptionEvent: function(sender, msg) {
        if (msg.action == "delete" && msg.id == this.recordId)
            this.closeWidget();
    },
    closeWidget: function() {
        this.widgetStateHandler.handleWidgetRequest({
            fn: 'closeWidget',
            params: {
                guid: Ozone.getInstanceId()
            }
        });
    },
    enableTabs: function() {
        var tb = this.getDockedComponent('editorToolbar');
        for (var i = 0; tb.items && i < tb.items.getCount(); i++) {
            var button = tb.items.getAt(i);
            if (button) {
                button.setDisabled(false);
            }
        }
    }
});
