-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 12/18/12 11:04 AM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.0.0.groovy::7.0.0-1::owf::(Checksum: 3:9c64b0b8b8cb507555f0c02c00cb382b)
-- Expand a widget definition's description field to 4000 to match Marketplace
ALTER TABLE [dbo].[widget_definition] ALTER COLUMN [description] VARCHAR(4000)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Expand a widget definition''s description field to 4000 to match Marketplace', GETDATE(), 'Modify data type', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-1', '2.0.1', '3:9c64b0b8b8cb507555f0c02c00cb382b', 1)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-2::owf::(Checksum: 3:d1ab9c56671573cf7cde5a4e7c13652c)
-- Remove DashboardWidgetState since it is no longer used.
DROP TABLE [dbo].[dashboard_widget_state]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove DashboardWidgetState since it is no longer used.', GETDATE(), 'Drop Table', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-2', '2.0.1', '3:d1ab9c56671573cf7cde5a4e7c13652c', 2)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-3::owf::(Checksum: 3:4fa1c719a7a3b5c7e457240ad8dec60c)
-- Remove show_launch_menu since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP CONSTRAINT DF_dashboard_show_launch_menu
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove show_launch_menu since it is no longer used.', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-3', '2.0.1', '3:4fa1c719a7a3b5c7e457240ad8dec60c', 3)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-4::owf::(Checksum: 3:21b5b103a5b9e7134b2bbb0a7686e3cf)
-- Remove show_launch_menu since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [show_launch_menu]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove show_launch_menu since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-4', '2.0.1', '3:21b5b103a5b9e7134b2bbb0a7686e3cf', 4)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-5::owf::(Checksum: 3:634c7ed646b89e253102d12b6818c245)
-- Remove layout since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [layout]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove layout since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-5', '2.0.1', '3:634c7ed646b89e253102d12b6818c245', 5)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-6::owf::(Checksum: 3:ef21c5e1a70b81160e2ed6989fc1afa6)
-- Remove intent_config since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [intent_config]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove intent_config since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-6', '2.0.1', '3:ef21c5e1a70b81160e2ed6989fc1afa6', 6)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-7::owf::(Checksum: 3:9ee1cd65b85caaca3178939bac1e0fcf)
-- Remove default_settings since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [default_settings]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove default_settings since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-7', '2.0.1', '3:9ee1cd65b85caaca3178939bac1e0fcf', 7)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-8::owf::(Checksum: 3:ef688a16b0055a8024a489393bcfc987)
-- Remove column_count since it is no longer used.
ALTER TABLE [dbo].[dashboard] DROP COLUMN [column_count]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove column_count since it is no longer used.', GETDATE(), 'Drop Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-8', '2.0.1', '3:ef688a16b0055a8024a489393bcfc987', 8)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-9::owf::(Checksum: 3:43e9c996af93d8cface8845446b8a525)
-- Create stack table
CREATE TABLE [dbo].[stack] ([id] BIGINT IDENTITY  NOT NULL, [version] BIGINT NOT NULL, [name] VARCHAR(256) NOT NULL, [description] VARCHAR(4000), [stack_context] VARCHAR(200) NOT NULL, [image_url] VARCHAR(2083), [descriptor_url] VARCHAR(2083), CONSTRAINT [stackPK] PRIMARY KEY ([id]), UNIQUE ([stack_context]))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create stack table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-9', '2.0.1', '3:43e9c996af93d8cface8845446b8a525', 9)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-11::owf::(Checksum: 3:26603e120cea879f6b2e1010a1b10a57)
create table stack_groups (group_id numeric(19,0) not null, stack_id bigint not null)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-11', '2.0.1', '3:26603e120cea879f6b2e1010a1b10a57', 10)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-12::owf::(Checksum: 3:7a64e2e16d79e54338e9ec959602447a)
-- Add primary key constraint for group_id and stack_id in stack_groups table
ALTER TABLE [dbo].[stack_groups] ADD CONSTRAINT [pk_stack_groups] PRIMARY KEY ([group_id], [stack_id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add primary key constraint for group_id and stack_id in stack_groups table', GETDATE(), 'Add Primary Key', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-12', '2.0.1', '3:7a64e2e16d79e54338e9ec959602447a', 11)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-13::owf::(Checksum: 3:0e9ce4f940d8f89b0fd983abc89ee775)
-- Add foreign key constraints for group_id and stack_id in stack_groups table
ALTER TABLE [dbo].[stack_groups] ADD CONSTRAINT [FK9584AB6B6B3A1281] FOREIGN KEY ([stack_id]) REFERENCES [dbo].[stack] ([id])
GO

ALTER TABLE [dbo].[stack_groups] ADD CONSTRAINT [FK9584AB6B3B197B21] FOREIGN KEY ([group_id]) REFERENCES [dbo].[owf_group] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign key constraints for group_id and stack_id in stack_groups table', GETDATE(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-13', '2.0.1', '3:0e9ce4f940d8f89b0fd983abc89ee775', 12)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-14::owf::(Checksum: 3:803b99533e3b4d760c15e2f1eca18e05)
-- Add stack_default field to group
ALTER TABLE [dbo].[owf_group] ADD [stack_default] BIT CONSTRAINT DF_owf_group_stack_default DEFAULT 0
GO

