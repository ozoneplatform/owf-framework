Ext.namespace("Ozone.layout", "Ozone.ux", "Ozone.util");

if (Ozone.lang) {
    Ext.apply(Ozone.lang, {
		 languageSetting : 'es'
	});	
}

if (Ozone.layout.ConfigurationWindowString) {
	Ext.apply(Ozone.layout.ConfigurationWindowString, {
		setAsNew : 'Excepto como nuevo', 
		setAsDefault : 'Excepto como defecto',
		showCarousel : 'Demuestre el carrusel', 
		showShortcuts : 'Demuestre los atajos', 
		documentTitle : 'T’tulo del documento',
		
     	topSelector : 'Tapa', 
	    centerSelector : 'Centro',
	    accordionSelector : 'Acordión', 
	    toolbarButtons : 'Botones de la herramientas',
		clear : 'Claro', 
		save : 'Excepto', 
		cancel : 'Cancelación',
		
		column : 'Columna',
		columns : 'Columnas', 
		tab : 'LengŸeta',
		tabs : 'LengŸetas'
	}); 
}



if (Ozone.layout.ToolbarString) {
	Ext.apply(Ozone.layout.ToolbarString, {
		configurationManager : 'Encargado de la configuración'
	});
}

if (Ozone.layout.DesktopWindowManagerString) {
	Ext.apply(Ozone.layout.DesktopWindowManagerString, {
		configureDashboard : 'Encargado de la configuración', 
		toggleCarousel : 'Configure el salpicadero',
	    welcomeMessage : 'Bienvenidos'
	});
}

if (Ozone.ux.DashboardMgmtString) {
	Ext.apply(Ozone.ux.DashboardMgmtString, {
	    createDashboard : 'Cree un salpicadero', 
	    selectDashboardDotDot : 'Seleccione un salpicadero...',
	    deleteDashboard : 'suprima un salpicadero', 
		importaDashboard : 'importe un salpicadero',
	    exportDashboard : 'exportación un salpicadero',
		exportDashboardConfig : 'exportación un salpicadero configuration', 
	    uploadConfig : 'Cargue una configuración ...', 
	    setAsDefault : 'fije como defecto ' ,
		dashboards : 'Salpicadero', 
		selectDashboard : 'Seleccione el Salpicadero', 
		accordion: 'Acordión', 
		portal : 'Porta', 
		tabbed : 'Tabulado', 
		desktop : 'Mesa',
		tooltipManageDashboards: 'Manajar los salpicaderos',
		tooltipCreateDashboard: 'Cree un salpicadero',
		
		ok : 'AUTORIZACIîN',
		reset : 'Reajuste',
		about: 'Sobre', 
	    logout: 'Término', 
		importDashboard : 'importe salpicadero', 
		dashboardTitle : 'T’tulo del salpicadero ',
		enterDashboardTitle : 'Incorpore el t’tulo del Salpicadero', 
		
		loadDefaultMsg : 'ÀConfiguración de defecto de la carga?',
		noDashboardSelectedMsg : 'No se seleccion— ninguna configuración. ÀUsted quiere cargar la configuración de defecto?',
		changeLanguage : 'Cambie la lengua',
		es : 'Español',
		en_US : 'Inglés',
		ko : 'Korean'

	});
	
	Ext.apply(Ozone.ux.DashboardMgmt.prototype.checkbox, {
		boxLabel : 'fije como defecto'
	});
	
	Ext.apply(Ozone.ux.DashboardMgmt.prototype.fileupload, {
        emptyText : 'Cargue una configuración ...',
        buttonText : 'Hojee'
    });
	
}

if (Ozone.layout.AccordionWindowManagerString) {
	Ext.apply(Ozone.layout.AccordionWindowManagerString, {
		configureAccordion : 'Configure el acordión'
	});
}

if (Ozone.layout.PortalWindowManagerString) {
	Ext.apply(Ozone.layout.PortalWindowManagerString,{
		configurePortlets: 'Configure el Portlets'    
	});
}

if (Ozone.layout.TabbedWindowManagerString) {
	Ext.apply(Ozone.layout.TabbedWindowManagerString , {
        configureTabs : 'Configure las lengŸetas'		
	});
}

if (Ozone.layout.ManageViewsWindowString) {
	Ext.apply(Ozone.layout.ManageViewsWindowString , {
		languages : 'La Lengua'		
	});
}

if (Ozone.util.ErrorMessageString) {
    Ext.apply(Ozone.util.ErrorMessageString , {
    	dashboardConfig : 'Configuración del Salpicadero',
    	widgetConfiguration : 'Configuración del Widget', 
    	noWidgets : 'There are no widgets to which you have access.', 
    	configurationMsg : 'Falló la operación de recuperar datos de configuración', 
    	invalidForm : 'El Formulario Inválido',
    	invalidFormMsg : 'El formulario es inválido.  Verifique que ha llenado todos los campos requeridos.',
    	languagePreference : 'Preferencia de la Lengua',
    	languagePreferenceMsg : 'Error que almacena preferencia de la lengua',
    	settingSessionDataMsg : 'Error que almacena datos de sesión',
    	retrievingSessionDataMsg : 'Error que recupera datos de sesión',
    	saveUserPreferences : 'Excepto preferencias de usuario',
    	storeErrorMsg : 'Almacene el mensaje de error',
    	sendAndForget : 'Envíe y Olvide',
    	userName : 'El nombre de usuario',
    	updateDashboardMsg : 'Error que almacena datos del Salpicadero'
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
