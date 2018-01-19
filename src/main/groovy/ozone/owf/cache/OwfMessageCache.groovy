package ozone.owf.cache

import org.ozoneplatform.messaging.payload.OzoneMessage


class OwfMessageCache {


    private SortedMap items

    private Date lastReceivedTimeStamp

    //This is in minutes
    private int expiration = 60

    public OwfMessageCache(){
        items = Collections.synchronizedSortedMap(new TreeMap())
    }


    public synchronized void add(OzoneMessage message){
        if(!message.timestamp)
            return
        items.put(message.timestamp, message)
        lastReceivedTimeStamp = new Date()
        purge()
    }


    //If the date is higher than
    public List getMessages(Date start){
        return new ArrayList(this.items.tailMap(start).values())
    }

    protected final void purge(){
        Calendar calendar = new GregorianCalendar()
        calendar.add(GregorianCalendar.MINUTE, -this.expiration) //Roll the date to now minus expiration minutes to find expired messages
        new ArrayList(this.items.headMap(calendar.getTime()).values()).each {
            this.items.remove(it.timestamp)
        }
    }

    public Date getLastReceivedTimeStamp(){
        return this.lastReceivedTimeStamp
    }

    public void setExpiration(int pollingSeconds){
        //We want the cache to be some multiple of the polling seconds...why not have it 60 times so that the cache in minutes
        //is 60*polling seconds
        this.expiration = pollingSeconds
    }

}
