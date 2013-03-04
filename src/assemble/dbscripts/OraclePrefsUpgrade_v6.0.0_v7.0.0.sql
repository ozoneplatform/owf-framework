-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 12/18/12 11:08 AM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.0.0.groovy::7.0.0-1::owf::(Checksum: 3:9c64b0b8b8cb507555f0c02c00cb382b)
-- Expand a widget definition's description field to 4000 to match Marketplace
ALTER TABLE widget_definition MODIFY description VARCHAR2(4000);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Expand a widget definition''s description field to 4000 to match Marketplace', SYSTIMESTAMP, 'Modify data type', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-1', '2.0.1', '3:9c64b0b8b8cb507555f0c02c00cb382b', 1);

-- Changeset changelog_7.0.0.groovy::7.0.0-2::owf::(Checksum: 3:d1ab9c56671573cf7cde5a4e7c13652c)
-- Remove DashboardWidgetState since it is no longer used.
DROP TABLE dashboard_widget_state;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove DashboardWidgetState since it is no longer used.', SYSTIMESTAMP, 'Drop Table', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-2', '2.0.1', '3:d1ab9c56671573cf7cde5a4e7c13652c', 2);

-- Changeset changelog_7.0.0.groovy::7.0.0-4::owf::(Checksum: 3:21b5b103a5b9e7134b2bbb0a7686e3cf)
-- Remove show_launch_menu since it is no longer used.
ALTER TABLE dashboard DROP COLUMN show_launch_menu;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove show_launch_menu since it is no longer used.', SYSTIMESTAMP, 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-4', '2.0.1', '3:21b5b103a5b9e7134b2bbb0a7686e3cf', 3);

-- Changeset changelog_7.0.0.groovy::7.0.0-5::owf::(Checksum: 3:634c7ed646b89e253102d12b6818c245)
-- Remove layout since it is no longer used.
ALTER TABLE dashboard DROP COLUMN layout;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove layout since it is no longer used.', SYSTIMESTAMP, 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-5', '2.0.1', '3:634c7ed646b89e253102d12b6818c245', 4);

-- Changeset changelog_7.0.0.groovy::7.0.0-6::owf::(Checksum: 3:ef21c5e1a70b81160e2ed6989fc1afa6)
-- Remove intent_config since it is no longer used.
ALTER TABLE dashboard DROP COLUMN intent_config;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove intent_config since it is no longer used.', SYSTIMESTAMP, 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-6', '2.0.1', '3:ef21c5e1a70b81160e2ed6989fc1afa6', 5);

-- Changeset changelog_7.0.0.groovy::7.0.0-7::owf::(Checksum: 3:9ee1cd65b85caaca3178939bac1e0fcf)
-- Remove default_settings since it is no longer used.
ALTER TABLE dashboard DROP COLUMN default_settings;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove default_settings since it is no longer used.', SYSTIMESTAMP, 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-7', '2.0.1', '3:9ee1cd65b85caaca3178939bac1e0fcf', 6);

-- Changeset changelog_7.0.0.groovy::7.0.0-8::owf::(Checksum: 3:ef688a16b0055a8024a489393bcfc987)
-- Remove column_count since it is no longer used.
ALTER TABLE dashboard DROP COLUMN column_count;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove column_count since it is no longer used.', SYSTIMESTAMP, 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-8', '2.0.1', '3:ef688a16b0055a8024a489393bcfc987', 7);

-- Changeset changelog_7.0.0.groovy::7.0.0-9::owf::(Checksum: 3:43e9c996af93d8cface8845446b8a525)
-- Create stack table
CREATE TABLE stack (id NUMBER(38,0) NOT NULL, version NUMBER(38,0) NOT NULL, name VARCHAR2(256) NOT NULL, description VARCHAR2(4000), stack_context VARCHAR2(200) NOT NULL, image_url VARCHAR2(2083), descriptor_url VARCHAR2(2083), CONSTRAINT stackPK PRIMARY KEY (id), UNIQUE (stack_context));

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create stack table', SYSTIMESTAMP, 'Create Table', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-9', '2.0.1', '3:43e9c996af93d8cface8845446b8a525', 8);

