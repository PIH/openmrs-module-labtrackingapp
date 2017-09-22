angular.module("labTrackingAddOrderController", [])
    .controller("addOrderController", ['$window', '$filter', '$uibModal', '$scope', '$window', 'LabTrackingOrder', 'LabTrackingDataService', 'patientUuid', 'visitUuid', 'visitStartDateTime', 'visitStopDateTime', 'locationUuid', 'returnUrl',
        function ($window, $filter, $uibModal, $scope, $window, LabTrackingOrder, LabTrackingDataService, patientUuid, visitUuid, visitStartDateTime, visitStopDateTime, locationUuid, returnUrl) {
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

            $scope.visitStartDateTime = new Date( $filter('serverDate')(visitStartDateTime));
            $scope.visitSopDateTime = new Date();
            if (visitStopDateTime) {
                $scope.visitSopDateTime = new Date( $filter('serverDate')(visitStopDateTime));
            }

            $scope.requestDateBoxOptions = {
                opened: false,
                format: 'dd-MMM-yyyy',
                options: {
                    dateDisabled: false,
                    formatYear: 'yy',
                    minDate:  $scope.visitStartDateTime,
                    initDate:  $scope.visitStartDateTime,
                    maxDate: $scope.visitSopDateTime,
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
                } else if ( $scope.visitSopDateTime && $scope.order.requestDate.value > $scope.visitSopDateTime ) {
                    $scope.order.requestDate.value = $scope.visitSopDateTime;
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
                    || ($scope.order.procedureNonCoded.value != null && $scope.order.procedureNonCoded.value.length > 0))
                    && ($scope.order.preLabDiagnosis != null && $scope.order.preLabDiagnosis.value != null);
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
             loads the system care settings
             */
            return LabTrackingDataService.loadCareSettings().then(function (res) {
                $scope.careSettings = res.data;
                return LabTrackingDataService.loadProcedures().then(function (res2) {
                    $scope.procedures = res2.data;
                    return LabTrackingDataService.loadDiagnonses().then(function (res3) {
                        $scope.diagnoses = res3.data;
                        return LabTrackingDataService.loadHumDiagnoses().then(function(humDiagnoses){
                            $scope.alldiagnoses = humDiagnoses;
                        });
                    });
                });

            });
        }]);

