-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 6/19/12 4:34 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_5.0.0.groovy::5.0.0-1::owf::(Checksum: 3:42d9c4bdcdff38a4fbe40bd1ec78d9b1)
-- Add display name to group
ALTER TABLE [dbo].[owf_group] ADD [display_name] VARCHAR(200)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add display name to group', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-1', '2.0.1', '3:42d9c4bdcdff38a4fbe40bd1ec78d9b1', 1)
GO

-- Changeset changelog_5.0.0.groovy::5.0.0-2::owf::(Checksum: 3:dcdf0a7bee837a0c5f886c33398947b5)
-- allow identity inserts
SET IDENTITY_INSERT [dbo].[widget_type] ON
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'allow identity inserts', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-2', '2.0.1', '3:dcdf0a7bee837a0c5f886c33398947b5', 2)
GO

-- Changeset changelog_5.0.0.groovy::5.0.0-3::owf::(Checksum: 3:aa2aca168ad6eaeea8509fd642d8c17b)
-- Add metric widget types to table
INSERT INTO [dbo].[widget_type] ([id], [name], [version]) VALUES (4, 'metric', 0)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add metric widget types to table', GETDATE(), 'Insert Row', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-3', '2.0.1', '3:aa2aca168ad6eaeea8509fd642d8c17b', 3)
GO

-- Changeset changelog_5.0.0.groovy::5.0.0-4::owf::(Checksum: 3:75c71045d9719cb66de6a92836d0ee60)
-- allow identity inserts
SET IDENTITY_INSERT [dbo].[widget_type] OFF
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'allow identity inserts', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-4', '2.0.1', '3:75c71045d9719cb66de6a92836d0ee60', 4)
GO

-- Changeset changelog_5.0.0.groovy::5.0.0-5::owf::(Checksum: 3:a3a4f6fe76ad042b42e27bdf7b09d277)
-- Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.
UPDATE [dbo].[owf_group] SET [automatic] = 1, [name] = 'OWF Users' WHERE name='All Users' AND automatic=0
GO

UPDATE [dbo].[owf_group] SET [automatic] = 1, [name] = 'OWF Administrators' WHERE name='OWF Admins' AND automatic=0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.', GETDATE(), 'Update Data (x2)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-5', '2.0.1', '3:a3a4f6fe76ad042b42e27bdf7b09d277', 5)
GO

-- Changeset changelog_5.0.0.groovy::5.0.0-6::owf::(Checksum: 3:96aa216a330817681aca38dc66d1129b)
-- Set default value for display_name
UPDATE owf_group
			SET display_name = name
			WHERE display_name IS NULL
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Set default value for display_name', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-6', '2.0.1', '3:96aa216a330817681aca38dc66d1129b', 6)
GO

-- Release Database Lock
