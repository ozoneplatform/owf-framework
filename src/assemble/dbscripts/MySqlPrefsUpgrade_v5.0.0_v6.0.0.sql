-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 9/21/12 3:33 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_6.0.0.groovy::6.0.0-1::owf::(Checksum: 3:b7a17650e4cfde415fdbbcc4f2bd1317)
-- Add universal_name to widgetdefinition
ALTER TABLE `widget_definition` ADD `universal_name` VARCHAR(255);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add universal_name to widgetdefinition', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-1', '2.0.1', '3:b7a17650e4cfde415fdbbcc4f2bd1317', 1);

-- Changeset changelog_6.0.0.groovy::6.0.0-2::owf::(Checksum: 3:30ea4354058c7a09bfafb6acabfd1e33)
-- Add layoutConfig to dashboard
ALTER TABLE `dashboard` ADD `layout_config` TEXT;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add layoutConfig to dashboard', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-2', '2.0.1', '3:30ea4354058c7a09bfafb6acabfd1e33', 2);

-- Changeset changelog_6.0.0.groovy::6.0.0-3::owf::(Checksum: 3:6ce1db42048bc63ece1be0c3f4669a52)
-- Add descriptor_url to widgetdefinition
ALTER TABLE `widget_definition` ADD `descriptor_url` VARCHAR(2083);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add descriptor_url to widgetdefinition', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-3', '2.0.1', '3:6ce1db42048bc63ece1be0c3f4669a52', 3);

-- Changeset changelog_6.0.0.groovy::6.0.0-4::owf::(Checksum: 3:4e940a0bdfea36b98c62330e4b373dd3)
-- Remove EventingConnections table and association with DashboardWidgetState
DROP TABLE `eventing_connections`;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Remove EventingConnections table and association with DashboardWidgetState', NOW(), 'Drop Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-4', '2.0.1', '3:4e940a0bdfea36b98c62330e4b373dd3', 4);

-- Changeset changelog_6.0.0.groovy::6.0.0-5::owf::(Checksum: 3:2c40b74eb7eb29a286ac641320a97b4d)
-- Create intent table
CREATE TABLE `intent` (`id` BIGINT AUTO_INCREMENT  NOT NULL, `version` BIGINT NOT NULL, `action` VARCHAR(255) NOT NULL, CONSTRAINT `intentPK` PRIMARY KEY (`id`), UNIQUE (`action`)) ENGINE=InnoDB;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Create intent table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-5', '2.0.1', '3:2c40b74eb7eb29a286ac641320a97b4d', 5);

-- Changeset changelog_6.0.0.groovy::6.0.0-6::owf::(Checksum: 3:008f636cf428abbd60459975d28e62a1)
-- Create intent_data_type table
CREATE TABLE `intent_data_type` (`id` BIGINT AUTO_INCREMENT  NOT NULL, `version` BIGINT NOT NULL, `data_type` VARCHAR(255) NOT NULL, CONSTRAINT `intent_data_typePK` PRIMARY KEY (`id`)) ENGINE=InnoDB;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Create intent_data_type table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-6', '2.0.1', '3:008f636cf428abbd60459975d28e62a1', 6);

-- Changeset changelog_6.0.0.groovy::6.0.0-7::owf::(Checksum: 3:b462f738ef9c30634a0a47d245d16a59)
-- Create intent_data_types table
CREATE TABLE `intent_data_types` (`intent_data_type_id` BIGINT NOT NULL, `intent_id` BIGINT NOT NULL) ENGINE=InnoDB;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Create intent_data_types table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-7', '2.0.1', '3:b462f738ef9c30634a0a47d245d16a59', 7);

-- Changeset changelog_6.0.0.groovy::6.0.0-8::owf::(Checksum: 3:ee497899a41d5cc2798af5cfc277aecb)
-- Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table
ALTER TABLE `intent_data_types` ADD CONSTRAINT `FK8A59132FD46C6FAA` FOREIGN KEY (`intent_data_type_id`) REFERENCES `intent_data_type` (`id`);

ALTER TABLE `intent_data_types` ADD CONSTRAINT `FK8A59D92FD46C6FAA` FOREIGN KEY (`intent_id`) REFERENCES `intent` (`id`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table', NOW(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-8', '2.0.1', '3:ee497899a41d5cc2798af5cfc277aecb', 8);

-- Changeset changelog_6.0.0.groovy::6.0.0-9::owf::(Checksum: 3:8dda2a300eac867527577e37dabf3187)
-- Create widget_def_intent table
CREATE TABLE `widget_def_intent` (`id` BIGINT AUTO_INCREMENT  NOT NULL, `version` BIGINT NOT NULL, `receive` TINYINT(1) NOT NULL, `send` TINYINT(1) NOT NULL, `intent_id` BIGINT NOT NULL, `widget_definition_id` BIGINT NOT NULL, CONSTRAINT `widget_def_intentPK` PRIMARY KEY (`id`)) ENGINE=InnoDB;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Create widget_def_intent table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-9', '2.0.1', '3:8dda2a300eac867527577e37dabf3187', 9);

