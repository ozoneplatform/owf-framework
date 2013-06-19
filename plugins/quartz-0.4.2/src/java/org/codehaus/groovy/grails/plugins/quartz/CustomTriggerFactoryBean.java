package org.codehaus.groovy.grails.plugins.quartz;

import org.quartz.JobDetail;
import org.quartz.Trigger;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.PropertyAccessorFactory;

import java.util.Map;
import java.util.Date;
import java.text.ParseException;
import java.beans.PropertyEditorSupport;

/**
 * TODO: write javadoc
 *
 * @author Sergey Nebolsin (nebolsin@gmail.com)
 */
public class CustomTriggerFactoryBean implements FactoryBean, InitializingBean  {
  private Class<Trigger> triggerClass;
  private Trigger customTrigger;
  private JobDetail jobDetail;

  private Map triggerAttributes;

  public void afterPropertiesSet() throws ParseException {
      customTrigger = BeanUtils.instantiateClass(triggerClass);

      if(triggerAttributes.containsKey(GrailsTaskClassProperty.START_DELAY)) {
          Number startDelay = (Number) triggerAttributes.remove(GrailsTaskClassProperty.START_DELAY);
          customTrigger.setStartTime(new Date(System.currentTimeMillis() + startDelay.longValue()));
      }

      if (jobDetail != null) {
          customTrigger.setJobName(jobDetail.getName());
          customTrigger.setJobGroup(jobDetail.getGroup());
      }

      BeanWrapper customTriggerWrapper = PropertyAccessorFactory.forBeanPropertyAccess(customTrigger);
      customTriggerWrapper.registerCustomEditor(String.class, new StringEditor());
      customTriggerWrapper.setPropertyValues(triggerAttributes);
  }

  /**
   * {@inheritDoc}
   * @see org.springframework.beans.factory.FactoryBean#getObject()
   */
  public Object getObject() throws Exception {
      return customTrigger;
  }

  /**
   * {@inheritDoc}
   * @see org.springframework.beans.factory.FactoryBean#getObjectType()
   */
  public Class getObjectType() {
      return triggerClass;
  }

  /**
   * {@inheritDoc}
   * @see org.springframework.beans.factory.FactoryBean#isSingleton()
   */
  public boolean isSingleton() {
      return true;
  }

  public void setJobDetail(JobDetail jobDetail) {
      this.jobDetail = jobDetail;
  }

  public void setTriggerClass(Class<Trigger> triggerClass) {
    this.triggerClass = triggerClass;
  }

  public void setTriggerAttributes(Map triggerAttributes) {
    this.triggerAttributes = triggerAttributes;
  }
}

// We need this additional editor to support GString -> String convertion for trigger's properties.
class StringEditor extends PropertyEditorSupport {
    @Override
    public void setValue(Object value) {
        super.setValue(value == null ? null : value.toString());
    }

    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        setValue(text);
    }
}
