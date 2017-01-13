package org.openmrs.module.labtrackingapp;

public class LabTrackingConstants {
	public static final String LAB_TRACKING_ORDER_ENCOUNTER_TYPE_UUID = "b3a0e3ad-b80c-4f3f-9626-ace1ced7e2dd";
	public static final String LAB_TRACKING_TESTORDER_TYPE_UUID = "52a447d3-a64a-11e3-9aeb-50e549534c5e";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_ORDER_NUMBER_UUID = "393dec41-2fb5-428f-acfa-36ea85da6666";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_RESULTS_DATE_UUID = "68d6bd27-37ff-4d7a-87a0-f5e0f9c8dcc0";

	/* used to tell what kind of order to return via the web services*/
	public enum LabTrackingOrderStatus{
		REQUESTED(1),
		SAMPLED(2),
		RESULTS(3);
		private int id;
		LabTrackingOrderStatus(int id){
			this.id = id;
		}

		public int getId(){return this.id;};
	}
}
