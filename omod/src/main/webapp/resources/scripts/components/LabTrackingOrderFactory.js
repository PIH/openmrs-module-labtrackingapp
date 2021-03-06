angular.module("labTrackingOrderFactory", [])
    .factory('LabTrackingOrder', ['$http', '$filter', 'Encounter', function ($http, $filter, Encounter) {
        LabTrackingOrder.CONSTANTS = {
            ORDER_TYPE: "testorder",
            // TODO this (and equivalent in LabTrackingConstants) is hardcoded to the Pathology Lab Order Type defined in OrderTypeBundle in PIH Core;
            // TODO: could be changed to GP if we want
            LAB_TRACKING_PATHOLOGY_ORDER_TYPE_UUID: "65c912c2-88cf-46c2-83ae-2b03b1f97d3a",
            ORDER_ENCOUNTER_PROVIDER_ROLE_UUID: "c458d78e-8374-4767-ad58-9f8fe276e01c",
            SPECIMEN_COLLECTION_ENCOUNTER_CONCEPT_UUID: "10db3139-07c0-4766-b4e5-a41b01363145",
            SPECIMEN_COLLECTION_ENCOUNTER_ORDER_NUMBER: "393dec41-2fb5-428f-acfa-36ea85da6666",
            SPECIMEN_COLLECTION_ENCOUNTER_SURGEON_ROLE: "9b135b19-7ebe-4a51-aea2-69a53f9383af",
            SPECIMEN_COLLECTION_ENCOUNTER_RESIDENT_ROLE: "6e630e03-5182-4cb3-9a82-a5b1a85c09a7",
            DIAGNOSIS_CERTAINTY_CONCEPT_UUID: "3cd9ef9a-26fe-102b-80cb-0017a47871b2",
            DIAGNOSIS_CERTAINTY_PRESUMED: "3cd9be80-26fe-102b-80cb-0017a47871b2",
            DIAGNOSIS_CERTAINTY_CONFIRMED: "3cd9bd04-26fe-102b-80cb-0017a47871b2",
            YES: "3cd6f600-26fe-102b-80cb-0017a47871b2"
        };

        /**
         * Constructor, with class name
         */
        function LabTrackingOrder(patientUuid, locationUuid, visitUuid) {
            this.location = {value: locationUuid}; //this is the location where the order was created
            this.patient = {value: patientUuid, name: null, id: null};
            this.visit = {value: visitUuid, id: null};
            this.uuid = null;
            this.canceled = false;
            this.specimenDetailsEncounter = {
                uuid: null,
                surgeonEncounterProviderUuid: null,
                residentEncounterProviderUuid: null
            };  // used to keep track of whether to create/update the details
            this.orderNumber = {value: null};
            this.preLabDiagnosis = {label: null, value: null};
            this.postopDiagnosis = {
                obsUuid: null, groupMemmberParentUuid: null,
                diagnosis: {label: null, value: null},
                certainty: {value: LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONFIRMED}
            };
            this.procedures = [];  //this is an array of values
            this.procedureNonCoded = {value: null};
            this.instructions = {value: ""};
            this.clinicalHistory = {value: ""};
            this.specimenDetails = [{value: "", obsUuid: null}, {value: "", obsUuid: null}, {
                value: "",
                obsUuid: null
            }, {value: "", obsUuid: null}];
            this.clinicalHistoryForSpecimen = {value: ""};
            this.proceduresForSpecimen = [];  //this is an array of values
            this.originalProceduresForSpecimen = [];  //this is an array of values
            this.procedureNonCodedForSpecimen = {value: null};
            this.careSetting = {label: "", value: '6f0c9a92-6f24-11e3-af88-005056821db0'};
            this.encounter = {value: null}; //this stores the encounter id for the order
            this.locationWhereSpecimenCollected = {value: null};
            this.surgeon = {value: null, label: null};
            this.resident = {value: null, label: null};
            this.orginalSurgeonAndResident = {surgeon: null, resident: null};
            this.mdToNotify = {value: null};
            this.urgentReview = {value: false};
            this.accessionNumber = {value:null};
            this.status = {label: null, value: null};
            this.requestDate = {value: null};
            this.sampleDate = {value: null};
            this.resultDate = {value: null, obsUuid: null};
            this.notes = {value: null};
            this.file = {value: null, url: null, obsUuid: null};
            this.debug = {};

        }

        /*
         the concept definitions for labTracking results
         */
        LabTrackingOrder.concepts = {
            order: {
                encounterTypeUuid: 'b3a0e3ad-b80c-4f3f-9626-ace1ced7e2dd',
                conceptUuid: "d6d585b6-4887-4aac-8361-424c17b030f2",
            },
            preLabDiagnosis: {value: '226ed7ad-b776-4b99-966d-fd818d3302c2'},
            postopDiagnosis: {
                value: '226ed7ad-b776-4b99-966d-fd818d3302c2',
                constructUuid: '2da3ec67-62aa-4be8-a32c-cb32723742c8'
            },
            procedure: {value: 'd6d585b6-4887-4aac-8361-424c17b030f2'},
            procedureNonCoded: {value: '823242df-e317-4426-9bd6-548146546b15'},
            proceduresForSpecimen: {value: 'd2a8e2d1-88f9-45f9-9511-4ac5df877340'},
            procedureNonCodedForSpecimen: {value: '2ccfa5d8-b2a0-4ff0-9d87-c2471ef069f4'},
            urgentReview: {value: '9e4b6acc-ab97-4ecd-a48c-b3d67e5ef778'},
            clinicalHistoryForSpecimen: {value: '160221AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
            mdToNotify: {value: 'a787e577-5e32-42dc-b3a8-e4c6d5b107f5'},
            specimenDetails: [{value: '7d557ddc-eca3-421e-98ae-5469a1ecba4d'}, {value: 'a6f54c87-a6aa-4312-bbc9-1346842a7f3f'},
                {value: '873d2496-4576-4948-80c3-e36913d2a9a7'}, {value: '96010c0d-0328-4d5f-a4e4-b8bb391a3882'}],
            accessionNumber:{value:'162086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
            notes: {value: '65a4cc8e-c27a-42d5-b9bf-e13674970d2a'},
            //sampleDate: {value: '2f9d00f5-d292-4d87-ab94-0abf2f2817c4'}, //we are not using the OBS, if we do, then you can use this concept
            resultDate: {value: '68d6bd27-37ff-4d7a-87a0-f5e0f9c8dcc0'},
            file: {value: '4cad2286-f66e-44c3-ba17-9665b569c13d'},
            statusCodes: [{label: 'All', value: '0'}, {label: 'Requested', value: '1'}, {
                label: 'Taken',
                value: '2'
            }, {label: 'Reported', value: '3'}, {label: 'Canceled', value: '4'}]
        };

        /*
         builds a list of LabTrackingOrder objects out of the results from an OpenMRS web service call
         @param webServiceResults - the results of the web service call
         @return LabTrackingOrder[]
         */
        LabTrackingOrder.buildList = function (webServiceResults) {
            var ret = [];

            for (var i = 0; i < webServiceResults.length; ++i) {
                var ord = LabTrackingOrder.fromWebServiceObject(webServiceResults[i]);
                ret.push(ord);
            }

            return ret;
        };

        /*
         creates a LabTracking order form a web service object
         @param webServiceResult - the web service object
         @return LabeTrackingOrder object
         */
        LabTrackingOrder.fromWebServiceObject = function (webServiceResult) {
            var order = new LabTrackingOrder();

            order.uuid = webServiceResult.uuid;
            order.orderNumber.value = webServiceResult.orderNumber;

            var procs = [];
            if (webServiceResult.encounter.obs != null && webServiceResult.encounter.obs.length > 0) {
                var obs = webServiceResult.encounter.obs;

                order.debug.orderEncounter = {
                    totalObs: obs.length,
                    //obs:obs
                };

                for (var i = 0; i < obs.length; ++i) {
                    var v = obs[i].value;
                    if (v != null) {
                        var conceptUuid = obs[i].concept.uuid;
                        if (obs[i].concept.uuid == LabTrackingOrder.concepts.procedure.value) {
                            procs.push({value: v.uuid, label: v.display, obsUuid: obs[i].uuid});
                        }
                        else if (_fromObsIfExists(order, 'procedureNonCoded', conceptUuid, v, obs[i].uuid)) {
                            //continue;
                        }
                    }
                }
            }
            order.procedures = procs;
            if (webServiceResult.orderReason != null) {
                order.preLabDiagnosis.value = webServiceResult.orderReason.uuid;
                order.preLabDiagnosis.label = webServiceResult.orderReason.display;
            }
            order.instructions.value = webServiceResult.instructions;
            order.clinicalHistory.value = webServiceResult.clinicalHistory;
            if (webServiceResult.careSetting) {
                order.careSetting.value = webServiceResult.careSetting.uuid;
            }

            order.encounter.value = webServiceResult.encounter.uuid;
            order.location.value = webServiceResult.encounter.location.uuid;
            order.location.label = webServiceResult.encounter.location.name;
            order.patient.value = webServiceResult.patient.person.uuid;
            order.patient.name = webServiceResult.patient.person.display;
            order.patient.id = webServiceResult.patient.identifiers[0].identifier;
            order.requestDate.value = new Date($filter('serverDate')(webServiceResult.dateActivated));

            if (webServiceResult.auditInfo != null && webServiceResult.auditInfo.voidedBy != null) {
                order.canceled = true;
            }

            order.status = calcStatus(order);


            //default this to the order values ---------------------------
            order.locationWhereSpecimenCollected = order.location;
            order.proceduresForSpecimen = [];
            order.procedureNonCodedForSpecimen.value = order.procedureNonCoded.value;
            order.postopDiagnosis.diagnosis.value = order.preLabDiagnosis.value;
            order.postopDiagnosis.diagnosis.label = order.preLabDiagnosis.label;
            order.clinicalHistoryForSpecimen.value = order.clinicalHistory.value;
            //----------------------------------------------------------------------

            return order;
        };

        /*
         updates a LabTracking order with details from a web service object
         @param webServiceResult - the web service object
         @param LabeTrackingOrder - the order to update with the details
         @return LabeTrackingOrder object
         */
        LabTrackingOrder.fromSpecimenCollectionEncounterWebServiceObject = function (webServiceResult, labTrackingOrder) {
            labTrackingOrder.sampleDate.value = new Date($filter('serverDate')(webServiceResult.encounterDatetime));
            labTrackingOrder.specimenDetailsEncounter.uuid = webServiceResult.uuid;

            if (webServiceResult.location != null) {
                labTrackingOrder.locationWhereSpecimenCollected.value = webServiceResult.location.uuid;
                labTrackingOrder.locationWhereSpecimenCollected.label = webServiceResult.location.name;
            }


            if (webServiceResult.obs != null && webServiceResult.obs.length > 0) {
                labTrackingOrder.debug.specimenDetails = {
                    totalObs: webServiceResult.obs.length,
                    //obs:webServiceResult.obs,
                };
                var obs = webServiceResult.obs;
                var procs = [];
                for (var i = 0; i < obs.length; ++i) {
                    var v = obs[i].value;

                    var groupMembers = obs[i].groupMembers; //this is used for obs construct sets
                    if (v != null || groupMembers != null) {
                        var vAsUuid = (v == null ? null : v.uuid);
                        var uuid = obs[i].uuid;
                        var conceptUuid = obs[i].concept.uuid;
                        if (_fromObsIfExists(labTrackingOrder, 'mdToNotify', conceptUuid, v, uuid)) {
                            //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'clinicalHistoryForSpecimen', conceptUuid, v, uuid)) {
                            //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'urgentReview', conceptUuid, vAsUuid, uuid)) {
                            //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'notes', conceptUuid, v, uuid)) {
                            //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'accessionNumber', conceptUuid, v, uuid)) {
                                //continue;
                        } else if (_fromObsIfExists(labTrackingOrder, 'procedureNonCodedForSpecimen', conceptUuid, v, uuid)) {
                            //continue;
                            //console.log(labTrackingOrder.procedureNonCodedForSpecimen);
                        } else if (conceptUuid == LabTrackingOrder.concepts.proceduresForSpecimen.value) {
                            procs.push({value: vAsUuid, label: v.display, obsUuid: uuid});
                        } else if (conceptUuid == LabTrackingOrder.concepts.postopDiagnosis.constructUuid) {
                            //the post diagnosis is a construct, so we need to handle that a little differently
                            labTrackingOrder.postopDiagnosis.groupMemmberParentUuid = uuid;
                            for (var j = 0; j < groupMembers.length; ++j) {
                                var obs2 = groupMembers[j];
                                var conceptUuid2 = obs2.concept.uuid;
                                if (conceptUuid2 == LabTrackingOrder.concepts.postopDiagnosis.value) {
                                    labTrackingOrder.postopDiagnosis.diagnosis.value = obs2.value.uuid;
                                    labTrackingOrder.postopDiagnosis.diagnosis.label = obs2.value.display;
                                    labTrackingOrder.postopDiagnosis.obsUuid = obs2.uuid;
                                }
                                else if (conceptUuid2 == LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONCEPT_UUID) {
                                    labTrackingOrder.postopDiagnosis.certainty.obsUuid = obs2.uuid;
                                }
                            }
                        }
                        else if (conceptUuid == LabTrackingOrder.concepts.resultDate.value) {
                            labTrackingOrder.resultDate.value = new Date($filter('serverDate')(v));
                            labTrackingOrder.resultDate.obsUuid = uuid;
                        }
                        //we are not using the OBS (just storing this as the encounter datetime), if we do, then you can use this concept
                       /* else if (conceptUuid == LabTrackingOrder.concepts.sampleDate.value) {
                            labTrackingOrder.sampleDate.value = new Date($filter('serverDate')(v));
                            labTrackingOrder.sampleDate.obsUuid = uuid;
                        }*/
                        else if (conceptUuid == LabTrackingOrder.concepts.file.value) {
                            var regex = /(.*)\/\/[^\/]+\//;  // hack to remove hostname and just use relative link to solve https://tickets.pih-emr.org/browse/UHM-3500
                            labTrackingOrder.file.url = v.links.uri.replace(regex, '/');
                            labTrackingOrder.file.obsUuid = uuid;
                        } else {

                            //finally update the specimen details
                            for (var j = 0; j < LabTrackingOrder.concepts.specimenDetails.length; ++j) {
                                if (conceptUuid == LabTrackingOrder.concepts.specimenDetails[j].value) {
                                    labTrackingOrder.specimenDetails[j].value = v;
                                    labTrackingOrder.specimenDetails[j].obsUuid = uuid;
                                    break;
                                }
                            }
                        }

                    }

                    if (procs.length > 0) {
                        labTrackingOrder.proceduresForSpecimen = procs;
                        labTrackingOrder.originalProceduresForSpecimen = procs.slice(0);
                    }

                }

                labTrackingOrder.status = calcStatus(labTrackingOrder);

                //var msg = "there are " + webServiceResult.encounterProviders.length + " providers, there ids are:\n";
                for (var i = 0; i < webServiceResult.encounterProviders.length; ++i) {
                    var p = webServiceResult.encounterProviders[i];
                    if (p.provider != null && p.provider.person != null) {
                        var nm = p.provider.person.display;
                        var uuid = p.provider.uuid;
                        // msg += p.uuid + " " + nm  + " role="  + p.encounterRole.uuid + "\n";
                        if (p.encounterRole.uuid == LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_SURGEON_ROLE) {
                            labTrackingOrder.surgeon.label = nm;
                            labTrackingOrder.surgeon.value = uuid;
                            labTrackingOrder.specimenDetailsEncounter.surgeonEncounterProviderUuid = p.uuid;
                        }
                        else if (p.encounterRole.uuid == LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_RESIDENT_ROLE) {
                            labTrackingOrder.resident.label = nm;
                            labTrackingOrder.resident.value = uuid;
                            labTrackingOrder.specimenDetailsEncounter.residentEncounterProviderUuid = p.uuid;
                        }
                    }
                }

                //keep tracking of the original surgeon/resident, so that we can tell if they have changed
                labTrackingOrder.orginalSurgeonAndResident = LabTrackingOrder.getEncounterProviders(labTrackingOrder);

            }

            return labTrackingOrder;
        };

        /*
         creates a web service object from a LabTrackingOrder object
         @param labTrackingOrder - the LabTrackingOrder object
         @param currentProviderUUID - the current provider UUID
         @return Object - the web service object
         */
        LabTrackingOrder.toWebServiceObject = function (labTrackingOrder, currentProviderUUID) {
            return {
                type: LabTrackingOrder.CONSTANTS.ORDER_TYPE,
                orderType: LabTrackingOrder.CONSTANTS.LAB_TRACKING_PATHOLOGY_ORDER_TYPE_UUID,
                patient: labTrackingOrder.patient.value,
                orderer: currentProviderUUID,
                concept: LabTrackingOrder.concepts.order.conceptUuid,
                careSetting: labTrackingOrder.careSetting.value,
                encounter: labTrackingOrder.encounter.value,
                orderReason: labTrackingOrder.preLabDiagnosis.value,
                instructions: labTrackingOrder.instructions.value,
                clinicalHistory: labTrackingOrder.clinicalHistory.value,
                dateActivated: labTrackingOrder.requestDate.value ? labTrackingOrder.requestDate.value : new Date() 
            };
        };


        /* creates the web service observations objects for
         the encounter associated with the test order
         @param labTrackingOrder - the order to create
         @param provider - the provider that created the order
         @return the Encounter as a WebService Object
         */
        LabTrackingOrder.toTestOrderEncounterWebServiceObject = function (labTrackingOrder, currentProviderUUID) {
            var obsIdsToDelete = [];
            var obs = [];
            for (var i = 0; i < labTrackingOrder.procedures.length; ++i) {
                var o = Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.procedure.value, labTrackingOrder.procedures[i].value, labTrackingOrder.procedures[i].obsUuid);
                obs.push(o);
            }

            if (_updateObsIfExists(labTrackingOrder, "procedureNonCoded", obs, obsIdsToDelete)) {
                //continue;
            }


            return new Encounter(LabTrackingOrder.concepts.order.encounterTypeUuid, currentProviderUUID, LabTrackingOrder.CONSTANTS.ORDER_ENCOUNTER_PROVIDER_ROLE_UUID,
                labTrackingOrder.patient.value, labTrackingOrder.location.value, obs, labTrackingOrder.requestDate.value, labTrackingOrder.visit.value);
        };


        /* creates the web service observations objects for
         the specimen collection encounter associated with the test order
         @param labTrackingOrder - the order to create
         @param provider - the provider that created the encounter
         @return the Encounter as a WebService Object
         */
        LabTrackingOrder.toSpecimenCollectionEncounterWebServiceObject = function (labTrackingOrder, currentProviderUUID) {
            var obsIdsToDelete = [];
            var obs = [];

            if (labTrackingOrder.specimenDetailsEncounter.uuid == null) {
                // we use the orderNumber to map the specimen encounter
                // we only need to save this the first time
                obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_ORDER_NUMBER,
                    labTrackingOrder.orderNumber.value, labTrackingOrder.orderNumber.obsUuid));
            }

            //standard text fields
            _updateObsIfExists(labTrackingOrder, "mdToNotify", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "clinicalHistoryForSpecimen", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "procedureNonCodedForSpecimen", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "notes", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "accessionNumber", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "urgentReview", obs, obsIdsToDelete);

            if (labTrackingOrder.postopDiagnosis.diagnosis.value != null && labTrackingOrder.postopDiagnosis.diagnosis.value.length > 0) {

                var v = [];
                v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.postopDiagnosis.value,
                    labTrackingOrder.postopDiagnosis.diagnosis.value,
                    labTrackingOrder.postopDiagnosis.obsUuid));
                v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONCEPT_UUID,
                    labTrackingOrder.postopDiagnosis.certainty.value,
                    labTrackingOrder.postopDiagnosis.certainty.obsUuid));

                var groupMembers = {
                    groupMembers: v,
                    concept: LabTrackingOrder.concepts.postopDiagnosis.constructUuid,
                    uuid: labTrackingOrder.postopDiagnosis.groupMemmberParentUuid
                };

                obs.push(groupMembers);
            }

            //we are not using the OBS (just storing it as the encounter datetime), if we do, then you can use this concept
           /* if (labTrackingOrder.sampleDate.value != null) {
                var dtAsStr = Encounter.formatDateTime(labTrackingOrder.sampleDate.value);
                obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.sampleDate.value, dtAsStr, labTrackingOrder.sampleDate.obsUuid));
            }
            else if (labTrackingOrder.sampleDate.obsUuid != null) {
                obsIdsToDelete.push(labTrackingOrder.sampleDate.obsUuid);
            }*/

            if (labTrackingOrder.resultDate.value != null) {
                var dtAsStr = Encounter.toObsDate(labTrackingOrder.resultDate.value);
                obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.resultDate.value, dtAsStr, labTrackingOrder.resultDate.obsUuid));
            }
            else if (labTrackingOrder.resultDate.obsUuid != null) {
                obsIdsToDelete.push(labTrackingOrder.resultDate.obsUuid);
            }


            //copy the procedures and keep track of the ones to delete
            for (var i = 0; i < labTrackingOrder.proceduresForSpecimen.length; ++i) {
                obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.proceduresForSpecimen.value,
                    labTrackingOrder.proceduresForSpecimen[i].value, labTrackingOrder.proceduresForSpecimen[i].obsUuid));
                for (var j = 0; j < labTrackingOrder.originalProceduresForSpecimen.length; ++j) {
                    if (labTrackingOrder.proceduresForSpecimen[i].value == labTrackingOrder.originalProceduresForSpecimen[j].value) {
                        //the procedure still exists, so we don't have to delete it, so remove it from this list
                        labTrackingOrder.originalProceduresForSpecimen.splice(j, 1);
                        break;
                    }
                }
            }
            //after we've added them all, delete the ones that don't exists anymore
            for (var j = 0; j < labTrackingOrder.originalProceduresForSpecimen.length; ++j) {
                obsIdsToDelete.push(labTrackingOrder.originalProceduresForSpecimen[j].obsUuid);
            }

            //iterate through the specimen details and update
            for (var i = 0; i < labTrackingOrder.specimenDetails.length; ++i) {
                var v = labTrackingOrder.specimenDetails[i].value;
                if (v != null && v.length > 0) {
                    var conceptUuid = LabTrackingOrder.concepts.specimenDetails[i].value;
                    obs.push(Encounter.toObsWebServiceObject(conceptUuid, v, labTrackingOrder.specimenDetails[i].obsUuid));
                }
                else {
                    if (labTrackingOrder.specimenDetails[i].obsUuid != null) {
                        obsIdsToDelete.push(labTrackingOrder.specimenDetails[i].obsUuid);
                    }
                }

            }

            if (labTrackingOrder.file.valueBase64 != null) {
                obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.file.value,
                    labTrackingOrder.file.valueBase64, labTrackingOrder.file.obsUuid));
                if (labTrackingOrder.file.obsUuid != null) {
                    //b/c of a bug in the web services, you cannot update a complex obs
                    //so just delete the existing id
                    //obsIdsToDelete.push(labTrackingOrder.file.obsUuid);
                }
            }


            var encounter = new Encounter(LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_CONCEPT_UUID, currentProviderUUID,
                LabTrackingOrder.CONSTANTS.ORDER_ENCOUNTER_PROVIDER_ROLE_UUID,
                labTrackingOrder.patient.value, labTrackingOrder.locationWhereSpecimenCollected.value, obs, labTrackingOrder.sampleDate.value, labTrackingOrder.visit.value);

            return {encounter: encounter, obsIdsToDelete: obsIdsToDelete};
        };


        /* checks whether a lab order providers has changed, see getEncounterProviders() for the objects
         * @param provider - the provider objects,
         * @param orginalSurgeonAndResident - the original provider objects
         * */
        LabTrackingOrder.haveProvidersChanged = function (provider, orginalSurgeonAndResident) {
            var ret = {surgeon: false, resident: false};

            if ((provider.surgeon == null && orginalSurgeonAndResident.surgeon != null)
                || (provider.surgeon != null && orginalSurgeonAndResident.surgeon == null)
                || (provider.surgeon != null && provider.surgeon.provider != orginalSurgeonAndResident.surgeon.provider)) {
                ret.surgeon = true;
            }
            if ((provider.resident == null && orginalSurgeonAndResident.resident != null)
                || (provider.resident != null && orginalSurgeonAndResident.resident == null)
                || (provider.resident != null && provider.resident.provider != orginalSurgeonAndResident.resident.provider)) {
                ret.resident = true;
            }

            return ret;
        };

        /*
         gets the providers for the order
         @param - the labtracking order
         @return - the surgeon and resident providers
         * */
        LabTrackingOrder.getEncounterProviders = function (labTrackingOrder) {
            var providers = {surgeon: null, resident: null};
            //the surgeon and resident are just providers for the encounter
            //encounter_provider.provider_id  using encounterRole="9b135b19-7ebe-4a51-aea2-69a53f9383af" and providerRoles="3182ee51-b895-4804-a342-5f261e995222,556ceee6-d899-43d4-a98b-7973ebc85b75"
            if (labTrackingOrder.surgeon != null && labTrackingOrder.surgeon.value != null) {
                providers.surgeon = Encounter.toEncounterProvider(labTrackingOrder.surgeon.value,
                    LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_SURGEON_ROLE);
            }

            if (labTrackingOrder.resident != null && labTrackingOrder.resident.value != null) {
                providers.resident = Encounter.toEncounterProvider(labTrackingOrder.resident.value,
                    LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_RESIDENT_ROLE);
            }

            return providers;
        };

        /* gets the Test Order status */
        function calcStatus(order) {
            var idx = 1;
            if (order.canceled && order.notes.value == null && order.file.url == null) {
                idx = 4;
            }
            else if (order.specimenDetailsEncounter.uuid) {
                if (order.resultDate.value) {
                    idx = 3
                }
                else {
                    idx = 2
                }
            }
            return LabTrackingOrder.concepts.statusCodes[idx];
        }

        /* reads from obs to a labtracking order
         * @param order - the order object
         * @param conceptUuid -the concept id you are looking for
         * @param v - the value of the obs
         * @param uuid - the uuid of the obs if it exists
         * @return true if updated, false if not
         * */
        function _fromObsIfExists(order, propName, conceptUuid, v, uuid) {
            if (conceptUuid == LabTrackingOrder.concepts[propName].value) {
                var p = order[propName];
                p.value = v;
                p.obsUuid = uuid;
                return true;
            }
            else {
                return false;
            }
        }

        /* adds to obs if the property is not empty
         * @param order - the order object
         * @param propName -the property to update
         * @param obs - the list of obs to add to if you have a valid value
         * @param obsIdsToDelete - a list of obs ids that are no longer valid and should be deleted
         * @return none
         * */
        function _updateObsIfExists(order, propName, obs, obsIdsToDelete) {
            var p = order[propName];
            var c = LabTrackingOrder.concepts[propName];
            if (p.value != null && p.value.length > 0) {
                obs.push(Encounter.toObsWebServiceObject(c.value, p.value, p.obsUuid));
            }
            else if (p.obsUuid != null) {
                //we need to delete this obs
                obsIdsToDelete.push(p.obsUuid);
            }
        }

        /**
         * Return the constructor function
         */
        return LabTrackingOrder;
    }]);
