package ozone.owf.util

import static java.util.Collections.emptyList
import static java.util.Collections.emptyMap


abstract class TypeSafety {

    static Map asMap(Object obj) {
        return (obj != null && obj instanceof Map) ? obj : emptyMap()
    }

    static List asList(Object obj) {
        return (obj != null && obj instanceof List) ? obj : emptyList()
    }

    static int asInt(Object obj, int defaultValue = 0) {
        return (obj != null && obj instanceof Integer) ? obj : defaultValue
    }

}
