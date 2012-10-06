--Oracle UPRGRADE SCRIPT                            
--Upgrade a OWF v3.2.0 database to v3.2.1 

-- Execute these alter statements only if you have not started owf.  Otherwise owf will automatically alter the tables and these statements will fail
alter table eventing_connections add dashboard_widget_state_id number(19,0);
alter table eventing_connections add eventing_connections_idx number(10,0);
alter table eventing_connections add constraint FKBCC1569E49776512 foreign key (dashboard_widget_state_id) references dashboard_widget_state;

update eventing_connections
set
(
eventing_connections_idx,
dashboard_widget_state_id
 )
 =
 (
 select dws_ec.eventing_connections_idx, dws_ec.dws_id from dws_eventingconnect dws_ec where eventing_connections.id = dws_ec.dws_eventingconnect_id
 )
where exists (
  select dws_ec.dws_id from dws_eventingconnect dws_ec where eventing_connections.id = dws_ec.dws_eventingconnect_id
);

drop table dws_eventingconnect;


