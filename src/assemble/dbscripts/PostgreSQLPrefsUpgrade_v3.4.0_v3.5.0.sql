/*****************************************************
 * PostgresSQL UPRGRADE SCRIPT                            *
 *                                                   *
 * Upgrade a OWF v3.4.0 database to v3.5.0     *
 *****************************************************/

-- Execute these alter statements only if you have not started owf.  Otherwise owf will automatically alter the tables and these statements will fail
alter table person drop column passwd;
alter table dashboard_widget_state add column widget_guid varchar(255);
alter table dashboard_widget_state alter column person_widget_definition_id drop not null;
alter table widget_definition add column visible bool;

create table domain_mapping (id int8 not null, version int8 not null, src_type varchar(255) not null, src_id int8 not null, dest_id int8 not null, dest_type varchar(255) not null, primary key (id));
create table owf_group (id int8 not null, version int8 not null, status varchar(8) not null, email varchar(255), description varchar(255), name varchar(200) not null, automatic bool not null, primary key (id));
create table owf_group_people (person_id int8 not null, group_id int8 not null, primary key (group_id, person_id));

--old constraint names
alter table dashboard drop constraint FKC18AEA9485837584;
alter table dashboard_widget_state drop constraint FKB6440EA1EDEDBBC2;
alter table dashboard_widget_state drop constraint FKB6440EA1FDD6991A;
alter table eventing_connections drop constraint FKBCC1569E49776512;
alter table person_widget_definition drop constraint FK6F5C17C4C12321BA;
alter table person_widget_definition drop constraint FK6F5C17C4F7CB67A3;
alter table preference drop constraint FKA8FCBCDB85837584;
alter table role_people drop constraint FK28B75E78C12321BA;
alter table role_people drop constraint FK28B75E7852388A1A;
alter table tag_links drop constraint FK7C35D6D45A3B441D;

--new constraint names
alter table dashboard add constraint FKC18AEA948656347D foreign key (user_id) references person;
alter table dashboard_widget_state add constraint FKB6440EA192BD68BB foreign key (person_widget_definition_id) references person_widget_definition;
alter table dashboard_widget_state add constraint FKB6440EA1CA944B81 foreign key (dashboard_id) references dashboard;
alter table eventing_connections add constraint FKBCC1569EB20FFC4B foreign key (dashboard_widget_state_id) references dashboard_widget_state;
alter table owf_group_people add constraint FK2811370C1F5E0B3 foreign key (person_id) references person;
alter table owf_group_people add constraint FK28113703B197B21 foreign key (group_id) references owf_group;
alter table person_widget_definition add constraint FK6F5C17C4C1F5E0B3 foreign key (person_id) references person;
alter table person_widget_definition add constraint FK6F5C17C4293A835C foreign key (widget_definition_id) references widget_definition;
alter table preference add constraint FKA8FCBCDB8656347D foreign key (user_id) references person;
alter table role_people add constraint FK28B75E7870B353 foreign key (role_id) references role;
alter table role_people add constraint FK28B75E78C1F5E0B3 foreign key (person_id) references person;
alter table tag_links add constraint FK7C35D6D45A3B441D foreign key (tag_id) references tags;
