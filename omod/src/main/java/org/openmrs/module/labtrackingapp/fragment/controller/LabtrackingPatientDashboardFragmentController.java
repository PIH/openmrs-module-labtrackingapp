package org.openmrs.module.labtrackingapp.fragment.controller;

import org.openmrs.Patient;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.labtrackingapp.api.LabTrackingAppService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.fragment.FragmentModel;
import org.springframework.web.bind.annotation.RequestParam;

public class LabtrackingPatientDashboardFragmentController {

    private static final int MAX_ROWS_TO_SHOW = 5;

    public Object controller(FragmentModel model, @RequestParam(value = "appId", required = false) AppDescriptor app,
                             @RequestParam(value = "returnUrl", required = false) String returnUrl,
                             @RequestParam(value = "patientId", required = false) Patient patient,
                             @SpringBean("labtrackingapp.LabTrackingAppService") LabTrackingAppService labTrackingAppService,
                             UiSessionContext uiSessionContext) {

        model.addAttribute("appId", app != null ? app.getId() : null);
        model.addAttribute("returnUrl", returnUrl);
        model.addAttribute("locale", uiSessionContext.getLocale());
        model.addAttribute("location", uiSessionContext.getSessionLocation());
        model.addAttribute("patient", patient);
        model.addAttribute("orders", labTrackingAppService.getActiveOrderSummaryForPatient(patient.getUuid(), MAX_ROWS_TO_SHOW));

        return null;

    }
}
