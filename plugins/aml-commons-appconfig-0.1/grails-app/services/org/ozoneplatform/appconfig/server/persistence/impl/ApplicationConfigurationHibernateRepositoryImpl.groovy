package org.ozoneplatform.appconfig.server.persistence.impl

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration
import org.ozoneplatform.appconfig.server.persistence.api.ApplicationConfigurationRepository
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository
import org.hibernate.criterion.Restrictions;
import org.hibernate.Criteria
import org.hibernate.criterion.Order

@Repository
class ApplicationConfigurationHibernateRepositoryImpl<T> implements ApplicationConfigurationRepository{

	@Autowired
	private SessionFactory sessionFactory
	
	@Override
	public ApplicationConfiguration save(ApplicationConfiguration object) {
        def session = this.sessionFactory.getCurrentSession()
		def retval = session.saveOrUpdate(object)
        object
	}

	@Override
	public ApplicationConfiguration get(Long id) {
		this.sessionFactory.getCurrentSession().load(ApplicationConfiguration.class, id)
	}

	@Override
	public ApplicationConfiguration findByCode(String value) {
		def crit = getCriteria().add(Restrictions.eq("code", value))
		crit.setCacheable(true)
		crit.setCacheRegion("query.org.ozoneplatform.appconfig.server.domain.model.ApplicationConfiguration.findByCode")
		crit.uniqueResult()
	}

	@Override
	public List<ApplicationConfiguration> findAll() {
		def crit = getCriteria()
		crit.addOrder(Order.asc("groupName"))
		crit.list()
	}

	@Override
	public List<ApplicationConfiguration> findAllByGroupName(String value) {
		def crit = getCriteria()
		crit.add(Restrictions.eq("groupName", value?.toUpperCase()))
		crit.addOrder(Order.asc("subGroupName"))
		crit.addOrder(Order.asc("subGroupOrder"))
		crit.list()
	}

	
	
	private Criteria getCriteria(){
		this.sessionFactory.getCurrentSession().createCriteria(ApplicationConfiguration.class)
	}
	
}
