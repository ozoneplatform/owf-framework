-- No Changes from 7.0.0 to 7.1.0-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 6/10/13 4:11 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.2.0.groovy::7.2.0-1::owf::(Checksum: 3:69c7062f6bb536836805960380dfdb90)
-- Add fullscreen widget types to table
INSERT INTO `widget_type` (`id`, `name`, `version`) VALUES (5, 'fullscreen', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add fullscreen widget types to table', NOW(), 'Insert Row', 'EXECUTED', 'changelog_7.2.0.groovy', '7.2.0-1', '2.0.1', '3:69c7062f6bb536836805960380dfdb90', 1);

-- Release Database Lock
-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 11/20/13 12:23 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.3.0.groovy::7.3.0-1::owf::(Checksum: 3:da90c894252394662881278c5011df4f)
-- Add type to dashboard
ALTER TABLE `dashboard` ADD `type` VARCHAR(255);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add type to dashboard', NOW(), 'Add Column', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-1', '2.0.1', '3:da90c894252394662881278c5011df4f', 1);

-- Changeset changelog_7.3.0.groovy::7.3.0-2::owf::(Checksum: 3:fe230a1ac4b1d1f7ea94cf131fcd8827)
-- Update existing dashboards to set type to marketplace if name is Apps Mall
UPDATE `dashboard` SET `type` = 'marketplace' WHERE name='Apps Mall';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Update existing dashboards to set type to marketplace if name is Apps Mall', NOW(), 'Update Data', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-2', '2.0.1', '3:fe230a1ac4b1d1f7ea94cf131fcd8827', 2);

-- Changeset changelog_7.3.0.groovy::7.3.0-3::owf::(Checksum: 3:85d934f83517b58484131edbd73d1252)
CREATE TABLE `application_configuration` (`id` BIGINT AUTO_INCREMENT  NOT NULL, `version` BIGINT NOT NULL, `created_by_id` BIGINT, `created_date` DATE, `edited_by_id` BIGINT, `edited_date` DATE, `code` VARCHAR(250) NOT NULL, `VALUE` VARCHAR(2000), `title` VARCHAR(250) NOT NULL, `description` VARCHAR(2000), `type` VARCHAR(250) NOT NULL, `group_name` VARCHAR(250) NOT NULL, `sub_group_name` VARCHAR(250), `mutable` TINYINT(1) NOT NULL, `sub_group_order` BIGINT, `help` VARCHAR(2000), CONSTRAINT `application_configurationPK` PRIMARY KEY (`id`), UNIQUE (`code`)) ENGINE=InnoDB;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Create Table', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-3', '2.0.1', '3:85d934f83517b58484131edbd73d1252', 3);

-- Changeset changelog_7.3.0.groovy::7.3.0-4::owf::(Checksum: 3:3d651aa99a57515a9d4c96f06568ad93)
-- Create index for application_configuration.group_name
CREATE INDEX `FKFC9C0477666C6D2` ON `application_configuration`(`created_by_id`);

CREATE INDEX `FKFC9C047E31CB353` ON `application_configuration`(`edited_by_id`);

CREATE INDEX `app_config_group_name_idx` ON `application_configuration`(`group_name`);

ALTER TABLE `application_configuration` ADD CONSTRAINT `FKFC9C0477666C6D2` FOREIGN KEY (`created_by_id`) REFERENCES `person` (`id`);

ALTER TABLE `application_configuration` ADD CONSTRAINT `FKFC9C047E31CB353` FOREIGN KEY (`edited_by_id`) REFERENCES `person` (`id`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Create index for application_configuration.group_name', NOW(), 'Create Index (x3), Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-4', '2.0.1', '3:3d651aa99a57515a9d4c96f06568ad93', 4);

-- Changeset changelog_7.3.0.groovy::7.3.0-5::owf::(Checksum: 3:ebf4c6cfc522e45a5efc657a72cc6b8d)
-- Add icon image url to dashboard
ALTER TABLE `dashboard` ADD `icon_image_url` VARCHAR(2083);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add icon image url to dashboard', NOW(), 'Add Column', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-5', '2.0.1', '3:ebf4c6cfc522e45a5efc657a72cc6b8d', 5);

-- Changeset changelog_7.3.0.groovy::7.3.0-6::owf::(Checksum: 3:05b0697fb3adb15e703588ccfbdc0f7c)
-- Add published_to_store and marked_for_deletion columns to dashboard table
ALTER TABLE `dashboard` ADD `published_to_store` TINYINT(1);

