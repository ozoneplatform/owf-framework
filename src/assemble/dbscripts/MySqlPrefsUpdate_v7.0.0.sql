-- *********************************************************************
-- Update Database Script
-- *********************************************************************
-- Change Log: changelog.groovy
-- Ran at: 12/18/12 10:44 AM

-- Liquibase version: 2.0.1
-- *********************************************************************

-- Lock Database
-- Changeset changelog_3.8.0.groovy::3.8.0-7::owf::(Checksum: 3:4163f7334862d1ae47e0a16041fcc73b)
-- Updating Admin Widget Icons and Names
UPDATE `widget_definition` SET `display_name` = 'User Manager', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png' WHERE widget_url='admin/UserManagement.gsp';

UPDATE `widget_definition` SET `display_name` = 'User Editor', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_user.png', `visible` = 0 WHERE widget_url='admin/UserEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Widget Manager', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png' WHERE widget_url='admin/WidgetManagement.gsp';

UPDATE `widget_definition` SET `display_name` = 'Widget Editor', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_widget.png', `visible` = 0 WHERE widget_url='admin/WidgetEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Group Manager', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png' WHERE widget_url='admin/GroupManagement.gsp';

UPDATE `widget_definition` SET `display_name` = 'Group Editor', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_group.png', `visible` = 0 WHERE widget_url='admin/GroupEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Group Dashboard Manager', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png' WHERE widget_url='admin/GroupDashboardManagement.gsp';

UPDATE `widget_definition` SET `display_name` = 'Dashboard Editor', `image_url_large` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', `image_url_small` = 'themes/owf-ext-theme/resources/themes/images/owf-ext/admin/64x64_blue_dashboard.png', `visible` = 0 WHERE widget_url='admin/DashboardEdit.gsp';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Updating Admin Widget Icons and Names', NOW(), 'Update Data (x8)', 'EXECUTED', 'changelog_3.8.0.groovy', '3.8.0-7', '2.0.1', '3:4163f7334862d1ae47e0a16041fcc73b', 1);

-- Changeset changelog_4.0.0.groovy::4.0.0-5::owf::(Checksum: 3:d40d436853f82bd28733ad60a2a7c211)
-- deleting old sample data
DELETE FROM `role_people`;

DELETE FROM `role`;

DELETE FROM `requestmap`;

DELETE FROM `preference`;

DELETE FROM `owf_group_people`;

DELETE FROM `person_widget_definition`;

DELETE FROM `domain_mapping`;

DELETE FROM `dashboard`;

DELETE FROM `owf_group`  WHERE stack_default=0;

DELETE FROM `widget_definition`;

DELETE FROM `person`;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'deleting old sample data', NOW(), 'Delete Data (x11)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-5', '2.0.1', '3:d40d436853f82bd28733ad60a2a7c211', 2);

-- Changeset changelog_4.0.0.groovy::4.0.0-7::owf::(Checksum: 3:56bfda152e35ce325993eb717dc97ddd)
-- insert new sample data
INSERT INTO `person` (`description`, `email`, `email_show`, `enabled`, `id`, `user_real_name`, `username`, `version`) VALUES ('Test Administrator 1', 'testAdmin1@ozone3.test', 0, 1, 1, 'Test Admin 1', 'testAdmin1', 0);

INSERT INTO `person` (`description`, `email`, `email_show`, `enabled`, `id`, `user_real_name`, `username`, `version`) VALUES ('Test User 1', 'testUser1@ozone3.test', 0, 1, 2, 'Test User 1', 'testUser1', 0);

INSERT INTO `person` (`description`, `email`, `email_show`, `enabled`, `id`, `user_real_name`, `username`, `version`) VALUES ('Test User 2', 'testUser1@ozone3.test', 0, 1, 3, 'Test User 2', 'testUser2', 0);

INSERT INTO `person` (`email_show`, `enabled`, `id`, `user_real_name`, `username`, `version`) VALUES (0, 1, 28, 'DEFAULT_USER', 'DEFAULT_USER', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-7', '2.0.1', '3:56bfda152e35ce325993eb717dc97ddd', 3);

-- Changeset changelog_4.0.0.groovy::4.0.0-10::owf::(Checksum: 3:dce1159e015f1d6314c981dfe85f5dca)
-- insert new sample data
INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget A', 565, 6, 'themes/common/images/blue/icons/widgetIcons/widgetA.gif', 'themes/common/images/blue/icons/widgetContainer/widgetAsm.gif', 0, 0, 1, 'ea5435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-a.html', '1.0', 615);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget B', 635, 7, 'themes/common/images/blue/icons/widgetIcons/widgetB.gif', 'themes/common/images/blue/icons/widgetContainer/widgetBsm.gif', 0, 0, 1, 'fb5435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-b.html', '1.0', 565);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget C', 740, 8, 'themes/common/images/blue/icons/widgetIcons/widgetC.gif', 'themes/common/images/blue/icons/widgetContainer/widgetCsm.gif', 0, 0, 1, '0c5435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-c.html', '1.0', 980);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget D', 525, 9, 'themes/common/images/blue/icons/widgetIcons/widgetD.gif', 'themes/common/images/blue/icons/widgetContainer/widgetDsm.gif', 0, 0, 1, '1d5435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-d.html', '1.0', 630);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget One', 405, 10, 'themes/common/images/blue/icons/widgetIcons/widget1.gif', 'themes/common/images/blue/icons/widgetContainer/widget1sm.gif', 0, 0, 1, 'd6543ccf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-one.html', '1.0', 625);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget Two', 635, 11, 'themes/common/images/blue/icons/widgetIcons/widget2.gif', 'themes/common/images/blue/icons/widgetContainer/widget2sm.gif', 0, 0, 1, 'e65431cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-two.html', '1.0', 610);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget Three', 540, 12, 'themes/common/images/blue/icons/widgetIcons/widget3.gif', 'themes/common/images/blue/icons/widgetContainer/widget3sm.gif', 0, 0, 1, 'a65432cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-three.html', '1.0', 630);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget Four', 350, 13, 'themes/common/images/blue/icons/widgetIcons/widget4.gif', 'themes/common/images/blue/icons/widgetContainer/widget4sm.gif', 0, 0, 1, 'b65434cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-four.html', '1.0', 675);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget Five', 630, 14, 'themes/common/images/blue/icons/widgetIcons/widget5.gif', 'themes/common/images/blue/icons/widgetContainer/widget5sm.gif', 0, 0, 1, 'c65435cf-4021-4f2a-ba69-dde451d12551', 'examples/fake-widgets/widget-five.html', '1.0', 615);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Nearly Empty', 440, 15, 'themes/common/images/blue/icons/widgetIcons/nearlyEmpty.gif', 'themes/common/images/blue/icons/widgetContainer/nearlyEmptysm.gif', 0, 0, 1, 'bc5435cf-4021-4f2a-ba69-dde451d12551', 'examples/walkthrough/widgets/NearlyEmptyWidget.html', '1.0', 540);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Channel Shouter', 250, 16, 'themes/common/images/blue/icons/widgetIcons/channelShouter.gif', 'themes/common/images/blue/icons/widgetContainer/channelShoutersm.gif', 0, 0, 1, 'eb5435cf-4021-4f2a-ba69-dde451d12551', 'examples/walkthrough/widgets/ChannelShouter.html', '1.0', 295);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Channel Listener', 440, 17, 'themes/common/images/blue/icons/widgetIcons/channelListener.gif', 'themes/common/images/blue/icons/widgetContainer/channelListenersm.gif', 0, 0, 1, 'ec5435cf-4021-4f2a-ba69-dde451d12551', 'examples/walkthrough/widgets/ChannelListener.html', '1.0', 540);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget Chrome', 440, 18, 'examples/walkthrough/images/chromeWiget_black_icon.png', 'examples/walkthrough/images/chromeWiget_blue_icon.png', 0, 0, 1, 'e8687289-f595-4b6d-9911-c714b483509d', 'examples/walkthrough/widgets/WidgetChrome.html', '1.0', 540);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Event Monitor Widget', 600, 19, 'examples/walkthrough/images/event_monitor_black_icon.png', 'examples/walkthrough/images/event_monitor_blue_icon.png', 0, 0, 1, '9d2e5f85-e199-4c6a-be31-4c6954206687', 'examples/walkthrough/widgets/EventMonitor.html', '1.0', 500);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget Log', 440, 20, 'examples/walkthrough/images/log_icon.png', 'examples/walkthrough/images/log_icon_blue.png', 0, 0, 1, '4854fbd4-395c-442b-95c6-8b60702fd2b4', 'examples/walkthrough/widgets/WidgetLog.html', '1.0', 540);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Preferences Widget', 300, 21, 'examples/walkthrough/images/testpref_black_icon.png', 'examples/walkthrough/images/testpref_blue_icon.png', 0, 0, 1, '920b7cc1-dd37-46ac-8457-afda62613e56', 'examples/walkthrough/widgets/Preferences.html', '1.0', 450);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Users', 440, 151, 'themes/common/images/admin/64x64_blue_user.png', 'themes/common/images/admin/64x64_blue_user.png', 0, 0, 1, 'b3b1d04f-97c2-4726-9575-82bb1cf1af6a', 'admin/UserManagement.gsp', '1.0', 818);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'User Editor', 440, 154, 'themes/common/images/admin/64x64_blue_user.png', 'themes/common/images/admin/64x64_blue_user.png', 0, 0, 0, '101f119e-b56a-4e16-8219-11048c020038', 'admin/UserEdit.gsp', '1.0', 581);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widgets', 440, 156, 'themes/common/images/admin/64x64_blue_widget.png', 'themes/common/images/admin/64x64_blue_widget.png', 0, 0, 1, '412ec70d-a178-41ae-a8d9-6713a430c87c', 'admin/WidgetManagement.gsp', '1.0', 818);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Widget Editor', 493, 158, 'themes/common/images/admin/64x64_blue_widget.png', 'themes/common/images/admin/64x64_blue_widget.png', 0, 0, 0, '6cf4f84a-cc89-45ba-9577-15c34f66ee9c', 'admin/WidgetEdit.gsp', '1.0', 581);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Groups', 440, 160, 'themes/common/images/admin/64x64_blue_group.png', 'themes/common/images/admin/64x64_blue_group.png', 0, 0, 1, 'b87c4a3e-aa1e-499e-ba10-510f35388bb6', 'admin/GroupManagement.gsp', '1.0', 818);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Group Editor', 440, 163, 'themes/common/images/admin/64x64_blue_group.png', 'themes/common/images/admin/64x64_blue_group.png', 0, 0, 0, 'd6ce3375-6e89-45ab-a7be-b6cf3abb0e8c', 'admin/GroupEdit.gsp', '1.0', 581);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Group Dashboards', 440, 166, 'themes/common/images/admin/64x64_blue_dashboard.png', 'themes/common/images/admin/64x64_blue_dashboard.png', 0, 0, 1, '9d804b74-b2a6-448a-bd04-fe286905ab8f', 'admin/GroupDashboardManagement.gsp', '1.0', 818);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Dashboard Editor', 440, 170, 'themes/common/images/admin/64x64_blue_dashboard.png', 'themes/common/images/admin/64x64_blue_dashboard.png', 0, 0, 0, 'a540f672-a34c-4989-962c-dcbd559c3792', 'admin/DashboardEdit.gsp', '1.0', 581);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x24)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-10', '2.0.1', '3:dce1159e015f1d6314c981dfe85f5dca', 4);

