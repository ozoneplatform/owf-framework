Ext.define('Ozone.components.admin.dashboard.DashboardDetailPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.dashboarddetailpanel', 'widget.dashboarddetail'],
    
    loadedRecord: null,

    tpl: new Ext.XTemplate(
            '<tpl for=".">',
                '<div id="detail-info" class="detail-info">',
                    '<div class="detail-header-block">',
                        '{[this.renderDetailHeaderBlock(values)]}',
                    '</div>',
                    '<div class="detail-block">',
                        '<div><span class="detail-label">Owner:</span> {user.userId}</div>',
                        '{[this.renderGroups(values)]}',
                        '<div><span class="detail-label">Created:</span> {createdDate:this.renderDate}</div>',
                        '<div><span class="detail-label">Modified:</span> {editedDate:this.renderDate}</div>',
                    '</div>',
                    '<div><span class="detail-label">Description:</span></div>',
                    '<div>{description:htmlEncode}</div>',
                '</div>',
            '</tpl>',
            {
                compiled: true,
                renderDate: function(value) {
                    return value;
                },
                renderDetailHeaderBlock: function(values){
                    var createdBy = values.createdBy;
                    var createdByName = createdBy.userRealName ? createdBy.userRealName : '';
                    var title = values.name;
                    var dashboardLayoutList = values.EDashboardLayoutList; //List of valid ENUM Dashboard Layout Strings
                    var dashboardLayout = values.layout; //current dashboard layout string
                    var iconClass = "dashboard-default-icon-layout";
                    
                    // if(dashboardLayout && dashboardLayoutList){
                    //     if(dashboardLayoutList.indexOf(dashboardLayout) != -1){
                    //         iconClass = "dashboard-icon-layout-" + dashboardLayout;
                    //     }
                    // }
                    
                    var retVal = '<div class="dashboard-icon ' + iconClass +'"></div>';
                    retVal += '<div class="dashboard-title-block">';
                    retVal += '<div class="dashboard-title detail-title">' + Ext.String.htmlEncode(title) + '</div>';
                    retVal += '<div class="detail-label">by:<span class="dashboard-created-by-label">' + createdByName + '</span></div>';
                    retVal += '</div>';
        
                    return  retVal;
                },
                renderGroups: function(values) {
                    var retVal = '';
                    var groups = '';
                    if (values.groups && values.groups.length > 0) {
                        for (var i=0; i<values.groups.length; i++) {
                            groups += values.groups[i].name + ', ';
                        }
                        if (groups.length > 2) groups = groups.substring(0, groups.length - 2);
                        retVal += '<div><span class="detail-label">Groups:</span> ' + groups + '</div>';
                    }
                    return retVal;
                }
            }
    ),
    
    loadData: function(record) {
        this.loadedRecord = record;
        if(this._isHidden) {
            this.show();
        }
        this.tpl.overwrite(this.body, record.data);
    },

    clear: function() {
        this.loadedRecord = null;
        this.hide();
        this._isHidden = true;
    }
    
});