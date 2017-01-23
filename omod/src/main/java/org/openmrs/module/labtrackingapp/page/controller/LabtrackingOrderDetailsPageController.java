package org.openmrs.module.labtrackingapp.page.controller;

import org.openmrs.Patient;
import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class LabtrackingOrderDetailsPageController {
	
	public Object controller(PageModel model, @RequestParam(value = "appId", required = false) AppDescriptor app,
	        @RequestParam(value = "dashboardUrl", required = false) String dashboardUrl,
	        @RequestParam(value = "search", required = false) String search,
			@RequestParam(value = "orderUuid", required = true) String orderUuid,
	        @RequestParam(value = "breadcrumbOverride", required = false) String breadcrumbOverride,
			@RequestParam(value = "patientId") Patient patient,
	        UiSessionContext uiSessionContext) {
		
		model.addAttribute("appId", app != null ? app.getId() : null);
		model.addAttribute("dashboardUrl", dashboardUrl);
		model.addAttribute("search", search);
		model.addAttribute("orderUuid", orderUuid);
		model.addAttribute("breadcrumbOverride", breadcrumbOverride);
		model.addAttribute("locale", uiSessionContext.getLocale());
		model.addAttribute("patient", patient);
		model.addAttribute("location", uiSessionContext.getSessionLocation());
		
		return null;
		
	}
}
