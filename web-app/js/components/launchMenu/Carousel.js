Ext.define('Ozone.components.launchMenu.Carousel',{
    extend: 'Ext.panel.Panel',

    alias: 'widget.carousel',

    layout: 'fit',
    cls: 'carousel',
    resizable: {
        handles: 'n',
        minHeight: 48,
        maxHeight: 144,
        pinned: true,
        dynamic: true
    },
    ddGroup: 'carousel',

    store: null,

    viewStore: null,

    carouselView:  null,

    //a proportion of item size
    //by which to slide when left and right
    //buttons are pressed
    slideDistance: 3,

    initComponent: function(){
        var me = this;

        this.execScrollIdMap = {};

        Ext.apply(this, {
            items: {
                xtype: 'ddview',
                itemId: 'carouselView',
                cls: 'carousel-view',
                itemSelector: '.carousel-widget',
                overItemCls: 'carousel-widget-over',
                selectedItemCls: 'carousel-widget-selected',
                dragImgSelector: '.',
                trackOver: true,
                singleSelect: true,
                store: me.store,
                ddGroup: this.ddGroup,
                plugins: {
                    ptype: 'instancevariablizer',
                    container: me
                },
                tpl: new Ext.XTemplate(
                        '<tpl for=".">',
                            '<img onerror="this.src = \'{[this.getDefaultIcon()]}\'" src="{[this.getIcon(xindex, values)]}" class="carousel-widget <tpl if="this.setDisabled(values)">widget-disabled</tpl>" />',
                        '</div>',
                    '</tpl>',
                    {
                        compiled: true,

                        getIcon: function(xindex, values) {
                            var icon = null;
                            var recIndex = me.store.findExact('widgetGuid',values.widgetGuid);
                            if (recIndex > -1) {
                                var rec = me.store.getAt(recIndex);
                                icon = encodeURI(decodeURI(rec.get('image')));
                            }
                            return icon;
                        },
                        getDefaultIcon: function(){
                            return 'themes/common/images/settings/WidgetsIcon.png';
                        },
                        setDisabled: function(values) {
                            var returnValue = false;

                            if (values.disabled !== null || values.disabled !== undefined) {
                                returnValue = values.disabled;
                            }
                            else {
                                var rec = me.widgetStore.getById(values.uniqueId);
                                if (rec != null) {
                                    returnValue = rec.get('disabled');
                                }
                            }

                            return returnValue;
                        }
                    }
                ),
                listeners: {
                    render: {
                        fn: function(cmp) {

                            //relay events from the ddview up -- except selectionchange see below
                            this.relayEvents(cmp,['itemclick', 'itemdblclick', 'itemkeydown'])
                        },
                        scope: this
                    },
                    selectionchange: {
                        fn: function (selModel, records, eOpts) {
                           eOpts = eOpts || {};
                           eOpts.favorite = true;
                           this.fireEvent('selectionchange',selModel, records, eOpts);
                        },
                        scope: this
                    },
                    scope: this
                }
            },
            //todo refactor this so a lbar is not used -  a regular container with hbox layout is simpler
            lbar: {
                xtype: 'button',
                itemId: 'leftBtn',
                cls: 'leftCarouselBtn',
                iconCls: 'leftCarouselBtnIcon',
                handler: function(){
                    me.slideView(false);
                },
                listeners: {
                    render: {
                        fn: function(cmp) {
                            this.addScrollBtnDropZone(cmp,this.ddGroup)
                        },
                        scope: this
                    }
                }
            },
            //todo refactor this so a lbar/rbar is not used -  a regular container with hbox layout is simpler
            rbar: {
                xtype: 'button',
                itemId: 'rightBtn',
                cls: 'rightCarouselBtn',
                iconCls: 'rightCarouselBtnIcon',
                handler: function(){
                    me.slideView(true);
                },
                listeners: {
                    render: {
                        fn: function(cmp) {
                            this.addScrollBtnDropZone(cmp,this.ddGroup)
                        },
                        scope: this
                    }
                }
            },
            listeners: {
                resize: me.updateWidth,
                scope: this
            }
        });


        me.callParent(arguments);

        this.addEvents(['itemclick', 'itemdblclick', 'itemkeydown', 'selectionchange']);
        this.enableBubble(['itemclick', 'itemdblclick', 'itemkeydown', 'selectionchange']);

        me.on({
            destroy: {
                fn: function(cmp, opts) {
                    this.cleanUpScrollerTasks();
                },
                scope: this
            }
        });

        me.store.on('datachanged', me.updateWidth, me);
    },

    addScrollBtnDropZone: function(button,ddGroup) {
        var me = this,
            execScrollId = null,
            mouseUpListenerCfg = {
                mouseup: {
                    fn: function () {
                        execScrollId = null;
                        me.cleanUpScrollerTasks();
                    },
                    single: true
                }
            };

        function execScroll() {
            if (button.itemId == 'leftBtn') {
                me.slideView(false);
            }
            else {
                me.slideView(true);
            }
        }

        var dropZone = new Ext.dd.DropZone(button.el, {
            ddGroup: ddGroup,

            getTargetFromEvent: function(e) {
                return e.getTarget();
            },

            onNodeEnter : function(target, dd, e, data) {
                //this function might be called twice for the same button
                //execute for one button with out being removed
                //ensure we cleanup all scroller tasks before starting a new one
                me.cleanUpScrollerTasks();
                Ext.getDoc().un(mouseUpListenerCfg);

                    execScrollId = window.setInterval(execScroll,500);
                    me.execScrollIdMap[execScrollId] = true;
                    Ext.getDoc().on(mouseUpListenerCfg);

            },

            // On exit from a target node
            onNodeOut : function(target, dd, e, data) {
                execScrollId = null;
                me.cleanUpScrollerTasks();
            },

            onNodeOver : function(target, dd, e, data) {
                return Ext.dd.DropZone.prototype.dropAllowed;
            },

            onNodeDrop : function(target, dd, e, data) {
                execScrollId = null;
                me.cleanUpScrollerTasks();
            },
            onContainerDrop: function (source, e, data) {
                execScrollId = null;
                me.cleanUpScrollerTasks();
            }
        });
        dropZone.addToGroup('widgets');
    },

    cleanUpScrollerTasks: function() {
      for (var id in this.execScrollIdMap) {
          if (this.execScrollIdMap[id]) {
              window.clearInterval(id);
          }
      }
      this.execScrollIdMap = {};
    },

    //slides the DDView left or
    //right depending on the parameter
    slideView: function(right) {
        var me = this,
            imgWidth = me.getNodeWidth(),
            adjustment = imgWidth ? (imgWidth * me.slideDistance) : 0;


        this.body.scroll(right ? 'left' : 'right',adjustment, true);

    },

    refresh: function(){
        var me = this;
        
        me.carouselView.refresh();
    },

    updateWidth: function() {
        var view = this.carouselView;

        if (this.rendered) {
            Ext.Array.forEach(view.getNodes(), function(node) {
                var el = Ext.fly(node);
                el.setWidth(el.getHeight());
            });

            view.getEl().setWidth(this.store.count() * this.getNodeWidth() + 
                    view.getEl().getPadding('lr') + 10);  //seems to need some extra, which is why the 10 is there
        }
    },

    getNodeWidth: function() {
        var imgNode = Ext.fly(this.carouselView.getNode(0));
        return imgNode ? imgNode.getComputedWidth() + imgNode.getMargin('lr') : 0;
    },

    addWidget: function(widget){
        if(!(this.store.findRecord("widgetGuid", widget.data.widgetGuid))){
            this.store.add(widget);
        }
    },

    removeWidget: function(widget){
        if(this.store.findRecord("widgetGuid", widget.data.widgetGuid)){
            this.store.remove(widget);
        }
    },

    clearSelection: function(){
        var sm = this.carouselView.getSelectionModel();
        this.carouselView.deselect(sm.getSelection());
    }
});
