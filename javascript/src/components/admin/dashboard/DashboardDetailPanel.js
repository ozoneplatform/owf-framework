Ext.define('Ozone.components.admin.dashboard.DashboardDetailPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.dashboarddetailpanel', 'widget.dashboarddetail'],
    
    viewDashboard: null,
    loadedRecord: null,
    
    initComponent: function() {
        //init quicktips
        Ext.tip.QuickTipManager.init(true,{
            dismissDelay: 60000,
            showDelay: 2000
        });
        
        this.viewDashboard = Ext.create('Ext.view.View', {
            store: Ext.create('Ext.data.Store', {
                storeId: 'storeDashboardItem',
                fields: [
                    { name: 'name', type: 'string' },
                    { name: 'layout',  type: 'string' },
                    { name: 'EDashboardLayoutList',  type: 'string' },
                    { name: 'isGroupDashboard', type: 'boolean'},
                    { name: 'groups', model: 'Group'},
                    { name: 'description', type: 'string' },
                    { name: 'createdDate', type: 'string' },
                    { name: 'prettyCreatedDate', type: 'string' },
                    { name: 'editedDate', type: 'string' },
                    { name: 'prettyEditedDate', type: 'string' },
                    { name: 'createdBy', model: 'User' },
                    { name: 'stack', model: 'Stack'}
                ]
            }),
            deferEmptyText: false,
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="selector">',
                        '<div id="detail-info" class="detail-info">',
                            '<div class="dashboard-detail-icon-block">',
                                '{[this.renderIconBlock(values)]}',
                            '</div>',
                            '<div class="dashboard-detail-info-block">',
                                '<div class="detail-header-block">',
                                    '{[this.renderDetailHeaderBlock(values)]}',
                                '</div>',
                                '<div class="detail-block">',
                                    '<div><span class="detail-label">Description:</span> {description:htmlEncode}</span></div><br>',
                                    '<div><span class="detail-label">Groups:</span> {[this.renderGroups(values)]}</div>',
                                    '<div><span class="detail-label">Created:</span> <span {createdDate:this.renderToolTip}>{prettyCreatedDate:this.renderDate}</span></div>',
                                    '<div><span class="detail-label">Author:</span> {[this.renderUserRealName(values)]}</div>',
                                    '<div><span class="detail-label">Last Modified:</span> <span {editedDate:this.renderToolTip}>{prettyEditedDate:this.renderDate}</span></div>',
                                '</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</tpl>',
                {
                    compiled: true,
                    renderDate: function(value) {
                        return value ? value : '';
                    },
                    renderToolTip: function (value) {
                        var str = 'data-qtip="' + value + '"';

                        return str;
                    },
                    renderUserRealName: function(values) {
                        var createdBy = values.createdBy;
                        return (createdBy.userRealName ? Ext.htmlEncode(createdBy.userRealName) : 'System')
                    },
                    renderGroups: function(values) {
                        var groups = values.groups;
                        var stack = values.stack;
                        var retVal = '';
                        if (!stack && groups && groups.length > 0) {
                            for (var i = -1; ++i < groups.length;) {
                                retVal += Ext.htmlEncode(groups[i].name) + ', ';
                            }
                            retVal = retVal.substring(0, retVal.length - 2);
                        }
                        return retVal;
                    },
                    
                    renderIconBlock: function(values) {
                        var iconClass = "dashboard-default-icon-layout";
                        var retVal = '<div class="dashboard-icon ' + iconClass + '"></div>';
                        return retVal;
                    },
                    renderDetailHeaderBlock: function(values){
                        var isGroupDashboard = values.isGroupDashboard;
                        var title = values.name;

                        var retVal = '<div class="dashboard-title-block">';
                        retVal += '<div class="dashboard-title detail-title">' + Ext.htmlEncode(title) + '</div>';
                        retVal += (isGroupDashboard) ? '<div>This is a group dashboard.</div>' : '';
                        retVal += '</div>';
            
                        return  retVal;
                    }
                }
            ),
			emptyText: 'No page selected',
            itemSelector: 'div.selector',
            autoScroll: 'true'
        });
        
        this.items = [this.viewDashboard];
        
        this.callParent(arguments);
    },
    
    loadData: function(record) {
        this.viewDashboard.store.loadData([record], false);
        this.loadedRecord = record;
    },
    
    removeData: function() {
        this.viewDashboard.store.removeAll(false);
        this.loadedRecord = null;
    }
    
});