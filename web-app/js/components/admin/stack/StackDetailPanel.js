Ext.define('Ozone.components.admin.stack.StackDetailPanel', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.stackdetailpanel'],
    
    viewStack: null,
    
    initComponent: function() {
        
        this.viewStack = Ext.create('Ext.view.View', {
            store: Ext.create('Ext.data.Store', {
                storeId: 'storeStackItem',
                fields: [
                    { name: 'name', type: 'string' },
                    { name: 'description', type: 'string' },
                    { name: 'stackContext', type: 'string' }
                    // { name: 'imageUrl', type: 'string' }
                ]
            }),
            deferEmptyText: false,
            tpl: new Ext.XTemplate(
                '<tpl for=".">',
                    '<div class="selector">',
                        '<div id="detail-info" class="detail-info">',
                            '<div class="detail-header-block">',
                                // '<div class="detail-widget">',
                                //     '<div class="detail-icon">',
                                //         '<img src={imageUrl:this.renderImage} title="{name:htmlEncode}" class="detail-icon-image">',
                                //     '</div>',
                                // '</div>',
                                '<div class="detail-icon-block">',
                                    '<div class="detail-title">{name:htmlEncode}</div>',
                                '</div>',
                            '</div>',
                            '<div class="detail-block">',
                                '<div><span class="detail-label">Stack URL:</span></div>',
                                '<div><span class="detail-link">{stackContext:this.renderStackUrl}</span></div>',
                            '</div>',
                            '<div class="detail-block">',
                                '<div><span class="detail-label">Description:</span></div>',
                                '<div>{description:htmlEncode}</div>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</tpl>',
                {
                    compiled: true,
                    // renderImage: function(url) {
                    //     var contextPath = Ozone.util.contextPath();
                    //     if (!url.match(new RegExp('^/?' + contextPath + '/.*$', 'i')) && !url.match(new RegExp('^https?://.*', 'i'))) {
                    //         //url is not relative to the contextPath
                    //         if (url.indexOf('/') == 0) {
                    //         url = contextPath + url;
                    //         }
                    //         else {
                    //         url = contextPath + '/' + url;
                    //         }
                    //     }
                    //     return encodeURI(decodeURI(url));
                    // },
                    renderStackUrl: function(context) {
                        context = Ext.htmlEncode(context);
                        var url = OWF.getContainerUrl() + '/#stack=' + context;
                        return '<a href="' + url + '" target="_top">' + url + '</a>';
                    }
                }
            ),
			emptyText: 'No stack selected',
            itemSelector: 'div.selector',
            autoScroll: 'true'
        });
        
        this.items = [this.viewStack];
        
        this.callParent(arguments);
    },
    
    loadData: function(record) {
        this.viewStack.store.loadData([record], false);
    },
    
    removeData: function() {
        this.viewStack.store.removeAll(false);
    }
    
});