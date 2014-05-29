package ozone.owf.grails.domain

class WidgetDefinition implements Serializable {

    //	def domainMappingService

    static String TYPE = 'widget_definition'
    static final long serialVersionUID = 700L

    String universalName
    String widgetGuid
    String displayName
    String description = ''
    String widgetUrl
    String imageUrlSmall
    String imageUrlMedium
    Integer width
    Integer height
    String widgetVersion
    Boolean visible = true
    Boolean singleton = false
    Boolean background = false
    String descriptorUrl

    static hasMany = [personWidgetDefinitions : PersonWidgetDefinition, widgetTypes: WidgetType, widgetDefinitionIntents: WidgetDefinitionIntent]
    static transients = ['allRequired', 'directRequired']

    static constraints = {
        universalName(nullable: true, blank: true, maxSize: 255)
        widgetGuid(nullable:false,
            matches: /^[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}$/,
            unique:true) // TODO: potentially refactor the matches to use java.util.uuid
        displayName(maxSize: 256)
        description(nullable: true, blank: true)
        widgetVersion(nullable: true, blank: true, maxSize: 2083)
        widgetUrl(maxSize: 2083) // see http://support.microsoft.com/kb/208427
        // and http://www.boutell.com/newfaq/misc/urllength.html
        imageUrlMedium(maxSize:2083)
        imageUrlSmall(maxSize:2083)
        height(min:200)
        width(min:200)
        visible(nullable: false, blank: false)
        singleton(nullable: false, blank: false)
        descriptorUrl(nullable: true, blank: true, maxSize: 2083)
    }
    static mapping = {
        //table 'owf_widget_definition'
        cache true
        personWidgetDefinitions (lazy:true, cascade : "all,delete-orphan", cache:true)
        widgetTypes (lazy:true, cache: true)
        widgetDefinitionIntents (lazy:true, cascade: "all-delete-orphan", cache:true)
    }

    String toString() {
        "${displayName}: " + "(${this.id} - " + "${this.widgetGuid})"
    }

//  List getAllRequired() {
//      return getAllRequiredHelper(this).collect{it.widgetGuid}
//  }
//
//  private List getAllRequiredHelper(widgetDefinition, allRequired = []) {
//      def directRequired = ((WidgetDefinition)widgetDefinition).getDirectRequiredHelper()
//      directRequired.each {
//          if (!allRequired.any{nestedIt -> nestedIt.widgetGuid == it.widgetGuid}) {
//              allRequired.push(it)
//              allRequired = getAllRequiredHelper(it, allRequired)
//          }
//      }
//      return allRequired
//  }
//
//  List getDirectRequired() {
//      return getDirectRequiredHelper().collect{it.widgetGuid}
//  }
//
//  private List getDirectRequiredHelper() {
//      def directRequired = []
//      DomainMapping.getAllMappings(this, RelationshipType.requires, 'src').each {
//          directRequired.push(it.getDestObject())
//      }
//      return directRequired
//  }
}
