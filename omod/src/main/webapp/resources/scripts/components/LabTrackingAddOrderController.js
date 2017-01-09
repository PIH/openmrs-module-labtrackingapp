angular.module("labTrackingAddOrderController", [])
    .controller("addOrderController", ['$window', '$uibModal','$scope', 'LabTrackingOrder', 'LabTrackingDataService', 'patientUuid', 'locationUuid',
        function ($window, $uibModal, $scope, LabTrackingOrder, LabTrackingDataService, patientUuid, locationUuid) {
            $scope.savingModal = null;
            $scope.concepts = LabTrackingOrder.concepts;
            $scope.order = new LabTrackingOrder(patientUuid, locationUuid);
            $scope.error = null; // when not null, this message will show on the screen
            $scope.debugInfo = null;  // for debugging
            $scope.handleSaveOrder = function () {
                $scope.savingModal = showSavingModal();
                return LabTrackingDataService.saveOrder($scope.order).then(function (res) {
                    if (LabTrackingDataService.isOk(res)) {
                        $window.location.href = 'labtrackingViewQueue.page';
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


            };

            /*
             loads the system care settings
             */
            return LabTrackingDataService.loadCareSettings().then(function (res) {
                $scope.careSettings = res.data;
            });
        }]);

