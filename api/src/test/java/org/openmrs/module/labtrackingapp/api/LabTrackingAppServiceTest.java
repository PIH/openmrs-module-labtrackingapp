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


	private static final int TOTAL_ALL_ORDERS = 2;
	
	private static final int TOTAL_ACTIVE_ORDERS = 4;
	
	private static final String TEST_LOCATION = "11111111-0b6d-4481-b979-ccdd38c76cb4";
	private static final String TEST_PATIENT = "da7f524f-27ce-4bb2-86d6-6d1d05312bd5";
	private static final String TEST_ENCOUNTER_DATE = "2016-06-09 12:00:00.0";
	private static final String TEST_ORDER_NUMBER="ORD-999";
	private static final String TEST_ORDER_UUID="f4740b0b-206c-48a4-a5b7-8a9024cb75d9";

	private static final SimpleDateFormat FMT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	
	@Before
	public void before() throws Exception {
		service = Context.getService(LabTrackingAppService.class);
		orderService = Context.getService(OrderService.class);
		executeDataSet("LabTrackingAppServiceTest-initialData.xml");
	}
	
	@Test
	@Verifies(value = "should get active orders at location", method = "getActiveOrders()")
	public void getActiveOrders_shouldGetAll() throws Exception {
		List<Order> list = service.getActiveOrders(getHoursBack(), null, null);
		assertEquals(TOTAL_ACTIVE_ORDERS, list.size());
	}

	@Test
	@Verifies(value = "should get active orders at location", method = "getActiveOrders()")
	public void getSpecimenDetailsEncounter_shouldGetOne() throws Exception {
		Encounter enc = service.getSpecimenDetailsEncounter(TEST_ORDER_NUMBER);
		assertNotNull(enc);
	}

	@Test
	@Verifies(value = "should set order to urgent", method = "getActiveOrders()")
	public void updateOrderUrgency() throws Exception {
		boolean ok = service.updateOrderUrgency(TEST_ORDER_UUID, true);
		assertTrue(ok);


		//now get the order and see if it's urgency has changed
	//	Order order = orderService.getOrderByUuid(TEST_ORDER_UUID);
//		assertTrue(order.getUrgency() == Order.Urgency.STAT);
	}

	@Test
	@Verifies(value = "should cancel order", method = "getActiveOrders()")
	public void cancelOrderUrgency() throws Exception {
		boolean ok = service.cancelOrder(TEST_ORDER_UUID, "the quick brown fox jumps over the lazy dog");
		assertTrue(ok);

		Order order = orderService.getOrderByUuid(TEST_ORDER_UUID);
		assertTrue(order.isVoided());

	}


	/* gets the hours back for testing, b/c the test data date is static*/
	private static int getHoursBack() {
		int ret = 0;
		try {
			Date asOf = FMT.parse(TEST_ENCOUNTER_DATE);
			Date now = new Date();
			ret = (int) ((now.getTime() - asOf.getTime()) / (60 * 60 * 1000)) + 2;
		}
		catch (ParseException e) {
			//should never happen
		}
		
		return ret;
	}



}
