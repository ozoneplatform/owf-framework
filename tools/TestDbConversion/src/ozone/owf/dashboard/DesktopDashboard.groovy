package ozone.owf.dashboard

class DesktopDashboard extends Dashboard {
	
	DesktopDashboard (dashboard, widgets) {
		super(dashboard, widgets);
	}
	
	def validatePanes() {
		if(this.panes.size() <= 0 || this.panes.size > 1) {
			this.errors << "Number of panes do not match. Panes expected: 1. Panes found: ${this.panes.size()} "
			return;
		}
		
		this.validatePane(this.panes[0]);
	}
	
	def validatePane(pane) {
		def expectedValuesMap = [flex: 1, height: '100%', paneType: 'desktoppane', items: []]
		
		expectedValuesMap.each() { key, value ->
			if(pane[key] != value) {
				this.errors << "${key} value do not match. Value expected: '${value}'. Value found: '${pane[key]}'"
			}
		}
	}
}
