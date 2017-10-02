package org.openmrs.module.labtrackingapp.page.controller;

import org.joda.time.DateTime;
import org.openmrs.Patient;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class LabtrackingOrderDetailsPageController {

    public Object controller(PageModel model, @RequestParam(value = "appId", required = false) AppDescriptor app,
                             @RequestParam(value = "returnUrl", required = false) String returnUrl,
                             @RequestParam(value = "pageType", required = false) String pageType,
                             @RequestParam(value = "orderUuid", required = true) String orderUuid,
                             @RequestParam(value = "patientId") Patient patient,
                             UiSessionContext uiSessionContext) {

        model.addAttribute("appId", app != null ? app.getId() : null);
        model.addAttribute("returnUrl", returnUrl);
        model.addAttribute("orderUuid", orderUuid);
        model.addAttribute("locale", uiSessionContext.getLocale());
        model.addAttribute("patient", patient);
        model.addAttribute("pageType", pageType);
        model.addAttribute("location", uiSessionContext.getSessionLocation());
        model.addAttribute("serverDatetime", new DateTime()); // just in case the server and client time are not in sync

        return null;

    }
}
