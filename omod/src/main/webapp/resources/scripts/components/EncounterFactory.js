angular.module("encounterFactory", [])
    .factory('Encounter', ['$http', function ($http) {
        var CONSTANTS = {
            ENCOUNTER_SAVE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter"
        };

        /**
         * Constructor, with class name , all parameters are UUID's
         */
        function Encounter(encounterType, currentProvider, encounterRole, patient, location, obs) {

            var encounterProvider = {
                provider: currentProvider,
                encounterRole: encounterRole
            };
            this.patient = patient;
            this.encounterType = encounterType;
            this.location = location;
            this.encounterProviders = currentProvider !== null ? [encounterProvider] : [];
            this.obs = obs;
        }

        /*  save an encounter
         @param encounter - the encounter to save
         @param existingUuid - the encounter UUID if it already exists*/
        Encounter.save = function (encounter, existingUuid) {
            var url = CONSTANTS.ENCOUNTER_SAVE;

            if (existingUuid !== undefined && existingUuid !== null) {
                //if the encounter already exists, then append the UUID and it will update it
                url += "/" + existingUuid;
                encounter.uuid = existingUuid;
            }

            return $http.post(url, encounter).then(function (resp) {
                return resp;
            }, function (err) {
                return err;
            });
        };

        /*
         creates an objs WS object
         @param conceptUuid - the concept UUID
         @param obsValue - the obj value
         @param existingObsUuid - the obj UUID if updating an existing obs
         @return The WebService object
         */
        Encounter.toObsWebServiceObject = function (conceptUuid, obsValue, existingObsUuid) {
            var ret = {concept: conceptUuid, value: null, uuid: null};
            if (obsValue != null) {
                ret.value = obsValue;
            }

            if (existingObsUuid != null) {
                ret.value = existingObsUuid;
            }

            return ret;
        };

        /**
         * Return the constructor function
         */
        return Encounter;
    }]);