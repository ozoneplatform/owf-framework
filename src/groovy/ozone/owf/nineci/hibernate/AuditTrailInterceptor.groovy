package ozone.owf.nineci.hibernate //grails.plugin.audittrail
import org.hibernate.EmptyInterceptor
import org.hibernate.type.Type
import org.springframework.security.core.context.SecurityContextHolder as SCH
import org.springframework.web.context.request.RequestContextHolder as RCH
import org.apache.log4j.Logger
import org.codehaus.groovy.grails.commons.ConfigurationHolder
import ozone.owf.grails.domain.Person


class AuditTrailInterceptor extends EmptyInterceptor {
    private static final Logger log = Logger.getLogger(AuditTrailInterceptor)
    static final Properties CONF = ConfigurationHolder.config.toProperties()
    static final String CREATED_BY = CONF.getProperty("stamp.audit.createdBy")
    static final String EDITED_BY = CONF.getProperty("stamp.audit.editedBy")
    static final String EDITED_DATE = CONF.getProperty("stamp.audit.editedDate")
    static final String CREATED_DATE = CONF.getProperty("stamp.audit.createdDate")

    boolean onFlushDirty(Object entity, Serializable id, Object[] currentState,Object[] previousState, String[] propertyNames,Type[] types) {
      
        def metaClass = entity.metaClass
        MetaProperty property = metaClass.hasProperty(entity, EDITED_DATE)
        List fieldList = propertyNames.toList()
		
        if(property) {
            def now = property.getType().newInstance([System.currentTimeMillis()] as Object[] )
            setValue(currentState, fieldList, EDITED_DATE, now)
        }
        property = metaClass.hasProperty(entity,EDITED_BY)
        if(property) {
            setValue(currentState, fieldList, EDITED_BY, getUserID())
        }

        return true
    }

    boolean onSave(Object entity, Serializable id, Object[] state,String[] propertyNames, Type[] types) {

       
        def metaClass = entity.metaClass
        MetaProperty property = metaClass.hasProperty(entity, CREATED_DATE)
        def time = System.currentTimeMillis()
        List fieldList = propertyNames.toList()
        Object userId = getUserID()
		
        if(property) {
            def now = property.getType().newInstance([time] as Object[] )
            setValue(state, fieldList, CREATED_DATE, now)
        }
        property = metaClass.hasProperty(entity,EDITED_DATE)
        if(property) {
            def now = property.getType().newInstance([time] as Object[] )
            setValue(state, fieldList, EDITED_DATE, now)
        }
        property = metaClass.hasProperty(entity,EDITED_BY)
        if(property) {
            setValue(state, fieldList, EDITED_BY, userId)
        }
        property = metaClass.hasProperty(entity,CREATED_BY)
        if(property) {
            setValue(state, fieldList, CREATED_BY, userId)
        }
    	return true
    }

    def setValue(Object[] currentState, List fieldList, String propertyToSet, Object value) {
        int index = fieldList.indexOf(propertyToSet)
        if (index >= 0) {
            currentState[index] = value
        }
    }

    Object getUserID() {

        Long returnValue 
        if(RCH?.getRequestAttributes()?.getSession()?.personID != null)
        {
            returnValue = RCH?.getRequestAttributes()?.getSession()?.personID
        }
        if (returnValue)        
            return Person.get(returnValue)
        else
            return  null //Could add a default system user here
    }
	

}

