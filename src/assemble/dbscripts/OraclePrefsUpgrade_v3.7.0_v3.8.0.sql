-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 12/16/11 7:33 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Create Database Lock Table
CREATE TABLE DATABASECHANGELOGLOCK (ID INTEGER NOT NULL, LOCKED NUMBER(1) NOT NULL, LOCKGRANTED TIMESTAMP, LOCKEDBY VARCHAR2(255), CONSTRAINT PK_DATABASECHANGELOGLOCK PRIMARY KEY (ID));

INSERT INTO DATABASECHANGELOGLOCK (ID, LOCKED) VALUES (1, 0);

-- Lock Database
-- Create Database Change Log Table
CREATE TABLE DATABASECHANGELOG (ID VARCHAR2(63) NOT NULL, AUTHOR VARCHAR2(63) NOT NULL, FILENAME VARCHAR2(200) NOT NULL, DATEEXECUTED TIMESTAMP NOT NULL, ORDEREXECUTED INTEGER NOT NULL, EXECTYPE VARCHAR2(10) NOT NULL, MD5SUM VARCHAR2(35), DESCRIPTION VARCHAR2(255), COMMENTS VARCHAR2(255), TAG VARCHAR2(255), LIQUIBASE VARCHAR2(20), CONSTRAINT PK_DATABASECHANGELOG PRIMARY KEY (ID, AUTHOR, FILENAME));

-- Changeset changelog_3.8.0.groovy::3.8.0-1::owf::(Checksum: 3:d66582e573cee33f424ebb952decd92d)
ALTER TABLE dashboard MODIFY user_id NULL;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-1', '2.0.1', '3:d66582e573cee33f424ebb952decd92d', 1);

-- Changeset changelog_3.8.0.groovy::3.8.0-2::owf::(Checksum: 3:43600e1eebd0b612def9a76758daa403)
-- Added description column into Dashboard Table
ALTER TABLE dashboard ADD description VARCHAR2(255);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Added description column into Dashboard Table', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-2', '2.0.1', '3:43600e1eebd0b612def9a76758daa403', 2);

-- Changeset changelog_3.8.0.groovy::3.8.0-3::owf::(Checksum: 3:cd0a0df59ba7079055230181279b9fe5)
ALTER TABLE dashboard ADD created_by_id NUMBER(38,0);

ALTER TABLE dashboard ADD created_date TIMESTAMP;

ALTER TABLE dashboard ADD edited_by_id NUMBER(38,0);

ALTER TABLE dashboard ADD edited_date TIMESTAMP;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-3', '2.0.1', '3:cd0a0df59ba7079055230181279b9fe5', 3);

-- Changeset changelog_3.8.0.groovy::3.8.0-4::owf::(Checksum: 3:b98ec98220fc4669acb11cc65cba959b)
ALTER TABLE dashboard ADD CONSTRAINT FKC18AEA94372CC5A FOREIGN KEY (created_by_id) REFERENCES person (id);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-4', '2.0.1', '3:b98ec98220fc4669acb11cc65cba959b', 4);

-- Changeset changelog_3.8.0.groovy::3.8.0-5::owf::(Checksum: 3:30cd6eb8e32c5bb622cd48a6730e86e1)
ALTER TABLE dashboard ADD CONSTRAINT FKC18AEA947028B8DB FOREIGN KEY (edited_by_id) REFERENCES person (id);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-5', '2.0.1', '3:30cd6eb8e32c5bb622cd48a6730e86e1', 5);

-- Changeset changelog_3.8.0.groovy::3.8.0-6::owf::(Checksum: 3:8fac943f557a7e4ac7b1573904347daf)
CREATE TABLE metric (id NUMBER(38,0) NOT NULL, version NUMBER(38,0) NOT NULL, component VARCHAR2(200) NOT NULL, component_id VARCHAR2(255) NOT NULL, instance_id VARCHAR2(255) NOT NULL, metric_time VARCHAR2(255) NOT NULL, metric_type_id VARCHAR2(255) NOT NULL, site VARCHAR2(255) NOT NULL, user_agent VARCHAR2(255) NOT NULL, user_name VARCHAR2(255) NOT NULL, widget_data VARCHAR2(255), CONSTRAINT metricPK PRIMARY KEY (id));

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Create Table', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-6', '2.0.1', '3:8fac943f557a7e4ac7b1573904347daf', 6);

-- Changeset changelog_3.8.0.groovy::3.8.0-7::owf::(Checksum: 3:4163f7334862d1ae47e0a16041fcc73b)
-- Updating Admin Widget Icons and Names
UPDATE widget_definition SET display_name = 'User Manager', image_url_large = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', image_url_small = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png' WHERE widget_url='admin/UserManagement.gsp';

UPDATE widget_definition SET display_name = 'User Editor', image_url_large = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', image_url_small = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', visible = 0 WHERE widget_url='admin/UserEdit.gsp';

UPDATE widget_definition SET display_name = 'Widget Manager', image_url_large = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', image_url_small = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png' WHERE widget_url='admin/WidgetManagement.gsp';

UPDATE widget_definition SET display_name = 'Widget Editor', image_url_large = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', image_url_small = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', visible = 0 WHERE widget_url='admin/WidgetEdit.gsp';

UPDATE widget_definition SET display_name = 'Group Manager', image_url_large = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', image_url_small = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png' WHERE widget_url='admin/GroupManagement.gsp';

UPDATE widget_definition SET display_name = 'Group Editor', image_url_large = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', image_url_small = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', visible = 0 WHERE widget_url='admin/GroupEdit.gsp';

UPDATE widget_definition SET display_name = 'Group Dashboard Manager', image_url_large = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', image_url_small = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png' WHERE widget_url='admin/GroupDashboardManagement.gsp';

UPDATE widget_definition SET display_name = 'Dashboard Editor', image_url_large = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', image_url_small = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', visible = 0 WHERE widget_url='admin/DashboardEdit.gsp';

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Updating Admin Widget Icons and Names', SYSTIMESTAMP, 'Update Data (x8)', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-7', '2.0.1', '3:4163f7334862d1ae47e0a16041fcc73b', 7);

-- Changeset changelog_3.8.0.groovy::3.8.0-9::owf::(Checksum: 3:c663eb75620ae74e0f7ca517d8bd4c1b)
ALTER TABLE widget_definition MODIFY widget_version NULL;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-9', '2.0.1', '3:c663eb75620ae74e0f7ca517d8bd4c1b', 8);

