-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 9/21/12 3:34 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_6.0.0.groovy::6.0.0-1::owf::(Checksum: 3:b7a17650e4cfde415fdbbcc4f2bd1317)
-- Add universal_name to widgetdefinition
ALTER TABLE widget_definition ADD universal_name VARCHAR(255);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add universal_name to widgetdefinition', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-1', '2.0.1', '3:b7a17650e4cfde415fdbbcc4f2bd1317', 1);

-- Changeset changelog_6.0.0.groovy::6.0.0-2::owf::(Checksum: 3:30ea4354058c7a09bfafb6acabfd1e33)
-- Add layoutConfig to dashboard
ALTER TABLE dashboard ADD layout_config TEXT;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add layoutConfig to dashboard', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-2', '2.0.1', '3:30ea4354058c7a09bfafb6acabfd1e33', 2);

-- Changeset changelog_6.0.0.groovy::6.0.0-3::owf::(Checksum: 3:6ce1db42048bc63ece1be0c3f4669a52)
-- Add descriptor_url to widgetdefinition
ALTER TABLE widget_definition ADD descriptor_url VARCHAR(2083);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add descriptor_url to widgetdefinition', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-3', '2.0.1', '3:6ce1db42048bc63ece1be0c3f4669a52', 3);

-- Changeset changelog_6.0.0.groovy::6.0.0-4::owf::(Checksum: 3:4e940a0bdfea36b98c62330e4b373dd3)
-- Remove EventingConnections table and association with DashboardWidgetState
DROP TABLE eventing_connections;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove EventingConnections table and association with DashboardWidgetState', NOW(), 'Drop Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-4', '2.0.1', '3:4e940a0bdfea36b98c62330e4b373dd3', 4);

-- Changeset changelog_6.0.0.groovy::6.0.0-5::owf::(Checksum: 3:2c40b74eb7eb29a286ac641320a97b4d)
-- Create intent table
CREATE TABLE intent (id bigserial NOT NULL, version BIGINT NOT NULL, action VARCHAR(255) NOT NULL, CONSTRAINT "intentPK" PRIMARY KEY (id), UNIQUE (action));

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create intent table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-5', '2.0.1', '3:2c40b74eb7eb29a286ac641320a97b4d', 5);

-- Changeset changelog_6.0.0.groovy::6.0.0-6::owf::(Checksum: 3:008f636cf428abbd60459975d28e62a1)
-- Create intent_data_type table
CREATE TABLE intent_data_type (id bigserial NOT NULL, version BIGINT NOT NULL, data_type VARCHAR(255) NOT NULL, CONSTRAINT "intent_data_typePK" PRIMARY KEY (id));

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create intent_data_type table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-6', '2.0.1', '3:008f636cf428abbd60459975d28e62a1', 6);

-- Changeset changelog_6.0.0.groovy::6.0.0-7::owf::(Checksum: 3:b462f738ef9c30634a0a47d245d16a59)
-- Create intent_data_types table
CREATE TABLE intent_data_types (intent_data_type_id BIGINT NOT NULL, intent_id BIGINT NOT NULL);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create intent_data_types table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-7', '2.0.1', '3:b462f738ef9c30634a0a47d245d16a59', 7);

-- Changeset changelog_6.0.0.groovy::6.0.0-8::owf::(Checksum: 3:ee497899a41d5cc2798af5cfc277aecb)
-- Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table
ALTER TABLE intent_data_types ADD CONSTRAINT FK8A59132FD46C6FAA FOREIGN KEY (intent_data_type_id) REFERENCES intent_data_type (id);

ALTER TABLE intent_data_types ADD CONSTRAINT FK8A59D92FD46C6FAA FOREIGN KEY (intent_id) REFERENCES intent (id);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table', NOW(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-8', '2.0.1', '3:ee497899a41d5cc2798af5cfc277aecb', 8);

-- Changeset changelog_6.0.0.groovy::6.0.0-9::owf::(Checksum: 3:8dda2a300eac867527577e37dabf3187)
-- Create widget_def_intent table
CREATE TABLE widget_def_intent (id bigserial NOT NULL, version BIGINT NOT NULL, receive BOOLEAN NOT NULL, send BOOLEAN NOT NULL, intent_id BIGINT NOT NULL, widget_definition_id BIGINT NOT NULL, CONSTRAINT "widget_def_intentPK" PRIMARY KEY (id));

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create widget_def_intent table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-9', '2.0.1', '3:8dda2a300eac867527577e37dabf3187', 9);

-- Changeset changelog_6.0.0.groovy::6.0.0-10::owf::(Checksum: 3:e5d364edc24ace7b9b89d3854bb70408)
-- Add foreign constraint for widget_definition_id in widget_def_intent table
ALTER TABLE widget_def_intent ADD CONSTRAINT FK8A59D92FD46C6FAB FOREIGN KEY (widget_definition_id) REFERENCES widget_definition (id);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign constraint for widget_definition_id in widget_def_intent table', NOW(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-10', '2.0.1', '3:e5d364edc24ace7b9b89d3854bb70408', 10);

