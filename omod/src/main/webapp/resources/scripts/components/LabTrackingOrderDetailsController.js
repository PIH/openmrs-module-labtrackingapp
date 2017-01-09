angular.module("labTrackingOrderDetailsController", [])
    .controller("orderDetailsController", ['$scope', '$window','LabTrackingOrder',  'LabTrackingDataService',
    'orderUuid',
        function ($scope, $window, LabTrackingOrder,LabTrackingDataService, orderUuid) {
            // used to determine if we should disable things
            $scope.concepts = LabTrackingOrder.concepts;

            $scope.order = new LabTrackingOrder();
            $scope.foo = new Date();
            $scope.errorMessage = null;
            $scope.providers = [];
            $scope.locations = [];
            $scope.simpleLocations = ['Alabama', 'Arkansas', 'Connecticut'];
            $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
            /*
            loads the queue from the openmrs web services
            */
            $scope.loadOrder= function(orderUuid){
                $scope.lastUpdatedAtInMillis = new Date().getTime();

                return LabTrackingDataService.loadOrder(orderUuid).then(function(resp){
                    if(resp.status.code == 200){
                        $scope.order = resp.data;
                    }
                    else{
                        $scope.errorMessage = resp.status.msg;
                    }

                    console.log(resp);
                    return resp;
                });
            };


            return $scope.loadOrder(orderUuid).then(function(resp){
                return LabTrackingDataService.loadProviders().then(function(resp2){
                    console.log(resp2);
                    if(resp2.status.code == 200){
                        $scope.providers = resp2.data;
                    }
                    return LabTrackingDataService.loadLocations().then(function(resp3){
                    if(resp3.status.code == 200){
                        for(var i=0;i < resp3.data.length;++i){
                            $scope.simpleLocations.push(resp3.data[i].display);
                        }
                        $scope.locations = resp3.data;
                    }
                    });
                });
            });

        }])
        .directive('orderDebugPanel', function() {
          return {
              scope: {
                  order: '=',
                  },
            templateUrl: 'labtrackingOrderDetails-debug.page'
            };
          })
        .directive('orderDetailsPanel', function() {
          return {
              scope: {
                  order: '=',
                  },
            templateUrl: 'labtrackingOrderDetails-order.page'
          };
        })
        .directive('orderSpecimenPanel', function() {
          return {
              scope: {
                  order: '=',
                  providers: '=',
                  locations: '=',
                  concepts: '='
                  },
            controller: function($scope, $window, LabTrackingDataService){

                /* save the specimen details*/
                $scope.saveSpecimenDetails = function(){
                    return LabTrackingDataService.createOrUpdateOrderSpecimenEncounter($scope.order);
                }

                /* save the specimen details*/
                $scope.cancelSpecimenDetails = function(){
                    $window.location.href ='labtrackingViewQueue.page';
                }
            },
            templateUrl: 'labtrackingOrderDetails-specimen.page'
          };
        })
        .directive('orderResultsPanel', function() {
          return {
              scope: {
                  order: '=',
                  },
            templateUrl: 'labtrackingOrderDetails-results.page'
          };
        })
        .directive("dateWithPopup", [ function() {
            return {
                restrict: 'E',
                scope: {
                    ngModel: '=',
                    minDate: '=',
                    maxDate: '='
                },
                controller: function($scope) {
                    $scope.now = new Date();
                    $scope.opened = false;
                    $scope.open = function(event) {
                        event.preventDefault();
                        event.stopPropagation();
                        $scope.opened = true;
                    }
                    $scope.options = { // for some reason setting this via attribute doesn't work
                        showWeeks: false
                    }
                },
                template: '<span class="angular-datepicker">' +
                            '<input type="text" is-open="opened" ng-model="ngModel" datepicker-popup="dd-MMM-yyyy" readonly ' +
                            'datepicker-options="options" min-date="minDate" max-date="maxDate" ng-click="open($event)"/>' +
                            '<i class="icon-calendar small add-on" ng-click="open($event)" ></i>' +
                            '</span>'
            }
        }]);

