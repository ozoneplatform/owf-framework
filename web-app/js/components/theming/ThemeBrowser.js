Ext.define('Ozone.components.theming.ThemeBrowser', {
    extend: 'Ext.view.View',
    alias: 'widget.themebrowser',
    
    uses: 'Ext.data.Store',
    
    cls: 'owf-view',
    singleSelect: true,
    trackOver: true,
    overItemCls: 'x-view-over',
    itemSelector: 'div.thumb-wrap',
    
    tpl: [
            '<tpl for=".">',
                '<div class="thumb-wrap">',
                    '<div class="thumb">',
                        '<img src="{thumb}" />',
                    '</div>',
                    '<span>{display_name}</span>',
                '</div>',
            '</tpl>'
    ],
    
    initComponent: function() {
        this.store = Ext.create('Ext.data.Store', {
            fields: ['name', 'display_name', 'author', 'contact_email', 'created_date', 'modified_date', 'description', 'css', 'base_url', 'thumb', 'screenshots'],
            proxy: {
                type: 'ajax',
                url: Ozone.util.contextPath() + '/themes/'
            },
            autoLoad: true,
            sorters: [{
                property: 'name'
            }],
            sortOnLoad: true
        });
        
        this.callParent(arguments);

        this.on('afterrender', function(cmp) {
            Ozone.components.focusable.Focusable.setupFocus(cmp.getEl());
        });

    }
});
