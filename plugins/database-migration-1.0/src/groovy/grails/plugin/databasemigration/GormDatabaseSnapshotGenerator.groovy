/* Copyright 2006-2010 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package grails.plugin.databasemigration

import java.lang.reflect.Method

import liquibase.database.Database
import liquibase.database.structure.Column
import liquibase.database.structure.ForeignKey
import liquibase.database.structure.Index
import liquibase.database.structure.PrimaryKey
import liquibase.database.structure.Sequence
import liquibase.database.structure.Table
import liquibase.diff.DiffStatusListener
import liquibase.exception.DatabaseException
import liquibase.snapshot.DatabaseSnapshot
import liquibase.snapshot.DatabaseSnapshotGenerator

import org.hibernate.cfg.Configuration
import org.hibernate.dialect.Dialect
import org.hibernate.dialect.MySQLDialect
import org.hibernate.id.IdentifierGenerator
import org.hibernate.id.SequenceGenerator
import org.hibernate.mapping.PersistentClass
import org.hibernate.mapping.Value

/**
 * Used by the gorm-diff script. Registered in DatabaseMigrationGrailsPlugin.doWithApplicationContext().
 *
 * Based on <code>liquibase.ext.hibernate.snapshot.HibernateDatabaseSnapshotGenerator</code>.
 *
 * @author <a href='mailto:burt@burtbeckwith.com'>Burt Beckwith</a>
 */
class GormDatabaseSnapshotGenerator implements DatabaseSnapshotGenerator {

	/**
	 * {@inheritDoc}
	 * @see liquibase.snapshot.DatabaseSnapshotGenerator#createSnapshot(liquibase.database.Database,
	 * 	java.lang.String, java.util.Set)
	 */
	DatabaseSnapshot createSnapshot(Database db, String requestedSchema, Set<DiffStatusListener> listeners)
			throws DatabaseException {

		DatabaseSnapshot snapshot = new DatabaseSnapshot(db, requestedSchema)

		try {
			def cfg = db.configuration
			String dialectName = cfg.getProperty('hibernate.dialect')
			def dialect = MigrationUtils.createInstance(dialectName)
//			def dialect = new HibernateGenericDialect(dialectName) // TODO

			def mapping = cfg.buildMapping()

			for (hibernateTable in cfg.tableMappings) {
				if (!hibernateTable.physicalTable) {
					continue
				}

				Table table = new Table(hibernateTable.name)
				snapshot.tables << table

				def hibernatePrimaryKey = hibernateTable.primaryKey
				if (hibernatePrimaryKey) {
					PrimaryKey pk = new PrimaryKey(name: hibernatePrimaryKey.name, table: table)
					for (hibernateColumn in hibernatePrimaryKey.columns) {
						pk.columnNamesAsList << hibernateColumn.name
					}
					snapshot.primaryKeys << pk
				}

				for (hibernateColumn in hibernateTable.columnIterator) {
					Column column = new Column(
						name: hibernateColumn.name,
						dataType: hibernateColumn.getSqlTypeCode(mapping),
						decimalDigits: hibernateColumn.scale,
						defaultValue: hibernateColumn.defaultValue,
						nullable: hibernateColumn.nullable,
						primaryKey: hibernatePrimaryKey == null ? false : hibernatePrimaryKey.columns.contains(hibernateColumn),
						table: table,
						typeName: hibernateColumn.getSqlType(dialect, mapping).replaceFirst('\\(.*\\)', ''),
						unique: hibernateColumn.unique,
						autoIncrement: isIdentityColumn(hibernateColumn.value, dialect, cfg),
						certainDataType: hibernateColumn.sqlType != null)
					column.columnSize = column.numeric ? hibernateColumn.precision : hibernateColumn.length

					table.columns << column

					if (hibernateColumn.unique) {
						// GrailsDomainBinder doesn't register a unique key for single-column unique
						Index index = new Index(table: table, unique: true,
						                        name: hibernateColumn.name + '_unique_' + System.currentTimeMillis())
						index.columns << hibernateColumn.name
						snapshot.indexes << index
					}
				}

				for (hibernateIndex in hibernateTable.indexIterator) {
					Index index = new Index(table: table, name: hibernateIndex.name)
					for (hibernateColumn in hibernateIndex.columnIterator) {
						index.columns << hibernateColumn.name
					}
					snapshot.indexes << index
				}

				for (hiberateUnique in hibernateTable.uniqueKeyIterator) {
					Index index = new Index(table: table, name: hiberateUnique.name)
					for (hibernateColumn in hiberateUnique.columnIterator) {
						index.columns << hibernateColumn.name
					}
					snapshot.indexes << index
				}
			}

			for (hibernateTable in cfg.tableMappings) {
				if (!hibernateTable.physicalTable) {
					continue
				}

				for (hibernateForeignKey in hibernateTable.foreignKeyIterator) {
					if (!hibernateForeignKey.table || !hibernateForeignKey.referencedTable ||
							!hibernateForeignKey.physicalConstraint) {
						continue
					}

					ForeignKey fk = new ForeignKey(name: hibernateForeignKey.name)
					fk.foreignKeyTable = snapshot.tables.find { it.name.equalsIgnoreCase(hibernateForeignKey.table.name) }
					fk.foreignKeyColumns = hibernateForeignKey.columns*.name.join(', ')

					fk.primaryKeyTable = snapshot.tables.find { it.name.equalsIgnoreCase(hibernateForeignKey.referencedTable.name) }

					List<String> fkColumns = hibernateForeignKey.referencedColumns*.name ?:
						hibernateForeignKey.referencedTable.primaryKey.columns*.name

					fk.primaryKeyColumns = fkColumns.join(', ')
					snapshot.foreignKeys << fk
					if (dialect instanceof MySQLDialect) {
						addMysqlFkIndex snapshot, fk.foreignKeyTable, hibernateForeignKey
					}
				}
			}

			if (db.supportsSequences()) {
				Map generators = [:]
				for (PersistentClass pc in cfg.classes.values()) {
					if (pc.isInherited()) {
						continue
					}

					def identifierGenerator = createIdentifierGenerator(dialect, pc, cfg)
					if (identifierGenerator instanceof SequenceGenerator) {
						generators.put(identifierGenerator.generatorKey(), identifierGenerator)
					}
				}

				for (SequenceGenerator generator in generators.values()) {
					String schema = requestedSchema ?: ''
					snapshot.sequences << new Sequence(
						name: generator.sequenceName,
						schema: db.convertRequestedSchemaToSchema(schema))
				}
			}
		}
		catch (e) {
			throw new DatabaseException(e)
		}

		snapshot
	}

