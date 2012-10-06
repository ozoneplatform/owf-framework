/*****************************************************
 * ORACLE UPRGRADE SCRIPT                            *
 *                                                   *
 * UPGRADE A OWF V3.6.0 DATABASE TO V3.7.0           *
 *****************************************************/

-- EXECUTE THESE ALTER STATEMENTS ONLY IF YOU HAVE NOT STARTED OWF.
-- OTHERWISE OWF WILL AUTOMATICALLY ALTER THE TABLES AND THESE STATEMENTS WILL FAIL.
ALTER TABLE WIDGET_DEFINITION ADD SINGLETON NUMBER(1,0);

UPDATE WIDGET_DEFINITION
SET SINGLETON = 0
WHERE SINGLETON IS NULL;

ALTER TABLE WIDGET_DEFINITION MODIFY SINGLETON NUMBER(1,0) NOT NULL;

UPDATE WIDGET_DEFINITION
SET VISIBLE = 1
WHERE VISIBLE IS NULL;

ALTER TABLE WIDGET_DEFINITION MODIFY VISIBLE NUMBER(1,0) NOT NULL;

ALTER TABLE person ADD prev_login timestamp;

ALTER TABLE domain_mapping ADD relationship_type varchar2(8 char);

update domain_mapping
set relationship_type = 'owns'
where relationship_type is null;

COMMIT;
