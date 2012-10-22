package ozone.owf.grails.services

import grails.converters.JSON
import org.hibernate.CacheMode
import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.Stack

class StackService {

    def accountService
    def serviceModelService

    def list(params) {
        
        def criteria = ozone.owf.grails.domain.Stack.createCriteria()
        def opts = [:]
        
        if (params?.offset != null) opts.offset = (params.offset instanceof String ? Integer.parseInt(params.offset) : params.offset)
        if (params?.max != null) opts.max =(params.max instanceof String ? Integer.parseInt(params.max) : params.max)
        
        def results = criteria.list(opts) {
            
            if (params?.id)
                eq("id", Long.parseLong(params.id))
                
            // Apply any filters
            if (params.filters) {
                if (params.filterOperator?.toUpperCase() == 'OR') {
                    or {
                        JSON.parse(params.filters).each { filter ->
                            ilike(filter.filterField, "%" + filter.filterValue + "%")
                        }
                    }
                } else {
                    JSON.parse(params.filters).each { filter ->
                        ilike(filter.filterField, "%" + filter.filterValue + "%")
                    }
                }
            } else if (params.filterName && params.filterValue) {
                def filterNames = params.list('filterName')
                def filterValues = params.list('filterValue')
                
                if (params.filterOperator?.toUpperCase() == 'OR') {
                    or {
                        filterNames.eachWithIndex { filterName, i ->
                            ilike(filterName, "%" + filterValues[i] + "%")
                        }
                    }
                } else {
                    filterNames.eachWithIndex { filterName, i ->
                        ilike(filterName, "%" + filterValues[i] + "%")
                    }
                }
            }
            
            // Sort
            if (params?.sort) {
                order(params.sort, params?.order?.toLowerCase() ?: 'asc')
            }
            else {
                //default sort
                order('stackPosition', params?.order?.toLowerCase() ?: 'asc')
            }
            
            cache(true)
            cacheMode(CacheMode.GET)
        }
        
        def processedResults = results.collect { g ->
            
            serviceModelService.createServiceModel(g,[
                totalDashboards: 0,
                totalUsers: 0,
                totalGroups: 0,
                totalWidgets: 0
            ])
            
        }
        return [data: processedResults, results: results.totalCount]
        
    }
    
    def createOrUpdate(params) {
        
        // Only admins may delete Stacks
        ensureAdmin()
        def stacks = []

        if (params.data) {
            def json = JSON.parse(params.data)
            
            if (json instanceof List) {
                stacks = json
            } else {
                stacks << json
            }
        }

        def results = stacks.collect { updateStack(it) }

        [success:true, data:results.flatten()]
    }
    
    private def updateStack(params) {

        def stack, returnValue = null
        
        if (params.id >= 0) {  // Existing Stack, get you one
            stack = Stack.findById(params.id, [cache: true])
            if (!stack ) {
                throw new OwfException(message: 'Stack ' + params.id + ' not found.', exceptionType: OwfExceptionTypes.NotFound)
            }
        } else { // New Stack
            stack = new ozone.owf.grails.domain.Stack()
        }

        //If stack position is changed, move the stack it will be switched with
        //to the end to avoid conflicts, then move it to its new position after
        def stackToSwitch = null, prevPosition = null
        if(stack.stackPosition && params.stackPosition && params.stackPosition != stack.stackPosition) {
            if(params.stackPosition > 0 && params.stackPosition < getMaxPosition()) {
                stackToSwitch = Stack.findByStackPosition(params.stackPosition)
                stackToSwitch.stackPosition = getMaxPosition()
                prevPosition = stack.stackPosition
                stackToSwitch.save(flush: true, failOnError: true)
            }
        }
        
        stack.properties = [
            name: params.name ?: stack.name,
            stackPosition: stackToSwitch ? params.stackPosition : stack.stackPosition ?: getMaxPosition(),
            description: params.description ?: stack.description,
            stackContext: params.stackContext ?: stack.stackContext,
            imageUrl: params.imageUrl ?: stack.imageUrl
        ]
        
        stack.save(flush: true, failOnError: true)

        //If stack switched position, set the one it switched with to its previous position
        if(stackToSwitch) {
            stackToSwitch.stackPosition = prevPosition
            stackToSwitch.save(flush: true, failOnError: true)
        }
        
        returnValue = serviceModelService.createServiceModel(stack,[
            totalDashboards: 0,
            totalUsers: 0,
            totalGroups: 0,
            totalWidgets: 0
        ])

        return returnValue
    }
    
    private def getMaxPosition() {
        def c = ozone.owf.grails.domain.Stack.createCriteria()
        def maxPos = c.get {
            projections {
                max('stackPosition')
            }
        }
        
        if (!maxPos) { maxPos = 0 }
        maxPos += 1
        return maxPos
    }
    
    def delete(params) {
        
        // Only admins may delete Stacks
        ensureAdmin()
        
        def stacks = []
        
        if (params.data) {
            def json = JSON.parse(params.data)
            stacks = [json].flatten()
        } else {
            stacks = params.list('id').collect {
                [id:it]
            }
        }
        
        stacks.each {
            def stack = ozone.owf.grails.domain.Stack.findById(it.id, [cache: true])
            stack?.delete(flush: true)
        }
        
        reorder()
        
        return [success: true, data: stacks]
    }
    
    private def ensureAdmin() {
        if (!accountService.getLoggedInUserIsAdmin()) {
            throw new OwfException(message: "You must be an admin", exceptionType: OwfExceptionTypes.Authorization)
        }
    }
    
    private def reorder() {
        def criteria = ozone.owf.grails.domain.Stack.createCriteria()
        def results = criteria.list() {
            order('stackPosition', 'asc')
            cache(true)
            cacheMode(CacheMode.GET)
        }
        
        results?.eachWithIndex { stack, i ->
            stack.stackPosition = i + 1
            stack.save(flush: true)
        }
    }
}
