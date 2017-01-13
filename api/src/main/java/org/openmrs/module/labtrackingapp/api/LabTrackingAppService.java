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
	 */	public List<Order> getActiveOrders(long startDate, long endDate, String patientUuid, String patientName, int status);

	/* gets the specimen details encounter associated with the Test order
	* @param orderNumber - the Order orderNumber
	* the Encounter
	* */
	public Encounter getSpecimenDetailsEncounter(String orderNumber);

	/* cancels an order
	* @param orderUuid - the order to udpate
	* @return true/false depending on whether something was updated
	* */
	public boolean cancelOrder(String orderUuid, String reasons);


}
