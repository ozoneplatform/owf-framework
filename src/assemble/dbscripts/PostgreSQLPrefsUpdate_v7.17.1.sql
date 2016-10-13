-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 8/24/15 8:59 AM
-- Against: postgres@jdbc:postgresql://localhost:5432/postgres
-- Liquibase version: 2.0.5
-- *********************************************************************

-- Lock Database
-- Changeset changelog_4.0.0.groovy::4.0.0-5::owf::(Checksum: 3:3b9f19a527785869ce833dfbf6466f01)
-- deleting old sample data
DELETE FROM role;

DELETE FROM requestmap;

DELETE FROM preference;

DELETE FROM owf_group_people;

DELETE FROM person_widget_definition;

DELETE FROM person;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'deleting old sample data', NOW(), 'Delete Data (x7)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-5', '2.0.5', '3:3b9f19a527785869ce833dfbf6466f01', 1);

-- Changeset changelog_4.0.0.groovy::4.0.0-7::owf::(Checksum: 3:56bfda152e35ce325993eb717dc97ddd)
-- insert new sample data
INSERT INTO person (description, email, email_show, enabled, id, user_real_name, username, "version") VALUES ('Test Administrator 1', 'testAdmin1@ozone3.test', FALSE, TRUE, 1, 'Test Admin 1', 'testAdmin1', 0);

INSERT INTO person (description, email, email_show, enabled, id, user_real_name, username, "version") VALUES ('Test User 1', 'testUser1@ozone3.test', FALSE, TRUE, 2, 'Test User 1', 'testUser1', 0);

INSERT INTO person (description, email, email_show, enabled, id, user_real_name, username, "version") VALUES ('Test User 2', 'testUser1@ozone3.test', FALSE, TRUE, 3, 'Test User 2', 'testUser2', 0);

INSERT INTO person (email_show, enabled, id, user_real_name, username, "version") VALUES (FALSE, TRUE, 28, 'DEFAULT_USER', 'DEFAULT_USER', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-7', '2.0.5', '3:56bfda152e35ce325993eb717dc97ddd', 2);

-- Changeset changelog_4.0.0.groovy::4.0.0-10::owf::(Checksum: 3:fd66bf062e93278e617b7d168b5669ec)
-- insert new sample data
INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget A', 565, 6, 'themes/common/images/blue/icons/widgetIcons/widgetA.gif', 'themes/common/images/blue/icons/widgetContainer/widgetAsm.gif', FALSE, 0, TRUE, 'ea5435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-a.html', '1.0', 615);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget B', 635, 7, 'themes/common/images/blue/icons/widgetIcons/widgetB.gif', 'themes/common/images/blue/icons/widgetContainer/widgetBsm.gif', FALSE, 0, TRUE, 'fb5435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-b.html', '1.0', 565);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget C', 740, 8, 'themes/common/images/blue/icons/widgetIcons/widgetC.gif', 'themes/common/images/blue/icons/widgetContainer/widgetCsm.gif', FALSE, 0, TRUE, '0c5435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-c.html', '1.0', 980);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget D', 525, 9, 'themes/common/images/blue/icons/widgetIcons/widgetD.gif', 'themes/common/images/blue/icons/widgetContainer/widgetDsm.gif', FALSE, 0, TRUE, '1d5435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-d.html', '1.0', 630);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget One', 405, 10, 'themes/common/images/blue/icons/widgetIcons/widget1.gif', 'themes/common/images/blue/icons/widgetContainer/widget1sm.gif', FALSE, 0, TRUE, 'd6543ccf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-one.html', '1.0', 625);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget Two', 635, 11, 'themes/common/images/blue/icons/widgetIcons/widget2.gif', 'themes/common/images/blue/icons/widgetContainer/widget2sm.gif', FALSE, 0, TRUE, 'e65431cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-two.html', '1.0', 610);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget Three', 540, 12, 'themes/common/images/blue/icons/widgetIcons/widget3.gif', 'themes/common/images/blue/icons/widgetContainer/widget3sm.gif', FALSE, 0, TRUE, 'a65432cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-three.html', '1.0', 630);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget Four', 350, 13, 'themes/common/images/blue/icons/widgetIcons/widget4.gif', 'themes/common/images/blue/icons/widgetContainer/widget4sm.gif', FALSE, 0, TRUE, 'b65434cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-four.html', '1.0', 675);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget Five', 630, 14, 'themes/common/images/blue/icons/widgetIcons/widget5.gif', 'themes/common/images/blue/icons/widgetContainer/widget5sm.gif', FALSE, 0, TRUE, 'c65435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-five.html', '1.0', 615);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Nearly Empty', 440, 15, 'themes/common/images/blue/icons/widgetIcons/nearlyEmpty.gif', 'themes/common/images/blue/icons/widgetContainer/nearlyEmptysm.gif', FALSE, 0, TRUE, 'bc5435cf-4021-4f2a-ba69-dde451d12551', 'examples/walkthrough/widgets/NearlyEmptyWidget.html', '1.0', 540);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Channel Shouter', 250, 16, 'themes/common/images/blue/icons/widgetIcons/channelShouter.gif', 'themes/common/images/blue/icons/widgetContainer/channelShoutersm.gif', FALSE, 0, TRUE, 'eb5435cf-4021-4f2a-ba69-dde451d12551', 'examples/walkthrough/widgets/ChannelShouter.html', '1.0', 295);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Channel Listener', 440, 17, 'themes/common/images/blue/icons/widgetIcons/channelListener.gif', 'themes/common/images/blue/icons/widgetContainer/channelListenersm.gif', FALSE, 0, TRUE, 'ec5435cf-4021-4f2a-ba69-dde451d12551', 'examples/walkthrough/widgets/ChannelListener.html', '1.0', 540);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget Chrome', 440, 18, 'examples/walkthrough/images/chromeWiget_black_icon.png', 'examples/walkthrough/images/chromeWiget_blue_icon.png', FALSE, 0, TRUE, 'e8687289-f595-4b6d-9911-c714b483509d', 'examples/walkthrough/widgets/WidgetChrome.html', '1.0', 540);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Event Monitor Widget', 600, 19, 'examples/walkthrough/images/event_monitor_black_icon.png', 'examples/walkthrough/images/event_monitor_blue_icon.png', FALSE, 0, TRUE, '9d2e5f85-e199-4c6a-be31-4c6954206687', 'examples/walkthrough/widgets/EventMonitor.html', '1.0', 500);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Widget Log', 440, 20, 'examples/walkthrough/images/log_icon.png', 'examples/walkthrough/images/log_icon_blue.png', FALSE, 0, TRUE, '4854fbd4-395c-442b-95c6-8b60702fd2b4', 'examples/walkthrough/widgets/WidgetLog.html', '1.0', 540);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Preferences Widget', 300, 21, 'examples/walkthrough/images/testpref_black_icon.png', 'examples/walkthrough/images/testpref_blue_icon.png', FALSE, 0, TRUE, '920b7cc1-dd37-46ac-8457-afda62613e56', 'examples/walkthrough/widgets/Preferences.html', '1.0', 450);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x16)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-10', '2.0.5', '3:fd66bf062e93278e617b7d168b5669ec', 3);

-- Changeset changelog_4.0.0.groovy::4.0.0-13::owf::(Checksum: 3:9afedfdceca81eb01f07082c8402076b)
-- insert new sample data
INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (29, 1, 0, 0, TRUE, 6);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (30, 1, 1, 0, TRUE, 7);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (31, 1, 2, 0, TRUE, 8);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (32, 1, 3, 0, TRUE, 9);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (33, 1, 4, 0, TRUE, 10);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (34, 1, 5, 0, TRUE, 11);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (35, 1, 6, 0, TRUE, 12);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (36, 1, 7, 0, TRUE, 13);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (37, 1, 8, 0, TRUE, 14);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (38, 1, 9, 0, TRUE, 15);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (39, 1, 10, 0, TRUE, 16);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (40, 1, 11, 0, TRUE, 17);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (41, 1, 12, 0, TRUE, 18);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (42, 1, 13, 0, TRUE, 19);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (43, 1, 14, 0, TRUE, 20);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (44, 1, 15, 0, TRUE, 21);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (45, 2, 0, 0, TRUE, 6);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (46, 2, 1, 0, TRUE, 7);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (47, 2, 2, 0, TRUE, 8);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (48, 2, 3, 0, TRUE, 9);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (49, 2, 4, 0, TRUE, 10);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (50, 2, 5, 0, TRUE, 11);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (51, 2, 6, 0, TRUE, 12);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (52, 2, 7, 0, TRUE, 13);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (53, 2, 8, 0, TRUE, 14);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (54, 2, 9, 0, TRUE, 15);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (55, 2, 10, 0, TRUE, 16);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (56, 2, 11, 0, TRUE, 17);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (57, 2, 12, 0, TRUE, 18);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (58, 2, 13, 0, TRUE, 19);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (59, 2, 14, 0, TRUE, 20);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (60, 2, 15, 0, TRUE, 21);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (61, 3, 0, 0, TRUE, 6);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (62, 3, 1, 0, TRUE, 7);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (63, 3, 2, 0, TRUE, 8);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (64, 3, 3, 0, TRUE, 9);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (65, 3, 4, 0, TRUE, 10);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (66, 3, 5, 0, TRUE, 11);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (67, 3, 6, 0, TRUE, 12);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (68, 3, 7, 0, TRUE, 13);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (69, 3, 8, 0, TRUE, 14);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (70, 3, 9, 0, TRUE, 15);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (71, 3, 10, 0, TRUE, 16);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (72, 3, 11, 0, TRUE, 17);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (73, 3, 12, 0, TRUE, 18);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (74, 3, 13, 0, TRUE, 19);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (75, 3, 14, 0, TRUE, 20);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (76, 3, 15, 0, TRUE, 21);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (77, 28, 0, 0, TRUE, 6);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (78, 28, 1, 0, TRUE, 7);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (79, 28, 2, 0, TRUE, 8);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (80, 28, 3, 0, TRUE, 9);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (81, 28, 4, 0, TRUE, 10);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (82, 28, 5, 0, TRUE, 11);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (83, 28, 6, 0, TRUE, 12);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (84, 28, 7, 0, TRUE, 13);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (85, 28, 8, 0, TRUE, 14);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (86, 28, 9, 0, TRUE, 15);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (87, 28, 10, 0, TRUE, 16);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (88, 28, 11, 0, TRUE, 17);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (89, 28, 12, 0, TRUE, 18);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (90, 28, 13, 0, TRUE, 19);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (91, 28, 14, 0, TRUE, 20);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (92, 28, 15, 0, TRUE, 21);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x64)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-13', '2.0.5', '3:9afedfdceca81eb01f07082c8402076b', 4);

