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
	 * gets the all oders for a patient at a location, if no patient provided, then get for all
	 * @param hoursBack - how many hours back to look
	 * @param locationUUid - (optional) the location UUID for the encounters
	 * @param patientUuid - (optional) the patient UUID for the encounters
	 */
	public List<Order> getActiveOrders(int hoursBack, String locationUuid, String patientUuid);

	/* gets the specimen details encounter associated with the Test order
	* @param orderNumber - the Order orderNumber
	* the Encounter
	* */
	public Encounter getSpecimenDetailsEncounter(String orderNumber);


	/* updates the urgency field for a order
	* @param orderUuid - the order to udpate
	* @return true/false depending on whether something was updated*
	* @param urgent - whether to flag the order as urgent or not
	* */
	public boolean updateOrderUrgency(String orderUuid, boolean urgent);


	/* cancels an order
	* @param orderUuid - the order to udpate
	* @return true/false depending on whether something was updated
	* */
	public boolean cancelOrder(String orderUuid, String reasons);


}
