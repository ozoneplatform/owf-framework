--  *********************************************************************
--  Update Database Script
--  *********************************************************************
--  Change Log: changelog.groovy
--  Ran at: 8/13/15 2:00 PM
--  Against: owf_admin@localhost@jdbc:mysql://localhost:3306/owf
--  Liquibase version: 2.0.5
--  *********************************************************************

--  Lock Database
--  Changeset changelog_7.16.1.groovy::7.16.1-1::owf::(Checksum: 3:ae067414a3c058b53045e311d46646cc)
INSERT INTO `role` (`authority`, `description`, `id`, `version`) VALUES ('ROLE_USER', 'User Role', '26', '2');

INSERT INTO `role` (`authority`, `description`, `id`, `version`) VALUES ('ROLE_ADMIN', 'Admin Role', '27', '1');

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_7.16.1.groovy', '7.16.1-1', '2.0.5', '3:ae067414a3c058b53045e311d46646cc', 1);

--  Release Database Lock
