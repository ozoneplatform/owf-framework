
package ozone.owf.cache;

import org.junit.After
import org.junit.Before
import org.junit.Test
import org.ozoneplatform.messaging.payload.AmlMessage
import org.springframework.aop.aspectj.RuntimeTestWalker.ThisInstanceOfResidueTestVisitor;

class OwfMessageCacheTests {

    
    OwfMessageCache cache
    
    def keys = []
    
    @Before
    public void setup(){
        this.cache = new OwfMessageCache()
        
        (0..6).each{ idx ->
            Calendar calendar = new GregorianCalendar()
            calendar.add(GregorianCalendar.DAY_OF_WEEK, idx)
            def date = calendar.getTime()
            Thread.sleep(1000)
            this.cache.add(new AmlMessage(timestamp : date , body: "Message ${idx}"))
            keys << date
        }

    }
       
    
    @Test
    public void testGetMessages(){
        assert this.cache.getMessages(keys[3]).size() == 4  //items 3-6 returned
    }

    
    //@Test
    public void cacheMaxSize(){
        (0..1000).each{ idx ->
            Calendar calendar = new GregorianCalendar()
            calendar.add(GregorianCalendar.DAY_OF_WEEK, idx)
            def date = calendar.getTime()
            this.cache.add(new AmlMessage(timestamp : date , body: "Message ${idx}"))
            assert this.cache.items.size() <= this.cache.getMaxSize()
        }
    }
    
    @Test
    public void testCacheContainsDate(){
        Calendar calendar 
        calendar = new GregorianCalendar()
        calendar.add(GregorianCalendar.DAY_OF_WEEK, -100)

        //This is too old the cache will not have it
        assert this.cache.contains(calendar.getTime()) == false
        
        keys.each {     
            assert this.cache.contains(it) == true
        }
      
    }
    
    @Test
    public void testPurge(){
        //Get the initial size of the map so we can compare later
        int initSize = this.cache.items.size()
        (1..6).each{ idx ->
            Calendar calendar = new GregorianCalendar()
            calendar.add(GregorianCalendar.DAY_OF_WEEK, -idx)
            Thread.sleep(1000)
            this.cache.add(new AmlMessage(timestamp : calendar.getTime() , body: "LOWEER MESSAGE ${idx}"))
        }
        this.cache.purge()
        
        assert this.cache.items.size() == initSize
    }
    
    
    @Test
    public void testMap(){
        SortedMap map = new TreeMap()
        map.put(0, "0")
        map.put(1, "1")
        map.put(3, "3")
        map.put(4, "4")
        map.put(5, "5")
        
        println map.tailMap(2)
        println map.headMap(2)
    }
}
