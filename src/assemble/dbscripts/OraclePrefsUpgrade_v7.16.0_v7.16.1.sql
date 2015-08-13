-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 8/13/15 2:27 PM
-- Against: OWF@jdbc:oracle:thin:@localhost:1521:XE
-- Liquibase version: 2.0.5
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.16.1.groovy::7.16.1-1::owf::(Checksum: 3:ae067414a3c058b53045e311d46646cc)
INSERT INTO role (authority, description, id, version) VALUES ('ROLE_USER', 'User Role', '26', '2');

INSERT INTO role (authority, description, id, version) VALUES ('ROLE_ADMIN', 'Admin Role', '27', '1');

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Insert Row (x2)', 'EXECUTED', 'changelog_7.16.1.groovy', '7.16.1-1', '2.0.5', '3:ae067414a3c058b53045e311d46646cc', 1);

-- Changeset changelog_7.16.1.groovy::7.16.1-2::owf::(Checksum: 3:86ab0cd02919c9a554248579f7c32323)
-- Updating the hibernate_sequence to account for hard coded ids
ALTER SEQUENCE hibernate_sequence INCREMENT BY 186;

SELECT hibernate_sequence.nextval FROM DUAL;

ALTER SEQUENCE hibernate_sequence INCREMENT BY 1;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Updating the hibernate_sequence to account for hard coded ids', SYSTIMESTAMP, 'Custom SQL', 'EXECUTED', 'changelog_7.16.1.groovy', '7.16.1-2', '2.0.5', '3:86ab0cd02919c9a554248579f7c32323', 2);

-- Release Database Lock