-- Changeset changelog_4.0.0.groovy::4.0.0-22-pg::owf::(Checksum: 3:3f68a22fde7bb355d73e1aeb37dc7f60)
-- insert new sample data
INSERT INTO owf_group (automatic, description, email, id, name, status, "version") VALUES (FALSE, 'TestGroup1', 'testgroup1@group1.com', nextval('hibernate_sequence'), 'TestGroup1', 'active', 0);

INSERT INTO owf_group (automatic, description, email, id, name, status, "version") VALUES (FALSE, 'TestGroup2', 'testgroup2@group2.com', nextval('hibernate_sequence'), 'TestGroup2', 'active', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-22-pg', '2.0.5', '3:3f68a22fde7bb355d73e1aeb37dc7f60', 5);

-- Changeset changelog_4.0.0.groovy::4.0.0-25::owf::(Checksum: 3:8a77971774b9c8e11f104b41bd7751ce)
-- insert new sample data
INSERT INTO owf_group_people (group_id, person_id) VALUES ((SELECT id FROM owf_group WHERE description = 'TestGroup1'), 2);

INSERT INTO owf_group_people (group_id, person_id) VALUES ((SELECT id FROM owf_group WHERE description = 'TestGroup1'), 1);

INSERT INTO owf_group_people (group_id, person_id) VALUES ((SELECT id FROM owf_group WHERE description = 'TestGroup2'), 2);

INSERT INTO owf_group_people (group_id, person_id) VALUES ((SELECT id FROM owf_group WHERE description = 'TestGroup2'), 1);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-25', '2.0.5', '3:8a77971774b9c8e11f104b41bd7751ce', 6);

-- Changeset changelog_4.0.0.groovy::4.0.0-28::owf::(Checksum: 3:56cf365e11bb693bc75b4131efbc4556)
-- insert new sample data
INSERT INTO role (authority, description, id, "version") VALUES ('ROLE_USER', 'User Role', 26, 2);

INSERT INTO role (authority, description, id, "version") VALUES ('ROLE_ADMIN', 'Admin Role', 27, 1);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-28', '2.0.5', '3:56cf365e11bb693bc75b4131efbc4556', 7);

-- Changeset changelog_4.0.0.groovy::4.0.0-31::owf::(Checksum: 3:4318d8906f61a4c4429c3af056f06c87)
-- insert new sample data
INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-31', '2.0.5', '3:4318d8906f61a4c4429c3af056f06c87', 8);

-- Changeset changelog_4.0.0.groovy::4.0.0-34::owf::(Checksum: 3:62011f2458c9d6a9f4884f2c3349dab8)
-- insert new sample data
INSERT INTO preference (id, namespace, path, user_id, value, "version") VALUES (144, 'foo.bar.0', 'test path entry 0', 2, 'foovalue', 0);

INSERT INTO preference (id, namespace, path, user_id, value, "version") VALUES (145, 'foo.bar.1', 'test path entry 1', 2, 'foovalue', 0);

INSERT INTO preference (id, namespace, path, user_id, value, "version") VALUES (146, 'foo.bar.0', 'test path entry 0', 3, 'foovalue', 0);

INSERT INTO preference (id, namespace, path, user_id, value, "version") VALUES (147, 'foo.bar.1', 'test path entry 1', 3, 'foovalue', 0);

INSERT INTO preference (id, namespace, path, user_id, value, "version") VALUES (148, 'foo.bar.0', 'test path entry 0', 1, 'foovalue', 0);

INSERT INTO preference (id, namespace, path, user_id, value, "version") VALUES (149, 'foo.bar.1', 'test path entry 1', 1, 'foovalue', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x6)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-34', '2.0.5', '3:62011f2458c9d6a9f4884f2c3349dab8', 9);

-- Changeset changelog_4.0.0.groovy::4.0.0-37::owf::(Checksum: 3:5c360e73f9773ed7543ffa3864440de5)
-- insert new sample data
INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (6, 'widget_definition', 22, 'owns', (SELECT id FROM owf_group WHERE description = 'TestGroup1'), 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (7, 'widget_definition', 23, 'owns', (SELECT id FROM owf_group WHERE description = 'TestGroup1'), 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (6, 'widget_definition', 24, 'owns', (SELECT id FROM owf_group WHERE description = 'TestGroup2'), 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (7, 'widget_definition', 25, 'owns', (SELECT id FROM owf_group WHERE description = 'TestGroup2'), 'group', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-37', '2.0.5', '3:5c360e73f9773ed7543ffa3864440de5', 10);

-- Changeset changelog_4.0.0.groovy::4.0.0-40::owf::(Checksum: 3:7c595f960a0d9cbaec670333fdbaea32)
-- insert new sample data
INSERT INTO tags (id, name, "version") VALUES (152, 'admin', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-40', '2.0.5', '3:7c595f960a0d9cbaec670333fdbaea32', 11);

-- Changeset changelog_4.0.0.groovy::4.0.0-43::owf::(Checksum: 3:2241715a9f8abce9ffed932735763bcc)
-- insert new sample data
INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 153, -1, 152, 151, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 155, -1, 152, 154, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 157, -1, 152, 156, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 159, -1, 152, 158, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 162, -1, 152, 160, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 164, -1, 152, 163, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 165, -1, 152, 161, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 169, -1, 152, 166, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 168, -1, 152, 167, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 172, -1, 152, 170, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 173, -1, 152, 171, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 176, -1, 152, 174, 'personWidgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 178, -1, 152, 177, 'personWidgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 180, -1, 152, 179, 'personWidgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 182, -1, 152, 181, 'personWidgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 184, -1, 152, 183, 'personWidgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 186, -1, 152, 185, 'personWidgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 188, -1, 152, 187, 'personWidgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 190, -1, 152, 189, 'personWidgetDefinition', 0, TRUE);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x19)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-43', '2.0.5', '3:2241715a9f8abce9ffed932735763bcc', 12);

-- Changeset changelog_4.0.0.groovy::4.0.0-45::owf::(Checksum: 3:4653ac19f692092c9152eaeb1230513d)
-- set sequence to higher number that is not used
DROP SEQUENCE hibernate_sequence CASCADE;

CREATE SEQUENCE hibernate_sequence START WITH 300;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'set sequence to higher number that is not used', NOW(), 'Drop Sequence, Create Sequence', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-45', '2.0.5', '3:4653ac19f692092c9152eaeb1230513d', 13);

-- Changeset changelog_4.0.0.groovy::4.0.0-46::owf::(Checksum: 3:5c1705f46d07fab68b80494982589ffe)
UPDATE widget_definition SET widget_url = 'examples/walkthrough/widgets/ChannelListener.gsp' WHERE widget_url='examples/walkthrough/widgets/ChannelListener.html';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', NOW(), 'Update Data', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-46', '2.0.5', '3:5c1705f46d07fab68b80494982589ffe', 14);

-- Changeset changelog_4.0.0.groovy::4.0.0-53::owf::(Checksum: 3:1403c4465e34710942db21922684cf79)
-- Insert widget type mapping links
insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
      select id, 1 from widget_definition
      where widget_url not in (
        'admin/DashboardEdit.gsp',
        'admin/GroupDashboardManagement.gsp',
        'admin/GroupEdit.gsp',
        'admin/GroupManagement.gsp',
        'admin/MarketplaceApprovals.gsp',
        'admin/UserManagement.gsp',
        'admin/UserEdit.gsp',
        'admin/WidgetEdit.gsp',
        'admin/WidgetManagement.gsp',
        'admin/StackEdit.gsp',
        'admin/StackManagement.gsp',
        'admin/Configuration.gsp'
        );

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Insert widget type mapping links', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-53', '2.0.5', '3:1403c4465e34710942db21922684cf79', 15);

-- Changeset changelog_5.0.0.groovy::5.0.0-5::owf::(Checksum: 3:9fe287989b0eecb53ec72dc98e0c2737)
-- Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.
UPDATE owf_group SET automatic = TRUE, name = 'OWF Users' WHERE name='All Users' AND automatic=false;

UPDATE owf_group SET automatic = TRUE, name = 'OWF Administrators' WHERE name='OWF Admins' AND automatic=false;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.', NOW(), 'Update Data (x2)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-5', '2.0.5', '3:9fe287989b0eecb53ec72dc98e0c2737', 16);

-- Changeset changelog_5.0.0.groovy::5.0.0-6::owf::(Checksum: 3:96aa216a330817681aca38dc66d1129b)
-- Set default value for display_name
UPDATE owf_group
			SET display_name = name
			WHERE display_name IS NULL;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Set default value for display_name', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-6', '2.0.5', '3:96aa216a330817681aca38dc66d1129b', 17);

-- Changeset changelog_5.0.0.groovy::5.0.0-7::owf::(Checksum: 3:55a215b64becd106729fc560fca74a21)
-- Updating Sample Widget URLs
UPDATE widget_definition SET widget_url = 'examples/walkthrough/widgets/ChannelShouter.gsp' WHERE widget_url='examples/walkthrough/widgets/ChannelShouter.html';

UPDATE widget_definition SET widget_url = 'examples/walkthrough/widgets/Preferences.gsp' WHERE widget_url='examples/walkthrough/widgets/Preferences.html';

UPDATE widget_definition SET widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp' WHERE widget_url='examples/walkthrough/widgets/WidgetChrome.html';

UPDATE widget_definition SET widget_url = 'examples/walkthrough/widgets/WidgetLog.gsp' WHERE widget_url='examples/walkthrough/widgets/WidgetLog.html';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Updating Sample Widget URLs', NOW(), 'Update Data (x4)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-7', '2.0.5', '3:55a215b64becd106729fc560fca74a21', 18);

-- Changeset changelog_5.0.0.groovy::5.0.0-15::owf::(Checksum: 3:c36f95cacf07258117ef6c86d3f7cb4c)
-- insert new sample data
INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Color Server', 300, 172, 'themes/common/images/blue/icons/widgetIcons/channelShouter.gif', 'themes/common/images/blue/icons/widgetContainer/channelShoutersm.gif', FALSE, 0, TRUE, '2410a41d-0bc9-cee6-2645-a89087da374f', 'examples/walkthrough/widgets/ColorServer.gsp', '1.0', 300);

INSERT INTO widget_definition (background, display_name, height, id, image_url_medium, image_url_small, singleton, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'Color Client', 300, 173, 'themes/common/images/blue/icons/widgetIcons/channelListener.gif', 'themes/common/images/blue/icons/widgetContainer/channelListenersm.gif', FALSE, 0, TRUE, '4bc8e886-b576-3dac-015d-589b4813ceda', 'examples/walkthrough/widgets/ColorClient.gsp', '1.0', 300);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-15', '2.0.5', '3:c36f95cacf07258117ef6c86d3f7cb4c', 19);

-- Changeset changelog_5.0.0.groovy::5.0.0-18::owf::(Checksum: 3:2101485c508626863f8c60d6dcb83305)
-- insert new sample data
INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (190, 28, 16, 0, TRUE, 173);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (191, 1, 16, 0, TRUE, 173);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (192, 2, 16, 0, TRUE, 173);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (193, 3, 16, 0, TRUE, 173);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (194, 28, 17, 0, TRUE, 172);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (195, 1, 17, 0, TRUE, 172);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (196, 2, 17, 0, TRUE, 172);

INSERT INTO person_widget_definition (id, person_id, pwd_position, "version", visible, widget_definition_id) VALUES (197, 3, 17, 0, TRUE, 172);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x8)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-18', '2.0.5', '3:2101485c508626863f8c60d6dcb83305', 20);

-- Changeset changelog_5.0.0.groovy::5.0.0-23::owf::(Checksum: 3:77d50cef2581b1cd4a89ea3c9040b73a)
-- insert new sample data
INSERT INTO widget_definition_widget_types (widget_definition_id, widget_type_id) VALUES (172, 1);

INSERT INTO widget_definition_widget_types (widget_definition_id, widget_type_id) VALUES (173, 1);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-23', '2.0.5', '3:77d50cef2581b1cd4a89ea3c9040b73a', 21);

-- Changeset changelog_6.0.0.groovy::6.0.0-19::owf::(Checksum: 3:8069902921131448776b655c9d970882)
-- insert new sample data
INSERT INTO widget_definition (background, description, descriptor_url, display_name, height, id, image_url_medium, image_url_small, singleton, universal_name, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'This widget displays the end of day report for the New York Stock Exchange.', '../examples/walkthrough/descriptors/NYSE_descriptor.html', 'NYSE Widget', 437, 178, 'themes/common/images/blue/icons/widgetIcons/widgetC.gif', 'themes/common/images/blue/icons/widgetContainer/widgetCsm.gif', FALSE, 'org.owfgoss.owf.examples.NYSE', 0, TRUE, 'fe137961-039d-e7a5-7050-d6eed7ac4782', 'examples/walkthrough/widgets/NYSE.gsp', '1.0', 825);

INSERT INTO widget_definition (background, description, descriptor_url, display_name, height, id, image_url_medium, image_url_small, singleton, universal_name, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'This widget displays HTML.', '../examples/walkthrough/descriptors/HTMLViewer_descriptor.html', 'HTML Viewer', 600, 179, 'themes/common/images/blue/icons/widgetIcons/widgetC.gif', 'themes/common/images/blue/icons/widgetContainer/widgetCsm.gif', FALSE, 'org.owfgoss.owf.examples.HTMLViewer', 0, TRUE, 'cd5e77f8-cb28-8574-0a8a-a535bd2c7de4', 'examples/walkthrough/widgets/HTMLViewer.gsp', '1.0', 400);

INSERT INTO widget_definition (background, description, descriptor_url, display_name, height, id, image_url_medium, image_url_small, singleton, universal_name, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'This widget charts stock prices.', '../examples/walkthrough/descriptors/StockChart_descriptor.html', 'Stock Chart', 600, 180, 'themes/common/images/blue/icons/widgetIcons/widgetC.gif', 'themes/common/images/blue/icons/widgetContainer/widgetCsm.gif', FALSE, 'org.owfgoss.owf.examples.StockChart', 0, TRUE, '92078ac9-6f21-2f5f-6afc-bdc8c915c66d', 'examples/walkthrough/widgets/StockChart.gsp', '1.0', 800);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-19', '2.0.5', '3:8069902921131448776b655c9d970882', 22);

-- Changeset changelog_6.0.0.groovy::6.0.0-20::owf::(Checksum: 3:4b2eabcf9c66a32485f65255d22f142f)
-- insert new sample data
INSERT INTO widget_definition_widget_types (widget_definition_id, widget_type_id) VALUES (178, 1);

INSERT INTO widget_definition_widget_types (widget_definition_id, widget_type_id) VALUES (179, 1);

INSERT INTO widget_definition_widget_types (widget_definition_id, widget_type_id) VALUES (180, 1);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-20', '2.0.5', '3:4b2eabcf9c66a32485f65255d22f142f', 23);

-- Changeset changelog_6.0.0.groovy::6.0.0-23::owf::(Checksum: 3:2ef3a5917ef4c44ca618a48bc22f35a2)
-- Add OWF Users group
INSERT INTO owf_group (automatic, description, display_name, id, name, status, "version") VALUES (TRUE, 'OWF Users', 'OWF Users', 192, 'OWF Users', 'active', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add OWF Users group', NOW(), 'Insert Row', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-23', '2.0.5', '3:2ef3a5917ef4c44ca618a48bc22f35a2', 24);

-- Changeset changelog_6.0.0.groovy::6.0.0-25::owf::(Checksum: 3:4653ac19f692092c9152eaeb1230513d)
-- set sequence to higher number that is not used
DROP SEQUENCE hibernate_sequence CASCADE;

CREATE SEQUENCE hibernate_sequence START WITH 300;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'set sequence to higher number that is not used', NOW(), 'Drop Sequence, Create Sequence', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-25', '2.0.5', '3:4653ac19f692092c9152eaeb1230513d', 25);

-- Changeset changelog_6.0.0.groovy::6.0.0-27::owf::(Checksum: 3:3fa5da9f6c183c928b5023132ad3f5e5)
-- insert new sample data
INSERT INTO intent (action, id, "version") VALUES ('Graph', 301, 0);

INSERT INTO intent (action, id, "version") VALUES ('View', 302, 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-27', '2.0.5', '3:3fa5da9f6c183c928b5023132ad3f5e5', 26);

-- Changeset changelog_6.0.0.groovy::6.0.0-30::owf::(Checksum: 3:4390a2bef918c69968b16fbd4ee8fcbb)
-- insert new sample data
INSERT INTO intent_data_type (data_type, id, "version") VALUES ('Prices', 303, 0);

INSERT INTO intent_data_type (data_type, id, "version") VALUES ('HTML', 304, 0);

INSERT INTO intent_data_types (intent_data_type_id, intent_id) VALUES (303, 301);

INSERT INTO intent_data_types (intent_data_type_id, intent_id) VALUES (304, 302);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-30', '2.0.5', '3:4390a2bef918c69968b16fbd4ee8fcbb', 27);

-- Changeset changelog_6.0.0.groovy::6.0.0-33::owf::(Checksum: 3:738a85e664c3c906cee14aff1ce53308)
-- insert new sample data
INSERT INTO widget_def_intent (id, intent_id, receive, send, "version", widget_definition_id) VALUES (305, 301, FALSE, TRUE, 0, 178);

INSERT INTO widget_def_intent (id, intent_id, receive, send, "version", widget_definition_id) VALUES (306, 302, FALSE, TRUE, 0, 178);

INSERT INTO widget_def_intent (id, intent_id, receive, send, "version", widget_definition_id) VALUES (307, 302, TRUE, FALSE, 0, 179);

INSERT INTO widget_def_intent (id, intent_id, receive, send, "version", widget_definition_id) VALUES (308, 301, TRUE, FALSE, 0, 180);

INSERT INTO widget_def_intent_data_types (intent_data_type_id, widget_definition_intent_id) VALUES (303, 305);

INSERT INTO widget_def_intent_data_types (intent_data_type_id, widget_definition_intent_id) VALUES (304, 306);

INSERT INTO widget_def_intent_data_types (intent_data_type_id, widget_definition_intent_id) VALUES (304, 307);

INSERT INTO widget_def_intent_data_types (intent_data_type_id, widget_definition_intent_id) VALUES (303, 308);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x8)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-33', '2.0.5', '3:738a85e664c3c906cee14aff1ce53308', 28);

-- Changeset changelog_6.0.0.groovy::6.0.0-36::owf::(Checksum: 3:d526ccb1874fe44c40d2400d52f82940)
-- insert new sample data
INSERT INTO tags (id, name, "version") VALUES (309, 'grid', 0);

INSERT INTO tags (id, name, "version") VALUES (310, 'html', 0);

INSERT INTO tags (id, name, "version") VALUES (311, 'document_viewer', 0);

INSERT INTO tags (id, name, "version") VALUES (312, 'stock_chart', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-36', '2.0.5', '3:d526ccb1874fe44c40d2400d52f82940', 29);

-- Changeset changelog_6.0.0.groovy::6.0.0-39::owf::(Checksum: 3:ac51eb6f9c799aed93ad91a3d2896bf8)
-- insert new sample data
INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 313, -1, 309, 178, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 314, -1, 310, 179, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 315, -1, 311, 179, 'widgetDefinition', 0, TRUE);

INSERT INTO tag_links (editable, id, pos, tag_id, tag_ref, type, "version", visible) VALUES (TRUE, 316, -1, 312, 180, 'widgetDefinition', 0, TRUE);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-39', '2.0.5', '3:ac51eb6f9c799aed93ad91a3d2896bf8', 30);

-- Changeset changelog_6.0.0.groovy::6.0.0-42::owf::(Checksum: 3:d3b657c01de77a08048bda392804e063)
-- insert new sample data
INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (178, 'widget_definition', 317, 'owns', 192, 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (179, 'widget_definition', 318, 'owns', 192, 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (180, 'widget_definition', 319, 'owns', 192, 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (16, 'widget_definition', 320, 'owns', 192, 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (17, 'widget_definition', 321, 'owns', 192, 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (20, 'widget_definition', 322, 'owns', 192, 'group', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x6)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-42', '2.0.5', '3:d3b657c01de77a08048bda392804e063', 31);

-- Changeset changelog_6.0.0.groovy::6.0.0-45::owf::(Checksum: 3:72d0cb8302a49259ece1210187f09264)
-- Removing Fake Widgets
DELETE FROM person_widget_definition WHERE widget_definition_id IN (SELECT id FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551'));

DELETE FROM widget_definition_widget_types WHERE widget_definition_id IN (SELECT id FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551'));

DELETE FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551');

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Removing Fake Widgets', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-45', '2.0.5', '3:72d0cb8302a49259ece1210187f09264', 32);

-- Changeset changelog_6.0.0.groovy::6.0.0-48::owf::(Checksum: 3:aca011745b5c0db4f5eb1d6a82c3394d)
-- Add Intents, Sample, and Administration Dashboards
INSERT INTO dashboard (altered_by_admin, dashboard_position, description, guid, id, isdefault, layout_config, name, "version") VALUES (FALSE, 0, 'This dashboard uses the sample Intents Widgets to demonstrate the widget intents workflow.', '3f59855b-d93e-dc03-c6ba-f4c33ea0177f', 320, TRUE, '{"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"container","cls":"hbox top","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"fe137961-039d-e7a5-7050-d6eed7ac4782","uniqueId":"ecbe0bd5-7781-d859-2dbc-13f86be406a7","dashboardGuid":"3f59855b-d93e-dc03-c6ba-f4c33ea0177f","paneGuid":"16ec8b84-a631-4e7c-d9cc-883635abd6ef","intentConfig":null,"launchData":null,"name":"NYSE Widget","active":true,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798,"background":false,"columnOrder":""}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"cd5e77f8-cb28-8574-0a8a-a535bd2c7de4","uniqueId":"66e7148e-3cd3-72ff-6a24-6143ac618b80","dashboardGuid":"3f59855b-d93e-dc03-c6ba-f4c33ea0177f","paneGuid":"443dfdc0-7165-cb7d-dd9c-f08fbe36bdb1","intentConfig":null,"launchData":null,"name":"HTML Viewer","active":false,"x":802,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798,"background":false,"columnOrder":""}],"defaultSettings":{}}],"flex":1},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"92078ac9-6f21-2f5f-6afc-bdc8c915c66d","uniqueId":"b17f186c-0d31-2077-1c3b-2a43dbf83738","dashboardGuid":"3f59855b-d93e-dc03-c6ba-f4c33ea0177f","paneGuid":"410cd0ee-cbdd-f225-582e-6aaa92e058f2","intentConfig":null,"launchData":null,"name":"Stock Chart","active":false,"x":0,"y":576,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":539,"width":1600,"background":false,"columnOrder":""}],"defaultSettings":{}}],"height":"100%"}', 'Widget Intents', 0);

INSERT INTO dashboard (altered_by_admin, dashboard_position, description, guid, id, isdefault, layout_config, name, "version") VALUES (FALSE, 0, '', 'c62ce95c-d16d-4ffe-afae-c46fa64a689b', 321, FALSE, '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":[{"widgetGuid":"eb5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"17580ea1-02fc-8ca7-e794-b5644f7dc21d","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Shouter","active":false,"x":549,"y":7,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19120,"height":250,"width":295},{"widgetGuid":"ec5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"9bdc8e96-f311-4a0b-c5b9-23ae5d768297","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Listener","active":true,"x":4,"y":5,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19130,"height":383,"width":540}],"defaultSettings":{"widgetStates":{"ec5435cf-4021-4f2a-ba69-dde451d12551":{"x":4,"y":5,"height":383,"width":540,"timestamp":1348064185725},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"x":549,"y":7,"height":250,"width":295,"timestamp":1348064183912}}}}', 'Sample', 0);

INSERT INTO dashboard (altered_by_admin, dashboard_position, description, guid, id, isdefault, layout_config, name, "version") VALUES (FALSE, 0, 'This dashboard provides the widgets needed to administer dashboards, widgets, groups, and users in OWF.', '54949b5d-f0ee-4347-811e-2522a1bf96fe', 322, FALSE, '{"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"container","cls":"hbox top","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"b3b1d04f-97c2-4726-9575-82bb1cf1af6a","uniqueId":"9251add0-28f1-ea2e-4bee-92f0d21d940d","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"994cc403-2baa-dc68-d172-e8e59b937ed1","intentConfig":null,"launchData":null,"name":"Users","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"b87c4a3e-aa1e-499e-ba10-510f35388bb6","uniqueId":"713c90d5-a51f-ae72-d67c-672d477b6ec7","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"2b47e10c-0f7d-aa9b-3e12-11ca57f229fc","intentConfig":null,"launchData":null,"name":"Groups","active":false,"x":802,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798}],"defaultSettings":{}}],"flex":1},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox bottom","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"412ec70d-a178-41ae-a8d9-6713a430c87c","uniqueId":"4ece13a7-b58f-e7d2-2df9-3e138fa43314","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"af782c7d-4c38-35a1-7f81-68eb9c11c440","intentConfig":null,"launchData":null,"name":"Widgets","active":false,"x":0,"y":576,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":539,"width":798}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"9d804b74-b2a6-448a-bd04-fe286905ab8f","uniqueId":"7eaea99c-8ad5-ce3f-5325-a003b4174a54","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"2e8ae979-52d5-a0ab-d30b-299672fe9a50","intentConfig":null,"launchData":null,"name":"Group Dashboards","active":false,"x":802,"y":576,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":539,"width":798}],"defaultSettings":{}}],"flex":1}],"flex":3}', 'Administration', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add Intents, Sample, and Administration Dashboards', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-48', '2.0.5', '3:aca011745b5c0db4f5eb1d6a82c3394d', 33);

-- Changeset changelog_6.0.0.groovy::6.0.0-51::owf::(Checksum: 3:9dea1a3daba3555a4b97bef0db023d9a)
-- Assign Intents and Sample Dashboards to OWF Users group
INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (320, 'dashboard', 331, 'owns', 192, 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (321, 'dashboard', 332, 'owns', 192, 'group', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Assign Intents and Sample Dashboards to OWF Users group', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-51', '2.0.5', '3:9dea1a3daba3555a4b97bef0db023d9a', 34);

-- Changeset changelog_6.0.0.groovy::6.0.0-54::owf::(Checksum: 3:1030fea638ddcb2be0c8da1ad2308e80)
-- Rename HTML intents data type to text/html.
UPDATE intent_data_type SET data_type = 'text/html' WHERE data_type='HTML';

UPDATE intent_data_type SET data_type = 'application/vnd.owf.sample.price' WHERE data_type='Prices';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Rename HTML intents data type to text/html.', NOW(), 'Update Data (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-54', '2.0.5', '3:1030fea638ddcb2be0c8da1ad2308e80', 35);

-- Changeset changelog_6.0.0.groovy::6.0.0-62::owf::(Checksum: 3:352d26af765a6a04e28e09f3d9433e49)
-- set sequence to higher number that is not used
DROP SEQUENCE hibernate_sequence CASCADE;

CREATE SEQUENCE hibernate_sequence START WITH 334;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'set sequence to higher number that is not used', NOW(), 'Drop Sequence, Create Sequence', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-62', '2.0.5', '3:352d26af765a6a04e28e09f3d9433e49', 36);

-- Changeset changelog_6.0.0.groovy::6.0.0-63::owf::(Checksum: 3:09cb669039ed4fb2199da1cc29068b70)
-- upgrade any pwds that were pending approval to use the disabled column
update person_widget_definition pwd
            set disabled = true
            from tag_links taglinks
            where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = false;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'upgrade any pwds that were pending approval to use the disabled column', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-63', '2.0.5', '3:09cb669039ed4fb2199da1cc29068b70', 37);

-- Changeset changelog_6.0.0.groovy::6.0.0-64::owf::(Checksum: 3:84741a4f5e5ac5ee47758341f3068451)
-- delete any taglinks which were 'pending approval' (have editable false)
DELETE FROM tag_links  WHERE editable = false;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'delete any taglinks which were ''pending approval'' (have editable false)', NOW(), 'Delete Data', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-64', '2.0.5', '3:84741a4f5e5ac5ee47758341f3068451', 38);

-- Changeset changelog_6.0.0.groovy::6.0.0-65::owf::(Checksum: 3:7fde4b7ac6dcaf27173c6656927b351a)
-- Updating Sample Widget images
UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/ChannelListener.png', image_url_small = 'themes/common/images/widget-icons/ChannelListener.png' WHERE widget_url='examples/walkthrough/widgets/ChannelListener.gsp';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/ChannelShouter.png', image_url_small = 'themes/common/images/widget-icons/ChannelShouter.png' WHERE widget_url='examples/walkthrough/widgets/ChannelShouter.gsp';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/ColorClient.png', image_url_small = 'themes/common/images/widget-icons/ColorClient.png' WHERE widget_url='examples/walkthrough/widgets/ColorClient.gsp';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/ColorServer.png', image_url_small = 'themes/common/images/widget-icons/ColorServer.png' WHERE widget_url='examples/walkthrough/widgets/ColorServer.gsp';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/EventMonitor.png', image_url_small = 'themes/common/images/widget-icons/EventMonitor.png' WHERE widget_url='examples/walkthrough/widgets/EventMonitor.html';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/HTMLViewer.png', image_url_small = 'themes/common/images/widget-icons/HTMLViewer.png' WHERE widget_url='examples/walkthrough/widgets/HTMLViewer.gsp';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/NearlyEmpty.png', image_url_small = 'themes/common/images/widget-icons/NearlyEmpty.png' WHERE widget_url='examples/walkthrough/widgets/NearlyEmptyWidget.html';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/NYSEStock.png', image_url_small = 'themes/common/images/widget-icons/NYSEStock.png' WHERE widget_url='examples/walkthrough/widgets/NYSE.gsp';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/Preferences.png', image_url_small = 'themes/common/images/widget-icons/Preferences.png' WHERE widget_url='examples/walkthrough/widgets/Preferences.gsp';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/PriceChart.png', image_url_small = 'themes/common/images/widget-icons/PriceChart.png' WHERE widget_url='examples/walkthrough/widgets/StockChart.gsp';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/WidgetChrome.png', image_url_small = 'themes/common/images/widget-icons/WidgetChrome.png' WHERE widget_url='examples/walkthrough/widgets/WidgetChrome.gsp';

UPDATE widget_definition SET image_url_medium = 'themes/common/images/widget-icons/WidgetLog.png', image_url_small = 'themes/common/images/widget-icons/WidgetLog.png' WHERE widget_url='examples/walkthrough/widgets/WidgetLog.gsp';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Updating Sample Widget images', NOW(), 'Update Data (x12)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-65', '2.0.5', '3:7fde4b7ac6dcaf27173c6656927b351a', 39);

-- Changeset changelog_7.0.0.groovy::7.0.0-29::owf::(Checksum: 3:4c00d465a1a4e23019f32ffcc4759933)
-- Update existing PWD records to set whether they were added to a user directly or just via a group
UPDATE person_widget_definition SET user_widget = TRUE WHERE group_widget=false;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Update existing PWD records to set whether they were added to a user directly or just via a group', NOW(), 'Update Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-29', '2.0.5', '3:4c00d465a1a4e23019f32ffcc4759933', 40);

-- Changeset changelog_7.0.0.groovy::7.0.0-30::owf::(Checksum: 3:b2da3152051ee5103b9157dcca94ee79)
-- Remove the Widget Approvals widget definition and all of its user, group, intent, and widget type references
DELETE FROM domain_mapping  WHERE dest_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp') and  dest_type = 'widget_definition';

DELETE FROM person_widget_definition  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp');

DELETE FROM widget_definition_widget_types  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp');

DELETE FROM widget_def_intent_data_types  WHERE widget_definition_intent_id in (select id from widget_def_intent where widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp'));

DELETE FROM widget_def_intent  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp');

DELETE FROM widget_definition  WHERE widget_url='admin/MarketplaceApprovals.gsp';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove the Widget Approvals widget definition and all of its user, group, intent, and widget type references', NOW(), 'Delete Data (x6)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-30', '2.0.5', '3:b2da3152051ee5103b9157dcca94ee79', 41);

-- Changeset changelog_7.0.0.groovy::7.0.0-32::owf::(Checksum: 3:ce0cf0ec0b4ef753ae0ae84ddf3a8eb2)
-- insert new sample data
INSERT INTO widget_definition (background, description, descriptor_url, display_name, height, id, image_url_medium, image_url_small, singleton, universal_name, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'This widget allows user to get directions fron one place to another.', '../examples/walkthrough/widgets/directions/descriptor/descriptor.html', 'Directions', 400, 181, 'examples/walkthrough/widgets/directions/img/logo.png', 'examples/walkthrough/widgets/directions/img/logo.png', FALSE, 'org.owfgoss.owf.examples.GetDirections', 0, TRUE, '302c35c9-9ed8-d0b6-251c-ea1ed4d0c86b', 'examples/walkthrough/widgets/directions', '1.0', 400);

INSERT INTO widget_definition (background, description, descriptor_url, display_name, height, id, image_url_medium, image_url_small, singleton, universal_name, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'This widget displays markers or directions.', '../examples/walkthrough/widgets/googlemaps/descriptor/descriptor.html', 'Google Maps', 600, 182, 'examples/walkthrough/widgets/googlemaps/img/logo.png', 'examples/walkthrough/widgets/googlemaps/img/logo.png', FALSE, 'org.owfgoss.owf.examples.GoogleMaps', 0, TRUE, 'd182002b-3de2-eb24-77be-95a7d08aa85b', 'examples/walkthrough/widgets/googlemaps', '1.0', 800);

INSERT INTO widget_definition (background, description, descriptor_url, display_name, height, id, image_url_medium, image_url_small, singleton, universal_name, "version", visible, widget_guid, widget_url, widget_version, width) VALUES (FALSE, 'This widget allows users to manage their contacts.', '../examples/walkthrough/widgets/contacts/descriptor/descriptor.html', 'Contacts Manager', 400, 183, 'examples/walkthrough/widgets/contacts/img/logo.png', 'examples/walkthrough/widgets/contacts/img/logo.png', FALSE, 'org.owfgoss.owf.examples.ContactsManager', 0, TRUE, '92448ba5-7f2b-982a-629e-9d621268b5e9', 'examples/walkthrough/widgets/contacts', '1.0', 400);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-32', '2.0.5', '3:ce0cf0ec0b4ef753ae0ae84ddf3a8eb2', 42);

-- Changeset changelog_7.0.0.groovy::7.0.0-33::owf::(Checksum: 3:48ce3eccb4978bf61a2b1a9b488bcea0)
-- insert new sample data
INSERT INTO widget_definition_widget_types (widget_definition_id, widget_type_id) VALUES (181, 1);

INSERT INTO widget_definition_widget_types (widget_definition_id, widget_type_id) VALUES (182, 1);

INSERT INTO widget_definition_widget_types (widget_definition_id, widget_type_id) VALUES (183, 1);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-33', '2.0.5', '3:48ce3eccb4978bf61a2b1a9b488bcea0', 43);

-- Changeset changelog_7.0.0.groovy::7.0.0-36::owf::(Checksum: 3:35bbb0ecdc7691b4626783ca41094109)
-- insert new sample data
INSERT INTO intent (action, id, "version") VALUES ('plot', 303, 0);

INSERT INTO intent (action, id, "version") VALUES ('navigate', 304, 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-36', '2.0.5', '3:35bbb0ecdc7691b4626783ca41094109', 44);

-- Changeset changelog_7.0.0.groovy::7.0.0-39::owf::(Checksum: 3:06258d834bf04972b734e0caf42990a2)
-- insert new sample data
INSERT INTO intent_data_type (data_type, id, "version") VALUES ('application/vnd.owf.sample.addresses', 305, 0);

INSERT INTO intent_data_type (data_type, id, "version") VALUES ('application/vnd.owf.sample.address', 306, 0);

INSERT INTO intent_data_types (intent_data_type_id, intent_id) VALUES (306, 303);

INSERT INTO intent_data_types (intent_data_type_id, intent_id) VALUES (305, 304);

INSERT INTO intent_data_types (intent_data_type_id, intent_id) VALUES (306, 304);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x5)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-39', '2.0.5', '3:06258d834bf04972b734e0caf42990a2', 45);

-- Changeset changelog_7.0.0.groovy::7.0.0-42::owf::(Checksum: 3:d87251531356a537f8481655326dde17)
-- insert new sample data
INSERT INTO widget_def_intent (id, intent_id, receive, send, "version", widget_definition_id) VALUES (309, 303, TRUE, FALSE, 0, 182);

INSERT INTO widget_def_intent (id, intent_id, receive, send, "version", widget_definition_id) VALUES (310, 304, TRUE, FALSE, 0, 182);

INSERT INTO widget_def_intent (id, intent_id, receive, send, "version", widget_definition_id) VALUES (311, 304, FALSE, TRUE, 0, 181);

INSERT INTO widget_def_intent_data_types (intent_data_type_id, widget_definition_intent_id) VALUES (306, 309);

INSERT INTO widget_def_intent_data_types (intent_data_type_id, widget_definition_intent_id) VALUES (305, 310);

INSERT INTO widget_def_intent_data_types (intent_data_type_id, widget_definition_intent_id) VALUES (305, 311);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x6)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-42', '2.0.5', '3:d87251531356a537f8481655326dde17', 46);

-- Changeset changelog_7.0.0.groovy::7.0.0-45::owf::(Checksum: 3:dc89d51f53a66b61c2ac423e5a5906a5)
-- insert new sample data
INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (181, 'widget_definition', 339, 'owns', 192, 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (182, 'widget_definition', 340, 'owns', 192, 'group', 0);

INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (183, 'widget_definition', 341, 'owns', 192, 'group', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-45', '2.0.5', '3:dc89d51f53a66b61c2ac423e5a5906a5', 47);

-- Changeset changelog_7.0.0.groovy::7.0.0-48::owf::(Checksum: 3:5eece97768f50b57d39e9d89bf107ed4)
-- Add Contacts Dashboards
INSERT INTO dashboard (altered_by_admin, dashboard_position, description, guid, id, isdefault, layout_config, name, "version") VALUES (FALSE, 0, 'This dashboard uses the Contacts Manager, Direction and Google Maps widgets.', '7f2f6d45-263a-7aeb-d841-3637678ce559', 323, FALSE, '{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"25%","items":[],"widgets":[{"universalName":"org.owfgoss.owf.examples.ContactsManager","widgetGuid":"92448ba5-7f2b-982a-629e-9d621268b5e9","uniqueId":"208c64f4-14ed-b31b-98b1-15408cc1620e","dashboardGuid":"f935e19e-09a1-451e-8b3d-0fb77537da7d","paneGuid":"5c478b1d-ba1f-ef67-087c-c03b8dbc7bff","intentConfig":null,"launchData":null,"name":"Contacts Manager","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":448,"width":419},{"universalName":"org.owfgoss.owf.examples.GetDirections","widgetGuid":"302c35c9-9ed8-d0b6-251c-ea1ed4d0c86b","uniqueId":"1929bfaf-ed08-47f3-c231-cd2e9d59e341","dashboardGuid":"f935e19e-09a1-451e-8b3d-0fb77537da7d","paneGuid":"5c478b1d-ba1f-ef67-087c-c03b8dbc7bff","intentConfig":{},"launchData":null,"name":"Directions","active":false,"x":0,"y":482,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"singleton":false,"floatingWidget":false,"height":447,"width":419}],"paneType":"accordionpane","defaultSettings":{"widgetStates":{"302c35c9-9ed8-d0b6-251c-ea1ed4d0c86b":{"timestamp":1354747263559},"d182002b-3de2-eb24-77be-95a7d08aa85b":{"timestamp":1354745224627},"92448ba5-7f2b-982a-629e-9d621268b5e9":{"timestamp":1354747263555}}},"flex":0.25},{"xtype":"dashboardsplitter"},{"xtype":"tabbedpane","cls":"right","htmlText":"75%","items":[],"paneType":"tabbedpane","widgets":[{"universalName":"org.owfgoss.owf.examples.GoogleMaps","widgetGuid":"d182002b-3de2-eb24-77be-95a7d08aa85b","uniqueId":"570f3364-e21a-8f96-d8e5-f61d81196ebc","dashboardGuid":"f935e19e-09a1-451e-8b3d-0fb77537da7d","paneGuid":"a25052e4-cd5d-51c0-a440-81327fc1d955","intentConfig":null,"launchData":null,"name":"Google Maps","active":true,"x":423,"y":62,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":867,"width":1257}],"defaultSettings":{"widgetStates":{"d182002b-3de2-eb24-77be-95a7d08aa85b":{"timestamp":1354747263599},"b87c4a3e-aa1e-499e-ba10-510f35388bb6":{"timestamp":1354746772856},"ec5435cf-4021-4f2a-ba69-dde451d12551":{"timestamp":1354746684155},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"timestamp":1354746684154},"d6ce3375-6e89-45ab-a7be-b6cf3abb0e8c":{"timestamp":1354747222261},"eb81c029-a5b6-4107-885c-5e04b4770767":{"timestamp":1354747222264},"c3f3c8e0-e7aa-41c3-a655-aca3c940f828":{"timestamp":1354746826290}}},"flex":0.75}],"flex":1}', 'Contacts', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add Contacts Dashboards', NOW(), 'Insert Row', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-48', '2.0.5', '3:5eece97768f50b57d39e9d89bf107ed4', 48);

-- Changeset changelog_7.0.0.groovy::7.0.0-51::owf::(Checksum: 3:f251113b4efe442a47c44ceec7b5cd47)
-- Assign Intents and Sample Dashboards to OWF Users group
INSERT INTO domain_mapping (dest_id, dest_type, id, relationship_type, src_id, src_type, "version") VALUES (323, 'dashboard', 342, 'owns', 192, 'group', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Assign Intents and Sample Dashboards to OWF Users group', NOW(), 'Insert Row', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-51', '2.0.5', '3:f251113b4efe442a47c44ceec7b5cd47', 49);

-- Changeset changelog_7.0.0.groovy::7.0.0-54::owf::(Checksum: 3:8695b856d5fb059f187288744c8b4780)
-- Create Investments stack and its default group.
insert into stack (id, version, name, description, stack_context) values (nextval('hibernate_sequence'), 0, 'Investments', 'Sample stack containing dashboards with example investment widgets.', 'investments');

insert into owf_group (id, version, automatic, name, status, stack_default) values (nextval('hibernate_sequence'), 0, false, 'ce86a612-c355-486e-9c9e-5252553cc58f', 'active', true);

insert into stack_groups (stack_id, group_id) values ((select id from stack where stack_context = 'investments'), (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'));

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Create Investments stack and its default group.', NOW(), 'Custom SQL (x3)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-54', '2.0.5', '3:8695b856d5fb059f187288744c8b4780', 50);

-- Changeset changelog_7.0.0.groovy::7.0.0-55::owf::(Checksum: 3:48617f163cf4c3ec2ff4fc0e8ae060f1)
-- Add Investments stack to the OWF Users group.
insert into stack_groups (stack_id, group_id) values ((select id from stack where stack_context = 'investments'), (select id from owf_group where name = 'OWF Users'));

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add Investments stack to the OWF Users group.', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-55', '2.0.5', '3:48617f163cf4c3ec2ff4fc0e8ae060f1', 51);

-- Changeset changelog_7.0.0.groovy::7.0.0-57::owf::(Checksum: 3:c1cf825bd1f6c24467b734c1e1381bb8)
-- Rename the Widget Intents dashboard to Watch List and add it to the Investments stack.
update domain_mapping set src_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f') where dest_id = 320;

UPDATE dashboard SET name = 'Watch List' WHERE guid = '3f59855b-d93e-dc03-c6ba-f4c33ea0177f';

update dashboard set stack_id = (select id from stack where stack_context = 'investments') where guid='3f59855b-d93e-dc03-c6ba-f4c33ea0177f';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Rename the Widget Intents dashboard to Watch List and add it to the Investments stack.', NOW(), 'Custom SQL, Update Data, Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-57', '2.0.5', '3:c1cf825bd1f6c24467b734c1e1381bb8', 52);

-- Changeset changelog_7.0.0.groovy::7.0.0-59::owf::(Checksum: 3:1364ead069969418155f964f1f0e6018)
-- Add the Contacts dashboard to the Investments stack.
update dashboard set stack_id = (select id from stack where stack_context = 'investments') where id = 323;

UPDATE stack SET unique_widget_count = 6 WHERE stack_context = 'investments';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add the Contacts dashboard to the Investments stack.', NOW(), 'Custom SQL, Update Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-59', '2.0.5', '3:1364ead069969418155f964f1f0e6018', 53);

-- Changeset changelog_7.0.0.groovy::7.0.0-61::owf::(Checksum: 3:ba65d72b118d8f8112f0e8d14fa87908)
-- Add Widget Intents and Contacts dashboards' widgets to Investments stack.
DROP SEQUENCE hibernate_sequence CASCADE;

CREATE SEQUENCE hibernate_sequence START WITH 700;

insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 178, 'widget_definition');

insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 179, 'widget_definition');

insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 180, 'widget_definition');

insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 181, 'widget_definition');

insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 182, 'widget_definition');

insert into domain_mapping VALUES (nextval('hibernate_sequence'), 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 183, 'widget_definition');

UPDATE stack SET unique_widget_count = 6 WHERE stack_context = 'investments';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add Widget Intents and Contacts dashboards'' widgets to Investments stack.', NOW(), 'Drop Sequence, Create Sequence, Custom SQL (x2), Update Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-61', '2.0.5', '3:ba65d72b118d8f8112f0e8d14fa87908', 54);

-- Changeset changelog_7.0.0.groovy::7.0.0-63::owf::(Checksum: 3:4b6f0ce071cc1ec44a1c0fc60bd6fdc8)
-- Reorder the dashboards so they appear Sample dashboard, Investments stack, and then Administration dashboard.
UPDATE dashboard SET isdefault = FALSE WHERE guid = '3f59855b-d93e-dc03-c6ba-f4c33ea0177f';

UPDATE dashboard SET dashboard_position = 1 WHERE guid = '3f59855b-d93e-dc03-c6ba-f4c33ea0177f';

UPDATE dashboard SET dashboard_position = 2 WHERE guid = '7f2f6d45-263a-7aeb-d841-3637678ce559';

UPDATE dashboard SET dashboard_position = 3 WHERE guid = '54949b5d-f0ee-4347-811e-2522a1bf96fe';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Reorder the dashboards so they appear Sample dashboard, Investments stack, and then Administration dashboard.', NOW(), 'Update Data (x4)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-63', '2.0.5', '3:4b6f0ce071cc1ec44a1c0fc60bd6fdc8', 55);

-- Changeset changelog_7.0.0.groovy::7.0.0-64::owf::(Checksum: 3:ddd62e2dd108f66e529c468e920246ab)
-- Remove Preferences, Color Client, Color Server, Widget Chrome, Event Monitor, and Nearly Empty widgets.
DELETE FROM person_widget_definition  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/Preferences.gsp');

DELETE FROM person_widget_definition  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorClient.gsp');

DELETE FROM person_widget_definition  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorServer.gsp');

DELETE FROM person_widget_definition  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp');

DELETE FROM person_widget_definition  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/EventMonitor.html');

DELETE FROM person_widget_definition  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/NearlyEmptyWidget.html');

DELETE FROM widget_definition_widget_types  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/Preferences.gsp');

DELETE FROM widget_definition_widget_types  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorClient.gsp');

DELETE FROM widget_definition_widget_types  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorServer.gsp');

DELETE FROM widget_definition_widget_types  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp');

DELETE FROM widget_definition_widget_types  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/EventMonitor.html');

DELETE FROM widget_definition_widget_types  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/NearlyEmptyWidget.html');

DELETE FROM widget_definition  WHERE widget_url = 'examples/walkthrough/widgets/Preferences.gsp';

DELETE FROM widget_definition  WHERE widget_url = 'examples/walkthrough/widgets/ColorClient.gsp';

DELETE FROM widget_definition  WHERE widget_url = 'examples/walkthrough/widgets/ColorServer.gsp';

DELETE FROM widget_definition  WHERE widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp';

DELETE FROM widget_definition  WHERE widget_url = 'examples/walkthrough/widgets/EventMonitor.html';

DELETE FROM widget_definition  WHERE widget_url = 'examples/walkthrough/widgets/NearlyEmptyWidget.html';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove Preferences, Color Client, Color Server, Widget Chrome, Event Monitor, and Nearly Empty widgets.', NOW(), 'Delete Data (x18)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-64', '2.0.5', '3:ddd62e2dd108f66e529c468e920246ab', 56);

-- Changeset changelog_7.0.0.groovy::7.0.0-73::owf::(Checksum: 3:5d99754b0310d86cc5037b53efb1a660)
-- Clean out some old domain mapping entries for widgets that have been removed from our sample database.
DELETE FROM domain_mapping  WHERE dest_id = 6 AND dest_type = 'widget_definition';

DELETE FROM domain_mapping  WHERE dest_id = 7 AND dest_type = 'widget_definition';

DELETE FROM domain_mapping  WHERE dest_id = 171 AND dest_type = 'widget_definition';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Clean out some old domain mapping entries for widgets that have been removed from our sample database.', NOW(), 'Delete Data (x3)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-73', '2.0.5', '3:5d99754b0310d86cc5037b53efb1a660', 57);

-- Changeset changelog_7.0.0.groovy::7.0.0-74::owf::(Checksum: 3:289db2d701e3e83ed976dd71c78ccd7b)
-- Remove Contacts dashboard from OWF Users group and add it to the default stack.
update domain_mapping set src_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f') where dest_id = 323;

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove Contacts dashboard from OWF Users group and add it to the default stack.', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-74', '2.0.5', '3:289db2d701e3e83ed976dd71c78ccd7b', 58);

-- Changeset changelog_7.3.0.groovy::7.3.0-0-pg-sampleData::owf::(Checksum: 3:4f38e9240c096801990deaee6dba750a)
-- Fixing Postgres id columns to have id generators
-- ensure that the sequence has been used, otherwise the currval calls
            -- below will fail
            select nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM dashboard),
                    false);

ALTER TABLE dashboard ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM domain_mapping),
                    false);

ALTER TABLE domain_mapping ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM owf_group),
                    false);

