Ext.define('Ozone.components.window.CreateDashboardWindow', {
    extend: 'Ozone.layout.window.ManagerWindow',
    alias: [
        'widget.createdashboardwindow',
        'widget.Ozone.components.window.CreateDashboardWindow'
    ],

    title: null,
    headerText: null,

    constrain: Ext.isIE,
    constrainHeader: true,
    cls: "manageContainer x-window-system-window",
    draggable: false,
    shadow: false,
    closeAction: 'destroy',
    resizable: false,
    
    mixins: {
        escHelper: 'Ozone.components.focusable.EscCloseHelper'
    },

    dashboardContainer: null,
    existingDashboardRecord: null,
    existingStackRecord: null,
    ownerCt: null,
    stackId: null, // id of the parent Stack
    
    initComponent: function() {
        var me = this;

        var themeFontSize = Ozone.config.currentTheme.themeFontSize;

        // Decide between two window sizes, accommodating regular- and large-text themes.
        var windowWidth = themeFontSize <= 12 ? 500 : 700;
        var windowHeight =  Ext.isIE7 ? 550 : 530;

        var dashPanelHeight = me.ownerCt.getHeight();
        var dashPanelWidth = me.ownerCt.getWidth();

        if (me.height == null ) {
            me.height = (dashPanelHeight > 379) ? windowHeight : dashPanelHeight - 10;
        }
        if (me.width == null) {
            me.width = (dashPanelWidth > 559) ? windowWidth : dashPanelWidth - 10;
        }
        if (me.minHeight == null) {
            me.minHeight = 220;
        }

        me.items = [{
            xtype: 'owfCreateDashboardsContainer',
            dashboardContainer: me.dashboardContainer,
            hideViewSelectRadio: me.hideViewSelectRadio,
            winId: me.id,
            existingDashboardRecord: me.existingDashboardRecord,
            existingStackRecord: me.existingStackRecord,
            headerText: me.headerText,
            stackId: me.stackId,
            parentWindow: me
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
