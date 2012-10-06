/*****************************************************
 * SQLServer UPRGRADE SCRIPT                            *
 *                                                   *
 * Upgrade a OWF v3.4.0 database to v3.5.0     *
 *****************************************************/
-- Execute these alter statements only if you have not started owf.  Otherwise owf will automatically alter the tables and these statements will fail

alter table person drop column passwd;
alter table dashboard_widget_state add widget_guid nvarchar(255);
alter table dashboard_widget_state alter column person_widget_definition_id numeric(19,0) null;
alter table widget_definition add visible tinyint;

create table domain_mapping (id numeric(19,0) identity not null, version numeric(19,0) not null, src_type nvarchar(255) not null, src_id numeric(19,0) not null, dest_id numeric(19,0) not null, dest_type nvarchar(255) not null, primary key (id));
create table owf_group (id numeric(19,0) identity not null, version numeric(19,0) not null, status nvarchar(8) not null, email nvarchar(255) null, description nvarchar(255) null, name nvarchar(200) not null, automatic tinyint not null, primary key (id));
create table owf_group_people (person_id numeric(19,0) not null, group_id numeric(19,0) not null, primary key (group_id, person_id));

--make previous varchar fields nvarchar

-- update dashboard varchar fields to nvarchar
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.dashboard
	DROP CONSTRAINT FKC18AEA9485837584
GO
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_dashboard
	(
	id numeric(19, 0) NOT NULL IDENTITY (1, 1),
	version numeric(19, 0) NOT NULL,
	isdefault tinyint NOT NULL,
	dashboard_position int NOT NULL,
	altered_by_admin tinyint NOT NULL,
	guid nvarchar(255) NOT NULL,
	column_count int NOT NULL,
	layout nvarchar(9) NOT NULL,
	name nvarchar(200) NOT NULL,
	user_id numeric(19, 0) NOT NULL
	)  ON [PRIMARY]
