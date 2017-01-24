package org.openmrs.module.labtrackingapp.page.controller;

import org.openmrs.Patient;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.ui.framework.page.PageModel;
import org.openmrs.ui.framework.page.Redirect;
import org.springframework.web.bind.annotation.RequestParam;

public class LabtrackingViewQueuePageController {

    public Object controller(PageModel model, @RequestParam(value = "appId", required = false) AppDescriptor app,
                             @RequestParam(value = "returnUrl", required = false) String returnUrl,
                             @RequestParam(value = "patientId", required = false) Patient patient,
                             UiSessionContext uiSessionContext) {

        model.addAttribute("appId", app != null ? app.getId() : null);
        model.addAttribute("returnUrl", returnUrl);
        model.addAttribute("locale", uiSessionContext.getLocale());
        model.addAttribute("location", uiSessionContext.getSessionLocation());
        model.addAttribute("patient", patient);

        return null;

    }
}