UPDATE [dbo].[owf_group] SET [stack_default] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add stack_default field to group', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-14', '2.0.1', '3:803b99533e3b4d760c15e2f1eca18e05', 13)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-15::owf::(Checksum: 3:76942320acfc0aa46ca2667795a3ac93)
-- Insert OWF stack
INSERT INTO [dbo].[stack] ([description], [image_url], [name], [stack_context], [version]) VALUES ('OWF Stack', 'themes/common/images/owf.png', 'OWF', 'owf', 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Insert OWF stack', GETDATE(), 'Insert Row', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-15', '2.0.1', '3:76942320acfc0aa46ca2667795a3ac93', 14)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-18::owf::(Checksum: 3:f0ee8e108606cf0faf3593499efc07bf)
-- Insert OWF stack default group
INSERT INTO [dbo].[owf_group] ([automatic], [name], [stack_default], [status], [version]) VALUES (0, 'ce86a612-c355-486e-9c9e-5252553cc58e', 1, 'active', 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Insert OWF stack default group', GETDATE(), 'Insert Row', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-18', '2.0.1', '3:f0ee8e108606cf0faf3593499efc07bf', 15)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-21::owf::(Checksum: 3:32c56c09a37ffceb75742132f42ddf73)
insert into stack_groups (stack_id, group_id) values ((select id from stack where name = 'OWF'), (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58e'))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-21', '2.0.1', '3:32c56c09a37ffceb75742132f42ddf73', 16)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-22::owf::(Checksum: 3:7146f45f54d8db1d72abb498d691cebb)
-- Add a reference to a host stack to dashboard records to track where user instances should appear
ALTER TABLE [dbo].[dashboard] ADD [stack_id] BIGINT
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add a reference to a host stack to dashboard records to track where user instances should appear', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-22', '2.0.1', '3:7146f45f54d8db1d72abb498d691cebb', 17)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-23::owf::(Checksum: 3:4d6a39028c8a5cc0a85b8b37fbf1b1fc)
-- Add foreign key constraint for stack_id in the dashboard table
ALTER TABLE [dbo].[dashboard] ADD CONSTRAINT [FKC18AEA946B3A1281] FOREIGN KEY ([stack_id]) REFERENCES [dbo].[stack] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign key constraint for stack_id in the dashboard table', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-23', '2.0.1', '3:4d6a39028c8a5cc0a85b8b37fbf1b1fc', 18)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-24::owf::(Checksum: 3:f1e6830542a856459733effeca8aaa24)
-- Add a property to track the count of unique widgets present on the dashboards of a stack
ALTER TABLE [dbo].[stack] ADD [unique_widget_count] BIGINT CONSTRAINT DF_stack_unique_widget_count DEFAULT '0'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add a property to track the count of unique widgets present on the dashboards of a stack', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-24', '2.0.1', '3:f1e6830542a856459733effeca8aaa24', 19)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-25::owf::(Checksum: 3:ac445082cf2ee5903046bef22276a996)
delete from stack_groups where stack_id = (select id from stack where name = 'OWF') and group_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58e')
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-25', '2.0.1', '3:ac445082cf2ee5903046bef22276a996', 20)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-26::owf::(Checksum: 3:74dc7504043a1f24e2d86d75a2dab571)
-- Delete OWF Stack Group
DELETE FROM [dbo].[owf_group]  WHERE name like 'ce86a612-c355-486e-9c9e-5252553cc58e'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Delete OWF Stack Group', GETDATE(), 'Delete Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-26', '2.0.1', '3:74dc7504043a1f24e2d86d75a2dab571', 21)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-27::owf::(Checksum: 3:cae136582b06f1ed04a6309814236cdc)
-- Delete OWF Stack
DELETE FROM [dbo].[stack]  WHERE name like 'OWF'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Delete OWF Stack', GETDATE(), 'Delete Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-27', '2.0.1', '3:cae136582b06f1ed04a6309814236cdc', 22)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-28::owf::(Checksum: 3:f1bf16779c9d7419bc7cc94e81687786)
-- Add user_widget field to person_widget_definition table
ALTER TABLE [dbo].[person_widget_definition] ADD [user_widget] BIT CONSTRAINT DF_person_widget_definition_user_widget DEFAULT 0
GO

