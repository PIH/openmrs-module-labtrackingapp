package org.openmrs.module.labtrackingapp.page.controller;

import org.openmrs.module.appframework.domain.AppDescriptor;
import org.openmrs.module.appui.UiSessionContext;
import org.openmrs.module.labtrackingapp.api.LabTrackingAppService;
import org.openmrs.ui.framework.annotation.SpringBean;
import org.openmrs.ui.framework.page.PageModel;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

public class LabtrackingServicesPageController {

    public Object controller(PageModel model,
                             @SpringBean("labtrackingapp.LabTrackingAppService") LabTrackingAppService labTrackingAppService,
                             @RequestParam(value = "orderUuid", required = true) String orderUuid,
                             @RequestParam(value = "action", required = true) String action,
                             @RequestParam(value = "data", required = false) String data,
                             UiSessionContext uiSessionContext) {

        String msg = null;
        int status = 200;
        //LabTrackingAppService labTrackingAppService = null;       uiSessionContext.
        if(labTrackingAppService != null){
            if("make_urgent".equals(action)){
                labTrackingAppService.updateOrderUrgency(orderUuid, true);
            }
            else if("make_routine".equals(action)){
                labTrackingAppService.updateOrderUrgency(orderUuid, false);
            }
            else if("cancel".equals(action)){
                labTrackingAppService.cancelOrder(orderUuid, data);
            }
            else{
                msg = new StringBuilder().append("ERROR(unknown action) for action " ).append(action )
                        .append( " on order " ).append( orderUuid ).append ( " with data=" ).append( data).toString();
                status = 500;
            }
        }
        else{
            msg = "Failed to create the labTrackingAppService, probably a config issue";
            status = 500;
        }

        model.addAttribute("message", msg );
        model.addAttribute("status", status);
        model.addAttribute("data", "TBD");

        return null;

    }
}
