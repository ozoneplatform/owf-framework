package ozone.owf.cache

import spock.lang.Ignore
import spock.lang.Specification

import org.ozoneplatform.messaging.payload.OzoneMessage

// TODO: Slow test - can this be sped up?

@Ignore
class OwfMessageCacheSpec extends Specification {

    OwfMessageCache cache

    List<Date> keys = []

    Date startTime

    void setup(){
        startTime = (new GregorianCalendar()).getTime()

        cache = new OwfMessageCache()
        (0..6).each{ idx ->
            Calendar calendar = new GregorianCalendar()
            calendar.add(GregorianCalendar.DAY_OF_WEEK, idx)
            Date date = calendar.getTime()
            Thread.sleep(200)
            cache.add(new OzoneMessage(timestamp : date , body: "Message ${idx}"))
            keys << date
        }
    }


    void testGetMessages() {
        expect:
        cache.getMessages(keys[6]).size() == 1  //item 6 returned
        cache.getMessages(keys[3]).size() == 4  //items 3-6 returned
        cache.getMessages(keys[0]).size() == 7  //items 1-6 returned
    }


    void testPurge() {
        given:
        int initSize = cache.getMessages(startTime).size()
        (1..6).each{ idx ->
            Calendar calendar = new GregorianCalendar()
            calendar.add(GregorianCalendar.DAY_OF_WEEK, -idx)
            Thread.sleep(1000)
            cache.add(new OzoneMessage(timestamp : calendar.getTime() , body: "LOWER MESSAGE ${idx}"))
        }

        when:
        cache.purge()

        then:
        cache.getMessages(startTime).size() == initSize
    }

}
