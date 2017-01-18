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
  <div class="panel panel-primary" id="details_box">
    <div class="panel-heading">${ui.message("labtrackingapp.orderdetailstitle")} Patient ABC123</div>
    <div class="panel-body">
      <div class="panel-group">
        <order-details-panel order="order"></order-details-panel>
        <order-specimen-panel order="order" locations="locations" providers="providers" procedures="procedures"
            diagnoses="diagnoses" concepts="concepts"></order-specimen-panel>
        <order-results-panel order="order"></order-results-panel>
      </div>
    </div>
  </div>
    <div class="row" >
        <div class="col-sm-12 text-right">
            <button type="button" class="btn btn-primary" ng-click="cancelSpecimenDetails()">${ui.message("uicommons.cancel")}</button>
            <button type="button" class="btn btn-default" ng-click="saveSpecimenDetails()">${ui.message("uicommons.save")}</button>
        </div>
    </div>
    <script type="text/ng-template" id="saveSpecimenDetails.html">
        <div class="modal-header">
            <h3 class="modal-title" id="modal-title">${ui.message("labtrackingapp.savingtitle")}</h3>
        </div>
        <div class="modal-body" id="modal-body">
            <img class="center-block"  src="${ ui.resourceLink("uicommons", "images/spinner.gif") }" />
        </div>
    </script>
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