ALTER TABLE owf_group ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM person),
                    false);

ALTER TABLE person ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM person_widget_definition),
                    false);

ALTER TABLE person_widget_definition ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM preference),
                    false);

ALTER TABLE preference ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM requestmap),
                    false);

ALTER TABLE requestmap ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM role),
                    false);

ALTER TABLE role ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM tag_links),
                    false);

ALTER TABLE tag_links ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM tags),
                    false);

ALTER TABLE tags ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

-- Updating hibernate_sequence id generator if necessary
                SELECT setval('hibernate_sequence',
                    (SELECT GREATEST(MAX(id) + 1, currval('hibernate_sequence')) FROM widget_definition),
                    false);

ALTER TABLE widget_definition ALTER COLUMN id SET DEFAULT nextval('hibernate_sequence');

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Fixing Postgres id columns to have id generators', NOW(), 'Custom SQL (x12)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-0-pg-sampleData', '2.0.5', '3:4f38e9240c096801990deaee6dba750a', 59);

-- Changeset changelog_7.3.0.groovy::7.3.0-2::owf::(Checksum: 3:fe230a1ac4b1d1f7ea94cf131fcd8827)
-- Update existing dashboards to set type to marketplace if name is Apps Mall
UPDATE dashboard SET type = 'marketplace' WHERE name='Apps Mall';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Update existing dashboards to set type to marketplace if name is Apps Mall', NOW(), 'Update Data', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-2', '2.0.5', '3:fe230a1ac4b1d1f7ea94cf131fcd8827', 60);

