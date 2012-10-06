package ozone.owf.grails.services.model

class WidgetTypeServiceModel extends AbstractServiceModel {
	
	Long id
	String name

	Map toDataMap() {
		return [
			id: id,
			name: name
		]
	}

}