-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 9/21/12 3:44 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_6.0.0.groovy::6.0.0-1::owf::(Checksum: 3:b7a17650e4cfde415fdbbcc4f2bd1317)
-- Add universal_name to widgetdefinition
ALTER TABLE widget_definition ADD universal_name VARCHAR2(255);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add universal_name to widgetdefinition', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-1', '2.0.1', '3:b7a17650e4cfde415fdbbcc4f2bd1317', 1);

-- Changeset changelog_6.0.0.groovy::6.0.0-2::owf::(Checksum: 3:30ea4354058c7a09bfafb6acabfd1e33)
-- Add layoutConfig to dashboard
ALTER TABLE dashboard ADD layout_config CLOB;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add layoutConfig to dashboard', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-2', '2.0.1', '3:30ea4354058c7a09bfafb6acabfd1e33', 2);

-- Changeset changelog_6.0.0.groovy::6.0.0-3::owf::(Checksum: 3:6ce1db42048bc63ece1be0c3f4669a52)
-- Add descriptor_url to widgetdefinition
ALTER TABLE widget_definition ADD descriptor_url VARCHAR2(2083);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add descriptor_url to widgetdefinition', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-3', '2.0.1', '3:6ce1db42048bc63ece1be0c3f4669a52', 3);

-- Changeset changelog_6.0.0.groovy::6.0.0-4::owf::(Checksum: 3:4e940a0bdfea36b98c62330e4b373dd3)
-- Remove EventingConnections table and association with DashboardWidgetState
DROP TABLE eventing_connections;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove EventingConnections table and association with DashboardWidgetState', SYSTIMESTAMP, 'Drop Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-4', '2.0.1', '3:4e940a0bdfea36b98c62330e4b373dd3', 4);

-- Changeset changelog_6.0.0.groovy::6.0.0-5::owf::(Checksum: 3:2c40b74eb7eb29a286ac641320a97b4d)
-- Create intent table
CREATE TABLE intent (id NUMBER(38,0) NOT NULL, version NUMBER(38,0) NOT NULL, action VARCHAR2(255) NOT NULL, CONSTRAINT intentPK PRIMARY KEY (id), UNIQUE (action));

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create intent table', SYSTIMESTAMP, 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-5', '2.0.1', '3:2c40b74eb7eb29a286ac641320a97b4d', 5);

-- Changeset changelog_6.0.0.groovy::6.0.0-6::owf::(Checksum: 3:008f636cf428abbd60459975d28e62a1)
-- Create intent_data_type table
CREATE TABLE intent_data_type (id NUMBER(38,0) NOT NULL, version NUMBER(38,0) NOT NULL, data_type VARCHAR2(255) NOT NULL, CONSTRAINT intent_data_typePK PRIMARY KEY (id));

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create intent_data_type table', SYSTIMESTAMP, 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-6', '2.0.1', '3:008f636cf428abbd60459975d28e62a1', 6);

-- Changeset changelog_6.0.0.groovy::6.0.0-7::owf::(Checksum: 3:b462f738ef9c30634a0a47d245d16a59)
-- Create intent_data_types table
CREATE TABLE intent_data_types (intent_data_type_id NUMBER(38,0) NOT NULL, intent_id NUMBER(38,0) NOT NULL);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create intent_data_types table', SYSTIMESTAMP, 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-7', '2.0.1', '3:b462f738ef9c30634a0a47d245d16a59', 7);

-- Changeset changelog_6.0.0.groovy::6.0.0-8::owf::(Checksum: 3:ee497899a41d5cc2798af5cfc277aecb)
-- Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table
ALTER TABLE intent_data_types ADD CONSTRAINT FK8A59132FD46C6FAA FOREIGN KEY (intent_data_type_id) REFERENCES intent_data_type (id);

ALTER TABLE intent_data_types ADD CONSTRAINT FK8A59D92FD46C6FAA FOREIGN KEY (intent_id) REFERENCES intent (id);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table', SYSTIMESTAMP, 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-8', '2.0.1', '3:ee497899a41d5cc2798af5cfc277aecb', 8);

