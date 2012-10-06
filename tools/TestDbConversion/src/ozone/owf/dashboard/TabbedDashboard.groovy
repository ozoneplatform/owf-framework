package ozone.owf.dashboard

class TabbedDashboard extends Dashboard {
	
	TabbedDashboard (dashboard, widgets) {
		super(dashboard, widgets);
	}
	
	/**
	 * Compares OWF 5 widget with OWF 6.
	 * @param owf5Widget
	 * @param owf6Widget
	 * @return an array of errors if any found in the comparison
	 */
	def compareWidgets(owf5Widget, owf6Widget) {
		owf5Widget.each() { key, value ->
			
			key = key.toLowerCase()
			def owf6Key = key.toCamelCase();
			
			
			if(value instanceof BigDecimal) {
				value = value as Integer
			}
			
			if(['button_opened', 'minimized', 'pinned', 'collapsed', 'maximized', 'active'].contains(key)) {
				value = value as Boolean;
			}
			
			// ignore zIndex and button_id values as they aren't being used
			if(key != 'z_index' && key != "button_id" && key != 'x' && key != 'y' && value != owf6Widget[owf6Key]) {
				this.errors << "Value for property '${key}' of widget with 'unique_id' of '${owf5Widget['unique_id']}' do not match. Expected value '${value}'. Value found '${owf6Widget[owf6Key]}'."
			}
		}
	}
	
	def validatePanes() {
		if(this.panes.size() <= 0 || this.panes.size() > 1) {
			this.errors << "Number of panes do not match. Panes expected: 1. Panes found: ${this.panes.size()} "
			return;
		}
		def pane = this.panes[0];
		
		if(pane.widgets.size() != this.owf5Widgets.size()) {
			this.errors << "Number of widgets in column ${index} do not match. Widgets expected: ${this.owf5Widgets.size()}. Widgets found: ${pane.widgets.size()}."
		}
		
		this.validatePane(pane);
	}
	
	def validatePane(pane) {
		def expectedValuesMap = [flex: 1, height: '100%', paneType: 'tabbedpane', items: []]
		
		expectedValuesMap.each() { key, value ->
			if(pane[key] != value) {
				this.errors << "${key} value do not match for pane. Value expected: '${value}'. Value found: '${pane[key]}'"
			}
		}
	}
}
