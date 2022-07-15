/**
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
package org.openmrs.module.labtrackingapp.api;

import org.openmrs.Encounter;
import org.openmrs.Order;
import org.openmrs.api.OpenmrsService;

import java.util.List;
import java.util.Map;

/**
 * The main service of this module, which is exposed for other modules. See
 * moduleApplicationContext.xml on how it is wired up.
 */
public interface LabTrackingAppService extends OpenmrsService {

	/*
	 * gets all the Orders for a patient at a location, the location and or the patient are not provided
	 *  then the filter will not be applied
	 * @param startDate - (optional) the start date in millis since 1970, -1 if ignore
	 * @param endDate - (optional) the end date in millis since 1970, -1 if ignore
	 * @param patientUuid - (optional) the patient UUID for the orders
	 * @param patientName - (optional) the patient name to search for
	 * @param status - (optional) the status code to search for
	 * @suspectedCancer - (optional) indicating if the sample is suspected for cancer
	 * @confirmedCancer - (optional) indicating if the sample was confirmed for cancer
	 * @urgentReview - (optional) indicating if the sample needs urgent review
	 * @param maxResults - (optional) the max results to show, if 0 then all
	 */
	public List<Order> getActiveOrders(long startDate, long endDate, String patientUuid, String patientName, int status, boolean suspectedCancer, boolean urgentReview, int maxResults);

	/* gets the specimen details encounter associated with the Test order
	* @param orderNumber - an array of order numbers to look up
	* the Encounter
	* */
	public List<Encounter> getSpecimenDetailsEncountersByOrderNumbers(String[] orderNumbers);

	/**
	 * gets all the Pathology orders within a given timeframe
	 * @param startDate
	 * @param endDate
	 * @param patientUuid
	 * @param patientName
	 * @param status
	 * @param suspectedCancer
	 * @param confirmedCancer
	 * @param urgentReview
	 * @param maxResults
	 * @return
	 */
	public List<Encounter> getSpecimenDetailsEncountersByDate(long startDate, long endDate, String patientUuid, String patientName, int status, boolean suspectedCancer, boolean confirmedCancer, boolean urgentReview, int maxResults);

     /*
	 * gets a summary of the active orders for a patient
	 *  then the filter will not be applied
	 * @param patientUuid - (optional) the patient UUID for the orders
	 * @param maxResults - (optional) the max results to show, if 0 then all
	 */
	public Map<String, Map<String,Object>> getActiveOrderSummaryForPatient(String patientUuid, int maxResults);
}