UPDATE [dbo].[person_widget_definition] SET [user_widget] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add user_widget field to person_widget_definition table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-28', '2.0.1', '3:f1bf16779c9d7419bc7cc94e81687786', 23)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-29::owf::(Checksum: 3:29f71e23b2eb9ca309842616800501b2)
-- Update existing PWD records to set whether they were added to a user directly or just via a group
UPDATE [dbo].[person_widget_definition] SET [user_widget] = 1 WHERE group_widget=0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Update existing PWD records to set whether they were added to a user directly or just via a group', GETDATE(), 'Update Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-29', '2.0.1', '3:29f71e23b2eb9ca309842616800501b2', 24)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-30::owf::(Checksum: 3:b2da3152051ee5103b9157dcca94ee79)
-- Remove the Widget Approvals widget definition and all of its user, group, intent, and widget type references
DELETE FROM [dbo].[domain_mapping]  WHERE dest_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp') and  dest_type = 'widget_definition'
GO

DELETE FROM [dbo].[person_widget_definition]  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp')
GO

DELETE FROM [dbo].[widget_definition_widget_types]  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp')
GO

DELETE FROM [dbo].[widget_def_intent_data_types]  WHERE widget_definition_intent_id in (select id from widget_def_intent where widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp'))
GO

DELETE FROM [dbo].[widget_def_intent]  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp')
GO

DELETE FROM [dbo].[widget_definition]  WHERE widget_url='admin/MarketplaceApprovals.gsp'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove the Widget Approvals widget definition and all of its user, group, intent, and widget type references', GETDATE(), 'Delete Data (x6)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-30', '2.0.1', '3:b2da3152051ee5103b9157dcca94ee79', 25)
GO

-- Changeset changelog_7.0.0.groovy::7.0.0-53::owf::(Checksum: 3:95913c657b14ecdbb8c9f85fc0a071b1)
-- Expand a dashboard's description field to 4000 to match Marketplace
ALTER TABLE [dbo].[dashboard] ALTER COLUMN [description] VARCHAR(4000)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Expand a dashboard''s description field to 4000 to match Marketplace', GETDATE(), 'Modify data type', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-53', '2.0.1', '3:95913c657b14ecdbb8c9f85fc0a071b1', 26)
GO

-- Release Database Lock
