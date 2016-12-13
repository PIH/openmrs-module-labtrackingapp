/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 * <p>
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 * <p>
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.labtrackingapp.api.db.hibernate;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import java.util.Calendar;
import java.util.List;

/**
 * It is a default implementation of {@link LabTrackingAppDAO}.
 */
public class LabTrackingAppDAO implements org.openmrs.module.labtrackingapp.api.db.LabTrackingAppDAO {
	
	private final Log log = LogFactory.getLog(this.getClass());
	
	private SessionFactory sessionFactory;
	
	/**
	 * @param sessionFactory the sessionFactory to set
	 */
	public void setSessionFactory(SessionFactory sessionFactory) {
		this.sessionFactory = sessionFactory;
	}
	
	/**
	 * @return the sessionFactory
	 */
	public SessionFactory getSessionFactory() {
		return sessionFactory;
	}
	
	/*
	* gets all  encounters at a current location for a patient
	* */
	public List<org.openmrs.Order> getActiveOrders(int hoursBack, String locationUuid, String patientUuid) {
		
		Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Order.class, "ord");
		
		Calendar now = Calendar.getInstance();
		//        now.add(Calendar.HOUR, hoursBack * -1);
		//        criteria.add(Restrictions.ge("enc.encounterDatetime", now.getTime()));
		//        criteria.add(Restrictions.eq("enc.voided", Boolean.FALSE));
		
		//        criteria.createAlias("enc.encounterType", "encType");
		//        criteria.add(Restrictions.eq("encType.uuid", EDTriageConstants.ED_TRIAGE_ENCOUNTER_TYPE_UUID));
		
		if (locationUuid != null && locationUuid.length() > 0) {
			criteria.createAlias("ord.location", "loc");
			criteria.add(Restrictions.eq("loc.uuid", locationUuid));
		}
		
		if (patientUuid != null && patientUuid.length() > 0) {
			criteria.createAlias("ord.patient", "pat");
			criteria.add(Restrictions.eq("pat.uuid", patientUuid));
		}
		
		//criteria.addOrder(Order.desc("enc.encounterDatetime"));
		
		return criteria.list();
	}
}
