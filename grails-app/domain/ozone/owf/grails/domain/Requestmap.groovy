package ozone.owf.grails.domain

/**
 * Request Map domain class.
 */
class Requestmap implements Serializable{

    static final long serialVersionUID = 700L

	String url
	String configAttribute

	static constraints = {
		url(blank: false, unique: true)
		configAttribute(blank: false)
	}

   static mappings = {
     cache true
   }
}
