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

import org.openmrs.Encounter;
import org.openmrs.Order;
import org.openmrs.api.OrderService;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.BaseOpenmrsService;
import org.openmrs.module.labtrackingapp.api.LabTrackingAppService;
import org.openmrs.module.labtrackingapp.api.db.LabTrackingAppDAO;

import java.util.ArrayList;
import java.util.List;

public class LabTrackingAppServiceImpl extends BaseOpenmrsService implements LabTrackingAppService {

    private LabTrackingAppDAO dao;

    public List<Order> getActiveOrders(int hoursBack, String locationUuid, String patientUuid) {
        return dao.getActiveOrders(hoursBack, locationUuid, patientUuid);
    }

    public Encounter getSpecimenDetailsEncounter(String orderNumber) {
        return dao.getSpecimenDetailsEncounter(orderNumber);
    }

    public boolean updateOrderUrgency(String orderUuid, boolean urgent) {
        return dao.updateOrderUrgency(orderUuid, urgent);
    }

    public boolean cancelOrder(String orderUuid, String reason) {
        boolean ret = false;

        OrderService orderService = Context.getOrderService();
        Order order = orderService.getOrderByUuid(orderUuid);
        if(order != null){
            orderService.voidOrder(order, reason);
            ret = true;
        }

        return ret;


    }

    public LabTrackingAppDAO getDao() {
        return dao;
    }

    public void setDao(LabTrackingAppDAO dao) {
        this.dao = dao;
    }

}
