Ext.define('Ozone.components.widget.WidgetWindow', {
    extend: 'Ext.window.Window',
    alias: ['widget.widgetwindow', 'widget.Ozone.components.widget.WidgetWindow'],
    
    mixins: {
        widget: 'Ozone.components.widget.WidgetBase'
    },
    plugins: [
        new Ozone.components.keys.KeyMoveable(),
        new Ozone.plugins.WidgetWindow()
    ],
    
    floating: {
        shadow: false
    },
    
    hideMode: 'offsets',
    inactiveCls: 'inactive',

    maximizable: true,
    minimizable: true,
    constrain: !!Ext.isIE,
    constrainHeader: !Ext.isIE,
    
    enableDeactivateShim: false,
    debugDeactivateShim: false,
    deactivateShim: null,
    initialMouseOverActivate: true,
    isMouseOverActivateFlag: false,
    mouseOverActivateDelay: 1000,
    widgetStateContainer: null,
    closable: true,
    widgetIframeDelay: 200,

    // show actual widget while dragging
    liveDrag: true,

    onEsc: Ext.emptyFn, //no close on ESC, we have alt+shift+W for that
    
    initComponent: function(){

        if(!this.manager) {
            this.manager = Ext.WindowMgr;
        }

        this.beforeInitComponent();

        this.callParent(arguments);

        this.on({
            activate: this.onActivate,
            deactivate: this.onDeActivate,
            maximize: this.onMaximize,
            restore: this.onRestore,
            afterrender: {
                fn: this.onAfterRender,
                scope: this
            }
        });
        
        //override functions
        Ext.apply(this,this.mixins.widget.overrides);
        this.afterInitComponent();

        if(!this.headers) {
            this.headers = [];
        }

        this.on('toolbaritem:created', function (toolbaritem) {
            this.headers.push( toolbaritem.header );
        });
    },

    onAfterRender: function () {
        this.headers.push(this.header);
        if (this.initialMouseOverActivate) {
            this.addMouseOverActivate();
        }
    },
    
    bringToFront: function(){
        this.manager.bringToFront(this);
    },
    
    addMouseOverActivate: function(){
        if (!this.isMouseOverActivateFlag) {
            this.el.on('mouseover', this.mouseOver, this);
            this.el.on('mouseleave', this.mouseLeave, this);
        }
        this.isMouseOverActivateFlag = true;
    },
    
    removeMouseOverActivate: function(){
        if (this.isMouseOverActivateFlag) {
            this.el.un('mouseover', this.mouseOver, this);
            this.el.un('mouseleave', this.mouseLeave, this);
        }
        if (this.mouseOverDeferredId != null) {
          clearTimeout(this.mouseOverDeferredId);
          this.mouseOverDeferredId = null;
        }
        this.isMouseOverActivateFlag = false;
    },

    mouseOver: function(e, t, options) {
        if (this.isMouseOverActivateFlag 
            && OWF.Container.DragAndDrop.isDragging()
                && this.mouseOverDeferredId == null) {

            this.mouseOverDeferredId =  Ext.defer(function() {
                if (OWF.Container.DragAndDrop.isDragging()) {
                    this.bringToFront();
                }
                this.mouseOverDeferredId = null;

            }, this.mouseOverActivateDelay, this);
        
        }
    },

    mouseLeave: function(e, t, options) {
        if (this.mouseOverDeferredId != null) {
            clearTimeout(this.mouseOverDeferredId);
            this.mouseOverDeferredId = null;
        }
    },
    
    onMaximize: function(cmp) {
        cmp.resizer.disable();
    },
    
    onRestore: function(cmp) {
        cmp.resizer.enable();
        if (cmp.focusOnRestore)
            cmp.focusOnRestore.focus();
    },

    onActivate: function(cmp){
        if (this.enableDeactivateShim) {
            if (this.deactivateShim) {
                //just hide the shim
                this.deactivateShim.hide();
            }
        }
    },
    
    onDeActivate: function(cmp){
        if (this.enableDeactivateShim) {
            var box = this.body;
            if (!this.deactivateShim) {
                var shimDiv = document.createElement('div');
                shimDiv.id = 'ext-deactivate-shim-' + this.getId();
                shimDiv.style.display = 'block';
                shimDiv.style.backgroundColor = 'black';

                this.deactivateShim = Ext.create('Ext.Layer', {
                    id: 'ext-deactivate-shim-' + this.getId(),
                    shadow: false,
                    useDisplay: true,
                    constrain: false
                }, shimDiv);
                
                //set opacity
                if (this.debugDeactivateShim) {
                    this.deactivateShim.setOpacity(0.5);
                }
                else {
                    this.deactivateShim.setOpacity(0);
                }

                this.deactivateShim.setZIndex(parseInt(this.el.getStyle('z-index')));

                //insert into widget
                box.insertSibling(this.deactivateShim);
            }

            this.deactivateShim.setHeight(box.getHeight());
            this.deactivateShim.setWidth(box.getWidth());
            this.deactivateShim.setTop(box.getTop(true));
            this.deactivateShim.setLeft(box.getLeft(true));
            this.deactivateShim.setRight(box.getRight(true));
            this.deactivateShim.setBottom(box.getBottom(true));

            this.deactivateShim.show();
        }
    },
    
    stateEvents: ['bodyresize', 'show', 'minimize', 'maximize', 'activate', 'deactivate', 'titlechange'],

    getState: function(){

        var o = {
            universalName: this.universalName,
            widgetGuid: this.widgetGuid,
            uniqueId: this.uniqueId,
            dashboardGuid: this.dashboardGuid,
            paneGuid: this.paneGuid,
            name: this.title ? this.title : this.name,
            active: this.active ? true : false,
            x: this.restorePos ? this.restorePos[0] : this.x,
            y: this.restorePos ? this.restorePos[1] : this.y,
            minimized: this.minimized ? true : false,
            maximized: this.maximized ? true : false,
            pinned: false,
            collapsed: false,
            columnPos: 0,
            buttonId: this.buttonId ? this.buttonId : null,
            buttonOpened: this.buttonOpened ? this.buttonOpened : false,
            region: "none",
            statePosition: this.statePosition,
            intentConfig: this.intentConfig,
            launchData: this.launchData,
            singleton: this.singleton ? this.singleton : false,
            floatingWidget: this.floatingWidget ? this.floatingWidget : false,
            background: this.background ? this.background : false
        };
        if (this.rendered) {
            var zIndex = null;
            var height = null;
            var width = null;
            var box = this.getBox();

            if (!this.destroying && !this.isDestroyed) {
                zIndex = this.el.getZIndex();
                height = box.height;
                width = box.width;
            }
            else {
                height = this.height;
                width = this.width;
            }
            Ext.apply(o, {
                zIndex: Ext.isNumber(zIndex) && zIndex > 0 ? zIndex : this.zIndex != null ? this.zIndex : 0,
                height: this.restoreSize ? this.restoreSize.height : height,
                width: this.restoreSize ? this.restoreSize.width : width,
                x: box.x,
                y: box.y
            });
        }
        else {
            Ext.apply(o, {
                zIndex: this.zIndex != null ? this.zIndex : 0,
                height: this.restoreSize ? this.restoreSize.height : -1,
                width: this.restoreSize ? this.restoreSize.width : -1
            });
        }
        return o;
    },

    applyState: function(state){
    
        this.setSize(state.width, state.height);
        this.setPosition(state.x, state.y);

        this.title = state.name;
        
        // This is a problem:  In firefox you have to assign the
        // variable min or the first if statement will fail.
        // you cant do if(state.minimized). Not sure why yet
        this.minimized = state.minimized;
        this.maximized = state.maximized;
        
    },

    toggleMaximize: function(event) {
        if (!event.getTarget('.'+this.baseCls + '-header-text') && !event.getTarget('titleEditor')) {
            return this[this.maximized ? 'restore': 'maximize']();
        }
    },

    // The following two functions are overridden here to comment out
    // specific lines that make the desktop more Flex friendly.
    
    // private
//    animShow: function(){
//        this.proxy.show();
//        this.proxy.setBox(this.animateTarget.getBox());
//        this.proxy.setOpacity(0);
//        var b = this.getBox();
//        //      this.el.setStyle('display', 'none');
//        this.proxy.shift(Ext.apply(b, {
//            callback: this.afterShow.bind(this, [true], false),
//            scope: this,
//            easing: 'easeNone',
//            duration: 0.25,
//            opacity: 0.5
//        }));
//    },
    
    /**
     * Fits the window within its current container and automatically replaces
     * the {@link #maximizable 'maximize' tool button} with the 'restore' tool button.
     * Also see {@link #toggleMaximize}.
     * @return {Ext.window.Window} this
     */
    maximize: function() {
        var me = this;

        if (!me.maximized) {
            me.expand(false);
            if (!me.hasSavedRestore) {
                me.restoreSize = me.getSize();
                me.restorePos = me.getPosition(true);
            }
            if (me.maximizable) {
                var maxTool = this.header.tools.maximize;
                me.tools.restore.show();

                if (maxTool.isFocused()) 
                    this.tools.restore.focus();
            
                //focusOnRestore should be the tool that
                //keyboard focus goes to when the window is
                //restored
                this.focusOnRestore = maxTool;

                maxTool.hide();
            }

            me.maximized = true;
            me.el.disableShadow();

            if (me.dd) {
                me.dd.disable();
            }
            if (me.collapseTool) {
                me.collapseTool.hide();
            }
            me.el.addCls(Ext.baseCSSPrefix + 'window-maximized');

            //don't do so flex widgets don't reload
            if (!Ext.isGecko) {
              me.container.addCls(Ext.baseCSSPrefix + 'window-maximized-ct');
            }

            me.setPosition(0, 0);
            me.fitContainer();
            me.fireEvent('maximize', me);
        }
        return me;
    },

    minimize: function() {
        var me = this;

        if (!me.minimized) {
            me.expand(false);
            if (!me.hasSavedRestore && !me.maximized) {
                me.restoreSize = me.getSize();
                me.restorePos = me.getPosition(true);
            }
//            if (me.minimizable) {
//                me.tools.minimize.hide();
//                //me.headers[0].tools.restore.focus();
//            }
            me.minimized = true;

            //this.focusOnRestore = this.header.tools.minimize;
            this.focusOnRestore = null; //on restore from minimize, focus the widget body

            me.fireEvent('minimize', me);

            //wait until after we fire the event
            //to hide so that we don't mess up focus
            me.hide();
        }
        return me;
    },

    restore: function () {
        
        //check to see if the restore button has focus
        //this cannot be done in a restore
        //listener because the focus may have
        //already changed at that point
        if (!this.tools.restore.isFocused()) this.focusOnRestore = null;
            
        this.callParent(arguments);
    },

    restoreFromMinimize: (function() {
        var updateWidget = function() {
            if (this.minimized) {
                if (this.minimizable) {
                    this.tools.minimize.show();
                }
                
            //me.setSize(me.restoreSize);
            //me.setPosition(me.restorePos);
            
                this.minimized = false;
                this.fireEvent('restore', this);
            }
        }

        return function(showFocusFrame) {
            var me = this;
            if (me.rendered) {
            me.show();
                updateWidget.call(me);
                me.focus(false, false, showFocusFrame, true);
        }
            else {
                me.on('afterrender', function(cmp) {
                    updateWidget.call(cmp);
                    cmp.focus(false, false, showFocusFrame, true);
                });
                me.show();
            }
            return me;
        }
    }()),
    
    purgeListener: function(eventName) {
        var event = this.events[eventName];
        if(typeof event == 'object'){
            event.clearListeners();
        }
    },
    
    restoreListener: function(eventName) {
        var event = this.originalStateEvents[eventName];
        if(typeof event == 'object'){
            this.events[eventName] = event;
        }
    }
});
