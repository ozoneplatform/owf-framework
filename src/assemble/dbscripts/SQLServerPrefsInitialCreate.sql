-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 6/10/13 4:06 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Create Database Lock Table
CREATE TABLE [dbo].[DATABASECHANGELOGLOCK] ([ID] INT NOT NULL, [LOCKED] BIT NOT NULL, [LOCKGRANTED] DATETIME, [LOCKEDBY] VARCHAR(255), CONSTRAINT [PK_DATABASECHANGELOGLOCK] PRIMARY KEY ([ID]))
GO

INSERT INTO [dbo].[DATABASECHANGELOGLOCK] ([ID], [LOCKED]) VALUES (1, 0)
GO

-- Lock Database
-- Create Database Change Log Table
CREATE TABLE [dbo].[DATABASECHANGELOG] ([ID] VARCHAR(63) NOT NULL, [AUTHOR] VARCHAR(63) NOT NULL, [FILENAME] VARCHAR(200) NOT NULL, [DATEEXECUTED] DATETIME NOT NULL, [ORDEREXECUTED] INT NOT NULL, [EXECTYPE] VARCHAR(10) NOT NULL, [MD5SUM] VARCHAR(35), [DESCRIPTION] VARCHAR(255), [COMMENTS] VARCHAR(255), [TAG] VARCHAR(255), [LIQUIBASE] VARCHAR(20), CONSTRAINT [PK_DATABASECHANGELOG] PRIMARY KEY ([ID], [AUTHOR], [FILENAME]))
GO

-- Changeset changelog_3.7.0.groovy::3.7.0-1::owf::(Checksum: 3:8069d086b271c623deccf830572ae58b)
create table dashboard (id numeric(19,0) identity not null, version numeric(19,0) not null, isdefault tinyint not null, dashboard_position int not null, altered_by_admin tinyint not null, guid nvarchar(255) not null unique, column_count int not null, layout nvarchar(9) not null, name nvarchar(200) not null, user_id numeric(19,0) not null, primary key (id))
GO

create table dashboard_widget_state (id numeric(19,0) identity not null, version numeric(19,0) not null, region nvarchar(15) not null, button_opened tinyint not null, z_index int not null, person_widget_definition_id numeric(19,0) null, minimized tinyint not null, unique_id nvarchar(255) not null unique, height int not null, pinned tinyint not null, name nvarchar(200) not null, widget_guid nvarchar(255) null, column_pos int not null, width int not null, button_id nvarchar(255) null, collapsed tinyint not null, maximized tinyint not null, state_position int not null, active tinyint not null, dashboard_id numeric(19,0) not null, y int not null, x int not null, primary key (id))
GO

create table domain_mapping (id numeric(19,0) identity not null, version numeric(19,0) not null, src_id numeric(19,0) not null, src_type nvarchar(255) not null, relationship_type nvarchar(8) null, dest_id numeric(19,0) not null, dest_type nvarchar(255) not null, primary key (id))
GO

create table eventing_connections (id numeric(19,0) identity not null, version numeric(19,0) not null, dashboard_widget_state_id numeric(19,0) not null, widget_guid nvarchar(255) not null, eventing_connections_idx int null, primary key (id))
GO

create table owf_group (id numeric(19,0) identity not null, version numeric(19,0) not null, status nvarchar(8) not null, email nvarchar(255) null, description nvarchar(255) null, name nvarchar(200) not null, automatic tinyint not null, primary key (id))
GO

create table owf_group_people (person_id numeric(19,0) not null, group_id numeric(19,0) not null, primary key (group_id, person_id))
GO

create table person (id numeric(19,0) identity not null, version numeric(19,0) not null, enabled tinyint not null, user_real_name nvarchar(200) not null, username nvarchar(200) not null unique, last_login datetime null, email_show tinyint not null, email nvarchar(255) null, prev_login datetime null, description nvarchar(255) null, primary key (id))
GO

create table person_widget_definition (id numeric(19,0) identity not null, version numeric(19,0) not null, person_id numeric(19,0) not null, visible tinyint not null, pwd_position int not null, widget_definition_id numeric(19,0) not null, primary key (id), unique (person_id, widget_definition_id))
GO

create table preference (id numeric(19,0) identity not null, version numeric(19,0) not null, value ntext not null, path nvarchar(200) not null, user_id numeric(19,0) not null, namespace nvarchar(200) not null, primary key (id), unique (path, namespace, user_id))
GO

