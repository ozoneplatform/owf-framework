var Ozone = Ozone || {};

/**
 * @class
 * @description Provides functions to log messages and objects
 * @Ozone.log
 * 
 */
/*
 * The only function that can be called from gadgets is Ozone.log.gadgetLog
 */
Ozone.log = {
	
};

Ozone.log.logEnabled = false; 

Ozone.log.defaultLogger = null; 
Ozone.log.defaultAppender = null; 

Ozone.log.version = Ozone.version.owfversion + Ozone.version.logging;

/**
 * @Ozone.log.getLogger
 * @description Get a logger by name, if the logger has not already been created it will be created
 * @param {String} loggerName
 */
Ozone.log.getLogger = function(loggerName) { 
    return log4javascript.getLogger(loggerName);
};

/**
 * @Ozone.log.setEnabled
 * @description Enable/Disable logging for the OWF application
 * @param {Boolean} enabled true will enable logging false will disable
 */
Ozone.log.setEnabled = function(enabled){
	log4javascript.setEnabled(enabled);
};

/**
 * @Ozone.log.getDefaultLogger
 * @description Get OWF's default logger
 */
//The default logger cannot be used from gadgets
Ozone.log.getDefaultLogger = function() {
	if (!Ozone.log.defaultLogger) {
		
	
		var defaultLoggerName = "[ozonedefault]"; 
		
		Ozone.log.defaultLogger =  Ozone.log.getLogger(defaultLoggerName);
		Ozone.log.defaultAppender = new log4javascript.PopUpAppender();
		Ozone.log.defaultAppender.setUseOldPopUp(true);
		Ozone.log.defaultAppender.setComplainAboutPopUpBlocking(false);
		// change the logging level here, for example:
		// Ozone.log.defaultAppender.setThreshold(log4javascript.Level.ERROR);
        Ozone.log.defaultAppender.setThreshold(log4javascript.Level.OFF);
		log4javascript.getRootLogger().addAppender(Ozone.log.defaultAppender);
		//Ozone.log.defaultAppender.setInitiallyMinimized(true);
		
		return Ozone.log.defaultLogger;
	} 
	
	return Ozone.log.defaultLogger;
};

/**
 * @description Launch the log window pop-up, this will re-launch the window in the event 
 * it has been closed
 */
Ozone.log.launchPopupAppender = function() {
	
	Ozone.log.defaultAppender.show();
	
	Ozone.log.getDefaultLogger().debug("Logger Window Lauched");
};


/*
 * Log messages from widgets
 * @param {Object} message
 */
Ozone.log.widgetLog = function() { 
    gadgets.rpc.call('..', 'Ozone.log',null, arguments);
};


if (typeof(Ext) != "undefined") {
	Ext.onReady(function(){
		gadgets.rpc.register('Ozone.log', function(args){
			var logger = Ozone.log.getDefaultLogger(); 
			logger.debug.apply(logger, args);
		});
	});
}
