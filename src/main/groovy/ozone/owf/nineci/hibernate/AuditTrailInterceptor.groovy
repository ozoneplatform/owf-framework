package ozone.owf.nineci.hibernate

import grails.util.Holders as ConfigurationHolder

import org.hibernate.EmptyInterceptor
import org.hibernate.type.Type

import org.apache.log4j.Logger

//grails.plugin.audittrail
import ozone.owf.grails.domain.Person
import ozone.owf.grails.services.AccountService


class AuditTrailInterceptor extends EmptyInterceptor {
    protected static final Logger log = Logger.getLogger(AuditTrailInterceptor)
    static final Properties CONF = ConfigurationHolder.config.toProperties()
    static final String CREATED_BY = CONF.getProperty("stamp.audit.createdBy")
    static final String EDITED_BY = CONF.getProperty("stamp.audit.editedBy")
    static final String EDITED_DATE = CONF.getProperty("stamp.audit.editedDate")
    static final String CREATED_DATE = CONF.getProperty("stamp.audit.createdDate")

    AccountService accountService

    boolean onFlushDirty(Object entity, Serializable id, Object[] currentState,Object[] previousState, String[] propertyNames,Type[] types) {
      
		if(!isAuditable(entity)){
			return true
		}
		
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

		//Making the assumption that if there is no created by field then this is not an auditable object
		//Auditing Person would be really bad because it would result in infinite loop since it is queried in getUserId
		if(entity instanceof Person || !isAuditable(entity)){
			return true
		}
       
        List fieldList = propertyNames.toList()		

		MetaProperty createdDt = entity.metaClass.hasProperty(entity, CREATED_DATE)
		def now = createdDt.getType().newInstance([System.currentTimeMillis()] as Object[])
		
		//Set date fields
		setValue(state, fieldList, CREATED_DATE, now)
		setValue(state, fieldList, EDITED_DATE, now)
		
		//Set user fields
		Object userId = getUserID()
		setValue(state, fieldList, EDITED_BY, userId)
		setValue(state, fieldList, CREATED_BY, userId)

    	return true
    }

	private boolean isAuditable(Object entity){
		return entity.metaClass.hasProperty(entity,CREATED_BY)    && 
			   entity.metaClass.hasProperty(entity,CREATED_DATE)  && 
			   entity.metaClass.hasProperty(entity,EDITED_BY)     && 
			   entity.metaClass.hasProperty(entity,EDITED_DATE)    
	}
	
	
    def setValue(Object[] currentState, List fieldList, String propertyToSet, Object value) {
        int index = fieldList.indexOf(propertyToSet)
        if (index >= 0) {
            currentState[index] = value
        }
    }

    Object getUserID() {
        if (accountService.getLoggedInUsername()) {
            return accountService.getLoggedInUserReadOnly()    
        } else {
            return null
        }
    }
}

