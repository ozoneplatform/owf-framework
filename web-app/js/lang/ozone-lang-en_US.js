Ext.namespace("Ozone.layout", "Ozone.ux", "Ozone.util");

if (Ozone.lang) {
    Ext.apply(Ozone.lang, {
         languageSetting : 'en_US'
    }); 
}

if (Ozone.layout.ConfigurationWindowString) {
	Ext.apply(Ozone.layout.ConfigurationWindowString, {
		setAsNew : "Save as new", 
        setAsDefault : "Set as default",
        showCarousel : "Show Launch Menu",
        showShortcuts : "Show Shortcuts",
        documentTitle : "Document Title",
		
		topSelector : 'Top', 
	    centerSelector : 'Center',
	    accordionSelector : 'Accordion', 
	    toolbarButtons : 'Toolbar Buttons', 
	    clear : 'Clear',
	    save : 'OK',
	    cancel : 'Cancel',
		
	    column : 'Column', 
	    columns : 'Columns',
		
	    tab : 'Tab', 
        tabs : 'Tabs'
	});
}

if (Ozone.layout.ToolbarString) {
    Ext.apply(Ozone.layout.ToolbarString, {
       configurationManager : 'Configuration Manager'
    });
}

if (Ozone.layout.DesktopWindowManagerString) {
    Ext.apply(Ozone.layout.DesktopWindowManagerString, {
	    configureDashboard : 'Configure Dashboard', 
	    toggleCarousel : 'Toggle Launch Menu',
	    welcomeMessage : 'Welcome'
    });
}

if (Ozone.ux.DashboardMgmtString) {
    Ext.apply(Ozone.ux.DashboardMgmtString, {
	    createDashboard : 'Create a Dashboard', 
	    selectDashboardDotDot : 'Select a dashboard...',
	    deleteDashboard : 'Delete a Dashboard', 
	    importaDashboard : 'Import a Dashboard',
	    exportDashboard : 'Export Current Dashboard', 
	    exportDashboardConfig : 'Export Dashboard Configuration', 
	    uploadConfig : 'Upload...', 
	    setAsDefault : 'Set as default', 
	    dashboards : 'Dashboards', 
	    selectDashboard : 'Select Dashboard', 
	    accordion : 'Accordion', 
	    portal : 'Portal', 
	    tabbed : 'Tabbed', 
	    desktop : 'Desktop', 
		
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
    });
    

	if (Ozone.ux.DashboardMgmt)
	{
		
	    Ext.apply(Ozone.ux.DashboardMgmt.prototype.checkbox, {
	        boxLabel : 'Set as default'
	    });

	    Ext.apply(Ozone.ux.DashboardMgmt.prototype.fileupload, {
	        emptyText :  'Upload a configuration...',
	        buttonText : 'Browse...' 
	    });
	}

}

if (Ozone.layout.AccordionWindowManagerString) {
    Ext.apply(Ozone.layout.AccordionWindowManagerString, {
        configureAccordion : 'Configure Accordion' 
    });
}

if (Ozone.layout.PortalWindowManagerString) {
    Ext.apply(Ozone.layout.PortalWindowManagerString,{
        configurePortlets : 'Configure Portlets'    
    });
}

if (Ozone.layout.TabbedWindowManagerString) {
    Ext.apply(Ozone.layout.TabbedWindowManagerString , {
        configureTabs : '<span class="configureTabButton">Configure Tabs</span>'   
    });
}

if (Ozone.util.ErrorMessageString) {
    Ext.apply(Ozone.util.ErrorMessageString , {
    	dashboardConfig : 'Dashboard Configuration',
    	widgetConfiguration : 'Widget Configuration', 
    	noWidgets : 'There are no widgets to which you have access.', 
    	configurationMsg : 'Failed to retrieve configuration data', 
    	invalidForm : 'Invalid Form',
    	invalidFormMsg : 'Form is invalid.  Please make sure all required fields are completed.',
    	languagePreference : 'Language Preference',
    	languagePreferenceMsg : 'Error saving language preference',
    	settingSessionDataMsg : 'Error setting session data',
    	retrievingSessionDataMsg : 'Error retrieving session data',
    	saveUserPreferences : 'Save User Preferences',
    	storeErrorMsg : 'Store Error Message',
    	sendAndForget : 'Send and Forget',
    	userName : 'User Name',
    	updateDashboardMsg : 'Error updating dashboard'
    });
}

if (Ozone.layout.ThemeSwitcherWindowConstants) {
    Ext.apply(Ozone.layout.ThemeSwitcherWindowConstants , {
        title: 'Theme Settings',
        header: 'Change the styling of your OWF',
        subheader: 'Select a theme below to change the background, window color, and style for OWF.',
        ok: 'OK',
        cancel: 'Cancel'
    });
}

