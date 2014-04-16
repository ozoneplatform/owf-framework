
package ozone.owf.cache;

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
            Thread.sleep(200)
            this.cache.add(new AmlMessage(timestamp : date , body: "Message ${idx}"))
            keys << date
        }
    }
       
    
    @Test
    public void testGetMessages(){
        assert this.cache.getMessages(keys[6]).size() == 1  //item 6 returned
        assert this.cache.getMessages(keys[3]).size() == 4  //items 3-6 returned
        assert this.cache.getMessages(keys[0]).size() == 7  //items 1-6 returned
    }

    
    @Test
    public void testPurge(){
        //Get the initial size of the map so we can compare later
        int initSize = this.cache.items.size()
        (1..6).each{ idx ->
            Calendar calendar = new GregorianCalendar()
            calendar.add(GregorianCalendar.DAY_OF_WEEK, -idx)
            Thread.sleep(1000)
            this.cache.add(new AmlMessage(timestamp : calendar.getTime() , body: "LOWER MESSAGE ${idx}"))
        }
        this.cache.purge()
        
        assert this.cache.items.size() == initSize
    }
   

}
