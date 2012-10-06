/*****************************************************
 * MySql UPRGRADE SCRIPT                            *
 *                                                   *
 * Upgrade a OWF v3.4.0 database to v3.5.0     *
 *****************************************************/

-- Execute these alter statements only if you have not started owf.  Otherwise owf will automatically alter the tables and these statements will fail
alter table person drop column passwd;
alter table dashboard_widget_state add widget_guid varchar(255);
alter table dashboard_widget_state modify person_widget_definition_id bigint null;
alter table widget_definition add visible bit;

create table domain_mapping (id bigint not null auto_increment, version bigint not null, src_type varchar(255) not null, src_id bigint not null, dest_id bigint not null, dest_type varchar(255) not null, primary key (id));
create table owf_group (id bigint not null auto_increment, version bigint not null, status varchar(8) not null, email varchar(255), description varchar(255), name varchar(200) not null, automatic bit not null, primary key (id));
create table owf_group_people (group_id bigint not null, person_id bigint not null, primary key (group_id, person_id));


-- old constraint names
alter table dashboard drop index FKC18AEA9485837584, drop foreign key FKC18AEA9485837584;
alter table dashboard_widget_state drop index FKB6440EA1EDEDBBC2, drop foreign key FKB6440EA1EDEDBBC2;
alter table dashboard_widget_state drop index FKB6440EA1FDD6991A, drop foreign key FKB6440EA1FDD6991A;
alter table eventing_connections drop index FKBCC1569E49776512, drop foreign key FKBCC1569E49776512;
alter table person_widget_definition drop index FK6F5C17C4C12321BA, drop foreign key FK6F5C17C4C12321BA;
alter table person_widget_definition drop index FK6F5C17C4F7CB67A3, drop foreign key FK6F5C17C4F7CB67A3;
alter table preference drop index FKA8FCBCDB85837584, drop foreign key FKA8FCBCDB85837584;
alter table role_people drop index FK28B75E78C12321BA, drop foreign key FK28B75E78C12321BA;
alter table role_people drop index FK28B75E7852388A1A, drop foreign key FK28B75E7852388A1A;
alter table tag_links drop index FK7C35D6D45A3B441D, drop foreign key FK7C35D6D45A3B441D;

-- new constraint names
alter table dashboard add index FKC18AEA948656347D (user_id), add constraint FKC18AEA948656347D foreign key (user_id) references person (id);
alter table dashboard_widget_state add index FKB6440EA192BD68BB (person_widget_definition_id), add constraint FKB6440EA192BD68BB foreign key (person_widget_definition_id) references person_widget_definition (id);
alter table dashboard_widget_state add index FKB6440EA1CA944B81 (dashboard_id), add constraint FKB6440EA1CA944B81 foreign key (dashboard_id) references dashboard (id);
alter table eventing_connections add index FKBCC1569EB20FFC4B (dashboard_widget_state_id), add constraint FKBCC1569EB20FFC4B foreign key (dashboard_widget_state_id) references dashboard_widget_state (id);
alter table owf_group_people add index FK2811370C1F5E0B3 (person_id), add constraint FK2811370C1F5E0B3 foreign key (person_id) references person (id);
alter table owf_group_people add index FK28113703B197B21 (group_id), add constraint FK28113703B197B21 foreign key (group_id) references owf_group (id);
alter table person_widget_definition add index FK6F5C17C4C1F5E0B3 (person_id), add constraint FK6F5C17C4C1F5E0B3 foreign key (person_id) references person (id);
alter table person_widget_definition add index FK6F5C17C4293A835C (widget_definition_id), add constraint FK6F5C17C4293A835C foreign key (widget_definition_id) references widget_definition (id);
alter table preference add index FKA8FCBCDB8656347D (user_id), add constraint FKA8FCBCDB8656347D foreign key (user_id) references person (id);
alter table role_people add index FK28B75E7870B353 (role_id), add constraint FK28B75E7870B353 foreign key (role_id) references role (id);
alter table role_people add index FK28B75E78C1F5E0B3 (person_id), add constraint FK28B75E78C1F5E0B3 foreign key (person_id) references person (id);
alter table tag_links add index FK7C35D6D45A3B441D (tag_id), add constraint FK7C35D6D45A3B441D foreign key (tag_id) references tags (id);