-- Changeset changelog_7.3.0.groovy::7.3.0-8::owf::(Checksum: 3:0ed4f5bc7205d2c13ef27bb516e27d18)
-- Change the name of Stack and Widget admin widgets to be Apps and App Component
UPDATE widget_definition SET display_name = 'App Components' WHERE display_name='Widgets';

UPDATE widget_definition SET display_name = 'App Component Editor' WHERE display_name='Widget Editor';

UPDATE widget_definition SET display_name = 'Apps' WHERE display_name='Stacks';

UPDATE widget_definition SET display_name = 'App Editor' WHERE display_name='Stack Editor';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Change the name of Stack and Widget admin widgets to be Apps and App Component', NOW(), 'Update Data (x4)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-8', '2.0.5', '3:0ed4f5bc7205d2c13ef27bb516e27d18', 61);

-- Changeset changelog_7.3.0.groovy::7.3.0-9::owf::(Checksum: 3:63dabf04f3e3d7526260fff486e719d5)
-- Removing all references to Group Dashboards and renaming the Stack and Stack Editor widgets in the Admin dashboard
DELETE FROM widget_definition_widget_types  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp');

DELETE FROM domain_mapping  WHERE dest_id = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp');

DELETE FROM person_widget_definition  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp');

DELETE FROM tag_links  WHERE tag_ref = (select id from widget_definition where widget_url = 'admin/GroupDashboardManagement.gsp');

