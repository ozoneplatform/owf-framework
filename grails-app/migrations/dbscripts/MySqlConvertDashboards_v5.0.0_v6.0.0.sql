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
