Ext.define('Ozone.components.layout.container.HBox', {

    alias: ['layout.owfhbox'],
    extend: 'Ext.layout.container.HBox',

    /**
     * allow the use of a passed in overflowHandler
     * @private
     */
    initOverflowHandler: function() {
       //if one was already defined use that otherwise call parent function which will always create an overflowHandler
       if (this.overflowHandler == null) {
         this.callParent(arguments);
       }
       else if (typeof this.overflowHandler == 'string'){
         this.overflowHandler = Ext.create(this.overflowHandler, this);
       }
    }
});