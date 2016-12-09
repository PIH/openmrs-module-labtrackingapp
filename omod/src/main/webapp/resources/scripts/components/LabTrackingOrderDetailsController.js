angular.module("labTrackingOrderDetailsController", [])
    .controller("orderDetailsController", ['$scope', 'LabTrackingOrder',
        function ($scope, LabTrackingOrder) {
            // used to determine if we should disable things
            $scope.order = new LabTrackingOrder();

            $scope.foo = new Date();

        }])

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
            }])
        ;

