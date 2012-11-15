package ozone.owf.grails.domain

class Preference implements Serializable {
    static String TYPE = 'preference'
    static final long serialVersionUID = 700L

	String namespace
	String path
	String value
	Person user

	static constraints = {
		namespace(nullable: false, blank: false, maxSize: 200)
		path(nullable: false, blank: false, maxSize: 200)
		value(nullable: false)
        user(unique:['namespace','path'])
	}

	static mapping = {
        //table 'owf_preference'
        cache true
		columns {
			value type:'text'
	    }
	}

  String toString() {
		user?.username + ":${this.namespace}/${this.path} = ${this.value}"
	}

}
