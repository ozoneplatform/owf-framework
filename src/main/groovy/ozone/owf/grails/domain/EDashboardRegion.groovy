package ozone.owf.grails.domain

public enum EDashboardRegion{
	Accordion('accordion'),
	RightSideNorth('rightSideNorth'),
	RightSideCenter('rightSideCenter'),
	South('south'),
	Center('center'),
	None('none')
	
	def strVal
	
	public EDashboardRegion (strVal)
	{
		this.strVal = strVal
	}
	
	static list()
	{
		[Accordion,RightSideNorth,RightSideCenter,South,Center,None]
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