-- Changeset changelog_4.0.0.groovy::4.0.0-13::owf::(Checksum: 3:8e3e82dc223694d1658209e2d2f7ce9e)
-- insert new sample data
INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (29, 1, 0, 0, 1, 6);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (30, 1, 1, 0, 1, 7);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (31, 1, 2, 0, 1, 8);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (32, 1, 3, 0, 1, 9);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (33, 1, 4, 0, 1, 10);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (34, 1, 5, 0, 1, 11);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (35, 1, 6, 0, 1, 12);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (36, 1, 7, 0, 1, 13);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (37, 1, 8, 0, 1, 14);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (38, 1, 9, 0, 1, 15);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (39, 1, 10, 0, 1, 16);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (40, 1, 11, 0, 1, 17);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (41, 1, 12, 0, 1, 18);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (42, 1, 13, 0, 1, 19);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (43, 1, 14, 0, 1, 20);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (44, 1, 15, 0, 1, 21);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (45, 2, 0, 0, 1, 6);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (46, 2, 1, 0, 1, 7);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (47, 2, 2, 0, 1, 8);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (48, 2, 3, 0, 1, 9);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (49, 2, 4, 0, 1, 10);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (50, 2, 5, 0, 1, 11);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (51, 2, 6, 0, 1, 12);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (52, 2, 7, 0, 1, 13);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (53, 2, 8, 0, 1, 14);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (54, 2, 9, 0, 1, 15);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (55, 2, 10, 0, 1, 16);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (56, 2, 11, 0, 1, 17);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (57, 2, 12, 0, 1, 18);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (58, 2, 13, 0, 1, 19);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (59, 2, 14, 0, 1, 20);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (60, 2, 15, 0, 1, 21);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (61, 3, 0, 0, 1, 6);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (62, 3, 1, 0, 1, 7);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (63, 3, 2, 0, 1, 8);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (64, 3, 3, 0, 1, 9);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (65, 3, 4, 0, 1, 10);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (66, 3, 5, 0, 1, 11);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (67, 3, 6, 0, 1, 12);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (68, 3, 7, 0, 1, 13);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (69, 3, 8, 0, 1, 14);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (70, 3, 9, 0, 1, 15);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (71, 3, 10, 0, 1, 16);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (72, 3, 11, 0, 1, 17);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (73, 3, 12, 0, 1, 18);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (74, 3, 13, 0, 1, 19);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (75, 3, 14, 0, 1, 20);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (76, 3, 15, 0, 1, 21);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (77, 28, 0, 0, 1, 6);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (78, 28, 1, 0, 1, 7);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (79, 28, 2, 0, 1, 8);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (80, 28, 3, 0, 1, 9);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (81, 28, 4, 0, 1, 10);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (82, 28, 5, 0, 1, 11);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (83, 28, 6, 0, 1, 12);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (84, 28, 7, 0, 1, 13);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (85, 28, 8, 0, 1, 14);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (86, 28, 9, 0, 1, 15);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (87, 28, 10, 0, 1, 16);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (88, 28, 11, 0, 1, 17);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (89, 28, 12, 0, 1, 18);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (90, 28, 13, 0, 1, 19);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (91, 28, 14, 0, 1, 20);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (92, 28, 15, 0, 1, 21);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (174, 1, 1, 0, 1, 151);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (177, 1, 1, 0, 1, 154);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (179, 1, 1, 0, 1, 156);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (181, 1, 1, 0, 1, 158);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (183, 1, 1, 0, 1, 160);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (185, 1, 1, 0, 1, 163);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (187, 1, 1, 0, 1, 166);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (189, 1, 1, 0, 1, 170);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x72)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-13', '2.0.1', '3:8e3e82dc223694d1658209e2d2f7ce9e', 5);

-- Changeset changelog_4.0.0.groovy::4.0.0-22::owf::(Checksum: 3:ac040168255d915bc4c4440087bb9ae1)
-- insert new sample data
INSERT INTO `owf_group` (`automatic`, `description`, `email`, `id`, `name`, `status`, `version`) VALUES (0, 'TestGroup1', 'testgroup1@group1.com', 4, 'TestGroup1', 'active', 0);

