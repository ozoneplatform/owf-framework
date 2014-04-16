package ozone.owf.grails.services

import org.springframework.transaction.annotation.Transactional

import ozone.owf.grails.domain.Person

@Transactional(readOnly=true)
class PersonService {

    
    @Transactional(readOnly=false)
    public void save(Person person){
        person.save()        
    }
    
}
