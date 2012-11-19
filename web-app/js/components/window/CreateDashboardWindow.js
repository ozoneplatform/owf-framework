Ext.define('Ozone.components.window.CreateDashboardWindow', {
    extend: 'Ozone.layout.window.ManagerWindow',
    alias: [
        'widget.createdashboardwindow',
        'widget.Ozone.components.window.CreateDashboardWindow'
    ],

    title: Ozone.layout.tooltipString.createDashboardTitle,

    constrain: Ext.isIE,
    constrainHeader: true,
    cls: "manageContainer",
    draggable: true,
    closeAction: 'destroy',
    
    mixins: {
        escHelper: 'Ozone.components.focusable.EscCloseHelper'
    },

    dashboardContainer: null,
    existingDashboardModel: null,
    ownerCt: null,
    
    initComponent: function() {
        var me = this;

        var dashPanelHeight = me.ownerCt.getHeight();
        var dashPanelWidth = me.ownerCt.getWidth();

        if (me.height == null ) {
            me.height = (dashPanelHeight > 379) ? 370 : dashPanelHeight - 10;
        }
        if (me.width == null) {
            me.width = (dashPanelWidth > 559) ? 550 : dashPanelWidth - 10;
        }
        if (me.minHeight == null) {
            me.minHeight = 250;
        }

        me.items = [{
            xtype: 'owfCreateDashboardsContainer',
            dashboardContainer: me.dashboardContainer,
            hideViewSelectRadio: me.hideViewSelectRadio,
            winId: me.id,
            existingDashboardRecord: me.existingDashboardRecord
        }];

        me.callParent();

        me.on('afterrender', me.setupModalFocus, me, {single: true});
        me.on('show', me.focusFirstEl, me);

        // fires 'cancel' event when user cancels editing dashboard
        me.addEvents('cancel');
    },

    setupModalFocus: function() {
        this.setupFocus(this.down('textfield').inputEl, this.down('#cancelBtn').getEl());
    },

    focusFirstEl: function() {
        this.down('textfield').inputEl.focus(250);
    }
});
