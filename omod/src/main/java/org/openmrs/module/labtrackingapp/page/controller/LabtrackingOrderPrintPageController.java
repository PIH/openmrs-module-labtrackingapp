package org.openmrs.module.labtrackingapp.page.controller;

import org.openmrs.Patient;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.emrapi.patient.PatientDomainWrapper;
import org.openmrs.ui.framework.annotation.InjectBeans;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class LabtrackingOrderPrintPageController {

    public Object controller(PageModel model, @RequestParam(value = "orderUuid", required = true) String orderUuid,
                             @RequestParam(value = "patientId") Patient patient,
                             @InjectBeans PatientDomainWrapper wrapper,
                             UiSessionContext uiSessionContext) {

        model.addAttribute("orderUuid", orderUuid);
        wrapper.setPatient((Patient) patient);
        model.addAttribute("patient", wrapper);
        
        return null;

    }
}
