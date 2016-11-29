angular.module("labTrackingDataService", [])
    .service('labTrackingDataService', ['$q', '$http', 'LabTrackingOrder',
        function ($q, $http, LabTrackingOrder) {
            var CONSTANTS = {
                URLS: {
                    FIND_PATIENT: "coreapps/findpatient/findPatient.page?app=edtriageapp.app.edTriage",
                    CONCEPTS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/concept",
                    ED_TRIAGE_FOR_ACTIVE_VISIT: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getEDTriageEncounterForActiveVisit&v=custom:(uuid,encounterDatetime,patient,obs)&patient=PATIENT_UUID&location=LOCATION_UUID",
                    ENCOUNTER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter/ENCOUNTER_UUID?v=custom:(uuid,encounterDatetime,patient,obs)",
                    VIEW_QUEUE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getActiveEdTriageEncounters&v=custom:(uuid,encounterDatetime,patient,obs)&location=LOCATION_UUID",
                    ENCOUNTER_SAVE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter",
                    OBSERVATION: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/obs",
                    PATIENT_DASHBOARD:"coreapps/clinicianfacing/patient.page?patientId=PATIENT_UUID&app=pih.app.clinicianDashboard",
                    ACTIVE_VISIT: "/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/emrapi/activevisit"
                },
                ED_TRIAGE_CONCEPT_UUIDS: ["123fa843-a734-40c9-910c-4fe7527427ef"] ,
                ED_TRIAGE_ENCOUNTER_TYPE: "74cef0a6-2801-11e6-b67b-9e71128cae77",
                CONSULTING_CLINICIAN_ENCOUNTER_ROLE: "4f10ad1a-ec49-48df-98c7-1391c6ac7f05"
            };


            /*
             saves an encounter for a patient
             * */

            this.saveOrder = function (labTrackingOrder) {

                var encounterProvider = {
                    provider: this.session.currentProvider ? this.session.currentProvider.uuid : "",
                    encounterRole: CONSTANTS.CONSULTING_CLINICIAN_ENCOUNTER_ROLE
                }

                var encounter = {
                    patient: edTriagePatient.patient.uuid,
                    encounterType: CONSTANTS.ED_TRIAGE_ENCOUNTER_TYPE,
                    location: edTriagePatient.location,
                    encounterProviders: this.session.currentProvider ? [ encounterProvider ] : [],
                    obs: []
                };

                var obsToDelete = [];

                //status related fields
                addObs(encounter.obs, obsToDelete, edTriageConcept.triageQueueStatus.uuid, edTriagePatient.triageQueueStatus);
                addObs(encounter.obs, obsToDelete, edTriageConcept.triageScore.uuid, {value:edTriagePatient.score.numericScore, uuid: edTriagePatient.existingNumericScoreObsUuid });
                addObs(encounter.obs, obsToDelete, edTriageConcept.triageColorCode.uuid, {value:edTriagePatient.score.colorCode, uuid: edTriagePatient.existingColorCodeObsUuid});

                //chief complaint
                addObs(encounter.obs, obsToDelete, edTriageConcept.chiefComplaint.uuid, edTriagePatient.chiefComplaint);

                //vitals ----
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.mobility.uuid, edTriagePatient.vitals.mobility);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.respiratoryRate.uuid, edTriagePatient.vitals.respiratoryRate);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.oxygenSaturation.uuid, edTriagePatient.vitals.oxygenSaturation);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.heartRate.uuid, edTriagePatient.vitals.heartRate);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.systolicBloodPressure.uuid, edTriagePatient.vitals.systolicBloodPressure);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.diastolicBloodPressure.uuid, edTriagePatient.vitals.diastolicBloodPressure);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.temperature.uuid, edTriagePatient.vitals.temperature);

                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.trauma.uuid, edTriagePatient.vitals.trauma);
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.weight.uuid, edTriagePatient.vitals.weight);

                //this one has a set of answers tha are just observations, so just set to yes
                addObs(encounter.obs, obsToDelete, edTriageConcept.vitals.consciousness.uuid, edTriagePatient.vitals.consciousness);

                // // symptoms  ----
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.neurological.uuid, edTriagePatient.symptoms.neurological);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.burn.uuid, edTriagePatient.symptoms.burn);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.diabetic.uuid, edTriagePatient.symptoms.diabetic);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.trauma.uuid, edTriagePatient.symptoms.trauma);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.digestive.uuid, edTriagePatient.symptoms.digestive);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.pregnancy.uuid, edTriagePatient.symptoms.pregnancy);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.respiratory.uuid, edTriagePatient.symptoms.respiratory);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.pain.uuid, edTriagePatient.symptoms.pain);
                addObs(encounter.obs, obsToDelete, edTriageConcept.symptoms.other.uuid, edTriagePatient.symptoms.other);

                // clinical impressions
                addObs(encounter.obs, obsToDelete, edTriageConcept.clinicalImpression.uuid, edTriagePatient.clinicalImpression);

                // labs
                addObs(encounter.obs, obsToDelete, edTriageConcept.labs.glucose.uuid, edTriagePatient.labs.glucose);
                addObs(encounter.obs, obsToDelete, edTriageConcept.labs.pregnancy_test.uuid, edTriagePatient.labs.pregnancy_test);

                // treatment
                addObs(encounter.obs, obsToDelete, edTriageConcept.treatment.oxygen.uuid, edTriagePatient.treatment.oxygen);
                addObs(encounter.obs, obsToDelete, edTriageConcept.treatment.paracetamol.uuid, edTriagePatient.treatment.paracetamol);
                addObs(encounter.obs, obsToDelete, edTriageConcept.treatment.paracetamolDose.uuid, edTriagePatient.treatment.paracetamolDose);

                return ensureActiveVisit(edTriagePatient)
                    .then(function () {
                        return saveEncounter(encounter, edTriagePatient.encounterUuid)
                    })
                    .then(function () {
                        return deleteObs(obsToDelete)
                    })
                    // TODO better error handling here?
                    .then(function () {
                            return {status: 200};
                        }
                        , function (error) {
                            return {status: 500, error: error};
                        });
            };


            function ensureActiveVisit(edTriagePatient) {
                return $http.post(CONSTANTS.URLS.ACTIVE_VISIT + "?patient=" + edTriagePatient.patient.uuid + "&location=" + edTriagePatient.location);
            }

            function saveEncounter(encounter, existingUuid) {
                var url = CONSTANTS.URLS.ENCOUNTER_SAVE;

                if(existingUuid != null){
                    //if the encounte already exists, then append the UUID and it will update it
                    url +=   "/" + existingUuid;
                    encounter['uuid'] = existingUuid;
                }

                return $http.post(url, encounter);
            }

            function deleteObs(list) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                var removeObservation = function(obsUuid) {
                    return function(){
                        return $http({
                            url: CONSTANTS.URLS.OBSERVATION + "/" + obsUuid,
                            method: 'DELETE'
                        })
                    }
                };

                deferred.resolve();

                return list.reduce(function(promise, obsUuid){
                    return promise.then(removeObservation(obsUuid));
                }, promise);
            }
            /*
             helper function to build an observation object
             * */
            function buildObs(concept, value, uuid) {
                //return {concept: id, value: value};
                return {concept: concept, value: value, uuid:uuid};
            }

            /*
             * helper function to add an observation to the list
             * */
            function addObs(obsList, obsToDeleteList, concept, obs) {
                if(obs == null){
                    return;
                }

                var value = obs.value;
                var uuid = obs.uuid;

                if (value == null || value == false || (typeof value == 'string' && value.length==0)) {
                    if (uuid != null) {
                        obsToDeleteList.push(uuid);
                    }
                }
                else{
                    obsList.push(buildObs(concept, value, uuid));
                }

            }


            this.CONSTANTS = CONSTANTS;
   //         this.session =  SessionInfo.get();
        }]);