package ozone.securitysample.cas;

import org.jasig.cas.client.proxy.ProxyGrantingTicketStorage;
import org.jasig.cas.client.validation.Cas20ServiceTicketValidator;

public class CasTicketValidatorFactoryImpl {
	
	private String casServiceUrl = "";
	private ProxyGrantingTicketStorage proxyGrantingTicketStorage = null;
	private String proxyCallbackUrl = "";
	
	
	public CasTicketValidatorFactoryImpl(){}
	
	
	public Cas20ServiceTicketValidator instantiateValidator()
	{
		Cas20ServiceTicketValidator toReturn = new Cas20ServiceTicketValidator(casServiceUrl);
		toReturn.setProxyGrantingTicketStorage(proxyGrantingTicketStorage);
		toReturn.setProxyCallbackUrl(proxyCallbackUrl);
		return toReturn;
	}


	public String getCasServiceUrl() {
		return casServiceUrl;
	}


	public void setCasServiceUrl(String casServiceUrl) {
		this.casServiceUrl = casServiceUrl;
	}


	public ProxyGrantingTicketStorage getProxyGrantingTicketStorage() {
		return proxyGrantingTicketStorage;
	}


	public void setProxyGrantingTicketStorage(
			ProxyGrantingTicketStorage proxyGrantingTicketStorage) {
		this.proxyGrantingTicketStorage = proxyGrantingTicketStorage;
	}


	public String getProxyCallbackUrl() {
		return proxyCallbackUrl;
	}


	public void setProxyCallbackUrl(String proxyCallbackUrl) {
		this.proxyCallbackUrl = proxyCallbackUrl;
	}
	
	
	
}
