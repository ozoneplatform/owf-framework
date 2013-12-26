-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 9/21/12 3:38 PM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_6.0.0.groovy::6.0.0-1::owf::(Checksum: 3:b7a17650e4cfde415fdbbcc4f2bd1317)
-- Add universal_name to widgetdefinition
ALTER TABLE [dbo].[widget_definition] ADD [universal_name] VARCHAR(255)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add universal_name to widgetdefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-1', '2.0.1', '3:b7a17650e4cfde415fdbbcc4f2bd1317', 1)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-2::owf::(Checksum: 3:30ea4354058c7a09bfafb6acabfd1e33)
-- Add layoutConfig to dashboard
ALTER TABLE [dbo].[dashboard] ADD [layout_config] NVARCHAR(MAX)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add layoutConfig to dashboard', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-2', '2.0.1', '3:30ea4354058c7a09bfafb6acabfd1e33', 2)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-3::owf::(Checksum: 3:6ce1db42048bc63ece1be0c3f4669a52)
-- Add descriptor_url to widgetdefinition
ALTER TABLE [dbo].[widget_definition] ADD [descriptor_url] VARCHAR(2083)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add descriptor_url to widgetdefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-3', '2.0.1', '3:6ce1db42048bc63ece1be0c3f4669a52', 3)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-4::owf::(Checksum: 3:4e940a0bdfea36b98c62330e4b373dd3)
-- Remove EventingConnections table and association with DashboardWidgetState
DROP TABLE [dbo].[eventing_connections]
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Remove EventingConnections table and association with DashboardWidgetState', GETDATE(), 'Drop Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-4', '2.0.1', '3:4e940a0bdfea36b98c62330e4b373dd3', 4)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-5::owf::(Checksum: 3:2c40b74eb7eb29a286ac641320a97b4d)
-- Create intent table
CREATE TABLE [dbo].[intent] ([id] BIGINT IDENTITY  NOT NULL, [version] BIGINT NOT NULL, [action] VARCHAR(255) NOT NULL, CONSTRAINT [intentPK] PRIMARY KEY ([id]), UNIQUE ([action]))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create intent table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-5', '2.0.1', '3:2c40b74eb7eb29a286ac641320a97b4d', 5)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-6::owf::(Checksum: 3:008f636cf428abbd60459975d28e62a1)
-- Create intent_data_type table
CREATE TABLE [dbo].[intent_data_type] ([id] BIGINT IDENTITY  NOT NULL, [version] BIGINT NOT NULL, [data_type] VARCHAR(255) NOT NULL, CONSTRAINT [intent_data_typePK] PRIMARY KEY ([id]))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create intent_data_type table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-6', '2.0.1', '3:008f636cf428abbd60459975d28e62a1', 6)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-7::owf::(Checksum: 3:b462f738ef9c30634a0a47d245d16a59)
-- Create intent_data_types table
CREATE TABLE [dbo].[intent_data_types] ([intent_data_type_id] BIGINT NOT NULL, [intent_id] BIGINT NOT NULL)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create intent_data_types table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-7', '2.0.1', '3:b462f738ef9c30634a0a47d245d16a59', 7)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-8::owf::(Checksum: 3:ee497899a41d5cc2798af5cfc277aecb)
-- Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table
ALTER TABLE [dbo].[intent_data_types] ADD CONSTRAINT [FK8A59132FD46C6FAA] FOREIGN KEY ([intent_data_type_id]) REFERENCES [dbo].[intent_data_type] ([id])
GO

ALTER TABLE [dbo].[intent_data_types] ADD CONSTRAINT [FK8A59D92FD46C6FAA] FOREIGN KEY ([intent_id]) REFERENCES [dbo].[intent] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and intent_id in intent_data_types table', GETDATE(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-8', '2.0.1', '3:ee497899a41d5cc2798af5cfc277aecb', 8)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-9::owf::(Checksum: 3:a373d6042ff2a6856d2f5c00522909b1)
-- Create widget_def_intent table
create table widget_def_intent (id bigint identity not null, version bigint not null, receive bit not null, 
                send bit not null, intent_id bigint not null, widget_definition_id numeric(19,0) not null, primary key (id))
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create widget_def_intent table', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-9', '2.0.1', '3:a373d6042ff2a6856d2f5c00522909b1', 9)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-10::owf::(Checksum: 3:e5d364edc24ace7b9b89d3854bb70408)
-- Add foreign constraint for widget_definition_id in widget_def_intent table
ALTER TABLE [dbo].[widget_def_intent] ADD CONSTRAINT [FK8A59D92FD46C6FAB] FOREIGN KEY ([widget_definition_id]) REFERENCES [dbo].[widget_definition] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign constraint for widget_definition_id in widget_def_intent table', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-10', '2.0.1', '3:e5d364edc24ace7b9b89d3854bb70408', 10)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-11::owf::(Checksum: 3:fcf69ebd060340afd1483c2f4588f456)
-- Add foreign constraint for intent_id in widget_definition_intent table
ALTER TABLE [dbo].[widget_def_intent] ADD CONSTRAINT [FK8A59D92FD46C6FAC] FOREIGN KEY ([intent_id]) REFERENCES [dbo].[intent] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign constraint for intent_id in widget_definition_intent table', GETDATE(), 'Add Foreign Key Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-11', '2.0.1', '3:fcf69ebd060340afd1483c2f4588f456', 11)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-12::owf::(Checksum: 3:05c50cdf2e21818c6986e5ef2d8c9f50)
-- Create widget_def_intent_data_types table
CREATE TABLE [dbo].[widget_def_intent_data_types] ([intent_data_type_id] BIGINT NOT NULL, [widget_definition_intent_id] BIGINT NOT NULL)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Create widget_def_intent_data_types table', GETDATE(), 'Create Table', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-12', '2.0.1', '3:05c50cdf2e21818c6986e5ef2d8c9f50', 12)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-13::owf::(Checksum: 3:3250f92e3b85fec3db493d11b53445e2)
-- Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table
ALTER TABLE [dbo].[widget_def_intent_data_types] ADD CONSTRAINT [FK8A59D92FD41A6FAD] FOREIGN KEY ([intent_data_type_id]) REFERENCES [dbo].[intent_data_type] ([id])
GO

