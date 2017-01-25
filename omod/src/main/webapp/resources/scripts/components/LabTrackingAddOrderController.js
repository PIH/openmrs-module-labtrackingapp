angular.module("labTrackingAddOrderController", [])
    .controller("addOrderController", ['$window', '$uibModal', '$scope', '$window', 'LabTrackingOrder', 'LabTrackingDataService', 'patientUuid', 'locationUuid', 'returnUrl',
        function ($window, $uibModal, $scope, $window, LabTrackingOrder, LabTrackingDataService, patientUuid, locationUuid, returnUrl) {
            $scope.savingModal = null; //this is a flag that lets us know we are in save mode, so that we can disable things
            $scope.procedures = []; //the list of procedures in the system
            $scope.selectedProcedures = []; //the list of procedures available, used to manage the UI state
            $scope.tempProcedures = [];  //the temp list of procedures that have been selected, used to manage the UI state
            $scope.careSettings = [];  //the list of care settings in the system
            $scope.diagnoses = []; // the diagnosis in the system
            $scope.concepts = LabTrackingOrder.concepts;
            $scope.order = new LabTrackingOrder(patientUuid, locationUuid);
            $scope.error = null; // when not null, this message will show on the screen
            $scope.debugInfo = null;  // for debugging

            /* saves an order*/
            $scope.handleSaveOrder = function () {
                $scope.savingModal = showSavingModal();
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
            $scope.addProcedure = function(){
                for(var i=0;i<$scope.selectedProcedures.length;++i){
                    if($scope.order.procedures.length > 2){
                        //we only allow 3, so get out
                        return;
                    }
                    $scope.order.procedures.push($scope.selectedProcedures[i]);
                    for(var j=0;j<$scope.procedures.length;++j){
                        if($scope.procedures[j].value == $scope.selectedProcedures[i].value){
                            $scope.procedures.splice(j, 1);
                            break;
                        }
                    }
                }
            };

            /*removes a procedure from the list*/
            $scope.removeProcedure = function(){
                for(var i=0;i<$scope.tempProcedures.length;++i){
                    $scope.procedures.push($scope.tempProcedures[i]);
                    for(var j=0;j<$scope.order.procedures.length;++j){
                        if($scope.order.procedures[j].value == $scope.tempProcedures[i].value){
                            $scope.order.procedures.splice(j, 1);
                            break;
                        }
                    }
                }

            };

            /* checkes if you can submit the form*/
            $scope.readyToSubmit = function(){
                return $scope.order.procedures.length > 0 && $scope.order.preLabDiagnosis != null && $scope.order.preLabDiagnosis.value != null;
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
                    })
                })

            });
        }]);

