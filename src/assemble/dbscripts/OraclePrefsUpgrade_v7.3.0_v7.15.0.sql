ALTER TABLE person ADD last_notification TIMESTAMP;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_7.10.0.groovy', '7.10.0-1', '2.0.1', '3:115190a042e53f65034683e629f8cf47', 1);

-- Changeset changelog_7.10.0.groovy::7.10.0-2::owf::(Checksum: 3:4bba210116efb0cd6c71f2147e3846e9)
create or replace trigger app_config_insert before insert on application_configuration
            for each row
            when (new.id is null)
            begin
            select hibernate_sequence.nextval into :new.id from dual;
            end;
            /

INSERT INTO application_configuration (code, group_name, mutable, sub_group_order, title, type, value, version) VALUES ('notifications.enabled', 'NOTIFICATIONS', 1, 1, ' ', 'Boolean', 'false', 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_order, title, type, value, version) VALUES ('notifications.query.interval', 'NOTIFICATIONS', 1, 2, ' ', 'Integer', '30', 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_order, title, type, value, version) VALUES ('url.public', 'NOTIFICATIONS', 1, 3, ' ', 'String', NULL, 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.server.hostname', 'NOTIFICATIONS', 1, 'XMPP Settings', 1, ' ', 'String', NULL, 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.server.port', 'NOTIFICATIONS', 1, 'XMPP Settings', 2, ' ', 'Integer', '5222', 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.room', 'NOTIFICATIONS', 1, 'XMPP Settings', 3, ' ', 'String', NULL, 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.username', 'NOTIFICATIONS', 1, 'XMPP Settings', 4, ' ', 'String', NULL, 0);

INSERT INTO application_configuration (code, group_name, mutable, sub_group_name, sub_group_order, title, type, value, version) VALUES ('notifications.xmpp.password', 'NOTIFICATIONS', 1, 'XMPP Settings', 5, ' ', 'String', NULL, 0);

drop trigger app_config_insert;
            /

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Custom SQL, Insert Row (x8), Custom SQL', 'EXECUTED', 'changelog_7.10.0.groovy', '7.10.0-2', '2.0.1', '3:4bba210116efb0cd6c71f2147e3846e9', 2);

