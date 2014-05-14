-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 6/10/13 4:13 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Changeset changelog_7.2.0.groovy::7.2.0-1::owf::(Checksum: 3:f87c5ac9001012f87a9854abfd7b4161)
-- Add fullscreen widget types to table. For SQL server we need to explicitly allow inserting into an auto increment field
SET IDENTITY_INSERT [dbo].[widget_type] ON
GO

INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (5, 'fullscreen', 0)
GO

SET IDENTITY_INSERT [dbo].[widget_type] OFF
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add fullscreen widget types to table. For SQL server we need to explicitly allow inserting into an auto increment field', GETDATE(), 'Custom SQL, Insert Row, Custom SQL', 'EXECUTED', 'changelog_7.2.0.groovy', '7.2.0-1', '2.0.1', '3:f87c5ac9001012f87a9854abfd7b4161', 65)
GO

-- Release Database Lock
