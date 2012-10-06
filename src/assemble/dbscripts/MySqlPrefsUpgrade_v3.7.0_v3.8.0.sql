-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 12/16/11 7:28 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Create Database Lock Table
CREATE TABLE `DATABASECHANGELOGLOCK` (`ID` INT NOT NULL, `LOCKED` TINYINT(1) NOT NULL, `LOCKGRANTED` DATETIME, `LOCKEDBY` VARCHAR(255), CONSTRAINT `PK_DATABASECHANGELOGLOCK` PRIMARY KEY (`ID`)) ENGINE=InnoDB;

INSERT INTO `DATABASECHANGELOGLOCK` (`ID`, `LOCKED`) VALUES (1, 0);

-- Lock Database
-- Create Database Change Log Table
CREATE TABLE `DATABASECHANGELOG` (`ID` VARCHAR(63) NOT NULL, `AUTHOR` VARCHAR(63) NOT NULL, `FILENAME` VARCHAR(200) NOT NULL, `DATEEXECUTED` DATETIME NOT NULL, `ORDEREXECUTED` INT NOT NULL, `EXECTYPE` VARCHAR(10) NOT NULL, `MD5SUM` VARCHAR(35), `DESCRIPTION` VARCHAR(255), `COMMENTS` VARCHAR(255), `TAG` VARCHAR(255), `LIQUIBASE` VARCHAR(20), CONSTRAINT `PK_DATABASECHANGELOG` PRIMARY KEY (`ID`, `AUTHOR`, `FILENAME`)) ENGINE=InnoDB;

-- Changeset changelog_3.8.0.groovy::3.8.0-1::owf::(Checksum: 3:e3e4161aea2784490b697128b6c83920)
ALTER TABLE `dashboard` MODIFY `user_id` BIGINT NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-1', '2.0.1', '3:e3e4161aea2784490b697128b6c83920', 1);

-- Changeset changelog_3.8.0.groovy::3.8.0-2::owf::(Checksum: 3:43600e1eebd0b612def9a76758daa403)
-- Added description column into Dashboard Table
ALTER TABLE `dashboard` ADD `description` VARCHAR(255);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Added description column into Dashboard Table', NOW(), 'Add Column', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-2', '2.0.1', '3:43600e1eebd0b612def9a76758daa403', 2);

-- Changeset changelog_3.8.0.groovy::3.8.0-3::owf::(Checksum: 3:cd0a0df59ba7079055230181279b9fe5)
ALTER TABLE `dashboard` ADD `created_by_id` BIGINT;

ALTER TABLE `dashboard` ADD `created_date` DATETIME;

ALTER TABLE `dashboard` ADD `edited_by_id` BIGINT;

ALTER TABLE `dashboard` ADD `edited_date` DATETIME;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Add Column', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-3', '2.0.1', '3:cd0a0df59ba7079055230181279b9fe5', 3);

-- Changeset changelog_3.8.0.groovy::3.8.0-4::owf::(Checksum: 3:b98ec98220fc4669acb11cc65cba959b)
ALTER TABLE `dashboard` ADD CONSTRAINT `FKC18AEA94372CC5A` FOREIGN KEY (`created_by_id`) REFERENCES `person` (`id`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-4', '2.0.1', '3:b98ec98220fc4669acb11cc65cba959b', 4);

-- Changeset changelog_3.8.0.groovy::3.8.0-5::owf::(Checksum: 3:30cd6eb8e32c5bb622cd48a6730e86e1)
ALTER TABLE `dashboard` ADD CONSTRAINT `FKC18AEA947028B8DB` FOREIGN KEY (`edited_by_id`) REFERENCES `person` (`id`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-5', '2.0.1', '3:30cd6eb8e32c5bb622cd48a6730e86e1', 5);

-- Changeset changelog_3.8.0.groovy::3.8.0-6::owf::(Checksum: 3:8fac943f557a7e4ac7b1573904347daf)
CREATE TABLE `metric` (`id` BIGINT AUTO_INCREMENT  NOT NULL, `version` BIGINT NOT NULL, `component` VARCHAR(200) NOT NULL, `component_id` VARCHAR(255) NOT NULL, `instance_id` VARCHAR(255) NOT NULL, `metric_time` VARCHAR(255) NOT NULL, `metric_type_id` VARCHAR(255) NOT NULL, `site` VARCHAR(255) NOT NULL, `user_agent` VARCHAR(255) NOT NULL, `user_name` VARCHAR(255) NOT NULL, `widget_data` VARCHAR(255), CONSTRAINT `metricPK` PRIMARY KEY (`id`)) ENGINE=InnoDB;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Create Table', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-6', '2.0.1', '3:8fac943f557a7e4ac7b1573904347daf', 6);

-- Changeset changelog_3.8.0.groovy::3.8.0-7::owf::(Checksum: 3:4163f7334862d1ae47e0a16041fcc73b)
-- Updating Admin Widget Icons and Names
UPDATE `widget_definition` SET `display_name` = 'User Manager', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png' WHERE widget_url='admin/UserManagement.gsp';

UPDATE `widget_definition` SET `display_name` = 'User Editor', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', `visible` = 0 WHERE widget_url='admin/UserEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Widget Manager', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png' WHERE widget_url='admin/WidgetManagement.gsp';

UPDATE `widget_definition` SET `display_name` = 'Widget Editor', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', `visible` = 0 WHERE widget_url='admin/WidgetEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Group Manager', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png' WHERE widget_url='admin/GroupManagement.gsp';

UPDATE `widget_definition` SET `display_name` = 'Group Editor', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', `visible` = 0 WHERE widget_url='admin/GroupEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Group Dashboard Manager', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png' WHERE widget_url='admin/GroupDashboardManagement.gsp';

UPDATE `widget_definition` SET `display_name` = 'Dashboard Editor', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', `visible` = 0 WHERE widget_url='admin/DashboardEdit.gsp';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Updating Admin Widget Icons and Names', NOW(), 'Update Data (x8)', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-7', '2.0.1', '3:4163f7334862d1ae47e0a16041fcc73b', 7);

-- Changeset changelog_3.8.0.groovy::3.8.0-9::owf::(Checksum: 3:b8bfb871d46a61e853fbe3c16f5f3941)
ALTER TABLE `widget_definition` MODIFY `widget_version` VARCHAR(2083) NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-9', '2.0.1', '3:b8bfb871d46a61e853fbe3c16f5f3941', 8);