-- Changeset changelog_6.0.0.groovy::6.0.0-11::owf::(Checksum: 3:fcf69ebd060340afd1483c2f4588f456)
-- Add foreign constraint for intent_id in widget_definition_intent table
ALTER TABLE widget_def_intent ADD CONSTRAINT FK8A59D92FD46C6FAC FOREIGN KEY (intent_id) REFERENCES intent (id);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign constraint for intent_id in widget_definition_intent table', NOW(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-11', '2.0.1', '3:fcf69ebd060340afd1483c2f4588f456', 11);

-- Changeset changelog_6.0.0.groovy::6.0.0-12::owf::(Checksum: 3:05c50cdf2e21818c6986e5ef2d8c9f50)
-- Create widget_def_intent_data_types table
CREATE TABLE widget_def_intent_data_types (intent_data_type_id BIGINT NOT NULL, widget_definition_intent_id BIGINT NOT NULL);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create widget_def_intent_data_types table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-12', '2.0.1', '3:05c50cdf2e21818c6986e5ef2d8c9f50', 12);

-- Changeset changelog_6.0.0.groovy::6.0.0-13::owf::(Checksum: 3:3250f92e3b85fec3db493d11b53445e2)
-- Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table
ALTER TABLE widget_def_intent_data_types ADD CONSTRAINT FK8A59D92FD41A6FAD FOREIGN KEY (intent_data_type_id) REFERENCES intent_data_type (id);

ALTER TABLE widget_def_intent_data_types ADD CONSTRAINT FK8A59D92FD46C6FAD FOREIGN KEY (widget_definition_intent_id) REFERENCES widget_def_intent (id);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table', NOW(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-13', '2.0.1', '3:3250f92e3b85fec3db493d11b53445e2', 13);

-- Changeset changelog_6.0.0.groovy::6.0.0-14::owf::(Checksum: 3:897a5aa2802104b8f90bcde737c47002)
-- Add intentConfig column to dashboard table
ALTER TABLE dashboard ADD intent_config TEXT;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add intentConfig column to dashboard table', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-14', '2.0.1', '3:897a5aa2802104b8f90bcde737c47002', 14);

-- Changeset changelog_6.0.0.groovy::6.0.0-15::owf::(Checksum: 3:a58c7f9ab7dcc8c733d3a16c25adc558)
-- Added description column into Widget Definition table
ALTER TABLE widget_definition ADD description VARCHAR(255) DEFAULT '';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Added description column into Widget Definition table', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-15', '2.0.1', '3:a58c7f9ab7dcc8c733d3a16c25adc558', 15);

-- Changeset changelog_6.0.0.groovy::6.0.0-16::owf::(Checksum: 3:9624d22cdbed36b5bbce5da92bdb1bfc)
-- Add groupWidget property to personwidgetdefinition
ALTER TABLE person_widget_definition ADD group_widget BOOLEAN DEFAULT FALSE;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add groupWidget property to personwidgetdefinition', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-16', '2.0.1', '3:9624d22cdbed36b5bbce5da92bdb1bfc', 16);

-- Changeset changelog_6.0.0.groovy::6.0.0-17::owf::(Checksum: 3:92a97333d2f7b5f17e0a541712847a54)
-- Add favorite property to personwidgetdefinition
ALTER TABLE person_widget_definition ADD favorite BOOLEAN DEFAULT FALSE;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add favorite property to personwidgetdefinition', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-17', '2.0.1', '3:92a97333d2f7b5f17e0a541712847a54', 17);

-- Changeset changelog_6.0.0.groovy::6.0.0-44::owf::(Checksum: 3:a0a7528d5494cd0f02b38b3f99b2cfe4)
ALTER TABLE dashboard ALTER COLUMN  layout DROP NOT NULL;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', NOW(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-44', '2.0.1', '3:a0a7528d5494cd0f02b38b3f99b2cfe4', 18);

-- Changeset changelog_6.0.0.groovy::6.0.0-53::owf::(Checksum: 3:9f398a44008d12aee688e347940b7adf)
-- Add locked property to dashboard
ALTER TABLE dashboard ADD locked BOOLEAN DEFAULT FALSE;

UPDATE dashboard SET locked = FALSE;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add locked property to dashboard', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-53', '2.0.1', '3:9f398a44008d12aee688e347940b7adf', 19);

