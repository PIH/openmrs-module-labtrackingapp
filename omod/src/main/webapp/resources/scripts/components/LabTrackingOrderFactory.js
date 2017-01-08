angular.module("labTrackingOrderFactory", [])
    .factory('LabTrackingOrder', ['$http', '$filter', 'Encounter', function ($http, $filter, Encounter) {
        var CONSTANTS = {
            ORDER_TYPE: "testorder",
            ORDER_CONCEPT_UUID:"d6d585b6-4887-4aac-8361-424c17b030f2",
            ORDER_PROCEDURE_ORDERED_UUID:"d6d585b6-4887-4aac-8361-424c17b030f2",
            ORDER_ENCOUNTER_TYPE_UUID: "b3a0e3ad-b80c-4f3f-9626-ace1ced7e2dd",
            ORDER_ENCOUNTER_PROVIDER_ROLE_UUID: "c458d78e-8374-4767-ad58-9f8fe276e01c"
        };
        /**
         * Constructor, with class name
         */
        function LabTrackingOrder(patientUuid, locationUuid) {
            this.order = {concept: LabTrackingOrder.concepts.order, value:null};
            this.preLabDiagnosis = {label:LabTrackingOrder.concepts.preLabDiagnosis.answers[0].label, value: LabTrackingOrder.concepts.preLabDiagnosis.answers[0].value};
            this.postopDiagnosis = {concept: LabTrackingOrder.concepts.diagnosis, value:null};
            this.procedures = [];  //this is an array of values
            this.instructions = {value:""};
            this.clinicalHistory = {value:""};
            this.specimanDetails = [{value:""},{value:""},{value:""}];
            this.careSetting =  {label:LabTrackingOrder.concepts.careSetting.answers[1].label, value:LabTrackingOrder.concepts.careSetting.answers[1].value};
            this.encounter = {value:null};
            this.location = {value: locationUuid};
            this.patient = {value: patientUuid, name:null, id:null};
            this.surgeon = {value: null, name:null};
            this.resident = {value: null, name:null};
            this.mdToNotify = {value: null};
            this.urgency = {value: null};
            this.status = {value: null};
            this.requestDate = {value: null};
            this.sampleDate = {value: null};
            this.resultDate = {value: null};
        }
        /*
         the concept definitions for labTracking results
         TODO:  things with ????? as UUID need to have real concepts, need to load the translatins
        */
        LabTrackingOrder.concepts = {
            order:{label:'Order', value:'25fa3a49-ca69-4e8d-9e55-394a9964a1cd', encounter_type:'b3a0e3ad-b80c-4f3f-9626-ace1ced7e2dd'} ,
            preLabDiagnosis: {label:'Pre-Pathology Suspected diagnosis', value:'226ed7ad-b776-4b99-966d-fd818d3302c2',
                answers:
                [
                    {label:'CNB', value:'162813AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Mastectomy', value:'161947AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Lumpectomy', value:'?????'},
                    {label:'Hysterectomy', value:'159837AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Adnexectomy', value:'?????'},
                    {label:'Oophorectomy', value:'161844AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Excisional/Incisional Biopsy', value:'162928AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Axillary Lymph Resection', value:'162215AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Blood', value:'?????'},
                    {label:'Surgical Margin', value:'?????'},
                    {label:'Procedure Performed Outside', value:'?????'},
                    {label:'Other', value:'3cee7fb4-26fe-102b-80cb-0017a47871b2'}
                ]
            },
            procedure: {label:'Procedure', value:'c6a87394-4cd0-48b7-a8ac-c7dad55be2e6',
                answers:[
                    {label:'L Breast', value:'fcd5199e-1a36-11e2-a310-aa00f871a3e1'},
                    {label:'R Breast', value:'fcd4c8e0-1a36-11e2-a310-aa00f871a3e1'},
                    {label:'Neck/Head', value:'?????'},
                    {label:'Bilateral Breast', value:'?????'},
                    {label:'Uterus', value:'?????'},
                    {label:'R Ovary', value:'?????'},
                    {label:'L Ovary', value:'?????'},
                    {label:'Bilateral Ovary', value:'?????'},
                    {label:'Axillary Lymph', value:'?????'},
                    {label:'Cervix', value:'?????'},
                    {label:'Fallopian Tubes', value:'?????'},
                    {label:'Intestine', value:'?????'},
                    {label:'Esophagus', value:'?????'},
                    {label:'Gastric', value:'?????'},
                    {label:'Orthopedic', value:'?????'},
                    {label:'Lymph nodes', value:'?????'},
                    {label:'Other', value:'3cee7fb4-26fe-102b-80cb-0017a47871b2'},
                ]
            },
            instructions: {label:'Instructions', value:'?????'},
            clinicalHistory: {label:'Clinical History', value:'?????'},
            careSetting: {label:'Care Setting', value:'NA',
                answers:[
                    {label: 'Inpatient', value:'c365e560-c3ec-11e3-9c1a-0800200c9a66'},
                    {label: 'Outpatient', value:'6f0c9a92-6f24-11e3-af88-005056821db0'}
                ]
            }
        }

        /*
        builds a list of LabTrackingOrder objects out of the results from an OpenMRS web service call
        @param webServiceResults - the results of the web service call
        @return LabTrackingOrder[]
        */
        LabTrackingOrder.buildList = function(webServiceResults){
            var ret = [];

            for(var i = 0;i<webServiceResults.length;++i){
                var ord = LabTrackingOrder.fromWebServiceObject(webServiceResults[i]);
                ret.push(ord);
            }

            return ret;
        }

        /*
        creates a LabTracking order form a web service object
        @param webServiceResult - the web service object
        @return LabeTrackingOrder object
        */
        LabTrackingOrder.fromWebServiceObject = function(webServiceResult){
            var order = new LabTrackingOrder();

            order.order.value = webServiceResult.uuid;
            order.preLabDiagnosis.value = webServiceResult.orderReason.uuid;

            var procs = [];
            if(webServiceResult['encounter.obs'] != null && webServiceResult['encounter.obs'].length > 0){
                var obs = webServiceResult['encounter.obs'];
                for(var i=0;i<obs.length;++i){
                   procs.push({value: obs[0].value.uuid, label:obs[0].value.display, obsUuid:obs[i].uuid});
                }
            }
            order.procedures = procs;

            order.preLabDiagnosis.value = webServiceResult.orderReason.uuid;
            order.preLabDiagnosis.display = webServiceResult.orderReason.display;


            order.instructions.value = webServiceResult.instructions;
            order.clinicalHistory.value = webServiceResult.clinicalHistory;
            if(webServiceResult.urgency == 'ROUTINE'){
                order.urgency.value = false;
            }
            else{
                order.urgency.value = true;
            }
            if(webServiceResult.careSetting){
                order.careSetting.value =  webServiceResult.careSetting.uuid;
            }

            order.encounter.value = webServiceResult.encounter.uuid;
            order.location.value =  webServiceResult.encounter.location.uuid;
            order.location.display =  webServiceResult.encounter.location.display;
            order.patient.value =  webServiceResult.encounter.patient.uuid;
            order.patient.name =  webServiceResult.patient.person.display;
            //have to load the id this way b/c of the way the rest web services
            //  return this field
            order.patient.id =  webServiceResult['patient.identifiers'][0].identifier;
            order.status.value = null; //TODO: need to get this
            order.status.display = 'Requested'; //TODO: need to get this
            order.requestDate.value = new Date($filter('serverDate')(webServiceResult.dateActivated));
            order.sampleDate.value = null; //TODO: need to get this
            order.resultDate.value = null; //TODO: need to get this

            return order;
        }

        /*
        creates a web service object from a LabTrackingOrder object
        @param labTrackingOrder - the LabTrackingOrder object
        @param currentProviderUUID - the current provider UUID
        @return Object - the web service object
        */
        LabTrackingOrder.toWebServiceObject = function(labTrackingOrder, currentProviderUUID){
                var order = {
                    type: CONSTANTS.ORDER_TYPE,
                    patient: labTrackingOrder.patient.value,
                    orderer: currentProviderUUID,
                    concept: CONSTANTS.ORDER_CONCEPT_UUID,
                    careSetting: labTrackingOrder.careSetting.value,
                    encounter: labTrackingOrder.encounter.value,
                    orderReason: labTrackingOrder.preLabDiagnosis.value,
                    instructions: labTrackingOrder.instructions.value,
                    clinicalHistory: labTrackingOrder.clinicalHistory.value
                };

                return order;
        }

        /* creates the web service observations objects for
           the encounter associated with the test order
        @param labTrackingOrder - the order to create
        @param provider - the provider that created the order
        @return the Encounter as a WebService Object
        */
        LabTrackingOrder.toTestOrderEncounterWebServiceObject = function(labTrackingOrder, currentProviderUUID) {

            var obs = [];
            for(var i=0;i<labTrackingOrder.procedures.length;++i){
                var o = Encounter.toObsWebServiceObject(CONSTANTS.ORDER_PROCEDURE_ORDERED_UUID, labTrackingOrder.procedures[i].value, null);
                obs.push(o);
            }

            var encounter = new Encounter(CONSTANTS.ORDER_ENCOUNTER_TYPE_UUID, currentProviderUUID, CONSTANTS.ORDER_ENCOUNTER_PROVIDER_ROLE_UUID,
                labTrackingOrder.patient.value, labTrackingOrder.location.value, obs);

            return encounter;
        };


        /* creates the web service observations objects for
           the specimen collection encounter associated with the test order
        @param labTrackingOrder - the order to create
        @param provider - the provider that created the encounter
        @return the Encounter as a WebService Object
        */
        LabTrackingOrder.toSpecimenCollectionEncounterWebServiceObject = function(labTrackingOrder, currentProviderUUID) {
//
//        Attending surgeon
//        Resident
//        MD to notify
//        Specimen Details
//        Results Date
//        Notes
//        File
//        Procudure performed at outside location
//        Other procedure
//
            var obs = [];
            for(var i=0;i<labTrackingOrder.procedures.length;++i){
                var o = Encounter.toObsWebServiceObject(ORDER_PROCEDURE_ORDERED_UUID, labTrackingOrder.procedures[i].value, null);
                obs.push(o);
            }

            var encounter = new Encounter(CONSTANTS.ORDER_ENCOUNTER_TYPE_UUID, currentProviderUUID, CONSTANTS.ORDER_ENCOUNTER_PROVIDER_ROLE_UUID,
                labTrackingOrder.patient.value, labTrackingOrder.location.value, obs);

            return encounter;
        };


        /**
         * Return the constructor function
         */
        return LabTrackingOrder;
    }]);