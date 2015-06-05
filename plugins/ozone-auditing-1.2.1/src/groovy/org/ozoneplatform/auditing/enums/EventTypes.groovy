package org.ozoneplatform.auditing.enums

enum EventTypes {

	LOGON("LOGON"),
	LOGOFF("LOGOFF"),
	OBJ_CREATE("FILEOBJ_CREATE"),
	OBJ_ACCESS("FILEOBJ_ACCESS"),
	OBJ_DELETE("FILEOBJ_DELETE"),
	OBJ_MODIFY("FILEOBJ_MODIFY"),
	OBJ_SEARCH("FILEOBJ_SEARCH"),
	IMPORT("IMPORT"),
	EXPORT("EXPORT")
	
	EventTypes(String description) {
		this.description = description;
	}
	
	private final String description
	

	public String getDescription() {
		return description
	}

}