DELETE FROM widget_definition  WHERE widget_url = 'admin/GroupDashboardManagement.gsp';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Removing all references to Group Dashboards and renaming the Stack and Stack Editor widgets in the Admin dashboard', NOW(), 'Delete Data (x5)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-9', '2.0.5', '3:63dabf04f3e3d7526260fff486e719d5', 62);

-- Changeset changelog_7.3.0.groovy::7.3.0-11::owf::(Checksum: 3:349f40c826b0d13c6f30553e0c15854f)
-- Migrating the legacy sample dashboards to the new format
INSERT INTO owf_group (automatic, description, display_name, email, name, stack_default, status, "version") VALUES (FALSE, '', NULL, NULL, 'df51cb9b-f3d8-412e-af33-d064f81fb6c0', TRUE, 'active', 0);

INSERT INTO stack (description, descriptor_url, image_url, name, owner_id, stack_context, unique_widget_count, "version") VALUES (NULL, NULL, NULL, 'Sample', NULL, '908d934d-9d53-406c-8143-90b406fb508f', '0', 0);

INSERT INTO stack_groups (group_id, stack_id) VALUES ((SELECT id FROM owf_group WHERE name='df51cb9b-f3d8-412e-af33-d064f81fb6c0'), (SELECT id FROM stack WHERE stack_context='908d934d-9d53-406c-8143-90b406fb508f'));