ALTER TABLE [dbo].[widget_def_intent_data_types] ADD CONSTRAINT [FK8A59D92FD46C6FAD] FOREIGN KEY ([widget_definition_intent_id]) REFERENCES [dbo].[widget_def_intent] ([id])
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add foreign constraint for intent_data_type_id and widget_definition_intent_id in widget_def_intent_data_types table', GETDATE(), 'Add Foreign Key Constraint (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-13', '2.0.1', '3:3250f92e3b85fec3db493d11b53445e2', 13)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-14::owf::(Checksum: 3:897a5aa2802104b8f90bcde737c47002)
-- Add intentConfig column to dashboard table
ALTER TABLE [dbo].[dashboard] ADD [intent_config] NVARCHAR(MAX)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add intentConfig column to dashboard table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-14', '2.0.1', '3:897a5aa2802104b8f90bcde737c47002', 14)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-15::owf::(Checksum: 3:a58c7f9ab7dcc8c733d3a16c25adc558)
-- Added description column into Widget Definition table
ALTER TABLE [dbo].[widget_definition] ADD [description] VARCHAR(255) CONSTRAINT DF_widget_definition_description DEFAULT ''
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Added description column into Widget Definition table', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-15', '2.0.1', '3:a58c7f9ab7dcc8c733d3a16c25adc558', 15)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-16::owf::(Checksum: 3:9624d22cdbed36b5bbce5da92bdb1bfc)
-- Add groupWidget property to personwidgetdefinition
ALTER TABLE [dbo].[person_widget_definition] ADD [group_widget] BIT CONSTRAINT DF_person_widget_definition_group_widget DEFAULT 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add groupWidget property to personwidgetdefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-16', '2.0.1', '3:9624d22cdbed36b5bbce5da92bdb1bfc', 16)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-17::owf::(Checksum: 3:92a97333d2f7b5f17e0a541712847a54)
-- Add favorite property to personwidgetdefinition
ALTER TABLE [dbo].[person_widget_definition] ADD [favorite] BIT CONSTRAINT DF_person_widget_definition_favorite DEFAULT 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add favorite property to personwidgetdefinition', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-17', '2.0.1', '3:92a97333d2f7b5f17e0a541712847a54', 17)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-44::owf::(Checksum: 3:a0a7528d5494cd0f02b38b3f99b2cfe4)
ALTER TABLE [dbo].[dashboard] ALTER COLUMN [layout] VARCHAR(9) NULL
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', '', GETDATE(), 'Drop Not-Null Constraint', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-44', '2.0.1', '3:a0a7528d5494cd0f02b38b3f99b2cfe4', 18)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-53::owf::(Checksum: 3:9f398a44008d12aee688e347940b7adf)
-- Add locked property to dashboard
ALTER TABLE [dbo].[dashboard] ADD [locked] BIT CONSTRAINT DF_dashboard_locked DEFAULT 0
GO

UPDATE [dbo].[dashboard] SET [locked] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add locked property to dashboard', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-53', '2.0.1', '3:9f398a44008d12aee688e347940b7adf', 19)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-55::owf::(Checksum: 3:2aa790687f711ca1d930c1aa24fadd0c)
-- Add display name field to pwd
ALTER TABLE [dbo].[person_widget_definition] ADD [display_name] VARCHAR(256)
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add display name field to pwd', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-55', '2.0.1', '3:2aa790687f711ca1d930c1aa24fadd0c', 20)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-56::owf::(Checksum: 3:ca86586d796b6e61467c6fc7cb0a787c)
-- Add disabled field to pwd
ALTER TABLE [dbo].[person_widget_definition] ADD [disabled] BIT CONSTRAINT DF_person_widget_definition_disabled DEFAULT 0
GO

UPDATE [dbo].[person_widget_definition] SET [disabled] = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Add disabled field to pwd', GETDATE(), 'Add Column', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-56', '2.0.1', '3:ca86586d796b6e61467c6fc7cb0a787c', 21)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-57::owf::(Checksum: 3:5f05e1b2b6a1d14b3d91e27cdd4980ec)
-- Convert OWF 5 style dashboards to OWF 6 style dashboards
/* Setup log table and any temp tables for processing. */
IF OBJECT_ID('dbo.conversion_logs', 'U') IS NOT NULL
  DROP TABLE dbo.conversion_logs;
GO
IF OBJECT_ID('dbo.new_dashboard_configs', 'U') IS NOT NULL
  DROP TABLE dbo.new_dashboard_configs;
GO

create table conversion_logs (id numeric(19,0) primary key identity, msg nvarchar(max));
GO
create table new_dashboard_configs (id numeric(19,0) not null, config nvarchar(max), primary key (id));
GO

/* Drop any old versions of the stored procedures contained herein. */
if exists (select * from sysobjects where id = object_id(N'dbo.GetNewIDForDashboardConversion') 
           AND xtype IN (N'V'))
    drop view dbo.GetNewIDForDashboardConversion
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertAccordionDashboard') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertAccordionDashboard
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfGetWidgetDefinition') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfGetWidgetDefinition
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertDashboards') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertDashboards
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfBuildExtParamString') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfBuildExtParamString
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertPortalDashboard') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertPortalDashboard
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertTabbedDashboard') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertTabbedDashboard
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertDesktopDashboard') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertDesktopDashboard
GO

