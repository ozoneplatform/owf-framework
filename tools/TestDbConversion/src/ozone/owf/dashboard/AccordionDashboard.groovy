package ozone.owf.dashboard

class AccordionDashboard extends Dashboard {
	
	def accordionWidgets,
		centerWidget,
		southWidget;
	
	AccordionDashboard (dashboard, widgets) {
		super(dashboard, widgets);
		
		this.accordionWidgets = this.owf5Widgets.findAll { it.region == 'accordion' };
		this.centerWidget = this.owf5Widgets.findAll { it.region == 'center' };
		this.southWidget = this.owf5Widgets.findAll { it.region == 'south' }
	}
	
	def validatePanes() {
		if(this.panes.size() <= 0 || this.panes.size() > 2) {
			this.errors << "Number of panes do not match. Panes expected: 1. Panes found: ${this.panes.size()} "
			return;
		}
		
		// validate left accordion pane
		def leftPane = this.panes[0];
		this.validatePane(leftPane);
		
		if(this.accordionWidgets.size() != leftPane.widgets.size()) {
			this.errors << "Number of widget in left accordion pane do not match. Widgets expected: ${this.accordionWidgets.size()}. Widgets found: '${leftPane.widgets.size()}'"
		}
		
		// validate right accordion pane
		def rightPane = this.panes[1];
		this.validatePane(rightPane);
		
		def otherWidgets = []
		
		if(this.centerWidget) {
			otherWidgets << this.centerWidget
		}
		if(this.southWidget) {
			otherWidgets << this.centerWidget
		}
		
		if(otherWidgets.size() != rightPane.widgets.size()) {
			this.errors << "Number of widget in left accordion pane do not match. Widgets expected: ${otherWidgets.size()}. Widgets found: '${rightPane.widgets.size()}'"
		}
	}
	
	def validatePane(pane) {
		def paneIndex = this.panes.indexOf(pane);
		def expectedValuesMap = [paneType: 'accordionpane', items: []];
		
		if(paneIndex == 0) {
			def size = this.accordionWidgets.size();
			def lastWidget = this.accordionWidgets[size == 0 ? 0 : size-1];
			if(lastWidget?.width) {
				expectedValuesMap['width'] = lastWidget.width;
				expectedValuesMap['htmlText'] = "${expectedValuesMap['width']}px";
				expectedValuesMap['cls'] = 'left';
				
			}
		}
		else if(paneIndex == 1) {
			expectedValuesMap['cls'] = 'right';
			expectedValuesMap['htmlText'] = 'Variable';
			
			if(this.southWidget && this.centerWidget) {
				if(!this.southWidget.collapsed)
					expectedValuesMap['height'] = this.southWidget.height;
			}
		}
		
		expectedValuesMap.each() { key, value ->
			if(pane[key] != value) {
				this.errors << "${key} value do not match for pane at index ${paneIndex}. Value expected: '${value}'. Value found: '${pane[key]}'"
			}
		}
	}
}
