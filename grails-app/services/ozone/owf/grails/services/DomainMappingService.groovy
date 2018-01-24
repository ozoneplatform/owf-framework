package ozone.owf.grails.services

import ozone.owf.grails.OwfException
import ozone.owf.grails.OwfExceptionTypes
import ozone.owf.grails.domain.*


class DomainMappingService {

    private def determineMappedObjClass(obj) {
        switch (obj) {
            case Dashboard.TYPE:
                Dashboard.class
                break
            case DomainMapping.TYPE:
                DomainMapping.class
                break
            case Group.TYPE:
                Group.class
                break
            case Person.TYPE:
                Person.class
                break
            case Preference.TYPE:
                Preference.class
                break
            case WidgetDefinition.TYPE:
                WidgetDefinition.class
                break
            default:
                null
        }
    }

    def getMapping(src, relationshipType, dest) {
        def results = DomainMapping.withCriteria({
            eq('srcId', src.id)
            eq('srcType', src.TYPE)
            eq('relationshipType', relationshipType.toString())
            eq('destId', dest.id)
            eq('destType', dest.TYPE)
            cache(true)
        })

        return results
    }

    def getAllMappings(obj, relationshipType = null, origin = 'src') {
        DomainMapping.withCriteria({
            eq(origin + 'Id', obj.id)
            if (relationshipType != null) {
                eq('relationshipType',relationshipType.toString())
            }
            eq(origin + 'Type', obj.TYPE)
            cache(true)
        })
    }

    def countMappings(obj, relationshipType, type, origin = 'src') {
        def typeOrigin = origin == 'src' ? 'dest' : 'src'

        def results = DomainMapping.withCriteria({
            projections { countDistinct(typeOrigin + 'Id') }
            eq(origin + 'Id', obj.id)
            eq(origin + 'Type', obj.TYPE)
            eq('relationshipType', relationshipType.toString())
            eq(typeOrigin + 'Type', type)
            cache(true)
        })

        if (results.size() > 0) {
            results[0]
        }
        else {
            0
        }
    }

    def getMappings(obj, relType, type, origin = 'src') {
        def typeOrigin = origin == 'src' ? 'destType' : 'srcType'

        DomainMapping.withCriteria({
            eq(origin + 'Id', obj.id)
            eq(origin + 'Type', obj.TYPE)
            eq(typeOrigin, type)

            if (relType) {
                eq('relationshipType',relType.toString())
            }
            else {
                //default to owns
                or {
                    eq('relationshipType',RelationshipType.owns.toString())
                    isNull('relationshipType')
                }
            }
            cache(true)
        })
    }

    def getBulkMappings(objList, relType, type, origin = 'src') {
        def domainMappingList = null
        if (!objList.isEmpty()) {
            def typeOrigin = origin == 'src' ? 'destType' : 'srcType'
            def objIdList = []
            objList.each { objIdList << it.id }

            domainMappingList = DomainMapping.withCriteria({
                or {
                    for (def i = 0; i < objIdList.size(); i++)
                        eq(origin + 'Id', objIdList[i])
                }
                //inList(origin + 'Id', objIdList)
                eq(origin + 'Type', objList[0].TYPE)
                eq(typeOrigin, type)
                if (relType) {
                    eq('relationshipType', relType.toString())
                }
                else {
                    //default to owns
                    or {
                        eq('relationshipType', RelationshipType.owns.toString())
                        isNull('relationshipType')
                    }
                }
                cache(true)
            })
            return domainMappingList
        }
    }

    def getObjectsFromMapping(mapping) {
        [src:getSrcObjectFromMapping(mapping), dest:getDestObjectFromMapping(mapping)]
    }

    def getSrcObjectFromMapping(mapping) {
        def id = mapping.srcId
        def type = mapping.srcType
        def mappedClazz = determineMappedObjClass(type)

        if (mappedClazz) {
            return mappedClazz.get(id)
        }
        else {
            return null
        }
    }

    def getDestObjectFromMapping(mapping) {
        def id = mapping.destId
        def type = mapping.destType
        def mappedClazz = determineMappedObjClass(type)

        if (mappedClazz) {
            return mappedClazz.get(id)
        }
        else {
            return null
        }
    }

    def getMappedObjects(obj, relationshipType, type, params = [:], subCriteria=null, origin = 'src') {
        def results = getMappings(obj, relationshipType, type, origin)
        def mappedClazz = determineMappedObjClass(type)
        def ids = []
        def typeOrigin = origin == 'src' ? 'dest' : 'src'

        ids = results.collect { dm ->
            //get id and type of the mapped obj
            dm[typeOrigin + 'Id']
        }

        if (mappedClazz) {

            def criteria = {

                //filter by ids from mapping table
                if (!ids.isEmpty()) {
                    or {
                        for (def i = 0; i < ids.size(); i++)
                            eq('id', ids[i])
                    }
                    //inList('id', ids)
                }

                if (subCriteria != null) {
                    subCriteria.delegate = delegate
                    subCriteria.call()
                }

                //sorting -- only single sort
                if (params?.sort) {
                    order(params.sort, params?.dir?.toLowerCase() ?: 'asc')
                }

                cache(true)
            }

            if (ids.isEmpty()) {
                Collections.EMPTY_LIST
            }
            else {
                //regular criteria
                //mappedClazz.withCriteria(params.opts ?: [:],criteria)
                def c = mappedClazz.createCriteria()
                c.list(params.opts ?: [:],criteria)
            }

        }
        else {
            Collections.EMPTY_LIST
        }
    }