-- Changeset changelog_6.0.0.groovy::6.0.0-10::owf::(Checksum: 3:e5d364edc24ace7b9b89d3854bb70408)
-- Add foreign constraint for widget_definition_id in widget_def_intent table
ALTER TABLE `widget_def_intent` ADD CONSTRAINT `FK8A59D92FD46C6FAB` FOREIGN KEY (`widget_definition_id`) REFERENCES `widget_definition` (`id`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add foreign constraint for widget_definition_id in widget_def_intent table', NOW(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-10', '2.0.1', '3:e5d364edc24ace7b9b89d3854bb70408', 10);

-- Changeset changelog_6.0.0.groovy::6.0.0-11::owf::(Checksum: 3:fcf69ebd060340afd1483c2f4588f456)
-- Add foreign constraint for intent_id in widget_definition_intent table
ALTER TABLE `widget_def_intent` ADD CONSTRAINT `FK8A59D92FD46C6FAC` FOREIGN KEY (`intent_id`) REFERENCES `intent` (`id`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add foreign constraint for intent_id in widget_definition_intent table', NOW(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-11', '2.0.1', '3:fcf69ebd060340afd1483c2f4588f456', 11);

-- Changeset changelog_6.0.0.groovy::6.0.0-12::owf::(Checksum: 3:05c50cdf2e21818c6986e5ef2d8c9f50)
-- Create widget_def_intent_data_types table
CREATE TABLE `widget_def_intent_data_types` (`intent_data_type_id` BIGINT NOT NULL, `widget_definition_intent_id` BIGINT NOT NULL) ENGINE=InnoDB;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Create widget_def_intent_data_types table', NOW(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-12', '2.0.1', '3:05c50cdf2e21818c6986e5ef2d8c9f50', 12);

-- Changeset changelog_6.0.0.groovy::6.0.0-13::owf::(Checksum: 3:3250f92e3b85fec3db493d11b53445e2)
-- Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table
ALTER TABLE `widget_def_intent_data_types` ADD CONSTRAINT `FK8A59D92FD41A6FAD` FOREIGN KEY (`intent_data_type_id`) REFERENCES `intent_data_type` (`id`);

ALTER TABLE `widget_def_intent_data_types` ADD CONSTRAINT `FK8A59D92FD46C6FAD` FOREIGN KEY (`widget_definition_intent_id`) REFERENCES `widget_def_intent` (`id`);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table', NOW(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-13', '2.0.1', '3:3250f92e3b85fec3db493d11b53445e2', 13);

-- Changeset changelog_6.0.0.groovy::6.0.0-14::owf::(Checksum: 3:897a5aa2802104b8f90bcde737c47002)
-- Add intentConfig column to dashboard table
ALTER TABLE `dashboard` ADD `intent_config` TEXT;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add intentConfig column to dashboard table', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-14', '2.0.1', '3:897a5aa2802104b8f90bcde737c47002', 14);

-- Changeset changelog_6.0.0.groovy::6.0.0-15::owf::(Checksum: 3:a58c7f9ab7dcc8c733d3a16c25adc558)
-- Added description column into Widget Definition table
ALTER TABLE `widget_definition` ADD `description` VARCHAR(255) DEFAULT '';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Added description column into Widget Definition table', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-15', '2.0.1', '3:a58c7f9ab7dcc8c733d3a16c25adc558', 15);

-- Changeset changelog_6.0.0.groovy::6.0.0-16::owf::(Checksum: 3:9624d22cdbed36b5bbce5da92bdb1bfc)
-- Add groupWidget property to personwidgetdefinition
ALTER TABLE `person_widget_definition` ADD `group_widget` TINYINT(1) DEFAULT 0;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add groupWidget property to personwidgetdefinition', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-16', '2.0.1', '3:9624d22cdbed36b5bbce5da92bdb1bfc', 16);

-- Changeset changelog_6.0.0.groovy::6.0.0-17::owf::(Checksum: 3:92a97333d2f7b5f17e0a541712847a54)
-- Add favorite property to personwidgetdefinition
ALTER TABLE `person_widget_definition` ADD `favorite` TINYINT(1) DEFAULT 0;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add favorite property to personwidgetdefinition', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-17', '2.0.1', '3:92a97333d2f7b5f17e0a541712847a54', 17);