create table requestmap (id numeric(19,0) identity not null, version numeric(19,0) not null, url nvarchar(255) not null unique, config_attribute nvarchar(255) not null, primary key (id))
GO

create table role (id numeric(19,0) identity not null, version numeric(19,0) not null, authority nvarchar(255) not null unique, description nvarchar(255) not null, primary key (id))
GO

create table role_people (person_id numeric(19,0) not null, role_id numeric(19,0) not null, primary key (role_id, person_id))
GO

create table tag_links (id numeric(19,0) identity not null, version numeric(19,0) not null, pos numeric(19,0) null, visible tinyint null, tag_ref numeric(19,0) not null, tag_id numeric(19,0) not null, type nvarchar(255) not null, editable tinyint null, primary key (id))
GO

create table tags (id numeric(19,0) identity not null, version numeric(19,0) not null, name nvarchar(255) not null unique, primary key (id))
GO

create table widget_definition (id numeric(19,0) identity not null, version numeric(19,0) not null, visible tinyint not null, image_url_large nvarchar(2083) not null, image_url_small nvarchar(2083) not null, singleton tinyint not null, width int not null, widget_version nvarchar(2083) not null, height int not null, widget_url nvarchar(2083) not null, widget_guid nvarchar(255) not null unique, display_name nvarchar(200) not null, primary key (id))
GO

alter table dashboard add constraint FKC18AEA948656347D foreign key (user_id) references person
GO

alter table dashboard_widget_state add constraint FKB6440EA192BD68BB foreign key (person_widget_definition_id) references person_widget_definition
GO

alter table dashboard_widget_state add constraint FKB6440EA1CA944B81 foreign key (dashboard_id) references dashboard
GO

alter table eventing_connections add constraint FKBCC1569EB20FFC4B foreign key (dashboard_widget_state_id) references dashboard_widget_state
GO

alter table owf_group_people add constraint FK2811370C1F5E0B3 foreign key (person_id) references person
GO

alter table owf_group_people add constraint FK28113703B197B21 foreign key (group_id) references owf_group
GO

alter table person_widget_definition add constraint FK6F5C17C4C1F5E0B3 foreign key (person_id) references person
GO

alter table person_widget_definition add constraint FK6F5C17C4293A835C foreign key (widget_definition_id) references widget_definition
GO

alter table preference add constraint FKA8FCBCDB8656347D foreign key (user_id) references person
GO

alter table role_people add constraint FK28B75E78C1F5E0B3 foreign key (person_id) references person
GO

alter table role_people add constraint FK28B75E7870B353 foreign key (role_id) references role
GO

alter table tag_links add constraint FK7C35D6D45A3B441D foreign key (tag_id) references tags
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_3.7.0.groovy', '3.7.0-1', '2.0.1', '3:8069d086b271c623deccf830572ae58b', 1)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-1::owf::(Checksum: 3:7da0aa625657bc0a79a62ee817160825)
ALTER TABLE [dbo].[dashboard] ALTER COLUMN [user_id] NUMERIC(19,0) NULL
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-1', '2.0.1', '3:7da0aa625657bc0a79a62ee817160825', 2)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-2::owf::(Checksum: 3:43600e1eebd0b612def9a76758daa403)
-- Added description column into Dashboard Table
ALTER TABLE [dbo].[dashboard] ADD [description] VARCHAR(255)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added description column into Dashboard Table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-2', '2.0.1', '3:43600e1eebd0b612def9a76758daa403', 3)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-3::owf::(Checksum: 3:43d17f3d3dc02ed1cf7e745f66731b21)
ALTER TABLE [dbo].[dashboard] ADD [created_by_id] NUMERIC(19,0)
GO

ALTER TABLE [dbo].[dashboard] ADD [created_date] DATETIME
GO

ALTER TABLE [dbo].[dashboard] ADD [edited_by_id] NUMERIC(19,0)
GO

