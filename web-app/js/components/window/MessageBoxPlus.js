Ext.define('Ozone.window.MessageBoxPlus', {
    extend: 'Ext.window.MessageBox',

    alias: 'widget.messageboxplus',
    
    doAutoSize: function() {
        this.callParent(arguments);
        var me = this
        var x = me.getPosition(true)[0];
        if (x<0) {
            me.setSize('95%', me.getHeight()*1.5);
            me.center();
        }
        return me;
    }
});