angular.module("labTrackingViewQueueController", [])
    .controller("viewQueueController", ['$scope', '$window', '$cookies', 'LabTrackingOrder', 'LabTrackingDataService', 'patientUuid', 'returnUrl',
        function ($scope, $window, $cookies, LabTrackingOrder, LabTrackingDataService, patientUuid, returnUrl) {
            $scope.cookieForFilter = "queue_filter";
            $scope.statusCodes = LabTrackingOrder.concepts.statusCodes;
            $scope.data_loading = true;
            $scope.selectedOrder = null;
            $scope.orderCancelReason = null;
            $scope.testOrderQueue = []; // hold the model
            $scope.errorMessage = null; // displays an error on the page if not null
            $scope.patientUuid = (patientUuid == null || patientUuid == 'null') ? null : patientUuid;
            $scope.is_cancel=false;  //used to determien which warning message to show
            $scope.is_purge=false;   //used to determien which warning message to show

            var fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - LabTrackingDataService.CONSTANTS.MONITOR_PAGE_DAYS_BACK);

            var savedFilter = $cookies.getObject($scope.cookieForFilter);

            if (savedFilter != null && returnUrl == 'internal') {
                $scope.filter = savedFilter;
                //we need to convert the dates strings to dates
                if ($scope.filter.from_date.value != null) {
                    $scope.filter.from_date.value = new Date($scope.filter.from_date.value);
                }

                if ($scope.filter.to_date.value != null) {
                    $scope.filter.to_date.value = new Date($scope.filter.to_date.value);
                }

            }
            else {
                $scope.filter = {
                    search: null, // the filter for the patient list
                    status: LabTrackingOrder.concepts.statusCodes[0],
                    patient: {uuid: null, name: null},
                    from_date: {opened: false, value: fromDate},
                    to_date: {opened: false, value: new Date()},
                    date_box: {
                        format: 'dd-MMM-yyyy',
                        options: {
                            dateDisabled: false,
                            formatYear: 'yy',
                            maxDate: new Date(),
                            minDate: new Date(2010, 1, 1),
                            startingDay: 1,
                            showWeeks: false
                        },
                        altInputFormats: ['M!/d!/yyyy']
                    },
                    paging: {
                        totalItems: 0,
                        currentPage: 1,
                        maxSize: LabTrackingDataService.CONSTANTS.MAX_QUEUE_SIZE,
                        currentEntryStart: 0,
                        currentEntryEnd: 0
                    }
                };
            }

            /*
             loads the queue from the openmrs web services
             */
            $scope.loadQueue = function () {
                $scope.data_loading = true;
                $scope.lastUpdatedAtInMillis = new Date().getTime();
                var pageNumber = $scope.filter.paging.currentPage;
                if (pageNumber == 0) {
                    //this happens when there is no data
                    pageNumber = 1;
                }
                var startDate = $scope.filter.from_date.value;
                startDate.setHours(0, 0, 0, 0);
                var endDate = $scope.filter.to_date.value;
                endDate.setHours(23, 59, 59, 999);
                var status = $scope.filter.status.value;
                var patientName = $scope.filter.patient.name;

                return LabTrackingDataService.loadQueue(pageNumber, startDate, endDate, status, $scope.patientUuid, patientName).then(function (resp) {
                    if (resp.status.code == 200) {
                        var cnt = resp.data.totalCount;
                        return LabTrackingDataService.loadSpecimenDetailsForQueue(resp.data.orders).then(function (resp2) {
                            $scope.testOrderQueue = resp2.data;
                            $scope.setPage(pageNumber, cnt);
                            $scope.data_loading = false;
                            //update your cookies
                            $cookies.putObject($scope.cookieForFilter, $scope.filter);
                        })
                    }
                    else {
                        $scope.errorMessage = resp.status.msg;
                    }
                    $scope.data_loading = false;

                });
            };

            /*download the pdf*/
            $scope.downloadPdf = function (order) {
                LabTrackingDataService.downloadPdf(order);
            };

            /*
             handles looking up the order details
             @param order - the order to view the details for
             @param type - the type of page to show either: speciment, results
             @return none, navigates to the order details page
             */
            $scope.handleDetails = function (order, type) {
                var url = "labtrackingOrderDetails.page?";
                url += "patientId=" + order.patient.value;
                url += "&orderUuid=" + order.uuid;
                url += "&returnUrl=" + encodeURI(LabTrackingDataService.getQueuePageUrl(patientUuid));
                url += "&pageType=" + type;
                $window.location.href = url;
            };

            /*
             handles printing an order
             @param order - the order to view the details for
             @return none, navigates to the order print page
             */
            $scope.handlePrint = function (order) {
                $window.open(LabTrackingDataService.getPrintPageUrl(order.uuid, order.patient.value), '_blank');
            };

            /*
             shows the cancel dialog
             @param order - the order to view the details for
             @return none
             */
            $scope.showCancelOrder = function (order, shouldPurge) {
                $scope.is_cancel=!shouldPurge;
                $scope.is_purge=shouldPurge;
                $scope.selectedOrder = order;
                $scope.shouldPurge = shouldPurge;
            };

            /*
             handles canceling an order
             @param order - the order to view the details for
             @return none
             */
            $scope.handleCancelOrder = function () {
                var order = $scope.selectedOrder;
                $scope.data_loading = true;
                LabTrackingDataService.cancelOrder(order.uuid, $scope.shouldPurge).then(function (res) {
                    if (res.status.code < 400) {
                        //if you canceled, then just reload the list
                        return $scope.loadQueue();
                    }
                    else {
                        alert("There was some sort of error");
                        console.log(res);
                    }
                    $scope.data_loading = false;
                    $scope.selectedOrder = null;
                    $scope.orderCancelReason = null;
                    $scope.setPage($scope.filter.paging.currentPage, $scope.testOrderQueue.length);
                })
            };

            /* dismisses the cancel dialog*/
            $scope.dismissCancelOrder = function () {
                $scope.selectedOrder = null;
                $scope.orderCancelReason = null;
            };

            $scope.handleToDate = function () {
                $scope.filter.to_date.opened = true;
            };

            $scope.handleFromDate = function () {
                $scope.filter.from_date.opened = true;
            };


            $scope.handleSearchChange = function (keyEvent) {
                if (keyEvent.which === 13)
                    $scope.handleFilterChange('patient');
            }
            /*
             this is called whenever the filter changes
             */
            $scope.handleFilterChange = function (filterSource) {
                if (filterSource == 'from_date' || filterSource == 'to_date'
                    || filterSource == 'status' || filterSource == 'patient') {
                    return $scope.loadQueue();
                }
            };

            $scope.setPage = function (pageNo, totalItems) {
                if (totalItems == 0) {
                    $scope.filter.paging.totalItems = 0;
                    $scope.filter.paging.currentPage = 0;
                    $scope.filter.paging.currentEntryStart = 0;
                    $scope.filter.paging.currentEntryEnd = 0;
                }
                else {
                    var sz = $scope.filter.paging.maxSize;
                    $scope.filter.paging.totalItems = totalItems;
                    $scope.filter.paging.currentPage = pageNo;
                    $scope.filter.paging.currentEntryStart = pageNo * sz - sz + 1;
                    $scope.filter.paging.currentEntryEnd = totalItems < pageNo * sz ? totalItems : pageNo * sz;

                }
            };

            $scope.pageChanged = function () {
                return $scope.loadQueue();
            };

            return $scope.loadQueue();
        }]);