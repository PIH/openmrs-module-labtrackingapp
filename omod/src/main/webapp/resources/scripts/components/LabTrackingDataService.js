angular.module("labTrackingDataService", [])
    .service('LabTrackingDataService', ['$q', '$http', 'SessionInfo', 'LabTrackingOrder', 'Encounter',
        function ($q, $http, SessionInfo, LabTrackingOrder, Encounter) {
            var _self = this;
            var ORDER_FIELDS = "uuid,dateActivated,orderReason,orderNumber,instructions,clinicalHistory,urgency,encounter,encounter.obs,concept,patient,patient.identifiers";
            var LOCATION_CONSULT_NOTE_UUID = "dea8febf-0bbe-4111-8152-a9cf7df622b6";
            var PROCEDURES_CONCEPT_SET_UUID = "3c9a5a8c-1e0c-4697-92e1-0313c99311b6";
            var DIAGNOSIS_CONCEPT_SET_UUID = "36489682-f68a-4a82-9cf8-4d2dca2221c6";
            var CONSTANTS = {
                MONITOR_PAGE_DAYS_BACK: 30,  //the default days back for the monitor page from filter
                URLS: {
                    FIND_PATIENT: "coreapps/findpatient/findPatient.page?app=edtriageapp.app.edTriage",
                    CANCEL_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/labtrackingapp/labtrackingServices.page?orderUuid=ORDER_UUID&action=cancel&data=REASON",
                    SAVE_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order",
                    VIEW_CONCEPT_SET: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/concept/CONCEPT_UUID?v=custom:(setMembers:(uuid,display))",
                    VIEW_LOCATIONS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/location?v=custom:(uuid,display)&tag=" + LOCATION_CONSULT_NOTE_UUID,
                    VIEW_CARE_SETTINGS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/caresetting",
                    VIEW_PROVIDERS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/provider?v=custom:(uuid,display,person)",
                    VIEW_QUEUE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order?s=getActiveOrders&v=custom:(" + ORDER_FIELDS + ")&location=LOCATION_UUID",
                    VIEW_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order/ORDER_UUID?v=custom:(" + ORDER_FIELDS + ")",
                    VIEW_SPECIMEN_DETAILS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getSpecimenDetailsEncounter&orderNumber=ORDER_NUMBER&v=custom:(obs,encounterDatetime,uuid)",
                    PATIENT_DASHBOARD: "coreapps/clinicianfacing/patient.page?patientId=PATIENT_UUID&app=pih.app.clinicianDashboard",
                    ACTIVE_VISIT: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/emrapi/activevisit"
                }
            };

            /*
             loads the Providers in the system, so that we can show them in the list with the correct
             id/display valies
             @return An Array of objects with uuid:diplay props
             */
            this.loadProviders = function () {
                var url = CONSTANTS.URLS.VIEW_PROVIDERS;
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        var ret = [];
                        for (var i = 0; i < resp.data.results.length; ++i) {
                            var uuid = resp.data.results[i].uuid;
                            var nm;
                            if (resp.data.results[i].person != null) {
                                nm = resp.data.results[i].person.display
                            }
                            else {
                                nm = resp.data.results[i].display;
                            }

                            ret.push({uuid: uuid, name: nm});
                        }
                        return {status: {code: resp.status, msg: null}, data: ret};
                    }
                    else {
                        return {status: {code: resp.status, msg: "Error loading providers " + resp.status}, data: []};
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error loading providers " + err}, data: []};
                });
            };

            /*
             loads the Locations in the system, so that we can show them in the list with the correct
             id/display valies
             @return An Array of objects with uuid,:diplay props
             */
            this.loadLocations = function () {
                var url = CONSTANTS.URLS.VIEW_LOCATIONS;
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        return {status: {code: resp.status, msg: null}, data: resp.data.results};
                    }
                    else {
                        return {status: {code: resp.status, msg: "Error loading locations " + resp.status}, data: []};
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error loading locations " + err}, data: []};
                });
            };

            /*
            load the procedures that are available
            * */
            this.loadProcedures = function(){
                return _self.loadConceptSet(PROCEDURES_CONCEPT_SET_UUID);
            };


            /*
             load the dianosis that are available
             * */
            this.loadDiagnonses = function(){
                return _self.loadConceptSet(DIAGNOSIS_CONCEPT_SET_UUID);
            };
            /*
             loads the the concepts in a concept set
              @param conceptUUID = the concept UUID
             @return An Array of objects with label, value props
             */
            this.loadConceptSet = function (conceptUuid) {
                var url = CONSTANTS.URLS.VIEW_CONCEPT_SET.replace("CONCEPT_UUID", conceptUuid);
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        var data = [];
                        for(var i=0;i<resp.data.setMembers.length;++i){
                            var c = resp.data.setMembers[i];
                            data.push({value:c.uuid, label:c.display})
                        }
                        return {status: {code: resp.status, msg: null}, data: data};
                    }
                    else {
                        return {status: {code: resp.status, msg: "Error loading ConceptSet " + resp.status}, data: []};
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error loading ConceptSet " + err}, data: []};
                });
            };

            /*
             loads the CareSettings in the system, so that we can show them in the list with the correct
             id/display valies
             @return An Array of objects with uuid:diplay props
             */
            this.loadCareSettings = function () {
                var url = CONSTANTS.URLS.VIEW_CARE_SETTINGS;
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        return {status: {code: resp.status, msg: null}, data: resp.data.results};
                    }
                    else {
                        return {
                            status: {code: resp.status, msg: "Error loading caresettings " + resp.status},
                            data: []
                        };
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error loading caresettings " + err}, data: []};
                });
            };

            /* loads a LabTrackingOrder
             *  @param OPTIONAL {String} orderUuid - the order uuid
             * @returns {LabTrackingOrder} the LabTrackingOrder object
             * */
            this.loadOrder = function (orderUuid) {
                var url = CONSTANTS.URLS.VIEW_ORDER.replace("ORDER_UUID", orderUuid);
                console.log(url);
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        var labTrackingOrder = LabTrackingOrder.fromWebServiceObject(resp.data);

                        return _self.loadSpecimenDetailsForOrder(labTrackingOrder);

                        //return {status:{ code: resp.status, msg:null},data:LabTrackingOrder.fromWebServiceObject(resp.data)};
                    }
                    else {
                        return {status: {code: resp.status, msg: "Error loading queue " + resp.status}, data: []};
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error loading queue " + err}, data: []};
                });
            };

            /* loads the specimen details for an order
             *  @param {LabTrackingOrder} labTrackingOrder - the order to update with the info
             * @returns {LabTrackingOrder} the LabTrackingOrder object
             * */
            this.loadSpecimenDetailsForOrder = function (labTrackingOrder) {
                var url = CONSTANTS.URLS.VIEW_SPECIMEN_DETAILS.replace("ORDER_NUMBER", labTrackingOrder.orderNumber.value);
                console.log(url);
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        if (resp.data.results != null && resp.data.results.length > 0 && resp.data.results[0] != null) {
                            LabTrackingOrder.fromSpecimenCollectionEncounterWebServiceObject(resp.data.results[0], labTrackingOrder);
                        }
                        return {status: {code: resp.status, msg: null}, data: labTrackingOrder};
                    }
                    else {
                        return {status: {code: resp.status, msg: "Error loading queue " + resp.status}, data: []};
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error loading queue " + err}, data: []};
                });
            };

            /* load the LabTracking for a location
             *  @param OPTIONAL {String} locationUuid - the location uuid
             *  @param OPTIONAL {String} patientUuid - the patient uuid
             * @returns {LabTrackingOrder} the list of LabTrackingOrder objects
             * */
            this.loadQueue = function (locationUuid, patientUuid) {
                var url = CONSTANTS.URLS.VIEW_QUEUE.replace("LOCATION_UUID", (locationUuid == null ? "" : locationUuid)).replace("PATIENT_UUID", (patientUuid == null ? "" : patientUuid));
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        var list = resp.data.results;
                        var testOrders = LabTrackingOrder.buildList(list);

                        return {status: {code: resp.status, msg: null}, data: testOrders};
                    }
                    else {
                        return {status: {code: resp.status, msg: "Error loading queue " + resp.status}, data: []};
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error loading queue " + err}, data: []};
                });
            };

            /* cancels the order
             *  @param {String} orderUuid - the order uuid
             *  @param {String} reason - the reason
             * @returns none
             * */
            this.cancelOrder = function (orderUuid, reason) {
                var url = CONSTANTS.URLS.CANCEL_ORDER.replace("ORDER_UUID", orderUuid).replace("REASON", reason);
                return $http.get(url).then(function (resp) {
                    if (resp.status == 200) {
                        return {status: {code: resp.status, msg: null}, data: null};
                    }
                    else {
                        return {status: {code: resp.status, msg: "Error canceling the order " + resp.status}, data: []};
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error canceling the order " + err}, data: []};
                });
            };

            /* creates the encounter associated with the test order
             @param labTrackingOrder - the order to create
             @return the saved encounter
             */
            this.createOrderEncounter = function (labTrackingOrder) {
                var provider = _self.session.currentProvider ? _self.session.currentProvider.uuid : null;
                var encounter = LabTrackingOrder.toTestOrderEncounterWebServiceObject(labTrackingOrder, provider);
                return Encounter.save(encounter);
            };


            /* creates the encounter associated with the specimen for the test
             @param labTrackingOrder - the order to create
             @return the saved encounter
             */
            this.createOrUpdateOrderSpecimenEncounter = function (labTrackingOrder) {
                var provider = _self.session.currentProvider ? _self.session.currentProvider.uuid : null;

                var encounter = LabTrackingOrder.toSpecimenCollectionEncounterWebServiceObject(labTrackingOrder, provider);
                return Encounter.save(encounter, labTrackingOrder.specimenDetailsEncounter.uuid);

                //first check if the encounter exists
                if (labTrackingOrder.specimenDetailsEncounter.uuid != null) {
                    //we need to update the observations from this encounter
                    return null;
                }
                else {
                    var encounter = LabTrackingOrder.toSpecimenCollectionEncounterWebServiceObject(labTrackingOrder, provider);
                    return Encounter.save(encounter);
                }
            };


            /*
             saves an order for a patient
             * */
            this.saveOrder = function (labTrackingOrder) {

                return ensureActiveVisit(labTrackingOrder.patient.value, labTrackingOrder.location.value)
                    .then(function (res) {
                        if (_self.isOk(res)) {
                            return _self.createOrderEncounter(labTrackingOrder);
                        }
                        else {
                            return res;
                        }

                    })
                    .then(function (res) {
                        if (_self.isOk(res)) {
                            labTrackingOrder.encounter.value = res.data.uuid;
                            var order = LabTrackingOrder.toWebServiceObject(labTrackingOrder, _self.session.currentProvider.uuid);
                            return $http.post(CONSTANTS.URLS.SAVE_ORDER, order)
                        }
                        else {
                            return res;
                        }
                    })
                    .then(function (res) {
                        return res;
                    }, function (err) {
                        return err;
                    })

            };


            function ensureActiveVisit(patient, location) {
                return $http.post(CONSTANTS.URLS.ACTIVE_VISIT + "?patient=" + patient + "&location=" + location);
            }

            this.isOk = function (res) {
                return res !== null && res.status != null && res.status < 300;
            };
            this.CONSTANTS = CONSTANTS;
            this.session = SessionInfo.get();
            //            return SessionInfo.get().then(function(sess){
            //                this.session = sess;
            //                console.log(this.session);
            //            });


        }
    ]);