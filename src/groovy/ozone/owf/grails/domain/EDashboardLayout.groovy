package ozone.owf.grails.domain

public enum EDashboardLayout
{
	Accordion	('accordion'),
	Desktop		('desktop'),
	Portal		('portal'),
	Tabbed		('tabbed')
	
	def strVal
	
	public EDashboardLayout (strVal)
	{
		this.strVal = strVal
	}
	
	static list()
	{
		[Accordion,Desktop,Portal,Tabbed]
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