ALTER TABLE [dbo].[dashboard] ADD [edited_date] DATETIME
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-3', '2.0.1', '3:43d17f3d3dc02ed1cf7e745f66731b21', 4)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-4::owf::(Checksum: 3:b98ec98220fc4669acb11cc65cba959b)
ALTER TABLE [dbo].[dashboard] ADD CONSTRAINT [FKC18AEA94372CC5A] FOREIGN KEY ([created_by_id]) REFERENCES [dbo].[person] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-4', '2.0.1', '3:b98ec98220fc4669acb11cc65cba959b', 5)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-5::owf::(Checksum: 3:30cd6eb8e32c5bb622cd48a6730e86e1)
ALTER TABLE [dbo].[dashboard] ADD CONSTRAINT [FKC18AEA947028B8DB] FOREIGN KEY ([edited_by_id]) REFERENCES [dbo].[person] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-5', '2.0.1', '3:30cd6eb8e32c5bb622cd48a6730e86e1', 6)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-9::owf::(Checksum: 3:725b3672472c5b7a6dfa6d7a03b37604)
ALTER TABLE [dbo].[widget_definition] ALTER COLUMN [widget_version] NVARCHAR(2083) NULL
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-9', '2.0.1', '3:725b3672472c5b7a6dfa6d7a03b37604', 7)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-3::owf::(Checksum: 3:d066b39ebec901b63dbe5b674825449d)
-- Added defaultSettings column into Dashboard Table
ALTER TABLE [dbo].[dashboard] ADD [default_settings] NVARCHAR(MAX)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added defaultSettings column into Dashboard Table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-3', '2.0.1', '3:d066b39ebec901b63dbe5b674825449d', 8)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-4::owf::(Checksum: 3:c4ccbcf8a10f33b5063af97a9d15d28c)
-- Added background column for WidgetDefinition
ALTER TABLE [dbo].[widget_definition] ADD [background] BIT
GO

UPDATE [dbo].[widget_definition] SET [background] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added background column for WidgetDefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-4', '2.0.1', '3:c4ccbcf8a10f33b5063af97a9d15d28c', 9)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-47::owf::(Checksum: 3:967a5a6cb7f1d94dfef9beb90b77e1e5)
-- Added showLaunchMenu column into Dashboard Table
ALTER TABLE [dbo].[dashboard] ADD [show_launch_menu] BIT CONSTRAINT DF_dashboard_show_launch_menu DEFAULT 0
GO

UPDATE [dbo].[dashboard] SET [show_launch_menu] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added showLaunchMenu column into Dashboard Table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-47', '2.0.1', '3:967a5a6cb7f1d94dfef9beb90b77e1e5', 10)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-49::owf::(Checksum: 3:da13badad5d1323ad20fe7dfb7f114c4)
-- Create widget type table and linking table for sql server
CREATE TABLE [dbo].[widget_type] ([id] NUMERIC(19,0) IDENTITY  NOT NULL, [version] NUMERIC(19,0) NOT NULL, [name] VARCHAR(255) NOT NULL, CONSTRAINT [widget_typePK] PRIMARY KEY ([id]))
GO

CREATE TABLE [dbo].[widget_definition_widget_types] ([widget_definition_id] NUMERIC(19,0) NOT NULL, [widget_type_id] NUMERIC(19,0) NOT NULL)
GO

ALTER TABLE [dbo].[widget_definition_widget_types] ADD PRIMARY KEY ([widget_definition_id], [widget_type_id])
GO

ALTER TABLE [dbo].[widget_definition_widget_types] ADD CONSTRAINT [FK8A59D92F293A835C] FOREIGN KEY ([widget_definition_id]) REFERENCES [dbo].[widget_definition] ([id])
GO

ALTER TABLE [dbo].[widget_definition_widget_types] ADD CONSTRAINT [FK8A59D92FD46C6F7C] FOREIGN KEY ([widget_type_id]) REFERENCES [dbo].[widget_type] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create widget type table and linking table for sql server', GETDATE(), 'Create Table (x2), Add Primary Key, Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-49', '2.0.1', '3:da13badad5d1323ad20fe7dfb7f114c4', 11)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-50::owf::(Checksum: 3:dcdf0a7bee837a0c5f886c33398947b5)
-- allow identity inserts
SET IDENTITY_INSERT [dbo].[widget_type] ON
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'allow identity inserts', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-50', '2.0.1', '3:dcdf0a7bee837a0c5f886c33398947b5', 12)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-51::owf::(Checksum: 3:dc8cf89d14b68c19d487908ef28c89b1)
-- Add widget types to table
INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (1, 'standard', 0)
GO

INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (2, 'administration', 0)
GO

INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (3, 'marketplace', 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add widget types to table', GETDATE(), 'Insert Row (x3)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-51', '2.0.1', '3:dc8cf89d14b68c19d487908ef28c89b1', 13)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-52::owf::(Checksum: 3:75c71045d9719cb66de6a92836d0ee60)
-- allow identity inserts
SET IDENTITY_INSERT [dbo].[widget_type] OFF
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'allow identity inserts', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-52', '2.0.1', '3:75c71045d9719cb66de6a92836d0ee60', 14)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-56::owf::(Checksum: 3:7e4d6568d91e79149f8b895501eb8579)
-- Updating display_name column to 256 chars
ALTER TABLE [dbo].[widget_definition] ALTER COLUMN [display_name] VARCHAR(256)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Updating display_name column to 256 chars', GETDATE(), 'Modify data type', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-56', '2.0.1', '3:7e4d6568d91e79149f8b895501eb8579', 15)
GO

-- Changeset changelog_5.0.0.groovy::5.0.0-1::owf::(Checksum: 3:42d9c4bdcdff38a4fbe40bd1ec78d9b1)
-- Add display name to group
ALTER TABLE [dbo].[owf_group] ADD [display_name] VARCHAR(200)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add display name to group', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-1', '2.0.1', '3:42d9c4bdcdff38a4fbe40bd1ec78d9b1', 16)
GO

-- Changeset changelog_5.0.0.groovy::5.0.0-2::owf::(Checksum: 3:dcdf0a7bee837a0c5f886c33398947b5)
-- allow identity inserts
SET IDENTITY_INSERT [dbo].[widget_type] ON
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'allow identity inserts', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-2', '2.0.1', '3:dcdf0a7bee837a0c5f886c33398947b5', 17)
GO

-- Changeset changelog_5.0.0.groovy::5.0.0-3::owf::(Checksum: 3:aa2aca168ad6eaeea8509fd642d8c17b)
-- Add metric widget types to table
INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (4, 'metric', 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add metric widget types to table', GETDATE(), 'Insert Row', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-3', '2.0.1', '3:aa2aca168ad6eaeea8509fd642d8c17b', 18)
GO

-- Changeset changelog_5.0.0.groovy::5.0.0-4::owf::(Checksum: 3:75c71045d9719cb66de6a92836d0ee60)
-- allow identity inserts
SET IDENTITY_INSERT [dbo].[widget_type] OFF
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'allow identity inserts', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-4', '2.0.1', '3:75c71045d9719cb66de6a92836d0ee60', 19)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-1::owf::(Checksum: 3:b7a17650e4cfde415fdbbcc4f2bd1317)
-- Add universal_name to widgetdefinition
ALTER TABLE [dbo].[widget_definition] ADD [universal_name] VARCHAR(255)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add universal_name to widgetdefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-1', '2.0.1', '3:b7a17650e4cfde415fdbbcc4f2bd1317', 20)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-2::owf::(Checksum: 3:30ea4354058c7a09bfafb6acabfd1e33)
-- Add layoutConfig to dashboard
ALTER TABLE [dbo].[dashboard] ADD [layout_config] NVARCHAR(MAX)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add layoutConfig to dashboard', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-2', '2.0.1', '3:30ea4354058c7a09bfafb6acabfd1e33', 21)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-3::owf::(Checksum: 3:6ce1db42048bc63ece1be0c3f4669a52)
-- Add descriptor_url to widgetdefinition
ALTER TABLE [dbo].[widget_definition] ADD [descriptor_url] VARCHAR(2083)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add descriptor_url to widgetdefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-3', '2.0.1', '3:6ce1db42048bc63ece1be0c3f4669a52', 22)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-4::owf::(Checksum: 3:4e940a0bdfea36b98c62330e4b373dd3)
-- Remove EventingConnections table and association with DashboardWidgetState
DROP TABLE [dbo].[eventing_connections]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove EventingConnections table and association with DashboardWidgetState', GETDATE(), 'Drop Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-4', '2.0.1', '3:4e940a0bdfea36b98c62330e4b373dd3', 23)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-5::owf::(Checksum: 3:2c40b74eb7eb29a286ac641320a97b4d)
-- Create intent table
CREATE TABLE [dbo].[intent] ([id] BIGINT IDENTITY  NOT NULL, [version] BIGINT NOT NULL, [action] VARCHAR(255) NOT NULL, CONSTRAINT [intentPK] PRIMARY KEY ([id]), UNIQUE ([action]))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create intent table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-5', '2.0.1', '3:2c40b74eb7eb29a286ac641320a97b4d', 24)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-6::owf::(Checksum: 3:008f636cf428abbd60459975d28e62a1)
-- Create intent_data_type table
CREATE TABLE [dbo].[intent_data_type] ([id] BIGINT IDENTITY  NOT NULL, [version] BIGINT NOT NULL, [data_type] VARCHAR(255) NOT NULL, CONSTRAINT [intent_data_typePK] PRIMARY KEY ([id]))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create intent_data_type table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-6', '2.0.1', '3:008f636cf428abbd60459975d28e62a1', 25)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-7::owf::(Checksum: 3:b462f738ef9c30634a0a47d245d16a59)
-- Create intent_data_types table
CREATE TABLE [dbo].[intent_data_types] ([intent_data_type_id] BIGINT NOT NULL, [intent_id] BIGINT NOT NULL)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create intent_data_types table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-7', '2.0.1', '3:b462f738ef9c30634a0a47d245d16a59', 26)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-8::owf::(Checksum: 3:ee497899a41d5cc2798af5cfc277aecb)
-- Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table
ALTER TABLE [dbo].[intent_data_types] ADD CONSTRAINT [FK8A59132FD46C6FAA] FOREIGN KEY ([intent_data_type_id]) REFERENCES [dbo].[intent_data_type] ([id])
GO

