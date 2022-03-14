angular.module("labTrackingAddOrderController", [])
    .controller("addOrderController", ['$window', '$filter', '$uibModal', '$scope', 'LabTrackingOrder', 'LabTrackingDataService', 'patientUuid', 'visitUuid', 'visitStartDateTime', 'visitStopDateTime', 'serverDatetime', 'locationUuid', 'returnUrl',
        function ($window, $filter, $uibModal, $scope, LabTrackingOrder, LabTrackingDataService, patientUuid, visitUuid, visitStartDateTime, visitStopDateTime, serverDatetime, locationUuid, returnUrl) {
            $scope.savingModal = null; //this is a flag that lets us know we are in save mode, so that we can disable things
            $scope.procedures = []; //the list of procedures in the system
            $scope.selectedProcedures = []; //the list of procedures available, used to manage the UI state
            $scope.tempProcedures = [];  //the temp list of procedures that have been selected, used to manage the UI state
            $scope.careSettings = [];  //the list of care settings in the system
            $scope.diagnoses = []; // the oncology diagnoses in the system
            $scope.alldiagnoses = []; // all the diagnoses in the system
            $scope.order = new LabTrackingOrder(patientUuid, locationUuid, visitUuid);
            $scope.error = null; // when not null, this message will show on the screen
            $scope.debugInfo = null;  // for debugging
            $scope.locations = []; // clinical locations in the system
            $scope.providers = []; // the proviers in the system
            $scope.concepts = LabTrackingOrder.concepts;

            $scope.serverDatetime = new Date($filter('serverDate')(serverDatetime));  // we use the current Date from the server, not the client, to avoid problems if times aren't in sync
            $scope.visitStartDateTime = new Date( $filter('serverDate')(visitStartDateTime));
            if (visitStopDateTime) {
                $scope.visitStopDateTime = new Date( $filter('serverDate')(visitStopDateTime));
            }

            // if a single day visit, just set the model value to that date
            if (sameDate($scope.visitStartDateTime, $scope.visitStopDateTime)) {
                $scope.order.requestDate.value = $scope.visitStartDateTime;
            } // if not a single day visit, but an active visit, set request date to current date
            else if (!visitStopDateTime) {
                $scope.order.requestDate.value = $scope.serverDatetime;
            }

            $scope.requestDateBoxOptions = {
                opened: false,
                format: 'dd-MMM-yyyy',
                options: {
                    dateDisabled: false,
                    formatYear: 'yy',
                    minDate:  $scope.visitStartDateTime,
                    initDate:  $scope.visitStartDateTime,
                    maxDate: $scope.visitStopDateTime ? $scope.visitStopDateTime : $scope.serverDatetime,
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
                if ( $scope.order.requestDate.value < $scope.visitStartDateTime ) {
                    $scope.order.requestDate.value = $scope.visitStartDateTime;
                }
                else if ( $scope.visitStopDateTime && $scope.order.requestDate.value > $scope.visitStopDateTime ) {
                    $scope.order.requestDate.value = $scope.visitStopDateTime;
                }

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

            /* adds a procedures to the list*/
            $scope.addProcedure = function () {
                for (var i = 0; i < $scope.selectedProcedures.length; ++i) {
                    if ($scope.order.procedures.length > 2) {
                        //we only allow 3, so get out
                        return;
                    }
                    $scope.order.procedures.push($scope.selectedProcedures[i]);
                    for (var j = 0; j < $scope.procedures.length; ++j) {
                        if ($scope.procedures[j].value == $scope.selectedProcedures[i].value) {
                            $scope.procedures.splice(j, 1);
                            break;
                        }
                    }
                }
            };

            /*removes a procedure from the list*/
            $scope.removeProcedure = function () {
                for (var i = 0; i < $scope.tempProcedures.length; ++i) {
                    $scope.procedures.push($scope.tempProcedures[i]);
                    for (var j = 0; j < $scope.order.procedures.length; ++j) {
                        if ($scope.order.procedures[j].value == $scope.tempProcedures[i].value) {
                            $scope.order.procedures.splice(j, 1);
                            break;
                        }
                    }
                }

            };

            /* checks if you can submit the form*/
            $scope.readyToSubmit = function () {
                return ($scope.order.procedures.length > 0
                    || ($scope.order.procedureNonCoded.value != null && $scope.order.procedureNonCoded.value.length > 0));
            };


            /* cancels adding a test order*/
            $scope.handleCancelOrder = function () {
                $window.history.go(-1);
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
                  return LabTrackingDataService.loadProcedures().then(function (res2) {
                    $scope.procedures = res2.data;
                    return LabTrackingDataService.loadDiagnonses().then(function (res3) {
                      $scope.diagnoses = res3.data;
                      return LabTrackingDataService.loadHumDiagnoses().then(function (humDiagnoses) {
                        $scope.alldiagnoses = humDiagnoses;
                      });
                    });
                  });
                });
              });
            });
        }]);

