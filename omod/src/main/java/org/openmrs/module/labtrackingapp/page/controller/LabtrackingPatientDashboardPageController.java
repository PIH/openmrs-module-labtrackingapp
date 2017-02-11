package org.openmrs.module.labtrackingapp.page.controller;

import ca.uhn.hl7v2.model.v23.datatype.MA;
import org.apache.commons.collections.map.HashedMap;
import org.openmrs.Encounter;
import org.openmrs.Obs;
import org.openmrs.Order;
import org.openmrs.Patient;
import org.openmrs.api.PersonService;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.labtrackingapp.LabTrackingAppConfig;
import org.openmrs.module.labtrackingapp.LabTrackingConstants;
import org.openmrs.module.labtrackingapp.api.LabTrackingAppService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class LabtrackingPatientDashboardPageController {

    public Object controller(PageModel model, @RequestParam(value = "appId", required = false) AppDescriptor app,
                             @RequestParam(value = "returnUrl", required = false) String returnUrl,
                             @RequestParam(value = "patientId", required = false) Patient patient,
                             @SpringBean("labtrackingapp.LabTrackingAppService") LabTrackingAppService labTrackingAppService,
                             UiSessionContext uiSessionContext) {

        model.addAttribute("appId", app != null ? app.getId() : null);
        model.addAttribute("returnUrl", returnUrl);
        model.addAttribute("locale", uiSessionContext.getLocale());
        model.addAttribute("location", uiSessionContext.getSessionLocation());
        model.addAttribute("patient", patient);

        int MAX_ROWS_TO_SHOW=5; // this could be configurable later

        model.addAttribute("orders", labTrackingAppService.getActiveOrderSummaryForPatient(patient.getUuid(), MAX_ROWS_TO_SHOW));

        return null;

    }
}