ALTER TABLE [dbo].[intent_data_types] ADD CONSTRAINT [FK8A59D92FD46C6FAA] FOREIGN KEY ([intent_id]) REFERENCES [dbo].[intent] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table', GETDATE(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-8', '2.0.1', '3:ee497899a41d5cc2798af5cfc277aecb', 27)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-9::owf::(Checksum: 3:a373d6042ff2a6856d2f5c00522909b1)
-- Create widget_def_intent table
create table widget_def_intent (id bigint identity not null, version bigint not null, receive bit not null, 
                send bit not null, intent_id bigint not null, widget_definition_id numeric(19,0) not null, primary key (id))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create widget_def_intent table', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-9', '2.0.1', '3:a373d6042ff2a6856d2f5c00522909b1', 28)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-10::owf::(Checksum: 3:e5d364edc24ace7b9b89d3854bb70408)
-- Add foreign constraint for widget_definition_id in widget_def_intent table
ALTER TABLE [dbo].[widget_def_intent] ADD CONSTRAINT [FK8A59D92FD46C6FAB] FOREIGN KEY ([widget_definition_id]) REFERENCES [dbo].[widget_definition] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign constraint for widget_definition_id in widget_def_intent table', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-10', '2.0.1', '3:e5d364edc24ace7b9b89d3854bb70408', 29)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-11::owf::(Checksum: 3:fcf69ebd060340afd1483c2f4588f456)
-- Add foreign constraint for intent_id in widget_definition_intent table
ALTER TABLE [dbo].[widget_def_intent] ADD CONSTRAINT [FK8A59D92FD46C6FAC] FOREIGN KEY ([intent_id]) REFERENCES [dbo].[intent] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign constraint for intent_id in widget_definition_intent table', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-11', '2.0.1', '3:fcf69ebd060340afd1483c2f4588f456', 30)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-12::owf::(Checksum: 3:05c50cdf2e21818c6986e5ef2d8c9f50)
-- Create widget_def_intent_data_types table
CREATE TABLE [dbo].[widget_def_intent_data_types] ([intent_data_type_id] BIGINT NOT NULL, [widget_definition_intent_id] BIGINT NOT NULL)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create widget_def_intent_data_types table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-12', '2.0.1', '3:05c50cdf2e21818c6986e5ef2d8c9f50', 31)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-13::owf::(Checksum: 3:3250f92e3b85fec3db493d11b53445e2)
-- Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table
ALTER TABLE [dbo].[widget_def_intent_data_types] ADD CONSTRAINT [FK8A59D92FD41A6FAD] FOREIGN KEY ([intent_data_type_id]) REFERENCES [dbo].[intent_data_type] ([id])
GO

