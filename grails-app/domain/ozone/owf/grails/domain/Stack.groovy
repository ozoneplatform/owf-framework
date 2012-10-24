package ozone.owf.grails.domain

class Stack {
    
    static final long serialVersionUID = 600L
    
    String name
    Integer stackPosition
    String description
    String stackContext
    String imageUrl
    String descriptorUrl

    static constraints = {
        name(nullable: false, blank: false, maxSize: 256)
        stackPosition(nullable: false, min: 1, unique: true)
        description(nullable: true, blank: true)
        stackContext(nullable: false, blank: false, maxSize: 200, unique: true)
        imageUrl(nullable: true, blank: true, maxSize: 2083)
        descriptorUrl(nullable: true, blank: true, maxSize: 2083)
    }
}
