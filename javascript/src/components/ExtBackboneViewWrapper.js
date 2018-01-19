/* global Ext */
/*jshint strict:false */
;(function(Ext) {
    /**
     * A Ext wrapper for Backbone views
     */
    Ext.define('Ozone.components.ExtBackboneViewWrapper', {
        extend: 'Ext.Component',

        ViewClass: null,

        backboneArgs: null,

        //enable bootstrap css in backbone views
        cls: 'bootstrap-active',

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
})(window.Ext);
