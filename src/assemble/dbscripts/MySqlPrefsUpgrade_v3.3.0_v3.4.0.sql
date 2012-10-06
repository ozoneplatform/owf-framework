/*****************************************************
 * MySql UPRGRADE SCRIPT                            *
 *                                                   *
 * Upgrade a OWF v3.3.0 database to v3.4.0     *
 *****************************************************/
use prefs_service;

-- Execute these alter statements only if you have not started owf.  Otherwise owf will automatically alter the tables and these statements will fail
alter table widget_definition add column widget_version longtext not null;

update widget_definition
set widget_version = '1.0'
where widget_version  = '' or widget_version is null;
