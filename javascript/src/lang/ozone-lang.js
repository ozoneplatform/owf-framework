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
    chosePremadeLayout: 'Choose a template',
    createFromExisting: 'Copy the layout of an existing Page',
    createNew: 'Create a new layout'
};

Ozone.layout.ManageViewsWindowString = {
    languages: 'Language'
};

Ozone.layout.ToolbarString = {
   configurationManager : 'Configuration Manager'
};

Ozone.layout.DesktopWindowManagerString = {
    configureDashboard : 'Configure Page',
    toggleCarousel : 'Toggle Launch Menu',
    welcomeMessage : 'Welcome'
};

Ozone.layout.tooltipString = {
	widgetLaunchMenuTitle: 			'Launch Menu',
	manageDashboardsTitle: 			'Page Settings',
	manageDashboardsContent: 		'This screen allows users to rearrange, edit, and delete pages. It also allows users to set their language preference.',
	createDashboardTitle: 			'New App',
	createDashboardContent: 		'This screen allows users to create blank pages, copy an existing pages, or import a page from a shared configuration.',
	addWidgetsTitle: 				'App Components (Alt+Shift+F)',
	addWidgetsContent: 				'This button opens or closes the App Components, allowing users to add App Components to their current page.',
    addWidgetsContentDisabled:      'You must open an OZONE App before starting an App Component. To do this, click My Apps, start an app and then open App Components.',
    myAppsWindowTitle:			'My Apps (Alt+Shift+C)',
	myAppsWindowContent:		'This opens My Apps, allowing users to Start and Manage their Applications.',
	marketplaceWindowTitle:			'Store (Alt+Shift+M)',
	marketplaceWindowContent:		'This button opens the Store window, allowing users to discover App Components in Apps Mall and add them to their App Components.',
    metricWindowTitle:		    	'Metric (Alt+Shift+R)',
    metricWindowContent:      		'This button opens the Metric window, where widgets that monitor OWF and widget statistics are located.',
	settingsTitle:					'Settings (Alt+Shift+S)',
	settingsContent:				'This button opens the Settings window, allowing users to customize their widgets or change themes.',
	adminToolsTitle:				'Administration (Alt+Shift+A)',
	adminToolsContent:				'This button opens the Administration window, exposing administrators to functionality for managing groups, pages, widgets, and users.',
	helpTitle:						'Help (Alt+Shift+H)',
	helpContent:					'This button opens the Help window, allowing users to browse help files for assistance on using this application.',
	shareTitle: 					'Share Page',
	shareContent: 					'This feature allows a user to export their current page so that other users can import it.',
	customizeDashboardTitle:		'Customize Page',
	customizeDashboardContent: 		'This screen allows users to customize the current page.',
	eventingTitle:					'Dynamic Eventing',
	eventingContent: 				'This screen allows users to manage dynamic widget eventing.',
    themeSelectorTitle:             'Change the styling of your OWF',
    themeSelectorContent:           'This screen allows users to change the background, window color and style for OWF.',
	showBannerTitle: 				'Show/Hide Banner',
	showBannerContent: 				'This button shows and hides the bottom two rows of the page banner.',
	carouselCloseContent: 			'This button closes the widget Launch Menu.',
	carouselCloseTitle: 			'Close Launch Menu',
	carouselManageWidgetsTitle:		'Widget Settings',
	carouselManageWidgetsContent: 	'This screen allows users to customize their Launch Menu, controlling which widgets are visible and the order in which they appear. It also allows for the deletion of widgets and contains a link to the OWF Marketplace. The grouping tags of a widget can also be modified in this screen.',
	adminWDEditTitle: 				'Edit Widget Definition',
	adminWDEditContent: 			'Change the properties of a widget definition. Note that while properties such as URLs will propagate to already existing instances of a widget, malleable properties such as height will not be affected.',
	adminWDDeleteTitle: 			'Delete Widget Definition',
	adminWDDeleteContent: 			'Deletes the selected widget definition. In addition to removing the definition itself, all instances of this widget will be removed from all user dashboards.',
	adminDashAddTitle:				'Add Page',
	adminPWDApplyTitle:				'Apply User Widgets',
    adminPWDApproveTitle:			'Approve User Widgets',
	adminDashCopyTitle: 			'Copy Page',
	adminDashCopyContent: 			'Copy an existing page to one or more users. Note that once copied, each page instance is an independent entity. Changes made to the initial dashboard at a later date will not be copied.',
	adminDashEditTitle: 			'Edit App',
	adminDashEditContent: 			'Changes the properties of a page. Note that page state is represented as a JSON object, and any changes made to it must be valid JSON.',
	adminDashDeleteTitle: 			'Delete Page',
	adminDashDeleteContent: 		'Deletes the selected page. Note that if a user is currently using the page, they will not be kicked out. However, it will not be available once they navigate away.',
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
	clearConnectionsContent: 'Removes all directed dynamic eventing connections between the widgets on this page.',
        bannerDockTitle:                        'Dock',
        bannerDockContent:                      'Dock toolbar to banner at top of page.',
        bannerUndockTitle:                      'Undock',
        bannerUndockContent:                    'Undock toolbar to floating position and hide banner.',
    unapprovedStackEditMessage:                 'The application <b>must be</b> approved in the Store before adding users or groups.',
    unapprovedStackWithoutMarkpetplaceEditMessage: 'The application <b>must be</b> shared by owner before adding users or groups.'
};

