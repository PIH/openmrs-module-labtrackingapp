angular.module("labTrackingPrintController", [])
    .controller("printController", ['$scope', '$window', '$timeout', 'LabTrackingOrder', 'LabTrackingDataService', 'orderUuid',
        function ($scope, $window, $timeout, LabTrackingOrder, LabTrackingDataService, orderUuid) {
            $scope.order = null;
            $scope.concepts = LabTrackingOrder.concepts;
            /* loads the order on the page
             * @param {String} orderUuid - the order uuid
             * */
            $scope.loadOrder = function (orderUuid) {
                return LabTrackingDataService.loadOrder(orderUuid).then(function (resp) {
                    if (resp.status.code == 200) {
                        $scope.order = resp.data;

                    }
                    else {
                        $scope.errorMessage = resp.status.msg;
                    }
                    return resp;
                });
            };

            $scope.formatDiagnosis = function (diagnosis) {
              return diagnosis !== null &&  typeof diagnosis === 'object' ? diagnosis.label : diagnosis;
            }

            $scope.hasSpecimenCollection = function (order) {
              return order.specimenDetailsEncounter !== null && order.specimenDetailsEncounter.uuid !== null;
            }

            /* loads the order, creates the barcode, and then tells the window to print */
            return $scope.loadOrder(orderUuid).then(function () {

                // bar code generation library: http://lindell.me/JsBarcode/
                JsBarcode("#patient-id-barcode", $scope.order.patient.id);

                $timeout(function () {
                    $window.print()
                }, 500);
            });

        }]);