/* Create backups of the dashboard and dashboard widget state tables before the conversion. */
select * into dbo.dashboard_backup from dbo.dashboard;
GO
select * into dbo.dashboard_widget_state_backup from dbo.dashboard_widget_state;
GO

/* Create a view to allow access to newid() function within user functions. */
create view GetNewIDForDashboardConversion
as
select newid() as [new_guid]
GO

insert into conversion_logs (msg) values ('Creating stored procedures');
GO

/* Define the convertDashboard stored procedure */
create function owfBuildExtParamString(@param_name nvarchar(255), @param_value nvarchar(255))
returns nvarchar(1024)
as
begin
    declare @param nvarchar(1024);
    set @param = '"' + @param_name + '":"' + @param_value + '"';
    return @param
end
GO


create function owfGetWidgetDefinition(@dashboard_id as numeric(19,0), @dashboard_guid as nvarchar(255), 
                                        @pane_guid as nvarchar(255), @widget_id as nvarchar(255), 
                                        @widget_guid as nvarchar(255), @unique_id as nvarchar(255),
                                        @name as nvarchar(200), @active as tinyint, @x as int, @y as int,
                                        @z_index as int,  @maximized as tinyint, @minimized as tinyint,
                                        @pinned as tinyint, @collapsed as tinyint, @column_pos as int,
                                        @button_id as nvarchar(255), @button_opened as tinyint,
                                        @region as nvarchar(15), @state_position as int,
                                        @height as int, @width as int,
                                        @column_order as nvarchar(15))
returns nvarchar(2048)
as
begin
    declare @config nvarchar(2048);
    declare @singleton tinyint;
    declare @param nvarchar(1024);
	set @param = '';
    select @singleton = singleton from widget_definition as w where w.widget_guid = @widget_guid;

    set @config = '{';
    if len(@widget_guid) > 0 
    begin
        set @param = dbo.owfBuildExtParamString('widgetGuid', @widget_guid);
        set @config = @config + @param + ',';
    end
    else
        set @config = @config + '"widgetGuid":null,';
    
    set @param = dbo.owfBuildExtParamString('uniqueId', @unique_id);
    set @config = @config + @param + ',';
    set @param = dbo.owfBuildExtParamString('dashboardGuid', @dashboard_guid);
    set @config = @config + @param + ',';
    set @param = dbo.owfBuildExtParamString('paneGuid', @pane_guid);
    set @config = @config + @param + ',';
    set @param = dbo.owfBuildExtParamString('name', @name);
    set @config = @config + @param + ',';
    if (@active != 0)
        set @config = @config + '"' + 'active' + '":true,';  
    else
        set @config = @config + '"' + 'active' + '":false,';  
    set @param = '"x":' + cast(@x as nvarchar);
    set @config = @config + @param + ',';
    set @param = '"y":' + cast(@y as nvarchar);
    set @config = @config + @param + ',';
    set @param = '"zIndex":' + cast(@z_index as nvarchar);
    set @config = @config + @param + ',';
    if (@maximized != 0)
        set @config = @config + '"' + 'maximized' + '":true,';  
    else
        set @config = @config + '"' + 'maximized' + '":false,'; 
    if (@minimized != 0)
        set @config = @config + '"' + 'minimized' + '":true,';  
    else
        set @config = @config + '"' + 'minimized' + '":false,';
    if (@pinned != 0)
        set @config = @config + '"' + 'pinned' + '":true,';  
    else
        set @config = @config + '"' + 'pinned' + '":false,';  
    set @config = @config + @param + ',';
    if (@collapsed != 0)
        set @config = @config + '"' + 'collapsed' + '":true,';  
    else
        set @config = @config + '"' + 'collapsed' + '":false,'; 
    set @param = '"columnPos":' + cast(@column_pos as nvarchar);
    set @config = @config + @param + ',';

    if @button_id != null
    begin
        set @param = dbo.owfBuildExtParamString('buttonId', @button_id);
        set @config = @config + @param + ',';
    end
    else
        set @config = @config + '"buttonId":"",';

    if (@button_opened != 0)
        set @config = @config + '"' + 'buttonOpened' + '":true,';  
    else
        set @config = @config + '"' + 'buttonOpened' + '":false,'; 
    set @param =  dbo.owfBuildExtParamString('region', @region);
    set @config = @config + @param + ',';
    set @param = '"statePosition":' + cast(@state_position as nvarchar);
    set @config = @config + @param + ',';
    if (@singleton != 0)
        set @config = @config + '"' + 'singleton' + '":true,';  
    else
        set @config = @config + '"' + 'singleton' + '":false,'; 
    set @param = '"height":' + cast(@height as nvarchar);
    set @config = @config + @param + ',';
    set @param = '"width":' + cast(@width as nvarchar);
    set @config = @config + @param + ',';
    set @param =  dbo.owfBuildExtParamString('columnOrder', '');
    set @config = @config + @param + ',';
    set @config = substring(@config, 1, len(@config) - 1);
    set @config = @config + '}';
    return @config;
end
GO

