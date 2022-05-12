angular.module("labTrackingDataService", [])
    .service('LabTrackingDataService', ['$q', '$http', 'SessionInfo', 'Upload', 'LabTrackingOrder', 'Encounter',
        function ($q, $http, SessionInfo, Upload, LabTrackingOrder, Encounter) {
            var _self = this;
            var ORDER_FIELDS = "uuid,dateActivated,orderReason:(uuid,display),orderReasonNonCoded,orderNumber,instructions,clinicalHistory,encounter,encounter:(obs,location),patient:(uuid,person:(uuid,display),identifiers:(identifier)),careSetting:(uuid,display),auditInfo";
            var ENCOUNTER_FIELDS ="location:(uuid,name),encounterDatetime,uuid,visit:(uuid,startDatetime,stopDatetime),orders:(uuid,dateActivated,dateStopped,orderType:(uuid,display),concept:(uuid,display),orderReason:(uuid,display),orderReasonNonCoded,orderNumber,instructions,clinicalHistory,careSetting:(uuid,display),voided),patient:(uuid,person:(uuid,display),identifiers:(identifier)),obs:(concept:(uuid),display,valueText,valueNumeric,valueCoded:(uuid,display),valueDatetime,uuid,groupMembers:(uuid,display,concept:(uuid,display),obsDatetime,valueCoded:(uuid,display),valueDatetime,valueNumeric,valueText,voided)),encounterProviders:(uuid,provider:(uuid,person:(display)),encounterRole:(uuid))";
            var LOCATION_CONSULT_NOTE_UUID = "dea8febf-0bbe-4111-8152-a9cf7df622b6";
            var PROCEDURES_CONCEPT_SET_UUID = "3c9a5a8c-1e0c-4697-92e1-0313c99311b6";
            var DIAGNOSIS_CONCEPT_SET_UUID = "36489682-f68a-4a82-9cf8-4d2dca2221c6";
            var HUM_DIAGNOSIS_CONCEPT_SET_UUID = "8fcd0b0c-f977-4a66-a1b5-ad7ce68e6770";
            var CONCEPT_CLASS_PROCEDURE_UUID = "8d490bf4-c2cc-11de-8d13-0010c6dffd0f";
            var CONCEPT_CLASS_DX_UUID = "8d4918b0-c2cc-11de-8d13-0010c6dffd0f";
            var CONSTANTS = {
                MAX_QUEUE_SIZE: 10,
                MONITOR_PAGE_DAYS_BACK: 30,  //the default days back for the monitor page from filter
                URLS: {
                    FIND_PATIENT: "coreapps/findpatient/findPatient.page?app=edtriageapp.app.edTriage",
                    CANCEL_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order/ORDER_UUID",
                    SAVE_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order",
                    VIEW_CONCEPT_SET: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/concept/CONCEPT_UUID?v=custom:(setMembers:(uuid,display))",
                    VIEW_LOCATIONS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/location?v=custom:(uuid,display)&tag=" + LOCATION_CONSULT_NOTE_UUID,
                    VIEW_CARE_SETTINGS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/caresetting?v=custom:(uuid,display)",
                    VIEW_PROVIDERS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/provider?v=custom:(uuid,display,person)",
                    VIEW_QUEUE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order?s=getActiveOrders&v=custom:(" + ORDER_FIELDS
                    + ")&startDateInMillis=START_DATE&endDateInMillis=END_DATE&patient=PATIENT_UUID&name=PATIENT_NAME&status=STATUS&suspectedCancer=SUSPECTED_CANCER&urgentReview=URGENT_REVIEW"
                    + "&limit=MAX_QUEUE_SIZE&startIndex=START_INDEX&totalCount=true",
                    PATHOLOGY_QUEUE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getSpecimenDetailsEncounter&v=custom:(" + ENCOUNTER_FIELDS
                    + ")&startDateInMillis=START_DATE&endDateInMillis=END_DATE&patient=PATIENT_UUID&name=PATIENT_NAME&status=STATUS&suspectedCancer=SUSPECTED_CANCER&urgentReview=URGENT_REVIEW"
                    + "&limit=MAX_QUEUE_SIZE&startIndex=START_INDEX&totalCount=true",
                    VIEW_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order/ORDER_UUID?v=custom:(" + ORDER_FIELDS + ")",
                    VIEW_SPECIMEN_DETAILS: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter?s=getSpecimenDetailsEncounter&orderNumbers=ORDER_NUMBER&v=custom:(location:(uuid,name),encounterDatetime,uuid,visit:(uuid,startDatetime,stopDatetime),obs:(concept:(uuid),display,value,uuid,groupMembers),encounterProviders:(uuid,provider:(uuid,person:(display)),encounterRole:(uuid)))",
                    UPLOAD_FILE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/obs",
                    PATIENT_DASHBOARD: "coreapps/clinicianfacing/patient.page?patientId=PATIENT_UUID&app=pih.app.clinicianDashboard",
                    ACTIVE_VISIT: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/emrapi/activevisit",
                    CONCEPT_SEARCH: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/conceptsearch?q=PROCEDURE_NAME&conceptClasses=" + CONCEPT_CLASS_PROCEDURE_UUID + "&v=custom:(concept:(uuid,display))",
                    DX_SEARCH: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/conceptsearch?q=DX_NAME&conceptClasses=" + CONCEPT_CLASS_DX_UUID + "&v=custom:(concept:(uuid,display))"
                }
            };


            /* gets the print page
             * @param  orderUuid - the order
             * @param  patientUuid - the patient
             * @return String the url
             * */
            this.getPrintPageUrl = function (orderUuid, patientUuid) {
                return 'labtrackingOrderPrint.page?orderUuid=' + orderUuid + "&patientId=" + patientUuid;
            };

            /* gets the view queue page
             * @param {optional} patientUuid - the patient to show the queue for
             * @return String the url
             * */
            this.getQueuePageUrl = function (patientUuid) {
                var queryString = "returnUrl=internal"; //used to tell the queue to use the cookies for settings
                if (patientUuid != null && patientUuid != 'null') {
                    queryString += "&patientId=" + patientUuid;
                }
                return "labtrackingViewQueue.page?" + queryString;
            }

            /*
             loads the Providers in the system, so that we can show them in the list with the correct
             id/display valies
             @return An Array of objects with uuid:diplay props
             */
            this.loadProviders = function () {
                var url = CONSTANTS.URLS.VIEW_PROVIDERS;
                return $http.get(url).then(function (resp) {
                    if (_self.isOk(resp)) {
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

                            ret.push({value: uuid, label: nm});
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
                    if (_self.isOk(resp)) {
                        var data = [];
                        for (var i = 0; i < resp.data.results.length; ++i) {
                            var c = resp.data.results[i];
                            data.push({value: c.uuid, label: c.display})
                        }
                        return {status: {code: resp.status, msg: null}, data: data};
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
            this.loadProcedures = function () {
                return _self.loadConceptSet(PROCEDURES_CONCEPT_SET_UUID);
            };

          /**
           * Search asynchronously concepts of class Procedure
           * @param searchName
           */
            this.searchProcedures = function(searchName) {
                var url = CONSTANTS.URLS.CONCEPT_SEARCH.replace("PROCEDURE_NAME", searchName);
                return $http.get(url);
            };

          /**
           * Search asynchronously concepts of class Diagnosis
           * @param dxName
           */
          this.searchDx = function(dxName) {
            var url = CONSTANTS.URLS.DX_SEARCH.replace("DX_NAME", dxName);
            return $http.get(url);
          };
            /*
             load the dianosis that are available
             * */
            this.loadDiagnonses = function () {
                return _self.loadConceptSet(DIAGNOSIS_CONCEPT_SET_UUID);
            };

            /*
             load all the HUM dianoses
             * */
            this.loadHumDiagnoses = function () {
                var deferred = $q.defer();
                var promises = [];
                var allSysDiagnoses = [];
                _self.loadConceptSet(HUM_DIAGNOSIS_CONCEPT_SET_UUID).then(function(result) {
                    angular.forEach(result.data, function (diagSet) {
                        promises.push(_self.loadConceptSet(diagSet.value));
                    });
                    return $q.all(promises).then(function(dataSet) {
                       angular.forEach(dataSet, function(diagnosis) {
                           allSysDiagnoses.push.apply(allSysDiagnoses, diagnosis.data);
                       });
                        deferred.resolve(allSysDiagnoses);
                    });
                });

                return deferred.promise;
            };
            /*
             loads the the concepts in a concept set
             @param conceptUUID = the concept UUID
             @return An Array of objects with label, value props
             */
            this.loadConceptSet = function (conceptUuid) {
                var url = CONSTANTS.URLS.VIEW_CONCEPT_SET.replace("CONCEPT_UUID", conceptUuid);
                return $http.get(url).then(function (resp) {
                    if (_self.isOk(resp)) {
                        var data = [];
                        for (var i = 0; i < resp.data.setMembers.length; ++i) {
                            var c = resp.data.setMembers[i];
                            data.push({value: c.uuid, label: c.display})
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
                    if (_self.isOk(resp)) {
                        var list = [];
                        for (var i = 0; i < resp.data.results.length; ++i) {
                            var s = resp.data.results[i];
                            list.push({label: s.display, value: s.uuid})
                        }
                        return {status: {code: resp.status, msg: null}, data: list};
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
                return $http.get(url).then(function (resp) {
                    if (_self.isOk(resp)) {
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
                return $http.get(url).then(function (resp) {

                    if (_self.isOk(resp)) {
                        if (resp.data.results != null && resp.data.results.length > 0 && resp.data.results[0] != null) {
                            LabTrackingOrder.fromSpecimenCollectionEncounterWebServiceObject(resp.data.results[0], labTrackingOrder);
                        }
                        else {
                            if (labTrackingOrder.procedures.length > 0) {
                                for (var i = 0; i < labTrackingOrder.procedures.length; ++i) {
                                    labTrackingOrder.proceduresForSpecimen.push({
                                        value: labTrackingOrder.procedures[i].value,
                                        label: labTrackingOrder.procedures[i].label,
                                        obsUuid: null
                                    });
                                }

                            }
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


            /* loads the specimen details for an order
             *  @param {LabTrackingOrder} list - the list of orders
             * @returns {LabTrackingOrder} the LabTrackingOrder object
             * */
            this.loadSpecimenDetailsForQueue = function (list) {
                var orderNumbers = [];
                var orderNumberMap = {};
                if (list != null) {
                    for (var i = 0; i < list.length; ++i) {
                        orderNumbers.push(list[i].orderNumber.value);
                        orderNumberMap[list[i].orderNumber.value] = i;
                    }
                }
                var url = CONSTANTS.URLS.VIEW_SPECIMEN_DETAILS.replace("ORDER_NUMBER", orderNumbers.toString());
                return $http.get(url).then(function (resp) {
                    if (_self.isOk(resp)) {
                        if (resp.data.results != null && resp.data.results.length > 0) {
                            for (var i = 0; i < resp.data.results.length; ++i) {
                                var orderNumber = getObsByConceptId(resp.data.results[i].obs, LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_ORDER_NUMBER);
                                if (orderNumber != null) {
                                    for (var j = 0; j < list.length; ++j) {
                                        if (list[j].orderNumber.value == orderNumber.value) {
                                            LabTrackingOrder.fromSpecimenCollectionEncounterWebServiceObject(resp.data.results[i], list[j]);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        return {status: {code: resp.status, msg: null}, data: list};
                    }
                    else {
                        return {status: {code: resp.status, msg: "Error loading queue " + resp.status}, data: []};
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error loading queue " + err}, data: []};
                });
            };

          /* load the LabTracking for a location
            *  @param OPTIONAL {int} pageNumber - the page to load
            *  @param OPTIONAL {Date} startDate - the location uuid
            *  @param OPTIONAL {Date} endDate - the location uuid
            *  @param OPTIONAL {int} status - the location uuid
            *  @param OPTIONAL {String} patientUuid - the patient uuid
            *  @param OPTIONAL {String} patientName - a look up string for the patient name
            * @returns {LabTrackingOrder} an object containing the current page of LabTrackingOrder objects and the total count of all the orders
            * */
          this.loadPathologyQueue = function (pageNumber, startDate, endDate, status, patientUuid, patientName, suspectedCancer, urgentReview) {
            var startIndex = 0;
            if (pageNumber != null && pageNumber > 0) {
              startIndex = (pageNumber - 1) * CONSTANTS.MAX_QUEUE_SIZE;
            }
            var url = CONSTANTS.URLS.PATHOLOGY_QUEUE
            .replace("START_DATE", (startDate == null ? "" : startDate.getTime()))
            .replace("END_DATE", (startDate == null ? "" : endDate.getTime()))
            .replace("STATUS", (status == null ? "" : status))
            .replace("PATIENT_UUID", (patientUuid == null ? "" : patientUuid))
            .replace("PATIENT_NAME", (patientName == null ? "" : patientName))
            .replace("SUSPECTED_CANCER", (suspectedCancer == null ? "false" : suspectedCancer))
            .replace("URGENT_REVIEW", (urgentReview == null ? "false" : urgentReview))
            .replace("MAX_QUEUE_SIZE", CONSTANTS.MAX_QUEUE_SIZE)
            .replace("START_INDEX", startIndex);
            return $http.get(url).then(function (resp) {
              if (_self.isOk(resp)) {
                var list = resp.data.results;
                var testOrders = [];
                for (var i =0; i < list.length; i++) {
                  testOrders.push(LabTrackingOrder.fromEncounterRestObject(list[i]));
                }

                return {
                  status: { code: resp.status, msg: null},
                  data: { orders: testOrders, totalCount: resp.data.totalCount}
                };
              }
              else {
                return {status: {code: resp.status, msg: "Error loading queue " + resp.status}, data: []};
              }

            }, function (err) {
              return {status: {code: 500, msg: "Error loading queue " + err}, data: []};
            });
          };

            /* load the LabTracking for a location
             *  @param OPTIONAL {int} pageNumber - the page to load
             *  @param OPTIONAL {Date} startDate - the location uuid
             *  @param OPTIONAL {Date} endDate - the location uuid
             *  @param OPTIONAL {int} status - the location uuid
             *  @param OPTIONAL {String} patientUuid - the patient uuid
             *  @param OPTIONAL {String} patientName - a look up string for the patient name
             * @returns {LabTrackingOrder} an object containing the current page of LabTrackingOrder objects and the total count of all the orders
             * */
            this.loadQueue = function (pageNumber, startDate, endDate, status, patientUuid, patientName, suspectedCancer, urgentReview) {
                var startIndex = 0;
                if (pageNumber != null && pageNumber > 0) {
                    startIndex = (pageNumber - 1) * CONSTANTS.MAX_QUEUE_SIZE;
                }
                var url = CONSTANTS.URLS.VIEW_QUEUE
                    .replace("START_DATE", (startDate == null ? "" : startDate.getTime()))
                    .replace("END_DATE", (startDate == null ? "" : endDate.getTime()))
                    .replace("STATUS", (status == null ? "" : status))
                    .replace("PATIENT_UUID", (patientUuid == null ? "" : patientUuid))
                    .replace("PATIENT_NAME", (patientName == null ? "" : patientName))
                    .replace("SUSPECTED_CANCER", (suspectedCancer == null ? "false" : suspectedCancer))
                    .replace("URGENT_REVIEW", (urgentReview == null ? "false" : urgentReview))
                    .replace("MAX_QUEUE_SIZE", CONSTANTS.MAX_QUEUE_SIZE)
                    .replace("START_INDEX", startIndex);
                return $http.get(url).then(function (resp) {
                    if (_self.isOk(resp)) {
                        var list = resp.data.results;
                        var testOrders = LabTrackingOrder.buildList(list);

                        return {
                            status: {code: resp.status, msg: null},
                            data: {orders: testOrders, totalCount: resp.data.totalCount}
                        };
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
             *  @param {optional bool) shouldPurge - whether to purge or just void the order
             * @returns none
             * */
            this.cancelOrder = function (orderUuid, shouldPurge) {
                var url = CONSTANTS.URLS.CANCEL_ORDER.replace("ORDER_UUID", orderUuid);
                if (shouldPurge != null && shouldPurge == true) {
                    url += "?purge";
                }

                return $http.delete(url).then(function (resp) {
                    if (_self.isOk(resp)) {
                        return {status: {code: resp.status, msg: null}, data: null};
                    }
                    else {
                        return {status: {code: resp.status, msg: "Error canceling the order " + resp.status}, data: []};
                    }

                }, function (err) {
                    return {status: {code: 500, msg: "Error canceling the order " + err}, data: []};
                });
            };
            

          /**
           * adds Order Number as an obs to the SpecimenCollection encounter
           * @param labTrackingOrder
           * @return the updated encounter
           */
            this.updateSpecimenCollectionEncounterOrderNumber = function (labTrackingOrder) {
                var obs = [];
                obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_ORDER_NUMBER,
                labTrackingOrder.orderNumber.value, labTrackingOrder.orderNumber.obsUuid));

                var encounter = {
                    patient: labTrackingOrder.patient.value,
                    location: labTrackingOrder.locationWhereSpecimenCollected.value,
                    encounterType: LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_CONCEPT_UUID,
                    encounterDatetime: labTrackingOrder.specimenDetailsEncounter.encounterDatetime,
                    obs: obs
                };

              return Encounter.save(encounter, labTrackingOrder.specimenDetailsEncounter.uuid).then(function(resp) {
                  return resp;
              });

            }

            /* creates the encounter associated with the specimen for the test
             @param labTrackingOrder - the order to create
             @return the saved encounter
             */
            this.createOrUpdateOrderSpecimenEncounter = function (labTrackingOrder) {
                var msg = "";
                var provider = _self.session.currentProvider ? _self.session.currentProvider.uuid : null;
                var data = LabTrackingOrder.toSpecimenCollectionEncounterWebServiceObject(labTrackingOrder, provider);
                return Encounter.deleteObs(data.obsIdsToDelete).then(function (res) {
                    return Encounter.save(data.encounter, labTrackingOrder.specimenDetailsEncounter.uuid).then(function (resp) {
                        if (_self.isOk(resp)) {
                            //need to update the labtracking orders spec id
                            labTrackingOrder.specimenDetailsEncounter.uuid = resp.data.uuid;
                            labTrackingOrder.specimenDetailsEncounter.encounterDatetime = resp.data.encounterDatetime;
                            return _self.handleEncounterProviders(labTrackingOrder).then(function (res) {
                                return _self.uploadResultsPdf(labTrackingOrder);
                            });
                        }
                        else {
                            return resp;
                        }
                    });
                });
            };

            /* handles saving/updating the surgeon and resident encounter providers
             * @param {LabTrackingOrder} labTrackingOrder - the order that contains the providers that you want to save
             * */
            this.handleEncounterProviders = function (labTrackingOrder) {
                var providers = LabTrackingOrder.getEncounterProviders(labTrackingOrder);
                //if the providers have changed then remove the old ones and add the new ones
                var changed = LabTrackingOrder.haveProvidersChanged(providers, labTrackingOrder.orginalSurgeonAndResident);

                if (!changed.surgeon && !changed.resident && !changed.provider) {
                    return Encounter.emptyPromise(labTrackingOrder);
                }
                else {
                    var encounterProvidersToDelete = [];
                    if (changed.surgeon) {
                        encounterProvidersToDelete.push(labTrackingOrder.specimenDetailsEncounter.surgeonEncounterProviderUuid);
                    }

                    if (changed.resident) {
                        encounterProvidersToDelete.push(labTrackingOrder.specimenDetailsEncounter.residentEncounterProviderUuid);
                    }

                    if (changed.provider) {
                        encounterProvidersToDelete.push(labTrackingOrder.specimenDetailsEncounter.encounterProviderUuid);
                    }

                    return Encounter.deleteEncounterProviders(labTrackingOrder.specimenDetailsEncounter.uuid, encounterProvidersToDelete).then(function () {
                        return Encounter.createProvider(labTrackingOrder.specimenDetailsEncounter.uuid, providers.surgeon).then(function (resp2) {
                            if (resp2.data != null) {
                                //update the surgeon uuid
                                labTrackingOrder.specimenDetailsEncounter.surgeonEncounterProviderUuid = resp2.data.uuid;
                                //msg += "surgeon is " + labTrackingOrder.specimenDetailsEncounter.surgeonEncounterProviderUuid+ "\n";

                            }
                            return Encounter.createProvider(labTrackingOrder.specimenDetailsEncounter.uuid, providers.resident).then(function (resp3) {
                                if (resp3.data != null) {
                                    //update the resident uuid
                                    labTrackingOrder.specimenDetailsEncounter.residentEncounterProviderUuid = resp3.data.uuid;
                                    //  msg += "resident is " + labTrackingOrder.specimenDetailsEncounter.residentEncounterProviderUuid + "\n";
                                }
                              return Encounter.createProvider(labTrackingOrder.specimenDetailsEncounter.uuid, providers.provider).then(function (resp4) {
                                if (resp4.data != null) {
                                  //update the encounter provider uuid
                                  labTrackingOrder.specimenDetailsEncounter.encounterProviderUuid = resp4.data.uuid;
                                }
                                //reset this with the updated values
                                labTrackingOrder.orginalSurgeonAndResident = LabTrackingOrder.getEncounterProviders(labTrackingOrder);

                                return {status: 200, data: labTrackingOrder};
                              });
                            });
                        });
                    });
                }

            };

            /*handles downloading the PDF, see http://stackoverflow.com/questions/283956/is-there-any-way-to-specify-a-suggested-filename-when-using-data-uri/6943481#6943481
             * for details about how/why it id done like this
             * @param {LabTrackingOrder} labTrackingOrder - the order that contains the PDF you want to download
             * */
            this.downloadPdf = function (labTrackingOrder) {
                return $http.get(labTrackingOrder.file.url, {responseType: 'arraybuffer'})
                    .success(function (data) {
                        var blob = new Blob([data], {type: 'application/pdf'});
                        var fileURL = URL.createObjectURL(blob);
                        var downloadLink = angular.element('<a></a>');
                        downloadLink.attr('target', "_blank");
                        downloadLink.attr('href', window.URL.createObjectURL(blob));
                        downloadLink.attr('download', 'results.pdf');
                        downloadLink[0].click();
                    });
            };

            /*  deletes the PDF to the server
             * @param {LabTrackingOrder} labTrackingOrder - the order that contains the PDF you want to delete
             *             */
            this.deleteResultsPdf = function (labTrackingOrder) {

                if (labTrackingOrder.file.obsUuid == null) {
                    return Encounter.emptyPromise(labTrackingOrder);
                }

                return Encounter.deleteObs([labTrackingOrder.file.obsUuid]).then(function (res) {
                    labTrackingOrder.file = {value: null, url: null, obsUuid: null};
                });
            };


            /*  uploads the PDF to the server
             * @param {LabTrackingOrder} labTrackingOrder - the order that contains the PDF that you want to save
             * */
            this.uploadResultsPdf = function (labTrackingOrder) {

                if (labTrackingOrder.file.value == null) {
                    return Encounter.emptyPromise(labTrackingOrder);
                }

                var obs = {
                    person: labTrackingOrder.patient.value,
                    obsDatetime: Encounter.toObsDate(new Date()),
                    concept: LabTrackingOrder.concepts.file.value,
                    encounter: labTrackingOrder.specimenDetailsEncounter.uuid,
                    location: labTrackingOrder.location.value
                    //file: file
                    //value: dataUrl
                };

                return Upload.upload({
                    url: CONSTANTS.URLS.UPLOAD_FILE,
                    data: {json: JSON.stringify(obs), file: labTrackingOrder.file.value},
                }).then(function (resp) {
                    //console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    labTrackingOrder.file.url = resp.data.value.links.uri;
                    labTrackingOrder.file.obsUuid = resp.data.uuid;

                    return {status: 200, data: labTrackingOrder};
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    return {status: 500, data: resp};
                }, function (evt) {
                    //var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });
            };

            /*
             saves an order for a patient
             * @param {LabTrackingOrder} labTrackingOrder - the order that you want to save
             * */
            this.saveOrder = function (labTrackingOrder) {
                return ensureActiveVisit(labTrackingOrder.patient.value, labTrackingOrder.location.value, labTrackingOrder.visit)
                    .then(function (res) {
                        if (_self.isOk(res)) {
                            return _self.createOrUpdateOrderSpecimenEncounter(labTrackingOrder);
                        }
                        else {
                            return res;
                        }

                    })
                    .then(function (res) {
                        if (_self.isOk(res)) {
                            labTrackingOrder.encounter.value = res.data.specimenDetailsEncounter.uuid;
                            var order = LabTrackingOrder.toWebServiceObject(labTrackingOrder, _self.session.currentProvider.uuid);
                            // use the specimen collection encounter datetime as the Order dateActivated
                            if (res.data.specimenDetailsEncounter && res.data.specimenDetailsEncounter.encounterDatetime ) {
                                order.dateActivated = res.data.specimenDetailsEncounter.encounterDatetime;
                            }
                            if ( labTrackingOrder.uuid ) {
                                // if the Order already exists, it cannot be updated (per ORDER REST API)
                              return $http.get(CONSTANTS.URLS.SAVE_ORDER + "/" + labTrackingOrder.uuid);
                            } else {
                              return $http.post(CONSTANTS.URLS.SAVE_ORDER, order);
                            }

                        }
                        else {
                            return res;
                        }
                    })
                    .then(function (res) {
                          if (_self.isOk(res)) {
                                LabTrackingOrder.updateOrderFromRestResponse(labTrackingOrder, res.data);
                                // add to the Specimen Collection encounter an obs with the ORDER-NUMBER
                                return _self.updateSpecimenCollectionEncounterOrderNumber(labTrackingOrder);
                          } else {
                                return res;
                          }
                    })
                    .then(function (res) {
                      return res;
                    }, function (err) {
                      return err;
                    })

            };

            this.getSessionProvider = function() {
              return _self.session.currentProvider ? _self.session.currentProvider : null;
            }

            /* helper function to determine if REST response is ok
             * @param {WSResps} res - the response from the server
             * @return true/false
             * */
            this.isOk = function (res) {
                return res !== null && res.status != null && res.status < 300;
            };

            this.CONSTANTS = CONSTANTS; //expose the constants
            this.session = SessionInfo.get(); // we use this to get the current provider

            //internal functions -----------------------------------------

            /*  gets an obs from a list based on the concept uuid
             * @param list - the list of observations
             * @param conceptUuid - the conceptUUid*/
            function getObsByConceptId(list, conceptUuid) {
                for (var i = 0; i < list.length; ++i) {
                    if (list[i].concept.uuid == conceptUuid) {
                        return list[i];
                    }
                }

                return null;
            }

            /* makes sure that there is a an active visit for this session
             * @param patient - the patient uuid
             * @param location - the location uuid
             * */
            function ensureActiveVisit(patient, location, visit) {
                var deferred = $q.defer();
                if (visit.value) {
                    deferred.resolve({status: 200, data: visit});
                } else {
                    return $http.post(CONSTANTS.URLS.ACTIVE_VISIT + "?patient=" + patient + "&location=" + location).then( function(res){
                        deferred.resolve(res);
                    }, function(error) {
                        deferred.reject(error);
                    });
                }

                return deferred.promise;
            }


        }
    ]);
