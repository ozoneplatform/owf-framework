/*****************************************************
 * SQLServer UPRGRADE SCRIPT                            *
 *                                                   *
 * Upgrade a OWF v3.3.0 database to v3.4.0     *
 *****************************************************/
-- Execute these alter statements only if you have not started owf.  Otherwise owf will automatically alter the tables and these statements will fail
alter table widget_definition add widget_version varchar(2083) ;

update widget_definition
set widget_version = '1.0'
where widget_version is null ;

alter table widget_definition alter column widget_version varchar(2083) not null ;