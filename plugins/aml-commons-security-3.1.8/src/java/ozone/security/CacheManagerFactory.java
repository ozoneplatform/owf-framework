package ozone.security;

import net.sf.ehcache.CacheManager;

/**
 * This class creates the ehcache CacheManager used by various
 * classes in this project
 */

public class CacheManagerFactory {
    private static CacheManager manager = null;

    //public static final String CACHE_CONFIGURATION_FILE = "/ehcache-security.xml";

    /**
     * @return A reference to the cache manager used by the security project
     */
    public static synchronized CacheManager getCacheManager() {
        if (manager == null) {
            //manager = new CacheManager(CacheManagerFactory.class
                    //.getResource(CACHE_CONFIGURATION_FILE));
            
            //use the default cache manager, or create a new one if there isn't one already
            manager = (CacheManager.ALL_CACHE_MANAGERS.size() > 0 ?
                    CacheManager.ALL_CACHE_MANAGERS.get(0) : 
                    CacheManager.getInstance());
        }

        return manager;
    }
}