-- Changeset changelog_6.0.0.groovy::6.0.0-9::owf::(Checksum: 3:8dda2a300eac867527577e37dabf3187)
-- Create widget_def_intent table
CREATE TABLE widget_def_intent (id NUMBER(38,0) NOT NULL, version NUMBER(38,0) NOT NULL, receive NUMBER(1) NOT NULL, send NUMBER(1) NOT NULL, intent_id NUMBER(38,0) NOT NULL, widget_definition_id NUMBER(38,0) NOT NULL, CONSTRAINT widget_def_intentPK PRIMARY KEY (id));

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create widget_def_intent table', SYSTIMESTAMP, 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-9', '2.0.1', '3:8dda2a300eac867527577e37dabf3187', 9);

-- Changeset changelog_6.0.0.groovy::6.0.0-10::owf::(Checksum: 3:e5d364edc24ace7b9b89d3854bb70408)
-- Add foreign constraint for widget_definition_id in widget_def_intent table
ALTER TABLE widget_def_intent ADD CONSTRAINT FK8A59D92FD46C6FAB FOREIGN KEY (widget_definition_id) REFERENCES widget_definition (id);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign constraint for widget_definition_id in widget_def_intent table', SYSTIMESTAMP, 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-10', '2.0.1', '3:e5d364edc24ace7b9b89d3854bb70408', 10);

-- Changeset changelog_6.0.0.groovy::6.0.0-11::owf::(Checksum: 3:fcf69ebd060340afd1483c2f4588f456)
-- Add foreign constraint for intent_id in widget_definition_intent table
ALTER TABLE widget_def_intent ADD CONSTRAINT FK8A59D92FD46C6FAC FOREIGN KEY (intent_id) REFERENCES intent (id);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign constraint for intent_id in widget_definition_intent table', SYSTIMESTAMP, 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-11', '2.0.1', '3:fcf69ebd060340afd1483c2f4588f456', 11);

-- Changeset changelog_6.0.0.groovy::6.0.0-12::owf::(Checksum: 3:05c50cdf2e21818c6986e5ef2d8c9f50)
-- Create widget_def_intent_data_types table
CREATE TABLE widget_def_intent_data_types (intent_data_type_id NUMBER(38,0) NOT NULL, widget_definition_intent_id NUMBER(38,0) NOT NULL);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create widget_def_intent_data_types table', SYSTIMESTAMP, 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-12', '2.0.1', '3:05c50cdf2e21818c6986e5ef2d8c9f50', 12);

-- Changeset changelog_6.0.0.groovy::6.0.0-13::owf::(Checksum: 3:3250f92e3b85fec3db493d11b53445e2)
-- Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table
ALTER TABLE widget_def_intent_data_types ADD CONSTRAINT FK8A59D92FD41A6FAD FOREIGN KEY (intent_data_type_id) REFERENCES intent_data_type (id);

ALTER TABLE widget_def_intent_data_types ADD CONSTRAINT FK8A59D92FD46C6FAD FOREIGN KEY (widget_definition_intent_id) REFERENCES widget_def_intent (id);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table', SYSTIMESTAMP, 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-13', '2.0.1', '3:3250f92e3b85fec3db493d11b53445e2', 13);

-- Changeset changelog_6.0.0.groovy::6.0.0-14::owf::(Checksum: 3:897a5aa2802104b8f90bcde737c47002)
-- Add intentConfig column to dashboard table
ALTER TABLE dashboard ADD intent_config CLOB;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add intentConfig column to dashboard table', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-14', '2.0.1', '3:897a5aa2802104b8f90bcde737c47002', 14);

-- Changeset changelog_6.0.0.groovy::6.0.0-15::owf::(Checksum: 3:a58c7f9ab7dcc8c733d3a16c25adc558)
-- Added description column into Widget Definition table
ALTER TABLE widget_definition ADD description VARCHAR2(255) DEFAULT '';

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Added description column into Widget Definition table', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-15', '2.0.1', '3:a58c7f9ab7dcc8c733d3a16c25adc558', 15);

-- Changeset changelog_6.0.0.groovy::6.0.0-16::owf::(Checksum: 3:9624d22cdbed36b5bbce5da92bdb1bfc)
-- Add groupWidget property to personwidgetdefinition
ALTER TABLE person_widget_definition ADD group_widget NUMBER(1) DEFAULT 0;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add groupWidget property to personwidgetdefinition', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-16', '2.0.1', '3:9624d22cdbed36b5bbce5da92bdb1bfc', 16);