ALTER TABLE [dbo].[widget_def_intent_data_types] ADD CONSTRAINT [FK8A59D92FD46C6FAD] FOREIGN KEY ([widget_definition_intent_id]) REFERENCES [dbo].[widget_def_intent] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table', GETDATE(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-13', '2.0.1', '3:3250f92e3b85fec3db493d11b53445e2', 32)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-14::owf::(Checksum: 3:897a5aa2802104b8f90bcde737c47002)
-- Add intentConfig column to dashboard table
ALTER TABLE [dbo].[dashboard] ADD [intent_config] NVARCHAR(MAX)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add intentConfig column to dashboard table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-14', '2.0.1', '3:897a5aa2802104b8f90bcde737c47002', 33)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-15::owf::(Checksum: 3:a58c7f9ab7dcc8c733d3a16c25adc558)
-- Added description column into Widget Definition table
ALTER TABLE [dbo].[widget_definition] ADD [description] VARCHAR(255) CONSTRAINT DF_widget_definition_description DEFAULT ''
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added description column into Widget Definition table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-15', '2.0.1', '3:a58c7f9ab7dcc8c733d3a16c25adc558', 34)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-16::owf::(Checksum: 3:9624d22cdbed36b5bbce5da92bdb1bfc)
-- Add groupWidget property to personwidgetdefinition
ALTER TABLE [dbo].[person_widget_definition] ADD [group_widget] BIT CONSTRAINT DF_person_widget_definition_group_widget DEFAULT 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add groupWidget property to personwidgetdefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-16', '2.0.1', '3:9624d22cdbed36b5bbce5da92bdb1bfc', 35)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-17::owf::(Checksum: 3:92a97333d2f7b5f17e0a541712847a54)
-- Add favorite property to personwidgetdefinition
ALTER TABLE [dbo].[person_widget_definition] ADD [favorite] BIT CONSTRAINT DF_person_widget_definition_favorite DEFAULT 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add favorite property to personwidgetdefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-17', '2.0.1', '3:92a97333d2f7b5f17e0a541712847a54', 36)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-44::owf::(Checksum: 3:a0a7528d5494cd0f02b38b3f99b2cfe4)
ALTER TABLE [dbo].[dashboard] ALTER COLUMN [layout] VARCHAR(9) NULL
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-44', '2.0.1', '3:a0a7528d5494cd0f02b38b3f99b2cfe4', 37)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-53::owf::(Checksum: 3:9f398a44008d12aee688e347940b7adf)
-- Add locked property to dashboard
ALTER TABLE [dbo].[dashboard] ADD [locked] BIT CONSTRAINT DF_dashboard_locked DEFAULT 0
GO

UPDATE [dbo].[dashboard] SET [locked] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add locked property to dashboard', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-53', '2.0.1', '3:9f398a44008d12aee688e347940b7adf', 38)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-55::owf::(Checksum: 3:2aa790687f711ca1d930c1aa24fadd0c)
-- Add display name field to pwd
ALTER TABLE [dbo].[person_widget_definition] ADD [display_name] VARCHAR(256)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add display name field to pwd', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-55', '2.0.1', '3:2aa790687f711ca1d930c1aa24fadd0c', 39)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-56::owf::(Checksum: 3:ca86586d796b6e61467c6fc7cb0a787c)
-- Add disabled field to pwd
ALTER TABLE [dbo].[person_widget_definition] ADD [disabled] BIT CONSTRAINT DF_person_widget_definition_disabled DEFAULT 0
GO