ALTER TABLE `dashboard` ADD `marked_for_deletion` TINYINT(1);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add published_to_store and marked_for_deletion columns to dashboard table', NOW(), 'Add Column', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-6', '2.0.1', '3:05b0697fb3adb15e703588ccfbdc0f7c', 6);

-- Changeset changelog_7.3.0.groovy::7.3.0-7::owf::(Checksum: 3:e50b259c6a288dbdafc06dcd1ef34c37)
ALTER TABLE `stack` ADD `owner_id` BIGINT;

CREATE INDEX `FK68AC2888656347D` ON `stack`(`owner_id`);

ALTER TABLE `stack` ADD CONSTRAINT `FK68AC2888656347D` FOREIGN KEY (`owner_id`) REFERENCES `person` (`id`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Add Column, Create Index, Add Foreign Key Constraint', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-7', '2.0.1', '3:e50b259c6a288dbdafc06dcd1ef34c37', 7);

-- Changeset changelog_7.3.0.groovy::7.3.0-8::owf::(Checksum: 3:0ed4f5bc7205d2c13ef27bb516e27d18)
-- Change the name of Stack and Widget admin widgets to be Apps and App Component
UPDATE `widget_definition` SET `display_name` = 'App Components' WHERE display_name='Widgets';

UPDATE `widget_definition` SET `display_name` = 'App Component Editor' WHERE display_name='Widget Editor';

UPDATE `widget_definition` SET `display_name` = 'Apps' WHERE display_name='Stacks';

UPDATE `widget_definition` SET `display_name` = 'App Editor' WHERE display_name='Stack Editor';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Change the name of Stack and Widget admin widgets to be Apps and App Component', NOW(), 'Update Data (x4)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-8', '2.0.1', '3:0ed4f5bc7205d2c13ef27bb516e27d18', 8);

-- Changeset changelog_7.3.0.groovy::7.3.0-9::owf::(Checksum: 3:63dabf04f3e3d7526260fff486e719d5)
-- Removing all references to Group Dashboards and renaming the Stack and Stack Editor widgets in the Admin dashboard
DELETE FROM `widget_definition_widget_types`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp');

DELETE FROM `domain_mapping`  WHERE dest_id = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp');

DELETE FROM `person_widget_definition`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp');

DELETE FROM `tag_links`  WHERE tag_ref = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp');

DELETE FROM `widget_definition`  WHERE widget_url = 'admin/GroupDashboardManagement.gsp';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Removing all references to Group Dashboards and renaming the Stack and Stack Editor widgets in the Admin dashboard', NOW(), 'Delete Data (x5)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-9', '2.0.1', '3:63dabf04f3e3d7526260fff486e719d5', 9);

-- Changeset changelog_7.3.0.groovy::7.3.0-16::owf::(Checksum: 3:2eb18ef95e182e90bae0a3f9caf69fc2)
-- Adding a column named display_name to the table widget_type so that the UI name is decoupled from the actual back-end name; The display_name will be the same as the name, except for marketplace, which will be displayed as store
ALTER TABLE `widget_type` ADD `display_name` VARCHAR(256);

UPDATE `widget_type` SET `display_name` = name WHERE name != 'marketplace';

UPDATE `widget_type` SET `display_name` = 'store' WHERE name = 'marketplace';

ALTER TABLE `widget_type` MODIFY `display_name` VARCHAR(256) NOT NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Adding a column named display_name to the table widget_type so that the UI name is decoupled from the actual back-end name; The display_name will be the same as the name, except for marketplace, which will be displayed as store', NOW(), 'Add Column, Update Data (x2), Add Not-Null Constraint', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-16', '2.0.1', '3:2eb18ef95e182e90bae0a3f9caf69fc2', 10);

-- Changeset changelog_7.3.0.groovy::7.3.0-17::owf::(Checksum: 3:cc301f6f6f73cf363fe77c5e28604b25)
ALTER TABLE `application_configuration` ALTER `version` SET DEFAULT 0;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Add Default Value', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-17', '2.0.1', '3:cc301f6f6f73cf363fe77c5e28604b25', 11);

