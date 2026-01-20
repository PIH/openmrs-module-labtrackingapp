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
            DIAGNOSIS_CONCEPT_UUID: "226ed7ad-b776-4b99-966d-fd818d3302c2",
            LOCATION_OTHER_NON_CODED: "3cee7fb4-26fe-102b-80cb-0017a47871b2",
            SPECIMEN_SENT_CONSTRUCT: "4373a272-162e-4e20-91c0-e79b15defe15",
            SPECIMEN_SENT_TO_PAP: "97f23d65-664a-42ee-854b-443d88b308db",
            SPECIMEN_SENT_DATE:   "f4d0b62b-cbf9-4e6a-8a79-b291f82ae53c",
            SPECIMEN_RETURN_DATE: "c19867c0-fec9-404c-bf25-6cf7a8c54eb7",
            LAB_PAP_LOCATION:     "e9732df4-971d-4a9a-9129-e2e610552468",
            YES: "3cd6f600-26fe-102b-80cb-0017a47871b2",
            NO: "3cd6f86c-26fe-102b-80cb-0017a47871b2"
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
            this.provider = { label: null, value: null };
            this.specimenDetailsEncounter = {
                uuid: null,
                surgeonEncounterProviderUuid: null,
                residentEncounterProviderUuid: null
            };  // used to keep track of whether to create/update the details
            this.orderNumber = {value: null};
            this.preLabDiagnosis = {label: null, value: null};
            this.postopDiagnosis = {
                obsUuid: null,
                groupMemmberParentUuid: null,
                diagnosis: {label: null, value: null},
                certainty: {value: LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONFIRMED}
            };
            this.confirmedDiagnosis = {
              obsUuid: null,
              groupMemmberParentUuid: null,
              diagnosis: {label: null, value: null},
              certainty: {value: LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONFIRMED}
            };
            this.specimenSentToPaP = {
              obsUuid: null,
              groupMemmberParentUuid: null,
              specimenSent: { value: false},
              dateSent: { value: null},
              dateReturned: { value: null },
              labPaPLocation: { value: LabTrackingOrder.CONSTANTS.LOCATION_OTHER_NON_CODED }
            };
            this.procedures = [];  //this is an array of values
            this.procedureNonCoded = {value: null};
            this.instructions = {value: ""};
            this.clinicalHistory = {value: ""};
            this.specimenDetails = [{value: "", obsUuid: null}, {value: "", obsUuid: null},
                {value: "", obsUuid: null}, {value: "", obsUuid: null},
                {value: "", obsUuid: null}, {value: "", obsUuid: null},
                {value: "", obsUuid: null}, {value: "", obsUuid: null}];
            this.clinicalHistoryForSpecimen = {value: ""};
            this.proceduresForSpecimen = [];  //this is an array of values
            this.originalProceduresForSpecimen = [];  //this is an array of values
            this.procedureNonCodedForSpecimen = {value: null};
            this.careSetting = {label: "", value: '6f0c9a92-6f24-11e3-af88-005056821db0'};
            this.encounter = {value: null}; //this stores the encounter id for the order
            this.locationWhereSpecimenCollected = {value: null};
            this.surgeon = {value: null, label: null};
            this.resident = {value: null, label: null};
            this.orginalSurgeonAndResident = {surgeon: null, resident: null, provider: null};
            this.mdToNotify = {value: null};
            this.phoneNumberForClinician = { value: null };
            this.urgentReview = {value: false};
            this.suspectedCancer = { value: false };
            this.confirmedCancer = { value: false };
            this.immunohistochemistryNeeded = { value: false };
            this.immunohistochemistrySentToBoston = { value: false };
            this.dateImmunoSentToBoston = { value: null };
            this.accessionNumber = {value:null};
            this.status = {label: null, value: null};
            this.sampleDate = {value: null};
            this.processedDate = { value: null };
            this.resultDate = {value: null, obsUuid: null};
            this.notes = {value: null};
            this.files = []; // array of files
            this.serverDatetime = null;
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
            preLabDiagnosis: {value: LabTrackingOrder.CONSTANTS.DIAGNOSIS_CONCEPT_UUID},
            postopDiagnosis: {
                value: LabTrackingOrder.CONSTANTS.DIAGNOSIS_CONCEPT_UUID,
                nonCodedValue: '970d41ce-5098-47a4-8872-4dd843c0df3f',
                constructUuid: '2da3ec67-62aa-4be8-a32c-cb32723742c8'
            },
            confirmedDiagnosis: {
              value: LabTrackingOrder.CONSTANTS.DIAGNOSIS_CONCEPT_UUID,
              nonCodedValue: '970d41ce-5098-47a4-8872-4dd843c0df3f',
              constructUuid: '39180297-6499-4bdc-8bbb-5870a5fab19d'
            },
            specimenSentToPaP: {
              constructUuid: LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_CONSTRUCT,
              specimenSentToPaPValue: LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_TO_PAP,
              dateSentValue: LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_DATE,
              dateReturnValue: LabTrackingOrder.CONSTANTS.SPECIMEN_RETURN_DATE,
              labPaPLocationValue: LabTrackingOrder.CONSTANTS.LAB_PAP_LOCATION
            },
            procedure: {value: 'd6d585b6-4887-4aac-8361-424c17b030f2'},
            procedureNonCoded: {value: '823242df-e317-4426-9bd6-548146546b15'},
            proceduresForSpecimen: {value: 'd2a8e2d1-88f9-45f9-9511-4ac5df877340'},
            procedureNonCodedForSpecimen: {value: '2ccfa5d8-b2a0-4ff0-9d87-c2471ef069f4'},
            urgentReview: {value: '9e4b6acc-ab97-4ecd-a48c-b3d67e5ef778'},
            suspectedCancer: { value: 'd0718b9e-31e3-4bc8-a8d3-cfc5cc1ae2cb'},
            confirmedCancer: { value: '5773fb74-8c4f-41b7-ac41-3c6eeae3939f'},
            immunohistochemistryNeeded: { value: '237dbbf8-b654-4fed-8c09-b130d35879ac'},
            immunohistochemistrySentToBoston: { value: '3ae1ac7c-fe6b-4c49-9150-f5047178a43e'},
            dateImmunoSentToBoston: { value: 'f4d0b62b-cbf9-4e6a-8a79-b291f82ae53c'}, //PIH:14239
            clinicalHistoryForSpecimen: {value: '160221AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
            mdToNotify: {value: 'a787e577-5e32-42dc-b3a8-e4c6d5b107f5'},
            specimenDetails: [{value: '7d557ddc-eca3-421e-98ae-5469a1ecba4d'}, {value: 'a6f54c87-a6aa-4312-bbc9-1346842a7f3f'},
                {value: '873d2496-4576-4948-80c3-e36913d2a9a7'}, {value: '96010c0d-0328-4d5f-a4e4-b8bb391a3882'},
                {value: '9c79f6ba-3331-44e9-9f64-2b951825dc06'}, {value: '468ef788-c7e2-4a17-9344-60989a77134c'},
                {value: '6ec3616f-4f0e-46f0-b479-68b28f887a52'}, {value: '124ca694-b184-4ada-b6d2-b575b662d9f3'}],
            accessionNumber:{value:'162086AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
            phoneNumberForClinician: { value:'f51531c0-e3f6-4611-9a32-d709551307a7' },
            orderNumber: { value: LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_ORDER_NUMBER },
            notes: {value: '65a4cc8e-c27a-42d5-b9bf-e13674970d2a'},
            //sampleDate: {value: '2f9d00f5-d292-4d87-ab94-0abf2f2817c4'}, //we are not using the OBS, if we do, then you can use this concept
            processedDate: {value: '160715AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'}, //CIEL:160715
            resultDate: {value: '68d6bd27-37ff-4d7a-87a0-f5e0f9c8dcc0'},
            file: {value: '4cad2286-f66e-44c3-ba17-9665b569c13d'},
            statusCodes: [
                {
                    label: 'All',
                    value: '0'
                },
                {
                    label: 'Requested',
                    value: '1'
                },
                {
                    label: 'Processed',
                    value: '2'
                },
                {
                    label: 'Reported',
                    value: '3'
                },
                {
                    label: 'Canceled',
                    value: '4'
                }]
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

      /**
       * update LabTracking order from the REST order response
       * @param webServiceResult - the REST response from the /order web service
       * @return LabeTrackingOrder object
       */
        LabTrackingOrder.updateOrderFromRestResponse = function( labTrackingOrder, webServiceResult ) {

          labTrackingOrder.uuid = webServiceResult.uuid;
          labTrackingOrder.orderNumber.value = webServiceResult.orderNumber;
          labTrackingOrder.status = calcStatus(labTrackingOrder);
          if (webServiceResult.careSetting) {
            labTrackingOrder.careSetting.value = webServiceResult.careSetting.uuid;
            labTrackingOrder.careSetting.label = webServiceResult.careSetting.display;
          }
          if ( !labTrackingOrder.locationWhereSpecimenCollected.value) {
            labTrackingOrder.locationWhereSpecimenCollected= labTrackingOrder.location;
          }
          return labTrackingOrder;
        }

      /*
       creates a LabTracking order form an Encounter REST response
       @param webServiceResult - the web service object
       @return LabTrackingOrder object
       */
      LabTrackingOrder.fromEncounterRestObject = function (webServiceResult) {
        var order = new LabTrackingOrder();

        order.sampleDate.value = new Date(webServiceResult.encounterDatetime);
        order.specimenDetailsEncounter.uuid = webServiceResult.uuid;

        order.encounter.value = webServiceResult.uuid;
        if ( webServiceResult.location ) {
          order.location.value = webServiceResult.location.uuid;
          order.location.label = webServiceResult.location.name;
        }

        order.patient.value = webServiceResult.patient.person.uuid;
        order.patient.name = webServiceResult.patient.person.display;
        order.patient.id = webServiceResult.patient.identifiers[0].identifier;

        // there is only one order associated with this encounter
        var encounterOrder = (webServiceResult.orders && webServiceResult.orders.length > 0) ? webServiceResult.orders[0] : null;
        if ( encounterOrder ) {
          order.uuid = encounterOrder.uuid;
          order.orderNumber.value = encounterOrder.orderNumber;
          order.specimenDetailsEncounter.orderNumber = encounterOrder.orderNumber;

          if (encounterOrder.orderReason != null) {
            order.preLabDiagnosis.value = encounterOrder.orderReason.uuid;
            order.preLabDiagnosis.label = encounterOrder.orderReason.display;
          }
          else if (encounterOrder.orderReasonNonCoded != null) {
            order.preLabDiagnosis = encounterOrder.orderReasonNonCoded;
          }
          order.instructions.value = encounterOrder.instructions;
          order.clinicalHistory.value = encounterOrder.clinicalHistory;
          if (encounterOrder.careSetting) {
            order.careSetting.value = encounterOrder.careSetting.uuid;
            order.careSetting.label = encounterOrder.careSetting.display;
          }

          if (encounterOrder.voided == true) {
            order.canceled = true;
          }
        }

        //default this to the order values ---------------------------
        order.locationWhereSpecimenCollected = order.location;

        if (typeof order.preLabDiagnosis === 'object') {
          order.postopDiagnosis.diagnosis = { ...order.preLabDiagnosis }   // clone, don't copy reference
        } else {
          order.postopDiagnosis.diagnosis = order.preLabDiagnosis;
        }
        order.clinicalHistoryForSpecimen.value = order.clinicalHistory.value;
        //----------------------------------------------------------------------

        var procs = [];
        if (webServiceResult.obs != null && webServiceResult.obs.length > 0) {
          var obs = webServiceResult.obs;

          order.debug.orderEncounter = {
            totalObs: obs.length,
          };
          order.debug.specimenDetails = {
            totalObs: obs.length,
          };

          for (var i = 0; i < obs.length; i++) {

            var groupMembers = obs[i].groupMembers;
            if (obs[i] != null || groupMembers != null) {

              var uuid = obs[i].uuid;
              var conceptUuid = obs[i].concept.uuid;
              if (_extractObsValue(order, 'mdToNotify', conceptUuid, obs[i], uuid)) {
                //continue;
              }
              if (_extractObsValue(order, 'phoneNumberForClinician', conceptUuid, obs[i], uuid)) {
                //continue;
              }
              else if (_extractObsValue(order, 'clinicalHistoryForSpecimen', conceptUuid, obs[i], uuid)) {
                //continue;
              }
              else if (_extractObsValue(order, 'urgentReview', conceptUuid, obs[i], uuid)) {
                //continue;
              }
              else if (_extractObsValue(order, 'suspectedCancer', conceptUuid, obs[i], uuid)) {
                //continue;
              }
              else if (_extractObsValue(order, 'confirmedCancer', conceptUuid, obs[i], uuid)) {
                //continue;
              }
              else if (_extractObsValue(order, 'immunohistochemistryNeeded', conceptUuid, obs[i], uuid)) {
                //continue;
              }
              else if (_extractObsValue(order, 'immunohistochemistrySentToBoston', conceptUuid, obs[i], uuid)) {
                //continue;
              }
              else if (_extractObsValue(order, 'notes', conceptUuid, obs[i], uuid)) {
                //continue;
              }
              else if (_extractObsValue(order, 'accessionNumber', conceptUuid, obs[i], uuid)) {
                //continue;
              } else if (_extractObsValue(order, 'procedureNonCoded', conceptUuid, obs[i], uuid)) {
                //continue
              } else if (_extractObsValue(order, 'procedureNonCodedForSpecimen', conceptUuid, obs[i], uuid)) {
                //continue
              } else if (conceptUuid == LabTrackingOrder.concepts.proceduresForSpecimen.value) {
                procs.push({
                  value: obs[i].valueCoded.uuid,
                  label: obs[i].valueCoded.display,
                  obsUuid: uuid
                });
              } else if ( conceptUuid == LabTrackingOrder.concepts.postopDiagnosis.constructUuid ) {
                //the post diagnosis is a construct, so we need to handle that a little differently
                order.postopDiagnosis.groupMemmberParentUuid = uuid;
                for (var j = 0; j < groupMembers.length; j++) {
                  var grpObs = groupMembers[j];
                  var grpObsConceptUuid = grpObs.concept.uuid;
                  if (grpObsConceptUuid == LabTrackingOrder.concepts.postopDiagnosis.value) {
                    order.postopDiagnosis.diagnosis = {
                        value: grpObs.valueCoded.uuid,
                        label: grpObs.valueCoded.display
                    };
                    order.postopDiagnosis.originalType = 'coded';
                    order.postopDiagnosis.obsUuid = grpObs.uuid;
                  }
                  else if (grpObsConceptUuid == LabTrackingOrder.concepts.postopDiagnosis.nonCodedValue) {
                    order.postopDiagnosis.diagnosis = grpObs.valueText;
                    order.postopDiagnosis.originalType = 'nonCoded';
                    order.postopDiagnosis.obsUuid = grpObs.uuid;
                  }
                  else if (grpObsConceptUuid == LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONCEPT_UUID) {
                    order.postopDiagnosis.certainty.obsUuid = grpObs.uuid;
                  }
                }
              } else if ( conceptUuid == LabTrackingOrder.concepts.confirmedDiagnosis.constructUuid ) {
                //the post diagnosis is a construct, so we need to handle that a little differently
                order.confirmedDiagnosis.groupMemmberParentUuid = uuid;
                for (var j = 0; j < groupMembers.length; j++) {
                  var grpObs = groupMembers[j];
                  var grpObsConceptUuid = grpObs.concept.uuid;
                  if (grpObsConceptUuid == LabTrackingOrder.concepts.confirmedDiagnosis.value) {
                    order.confirmedDiagnosis.diagnosis = {
                      value: grpObs.valueCoded.uuid,
                      label: grpObs.valueCoded.display
                    };
                    order.confirmedDiagnosis.originalType = 'coded';
                    order.confirmedDiagnosis.obsUuid = grpObs.uuid;
                  }
                  else if (grpObsConceptUuid == LabTrackingOrder.concepts.confirmedDiagnosis.nonCodedValue) {
                    order.confirmedDiagnosis.diagnosis = grpObs.valueText;
                    order.confirmedDiagnosis.originalType = 'nonCoded';
                    order.confirmedDiagnosis.obsUuid = grpObs.uuid;
                  }
                  else if (grpObsConceptUuid == LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONCEPT_UUID) {
                    order.confirmedDiagnosis.certainty.obsUuid = grpObs.uuid;
                  }
                }
              } else if ( conceptUuid == LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_CONSTRUCT ) {
                //the specimen sent to PaP is a construct
                order.specimenSentToPaP.groupMemmberParentUuid = uuid;
                for (var j = 0; j < groupMembers.length; j++) {
                  var grpObs = groupMembers[j];
                  var grpObsConceptUuid = grpObs.concept.uuid;
                  if (grpObsConceptUuid == LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_TO_PAP) {
                    order.specimenSentToPaP.specimenSent = {
                      value: grpObs.valueCoded.uuid,
                      label: grpObs.valueCoded.display
                    };
                    order.specimenSentToPaP.specimenSent.obsUuid = grpObs.uuid;
                  }
                  else if (grpObsConceptUuid == LabTrackingOrder.CONSTANTS.LAB_PAP_LOCATION) {
                    order.specimenSentToPaP.labPaPLocation.value = grpObs.valueCoded.uuid;
                    order.specimenSentToPaP.labPaPLocation.obsUuid = grpObs.uuid;
                  }
                  else if (grpObsConceptUuid == LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_DATE) {
                    order.specimenSentToPaP.dateSent.value = new Date(grpObs.valueDatetime);
                    order.specimenSentToPaP.dateSent.obsUuid = grpObs.uuid;
                  } else if (grpObsConceptUuid == LabTrackingOrder.CONSTANTS.SPECIMEN_RETURN_DATE) {
                    order.specimenSentToPaP.dateReturned.value = new Date(grpObs.valueDatetime);
                    order.specimenSentToPaP.dateReturned.obsUuid = grpObs.uuid;
                  }
                }
              }
              else if (conceptUuid == LabTrackingOrder.concepts.resultDate.value) {
                order.resultDate.value = new Date(obs[i].valueDatetime);
                order.resultDate.obsUuid = uuid;
              }
              else if (conceptUuid == LabTrackingOrder.concepts.processedDate.value) {
                order.processedDate.value = new Date(obs[i].valueDatetime);
                order.processedDate.obsUuid = uuid;
              }
              else if (conceptUuid == LabTrackingOrder.concepts.dateImmunoSentToBoston.value) {
                order.dateImmunoSentToBoston.value = new Date(obs[i].valueDatetime);
                order.dateImmunoSentToBoston.obsUuid = uuid;
              }
              else if (conceptUuid == LabTrackingOrder.concepts.file.value) {
                let fileObs = {
                  url: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/obs/" + uuid + "/value",
                  obsUuid: uuid,
                  label: obs[i].comment,
                };
                order.files.push(fileObs);
              } else {

                //finally update the specimen details
                for (var j = 0; j < LabTrackingOrder.concepts.specimenDetails.length; ++j) {
                  if (conceptUuid == LabTrackingOrder.concepts.specimenDetails[j].value) {
                    order.specimenDetails[j].value = obs[i].valueText;
                    order.specimenDetails[j].obsUuid = uuid;
                    break;
                  }
                }
              }

            }
          }
        }

        order.procedures = procs;
        if (procs.length > 0) {
          order.proceduresForSpecimen = procs;
          order.originalProceduresForSpecimen = procs.slice(0);
        }
        order.procedureNonCodedForSpecimen.value = order.procedureNonCoded.value;

        order.status = calcStatus(order);

        if ( webServiceResult.visit && webServiceResult.visit.uuid ) {
          order.visit.value = webServiceResult.visit.uuid;
        }

        for (var i = 0; i < webServiceResult.encounterProviders.length; i++) {
          var p = webServiceResult.encounterProviders[i];
          if (p.provider != null && p.provider.person != null) {
            var name = p.provider.person.display;
            var uuid = p.provider.uuid;
            if (p.encounterRole.uuid == LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_SURGEON_ROLE) {
              order.surgeon.label = name;
              order.surgeon.value = uuid;
              order.specimenDetailsEncounter.surgeonEncounterProviderUuid = p.uuid;
            }
            else if (p.encounterRole.uuid == LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_RESIDENT_ROLE) {
              order.resident.label = name;
              order.resident.value = uuid;
              order.specimenDetailsEncounter.residentEncounterProviderUuid = p.uuid;
            } else if (p.encounterRole.uuid == LabTrackingOrder.CONSTANTS.ORDER_ENCOUNTER_PROVIDER_ROLE_UUID) {
              order.provider.label = name;
              order.provider.value = uuid;
              order.specimenDetailsEncounter.encounterProviderUuid = p.uuid;
            }
          }
        }

        return order;
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
                        } else if (_fromObsIfExists(order, 'orderNumber', conceptUuid, v, obs[i].uuid)) {
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
            else if (webServiceResult.orderReasonNonCoded != null) {
                order.preLabDiagnosis = webServiceResult.orderReasonNonCoded;
            }
            order.instructions.value = webServiceResult.instructions;
            order.clinicalHistory.value = webServiceResult.clinicalHistory;
            if (webServiceResult.careSetting) {
                order.careSetting.value = webServiceResult.careSetting.uuid;
                order.careSetting.label = webServiceResult.careSetting.display;
            }

            order.encounter.value = webServiceResult.encounter.uuid;
            if ( webServiceResult.encounter.location ) {
              order.location.value = webServiceResult.encounter.location.uuid;
              order.location.label = webServiceResult.encounter.location.name;
            }

            order.patient.value = webServiceResult.patient.person.uuid;
            order.patient.name = webServiceResult.patient.person.display;
            order.patient.id = webServiceResult.patient.identifiers[0].identifier;
            order.sampleDate.value = new Date(webServiceResult.dateActivated);

            if (webServiceResult.auditInfo != null && webServiceResult.auditInfo.voidedBy != null) {
                order.canceled = true;
            }

            order.status = calcStatus(order);


            //default this to the order values ---------------------------
            order.locationWhereSpecimenCollected = order.location;
            order.proceduresForSpecimen = [];
            order.procedureNonCodedForSpecimen.value = order.procedureNonCoded.value;
            if (typeof order.preLabDiagnosis === 'object') {
              order.postopDiagnosis.diagnosis = { ...order.preLabDiagnosis }   // clone, don't copy reference
            }
            else {
              order.postopDiagnosis.diagnosis = order.preLabDiagnosis;
            }
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

            // if there *is* a specimen collection encounter for this object, we want to clear out any defaults that may have been set from the order
            // (see "default this to the order values" section of LabTrackingOrder.fromWebServiceObject)
            labTrackingOrder.locationWhereSpecimenCollected = {value: null};
            labTrackingOrder.proceduresForSpecimen = [];
            labTrackingOrder.procedureNonCodedForSpecimen = {value: null};
            labTrackingOrder.clinicalHistoryForSpecimen = {value: ""};
            labTrackingOrder.postopDiagnosis.diagnosis = {label: null, value: null};
            labTrackingOrder.confirmedDiagnosis.diagnosis = {label: null, value: null};
            this.specimenSentToPaP = {
              obsUuid: null,
              groupMemmberParentUuid: null,
              specimenSent: { value: false},
              dateSent: { value: null},
              dateReturned: { value: null },
              labPaPLocation: { value: null }
            };

            // now start setting values based on encounter
            labTrackingOrder.sampleDate.value = new Date(webServiceResult.encounterDatetime);
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
                        if (_fromObsIfExists(labTrackingOrder, 'phoneNumberForClinician', conceptUuid, v, uuid)) {
                            //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'clinicalHistoryForSpecimen', conceptUuid, v, uuid)) {
                            //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'urgentReview', conceptUuid, vAsUuid, uuid)) {
                            //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'suspectedCancer', conceptUuid, vAsUuid, uuid)) {
                          //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'confirmedCancer', conceptUuid, vAsUuid, uuid)) {
                          //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'immunohistochemistryNeeded', conceptUuid, vAsUuid, uuid)) {
                          //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'immunohistochemistrySentToBoston', conceptUuid, vAsUuid, uuid)) {
                          //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'notes', conceptUuid, v, uuid)) {
                            //continue;
                        }
                        else if (_fromObsIfExists(labTrackingOrder, 'accessionNumber', conceptUuid, v, uuid)) {
                                //continue;
                        } else if (_fromObsIfExists(labTrackingOrder, 'orderNumber', conceptUuid, v, uuid)) {
                          //update labTrackingOrder.specimenDetailsEncounter
                          labTrackingOrder.specimenDetailsEncounter.orderNumber = v;
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
                                    labTrackingOrder.postopDiagnosis.diagnosis = { value: obs2.value.uuid, label: obs2.value.display };
                                    labTrackingOrder.postopDiagnosis.originalType = 'coded';
                                    labTrackingOrder.postopDiagnosis.obsUuid = obs2.uuid;
                                }
                                else if (conceptUuid2 == LabTrackingOrder.concepts.postopDiagnosis.nonCodedValue) {
                                    labTrackingOrder.postopDiagnosis.diagnosis = obs2.value;
                                    labTrackingOrder.postopDiagnosis.originalType = 'nonCoded';
                                    labTrackingOrder.postopDiagnosis.obsUuid = obs2.uuid;
                                }
                                else if (conceptUuid2 == LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONCEPT_UUID) {
                                    labTrackingOrder.postopDiagnosis.certainty.obsUuid = obs2.uuid;
                                }
                            }
                        } else if (conceptUuid == LabTrackingOrder.concepts.confirmedDiagnosis.constructUuid) {
                          labTrackingOrder.confirmedDiagnosis.groupMemmberParentUuid = uuid;
                          for (var j = 0; j < groupMembers.length; ++j) {
                            var obs2 = groupMembers[j];
                            var conceptUuid2 = obs2.concept.uuid;
                            if (conceptUuid2 == LabTrackingOrder.concepts.confirmedDiagnosis.value) {
                              labTrackingOrder.confirmedDiagnosis.diagnosis = { value: obs2.value.uuid, label: obs2.value.display };
                              labTrackingOrder.confirmedDiagnosis.originalType = 'coded';
                              labTrackingOrder.confirmedDiagnosis.obsUuid = obs2.uuid;
                            }
                            else if (conceptUuid2 == LabTrackingOrder.concepts.confirmedDiagnosis.nonCodedValue) {
                              labTrackingOrder.confirmedDiagnosis.diagnosis = obs2.value;
                              labTrackingOrder.confirmedDiagnosis.originalType = 'nonCoded';
                              labTrackingOrder.confirmedDiagnosis.obsUuid = obs2.uuid;
                            }
                            else if (conceptUuid2 == LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONCEPT_UUID) {
                              labTrackingOrder.confirmedDiagnosis.certainty.obsUuid = obs2.uuid;
                            }
                          }
                        } else if (conceptUuid == LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_CONSTRUCT) {
                          //the Specimen sent to PaP is a construct
                          labTrackingOrder.specimenSentToPaP.groupMemmberParentUuid = uuid;
                          for (var j = 0; j < groupMembers.length; ++j) {
                            var obs2 = groupMembers[j];
                            var conceptUuid2 = obs2.concept.uuid;
                            if ( conceptUuid2 == LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_TO_PAP ) {
                              labTrackingOrder.specimenSentToPaP.specimenSent.value = obs2.value.uuid;
                              labTrackingOrder.specimenSentToPaP.specimenSent.label = obs2.value.display;
                              labTrackingOrder.specimenSentToPaP.specimenSent.obsUuid = obs2.uuid;
                            }
                            else if ( conceptUuid2 == LabTrackingOrder.CONSTANTS.LAB_PAP_LOCATION ) {
                              labTrackingOrder.specimenSentToPaP.labPaPLocation.value = obs2.value.uuid;
                              labTrackingOrder.specimenSentToPaP.labPaPLocation.obsUuid = obs2.uuid;
                            }
                            else if ( conceptUuid2 == LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_DATE ) {
                              labTrackingOrder.specimenSentToPaP.dateSent.value = new Date(obs2.value);
                              labTrackingOrder.specimenSentToPaP.dateSent.obsUuid = obs2.uuid;
                            } else if ( conceptUuid2 == LabTrackingOrder.CONSTANTS.SPECIMEN_RETURN_DATE ) {
                              labTrackingOrder.specimenSentToPaP.dateReturned.value = new Date(obs2.value);
                              labTrackingOrder.specimenSentToPaP.dateReturned.obsUuid = obs2.uuid;
                            }
                          }
                        }
                        else if (conceptUuid == LabTrackingOrder.concepts.resultDate.value) {
                            labTrackingOrder.resultDate.value = new Date(v);
                            labTrackingOrder.resultDate.obsUuid = uuid;
                        }
                       else if (conceptUuid == LabTrackingOrder.concepts.processedDate.value) {
                            labTrackingOrder.processedDate.value = _constructDateFromWebServiceDateString(v);
                            labTrackingOrder.processedDate.obsUuid = uuid;
                        }
                        else if (conceptUuid == LabTrackingOrder.concepts.dateImmunoSentToBoston.value) {
                          labTrackingOrder.dateImmunoSentToBoston.value = new Date(v);
                          labTrackingOrder.dateImmunoSentToBoston.obsUuid = uuid;
                        }
                        else if (conceptUuid == LabTrackingOrder.concepts.file.value) {
                            var regex = /(.*)\/\/[^\/]+\//;  // hack to remove hostname and just use relative link to solve https://tickets.pih-emr.org/browse/UHM-3500
                            labTrackingOrder.files.push({
                              url: v.links.uri.replace(regex, '/'),
                              obsUuid: uuid,
                              label: obs[i].comment
                            });
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
                        } else if (p.encounterRole.uuid == LabTrackingOrder.CONSTANTS.ORDER_ENCOUNTER_PROVIDER_ROLE_UUID) {
                          labTrackingOrder.provider.label = nm;
                          labTrackingOrder.provider.value = uuid;
                          labTrackingOrder.specimenDetailsEncounter.encounterProviderUuid = p.uuid;
                        }
                    }
                }

                //keep tracking of the original surgeon/resident, so that we can tell if they have changed
                labTrackingOrder.orginalSurgeonAndResident = LabTrackingOrder.getEncounterProviders(labTrackingOrder);

            }
            if ( webServiceResult.visit && webServiceResult.visit.uuid ) {
              labTrackingOrder.visit.value = webServiceResult.visit.uuid;
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
                orderReason: labTrackingOrder.preLabDiagnosis !== null && typeof labTrackingOrder.preLabDiagnosis === 'object' ? labTrackingOrder.preLabDiagnosis.value : null,
                orderReasonNonCoded: labTrackingOrder.preLabDiagnosis !== null && typeof labTrackingOrder.preLabDiagnosis === 'string' ? labTrackingOrder.preLabDiagnosis : null,
                instructions: labTrackingOrder.instructions.value,
                clinicalHistory: labTrackingOrder.clinicalHistory.value,
                dateActivated: labTrackingOrder.sampleDate.value ? labTrackingOrder.sampleDate.value : new Date()
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
                labTrackingOrder.patient.value, labTrackingOrder.location.value, obs, labTrackingOrder.sampleDate.value, labTrackingOrder.visit.value);
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

            if ( labTrackingOrder.specimenDetailsEncounter && labTrackingOrder.specimenDetailsEncounter.orderNumber == null) {
                // we use the orderNumber to map the specimen encounter
                // we only need to save this the first time
                if ( labTrackingOrder.orderNumber && labTrackingOrder.orderNumber.value && labTrackingOrder.orderNumber.value.length > 0 ) {
                  obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_ORDER_NUMBER,
                    labTrackingOrder.orderNumber.value, labTrackingOrder.orderNumber.obsUuid));
                }
            }

            //standard text fields
            _updateObsIfExists(labTrackingOrder, "mdToNotify", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "phoneNumberForClinician", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "clinicalHistoryForSpecimen", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "procedureNonCodedForSpecimen", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "procedureNonCoded", obs, obsIdsToDelete)
            _updateObsIfExists(labTrackingOrder, "notes", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "accessionNumber", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "orderNumber", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "urgentReview", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "suspectedCancer", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "confirmedCancer", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "immunohistochemistryNeeded", obs, obsIdsToDelete);
            _updateObsIfExists(labTrackingOrder, "immunohistochemistrySentToBoston", obs, obsIdsToDelete);


            // special case for post-op diagnosis obs group.. this first block tests if a postop diagnosis (either coded or string) has been specified
            if (((labTrackingOrder.postopDiagnosis.diagnosis !== null
                && typeof labTrackingOrder.postopDiagnosis.diagnosis === 'object'
                && labTrackingOrder.postopDiagnosis.diagnosis.value === null)     // it's an object, but value is null
                || labTrackingOrder.postopDiagnosis.diagnosis === null
                || labTrackingOrder.postopDiagnosis.diagnosis.length === 0)) {    // not an object, and null or empty
                // if no post-op diagnosis specified, but there's an existing value, we need to delete the whole existing obs group
                if (labTrackingOrder.postopDiagnosis.groupMemmberParentUuid !== null) {
                  obsIdsToDelete.push(labTrackingOrder.postopDiagnosis.groupMemmberParentUuid);
                }
            }
            else {
                // a post-op diagnosis value has been entered
                var v = [];

                if (typeof labTrackingOrder.postopDiagnosis.diagnosis === 'object') {
                  // coded obs
                  if (labTrackingOrder.postopDiagnosis.obsUuid === null || labTrackingOrder.postopDiagnosis.originalType === 'coded') {
                    // if there's no existing obs (obsUuid === null) or the existing type was coded, just create/update
                    v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.postopDiagnosis.value,
                      labTrackingOrder.postopDiagnosis.diagnosis.value,
                      labTrackingOrder.postopDiagnosis.obsUuid));
                  }
                  else {
                    // otherwise, we need to void the existing and create new obs (since there's funky behavior when updating the concept_id of an obs)
                    v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.postopDiagnosis.value,
                      labTrackingOrder.postopDiagnosis.diagnosis.value, null));
                    obsIdsToDelete.push(labTrackingOrder.postopDiagnosis.obsUuid);
                  }
                }
                else {
                  // else, non-coded obs
                  if (labTrackingOrder.postopDiagnosis.obsUuid === null || labTrackingOrder.postopDiagnosis.originalType === 'nonCoded') {
                    // if there's no existing obs (obsUuid === null) or the existing type was coded, just create/update
                    v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.postopDiagnosis.nonCodedValue,
                      labTrackingOrder.postopDiagnosis.diagnosis,
                      labTrackingOrder.postopDiagnosis.obsUuid));
                  }
                  else {
                    // otherwise, we need to void the existing and create new obs (since there's funky behavior when updating the concept_id of an obs)
                    v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.postopDiagnosis.nonCodedValue,
                      labTrackingOrder.postopDiagnosis.diagnosis, null));
                    obsIdsToDelete.push(labTrackingOrder.postopDiagnosis.obsUuid);
                  }
                }

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

          if (((labTrackingOrder.confirmedDiagnosis.diagnosis !== null
              && typeof labTrackingOrder.confirmedDiagnosis.diagnosis === 'object'
              && labTrackingOrder.confirmedDiagnosis.diagnosis.value === null)     // it's an object, but value is null
              || labTrackingOrder.confirmedDiagnosis.diagnosis === null
              || labTrackingOrder.confirmedDiagnosis.diagnosis.length === 0)) {    // not an object, and null or empty
            // if no post-op diagnosis specified, but there's an existing value, we need to delete the whole existing obs group
            if (labTrackingOrder.confirmedDiagnosis.groupMemmberParentUuid !== null) {
              obsIdsToDelete.push(labTrackingOrder.confirmedDiagnosis.groupMemmberParentUuid);
            }
          }
          else {
            // a post-op diagnosis value has been entered
            var v = [];

            if (typeof labTrackingOrder.confirmedDiagnosis.diagnosis === 'object') {
              // coded obs
              if (labTrackingOrder.confirmedDiagnosis.obsUuid === null || labTrackingOrder.confirmedDiagnosis.originalType === 'coded') {
                // if there's no existing obs (obsUuid === null) or the existing type was coded, just create/update
                v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.confirmedDiagnosis.value,
                  labTrackingOrder.confirmedDiagnosis.diagnosis.value,
                  labTrackingOrder.confirmedDiagnosis.obsUuid));
              }
              else {
                // otherwise, we need to void the existing and create new obs (since there's funky behavior when updating the concept_id of an obs)
                v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.confirmedDiagnosis.value,
                  labTrackingOrder.confirmedDiagnosis.diagnosis.value, null));
                obsIdsToDelete.push(labTrackingOrder.confirmedDiagnosis.obsUuid);
              }
            }
            else {
              // else, non-coded obs
              if (labTrackingOrder.confirmedDiagnosis.obsUuid === null || labTrackingOrder.confirmedDiagnosis.originalType === 'nonCoded') {
                // if there's no existing obs (obsUuid === null) or the existing type was coded, just create/update
                v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.confirmedDiagnosis.nonCodedValue,
                  labTrackingOrder.confirmedDiagnosis.diagnosis,
                  labTrackingOrder.confirmedDiagnosis.obsUuid));
              }
              else {
                // otherwise, we need to void the existing and create new obs (since there's funky behavior when updating the concept_id of an obs)
                v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.confirmedDiagnosis.nonCodedValue,
                  labTrackingOrder.confirmedDiagnosis.diagnosis, null));
                obsIdsToDelete.push(labTrackingOrder.confirmedDiagnosis.obsUuid);
              }
            }

            v.push(Encounter.toObsWebServiceObject(LabTrackingOrder.CONSTANTS.DIAGNOSIS_CERTAINTY_CONCEPT_UUID,
              labTrackingOrder.confirmedDiagnosis.certainty.value,
              labTrackingOrder.confirmedDiagnosis.certainty.obsUuid));

            var groupMembers = {
              groupMembers: v,
              concept: LabTrackingOrder.concepts.confirmedDiagnosis.constructUuid,
              uuid: labTrackingOrder.confirmedDiagnosis.groupMemmberParentUuid
            };

            obs.push(groupMembers);
          }

          // special case for Specimen Sent to Port-au-Prince obs group
          if ( labTrackingOrder.specimenSentToPaP.specimenSent.value !== LabTrackingOrder.CONSTANTS.YES) {
            // if no specimenSentToPaP specified, but there's an existing value, we need to delete the whole existing obs group
            if (labTrackingOrder.specimenSentToPaP.groupMemmberParentUuid !== null) {
              obsIdsToDelete.push(labTrackingOrder.specimenSentToPaP.groupMemmberParentUuid);
            }
          }
          else {
            // Specimen was sent to PAP
            var v = [];

            // coded question Sample Sent: Y/N
            v.push(Encounter.toObsWebServiceObject(
              LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_TO_PAP,
              labTrackingOrder.specimenSentToPaP.specimenSent.value,
              labTrackingOrder.specimenSentToPaP.specimenSent.obsUuid));

            // non-coded Lab location
            var labLocationObs = Encounter.toObsWebServiceObject(
              LabTrackingOrder.CONSTANTS.LAB_PAP_LOCATION,
              LabTrackingOrder.CONSTANTS.LOCATION_OTHER_NON_CODED,
              labTrackingOrder.specimenSentToPaP.labPaPLocation.obsUuid);
            labLocationObs.comment = "Port-au-Prince";
            v.push(labLocationObs);

            if (labTrackingOrder.specimenSentToPaP.dateSent.value != null) {
              var dtAsStr = Encounter.formatDateTime(labTrackingOrder.specimenSentToPaP.dateSent.value);
              v.push(Encounter.toObsWebServiceObject(
                LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_DATE,
                dtAsStr,
                labTrackingOrder.specimenSentToPaP.dateSent.obsUuid));
            } else if (labTrackingOrder.specimenSentToPaP.dateSent.obsUuid != null) {
              obsIdsToDelete.push(labTrackingOrder.specimenSentToPaP.dateSent.obsUuid);
            }

            if (labTrackingOrder.specimenSentToPaP.dateReturned.value != null) {
              var dtAsStr = Encounter.formatDateTime(labTrackingOrder.specimenSentToPaP.dateReturned.value);
              v.push(Encounter.toObsWebServiceObject(
                LabTrackingOrder.CONSTANTS.SPECIMEN_RETURN_DATE,
                dtAsStr,
                labTrackingOrder.specimenSentToPaP.dateReturned.obsUuid));
            } else if (labTrackingOrder.specimenSentToPaP.dateReturned.obsUuid != null) {
              obsIdsToDelete.push(labTrackingOrder.specimenSentToPaP.dateReturned.obsUuid);
            }


            var groupMembers = {
              groupMembers: v,
              concept: LabTrackingOrder.CONSTANTS.SPECIMEN_SENT_CONSTRUCT,
              uuid: labTrackingOrder.specimenSentToPaP.groupMemmberParentUuid
            };

            obs.push(groupMembers);
          }

           if (labTrackingOrder.processedDate.value != null) {
                var dtAsStr = Encounter.formatDateTime(labTrackingOrder.processedDate.value);
                obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.processedDate.value, dtAsStr, labTrackingOrder.processedDate.obsUuid));
            }
            else if (labTrackingOrder.processedDate.obsUuid != null) {
                obsIdsToDelete.push(labTrackingOrder.processedDate.obsUuid);
            }
            if (labTrackingOrder.dateImmunoSentToBoston.value != null) {
                var dtAsStr = Encounter.formatDateTime(labTrackingOrder.dateImmunoSentToBoston.value);
                obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.dateImmunoSentToBoston.value, dtAsStr, labTrackingOrder.dateImmunoSentToBoston.obsUuid));
            }
            else if (labTrackingOrder.dateImmunoSentToBoston.obsUuid != null) {
                obsIdsToDelete.push(labTrackingOrder.dateImmunoSentToBoston.obsUuid);
            }

            if (labTrackingOrder.resultDate.value != null) {
                var dtAsStr = Encounter.toObsDate(labTrackingOrder.resultDate.value);
                obs.push(Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.resultDate.value, dtAsStr, labTrackingOrder.resultDate.obsUuid));
            }
            else if (labTrackingOrder.resultDate.obsUuid != null) {
                obsIdsToDelete.push(labTrackingOrder.resultDate.obsUuid);
            }

            for (var i = 0; i < labTrackingOrder.procedures.length; ++i) {
                var o = Encounter.toObsWebServiceObject(LabTrackingOrder.concepts.procedure.value, labTrackingOrder.procedures[i].value, labTrackingOrder.procedures[i].obsUuid);
                obs.push(o);
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

            if (labTrackingOrder.files.length > 0 ) {
                for (let index = 0; index < labTrackingOrder.files.length; ++index) {
                  if (labTrackingOrder.files[index].valueBase64 != null ) {
                    obs.push(Encounter.toObsWebServiceObject(
                      LabTrackingOrder.concepts.file.value,
                      labTrackingOrder.files[index].valueBase64,
                      labTrackingOrder.files[index].obsUuid));
                  }
                }
            }


            var encounter = new Encounter(
                                LabTrackingOrder.CONSTANTS.SPECIMEN_COLLECTION_ENCOUNTER_CONCEPT_UUID,
                                labTrackingOrder.provider.value ?  labTrackingOrder.provider.value : currentProviderUUID,
                                LabTrackingOrder.CONSTANTS.ORDER_ENCOUNTER_PROVIDER_ROLE_UUID,
                                labTrackingOrder.patient.value,
                                labTrackingOrder.locationWhereSpecimenCollected.value ? labTrackingOrder.locationWhereSpecimenCollected.value : labTrackingOrder.location.value,
                                obs,
                                labTrackingOrder.sampleDate.value,
                                labTrackingOrder.visit.value);

            return {encounter: encounter, obsIdsToDelete: obsIdsToDelete};
        };


        /* checks whether a lab order providers has changed, see getEncounterProviders() for the objects
         * @param provider - the provider objects,
         * @param orginalSurgeonAndResident - the original provider objects
         * */
        LabTrackingOrder.haveProvidersChanged = function (provider, orginalSurgeonAndResident) {
            var ret = {surgeon: false, resident: false, provider: false};

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
            if ((provider.provider == null && orginalSurgeonAndResident.provider != null)
              || (provider.provider != null && orginalSurgeonAndResident.provider == null)
              || (provider.provider != null && provider.provider.provider != orginalSurgeonAndResident.provider.provider)) {
              ret.provider = true;
            }

            return ret;
        };

        /*
         gets the providers for the order
         @param - the labtracking order
         @return - the surgeon and resident providers
         * */
        LabTrackingOrder.getEncounterProviders = function (labTrackingOrder) {
            var providers = {surgeon: null, resident: null, provider: null};
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

            if (labTrackingOrder.provider != null && labTrackingOrder.provider.value != null) {
              providers.provider = Encounter.toEncounterProvider(labTrackingOrder.provider.value,
                LabTrackingOrder.CONSTANTS.ORDER_ENCOUNTER_PROVIDER_ROLE_UUID);
            }

            return providers;
        };

        /* gets the Test Order status */
        function calcStatus(order) {
            var idx = 1; //Requested
            if (order.canceled && order.notes.value == null && order.files.length < 1) {
                idx = 4; // Canceled
            }  else if (order.specimenDetailsEncounter.uuid) {
                if (order.resultDate.value) {
                    idx = 3; // Reported
                } else if ( order.processedDate.value ) {
                    idx = 2; // Processed
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

      /* reads from obs to a labtracking order
       * @param order - the order object
       * @param conceptUuid -the concept id you are looking for
       * @param obs - the obs object
       * @param uuid - the uuid of the obs if it exists
       * @return true if updated, false if not
       * */
      function _extractObsValue(order, propName, conceptUuid, obs, uuid) {
        if (conceptUuid == LabTrackingOrder.concepts[propName].value) {
          var p = order[propName];
          p.obsUuid = uuid;
          if (obs.valueText) {
              p.value = obs.valueText;
          } else if (obs.valueNumeric) {
            p.value = obs.valueNumeric;
          } else if (obs.valueDatetime) {
            p.value = obs.valueDatetime;
          } else if (obs.valueCoded) {
            p.value = obs.valueCoded.uuid;
          }
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

        function _constructDateFromWebServiceDateString(dateStr) {
            var dateObj = "";
            if (dateStr) {
                const[yearStr, monthStr, dayStr] = dateStr.split('-');
                if (yearStr && monthStr && dayStr) {
                    dateObj = new Date(yearStr, monthStr - 1, dayStr);
                }
            }
            return dateObj;
        }
        /**
         * Return the constructor function
         */
        return LabTrackingOrder;
    }]);
