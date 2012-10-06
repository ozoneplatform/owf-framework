package ozone.owf.nineci.hibernate;

import java.util.Properties;
import org.hibernate.MappingException;
import org.hibernate.dialect.Dialect;
import org.hibernate.id.enhanced.TableGenerator;
import org.hibernate.type.Type;

public class NewObjectIdGenerator extends TableGenerator {

	@Override
	public void configure(final Type type, final Properties params, final Dialect dialect) throws MappingException {
		params.put("optimizer", "pooled");
		params.put("initial_value", "10000");
		params.put("increment_size", "100");
		params.put("prefer_entity_table_as_segment_value", "true");
		params.put("segment_value", params.getProperty( TABLE ) + ".OID");
		params.put("table_name", "NewObjectId");
		params.put("value_column_name", "NextId");
		params.put("segment_column_name", "KeyName");
		super.configure(type, params, dialect);
	}

}
