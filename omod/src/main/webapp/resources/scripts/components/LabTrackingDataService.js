angular.module("labTrackingDataService", [])
	.service('LabTrackingDataService', ['$q', '$http', 'SessionInfo', 'LabTrackingOrder', 'Encounter',
		function($q, $http, SessionInfo, LabTrackingOrder, Encounter) {
		    var _self = this;
			var CONSTANTS = {
				URLS: {
					FIND_PATIENT: "coreapps/findpatient/findPatient.page?app=edtriageapp.app.edTriage",
					SAVE_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order",
					PATIENT_DASHBOARD: "coreapps/clinicianfacing/patient.page?patientId=PATIENT_UUID&app=pih.app.clinicianDashboard",
					ACTIVE_VISIT: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/emrapi/activevisit"
				},
				ORDER_TYPE: "testorder",
				ORDER_FREQUENCY_UUID: "38090760-7c38-11e4-baa7-0800200c9a67",
				ORDER_ENCOUNTER_TYPE_UUID: "b3a0e3ad-b80c-4f3f-9626-ace1ced7e2dd",
				ORDER_ENCOUNTER_PROVIDER_ROLE_UUID: "c458d78e-8374-4767-ad58-9f8fe276e01c",


			};


			this.createOrderEncounter = function(labTrackingOrder) {
				var provider = _self.session.currentProvider ? _self.session.currentProvider.uuid : null;
				var encounter = new Encounter(CONSTANTS.ORDER_ENCOUNTER_TYPE_UUID, provider, CONSTANTS.ORDER_ENCOUNTER_PROVIDER_ROLE_UUID,
					labTrackingOrder.patient.value, labTrackingOrder.location.value);

				return Encounter.save(encounter);
			};


			/*
			 saves an order for a patient
			 * */
			this.saveOrder = function(labTrackingOrder) {

				return ensureActiveVisit(labTrackingOrder.patient.value, labTrackingOrder.location.value)
					.then(function(res) {
						if(_self.isOk(res)){
						    return _self.createOrderEncounter(labTrackingOrder);
						}
						else{
						    return res;
						}

					})
					.then(function(res) {
						if(_self.isOk(res)){
						    //set the encounter id
						    //test edit
                            labTrackingOrder.encounter.value = res.data.uuid;
//06cf82e6-47a3-4f7a-b2ba-51eaf463294e
                            var order = {
                                type: CONSTANTS.ORDER_TYPE,
                                patient: labTrackingOrder.patient.value,
                                orderer: _self.session.currentProvider.uuid,
                                concept: labTrackingOrder.procedure.value,
                                careSetting: labTrackingOrder.careSetting.value,
                                encounter: labTrackingOrder.encounter.value,

                                orderReason: labTrackingOrder.diagnosis.value,
                                instructions: labTrackingOrder.instructions.value,
                                clinicalHistory: labTrackingOrder.clinicalHistory.value,
                                laterality: null //TODO:  maybe store the site info, or not
                            };

						    return $http.post(CONSTANTS.URLS.SAVE_ORDER, order)
						}
						else{
						    return res;
						}
					})
					.then(function(res) {
						return res;
					}, function(err){
					    return err;
					})

			};


			function ensureActiveVisit(patient, location) {
				return $http.post(CONSTANTS.URLS.ACTIVE_VISIT + "?patient=" + patient + "&location=" + location);
			}

            this.isOk = function(res){
                return res !== null && res.status != null && res.status < 300;
            }
			this.CONSTANTS = CONSTANTS;
			this.session = SessionInfo.get();
			//            return SessionInfo.get().then(function(sess){
			//                this.session = sess;
			//                console.log(this.session);
			//            });


		}
	]);