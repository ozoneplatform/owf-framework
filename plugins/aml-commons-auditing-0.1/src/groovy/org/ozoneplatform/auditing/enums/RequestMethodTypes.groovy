package org.ozoneplatform.auditing.enums

enum RequestMethodTypes {
	
	USER_INITIATED("USER_INITIATED"),
	UNKNOWN("UNKNOWN")
	
	
	RequestMethodTypes(String description) {
		this.description = description;
	}
	
	private final String description
	

	public String getDescription() {
		return description
	}
}