	// workaround for changed method signature without backwards compatibility
	private boolean isIdentityColumn(Value value, Dialect dialect, Configuration cfg) {
		Method method = value.getClass().getMethods().find { it.name == 'isIdentityColumn' }
		if (method.getParameterTypes().length == 1) {
			// pre-3.6 Hibernate
			return value.isIdentityColumn(dialect)
		}

		value.isIdentityColumn cfg.identifierGeneratorFactory, dialect
	}

	// another workaround for changed method signature without backwards compatibility
	private IdentifierGenerator createIdentifierGenerator(Dialect dialect, PersistentClass pc, Configuration cfg) {
		Method method = pc.identifier.getClass().getMethods().find { it.name == 'createIdentifierGenerator' }
		if (method.getParameterTypes().length == 4) {
			// pre-3.6 Hibernate
			return pc.identifier.createIdentifierGenerator(dialect, null, null, pc)
		}

		pc.identifier.createIdentifierGenerator cfg.identifierGeneratorFactory, dialect, null, null, pc
	}

	// MySQL is unique in that the Dialect adds an index to each FK but it's
	// not exposed in the object model. so we add it here to be consistent
	private void addMysqlFkIndex(DatabaseSnapshot snapshot, Table table, hibernateForeignKey) {
		Index index = new Index(table: table, name: hibernateForeignKey.name)
		for (hibernateColumn in hibernateForeignKey.columnIterator) {
			index.columns << hibernateColumn.name
		}
		snapshot.indexes << index
	}

	boolean supports(Database db) { db instanceof GormDatabase }

	int getPriority(Database db) { PRIORITY_DATABASE }

	// unused interface methods

	Table getDatabaseChangeLogTable(Database db) {
		throw new UnsupportedOperationException()
	}

	Table getDatabaseChangeLogLockTable(Database db) {
		throw new UnsupportedOperationException()
	}

	boolean hasDatabaseChangeLogTable(Database db) {
		throw new UnsupportedOperationException()
	}

	boolean hasDatabaseChangeLogLockTable(Database db) {
		throw new UnsupportedOperationException()
	}

	boolean hasTable(String schema, String table, Database db) {
		throw new UnsupportedOperationException()
	}

	Table getTable(String schema, String table, Database db) {
		throw new UnsupportedOperationException()
	}

	Column getColumn(String schema, String table, String column, Database db) {
		throw new UnsupportedOperationException()
	}

	boolean hasIndex(String schema, String table, String index, Database db, String columns) {
		throw new UnsupportedOperationException()
	}

	ForeignKey getForeignKeyByForeignKeyTable(String schema, String fkTable, String fk, Database db) {
		throw new UnsupportedOperationException()
	}

	List<ForeignKey> getForeignKeys(String schema, String foreignKeyTable, Database db) {
		throw new UnsupportedOperationException()
	}

	boolean hasView(String schemaName, String viewName, Database database) {
		throw new UnsupportedOperationException()
	}
}
