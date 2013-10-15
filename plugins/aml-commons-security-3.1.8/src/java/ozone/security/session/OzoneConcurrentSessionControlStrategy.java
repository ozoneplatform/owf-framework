package ozone.security.session;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.apache.log4j.Logger;

import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Cache;
import net.sf.ehcache.Element;


import org.springframework.security.web.authentication.session.ConcurrentSessionControlStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationException;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.Authentication;

import ozone.security.CacheManagerFactory;

/**
 * Subclass of ConcurrentSessionControlStrategy that is more robust than the default implementation.
 *
 * Overrides allowableSessionsExceeded to better handle to case where more than one too many
 * sessions has been created (which appears to happen as a result of some sort of race condition).
 *
 */

public class OzoneConcurrentSessionControlStrategy extends ConcurrentSessionControlStrategy {

    private static final Logger log = 
        Logger.getLogger(OzoneConcurrentSessionControlStrategy.class);

    //name of the cache in which the configured max sessions value is stored
    private static final String CACHE_NAME = "allowedSessions";

    //we are only storing a single value in the cache, so the key doesn't really matter,
    //but it needs to be something.
    private static final String CACHE_KEY = "CACHE_KEY";


    //using ehcache to propogate changes to the number of allowed sessions across
    //cluster nodes.  This cache should only ever have one value in it
	private Cache allowedSessionsCache;

    /*
     * Comparator used to sort SessionInformations by recency
     */
    private static class SessionComparator implements Comparator<SessionInformation> {
        public int compare(SessionInformation o1, SessionInformation o2) {
            return o1.getLastRequest().compareTo(o2.getLastRequest());
        }
    }

    private SessionComparator comparator = new SessionComparator();
    private boolean exceptionIfMaximumExceeded = false;


    public OzoneConcurrentSessionControlStrategy(SessionRegistry sessionRegistry) {
        super(sessionRegistry);
        allowedSessionsCache = CacheManagerFactory.getCacheManager().getCache(CACHE_NAME);
    }

    /**
     * This method has been copied from ConcurrentSessionControlStrategy and modified to
     * better ensure that more that the allowed number of sessions are never valid
     * at the same time.
     *
     * @see ConcurentSessionControlStrategy.allowableSessionsExceeded
     */
    protected void allowableSessionsExceeded(List<SessionInformation> sessions, 
            int allowableSessions, SessionRegistry registry) 
            throws SessionAuthenticationException {
        if (exceptionIfMaximumExceeded || (sessions == null)) {
            throw new SessionAuthenticationException(messages.getMessage(
                    "ConcurrentSessionControlStrategy.exceededAllowed",
            new Object[] {new Integer(allowableSessions)},
                "Maximum sessions of {0} for this principal exceeded"));
        }

        //BEGIN CUSTOMIZATIONS

        log.debug("allowableSessionExceeded. allowed: " + allowableSessions + " Current: " + 
                sessions.size());

        //sort the session by recency, increasing
        Collections.sort(sessions, comparator);

        //note - sessions does not include the new session being authenticated
        int sessionsToExpire = sessions.size() - allowableSessions + 1;

        //remove the first sessionToExpire sessions from the sorted list
        for (int i = 0; i < sessionsToExpire; i++) {
            sessions.get(i).expireNow();
        }
    }

    public void setExceptionIfMaximumExceeded(boolean exceptionIfMaximumExceeded) {
        this.exceptionIfMaximumExceeded = exceptionIfMaximumExceeded;
        super.setExceptionIfMaximumExceeded(exceptionIfMaximumExceeded);
    }

    /**
     * Stores the maximum sessions value in the cache so that it can be picked up
     * by all nodes in the cluster
     */
    public void setMaximumSessions(int maxSessions ) {
        allowedSessionsCache.put(new Element(CACHE_KEY, new Integer(maxSessions)));
    }

    /**
     * @return the max sessions value that is stored in the cache
     */
    public int getMaximumSessionsForThisUser(Authentication a) {
        int retval = (Integer)allowedSessionsCache.get(CACHE_KEY).getValue();
        log.debug("getMaximumSessionsForThisUser returning " + retval);
        return retval;
    }
}
