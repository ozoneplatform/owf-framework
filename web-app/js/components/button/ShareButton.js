/**
 * @ignore
 * @class Ozone.components.ShareButton
 * @extends Ext.Button
 */
Ext.define('Ozone.components.button.ShareButton', {
    extend: 'Ext.button.Button', /** @lends Ozone.components.button.ShareButton */
    alias: ['widget.owf-share-button', 'widget.Ozone.components.button.ShareButton'],
    
    DEFAULT_SHARE_BUTTON_TEXT: "Share",
    DEFAULT_SHARE_TOOLTIP_HEADER: Ozone.layout.tooltipString.shareTitle,
    DEFAULT_TOOLTIP_TEXT: Ozone.layout.tooltipString.shareContent,
    
    /*this must be set to the dashboard container's scope so that the share
     *button can access the active dashboard reference and so this window can
     *integrate itself with the window manager of the dashboard if one exists
     **/
    dashboardScope: null,
    
    /**
     * Defaults the share button settings.
     */
    initComponent: function(){
        if (!this.text) {
            this.text = this.DEFAULT_SHARE_BUTTON_TEXT;
        }
        
        if (!this.handler) {
            this.handler = this.openWindow;
            
        }
        if (!this.tooltip) {
            this.tooltip = {
                title: this.DEFAULT_SHARE_TOOLTIP_HEADER,
                text: this.DEFAULT_TOOLTIP_TEXT,
                width: 250
            }
        }
    },
    
    /**
     * Call to actually open the share window.
     */
    openWindow: function(){
        var myPopup = Ext.getCmp('export-win');

        this.dashboardScope.activeDashboard.saveToServer(true);
        
        // If the share dialogue is already open, don't do anything.
        if (myPopup) {
            myPopup.getEl().down('textarea').focus();
            return;
        }
        
        // Get config
        var dashboardConfig = this.dashboardScope.activeDashboard.config;
        
        // Create lovely window.
        myPopup = Ext.create('Ext.window.Window', Ext.apply({
            id: 'export-win',
            cls: 'manageContainer',
            title: Ozone.ux.DashboardMgmtString.exportDashboardConfig,
            width: 550,
            height: 500,
            closable: true,
            collapsible: false,
            draggable: true,
            maximizable: false,
            minimizable: false,
            resizable: true,
            layout: 'fit',
            shadow: false,
            items: [{
                xtype: 'textarea',
                id: 'json',
                hideLabel: true,
                readOnly: true,
                width: 550,
                height: 500,
                value: owfdojo.toJson(dashboardConfig, true),
                plugins: new Ozone.components.focusable.Focusable()
            }]
        },this.winConfig || {} ));
        
        myPopup.show();
        myPopup.center();
        myPopup.getEl().down('textarea').focus();
        
        
        // TODO determine if this is still desired.  It's a weird UX and IE6 works fine without the weird save dialog popping up'
        // Re-visit one day.  Done because IE6 sucks and shouldn't be supported anyway.
        // creates a pop-up save json file dialog.
        var elForm = document.createElement('form');
        var elInput = document.createElement('input');
        elInput.id = 'json';
        elInput.name = 'json';
        elInput.type = 'hidden';
        elInput.value = Ext.JSON.encode(dashboardConfig);
        elForm.appendChild(elInput);
        elForm.action = Ozone.util.contextPath() + '/servlet/ExportServlet';
        elForm.method = 'POST';
        elForm.enctype = elForm.encoding = 'multipart/form-data';
        document.body.appendChild(elForm);
        elForm.submit();
        document.body.removeChild(elForm);
        elForm = null;
        elInput = null;
    }
});