-- Changeset app_config_7.3.0.groovy::app_config-7.3.0-1::owf::(Checksum: 3:b6de99e7893c65e875383c4167711771)
INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.enable.cef.logging', 'AUDITING', 1, NULL, 1, ' ', 'Boolean', 'true', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.enable.cef.object.access.logging', 'AUDITING', 1, NULL, 2, ' ', 'Boolean', 'false', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.cef.sweep.log.location', 'AUDITING', 1, NULL, 3, ' ', 'Boolean', 'true', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.cef.log.location', 'AUDITING', 1, NULL, 4, ' ', 'String', '/usr/share/tomcat6', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.enable.cef.log.sweep', 'AUDITING', 1, NULL, 5, ' ', 'String', '/var/log/cef', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.security.level', 'AUDITING', 1, NULL, 6, ' ', 'String', NULL, 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.session.control.enabled', 'USER_ACCOUNT_SETTINGS', 1, 'Session Control', 1, ' ', 'Boolean', 'false', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.session.control.max.concurrent', 'USER_ACCOUNT_SETTINGS', 1, 'Session Control', 2, ' ', 'Integer', '1', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.disable.inactive.accounts', 'USER_ACCOUNT_SETTINGS', 1, 'Inactive Accounts', 1, ' ', 'Boolean', 'true', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.inactivity.threshold', 'USER_ACCOUNT_SETTINGS', 1, 'Inactive Accounts', 2, ' ', 'Integer', '90', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.job.disable.accounts.start.time', 'HIDDEN', 1, NULL, 1, ' ', 'String', '23:59:59', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.job.disable.accounts.interval', 'HIDDEN', 1, NULL, 2, ' ', 'Integer', '1440', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.background.url', 'BRANDING', 1, 'Custom Background', 1, ' ', 'String', '', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.header.url', 'BRANDING', 1, 'Custom Header and Footer', 1, ' ', 'String', NULL, 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.header.height', 'BRANDING', 1, 'Custom Header and Footer', 2, ' ', 'Integer', '0', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.footer.url', 'BRANDING', 1, 'Custom Header and Footer', 3, ' ', 'String', NULL, 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.footer.height', 'BRANDING', 1, 'Custom Header and Footer', 4, ' ', 'Integer', '0', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.css', 'BRANDING', 1, 'Custom Header and Footer', 5, ' ', 'String', NULL, 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('owf.custom.jss', 'BRANDING', 1, 'Custom Header and Footer', 6, ' ', 'String', NULL, 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('free.warning.content', 'BRANDING', 1, NULL, 1, ' ', 'String', NULL, 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Insert Row (x20)', 'EXECUTED', 'app_config_7.3.0.groovy', 'app_config-7.3.0-1', '2.0.1', '3:b6de99e7893c65e875383c4167711771', 12);

-- Changeset changelog_7.3.0.groovy::7.3.0-18::owf::(Checksum: 3:e20a0daf3c5203f6a4aa2df0b27d0673)
-- Add isApproved to stack
ALTER TABLE `stack` ADD `approved` TINYINT(1);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add isApproved to stack', NOW(), 'Add Column', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-18', '2.0.1', '3:e20a0daf3c5203f6a4aa2df0b27d0673', 13);

-- Changeset changelog_7.3.0.groovy::7.3.0-21::owf::(Checksum: 3:8c5356773157ee7fa260d2d83900cba5)
-- Create Administrator's App and its default group.
INSERT INTO `stack` (`approved`, `description`, `image_url`, `name`, `stack_context`, `unique_widget_count`, `version`) VALUES (1, 'This application collects the administrative components into a common set of application pages for managing system resources.  These pages can be used to create, modify, update, and delete Apps, App Components, Users and Groups, and system configuration settings.', 'themes/common/images/admin/64x64_admin_app.png', 'Administration', 'ef8b5d6f-4b16-4743-9a57-31683c94b616', 5, 1);

INSERT INTO `owf_group` (`automatic`, `description`, `display_name`, `email`, `name`, `stack_default`, `status`, `version`) VALUES (0, '', NULL, NULL, '9e05a814-c1a4-4db1-a672-bccae0f0b311', 1, 'active', 0);

INSERT INTO `stack_groups` (`group_id`, `stack_id`) VALUES ((SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), (SELECT id FROM stack WHERE stack_context='ef8b5d6f-4b16-4743-9a57-31683c94b616'));

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Create Administrator''s App and its default group.', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-21', '2.0.1', '3:8c5356773157ee7fa260d2d83900cba5', 14);

-- Changeset changelog_7.3.0.groovy::7.3.0-22::owf::(Checksum: 3:5fdc73b48e8adc3314e2644e28a3f072)
-- Add Administration App to the OWF Administrators group.
INSERT INTO `stack_groups` (`group_id`, `stack_id`) VALUES ((SELECT id FROM owf_group WHERE name='OWF Administrators'), (SELECT id FROM stack WHERE stack_context='ef8b5d6f-4b16-4743-9a57-31683c94b616'));

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add Administration App to the OWF Administrators group.', NOW(), 'Insert Row', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-22', '2.0.1', '3:5fdc73b48e8adc3314e2644e28a3f072', 15);

