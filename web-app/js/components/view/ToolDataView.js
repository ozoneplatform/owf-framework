Ext.define('Ozone.components.view.ToolDataView', {
    extend: 'Ozone.components.focusable.FocusableView',
    alias: 'widget.tooldataview',
    dataField: null,
    overItemCls: 'setting-over',
    trackOver: true,
    singleSelect: true,
    selectedItemCls: 'setting-over',
    itemSelector: 'div.tool',
    store: null,
    tpl: {},

    initComponent: function() {
        this.tpl = Ext.create('Ext.XTemplate',
            '<tpl for=".">',
                '<div class="tool" tabindex="0" data-qtip="{[Ext.htmlEncode(Ext.htmlEncode(values.name))]}">',
                    '<div class="thumb-wrap">',
                        '<img src="{image}" class="thumb">',
                    '</div>',
                    '<div class="thumb-text">{[this.encodeAndEllipsize(values.name)]}</div>',
                '</div>',
            '</tpl>',
            {
                encodeAndEllipsize: function(str) {
                    //html encode the result since ellipses are special characters
                    return Ext.util.Format.htmlEncode(
                        Ext.Array.map (
                            //get an array containing the first word of rowData.name as one elem, and the rest of name as another
                            Ext.Array.erase (/^([\S]+)\s*(.*)?/.exec(Ext.String.trim(str)), 0, 1),
                            function(it) {
                                //for each elem in the array, truncate it with an ellipsis if it is longer than 11 characters
                                return Ext.util.Format.ellipsis(it, 11);
                            }
                        //join the array back together with spaces
                        ).join(' ')
                    );
                }
            }
        );

        this.on('itemclick', this.onClick);
        this.on('itemKeyDown', this.onKeyDown);
        this.on(
            'itemmouseenter',
            function(view, record, item, index, e, eOpts) {
                var selModel = view.getSelectionModel();
                selModel.select([item]);
            }
        );

        this.callParent(arguments);
    },

    
    onClick: function(dataView, record, item) {
        this.up().callBtnHandler(record.data.name, item);
        return true;
    },
    
    onKeyDown: function(view, record, item, index, event, eOpts) {
        switch (event.getKey()) {
            case event.ENTER:
            case event.SPACE:
                this.up().callBtnHandler(record.data.name, item, true);
                return true;
        }
    }
});
