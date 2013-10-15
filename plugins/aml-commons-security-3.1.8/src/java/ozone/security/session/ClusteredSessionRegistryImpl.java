package ozone.security.session;

/**
 * This class is based on the example code posted at 
 * http://scalejava.blogspot.com/2012/12/clustered-spring-sessionregistry.html.
 *
 * It implements the spring SessionRegistry in a way that can be clustered
 * using ehcache
 */

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpSession;

import net.sf.ehcache.Cache;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.CacheManager;
import net.sf.ehcache.Element;
import net.sf.ehcache.event.CacheEventListener;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.security.core.session.SessionDestroyedEvent;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.web.session.HttpSessionDestroyedEvent;
import org.springframework.util.Assert;

import ozone.security.CacheManagerFactory;

public class ClusteredSessionRegistryImpl implements SessionRegistry, ApplicationListener<SessionDestroyedEvent> {

	protected final Log logger = LogFactory.getLog(ClusteredSessionRegistryImpl.class);

    private static final String CACHE_NAME = "sessionIds";

	private CacheManager cacheManager;
	private Cache sessionIds;


    /**
     * Implements the event listening needed to reattach a ClusteredSessionInformation
     * to this SessionRegistry.
     *
     * Unfortunately, the ehcache API requires us to implement a bunch of extra functions
     * for listening to other events that we aren't interested in
     */
    private class CacheListener implements CacheEventListener {
        public Object clone() { return this.clone(); }
        public void dispose() {}
        public void notifyElementEvicted(Ehcache c, Element e) {}
        public void notifyElementExpired(Ehcache c, Element e) {}
        public void notifyElementRemoved(Ehcache c, Element e) {}
        public void notifyRemoveAll(Ehcache c) {}

        /**
         * Set the sessionregistry on the newly added element.  For elements created
         * by this node, this should have no effect.  For element received from other
         * cluster nodes, this sets the registry to allow changes to be sent back
         */
        private void setSessionRegistry(Element element) {
            ClusteredSessionInformation info = (ClusteredSessionInformation)element.getValue();

            if (!info.hasSessionRegistry()) {
                info.setSessionRegistry(ClusteredSessionRegistryImpl.this);
                logger.debug("setting session registry on element- " + info.getSessionId());
            }
        }

        public void notifyElementPut(Ehcache cache, Element element) {
            setSessionRegistry(element);
        }

        public void notifyElementUpdated(Ehcache c, Element element) {
            setSessionRegistry(element);
        }
    }

    public ClusteredSessionRegistryImpl() {
        cacheManager = CacheManagerFactory.getCacheManager();

        sessionIds = cacheManager.getCache(CACHE_NAME);
        sessionIds.getCacheEventNotificationService().registerListener(this.new CacheListener());
    }

	@Override
	public void onApplicationEvent(SessionDestroyedEvent event) {
		logger.debug("onApplicationEvent");
		if (event instanceof HttpSessionDestroyedEvent) {
			String sessionId = ((HttpSession) event.getSource()).getId();
			removeSessionInformation(sessionId);
		}
	}

	@Override
	public List<Object> getAllPrincipals() {
		logger.debug("getAllPrincipals");
        Map allSessions = sessionIds.getAllWithLoader(sessionIds.getKeys(), null);
        Set<Object> principals = new HashSet<Object>();

        for (Object valObj : allSessions.values()) {
            SessionInformation info = (SessionInformation)valObj;
            principals.add(info.getPrincipal());
        }
        
        List<Object> principalsList = new ArrayList<Object>(principals.size());
        principalsList.addAll(principals);

        return principalsList;
	}

	@Override
	public List<SessionInformation> getAllSessions(Object principal, boolean includeExpiredSessions) {
		logger.debug("Called with includeExpiredSession "+includeExpiredSessions);

		Set<String> sessionsUsedByPrincipal = getSessionIds(principal);
		List<SessionInformation> list = new ArrayList<SessionInformation>();
		Iterator<String> iter = sessionsUsedByPrincipal.iterator();

		while (iter.hasNext()) {
			String sessionId = iter.next();
			SessionInformation sessionInformation = getSessionInformation(sessionId);

			if (includeExpiredSessions || !sessionInformation.isExpired()) {
				list.add(sessionInformation);
			}
		}
		logger.debug("List size "+list.size());

		return list;
	}
	
