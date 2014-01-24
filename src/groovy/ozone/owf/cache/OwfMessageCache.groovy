package ozone.owf.cache

import org.ozoneplatform.messaging.payload.AmlMessage

class OwfMessageCache {

    
    private SortedMap items = new TreeSet()
    
    
    public void add(AmlMessage message){
        items.put(message.sentDt, message)
    }
    
    
}
