Ext.define('Ozone.components.widget.WidgetPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.widgetpanel', 'widget.Ozone.components.widget.WidgetPanel'],
    
    mixins: {
      widget: 'Ozone.components.widget.WidgetBase'
    },
    plugins: [
        new Ozone.plugins.WidgetPanel()
    ],
    
    dashboardGuid: null,
    widgetStateContainer: null,
    hideMode: 'visibility',
    
    initComponent: function(){
        this.beforeInitComponent();

        this.callParent(arguments);
        
        this.addEvents('minimize', 'maximize');

        this.on({
            beforeCollapse: {
                fn: function(cmp) {
                    this.restoreSize = this.getSize();
                },
                scope: this
            },
            expand: {
                fn: function(cmp) {
                    delete this.restoreSize;
                    this.focus(null, null, false, true);
                },
                scope: this
            },
            show: {
                // only fired in tabbed layout
                fn: function(cmp) {
                    this.focus();
                },
                scope: this
            },
            collapse: {
                fn: function(cmp) {
                    var tool = this.tools['collapse-top'];
                    if(tool) {
                        tool.blur();
                        tool.focus();
                    }
                },
                scope: this
            }
        });
        
        Ext.apply(this, this.mixins.widget.overrides);
        
        //override functions
        this.afterInitComponent();
    },
    
    stateEvents: ['resize', 'collapse', 'expand', 'activate', 'deactivate', 'minimize', 'maximize', 'titlechange'],
    getState: function() {
        var o = {
            universalName: this.universalName,
            widgetGuid: this.widgetGuid,
            uniqueId: this.uniqueId,
            dashboardGuid: this.dashboardGuid,
            paneGuid: this.paneGuid,
            intentConfig: this.intentConfig,
            launchData: this.launchData,
            name: this.title ? this.title : this.name,
            active: !!this.active,
            x: this.restorePos ? this.restorePos[0] : this.x,
            y: this.restorePos ? this.restorePos[1] : this.y,
            zIndex: 0,
            minimized: !!this.minimized,
            maximized: !!this.maximized,
            pinned: !!this.pinned,
            collapsed: !!this.collapsed,
            columnPos: 0,
            buttonId: this.buttonId ? this.buttonId : null,
            buttonOpened: this.buttonOpened ? this.buttonOpened : false,
            region: this.region || 'none',
            statePosition: this.statePosition,
            singleton: this.singleton,
            floatingWidget: false
        };
        if (this.rendered) {
            var box = this.getBox();
          Ext.apply(o,{
            height: this.collapseMemento != null && this.collapseMemento.data != null ? this.collapseMemento.data.height : box.height,
            width: box.width,
            x: box.x,
            y: box.y
          });
        }
        else {
          Ext.apply(o,{
            height: this.height,
            width: this.width
          });
        }
        return o;
    },

    applyState: function(state){
        this.title = state.name;
    },
    
    insertTool: function(tool, el) {
        if (this.header) {
          this.header.insertTool(tool, el);
        }
    },

    afterCollapse: function(animated, internal) {
      this.callParent(arguments);
      //if this is an internal collapse we still need save state is keep the collapsed property correct
      if (internal) {
          this.saveState();
      }
    }
});