create function owfConvertDesktopDashboard(@dashboard_id as numeric(19,0), @dashboard_guid as nvarchar(255), @defaults as nvarchar(max))
returns nvarchar(max)
as
begin
    declare @desktop_template nvarchar(max);
    declare @desktop_key nvarchar(40);
    declare @desktop_defaults_key nvarchar(40);
    declare @config nvarchar(max);
    declare @vwidget_guid nvarchar(255);
    declare @vunique_id nvarchar(255);
    declare @vname nvarchar(200);
    declare @vactive tinyint;
    declare @vx int;
    declare @vy int;
    declare @vz_index int;
    declare @vmaximized tinyint;
    declare @vminimized tinyint;
    declare @vpinned tinyint;
    declare @vcollapsed tinyint;
    declare @vcolumn_pos int;
    declare @vbutton_id nvarchar(255);
    declare @vbutton_opened tinyint;
    declare @vregion nvarchar(15);
    declare @vstate_position int;
    declare @vsingleton tinyint;
    declare @vheight int;
    declare @vwidth int;
    declare @vcolumn_order nvarchar(15);
    declare @vwidget_id numeric(19,0);
    declare @vwidget_unique_id nvarchar(255);
    declare @widget_config varchar(4096);
    declare @desktop_widget_str nvarchar(max); /*  This should probably be smaller than config since it will be stuffed in config.  */
    declare @desktop_pane_guid nvarchar(255);

    select @desktop_pane_guid = [new_guid] from dbo.GetNewIDForDashboardConversion;
    /*
     * DESKTOP TEMPLATE
     * Keys for replacement are DESKTOP_WIDGETS
     */
    set @desktop_template = '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":DESKTOP_WIDGETS,"defaultSettings":DESKTOP_DEFAULTS}';
    set @desktop_key = 'DESKTOP_WIDGETS';
    set @desktop_defaults_key = 'DESKTOP_DEFAULTS';
    set @config = @desktop_template;
    set @desktop_widget_str = '[';
    set @widget_config = '';

    /* Create a cursor and loop over the matching widget states for this dashboard. */
    declare widget_cursor cursor for 
        select id, unique_id, region,
               widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
               column_pos, button_id, button_opened, state_position, height, width
        from dbo.dashboard_widget_state
        where dbo.dashboard_widget_state.dashboard_id = @dashboard_id
        order by state_position;
    open widget_cursor
    fetch next from widget_cursor into @vwidget_id, @vunique_id, @vregion,
                                 @vwidget_guid, @vname, @vactive, @vx, @vy, @vz_index, @vmaximized, @vminimized,
                                 @vpinned, @vcollapsed, @vcolumn_pos, @vbutton_id, @vbutton_opened, @vstate_position,
                                 @vheight, @vwidth
    
    while @@fetch_status = 0
    begin

        set @widget_config = dbo.owfGetWidgetDefinition(@dashboard_id, @dashboard_guid, @desktop_pane_guid, @vwidget_id, 
                            @vwidget_guid, @vunique_id, @vname, @vactive, @vx, @vy, @vz_index,
                            @vmaximized, @vminimized, @vpinned, @vcollapsed, @vcolumn_pos,
                            @vbutton_id, @vbutton_opened, @vregion, @vstate_position,
                            @vheight, @vwidth, @vcolumn_order);
        set @desktop_widget_str = @desktop_widget_str + @widget_config + ',';
    
        fetch next from widget_cursor into @vwidget_id, @vunique_id, @vregion,
                                 @vwidget_guid, @vname, @vactive, @vx, @vy, @vz_index, @vmaximized, @vminimized,
                                 @vpinned, @vcollapsed, @vcolumn_pos, @vbutton_id, @vbutton_opened, @vstate_position,
                                 @vheight, @vwidth;
    end
    close widget_cursor;
    deallocate widget_cursor;

    /* Build the final config text block. */
    if len(@desktop_widget_str) > 1
        /* Chop off the last , and close out the config object. */
        set @desktop_widget_str = substring(@desktop_widget_str, 1, len(@desktop_widget_str) - 1) + ']';
    else 
        set @desktop_widget_str = @desktop_widget_str + ']';

    set @config = replace(@config, @desktop_key, @desktop_widget_str);
    if len(isnull(@defaults, '')) < 2
        set @config = replace(@config, @desktop_defaults_key, '{}');
    else
        set @config = replace(@config, @desktop_defaults_key, @defaults);
    
    return @config;
end
GO

create function owfConvertTabbedDashboard(@dashboard_id as numeric(19,0), @dashboard_guid as nvarchar(255))
returns nvarchar(max)
as
begin
    declare @config nvarchar(max);
    declare @vwidget_guid nvarchar(255);
    declare @vunique_id nvarchar(255);
    declare @vname nvarchar(200);
    declare @vactive tinyint;
    declare @vx int;
    declare @vy int;
    declare @vz_index int;
    declare @vmaximized tinyint;
    declare @vminimized tinyint;
    declare @vpinned tinyint;
    declare @vcollapsed tinyint;
    declare @vcolumn_pos int;
    declare @vbutton_id nvarchar(255);
    declare @vbutton_opened tinyint;
    declare @vregion nvarchar(15);
    declare @vstate_position int;
    declare @vsingleton tinyint;
    declare @vheight int;
    declare @vwidth int;
    declare @vcolumn_order nvarchar(15);
    declare @vwidget_id numeric(19,0);
    declare @vwidget_unique_id nvarchar(255);
    declare @widget_config varchar(4096);
    declare @tabbed_widget_str nvarchar(max); /*  This should probably be smaller than config since it will be stuffed in config.  */
    declare @tabbed_pane_guid nvarchar(255) ;
    select @tabbed_pane_guid = [new_guid] from dbo.GetNewIDForDashboardConversion;

    /*
     * TABBED TEMPLATE
     * Keys for replacement are TAB_WIDGETS
     */
    declare @tabbed_template nvarchar(max);
    declare @tabbed_key nvarchar(40);
    set @tabbed_template = '{"xtype":"tabbedpane","flex":1,"height":"100%","items":[],"paneType":"tabbedpane","widgets":TAB_WIDGETS,"defaultSettings":{}}';
    set @tabbed_key = 'TAB_WIDGETS';
    set @config = @tabbed_template;
    set @tabbed_widget_str = '[';
    set @widget_config = '';

    /* Create a cursor and loop over the matching widget states for this dashboard. */
    declare widget_cursor cursor for 
        select id, unique_id, region,
               widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
               column_pos, button_id, button_opened, state_position, height, width
        from dbo.dashboard_widget_state
        where dbo.dashboard_widget_state.dashboard_id = @dashboard_id
        order by state_position;
    open widget_cursor
    fetch next from widget_cursor into @vwidget_id, @vunique_id, @vregion,
                                 @vwidget_guid, @vname, @vactive, @vx, @vy, @vz_index, @vmaximized, @vminimized,
                                 @vpinned, @vcollapsed, @vcolumn_pos, @vbutton_id, @vbutton_opened, @vstate_position,
                                 @vheight, @vwidth
    
    while @@fetch_status = 0
    begin

        set @widget_config = dbo.owfGetWidgetDefinition(@dashboard_id, @dashboard_guid, @tabbed_pane_guid, @vwidget_id, 
                            @vwidget_guid, @vunique_id, @vname, @vactive, 0, 0, 0,
                            @vmaximized, @vminimized, @vpinned, @vcollapsed, @vcolumn_pos,
                            @vbutton_id, @vbutton_opened, @vregion, @vstate_position,
                            @vheight, @vwidth, @vcolumn_order);
        set @tabbed_widget_str = @tabbed_widget_str +  @widget_config + ',';
    
        fetch next from widget_cursor into @vwidget_id, @vunique_id, @vregion,
                                 @vwidget_guid, @vname, @vactive, @vx, @vy, @vz_index, @vmaximized, @vminimized,
                                 @vpinned, @vcollapsed, @vcolumn_pos, @vbutton_id, @vbutton_opened, @vstate_position,
                                 @vheight, @vwidth;
    end
    close widget_cursor;
    deallocate widget_cursor;

    /* Build the final config text block. */
    if len(@tabbed_widget_str) > 1
        /* Chop off the last , and close out the config object. */
        set @tabbed_widget_str = substring(@tabbed_widget_str, 1, len(@tabbed_widget_str) - 1) + ']';
    else 
        set @tabbed_widget_str = @tabbed_widget_str + ']';

    set @config = replace(@config, @tabbed_key, @tabbed_widget_str);
    return @config;
