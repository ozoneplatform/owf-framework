Ext.define('Ozone.components.focusable.FocusCatch', {
    extend: 'Ext.Component',
    alias: 'widget.focuscatch',

    cls: 'focus-catch',
    listeners: {
        afterrender: function (cmp) {
            Ozone.components.focusable.Focusable.clearOutline(cmp.getEl());
        }
    }
});
