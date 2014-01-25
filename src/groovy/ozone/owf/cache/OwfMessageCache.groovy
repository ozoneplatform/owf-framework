package ozone.owf.cache

import org.ozoneplatform.messaging.payload.AmlMessage

class OwfMessageCache {

    
    private SortedMap items
    
    private int MAX_CACHE_SIZE

    private Date lastReceivedTimeStamp
    
    public OwfMessageCache(){
        this(1500)
    }
        
    public OwfMessageCache(int maxSize){
        this.MAX_CACHE_SIZE = maxSize
        items = Collections.synchronizedSortedMap(new TreeMap())
    }    
    
    
    public void add(AmlMessage message){
        purge()
        items.put(message.timestamp, message)
        lastReceivedTimeStamp = new Date()
    }
    
    
    //If the date is higher than 
    public def getMessages(Date start){
        
        return this.items.tailMap(start).values()
    }
    
    private void purge(){
        while(this.items.size() > MAX_CACHE_SIZE - 1){
            this.items.remove(this.items.firstKey())
        }
    }
    
    public boolean contains(Date start){  
        if(this.items.isEmpty())
            return false
        if(start >= this.items.firstKey() && start <= this.items.lastKey()){
            return true
        }
        return false
    }
    
    public Date getLastReceivedTimeStamp(){
        return this.lastReceivedTimeStamp
    }
    
    public Integer getMaxSize(){
        return this.MAX_CACHE_SIZE
    }
}
