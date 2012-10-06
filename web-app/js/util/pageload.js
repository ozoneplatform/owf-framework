/**
 * @ignore
 */
var Ozone = Ozone || {};
/**
 * @ignore
 */
Ozone.util = Ozone.util || {};
/**
 * @namespace
 */
Ozone.util.pageLoad = Ozone.util.pageLoad || {};

/**
 * @field
 * @description enable or disable the automatic sending of loadtime
 */
Ozone.util.pageLoad.autoSend = true;

/**
 * @field
 * @description holds the current date time, before the onload of the widget
 */
Ozone.util.pageLoad.beforeLoad = (new Date()).getTime();

/**
 * @field
 * @description holds current date time after the onload of the widget.  this value will be set after onload
 */
Ozone.util.pageLoad.afterLoad = null;


Ozone.util.pageLoad.calcLoadTime = function(time) {
  /**
   * @field
   * @description Holds the load time of the widget.  This may be altered to allow the widget to determine it's load time.
   *   loadTime is sent via the Eventing API, if altering this value do so before Eventing is initialized
   */
  Ozone.util.pageLoad.loadTime = (time != null ? time : Ozone.util.pageLoad.afterLoad) - Ozone.util.pageLoad.beforeLoad;
  return Ozone.util.pageLoad.loadTime;
};
