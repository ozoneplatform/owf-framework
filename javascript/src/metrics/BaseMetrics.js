/**
 * @fileoverview Basic metrics capability.  Expectation is that new metrics will 
 *  likely be set up as separate files / separate sets.    
 */

/**
 * @namespace
 */
var Ozone = Ozone || {};

/**
 * @namespace
 */
Ozone.metrics = Ozone.metrics || {};

/**
 * @description Basic logging capability - meant to be called by other methods
 *    which transform or validate data  
 * @since OWF 3.8.0
 *
 * @param {String} userId
 * @param {String} userName
 * @param {String} metricSite Identifier, potentially URL, for source of metric - typically OWF instance
 * @param {String} componentName    
 * @param {String} componentId 
 * @param {String} componentInstanceId
 * @param {String} metricTypeId String describing metric - recommend package name construct
 * @param {String} metricData Any additional data for metric - do any necessary validation appropriate to metricTypeId before sending through 
 */
Ozone.metrics.logMetric = function(userId, userName, metricSite, componentName, componentId, componentInstanceId, metricTypeId, metricData) {
	var currentDate = new Date();
	
    Ozone.util.Transport.send({
        url: OWF.getContainerUrl() + '/metric',
        method: 'POST',
        onSuccess: function(response) {
        },
        autoSendVersion : false,
        content : {
          metricTime: currentDate.getTime(),
          userId: userId,
          userName: userName,
          site: metricSite,
          userAgent: navigator.userAgent,
          component: componentName,
          componentId: componentId,
          instanceId: componentInstanceId,
          metricTypeId: metricTypeId,
          widgetData: metricData
        }
    });
};

/**
 * @description Logs a set of metrics to the server all at once.  All
 * metrics passed into a call to this function will be logged in a single
 * HTTP request, instead of one request per metric
 * @since OWF 6.0
 *
 * @param {Array} metrics 
 * @param {String} metrics[*].userId
 * @param {String} metrics[*].userName
 * @param {Number} metrics[*].metricTime The time at which is metric was collected (in UNIX time)
 * @param {String} metrics[*].site Identifier, potentially URL, for source of metric - typically OWF instance
 * @param {String} metrics[*].component
 * @param {String} metrics[*].componentId 
 * @param {String} metrics[*].instanceId
 * @param {String} metrics[*].metricTypeId String describing metric - recommend package name construct
 * @param {String} metrics[*].widgetData Any additional data for metric - do any necessary validation appropriate to metricTypeId before sending through 
 * @param {String} metrics[*].userAgent Should be set to the user-agent string of the browser
 */
Ozone.metrics.logBatchMetrics = function(metrics) {
	var currentDate = new Date();
	
    Ozone.util.Transport.send({
        url: OWF.getContainerUrl() + '/metric',
        method: 'POST',
        onSuccess: function(response) {
        },
        autoSendVersion : false,
        content : {
        	data: metrics
        }
    });
};

/**
 * @description Log view of widget - see calls in dashboards
 * @since OWF 3.8.0
 *
 * @param {String} userId     - see Ozone.metrics.logMetric userId
 * @param {String} userName   - see Ozone.metrics.logMetric userName
 * @param {String} metricSite - see Ozone.metrics.logMetric metricSite
 * @param {Object} widget   
 */ 
Ozone.metrics.logWidgetRender = function(userId, userName, metricSite, widget) {

  // checking here, on the assumption we may save ourselves some validation time
  //   on any widget data validation (last param)
  if (Ozone.config.metric.enabled === true) {
      Ozone.metrics.logMetric(userId, userName, metricSite, widget.name, widget.widgetGuid, widget.id, "ozone.widget.view", "");
      }
};
