package org.ozoneplatform.appconfig.server.persistence.api

import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration


interface ApplicationConfigurationRepository<T> {

	ApplicationConfiguration save(ApplicationConfiguration item)

	T get(Long id)

	T findByCode(String code)
		
	List<T> findAll()

	List<T> findAllByGroupName(String value)

}
