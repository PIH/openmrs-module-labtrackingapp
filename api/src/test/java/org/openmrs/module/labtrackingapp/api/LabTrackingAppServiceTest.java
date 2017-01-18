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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.Test;
import org.openmrs.Encounter;
import org.openmrs.Order;
import org.openmrs.api.OrderService;
import org.openmrs.api.context.Context;
import org.openmrs.module.labtrackingapp.LabTrackingConstants;
import org.openmrs.test.BaseModuleContextSensitiveTest;
import org.openmrs.test.Verifies;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static junit.framework.Assert.assertEquals;
import static junit.framework.Assert.assertNotNull;
import static junit.framework.Assert.assertTrue;

/**
 * This is a unit test, which verifies logic in LabTrackingAppService. It doesn't extend
 * BaseModuleContextSensitiveTest, thus it is run without the in-memory DB and Spring context.
 */
public class LabTrackingAppServiceTest extends BaseModuleContextSensitiveTest {
	
	private static final Log log = LogFactory.getLog(LabTrackingAppServiceTest.class);
	
	@Test
	public void shouldSetupContext() {
		
		assertNotNull(Context.getService(LabTrackingAppService.class));
	}
	
	private LabTrackingAppService service;
	private OrderService orderService;

	private static final int TOTAL_ACTIVE_ORDERS = 3;
	private static final int TOTAL_SAMPLED_ORDERS = 2;
	private static final int TOTAL_REQUESTED_ORDERS = 1;
	private static final int TOTAL_RESULTS_ORDERS = 1;
	private static final String TEST_PATIENT = "b5f5ef61-c750-41fe-94cc-f5a9866dcaf5";
	private static final String TEST_ENCOUNTER_DATE = "2016-12-11 00:00:00.0";
	private static final String TEST_ORDER_NUMBER="ORD-999";
	private static final String TEST_ORDER_UUID="f4740b0b-206c-48a4-a5b7-111111111112";
	private static final String TEST_ORDER_UUID_TO_CANCEL="f4740b0b-206c-48a4-a5b7-111111111111";

	private static final SimpleDateFormat FMT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	
	@Before
	public void before() throws Exception {
		service = Context.getService(LabTrackingAppService.class);
		orderService = Context.getService(OrderService.class);
		executeDataSet("LabTrackingAppServiceTest-initialData.xml");
	}
	
	@Test
	@Verifies(value = "should get orders by date", method = "getActiveOrders()")
	public void getActiveOrders_shouldGetByDate() throws Exception {
		Date testDate = getTestEncounterDate();
		long startDate = testDate.getTime()-1000*60*60;
		long endDate = testDate.getTime()+1000*60*60;
		String patientUuid = null;
		String patientName = null;
		int status = 0;
		List<Order> list = service.getActiveOrders(startDate, endDate, patientUuid, patientName, status);
		assertEquals(TOTAL_ACTIVE_ORDERS, list.size());
	}

	@Test
	@Verifies(value = "should get orders by patient info", method = "getActiveOrders()")
	public void getActiveOrders_shouldGetByDateAndPatient() throws Exception {
		Date testDate = getTestEncounterDate();
		long startDate = testDate.getTime()-1000*60*60;
		long endDate = testDate.getTime()+1000*60*60;
		String patientUuid = TEST_PATIENT;
		String patientName = "milt";
		int status = LabTrackingConstants.LabTrackingOrderStatus.REQUESTED.getId();
		List<Order> list = service.getActiveOrders(startDate, endDate, patientUuid, patientName, status);
		assertEquals(TOTAL_REQUESTED_ORDERS, list.size());
	}

	@Test
	@Verifies(value = "should get orders by status with sample", method = "getActiveOrders()")
	public void getActiveOrders_shouldGetByDateWithSample() throws Exception {
		Date testDate = getTestEncounterDate();
		long startDate = testDate.getTime()-1000*60*60;
		long endDate = testDate.getTime()+1000*60*60;
		String patientUuid = TEST_PATIENT;
		String patientName = "milt";
		int status = LabTrackingConstants.LabTrackingOrderStatus.SAMPLED.getId();
		List<Order> list = service.getActiveOrders(startDate, endDate, patientUuid, patientName, status);
		assertEquals(TOTAL_SAMPLED_ORDERS, list.size());
	}

	@Test
	@Verifies(value = "should get orders by status with results", method = "getActiveOrders()")
	public void getActiveOrders_shouldGetByDateWithResults() throws Exception {
		Date testDate = getTestEncounterDate();
		long startDate = testDate.getTime()-1000*60*60;
		long endDate = testDate.getTime()+1000*60*60;
		String patientUuid = TEST_PATIENT;
		String patientName = "milt";
		int status = LabTrackingConstants.LabTrackingOrderStatus.RESULTS.getId();
		List<Order> list = service.getActiveOrders(startDate, endDate, patientUuid, patientName, status);
		assertEquals(TOTAL_RESULTS_ORDERS, list.size());
	}

	@Test
	@Verifies(value = "should get encounters by order number", method = "getSpecimenDetailsEncounter()")
	public void getSpecimenDetailsEncounter_shouldGetOne() throws Exception {
		List<Encounter> list = service.getSpecimenDetailsEncountersByOrderNumbers(new String[]{TEST_ORDER_NUMBER});
		assertTrue(list.size()>0);
	}


	@Test
	@Verifies(value = "should cancel order", method = "cancelOrder()")
	public void cancelOrder() throws Exception {
		boolean ok = service.cancelOrder(TEST_ORDER_UUID, "the quick brown fox jumps over the lazy dog");
		assertTrue(ok);

		Order order = orderService.getOrderByUuid(TEST_ORDER_UUID);
		assertTrue(order.isVoided());



	}


	/* gets the hours back for testing, b/c the test data date is static*/
	private static Date getTestEncounterDate() {
		try {
			return FMT.parse(TEST_ENCOUNTER_DATE);
		}
		catch (ParseException e) {
			//should never happen
		}
		
		return null;
	}



}
