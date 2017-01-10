${ ui.includeFragment("labtrackingapp", "libs") }
<%
    ui.decorateWith("appui", "standardEmrPage")

    ui.includeJavascript("labtrackingapp", "components/LabTrackingOrderDetailsController.js")
    ui.includeJavascript("labtrackingapp", "app_order_details.js")
%>

<script type="text/javascript" xmlns="http://www.w3.org/1999/html">
    var breadcrumbs = [
        {icon: "icon-home", link: '/' + OPENMRS_CONTEXT_PATH + '/index.htm'},
        {
            label: "${ ui.message("labtrackingapp.title") }", link: "${ ui.pageLink("labtrackingapp", "labtrackingViewQueue?appId=labtrackingapp.app.viewQueue") }"
        }

    ];
</script>

<div class="container" ng-app="labTrackingApp" ng-controller="orderDetailsController">
<input type="text" ng-model="selected" uib-typeahead="state for state in states | filter:${'$'}viewValue | limitTo:8" class="form-control">
  <div class="panel panel-primary" id="details_box">
    <div class="panel-heading">${ui.message("labtrackingapp.orderdetailstitle")} Patient ABC123</div>
    <div class="panel-body">
      <div class="panel-group">
        <order-details-panel order="order"></order-details-panel>
        <order-specimen-panel order="order" locations="locations" providers="providers" concepts="concepts" cancel-specimen-details="cancelSpecimenDetails()"></order-specimen-panel>
        <order-results-panel order="order" cancel-specimen-details="cancelSpecimenDetails()"></order-results-panel>
        <order-debug-panel order="order" providers="providers"></order-debug-panel>
      </div>
    </div>
  </div>
</div>

${ ui.includeFragment("labtrackingapp", "translations") }

<script type="text/javascript">
    angular.module('labTrackingApp')
            .value('patientDashboard', '')
            .value('orderUuid', '${ orderUuid }')
            .value('translations', translations);

    jq(function () {
        // make sure we reload the page if the location is changes; this custom event is emitted by by the location selector in the header
        jq(document).on('sessionLocationChanged', function () {
            window.location.reload();
        });
    });
</script>
