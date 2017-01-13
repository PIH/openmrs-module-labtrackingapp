angular.module("labTrackingViewQueueController", [])
    .controller("viewQueueController", ['$scope', '$window', 'LabTrackingOrder', 'LabTrackingDataService',
        function ($scope, $window, LabTrackingOrder, LabTrackingDataService) {
            $scope.data_loading = true;
            $scope.selectedOrder = null;
            $scope.orderCancelReason = null;
            $scope.testOrderQueue = []; // hold the model
            $scope.errorMessage = null; // displays an error on the page if not null
            var fromDate = new Date();
            fromDate.setDate(fromDate.getDate()-LabTrackingDataService.CONSTANTS.MONITOR_PAGE_DAYS_BACK);
            $scope.filter = {
                search: null, // the filter for the patient list
                status: {value: null},
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
                    currentPage: 0,
                    maxSize: 10,
                    currentEntryStart:0,
                    currentEntryEnd:0,
                    setPage: function (pageNo, totalItems) {
                        if(totalItems == 0){
                            $scope.filter.paging.totalItems = 0;
                            $scope.filter.paging.currentPage = 0;
                            $scope.filter.paging.currentEntryStart = 0;
                            $scope.filter.paging.currentEntryEnd = 0;
                        }
                        else{
                            var sz = $scope.filter.paging.maxSize;
                            $scope.filter.paging.totalItems = totalItems;
                            $scope.filter.paging.currentPage = pageNo;
                            $scope.filter.paging.currentEntryStart = pageNo*sz - sz+1;
                            $scope.filter.paging.currentEntryEnd = totalItems<pageNo*sz?totalItems:pageNo*sz;

                        }
                    },
                    pageChanged: function () {
                        console.log('Page changed to: ' + $scope.filter.paging.currentPage);
                        $scope.filter.paging.setPage($scope.filter.paging.currentPage, $scope.filter.paging.totalItems);
                    }
                }
            };
            /*
             loads the queue from the openmrs web services
             */
            $scope.loadQueue = function () {
                $scope.lastUpdatedAtInMillis = new Date().getTime();
                var locationUuid = "";
                var patientUuid = "";
                return LabTrackingDataService.loadQueue(locationUuid, patientUuid).then(function (resp) {
                    if (resp.status.code == 200) {
                        $scope.testOrderQueue = resp.data;
                        $scope.filter.paging.setPage(1, resp.data.length);
                    }
                    else {
                        $scope.errorMessage = resp.status.msg;
                    }
                    $scope.data_loading = false;
                });
            };


            /*
             handles looking up the order details
             @param order - the order to view the details for
             @return none, navigates to the order details page
             */
            $scope.handleDetails = function (order) {
                console.log(order);
                $window.location.href = 'labtrackingOrderDetails.page?orderUuid=' + order.uuid;
            };

            /*
             handles printing an order
             @param order - the order to view the details for
             @return none, navigates to the order print page
             */
            $scope.handlePrint = function (order) {
                console.log(order);
                alert("TBD");
            };

            /*
             shows the cancel dialog
             @param order - the order to view the details for
             @return none
             */
            $scope.showCancelOrder = function (order) {
                $scope.selectedOrder = order;
            };

            /*
             handles canceling an order
             @param order - the order to view the details for
             @return none
             */
            $scope.handleCancelOrder = function () {
                var order = $scope.selectedOrder;
                $scope.data_loading = true;
                LabTrackingDataService.cancelOrder(order.uuid, $scope.orderCancelReason).then(function(res){
                    if(res.status.code == 200){
                        for(var i=0;i<$scope.testOrderQueue.length;++i){
                            if($scope.testOrderQueue[i].uuid == order.uuid){
                                $scope.testOrderQueue.splice(i, 1);
                                break;
                            }

                        }
                    }
                    else{
                        alert("There was some sort of error");
                        console.log(res);
                    }
                    $scope.data_loading = false;
                    $scope.selectedOrder=null;
                    $scope.orderCancelReason=null;
                })
            };

            /* dismisses the cancel dialog*/
            $scope.dismissCancelOrder = function(){
                $scope.selectedOrder=null;
                $scope.orderCancelReason=null;
            };

            $scope.handleToDate = function () {
                $scope.filter.to_date.opened = true;
            };

            $scope.handleFromDate = function () {
                $scope.filter.from_date.opened = true;
            };

            /*
             this is called whenever the filter changes
             */
            $scope.handleFilterChange = function (filterSource) {
                $scope.filter.search = {
                    requestDate: {
                        value: null
                    },
                    patient: {
                        name: $scope.filter.patient.name
                    }
                };
            };
            return $scope.loadQueue();
        }])
    .filter("testOrderFilter", function () {
        return function (items, filterData) {
            var df = filterData.from_date.value;
            if (df != null) {
                //set the date from to the beginning of the day
                df.setHours(0, 0, 0, 0);
                df = df.getTime();
            }
            else {
                df = 0
            }
            var dt = filterData.to_date.value;
            if (dt != null) {
                //set the date from to the beginning of the day
                dt.setHours(23, 59, 59, 999);

            }
            else {
                dt = new Date().getTime();
            }

            var arrayToReturn = [];
            for (var i = 0; i < items.length; i++) {
                var requestDate = items[i].requestDate.value.getTime();
                if (requestDate > df && requestDate < dt) {
                    //the dates match, now check the patient name
                    if (filterData.patient.name == null || items[i].patient.name.toLowerCase().indexOf(filterData.patient.name.toLowerCase()) > -1) {
                        //finally check the status
                        //TODO:  change the text to use the UUID's
                        if (filterData.status.value == null || filterData.status.value == 'All' || items[i].status.display == filterData.status.value) {
                            arrayToReturn.push(items[i]);
                        }

                    }

                }
                else {
                    console.log("dt=" + dt + " df=" + df + " requestDate=" + requestDate);
                }
            }

            var sz = arrayToReturn.length;
            if(sz > filterData.paging.maxSize-1){
                var pos1 = (filterData.paging.currentPage-1)*filterData.paging.maxSize;
                var pos2 = pos1 + filterData.paging.maxSize;
                if(pos2 > sz){
                    pos2 = sz;
                }
                arrayToReturn = arrayToReturn.slice(pos1, pos2);
            }

            filterData.paging.setPage(filterData.paging.currentPage, sz);

            return arrayToReturn;
        };
    });