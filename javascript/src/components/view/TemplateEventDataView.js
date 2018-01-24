Ext.define('Ozone.components.view.TemplateEventDataView', {
    extend: 'Ext.view.View',
    alias: 'widget.templateeventdataview',
    
    initComponent: function(){
        this.callParent();
        this.addEvents("templaterendered");
    },
    refresh: function(){
        this.callParent();
        if (this.store.getRange().length > 0) 
            this.fireEvent("templaterendered", this);
    },
    update: function(htmlOrData, loadScripts, cb){
        this.callParent([htmlOrData, loadScripts, cb]);
        this.fireEvent("templaterendered", this);
    },
    bindStore: function(store, initial){
        this.suspendEvents();
        this.callParent([store, initial]);
        this.resumeEvents();
    }
});
