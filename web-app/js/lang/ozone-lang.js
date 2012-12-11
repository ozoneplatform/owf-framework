var Ozone = Ozone || {};
Ozone.layout = Ozone.layout || {};
Ozone.ux = Ozone.ux || {};
Ozone.util = Ozone.util || {};

/*
 * General Algorithm 
 * 
 * if queryString contains lang parameter swith to that locale
 * else check browser language setting
 * 
 * Language switching is accomplished by incliuding a locale
 * specific javascript file
 */
/**
 * @class
 * @description Provides utility methods for localization
 */
Ozone.lang = {
	languageSetting : 'en-US', 
	
	regexLeadingTailingSpaceChars: /^\s+|\s+$/g,
	
	regexTrailingSpaceChars: /\s+$/,
	
	regexLeadingSpaceChars: /^\s+/,
	
	version : Ozone.version.owfversion + Ozone.version.language,
	
	urlDecode: function(string, overwrite){
        if (!string || !string.length) {
            return {};
        }
        var obj = {};
        var pairs = string.split('&');
        var pair, name, value;
        for (var i = 0, len = pairs.length; i < len; i++) {
            pair = pairs[i].split('=');
            name = decodeURIComponent(pair[0]);
            value = decodeURIComponent(pair[1]);
            if (overwrite !== true) {
                if (typeof obj[name] == "undefined") {
                    obj[name] = value;
                }
                else 
                    if (typeof obj[name] == "string") {
                        obj[name] = [obj[name]];
                        obj[name].push(value);
                    }
                    else {
                        obj[name].push(value);
                    }
            }
            else {
                obj[name] = value;
            }
        }
        return obj;
    },
	
    /**
     * @description Gets the language that is currently being used by OWF
     * @return Returns the ISO 639-1 language code for the language that is currently being used by OWF
     * @example
     * if (Ozone.lang.getLanguage() == 'es') {
     *   AnnouncingClockStrings.timeLabel = 'El tiempo es';
     * } 
     * 
     */
	getLanguage : function() {
	    var params = Ozone.lang.urlDecode(window.location.search.substring(1));
        if (params.lang) {
			return params.lang;
		}
        else {

          //try to find it in the window.name
          if (Ozone.util.parseWindowNameData) {

            var data = Ozone.util.parseWindowNameData();
            if (data != null && data.lang) {
              return data.lang;
            }
          }
        }

        //just use default
        return Ozone.lang.languageSetting;  
    } 
};

Ozone.layout.Menu = {
	overflowMenuButtonTooltip : "Click to show more buttons"
};

Ozone.layout.ConfigurationWindowString = {
	setAsNew : "Save as new", 
    setAsDefault : "Set as default",
    showCarousel : "Show Launch Menu",
    showShortcuts : "Show Shortcuts",
    showToolbar : "Show toolbar options",
    documentTitle : "Document Title",
	
	topSelector : 'Top', 
    centerSelector : 'Center',
    accordionSelector : 'Accordion', 
    toolbarButtons : 'Toolbar Buttons', 
    clear : 'Clear',
    save : 'OK',
    cancel : 'Cancel',
    clearAll: 'Clear All',
	
    column : 'Column', 
    columns : 'Columns',
	
    tab : 'Tab', 
    tabs : 'Tabs'
};

Ozone.layout.CreateViewWindowString = {
    createNew: 'Create new',
    createFromExisiting: 'Create from existing',
    importView: 'Import'
};

Ozone.layout.ManageViewsWindowString = {
    languages: 'Language'
};

Ozone.layout.ToolbarString = {
   configurationManager : 'Configuration Manager'
};

Ozone.layout.DesktopWindowManagerString = {
    configureDashboard : 'Configure Dashboard', 
    toggleCarousel : 'Toggle Launch Menu',
    welcomeMessage : 'Welcome'
};

