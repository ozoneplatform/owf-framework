Ext.define('Ozone.components.widget.WidgetBase', {

	mixins: {
		circularfocus: 'Ozone.components.focusable.CircularFocus'
	},

	dashboard: null,
	pane: null,

	//TODO remove this when, taskbar item doesn't extend widetpanel class
	isWidget: false,

	widgetStateContainer: null,

	// Handle state events
	stateEventChannelName: null,
	originalStateEvents: [],
	debugStateEvents: true,
	focusCls: 'x-focus',
	focusDelay: 200,

	overrides : {

		//show the focus frame around the
		//entire widget until focusedEl is blurred.
		//This function is specifically designed to
		//handle the case where focusedEl is an iframe.
		//It is assumed that focusedEl is currently focused
		showFocusFrame: function(focusedEl) {
			this.addCls('x-focus');
			this.focusShown = true;

			if (Ext.isIE) {
				focusedEl.on('blur', function() {
					this.removeCls('x-focus');
					this.focusShown = false;
				}, this);
			}
			else {

				/*
				 * if we could consistently listen 
				 * for iframe blur events, we would
				 * do that.  But in firefox iframes
				 * do not fire events.  The best
				 * solution I could come up wth is to
				 * listen for a focus on anything else.
				 */
				var eventListener = {
					handleEvent: Ext.bind(function(evt) {
						this.removeCls(this.focusCls);
						this.focusShown = false;

						document.removeEventListener('focus', eventListener, true);
						window.removeEventListener('blur', eventListener, false);
					}, this)
				};

				document.addEventListener('focus', eventListener, true);
				window.addEventListener('blur', eventListener, false);
			}
		},

		getIframeEl: function() {
			var iframeCmp = this.down('.widgetiframe');
			return iframeCmp ? iframeCmp.getEl() : null;
		},

		focus: function(selectText, delay, showFocusFrame, focusIframe) {
			// TODO: revisit when upgrading to a newer version of ExtJS
			var me = this,
				focusEl;

			if (delay) {
				if (!me.focusTask) {
					me.focusTask = Ext.create('Ext.util.DelayedTask', me.focus);
				}
				me.focusTask.delay(Ext.isNumber(delay) ? delay : 10, null, me, [selectText, false, showFocusFrame, focusIframe]);
				return me;
			}

			if (me.rendered && !me.isDestroyed) {
				// getFocusEl could return a Component.
				focusEl = me.getFocusEl();
				// focusEl.focus(); // commented out because in IE window/panel get a focus when it shouldn't
				if (focusEl.dom && selectText === true) {
					focusEl.dom.select();
				}

				// Focusing a floating Component brings it to the front of its stack.
				// this is performed by its zIndexManager. Pass preventFocus true to avoid recursion.
				if (me.floating) {
					me.toFront(true);
				}
			}
			
			if(focusIframe === true) {
				var iframe = this.getIframeEl();

				if(iframe) {
					iframe.focus();
					this.forceIframeFocus();

					if (showFocusFrame) 
						this.showFocusFrame(iframe);
				}

			}

			return me;
		},

		forceIframeFocus: (function() {
			var count = 0;

			return function() {
				var me = this;

				if(this.iframeReady) {
					gadgets.rpc.call(this.getIframeId(), '_focus_widget_window');

					if(me.focusIframeTask) {
						me.focusIframeTask.cancel();
					}
				}
				else {
					if (!me.focusIframeTask) {
						me.focusIframeTask = Ext.create('Ext.util.DelayedTask', me.forceIframeFocus, me);
					}
					count += 1;
					// give widget 30 seconds to render
					if(count * me.focusDelay <= 30 * 1000) {
						me.focusIframeTask.delay(me.focusDelay);
					}
					else {
						me.focusIframeTask.cancel();
					}
				}
			}
		})(),
		
		/**
		 * Create, hide, or show the header component as appropriate based on the current config.
		 * @private
		 * @param {Boolean} force True to force the the header to be created
		 */
		updateHeader: function(force) {
			var me = this,
							header = me.header,
							title = me.title,
							tools = me.tools;

			/*
			 * Turns Ext.panel.Tool definitions
			 * into OWF widgettools.
			 * This needs to be performed
			 * before the tool is rendered in
			 * order to be successful.
			 * This step is performed to 
			 * ensure that automatically added
			 * tools get our keyboard focus
			 * properties
			 */
			Ext.each(tools, function(tool, index, toolsArr) {
				 if (tool.xtype === 'tool' && !tool.rendered) {
					newTool = {};
					Ext.copyTo(newTool, tool, ['type', 'expandType', 'handler', 'scope']);
					newTool.xtype = 'widgettool';
					newTool = Ext.ComponentManager.create(newTool);
					toolsArr[index] = newTool;

					//setting shortcut variables to new tool objects
					if (me.collapseTool === tool)
						me.collapseTool = newTool;
					if (me.expandTool === tool)
						me.expandTool = newTool;
				 }
			});

			if (!me.preventHeader && (force || title || (tools && tools.length))) {
				if (!header) {
					header = me.header = Ext.create('Ozone.components.panel.WidgetHeader', {
						title       : title,
						orientation : (me.headerPosition == 'left' || me.headerPosition == 'right') ? 'vertical' : 'horizontal',
						dock        : me.headerPosition || 'top',
						textCls     : me.headerTextCls,
						icon        : me.icon,
						iconCls     : me.iconCls,
						baseCls     : me.baseCls + '-header',
						tools       : tools,
						ui          : me.ui,
						indicateDrag: me.draggable,
						border      : me.border,
						frame       : me.frame && me.frameHeader,
						ignoreParentFrame : me.frame || me.overlapHeader,
						ignoreBorderManagement: me.frame || me.ignoreHeaderBorderManagement,
						singleton   : me.singleton,
						listeners   : me.collapsible && me.titleCollapse ? {
							click: me.toggleCollapse,
							scope: me
						} : null
					});
					me.addDocked(header, 0);

					// Reference the Header's tool array.
					// Header injects named references.
					me.tools = header.tools;
				}
				header.show();
				me.initHeaderAria();
			} else if (header) {
				header.hide();
			}
		},
		insertTool: function(tool, pos) {
            if (this.headers == null && this.header != null) {
                    this.headers = [this.header];
                    this.header.insertTool(tool, pos);

            }
            else if(this.headers) {
                //insert tool into all headers
                for (var i = 0 ; i < this.headers.length ; i++) {
                        if (this.headers[i] != null) {
                                this.headers[i].insertTool(tool, pos);
                        }
                }
                // recalculate layout
                this.doComponentLayout();
            }
		},
		updateTool: function(tool) {
			if (this.headers == null && this.header != null) {
					this.headers = [this.header];
			}
			//insert tool into all headers
			for (var i = 0 ; i < this.headers.length ; i++) {
					if (this.headers[i] != null) {
					var index = this.headers[i].items.indexOfKey(tool.itemId);
					if (index != null && index > -1) {
							this.headers[i].remove(tool.itemId);
							this.headers[i].insert(index,tool)
					}
				}
			}
			// recalculate layout
			this.doComponentLayout();
		},
		removeTool: function(toolId) {
			if (this.headers == null && this.header != null) {
				this.headers = [this.header];
			}
			//insert tool into all headers
			for (var i = 0 ; i < this.headers.length ; i++) {
				if (this.headers[i] != null) {
					this.headers[i].remove(toolId);
				}
			}
			// recalculate layout
			this.doComponentLayout();
		},

		handleStateEvent: function(widgetAction, eventName) {
			var returnValue = widgetAction === "listen" ? true : false,
				config = {
						eventKey: guid.util.guid(),
						eventName: eventName
				};

			this.stateEventChannelName = this.stateEventChannelName ? 
				this.stateEventChannelName : this.widgetStateContainer.stateChannelPrefix + this.uniqueId;
			
			this.widgetStateContainer.eventingContainer.publish(this.stateEventChannelName, config);
			return returnValue;
		},

		// private
		initState: function() {
			if (Ext.state.Manager) {
				var id = this.getStateId();
				if (id != null) {

					var state = null;

					var sp = Ext.state.Manager.getProvider();
					if (sp.getByStore != null && typeof sp.getByStore == 'function') {
						state = sp.getByStore(this.dashboardGuid, id);
					}
					else {
						state = Ext.state.Manager.get(id);
					}

					if (state) {
						if (this.fireEvent('beforestaterestore', this, state) !== false) {
							this.applyState(Ext.apply({}, state));
							this.fireEvent('staterestore', this, state);
						}
					}
				}
			}
		},

		//override to allow numbers to be used for stateId
		saveState: function() {
			if (Ext.state.Manager && this.stateful !== false) {
				var id = this.getStateId();
				if (id != null) {
					var state = this.getState();
					if (this.fireEvent('beforestatesave', this, state) !== false) {
						Ext.state.Manager.set(state.uniqueId, state);
						this.fireEvent('statesave', this, state);
					}
				}
			}
		},
		
		onStateChange: function(){
			var me = this,
				delay = me.saveDelay;

			if (delay > 0 && !me.debugStateEvents) {
				if (!me.stateTask) {
						me.stateTask = Ext.create('Ext.util.DelayedTask', me.saveState, me);
				}
				me.stateTask.delay(me.saveDelay);
			} else {
				me.saveState();
			}
		}

	},

	beforeInitComponent: function() {
		this.createFocusCatch();
	},

	afterInitComponent: function() {
		this.addEvents("beforeclose","close");
		this.originalStateEvents = this.events;

		this.on({
			activate: this.onWidgetActivate,
			deactivate: this.onWidgetDeactivate,
			afterrender: {
				fn: this.onWidgetAfterRender,
				scope: this
			}
		});

		if(this.isWidget) {
			this.on({
				beforeDestroy: this.onBeforeWidgetDestroy,
				destroy: this.onWidgetDestroy,
				render: this.onWidgetRender
			});
		}
	},

	onWidgetActivate: function() {
		this.active = true;
		this.removeCls(this.inactiveCls);
		this.removeClsWithUI([this.inactiveCls]);

		// if(!this.getEl().contains(document.activeElement)) {
		// 	this.focus(false, false, false, true);
		// }

		//propagate to header
		if (!this.preventHeader) {
			if (this.header) {
				this.header.activate();
			}
			else {
				this.on({
					afterrender: {
						fn: function(cmp) {
							this.header.activate();
						},
						scope: this,
						single: true
					}
				});
			}
		}
	},

	onWidgetDeactivate: function() {
		this.active = false;
		this.addCls(this.inactiveCls);
		this.addClsWithUI([this.inactiveCls]);

		//propagate to header
		if (!this.preventHeader) {
			if (this.header) {
				this.header.deactivate();
			}
			else {
				this.on({
					afterrender: {
						fn: function(cmp) {
							this.header.deactivate();
						},
						scope: this,
						single: true
					}
				});
			}
		}
	},

	onWidgetRender: function() {
		var user = Ozone.config.user;
		Ozone.metrics.logWidgetRender(user.id, user.displayName, Ozone.config.metric.url, this);
	},

	onWidgetAfterRender: function() {
		var dom,
			hasFocusListener = false,
			hasBlurListener = false,
			me = this,
			E = Ext,
			captureTrueOpts = {
				capture: true
			};


		if(!me.header) {
			return;
		}

		if(me.xtype === "widgetwindow" || me.xtype === "widgetportlet") {
			me.mon(me.getEl(), 'mousedown', function( e, t, eOpts) {

				//get close button
				var closeEl = null;
				if (me.header != null && me.header.tools != null) {
					if (me.header.tools['close'] != null) {
						closeEl = me.header.tools['close'].toolEl;
					}
				}

				//only update active widget if this widget is not being closed via close button
				if (closeEl == null || t !== closeEl.dom) {
					this.dashboard.updateActiveWidget(this, true);
                                        if(me.xtype === "widgetwindow") {
                                            this.focus(undefined, undefined, undefined, true);
                                        }
				}
			}, me);
		}

		dom = me.header.getEl().dom;

		// function headerFocus() {

		//    var tabPanel,
		//        dashboard;

		//  //only activate the widget if the focus event was not the result of a toolclick
		//  if (!me.wasToolClicked()) {
		//    if(me.card) {
		//        dashboard = E.getCmp(me.card.dashboardGuid);
		//          tabPanel = dashboard.getTabPanel();
		//          tabPanel.setActiveTab(me);
		//        dashboard.updateActiveWidget(me, true);
		//    }
		//    else {
		//         dashboard = E.getCmp(me.dashboardGuid);
		//         dashboard.updateActiveWidget(me, true);
		//         if(me.floating) {
		//             me.toFront(true);
		//         }
		//    }
		//  }
		//    addBlurListener();
		// }

		// function headerBlur() {
		//    // add header focus listeners when focus goes out of header
		//    if(!me.header.getEl().contains(document.activeElement)) {
		//        addFocusListener();
		//    }
		// }

		// function addFocusListener() {
		//    if(hasFocusListener)
		//        return;

		//    hasFocusListener = true;
		//    hasBlurListener = false;

		//    if (E.isIE) {
		//        dom.attachEvent('onfocusin', headerFocus);
		//        dom.detachEvent('onfocusout', headerBlur);
		//    }
		//    else {

		//        //just in case make sure there is no listener already attached
		//        me.mun(me.header.getEl(), 'focus', headerFocus, me, captureTrueOpts);
		//        me.mon(me.header.getEl(), 'focus', headerFocus, me, captureTrueOpts);

		//        me.mun(me.header.getEl(), 'blur', headerBlur, me, captureTrueOpts);
		//    }
		// }

		// function addBlurListener() {
		//    if(hasBlurListener)
		//        return;

		//    hasFocusListener = false;
		//    hasBlurListener = true;

		//    if (E.isIE) {
		//        dom.attachEvent('onfocusout', headerBlur);
		//        dom.detachEvent('onfocusin', headerFocus);
		//    }
		//    else {

		//        //just in case make sure there is no listener already attached
		//        me.mun(me.header.getEl(), 'blur', headerBlur, me, captureTrueOpts);
		//        me.mon(me.header.getEl(), 'blur', headerBlur, me, captureTrueOpts);
		// as
		//        me.mun(me.header.getEl(), 'focus', headerFocus, me, captureTrueOpts);
		//    }
		// }

		// //if it doesn't have a dashboardGuid, it isn't really
		// //a widget (its probably a taskbar entry)
		// if (me.dashboardGuid || (me.card && me.card.dashboardGuid)) {
		//    addFocusListener();
		// }
	},

	/*
	 * fix memory leak
	 * in Firefox.  FF memory compartments
	 * are not cleaned up when the corresponding
	 * iframe is destroyed unless the src is first
	 * changed to about:blank, and then the iframe
	 * destruction is deferred
	 */
	onBeforeWidgetDestroy: function(cmp) {
		var iframe = cmp.getComponent('widgetIframe');

		if (iframe && !iframe.isSrcCleared()) {
			iframe.clearSrc();
			Ext.defer(cmp.destroy, 100, cmp);

			return false;
		}
	},

	onWidgetDestroy: function(cmp) {
		
		cmp.dashboard.updateActiveWidget();

		Ext.state.Manager.clear({
			uniqueId: cmp.id,
			paneGuid: cmp.paneGuid
		});
		var launchMenu = Ext.getCmp('launchMenuWindow');
		if (launchMenu != null) {
			var groupingDataView = launchMenu.down('#groupingdataview');
			if (groupingDataView) {
				groupingDataView.enableItem(cmp.widgetGuid);
			}
			var infodataview = launchMenu.down('#infodataview');
			if (infodataview) {
				infodataview.enableItem(cmp.widgetGuid);
			}
		}
	},

	//override to allow numbers to be used for stateId
	getStateId: function() {
		if (this.stateId != null) {
			return this.stateId;
		}
		else {
			return ((/^(ext-comp-|ext-gen)/).test(String(this.id)) ? null : this.id);
		}
	},

	purgeListener: function(eventName) {
		var event = this.events[eventName];
		if (typeof event == 'object') {
			event.clearListeners();
		}
	},

	restoreListener: function(eventName) {
		var event = this.originalStateEvents[eventName];
		if (typeof event == 'object') {
			this.events[eventName] = event;
		}
	},

	getCurrentState: function() {
		var size = this.getSize(),
			state = this.getState();

		// use actual width and height if widget is maximized
		if(this.maximized) {
			state.height = size.height;
			state.width = size.width;
		}
		return state;
	},

	getIframeId: function() {
        var iframeEl = this.getIframeEl();
        if (iframeEl != null) {
		  return iframeEl.id;
        }
        else {
            return null;
        }
	},

	wasToolClicked: function() {
		var returnValue = false;

		//check header tools to see if any tool reports they were clicked
		if (this.header != null & this.header.toolClicked) {
			returnValue = true;
		}

		return returnValue;
	},

	getFirstFocusableElement: function() {
		var header = this.getHeader();
		if (header != null) {
			return header.titleCmp.getEl()
		}
	},

	createFocusCatch: function() {
		if (!this.dockedItems) this.dockedItems = [];

		//append a focus-catch. It is a docked item so that
		//any elements added to the items array later on still
		//come before it int he tab order
		this.dockedItems.push({
			xtype: 'focuscatch',
			itemId: 'focusCatch',
			dock: 'bottom',
			listeners: {
				afterrender: {
					fn: function(cmp) {
						cmp.mon(cmp.getEl(), 'focus', function() {
								this.showFocusFrame(cmp.getEl());
						}, this);
					},
					scope: this
				}
			}
		});

		//manually mix in CircularFocus since it is too late in obj init
		//to use the Ext mixin property
		//Ext.applyIf(this, new Ozone.components.focusable.CircularFocus());

		this.on('afterrender', function(cmp) {
			cmp.setupFocus(
				this.getFirstFocusableElement(),
				this.getComponent('focusCatch').getEl()
			);
		});
	}
});
