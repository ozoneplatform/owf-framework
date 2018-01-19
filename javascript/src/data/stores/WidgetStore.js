Ext.define('Ozone.data.WidgetStore',{
    extend:'Ext.data.Store',
    model: 'Ozone.data.WidgetDefinition',
    proxy: {
        type: 'ajax',
        url: Ozone.util.contextPath() + '/person/me/widget',

        //the components which use this store do not support paging yet, so these must be explicitly set to undefined
        //to disable paging params from being passed to the server
        limitParam: undefined,
        pageParam: undefined,
        startParam: undefined,

        reader: {
            type: 'json',
            root: 'rows'
        }
    },
    totalProperty:'results',

    findWidgetsByType: function (type) {
        var widgets = [];

        this.each(function (widget) {
            if(widget.data.widgetTypes[0].name === type) {
                widgets.push(widget);
            }
        });

        return widgets;
    }
});