Ozone.layout.tooltipString = {
	widgetLaunchMenuTitle: 			'Launch Menu',
	manageDashboardsTitle: 			'Dashboard Settings',
	manageDashboardsContent: 		'This screen allows users to rearrange, edit, and delete dashboards. It also allows users to set their language preference.',
	createDashboardTitle: 			'Create Dashboard',
	createDashboardContent: 		'This screen allows users to create blank dashboards, copy an existing dashboard, or import a dashboard from a shared configuration.',
	addWidgetsTitle: 				'Launch Menu (Alt+Shift+L)',
	addWidgetsContent: 				'This button opens or closes the Launch Menu, allowing users to add widgets to their current dashboard.',
	dashboardSwitcherTitle:			'Switcher (Alt+Shift+C)',
	dashboardSwitcherContent:		'This button opens or closes the Switcher, allowing users to switch between their dashboards.',
	marketplaceWindowTitle:			'Marketplace (Alt+Shift+M)',
	marketplaceWindowContent:		'This button opens the Marketplace window, allowing users to discover widgets in Marketplace and add them to their OWF instance.',
    metricWindowTitle:		    	'Metric (Alt+Shift+R)',
    metricWindowContent:      		'This button opens the Metric window, where widgets that monitor OWF and widget statistics are located.',
	settingsTitle:					'Settings (Alt+Shift+S)',
	settingsContent:				'This button opens the Settings window, allowing users to customize their widgets or change themes.',
	adminToolsTitle:				'Administration (Alt+Shift+A)',
	adminToolsContent:				'This button opens the Administration window, exposing administrators to functionality for managing groups, dashboards, widgets, and users.',
	helpTitle:						'Help (Alt+Shift+H)',
	helpContent:					'This button opens the Help window, allowing users to browse help files for assistance on using OWF.',
	shareTitle: 					'Share Dashboard',
	shareContent: 					'This feature allows a user to export their current dashboard so that other users can import it.',
	customizeDashboardTitle:		'Customize Dashboard',
	customizeDashboardContent: 		'This screen allows users to customize the current dashboard.',
	eventingTitle:					'Dynamic Eventing',
	eventingContent: 				'This screen allows users to manage dynamic widget eventing.',
    themeSelectorTitle:             'Change the styling of your OWF',
    themeSelectorContent:           'This screen allows users to change the background, window color and style for OWF.',
	showBannerTitle: 				'Show/Hide Banner',
	showBannerContent: 				'This button shows and hides the bottom two rows of the dashboard banner.',
	carouselCloseContent: 			'This button closes the widget Launch Menu.',
	carouselCloseTitle: 			'Close Launch Menu',
	carouselManageWidgetsTitle:		'Widget Settings',
	carouselManageWidgetsContent: 	'This screen allows users to customize their Launch Menu, controlling which widgets are visible and the order in which they appear. It also allows for the deletion of widgets and contains a link to the OWF Marketplace. The grouping tags of a widget can also be modified in this screen.',
	adminWDEditTitle: 				'Edit Widget Definition',
	adminWDEditContent: 			'Change the properties of a widget definition. Note that while properties such as URLs will propagate to already existing instances of a widget, malleable properties such as height will not be affected.',
	adminWDDeleteTitle: 			'Delete Widget Definition',
	adminWDDeleteContent: 			'Deletes the selected widget definition. In addition to removing the definition itself, all instances of this widget will be removed from all user dashboards.',
	adminDashAddTitle:				'Add Dashboard',
	adminPWDApplyTitle:				'Apply User Widgets',
    adminPWDApproveTitle:			'Approve User Widgets',
	adminDashCopyTitle: 			'Copy Dashboard',
	adminDashCopyContent: 			'Copy an existing dashboard to one or more users. Note that once copied, each dashboard instance is an independent entity. Changes made to the initial dashboard at a later date will not be copied.',
	adminDashEditTitle: 			'Edit Dashboard',
	adminDashEditContent: 			'Changes the properties of a dashboard. Note that dashboard state is represented as a JSON object, and any changes made to it must be valid JSON.',
	adminDashDeleteTitle: 			'Delete Dashboard',
	adminDashDeleteContent: 		'Deletes the selected dashboard. Note that if a user is currently using the dashboard, they will not be kicked out. However, it will not be available once they navigate away.',
	adminPrefsCopyTitle: 			'Copy Preference',
	adminPrefsCopyContent: 			'Copy an existing preference to one or more users. Note that once copied, each preference instance is an independent entity. Changes made to the initial preference at a later date will not be copied.',
	adminPrefsEditTitle: 			'Edit Preference',
	adminPrefsEditContent: 			'Changes the properties of a preference.',
	adminPrefsDeleteTitle: 			'Delete Preference.',
	adminPrefsDeleteContent: 		'Deletes the selected preference.',
	adminUsersEditTitle: 			'Edit User',
	adminUsersEditContent: 			'Changes the properties of a user. Note that this does not edit any user information in an underlying security implementation. Only the information that is stored in the framework itself will be changed.',
	adminUsersDeleteTitle: 			'Delete User',
	adminUsersDeleteContent:		'Deletes a given user from the framework. Note that this does not delete the user information in an underlying security implementation. Only the user information that is stored in the framework itself will be removed. In addition, it is possible that with certain security implementations such as x509 certificates, a user will be re-created by the framework if they successfully authenticate.',
	adminUserWidgetsDeleteTitle: 	'Delete User Widget',
	adminUserWidgetsDeleteContent: 'Removes access to this widget for a given user. Please note that this will not delete the underlying widget definition - other users will still have access.',
	clearConnectionsTitle: 	'Clear All Connections',
	clearConnectionsContent: 'Removes all directed dynamic eventing connections between the widgets on this dashboard.',
        bannerDockTitle:                        'Dock',
        bannerDockContent:                      'Dock toolbar to banner at top of page.',
        bannerUndockTitle:                      'Undock',
        bannerUndockContent:                    'Undock toolbar to floating position and hide banner.'
};

