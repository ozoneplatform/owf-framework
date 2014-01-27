package ozone.owf.cache

import org.ozoneplatform.messaging.payload.AmlMessage

class OwfMessageCache {

    
    private SortedMap items
    
    private Date lastReceivedTimeStamp
    
    //This is in minutes
    private int expiration
    
    public OwfMessageCache(){
        items = Collections.synchronizedSortedMap(new TreeMap())
    }    
    
    
    public synchronized void add(AmlMessage message){
        items.put(message.timestamp, message)
        lastReceivedTimeStamp = new Date()
        purge()
    }
    
    
    //If the date is higher than 
    public def getMessages(Date start){        
        return new ArrayList(this.items.tailMap(start).values())
    }
    
    protected final void purge(){
        Calendar calendar = new GregorianCalendar()
        calendar.add(GregorianCalendar.MINUTE, -this.expiration) //Roll the date to now minus expiration minutes to find expired messages
        new ArrayList(this.items.headMap(calendar.getTime()).values()).each {
            this.items.remove(it.timestamp)
        }
    }
    
    public boolean contains(Date start){  
        if(this.items.isEmpty())
            return false
        def first = this.items.firstKey()
        def last = this.items.lastKey()
        return first <= start
    }
    
    public Date getLastReceivedTimeStamp(){
        return this.lastReceivedTimeStamp
    }
    
    public void setExpiration(int expiration){
        this.expiration = expiration
    }

}
