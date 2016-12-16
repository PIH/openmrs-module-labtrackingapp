angular.module("labTrackingDataService", [])
	.service('LabTrackingDataService', ['$q', '$http', 'SessionInfo', 'LabTrackingOrder', 'Encounter',
		function($q, $http, SessionInfo, LabTrackingOrder, Encounter) {
		    var _self = this;
			var CONSTANTS = {
				URLS: {
					FIND_PATIENT: "coreapps/findpatient/findPatient.page?app=edtriageapp.app.edTriage",
					SAVE_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order",
					VIEW_CARE_SETTINGS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/caresetting",
					VIEW_QUEUE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order?s=getActiveOrders&v=custom:(uuid,dateActivated,orderReason,instructions,encounter,concept,patient,patient.identifiers)&location=LOCATION_UUID",
					VIEW_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order/ORDER_UUID?v=custom:(uuid,dateActivated,orderReason,instructions,encounter,concept,patient,patient.identifiers)",
					PATIENT_DASHBOARD: "coreapps/clinicianfacing/patient.page?patientId=PATIENT_UUID&app=pih.app.clinicianDashboard",
					ACTIVE_VISIT: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/emrapi/activevisit"
				},
				ORDER_TYPE: "testorder",
				ORDER_FREQUENCY_UUID: "38090760-7c38-11e4-baa7-0800200c9a67",
				ORDER_ENCOUNTER_TYPE_UUID: "b3a0e3ad-b80c-4f3f-9626-ace1ced7e2dd",
				ORDER_ENCOUNTER_PROVIDER_ROLE_UUID: "c458d78e-8374-4767-ad58-9f8fe276e01c",


			};

            /*
            loads the CareSettings in the system, so that we can show them in the list with the correct
               id/display valies
               @return An Array of objects with uuid:diplay props
            */
            this.loadCareSettings = function(){
                var url = CONSTANTS.URLS.VIEW_CARE_SETTINGS;
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        return {status:{ code: resp.status, msg:null},data:resp.data.results};
                    }
                    else {
                        return {status:{ code: resp.status, msg:"Error loading caresettings " + resp.status},data:[]};
                    }

                }, function (err) {
                    return {status:{ code: 500, msg:"Error loading caresettings " + err},data:[]};
                });
            }

            /* loads a LabTrackingOrder
             *  @param OPTIONAL {String} orderUuid - the order uuid
             * @returns {LabTrackingOrder} the LabTrackingOrder object
             * */
            this.loadOrder = function (orderUuid) {
                var url = CONSTANTS.URLS.VIEW_ORDER.replace("ORDER_UUID", orderUuid);
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        return {status:{ code: resp.status, msg:null},data:LabTrackingOrder.fromWebServiceObject(resp.data)};
                    }
                    else {
                        return {status:{ code: resp.status, msg:"Error loading queue " + resp.status},data:[]};
                    }

                }, function (err) {
                    return {status:{ code: 500, msg:"Error loading queue " + err},data:[]};
                });
            };

            /* load the LabTracking for a location
             *  @param OPTIONAL {String} locationUuid - the location uuid
             *  @param OPTIONAL {String} patientUuid - the patient uuid
             * @returns {LabTrackingOrder} the list of LabTrackingOrder objects
             * */
            this.loadQueue = function (locationUuid, patientUuid) {
                var url = CONSTANTS.URLS.VIEW_QUEUE.replace("LOCATION_UUID", (locationUuid==null?"":locationUuid)).replace("PATIENT_UUID", (patientUuid==null?"":patientUuid));
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        var list = resp.data.results;
                        var testOrders = LabTrackingOrder.buildList(list);

                        return {status:{ code: resp.status, msg:null},data:testOrders};
                    }
                    else {
                        return {status:{ code: resp.status, msg:"Error loading queue " + resp.status},data:[]};
                    }

                }, function (err) {
                    return {status:{ code: 500, msg:"Error loading queue " + err},data:[]};
                });
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
                            labTrackingOrder.encounter.value = res.data.uuid;
                            var order = LabTrackingOrder.toWebServiceObject(labTrackingOrder,_self.session.currentProvider.uuid);
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