-- Changeset changelog_7.3.0.groovy::7.3.0-26::owf::(Checksum: 3:95cb3388cf30baf28ba7223567b328b7)
-- Add new admin components that include universal names.  These will be the primary admin components moving forward.
INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'App Component Editor', 440, 'themes/common/images/adm-tools/Widgets64.png', 'themes/common/images/adm-tools/Widgets24.png', 0, 'org.ozoneplatform.owf.admin.appcomponentedit', 0, 0, '679294b3-ccc3-4ace-a061-e3f27ed86451', 'admin/WidgetEdit.gsp', '1.0', 581);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'App Components', 440, 'themes/common/images/adm-tools/Widgets64.png', 'themes/common/images/adm-tools/Widgets24.png', 0, 'org.ozoneplatform.owf.admin.appcomponentmanagement', 0, 1, '48edfe94-4291-4991-a648-c19a903a663b', 'admin/WidgetManagement.gsp', '1.0', 818);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Group Editor', 440, 'themes/common/images/adm-tools/Groups64.png', 'themes/common/images/adm-tools/Groups24.png', 0, 'org.ozoneplatform.owf.admin.groupedit', 0, 0, 'dc5c2062-aaa8-452b-897f-60b4b55ab564', 'admin/GroupEdit.gsp', '1.0', 581);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Groups', 440, 'themes/common/images/adm-tools/Groups64.png', 'themes/common/images/adm-tools/Groups24.png', 0, 'org.ozoneplatform.owf.admin.groupmanagement', 0, 1, '53a2a879-442c-4012-9215-a17604dedff7', 'admin/GroupManagement.gsp', '1.0', 818);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'User Editor', 440, 'themes/common/images/adm-tools/Users64.png', 'themes/common/images/adm-tools/Users24.png', 0, 'org.ozoneplatform.owf.admin.useredit', 0, 0, 'a9bf8e71-692d-44e3-a465-5337ce5e725e', 'admin/UserEdit.gsp', '1.0', 581);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Users', 440, 'themes/common/images/adm-tools/Users64.png', 'themes/common/images/adm-tools/Users24.png', 0, 'org.ozoneplatform.owf.admin.usermanagement', 0, 1, '38070c45-5f6a-4460-810c-6e3496495ec4', 'admin/UserManagement.gsp', '1.0', 818);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Configuration', 440, 'themes/common/images/adm-tools/Configuration64.png', 'themes/common/images/adm-tools/Configuration24.png', 0, 'org.ozoneplatform.owf.admin.configuration', 0, 1, 'af180bfc-3924-4111-93de-ad6e9bfc060e', 'admin/Configuration.gsp', '1.0', 900);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'App Editor', 440, 'themes/common/images/adm-tools/Stacks64.png', 'themes/common/images/adm-tools/Stacks24.png', 0, 'org.ozoneplatform.owf.admin.appedit', 0, 0, '72c382a3-89e7-4abf-94db-18db7779e1df', 'admin/StackEdit.gsp', '1.0', 581);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Apps', 440, 'themes/common/images/adm-tools/Stacks64.png', 'themes/common/images/adm-tools/Stacks24.png', 0, 'org.ozoneplatform.owf.admin.appmanagement', 0, 1, '391dd2af-a207-41a3-8e51-2b20ec3e7241', 'admin/StackManagement.gsp', '1.0', 818);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Page Editor', 440, 'themes/common/images/adm-tools/Dashboards64.png', 'themes/common/images/adm-tools/Dashboards24.png', 0, 'org.ozoneplatform.owf.admin.pageedit', 0, 0, '2445afb9-eb3f-4b79-acf8-6b12180921c3', 'admin/DashboardEdit.gsp', '1.0', 581);

insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
            select id, 2 from widget_definition
            where widget_guid in (
                '72c382a3-89e7-4abf-94db-18db7779e1df',
                '391dd2af-a207-41a3-8e51-2b20ec3e7241',
                '679294b3-ccc3-4ace-a061-e3f27ed86451',
                '48edfe94-4291-4991-a648-c19a903a663b',
                'af180bfc-3924-4111-93de-ad6e9bfc060e',
                'dc5c2062-aaa8-452b-897f-60b4b55ab564',
                '53a2a879-442c-4012-9215-a17604dedff7',
                'a9bf8e71-692d-44e3-a465-5337ce5e725e',
                '38070c45-5f6a-4460-810c-6e3496495ec4',
                '2445afb9-eb3f-4b79-acf8-6b12180921c3'
            );

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add new admin components that include universal names.  These will be the primary admin components moving forward.', NOW(), 'Insert Row (x10), Custom SQL', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-26', '2.0.1', '3:95cb3388cf30baf28ba7223567b328b7', 16);

