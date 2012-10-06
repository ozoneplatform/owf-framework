package ozone.owf.dashboard

import groovy.json.JsonSlurper
import groovy.sql.GroovyRowResult;

import java.sql.Date;
import java.sql.Timestamp;

class Dashboard {
		
	BigInteger	id,
				version,
				userId,
				createdById,
				editedById;
				
	Boolean 	isDefault,
				alteredByAdmin;
			
	Integer 	position,
				columnCount;
	
	String		guid,
				layout,
				name,
				showLaunchMenu,
				description;
	
	def 		defaultSettings,
				owf5Widgets;
				
	/* OWF 6 */
	def			layoutConfig,
				panes,
				layoutContainers, // hbox or vbox
				owf6Widgets;
	
	def			errors;
	
	Dashboard(dashboard, widgets) {
		this.id = dashboard.id;
		this.version = dashboard.version;
		this.isDefault = dashboard.isdefault;
		this.position = dashboard.dashboard_position;
		this.alteredByAdmin = dashboard.altered_by_admin;
		this.guid = dashboard.guid;
		this.columnCount = dashboard.column_count;
		this.layout = dashboard.layout;
		this.name = dashboard.name;
		this.userId = dashboard.user_id;
		this.description = dashboard.description;
		this.createdById = dashboard.created_by_id;
		this.editedById = dashboard.edited_by_id;
		this.defaultSettings = dashboard.default_settings; // String
		this.showLaunchMenu = dashboard.show_launch_menu;
		
		this.owf5Widgets = widgets;
		
		this.panes = [];
		this.owf6Widgets = [];
		this.errors = [];
		this.layoutContainers = [];
	}
	
	void setLayoutConfig(layoutConfig) {
		if(layoutConfig == null) {
			this.errors << "layoutConfig is invalid"
		}
		else {
			this.layoutConfig = new JsonSlurper().parseText(layoutConfig);
			this.buildPanes(this.layoutConfig);
		}
	}
	
	/**
	 * Initializes panes and widgets list from layoutConfig
	 * @param obj
	 */
	def buildPanes(obj) {
		
		obj = obj ?: this.layoutConfig;
		
		if(!obj) {
			return;
		}
		
		if(obj.items?.size() == 0) {
			// println obj
			this.panes << obj;
			this.owf6Widgets.addAll(obj.widgets)
		}
		else {
			this.layoutContainers << obj;
			obj.items?.each() { pane ->
				this.buildPanes(pane);
			};
		}
	}
	
	def validate() {
		if(this.layoutConfig == null) 
			return;
		this.validateNoOfWidgets();
		this.validateWidgetStates();
		this.validatePanes();
		this.validateContainers();
	}
	
	def validateNoOfWidgets() {
		// validate number of widgets expected
		if(this.owf5Widgets.size() != this.owf6Widgets.size()) {
			this.errors << "Number of widgets do not match. Widgets expected: ${this.owf5Widgets.size()}. Widgets found: ${this.owf6Widgets.size()} "
		}
	}
	
	def validateWidgetStates() {
		// compare widget states
		this.owf5Widgets.each() { owf5Widget ->
			def owf6Widget = this.owf6Widgets.find {
				it.uniqueId == owf5Widget.unique_id
			}
			
			if(owf6Widget) {
				this.compareWidgets(owf5Widget, owf6Widget);
			}
			else {
				this.errors << "Widget with an unique id of ${owf5Widget.unique_id} isn't found."
			}
		}
	}
	
	def validatePanes() {}
	def validatePane(pane) {}
	def validateContainer(container) {}
	
	def validateContainers() {
		def total = this.layoutContainers.size();
		def expectedValue;
		
		this.layoutContainers.eachWithIndex() { container, index ->
			if(index == 0) {
				expectedValue = 3;
			}
			else if(index == 1) {
				expectedValue = 0.67;
			}
			
			if(container.xtype == "container") {
				
				if(expectedValue != container.flex) {
					this.errors << "flex value for a container do not match. Value expected: '${expectedValue}'. Value found: '${container.xtype}'"
				}
				
				if(!container.layout) {
					this.errors << "layout value for a container must be set."
				}
				else {
					if(!['hbox', 'vbox'].contains(container.layout.type)) {
						this.errors << "layout.type value for a container must be either 'hbox' or 'vbox'. Value found '${container.layout.type}'."
					}
					if(container.layout.align != 'stretch') {
						this.errors << "layout.align value for a container must be either 'stretch'. Value found '${container.layout.align}'."
					}
				}
				
			}
			else if(container.xtype == "dashboardsplitter") {
				// no tests required
			}
			else {
				this.errors << "xtype value don't match. Value expected: 'container' or 'dashboardsplitter'. Value found: '${container.xtype}'. "
			}
		}
	}
	
	/**
	 * Compares OWF 5 widget with OWF 6.
	 * @param owf5Widget
	 * @param owf6Widget
	 * @return an array of errors if any found in the comparison 
	 */
	def compareWidgets(owf5Widget, owf6Widget) {
		owf5Widget.each() { key, value ->
			
			// done for oracle
			key = key.toLowerCase()
			def owf6Key = key.toCamelCase();
			
			
			if(value instanceof BigDecimal) {
				value = value as Integer
			}
			
			if(['button_opened', 'minimized', 'pinned', 'collapsed', 'maximized', 'active'].contains(key)) {
				value = value as Boolean;
			}
			
			if(key != "button_id" && value != owf6Widget[owf6Key]) {
				this.errors << "Value for property '${key}' of widget with 'unique_id' of '${owf5Widget['unique_id']}' do not match. Expected value '${value}'. Value found '${owf6Widget[owf6Key]}'."
			}
			
		}
	}
	
	String toString() {
		
		def map = [:];
		
		this.metaClass.properties.each() {
			if(it.name != 'class')
				map[it.name] = this[it.name]
		}
		
		return map.toString();
	}
}
