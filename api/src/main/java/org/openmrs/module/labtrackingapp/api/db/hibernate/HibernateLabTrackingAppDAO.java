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
            criteria.createAlias("patient.identifiers", "pids");

            final String query = new StringBuilder().append("%").append(patientName).append("%").toString();

            criteria.add(Restrictions.or(Restrictions.like("pids.identifier", query),
                    Restrictions.or(Restrictions.like("pname.givenName", query),
                    Restrictions.like("pname.familyName", query))));
        }

        if (LabTrackingConstants.LabTrackingOrderStatus.REQUESTED.getId() == status) {
            //this is all orders that have been requested but without any samples or results
            DetachedCriteria samples = getSamplesSubQuery();
            criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
                    .add(Subqueries.propertyNotIn("orderNumber", samples));
        }
        else if (LabTrackingConstants.LabTrackingOrderStatus.SAMPLED.getId() == status) {
           // all orders that have a samples encounter and no results
            DetachedCriteria resultsObs = getResultsSubQuery();

            DetachedCriteria samples = getSamplesSubQuery()
                    .add(Subqueries.propertyNotIn("enc.id", resultsObs));

            criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
                    .add(Subqueries.propertyIn("orderNumber", samples));


        }  else if (LabTrackingConstants.LabTrackingOrderStatus.RESULTS.getId() == status){
            // all orders that have a results encounter
            DetachedCriteria resultsObs = getResultsSubQuery();
            DetachedCriteria samples = getSamplesSubQuery()
                    .add(Subqueries.propertyIn("enc.id", resultsObs));

            criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
                    .add(Subqueries.propertyIn("orderNumber", samples));
        } else if (LabTrackingConstants.LabTrackingOrderStatus.CANCELED.getId() == status){
            // all orders that have a results note or file and are canceled or just are canceled
            DetachedCriteria resultsWithFileOrNotes = getResultsWithFileOrNotesSubQuery();
            DetachedCriteria samplesWithNoNotesOrFile = getSamplesSubQuery()
                    .add(Subqueries.propertyNotIn("enc.id", resultsWithFileOrNotes));

            DetachedCriteria samples = getSamplesSubQuery();

            //we need to query for onces that don't have file/notes OR ones that don't have a sample at all
            criteria.add(Restrictions.or(
                            Subqueries.propertyIn("orderNumber", samplesWithNoNotesOrFile),
                            Subqueries.propertyNotIn("orderNumber", samples)));
        }
        else if (LabTrackingConstants.LabTrackingOrderStatus.ALL.getId() == status) {
            //for all we don't want to include canceled
            DetachedCriteria resultsWithFileOrNotes = getResultsWithFileOrNotesSubQuery();

            DetachedCriteria samplesWithNotesOrFile = getSamplesSubQuery()
                    .add(Subqueries.propertyIn("enc.id", resultsWithFileOrNotes));

            criteria.add(Restrictions.or(Restrictions.eq("ord.voided", Boolean.FALSE),
                                Restrictions.and(Restrictions.eq("ord.voided", Boolean.TRUE),
                                        Subqueries.propertyIn("orderNumber", samplesWithNotesOrFile))));


        }

        criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
        criteria.addOrder(org.hibernate.criterion.Order.desc("enc.encounterDatetime"));

        List<Order> orders = criteria.list();
//
//        if (LabTrackingConstants.LabTrackingOrderStatus.ALL.getId() == status) {
//            debug(orders);
//        }

        return orders;
    }

    /* gets a sub query that contains  all the sample observations and returns the encounter id
    * so that you can find any orders that have samples
    * */
    private static DetachedCriteria getSamplesSubQuery(){
        return DetachedCriteria.forClass(Obs.class)
                .createAlias("concept", "con")
                .createAlias("encounter", "enc")
                .setProjection(Property.forName("valueText"))
                .add(Restrictions.eq("voided", false))
                .add(Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_ORDER_NUMBER_UUID))
                .setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
    }

    /*
    * gets a sub query that returns a list of encounter ids for orders that have a results date
    * */
    private static DetachedCriteria getResultsSubQuery(){
        return DetachedCriteria.forClass(Obs.class)
                .createAlias("concept", "con")
                .createAlias("encounter", "enc")
                .setProjection(Property.forName("enc.id"))
                .add(Restrictions.eq("voided", false))
                .add(Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_RESULTS_DATE_UUID))
                .setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
    }

    /*
    * gets a sub query that returns a list of encounter ids for orders that have either a file or notes
    * */
    private static DetachedCriteria getResultsWithFileOrNotesSubQuery(){
        return DetachedCriteria.forClass(Obs.class)
                .createAlias("concept", "con")
                .createAlias("encounter", "enc")
                .setProjection(Property.forName("enc.id"))
                .add(Restrictions.eq("voided", false))
                .add(Restrictions.or(
                        Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_NOTES_UUID),
                        Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_FILE_UUID)));
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

    private String toOrderStr(Order order) {
        StringBuilder ss = new StringBuilder();
        ss.append("========================BEGIN ORDER INFO========================\n");
        ss.append(" id=").append(order.getId());
        ss.append(" uuid=").append(order.getUuid());
        ss.append(" is voided=").append(order.isVoided());
        ss.append("\n");
        ss.append(toEncounterStr(order.getEncounter()));

        List<Encounter> list = getSpecimenDetailsEncountersByOrderNumbers(new String[]{order.getOrderNumber()});
        ss.append("\n==============BEGIN SPECIMEN INFO ========================\n");
        if(list.size() == 0){
            ss.append("\nNo specimen encounter");
        }
        else{
            for (Encounter e : list) {

                ss.append(toEncounterStr(e));
            }
        }
        ss.append("\n==============END SPECIMEN INFO ========================\n");
        ss.append("\n========================END ORDER INFO========================");

        return ss.toString();
    }

    private String toEncounterStr(Encounter e){
        StringBuilder ss = new StringBuilder();
        ss.append("================BEGIN ENCOUNTER INFO========================\n");
        if(e == null){
            ss.append("NULL ENCOUNTER");
        }
        else if(e.getObs() == null || e.getObs().size() == 0){
            ss.append("NO OBS");
        }
        else{
            for(Obs o : e.getObs()){
                ss.append(" { obs_id=").append(o.getId());
                ss.append(" , obs_uuid=").append(o.getUuid());
                ss.append("  obs_uuid=").append(o.getValueText()).append("}");
            }
            ss.append("\n================END ENCOUNTER INFO========================");
        }
        return ss.toString();
    }
}
