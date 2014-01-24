package ozone.owf.cache

import org.ozoneplatform.messaging.payload.AmlMessage

class OwfMessageCache {

    
    SortedMap items = Collections.synchronizedSortedMap(new TreeMap())
    
    
    public void add(Date time, AmlMessage message){
        items.put(message.sentDt, message)
    }
    
    
}
