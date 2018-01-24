package ozone.owf.grails

import org.apache.log4j.Logger

/**
 * This class is to be used specifically for auditing web requests; messages are assumed to contain
 * all necessary information including timestamp and are not decorated whatsoever in the log files.
 */
public class AuditOWFWebRequestsLogger {

    static Logger logger = Logger.getLogger(AuditOWFWebRequestsLogger)

    def log(message) {
        logger.info(message)
    }

}
