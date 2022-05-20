package org.openmrs.module.labtrackingapp.page.controller;

import org.joda.time.DateTime;
import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.emrapi.patient.PatientDomainWrapper;
import org.openmrs.ui.framework.annotation.InjectBeans;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.TimeZone;

public class LabtrackingAddOrderPageController {

    public Object controller(PageModel model, @RequestParam(value = "appId", required = false) AppDescriptor app,
                             @RequestParam(value = "returnUrl", required = false) String returnUrl,
                             @RequestParam(value = "visitId", required = false) Visit visit,
                             @RequestParam(value = "patientId") Patient patient,
                             @RequestParam(value = "orderUuid", required = false) String orderUuid,
                             @InjectBeans PatientDomainWrapper patientDomainWrapper,
                             UiSessionContext uiSessionContext) {

        model.addAttribute("appId", app != null ? app.getId() : null);
        model.addAttribute("returnUrl", returnUrl);
        model.addAttribute("locale", uiSessionContext.getLocale());
        model.addAttribute("location", uiSessionContext.getSessionLocation());
        model.addAttribute("patient", patient);
        model.addAttribute("visit", visit);
        String zonedVisitStartDateTime = null;
        String zonedVisitEndDateTime = null;
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ");
        sdf.setTimeZone(TimeZone.getDefault());
        Calendar calendar = Calendar.getInstance();
        if (visit != null && visit.getStartDatetime() != null) {
            calendar.setTime(visit.getStartDatetime());
            zonedVisitStartDateTime = sdf.format(calendar.getTime());
            if (visit.getStopDatetime() != null) {
                calendar.setTime(visit.getStopDatetime());
                zonedVisitEndDateTime = sdf.format(calendar.getTime());
            }
        }
        model.addAttribute("visitStartDateTime", zonedVisitStartDateTime);
        model.addAttribute("visitEndDateTime", zonedVisitEndDateTime);
        model.addAttribute("orderUuid", orderUuid);
        model.addAttribute("serverDatetime", new DateTime()); // just in case the server and client time are not in sync

        patientDomainWrapper.setPatient(patient);
        model.addAttribute("patientDomainWrapper", patientDomainWrapper);
        return null;

    }
}