Ozone.layout.admin = {
	updateDashboardTitle: 			'Update Dashboard',
	dashboardUpdatedContent: 		'Dashboard updated successfully.'
};

Ozone.ux.DashboardMgmtString = {
    createDashboard : 'Create a Dashboard', 
    selectDashboardDotDot : 'Select a dashboard...',
    deleteDashboard : 'Delete a Dashboard', 
    importaDashboard : 'Import a Dashboard',
    exportDashboard : 'Export Current Dashboard', 
    exportDashboardConfig : 'Export Dashboard Configuration', 
    uploadConfig : 'Upload...', 
    setAsDefault : 'Set as default', 
    dashboards : 'Dashboards', 
    title : 'Title', 
    layout : 'Layout', 
    description : 'Description',
    top : 'Top', 
    bottom : 'Bottom', 
    columns : 'Columns', 
    arrangement : 'Arrangement', 
    selectDashboard : 'Select Dashboard', 
    accordion : 'Accordion', 
    portal : 'Portal', 
    tabbed : 'Tabbed', 
    desktop : 'Desktop', 
    fit : 'Fit', 
	tooltipManageDashboards: 'Dashboard Settings',
	tooltipCreateDashboard: 'Create Dashboard',
	
    ok : 'OK', 
    reset : 'Reset',
    about: 'About', 
    logout: 'Logout', 
    importDashboard : 'Import Dashboard', 
    dashboardTitle : 'Dashboard Title', 
    enterDashboardTitle : 'Enter Dashboard Title...',
    browse : 'Browse...', 
	
	loadDefaultMsg : 'Load Default Configuration?',
	noDashboardSelectedMsg : 'No configuration was selected.  Do you want to load the default configuration?',
	changeLanguage : 'Change Language',
	es : 'Spanish',
	en_US : 'English',
	ko : 'Korean'
};

Ozone.layout.AccordionWindowManagerString = {
    configureAccordion : 'Configure Accordion' 
};

Ozone.layout.PortalWindowManagerString = {
    configurePortlets : 'Configure Portlets'    
};

Ozone.layout.TabbedWindowManagerString = {
    configureTabs : '<span class="configureTabButton">Configure Tabs</span>'   
};

