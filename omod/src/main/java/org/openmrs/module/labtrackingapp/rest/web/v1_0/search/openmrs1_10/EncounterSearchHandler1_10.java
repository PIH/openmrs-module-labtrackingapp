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

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class EncounterSearchHandler1_10 implements SearchHandler {
	
	private static final String REQUEST_PARAM_ORDER_NUMBER = "orderNumber";
	
	private final SearchQuery searchQuery = new SearchQuery.Builder("Gets the specimen details associated with an encounter")
	        .withRequiredParameters(REQUEST_PARAM_ORDER_NUMBER).build();
	
	private final SearchConfig searchConfig = new SearchConfig("getSpecimenDetailsEncounter", RestConstants.VERSION_1 + "/encounter",
	        Arrays.asList("1.10.*", "1.11.*", "1.12.*", "2.0.*"), searchQuery);
	
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
		String orderNumber = context.getParameter(REQUEST_PARAM_ORDER_NUMBER);
		Encounter encounter = Context.getService(LabTrackingAppService.class).getSpecimenDetailsEncounter(orderNumber);

		//TODO:  how do you just return one in search, for now wrap in a list
		return new NeedsPaging<Encounter>(Collections.singletonList(encounter), context);
	}
	
}
