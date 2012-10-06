package org.grails.prettytime

import com.ocpsoft.pretty.time.PrettyTime
import com.ocpsoft.pretty.time.units.Century
import com.ocpsoft.pretty.time.units.Day
import com.ocpsoft.pretty.time.units.Decade
import com.ocpsoft.pretty.time.units.Hour
import com.ocpsoft.pretty.time.units.JustNow
import com.ocpsoft.pretty.time.units.Millennium
import com.ocpsoft.pretty.time.units.Millisecond
import com.ocpsoft.pretty.time.units.Minute
import com.ocpsoft.pretty.time.units.Month
import com.ocpsoft.pretty.time.units.Second
import com.ocpsoft.pretty.time.units.Week
import com.ocpsoft.pretty.time.units.Year
import org.apache.commons.lang.StringUtils

class PrettyTimeTagLib {

    static namespace = "prettytime"

    def display = {attrs, body ->
        def date = attrs.remove('date')
        def showTime = Boolean.valueOf(attrs.remove('showTime'))
        def capitalize = Boolean.valueOf(attrs.remove('capitalize'))

        if (!date) throw new PrettyTimeException(
                "There must be a 'date' attribute included in the prettytime tag.")
        if ('org.joda.time.DateTime'.equals(date.class.name)) {
            date = date.toDate()
        }

        def prettyTime = new PrettyTime()
        prettyTime.units = [
                justNowUnitToI18n(new JustNow()),
                unitToI18n(new Millisecond()),
                unitToI18n(new Second()),
                unitToI18n(new Minute()),
                unitToI18n(new Hour()),
                unitToI18n(new Day()),
                unitToI18n(new Week()),
                unitToI18n(new Month()),
                unitToI18n(new Year()),
                unitToI18n(new Decade()),
                unitToI18n(new Century()),
                unitToI18n(new Millennium())
        ]

        String result = prettyTime.format(date).trim()
        if (capitalize) result = StringUtils.capitalize(result)
        if (showTime) {
            def format = attrs.remove('format') ?: 
                            message(code: 'prettytime.date.format', default: 'hh:mm:ss a')
            result += ', ' + date.format(format)
        }

        out << result
    }

    private def unitToI18n(unit) {
        // pattern
        unit.format.pattern = ' %n %u '
        // name/pluralName
        def className = unit.class.name
        className = className[className.lastIndexOf('.') + 1..-1].toLowerCase()
        unit.name = g.message(code: "prettytime.$className")
        unit.pluralName = g.message(code: "prettytime.${className}s")
        // preffix/suffix
        unit.format.pastPrefix = g.message(code: 'prettytime.past.prefix')
        unit.format.pastSuffix = g.message(code: 'prettytime.past.suffix')
        unit.format.futurePrefix = g.message(code: 'prettytime.future.prefix')
        unit.format.futureSuffix = g.message(code: 'prettytime.future.suffix')
        unit
    }

    private def justNowUnitToI18n(unit) {
        // pattern
        unit.format.pattern = ' %u '
        // preffix/suffix
        unit.format.pastSuffix = g.message(code: 'prettytime.justnow.past.suffix')
        unit.format.futureSuffix = g.message(code: 'prettytime.justnow.future.suffix')
        unit
    }

}
