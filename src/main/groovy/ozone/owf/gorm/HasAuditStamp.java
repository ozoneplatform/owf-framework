package ozone.owf.gorm;

import ozone.owf.grails.domain.Person;

import java.util.Date;


public interface HasAuditStamp {

    Person getCreatedBy();

    void setCreatedBy(Person person);

    Date getCreatedDate();

    void setCreatedDate(Date date);

    Person getEditedBy();

    void setEditedBy(Person person);

    Date getEditedDate();

    void setEditedDate(Date date);

}
