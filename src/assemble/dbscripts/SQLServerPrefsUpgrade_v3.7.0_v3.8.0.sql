-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 12/16/11 7:31 PM

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

-- Changeset changelog_3.8.0.groovy::3.8.0-1::owf::(Checksum: 3:7da0aa625657bc0a79a62ee817160825)
ALTER TABLE [dbo].[dashboard] ALTER COLUMN [user_id] NUMERIC(19,0) NULL
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-1', '2.0.1', '3:7da0aa625657bc0a79a62ee817160825', 1)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-2::owf::(Checksum: 3:43600e1eebd0b612def9a76758daa403)
-- Added description column into Dashboard Table
ALTER TABLE [dbo].[dashboard] ADD [description] VARCHAR(255)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added description column into Dashboard Table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-2', '2.0.1', '3:43600e1eebd0b612def9a76758daa403', 2)
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

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-3', '2.0.1', '3:43d17f3d3dc02ed1cf7e745f66731b21', 3)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-4::owf::(Checksum: 3:b98ec98220fc4669acb11cc65cba959b)
ALTER TABLE [dbo].[dashboard] ADD CONSTRAINT [FKC18AEA94372CC5A] FOREIGN KEY ([created_by_id]) REFERENCES [dbo].[person] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-4', '2.0.1', '3:b98ec98220fc4669acb11cc65cba959b', 4)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-5::owf::(Checksum: 3:30cd6eb8e32c5bb622cd48a6730e86e1)
ALTER TABLE [dbo].[dashboard] ADD CONSTRAINT [FKC18AEA947028B8DB] FOREIGN KEY ([edited_by_id]) REFERENCES [dbo].[person] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-5', '2.0.1', '3:30cd6eb8e32c5bb622cd48a6730e86e1', 5)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-6::owf::(Checksum: 3:8fac943f557a7e4ac7b1573904347daf)
CREATE TABLE [dbo].[metric] ([id] BIGINT IDENTITY  NOT NULL, [version] BIGINT NOT NULL, [component] VARCHAR(200) NOT NULL, [component_id] VARCHAR(255) NOT NULL, [instance_id] VARCHAR(255) NOT NULL, [metric_time] VARCHAR(255) NOT NULL, [metric_type_id] VARCHAR(255) NOT NULL, [site] VARCHAR(255) NOT NULL, [user_agent] VARCHAR(255) NOT NULL, [user_name] VARCHAR(255) NOT NULL, [widget_data] VARCHAR(255), CONSTRAINT [metricPK] PRIMARY KEY ([id]))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-6', '2.0.1', '3:8fac943f557a7e4ac7b1573904347daf', 6)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-7::owf::(Checksum: 3:4163f7334862d1ae47e0a16041fcc73b)
-- Updating Admin Widget Icons and Names
UPDATE [dbo].[widget_definition] SET [display_name] = 'User Manager', [image_url_large] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', [image_url_small] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png' WHERE widget_url='admin/UserManagement.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'User Editor', [image_url_large] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', [image_url_small] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', [visible] = 0 WHERE widget_url='admin/UserEdit.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Widget Manager', [image_url_large] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', [image_url_small] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png' WHERE widget_url='admin/WidgetManagement.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Widget Editor', [image_url_large] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', [image_url_small] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', [visible] = 0 WHERE widget_url='admin/WidgetEdit.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Group Manager', [image_url_large] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', [image_url_small] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png' WHERE widget_url='admin/GroupManagement.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Group Editor', [image_url_large] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', [image_url_small] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', [visible] = 0 WHERE widget_url='admin/GroupEdit.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Group Dashboard Manager', [image_url_large] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', [image_url_small] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png' WHERE widget_url='admin/GroupDashboardManagement.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Dashboard Editor', [image_url_large] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', [image_url_small] = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', [visible] = 0 WHERE widget_url='admin/DashboardEdit.gsp'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Updating Admin Widget Icons and Names', GETDATE(), 'Update Data (x8)', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-7', '2.0.1', '3:4163f7334862d1ae47e0a16041fcc73b', 7)
GO

-- Changeset changelog_3.8.0.groovy::3.8.0-9::owf::(Checksum: 3:725b3672472c5b7a6dfa6d7a03b37604)
ALTER TABLE [dbo].[widget_definition] ALTER COLUMN [widget_version] NVARCHAR(2083) NULL
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-9', '2.0.1', '3:725b3672472c5b7a6dfa6d7a03b37604', 8)
GO

