package org.ozoneplatform.auditing.enums

enum PayloadType {

	CHAT("CHAT"),
	DEVICE("DEVICE"),
	DOCUMENT("DOCUMENT"),
	FILE("FILE"),
	OBJECT("OBJECT"),
	PRINTER("PRINTER"),
	WEBPAGE("WEBPAGE"),
	ADMINISTRATOR("ADMINISTRATOR"),
	SYSTEM("SYSTEM"),
	USER("USER"),
	UNKNOWN("UNKNOWN")
	
	
	PayloadType(String description) {
		this.description = description;
	}
	
	private final String description
	

	public String getDescription() {
		return description
	}
	
	
}