-- Changeset changelog_7.0.0.groovy::7.0.0-10::owf::(Checksum: 3:62f6507a0ac6b50fb383b2a47ba702a8)
-- Create stack_groups table
CREATE TABLE stack_groups (group_id NUMBER(38,0) NOT NULL, stack_id NUMBER(38,0) NOT NULL);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create stack_groups table', SYSTIMESTAMP, 'Create Table', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-10', '2.0.1', '3:62f6507a0ac6b50fb383b2a47ba702a8', 9);

-- Changeset changelog_7.0.0.groovy::7.0.0-12::owf::(Checksum: 3:7a64e2e16d79e54338e9ec959602447a)
-- Add primary key constraint for group_id and stack_id in stack_groups table
ALTER TABLE stack_groups ADD CONSTRAINT pk_stack_groups PRIMARY KEY (group_id, stack_id);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add primary key constraint for group_id and stack_id in stack_groups table', SYSTIMESTAMP, 'Add Primary Key', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-12', '2.0.1', '3:7a64e2e16d79e54338e9ec959602447a', 10);

-- Changeset changelog_7.0.0.groovy::7.0.0-13::owf::(Checksum: 3:0e9ce4f940d8f89b0fd983abc89ee775)
-- Add foreign key constraints for group_id and stack_id in stack_groups table
ALTER TABLE stack_groups ADD CONSTRAINT FK9584AB6B6B3A1281 FOREIGN KEY (stack_id) REFERENCES stack (id);

ALTER TABLE stack_groups ADD CONSTRAINT FK9584AB6B3B197B21 FOREIGN KEY (group_id) REFERENCES owf_group (id);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign key constraints for group_id and stack_id in stack_groups table', SYSTIMESTAMP, 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-13', '2.0.1', '3:0e9ce4f940d8f89b0fd983abc89ee775', 11);

-- Changeset changelog_7.0.0.groovy::7.0.0-14::owf::(Checksum: 3:803b99533e3b4d760c15e2f1eca18e05)
-- Add stack_default field to group
ALTER TABLE owf_group ADD stack_default NUMBER(1) DEFAULT 0;

UPDATE owf_group SET stack_default = 0;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add stack_default field to group', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-14', '2.0.1', '3:803b99533e3b4d760c15e2f1eca18e05', 12);

-- Changeset changelog_7.0.0.groovy::7.0.0-16::owf::(Checksum: 3:e03b1ecbd7f5efdd372183d1eaaa8d27)
-- Insert OWF stack
insert into stack (id, version, name, description, stack_context, image_url) values (hibernate_sequence.nextval, 0, 'OWF', 'OWF Stack', 'owf', 'themes/common/images/owf.png');

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Insert OWF stack', SYSTIMESTAMP, 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-16', '2.0.1', '3:e03b1ecbd7f5efdd372183d1eaaa8d27', 13);

-- Changeset changelog_7.0.0.groovy::7.0.0-19::owf::(Checksum: 3:5232ecbd067faac92f9a4db665a544f5)
-- Insert OWF stack default group
insert into owf_group (id, version, automatic, name, status, stack_default) values (hibernate_sequence.nextval, 0, 0, 'ce86a612-c355-486e-9c9e-5252553cc58e', 'active', 1);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Insert OWF stack default group', SYSTIMESTAMP, 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-19', '2.0.1', '3:5232ecbd067faac92f9a4db665a544f5', 14);

-- Changeset changelog_7.0.0.groovy::7.0.0-21::owf::(Checksum: 3:32c56c09a37ffceb75742132f42ddf73)
insert into stack_groups (stack_id, group_id) values ((select id from stack where name = 'OWF'), (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58e'));

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-21', '2.0.1', '3:32c56c09a37ffceb75742132f42ddf73', 15);

-- Changeset changelog_7.0.0.groovy::7.0.0-22::owf::(Checksum: 3:7146f45f54d8db1d72abb498d691cebb)
-- Add a reference to a host stack to dashboard records to track where user instances should appear
ALTER TABLE dashboard ADD stack_id NUMBER(38,0);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add a reference to a host stack to dashboard records to track where user instances should appear', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-22', '2.0.1', '3:7146f45f54d8db1d72abb498d691cebb', 16);

-- Changeset changelog_7.0.0.groovy::7.0.0-23::owf::(Checksum: 3:4d6a39028c8a5cc0a85b8b37fbf1b1fc)
-- Add foreign key constraint for stack_id in the dashboard table
ALTER TABLE dashboard ADD CONSTRAINT FKC18AEA946B3A1281 FOREIGN KEY (stack_id) REFERENCES stack (id);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign key constraint for stack_id in the dashboard table', SYSTIMESTAMP, 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-23', '2.0.1', '3:4d6a39028c8a5cc0a85b8b37fbf1b1fc', 17);

