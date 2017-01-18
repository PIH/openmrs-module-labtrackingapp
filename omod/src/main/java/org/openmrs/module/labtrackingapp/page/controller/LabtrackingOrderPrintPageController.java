package org.openmrs.module.labtrackingapp.page.controller;

import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

public class LabtrackingOrderPrintPageController {
	
	public Object controller(PageModel model, @RequestParam(value = "orderUuid", required = true) String orderUuid, UiSessionContext uiSessionContext) {
		
		model.addAttribute("orderUuid", orderUuid);

		return null;
		
	}
}
