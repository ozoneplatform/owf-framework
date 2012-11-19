Ext.define('Ozone.components.window.DashboardSwitcher', {
    extend: 'Ozone.components.window.ModalWindow',
    alias: 'widget.dashboardswitcher',
    
    closeAction: 'hide',
    modal: true,
    preventHeader: true,
    modalAutoClose: true,
    shadow: false,
    layout: 'auto',
    ui: 'system-window',
    store: null,
    closable: false,
    title: 'Dashboards',
    iconCls: 'dashboard-switcher-header-icon',
    cls: 'system-window',
    resizable: false,
    draggable: false,

    viewId: 'dashboard-switcher-dashboard-view',

    dashboardContainer: null,

    //dashboard unit sizes
    dashboardItemHeight: 0,
    dashboardItemWidth: 0,

    //size of switcher in dashboard units
    minDashboardsWidth: 3,
    maxDashboardsWidth: 5,
    maxDashboardsHeight: 3,

    storeLengthChanged: true,

    selectedItemCls : 'dashboard-selected',
    
    initComponent: function() {

        var me = this,
            stackOrDashboards = [],
            stacks = {}, dashboards = {},
            dashboard, stack, model;

        for(var i = 0, len = me.dashboardStore.getCount(); i < len; i++) {

            model = me.dashboardStore.getAt(i);

            dashboard = model.data;
            dashboard.model = model;
            dashboards[ dashboard.guid ] = dashboard;

            stack = dashboard.stack;

            if( stack ) {
                if( stacks[ stack.id ] ) {
                    stacks[ stack.id ].dashboards.push( dashboard );
                }
                else {
                    stack.isStack = true;
                    stack.dashboards = [ dashboard ];

                    stacks[ stack.id ] = stack;
                    stackOrDashboards.push( stack );
                }
            }
            else {
                stackOrDashboards.push( dashboard );
            }

        }

        // this may need to move into an onShow or something.
        // var me = this;
        // var numCols = Math.max(this.minDashboardsWidth,
        //                 Math.min(this.maxDashboardsWidth, this.dashboardStore.count()));
        // var numRows = Math.min(this.maxDashboardsHeight,Math.floor((this.dashboardStore.count()-1)/numCols) + 1);
        
        // this.view = Ext.create("Ozone.components.focusable.FocusableView", {
        //     itemId: this.viewId,
        //     itemSelector: '.dashboard',
        //     overItemCls: 'dashboard-over',
        //     selectedItemCls: 'dashboard-selected',
        //     trackOver: true,
        //     singleSelect: true,
        //     store: this.dashboardStore,
        //     autoScroll: true,
        //     // width:numCols*this.dashboardItemWidth+20,
        //     // height:numRows*this.dashboardItemHeight,
        //     tpl: new Ext.XTemplate(
        //             '<tpl for=".">',
        //                 '<div class="dashboard" tabindex="0" data-qtip="{[Ext.htmlEncode(Ext.htmlEncode(values.name))]}">',
        //                     '<div class="thumb-wrap">',
        //                         '<div class="thumb {layout}">',
        //                         '</div>',
        //                     '</div>',
        //                     '<div class="dashboard-name">',
        //                         '{[this.encodeAndEllipsize(values.name)]}',
        //                     '</div>',
        //                     //'<tpl if="groups.length &gt; 0">',
        //                     //    '<div class="dashboard-groups">',
        //                     //        '{[this.getGroupText(values.groups)]}',
        //                     //    '</div>',
        //                     //'</tpl>',
        //                 '</div>',
        //             '</tpl>'
        //         ,
        //         {
        //             compiled: true,
        //             getGroupText: function(groups) {
        //                 var text = "";
        //                 text += groups[0].name;
        //                 if(groups.length>1) {
        //                     text += " (+" + (groups.length-1) + " others)";
        //                 }
        //                 return text;
        //             },
        //             encodeAndEllipsize: function(str) {
        //                 //html encode the result since ellipses are special characters
        //                 return Ext.util.Format.htmlEncode(
        //                     Ext.Array.map (
        //                         //get an array containing the first word of rowData.name as one elem, and the rest of name as another
        //                         Ext.Array.erase (/^([\S]+)\s*(.*)?/.exec(Ext.String.trim(str)), 0, 1),
        //                         function(it) {
        //                             //for each elem in the array, truncate it with an ellipsis if it is longer than 11 characters
        //                             return Ext.util.Format.ellipsis(it, 14);
        //                         }
        //                     //join the array back together with spaces
        //                     ).join(' ')
        //                 );
        //             }
        //         }
        //     ),
        //     listeners: {
        //         itemclick: {
        //             fn: this.itemClick,
        //             scope: this
        //         },
        //         itemkeydown: {
        //             fn: this.itemKeyDown,
        //             scope: this
        //         },
        //         add: {
        //             fn: this.onAddRemove,
        //             scope: this
        //         },
        //         remove: {
        //             fn: this.onAddRemove,
        //             scope: this
        //         },
        //         refresh: {
        //             fn: this.reSetupFocus,
        //             scope: this
        //         },
        //         viewready: {
        //             fn: this.focusSelectedDashboard,
        //             scope: this,
        //             single: true
        //         }
        //     }
        // });

        // this.items = [this.view];
        
        this.callParent(arguments);

        // this.on({
        //     beforeshow: {
        //         fn: function(cmp) {
        //             if(this.dashboardItemWidth > 0 && this.dashboardItemHeight > 0)
        //                 this.updateWindowSize();
        //         },
        //         scope:this
        //     },
        //     resize: {
        //         fn: function(cmp) {
        //             if(this.isVisible()) {
        //                 this.center();
        //             }
        //         },
        //         scope: this
        //     },
        //     show: {
        //         fn: this.focusSelectedDashboard,
        //         scope: this
        //     }
        // });

        // this.on({
        //     show: this.updateWindowSize, 
        //     scope: this, 
        //     delay: 1 //for IE7
        // });

        me.stackOrDashboards = stackOrDashboards;
        me.dashboards = dashboards;
        me.stacks = stacks;

        me.tpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="{[this.getName(values)]}" tabindex="0" data-{[this.getName(values)]}-id="{[this.getId(values)]}" {[this.getToolTip(values)]}>',
                    '<div class="thumb-wrap">',
                        '<div class="thumb {layout}">',
                        '</div>',
                    '</div>',
                    '{[this.getActions(values)]}',
                    '<div class="{[this.getName(values)]}-name">',
                        '{[this.encodeAndEllipsize(values.name)]}',
                    '</div>',
                '</div>',
            '</tpl>'
        ,{
            compiled: true,
            getId: function (values) {
                return values.isStack ? values.id : values.guid;
            },
            getName: function (values) {
                return values.isStack ? 'stack' : 'dashboard';
            },
            getToolTip: function (values) {
                var str = 'data-qtip="' +
                        '<p class=\'name\'>' + values.name + '<p/>' +
                        '<p class=\'tip-description\'>' + (values.description || 'No description found!') +'</p>';

                return values.isStack ? str + '"':
                        str +
                        '<br><p class=\'group\'>Group: ' + ((values.groups && values.groups.length > 0) ? values.groups[0].name : 'None') + '<p/>' +
                        '<p class=\'created-by\'>Created by: ' + values.createdDate + '<p/>' +
                        '<p class=\'last-updated\'>Last Modified: ' + values.editedDate + '<p/>"';
            },
            getActions: function (values) {
                return values.isStack ? 
                        '<ul class="stack-actions hide">'+
                            '<li class="restore icon-refresh" data-qtip="Restore"></li>'+
                            '<li class="delete icon-remove" data-qtip="Delete"></li>'+
                        '</ul>' :
                        '<ul class="dashboard-actions hide">'+
                            '<li class="share icon-share" data-qtip="Share"></li>'+
                            '<li class="restore icon-refresh" data-qtip="Restore"></li>'+
                            '<li class="edit icon-edit" data-qtip="Edit"></li>'+
                            '<li class="delete icon-remove" data-qtip="Delete"></li>'+
                        '</ul>'
            },
            encodeAndEllipsize: function(str) {
                //html encode the result since ellipses are special characters
                return Ext.util.Format.htmlEncode(
                    Ext.Array.map (
                        //get an array containing the first word of rowData.name as one elem, and the rest of name as another
                        Ext.Array.erase (/^([\S]+)\s*(.*)?/.exec(Ext.String.trim(str)), 0, 1),
                        function(it) {
                            //for each elem in the array, truncate it with an ellipsis if it is longer than 11 characters
                            return Ext.util.Format.ellipsis(it, 14);
                        }
                    //join the array back together with spaces
                    ).join(' ')
                );
            }
        });

        me.stackDashboardsTpl = '<div class="stack-dashboards"><div class="stack-dashboards-anchor-tip x-tip-anchor x-tip-anchor-top"></div><div class="dashboards"></div></div>';
        
        me.on('afterrender', function (cmp) {
            me.tpl.overwrite( cmp.body, stackOrDashboards );
            Ext.DomHelper.append( cmp.body, 
            '<ul class="actions">'+
                '<li class="manage">Manage</li>'+
                '<li class="create">+</li>'+
            '</ul>');

            me.bindEvents(cmp);
        });

        me.dashboardStore.on('add', me.destroy, me);
    },

    bindEvents: function (cmp) {
        var me = this,
            $ = jQuery;

        $(cmp.el.dom)
            .on('click', '.dashboard', $.proxy(me.onDashboardClick, me))
            .on('click', '.stack', $.proxy(me.onStackClick, me))
            .on('click', '.manage', $.proxy(me.toggleManage, me))
            .on('click', '.create', $.proxy(me.createDashboard, me))
            .on('mouseover', '.stack', $.proxy(me.onMouseOver, me))
            .on('mouseover', '.dashboard', $.proxy(me.onMouseOver, me))
            .on('click', '.dashboard .restore', $.proxy(me.restoreDashboard, me))
            .on('click', '.dashboard .share', $.proxy(me.shareDashboard, me))
            .on('click', '.dashboard .edit', $.proxy(me.editDashboard, me))
            .on('click', '.dashboard .delete', $.proxy(me.deleteDashboard, me))
            .on('click', '.stack .restore', $.proxy(me.restoreStack, me))
            .on('click', '.stack .delete', $.proxy(me.deleteStack, me));

    },

    destroy: function (store) {
        // // we don't want to destroy when records are removed
        // if(store.removed.length > 0) {
        //     return;
        // }

        // // remove datachanged event handler
        // this.dashboardStore.un('datachanged', this.cleanAndDestroy, this);

        console.log('destroying dashboard switcher');

        // remove jQuery listeners
        $(this.el.dom).off();

        // destroy view so that it will be recreated when opened next setTimeout
        return this.callParent();
    },

    getDashboard: function ($el) {
        return this.dashboards[ $el.attr('data-dashboard-id') ];
    },

    getStack: function ($el) {
        return this.stacks[ $el.attr('data-stack-id') ];
    },

    getElByClassFromEvent: function (evt, cls) {
        var $dashboard = $(evt.currentTarget || evt.target);
        return $dashboard.hasClass('cls') ? $dashboard : $dashboard.parents('.' + cls);
    },

    onDashboardClick: function (evt) {
        var $clickedDashboard = $(evt.currentTarget),
            dashboard = this.getDashboard( $clickedDashboard );

        this.activateDashboard(dashboard.guid);
        
        $clickedDashboard.addClass( this.selectedItemCls );

        if( this._$lastClickedDashboard ) {
            this._$lastClickedDashboard.removeClass( this.selectedItemCls );
        }

        this._$lastClickedDashboard = $clickedDashboard;
    },

    onStackClick: function (evt) {
        var me = this,
            $ = jQuery,
            $clickedStack = $(evt.currentTarget),
            stack = this.getStack( $clickedStack );

        if( stack ) {

            if( this._lastExpandedStack ) {

                if( this._lastExpandedStack === stack ) {
                    me.$stackDashboards.slideToggle('fast');
                }
                else {
                    me.$stackDashboards.slideUp('fast').promise().then(function () {
                        me.$stackDashboards.remove();
                        me.showStackDashboards(stack, $clickedStack);
                    });
                }
            }
            else  {
                me.showStackDashboards(stack, $clickedStack);
            }
        }
        evt.preventDefault();
    },

    showStackDashboards: function (stack, $clickedStack) {
        var clickedStackElWidth = $clickedStack.outerWidth( true ),
            clickedStackElHeight = $clickedStack.outerHeight( true ),
            parent = $clickedStack.parent(),
            parentWidth = parent.outerWidth( true ),
            lastElInRow;


        // get last element in the clikced stack's row
        var numItemsInRow = Math.round( parentWidth / clickedStackElWidth ),
            totalItems = this.stackOrDashboards.length,
            clickedStackIndex = $clickedStack.index() + 1;

        if( clickedStackIndex === totalItems || (clickedStackIndex % numItemsInRow) === 0 ) {
            lastElInRow = $clickedStack;
        }
        else {
            var i = clickedStackIndex;
            while( (i % numItemsInRow) !== 0 ) {
                i++;
                if( i >= totalItems ) {
                    break;
                }
            }
            lastElInRow = parent.children().eq(i-1);
        }

        // compile template and add to dom
        this.$stackDashboards = $( this.stackDashboardsTpl );
        this.$stackDashboards.children('.dashboards').html( this.tpl.applyTemplate( stack.dashboards ) )
        this.$stackDashboards.insertAfter( lastElInRow );

        this.stackDashboardsAnchorTip = $( '.stack-dashboards-anchor-tip' , this.$stackDashboards );

        // cache size of tip
        if( !this.stackDashboardsAnchorTipHeight ) {
            this.stackDashboardsAnchorTipHeight = this.stackDashboardsAnchorTip.outerHeight();
        }
        if( !this.stackDashboardsAnchorTipWidth ) {
            this.stackDashboardsAnchorTipWidth = this.stackDashboardsAnchorTip.outerWidth();
        }

        this.$stackDashboards.hide();

        // calculate top and left value for anchor tip
        var parentPosition = $clickedStack.position(),
            top = parentPosition.top + clickedStackElHeight - (this.stackDashboardsAnchorTipHeight),
            left = parentPosition.left + (clickedStackElWidth / 2) - (this.stackDashboardsAnchorTipWidth / 2);
        
        this.stackDashboardsAnchorTip.css({
            //top: top + 'px',
            left: left + 'px'
        });
        
        this.$stackDashboards.slideDown('fast');
        this._lastExpandedStack = stack;
    },

    onMouseOver: function (evt) {
        var el,
            $ = jQuery;

        if( !this._managing )
            return;

        el = $(evt.currentTarget);

        if(this._lastManageEl) {
            if(el[0] === this._lastManageEl[0]) {
                return;
            }
            else {
                //$('ul', this._lastManageEl).slideUp();
                $('ul', this._lastManageEl).addClass('hide');
            }
        }

        this._lastManageEl = el;

        //$('ul', el).slideDown();
        $('ul', this._lastManageEl).removeClass('hide');

        $('.dashboard, .stack', this.el.dom).css('height', el.height() + 'px');
    },

    updateDashboardEl: function ($dashboard, dashboard) {
        $(this.tpl.apply([dashboard])).insertBefore($dashboard);
        $dashboard.remove();
    },

    toggleManage: function (evt) {
        console.log('manage');
        var el = $(evt.currentTarget);

        if( this._managing ) {
            el.removeClass('selected');
            $('.dashboard, .stack', this.el.dom).css('height', '');
            if( this._lastManageEl ) {
                 //$('ul', this._lastManageEl).slideUp();
                 $('ul', this._lastManageEl).addClass('hide');
                 this._lastManageEl = null;
            }
        }
        else {
            el.addClass('selected');
        }

        this._managing = !this._managing;
    },

    createDashboard: function () {
        console.log('createDashboard');

        var createDashWindow = Ext.widget('createdashboardwindow', {
            itemId: 'createDashWindow',
            dashboardContainer: this.dashboardContainer,
            ownerCt: this.dashboardContainer
        });
        createDashWindow.show();
        this.close();
    },

    restoreDashboard: function (evt) {
        evt.stopPropagation();
        var me = this,
            $dashboard = this.getElByClassFromEvent(evt, 'dashboard'),
            dashboard = this.getDashboard($dashboard),
            dashboardGuid = dashboard.guid;

        console.log('restore dashboard', dashboardGuid);

        this.warn('Are you sure you want to restore dashboard ' + '<span class="heading-bold">' + dashboard.name + '</span>?', function () {
            Ext.Ajax.request({
                url: Ozone.util.contextPath() + '/dashboard/restore',
                params: {
                    guid: dashboardGuid,
                    isdefault: dashboardGuid == this.dashboardContainer.activeDashboard.guid
                },
                success: function(response, opts) {
                    var json = Ext.decode(response.responseText);
                    if (json != null && json.data != null && json.data.length > 0) {
                        me.notify('Restore Dashboard', '<span class="heading-bold">' + dashboard.name + '</span> is restored successfully to its original state!');

                        dashboard.description = json.data[0].description;
                        dashboard.name = json.data[0].name;

                        me.updateDashboardEl($dashboard, dashboard)
                        
                        // TODO
                        // update name
                        me.reloadDashboards = true;
                    }
                },
                failure: function(response, opts) {
                    Ozone.Msg.alert('Dashboard Manager', "Error restoring dashboard.", function() {
                        Ext.defer(function() {
                            $dashboard[0].focus();
                        }, 200, this);
                    }, this, null, this.dashboardContainer.modalWindowManager);
                    return;
                },
                scope: this
            });
        });
    },

    shareDashboard: function (evt) {
        evt.stopPropagation();

        var $dashboard = this.getElByClassFromEvent(evt, 'dashboard'),
            dashboard = this.getDashboard($dashboard),
            dashboardModel = dashboard.model;

        // delete model before cloning to remove circular refs
        delete dashboard.model;
        var cloneDashboard = Ozone.util.cloneDashboard(dashboard, false, true);

        // reset dashboard model
        dashboard.model = dashboardModel;

        console.log('share dashboard', dashboard.guid);

        // Stop unload event from firing long enough to submit form.
        // Have to do this because the form submit triggers the window's unload event
        // which causes competing requests.  (SEE OWF-4280)
        Ext.EventManager.un(window, 'beforeunload', this.dashboardContainer.onBeforeUnload);

        var elForm = document.createElement('form');
        var elInput = document.createElement('input');
        elInput.id = 'json';
        elInput.name = 'json';
        elInput.type = 'hidden';
        elInput.value = Ext.JSON.encode(cloneDashboard);
        elForm.appendChild(elInput);
        elForm.action = Ozone.util.contextPath() + '/servlet/ExportServlet';
        elForm.method = 'POST';
        elForm.enctype = elForm.encoding = 'multipart/form-data';
        document.body.appendChild(elForm);
        elForm.submit();
        document.body.removeChild(elForm);
        elForm = null;
        elInput = null;
        var dmScope = this;
        setTimeout(function() {
            Ext.EventManager.on(window, 'beforeunload', dmScope.dashboardContainer.onBeforeUnload, dmScope.dashboardContainer);
        }, 100);
    },

    editDashboard: function (evt) {
        evt.stopPropagation();

        var me = this,
            $dashboard = this.getElByClassFromEvent(evt, 'dashboard'),
            dashboard = this.getDashboard($dashboard);

        console.log('edit dashboard', dashboard.guid);

        var editDashWindow = Ext.widget('createdashboardwindow', {
            itemId: 'editDashWindow',
            title: 'Edit Dashboard',
            height: 250,
            dashboardContainer: this.dashboardContainer,
            ownerCt: this.dashboardContainer,
            hideViewSelectRadio: true,
            existingDashboardRecord: dashboard.model,
            listeners: {
                cancel: function () {
                    me.show();
                    evt.currentTarget.focus();
                }
            }
       }).show();

       this.close();
    },

    deleteDashboard: function (evt) {
        evt.stopPropagation();

        var me = this,
            $dashboard = this.getElByClassFromEvent(evt, 'dashboard'),
            dashboard = this.getDashboard($dashboard),
            msg = 'Are you sure you want to permanently delete dashboard <span class="heading-bold">' 
                    + Ext.htmlEncode(dashboard.name) + '</span>?';

        console.log('delete dashboard', dashboard.guid);
        
        this.warn(msg, function () {
            me.dashboardStore.remove(dashboard.model);
            me.dashboardStore.save();

            $dashboard.remove();
            me.notify('Delete Dashboard', '<span class="heading-bold">' + dashboard.name + '</span> deleted!');

            me.reloadDashboards = true;
        }, function () {
            evt.currentTarget.focus();
        });
        
    },

    restoreStack: function (evt) {
        evt.stopPropagation();
        var $stack = this.getElByClassFromEvent(evt, 'stack'),
            stack = this.getStack($stack);

        console.log('restore stack', stack.id);
    },

    deleteStack: function (evt) {
        evt.stopPropagation();
        var $stack = this.getElByClassFromEvent(evt, 'stack'),
            stack = this.getStack($stack),
            msg = 'This action will permanently delete <span class="heading-bold">' 
                    + Ext.htmlEncode(stack.name) + '</span>.';

        console.log('delete stack', dashboard.guid);
        
        // this.warn(msg, function () {
        //     me.dashboardStore.remove(dashboard.model);
        //     me.dashboardStore.save();

        //     $dashboard.remove();
        //     me.reloadDashboards = true;
        // }, function () {
        //     evt.currentTarget.focus();
        // });
    },

    warn: function (msg, okFn, cancelFn) {
        Ext.widget('alertwindow',{
            title: "Warning",
            html:  msg,
            minHeight: 115,
            width: 250,
            dashboardContainer: this.dashboardContainer,
            okFn: okFn,
            cancelFn: cancelFn
        }).show();
    },

    notify: function  (title, msg, type /* default is success*/) {
        var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 25, "firstpos2": 25};
        $.pnotify({
            title: title,
            text: msg,
            type: type || 'success',
            addclass: "stack-bottomright",
            stack: stack_bottomright,
            history: false,
            sticker: false,
            icon: false,
            delay: 3000
        });
    },

    onAddRemove: function() {
        this.storeLengthChanged = true;
    },

    itemClick: function(view, record, item, index, event, eOpts) {
        this.activateDashboard(record.get('guid'));
    },

    itemKeyDown: function(view, record, item, index, event, eOpts) {
        switch (event.getKey()) {
            case event.ENTER:
            case event.SPACE:
                event.preventDefault();
                this.activateDashboard(record.get('guid'));
        }
    },

    activateDashboard: function (guid) {
        this.close();
        this.dashboardContainer.activateDashboard(guid);
    },

    refresh: function() {
        if (this.rendered) {
            this.view.refresh();
        }
    },
    
    reSetupFocus: function() {
        var widgetEls = this.view.getEl().query(this.view.itemSelector),
        len = widgetEls.length;
        if(len > 0) {
            this.setupFocus(Ext.get(widgetEls[0]), Ext.get(widgetEls[len-1]));
        }
    },

    focusSelectedDashboard: function() {
        var selectedDB = this.view.getNode(this.view.store.getById(this.dashboardContainer.activeDashboard.id));
        var me = this;

        if(selectedDB) {
            setTimeout(function() {
                try {   
                    selectedDB.focus();
                    me.reSetupFocus();
                }
                catch(e) {}
            }, 100);
        }
    },

    updateWindowSize: function() {
        var newWidth,
            newHeight,
            item = this.view.getNode(0);
        
        if(!item)
            return;
        
        var itemEl = Ext.get(item),
            windowEl = this.getEl(),
            widthMargin = itemEl.getMargin('lr'),
            heightMargin = itemEl.getMargin('tb'),
            totalDashboards = this.view.getStore().getCount(),
            dashboardInRow = 0;

        this.dashboardItemWidth = itemEl.getWidth();
        this.dashboardItemHeight = itemEl.getHeight();

        if(totalDashboards < this.minDashboardsWidth) {
            dashboardInRow = this.minDashboardsWidth;
        }
        else if (totalDashboards > this.maxDashboardsWidth) {
            dashboardInRow = this.maxDashboardsWidth;
        }
        else {
            dashboardInRow = totalDashboards;
        }

        newWidth = (this.dashboardItemWidth + widthMargin) * dashboardInRow;

        if(totalDashboards > this.maxDashboardsWidth * this.maxDashboardsHeight) {
            // add 30 to accomodate for scrollbar
            newWidth += 30;
        }
        if(totalDashboards > this.maxDashboardsWidth * this.maxDashboardsHeight) {
            newHeight = (this.dashboardItemHeight + heightMargin) * this.maxDashboardsHeight;
        }

        //update the layout
        this.view.doComponentLayout(newWidth, newHeight);
    }
});
