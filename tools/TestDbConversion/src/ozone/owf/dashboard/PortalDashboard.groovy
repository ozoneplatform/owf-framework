package ozone.owf.dashboard

class PortalDashboard extends Dashboard {
	
	PortalDashboard (dashboard, widgets) {
		super(dashboard, widgets);
		
		this.columnCount = 0;
		
		this.owf5Widgets.each() { widget ->
			if(widget.column_pos > this.columnCount) {
				this.columnCount = widget.column_pos;
			}	
		}
	}
	
	def validatePanes() {
		
		if(this.panes.size() <= 0 || this.panes.size() > 4) {
			this.errors << "Number of panes do not match. Panes expected: 1. Panes found: ${this.panes.size()}."
			return;
		}
		
		// validate no of widgets in each pane
		this.panes.eachWithIndex() { pane, index -> 
			def widgetsInColumn = this.owf5Widgets.findAll { it.column_pos == index };
			
			if(pane.widgets.size() != widgetsInColumn.size()) {
				this.errors << "Number of widgets in column ${index} do not match. Widgets expected: ${widgetsInColumn.size()}. Widgets found: ${pane.widgets.size()}."
			}
			
			this.validatePane(pane);
		}
		
	}
	
	def validatePane(pane) {
		def paneIndex = this.panes.indexOf(pane);
		def expectedValuesMap = [paneType: 'portalpane', items: []];
		
		if(this.columnCount == 0) {
			expectedValuesMap = [flex: 1, height: '100%'];
		}
		else if(this.columnCount == 1) {
			expectedValuesMap = [flex: 1, htmlText: '50%'];
			expectedValuesMap['cls'] = paneIndex == 0 ? 'left' : 'right'
		}
		else if(this.columnCount == 2) {
			
			if(paneIndex == 0) {
				expectedValuesMap = [cls: 'left', htmlText: '33%'];
			}
			else if(paneIndex == 1) {
				expectedValuesMap = [cls: 'left', htmlText: '50%', flex: 1];
			}
			else if(paneIndex == 2) {
				expectedValuesMap = [cls: 'right', htmlText: '50%', flex: 1];
			}
		}
		
		expectedValuesMap.each() { key, value ->
			if(pane[key] != value) {
				this.errors << "${key} value do not match for pane at index ${paneIndex}. Value expected: '${value}'. Value found: '${pane[key]}'"
			}
		}
	}
}