-- Changeset changelog_6.0.0.groovy::6.0.0-44::owf::(Checksum: 3:a0a7528d5494cd0f02b38b3f99b2cfe4)
ALTER TABLE `dashboard` MODIFY `layout` VARCHAR(9) NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-44', '2.0.1', '3:a0a7528d5494cd0f02b38b3f99b2cfe4', 18);

-- Changeset changelog_6.0.0.groovy::6.0.0-53::owf::(Checksum: 3:9f398a44008d12aee688e347940b7adf)
-- Add locked property to dashboard
ALTER TABLE `dashboard` ADD `locked` TINYINT(1) DEFAULT 0;

UPDATE `dashboard` SET `locked` = 0;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add locked property to dashboard', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-53', '2.0.1', '3:9f398a44008d12aee688e347940b7adf', 19);

-- Changeset changelog_6.0.0.groovy::6.0.0-55::owf::(Checksum: 3:2aa790687f711ca1d930c1aa24fadd0c)
-- Add display name field to pwd
ALTER TABLE `person_widget_definition` ADD `display_name` VARCHAR(256);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add display name field to pwd', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-55', '2.0.1', '3:2aa790687f711ca1d930c1aa24fadd0c', 20);

-- Changeset changelog_6.0.0.groovy::6.0.0-56::owf::(Checksum: 3:ca86586d796b6e61467c6fc7cb0a787c)
-- Add disabled field to pwd
ALTER TABLE `person_widget_definition` ADD `disabled` TINYINT(1) DEFAULT 0;

UPDATE `person_widget_definition` SET `disabled` = 0;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add disabled field to pwd', NOW(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-56', '2.0.1', '3:ca86586d796b6e61467c6fc7cb0a787c', 21);

-- Changeset changelog_6.0.0.groovy::6.0.0-58::owf::(Checksum: 3:4c8648a306680db39923e41418aa9724)
-- Convert OWF 5 style dashboards to OWF 6 style dashboards
/*
 * ACCORDION TEMPLATE 
 * Keys for replacement are ACCORDION_WIDGETS, TOP_RIGHT_WIDGET, BOTTOM_RIGHT_WIDGET
 */
set @accordion_template = '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"ACCORDION_WIDTHpx","items":[],"widgets":ACCORDION_WIDGETS,"paneType":"accordionpane","defaultSettings":{},"width":ACCORDION_WIDTH},{"xtype":"dashboardsplitter"},{"xtype":"accordionpane","cls":"right","flex":1,"htmlText":"Variable","items":[],"paneType":"accordionpane","widgets":RIGHT_WIDGETS,"defaultSettings":{}}],"flex":3}';
set @accordion_widgets_key = 'ACCORDION_WIDGETS';
set @accordion_right_widgets_key = 'RIGHT_WIDGETS';
set @accordion_top_key = 'TOP_RIGHT_WIDGET';
set @accordion_bottom_key = 'BOTTOM_RIGHT_WIDGET';
set @accordion_width_key = 'ACCORDION_WIDTH';
set @accordion_bottom_height_key ='BOTTOM_WIDGET_HEIGHT';

/*
 * PORTAL TEMPLATE
 * Keys for replacement are LEFT_PORTAL_WIDGETS, CENTER_PORTAL_WIDGETS, RIGHT_PORTAL_WIDGETS
 */
set @portal_3_template = '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":0.33,"htmlText":"33%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox right","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":MIDDLE_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":RIGHT_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":0.67}],"flex":3}';
set @portal_1_template = '{"xtype":"portalpane","flex":1,"height":"100%","items":[],"paneType":"portalpane","widgets":LEFT_PORTAL_WIDGETS,"defaultSettings":{}}';
set @portal_2_template = '{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":MIDDLE_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":3}';
set @portal_left_key = 'LEFT_PORTAL_WIDGETS';
set @portal_middle_key = 'MIDDLE_PORTAL_WIDGETS';
set @portal_right_key = 'RIGHT_PORTAL_WIDGETS';

/*
 * TABBED TEMPLATE
 * Keys for replacement are TAB_WIDGETS
 */
set @tabbed_template = '{"xtype":"tabbedpane","flex":1,"height":"100%","items":[],"paneType":"tabbedpane","widgets":TAB_WIDGETS,"defaultSettings":{}}';
set @tabbed_key = 'TAB_WIDGETS';

/*
 * DESKTOP TEMPLATE
 * Keys for replacement are DESKTOP_WIDGETS
 */
set @desktop_template = '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":DESKTOP_WIDGETS,"defaultSettings":DESKTOP_DEFAULTS}';
set @desktop_key = 'DESKTOP_WIDGETS';
set @desktop_defaults_key = 'DESKTOP_DEFAULTS';

/* Setup log table and any temp tables for processing. */
drop table if exists new_dashboard_configs;
create table new_dashboard_configs (id bigint not null, config text, primary key (id));