end
GO

create function owfConvertPortalDashboard(@dashboard_id as numeric(19,0), @dashboard_guid as nvarchar(255))
returns nvarchar(max)
as
begin
    declare @desktop_template nvarchar(max);
    declare @desktop_key nvarchar(40);
    declare @config nvarchar(max);
    declare @vwidget_guid nvarchar(255);
    declare @vunique_id nvarchar(255);
    declare @vname nvarchar(200);
    declare @vactive tinyint;
    declare @vx int;
    declare @vy int;
    declare @vz_index int;
    declare @vmaximized tinyint;
    declare @vminimized tinyint;
    declare @vpinned tinyint;
    declare @vcollapsed tinyint;
    declare @vcolumn_pos int;
    declare @vbutton_id nvarchar(255);
    declare @vbutton_opened tinyint;
    declare @vregion nvarchar(15);
    declare @vstate_position int;
    declare @vsingleton tinyint;
    declare @vheight int;
    declare @vwidth int;
    declare @vcolumn_order nvarchar(15);
    declare @vwidget_id numeric(19,0);
    declare @vwidget_unique_id nvarchar(255);
    declare @widget_config varchar(4096);
    declare @max_column numeric(10,0);
    declare @left_widget_str nvarchar(max); /*  This should probably be smaller than config since it will be stuffed in config.  */
    declare @middle_widget_str nvarchar(max);
    declare @right_widget_str nvarchar(max);
    declare @left_pane_guid nvarchar(255);
    declare @middle_pane_guid nvarchar(255);
    declare @right_pane_guid nvarchar(255);
    select @left_pane_guid = [new_guid] from dbo.GetNewIDForDashboardConversion;
    select @middle_pane_guid = [new_guid] from dbo.GetNewIDForDashboardConversion;
    select @right_pane_guid = [new_guid] from dbo.GetNewIDForDashboardConversion;
    /*
     * PORTAL TEMPLATE
     * Keys for replacement are LEFT_PORTAL_WIDGETS, MIDDLE_PORTAL_WIDGETS, RIGHT_PORTAL_WIDGETS
     * The old portals could be 1 2 or 3 columns, called here left, middle, right.
     */
    declare @portal_1_template nvarchar(max);
    declare @portal_2_template nvarchar(max);
    declare @portal_3_template nvarchar(max);
    declare @portal_left_key varchar(40);
    declare @portal_middle_key varchar(40);
    declare @portal_right_key varchar(40);
    set @portal_3_template = '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":0.33,"htmlText":"33%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox right","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":MIDDLE_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":RIGHT_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":0.67}],"flex":3}';
    set @portal_1_template = '{"xtype":"portalpane","flex":1,"height":"100%","items":[],"paneType":"portalpane","widgets":LEFT_PORTAL_WIDGETS,"defaultSettings":{}}';
    set @portal_2_template = '{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"portalpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":LEFT_PORTAL_WIDGETS,"paneType":"portalpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"portalpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"portalpane","widgets":MIDDLE_PORTAL_WIDGETS,"defaultSettings":{}}],"flex":3}';
    set @portal_left_key = 'LEFT_PORTAL_WIDGETS';
    set @portal_middle_key = 'MIDDLE_PORTAL_WIDGETS';
    set @portal_right_key = 'RIGHT_PORTAL_WIDGETS';
    set @left_widget_str = '[';
    set @middle_widget_str = '[';
    set @right_widget_str = '[';
    set @widget_config = '';

    /* Create a cursor and loop over the matching widget states for this dashboard. */
    declare widget_cursor cursor for 
        select id, unique_id, region,
               widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
               column_pos, button_id, button_opened, state_position, height, width
        from dbo.dashboard_widget_state
        where dbo.dashboard_widget_state.dashboard_id = @dashboard_id
        order by state_position;

    /* Get the number of columns in the portal dashboard. */
    select @max_column = max(w.column_pos) from dashboard_widget_state as w where w.dashboard_id = @dashboard_id;

    /* Determine which of the new portal templates to use. Note: column values are 0-based.*/
    set @config = @portal_1_template;
    if @max_column = 1
    begin
        set @config = @portal_2_template;
    end
    else if @max_column = 2 
    begin
        set @config = @portal_3_template;
    end

    /* Open the widget cursor and parse all the widgets. */
    open widget_cursor
    fetch next from widget_cursor into @vwidget_id, @vunique_id, @vregion,
                                 @vwidget_guid, @vname, @vactive, @vx, @vy, @vz_index, @vmaximized, @vminimized,
                                 @vpinned, @vcollapsed, @vcolumn_pos, @vbutton_id, @vbutton_opened, @vstate_position,
                                 @vheight, @vwidth
    
    while @@fetch_status = 0
    begin
        
        if @vcolumn_pos = '1'
        begin
            set @widget_config = dbo.owfGetWidgetDefinition(@dashboard_id, @dashboard_guid, @middle_pane_guid, @vwidget_id, 
                            @vwidget_guid, @vunique_id, @vname, @vactive, @vx, @vy, @vz_index,
                            @vmaximized, @vminimized, @vpinned, @vcollapsed, @vcolumn_pos,
                            @vbutton_id, @vbutton_opened, @vregion, @vstate_position,
                            @vheight, @vwidth, @vcolumn_order);
            set @middle_widget_str = @middle_widget_str + @widget_config + ',';
        end
        else if @vcolumn_pos = '2'
        begin
            set @widget_config = dbo.owfGetWidgetDefinition(@dashboard_id, @dashboard_guid, @right_pane_guid, @vwidget_id, 
                            @vwidget_guid, @vunique_id, @vname, @vactive, @vx, @vy, @vz_index,
                            @vmaximized, @vminimized, @vpinned, @vcollapsed, @vcolumn_pos,
                            @vbutton_id, @vbutton_opened, @vregion, @vstate_position,
                            @vheight, @vwidth, @vcolumn_order);
            set @right_widget_str = @right_widget_str + @widget_config + ',';
        end
        else 
        begin
            set @widget_config = dbo.owfGetWidgetDefinition(@dashboard_id, @dashboard_guid, @left_pane_guid, @vwidget_id, 
                            @vwidget_guid, @vunique_id, @vname, @vactive, @vx, @vy, @vz_index,
                            @vmaximized, @vminimized, @vpinned, @vcollapsed, @vcolumn_pos,
                            @vbutton_id, @vbutton_opened, @vregion, @vstate_position,
                            @vheight, @vwidth, @vcolumn_order);
            set @left_widget_str = @left_widget_str + @widget_config + ',';
        end

        fetch next from widget_cursor into @vwidget_id, @vunique_id, @vregion,
                                 @vwidget_guid, @vname, @vactive, @vx, @vy, @vz_index, @vmaximized, @vminimized,
                                 @vpinned, @vcollapsed, @vcolumn_pos, @vbutton_id, @vbutton_opened, @vstate_position,
                                 @vheight, @vwidth;
    end
    close widget_cursor;
    deallocate widget_cursor;

    /* Build the final config text block. */
    if len(@left_widget_str) > 1
        /* Chop off the last , and close out the config object. */
        set @left_widget_str = substring(@left_widget_str, 1, len(@left_widget_str) - 1) + ']';
    else 
        set @left_widget_str = @left_widget_str + ']';
    if len(@middle_widget_str) > 1
        /* Chop off the last , and close out the config object. */
        set @middle_widget_str = substring(@middle_widget_str, 1, len(@middle_widget_str) - 1) + ']';
    else 
        set @middle_widget_str = @middle_widget_str + ']';
    if len(@right_widget_str) > 1
        /* Chop off the last , and close out the config object. */
        set @right_widget_str = substring(@right_widget_str, 1, len(@right_widget_str) - 1) + ']';
    else 
        set @right_widget_str = @right_widget_str + ']';

    set @config = replace(@config, @portal_left_key, @left_widget_str);
    if @max_column > 0
    begin
        set @config = replace(@config, @portal_middle_key, @middle_widget_str);
    end
    if @max_column > 1
    begin
        set @config = replace(@config, @portal_right_key, @right_widget_str);
    end

    return @config;
