/*****************************************************
 * POSTGRESSQL UPRGRADE SCRIPT                       *
 *                                                   *
 * UPGRADE A OWF V3.6.0 DATABASE TO V3.7.0           *
 *****************************************************/

-- EXECUTE THESE ALTER STATEMENTS ONLY IF YOU HAVE NOT STARTED OWF.
-- OTHERWISE OWF WILL AUTOMATICALLY ALTER THE TABLES AND THESE STATEMENTS WILL FAIL.
ALTER TABLE WIDGET_DEFINITION ADD COLUMN SINGLETON BOOL;

UPDATE WIDGET_DEFINITION
SET SINGLETON = FALSE
WHERE SINGLETON IS NULL;

ALTER TABLE WIDGET_DEFINITION ALTER COLUMN SINGLETON SET NOT NULL;

UPDATE WIDGET_DEFINITION
SET VISIBLE = TRUE
WHERE VISIBLE IS NULL;

ALTER TABLE WIDGET_DEFINITION ALTER COLUMN VISIBLE SET NOT NULL;

ALTER TABLE person ADD COLUMN prev_login timestamp;

ALTER TABLE domain_mapping ADD COLUMN relationship_type varchar(8);

update domain_mapping
set relationship_type = 'owns'
where relationship_type is null;
