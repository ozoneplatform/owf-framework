package ozone.owf

import groovy.sql.GroovyRowResult;
import ozone.owf.dashboard.*;

class DashboardFactory {
	
	public static Dashboard create(dashboard, widgets) {
		switch(dashboard.layout) {
			case 'accordion':
				return new AccordionDashboard(dashboard, widgets);
			case 'desktop':
				return new DesktopDashboard(dashboard, widgets);
			case 'portal':
				return new PortalDashboard(dashboard, widgets);
			case 'tabbed':
				return new TabbedDashboard(dashboard, widgets);
			default:
				return new Dashboard(dashboard, widgets);
		}
	}
}