UPDATE [dbo].[person_widget_definition] SET [disabled] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add disabled field to pwd', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-56', '2.0.1', '3:ca86586d796b6e61467c6fc7cb0a787c', 40)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-1::owf::(Checksum: 3:9c64b0b8b8cb507555f0c02c00cb382b)
-- Expand a widget definition's description field to 4000 to match Marketplace
ALTER TABLE [dbo].[widget_definition] ALTER COLUMN [description] VARCHAR(4000)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Expand a widget definition''s description field to 4000 to match Marketplace', GETDATE(), 'Modify data type', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-1', '2.0.1', '3:9c64b0b8b8cb507555f0c02c00cb382b', 41)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-2::owf::(Checksum: 3:d1ab9c56671573cf7cde5a4e7c13652c)
-- Remove DashboardWidgetState since it is no longer used.
DROP TABLE [dbo].[dashboard_widget_state]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove DashboardWidgetState since it is no longer used.', GETDATE(), 'Drop Table', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-2', '2.0.1', '3:d1ab9c56671573cf7cde5a4e7c13652c', 42)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-3::owf::(Checksum: 3:4fa1c719a7a3b5c7e457240ad8dec60c)
-- Remove show_launch_menu since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP CONSTRAINT DF_dashboard_show_launch_menu
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove show_launch_menu since it is no longer used.', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-3', '2.0.1', '3:4fa1c719a7a3b5c7e457240ad8dec60c', 43)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-4::owf::(Checksum: 3:21b5b103a5b9e7134b2bbb0a7686e3cf)
-- Remove show_launch_menu since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [show_launch_menu]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove show_launch_menu since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-4', '2.0.1', '3:21b5b103a5b9e7134b2bbb0a7686e3cf', 44)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-5::owf::(Checksum: 3:634c7ed646b89e253102d12b6818c245)
-- Remove layout since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [layout]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove layout since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-5', '2.0.1', '3:634c7ed646b89e253102d12b6818c245', 45)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-6::owf::(Checksum: 3:ef21c5e1a70b81160e2ed6989fc1afa6)
-- Remove intent_config since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [intent_config]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove intent_config since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-6', '2.0.1', '3:ef21c5e1a70b81160e2ed6989fc1afa6', 46)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-7::owf::(Checksum: 3:9ee1cd65b85caaca3178939bac1e0fcf)
-- Remove default_settings since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [default_settings]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove default_settings since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-7', '2.0.1', '3:9ee1cd65b85caaca3178939bac1e0fcf', 47)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-8::owf::(Checksum: 3:ef688a16b0055a8024a489393bcfc987)
-- Remove column_count since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [column_count]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove column_count since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-8', '2.0.1', '3:ef688a16b0055a8024a489393bcfc987', 48)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-9::owf::(Checksum: 3:43e9c996af93d8cface8845446b8a525)
-- Create stack table
CREATE TABLE [dbo].[stack] ([id] BIGINT IDENTITY  NOT NULL, [version] BIGINT NOT NULL, [name] VARCHAR(256) NOT NULL, [description] VARCHAR(4000), [stack_context] VARCHAR(200) NOT NULL, [image_url] VARCHAR(2083), [descriptor_url] VARCHAR(2083), CONSTRAINT [stackPK] PRIMARY KEY ([id]), UNIQUE ([stack_context]))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create stack table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-9', '2.0.1', '3:43e9c996af93d8cface8845446b8a525', 49)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-11::owf::(Checksum: 3:26603e120cea879f6b2e1010a1b10a57)
create table stack_groups (group_id numeric(19,0) not null, stack_id bigint not null)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-11', '2.0.1', '3:26603e120cea879f6b2e1010a1b10a57', 50)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-12::owf::(Checksum: 3:7a64e2e16d79e54338e9ec959602447a)
-- Add primary key constraint for group_id and stack_id in stack_groups table
ALTER TABLE [dbo].[stack_groups] ADD CONSTRAINT [pk_stack_groups] PRIMARY KEY ([group_id], [stack_id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add primary key constraint for group_id and stack_id in stack_groups table', GETDATE(), 'Add Primary Key', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-12', '2.0.1', '3:7a64e2e16d79e54338e9ec959602447a', 51)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-13::owf::(Checksum: 3:0e9ce4f940d8f89b0fd983abc89ee775)
-- Add foreign key constraints for group_id and stack_id in stack_groups table
ALTER TABLE [dbo].[stack_groups] ADD CONSTRAINT [FK9584AB6B6B3A1281] FOREIGN KEY ([stack_id]) REFERENCES [dbo].[stack] ([id])
GO

ALTER TABLE [dbo].[stack_groups] ADD CONSTRAINT [FK9584AB6B3B197B21] FOREIGN KEY ([group_id]) REFERENCES [dbo].[owf_group] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign key constraints for group_id and stack_id in stack_groups table', GETDATE(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-13', '2.0.1', '3:0e9ce4f940d8f89b0fd983abc89ee775', 52)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-14::owf::(Checksum: 3:803b99533e3b4d760c15e2f1eca18e05)
-- Add stack_default field to group
ALTER TABLE [dbo].[owf_group] ADD [stack_default] BIT CONSTRAINT DF_owf_group_stack_default DEFAULT 0
GO