UPDATE dashboard SET published_to_store = TRUE, "version" = 1 WHERE guid='3f59855b-d93e-dc03-c6ba-f4c33ea0177f' AND user_id IS NULL AND name='Watch List';

UPDATE dashboard SET published_to_store = TRUE, stack_id = (SELECT id FROM stack WHERE stack_context='908d934d-9d53-406c-8143-90b406fb508f'), "version" = 1 WHERE guid='c62ce95c-d16d-4ffe-afae-c46fa64a689b' AND user_id IS NULL AND name='Sample';

UPDATE dashboard SET published_to_store = TRUE, stack_id = (SELECT id FROM stack WHERE stack_context='0092af0b-57ae-4fd9-bd8a-ec0937ac5399'), "version" = 1 WHERE guid='54949b5d-f0ee-4347-811e-2522a1bf96fe' AND user_id IS NULL AND name='Administration';

UPDATE dashboard SET published_to_store = TRUE, "version" = 1 WHERE guid='7f2f6d45-263a-7aeb-d841-3637678ce559' AND user_id IS NULL AND name='Contacts';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Migrating the legacy sample dashboards to the new format', NOW(), 'Insert Row (x3), Update Data (x4)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-11', '2.0.5', '3:349f40c826b0d13c6f30553e0c15854f', 63);

