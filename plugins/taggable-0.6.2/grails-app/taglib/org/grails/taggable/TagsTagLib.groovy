package org.grails.taggable

import grails.util.*

class TagsTagLib {
    
    static namespace = 'tags'
    
    def taggableService
    
    def cloud = { attrs ->
        def type = attrs.remove('type')
        // all remaining attributes will be passed through to the richui tag
        attrs.values = taggableService.getTagCounts(type)
        out << plugin.isAvailable(name:'richui') {
			out << richui.tagCloud(attrs)
		}
    }
}