end
GO

create function owfConvertAccordionDashboard(@dashboard_id as numeric(19,0), @dashboard_guid as nvarchar(255))
returns nvarchar(max)
as
begin
    declare @desktop_template nvarchar(max);
    declare @desktop_key nvarchar(40);
    declare @config nvarchar(max);
    declare @vwidget_guid nvarchar(255);
    declare @vunique_id nvarchar(255);
    declare @vname nvarchar(200);
    declare @vactive tinyint;
    declare @vx int;
    declare @vy int;
    declare @vz_index int;
    declare @vmaximized tinyint;
    declare @vminimized tinyint;
    declare @vpinned tinyint;
    declare @vcollapsed tinyint;
    declare @vcolumn_pos int;
    declare @vbutton_id nvarchar(255);
    declare @vbutton_opened tinyint;
    declare @vregion nvarchar(15);
    declare @vstate_position int;
    declare @vsingleton tinyint;
    declare @vheight int;
    declare @vwidth int;
    declare @vcolumn_order nvarchar(15);
    declare @vwidget_id numeric(19,0);
    declare @vwidget_unique_id nvarchar(255);
    declare @widget_config varchar(4096);
    declare @bottom_widget_height int;
    declare @accordion_width int;
    declare @accordion_widget_str nvarchar(max); /*  This should probably be smaller than config since it will be stuffed in config.  */
    declare @right_widget_str nvarchar(max);
    declare @top_widget_str nvarchar(max);
    declare @bottom_widget_str nvarchar(max);
    declare @accordion_pane_guid nvarchar(255);
    declare @right_pane_guid nvarchar(255);
    declare @top_pane_guid nvarchar(255);
    declare @bottom_pane_guid nvarchar(255);
    select @accordion_pane_guid = [new_guid] from dbo.GetNewIDForDashboardConversion;
    select @right_pane_guid = [new_guid] from dbo.GetNewIDForDashboardConversion;
    select @top_pane_guid = [new_guid] from dbo.GetNewIDForDashboardConversion;
    select @bottom_pane_guid = [new_guid] from dbo.GetNewIDForDashboardConversion;

    /*
     * ACCORDION TEMPLATE 
     * Keys for replacement are ACCORDION_WIDGETS, TOP_RIGHT_WIDGET, BOTTOM_RIGHT_WIDGET
     */
    declare @accordion_template nvarchar(max);
    declare @accordion_widgets_key varchar(40);
    declare @accordion_right_widgets_key varchar(40);
    declare @accordion_top_key varchar(40);
    declare @accordion_bottom_key varchar(40);
    declare @accordion_width_key varchar(40);
    declare @accordion_bottom_height_key varchar(40);
    set @accordion_template = '{"xtype":"container","cls":"hbox","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"ACCORDION_WIDTHpx","items":[],"widgets":ACCORDION_WIDGETS,"paneType":"accordionpane","defaultSettings":{},"width":ACCORDION_WIDTH},{"xtype":"dashboardsplitter"},{"xtype":"accordionpane","cls":"right","flex":1,"htmlText":"Variable","items":[],"paneType":"accordionpane","widgets":RIGHT_WIDGETS,"defaultSettings":{}}],"flex":3}';
    set @accordion_widgets_key = 'ACCORDION_WIDGETS';
    set @accordion_right_widgets_key = 'RIGHT_WIDGETS';
    set @accordion_top_key = 'TOP_RIGHT_WIDGET';
    set @accordion_bottom_key = 'BOTTOM_RIGHT_WIDGET';
    set @accordion_width_key = 'ACCORDION_WIDTH';
    set @accordion_bottom_height_key ='BOTTOM_WIDGET_HEIGHT';
    set @config = @accordion_template;
    set @accordion_widget_str = '[';
    set @right_widget_str = '[';
    set @top_widget_str = '';
    set @bottom_widget_str = '';
    set @widget_config = '';
    set @accordion_width = 225;
    set @bottom_widget_height = 125;

    /* Create a cursor and loop over the matching widget states for this dashboard. */
    declare widget_cursor cursor for 
        select id, unique_id, region,
               widget_guid, name, active, x, y, z_index, maximized, minimized,  pinned, collapsed,
               column_pos, button_id, button_opened, state_position, height, width
        from dbo.dashboard_widget_state
        where dbo.dashboard_widget_state.dashboard_id = @dashboard_id
        order by state_position;
    open widget_cursor
    fetch next from widget_cursor into @vwidget_id, @vunique_id, @vregion,
                                 @vwidget_guid, @vname, @vactive, @vx, @vy, @vz_index, @vmaximized, @vminimized,
                                 @vpinned, @vcollapsed, @vcolumn_pos, @vbutton_id, @vbutton_opened, @vstate_position,
                                 @vheight, @vwidth
    
    while @@fetch_status = 0
    begin

        
        if @vregion = 'center'
        begin
            set @widget_config = dbo.owfGetWidgetDefinition(@dashboard_id, @dashboard_guid, @top_pane_guid, @vwidget_id, 
                            @vwidget_guid, @vunique_id, @vname, @vactive, @vx, @vy, @vz_index,
                            @vmaximized, @vminimized, @vpinned, @vcollapsed, @vcolumn_pos,
                            @vbutton_id, @vbutton_opened, @vregion, @vstate_position,
                            @vheight, @vwidth, @vcolumn_order);
            set @top_widget_str = @widget_config;
        end
        else if @vregion = 'south'
        begin
            set @widget_config = dbo.owfGetWidgetDefinition(@dashboard_id, @dashboard_guid, @bottom_pane_guid, @vwidget_id, 
                            @vwidget_guid, @vunique_id, @vname, @vactive, @vx, @vy, @vz_index,
                            @vmaximized, @vminimized, @vpinned, @vcollapsed, @vcolumn_pos,
                            @vbutton_id, @vbutton_opened, @vregion, @vstate_position,
                            @vheight, @vwidth, @vcolumn_order);
            set @bottom_widget_height = @vheight;
            set @bottom_widget_str = @widget_config;
        end    
        else
        begin
            set @widget_config = dbo.owfGetWidgetDefinition(@dashboard_id, @dashboard_guid, @accordion_pane_guid, @vwidget_id, 
                            @vwidget_guid, @vunique_id, @vname, @vactive, @vx, @vy, @vz_index,
                            @vmaximized, @vminimized, @vpinned, @vcollapsed, @vcolumn_pos,
                            @vbutton_id, @vbutton_opened, @vregion, @vstate_position,
                            @vheight, @vwidth, @vcolumn_order);
            set @accordion_width = @vwidth;
            set @accordion_widget_str = @accordion_widget_str + @widget_config + ',';
        end
    
        fetch next from widget_cursor into @vwidget_id, @vunique_id, @vregion,
                                 @vwidget_guid, @vname, @vactive, @vx, @vy, @vz_index, @vmaximized, @vminimized,
                                 @vpinned, @vcollapsed, @vcolumn_pos, @vbutton_id, @vbutton_opened, @vstate_position,
                                 @vheight, @vwidth;
    end
    close widget_cursor;
    deallocate widget_cursor;

    /* Build the final config text block. */
    if len(@accordion_widget_str) > 1
        /* Chop off the last , and close out the config object. */
        set @accordion_widget_str = substring(@accordion_widget_str, 1, len(@accordion_widget_str) - 1) + ']';
    else 
        set @accordion_widget_str = @accordion_widget_str + ']';
    if len(@top_widget_str) > 0
        set @right_widget_str = @right_widget_str + @top_widget_str + ',';
    if len(@bottom_widget_str) > 0
        set @right_widget_str = @right_widget_str + @bottom_widget_str + ',';
    if len(@right_widget_str) > 1
        /* Chop off the last ',' and close out the config object. */
        set @right_widget_str = substring(@right_widget_str, 1, len(@right_widget_str) - 1) + ']';
    else
        set @right_widget_str = @right_widget_str + ']';        
        
    set @config = replace(@config, @accordion_widgets_key, @accordion_widget_str);
    set @config = replace(@config, @accordion_right_widgets_key, @right_widget_str);
    set @config = replace(@config, @accordion_width_key, @accordion_width);
    return @config;