-- Changeset changelog_7.3.0.groovy::7.3.0-12::owf::(Checksum: 3:dcdd51227d2214ac3ffa2acae5a7ec4f)
-- Adding in the domain mapping changes that need to be made for the group dashboards in the sample data
INSERT INTO domain_mapping (dest_id, dest_type, relationship_type, src_id, src_type, "version") VALUES ((SELECT id FROM dashboard WHERE guid='c62ce95c-d16d-4ffe-afae-c46fa64a689b' AND user_id IS NULL AND name='Sample'), 'dashboard', 'owns', (SELECT id FROM owf_group WHERE name='df51cb9b-f3d8-412e-af33-d064f81fb6c0'), 'group', 0);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Adding in the domain mapping changes that need to be made for the group dashboards in the sample data', NOW(), 'Insert Row', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-12', '2.0.5', '3:dcdd51227d2214ac3ffa2acae5a7ec4f', 64);

-- Changeset changelog_7.3.0.groovy::7.3.0-13::owf::(Checksum: 3:21e21cd0e685aedd919d83fd38a525e4)
-- Updating verbiage in the sample data; changing the word widget to app component; changing the word stack to app; changing the word dashboard to page
UPDATE widget_definition SET display_name = 'Load Time Log' WHERE display_name = 'Widget Log';

