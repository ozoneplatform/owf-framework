Ext.define('Ext.ux.Portlet', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.portlet',
    
    anchor: '100%',
    frame: true,
    collapsible: true,
    draggable: true,
    cls: 'x-portlet',
    stateEvents: ['collapse', 'expand', 'resize', 'destroy'],
    
    /**
     * @description Defines what state gets saved for the portal when the state manager calls this method.
     *
     * @param None.
     * @returns state properties of the portal.
     */
    getState: function(){
        var currHeight = ((this.height != null) && (this.height != 'undefined')) ? this.height : '';
        var currWidth = ((this.width != null) && (this.width != 'undefined')) ? this.width : '';
       
        var o = {
            widgetGuid: ((this.widgetGuid != null) && (this.widgetGuid != 'undefined')) ? this.widgetGuid : '',
            uniqueId: ((this.uniqueId != null) && (this.uniqueId != 'undefined')) ? this.uniqueId : '',
            name: ((this.name != null) && (this.name != 'undefined')) ? this.name : '',
            active: false,
            width: currWidth,
            height: currHeight,
            x: '',
            y: '',
            zIndex: '',
            minimized: '',
            maximized: '',
            pinned: '',
            collapsed: ((this.collapsed != null) && (this.collapsed != 'undefined')) ? this.collapsed : '',
            columnPos: ((this.columnPos != null) && (this.columnPos != 'undefined')) ? this.columnPos : '',
            buttonId: '',
            buttonOpened: '',
            region: ''
        };
        return o;
    },
    
    /**
     * @description Defines what state gets restored for the portal when the state manager calls this method.
     *
     * @param state State data from by portal manager's state provider.
     * @returns None.
     */
    applyState: function(state){
        this.widgetGuid = state.widgetGuid;
        this.uniqueId = state.uniqueId;
        this.name = state.name;
        this.active = state.active;
        this.width = state.width;
        this.height = state.height;
        this.x = state.x;
        this.y = state.y;
        this.zIndex = state.zIndex;
        this.minimized = state.minimized;
        this.maximized = state.maximized;
        this.pinned = state.pinned;
        this.collapsed = state.collapsed;
        this.columnPos = state.columnPos;
        this.buttonId = state.buttonId;
        this.buttonOpened = state.buttonOpened;
        this.region = state.region;
    },
    
    constructor: function(config){
        this.column = config.column;
        this.callParent(arguments);
        
        var panel = this;
        this.panel = panel;
        this.on('render', function(){
            //When the widget is collapsed through the state (on page
            //reload), the height is not set. Then when expanded the
            //portlet height is incorrect, so this sets the height
            this.body.setHeight(this.height - this.getFrameHeight());
            
            panel.resizer = Ext.create('Ext.resizer.Resizer', {
				target: panel.el,
                handles: 's',
                minHeight: 100,
                resizeElement: function(){
                    var box = this.proxy.getBox();
                    
                    panel.setSize(box);
                    panel.initialConfig.height = box.height;
                    
                    //remove and reappend element to fix IE6 bug
                    //                    var parent = this.south.el.parent();
                    //                    this.south.el.remove();
                    //                    parent.appendChild(this.south.el);
                    
                    return box;
                }
            });
        });
    },
    updatePortletLayout: function(newColumn, newPosition){
        Ozone.Msg.alert(Ozone.ux.DashboardMgmtString.portal, "You moved me to column " + newColumn + ", index=" + newPosition);
    }
});

/**
 * @class Ext.ux.PortalColumn
 * @extends Ext.container.Container
 * A layout column class used internally be {@link Ext.ux.PortalPanel}.
 */
Ext.define('Ext.ux.PortalColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.portalcolumn',
    layout: {
        type: 'anchor'
    },
    defaultType: 'portlet',
    cls: 'x-portal-column',
    autoHeight: true
    //
    // This is a class so that it could be easily extended
    // if necessary to provide additional behavior.
    //
});

/**
 * @class Ext.ux.PortalPanel
 * @extends Ext.Panel
 * A {@link Ext.Panel Panel} class used for providing drag-drop-enabled portal layouts.
 */
Ext.define('Ext.ux.PortalPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.portalpanel', 'widget.portal'],
    cls: 'x-portal',
    bodyCls: 'x-portal-body',
    defaultType: 'portalcolumn',
    componentLayout: 'body',
    autoScroll: true,

    initComponent : function() {
        var me = this;

        // Implement a Container beforeLayout call from the layout to this Container
        this.layout = {
            type : 'column'
        };
        this.callParent();

        this.addEvents({
            validatedrop: true,
            beforedragover: true,
            dragover: true,
            beforedrop: true,
            drop: true
        });
        this.on('drop', this.doLayout, this);
    },

    // Set columnWidth, and set first and last column classes to allow exact CSS targeting.
    beforeLayout: function() {
        var items = this.layout.getLayoutItems(),
            len = items.length,
            i = 0,
            item;

        for (; i < len; i++) {
            item = items[i];
            item.columnWidth = 1 / len;
            item.removeCls(['x-portal-column-first', 'x-portal-column-last']);
        }
        if (items[0]) items[0].addCls('x-portal-column-first');
        if (items[len - 1]) items[len - 1].addCls('x-portal-column-last');
        return this.callParent(arguments);
    },

    // private
    initEvents : function(){
        this.callParent();
        this.dd = Ext.create('Ext.ux.PortalDropZone', this, this.dropConfig);
    },

    // private
    beforeDestroy : function() {
        if (this.dd) {
            this.dd.unreg();
        }
        Ext.ux.PortalPanel.superclass.beforeDestroy.call(this);
    }
});

