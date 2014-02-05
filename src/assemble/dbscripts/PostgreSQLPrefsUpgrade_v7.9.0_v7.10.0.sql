-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 2/4/14 12:01 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.10.0.groovy::7.10.0-1::owf::(Checksum: 3:115190a042e53f65034683e629f8cf47)
ALTER TABLE person ADD last_notification TIMESTAMP WITH TIME ZONE;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', NOW(), 'Add Column', 'EXECUTED', 'changelog_7.10.0.groovy', '7.10.0-1', '2.0.1', '3:115190a042e53f65034683e629f8cf47', 1);

-- Changeset changelog_7.10.0.groovy::7.10.0-2::owf::(Checksum: 3:41ac759cfb732888d39c704edd1aa12d)
INSERT INTO application_configuration (code, group_name, mutable, sub_group_order, title, type, value, version) VALUES ('notifications.enabled', 'NOTIFICATIONS', TRUE, 1, ' ', 'Boolean', 'false', 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_order, title, type, value, version) VALUES ('notifications.query.interval', 'NOTIFICATIONS', TRUE, 2, ' ', 'Integer', '30', 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_order, title, type, value, version) VALUES ('url.public', 'NOTIFICATIONS', TRUE, 3, ' ', 'String', NULL, 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.server.hostname', 'NOTIFICATIONS', TRUE, 'XMPP Settings', 1, ' ', 'String', NULL, 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.server.port', 'NOTIFICATIONS', TRUE, 'XMPP Settings', 2, ' ', 'Integer', '5222', 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.room', 'NOTIFICATIONS', TRUE, 'XMPP Settings', 3, ' ', 'String', NULL, 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.username', 'NOTIFICATIONS', TRUE, 'XMPP Settings', 4, ' ', 'String', NULL, 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.password', 'NOTIFICATIONS', TRUE, 'XMPP Settings', 5, ' ', 'String', NULL, 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', NOW(), 'Insert Row (x8)', 'EXECUTED', 'changelog_7.10.0.groovy', '7.10.0-2', '2.0.1', '3:41ac759cfb732888d39c704edd1aa12d', 2);

-- Release Database Lock