-- Changeset changelog_7.3.0.groovy::7.3.0-27::owf::(Checksum: 3:013901f70bd73571c7ae872101df29db)
-- Add the pages for the administrator's app.
INSERT INTO `dashboard` (`altered_by_admin`, `dashboard_position`, `description`, `guid`, `icon_image_url`, `isdefault`, `layout_config`, `locked`, `marked_for_deletion`, `name`, `published_to_store`, `type`, `version`) VALUES (0, 1, 'Administer the Apps in the system.', 'cbb92835-7d13-41dc-8f28-3eba59a6a6d5', 'themes/common/images/adm-tools/Stacks64.png', 0, '{"widgets":[{"universalName":"org.ozoneplatform.owf.admin.appmanagement","widgetGuid":"391dd2af-a207-41a3-8e51-2b20ec3e7241","uniqueId":"bf05736e-a52e-d4ee-7da5-4e39c6df53c8","dashboardGuid":"cbb92835-7d13-41dc-8f28-3eba59a6a6d5","paneGuid":"6ff1c292-9689-4240-7cd8-e4a251978395","intentConfig":null,"launchData":null,"name":"Apps","active":true,"x":0,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":1554}],"height":"100%","items":[],"xtype":"fitpane","flex":1,"paneType":"fitpane","defaultSettings":{}}', 0, 0, 'Apps', 1, '', 0);

update dashboard set stack_id = (select id from stack where stack_context = 'ef8b5d6f-4b16-4743-9a57-31683c94b616') where guid = 'cbb92835-7d13-41dc-8f28-3eba59a6a6d5';

INSERT INTO `dashboard` (`altered_by_admin`, `dashboard_position`, `description`, `guid`, `icon_image_url`, `isdefault`, `layout_config`, `locked`, `marked_for_deletion`, `name`, `published_to_store`, `type`, `version`) VALUES (0, 2, 'Administer the App Components in the system.', '2fc20999-01a6-4275-83f4-f7c68d03d938', 'themes/common/images/adm-tools/Widgets64.png', 0, '{"widgets":[{"universalName":"org.ozoneplatform.owf.admin.appcomponentmanagement","widgetGuid":"48edfe94-4291-4991-a648-c19a903a663b","uniqueId":"fa442c1d-d23e-51a9-3be8-39b203c7d95d","dashboardGuid":"2fc20999-01a6-4275-83f4-f7c68d03d938","paneGuid":"49762ea2-42cc-9e76-b6be-c60bd7ae9c03","intentConfig":null,"launchData":null,"name":"App Components","active":false,"x":0,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":1554}],"height":"100%","items":[],"xtype":"fitpane","flex":1,"paneType":"fitpane","defaultSettings":{}}', 0, 0, 'App Components', 1, '', 0);

update dashboard set stack_id = (select id from stack where stack_context = 'ef8b5d6f-4b16-4743-9a57-31683c94b616') where guid = '2fc20999-01a6-4275-83f4-f7c68d03d938';

INSERT INTO `dashboard` (`altered_by_admin`, `dashboard_position`, `description`, `guid`, `icon_image_url`, `isdefault`, `layout_config`, `locked`, `marked_for_deletion`, `name`, `published_to_store`, `type`, `version`) VALUES (0, 3, 'Administer the Users and Groups in the system.', '94bf7ed8-bed9-45ad-933b-4d85584cb483', 'themes/common/images/adm-tools/Groups64.png', 0, '{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"universalName":"org.ozoneplatform.owf.admin.usermanagement","widgetGuid":"38070c45-5f6a-4460-810c-6e3496495ec4","uniqueId":"53783596-8233-9e34-4f91-72e92328785d","dashboardGuid":"94bf7ed8-bed9-45ad-933b-4d85584cb483","paneGuid":"7f3657f1-b391-4ab5-f6be-e4393ea5d72d","intentConfig":null,"launchData":null,"name":"Users","active":true,"x":0,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":775}],"paneType":"fitpane","defaultSettings":{"widgetStates":{"101f119e-b56a-4e16-8219-11048c020038":{"x":94,"y":199,"height":440,"width":581,"timestamp":1377274970150}}}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"universalName":"org.ozoneplatform.owf.admin.groupmanagement","widgetGuid":"53a2a879-442c-4012-9215-a17604dedff7","uniqueId":"3e0647e3-62b4-cd08-6d6b-9ece1670b10e","dashboardGuid":"94bf7ed8-bed9-45ad-933b-4d85584cb483","paneGuid":"e9746a83-a610-6b01-43c4-d543278729b4","intentConfig":null,"launchData":null,"name":"Groups","active":true,"x":779,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":775}],"defaultSettings":{"widgetStates":{"d6ce3375-6e89-45ab-a7be-b6cf3abb0e8c":{"x":0,"y":0,"height":440,"width":581,"timestamp":1377274968504}}}}],"flex":1}', 0, 0, 'Users and Groups', 1, '', 0);

