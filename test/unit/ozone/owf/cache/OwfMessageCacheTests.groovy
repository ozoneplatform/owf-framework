
package ozone.owf.cache;

import org.junit.After
import org.junit.Before
import org.junit.Test
import org.ozoneplatform.messaging.payload.AmlMessage

class OwfMessageCacheTests {

    
    OwfMessageCache cache
    
    
    @Before
    public void setup(){
        this.cache = new OwfMessageCache()
    }
    
    @Test
    public void testAdd() {
        this.cache.add(new Date(), new AmlMessage())
    }

}