GO
SET IDENTITY_INSERT dbo.Tmp_dashboard ON
GO
IF EXISTS(SELECT * FROM dbo.dashboard)
	 EXEC('INSERT INTO dbo.Tmp_dashboard (id, version, isdefault, dashboard_position, altered_by_admin, guid, column_count, layout, name, user_id)
		SELECT id, version, isdefault, dashboard_position, altered_by_admin, CONVERT(nvarchar(255), guid), column_count, CONVERT(nvarchar(9), layout), CONVERT(nvarchar(200), name), user_id FROM dbo.dashboard WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_dashboard OFF
GO
ALTER TABLE dbo.dashboard_widget_state
	DROP CONSTRAINT FKB6440EA1FDD6991A
GO
DROP TABLE dbo.dashboard
GO
EXECUTE sp_rename N'dbo.Tmp_dashboard', N'dashboard', 'OBJECT'
GO
ALTER TABLE dbo.dashboard ADD CONSTRAINT
	PK__dashboard__7C8480AE PRIMARY KEY CLUSTERED
	(
	id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.dashboard ADD CONSTRAINT
	UQ__dashboard__7D78A4E7 UNIQUE NONCLUSTERED
	(
	guid
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.dashboard ADD CONSTRAINT
	FKC18AEA9485837584 FOREIGN KEY
	(
	user_id
	) REFERENCES dbo.person
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.dashboard_widget_state ADD CONSTRAINT
	FKB6440EA1FDD6991A FOREIGN KEY
	(
	dashboard_id
	) REFERENCES dbo.dashboard
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
-- update dashboard varchar fields to nvarchar

-- update dashboard_widget_state varchar fields to nvarchar
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.dashboard_widget_state
	DROP CONSTRAINT FKB6440EA1FDD6991A
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.dashboard_widget_state
	DROP CONSTRAINT FKB6440EA1EDEDBBC2
GO
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_dashboard_widget_state
	(
	id numeric(19, 0) NOT NULL IDENTITY (1, 1),
	version numeric(19, 0) NOT NULL,
	region nvarchar(15) NOT NULL,
	button_opened tinyint NOT NULL,
	person_widget_definition_id numeric(19, 0) NULL,
	z_index int NOT NULL,
	minimized tinyint NOT NULL,
	unique_id nvarchar(255) NOT NULL,
	height int NOT NULL,
	pinned tinyint NOT NULL,
	name nvarchar(200) NOT NULL,
	column_pos int NOT NULL,
	width int NOT NULL,
	button_id nvarchar(255) NULL,
	collapsed tinyint NOT NULL,
	maximized tinyint NOT NULL,
	state_position int NOT NULL,
	active tinyint NOT NULL,
	dashboard_id numeric(19, 0) NOT NULL,
	y int NOT NULL,
	x int NOT NULL,
	widget_guid nvarchar(255) NULL
	)  ON [PRIMARY]
GO
SET IDENTITY_INSERT dbo.Tmp_dashboard_widget_state ON
GO
IF EXISTS(SELECT * FROM dbo.dashboard_widget_state)
	 EXEC('INSERT INTO dbo.Tmp_dashboard_widget_state (id, version, region, button_opened, person_widget_definition_id, z_index, minimized, unique_id, height, pinned, name, column_pos, width, button_id, collapsed, maximized, state_position, active, dashboard_id, y, x, widget_guid)
		SELECT id, version, CONVERT(nvarchar(15), region), button_opened, person_widget_definition_id, z_index, minimized, CONVERT(nvarchar(255), unique_id), height, pinned, CONVERT(nvarchar(200), name), column_pos, width, CONVERT(nvarchar(255), button_id), collapsed, maximized, state_position, active, dashboard_id, y, x, widget_guid FROM dbo.dashboard_widget_state WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_dashboard_widget_state OFF
GO
ALTER TABLE dbo.eventing_connections
	DROP CONSTRAINT FKBCC1569E49776512
GO
DROP TABLE dbo.dashboard_widget_state
GO
EXECUTE sp_rename N'dbo.Tmp_dashboard_widget_state', N'dashboard_widget_state', 'OBJECT'
GO
ALTER TABLE dbo.dashboard_widget_state ADD CONSTRAINT
	PK__dashboard_widget__7F60ED59 PRIMARY KEY CLUSTERED
	(
	id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.dashboard_widget_state ADD CONSTRAINT
	UQ__dashboard_widget__00551192 UNIQUE NONCLUSTERED
	(
	unique_id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.dashboard_widget_state ADD CONSTRAINT
	FKB6440EA1EDEDBBC2 FOREIGN KEY
	(
	person_widget_definition_id
	) REFERENCES dbo.person_widget_definition
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
ALTER TABLE dbo.dashboard_widget_state ADD CONSTRAINT
	FKB6440EA1FDD6991A FOREIGN KEY
	(
	dashboard_id
	) REFERENCES dbo.dashboard
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.eventing_connections ADD CONSTRAINT
	FKBCC1569E49776512 FOREIGN KEY
	(
	dashboard_widget_state_id
	) REFERENCES dbo.dashboard_widget_state
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
-- update dashboard_widget_state varchar fields to nvarchar

-- update eventing_connections varchar fields to nvarchar
alter table eventing_connections alter column widget_guid nvarchar(255) not null;
-- update eventing_connections varchar fields to nvarchar

-- update person varchar fields to nvarchar
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_person
	(
	id numeric(19, 0) NOT NULL IDENTITY (1, 1),
	version numeric(19, 0) NOT NULL,
	enabled tinyint NOT NULL,
	user_real_name nvarchar(200) NOT NULL,
	username nvarchar(200) NOT NULL,
	last_login datetime NULL,
	email_show tinyint NOT NULL,
	email nvarchar(255) NULL,
	description nvarchar(255) NULL
	)  ON [PRIMARY]
GO
SET IDENTITY_INSERT dbo.Tmp_person ON
GO
IF EXISTS(SELECT * FROM dbo.person)
	 EXEC('INSERT INTO dbo.Tmp_person (id, version, enabled, user_real_name, username, last_login, email_show, email, description)
		SELECT id, version, enabled, CONVERT(nvarchar(200), user_real_name), CONVERT(nvarchar(200), username), last_login, email_show, CONVERT(nvarchar(255), email), CONVERT(nvarchar(255), description) FROM dbo.person WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_person OFF
GO
ALTER TABLE dbo.person_widget_definition
	DROP CONSTRAINT FK6F5C17C4C12321BA
GO
ALTER TABLE dbo.preference
	DROP CONSTRAINT FKA8FCBCDB85837584
GO
ALTER TABLE dbo.role_people
	DROP CONSTRAINT FK28B75E78C12321BA
GO
ALTER TABLE dbo.dashboard
	DROP CONSTRAINT FKC18AEA9485837584
GO
DROP TABLE dbo.person
GO
EXECUTE sp_rename N'dbo.Tmp_person', N'person', 'OBJECT'
GO
ALTER TABLE dbo.person ADD CONSTRAINT
	PK__person__0425A276 PRIMARY KEY CLUSTERED
	(
	id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.person ADD CONSTRAINT
	UQ__person__0519C6AF UNIQUE NONCLUSTERED
	(
	username
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.dashboard ADD CONSTRAINT
	FKC18AEA9485837584 FOREIGN KEY
	(
	user_id
	) REFERENCES dbo.person
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.role_people ADD CONSTRAINT
	FK28B75E78C12321BA FOREIGN KEY
	(
	person_id
	) REFERENCES dbo.person
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.preference ADD CONSTRAINT
	FKA8FCBCDB85837584 FOREIGN KEY
	(
	user_id
	) REFERENCES dbo.person
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.person_widget_definition ADD CONSTRAINT
	FK6F5C17C4C12321BA FOREIGN KEY
	(
	person_id
	) REFERENCES dbo.person
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
-- update person varchar fields to nvarchar

-- update preference varchar fields to nvarchar
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.preference
	DROP CONSTRAINT FKA8FCBCDB85837584
GO
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_preference
	(
	id numeric(19, 0) NOT NULL IDENTITY (1, 1),
	version numeric(19, 0) NOT NULL,
	value ntext NOT NULL,
	path nvarchar(200) NOT NULL,
	user_id numeric(19, 0) NOT NULL,
	namespace nvarchar(200) NOT NULL
	)  ON [PRIMARY]
	 TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT dbo.Tmp_preference ON
GO
IF EXISTS(SELECT * FROM dbo.preference)
	 EXEC('INSERT INTO dbo.Tmp_preference (id, version, value, path, user_id, namespace)
		SELECT id, version, CONVERT(ntext, value), CONVERT(nvarchar(200), path), user_id, CONVERT(nvarchar(200), namespace) FROM dbo.preference WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_preference OFF
GO
DROP TABLE dbo.preference
GO
EXECUTE sp_rename N'dbo.Tmp_preference', N'preference', 'OBJECT'
GO
ALTER TABLE dbo.preference ADD CONSTRAINT
	PK__preference__09DE7BCC PRIMARY KEY CLUSTERED
	(
	id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.preference ADD CONSTRAINT
	UQ__preference__0AD2A005 UNIQUE NONCLUSTERED
	(
	path,
	namespace,
	user_id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.preference ADD CONSTRAINT
	FKA8FCBCDB85837584 FOREIGN KEY
	(
	user_id
	) REFERENCES dbo.person
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
-- update preference varchar fields to nvarchar

-- update requestmap varchar fields to nvarchar
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_requestmap
	(
	id numeric(19, 0) NOT NULL IDENTITY (1, 1),
	version numeric(19, 0) NOT NULL,
	url nvarchar(255) NOT NULL,
	config_attribute nvarchar(255) NOT NULL
	)  ON [PRIMARY]
GO
SET IDENTITY_INSERT dbo.Tmp_requestmap ON
GO
IF EXISTS(SELECT * FROM dbo.requestmap)
	 EXEC('INSERT INTO dbo.Tmp_requestmap (id, version, url, config_attribute)
		SELECT id, version, CONVERT(nvarchar(255), url), CONVERT(nvarchar(255), config_attribute) FROM dbo.requestmap WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_requestmap OFF
GO
DROP TABLE dbo.requestmap
GO
EXECUTE sp_rename N'dbo.Tmp_requestmap', N'requestmap', 'OBJECT'
GO
ALTER TABLE dbo.requestmap ADD CONSTRAINT
	PK__requestmap__0CBAE877 PRIMARY KEY CLUSTERED
	(
	id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.requestmap ADD CONSTRAINT
	UQ__requestmap__0DAF0CB0 UNIQUE NONCLUSTERED
	(
	url
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
COMMIT
-- update requestmap varchar fields to nvarchar

-- update role varchar fields to nvarchar
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_role
	(
	id numeric(19, 0) NOT NULL IDENTITY (1, 1),
	version numeric(19, 0) NOT NULL,
	authority nvarchar(255) NOT NULL,
	description nvarchar(255) NOT NULL
	)  ON [PRIMARY]
GO
SET IDENTITY_INSERT dbo.Tmp_role ON
GO
IF EXISTS(SELECT * FROM dbo.role)
	 EXEC('INSERT INTO dbo.Tmp_role (id, version, authority, description)
		SELECT id, version, CONVERT(nvarchar(255), authority), CONVERT(nvarchar(255), description) FROM dbo.role WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_role OFF
GO
ALTER TABLE dbo.role_people
	DROP CONSTRAINT FK28B75E7852388A1A
GO
DROP TABLE dbo.role
GO
EXECUTE sp_rename N'dbo.Tmp_role', N'role', 'OBJECT'
GO
ALTER TABLE dbo.role ADD CONSTRAINT
	PK__role__0F975522 PRIMARY KEY CLUSTERED
	(
	id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.role ADD CONSTRAINT
	UQ__role__108B795B UNIQUE NONCLUSTERED
	(
	authority
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.role_people ADD CONSTRAINT
	FK28B75E7852388A1A FOREIGN KEY
	(
	role_id
	) REFERENCES dbo.role
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
-- update role varchar fields to nvarchar

-- update tag_links varchar fields to nvarchar
alter table tag_links alter column type nvarchar(255) not null;
-- update tag_links varchar fields to nvarchar

-- update tags varchar fields to nvarchar
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_tags
	(
	id numeric(19, 0) NOT NULL IDENTITY (1, 1),
	version numeric(19, 0) NOT NULL,
	name nvarchar(255) NOT NULL
	)  ON [PRIMARY]
GO
SET IDENTITY_INSERT dbo.Tmp_tags ON
GO
IF EXISTS(SELECT * FROM dbo.tags)
	 EXEC('INSERT INTO dbo.Tmp_tags (id, version, name)
		SELECT id, version, CONVERT(nvarchar(255), name) FROM dbo.tags WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_tags OFF
GO
ALTER TABLE dbo.tag_links
	DROP CONSTRAINT FK7C35D6D45A3B441D
GO
DROP TABLE dbo.tags
GO
EXECUTE sp_rename N'dbo.Tmp_tags', N'tags', 'OBJECT'
GO
ALTER TABLE dbo.tags ADD CONSTRAINT
	PK__tags__164452B1 PRIMARY KEY CLUSTERED
	(
	id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.tags ADD CONSTRAINT
	UQ__tags__173876EA UNIQUE NONCLUSTERED
	(
	name
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.tag_links ADD CONSTRAINT
	FK7C35D6D45A3B441D FOREIGN KEY
	(
	tag_id
	) REFERENCES dbo.tags
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
-- update tags varchar fields to nvarchar

-- update widget_definition varchar fields to nvarchar
BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
CREATE TABLE dbo.Tmp_widget_definition
	(
	id numeric(19, 0) NOT NULL IDENTITY (1, 1),
	version numeric(19, 0) NOT NULL,
	image_url_large nvarchar(2083) NOT NULL,
	image_url_small nvarchar(2083) NOT NULL,
	width int NOT NULL,
	widget_version nvarchar(2083) NOT NULL,
	height int NOT NULL,
	widget_url nvarchar(2083) NOT NULL,
	widget_guid nvarchar(255) NOT NULL,
	display_name nvarchar(200) NOT NULL,
	visible tinyint NULL
	)  ON [PRIMARY]
GO
SET IDENTITY_INSERT dbo.Tmp_widget_definition ON
GO
IF EXISTS(SELECT * FROM dbo.widget_definition)
	 EXEC('INSERT INTO dbo.Tmp_widget_definition (id, version, image_url_large, image_url_small, width, widget_version, height, widget_url, widget_guid, display_name, visible)
		SELECT id, version, CONVERT(nvarchar(2083), image_url_large), CONVERT(nvarchar(2083), image_url_small), width, CONVERT(nvarchar(2083), widget_version), height, CONVERT(nvarchar(2083), widget_url), CONVERT(nvarchar(255), widget_guid), CONVERT(nvarchar(200), display_name), visible FROM dbo.widget_definition WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_widget_definition OFF
GO
ALTER TABLE dbo.person_widget_definition
	DROP CONSTRAINT FK6F5C17C4F7CB67A3
GO
DROP TABLE dbo.widget_definition
GO
EXECUTE sp_rename N'dbo.Tmp_widget_definition', N'widget_definition', 'OBJECT'
GO
ALTER TABLE dbo.widget_definition ADD CONSTRAINT
	PK__widget_definitio__1920BF5C PRIMARY KEY CLUSTERED
	(
	id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.widget_definition ADD CONSTRAINT
	UQ__widget_definitio__1A14E395 UNIQUE NONCLUSTERED
	(
	widget_guid
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.person_widget_definition ADD CONSTRAINT
	FK6F5C17C4F7CB67A3 FOREIGN KEY
	(
	widget_definition_id
	) REFERENCES dbo.widget_definition
	(
	id
	) ON UPDATE  NO ACTION
	 ON DELETE  NO ACTION

GO
COMMIT
-- update widget_definition varchar fields to nvarchar

-- old constraints
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


-- new constraints
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
