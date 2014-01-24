/**
 * A Ext wrapper for Backbone views
 */
Ext.define('Ozone.components.ExtBackboneViewWrapper', {
    extend: 'Ext.Component',

    ViewClass: null,

    backboneArgs: null,

    initComponent: function() {
        this.callParent(arguments);
        this.backboneView = new this.ViewClass(this.backboneArgs);
    },

    onRender: function() {
        this.callParent(arguments);
        this.backboneView.render().$el.appendTo(this.getEl().dom);
    },

    onDestroy: function() {
        if (this.backboneView) this.backboneView.remove();
        this.callParent(arguments);
    }
});