UPDATE [dbo].[owf_group] SET [stack_default] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add stack_default field to group', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-14', '2.0.1', '3:803b99533e3b4d760c15e2f1eca18e05', 53)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-15::owf::(Checksum: 3:76942320acfc0aa46ca2667795a3ac93)
-- Insert OWF stack
INSERT INTO [dbo].[stack] ([description], [image_url], [name], [stack_context], [version]) VALUES ('OWF Stack', 'themes/common/images/owf.png', 'OWF', 'owf', 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Insert OWF stack', GETDATE(), 'Insert Row', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-15', '2.0.1', '3:76942320acfc0aa46ca2667795a3ac93', 54)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-18::owf::(Checksum: 3:f0ee8e108606cf0faf3593499efc07bf)
-- Insert OWF stack default group
INSERT INTO [dbo].[owf_group] ([automatic], [name], [stack_default], [status], [version]) VALUES (0, 'ce86a612-c355-486e-9c9e-5252553cc58e', 1, 'active', 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Insert OWF stack default group', GETDATE(), 'Insert Row', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-18', '2.0.1', '3:f0ee8e108606cf0faf3593499efc07bf', 55)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-21::owf::(Checksum: 3:32c56c09a37ffceb75742132f42ddf73)
insert into stack_groups (stack_id, group_id) values ((select id from stack where name = 'OWF'), (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58e'))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-21', '2.0.1', '3:32c56c09a37ffceb75742132f42ddf73', 56)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-22::owf::(Checksum: 3:7146f45f54d8db1d72abb498d691cebb)
-- Add a reference to a host stack to dashboard records to track where user instances should appear
ALTER TABLE [dbo].[dashboard] ADD [stack_id] BIGINT
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add a reference to a host stack to dashboard records to track where user instances should appear', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-22', '2.0.1', '3:7146f45f54d8db1d72abb498d691cebb', 57)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-23::owf::(Checksum: 3:4d6a39028c8a5cc0a85b8b37fbf1b1fc)
-- Add foreign key constraint for stack_id in the dashboard table
ALTER TABLE [dbo].[dashboard] ADD CONSTRAINT [FKC18AEA946B3A1281] FOREIGN KEY ([stack_id]) REFERENCES [dbo].[stack] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign key constraint for stack_id in the dashboard table', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-23', '2.0.1', '3:4d6a39028c8a5cc0a85b8b37fbf1b1fc', 58)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-24::owf::(Checksum: 3:f1e6830542a856459733effeca8aaa24)
-- Add a property to track the count of unique widgets present on the dashboards of a stack
ALTER TABLE [dbo].[stack] ADD [unique_widget_count] BIGINT CONSTRAINT DF_stack_unique_widget_count DEFAULT '0'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add a property to track the count of unique widgets present on the dashboards of a stack', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-24', '2.0.1', '3:f1e6830542a856459733effeca8aaa24', 59)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-25::owf::(Checksum: 3:ac445082cf2ee5903046bef22276a996)
delete from stack_groups where stack_id = (select id from stack where name = 'OWF') and group_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58e')
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-25', '2.0.1', '3:ac445082cf2ee5903046bef22276a996', 60)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-26::owf::(Checksum: 3:74dc7504043a1f24e2d86d75a2dab571)
-- Delete OWF Stack Group
DELETE FROM [dbo].[owf_group]  WHERE name like 'ce86a612-c355-486e-9c9e-5252553cc58e'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Delete OWF Stack Group', GETDATE(), 'Delete Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-26', '2.0.1', '3:74dc7504043a1f24e2d86d75a2dab571', 61)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-27::owf::(Checksum: 3:cae136582b06f1ed04a6309814236cdc)
-- Delete OWF Stack
DELETE FROM [dbo].[stack]  WHERE name like 'OWF'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Delete OWF Stack', GETDATE(), 'Delete Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-27', '2.0.1', '3:cae136582b06f1ed04a6309814236cdc', 62)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-28::owf::(Checksum: 3:f1bf16779c9d7419bc7cc94e81687786)
-- Add user_widget field to person_widget_definition table
ALTER TABLE [dbo].[person_widget_definition] ADD [user_widget] BIT CONSTRAINT DF_person_widget_definition_user_widget DEFAULT 0
GO

UPDATE [dbo].[person_widget_definition] SET [user_widget] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add user_widget field to person_widget_definition table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-28', '2.0.1', '3:f1bf16779c9d7419bc7cc94e81687786', 63)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-53::owf::(Checksum: 3:95913c657b14ecdbb8c9f85fc0a071b1)
-- Expand a dashboard's description field to 4000 to match Marketplace
ALTER TABLE [dbo].[dashboard] ALTER COLUMN [description] VARCHAR(4000)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Expand a dashboard''s description field to 4000 to match Marketplace', GETDATE(), 'Modify data type', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-53', '2.0.1', '3:95913c657b14ecdbb8c9f85fc0a071b1', 64)
GO

-- Changeset changelog_7.2.0.groovy::7.2.0-1::owf::(Checksum: 3:69c7062f6bb536836805960380dfdb90)
-- Add fullscreen widget types to table
INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (5, 'fullscreen', 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add fullscreen widget types to table', GETDATE(), 'Insert Row', 'EXECUTED', 'changelog_7.2.0.groovy', '7.2.0-1', '2.0.1', '3:69c7062f6bb536836805960380dfdb90', 65)
GO

