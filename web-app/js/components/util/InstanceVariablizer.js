/**
 * This plugin automates the process of creating instance
 * variables to hold references to specific subcomponents
 * within a container.  The container should add this plugin
 * the the config of the children that it is interested in, 
 * and the plugin will create instance variables on the 
 * container for each components that it is added to
 */
Ext.define('Ozone.components.util.InstanceVariablizer', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.instancevariablizer',

    //the component to add the instance variable to.
    //Should be set in the instantiation config
    container: null,

    init: function(childCmp) {
        var name =  childCmp.itemId || childCmp.initialConfig.id;

        if (!name)
            throw "Cannot add component as instace variable because it has no itemId or id";

        if (this.container[name])
            throw "Cannot add instance variable " + name + 
                " because a variable by that name already exists";

        this.container[name] = childCmp;
    }
});
