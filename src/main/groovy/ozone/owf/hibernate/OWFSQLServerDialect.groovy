package ozone.owf.hibernate

import java.sql.Types

import org.hibernate.dialect.SQLServerDialect


class OWFSQLServerDialect extends SQLServerDialect {
	
	public OWFSQLServerDialect() {
		super()
		registerColumnType(Types.CHAR, "nchar(1)")
		registerColumnType(Types.CLOB, "ntext")
		registerColumnType(Types.VARCHAR,'nvarchar($l)')
		registerColumnType(Types.LONGVARCHAR, 'nvarchar($l)')
	}
}