INSERT INTO `owf_group` (`automatic`, `description`, `email`, `id`, `name`, `status`, `version`) VALUES (0, 'TestGroup2', 'testgroup2@group2.com', 5, 'TestGroup2', 'active', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-22', '2.0.1', '3:ac040168255d915bc4c4440087bb9ae1', 6);

-- Changeset changelog_4.0.0.groovy::4.0.0-25::owf::(Checksum: 3:ade3ef8907b4a13a374f05723b4712b4)
-- insert new sample data
INSERT INTO `owf_group_people` (`group_id`, `person_id`) VALUES (4, 2);

INSERT INTO `owf_group_people` (`group_id`, `person_id`) VALUES (4, 1);

INSERT INTO `owf_group_people` (`group_id`, `person_id`) VALUES (5, 2);

INSERT INTO `owf_group_people` (`group_id`, `person_id`) VALUES (5, 1);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-25', '2.0.1', '3:ade3ef8907b4a13a374f05723b4712b4', 7);

-- Changeset changelog_4.0.0.groovy::4.0.0-28::owf::(Checksum: 3:56cf365e11bb693bc75b4131efbc4556)
-- insert new sample data
INSERT INTO `role` (`authority`, `description`, `id`, `version`) VALUES ('ROLE_USER', 'User Role', 26, 2);

INSERT INTO `role` (`authority`, `description`, `id`, `version`) VALUES ('ROLE_ADMIN', 'Admin Role', 27, 1);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-28', '2.0.1', '3:56cf365e11bb693bc75b4131efbc4556', 8);

-- Changeset changelog_4.0.0.groovy::4.0.0-31::owf::(Checksum: 3:4318d8906f61a4c4429c3af056f06c87)
-- insert new sample data
INSERT INTO `role_people` (`person_id`, `role_id`) VALUES (2, 26);

INSERT INTO `role_people` (`person_id`, `role_id`) VALUES (3, 26);

INSERT INTO `role_people` (`person_id`, `role_id`) VALUES (28, 26);

INSERT INTO `role_people` (`person_id`, `role_id`) VALUES (1, 27);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-31', '2.0.1', '3:4318d8906f61a4c4429c3af056f06c87', 9);

-- Changeset changelog_4.0.0.groovy::4.0.0-34::owf::(Checksum: 3:62011f2458c9d6a9f4884f2c3349dab8)
-- insert new sample data
INSERT INTO `preference` (`id`, `namespace`, `path`, `user_id`, `value`, `version`) VALUES (144, 'foo.bar.0', 'test path entry 0', 2, 'foovalue', 0);

INSERT INTO `preference` (`id`, `namespace`, `path`, `user_id`, `value`, `version`) VALUES (145, 'foo.bar.1', 'test path entry 1', 2, 'foovalue', 0);

INSERT INTO `preference` (`id`, `namespace`, `path`, `user_id`, `value`, `version`) VALUES (146, 'foo.bar.0', 'test path entry 0', 3, 'foovalue', 0);

INSERT INTO `preference` (`id`, `namespace`, `path`, `user_id`, `value`, `version`) VALUES (147, 'foo.bar.1', 'test path entry 1', 3, 'foovalue', 0);

INSERT INTO `preference` (`id`, `namespace`, `path`, `user_id`, `value`, `version`) VALUES (148, 'foo.bar.0', 'test path entry 0', 1, 'foovalue', 0);

INSERT INTO `preference` (`id`, `namespace`, `path`, `user_id`, `value`, `version`) VALUES (149, 'foo.bar.1', 'test path entry 1', 1, 'foovalue', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x6)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-34', '2.0.1', '3:62011f2458c9d6a9f4884f2c3349dab8', 10);

-- Changeset changelog_4.0.0.groovy::4.0.0-37::owf::(Checksum: 3:f277332664f1f36f3f13bf4977c1bd84)
-- insert new sample data
INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (6, 'widget_definition', 22, 'owns', 4, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (7, 'widget_definition', 23, 'owns', 4, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (6, 'widget_definition', 24, 'owns', 5, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (7, 'widget_definition', 25, 'owns', 5, 'group', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-37', '2.0.1', '3:f277332664f1f36f3f13bf4977c1bd84', 11);

-- Changeset changelog_4.0.0.groovy::4.0.0-40::owf::(Checksum: 3:7c595f960a0d9cbaec670333fdbaea32)
-- insert new sample data
INSERT INTO `tags` (`id`, `name`, `version`) VALUES (152, 'admin', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-40', '2.0.1', '3:7c595f960a0d9cbaec670333fdbaea32', 12);

-- Changeset changelog_4.0.0.groovy::4.0.0-43::owf::(Checksum: 3:2241715a9f8abce9ffed932735763bcc)
-- insert new sample data
INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 153, -1, 152, 151, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 155, -1, 152, 154, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 157, -1, 152, 156, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 159, -1, 152, 158, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 162, -1, 152, 160, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 164, -1, 152, 163, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 165, -1, 152, 161, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 169, -1, 152, 166, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 168, -1, 152, 167, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 172, -1, 152, 170, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 173, -1, 152, 171, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 176, -1, 152, 174, 'personWidgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 178, -1, 152, 177, 'personWidgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 180, -1, 152, 179, 'personWidgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 182, -1, 152, 181, 'personWidgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 184, -1, 152, 183, 'personWidgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 186, -1, 152, 185, 'personWidgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 188, -1, 152, 187, 'personWidgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 190, -1, 152, 189, 'personWidgetDefinition', 0, 1);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x19)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-43', '2.0.1', '3:2241715a9f8abce9ffed932735763bcc', 13);

-- Changeset changelog_4.0.0.groovy::4.0.0-46::owf::(Checksum: 3:5c1705f46d07fab68b80494982589ffe)
UPDATE `widget_definition` SET `widget_url` = 'examples/walkthrough/widgets/ChannelListener.gsp' WHERE widget_url='examples/walkthrough/widgets/ChannelListener.html';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', '', NOW(), 'Update Data', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-46', '2.0.1', '3:5c1705f46d07fab68b80494982589ffe', 14);

-- Changeset changelog_4.0.0.groovy::4.0.0-53::owf::(Checksum: 3:7fed1a797ab9d36fdb18255281541337)
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
        'admin/WidgetManagement.gsp'
        );

insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
      select id, 2 from widget_definition
      where widget_url in (
        'admin/DashboardEdit.gsp',
        'admin/GroupDashboardManagement.gsp',
        'admin/GroupEdit.gsp',
        'admin/GroupManagement.gsp',
        'admin/MarketplaceApprovals.gsp',
        'admin/UserManagement.gsp',
        'admin/UserEdit.gsp',
        'admin/WidgetEdit.gsp',
        'admin/WidgetManagement.gsp'
        );

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Insert widget type mapping links', NOW(), 'Custom SQL (x2)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-53', '2.0.1', '3:7fed1a797ab9d36fdb18255281541337', 15);

-- Changeset changelog_4.0.0.groovy::4.0.0-55::owf::(Checksum: 3:43c93ef1d7f35a92c470fdcfde7b2d6f)
-- Updating Admin Widget Icons and Names
UPDATE `widget_definition` SET `display_name` = 'Users', `image_url_large` = 'themes/common/images/adm-tools/Users64.png', `image_url_small` = 'themes/common/images/adm-tools/Users24.png' WHERE widget_url='admin/UserManagement.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/adm-tools/Users64.png', `image_url_small` = 'themes/common/images/adm-tools/Users24.png' WHERE widget_url='admin/UserEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Widgets', `image_url_large` = 'themes/common/images/adm-tools/Widgets64.png', `image_url_small` = 'themes/common/images/adm-tools/Widgets24.png' WHERE widget_url='admin/WidgetManagement.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/adm-tools/Widgets64.png', `image_url_small` = 'themes/common/images/adm-tools/Widgets24.png' WHERE widget_url='admin/WidgetEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Groups', `image_url_large` = 'themes/common/images/adm-tools/Groups64.png', `image_url_small` = 'themes/common/images/adm-tools/Groups24.png' WHERE widget_url='admin/GroupManagement.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/adm-tools/Groups64.png', `image_url_small` = 'themes/common/images/adm-tools/Groups24.png' WHERE widget_url='admin/GroupEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Group Dashboards', `image_url_large` = 'themes/common/images/adm-tools/Dashboards64.png', `image_url_small` = 'themes/common/images/adm-tools/Dashboards24.png' WHERE widget_url='admin/GroupDashboardManagement.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/adm-tools/Dashboards64.png', `image_url_small` = 'themes/common/images/adm-tools/Dashboards24.png' WHERE widget_url='admin/DashboardEdit.gsp';

UPDATE `widget_definition` SET `display_name` = 'Approvals', `image_url_large` = 'themes/common/images/adm-tools/Approvals64.png', `image_url_small` = 'themes/common/images/adm-tools/Approvals24.png', `visible` = 1 WHERE widget_url='admin/MarketplaceApprovals.gsp';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Updating Admin Widget Icons and Names', NOW(), 'Update Data (x9)', 'EXECUTED', 'changelog_4.0.0.groovy', '4.0.0-55', '2.0.1', '3:43c93ef1d7f35a92c470fdcfde7b2d6f', 16);

-- Changeset changelog_5.0.0.groovy::5.0.0-5::owf::(Checksum: 3:a3a4f6fe76ad042b42e27bdf7b09d277)
-- Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.
UPDATE `owf_group` SET `automatic` = 1, `name` = 'OWF Users' WHERE name='All Users' AND automatic=0;

UPDATE `owf_group` SET `automatic` = 1, `name` = 'OWF Administrators' WHERE name='OWF Admins' AND automatic=0;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Rename All Users and OWF Admins groups to OWF Users and OWF Administrators, then set them to automatic.', NOW(), 'Update Data (x2)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-5', '2.0.1', '3:a3a4f6fe76ad042b42e27bdf7b09d277', 17);

-- Changeset changelog_5.0.0.groovy::5.0.0-6::owf::(Checksum: 3:96aa216a330817681aca38dc66d1129b)
-- Set default value for display_name
UPDATE owf_group
			SET display_name = name
			WHERE display_name IS NULL;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Set default value for display_name', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-6', '2.0.1', '3:96aa216a330817681aca38dc66d1129b', 18);

-- Changeset changelog_5.0.0.groovy::5.0.0-7::owf::(Checksum: 3:55a215b64becd106729fc560fca74a21)
-- Updating Sample Widget URLs
UPDATE `widget_definition` SET `widget_url` = 'examples/walkthrough/widgets/ChannelShouter.gsp' WHERE widget_url='examples/walkthrough/widgets/ChannelShouter.html';

UPDATE `widget_definition` SET `widget_url` = 'examples/walkthrough/widgets/Preferences.gsp' WHERE widget_url='examples/walkthrough/widgets/Preferences.html';

UPDATE `widget_definition` SET `widget_url` = 'examples/walkthrough/widgets/WidgetChrome.gsp' WHERE widget_url='examples/walkthrough/widgets/WidgetChrome.html';

UPDATE `widget_definition` SET `widget_url` = 'examples/walkthrough/widgets/WidgetLog.gsp' WHERE widget_url='examples/walkthrough/widgets/WidgetLog.html';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Updating Sample Widget URLs', NOW(), 'Update Data (x4)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-7', '2.0.1', '3:55a215b64becd106729fc560fca74a21', 19);

-- Changeset changelog_5.0.0.groovy::5.0.0-9::owf::(Checksum: 3:4a029c2334ee8d0f12dd11f10e53a1fd)
-- Add admin group
INSERT INTO `owf_group` (`automatic`, `description`, `display_name`, `id`, `name`, `status`, `version`) VALUES (1, 'OWF Administrators', 'OWF Administrators', 191, 'OWF Administrators', 'active', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add admin group', NOW(), 'Insert Row', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-9', '2.0.1', '3:4a029c2334ee8d0f12dd11f10e53a1fd', 20);

-- Changeset changelog_5.0.0.groovy::5.0.0-15::owf::(Checksum: 3:c2d3b3571a76497a6de5db75f34c46d4)
-- insert new sample data
INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Color Server', 300, 172, 'themes/common/images/blue/icons/widgetIcons/channelShouter.gif', 'themes/common/images/blue/icons/widgetContainer/channelShoutersm.gif', 0, 0, 1, '2410a41d-0bc9-cee6-2645-a89087da374f', 'examples/walkthrough/widgets/ColorServer.gsp', '1.0', 300);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Color Client', 300, 173, 'themes/common/images/blue/icons/widgetIcons/channelListener.gif', 'themes/common/images/blue/icons/widgetContainer/channelListenersm.gif', 0, 0, 1, '4bc8e886-b576-3dac-015d-589b4813ceda', 'examples/walkthrough/widgets/ColorClient.gsp', '1.0', 300);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-15', '2.0.1', '3:c2d3b3571a76497a6de5db75f34c46d4', 21);

-- Changeset changelog_5.0.0.groovy::5.0.0-18::owf::(Checksum: 3:2101485c508626863f8c60d6dcb83305)
-- insert new sample data
INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (190, 28, 16, 0, 1, 173);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (191, 1, 16, 0, 1, 173);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (192, 2, 16, 0, 1, 173);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (193, 3, 16, 0, 1, 173);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (194, 28, 17, 0, 1, 172);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (195, 1, 17, 0, 1, 172);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (196, 2, 17, 0, 1, 172);

INSERT INTO `person_widget_definition` (`id`, `person_id`, `pwd_position`, `version`, `visible`, `widget_definition_id`) VALUES (197, 3, 17, 0, 1, 172);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x8)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-18', '2.0.1', '3:2101485c508626863f8c60d6dcb83305', 22);