update dashboard set stack_id = (select id from stack where stack_context = 'ef8b5d6f-4b16-4743-9a57-31683c94b616') where guid = '94bf7ed8-bed9-45ad-933b-4d85584cb483';

INSERT INTO `dashboard` (`altered_by_admin`, `dashboard_position`, `description`, `guid`, `icon_image_url`, `isdefault`, `layout_config`, `locked`, `marked_for_deletion`, `name`, `published_to_store`, `type`, `version`) VALUES (0, 4, 'Administer the system configuration.', '976cbf75-5537-410f-88a3-375c5cf970bc', 'themes/common/images/adm-tools/Configuration64.png', 0, '{"widgets":[{"universalName":"org.ozoneplatform.owf.admin.configuration","widgetGuid":"af180bfc-3924-4111-93de-ad6e9bfc060e","uniqueId":"8e7d717c-cece-3d18-c060-c3946d5e7f55","dashboardGuid":"976cbf75-5537-410f-88a3-375c5cf970bc","paneGuid":"7cd8017a-f948-7728-0e20-5b5c2182a432","intentConfig":null,"launchData":null,"name":"Configuration","active":false,"x":0,"y":33,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":973,"width":1554}],"height":"100%","items":[],"xtype":"fitpane","flex":1,"paneType":"fitpane","defaultSettings":{}}', 0, 0, 'Configuration', 1, '', 0);

update dashboard set stack_id = (select id from stack where stack_context = 'ef8b5d6f-4b16-4743-9a57-31683c94b616') where guid = '976cbf75-5537-410f-88a3-375c5cf970bc';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add the pages for the administrator''s app.', NOW(), 'Insert Row, Custom SQL, Insert Row, Custom SQL, Insert Row, Custom SQL, Insert Row, Custom SQL', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-27', '2.0.1', '3:013901f70bd73571c7ae872101df29db', 17);

-- Changeset changelog_7.3.0.groovy::7.3.0-28::owf::(Checksum: 3:f5a487dba681fe5229c69ee043168f2f)
-- Add the associations for the stack's default group to the app pages..
INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM dashboard WHERE guid='cbb92835-7d13-41dc-8f28-3eba59a6a6d5'), 'dashboard', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM dashboard WHERE guid='2fc20999-01a6-4275-83f4-f7c68d03d938'), 'dashboard', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM dashboard WHERE guid='94bf7ed8-bed9-45ad-933b-4d85584cb483'), 'dashboard', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM dashboard WHERE guid='976cbf75-5537-410f-88a3-375c5cf970bc'), 'dashboard', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add the associations for the stack''s default group to the app pages..', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-28', '2.0.1', '3:f5a487dba681fe5229c69ee043168f2f', 18);

