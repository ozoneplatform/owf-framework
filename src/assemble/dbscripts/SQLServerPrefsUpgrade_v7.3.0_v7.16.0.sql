-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 2/4/14 12:00 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.10.0.groovy::7.10.0-1::owf::(Checksum: 3:115190a042e53f65034683e629f8cf47)
ALTER TABLE [dbo].[person] ADD [last_notification] DATETIME
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.10.0.groovy', '7.10.0-1', '2.0.1', '3:115190a042e53f65034683e629f8cf47', 1)
GO

-- Changeset changelog_7.10.0.groovy::7.10.0-2::owf::(Checksum: 3:41ac759cfb732888d39c704edd1aa12d)
INSERT INTO [dbo].[application_configuration] ([code], [group_name], [mutable], [sub_group_order], [title], [type], [value], [version]) VALUES ('notifications.enabled', 'NOTIFICATIONS', 1, 1, ' ', 'Boolean', 'false', 0)
GO

INSERT INTO [dbo].[application_configuration] ([code], [group_name], [mutable], [sub_group_order], [title], [type], [value], [version]) VALUES ('notifications.query.interval', 'NOTIFICATIONS', 1, 2, ' ', 'Integer', '30', 0)
GO

INSERT INTO [dbo].[application_configuration] ([code], [group_name], [mutable], [sub_group_order], [title], [type], [value], [version]) VALUES ('url.public', 'NOTIFICATIONS', 1, 3, ' ', 'String', NULL, 0)
GO

INSERT INTO [dbo].[application_configuration] ([code], [group_name], [mutable], [sub_group_name], [sub_group_order], [title], [type], [value], [version])VALUES ('notifications.xmpp.server.hostname', 'NOTIFICATIONS', 1, 'XMPP Settings', 1, ' ', 'String', NULL, 0)
GO

INSERT INTO [dbo].[application_configuration] ([code], [group_name], [mutable], [sub_group_name], [sub_group_order], [title], [type], [value], [version]) VALUES ('notifications.xmpp.server.port', 'NOTIFICATIONS', 1, 'XMPP Settings', 2, ' ', 'Integer', '5222', 0)
GO

INSERT INTO [dbo].[application_configuration] ([code], [group_name], [mutable], [sub_group_name], [sub_group_order], [title], [type], [value], [version]) VALUES ('notifications.xmpp.room', 'NOTIFICATIONS', 1, 'XMPP Settings', 3, ' ', 'String', NULL, 0)
GO

INSERT INTO [dbo].[application_configuration] ([code], [group_name], [mutable], [sub_group_name], [sub_group_order], [title], [type], [value], [version]) VALUES ('notifications.xmpp.username', 'NOTIFICATIONS', 1, 'XMPP Settings', 4, ' ', 'String', NULL, 0)
GO

INSERT INTO [dbo].[application_configuration] ([code], [group_name], [mutable], [sub_group_name], [sub_group_order], [title], [type], [value], [version]) VALUES ('notifications.xmpp.password', 'NOTIFICATIONS', 1, 'XMPP Settings', 5, ' ', 'String', NULL, 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Insert Row (x8)', 'EXECUTED', 'changelog_7.10.0.groovy', '7.10.0-2', '2.0.1', '3:41ac759cfb732888d39c704edd1aa12d', 2)
GO

-- Release Database Lock
-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 5/23/14 10:38 AM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.16.0.groovy::7.15.1-1::owf::(Checksum: 3:a253a2a9c7e7571b94e59fc1767c58b3)
DELETE FROM [dbo].[application_configuration]  WHERE code = 'notifications.xmpp.server.hostname'
GO

DELETE FROM [dbo].[application_configuration]  WHERE code = 'notifications.xmpp.server.port'
GO

DELETE FROM [dbo].[application_configuration]  WHERE code = 'notifications.xmpp.room'
GO

DELETE FROM [dbo].[application_configuration]  WHERE code = 'notifications.xmpp.username'
GO

DELETE FROM [dbo].[application_configuration]  WHERE code = 'notifications.xmpp.password'
GO

DELETE FROM [dbo].[application_configuration]  WHERE code = 'notifications.enabled'
GO

DELETE FROM [dbo].[application_configuration]  WHERE code = 'notifications.query.interval'
GO

DELETE FROM [dbo].[application_configuration]  WHERE code = 'url.public'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Delete Data (x8)', 'EXECUTED', 'changelog_7.16.0.groovy', '7.15.1-1', '2.0.5', '3:a253a2a9c7e7571b94e59fc1767c58b3', 22)
GO

-- Changeset changelog_7.16.0.groovy::7.15.1-2::owf::(Checksum: 3:1234ac8c0f21a1d748e17510d1c4373c)
exec sp_rename '[dbo].[widget_definition].[image_url_large]', 'image_url_medium'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Rename Column', 'EXECUTED', 'changelog_7.16.0.groovy', '7.15.1-2', '2.0.5', '3:1234ac8c0f21a1d748e17510d1c4373c', 23)
GO

-- Changeset changelog_7.16.0.groovy::7.16.0-1::owf::(Checksum: 3:a5550d64efe7315b58db632c964075f3)
UPDATE [dbo].[application_configuration] SET [sub_group_order] = '5', [type] = 'String', [value] = '/var/log/cef' WHERE code='owf.cef.sweep.log.location' AND type <> 'String'
GO

UPDATE [dbo].[application_configuration] SET [sub_group_order] = '3', [type] = 'Boolean', [value] = 'true' WHERE code='owf.enable.cef.log.sweep' AND type <> 'Boolean'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Update Data (x2)', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-1', '2.0.5', '3:a5550d64efe7315b58db632c964075f3', 24)
GO

-- Changeset changelog_7.16.0.groovy::7.16.0-2::owf::(Checksum: 3:9413ce637b7ef560903ebae7e9da84d3)
ALTER TABLE [dbo].[person] ADD [requires_sync] BIT CONSTRAINT DF_person_requires_sync DEFAULT 0
GO

UPDATE [dbo].[person] SET [requires_sync] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-2', '2.0.5', '3:9413ce637b7ef560903ebae7e9da84d3', 25)
GO

-- Changeset changelog_7.16.0.groovy::7.16.0-3::owf::(Checksum: 3:7727672cc83b77a203682f2ed0f7e403)
ALTER TABLE [dbo].[stack] ADD [default_group_id] BIGINT
GO

ALTER TABLE [dbo].[stack] ADD CONSTRAINT [FK68AC28835014F5F] FOREIGN KEY ([default_group_id]) REFERENCES [dbo].[owf_group] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Column, Add Foreign Key Constraint', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-3', '2.0.5', '3:7727672cc83b77a203682f2ed0f7e403', 26)
GO

-- Changeset changelog_7.16.0.groovy::7.16.0-5::owf::(Checksum: 3:2004c0339ed2540d43b4185bfdd594fa)
CREATE INDEX [domain_mapping_all] ON [dbo].[domain_mapping]([src_id], [src_type], [relationship_type], [dest_id], [dest_type])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Create Index', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-5', '2.0.5', '3:2004c0339ed2540d43b4185bfdd594fa', 27)
GO

-- Changeset changelog_7.16.0.groovy::7.16.0-6::owf::(Checksum: 3:1a84a71cf6605cd2706216801b85e477)
ALTER TABLE [dbo].[widget_definition] ADD [mobile_ready] BIT NOT NULL CONSTRAINT DF_widget_definition_mobile_ready DEFAULT 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-6', '2.0.5', '3:1a84a71cf6605cd2706216801b85e477', 28)
GO

