package org.ozoneplatform.auditing.util

class AuditingUtil {

	
	public static Long getSizeInBytes(Object object){
		if(!object instanceof Serializable)
			return Long.valueOf(0)
		ByteArrayOutputStream bos = new ByteArrayOutputStream()
		ObjectOutput out = null
		try {
		  out = new ObjectOutputStream(bos)
		  out.writeObject(object)
		  byte[] bytes = bos.toByteArray()
		  return bytes.length as Long
		} finally {
		  out.close()
		  bos.close()
		}
		return Long.valueOf(0)
	}
	

}
