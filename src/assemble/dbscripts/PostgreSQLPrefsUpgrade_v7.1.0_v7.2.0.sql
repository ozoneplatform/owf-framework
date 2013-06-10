-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 6/10/13 4:12 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.2.0.groovy::7.2.0-1::owf::(Checksum: 3:69c7062f6bb536836805960380dfdb90)
-- Add fullscreen widget types to table
INSERT INTO widget_type (id, name, version) VALUES (5, 'fullscreen', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add fullscreen widget types to table', NOW(), 'Insert Row', 'EXECUTED', 'changelog_7.2.0.groovy', '7.2.0-1', '2.0.1', '3:69c7062f6bb536836805960380dfdb90', 1);

-- Release Database Lock