-- Changeset changelog_6.0.0.groovy::6.0.0-17::owf::(Checksum: 3:92a97333d2f7b5f17e0a541712847a54)
-- Add favorite property to personwidgetdefinition
ALTER TABLE person_widget_definition ADD favorite NUMBER(1) DEFAULT 0;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add favorite property to personwidgetdefinition', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-17', '2.0.1', '3:92a97333d2f7b5f17e0a541712847a54', 17);

-- Changeset changelog_6.0.0.groovy::6.0.0-44::owf::(Checksum: 3:a0a7528d5494cd0f02b38b3f99b2cfe4)
ALTER TABLE dashboard MODIFY layout NULL;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', SYSTIMESTAMP, 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-44', '2.0.1', '3:a0a7528d5494cd0f02b38b3f99b2cfe4', 18);

-- Changeset changelog_6.0.0.groovy::6.0.0-53::owf::(Checksum: 3:9f398a44008d12aee688e347940b7adf)
-- Add locked property to dashboard
ALTER TABLE dashboard ADD locked NUMBER(1) DEFAULT 0;

UPDATE dashboard SET locked = 0;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add locked property to dashboard', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-53', '2.0.1', '3:9f398a44008d12aee688e347940b7adf', 19);

-- Changeset changelog_6.0.0.groovy::6.0.0-55::owf::(Checksum: 3:2aa790687f711ca1d930c1aa24fadd0c)
-- Add display name field to pwd
ALTER TABLE person_widget_definition ADD display_name VARCHAR2(256);

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add display name field to pwd', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-55', '2.0.1', '3:2aa790687f711ca1d930c1aa24fadd0c', 20);

-- Changeset changelog_6.0.0.groovy::6.0.0-56::owf::(Checksum: 3:ca86586d796b6e61467c6fc7cb0a787c)
-- Add disabled field to pwd
ALTER TABLE person_widget_definition ADD disabled NUMBER(1) DEFAULT 0;

UPDATE person_widget_definition SET disabled = 0;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add disabled field to pwd', SYSTIMESTAMP, 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-56', '2.0.1', '3:ca86586d796b6e61467c6fc7cb0a787c', 21);

-- Changeset changelog_6.0.0.groovy::6.0.0-59::owf::(Checksum: 3:1636a76fed616e2cd4c43964cf1b4067)
-- Convert OWF 5 style dashboards to OWF 6 style dashboards
/* Create backups of the dashboard and dashboard widget state tables before the conversion. */
create table dashboard_backup as select * from dashboard;
create table dashboard_widget_state_backup as select * from dashboard_widget_state;
 