Ozone.layout.admin = {
	updateDashboardTitle: 			'Update Page',
	dashboardUpdatedContent: 		'Page updated successfully.'
};

Ozone.ux.DashboardMgmtString = {
    createNewAppTitle: 			    'Create New App',
    createNewPageTitle: 			'Create New Page',
    createNewAppHeader: 		    'Enter a title and image location, then describe the new App:',
    createNewPageHeader: 		    'Enter a title and image location, then describe the new Page:',

    createNewHeader : 'Enter a title and image location, then describe the new App',
    titleBlankText: 'Title',
    iconBlankText: 'Icon URL',
    descriptionBlankText : 'Description',

    premadeLayout: 'Choose a premade layout',
    existingLayout: 'Use the layout of an existing App',
    newLayout: 'Create a new layout',

    addPageToExisting: 'Add this as page to existing',
    createDashboard : 'Create a Page',
    selectDashboardDotDot : 'Select a page...',
    deleteDashboard : 'Delete a Page',
    importaDashboard : 'Import a Page',
    exportDashboard : 'Export Current Page',
    exportDashboardConfig : 'Export Page Configuration',
    uploadConfig : 'Upload...',
    setAsDefault : 'Set as default',
    dashboards : 'Pages',
    title : 'Title',
    layout : 'Layout',
    description : 'Description',
    top : 'Top',
    bottom : 'Bottom',
    columns : 'Columns',
    arrangement : 'Arrangement',
    selectDashboard : 'Select Page',
    accordion : 'Accordion',
    portal : 'Portal',
    tabbed : 'Tabbed',
    desktop : 'Desktop',
    fit : 'Fit',
	tooltipManageDashboards: 'Page Settings',
	tooltipCreateDashboard: 'New App',

    ok : 'OK',
    reset : 'Reset',
    about: 'About',
    logout: 'Logout',
    importDashboard : 'Import Page',
    dashboardTitle : 'Page Title',
    enterDashboardTitle : 'Enter Page Title...',
    browse : 'Browse...',

	loadDefaultMsg : 'Load Default Configuration?',
	noDashboardSelectedMsg : 'No configuration was selected.  Do you want to load the default configuration?',
	changeLanguage : 'Change Language',
	es : 'Spanish',
	en_US : 'English',
	ko : 'Korean'
};

