angular.module("encounterFactory", [])
	.factory('Encounter', ['$http', function($http) {
		var CONSTANTS = {
			ENCOUNTER_SAVE: "/" + OPENMRS_CONTEXT_PATH + "/ws/rest/v1/encounter"
		};
		/**
		 * Constructor, with class name , all parameters are UUID's
		 */
		function Encounter(encounterType, currentProvider, encounterRole, patient, location) {

			var encounterProvider = {
				provider: currentProvider,
				encounterRole: encounterRole
			};
			this.patient = patient;
			this.encounterType = encounterType;
			this.location = location;
			this.encounterProviders = currentProvider !== null ? [encounterProvider] : [];
			this.obs = [];
		}

		Encounter.save = function(encounter, existingUuid){
			var url = CONSTANTS.ENCOUNTER_SAVE;

			if (existingUuid !== undefined && existingUuid !== null) {
				//if the encounter already exists, then append the UUID and it will update it
				url += "/" + existingUuid;
				encounter.uuid = existingUuid;
			}

			return $http.post(url, encounter).then(function(resp){
			    return resp;
			}, function(err){
			    return err;
			});
		};

		/**
		 * Return the constructor function
		 */
		return Encounter;
	}]);