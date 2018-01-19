package ozone.owf.grails.domain

import org.grails.web.json.JSONObject


class Stack implements Serializable {

    static String TYPE = 'stack'
    static final long serialVersionUID = 700L

    String name
    String description
    String stackContext
    String imageUrl
    String descriptorUrl
    Integer uniqueWidgetCount = 0
    Boolean approved = false

    static mappedBy = [groups: 'stacks',
                       defaultGroup: 'none']

    static belongsTo = [owner: Person]
    static hasOne = [defaultGroup: Group]
    static hasMany = [groups: Group]

    static mapping = {
        cache true
        defaultGroup fetch: 'join'
        owner fetch: 'join'
    }

    static constraints = {
        name(nullable: false, blank: false, maxSize: 256)
        description(nullable: true, blank: true, maxSize: 2000)
        stackContext(nullable: false, blank: false, maxSize: 200, unique: true)
        imageUrl(nullable: true, blank: true, maxSize: 2083)
        descriptorUrl(nullable: true, blank: true, maxSize: 2083)
        uniqueWidgetCount(nullable: false)
        approved(nullable: true)
        owner(nullable:true)
        defaultGroup(nullable: true)
    }

    JSONObject asJSON() {
        new JSONObject(
                id: id,
                name: name,
                description: description,
                stackContext: stackContext,
                imageUrl: imageUrl,
                descriptorUrl: descriptorUrl,
                //TODO: Do we need groups here?
                //groups: groups*.asJSON() as JSONArray,
                totalWidgets: uniqueWidgetCount ?: 0,
                //TODO: Do we need owner here?
                owner: owner?.asJSON(),
                approved: approved
        )
    }
}
