/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 * <p>
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.labtrackingapp.api.impl;

import org.apache.commons.lang.StringUtils;
import org.openmrs.Encounter;
import org.openmrs.Obs;
import org.openmrs.Order;
import org.openmrs.OrderType;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.labtrackingapp.LabTrackingConstants;
import org.openmrs.module.labtrackingapp.api.LabTrackingAppService;
import org.openmrs.module.labtrackingapp.api.db.LabTrackingAppDAO;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class LabTrackingAppServiceImpl extends BaseOpenmrsService implements LabTrackingAppService {

    private LabTrackingAppDAO dao;

    public List<Order> getActiveOrders(long startDate, long endDate, String patientUuid, String patientName, int status,
                                       boolean suspectedCancer, boolean urgentReview, int maxResults){
        return dao.getActiveOrders(startDate, endDate, patientUuid, patientName, status, suspectedCancer, urgentReview, maxResults);
    }

    public List<Encounter> getSpecimenDetailsEncountersByOrderNumbers(String[] orderNumbers) {
        return dao.getSpecimenDetailsEncountersByOrderNumbers(orderNumbers);
    }

    public List<Encounter> getSpecimenDetailsEncountersByDate(long startDate, long endDate, String patientUuid, String patientName, int status, boolean suspectedCancer, boolean confirmedCancer, boolean urgentReview, int maxResults) {

        List<Encounter> encounters = null;
        List<OrderType> orderTypes = new ArrayList<OrderType>();
        orderTypes.add(Context.getOrderService().getOrderTypeByUuid(LabTrackingConstants.LAB_TRACKING_PATHOLOGY_ORDER_TYPE_UUID));

        List<Order> orders = dao.getOrdersByDate(startDate, endDate, patientUuid, patientName, status,  orderTypes, maxResults);
        if ( orders != null && orders.size() > 0 ) {
            encounters = new ArrayList<Encounter>();
            for (Order order : orders) {
                Encounter encounter = order.getEncounter();
                boolean includeEncounter = true;

                if ( StringUtils.isBlank(patientUuid)
                        && StringUtils.isBlank(patientName)
                        && (status == LabTrackingConstants.LabTrackingOrderStatus.ALL.getId() || status == LabTrackingConstants.LabTrackingOrderStatus.CANCELED.getId() )
                        && !suspectedCancer && !confirmedCancer && !urgentReview) {
                    // if the status is CANCELED the encounter was already filtered by the Order DAO method
                    encounters.add(encounter);
                    continue;
                }

                Obs processedObs = getFirstObsByConceptUuid(encounter, LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_PROCESSED_DATE_UUID);
                Boolean processed = processedObs != null && processedObs.getValueDatetime() != null;

                Obs resultDate = getFirstObsByConceptUuid(encounter, LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_RESULTS_DATE_UUID);
                Boolean hasResult = resultDate != null && resultDate.getValueDatetime() != null;

                if (LabTrackingConstants.LabTrackingOrderStatus.REQUESTED.getId() == status) {
                    if (processed || hasResult) {
                        includeEncounter = false;
                    }
                } else if (LabTrackingConstants.LabTrackingOrderStatus.PROCESSED.getId() == status) {
                    if (!processed || hasResult) {
                        includeEncounter = false;
                    }
                } else if (LabTrackingConstants.LabTrackingOrderStatus.RESULTS.getId() == status){
                    if (!hasResult) {
                        includeEncounter = false;
                    }
                }

                if (suspectedCancer) {
                    Obs suspectedCancerObs = getFirstObsByConceptUuid(encounter, LabTrackingConstants.LAB_TRACKING_SUSPECTED_CANCER_UUID);
                    if ( suspectedCancerObs == null ||
                            (suspectedCancerObs != null &&  !suspectedCancerObs.getValueCoded().getUuid().equalsIgnoreCase(LabTrackingConstants.YES))) {
                        includeEncounter = false;
                    }
                }
                if (confirmedCancer) {
                    Obs confirmedCancerObs = getFirstObsByConceptUuid(encounter, LabTrackingConstants.LAB_TRACKING_CONFIRMED_CANCER_UUID);
                    if ( confirmedCancerObs == null ||
                            (confirmedCancerObs != null &&  !confirmedCancerObs.getValueCoded().getUuid().equalsIgnoreCase(LabTrackingConstants.YES))) {
                        includeEncounter = false;
                    }
                }
                if (urgentReview) {
                    Obs urgentReviewObs = getFirstObsByConceptUuid(encounter, LabTrackingConstants.LAB_TRACKING_URGENT_REVIEW_UUID);
                    if ( urgentReviewObs == null ||
                            (urgentReviewObs != null &&  !urgentReviewObs.getValueCoded().getUuid().equalsIgnoreCase(LabTrackingConstants.YES))) {
                        includeEncounter = false;
                    }
                }
                if (StringUtils.isNotBlank(patientUuid)) {
                    if (order.getPatient().getUuid().compareTo(patientUuid) != 0) {
                        includeEncounter = false;
                    }
                }
                if (StringUtils.isNotBlank(patientName)) {
                    if ( !StringUtils.contains(order.getPatient().getFamilyName().toString(), patientName)
                            && !StringUtils.contains(order.getPatient().getGivenName().toString(), patientName)
                            && !StringUtils.contains(order.getPatient().getActiveIdentifiers().get(0).getIdentifier(), patientName)) {
                        includeEncounter = false;
                    }
                }
                if (includeEncounter) {
                    encounters.add(encounter);
                }
            }
        }

        return encounters;
    }

    public Map<String,  Map<String,Object>> getActiveOrderSummaryForPatient(String patientUuid, int maxResults){

        // we use a linked hash map so that we maintain the order of the orders when we convert them to a map
        Map<String, Map<String,Object>> map = new LinkedHashMap<String, Map<String, Object>>();

        List<Order> orders = getActiveOrders(0,0,patientUuid, null,
                LabTrackingConstants.LabTrackingOrderStatus.ALL.getId(), false, false, maxResults);

        if(orders.size()>0) {
            // iterate throught the orders and put them in a map
            for (int i = 0; i < orders.size(); ++i) {
                Order order = orders.get(i);
                // get any of the procedures that were performed
                Map<String, Object> orderMap = new HashMap<String, Object>();
                List<Obs> procedures = getObsListByConceptUUID(order.getEncounter(),
                        LabTrackingConstants.LAB_TRACKING_PROCEDURE_UUID);

                List<String> procs = new ArrayList<String>();
                for(Obs procedure: procedures){
                    procs.add(procedure.getValueCoded().getDisplayString());
                }

                Obs procNonCoded = getObsByConceptUUID(order.getEncounter(),
                        LabTrackingConstants.LAB_TRACKING_PROCEDURE_NONCODED_UUID);

                if(procNonCoded != null) {
                    procs.add(procNonCoded.getValueText());
                }
                orderMap.put("procedures", procs);
                orderMap.put("requestDate", order.getEncounter().getEncounterDatetime());
                orderMap.put("sampleDate", null);
                orderMap.put("resultDate", null);
                map.put(order.getOrderNumber(), orderMap);
            }

            // now check for any specimen or results info
            List<Encounter> encounters = getSpecimenDetailsEncountersByOrderNumbers(map.keySet().toArray(new String[orders.size()]));
            for(Encounter e : encounters){
                //get the order number obs
                Obs orderNumber = getObsByConceptUUID(e, LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_ORDER_NUMBER_UUID);
                if(orderNumber != null){
                    Map<String, Object> order = map.get(orderNumber.getValueText());
                    order.put("sampleDate", e.getEncounterDatetime());
                    Obs resultDate = getObsByConceptUUID(e, LabTrackingConstants.LAB_TRACKING_SPECIMEN_ENCOUNTER_RESULTS_DATE_UUID);
                    if (resultDate != null) {
                        order.put("resultDate", resultDate.getValueDatetime());
                    }
                }
            }
        }

        return map;
    }

    public LabTrackingAppDAO getDao() {
        return dao;
    }

    public void setDao(LabTrackingAppDAO dao) {
        this.dao = dao;
    }

    private static Obs getObsByConceptUUID(Encounter e, String conceptUUID){
        Obs ret = null;
        if(e != null && e.getObs() != null){
            for(Obs o: e.getObs()){
                if(o.getConcept().getUuid().equals(conceptUUID)){
                    return o;
                }
            }
        }
        return ret;
    }

    private static Obs getFirstObsByConceptUuid(Encounter encounter, String conceptUuid) {
        List<Obs> list = getObsListByConceptUUID(encounter, conceptUuid);
        if ( list != null && list.size() > 0) {
            return list.get(0);
        }
        return null;
    }
    private static List<Obs> getObsListByConceptUUID(Encounter e, String conceptUUID){
        List<Obs> ret = new ArrayList<Obs>();
        if(e != null && e.getObs() != null){
            for(Obs o: e.getObs()){
                if(o.getConcept().getUuid().equals(conceptUUID)){
                    ret.add(o);
                }
            }
        }
        return ret;
    }

}
