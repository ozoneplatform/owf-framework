/*****************************************************
 * MySql UPRGRADE SCRIPT                            *
 *                                                   *
 * Upgrade a OWF v3.2.0 database to v3.2.1     *
 *****************************************************/

use prefs_service;

-- Execute these alter statements only if you have not started owf.  Otherwise owf will automatically alter the tables and these statements will fail
alter table eventing_connections add column dashboard_widget_state_id bigint;
alter table eventing_connections add column eventing_connections_idx integer;
alter table eventing_connections add index FKBCC1569E49776512 (dashboard_widget_state_id), add constraint FKBCC1569E49776512 foreign key (dashboard_widget_state_id) references dashboard_widget_state (id);

update eventing_connections ec inner join dws_eventingconnect dws_ec on ec.id = dws_ec.dws_eventingconnect_id
set ec.dashboard_widget_state_id = dws_ec.dws_id, ec.eventing_connections_idx=dws_ec.eventing_connections_idx;

drop table dws_eventingconnect;


