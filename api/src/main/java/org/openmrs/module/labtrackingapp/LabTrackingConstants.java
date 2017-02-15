package org.openmrs.module.labtrackingapp;

public class LabTrackingConstants {
	//public static final String LAB_TRACKING_ORDER_ENCOUNTER_TYPE_UUID = "b3a0e3ad-b80c-4f3f-9626-ace1ced7e2dd";
	public static final String LAB_TRACKING_TESTORDER_TYPE_UUID = "52a447d3-a64a-11e3-9aeb-50e549534c5e";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_ACCESSION_NUMBER_UUID = "57f4473c-4420-4dd8-9e56-5cac985d1fa1";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_ORDER_NUMBER_UUID = "393dec41-2fb5-428f-acfa-36ea85da6666";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_RESULTS_DATE_UUID = "68d6bd27-37ff-4d7a-87a0-f5e0f9c8dcc0";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_NOTES_UUID = "65a4cc8e-c27a-42d5-b9bf-e13674970d2a";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_FILE_UUID = "4cad2286-f66e-44c3-ba17-9665b569c13d";
	public static final String LAB_TRACKING_PROCEDURE_UUID = "d6d585b6-4887-4aac-8361-424c17b030f2";
	public static final String LAB_TRACKING_PROCEDURE_NONCODED_UUID = "823242df-e317-4426-9bd6-548146546b15";
	
	/* used to tell what kind of order to return via the web services*/
	public enum LabTrackingOrderStatus{
		ALL(0),
		REQUESTED(1),
		SAMPLED(2),
		RESULTS(3),
		CANCELED(4);
		private int id;
		LabTrackingOrderStatus(int id){
			this.id = id;
		}

		public int getId(){return this.id;};
	}
}
