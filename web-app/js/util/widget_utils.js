var Ozone = Ozone || {};
/**
 * @namespace
 * @description Provides OWF utility methods for the widget developer
 * 
 */
Ozone.util = Ozone.util || {};

/**
 * @description This method informs a widget developer if their widget is running
 * in a Container, like OWF
 *
 * @returns  boolean true if the widget is inside a container, false otherwise.
 *
 */
Ozone.util.isInContainer = function() {
    var inContainer = false;

    //check window.name
    if (Ozone.util.parseJson) {
        var configParams = Ozone.util.parseWindowNameData();
        if (configParams != null
                 //is the fact that a json string was in window.name enough to determine the widget is in a container?
                //&& configParams.inContainer
                ) {
            inContainer = true;
        }
    }
    return inContainer;
};

/**
 * @description This method informs a widget developer if their widget is running 
 * from the OWF or from a direct URL call.
 * 
 * @returns  boolean true if the widget is inside OWF, false otherwise.
 *
 */
Ozone.util.isRunningInOWF = function() {
    var isInOwf = false;

    //check window.name
    if (Ozone.util.parseJson) {
        var configParams = Ozone.util.parseWindowNameData();
        if (configParams != null && configParams.owf) {
            isInOwf = true;
        }
    }
    return isInOwf;
};

/**
 * @private
 *
 * @description This method takes a string and removes the passed header from the front of it.
 * Used to convert a unique id attribute into a id that other functions and objects can use.
 * 
 * @param {String} id the id attribute value to be manipulated
 * @param {String} header the header to be removed from the id
 * 
 * @returns String the id minus the header. (Ex. parseID('header1', 'header') returns '1')
 * 
 */
Ozone.util.parseID = function(id, header) {
    return id.substring(0, header.length) == header ? id.substring(header.length) : id;
}

/**
 * @description This method returns flash/flex object from dom.
 * 
 * @returns  flash/flex object from dom
 *
 */
Ozone.util.getFlashApp = function(id) {
    id = id || Ozone.dragAndDrop.WidgetDragAndDrop.getInstance().getFlashWidgetId();
    if(!id)
        return;
    
    if (navigator.appName.indexOf ("Microsoft") !=-1) {
        return window[id];
        }
    else {
        return document[id];
    }
};