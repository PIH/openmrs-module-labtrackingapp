angular.module("labTrackingOrderFactory", [])
    .factory('LabTrackingOrder', ['$http', function ($http) {
        var CONSTANTS = {
            ORDER_TYPE: "testorder"
        };
        /**
         * Constructor, with class name
         */
        function LabTrackingOrder(patientUuid, locationUuid) {
            this.order = {concept: LabTrackingOrder.concepts.order, value:null};
            this.diagnosis = {concept: LabTrackingOrder.concepts.diagnosis, value:LabTrackingOrder.concepts.diagnosis.answers[0].uuid};
            this.procedure = {concept: LabTrackingOrder.concepts.procedure, value:LabTrackingOrder.concepts.procedure.answers[0].uuid};
            this.instructions = {concept: LabTrackingOrder.concepts.instructions, value:"Test instructions"};
            this.clinicalHistory = {concept: LabTrackingOrder.concepts.clinicalHistory, value:"Test history info"};
            this.careSetting =  {concept: LabTrackingOrder.concepts.careSetting, value:LabTrackingOrder.concepts.careSetting.answers[1].uuid};
            this.encounter = {concept: null, value:null};
            this.location = {value: locationUuid};
            this.patient = {value: patientUuid};
            this.status = {value: null};
            this.requestDate = {value: null};
            this.sampleDate = {value: null};
            this.resultDate = {value: null};
        }
        /*
         the concept definitions for labTracking results
         TODO:  things with ????? as UUID need to have real concepts
        */
        LabTrackingOrder.concepts = {
            order:{label:'Order', uuid:'25fa3a49-ca69-4e8d-9e55-394a9964a1cd', encounter_type:'b3a0e3ad-b80c-4f3f-9626-ace1ced7e2dd'} ,
            diagnosis: {label:'Pre-Pathology Suspected diagnosis', uuid:'226ed7ad-b776-4b99-966d-fd818d3302c2',
                answers:
                [
                    {label:'CNB', uuid:'162813AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Mastectomy', uuid:'161947AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Lumpectomy', uuid:'?????'},
                    {label:'Hysterectomy', uuid:'159837AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Adnexectomy', uuid:'?????'},
                    {label:'Oophorectomy', uuid:'161844AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Excisional/Incisional Biopsy', uuid:'162928AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Axillary Lymph Resection', uuid:'162215AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'},
                    {label:'Blood', uuid:'?????'},
                    {label:'Surgical Margin', uuid:'?????'},
                    {label:'Procedure Performed Outside', uuid:'?????'},
                    {label:'Other', uuid:'3cee7fb4-26fe-102b-80cb-0017a47871b2'}
                ]
            },
            procedure: {label:'Procedure', uuid:'c6a87394-4cd0-48b7-a8ac-c7dad55be2e6',
                answers:[
                    {label:'L Breast', uuid:'fcd5199e-1a36-11e2-a310-aa00f871a3e1'},
                    {label:'R Breast', uuid:'fcd4c8e0-1a36-11e2-a310-aa00f871a3e1'},
                    {label:'Neck/Head', uuid:'1?????'},
                    {label:'Bilateral Breast', uuid:'?????'},
                    {label:'Uterus', uuid:'?????'},
                    {label:'R Ovary', uuid:'?????'},
                    {label:'L Ovary', uuid:'?????'},
                    {label:'Bilateral Ovary', uuid:'?????'},
                    {label:'Axillary Lymph', uuid:'?????'},
                    {label:'Cervix', uuid:'?????'},
                    {label:'Fallopian Tubes', uuid:'?????'},
                    {label:'Intestine', uuid:'?????'},
                    {label:'Esophagus', uuid:'?????'},
                    {label:'Gastric', uuid:'?????'},
                    {label:'Orthopedic', uuid:'?????'},
                    {label:'Lymph nodes', uuid:'?????'},
                    {label:'Other', uuid:'3cee7fb4-26fe-102b-80cb-0017a47871b2'},
                ]
            },
            instructions: {label:'Instructions', uuid:'?????'},
            clinicalHistory: {label:'Clinical History', uuid:'?????'},
            careSetting: {label:'Care Setting', uuid:'NA',
                answers:[
                    {label: 'Inpatient', uuid:'c365e560-c3ec-11e3-9c1a-0800200c9a66'},
                    {label: 'Outpatient', uuid:'6f0c9a92-6f24-11e3-af88-005056821db0'}
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

            for(var i = 0;i<data.length;++i){
                var ord = LabTrackingOrder.fromWebServiceObject(data[i]);
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
            order.diagnosis.value = webServiceResult.orderReason.uuid;
            order.procedure.value = webServiceResult.encounter.orders.order[0].uuid;
            order.instructions = webServiceResult.instructions;
            order.clinicalHistory = webServiceResult.clinicalHistory;
            order.careSetting.value =  webServiceResult.careSetting.uuid;
            order.encounter.value = webServiceResult.encounter.uuid;
            order.location.value =  locationUuid;
            order.patient.value =  patientUuid;
            order.status.value = null; //TODO: need to get this
            order.requestDate.value = webServiceResult.dateActivated;
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
                    concept: labTrackingOrder.procedure.value,
                    careSetting: labTrackingOrder.careSetting.value,
                    encounter: labTrackingOrder.encounter.value,

                    orderReason: labTrackingOrder.diagnosis.value,
                    instructions: labTrackingOrder.instructions.value,
                    clinicalHistory: labTrackingOrder.clinicalHistory.value,
                    laterality: null //TODO:  maybe store the site info, or not
                };

                return order;
        }

        /**
         * Return the constructor function
         */
        return LabTrackingOrder;
    }]);