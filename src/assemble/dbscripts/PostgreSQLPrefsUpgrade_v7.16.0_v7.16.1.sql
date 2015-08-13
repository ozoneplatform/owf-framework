-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 8/13/15 2:04 PM
-- Against: postgres@jdbc:postgresql://localhost:5432/postgres
-- Liquibase version: 2.0.5
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.16.1.groovy::7.16.1-1::owf::(Checksum: 3:ae067414a3c058b53045e311d46646cc)
INSERT INTO role (authority, description, id, "version") VALUES ('ROLE_USER', 'User Role', '26', '2');

INSERT INTO role (authority, description, id, "version") VALUES ('ROLE_ADMIN', 'Admin Role', '27', '1');

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_7.16.1.groovy', '7.16.1-1', '2.0.5', '3:ae067414a3c058b53045e311d46646cc', 1);

-- Changeset changelog_7.16.1.groovy::7.16.1-2::owf::(Checksum: 3:8698b56979b6c82e295d3f9aec41b837)
-- Updating the hibernate_sequence to account for hard coded ids
SELECT setval('hibernate_sequence', 200);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Updating the hibernate_sequence to account for hard coded ids', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_7.16.1.groovy', '7.16.1-2', '2.0.5', '3:8698b56979b6c82e295d3f9aec41b837', 2);

-- Release Database Lock
