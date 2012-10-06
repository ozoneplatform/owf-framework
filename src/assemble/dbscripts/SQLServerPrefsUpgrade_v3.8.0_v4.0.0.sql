-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 3/13/12 4:12 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_4.0.0.groovy::4.0.0-3::owf::(Checksum: 3:d066b39ebec901b63dbe5b674825449d)
-- Added defaultSettings column into Dashboard Table
ALTER TABLE [dbo].[dashboard] ADD [default_settings] NVARCHAR(MAX)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added defaultSettings column into Dashboard Table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-3', '2.0.1', '3:d066b39ebec901b63dbe5b674825449d', 1)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-4::owf::(Checksum: 3:c4ccbcf8a10f33b5063af97a9d15d28c)
-- Added background column for WidgetDefinition
ALTER TABLE [dbo].[widget_definition] ADD [background] BIT
GO

UPDATE [dbo].[widget_definition] SET [background] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added background column for WidgetDefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-4', '2.0.1', '3:c4ccbcf8a10f33b5063af97a9d15d28c', 2)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-47::owf::(Checksum: 3:967a5a6cb7f1d94dfef9beb90b77e1e5)
-- Added showLaunchMenu column into Dashboard Table
ALTER TABLE [dbo].[dashboard] ADD [show_launch_menu] BIT CONSTRAINT DF_dashboard_show_launch_menu DEFAULT 0
GO

UPDATE [dbo].[dashboard] SET [show_launch_menu] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added showLaunchMenu column into Dashboard Table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-47', '2.0.1', '3:967a5a6cb7f1d94dfef9beb90b77e1e5', 3)
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

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create widget type table and linking table for sql server', GETDATE(), 'Create Table (x2), Add Primary Key, Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-49', '2.0.1', '3:da13badad5d1323ad20fe7dfb7f114c4', 4)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-50::owf::(Checksum: 3:dcdf0a7bee837a0c5f886c33398947b5)
-- allow identity inserts
SET IDENTITY_INSERT [dbo].[widget_type] ON
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'allow identity inserts', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-50', '2.0.1', '3:dcdf0a7bee837a0c5f886c33398947b5', 5)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-51::owf::(Checksum: 3:dc8cf89d14b68c19d487908ef28c89b1)
-- Add widget types to table
INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (1, 'standard', 0)
GO

INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (2, 'administration', 0)
GO

INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (3, 'marketplace', 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add widget types to table', GETDATE(), 'Insert Row (x3)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-51', '2.0.1', '3:dc8cf89d14b68c19d487908ef28c89b1', 6)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-52::owf::(Checksum: 3:75c71045d9719cb66de6a92836d0ee60)
-- allow identity inserts
SET IDENTITY_INSERT [dbo].[widget_type] OFF
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'allow identity inserts', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-52', '2.0.1', '3:75c71045d9719cb66de6a92836d0ee60', 7)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-53::owf::(Checksum: 3:7fed1a797ab9d36fdb18255281541337)
-- Insert widget type mapping links
insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
      select id, 1 from widget_definition
      where widget_url not in (
        'admin/DashboardEdit.gsp',
        'admin/GroupDashboardManagement.gsp',
        'admin/GroupEdit.gsp',
        'admin/GroupManagement.gsp',
        'admin/MarketplaceApprovals.gsp',
        'admin/UserManagement.gsp',
        'admin/UserEdit.gsp',
        'admin/WidgetEdit.gsp',
        'admin/WidgetManagement.gsp'
        )
GO

insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
      select id, 2 from widget_definition
      where widget_url in (
        'admin/DashboardEdit.gsp',
        'admin/GroupDashboardManagement.gsp',
        'admin/GroupEdit.gsp',
        'admin/GroupManagement.gsp',
        'admin/MarketplaceApprovals.gsp',
        'admin/UserManagement.gsp',
        'admin/UserEdit.gsp',
        'admin/WidgetEdit.gsp',
        'admin/WidgetManagement.gsp'
        )
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Insert widget type mapping links', GETDATE(), 'Custom SQL (x2)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-53', '2.0.1', '3:7fed1a797ab9d36fdb18255281541337', 8)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-55::owf::(Checksum: 3:43c93ef1d7f35a92c470fdcfde7b2d6f)
-- Updating Admin Widget Icons and Names
UPDATE [dbo].[widget_definition] SET [display_name] = 'Users', [image_url_large] = 'themes/common/images/adm-tools/Users64.png', [image_url_small] = 'themes/common/images/adm-tools/Users24.png' WHERE widget_url='admin/UserManagement.gsp'
GO

UPDATE [dbo].[widget_definition] SET [image_url_large] = 'themes/common/images/adm-tools/Users64.png', [image_url_small] = 'themes/common/images/adm-tools/Users24.png' WHERE widget_url='admin/UserEdit.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Widgets', [image_url_large] = 'themes/common/images/adm-tools/Widgets64.png', [image_url_small] = 'themes/common/images/adm-tools/Widgets24.png' WHERE widget_url='admin/WidgetManagement.gsp'
GO

UPDATE [dbo].[widget_definition] SET [image_url_large] = 'themes/common/images/adm-tools/Widgets64.png', [image_url_small] = 'themes/common/images/adm-tools/Widgets24.png' WHERE widget_url='admin/WidgetEdit.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Groups', [image_url_large] = 'themes/common/images/adm-tools/Groups64.png', [image_url_small] = 'themes/common/images/adm-tools/Groups24.png' WHERE widget_url='admin/GroupManagement.gsp'
GO

UPDATE [dbo].[widget_definition] SET [image_url_large] = 'themes/common/images/adm-tools/Groups64.png', [image_url_small] = 'themes/common/images/adm-tools/Groups24.png' WHERE widget_url='admin/GroupEdit.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Group Dashboards', [image_url_large] = 'themes/common/images/adm-tools/Dashboards64.png', [image_url_small] = 'themes/common/images/adm-tools/Dashboards24.png' WHERE widget_url='admin/GroupDashboardManagement.gsp'
GO

UPDATE [dbo].[widget_definition] SET [image_url_large] = 'themes/common/images/adm-tools/Dashboards64.png', [image_url_small] = 'themes/common/images/adm-tools/Dashboards24.png' WHERE widget_url='admin/DashboardEdit.gsp'
GO

UPDATE [dbo].[widget_definition] SET [display_name] = 'Approvals', [image_url_large] = 'themes/common/images/adm-tools/Approvals64.png', [image_url_small] = 'themes/common/images/adm-tools/Approvals24.png', [visible] = 1 WHERE widget_url='admin/MarketplaceApprovals.gsp'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Updating Admin Widget Icons and Names', GETDATE(), 'Update Data (x9)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-55', '2.0.1', '3:43c93ef1d7f35a92c470fdcfde7b2d6f', 9)
GO

-- Changeset changelog_4.0.0.groovy::4.0.0-56::owf::(Checksum: 3:7e4d6568d91e79149f8b895501eb8579)
-- Updating display_name column to 256 chars
ALTER TABLE [dbo].[widget_definition] ALTER COLUMN [display_name] VARCHAR(256)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Updating display_name column to 256 chars', GETDATE(), 'Modify data type', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-56', '2.0.1', '3:7e4d6568d91e79149f8b895501eb8579', 10)
GO

-- Release Database Lock
