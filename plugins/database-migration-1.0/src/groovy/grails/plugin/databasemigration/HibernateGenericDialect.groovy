package grails.plugin.databasemigration

import java.sql.Types

import org.hibernate.dialect.Dialect

class HibernateGenericDialect extends Dialect {
	private Dialect realDialect

	private static final Map<Integer, String> NAMES = [
		(Types.BIGINT):    'bigint',
		(Types.BOOLEAN):   'boolean',
		(Types.BLOB):      'blob',
		(Types.CLOB):      'clob',
		(Types.DATE):      'date',
		(Types.FLOAT):     'float',
		(Types.TIME):      'time',
		(Types.TIMESTAMP): 'datetime',
		(Types.VARCHAR):   'varchar',
		(Types.NVARCHAR):  'nvarchar'
	]

	HibernateGenericDialect(String dialectName) {
		realDialect = MigrationUtils.createInstance(dialectName)
	}

	@Override
	String getTypeName(int code, int length, int precision, int scale) {
		NAMES[code] ?: realDialect.getTypeName(code, length, precision, scale)
	}
}