    private Set<String> getSessionIds(Object principal) {
        logger.debug("sessionIds.getKeys(): " + sessionIds.getKeys());
        Map<Object, SessionInformation> collection = sessionIds.getAllWithLoader(sessionIds.getKeys(), null);
        Set<String> ids = new HashSet<String>();

        for (SessionInformation info : collection.values()) {
            if (info != null && info.getPrincipal().equals(principal)) {
                ids.add(info.getSessionId());
            }
        }

        return ids;
    }
	
	@Override
	public SessionInformation getSessionInformation(String sessionId) {
		Assert.hasText(sessionId, "SessionId required as per interface contract");
    	Element element = sessionIds.get(sessionId);
    	if(element == null) {
    		logger.debug("Session was null");
    		return null;
    	}
    	else{
    		SessionInformation session = (SessionInformation) element.getValue();
    		logger.debug("getSessionInformation: Returning session: "+session.getSessionId() + " principal  "+session.getPrincipal()+ " session expired "+session.isExpired());
    		return session;
    	}
	}
	
	@Override
	public void refreshLastRequest(String sessionId) {
        SessionInformation info = getSessionInformation(sessionId);
        if (info != null) {
            info.refreshLastRequest();
        }
	}
	
	@Override
	public void registerNewSession(String sessionId, Object principal) {
		Assert.hasText(sessionId, "SessionId required as per interface contract");
		Assert.notNull(principal, "Principal required as per interface contract");
		logger.debug("registerNewSession: registering session "+sessionId+" principal "+principal);
		
		if (getSessionInformation(sessionId) != null) {
			logger.debug("registerNewSession: Calling remove session");
			removeSessionInformation(sessionId);
		}
		
        putSessionInformation(new ClusteredSessionInformation(principal, sessionId, new Date(), 
            this));
	}

	
	@Override
	public void removeSessionInformation(String sessionId) {
		Assert.hasText(sessionId, "SessionId required as per interface contract");
		logger.debug("About to remove session "+sessionId);

        sessionIds.remove(sessionId);
	}

    private void putSessionInformation(SessionInformation info) {
		Element element = new Element (info.getSessionId(), info);
		sessionIds.put(element);
    }

    /**
     * Used to save updates to the session information to the cache.
     * @param info A SessionInformation object describing a session which
     * is already stored in the cache.  The old SessionInformation in the cache
     * will be replaced with this one.
     *
     * @throws IllegalArgumentException if the passed-in info does not 
     * describe a session that is already present
     */
    private void updateSessionInformation(SessionInformation info) {
        logger.debug("Updating session info for " + info.getSessionId());
        SessionInformation oldInfo = getSessionInformation(info.getSessionId());
        if (oldInfo == null) {
            throw new IllegalArgumentException();
        }
        else {
            putSessionInformation(info);
        }
    }

    /**
     * An extension of the SessionInformation class that pushes changes to itself
     * back to the cache so that they show up throughout the cluster
     */
    private static class ClusteredSessionInformation extends SessionInformation {
        //the containing instance.  This is done as an explicit variable, instead
        //of making this class non-static, because it needs to handle serialization
        private transient ClusteredSessionRegistryImpl sessionRegistry;

        public ClusteredSessionInformation(Object principal, String sessionId, Date lastRequest,
                ClusteredSessionRegistryImpl sessionRegistry) {

            super(principal, sessionId, lastRequest);
            setSessionRegistry(sessionRegistry);
        }

        public void setSessionRegistry(ClusteredSessionRegistryImpl sessionRegistry) {
            this.sessionRegistry = sessionRegistry;
        }

        public boolean hasSessionRegistry() {
            return sessionRegistry != null;
        }

        public void refreshLastRequest() {
            super.refreshLastRequest();
            push();
        }


        public void expireNow() {
            super.expireNow();
            push();
        }

        /**
         * Updates this SessionInformation in the SessionRegistry
         */
        private void push() {
            sessionRegistry.updateSessionInformation(this);
        }
    }
}