-- Changeset changelog_7.3.0.groovy::7.3.0-29::owf::(Checksum: 3:eb228dae1ba67f1dc85a7a60397e32ae)
-- Add the associations for the stack's default group to the admin components.
INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM widget_definition WHERE widget_guid='72c382a3-89e7-4abf-94db-18db7779e1df'), 'widget_definition', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM widget_definition WHERE widget_guid='391dd2af-a207-41a3-8e51-2b20ec3e7241'), 'widget_definition', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM widget_definition WHERE widget_guid='679294b3-ccc3-4ace-a061-e3f27ed86451'), 'widget_definition', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM widget_definition WHERE widget_guid='48edfe94-4291-4991-a648-c19a903a663b'), 'widget_definition', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM widget_definition WHERE widget_guid='af180bfc-3924-4111-93de-ad6e9bfc060e'), 'widget_definition', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM widget_definition WHERE widget_guid='dc5c2062-aaa8-452b-897f-60b4b55ab564'), 'widget_definition', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM widget_definition WHERE widget_guid='53a2a879-442c-4012-9215-a17604dedff7'), 'widget_definition', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM widget_definition WHERE widget_guid='a9bf8e71-692d-44e3-a465-5337ce5e725e'), 'widget_definition', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES ((SELECT id FROM widget_definition WHERE widget_guid='38070c45-5f6a-4460-810c-6e3496495ec4'), 'widget_definition', 'owns', (SELECT id FROM owf_group WHERE name='9e05a814-c1a4-4db1-a672-bccae0f0b311'), 'group', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add the associations for the stack''s default group to the admin components.', NOW(), 'Insert Row (x9)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-29', '2.0.1', '3:eb228dae1ba67f1dc85a7a60397e32ae', 19);

-- Changeset changelog_7.3.0.groovy::7.3.0-31::owf::(Checksum: 3:923bc0f0a83220ac48a155d89e8d1c1c)
-- Remove the old admin widgets.
DELETE FROM `widget_definition_widget_types`  WHERE widget_definition_id in (select id from widget_definition where widget_url in ('admin/UserManagement.gsp', 'admin/UserEdit.gsp', 'admin/WidgetManagement.gsp', 'admin/WidgetEdit.gsp', 'admin/GroupManagement.gsp', 'admin/GroupEdit.gsp', 'admin/DashboardEdit.gsp', 'admin/StackManagement.gsp', 'admin/StackEdit.gsp', 'admin/Configuration.gsp') and universal_name is null);

DELETE FROM `domain_mapping`  WHERE dest_type='widget_definition' and dest_id in (select id from widget_definition where widget_url in ('admin/UserManagement.gsp', 'admin/UserEdit.gsp', 'admin/WidgetManagement.gsp', 'admin/WidgetEdit.gsp', 'admin/GroupManagement.gsp', 'admin/GroupEdit.gsp', 'admin/DashboardEdit.gsp', 'admin/StackManagement.gsp', 'admin/StackEdit.gsp', 'admin/Configuration.gsp') and universal_name is null);

DELETE FROM `person_widget_definition`  WHERE widget_definition_id in (select id from widget_definition where widget_url in ('admin/UserManagement.gsp', 'admin/UserEdit.gsp', 'admin/WidgetManagement.gsp', 'admin/WidgetEdit.gsp', 'admin/GroupManagement.gsp', 'admin/GroupEdit.gsp', 'admin/DashboardEdit.gsp', 'admin/StackManagement.gsp', 'admin/StackEdit.gsp', 'admin/Configuration.gsp') and universal_name is null);

DELETE FROM `widget_definition`  WHERE widget_url in ('admin/UserManagement.gsp', 'admin/UserEdit.gsp', 'admin/WidgetManagement.gsp', 'admin/WidgetEdit.gsp', 'admin/GroupManagement.gsp', 'admin/GroupEdit.gsp', 'admin/DashboardEdit.gsp', 'admin/StackManagement.gsp', 'admin/StackEdit.gsp', 'admin/Configuration.gsp') and universal_name is null;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Remove the old admin widgets.', NOW(), 'Delete Data (x4)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-31', '2.0.1', '3:923bc0f0a83220ac48a155d89e8d1c1c', 20);

-- Release Database Lock
-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 1/17/14 6:18 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Release Database Lock
-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 2/4/14 12:00 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.10.0.groovy::7.10.0-1::owf::(Checksum: 3:115190a042e53f65034683e629f8cf47)
ALTER TABLE `person` ADD `last_notification` DATETIME;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Add Column', 'EXECUTED', 'changelog_7.10.0.groovy', '7.10.0-1', '2.0.1', '3:115190a042e53f65034683e629f8cf47', 1);

-- Changeset changelog_7.10.0.groovy::7.10.0-2::owf::(Checksum: 3:41ac759cfb732888d39c704edd1aa12d)
INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('notifications.enabled', 'NOTIFICATIONS', 1, 1, ' ', 'Boolean', 'false', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('notifications.query.interval', 'NOTIFICATIONS', 1, 2, ' ', 'Integer', '30', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('url.public', 'NOTIFICATIONS', 1, 3, ' ', 'String', NULL, 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('notifications.xmpp.server.hostname', 'NOTIFICATIONS', 1, 'XMPP Settings', 1, ' ', 'String', NULL, 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('notifications.xmpp.server.port', 'NOTIFICATIONS', 1, 'XMPP Settings', 2, ' ', 'Integer', '5222', 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('notifications.xmpp.room', 'NOTIFICATIONS', 1, 'XMPP Settings', 3, ' ', 'String', NULL, 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('notifications.xmpp.username', 'NOTIFICATIONS', 1, 'XMPP Settings', 4, ' ', 'String', NULL, 0);

INSERT INTO `application_configuration` (`code`, `group_name`, `mutable`, `sub_group_name`, `sub_group_order`, `title`, `type`, `value`, `version`) VALUES ('notifications.xmpp.password', 'NOTIFICATIONS', 1, 'XMPP Settings', 5, ' ', 'String', NULL, 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Insert Row (x8)', 'EXECUTED', 'changelog_7.10.0.groovy', '7.10.0-2', '2.0.1', '3:41ac759cfb732888d39c704edd1aa12d', 2);

-- Release Database Lock
-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 5/23/14 10:35 AM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.15.1.groovy::7.15.1-1::owf::(Checksum: 3:a253a2a9c7e7571b94e59fc1767c58b3)
DELETE FROM `application_configuration`  WHERE code = 'notifications.xmpp.server.hostname';

DELETE FROM `application_configuration`  WHERE code = 'notifications.xmpp.server.port';

DELETE FROM `application_configuration`  WHERE code = 'notifications.xmpp.room';

DELETE FROM `application_configuration`  WHERE code = 'notifications.xmpp.username';

DELETE FROM `application_configuration`  WHERE code = 'notifications.xmpp.password';

DELETE FROM `application_configuration`  WHERE code = 'notifications.enabled';

DELETE FROM `application_configuration`  WHERE code = 'notifications.query.interval';

DELETE FROM `application_configuration`  WHERE code = 'url.public';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Delete Data (x8)', 'EXECUTED', 'changelog_7.15.1.groovy', '7.15.1-1', '2.0.1', '3:a253a2a9c7e7571b94e59fc1767c58b3', 1);

-- Changeset changelog_7.15.1.groovy::7.15.1-2::owf::(Checksum: 3:1234ac8c0f21a1d748e17510d1c4373c)
ALTER TABLE `widget_definition` CHANGE `image_url_large` `image_url_medium` VARCHAR(2083);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Rename Column', 'EXECUTED', 'changelog_7.15.1.groovy', '7.15.1-2', '2.0.1', '3:1234ac8c0f21a1d748e17510d1c4373c', 2);
-- Release Database Lock

-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 10/31/14 1:59 PM

-- Liquibase version: 2.0.5
-- *********************************************************************

-- Lock Database
--  Changeset changelog_7.16.0.groovy::7.16.0-1::owf::(Checksum: 3:a5550d64efe7315b58db632c964075f3)
UPDATE `application_configuration` SET `sub_group_order` = '5', `type` = 'String', `value` = '/var/log/cef' WHERE code='owf.cef.sweep.log.location' AND type <> 'String';

UPDATE `application_configuration` SET `sub_group_order` = '3', `type` = 'Boolean', `value` = 'true' WHERE code='owf.enable.cef.log.sweep' AND type <> 'Boolean';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Update Data (x2)', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-1', '2.0.5', '3:a5550d64efe7315b58db632c964075f3', 3);

--  Changeset changelog_7.16.0.groovy::7.16.0-2::owf::(Checksum: 3:9413ce637b7ef560903ebae7e9da84d3)
ALTER TABLE `person` ADD `requires_sync` TINYINT(1) DEFAULT 0;

UPDATE `person` SET `requires_sync` = 1;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Add Column', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-2', '2.0.5', '3:9413ce637b7ef560903ebae7e9da84d3', 4);

--  Changeset changelog_7.16.0.groovy::7.16.0-3::owf::(Checksum: 3:7727672cc83b77a203682f2ed0f7e403)
ALTER TABLE `stack` ADD `default_group_id` BIGINT;

ALTER TABLE `stack` ADD CONSTRAINT `FK68AC28835014F5F` FOREIGN KEY (`default_group_id`) REFERENCES `owf_group` (`id`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Add Column, Add Foreign Key Constraint', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-3', '2.0.5', '3:7727672cc83b77a203682f2ed0f7e403', 5);

--  Changeset changelog_7.16.0.groovy::7.16.0-5::owf::(Checksum: 3:2004c0339ed2540d43b4185bfdd594fa)
CREATE INDEX `domain_mapping_all` ON `domain_mapping`(`src_id`, `src_type`, `relationship_type`, `dest_id`, `dest_type`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Create Index', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-5', '2.0.5', '3:2004c0339ed2540d43b4185bfdd594fa', 6);

--  Changeset changelog_7.16.0.groovy::7.16.0-6::owf::(Checksum: 3:1a84a71cf6605cd2706216801b85e477)
ALTER TABLE `widget_definition` ADD `mobile_ready` TINYINT(1) NOT NULL DEFAULT 0;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Add Column', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-6', '2.0.5', '3:1a84a71cf6605cd2706216801b85e477', 7);

--  Release Database Lock
