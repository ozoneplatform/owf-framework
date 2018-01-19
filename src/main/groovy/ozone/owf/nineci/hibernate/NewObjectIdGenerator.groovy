package ozone.owf.nineci.hibernate

import org.hibernate.MappingException
import org.hibernate.id.enhanced.TableGenerator
import org.hibernate.service.ServiceRegistry
import org.hibernate.type.Type


public class NewObjectIdGenerator extends TableGenerator {

	@Override
	public void configure(Type type, Properties params, ServiceRegistry serviceRegistry) throws MappingException {
		params.put("optimizer", "pooled");
		params.put("initial_value", "10000");
		params.put("increment_size", "100");
		params.put("prefer_entity_table_as_segment_value", "true");
		params.put("segment_value", params.getProperty( TABLE ) + ".OID");
		params.put("table_name", "NewObjectId");
		params.put("value_column_name", "NextId");
		params.put("segment_column_name", "KeyName");
		super.configure(type, params, serviceRegistry);
	}

}
