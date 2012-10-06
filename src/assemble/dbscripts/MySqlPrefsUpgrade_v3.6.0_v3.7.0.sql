/*****************************************************
 * MYSQL UPRGRADE SCRIPT                             *
 *                                                   *
 * UPGRADE A OWF V3.6.0 DATABASE TO V3.7.0           *
 *****************************************************/

-- EXECUTE THESE ALTER STATEMENTS ONLY IF YOU HAVE NOT STARTED OWF.
-- OTHERWISE OWF WILL AUTOMATICALLY ALTER THE TABLES AND THESE STATEMENTS WILL FAIL.
alter table widget_definition add singleton bit;

update widget_definition
set singleton = false
where singleton is null;

alter table widget_definition modify column singleton bit not null;

update widget_definition
set visible = true
where visible is null;

alter table widget_definition modify column visible bit not null;

alter table person add prev_login datetime;

alter table domain_mapping add relationship_type varchar(8);

update domain_mapping
set relationship_type = 'owns'
where relationship_type is null;