/**
 * @class Ext.ux.PortalDropZone
 * @extends Ext.dd.DropTarget
 * Internal class that manages drag/drop for {@link Ext.ux.PortalPanel}.
 */
Ext.define('Ext.ux.PortalDropZone', {
    extend: 'Ext.dd.DropTarget',

    constructor: function(portal, cfg) {
        this.portal = portal;
        Ext.dd.ScrollManager.register(portal.body);
        Ext.ux.PortalDropZone.superclass.constructor.call(this, portal.body, cfg);
        portal.body.ddScrollConfig = this.ddScrollConfig;
    },

    ddScrollConfig: {
        vthresh: 50,
        hthresh: -1,
        animate: true,
        increment: 200
    },

    createEvent: function(dd, e, data, col, c, pos) {
        return {
            portal: this.portal,
            panel: data.panel,
            columnIndex: col,
            column: c,
            position: pos,
            data: data,
            source: dd,
            rawEvent: e,
            status: this.dropAllowed
        };
    },

    notifyOver: function(dd, e, data) {
        var xy = e.getXY(),
            portal = this.portal,
            proxy = dd.proxy;

        // case column widths
        if (!this.grid) {
            this.grid = this.getGrid();
        }

        // handle case scroll where scrollbars appear during drag
        var cw = portal.body.dom.clientWidth;
        if (!this.lastCW) {
            // set initial client width
            this.lastCW = cw;
        } else if (this.lastCW != cw) {
            // client width has changed, so refresh layout & grid calcs
            this.lastCW = cw;
            //portal.doLayout();
            this.grid = this.getGrid();
        }

        // determine column
        var colIndex = 0,
            colRight = 0,
            cols = this.grid.columnX,
            len = cols.length,
            cmatch = false;

        for (len; colIndex < len; colIndex++) {
            colRight = cols[colIndex].x + cols[colIndex].w;
            if (xy[0] < colRight) {
                cmatch = true;
                break;
            }
        }
        // no match, fix last index
        if (!cmatch) {
            colIndex--;
        }

        // find insert position
        var overPortlet, pos = 0,
            h = 0,
            match = false,
            overColumn = portal.items.getAt(colIndex),
            portlets = overColumn.items.items,
            overSelf = false;

        len = portlets.length;

        for (len; pos < len; pos++) {
            overPortlet = portlets[pos];
            h = overPortlet.el.getHeight();
            if (h === 0) {
                overSelf = true;
            } else if ((overPortlet.el.getY() + (h / 2)) > xy[1]) {
                match = true;
                break;
            }
        }

        pos = (match && overPortlet ? pos : overColumn.items.getCount()) + (overSelf ? -1 : 0);
        var overEvent = this.createEvent(dd, e, data, colIndex, overColumn, pos);

        if (portal.fireEvent('validatedrop', overEvent) !== false && portal.fireEvent('beforedragover', overEvent) !== false) {

            // make sure proxy width is fluid in different width columns
            proxy.getProxy().setWidth('auto');

            if (overPortlet) {
                proxy.moveProxy(overPortlet.el.dom.parentNode, match ? overPortlet.el.dom : null);
            } else {
                proxy.moveProxy(overColumn.el.dom, null);
            }

            this.lastPos = {
                c: overColumn,
                col: colIndex,
                p: overSelf || (match && overPortlet) ? pos : false
            };
            this.scrollPos = portal.body.getScroll();

            portal.fireEvent('dragover', overEvent);
            return overEvent.status;
        } else {
            return overEvent.status;
        }

    },

    notifyOut: function() {
        delete this.grid;
    },

    notifyDrop: function(dd, e, data) {
        delete this.grid;
        if (!this.lastPos) {
            return;
        }
        var c = this.lastPos.c,
            col = this.lastPos.col,
            pos = this.lastPos.p,
            panel = dd.panel,
            dropEvent = this.createEvent(dd, e, data, col, c, pos !== false ? pos : c.items.getCount());

        if (this.portal.fireEvent('validatedrop', dropEvent) !== false && this.portal.fireEvent('beforedrop', dropEvent) !== false) {

            // make sure panel is visible prior to inserting so that the layout doesn't ignore it
            panel.el.dom.style.display = '';

            if (pos !== false) {
                c.insert(pos, panel);
            } else {
                c.add(panel);
            }

            dd.proxy.hide();
            this.portal.fireEvent('drop', dropEvent);

            // scroll position is lost on drop, fix it
            var st = this.scrollPos.top;
            if (st) {
                var d = this.portal.body.dom;
                setTimeout(function() {
                    d.scrollTop = st;
                },
                10);
            }

        }
        delete this.lastPos;
        return true;
    },

    // internal cache of body and column coords
    getGrid: function() {
        var box = this.portal.body.getBox();
        box.columnX = [];
        this.portal.items.each(function(c) {
            box.columnX.push({
                x: c.el.getX(),
                w: c.el.getWidth()
            });
        });
        return box;
    },

    // unregister the dropzone from ScrollManager
    unreg: function() {
        Ext.dd.ScrollManager.unregister(this.portal.body);
        Ext.ux.PortalDropZone.superclass.unreg.call(this);
    }
});