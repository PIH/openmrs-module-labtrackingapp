package org.openmrs.module.labtrackingapp.rest.web.v1_0.search.openmrs1_10;

import org.openmrs.Encounter;
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

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class TestOrderSearchHandler1_10 implements SearchHandler {
	
	private static final String REQUEST_PARAM_PATIENT = "patient";
	
	private static final String REQUEST_PARAM_LOCATION = "location";
	
	private final SearchQuery searchQuery = new SearchQuery.Builder("Gets active test orders in the system")
	        .withRequiredParameters(REQUEST_PARAM_PATIENT, REQUEST_PARAM_LOCATION).build();
	
	private final SearchConfig searchConfig = new SearchConfig("getActiveOrders", RestConstants.VERSION_1 + "/order",
	        Arrays.asList("1.10.*", "1.11.*", "1.12.*", "2.0.*"), searchQuery);
	
	/**
	 * @see SearchHandler#getSearchConfig()
	 */
	@Override
	public SearchConfig getSearchConfig() {
		return searchConfig;
	}
	
	/**
	 * @see SearchHandler#search(RequestContext)
	 */
	@Override
	public PageableResult search(RequestContext context) throws ResponseException {
		String patient = context.getParameter(REQUEST_PARAM_PATIENT);
		String location = context.getParameter(REQUEST_PARAM_LOCATION);
		List<Order> orders = Context.getService(LabTrackingAppService.class).getActiveOrders(24, location, patient);
		return new NeedsPaging<Order>(orders, context);
	}
	
}
