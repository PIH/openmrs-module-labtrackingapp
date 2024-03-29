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
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Property;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.Subqueries;
import org.openmrs.Encounter;
import org.openmrs.Obs;
import org.openmrs.Order;
import org.openmrs.OrderType;
import org.openmrs.api.db.hibernate.DbSessionFactory;
import org.openmrs.module.labtrackingapp.LabTrackingConstants;
import org.openmrs.util.OpenmrsUtil;

import java.util.Calendar;
import java.util.List;

/**
 * It is a default implementation of {@link HibernateLabTrackingAppDAO}.
 */
public class HibernateLabTrackingAppDAO implements org.openmrs.module.labtrackingapp.api.db.LabTrackingAppDAO {

    private final Log log = LogFactory.getLog(this.getClass());

    private DbSessionFactory sessionFactory;
    
    /**
     * @param sessionFactory the sessionFactory to set
     */
    public void setSessionFactory(DbSessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    /**
     * @return the sessionFactory
     */
    public DbSessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public List<Order> getOrdersByDate(
            long startDate,
            long endDate,
            String patientUuid,
            String patientName,
            int status,
            List<OrderType> orderTypes,
            int maxResults) {

        Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Order.class);


        Calendar calendar = Calendar.getInstance();
        if(startDate > 0){
            calendar.setTimeInMillis(startDate);
            criteria.add(Restrictions.ge("dateActivated", OpenmrsUtil.firstSecondOfDay(calendar.getTime())));
        }
        if(endDate > 0){
            calendar.setTimeInMillis(endDate);
            criteria.add(Restrictions.le("dateActivated", OpenmrsUtil.getLastMomentOfDay(calendar.getTime())));
        }
        if(LabTrackingConstants.LabTrackingOrderStatus.CANCELED.getId() == status){
            criteria.add(Restrictions.eq("voided", true));
        } else {
            criteria.add(Restrictions.eq("voided", false));
        }

        if (orderTypes != null && !orderTypes.isEmpty()) {
            criteria.add(Restrictions.in("orderType", orderTypes));
        }

        criteria.addOrder(org.hibernate.criterion.Order.desc("dateActivated"));

        if(maxResults>0) {
            criteria.setMaxResults(maxResults);
        }

        return criteria.list();
    }

    /*
    * gets all  encounters at a current location for a patient
    * */
    public List<Order> getActiveOrders(long startDate, long endDate, String patientUuid, String patientName, int status, boolean suspectedCancer, boolean urgentReview, int maxResults){

        Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Order.class, "ord");
        criteria.createAlias("encounter", "enc");
        criteria.createAlias("ord.patient", "pat");
        criteria.createAlias("ord.orderType", "orderType");

        criteria.add(Restrictions.eq("orderType.uuid", LabTrackingConstants.LAB_TRACKING_PATHOLOGY_ORDER_TYPE_UUID));
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

            //find orders where
            //  an obs with the accession number
            // is part of an encounter that has an order number
            // that equals the order's order number

