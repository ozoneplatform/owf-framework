/*****************************************************
 * SQLSERVER UPRGRADE SCRIPT                         *
 *                                                   *
 * UPGRADE A OWF V3.6.0 DATABASE TO V3.7.0           *
 *****************************************************/

-- EXECUTE THESE ALTER STATEMENTS ONLY IF YOU HAVE NOT STARTED OWF.
-- OTHERWISE OWF WILL AUTOMATICALLY ALTER THE TABLES AND THESE STATEMENTS WILL FAIL.
ALTER TABLE widget_definition ADD singleton TINYINT
GO

UPDATE widget_definition
SET singleton = 0
WHERE singleton IS NULL
GO

ALTER TABLE widget_definition ALTER COLUMN singleton TINYINT NOT NULL
GO

UPDATE widget_definition
SET visible = 1
WHERE visible IS NULL
GO

ALTER TABLE widget_definition ALTER COLUMN visible TINYINT NOT NULL
GO

ALTER TABLE person ADD prev_login datetime null
GO

ALTER TABLE domain_mapping ADD relationship_type nvarchar(8) null
GO

update domain_mapping
set relationship_type = 'owns'
where relationship_type is null
go