-- Changeset changelog_5.0.0.groovy::5.0.0-21::owf::(Checksum: 3:794c1478fed2f3277efed5300225daed)
-- insert new sample data
INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (170, 'widget_definition', 200, 'owns', 191, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (171, 'widget_definition', 201, 'owns', 191, 'group', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-21', '2.0.1', '3:794c1478fed2f3277efed5300225daed', 23);

-- Changeset changelog_5.0.0.groovy::5.0.0-23::owf::(Checksum: 3:77d50cef2581b1cd4a89ea3c9040b73a)
-- insert new sample data
INSERT INTO `widget_definition_widget_types` (`widget_definition_id`, `widget_type_id`) VALUES (172, 1);

INSERT INTO `widget_definition_widget_types` (`widget_definition_id`, `widget_type_id`) VALUES (173, 1);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_5.0.0.groovy', '5.0.0-23', '2.0.1', '3:77d50cef2581b1cd4a89ea3c9040b73a', 24);

-- Changeset changelog_6.0.0.groovy::6.0.0-19::owf::(Checksum: 3:060ed35d30b4c3f5fc656d920dd53aac)
-- insert new sample data
INSERT INTO `widget_definition` (`background`, `description`, `descriptor_url`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'This widget displays the end of day report for the New York Stock Exchange.', '../examples/walkthrough/descriptors/NYSE_descriptor.html', 'NYSE Widget', 437, 178, 'themes/common/images/blue/icons/widgetIcons/widgetC.gif', 'themes/common/images/blue/icons/widgetContainer/widgetCsm.gif', 0, 'org.owfgoss.owf.examples.NYSE', 0, 1, 'fe137961-039d-e7a5-7050-d6eed7ac4782', 'examples/walkthrough/widgets/NYSE.gsp', '1.0', 825);

INSERT INTO `widget_definition` (`background`, `description`, `descriptor_url`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'This widget displays HTML.', '../examples/walkthrough/descriptors/HTMLViewer_descriptor.html', 'HTML Viewer', 600, 179, 'themes/common/images/blue/icons/widgetIcons/widgetC.gif', 'themes/common/images/blue/icons/widgetContainer/widgetCsm.gif', 0, 'org.owfgoss.owf.examples.HTMLViewer', 0, 1, 'cd5e77f8-cb28-8574-0a8a-a535bd2c7de4', 'examples/walkthrough/widgets/HTMLViewer.gsp', '1.0', 400);

INSERT INTO `widget_definition` (`background`, `description`, `descriptor_url`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'This widget charts stock prices.', '../examples/walkthrough/descriptors/StockChart_descriptor.html', 'Stock Chart', 600, 180, 'themes/common/images/blue/icons/widgetIcons/widgetC.gif', 'themes/common/images/blue/icons/widgetContainer/widgetCsm.gif', 0, 'org.owfgoss.owf.examples.StockChart', 0, 1, '92078ac9-6f21-2f5f-6afc-bdc8c915c66d', 'examples/walkthrough/widgets/StockChart.gsp', '1.0', 800);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-19', '2.0.1', '3:060ed35d30b4c3f5fc656d920dd53aac', 25);

-- Changeset changelog_6.0.0.groovy::6.0.0-20::owf::(Checksum: 3:4b2eabcf9c66a32485f65255d22f142f)
-- insert new sample data
INSERT INTO `widget_definition_widget_types` (`widget_definition_id`, `widget_type_id`) VALUES (178, 1);

INSERT INTO `widget_definition_widget_types` (`widget_definition_id`, `widget_type_id`) VALUES (179, 1);

INSERT INTO `widget_definition_widget_types` (`widget_definition_id`, `widget_type_id`) VALUES (180, 1);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-20', '2.0.1', '3:4b2eabcf9c66a32485f65255d22f142f', 26);

-- Changeset changelog_6.0.0.groovy::6.0.0-23::owf::(Checksum: 3:2ef3a5917ef4c44ca618a48bc22f35a2)
-- Add OWF Users group
INSERT INTO `owf_group` (`automatic`, `description`, `display_name`, `id`, `name`, `status`, `version`) VALUES (1, 'OWF Users', 'OWF Users', 192, 'OWF Users', 'active', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add OWF Users group', NOW(), 'Insert Row', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-23', '2.0.1', '3:2ef3a5917ef4c44ca618a48bc22f35a2', 27);

-- Changeset changelog_6.0.0.groovy::6.0.0-27::owf::(Checksum: 3:3fa5da9f6c183c928b5023132ad3f5e5)
-- insert new sample data
INSERT INTO `intent` (`action`, `id`, `version`) VALUES ('Graph', 301, 0);

INSERT INTO `intent` (`action`, `id`, `version`) VALUES ('View', 302, 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-27', '2.0.1', '3:3fa5da9f6c183c928b5023132ad3f5e5', 28);

-- Changeset changelog_6.0.0.groovy::6.0.0-30::owf::(Checksum: 3:4390a2bef918c69968b16fbd4ee8fcbb)
-- insert new sample data
INSERT INTO `intent_data_type` (`data_type`, `id`, `version`) VALUES ('Prices', 303, 0);

INSERT INTO `intent_data_type` (`data_type`, `id`, `version`) VALUES ('HTML', 304, 0);

INSERT INTO `intent_data_types` (`intent_data_type_id`, `intent_id`) VALUES (303, 301);

INSERT INTO `intent_data_types` (`intent_data_type_id`, `intent_id`) VALUES (304, 302);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-30', '2.0.1', '3:4390a2bef918c69968b16fbd4ee8fcbb', 29);

-- Changeset changelog_6.0.0.groovy::6.0.0-33::owf::(Checksum: 3:738a85e664c3c906cee14aff1ce53308)
-- insert new sample data
INSERT INTO `widget_def_intent` (`id`, `intent_id`, `receive`, `send`, `version`, `widget_definition_id`) VALUES (305, 301, 0, 1, 0, 178);

INSERT INTO `widget_def_intent` (`id`, `intent_id`, `receive`, `send`, `version`, `widget_definition_id`) VALUES (306, 302, 0, 1, 0, 178);

INSERT INTO `widget_def_intent` (`id`, `intent_id`, `receive`, `send`, `version`, `widget_definition_id`) VALUES (307, 302, 1, 0, 0, 179);

INSERT INTO `widget_def_intent` (`id`, `intent_id`, `receive`, `send`, `version`, `widget_definition_id`) VALUES (308, 301, 1, 0, 0, 180);

INSERT INTO `widget_def_intent_data_types` (`intent_data_type_id`, `widget_definition_intent_id`) VALUES (303, 305);

INSERT INTO `widget_def_intent_data_types` (`intent_data_type_id`, `widget_definition_intent_id`) VALUES (304, 306);

INSERT INTO `widget_def_intent_data_types` (`intent_data_type_id`, `widget_definition_intent_id`) VALUES (304, 307);

INSERT INTO `widget_def_intent_data_types` (`intent_data_type_id`, `widget_definition_intent_id`) VALUES (303, 308);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x8)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-33', '2.0.1', '3:738a85e664c3c906cee14aff1ce53308', 30);

-- Changeset changelog_6.0.0.groovy::6.0.0-36::owf::(Checksum: 3:d526ccb1874fe44c40d2400d52f82940)
-- insert new sample data
INSERT INTO `tags` (`id`, `name`, `version`) VALUES (309, 'grid', 0);

INSERT INTO `tags` (`id`, `name`, `version`) VALUES (310, 'html', 0);

INSERT INTO `tags` (`id`, `name`, `version`) VALUES (311, 'document_viewer', 0);

INSERT INTO `tags` (`id`, `name`, `version`) VALUES (312, 'stock_chart', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-36', '2.0.1', '3:d526ccb1874fe44c40d2400d52f82940', 31);

-- Changeset changelog_6.0.0.groovy::6.0.0-39::owf::(Checksum: 3:ac51eb6f9c799aed93ad91a3d2896bf8)
-- insert new sample data
INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 313, -1, 309, 178, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 314, -1, 310, 179, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 315, -1, 311, 179, 'widgetDefinition', 0, 1);

INSERT INTO `tag_links` (`editable`, `id`, `pos`, `tag_id`, `tag_ref`, `type`, `version`, `visible`) VALUES (1, 316, -1, 312, 180, 'widgetDefinition', 0, 1);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x4)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-39', '2.0.1', '3:ac51eb6f9c799aed93ad91a3d2896bf8', 32);

-- Changeset changelog_6.0.0.groovy::6.0.0-42::owf::(Checksum: 3:01f2eb3a1f8091f5f5c61a837a4c1ff8)
-- insert new sample data
INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (178, 'widget_definition', 317, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (179, 'widget_definition', 318, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (180, 'widget_definition', 319, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (16, 'widget_definition', 320, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (17, 'widget_definition', 321, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (20, 'widget_definition', 322, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (151, 'widget_definition', 323, 'owns', 191, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (154, 'widget_definition', 324, 'owns', 191, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (156, 'widget_definition', 325, 'owns', 191, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (158, 'widget_definition', 326, 'owns', 191, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (160, 'widget_definition', 327, 'owns', 191, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (163, 'widget_definition', 328, 'owns', 191, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (166, 'widget_definition', 329, 'owns', 191, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (170, 'widget_definition', 330, 'owns', 191, 'group', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x14)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-42', '2.0.1', '3:01f2eb3a1f8091f5f5c61a837a4c1ff8', 33);

-- Changeset changelog_6.0.0.groovy::6.0.0-45::owf::(Checksum: 3:72d0cb8302a49259ece1210187f09264)
-- Removing Fake Widgets
DELETE FROM person_widget_definition WHERE widget_definition_id IN (SELECT id FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551'));

DELETE FROM widget_definition_widget_types WHERE widget_definition_id IN (SELECT id FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551'));

DELETE FROM widget_definition WHERE widget_guid IN ('ea5435cf-4021-4f2a-ba69-dde451d12551','fb5435cf-4021-4f2a-ba69-dde451d12551','0c5435cf-4021-4f2a-ba69-dde451d12551','1d5435cf-4021-4f2a-ba69-dde451d12551','d6543ccf-4021-4f2a-ba69-dde451d12551','e65431cf-4021-4f2a-ba69-dde451d12551','a65432cf-4021-4f2a-ba69-dde451d12551','b65434cf-4021-4f2a-ba69-dde451d12551','c65435cf-4021-4f2a-ba69-dde451d12551');

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Removing Fake Widgets', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-45', '2.0.1', '3:72d0cb8302a49259ece1210187f09264', 34);

-- Changeset changelog_6.0.0.groovy::6.0.0-48::owf::(Checksum: 3:aca011745b5c0db4f5eb1d6a82c3394d)
-- Add Intents, Sample, and Administration Dashboards
INSERT INTO `dashboard` (`altered_by_admin`, `dashboard_position`, `description`, `guid`, `id`, `isdefault`, `layout_config`, `name`, `version`) VALUES (0, 0, 'This dashboard uses the sample Intents Widgets to demonstrate the widget intents workflow.', '3f59855b-d93e-dc03-c6ba-f4c33ea0177f', 320, 1, '{"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"container","cls":"hbox top","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"fe137961-039d-e7a5-7050-d6eed7ac4782","uniqueId":"ecbe0bd5-7781-d859-2dbc-13f86be406a7","dashboardGuid":"3f59855b-d93e-dc03-c6ba-f4c33ea0177f","paneGuid":"16ec8b84-a631-4e7c-d9cc-883635abd6ef","intentConfig":null,"launchData":null,"name":"NYSE Widget","active":true,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798,"background":false,"columnOrder":""}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"cd5e77f8-cb28-8574-0a8a-a535bd2c7de4","uniqueId":"66e7148e-3cd3-72ff-6a24-6143ac618b80","dashboardGuid":"3f59855b-d93e-dc03-c6ba-f4c33ea0177f","paneGuid":"443dfdc0-7165-cb7d-dd9c-f08fbe36bdb1","intentConfig":null,"launchData":null,"name":"HTML Viewer","active":false,"x":802,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798,"background":false,"columnOrder":""}],"defaultSettings":{}}],"flex":1},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"92078ac9-6f21-2f5f-6afc-bdc8c915c66d","uniqueId":"b17f186c-0d31-2077-1c3b-2a43dbf83738","dashboardGuid":"3f59855b-d93e-dc03-c6ba-f4c33ea0177f","paneGuid":"410cd0ee-cbdd-f225-582e-6aaa92e058f2","intentConfig":null,"launchData":null,"name":"Stock Chart","active":false,"x":0,"y":576,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":539,"width":1600,"background":false,"columnOrder":""}],"defaultSettings":{}}],"height":"100%"}', 'Widget Intents', 0);

INSERT INTO `dashboard` (`altered_by_admin`, `dashboard_position`, `description`, `guid`, `id`, `isdefault`, `layout_config`, `name`, `version`) VALUES (0, 0, '', 'c62ce95c-d16d-4ffe-afae-c46fa64a689b', 321, 0, '{"xtype":"desktoppane","flex":1,"height":"100%","items":[],"paneType":"desktoppane","widgets":[{"widgetGuid":"eb5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"17580ea1-02fc-8ca7-e794-b5644f7dc21d","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Shouter","active":false,"x":549,"y":7,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19120,"height":250,"width":295},{"widgetGuid":"ec5435cf-4021-4f2a-ba69-dde451d12551","uniqueId":"9bdc8e96-f311-4a0b-c5b9-23ae5d768297","dashboardGuid":"905968f7-f94d-1c9b-431c-a05dc7bb68d1","paneGuid":"f3712dc1-6e90-2469-8cb3-5b499937cac8","name":"Channel Listener","active":true,"x":4,"y":5,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"intentConfig":null,"launchData":null,"singleton":false,"floatingWidget":false,"background":false,"zIndex":19130,"height":383,"width":540}],"defaultSettings":{"widgetStates":{"ec5435cf-4021-4f2a-ba69-dde451d12551":{"x":4,"y":5,"height":383,"width":540,"timestamp":1348064185725},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"x":549,"y":7,"height":250,"width":295,"timestamp":1348064183912}}}}', 'Sample', 0);

INSERT INTO `dashboard` (`altered_by_admin`, `dashboard_position`, `description`, `guid`, `id`, `isdefault`, `layout_config`, `name`, `version`) VALUES (0, 0, 'This dashboard provides the widgets needed to administer dashboards, widgets, groups, and users in OWF.', '54949b5d-f0ee-4347-811e-2522a1bf96fe', 322, 0, '{"xtype":"container","cls":"vbox ","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"container","cls":"hbox top","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"b3b1d04f-97c2-4726-9575-82bb1cf1af6a","uniqueId":"9251add0-28f1-ea2e-4bee-92f0d21d940d","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"994cc403-2baa-dc68-d172-e8e59b937ed1","intentConfig":null,"launchData":null,"name":"Users","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"b87c4a3e-aa1e-499e-ba10-510f35388bb6","uniqueId":"713c90d5-a51f-ae72-d67c-672d477b6ec7","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"2b47e10c-0f7d-aa9b-3e12-11ca57f229fc","intentConfig":null,"launchData":null,"name":"Groups","active":false,"x":802,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":538,"width":798}],"defaultSettings":{}}],"flex":1},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"hbox bottom","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"fitpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"widgetGuid":"412ec70d-a178-41ae-a8d9-6713a430c87c","uniqueId":"4ece13a7-b58f-e7d2-2df9-3e138fa43314","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"af782c7d-4c38-35a1-7f81-68eb9c11c440","intentConfig":null,"launchData":null,"name":"Widgets","active":false,"x":0,"y":576,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":539,"width":798}],"paneType":"fitpane","defaultSettings":{}},{"xtype":"dashboardsplitter"},{"xtype":"fitpane","cls":"right","flex":1,"htmlText":"50%","items":[],"paneType":"fitpane","widgets":[{"widgetGuid":"9d804b74-b2a6-448a-bd04-fe286905ab8f","uniqueId":"7eaea99c-8ad5-ce3f-5325-a003b4174a54","dashboardGuid":"79e8db83-08e7-4bc7-b2a1-958fd53eff26","paneGuid":"2e8ae979-52d5-a0ab-d30b-299672fe9a50","intentConfig":null,"launchData":null,"name":"Group Dashboards","active":false,"x":802,"y":576,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":539,"width":798}],"defaultSettings":{}}],"flex":1}],"flex":3}', 'Administration', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add Intents, Sample, and Administration Dashboards', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-48', '2.0.1', '3:aca011745b5c0db4f5eb1d6a82c3394d', 35);

-- Changeset changelog_6.0.0.groovy::6.0.0-51::owf::(Checksum: 3:923063aff6c51dd622faccaae6891875)
-- Assign Intents and Sample Dashboards to OWF Users group
INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (320, 'dashboard', 331, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (321, 'dashboard', 332, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (322, 'dashboard', 333, 'owns', 191, 'group', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Assign Intents and Sample Dashboards to OWF Users group', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-51', '2.0.1', '3:923063aff6c51dd622faccaae6891875', 36);

-- Changeset changelog_6.0.0.groovy::6.0.0-54::owf::(Checksum: 3:1030fea638ddcb2be0c8da1ad2308e80)
-- Rename HTML intents data type to text/html.
UPDATE `intent_data_type` SET `data_type` = 'text/html' WHERE data_type='HTML';

UPDATE `intent_data_type` SET `data_type` = 'application/vnd.owf.sample.price' WHERE data_type='Prices';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Rename HTML intents data type to text/html.', NOW(), 'Update Data (x2)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-54', '2.0.1', '3:1030fea638ddcb2be0c8da1ad2308e80', 37);

-- Changeset changelog_6.0.0.groovy::6.0.0-63::owf::(Checksum: 3:9211052869719112cf60c1ebb7ae958b)
-- upgrade any pwds that were pending approval to use the disabled column
update person_widget_definition pwd, tag_links taglinks
            set pwd.disabled = true
            where pwd.id = taglinks.tag_ref and taglinks.type = 'personWidgetDefinition' and taglinks.editable = false;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'upgrade any pwds that were pending approval to use the disabled column', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-63', '2.0.1', '3:9211052869719112cf60c1ebb7ae958b', 38);

-- Changeset changelog_6.0.0.groovy::6.0.0-64::owf::(Checksum: 3:84741a4f5e5ac5ee47758341f3068451)
-- delete any taglinks which were 'pending approval' (have editable false)
DELETE FROM `tag_links`  WHERE editable = false;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'delete any taglinks which were ''pending approval'' (have editable false)', NOW(), 'Delete Data', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-64', '2.0.1', '3:84741a4f5e5ac5ee47758341f3068451', 39);

-- Changeset changelog_6.0.0.groovy::6.0.0-65::owf::(Checksum: 3:3259ab7fe31a394213ba7151b8a53e52)
-- Updating Sample Widget images
UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/ChannelListener.png', `image_url_small` = 'themes/common/images/widget-icons/ChannelListener.png' WHERE widget_url='examples/walkthrough/widgets/ChannelListener.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/ChannelShouter.png', `image_url_small` = 'themes/common/images/widget-icons/ChannelShouter.png' WHERE widget_url='examples/walkthrough/widgets/ChannelShouter.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/ColorClient.png', `image_url_small` = 'themes/common/images/widget-icons/ColorClient.png' WHERE widget_url='examples/walkthrough/widgets/ColorClient.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/ColorServer.png', `image_url_small` = 'themes/common/images/widget-icons/ColorServer.png' WHERE widget_url='examples/walkthrough/widgets/ColorServer.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/EventMonitor.png', `image_url_small` = 'themes/common/images/widget-icons/EventMonitor.png' WHERE widget_url='examples/walkthrough/widgets/EventMonitor.html';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/HTMLViewer.png', `image_url_small` = 'themes/common/images/widget-icons/HTMLViewer.png' WHERE widget_url='examples/walkthrough/widgets/HTMLViewer.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/NearlyEmpty.png', `image_url_small` = 'themes/common/images/widget-icons/NearlyEmpty.png' WHERE widget_url='examples/walkthrough/widgets/NearlyEmptyWidget.html';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/NYSEStock.png', `image_url_small` = 'themes/common/images/widget-icons/NYSEStock.png' WHERE widget_url='examples/walkthrough/widgets/NYSE.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/Preferences.png', `image_url_small` = 'themes/common/images/widget-icons/Preferences.png' WHERE widget_url='examples/walkthrough/widgets/Preferences.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/PriceChart.png', `image_url_small` = 'themes/common/images/widget-icons/PriceChart.png' WHERE widget_url='examples/walkthrough/widgets/StockChart.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/WidgetChrome.png', `image_url_small` = 'themes/common/images/widget-icons/WidgetChrome.png' WHERE widget_url='examples/walkthrough/widgets/WidgetChrome.gsp';

UPDATE `widget_definition` SET `image_url_large` = 'themes/common/images/widget-icons/WidgetLog.png', `image_url_small` = 'themes/common/images/widget-icons/WidgetLog.png' WHERE widget_url='examples/walkthrough/widgets/WidgetLog.gsp';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Updating Sample Widget images', NOW(), 'Update Data (x12)', 'EXECUTED', 'changelog_6.0.0.groovy', '6.0.0-65', '2.0.1', '3:3259ab7fe31a394213ba7151b8a53e52', 40);

-- Changeset changelog_7.0.0.groovy::7.0.0-29::owf::(Checksum: 3:29f71e23b2eb9ca309842616800501b2)
-- Update existing PWD records to set whether they were added to a user directly or just via a group
UPDATE `person_widget_definition` SET `user_widget` = 1 WHERE group_widget=0;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Update existing PWD records to set whether they were added to a user directly or just via a group', NOW(), 'Update Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-29', '2.0.1', '3:29f71e23b2eb9ca309842616800501b2', 41);

-- Changeset changelog_7.0.0.groovy::7.0.0-30::owf::(Checksum: 3:b2da3152051ee5103b9157dcca94ee79)
-- Remove the Widget Approvals widget definition and all of its user, group, intent, and widget type references
DELETE FROM `domain_mapping`  WHERE dest_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp') and  dest_type = 'widget_definition';

DELETE FROM `person_widget_definition`  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp');

DELETE FROM `widget_definition_widget_types`  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp');

DELETE FROM `widget_def_intent_data_types`  WHERE widget_definition_intent_id in (select id from widget_def_intent where widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp'));

DELETE FROM `widget_def_intent`  WHERE widget_definition_id = (select id from widget_definition where widget_url='admin/MarketplaceApprovals.gsp');

DELETE FROM `widget_definition`  WHERE widget_url='admin/MarketplaceApprovals.gsp';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Remove the Widget Approvals widget definition and all of its user, group, intent, and widget type references', NOW(), 'Delete Data (x6)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-30', '2.0.1', '3:b2da3152051ee5103b9157dcca94ee79', 42);

-- Changeset changelog_7.0.0.groovy::7.0.0-32::owf::(Checksum: 3:5bb424ee213fbbfe783b978e3c9ebd6f)
-- insert new sample data
INSERT INTO `widget_definition` (`background`, `description`, `descriptor_url`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'This widget allows user to get directions fron one place to another.', '../examples/walkthrough/widgets/directions/descriptor/descriptor.html', 'Directions', 400, 181, 'examples/walkthrough/widgets/directions/img/logo.png', 'examples/walkthrough/widgets/directions/img/logo.png', 0, 'org.owfgoss.owf.examples.GetDirections', 0, 1, '302c35c9-9ed8-d0b6-251c-ea1ed4d0c86b', 'examples/walkthrough/widgets/directions', '1.0', 400);

INSERT INTO `widget_definition` (`background`, `description`, `descriptor_url`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'This widget displays markers or directions.', '../examples/walkthrough/widgets/googlemaps/descriptor/descriptor.html', 'Google Maps', 600, 182, 'examples/walkthrough/widgets/googlemaps/img/logo.png', 'examples/walkthrough/widgets/googlemaps/img/logo.png', 0, 'org.owfgoss.owf.examples.GoogleMaps', 0, 1, 'd182002b-3de2-eb24-77be-95a7d08aa85b', 'examples/walkthrough/widgets/googlemaps', '1.0', 800);

INSERT INTO `widget_definition` (`background`, `description`, `descriptor_url`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `universal_name`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'This widget allows users to manage their contacts.', '../examples/walkthrough/widgets/contacts/descriptor/descriptor.html', 'Contacts Manager', 400, 183, 'examples/walkthrough/widgets/contacts/img/logo.png', 'examples/walkthrough/widgets/contacts/img/logo.png', 0, 'org.owfgoss.owf.examples.ContactsManager', 0, 1, '92448ba5-7f2b-982a-629e-9d621268b5e9', 'examples/walkthrough/widgets/contacts', '1.0', 400);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-32', '2.0.1', '3:5bb424ee213fbbfe783b978e3c9ebd6f', 43);

-- Changeset changelog_7.0.0.groovy::7.0.0-33::owf::(Checksum: 3:48ce3eccb4978bf61a2b1a9b488bcea0)
-- insert new sample data
INSERT INTO `widget_definition_widget_types` (`widget_definition_id`, `widget_type_id`) VALUES (181, 1);

INSERT INTO `widget_definition_widget_types` (`widget_definition_id`, `widget_type_id`) VALUES (182, 1);

INSERT INTO `widget_definition_widget_types` (`widget_definition_id`, `widget_type_id`) VALUES (183, 1);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-33', '2.0.1', '3:48ce3eccb4978bf61a2b1a9b488bcea0', 44);

-- Changeset changelog_7.0.0.groovy::7.0.0-36::owf::(Checksum: 3:35bbb0ecdc7691b4626783ca41094109)
-- insert new sample data
INSERT INTO `intent` (`action`, `id`, `version`) VALUES ('plot', 303, 0);

INSERT INTO `intent` (`action`, `id`, `version`) VALUES ('navigate', 304, 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-36', '2.0.1', '3:35bbb0ecdc7691b4626783ca41094109', 45);

-- Changeset changelog_7.0.0.groovy::7.0.0-39::owf::(Checksum: 3:06258d834bf04972b734e0caf42990a2)
-- insert new sample data
INSERT INTO `intent_data_type` (`data_type`, `id`, `version`) VALUES ('application/vnd.owf.sample.addresses', 305, 0);

INSERT INTO `intent_data_type` (`data_type`, `id`, `version`) VALUES ('application/vnd.owf.sample.address', 306, 0);

INSERT INTO `intent_data_types` (`intent_data_type_id`, `intent_id`) VALUES (306, 303);

INSERT INTO `intent_data_types` (`intent_data_type_id`, `intent_id`) VALUES (305, 304);

INSERT INTO `intent_data_types` (`intent_data_type_id`, `intent_id`) VALUES (306, 304);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x5)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-39', '2.0.1', '3:06258d834bf04972b734e0caf42990a2', 46);

-- Changeset changelog_7.0.0.groovy::7.0.0-42::owf::(Checksum: 3:d87251531356a537f8481655326dde17)
-- insert new sample data
INSERT INTO `widget_def_intent` (`id`, `intent_id`, `receive`, `send`, `version`, `widget_definition_id`) VALUES (309, 303, 1, 0, 0, 182);

INSERT INTO `widget_def_intent` (`id`, `intent_id`, `receive`, `send`, `version`, `widget_definition_id`) VALUES (310, 304, 1, 0, 0, 182);

INSERT INTO `widget_def_intent` (`id`, `intent_id`, `receive`, `send`, `version`, `widget_definition_id`) VALUES (311, 304, 0, 1, 0, 181);

INSERT INTO `widget_def_intent_data_types` (`intent_data_type_id`, `widget_definition_intent_id`) VALUES (306, 309);

INSERT INTO `widget_def_intent_data_types` (`intent_data_type_id`, `widget_definition_intent_id`) VALUES (305, 310);

INSERT INTO `widget_def_intent_data_types` (`intent_data_type_id`, `widget_definition_intent_id`) VALUES (305, 311);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x6)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-42', '2.0.1', '3:d87251531356a537f8481655326dde17', 47);

-- Changeset changelog_7.0.0.groovy::7.0.0-45::owf::(Checksum: 3:dc89d51f53a66b61c2ac423e5a5906a5)
-- insert new sample data
INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (181, 'widget_definition', 339, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (182, 'widget_definition', 340, 'owns', 192, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (183, 'widget_definition', 341, 'owns', 192, 'group', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'insert new sample data', NOW(), 'Insert Row (x3)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-45', '2.0.1', '3:dc89d51f53a66b61c2ac423e5a5906a5', 48);

-- Changeset changelog_7.0.0.groovy::7.0.0-48::owf::(Checksum: 3:5eece97768f50b57d39e9d89bf107ed4)
-- Add Contacts Dashboards
INSERT INTO `dashboard` (`altered_by_admin`, `dashboard_position`, `description`, `guid`, `id`, `isdefault`, `layout_config`, `name`, `version`) VALUES (0, 0, 'This dashboard uses the Contacts Manager, Direction and Google Maps widgets.', '7f2f6d45-263a-7aeb-d841-3637678ce559', 323, 0, '{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","htmlText":"25%","items":[],"widgets":[{"universalName":"org.owfgoss.owf.examples.ContactsManager","widgetGuid":"92448ba5-7f2b-982a-629e-9d621268b5e9","uniqueId":"208c64f4-14ed-b31b-98b1-15408cc1620e","dashboardGuid":"f935e19e-09a1-451e-8b3d-0fb77537da7d","paneGuid":"5c478b1d-ba1f-ef67-087c-c03b8dbc7bff","intentConfig":null,"launchData":null,"name":"Contacts Manager","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":448,"width":419},{"universalName":"org.owfgoss.owf.examples.GetDirections","widgetGuid":"302c35c9-9ed8-d0b6-251c-ea1ed4d0c86b","uniqueId":"1929bfaf-ed08-47f3-c231-cd2e9d59e341","dashboardGuid":"f935e19e-09a1-451e-8b3d-0fb77537da7d","paneGuid":"5c478b1d-ba1f-ef67-087c-c03b8dbc7bff","intentConfig":{},"launchData":null,"name":"Directions","active":false,"x":0,"y":482,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"singleton":false,"floatingWidget":false,"height":447,"width":419}],"paneType":"accordionpane","defaultSettings":{"widgetStates":{"302c35c9-9ed8-d0b6-251c-ea1ed4d0c86b":{"timestamp":1354747263559},"d182002b-3de2-eb24-77be-95a7d08aa85b":{"timestamp":1354745224627},"92448ba5-7f2b-982a-629e-9d621268b5e9":{"timestamp":1354747263555}}},"flex":0.25},{"xtype":"dashboardsplitter"},{"xtype":"tabbedpane","cls":"right","htmlText":"75%","items":[],"paneType":"tabbedpane","widgets":[{"universalName":"org.owfgoss.owf.examples.GoogleMaps","widgetGuid":"d182002b-3de2-eb24-77be-95a7d08aa85b","uniqueId":"570f3364-e21a-8f96-d8e5-f61d81196ebc","dashboardGuid":"f935e19e-09a1-451e-8b3d-0fb77537da7d","paneGuid":"a25052e4-cd5d-51c0-a440-81327fc1d955","intentConfig":null,"launchData":null,"name":"Google Maps","active":true,"x":423,"y":62,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":867,"width":1257}],"defaultSettings":{"widgetStates":{"d182002b-3de2-eb24-77be-95a7d08aa85b":{"timestamp":1354747263599},"b87c4a3e-aa1e-499e-ba10-510f35388bb6":{"timestamp":1354746772856},"ec5435cf-4021-4f2a-ba69-dde451d12551":{"timestamp":1354746684155},"eb5435cf-4021-4f2a-ba69-dde451d12551":{"timestamp":1354746684154},"d6ce3375-6e89-45ab-a7be-b6cf3abb0e8c":{"timestamp":1354747222261},"eb81c029-a5b6-4107-885c-5e04b4770767":{"timestamp":1354747222264},"c3f3c8e0-e7aa-41c3-a655-aca3c940f828":{"timestamp":1354746826290}}},"flex":0.75}],"flex":1}', 'Contacts', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add Contacts Dashboards', NOW(), 'Insert Row', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-48', '2.0.1', '3:5eece97768f50b57d39e9d89bf107ed4', 49);

-- Changeset changelog_7.0.0.groovy::7.0.0-51::owf::(Checksum: 3:f251113b4efe442a47c44ceec7b5cd47)
-- Assign Intents and Sample Dashboards to OWF Users group
INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (323, 'dashboard', 342, 'owns', 192, 'group', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Assign Intents and Sample Dashboards to OWF Users group', NOW(), 'Insert Row', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-51', '2.0.1', '3:f251113b4efe442a47c44ceec7b5cd47', 50);

-- Changeset changelog_7.0.0.groovy::7.0.0-54::owf::(Checksum: 3:252a595e2c725d97cbdf9fac5ccb8e14)
-- Create Investments stack and its default group.
INSERT INTO `stack` (`description`, `name`, `stack_context`, `version`) VALUES ('Sample stack containing dashboards with example investment widgets.', 'Investments', 'investments', 0);

INSERT INTO `owf_group` (`automatic`, `name`, `stack_default`, `status`, `version`) VALUES (0, 'ce86a612-c355-486e-9c9e-5252553cc58f', 1, 'active', 0);

insert into stack_groups (stack_id, group_id) values ((select id from stack where stack_context = 'investments'), (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'));

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Create Investments stack and its default group.', NOW(), 'Insert Row (x2), Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-54', '2.0.1', '3:252a595e2c725d97cbdf9fac5ccb8e14', 51);

-- Changeset changelog_7.0.0.groovy::7.0.0-55::owf::(Checksum: 3:48617f163cf4c3ec2ff4fc0e8ae060f1)
-- Add Investments stack to the OWF Users group.
insert into stack_groups (stack_id, group_id) values ((select id from stack where stack_context = 'investments'), (select id from owf_group where name = 'OWF Users'));

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add Investments stack to the OWF Users group.', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-55', '2.0.1', '3:48617f163cf4c3ec2ff4fc0e8ae060f1', 52);

-- Changeset changelog_7.0.0.groovy::7.0.0-57::owf::(Checksum: 3:c1cf825bd1f6c24467b734c1e1381bb8)
-- Rename the Widget Intents dashboard to Watch List and add it to the Investments stack.
update domain_mapping set src_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f') where dest_id = 320;

UPDATE `dashboard` SET `name` = 'Watch List' WHERE guid = '3f59855b-d93e-dc03-c6ba-f4c33ea0177f';

update dashboard set stack_id = (select id from stack where stack_context = 'investments') where guid='3f59855b-d93e-dc03-c6ba-f4c33ea0177f';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Rename the Widget Intents dashboard to Watch List and add it to the Investments stack.', NOW(), 'Custom SQL, Update Data, Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-57', '2.0.1', '3:c1cf825bd1f6c24467b734c1e1381bb8', 53);

-- Changeset changelog_7.0.0.groovy::7.0.0-59::owf::(Checksum: 3:1364ead069969418155f964f1f0e6018)
-- Add the Contacts dashboard to the Investments stack.
update dashboard set stack_id = (select id from stack where stack_context = 'investments') where id = 323;

UPDATE `stack` SET `unique_widget_count` = 6 WHERE stack_context = 'investments';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add the Contacts dashboard to the Investments stack.', NOW(), 'Custom SQL, Update Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-59', '2.0.1', '3:1364ead069969418155f964f1f0e6018', 54);

-- Changeset changelog_7.0.0.groovy::7.0.0-61::owf::(Checksum: 3:fea931ed52774b48d54e6847503e3797)
-- Add Widget Intents and Contacts dashboards' widgets to Investments stack.
insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (343, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 178, 'widget_definition');

insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (344, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 179, 'widget_definition');

insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (345, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 180, 'widget_definition');

insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (346, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 181, 'widget_definition');

insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (347, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 182, 'widget_definition');

insert into domain_mapping (id, version, src_id, src_type, relationship_type, dest_id, dest_type) values (348, 0, (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f'), 'group', 'owns', 183, 'widget_definition');

UPDATE `stack` SET `unique_widget_count` = 6 WHERE stack_context = 'investments';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add Widget Intents and Contacts dashboards'' widgets to Investments stack.', NOW(), 'Custom SQL (x2), Update Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-61', '2.0.1', '3:fea931ed52774b48d54e6847503e3797', 55);

-- Changeset changelog_7.0.0.groovy::7.0.0-63::owf::(Checksum: 3:4b6f0ce071cc1ec44a1c0fc60bd6fdc8)
-- Reorder the dashboards so they appear Sample dashboard, Investments stack, and then Administration dashboard.
UPDATE `dashboard` SET `isdefault` = 0 WHERE guid = '3f59855b-d93e-dc03-c6ba-f4c33ea0177f';

UPDATE `dashboard` SET `dashboard_position` = 1 WHERE guid = '3f59855b-d93e-dc03-c6ba-f4c33ea0177f';

UPDATE `dashboard` SET `dashboard_position` = 2 WHERE guid = '7f2f6d45-263a-7aeb-d841-3637678ce559';

UPDATE `dashboard` SET `dashboard_position` = 3 WHERE guid = '54949b5d-f0ee-4347-811e-2522a1bf96fe';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Reorder the dashboards so they appear Sample dashboard, Investments stack, and then Administration dashboard.', NOW(), 'Update Data (x4)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-63', '2.0.1', '3:4b6f0ce071cc1ec44a1c0fc60bd6fdc8', 56);

-- Changeset changelog_7.0.0.groovy::7.0.0-64::owf::(Checksum: 3:ddd62e2dd108f66e529c468e920246ab)
-- Remove Preferences, Color Client, Color Server, Widget Chrome, Event Monitor, and Nearly Empty widgets.
DELETE FROM `person_widget_definition`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/Preferences.gsp');

DELETE FROM `person_widget_definition`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorClient.gsp');

DELETE FROM `person_widget_definition`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorServer.gsp');

DELETE FROM `person_widget_definition`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp');

DELETE FROM `person_widget_definition`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/EventMonitor.html');

DELETE FROM `person_widget_definition`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/NearlyEmptyWidget.html');

DELETE FROM `widget_definition_widget_types`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/Preferences.gsp');

DELETE FROM `widget_definition_widget_types`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorClient.gsp');

DELETE FROM `widget_definition_widget_types`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/ColorServer.gsp');

DELETE FROM `widget_definition_widget_types`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp');

DELETE FROM `widget_definition_widget_types`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/EventMonitor.html');

DELETE FROM `widget_definition_widget_types`  WHERE widget_definition_id = (select id from widget_definition where widget_url = 'examples/walkthrough/widgets/NearlyEmptyWidget.html');

DELETE FROM `widget_definition`  WHERE widget_url = 'examples/walkthrough/widgets/Preferences.gsp';

DELETE FROM `widget_definition`  WHERE widget_url = 'examples/walkthrough/widgets/ColorClient.gsp';

DELETE FROM `widget_definition`  WHERE widget_url = 'examples/walkthrough/widgets/ColorServer.gsp';

DELETE FROM `widget_definition`  WHERE widget_url = 'examples/walkthrough/widgets/WidgetChrome.gsp';

DELETE FROM `widget_definition`  WHERE widget_url = 'examples/walkthrough/widgets/EventMonitor.html';

DELETE FROM `widget_definition`  WHERE widget_url = 'examples/walkthrough/widgets/NearlyEmptyWidget.html';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Remove Preferences, Color Client, Color Server, Widget Chrome, Event Monitor, and Nearly Empty widgets.', NOW(), 'Delete Data (x18)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-64', '2.0.1', '3:ddd62e2dd108f66e529c468e920246ab', 57);

-- Changeset changelog_7.0.0.groovy::7.0.0-66::owf::(Checksum: 3:712a6dd628e5731f53dc69de87b57842)
-- Add Stacks Admin widgets to sample data.
INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Stack Editor', 440, 184, 'themes/common/images/adm-tools/Stacks64.png', 'themes/common/images/adm-tools/Stacks24.png', 0, 0, 0, '9b5ebb40-8540-466c-8ccd-66092ec55636', 'admin/StackEdit.gsp', '1.0', 581);

INSERT INTO `widget_definition` (`background`, `display_name`, `height`, `id`, `image_url_large`, `image_url_small`, `singleton`, `version`, `visible`, `widget_guid`, `widget_url`, `widget_version`, `width`) VALUES (0, 'Stacks', 440, 185, 'themes/common/images/adm-tools/Stacks64.png', 'themes/common/images/adm-tools/Stacks24.png', 0, 0, 1, 'fe97f656-862e-4c54-928d-3cdd776daf5b', 'admin/StackManagement.gsp', '1.0', 818);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add Stacks Admin widgets to sample data.', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-66', '2.0.1', '3:712a6dd628e5731f53dc69de87b57842', 58);

-- Changeset changelog_7.0.0.groovy::7.0.0-69::owf::(Checksum: 3:b18796e89198ba40cb807e9f49e094b4)
-- Add the group ownership mappings for the stacks admin widgets.
INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (184, 'widget_definition', 349, 'owns', 191, 'group', 0);

INSERT INTO `domain_mapping` (`dest_id`, `dest_type`, `id`, `relationship_type`, `src_id`, `src_type`, `version`) VALUES (185, 'widget_definition', 350, 'owns', 191, 'group', 0);

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Add the group ownership mappings for the stacks admin widgets.', NOW(), 'Insert Row (x2)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-69', '2.0.1', '3:b18796e89198ba40cb807e9f49e094b4', 59);

-- Changeset changelog_7.0.0.groovy::7.0.0-71::owf::(Checksum: 3:96e86a9fdfbb2f2bb35f5c602bbc725d)
-- Insert widget type mapping links for stack admin widgets
insert into widget_definition_widget_types (widget_definition_id, widget_type_id)
          select id, 2 from widget_definition
          where widget_url in (
            'admin/StackManagement.gsp',
            'admin/StackEdit.gsp'
            );

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Insert widget type mapping links for stack admin widgets', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-71', '2.0.1', '3:96e86a9fdfbb2f2bb35f5c602bbc725d', 60);

-- Changeset changelog_7.0.0.groovy::7.0.0-72::owf::(Checksum: 3:8a14e61bb993a56f1d21beab92681112)
-- Update Administration Dashboards
UPDATE `dashboard` SET `layout_config` = '{"xtype":"container","cls":"hbox ","layout":{"type":"hbox","align":"stretch"},"items":[{"xtype":"accordionpane","cls":"left","flex":1,"htmlText":"50%","items":[],"widgets":[{"universalName":null,"widgetGuid":"9d804b74-b2a6-448a-bd04-fe286905ab8f","uniqueId":"327a1df4-a879-f361-db47-03635a0f5730","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"73cf2212-9c0a-5d75-987c-4820faf3cf30","intentConfig":null,"name":"Group Dashboards","active":false,"x":0,"y":34,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":4,"singleton":false,"floatingWidget":false,"height":329,"width":675,"background":false,"columnOrder":""},{"universalName":null,"widgetGuid":"412ec70d-a178-41ae-a8d9-6713a430c87c","uniqueId":"ca5b5bb3-14de-3a77-e689-1a752adca824","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"73cf2212-9c0a-5d75-987c-4820faf3cf30","intentConfig":null,"name":"Widgets","active":false,"x":0,"y":363,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":5,"singleton":false,"floatingWidget":false,"height":328,"width":675,"background":false,"columnOrder":""},{"universalName":null,"widgetGuid":"fe97f656-862e-4c54-928d-3cdd776daf5b","uniqueId":"58f2f00b-a785-c61c-497f-7a99a59e350d","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"73cf2212-9c0a-5d75-987c-4820faf3cf30","intentConfig":null,"name":"Stacks","active":true,"x":0,"y":691,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":3,"singleton":false,"floatingWidget":false,"height":328,"width":675,"background":false,"columnOrder":""}],"paneType":"accordionpane","defaultSettings":{"widgetStates":{"9d804b74-b2a6-448a-bd04-fe286905ab8f":{"timestamp":1354917003344},"412ec70d-a178-41ae-a8d9-6713a430c87c":{"timestamp":1354917003349},"fe97f656-862e-4c54-928d-3cdd776daf5b":{"timestamp":1354917003354},"9b5ebb40-8540-466c-8ccd-66092ec55636":{"timestamp":1354916964296},"6cf4f84a-cc89-45ba-9577-15c34f66ee9c":{"timestamp":1354916988848},"a540f672-a34c-4989-962c-dcbd559c3792":{"timestamp":1354916998451}}}},{"xtype":"dashboardsplitter"},{"xtype":"container","cls":"vbox right","layout":{"type":"vbox","align":"stretch"},"items":[{"xtype":"tabbedpane","cls":"top","flex":1,"htmlText":"50%","items":[],"widgets":[{"universalName":null,"widgetGuid":"b87c4a3e-aa1e-499e-ba10-510f35388bb6","uniqueId":"49404ec0-c77c-f6b8-b3f9-d5c77fe465a1","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"da405d45-8f04-c2d6-f45c-5ba780aa97fc","intentConfig":null,"name":"Groups","active":false,"x":679,"y":62,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":3,"singleton":false,"floatingWidget":false,"height":462,"width":676,"background":false,"columnOrder":""},{"universalName":null,"widgetGuid":"b3b1d04f-97c2-4726-9575-82bb1cf1af6a","uniqueId":"7437065e-fb6c-3253-866c-d05bf45d180a","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"da405d45-8f04-c2d6-f45c-5ba780aa97fc","intentConfig":null,"name":"Users","active":false,"x":679,"y":62,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":2,"singleton":false,"floatingWidget":false,"height":462,"width":676,"background":false,"columnOrder":""}],"paneType":"tabbedpane","defaultSettings":{"widgetStates":{"b87c4a3e-aa1e-499e-ba10-510f35388bb6":{"timestamp":1354916950506},"b3b1d04f-97c2-4726-9575-82bb1cf1af6a":{"timestamp":1354916950489}}}},{"xtype":"dashboardsplitter"},{"xtype":"tabbedpane","cls":"bottom","flex":1,"htmlText":"50%","items":[],"paneType":"tabbedpane","widgets":[{"universalName":null,"widgetGuid":"9b5ebb40-8540-466c-8ccd-66092ec55636","uniqueId":"de8e1489-1cfc-7a26-e807-6167d91f1539","dashboardGuid":"6a0fa5ae-70fa-191a-4998-9c0fa9ad3e9f","paneGuid":"1e5dc42c-89c2-6fd4-b887-efaafdceb260","intentConfig":null,"name":"Stack Editor","active":true,"x":679,"y":556,"zIndex":0,"minimized":false,"maximized":false,"pinned":false,"collapsed":false,"columnPos":0,"buttonId":null,"buttonOpened":false,"region":"none","statePosition":1,"singleton":false,"floatingWidget":false,"height":463,"width":676,"background":false,"columnOrder":""}],"defaultSettings":{"widgetStates":{"9b5ebb40-8540-466c-8ccd-66092ec55636":{"timestamp":1354917012829},"6cf4f84a-cc89-45ba-9577-15c34f66ee9c":{"timestamp":1354917003399},"a540f672-a34c-4989-962c-dcbd559c3792":{"timestamp":1354917012827}}}}],"flex":1}],"flex":3}' WHERE id=322;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Update Administration Dashboards', NOW(), 'Update Data', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-72', '2.0.1', '3:8a14e61bb993a56f1d21beab92681112', 61);

-- Changeset changelog_7.0.0.groovy::7.0.0-73::owf::(Checksum: 3:5d99754b0310d86cc5037b53efb1a660)
-- Clean out some old domain mapping entries for widgets that have been removed from our sample database.
DELETE FROM `domain_mapping`  WHERE dest_id = 6 AND dest_type = 'widget_definition';

DELETE FROM `domain_mapping`  WHERE dest_id = 7 AND dest_type = 'widget_definition';

DELETE FROM `domain_mapping`  WHERE dest_id = 171 AND dest_type = 'widget_definition';

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Clean out some old domain mapping entries for widgets that have been removed from our sample database.', NOW(), 'Delete Data (x3)', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-73', '2.0.1', '3:5d99754b0310d86cc5037b53efb1a660', 62);

-- Changeset changelog_7.0.0.groovy::7.0.0-74::owf::(Checksum: 3:289db2d701e3e83ed976dd71c78ccd7b)
-- Remove Contacts dashboard from OWF Users group and add it to the default stack.
update domain_mapping set src_id = (select id from owf_group where name = 'ce86a612-c355-486e-9c9e-5252553cc58f') where dest_id = 323;

INSERT INTO `DATABASECHANGELOG` (`AUTHOR`, `COMMENTS`, `DATEEXECUTED`, `DESCRIPTION`, `EXECTYPE`, `FILENAME`, `ID`, `LIQUIBASE`, `MD5SUM`, `ORDEREXECUTED`) VALUES ('owf', 'Remove Contacts dashboard from OWF Users group and add it to the default stack.', NOW(), 'Custom SQL', 'EXECUTED', 'changelog_7.0.0.groovy', '7.0.0-74', '2.0.1', '3:289db2d701e3e83ed976dd71c78ccd7b', 63);

-- Release Database Lock
