angular.module("labTrackingViewQueueController", [])
    .controller("viewQueueController", ['$scope', '$window', 'LabTrackingOrder', 'LabTrackingDataService',
        function ($scope, $window, LabTrackingOrder, LabTrackingDataService) {
            $scope.testOrderQueue = []; // hold the model
            $scope.errorMessage = null; // displays an error on the page if not null
            $scope.filter = {
                search: null, // the filter for the patient list
                status: {value:null},
                patient: {uuid:null, name:null},
                from_date: {opened: false, value:null},
                to_date: {opened: false, value:new Date()},
                date_box:{
                     format: 'dd-MMM-yyyy',
                     options:{
                        dateDisabled: false,
                        formatYear: 'yy',
                        maxDate: new Date(),
                        minDate: new Date(2010, 1, 1),
                        startingDay: 1,
                        showWeeks: false
                      },
                      altInputFormats : ['M!/d!/yyyy']
                  }
            }
            /*
            loads the queue from the openmrs web services
            */
            $scope.loadQueue = function(){
                $scope.lastUpdatedAtInMillis = new Date().getTime();
                var locationUuid = "";
                var patientUuid = "";
                return LabTrackingDataService.loadQueue(locationUuid, patientUuid).then(function(resp){
                    if(resp.status.code == 200){
                        $scope.testOrderQueue = resp.data;
                    }
                    else{
                        $scope.errorMessage = resp.status.msg;
                    }

                    console.log(resp);
                });
            };


            /*
            handles looking up the order details
            @param order - the order to view the details for
            @return none, navigates to the order details page
            */
            $scope.handleDetails = function(order){
                console.log(order);
                $window.location.href ='labtrackingOrderDetails.page?orderUuid=' + order.uuid;
            }

            /*
            handles printing an order
            @param order - the order to view the details for
            @return none, navigates to the order print page
            */
            $scope.handlePrint = function(order){
                console.log(order);
                alert("TBD") ;
            }

            /*
            handles canceling an order
            @param order - the order to view the details for
            @return none
            */
            $scope.handleCancel = function(order){
                console.log(order);
                alert("TBD") ;
            }

            $scope.handleToDate = function(){
                $scope.filter.to_date.opened = true;
            }

            $scope.handleFromDate = function(){
                $scope.filter.from_date.opened = true;
            }

            /*
                this is called whenever the filter changes
            */
            $scope.handleFilterChange = function(filterSource){
                $scope.filter.search = {
                    requestDate:{
                        value:null
                    },
                    patient:{
                        name:$scope.filter.patient.name
                    }
                };
            }
            return $scope.loadQueue();
        }])
        .filter("testOrderFilter", function() {
          return function(items, filterData) {
                var df = filterData.from_date.value;
                if(df != null){
                    //set the date from to the beginning of the day
                    df.setHours(0,0,0,0);
                    df = df.getTime();
                }
                else{
                    df = 0
                }
                var dt = filterData.to_date.value;
                if(dt != null){
                    //set the date from to the beginning of the day
                    dt.setHours(23,59,59,999);

                }
                else{
                    dt = new Date().getTime();
                }

                var arrayToReturn = [];
                for (var i=0; i<items.length; i++){
                    var requestDate = items[i].requestDate.value.getTime();
                    if (requestDate > df && requestDate < dt)  {
                        //the dates match, now check the patient name
                        if(filterData.patient.name == null || items[i].patient.name.toLowerCase().indexOf(filterData.patient.name.toLowerCase()) > -1){
                            //finally check the status
                            //TODO:  change the text to use the UUID's
                            if(filterData.status.value == null || filterData.status.value == 'All' || items[i].status.display == filterData.status.value){
                                 arrayToReturn.push(items[i]);
                            }

                        }

                    }
                    else{
                        console.log("dt=" + dt + " df=" + df + " requestDate=" + requestDate);
                    }
                }

                return arrayToReturn;
          };
        });;