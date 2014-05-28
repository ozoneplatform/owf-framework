-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 5/23/14 10:36 AM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.15.1.groovy::7.15.1-1::owf::(Checksum: 3:a253a2a9c7e7571b94e59fc1767c58b3)
DELETE FROM application_configuration  WHERE code = 'notifications.xmpp.server.hostname';

DELETE FROM application_configuration  WHERE code = 'notifications.xmpp.server.port';

DELETE FROM application_configuration  WHERE code = 'notifications.xmpp.room';

DELETE FROM application_configuration  WHERE code = 'notifications.xmpp.username';

DELETE FROM application_configuration  WHERE code = 'notifications.xmpp.password';

DELETE FROM application_configuration  WHERE code = 'notifications.enabled';

DELETE FROM application_configuration  WHERE code = 'notifications.query.interval';

DELETE FROM application_configuration  WHERE code = 'url.public';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', NOW(), 'Delete Data (x8)', 'EXECUTED', 'changelog_7.15.1.groovy', '7.15.1-1', '2.0.1', '3:a253a2a9c7e7571b94e59fc1767c58b3', 1);

-- Changeset changelog_7.15.1.groovy::7.15.1-2::owf::(Checksum: 3:1234ac8c0f21a1d748e17510d1c4373c)
ALTER TABLE widget_definition RENAME COLUMN image_url_large TO image_url_medium;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', NOW(), 'Rename Column', 'EXECUTED', 'changelog_7.15.1.groovy', '7.15.1-2', '2.0.1', '3:1234ac8c0f21a1d748e17510d1c4373c', 2);

-- Release Database Lock
