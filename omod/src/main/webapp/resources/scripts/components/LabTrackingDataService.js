angular.module("labTrackingDataService", [])
    .service('LabTrackingDataService', ['$q', '$http', 'LabTrackingOrder',
        function ($q, $http, LabTrackingOrder) {
            var CONSTANTS = {
                URLS: {
                    FIND_PATIENT: "coreapps/findpatient/findPatient.page?app=edtriageapp.app.edTriage",
                    SAVE_ORDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/order",
                    PATIENT_DASHBOARD:"coreapps/clinicianfacing/patient.page?patientId=PATIENT_UUID&app=pih.app.clinicianDashboard",
                    ACTIVE_VISIT: "/" + OPENMRS_CONTEXT_PATH  + "/ws/rest/emrapi/activevisit"
                },
                ORDER_TYPE: "testorder" ,
                ORDER_FREQUENCY_UUID: "38090760-7c38-11e4-baa7-0800200c9a67"
            };


            /*
             saves an order for a patient
             * */
            this.saveOrder = function (labTrackingOrder) {

                var order = {
                    type: CONSTANTS.ORDER_TYPE,
                    patient: labTrackingOrder.patient.value,
                    //location: labTrackingOrder.location.value,
                    concept: labTrackingOrder.procedure.value,
                    careSetting: labTrackingOrder.careSetting.value,
                    encounter: labTrackingOrder.encounter.value,
                    orderer:labTrackingOrder.orderer.value,
                    orderReason:labTrackingOrder.diagnosis.value,
                    instructions:labTrackingOrder.instructions.value,
                    clinicalHistory:labTrackingOrder.clinicalHistory.value,
                    laterality: null //this might store the site
                }
        
                return ensureActiveVisit(labTrackingOrder.patient.value, labTrackingOrder.location.value)
                    .then(function (res) {
                        console.log(res);
                        return $http.post(CONSTANTS.URLS.SAVE_ORDER, order)
                    })
                    .then(function () {
                            return {status: 200};
                        }
                        , function (error) {
                            return {status: 500, error: error};
                        });
            };


            function ensureActiveVisit(patient, location) {
                return $http.post(CONSTANTS.URLS.ACTIVE_VISIT + "?patient=" + patient + "&location=" + location);
            }

            this.CONSTANTS = CONSTANTS;
   //         this.session =  SessionInfo.get();
        }]);