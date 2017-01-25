angular.module("labTrackingViewQueueController", [])
    .controller("viewQueueController", ['$scope', '$window', 'LabTrackingOrder', 'LabTrackingDataService','patientUuid',
        function ($scope, $window, LabTrackingOrder, LabTrackingDataService, patientUuid) {
            $scope.statusCodes = LabTrackingOrder.concepts.statusCodes;
            $scope.data_loading = true;
            $scope.selectedOrder = null;
            $scope.orderCancelReason = null;
            $scope.testOrderQueue = []; // hold the model
            $scope.errorMessage = null; // displays an error on the page if not null
            $scope.patientUuid = (patientUuid == null || patientUuid == 'null')?null:patientUuid;
            var fromDate = new Date();
            fromDate.setDate(fromDate.getDate()-LabTrackingDataService.CONSTANTS.MONITOR_PAGE_DAYS_BACK);
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
                        return $scope.loadQueue();
                        //$scope.filter.paging.setPage($scope.filter.paging.currentPage, $scope.filter.paging.totalItems);
                    }
                }
            };
            /*
             loads the queue from the openmrs web services
             */
            $scope.loadQueue = function () {
                $scope.data_loading = true;
                $scope.lastUpdatedAtInMillis = new Date().getTime();
                var pageNumber = $scope.filter.paging.currentPage;
                var startDate = $scope.filter.from_date.value;
                startDate.setHours(0,0,0,0);
                var endDate = $scope.filter.to_date.value;
                endDate.setHours(23,59,59,999);
                var status = $scope.filter.status.value;
                var patientName = $scope.filter.patient.name;

                return LabTrackingDataService.loadQueue(pageNumber, startDate, endDate, status,  $scope.patientUuid, patientName).then(function (resp) {
                    if (resp.status.code == 200) {
                        var cnt = resp.data.totalCount;
                        return LabTrackingDataService.loadSpecimenDetailsForQueue(resp.data.orders).then(function(resp2){
                            $scope.testOrderQueue = resp2.data;
                            $scope.filter.paging.setPage(pageNumber, cnt);
                            $scope.data_loading = false;
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
             @return none, navigates to the order details page
             */
            $scope.handleDetails = function (order) {
                var url = "labtrackingOrderDetails.page?";
                url += "patientId=" + order.patient.value;
                url += "&orderUuid=" + order.uuid;
                url += "&returnUrl=" + encodeURI(LabTrackingDataService.getQueuePageUrl(patientUuid));
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
                LabTrackingDataService.cancelOrder(order.uuid, $scope.shouldPurge).then(function(res){
                    if(res.status.code < 400){
                        //if you canceled, then just reload the list
                        return $scope.loadQueue();
                    }
                    else{
                        alert("There was some sort of error");
                        console.log(res);
                    }
                    $scope.data_loading = false;
                    $scope.selectedOrder=null;
                    $scope.orderCancelReason=null;
                    $scope.filter.paging.setPage($scope.filter.paging.currentPage, $scope.testOrderQueue.length);
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
                if(filterSource == 'from_date' || filterSource == 'to_date'
                    || filterSource == 'status' || filterSource == 'patient' ){
                    return $scope.loadQueue();
                }
            };
            return $scope.loadQueue();
        }])
    .filter("testOrderFilter", function () {
        return function (items, filterData) {
            return items;
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