end
GO

/*
 * PROCEDURE: convertDashboards()
 * This procedure reads OWF 5 data values from the dashboard and dashboar_widget_state tables and 
 * attempts to convert OWF 5 dashboards to OWF 6 dashboards.  It does this by looping over all the
 * dashboard records, pulling their OWF 5 based values and generating an EXT JS Config object that
 * will be placed in the Dashboard.layout_config field introduced in OWF 6.
 *
 */
declare @current_dash_id numeric(19,0);
declare @current_dash_guid nvarchar(255);
declare @current_layout nvarchar(9);
declare @current_defaults nvarchar(max);
declare @current_config nvarchar(max) = '';

/* Create a cursor and loop over the matching widget states for this dashboard. */
declare dashboard_cursor cursor for 
    select [id], [guid], [layout], [default_settings]
    from dbo.dashboard;
open dashboard_cursor
fetch next from dashboard_cursor into @current_dash_id, @current_dash_guid, @current_layout, @current_defaults;
    
while @@fetch_status = 0
begin
    if @current_layout = 'accordion'
    begin
        set @current_config = dbo.owfConvertAccordionDashboard(@current_dash_id, @current_dash_guid);
        insert into dbo.new_dashboard_configs (id, config) values(@current_dash_id, @current_config);
    end
    else if @current_layout = 'desktop'
    begin
        set @current_config = dbo.owfConvertDesktopDashboard(@current_dash_id, @current_dash_guid, @current_defaults);
        insert into dbo.new_dashboard_configs (id, config) values(@current_dash_id, @current_config);
    end
    else if @current_layout = 'portal'
    begin
        set @current_config = dbo.owfConvertPortalDashboard(@current_dash_id, @current_dash_guid); 
        insert into dbo.new_dashboard_configs (id, config) values(@current_dash_id, @current_config);
    end
    else
    begin
	    /* Fall-through case. Convert any tabbed dashbaords and any unknown custom types to tabbed. */ 
        set @current_config = dbo.owfConvertTabbedDashboard(@current_dash_id, @current_dash_guid); 
        insert into dbo.new_dashboard_configs (id, config) values(@current_dash_id, @current_config);
    end
    fetch next from dashboard_cursor into @current_dash_id, @current_dash_guid, @current_layout, @current_defaults;
