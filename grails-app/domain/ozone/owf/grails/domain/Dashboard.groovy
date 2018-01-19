package ozone.owf.grails.domain

import org.grails.web.json.JSONObject

import ozone.owf.gorm.AuditStamp


@AuditStamp
class Dashboard implements Serializable, Comparable {

    static String TYPE = 'dashboard'

    //TODO: we use these constants elsewhere in the domain - consolidate
    static final String GUID_PATTERN = /^[A-Fa-f\d]{8}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{4}-[A-Fa-f\d]{12}$/
    static final Integer MAX_URL_SIZE = 2083

    //derived from version number without dots,
    //so that all domain classes with a given
    //version are considered compatible and
    //classes between versions are incompatible.
    static final long serialVersionUID = 700L

    String name                 //Added for default JSON
    String guid
    Boolean isdefault = false
    Integer dashboardPosition
    Boolean alteredByAdmin = false
    String description = ''
    String iconImageUrl
    String type = ''
    String layoutConfig = ''
    Boolean locked = false
    Boolean publishedToStore = false
    Boolean markedForDeletion = false
    Stack stack  // The stack in which this dashboard should appear

    static belongsTo = [user: Person]

    static mapping = {
        cache true
        stack fetch: 'join'
        user fetch: 'join'
        layoutConfig type: 'text', sqlType: DbSupport.bigStringType
    }

    static constraints = {
        guid nullable: false, blank: false, unique: true, matches: GUID_PATTERN
        isdefault nullable: false
        name nullable: false, blank: false, maxSize: 200
        dashboardPosition nullable: false, display: false
        alteredByAdmin nullable: false
        iconImageUrl nullable: true, blank: true, maxSize: MAX_URL_SIZE
        description nullable: true, blank: true
        type nullable: true, blank: true
        user nullable: true
        layoutConfig nullable: true, blank: true
        stack nullable: true
        publishedToStore nullable: true
        markedForDeletion nullable: true
    }

    String toString() {
        this.guid
    }

    int compareTo(that) {
        this.dashboardPosition <=> that.dashboardPosition
    }

    JSONObject asJSON() {
        new JSONObject([
            name: name,
            guid: guid,
            isdefault: isdefault,
            dashboardPosition: dashboardPosition,
            locked: locked,
            user: user?.asJSON(),
            alteredByAdmin: alteredByAdmin ?: false,
            isGroupDashboard: user == null,
            //TODO: Do we need groups here?
            //groups: params.groups != null ? params.groups.collect{ createServiceModel(it) } : [],
            description: description,
            iconImageUrl: iconImageUrl,
            type: type,
            //TODO: Are these needed?
            //createdDate: OWFDate.standardShortDateDisplay(createdDate),
            //prettyCreatedDate: createdDate != null ? new PrettyTime().format(createdDate) : null,
            //editedDate: OWFDate.standardShortDateDisplay(editedDate),
            //prettyEditedDate: editedDate != null ? new PrettyTime().format(editedDate) : null,
            //createdBy: createServiceModel(domain.createdBy),
            layoutConfig: layoutConfig,
            stack: stack?.asJSON(),
            markedForDeletion: markedForDeletion,
            publishedToStore: publishedToStore
        ])
    }

}