UPDATE widget_definition SET description = 'This app component displays the end of day report for the New York Stock Exchange.', display_name = 'NYSE App Component' WHERE universal_name = 'org.owfgoss.owf.examples.NYSE';

UPDATE widget_definition SET description = 'This app component displays HTML.' WHERE universal_name = 'org.owfgoss.owf.examples.HTMLViewer';

UPDATE widget_definition SET description = 'This app component charts stock prices.' WHERE universal_name = 'org.owfgoss.owf.examples.StockChart';

UPDATE widget_definition SET description = 'This app component maps directions.' WHERE universal_name = 'org.owfgoss.owf.examples.GetDirections';

UPDATE widget_definition SET description = 'This app component displays markers or directions.' WHERE universal_name = 'org.owfgoss.owf.examples.GoogleMaps';

UPDATE widget_definition SET description = 'This app component allows users to manage their contacts.' WHERE universal_name = 'org.owfgoss.owf.examples.ContactsManager';

UPDATE stack SET description = 'Sample app containing example investment pages.' WHERE name = 'Investments';

UPDATE dashboard SET description = 'This page demonstrates how intents work using company stock information.' WHERE name = 'Watch List';

UPDATE dashboard SET description = 'This page demonstrates how intents work by sending addresses to a map.' WHERE name = 'Contacts';

UPDATE dashboard SET description = 'This page provides the tools needed to administer apps, app component, groups and users.' WHERE name = 'Administration';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Updating verbiage in the sample data; changing the word widget to app component; changing the word stack to app; changing the word dashboard to page', NOW(), 'Update Data (x11)', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-13', '2.0.5', '3:21e21cd0e685aedd919d83fd38a525e4', 65);

-- Changeset changelog_7.3.0.groovy::7.3.0-14::owf::(Checksum: 3:89cb2554c614c8d0c3e26fc0fd2785f1)
-- Updating the unique widget count for sample and admin apps that we ship with.
UPDATE stack SET unique_widget_count = '2' WHERE stack_context='908d934d-9d53-406c-8143-90b406fb508f';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Updating the unique widget count for sample and admin apps that we ship with.', NOW(), 'Update Data', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-14', '2.0.5', '3:89cb2554c614c8d0c3e26fc0fd2785f1', 66);

-- Changeset changelog_7.3.0.groovy::7.3.0-15::owf::(Checksum: 3:a1d6eeff1d864a77ef76c386a13f5a59)
-- Associate sample app with owf users group and administration app with owf admin group. Disassociate the corresponding group dashboards from their groups.
INSERT INTO stack_groups (group_id, stack_id) VALUES ((SELECT id FROM owf_group WHERE name='OWF Users'), (SELECT id FROM stack WHERE stack_context='908d934d-9d53-406c-8143-90b406fb508f'));

DELETE FROM domain_mapping  WHERE src_type = 'group' AND relationship_type = 'owns' AND dest_type = 'dashboard' AND src_id = (select id from owf_group where name  = 'OWF Users') AND dest_id = (select id from dashboard where name = 'Sample');

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Associate sample app with owf users group and administration app with owf admin group. Disassociate the corresponding group dashboards from their groups.', NOW(), 'Insert Row, Delete Data', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-15', '2.0.5', '3:a1d6eeff1d864a77ef76c386a13f5a59', 67);

-- Changeset changelog_7.3.0.groovy::7.3.0-19::owf::(Checksum: 3:9b247183ae8c8b6c5af1242a31f6406f)
-- Add isApproved to stack
UPDATE stack SET approved = TRUE WHERE name = 'Investments' OR name = 'Administration' OR name = 'Sample';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Add isApproved to stack', NOW(), 'Update Data', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-19', '2.0.5', '3:9b247183ae8c8b6c5af1242a31f6406f', 68);

-- Changeset changelog_7.3.0.groovy::7.3.0-30::owf::(Checksum: 3:f05898c87f6dd643313c3ff6f3084025)
-- Remove the old admin dashboard.
DELETE FROM dashboard  WHERE guid='54949b5d-f0ee-4347-811e-2522a1bf96fe' AND user_id IS NULL AND name='Administration';

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', 'Remove the old admin dashboard.', NOW(), 'Delete Data', 'EXECUTED', 'changelog_7.3.0.groovy', '7.3.0-30', '2.0.5', '3:f05898c87f6dd643313c3ff6f3084025', 69);

-- Changeset changelog_7.16.0.groovy::7.16.0-4::owf::(Checksum: 3:fa417d61a8ef8029d99656ba7832a8d4)
UPDATE person SET requires_sync = TRUE WHERE id in (1,2,3);

INSERT INTO databasechangelog (AUTHOR, COMMENTS, DATEEXECUTED, DESCRIPTION, EXECTYPE, FILENAME, ID, LIQUIBASE, MD5SUM, ORDEREXECUTED) VALUES ('owf', '', NOW(), 'Update Data', 'EXECUTED', 'changelog_7.16.0.groovy', '7.16.0-4', '2.0.5', '3:fa417d61a8ef8029d99656ba7832a8d4', 70);

-- Release Database Lock

-- Manual additions to sample data for 7.17.0
INSERT INTO person_role (ROLE_ID, PERSON_AUTHORITIES_ID) VALUES (26, 2);
INSERT INTO person_role (ROLE_ID, PERSON_AUTHORITIES_ID) VALUES (26, 3);
INSERT INTO person_role (ROLE_ID, PERSON_AUTHORITIES_ID) VALUES (26, 28);
INSERT INTO person_role (ROLE_ID, PERSON_AUTHORITIES_ID) VALUES (27, 1);