-- Changeset changelog_6.0.0.groovy::6.0.0-55::owf::(Checksum: 3:2aa790687f711ca1d930c1aa24fadd0c)
-- Add display name field to pwd
ALTER TABLE person_widget_definition ADD display_name VARCHAR(256);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add display name field to pwd', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-55', '2.0.1', '3:2aa790687f711ca1d930c1aa24fadd0c', 20);

-- Changeset changelog_6.0.0.groovy::6.0.0-56::owf::(Checksum: 3:ca86586d796b6e61467c6fc7cb0a787c)
-- Add disabled field to pwd
ALTER TABLE person_widget_definition ADD disabled BOOLEAN DEFAULT FALSE;

UPDATE person_widget_definition SET disabled = FALSE;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add disabled field to pwd', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-56', '2.0.1', '3:ca86586d796b6e61467c6fc7cb0a787c', 21);

-- Changeset changelog_6.0.0.groovy::6.0.0-60::owf::(Checksum: 3:6854a81d538da9cad3e7720588cef819)
-- Convert OWF 5 style dashboards to OWF 6 style dashboards
/* Create backups of the dashboard and dashboard widget state tables before the conversion. */
select * into dashboard_backup from dashboard;
select * into dashboard_widget_state_backup from dashboard_widget_state;

/* randomHexString - Returns a string of arbitrary length of random hex characters. */
create or replace function randomHexString(lengh integer)
returns varchar as 
$$
select array_to_string(array(
        select substr('abcde1234567890',trunc(random()*15+1)::int,1)
        from generate_series(1,$1)),'')
$$ language sql volatile;

/* owfGetGuid - Declare a function that generates appropriate system uuids. */
create or replace function owfGetGuid() 
returns varchar 
as $$
declare
   uuid_val varchar;
begin
    uuid_val := randomHexString(32);
    uuid_val := substr(uuid_val, 1,8) || '-' || substr(uuid_val, 9, 4) || '-' || substr(uuid_val,13,4) ||
                '-' || substr(uuid_val,17, 4) || '-' || substr(uuid_val, 21, 12);
    return uuid_val;
end;
$$ language 'plpgsql';

/* owfBuildExtParamString - a simple function for creating a json parameter string. */
/*drop function owfBuildExtParamString(param_name in varchar, param_value in varchar)*/
create or replace function owfBuildExtParamString (param_name varchar, param_value varchar)
returns varchar
as
$$
declare 
    param varchar := '';
begin
    param := '"' || param_name || '":"' || param_value || '"';
    return param;
end;
$$ language 'plpgsql';
create or replace function owfBuildExtParamString (param_name varchar, param_value int)
returns varchar
as
$$
declare 
    param varchar := '';
begin
    param := '"' || param_name || '":"' || param_value || '"';
    return param;
end;
$$ language 'plpgsql';
create or replace function owfBuildExtParamString (param_name varchar, param_value bigint)
returns varchar
as
$$
declare 
    param varchar := '';
begin
    param := '"' || param_name || '":"' || param_value || '"';
    return param;
end;
$$ language 'plpgsql';

/* owfGetWidgetDefintion - creates an ext config string for a widget. */
create or replace function owfGetWidgetDefinition(
    dashboard_id bigint, dashboard_guid varchar, 
    pane_guid varchar, widget_id bigint, 
    w_guid varchar, unique_id varchar,
    wname varchar, active bool, x int, y int,
    z_index int,  maximized bool, minimized bool,
    pinned bool, collapsed bool, column_pos int,
    button_id varchar, button_opened bool,
    region varchar, state_position int,
    height int, width int,
    column_order varchar)
returns text
as
$$
declare
    singleton bool;
    param varchar(1024);
    config text := '';
begin
    /* Get the widget */
    select w.singleton into singleton from widget_definition as w where w.widget_guid = w_guid;

    config := '{';
    if length(w_guid) > 0 then
    param := owfBuildExtParamString('widgetGuid', w_guid);
        config := config || param || ',';
    else
        config := config || '"widgetGuid":null,';
    end if;
    
    param := owfBuildExtParamString('uniqueId', unique_id);
    config := config || param || ',';
    param := owfBuildExtParamString('dashboardGuid', dashboard_guid);
    config := config || param || ',';
    param := owfBuildExtParamString('paneGuid', pane_guid);
    config := config || param || ',';
    param := owfBuildExtParamString('name', wname);
    config := config || param || ',';
    if (active = true) then
        config := config || '"active":true,';
    else
        config := config || '"active":false,';
    end if;
    param := '"x":' || x;
    config := config || param || ',';
    param := '"y":' || y;
    config := config || param || ',';
    param := '"zIndex":' || z_index;
    config := config || param || ',';
    if maximized = true then
        config := config || '"maximized":true,';
    else
        config := config || '"maximized":false,';
    end if;
    if (minimized = true) then
        config := config || '"minimized":true,';
    else
        config := config || '"minimized":false,';
    end if;
    if (pinned = true) then
        config := config || '"pinned":true,';
    else
        config := config || '"pinned":false,';
    end if;
    config := config || param || ',';
    if (collapsed = true) then
        config := config || '"collapsed":true,';
    else
        config := config || '"collapsed":false,';
    end if;
    param := '"columnPos":' || column_pos;
    config := config || param || ',';
    if button_id <> null then
        param := owfBuildExtParamString('buttonId', button_id);
        config := config || param || ',';
    else
        config := config || '"buttonId":"",';
    end if;
    if (button_opened = true) then
        config := config || '"buttonOpened":true,';
    else
        config := config || '"buttonOpened":false,';
    end if;
    param := owfBuildExtParamString('region', region);
    config := config || param || ',';
    param := '"statePosition":' || state_position;
    config := config || param || ',';
    if (singleton = true) then
        config := config || '"singleton":true,';
    else
        config := config || '"singleton":false,';
    end if;
    param := '"height":' || height;
    config := config || param || ',';
    param := '"width":' || width;
    config := config || param || ',';
    param := '"columnOrder":""';
    config := config || param || ',';
    config := substr(config, 1, length(config) - 1);
    config := config || '}';
    return config;