    def getBulkMappedObjects(objList, relationshipType, type, params = [:], origin = 'src') {
        def results = getBulkMappings(objList, relationshipType, type, origin)
        def mappedClazz = determineMappedObjClass(type)
        def ids = []
        def typeOrigin = origin == 'src' ? 'dest' : 'src'

        ids = results.collect { dm ->
            //get id and type of the mapped obj
            dm[typeOrigin + 'Id']
        }

        if (mappedClazz) {

            def criteria = {

                //filter by ids from mapping table
                if (!ids.isEmpty())
                    or {
                        for (def i = 0; i < ids.size(); i++)
                            eq('id', ids[i])
                    }
                    //inList('id', ids)

                //sorting -- only single sort
                if (params?.sort) {
                    order(params.sort, params?.dir?.toLowerCase() ?: 'asc')
                }

                if (params?.limit) maxResults(params.limit instanceof String ? Integer.parseInt(params.limit) : params.limit)
                if (params?.start) firstResult(params.start instanceof String ? Integer.parseInt(params.start) : params.start)
                cache(true)
            }

            if (ids.isEmpty()) {
                Collections.EMPTY_LIST
            }
            else {
                //regular criteria
                mappedClazz.withCriteria(criteria)
            }
        }
        else {
            Collections.EMPTY_LIST
        }
    }

    def createMapping(src, relationshipType, dest, autoSave = true) {
        def dm = null
        if (!mappingExists(src, relationshipType, dest)) {
            dm = new DomainMapping()
            dm['srcId'] = src.id
            dm['srcType'] = src.TYPE
            dm['relationshipType'] = relationshipType.toString()
            dm['destId'] = dest.id
            dm['destType'] = dest.TYPE

            if (autoSave) {
                dm.validate()
                if (dm.hasErrors()) {
                    throw new OwfException(message: 'A fatal validation error occurred during the creation of a mapping.' + dm.errors.toString(),
                    exceptionType: OwfExceptionTypes.Validation)
                }
                else if (!dm.save(flush: true)) {
                    throw new OwfException(message: 'A fatal error occurred while trying to save a mapping.',
                    exceptionType: OwfExceptionTypes.Database)
                }
            }
        }
        return dm
    }

    def mappingExists(src, relationshipType, dest) {
        def mapping = getMapping(src, relationshipType, dest)

        return mapping != null && !mapping.isEmpty()
    }

    def deleteMapping(src, relationshipType, dest) {
        def mapping = getMapping(src, relationshipType, dest)
        mapping*.delete(flush:true)
    }

    def deleteMappings(obj, relationshipType, type, origin = 'src') {
        def mappings = getMappings(obj, relationshipType, type, origin)
        mappings*.delete(flush:true)
    }

    def deleteAllMappings(obj, relationshipType = null, origin = 'src') {
        def mappings = getAllMappings(obj, relationshipType, origin)
        mappings*.delete(flush:true)
    }

    def purgeAllMappings(obj) {
        def mappings = DomainMapping.withCriteria({
            or {
                and {
                    eq('srcId', obj.id)
                    eq('srcType', obj.TYPE)
                }
                and {
                    eq('destId', obj.id)
                    eq('destType', obj.TYPE)
                }
            }
            cache(true)
        })

        mappings*.delete(flush:true)
    }

    def getDependentWidgets(ids) {
        def results = null;
        if (ids) {
            results = DomainMapping.withCriteria({
                eq('srcType', WidgetDefinition.TYPE)
                inList('destId', ids)
                eq('destType', WidgetDefinition.TYPE)
                eq('relationshipType', RelationshipType.requires.toString())
            });
        }
        return results;
    }

    def getRequiredWidgets(ids) {
        def results = null;
        if (ids) {
            results = DomainMapping.withCriteria({
                inList('srcId', ids)
                eq('srcType', WidgetDefinition.TYPE)
                eq('relationshipType', RelationshipType.requires.toString())
                eq('destType', WidgetDefinition.TYPE)
            });
        }
        return results;
    }

    List getClonedDashboardMappings (Person person) {
        DomainMapping.findAll("\
            FROM DomainMapping dm, Dashboard d \
            WHERE \
                dm.relationshipType = ? AND \
                dm.srcId = d.id AND \
                d.user = ?", [RelationshipType.cloneOf.strVal, person])
    }

    List getGroupDashboardMappings (Collection<Group> groups) {
        DomainMapping.executeQuery("\
            FROM DomainMapping dm, Dashboard d \
            WHERE \
                dm.srcId in (:groups) AND \
                dm.srcType = :srcType AND \
                dm.relationshipType = :relationshipType AND \
                dm.destId = d.id AND \
                dm.destType = :destType",
            [
                groups: groups.collect { Group g -> g.id },
                srcType: 'group',
                relationshipType: RelationshipType.owns.strVal,
                destType: 'dashboard'
            ]
        )
    }
}
