package owf.grails.test.integration

import java.time.temporal.ChronoUnit

import grails.converters.JSON


class JsonUtil {

    static String restringify(String value) {
        JSON.parse(value).toString()
    }

    static String asJsonString(Object value) {
        (value as JSON).toString()
    }

    static String toJsonDateString(Date date) {
        date.toInstant().truncatedTo(ChronoUnit.SECONDS).toString()
    }

}
