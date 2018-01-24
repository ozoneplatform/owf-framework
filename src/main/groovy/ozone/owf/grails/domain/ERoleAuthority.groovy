package ozone.owf.grails.domain

enum ERoleAuthority {

    ROLE_USER("ROLE_USER"),
    ROLE_ADMIN("ROLE_ADMIN")

    String strVal

    ERoleAuthority(String strVal) {
        this.strVal = strVal
    }

    static list() {
        [ROLE_USER, ROLE_ADMIN]
    }

    static listAsStrings() {
        list().collect { it.strVal }
    }

    static getByStringValue(toCheck) {
        list().each {
            if (toCheck == it.strVal)
                return it
        }
        return null
    }

}