end;
$$ language 'plpgsql';

/* Convert Desktop Dashboards */
create or replace function owfConvertDesktopDashboard(dashboard_id int8, dashboard_guid varchar, defaults text)
returns text
as
$$
declare
    vwidget_guid varchar(255);
    vunique_id varchar(255);
    vname varchar(200);
    vactive bool;
    vx int;
    vy int;
    vz_index int;
    vmaximized bool;
    vminimized bool;
    vpinned bool;
    vcollapsed bool;
    vcolumn_pos int;
    vbutton_id varchar(255);
    vbutton_opened bool;
    vregion varchar(15);
    vstate_position int;
    vsingleton bool;
    vheight int;
    vwidth int;
    vcolumn_order varchar(15);
    vwidget_id int8;
    vwidget_unique_id varchar(255);
    widget_config varchar(4096);
    desktop_widget_str text;
    desktop_pane_guid varchar(255);
    config text := '';
    /*
     * DESKTOP TEMPLATE
     * Keys for replacement are DESKTOP_WIDGETS
     */
    desktop_template text := '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":DESKTOP_WIDGETS,"defaultSettings":DESKTOP_DEFAULTS}';
    desktop_key varchar := 'DESKTOP_WIDGETS';
    desktop_defaults_key varchar := 'DESKTOP_DEFAULTS';
    widget_cursor cursor(cursor_dash_id int8) is 
    select id, unique_id, region,
       widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
       column_pos, button_id, button_opened, state_position, height, width
    from dashboard_widget_state dws
    where dws.dashboard_id = cursor_dash_id
    order by button_id, state_position;
