package ozone.owf.grails.domain

public enum ERoleAuthority {
	ROLE_USER("ROLE_USER"),
	ROLE_ADMIN("ROLE_ADMIN")
	
	def strVal
	
	public ERoleAuthority (strVal)
	{
		this.strVal = strVal
	}
	
	static list()
	{
		[ROLE_USER,ROLE_ADMIN]
	}
	
	static listAsStrings()
	{
		list().collect{it.strVal}
	}
	
	static getByStringValue(toCheck)
	{
		list().each{
			if (toCheck == it.strVal)
				return it
		}
		return null
	}
	
}