/**
 * A custom global load mask for OWF
 */
Ext.define('Ozone.components.mask.LoadMask', { 
    extend: 'Ext.LoadMask',

    alias: 'ozoneloadmask',

    renderTpl: '<div class="x-window-system-window loading-mask-image"></div>' +
        '<div class="{msgCls}"></div>',

    msgCls: 'loading-mask-message',
    baseCls: 'loading-mask',

    floating: {
        shadow: false
    },

    /**
     * @cfg The zindexmanager that manages this component
     */
    zIndexManager: null,

    constructor: function() {
        var zIndexManager;

        this.callParent(arguments);

        //override overly generic renderSelector from parent class
        this.renderSelectors.msgEl = '.' + this.msgCls;

        zIndexManager = this.zIndexManager;

        this.on({
            afterrender: function(cmp) {
                zIndexManager.register(cmp);
            },
            show: function(cmp) {
                zIndexManager.bringToFront(cmp);
            }
        });
    }
});
