Ext.define('Ozone.components.admin.dashboard.DashboardDetailPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.dashboarddetailpanel', 'widget.dashboarddetail'],
    
    viewDashboard: null,
    loadedRecord: null,
    
    initComponent: function() {
        
        this.viewDashboard = Ext.create('Ext.view.View', {
            store: Ext.create('Ext.data.Store', {
                storeId: 'storeDashboardItem',
                fields: [
                    { name: 'name', type: 'string' },
                    { name: 'layout',  type: 'string' },
                    { name: 'EDashboardLayoutList',  type: 'string' },
                    { name: 'description', type: 'string' },
                    { name: 'createdDate', type: 'string' },
                    { name: 'editedDate', type: 'string' },
                    { name: 'createdBy', model: 'User' }
                ]
            }),
            deferEmptyText: false,
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="selector">',
                        '<div id="detail-info" class="detail-info">',
                        	'<div class="detail-header-block">',
                        		'{[this.renderDetailHeaderBlock(values)]}',
                        	'</div>',
                            '<div class="detail-block">',
                                '<div><span class="detail-label">Created:</span> {createdDate:this.renderDate}</div>',
                                '<div><span class="detail-label">Modified:</span> {editedDate:this.renderDate}</div>',
                            '</div>',
                            '<div><span class="detail-label">Description:</span></div>',
                            '<div>{description:htmlEncode}</div>',
                        '</div>',
                    '</div>',
                '</tpl>',
                {
                    compiled: true,
                    renderDate: function(value) {
						return value;
                    },
                    renderDetailHeaderBlock: function(values){
                    	var createdBy = values.createdBy;
                    	var title = values.name;
			            var dashboardLayoutList = values.EDashboardLayoutList; //List of valid ENUM Dashboard Layout Strings
			            var dashboardLayout = values.layout; //current dashboard layout string
						var iconClass = "dashboard-default-icon-layout";
			            
			            // if(dashboardLayout && dashboardLayoutList){
			            // 	if(dashboardLayoutList.indexOf(dashboardLayout) != -1){
			            // 		iconClass = "dashboard-icon-layout-" + dashboardLayout;
			            // 	}
			            // }
			            
			            var retVal = '<div class="dashboard-icon ' + iconClass +'"></div>';
			            retVal += '<div class="dashboard-title-block">';
			            retVal += '<div class="dashboard-title detail-title">' + Ext.String.htmlEncode(title) + '</div>';
			            retVal += '<div class="detail-label">by:<span class="dashboard-created-by-label">' + (createdBy.userRealName ? createdBy.userRealName : '') + '</span></div>';
			            retVal += '</div>';
			
			            return  retVal;
                    }
                }
            ),
			emptyText: 'No dashboard selected',
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