begin
    /* Start the config string. */
    config := desktop_template;
    desktop_widget_str := '[';
    widget_config := '';

    /* Get a uuid for the desktop pane. */
    desktop_pane_guid := owfGetGuid();

    /* Open the widgets cursor. */
    open widget_cursor(dashboard_id);
    loop
        fetch widget_cursor into vwidget_id, vunique_id, vregion,
			         vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
			         vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
			         vheight, vwidth;       
        exit when NOT FOUND;

        widget_config := owfGetWidgetDefinition(dashboard_id, dashboard_guid, desktop_pane_guid, vwidget_id, 
			                        vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
			                        vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
			                        vbutton_id, vbutton_opened, vregion, vstate_position,
			                        vheight, vwidth, vcolumn_order);
        desktop_widget_str := desktop_widget_str || widget_config || ',';  
    end loop;
    close widget_cursor;
    /* Build the final config text block. */
    if length(desktop_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        desktop_widget_str := substr(desktop_widget_str, 1, length(desktop_widget_str) - 1) || ']';
    else 
        desktop_widget_str := desktop_widget_str || ']';
    end if;

    config := replace(config, desktop_key, desktop_widget_str);
    if defaults is null then
        config := replace(config, desktop_defaults_key, '{}');
    else
        config := replace(config, desktop_defaults_key, defaults);
    end if;
        
    return config;
end; 
$$ language 'plpgsql';

/* Convert Tabbed Dashboards */
create or replace function owfConvertTabbedDashboard(dashboard_id int8, dashboard_guid varchar)
returns text
as
$$
declare
    vwidget_guid varchar(255);
    vunique_id varchar(255);
    vname varchar(200);
    vactive bool;
    vx int;
    vy int;
    vz_index int;
    vmaximized bool;
    vminimized bool;
    vpinned bool;
    vcollapsed bool;
    vcolumn_pos int;
    vbutton_id varchar(255);
    vbutton_opened bool;
    vregion varchar(15);
    vstate_position int;
    vsingleton bool;
    vheight int;
    vwidth int;
    vcolumn_order varchar(15);
    vwidget_id int8;
    vwidget_unique_id varchar(255);
    widget_config varchar(4096);
    tab_widget_str text; 
    tab_pane_guid varchar(255);
    config text := '';
    /*
     * TABBED TEMPLATE
     * Keys for replacement are TAB_WIDGETS
     */
    tabbed_template text := '{"xtype":"tabbedpane","flex":1,"height":"100%","items":[],"paneType":"tabbedpane","widgets":TAB_WIDGETS,"defaultSettings":{}}';
    tabbed_key varchar(40) := 'TAB_WIDGETS';
    
    widget_cursor cursor(cursor_dash_id int8) is 
    select id, unique_id, region,
       widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
       column_pos, button_id, button_opened, state_position, height, width
    from dashboard_widget_state dws
    where dws.dashboard_id = cursor_dash_id
    order by state_position;
begin
   /* Start the config string. */
    config := tabbed_template;
    tab_widget_str := '[';
    widget_config := '';
    
    /* Get a uuid for the desktop pane. */
    tab_pane_guid := owfGetGuid();
    
    /* Open the widgets cursor. */
    open widget_cursor(dashboard_id);
    loop
        fetch widget_cursor into vwidget_id, vunique_id, vregion,
         vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
         vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
         vheight, vwidth;
        
        exit when NOT FOUND;
        widget_config := owfGetWidgetDefinition(dashboard_id, dashboard_guid, tab_pane_guid, vwidget_id, 
                                               vwidget_guid, vunique_id, vname, vactive, 0, 0, 0,
                                               vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                               vbutton_id, vbutton_opened, vregion, vstate_position,
                                               vheight, vwidth, vcolumn_order);
        tab_widget_str := tab_widget_str || widget_config || ',';  
    end loop;
    close widget_cursor;
    /* Build the final config text block. */
    if length(tab_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        tab_widget_str := substr(tab_widget_str, 1, length(tab_widget_str) - 1) || ']';
    else 
        tab_widget_str := tab_widget_str || ']';
    end if;
    
    config := replace(config, tabbed_key, tab_widget_str);
    return config;
end; 
$$ language 'plpgsql';

/* Convert Portal Dashboards */
create or replace function owfConvertPortalDashboard(dashboard_id int8, dashboard_guid varchar)
returns text
as
$$
declare
    vwidget_guid varchar(255);
    vunique_id varchar(255);
    vname varchar(200);
    vactive bool;
    vx int;
    vy int;
    vz_index int;
    vmaximized bool;
    vminimized bool;
    vpinned bool;
    vcollapsed bool;
    vcolumn_pos int;
    vbutton_id varchar(255);
    vbutton_opened bool;
    vregion varchar(15);
    vstate_position int;
    vsingleton bool;
    vheight int;
    vwidth int;
    vcolumn_order varchar(15);
    vwidget_id int8;
    vwidget_unique_id varchar(255);
    widget_config varchar(4096);
    portal_widget_str text;
    left_widget_str text;
    middle_widget_str text;
    right_widget_str text;
    left_pane_guid varchar(255);
    middle_pane_guid varchar(255);
    right_pane_guid varchar(255);
    max_column int := 0;
    temp_id int8 := 0;
    config text := '';
    /*
     * PORTAL TEMPLATE
     * Keys for replacement are LEFT_PORTAL_WIDGETS, MIDDLE_PORTAL_WIDGETS, RIGHT_PORTAL_WIDGETS
     * The old portals could be 1 2 or 3 columns, called here left, middle, right.
     */
    portal_3_template text := '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":0.33,"htmlText":"33%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox right","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":MIDDLE_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":RIGHT_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":0.67}],"flex":3}';
    portal_3_template_splitter text := '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":0.33,"htmlText":"33%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"splitter"},{"xtype":"container","cls":"hbox right","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":MIDDLE_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"splitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":RIGHT_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":0.67}],"flex":3}';
    portal_1_template text := '{"xtype":"portalpane","flex":1,"height":"100%","items":[],"paneType":"portalpane","widgets":LEFT_PORTAL_WIDGETS,"defaultSettings":{}}';
    portal_2_template text := '{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":MIDDLE_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":3}';
    portal_2_template_splitter text := '{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"splitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":MIDDLE_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":3}';
    portal_left_key varchar(40) := 'LEFT_PORTAL_WIDGETS';
    portal_middle_key varchar(40) := 'MIDDLE_PORTAL_WIDGETS';
    portal_right_key varchar(40) := 'RIGHT_PORTAL_WIDGETS';
    
    widget_cursor cursor(cursor_dash_id int8) is 
    select id, unique_id, region,
       widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
       column_pos, button_id, button_opened, state_position, height, width
    from dashboard_widget_state dws
    where dws.dashboard_id = cursor_dash_id
    order by state_position;
begin
    /* Start the config string. */
    portal_widget_str := '[';
    widget_config := '';
    left_widget_str := '[';
    middle_widget_str := '[';
    right_widget_str := '[';
    widget_config := '';
    
    /* Get a uuid for the desktop pane. */
    left_pane_guid := owfGetGuid();
    middle_pane_guid := owfGetGuid();
    right_pane_guid := owfGetGuid();
    
    /* Get the number of columns in this portal dashboard. */
    temp_id := dashboard_id;
    select max(w.column_pos) into max_column from dashboard_widget_state w where w.dashboard_id = temp_id;

    /* Determine which of the new portal templates to use. Note: column values are 0-based.*/
    config := portal_1_template;
    if max_column  = 1 then
    config := portal_2_template;
    elsif max_column = 2 then
    config := portal_3_template;
    end if;
    
    /* Open the widgets cursor. */
    open widget_cursor(dashboard_id);
    loop
    fetch widget_cursor into vwidget_id, vunique_id, vregion,
             vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
             vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
             vheight, vwidth;
        
    exit when NOT FOUND;

    /* Insert widgets into the appropriate column.  Any widgets not in 
     * a second or third column default to the first column; this includes
     * background widgets.
     */
    if vcolumn_pos = '1' then
        widget_config := owfGetWidgetDefinition(dashboard_id, dashboard_guid, middle_pane_guid, vwidget_id, 
                                                vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                                vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                                vbutton_id, vbutton_opened, vregion, vstate_position,
                                                vheight, vwidth, vcolumn_order);
        middle_widget_str := middle_widget_str || widget_config || ',';
    elsif vcolumn_pos = '2' then
        widget_config := owfGetWidgetDefinition(dashboard_id, dashboard_guid, right_pane_guid, vwidget_id, 
                                                vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                                vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                                vbutton_id, vbutton_opened, vregion, vstate_position,
                                                vheight, vwidth, vcolumn_order);
        right_widget_str := right_widget_str || widget_config || ',';
    else 
        widget_config := owfGetWidgetDefinition(dashboard_id, dashboard_guid, left_pane_guid, vwidget_id, 
                                                vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                                vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                                vbutton_id, vbutton_opened, vregion, vstate_position,
                                                vheight, vwidth, vcolumn_order);
        left_widget_str := left_widget_str || widget_config || ',';
    end if;
    end loop;
    close widget_cursor;
    /* Build the final config text block. */
    if length(left_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        left_widget_str := substr(left_widget_str, 1, length(left_widget_str) - 1) || ']';
    else 
        left_widget_str := left_widget_str || ']';
    end if;
    if length(middle_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        middle_widget_str := substr(middle_widget_str, 1, length(middle_widget_str) - 1) || ']';
    else 
        middle_widget_str := middle_widget_str || ']';
    end if;
    if length(right_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        right_widget_str := substr(right_widget_str, 1, length(right_widget_str) - 1) || ']';
    else 
        right_widget_str := right_widget_str || ']';
    end if;
    
    config := replace(config, portal_left_key, left_widget_str);
    if max_column > 0 then
        config := replace(config, portal_middle_key, middle_widget_str);
    end if;
    if max_column > 1 then
        config := replace(config, portal_right_key, right_widget_str);
    end if;
    return config;
end;
$$ language 'plpgsql';

/* Convert Accordion Dashboards */
create or replace function owfConvertAccordionDashboard(dashboard_id int8, dashboard_guid varchar)
returns text
as
$$
declare
    vwidget_guid varchar(255);
    vunique_id varchar(255);
    vname varchar(200);
    vactive bool;
    vx int;
    vy int;
    vz_index int;
    vmaximized bool;
    vminimized bool;
    vpinned bool;
    vcollapsed bool;
    vcolumn_pos int;
    vbutton_id varchar(255);
    vbutton_opened bool;
    vregion varchar(15);
    vstate_position int;
    vsingleton bool;
    vheight int;
    vwidth int;
    vcolumn_order varchar(15);
    vwidget_id int8;
    vwidget_unique_id varchar(255);
    widget_config varchar(4096);
    accordion_widget_str text;
    right_widget_str text;
    top_widget_str text;
    bottom_widget_str text;
    accordion_pane_guid varchar(255);
    right_pane_guid varchar(255);
    bottom_pane_guid varchar(255);
    bottom_widget_height int := 125;
    accordion_width int := 225;
    config text := '';
    /*
     * ACCORDION TEMPLATE 
     * Keys for replacement are ACCORDION_WIDGETS, TOP_RIGHT_WIDGET, BOTTOM_RIGHT_WIDGET
     */
    accordion_template text := '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"ACCORDION_WIDTHpx","items":[],"widgets":ACCORDION_WIDGETS,"paneType":"accordionpane","defaultSettings":{},"width":ACCORDION_WIDTH},{"xtype":"dashboardsplitter"},{"xtype":"accordionpane","cls":"right","flex":1,"htmlText":"Variable","items":[],"paneType":"accordionpane","widgets":RIGHT_WIDGETS,"defaultSettings":{}}],"flex":3}';
    accordion_template_splitter text := '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"ACCORDION_WIDTHpx","items":[],"widgets":ACCORDION_WIDGETS,"paneType":"accordionpane","defaultSettings":{},"width":ACCORDION_WIDTH},{"xtype":"splitter"},{"xtype":"accordionpane","cls":"right","flex":1,"htmlText":"Variable","items":[],"paneType":"accordionpane","widgets":RIGHT_WIDGETS,"defaultSettings":{}}],"flex":3}';
    accordion_template_old text := '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"ACCORDION_WIDTHpx","items":[],"widgets":ACCORDION_WIDGETS,"paneType":"accordionpane","width":ACCORDION_WIDTH,"defaultSettings":{}},{"xtype":"container","cls":"vbox right","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"tabbedpane","cls":"top","flex":1,"htmlText":"Variable","items":[],"widgets":TOP_RIGHT_WIDGET,"paneType":"tabbedpane","defaultSettings":{}},{"xtype":"tabbedpane","cls":"bottom","htmlText":"BOTTOM_WIDGET_HEIGHTpx","items":[],"paneType":"tabbedpane","height":BOTTOM_WIDGET_HEIGHT,"widgets":BOTTOM_RIGHT_WIDGET,"defaultSettings":{}}],"flex":1}],"flex":3}';
    accordion_widgets_key varchar := 'ACCORDION_WIDGETS';
    accordion_right_widgets_key varchar := 'RIGHT_WIDGETS';
    accordion_top_key varchar := 'TOP_RIGHT_WIDGET';
    accordion_bottom_key varchar := 'BOTTOM_RIGHT_WIDGET';
    accordion_width_key varchar := 'ACCORDION_WIDTH';
    accordion_bottom_height_key varchar := 'BOTTOM_WIDGET_HEIGHT';
    
    widget_cursor cursor(cursor_dash_id int8) is 
    select id, unique_id, region,
       widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
       column_pos, button_id, button_opened, state_position, height, width
    from dashboard_widget_state dws
    where dws.dashboard_id = cursor_dash_id
    order by state_position;
begin
    /* Start the config string. */
    widget_config := '';
    config := accordion_template;
    accordion_widget_str := '[';
    right_widget_str := '[';
    top_widget_str := '';
    bottom_widget_str := '';
    
    /* Get a uuid for the desktop pane. */
    accordion_pane_guid := owfGetGuid();
    right_pane_guid := owfGetGuid();
    
    /* Open the widgets cursor. */
    open widget_cursor(dashboard_id);
    loop
        fetch widget_cursor into vwidget_id, vunique_id, vregion,
                     vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
                     vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
                     vheight, vwidth;
            
        exit when NOT FOUND;
            
        if vregion = 'center' then
            /*insert into conversion_logs (msg) values (concat('Adding middle portal widget ', vunique_id));*/
            widget_config := owfGetWidgetDefinition(dashboard_id, dashboard_guid, right_pane_guid, vwidget_id, 
                                                    vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                                    vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                                    vbutton_id, vbutton_opened, vregion, vstate_position,
                                                    vheight, vwidth, vcolumn_order);
            top_widget_str := widget_config;
        elsif vregion = 'south' then
            widget_config := owfGetWidgetDefinition(dashboard_id, dashboard_guid, right_pane_guid, vwidget_id, 
                                                    vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                                    vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                                    vbutton_id, vbutton_opened, vregion, vstate_position,
                                                    vheight, vwidth, vcolumn_order);
            bottom_widget_height := vheight;
            bottom_widget_str := widget_config;
        else
            /* Throw the widget in the accordion pane in the new format. This includes background widgets. 
             * that may not have the 'accordion' region set.
             */
            widget_config := owfGetWidgetDefinition(dashboard_id, accordion_pane_guid, accordion_pane_guid, vwidget_id, 
                                                    vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                                    vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                                    vbutton_id, vbutton_opened, vregion, vstate_position,
                                                    vheight, vwidth, vcolumn_order);
        accordion_width := vwidth;
        accordion_widget_str := accordion_widget_str || widget_config || ',';
        end if;
    end loop;
    close widget_cursor;
    
    /* Build the final config text block. */
    if length(accordion_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        accordion_widget_str := substr(accordion_widget_str, 1, length(accordion_widget_str) - 1) || ']';
    else 
        accordion_widget_str := accordion_widget_str || ']';
    end if;
    if length(top_widget_str) > 0 then
        /* Chop off the last , and close out the config object. */
        right_widget_str := right_widget_str || top_widget_str || ',';
    end if;
    if length(bottom_widget_str) > 0 then
        /* Chop off the last , and close out the config object. */
        right_widget_str := right_widget_str || bottom_widget_str || ',';
    end if;
    if  length(right_widget_str) > 1 then
        /* Chop off the last ',' and close out the config object. */
        right_widget_str := substr(right_widget_str, 1, length(right_widget_str) - 1) || ']';
    else
        right_widget_str := right_widget_str || ']';
    end if;
    
    config := replace(config, accordion_widgets_key, accordion_widget_str);
    config := replace(config, accordion_right_widgets_key, right_widget_str);
    config := replace(config, cast (accordion_width_key as text), cast (accordion_width as text));
    return config;
end; 
$$ language 'plpgsql';

/*
 * PROCEDURE: convertDashboards()
 * This procedure reads OWF 5 data values from the dashboard and dashboar_widget_state tables and 
 * attempts to convert OWF 5 dashboards to OWF 6 dashboards.  It does this by looping over all the
 * dashboard records, pulling their OWF 5 based values and generating an EXT JS Config object that
 * will be placed in the Dashboard.layout_config field introduced in OWF 6.
 */
/*drop function owfConvertDashboards(); */
create or replace function owfConvertDashboards () returns int
as
$$
declare
    current_dash_id int8;
    current_dash_guid varchar(255);
    current_layout varchar(9);
    current_defaults text;
    current_config text := '';
    
    dashboard_cursor cursor is select id, guid, layout, default_settings from dashboard;
begin
    
    /* Open the dashboard cursor. */
    
    open dashboard_cursor;
    loop
    fetch dashboard_cursor into current_dash_id, current_dash_guid, current_layout, current_defaults;
        
    exit when NOT FOUND;
    current_config := 'foo';
    if current_layout = 'accordion' then
        current_config := owfConvertAccordionDashboard(current_dash_id, current_dash_guid);
        update dashboard set layout_config = current_config where id = current_dash_id;
    elsif current_layout = 'desktop' then
        current_config := owfConvertDesktopDashboard(current_dash_id, current_dash_guid, current_defaults);
        update dashboard set layout_config = current_config where id = current_dash_id;
    elsif current_layout = 'portal' then
        current_config := owfConvertPortalDashboard(current_dash_id, current_dash_guid); 
        update dashboard set layout_config = current_config where id = current_dash_id;
    else
        /* Fall-through case. Convert any tabbed dashboards and any unknown custom types to tabbed. */ 
        current_config := owfConvertTabbedDashboard(current_dash_id, current_dash_guid); 
        update dashboard set layout_config = current_config where id = current_dash_id;
    end if;
    end loop;
    close dashboard_cursor;

   return 0;
end;
$$ language 'plpgsql';
    
select owfConvertDashboards();

/* Remove the functions. */
drop function owfGetGuid();
drop function randomHexString(lengh integer);
drop function owfBuildExtParamString (param_name varchar, param_value varchar);
drop function owfBuildExtParamString (param_name varchar, param_value int);
drop function owfBuildExtParamString (param_name varchar, param_value bigint);
drop function owfGetWidgetDefinition(
    dashboard_id bigint, dashboard_guid varchar, 
    pane_guid varchar, widget_id bigint, 
    w_guid varchar, unique_id varchar,
    wname varchar, active bool, x int, y int,
    z_index int,  maximized bool, minimized bool,
    pinned bool, collapsed bool, column_pos int,
    button_id varchar, button_opened bool,
    region varchar, state_position int,
    height int, width int,
    column_order varchar);
drop function owfConvertDesktopDashboard(dashboard_id int8, dashboard_guid varchar, defaults text);
drop function owfConvertTabbedDashboard(dashboard_id int8, dashboard_guid varchar);
drop function owfConvertAccordionDashboard(dashboard_id int8, dashboard_guid varchar);
drop function owfConvertPortalDashboard(dashboard_id int8, dashboard_guid varchar);
drop function owfConvertDashboards();

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Convert OWF 5 style dashboards to OWF 6 style dashboards', NOW(), 'SQL From File', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-60', '2.0.1', '3:6854a81d538da9cad3e7720588cef819', 22);

-- Changeset changelog_6.0.0.groovy::6.0.0-63::owf::(Checksum: 3:09cb669039ed4fb2199da1cc29068b70)
-- upgrade any pwds that were pending approval to use the disabled column
update person_widget_definition pwd
            set disabled = true
            from tag_links taglinks
            where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = false;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'upgrade any pwds that were pending approval to use the disabled column', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-63', '2.0.1', '3:09cb669039ed4fb2199da1cc29068b70', 23);

-- Release Database Lock
