//todo remove this when the marketplace window is replaced, Ext 4.x toolbars already support paging
Ext.define('Ozone.components.marketplace.SortablePagingToolbar', {
    extend: 'Ext.toolbar.Paging',
    alias: 'widget.sortablepagingtoolbar',
    
    doLoad: function(start, params){
        pn = this.getParams();
        params = params || {};
        params[pn.start] = start;
        var o = this.getLoadParams(params);
        if (this.fireEvent('beforechange', this, o) !== false) {
            this.store.load({
                params: o
            });
        }
    },
    getLoadParams: function(params){
        var o = {}, pn = this.getParams();
        for (param in pn) {
            o[pn[param]] = this.store.lastOptions.params[pn[param]];
        }
        Ext.apply(o, params);
        return o;
    },
    doRefresh : function(){
        var current = this.store.currentPage;
        
        if (this.fireEvent('beforechange', this, current) !== false) {
        	this.store.loadPage(current, this.store.lastOptions.params);
    }
    }
});
