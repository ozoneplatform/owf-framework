-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 6/19/12 4:27 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_5.0.0.groovy::5.0.0-1::owf::(Checksum: 3:42d9c4bdcdff38a4fbe40bd1ec78d9b1)
-- Add display name to group
ALTER TABLE `owf_group` ADD `display_name` VARCHAR(200);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add display name to group', NOW(), 'Add Column', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-1', '2.0.1', '3:42d9c4bdcdff38a4fbe40bd1ec78d9b1', 1);

-- Changeset changelog_5.0.0.groovy::5.0.0-3::owf::(Checksum: 3:aa2aca168ad6eaeea8509fd642d8c17b)
-- Add metric widget types to table
INSERT INTO `widget_type` (`id`, `name`, `version`) VALUES (4, 'metric', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add metric widget types to table', NOW(), 'Insert Row', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-3', '2.0.1', '3:aa2aca168ad6eaeea8509fd642d8c17b', 2);

-- Changeset changelog_5.0.0.groovy::5.0.0-5::owf::(Checksum: 3:a3a4f6fe76ad042b42e27bdf7b09d277)
-- Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.
UPDATE `owf_group` SET `automatic` = 1, `name` = 'OWF Users' WHERE name='All Users' AND automatic=0;

UPDATE `owf_group` SET `automatic` = 1, `name` = 'OWF Administrators' WHERE name='OWF Admins' AND automatic=0;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.', NOW(), 'Update Data (x2)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-5', '2.0.1', '3:a3a4f6fe76ad042b42e27bdf7b09d277', 3);

-- Changeset changelog_5.0.0.groovy::5.0.0-6::owf::(Checksum: 3:96aa216a330817681aca38dc66d1129b)
-- Set default value for display_name
UPDATE owf_group
			SET display_name = name
			WHERE display_name IS NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Set default value for display_name', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-6', '2.0.1', '3:96aa216a330817681aca38dc66d1129b', 4);

-- Release Database Lock