end
close dashboard_cursor;
deallocate dashboard_cursor;
GO
/* Update the dashboard table with our OWF 6 layout configs. */
update dbo.dashboard set dbo.dashboard.layout_config = (select new_dashboard_configs.config from new_dashboard_configs
                                                where new_dashboard_configs.id = dashboard.id)
where exists (select new_dashboard_configs.config from new_dashboard_configs where new_dashboard_configs.id = dashboard.id);
GO


/*dbo.owfConvertDashboards();*/

/* Clean up any temp procedures or tables. */
if exists (select * from sysobjects where id = object_id(N'dbo.GetNewIDForDashboardConversion') 
           AND xtype IN (N'V'))
    drop view dbo.GetNewIDForDashboardConversion
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertAccordionDashboard') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertAccordionDashboard
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfGetWidgetDefinition') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfGetWidgetDefinition
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertDashboards') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertDashboards
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfBuildExtParamString') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfBuildExtParamString
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertPortalDashboard') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertPortalDashboard
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertTabbedDashboard') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertTabbedDashboard
GO
IF EXISTS (SELECT * FROM sysobjects WHERE id = object_id(N'owfConvertDesktopDashboard') 
           AND xtype IN (N'FN', N'IF', N'TF'))
    DROP FUNCTION owfConvertDesktopDashboard
GO

/* Clean up temp table with new config data. */
IF OBJECT_ID('dbo.conversion_logs', 'U') IS NOT NULL
  DROP TABLE dbo.conversion_logs;
GO
IF OBJECT_ID('dbo.new_dashboard_configs', 'U') IS NOT NULL
  DROP TABLE dbo.new_dashboard_configs;
GO
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'Convert OWF 5 style dashboards to OWF 6 style dashboards', GETDATE(), 'SQL From File', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-57', '2.0.1', '3:5f05e1b2b6a1d14b3d91e27cdd4980ec', 22)
GO

-- Changeset changelog_6.0.0.groovy::6.0.0-63::owf::(Checksum: 3:48f77118fcda6e77c7d4417b438e99c6)
-- upgrade any pwds that were pending approval to use the disabled column
update person_widget_definition
            set disabled = 1
            from person_widget_definition as pwd, tag_links as taglinks
            where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = 0
GO

INSERT INTO [dbo].[DATABASECHANGELOG] ([AUTHOR], [COMMENTS], [DATEEXECUTED], [DESCRIPTION], [EXECTYPE], [FILENAME], [ID], [LIQUIBASE], [MD5SUM], [ORDEREXECUTED]) VALUES ('owf', 'upgrade any pwds that were pending approval to use the disabled column', GETDATE(), 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-63', '2.0.1', '3:48f77118fcda6e77c7d4417b438e99c6', 23)
GO

-- Release Database Lock
