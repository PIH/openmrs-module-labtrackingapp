angular.module("encounterFactory", [])
    .factory('Encounter', ['$http', '$q', '$filter', function ($http, $q, $filter) {
        var CONSTANTS = {
            ENCOUNTER_SAVE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter",
            UPDATE_ENCOUNTER_PROVIDER: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter/ENCOUNTER_ID/encounterprovider",
            OBSERVATION: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/obs"
        };

        /**
         * Constructor, with class name , all parameters are UUID's
         */
        function Encounter(encounterType, currentProvider, encounterRole, patient, location, obs) {

            var encounterProvider = Encounter.toEncounterProvider(currentProvider, encounterRole);

            this.patient = patient;
            this.encounterType = encounterType;
            this.location = location;
            this.encounterProviders = currentProvider !== null ? [encounterProvider] : [];
            this.obs = obs;
        }

        /*creates an encounter provider object
        * @param providerUUID = the provider UUID
        * @param encounterRoleUuid = the provicder role UUID
        * @param encounterProviderUuid = the uuid of the encounter provider (used for updating)
        * */
        Encounter.toEncounterProvider = function(providerUuid, encounterRoleUuid, encounterProviderUuid){
            return {
                provider: providerUuid,
                encounterRole: encounterRoleUuid,
                uuid: encounterProviderUuid,
            };
        };

        /*  save an encounter
         @param encounter - the encounter to save
         @param existingUuid - the encounter UUID if it already exists*/
        Encounter.save = function (encounter, existingUuid) {
            var url = CONSTANTS.ENCOUNTER_SAVE;

            if (existingUuid !== undefined && existingUuid !== null) {
                //if the encounter already exists, then append the UUID and it will update it
                url += "/" + existingUuid;
                encounter.uuid = existingUuid;
                //TODO:  for existing encounters you cannot save the encounter providers
                //       you need to call the subresource instead
                delete encounter.encounterProviders;
            }

            return $http.post(url, encounter).then(function (resp) {
                return resp;
            }, function (err) {
                return err;
            });
        };

        /*  save an encounter provider
         @param encounterUuid- the encounter uuid
         @param encounterProvider - the encounter provider info
         */
        // Encounter.createOrUpdateProvider = function (encounterUuid, encounterProvider) {
        //
        //     if(encounterProvider == null){
        //         return Encounter.emptyPromise();
        //
        //     }
        //     var encounterProviderUuid = encounterProvider.uuid;
        //     if(encounterProvider.uuid!= null){
        //         //we need to delete it first
        //         var url = CONSTANTS.UPDATE_ENCOUNTER_PROVIDER.replace("ENCOUNTER_ID", encounterUuid) + "/" + encounterProvider.uuid;
        //         return $http.delete(url, encounterProvider).then(function (resp) {
        //             encounterProvider.uuid = null; //set this to null, so that we create a new one
        //             return Encounter.createProvider(encounterUuid, encounterProvider);
        //         }, function (err) {
        //             return err;
        //         });
        //     }
        //     else{
        //         return Encounter.createProvider(encounterUuid, encounterProvider);
        //     }
        //
        // };

        Encounter.haveProvidersChanged = function(provider, orginalSurgeonAndResident){
            var ret = false;
            if((provider.surgeon == null && orginalSurgeonAndResident.surgeon != null)
                || (provider.surgeon != null && orginalSurgeonAndResident.surgeon == null)
                || (provider.resident == null && orginalSurgeonAndResident.resident != null)
                || (provider.resident != null && orginalSurgeonAndResident.resident == null)){
                //handle all the nulls
                ret = true;
            }
            else if(provider.surgeon == null && orginalSurgeonAndResident.surgeon == null
                    && provider.resident == null && orginalSurgeonAndResident.resident == null){
                //they are both null and haven't changed
                ret = false
            }
            else if(provider.surgeon.provider != orginalSurgeonAndResident.surgeon.provider
                    || provider.resident.provider != orginalSurgeonAndResident.resident.provider){
                ret = true;
            }

            return ret;
        };

        Encounter.createProvider = function(encounterUuid, encounterProvider){

            if(encounterProvider == null){
                return Encounter.emptyPromise();
            }

            //return Encounter.emptyPromise();

            var url = CONSTANTS.UPDATE_ENCOUNTER_PROVIDER.replace("ENCOUNTER_ID", encounterUuid);
            return $http.post(url, encounterProvider).then(function (resp) {
                return resp;
            }, function (err) {
                return err;
            });

        };

        /* deletes an EncounterProvider*/
        Encounter.deleteEncounterProvider = function(encounterUuid, encounterProviderUuid){
            var url = CONSTANTS.UPDATE_ENCOUNTER_PROVIDER.replace("ENCOUNTER_ID", encounterUuid) + "/" + encounterProviderUuid;
            return $http.delete(url, {}).then(function (resp) {
                return resp;
            }, function (err) {
                return err;
            });
        };
        /*
         deletes a list of observations
         * */
        Encounter.deleteEncounterProviders = function(encounterUuid, list) {

            if(list == null || list.length == 0){
                return Encounter.emptyPromise();
            }

            var deferred = $q.defer();
            var promise = deferred.promise;

            deferred.resolve();

            return list.reduce(function(promise, encounterProviderUuid){
                if(encounterProviderUuid != null){
                    return promise.then(Encounter.deleteEncounterProvider(encounterUuid, encounterProviderUuid));
                }
                else{
                    return Encounter.emptyPromise();
                }

            }, promise);
        };


        /*
        deletes a list of observations
        * */
        Encounter.deleteObs = function(list) {

            if(list == null || list.length == 0){
                return Encounter.emptyPromise();
            }

            var deferred = $q.defer();
            var promise = deferred.promise;

            var removeObservation = function(obsUuid) {
                return function(){
                    return $http({
                        url: CONSTANTS.OBSERVATION + "/" + obsUuid,
                        method: 'DELETE'
                    })
                }
            };

            deferred.resolve();

            return list.reduce(function(promise, obsUuid){
                return promise.then(removeObservation(obsUuid));
            }, promise);
        }

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
                ret.uuid = existingObsUuid;
            }

            return ret;
        };

        /* aren't they all!! */
        Encounter.emptyPromise = function(data){
            var deferred = $q.defer();
            deferred.resolve({status:200, data: data});
            return deferred.promise;
        }

        /* converts a JavaScript date to an OpenMRS REST date
        * like 2016-12-25T19:02:34.232+0700
        * @param date - the Date object
        * @return  the string date
        * */
        Encounter.toObsDate = function(date){
            var OBS_DATE_FORMAT = "yyyy-MM-ddTHH:mm:ss.sssZ";
            return $filter('date')(date, OBS_DATE_FORMAT);
        };

        /**
         * Return the constructor function
         */
        return Encounter;
    }]);