            criteria.add(
                    Restrictions.or(Subqueries.propertyIn("orderNumber", getAccessionNumberSubQuery(query)),
                    Restrictions.or(Restrictions.like("pids.identifier", query),
                        Restrictions.or(Restrictions.like("pname.givenName", query),
                            Restrictions.like("pname.familyName", query)))));
        }

        if ( suspectedCancer ) {
            DetachedCriteria suspectedCancerSamples = getSuspectedCancerSubQuery();
            criteria.add(Subqueries.propertyIn("orderNumber", suspectedCancerSamples));
        }

        if ( urgentReview ) {
            DetachedCriteria urgentReviewSamples = getUrgentReviewSubQuery();
            criteria.add(Subqueries.propertyIn("orderNumber", urgentReviewSamples));
        }

        if (LabTrackingConstants.LabTrackingOrderStatus.REQUESTED.getId() == status) {
            //this is all orders that have been requested but without a Processed Date
            DetachedCriteria processedSamples = getProcessedSamplesSubQuery();
            DetachedCriteria samples = getSamplesSubQuery().add(Subqueries.propertyNotIn("enc.id", processedSamples));

            criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY)
                    .add(Subqueries.propertyIn("orderNumber", samples));

        }
        else if (LabTrackingConstants.LabTrackingOrderStatus.PROCESSED.getId() == status) {
           // all orders that have a samples encounter and Procedure Date obs but  no results
            DetachedCriteria resultsObs = getResultsSubQuery();
            DetachedCriteria processedSamples = getProcessedSamplesSubQuery();

            DetachedCriteria samples = getSamplesSubQuery()
                    .add(Subqueries.propertyIn("enc.id", processedSamples))
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

        if(maxResults>0) {
            criteria.setMaxResults(maxResults);
        }

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

    private static DetachedCriteria getAccessionNumberSubQuery(String srch){
        //find orders where
        //  an obs with the accession number
        // is part of an encounter that has an order number
        // that equals the order's order number
        DetachedCriteria accessionNumbersEncounterUUIDs =  DetachedCriteria.forClass(Obs.class)
                .createAlias("concept", "conAcc")
                .createAlias("encounter", "encAcc")
                .setProjection(Property.forName("encAcc.id"))
                .add(Restrictions.eq("voided", false))
                .add(Restrictions.eq("conAcc.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_ACCESSION_NUMBER_UUID))
                .add(Restrictions.like("valueText",srch));
                //.add(Restrictions.in("enc.uuid"))
                //.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);

        DetachedCriteria samples = getSamplesSubQuery();
        samples.add(Subqueries.propertyIn("enc.id", accessionNumbersEncounterUUIDs));

        return samples;
    }

    private static DetachedCriteria getSuspectedCancerSubQuery(){
        //find orders where
        //  an obs with the SuspectedCancer = yes
        // is part of an encounter that has an order number
        // that equals the order's order number
        DetachedCriteria suspectedCancerEncIds =  DetachedCriteria.forClass(Obs.class)
                .createAlias("concept", "conCancer")
                .createAlias("encounter", "encCancer")
                .createAlias("valueCoded", "vcCancer")
                .setProjection(Property.forName("encCancer.id"))
                .add(Restrictions.eq("voided", false))
                .add(Restrictions.eq("conCancer.uuid", LabTrackingConstants.LAB_TRACKING_SUSPECTED_CANCER_UUID))
                .add(Restrictions.like("vcCancer.uuid",LabTrackingConstants.YES));

        DetachedCriteria samples = getSamplesSubQuery();
        samples.add(Subqueries.propertyIn("enc.id", suspectedCancerEncIds));

        return samples;
    }

    private static DetachedCriteria getUrgentReviewSubQuery(){
        //find orders where
        //  an obs with the UrgentReview = yes
        // is part of an encounter that has an order number
        // that equals the order's order number
        DetachedCriteria urgentReviewEncIds =  DetachedCriteria.forClass(Obs.class)
                .createAlias("concept", "conUrgent")
                .createAlias("encounter", "encUrgent")
                .createAlias("valueCoded", "vcUrgent")
                .setProjection(Property.forName("encUrgent.id"))
                .add(Restrictions.eq("voided", false))
                .add(Restrictions.eq("conUrgent.uuid", LabTrackingConstants.LAB_TRACKING_URGENT_REVIEW_UUID))
                .add(Restrictions.like("vcUrgent.uuid",LabTrackingConstants.YES));

        DetachedCriteria samples = getSamplesSubQuery();
        samples.add(Subqueries.propertyIn("enc.id", urgentReviewEncIds));

        return samples;
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
     * gets a subquery that returns a list of encounter ids for orders that have a processed date
     * */
    private static DetachedCriteria getProcessedSamplesSubQuery(){
        return DetachedCriteria.forClass(Obs.class)
                .createAlias("concept", "con")
                .createAlias("encounter", "enc")
                .setProjection(Property.forName("enc.id"))
                .add(Restrictions.eq("voided", false))
                .add(Restrictions.eq("con.uuid", LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_PROCESSED_DATE_UUID))
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