declare
    /*
     * ACCORDION TEMPLATE 
     * Keys for replacement are ACCORDION_WIDGETS, TOP_RIGHT_WIDGET, BOTTOM_RIGHT_WIDGET
     */
    accordion_template_old clob := '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"ACCORDION_WIDTHpx","items":[],"widgets":ACCORDION_WIDGETS,"paneType":"accordionpane","width":ACCORDION_WIDTH,"defaultSettings":{}},{"xtype":"container","cls":"vbox right","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"tabbedpane","cls":"top","flex":1,"htmlText":"Variable","items":[],"widgets":TOP_RIGHT_WIDGET,"paneType":"tabbedpane","defaultSettings":{}},{"xtype":"tabbedpane","cls":"bottom","htmlText":"BOTTOM_WIDGET_HEIGHTpx","items":[],"paneType":"tabbedpane","height":BOTTOM_WIDGET_HEIGHT,"widgets":BOTTOM_RIGHT_WIDGET,"defaultSettings":{}}],"flex":1}],"flex":3}';
    accordion_template clob := '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"ACCORDION_WIDTHpx","items":[],"widgets":ACCORDION_WIDGETS,"paneType":"accordionpane","defaultSettings":{},"width":ACCORDION_WIDTH},{"xtype":"dashboardsplitter"},{"xtype":"accordionpane","cls":"right","flex":1,"htmlText":"Variable","items":[],"paneType":"accordionpane","widgets":RIGHT_WIDGETS,"defaultSettings":{}}],"flex":3}';
    accordion_widgets_key varchar2(40) := 'ACCORDION_WIDGETS';
    accordion_right_widgets_key varchar2(40) := 'RIGHT_WIDGETS';
    accordion_top_key varchar2(40) := 'TOP_RIGHT_WIDGET';
    accordion_bottom_key varchar2(40) := 'BOTTOM_RIGHT_WIDGET';
    accordion_width_key varchar2(40):= 'ACCORDION_WIDTH';
    accordion_bottom_height_key varchar2(40) :='BOTTOM_WIDGET_HEIGHT';

    /*
     * PORTAL TEMPLATE
     * Keys for replacement are LEFT_PORTAL_WIDGETS, MIDDLE_PORTAL_WIDGETS, RIGHT_PORTAL_WIDGETS
     * The old portals could be 1 2 or 3 columns, called here left, middle, right.
     */
    portal_3_template clob := '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":0.33,"htmlText":"33%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox right","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":MIDDLE_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":RIGHT_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":0.67}],"flex":3}';
    portal_1_template clob := '{"xtype":"portalpane","flex":1,"height":"100%","items":[],"paneType":"portalpane","widgets":LEFT_PORTAL_WIDGETS,"defaultSettings":{}}';
    portal_2_template clob := '{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":MIDDLE_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":3}';
    portal_left_key varchar2(40) := 'LEFT_PORTAL_WIDGETS';
    portal_middle_key varchar2(40) := 'MIDDLE_PORTAL_WIDGETS';
    portal_right_key varchar2(40) := 'RIGHT_PORTAL_WIDGETS';

    /*
     * TABBED TEMPLATE
     * Keys for replacement are TAB_WIDGETS
     */
    tabbed_template clob := '{"xtype":"tabbedpane","flex":1,"height":"100%","items":[],"paneType":"tabbedpane","widgets":TAB_WIDGETS,"defaultSettings":{}}';
    tabbed_key varchar2(40) := 'TAB_WIDGETS';
    
    /*
     * DESKTOP TEMPLATE
     * Keys for replacement are DESKTOP_WIDGETS
     */
    desktop_template clob := '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":DESKTOP_WIDGETS,"defaultSettings":DESKTOP_DEFAULTS}';
    desktop_key varchar2(40) := 'DESKTOP_WIDGETS';
    desktop_defaults_key varchar2(40) := 'DESKTOP_DEFAULTS';

    /* owfGetGuid - Declare a function that generates appropriate system uuids. */
    procedure owfGetGuid (guid out varchar2)
    is
    begin
       select substr(sys_guid(),1,8)||'-'||substr(sys_guid(),9,4)||'-'||substr(sys_guid(),13,4)||'-'||substr(sys_guid(),17,4)||'-'||substr(sys_guid(),20) into guid from dual;
    end;
    
    /* owfBuildExtParamString - a simple function for creating a json parameter string. */
    procedure owfBuildExtParamString (param_name in varchar2, param_value in varchar2, param out varchar2)
    is
    begin
        param := '"' || param_name || '":"' || param_value || '"';
    end;
        
    procedure owfGetWidgetDefinition(
        dashboard_id in number, dashboard_guid in varchar2, 
        pane_guid in varchar2, widget_id in number, 
        widget_guid in varchar2, unique_id in varchar2,
        wname in varchar2, active in number, x in number, y in number,
        z_index in number,  maximized in number, minimized in number,
        pinned in number, collapsed in number, column_pos in number,
        button_id in varchar2, button_opened in number,
        region in varchar2, state_position in number,
        height in number, width in number,
        column_order in varchar2,
        config out clob)
    is
        singleton number(1,0);
        param varchar2(1024);
    begin
       /* insert into conversion_logs (msg) values (concat('Createing widget config for: ', unique_id)); */
       /* Get the widget */
       begin
           select w.singleton into singleton from widget_definition w where w.widget_guid = widget_guid;
       exception
           when TOO_MANY_ROWS THEN
               singleton := 0;
           when NO_DATA_FOUND THEN
               singleton := 0;
       end;

        config := '{';
        if length(widget_guid) > 0 then
            owfBuildExtParamString('widgetGuid', widget_guid, param);
            config := config || param || ',';
        else
            config := config || '"widgetGuid":null,';
        end if;
        
        owfBuildExtParamString('uniqueId', unique_id, param);
        config := config || param || ',';
        owfBuildExtParamString('dashboardGuid', dashboard_guid, param);
        config := config || param || ',';
        owfBuildExtParamString('paneGuid', pane_guid, param);
        config := config || param || ',';
        owfBuildExtParamString('name', wname, param);
        config := config || param || ',';
        if (active != 0) then
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
        if (maximized != 0) then
            config := config || '"maximized":true,';
        else
            config := config || '"maximized":false,';
        end if;
        if (minimized != 0) then
            config := config || '"minimized":true,';
        else
            config := config || '"minimized":false,';
        end if;
        if (pinned != 0) then
            config := config || '"pinned":true,';
        else
            config := config || '"pinned":false,';
        end if;
        config := config || param || ',';
        if (collapsed != 0) then
            config := config || '"collapsed":true,';
        else
            config := config || '"collapsed":false,';
        end if;
        param := '"columnPos":' || column_pos;
        config := config || param || ',';
        if button_id != null then
            owfBuildExtParamString('buttonId', button_id, param);
            config := config || param || ',';
        else
            config := concat(config, '"buttonId":"",');
        end if;
        if (button_opened != 0) then
            config := config || '"buttonOpened":true,';
        else
            config := config || '"buttonOpened":false,';
        end if;
        owfBuildExtParamString('region', region, param);
        config := config || param || ',';
        param := '"statePosition":' || state_position;
        config := config || param || ',';
        if (singleton != 0) then
            config := config || '"singleton":true,';
        else
            config := config || '"singleton":false,';
        end if;
        param := '"height":' || height;
        config := config || param || ',';
        param := '"width":' || width;
        config := config || param || ',';
        owfBuildExtParamString('columnOrder', '', param);
        config := config || param || ',';
        config := substr(config, 1, length(config) - 1);
        config := config || '}';
    end;

    /* Convert Desktop Dashboards */
    procedure owfConvertDesktopDashboard(dashboard_id in number, dashboard_guid in varchar2, defaults in clob, config out clob)
    is
        vwidget_guid varchar2(255);
        vunique_id varchar2(255);
        vname varchar2(200);
        vactive number(1,0);
        vx number(10, 0);
        vy number(10, 0);
        vz_index number(10, 0);
        vmaximized number(1,0);
        vminimized number(1,0);
        vpinned number(1,0);
        vcollapsed number(1,0);
        vcolumn_pos number(10, 0);
        vbutton_id varchar2(255);
        vbutton_opened number(1,0);
        vregion varchar2(15);
        vstate_position number(10,0);
        vsingleton number(1,0);
        vheight number(10, 0);
        vwidth number(10, 0);
        vcolumn_order varchar2(15);
        vwidget_id number(19, 0);
        vwidget_unique_id varchar2(255);
        widget_config varchar2(4096);
        desktop_widget_str clob;
        desktop_pane_guid varchar2(255);
        cursor widget_cursor(cursor_dash_id number) is 
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
        owfGetGuid(desktop_pane_guid);
        
        /* Open the widgets cursor. */
        /*insert into conversion_logs (msg) values (concat('Opening widget cursor for dashboard ', dashboard_id)); */
        open widget_cursor(dashboard_id);
        loop
            fetch widget_cursor into vwidget_id, vunique_id, vregion,
                                     vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
                                     vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
                                     vheight, vwidth;       
            exit when widget_cursor%NOTFOUND;
             
            /*insert into conversion_logs (msg) values (concat('Adding desktop widget ', vunique_id));*/
            owfGetWidgetDefinition(dashboard_id, dashboard_guid, desktop_pane_guid, vwidget_id, 
                                   vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                   vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                   vbutton_id, vbutton_opened, vregion, vstate_position,
                                   vheight, vwidth, vcolumn_order,
                                   widget_config);
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
    end; 

    /* Convert Tabbed Dashboards */
    procedure owfConvertTabbedDashboard(dashboard_id in number, dashboard_guid in varchar2, config out clob)
    is
        vwidget_guid varchar2(255);
        vunique_id varchar2(255);
        vname varchar2(200);
        vactive number(1,0);
        vx number(10, 0);
        vy number(10, 0);
        vz_index number(10, 0);
        vmaximized number(1,0);
        vminimized number(1,0);
        vpinned number(1,0);
        vcollapsed number(1,0);
        vcolumn_pos number(10, 0);
        vbutton_id varchar2(255);
        vbutton_opened number(1,0);
        vregion varchar2(15);
        vstate_position number(10,0);
        vsingleton number(1,0);
        vheight number(10, 0);
        vwidth number(10, 0);
        vcolumn_order varchar2(15);
        vwidget_id number(19, 0);
        vwidget_unique_id varchar2(255);
        widget_config varchar2(4096);
        tab_widget_str clob; 
        tab_pane_guid varchar2(255);
        cursor widget_cursor(cursor_dash_id number) is 
            select id, unique_id, region,
                   widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
                   column_pos, button_id, button_opened, state_position, height, width
            from dashboard_widget_state 
            where dashboard_widget_state.dashboard_id = cursor_dash_id
            order by state_position;
    begin
       /* Start the config string. */
        config := tabbed_template;
        tab_widget_str := '[';
        widget_config := '';
        
        /* Get a uuid for the desktop pane. */
        owfGetGuid(tab_pane_guid);
        
        /* Open the widgets cursor. */
        /*insert into conversion_logs (msg) values (concat('Opening widget cursor for dashboard ', dashboard_id)); */
        open widget_cursor(dashboard_id);
        loop
            fetch widget_cursor into vwidget_id, vunique_id, vregion,
                                     vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
                                     vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
                                     vheight, vwidth;
                        
            exit when widget_cursor%NOTFOUND;
            /*insert into conversion_logs (msg) values (concat('Adding desktop widget ', vunique_id));*/
            owfGetWidgetDefinition(dashboard_id, dashboard_guid, tab_pane_guid, vwidget_id, 
                                   vwidget_guid, vunique_id, vname, vactive, 0, 0, 0,
                                   vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                   vbutton_id, vbutton_opened, vregion, vstate_position,
                                   vheight, vwidth, vcolumn_order,
                                   widget_config);
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
        /* insert into conversion_logs (msg) values ('Generated a desktop dashboard config. '); */
    end; 

    /* Convert Portal Dashboards */
    procedure owfConvertPortalDashboard(dashboard_id in number, dashboard_guid in varchar2, config out clob)
    is
        vwidget_guid varchar2(255);
        vunique_id varchar2(255);
        vname varchar2(200);
        vactive number(1,0);
        vx number(10, 0);
        vy number(10, 0);
        vz_index number(10, 0);
        vmaximized number(1,0);
        vminimized number(1,0);
        vpinned number(1,0);
        vcollapsed number(1,0);
        vcolumn_pos number(10, 0);
        vbutton_id varchar2(255);
        vbutton_opened number(1,0);
        vregion varchar2(15);
        vstate_position number(10,0);
        vsingleton number(1,0);
        vheight number(10, 0);
        vwidth number(10, 0);
        vcolumn_order varchar2(15);
        vwidget_id number(19, 0);
        vwidget_unique_id varchar2(255);
        widget_config varchar2(4096);
        portal_widget_str clob;
        left_widget_str clob;
        middle_widget_str clob;
        right_widget_str clob;
        left_pane_guid varchar2(255);
        middle_pane_guid varchar2(255);
        right_pane_guid varchar2(255);
        max_column number := 0;
        temp_id number := 0;
        cursor widget_cursor(cursor_dash_id number) is 
            select id, unique_id, region,
                   widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
                   column_pos, button_id, button_opened, state_position, height, width
            from dashboard_widget_state 
            where dashboard_widget_state.dashboard_id = cursor_dash_id
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
        owfGetGuid(left_pane_guid);
        owfGetGuid(middle_pane_guid);
        owfGetGuid(right_pane_guid);
        
        /* Get the number of columns in this portal dashboard. */
        begin
           temp_id := dashboard_id;
           select max(w.column_pos) into max_column from dashboard_widget_state w where w.dashboard_id = temp_id;
        exception
            when TOO_MANY_ROWS THEN
                max_column := 0;
            when NO_DATA_FOUND THEN
                max_column := 0;
        end;

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
                        
            exit when widget_cursor%NOTFOUND;

            /* Insert widgets into the appropriate column.  Any widgets not in 
             * a second or third column default to the first column; this includes
             * background widgets.
             */
            if vcolumn_pos = '1' then
                owfGetWidgetDefinition(dashboard_id, dashboard_guid, middle_pane_guid, vwidget_id, 
                                       vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                       vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                       vbutton_id, vbutton_opened, vregion, vstate_position,
                                       vheight, vwidth, vcolumn_order,
                                       widget_config);
                middle_widget_str := middle_widget_str || widget_config || ',';
            elsif vcolumn_pos = '2' then
                owfGetWidgetDefinition(dashboard_id, dashboard_guid, right_pane_guid, vwidget_id, 
                                       vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                       vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                       vbutton_id, vbutton_opened, vregion, vstate_position,
                                       vheight, vwidth, vcolumn_order,
                                       widget_config);
                right_widget_str := right_widget_str || widget_config || ',';
            else 
                owfGetWidgetDefinition(dashboard_id, dashboard_guid, left_pane_guid, vwidget_id, 
                                       vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                       vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                       vbutton_id, vbutton_opened, vregion, vstate_position,
                                       vheight, vwidth, vcolumn_order,
                                       widget_config);
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
    end;

    /* Convert Accordion Dashboards */
    procedure owfConvertAccordionDashboard(dashboard_id in number, dashboard_guid in varchar2, config out clob)
    is
        vwidget_guid varchar2(255);
        vunique_id varchar2(255);
        vname varchar2(200);
        vactive number(1,0);
        vx number(10, 0);
        vy number(10, 0);
        vz_index number(10, 0);
        vmaximized number(1,0);
        vminimized number(1,0);
        vpinned number(1,0);
        vcollapsed number(1,0);
        vcolumn_pos number(10, 0);
        vbutton_id varchar2(255);
        vbutton_opened number(1,0);
        vregion varchar2(15);
        vstate_position number(10,0);
        vsingleton number(1,0);
        vheight number(10, 0);
        vwidth number(10, 0);
        vcolumn_order varchar2(15);
        vwidget_id number(19, 0);
        vwidget_unique_id varchar2(255);
        widget_config varchar2(4096);
        accordion_widget_str clob;
        right_widget_str clob;
        top_widget_str clob;
        bottom_widget_str clob;
        accordion_pane_guid varchar2(255);
        right_pane_guid varchar2(255);
        top_pane_guid varchar2(255);
        bottom_pane_guid varchar2(255);
        bottom_widget_height number(10,0) := 125;
        accordion_width number(10,0) := 225;

        cursor widget_cursor(cursor_dash_id number) is 
            select id, unique_id, region,
                   widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
                   column_pos, button_id, button_opened, state_position, height, width
            from dashboard_widget_state 
            where dashboard_widget_state.dashboard_id = cursor_dash_id
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
        owfGetGuid(accordion_pane_guid);
        owfGetGuid(right_pane_guid);
        
        /* Open the widgets cursor. */
        open widget_cursor(dashboard_id);
        loop
            fetch widget_cursor into vwidget_id, vunique_id, vregion,
                                     vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
                                     vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
                                     vheight, vwidth;
                        
            exit when widget_cursor%NOTFOUND;
                    
            if vregion = 'center' then
                /*insert into conversion_logs (msg) values (concat('Adding middle portal widget ', vunique_id));*/
                owfGetWidgetDefinition(dashboard_id, dashboard_guid, top_pane_guid, vwidget_id, 
                                       vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                       vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                       vbutton_id, vbutton_opened, vregion, vstate_position,
                                       vheight, vwidth, vcolumn_order,
                                       widget_config);
                top_widget_str := widget_config;
            elsif vregion = 'south' then
                owfGetWidgetDefinition(dashboard_id, dashboard_guid, bottom_pane_guid, vwidget_id, 
                                       vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                       vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                       vbutton_id, vbutton_opened, vregion, vstate_position,
                                       vheight, vwidth, vcolumn_order,
                                       widget_config);
                bottom_widget_height := vheight;
                bottom_widget_str := widget_config;
            else
                /* Throw the widget in the accordion pane in the new format. This includes background widgets. 
                 * that may not have the 'accordion' region set.
                 */
                owfGetWidgetDefinition(dashboard_id, dashboard_guid, accordion_pane_guid, vwidget_id, 
                                       vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                                       vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                                       vbutton_id, vbutton_opened, vregion, vstate_position,
                                       vheight, vwidth, vcolumn_order,
                                       widget_config);
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
            right_widget_str := right_widget_str || top_widget_str || ',';
        end if;
	    if length(bottom_widget_str) > 0 then
	        right_widget_str := right_widget_str || bottom_widget_str || ',';
	    end if;
	    if  length(right_widget_str) > 1 then
	        /* Chop off the last ',' and close out the config object. */
	        right_widget_str := substr(right_widget_str, 1, length(right_widget_str) - 1) || ']';
	    else
	        right_widget_str := right_widget_str || ']';
	    end if;
        
        
        config := replace(config, accordion_widgets_key, accordion_widget_str);
        config := replace(config, accordion_widgets_key, accordion_widget_str);
        config := replace(config, accordion_right_widgets_key, right_widget_str);
        config := replace(config, accordion_width_key, accordion_width);
    end; 

    /*
     * PROCEDURE: convertDashboards()
     * This procedure reads OWF 5 data values from the dashboard and dashboar_widget_state tables and 
     * attempts to convert OWF 5 dashboards to OWF 6 dashboards.  It does this by looping over all the
     * dashboard records, pulling their OWF 5 based values and generating an EXT JS Config object that
     * will be placed in the Dashboard.layout_config field introduced in OWF 6.
     */
    procedure owfConvertDashboards
    is
        current_dash_id number(19, 0);
        current_dash_guid varchar2(255);
        current_layout varchar2(9);
        current_defaults clob;
        current_config clob;
    
        cursor dashboard_cursor is select id, guid, layout, default_settings from dashboard;
    begin
    
        /*insert into conversion_logs (msg) values ('Opening dashboard cursor');*/
        /* Open the dashboard cursor. */
        open dashboard_cursor;
        loop
            fetch dashboard_cursor into current_dash_id, current_dash_guid, current_layout, current_defaults;
                        
            exit when dashboard_cursor%NOTFOUND;

            if current_layout = 'accordion' then
                owfConvertAccordionDashboard(current_dash_id, current_dash_guid, current_config);
                update dashboard set dashboard.layout_config = current_config where dashboard.id = current_dash_id;
            elsif current_layout = 'desktop' then
                owfConvertDesktopDashboard(current_dash_id, current_dash_guid, current_defaults, current_config); 
                update dashboard set dashboard.layout_config = current_config where dashboard.id = current_dash_id;
            elsif current_layout = 'portal' then
                owfConvertPortalDashboard(current_dash_id, current_dash_guid, current_config); 
                update dashboard set dashboard.layout_config = current_config where dashboard.id = current_dash_id;
            else
                /* Fall-through case. Convert any tabbed dashboards and any unknown custom types to tabbed. */ 
                owfConvertTabbedDashboard(current_dash_id, current_dash_guid, current_config); 
                update dashboard set dashboard.layout_config = current_config where dashboard.id = current_dash_id;
            end if;
        end loop;
        close dashboard_cursor;
    
    end;
begin
    owfConvertDashboards();
end;
/
/* Ending with a basic sql command so liquibase doesn't add trailing semi-colons. */
select 'Conversion Completed' from dual;

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Convert OWF 5 style dashboards to OWF 6 style dashboards', SYSTIMESTAMP, 'SQL From File', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-59', '2.0.1', '3:1636a76fed616e2cd4c43964cf1b4067', 22);

-- Changeset changelog_6.0.0.groovy::6.0.0-63::owf::(Checksum: 3:ac6187e64b8b8b98e880da00e25f9f77)
-- upgrade any pwds that were pending approval to use the disabled column
update person_widget_definition pwd
            set pwd.disabled = 1
            where pwd.id in (
                      select pwd.id
                      from person_widget_definition pwd, tag_links taglinks
                      where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = 0
            );

INSERT INTO DATABASECHANGELOG (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'upgrade any pwds that were pending approval to use the disabled column', SYSTIMESTAMP, 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-63', '2.0.1', '3:ac6187e64b8b8b98e880da00e25f9f77', 23);

-- Release Database Lock