-- Changeset changelog_7.0.0.groovy::7.0.0-24::owf::(Checksum: 3:f1e6830542a856459733effeca8aaa24)
-- Add a property to track the count of unique widgets present on the dashboards of a stack
ALTER TABLE stack ADD unique_widget_count NUMBER(38,0) DEFAULT '0';

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add a property to track the count of unique widgets present on the dashboards of a stack', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-24', '2.0.1', '3:f1e6830542a856459733effeca8aaa24', 18);

-- Changeset changelog_7.0.0.groovy::7.0.0-25::owf::(Checksum: 3:ac445082cf2ee5903046bef22276a996)
delete from stack_groups where stack_id = (select id from stack where name = 'OWF') and group_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58e');

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-25', '2.0.1', '3:ac445082cf2ee5903046bef22276a996', 19);

-- Changeset changelog_7.0.0.groovy::7.0.0-26::owf::(Checksum: 3:74dc7504043a1f24e2d86d75a2dab571)
-- Delete OWF Stack Group
DELETE FROM owf_group  WHERE name like 'ce86a612-c355-486e-9c9e-5252553cc58e';

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Delete OWF Stack Group', SYSTIMESTAMP, 'Delete Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-26', '2.0.1', '3:74dc7504043a1f24e2d86d75a2dab571', 20);

-- Changeset changelog_7.0.0.groovy::7.0.0-27::owf::(Checksum: 3:cae136582b06f1ed04a6309814236cdc)
-- Delete OWF Stack
DELETE FROM stack  WHERE name like 'OWF';

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Delete OWF Stack', SYSTIMESTAMP, 'Delete Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-27', '2.0.1', '3:cae136582b06f1ed04a6309814236cdc', 21);

-- Changeset changelog_7.0.0.groovy::7.0.0-28::owf::(Checksum: 3:f1bf16779c9d7419bc7cc94e81687786)
-- Add user_widget field to person_widget_definition table
ALTER TABLE person_widget_definition ADD user_widget NUMBER(1) DEFAULT 0;

UPDATE person_widget_definition SET user_widget = 0;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add user_widget field to person_widget_definition table', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-28', '2.0.1', '3:f1bf16779c9d7419bc7cc94e81687786', 22);

-- Changeset changelog_7.0.0.groovy::7.0.0-29::owf::(Checksum: 3:29f71e23b2eb9ca309842616800501b2)
-- Update existing PWD records to set whether they were added to a user directly or just via a group
UPDATE person_widget_definition SET user_widget = 1 WHERE group_widget=0;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Update existing PWD records to set whether they were added to a user directly or just via a group', SYSTIMESTAMP, 'Update Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-29', '2.0.1', '3:29f71e23b2eb9ca309842616800501b2', 23);

-- Changeset changelog_7.0.0.groovy::7.0.0-30::owf::(Checksum: 3:b2da3152051ee5103b9157dcca94ee79)
-- Remove the Widget Approvals widget definition and all of its user, group, intent, and widget type references
DELETE FROM domain_mapping  WHERE dest_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp') and  dest_type = 'widget_definition';

DELETE FROM person_widget_definition  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp');

DELETE FROM widget_definition_widget_types  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp');

DELETE FROM widget_def_intent_data_types  WHERE widget_definition_intent_id in (select id from widget_def_intent where widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp'));

DELETE FROM widget_def_intent  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp');

DELETE FROM widget_definition  WHERE widget_url='admin/MarketplaceApprovals.gsp';

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove the Widget Approvals widget definition and all of its user, group, intent, and widget type references', SYSTIMESTAMP, 'Delete Data (x6)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-30', '2.0.1', '3:b2da3152051ee5103b9157dcca94ee79', 24);

-- Changeset changelog_7.0.0.groovy::7.0.0-53::owf::(Checksum: 3:95913c657b14ecdbb8c9f85fc0a071b1)
-- Expand a dashboard's description field to 4000 to match Marketplace
ALTER TABLE dashboard MODIFY description VARCHAR2(4000);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Expand a dashboard''s description field to 4000 to match Marketplace', SYSTIMESTAMP, 'Modify data type', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-53', '2.0.1', '3:95913c657b14ecdbb8c9f85fc0a071b1', 25);

-- Release Database Lock