Ozone.util.ErrorMessageString = {
	errorTitle : 'Error',
	dashboardConfig : 'Dashboard Configuration',
	widgetConfiguration : 'Widget Configuration', 
	noWidgets : 'There are no widgets to which you have access.', 
	configurationMsg : 'Failed to retrieve configuration data', 
	dashboardBlankMsg: 'Invalid Dashboard Name, it cannot be blank. <br />Please provide a valid Dashboard Name.',
	dashboardInvalidEntryMsg: "Unable to update dashboard name(s) due <br/>to invalid characters.",
	invalidForm : 'Invalid Form',
	invalidFormMsg : 'Form is invalid.  Please make sure all required fields are completed.',
	languagePreference : 'Language Preference',
	languagePreferenceMsg : 'Error saving language preference',
	settingSessionDataMsg : 'Error setting session data',
	retrievingSessionDataMsg : 'Error retrieving session data',
	saveUserPreferences : 'Error saving user preference',
	storeErrorMsg : 'Store Error Message',
	sendAndForget : 'Send and Forget',
	userName : 'User Name',
	updateDashboardMsg : 'Error updating dashboard',
	saveUpdatedViews : 'Update Dashboards',
	saveUpdatedViewsMsg : 'Error updating Dashboards',
	saveUpdatedWidgets : 'Update Widgets',
	saveUpdatedWidgetsMsg : 'Error updating widgets',
	retrieveUpdatedWidgets : 'Retrieving Updated Widgets',
	retrieveUpdatedWidgetsMsg : 'Error retrieving updated widgets',
	invalidUrl: 'Invalid Url',
	invalidUrlMsg: 'The dashboard can not be found. It may have been deleted. You will be redirected to your default dashboard.',
    invalidDashboard: 'Invalid Dashboard Id',
    invalidDashboardGotoDefaultMsg: 'The dashboard can not be found. It may have been deleted. You will be redirected to your default dashboard.',
    invalidDashboardMsg: 'The dashboard can not be found. It may have been deleted. You will be redirected to the previous dashboard',
	invalidDashboardNameMsg: 'Dashboard name is invalid.  It cannot include start or end with a space.',
	leadingOrTrailingWhiteSpacesMsg : 'Leading or trailing spaces around dashboard name are not allowed',
	logoutError: 'Logout Error',
	logoutErrorMsg: 'Please close your browser to ensure logout success.',
	widgetName : 'Widget Name',
	maximumLength : 'The maximum length for this field is {0}',
	about : 'About',
	aboutErrorMsg: 'Error retrieving application information.',
	widgetNotApproved: 'This widget has not yet been approved for use.  Please see a system administrator for approval.',
    restrictedTagError: ' is a restricted tag.  You may not edit it or add it to other widgets',
    mpErrorTitle: 'Marketplace Error',
    mpErrorMsg: 'There has been an error accessing Marketplace. Please contact your System Administrator to verify that Marketplace connectivity has been correctly configured and that the Marketplace server is currently running.',
    oneSingleton: 'Only one instance of a Singleton is permitted'
};

Ozone.layout.MessageBoxButtonText = {
	ok: 'OK',
	cancel : 'Cancel',
    yes : 'Yes',
    no : 'No'
};

