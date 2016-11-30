angular.module("labTrackingOrderFactory", [])
    .factory('LabTrackingOrder', ['$http', function ($http) {
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
            this.orderer = {value:null};
            this.location = {value: locationUuid};
            this.patient = {value: patientUuid};

        }

        LabTrackingOrder.concepts = {
            order:{label:'Order', uuid:'25fa3a49-ca69-4e8d-9e55-394a9964a1cd'} ,
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
                    {label:'Neck/Head', uuid:'1?????'},
                    {label:'L Breast', uuid:'fcd5199e-1a36-11e2-a310-aa00f871a3e1'},
                    {label:'R Breast', uuid:'fcd4c8e0-1a36-11e2-a310-aa00f871a3e1'},
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


        /**
         * Return the constructor function
         */
        return LabTrackingOrder;
    }]);