if (Ozone.config &&
    Ozone.config.currentTheme &&
    Ozone.config.currentTheme.themeName) {
    Ozone.ux.DashboardMgmtString.dashboardIconPath = '/themes/' + Ozone.config.currentTheme.themeName + '.theme/images/myappswindow/DashboardIcon64.png';
    Ozone.ux.DashboardMgmtString.stackIconPath = '/themes/' + Ozone.config.currentTheme.themeName + '.theme/images/myappswindow/StacksIcon64.png';
} else {
    Ozone.ux.DashboardMgmtString.dashboardIconPath = '/themes/common/images/myappswindow/DashboardIcon64.png';
    Ozone.ux.DashboardMgmtString.stackIconPath = '/themes/common/images/myappswindow/StacksIcon64.png';
}

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
	dashboardConfig : 'Page Configuration',
	widgetConfiguration : 'App Component Configuration',
	noWidgets : 'There are no App Components to which you have access.',
	configurationMsg : 'Failed to retrieve configuration data',
	dashboardBlankMsg: 'Invalid Page Name, it cannot be blank. <br />Please provide a valid Page Name.',
	dashboardInvalidEntryMsg: "Unable to update page name(s) due <br/>to invalid characters.",
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
	updateDashboardMsg : 'Error updating page',
	saveUpdatedViews : 'Update Pages',
	saveUpdatedViewsMsg : 'Error updating Pages',
	saveUpdatedWidgets : 'Update App Components',
	saveUpdatedWidgetsMsg : 'Error updating App Components',
	retrieveUpdatedWidgets : 'Retrieving Updated App Components',
	retrieveUpdatedWidgetsMsg : 'Error retrieving updated App Components',
	invalidUrl: 'Invalid Url',
	invalidUrlMsg: 'The page can not be found. It may have been deleted. You will be redirected to your default page.',
    invalidDashboard: 'Invalid Page Id',
    invalidDashboardGotoDefaultMsg: 'The page can not be found. It may have been deleted. You will be redirected to your default page.',
    invalidDashboardMsg: 'The page can not be found. It may have been deleted. You will be redirected to the previous page',
	invalidDashboardNameMsg: 'Page name is invalid.  It cannot include start or end with a space.',
	leadingOrTrailingWhiteSpacesMsg : 'Leading or trailing spaces around page name are not allowed',
	logoutError: 'Logout Error',
	logoutErrorMsg: 'Please close your browser to ensure logout success.',
	widgetName : 'App Component Name',
	maximumLength : 'The maximum length for this field is {0}',
	about : 'About',
	aboutErrorMsg: 'Error retrieving application information.',
	widgetNotApproved: 'This App Component has not yet been approved for use.  Please see a system administrator for approval.',
    restrictedTagError: ' is a restricted tag.  You may not edit it or add it to other App Components',
    mpErrorTitle: 'Marketplace Error',
    mpErrorMsg: 'There has been an error accessing Marketplace. Please contact your System Administrator to verify that Marketplace connectivity has been correctly configured and that the Marketplace server is currently running.',
    oneSingleton: 'Only one instance of a Singleton is permitted',
    stackNotFound: 'Unable to find the selected App.'
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
    addWidget: 'Add App Component',
    editWidget: 'Edit App Component',
    removed_colon: 'Removed:',
    retained_colon: 'Retained:',
    applied_colon: 'Applied:',
    updated_successfully: 'updated successfully',
    added_for: 'added for',
    formInvalid_CheckFieldMessages: 'Form Invalid.<br />Check highlighted field messages (!).',
    formInvalid_SelectOneUser: 'Form Invalid.<br />You need to select at least 1 user.',
    formInvalid_SelectOneWidget: 'Form Invalid.<br />You need to select at least 1 widget.',
    view: 'Page',
    view_status: 'Page Status',
    view_dashboardNameField_label: 'Page name',
    view_dashboardNameField_blankText: 'Please supply a Page Name',
    view_dashboardStateField_label: 'Configuration',
    view_dashboardStateField_blankText: 'Please supply a Page Configuration',
    view_dashboardGuidField_label: 'GUID',
    view_dashboardLayoutField_label: 'Layout',
    view_dashboardIsDefaultField_label: 'Default',
    formError_saveView: 'An error occurred while attempting to save a page.',
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
    widgetDefinition: 'App Component Definition',
    widgetDefinition_status: 'App Component Status',
    widgetDefinition_widgetAccess: 'App Component Access',
    widgetDefinition_descriptorUrlField_blankText: 'Please supply an App Component Descriptor URL',
    widgetDefinition_displayNameField_label: 'App Component Name',
    widgetDefinition_widgetVersionField_label: 'Version',
    widgetDefinition_displayNameField_blankText: 'Please supply an App Component Name',
    widgetDefinition_widgetVersionField_blankText: 'Please supply an App Component Version',
    widgetDefinition_widgetGuidField_label: 'GUID',
    widgetDefinition_widgetUrlField_label: 'URL',
    widgetDefinition_widgetUrlField_blankText: 'Please supply an App Component URL',
    widgetDefinition_imageUrlSmallField_label: 'Container Icon URL',
    widgetDefinition_imageUrlSmallField_blankText: 'Please supply a Container Icon URL',
    widgetDefinition_imageLargeUrlField_label: 'Launch Menu Icon URL',
    widgetDefinition_imageLargeUrlField_blankText: 'Please supply a Launch Menu Icon URL',
    widgetDefinition_widthNumberField_label: 'Width',
    widgetDefinition_widthNumberField_blankText: 'Please supply an App Component width',
    widgetDefinition_heightNumberField_label: 'Height',
    widgetDefinition_heightNumberField_blankText: 'Please supply an App Component height' ,
    widgetDefinition_secureUrl_warningText: 'Entering a secure HTTPS address may prevent browser security warnings such as "This page contains unsecure content."' ,
    personWidgetDef_Apply: 'Apply',
    personWidgetDef_Order: 'Order',
    personWidgetDef_Widget: 'App Component',
    personWidgetDef_WidgetAccessApplied: 'App Component Access Applied',
    personWidgetDef_ApplyStatus: 'Apply Status',
    personWidgetDef_NoChangesNecessary: 'No changes were necessary',
    formError_savePersonDefWidgets: 'An error occurred while attempting to save user App Component(s).',
    formError_saveWidgetDefinition: 'An error occurred while attempting to save the App Component.',
    personWidgetDef_WidgetContainerPanelTitle: 'Widgets',
    marketplaceWindow_AddWidget: 'An error occurred while attempting to add the App Component from the Store.',
    marketplaceWindow_currentUser: 'Could not retrieve current user name and id.',
    marketplaceWindow_AddSuccessful: 'The App Component was added successfully from the Store.',
    marketplaceWindow_WebappLaunchSuccessful: 'Web App has been started. To open it later, click My Apps, then click the Web App’s name.',
    marketplaceWindow_LaunchSuccessful: 'The App Component was added successfully from the Store. Choose the App where the component will open.',
    marketplaceWindow_StackLaunchSelectPage: 'The App has multiple pages. Please select one to open.',
    widgetAdded: 'Selected App Component is already added for this user',
    marketplaceWindow_RequiredListingsAlertMsg: 'The App Component you have launched will not work without some dependencies.  These App Components are listed below and will be additionally added to the launch menu.',
    fitPaneFullWarning: 'This pane can only contain one App Component.',
    dashboardLockTitle: 'Lock Page',
    dashboardLockWarning: 'Locking this Page disables the App Components toolbar button. Users cannot start or add new App Components to this layout. Do you still want to lock this Page?',
    dashboardLockAlertTitle: 'Locked Page',
    dashboardLockAlert: 'This Page is locked. App Components cannot be added or removed from a locked Page.',
    closeBackgroundWidgetWarning: ' is a background widget. You won’t see it on your screen because it runs behind the scenes.<br/><br/>To close the widget, click OK.',
    launchWidgetTitle: 'Launch Widget',
    launchWidgetAlert: 'Choose the dashboard where the widget will open.',
    refreshRequiredTitle: 'Refresh Required',
    refreshRequiredBody: "Refresh your browser to see changes you've made in the My Apps window."
};

Ozone.layout.ThemeSwitcherWindowConstants = {
    title: 'Theme Settings',
    header: 'Change the styling of your OWF',
    subheader: 'Select a theme below to change the background, window color, and style for OWF.',
    ok: 'OK',
    cancel: 'Cancel'
};
