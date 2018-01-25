package org.openmrs.module.labtrackingapp.rest.web.v1_0.search.openmrs1_10;

import org.openmrs.Order;
import org.openmrs.api.context.Context;
import org.openmrs.module.labtrackingapp.api.LabTrackingAppService;
import org.openmrs.module.webservices.rest.web.RequestContext;
import org.openmrs.module.webservices.rest.web.RestConstants;
import org.openmrs.module.webservices.rest.web.resource.api.PageableResult;
import org.openmrs.module.webservices.rest.web.resource.api.SearchConfig;
import org.openmrs.module.webservices.rest.web.resource.api.SearchHandler;
import org.openmrs.module.webservices.rest.web.resource.api.SearchQuery;
import org.openmrs.module.webservices.rest.web.resource.impl.NeedsPaging;
import org.openmrs.module.webservices.rest.web.response.ResponseException;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class TestOrderSearchHandler1_10 implements SearchHandler {
	
	private static final String REQUEST_PARAM_PATIENT = "patient";
	private static final String REQUEST_PARAM_PATIENT_NAME = "name";
	private static final String REQUEST_PARAM_START_DATE = "startDateInMillis";
	private static final String REQUEST_PARAM_END_DATE = "endDateInMillis";
	private static final String REQUEST_PARAM_STATUS = "status";
	private static final String REQUEST_PARAM_TOTAL_COUNT = "totalCount";


	private final SearchQuery searchQuery = new SearchQuery.Builder("Gets active test orders in the system")
	        .withRequiredParameters(REQUEST_PARAM_PATIENT, REQUEST_PARAM_PATIENT_NAME,
					REQUEST_PARAM_START_DATE,REQUEST_PARAM_END_DATE,REQUEST_PARAM_STATUS, REQUEST_PARAM_TOTAL_COUNT).build();
	
	private final SearchConfig searchConfig = new SearchConfig("getActiveOrders", RestConstants.VERSION_1 + "/order",
	        Arrays.asList("1.10.*", "1.11.*", "1.12.*", "2.0.*", "2.1.*"), searchQuery);
	
	/**
	 * @see SearchHandler#getSearchConfig()
	 */
	//@Override
	public SearchConfig getSearchConfig() {
		return searchConfig;
	}
	
	/**
	 * @see SearchHandler#search(RequestContext)
	 */
	//@Override
	public PageableResult search(RequestContext context) throws ResponseException {
		String patientUuid = context.getParameter(REQUEST_PARAM_PATIENT);
		String patientName = context.getParameter(REQUEST_PARAM_PATIENT_NAME);
		int status = toInt(context.getParameter(REQUEST_PARAM_STATUS), 0);
		long startDate = toLong(context.getParameter(REQUEST_PARAM_START_DATE), 0);
		long endDate = toLong(context.getParameter(REQUEST_PARAM_END_DATE), 0);

		List<Order> orders = Context.getService(LabTrackingAppService.class).getActiveOrders(startDate, endDate, patientUuid, patientName, status,0);
		return new NeedsPaging<Order>(orders, context);
	}

	public int toInt(String v, int defaultVal){
		int ret = defaultVal;
		if(v == null){
			return ret;
		}
		try{
			ret = Integer.parseInt(v);
		}   catch(Exception e){
			//return default
		}
		return ret;
	}

	public long toLong(String v, long defaultVal){
		long ret = defaultVal;
		if(v == null){
			return ret;
		}
		try{
			ret = Long.parseLong(v);
		}   catch(Exception e){
			//return default
		}
		return ret;
	}

}