/* Create backups of the dashboard and dashboard widget state tables before the conversion. */
create table dashboard_backup LIKE dashboard; 
insert dashboard_backup select * from dashboard;
create table dashboard_widget_state_backup LIKE dashboard_widget_state; 
insert dashboard_widget_state_backup select * from dashboard_widget_state;

/* Drop any old versions of the stored procedures contained herein. */
drop procedure if exists owfConvertAccordionDashboard;
drop procedure if exists owfGetWidgetDefinition;
drop procedure if exists owfConvertDashboards;
drop procedure if exists owfBuildExtParamString;
drop procedure if exists owfConvertPortalDashboard;
drop procedure if exists owfConvertTabbedDashboard;
drop procedure if exists owfConvertDesktopDashboard;

/* Define the convertDashboard stored procedure */
delimiter //

create procedure owfConvertDesktopDashboard(in dashboard_id bigint, in dashboard_guid varchar(255), in defaults text, 
                                            out config text)
begin
    declare vwidget_guid varchar(255);
    declare vunique_id varchar(255);
    declare vname varchar(200);
    declare vactive bit;
    declare vx int;
    declare vy int;
    declare vz_index int;
    declare vmaximized bit;
    declare vminimized bit;
    declare vpinned bit;
    declare vcollapsed bit;
    declare vcolumn_pos int;
    declare vbutton_id varchar(255);
    declare vbutton_opened bit;
    declare vregion varchar(15);
    declare vstate_position int;
    declare vsingleton bit;
    declare vheight int;
    declare vwidth int;
    declare vcolumn_order varchar(15);
    declare vwidget_id bigint;
    declare vwidget_unique_id varchar(255);
    declare widget_config text(4096);
    declare desktop_widget_str text; /*  This should probably be smaller than config since it will be stuffed in config.  */
    declare desktop_pane_guid varchar(255) default UUID();

    /* Create a cursor and loop over the matching widget states for this dashboard. */
    declare no_more_widgets int default 0;

    declare widget_cursor cursor for 
        select id, unique_id, region,
               widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
               column_pos, button_id, button_opened, state_position, height, width
        from dashboard_widget_state 
        where dashboard_widget_state.dashboard_id = dashboard_id
        order by button_id, state_position;
    declare continue handler for not found
        set no_more_widgets = 1;

    set config = @desktop_template;
    set desktop_widget_str = '[';
    set widget_config = '';
    
    /* Open the widgets cursor. */
    open widget_cursor;

    WIDGET_LOOP: loop
        set no_more_widgets = 0;
        fetch widget_cursor into vwidget_id, vunique_id, vregion,
                                 vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
                                 vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
                                 vheight, vwidth;

        /* Test for no more records. */
        if no_more_widgets then
            close widget_cursor;
            leave WIDGET_LOOP;
        end if;

        call owfGetWidgetDefinition(dashboard_id, dashboard_guid, desktop_pane_guid, vwidget_id, 
                            vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                            vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                            vbutton_id, vbutton_opened, vregion, vstate_position,
                            vheight, vwidth, vcolumn_order,
                            widget_config);
        set desktop_widget_str = concat(desktop_widget_str, widget_config, ',');
    
    /* For each widget in that dashboard, assign it to the correct widget list. */

    end loop WIDGET_LOOP;

    /* Build the final config text block. */
    if length(desktop_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        set desktop_widget_str = concat(substring(desktop_widget_str, 1, length(desktop_widget_str) - 1), ']');
    else 
        set desktop_widget_str = concat(desktop_widget_str, ']');
    end if;

    set config = replace(config, @desktop_key, desktop_widget_str);
    
    if isnull(defaults) then
        set config = replace(config, @desktop_defaults_key, '{}');
    else
        set config = replace(config, @desktop_defaults_key, defaults);
    end if;
end; //

create procedure owfConvertTabbedDashboard(in dashboard_id bigint, in dashboard_guid varchar(255), out config text)
begin
    declare vwidget_guid varchar(255);
    declare vunique_id varchar(255);
    declare vname varchar(200);
    declare vactive bit;
    declare vx int;
    declare vy int;
    declare vz_index int;
    declare vmaximized bit;
    declare vminimized bit;
    declare vpinned bit;
    declare vcollapsed bit;
    declare vcolumn_pos int;
    declare vbutton_id varchar(255);
    declare vbutton_opened bit;
    declare vregion varchar(15);
    declare vstate_position int;
    declare vsingleton bit;
    declare vheight int;
    declare vwidth int;
    declare vcolumn_order varchar(15);
    declare vwidget_id bigint;
    declare vwidget_unique_id varchar(255);
    declare widget_config text(4096);
    declare cur_state_pos INT;
    declare tab_widget_str text; /*  This should probably be smaller than config since it will be stuffed in config.  */
    declare tab_pane_guid varchar(255) default UUID();

    /* Create a cursor and loop over the matching widget states for this dashboard. */
    declare no_more_widgets int default 0;

    declare widget_cursor cursor for 
        select id, unique_id, region,
               widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
               column_pos, button_id, button_opened, state_position, height, width
        from dashboard_widget_state 
        where dashboard_widget_state.dashboard_id = dashboard_id
        order by state_position;
    declare continue handler for not found
        set no_more_widgets = 1;

    set config = @tabbed_template;
    set tab_widget_str = '[';
    set widget_config = '';
    
    /* Open the widgets cursor. */
    open widget_cursor;

    WIDGET_LOOP: loop
        set no_more_widgets = 0;
        fetch widget_cursor into vwidget_id, vunique_id, vregion,
                                 vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
                                 vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
                                 vheight, vwidth;

        /* Test for no more records. */
        if no_more_widgets then
            close widget_cursor;
            leave WIDGET_LOOP;
        end if;

        call owfGetWidgetDefinition(dashboard_id, dashboard_guid, tab_pane_guid, vwidget_id, 
                            vwidget_guid, vunique_id, vname, vactive, 0, 0, 0,
                            vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                            null, vbutton_opened, vregion, vstate_position,
                            vheight, vwidth, vcolumn_order,
                            widget_config);
        set tab_widget_str = concat(tab_widget_str, widget_config, ',');
    
    /* For each widget in that dashboard, assign it to the correct widget list. */

    end loop WIDGET_LOOP;

    /* Build the final config text block. */
    if length(tab_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        set tab_widget_str = concat(substring(tab_widget_str, 1, length(tab_widget_str) - 1), ']');
    else 
        set tab_widget_str = concat(tab_widget_str, ']');
    end if;

    set config = replace(config, @tabbed_key, tab_widget_str);
end; //

create procedure owfConvertPortalDashboard(in dashboard_id bigint, in dashboard_guid varchar(255), out config text)
begin
    declare vwidget_guid varchar(255);
    declare vunique_id varchar(255);
    declare vname varchar(200);
    declare vactive bit;
    declare vx int;
    declare vy int;
    declare vz_index int;
    declare vmaximized bit;
    declare vminimized bit;
    declare vpinned bit;
    declare vcollapsed bit;
    declare vcolumn_pos int;
    declare vbutton_id varchar(255);
    declare vbutton_opened bit;
    declare vregion varchar(15);
    declare vstate_position int;
    declare vsingleton bit;
    declare vheight int;
    declare vwidth int;
    declare vcolumn_order varchar(15);
    declare vwidget_id bigint;
    declare vwidget_unique_id varchar(255);
    declare widget_config text(4096);
    declare max_column int;
    declare left_widget_str text; /*  This should probably be smaller than config since it will be stuffed in config.  */
    declare middle_widget_str text;
    declare right_widget_str text;
    declare left_pane_guid varchar(255) default UUID();
    declare middle_pane_guid varchar(255) default UUID();
    declare right_pane_guid varchar(255) default UUID();

    /* Create a cursor and loop over the matching widget states for this dashboard. */
    declare no_more_widgets int default 0;

    declare widget_cursor cursor for 
        select id, unique_id, region,
               widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
               column_pos, button_id, button_opened, state_position, height, width
        from dashboard_widget_state 
        where dashboard_widget_state.dashboard_id = dashboard_id
        order by state_position;
    declare continue handler for not found
        set no_more_widgets = 1;

    set left_widget_str = '[';
    set middle_widget_str = '[';
    set right_widget_str = '[';
    set widget_config = '';

    set max_column = 0;

    select max(w.column_pos) into max_column from dashboard_widget_state w where w.dashboard_id = dashboard_id;

    /* Determine which of the new portal templates to use. Note: column values are 0-based.*/
    set config = @portal_1_template;
    if max_column = 1 then
        set config = @portal_2_template;
    elseif max_column = 2 then
        set config = @portal_3_template;
    end if;
    
    /* Open the widgets cursor. */
    open widget_cursor;

    WIDGET_LOOP: loop
        set no_more_widgets = 0;
        fetch widget_cursor into vwidget_id, vunique_id, vregion,
                                 vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
                                 vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
                                 vheight, vwidth;

        /* Test for no more records. */
        if no_more_widgets then
            close widget_cursor;
            leave WIDGET_LOOP;
        end if;

        /* Put widgets into appropriate portal column.  Anything not in columns 2 or 3 go to the first
         * column.  This includes background widgets.  They simply need to be in a pane.
         */
        if vcolumn_pos = '1' then
            call owfGetWidgetDefinition(dashboard_id, dashboard_guid, middle_pane_guid, vwidget_id, 
                            vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                            vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                            vbutton_id, vbutton_opened, vregion, vstate_position,
                            vheight, vwidth, vcolumn_order,
                            widget_config);
            set middle_widget_str = concat(middle_widget_str, widget_config, ',');
        elseif vcolumn_pos = '2' then
            call owfGetWidgetDefinition(dashboard_id, dashboard_guid, right_pane_guid, vwidget_id, 
                            vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                            vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                            vbutton_id, vbutton_opened, vregion, vstate_position,
                            vheight, vwidth, vcolumn_order,
                            widget_config);
            set right_widget_str = concat(right_widget_str, widget_config, ',');
        else
            call owfGetWidgetDefinition(dashboard_id, dashboard_guid, left_pane_guid, vwidget_id, 
                            vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                            vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                            vbutton_id, vbutton_opened, vregion, vstate_position,
                            vheight, vwidth, vcolumn_order,
                            widget_config);
            set left_widget_str = concat(left_widget_str, widget_config, ',');
        end if;
    
    /* For each widget in that dashboard, assign it to the correct widget list. */

    end loop WIDGET_LOOP;

    /* Build the final config text block. */
    if length(left_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        set left_widget_str = concat(substring(left_widget_str, 1, length(left_widget_str) - 1), ']');
    else 
        set left_widget_str = concat(left_widget_str, ']');
    end if;
    if length(middle_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        set middle_widget_str = concat(substring(middle_widget_str, 1, length(middle_widget_str) - 1), ']');
    else 
        set middle_widget_str = concat(middle_widget_str, ']');
    end if;
    if length(right_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        set right_widget_str = concat(substring(right_widget_str, 1, length(right_widget_str) - 1), ']');
    else 
        set right_widget_str = concat(right_widget_str, ']');
    end if;

    set config = replace(config, @portal_left_key, left_widget_str);
    if max_column > 0 then
        set config = replace(config, @portal_middle_key, middle_widget_str);
    end if;
    if max_column > 1 then
        set config = replace(config, @portal_right_key, right_widget_str);
    end if;
end; //

create procedure owfConvertAccordionDashboard(in dashboard_id bigint, in dashboard_guid varchar(255), out config text)
begin
    declare vwidget_guid varchar(255);
    declare vunique_id varchar(255);
    declare vname varchar(200);
    declare vactive bit;
    declare vx int;
    declare vy int;
    declare vz_index int;
    declare vmaximized bit;
    declare vminimized bit;
    declare vpinned bit;
    declare vcollapsed bit;
    declare vcolumn_pos int;
    declare vbutton_id varchar(255);
    declare vbutton_opened bit;
    declare vregion varchar(15);
    declare vstate_position int;
    declare vsingleton bit;
    declare vheight int;
    declare vwidth int;
    declare vcolumn_order varchar(15);
    declare vwidget_id bigint;
    declare vwidget_unique_id varchar(255);
    declare widget_config text(4096);
    declare accordion_widget_str text; /*  This should probably be smaller than config since it will be stuffed in config.  */
    declare right_widget_str text;
    declare top_widget_str text;
    declare bottom_widget_str text;
    declare accordion_guid varchar(255) default UUID();
    declare right_guid varchar(255) default UUID();
    declare top_guid varchar(255) default UUID();
    declare bottom_guid varchar(255) default UUID();
    declare bottom_widget_height int;
    declare accordion_width int;

    /* Create a cursor and loop over the matching widget states for this dashboard. */
    declare no_more_widgets int default 0;

    declare widget_cursor cursor for 
        select id, unique_id, region,
               widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
               column_pos, button_id, button_opened, state_position, height, width
        from dashboard_widget_state 
        where dashboard_widget_state.dashboard_id = dashboard_id
        order by state_position;
    declare continue handler for not found
        set no_more_widgets = 1;

    set config = @accordion_template;
    set accordion_widget_str = '[';
    set right_widget_str = '[';
    set top_widget_str = '';
    set bottom_widget_str = '';
    set widget_config = '';
    set bottom_widget_height = 125;
    set accordion_width = 225;

    /* Open the widgets cursor. */
    open widget_cursor;

    WIDGET_LOOP: loop
        set no_more_widgets = 0;
        fetch widget_cursor into vwidget_id, vunique_id, vregion,
                                 vwidget_guid, vname, vactive, vx, vy, vz_index, vmaximized, vminimized,
                                 vpinned, vcollapsed, vcolumn_pos, vbutton_id, vbutton_opened, vstate_position,
                                 vheight, vwidth;

        /* Test for no more records. */
        if no_more_widgets then
            close widget_cursor;
            leave WIDGET_LOOP;
        end if;

        if vregion = 'center' then
            call owfGetWidgetDefinition(dashboard_id, dashboard_guid, top_guid, vwidget_id, 
                            vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                            vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                            vbutton_id, vbutton_opened, vregion, vstate_position,
                            vheight, vwidth, vcolumn_order,
                            widget_config);
            set top_widget_str = widget_config;
        elseif vregion = 'south' then
            call owfGetWidgetDefinition(dashboard_id, dashboard_guid, bottom_guid, vwidget_id, 
                            vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                            vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                            vbutton_id, vbutton_opened, vregion, vstate_position,
                            vheight, vwidth, vcolumn_order,
                            widget_config);
            set bottom_widget_height = vheight;
            set bottom_widget_str = widget_config;
        else
            call owfGetWidgetDefinition(dashboard_id, dashboard_guid, accordion_guid, vwidget_id, 
                            vwidget_guid, vunique_id, vname, vactive, vx, vy, vz_index,
                            vmaximized, vminimized, vpinned, vcollapsed, vcolumn_pos,
                            vbutton_id, vbutton_opened, vregion, vstate_position,
                            vheight, vwidth, vcolumn_order,
                            widget_config);
            set accordion_width = vwidth;
            set accordion_widget_str = concat(accordion_widget_str, widget_config, ',');
        end if;
    
    /* For each widget in that dashboard, assign it to the correct widget list. */

    end loop WIDGET_LOOP;

    /* Build the final config text block. */
    if length(accordion_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        set accordion_widget_str = concat(substring(accordion_widget_str, 1, length(accordion_widget_str) - 1), ']');
    else 
        set accordion_widget_str = concat(accordion_widget_str, ']');
    end if;
    if length(top_widget_str) > 0 then
        set right_widget_str = concat(right_widget_str, top_widget_str, ',');
    end if;
    if length(bottom_widget_str) > 0 then
        set right_widget_str = concat(right_widget_str, bottom_widget_str, ',');
    end if;
    if length(right_widget_str) > 1 then
        /* Chop off the last , and close out the config object. */
        set right_widget_str = concat(substring(right_widget_str, 1, length(right_widget_str) - 1), ']');
    else
        set right_widget_str = concat(right_widget_str, ']');
    end if;

    set config = replace(config, @accordion_widgets_key, accordion_widget_str);
    set config = replace(config, @accordion_right_widgets_key, right_widget_str);
    set config = replace(config, @accordion_width_key, accordion_width);
end; //

create procedure owfGetWidgetDefinition(in dashboard_id bigint, in dashboard_guid varchar(255), 
                                        in pane_guid varchar(255), in widget_id varchar(255), 
                                        in widget_guid varchar(255), in unique_id varchar(255),
                                        in name varchar(200), in active bit, in x int, in y int,
                                        in z_index int,  in maximized bit, in minimized bit,
                                        in pinned bit, in collapsed bit, in column_pos int,
                                        in button_id varchar(255), in button_opened bit,
                                        in region varchar(15), in state_position int,
                                        in height int, in width int,
                                        in column_order varchar(15),
                                        out config text(4096))
begin
    declare singleton bit;
    declare param varchar(1024);

    select w.singleton into singleton from widget_definition as w where w.widget_guid = widget_guid;

    set config = '{';
    if length(widget_guid) > 0 then
        call owfBuildExtParamString('widgetGuid', widget_guid, param);
        set config = concat(config, param, ',');
    else
        set config = concat(config, '"widgetGuid":null,');
    end if;
    
    call owfBuildExtParamString('uniqueId', unique_id, param);
    set config = concat(config, param, ',');
    call owfBuildExtParamString('dashboardGuid', dashboard_guid, param);
    set config = concat(config, param, ',');
    call owfBuildExtParamString('paneGuid', pane_guid, param);
    set config = concat(config, param, ',');
    call owfBuildExtParamString('name', name, param);
    set config = concat(config, param, ',');
    set config = concat(config, '"', 'active', '":', if(active, 'true', 'false'), ',');
    set param = concat('"x":', x);
    set config = concat(config, param, ',');
    set param = concat('"y":', y);
    set config = concat(config, param, ',');
    set param = concat('"zIndex":', z_index);
    set config = concat(config, param, ',');
    set config = concat(config, '"', 'maximized', '":', if(maximized, 'true', 'false'), ',');
    set config = concat(config, '"', 'minimized', '":', if(minimized, 'true', 'false'), ',');
    set config = concat(config, '"', 'pinned', '":', if(pinned, 'true', 'false'), ',');
    set config = concat(config, param, ',');
    set config = concat(config, '"', 'collapsed', '":', if(collapsed, 'true', 'false'), ',');
    set param = concat('"columnPos":', column_pos);
    set config = concat(config, param, ',');

    if button_id != null then
        call owfBuildExtParamString('buttonId', button_id, param);
        set config = concat(config, param, ',');
    else
        set config = concat(config, '"buttonId":"",');
    end if;
    set config = concat(config, '"', 'buttonOpened', '":', if(button_opened, 'true', 'false'), ',');
    call owfBuildExtParamString('region', region, param);
    set config = concat(config, param, ',');
    set param = concat('"statePosition":', state_position);
    set config = concat(config, param, ',');
    set config = concat(config, '"', 'singleton', '":', if(singleton, 'true', 'false'), ',');
    set param = concat('"height":', height);
    set config = concat(config, param, ',');
    set param = concat('"width":', width);
    set config = concat(config, param, ',');
    call owfBuildExtParamString('columnOrder', '', param);
    set config = concat(config, param, ',');
    set config = substring(config, 1, length(config) - 1);
    set config = concat(config, '}');

end; //

/*
 * PROCEDURE: convertDashboards()
 * This procedure reads OWF 5 data values from the dashboard and dashboar_widget_state tables and 
 * attempts to convert OWF 5 dashboards to OWF 6 dashboards.  It does this by looping over all the
 * dashboard records, pulling their OWF 5 based values and generating an EXT JS Config object that
 * will be placed in the Dashboard.layout_config field introduced in OWF 6.
 */
create procedure owfConvertDashboards()
begin
    declare current_dash_id bigint;
    declare current_dash_guid varchar(255);
    declare current_layout varchar(9);
    declare current_config text;
    declare current_defaults text;
    declare no_more_dashboards int default 0;

    declare dashboard_cursor cursor for select id, guid, layout, default_settings from dashboard;
    declare continue handler for not found
        set no_more_dashboards = 1;

    /* Open the dashboard cursor. */
    open dashboard_cursor;

    DASH_LOOP: loop

        fetch dashboard_cursor into current_dash_id, current_dash_guid, current_layout, current_defaults;

        /* Test for no more records. */
        if no_more_dashboards then
            close dashboard_cursor;
            leave DASH_LOOP;
        end if;

        if current_layout = 'accordion' then
            call owfConvertAccordionDashboard(current_dash_id, current_dash_guid, current_config);
            insert into new_dashboard_configs (id, config) values(current_dash_id, current_config);
        elseif current_layout = 'desktop' then
            call owfConvertDesktopDashboard(current_dash_id, current_dash_guid, current_defaults, current_config); 
            insert into new_dashboard_configs (id, config) values(current_dash_id, current_config);
        elseif current_layout = 'portal' then
            call owfConvertPortalDashboard(current_dash_id, current_dash_guid, current_config); 
            insert into new_dashboard_configs (id, config) values(current_dash_id, current_config);
        else
            /* Fall-through case. Convert any tabbed dashbaords and any unknown custom types to tabbed. */ 
            call owfConvertTabbedDashboard(current_dash_id, current_dash_guid, current_config); 
            insert into new_dashboard_configs (id, config) values(current_dash_id, current_config);
        end if;
    end loop DASH_LOOP;

    update dashboard set dashboard.layout_config = (select new_dashboard_configs.config from new_dashboard_configs
                                                    where new_dashboard_configs.id = dashboard.id)
    where exists (select new_dashboard_configs.config from new_dashboard_configs where new_dashboard_configs.id = dashboard.id);

end; //

create procedure owfBuildExtParamString(in param_name varchar(255), in param_value varchar(255), out param varchar(1024))
begin
    set param = concat('"', param_name, '":"', param_value, '"');
end; //

delimiter ;

call owfConvertDashboards();


/* Clean up any temp procedures or tables. */
drop procedure if exists owfConvertAccordionDashboard;
drop procedure if exists owfGetWidgetDefinition;
drop procedure if exists owfConvertDashboards;
drop procedure if exists owfBuildExtParamString;
drop procedure if exists owfConvertPortalDashboard;
drop procedure if exists owfConvertTabbedDashboard;
drop procedure if exists owfConvertDesktopDashboard;

/* Clean up temp table with new config data. */
drop table if exists new_dashboard_configs;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Convert OWF 5 style dashboards to OWF 6 style dashboards', NOW(), 'SQL From File', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-58', '2.0.1', '3:4c8648a306680db39923e41418aa9724', 22);

-- Changeset changelog_6.0.0.groovy::6.0.0-63::owf::(Checksum: 3:9211052869719112cf60c1ebb7ae958b)
-- upgrade any pwds that were pending approval to use the disabled column
update person_widget_definition pwd, tag_links taglinks
            set pwd.disabled = true
            where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = false;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'upgrade any pwds that were pending approval to use the disabled column', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-63', '2.0.1', '3:9211052869719112cf60c1ebb7ae958b', 23);

-- Release Database Lock
