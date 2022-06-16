angular.module("labTrackingAddOrderController", [])
    .controller("addOrderController", ['$window', '$filter', '$uibModal', '$scope', 'LabTrackingOrder', 'LabTrackingDataService', 'patientUuid', 'visitUuid', 'orderUuid', 'visitStartDateTime', 'visitStopDateTime', 'serverDatetime', 'locationUuid', 'returnUrl',
        function ($window, $filter, $uibModal, $scope, LabTrackingOrder, LabTrackingDataService, patientUuid, visitUuid, orderUuid, visitStartDateTime, visitStopDateTime, serverDatetime, locationUuid, returnUrl) {
            $scope.savingModal = null; //this is a flag that lets us know we are in save mode, so that we can disable things
            $scope.loadingModal = null; //this is a flag that lets us know we are in loading mode
            $scope.selectedProcedures = []; //the list of procedures available, used to manage the UI state
            $scope.tempProcedures = [];  //the temp list of procedures that have been selected, used to manage the UI state
            $scope.careSettings = [];  //the list of care settings in the system
            $scope.order = new LabTrackingOrder(patientUuid, locationUuid, visitUuid);
            $scope.error = null; // when not null, this message will show on the screen
            $scope.debugInfo = null;  // for debugging
            $scope.locations = []; // clinical locations in the system
            $scope.providers = []; // the proviers in the system
            $scope.concepts = LabTrackingOrder.concepts;

            $scope.clientDatetime = new Date();
            $scope.visitStartDateTime = new Date( visitStartDateTime);
            if (visitStopDateTime) {
                $scope.visitStopDateTime = new Date(visitStopDateTime);
            }

            // if a single day visit, just set the model value to that date
            if (sameDate($scope.visitStartDateTime, $scope.visitStopDateTime)) {
                $scope.order.sampleDate.value = visitStartDateTime;
            } // if not a single day visit, but an active visit, set request date to current date
            else if (!visitStopDateTime) {
                $scope.order.sampleDate.value = $scope.clientDatetime;
            }

            $scope.loadOrder = function (orderUuid) {
              $scope.lastUpdatedAtInMillis = new Date().getTime();

              return LabTrackingDataService.loadOrder(orderUuid).then(function (resp) {
                if (resp.status.code == 200) {
                  $scope.order = resp.data;
                  if($scope.order.sampleDate.value == null){
                    //if we don't have a sample date, then set a default value
                    $scope.order.sampleDate.value =  $scope.clientDatetime;
                  }
                }
                else {
                  $scope.error = resp.status.msg;
                }
                return resp;
              });
            };

            $scope.setDefaultProvider = function() {
              if (!$scope.order.provider.value) {
                // if the encounter does not have an Provider then set it to the current user logged on
                var sessionProvider = LabTrackingDataService.getSessionProvider();
                if (sessionProvider != null) {
                  //$scope.provider = $scope.providers[1];
                  $scope.order.provider = {
                    label: sessionProvider.person.display,
                    value: sessionProvider.uuid
                  };
                }
              }
            }

            $scope.requestDateBoxOptions = {
                opened: false,
                format: 'dd-MMM-yyyy',
                options: {
                    dateDisabled: false,
                    formatYear: 'yy',
                    minDate:  $scope.visitStartDateTime,
                    initDate:  $scope.visitStartDateTime,
                    maxDate: $scope.visitStopDateTime ? $scope.visitStopDateTime : $scope.clientDatetime,
                    showWeeks: false
                },
                altInputFormats: ['M!/d!/yyyy']
            };

            /*shows the date box for the request date*/
            $scope.showRequestDateBox = function () {
                $scope.requestDateBoxOptions.opened = true;
            };

            /* saves an order*/
            $scope.handleSaveOrder = function () {
                $scope.savingModal = showSavingModal();
                // keep the Order Request datetime within the boundaries of the visit
                // if ( $scope.order.sampleDate.value < $scope.visitStartDateTime ) {
                //     $scope.order.sampleDate.value = $scope.visitStartDateTime;
                // }
                // else if ( $scope.visitStopDateTime && $scope.order.sampleDate.value > $scope.visitStopDateTime ) {
                //     $scope.order.sampleDate.value = $scope.visitStopDateTime;
                // }

                return LabTrackingDataService.saveOrder($scope.order).then(function (res) {
                    if (LabTrackingDataService.isOk(res)) {
                        $window.location.href = returnUrl; // LabTrackingDataService.getQueuePageUrl(patientUuid);
                    }
                    else if (res !== undefined && res.status !== undefined) {
                        $scope.error = res.data.error.message;
                        $scope.debugInfo = res;
                    }
                    else if (res !== undefined && res.message !== undefined) {
                        $scope.error = res.message;
                        $scope.debugInfo = res;
                    }
                    else {
                        $scope.error = "Unknown error";
                        $scope.debugInfo = res;
                    }

                    $scope.savingModal.dismiss('cancel');

                });
            };

            $scope.formatDiagnosis = function (diagnosis) {
              return diagnosis !== null &&  typeof diagnosis === 'object' ? diagnosis.label : diagnosis;
            }

            $scope.searchProcedures = function(name) {
              return LabTrackingDataService.searchProcedures(name).then(function(response) {
                var procedureArray = [];
                if (LabTrackingDataService.isOk(response)) {
                  for (var i = 0; i < response.data.results.length; ++i) {
                    var item = response.data.results[i];
                    procedureArray.push({ value: item.concept.uuid, label: item.concept.display})
                  }
                }
                return procedureArray;
              }, function (err) {
                throw err;
              });

            }

          $scope.searchDx = function(name) {
            return LabTrackingDataService.searchDx(name).then(function(response) {
              var dxArray = [];
              if (LabTrackingDataService.isOk(response)) {
                for (var i = 0; i < response.data.results.length; ++i) {
                  var item = response.data.results[i];
                  dxArray.push({ value: item.concept.uuid, label: item.concept.display})
                }
              }
              return dxArray;
            }, function (err) {
              throw err;
            });

          }

            $scope.onSelectProcedure = function( $item, $model, $label ){
                if ( $item.value ) {
                  $scope.selectedProcedures = [];
                  for (var i = 0; i < $scope.order.proceduresForSpecimen.length; i++ ) {
                    if ($scope.order.proceduresForSpecimen[i].value == $item.value) {
                      // this procedure is already on the list
                      return;
                    }
                  }
                  $scope.order.proceduresForSpecimen.push($item);
                }
            }

            /*removes a procedure from the list*/
            $scope.removeProcedure = function () {
              for (var i = 0; i < $scope.tempProcedures.length; ++i) {
                    for (var j = 0; j < $scope.order.proceduresForSpecimen.length; ++j) {
                        if ($scope.order.proceduresForSpecimen[j].value == $scope.tempProcedures[i].value) {
                            $scope.order.proceduresForSpecimen.splice(j, 1);
                            break;
                        }
                    }
              }

            };

            /* checks if you can submit the form*/
            /* UHM-6538 Not currently requiring these:
                    && ((typeof $scope.order.preLabDiagnosis === 'string' && $scope.order.preLabDiagnosis.length > 0) || ( typeof $scope.order.preLabDiagnosis === 'object' && $scope.order.preLabDiagnosis.value ))
                    && $scope.order.suspectedCancer.value
                    && $scope.order.clinicalHistoryForSpecimen.value
             */
            $scope.readyToSubmit = function () {
                return ( $scope.order.sampleDate.value
                    && ($scope.order.proceduresForSpecimen.length > 0
                    || ($scope.order.procedureNonCoded.value != null && $scope.order.procedureNonCoded.value.length > 0)));
            };


            /* cancels adding a test order*/
            $scope.handleCancelOrder = function () {
                if (returnUrl) {
                  $window.location.href = returnUrl;
                } else {
                  $window.history.go(-1);
                }
            };


            /*
             shows the saving modal box, while the data is being saved
             */
            function showSavingModal() {
                return $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'myModalContent.html',
                    size: 'sm'
                });
            }

          /*
           shows the loading modal box, while the data is being loaded
           */
          function showLoadingModal() {
            return $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              templateUrl: 'loadingModal.html',
              size: 'sm'
            });
          }

            /*
             * returns true/false whether the two dates are the same date (dropping time component)
             */
            function sameDate(date1, date2) {
                if (!date1 || !date2) {
                    return false;
                }

                var d1 = new Date(date1.getTime());
                var d2 = new Date(date2.getTime());

                d1.setHours(0,0,0,0);
                d2.setHours(0,0,0,0);

                return d1.getTime() == d2.getTime();
            }

            /*
             loads the system care settings
             */
           $scope.loadingModal = showLoadingModal();
            return LabTrackingDataService.loadLocations().then(function (respLocations) {
              if (respLocations.status.code == 200) {
                $scope.locations = respLocations.data;
              }
              return LabTrackingDataService.loadProviders().then(function (respProviders) {
                if (respProviders.status.code == 200) {
                  $scope.providers = respProviders.data;
                }
                return LabTrackingDataService.loadCareSettings().then(function (res) {
                  $scope.careSettings = res.data;
                  if ( orderUuid ) {
                    return $scope.loadOrder(orderUuid).then(function( respOrder ){
                      $scope.setDefaultProvider();
                      $scope.loadingModal.dismiss('cancel');
                      if ( respOrder.status.code !== 200 ) {
                        $scope.error = "failed to load the order: " + orderUuid;
                        $scope.debugInfo = respOrder;
                      }
                    });
                  }
                  $scope.setDefaultProvider();
                  $scope.loadingModal.dismiss('cancel');
                });
              });

            });
        }]);

