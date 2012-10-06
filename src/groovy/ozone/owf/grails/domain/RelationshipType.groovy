package ozone.owf.grails.domain

public enum RelationshipType
{
	owns	('owns'),
	requires ('requires'),
	instanceOf ('instanceOf'),
	cloneOf ('cloneOf')

	def strVal

	public RelationshipType(strVal)
	{
		this.strVal = strVal
	}

//    String toString() {
//      return this.strVal
//    }

	static list()
	{
		[owns,requires,instanceOf,cloneOf]
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