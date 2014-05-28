-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 5/23/14 10:38 AM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_7.15.1.groovy::7.15.1-1::owf::(Checksum: 3:a253a2a9c7e7571b94e59fc1767c58b3)
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

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Delete Data (x8)', 'EXECUTED', 'changelog_7.15.1.groovy', '7.15.1-1', '2.0.1', '3:a253a2a9c7e7571b94e59fc1767c58b3', 1)
GO

-- Changeset changelog_7.15.1.groovy::7.15.1-2::owf::(Checksum: 3:1234ac8c0f21a1d748e17510d1c4373c)
exec sp_rename '[dbo].[widget_definition].[image_url_large]', 'image_url_medium'
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Rename Column', 'EXECUTED', 'changelog_7.15.1.groovy', '7.15.1-2', '2.0.1', '3:1234ac8c0f21a1d748e17510d1c4373c', 2)
GO

-- Release Database Lock
