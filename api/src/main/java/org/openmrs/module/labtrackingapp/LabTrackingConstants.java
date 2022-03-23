package org.openmrs.module.labtrackingapp;

public class LabTrackingConstants {
	//public static final String LAB_TRACKING_ORDER_ENCOUNTER_TYPE_UUID = "b3a0e3ad-b80c-4f3f-9626-ace1ced7e2dd";
    // TODO this (and equivalent in LabTrackingOrderFactory) is hardcoded to the Pathology Lab Order Type defined in OrderTypeBundle in PIH Core;
	// TODO could be changed to GP if we want
	public static final String LAB_TRACKING_PATHOLOGY_ORDER_TYPE_UUID = "65c912c2-88cf-46c2-83ae-2b03b1f97d3a";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_ACCESSION_NUMBER_UUID = "162086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_ORDER_NUMBER_UUID = "393dec41-2fb5-428f-acfa-36ea85da6666";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_RESULTS_DATE_UUID = "68d6bd27-37ff-4d7a-87a0-f5e0f9c8dcc0";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_PROCESSED_DATE_UUID = "160715AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_NOTES_UUID = "65a4cc8e-c27a-42d5-b9bf-e13674970d2a";
	public static final String LAB_TRACKING_SPECIMEN_ENCOUNTER_FILE_UUID = "4cad2286-f66e-44c3-ba17-9665b569c13d";
	public static final String LAB_TRACKING_PROCEDURE_UUID = "d6d585b6-4887-4aac-8361-424c17b030f2";
	public static final String LAB_TRACKING_PROCEDURE_NONCODED_UUID = "823242df-e317-4426-9bd6-548146546b15";
	public static final String LAB_TRACKING_SUSPECTED_CANCER_UUID = "d0718b9e-31e3-4bc8-a8d3-cfc5cc1ae2cb";
	public static final String LAB_TRACKING_URGENT_REVIEW_UUID = "9e4b6acc-ab97-4ecd-a48c-b3d67e5ef778";
	public static final String YES = "3cd6f600-26fe-102b-80cb-0017a47871b2";
	public static final String NO = "3cd6f86c-26fe-102b-80cb-0017a47871b2";

	public static final String LAB_TRACKING_UPDATE_PRIVILEGE = "Task: labtracking.update";
	/* used to tell what kind of order to return via the web services*/
	public enum LabTrackingOrderStatus{
		ALL(0),
		REQUESTED(1),
		PROCESSED(2),
		RESULTS(3),
		CANCELED(4);
		private int id;
		LabTrackingOrderStatus(int id){
			this.id = id;
		}

		public int getId(){return this.id;};
	}
}
