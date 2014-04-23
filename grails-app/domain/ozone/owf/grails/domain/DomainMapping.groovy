package ozone.owf.grails.domain

class DomainMapping {

  static String TYPE = 'domain_mapping'
  static final long serialVersionUID = 700L

  static mapping = {
      cache true
  }

  static constraints = {
    srcId(nullable:false, blank: false)
    srcType(nullable:false, blank: false)

    //relationshipId(nullable:false, blank: false)
    relationshipType(nullable:true, blank: true, inList:RelationshipType.listAsStrings())

    destId(nullable:false, blank: false)
    destType(nullable:false, blank: false)
  }

  //source domain obj
  Long srcId
  String srcType

  String relationshipType = RelationshipType.owns.toString()

  //dest obj
  Long destId
  String destType

}
