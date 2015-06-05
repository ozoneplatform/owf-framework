package org.grails.prettytime

import org.apache.commons.lang.StringUtils
import org.ocpsoft.prettytime.PrettyTime
import org.springframework.web.servlet.support.RequestContextUtils

class PrettyTimeTagLib {

    static namespace = "prettytime"

    def display = {attrs, body ->

        def date = attrs.remove('date')
        def showTime = Boolean.valueOf(attrs.remove('showTime'))
        def capitalize = Boolean.valueOf(attrs.remove('capitalize'))

        if ('org.joda.time.DateTime'.equals(date?.class?.name)) {
            date = date.toDate()
        }

        if (!date) return

        def prettyTime = new PrettyTime(RequestContextUtils.getLocale(request))


        String result = prettyTime.format(date).trim()
        if (capitalize) result = StringUtils.capitalize(result)
        if (showTime) {
            def format = attrs.remove('format') ?: 
                            message(code: 'default.date.format', default: 'hh:mm:ss a')
            result += ', ' + date.format(format)
        }

        out << result
    }
}
