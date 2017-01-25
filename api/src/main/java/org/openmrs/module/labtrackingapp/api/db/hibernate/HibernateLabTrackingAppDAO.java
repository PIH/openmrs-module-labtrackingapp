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
import org.hibernate.criterion.*;

import org.openmrs.*;
import org.openmrs.Order;
import org.openmrs.api.db.OrderDAO;
import org.openmrs.api.db.hibernate.HibernatePersonDAO;
import org.openmrs.api.db.hibernate.PatientSearchCriteria;
import org.openmrs.module.labtrackingapp.LabTrackingConstants;

import java.util.Calendar;
import java.util.List;

/**
 * It is a default implementation of {@link HibernateLabTrackingAppDAO}.
 */
public class HibernateLabTrackingAppDAO implements org.openmrs.module.labtrackingapp.api.db.LabTrackingAppDAO {

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
    public List<Order> getActiveOrders(long startDate, long endDate, String patientUuid, String patientName, int status){

        Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Order.class, "ord");
        criteria.createAlias("encounter", "enc");
        criteria.createAlias("ord.patient", "pat");
        criteria.createAlias("ord.orderType", "orderType");

        criteria.add(Restrictions.eq("orderType.uuid", LabTrackingConstants.LAB_TRACKING_TESTORDER_TYPE_UUID));
        if(LabTrackingConstants.LabTrackingOrderStatus.CANCELED.getId() == status){
            criteria.add(Restrictions.eq("ord.voided", Boolean.TRUE));
        }
        else if(LabTrackingConstants.LabTrackingOrderStatus.ALL.getId() != status){
            criteria.add(Restrictions.eq("ord.voided", Boolean.FALSE));
        }
        else{
            //for all other all, just return all voided or not
        }
        

        if(startDate > 0){
            Calendar c = Calendar.getInstance();
            c.setTimeInMillis(startDate);
            criteria.add(Restrictions.ge("enc.encounterDatetime", c.getTime()));
        }

        if(endDate > 0){
            Calendar c = Calendar.getInstance();
            c.setTimeInMillis(endDate);
            criteria.add(Restrictions.le("enc.encounterDatetime", c.getTime()));
        }

        if (patientUuid != null && patientUuid.length() > 0) {
            criteria.add(Restrictions.eq("pat.uuid", patientUuid));
        }

        if (patientName != null && patientName.length() > 0) {
            criteria.createAlias("patient.names", "pname");
            criteria.add(Restrictions.or(Restrictions.like("pname.givenName", "%" + patientName + "%"),
                    Restrictions.like("pname.familyName", "%" + patientName + "%")));
        }

        if (LabTrackingConstants.LabTrackingOrderStatus.REQUESTED.getId() == status) {
            //this is all orders that have been requested but without any samples or results
            DetachedCriteria samples = DetachedCriteria.forClass(Obs.class)
                    .createAlias("concept", "con")
                    .createAlias("encounter", "enc")
                    .setProjection(Property.forName("valueText"))
                    .add(Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_ORDER_NUMBER_UUID));


            criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
                    .add(Subqueries.propertyNotIn("orderNumber", samples));
        }
        else if (LabTrackingConstants.LabTrackingOrderStatus.SAMPLED.getId() == status) {
           // all orders that have a samples encounter and no results
            DetachedCriteria resultsObs = DetachedCriteria.forClass(Obs.class)
                    .createAlias("concept", "con")
                    .createAlias("encounter", "enc")
                    .setProjection(Property.forName("enc.id"))
                    .add(Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_RESULTS_DATE_UUID));

            DetachedCriteria samples = DetachedCriteria.forClass(Obs.class)
                    .createAlias("concept", "con")
                    .createAlias("encounter", "enc")
                    .setProjection(Property.forName("valueText"))
                    .add(Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_ORDER_NUMBER_UUID))
                    .add(Subqueries.propertyNotIn("enc.id", resultsObs));


            criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
                    .add(Subqueries.propertyIn("orderNumber", samples));


        }  else if (LabTrackingConstants.LabTrackingOrderStatus.RESULTS.getId() == status){
            // all orders that have a results encounter
            DetachedCriteria resultsObs = DetachedCriteria.forClass(Obs.class)
                    .createAlias("concept", "con")
                    .createAlias("encounter", "enc")
                    .setProjection(Property.forName("enc.id"))
                    .add(Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_RESULTS_DATE_UUID));

            DetachedCriteria samples = DetachedCriteria.forClass(Obs.class)
                    .createAlias("concept", "con")
                    .createAlias("encounter", "enc")
                    .setProjection(Property.forName("valueText"))
                    .add(Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_ORDER_NUMBER_UUID))
                   // .setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
                    .add(Subqueries.propertyIn("enc.id", resultsObs));

            criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
                    .add(Subqueries.propertyIn("orderNumber", samples));
        }

        criteria.addOrder(org.hibernate.criterion.Order.desc("enc.encounterDatetime"));

        List<Order> orders = criteria.list();


        return orders;
    }

    public List<Encounter> getSpecimenDetailsEncountersByOrderNumbers(String[] orderNumbers) {

        Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Encounter.class, "enc");

        DetachedCriteria orderNumberObservation = DetachedCriteria.forClass(Obs.class)
                .createAlias("concept", "con")
                .createAlias("encounter", "enc")
                .setProjection(Property.forName("enc.id"))
                .add(Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_ORDER_NUMBER_UUID))
                .add(Restrictions.in("valueText", orderNumbers));

        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
                .add(Subqueries.propertyIn("id", orderNumberObservation));


        return criteria.list();
    }


    public boolean cancelOrder(String orderUuid) {
        boolean ret = false;
        Order o = getOrderByUuid(orderUuid);
        if (o != null) {
            o.setVoided(true);
            sessionFactory.getCurrentSession().update(o);
            ret = true;
        }
        return ret;
    }


    private Order getOrderByUuid(String orderUuid) {
        Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Order.class, "ord");
        criteria.add(Restrictions.eq("uuid", orderUuid));

        List<Order> list = criteria.list();
        if (list != null && list.size() > 0) {
            return list.get(0);
        }

        return null;
    }

    private void debug(List<Order> orders) {
        for (Order order : orders) {
            System.out.println(toOrderStr(order));
        }
    }

    private static String toOrderStr(Order order) {
        StringBuilder ss = new StringBuilder();

        ss.append(" uuid=").append(order.getUuid());
        ss.append(" instructions=").append(order.getInstructions());
        if (order.getOrderType() != null) {
            ss.append(" orderType=").append(order.getOrderType().getName());
        }

        //ss.append(" orderreason=").append(.getName());

        return ss.toString();
    }

}
