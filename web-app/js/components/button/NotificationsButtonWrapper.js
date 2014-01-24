/**
 * A Ext wrapper for the NotificationsButton Backbone view
 */
Ext.define('Ozone.components.button.NotificationsButtonWrapper', {
    extend: 'Ozone.components.ExtBackboneViewWrapper',
    alias: 'widget.notificationsbutton',

    ViewClass: Ozone.views.notifications.NotificationsButton
});