Ozone.layout.DialogMessages = {
	update: 'Update',
	updating: 'Updating...',
	updated: 'Updated',
	add: 'Add',
	adding : 'Adding...',
	added: 'Added',
	added_colon: 'Added:',
    added_successfully: 'added successfully',
	copy: 'Copy',
    copying : 'Copying...',
    copied: 'Copied',
    cancel: 'Cancel',
    ok: 'OK',
    error: 'Error',
    addWidget: 'Add Widget',
    editWidget: 'Edit Widget',
    removed_colon: 'Removed:',
    retained_colon: 'Retained:',
    applied_colon: 'Applied:',
    updated_successfully: 'updated successfully',
    added_for: 'added for',
    formInvalid_CheckFieldMessages: 'Form Invalid.<br />Check highlighted field messages (!).',
    formInvalid_SelectOneUser: 'Form Invalid.<br />You need to select at least 1 user.',
    formInvalid_SelectOneWidget: 'Form Invalid.<br />You need to select at least 1 widget.',
    view: 'Dashboard',
    view_status: 'Dashboard Status',
    view_dashboardNameField_label: 'Dashboard name',
    view_dashboardNameField_blankText: 'Please supply a Dashboard Name',
    view_dashboardStateField_label: 'Configuration',
    view_dashboardStateField_blankText: 'Please supply a Dashboard Configuration',
    view_dashboardGuidField_label: 'GUID',
    view_dashboardLayoutField_label: 'Layout',
    view_dashboardIsDefaultField_label: 'Default',
    formError_saveView: 'An error occurred while attempting to save a dashboard.',
    user: 'User',
    users_opt: 'user(s)',
    user_status: 'User Status',
    user_usernameField_label: 'User ID',
    user_usernameField_blankText: 'Please supply a User ID',
    user_userRealNameField_label: 'Name', 
    user_userRealNameField_blankText: 'Please supply a name for the user',
    formError_saveUser: 'An error occurred while attempting to save a user.',
    preference: 'Preference',
    preference_preferenceNameField_label: 'Preference Name',
    preference_preferenceNameField_blankText: 'Please supply a Preference Name',
    preference_preferenceNamespaceField_label: 'Namespace',
    preference_preferenceNamespaceField_blankText: 'Please supply a Preference Namespace',
    preference_preferenceValueField_label: 'Value',
    preference_preferenceValueField_blankText: 'Please supply a Preference Value',
    preference_status: 'Preference Status',
    formError_savePreference: 'An error occurred while attempting to save a preference.',
    widgetDefinition: 'Widget Definition',
    widgetDefinition_status: 'Widget Status',
    widgetDefinition_widgetAccess: 'Widget Access',
    widgetDefinition_descriptorUrlField_blankText: 'Please supply a Widget Descriptor URL',
    widgetDefinition_displayNameField_label: 'Widget Name',
    widgetDefinition_widgetVersionField_label: 'Version',
    widgetDefinition_displayNameField_blankText: 'Please supply a Widget Name',
    widgetDefinition_widgetVersionField_blankText: 'Please supply a Widget Version',
    widgetDefinition_widgetGuidField_label: 'GUID',
    widgetDefinition_widgetUrlField_label: 'URL',
    widgetDefinition_widgetUrlField_blankText: 'Please supply a Widget URL',
    widgetDefinition_imageUrlSmallField_label: 'Container Icon URL',
    widgetDefinition_imageUrlSmallField_blankText: 'Please supply a Container Icon URL',
    widgetDefinition_imageLargeUrlField_label: 'Launch Menu Icon URL',
    widgetDefinition_imageLargeUrlField_blankText: 'Please supply a Launch Menu Icon URL',
    widgetDefinition_widthNumberField_label: 'Width',
    widgetDefinition_widthNumberField_blankText: 'Please supply a Widget width',
    widgetDefinition_heightNumberField_label: 'Height',
    widgetDefinition_heightNumberField_blankText: 'Please supply a Widget height' ,
    widgetDefinition_secureUrl_warningText: 'Entering a secure HTTPS address may prevent browser security warnings such as "This page contains unsecure content."' ,
    personWidgetDef_Apply: 'Apply',
    personWidgetDef_Order: 'Order',
    personWidgetDef_Widget: 'Widget',
    personWidgetDef_WidgetAccessApplied: 'Widget Access Applied',
    personWidgetDef_ApplyStatus: 'Apply Status',
    personWidgetDef_NoChangesNecessary: 'No changes were necessary', 
    formError_savePersonDefWidgets: 'An error occurred while attempting to save user widget(s).',
    formError_saveWidgetDefinition: 'An error occurred while attempting to save the widget.',
    personWidgetDef_WidgetContainerPanelTitle: 'Widgets',
	marketplaceWindow_AddWidget: 'An error occurred while attempting to add the widget from Marketplace.',
	marketplaceWindow_currentUser: 'Could not retrieve current user name and id.',
    marketplaceWindow_AddSuccessful: 'The widget was added successfully from Marketplace',
	widgetAdded: 'Selected widget is already added for this user',
	marketplaceWindow_RequiredListingsAlertMsg: 'The widget you have launched will not work without some dependencies.  These widgets are listed below and will be additionally added to the launch menu.',
    fitPaneFullWarning: 'You are attempting to add a widget to a pane with a single-widget layout. Continuing will replace the existing widget.',
    dashboardLockTitle: 'Lock Dashboard',
    dashboardLockWarning: 'Locking this dashboard disables the Launch Menu. New widgets cannot be launched or added to this layout. Do you still want to lock this dashboard?',
    dashboardLockAlertTitle: 'Locked Dashboard',
    dashboardLockAlert: 'This dashboard is locked. Widgets cannot be added or removed from a locked dashboard.',
    closeBackgroundWidgetWarning: ' is a background widget. You won’t see it on your screen because it runs behind the scenes.<br/><br/>To close the widget, click OK.'
};

Ozone.layout.ThemeSwitcherWindowConstants = {
    title: 'Theme Settings',
    header: 'Change the styling of your OWF',
    subheader: 'Select a theme below to change the background, window color, and style for OWF.',
    ok: 'OK',
    cancel: 'Cancel'
};
