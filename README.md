## OpenMRS Lab Tracking Application

### Description
The Lab Tracking Application is a stand-alone Pathology application that can be used within the current EMR.  This app can be used to request tests that need to be performed on a patient and track the tests as the specimen is taken and then updated with results.  The test details are viewable both at a patient level and when monitoring the entire lab process.  

### Data Model

* Order
  * Ordering Encounter
    * Obs
      * Procedures that are ordered (coded and non-coded)
  * Order Number
  * Concept - Pathology Procedure Ordered
  * Other built-in order information (dates, instructions, care setting etc…)

* Specimen Encounter
  * Obs
    * Test Order Number (this is what links this specimen encounter to the order and ordering encounter)
    * Information from the clinician who performed the procedure  (specimen details, accession number, clinical history, suspected diagnosis, dates etc…)
    * Information about the results (date, result notes, uploaded file)
