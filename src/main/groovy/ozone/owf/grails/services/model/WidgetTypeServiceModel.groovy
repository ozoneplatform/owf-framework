package ozone.owf.grails.services.model

class WidgetTypeServiceModel extends AbstractServiceModel {
	
	Long id
	String name
    String displayName

	Map toDataMap() {
        return [
			id: id,
			name: name,
            displayName: displayName
		]
	}

}