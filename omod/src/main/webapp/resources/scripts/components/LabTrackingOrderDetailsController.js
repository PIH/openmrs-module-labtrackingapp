angular.module("labTrackingOrderDetailsController", [])
    .controller("orderDetailsController", ['$scope', '$window', '$http','$uibModal','Upload',
        'LabTrackingOrder', 'LabTrackingDataService', 'Encounter', 'orderUuid',
        function ($scope, $window, $http, $uibModal, Upload,
                  LabTrackingOrder, LabTrackingDataService, Encounter, orderUuid) {
            // used to determine if we should disable things
            $scope.concepts = LabTrackingOrder.concepts;
            $scope.order = new LabTrackingOrder();
            $scope.errorMessage = null;
            $scope.providers = []; // the proviers in the system
            $scope.locations = []; //the locations in the system
            $scope.diagnoses = []; //the diagnoses in the system
            $scope.procedures = []; //the procedures in the system
            /*
            loads the queue from the openmrs web services
            */
            $scope.loadOrder = function (orderUuid) {
                $scope.lastUpdatedAtInMillis = new Date().getTime();

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

            /* save the specimen details*/
            $scope.saveSpecimenDetails = function () {
                $scope.savingModal = showSavingModal();
                return LabTrackingDataService.createOrUpdateOrderSpecimenEncounter($scope.order).then(function (resp) {
                    if (resp.status != 200) {
                        alert("Failed to save the specimen details");

                    }
                    $scope.savingModal.dismiss('cancel');
                    return resp;
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
                    templateUrl: 'saveSpecimenDetails.html',
                    size: 'sm'
                });


            };


            /*
             cancels the speciment details page and goes to the monitor page
             * */
            $scope.cancelSpecimenDetails = function () {
                $window.location.href = 'labtrackingViewQueue.page';
            };

            return $scope.loadOrder(orderUuid).then(function (resp) {
                return LabTrackingDataService.loadProviders().then(function (resp2) {
                    if (resp2.status.code == 200) {
                        $scope.providers = resp2.data;
                    }
                    return LabTrackingDataService.loadLocations().then(function (resp3) {
                        if (resp3.status.code == 200) {
                            $scope.locations = resp3.data;
                        }
                        return LabTrackingDataService.loadProcedures().then(function(res2){
                            $scope.procedures = res2.data;
                            return LabTrackingDataService.loadDiagnonses().then(function(res3){
                                $scope.diagnoses = res3.data;
                            })
                        })
                    });
                });
            });

        }])
    .directive('orderDebugPanel', function () {
        return {
            scope: {
                order: '=',
            },
            templateUrl: 'labtrackingOrderDetails-debug.page'
        };
    })
    .directive('orderDetailsPanel', function () {
        return {
            scope: {
                order: '=',
            },
            templateUrl: 'labtrackingOrderDetails-order.page'
        };
    })
    .directive('orderSpecimenPanel', function () {
        return {
            scope: {
                order: '=',
                providers: '=',
                locations: '=',
                procedures: '=',
                diagnoses: '=',
                concepts: '=',
            },
            templateUrl: 'labtrackingOrderDetails-specimen.page'
        };
    })
    .directive('orderResultsPanel', function () {
        return {
            scope: {
                order: '=',
            },
            controller: function ($scope, $http, Upload, Encounter, LabTrackingDataService, LabTrackingOrder) {
                $scope.dateBoxOptions = {
                    opened: false,
                    format: 'dd-MMM-yyyy',
                    options: {
                        dateDisabled: false,
                        formatYear: 'yy',
                        minDate: $scope.minDate,
                        maxDate: new Date(),
                        startingDay: 1,
                        showWeeks: false
                    },
                    altInputFormats: ['M!/d!/yyyy']
                };
                $scope.showResultsDateBox = function () {
                    //for some reason the value isn't binding, if it does, then you can remove this line
                    if( $scope.order.sampleDate.value == null){
                        $scope.dateBoxOptions.options.minDate = new Date();
                    }
                    else{
                        $scope.dateBoxOptions.options.minDate = $scope.order.sampleDate.value;
                    }
                    $scope.dateBoxOptions.opened = true;
                };

                $scope.downloadPdf = function () {
                    var fileName = "test.pdf";
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.style = "display: none";
                    var file = new Blob([$scope.order.fileData], {type: 'application/pdf'});
                    var fileURL = window.URL.createObjectURL(file);
                    a.href = fileURL;
                    a.download = fileName;
                    a.click();
                };

                $scope.uploadPdf = function(file) {
                    //see https://www.npmjs.com/package/ng-file-upload for docs
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function (e) {
                        dataUrl = e.target.result;
                        // var obs = {
                        //     person:$scope.order.patient.value,
                        //     obsDatetime: Encounter.toObsDate(new Date()),
                        //     concept:LabTrackingOrder.concepts.file.value,
                        //     value: dataUrl
                        // };

                        $scope.order.file.valueBase64 = dataUrl;

                        // return $http.post(LabTrackingDataService.CONSTANTS.URLS.UPLOAD_FILE, obs).then(function (resp) {
                        //     if (LabTrackingDataService.isOk(resp)){
                        //         alert("all set");
                        //         return {status: {code: resp.status, msg: null}, data: resp};
                        //     }
                        //     else {
                        //         $scope.errorMsg = response.status + ': ' + response.data.error.message;// + " : " + response.data.error.detail;
                        //         return {status: {code: resp.status, msg:$scope.errorMsg}, data: []};
                        //     }
                        //
                        // }, function (err) {
                        //     $scope.errorMsg = "Error uploading file " + err.status + ': ' + err.data.error.message + " : " + err.data.error.detail;
                        //     return {status: {code: 500, msg: $scope.errorMsg}, data: []};
                        // });

                    };

                    // file.upload.then(function (response) {
                    //     $timeout(function () {
                    //         file.result = response.data;
                    //     });
                    // }, function (response) {
                    //     if (response.status > 0)
                    //         $scope.errorMsg = response.status + ': ' + response.data.error.message;// + " : " + response.data.error.detail;
                    // }, function (evt) {
                    //     // Math.min is to fix IE which reports 200% sometimes
                    //     file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    // });
                }




            },
            templateUrl: 'labtrackingOrderDetails-results.page'
        };
    });

